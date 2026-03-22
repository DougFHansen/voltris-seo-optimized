using System;
using System.Collections.Generic;
using System.Linq;

namespace VoltrisOptimizer.Core.SystemIntelligenceProfiler
{
    /// <summary>
    /// MOTOR DE DECISÃO INTELIGENTE (ENTERPRISE GRADE) v3.0
    /// Arquitetura em 5 Camadas: Detecção, Classificação, Matriz de Decisão, Regressão, Simulação.
    /// Foco: Confiabilidade, Segurança e Explicabilidade.
    /// </summary>
    public class DecisionEngine : IDecisionEngine
    {
        public ProfilerReport Evaluate(AuditData audit, UserAnswers answers)
        {
            var report = new ProfilerReport
            {
                Audit = audit,
                Answers = answers,
                Timestamp = DateTime.Now
            };

            // -------------------------------------------------------------
            // CAMADA 1: DETECÇÃO & PRÉ-VALIDAÇÃO (HARDWARE STATE)
            // -------------------------------------------------------------
            report.HealthAlerts = AnalyzeHardwareHealth(audit);
            bool isThermalCritical = audit.ThermalStatus == ThermalTier.Critical;
            bool isThermalWarning = audit.ThermalStatus == ThermalTier.Warm;
            bool isMemoryCritical = audit.Ram.IsMemoryPressure || audit.Ram.AvailableMb < 1024;
            
            // Log inicial de estado
            LogDecision("SYSTEM_STATE", $"Perf: {audit.PerfTier} | Thermal: {audit.ThermalStatus} | RAM Free: {audit.Ram.AvailableMb}MB");

            if (isThermalCritical)
            {
                LogDecision("BLOCK_ALL", "Sistema em estado TÉRMICO CRÍTICO. Abortando otimizações.");
                report.HealthAlerts.Add("🔥 CRÍTICO: Sistema superaquecido. Otimizações suspensas para evitar danos.");
                return report; // Retorna apenas alertas, sem otimizações
            }

            var recommendations = new List<ActionRecommendation>();
            var profile = answers.Profile;
            var isLaptop = answers.IsLaptop;

            // -------------------------------------------------------------
            // CAMADA 2 & 3: MATRIZ DE DECISÃO ESTRUTURADA
            // -------------------------------------------------------------

            // --- A. CPU OPTIMIZATION MATRIX ---
            // Regra: Só tocar no scheduler se tiver muitos núcleos e estiver frio.
            if (audit.Cpu.PhysicalCores >= 6 && !isThermalWarning && !isThermalCritical)
            {
                // Unpark Cores (Safe em High End)
                if (audit.PerfTier >= PerformanceTier.HighEnd)
                    AddRec(recommendations, "CPU Core Unparking", ActionType.Process_Optimize, 
                        RecommendationCategory.Safe, 30, 0, "Libera todos os núcleos para processamento imediato.", profile);
            }
            else
            {
                LogDecision("CPU_SKIP", "CPU com poucos núcleos ou quente. Mantendo padrão do Windows.");
            }

            // Power Plan Logic
            if (isLaptop && audit.Battery.Status != "Carregando" && audit.Battery.EstimatedChargePercent < 20)
            {
                // Force Eco
                AddRec(recommendations, "Modo de Emergência de Bateria", ActionType.PowerPlan_Balanced, 
                    RecommendationCategory.Safe, 90, 0, "Bateria crítica. Priorizando duração máxima.", profile);
            }
            else if (isThermalWarning)
            {
                // Force Balanced/Cool
                 AddRec(recommendations, "Modo de Eficiência Térmica", ActionType.PowerPlan_Balanced, 
                    RecommendationCategory.Safe, 80, 0, "Reduz clocks para controlar temperatura.", profile);
            }
            else if ((profile == UserProfile.GamerCompetitive || profile == UserProfile.GamerSinglePlayer || profile == UserProfile.CreativeVideoEditing) && audit.SupportsHighPerformancePlan)
            {
                 AddRec(recommendations, "Plano de Alto Desempenho", ActionType.PowerPlan_HighPerformance, 
                    RecommendationCategory.Conditional, 40, isLaptop ? 10 : 0, "Maximiza resposta da CPU.", profile);
            }

            // --- B. GPU & DISPLAY MATRIX ---
            // Regra: Monitor < 144Hz não precisa de tweaks de latência extrema.
            bool highRefresh = audit.Display.RefreshRateHz >= 144;
            
            if (highRefresh && (profile == UserProfile.GamerCompetitive || profile == UserProfile.GamerSinglePlayer))
            {
                AddRec(recommendations, "Otimização de Latência de Display", ActionType.Visual_Optimize, 
                    RecommendationCategory.Safe, 20, 0, $"Detectado monitor {audit.Display.RefreshRateHz}Hz. Ajustando prioridade de composição.", profile);
            }

            if (!audit.Gpu.IsIntegrated && audit.Gpu.HagsSupported && !isThermalWarning)
            {
                 AddRec(recommendations, "HAGS (GPU Scheduling)", ActionType.Advanced_DisableHags, 
                    RecommendationCategory.Conditional, 15, 5, "Permite que a GPU gerencie sua memória diretamente.", profile);
            }

            // --- C. MEMORY MATRIX ---
            bool allowCaching = audit.Ram.TotalMb >= 16384; // 16GB
            
            if (allowCaching && !isMemoryCritical)
            {
                 // Manter Kernel na RAM (Paging Executive)
                 AddRec(recommendations, "Manter Kernel na RAM", ActionType.Memory_Optimize, 
                    RecommendationCategory.Safe, 10, 0, "Evita paginação do núcleo do OS para disco.", profile);
            }
            else if (audit.Ram.TotalMb < 8192)
            {
                 // Bloquear tweaks de cache, focar em limpeza
                 LogDecision("RAM_LIMIT", "RAM baixa. Bloqueando otimizações de cache que consomem memória.");
                 AddRec(recommendations, "Otimização de Pagefile (Baixa RAM)", ActionType.Memory_Optimize, 
                    RecommendationCategory.Safe, 60, 5, "Ajusta memória virtual para evitar erros de falta de memória.", profile);
            }

            // --- D. STORAGE MATRIX (SSD vs HDD Aware) ---
            bool isSsd = audit.Storage.SystemDiskType.Contains("SSD") || audit.Storage.SystemDiskType.Contains("NVMe");
            
            if (isSsd)
            {
                AddRec(recommendations, "Desativar Superfetch (SSD)", ActionType.Storage_DisableSuperfetch, 
                    RecommendationCategory.Safe, 20, 0, "Desnecessário em SSDs.", profile);
                AddRec(recommendations, "TRIM Enforcement", ActionType.Storage_EnableTrim, 
                    RecommendationCategory.Safe, 80, 0, "Mantém performance de escrita do SSD.", profile);
            }
            else // HDD
            {
                 AddRec(recommendations, "Desfragmentação Inteligente", ActionType.Storage_Defrag, 
                    RecommendationCategory.Conditional, 70, 5, "Essencial para HDs mecânicos.", profile);
            }
            
            // --- E. USER-SPECIFIC OVERRIDES (FROM QUESTIONNAIRE) ---
            if (answers.OptimizeGPU && !audit.Gpu.IsIntegrated)
            {
                AddRec(recommendations, "Otimização Avançada de GPU", ActionType.General_Optimize, 
                    RecommendationCategory.Safe, 35, 0, "Ajusta drivers e buffers de vídeo para máxima performance.", profile);
            }

            if (answers.ResetNetwork)
            {
                AddRec(recommendations, "Reset de Stack de Rede", ActionType.Network_ResetStack, 
                    RecommendationCategory.Safe, 50, 0, "Limpa e redefine protocolos de rede para remover instabilidades.", profile);
            }

            if (answers.OptimizeDisk)
            {
                AddRec(recommendations, "Priorização de I/O de Disco", ActionType.Advanced_OptimizeIrq, 
                    RecommendationCategory.Safe, 25, 0, "Reduz tempo de espera para leitura/escrita de dados críticos.", profile);
            }

            if (answers.CleanSystem)
            {
                AddRec(recommendations, "Limpeza Profunda do Sistema", ActionType.SystemCleanup, 
                    RecommendationCategory.Safe, 45, 0, "Remove logs, caches e resíduos que degradam a performance.", profile);
            }

            // Universal Storage (Keep as fallback if not already added)
            if (!answers.CleanSystem && !recommendations.Any(r => r.Type == ActionType.SystemCleanup))
            {
                AddRec(recommendations, "Limpeza de Sistema", ActionType.SystemCleanup, 
                    RecommendationCategory.Safe, 20, 0, "Remove lixo digital com segurança.", profile);
            }


            // -------------------------------------------------------------
            // CAMADA 4 & 5: PREVENÇÃO DE REGRESSÃO E SIMULAÇÃO
            // -------------------------------------------------------------
            // Filtro final: Simular risco acumulado
            
            var finalRecommendations = new List<ActionRecommendation>();
            int accumulatedRisk = 0;

            foreach (var rec in recommendations)
            {
                // Check simulado
                if (SimulateRisk(rec, audit, isLaptop, accumulatedRisk))
                {
                    finalRecommendations.Add(rec);
                    accumulatedRisk += rec.RiskScore;
                }
                else
                {
                    LogDecision("RISK_REJECT", $"Rejeitado por risco excessivo: {rec.Name}");
                }
            }

            report.Recommendations = SortRecommendations(finalRecommendations);
            return report;
        }

