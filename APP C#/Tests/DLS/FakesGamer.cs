using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using VoltrisOptimizer.Services.Gamer.Models;

namespace DLS.Tests.Fakes
{
    public static class TestMetricsCollector
    {
        public static int ThrottleEvents;
        public static int ReleaseEvents;
        public static int OrchestratorActivations;
        public static int OrchestratorDeactivations;
        public static List<string> Warnings = new();
        public static List<string> Failures = new();
        public static ConcurrentQueue<string> EventLog = new();
        public static TimeSpan LastActivationDuration;
        public static void Reset()
        {
            ThrottleEvents = 0;
            ReleaseEvents = 0;
            OrchestratorActivations = 0;
            OrchestratorDeactivations = 0;
            Warnings.Clear();
            Failures.Clear();
            while (EventLog.TryDequeue(out _)) { }
            LastActivationDuration = TimeSpan.Zero;
        }
    }

    public class FakeLoggingService : VoltrisOptimizer.Services.ILoggingService
    {
        public event EventHandler<string>? LogEntryAdded;
        public void LogInfo(string message) { TestMetricsCollector.EventLog.Enqueue(message); LogEntryAdded?.Invoke(this, message); }
        public void LogWarning(string message) { var m = "[WARN] " + message; TestMetricsCollector.EventLog.Enqueue(m); TestMetricsCollector.Warnings.Add(message); LogEntryAdded?.Invoke(this, m); }
        public void LogError(string message, Exception? ex = null) { var m = "[ERR] " + message; TestMetricsCollector.EventLog.Enqueue(m); TestMetricsCollector.Failures.Add(message); LogEntryAdded?.Invoke(this, m); }
        public void LogSuccess(string message) { var m = "[OK] " + message; TestMetricsCollector.EventLog.Enqueue(m); LogEntryAdded?.Invoke(this, m); }
        public void LogDebug(string message, string? source = null) { LogInfo("[DEBUG] " + message); }
        public void LogTrace(string message, string? source = null) { LogInfo("[TRACE] " + message); }
        public void LogCritical(string message, Exception? ex = null, string? source = null) { LogError("[CRITICAL] " + message, ex); }
        public void Log(VoltrisOptimizer.Services.LogLevel level, VoltrisOptimizer.Services.LogCategory category, string message, Exception? ex = null, string? source = null) { LogInfo($"[{level}][{category}] {message}"); }
        public void ClearLogs() { }
        public void ExportLogs(string filePath) { }
        public string[] GetLogs() => Array.Empty<string>();
        public string GetLogDirectory() => Path.GetTempPath();
        public void Dispose() { }
    }

    public class FakeCpuGamingOptimizer : ICpuGamingOptimizer
    {
        public bool ApplyCpuSets(int processId) => true;
        public bool DisableCoreParking() => true;
        public Task<bool> OptimizeAsync(CancellationToken cancellationToken = default) => Task.FromResult(true);
        public Task<bool> RestoreAsync(CancellationToken cancellationToken = default) => Task.FromResult(true);
        public bool SetGameProcessPriority(int processId, ProcessPriorityLevel priority) => true;
    }

    public class FakeGpuGamingOptimizer : IGpuGamingOptimizer
    {
        public Task<GpuInfo> GetGpuInfoAsync(CancellationToken cancellationToken = default) => Task.FromResult(new GpuInfo { Name = "FakeGPU", Vendor = VoltrisOptimizer.Services.Gamer.Models.GpuVendor.Unknown });
        public Task<GpuTemperature> GetTemperatureAsync(CancellationToken cancellationToken = default) => Task.FromResult(new GpuTemperature { Current = 55 });
        public Task<bool> OptimizeAsync(CancellationToken cancellationToken = default) => Task.FromResult(true);
        public Task<bool> RestoreAsync(CancellationToken cancellationToken = default) => Task.FromResult(true);
        public Task<GpuOptimizationResult> ApplyOptimizationsAsync(GpuOptimizationOptions options, CancellationToken cancellationToken = default) => Task.FromResult(new GpuOptimizationResult { Success = true });
        public bool SetHagsEnabled(bool enabled) => true;
        public bool ApplyTdrTweaks(bool enable) => true;
    }

    public class FakeNetworkGamingOptimizer : INetworkGamingOptimizer
    {
        public bool ApplyQosDscp(string executablePath, int dscpValue = 46) { TestMetricsCollector.EventLog.Enqueue($"QoS DSCP {dscpValue} applied to {executablePath}"); return true; }
        public Task<double> MeasureLatencyAsync(string host, CancellationToken cancellationToken = default) => Task.FromResult(12.3);
        public Task<bool> OptimizeAsync(CancellationToken cancellationToken = default) => Task.FromResult(true);
        public Task<bool> RestoreAsync(CancellationToken cancellationToken = default) => Task.FromResult(true);
        public bool RemoveQosDscp(string executablePath) { TestMetricsCollector.EventLog.Enqueue($"QoS DSCP removed from {executablePath}"); return true; }
        public bool SetNicInterruptModeration(bool enabled) => true;
    }

