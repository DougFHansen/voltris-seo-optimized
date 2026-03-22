using System;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Runtime.InteropServices;
using VoltrisOptimizer.Models;

namespace VoltrisOptimizer.Services.Optimization.Engines
{
    /// <summary>
    /// DSL 5.0 - Proactive CPU Governor
    /// Focado em reduzir Scheduling Latency (Queue Depth) e proteger threads de Input.
    /// </summary>
    public class CpuGovernorEngine : IDisposable
    {
        private readonly ILoggingService _logger;
        private readonly ConcurrentDictionary<int, ProcessPriorityClass> _originalPriorities = new();
        
        public CpuGovernorEngine(ILoggingService logger)
        {
            _logger = logger;
        }

        public void Governance(Process p, SystemState50 state)
        {
            try
            {
                if (p.HasExited) return;

                // 1. INPUT FAVORING & FOREGROUND BOOST
                if (p.Id == state.ForegroundPid)
                {
                    var priority = state.LastInputActivityMs < 300 ? ProcessPriorityClass.High : ProcessPriorityClass.AboveNormal;
                    ApplyBoost(p, priority);
                    return;
                }

                // 2. DEADLOCK PREVENTION — WCT REMOVIDO PERMANENTEMENTE
                // A chamada GetThreadWaitChain (advapi32.dll) causa crash nativo
                // confirmado pelo crash_trace: processo morre durante WCT native call.
                // Substituído por heurística simples: se o processo background tem
                // prioridade >= AboveNormal, não reduzir (pode estar em lock crítico).
                if (p.PriorityClass >= ProcessPriorityClass.AboveNormal)
                    return; // Não interferir com processos já priorizados

                // 3. BACKGROUND REGULATION (EcoQoS)
                if (state.CpuQueueLength > Environment.ProcessorCount * 0.8f)
                {
                    ApplyThrottling(p, true); // Strong
                }
                else if (state.CpuPressure >= PressureLevel.Medium)
                {
                    ApplyThrottling(p, false); // Adaptive
                }
            }
            catch { }
        }

        private void ApplyBoost(Process p, ProcessPriorityClass target)
        {
            try
            {
                if (p.PriorityClass != target)
                {
                    if (!_originalPriorities.ContainsKey(p.Id))
                        _originalPriorities[p.Id] = p.PriorityClass;
                    p.PriorityClass = target;
                }
                SetPowerThrottling(p, false); // Disable EcoQoS for foreground
            }
            catch { }
        }

        private void ApplyThrottling(Process p, bool strong)
        {
            try
            {
                // PROTEÇÃO: Nunca reduzir prioridade de processos críticos do sistema
                if (p.PriorityClass == ProcessPriorityClass.Normal || p.PriorityClass == ProcessPriorityClass.AboveNormal)
                {
                    p.PriorityClass = ProcessPriorityClass.BelowNormal;
                    SetPowerThrottling(p, true); // Enable EcoQoS (Efficiency Mode)
                }
            }
            catch { }
        }

        private void SetPowerThrottling(Process p, bool enable)
        {
            IntPtr hProcess = IntPtr.Zero;
            try
            {
                hProcess = OpenProcess(0x0200 | 0x0400, false, p.Id);
                if (hProcess == IntPtr.Zero) return;

                var state = new PROCESS_POWER_THROTTLING_STATE
                {
                    Version = 1,
                    ControlMask = 0x01,
                    StateMask = enable ? 0x01u : 0x00u
                };

                SetProcessInformation(hProcess, 4, ref state, Marshal.SizeOf(state));
            }
            catch { }
            finally { if (hProcess != IntPtr.Zero) CloseHandle(hProcess); }
        }

        [DllImport("kernel32.dll")] private static extern IntPtr OpenProcess(uint access, bool inherit, int pid);
        [DllImport("kernel32.dll")] private static extern bool CloseHandle(IntPtr h);
        [DllImport("kernel32.dll")] private static extern bool SetProcessInformation(IntPtr hProcess, int infoClass, ref PROCESS_POWER_THROTTLING_STATE info, int size);

        [StructLayout(LayoutKind.Sequential)]
        private struct PROCESS_POWER_THROTTLING_STATE { public uint Version; public uint ControlMask; public uint StateMask; }

        public void Dispose() 
        {
        }
    }
}
