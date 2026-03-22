using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.InteropServices;
using VoltrisOptimizer.Models;

namespace VoltrisOptimizer.Services.Optimization.Engines
{
    /// <summary>
    /// DSL 5.0 - Stability Guard Engine
    /// Failsafe de emergência + detecção de thread starvation + scheduler latency monitoring.
    /// </summary>
    public class StabilityGuardEngine
    {
        private readonly ILoggingService _logger;
        private DateTime _lastEmergencyAction = DateTime.MinValue;
        private DateTime _lastStarvationCheck = DateTime.MinValue;
        private DateTime _lastSaturationAction = DateTime.MinValue;
        private float _prevContextSwitches;
        private int _cycleCount;
        private int _saturationCount;
        private const int WarmupCycles = 15; // Increased to 15 to avoid false positives on startup
        private const int SaturationCooldownSeconds = 30; // Evitar ação repetida a cada ciclo de 2s

        // Processos críticos do sistema que nunca devem ter prioridade restaurada
        private static readonly HashSet<string> ProtectedProcesses = new(StringComparer.OrdinalIgnoreCase)
        {
            "winlogon", "csrss", "smss", "lsass", "services", "svchost",
            "wininit", "dwm", "explorer", "System",
            // Drivers de modo usuário — restaurar prioridade causa loop e não resolve nada
            "WUDFHost", "WmiPrvSE", "audiodg", "fontdrvhost", "conhost",
            // Processos de segurança isolados (VBS/Credential Guard) — acesso negado pelo kernel,
            // qualquer tentativa de modificação resulta em emergency restore loop
            "lsaiso", "MsMpEng", "MpDefenderCoreService", "NisSrv", "SecurityHealthService",
            // Serviços de sistema críticos — throttling causa instabilidade e não melhora performance
            "spoolsv",      // Print Spooler — throttling repetitivo sem benefício
            "taskhostw",    // Task Host — hospeda tarefas agendadas do sistema
            "taskeng",      // Task Scheduler Engine
            "msdtc",        // Distributed Transaction Coordinator
            "sppsvc",       // Software Protection Platform
            "wuauserv",     // Windows Update (via svchost, mas por segurança)
            "TrustedInstaller", // Windows Modules Installer
            "TiWorker",     // Windows Modules Installer Worker
            "SearchIndexer", // Windows Search Indexer
            "SearchHost",   // Windows Search Host
            "RuntimeBroker", // Runtime Broker (UWP apps)
            "sihost",       // Shell Infrastructure Host
            "ctfmon",       // CTF Loader (input methods)
            "TextInputHost", // Text Input Application
            // Processos Intel/OEM — throttling causa emergency restore loop
            "IntelCpHDCPSvc",   // Intel Content Protection HDCP Service
            "IntelCpHeciSvc",   // Intel ME HECI Service
            "igfxEM",           // Intel Graphics Event Monitor
            "igfxHK",           // Intel Graphics Hotkey
            "igfxTray",         // Intel Graphics Tray
            "igfxCUIServiceN",  // Intel Graphics Control Panel Service
            "igfxCUIService",   // Intel Graphics Service
            "igfxDTCM",         // Intel Graphics Desktop Control Module
            "igfxPERS",         // Intel Graphics Persistence Module
            "LMS",              // Intel Management Engine Local Management Service
            "jhi_service",      // Intel Dynamic Application Loader
            "esrv_svc",         // Intel Energy Server Service
            "esrv"              // Intel Energy Server
        };

        public StabilityGuardEngine(ILoggingService logger)
        {
            _logger = logger;
        }

        public void Governance(Process p, SystemState50 state)
        {
            // Ignorar durante warmup — PerformanceCounter retorna CPU=0% na 1ª leitura
            // mas Queue retorna valor real, causando falsos alarmes
            if (_cycleCount < WarmupCycles) return;

            // Se o sistema entrar em estado crítico (Queue Depth > 10 ou memória crítica)
            // Restaurar prioridades seguras para evitar deadlock/freeze
            if (state.CpuQueueLength > 25.0f || state.MemoryPressure == PressureLevel.Critical)
            {
                EmergencyRestore(p);
            }
        }

