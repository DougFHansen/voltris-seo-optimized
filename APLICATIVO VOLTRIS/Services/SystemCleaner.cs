using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Interfaces;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Serviço de limpeza do sistema baseado no PS1
    /// </summary>
    public class SystemCleaner : ISystemCleaner
    {
        private readonly ILoggingService _logger;
        
        public SystemCleaner(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        /// <summary>
        /// Calcula o tamanho dos arquivos temporários SEM deletar
        /// </summary>
        public async Task<long> GetTempFilesSizeAsync(CancellationToken ct = default)
        {
            return await Task.Run(() =>
            {
                long totalSize = 0;
                try
                {
                    string[] tempPaths = {
                        Path.GetTempPath(),
                        Path.Combine(Environment.GetEnvironmentVariable("WINDIR") ?? "", "Temp"),
                        Path.Combine(Environment.GetEnvironmentVariable("WINDIR") ?? "", "Prefetch")
                    };
                    
                    foreach (var path in tempPaths)
                    {
                        // Verificar cancelamento
                        if (ct.IsCancellationRequested) break;
                        
                        if (Directory.Exists(path))
                        {
                            try
                            {
                                var filesEnum = EnumerateFilesIterative(path, "*");
                                totalSize += filesEnum.Sum(f =>
                                {
                                    // Verificar cancelamento
                                    if (ct.IsCancellationRequested) return 0;
                                    
                                    try
                                    {
                                        return new FileInfo(f).Length;
                                    }
                                    catch
                                    {
                                        return 0;
                                    }
                                });
                            }
                            catch { /* Ignorar erros */ }
                        }
                    }
                }
                catch { /* Ignorar erros */ }
                return totalSize;
            }, ct);
        }
        /// <summary>
        /// Calcula o tamanho da lixeira SEM esvaziar
        /// </summary>
        public async Task<long> GetRecycleBinSizeAsync(CancellationToken ct = default)
        {
            return await Task.Run(() =>
            {
                long totalSize = 0;
                try
                {
                    string recycleBinPath = $"{Environment.GetFolderPath(Environment.SpecialFolder.Windows)}\\$Recycle.Bin";
                    
                    if (Directory.Exists(recycleBinPath))
                    {
                        var dirs = Directory.GetDirectories(recycleBinPath);
                        foreach (var dir in dirs)
                        {
                            // Verificar cancelamento
                            if (ct.IsCancellationRequested) break;
                            
                            try
                            {
                                var filesEnum = EnumerateFilesIterative(dir, "*");
                                totalSize += filesEnum.Sum(f =>
                                {
                                    // Verificar cancelamento
                                    if (ct.IsCancellationRequested) return 0;
                                    
                                    try
                                    {
                                        return new FileInfo(f).Length;
                                    }
                                    catch
                                    {
                                        return 0;
                                    }
                                });
                            }
                            catch { /* Ignorar erros */ }
                        }
                    }
                }
                catch { /* Ignorar erros */ }
                return totalSize;
            }, ct);
        }        /// <summary>
        /// Calcula o tamanho do cache de miniaturas SEM deletar
        /// </summary>
        public async Task<long> GetThumbnailsSizeAsync(CancellationToken ct = default)
        {
            return await Task.Run(() =>
            {
                long totalSize = 0;
                try
                {
                    string thumbPath = Path.Combine(
                        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                        "Microsoft", "Windows", "Explorer");
                    
                    if (Directory.Exists(thumbPath))
                    {
                        var files = Directory.GetFiles(thumbPath, "thumbcache_*.db");
                        totalSize = files.Sum(f =>
                        {
                            // Verificar cancelamento
                            if (ct.IsCancellationRequested) return 0;
                            
                            try
                            {
                                return new FileInfo(f).Length;
                            }
                            catch
                            {
                                return 0;
                            }
                        });
                    }
                }
                catch { /* Ignorar erros */ }
                return totalSize;
            }, ct);
        }        /// <summary>
        /// Calcula o tamanho do cache de navegadores SEM deletar
        /// </summary>
        public async Task<long> GetBrowserCacheSizeAsync(CancellationToken ct = default)
        {
            return await Task.Run(() =>
            {
                long totalSize = 0;
                try
                {
                    // Verificar cancelamento
                    if (ct.IsCancellationRequested) return 0;
                    
                    // Chrome
                    string chromePath = Path.Combine(
                        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                        "Google", "Chrome", "User Data", "Default", "Cache");
                    totalSize += GetDirectorySize(chromePath, ct);
                    
                    // Verificar cancelamento
                    if (ct.IsCancellationRequested) return totalSize;
                    
                    // Edge
                    string edgePath = Path.Combine(
                        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                        "Microsoft", "Edge", "User Data", "Default", "Cache");
                    totalSize += GetDirectorySize(edgePath, ct);
                }
                catch { /* Ignorar erros */ }
                return totalSize;
            }, ct);
        }        /// <summary>
        /// Calcula o tamanho total baseado nas opções selecionadas
        /// </summary>
        public async Task<long> CalculateTotalSizeAsync(bool cleanTemp, bool cleanRecycle, bool cleanThumbnails, bool cleanBrowsers, CancellationToken ct = default)
        {
            long totalSize = 0;
            
            if (cleanTemp)
            {
                // Verificar cancelamento
                if (ct.IsCancellationRequested) return 0;
                totalSize += await GetTempFilesSizeAsync(ct);
            }
            
            if (cleanRecycle)
            {
                // Verificar cancelamento
                if (ct.IsCancellationRequested) return totalSize;
                totalSize += await GetRecycleBinSizeAsync(ct);
            }
            
            if (cleanThumbnails)
            {
                // Verificar cancelamento
                if (ct.IsCancellationRequested) return totalSize;
                totalSize += await GetThumbnailsSizeAsync(ct);
            }
            
            if (cleanBrowsers)
            {
                // Verificar cancelamento
                if (ct.IsCancellationRequested) return totalSize;
                totalSize += await GetBrowserCacheSizeAsync(ct);
            }
            
            return totalSize;
        }        private long GetDirectorySize(string path, CancellationToken ct = default)
        {
            if (!Directory.Exists(path)) return 0;
            
            long size = 0;
            try
            {
                var filesEnum = EnumerateFilesIterative(path, "*");
                size = filesEnum.Sum(f =>
                {
                    // Verificar cancelamento
                    if (ct.IsCancellationRequested) return 0;
                    
                    try
                    {
                        return new FileInfo(f).Length;
                    }
                    catch
                    {
                        return 0;
                    }
                });
            }
            catch { /* Ignorar erros */ }
            
            return size;
        }

        public async Task<long> CleanCacheAsync(Action<int>? progressCallback = null, CancellationToken ct = default)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("Limpando cache do sistema (DISM)...");
                    progressCallback?.Invoke(10);
                    
                    var processInfo = new ProcessStartInfo
                    {
                        FileName = "dism.exe",
                        Arguments = "/Online /Cleanup-Image /StartComponentCleanup /Quiet",
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true
                    };
                    
                    using (var process = Process.Start(processInfo))
                    {
                        // Verificar cancelamento enquanto aguarda término do processo
                        while (!process?.HasExited ?? false)
                        {
                            if (ct.IsCancellationRequested)
                            {
                                try { process?.Kill(); } catch { }
                                break;
                            }
                            Thread.Sleep(100);
                        }
                    }
                    
                    _logger.LogSuccess("Cache do sistema limpo com sucesso");
                    progressCallback?.Invoke(100);
                    return 0;
                }
                catch (Exception ex)
                {
                    _logger.LogError("Erro ao limpar cache do sistema", ex);
                    progressCallback?.Invoke(100);
                    return 0;
                }
            }, ct);
        }        public async Task<long> CleanTempFilesAsync(Action<int>? progressCallback = null, CancellationToken ct = default)
        {
            return await Task.Run(() =>
            {
                long totalCleaned = 0;
                try
                {
                    _logger.LogInfo("Limpando arquivos temporários...");
                    progressCallback?.Invoke(10);
                    
                    string[] tempPaths = {
                        Path.GetTempPath(),
                        Path.Combine(Environment.GetEnvironmentVariable("WINDIR") ?? "", "Temp"),
                        Path.Combine(Environment.GetEnvironmentVariable("WINDIR") ?? "", "Prefetch")
                    };
                    
                    int currentPath = 0;
                    foreach (var path in tempPaths)
                    {
                        // Verificar cancelamento
                        if (ct.IsCancellationRequested) break;
                        
                        if (Directory.Exists(path))
                        {
                            try
                            {
                                var items = EnumerateFilesIterative(path, "*").ToList();
                                long size = items.Sum(f =>
                                {
                                    // Verificar cancelamento
                                    if (ct.IsCancellationRequested) return 0;
                                    
                                    try
                                    {
                                        return new FileInfo(f).Length;
                                    }
                                    catch
                                    {
                                        return 0;
                                    }
                                });
                                
                                foreach (var file in items)
                                {
                                    // Verificar cancelamento
                                    if (ct.IsCancellationRequested) break;
                                    
                                    try
                                    {
                                        File.Delete(file);
                                    }
                                    catch { /* Ignorar arquivos bloqueados */ }
                                }
                                
                                totalCleaned += size;
                                progressCallback?.Invoke(30 + (currentPath * 20));
                            }
                            catch (Exception ex)
                            {
                                _logger.LogWarning($"Aviso: Não foi possível limpar completamente: {path} - {ex.Message}");
                            }
                        }
                        currentPath++;
                    }
                    
                    if (totalCleaned > 0)
                    {
                        _logger.LogSuccess($"Arquivos temporários removidos: {FormatBytes(totalCleaned)}");
                    }
                    else
                    {
                        _logger.LogInfo("Nenhum arquivo temporário encontrado");
                    }
                    
                    progressCallback?.Invoke(100);
                    return totalCleaned;
                }
                catch (Exception ex)
                {
                    _logger.LogError("Erro ao limpar arquivos temporários", ex);
                    progressCallback?.Invoke(100);
                    return totalCleaned;
                }
            }, ct);
        }
        public async Task<bool> EmptyRecycleBinAsync(Action<int>? progressCallback = null, CancellationToken ct = default)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("Esvaziando lixeira...");
                    progressCallback?.Invoke(50);
                    
                    // Usar Shell32 para esvaziar lixeira corretamente
                    Type? shell32Type = Type.GetTypeFromProgID("Shell.Application");
                    if (shell32Type != null)
                    {
                        object? shellObj = Activator.CreateInstance(shell32Type);
                        if (shellObj != null)
                        {
                            dynamic shell = shellObj;
                            var recycleBin = shell.NameSpace(10);
                            if (recycleBin != null)
                            {
                                var items = recycleBin.Items();
                                if (items != null)
                                {
                                    int itemCount = items.Count;
                                    if (itemCount > 0)
                                    {
                                        for (int i = 0; i < itemCount; i++)
                                        {
                                            // Verificar cancelamento
                                            if (ct.IsCancellationRequested) break;
                                            
                                            try
                                            {
                                                var item = items.Item(i);
                                                if (item != null)
                                                {
                                                    item.InvokeVerb("delete");
                                                }
                                            }
                                            catch { /* Ignorar itens bloqueados */ }
                                        }
                                    }
                                }
                            }
                        }
                    }
                    
                    _logger.LogSuccess("Lixeira esvaziada");
                    progressCallback?.Invoke(100);
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError("Erro ao esvaziar lixeira", ex);
                    progressCallback?.Invoke(100);
                    return false;
                }
            }, ct);
        }        public async Task<long> CleanThumbnailsAsync(Action<int>? progressCallback = null, CancellationToken ct = default)
        {
            return await Task.Run(() =>
            {
                long totalCleaned = 0;
                try
                {
                    _logger.LogInfo("Limpando cache de miniaturas...");
                    progressCallback?.Invoke(10);
                    
                    string thumbPath = Path.Combine(
                        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                        "Microsoft", "Windows", "Explorer");
                    
                    if (Directory.Exists(thumbPath))
                    {
                        var files = Directory.GetFiles(thumbPath, "thumbcache_*.db");
                        totalCleaned = files.Sum(f =>
                        {
                            // Verificar cancelamento
                            if (ct.IsCancellationRequested) return 0;
                            
                            try
                            {
                                return new FileInfo(f).Length;
                            }
                            catch
                            {
                                return 0;
                            }
                        });
                        
                        foreach (var file in files)
                        {
                            // Verificar cancelamento
                            if (ct.IsCancellationRequested) break;
                            
                            try
                            {
                                File.Delete(file);
                            }
                            catch { /* Ignorar arquivos bloqueados */ }
                        }
                        
                        _logger.LogSuccess($"Cache de miniaturas limpo: {FormatBytes(totalCleaned)}");
                    }
                    
                    progressCallback?.Invoke(100);
                    return totalCleaned;
                }
                catch (Exception ex)
                {
                    _logger.LogError("Erro ao limpar cache de miniaturas", ex);
                    progressCallback?.Invoke(100);
                    return totalCleaned;
                }
            }, ct);
        }        public async Task<long> CleanBrowserCacheAsync(Action<int>? progressCallback = null, CancellationToken ct = default)
        {
            return await Task.Run(() =>
            {
                long totalCleaned = 0;
                try
                {
                    _logger.LogInfo("Limpando cache de navegadores...");
                    progressCallback?.Invoke(10);
                    
                    // Chrome
                    string chromePath = Path.Combine(
                        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                        "Google", "Chrome", "User Data", "Default", "Cache");
                    
                    totalCleaned += CleanDirectory(chromePath, ct);
                    
                    // Edge
                    string edgePath = Path.Combine(
                        Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                        "Microsoft", "Edge", "User Data", "Default", "Cache");
                    
                    totalCleaned += CleanDirectory(edgePath, ct);
                    
                    if (totalCleaned > 0)
                    {
                        _logger.LogSuccess($"Cache de navegadores limpo: {FormatBytes(totalCleaned)}");
                    }
                    
                    progressCallback?.Invoke(100);
                    return totalCleaned;
                }
                catch (Exception ex)
                {
                    _logger.LogError("Erro ao limpar cache de navegadores", ex);
                    progressCallback?.Invoke(100);
                    return totalCleaned;
                }
            }, ct);
        }        private long CleanDirectory(string path, CancellationToken ct = default)
        {
            if (!Directory.Exists(path)) return 0;
            
            long size = 0;
            try
            {
                var files = EnumerateFilesIterative(path, "*").ToList();
                size = files.Sum(f =>
                {
                    // Verificar cancelamento
                    if (ct.IsCancellationRequested) return 0;
                    
                    try
                    {
                        return new FileInfo(f).Length;
                    }
                    catch
                    {
                        return 0;
                    }
                });
                
                foreach (var file in files)
                {
                    // Verificar cancelamento
                    if (ct.IsCancellationRequested) break;
                    
                    try
                    {
                        File.Delete(file);
                    }
                    catch { /* Ignorar arquivos bloqueados */ }
                }
            }
            catch { /* Ignorar erros */ }
            
            return size;
        }        /// <summary>
        /// Enumera arquivos de forma iterativa usando helper compartilhado
        /// </summary>
        private IEnumerable<string> EnumerateFilesIterative(string root, string pattern)
        {
            // Usar helper compartilhado para evitar código duplicado
            return Helpers.FileSystemHelper.EnumerateFilesIterative(root, pattern);
        }

        /// <summary>
        /// Formata bytes em formato legível usando helper compartilhado
        /// </summary>
        private string FormatBytes(long bytes)
        {
            // Usar helper compartilhado para evitar código duplicado
            return Helpers.FileSystemHelper.FormatBytes(bytes);
        }
    }
}
