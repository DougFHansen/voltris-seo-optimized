using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Gamer.AIAutoFixer.Interfaces;
using Models = VoltrisOptimizer.Services.Gamer.AIAutoFixer.Models;

namespace VoltrisOptimizer.Services.Gamer.AIAutoFixer.Implementation
{
    /// <summary>
    /// Motor de diagnóstico inteligente com regras e análise de padrões
    /// </summary>
    public class DiagnosticEngine : IDiagnosticEngine
    {
        public async Task<Models.DiagnosticResult> AnalyzeAsync(Models.TelemetrySnapshot telemetry, Models.IdealStateProfile idealState)
        {
            return await Task.Run(() =>
            {
                var diagnostics = new List<Models.DiagnosticResult>();

                // 1. Verificar CPU Overload
                if (telemetry.VoltrisCpuUsagePercent > idealState.MaxVoltrisCpuUsagePercent)
                {
                    diagnostics.Add(new Models.DiagnosticResult
                    {
                        Type = Models.ProblemType.VoltrisOverhead,
                        Severity = telemetry.VoltrisCpuUsagePercent > 10 ? Models.ProblemSeverity.Critical : Models.ProblemSeverity.High,
                        Title = "CPU em 100% causado pelo próprio módulo do Voltris",
                        Description = $"Voltris está consumindo {telemetry.VoltrisCpuUsagePercent:F1}% de CPU (máximo ideal: {idealState.MaxVoltrisCpuUsagePercent}%)",
                        AffectedComponent = "VoltrisOptimizer",
                        Metrics = new Dictionary<string, object> { { "CpuUsage", telemetry.VoltrisCpuUsagePercent } },
                        Confidence = 0.9,
                        RecommendedActions = new List<Models.RecommendedAction>
                        {
                            new Models.RecommendedAction
                            {
                                Action = "Reduzir overhead do Voltris",
                                Description = "Identificar e otimizar módulos que estão consumindo CPU demais",
                                ExpectedImprovement = 0.3,
                                CanAutoApply = true
                            }
                        }
                    });
                }

                // 2. Verificar GPU Underutilized
                if (telemetry.GpuUsagePercent < idealState.IdealGpuUsagePercent - 20)
                {
                    diagnostics.Add(new Models.DiagnosticResult
                    {
                        Type = Models.ProblemType.GpuUnderutilized,
                        Severity = Models.ProblemSeverity.Medium,
                        Title = "GPU underutilized por falta de threads disponíveis",
                        Description = $"GPU está usando apenas {telemetry.GpuUsagePercent:F1}% (ideal: {idealState.IdealGpuUsagePercent}%)",
                        AffectedComponent = "GPU",
                        Confidence = 0.7,
                        RecommendedActions = new List<Models.RecommendedAction>
                        {
                            new Models.RecommendedAction
                            {
                                Action = "Otimizar distribuição de threads",
                                Description = "Ajustar afinidade de CPU e prioridades para melhorar utilização da GPU",
                                ExpectedImprovement = 0.2,
                                CanAutoApply = true
                            }
                        }
                    });
                }

                // 3. Verificar DPC Latency
                if (telemetry.DpcLatencyUs > idealState.MaxAcceptableDpcLatencyUs)
                {
                    diagnostics.Add(new Models.DiagnosticResult
                    {
                        Type = Models.ProblemType.HighDpcLatency,
                        Severity = telemetry.DpcLatencyUs > 1000 ? Models.ProblemSeverity.Critical : Models.ProblemSeverity.High,
                        Title = "DPC latency alta gerada por serviço ou driver",
                        Description = $"DPC latency: {telemetry.DpcLatencyUs:F0}μs (máximo aceitável: {idealState.MaxAcceptableDpcLatencyUs}μs)",
                        AffectedComponent = telemetry.DpcSpikeSource ?? "Sistema",
                        Confidence = 0.8,
                        RecommendedActions = new List<Models.RecommendedAction>
                        {
                            new Models.RecommendedAction
                            {
                                Action = "Identificar e pausar serviço problemático",
                                Description = "Encontrar serviço ou driver causando DPC spikes",
                                ExpectedImprovement = 0.4,
                                CanAutoApply = true
                            }
                        }
                    });
                }

                // 4. Verificar Stutter
                if (telemetry.HasStutter)
                {
                    diagnostics.Add(new Models.DiagnosticResult
                    {
                        Type = Models.ProblemType.FrameTimeUnstable,
                        Severity = telemetry.StutterSeverity > 0.5 ? Models.ProblemSeverity.Critical : Models.ProblemSeverity.High,
                        Title = "Micro travadas detectadas: Frame Time instável",
                        Description = $"Stutter detectado com severidade {telemetry.StutterSeverity:P0}. Frame time std dev: {telemetry.FrameTimeStdDev:F2}ms",
                        AffectedComponent = "Rendering",
                        Confidence = 0.9,
                        RecommendedActions = new List<Models.RecommendedAction>
                        {
                            new Models.RecommendedAction
                            {
                                Action = "Otimizar frame time",
                                Description = "Ajustar configurações e processos para estabilizar frame time",
                                ExpectedImprovement = 0.5,
                                CanAutoApply = true
                            }
                        }
                    });
                }

                // 5. Verificar Overlay GPU Usage
                if (telemetry.OverlayGpuUsagePercent > idealState.MaxOverlayGpuUsagePercent)
                {
                    diagnostics.Add(new Models.DiagnosticResult
                    {
                        Type = Models.ProblemType.VoltrisOverhead,
                        Severity = Models.ProblemSeverity.Medium,
                        Title = "O overlay está consumindo GPU demais",
                        Description = $"Overlay usando {telemetry.OverlayGpuUsagePercent:F1}% de GPU (máximo: {idealState.MaxOverlayGpuUsagePercent}%)",
                        AffectedComponent = "OverlayService",
                        Confidence = 0.8,
                        RecommendedActions = new List<Models.RecommendedAction>
                        {
                            new Models.RecommendedAction
                            {
                                Action = "Otimizar renderização do overlay",
                                Description = "Reduzir frequência de atualização ou otimizar renderização",
                                ExpectedImprovement = 0.2,
                                CanAutoApply = true
                            }
                        }
                    });
                }

                // 6. Verificar Thermal Throttling
                if (telemetry.IsCpuThrottling || telemetry.IsGpuThrottling)
                {
                    diagnostics.Add(new Models.DiagnosticResult
                    {
                        Type = telemetry.IsCpuThrottling ? Models.ProblemType.ThermalThrottling : Models.ProblemType.PowerThrottling,
                        Severity = Models.ProblemSeverity.High,
                        Title = "Throttling detectado",
                        Description = $"{(telemetry.IsCpuThrottling ? "CPU" : "GPU")} está sendo limitado por {(telemetry.ThrottleReason == 1 ? "temperatura" : "energia")}",
                        AffectedComponent = telemetry.IsCpuThrottling ? "CPU" : "GPU",
                        Confidence = 0.9,
                        RecommendedActions = new List<Models.RecommendedAction>
                        {
                            new Models.RecommendedAction
                            {
                                Action = "Ajustar perfis de energia e ventilação",
                                Description = "Otimizar configurações de energia e garantir ventilação adequada",
                                ExpectedImprovement = 0.3,
                                CanAutoApply = false
                            }
                        }
                    });
                }

                // 7. Verificar Network Latency
                if (telemetry.NetworkLatencyMs > idealState.MaxAcceptableNetworkLatencyMs)
                {
                    diagnostics.Add(new Models.DiagnosticResult
                    {
                        Type = Models.ProblemType.NetworkLatency,
                        Severity = Models.ProblemSeverity.Medium,
                        Title = "Latência de rede alta",
                        Description = $"Latência: {telemetry.NetworkLatencyMs:F0}ms (máximo aceitável: {idealState.MaxAcceptableNetworkLatencyMs}ms)",
                        AffectedComponent = "Network",
                        Confidence = 0.7,
                        RecommendedActions = new List<Models.RecommendedAction>
                        {
                            new Models.RecommendedAction
                            {
                                Action = "Otimizar configurações de rede",
                                Description = "Ajustar buffers, desabilitar Nagle, otimizar QoS",
                                ExpectedImprovement = 0.2,
                                CanAutoApply = true
                            }
                        }
                    });
                }

                // Retornar o diagnóstico mais crítico ou o primeiro
                return diagnostics
                    .OrderByDescending(d => d.Severity)
                    .ThenByDescending(d => d.Confidence)
                    .FirstOrDefault() ?? new Models.DiagnosticResult
                    {
                        Type = Models.ProblemType.Unknown,
                        Severity = Models.ProblemSeverity.Low,
                        Title = "Sistema funcionando normalmente",
                        Description = "Nenhum problema crítico detectado",
                        Confidence = 1.0
                    };
            });
        }

