using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Management;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services.Gamer.GamerModeManager;
using VoltrisOptimizer.Services.Gamer.Intelligence.Interfaces;

using System.Linq;
using VoltrisOptimizer.Services.Gamer.Intelligence.Models;
using VoltrisOptimizer.Services.Gamer.Intelligence.Telemetry;
using VoltrisOptimizer.Services.Gamer.Overlay.Helpers;
 
namespace VoltrisOptimizer.Services.Gamer.Intelligence.Implementation
{
    public class HardwareStateSnapshot
    {
        public int Epp { get; set; }
        public int Pl1 { get; set; }
        public int MinPerf { get; set; }
        public int MaxPerf { get; set; }
        public int CoreParking { get; set; }
        public int IncreaseThreshold { get; set; }
        public int DecreaseThreshold { get; set; }
        public int InterruptSteering { get; set; }
        public uint TimerResolution { get; set; }
    }

    public class AdaptiveHardwareEngineService : IAdaptiveHardwareEngine, IDisposable
    {
        private readonly ILoggingService _logger;
        private readonly IThermalMonitorService _thermalMonitor;
        private readonly IEngineTelemetryFacade _telemetry;
        
        private CancellationTokenSource? _engineCts;
        private bool _isRunning;
        private bool _isLaptop;
        private string _cpuVendor = "Unknown";
        private int? _activeGameProcessId;
        private bool _affinityPinned;
        private Process? _targetProcess;
        private FpsReader? _fpsReader;
        
        // Safety / Watchdog state
        private DateTime _lastAdjustment;
        private int _plActiveCycles;
        private int _throttleActiveCycles;
        private string _gameClassification = "Analyzing...";
        private double _cpuUsage;
        private double _gpuUsage;
        
        // Limits & Caps
        private int _currentPl1 = 65;
        private int _currentEpp = 0;
        private int _baseTdp = 65;
        private double _maxSafeTemp = 95.0;
        
        // Hysteresis & Oscillation Guard
        private int _adjustmentCooldownSeconds = 30; // CORREÇÃO: 5s → 30s para reduzir overhead
        private double _jitterEMA = 0;
        private const double EMA_Alpha = 0.4; // Peso para amostras recentes
        private double _lastCpuTemp = 0;
        private DateTime _lastAffinityChange = DateTime.MinValue;
        private int _currentIncreaseThreshold = -1;
        private int _currentDecreaseThreshold = -1;
        private int _currentMinPerf = -1;
        private int _currentCoreParking = -1;

        // GUIDs Adicionais para Governança Dinâmica (Subgrupo Processador)
        private const string GUID_INCREASE_THRESHOLD = "06cadf0e-64ed-447a-9351-97ea83bccf3a";
        private const string GUID_DECREASE_THRESHOLD = "12a0ba44-0128-4ad0-b3bd-96f01f373027";
        private const string GUID_INTERRUPT_STEERING = "2bfc2419-5e4d-4a32-8b5d-27c233182189";
        private const string GUID_PROCESSOR_SUBGROUP = "54533251-82be-4824-96c1-47b60b740d00";
        private const string GUID_MIN_PERF = "893dee8e-2bef-41e0-89c6-b55d0929964c";
        private const string GUID_MAX_PERF = "bc5038f7-23e0-4960-96da-33abaf5935ec";
        private const string GUID_CORE_PARKING = "0cc5b647-c1df-4637-891a-dec35c318583";

        // Original States (Snapshot)
        private HardwareStateSnapshot? _systemSnapshot;

        // P/Invoke para Snapshot Efetivo (Runtime)
        [DllImport("powrprof.dll", CharSet = CharSet.Unicode)]
        private static extern uint PowerReadACValueIndex(IntPtr RootPowerKey, ref Guid SchemeGuid, ref Guid SubGroupGuid, ref Guid SettingGuid, out uint AcValueIndex);

        // Extensões
        private readonly IFrameTimeOptimizer? _frameOptimizer;
        private readonly IProcessOptimizationService? _processService;

        public bool IsRunning => _isRunning;

        public AdaptiveHardwareEngineService(
            ILoggingService logger, 
            IThermalMonitorService thermalMonitor,
            IEngineTelemetryFacade telemetry,
            IFrameTimeOptimizer? frameOptimizer = null,
            IProcessOptimizationService? processService = null)
        {
            _logger = logger;
            _thermalMonitor = thermalMonitor;
            _telemetry = telemetry;
            _frameOptimizer = frameOptimizer;
            _processService = processService;
            DetectEnvironment();
        }

        private void DetectEnvironment()
        {
            try
            {
                // Detect Laptop vs Desktop
                using var enclosureSearcher = new ManagementObjectSearcher("SELECT * FROM Win32_SystemEnclosure");
                foreach (ManagementObject obj in enclosureSearcher.Get())
                {
                    var types = (ushort[]?)obj["ChassisTypes"];
                    if (types != null)
                    {
                        foreach(var t in types)
                            if (t == 8 || t == 9 || t == 10 || t == 14) _isLaptop = true;
                    }
                }

                // Detect CPU Vendor
                using var cpuSearcher = new ManagementObjectSearcher("SELECT Name FROM Win32_Processor");
                foreach (ManagementObject obj in cpuSearcher.Get())
                {
                    var name = obj["Name"]?.ToString()?.ToLowerInvariant() ?? "";
                    if (name.Contains("intel")) _cpuVendor = "Intel";
                    else if (name.Contains("amd")) _cpuVendor = "AMD";
                }

                // Adaptar TDP Baseado na densidade de Cores para Laptops apenas
                int logicalCores = Environment.ProcessorCount;
                
                if (!_isLaptop)
                {
                    // NÃO CHUTAR TDP DE DESKTOPS!
                    // Fixar para 0 significa "Desativado" / Deixar o controle 100% com a placa mãe (BIOS).
                    _baseTdp = 0; 
                }
                else
                {
                    if (logicalCores >= 16) _baseTdp = 55;
                    else if (logicalCores >= 12) _baseTdp = 45;
                    else _baseTdp = 35;
                }

                _currentPl1 = _baseTdp;

                _logger.LogInfo($"[AdaptiveEngine] Ambiente Detectado: {(_isLaptop ? "Notebook" : "Desktop")} | CPU: {_cpuVendor} ({logicalCores} threads) | PL1 OS Control: {(_isLaptop ? "Enabled" : "Disabled")}");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[AdaptiveEngine] Erro na detecção de ambiente: {ex.Message}");
            }
        }