    public class FakeMemoryGamingOptimizer : IMemoryGamingOptimizer
    {
        public double FreeMb = 8192;
        public double StandbyMb = 256;
        public bool CleanStandbyList() { StandbyMb = Math.Max(0, StandbyMb - 128); return true; }
        public double GetFreeMemoryMb() => FreeMb;
        public double GetStandbyCacheMb() => StandbyMb;
        public void StartMonitoring(int thresholdMb = 1024, int standbyThresholdMb = 1024) { TestMetricsCollector.EventLog.Enqueue($"RAM monitor start T={thresholdMb} S={standbyThresholdMb}"); }
        public void StopMonitoring() { TestMetricsCollector.EventLog.Enqueue("RAM monitor stop"); }
    }

    public class FakeProcessPrioritizer : IProcessPrioritizer
    {
        public int CloseUnnecessaryProcesses() => 3;
        public bool IsProtectedProcess(string processName) => string.Equals(processName, "system", StringComparison.OrdinalIgnoreCase);
        public int LowerBackgroundProcessesPriority() => 5;
        public void RestoreAllPriorities() { }
        public bool SetPriority(int processId, ProcessPriorityLevel priority) => true;
    }

    public class FakeHardwareDetector : IHardwareDetector
    {
        public Task<HardwareCapabilities> GetCapabilitiesAsync(CancellationToken cancellationToken = default) => Task.FromResult(new HardwareCapabilities { CpuName = "FakeCPU", PrimaryGpu = new GpuInfo { Name = "FakeGPU" }, TotalRamGb = 16 });
        public Task<GpuInfo> GetGpuInfoAsync(CancellationToken cancellationToken = default) => Task.FromResult(new GpuInfo { Name = "FakeGPU" });
        public bool IsHybridCpu() => false;
        public (int Cores, int Threads) GetCpuCounts() => (4, 8);
        public int GetTotalRamGb() => 16;
        public bool IsLaptop() => false;
        public bool IsOnBattery() => false;
    }

    public class FakeTimerResolutionService : ITimerResolutionService
    {
        public bool IsMaxResolutionActive { get; private set; }
        public uint Current = 15625;
        public uint GetCurrentResolution() => Current;
        public bool ReleaseResolution() { IsMaxResolutionActive = false; return true; }
        public bool SetMaximumResolution() { IsMaxResolutionActive = true; Current = 10000; return true; }
    }

    public class FakeAdaptiveGovernor : IAdaptiveGovernor
    {
        public event EventHandler<StutterIncident>? StutterDetected;
        public bool IsRunning { get; private set; }
        public IReadOnlyList<StutterIncident> GetRecentIncidents() => Array.Empty<StutterIncident>();
        public void ClearIncidents() { }
        public void Start(int gameProcessId, GamerOptimizationOptions options) { IsRunning = true; }
        public void Stop() { IsRunning = false; }
    }

    public class FakeGameDetector : IGameDetector
    {
        public event EventHandler<DetectedGame>? GameStarted;
        public event EventHandler<DetectedGame>? GameStopped;
        public event EventHandler<GameDetectionProgress>? ProgressChanged;
        public bool IsMonitoring => false;
        public Task<IReadOnlyList<DetectedGame>> DetectInstalledGamesAsync(CancellationToken ct = default) => Task.FromResult((IReadOnlyList<DetectedGame>)new List<DetectedGame>());
        public bool IsKnownGame(string processName, string? executablePath = null) => false;
        public void StartMonitoring() { }
        public void StopMonitoring() { }
    }

    public class FakeImmersiveGamingOptimizer : IImmersiveGamingOptimizer
    {
        public Task<bool> OptimizeAsync(CancellationToken ct = default) => Task.FromResult(true);
        public Task<bool> RestoreAsync(CancellationToken ct = default) => Task.FromResult(true);
    }

    public static class ResourceHogger
    {
        public static void CpuSpin(TimeSpan duration, int threads = 1)
        {
            var until = DateTime.Now + duration;
            var tasks = new List<Task>();
            for (int i = 0; i < threads; i++)
            {
                tasks.Add(Task.Run(() => {
                    while (DateTime.Now < until)
                    {
                        for (int j = 0; j < 500000; j++) { var x = j * j; }
                        Thread.SpinWait(5000);
                    }
                }));
            }
            Task.WaitAll(tasks.ToArray());
        }

        public static void MemoryAllocate(int mb)
        {
            var arr = new byte[mb * 1024 * 1024];
            for (int i = 0; i < arr.Length; i += 4096) arr[i] = 1;
        }

        public static void DiskWrite(int mb, string? dir = null)
        {
            dir ??= Path.GetTempPath();
            var path = Path.Combine(dir, $"hog_{Guid.NewGuid():N}.bin");
            using var fs = new FileStream(path, FileMode.Create, FileAccess.Write, FileShare.None, 4096, FileOptions.WriteThrough);
            var block = new byte[1024 * 1024];
            var rnd = new Random(123);
            rnd.NextBytes(block);
            for (int i = 0; i < mb; i++) fs.Write(block, 0, block.Length);
            try { File.Delete(path); } catch { }
        }
    }
}
