using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.NetworkInformation;
using System.Threading.Tasks;
using VoltrisOptimizer.Interfaces;

namespace VoltrisOptimizer.Services.Shield.Network
{
    public class NetworkScannerService
    {
        private readonly ILoggingService _logger;
        
        public NetworkScannerService(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }
        
        public async Task<NetworkRange> DetectLocalNetworkRangeAsync()
        {
            try
            {
                _logger.LogInfo("[NetworkScanner] Detectando range da rede local...");
                
                var gateway = GetDefaultGateway();
                if (gateway == null)
                {
                    _logger.LogWarning("[NetworkScanner] Gateway não encontrado");
                    return null;
                }
                
                var localIP = GetLocalIPAddress();
                if (localIP == null)
                {
                    _logger.LogWarning("[NetworkScanner] IP local não encontrado");
                    return null;
                }
                
                var range = CalculateNetworkRange(localIP);
                range.GatewayIP = gateway.ToString();
                
                _logger.LogSuccess($"[NetworkScanner] Range detectado: {range.StartIP} - {range.EndIP} (Gateway: {range.GatewayIP})");
                
                return range;
            }
            catch (Exception ex)
            {
                _logger.LogError("[NetworkScanner] Erro ao detectar range da rede", ex);
                return null;
            }
        }
        
        public async Task<List<NetworkDevice>> ScanNetworkAsync(NetworkRange range)
        {
            try
            {
                _logger.LogInfo($"[NetworkScanner] Iniciando scan da rede: {range.StartIP} - {range.EndIP}");
                
                var devices = new List<NetworkDevice>();
                var tasks = new List<Task<NetworkDevice>>();
                
                var startBytes = IPAddress.Parse(range.StartIP).GetAddressBytes();
                var endBytes = IPAddress.Parse(range.EndIP).GetAddressBytes();
                
                int start = startBytes[3];
                int end = endBytes[3];
                
                // Scan paralelo com limite de concorrência
                var semaphore = new System.Threading.SemaphoreSlim(50);
                
                for (int i = start; i <= end; i++)
                {
                    var ip = $"{startBytes[0]}.{startBytes[1]}.{startBytes[2]}.{i}";
                    
                    tasks.Add(Task.Run(async () =>
                    {
                        await semaphore.WaitAsync();
                        try
                        {
                            return await ScanDeviceAsync(ip);
                        }
                        finally
                        {
                            semaphore.Release();
                        }
                    }));
                }
                
                var results = await Task.WhenAll(tasks);
                devices = results.Where(d => d != null).ToList();
                
                _logger.LogSuccess($"[NetworkScanner] Scan concluído: {devices.Count} dispositivos encontrados");
                return devices;
            }
            catch (Exception ex)
            {
                _logger.LogError("[NetworkScanner] Erro no scan da rede", ex);
                return new List<NetworkDevice>();
            }
        }
        
        private async Task<NetworkDevice> ScanDeviceAsync(string ip)
        {
            try
            {
                // Ping rápido
                using var ping = new Ping();
                var reply = await ping.SendPingAsync(ip, 500);
                
                if (reply.Status != IPStatus.Success)
                    return null;
                
                var device = new NetworkDevice
                {
                    IPAddress = ip,
                    IsOnline = true,
                    LastSeen = DateTime.Now,
                    FirstSeen = DateTime.Now
                };
                
                // Verificar se é o próprio computador
                var localIP = GetLocalIPAddress();
                if (localIP != null && ip == localIP.ToString())
                {
                    _logger.LogInfo($"[NetworkScanner] {ip} é o próprio computador, obtendo MAC do adaptador local");
                    device.MacAddress = GetLocalMacAddress();
                }
                else
                {
                    // Obter MAC address da tabela ARP para dispositivos remotos
                    device.MacAddress = GetMacAddressFromARP(ip);
                }
                
                // Tentar resolver hostname
                try
                {
                    var hostEntry = await Dns.GetHostEntryAsync(ip);
                    device.Hostname = hostEntry.HostName;
                }
                catch
                {
                    device.Hostname = "Desconhecido";
                }
                
                return device;
            }
            catch
            {
                return null;
            }
        }
        
