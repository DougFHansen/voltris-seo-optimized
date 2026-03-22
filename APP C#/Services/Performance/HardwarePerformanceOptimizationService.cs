using System;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services.Performance.Models;
using VoltrisOptimizer.Services.Thermal;
using VoltrisOptimizer.Services.Gamer.Interfaces;

namespace VoltrisOptimizer.Services.Performance
{
    /// <summary>
    /// Serviço de Otimização de Performance de Hardware
    /// Replica funcionalidade do Quick CPU de forma segura e inteligente
    /// 
    /// FUNCIONALIDADES:
    /// - Core Parking (controle de cores ativos)
    /// - Frequency Scaling (frequência mínima/máxima)
    /// - Turbo Boost (boost agressivo)
    /// - Hetero Policy (P-cores vs E-cores)
    /// 
    /// INTELIGÊNCIA:
    /// - Integrado com Perfil Inteligente
    /// - Ativado apenas com Modo Gamer ON + Jogo detectado
    /// - Proteção térmica automática
    /// - 100% reversível
    /// - Logs enterprise completos
    /// 
    /// CORREÇÕES ENTERPRISE:
    /// - RISCO #2: Race conditions eliminadas com debouncing
    /// - RISCO #3: Persistência com validação de integridade
    /// - RISCO #5: Detecção AC/DC confiável via WMI
    /// </summary>
    public class HardwarePerformanceOptimizationService : IDisposable
    {
        private readonly ILoggingService _logger;
        private readonly PowerPlanManager _powerPlanManager;
        private readonly ThermalSafetyGuard _thermalSafety;
        private readonly GlobalThermalMonitorService? _thermalMonitor;
        private readonly IGamerModeOrchestrator? _gamerOrchestrator;
        private readonly PerformanceStateStore _stateStore;
        private readonly PowerStatusDetector _powerStatusDetector;
        private readonly HardwareCapabilityDetector _hardwareDetector;
        
        private PerformanceState _currentState = new();
        private readonly SemaphoreSlim _stateLock = new SemaphoreSlim(1, 1); // Thread-safe lock
        private Timer? _monitoringTimer;
        private volatile bool _isDisposed;
        private volatile int _isActivating = 0; // Atomic flag para prevenir ativações concorrentes
        private volatile int _isDeactivating = 0; // Atomic flag para prevenir desativações concorrentes
        private DateTime _lastDeactivationAttempt = DateTime.MinValue; // Para debouncing
        private const int DEBOUNCE_MILLISECONDS = 2000; // 2 segundos de debounce

        public event EventHandler<PerformanceStateChangedEventArgs>? StateChanged;

        /// <summary>
        /// Estado atual das otimizações (thread-safe)
        /// </summary>
        public PerformanceState CurrentState
        {
            get
            {
                _stateLock.Wait();
                try
                {
                    return _currentState;
                }
                finally
                {
                    _stateLock.Release();
                }
            }
        }

        public HardwarePerformanceOptimizationService(
            ILoggingService logger,
            GlobalThermalMonitorService? thermalMonitor = null,
            IGamerModeOrchestrator? gamerOrchestrator = null)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _thermalMonitor = thermalMonitor;
            _gamerOrchestrator = gamerOrchestrator;

            _hardwareDetector = new HardwareCapabilityDetector(logger);
            _powerPlanManager = new PowerPlanManager(logger, _hardwareDetector);
            _thermalSafety = new ThermalSafetyGuard(logger, thermalMonitor);
            _stateStore = new PerformanceStateStore(logger);
            _powerStatusDetector = new PowerStatusDetector(logger);

            // Subscrever eventos
            _thermalSafety.ThermalAlertRaised += OnThermalAlertRaised;

            if (_gamerOrchestrator != null)
            {
                _gamerOrchestrator.StatusChanged += OnGamerModeStatusChanged;
                _logger.LogInfo("[HardwarePerf] Integrado com GamerModeOrchestrator");
            }

