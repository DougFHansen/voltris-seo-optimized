using System;
using System.Collections.Generic;
using VoltrisOptimizer.Services.Gamer.Diagnostics.Models;

namespace VoltrisOptimizer.Services.Gamer.Diagnostics.Interfaces
{
    /// <summary>
    /// Interface para detecção automática de anomalias de performance
    /// </summary>
    public interface IPerformanceAnomalyDetector
    {
        /// <summary>
        /// Evento disparado quando uma anomalia é detectada
        /// </summary>
        event EventHandler<PerformanceAnomaly>? AnomalyDetected;

        /// <summary>
        /// Analisa uma amostra de execução e detecta anomalias
        /// </summary>
        IReadOnlyList<PerformanceAnomaly> AnalyzeSample(ModuleExecutionSample sample, ModuleStatistics statistics);

        /// <summary>
        /// Analisa o snapshot completo do sistema
        /// </summary>
        IReadOnlyList<PerformanceAnomaly> AnalyzeSnapshot(ProfilingSnapshot snapshot);

        /// <summary>
        /// Obtém todas as anomalias detectadas
        /// </summary>
        IReadOnlyList<PerformanceAnomaly> GetDetectedAnomalies();

        /// <summary>
        /// Limpa anomalias antigas
        /// </summary>
        void ClearAnomalies(TimeSpan olderThan);
    }
}


