using System;
using System.Collections.Generic;

namespace VoltrisOptimizer.Services.Gamer.Diagnostics.Models
{
    /// <summary>
    /// Relatório completo de profiling
    /// </summary>
    public class ProfilingReport
    {
        /// <summary>
        /// Timestamp de geração do relatório
        /// </summary>
        public DateTime GeneratedAt { get; set; } = DateTime.Now;

        /// <summary>
        /// Período de profiling
        /// </summary>
        public TimeSpan ProfilingDuration { get; set; }

        /// <summary>
        /// Snapshot atual
        /// </summary>
        public ProfilingSnapshot CurrentSnapshot { get; set; } = new ProfilingSnapshot();

        /// <summary>
        /// Estatísticas de todos os módulos
        /// </summary>
        public Dictionary<string, ModuleStatistics> ModuleStatistics { get; set; } = new Dictionary<string, ModuleStatistics>();

        /// <summary>
        /// Todas as anomalias detectadas
        /// </summary>
        public List<PerformanceAnomaly> AllAnomalies { get; set; } = new List<PerformanceAnomaly>();

        /// <summary>
        /// Resumo executivo
        /// </summary>
        public ProfilingSummary Summary { get; set; } = new ProfilingSummary();
    }

    /// <summary>
    /// Resumo executivo do profiling
    /// </summary>
    public class ProfilingSummary
    {
        /// <summary>
        /// Módulo com maior tempo de execução
        /// </summary>
        public string? SlowestModule { get; set; }

        /// <summary>
        /// Módulo com maior uso de CPU
        /// </summary>
        public string? HighestCpuModule { get; set; }

        /// <summary>
        /// Número total de anomalias críticas
        /// </summary>
        public int CriticalAnomalies { get; set; }

        /// <summary>
        /// Número total de anomalias de alta severidade
        /// </summary>
        public int HighSeverityAnomalies { get; set; }

        /// <summary>
        /// Tempo médio do loop do orquestrador (ms)
        /// </summary>
        public double AverageOrchestratorLoopTimeMs { get; set; }

        /// <summary>
        /// Uso médio de CPU pelo Voltris (%)
        /// </summary>
        public double AverageCpuUsagePercent { get; set; }

        /// <summary>
        /// Recomendações gerais
        /// </summary>
        public List<string> Recommendations { get; set; } = new List<string>();
    }
}


