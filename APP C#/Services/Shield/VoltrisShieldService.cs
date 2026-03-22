using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using VoltrisOptimizer.Interfaces;

namespace VoltrisOptimizer.Services.Shield
{
    /// <summary>
    /// Serviço principal do Voltris Shield - Coordenador de proteção
    /// </summary>
    public class VoltrisShieldService : IDisposable
    {
        private readonly ILoggingService _logger;
        private readonly FileMonitorService _fileMonitor;
        private readonly StartupMonitorService _startupMonitor;
        private readonly AdwareScannerService _adwareScanner;
        private readonly DefenderIntegrationService _defenderIntegration;
        private readonly RansomwareMonitorService _ransomwareMonitor;
        private readonly Network.NetworkMonitorService _networkMonitor;
        
        private bool _isProtectionActive;
        private bool _isGamerModeActive;
        private bool _disposed;
        
        public bool IsProtectionActive => _isProtectionActive;
        public DateTime? LastScanTime { get; private set; }
        
        public event EventHandler<ShieldStatusChangedEventArgs>? StatusChanged;
        public event EventHandler<ThreatDetectedEventArgs>? ThreatDetected;
        
        public VoltrisShieldService(
            ILoggingService logger,
            FileMonitorService fileMonitor,
            StartupMonitorService startupMonitor,
            AdwareScannerService adwareScanner,
            DefenderIntegrationService defenderIntegration,
            RansomwareMonitorService ransomwareMonitor,
            Network.NetworkMonitorService networkMonitor)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _fileMonitor = fileMonitor ?? throw new ArgumentNullException(nameof(fileMonitor));
            _startupMonitor = startupMonitor ?? throw new ArgumentNullException(nameof(startupMonitor));
            _adwareScanner = adwareScanner ?? throw new ArgumentNullException(nameof(adwareScanner));
            _defenderIntegration = defenderIntegration ?? throw new ArgumentNullException(nameof(defenderIntegration));
            _ransomwareMonitor = ransomwareMonitor ?? throw new ArgumentNullException(nameof(ransomwareMonitor));
            _networkMonitor = networkMonitor ?? throw new ArgumentNullException(nameof(networkMonitor));
            
            // Conectar eventos
            _fileMonitor.SuspiciousFileDetected += OnSuspiciousFileDetected;
            _adwareScanner.AdwareDetected += OnAdwareDetected;
        }
        
        /// <summary>
        /// Ativa a proteção em tempo real
        /// </summary>
        public async Task<bool> ActivateProtectionAsync()
        {
            try
            {
                _logger.LogInfo("[Shield] Ativando proteção em tempo real...");
                
                // Iniciar monitoramento de arquivos
                await _fileMonitor.StartMonitoringAsync();
                
                // Iniciar monitoramento de inicialização
                await _startupMonitor.StartMonitoringAsync();
                
                _isProtectionActive = true;
                OnStatusChanged(new ShieldStatusChangedEventArgs(true, "Proteção ativa"));
                
                _logger.LogSuccess("[Shield] Proteção ativada com sucesso");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError("[Shield] Erro ao ativar proteção", ex);
                return false;
            }
        }
        
        /// <summary>
        /// Desativa a proteção em tempo real
        /// </summary>
        public async Task<bool> DeactivateProtectionAsync()
        {
            try
            {
                _logger.LogInfo("[Shield] Desativando proteção...");
                
                await _fileMonitor.StopMonitoringAsync();
                await _startupMonitor.StopMonitoringAsync();
                
                _isProtectionActive = false;
                OnStatusChanged(new ShieldStatusChangedEventArgs(false, "Proteção desativada"));
                
                _logger.LogInfo("[Shield] Proteção desativada");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError("[Shield] Erro ao desativar proteção", ex);
                return false;
            }
        }
        
