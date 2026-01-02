using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Optimization;

namespace VoltrisOptimizer.Services.Optimization
{
    public class DynamicLoadStabilizer : IDynamicLoadStabilizer
    {
        private readonly object _lock = new();
        private CancellationTokenSource? _cts;
        private Task? _monitorTask;
        private readonly ConcurrentDictionary<int, TimeSpan> _prevCpuTimes = new();
        private readonly ConcurrentDictionary<int, DateTime> _heavySince = new();
        private readonly ConcurrentDictionary<int, DateTime> _strongSince = new();
        private readonly HashSet<int> _throttled = new();
        private readonly string _logPath;
        private int? _gamePid;
        private readonly DlsLogger _logger;
        private readonly CoreLoadHeuristics _heuristics;
        private readonly CriticalProcessDetector _detector;
        private readonly VoltrisOptimizer.Services.Optimization.Providers.IGpuLoadProvider? _gpuProvider;
        private readonly VoltrisOptimizer.Services.Optimization.Providers.IProcessProvider? _processProvider;
        private readonly Dictionary<int, IntPtr> _hProcessCache = new();
        private readonly VoltrisOptimizer.Services.Win32.IProcessApi? _processApi = new VoltrisOptimizer.Services.Win32.WindowsProcessApi();
        private readonly Dictionary<int, IntPtr> _originalAffinity = new();
        private DateTime _lastProcessRefresh = DateTime.MinValue;
        private Process[] _cachedProcesses = Array.Empty<Process>();
        public bool IsRunning { get; private set; }
        public bool Enabled { get; set; } = true;
        public TimeSpan Interval { get; set; } = TimeSpan.FromMilliseconds(500);
        public event EventHandler<ThrottledEventArgs>? OnProcessThrottled;
        public event EventHandler<ThrottledEventArgs>? OnProcessReleased;

        public IReadOnlyCollection<int> ThrottledProcessIds
        {
            get { lock (_lock) { return _throttled.ToList().AsReadOnly(); } }
        }

        public DynamicLoadStabilizer(
            VoltrisOptimizer.Services.Optimization.Providers.ICpuCoreLoadProvider? cpuProvider = null,
            VoltrisOptimizer.Services.Optimization.Providers.IGpuLoadProvider? gpuProvider = null,
            VoltrisOptimizer.Services.Optimization.Providers.IProcessProvider? processProvider = null,
            DlsLogger? logger = null,
            CoreLoadHeuristics? heuristics = null,
            CriticalProcessDetector? detector = null)
        {
            _gpuProvider = gpuProvider;
            _processProvider = processProvider;
            var appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            var dir = Path.Combine(appData, "VoltrisOptimizer", "logs");
            Directory.CreateDirectory(dir);
            _logPath = Path.Combine(dir, "dls.log");
            _logger = logger ?? new DlsLogger();
            _heuristics = heuristics ?? new CoreLoadHeuristics(cpuProvider);
            _detector = detector ?? new CriticalProcessDetector(processProvider);
        }

        public async Task StartAsync(int? gameProcessId = null, CancellationToken ct = default)
        {
            if (!Enabled) return;
            lock (_lock)
            {
                if (IsRunning) return;
                _cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
                _gamePid = gameProcessId;
                IsRunning = true;
                _monitorTask = Task.Run(() => MonitorLoop(_cts.Token));
            }
            await Task.CompletedTask;
        }

        public async Task StopAsync(CancellationToken ct = default)
        {
            lock (_lock)
            {
                if (!IsRunning) return;
                try { _cts?.Cancel(); } catch { }
            }
            try { if (_monitorTask != null) await _monitorTask; } catch { }
            lock (_lock)
            {
                IsRunning = false;
                _cts?.Dispose();
                _cts = null;
                _gamePid = null;
            }
        }

