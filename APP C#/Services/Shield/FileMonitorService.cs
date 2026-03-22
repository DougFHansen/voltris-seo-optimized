using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Cryptography;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Interfaces;

namespace VoltrisOptimizer.Services.Shield
{
    /// <summary>
    /// Serviço de monitoramento de arquivos em tempo real
    /// </summary>
    public class FileMonitorService
    {
        private readonly ILoggingService _logger;
        private readonly ConcurrentDictionary<string, string> _fileHashCache;
        private readonly List<FileSystemWatcher> _watchers;
        private readonly List<string> _watchedPaths;
        private bool _isMonitoring;
        private bool _lowActivityMode;
        private CancellationTokenSource? _healthCheckCts;
        
        // Padrões suspeitos — extensões executáveis
        private readonly string[] _suspiciousExtensions = { ".exe", ".dll", ".scr", ".bat", ".cmd", ".vbs", ".js", ".ps1", ".msi" };
        
        // Keywords de alta confiança no nome do arquivo
        private readonly string[] _highConfidenceKeywords = { "crack", "keygen", "patch", "hack", "cheat", "activator", "loader", "injector" };
        
        // Locais suspeitos — executáveis não deveriam estar aqui
        private readonly string[] _suspiciousLocations = { @"\temp\", @"\tmp\", @"\appdata\local\temp\" };
        
        public event EventHandler<SuspiciousFileEventArgs>? SuspiciousFileDetected;
        
        public FileMonitorService(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _fileHashCache = new ConcurrentDictionary<string, string>();
            _watchers = new List<FileSystemWatcher>();
            _watchedPaths = new List<string>();
        }
        
        /// <summary>
        /// Inicia o monitoramento de arquivos
        /// </summary>
        public Task StartMonitoringAsync()
        {
            if (_isMonitoring)
                return Task.CompletedTask;
            
            try
            {
                _logger.LogInfo("[FileMonitor] Iniciando monitoramento de arquivos...");
                
                // Monitorar Downloads
                var downloadsPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile), "Downloads");
                if (Directory.Exists(downloadsPath))
                    AddWatcher(downloadsPath, includeSubdirs: true);
                
                // Monitorar Temp
                var tempPath = Path.GetTempPath();
                if (Directory.Exists(tempPath))
                    AddWatcher(tempPath, includeSubdirs: true);
                
                // Monitorar Desktop (ransomware e droppers frequentemente usam)
                var desktopPath = Environment.GetFolderPath(Environment.SpecialFolder.Desktop);
                if (Directory.Exists(desktopPath))
                    AddWatcher(desktopPath, includeSubdirs: false);
                
                _isMonitoring = true;
                
                // Iniciar health-check dos watchers
                _healthCheckCts = new CancellationTokenSource();
                _ = Task.Run(() => WatcherHealthCheckLoopAsync(_healthCheckCts.Token));
                
                _logger.LogSuccess($"[FileMonitor] Monitoramento ativo em {_watchers.Count} diretórios");
                
                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError("[FileMonitor] Erro ao iniciar monitoramento", ex);
                throw;
            }
        }
        
        /// <summary>
        /// Para o monitoramento
        /// </summary>
        public Task StopMonitoringAsync()
        {
            if (!_isMonitoring)
                return Task.CompletedTask;
            
            try
            {
                _logger.LogInfo("[FileMonitor] Parando monitoramento...");
                
                _healthCheckCts?.Cancel();
                _healthCheckCts?.Dispose();
                _healthCheckCts = null;
                
                foreach (var watcher in _watchers)
                {
                    watcher.EnableRaisingEvents = false;
                    watcher.Dispose();
                }
                
                _watchers.Clear();
                _watchedPaths.Clear();
                _isMonitoring = false;
                
                _logger.LogInfo("[FileMonitor] Monitoramento parado");
                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError("[FileMonitor] Erro ao parar monitoramento", ex);
                throw;
            }
        }
        
