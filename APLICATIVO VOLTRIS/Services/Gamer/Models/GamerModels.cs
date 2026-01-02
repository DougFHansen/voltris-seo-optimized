using System;
using System.Collections.Generic;

namespace VoltrisOptimizer.Services.Gamer.Models
{
    /// <summary>
    /// Jogo detectado no sistema
    /// </summary>
    public class DetectedGame
    {
        public string Name { get; set; } = string.Empty;
        public string ExecutablePath { get; set; } = string.Empty;
        public DateTime DetectedAt { get; set; } = DateTime.Now;
        public long Size { get; set; }
        public string? IconPath { get; set; }
        public GameLauncher Launcher { get; set; } = GameLauncher.Unknown;
        public bool HasProfile { get; set; }
        
        public override string ToString() => Name;
    }

    /// <summary>
    /// Launcher de origem do jogo
    /// </summary>
    public enum GameLauncher
    {
        Unknown,
        Steam,
        EpicGames,
        GOG,
        Ubisoft,
        EA,
        Riot,
        Blizzard,
        Xbox,
        Manual
    }

    /// <summary>
    /// Perfil de otimização para um jogo específico
    /// </summary>
    public class GameProfile
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string GameName { get; set; } = string.Empty;
        public string ExecutablePath { get; set; } = string.Empty;
        public GameProfileSettings Settings { get; set; } = new();
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime? LastUsed { get; set; }
    }

    /// <summary>
    /// Configurações de um perfil de jogo
    /// </summary>
    public class GameProfileSettings
    {
        public bool CloseBackgroundApps { get; set; } = true;
        public bool OptimizeCPU { get; set; } = true;
        public bool OptimizeGPU { get; set; } = true;
        public bool OptimizeNetwork { get; set; } = true;
        public bool OptimizeMemory { get; set; } = true;
        public bool ApplyFPSBoost { get; set; } = true;
        public bool ReduceLatency { get; set; } = true;
        public bool EnableGameMode { get; set; } = true;
        public bool EnableExtremeMode { get; set; } = false;
        public bool EnableAntiStutter { get; set; } = true;
        public bool EnableAdaptiveNetwork { get; set; } = true;
        public ProcessPriorityLevel ProcessPriority { get; set; } = ProcessPriorityLevel.High;
        public int CPUAffinity { get; set; } = -1; // -1 = todos os cores
    }

    /// <summary>
    /// Níveis de prioridade de processo
    /// </summary>
    public enum ProcessPriorityLevel
    {
        Normal,
        AboveNormal,
        High,
        RealTime
    }

    /// <summary>
    /// Status atual do modo gamer
    /// </summary>
    public class GamerModeStatus
    {
        public bool IsActive { get; set; }
        public string? ActiveGameName { get; set; }
        public int? ActiveGameProcessId { get; set; }
        public DateTime? ActivatedAt { get; set; }
        public DateTime? EndTime { get; set; }
        public TimeSpan? Duration { get; set; }
        
        // Status dos subsistemas
        public bool TimerResolutionActive { get; set; }
        public bool NetworkTweaksApplied { get; set; }
        public bool CoreParkingDisabled { get; set; }
        public bool SystemProfileOptimized { get; set; }
        public bool GameDvrDisabled { get; set; }
        public bool RamMonitorRunning { get; set; }
        public bool AdaptiveGovernorRunning { get; set; }
        public bool ExtremeModeActive { get; set; }
        
        // Métricas
        public double CurrentCpuUsage { get; set; }
        public double CurrentGpuUsage { get; set; }
        public double CurrentRamUsage { get; set; }
        public double CurrentNetworkLatency { get; set; }
    }

    /// <summary>
    /// Incidente de stutter detectado
    /// </summary>
    public class StutterIncident
    {
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public StutterCause Cause { get; set; } = StutterCause.Unknown;
        public string Summary { get; set; } = string.Empty;
        
        // Métricas no momento do incidente
        public double TotalCpuPercent { get; set; }
        public double GameCpuPercent { get; set; }
        public double ProcessorQueueLength { get; set; }
        public double DpcPercent { get; set; }
        public double InterruptPercent { get; set; }
        public double PageFaultsPerSec { get; set; }
        public double DiskQueueLength { get; set; }
        public double DiskLatencySec { get; set; }
        public double GpuUtilPercent { get; set; }
        public double CpuFreqCurrentMhz { get; set; }
        public double CpuFreqMaxMhz { get; set; }
        public double FrameAvgMs { get; set; }
        public double FrameJitterMs { get; set; }
        public double NetworkJitterMs { get; set; }
    }

    /// <summary>
    /// Causa identificada do stutter
    /// </summary>
    public enum StutterCause
    {
        Unknown,
        CpuScheduling,
        GpuRender,
        FramePacing,
        DriversInterrupt,
        MemoryPaging,
        DiskIO,
        DiskLatency,
        NetworkJitter,
        ThermalThrottling
    }

    /// <summary>
    /// Informações da GPU
    /// </summary>
    public class GpuInfo
    {
        public string Name { get; set; } = string.Empty;
        public string DriverVersion { get; set; } = string.Empty;
        public GpuVendor Vendor { get; set; } = GpuVendor.Unknown;
        public long VideoMemoryBytes { get; set; }
        public bool IsDiscrete { get; set; }
        public bool SupportsHags { get; set; }
        public bool SupportsVrr { get; set; }
    }

    /// <summary>
    /// Vendor da GPU
    /// </summary>
    public enum GpuVendor
    {
        Unknown,
        Nvidia,
        Amd,
        Intel
    }

    /// <summary>
    /// Temperatura da GPU
    /// </summary>
    public class GpuTemperature
    {
        public double Current { get; set; }
        public double Max { get; set; } = 83;
        public bool IsAvailable { get; set; }
        public bool IsThrottling => Current >= Max * 0.95;
    }

    /// <summary>
    /// Capacidades do hardware do sistema
    /// </summary>
    public class HardwareCapabilities
    {
        // CPU
        public string CpuName { get; set; } = string.Empty;
        public int CoreCount { get; set; }
        public int ThreadCount { get; set; }
        public bool IsHybridCpu { get; set; }
        public double MaxClockSpeedMhz { get; set; }
        
        // GPU
        public GpuInfo PrimaryGpu { get; set; } = new();
        public bool HasDiscreteGpu { get; set; }
        
        // RAM
        public int TotalRamGb { get; set; }
        public bool HasSufficientRam => TotalRamGb >= 8;
        
        // Network
        public string NetworkAdapterName { get; set; } = string.Empty;
        public string NetworkAdapterVendor { get; set; } = string.Empty;
        
        // Flags derivados
        public bool SupportsHags => PrimaryGpu.SupportsHags;
        public bool SupportsVrr => PrimaryGpu.SupportsVrr;
    }

    /// <summary>
    /// Configuração de ping target para monitoramento de rede
    /// </summary>
    public enum PingTargetMode
    {
        CloudflareGns,  // 1.1.1.1
        GoogleDns,      // 8.8.8.8
        Gateway,        // Default gateway
        Custom          // Host personalizado
    }

    /// <summary>
    /// Opções de otimização selecionadas pelo usuário
    /// </summary>
    public class GamerOptimizationOptions
    {
        public bool OptimizeCpu { get; set; } = true;
        public bool OptimizeGpu { get; set; } = true;
        public bool OptimizeNetwork { get; set; } = true;
        public bool OptimizeMemory { get; set; } = true;
        public bool EnableGameMode { get; set; } = true;
        public bool ReduceLatency { get; set; } = true;
        public bool CloseBackgroundApps { get; set; } = true;
        public bool ApplyFpsBoost { get; set; } = true;
        public bool EnableExtremeMode { get; set; } = true;
        public bool EnableAntiStutter { get; set; } = true;
        public bool EnableAdaptiveNetwork { get; set; } = true;
        public PingTargetMode PingTarget { get; set; } = PingTargetMode.CloudflareGns;
        public string? CustomPingHost { get; set; }
    }
}