        private void MonitorLoop(CancellationToken ct)
        {
            var sw = Stopwatch.StartNew();
            while (!ct.IsCancellationRequested)
            {
                try
                {
                    var processes = GetProcessesCached();
                    var cpuSamples = new List<(Process p, double cpu)>();

                    foreach (var p in processes)
                    {
                        try
                        {
                            var prev = _prevCpuTimes.GetOrAdd(p.Id, p.TotalProcessorTime);
                            var now = p.TotalProcessorTime;
                            var delta = now - prev;
                            _prevCpuTimes[p.Id] = now;
                            var cpuPercent = Math.Max(0, delta.TotalMilliseconds / Interval.TotalMilliseconds) * 100.0 / Math.Max(1, Environment.ProcessorCount);
                            cpuSamples.Add((p, cpuPercent));
                        }
                        catch { }
                    }

                    var decision = _heuristics.Sample();
                    var heavy = cpuSamples.Where(s => IsHeavy(s.p, s.cpu)).ToList();
                    if (decision == CoreDecision.StrongThrottle || decision == CoreDecision.ModerateThrottle)
                    {
                        foreach (var h in heavy)
                        {
                            if (IsProtected(h.p)) continue;
                            var pid = h.p.Id;
                            if (!_heavySince.ContainsKey(pid)) _heavySince[pid] = DateTime.Now;
                            var duration = DateTime.Now - _heavySince[pid];
                            var applyStrong = decision == CoreDecision.StrongThrottle;
                            if (duration.TotalSeconds >= 1.5 || applyStrong)
                            {
                                if (TryThrottle(h.p, applyStrong))
                                {
                                    lock (_lock) { _throttled.Add(pid); }
                                    _logger.Log($"Throttle {(applyStrong ? "strong" : "moderate")} {h.p.ProcessName} ({pid}) cpu={h.cpu:F1}%");
                                    RaiseThrottled(h.p, h.cpu, GetGpuUtilization(), true);
                                }
                            }
                        }
                    }
                    

                    if (decision == CoreDecision.Release)
                    {
                        var toRelease = ThrottledProcessIds.ToList();
                        foreach (var pid in toRelease)
                        {
                            try
                            {
                                var p = processes.FirstOrDefault(x => x.Id == pid);
                                if (p != null)
                                {
                                    TryRelease(p);
                                    lock (_lock) { _throttled.Remove(pid); }
                                    _logger.Log($"Release {p.ProcessName} ({pid})");
                                    RaiseReleased(p, 0, GetGpuUtilization(), false);
                                }
                            }
                            catch { }
                        }
                    }

                    Thread.Sleep(Interval);
                }
                catch { Thread.Sleep(Interval); }
            }
        }

        private bool IsHeavy(Process p, double cpuPercent)
        {
            try
            {
                if (cpuPercent > 35.0) return true;
                return false;
            }
            catch { return false; }
        }

        private double SumCpuForProcess(Process[] processes, Process p)
        {
            try
            {
                return processes.Where(x => x.ProcessName == p.ProcessName)
                    .Select(x => _prevCpuTimes.TryGetValue(x.Id, out var prev) ? (x.TotalProcessorTime - prev).TotalMilliseconds / Interval.TotalMilliseconds * 100.0 / Math.Max(1, Environment.ProcessorCount) : 0)
                    .Sum();
            }
            catch { return 0; }
        }

        private bool TryThrottle(Process p, bool strong)
        {
            try
            {
                if (_gamePid.HasValue)
                {
                    try
                    {
                        var game = Process.GetProcessById(_gamePid.Value);
                        SetProcessPrioritySafe(game, ProcessPriorityClass.High);
                    }
                    catch { }
                }

                SetProcessPrioritySafe(p, strong ? ProcessPriorityClass.BelowNormal : ProcessPriorityClass.BelowNormal);
                EnablePowerThrottling(p);
                SetMemoryPriority(p, 2);
                if (strong)
                {
                    var pid = p.Id;
                    if (!_strongSince.ContainsKey(pid)) _strongSince[pid] = DateTime.Now;
                    var duration = DateTime.Now - _strongSince[pid];
                    var doAffinity = IsBlacklisted(p) || duration.TotalSeconds > 3.0;
                    if (doAffinity) ReduceAffinity(p);
                }
                Log($"THROTTLE {p.ProcessName} ({p.Id})");
                return true;
            }
            catch { return false; }
        }

        private bool TryRelease(Process p)
        {
            try
            {
                SetProcessPrioritySafe(p, ProcessPriorityClass.Normal);
                DisablePowerThrottling(p);
                SetMemoryPriority(p, 5);
                RestoreAffinity(p);
                try { _strongSince.TryRemove(p.Id, out var _); } catch { }
                Log($"RELEASE {p.ProcessName} ({p.Id})");
                return true;
            }
            catch { return false; }
        }

        private void SetProcessPrioritySafe(Process p, ProcessPriorityClass cls)
        {
            try { p.PriorityClass = cls; } catch { }
            try
            {
                var h = _processApi?.OpenProcess(0x0200 | 0x0400, false, p.Id) ?? OpenProcess(0x0200 | 0x0400, false, p.Id);
                if (h != IntPtr.Zero)
                {
                    try { var ok = _processApi?.SetPriorityClass(h, cls) ?? SetPriorityClass(h, cls); } catch { }
                    try { var ok2 = _processApi?.CloseHandle(h) ?? CloseHandle(h); } catch { }
                }
            }
            catch { }
        }

        private bool IsProtected(Process p)
        {
            try
            {
                if (_gamePid.HasValue && p.Id == _gamePid.Value) return true;
                if (_detector.IsCritical(p)) return true;
                var name = p.ProcessName;
                var s = VoltrisOptimizer.Services.SettingsService.Instance.Settings;
                if (s.DlsWhitelist != null && s.DlsWhitelist.Contains(name, StringComparer.OrdinalIgnoreCase)) return true;
                return false;
            }
            catch { return false; }
        }