        /// <summary>
        /// Executa scan rápido — Downloads, Temp, Startup e extensões de browser
        /// </summary>
        public async Task<ScanResult> RunQuickScanAsync(Action<int, string>? onProgress = null)
        {
            try
            {
                _logger.LogInfo("[Shield] ═══════════════════════════════════════");
                _logger.LogInfo("[Shield] SCAN RÁPIDO INICIADO");
                _logger.LogInfo("[Shield] ═══════════════════════════════════════");
                
                var result = new ScanResult { ScanType = ScanType.Quick };
                int totalItemsScanned = 0;
                
                // 1. Scan de pastas temporárias
                onProgress?.Invoke(10, "Escaneando pastas temporárias...");
                var tempThreats = await _adwareScanner.ScanTempFoldersAsync();
                AddAdwareToResults(result, tempThreats);
                totalItemsScanned++;
                
                // 2. Scan de Downloads
                onProgress?.Invoke(35, "Escaneando pasta Downloads...");
                var downloadThreats = await _adwareScanner.ScanDownloadsFolderAsync();
                AddAdwareToResults(result, downloadThreats);
                totalItemsScanned++;
                
                // 3. Scan de itens de inicialização
                onProgress?.Invoke(60, "Escaneando itens de inicialização...");
                var startupItems = await _startupMonitor.GetAllStartupItemsAsync();
                foreach (var item in startupItems.Where(i => i.IsSuspicious))
                {
                    result.Threats.Add(new ScanThreatItem
                    {
                        Name = item.Name,
                        Path = item.Path,
                        ThreatType = "Startup",
                        Severity = ThreatSeverity.High
                    });
                    result.ThreatsFound++;
                }
                totalItemsScanned++;
                
                // 4. Scan de extensões de browser
                onProgress?.Invoke(85, "Escaneando extensões de browser...");
                var browserThreats = await _adwareScanner.ScanBrowserExtensionsAsync();
                AddAdwareToResults(result, browserThreats);
                totalItemsScanned++;
                
                LastScanTime = DateTime.Now;
                result.CompletedAt = DateTime.Now;
                result.ItemsScanned = totalItemsScanned;
                
                onProgress?.Invoke(100, $"Concluído: {result.ThreatsFound} ameaças");
                _logger.LogInfo("[Shield] ═══════════════════════════════════════");
                _logger.LogSuccess($"[Shield] SCAN RÁPIDO CONCLUÍDO: {result.ThreatsFound} ameaças em {totalItemsScanned} áreas verificadas");
                _logger.LogInfo("[Shield] ═══════════════════════════════════════");
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError("[Shield] Erro no scan rápido", ex);
                throw;
            }
        }
        
        /// <summary>
        /// Executa scan completo — Sistema inteiro: diretórios, registry, startup, browser, scheduled tasks
        /// </summary>
        public async Task<ScanResult> RunFullScanAsync(Action<int, string>? onProgress = null)
        {
            try
            {
                _logger.LogInfo("[Shield] ═══════════════════════════════════════");
                _logger.LogInfo("[Shield] SCAN COMPLETO INICIADO");
                _logger.LogInfo("[Shield] ═══════════════════════════════════════");
                
                var result = new ScanResult { ScanType = ScanType.Full };
                int totalItemsScanned = 0;
                
                // 1. Scan completo de arquivos
                onProgress?.Invoke(8, "Escaneando sistema de arquivos...");
                var adwareItems = await _adwareScanner.ScanForAdwareAsync();
                AddAdwareToResults(result, adwareItems);
                totalItemsScanned++;
                
                // 2. Scan de inicialização
                onProgress?.Invoke(25, "Escaneando itens de inicialização...");
                var startupItems = await _startupMonitor.GetAllStartupItemsAsync();
                foreach (var item in startupItems.Where(i => i.IsSuspicious))
                {
                    result.Threats.Add(new ScanThreatItem
                    {
                        Name = item.Name,
                        Path = item.Path,
                        ThreatType = "Startup",
                        Severity = ThreatSeverity.High
                    });
                    result.ThreatsFound++;
                }
                totalItemsScanned++;
                
                // 3. Scan de Downloads
                onProgress?.Invoke(42, "Escaneando pasta Downloads...");
                var downloadItems = await _adwareScanner.ScanDownloadsFolderAsync();
                AddAdwareToResults(result, downloadItems);
                totalItemsScanned++;
                
                // 4. Scan de pastas temporárias
                onProgress?.Invoke(58, "Escaneando pastas temporárias...");
                var tempItems = await _adwareScanner.ScanTempFoldersAsync();
                AddAdwareToResults(result, tempItems);
                totalItemsScanned++;
                
                // 5. Scan de extensões de browser
                onProgress?.Invoke(72, "Escaneando extensões de browser...");
                var browserItems = await _adwareScanner.ScanBrowserExtensionsAsync();
                AddAdwareToResults(result, browserItems);
                totalItemsScanned++;
                
                // 6. Scan de Scheduled Tasks
                onProgress?.Invoke(88, "Escaneando tarefas agendadas...");
                var taskItems = await _adwareScanner.ScanScheduledTasksAsync();
                AddAdwareToResults(result, taskItems);
                totalItemsScanned++;
                
                LastScanTime = DateTime.Now;
                result.CompletedAt = DateTime.Now;
                result.ItemsScanned = totalItemsScanned;
                
                onProgress?.Invoke(100, $"Concluído: {result.ThreatsFound} ameaças");
                _logger.LogInfo("[Shield] ═══════════════════════════════════════");
                _logger.LogSuccess($"[Shield] SCAN COMPLETO CONCLUÍDO: {result.ThreatsFound} ameaças em {totalItemsScanned} áreas verificadas");
                _logger.LogInfo("[Shield] ═══════════════════════════════════════");
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError("[Shield] Erro no scan completo", ex);
                throw;
            }
        }
        
