using System.Collections.Generic;
using System.Threading.Tasks;
using Models = VoltrisOptimizer.Services.Gamer.AIAutoFixer.Models;

namespace VoltrisOptimizer.Services.Gamer.AIAutoFixer.Interfaces
{
    /// <summary>
    /// Interface para o motor de diagnóstico inteligente
    /// </summary>
    public interface IDiagnosticEngine
    {
        /// <summary>
        /// Analisa telemetria e detecta problemas
        /// </summary>
        Task<Models.DiagnosticResult> AnalyzeAsync(Models.TelemetrySnapshot telemetry, Models.IdealStateProfile idealState);

        /// <summary>
        /// Analisa múltiplos snapshots para detectar padrões
        /// </summary>
        Task<List<Models.DiagnosticResult>> AnalyzePatternAsync(IReadOnlyList<Models.TelemetrySnapshot> history, Models.IdealStateProfile idealState);

        /// <summary>
        /// Detecta regressões de performance
        /// </summary>
        Task<List<Models.PerformanceRegression>> DetectRegressionsAsync(IReadOnlyList<Models.TelemetrySnapshot> history, Models.IdealStateProfile idealState);

        /// <summary>
        /// Identifica a causa raiz de um problema
        /// </summary>
        Task<Models.RootCauseAnalysis> AnalyzeRootCauseAsync(Models.DiagnosticResult problem, Models.TelemetrySnapshot telemetry);
    }
}