        /// <summary>
        /// Define modo de baixa atividade (para modo gamer)
        /// Em modo gamer: monitora apenas keywords de alta confiança, ignora extensões genéricas
        /// </summary>
        public void SetLowActivityMode(bool enabled)
        {
            _lowActivityMode = enabled;
            _logger.LogInfo($"[FileMonitor] Modo baixa atividade: {enabled}");
        }
        
        private void AddWatcher(string path, bool includeSubdirs)
        {
            try
            {
                var watcher = new FileSystemWatcher(path)
                {
                    NotifyFilter = NotifyFilters.FileName | NotifyFilters.CreationTime,
                    IncludeSubdirectories = includeSubdirs,
                    InternalBufferSize = 32768 // 32KB buffer para evitar overflow
                };
                
                watcher.Created += OnFileCreated;
                watcher.Error += OnWatcherError;
                watcher.EnableRaisingEvents = true;
                
                _watchers.Add(watcher);
                _watchedPaths.Add(path);
                _logger.LogInfo($"[FileMonitor] Monitorando: {path} (subdirs: {includeSubdirs})");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[FileMonitor] Não foi possível monitorar {path}: {ex.Message}");
            }
        }
        
        private void OnWatcherError(object sender, ErrorEventArgs e)
        {
            _logger.LogWarning($"[FileMonitor] Erro no FileSystemWatcher: {e.GetException().Message}. Será reiniciado pelo health-check.");
        }
        
        /// <summary>
        /// Health-check periódico: reinicia watchers que falharam
        /// </summary>
        private async Task WatcherHealthCheckLoopAsync(CancellationToken ct)
        {
            while (!ct.IsCancellationRequested)
            {
                try
                {
                    await Task.Delay(60_000, ct); // Verificar a cada 60 segundos
                    
                    for (int i = 0; i < _watchers.Count; i++)
                    {
                        try
                        {
                            // Testar se o watcher ainda está funcional
                            var _ = _watchers[i].EnableRaisingEvents;
                        }
                        catch
                        {
                            // Watcher falhou — reiniciar
                            var path = _watchedPaths[i];
                            _logger.LogWarning($"[FileMonitor] Reiniciando watcher para: {path}");
                            
                            try { _watchers[i].Dispose(); } catch { }
                            
                            var newWatcher = new FileSystemWatcher(path)
                            {
                                NotifyFilter = NotifyFilters.FileName | NotifyFilters.CreationTime,
                                IncludeSubdirectories = true,
                                InternalBufferSize = 32768
                            };
                            newWatcher.Created += OnFileCreated;
                            newWatcher.Error += OnWatcherError;
                            newWatcher.EnableRaisingEvents = true;
                            
                            _watchers[i] = newWatcher;
                            _logger.LogSuccess($"[FileMonitor] Watcher reiniciado: {path}");
                        }
                    }
                }
                catch (OperationCanceledException) { break; }
                catch (Exception ex)
                {
                    _logger.LogError("[FileMonitor] Erro no health-check", ex);
                }
            }
        }
        