        /// <summary>
        /// Executa scan focado em adware
        /// </summary>
        public async Task<ScanResult> RunAdwareScanAsync(Action<int, string>? onProgress = null)
        {
            try
            {
                _logger.LogInfo("[Shield] Iniciando scan de adware...");
                
                var result = new ScanResult { ScanType = ScanType.Adware };
                
                onProgress?.Invoke(15, "Escaneando Program Files...");
                var threats = await _adwareScanner.ScanForAdwareAsync();
                result.ThreatsFound = threats.Count;
                result.ItemsScanned = threats.Count;
                
                // Coletar detalhes das ameaças
                foreach (var item in threats)
                {
                    result.Threats.Add(new ScanThreatItem
                    {
                        Name = item.Name,
                        Path = item.Path,
                        ThreatType = item.Type.ToString(),
                        Severity = item.Severity == AdwareSeverity.High ? ThreatSeverity.High
                                 : item.Severity == AdwareSeverity.Medium ? ThreatSeverity.Medium
                                 : ThreatSeverity.Low
                    });
                }
                
                LastScanTime = DateTime.Now;
                result.CompletedAt = DateTime.Now;
                
                onProgress?.Invoke(100, $"Concluído: {result.ThreatsFound} ameaças");
                _logger.LogSuccess($"[Shield] Scan de adware concluído: {result.ThreatsFound} ameaças encontradas");
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError("[Shield] Erro no scan de adware", ex);
                throw;
            }
        }
        
        /// <summary>
        /// Ativa/desativa modo gamer (reduz atividade em background para todos os módulos)
        /// </summary>
        public void SetGamerMode(bool enabled)
        {
            _isGamerModeActive = enabled;
            
            if (enabled)
            {
                _logger.LogInfo("[Shield] Modo Gamer ativado - reduzindo atividade em todos os módulos");
                _fileMonitor.SetLowActivityMode(true);
                _startupMonitor.SetLowActivityMode(true);
                _adwareScanner.PauseBackgroundScans();
                _ransomwareMonitor.SetLowActivityMode(true);
                _networkMonitor.SetLowActivityMode(true);
            }
            else
            {
                _logger.LogInfo("[Shield] Modo Gamer desativado - atividade normal em todos os módulos");
                _fileMonitor.SetLowActivityMode(false);
                _startupMonitor.SetLowActivityMode(false);
                _adwareScanner.ResumeBackgroundScans();
                _ransomwareMonitor.SetLowActivityMode(false);
                _networkMonitor.SetLowActivityMode(false);
            }
        }
        
        /// <summary>
        /// Obtém status do Windows Defender
        /// </summary>
        public async Task<DefenderStatus> GetDefenderStatusAsync()
        {
            return await _defenderIntegration.GetStatusAsync();
        }
        
        /// <summary>
        /// Inicia scan do Windows Defender
        /// </summary>
        public async Task<bool> StartDefenderScanAsync()
        {
            return await _defenderIntegration.StartQuickScanAsync();
        }
        
