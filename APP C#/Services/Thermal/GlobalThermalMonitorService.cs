using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Management;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Thermal.Models;
using LibreHardwareMonitor.Hardware;

namespace VoltrisOptimizer.Services.Thermal
{
    /// <summary>
    /// Serviço global de monitoramento térmico
    /// Monitora temperatura 24/7 com proteção contra sensores travados e fallback responsivo
    /// </summary>
    public class GlobalThermalMonitorService : IGlobalThermalMonitorService
    {
        private readonly ILoggingService _logger;
        private readonly SettingsService _settingsService;
        private readonly Computer _computer;
        
        private CancellationTokenSource? _monitoringCts;
        private Task? _monitoringTask;
        private DateTime _lastAlertTime = DateTime.MinValue;
        private DateTime _alertsSuppressedUntil = DateTime.MinValue;
        
        // CORREÇÃO PERFORMANCE: Intervalos aumentados para reduzir CPU do app.
        // Leitura de sensores via LibreHardwareMonitor é cara (acessa drivers de hardware).
        // 5s é suficiente para detectar throttling térmico — temperatura não muda em ms.
        // Em idle, 15s é mais que suficiente.
        private const int MonitoringIntervalMs     = 5000;  // 5s ativo (era 2s)
        private const int MonitoringIntervalIdleMs = 15000; // 15s idle (era 5s)
        private const int AlertCooldownMinutes = 30;
        private const int IdleThresholdMinutes = 3; // Idle após 3min sem atividade
        
        private DateTime _lastUserActivity = DateTime.Now;
        private bool _isSystemIdle = false;
        
        // Detecção de Sensores Travados
        private double _lastCpuSensorValue = -1;
        private int _stuckSensorCount = 0;
        private const int MaxStuckIterations = 100; // ~2 minutos travado para considerar falha REAL (evita falsos positivos em idle)
        private bool _forceFallback = false;
        private bool _isResetting = false;
        private bool _wasEstimatedLastCycle = false; // Controle para log de transição estimado↔real

        // Cache para Random
        private readonly Random _jitterRandom = new Random();
        
        public event EventHandler<ThermalMetrics>? MetricsUpdated;
        public event EventHandler<ThermalAlert>? AlertGenerated;
        
        public ThermalMetrics? CurrentMetrics { get; private set; }
        public bool IsMonitoring => _monitoringTask != null && !_monitoringTask.IsCompleted;

        public GlobalThermalMonitorService(ILoggingService logger, SettingsService settingsService)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _settingsService = settingsService ?? throw new ArgumentNullException(nameof(settingsService));
            
            // Inicializar LibreHardwareMonitor com TODAS as opções relevantes
            _computer = new Computer
            {
                IsCpuEnabled = true,
                IsGpuEnabled = true,
                IsMemoryEnabled = true, 
                IsMotherboardEnabled = true, // Essencial para sensores ACPI/Nuvoton
                IsControllerEnabled = true,  // Essencial para Super I/O
                IsNetworkEnabled = false,
                IsStorageEnabled = true      // Alguns SSDs reportam temperatura ambiente do sistema
            };
            
            try
            {
                _computer.Open();
                // Forçar atualização inicial de todos os sensores para garantir
                // que o LibreHardwareMonitor carregue os drivers e descubra os sensores
                // antes da primeira leitura (evita modo ESTIMADO no primeiro ciclo)
                foreach (var hw in _computer.Hardware)
                {
                    hw.Update();
                    foreach (var sub in hw.SubHardware) sub.Update();
                }
                _logger.LogSuccess("[GlobalThermal] LibreHardwareMonitor inicializado com sucesso (Full Scan)");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[GlobalThermal] Erro ao inicializar LibreHardwareMonitor: {ex.Message}", ex);
            }
            
            InitializePerformanceCounters(); // Lazy — só cria o counter se o fallback de temperatura for ativado
            
            if (_settingsService != null)
                _settingsService.ProfileChanged += OnProfileChanged;
        }
        
        private void InitializePerformanceCounters()
        {
            // Método mantido por compatibilidade — PerformanceCounter de CPU foi removido.
            // CPU% agora vem do SystemMetricsCache (GetSystemTimes, compartilhado por todos os serviços).
        }
        
