using System;
using System.Collections.Generic;

namespace VoltrisOptimizer.Core.SystemIntelligenceProfiler
{
    public enum RecommendationCategory
    {
        Safe,
        Conditional,
        Risky
    }

    public class AuditData
    {
        public CpuInfo Cpu { get; set; } = new CpuInfo();
        public GpuInfo Gpu { get; set; } = new GpuInfo();
        public RamInfo Ram { get; set; } = new RamInfo();
        public StorageInfo Storage { get; set; } = new StorageInfo();
        public NicInfo Nic { get; set; } = new NicInfo();
        public BatteryInfo Battery { get; set; } = new BatteryInfo();
        public WindowsInfo Windows { get; set; } = new WindowsInfo();
        public DpcLatencyInfo DpcLatency { get; set; } = new DpcLatencyInfo();
        public string CurrentPowerPlan { get; set; } = "";
        public int StartupAppsCount { get; set; }
        public int RunningServicesCount { get; set; }
        public bool SupportsHighPerformancePlan { get; set; }
    }

    public class CpuInfo
    {
        public string Model { get; set; } = "";
        public int LogicalCores { get; set; }
        public int PhysicalCores { get; set; }
        public int PerformanceCores { get; set; }
        public int EfficiencyCores { get; set; }
        public double MaxFrequencyMhz { get; set; }
        public bool HyperThreading { get; set; }
    }

    public class GpuInfo
    {
        public string Vendor { get; set; } = "";
        public string Model { get; set; } = "";
        public long VramMb { get; set; }
        public string DriverVersion { get; set; } = "";
        public bool HagsSupported { get; set; }
        public bool ShaderCacheSupported { get; set; }
        public bool IsIntegrated { get; set; }
    }

    public class RamInfo
    {
        public long TotalMb { get; set; }
        public long AvailableMb { get; set; }
        public int SpeedMhz { get; set; }
        public long SwapUsageMb { get; set; }
    }

    public class StorageInfo
    {
        public string SystemDiskModel { get; set; } = "";
        public string SystemDiskType { get; set; } = ""; // HDD/SSD/NVMe
        public long FreeSpaceMb { get; set; }
        public long TotalSpaceMb { get; set; }
        public bool SmartOk { get; set; }
    }

    public class NicInfo
    {
        public string Vendor { get; set; } = "";
        public string DriverVersion { get; set; } = "";
        public bool SupportsRss { get; set; }
        public bool SupportsRsc { get; set; }
        public bool SupportsOffloads { get; set; }
    }

    public class BatteryInfo
    {
        public bool Present { get; set; }
        public int EstimatedChargePercent { get; set; }
        public string Status { get; set; } = "";
    }

    public class WindowsInfo
    {
        public string Version { get; set; } = "";
        public int Build { get; set; }
        public bool SecureBoot { get; set; }
        public bool DriverSigningEnforced { get; set; }
        public bool HyperVActive { get; set; }
        public bool WslInstalled { get; set; }
        public bool IsAdmin { get; set; }
    }

    public class DpcLatencyInfo
    {
        public double InterruptsPerSec { get; set; }
        public double DpcRate { get; set; }
    }

    public class UserAnswers
    {
        public string UseCase { get; set; } = "Uso geral";
        public string Priority { get; set; } = "Balanced";
        public bool IsLaptop { get; set; }
        public bool AutoRestartServices { get; set; }
        public bool AllowRegistryChanges { get; set; }
        public string[] Problems { get; set; } = Array.Empty<string>();
        public string ApplyMode { get; set; } = "Manual";
    }

    public class ActionRecommendation
    {
        public string Name { get; set; } = "";
        public RecommendationCategory Category { get; set; }
        public int CompatibilityScore { get; set; }
        public int ExpectedGainScore { get; set; }
        public int RiskScore { get; set; }
        public bool Supported { get; set; }
        public string Explanation { get; set; } = "";
        public string Module { get; set; } = "";
    }

    public class ProfilerReport
    {
        public AuditData Audit { get; set; } = new AuditData();
        public UserAnswers Answers { get; set; } = new UserAnswers();
        public List<ActionRecommendation> Recommendations { get; set; } = new List<ActionRecommendation>();
        public List<string> Backups { get; set; } = new List<string>();
        public List<string> Applied { get; set; } = new List<string>();
        public DateTime Timestamp { get; set; } = DateTime.Now;
    }

    public class ApplyResult
    {
        public bool Success { get; set; }
        public List<string> Applied { get; set; } = new List<string>();
        public List<string> Errors { get; set; } = new List<string>();
        public List<string> Backups { get; set; } = new List<string>();
    }
}
