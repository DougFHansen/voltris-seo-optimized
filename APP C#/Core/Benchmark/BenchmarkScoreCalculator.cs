using System;

namespace VoltrisOptimizer.Core.Benchmark
{
    /// <summary>
    /// Calcula o score global do benchmark com ponderação profissional.
    /// CPU=35%, Memory=20%, Disk=25%, Scheduler=10%, UI=10%
    /// </summary>
    public sealed class BenchmarkScoreCalculator
    {
        public double Calculate(double cpuScore, double memoryScore, double diskScore,
            double schedulerScore, double uiScore)
        {
            return cpuScore * 0.35
                 + memoryScore * 0.20
                 + diskScore * 0.25
                 + schedulerScore * 0.10
                 + uiScore * 0.10;
        }
    }
}
