using System;
using System.IO;
using System.Management;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Utils;

namespace VoltrisOptimizer.Core.SystemIntelligenceProfiler
{
    public class AuditCollector : IAuditCollector
    {
        public async Task<AuditData> CollectAsync(CancellationToken ct)
        {
            var data = new AuditData();
            var startTime = DateTime.UtcNow;

            // Timeout global de 12s — suficiente para todas as tarefas paralelas
            using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
            cts.CancelAfter(TimeSpan.FromSeconds(12));

            try
            {
                try { App.LoggingService?.LogInfo("[AuditCollector] Iniciando coleta paralela"); } catch { }

                // ── Grupo 1: tarefas WMI independentes — rodam em paralelo ──────────
                var tCpu = Task.Run(() =>
                {
                    try
                    {
                        data.Cpu.Model = SystemInfoService.GetProcessorName();
                        data.Cpu.LogicalCores = Environment.ProcessorCount;
                        CollectCpuDetails(data);
                    }
                    catch (Exception ex) { try { App.LoggingService?.LogError("[AuditCollector] CPU: " + ex.Message, ex); } catch { } }
                }, cts.Token);

                var tRam = Task.Run(() =>
                {
                    try
                    {
                        data.Ram.TotalMb    = (long)(SystemInfoService.GetTotalRAMBytes()     / (1024 * 1024));
                        data.Ram.AvailableMb = (long)(SystemInfoService.GetAvailableRAMBytes() / (1024 * 1024));
                        data.Ram.SpeedMhz   = GetRamSpeedMhz();
                        data.Ram.SwapUsageMb = GetSwapUsageMb();
                        data.Ram.Type       = InferRamType(data.Ram.SpeedMhz);
                    }
                    catch (Exception ex) { try { App.LoggingService?.LogError("[AuditCollector] RAM: " + ex.Message, ex); } catch { } }
                }, cts.Token);

                var tGpu = Task.Run(() =>
                {
                    try { CollectGpuDetails(data); }
                    catch (Exception ex) { try { App.LoggingService?.LogError("[AuditCollector] GPU: " + ex.Message, ex); } catch { } }
                }, cts.Token);

                var tStorage = Task.Run(() =>
                {
                    try { CollectStorageDetails(data); }
                    catch (Exception ex) { try { App.LoggingService?.LogError("[AuditCollector] Storage: " + ex.Message, ex); } catch { } }
                }, cts.Token);

                var tNic = Task.Run(() =>
                {
                    try { CollectNicDetails(data); }
                    catch (Exception ex) { try { App.LoggingService?.LogError("[AuditCollector] NIC: " + ex.Message, ex); } catch { } }
                }, cts.Token);

                var tDisplay = Task.Run(() =>
                {
                    try { CollectDisplayDetails(data); }
                    catch (Exception ex) { try { App.LoggingService?.LogError("[AuditCollector] Display: " + ex.Message, ex); } catch { } }
                }, cts.Token);

                var tBattery = Task.Run(() =>
                {
                    try
                    {
                        data.Battery.Present                 = DetectBattery();
                        data.Battery.EstimatedChargePercent  = GetBatteryPercent();
                        data.Battery.Status                  = GetBatteryStatus();
                    }
                    catch (Exception ex) { try { App.LoggingService?.LogError("[AuditCollector] Battery: " + ex.Message, ex); } catch { } }
                }, cts.Token);

                var tWindows = Task.Run(() =>
                {
                    try
                    {
                        data.Windows.Version = SystemInfoService.GetOSVersion();
                        data.Windows.Build   = GetWindowsBuild();
                        data.Windows.IsAdmin = AdminHelper.IsRunningAsAdministrator();
                    }
                    catch (Exception ex) { try { App.LoggingService?.LogError("[AuditCollector] Windows: " + ex.Message, ex); } catch { } }
                }, cts.Token);

                // DPC: usa PerformanceCounter com Sleep — reduzido para 200ms e em paralelo
                var tDpc = Task.Run(() =>
                {
                    try { data.DpcLatency = SampleDpcLatency(); }
                    catch (Exception ex) { try { App.LoggingService?.LogError("[AuditCollector] DPC: " + ex.Message, ex); } catch { } }
                }, cts.Token);

                // PowerPlan via registro (rápido) — não precisa de cmd.exe
                var tPower = Task.Run(() =>
                {
                    try
                    {
                        data.CurrentPowerPlan            = GetActivePowerPlanFast();
                        data.SupportsHighPerformancePlan = PerformanceOptimizer.HasHighPerformancePlan();
                    }
                    catch (Exception ex) { try { App.LoggingService?.LogError("[AuditCollector] PowerPlan: " + ex.Message, ex); } catch { } }
                }, cts.Token);

                var tThermal = Task.Run(() =>
                {
                    try
                    {
                        data.CpuTemp = GetCpuTemperature();
                        data.GpuTemp = GetGpuTemperature();
                        data.IsThermalThrottling = data.CpuTemp > 95 || data.GpuTemp > 90;
                    }
                    catch (Exception ex) { try { App.LoggingService?.LogError("[AuditCollector] Thermal: " + ex.Message, ex); } catch { } }
                }, cts.Token);

                // Aguardar todas em paralelo — o tempo total é o da tarefa mais lenta, não a soma
                await Task.WhenAll(tCpu, tRam, tGpu, tStorage, tNic, tDisplay, tBattery, tWindows, tDpc, tPower, tThermal)
                          .ConfigureAwait(false);

                // ClassifyEnvironment depende dos dados coletados acima — executa depois
                try { ClassifyEnvironment(data); }
                catch (Exception ex) { try { App.LoggingService?.LogError("[AuditCollector] Classify: " + ex.Message, ex); } catch { } }

                try { App.LoggingService?.LogSuccess($"[AuditCollector] Coleta concluída em {(DateTime.UtcNow - startTime).TotalSeconds:F1}s. Tier: {data.PerfTier} | Thermal: {data.ThermalStatus}"); } catch { }
            }
            catch (OperationCanceledException)
            {
                try { App.LoggingService?.LogWarning("[AuditCollector] Coleta cancelada/timeout"); } catch { }
            }
            catch (Exception ex)
            {
                try { App.LoggingService?.LogError("[AuditCollector] Erro fatal: " + ex.Message, ex); } catch { }
                throw;
            }

            return data;
        }

