using System;
using System.Collections.Generic;

namespace VoltrisOptimizer.Services.Gamer.AIAutoFixer.Models
{
    /// <summary>
    /// Perfil de estado ideal do sistema
    /// Representa o que é considerado "perfeito" para performance
    /// </summary>
    public class IdealStateProfile
    {
        public DateTime LastUpdated { get; set; } = DateTime.Now;
        public int SampleCount { get; set; }

        // FPS Ideal
        public double IdealFps { get; set; } = 60;
        public double MinAcceptableFps { get; set; } = 30;
        public double IdealFrameTimeMs { get; set; } = 16.67;
        public double MaxAcceptableFrameTimeMs { get; set; } = 33.33;

        // Uso de Recursos Ideal
        public double IdealCpuUsagePercent { get; set; } = 70; // Jogo deve usar ~70% da CPU
        public double MaxVoltrisCpuUsagePercent { get; set; } = 5; // Voltris não deve usar mais que 5%
        public double IdealGpuUsagePercent { get; set; } = 95; // GPU deve estar quase 100%
        public double MaxOverlayGpuUsagePercent { get; set; } = 2; // Overlay não deve usar mais que 2%
        public double IdealRamUsagePercent { get; set; } = 60;
        public double IdealVramUsagePercent { get; set; } = 80;

        // Temperaturas Ideais
        public double MaxCpuTemperature { get; set; } = 80;
        public double MaxGpuTemperature { get; set; } = 85;
        public double IdealCpuTemperature { get; set; } = 60;
        public double IdealGpuTemperature { get; set; } = 65;

        // Latência Ideal
        public double IdealNetworkLatencyMs { get; set; } = 20;
        public double MaxAcceptableNetworkLatencyMs { get; set; } = 50;
        public double IdealDpcLatencyUs { get; set; } = 100;
        public double MaxAcceptableDpcLatencyUs { get; set; } = 500;

        // I/O Ideal
        public double MaxDiskReadMbPerSec { get; set; } = 50;
        public double MaxDiskWriteMbPerSec { get; set; } = 30;
        public double MaxDiskQueueLength { get; set; } = 2;

        // Processos e Serviços Ideais
        public int IdealBackgroundServiceCount { get; set; } = 10;
        public int MaxBackgroundServiceCount { get; set; } = 20;
        public List<string> RequiredServices { get; set; } = new List<string>();
        public List<string> DisallowedServices { get; set; } = new List<string>();

        // Threads Ideais
        public double IdealGameThreadPriority { get; set; } = 13; // High priority
        public int IdealGameThreadCount { get; set; } = 4;

        // Stutter Tolerance
        public double MaxStutterSeverity { get; set; } = 0.1; // 10% de variação aceitável
        public double MaxFrameTimeStdDev { get; set; } = 2.0; // 2ms de desvio padrão aceitável

        // Voltris Internal Limits
        public Dictionary<string, double> MaxModuleExecutionTimeMs { get; set; } = new Dictionary<string, double>
        {
            { "IntelligenceOrchestratorService", 10.0 },
            { "FrameTimeOptimizer", 3.0 },
            { "InputLagOptimizer", 2.0 },
            { "NetworkIntelligence", 5.0 },
            { "VramManager", 3.0 },
            { "PowerBalancer", 2.0 },
            { "OverlayService", 1.0 },
            { "MetricsCollector", 2.0 }
        };

        // Configurações que melhoram performance
        public Dictionary<string, object> OptimalConfigurations { get; set; } = new Dictionary<string, object>();

        // Histórico de melhorias
        public List<PerformanceImprovement> Improvements { get; set; } = new List<PerformanceImprovement>();
    }

    /// <summary>
    /// Registro de melhoria de performance
    /// </summary>
    public class PerformanceImprovement
    {
        public DateTime Timestamp { get; set; }
        public string Configuration { get; set; } = "";
        public double FpsImprovement { get; set; }
        public double FrameTimeImprovement { get; set; }
        public string Description { get; set; } = "";
    }
}


