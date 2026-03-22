using System;
using System.Collections.Generic;

namespace VoltrisOptimizer.Services.Gamer.AIAutoFixer.Models
{
    /// <summary>
    /// Snapshot completo de telemetria do sistema
    /// </summary>
    public class TelemetrySnapshot
    {
        public DateTime Timestamp { get; set; } = DateTime.Now;

        // FPS e Frame Time
        public double CurrentFps { get; set; }
        public double AverageFps { get; set; }
        public double MinFps { get; set; }
        public double MaxFps { get; set; }
        public double FrameTimeMs { get; set; }
        public double AverageFrameTimeMs { get; set; }
        public double FrameTimeStdDev { get; set; } // Desvio padrão indica stutter

        // Temperaturas
        public double CpuTemperature { get; set; }
        public double GpuTemperature { get; set; }

        // Uso de Recursos
        public double CpuUsagePercent { get; set; }
        public double GpuUsagePercent { get; set; }
        public double RamUsagePercent { get; set; }
        public double VramUsagePercent { get; set; }
        public double DiskReadMbPerSec { get; set; }
        public double DiskWriteMbPerSec { get; set; }

        // Latência de Rede
        public double NetworkLatencyMs { get; set; }
        public double NetworkJitterMs { get; set; }
        public double NetworkPacketLossPercent { get; set; }

        // Energia e Throttle
        public double PowerConsumptionWatts { get; set; }
        public bool IsCpuThrottling { get; set; }
        public bool IsGpuThrottling { get; set; }
        public double ThrottleReason { get; set; } // 0=none, 1=thermal, 2=power, 3=current

        // DPC Latency
        public double DpcLatencyUs { get; set; }
        public bool HasDpcSpikes { get; set; }
        public string? DpcSpikeSource { get; set; }

        // Processos e Serviços
        public int ActiveProcessCount { get; set; }
        public int BackgroundServiceCount { get; set; }
        public List<ProcessInfo> ProblematicProcesses { get; set; } = new List<ProcessInfo>();
        public List<ServiceInfo> ProblematicServices { get; set; } = new List<ServiceInfo>();

        // Threads e Prioridades
        public int GameThreadCount { get; set; }
        public int SystemThreadCount { get; set; }
        public double GameThreadPriority { get; set; }
        public bool HasPriorityConflicts { get; set; }

        // Stutter Detection
        public bool HasStutter { get; set; }
        public double StutterSeverity { get; set; } // 0-1, onde 1 é stutter crítico
        public List<StutterEvent> StutterEvents { get; set; } = new List<StutterEvent>();

        // Kernel Time
        public double KernelTimePercent { get; set; }
        public bool HasKernelTimeSpikes { get; set; }

        // I/O do Disco
        public double DiskQueueLength { get; set; }
        public bool HasExcessiveDiskIo { get; set; }

        // Voltris Internal
        public double VoltrisCpuUsagePercent { get; set; }
        public double VoltrisMemoryUsageMb { get; set; }
        public double OverlayGpuUsagePercent { get; set; }
        public List<string> ActiveVoltrisModules { get; set; } = new List<string>();
        public Dictionary<string, double> ModuleExecutionTimes { get; set; } = new Dictionary<string, double>();
    }

    public class ProcessInfo
    {
        public string Name { get; set; } = "";
        public int ProcessId { get; set; }
        public double CpuUsagePercent { get; set; }
        public double MemoryUsageMb { get; set; }
        public int Priority { get; set; }
        public bool IsCausingIssues { get; set; }
        public string? IssueDescription { get; set; }
    }

    public class ServiceInfo
    {
        public string Name { get; set; } = "";
        public string Status { get; set; } = "";
        public bool IsCausingIssues { get; set; }
        public string? IssueDescription { get; set; }
    }

    public class StutterEvent
    {
        public DateTime Timestamp { get; set; }
        public double FrameTimeMs { get; set; }
        public double Severity { get; set; }
        public string? ProbableCause { get; set; }
    }
}

