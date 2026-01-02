using System;
using System.Collections.Generic;

namespace VoltrisOptimizer.Services.Gamer.Diagnostics.Models
{
    /// <summary>
    /// Estatísticas agregadas de um módulo
    /// </summary>
    public class ModuleStatistics
    {
        /// <summary>
        /// Nome do módulo
        /// </summary>
        public string ModuleName { get; set; } = "";

        /// <summary>
        /// Tempo médio de execução (ms)
        /// </summary>
        public double AverageExecutionTimeMs { get; set; }

        /// <summary>
        /// Tempo mínimo de execução (ms)
        /// </summary>
        public double MinExecutionTimeMs { get; set; }

        /// <summary>
        /// Tempo máximo de execução (ms)
        /// </summary>
        public double MaxExecutionTimeMs { get; set; }

        /// <summary>
        /// Desvio padrão do tempo de execução (ms)
        /// </summary>
        public double StdDevExecutionTimeMs { get; set; }

        /// <summary>
        /// Uso médio de CPU (%)
        /// </summary>
        public double AverageCpuUsagePercent { get; set; }

        /// <summary>
        /// Uso médio de GPU (%)
        /// </summary>
        public double AverageGpuUsagePercent { get; set; }

        /// <summary>
        /// Total de bloqueios de thread
        /// </summary>
        public int TotalThreadBlocks { get; set; }

        /// <summary>
        /// Número total de execuções registradas
        /// </summary>
        public int TotalExecutions { get; set; }

        /// <summary>
        /// Número de execuções que ultrapassaram o threshold
        /// </summary>
        public int ExecutionsAboveThreshold { get; set; }

        /// <summary>
        /// Percentil 95 do tempo de execução (ms)
        /// </summary>
        public double P95ExecutionTimeMs { get; set; }

        /// <summary>
        /// Percentil 99 do tempo de execução (ms)
        /// </summary>
        public double P99ExecutionTimeMs { get; set; }

        /// <summary>
        /// Timestamp da última execução
        /// </summary>
        public DateTime? LastExecutionTime { get; set; }

        /// <summary>
        /// Histórico de picos detectados
        /// </summary>
        public List<DateTime> PeakDetections { get; set; } = new List<DateTime>();
    }
}


