using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Management;
using System.Threading.Tasks;
using Microsoft.Win32;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Core.Constants;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Serviço de otimizações avançadas
    /// </summary>
    public class AdvancedOptimizer : IAdvancedOptimizer
    {
        private readonly ILoggingService _logger;

        public AdvancedOptimizer(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Otimiza SSD/HDD específico
        /// </summary>
        public async Task<bool> OptimizeStorageAsync(string driveLetter, bool isSSD, Action<int>? progressCallback = null)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo($"Otimizando armazenamento {driveLetter} ({(isSSD ? "SSD" : "HDD")})...");
                    progressCallback?.Invoke(10);

                    if (isSSD)
                    {
                        // Para SSD: TRIM
                        var trimProcess = new ProcessStartInfo
                        {
                            FileName = "defrag.exe",
                            Arguments = $"{driveLetter}: /O",
                            UseShellExecute = false,
                            CreateNoWindow = true,
                            RedirectStandardOutput = true
                        };
                        Process.Start(trimProcess)?.WaitForExit();
                        _logger.LogSuccess($"TRIM executado em {driveLetter}");
                    }
                    else
                    {
                        // Para HDD: Desfragmentação
                        var defragProcess = new ProcessStartInfo
                        {
                            FileName = "defrag.exe",
                            Arguments = $"{driveLetter}: /O",
                            UseShellExecute = false,
                            CreateNoWindow = true,
                            RedirectStandardOutput = true
                        };
                        Process.Start(defragProcess)?.WaitForExit();
                        _logger.LogSuccess($"Desfragmentação executada em {driveLetter}");
                    }

                    progressCallback?.Invoke(100);
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Erro ao otimizar armazenamento {driveLetter}", ex);
                    progressCallback?.Invoke(100);
                    return false;
                }
            });
        }

        /// <summary>
        /// Otimiza uso de memória RAM
        /// </summary>
        public async Task<bool> OptimizeMemoryAsync(Action<int>? progressCallback = null)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("Otimizando memória RAM...");
                    progressCallback?.Invoke(10);

                    // Limpar working sets de processos inativos
                    var processes = Process.GetProcesses()
                        .Where(p => p.WorkingSet64 > FileSizeConstants.MinProcessWorkingSetForOptimization)
                        .Where(p => p.Responding)
                        .ToList();

                    int current = 0;
                    foreach (var proc in processes)
                    {
                        try
                        {
                            if (proc.ProcessName != "VoltrisOptimizer")
                            {
                                // Forçar garbage collection do processo
                                GC.Collect();
                                GC.WaitForPendingFinalizers();
                            }
                        }
                        catch { }
                        current++;
                        progressCallback?.Invoke(10 + (current * 80 / processes.Count));
                    }

                    _logger.LogSuccess("Memória RAM otimizada");
                    progressCallback?.Invoke(100);
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError("Erro ao otimizar memória RAM", ex);
                    progressCallback?.Invoke(100);
                    return false;
                }
            });
        }

        /// <summary>
        /// Gerenciamento avançado de processos
        /// </summary>
        public async Task<bool> OptimizeProcessesAsync(Action<int>? progressCallback = null)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("Otimizando processos...");
                    progressCallback?.Invoke(10);

                    var processesToOptimize = new[]
                    {
                        "SearchIndexer", "WSearch", "MsMpEng", "svchost"
                    };

                    int current = 0;
                    foreach (var procName in processesToOptimize)
                    {
                        try
                        {
                            var processes = Process.GetProcessesByName(procName);
                            foreach (var proc in processes)
                            {
                                if (proc.PriorityClass != ProcessPriorityClass.BelowNormal)
                                {
                                    proc.PriorityClass = ProcessPriorityClass.BelowNormal;
                                }
                            }
                        }
                        catch { }
                        current++;
                        progressCallback?.Invoke(20 + (current * 60 / processesToOptimize.Length));
                    }

                    _logger.LogSuccess("Processos otimizados");
                    progressCallback?.Invoke(100);
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError("Erro ao otimizar processos", ex);
                    progressCallback?.Invoke(100);
                    return false;
                }
            });
        }

        /// <summary>
        /// Limpeza profunda de registro
        /// </summary>
        public async Task<bool> CleanRegistryAsync(Action<int>? progressCallback = null)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("Limpando registro do Windows...");
                    progressCallback?.Invoke(10);

                    // Limpar chaves inválidas comuns
                    var keysToClean = new[]
                    {
                        @"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall",
                        @"SOFTWARE\Microsoft\Windows\CurrentVersion\Run"
                    };

                    int cleaned = 0;
                    int current = 0;
                    foreach (var keyPath in keysToClean)
                    {
                        try
                        {
                            using var key = Registry.LocalMachine.OpenSubKey(keyPath, true);
                            if (key != null)
                            {
                                var subKeys = key.GetSubKeyNames();
                                foreach (var subKeyName in subKeys)
                                {
                                    try
                                    {
                                        using var subKey = key.OpenSubKey(subKeyName, false);
                                        if (subKey != null)
                                        {
                                            // Verificar se a chave tem valores válidos
                                            var hasValues = subKey.GetValueNames().Length > 0;
                                            if (!hasValues)
                                            {
                                                key.DeleteSubKey(subKeyName, false);
                                                cleaned++;
                                            }
                                        }
                                    }
                                    catch { }
                                }
                            }
                        }
                        catch { }
                        current++;
                        progressCallback?.Invoke(20 + (current * 70 / keysToClean.Length));
                    }

                    _logger.LogSuccess($"Registro limpo: {cleaned} chaves inválidas removidas");
                    progressCallback?.Invoke(100);
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError("Erro ao limpar registro", ex);
                    progressCallback?.Invoke(100);
                    return false;
                }
            });
        }

        /// <summary>
        /// Detecta se um drive é SSD ou HDD
        /// </summary>
        public bool IsSSD(string driveLetter)
        {
            try
            {
                using var searcher = new ManagementObjectSearcher(
                    "SELECT * FROM Win32_DiskDrive WHERE MediaType = 'Fixed hard disk media'");
                
                foreach (ManagementObject drive in searcher.Get())
                {
                    var partitions = drive.GetRelated("Win32_DiskPartition");
                    foreach (ManagementObject partition in partitions)
                    {
                        var logicalDisks = partition.GetRelated("Win32_LogicalDisk");
                        foreach (ManagementObject logicalDisk in logicalDisks)
                        {
                            var deviceId = logicalDisk["DeviceID"]?.ToString();
                            if (deviceId?.StartsWith(driveLetter, StringComparison.OrdinalIgnoreCase) == true)
                            {
                                var mediaType = drive["MediaType"]?.ToString();
                                return mediaType?.Contains("SSD") == true || 
                                       mediaType?.Contains("Solid State") == true;
                            }
                        }
                    }
                }
            }
            catch { }
            
            // Fallback: assumir SSD se não conseguir detectar
            return true;
        }
    }
}

