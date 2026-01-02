using System;
using System.Diagnostics;
using System.IO;
using System.Management;
using System.Net.NetworkInformation;
using System.Threading;
using System.Threading.Tasks;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Serviço para obter informações reais do sistema
    /// </summary>
    public class SystemInfoService
    {
        /// <summary>
        /// Obtém informações do sistema operacional
        /// </summary>
        public static string GetOSVersion()
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
                        
                        // Extrair arquitetura (WMI retorna string como "64-bit" ou "32-bit")
                        string? osArchitectureStr = obj["OSArchitecture"]?.ToString();
                        string archStr;
                        
                        if (!string.IsNullOrEmpty(osArchitectureStr))
                        {
                            // WMI retorna "64-bit" ou "32-bit" diretamente
                            archStr = osArchitectureStr;
                        }
                        else
                        {
                            // Fallback: usar Environment.Is64BitOperatingSystem
                            archStr = Environment.Is64BitOperatingSystem ? "64-bit" : "32-bit";
                        }
                        
                        // Formatar nome (remover "Microsoft" se presente)
                        name = name.Replace("Microsoft ", "").Trim();
                        
                        return $"{name} ({archStr})";
                    }
                }
            }
            catch
            {
                // Fallback para método simples
                string archStr = Environment.Is64BitOperatingSystem ? "64-bit" : "32-bit";
                return $"{Environment.OSVersion} ({archStr})";
            }
            
            return "Windows Desconhecido";
        }

        /// <summary>
        /// Obtém nome do processador
        /// </summary>
        public static string GetProcessorName()
        {
            try
            {
                using (var searcher = new ManagementObjectSearcher("SELECT Name FROM Win32_Processor"))
                {
                    foreach (ManagementObject obj in searcher.Get())
                    {
                        return obj["Name"]?.ToString() ?? "Processador Desconhecido";
                    }
                }
            }
            catch
            {
                // Fallback
                return "Processador Desconhecido";
            }
            
            return "Processador Desconhecido";
        }

        /// <summary>
        /// Obtém quantidade total de RAM instalada
        /// </summary>
        public static long GetTotalRAMBytes()
        {
            try
            {
                using (var searcher = new ManagementObjectSearcher("SELECT TotalPhysicalMemory FROM Win32_ComputerSystem"))
                {
                    foreach (ManagementObject obj in searcher.Get())
                    {
                        return Convert.ToInt64(obj["TotalPhysicalMemory"] ?? 0);
                    }
                }
            }
            catch
            {
                // Fallback
                return 0;
            }
            
            return 0;
        }

        /// <summary>
        /// Obtém RAM disponível em bytes
        /// </summary>
        public static long GetAvailableRAMBytes()
        {
            try
            {
                var pc = new PerformanceCounter("Memory", "Available Bytes");
                return Convert.ToInt64(pc.NextValue());
            }
            catch
            {
                // Fallback usando WMI
                try
                {
                    using (var searcher = new ManagementObjectSearcher("SELECT AvailableBytes FROM Win32_PerfRawData_PerfOS_Memory"))
                    {
                        foreach (ManagementObject obj in searcher.Get())
                        {
                            return Convert.ToInt64(obj["AvailableBytes"] ?? 0);
                        }
                    }
                }
                catch
                {
                    return 0;
                }
            }
            
            return 0;
        }

        /// <summary>
        /// Obtém espaço livre do disco principal em bytes
        /// </summary>
        public static long GetFreeDiskSpaceBytes()
        {
            try
            {
                var root = Path.GetPathRoot(Environment.SystemDirectory);
                if (string.IsNullOrEmpty(root)) return 0;
                var drive = new DriveInfo(root);
                if (!drive.IsReady) return 0;
                return drive.AvailableFreeSpace;
            }
            catch
            {
                return 0;
            }
        }

        /// <summary>
        /// Obtém espaço total do disco principal em bytes
        /// </summary>
        public static long GetTotalDiskSpaceBytes()
        {
            try
            {
                var root = Path.GetPathRoot(Environment.SystemDirectory);
                if (string.IsNullOrEmpty(root)) return 0;
                var drive = new DriveInfo(root);
                if (!drive.IsReady) return 0;
                return drive.TotalSize;
            }
            catch
            {
                return 0;
            }
        }

        /// <summary>
        /// Obtém percentual de uso de CPU (média)
        /// </summary>
        public static async Task<double> GetCPUUsagePercentAsync()
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
        /// Verifica status da conexão de rede
        /// </summary>
        public static bool IsNetworkConnected()
        {
            try
            {
                return NetworkInterface.GetIsNetworkAvailable();
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Obtém nome da placa gráfica
        /// </summary>
        public static string GetGraphicsCardName()
        {
            try
            {
                using (var searcher = new ManagementObjectSearcher("SELECT Name FROM Win32_VideoController"))
                {
                    foreach (ManagementObject obj in searcher.Get())
                    {
                        string name = obj["Name"]?.ToString() ?? "";
                        if (!string.IsNullOrEmpty(name) && !name.Contains("Basic"))
                            return name;
                    }
                }
            }
            catch
            {
                // Ignorar erro
            }
            
            return "Placa Gráfica Desconhecida";
        }

        /// <summary>
        /// Verifica saúde geral do sistema
        /// </summary>
        public static SystemHealthStatus GetSystemHealthStatus()
        {
            try
            {
                // Verificar espaço em disco
                var totalDisk = GetTotalDiskSpaceBytes();
                var freeDisk = GetFreeDiskSpaceBytes();
                double diskFreePercent = totalDisk > 0 ? (double)freeDisk / totalDisk * 100 : 0;
                
                // Verificar RAM
                var totalRam = GetTotalRAMBytes();
                var availRam = GetAvailableRAMBytes();
                double ramUsagePercent = totalRam > 0 ? (1.0 - (double)availRam / totalRam) * 100 : 0;
                
                // Verificar conectividade
                bool networkOk = IsNetworkConnected();
                
                // Determinar status geral
                if (diskFreePercent < 10 || ramUsagePercent > 90)
                    return SystemHealthStatus.Critical;
                
                if (diskFreePercent < 20 || ramUsagePercent > 80 || !networkOk)
                    return SystemHealthStatus.Warning;
                
                return SystemHealthStatus.Good;
            }
            catch
            {
                return SystemHealthStatus.Unknown;
            }
        }

        /// <summary>
        /// Obtém espaço a ser liberado (arquivos temporários, lixeira, etc.)
        /// </summary>
        public static async Task<long> GetSpaceToCleanBytesAsync()
        {
            if (App.SystemCleaner == null)
                return 0;
            
            try
            {
                // Criar cancellation token com timeout de 30 segundos
                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));
                return await App.SystemCleaner.CalculateTotalSizeAsync(
                    cleanTemp: true,
                    cleanRecycle: true,
                    cleanThumbnails: true,
                    cleanBrowsers: true,
                    cts.Token
                );
            }
            catch
            {
                return 0;
            }
        }
    }

    /// <summary>
    /// Enum para status de saúde do sistema
    /// </summary>
    public enum SystemHealthStatus
    {
        Good,
        Warning,
        Critical,
        Unknown
    }
}

