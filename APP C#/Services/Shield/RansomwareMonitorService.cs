using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services.Shield.Network;

namespace VoltrisOptimizer.Services.Shield
{
    public class RansomwareMonitorService
    {
        private readonly ILoggingService _logger;
        private readonly SecurityLogService _securityLog;
        private readonly List<FileSystemWatcher> _watchers;
        private readonly ConcurrentDictionary<string, FileActivityTracker> _activityTrackers;
        
        private bool _isMonitoring;
        private bool _lowActivityMode;
        
        // Thresholds para detecção (relaxados em modo gamer)
        private const int NORMAL_FILE_COUNT_THRESHOLD = 50;
        private const int GAMER_FILE_COUNT_THRESHOLD = 100;
        private const int SUSPICIOUS_TIME_WINDOW_SECONDS = 10;
        
        private readonly string[] _suspiciousExtensions = new[]
        {
            ".encrypted", ".locked", ".crypto", ".crypt", ".crypted",
            ".cerber", ".locky", ".zepto", ".odin",
            ".zzzzz", ".aaa", ".abc", ".xyz", ".exx", ".ezz",
            ".wncry", ".wcry", ".wncryt", ".lock", ".enc"
        };
        
        public event EventHandler<RansomwareAlertEventArgs> SuspiciousActivityDetected;
        public event EventHandler<MonitoringStatusChangedEventArgs> StatusChanged;
        
        public bool IsMonitoring => _isMonitoring;
        
        public RansomwareMonitorService(ILoggingService logger, SecurityLogService securityLog)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _securityLog = securityLog ?? throw new ArgumentNullException(nameof(securityLog));
            _watchers = new List<FileSystemWatcher>();
            _activityTrackers = new ConcurrentDictionary<string, FileActivityTracker>();
        }
        
