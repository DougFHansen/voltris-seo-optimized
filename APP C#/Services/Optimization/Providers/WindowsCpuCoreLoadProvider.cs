using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace VoltrisOptimizer.Services.Optimization.Providers
{
    public class WindowsCpuCoreLoadProvider : ICpuCoreLoadProvider, IDisposable
    {
        private readonly List<PerformanceCounter> _counters = new();
        private bool _disposed;

        public WindowsCpuCoreLoadProvider()
        {
            try
            {
                var cat = new PerformanceCounterCategory("Processor");
                var instances = cat.GetInstanceNames()
                    .Where(n => n != "_Total" && !n.Contains("Total"))
                    .OrderBy(n => n.Length)
                    .ThenBy(n => n)
                    .ToArray();

                foreach (var inst in instances)
                {
                    _counters.Add(new PerformanceCounter("Processor", "% Processor Time", inst, true));
                }
                
                // Primeira leitura para inicializar
                foreach (var c in _counters) { try { c.NextValue(); } catch { } }
            }
            catch
            {
                // Fallback silencioso se PerformanceCounters estiverem corrompidos
            }
        }

        public double[] GetCoreLoads()
        {
            if (_disposed) return Array.Empty<double>();

            var loads = new double[_counters.Count];
            for (int i = 0; i < _counters.Count; i++)
            {
                try { loads[i] = _counters[i].NextValue(); }
                catch { loads[i] = 0; }
            }
            return loads;
        }

        public void Dispose()
        {
            if (_disposed) return;
            foreach (var c in _counters) { try { c.Dispose(); } catch { } }
            _counters.Clear();
            _disposed = true;
        }
    }
}
