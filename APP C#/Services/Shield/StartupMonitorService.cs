using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32;
using VoltrisOptimizer.Interfaces;

namespace VoltrisOptimizer.Services.Shield
{
    public class StartupMonitorService
    {
        private readonly ILoggingService _logger;
        private readonly IRegistryService _registry;
        private readonly SecurityLogService _securityLog;
        
        private CancellationTokenSource? _monitoringCts;
        private bool _isMonitoring;
        private bool _lowActivityMode;
        private Dictionary<string, string> _lastKnownStartupEntries = new();
        
        // Intervalo de polling para detectar mudanças no registro (30s normal, 120s gamer)
        private const int NORMAL_POLL_INTERVAL_MS = 30_000;
        private const int GAMER_POLL_INTERVAL_MS = 120_000;
        
        public event EventHandler<StartupChangeDetectedEventArgs>? StartupChangeDetected;
        
        private readonly string[] _startupRegistryKeys = new[]
        {
            @"SOFTWARE\Microsoft\Windows\CurrentVersion\Run",
            @"SOFTWARE\Microsoft\Windows\CurrentVersion\RunOnce",
            @"SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Run"
        };
        
        // Whitelist de publishers/nomes legítimos para reduzir falsos positivos
        private readonly string[] _trustedPublishers = new[]
        {
            "microsoft", "windows", "realtek", "intel", "nvidia", "amd",
            "google chrome", "steam", "discord", "spotify", "onedrive",
            "security health", "windowsdefender", "cortana"
        };
        
        public StartupMonitorService(ILoggingService logger, IRegistryService registry, SecurityLogService securityLog)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _registry = registry ?? throw new ArgumentNullException(nameof(registry));
            _securityLog = securityLog ?? throw new ArgumentNullException(nameof(securityLog));
        }
        
        public async Task StartMonitoringAsync()
        {
            if (_isMonitoring) return;
            
            _logger.LogInfo("[StartupMonitor] Iniciando monitoramento contínuo de inicialização...");
            _securityLog.LogSecurityEvent("StartupMonitor", "MONITORING_STARTED", "Startup monitoring enabled with registry polling");
            
            // Capturar snapshot inicial
            await CaptureStartupSnapshotAsync();
            
            _monitoringCts = new CancellationTokenSource();
            _isMonitoring = true;
            
            // Iniciar polling em background
            _ = Task.Run(() => MonitoringLoopAsync(_monitoringCts.Token));
        }
        
        public Task StopMonitoringAsync()
        {
            if (!_isMonitoring) return Task.CompletedTask;
            
            _logger.LogInfo("[StartupMonitor] Parando monitoramento de inicialização...");
            _monitoringCts?.Cancel();
            _monitoringCts?.Dispose();
            _monitoringCts = null;
            _isMonitoring = false;
            
            _securityLog.LogSecurityEvent("StartupMonitor", "MONITORING_STOPPED", "Startup monitoring disabled");
            return Task.CompletedTask;
        }
        
        public void SetLowActivityMode(bool enabled)
        {
            _lowActivityMode = enabled;
            _logger.LogInfo($"[StartupMonitor] Modo baixa atividade: {enabled}");
        }
        
        private async Task MonitoringLoopAsync(CancellationToken ct)
        {
            while (!ct.IsCancellationRequested)
            {
                try
                {
                    var interval = _lowActivityMode ? GAMER_POLL_INTERVAL_MS : NORMAL_POLL_INTERVAL_MS;
                    await Task.Delay(interval, ct);
                    
                    if (ct.IsCancellationRequested) break;
                    
                    await DetectStartupChangesAsync();
                }
                catch (OperationCanceledException) { break; }
                catch (Exception ex)
                {
                    _logger.LogError("[StartupMonitor] Erro no loop de monitoramento", ex);
                    try { await Task.Delay(5000, ct); } catch { break; }
                }
            }
        }
        