        public Task StartMonitoringAsync()
        {
            if (_isMonitoring)
                return Task.CompletedTask;
            
            try
            {
                _logger.LogInfo("[RansomwareMonitor] Iniciando monitoramento...");
                
                // Monitorar pastas críticas do usuário
                var foldersToMonitor = new List<string>
                {
                    Environment.GetFolderPath(Environment.SpecialFolder.Desktop),
                    Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments),
                    Environment.GetFolderPath(Environment.SpecialFolder.MyPictures),
                    Environment.GetFolderPath(Environment.SpecialFolder.MyMusic),
                    Environment.GetFolderPath(Environment.SpecialFolder.MyVideos)
                };
                
                // Monitorar drives adicionais (D:, E:, etc.)
                try
                {
                    foreach (var drive in System.IO.DriveInfo.GetDrives())
                    {
                        if (drive.IsReady && drive.DriveType == DriveType.Fixed && drive.Name != @"C:\")
                        {
                            foldersToMonitor.Add(drive.RootDirectory.FullName);
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[RansomwareMonitor] Erro ao enumerar drives: {ex.Message}");
                }
                
                foreach (var folder in foldersToMonitor)
                {
                    if (!string.IsNullOrEmpty(folder) && Directory.Exists(folder))
                    {
                        AddWatcher(folder);
                    }
                }
                
                _isMonitoring = true;
                _securityLog.LogSecurityEvent("RansomwareDetector", "MONITORING_STARTED", $"Monitoring {_watchers.Count} folders");
                _logger.LogSuccess($"[RansomwareMonitor] Monitoramento ativo em {_watchers.Count} pastas");
                
                // Disparar evento de mudança de status
                StatusChanged?.Invoke(this, new MonitoringStatusChangedEventArgs { IsActive = true });
                
                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError("[RansomwareMonitor] Erro ao iniciar monitoramento", ex);
                throw;
            }
        }
        
        public Task StopMonitoringAsync()
        {
            if (!_isMonitoring)
                return Task.CompletedTask;
            
            try
            {
                _logger.LogInfo("[RansomwareMonitor] Parando monitoramento...");
                
                foreach (var watcher in _watchers)
                {
                    watcher.EnableRaisingEvents = false;
                    watcher.Dispose();
                }
                
                _watchers.Clear();
                _activityTrackers.Clear();
                _isMonitoring = false;
                
                _securityLog.LogSecurityEvent("RansomwareDetector", "MONITORING_STOPPED", "Monitoring disabled");
                _logger.LogInfo("[RansomwareMonitor] Monitoramento parado");
                
                // Disparar evento de mudança de status
                StatusChanged?.Invoke(this, new MonitoringStatusChangedEventArgs { IsActive = false });
                
                return Task.CompletedTask;
            }
            catch (Exception ex)
            {
                _logger.LogError("[RansomwareMonitor] Erro ao parar monitoramento", ex);
                throw;
            }
        }
        
        private void AddWatcher(string path)
        {
            try
            {
                var watcher = new FileSystemWatcher(path)
                {
                    NotifyFilter = NotifyFilters.FileName | NotifyFilters.LastWrite | NotifyFilters.CreationTime,
                    IncludeSubdirectories = true,
                    InternalBufferSize = 32768
                };
                
                watcher.Created += OnFileCreated;
                watcher.Changed += OnFileChanged;
                watcher.Renamed += OnFileRenamed;
                watcher.Error += OnWatcherError;
                
                watcher.EnableRaisingEvents = true;
                _watchers.Add(watcher);
                
                _logger.LogInfo($"[RansomwareMonitor] Monitorando: {path}");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[RansomwareMonitor] Não foi possível monitorar {path}: {ex.Message}");
            }
        }
        
        public void SetLowActivityMode(bool enabled)
        {
            _lowActivityMode = enabled;
            _logger.LogInfo($"[RansomwareMonitor] Modo baixa atividade: {enabled}");
        }
        
        private void OnWatcherError(object sender, ErrorEventArgs e)
        {
            var ex = e.GetException();
            
            // Buffer overflow — muitas mudanças simultâneas, não é erro crítico
            if (ex is InternalBufferOverflowException)
            {
                _logger.LogInfo($"[RansomwareMonitor] Buffer overflow no FileSystemWatcher (muitas mudanças simultâneas). Monitoramento continua.");
                
                // Tentar recriar o watcher com buffer maior
                if (sender is FileSystemWatcher faulted && Directory.Exists(faulted.Path))
                {
                    try
                    {
                        var path = faulted.Path;
                        faulted.EnableRaisingEvents = false;
                        faulted.Dispose();
                        _watchers.Remove(faulted);
                        
                        var replacement = new FileSystemWatcher(path)
                        {
                            NotifyFilter = NotifyFilters.FileName | NotifyFilters.LastWrite | NotifyFilters.CreationTime,
                            IncludeSubdirectories = true,
                            InternalBufferSize = 65536 // Dobrar o buffer (64KB)
                        };
                        replacement.Created += OnFileCreated;
                        replacement.Changed += OnFileChanged;
                        replacement.Renamed += OnFileRenamed;
                        replacement.Error += OnWatcherError;
                        replacement.EnableRaisingEvents = true;
                        _watchers.Add(replacement);
                    }
                    catch { /* Se falhar ao recriar, o monitoramento continua nas outras pastas */ }
                }
                return;
            }
            
            // Dispositivo inexistente (drive removido/desconectado) — não é erro
            if (ex is System.ComponentModel.Win32Exception || ex.Message.Contains("dispositivo inexistente", StringComparison.OrdinalIgnoreCase))
            {
                _logger.LogInfo($"[RansomwareMonitor] Drive desconectado ou inacessível. Removendo watcher.");
                if (sender is FileSystemWatcher detached)
                {
                    try
                    {
                        detached.EnableRaisingEvents = false;
                        detached.Dispose();
                        _watchers.Remove(detached);
                    }
                    catch { }
                }
                return;
            }
            
            _logger.LogWarning($"[RansomwareMonitor] Erro no FileSystemWatcher: {ex.Message}");
        }
        
        private void OnFileCreated(object sender, FileSystemEventArgs e)
        {
            TrackFileActivity(e.FullPath, "CREATED");
        }
        
        private void OnFileChanged(object sender, FileSystemEventArgs e)
        {
            TrackFileActivity(e.FullPath, "MODIFIED");
        }
        
        private void OnFileRenamed(object sender, RenamedEventArgs e)
        {
            // Verificar se foi renomeado para extensão suspeita
            if (IsSuspiciousExtension(e.FullPath))
            {
                _logger.LogWarning($"[RansomwareMonitor] Arquivo renomeado para extensão suspeita: {e.FullPath}");
                _securityLog.LogRansomwareAlert("Unknown", $"File renamed to suspicious extension: {e.Name}");
                
                RaiseSuspiciousActivityAlert("Suspicious file extension detected", e.FullPath);
            }
        }
        
        private void TrackFileActivity(string filePath, string activityType)
        {
            try
            {
                var directory = Path.GetDirectoryName(filePath);
                if (string.IsNullOrEmpty(directory))
                    return;
                
                var tracker = _activityTrackers.GetOrAdd(directory, _ => new FileActivityTracker());
                tracker.RecordActivity();
                
                // Threshold dinâmico: mais tolerante em modo gamer
                var threshold = _lowActivityMode ? GAMER_FILE_COUNT_THRESHOLD : NORMAL_FILE_COUNT_THRESHOLD;
                
                // Verificar se há atividade suspeita
                if (tracker.GetRecentActivityCount(SUSPICIOUS_TIME_WINDOW_SECONDS) > threshold)
                {
                    _logger.LogWarning($"[RansomwareMonitor] Atividade massiva detectada em: {directory}");
                    _securityLog.LogRansomwareAlert("Unknown", $"Mass file activity in {directory}: {tracker.GetRecentActivityCount(SUSPICIOUS_TIME_WINDOW_SECONDS)} files in {SUSPICIOUS_TIME_WINDOW_SECONDS}s");
                    
                    RaiseSuspiciousActivityAlert("Mass file modification detected", directory);
                    
                    // Reset tracker para evitar alertas repetidos
                    tracker.Reset();
                }
            }
            catch
            {
                // Ignorar erros
            }
        }
        
        private bool IsSuspiciousExtension(string filePath)
        {
            var extension = Path.GetExtension(filePath).ToLowerInvariant();
            return _suspiciousExtensions.Any(ext => ext == extension);
        }
        
        private void RaiseSuspiciousActivityAlert(string alertType, string details)
        {
            SuspiciousActivityDetected?.Invoke(this, new RansomwareAlertEventArgs
            {
                AlertType = alertType,
                Details = details,
                Timestamp = DateTime.Now
            });
        }
    }
    
    public class FileActivityTracker
    {
        private readonly List<DateTime> _activities = new List<DateTime>();
        private readonly object _lock = new object();
        
        public void RecordActivity()
        {
            lock (_lock)
            {
                _activities.Add(DateTime.Now);
                
                // Limpar atividades antigas (mais de 1 minuto)
                _activities.RemoveAll(a => (DateTime.Now - a).TotalSeconds > 60);
            }
        }
        
        public int GetRecentActivityCount(int seconds)
        {
            lock (_lock)
            {
                var cutoff = DateTime.Now.AddSeconds(-seconds);
                return _activities.Count(a => a >= cutoff);
            }
        }
        
        public void Reset()
        {
            lock (_lock)
            {
                _activities.Clear();
            }
        }
    }
    
    public class RansomwareAlertEventArgs : EventArgs
    {
        public string AlertType { get; set; }
        public string Details { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