        public Task StartEngineAsync(int? gameProcessId = null, CancellationToken cancellationToken = default)
        {
            if (_isRunning) return Task.CompletedTask;
            
            _logger.LogInfo("=================================================");
            _logger.LogSuccess("🧠 INICIANDO ORQUESTRADOR DE PERFORMANCE ADAPTATIVO (SSoT)");
            _logger.LogInfo("=================================================");
            
            _telemetry.StartSession("AdaptiveSession");
             
            CaptureSystemSnapshot();

            // Tenta elevar a descoberta do processo real (evitar launchers)
            _activeGameProcessId = FindRealGameProcess(gameProcessId);
            _affinityPinned = false;
            _engineCts = new CancellationTokenSource();
            _isRunning = true;
            _plActiveCycles = 0;
            _throttleActiveCycles = 0;
            _lastAdjustment = DateTime.MinValue;

            if (_activeGameProcessId.HasValue)
            {
                try { _targetProcess = Process.GetProcessById(_activeGameProcessId.Value); } catch { }
            }

            // CORREÇÃO: Timer Resolution removido - Ultimate Performance já usa 1ms
            // 0.5ms causava scheduler thrashing e DPC latency spikes
            // uint currentRes = 0;
            // var resStatus = NtSetTimerResolution(5000, true, ref currentRes); 
            _logger.LogInfo("[AdaptiveEngine] ⏱️ Timer Resolution: Usando padrão do sistema (1ms via Ultimate Performance)");

            // Iniciar CPU Unparking e Min/Max Perf Controls
            ApplyAdvancedCpuStates(true);

            // Governança de Prioridades (Background e Game)
            if (_processService != null)
            {
                _processService.LowerBackgroundPriorities();
                if (_activeGameProcessId.HasValue)
                {
                    _processService.SetProcessPriority(_activeGameProcessId.Value, ProcessPriorityLevel.High);
                }
            }

            // Iniciar Task principal destacada
            _fpsReader = _targetProcess != null ? new FpsReader(_targetProcess, _logger) : null;
            _fpsReader?.StartMonitoring();

            _ = Task.Run(() => EngineLoopAsync(_engineCts.Token), cancellationToken);

            return Task.CompletedTask;
        }

        private int? FindRealGameProcess(int? providedId)
        {
            if (!providedId.HasValue || providedId.Value <= 0) return null;
            try
            {
                var proc = Process.GetProcessById(providedId.Value);
                
                // Lista estendida de Launchers conhecidos
                string[] launchers = { "Ubisoft", "Steam", "Launcher", "EpicGames", "Battle.net", "Origin", "EADesktop", "GalaxyClient", "RiotClient" };
                
                bool isLauncher = launchers.Any(l => proc.ProcessName.Contains(l, StringComparison.OrdinalIgnoreCase));
                
                // Se for um processo leve (< 400MB) e tiver nome de launcher, busca o processo real (pesado)
                if (isLauncher || proc.WorkingSet64 < 400 * 1024 * 1024)
                {
                    _logger.LogInfo($"[AdaptiveEngine] 🔍 Processo {proc.ProcessName} (PID {proc.Id}) identificado como potencial launcher. Buscando jogo real...");
                    
                    // Busca processos pesados (> 500MB) que surgiram recentemente ou são filhos
                    var potentialGames = Process.GetProcesses()
                        .Where(p => {
                            try { 
                                // É um processo pesado?
                                if (p.WorkingSet64 < 500 * 1024 * 1024) return false;
                                
                                // É filho deste launcher?
                                if (GetParentId(p) == proc.Id) return true;
                                
                                // Ou tem nome similar e está ativo?
                                return false; 
                            } catch { return false; }
                        })
                        .OrderByDescending(p => p.WorkingSet64)
                        .ToList();

                    if (potentialGames.Any())
                    {
                        var realGame = potentialGames.First();
                        _logger.LogSuccess($"[AdaptiveEngine] 🎯 Jogo real encontrado: {realGame.ProcessName} (PID: {realGame.Id}, RAM: {realGame.WorkingSet64/1024/1024}MB)");
                        return realGame.Id;
                    }
                }
                return providedId;
            }
            catch { return providedId; }
        }

        private int GetParentId(Process process)
        {
            try { return (int)new System.Management.ManagementObject($@"Win32_Process.Handle='{process.Id}'")["ParentProcessId"]; }
            catch { return -1; }
        }

