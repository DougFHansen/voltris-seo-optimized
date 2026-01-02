using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Helpers;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services.Gamer.GamerModeManager;
using VoltrisOptimizer.Utils;

namespace VoltrisOptimizer.Services.Gamer.OptimizationModules
{
    /// <summary>
    /// Gerenciador de sessão gamer que orquestra a aplicação e reversão
    /// de todos os módulos de otimização temporários
    /// </summary>
    public class GamerSessionManager : IDisposable
    {
        private readonly ILoggingService _logger;
        private readonly IPowerPlanService _powerPlanService;
        private readonly IProcessOptimizationService _processService;
        private readonly IRegistryService _registryService;
        private readonly IGamerOptimizationModule[] _modules;
        
        private GamerSessionContext? _currentContext;
        private bool _isSessionActive = false;
        private readonly object _lock = new();
        private bool _disposed = false;

        /// <summary>
        /// Evento disparado quando o estado da sessão muda
        /// </summary>
        public event EventHandler<SessionStateChangedEventArgs>? SessionStateChanged;

        public GamerSessionManager(
            ILoggingService logger,
            IPowerPlanService powerPlanService,
            IProcessOptimizationService processService,
            IRegistryService registryService,
            IGamerOptimizationModule[] modules)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _powerPlanService = powerPlanService ?? throw new ArgumentNullException(nameof(powerPlanService));
            _processService = processService ?? throw new ArgumentNullException(nameof(processService));
            _registryService = registryService ?? throw new ArgumentNullException(nameof(registryService));
            _modules = modules ?? throw new ArgumentNullException(nameof(modules));
        }

        /// <summary>
        /// Indica se uma sessão está ativa
        /// </summary>
        public bool IsSessionActive
        {
            get
            {
                lock (_lock)
                {
                    return _isSessionActive;
                }
            }
        }

        /// <summary>
        /// ID da sessão atual
        /// </summary>
        public string? CurrentSessionId => _currentContext?.SessionId;

        /// <summary>
        /// Inicia uma sessão gamer aplicando todos os módulos
        /// </summary>
        public async Task<SessionStartResult> StartSessionAsync(CancellationToken ct = default)
        {
            lock (_lock)
            {
                if (_isSessionActive)
                {
                    return new SessionStartResult
                    {
                        Success = false,
                        ErrorMessage = "Uma sessão já está ativa"
                    };
                }
            }

            var result = new SessionStartResult();

            try
            {
                _logger.LogInfo("═══════════════════════════════════════════════");
                _logger.LogInfo("[GamerSession] Iniciando sessão gamer...");

                // 1. Validação de pré-condições
                if (!ValidatePreconditions(result))
                {
                    return result;
                }

                // 2. Criar contexto da sessão
                var context = new GamerSessionContext
                {
                    Logger = _logger,
                    PowerPlanService = _powerPlanService,
                    ProcessService = _processService,
                    RegistryService = _registryService,
                    RollbackRegistry = new RollbackRegistry(_logger)
                };

                // 3. Capturar snapshot do estado atual
                await CaptureSystemSnapshotAsync(context, ct);

                // 4. Aplicar módulos em ordem segura
                var appliedModules = new List<string>();
                var failedModules = new List<string>();

                // Ordem: ProcessCountOffload → LatencyReduction → FrameRateOptimizations
                var orderedModules = _modules.OrderBy(m => m.Name switch
                {
                    "Process Count Offload" => 1,
                    "Latency Reduction" => 2,
                    "Frame Rate Optimizations" => 3,
                    _ => 99
                }).ToArray();

                foreach (var module in orderedModules)
                {
                    ct.ThrowIfCancellationRequested();

                    try
                    {
                        _logger.LogInfo($"[GamerSession] Aplicando módulo: {module.Name}");
                        var moduleResult = await module.ApplyAsync(context, ct);

                        if (moduleResult.Success)
                        {
                            appliedModules.Add(module.Name);
                            result.TotalChangesApplied += moduleResult.ChangesApplied;
                            _logger.LogSuccess($"[GamerSession] ✓ {module.Name}: {moduleResult.ChangesApplied} mudanças");
                        }
                        else
                        {
                            failedModules.Add($"{module.Name}: {moduleResult.ErrorMessage}");
                            _logger.LogWarning($"[GamerSession] ✗ {module.Name}: {moduleResult.ErrorMessage}");
                        }
                    }
                    catch (Exception ex)
                    {
                        failedModules.Add($"{module.Name}: {ex.Message}");
                        _logger.LogError($"[GamerSession] Erro ao aplicar {module.Name}: {ex.Message}", ex);
                    }
                }

                // 5. Se pelo menos um módulo foi aplicado, marcar sessão como ativa
                if (appliedModules.Count > 0)
                {
                    lock (_lock)
                    {
                        _currentContext = context;
                        _isSessionActive = true;
                    }

                    result.Success = true;
                    result.AppliedModules = appliedModules.ToArray();
                    result.FailedModules = failedModules.ToArray();

                    OnSessionStateChanged(true, context.SessionId);

                    _logger.LogSuccess("═══════════════════════════════════════════════");
                    _logger.LogSuccess($"[GamerSession] Sessão iniciada: {context.SessionId}");
                    _logger.LogSuccess($"[GamerSession] {appliedModules.Count} módulos aplicados, {result.TotalChangesApplied} mudanças");
                    _logger.LogSuccess("═══════════════════════════════════════════════");
                }
                else
                {
                    // Nenhum módulo foi aplicado, fazer rollback
                    _logger.LogWarning("[GamerSession] Nenhum módulo foi aplicado, revertendo...");
                    await RevertAllModulesAsync(context, ct);
                    result.Success = false;
                    result.ErrorMessage = "Nenhum módulo foi aplicado com sucesso";
                }
            }
            catch (OperationCanceledException)
            {
                _logger.LogWarning("[GamerSession] Operação cancelada");
                result.Success = false;
                result.ErrorMessage = "Operação cancelada pelo usuário";
            }
            catch (Exception ex)
            {
                _logger.LogError($"[GamerSession] Erro crítico ao iniciar sessão: {ex.Message}", ex);
                result.Success = false;
                result.ErrorMessage = ex.Message;

                // Tentar rollback em caso de erro
                if (_currentContext != null)
                {
                    await RevertAllModulesAsync(_currentContext, CancellationToken.None);
                }
            }

            return result;
        }

