using System;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using VoltrisOptimizer.Services.Gamer.Models;
using VoltrisOptimizer.Services.Optimization.Unification;

namespace VoltrisOptimizer.Services.Gamer.Implementation
{
    /// <summary>
    /// PRE-OPTIMIZATION ENGINE
    /// CORREÇÃO CRÍTICA #1: Aplicar otimizações ANTES do jogo iniciar
    /// 
    /// Timing correto:
    /// 1. PrepareSystemForGaming() - Aplicar TODAS otimizações
    /// 2. WaitForGameLaunch() - Aguardar jogo iniciar
    /// 3. AttachToGameProcess() - Vincular ao processo
    /// </summary>
    public class GamerModePreOptimizer
    {
        private readonly ILoggingService _logger;
        private readonly ICpuGamingOptimizer _cpuOptimizer;
        private readonly IGpuGamingOptimizer _gpuOptimizer;
        private readonly INetworkGamingOptimizer _networkOptimizer;
        private readonly IMemoryGamingOptimizer _memoryOptimizer;
        private readonly ITimerResolutionService? _timerService;
        private TimerResolutionManager? _timerManager;
        
        private bool _isSystemPrepared = false;
        private bool _timerRequested = false;

        // ✅ FIX BUG #5: Flags individuais por otimização para restauração fiel
        // Garante que RestoreSystemAsync reverta apenas o que foi efetivamente aplicado
        private bool _cpuWasApplied  = false;
        private bool _gpuWasApplied  = false;
        private bool _netWasApplied  = false;

        public GamerModePreOptimizer(
            ILoggingService logger,
            ICpuGamingOptimizer cpuOptimizer,
            IGpuGamingOptimizer gpuOptimizer,
            INetworkGamingOptimizer networkOptimizer,
            IMemoryGamingOptimizer memoryOptimizer,
            ITimerResolutionService? timerService = null)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _cpuOptimizer = cpuOptimizer ?? throw new ArgumentNullException(nameof(cpuOptimizer));
            _gpuOptimizer = gpuOptimizer ?? throw new ArgumentNullException(nameof(gpuOptimizer));
            _networkOptimizer = networkOptimizer ?? throw new ArgumentNullException(nameof(networkOptimizer));
            _memoryOptimizer = memoryOptimizer ?? throw new ArgumentNullException(nameof(memoryOptimizer));
            _timerService = timerService;
            if (timerService != null)
                _timerManager = new TimerResolutionManager(logger, timerService);
        }