        private IPAddress GetDefaultGateway()
        {
            try
            {
                var gateway = NetworkInterface.GetAllNetworkInterfaces()
                    .Where(n => n.OperationalStatus == OperationalStatus.Up)
                    .Where(n => n.NetworkInterfaceType != NetworkInterfaceType.Loopback)
                    .SelectMany(n => n.GetIPProperties()?.GatewayAddresses)
                    .Select(g => g?.Address)
                    .Where(a => a != null && a.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork)
                    .FirstOrDefault();
                
                return gateway;
            }
            catch
            {
                return null;
            }
        }
        
        private IPAddress GetLocalIPAddress()
        {
            try
            {
                var host = Dns.GetHostEntry(Dns.GetHostName());
                var ip = host.AddressList
                    .FirstOrDefault(a => a.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork 
                                      && !IPAddress.IsLoopback(a));
                
                return ip;
            }
            catch
            {
                return null;
            }
        }
        
        private NetworkRange CalculateNetworkRange(IPAddress localIP)
        {
            var bytes = localIP.GetAddressBytes();
            
            // Assumir máscara /24 (255.255.255.0) para redes domésticas
            return new NetworkRange
            {
                StartIP = $"{bytes[0]}.{bytes[1]}.{bytes[2]}.1",
                EndIP = $"{bytes[0]}.{bytes[1]}.{bytes[2]}.254"
            };
        }
        
        private string GetMacAddressFromARP(string ipAddress)
        {
            try
            {
                _logger.LogInfo($"[NetworkScanner] Obtendo MAC address para {ipAddress}...");
                
                var process = new System.Diagnostics.Process
                {
                    StartInfo = new System.Diagnostics.ProcessStartInfo
                    {
                        FileName = "arp",
                        Arguments = "-a",
                        UseShellExecute = false,
                        RedirectStandardOutput = true,
                        CreateNoWindow = true,
                        StandardOutputEncoding = System.Text.Encoding.UTF8
                    }
                };
                
                process.Start();
                var output = process.StandardOutput.ReadToEnd();
                process.WaitForExit();
                
                _logger.LogInfo($"[NetworkScanner] ARP output completo:\n{output}");
                
                // Parse ARP output
                // Formato Windows: 192.168.1.1          00-11-22-33-44-55     dinâmico
                var lines = output.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
                
                foreach (var line in lines)
                {
                    // Verificar se a linha contém o IP que estamos procurando
                    if (!line.Contains(ipAddress))
                        continue;
                    
                    _logger.LogInfo($"[NetworkScanner] Linha ARP encontrada para {ipAddress}: [{line}]");
                    
                    // Tentar extrair MAC address usando regex para maior precisão
                    var macPattern = @"([0-9A-Fa-f]{2}[-:]){5}([0-9A-Fa-f]{2})";
                    var match = System.Text.RegularExpressions.Regex.Match(line, macPattern);
                    
                    if (match.Success)
                    {
                        var mac = match.Value.Replace("-", ":").ToUpperInvariant();
                        _logger.LogSuccess($"[NetworkScanner] ✓ MAC encontrado para {ipAddress}: {mac}");
                        return mac;
                    }
                    
                    // Fallback: parsing manual
                    var parts = line.Split(new[] { ' ', '\t' }, StringSplitOptions.RemoveEmptyEntries);
                    _logger.LogInfo($"[NetworkScanner] Partes da linha: {string.Join(" | ", parts)}");
                    
                    foreach (var part in parts)
                    {
                        // Verificar se é um MAC address válido (formato XX-XX-XX-XX-XX-XX ou XX:XX:XX:XX:XX:XX)
                        if (part.Length >= 17 && (part.Contains("-") || part.Contains(":")))
                        {
                            var mac = part.Replace("-", ":").ToUpperInvariant();
                            
                            // Validar formato MAC (XX:XX:XX:XX:XX:XX)
                            var macParts = mac.Split(':');
                            if (macParts.Length == 6 && macParts.All(p => p.Length == 2 && p.All(c => "0123456789ABCDEF".Contains(c))))
                            {
                                _logger.LogSuccess($"[NetworkScanner] ✓ MAC encontrado (fallback) para {ipAddress}: {mac}");
                                return mac;
                            }
                        }
                    }
                }
                
                _logger.LogWarning($"[NetworkScanner] ⚠ MAC não encontrado na tabela ARP para {ipAddress}");
                _logger.LogWarning($"[NetworkScanner] Dica: Execute 'ping {ipAddress}' primeiro para popular a tabela ARP");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[NetworkScanner] ❌ Erro ao obter MAC para {ipAddress}", ex);
            }
            
            return "Unknown";
        }
        