        public Task StopEngineAsync(CancellationToken cancellationToken = default)
        {
            if (!_isRunning) return Task.CompletedTask;

            _isRunning = false;
            _engineCts?.Cancel();
            _engineCts?.Dispose();
            _engineCts = null;

            // CORREÇÃO: Timer Resolution não é mais modificado
            // uint currentRes = 0;
            // NtSetTimerResolution(5000, false, ref currentRes);

            // Reverte CPU States
            ApplyAdvancedCpuStates(false);

            // Restaura Prioridades de Background
            _processService?.RestoreBackgroundPriorities();
            if (_activeGameProcessId.HasValue)
            {
                _processService?.RestoreProcessPriority(_activeGameProcessId.Value);
            }

            // Restaurar Fallback state
            RestoreFallbackState();

            _logger.LogInfo("=================================================");
            _logger.LogSuccess("🛑 ENGINE ADAPTATIVA INTELIGENTE DESATIVADA");
            _logger.LogInfo("=================================================");
            
            var report = _telemetry.EndSession();
            _logger.LogInfo($"[Telemetry] Session Summary: {report.GameName} | Duration: {report.Duration.TotalMinutes:F1} min | Avg Temp: {report.AvgTemp:F1}°C");

            return Task.CompletedTask;
        }

        private async Task EngineLoopAsync(CancellationToken ct)
        {
            while (!ct.IsCancellationRequested)
            {
                try
                {
                    // 1. Obter Métricas e Validar Sensores
                    var metrics = await _thermalMonitor.GetMetricsAsync(ct);
                    double cpuTemp = _thermalMonitor.GetCpuTemperature();
                    
                    // Validação de Sensor Bug (Range 20C-110C)
                    if (cpuTemp < 20 || cpuTemp > 110) cpuTemp = _lastCpuTemp > 0 ? _lastCpuTemp : 50;

                    double gpuTemp = _thermalMonitor.GetGpuTemperature();
                    _cpuUsage = _thermalMonitor.GetCpuUsage();
                    _gpuUsage = _thermalMonitor.GetGpuUsage();
                    bool cpuThrottling = _thermalMonitor.IsCpuThrottling();
                    
                    // 2. EMA de Frametime e Predictive Cooling (Delta Temp)
                    UpdateEmaJitter();
                    double deltaTemp = cpuTemp - _lastCpuTemp;
                    _lastCpuTemp = cpuTemp;

                    // 4. Segurança Absoluta (Hard Caps + Predictive)
                    if (cpuTemp >= _maxSafeTemp || (cpuTemp > 88 && deltaTemp > 2.5)) 
                    {
                        EmergencyThrottle();
                        await Task.Delay(3000, ct); 
                        continue;
                    }

                    // Prevenir alterações excessivas (Oscillation Guard)
                    if ((DateTime.Now - _lastAdjustment).TotalSeconds < _adjustmentCooldownSeconds)
                    {
                        await Task.Delay(1000, ct);
                        continue;
                    }

                    // 3. Engine Adaptativa - Lógica Determinística (Variável Única por Ciclo)
                    bool adjusted = false;

                    // PRIORIDADE 1: Proteção Térmica (Histerese)
                    if (cpuThrottling || cpuTemp > 93) 
                    {
                        _throttleActiveCycles++;
                        if (_throttleActiveCycles >= 2) 
                        {
                            ApplyThermalThrottleScenario();
                            adjusted = true;
                        }
                    }
                    else if (cpuTemp < 85) _throttleActiveCycles = 0;

                    // PRIORIDADE 2: GPU Bottleneck (Energy Shifting)
                    if (!adjusted && _gpuUsage >= 92 && _cpuUsage < 55)
                    {
                        ApplyGpuBottleneckScenario();
                        adjusted = true;
                    }

                    // PRIORIDADE 3: CPU Bottleneck (Turbo Boost Adaptativo)
                    if (!adjusted && _cpuUsage >= 88 && _gpuUsage < 75)
                    {
                        ApplyCpuBottleneckScenario(cpuTemp);
                        adjusted = true;
                    }

                    // PRIORIDADE 4: Estabilidade de Latência (Governança Dinâmica de Thresholds)
                    if (!adjusted && (_jitterEMA > 6.0 || _gameClassification == "CPU-Bound"))
                    {
                        ApplyPerformanceRampScenario();
                        adjusted = true;
                    }
                    else if (!adjusted && cpuTemp < 75 && _jitterEMA < 3.0)
                    {
                        // Relaxar thresholds se o sistema estiver frio e estável para poupar energia
                        ApplyEfficientEngineScenario();
                    }

                    // 4. Classificação Dinâmica (apenas para telemetria)
                    _gameClassification = ClassifyGameBound(_cpuUsage, _gpuUsage, metrics.RamUsagePercent, _jitterEMA);
                    
                    // CORREÇÃO: Afinidade dinâmica removida - causa cache thrashing
                    // Afinidade é definida UMA VEZ no início e mantida estável
                    // if (_gameClassification == "CPU-Bound" && !_affinityPinned && 
                    //     (DateTime.Now - _lastAffinityChange).TotalSeconds > 60 &&
                    //     _activeGameProcessId.HasValue && _processService != null)
                    // {
                    //     _processService.PinToPhysicalCores(_activeGameProcessId.Value);
                    //     _affinityPinned = true;
                    //     _lastAffinityChange = DateTime.Now;
                    //     _logger.LogInfo("[AdaptiveEngine] 🧵 Afinidade PINNED (CPU-Bound detectado)");
                    // }
                    // else if (_gameClassification != "CPU-Bound" && _affinityPinned && 
                    //          (DateTime.Now - _lastAffinityChange).TotalSeconds > 60 &&
                    //          _activeGameProcessId.HasValue && _processService != null)
                    // {
                    //     _processService.SetProcessAffinityAllCores(_activeGameProcessId.Value);
                    //     _affinityPinned = false;
                    //     _lastAffinityChange = DateTime.Now;
                    //     _logger.LogInfo("[AdaptiveEngine] 🧵 Afinidade UNPINNED (Carga distribuída)");
                    // }

                    if (adjusted)
                    {
                        var reason = GetAdjustmentReason(cpuThrottling, cpuTemp, _gpuUsage, _cpuUsage, _jitterEMA);
                        _lastAdjustmentReason = (GetActionForTelemetry(), reason);
                        _logger.LogInfo($"[AdaptiveEngine] 🧠 DECISÃO: {reason} | Jitter EMA: {_jitterEMA:F2}ms | ΔTemp: {deltaTemp:F1}C/s");
                    }
                    else
                    {
                        _lastAdjustmentReason = ("Monitoring", "System Stable");
                    }

                    // 5. Mitigação de Recursos (apenas monitoramento crítico)
                    HandleResourceMitigation(metrics, _jitterEMA, ct);

                    // 6. Atualizar Telemetria
                    UpdateEngineTelemetry(metrics, cpuTemp, deltaTemp);

                    // CORREÇÃO: Reforço de prioridade removido - causa scheduler reschedule
                    // Prioridade é definida UMA VEZ no início e mantida pelo Windows
                    // if (_activeGameProcessId.HasValue && _processService != null)
                    // {
                    //      _processService.SetProcessPriority(_activeGameProcessId.Value, ProcessPriorityLevel.High);
                    // }

                    // CORREÇÃO: Intervalo aumentado de 1s para 5s para reduzir overhead
                    await Task.Delay(5000, ct); 
                }
                catch (TaskCanceledException) { break; }
                catch (Exception ex)
                {
                    _logger.LogError($"[AdaptiveEngine] Erro no loop de inteligência: {ex.Message}");
                    await Task.Delay(5000, ct);
                }
            }
        }