        private async Task CaptureStartupSnapshotAsync()
        {
            var items = await GetAllStartupItemsAsync();
            _lastKnownStartupEntries.Clear();
            foreach (var item in items)
            {
                var key = $"{item.RegistryHive}|{item.RegistryPath}|{item.Name}";
                _lastKnownStartupEntries[key] = item.Path;
            }
        }
        
        private async Task DetectStartupChangesAsync()
        {
            var currentItems = await GetAllStartupItemsAsync();
            var currentEntries = new Dictionary<string, string>();
            
            foreach (var item in currentItems)
            {
                var key = $"{item.RegistryHive}|{item.RegistryPath}|{item.Name}";
                currentEntries[key] = item.Path;
                
                // Detectar novas entradas
                if (!_lastKnownStartupEntries.ContainsKey(key))
                {
                    _logger.LogWarning($"[StartupMonitor] Nova entrada de startup detectada: {item.Name} -> {item.Path}");
                    _securityLog.LogStartupChange("NEW_ENTRY_DETECTED", item.Name, item.Path);
                    
                    StartupChangeDetected?.Invoke(this, new StartupChangeDetectedEventArgs
                    {
                        ChangeType = "ADDED",
                        ItemName = item.Name,
                        ItemPath = item.Path,
                        IsSuspicious = item.IsSuspicious
                    });
                }
            }
            
            // Detectar entradas removidas
            foreach (var kvp in _lastKnownStartupEntries)
            {
                if (!currentEntries.ContainsKey(kvp.Key))
                {
                    _logger.LogInfo($"[StartupMonitor] Entrada de startup removida: {kvp.Key}");
                    _securityLog.LogStartupChange("ENTRY_REMOVED", kvp.Key, kvp.Value);
                }
            }
            
            _lastKnownStartupEntries = currentEntries;
        }
        
        public async Task<List<StartupItem>> GetAllStartupItemsAsync()
        {
            var items = new List<StartupItem>();
            
            try
            {
                _logger.LogInfo("[StartupMonitor] Obtendo itens de inicialização...");
                
                // Registry HKLM
                items.AddRange(await GetRegistryStartupItemsAsync(RegistryHive.LocalMachine));
                
                // Registry HKCU
                items.AddRange(await GetRegistryStartupItemsAsync(RegistryHive.CurrentUser));
                
                // Startup folders
                items.AddRange(GetStartupFolderItems());
                
                _logger.LogSuccess($"[StartupMonitor] {items.Count} itens encontrados");
                _securityLog.LogScanCompleted("StartupMonitor", items.Count, items.Count(i => i.IsSuspicious));
            }
            catch (Exception ex)
            {
                _logger.LogError("[StartupMonitor] Erro ao obter itens", ex);
            }
            
            return items;
        }
        
        public async Task<int> ScanStartupItemsAsync()
        {
            var items = await GetAllStartupItemsAsync();
            return items.Count(i => i.IsSuspicious);
        }
        
        public async Task<bool> DisableStartupItemAsync(StartupItem item)
        {
            try
            {
                if (item.Location == StartupLocation.Registry)
                {
                    return await DisableRegistryStartupAsync(item);
                }
                else if (item.Location == StartupLocation.StartupFolder)
                {
                    return DisableStartupFolderItem(item);
                }
                
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[StartupMonitor] Erro ao desativar {item.Name}", ex);
                return false;
            }
        }
        
        public async Task<bool> RemoveStartupItemAsync(StartupItem item)
        {
            try
            {
                if (item.Location == StartupLocation.Registry)
                {
                    return await RemoveRegistryStartupAsync(item);
                }
                else if (item.Location == StartupLocation.StartupFolder)
                {
                    return RemoveStartupFolderItem(item);
                }
                
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[StartupMonitor] Erro ao remover {item.Name}", ex);
                return false;
            }
        }
        