        /// <summary>
        /// Lê o plano de energia ativo diretamente do registro — sem spawnar cmd.exe/powercfg.
        /// </summary>
        private static string GetActivePowerPlanFast()
        {
            try
            {
                using var key = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(
                    @"SYSTEM\CurrentControlSet\Control\Power\User\PowerSchemes", false);
                return key?.GetValue("ActivePowerScheme")?.ToString() ?? "";
            }
            catch { return ""; }
        }
        
        // Adicionar logs no construtor para verificar se há erro na inicialização
        public AuditCollector()
        {
            try
            {
                App.LoggingService?.LogInfo("[AuditCollector] Construtor chamado");
            }
            catch (Exception ex)
            {
                // Ignorar erros no construtor pois o logging service pode não estar disponível ainda
            }
        }
        
        private static void CollectCpuDetails(AuditData data)
        {
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed FROM Win32_Processor");
                searcher.Options.Timeout = TimeSpan.FromSeconds(10); // Timeout de 10 segundos
                
                foreach (ManagementObject obj in searcher.Get())
                {
                    data.Cpu.PhysicalCores = Convert.ToInt32(obj["NumberOfCores"] ?? 0);
                    data.Cpu.LogicalCores = Convert.ToInt32(obj["NumberOfLogicalProcessors"] ?? Environment.ProcessorCount);
                    data.Cpu.MaxFrequencyMhz = Convert.ToDouble(obj["MaxClockSpeed"] ?? 0);
                    break; // Processar apenas o primeiro processador
                }
            }
            catch (Exception ex) { try { App.LoggingService?.LogError("[AuditCollector] CPU detalhes: " + ex.Message, ex); } catch { } }

            try
            {
                data.Cpu.HyperThreading = data.Cpu.LogicalCores > data.Cpu.PhysicalCores;
            }
            catch (Exception ex) { try { App.LoggingService?.LogError("[AuditCollector] CPU recursos: " + ex.Message, ex); } catch { } }


        }

        private static int GetRamSpeedMhz()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT Speed FROM Win32_PhysicalMemory");
                searcher.Options.Timeout = TimeSpan.FromSeconds(10); // Timeout de 10 segundos
                
