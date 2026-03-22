using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Interfaces;

namespace VoltrisOptimizer.Services.Shield.Network
{
    public class DeviceTrackerService
    {
        private readonly ILoggingService _logger;
        private readonly DeviceIdentificationEngine _identificationEngine;
        private readonly List<NetworkDevice> _knownDevices;
        private readonly SemaphoreSlim _identificationSemaphore;
        private string _gatewayIP;
        
        public event EventHandler<DeviceEventArgs> NewDeviceDetected;
        public event EventHandler<DeviceEventArgs> DeviceDisconnected;
        
        public IReadOnlyList<NetworkDevice> KnownDevices => _knownDevices.AsReadOnly();
        
        public DeviceTrackerService(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _identificationEngine = new DeviceIdentificationEngine(_logger);
            _knownDevices = new List<NetworkDevice>();
            _identificationSemaphore = new SemaphoreSlim(10, 10); // Máximo 10 identificações simultâneas
        }
        
        public async Task UpdateDevicesAsync(List<NetworkDevice> scannedDevices, string gatewayIP = null)
        {
            try
            {
                _gatewayIP = gatewayIP;
                
                _logger.LogInfo($"[DeviceTracker] Atualizando {scannedDevices.Count} dispositivos...");
                
                // Identificar dispositivos em paralelo com limite de concorrência
                var identificationTasks = scannedDevices.Select(async device =>
                {
                    await _identificationSemaphore.WaitAsync();
                    try
                    {
                        var result = await _identificationEngine.IdentifyDeviceAsync(device, gatewayIP);
                        
                        // Aplicar resultados da identificação
                        device.Vendor = result.Vendor;
                        device.DeviceType = result.DeviceType;
                        device.OperatingSystem = result.OperatingSystem;
                        device.FriendlyName = result.FriendlyName;
                        device.DeviceIcon = result.DeviceIcon;
                        device.IsGateway = result.IsGateway;
                        device.ConfidenceLevel = result.ConfidenceLevel;
                        
                        return device;
                    }
                    finally
                    {
                        _identificationSemaphore.Release();
                    }
                });
                
                var identifiedDevices = await Task.WhenAll(identificationTasks);
                
                // Detectar novos dispositivos
                foreach (var device in identifiedDevices)
                {
                    var existing = _knownDevices.FirstOrDefault(d => d.MacAddress == device.MacAddress);
                    
                    if (existing == null)
                    {
                        // Novo dispositivo
                        device.IsNew = true;
                        _knownDevices.Add(device);
                        
                        _logger.LogSuccess($"[DeviceTracker] Novo dispositivo: {device.FriendlyName} ({device.DeviceType}) - {device.IPAddress}");
                        NewDeviceDetected?.Invoke(this, new DeviceEventArgs { Device = device });
                    }
                    else
                    {
                        // Atualizar dispositivo existente
                        existing.IsOnline = true;
                        existing.LastSeen = DateTime.Now;
                        existing.IPAddress = device.IPAddress;
                        existing.Hostname = device.Hostname;
                        existing.Vendor = device.Vendor;
                        existing.DeviceType = device.DeviceType;
                        existing.OperatingSystem = device.OperatingSystem;
                        existing.FriendlyName = device.FriendlyName;
                        existing.DeviceIcon = device.DeviceIcon;
                        existing.IsGateway = device.IsGateway;
                        existing.ConfidenceLevel = device.ConfidenceLevel;
                        existing.IsNew = false;
                    }
                }
                
                // Detectar dispositivos desconectados
                var offlineDevices = _knownDevices
                    .Where(d => d.IsOnline && !identifiedDevices.Any(s => s.MacAddress == d.MacAddress))
                    .ToList();
                
                foreach (var device in offlineDevices)
                {
                    device.IsOnline = false;
                    _logger.LogInfo($"[DeviceTracker] Dispositivo offline: {device.FriendlyName} ({device.IPAddress})");
                    DeviceDisconnected?.Invoke(this, new DeviceEventArgs { Device = device });
                }
                
                _logger.LogSuccess($"[DeviceTracker] Atualização concluída: {GetOnlineDeviceCount()}/{GetTotalDeviceCount()} dispositivos online");
            }
            catch (Exception ex)
            {
                _logger.LogError("[DeviceTracker] Erro ao atualizar dispositivos", ex);
            }
        }
        
        public void ClearNewFlags()
        {
            foreach (var device in _knownDevices)
            {
                device.IsNew = false;
            }
        }
        
        public int GetOnlineDeviceCount()
        {
            return _knownDevices.Count(d => d.IsOnline);
        }
        
        public int GetTotalDeviceCount()
        {
            return _knownDevices.Count;
        }
        
        public void ClearIdentificationCache()
        {
            _identificationEngine.ClearCache();
            _logger.LogInfo("[DeviceTracker] Cache de identificação limpo");
        }
    }
    
    public class DeviceEventArgs : EventArgs
    {
        public NetworkDevice Device { get; set; }
    }
}