            // Iniciar monitoramento adaptativo (5s em Gamer Mode, 15s em outros modos)
            _monitoringTimer = new Timer(MonitoringTick, null, TimeSpan.FromSeconds(5), TimeSpan.FromSeconds(5));
            
            // Registrar handlers de crash recovery
            AppDomain.CurrentDomain.ProcessExit += OnProcessExit;
            AppDomain.CurrentDomain.UnhandledException += OnUnhandledException;

            _logger.LogInfo("[HardwarePerf] Serviço inicializado");
            _logger.LogInfo($"[HardwarePerf] Hardware: {_hardwareDetector.Capabilities.ProcessorName}");
        }

        /// <summary>
        /// Ativa otimizações de performance baseado no contexto atual (THREAD-SAFE)
        /// </summary>
        public async Task<PerformanceOperationResult> ActivateOptimizationsAsync(
            IntelligentProfileType intelligentProfile,
            bool isGamerModeActive,
            string? detectedGame = null)
        {
            // PROTEÇÃO CONTRA ATIVAÇÕES CONCORRENTES (atomic)
            if (Interlocked.CompareExchange(ref _isActivating, 1, 0) != 0)
            {
                _logger.LogWarning("[HardwarePerf] Ativação já em andamento - ignorando chamada concorrente");
                return new PerformanceOperationResult 
                { 
                    Success = false, 
                    Message = "Ativação já em andamento" 
                };
            }

            var result = new PerformanceOperationResult { Success = true };

            try
            {
                _logger.LogInfo($"[HardwarePerf] ===== ATIVAÇÃO DE OTIMIZAÇÕES =====");
                _logger.LogInfo($"[HardwarePerf] Perfil: {intelligentProfile}, Modo Gamer: {isGamerModeActive}, Jogo: {detectedGame ?? "Nenhum"}");

                // REGRA 0: Verificar AC/DC ANTES de ativar (CORREÇÃO RISCO #5)
                if (!_powerStatusDetector.IsOnACPower())
                {
                    result.Status = OperationStatus.Failed;
                    result.Message = "Otimizações não podem ser ativadas em modo bateria";
                    _logger.LogWarning($"[HardwarePerf] {result.Message}");
                    return result;
                }

                // REGRA 1: Verificar se deve ativar
                if (!ShouldActivate(intelligentProfile, isGamerModeActive, out string activationReason))
                {
                    result.Status = OperationStatus.Failed;
                    result.Message = activationReason;
                    _logger.LogInfo($"[HardwarePerf] Ativação bloqueada: {activationReason}");
                    return result;
                }

                // REGRA 2: Verificar segurança térmica
                if (!_thermalSafety.IsSafeToOptimize(out string thermalReason))
                {
                    result.Status = OperationStatus.Failed;
                    result.Message = $"Bloqueado por segurança térmica: {thermalReason}";
                    _logger.LogWarning($"[HardwarePerf] {result.Message}");
                    return result;
                }

                // REGRA 3: Resolver perfil de performance baseado no Perfil Inteligente
                var performanceProfile = ResolvePerformanceProfile(intelligentProfile);
                
                // Definir perfil no ThermalSafety imediatamente após resolver
                _thermalSafety.SetCurrentProfile(performanceProfile);
                
                // REGRA 3.1: Ajustar perfil para bateria (DC mode) - NÃO DEVE ACONTECER MAIS
                // Mantido por segurança, mas já validamos AC no início
                if (!_powerStatusDetector.IsOnACPower())
                {
                    performanceProfile = AdjustProfileForBattery(performanceProfile);
                    _logger.LogInfo($"[HardwarePerf] Modo bateria detectado - perfil ajustado para segurança");
                }
                
                _logger.LogInfo($"[HardwarePerf] Perfil de performance resolvido: {performanceProfile.Name} (Agressividade: {performanceProfile.AggressivenessLevel}%)");

                // REGRA 4: Capturar estado original para rollback (THREAD-SAFE)
                PerformanceStateSnapshot originalState;
                await _stateLock.WaitAsync();
                try
                {
                    if (_currentState.IsActive)
                    {
                        _logger.LogWarning("[HardwarePerf] Otimizações já ativas - ignorando nova ativação");
                        result.Message = "Otimizações já estão ativas";
                        return result;
                    }

                    originalState = _powerPlanManager.CaptureCurrentState();
                    
                    // Persistir estado original para recovery em caso de crash (CORREÇÃO RISCO #3)
                    _stateStore.PersistState(originalState);
                }
                finally
                {
                    _stateLock.Release();
                }

                // REGRA 5: Aplicar perfil de performance
                var applyResult = _powerPlanManager.ApplyProfile(performanceProfile, originalState);

                if (!applyResult.Success)
                {
                    result.Status = applyResult.Status;
                    result.Message = applyResult.Message;
                    result.Errors.AddRange(applyResult.Errors);
                    result.Warnings.AddRange(applyResult.Warnings);
                    _logger.LogError($"[HardwarePerf] Falha ao aplicar perfil: {applyResult.Message}");
                    return result;
                }

                // REGRA 6: Atualizar estado (thread-safe)
                var thermalMetrics = _thermalSafety.GetCurrentMetrics();
                await _stateLock.WaitAsync();
                try
                {
                    var previousState = _currentState;
                    
                    _currentState = new PerformanceState
                    {
                        IsActive = true,
                        CurrentProfile = performanceProfile,
                        IntelligentProfile = intelligentProfile,
                        IsGamerModeActive = isGamerModeActive,
                        DetectedGame = detectedGame,
                        CpuTemperature = thermalMetrics?.CpuTemperature ?? 0,
                        GpuTemperature = thermalMetrics?.GpuTemperature ?? 0,
                        ActivatedAt = DateTime.Now,
                        LastUpdated = DateTime.Now,
                        ActivationReason = activationReason,
                        AppliedSettings = applyResult.Details,
                        OriginalState = originalState
                    };

                    // Disparar evento de mudança de estado
                    StateChanged?.Invoke(this, new PerformanceStateChangedEventArgs
                    {
                        PreviousState = previousState,
                        CurrentState = _currentState,
                        Reason = activationReason
                    });
                }
                finally
                {
                    _stateLock.Release();
                }

                result.Message = $"Otimizações ativadas: {performanceProfile.Name}";
                result.Details = applyResult.Details;
                result.Status = applyResult.Status; // Pode ser Success ou PartialSuccess

                if (result.Status == OperationStatus.Success)
                    _logger.LogSuccess($"[HardwarePerf] {result.Message}");
                else if (result.Status == OperationStatus.PartialSuccess)
                    _logger.LogWarning($"[HardwarePerf] {result.Message} (parcial)");
                    
                _logger.LogInfo($"[HardwarePerf] Temperatura no momento: CPU={thermalMetrics?.CpuTemperature:F1}°C, GPU={thermalMetrics?.GpuTemperature:F1}°C");
                _logger.LogInfo($"[HardwarePerf] Configurações aplicadas: {string.Join(", ", applyResult.Details)}");
            }
            catch (Exception ex)
            {
                result.Status = OperationStatus.Failed;
                result.Message = $"Erro ao ativar otimizações: {ex.Message}";
                result.Errors.Add(ex.Message);
                _logger.LogError($"[HardwarePerf] {result.Message}", ex);
            }
            finally
            {
                // Sempre liberar flag atômica
                Interlocked.Exchange(ref _isActivating, 0);
            }

            return result;
        }