        private List<string> AnalyzeHardwareHealth(AuditData audit)
        {
            var alerts = new List<string>();

            if (audit.CpuTemp > 90) alerts.Add($"🔥 PERIGO: CPU em {audit.CpuTemp:F1}°C.");
            if (audit.GpuTemp > 90) alerts.Add($"🔥 PERIGO: GPU em {audit.GpuTemp:F1}°C.");
            if (!audit.Storage.SmartOk) alerts.Add("💀 FALHA DE DISCO: Erro SMART detectado.");
            if (audit.Ram.IsMemoryPressure) alerts.Add("⚠️ MEMÓRIA CHEIA: Sistema operando no limite da RAM.");

            return alerts;
        }

        private void AddRec(List<ActionRecommendation> list, string name, ActionType type, RecommendationCategory cat, int gain, int risk, string explanation, UserProfile profile)
        {
            // Validação de Perfil na entrada
            if (cat == RecommendationCategory.Risky && (profile == UserProfile.WorkOffice || profile == UserProfile.EnterpriseSecure))
            {
                LogDecision("PROFILE_REJECT", $"Blocked Risky tweak '{name}' for Enterprise profile.");
                return;
            }

            list.Add(new ActionRecommendation
            {
                Name = name,
                Type = type,
                Category = cat,
                ExpectedGainScore = gain,
                RiskScore = risk,
                Supported = true,
                Explanation = explanation,
                Module = "DecisionEngine"
            });
            LogDecision("CANDIDATE", $"Proposed: {name} (Gain: {gain}, Risk: {risk})");
        }

