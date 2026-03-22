using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Management;
using System.Net.NetworkInformation;
using System.Threading.Tasks;
using VoltrisOptimizer.Interfaces;
using System.Runtime.Versioning;

namespace VoltrisOptimizer.Services
{
    public class SystemInfoServiceImpl : ISystemInfoService
    {
        private HardwareCapabilities? _cachedCapabilities;
        private DateTime _lastCacheUpdate = DateTime.MinValue;
        private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(5);
        private readonly VoltrisOptimizer.Services.ILoggingService? _logger;

        public SystemInfoServiceImpl(VoltrisOptimizer.Services.ILoggingService? logger = null)
        {
            _logger = logger;
        }

        [System.Runtime.InteropServices.DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool GetSystemPowerStatus(out SYSTEM_POWER_STATUS lpSystemPowerStatus);

        public struct SYSTEM_POWER_STATUS
        {
            public byte ACLineStatus;
            public byte BatteryFlag;
            public byte BatteryLifePercent;
            public byte SystemStatusFlag;
            public uint BatteryLifeTime;
            public uint BatteryFullLifeTime;
        }

        public async Task<CpuInfo> GetCpuInfoAsync()
        {
            if (_cachedCapabilities != null && DateTime.Now - _lastCacheUpdate < CacheDuration)
                return _cachedCapabilities.Cpu;

            return await Task.Run(() =>
            {
                var cpuInfo = new CpuInfo();
                
                try
                {
                    using (var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_Processor"))
                    {
                        foreach (ManagementObject obj in searcher.Get())
                        {
                            cpuInfo.Name = obj["Name"]?.ToString() ?? "";
                            cpuInfo.CoreCount = Convert.ToInt32(obj["NumberOfCores"] ?? 0);
                            cpuInfo.ThreadCount = Convert.ToInt32(obj["ThreadCount"] ?? 0);
                            
                            // Detecção aprimorada de CPU híbrida
                            var name = cpuInfo.Name.ToUpperInvariant();
                            cpuInfo.IsHybrid = (cpuInfo.ThreadCount > cpuInfo.CoreCount) || 
                                              (name.Contains("INTEL") && (name.Contains("12") || name.Contains("13") || name.Contains("14")));
                            
                            cpuInfo.Architecture = Environment.Is64BitOperatingSystem ? "x64" : "x86";
                            cpuInfo.MaxClockSpeedMHz = Convert.ToDouble(obj["MaxClockSpeed"] ?? 0);
                            cpuInfo.CurrentClockSpeedMHz = Convert.ToDouble(obj["CurrentClockSpeed"] ?? 0);
                            
                            break;
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger?.LogError("Erro ao obter CPU info", ex);
                    cpuInfo.Name = "Processador Desconhecido";
                    cpuInfo.CoreCount = Environment.ProcessorCount;
                    cpuInfo.ThreadCount = Environment.ProcessorCount;
                    cpuInfo.Architecture = Environment.Is64BitOperatingSystem ? "x64" : "x86";
                }
                
                return cpuInfo;
            });
        }

        public async Task<GpuInfo> GetGpuInfoAsync()
        {
            return await Task.Run(() =>
            {
                var gpuInfo = new GpuInfo();
                
                try
                {
                    using (var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_VideoController"))
                    {
                        foreach (ManagementObject obj in searcher.Get())
                        {
                            gpuInfo.Name = obj["Name"]?.ToString() ?? "";
                            gpuInfo.DriverVersion = obj["DriverVersion"]?.ToString() ?? "";
                            gpuInfo.Vendor = obj["AdapterCompatibility"]?.ToString() ?? "";
                            gpuInfo.VideoMemoryBytes = Convert.ToInt64(obj["AdapterRAM"] ?? 0);
                            gpuInfo.IsDiscrete = !gpuInfo.Name.Contains("Intel", StringComparison.OrdinalIgnoreCase) || 
                                                gpuInfo.VideoMemoryBytes > 512 * 1024 * 1024;
                            
                            gpuInfo.SupportsHags = false;
                            gpuInfo.SupportsVrr = false;
                            
                            if (!string.IsNullOrEmpty(gpuInfo.Name) && !gpuInfo.Name.Contains("Basic", StringComparison.OrdinalIgnoreCase))
                                break;
                        }
                    }
                }
                catch
                {
                    gpuInfo.Name = "Placa Gráfica Desconhecida";
                    gpuInfo.Vendor = "Desconhecido";
                }
                
                return gpuInfo;
            });
        }

        public async Task<GpuInfo[]> GetAllGpusAsync()
        {
            return await Task.Run(() =>
            {
                var gpus = new List<GpuInfo>();
                
                try
                {
                    using (var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_VideoController"))
                    {
                        foreach (ManagementObject obj in searcher.Get())
                        {
                            var gpuInfo = new GpuInfo
                            {
                                Name = obj["Name"]?.ToString() ?? "",
                                DriverVersion = obj["DriverVersion"]?.ToString() ?? "",
                                Vendor = obj["AdapterCompatibility"]?.ToString() ?? "",
                                VideoMemoryBytes = Convert.ToInt64(obj["AdapterRAM"] ?? 0)
                            };
                            
                            gpuInfo.IsDiscrete = !gpuInfo.Name.Contains("Intel", StringComparison.OrdinalIgnoreCase) || 
                                                gpuInfo.VideoMemoryBytes > 512 * 1024 * 1024;
                            
                            gpuInfo.SupportsHags = false;
                            gpuInfo.SupportsVrr = false;
                            
                            if (!string.IsNullOrEmpty(gpuInfo.Name) && !gpuInfo.Name.Contains("Basic", StringComparison.OrdinalIgnoreCase))
                                gpus.Add(gpuInfo);
                        }
                    }
                }
                catch
                {
                    gpus.Add(new GpuInfo
                    {
                        Name = "Placa Gráfica Desconhecida",
                        Vendor = "Desconhecido"
                    });
                }
                
                return gpus.ToArray();
            });
        }

        public async Task<RamInfo> GetRamInfoAsync()
        {
            return await Task.Run(() =>
            {
                var ramInfo = new RamInfo();
                
                try
                {
                    using (var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_ComputerSystem"))
                    {
                        foreach (ManagementObject obj in searcher.Get())
                        {
                            ramInfo.TotalBytes = Convert.ToInt64(obj["TotalPhysicalMemory"] ?? 0);
                            break;
                        }
                    }
                    
                    using (var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_PerfRawData_PerfOS_Memory"))
                    {
                        foreach (ManagementObject obj in searcher.Get())
                        {
                            var availableKb = Convert.ToInt64(obj["AvailableBytes"] ?? 0);
                            ramInfo.AvailableBytes = availableKb;
                            break;
                        }
                    }

                    // Buscar velocidade e tipo da memória via Win32_PhysicalMemory
                    using (var searcher = new ManagementObjectSearcher("SELECT Speed, ConfiguredClockSpeed, SMBIOSMemoryType FROM Win32_PhysicalMemory"))
                    {
                        foreach (ManagementObject obj in searcher.Get())
                        {
                            // ConfiguredClockSpeed é mais preciso que Speed (velocidade real configurada)
                            int configuredSpeed = Convert.ToInt32(obj["ConfiguredClockSpeed"] ?? 0);
                            int speed = Convert.ToInt32(obj["Speed"] ?? 0);
                            ramInfo.SpeedMHz = configuredSpeed > 0 ? configuredSpeed : speed;

                            int smbiosType = Convert.ToInt32(obj["SMBIOSMemoryType"] ?? 0);
                            ramInfo.MemoryType = smbiosType switch
                            {
                                34 => "DDR5",
                                26 => "DDR4",
                                24 => "DDR3",
                                22 => "DDR2",
                                _ => "DDR4"
                            };
                            break; // Pegar do primeiro módulo (todos devem ser iguais)
                        }
                    }
                }
                catch
                {
                    ramInfo.TotalBytes = 0;
                    ramInfo.AvailableBytes = 0;
                }
                
                return ramInfo;
            });
        }

        public async Task<VoltrisOptimizer.Interfaces.DriveInfo[]> GetDrivesInfoAsync()
        {
            return await Task.Run(() =>
            {
                var drives = new List<VoltrisOptimizer.Interfaces.DriveInfo>();
                
                try
                {
                    // Pré-carregar mapa de letra de drive → modelo do disco físico
                    var driveModelMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);
                    try
                    {
                        using var diskSearcher = new ManagementObjectSearcher("SELECT DeviceID, Model FROM Win32_DiskDrive");
                        foreach (ManagementObject disk in diskSearcher.Get())
                        {
                            string deviceId = disk["DeviceID"]?.ToString() ?? "";
                            string model = (disk["Model"]?.ToString() ?? "").Trim();

                            using var partSearcher = new ManagementObjectSearcher(
                                $"ASSOCIATORS OF {{Win32_DiskDrive.DeviceID='{deviceId}'}} WHERE AssocClass=Win32_DiskDriveToDiskPartition");
                            foreach (ManagementObject partition in partSearcher.Get())
                            {
                                using var logicalSearcher = new ManagementObjectSearcher(
                                    $"ASSOCIATORS OF {{Win32_DiskPartition.DeviceID='{partition["DeviceID"]}'}} WHERE AssocClass=Win32_LogicalDiskToPartition");
                                foreach (ManagementObject logical in logicalSearcher.Get())
                                {
                                    string logicalName = logical["Name"]?.ToString()?.TrimEnd('\\', ':') ?? "";
                                    if (!string.IsNullOrEmpty(logicalName) && !string.IsNullOrEmpty(model))
                                        driveModelMap[logicalName] = model;
                                }
                            }
                        }
                    }
                    catch { }

                    foreach (var drive in System.IO.DriveInfo.GetDrives())
                    {
                        if (drive.IsReady)
                        {
                            string letterClean = drive.Name.TrimEnd('\\', ':');
                            driveModelMap.TryGetValue(letterClean, out string? model);

                            var driveInfo = new VoltrisOptimizer.Interfaces.DriveInfo
                            {
                                Letter = drive.Name,
                                Label = drive.VolumeLabel,
                                TotalBytes = drive.TotalSize,
                                FreeBytes = drive.AvailableFreeSpace,
                                FileSystem = drive.DriveFormat,
                                IsSsd = IsDriveSSD(drive.Name),
                                Model = model ?? ""
                            };
                            
                            drives.Add(driveInfo);
                        }
                    }
                }
                catch
                {
                }
                
                return drives.ToArray();
            });
        }

        public async Task<NetworkInfo[]> GetNetworkInfoAsync()
        {
            return await Task.Run(() =>
            {
                var networks = new List<NetworkInfo>();
                
                try
                {
                    foreach (var adapter in NetworkInterface.GetAllNetworkInterfaces())
                    {
                        if (adapter.OperationalStatus == OperationalStatus.Up)
                        {
                            var networkInfo = new NetworkInfo
                            {
                                Name = adapter.Name,
                                Manufacturer = adapter.Description,
                                MacAddress = adapter.GetPhysicalAddress().ToString(),
                                IsEnabled = adapter.OperationalStatus == OperationalStatus.Up,
                                SpeedBps = adapter.Speed
                            };
                            
                            networks.Add(networkInfo);
                        }
                    }
                }
                catch
                {
                }
                
                return networks.ToArray();
            });
        }

        public async Task<HardwareCapabilities> GetHardwareCapabilitiesAsync()
        {
            if (_cachedCapabilities != null && DateTime.Now - _lastCacheUpdate < CacheDuration)
                return _cachedCapabilities;

            var capabilities = new HardwareCapabilities();
            
            try
            {
                capabilities.Cpu = await GetCpuInfoAsync();
                capabilities.Gpu = await GetGpuInfoAsync();
                capabilities.Ram = await GetRamInfoAsync();
                capabilities.Drives = await GetDrivesInfoAsync();
                capabilities.NetworkAdapters = await GetNetworkInfoAsync();
                
                _cachedCapabilities = capabilities;
                _lastCacheUpdate = DateTime.Now;
            }
            catch
            {
            }
            
            return capabilities;
        }

        public async Task<double> GetCpuUsageAsync()
        {
            return await Task.Run(() =>
            {
                try
                {
                    using (var pc = new PerformanceCounter("Processor", "% Processor Time", "_Total"))
                    {
                        pc.NextValue();
                        System.Threading.Thread.Sleep(1000);
                        return pc.NextValue();
                    }
                }
                catch
                {
                    return 0;
                }
            });
        }

        public string GetWindowsVersion()
        {
            try
            {
                using (var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_OperatingSystem"))
                {
                    foreach (ManagementObject obj in searcher.Get())
                    {
                        string caption = obj["Caption"]?.ToString() ?? "";
                        string version = obj["Version"]?.ToString() ?? "";
                        
                        // Limpar o nome
                        caption = caption.Replace("Microsoft ", "").Trim();
                        
                        // Detectar edição específica (LTSC, Pro, Home, Enterprise, etc)
                        string edition = "";
                        
                        // Verificar se é LTSC
                        if (caption.Contains("LTSC", StringComparison.OrdinalIgnoreCase))
                        {
                            // Extrair ano do LTSC (2019, 2021, etc)
                            if (caption.Contains("2021"))
                                edition = "LTSC 2021";
                            else if (caption.Contains("2019"))
                                edition = "LTSC 2019";
                            else
                                edition = "LTSC";
                        }
                        else if (caption.Contains("Enterprise", StringComparison.OrdinalIgnoreCase))
                        {
                            edition = "Enterprise";
                        }
                        else if (caption.Contains("Pro", StringComparison.OrdinalIgnoreCase))
                        {
                            edition = "Pro";
                        }
                        else if (caption.Contains("Home", StringComparison.OrdinalIgnoreCase))
                        {
                            edition = "Home";
                        }
                        else if (caption.Contains("Education", StringComparison.OrdinalIgnoreCase))
                        {
                            edition = "Education";
                        }
                        
                        // Determinar se é Windows 10 ou 11
                        var parts = version.Split('.');
                        int build = 0;
                        if (parts.Length >= 3 && int.TryParse(parts[2], out build))
                        {
                            string windowsVersion = build >= 22000 ? "Windows 11" : "Windows 10";
                            
                            if (!string.IsNullOrEmpty(edition))
                                return $"{windowsVersion} {edition}";
                            else
                                return windowsVersion;
                        }
                        
                        // Fallback: retornar caption limpo
                        return caption;
                    }
                }
            }
            catch
            {
                return Environment.OSVersion.ToString();
            }
            return "Windows Desconhecido";
        }

        public string GetWindowsEdition()
        {
            try
            {
                using (var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_OperatingSystem"))
                {
                    foreach (ManagementObject obj in searcher.Get())
                    {
                        string caption = obj["Caption"]?.ToString() ?? "";
                        
                        // Detectar edição específica
                        if (caption.Contains("LTSC", StringComparison.OrdinalIgnoreCase))
                        {
                            if (caption.Contains("2021"))
                                return "LTSC 2021";
                            else if (caption.Contains("2019"))
                                return "LTSC 2019";
                            else
                                return "LTSC";
                        }
                        else if (caption.Contains("Enterprise", StringComparison.OrdinalIgnoreCase))
                            return "Enterprise";
                        else if (caption.Contains("Pro", StringComparison.OrdinalIgnoreCase))
                            return "Pro";
                        else if (caption.Contains("Home", StringComparison.OrdinalIgnoreCase))
                            return "Home";
                        else if (caption.Contains("Education", StringComparison.OrdinalIgnoreCase))
                            return "Education";
                        
                        return "Standard";
                    }
                }
            }
            catch { }
            return "Unknown";
        }

        public int GetWindowsBuild()
        {
            try
            {
                using (var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_OperatingSystem"))
                {
                    foreach (ManagementObject obj in searcher.Get())
                    {
                        string version = obj["Version"]?.ToString() ?? "";
                        var parts = version.Split('.');
                        if (parts.Length >= 3)
                        {
                            if (int.TryParse(parts[2], out int build))
                                return build;
                        }
                        break;
                    }
                }
            }
            catch
            {
            }
            return Environment.OSVersion.Version.Build;
        }

        public bool IsWindows11()
        {
            return GetWindowsBuild() >= 22000;
        }

        public bool Is64BitOperatingSystem()
        {
            return Environment.Is64BitOperatingSystem;
        }

        private bool IsDriveSSD(string driveLetter)
        {
            try
            {
                // Remover : e \ do drive letter
                driveLetter = driveLetter.TrimEnd('\\', ':');
                
                // Usar WMI para detectar se é SSD
                using (var searcher = new ManagementObjectSearcher($"SELECT * FROM Win32_DiskDrive"))
                {
                    foreach (ManagementObject disk in searcher.Get())
                    {
                        // Verificar se este disco contém a partição do drive
                        string deviceId = disk["DeviceID"]?.ToString() ?? "";
                        
                        using (var partitionSearcher = new ManagementObjectSearcher(
                            $"ASSOCIATORS OF {{Win32_DiskDrive.DeviceID='{deviceId}'}} WHERE AssocClass=Win32_DiskDriveToDiskPartition"))
                        {
                            foreach (ManagementObject partition in partitionSearcher.Get())
                            {
                                using (var logicalSearcher = new ManagementObjectSearcher(
                                    $"ASSOCIATORS OF {{Win32_DiskPartition.DeviceID='{partition["DeviceID"]}'}} WHERE AssocClass=Win32_LogicalDiskToPartition"))
                                {
                                    foreach (ManagementObject logical in logicalSearcher.Get())
                                    {
                                        string logicalName = logical["Name"]?.ToString() ?? "";
                                        if (logicalName.TrimEnd('\\', ':').Equals(driveLetter, StringComparison.OrdinalIgnoreCase))
                                        {
                                            // Verificar MediaType
                                            string mediaType = disk["MediaType"]?.ToString() ?? "";
                                            if (mediaType.Contains("SSD", StringComparison.OrdinalIgnoreCase) ||
                                                mediaType.Contains("Solid State", StringComparison.OrdinalIgnoreCase))
                                            {
                                                return true;
                                            }
                                            
                                            // Verificar Model (muitos SSDs têm "SSD" no nome)
                                            string model = disk["Model"]?.ToString() ?? "";
                                            if (model.Contains("SSD", StringComparison.OrdinalIgnoreCase) ||
                                                model.Contains("NVMe", StringComparison.OrdinalIgnoreCase) ||
                                                model.Contains("Solid State", StringComparison.OrdinalIgnoreCase))
                                            {
                                                return true;
                                            }
                                            
                                            // Verificar se não tem partes móveis (método alternativo)
                                            // Se não conseguimos determinar, assumir HDD por segurança
                                            return false;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            catch
            {
            }
            
            // Fallback: método antigo baseado em tamanho (não confiável)
            try
            {
                var drive = new System.IO.DriveInfo(driveLetter);
                if (drive.IsReady)
                {
                    // SSDs geralmente são menores que 2TB
                    return drive.TotalSize < 2000L * 1024 * 1024 * 1024;
                }
            }
            catch
            {
            }
            
            return false;
        }

        public async Task<bool> IsRunningAsAdministratorAsync()
        {
            return await Task.Run(() =>
            {
                try
                {
                    var identity = System.Security.Principal.WindowsIdentity.GetCurrent();
                    var principal = new System.Security.Principal.WindowsPrincipal(identity);
                    return principal.IsInRole(System.Security.Principal.WindowsBuiltInRole.Administrator);
                }
                catch
                {
                    return false;
                }
            });
        }

        public async Task<long> GetAvailableDiskSpaceMBAsync()
        {
            return await Task.Run(() =>
            {
                try
                {
                    var drive = new System.IO.DriveInfo(Path.GetPathRoot(Environment.CurrentDirectory));
                    return drive.AvailableFreeSpace / (1024 * 1024);
                }
                catch
                {
                    return 0;
                }
            });
        }

        public async Task<List<string>> CheckConflictingProcessesAsync(List<string> conflictingProcesses)
        {
            return await Task.Run(() =>
            {
                var runningConflictingProcesses = new List<string>();
                try
                {
                    var processes = Process.GetProcesses();
                    foreach (var process in processes)
                    {
                        try
                        {
                            if (conflictingProcesses.Contains(process.ProcessName, StringComparer.OrdinalIgnoreCase))
                            {
                                runningConflictingProcesses.Add(process.ProcessName);
                            }
                        }
                        catch
                        {
                        }
                    }
                }
                catch
                {
                }
                return runningConflictingProcesses;
            });
        }

        public async Task<List<string>> CheckSystemIntegrityAsync()
        {
            return await Task.Run(() =>
            {
                var issues = new List<string>();
                return issues;
            });
        }

        public async Task<double> GetGpuUsageAsync()
        {
            return await Task.Run(() => 0.0);
        }

        public async Task<double> GetMemoryUsageAsync()
        {
            var ramInfo = await GetRamInfoAsync();
            return ramInfo.UsagePercent;
        }

        public async Task<double> GetIoActivityAsync()
        {
            return await Task.Run(() => 0.0);
        }

        public async Task<List<object>> GetActiveProcessInfoAsync()
        {
            return await Task.Run(() =>
            {
                var processInfoList = new List<object>();
                try
                {
                    var processes = Process.GetProcesses();
                    foreach (var process in processes)
                    {
                        try
                        {
                            processInfoList.Add(new
                            {
                                Name = process.ProcessName,
                                Id = process.Id,
                                MemoryMB = process.WorkingSet64 / (1024 * 1024),
                                CpuTime = process.TotalProcessorTime.TotalSeconds
                            });
                        }
                        catch
                        {
                        }
                    }
                }
                catch
                {
                }
                return processInfoList;
            });
        }

        public bool IsLaptop()
        {
            try
            {
                using (var searcher = new ManagementObjectSearcher("SELECT ChassisTypes FROM Win32_SystemEnclosure"))
                {
                    foreach (ManagementObject obj in searcher.Get())
                    {
                        var types = obj["ChassisTypes"] as ushort[];
                        if (types != null && types.Any(t => t == 8 || t == 9 || t == 10 || t == 11 || t == 12 || t == 14 || t == 18 || t == 21))
                            return true;
                    }
                }
            }
            catch { }
            return false;
        }

        public bool IsOnBattery()
        {
            try
            {
                if (GetSystemPowerStatus(out var status))
                {
                    return status.ACLineStatus == 0;
                }
            }
            catch { }
            return false;
        }
    }
}