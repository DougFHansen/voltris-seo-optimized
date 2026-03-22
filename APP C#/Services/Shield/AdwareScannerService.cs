using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Win32;
using VoltrisOptimizer.Interfaces;

namespace VoltrisOptimizer.Services.Shield
{
    public class AdwareScannerService
    {
        private readonly ILoggingService _logger;
        private readonly SecurityLogService _securityLog;
        private bool _backgroundScansPaused;
        
        private readonly string[] _adwarePatterns = new[]
        {
            "toolbar", "searchbar", "browser helper", "adware", "pup", "bundler",
            "conduit", "babylon", "ask toolbar", "mindspark", "myway", "searchprotect",
            "sweetpage", "delta-homes", "omiga-plus", "qvo6", "webssearches"
        };
        
        // Whitelist de software legítimo que não deve ser detectado como adware
        private readonly string[] _whitelist = new[]
        {
            "intel", "nvidia", "amd", "microsoft", "windows", "device stage",
            "windowsapps", "common files", "system32", "syswow64",
            "program files", "dotnet", ".net", "visual studio",
            "task scheduler", "taskbar", "voltris"
        };
        
        public event EventHandler<AdwareDetectedEventArgs>? AdwareDetected;
        
        public AdwareScannerService(ILoggingService logger, SecurityLogService securityLog)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _securityLog = securityLog ?? throw new ArgumentNullException(nameof(securityLog));
        }
        
        public async Task<List<AdwareItem>> ScanForAdwareAsync()
        {
            var items = new List<AdwareItem>();
            
            try
            {
                _logger.LogInfo("[AdwareScanner] Iniciando scan completo de adware...");
                _securityLog.LogSecurityEvent("AdwareScanner", "SCAN_STARTED", "Full adware scan initiated");
                
                // Scan de diretórios
                items.AddRange(await ScanProgramFilesAsync());
                items.AddRange(await ScanAppDataAsync());
                items.AddRange(await ScanProgramDataAsync());
                
                // Scan de registry
                items.AddRange(await ScanRegistryAsync());
                
                _logger.LogSuccess($"[AdwareScanner] Scan concluído: {items.Count} itens detectados");
                _securityLog.LogScanCompleted("AdwareScanner", items.Count, items.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError("[AdwareScanner] Erro no scan de adware", ex);
            }
            
            return items;
        }
        
        public async Task<List<AdwareItem>> ScanTempFoldersAsync()
        {
            var items = new List<AdwareItem>();
            try
            {
                _logger.LogInfo("[AdwareScanner] Escaneando pastas temporárias...");
                var tempPath = Path.GetTempPath();
                items = await ScanDirectoryForAdwareAsync(tempPath, searchDepth: 1);
                _logger.LogSuccess($"[AdwareScanner] Temp scan concluído: {items.Count} ameaças");
            }
            catch (Exception ex)
            {
                _logger.LogError("[AdwareScanner] Erro no scan de temp", ex);
            }
            return items;
        }
        
        public async Task<List<AdwareItem>> ScanDownloadsFolderAsync()
        {
            var items = new List<AdwareItem>();
            try
            {
                _logger.LogInfo("[AdwareScanner] Escaneando Downloads...");
                var downloadsPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "Downloads");
                if (Directory.Exists(downloadsPath))
                {
                    items = await ScanDirectoryForAdwareAsync(downloadsPath, searchDepth: 1);
                }
                _logger.LogSuccess($"[AdwareScanner] Downloads scan concluído: {items.Count} ameaças");
            }
            catch (Exception ex)
            {
                _logger.LogError("[AdwareScanner] Erro no scan de downloads", ex);
            }
            return items;
        }
        
        public async Task<int> ScanFullSystemAsync()
        {
            var items = await ScanForAdwareAsync();
            return items.Count;
        }
        
