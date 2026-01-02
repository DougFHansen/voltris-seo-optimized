using System;
using System.Collections.Generic;

namespace VoltrisOptimizer.Services.Gamer.Diagnostics.Models
{
    /// <summary>
    /// Snapshot completo do estado de profiling em um momento
    /// </summary>
    public class ProfilingSnapshot
    {
        /// <summary>
        /// Timestamp do snapshot
        /// </summary>
        public DateTime Timestamp { get; set; } = DateTime.Now;

        /// <summary>
        /// Estatísticas de cada módulo
        /// </summary>
        public Dictionary<string, ModuleStatistics> ModuleStatistics { get; set; } = new Dictionary<string, ModuleStatistics>();

        /// <summary>
        /// Tempo total do loop do orquestrador (ms)
        /// </summary>
        public double OrchestratorLoopTimeMs { get; set; }

        /// <summary>
        /// Uso total de CPU pelo Voltris (%)
        /// </summary>
        public double TotalCpuUsagePercent { get; set; }

        /// <summary>
        /// Uso total de GPU pelo overlay (%)
        /// </summary>
        public double OverlayGpuUsagePercent { get; set; }

        /// <summary>
        /// Uso de memória pelo Voltris (MB)
        /// </summary>
        public double TotalMemoryUsageMb { get; set; }

        /// <summary>
        /// Número de threads ativas
        /// </summary>
        public int ActiveThreads { get; set; }

        /// <summary>
        /// Número de tarefas assíncronas pendentes
        /// </summary>
        public int PendingAsyncTasks { get; set; }

        /// <summary>
        /// Eventos que ultrapassaram limites seguros
        /// </summary>
        public List<PerformanceAnomaly> Anomalies { get; set; } = new List<PerformanceAnomaly>();

        /// <summary>
        /// Latência interna total (ms)
        /// </summary>
        public double InternalLatencyMs { get; set; }

        /// <summary>
        /// Indica se há chamadas de rede ativas
        /// </summary>
        public bool HasActiveNetworkCalls { get; set; }

        /// <summary>
        /// Número de deadlocks parciais detectados
        /// </summary>
        public int PartialDeadlocks { get; set; }
    }
}