        private void OnSuspiciousFileDetected(object? sender, SuspiciousFileEventArgs e)
        {
            _logger.LogWarning($"[Shield] Arquivo suspeito detectado: {e.FilePath}");
            ThreatDetected?.Invoke(this, new ThreatDetectedEventArgs
            {
                ThreatType = "Arquivo Suspeito",
                FilePath = e.FilePath,
                Severity = ThreatSeverity.Medium
            });
        }
        
        private void OnAdwareDetected(object? sender, AdwareDetectedEventArgs e)
        {
            _logger.LogWarning($"[Shield] Adware detectado: {e.Name}");
            ThreatDetected?.Invoke(this, new ThreatDetectedEventArgs
            {
                ThreatType = "Adware",
                FilePath = e.Path,
                Severity = ThreatSeverity.High
            });
        }
        
        private void AddAdwareToResults(ScanResult result, IEnumerable<AdwareItem> items)
        {
            foreach (var item in items)
            {
                // Evitar duplicatas pelo path
                if (result.Threats.Any(t => t.Path.Equals(item.Path, StringComparison.OrdinalIgnoreCase)))
                    continue;

                result.Threats.Add(new ScanThreatItem
                {
                    Name = item.Name,
                    Path = item.Path,
                    ThreatType = item.Type.ToString(),
                    Severity = item.Severity == AdwareSeverity.High ? ThreatSeverity.High
                             : item.Severity == AdwareSeverity.Medium ? ThreatSeverity.Medium
                             : ThreatSeverity.Low
                });
                result.ThreatsFound++;
            }
        }

        private void OnStatusChanged(ShieldStatusChangedEventArgs e)
        {
            StatusChanged?.Invoke(this, e);
        }
        
        /// <summary>
        /// Libera recursos e desconecta event handlers para evitar memory leaks.
        /// </summary>
        public void Dispose()
        {
            if (_disposed) return;
            _disposed = true;
            
            try
            {
                // Desconectar event handlers para evitar leaks
                _fileMonitor.SuspiciousFileDetected -= OnSuspiciousFileDetected;
                _adwareScanner.AdwareDetected -= OnAdwareDetected;
            }
            catch { }
            
            try
            {
                if (_isProtectionActive)
                {
                    _fileMonitor.StopMonitoringAsync().GetAwaiter().GetResult();
                    _startupMonitor.StopMonitoringAsync().GetAwaiter().GetResult();
                }
            }
            catch { }
        }
    }
    
    #region Event Args
    
    public class ShieldStatusChangedEventArgs : EventArgs
    {
        public bool IsActive { get; }
        public string Message { get; }
        
        public ShieldStatusChangedEventArgs(bool isActive, string message)
        {
            IsActive = isActive;
            Message = message;
        }
    }
    
    public class ThreatDetectedEventArgs : EventArgs
    {
        public string ThreatType { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public ThreatSeverity Severity { get; set; }
    }
    
    public class SuspiciousFileEventArgs : EventArgs
    {
        public string FilePath { get; set; } = string.Empty;
        public string Reason { get; set; } = string.Empty;
        public string FileHash { get; set; } = string.Empty;
    }
    
    #endregion
    
    #region Models
    
    public class ScanResult
    {
        public ScanType ScanType { get; set; }
        public int ThreatsFound { get; set; }
        public int ItemsScanned { get; set; }
        public DateTime CompletedAt { get; set; }
        public List<ScanThreatItem> Threats { get; set; } = new();
    }
    
    public class ScanThreatItem
    {
        public string Name { get; set; } = string.Empty;
        public string Path { get; set; } = string.Empty;
        public string ThreatType { get; set; } = string.Empty;
        public ThreatSeverity Severity { get; set; }
    }
    
    public enum ScanType
    {
        Quick,
        Full,
        Adware
    }
    
    public enum ThreatSeverity
    {
        Low,
        Medium,
        High,
        Critical
    }
    
    public class DefenderStatus
    {
        public bool IsEnabled { get; set; }
        public bool RealTimeProtectionEnabled { get; set; }
        public bool IsUpToDate { get; set; }
        public DateTime? LastScan { get; set; }
        public string Version { get; set; } = string.Empty;
    }
    
    #endregion
}
