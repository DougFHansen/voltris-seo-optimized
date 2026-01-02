using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services.Gamer.Intelligence.Interfaces;
using VoltrisOptimizer.Services.Gamer.Intelligence.Models;

namespace VoltrisOptimizer.Services.Gamer.Intelligence.Implementation
{
    /// <summary>
    /// Orquestrador central de inteligência - coordena todos os módulos adaptativos
    /// </summary>
    public class IntelligenceOrchestratorService : IIntelligenceOrchestrator, IDisposable
    {
        private readonly ILoggingService _logger;
        private readonly IHardwareProfiler _hardwareProfiler;
        private readonly IFrameTimeOptimizer _frameTimeOptimizer;
        private readonly IInputLagOptimizer _inputLagOptimizer;
        private readonly IThermalMonitor _thermalMonitor;
        private readonly IGameIntelligence _gameIntelligence;
        private readonly INetworkIntelligence _networkIntelligence;
        private readonly IVramManager _vramManager;
        private readonly IPowerBalancer _powerBalancer;
        private readonly IAutoBenchmark _autoBenchmark;

        private bool _isInitialized;
        private bool _isOptimizationActive;
        private int? _activeGameProcessId;
        private string? _activeGameId;
        private OptimizationStrategy? _activeStrategy;

        public IntelligenceOrchestratorService(
            ILoggingService logger,
            IHardwareProfiler hardwareProfiler,
            IFrameTimeOptimizer frameTimeOptimizer,
            IInputLagOptimizer inputLagOptimizer,
            IThermalMonitor thermalMonitor,
            IGameIntelligence gameIntelligence,
            INetworkIntelligence networkIntelligence,
            IVramManager vramManager,
            IPowerBalancer powerBalancer,
            IAutoBenchmark autoBenchmark)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _hardwareProfiler = hardwareProfiler ?? throw new ArgumentNullException(nameof(hardwareProfiler));
            _frameTimeOptimizer = frameTimeOptimizer ?? throw new ArgumentNullException(nameof(frameTimeOptimizer));
            _inputLagOptimizer = inputLagOptimizer ?? throw new ArgumentNullException(nameof(inputLagOptimizer));
            _thermalMonitor = thermalMonitor ?? throw new ArgumentNullException(nameof(thermalMonitor));
            _gameIntelligence = gameIntelligence ?? throw new ArgumentNullException(nameof(gameIntelligence));
            _networkIntelligence = networkIntelligence ?? throw new ArgumentNullException(nameof(networkIntelligence));
            _vramManager = vramManager ?? throw new ArgumentNullException(nameof(vramManager));
            _powerBalancer = powerBalancer ?? throw new ArgumentNullException(nameof(powerBalancer));
            _autoBenchmark = autoBenchmark ?? throw new ArgumentNullException(nameof(autoBenchmark));

            // Subscreve eventos
            _thermalMonitor.ThrottlingDetected += OnThrottlingDetected;
            _vramManager.VramCritical += OnVramCritical;
            _powerBalancer.PowerStatusChanged += OnPowerStatusChanged;
        }