        private async void OnFileCreated(object sender, FileSystemEventArgs e)
        {
            try
            {
                // Aguardar arquivo ser completamente escrito
                await Task.Delay(500);
                
                if (!File.Exists(e.FullPath))
                    return;
                
                // Verificar se é suspeito
                var (isSuspicious, reason) = AnalyzeFile(e.FullPath);
                
                if (isSuspicious)
                {
                    _logger.LogWarning($"[FileMonitor] Arquivo suspeito: {e.Name} — {reason}");
                    
                    // Calcular hash para registro
                    var hash = await CalculateFileHashAsync(e.FullPath);
                    _fileHashCache.TryAdd(e.FullPath, hash);
                    
                    // Notificar
                    SuspiciousFileDetected?.Invoke(this, new SuspiciousFileEventArgs
                    {
                        FilePath = e.FullPath,
                        Reason = reason,
                        FileHash = hash
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[FileMonitor] Erro ao processar arquivo {e.Name}", ex);
            }
        }
        
        private (bool isSuspicious, string reason) AnalyzeFile(string filePath)
        {
            try
            {
                var fileName = Path.GetFileName(filePath).ToLowerInvariant();
                var extension = Path.GetExtension(filePath).ToLowerInvariant();
                var fullPathLower = filePath.ToLowerInvariant();

                // Exclusão: scripts temporários gerados internamente pelo Voltris
                if (fileName.StartsWith("voltris_"))
                    return (false, string.Empty);

                // Exclusão: arquivos .ps1 temporários gerados pelo próprio processo Voltris
                // (GameRepairService, AdvancedRepairService, etc. usam Path.GetTempFileName() + ".ps1")
                if (extension == ".ps1" && (fileName.StartsWith("tmp") || fileName.StartsWith("temp")))
                    return (false, string.Empty);

                // DEBUG: Whitelist DISM — o DISM extrai DLLs e EXEs em %TEMP%\{GUID}\ durante execução.
                // Esses arquivos são legítimos e causavam falsos positivos no log (confirmado 16:40:50).
                // Padrão: %TEMP%\{GUID-8-4-4-4-12}\DismHost.exe, DismCore.dll, CbsProvider.dll, etc.
                if (fullPathLower.Contains(@"\temp\") || fullPathLower.Contains(@"\tmp\"))
                {
                    var dismWhitelist = new[] { "dismhost.exe", "dismcore.dll", "dismcoredll", "dismcoredllps.dll",
                        "dismprov.dll", "dmiprovider.dll", "cbsprovider.dll", "appxprovider.dll",
                        "assocprovider.dll", "ffuprovider.dll", "folderprovider.dll", "genericprovider.dll",
                        "ibsprovider.dll", "imagingprovider.dll", "intlprovider.dll", "logprovider.dll",
                        "msiprovider.dll", "offlinesetupprovider.dll", "osprovider.dll", "provprovider.dll",
                        "dismcoreps.dll", "dmiprovider.dll" };
                    if (dismWhitelist.Any(w => fileName == w))
                        return (false, string.Empty);
                    // Padrão genérico: qualquer arquivo dentro de pasta GUID no Temp (ex: E43CBA11-11C9-...)
                    var parent = System.IO.Path.GetDirectoryName(filePath) ?? string.Empty;
                    var parentName = System.IO.Path.GetFileName(parent);
                    if (parentName.Length == 36 && parentName.Count(c => c == '-') == 4)
                        return (false, string.Empty); // pasta GUID = processo do sistema
                }
                
                bool isExecutable = _suspiciousExtensions.Any(ext => ext == extension);
                
                // Critério 1: Keywords de alta confiança no nome (sempre detectar)
                foreach (var keyword in _highConfidenceKeywords)
                {
                    if (fileName.Contains(keyword))
                        return (true, $"Nome contém keyword maliciosa: '{keyword}'");
                }
                
                // Em modo gamer, parar aqui (apenas alta confiança)
                if (_lowActivityMode)
                    return (false, string.Empty);
                
                // Critério 2: Executável em local suspeito (Temp, etc.)
                if (isExecutable && _suspiciousLocations.Any(loc => fullPathLower.Contains(loc)))
                    return (true, $"Executável ({extension}) criado em local temporário");
                
                // Critério 3: Executável com extensão dupla (ex: documento.pdf.exe)
                if (isExecutable)
                {
                    var nameWithoutExt = Path.GetFileNameWithoutExtension(fileName);
                    if (nameWithoutExt.Contains('.'))
                        return (true, $"Extensão dupla detectada: {fileName}");
                }
                
                // Critério 4: Script (.vbs, .js, .ps1, .bat) em Downloads
                var scriptExtensions = new[] { ".vbs", ".js", ".ps1", ".bat", ".cmd" };
                if (scriptExtensions.Contains(extension) && fullPathLower.Contains("downloads"))
                    return (true, $"Script ({extension}) detectado em Downloads");
                
                return (false, string.Empty);
            }
            catch
            {
                return (false, string.Empty);
            }
        }
        
        private async Task<string> CalculateFileHashAsync(string filePath)
        {
            try
            {
                using var sha256 = SHA256.Create();
                using var stream = File.OpenRead(filePath);
                var hash = await sha256.ComputeHashAsync(stream);
                return BitConverter.ToString(hash).Replace("-", "");
            }
            catch
            {
                return string.Empty;
            }
        }
    }
}