        /// <summary>
        /// FASE 1: Preparar sistema ANTES do jogo iniciar.
        /// Respeita as opções do usuário — só aplica o que está habilitado.
        ///
        /// ✅ FIX BUG #5: Flags individuais por otimização garantem que RestoreSystemAsync
        /// reverta apenas o que foi efetivamente aplicado, mesmo em caso de falha parcial.
        /// </summary>
        public async Task<bool> PrepareSystemForGamingAsync(
            GamerOptimizationOptions? options = null,
            CancellationToken cancellationToken = default)
        {
            if (_isSystemPrepared)
            {
                _logger.LogWarning("[PreOptimizer] Sistema já preparado — ignorando chamada duplicada.");
                return true;
            }

            // Se não receber opções, aplicar tudo (compatibilidade)
            bool doCpu   = options?.OptimizeCpu     ?? true;
            bool doGpu   = options?.OptimizeGpu     ?? true;
            bool doNet   = options?.OptimizeNetwork ?? true;
            bool doMem   = options?.OptimizeMemory  ?? true;
            bool doTimer = options?.ReduceLatency   ?? true;

            _logger.LogInfo("═══════════════════════════════════════════");
            _logger.LogInfo("🚀 [PRE-OPTIMIZER] PREPARANDO SISTEMA PARA GAMING");
            _logger.LogInfo($"[PreOptimizer] Opções: CPU={doCpu} GPU={doGpu} Net={doNet} Mem={doMem} Timer={doTimer}");
            _logger.LogInfo("═══════════════════════════════════════════");

            var startTime = DateTime.Now;
            int step = 0;
            int totalSteps = (doCpu ? 1 : 0) + (doGpu ? 1 : 0) + (doNet ? 1 : 0) + (doMem ? 1 : 0) + (doTimer ? 1 : 0);
            int applied = 0;

            // ✅ FIX BUG #5: Flags individuais — rastrear o que foi aplicado com sucesso
            bool cpuApplied   = false;
            bool gpuApplied   = false;
            bool netApplied   = false;

            if (doCpu)
            {
                step++;
                _logger.LogInfo($"[PreOptimizer] [{step}/{totalSteps}] Otimizando CPU (Power Plan, Core Parking, Scheduler)...");
                try
                {
                    await _cpuOptimizer.OptimizeAsync(cancellationToken);
                    cpuApplied = true;
                    applied++;
                    _logger.LogSuccess($"[PreOptimizer] [{step}/{totalSteps}] ✅ CPU otimizada.");
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[PreOptimizer] [{step}/{totalSteps}] ❌ Falha ao otimizar CPU: {ex.Message}", ex);
                    // Não abortar — continuar com as demais otimizações
                }
            }

            if (doGpu)
            {
                step++;
                _logger.LogInfo($"[PreOptimizer] [{step}/{totalSteps}] Otimizando GPU (Performance Mode)...");
                try
                {
                    await _gpuOptimizer.OptimizeAsync(cancellationToken);
                    gpuApplied = true;
                    applied++;
                    _logger.LogSuccess($"[PreOptimizer] [{step}/{totalSteps}] ✅ GPU otimizada.");
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[PreOptimizer] [{step}/{totalSteps}] ❌ Falha ao otimizar GPU: {ex.Message}", ex);
                }
            }

            if (doNet)
            {
                step++;
                _logger.LogInfo($"[PreOptimizer] [{step}/{totalSteps}] Otimizando Rede (TCP Stack, Latency)...");
                try
                {
                    await _networkOptimizer.OptimizeAsync(cancellationToken);
                    netApplied = true;
                    applied++;
                    _logger.LogSuccess($"[PreOptimizer] [{step}/{totalSteps}] ✅ Rede otimizada.");
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[PreOptimizer] [{step}/{totalSteps}] ❌ Falha ao otimizar Rede: {ex.Message}", ex);
                }
            }

            if (doMem)
            {
                step++;
                _logger.LogInfo($"[PreOptimizer] [{step}/{totalSteps}] Otimizando Memória (Standby List)...");
                try
                {
                    _memoryOptimizer.CleanStandbyList();
                    applied++;
                    _logger.LogSuccess($"[PreOptimizer] [{step}/{totalSteps}] ✅ Memória otimizada.");
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[PreOptimizer] [{step}/{totalSteps}] ❌ Falha ao otimizar Memória: {ex.Message}", ex);
                }
            }

            if (doTimer && _timerManager != null)
            {
                step++;
                _logger.LogInfo($"[PreOptimizer] [{step}/{totalSteps}] Otimizando Timer Resolution...");
                try
                {
                    _timerManager.RequestHighPrecision("GamerModePreOptimizer");
                    _timerRequested = true;
                    applied++;
                    _logger.LogSuccess($"[PreOptimizer] [{step}/{totalSteps}] ✅ Timer Resolution configurado.");
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[PreOptimizer] [{step}/{totalSteps}] ❌ Falha ao configurar Timer: {ex.Message}", ex);
                }
            }

            // ✅ FIX BUG #5: Marcar como preparado APENAS se ao menos uma otimização foi aplicada.
            // Isso garante que RestoreSystemAsync saiba que há algo para reverter.
            _isSystemPrepared = applied > 0;
            // Persistir flags individuais para restauração fiel
            _cpuWasApplied   = cpuApplied;
            _gpuWasApplied   = gpuApplied;
            _netWasApplied   = netApplied;

            var duration = DateTime.Now - startTime;
            _logger.LogSuccess($"[PreOptimizer] ✅ Preparação concluída em {duration.TotalMilliseconds:F0}ms — {applied}/{totalSteps} otimizações aplicadas.");
            _logger.LogInfo($"[PreOptimizer] Flags: CPU={cpuApplied} GPU={gpuApplied} Net={netApplied} Mem=N/A Timer={_timerRequested}");

            if (applied == 0)
            {
                _logger.LogWarning("[PreOptimizer] ⚠️ Nenhuma otimização foi aplicada com sucesso.");
                return false;
            }

            return true;
        }

