using System.Collections.Generic;

namespace VoltrisOptimizer.Core.SystemIntelligenceProfiler
{
    public class DecisionEngine : IDecisionEngine
    {
        public List<ActionRecommendation> Evaluate(AuditData audit, UserAnswers answers)
        {
            var list = new List<ActionRecommendation>();

            // Regra: Limpeza (sempre segura)
            list.Add(new ActionRecommendation
            {
                Name = "Limpeza de Sistema",
                Module = "SystemCleaner",
                Category = RecommendationCategory.Safe,
                CompatibilityScore = 95,
                ExpectedGainScore = 50,
                RiskScore = 5,
                Supported = true,
                Explanation = "Remove conteúdo temporário e lixo"
            });

            // Regra: Pagefile para low-end
            if (audit.Cpu.LogicalCores <= 4 && audit.Ram.TotalMb <= 8192)
            {
                list.Add(new ActionRecommendation
                {
                    Name = "Aumentar Pagefile",
                    Module = "AdvancedOptimizer",
                    Category = RecommendationCategory.Conditional,
                    CompatibilityScore = 85,
                    ExpectedGainScore = 30,
                    RiskScore = 10,
                    Supported = true,
                    Explanation = "Aumenta arquivo de paginação para evitar falta de memória"
                });
                list.Add(new ActionRecommendation
                {
                    Name = "Perfil de Serviços Mínimos",
                    Module = "AdvancedOptimizer",
                    Category = RecommendationCategory.Conditional,
                    CompatibilityScore = 70,
                    ExpectedGainScore = 20,
                    RiskScore = 25,
                    Supported = true,
                    Explanation = "Reduz serviços em segundo plano para liberar recursos"
                });
                list.Add(new ActionRecommendation
                {
                    Name = "Desativar HAGS",
                    Module = "AdvancedOptimizer",
                    Category = RecommendationCategory.Conditional,
                    CompatibilityScore = audit.Gpu.HagsSupported ? 60 : 40,
                    ExpectedGainScore = 12,
                    RiskScore = 20,
                    Supported = audit.Gpu.HagsSupported,
                    Explanation = "Desativa Hardware-accelerated GPU scheduling em sistemas low-end"
                });
            }

            // Regra: GPU integrada => cache avançado não suportado
            if (audit.Gpu.IsIntegrated)
            {
                list.Add(new ActionRecommendation
                {
                    Name = "Shader Cache Avançado",
                    Module = "AdvancedOptimizer",
                    Category = RecommendationCategory.Risky,
                    CompatibilityScore = 30,
                    ExpectedGainScore = 10,
                    RiskScore = 50,
                    Supported = false,
                    Explanation = "Cache avançado não é recomendado para GPU integrada"
                });
            }

            // Regra: RSS tuning
            if (audit.Nic.SupportsRss)
            {
                var gain = audit.DpcLatency.DpcRate > 100 ? 40 : 25;
                list.Add(new ActionRecommendation
                {
                    Name = "Tuning RSS da NIC",
                    Module = "NetworkOptimizer",
                    Category = RecommendationCategory.Conditional,
                    CompatibilityScore = 80,
                    ExpectedGainScore = gain,
                    RiskScore = 15,
                    Supported = true,
                    Explanation = "Ajusta Receive-Side Scaling para reduzir latência"
                });
            }

            // Regra: DPC alto
            if (audit.DpcLatency.DpcRate > 200)
            {
                list.Add(new ActionRecommendation
                {
                    Name = "Otimizações IRQ/DPC",
                    Module = "AdvancedOptimizer",
                    Category = RecommendationCategory.Conditional,
                    CompatibilityScore = 65,
                    ExpectedGainScore = 25,
                    RiskScore = 30,
                    Supported = true,
                    Explanation = "Ajuste de IRQs e DPCs após dry-run"
                });
            }

            // Regra: bateria presente e prioridade estabilidade
            if (audit.Battery.Present && answers.Priority == "Stability")
            {
                list.Add(new ActionRecommendation
                {
                    Name = "Plano de Energia Balanceado",
                    Module = "PerformanceOptimizer",
                    Category = RecommendationCategory.Safe,
                    CompatibilityScore = 90,
                    ExpectedGainScore = 15,
                    RiskScore = 5,
                    Supported = true,
                    Explanation = "Plano mais conservador para notebooks"
                });
            }
            else
            {
                list.Add(new ActionRecommendation
                {
                    Name = "Plano de Alto Desempenho",
                    Module = "PerformanceOptimizer",
                    Category = RecommendationCategory.Safe,
                    CompatibilityScore = audit.SupportsHighPerformancePlan ? 85 : 50,
                    ExpectedGainScore = 30,
                    RiskScore = 15,
                    Supported = audit.SupportsHighPerformancePlan,
                    Explanation = "Ativa plano de energia de alto desempenho"
                });
            }

            // Regra: Modo Gamer
            var plays = answers.UseCase.Contains("Jogos") || answers.UseCase.Contains("games");
            list.Add(new ActionRecommendation
            {
                Name = "Modo Gamer",
                Module = "GamerOptimizerService",
                Category = plays ? RecommendationCategory.Safe : RecommendationCategory.Conditional,
                CompatibilityScore = 80,
                ExpectedGainScore = plays ? 80 : 50,
                RiskScore = plays ? 20 : 30,
                Supported = true,
                Explanation = "Priorização de jogos e redução de interferências"
            });

            // Regra: HAGS não suportado por build
            if (audit.Windows.Build < 19041)
            {
                list.Add(new ActionRecommendation
                {
                    Name = "HAGS",
                    Module = "AdvancedOptimizer",
                    Category = RecommendationCategory.Risky,
                    CompatibilityScore = 30,
                    ExpectedGainScore = 12,
                    RiskScore = 40,
                    Supported = false,
                    Explanation = "Windows abaixo do build mínimo para HAGS"
                });
            }

            return list;
        }
    }
}
