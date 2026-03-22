using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using VoltrisOptimizer.Interfaces;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Executor inteligente de IA que detecta intenções e executa automaticamente
    /// Implementado com total profissionalismo e ética
    /// </summary>
    public class SmartAIExecutor
    {
        private readonly ILoggingService _logger;
        private readonly Dictionary<string, Func<Task<string>>> _autoActions;
        
        public SmartAIExecutor(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _autoActions = new Dictionary<string, Func<Task<string>>>();
            InitializeActions();
        }
        
        /// <summary>
        /// Inicializa as ações automáticas disponíveis
        /// </summary>
        private void InitializeActions()
        {
            // Ação: Otimizar PC
            _autoActions["otimizar_pc"] = async () =>
            {
                _logger.LogInfo("[SmartAI] Executando otimização automática do PC");
                
                try
                {
                    long totalCleaned = 0;
                    var cleaner = App.SystemCleaner;
                    
                    if (cleaner != null)
                    {
                        // Limpar arquivos temporários
                        var tempCleaned = await cleaner.CleanTempFilesAsync();
                        totalCleaned += tempCleaned;
                        
                        // Esvaziar lixeira
                        await cleaner.EmptyRecycleBinAsync();
                        
                        // Limpar cache de navegadores
                        var cacheCleaned = await cleaner.CleanBrowserCacheAsync();
                        totalCleaned += cacheCleaned;
                    }
                    
                    // Forçar coleta de lixo
                    GC.Collect();
                    GC.WaitForPendingFinalizers();
                    GC.Collect();
                    
                    var sizeFormatted = FormatBytes(totalCleaned);
                    return $"✅ PC otimizado com sucesso!\n\n" +
                           $"📦 {sizeFormatted} liberados\n" +
                           $"🧹 Arquivos temporários limpos\n" +
                           $"🗑️ Lixeira esvaziada\n" +
                           $"🌐 Cache de navegadores limpo\n" +
                           $"💾 Memória otimizada";
                }
                catch (Exception ex)
                {
                    _logger.LogError("[SmartAI] Erro ao otimizar PC", ex);
                    return $"❌ Erro ao otimizar: {ex.Message}";
                }
            };
            
            // Ação: Limpar Sistema
            _autoActions["limpar_sistema"] = async () =>
            {
                _logger.LogInfo("[SmartAI] Executando limpeza automática do sistema");
                
                try
                {
                    long totalCleaned = 0;
                    var cleaner = App.SystemCleaner;
                    
                    if (cleaner != null)
                    {
                        var tempCleaned = await cleaner.CleanTempFilesAsync();
                        totalCleaned += tempCleaned;
                        
                        var cacheCleaned = await cleaner.CleanBrowserCacheAsync();
                        totalCleaned += cacheCleaned;
                        
                        await cleaner.EmptyRecycleBinAsync();
                    }
                    
                    var sizeFormatted = FormatBytes(totalCleaned);
                    return $"✅ Sistema limpo com sucesso!\n\n" +
                           $"📦 {sizeFormatted} liberados\n" +
                           $"🧹 Cache e arquivos temporários removidos";
                }
                catch (Exception ex)
                {
                    _logger.LogError("[SmartAI] Erro ao limpar sistema", ex);
                    return $"❌ Erro ao limpar: {ex.Message}";
                }
            };
            
            // Ação: Diagnosticar
            _autoActions["diagnosticar"] = async () =>
            {
                _logger.LogInfo("[SmartAI] Executando diagnóstico automático");
                
                try
                {
                    var diagnostic = App.AIOptimizer;
                    if (diagnostic != null)
                    {
                        var result = await diagnostic.PerformAutoDiagnosticAsync();
                        
                        var response = $"✅ Diagnóstico concluído!\n\n";
                        response += $"🏥 Saúde Geral: {result.OverallHealth}\n\n";
                        
                        if (result.Issues.Any())
                        {
                            response += "⚠️ Problemas Detectados:\n";
                            foreach (var issue in result.Issues.Take(5))
                            {
                                var icon = issue.Severity == "Alta" ? "🔴" : 
                                          issue.Severity == "Média" ? "🟡" : "🟢";
                                response += $"{icon} {issue.Type}: {issue.Description}\n";
                            }
                        }
                        else
                        {
                            response += "✅ Nenhum problema crítico detectado!";
                        }
                        
                        return response;
                    }
                    
                    return "❌ Serviço de diagnóstico não disponível.";
                }
                catch (Exception ex)
                {
                    _logger.LogError("[SmartAI] Erro ao diagnosticar", ex);
                    return $"❌ Erro no diagnóstico: {ex.Message}";
                }
            };
            
            // Ação: Modo Gamer
            _autoActions["modo_gamer"] = async () =>
            {
                _logger.LogInfo("[SmartAI] Ativando modo gamer automaticamente via Orchestrator");
                
                try
                {
                    var orchestrator = App.Services?.GetService<VoltrisOptimizer.Services.Gamer.Interfaces.IGamerModeOrchestrator>();
                    if (orchestrator != null)
                    {
                        if (orchestrator.IsActive)
                        {
                            return "ℹ️ Modo Gamer já está ativo!";
                        }
                        
                        var options = new VoltrisOptimizer.Services.Gamer.Models.GamerOptimizationOptions(); // Default options
                        var success = await orchestrator.ActivateAsync(options, null);
                        
                        if (success)
                        {
                            return "✅ Modo Gamer ativado!\n\n" +
                                   "🎮 Seu PC está otimizado para jogos\n" +
                                   "⚡ Processos desnecessários fechados\n" +
                                   "🚀 Prioridade de CPU maximizada\n" +
                                   "🌐 Latência de rede reduzida";
                        }
                        else
                        {
                            return "❌ Não foi possível ativar o Modo Gamer.\n" +
                                   "Verifique se você tem permissões de administrador.";
                        }
                    }
                    
                    return "❌ Serviço de orquestração gamer não disponível.";
                }
                catch (Exception ex)
                {
                    _logger.LogError("[SmartAI] Erro ao ativar modo gamer", ex);
                    return $"❌ Erro: {ex.Message}";
                }
            };
            
            // Ação: Desativar Modo Gamer
            _autoActions["desativar_gamer"] = async () =>
            {
                _logger.LogInfo("[SmartAI] Desativando modo gamer automaticamente via Orchestrator");
                
                try
                {
                    var orchestrator = App.Services?.GetService<VoltrisOptimizer.Services.Gamer.Interfaces.IGamerModeOrchestrator>();
                    if (orchestrator != null)
                    {
                        if (!orchestrator.IsActive)
                        {
                            return "ℹ️ Modo Gamer já está desativado!";
                        }
                        
                        var success = await orchestrator.DeactivateAsync();
                        
                        if (success)
                        {
                            return "✅ Modo Gamer desativado!\n\n" +
                                   "🔄 Configurações normais restauradas\n" +
                                   "⚙️ Serviços do sistema reativados";
                        }
                        else
                        {
                            return "❌ Não foi possível desativar o Modo Gamer.";
                        }
                    }
                    
                    return "❌ Serviço de orquestração gamer não disponível.";
                }
                catch (Exception ex)
                {
                    _logger.LogError("[SmartAI] Erro ao desativar modo gamer", ex);
                    return $"❌ Erro: {ex.Message}";
                }
            };
        }
        
        /// <summary>
        /// Tenta detectar intenção e executar automaticamente
        /// </summary>
        /// <param name="query">Consulta do usuário</param>
        /// <returns>Tupla (executou, mensagem)</returns>
        public async Task<(bool Executed, string Message)> TryExecuteAutoAsync(string query)
        {
            if (string.IsNullOrWhiteSpace(query))
                return (false, string.Empty);
            
            var normalized = query.ToLower().Trim();
            _logger.LogInfo($"[SmartAI] Analisando query: '{normalized}'");
            
            // Detectar intenção: OTIMIZAR PC
            if ((normalized.Contains("otimizar") || normalized.Contains("otimize") || normalized.Contains("optimize")) && 
                (normalized.Contains("pc") || normalized.Contains("sistema") || normalized.Contains("computador") || normalized.Contains("system")))
            {
                _logger.LogInfo("[SmartAI] Intenção detectada: OTIMIZAR PC");
                var result = await _autoActions["otimizar_pc"]();
                return (true, result);
            }
            
            // Detectar intenção: LIMPAR SISTEMA
            if (normalized.Contains("limpar") || normalized.Contains("limpeza") || 
                normalized.Contains("limpe") || normalized.Contains("clean") ||
                normalized.Contains("limpando"))
            {
                _logger.LogInfo("[SmartAI] Intenção detectada: LIMPAR SISTEMA");
                var result = await _autoActions["limpar_sistema"]();
                return (true, result);
            }
            
            // Detectar intenção: DIAGNOSTICAR
            if (normalized.Contains("diagnosticar") || normalized.Contains("verificar") || 
                normalized.Contains("checar") || normalized.Contains("analisar") ||
                normalized.Contains("diagnóstico") || normalized.Contains("check") ||
                normalized.Contains("diagnostic") || normalized.Contains("analyze"))
            {
                _logger.LogInfo("[SmartAI] Intenção detectada: DIAGNOSTICAR");
                var result = await _autoActions["diagnosticar"]();
                return (true, result);
            }
            
            // Detectar intenção: ATIVAR MODO GAMER
            if ((normalized.Contains("modo") && normalized.Contains("gamer")) ||
                normalized.Contains("gaming") || 
                (normalized.Contains("ativar") && normalized.Contains("gamer")) ||
                (normalized.Contains("ativar") && normalized.Contains("jogo")) ||
                normalized.Contains("game mode"))
            {
                _logger.LogInfo("[SmartAI] Intenção detectada: ATIVAR MODO GAMER");
                var result = await _autoActions["modo_gamer"]();
                return (true, result);
            }
            
            // Detectar intenção: DESATIVAR MODO GAMER
            if ((normalized.Contains("desativar") && normalized.Contains("gamer")) ||
                (normalized.Contains("desligar") && normalized.Contains("gamer")) ||
                (normalized.Contains("parar") && normalized.Contains("gamer")))
            {
                _logger.LogInfo("[SmartAI] Intenção detectada: DESATIVAR MODO GAMER");
                var result = await _autoActions["desativar_gamer"]();
                return (true, result);
            }
            
            // Não detectou intenção clara
            _logger.LogInfo("[SmartAI] Nenhuma intenção clara detectada");
            return (false, string.Empty);
        }
        
        /// <summary>
        /// Retorna lista de comandos disponíveis
        /// </summary>
        public List<string> GetAvailableCommands()
        {
            return new List<string>
            {
                "Otimizar PC",
                "Limpar Sistema",
                "Diagnosticar Sistema",
                "Ativar Modo Gamer",
                "Desativar Modo Gamer"
            };
        }
        
        /// <summary>
        /// Formata bytes para formato legível
        /// </summary>
        private string FormatBytes(long bytes)
        {
            string[] sizes = { "B", "KB", "MB", "GB", "TB" };
            double len = bytes;
            int order = 0;
            while (len >= 1024 && order < sizes.Length - 1)
            {
                order++;
                len = len / 1024;
            }
            return $"{len:0.##} {sizes[order]}";
        }
    }
}
