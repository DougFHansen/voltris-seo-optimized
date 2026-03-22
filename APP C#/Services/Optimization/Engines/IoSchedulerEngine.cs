using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using VoltrisOptimizer.Models;
using VoltrisOptimizer.Services.Gamer.Implementation;

namespace VoltrisOptimizer.Services.Optimization.Engines
{
    /// <summary>
    /// DSL 5.0 - IO Scheduler Awareness
    /// Gerência de prioridade de I/O com consciência de saturação de disco.
    /// Reduz latência de I/O para foreground e suprime background durante contenção.
    /// </summary>
    public class IoSchedulerEngine : IDisposable
    {
        private readonly ILoggingService _logger;
        private int _lastLoggedForegroundPid;

        public IoSchedulerEngine(ILoggingService logger)
        {
            _logger = logger;
        }

        public void Governance(Process p, SystemState50 state)
        {
            try
            {
                if (p.HasExited) return;

                // 1. FOREGROUND — sempre I/O High para responsividade máxima
                if (p.Id == state.ForegroundPid)
                {
                    SetIoPriority(p, GamerNativeMethods.IoPriorityLevel.IoPriorityHigh);
                    // Desabilitar EcoQoS para foreground
                    SetPowerThrottling(p, false);
                    return;
                }

                // 2. CONTENÇÃO DE DISCO — suprimir background agressivamente
                if (state.DiskActiveTime > 80f || state.DiskQueueLength > 1.2f)
                {
                    // Processos com working set > 50MB provavelmente estão fazendo I/O
                    if (p.WorkingSet64 > 50 * 1024 * 1024)
                    {
                        SetIoPriority(p, GamerNativeMethods.IoPriorityLevel.IoPriorityVeryLow);
                        SetPowerThrottling(p, true); // EcoQoS para reduzir carga
                        return;
                    }
                    // Processos menores: I/O Low
                    SetIoPriority(p, GamerNativeMethods.IoPriorityLevel.IoPriorityLow);
                    return;
                }

                // 3. PRESSÃO MODERADA — I/O Low para background pesado
                if (state.IoPressure >= PressureLevel.Medium && p.WorkingSet64 > 100 * 1024 * 1024)
                {
                    SetIoPriority(p, GamerNativeMethods.IoPriorityLevel.IoPriorityLow);
                    return;
                }

                // 4. SEM PRESSÃO — restaurar I/O Normal
                SetIoPriority(p, GamerNativeMethods.IoPriorityLevel.IoPriorityNormal);
            }
            catch { }
        }

        private void SetIoPriority(Process process, GamerNativeMethods.IoPriorityLevel priority)
        {
            try
            {
                if (process.HasExited) return;
                IntPtr hProc = OpenProcess(0x0200 | 0x0400, false, process.Id);
                if (hProc != IntPtr.Zero)
                {
                    try
                    {
                        GamerNativeMethods.SetProcessIoPriority(hProc, priority, out _);
                    }
                    finally { CloseHandle(hProc); }
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
        [DllImport("kernel32.dll")] private static extern bool SetProcessInformation(IntPtr h, int infoClass, ref PROCESS_POWER_THROTTLING_STATE state, int size);

        [StructLayout(LayoutKind.Sequential)]
        private struct PROCESS_POWER_THROTTLING_STATE { public uint Version; public uint ControlMask; public uint StateMask; }

        public void Dispose() { }
    }
}