        /// <summary>
        /// FASE 2: Restaurar sistema ao estado original.
        /// ✅ FIX BUG #5: Reverte apenas o que foi efetivamente aplicado (flags individuais).
        /// </summary>
        public async Task<bool> RestoreSystemAsync(CancellationToken cancellationToken = default)
        {
            if (!_isSystemPrepared)
            {
                _logger.LogInfo("[PreOptimizer] RestoreSystemAsync chamado mas _isSystemPrepared=false — nada a restaurar.");
                return true;
            }

            _logger.LogInfo("═══════════════════════════════════════════");
            _logger.LogInfo("🔄 [PRE-OPTIMIZER] RESTAURANDO SISTEMA");
            _logger.LogInfo($"[PreOptimizer] Flags a restaurar: CPU={_cpuWasApplied} GPU={_gpuWasApplied} Net={_netWasApplied} Timer={_timerRequested}");
            _logger.LogInfo("═══════════════════════════════════════════");

            var startTime = DateTime.Now;
            int restored = 0;
            bool allOk = true;

            try
            {
                // Restaurar na ordem inversa da aplicação

                if (_timerRequested && _timerManager != null)
                {
                    _logger.LogInfo("[PreOptimizer] Restaurando Timer Resolution...");
                    try
                    {
                        _timerManager.ReleaseHighPrecision("GamerModePreOptimizer.Restore");
                        _timerRequested = false;
                        restored++;
                        _logger.LogSuccess("[PreOptimizer] ✅ Timer Resolution restaurado.");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"[PreOptimizer] ❌ Falha ao restaurar Timer: {ex.Message}", ex);
                        allOk = false;
                    }
                }

                if (_netWasApplied)
                {
                    _logger.LogInfo("[PreOptimizer] Restaurando Rede...");
                    try
                    {
                        await _networkOptimizer.RestoreAsync(cancellationToken);
                        _netWasApplied = false;
                        restored++;
                        _logger.LogSuccess("[PreOptimizer] ✅ Rede restaurada.");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"[PreOptimizer] ❌ Falha ao restaurar Rede: {ex.Message}", ex);
                        allOk = false;
                    }
                }

                if (_gpuWasApplied)
                {
                    _logger.LogInfo("[PreOptimizer] Restaurando GPU...");
                    try
                    {
                        await _gpuOptimizer.RestoreAsync(cancellationToken);
                        _gpuWasApplied = false;
                        restored++;
                        _logger.LogSuccess("[PreOptimizer] ✅ GPU restaurada.");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"[PreOptimizer] ❌ Falha ao restaurar GPU: {ex.Message}", ex);
                        allOk = false;
                    }
                }

                if (_cpuWasApplied)
                {
                    _logger.LogInfo("[PreOptimizer] Restaurando CPU...");
                    try
                    {
                        await _cpuOptimizer.RestoreAsync(cancellationToken);
                        _cpuWasApplied = false;
                        restored++;
                        _logger.LogSuccess("[PreOptimizer] ✅ CPU restaurada.");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"[PreOptimizer] ❌ Falha ao restaurar CPU: {ex.Message}", ex);
                        allOk = false;
                    }
                }

                _isSystemPrepared = false;
                var duration = DateTime.Now - startTime;
                _logger.LogSuccess($"[PreOptimizer] ✅ Restauração concluída em {duration.TotalMilliseconds:F0}ms — {restored} componentes restaurados. AllOk={allOk}");
                _logger.LogInfo("═══════════════════════════════════════════");

                return allOk;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[PreOptimizer] ❌ Erro crítico ao restaurar sistema: {ex.Message}", ex);
                _isSystemPrepared = false; // Garantir reset mesmo em falha crítica
                return false;
            }
        }

        public bool IsSystemPrepared => _isSystemPrepared;
    }
}