        private bool IsBlacklisted(Process p)
        {
            try
            {
                var name = p.ProcessName;
                var s = VoltrisOptimizer.Services.SettingsService.Instance.Settings;
                return s.DlsBlacklist != null && s.DlsBlacklist.Contains(name, StringComparer.OrdinalIgnoreCase);
            }
            catch { return false; }
        }

        private Process[] GetProcessesCached()
        {
            if ((DateTime.Now - _lastProcessRefresh).TotalMilliseconds > 2000)
            {
                try
                {
                    _cachedProcesses = _processProvider != null ? _processProvider.GetProcesses() : Process.GetProcesses();
                    _lastProcessRefresh = DateTime.Now;
                }
                catch { }
            }
            return _cachedProcesses;
        }

        private void EnablePowerThrottling(Process p)
        {
            try
            {
                var h = _processApi?.OpenProcess(0x0200 | 0x0400, false, p.Id) ?? OpenProcess(0x0200 | 0x0400, false, p.Id);
                if (h == IntPtr.Zero) return;
                var state = new PROCESS_POWER_THROTTLING_STATE
                {
                    Version = 1,
                    ControlMask = PROCESS_POWER_THROTTLING_EXECUTION_SPEED,
                    StateMask = PROCESS_POWER_THROTTLING_EXECUTION_SPEED
                };
                try { _processApi?.SetProcessInformation(h, (int)PROCESS_INFORMATION_CLASS.ProcessPowerThrottling, ref state, Marshal.SizeOf<PROCESS_POWER_THROTTLING_STATE>()); } catch { }
                _processApi?.CloseHandle(h);
            }
            catch { }
        }

        private void DisablePowerThrottling(Process p)
        {
            try
            {
                var h = _processApi?.OpenProcess(0x0200 | 0x0400, false, p.Id) ?? OpenProcess(0x0200 | 0x0400, false, p.Id);
                if (h == IntPtr.Zero) return;
                var state = new PROCESS_POWER_THROTTLING_STATE
                {
                    Version = 1,
                    ControlMask = PROCESS_POWER_THROTTLING_EXECUTION_SPEED,
                    StateMask = 0
                };
                try { _processApi?.SetProcessInformation(h, (int)PROCESS_INFORMATION_CLASS.ProcessPowerThrottling, ref state, Marshal.SizeOf<PROCESS_POWER_THROTTLING_STATE>()); } catch { }
                _processApi?.CloseHandle(h);
            }
            catch { }
        }

        private void ReduceAffinity(Process p)
        {
            try
            {
                var h = _processApi?.OpenProcess(0x0200 | 0x0400, false, p.Id) ?? OpenProcess(0x0200 | 0x0400, false, p.Id);
                if (h == IntPtr.Zero) return;
                if (!_originalAffinity.ContainsKey(p.Id)) _originalAffinity[p.Id] = GetProcessAffinityMask(h);
                var mask = _originalAffinity[p.Id];
                var reduced = ReduceMask(mask);
                try { var ok3 = _processApi?.SetProcessAffinityMask(h, reduced) ?? SetProcessAffinityMask(h, reduced); } catch { }
                _processApi?.CloseHandle(h);
            }
            catch { }
        }

        private void RestoreAffinity(Process p)
        {
            try
            {
                if (!_originalAffinity.ContainsKey(p.Id)) return;
                var h = _processApi?.OpenProcess(0x0200 | 0x0400, false, p.Id) ?? OpenProcess(0x0200 | 0x0400, false, p.Id);
                if (h == IntPtr.Zero) return;
                var mask = _originalAffinity[p.Id];
                try { var ok4 = _processApi?.SetProcessAffinityMask(h, mask) ?? SetProcessAffinityMask(h, mask); } catch { }
                _processApi?.CloseHandle(h);
                _originalAffinity.Remove(p.Id);
            }
            catch { }
        }

        private IntPtr ReduceMask(IntPtr mask)
        {
            try
            {
                var m = (ulong)mask.ToInt64();
                int count = 0;
                for (int i = 0; i < 64; i++) if (((m >> i) & 1UL) == 1UL) count++;
                int keep = Math.Max(1, count / 2);
                ulong newMask = 0;
                int k = 0;
                for (int i = 0; i < 64 && k < keep; i++)
                {
                    if (((m >> i) & 1UL) == 1UL) { newMask |= (1UL << i); k++; }
                }
                return new IntPtr((long)newMask);
            }
            catch { return mask; }
        }

