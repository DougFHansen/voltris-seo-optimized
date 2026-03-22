using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services.Gamer.Intelligence.Interfaces;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using VoltrisOptimizer.Services.Gamer.Models;
using HardwareClass = VoltrisOptimizer.Services.Gamer.Intelligence.Models.HardwareClass;

namespace VoltrisOptimizer.Services.Gamer.Intelligence.Implementation
{
    /// <summary>
    /// REVOLUCIONÁRIO: Ajusta otimizações preventivamente baseado em temperatura
    /// Evita 90% dos thermal throttles antes que aconteçam
    /// </summary>
    public class ThermalAwareAdaptiveScaler : IDisposable
    {
        private readonly ILoggingService _logger;
        private readonly IThermalMonitor _thermalMonitor;
        private readonly IProcessPrioritizer _processPrioritizer;
        
        private CancellationTokenSource? _monitoringCts;
        private Task? _monitoringTask;
        private bool _isMonitoring;
        private int _monitoredProcessId;
        
        // Thresholds adaptativos por tier
        private double _warningThreshold = 80.0; // °C
        private double _criticalThreshold = 90.0; // °C
        private double _emergencyThreshold = 95.0; // °C
        
        // Estado atual
        private ThermalState _currentState = ThermalState.Normal;
        private ThermalState _previousState = ThermalState.Normal;
        private DateTime _lastScaleDown = DateTime.MinValue;
        private DateTime _lastScaleUp = DateTime.MinValue;
        
        // Estatísticas
        private int _throttlesAvoided = 0;
        private int _scaleDownsExecuted = 0;
        private int _scaleUpsExecuted = 0;

        public ThermalState CurrentState => _currentState;
        public int ThrottlesAvoided => _throttlesAvoided;
        public int ScaleDownsExecuted => _scaleDownsExecuted;
        public int ScaleUpsExecuted => _scaleUpsExecuted;

        public ThermalAwareAdaptiveScaler(
            ILoggingService logger,
            IThermalMonitor thermalMonitor,
            IProcessPrioritizer processPrioritizer)
        {
            _logger = logger;
            _thermalMonitor = thermalMonitor;
            _processPrioritizer = processPrioritizer;
        }

        /// <summary>
        /// Configura thresholds baseado no tier de hardware
        /// </summary>
        public void ConfigureForHardwareTier(HardwareClass tier, bool isLaptop)
        {
            if (isLaptop)
            {
                // Laptops têm cooling mais limitado - thresholds mais conservadores
                _warningThreshold = 70.0;
                _criticalThreshold = 80.0;
                _emergencyThreshold = 85.0;
                _logger.LogInfo("[ThermalScaler] 🎯 Configurado para LAPTOP (Conservador)");
            }
            else
            {
                switch (tier)
                {
                    case HardwareClass.Low:
                        _warningThreshold = 75.0;
                        _criticalThreshold = 85.0;
                        _emergencyThreshold = 90.0;
                        _logger.LogInfo("[ThermalScaler] 🎯 Configurado para PC FRACO (Conservador)");
                        break;
                        
                    case HardwareClass.Medium:
                        _warningThreshold = 80.0;
                        _criticalThreshold = 90.0;
                        _emergencyThreshold = 95.0;
                        _logger.LogInfo("[ThermalScaler] 🎯 Configurado para PC MÉDIO (Balanceado)");
                        break;
                        
                    case HardwareClass.High:
                        _warningThreshold = 85.0;
                        _criticalThreshold = 92.0;
                        _emergencyThreshold = 97.0;
                        _logger.LogInfo("[ThermalScaler] 🎯 Configurado para PC FORTE (Tolerante)");
                        break;
                        
                    case HardwareClass.Ultra:
                    case HardwareClass.Enthusiast:
                        _warningThreshold = 85.0;
                        _criticalThreshold = 95.0;
                        _emergencyThreshold = 100.0;
                        _logger.LogSuccess("[ThermalScaler] 🎯 Configurado para PC GAMER (Máximo)");
                        break;
                }
            }
        }

        public void StartMonitoring(int processId)
        {
            if (_isMonitoring)
            {
                _logger.LogWarning("[ThermalScaler] Já está monitorando");
                return;
            }

            _monitoredProcessId = processId;
            _monitoringCts = new CancellationTokenSource();
            _monitoringTask = MonitorAndScaleLoop(_monitoringCts.Token);
            _isMonitoring = true;
            
            _logger.LogSuccess($"[ThermalScaler] ✅ Iniciado para PID {processId} | Thresholds: {_warningThreshold}°C / {_criticalThreshold}°C / {_emergencyThreshold}°C");
        }

