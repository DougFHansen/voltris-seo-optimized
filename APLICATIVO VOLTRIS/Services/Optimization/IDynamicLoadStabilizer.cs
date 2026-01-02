using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace VoltrisOptimizer.Services.Optimization
{
    public interface IDynamicLoadStabilizer : IDisposable
    {
        bool IsRunning { get; }
        bool Enabled { get; set; }
        TimeSpan Interval { get; set; }
        IReadOnlyCollection<int> ThrottledProcessIds { get; }
        event EventHandler<ThrottledEventArgs>? OnProcessThrottled;
        event EventHandler<ThrottledEventArgs>? OnProcessReleased;
        Task StartAsync(int? gameProcessId = null, CancellationToken ct = default);
        Task StopAsync(CancellationToken ct = default);
    }

    public class ThrottledEventArgs : EventArgs
    {
        public int ProcessId { get; set; }
        public string ProcessName { get; set; } = string.Empty;
        public double CpuPercent { get; set; }
        public double GpuPercent { get; set; }
        public bool IsHeavy { get; set; }
    }
}