        private bool SimulateRisk(ActionRecommendation rec, AuditData audit, bool isLaptop, int currentSystemRisk)
        {
            // 1. Laptop Battery Protection
            if (isLaptop && rec.Type == ActionType.PowerPlan_HighPerformance && audit.Battery.Status != "Carregando")
            {
                 LogDecision("SIM_FAIL", "High Perf blocked on battery.");
                 return false;
            }

            // 2. Thermal Protection
            if (audit.ThermalStatus != ThermalTier.Stable && rec.Type == ActionType.GamerMode_Activate)
            {
                LogDecision("SIM_FAIL", "Gamer Mode blocked due to thermals.");
                return false;
            }
            
            // 3. Cumulative Risk verification
            if (currentSystemRisk + rec.RiskScore > 30) // Hard limit de risco acumulado por sessão
            {
                LogDecision("SIM_FAIL", "Risk budget exceeded.");
                return false;
            }

            return true;
        }

        private List<ActionRecommendation> SortRecommendations(List<ActionRecommendation> list)
        {
            return list.OrderByDescending(r => r.Category == RecommendationCategory.Safe)
                       .ThenByDescending(r => r.ExpectedGainScore)
                       .ToList();
        }

        private void LogDecision(string tag, string message)
        {
            try { App.LoggingService?.LogInfo($"[DECISION::{tag}] {message}"); } catch {}
        }
    }
}