        public async Task<bool> RemoveAdwareItemAsync(AdwareItem item)
        {
            try
            {
                _logger.LogInfo($"[AdwareScanner] Removendo: {item.Name}");
                
                if (item.Type == AdwareType.Directory && Directory.Exists(item.Path))
                {
                    Directory.Delete(item.Path, true);
                    _securityLog.LogSecurityEvent("AdwareScanner", "ADWARE_REMOVED", $"Directory: {item.Path}");
                    return true;
                }
                else if (item.Type == AdwareType.RegistryKey)
                {
                    return await Task.Run(() =>
                    {
                        try
                        {
                            // Parse do path: "HKLM\SOFTWARE\SubKey"
                            var parts = item.Path.Split(new[] { '\\' }, 2);
                            if (parts.Length < 2)
                            {
                                _logger.LogWarning($"[AdwareScanner] Path de registry inválido: {item.Path}");
                                return false;
                            }
                            
                            var hiveName = parts[0].ToUpperInvariant();
                            var subKeyPath = parts[1];
                            
                            RegistryKey? baseKey = hiveName switch
                            {
                                "HKLM" => Registry.LocalMachine,
                                "HKCU" => Registry.CurrentUser,
                                _ => null
                            };
                            
                            if (baseKey == null)
                            {
                                _logger.LogWarning($"[AdwareScanner] Hive desconhecido: {hiveName}");
                                return false;
                            }
                            
                            // Verificar se a chave existe antes de tentar deletar
                            using var testKey = baseKey.OpenSubKey(subKeyPath);
                            if (testKey == null)
                            {
                                _logger.LogInfo($"[AdwareScanner] Chave já não existe: {item.Path}");
                                return true; // Já removida
                            }
                            testKey.Close();
                            
                            baseKey.DeleteSubKeyTree(subKeyPath, throwOnMissingSubKey: false);
                            _securityLog.LogSecurityEvent("AdwareScanner", "ADWARE_REMOVED", $"Registry key deleted: {item.Path}");
                            _logger.LogSuccess($"[AdwareScanner] Chave de registro removida: {item.Path}");
                            return true;
                        }
                        catch (UnauthorizedAccessException)
                        {
                            _logger.LogWarning($"[AdwareScanner] Sem permissão para remover chave: {item.Path}");
                            return false;
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError($"[AdwareScanner] Erro ao remover chave de registro: {item.Path}", ex);
                            return false;
                        }
                    });
                }
                
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[AdwareScanner] Erro ao remover {item.Name}", ex);
                return false;
            }
        }
        
        public void PauseBackgroundScans()
        {
            _backgroundScansPaused = true;
            _logger.LogInfo("[AdwareScanner] Scans em background pausados (Modo Gamer)");
        }
        
        public void ResumeBackgroundScans()
        {
            _backgroundScansPaused = false;
            _logger.LogInfo("[AdwareScanner] Scans em background retomados");
        }
        
