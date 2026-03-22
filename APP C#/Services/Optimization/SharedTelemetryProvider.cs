using System;
using System.Diagnostics;
using VoltrisOptimizer.Core;
using VoltrisOptimizer.Models;

namespace VoltrisOptimizer.Services.Optimization
{
    /// <summary>
    /// DSL 5.0 - Unified Telemetry Core
    /// Centraliza toda a telemetria do Windows NT Kernel em um unico ciclo sincronizado.
    ///
    /// OTIMIZAÇÃO: CPU% e RAM agora vêm do SystemMetricsCache (GetSystemTimes, 1x/2s).
    /// Mantemos apenas os contadores que NÃO têm equivalente no cache:
    ///   - CpuQueueLength, ContextSwitches, DpcTime, InterruptTime (latência de kernel)
    ///   - DiskQueueLength, DiskActiveTime (contenção de I/O)
    ///   - HardPageFaults (pressão de memória virtual)
    /// </summary>
    public class SharedTelemetryProvider : IDisposable
    {
        private readonly ILoggingService _logger;
        
        // Contadores de Kernel — métricas que NÃO estão no SystemMetricsCache
        private PerformanceCounter? _cpuQueueCounter;
        private PerformanceCounter? _dpcTimeCounter;
        private PerformanceCounter? _interruptTimeCounter;
        private PerformanceCounter? _pageReadsCounter;
        private PerformanceCounter? _diskQueueCounter;
        private PerformanceCounter? _diskActiveCounter;
        private PerformanceCounter? _contextSwitchCounter;

        public SharedTelemetryProvider(ILoggingService logger)
        {
            _logger = logger;
            InitializeCounters();
        }

        private void InitializeCounters()
        {
            try
            {
                _cpuQueueCounter      = new PerformanceCounter("System", "Processor Queue Length");
                _contextSwitchCounter = new PerformanceCounter("System", "Context Switches/sec");
                _dpcTimeCounter       = new PerformanceCounter("Processor Information", "% DPC Time", "_Total");
                _interruptTimeCounter = new PerformanceCounter("Processor Information", "% Interrupt Time", "_Total");
                _pageReadsCounter     = new PerformanceCounter("Memory", "Page Reads/sec");
                _diskQueueCounter     = new PerformanceCounter("PhysicalDisk", "Avg. Disk Queue Length", "_Total");
                _diskActiveCounter    = new PerformanceCounter("PhysicalDisk", "% Disk Time", "_Total");
                
                // Warmup (primeira leitura é sempre 0)
                _cpuQueueCounter.NextValue();
                _dpcTimeCounter.NextValue();
                _interruptTimeCounter.NextValue();
                _pageReadsCounter.NextValue();
                _diskQueueCounter.NextValue();
                _diskActiveCounter.NextValue();
                _contextSwitchCounter.NextValue();
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[DSL 5.0] Telemetry init failure: {ex.Message}");
            }
        }

        public void Update(SystemState50 state)
        {
            try
            {
                // CPU% e RAM vêm do SystemMetricsCache — zero custo adicional ao kernel.
                // O cache já coleta essas métricas via GetSystemTimes/GlobalMemoryStatusEx a cada 2s.
                var cache = Core.SystemMetricsCache.Instance;
                state.AvailableRamMb      = cache.AvailableRamMb;
                state.CommitChargePercent = (uint)cache.MemoryUsedPercent;

                // Métricas de kernel que só existem via PerformanceCounter
                state.CpuQueueLength        = _cpuQueueCounter?.NextValue()      ?? 0;
                state.ContextSwitchesPerSec = _contextSwitchCounter?.NextValue() ?? 0;
                state.DpcTime               = _dpcTimeCounter?.NextValue()        ?? 0;
                state.InterruptTime         = _interruptTimeCounter?.NextValue()  ?? 0;
                state.HardPageFaults        = _pageReadsCounter?.NextValue()      ?? 0;
                state.DiskQueueLength       = _diskQueueCounter?.NextValue()      ?? 0;
                state.DiskActiveTime        = _diskActiveCounter?.NextValue()     ?? 0;

                // Último input do usuário — também disponível no cache
                state.LastInputActivityMs = cache.LastInputMs;
            }
            catch { }
        }

        public void Dispose()
        {
            _cpuQueueCounter?.Dispose();
            _dpcTimeCounter?.Dispose();
            _interruptTimeCounter?.Dispose();
            _pageReadsCounter?.Dispose();
            _diskQueueCounter?.Dispose();
            _diskActiveCounter?.Dispose();
            _contextSwitchCounter?.Dispose();
        }
    }
}