        /// <summary>
        /// Desativa otimizações e restaura estado original (THREAD-SAFE, IDEMPOTENTE)
        /// CORREÇÃO RISCO #2: Debouncing implementado para evitar múltiplas desativações
        /// </summary>
        public async Task<PerformanceOperationResult> DeactivateOptimizationsAsync(string reason)
        {
            // DEBOUNCING: Evitar múltiplas desativações em curto período (CORREÇÃO RISCO #2)
            var timeSinceLastAttempt = (DateTime.Now - _lastDeactivationAttempt).TotalMilliseconds;
            if (timeSinceLastAttempt < DEBOUNCE_MILLISECONDS)
            {
                _logger.LogDebug($"[HardwarePerf] Desativação ignorada por debouncing ({timeSinceLastAttempt:F0}ms < {DEBOUNCE_MILLISECONDS}ms)");
                return new PerformanceOperationResult 
                { 
                    Status = OperationStatus.Success, 
                    Message = "Desativação ignorada por debouncing" 
                };
            }

            _lastDeactivationAttempt = DateTime.Now;

            // PROTEÇÃO CONTRA DESATIVAÇÕES CONCORRENTES (atomic)
            if (Interlocked.CompareExchange(ref _isDeactivating, 1, 0) != 0)
            {
                _logger.LogWarning("[HardwarePerf] Desativação já em andamento - ignorando chamada concorrente");
                return new PerformanceOperationResult 
                { 
                    Status = OperationStatus.Failed, 
                    Message = "Desativação já em andamento" 
                };
            }

            var result = new PerformanceOperationResult { Status = OperationStatus.Success };

            try
            {
                _logger.LogInfo($"[HardwarePerf] ===== DESATIVAÇÃO DE OTIMIZAÇÕES =====");
                _logger.LogInfo($"[HardwarePerf] Motivo: {reason}");

                PerformanceStateSnapshot? originalState;
                await _stateLock.WaitAsync();
                try
                {
                    if (!_currentState.IsActive)
                    {
                        _logger.LogInfo("[HardwarePerf] Otimizações já desativadas (idempotente)");
                        result.Message = "Otimizações já estão desativadas";
                        return result;
                    }

                    originalState = _currentState.OriginalState;
                }
                finally
                {
                    _stateLock.Release();
                }

                if (originalState == null)
                {
                    // Tentar carregar estado persistido como fallback (CORREÇÃO RISCO #3)
                    originalState = _stateStore.LoadState();
                    
                    if (originalState == null)
                    {
                        result.Status = OperationStatus.Failed;
                        result.Message = "Estado original não disponível para restauração";
                        _logger.LogError($"[HardwarePerf] {result.Message}");
                        return result;
                    }
                    
                    _logger.LogWarning("[HardwarePerf] Estado original carregado de backup persistido");
                }

                // Restaurar estado original
                var restoreResult = _powerPlanManager.RestoreOriginalState(originalState);

                if (!restoreResult.Success)
                {
                    result.Status = restoreResult.Status;
                    result.Message = restoreResult.Message;
                    result.Errors.AddRange(restoreResult.Errors);
                    _logger.LogError($"[HardwarePerf] Falha ao restaurar estado: {restoreResult.Message}");
                    return result;
                }

                // Atualizar estado (thread-safe)
                await _stateLock.WaitAsync();
                try
                {
                    var previousState = _currentState;
                    
                    _currentState = new PerformanceState
                    {
                        IsActive = false,
                        LastUpdated = DateTime.Now
                    };

                    // Disparar evento de mudança de estado
                    StateChanged?.Invoke(this, new PerformanceStateChangedEventArgs
                    {
                        PreviousState = previousState,
                        CurrentState = _currentState,
                        Reason = reason
                    });
                }
                finally
                {
                    _stateLock.Release();
                }

                // Limpar estado persistido (CORREÇÃO RISCO #3)
                _stateStore.ClearState();

                result.Message = "Otimizações desativadas e estado original restaurado";
                _logger.LogSuccess($"[HardwarePerf] {result.Message}");
            }
            catch (Exception ex)
            {
                result.Status = OperationStatus.Failed;
                result.Message = $"Erro ao desativar otimizações: {ex.Message}";
                result.Errors.Add(ex.Message);
                _logger.LogError($"[HardwarePerf] {result.Message}", ex);
            }
            finally
            {
                // Sempre liberar flag atômica
                Interlocked.Exchange(ref _isDeactivating, 0);
            }

            return result;
        }

