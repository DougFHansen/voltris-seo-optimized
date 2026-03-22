using System;

namespace VoltrisOptimizer.Services.Thermal.Models
{
    /// <summary>
    /// Métricas térmicas do sistema
    /// </summary>
    public class ThermalMetrics
    {
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public double CpuTemperature { get; set; }
        public double GpuTemperature { get; set; }
        public bool CpuThrottling { get; set; }
        public bool GpuThrottling { get; set; }

        public ThermalMetrics()
        {
            // Logging para rastreamento de instâncias de dados estruturados
            App.LoggingService?.LogTrace("[THERMAL_MODEL] Nova métrica térmica instanciada");
        }
        
        /// <summary>
        /// Indica se a temperatura da CPU é estimada (calculada) ou real (lida de sensor)
        /// </summary>
        public bool IsCpuTemperatureEstimated { get; set; }

        /// <summary>
        /// Indica se a temperatura da GPU é estimada (calculada com base na CPU) ou real
        /// </summary>
        public bool IsGpuTemperatureEstimated { get; set; }
        
        /// <summary>
        /// Indica se as métricas são válidas (pelo menos CPU disponível e não NaN)
        /// </summary>
        public bool IsValid => !double.IsNaN(CpuTemperature);
    }
}
