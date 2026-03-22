using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;

namespace VoltrisOptimizer.Core
{
    /// <summary>
    /// DSL 5.0 - High-Performance Process Scanner
    /// Realiza a coleta O(N) de processos com caching para minimizar overhead.
    /// </summary>
    public class ProcessScanner
    {
        private readonly Dictionary<int, long> _cpuTicksCache = new();

        public struct ProcessSample
        {
            public int ProcessId;
            public string ProcessName;
            public double CpuPercent;
            
            /// <summary>
            /// Obtém o Process sob demanda. O chamador é responsável por fazer Dispose.
            /// </summary>
            public Process GetProcess() => Process.GetProcessById(ProcessId);
        }

        public List<ProcessSample> Scan(TimeSpan elapsed)
        {
            var samples = new List<ProcessSample>();
            int bufferSize = 0x10000; // 64KB inicial
            IntPtr buffer = Marshal.AllocHGlobal(bufferSize);

            try
            {
                int status = Native.HardeningNativeMethods.NtQuerySystemInformation(
                    Native.HardeningNativeMethods.SystemProcessInformation,
                    buffer,
                    bufferSize,
                    out int returnLength);

                // Se o buffer for pequeno, realocamos
                if (status == unchecked((int)0xC0000004)) // STATUS_INFO_LENGTH_MISMATCH
                {
                    Marshal.FreeHGlobal(buffer);
                    bufferSize = returnLength;
                    buffer = Marshal.AllocHGlobal(bufferSize);
                    status = Native.HardeningNativeMethods.NtQuerySystemInformation(
                        Native.HardeningNativeMethods.SystemProcessInformation,
                        buffer,
                        bufferSize,
                        out _);
                }

                if (status != 0) return samples;

                double totalElapsedTicks = elapsed.TotalMilliseconds * 10000;
                if (totalElapsedTicks <= 0) totalElapsedTicks = 1;

                IntPtr currentPtr = buffer;
                while (true)
                {
                    var spi = Marshal.PtrToStructure<Native.HardeningNativeMethods.SYSTEM_PROCESS_INFORMATION>(currentPtr);
                    int pid = spi.UniqueProcessId.ToInt32();

                    if (pid != 0) // Ignorar Idle
                    {
                        try
                        {
                            long currentTicks = spi.UserTime + spi.KernelTime;
                            if (_cpuTicksCache.TryGetValue(pid, out long lastTicks))
                            {
                                double cpuPerc = ((currentTicks - lastTicks) / totalElapsedTicks) * 100.0 / Environment.ProcessorCount;
                                
                                // Armazenar apenas PID e CPU% — sem criar objeto Process pesado
                                // O chamador pode obter o Process sob demanda via GetProcess()
                                string name = "";
                                try
                                {
                                    name = spi.ImageName.Length > 0 
                                        ? Marshal.PtrToStringUni(spi.ImageName.Buffer, spi.ImageName.Length / 2) ?? ""
                                        : "";
                                }
                                catch { }
                                
                                samples.Add(new ProcessSample 
                                { 
                                    ProcessId = pid,
                                    ProcessName = name,
                                    CpuPercent = Math.Clamp(cpuPerc, 0, 100) 
                                });
                            }
                            _cpuTicksCache[pid] = currentTicks;
                        }
                        catch { }
                    }

                    if (spi.NextEntryOffset == 0) break;
                    currentPtr = (IntPtr)((long)currentPtr + spi.NextEntryOffset);
                }
            }
            finally
            {
                if (buffer != IntPtr.Zero) Marshal.FreeHGlobal(buffer);
            }

            // Cleanup
            if (_cpuTicksCache.Count > samples.Count * 2)
            {
                _cpuTicksCache.Clear(); // Full clear para evitar leaks em sessões longas
            }

            return samples;
        }
    }
}
