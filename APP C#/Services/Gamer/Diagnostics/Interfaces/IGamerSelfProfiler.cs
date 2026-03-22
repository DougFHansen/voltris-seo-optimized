using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Gamer.Diagnostics.Models;

namespace VoltrisOptimizer.Services.Gamer.Diagnostics.Interfaces
{
    /// <summary>
    /// Interface principal do sistema de self-profiling do modo gamer
    /// Monitora e analisa o comportamento interno do Voltris durante o modo gamer
    /// </summary>
    public interface IGamerSelfProfiler : IDisposable
    {
        /// <summary>
        /// Indica se o profiling está ativo
        /// </summary>
        bool IsActive { get; }

        /// <summary>
        /// Evento disparado quando uma anomalia é detectada
        /// </summary>
        event EventHandler<PerformanceAnomaly>? AnomalyDetected;

        /// <summary>
        /// Evento disparado quando novos dados de profiling são coletados
        /// </summary>
        event EventHandler<ProfilingSnapshot>? SnapshotUpdated;

        /// <summary>
        /// Inicia o profiling do modo gamer
        /// </summary>
        Task StartAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Para o profiling
        /// </summary>
        Task StopAsync();

        /// <summary>
        /// Registra o início da execução de um módulo
        /// </summary>
        void BeginModuleExecution(string moduleName);

        /// <summary>
        /// Registra o fim da execução de um módulo
        /// </summary>
        void EndModuleExecution(string moduleName);

        /// <summary>
        /// Registra uma execução completa de módulo com métricas
        /// </summary>
        void RecordModuleExecution(string moduleName, double executionTimeMs, double cpuUsagePercent = 0, double gpuUsagePercent = 0, int threadBlocks = 0);

        /// <summary>
        /// Registra o tempo do loop do orquestrador
        /// </summary>
        void RecordOrchestratorLoop(double loopTimeMs);

        /// <summary>
        /// Obtém o relatório atual de profiling
        /// </summary>
        ProfilingReport GetCurrentReport();

        /// <summary>
        /// Obtém histórico de execuções de um módulo
        /// </summary>
        IReadOnlyList<ModuleExecutionSample> GetModuleHistory(string moduleName, int maxSamples = 100);

        /// <summary>
        /// Obtém todas as anomalias detectadas
        /// </summary>
        IReadOnlyList<PerformanceAnomaly> GetDetectedAnomalies();

        /// <summary>
        /// Limpa o histórico de profiling
        /// </summary>
        void ClearHistory();

        /// <summary>
        /// Exporta relatório completo para JSON
        /// </summary>
        Task<string> ExportReportAsync();
    }
}

