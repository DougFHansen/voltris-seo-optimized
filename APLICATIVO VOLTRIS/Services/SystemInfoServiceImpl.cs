using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Management;
using System.Net.NetworkInformation;
using System.Threading.Tasks;
using VoltrisOptimizer.Interfaces;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Implementação do serviço de informações do sistema
    /// </summary>
    public class SystemInfoServiceImpl : ISystemInfoService
    {
        /// <summary>
        /// Obtém informações da CPU
        /// </summary>
        public async Task<CpuInfo> GetCpuInfoAsync()
        {
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
                            
                            // Verificar se é CPU híbrida (tem mais threads que cores)
                            cpuInfo.IsHybrid = cpuInfo.ThreadCount > cpuInfo.CoreCount;
                            
                            // Arquitetura
                            cpuInfo.Architecture = Environment.Is64BitOperatingSystem ? "x64" : "x86";
                            
                            // Velocidades (valores aproximados)
                            cpuInfo.MaxClockSpeedMHz = Convert.ToDouble(obj["MaxClockSpeed"] ?? 0);
                            cpuInfo.CurrentClockSpeedMHz = Convert.ToDouble(obj["CurrentClockSpeed"] ?? 0);
                            
                            break; // Pegar apenas o primeiro processador
                        }
                    }
                }
                catch
                {
                    // Valores padrão em caso de erro
                    cpuInfo.Name = "Processador Desconhecido";
                    cpuInfo.CoreCount = Environment.ProcessorCount;
                    cpuInfo.ThreadCount = Environment.ProcessorCount;
                    cpuInfo.Architecture = Environment.Is64BitOperatingSystem ? "x64" : "x86";
                }
                
                return cpuInfo;
            });
        }

        /// <summary>
        /// Obtém informações da GPU principal
        /// </summary>
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
                                                gpuInfo.VideoMemoryBytes > 512 * 1024 * 1024; // Mais de 512MB provavelmente é dedicada
                            
                            // Recursos avançados (valores padrão)
                            gpuInfo.SupportsHags = false; // Seria necessário verificar recursos específicos
                            gpuInfo.SupportsVrr = false;  // Seria necessário verificar recursos específicos
                            
                            // Pegar a primeira GPU que não seja básica
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

        /// <summary>
        /// Obtém informações de todas as GPUs
        /// </summary>
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
                            
                            // Recursos avançados (valores padrão)
                            gpuInfo.SupportsHags = false;
                            gpuInfo.SupportsVrr = false;
                            
                            // Adicionar apenas GPUs não básicas
                            if (!string.IsNullOrEmpty(gpuInfo.Name) && !gpuInfo.Name.Contains("Basic", StringComparison.OrdinalIgnoreCase))
                                gpus.Add(gpuInfo);
                        }
                    }
                }
                catch
                {
                    // Em caso de erro, adicionar uma GPU desconhecida
                    gpus.Add(new GpuInfo
                    {
                        Name = "Placa Gráfica Desconhecida",
                        Vendor = "Desconhecido"
                    });
                }
                
                return gpus.ToArray();
            });
        }

        /// <summary>
        /// Obtém informações da memória RAM
        /// </summary>
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
                    
                    // Obter memória disponível
                    using (var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_PerfRawData_PerfOS_Memory"))
                    {
                        foreach (ManagementObject obj in searcher.Get())
                        {
                            var availableKb = Convert.ToInt64(obj["AvailableBytes"] ?? 0);
                            ramInfo.AvailableBytes = availableKb;
                            break;
                        }
                    }
                }
                catch
                {
                    // Valores padrão em caso de erro
                    ramInfo.TotalBytes = 0;
                    ramInfo.AvailableBytes = 0;
                }
                
                return ramInfo;
            });
        }

        /// <summary>
        /// Obtém informações de todos os drives
        /// </summary>
        public async Task<VoltrisOptimizer.Interfaces.DriveInfo[]> GetDrivesInfoAsync() // Usar o tipo completo para evitar ambiguidade
        {
            return await Task.Run(() =>
            {
                var drives = new List<VoltrisOptimizer.Interfaces.DriveInfo>(); // Usar o tipo completo para evitar ambiguidade
                
                try
                {
                    foreach (var drive in System.IO.DriveInfo.GetDrives()) // Usar System.IO.DriveInfo para evitar ambiguidade
                    {
                        if (drive.IsReady)
                        {
                            var driveInfo = new VoltrisOptimizer.Interfaces.DriveInfo // Usar o tipo completo para evitar ambiguidade
                            {
                                Letter = drive.Name,
                                Label = drive.VolumeLabel,
                                TotalBytes = drive.TotalSize,
                                FreeBytes = drive.AvailableFreeSpace,
                                FileSystem = drive.DriveFormat,
                                IsSsd = IsDriveSSD(drive.Name) // Tentativa de detectar SSD
                            };
                            
                            drives.Add(driveInfo);
                        }
                    }
                }
                catch
                {
                    // Em caso de erro, retornar array vazio
                }
                
                return drives.ToArray();
            });
        }

        /// <summary>
        /// Obtém informações das interfaces de rede
        /// </summary>
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
                    // Em caso de erro, retornar array vazio
                }
                
                return networks.ToArray();
            });
        }

        /// <summary>
        /// Obtém todas as capacidades do hardware
        /// </summary>
        public async Task<HardwareCapabilities> GetHardwareCapabilitiesAsync()
        {
            var capabilities = new HardwareCapabilities();
            
            try
            {
                // Obter informações de CPU
                capabilities.Cpu = await GetCpuInfoAsync();
                
                // Obter informações de GPU
                capabilities.Gpu = await GetGpuInfoAsync();
                
                // Obter informações de RAM
                capabilities.Ram = await GetRamInfoAsync();
                
                // Obter informações de drives
                capabilities.Drives = await GetDrivesInfoAsync();
                
                // Obter informações de rede
                capabilities.NetworkAdapters = await GetNetworkInfoAsync();
            }
            catch
            {
                // Em caso de erro, retornar objeto com valores padrão
            }
            
            return capabilities;
        }

        /// <summary>
        /// Obtém o uso atual da CPU em porcentagem
        /// </summary>
        public async Task<double> GetCpuUsageAsync()
        {
            return await Task.Run(() =>
            {
                try
                {
                    using (var pc = new PerformanceCounter("Processor", "% Processor Time", "_Total"))
                    {
                        pc.NextValue(); // Primeira leitura é sempre 0
                        System.Threading.Thread.Sleep(1000); // Aguardar 1 segundo
                        return pc.NextValue();
                    }
                }
                catch
                {
                    return 0;
                }
            });
        }

        /// <summary>
        /// Obtém a versão do Windows
        /// </summary>
        public string GetWindowsVersion()
        {
            try
            {
                using (var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_OperatingSystem"))
                {
                    foreach (ManagementObject obj in searcher.Get())
                    {
                        string name = obj["Name"]?.ToString() ?? "";
                        // Extrair apenas a parte relevante (ex: "Microsoft Windows 10 Pro")
                        if (name.Contains("|"))
                            name = name.Split('|')[0].Trim();
                        
                        // Extrair versão
                        string version = obj["Version"]?.ToString() ?? "";
                        
                        // Formatar nome (remover "Microsoft" se presente)
                        name = name.Replace("Microsoft ", "").Trim();
                        
                        return $"{name} {version}";
                    }
                }
            }
            catch
            {
                // Fallback para método simples
                return Environment.OSVersion.ToString();
            }
            
            return "Windows Desconhecido";
        }

        /// <summary>
        /// Obtém o build do Windows
        /// </summary>
        public int GetWindowsBuild()
        {
            try
            {
                using (var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_OperatingSystem"))
                {
                    foreach (ManagementObject obj in searcher.Get())
                    {
                        string version = obj["Version"]?.ToString() ?? "";
                        // O build é a última parte da versão (ex: 10.0.19042.1234 -> build 19042)
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
                // Fallback
            }
            
            return Environment.OSVersion.Version.Build;
        }

        /// <summary>
        /// Verifica se o sistema é Windows 11
        /// </summary>
        public bool IsWindows11()
        {
            try
            {
                // Windows 11 começa com build 22000
                return GetWindowsBuild() >= 22000;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Verifica se o sistema é 64 bits
        /// </summary>
        public bool Is64BitOperatingSystem()
        {
            return Environment.Is64BitOperatingSystem;
        }

        /// <summary>
        /// Verifica se uma unidade é SSD
        /// </summary>
        private bool IsDriveSSD(string driveLetter)
        {
            try
            {
                // Esta é uma implementação simplificada
                // Uma detecção mais precisa exigiria chamadas à API do Windows
                
                // Por padrão, assumir que unidades menores que 1TB são SSDs
                var drive = new System.IO.DriveInfo(driveLetter); // Usar System.IO.DriveInfo para evitar ambiguidade
                if (drive.IsReady)
                {
                    return drive.TotalSize < 1000L * 1024 * 1024 * 1024; // Menos de 1TB
                }
            }
            catch
            {
                // Em caso de erro, assumir que não é SSD
            }
            
            return false;
        }

        /// <summary>
        /// Verifica se o aplicativo está sendo executado com permissões de administrador
        /// </summary>
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

        /// <summary>
        /// Obtém o espaço disponível em disco em MB
        /// </summary>
        public async Task<long> GetAvailableDiskSpaceMBAsync()
        {
            return await Task.Run(() =>
            {
                try
                {
                    var drive = new System.IO.DriveInfo(Path.GetPathRoot(Environment.CurrentDirectory)); // Usar System.IO.DriveInfo para evitar ambiguidade
                    return drive.AvailableFreeSpace / (1024 * 1024);
                }
                catch
                {
                    return 0;
                }
            });
        }

        /// <summary>
        /// Verifica processos em conflito
        /// </summary>
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
                            // Ignora erros ao acessar informações de processos
                        }
                    }
                }
                catch
                {
                    // Em caso de erro, retorna lista vazia
                }

                return runningConflictingProcesses;
            });
        }

        /// <summary>
        /// Verifica a integridade do sistema
        /// </summary>
        public async Task<List<string>> CheckSystemIntegrityAsync()
        {
            return await Task.Run(() =>
            {
                var issues = new List<string>();

                // Em uma implementação real, poderia verificar:
                // - Estado do sistema de arquivos
                // - Integridade de arquivos críticos
                // - Estado do registro do Windows
                // - Serviços essenciais em execução

                return issues;
            });
        }

        /// <summary>
        /// Obtém o uso da GPU
        /// </summary>
        public async Task<double> GetGpuUsageAsync()
        {
            return await Task.Run(() =>
            {
                try
                {
                    // Implementação simplificada - retorna 0 por padrão
                    // Uma implementação real exigiria acesso a APIs específicas da GPU
                    return 0.0;
                }
                catch
                {
                    return 0.0;
                }
            });
        }

        /// <summary>
        /// Obtém o uso da memória
        /// </summary>
        public async Task<double> GetMemoryUsageAsync()
        {
            return await Task.Run(async () =>
            {
                try
                {
                    var ramInfo = await GetRamInfoAsync();
                    return ramInfo.UsagePercent;
                }
                catch
                {
                    return 0.0;
                }
            });
        }

        /// <summary>
        /// Obtém a atividade de I/O
        /// </summary>
        public async Task<double> GetIoActivityAsync()
        {
            return await Task.Run(() =>
            {
                try
                {
                    // Implementação simplificada - retorna 0 por padrão
                    // Uma implementação real exigiria monitoramento de I/O do disco
                    return 0.0;
                }
                catch
                {
                    return 0.0;
                }
            });
        }

        /// <summary>
        /// Obtém informações dos processos ativos
        /// </summary>
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
                            // Ignora erros ao acessar informações de processos
                        }
                    }
                }
                catch
                {
                    // Em caso de erro, retorna lista vazia
                }

                return processInfoList;
            });
        }
    }
}