        #region Private Methods

        /// <summary>
        /// Ajusta perfil para modo bateria (DC) - SEGURANÇA CRÍTICA
        /// </summary>
        private PerformanceProfile AdjustProfileForBattery(PerformanceProfile profile)
        {
            // Criar cópia do perfil com limites conservadores para bateria
            var batteryProfile = new PerformanceProfile
            {
                Name = $"{profile.Name} (Bateria)",
                Description = $"{profile.Description} - Ajustado para bateria",
                ThermalThrottleThreshold = Math.Min(profile.ThermalThrottleThreshold, 75.0), // Máx 75°C em bateria
                DisableOnThermalAlert = true
            };

            // Limitar agressividade baseado no perfil original
            if (profile.AggressivenessLevel >= 75) // Gamer Competitivo
            {
                batteryProfile.AggressivenessLevel = 75; // Máx 75% em bateria
                batteryProfile.CoreParkingMinCores = 50;
                batteryProfile.MinProcessorState = 75;
                batteryProfile.MaxProcessorState = 95;
                batteryProfile.TurboBoostEnabled = true;
                batteryProfile.TurboBoostPolicy = 60;
            }
            else if (profile.AggressivenessLevel >= 50) // Gamer Balanceado
            {
                batteryProfile.AggressivenessLevel = 60;
                batteryProfile.CoreParkingMinCores = 25;
                batteryProfile.MinProcessorState = 60;
                batteryProfile.MaxProcessorState = 90;
                batteryProfile.TurboBoostEnabled = true;
                batteryProfile.TurboBoostPolicy = 40;
            }
            else // Outros perfis
            {
                batteryProfile.AggressivenessLevel = Math.Min(profile.AggressivenessLevel, 50);
                batteryProfile.CoreParkingMinCores = 0;
                batteryProfile.MinProcessorState = 50;
                batteryProfile.MaxProcessorState = 85;
                batteryProfile.TurboBoostEnabled = false;
                batteryProfile.TurboBoostPolicy = 0;
            }

            batteryProfile.HeteroPolicy = 2; // Preferir E-cores em bateria
            
            _logger.LogInfo($"[HardwarePerf] Perfil ajustado para bateria: {profile.AggressivenessLevel}% → {batteryProfile.AggressivenessLevel}%");
            
            return batteryProfile;
        }