        private void RaiseThrottled(Process p, double cpu, double gpu, bool heavy)
        {
            try { OnProcessThrottled?.Invoke(this, new ThrottledEventArgs { ProcessId = p.Id, ProcessName = p.ProcessName, CpuPercent = cpu, GpuPercent = gpu, IsHeavy = heavy }); } catch { }
        }

        private void RaiseReleased(Process p, double cpu, double gpu, bool heavy)
        {
            try { OnProcessReleased?.Invoke(this, new ThrottledEventArgs { ProcessId = p.Id, ProcessName = p.ProcessName, CpuPercent = cpu, GpuPercent = gpu, IsHeavy = heavy }); } catch { }
        }

        private void Log(string line)
        {
            try { File.AppendAllText(_logPath, $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] {line}\n"); } catch { }
        }

        private bool IsGpuPressureHigh()
        {
            try { return GetGpuUtilization() >= 60.0; } catch { return false; }
        }

        private double GetGpuUtilization()
        {
            try
            {
                if (_gpuProvider != null) return _gpuProvider.GetGpuUtilization();
                var cat = new PerformanceCounterCategory("GPU Engine");
                var instances = cat.GetInstanceNames();
                float total = 0;
                foreach (var inst in instances)
                {
                    if (!inst.Contains("engtype_3D")) continue;
                    using var pc = new PerformanceCounter("GPU Engine", "Utilization Percentage", inst, true);
                    total += pc.NextValue();
                }
                return total;
            }
            catch { return 0; }
        }

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern IntPtr OpenProcess(int access, bool inheritHandle, int processId);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool CloseHandle(IntPtr hObject);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool SetPriorityClass(IntPtr hProcess, ProcessPriorityClass dwPriorityClass);

        private enum PROCESS_INFORMATION_CLASS
        {
            ProcessMemoryPriority = 0x00,
            ProcessPowerThrottling = 0x09
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct PROCESS_POWER_THROTTLING_STATE
        {
            public uint Version;
            public uint ControlMask;
            public uint StateMask;
        }

        private const uint PROCESS_POWER_THROTTLING_EXECUTION_SPEED = 0x1;

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool SetProcessInformation(IntPtr hProcess, PROCESS_INFORMATION_CLASS infoClass, ref PROCESS_POWER_THROTTLING_STATE state, int size);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool SetProcessInformation(IntPtr hProcess, PROCESS_INFORMATION_CLASS infoClass, ref MEMORY_PRIORITY_INFORMATION state, int size);

        [StructLayout(LayoutKind.Sequential)]
        private struct MEMORY_PRIORITY_INFORMATION
        {
            public uint MemoryPriority;
        }

        private void SetMemoryPriority(Process p, uint level)
        {
            try
            {
                var h = _processApi?.OpenProcess(0x0200 | 0x0400, false, p.Id) ?? OpenProcess(0x0200 | 0x0400, false, p.Id);
                if (h == IntPtr.Zero) return;
                var mem = new MEMORY_PRIORITY_INFORMATION { MemoryPriority = level };
                try { _processApi?.SetProcessInformation(h, (int)PROCESS_INFORMATION_CLASS.ProcessMemoryPriority, ref mem, Marshal.SizeOf<MEMORY_PRIORITY_INFORMATION>()); } catch { }
                _processApi?.CloseHandle(h);
            }
            catch { }
        }

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool SetProcessAffinityMask(IntPtr hProcess, IntPtr dwProcessAffinityMask);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool GetProcessAffinityMask(IntPtr hProcess, out IntPtr lpProcessAffinityMask, out IntPtr lpSystemAffinityMask);

        private static IntPtr GetProcessAffinityMask(IntPtr hProcess)
        {
            try
            {
                GetProcessAffinityMask(hProcess, out var procMask, out var _);
                return procMask;
            }
            catch { return IntPtr.Zero; }
        }

        public async Task RunLoadTest(CancellationToken ct = default)
        {
            try
            {
                _logger.Log("RunLoadTest start");
                var tasks = new List<Task>();
                var until = DateTime.Now.AddSeconds(6);
                int workers = Math.Max(1, Environment.ProcessorCount / 2);
                for (int i = 0; i < workers; i++)
                {
                    tasks.Add(Task.Run(() =>
                    {
                        var sw = new Stopwatch();
                        sw.Start();
                        while (DateTime.Now < until && !ct.IsCancellationRequested)
                        {
                            for (int j = 0; j < 500000; j++) { var x = j * j; }
                            Thread.SpinWait(10000);
                        }
                    }, ct));
                }
                await Task.WhenAll(tasks);
                _logger.Log("RunLoadTest end");
            }
            catch { }
        }

        public void Dispose()
        {
            try { _cts?.Cancel(); } catch { }
            try { _monitorTask?.Wait(1000); } catch { }
            _cts?.Dispose();
            _cts = null;
        }
    }
}
