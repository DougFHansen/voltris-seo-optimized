using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using VoltrisOptimizer.Services.Gamer.Diagnostics.Interfaces;
using VoltrisOptimizer.Services.Gamer.Diagnostics.Models;

namespace VoltrisOptimizer.Services.Gamer.Diagnostics.Implementation
{
    /// <summary>
    /// Implementação de profiling para módulos individuais
    /// </summary>
    public class ModuleProfiler : IModuleProfiler
    {
        private readonly string _moduleName;
        private readonly object _lock = new object();
        private readonly Queue<ModuleExecutionSample> _history = new Queue<ModuleExecutionSample>();
        private readonly int _maxHistorySize = 1000;
        private ModuleStatistics? _cachedStatistics;
        private DateTime _lastStatisticsUpdate = DateTime.MinValue;
        private readonly TimeSpan _statisticsCacheDuration = TimeSpan.FromMilliseconds(100);

        public string ModuleName => _moduleName;

        public event EventHandler<ModuleExecutionSample>? ExecutionRecorded;

        public ModuleProfiler(string moduleName)
        {
            _moduleName = moduleName ?? throw new ArgumentNullException(nameof(moduleName));
        }

        public IDisposable BeginExecution()
        {
            return new ExecutionTracker(this);
        }

        public void RecordExecution(double executionTimeMs, double cpuUsagePercent = 0, double gpuUsagePercent = 0, int threadBlocks = 0)
        {
            var sample = new ModuleExecutionSample
            {
                ModuleName = _moduleName,
                Timestamp = DateTime.Now,
                ExecutionTimeMs = executionTimeMs,
                CpuUsagePercent = cpuUsagePercent,
                GpuUsagePercent = gpuUsagePercent,
                ThreadBlocks = threadBlocks,
                MemoryUsageMb = GC.GetTotalMemory(false) / 1024.0 / 1024.0,
                ActiveThreads = Process.GetCurrentProcess().Threads.Count
            };

            lock (_lock)
            {
                _history.Enqueue(sample);
                while (_history.Count > _maxHistorySize)
                {
                    _history.Dequeue();
                }
                _cachedStatistics = null; // Invalidate cache
            }

            ExecutionRecorded?.Invoke(this, sample);
        }

        public ModuleStatistics GetStatistics()
        {
            lock (_lock)
            {
                // Cache statistics for performance
                if (_cachedStatistics != null && DateTime.Now - _lastStatisticsUpdate < _statisticsCacheDuration)
                {
                    return _cachedStatistics;
                }

                if (_history.Count == 0)
                {
                    return new ModuleStatistics { ModuleName = _moduleName };
                }

                var samples = _history.ToList();
                var executionTimes = samples.Select(s => s.ExecutionTimeMs).ToList();
                var cpuUsages = samples.Select(s => s.CpuUsagePercent).ToList();
                var gpuUsages = samples.Select(s => s.GpuUsagePercent).ToList();

                var stats = new ModuleStatistics
                {
                    ModuleName = _moduleName,
                    AverageExecutionTimeMs = executionTimes.Average(),
                    MinExecutionTimeMs = executionTimes.Min(),
                    MaxExecutionTimeMs = executionTimes.Max(),
                    StdDevExecutionTimeMs = CalculateStdDev(executionTimes),
                    AverageCpuUsagePercent = cpuUsages.Any() ? cpuUsages.Average() : 0,
                    AverageGpuUsagePercent = gpuUsages.Any() ? gpuUsages.Average() : 0,
                    TotalThreadBlocks = samples.Sum(s => s.ThreadBlocks),
                    TotalExecutions = samples.Count,
                    ExecutionsAboveThreshold = samples.Count(s => s.ExecutionTimeMs > 3.0), // Threshold de 3ms
                    P95ExecutionTimeMs = CalculatePercentile(executionTimes, 0.95),
                    P99ExecutionTimeMs = CalculatePercentile(executionTimes, 0.99),
                    LastExecutionTime = samples.LastOrDefault()?.Timestamp
                };

                // Detectar picos
                var threshold = stats.AverageExecutionTimeMs + (2 * stats.StdDevExecutionTimeMs);
                stats.PeakDetections = samples
                    .Where(s => s.ExecutionTimeMs > threshold)
                    .Select(s => s.Timestamp)
                    .ToList();

                _cachedStatistics = stats;
                _lastStatisticsUpdate = DateTime.Now;
                return stats;
            }
        }

        public IReadOnlyList<ModuleExecutionSample> GetHistory(int maxSamples = 100)
        {
            lock (_lock)
            {
                return _history.TakeLast(maxSamples).ToList();
            }
        }

        public void ClearHistory()
        {
            lock (_lock)
            {
                _history.Clear();
                _cachedStatistics = null;
            }
        }

        private static double CalculateStdDev(List<double> values)
        {
            if (values.Count == 0) return 0;
            var avg = values.Average();
            var sumSquaredDiffs = values.Sum(v => Math.Pow(v - avg, 2));
            return Math.Sqrt(sumSquaredDiffs / values.Count);
        }

        private static double CalculatePercentile(List<double> values, double percentile)
        {
            if (values.Count == 0) return 0;
            var sorted = values.OrderBy(v => v).ToList();
            var index = (int)Math.Ceiling(percentile * sorted.Count) - 1;
            return sorted[Math.Max(0, Math.Min(index, sorted.Count - 1))];
        }

        private class ExecutionTracker : IDisposable
        {
            private readonly ModuleProfiler _profiler;
            private readonly Stopwatch _stopwatch;
            private readonly long _startMemory;
            private readonly int _startThreads;

            public ExecutionTracker(ModuleProfiler profiler)
            {
                _profiler = profiler;
                _stopwatch = Stopwatch.StartNew();
                _startMemory = GC.GetTotalMemory(false);
                _startThreads = Process.GetCurrentProcess().Threads.Count;
            }

            public void Dispose()
            {
                _stopwatch.Stop();
                var executionTimeMs = _stopwatch.Elapsed.TotalMilliseconds;
                
                // Calcular uso de CPU aproximado (simplificado)
                var cpuUsage = Math.Min(100, executionTimeMs / 10.0); // Aproximação
                
                _profiler.RecordExecution(executionTimeMs, cpuUsage);
            }
        }
    }
}