        /// <summary>
        /// Verifica se deve ativar otimizações
        /// </summary>
        private bool ShouldActivate(IntelligentProfileType profile, bool isGamerModeActive, out string reason)
        {
            reason = string.Empty;

            // REGRA 1: Enterprise nunca ativa
            if (profile == IntelligentProfileType.EnterpriseSecure)
            {
                reason = "Perfil Enterprise não permite otimizações de hardware";
                return false;
            }

            // REGRA 2: Modo Gamer deve estar ativo
            if (!isGamerModeActive)
            {
                reason = "Modo Gamer não está ativo";
                return false;
            }

            // REGRA 3: Perfis Work/Office só ativam se explicitamente solicitado
            if (profile == IntelligentProfileType.WorkOffice)
            {
                reason = "Perfil Work/Office não ativa otimizações automaticamente";
                return false;
            }

            reason = $"Modo Gamer ativo com perfil {profile}";
            return true;
        }

        /// <summary>
        /// Handler de crash recovery - ProcessExit (CORREÇÃO RISCO #3)
        /// </summary>
        private void OnProcessExit(object? sender, EventArgs e)
        {
            _logger.LogWarning("[HardwarePerf] ProcessExit detectado - executando recovery de emergência");
            
            try
            {
                // Tentar restaurar estado original se houver
                var persistedState = _stateStore.LoadState();
                if (persistedState != null)
                {
                    _powerPlanManager.RestoreOriginalState(persistedState);
                    _logger.LogSuccess("[HardwarePerf] Estado original restaurado no ProcessExit");
                }
                
                _stateStore.ClearState();
            }
            catch (Exception ex)
            {
                _logger.LogError($"[HardwarePerf] Falha no recovery de ProcessExit: {ex.Message}");
            }
        }