        /// <summary>
        /// Obtém o MAC address do adaptador de rede local
        /// </summary>
        private string GetLocalMacAddress()
        {
            try
            {
                var localIP = GetLocalIPAddress();
                if (localIP == null)
                {
                    _logger.LogWarning("[NetworkScanner] Não foi possível obter IP local");
                    return "Unknown";
                }
                
                _logger.LogInfo($"[NetworkScanner] Procurando MAC do adaptador com IP {localIP}");
                
                // Obter todos os adaptadores de rede
                var interfaces = NetworkInterface.GetAllNetworkInterfaces()
                    .Where(n => n.OperationalStatus == OperationalStatus.Up)
                    .Where(n => n.NetworkInterfaceType != NetworkInterfaceType.Loopback);
                
                foreach (var ni in interfaces)
                {
                    var ipProps = ni.GetIPProperties();
                    var unicastAddresses = ipProps.UnicastAddresses;
                    
                    // Verificar se este adaptador tem o IP local
                    foreach (var addr in unicastAddresses)
                    {
                        if (addr.Address.AddressFamily == System.Net.Sockets.AddressFamily.InterNetwork &&
                            addr.Address.Equals(localIP))
                        {
                            var mac = ni.GetPhysicalAddress().ToString();
                            
                            // Formatar MAC como XX:XX:XX:XX:XX:XX
                            if (mac.Length == 12)
                            {
                                var formattedMac = string.Join(":", Enumerable.Range(0, 6)
                                    .Select(i => mac.Substring(i * 2, 2)));
                                
                                _logger.LogSuccess($"[NetworkScanner] ✓ MAC local encontrado: {formattedMac} (Adaptador: {ni.Name})");
                                return formattedMac.ToUpperInvariant();
                            }
                        }
                    }
                }
                
                _logger.LogWarning("[NetworkScanner] ⚠ Não foi possível encontrar MAC do adaptador local");
            }
            catch (Exception ex)
            {
                _logger.LogError("[NetworkScanner] ❌ Erro ao obter MAC local", ex);
            }
            
            return "Unknown";
        }
    }
    
    public class NetworkRange
    {
        public string StartIP { get; set; }
        public string EndIP { get; set; }
        public string GatewayIP { get; set; }
    }
    
    public class NetworkDevice
    {
        public string IPAddress { get; set; }
        public string MacAddress { get; set; }
        public string Hostname { get; set; }
        public string Vendor { get; set; }
        public string DeviceType { get; set; } = "Unknown";
        public string OperatingSystem { get; set; } = "Unknown";
        public string FriendlyName { get; set; }
        public string DeviceIcon { get; set; } = "🖥️";
        public bool IsGateway { get; set; }
        public bool IsOnline { get; set; }
        public DateTime FirstSeen { get; set; }
        public DateTime LastSeen { get; set; }
        public bool IsNew { get; set; }
        public int ConfidenceLevel { get; set; } = 0; // 0-100
    }
}
