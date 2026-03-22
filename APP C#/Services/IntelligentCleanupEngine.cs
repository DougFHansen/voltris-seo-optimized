    using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Core.SystemIntelligenceProfiler;
using VoltrisOptimizer.Services.Gamer.Interfaces;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Motor de Limpeza Inteligente Automática
    /// Executa limpezas seguras e silenciosas baseadas no perfil do usuário e contexto do sistema.
    /// </summary>
    public class IntelligentCleanupEngine
    {
        private readonly ILoggingService _logger;
        private readonly HistoryService _historyService;
        private readonly UltraCleanerService _ultraCleaner;
        private readonly ISystemProfiler _profiler;
        private readonly IGamerModeOrchestrator? _gamerOrchestrator;
        
        private readonly List<string> _safeCategories = new() 
        { 
            "Arquivos Temporários", 
            "Cache de Internet", 
            "Cache do Windows",
            "Sistema" // Apenas itens safe dentro desta categoria
        };

        public IntelligentCleanupEngine(
            ILoggingService logger, 
            HistoryService historyService, 
            UltraCleanerService ultraCleaner,
            ISystemProfiler profiler,
            IGamerModeOrchestrator? gamerOrchestrator = null)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _historyService = historyService ?? throw new ArgumentNullException(nameof(historyService));
            _ultraCleaner = ultraCleaner ?? throw new ArgumentNullException(nameof(ultraCleaner));
            _profiler = profiler ?? throw new ArgumentNullException(nameof(profiler));
            _gamerOrchestrator = gamerOrchestrator;
        }

        /// <summary>
        /// Executa uma sessão de limpeza inteligente baseada no contexto atual.
        /// </summary>
        public async Task<long> RunIntelligentCleanupAsync(CancellationToken ct = default)
        {
            _logger.Log(LogLevel.Info, LogCategory.Cleanup, "Iniciando verificação de limpeza inteligente (Processamento em segundo plano)...");
            
            // ✅ CORREÇÃO CRÍTICA #1: Consultar Perfil Inteligente PRIMEIRO
            var intelligentProfile = SettingsService.Instance.Settings.IntelligentProfile;
            _logger.Log(LogLevel.AI_DECISION, LogCategory.Cleanup, 
                $"🧠 Perfil Inteligente Ativo: {intelligentProfile}");
            
            // ✅ BLOQUEIO TOTAL: EnterpriseSecure não permite limpeza automática
            if (intelligentProfile == IntelligentProfileType.EnterpriseSecure)
            {
                _logger.Log(LogLevel.AI_DECISION, LogCategory.Cleanup, 
                    "⛔ Limpeza automática BLOQUEADA: Perfil EnterpriseSecure prioriza estabilidade e previsibilidade.");
                return 0;
            }
            
            // 1. Verificação de Contexto baseada no perfil
            if (!IsSystemIdleEnough(intelligentProfile))
            {
                _logger.Log(LogLevel.AI_DECISION, LogCategory.Cleanup, "Limpeza adiada: Sistema em uso ou recursos limitados.");
                return 0;
            }

            if (_gamerOrchestrator?.IsActive == true)
            {
                _logger.Log(LogLevel.AI_DECISION, LogCategory.Cleanup, "Limpeza cancelada: Modo Gamer está ativo.");
                return 0;
            }

            // 2. Obter informações adicionais do profiler (para contexto adicional)
            var report = await _profiler.GetLastReportAsync() ?? await _profiler.AnalyzeAsync();
            var hardwareProfile = report.Answers.Profile; // Hardware profile (fraco, médio, forte)
            var priority = report.Answers.Priority; // Balanced, Performance, etc.

            _logger.Log(LogLevel.AI_DECISION, LogCategory.Cleanup, 
                $"Hardware: {hardwareProfile}, Prioridade: {priority}, Perfil Inteligente: {intelligentProfile}");

            // 3. Analisar o que pode ser limpo
            var categories = _ultraCleaner.GetCategories();
            var itemsToClean = new List<ItemAnalysis>();
            long estimatedSize = 0;

            foreach (var category in categories)
            {
                if (!_safeCategories.Contains(category.Name)) continue;

                foreach (var item in category.Items)
                {
                    if (ct.IsCancellationRequested) break;

                    // Regras de Segurança Estritas:
                    // - Somente chaves marcadas como seguras (IsSafe = true)
                    // - Nunca deletar arquivos de usuário (Documentos, Fotos) - o UltraCleaner já evita isso.
                    // - Agressividade baseada no Perfil Inteligente
                    
                    bool shouldAnalyze = IsItemSuitableForProfile(item, intelligentProfile, hardwareProfile, priority);
                    if (shouldAnalyze)
                    {
                        // CORREÇÃO: Executar análise de forma assíncrona usando o helper do UltraCleaner
                        var size = await _ultraCleaner.InvokeActionAsync(item.AnalyzeAction, ct).ConfigureAwait(false);
                        
                        if (size > 0)
                        {
                            itemsToClean.Add(new ItemAnalysis
                            {
                                Name = item.Name,
                                CleanAction = item.CleanAction,
                                IsSelected = true,
                                Size = size
                            });
                            estimatedSize += size;
                        }
                    }
                }
            }

            if (itemsToClean.Count == 0 || estimatedSize < 1024 * 1024 * 10) // Mínimo 10MB para agir
            {
                _logger.Log(LogLevel.Info, LogCategory.Cleanup, "Nenhum lixo significativo encontrado. Limpeza ignorada.");
                return 0;
            }

            // 4. Executar Limpeza (Baixa Prioridade)
            _logger.Log(LogLevel.AI_DECISION, LogCategory.Cleanup, $"Executando limpeza silenciosa de {itemsToClean.Count} itens. Estimativa: {estimatedSize / 1024.0 / 1024.0:F2} MB.");
            
            var result = await _ultraCleaner.CleanSelectedAsync(itemsToClean, ct: ct);

            // 5. Registrar no Histórico e Logs
            _historyService.AddHistoryEntry(new OptimizationHistory
            {
                ActionType = "Intelligent Auto-Cleanup",
                Description = "Limpeza automática baseada em inteligência de perfil e contexto.",
                SpaceFreed = result.SpaceCleaned,
                Success = result.Success,
                Timestamp = DateTime.Now,
                Details = new Dictionary<string, object> {
                    { "IntelligentProfile", intelligentProfile.ToString() },
                    { "HardwareProfile", hardwareProfile.ToString() },
                    { "ItemsCleaned", result.ItemsCleaned },
                    { "Reason", "Otimização automática baseada em ociosidade" }
                }
            });

            _logger.Log(LogLevel.Success, LogCategory.Cleanup, $"Limpeza inteligente finalizada. {result.SpaceCleaned / 1024.0 / 1024.0:F2} MB liberados sem interrupção do usuário.");
            
            return result.SpaceCleaned;
        }

        private bool IsItemSuitableForProfile(CleanupCategoryItem item, IntelligentProfileType intelligentProfile, UserProfile hardwareProfile, string priority)
        {
            if (!item.IsSafe) return false;

            // ✅ CORREÇÃO: Usar Perfil Inteligente como fonte de verdade
            switch (intelligentProfile)
            {
                case IntelligentProfileType.EnterpriseSecure:
                    // Já bloqueado no início, mas por segurança
                    return false;
                
                case IntelligentProfileType.WorkOffice:
                    // Muito conservador: apenas arquivos temporários óbvios
                    if (item.Name.Contains("Cache") && !item.Name.Contains("Temp")) return false;
                    if (item.Name.Contains("Sistema")) return false; // Evitar categoria "Sistema"
                    return item.Name.Contains("Temp") || item.Name.Contains("Temporários");
                
                case IntelligentProfileType.GamerCompetitive:
                case IntelligentProfileType.GamerSinglePlayer:
                    // Moderado: evitar caches de jogos
                    if (item.Name.Contains("DirectX") || item.Name.Contains("Shader")) return false;
                    return true;
                
                case IntelligentProfileType.CreativeVideoEditing:
                case IntelligentProfileType.DeveloperProgramming:
                    // Balanceado: evitar caches de ferramentas
                    if (item.Name.Contains("Visual Studio") || item.Name.Contains("Adobe")) return false;
                    return true;
                
                case IntelligentProfileType.GeneralBalanced:
                default:
                    // Padrão: permissivo mas seguro
                    if (priority == "Performance" || priority == "Aggressive")
                    {
                        return true;
                    }
                    return item.Name.Contains("Temp") || item.Name.Contains("Cache");
            }
        }

        /// <summary>
        /// ✅ CORREÇÃO CRÍTICA #2: Implementar detecção REAL de ociosidade baseada no perfil
        /// </summary>
        private bool IsSystemIdleEnough(IntelligentProfileType profile)
        {
            try
            {
                // 1. Verificar CPU baseado no perfil
                double cpuUsage = SystemInfoService.GetCPUUsagePercentAsync().Result;
                double cpuThreshold = profile switch
                {
                    IntelligentProfileType.EnterpriseSecure => 5.0,  // Muito conservador
                    IntelligentProfileType.WorkOffice => 10.0,       // Conservador
                    IntelligentProfileType.GamerCompetitive => 15.0, // Moderado
                    IntelligentProfileType.GamerSinglePlayer => 15.0,
                    IntelligentProfileType.CreativeVideoEditing => 12.0,
                    IntelligentProfileType.DeveloperProgramming => 12.0,
                    _ => 20.0                                         // Padrão
                };
                
                if (cpuUsage > cpuThreshold)
                {
                    _logger.LogInfo($"[Cleanup] CPU muito alta: {cpuUsage:F1}% (limite: {cpuThreshold}% para perfil {profile})");
                    return false;
                }
                
                // 2. Verificar RAM disponível
                try
                {
                    var memInfo = new Microsoft.VisualBasic.Devices.ComputerInfo();
                    double ramAvailablePercent = (double)memInfo.AvailablePhysicalMemory / memInfo.TotalPhysicalMemory * 100;
                    
                    double ramThreshold = profile switch
                    {
                        IntelligentProfileType.EnterpriseSecure => 50.0, // Muito conservador
                        IntelligentProfileType.WorkOffice => 40.0,
                        _ => 30.0
                    };
                    
                    if (ramAvailablePercent < ramThreshold)
                    {
                        _logger.LogInfo($"[Cleanup] RAM insuficiente: {ramAvailablePercent:F1}% livre (mínimo: {ramThreshold}% para perfil {profile})");
                        return false;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[Cleanup] Erro ao verificar RAM: {ex.Message}");
                    // Continuar mesmo se falhar verificação de RAM
                }
                
                _logger.LogInfo($"[Cleanup] ✅ Sistema ocioso o suficiente: CPU {cpuUsage:F1}% (perfil: {profile})");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[Cleanup] Erro ao verificar ociosidade: {ex.Message}");
                return false; // Seguro: não executar se houver erro
            }
        }
    }
}
