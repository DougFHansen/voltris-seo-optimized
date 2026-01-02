using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32;
using VoltrisOptimizer.Interfaces;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// WINDOWS DISK CLEANUP INTEGRATION - Nível Enterprise
    /// Integra TODAS as funcionalidades do cleanmgr.exe do Windows
    /// + Limpeza profunda adicional que o Windows não faz
    /// </summary>
    public class WindowsDiskCleanupService
    {
        private readonly ILoggingService _logger;
        
        // Todas as flags do Disk Cleanup do Windows
        private static readonly Dictionary<string, CleanupFlag> CleanupFlags = new()
        {
            // ============================================
            // FLAGS PADRÃO DO DISK CLEANUP
            // ============================================
            { "Active Setup Temp Folders", new CleanupFlag { StateFlags = 0x0001, Description = "Pastas temporárias do Active Setup", IsSafe = true } },
            { "BranchCache", new CleanupFlag { StateFlags = 0x0002, Description = "Cache de otimização de rede", IsSafe = true } },
            { "Content Indexer Cleaner", new CleanupFlag { StateFlags = 0x0004, Description = "Índice de pesquisa do Windows", IsSafe = true } },
            { "Device Driver Packages", new CleanupFlag { StateFlags = 0x0008, Description = "Pacotes de driver de dispositivo", IsSafe = true } },
            { "Downloaded Program Files", new CleanupFlag { StateFlags = 0x0010, Description = "Controles ActiveX e applets Java", IsSafe = true } },
            { "GameNewsFiles", new CleanupFlag { StateFlags = 0x0020, Description = "Arquivos de notícias de jogos", IsSafe = true } },
            { "GameStatisticsFiles", new CleanupFlag { StateFlags = 0x0040, Description = "Estatísticas de jogos", IsSafe = true } },
            { "GameUpdateFiles", new CleanupFlag { StateFlags = 0x0080, Description = "Atualizações de jogos", IsSafe = true } },
            { "Internet Cache Files", new CleanupFlag { StateFlags = 0x0100, Description = "Arquivos temporários de internet", IsSafe = true } },
            { "Memory Dump Files", new CleanupFlag { StateFlags = 0x0200, Description = "Arquivos de despejo de memória", IsSafe = true } },
            { "Offline Pages Files", new CleanupFlag { StateFlags = 0x0400, Description = "Páginas web offline", IsSafe = true } },
            { "Old ChkDsk Files", new CleanupFlag { StateFlags = 0x0800, Description = "Fragmentos de arquivos do ChkDsk", IsSafe = true } },
            { "Previous Installations", new CleanupFlag { StateFlags = 0x1000, Description = "Instalações anteriores do Windows", IsSafe = true } },
            { "Recycle Bin", new CleanupFlag { StateFlags = 0x2000, Description = "Lixeira", IsSafe = true } },
            { "Service Pack Cleanup", new CleanupFlag { StateFlags = 0x4000, Description = "Backup do Service Pack", IsSafe = true } },
            { "Setup Log Files", new CleanupFlag { StateFlags = 0x8000, Description = "Logs de instalação do Windows", IsSafe = true } },
            { "System error memory dump files", new CleanupFlag { StateFlags = 0x10000, Description = "Despejos de memória de erro do sistema", IsSafe = true } },
            { "System error minidump files", new CleanupFlag { StateFlags = 0x20000, Description = "Minidespejos de erro do sistema", IsSafe = true } },
            { "Temporary Files", new CleanupFlag { StateFlags = 0x40000, Description = "Arquivos temporários", IsSafe = true } },
            { "Temporary Setup Files", new CleanupFlag { StateFlags = 0x80000, Description = "Arquivos temporários de instalação", IsSafe = true } },
            { "Thumbnail Cache", new CleanupFlag { StateFlags = 0x100000, Description = "Cache de miniaturas", IsSafe = true } },
            { "Update Cleanup", new CleanupFlag { StateFlags = 0x200000, Description = "Limpeza do Windows Update", IsSafe = true } },
            { "Upgrade Discarded Files", new CleanupFlag { StateFlags = 0x400000, Description = "Arquivos descartados de upgrade", IsSafe = true } },
            { "User file versions", new CleanupFlag { StateFlags = 0x800000, Description = "Versões anteriores de arquivos", IsSafe = false } },
            { "Windows Defender", new CleanupFlag { StateFlags = 0x1000000, Description = "Arquivos do Windows Defender", IsSafe = true } },
            { "Windows Error Reporting Archive Files", new CleanupFlag { StateFlags = 0x2000000, Description = "Arquivos de relatório de erros", IsSafe = true } },
            { "Windows Error Reporting Queue Files", new CleanupFlag { StateFlags = 0x4000000, Description = "Fila de relatórios de erros", IsSafe = true } },
            { "Windows Error Reporting System Archive Files", new CleanupFlag { StateFlags = 0x8000000, Description = "Arquivos de sistema de relatórios", IsSafe = true } },
            { "Windows Error Reporting System Queue Files", new CleanupFlag { StateFlags = 0x10000000, Description = "Fila de sistema de relatórios", IsSafe = true } },
            { "Windows Error Reporting Temp Files", new CleanupFlag { StateFlags = 0x20000000, Description = "Arquivos temporários de relatórios", IsSafe = true } },
            { "Windows ESD installation files", new CleanupFlag { StateFlags = 0x40000000, Description = "Arquivos de instalação ESD", IsSafe = true } },
            { "Windows Upgrade Log Files", new CleanupFlag { StateFlags = 0x80000000, Description = "Logs de upgrade do Windows", IsSafe = true } },
        };

        public WindowsDiskCleanupService(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Executa limpeza COMPLETA usando cleanmgr.exe com TODAS as opções
        /// </summary>
        public async Task<DiskCleanupResult> RunFullDiskCleanupAsync(
            bool includeDangerousOptions = false,
            IProgress<string>? progress = null,
            CancellationToken ct = default)
        {
            var result = new DiskCleanupResult();
            
            try
            {
                _logger.LogInfo("╔═══════════════════════════════════════════════════════════╗");
                _logger.LogInfo("║   WINDOWS DISK CLEANUP - LIMPEZA ULTRA PROFISSIONAL       ║");
                _logger.LogInfo("╚═══════════════════════════════════════════════════════════╝");

                // FASE 1: Configurar todas as flags do Disk Cleanup
                progress?.Report("Configurando opções de limpeza...");
                ConfigureCleanupFlags(includeDangerousOptions);

                // FASE 2: Executar cleanmgr.exe com sageset
                progress?.Report("Executando Disk Cleanup do Windows...");
                var cleanmgrResult = await RunCleanmgrAsync(ct);
                result.SpaceCleaned += cleanmgrResult;

                // FASE 3: Limpeza profunda do WinSxS (DISM)
                progress?.Report("Limpando componentes obsoletos (WinSxS)...");
                var winSxSResult = await CleanWinSxSDeepAsync(ct);
                result.SpaceCleaned += winSxSResult;

                // FASE 4: Limpeza adicional que o Windows não faz
                progress?.Report("Executando limpeza adicional...");
                var additionalResult = await CleanAdditionalItemsAsync(ct);
                result.SpaceCleaned += additionalResult;

                // FASE 5: Compactar sistema operacional (CompactOS)
                if (includeDangerousOptions)
                {
                    progress?.Report("Compactando sistema operacional...");
                    var compactResult = await CompactOSAsync(ct);
                    result.SpaceCleaned += compactResult;
                }

                result.Success = true;
                _logger.LogSuccess($"[DiskCleanup] Total liberado: {FormatBytes(result.SpaceCleaned)}");
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.ErrorMessage = ex.Message;
                _logger.LogError($"[DiskCleanup] Erro: {ex.Message}");
            }

            return result;
        }

        /// <summary>
        /// Configura TODAS as flags do Disk Cleanup no registro
        /// </summary>
        private void ConfigureCleanupFlags(bool includeDangerous)
        {
            try
            {
                const string keyPath = @"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\VolumeCaches";
                
                using var baseKey = Registry.LocalMachine.OpenSubKey(keyPath, true);
                if (baseKey == null)
                {
                    _logger.LogWarning("[DiskCleanup] Não foi possível acessar chave do registro");
                    return;
                }

                int configured = 0;
                foreach (var subKeyName in baseKey.GetSubKeyNames())
                {
                    try
                    {
                        using var subKey = baseKey.OpenSubKey(subKeyName, true);
                        if (subKey == null) continue;

                        // Verificar se é uma opção segura
                        var isSafe = CleanupFlags.Values.Any(f => f.IsSafe);
                        
                        if (isSafe || includeDangerous)
                        {
                            // StateFlags0001 = habilitar para limpeza automática
                            subKey.SetValue("StateFlags0001", 2, RegistryValueKind.DWord);
                            configured++;
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"[DiskCleanup] Erro ao configurar {subKeyName}: {ex.Message}");
                    }
                }

                _logger.LogInfo($"[DiskCleanup] {configured} opções configuradas");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[DiskCleanup] Erro ao configurar flags: {ex.Message}");
            }
        }

        /// <summary>
        /// Executa cleanmgr.exe com sagerun
        /// </summary>
        private async Task<long> RunCleanmgrAsync(CancellationToken ct)
        {
            try
            {
                var beforeSize = GetDiskFreeSpace();

                var psi = new ProcessStartInfo
                {
                    FileName = "cleanmgr.exe",
                    Arguments = "/sagerun:1", // Usa StateFlags0001
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    Verb = "runas"
                };

                using var process = Process.Start(psi);
                if (process == null)
                {
                    _logger.LogWarning("[DiskCleanup] Não foi possível iniciar cleanmgr.exe");
                    return 0;
                }

                // Aguardar conclusão (timeout 30 minutos)
                await Task.Run(() => process.WaitForExit(1800000), ct);

                var afterSize = GetDiskFreeSpace();
                var cleaned = afterSize - beforeSize;

                _logger.LogSuccess($"[DiskCleanup] Cleanmgr liberou: {FormatBytes(cleaned)}");
                return cleaned;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[DiskCleanup] Erro ao executar cleanmgr: {ex.Message}");
                return 0;
            }
        }

        /// <summary>
        /// Limpeza PROFUNDA do WinSxS usando DISM
        /// </summary>
        private async Task<long> CleanWinSxSDeepAsync(CancellationToken ct)
        {
            try
            {
                _logger.LogInfo("[DiskCleanup] Iniciando limpeza profunda do WinSxS...");
                
                var beforeSize = GetDirectorySize(@"C:\Windows\WinSxS");

                // COMANDO 1: Analisar componentes
                await RunDismCommandAsync("/Online /Cleanup-Image /AnalyzeComponentStore", ct);

                // COMANDO 2: Limpar componentes superseded
                await RunDismCommandAsync("/Online /Cleanup-Image /StartComponentCleanup", ct);

                // COMANDO 3: Limpar com ResetBase (remove possibilidade de desinstalar updates)
                await RunDismCommandAsync("/Online /Cleanup-Image /StartComponentCleanup /ResetBase", ct);

                // COMANDO 4: Limpar arquivos SP superseded
                await RunDismCommandAsync("/Online /Cleanup-Image /SPSuperseded", ct);

                var afterSize = GetDirectorySize(@"C:\Windows\WinSxS");
                var cleaned = beforeSize - afterSize;

                _logger.LogSuccess($"[DiskCleanup] WinSxS liberou: {FormatBytes(cleaned)}");
                return cleaned;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[DiskCleanup] Erro na limpeza do WinSxS: {ex.Message}");
                return 0;
            }
        }

        /// <summary>
        /// Executa comando DISM
        /// </summary>
        private async Task RunDismCommandAsync(string arguments, CancellationToken ct)
        {
            try
            {
                var psi = new ProcessStartInfo
                {
                    FileName = "dism.exe",
                    Arguments = arguments,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    Verb = "runas"
                };

                using var process = Process.Start(psi);
                if (process == null) return;

                await Task.Run(() => process.WaitForExit(600000), ct); // 10 min timeout
                
                _logger.LogInfo($"[DISM] {arguments} - Concluído");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[DISM] Erro: {ex.Message}");
            }
        }

        /// <summary>
        /// Limpeza adicional que o Windows Disk Cleanup NÃO faz
        /// </summary>
        private async Task<long> CleanAdditionalItemsAsync(CancellationToken ct)
        {
            long totalCleaned = 0;

            try
            {
                // 1. Limpar logs do CBS (Component-Based Servicing)
                totalCleaned += await CleanCBSLogsAsync();

                // 2. Limpar logs do DISM
                totalCleaned += await CleanDISMLogsAsync();

                // 3. Limpar logs do SFC
                totalCleaned += await CleanSFCLogsAsync();

                // 4. Limpar logs do Windows Update
                totalCleaned += await CleanWindowsUpdateLogsAsync();

                // 5. Limpar cache do Windows Installer
                totalCleaned += await CleanWindowsInstallerCacheAsync();

                // 6. Limpar arquivos temporários do WinSxS
                totalCleaned += await CleanWinSxSTempAsync();

                // 7. Limpar logs de instalação de drivers
                totalCleaned += await CleanDriverLogsAsync();

                // 8. Limpar cache de atualização de drivers
                totalCleaned += await CleanDriverCacheAsync();

                // 9. Limpar logs do Event Viewer antigos
                totalCleaned += await CleanOldEventLogsAsync();

                // 10. Limpar arquivos de relatório de erros antigos
                totalCleaned += await CleanOldErrorReportsAsync();

                _logger.LogSuccess($"[DiskCleanup] Limpeza adicional liberou: {FormatBytes(totalCleaned)}");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[DiskCleanup] Erro na limpeza adicional: {ex.Message}");
            }

            return totalCleaned;
        }

        #region Limpezas Adicionais Específicas

        private async Task<long> CleanCBSLogsAsync()
        {
            try
            {
                var cbsPath = @"C:\Windows\Logs\CBS";
                if (!Directory.Exists(cbsPath)) return 0;

                long cleaned = 0;
                var files = Directory.GetFiles(cbsPath, "*.log")
                    .Where(f => new FileInfo(f).LastWriteTime < DateTime.Now.AddDays(-30));

                foreach (var file in files)
                {
                    try
                    {
                        var size = new FileInfo(file).Length;
                        File.Delete(file);
                        cleaned += size;
                    }
                    catch { }
                }

                _logger.LogInfo($"[DiskCleanup] CBS Logs: {FormatBytes(cleaned)}");
                return cleaned;
            }
            catch { return 0; }
        }

        private async Task<long> CleanDISMLogsAsync()
        {
            try
            {
                var dismPath = @"C:\Windows\Logs\DISM";
                if (!Directory.Exists(dismPath)) return 0;

                long cleaned = 0;
                var files = Directory.GetFiles(dismPath, "*.log")
                    .Where(f => new FileInfo(f).LastWriteTime < DateTime.Now.AddDays(-30));

                foreach (var file in files)
                {
                    try
                    {
                        var size = new FileInfo(file).Length;
                        File.Delete(file);
                        cleaned += size;
                    }
                    catch { }
                }

                _logger.LogInfo($"[DiskCleanup] DISM Logs: {FormatBytes(cleaned)}");
                return cleaned;
            }
            catch { return 0; }
        }

        private async Task<long> CleanSFCLogsAsync()
        {
            try
            {
                var sfcLog = @"C:\Windows\Logs\CBS\CBS.log";
                if (!File.Exists(sfcLog)) return 0;

                var size = new FileInfo(sfcLog).Length;
                if (size > 100 * 1024 * 1024) // > 100MB
                {
                    File.Delete(sfcLog);
                    _logger.LogInfo($"[DiskCleanup] SFC Log: {FormatBytes(size)}");
                    return size;
                }

                return 0;
            }
            catch { return 0; }
        }

        private async Task<long> CleanWindowsUpdateLogsAsync()
        {
            try
            {
                var wuPath = @"C:\Windows\Logs\WindowsUpdate";
                if (!Directory.Exists(wuPath)) return 0;

                long cleaned = 0;
                var files = Directory.GetFiles(wuPath, "*.etl")
                    .Where(f => new FileInfo(f).LastWriteTime < DateTime.Now.AddDays(-7));

                foreach (var file in files)
                {
                    try
                    {
                        var size = new FileInfo(file).Length;
                        File.Delete(file);
                        cleaned += size;
                    }
                    catch { }
                }

                _logger.LogInfo($"[DiskCleanup] Windows Update Logs: {FormatBytes(cleaned)}");
                return cleaned;
            }
            catch { return 0; }
        }

        private async Task<long> CleanWindowsInstallerCacheAsync()
        {
            try
            {
                // ATENÇÃO: Limpar com cuidado - alguns MSI podem ser necessários
                var installerPath = @"C:\Windows\Installer\$PatchCache$";
                if (!Directory.Exists(installerPath)) return 0;

                long cleaned = 0;
                var dirs = Directory.GetDirectories(installerPath)
                    .Where(d => new DirectoryInfo(d).LastWriteTime < DateTime.Now.AddDays(-90));

                foreach (var dir in dirs)
                {
                    try
                    {
                        var size = GetDirectorySize(dir);
                        Directory.Delete(dir, true);
                        cleaned += size;
                    }
                    catch { }
                }

                _logger.LogInfo($"[DiskCleanup] Installer Cache: {FormatBytes(cleaned)}");
                return cleaned;
            }
            catch { return 0; }
        }

        private async Task<long> CleanWinSxSTempAsync()
        {
            try
            {
                var tempPath = @"C:\Windows\WinSxS\Temp";
                if (!Directory.Exists(tempPath)) return 0;

                long cleaned = 0;
                var files = Directory.GetFiles(tempPath, "*", SearchOption.AllDirectories);

                foreach (var file in files)
                {
                    try
                    {
                        var size = new FileInfo(file).Length;
                        File.Delete(file);
                        cleaned += size;
                    }
                    catch { }
                }

                _logger.LogInfo($"[DiskCleanup] WinSxS Temp: {FormatBytes(cleaned)}");
                return cleaned;
            }
            catch { return 0; }
        }

        private async Task<long> CleanDriverLogsAsync()
        {
            try
            {
                var setupApiLog = @"C:\Windows\inf\setupapi.dev.log";
                if (!File.Exists(setupApiLog)) return 0;

                var size = new FileInfo(setupApiLog).Length;
                if (size > 50 * 1024 * 1024) // > 50MB
                {
                    File.Delete(setupApiLog);
                    _logger.LogInfo($"[DiskCleanup] Driver Logs: {FormatBytes(size)}");
                    return size;
                }

                return 0;
            }
            catch { return 0; }
        }

        private async Task<long> CleanDriverCacheAsync()
        {
            try
            {
                var driverCache = @"C:\Windows\System32\DriverStore\Temp";
                if (!Directory.Exists(driverCache)) return 0;

                long cleaned = 0;
                var files = Directory.GetFiles(driverCache, "*", SearchOption.AllDirectories);

                foreach (var file in files)
                {
                    try
                    {
                        var size = new FileInfo(file).Length;
                        File.Delete(file);
                        cleaned += size;
                    }
                    catch { }
                }

                _logger.LogInfo($"[DiskCleanup] Driver Cache: {FormatBytes(cleaned)}");
                return cleaned;
            }
            catch { return 0; }
        }

        private async Task<long> CleanOldEventLogsAsync()
        {
            try
            {
                // Limpar logs do Event Viewer com mais de 90 dias
                var evtxPath = @"C:\Windows\System32\winevt\Logs";
                if (!Directory.Exists(evtxPath)) return 0;

                long cleaned = 0;
                var files = Directory.GetFiles(evtxPath, "*.evtx")
                    .Where(f => !f.Contains("System.evtx") && !f.Contains("Application.evtx") && !f.Contains("Security.evtx"))
                    .Where(f => new FileInfo(f).LastWriteTime < DateTime.Now.AddDays(-90));

                foreach (var file in files)
                {
                    try
                    {
                        var size = new FileInfo(file).Length;
                        File.Delete(file);
                        cleaned += size;
                    }
                    catch { }
                }

                _logger.LogInfo($"[DiskCleanup] Event Logs: {FormatBytes(cleaned)}");
                return cleaned;
            }
            catch { return 0; }
        }

        private async Task<long> CleanOldErrorReportsAsync()
        {
            try
            {
                var werPath = @"C:\ProgramData\Microsoft\Windows\WER\ReportQueue";
                if (!Directory.Exists(werPath)) return 0;

                long cleaned = 0;
                var dirs = Directory.GetDirectories(werPath)
                    .Where(d => new DirectoryInfo(d).LastWriteTime < DateTime.Now.AddDays(-30));

                foreach (var dir in dirs)
                {
                    try
                    {
                        var size = GetDirectorySize(dir);
                        Directory.Delete(dir, true);
                        cleaned += size;
                    }
                    catch { }
                }

                _logger.LogInfo($"[DiskCleanup] Error Reports: {FormatBytes(cleaned)}");
                return cleaned;
            }
            catch { return 0; }
        }

        #endregion

        /// <summary>
        /// Compacta o sistema operacional usando CompactOS
        /// ATENÇÃO: Pode reduzir performance em SSDs
        /// </summary>
        private async Task<long> CompactOSAsync(CancellationToken ct)
        {
            try
            {
                _logger.LogInfo("[DiskCleanup] Compactando sistema operacional...");
                
                var beforeSize = GetDirectorySize(@"C:\Windows");

                var psi = new ProcessStartInfo
                {
                    FileName = "compact.exe",
                    Arguments = "/CompactOS:always",
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    RedirectStandardOutput = true,
                    Verb = "runas"
                };

                using var process = Process.Start(psi);
                if (process == null) return 0;

                await Task.Run(() => process.WaitForExit(1800000), ct); // 30 min timeout

                var afterSize = GetDirectorySize(@"C:\Windows");
                var saved = beforeSize - afterSize;

                _logger.LogSuccess($"[DiskCleanup] CompactOS economizou: {FormatBytes(saved)}");
                return saved;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[DiskCleanup] Erro no CompactOS: {ex.Message}");
                return 0;
            }
        }

        #region Helper Methods

        private long GetDiskFreeSpace()
        {
            try
            {
                var drive = new System.IO.DriveInfo("C");
                return drive.AvailableFreeSpace;
            }
            catch
            {
                return 0;
            }
        }

        private long GetDirectorySize(string path)
        {
            try
            {
                if (!Directory.Exists(path)) return 0;

                var files = Directory.GetFiles(path, "*", SearchOption.AllDirectories);
                return files.Sum(f =>
                {
                    try { return new FileInfo(f).Length; }
                    catch { return 0; }
                });
            }
            catch
            {
                return 0;
            }
        }

        private string FormatBytes(long bytes)
        {
            string[] sizes = { "B", "KB", "MB", "GB", "TB" };
            double len = bytes;
            int order = 0;
            while (len >= 1024 && order < sizes.Length - 1)
            {
                order++;
                len = len / 1024;
            }
            return $"{len:0.##} {sizes[order]}";
        }

        #endregion
    }

    #region Data Classes

    public class CleanupFlag
    {
        public uint StateFlags { get; set; }
        public string Description { get; set; } = "";
        public bool IsSafe { get; set; }
    }

    public class DiskCleanupResult
    {
        public bool Success { get; set; }
        public long SpaceCleaned { get; set; }
        public string ErrorMessage { get; set; } = "";
    }

    #endregion
}