        private void EmergencyRestore(Process p)
        {
            try
            {
                if ((DateTime.Now - _lastEmergencyAction).TotalSeconds < 5) return;

                // Nunca restaurar processos críticos do sistema — falso positivo
                if (ProtectedProcesses.Contains(p.ProcessName)) return;

                if (p.PriorityClass != ProcessPriorityClass.Normal)
                {
                    p.PriorityClass = ProcessPriorityClass.Normal;

                    // Também restaurar EcoQoS
                    IntPtr hProcess = OpenProcess(0x0200 | 0x0400, false, p.Id);
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

                    _logger.LogWarning($"[StabilityGuard] Emergency restore: {p.ProcessName} (PID: {p.Id}) — extreme system stress");
                    _lastEmergencyAction = DateTime.Now;
                }
            }
            catch { }
        }

        public void CheckGlobalHealth(SystemState50 state)
        {
            _cycleCount++;

            // Ignorar durante warmup — contadores de performance precisam de 2-3 amostras
            // para retornar valores reais (CPU=0% na 1ª leitura causa falsos alarmes)
            if (_cycleCount <= WarmupCycles) return;

            // 1. Critical saturation detection + ação real com cooldown
            if (state.CpuUsagePercent > 99 && state.CpuQueueLength > 30)
            {
                _saturationCount++;
                var now = DateTime.Now;
                if ((now - _lastSaturationAction).TotalSeconds >= SaturationCooldownSeconds)
                {
                    _lastSaturationAction = now;
                    _logger.LogCritical($"[StabilityGuard] CRITICAL SATURATION — CPU: {state.CpuUsagePercent:F0}%, Queue: {state.CpuQueueLength:F1}. Failsafe mode active.");

                    // Ação real: reduzir prioridade do próprio processo para liberar scheduler
                    // Padrão enterprise — nunca matar processos de terceiros, apenas ceder CPU
                    try
                    {
                        var self = Process.GetCurrentProcess();
                        if (self.PriorityClass != ProcessPriorityClass.BelowNormal)
                        {
                            self.PriorityClass = ProcessPriorityClass.BelowNormal;
                            _logger.LogInfo("[StabilityGuard] Prioridade do processo reduzida temporariamente (failsafe).");
                        }
                    }
                    catch { }
                }
            }
            else if (_saturationCount > 0)
            {
                // Sistema estabilizou — restaurar prioridade normal
                _saturationCount = 0;
                try
                {
                    var self = Process.GetCurrentProcess();
                    if (self.PriorityClass == ProcessPriorityClass.BelowNormal)
                    {
                        self.PriorityClass = ProcessPriorityClass.Normal;
                        _logger.LogInfo("[StabilityGuard] Prioridade do processo restaurada (sistema estabilizado).");
                    }
                }
                catch { }
            }

            // 2. Thread starvation detection via context switch rate
            if ((DateTime.Now - _lastStarvationCheck).TotalSeconds >= 5)
            {
                _lastStarvationCheck = DateTime.Now;

                // Excessivo context switching (> 50k/s) indica contenção de threads
                if (state.ContextSwitchesPerSec > 50000 && state.CpuQueueLength > 3)
                {
                    _logger.LogWarning($"[StabilityGuard] Thread contention detected: {state.ContextSwitchesPerSec:F0} ctx/s, Queue: {state.CpuQueueLength:F1}");
                }

                // Scheduler latency: alta queue com baixo CPU indica starvation
                // Threshold mais alto para evitar falsos positivos em sistemas com muitos threads
                if (state.CpuQueueLength > 8 && state.CpuUsagePercent < 40)
                {
                    _logger.LogWarning($"[StabilityGuard] Scheduler starvation suspected: Queue={state.CpuQueueLength:F1} but CPU={state.CpuUsagePercent:F0}%");
                }

                _prevContextSwitches = state.ContextSwitchesPerSec;
            }
        }

        [DllImport("kernel32.dll")] private static extern IntPtr OpenProcess(uint access, bool inherit, int pid);
        [DllImport("kernel32.dll")] private static extern bool CloseHandle(IntPtr h);
        [DllImport("kernel32.dll")] private static extern bool SetProcessInformation(IntPtr h, int infoClass, ref PROCESS_POWER_THROTTLING_STATE state, int size);

        [StructLayout(LayoutKind.Sequential)]
        private struct PROCESS_POWER_THROTTLING_STATE { public uint Version; public uint ControlMask; public uint StateMask; }
    }
}