        private void EmergencyThrottle()
        {
            _logger.LogWarning("[AdaptiveEngine] 🚨 HARD CAP TÉRMICO ATINGIDO (>95C)!");
            
            // CORREÇÃO: Apenas EPP para emergência térmica
            // PL1 removido - deixar BIOS/firmware gerenciar
            // int emergencyPl = Math.Max(_baseTdp - 15, 12);
            // AdjustPowerLimit(emergencyPl);
            
            AdjustEpp(Math.Max(_systemSnapshot?.Epp ?? 50, 66)); // Modo eficiência forçado
            _lastAdjustmentReason = ("Emergency Throttle via EPP", "Hard Thermal Cap (>95C) - Hardware manages PL1");
            _lastAdjustment = DateTime.Now;
        }

        private void UpdateEmaJitter()
        {
            if (_frameOptimizer == null) return;
            double currentJitter = _frameOptimizer.CurrentMetrics.JitterMs;
            if (_jitterEMA == 0) _jitterEMA = currentJitter;
            else _jitterEMA = (EMA_Alpha * currentJitter) + ((1 - EMA_Alpha) * _jitterEMA);
        }

        private async void HandleResourceMitigation(HardwareMetrics metrics, double jitter, CancellationToken ct)
        {
            // CORREÇÃO: Mitigação de recursos simplificada - apenas monitoramento
            // ClearStandbyRam() causava page faults e stalls de 50-200ms
            
            // Separar VRAM de RAM (apenas log, sem ajustes)
            if (metrics.GpuVramTotal > 0 && (metrics.GpuVramUsed / (double)metrics.GpuVramTotal) > 0.96)
            {
                _logger.LogWarning("[AdaptiveEngine] VRAM Saturation detectada! Monitorando...");
                // AdjustEpp(25); // REMOVIDO - causa conflito com Ultimate Performance
            }

            if (metrics.RamUsagePercent > 88 && jitter > 8.0)
            {
                _logger.LogWarning($"[AdaptiveEngine] RAM Pressure ({metrics.RamUsagePercent:F1}%) + Jitter ({jitter:F1}ms) detectados. Monitorando...");
                // CORREÇÃO: ClearStandbyRam() REMOVIDO - causava page faults massivos
                // ClearStandbyRam();
                // await Task.Delay(10000, ct); 
            }
        }

        private void CaptureSystemSnapshot()
        {
            try
            {
                _systemSnapshot = new HardwareStateSnapshot();
                // Snapshot Híbrido: Tenta ler runtime index real (powertop API behavior)
                _systemSnapshot.Pl1 = GetEffectivePowerValue("be337238-0d82-4146-a960-4f3749d470c7", _baseTdp);
                _systemSnapshot.Epp = GetEffectivePowerValue("36687f9e-e3a5-4dbf-b1dc-15eb381c6863", 50);
                _systemSnapshot.MinPerf = GetEffectivePowerValue(GUID_MIN_PERF, 5);
                _systemSnapshot.MaxPerf = GetEffectivePowerValue(GUID_MAX_PERF, 100);
                _systemSnapshot.CoreParking = GetEffectivePowerValue(GUID_CORE_PARKING, 100);
                _systemSnapshot.IncreaseThreshold = GetEffectivePowerValue(GUID_INCREASE_THRESHOLD, 30);
                _systemSnapshot.DecreaseThreshold = GetEffectivePowerValue(GUID_DECREASE_THRESHOLD, 15);
                _systemSnapshot.InterruptSteering = GetEffectivePowerValue(GUID_INTERRUPT_STEERING, 0);
                
                _logger.LogInfo("[AdaptiveEngine] 🔒 Snapshot do sistema capturado (Estado Efetivo).");
                
                // Validação de sanidade: PL1 não pode ser 0W A MENOS QUE DEVA SER GERENCIADO PELA BIOS (Desktop / Unlimited)
                if (_systemSnapshot.Pl1 <= 0 && _isLaptop) _systemSnapshot.Pl1 = _baseTdp;
                if (_systemSnapshot.Epp < 0) _systemSnapshot.Epp = 50;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[AdaptiveEngine] Falha ao capturar snapshot: {ex.Message}");
            }
        }

