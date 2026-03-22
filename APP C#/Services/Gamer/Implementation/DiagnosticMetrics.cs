using System;

namespace VoltrisOptimizer.Services.Gamer.Implementation
{
    public class DiagnosticMetrics
    {
        public double CpuUsagePercent { get; set; }
        public double DpcPercent { get; set; }
        public int PageFaultsPerSecond { get; set; }
        public double DiskQueueLength { get; set; }
        public double FrameTimeJitterMs { get; set; }
        public double NetworkJitterMs { get; set; }
    }
}
