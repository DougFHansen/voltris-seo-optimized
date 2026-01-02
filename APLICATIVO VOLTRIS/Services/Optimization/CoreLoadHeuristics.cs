using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace VoltrisOptimizer.Services.Optimization
{
    public enum CoreDecision
    {
        None,
        ModerateThrottle,
        StrongThrottle,
        Release
    }

    public class CoreLoadHeuristics : IDisposable
    {
        private readonly List<PerformanceCounter> _counters = new();
        private readonly Queue<double[]> _history = new();
        private readonly TimeSpan _window = TimeSpan.FromMilliseconds(1500);
        private readonly Stopwatch _sw = new();
        private readonly int _debounceMs = 600;
        private DateTime _lastDecisionAt = DateTime.MinValue;
        private readonly VoltrisOptimizer.Services.Optimization.Providers.ICpuCoreLoadProvider? _provider;

        public CoreLoadHeuristics(VoltrisOptimizer.Services.Optimization.Providers.ICpuCoreLoadProvider? provider = null)
        {
            _provider = provider;
            var cat = new PerformanceCounterCategory("Processor");
            var instances = cat.GetInstanceNames().Where(n => n != "_Total").ToArray();
            foreach (var inst in instances)
            {
                _counters.Add(new PerformanceCounter("Processor", "% Processor Time", inst, true));
            }
            _sw.Start();
        }

        public CoreDecision Sample()
        {
            var loads = _provider != null ? _provider.GetCoreLoads() : _counters.Select(c => (double)c.NextValue()).ToArray();
            _history.Enqueue(loads);
            TrimHistory();
            var now = DateTime.Now;
            var coreCount = loads.Length;
            var avg = AverageLoads();
            var over70 = avg.Count(x => x > 70.0);
            var over55 = avg.Count(x => x > 55.0);
            var allUnder20 = avg.All(x => x < 20.0);

            if ((now - _lastDecisionAt).TotalMilliseconds < _debounceMs) return CoreDecision.None;
            if (over70 >= 1 && _history.Count >= 2) { _lastDecisionAt = now; return CoreDecision.StrongThrottle; }
            if (over55 >= 2) { _lastDecisionAt = now; return CoreDecision.ModerateThrottle; }
            if (allUnder20) { _lastDecisionAt = now; return CoreDecision.Release; }
            return CoreDecision.None;
        }

        private void TrimHistory()
        {
            var targetCount = Math.Max(1, (int)(_window.TotalMilliseconds / 200.0));
            while (_history.Count > targetCount) _history.Dequeue();
        }

        private double[] AverageLoads()
        {
            if (_history.Count == 0) return Array.Empty<double>();
            var len = _history.Peek().Length;
            var sums = new double[len];
            var count = 0;
            foreach (var arr in _history)
            {
                for (int i = 0; i < len; i++) sums[i] += arr[i];
                count++;
            }
            for (int i = 0; i < len; i++) sums[i] = sums[i] / Math.Max(1, count);
            return sums;
        }

        public void Dispose()
        {
            foreach (var c in _counters) { try { c.Dispose(); } catch { } }
            _counters.Clear();
        }
    }
}