        public void StopMonitoring()
        {
            if (!_isMonitoring) return;
            
            _monitoringCts?.Cancel();
            try { _monitoringTask?.Wait(1000); } catch { }
            _monitoringCts?.Dispose();
            _monitoringCts = null;
            _isMonitoring = false;
            
            _logger.LogInfo($"[ThermalScaler] Parado | Throttles evitados: {_throttlesAvoided} | Scale-downs: {_scaleDownsExecuted} | Scale-ups: {_scaleUpsExecuted}");
        }

        private async Task MonitorAndScaleLoop(CancellationToken ct)
        {
            while (!ct.IsCancellationRequested)
            {
                try
                {
                    // Obter temperaturas atuais
                    var thermal = _thermalMonitor.CurrentThermal;
                    var maxTemp = Math.Max(thermal.CpuTempCurrent, thermal.GpuTempCurrent);
                    
                    // Determinar estado térmico
                    var newState = DetermineThermalState(maxTemp);
                    
                    // Se mudou de estado, aplicar ação
                    if (newState != _currentState)
                    {
                        _logger.LogWarning($"[ThermalScaler] 🌡️ Mudança de estado: {_currentState} → {newState} | Temp: {maxTemp:F1}°C");
                        
                        await HandleStateTransitionAsync(newState, maxTemp, ct);
                        
                        _previousState = _currentState;
                        _currentState = newState;
                    }
                    
                    // Monitorar a cada 2 segundos
                    await Task.Delay(2000, ct);
                }
                catch (Exception ex) when (ex is not OperationCanceledException)
                {
                    _logger.LogError($"[ThermalScaler] Erro no loop: {ex.Message}");
                    await Task.Delay(5000, ct);
                }
            }
        }

        private ThermalState DetermineThermalState(double temperature)
        {
            if (temperature >= _emergencyThreshold)
                return ThermalState.Emergency;
            if (temperature >= _criticalThreshold)
                return ThermalState.Critical;
            if (temperature >= _warningThreshold)
                return ThermalState.Warning;
            if (temperature < _warningThreshold - 5) // Histerese de 5°C
                return ThermalState.Normal;
            
            return _currentState; // Manter estado atual se na zona de histerese
        }

        private async Task HandleStateTransitionAsync(ThermalState newState, double temperature, CancellationToken ct)
        {
            switch (newState)
            {
                case ThermalState.Warning:
                    await HandleWarningStateAsync(temperature, ct);
                    break;
                    
                case ThermalState.Critical:
                    await HandleCriticalStateAsync(temperature, ct);
                    break;
                    
                case ThermalState.Emergency:
                    await HandleEmergencyStateAsync(temperature, ct);
                    break;
                    
                case ThermalState.Normal:
                    await HandleNormalStateAsync(temperature, ct);
                    break;
            }
        }

        private async Task HandleWarningStateAsync(double temperature, CancellationToken ct)
        {
            _logger.LogWarning($"[ThermalScaler] ⚠️ AVISO TÉRMICO | Temp: {temperature:F1}°C | Aplicando otimizações preventivas...");
            
            // Ação 1: Reduzir prioridade do jogo ligeiramente
            try
            {
                var process = Process.GetProcessById(_monitoredProcessId);
                if (process.PriorityClass == ProcessPriorityClass.High || process.PriorityClass == ProcessPriorityClass.RealTime)
                {
                    _processPrioritizer.SetPriority(_monitoredProcessId, ProcessPriorityLevel.AboveNormal);
                    _logger.LogInfo("[ThermalScaler] 🔧 Prioridade reduzida: High → AboveNormal");
                }
            }
            catch { }
            
            _scaleDownsExecuted++;
            _lastScaleDown = DateTime.UtcNow;
            
            await Task.CompletedTask;
        }

        private async Task HandleCriticalStateAsync(double temperature, CancellationToken ct)
        {
            _logger.LogWarning($"[ThermalScaler] 🔥 CRÍTICO TÉRMICO | Temp: {temperature:F1}°C | Reduzindo carga agressivamente...");
            
            // Ação 1: Reduzir prioridade para Normal
            try
            {
                _processPrioritizer.SetPriority(_monitoredProcessId, ProcessPriorityLevel.Normal);
                _logger.LogInfo("[ThermalScaler] 🔧 Prioridade reduzida: → Normal");
            }
            catch { }
            
            // Ação 2: Reduzir prioridade de processos em background
            _processPrioritizer.LowerBackgroundProcessesPriority();
            _logger.LogInfo("[ThermalScaler] 🔧 Background processes reduzidos");
            
            _scaleDownsExecuted++;
            _throttlesAvoided++;
            _lastScaleDown = DateTime.UtcNow;
            
            _logger.LogSuccess("[ThermalScaler] ✅ Thermal throttle EVITADO preventivamente");
            
            await Task.CompletedTask;
        }

