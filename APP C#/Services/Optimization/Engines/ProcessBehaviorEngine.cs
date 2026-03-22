using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;

namespace VoltrisOptimizer.Services.Optimization.Engines
{
    /// <summary>
    /// DSL 5.0 - Process Behavior Engine
    /// Analisa padrões de comportamento para prever necessidades de recursos e aplicar contenção inteligente.
    /// </summary>
    public class ProcessBehaviorEngine : IDisposable
    {
        private readonly ILoggingService _logger;
        private readonly ConcurrentDictionary<string, BehaviorProfile> _processLibrary = new();
        private DateTime _lastLeakReport = DateTime.MinValue;
        
        public class BehaviorProfile
        {
            public string Name { get; set; } = "";
            public double AvgCpu { get; set; }
            public long AvgWorkingSet { get; set; }
            public long PeakWorkingSet { get; set; }
            public int ExecutionCount { get; set; }
            public DateTime LastSeen { get; set; }
            public bool IsResourceIntensive { get; set; }
            public bool IsLeaky { get; set; }
            public int LeakSampleCount { get; set; }
        }

        public ProcessBehaviorEngine(ILoggingService logger)
        {
            _logger = logger;
        }

        /// <summary>
        /// Ciclo de Aprendizado e Aplicação de Política
        /// </summary>
        public void Update(Process[] processes, int? foregroundPid)
        {
            try
            {
                foreach (var p in processes)
                {
                    try
                    {
                        if (p.HasExited) continue;

                        string name = p.ProcessName;
                        var profile = _processLibrary.GetOrAdd(name, n => new BehaviorProfile { Name = n, LastSeen = DateTime.Now });

                        // Telemetria básica
                        profile.LastSeen = DateTime.Now;
                        profile.ExecutionCount++;
                        long currentWs = p.WorkingSet64;

                        // Média móvel exponencial do working set
                        if (profile.AvgWorkingSet == 0)
                            profile.AvgWorkingSet = currentWs;
                        else
                            profile.AvgWorkingSet = (profile.AvgWorkingSet * 3 + currentWs) / 4;

                        if (currentWs > profile.PeakWorkingSet)
                            profile.PeakWorkingSet = currentWs;

                        // Detecção de Anomalia de Crescimento (Leak)
                        if (currentWs > profile.AvgWorkingSet * 1.5 && p.Id != foregroundPid)
                        {
                            profile.LeakSampleCount++;
                            // Só marcar como leak se o padrão persistir por 5+ amostras
                            if (profile.LeakSampleCount >= 5)
                            {
                                if (!profile.IsLeaky)
                                {
                                    profile.IsLeaky = true;
                                    if ((DateTime.Now - _lastLeakReport).TotalMinutes > 5)
                                    {
                                        _logger.LogWarning($"[Behavior] Possível memory leak detectado: {name} (WS: {currentWs / 1024 / 1024}MB, Avg: {profile.AvgWorkingSet / 1024 / 1024}MB)");
                                        _lastLeakReport = DateTime.Now;
                                    }
                                }
                            }
                        }
                        else
                        {
                            profile.LeakSampleCount = Math.Max(0, profile.LeakSampleCount - 1);
                        }

                        // Marcar como resource intensive se uso médio de memória > 500MB
                        if (profile.AvgWorkingSet > 500 * 1024 * 1024)
                            profile.IsResourceIntensive = true;

                        // Aplicação de políticas baseadas no perfil histórico
                        ApplyHeuristicSafety(p, profile, foregroundPid);
                    }
                    catch { }
                }

                // Cleanup ocasional de perfis antigos (a cada ~60 segundos)
                if (DateTime.Now.Second == 0) CleanupLibrary();
            }
            catch { }
        }

        /// <summary>
        /// IMPLEMENTADO: Aplica políticas heurísticas baseadas no comportamento histórico do processo.
        /// - Reduz prioridade de memória para processos pesados em background
        /// - Aplica EcoQoS para processos com leak detectado
        /// - Ajusta memory priority baseado no perfil
        /// </summary>
        private void ApplyHeuristicSafety(Process p, BehaviorProfile profile, int? foregroundPid)
        {
            try
            {
                // Não aplicar políticas ao processo foreground
                if (p.Id == foregroundPid) return;
                
                // Safety: verificar se o processo ainda existe antes de abrir handle
                if (p.HasExited) return;

                IntPtr hProcess = OpenProcess(0x0200 | 0x0400, false, p.Id);
                if (hProcess == IntPtr.Zero) return;

                try
                {
                    // 1. Processos com leak detectado: reduzir prioridade de memória para Very Low
                    if (profile.IsLeaky)
                    {
                        var memInfo = new MEMORY_PRIORITY_INFORMATION { MemoryPriority = 1 }; // Very Low
                        SetProcessInformation(hProcess, 1, ref memInfo, Marshal.SizeOf(memInfo));

                        // Habilitar EcoQoS para processos com leak
                        var powerState = new PROCESS_POWER_THROTTLING_STATE
                        {
                            Version = 1,
                            ControlMask = 0x01,
                            StateMask = 0x01 // Enable EcoQoS
                        };
                        SetProcessInformation(hProcess, 4, ref powerState, Marshal.SizeOf(powerState));
                        return;
                    }

                    // 2. Processos historicamente pesados em background: reduzir prioridade de memória
                    if (profile.IsResourceIntensive)
                    {
                        var memInfo = new MEMORY_PRIORITY_INFORMATION { MemoryPriority = 2 }; // Low
                        SetProcessInformation(hProcess, 1, ref memInfo, Marshal.SizeOf(memInfo));
                        return;
                    }

                    // 3. Processos normais em background: prioridade de memória padrão
                    var defaultMemInfo = new MEMORY_PRIORITY_INFORMATION { MemoryPriority = 3 }; // Medium
                    SetProcessInformation(hProcess, 1, ref defaultMemInfo, Marshal.SizeOf(defaultMemInfo));
                }
                finally { CloseHandle(hProcess); }
            }
            catch { }
        }

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern IntPtr OpenProcess(uint access, bool inherit, int pid);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool CloseHandle(IntPtr h);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool SetProcessInformation(IntPtr h, int infoClass, ref MEMORY_PRIORITY_INFORMATION state, int size);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool SetProcessInformation(IntPtr h, int infoClass, ref PROCESS_POWER_THROTTLING_STATE state, int size);

        [StructLayout(LayoutKind.Sequential)]
        private struct MEMORY_PRIORITY_INFORMATION { public uint MemoryPriority; }

        [StructLayout(LayoutKind.Sequential)]
        private struct PROCESS_POWER_THROTTLING_STATE { public uint Version; public uint ControlMask; public uint StateMask; }

        private void CleanupLibrary()
        {
            var oldKeys = _processLibrary.Where(x => (DateTime.Now - x.Value.LastSeen).TotalMinutes > 30).Select(x => x.Key).ToList();
            foreach (var key in oldKeys) _processLibrary.TryRemove(key, out _);
        }

        public void Dispose() { }
    }
}
