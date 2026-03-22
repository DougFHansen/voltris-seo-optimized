using System;

namespace VoltrisOptimizer.Core.Benchmark
{
    /// <summary>
    /// Compara dois resultados de benchmark e calcula melhorias percentuais.
    /// </summary>
    public sealed class BenchmarkComparer
    {
        public BenchmarkComparison Compare(BenchmarkFullResult before, BenchmarkFullResult after)
        {
            return new BenchmarkComparison
            {
                CpuImprovement = CalcImprovement(before.CpuScore, after.CpuScore),
                MemoryImprovement = CalcImprovement(before.MemoryScore, after.MemoryScore),
                DiskImprovement = CalcImprovement(before.DiskScore, after.DiskScore),
                SchedulerImprovement = CalcImprovement(before.SchedulerScore, after.SchedulerScore),
                UiImprovement = CalcImprovement(before.UiScore, after.UiScore),
                OverallImprovement = CalcImprovement(before.OverallScore, after.OverallScore),
                Before = before,
                After = after
            };
        }

        private double CalcImprovement(double before, double after)
        {
            if (Math.Abs(before) < 0.001) return 0;
            return ((after - before) / before) * 100;
        }
    }

    public class BenchmarkComparison
    {
        public double CpuImprovement { get; set; }
        public double MemoryImprovement { get; set; }
        public double DiskImprovement { get; set; }
        public double SchedulerImprovement { get; set; }
        public double UiImprovement { get; set; }
        public double OverallImprovement { get; set; }
        public BenchmarkFullResult Before { get; set; } = null!;
        public BenchmarkFullResult After { get; set; } = null!;
    }
}
