using System;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Interfaces;

namespace VoltrisOptimizer.Services.Shield.Network
{
    public class NetworkMonitorService
    {
        private readonly ILoggingService _logger;
        private readonly NetworkScannerService _scanner;
        private readonly DeviceTrackerService _tracker;
        
        private CancellationTokenSource _monitoringCts;
        private bool _isMonitoring;
        private bool _lowActivityMode;
        private NetworkRange _networkRange;
        
        // Intervalos de scan: normal vs gamer
        private const int NORMAL_SCAN_INTERVAL_MS = 60_000;   // 60 segundos
        private const int GAMER_SCAN_INTERVAL_MS = 300_000;   // 5 minutos
        
        public bool IsMonitoring => _isMonitoring;
        
        public event EventHandler<MonitoringStatusChangedEventArgs> StatusChanged;
        
        public NetworkMonitorService(
            ILoggingService logger,
            NetworkScannerService scanner,
            DeviceTrackerService tracker)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _scanner = scanner ?? throw new ArgumentNullException(nameof(scanner));
            _tracker = tracker ?? throw new ArgumentNullException(nameof(tracker));
        }
        
        public async Task<bool> StartMonitoringAsync()
        {
            if (_isMonitoring)
                return true;
            
            try
            {
                _logger.LogInfo("[NetworkMonitor] Iniciando monitoramento de rede...");
                
                // Detectar range da rede
                _networkRange = await _scanner.DetectLocalNetworkRangeAsync();
                if (_networkRange == null)
                {
                    _logger.LogWarning("[NetworkMonitor] Não foi possível detectar a rede");
                    return false;
                }
                
                _monitoringCts = new CancellationTokenSource();
                _isMonitoring = true;
                
                // Iniciar monitoramento em background
                _ = Task.Run(() => MonitoringLoopAsync(_monitoringCts.Token));
                
                StatusChanged?.Invoke(this, new MonitoringStatusChangedEventArgs { IsActive = true });
                _logger.LogSuccess("[NetworkMonitor] Monitoramento iniciado");
                
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError("[NetworkMonitor] Erro ao iniciar monitoramento", ex);
                return false;
            }
        }
        
        public Task StopMonitoringAsync()
        {
            if (!_isMonitoring)
                return Task.CompletedTask;
            
            try
            {
                _logger.LogInfo("[NetworkMonitor] Parando monitoramento...");
                
                _monitoringCts?.Cancel();
                _monitoringCts?.Dispose();
                _monitoringCts = null;
                _isMonitoring = false;
                
                StatusChanged?.Invoke(this, new MonitoringStatusChangedEventArgs { IsActive = false });
                _logger.LogInfo("[NetworkMonitor] Monitoramento parado");
            }
            catch (Exception ex)
            {
                _logger.LogError("[NetworkMonitor] Erro ao parar monitoramento", ex);
            }
            
            return Task.CompletedTask;
        }
        
        public async Task<bool> RunManualScanAsync()
        {
            try
            {
                _logger.LogInfo("[NetworkMonitor] Executando scan manual...");
                
                if (_networkRange == null)
                {
                    _networkRange = await _scanner.DetectLocalNetworkRangeAsync();
                    if (_networkRange == null)
                        return false;
                }
                
                var devices = await _scanner.ScanNetworkAsync(_networkRange);
                await _tracker.UpdateDevicesAsync(devices, _networkRange.GatewayIP);
                
                _logger.LogSuccess($"[NetworkMonitor] Scan manual concluído: {devices.Count} dispositivos");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError("[NetworkMonitor] Erro no scan manual", ex);
                return false;
            }
        }
        
        public void SetLowActivityMode(bool enabled)
        {
            _lowActivityMode = enabled;
            _logger.LogInfo($"[NetworkMonitor] Modo baixa atividade: {enabled} (intervalo: {(enabled ? GAMER_SCAN_INTERVAL_MS / 1000 : NORMAL_SCAN_INTERVAL_MS / 1000)}s)");
        }
        
        private async Task MonitoringLoopAsync(CancellationToken cancellationToken)
        {
            int scanCount = 0;
            
            while (!cancellationToken.IsCancellationRequested)
            {
                try
                {
                    scanCount++;
                    
                    var devices = await _scanner.ScanNetworkAsync(_networkRange);
                    await _tracker.UpdateDevicesAsync(devices, _networkRange.GatewayIP);
                    
                    // Intervalo dinâmico baseado no modo gamer
                    var interval = _lowActivityMode ? GAMER_SCAN_INTERVAL_MS : NORMAL_SCAN_INTERVAL_MS;
                    await Task.Delay(interval, cancellationToken);
                }
                catch (OperationCanceledException)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError("[NetworkMonitor] Erro no loop de monitoramento", ex);
                    await Task.Delay(10000, cancellationToken);
                }
            }
        }
    }
    
    public class MonitoringStatusChangedEventArgs : EventArgs
    {
        public bool IsActive { get; set; }
    }
}