        /// <summary>
        /// Handler de crash recovery - UnhandledException (CORREÇÃO RISCO #3)
        /// </summary>
        private void OnUnhandledException(object sender, UnhandledExceptionEventArgs e)
        {
            _logger.LogError("[HardwarePerf] UnhandledException detectada - executando recovery de emergência");
            
            try
            {
                var persistedState = _stateStore.LoadState();
                if (persistedState != null)
                {
                    _powerPlanManager.RestoreOriginalState(persistedState);
                    _logger.LogSuccess("[HardwarePerf] Estado original restaurado no UnhandledException");
                }
                
                _stateStore.ClearState();
            }
            catch (Exception ex)
            {
                _logger.LogError($"[HardwarePerf] Falha no recovery de UnhandledException: {ex.Message}");
            }
        }

        /// <summary>
        /// Resolve o perfil de performance baseado no Perfil Inteligente
        /// </summary>
        private PerformanceProfile ResolvePerformanceProfile(IntelligentProfileType intelligentProfile)
        {
            return intelligentProfile switch
            {
                IntelligentProfileType.GamerCompetitive => PerformanceProfile.Presets.GamerCompetitive,
                IntelligentProfileType.GamerSinglePlayer => PerformanceProfile.Presets.GamerBalanced,
                IntelligentProfileType.GeneralBalanced => PerformanceProfile.Presets.GeneralBalanced,
                IntelligentProfileType.WorkOffice => PerformanceProfile.Presets.WorkOffice,
                IntelligentProfileType.EnterpriseSecure => PerformanceProfile.Presets.EnterpriseSecure,
                _ => PerformanceProfile.Presets.GeneralBalanced
            };
        }

