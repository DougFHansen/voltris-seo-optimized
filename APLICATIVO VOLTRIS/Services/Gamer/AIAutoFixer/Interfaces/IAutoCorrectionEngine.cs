using System.Collections.Generic;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Gamer.AIAutoFixer.Models;

namespace VoltrisOptimizer.Services.Gamer.AIAutoFixer.Interfaces
{
    /// <summary>
    /// Interface para o engine de correção automática
    /// </summary>
    public interface IAutoCorrectionEngine
    {
        /// <summary>
        /// Gera correções baseadas em diagnósticos
        /// </summary>
        Task<List<AutoCorrection>> GenerateCorrectionsAsync(DiagnosticResult diagnostic, RootCauseAnalysis rootCause);

        /// <summary>
        /// Aplica uma correção
        /// </summary>
        Task<bool> ApplyCorrectionAsync(AutoCorrection correction);

        /// <summary>
        /// Reverte uma correção
        /// </summary>
        Task<bool> RevertCorrectionAsync(AutoCorrection correction);

        /// <summary>
        /// Reverte todas as correções que pioraram o desempenho
        /// </summary>
        Task<List<AutoCorrection>> RevertBadOptimizationsAsync(IReadOnlyList<AutoCorrection> corrections, IReadOnlyList<TelemetrySnapshot> beforeAfter);

        /// <summary>
        /// Valida se uma correção é segura para aplicar
        /// </summary>
        bool IsCorrectionSafe(AutoCorrection correction);
    }
}