        /// <summary>
        /// Para a sessão gamer revertendo todas as mudanças
        /// </summary>
        public async Task<SessionStopResult> StopSessionAsync(CancellationToken ct = default)
        {
            GamerSessionContext? context;

            lock (_lock)
            {
                if (!_isSessionActive || _currentContext == null)
                {
                    return new SessionStopResult
                    {
                        Success = false,
                        ErrorMessage = "Nenhuma sessão está ativa"
                    };
                }

                context = _currentContext;
            }

            var result = new SessionStopResult();

            try
            {
                _logger.LogInfo("═══════════════════════════════════════════════");
                _logger.LogInfo("[GamerSession] Parando sessão gamer...");

                // Reverter módulos na ordem inversa
                var revertedModules = new List<string>();
                var failedModules = new List<string>();

                var orderedModules = _modules.OrderByDescending(m => m.Name switch
                {
                    "Process Count Offload" => 1,
                    "Latency Reduction" => 2,
                    "Frame Rate Optimizations" => 3,
                    _ => 99
                }).ToArray();

                foreach (var module in orderedModules)
                {
                    ct.ThrowIfCancellationRequested();

                    try
                    {
                        _logger.LogInfo($"[GamerSession] Revertendo módulo: {module.Name}");
                        var moduleResult = await module.RevertAsync(context, ct);

                        if (moduleResult.Success)
                        {
                            revertedModules.Add(module.Name);
                            result.TotalChangesReverted += moduleResult.ChangesReverted;
                            _logger.LogSuccess($"[GamerSession] ✓ {module.Name}: {moduleResult.ChangesReverted} mudanças revertidas");
                        }
                        else
                        {
                            failedModules.Add($"{module.Name}: {moduleResult.ErrorMessage}");
                            _logger.LogWarning($"[GamerSession] ✗ {module.Name}: {moduleResult.ErrorMessage}");
                        }
                    }
                    catch (Exception ex)
                    {
                        failedModules.Add($"{module.Name}: {ex.Message}");
                        _logger.LogError($"[GamerSession] Erro ao reverter {module.Name}: {ex.Message}", ex);
                    }
                }

                // Restaurar power plan
                await RestorePowerPlanAsync(context, ct);

                // Limpar contexto
                lock (_lock)
                {
                    _currentContext = null;
                    _isSessionActive = false;
                }

                result.Success = revertedModules.Count > 0 || failedModules.Count == 0;
                result.RevertedModules = revertedModules.ToArray();
                result.FailedModules = failedModules.ToArray();

                OnSessionStateChanged(false, context.SessionId);

                _logger.LogSuccess("═══════════════════════════════════════════════");
                _logger.LogSuccess($"[GamerSession] Sessão parada: {context.SessionId}");
                _logger.LogSuccess($"[GamerSession] {revertedModules.Count} módulos revertidos, {result.TotalChangesReverted} mudanças");
                _logger.LogSuccess("═══════════════════════════════════════════════");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[GamerSession] Erro crítico ao parar sessão: {ex.Message}", ex);
                result.Success = false;
                result.ErrorMessage = ex.Message;
            }

            return result;
        }