        [DllImport("powrprof.dll")]
        private static extern uint PowerGetActiveScheme(IntPtr UserRootPowerKey, out IntPtr ActivePolicyGuid);

        [DllImport("powrprof.dll", CharSet = CharSet.Unicode)]
        private static extern uint PowerReadDCValueIndex(IntPtr RootPowerKey, ref Guid SchemeGuid, ref Guid SubGroupGuid, ref Guid SettingGuid, out uint DcValueIndex);

        private int GetEffectivePowerValue(string guid, int defaultValue)
        {
            try
            {
                Guid activeScheme;
                PowerGetActiveScheme(IntPtr.Zero, out IntPtr activeGuidPtr);
                activeScheme = Marshal.PtrToStructure<Guid>(activeGuidPtr);
                Marshal.FreeCoTaskMem(activeGuidPtr);

                Guid subGroup = new Guid(GUID_PROCESSOR_SUBGROUP);
                Guid setting = new Guid(guid);
                
                uint acValue;
                uint res = PowerReadACValueIndex(IntPtr.Zero, ref activeScheme, ref subGroup, ref setting, out acValue);
                
                if (res == 0) return (int)acValue;

                // Tenta DC se o AC falhar ou for zero em alguns perfis
                uint dcValue;
                PowerReadDCValueIndex(IntPtr.Zero, ref activeScheme, ref subGroup, ref setting, out dcValue);
                if (dcValue > 0) return (int)dcValue;

                // Fallback Registry com Caminho Universal (B - braced format)
                string path = $@"SYSTEM\CurrentControlSet\Control\Power\User\PowerSchemes\{activeScheme:B}\54533251-82be-4824-96c1-47b60b740d00\{setting:B}";
                using var key = Registry.LocalMachine.OpenSubKey(path.Replace("{", "").Replace("}", ""), false);
                var val = key?.GetValue("ACSettingIndex") ?? key?.GetValue("DCSettingIndex");
                
                if (val != null) return Convert.ToInt32(val);

                return defaultValue;
            }
            catch { return defaultValue; }
        }

        private void ApplyThermalThrottleScenario()
        {
            // CORREÇÃO: Logging detalhado para diagnóstico
            _logger.LogWarning($"[AdaptiveEngine] 🔥 Thermal Throttling persistente detectado:");
            _logger.LogInfo($"  ├─ Ciclos de throttle: {_throttleActiveCycles}");
            _logger.LogInfo($"  ├─ Temperatura CPU: {_lastCpuTemp:F1}°C");
            _logger.LogInfo($"  └─ Ação: Ajustar EPP para 33% (Modo performance controlada)");
            
            // Apenas EPP para controle térmico
            AdjustEpp(33); // Modo performance controlada
            
            _logger.LogSuccess($"[AdaptiveEngine] ✅ Controle térmico aplicado via EPP");
            
            // PL1 dinâmico removido - deixar BIOS/firmware gerenciar
            _lastAdjustmentReason = ("Thermal Control via EPP", "Persistent Thermal Throttling - Hardware manages PL1");
            _lastAdjustment = DateTime.Now;
        }

        private void ApplyGpuBottleneckScenario()
        {
            // CORREÇÃO: Logging detalhado para diagnóstico
            _logger.LogInfo($"[AdaptiveEngine] 🎮 GPU Bottleneck detectado:");
            _logger.LogInfo($"  ├─ GPU Usage: {_gpuUsage:F1}%");
            _logger.LogInfo($"  ├─ CPU Usage: {_cpuUsage:F1}%");
            _logger.LogInfo($"  └─ Ação: Relaxar CPU (EPP 50%) para liberar orçamento térmico/energético para GPU");
            
            // Relaxa a CPU pra sobrar orçamento térmico/energético pra GPU
            AdjustEpp(50);
            
            _logger.LogSuccess($"[AdaptiveEngine] ✅ Energy shift aplicado para GPU");
            
            // PL1 dinâmico removido para laptops - causa instabilidade
            _lastAdjustmentReason = ("Energy Shift to GPU", "GPU Bottleneck detected");
            _lastAdjustment = DateTime.Now;
        }

        private void ApplyCpuBottleneckScenario(double currentCpuTemp)
        {
            // CORREÇÃO: Logging detalhado para diagnóstico
            _logger.LogInfo($"[AdaptiveEngine] 🎯 CPU Bottleneck detectado:");
            _logger.LogInfo($"  ├─ CPU Usage: {_cpuUsage:F1}%");
            _logger.LogInfo($"  ├─ GPU Usage: {_gpuUsage:F1}%");
            _logger.LogInfo($"  ├─ Temperatura: {currentCpuTemp:F1}°C");
            _logger.LogInfo($"  ├─ Headroom: {(_maxSafeTemp - currentCpuTemp):F1}°C");
            _logger.LogInfo($"  └─ Ação: Ajustar EPP para 0% (Max Performance)");
            
            // Apenas EPP para máxima performance
            AdjustEpp(0); 
            
            _logger.LogSuccess($"[AdaptiveEngine] ✅ EPP ajustado para máxima performance");
            
            // PL1 dinâmico removido completamente - deixar BIOS/firmware gerenciar
            _lastAdjustmentReason = ("Max Performance EPP", "CPU Bottleneck - Hardware manages PL1");
            _lastAdjustment = DateTime.Now;
        }

