using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;
using System.Threading.Tasks;
using VoltrisOptimizer.Interfaces;

namespace VoltrisOptimizer.Services.Shield.Network
{
    /// <summary>
    /// Motor de identificação profissional de dispositivos de rede
    /// Identifica fabricante, tipo de dispositivo e sistema operacional
    /// </summary>
    public class DeviceIdentificationEngine
    {
        private readonly ILoggingService _logger;
        private readonly OUIDatabase _ouiDatabase;
        private readonly DeviceClassifier _classifier;
        private readonly HostnameAnalyzer _hostnameAnalyzer;
        private readonly Dictionary<string, DeviceIdentificationResult> _identificationCache;
        
        public DeviceIdentificationEngine(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _ouiDatabase = new OUIDatabase(_logger);
            _classifier = new DeviceClassifier(_logger);
            _hostnameAnalyzer = new HostnameAnalyzer(_logger);
            _identificationCache = new Dictionary<string, DeviceIdentificationResult>();
            
            _logger.LogInfo("[DeviceIdentification] Engine inicializado com sucesso");
        }
        
        /// <summary>
        /// Identifica um dispositivo de rede de forma completa
        /// </summary>
        public async Task<DeviceIdentificationResult> IdentifyDeviceAsync(NetworkDevice device, string gatewayIP = null)
        {
            try
            {
                _logger.LogInfo($"[DeviceIdentification] ========================================");
                _logger.LogInfo($"[DeviceIdentification] Iniciando identificação de dispositivo:");
                _logger.LogInfo($"[DeviceIdentification] IP: {device.IPAddress}");
                _logger.LogInfo($"[DeviceIdentification] MAC: {device.MacAddress}");
                _logger.LogInfo($"[DeviceIdentification] Hostname: {device.Hostname}");
                _logger.LogInfo($"[DeviceIdentification] ========================================");
                
                // Verificar cache
                if (!string.IsNullOrEmpty(device.MacAddress) && device.MacAddress != "Unknown" && _identificationCache.TryGetValue(device.MacAddress, out var cached))
                {
                    _logger.LogInfo($"[DeviceIdentification] ✓ Usando resultado em cache para {device.MacAddress}");
                    return cached;
                }
                
                var result = new DeviceIdentificationResult
                {
                    IPAddress = device.IPAddress,
                    MacAddress = device.MacAddress ?? "Unknown",
                    Hostname = device.Hostname ?? "Unknown"
                };
                
                // 1. Identificar fabricante via OUI (apenas se MAC for válido)
                if (!string.IsNullOrEmpty(device.MacAddress) && device.MacAddress != "Unknown")
                {
                    result.Vendor = _ouiDatabase.GetVendorFromMac(device.MacAddress);
                    _logger.LogInfo($"[DeviceIdentification] Vendor identificado: {result.Vendor}");
                    result.ConfidenceLevel += string.IsNullOrEmpty(result.Vendor) || result.Vendor == "Unknown" ? 0 : 30;
                }
                else
                {
                    result.Vendor = "Unknown";
                    _logger.LogWarning($"[DeviceIdentification] ⚠ MAC inválido ou desconhecido para {device.IPAddress}");
                }
                
                // 2. Detectar se é gateway
                result.IsGateway = IsGatewayDevice(device.IPAddress, gatewayIP);
                if (result.IsGateway)
                {
                    _logger.LogInfo($"[DeviceIdentification] ✓ Dispositivo identificado como GATEWAY");
                    result.DeviceType = "Router/Gateway";
                    result.DeviceIcon = "🌐";
                    result.ConfidenceLevel += 40;
                }
                
                // 3. Analisar hostname PRIMEIRO para inferir informações (prioridade alta)
                if (!string.IsNullOrEmpty(device.Hostname) && device.Hostname != "Unknown" && device.Hostname != "Desconhecido")
                {
                    _logger.LogInfo($"[DeviceIdentification] Analisando hostname: {device.Hostname}");
                    var hostnameInfo = _hostnameAnalyzer.AnalyzeHostname(device.Hostname);
                    if (hostnameInfo != null)
                    {
                        _logger.LogSuccess($"[DeviceIdentification] ✓ Hostname forneceu informações:");
                        _logger.LogInfo($"[DeviceIdentification]   - DeviceType: {hostnameInfo.DeviceType}");
                        _logger.LogInfo($"[DeviceIdentification]   - OS: {hostnameInfo.OperatingSystem}");
                        _logger.LogInfo($"[DeviceIdentification]   - Confiança: +{hostnameInfo.Confidence}%");
                        
                        result.OperatingSystem = hostnameInfo.OperatingSystem ?? result.OperatingSystem;
                        result.DeviceType = hostnameInfo.DeviceType ?? result.DeviceType;
                        result.ConfidenceLevel += hostnameInfo.Confidence;
                    }
                }
                
                // 4. Classificar dispositivo baseado no fabricante (apenas se vendor for conhecido E não temos info do hostname)
                if (!string.IsNullOrEmpty(result.Vendor) && result.Vendor != "Unknown")
                {
                    _logger.LogInfo($"[DeviceIdentification] Classificando baseado no vendor: {result.Vendor}");
                    var classification = _classifier.ClassifyDevice(result.Vendor, device.Hostname, result.IsGateway);
                    if (classification != null)
                    {
                        _logger.LogInfo($"[DeviceIdentification] Classificação do vendor:");
                        _logger.LogInfo($"[DeviceIdentification]   - DeviceType: {classification.DeviceType}");
                        _logger.LogInfo($"[DeviceIdentification]   - OS: {classification.OperatingSystem}");
                        _logger.LogInfo($"[DeviceIdentification]   - Icon: {classification.Icon}");
                        _logger.LogInfo($"[DeviceIdentification]   - Confiança: +{classification.Confidence}%");
                        
                        // Apenas sobrescrever se não temos informação do hostname (hostname tem prioridade)
                        if (string.IsNullOrEmpty(result.DeviceType) || result.DeviceType == "Unknown")
                        {
                            result.DeviceType = classification.DeviceType ?? result.DeviceType;
                        }
                        if (string.IsNullOrEmpty(result.OperatingSystem) || result.OperatingSystem == "Unknown")
                        {
                            result.OperatingSystem = classification.OperatingSystem ?? result.OperatingSystem;
                        }
                        if (string.IsNullOrEmpty(result.DeviceIcon) || result.DeviceIcon == "🖥️")
                        {
                            result.DeviceIcon = classification.Icon ?? result.DeviceIcon;
                        }
                        result.ConfidenceLevel += classification.Confidence;
                    }
                }
                
                // 5. Gerar nome amigável
                result.FriendlyName = GenerateFriendlyName(result);
                
                // 6. Normalizar nível de confiança (0-100)
                result.ConfidenceLevel = Math.Min(100, result.ConfidenceLevel);
                
                _logger.LogSuccess($"[DeviceIdentification] ========================================");
                _logger.LogSuccess($"[DeviceIdentification] RESULTADO FINAL:");
                _logger.LogSuccess($"[DeviceIdentification] Nome: {result.FriendlyName}");
                _logger.LogSuccess($"[DeviceIdentification] Tipo: {result.DeviceType}");
                _logger.LogSuccess($"[DeviceIdentification] OS: {result.OperatingSystem}");
                _logger.LogSuccess($"[DeviceIdentification] Vendor: {result.Vendor}");
                _logger.LogSuccess($"[DeviceIdentification] Ícone: {result.DeviceIcon}");
                _logger.LogSuccess($"[DeviceIdentification] Confiança: {result.ConfidenceLevel}%");
                _logger.LogSuccess($"[DeviceIdentification] ========================================");
                
                // Adicionar ao cache apenas se MAC for válido
                if (!string.IsNullOrEmpty(device.MacAddress) && device.MacAddress != "Unknown")
                {
                    _identificationCache[device.MacAddress] = result;
                }
                
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[DeviceIdentification] ❌ Erro ao identificar dispositivo {device.IPAddress}", ex);
                return CreateFallbackResult(device);
            }
        }
        