        public async Task<List<Models.DiagnosticResult>> AnalyzePatternAsync(IReadOnlyList<Models.TelemetrySnapshot> history, Models.IdealStateProfile idealState)
        {
            return await Task.Run(() =>
            {
                var results = new List<Models.DiagnosticResult>();

                if (history.Count < 5)
                    return results;

                // Analisar padrões ao longo do tempo
                var recent = history.TakeLast(10).ToList();

                // Detectar tendência de piora de FPS
                var fpsTrend = recent.Select(s => s.AverageFps).ToList();
                if (fpsTrend.Count >= 5)
                {
                    var firstHalf = fpsTrend.Take(fpsTrend.Count / 2).Average();
                    var secondHalf = fpsTrend.Skip(fpsTrend.Count / 2).Average();
                    if (secondHalf < firstHalf * 0.9) // 10% de queda
                    {
                        results.Add(new Models.DiagnosticResult
                        {
                            Type = Models.ProblemType.ConfigurationRegression,
                            Severity = Models.ProblemSeverity.Medium,
                            Title = "Queda de FPS detectada",
                            Description = $"FPS médio caiu de {firstHalf:F1} para {secondHalf:F1}",
                            Confidence = 0.7
                        });
                    }
                }

                return results;
            });
        }

        public async Task<List<Models.PerformanceRegression>> DetectRegressionsAsync(IReadOnlyList<Models.TelemetrySnapshot> history, Models.IdealStateProfile idealState)
        {
            return await Task.Run(() =>
            {
                var regressions = new List<Models.PerformanceRegression>();

                if (history.Count < 10)
                    return regressions;

                var baseline = history.Take(5).ToList();
                var current = history.TakeLast(5).ToList();

                var baselineFps = baseline.Average(s => s.AverageFps);
                var currentFps = current.Average(s => s.AverageFps);

                if (currentFps < baselineFps * 0.95) // 5% de regressão
                {
                    regressions.Add(new Models.PerformanceRegression
                    {
                        DetectedAt = DateTime.Now,
                        Metric = "FPS",
                        BeforeValue = baselineFps,
                        AfterValue = currentFps,
                        RegressionPercent = ((baselineFps - currentFps) / baselineFps) * 100,
                        ProbableCause = "Configuração aplicada piorou FPS"
                    });
                }

                return regressions;
            });
        }

