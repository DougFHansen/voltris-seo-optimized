using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.Core.SystemIntelligenceProfiler
{
    /// <summary>
    /// Exceção lançada quando uma ação não pode ser aplicada porque não é aplicável no momento
    /// (ex: modo gamer sem jogo rodando). Não deve ser contada como erro.
    /// </summary>
    public class ActionNotApplicableException : Exception
    {
        public ActionNotApplicableException(string message) : base(message) { }
    }
    
    public class SystemIntelligenceProfiler : ISystemProfiler
    {
        private readonly IAuditCollector _collector;
        private readonly IDecisionEngine _engine;
        private readonly ProfileStore _store;
        private readonly IRollbackManager _rollback;
        private readonly Interfaces.ICompatibilityPolicy _policy;
        private readonly SystemSafetyGuard _guard;
        private readonly Services.ILoggingService? _logger;
        private ProfilerReport? _lastReport;

        public bool RequireGate => !IsGateCompleted;
        public bool IsGateCompleted => _store.Load().QuestionnaireCompleted && new OnboardingService().HasCompletedOnboarding();

        public SystemIntelligenceProfiler()
        {
            try
            {
                // Adicionar logs para verificar a inicialização de cada componente
                try { App.LoggingService?.LogInfo("[PROFILER] Iniciando inicialização do SystemIntelligenceProfiler"); } catch { }
                
                _collector = new AuditCollector();
                try { App.LoggingService?.LogInfo("[PROFILER] AuditCollector inicializado"); } catch { }
                
                _engine = new DecisionEngine();
                try { App.LoggingService?.LogInfo("[PROFILER] DecisionEngine inicializado"); } catch { }
                
                _store = new ProfileStore();
                try { App.LoggingService?.LogInfo("[PROFILER] ProfileStore inicializado"); } catch { }
                
                _rollback = new RollbackManager();
                try { App.LoggingService?.LogInfo("[PROFILER] RollbackManager inicializado"); } catch { }
                
                _policy = new DefaultCompatibilityPolicy();
                try { App.LoggingService?.LogInfo("[PROFILER] DefaultCompatibilityPolicy inicializado"); } catch { }
                
                _logger = App.LoggingService;
                try { App.LoggingService?.LogInfo("[PROFILER] Logger configurado"); } catch { }
                
                _guard = new SystemSafetyGuard(_policy, _logger ?? new LoggingService(System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs")));
                try { App.LoggingService?.LogInfo("[PROFILER] SystemSafetyGuard inicializado"); } catch { }
                
                try { App.LoggingService?.LogSuccess("[PROFILER] SystemIntelligenceProfiler inicializado com sucesso"); } catch { }
            }
            catch (Exception ex)
            {
                // Logar qualquer erro na inicialização
                try 
                { 
                    var logDir = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                    var logger = new LoggingService(logDir);
                    logger.LogError("[PROFILER] Erro na inicialização do SystemIntelligenceProfiler: " + ex.Message, ex);
                } 
                catch { }
                
                // Re-lançar a exceção
                throw;
            }
        }

        public SystemIntelligenceProfiler(IAuditCollector collector,
            IDecisionEngine engine,
            ProfileStore store,
            IRollbackManager rollback,
            Interfaces.ICompatibilityPolicy policy,
            Services.ILoggingService logger)
        {
            _collector = collector;
            _engine = engine;
            _store = store;
            _rollback = rollback;
            _policy = policy;
            _logger = logger;
            _guard = new SystemSafetyGuard(policy, logger);
        }

        public async Task<ProfilerReport> StartAuditAsync(CancellationToken ct)
        {
            try { App.LoggingService?.LogInfo("[PROFILER] Iniciando auditoria"); } catch { }
            try
            {
                // Registrar início da operação
                var startTime = DateTime.UtcNow;
                
                // Criar um cancellation token com timeout de 30 segundos para a operação completa
                using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
                cts.CancelAfter(TimeSpan.FromSeconds(30));
                
                // Verificar cancelamento antes de começar
                cts.Token.ThrowIfCancellationRequested();
                
                var audit = await _collector.CollectAsync(cts.Token);
                
                // Verificar cancelamento após a coleta
                cts.Token.ThrowIfCancellationRequested();
                
                // Verificar se a operação está demorando muito
                if ((DateTime.UtcNow - startTime).TotalSeconds > 25)
                {
                    try { App.LoggingService?.LogWarning("[PROFILER] Coleta de auditoria demorou mais que 25 segundos"); } catch { }
                }
                
                var answers = _store.Load().Answers;
                
                // Verificar cancelamento antes de avaliar
                cts.Token.ThrowIfCancellationRequested();
                
                var report = _engine.Evaluate(audit, answers);
                
                // Verificar cancelamento após avaliar
                cts.Token.ThrowIfCancellationRequested();
                
                try { App.LoggingService?.LogSuccess($"[PROFILER] Auditoria concluída | recs={report.Recommendations.Count}"); } catch { }
                return report;
            }
            catch (OperationCanceledException)
            {
                try { _logger?.LogWarning("[PROFILER] Auditoria cancelada pelo usuário ou timeout"); } catch { }
                // Retornar relatório vazio em caso de cancelamento
                return new ProfilerReport
                {
                    Audit = new AuditData(),
                    Answers = new UserAnswers(),
                    Recommendations = new List<ActionRecommendation>()
                };
            }
            catch (System.Exception ex)
            {
                try { _logger?.LogError("[PROFILER] Falha na auditoria: " + ex.Message, ex); } catch { }
                // Fallback resiliente: retorna relatório básico para não quebrar a UI
                var fallbackAudit = new AuditData();
                var fallbackAnswers = _store.Load().Answers;
                var fallbackReport = _engine.Evaluate(fallbackAudit, fallbackAnswers);
                return fallbackReport;
            }
        }

        public async Task<ProfilerReport> AnalyzeAsync(CancellationToken ct = default)
        {
            _lastReport = await StartAuditAsync(ct);
            return _lastReport;
        }

        public Task<ProfilerReport?> GetLastReportAsync()
        {
            return Task.FromResult(_lastReport);
        }

        public async Task UpdateRecommendationsStatusAsync(List<ActionRecommendation> recommendations)
        {
            foreach (var rec in recommendations)
            {
                rec.IsAlreadyOptimized = await CheckIfAlreadyOptimizedAsync(rec);
            }
        }

        private async Task<bool> CheckIfAlreadyOptimizedAsync(ActionRecommendation rec)
        {
            try
            {
                switch (rec.Type)
                {
                    case ActionType.PowerPlan_HighPerformance:
                        return await CheckPowerPlanAsync("8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c"); // High Performance
                    
                    case ActionType.Storage_DisableSuperfetch:
                        return !IsServiceRunning("SysMain");

                    case ActionType.Storage_EnableTrim:
                        return IsTrimEnabled();

                    case ActionType.Advanced_DisableHags:
                        return IsHagsDisabled();

                    case ActionType.Visual_Optimize:
                        return IsVisualOptimized();

                    case ActionType.Storage_DisableHibernation:
                        return !File.Exists(@"C:\hiberfil.sys");

                    case ActionType.Network_ResetStack:
                    case ActionType.Network_FlushDns:
                    case ActionType.SystemCleanup:
                    case ActionType.Memory_Optimize:
                    case ActionType.Process_Optimize:
                        return false; // Transientes, sempre podem ser aplicados

                    default:
                        return false;
                }
            }
            catch (Exception ex)
            {
                _logger?.LogWarning($"[PROFILER] Erro ao checar status de {rec.Name}: {ex.Message}");
                return false;
            }
        }

        private async Task<bool> CheckPowerPlanAsync(string guidPart)
        {
            try
            {
                var output = await Task.Run(() => AuditCollector.RunCommand("powercfg /GETACTIVESCHEME"));
                return output.ToLowerInvariant().Contains(guidPart.ToLowerInvariant());
            }
            catch { return false; }
        }

        private bool IsServiceRunning(string serviceName)
        {
            try
            {
                using var sc = new System.ServiceProcess.ServiceController(serviceName);
                return sc.Status == System.ServiceProcess.ServiceControllerStatus.Running;
            }
            catch { return false; }
        }

        private bool IsTrimEnabled()
        {
            try
            {
                var output = AuditCollector.RunCommand("fsutil behavior query DisableDeleteNotify");
                return output.Contains("DisableDeleteNotify = 0");
            }
            catch { return false; }
        }

        private bool IsHagsDisabled()
        {
            try
            {
                using var key = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\GraphicsDrivers", false);
                var val = key?.GetValue("HwSchMode");
                // HwSchMode: 1 = Desabilitado, 2 = Habilitado (conforme SystemConstants.HagsSettings)
                return val != null && Convert.ToInt32(val) == Core.Constants.SystemConstants.HagsSettings.Disabled;
            }
            catch { return false; }
        }

        private bool IsVisualOptimized()
        {
            try
            {
                using var key = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects", false);
                var val = key?.GetValue("VisualFXSetting");
                return val != null && Convert.ToInt32(val) == 2; // 2 = Adjust for best performance
            }
            catch { return false; }
        }

        public List<ActionRecommendation> GetRecommendations(ProfilerReport report, UserAnswers answers)
        {
            var r = _engine.Evaluate(report.Audit, answers);
            return r.Recommendations;
        }

        public async Task<ApplyResult> ApplyActionsAsync(IEnumerable<ActionRecommendation> actions, bool simulateOnly, CancellationToken ct)
        {
            var session = _rollback.BeginSession();
            var applied = new List<string>();
            var errors  = new List<string>();
            var syncLock = new object();

            try { App.LoggingService?.LogInfo($"[PROFILER] ApplyActions iniciado | simulate={simulateOnly} | session={session}"); } catch { }

            var missingServices = CheckServiceAvailability();
            if (missingServices.Count > 0)
            {
                var errorMsg = $"Serviços não disponíveis: {string.Join(", ", missingServices)}";
                try { App.LoggingService?.LogError($"[PROFILER] {errorMsg}"); } catch { }
                return new ApplyResult { Success = false, Applied = new List<string>(), Errors = new List<string> { errorMsg }, Backups = _rollback.ListBackups() };
            }

            using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
            cts.CancelAfter(TimeSpan.FromSeconds(60));

            // Coletar audit em paralelo com a filtragem das ações
            var auditTask = _collector.CollectAsync(cts.Token);

            // Filtrar ações suportadas
            var actionList = new List<ActionRecommendation>();
            foreach (var a in actions) { if (a.Supported) actionList.Add(a); }

            var audit = await auditTask.ConfigureAwait(false);

            if (simulateOnly)
            {
                foreach (var a in actionList)
                    applied.Add("simulated:" + a.Name);
                return new ApplyResult { Success = true, Applied = applied, Errors = new List<string>(), Backups = _rollback.ListBackups() };
            }

            // Separar ações em grupos: paralelas (independentes) vs sequenciais (limpeza/storage)
            var sequentialTypes = new[] { ActionType.SystemCleanup, ActionType.Storage_Defrag, ActionType.Storage_EnableTrim };
            var parallelActions   = new List<ActionRecommendation>();
            var sequentialActions = new List<ActionRecommendation>();
            foreach (var a in actionList)
            {
                bool isSeq = a.Type == ActionType.Unknown;
                if (!isSeq) { foreach (var t in sequentialTypes) { if (a.Type == t) { isSeq = true; break; } } }
                if (isSeq) sequentialActions.Add(a); else parallelActions.Add(a);
            }

            // ── Fase 1: ações paralelas ──────────────────────────────────────────
            if (parallelActions.Count > 0)
            {
                var parallelTasks = new Task[parallelActions.Count];
                for (int i = 0; i < parallelActions.Count; i++)
                {
                    var a = parallelActions[i];
                    parallelTasks[i] = Task.Run(async () =>
                    {
                        if (cts.Token.IsCancellationRequested) return;
                        if (!_guard.IsAllowed(a, audit)) { lock (syncLock) errors.Add(a.Name + ":blocked"); return; }
                        try { App.LoggingService?.LogInfo($"[PROFILER] ▶ (paralelo) {a.Name}"); } catch { }
                        try
                        {
                            bool ok = await ExecuteActionAsync(a, audit).ConfigureAwait(false);
                            if (ok) { lock (syncLock) applied.Add(a.Name); try { App.LoggingService?.LogSuccess($"[PROFILER] ✓ {a.Name}"); } catch { } }
                            else    { lock (syncLock) errors.Add(a.Name + ":falha"); try { App.LoggingService?.LogWarning($"[PROFILER] ✗ {a.Name}"); } catch { } }
                        }
                        catch (ActionNotApplicableException ex) { try { App.LoggingService?.LogInfo($"[PROFILER] ⚠ não aplicável: {a.Name} — {ex.Message}"); } catch { } }
                        catch (OperationCanceledException)      { lock (syncLock) errors.Add(a.Name + ":cancelada"); }
                        catch (Exception ex)                    { lock (syncLock) errors.Add(a.Name + ":" + ex.Message); try { App.LoggingService?.LogError($"[PROFILER] Erro {a.Name}: {ex.Message}", ex); } catch { } }
                    });
                }
                await Task.WhenAll(parallelTasks).ConfigureAwait(false);
            }

            // ── Fase 2: ações sequenciais (I/O pesado) ───────────────────────────
            foreach (var a in sequentialActions)
            {
                if (cts.Token.IsCancellationRequested) break;
                if (!_guard.IsAllowed(a, audit)) { errors.Add(a.Name + ":blocked"); continue; }
                try { App.LoggingService?.LogInfo($"[PROFILER] ▶ (sequencial) {a.Name}"); } catch { }
                try
                {
                    bool ok = await ExecuteActionAsync(a, audit).ConfigureAwait(false);
                    if (ok) { applied.Add(a.Name); try { App.LoggingService?.LogSuccess($"[PROFILER] ✓ {a.Name}"); } catch { } }
                    else    { errors.Add(a.Name + ":falha"); try { App.LoggingService?.LogWarning($"[PROFILER] ✗ {a.Name}"); } catch { } }
                }
                catch (ActionNotApplicableException ex) { try { App.LoggingService?.LogInfo($"[PROFILER] ⚠ não aplicável: {a.Name} — {ex.Message}"); } catch { } }
                catch (OperationCanceledException)      { errors.Add(a.Name + ":cancelada"); break; }
                catch (Exception ex)                    { errors.Add(a.Name + ":" + ex.Message); try { App.LoggingService?.LogError($"[PROFILER] Erro {a.Name}: {ex.Message}", ex); } catch { } }
            }

            var appliedList = applied;
            var errorList   = errors;

            var report = new ProfilerReport
            {
                Audit = audit,
                Answers = _store.Load().Answers,
                Recommendations = new List<ActionRecommendation>(actions),
                Backups = _rollback.ListBackups(),
                Applied = appliedList
            };
            try
            {
                var json = System.Text.Json.JsonSerializer.Serialize(report, new System.Text.Json.JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(Path.Combine(session, "report.json"), json);
            }
            catch (Exception ex) { try { App.LoggingService?.LogError($"[PROFILER] Erro ao gravar relatório: {ex.Message}", ex); } catch { } }

            return new ApplyResult { Success = errorList.Count == 0, Applied = appliedList, Errors = errorList, Backups = _rollback.ListBackups() };
        }

        public void MarkGateCompleted()
        {
            var s = _store.Load();
            s.QuestionnaireCompleted = true;
            _store.Save(s);
        }
        
        /// <summary>
        /// Verifica se todos os serviços necessários estão disponíveis
        /// </summary>
        /// <returns>Lista de serviços ausentes</returns>
        public List<string> CheckServiceAvailability()
        {
            var missing = new List<string>();
            
            if (App.SystemCleaner == null)
                missing.Add("SystemCleaner");
            
            if (App.PerformanceOptimizer == null)
                missing.Add("PerformanceOptimizer");
                
            if (App.NetworkOptimizer == null)
                missing.Add("NetworkOptimizer");
                
            if (App.AdvancedOptimizer == null)
                missing.Add("AdvancedOptimizer");
                
                
            // if (App.GamerOptimizer == null)
            //    missing.Add("GamerOptimizer");
                
            if (App.ExtremeOptimizations == null)
                missing.Add("ExtremeOptimizations");
                
            if (App.UltraPerformance == null)
                missing.Add("UltraPerformance");
            
            return missing;
        }
        
        /// <summary>
        /// Executa uma ação específica baseada no nome e módulo
        /// </summary>
        /// <summary>
        /// Executa uma ação específica baseada no TIPO (Enum) e não mais em string mágica.
        /// </summary>
        private async Task<bool> ExecuteActionAsync(ActionRecommendation action, AuditData audit)
        {
            try
            {
                // Fallback para lógica antiga se o Tipo for Unknown (transição)
                if (action.Type == ActionType.Unknown)
                {
                    return await ExecuteLegacyActionAsync(action);
                }

                switch (action.Type)
                {
                    case ActionType.SystemCleanup:
                        if (App.SystemCleaner != null)
                        {
                            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30)); // Timeout segurança
                            var cleaned = await App.SystemCleaner.CleanTempFilesAsync();
                            _logger?.LogInfo($"[PROFILER] Limpeza: {cleaned / 1024 / 1024} MB liberados");
                            return true;
                        }
                        else
                        {
                            _logger?.LogWarning($"[PROFILER] SystemCleaner não disponível para ação: {action.Name}");
                            return false;
                        }

                    case ActionType.PowerPlan_HighPerformance:
                        if (App.PerformanceOptimizer != null)
                        {
                            return (await App.PerformanceOptimizer.SetHighPerformancePlanAsync()).Success;
                        }
                        else
                        {
                            _logger?.LogWarning($"[PROFILER] PerformanceOptimizer não disponível para ação: {action.Name}");
                            return false;
                        }
                        
                    case ActionType.PowerPlan_Balanced:
                        if (App.PerformanceOptimizer != null)
                        {
                            return (await App.PerformanceOptimizer.SetBalancedPlanAsync()).Success;
                        }
                        else
                        {
                            _logger?.LogWarning($"[PROFILER] PerformanceOptimizer não disponível para ação: {action.Name}");
                            return false;
                        }

                    case ActionType.Network_FlushDns:
                        if (App.NetworkOptimizer != null)
                        {
                            return await App.NetworkOptimizer.FlushDnsAsync();
                        }
                        else
                        {
                            _logger?.LogWarning($"[PROFILER] NetworkOptimizer não disponível para ação: {action.Name}");
                            return false;
                        }
                        
                    case ActionType.Network_ResetStack:
                        if (App.NetworkOptimizer != null)
                        {
                            bool s1 = await App.NetworkOptimizer.ResetWinsockAsync();
                            bool s2 = await App.NetworkOptimizer.ResetIPStackAsync();
                            return s1 && s2;
                        }
                        else
                        {
                            _logger?.LogWarning($"[PROFILER] NetworkOptimizer não disponível para ação: {action.Name}");
                            return false;
                        }

                    case ActionType.GamerMode_Activate:
                        _logger?.LogWarning($"[PROFILER] GamerOptimizer (Legacy) removido. Ação ignorada: {action.Name}");
                        return false;

                    case ActionType.Memory_Optimize:
                        if (App.AdvancedOptimizer != null)
                        {
                            return await App.AdvancedOptimizer.OptimizeMemoryAsync();
                        }
                        else
                        {
                            _logger?.LogWarning($"[PROFILER] AdvancedOptimizer não disponível para ação: {action.Name}");
                            return false;
                        }

                    case ActionType.Advanced_DisableHags:
                        if (App.ExtremeOptimizations != null)
                        {
                             return App.ExtremeOptimizations.ToggleHAGS(false);
                        }
                        else
                        {
                            _logger?.LogWarning($"[PROFILER] ExtremeOptimizations não disponível para ação: {action.Name}");
                            return false;
                        }

                    case ActionType.Storage_DisableSuperfetch:
                        if (App.UltraPerformance != null)
                        {
                            App.UltraPerformance.DisableSuperfetch();
                            return true;
                        }
                        else
                        {
                            _logger?.LogWarning($"[PROFILER] UltraPerformance não disponível para ação: {action.Name}");
                            return false;
                        }
                    
                    case ActionType.Storage_EnableTrim:
                        if (App.AdvancedOptimizer != null)
                        {
                            return await App.AdvancedOptimizer.OptimizeStorageAsync("C", true);
                        }
                        else
                        {
                            _logger?.LogWarning($"[PROFILER] AdvancedOptimizer não disponível para ação: {action.Name}");
                            return false;
                        }

                    case ActionType.Visual_Optimize:
                        if (App.UltraPerformance != null)
                        {
                            App.UltraPerformance.DisableVisualEffects();
                            return true;
                        }
                        else
                        {
                            _logger?.LogWarning($"[PROFILER] UltraPerformance não disponível para ação: {action.Name}");
                            return false;
                        }

                    case ActionType.Process_Optimize:
                        if (App.AdvancedOptimizer != null)
                        {
                            return await App.AdvancedOptimizer.OptimizeProcessesAsync();
                        }
                        else
                        {
                            _logger?.LogWarning($"[PROFILER] AdvancedOptimizer não disponível para ação: {action.Name}");
                            return false;
                        }

                    case ActionType.General_Optimize:
                        // Otimização Avançada de GPU / Sistema
                        if (App.ExtremeOptimizations != null)
                        {
                            App.ExtremeOptimizations.ApplyGpuTdrTweaks(true);
                            App.ExtremeOptimizations.ApplyNvidiaStereo3DPolicy(true);
                            return true;
                        }
                        return false;

                    case ActionType.Advanced_OptimizeIrq:
                        if (App.ExtremeOptimizations != null)
                        {
                            return App.ExtremeOptimizations.OptimizeInterruptHandling();
                        }
                        return false;

                    case ActionType.Storage_Defrag:
                        if (App.AdvancedOptimizer != null)
                        {
                            return await App.AdvancedOptimizer.OptimizeStorageAsync("C", false);
                        }
                        return false;

                    case ActionType.Network_OptimizeTcp:
                        if (App.ExtremeOptimizations != null)
                        {
                            return App.ExtremeOptimizations.ApplyTcpAutotuneRssRsc();
                        }
                        return false;

                    case ActionType.Services_Optimize:
                        if (App.ExtremeOptimizations != null)
                        {
                            App.ExtremeOptimizations.OptimizeServices(true);
                            return true;
                        }
                        return false;
                }

                // Se chegou aqui, o tipo de ação não é suportado
                _logger?.LogWarning($"[PROFILER] Tipo de ação não suportado: {action.Type} - {action.Name}");
                return false;
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[PROFILER] Erro ao executar ação '{action.Name}': {ex.Message}", ex);
                return false;
            }
        }

        private async Task<bool> ExecuteLegacyActionAsync(ActionRecommendation action)
        {
            var actionName = action.Name.ToLowerInvariant();
             // ========================================
                // LIMPEZA DE SISTEMA
                // ========================================
                if (actionName.Contains("limpeza") || actionName.Contains("clean"))
                {
                    if (App.SystemCleaner != null)
                    {
                        // Adicionar timeout de 15 segundos para a limpeza
                        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(15));
                        var cleaned = await App.SystemCleaner.CleanTempFilesAsync();
                        _logger?.LogInfo($"[PROFILER] Limpeza: {cleaned / 1024 / 1024} MB liberados");
                        return true;
                    }
                    else
                    {
                        _logger?.LogWarning($"[PROFILER] SystemCleaner não disponível para ação: {action.Name}");
                        return false;
                    }
                }
                
                // ========================================
                // PLANOS DE ENERGIA
                // ========================================
                if (actionName.Contains("plano de energia") || actionName.Contains("power plan") || 
                    actionName.Contains("alto desempenho") || actionName.Contains("high performance") ||
                    actionName.Contains("balanceado") || actionName.Contains("balanced"))
                {
                    if (App.PerformanceOptimizer != null)
                    {
                        if (actionName.Contains("balanceado") || actionName.Contains("balanced"))
                        {
                            // Plano balanceado para notebooks - timeout de 10 segundos
                            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(10));
                            return (await App.PerformanceOptimizer.SetBalancedPlanAsync()).Success;
                        }
                        else
                        {
                            // Plano alto desempenho - timeout de 10 segundos
                            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(10));
                            return (await App.PerformanceOptimizer.SetHighPerformancePlanAsync()).Success;
                        }
                    }
                    else
                    {
                        _logger?.LogWarning($"[PROFILER] PerformanceOptimizer não disponível para ação: {action.Name}");
                        return false;
                    }
                }
                
                // ========================================
                // OTIMIZAÇÕES DE REDE
                // ========================================
                if (actionName.Contains("rss") || actionName.Contains("nic") || actionName.Contains("rede") || actionName.Contains("network"))
                {
                    if (App.NetworkOptimizer != null)
                    {
                        bool success = true;
                        
                        // Flush DNS sempre - timeout de 10 segundos
                        using var cts1 = new CancellationTokenSource(TimeSpan.FromSeconds(10));
                        success &= await App.NetworkOptimizer.FlushDnsAsync();
                        
                        // Se for tuning específico de RSS
                        if (actionName.Contains("rss") || actionName.Contains("tuning"))
                        {
                            // Aplicar configurações TCP otimizadas - timeout de 15 segundos
                            using var cts2 = new CancellationTokenSource(TimeSpan.FromSeconds(15));
                            success &= await App.NetworkOptimizer.OptimizeTcpSettingsAsync();
                        }
                        else
                        {
                            // Reset completo da pilha de rede - timeout de 20 segundos cada
                            using var cts3 = new CancellationTokenSource(TimeSpan.FromSeconds(20));
                            success &= await App.NetworkOptimizer.ResetWinsockAsync();
                            using var cts4 = new CancellationTokenSource(TimeSpan.FromSeconds(20));
                            success &= await App.NetworkOptimizer.ResetIPStackAsync();
                        }
                        
                        return success;
                    }
                    else
                    {
                        _logger?.LogWarning($"[PROFILER] NetworkOptimizer não disponível para ação: {action.Name}");
                        return false;
                    }
                }
                
                // ========================================
                // MODO GAMER - SÓ ATIVAR SE HOUVER JOGO RODANDO
                // ========================================
                if (actionName.Contains("gamer") || actionName.Contains("gaming") || actionName.Contains("jogo"))
                {
                    // if (App.GamerOptimizer != null)
                    // {
                    //     // Ativar modo gamer com timeout de 30 segundos
                    //     using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));
                    //     await App.GamerOptimizer.ActivateGamerModeAsync(null, null);
                    //     return true;
                    // }
                    // else
                    // {
                         _logger?.LogWarning($"[PROFILER] GamerOptimizer (Legacy) removido. Ação ignorada: {action.Name}");
                         return false;
                    // }
                }
                
                // ========================================
                // OTIMIZAÇÕES AVANÇADAS - PAGEFILE
                // ========================================
                if (actionName.Contains("pagefile") || actionName.Contains("paginação") || actionName.Contains("swap"))
                {
                    if (App.AdvancedOptimizer != null)
                    {
                        // Otimizar memória inclui ajuste de pagefile - timeout de 20 segundos
                        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(20));
                        return await App.AdvancedOptimizer.OptimizeMemoryAsync();
                    }
                    else
                    {
                        _logger?.LogWarning($"[PROFILER] AdvancedOptimizer não disponível para ação: {action.Name}");
                        return false;
                    }
                }
                
                // ========================================
                // OTIMIZAÇÕES AVANÇADAS - SERVIÇOS
                // ========================================
                if (actionName.Contains("serviços") || actionName.Contains("services") || actionName.Contains("mínimos"))
                {
                    if (App.PerformanceOptimizer != null)
                    {
                        // Otimizar serviços - timeout de 15 segundos
                        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(15));
                        return (await App.PerformanceOptimizer.OptimizeServicesAsync()).Success;
                    }
                    else
                    {
                        _logger?.LogWarning($"[PROFILER] PerformanceOptimizer não disponível para ação: {action.Name}");
                        return false;
                    }
                }
                
                // ========================================
                // OTIMIZAÇÕES AVANÇADAS - HAGS
                // ========================================
                if (actionName.Contains("hags") || actionName.Contains("hardware-accelerated") || actionName.Contains("gpu scheduling"))
                {
                    if (App.ExtremeOptimizations != null)
                    {
                        // Desabilitar DryRun temporariamente para aplicar de verdade
                        var previousDryRun = App.ExtremeOptimizations.DryRun;
                        App.ExtremeOptimizations.DryRun = false;
                        try
                        {
                            // HAGS é uma otimização de registro - desativar em sistemas low-end
                            // Timeout de 10 segundos
                            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(10));
                            return App.ExtremeOptimizations.ToggleHAGS(false);
                        }
                        finally
                        {
                            App.ExtremeOptimizations.DryRun = previousDryRun;
                        }
                    }
                    else
                    {
                        _logger?.LogWarning($"[PROFILER] ExtremeOptimizations não disponível para ação: {action.Name}");
                        return false;
                    }
                }
                
                // ========================================
                // OTIMIZAÇÕES AVANÇADAS - IRQ/DPC
                // ========================================
                if (actionName.Contains("irq") || actionName.Contains("dpc") || actionName.Contains("latência"))
                {
                    if (App.ExtremeOptimizations != null)
                    {
                        // Desabilitar DryRun temporariamente para aplicar de verdade
                        var previousDryRun = App.ExtremeOptimizations.DryRun;
                        App.ExtremeOptimizations.DryRun = false;
                        try
                        {
                            // Otimizações de IRQ/DPC para reduzir latência - timeout de 10 segundos
                            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(10));
                            return App.ExtremeOptimizations.OptimizeInterruptHandling();
                        }
                        finally
                        {
                            App.ExtremeOptimizations.DryRun = previousDryRun;
                        }
                    }
                    else
                    {
                        _logger?.LogWarning($"[PROFILER] ExtremeOptimizations não disponível para ação: {action.Name}");
                        return false;
                    }
                }
                
                // ========================================
                // OTIMIZAÇÕES DE PROCESSOS (FALLBACK)
                // ========================================
                if (action.Module == "AdvancedOptimizer" && App.AdvancedOptimizer != null)
                {
                    // Otimizar processos - timeout de 15 segundos
                    using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(15));
                    await App.AdvancedOptimizer.OptimizeProcessesAsync();
                    return true;
                }
                else if (action.Module == "AdvancedOptimizer" && App.AdvancedOptimizer == null)
                {
                    _logger?.LogWarning($"[PROFILER] AdvancedOptimizer não disponível para ação: {action.Name}");
                    return false;
                }
                
                // Se chegou aqui, a ação não é reconhecida
                _logger?.LogWarning($"[PROFILER] Ação não reconhecida: {action.Name} (Module: {action.Module})");
                return false;
        }
    }
}