                int max = 0;
                foreach (ManagementObject obj in searcher.Get())
                {
                    int spd = Convert.ToInt32(obj["Speed"] ?? 0);
                    if (spd > max) max = spd;
                }
                return max;
            }
            catch (Exception ex) { try { App.LoggingService?.LogError("[AuditCollector] RAM velocidade: " + ex.Message, ex); } catch { } return 0; }
        }

        private static string InferRamType(int speedMhz)
        {
            if (speedMhz == 0) return "Unknown";
            if (speedMhz >= 4800) return "DDR5";
            if (speedMhz >= 2133) return "DDR4";
            if (speedMhz >= 800) return "DDR3";
            return "DDR2/Older";
        }

        private static long GetSwapUsageMb()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT AllocatedBaseSize, CurrentUsage FROM Win32_PageFileUsage");
                searcher.Options.Timeout = TimeSpan.FromSeconds(10); // Timeout de 10 segundos
                
                long usageMb = 0;
                foreach (ManagementObject obj in searcher.Get())
                {
                    usageMb += Convert.ToInt64(obj["CurrentUsage"] ?? 0);
                }
                return usageMb;
            }
            catch (Exception ex) { try { App.LoggingService?.LogError("[AuditCollector] Pagefile uso: " + ex.Message, ex); } catch { } return 0; }
        }

        private static void CollectGpuDetails(AuditData data)
        {
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT Name, AdapterRAM, DriverVersion FROM Win32_VideoController");
                searcher.Options.Timeout = TimeSpan.FromSeconds(10); // Timeout de 10 segundos
                
                foreach (ManagementObject obj in searcher.Get())
                {
                    var name = (obj["Name"]?.ToString() ?? "").Trim();
                    var ramBytes = Convert.ToInt64(obj["AdapterRAM"] ?? 0);
                    data.Gpu.Model = name;
                    data.Gpu.VramMb = (long)(ramBytes / (1024 * 1024));
                    data.Gpu.DriverVersion = obj["DriverVersion"]?.ToString() ?? "";
                    var lower = name.ToLowerInvariant();
                    data.Gpu.Vendor = lower.Contains("nvidia") ? "NVIDIA" : lower.Contains("amd") || lower.Contains("radeon") ? "AMD" : lower.Contains("intel") ? "Intel" : "Unknown";
                    data.Gpu.IsIntegrated = data.Gpu.Vendor == "Intel" || lower.Contains("intel");
                    break; // Processar apenas a primeira GPU
                }
            }
            catch (Exception ex) { try { App.LoggingService?.LogError("[AuditCollector] GPU detalhes: " + ex.Message, ex); } catch { } }

            // HAGS
            try
            {
                using var key = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows\Dwm", false);
                var val = key?.GetValue("HwSchMode");
                data.Gpu.HagsSupported = val != null && data.Windows.Build >= 19041;
            }
            catch (Exception ex) 
            { 
                data.Gpu.HagsSupported = false; 
                try { App.LoggingService?.LogError("[AuditCollector] GPU HAGS: " + ex.Message, ex); } catch { } 
            }


        }

        private static void CollectStorageDetails(AuditData data)
        {
            try
            {
                data.Storage.FreeSpaceMb = SystemInfoService.GetFreeDiskSpaceBytes() / (1024 * 1024);
                data.Storage.TotalSpaceMb = SystemInfoService.GetTotalDiskSpaceBytes() / (1024 * 1024);
                
                // Adicionar timeout para consultas WMI
                using var searcher = new ManagementObjectSearcher("SELECT Model, MediaType, InterfaceType FROM Win32_DiskDrive");
                searcher.Options.Timeout = TimeSpan.FromSeconds(10); // Timeout de 10 segundos
                
                foreach (ManagementObject obj in searcher.Get())
                {
                    var model = obj["Model"]?.ToString() ?? "";
                    var media = obj["MediaType"]?.ToString() ?? "";
                    var iface = obj["InterfaceType"]?.ToString() ?? "";
                    data.Storage.SystemDiskModel = model;
                    var m = (model + " " + media + " " + iface).ToLowerInvariant();
                    if (m.Contains("nvme")) data.Storage.SystemDiskType = "NVMe";
                    else if (m.Contains("ssd")) data.Storage.SystemDiskType = "SSD";
                    else data.Storage.SystemDiskType = "HDD";
                    break;
                }
            }
            catch (Exception ex) { try { App.LoggingService?.LogError("[AuditCollector] Storage detalhes: " + ex.Message, ex); } catch { } }

            // SMART status
            try
            {
                using var searcher = new ManagementObjectSearcher(@"root\WMI", "SELECT PredictFailure FROM MSStorageDriver_FailurePredictStatus");
                searcher.Options.Timeout = TimeSpan.FromSeconds(10); // Timeout de 10 segundos
                
                foreach (ManagementObject obj in searcher.Get())
                {
                    var predict = Convert.ToInt32(obj["PredictFailure"] ?? 0);
                    data.Storage.SmartOk = predict == 0;
                    break;
                }
            }
            catch (ManagementException ex) when (ex.Message.Contains("Acesso negado"))
            {
                data.Storage.SmartOk = true; 
                App.LoggingService?.LogWarning("[AuditCollector] Storage SMART: Acesso negado (requer privilégios de Admin)");
            }
            catch (Exception ex) 
            { 
                data.Storage.SmartOk = true; 
                App.LoggingService?.LogWarning("[AuditCollector] Storage SMART Indisponível: " + ex.Message);
            }
        }

        private static void CollectNicDetails(AuditData data)
        {
            try
            {
                // Adicionar timeout para consulta WMI
                using var searcher = new ManagementObjectSearcher("SELECT Name, Manufacturer FROM Win32_NetworkAdapter WHERE NetEnabled = TRUE");
                searcher.Options.Timeout = TimeSpan.FromSeconds(10); // Timeout de 10 segundos
                
                foreach (ManagementObject obj in searcher.Get())
                {
                    data.Nic.Vendor = obj["Manufacturer"]?.ToString() ?? obj["Name"]?.ToString() ?? "";
                    break;
                }
            }
            catch (Exception ex) { try { App.LoggingService?.LogError("[AuditCollector] NIC detalhes: " + ex.Message, ex); } catch { } }
            
            // Capabilities (heurística via netsh) com timeout
            try
            {
                var output = RunCommand("netsh int tcp show global");
                if (!string.IsNullOrEmpty(output))
                {
                    data.Nic.SupportsRss = output.IndexOf("Receive-Side Scaling State", StringComparison.OrdinalIgnoreCase) >= 0 && output.IndexOf("enabled", StringComparison.OrdinalIgnoreCase) >= 0;
                }
            }
            catch (Exception ex) 
            { 
                try { App.LoggingService?.LogError("[AuditCollector] NIC capacidades: " + ex.Message, ex); } catch { } 
            }
        }
        internal static string RunCommand(string cmd)
        {
            try
            {
                var psi = new System.Diagnostics.ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    Arguments = "/c " + cmd,
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true,
                    WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden
                };
                using var p = System.Diagnostics.Process.Start(psi);
                if (p == null) return "";
                
                // Adicionar timeout de 10 segundos para o comando
                if (p.WaitForExit(10000)) // 10 segundos
                {
                    var s = p.StandardOutput.ReadToEnd();
                    return s;
                }
                else
                {
                    // Timeout - matar o processo
                    try { p.Kill(); } catch { }
                    try { App.LoggingService?.LogWarning($"[AuditCollector] Comando excedeu timeout: {cmd}"); } catch { }
                    return "";
                }
            }
            catch (Exception ex) 
            { 
                try { App.LoggingService?.LogError($"[AuditCollector] Erro ao executar comando: {cmd} - {ex.Message}"); } catch { }
                return ""; 
            }
        }
        private static bool DetectBattery()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_Battery");
                searcher.Options.Timeout = TimeSpan.FromSeconds(10); // Timeout de 10 segundos
                
                using var results = searcher.Get();
                foreach (var _ in results) { return true; }
            }
            catch (Exception ex) { try { App.LoggingService?.LogError("[AuditCollector] Bateria detectar: " + ex.Message, ex); } catch { } }
            return false;
        }

        private static int GetBatteryPercent()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT EstimatedChargeRemaining FROM Win32_Battery");
                searcher.Options.Timeout = TimeSpan.FromSeconds(10); // Timeout de 10 segundos
                
                foreach (ManagementObject obj in searcher.Get())
                {
                    return Convert.ToInt32(obj["EstimatedChargeRemaining"] ?? 0);
                }
            }
            catch (Exception ex) { try { App.LoggingService?.LogError("[AuditCollector] Bateria porcentagem: " + ex.Message, ex); } catch { } }
            return 0;
        }

        private static string GetBatteryStatus()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT BatteryStatus FROM Win32_Battery");
                searcher.Options.Timeout = TimeSpan.FromSeconds(10); // Timeout de 10 segundos
                
                foreach (ManagementObject obj in searcher.Get())
                {
                    var v = Convert.ToInt32(obj["BatteryStatus"] ?? 0);
                    return v switch { 1 => "Desconhecido", 2 => "Carregando", 3 => "Descarregando", 4 => "Não carregando", _ => "" };
                }
            }
            catch (Exception ex) { try { App.LoggingService?.LogError("[AuditCollector] Bateria status: " + ex.Message, ex); } catch { } }
            return "";
        }

        private static int GetWindowsBuild()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT BuildNumber FROM Win32_OperatingSystem");
                searcher.Options.Timeout = TimeSpan.FromSeconds(10); // Timeout de 10 segundos
                
                foreach (ManagementObject obj in searcher.Get())
                {
                    return int.TryParse(obj["BuildNumber"]?.ToString(), out var bn) ? bn : 0;
                }
            }
            catch (Exception ex) { try { App.LoggingService?.LogError("[AuditCollector] Windows build: " + ex.Message, ex); } catch { } }
            return 0;
        }

        private static bool GetSecureBoot()
        {
            try
            {
                using var key = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\SecureBoot\State", false);
                var v = key?.GetValue("UEFISecureBootEnabled");
                return Convert.ToInt32(v ?? 0) == 1;
            }
            catch (Exception ex) 
            { 
                try { App.LoggingService?.LogError("[AuditCollector] SecureBoot: " + ex.Message, ex); } catch { } 
                return false; 
            }
        }

        private static bool GetDriverSigningPolicy()
        {
            try
            {
                using var key = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Session Manager\Kernel", false);
                var v = key?.GetValue("DisableExceptionChainValidation");
                return Convert.ToInt32(v ?? 0) == 0; // true => enforcement
            }
            catch (Exception ex) 
            { 
                try { App.LoggingService?.LogError("[AuditCollector] Driver signing: " + ex.Message, ex); } catch { } 
                return true; 
            }
        }

        private static bool IsHyperVActive()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT HypervisorPresent FROM Win32_ComputerSystem");
                searcher.Options.Timeout = TimeSpan.FromSeconds(10); // Timeout de 10 segundos
                
                foreach (ManagementObject obj in searcher.Get())
                {
                    return Convert.ToBoolean(obj["HypervisorPresent"] ?? false);
                }
            }
            catch (Exception ex) { try { App.LoggingService?.LogError("[AuditCollector] Hyper-V: " + ex.Message, ex); } catch { } }
            return false;
        }

        private static bool IsWslInstalled()
        {
            try
            {
                using var key = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Lxss", false);
                return key != null;
            }
            catch (Exception ex) 
            { 
                try { App.LoggingService?.LogError("[AuditCollector] WSL: " + ex.Message, ex); } catch { } 
                return false; 
            }
        }

        private static DpcLatencyInfo SampleDpcLatency()
        {
            var info = new DpcLatencyInfo();
            try
            {
                using var dpc  = new System.Diagnostics.PerformanceCounter("Processor Information", "DPC Rate", "_Total");
                using var ints = new System.Diagnostics.PerformanceCounter("Processor", "Interrupts/sec", "_Total");
                dpc.NextValue(); ints.NextValue();
                // 200ms é suficiente para uma leitura estável — já roda em paralelo com as outras tarefas
                System.Threading.Thread.Sleep(200);
                info.DpcRate          = dpc.NextValue();
                info.InterruptsPerSec = ints.NextValue();
            }
            catch (Exception ex)
            {
                try { App.LoggingService?.LogWarning($"[AuditCollector] DPC Latency: {ex.Message}"); } catch { }
                info.DpcRate = 0; info.InterruptsPerSec = 0;
            }
            return info;
        }

        private static string GetActivePowerPlan()
        {
            try
            {
                var s = RunCommand("powercfg /GETACTIVESCHEME");
                return s.Trim();
            }
            catch (Exception ex)
            {
                try { App.LoggingService?.LogWarning($"[AuditCollector] Erro ao obter plano de energia: {ex.Message}"); } catch { }
                return "";
            }
        }

        private static int CountStartupApps()
        {
            int count = 0;
            try
            {
                using var k1 = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Run", false);
                using var k2 = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Run", false);
                count += k1?.ValueCount ?? 0;
                count += k2?.ValueCount ?? 0;
            }
            catch (Exception ex)
            {
                try { App.LoggingService?.LogError($"[AuditCollector] Erro ao contar apps de startup: {ex.Message}"); } catch { }
            }
            return count;
        }

        private static int GetRunningServicesCount()
        {
            try
            {
                // Limitar o número de serviços para evitar travamentos
                var services = System.ServiceProcess.ServiceController.GetServices();
                return Math.Min(services.Length, 1000); // Limitar a 1000 serviços
            }
            catch (Exception ex) 
            { 
                try { App.LoggingService?.LogError($"[AuditCollector] Erro ao contar serviços: {ex.Message}"); } catch { }
                return 0; 
            }
        }
        private static double GetCpuTemperature()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher(@"root\WMI", "SELECT CurrentTemperature FROM MSAcpi_ThermalZoneTemperature");
                searcher.Options.Timeout = TimeSpan.FromSeconds(5);
                foreach (ManagementObject obj in searcher.Get())
                {
                    double temp = Convert.ToDouble(obj["CurrentTemperature"]);
                    return (temp - 2732) / 10.0; // Kelvin to Celsius
                }
            }
            catch { } // Silently fail fallback
            return 0.0;
        }

        private static double GetGpuTemperature()
        {
            // Placeholder: Getting accurate GPU temp without heavy libraries (like NVAPI/ADL) is hard in pure WMI.
            // Would require proprietary calls. Returning 0 to be safe unless we integrate a hardware lib later.
            return 0.0; 
        }

        private static void CollectDisplayDetails(AuditData data)
        {
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT CurrentRefreshRate, CurrentHorizontalResolution, CurrentVerticalResolution FROM Win32_VideoController");
                searcher.Options.Timeout = TimeSpan.FromSeconds(5);
                foreach (ManagementObject obj in searcher.Get())
                {
                    data.Display.RefreshRateHz = Convert.ToInt32(obj["CurrentRefreshRate"] ?? 60);
                    var h = obj["CurrentHorizontalResolution"]?.ToString() ?? "0";
                    var v = obj["CurrentVerticalResolution"]?.ToString() ?? "0";
                    data.Display.Resolution = $"{h}x{v}";
                    break; // Primary usually first
                }
            }
            catch { data.Display.RefreshRateHz = 60; }
        }

        private static void ClassifyEnvironment(AuditData data)
        {
            // 1. PERFORMANCE TIER
            bool weakCpu = data.Cpu.PhysicalCores < 4;
            bool lowRam = data.Ram.TotalMb < 8192;
            bool slowDisk = data.Storage.SystemDiskType == "HDD";

            if (weakCpu || lowRam || slowDisk)
                data.PerfTier = PerformanceTier.LowEnd;
            else if (data.Cpu.PhysicalCores >= 8 && data.Ram.TotalMb >= 32000 && data.Gpu.VramMb >= 8000)
                data.PerfTier = PerformanceTier.Workstation;
            else if (data.Cpu.PhysicalCores >= 6 && data.Ram.TotalMb >= 16000 && data.Gpu.VramMb >= 6000)
                data.PerfTier = PerformanceTier.HighEnd;
            else
                data.PerfTier = PerformanceTier.MidRange;

            // 2. THERMAL TIER
            if (data.CpuTemp > 90 || data.GpuTemp > 90 || data.IsThermalThrottling)
                data.ThermalStatus = ThermalTier.Critical;
            else if (data.CpuTemp > 80 || data.GpuTemp > 80)
                data.ThermalStatus = ThermalTier.Warm;
            else
                data.ThermalStatus = ThermalTier.Stable;
        }
    }
}
