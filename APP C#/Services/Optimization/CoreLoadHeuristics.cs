using System;
using System.Collections.Generic;
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

    /// <summary>
    /// Heurísticas de carga de CPU usando API nativa GetSystemTimes (mesmo que Task Manager).
    /// REESCRITO: Removidos PerformanceCounters por core (extremamente pesados).
    /// Agora usa NativeSystemMetrics para leitura global ultra leve (microsegundos).
    /// </summary>
    public class CoreLoadHeuristics : IDisposable
    {
        private readonly Queue<double> _history = new();
        private const int MaxHistory = 5;
        private const int DebounceMs = 600;
        private DateTime _lastDecisionAt = DateTime.MinValue;
        private readonly VoltrisOptimizer.Services.Optimization.Providers.ICpuCoreLoadProvider? _provider;
        private readonly Helpers.NativeSystemMetrics _nativeMetrics = new();

        public CoreLoadHeuristics(VoltrisOptimizer.Services.Optimization.Providers.ICpuCoreLoadProvider? provider = null)
        {
            _provider = provider;
            // Warm-up da primeira leitura
            _nativeMetrics.GetCpuUsage();
        }

        public CoreDecision Sample()
        {
            // Se há provider customizado, usar média dos cores dele
            double cpuLoad;
            if (_provider != null)
            {
                var loads = _provider.GetCoreLoads();
                cpuLoad = loads.Length > 0 ? loads.Average() : 0;
            }
            else
            {
                // API nativa: microsegundos, zero alocação, mesmo valor do Task Manager
                cpuLoad = _nativeMetrics.GetCpuUsage();
            }

            _history.Enqueue(cpuLoad);
            while (_history.Count > MaxHistory) _history.Dequeue();

            var now = DateTime.Now;
            if ((now - _lastDecisionAt).TotalMilliseconds < DebounceMs) return CoreDecision.None;

            var avg = _history.Average();

            if (avg > 70.0 && _history.Count >= 2) { _lastDecisionAt = now; return CoreDecision.StrongThrottle; }
            if (avg > 55.0) { _lastDecisionAt = now; return CoreDecision.ModerateThrottle; }
            if (avg < 20.0) { _lastDecisionAt = now; return CoreDecision.Release; }
            return CoreDecision.None;
        }

        public void Dispose() { }
    }
}