        /// <summary>
        /// Identifica múltiplos dispositivos em paralelo
        /// </summary>
        public async Task<List<DeviceIdentificationResult>> IdentifyDevicesAsync(List<NetworkDevice> devices, string gatewayIP = null)
        {
            var tasks = devices.Select(d => IdentifyDeviceAsync(d, gatewayIP));
            var results = await Task.WhenAll(tasks);
            return results.ToList();
        }
        
        /// <summary>
        /// Limpa o cache de identificação
        /// </summary>
        public void ClearCache()
        {
            _identificationCache.Clear();
            _logger.LogInfo("[DeviceIdentification] Cache limpo");
        }
        
        private bool IsGatewayDevice(string ipAddress, string knownGateway)
        {
            if (string.IsNullOrEmpty(ipAddress))
                return false;
            
            // Verificar se é o gateway conhecido
            if (!string.IsNullOrEmpty(knownGateway) && ipAddress == knownGateway)
                return true;
            
            // Verificar padrões comuns de gateway
            var commonGateways = new[] { ".1", ".254" };
            return commonGateways.Any(g => ipAddress.EndsWith(g));
        }
        
        private string GenerateFriendlyName(DeviceIdentificationResult result)
        {
            if (result.IsGateway)
            {
                return string.IsNullOrEmpty(result.Vendor) || result.Vendor == "Unknown"
                    ? "Network Router"
                    : $"{result.Vendor} Router";
            }
            
            if (!string.IsNullOrEmpty(result.Hostname) && result.Hostname != "Unknown")
            {
                return result.Hostname;
            }
            
            if (!string.IsNullOrEmpty(result.DeviceType) && result.DeviceType != "Unknown")
            {
                if (!string.IsNullOrEmpty(result.Vendor) && result.Vendor != "Unknown")
                {
                    return $"{result.Vendor} {result.DeviceType}";
                }
                return result.DeviceType;
            }
            
            if (!string.IsNullOrEmpty(result.Vendor) && result.Vendor != "Unknown")
            {
                return $"{result.Vendor} Device";
            }
            
            return "Unknown Device";
        }
        
        private DeviceIdentificationResult CreateFallbackResult(NetworkDevice device)
        {
            return new DeviceIdentificationResult
            {
                IPAddress = device.IPAddress,
                MacAddress = device.MacAddress,
                Hostname = device.Hostname,
                Vendor = "Unknown",
                DeviceType = "Unknown",
                OperatingSystem = "Unknown",
                DeviceIcon = "🖥️",
                FriendlyName = device.Hostname ?? "Unknown Device",
                IsGateway = false,
                ConfidenceLevel = 0
            };
        }
    }
    
    /// <summary>
    /// Resultado da identificação de dispositivo
    /// </summary>
    public class DeviceIdentificationResult
    {
        public string IPAddress { get; set; }
        public string MacAddress { get; set; }
        public string Hostname { get; set; }
        public string Vendor { get; set; }
        public string DeviceType { get; set; }
        public string OperatingSystem { get; set; }
        public string FriendlyName { get; set; }
        public string DeviceIcon { get; set; }
        public bool IsGateway { get; set; }
        public int ConfidenceLevel { get; set; }
    }
}