        // CORREÇÃO: ClearStandbyRam() REMOVIDO COMPLETAMENTE
        // Causava page faults massivos e stalls de 50-200ms
        // Windows gerencia memória de forma mais eficiente sem intervenção
        // private void ClearStandbyRam()
        // {
        //     try
        //     {
        //         foreach (Process process in Process.GetProcesses())
        //         {
        //             try
        //             {
        //                 if (process.PriorityClass == ProcessPriorityClass.Normal ||
        //                     process.PriorityClass == ProcessPriorityClass.BelowNormal ||
        //                     process.PriorityClass == ProcessPriorityClass.Idle)
        //                 {
        //                     EmptyWorkingSet(process.Handle);
        //                 }
        //             }
        //             catch { }
        //         }
        //     }
        //     catch { }
        // }

        private void ApplyAdvancedCpuStates(bool engageGamer)
        {
            if (_systemSnapshot == null) return;

            if (engageGamer)
            {
                // CORREÇÃO: Aplicar configurações iniciais em batch
                // Unpark cores e definir EPP máximo UMA VEZ no início
                AdjustCoreParking(100);
                AdjustEpp(0); // Max Perf State (EPP 0)
                // AdjustMinPerf(5); // REMOVIDO - Ultimate já define 100%
                
                // Aplicar todas as configurações de uma vez
                ApplyPowerConfigBatch();
                _logger.LogInfo("[AdaptiveEngine] Advanced CPU States (Start) Lock APPLIED - Usando Ultimate Performance como base.");
            }
            else
            {
                // CORREÇÃO: Restore em batch para evitar múltiplos resets
                AdjustCoreParking(_systemSnapshot.CoreParking);
                AdjustEpp(_systemSnapshot.Epp);
                // AdjustMinPerf(_systemSnapshot.MinPerf); // REMOVIDO
                // AdjustProcessorThresholds(_systemSnapshot.IncreaseThreshold, _systemSnapshot.DecreaseThreshold); // REMOVIDO
                RunPowercfg($"/setacvalueindex SCHEME_CURRENT {GUID_PROCESSOR_SUBGROUP} {GUID_MAX_PERF} {_systemSnapshot.MaxPerf}");
                RunPowercfg($"/setacvalueindex SCHEME_CURRENT {GUID_PROCESSOR_SUBGROUP} {GUID_INTERRUPT_STEERING} {_systemSnapshot.InterruptSteering}");
                
                // Aplicar restore em batch
                RunPowercfg("/setactive SCHEME_CURRENT");
                _logger.LogInfo("[AdaptiveEngine] Advanced CPU States RESTORED from snapshot.");
            }
        }

        private void ApplyPerformanceRampScenario()
        {
            // CORREÇÃO: Reduzido para apenas EPP - Ultimate já controla thresholds
            // AdjustProcessorThresholds(10, 90); // REMOVIDO - causa scheduler thrashing
            AdjustEpp(0); // Forçar clock scheduling ultra rápido
            // AdjustMinPerf(20); // REMOVIDO - Ultimate já define 100%
            // AdjustCoreParking(100); // REMOVIDO - Ultimate já define 100%
            _lastAdjustmentReason = ("Performance Ramp", "Latency stability / CPU-Bound demand");
            _lastAdjustment = DateTime.Now;
        }

        private void ApplyEfficientEngineScenario()
        {
            // CORREÇÃO: Cenário eficiente removido - conflita com Ultimate Performance
            // Ultimate Performance é projetado para máxima performance, não eficiência
            // AdjustProcessorThresholds(30, 15); // REMOVIDO
            // AdjustMinPerf(5); // REMOVIDO
            // _lastAdjustmentReason = ("Efficient Engine", "System cool and stable");
            // _lastAdjustment = DateTime.Now;
            
            // Manter apenas log para telemetria
            _logger.LogInfo("[AdaptiveEngine] Sistema estável e frio - mantendo configuração atual");
        }

        // CORREÇÃO: AdjustProcessorThresholds DESABILITADO
        // Ultimate Performance já define thresholds agressivos (10/90)
        // Mudanças constantes causam scheduler thrashing e P-State oscillation
        private void AdjustProcessorThresholds(int increase, int decrease)
        {
            // DESABILITADO - Ultimate Performance já controla
            // if (increase == _currentIncreaseThreshold && decrease == _currentDecreaseThreshold) return;
            // 
            // RunPowercfg($"/setacvalueindex SCHEME_CURRENT {GUID_PROCESSOR_SUBGROUP} {GUID_INCREASE_THRESHOLD} {increase}");
            // RunPowercfg($"/setacvalueindex SCHEME_CURRENT {GUID_PROCESSOR_SUBGROUP} {GUID_DECREASE_THRESHOLD} {decrease}");
            // RunPowercfg("/setactive SCHEME_CURRENT");
            // 
            // _currentIncreaseThreshold = increase;
            // _currentDecreaseThreshold = decrease;
            _logger.LogInfo($"[AdaptiveEngine] Thresholds: Usando configuração do Ultimate Performance (Inc=10% | Dec=90%)");
        }

