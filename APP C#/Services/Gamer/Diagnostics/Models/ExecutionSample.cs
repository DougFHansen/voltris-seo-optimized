using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace VoltrisOptimizer.Services.Gamer.Diagnostics.Models
{
    /// <summary>
    /// Amostra de execução de um módulo
    /// </summary>
    public class ModuleExecutionSample
    {
        /// <summary>
        /// Nome do módulo
        /// </summary>
        public string ModuleName { get; set; } = "";

        /// <summary>
        /// Timestamp da execução
        /// </summary>
        public DateTime Timestamp { get; set; } = DateTime.Now;

        /// <summary>
        /// Tempo de execução em milissegundos
        /// </summary>
        public double ExecutionTimeMs { get; set; }

        /// <summary>
        /// Uso de CPU durante a execução (%)
        /// </summary>
        public double CpuUsagePercent { get; set; }

        /// <summary>
        /// Uso de GPU durante a execução (%)
        /// </summary>
        public double GpuUsagePercent { get; set; }

        /// <summary>
        /// Número de bloqueios de thread detectados
        /// </summary>
        public int ThreadBlocks { get; set; }

        /// <summary>
        /// Uso de memória durante a execução (MB)
        /// </summary>
        public double MemoryUsageMb { get; set; }

        /// <summary>
        /// Número de threads ativas durante a execução
        /// </summary>
        public int ActiveThreads { get; set; }

        /// <summary>
        /// Indica se houve exceção silenciosa
        /// </summary>
        public bool HadSilentException { get; set; }

        /// <summary>
        /// Mensagem de exceção (se houver)
        /// </summary>
        public string? ExceptionMessage { get; set; }

        /// <summary>
        /// Avisos detectados durante a execução
        /// </summary>
        public List<string> Warnings { get; set; } = new List<string>();

        /// <summary>
        /// Custo de execução calculado (executionTime * cpuUsage)
        /// </summary>
        [JsonIgnore]
        public double ExecutionCost => ExecutionTimeMs * (1 + CpuUsagePercent / 100.0);
    }
}

