using System;
using System.Diagnostics;
using System.Management;
using System.Runtime.InteropServices;

namespace VoltrisOptimizer.Services.Optimization.Engines
{
    /// <summary>
    /// DSL 5.0 - Thermal & Power Intelligence Engine
    /// Monitoramento térmico preventivo com ações corretivas para evitar Power Throttling agressivo.
    /// </summary>
    public class ThermalPowerEngine : IDisposable
    {
        private readonly ILoggingService _logger;
        private PerformanceCounter? _thermalThrottlingCounter;
        private bool _isThrottlingTriggered = false;
        private DateTime _lastCorrectiveAction = DateTime.MinValue;

        public ThermalPowerEngine(ILoggingService logger)
        {
            _logger = logger;
            InitializeCounters();
        }

        private void InitializeCounters()
        {
            try
            {
                _thermalThrottlingCounter = new PerformanceCounter("Thermal Zone Information", "Percent Passive Limit", "_Total");
                _thermalThrottlingCounter.NextValue();
            }
            catch { }
        }

        public void Update()
        {
            try
            {
                float? temperature = GetTemperatureFromPrimarySource();
                
                // Fallback para WMI ACPI se o contador primário falhar ou retornar zero
                if (!temperature.HasValue || temperature <= 0)
                {
                    temperature = GetTemperatureFromWmiFallback();
                }

                // HARDENING: Se não conseguimos medir a temperatura, modo de segurança
                if (!temperature.HasValue)
                {
                    if (!_isThrottlingTriggered)
                    {
                        _logger.LogCritical("[Thermal] TELEMETRIA TÉRMICA NÃO CONFIÁVEL. Entrando em Modo de Segurança (Contenção Ativa).");
                        _isThrottlingTriggered = true;
                    }
                    return;
                }

                float throttleLimit = temperature.Value;

                if (throttleLimit < 100)
                {
                    if (!_isThrottlingTriggered)
                    {
                        _logger.LogWarning($"[Thermal] Alerta Térmico: Limite detectado em {throttleLimit}%. Reduzindo carga.");
                        _isThrottlingTriggered = true;
                    }
                    // IMPLEMENTADO: Ações corretivas quando throttling térmico é detectado
                    ApplyThermalCorrectiveActions();
                }
                else
                {
                    if (_isThrottlingTriggered)
                    {
                        _logger.LogInfo("[Thermal] Temperatura normalizada. Saindo do modo de contenção.");
                    }
                    _isThrottlingTriggered = false;
                }
            }
            catch { }
        }

        /// <summary>
        /// IMPLEMENTADO: Ações corretivas reais quando throttling térmico é detectado.
        /// Reduz carga de processos background para permitir que o sistema resfrie.
        /// </summary>
        private void ApplyThermalCorrectiveActions()
        {
            // Cooldown de 10 segundos entre ações corretivas
            if ((DateTime.Now - _lastCorrectiveAction).TotalSeconds < 10) return;

            try
            {
                // 1. Habilitar EcoQoS (Power Throttling) em processos background pesados
                var processes = Process.GetProcesses();
                int throttledCount = 0;
                IntPtr fgWindow = GetForegroundWindow();
                GetWindowThreadProcessId(fgWindow, out uint fgPid);

                foreach (var p in processes)
                {
                    try
                    {
                        if (p.HasExited) continue;
                        if (p.Id == (int)fgPid) continue;
                        if (p.ProcessName.Equals("explorer", StringComparison.OrdinalIgnoreCase)) continue;
                        if (p.ProcessName.Equals("dwm", StringComparison.OrdinalIgnoreCase)) continue;

                        // Só throttlar processos com uso significativo de CPU (working set > 100MB como proxy)
                        if (p.WorkingSet64 > 100 * 1024 * 1024)
                        {
                            IntPtr hProcess = OpenProcess(0x0200 | 0x0400, false, p.Id);
                            if (hProcess != IntPtr.Zero)
                            {
                                try
                                {
                                    var state = new PROCESS_POWER_THROTTLING_STATE
                                    {
                                        Version = 1,
                                        ControlMask = 0x01,
                                        StateMask = 0x01 // Enable EcoQoS
                                    };
                                    SetProcessInformation(hProcess, 4, ref state, Marshal.SizeOf(state));
                                    throttledCount++;
                                }
                                finally { CloseHandle(hProcess); }
                            }
                        }
                    }
                    catch { }
                    finally
                    {
                        try { p.Dispose(); } catch { }
                    }
                }

                if (throttledCount > 0)
                    _logger.LogInfo($"[Thermal] Ação corretiva: {throttledCount} processos background em EcoQoS para reduzir carga térmica.");

                _lastCorrectiveAction = DateTime.Now;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[Thermal] Erro na ação corretiva: {ex.Message}");
            }
        }

        private float? GetTemperatureFromPrimarySource()
        {
            try { return _thermalThrottlingCounter?.NextValue(); } catch { return null; }
        }

        private float? GetTemperatureFromWmiFallback()
        {
            try
            {
                using (var searcher = new ManagementObjectSearcher(@"root\WMI", "SELECT * FROM MSAcpi_ThermalZoneTemperature"))
                {
                    foreach (ManagementObject obj in searcher.Get())
                    {
                        double tempDK = Convert.ToDouble(obj["CurrentTemperature"]);
                        double tempC = (tempDK - 2732) / 10.0;
                        
                        // Se estiver acima de 85C, consideramos throttling iminente
                        return tempC > 85 ? 50f : 100f;
                    }
                }
            }
            catch { }
            return null;
        }

        [DllImport("user32.dll")] private static extern IntPtr GetForegroundWindow();
        [DllImport("user32.dll")] private static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);
        [DllImport("kernel32.dll")] private static extern IntPtr OpenProcess(uint access, bool inherit, int pid);
        [DllImport("kernel32.dll")] private static extern bool CloseHandle(IntPtr h);
        [DllImport("kernel32.dll")] private static extern bool SetProcessInformation(IntPtr hProcess, int infoClass, ref PROCESS_POWER_THROTTLING_STATE info, int size);

        [StructLayout(LayoutKind.Sequential)]
        private struct PROCESS_POWER_THROTTLING_STATE { public uint Version; public uint ControlMask; public uint StateMask; }

        public void Dispose()
        {
            _thermalThrottlingCounter?.Dispose();
        }
    }
}