        private void OnProfileChanged(object? sender, IntelligentProfileType newProfile)
        {
            _logger.LogInfo($"[GlobalThermal] Perfil mudou para {newProfile}");
        }

        public async Task StartMonitoringAsync()
        {
            if (IsMonitoring) return;

            _logger.LogInfo("[GlobalThermal] 🌡️ Iniciando monitoramento térmico (Modo Híbrido)...");
            
            _monitoringCts = new CancellationTokenSource();
            _monitoringTask = Task.Run(() => MonitoringLoopAsync(_monitoringCts.Token));
            
            await Task.Delay(100); 
            _logger.LogSuccess("[GlobalThermal] ✅ Monitoramento térmico ativo");
        }

        public async Task StopMonitoringAsync()
        {
            if (!IsMonitoring) return;
            _monitoringCts?.Cancel();
            if (_monitoringTask != null) 
            {
                try { await _monitoringTask; } catch {}
            }
            _monitoringCts?.Dispose();
            _monitoringCts = null;
            _monitoringTask = null;
        }

        private async Task MonitoringLoopAsync(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                try
                {
                    var metrics = await CollectThermalMetricsAsync();
                    
                    if (metrics.IsValid)
                    {
                        CurrentMetrics = metrics;
                        MetricsUpdated?.Invoke(this, metrics);
                        await AnalyzeAndAlertAsync(metrics, cancellationToken);
                    }
                    
                    // CORREÇÃO ENTERPRISE: Sleep Mode Inteligente
                    // Detectar idle e reduzir frequência de polling
                    UpdateIdleStatus();
                    int interval = _isSystemIdle ? MonitoringIntervalIdleMs : MonitoringIntervalMs;
                    
                    await Task.Delay(interval, cancellationToken);
                }
                catch (OperationCanceledException) { break; }
                catch (Exception ex)
                {
                    _logger.LogError($"[GlobalThermal] Erro no loop: {ex.Message}", ex);
                    await Task.Delay(5000, cancellationToken);
                }
            }
        }
        
        /// <summary>
        /// Detecta se sistema está idle para reduzir polling.
        /// Usa a temperatura da CPU como proxy de carga — evita PerformanceCounter duplicado.
        /// </summary>
        private void UpdateIdleStatus()
        {
            try
            {
                // Usa SystemMetricsCache como fonte de verdade para idle detection.
                // LastInputMs = ms desde o último input do usuário (teclado/mouse).
                // Mais preciso que usar temperatura como proxy de carga.
                var metrics = Core.SystemMetricsCache.Instance;
                bool recentInput = metrics.LastInputMs < (IdleThresholdMinutes * 60 * 1000);
                bool lowCpu      = metrics.CpuPercent < 20.0;

                if (recentInput || !lowCpu)
                {
                    _lastUserActivity = DateTime.Now;
                    _isSystemIdle = false;
                }
                else
                {
                    _isSystemIdle = (DateTime.Now - _lastUserActivity).TotalMinutes >= IdleThresholdMinutes;
                }
            }
            catch
            {
                _isSystemIdle = false;
            }
        }

        private async Task<ThermalMetrics> CollectThermalMetricsAsync()
        {
            return await Task.Run(() =>
            {
                var metrics = new ThermalMetrics();
                
                try
                {
                    UpdateHardwareSensors();

                    double rawCpuTemp = double.NaN;

                    // 1. Tentar ler CPU Real
                    if (!_forceFallback)
                    {
                        rawCpuTemp = GetCpuTemperatureFromSensors();
                    }

                    // 2. Validação de Sensor Travado (Stickiness Detection)
                    if (!_forceFallback && !double.IsNaN(rawCpuTemp) && rawCpuTemp > 0)
                    {
                        // Se a mudança for menor que 0.5C (muito estável)
                        if (Math.Abs(rawCpuTemp - _lastCpuSensorValue) < 0.5)
                        {
                            _stuckSensorCount++;
                            // Se ficar > 60 segundos travado no mesmo valor exato
                            if (_stuckSensorCount > MaxStuckIterations)
                            {
                                _forceFallback = true;
                                _logger.LogWarning($"[GlobalThermal] ⚠️ Sensor travado detectado ({rawCpuTemp:F1}). Ativando Modo Estimado e agendando auto-reset...");
                                
                                // Tentar resetar o hardware em background (Enterprise Resilience)
                                _ = ResetHardwareConnectionAsync();
                            }
                        }
                        else
                        {
                            // Reset se o valor mudou
                            _stuckSensorCount = 0;
                            _lastCpuSensorValue = rawCpuTemp;
                        }
                        
                    // PROFISSIONAL: Sem micro-jitter — valor real do sensor é o que importa
                    // Se o valor for idêntico ao anterior, mantemos como está (sensor estável = normal em idle)

                        metrics.CpuTemperature = rawCpuTemp;
                    }
                    else
                    {
                        metrics.CpuTemperature = double.NaN;
                    }

                    // 3. Fallback ou Estimativa (Se NaN ou Forçado)
                    if (_forceFallback || double.IsNaN(metrics.CpuTemperature) || metrics.CpuTemperature <= 0)
                    {
                        // Logar apenas na primeira vez que entra em modo estimado para não poluir o log
                        if (!_wasEstimatedLastCycle)
                        {
                            string reason = _forceFallback
                                ? $"sensor travado por {_stuckSensorCount} ciclos"
                                : "nenhum sensor de temperatura de CPU encontrado pelo LibreHardwareMonitor";
                            _logger.LogWarning($"[GlobalThermal] ⚠️ Entrando em modo ESTIMADO: {reason}. " +
                                               $"Causa provável: driver WinRing0/LibreHardwareMonitor requer execução como Administrador " +
                                               $"e acesso ao driver de kernel (WinRing0x64.sys). " +
                                               $"Temperaturas exibidas na UI são ESTIMADAS — não reais.");
                            _wasEstimatedLastCycle = true;
                        }
                        double fallbackTemp = GetCpuTemperatureFallback();
                        metrics.CpuTemperature = fallbackTemp;
                        metrics.IsCpuTemperatureEstimated = true;
                    }
                    else if (_wasEstimatedLastCycle)
                    {
                        // Saiu do modo estimado — logar recuperação
                        _logger.LogSuccess($"[GlobalThermal] ✅ Sensor de temperatura REAL recuperado: {metrics.CpuTemperature:F1}°C");
                        _wasEstimatedLastCycle = false;
                    }

                    // 4. GPU e Outros
                    metrics.GpuTemperature = GetGpuTemperatureFromSensors();
                    
                    if (double.IsNaN(metrics.GpuTemperature) && !double.IsNaN(metrics.CpuTemperature) && metrics.CpuTemperature > 0)
                    {
                        // Fallback: Assumir iGPU (Integrada) que segue temperatura da CPU com pequeno offset
                        // Evita logs "NaN" e mantém funcionalidade básica de monitoramento
                        metrics.GpuTemperature = Math.Max(30, metrics.CpuTemperature - 2.5);
                        metrics.IsGpuTemperatureEstimated = true;
                    }
                    else
                    {
                        metrics.IsGpuTemperatureEstimated = false;
                    }
                    metrics.CpuThrottling = metrics.CpuTemperature > 95;
                    metrics.GpuThrottling = !double.IsNaN(metrics.GpuTemperature) && metrics.GpuTemperature > 95;
                    metrics.Timestamp = DateTime.Now;
                }
                catch (Exception ex)
                {
                     // _logger.LogError($"[GlobalThermal] Falha: {ex.Message}");
                }

                return metrics;
            });
        }

        private async Task ResetHardwareConnectionAsync()
        {
            if (_isResetting) return;
            _isResetting = true;
            
            try
            {
                _logger.LogInfo("[GlobalThermal] 🔄 Tentando auto-reset do driver de monitoramento...");
                
                await Task.Run(() => {
                    lock (_computer)
                    {
                        try { _computer.Close(); } catch {}
                        Thread.Sleep(500); // Cooldown
                        try { _computer.Open(); } catch {}
                    }
                });

                _stuckSensorCount = 0;
                _forceFallback = false;
                _logger.LogSuccess("[GlobalThermal] ✅ Reset de hardware concluído. Tentando retomar leitura real.");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[GlobalThermal] ❌ Falha no auto-reset: {ex.Message}");
            }
            finally {
                _isResetting = false;
            }
        }

        private void UpdateHardwareSensors()
        {
            try
            {
                foreach (var hardware in _computer.Hardware)
                {
                    // Atualizar CPU, GPU e Motherboard/SuperIO.
                    // Motherboard é necessário como fallback de temperatura de CPU em sistemas
                    // onde o sensor Package não está disponível diretamente no hardware CPU.
                    // Storage é ignorado pois não contribui para métricas térmicas do sistema.
                    if (hardware.HardwareType == HardwareType.Storage) continue;

                    hardware.Update();
                    foreach (var sub in hardware.SubHardware) sub.Update();
                }
            }
            catch {}
        }

        private double GetCpuTemperatureFromSensors()
        {
            try
            {
                // PRIORIDADE 1: Hardware do tipo CPU (Sempre o mais dinâmico)
                var cpuHardware = _computer.Hardware.FirstOrDefault(h => h.HardwareType == HardwareType.Cpu);
                if (cpuHardware != null)
                {
                    var temp = FindTemperatureSensor(cpuHardware);
                    if (temp.HasValue && temp.Value > 0) return temp.Value;

                    foreach (var sub in cpuHardware.SubHardware)
                    {
                        temp = FindTemperatureSensor(sub);
                        if (temp.HasValue && temp.Value > 0) return temp.Value;
                    }
                }

                // PRIORIDADE 2: Motherboard/SuperIO como Fallback
                foreach (var hardware in _computer.Hardware)
                {
                    if (hardware.HardwareType != HardwareType.Motherboard &&
                        hardware.HardwareType != HardwareType.SuperIO) continue;

                    var temp = FindTemperatureSensor(hardware);
                    if (temp.HasValue && temp.Value > 0) return temp.Value;
                }
            }
            catch {}
            return double.NaN;
        }

        private double GetGpuTemperatureFromSensors()
        {
            try
            {
                foreach (var hardware in _computer.Hardware)
                {
                    if (!hardware.HardwareType.ToString().Contains("Gpu")) continue;

                    var temp = FindTemperatureSensor(hardware);
                    if (temp.HasValue) return temp.Value;
                    
                     foreach (var sub in hardware.SubHardware)
                    {
                        temp = FindTemperatureSensor(sub);
                        if (temp.HasValue) return temp.Value;
                    }
                }
            }
            catch {}
            return double.NaN;
        }

        private double? FindTemperatureSensor(IHardware hardware)
        {
            var sensors = hardware.Sensors.Where(s => s.SensorType == SensorType.Temperature && s.Value.HasValue).ToList();
            if (!sensors.Any()) return null;

            _logger.LogTrace($"[GlobalThermal] Buscando sensor térmico em '{hardware.Name}'. Candidatos: {string.Join(", ", sensors.Select(s => $"{s.Name}({s.Value:F0}°C)"))}");

            // Prioridade: Package > Tctl/Tdie (AMD) > Core > GPU Core
            var bestSensor = sensors.FirstOrDefault(s => 
                s.Name.Contains("Package", StringComparison.OrdinalIgnoreCase) ||
                s.Name.Contains("Tctl", StringComparison.OrdinalIgnoreCase) ||
                s.Name.Contains("Tdie", StringComparison.OrdinalIgnoreCase) ||
                s.Name.Contains("Core Max", StringComparison.OrdinalIgnoreCase) ||
                s.Name.Contains("Core (Average)", StringComparison.OrdinalIgnoreCase) ||
                s.Name.Contains("Hot Spot", StringComparison.OrdinalIgnoreCase));

            if (bestSensor != null && IsValidTemp(bestSensor.Value)) 
            {
                _logger.LogTrace($"[GlobalThermal] ✅ Sensor ótimo encontrado em {hardware.Name}: {bestSensor.Name}");
                return bestSensor.Value;
            }

            var fallbackSensor = sensors.FirstOrDefault(s => IsValidTemp(s.Value));
            if (fallbackSensor != null) 
            {
                _logger.LogTrace($"[GlobalThermal] ⚠️ Usando sensor secundário em {hardware.Name}: {fallbackSensor.Name}");
                return fallbackSensor.Value;
            }

            return null;
        }

        private bool IsValidTemp(float? temp)
        {
            return temp.HasValue && temp.Value > 0 && temp.Value < 125;
        }

        private double GetCpuTemperatureFallback()
        {
            // Usa SystemMetricsCache — elimina o PerformanceCounter duplicado neste serviço.
            // O cache já coleta CPU% via GetSystemTimes a cada 2s, compartilhado por todos.
            float cpuUsage = (float)Core.SystemMetricsCache.Instance.CpuPercent;
            if (cpuUsage <= 0) cpuUsage = 15.0f; // fallback se cache ainda não inicializou

            double loadFactor = Math.Pow(cpuUsage / 100.0, 1.3) * 42.0;
            double estimated = Math.Min(38.0 + loadFactor, 80.0);
            
            return estimated;
        }

        private async Task AnalyzeAndAlertAsync(ThermalMetrics metrics, CancellationToken cancellationToken)
        {
            if (DateTime.Now < _alertsSuppressedUntil) return;
            if ((DateTime.Now - _lastAlertTime).TotalMinutes < AlertCooldownMinutes) return;

            var activeProfile = _settingsService.Settings.IntelligentProfile;
            var thresholds = ThermalThresholds.GetForProfile(activeProfile);

            bool alertNeeded = false;
            string component = "";
            double temp = 0;
            ThermalAlertLevel level = ThermalAlertLevel.Warning;

            // CORREÇÃO CRÍTICA: Temperaturas ESTIMADAS não devem disparar alertas críticos.
            // A estimativa é baseada em uso de CPU e pode ser muito imprecisa no boot
            // (quando o próprio Voltris está inicializando e usando 80-90% de CPU).
            // Alertas críticos só devem ser disparados com leituras REAIS de sensor.
            if (!metrics.IsCpuTemperatureEstimated && metrics.CpuTemperature > thresholds.CpuCriticalThreshold)
            { 
                alertNeeded = true; component = "CPU"; temp = metrics.CpuTemperature; level = ThermalAlertLevel.Critical; 
            }
            else if (metrics.IsCpuTemperatureEstimated && metrics.CpuTemperature > thresholds.CpuCriticalThreshold)
            {
                // Temperatura estimada acima do limite — logar como aviso mas NÃO disparar alerta crítico
                // que ativa throttle. Throttle com temperatura estimada causa lentidão desnecessária.
                _logger.LogInfo($"[GlobalThermal] ℹ Temperatura ESTIMADA={metrics.CpuTemperature:F1}°C acima do limite ({thresholds.CpuCriticalThreshold:F0}°C) — ignorando (sensor real não disponível).");
            }

            // CORREÇÃO PROBLEMA #3: Ajuste automático de perfil quando temperatura > 90°C
            // Sugerir perfil mais conservador para reduzir temperatura
            if (!metrics.IsCpuTemperatureEstimated && metrics.CpuTemperature > 90.0 && activeProfile == IntelligentProfileType.GamerCompetitive)
            {
                _logger.LogWarning($"[GlobalThermal] Temperatura elevada ({metrics.CpuTemperature:F1}°C) detectada em perfil agressivo");
                _logger.LogInfo("[GlobalThermal] Recomendação: Considere usar perfil 'Balanceado' para reduzir temperatura");
                
                // Nota: Não alteramos automaticamente o perfil para respeitar escolha do usuário
                // Apenas logamos recomendação que pode ser exibida na UI
            }

            if (alertNeeded)
            {
                _lastAlertTime = DateTime.Now;
                var alert = new ThermalAlert 
                { 
                    Level = level, 
                    Component = component, 
                    Temperature = temp,
                    Message = $"Temperatura {component} elevada: {temp:F0}°C",
                    Recommendation = level == ThermalAlertLevel.Critical 
                        ? "⚠ Verifique refrigeração e feche apps pesados" 
                        : "ℹ Verifique ventilação do sistema"
                };
                AlertGenerated?.Invoke(this, alert);
                _logger.LogWarning($"[GlobalThermal] Alerta: {alert.Message}");
            }
        }

        public async Task<ThermalMetrics> GetCurrentMetricsAsync()
        {
            if (CurrentMetrics != null && (DateTime.Now - CurrentMetrics.Timestamp).TotalSeconds < 5) return CurrentMetrics;
            return await CollectThermalMetricsAsync();
        }

        public void SuppressAlertsFor(TimeSpan duration) => _alertsSuppressedUntil = DateTime.Now.Add(duration);
        public void Dispose()
        {
            if (_settingsService != null) _settingsService.ProfileChanged -= OnProfileChanged;
            StopMonitoringAsync().Wait();
            try { _computer?.Close(); } catch {}
        }
    }
}