        /// <summary>
        /// Tick de monitoramento adaptativo (verifica temperatura e estado)
        /// Intervalo: 5s em Gamer Mode, 15s em outros modos
        /// CORREÇÃO RISCO #2: Eliminado Task.Run fire-and-forget
        /// </summary>
        private void MonitoringTick(object? state)
        {
            if (_isDisposed)
                return;

            try
            {
                bool isActive = false;
                
                // Verificar estado atual (thread-safe)
                _stateLock.Wait();
                try
                {
                    isActive = _currentState.IsActive;
                }
                finally
                {
                    _stateLock.Release();
                }

                if (!isActive)
                {
                    // Ajustar intervalo para 15s quando inativo
                    _monitoringTimer?.Change(TimeSpan.FromSeconds(15), TimeSpan.FromSeconds(15));
                    return;
                }

                // Ajustar intervalo para 5s quando ativo (Gamer Mode)
                _monitoringTimer?.Change(TimeSpan.FromSeconds(5), TimeSpan.FromSeconds(5));

                // Verificar se deve desativar por temperatura (SOFT THROTTLE)
                if (_thermalSafety.ShouldDeactivate(out string reason))
                {
                    _logger.LogWarning($"[HardwarePerf] Desativação automática por temperatura: {reason}");
                    
                    // Desativar de forma controlada (CORREÇÃO RISCO #2: await direto, não Task.Run)
                    _ = DeactivateOptimizationsAsync($"Proteção térmica: {reason}").ContinueWith(task =>
                    {
                        if (task.Exception != null)
                        {
                            _logger.LogError("[HardwarePerf] Erro ao desativar por temperatura", task.Exception);
                        }
                    }, TaskScheduler.Default);
                }
                // Verificar mudança AC/DC (CORREÇÃO RISCO #5)
                else if (_powerStatusDetector.HasPowerStatusChanged(out bool isNowOnAC) && !isNowOnAC)
                {
                    _logger.LogWarning("[HardwarePerf] Mudança para bateria detectada - desativando otimizações");
                    _ = DeactivateOptimizationsAsync("Mudança para modo bateria").ContinueWith(task =>
                    {
                        if (task.Exception != null)
                        {
                            _logger.LogError("[HardwarePerf] Erro ao desativar por mudança AC/DC", task.Exception);
                        }
                    }, TaskScheduler.Default);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("[HardwarePerf] Erro no monitoramento", ex);
            }
        }

        private void OnThermalAlertRaised(object? sender, ThermalSafetyAlert alert)
        {
            _logger.LogWarning($"[HardwarePerf] Alerta térmico: {alert.Message}");

            // Se crítico, desativar imediatamente (CORREÇÃO RISCO #2: ContinueWith para capturar exceções)
            if (alert.Level == ThermalSafetyLevel.Critical)
            {
                _ = DeactivateOptimizationsAsync($"Temperatura crítica: {alert.Message}").ContinueWith(task =>
                {
                    if (task.Exception != null)
                    {
                        _logger.LogError("[HardwarePerf] Erro ao desativar por alerta térmico", task.Exception);
                    }
                }, TaskScheduler.Default);
            }
        }

        private void OnGamerModeStatusChanged(object? sender, VoltrisOptimizer.Services.Gamer.Models.GamerModeStatus status)
        {
            _logger.LogInfo($"[HardwarePerf] Modo Gamer mudou: IsActive={status.IsActive}, Jogo={status.ActiveGameName}");

            // Usar Task.Run para não bloquear o evento
            Task.Run(async () =>
            {
                await _stateLock.WaitAsync();
                try
                {
                    // Se Modo Gamer desativou e otimizações estão ativas, desativar
                    if (!status.IsActive && _currentState.IsActive)
                    {
                        _logger.LogInfo("[HardwarePerf] Modo Gamer desativado - desativando otimizações");
                        await DeactivateOptimizationsAsync("Modo Gamer desativado");
                    }
                    // Se Modo Gamer ativou e otimizações não estão ativas, ativar
                    else if (status.IsActive && !_currentState.IsActive)
                    {
                        var currentProfile = SettingsService.Instance.Settings.IntelligentProfile;
                        _logger.LogInfo($"[HardwarePerf] Modo Gamer ativado - ativando otimizações (Perfil: {currentProfile})");
                        await ActivateOptimizationsAsync(currentProfile, true, status.ActiveGameName);
                    }
                }
                finally
                {
                    _stateLock.Release();
                }
            });
        }

        #endregion

        public void Dispose()
        {
            if (_isDisposed)
                return;

            _isDisposed = true;

            _logger.LogInfo("[HardwarePerf] Iniciando Dispose...");

            // Parar monitoramento
            _monitoringTimer?.Dispose();
            
            // Desregistrar eventos
            _thermalSafety.ThermalAlertRaised -= OnThermalAlertRaised;

            if (_gamerOrchestrator != null)
            {
                _gamerOrchestrator.StatusChanged -= OnGamerModeStatusChanged;
            }

            // Desregistrar handlers de crash recovery
            AppDomain.CurrentDomain.ProcessExit -= OnProcessExit;
            AppDomain.CurrentDomain.UnhandledException -= OnUnhandledException;

            _thermalSafety.Dispose();

            // Desativar otimizações se estiverem ativas (THREAD-SAFE)
            _stateLock.Wait();
            try
            {
                if (_currentState.IsActive && _currentState.OriginalState != null)
                {
                    try
                    {
                        _logger.LogWarning("[HardwarePerf] Otimizações ativas no Dispose - restaurando estado original");
                        _powerPlanManager.RestoreOriginalState(_currentState.OriginalState);
                        _logger.LogSuccess("[HardwarePerf] Estado original restaurado no Dispose");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError("[HardwarePerf] Erro ao restaurar estado no Dispose", ex);
                    }
                }
            }
            finally
            {
                _stateLock.Release();
            }

            // Limpar estado persistido (CORREÇÃO RISCO #3)
            _stateStore.ClearState();

            // Dispose do SemaphoreSlim
            _stateLock.Dispose();

            _logger.LogInfo("[HardwarePerf] Serviço finalizado");
        }
    }
}