        private async Task<List<StartupItem>> GetRegistryStartupItemsAsync(RegistryHive hive)
        {
            var items = new List<StartupItem>();
            
            await Task.Run(() =>
            {
                try
                {
                    using var baseKey = hive == RegistryHive.LocalMachine 
                        ? RegistryKey.OpenBaseKey(RegistryHive.LocalMachine, RegistryView.Registry64)
                        : RegistryKey.OpenBaseKey(RegistryHive.CurrentUser, RegistryView.Registry64);
                    
                    foreach (var keyPath in _startupRegistryKeys)
                    {
                        try
                        {
                            using var key = baseKey.OpenSubKey(keyPath);
                            if (key == null) continue;
                            
                            foreach (var valueName in key.GetValueNames())
                            {
                                var value = key.GetValue(valueName)?.ToString() ?? string.Empty;
                                
                                var item = new StartupItem
                                {
                                    Name = valueName,
                                    Path = value,
                                    Location = StartupLocation.Registry,
                                    RegistryHive = hive,
                                    RegistryPath = keyPath,
                                    IsEnabled = true,
                                    IsSuspicious = IsSuspiciousStartupItem(valueName, value)
                                };
                                
                                items.Add(item);
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"[StartupMonitor] Erro ao ler {keyPath}: {ex.Message}");
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[StartupMonitor] Erro ao acessar registry {hive}", ex);
                }
            });
            
            return items;
        }
        
        private List<StartupItem> GetStartupFolderItems()
        {
            var items = new List<StartupItem>();
            
            try
            {
                var startupFolders = new[]
                {
                    Environment.GetFolderPath(Environment.SpecialFolder.Startup),
                    Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonStartup))
                };
                
                foreach (var folder in startupFolders)
                {
                    if (!Directory.Exists(folder)) continue;
                    
                    var files = Directory.GetFiles(folder, "*.*", SearchOption.TopDirectoryOnly);
                    
                    foreach (var file in files)
                    {
                        var item = new StartupItem
                        {
                            Name = Path.GetFileNameWithoutExtension(file),
                            Path = file,
                            Location = StartupLocation.StartupFolder,
                            IsEnabled = true,
                            IsSuspicious = IsSuspiciousStartupItem(Path.GetFileName(file), file)
                        };
                        
                        items.Add(item);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("[StartupMonitor] Erro ao ler pastas de inicialização", ex);
            }
            
            return items;
        }
        
        private bool IsSuspiciousStartupItem(string name, string path)
        {
            var nameLower = name.ToLowerInvariant();
            var pathLower = path.ToLowerInvariant();
            
            // Verificar whitelist primeiro — publishers confiáveis não são suspeitos
            if (_trustedPublishers.Any(tp => nameLower.Contains(tp) || pathLower.Contains(tp)))
                return false;
            
            // Verificar se o executável existe no caminho especificado
            var executablePath = ExtractExecutablePath(path);
            bool executableMissing = !string.IsNullOrEmpty(executablePath) && !File.Exists(executablePath);
            
            // Keywords de alta confiança (quase sempre maliciosas)
            var highConfidenceKeywords = new[] { "toolbar", "adware", "browser helper", "conduit", "babylon", "mindspark", "searchprotect" };
            if (highConfidenceKeywords.Any(k => nameLower.Contains(k) || pathLower.Contains(k)))
                return true;
            
            // Executável apontando para Temp ou AppData com nome genérico
            if (pathLower.Contains(@"\temp\") || pathLower.Contains(@"\appdata\local\temp\"))
                return true;
            
            // Executável não encontrado no disco (entrada órfã)
            if (executableMissing)
                return true;
            
            return false;
        }
        
        private string ExtractExecutablePath(string commandLine)
        {
            if (string.IsNullOrWhiteSpace(commandLine)) return string.Empty;
            
            // Remover aspas e argumentos
            var trimmed = commandLine.Trim();
            if (trimmed.StartsWith("\""))
            {
                var endQuote = trimmed.IndexOf('"', 1);
                if (endQuote > 0) return trimmed.Substring(1, endQuote - 1);
            }
            
            // Sem aspas — pegar até o primeiro espaço seguido de argumento
            var spaceIdx = trimmed.IndexOf(' ');
            return spaceIdx > 0 ? trimmed.Substring(0, spaceIdx) : trimmed;
        }
        
        private async Task<bool> DisableRegistryStartupAsync(StartupItem item)
        {
            try
            {
                // Backup do valor original antes de desativar
                var backup = _registry.BackupValue(item.RegistryHive, item.RegistryPath, item.Name);
                
                // Ler o valor atual
                var currentValue = _registry.GetValue<string>(item.RegistryHive, item.RegistryPath, item.Name);
                if (currentValue == null)
                {
                    _logger.LogWarning($"[StartupMonitor] Valor não encontrado para desativar: {item.Name}");
                    return false;
                }
                
                // Estratégia: remover o valor original e criar um com prefixo _DISABLED_
                // Isso é o mesmo padrão usado pelo Autoruns da Microsoft
                var deleteResult = _registry.DeleteValue(item.RegistryHive, item.RegistryPath, item.Name);
                if (!deleteResult.Success)
                {
                    _logger.LogWarning($"[StartupMonitor] Falha ao deletar valor original: {deleteResult.Message}");
                    return false;
                }
                
                var disabledName = $"_DISABLED_{item.Name}";
                var setResult = _registry.SetValue(item.RegistryHive, item.RegistryPath, disabledName, currentValue, RegistryValueKind.String);
                if (!setResult.Success)
                {
                    // Rollback — restaurar o valor original
                    _registry.RestoreValue(backup);
                    _logger.LogWarning($"[StartupMonitor] Falha ao criar valor desativado, rollback executado: {setResult.Message}");
                    return false;
                }
                
                _securityLog.LogStartupChange("DISABLED", item.Name, item.Path);
                _logger.LogSuccess($"[StartupMonitor] Item desativado com sucesso: {item.Name}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[StartupMonitor] Erro ao desativar {item.Name}", ex);
                return false;
            }
        }
        
        private async Task<bool> RemoveRegistryStartupAsync(StartupItem item)
        {
            try
            {
                // Backup antes de remover
                _registry.BackupValue(item.RegistryHive, item.RegistryPath, item.Name);
                
                var result = _registry.DeleteValue(item.RegistryHive, item.RegistryPath, item.Name);
                if (!result.Success)
                {
                    _logger.LogWarning($"[StartupMonitor] Falha ao remover valor do registro: {result.Message}");
                    return false;
                }
                
                _securityLog.LogStartupChange("REMOVED", item.Name, item.Path);
                _logger.LogSuccess($"[StartupMonitor] Item removido do registro com sucesso: {item.Name}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[StartupMonitor] Erro ao remover {item.Name}", ex);
                return false;
            }
        }
        
        private bool DisableStartupFolderItem(StartupItem item)
        {
            try
            {
                var newPath = item.Path + ".disabled";
                File.Move(item.Path, newPath);
                
                _securityLog.LogStartupChange("DISABLED", item.Name, item.Path);
                _logger.LogInfo($"[StartupMonitor] Item desativado: {item.Name}");
                
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[StartupMonitor] Erro ao desativar {item.Name}", ex);
                return false;
            }
        }
        
        private bool RemoveStartupFolderItem(StartupItem item)
        {
            try
            {
                File.Delete(item.Path);
                
                _securityLog.LogStartupChange("REMOVED", item.Name, item.Path);
                _logger.LogInfo($"[StartupMonitor] Item removido: {item.Name}");
                
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[StartupMonitor] Erro ao remover {item.Name}", ex);
                return false;
            }
        }
    }
    
    public class StartupItem
    {
        public string Name { get; set; }
        public string Path { get; set; }
        public StartupLocation Location { get; set; }
        public RegistryHive RegistryHive { get; set; }
        public string RegistryPath { get; set; }
        public bool IsEnabled { get; set; }
        public bool IsSuspicious { get; set; }
        public string Publisher { get; set; } = "Desconhecido";
    }
    
    public enum StartupLocation
    {
        Registry,
        StartupFolder
    }
    
    public class StartupChangeDetectedEventArgs : EventArgs
    {
        public string ChangeType { get; set; } = string.Empty;
        public string ItemName { get; set; } = string.Empty;
        public string ItemPath { get; set; } = string.Empty;
        public bool IsSuspicious { get; set; }
    }
}