        // CORREÇÃO: AdjustMinPerf DESABILITADO
        // Ultimate Performance já define MinPerf = 100% (CPU sempre em max frequency)
        // Mudanças causam oscilação de frequência e perda de Turbo Boost momentum
        private void AdjustMinPerf(int percent)
        {
            // DESABILITADO - Ultimate Performance já controla
            // if (percent == _currentMinPerf) return;
            // try
            // {
            //     RunPowercfg($"/setacvalueindex SCHEME_CURRENT {GUID_PROCESSOR_SUBGROUP} {GUID_MIN_PERF} {percent}");
            //     RunPowercfg("/setactive SCHEME_CURRENT");
            //     
            //     int effective = GetEffectivePowerValue(GUID_MIN_PERF, -1);
            //     if (effective == percent)
            //     {
            //         _currentMinPerf = percent;
            //         _logger.LogInfo($"[AdaptiveEngine] Min Perf State validado: {percent}%");
            //     }
            //     else
            //     {
            //         _logger.LogWarning($"[AdaptiveEngine] ⚠️ Falha na validação de MinPerf! Solicitado: {percent}% | Efetivo: {effective}%");
            //     }
            // }
            // catch { }
            _logger.LogInfo($"[AdaptiveEngine] Min Perf: Usando configuração do Ultimate Performance (100%)");
        }

        // CORREÇÃO: AdjustCoreParking SIMPLIFICADO
        // Ultimate Performance já define CoreParking = 100% (todos os cores ativos)
        // Apenas aplicar UMA VEZ no início, sem reaplicações
        private void AdjustCoreParking(int percent)
        {
            if (percent == _currentCoreParking) return;
            
            // Aplicar apenas se for diferente do atual
            try
            {
                RunPowercfg($"/setacvalueindex SCHEME_CURRENT {GUID_PROCESSOR_SUBGROUP} {GUID_CORE_PARKING} {percent}");
                // CORREÇÃO: Não chamar /setactive aqui - será chamado em batch
                _currentCoreParking = percent;
                _logger.LogInfo($"[AdaptiveEngine] Core Parking State: {percent}%");
            }
            catch { }
        }

        private void AdjustPowerLimit(int newWatts)
        {
            if (!_isLaptop) 
            {
                // DESKTOPS: Ignoramos os overrides do Windows. A BIOS cuida disso.
                // 0W é a keyword do sistema para ILIMITADO.
                newWatts = 0;
            }

            if (newWatts == _currentPl1 && _currentPl1 != 0) return;
            
            try
            {
                // Tenta via Registry para persistência rápida
                // PL1 guid: 3080644b-4f6d-4950-93cb-b59dd3369d7b
                using var key = Registry.LocalMachine.OpenSubKey(
                    @"SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\3080644b-4f6d-4950-93cb-b59dd3369d7b", true);
                
                if (key != null)
                {
                    key.SetValue("ACSettingIndex", newWatts, RegistryValueKind.DWord);
                }

                RunPowercfg($"/setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 3080644b-4f6d-4950-93cb-b59dd3369d7b {newWatts}");
                RunPowercfg("/setactive SCHEME_CURRENT");

                // Validação
                int effective = GetEffectivePowerValue("3080644b-4f6d-4950-93cb-b59dd3369d7b", -1);
                if (effective == newWatts)
                {
                    _currentPl1 = newWatts;
                    _logger.LogInfo($"[AdaptiveEngine] PL1 validado: {newWatts}W");
                }
                else
                {
                    _logger.LogWarning($"[AdaptiveEngine] ⚠️ Falha na validação de PL1! Solicitado: {newWatts}W | Efetivo: {effective}W");
                }
            }
            catch { }
        }