        /// <summary>
        /// Escaneia extensões de browser suspeitas (Chrome, Edge, Firefox)
        /// </summary>
        public async Task<List<AdwareItem>> ScanBrowserExtensionsAsync()
        {
            var items = new List<AdwareItem>();
            try
            {
                _logger.LogInfo("[AdwareScanner] Escaneando extensões de browser...");
                var localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
                var roamingAppData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
                
                var chromeExtPath = Path.Combine(localAppData, @"Google\Chrome\User Data\Default\Extensions");
                items.AddRange(await ScanBrowserExtensionFolderAsync(chromeExtPath, "Chrome"));
                
                var edgeExtPath = Path.Combine(localAppData, @"Microsoft\Edge\User Data\Default\Extensions");
                items.AddRange(await ScanBrowserExtensionFolderAsync(edgeExtPath, "Edge"));
                
                var firefoxProfilesPath = Path.Combine(roamingAppData, @"Mozilla\Firefox\Profiles");
                if (Directory.Exists(firefoxProfilesPath))
                {
                    foreach (var profileDir in Directory.GetDirectories(firefoxProfilesPath))
                    {
                        var extensionsDir = Path.Combine(profileDir, "extensions");
                        items.AddRange(await ScanBrowserExtensionFolderAsync(extensionsDir, "Firefox"));
                    }
                }
                
                _logger.LogSuccess($"[AdwareScanner] Browser scan concluído: {items.Count} extensões suspeitas");
                _securityLog.LogScanCompleted("AdwareScanner-Browser", 0, items.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError("[AdwareScanner] Erro no scan de extensões de browser", ex);
            }
            return items;
        }
        
        private async Task<List<AdwareItem>> ScanBrowserExtensionFolderAsync(string extensionsPath, string browserName)
        {
            var items = new List<AdwareItem>();
            if (!Directory.Exists(extensionsPath)) return items;
            
            await Task.Run(() =>
            {
                try
                {
                    foreach (var extDir in Directory.GetDirectories(extensionsPath))
                    {
                        var manifestFiles = Directory.GetFiles(extDir, "manifest.json", SearchOption.AllDirectories);
                        foreach (var manifest in manifestFiles)
                        {
                            try
                            {
                                var content = File.ReadAllText(manifest).ToLowerInvariant();
                                if (_adwarePatterns.Any(p => content.Contains(p)))
                                {
                                    var item = new AdwareItem
                                    {
                                        Name = $"Extensão suspeita ({browserName})",
                                        Path = extDir,
                                        Type = AdwareType.Directory,
                                        Severity = AdwareSeverity.Medium
                                    };
                                    items.Add(item);
                                    _logger.LogWarning($"[AdwareScanner] Extensão suspeita em {browserName}: {extDir}");
                                    _securityLog.LogSecurityEvent("AdwareScanner", "SUSPICIOUS_EXTENSION", $"{browserName}: {extDir}");
                                    AdwareDetected?.Invoke(this, new AdwareDetectedEventArgs { Name = item.Name, Path = extDir });
                                    break;
                                }
                            }
                            catch { }
                        }
                    }
                }
                catch { }
            });
            return items;
        }
        
        /// <summary>
        /// Escaneia Scheduled Tasks suspeitas no Windows
        /// </summary>
        public async Task<List<AdwareItem>> ScanScheduledTasksAsync()
        {
            var items = new List<AdwareItem>();
            try
            {
                _logger.LogInfo("[AdwareScanner] Escaneando tarefas agendadas...");
                var tasksPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), @"System32\Tasks");
                
                if (Directory.Exists(tasksPath))
                {
                    items = await Task.Run(() =>
                    {
                        var found = new List<AdwareItem>();
                        try
                        {
                            var taskFiles = Directory.GetFiles(tasksPath, "*", SearchOption.AllDirectories);
                            foreach (var taskFile in taskFiles)
                            {
                                try
                                {
                                    var content = File.ReadAllText(taskFile).ToLowerInvariant();
                                    var fileName = Path.GetFileName(taskFile).ToLowerInvariant();
                                    if (_adwarePatterns.Any(p => content.Contains(p) || fileName.Contains(p)))
                                    {
                                        var item = new AdwareItem
                                        {
                                            Name = "Tarefa agendada suspeita",
                                            Path = taskFile,
                                            Type = AdwareType.File,
                                            Severity = AdwareSeverity.Medium
                                        };
                                        found.Add(item);
                                        _logger.LogWarning($"[AdwareScanner] Tarefa agendada suspeita: {taskFile}");
                                        _securityLog.LogSecurityEvent("AdwareScanner", "SUSPICIOUS_TASK", taskFile);
                                    }
                                }
                                catch { }
                            }
                        }
                        catch (UnauthorizedAccessException)
                        {
                            _logger.LogWarning("[AdwareScanner] Sem permissão para escanear todas as tarefas agendadas");
                        }
                        return found;
                    });
                }
                _logger.LogSuccess($"[AdwareScanner] Scan de tarefas concluído: {items.Count} suspeitas");
                _securityLog.LogScanCompleted("AdwareScanner-Tasks", 0, items.Count);
            }
            catch (Exception ex)
            {
                _logger.LogError("[AdwareScanner] Erro no scan de tarefas agendadas", ex);
            }
            return items;
        }
        
        private async Task<List<AdwareItem>> ScanProgramFilesAsync()
        {
            var items = new List<AdwareItem>();
            
            var programFiles = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles);
            items.AddRange(await ScanDirectoryForAdwareAsync(programFiles, searchDepth: 2));
            
            var programFilesX86 = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86);
            if (Directory.Exists(programFilesX86))
            {
                items.AddRange(await ScanDirectoryForAdwareAsync(programFilesX86, searchDepth: 2));
            }
            
            return items;
        }
        
        private async Task<List<AdwareItem>> ScanAppDataAsync()
        {
            var items = new List<AdwareItem>();
            
            var localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
            items.AddRange(await ScanDirectoryForAdwareAsync(localAppData, searchDepth: 2));
            
            var roamingAppData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            items.AddRange(await ScanDirectoryForAdwareAsync(roamingAppData, searchDepth: 2));
            
            return items;
        }
        
        private async Task<List<AdwareItem>> ScanProgramDataAsync()
        {
            var items = new List<AdwareItem>();
            
            var programData = Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData);
            items.AddRange(await ScanDirectoryForAdwareAsync(programData, searchDepth: 2));
            
            return items;
        }
        
        private async Task<List<AdwareItem>> ScanRegistryAsync()
        {
            var items = new List<AdwareItem>();
            
            await Task.Run(() =>
            {
                try
                {
                    var registryPaths = new[]
                    {
                        @"SOFTWARE",
                        @"SOFTWARE\WOW6432Node"
                    };
                    
                    foreach (var basePath in registryPaths)
                    {
                        try
                        {
                            using var key = Registry.LocalMachine.OpenSubKey(basePath);
                            if (key == null) continue;
                            
                            foreach (var subKeyName in key.GetSubKeyNames())
                            {
                                if (IsAdwareRegistryKey(subKeyName))
                                {
                                    var item = new AdwareItem
                                    {
                                        Name = subKeyName,
                                        Path = $@"HKLM\{basePath}\{subKeyName}",
                                        Type = AdwareType.RegistryKey,
                                        Severity = AdwareSeverity.Medium
                                    };
                                    
                                    items.Add(item);
                                    _logger.LogWarning($"[AdwareScanner] Registry adware: {subKeyName}");
                                }
                            }
                        }
                        catch
                        {
                            // Ignorar erros de acesso
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError("[AdwareScanner] Erro no scan de registry", ex);
                }
            });
            
            return items;
        }
        
        private async Task<int> ScanDirectoryAsync(string path, int searchDepth)
        {
            var items = await ScanDirectoryForAdwareAsync(path, searchDepth);
            return items.Count;
        }
        
        private async Task<List<AdwareItem>> ScanDirectoryForAdwareAsync(string path, int searchDepth)
        {
            var items = new List<AdwareItem>();
            
            try
            {
                if (!Directory.Exists(path))
                    return items;
                
                // Filtrar junction points e symlinks que causam "Access denied"
                var dirInfo = new DirectoryInfo(path);
                if (dirInfo.Attributes.HasFlag(FileAttributes.ReparsePoint))
                    return items;
                
                string[] directories;
                try
                {
                    directories = Directory.GetDirectories(path);
                }
                catch (UnauthorizedAccessException)
                {
                    // Silenciar erros de acesso negado em diretórios protegidos do sistema
                    return items;
                }
                
                foreach (var dir in directories)
                {
                    try
                    {
                        // Pular junction points/symlinks dentro do diretório
                        var subDirInfo = new DirectoryInfo(dir);
                        if (subDirInfo.Attributes.HasFlag(FileAttributes.ReparsePoint))
                            continue;
                        
                        var dirName = Path.GetFileName(dir).ToLowerInvariant();
                        
                        if (IsAdwareDirectory(dirName))
                        {
                            var item = new AdwareItem
                            {
                                Name = Path.GetFileName(dir),
                                Path = dir,
                                Type = AdwareType.Directory,
                                Severity = DetermineSeverity(dirName)
                            };
                            
                            items.Add(item);
                            _logger.LogWarning($"[AdwareScanner] Adware detectado: {dir}");
                            
                            AdwareDetected?.Invoke(this, new AdwareDetectedEventArgs
                            {
                                Name = item.Name,
                                Path = dir
                            });
                        }
                        
                        // Scan recursivo limitado
                        if (searchDepth > 0)
                        {
                            var subItems = await ScanDirectoryForAdwareAsync(dir, searchDepth - 1);
                            items.AddRange(subItems);
                        }
                    }
                    catch (UnauthorizedAccessException)
                    {
                        // Silenciar erros de acesso negado em subdiretórios
                    }
                    catch
                    {
                        // Ignorar outros erros de acesso
                    }
                }
            }
            catch (UnauthorizedAccessException)
            {
                // Silenciar - diretórios protegidos do sistema (junction points, etc.)
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[AdwareScanner] Erro ao escanear {path}: {ex.Message}");
            }
            
            return items;
        }
        
        private bool IsAdwareDirectory(string dirName)
        {
            // Verificar whitelist primeiro
            if (_whitelist.Any(safe => dirName.Contains(safe)))
                return false;
            
            return _adwarePatterns.Any(pattern => dirName.Contains(pattern));
        }
        
        private bool IsAdwareRegistryKey(string keyName)
        {
            var keyLower = keyName.ToLowerInvariant();
            
            // Verificar whitelist primeiro
            if (_whitelist.Any(safe => keyLower.Contains(safe)))
                return false;
            
            return _adwarePatterns.Any(pattern => keyLower.Contains(pattern));
        }
        
        private AdwareSeverity DetermineSeverity(string name)
        {
            var highRiskPatterns = new[] { "toolbar", "hijacker", "searchprotect" };
            
            if (highRiskPatterns.Any(p => name.Contains(p)))
                return AdwareSeverity.High;
            
            return AdwareSeverity.Medium;
        }
    }
    
    public class AdwareItem
    {
        public string Name { get; set; }
        public string Path { get; set; }
        public AdwareType Type { get; set; }
        public AdwareSeverity Severity { get; set; }
    }
    
    public enum AdwareType
    {
        Directory,
        RegistryKey,
        File
    }
    
    public enum AdwareSeverity
    {
        Low,
        Medium,
        High
    }
    
    public class AdwareDetectedEventArgs : EventArgs
    {
        public string Name { get; set; }
        public string Path { get; set; }
    }
}