        /// <summary>
        /// Força rollback de emergência
        /// </summary>
        public async Task<bool> ForceEmergencyRollbackAsync()
        {
            if (_currentContext == null)
                return true;

            try
            {
                _logger.LogWarning("[GamerSession] ⚠️ ROLLBACK DE EMERGÊNCIA INICIADO");
                await RevertAllModulesAsync(_currentContext, CancellationToken.None);
                await RestorePowerPlanAsync(_currentContext, CancellationToken.None);

                lock (_lock)
                {
                    _currentContext = null;
                    _isSessionActive = false;
                }

                OnSessionStateChanged(false, _currentContext?.SessionId);
                _logger.LogSuccess("[GamerSession] ✓ Rollback de emergência concluído");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[GamerSession] ✗ Erro no rollback de emergência: {ex.Message}", ex);
                return false;
            }
        }

        private bool ValidatePreconditions(SessionStartResult result)
        {
            // Verificar permissões administrativas
            if (!AdminHelper.IsRunningAsAdministrator())
            {
                result.ErrorMessage = "Permissões administrativas são necessárias";
                _logger.LogWarning("[GamerSession] Validação falhou: Sem permissões administrativas");
                return false;
            }

            // Verificar compatibilidade do SO (Windows 10+)
            // Usar WindowsCompatibilityHelper como fonte única de verdade
            if (!VoltrisOptimizer.Helpers.WindowsCompatibilityHelper.IsWindows10OrHigher())
            {
                result.ErrorMessage = "Windows 10 ou superior é necessário";
                _logger.LogWarning("[GamerSession] Validação falhou: SO incompatível");
                return false;
            }

            return true;
        }

        private async Task CaptureSystemSnapshotAsync(GamerSessionContext context, CancellationToken ct)
        {
            try
            {
                _logger.LogInfo("[GamerSession] Capturando snapshot do sistema...");

                // Snapshot do power plan
                var (originalGuid, originalName) = _powerPlanService.GetActivePowerPlan();
                context.RollbackRegistry.RegisterPowerPlan(originalGuid, originalName);
                _logger.LogInfo($"[GamerSession] Power plan capturado: {originalName} ({originalGuid})");

                await Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[GamerSession] Erro ao capturar snapshot: {ex.Message}");
            }
        }

        private async Task RevertAllModulesAsync(GamerSessionContext context, CancellationToken ct)
        {
            var orderedModules = _modules.OrderByDescending(m => m.Name switch
            {
                "Process Count Offload" => 1,
                "Latency Reduction" => 2,
                "Frame Rate Optimizations" => 3,
                _ => 99
            }).ToArray();

            foreach (var module in orderedModules)
            {
                try
                {
                    await module.RevertAsync(context, ct);
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[GamerSession] Erro ao reverter {module.Name}: {ex.Message}", ex);
                }
            }
        }

        private async Task RestorePowerPlanAsync(GamerSessionContext context, CancellationToken ct)
        {
            try
            {
                var snapshot = context.RollbackRegistry.GetPowerPlanSnapshot();
                if (snapshot.HasValue)
                {
                    _logger.LogInfo($"[GamerSession] Restaurando power plan: {snapshot.Value.Name}");
                    _powerPlanService.SetPowerPlanByGuid(snapshot.Value.Guid);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[GamerSession] Erro ao restaurar power plan: {ex.Message}");
            }

            await Task.CompletedTask;
        }

        private void OnSessionStateChanged(bool isActive, string? sessionId)
        {
            SessionStateChanged?.Invoke(this, new SessionStateChangedEventArgs
            {
                IsActive = isActive,
                SessionId = sessionId
            });
        }

        public void Dispose()
        {
            if (_disposed)
                return;

            if (_isSessionActive)
            {
                try
                {
                    StopSessionAsync().Wait(5000);
                }
                catch
                {
                    // Ignorar erros no dispose
                }
            }

            _disposed = true;
        }
    }

    /// <summary>
    /// Resultado do início de sessão
    /// </summary>
    public class SessionStartResult
    {
        public bool Success { get; set; }
        public string? ErrorMessage { get; set; }
        public int TotalChangesApplied { get; set; }
        public string[] AppliedModules { get; set; } = Array.Empty<string>();
        public string[] FailedModules { get; set; } = Array.Empty<string>();
    }

    /// <summary>
    /// Resultado da parada de sessão
    /// </summary>
    public class SessionStopResult
    {
        public bool Success { get; set; }
        public string? ErrorMessage { get; set; }
        public int TotalChangesReverted { get; set; }
        public string[] RevertedModules { get; set; } = Array.Empty<string>();
        public string[] FailedModules { get; set; } = Array.Empty<string>();
    }

    /// <summary>
    /// Argumentos do evento de mudança de estado
    /// </summary>
    public class SessionStateChangedEventArgs : EventArgs
    {
        public bool IsActive { get; set; }
        public string? SessionId { get; set; }
    }
}

