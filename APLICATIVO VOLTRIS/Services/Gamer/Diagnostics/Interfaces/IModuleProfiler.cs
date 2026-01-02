using System;
using System.Collections.Generic;
using VoltrisOptimizer.Services.Gamer.Diagnostics.Models;

namespace VoltrisOptimizer.Services.Gamer.Diagnostics.Interfaces
{
    /// <summary>
    /// Interface para profiling de módulos individuais
    /// </summary>
    public interface IModuleProfiler
    {
        /// <summary>
        /// Nome do módulo sendo perfilado
        /// </summary>
        string ModuleName { get; }

        /// <summary>
        /// Evento disparado quando uma execução é registrada
        /// </summary>
        event EventHandler<ModuleExecutionSample>? ExecutionRecorded;

        /// <summary>
        /// Inicia a medição de uma execução
        /// </summary>
        IDisposable BeginExecution();

        /// <summary>
        /// Registra uma execução com métricas
        /// </summary>
        void RecordExecution(double executionTimeMs, double cpuUsagePercent = 0, double gpuUsagePercent = 0, int threadBlocks = 0);

        /// <summary>
        /// Obtém estatísticas do módulo
        /// </summary>
        ModuleStatistics GetStatistics();

        /// <summary>
        /// Obtém histórico de execuções
        /// </summary>
        IReadOnlyList<ModuleExecutionSample> GetHistory(int maxSamples = 100);

        /// <summary>
        /// Limpa o histórico
        /// </summary>
        void ClearHistory();
    }
}


