using System;
using System.Collections.Generic;
using System.IO;
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
                
                var recs = _engine.Evaluate(audit, answers);
                
                // Verificar cancelamento após avaliar
                cts.Token.ThrowIfCancellationRequested();
                
                try { App.LoggingService?.LogSuccess($"[PROFILER] Auditoria concluída | recs={recs.Count}"); } catch { }
                return new ProfilerReport
                {
                    Audit = audit,
                    Answers = answers,
                    Recommendations = recs
                };
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
                var fallbackRecs = _engine.Evaluate(fallbackAudit, fallbackAnswers);
                return new ProfilerReport
                {
                    Audit = fallbackAudit,
                    Answers = fallbackAnswers,
                    Recommendations = fallbackRecs
                };
            }
        }
        public List<ActionRecommendation> GetRecommendations(ProfilerReport report, UserAnswers answers)
        {
            return _engine.Evaluate(report.Audit, answers);
        }

        public async Task<ApplyResult> ApplyActionsAsync(IEnumerable<ActionRecommendation> actions, bool simulateOnly, CancellationToken ct)
        {
            var session = _rollback.BeginSession();
            var applied = new List<string>();
            var errors = new List<string>();
            
            try { App.LoggingService?.LogInfo($"[PROFILER] ApplyActions iniciado | simulate={simulateOnly} | session={session}"); } catch { }
            
            // Criar um cancellation token com timeout de 60 segundos para a operação completa
            using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
            cts.CancelAfter(TimeSpan.FromSeconds(60));
            
            // Verificar cancelamento antes de começar
            cts.Token.ThrowIfCancellationRequested();            
            var audit = await _collector.CollectAsync(cts.Token);
            
            // Verificar cancelamento após coleta
            cts.Token.ThrowIfCancellationRequested();            
            foreach (var a in actions)
            {
                // Verificar cancelamento a cada iteração
                if (cts.Token.IsCancellationRequested) 
                {
                    try { App.LoggingService?.LogWarning($"[PROFILER] ApplyActions cancelado pelo usuário ou timeout"); } catch { }
                    break;
                }
                
                if (!a.Supported) 
                {
                    try { App.LoggingService?.LogWarning($"[PROFILER] Ação ignorada (não suportada): {a.Name}"); } catch { }
                    continue;
                }
                
                if (!_guard.IsAllowed(a, audit)) 
                { 
                    errors.Add(a.Name + ":blocked"); 
                    try { App.LoggingService?.LogWarning($"[PROFILER] Ação bloqueada pelo guard: {a.Name}"); } catch { }
                    continue; 
                }
                
                try { App.LoggingService?.LogInfo($"[PROFILER] Processando ação: {a.Name} | módulo={a.Module}"); } catch { }
                
                if (simulateOnly)
                {
                    applied.Add("simulated:" + a.Name);
                    try { App.LoggingService?.LogInfo($"[PROFILER] Simulada: {a.Name}"); } catch { }
                    continue;
                }

                try
                {
                    // Verificar cancelamento antes de executar a ação
                    cts.Token.ThrowIfCancellationRequested();
                    
                    bool success = await ExecuteActionAsync(a, audit);
                    
                    // Verificar cancelamento após executar a ação
                    cts.Token.ThrowIfCancellationRequested();
                    
                    if (success)
                    {
                        applied.Add(a.Name);
                        try { App.LoggingService?.LogSuccess($"[PROFILER] ✓ Aplicada: {a.Name}"); } catch { }
                    }
                    else
                    {
                        errors.Add(a.Name + ":falha na execução");
                        try { App.LoggingService?.LogWarning($"[PROFILER] ✗ Falha ao aplicar: {a.Name}"); } catch { }
                    }
                }
                catch (ActionNotApplicableException ex)
                {
                    // Ação não aplicável no momento (ex: modo gamer sem jogo) - NÃO contar como erro
                    try { App.LoggingService?.LogInfo($"[PROFILER] ⚠ Ação não aplicável: {a.Name} - {ex.Message}"); } catch { }
                    // Não adicionar aos erros, apenas continuar
                    continue;
                }
                catch (OperationCanceledException)
                {
                    // Ação cancelada pelo usuário
                    errors.Add(a.Name + ":cancelada");
                    try { App.LoggingService?.LogWarning($"[PROFILER] ✗ Ação cancelada: {a.Name}"); } catch { }
                    break;
                }
                catch (System.Exception ex)
                {
                    errors.Add(a.Name + ":" + ex.Message);
                    try { App.LoggingService?.LogError($"[PROFILER] Erro ao aplicar {a.Name}: {ex.Message}", ex); } catch { }
                }
            }

            // Verificar cancelamento antes de gerar relatório
            if (cts.Token.IsCancellationRequested)
            {
                try { App.LoggingService?.LogWarning($"[PROFILER] ApplyActions interrompido antes de gerar relatório"); } catch { }
                
                return new ApplyResult
                {
                    Success = false,
                    Applied = applied,
                    Errors = new List<string>(errors) { "Operação cancelada pelo usuário" },
                    Backups = _rollback.ListBackups()
                };
            }

            var report = new ProfilerReport
            {
                Audit = audit,
                Answers = _store.Load().Answers,
                Recommendations = new List<ActionRecommendation>(actions),
                Backups = _rollback.ListBackups(),
                Applied = applied
            };
            
            try
            {
                var json = JsonSerializer.Serialize(report, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(Path.Combine(session, "report.json"), json);
                try { App.LoggingService?.LogInfo($"[PROFILER] Relatório gravado em {session}\\report.json"); } catch { }
            }
            catch (Exception ex)
            {
                try { App.LoggingService?.LogError($"[PROFILER] Erro ao gravar relatório: {ex.Message}", ex); } catch { }
            }

            if (simulateOnly)
            {
                try
                {
                    var jsonSim = JsonSerializer.Serialize(report, new JsonSerializerOptions { WriteIndented = true });
                    File.WriteAllText(Path.Combine(session, "report_simulation.json"), jsonSim);
                    App.LoggingService?.LogInfo($"[PROFILER] Relatório de simulação gravado em {session}\\report_simulation.json");
                }
                catch (Exception ex)
                {
                    try { App.LoggingService?.LogError($"[PROFILER] Erro ao gravar relatório de simulação: {ex.Message}", ex); } catch { }
                }
            }

            return new ApplyResult
            {
                Success = errors.Count == 0,
                Applied = applied,
                Errors = errors,
                Backups = _rollback.ListBackups()
            };
        }

        public void MarkGateCompleted()
        {
            var s = _store.Load();
            s.QuestionnaireCompleted = true;
            _store.Save(s);
        }
        
        /// <summary>
        /// Executa uma ação específica baseada no nome e módulo
        /// </summary>
        private async Task<bool> ExecuteActionAsync(ActionRecommendation action, AuditData audit)
        {
            try
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
                    return false;
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
                            return await App.PerformanceOptimizer.SetBalancedPlanAsync();
                        }
                        else
                        {
                            // Plano alto desempenho - timeout de 10 segundos
                            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(10));
                            return await App.PerformanceOptimizer.SetHighPerformancePlanAsync();
                        }
                    }
                    return false;
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
                    return false;
                }
                
                // ========================================
                // MODO GAMER - SÓ ATIVAR SE HOUVER JOGO RODANDO
                // ========================================
                if (actionName.Contains("gamer") || actionName.Contains("gaming") || actionName.Contains("jogo"))
                {
                    if (App.GamerOptimizer != null)
                    {
                        // CORREÇÃO CRÍTICA: Verificar se há jogo rodando antes de ativar modo gamer
                        bool hasGameRunning = false;
                        
                        // Verificar processo monitorado do GamerOptimizer
                        try
                        {
                            var monitoredProcessId = App.GamerOptimizer.GetMonitoredGameProcessId();
                            if (monitoredProcessId > 0)
                            {
                                try
                                {
                                    var process = System.Diagnostics.Process.GetProcessById(monitoredProcessId);
                                    if (process != null && !process.HasExited)
                                    {
                                        hasGameRunning = true;
                                        process.Dispose();
                                    }
                                }
                                catch { }
                            }
                        }
                        catch { }
                        
                        // Se não encontrou processo monitorado, verificar lista manual de jogos
                        if (!hasGameRunning && App.GameDetectionService != null)
                        {
                            try
                            {
                                var manualGames = App.GameDetectionService.GetManualGamesList();
                                if (manualGames != null && manualGames.Count > 0)
                                {
                                    foreach (var gameName in manualGames)
                                    {
                                        if (string.IsNullOrWhiteSpace(gameName)) continue;
                                        
                                        var processName = gameName.Trim();
                                        if (processName.EndsWith(".exe", StringComparison.OrdinalIgnoreCase))
                                            processName = processName.Substring(0, processName.Length - 4);
                                        
                                        var processes = System.Diagnostics.Process.GetProcessesByName(processName);
                                        if (processes.Length > 0)
                                        {
                                            hasGameRunning = true;
                                            foreach (var p in processes) p.Dispose();
                                            break;
                                        }
                                        foreach (var p in processes) p.Dispose();
                                    }
                                }
                            }
                            catch { }
                        }
                        
                        if (!hasGameRunning)
                        {
                            _logger?.LogInfo("[PROFILER] Modo Gamer não aplicável: nenhum jogo detectado em execução (será ativado automaticamente quando um jogo for detectado)");
                            throw new ActionNotApplicableException("Modo Gamer não aplicável: nenhum jogo em execução");
                        }
                        
                        // Ativar modo gamer com timeout de 30 segundos
                        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));
                        await App.GamerOptimizer.ActivateGamerModeAsync(null, null);
                        return true;
                    }
                    return false;
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
                    return false;
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
                        return await App.PerformanceOptimizer.OptimizeServicesAsync();
                    }
                    return false;
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
                    return false;
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
                    return false;
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
                
                // ========================================
                // FALLBACK POR MÓDULO
                // ========================================
                switch (action.Module)
                {
                    case "SystemCleaner":
                        if (App.SystemCleaner != null)
                        {
                            // Limpeza de arquivos temporários - timeout de 15 segundos
                            using var cts1 = new CancellationTokenSource(TimeSpan.FromSeconds(15));
                            await App.SystemCleaner.CleanTempFilesAsync();
                            return true;
                        }
                        break;
                        
                    case "NetworkOptimizer":
                        if (App.NetworkOptimizer != null)
                        {
                            // Flush DNS - timeout de 10 segundos
                            using var cts2 = new CancellationTokenSource(TimeSpan.FromSeconds(10));
                            await App.NetworkOptimizer.FlushDnsAsync();
                            return true;
                        }
                        break;
                        
                    case "PerformanceOptimizer":
                        if (App.PerformanceOptimizer != null)
                        {
                            // Plano de alto desempenho - timeout de 10 segundos
                            using var cts3 = new CancellationTokenSource(TimeSpan.FromSeconds(10));
                            await App.PerformanceOptimizer.SetHighPerformancePlanAsync();
                            return true;
                        }
                        break;
                        
                    case "GamerOptimizerService":
                        if (App.GamerOptimizer != null)
                        {
                            // CORREÇÃO CRÍTICA: Verificar se há jogo rodando antes de ativar modo gamer
                            bool hasGameRunning = false;
                            
                            // Verificar processo monitorado do GamerOptimizer
                            try
                            {
                                var monitoredProcessId = App.GamerOptimizer.GetMonitoredGameProcessId();
                                if (monitoredProcessId > 0)
                                {
                                    try
                                    {
                                        var process = System.Diagnostics.Process.GetProcessById(monitoredProcessId);
                                        if (process != null && !process.HasExited)
                                        {
                                            hasGameRunning = true;
                                            process.Dispose();
                                        }
                                    }
                                    catch { }
                                }
                            }
                            catch { }
                            
                            // Se não encontrou processo monitorado, verificar lista manual de jogos
                            if (!hasGameRunning && App.GameDetectionService != null)
                            {
                                try
                                {
                                    var manualGames = App.GameDetectionService.GetManualGamesList();
                                    if (manualGames != null && manualGames.Count > 0)
                                    {
                                        foreach (var gameName in manualGames)
                                        {
                                            if (string.IsNullOrWhiteSpace(gameName)) continue;
                                            
                                            var processName = gameName.Trim();
                                            if (processName.EndsWith(".exe", StringComparison.OrdinalIgnoreCase))
                                                processName = processName.Substring(0, processName.Length - 4);
                                            
                                            var processes = System.Diagnostics.Process.GetProcessesByName(processName);
                                            if (processes.Length > 0)
                                            {
                                                hasGameRunning = true;
                                                foreach (var p in processes) p.Dispose();
                                                break;
                                            }
                                            foreach (var p in processes) p.Dispose();
                                        }
                                    }
                                }
                                catch { }
                            }
                            
                            if (!hasGameRunning)
                            {
                                _logger?.LogInfo("[PROFILER] Modo Gamer não aplicável: nenhum jogo detectado em execução (será ativado automaticamente quando um jogo for detectado)");
                                throw new ActionNotApplicableException("Modo Gamer não aplicável: nenhum jogo em execução");
                            }
                            
                            // Modo gamer - timeout de 30 segundos
                            using var cts4 = new CancellationTokenSource(TimeSpan.FromSeconds(30));
                            await App.GamerOptimizer.ActivateGamerModeAsync(null, null);
                            return true;
                        }
                        break;
                }
                
                _logger?.LogWarning($"[PROFILER] Ação não mapeada: {action.Name} (módulo: {action.Module})");
                return false;
            }
            catch (ActionNotApplicableException)
            {
                // Re-lançar exceção para ser capturada pelo catch específico em ApplyActionsAsync
                throw;
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[PROFILER] Erro ao executar ação '{action.Name}': {ex.Message}", ex);
                return false;
            }
        }
    }
}