        public async Task InitializeAsync(CancellationToken cancellationToken = default)
        {
            if (_isInitialized) return;

            _logger.LogInfo("[Intelligence] Inicializando sistema de inteligência...");
            var stopwatch = Stopwatch.StartNew();

            try
            {
                // 1. Analisa hardware
                var profile = await _hardwareProfiler.AnalyzeAsync(cancellationToken);
                _logger.LogInfo($"[Intelligence] Hardware: {profile.Classification} (Score: {profile.PerformanceScore})");

                // 2. Analisa input lag base
                await _inputLagOptimizer.AnalyzeAsync(cancellationToken);

                // 3. Inicia monitoramento térmico (sempre ativo)
                if (profile.IsLaptop)
                {
                    _thermalMonitor.StartMonitoring();
                    _logger.LogInfo("[Intelligence] Monitoramento térmico ativado (laptop detectado)");
                }

                // 4. Aplicar SvcHostSplitThresholdInKB na primeira vez (baseado na RAM)
                if (App.UltraPerformance != null)
                {
                    try
                    {
                        App.UltraPerformance.ApplySvcHostSplitThreshold();
                        _logger.LogInfo("[Intelligence] SvcHostSplitThresholdInKB aplicado baseado na RAM do sistema");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"[Intelligence] Erro ao aplicar SvcHostSplitThresholdInKB: {ex.Message}");
                    }
                }

                stopwatch.Stop();
                _logger.LogInfo($"[Intelligence] Sistema inicializado em {stopwatch.ElapsedMilliseconds}ms");
                _isInitialized = true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[Intelligence] Erro na inicialização: {ex.Message}");
                throw;
            }
        }

        public HardwareProfile GetHardwareProfile()
        {
            return _hardwareProfiler.CurrentProfile;
        }

        public OptimizationStrategy GetOptimizedStrategy(string? gameId = null)
        {
            var hardware = _hardwareProfiler.CurrentProfile;
            OptimizationStrategy strategy;

            if (!string.IsNullOrEmpty(gameId))
            {
                // Estratégia específica para o jogo
                strategy = _gameIntelligence.GetGameStrategy(gameId, hardware);
            }
            else
            {
                // Estratégia genérica baseada no hardware
                strategy = _hardwareProfiler.GetRecommendedStrategy();
            }

            // Ajusta para bateria se necessário
            if (hardware.IsLaptop && hardware.Power.IsOnBattery)
            {
                strategy = _powerBalancer.AdjustForBattery(strategy);
            }

            // Verifica temperaturas
            if (_thermalMonitor.IsThrottling())
            {
                var action = _thermalMonitor.GetRecommendedAction();
                if (action >= ThermalAction.ReduceOptimizations)
                {
                    strategy.CpuOptimizationLevel = Math.Max(1, strategy.CpuOptimizationLevel - 1);
                    strategy.GpuOptimizationLevel = Math.Max(1, strategy.GpuOptimizationLevel - 1);
                    _logger.LogWarning("[Intelligence] Otimizações reduzidas devido a temperaturas altas");
                }
            }

            return strategy;
        }

        public async Task<bool> ApplyStrategyAsync(
            OptimizationStrategy strategy, 
            int? gameProcessId = null, 
            CancellationToken cancellationToken = default)
        {
            if (!_isInitialized)
            {
                await InitializeAsync(cancellationToken);
            }

            _logger.LogInfo($"[Intelligence] Aplicando estratégia: {strategy.TargetClass}");
            _activeStrategy = strategy;
            _activeGameProcessId = gameProcessId;
            _activeGameId = strategy.GameId;
            _isOptimizationActive = true;

            try
            {
                var hardware = _hardwareProfiler.CurrentProfile;

                // 1. Aplica power mode
                var powerMode = _powerBalancer.GetOptimalPowerMode(true);
                await _powerBalancer.ApplyPowerModeAsync(powerMode, cancellationToken);

                // 2. Otimiza input lag
                if (strategy.EnableTimerResolution || strategy.CpuOptimizationLevel >= 2)
                {
                    await _inputLagOptimizer.OptimizeAsync(cancellationToken);
                }

                // 3. Otimiza rede
                if (strategy.EnableQoS && !string.IsNullOrEmpty(strategy.GameId))
                {
                    await _networkIntelligence.OptimizeForGameAsync(strategy.GameId, cancellationToken);
                }

                // 4. Inicia monitoramentos
                if (strategy.EnableVramMonitor && hardware.Gpu.IsDiscrete)
                {
                    _vramManager.StartMonitoring();
                }

                if (strategy.EnableThermalMonitor && !hardware.IsLaptop)
                {
                    _thermalMonitor.StartMonitoring();
                }

                // 5. Inicia monitoramento de frame time se tiver processo
                if (gameProcessId.HasValue)
                {
                    _frameTimeOptimizer.StartMonitoring(gameProcessId.Value);

                    // Detecta servidor do jogo
                    await _networkIntelligence.DetectGameServerAsync(gameProcessId.Value, cancellationToken);
                }

                _logger.LogInfo("[Intelligence] Estratégia aplicada com sucesso");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[Intelligence] Erro ao aplicar estratégia: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> RevertAllAsync(CancellationToken cancellationToken = default)
        {
            _logger.LogInfo("[Intelligence] Revertendo otimizações...");
            _isOptimizationActive = false;

            try
            {
                // Para monitoramentos
                _frameTimeOptimizer.StopMonitoring();
                _vramManager.StopMonitoring();
                
                // Mantém térmico ativo em laptops
                if (!_hardwareProfiler.CurrentProfile.IsLaptop)
                {
                    _thermalMonitor.StopMonitoring();
                }

                // Restaura input lag
                await _inputLagOptimizer.RestoreAsync(cancellationToken);

                // Restaura power plan
                if (_powerBalancer is PowerBalancerService pbs)
                {
                    await pbs.RestoreOriginalPowerPlanAsync(cancellationToken);
                }

                _activeStrategy = null;
                _activeGameProcessId = null;
                _activeGameId = null;

                _logger.LogInfo("[Intelligence] Otimizações revertidas");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[Intelligence] Erro ao reverter: {ex.Message}");
                return false;
            }
        }

        public IntelligenceStatus GetStatus()
        {
            return new IntelligenceStatus
            {
                HardwareClass = _hardwareProfiler.CurrentProfile.Classification,
                IsMonitoringFrameTime = _activeGameProcessId.HasValue,
                IsMonitoringThermal = _thermalMonitor.CurrentThermal.CpuTempCurrent > 0,
                IsMonitoringVram = _vramManager.CurrentStatus.TotalBytes > 0,
                IsOptimizationActive = _isOptimizationActive,
                ActiveGame = _activeGameId ?? "",
                CurrentFrameMetrics = _frameTimeOptimizer.CurrentMetrics,
                CurrentThermal = _thermalMonitor.CurrentThermal,
                CurrentVram = _vramManager.CurrentStatus,
                ActiveOptimizations = CountActiveOptimizations()
            };
        }

        private int CountActiveOptimizations()
        {
            if (!_isOptimizationActive || _activeStrategy == null) return 0;

            int count = 0;
            if (_activeStrategy.EnableTimerResolution) count++;
            if (_activeStrategy.EnableQoS) count++;
            if (_activeStrategy.EnableTdrTweaks) count++;
            if (_activeStrategy.EnableHags) count++;
            if (_activeStrategy.EnableVramMonitor) count++;
            if (_activeStrategy.EnableThermalMonitor) count++;
            if (_activeStrategy.EnableAdaptiveGovernor) count++;
            count += _activeStrategy.CpuOptimizationLevel;
            count += _activeStrategy.GpuOptimizationLevel;
            count += _activeStrategy.NetworkOptimizationLevel;
            count += _activeStrategy.MemoryOptimizationLevel;
            return count;
        }

        #region Event Handlers

        private void OnThrottlingDetected(object? sender, ThermalProfile thermal)
        {
            _logger.LogWarning($"[Intelligence] Throttling térmico! CPU: {thermal.CpuTempCurrent:F0}°C, GPU: {thermal.GpuTempCurrent:F0}°C");

            if (!_isOptimizationActive || _activeStrategy == null) return;

            var action = _thermalMonitor.GetRecommendedAction();
            
            switch (action)
            {
                case ThermalAction.ReduceOptimizations:
                    // Reduz otimizações
                    _activeStrategy.CpuOptimizationLevel = Math.Max(1, _activeStrategy.CpuOptimizationLevel - 1);
                    _logger.LogInfo("[Intelligence] Otimizações de CPU reduzidas por temperatura");
                    break;

                case ThermalAction.PauseOptimizations:
                    // Pausa otimizações agressivas
                    _activeStrategy.EnableTimerResolution = false;
                    _activeStrategy.EnableTdrTweaks = false;
                    _logger.LogWarning("[Intelligence] Otimizações agressivas pausadas por temperatura");
                    break;

                case ThermalAction.EmergencyThrottle:
                    // Emergência - reverte tudo
                    _ = RevertAllAsync();
                    _logger.LogError("[Intelligence] EMERGÊNCIA: Todas otimizações revertidas por temperatura crítica!");
                    break;
            }
        }

        private async void OnVramCritical(object? sender, VramStatus status)
        {
            try
            {
                _logger.LogWarning($"[Intelligence] VRAM crítica: {status.UsagePercent:F1}%");

                if (!_isOptimizationActive) return;

                var freed = await _vramManager.FreeVramAsync();
                _logger.LogInfo($"[Intelligence] VRAM liberada: {freed / (1024 * 1024)}MB");

                await _frameTimeOptimizer.ApplyPreventiveFixesAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError($"[Intelligence] Erro ao tratar VRAM crítica: {ex.Message}");
            }
        }

        private async void OnPowerStatusChanged(object? sender, PowerProfile power)
        {
            try
            {
                _logger.LogInfo($"[Intelligence] Status de energia alterado: {(power.IsOnBattery ? "Bateria" : "Tomada")}");

                if (!_isOptimizationActive || _activeStrategy == null) return;

                var newStrategy = GetOptimizedStrategy(_activeGameId);
                await ApplyStrategyAsync(newStrategy, _activeGameProcessId);
            }
            catch (Exception ex)
            {
                _logger.LogError($"[Intelligence] Erro ao tratar mudança de energia: {ex.Message}");
            }
        }

        #endregion

        public void Dispose()
        {
            _thermalMonitor.ThrottlingDetected -= OnThrottlingDetected;
            _vramManager.VramCritical -= OnVramCritical;
            _powerBalancer.PowerStatusChanged -= OnPowerStatusChanged;

            if (_frameTimeOptimizer is IDisposable ftd) ftd.Dispose();
            if (_thermalMonitor is IDisposable tmd) tmd.Dispose();
            if (_vramManager is IDisposable vmd) vmd.Dispose();
            if (_powerBalancer is IDisposable pbd) pbd.Dispose();

            GC.SuppressFinalize(this);
        }
    }
}

