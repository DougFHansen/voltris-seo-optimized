using System;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Thermal.Models;

namespace VoltrisOptimizer.Services.Thermal
{
    /// <summary>
    /// Interface para o serviço global de monitoramento térmico
    /// </summary>
    public interface IGlobalThermalMonitorService : IDisposable
    {
        /// <summary>
        /// Evento disparado quando métricas térmicas são atualizadas
        /// </summary>
        event EventHandler<ThermalMetrics>? MetricsUpdated;

        /// <summary>
        /// Evento disparado quando um alerta térmico é gerado
        /// </summary>
        event EventHandler<ThermalAlert>? AlertGenerated;

        /// <summary>
        /// Métricas térmicas atuais
        /// </summary>
        ThermalMetrics? CurrentMetrics { get; }

        /// <summary>
        /// Indica se o monitoramento está ativo
        /// </summary>
        bool IsMonitoring { get; }

        /// <summary>
        /// Inicia o monitoramento térmico
        /// </summary>
        Task StartMonitoringAsync();

        /// <summary>
        /// Para o monitoramento térmico
        /// </summary>
        Task StopMonitoringAsync();

        /// <summary>
        /// Obtém as métricas térmicas atuais
        /// </summary>
        Task<ThermalMetrics> GetCurrentMetricsAsync();

        /// <summary>
        /// Suprime alertas temporariamente (ex: usuário clicou em "Ignorar por 1h")
        /// </summary>
        void SuppressAlertsFor(TimeSpan duration);
    }
}
