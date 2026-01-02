using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Gamer.AIAutoFixer.Models;

namespace VoltrisOptimizer.Services.Gamer.AIAutoFixer.Interfaces
{
    /// <summary>
    /// Interface para coleta de telemetria em tempo real
    /// </summary>
    public interface ITelemetryCollector : IDisposable
    {
        /// <summary>
        /// Indica se está coletando
        /// </summary>
        bool IsCollecting { get; }

        /// <summary>
        /// Evento disparado quando novos dados são coletados
        /// </summary>
        event EventHandler<TelemetrySnapshot>? DataCollected;

        /// <summary>
        /// Inicia a coleta de telemetria
        /// </summary>
        Task StartAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Para a coleta
        /// </summary>
        Task StopAsync();

        /// <summary>
        /// Obtém snapshot atual
        /// </summary>
        TelemetrySnapshot GetCurrentSnapshot();

        /// <summary>
        /// Obtém histórico de snapshots
        /// </summary>
        IReadOnlyList<TelemetrySnapshot> GetHistory(int maxItems = 100);
    }
}

