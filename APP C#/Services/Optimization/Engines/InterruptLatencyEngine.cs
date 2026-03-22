using System;
using System.Diagnostics;
using System.Runtime.InteropServices;

namespace VoltrisOptimizer.Services.Optimization.Engines
{
    /// <summary>
    /// DSL 5.0 - Interrupt Latency Engine
    /// Controle profundo de DPC (Deferred Procedure Calls) e Interrupts para reduzir Input Lag.
    /// </summary>
    public class InterruptLatencyEngine : IDisposable
    {
        private readonly ILoggingService _logger;
        private PerformanceCounter? _dpcTimeCounter;
        private PerformanceCounter? _interruptTimeCounter;
        private DateTime _lastProtectionApplied = DateTime.MinValue;

        public InterruptLatencyEngine(ILoggingService logger)
        {
            _logger = logger;
            InitializeCounters();
        }

        private void InitializeCounters()
        {
            try
            {
                _dpcTimeCounter = new PerformanceCounter("Processor Information", "% DPC Time", "_Total");
                _interruptTimeCounter = new PerformanceCounter("Processor Information", "% Interrupt Time", "_Total");
                
                _dpcTimeCounter.NextValue();
                _interruptTimeCounter.NextValue();
            }
            catch { }
        }

        public void Update(int? foregroundPid)
        {
            try
            {
                float dpcRate = _dpcTimeCounter?.NextValue() ?? 0;
                float interruptRate = _interruptTimeCounter?.NextValue() ?? 0;

                // Se a carga de interrupção/DPC for alta (> 2%), o mouse começa a "pular" ou ter lag
                if (dpcRate > 2.0f || interruptRate > 1.5f)
                {
                    if (foregroundPid.HasValue)
                    {
                        ApplyQuantumProtection(foregroundPid.Value);
                    }
                }
            }
            catch { }
        }

        /// <summary>
        /// IMPLEMENTADO: Aplica proteção de quantum scheduling para o processo foreground.
        /// Habilita PriorityBoost e ajusta afinidade para reduzir latência de interrupção.
        /// </summary>
        private void ApplyQuantumProtection(int pid)
        {
            try
            {
                // Cooldown de 5 segundos para evitar chamadas excessivas
                if ((DateTime.Now - _lastProtectionApplied).TotalSeconds < 5) return;

                Core.Diagnostics.CrashDiagnostics.Mark($"QuantumProtection PID={pid} BEGIN");
                var p = Process.GetProcessById(pid);
                if (p.HasExited) return;

                // 1. Habilitar Priority Boost — impede que o escalonador interrompa prematuramente
                p.PriorityBoostEnabled = true;

                // 2. Se o processo está em Normal, elevar para AboveNormal durante alta DPC
                if (p.PriorityClass == ProcessPriorityClass.Normal)
                    p.PriorityClass = ProcessPriorityClass.AboveNormal;

                // 3. Desabilitar EcoQoS/Power Throttling para o foreground durante alta latência
                IntPtr hProcess = OpenProcess(0x0200 | 0x0400, false, pid);
                if (hProcess != IntPtr.Zero)
                {
                    try
                    {
                        var state = new PROCESS_POWER_THROTTLING_STATE
                        {
                            Version = 1,
                            ControlMask = 0x01,
                            StateMask = 0x00 // Disable throttling
                        };
                        SetProcessInformation(hProcess, 4, ref state, Marshal.SizeOf(state));
                    }
                    finally { CloseHandle(hProcess); }
                }

                _lastProtectionApplied = DateTime.Now;
                _logger.LogInfo($"[InterruptLatency] Quantum protection applied to PID {pid} ({p.ProcessName})");
                Core.Diagnostics.CrashDiagnostics.Mark($"QuantumProtection PID={pid} END");
            }
            catch (Exception ex)
            {
                Core.Diagnostics.CrashDiagnostics.TraceException($"QuantumProtection_PID{pid}", ex);
            }
        }

        [DllImport("kernel32.dll")] private static extern IntPtr OpenProcess(uint access, bool inherit, int pid);
        [DllImport("kernel32.dll")] private static extern bool CloseHandle(IntPtr h);
        [DllImport("kernel32.dll")] private static extern bool SetProcessInformation(IntPtr hProcess, int infoClass, ref PROCESS_POWER_THROTTLING_STATE info, int size);

        [StructLayout(LayoutKind.Sequential)]
        private struct PROCESS_POWER_THROTTLING_STATE { public uint Version; public uint ControlMask; public uint StateMask; }

        public void Dispose()
        {
            _dpcTimeCounter?.Dispose();
            _interruptTimeCounter?.Dispose();
        }
    }
}