        // CORREÇÃO: AdjustEpp COM VALIDAÇÃO OPCIONAL
        // Validação Read-After-Write controlada por flag para balancear precisão vs overhead
        private bool _validateEppAdjustments = true; // Flag de controle
        private void AdjustEpp(int eppPercent)
        {
            if (eppPercent == _currentEpp) return;
            try
            {
                // EPP guid: 36687f9e-e3a5-4dbf-b1dc-15eb381c6863
                RunPowercfg($"/setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 36687f9e-e3a5-4dbf-b1dc-15eb381c6863 {eppPercent}");
                
                // Aplicar /setactive em batch para reduzir resets do power manager
                ApplyPowerConfigBatch();
                
                // CORREÇÃO: Validação opcional para detectar divergências
                if (_validateEppAdjustments)
                {
                    // Aguardar 50ms para o sistema aplicar
                    System.Threading.Thread.Sleep(50);
                    
                    int effective = GetEffectivePowerValue("36687f9e-e3a5-4dbf-b1dc-15eb381c6863", -1);
                    if (effective == eppPercent)
                    {
                        _currentEpp = eppPercent;
                        _logger.LogInfo($"[AdaptiveEngine] EPP ajustado e validado: {eppPercent}%");
                    }
                    else
                    {
                        _logger.LogWarning($"[AdaptiveEngine] ⚠️ EPP divergente! Solicitado: {eppPercent}% | Efetivo: {effective}% - Driver/BIOS pode estar sobrescrevendo");
                        _currentEpp = effective; // Usar valor efetivo real
                    }
                }
                else
                {
                    // Modo rápido: confiar que foi aplicado
                    _currentEpp = eppPercent;
                    _logger.LogInfo($"[AdaptiveEngine] EPP ajustado (sem validação): {eppPercent}%");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[AdaptiveEngine] Erro ao ajustar EPP: {ex.Message}");
            }
        }

        private void RunPowercfg(string args)
        {
            Process.Start(new ProcessStartInfo
            {
                FileName = "powercfg",
                Arguments = args,
                CreateNoWindow = true,
                UseShellExecute = false
            })?.WaitForExit(300);
        }

        // CORREÇÃO: Método para aplicar configurações em batch
        // Reduz resets do power manager de N vezes para 1 vez
        private DateTime _lastBatchApply = DateTime.MinValue;
        private void ApplyPowerConfigBatch()
        {
            // Aplicar /setactive apenas se passou tempo suficiente desde o último batch
            // Isso evita múltiplos resets do power manager em sequência rápida
            if ((DateTime.Now - _lastBatchApply).TotalSeconds < 2)
            {
                return; // Aguardar cooldown de 2s entre batches
            }
            
            RunPowercfg("/setactive SCHEME_CURRENT");
            _lastBatchApply = DateTime.Now;
        }

        private void RestoreFallbackState()
        {
            if (_systemSnapshot == null) return;
            _logger.LogInfo("[AdaptiveEngine] Restaurando perfil exato via Snapshot...");
            
            // CORREÇÃO: Restaurar em batch para evitar múltiplos resets
            AdjustPowerLimit(_systemSnapshot.Pl1);
            AdjustEpp(_systemSnapshot.Epp);
            // AdjustMinPerf(_systemSnapshot.MinPerf); // REMOVIDO
            AdjustCoreParking(_systemSnapshot.CoreParking);
            // AdjustProcessorThresholds(_systemSnapshot.IncreaseThreshold, _systemSnapshot.DecreaseThreshold); // REMOVIDO
            
            // Aplicar restore em batch
            ApplyPowerConfigBatch();
        }

        private string GetAdjustmentReason(bool throttling, double temp, double gpu, double cpu, double jitter)
        {
            if (throttling) return "Thermal Throttling Ativo (Hardware Limit)";
            if (temp > 93) return $"Temperatura Crítica ({temp:F1}C)";
            if (gpu > 92 && cpu < 55) return $"GPU Bottleneck ({gpu:F0}%) - Rebalanceando energia para GPU";
            if (cpu > 88 && gpu < 75) return $"CPU Bottleneck ({cpu:F0}%) - Liberando Turbo Boost Headroom";
            if (jitter > 8.0) return $"Estabilidade de Frametime Baixa (Jitter: {jitter:F1}ms)";
            return "Otimização de rotina";
        }

        private string ClassifyGameBound(double cpu, double gpu, double ram, double jitter)
        {
            if (cpu > 85 && gpu < 72 && jitter > 5.0) return "CPU-Bound";
            if (gpu > 92 && cpu < 65) return "GPU-Bound";
            if (cpu > 80 && gpu > 80) return "Balanced (Heavy)";
            if (ram > 90) return "Memory-Bound";
            if (jitter > 12.0) return "Stutter-Bound (I/O or Storage)";
            return "Balanced (Light)";
        }

        private string GetActionForTelemetry()
        {
            if (_throttleActiveCycles >= 2) return "Thermal Mitigation";
            if (_gpuUsage >= 92 && _cpuUsage < 55) return "GPU Energy Shift";
            if (_cpuUsage >= 88 && _gpuUsage < 75) return "CPU Turbo Boost";
            return "Adaptive Tuning";
        }

        private void UpdateEngineTelemetry(HardwareMetrics metrics, double cpuTemp, double deltaTemp)
        {
            try
            {
                // 1. Estado do Sistema
                var effectivePl1 = GetEffectivePowerValue("3080644b-4f6d-4950-93cb-b59dd3369d7b", _currentPl1);
                var effectiveEpp = GetEffectivePowerValue("be337238-0d82-4146-a960-4f3749d470c7", _currentEpp);

                if (_maxSafeTemp <= 0) _maxSafeTemp = 95.0; // Sanity check

                var state = new SystemState
                {
                    CpuTemp = cpuTemp,
                    Pl1EffectiveW = effectivePl1,
                    EppEffectivePercent = effectiveEpp,
                    ThermalHeadroom = Math.Max(0, _maxSafeTemp - cpuTemp),
                    GpuUsage = metrics.GpuUsage,
                    RamUsagePercent = metrics.RamUsagePercent,
                    VramUsagePercent = metrics.GpuVramTotal > 0 ? (metrics.GpuVramUsed * 100.0 / metrics.GpuVramTotal) : 0
                };
                _telemetry.UpdateState(state);

                // 2. Classificação
                var classification = new GameClassificationInsight
                {
                    Type = _gameClassification,
                    Confidence = 0.85, // Placeholder por enquanto
                    Reasons = GetClassificationReasons(metrics)
                };
                _telemetry.UpdateClassification(classification);

                // 3. Validação de Aplicação Real
                bool match = (effectivePl1 == _currentPl1);
                
                // 4. Última Decisão (se houver)
                var decision = new ActiveDecisionInsight
                {
                    Action = _lastAdjustmentReason?.Action ?? "Monitoring",
                    Reason = _lastAdjustmentReason?.Reason ?? "System Stable",
                    Headroom = state.ThermalHeadroom,
                    EmaJitter = _jitterEMA,
                    DeltaTemp = deltaTemp,
                    RequestedVsEffectiveMatch = match
                };
                _telemetry.RecordDecision(decision);

                if (!match)
                {
                    _logger.LogWarning($"[Telemetry] ⚠️ Divergência detectada! Solicitado: {_currentPl1}W | Efetivo: {effectivePl1}W. Possível override do driver.");
                }
            }
            catch { }
        }

        private List<string> GetClassificationReasons(HardwareMetrics metrics)
        {
            var reasons = new List<string>();
            if (metrics.CpuUsage > 85) reasons.Add("Alta carga de CPU");
            if (metrics.GpuUsage > 90) reasons.Add("Saturação de GPU");
            if (_jitterEMA > 6.0) reasons.Add("Frametime instável");
            return reasons;
        }

        public string GetCurrentClassification() => _gameClassification;

        private (string Action, string Reason)? _lastAdjustmentReason;

        public void Dispose()
        {
            StopEngineAsync().Wait();
            GC.SuppressFinalize(this);
        }
    }
}