        public async Task<Models.RootCauseAnalysis> AnalyzeRootCauseAsync(Models.DiagnosticResult problem, Models.TelemetrySnapshot telemetry)
        {
            return await Task.Run(() =>
            {
                var analysis = new Models.RootCauseAnalysis();

                switch (problem.Type)
                {
                    case Models.ProblemType.VoltrisOverhead:
                        analysis.PrimaryCause = "Módulo do Voltris consumindo CPU excessivamente";
                        analysis.ContributingFactors.Add("Loop de otimização muito frequente");
                        analysis.ContributingFactors.Add("Módulos não otimizados");
                        analysis.CauseConfidence["VoltrisOverhead"] = 0.9;
                        break;

                    case Models.ProblemType.FrameTimeUnstable:
                        analysis.PrimaryCause = "Frame time instável causando stutter";
                        if (telemetry.HasDpcSpikes)
                            analysis.ContributingFactors.Add("DPC latency spikes");
                        if (telemetry.HasExcessiveDiskIo)
                            analysis.ContributingFactors.Add("I/O excessivo do disco");
                        analysis.CauseConfidence["FrameTime"] = 0.8;
                        break;

                    default:
                        analysis.PrimaryCause = "Causa desconhecida - requer análise mais profunda";
                        analysis.CauseConfidence["Unknown"] = 0.5;
                        break;
                }

                analysis.AnalysisDetails = $"Análise baseada em telemetria coletada em {telemetry.Timestamp}";

                return analysis;
            });
        }
    }
}

