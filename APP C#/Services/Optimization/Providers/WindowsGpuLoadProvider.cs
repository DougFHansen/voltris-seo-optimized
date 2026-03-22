using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace VoltrisOptimizer.Services.Optimization.Providers
{
    public class WindowsGpuLoadProvider : IGpuLoadProvider, IDisposable
    {
        private readonly List<PerformanceCounter> _gpuCounters = new();
        private DateTime _lastCheck = DateTime.MinValue;
        private double _lastValue = 0;
        private bool _disposed;

        public WindowsGpuLoadProvider()
        {
            InitializeCounters();
        }

        private void InitializeCounters()
        {
            try
            {
                var category = new PerformanceCounterCategory("GPU Engine");
                var instanceNames = category.GetInstanceNames();
                
                // Procurar por instâncias de "3D" que são as mais indicativas de carga real
                foreach (var name in instanceNames.Where(n => n.EndsWith("engtype_3D")))
                {
                    _gpuCounters.Add(new PerformanceCounter("GPU Engine", "Utilization Percentage", name, true));
                }

                // Initial read
                foreach (var c in _gpuCounters) { try { c.NextValue(); } catch { } }
            }
            catch
            {
                // GPU Performance Counters podem não estar disponíveis
            }
        }

        public double GetGpuUtilization()
        {
            if (_disposed) return 0;
            if ((DateTime.Now - _lastCheck).TotalMilliseconds < 500) return _lastValue;

            double max = 0;
            foreach (var counter in _gpuCounters)
            {
                try
                {
                    float val = counter.NextValue();
                    if (val > max) max = val;
                }
                catch { }
            }

            _lastValue = max;
            _lastCheck = DateTime.Now;
            return max;
        }

        public void Dispose()
        {
            if (_disposed) return;
            foreach (var c in _gpuCounters) { try { c.Dispose(); } catch { } }
            _gpuCounters.Clear();
            _disposed = true;
        }
    }
}