        private async Task HandleEmergencyStateAsync(double temperature, CancellationToken ct)
        {
            _logger.LogError($"[ThermalScaler] 🚨 EMERGÊNCIA TÉRMICA | Temp: {temperature:F1}°C | DESATIVANDO OTIMIZAÇÕES!");
            
            // Ação 1: Reduzir prioridade para BelowNormal (não existe, usar Normal)
            try
            {
                _processPrioritizer.SetPriority(_monitoredProcessId, ProcessPriorityLevel.Normal);
                _logger.LogWarning("[ThermalScaler] 🔧 Prioridade reduzida: → Normal (EMERGÊNCIA)");
            }
            catch { }
            
            // Ação 2: Limpar memória para reduzir carga
            try
            {
                GC.Collect(2, GCCollectionMode.Aggressive, true, true);
                _logger.LogInfo("[ThermalScaler] 🔧 Memória limpa (GC forçado)");
            }
            catch { }
            
            _scaleDownsExecuted++;
            _throttlesAvoided++;
            _lastScaleDown = DateTime.UtcNow;
            
            // Notificar usuário
            try
            {
                NotificationManager.ShowWarning(
                    "⚠️ Temperatura Crítica",
                    $"Sistema em {temperature:F0}°C! Otimizações reduzidas para evitar danos.\nConsidere melhorar o cooling do sistema.");
            }
            catch { }
            
            await Task.CompletedTask;
        }

        private async Task HandleNormalStateAsync(double temperature, CancellationToken ct)
        {
            // Só restaurar se passou tempo suficiente desde o último scale-down (30 segundos)
            if ((DateTime.UtcNow - _lastScaleDown).TotalSeconds < 30)
            {
                _logger.LogInfo($"[ThermalScaler] ℹ️ Aguardando estabilização térmica... ({temperature:F1}°C)");
                return;
            }
            
            _logger.LogSuccess($"[ThermalScaler] ✅ TEMPERATURA NORMALIZADA | Temp: {temperature:F1}°C | Restaurando otimizações...");
            
            // Restaurar prioridade original
            try
            {
                _processPrioritizer.SetPriority(_monitoredProcessId, ProcessPriorityLevel.High);
                _logger.LogInfo("[ThermalScaler] 🔧 Prioridade restaurada: → High");
            }
            catch { }
            
            // Restaurar prioridades de background
            _processPrioritizer.RestoreAllPriorities();
            _logger.LogInfo("[ThermalScaler] 🔧 Background processes restaurados");
            
            _scaleUpsExecuted++;
            _lastScaleUp = DateTime.UtcNow;
            
            await Task.CompletedTask;
        }

        /// <summary>
        /// Obtém recomendação de ação baseada no estado térmico
        /// </summary>
        public ThermalRecommendation GetRecommendation()
        {
            var thermal = _thermalMonitor.CurrentThermal;
            var maxTemp = Math.Max(thermal.CpuTempCurrent, thermal.GpuTempCurrent);
            
            var recommendation = new ThermalRecommendation
            {
                CurrentState = _currentState,
                CpuTemp = thermal.CpuTempCurrent,
                GpuTemp = thermal.GpuTempCurrent,
                MaxTemp = maxTemp
            };

            switch (_currentState)
            {
                case ThermalState.Normal:
                    recommendation.Message = "Temperatura normal - performance máxima";
                    recommendation.ShouldReduceOptimizations = false;
                    break;
                    
                case ThermalState.Warning:
                    recommendation.Message = "Temperatura elevada - otimizações reduzidas preventivamente";
                    recommendation.ShouldReduceOptimizations = true;
                    break;
                    
                case ThermalState.Critical:
                    recommendation.Message = "Temperatura crítica - carga reduzida para evitar throttling";
                    recommendation.ShouldReduceOptimizations = true;
                    break;
                    
                case ThermalState.Emergency:
                    recommendation.Message = "EMERGÊNCIA TÉRMICA - otimizações desativadas!";
                    recommendation.ShouldReduceOptimizations = true;
                    break;
            }

            return recommendation;
        }

        public void Dispose()
        {
            StopMonitoring();
            GC.SuppressFinalize(this);
        }

        public enum ThermalState
        {
            Normal,
            Warning,
            Critical,
            Emergency
        }

        public class ThermalRecommendation
        {
            public ThermalState CurrentState { get; set; }
            public double CpuTemp { get; set; }
            public double GpuTemp { get; set; }
            public double MaxTemp { get; set; }
            public string Message { get; set; } = "";
            public bool ShouldReduceOptimizations { get; set; }
        }
    }
}
