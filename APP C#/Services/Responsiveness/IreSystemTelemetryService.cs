using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading;

namespace VoltrisOptimizer.Services.Responsiveness
{
    /// <summary>
    /// Coleta telemetria do sistema para o IRE v2.
    /// Usa PerformanceCounter para CPU total e TotalProcessorTime para CPU por processo.
    /// Separado do SharedTelemetryProvider do DSL para evitar contenção de contadores.
    /// </summary>
    internal sealed class IreSystemTelemetryService : IDisposable
    {
        private readonly ILoggingService _logger;
        private PerformanceCounter? _cpuCounter;
        private PerformanceCounter? _diskQueueCounter;
        private PerformanceCounter? _diskActiveCounter;

        // CPU por processo: PID → último TotalProcessorTime
        private readonly ConcurrentDictionary<int, TimeSpan> _prevCpuTimes = new();
        private DateTime _lastSampleTime = DateTime.MinValue;

        private bool _initialized;
        private bool _disposed;

        public IreSystemTelemetryService(ILoggingService logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Inicializa contadores. Chamado uma vez no startup.
        /// Falha silenciosa — o IRE funciona sem contadores se necessário.
        /// </summary>
        public void Initialize()
        {
            if (_initialized) return;
            try
            {
                _cpuCounter = new PerformanceCounter("Processor Information", "% Processor Utility", "_Total");
                _diskQueueCounter = new PerformanceCounter("PhysicalDisk", "Avg. Disk Queue Length", "_Total");
                _diskActiveCounter = new PerformanceCounter("PhysicalDisk", "% Disk Time", "_Total");

                // Warmup — primeira leitura sempre retorna 0
                _cpuCounter.NextValue();
                _diskQueueCounter.NextValue();
                _diskActiveCounter.NextValue();

                _initialized = true;
                _logger.LogDebug("[IRE] Telemetry counters initialized.", "IRE");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[IRE] Telemetry init partial failure: {ex.Message}");
                _initialized = true; // Continua sem contadores
            }
        }

        /// <summary>
        /// Coleta snapshot completo. Inclui CPU por processo.
        /// </summary>
        public SystemTelemetrySnapshot Collect(Process[] processes)
        {
            var snapshot = new SystemTelemetrySnapshot
            {
                CpuTotalPercent = ReadCpuTotal(),
                DiskQueueLength = ReadDiskQueue(),
                DiskActivePercent = ReadDiskActive(),
                ForegroundPid = GetForegroundPid(),
                LastInputMs = GetLastInputMs()
            };

            snapshot.ProcessSamples = CollectProcessSamples(processes, snapshot.ForegroundPid);
            return snapshot;
        }

        private double ReadCpuTotal()
        {
            try { return _cpuCounter?.NextValue() ?? 0; }
            catch { return 0; }
        }

        private float ReadDiskQueue()
        {
            try { return _diskQueueCounter?.NextValue() ?? 0; }
            catch { return 0; }
        }

        private float ReadDiskActive()
        {
            try { return _diskActiveCounter?.NextValue() ?? 0; }
            catch { return 0; }
        }

        private int GetForegroundPid()
        {
            try
            {
                var hwnd = GetForegroundWindow();
                if (hwnd == IntPtr.Zero) return 0;
                GetWindowThreadProcessId(hwnd, out uint pid);
                return (int)pid;
            }
            catch { return 0; }
        }

        private long GetLastInputMs()
        {
            try
            {
                var info = new LASTINPUTINFO { cbSize = (uint)Marshal.SizeOf<LASTINPUTINFO>() };
                if (!GetLastInputInfo(ref info)) return long.MaxValue;
                return Environment.TickCount - (long)info.dwTime;
            }
            catch { return long.MaxValue; }
        }

        private IReadOnlyList<ProcessCpuSample> CollectProcessSamples(Process[] processes, int foregroundPid)
        {
            var now = DateTime.UtcNow;
            double intervalMs = _lastSampleTime == DateTime.MinValue
                ? 3000
                : Math.Max(100, (now - _lastSampleTime).TotalMilliseconds);
            _lastSampleTime = now;

            var samples = new List<ProcessCpuSample>(processes.Length);
            int cores = Math.Max(1, Environment.ProcessorCount);

            foreach (var p in processes)
            {
                try
                {
                    if (p.HasExited) continue;

                    double cpuPercent = 0;
                    var cpuNow = p.TotalProcessorTime;

                    if (_prevCpuTimes.TryGetValue(p.Id, out var prev))
                    {
                        var delta = cpuNow - prev;
                        cpuPercent = Math.Max(0, Math.Min(100,
                            (delta.TotalMilliseconds / intervalMs) * 100.0 / cores));
                    }
                    _prevCpuTimes[p.Id] = cpuNow;

                    samples.Add(new ProcessCpuSample
                    {
                        Pid = p.Id,
                        Name = p.ProcessName,
                        CpuPercent = cpuPercent,
                        WorkingSetBytes = p.WorkingSet64,
                        IsForeground = p.Id == foregroundPid
                    });
                }
                catch (InvalidOperationException) { }
                catch { }
            }

            // Cleanup de PIDs que não existem mais — usa HashSet para O(n) ao invés de O(n²)
            var activePids = new HashSet<int>(processes.Length);
            foreach (var p in processes) activePids.Add(p.Id);
            foreach (var key in _prevCpuTimes.Keys)
            {
                if (!activePids.Contains(key))
                    _prevCpuTimes.TryRemove(key, out _);
            }

            return samples;
        }

        public void Dispose()
        {
            if (_disposed) return;
            _disposed = true;
            _cpuCounter?.Dispose();
            _diskQueueCounter?.Dispose();
            _diskActiveCounter?.Dispose();
        }

        #region Win32

        [DllImport("user32.dll")]
        private static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll")]
        private static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

        [DllImport("user32.dll")]
        private static extern bool GetLastInputInfo(ref LASTINPUTINFO plii);

        [StructLayout(LayoutKind.Sequential)]
        private struct LASTINPUTINFO
        {
            public uint cbSize;
            public uint dwTime;
        }

        #endregion
    }
}
