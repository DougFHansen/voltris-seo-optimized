using System;
using System.Collections.Generic;
using System.Linq;
using VoltrisOptimizer.Interfaces;

namespace VoltrisOptimizer.Services.Shield.Network
{
    /// <summary>
    /// Analisador de hostname para inferir tipo de dispositivo e sistema operacional
    /// </summary>
    public class HostnameAnalyzer
    {
        private readonly ILoggingService _logger;
        private readonly List<HostnamePattern> _patterns;
        
        public HostnameAnalyzer(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _patterns = new List<HostnamePattern>();
            InitializePatterns();
        }
        
        /// <summary>
        /// Analisa o hostname para extrair informações do dispositivo
        /// </summary>
        public HostnameAnalysisResult AnalyzeHostname(string hostname)
        {
            if (string.IsNullOrEmpty(hostname) || hostname == "Unknown")
                return null;
            
            var hostnameLower = hostname.ToLowerInvariant();
            
            // Verificar padrões conhecidos
            foreach (var pattern in _patterns)
            {
                if (pattern.Keywords.Any(k => hostnameLower.Contains(k.ToLowerInvariant())))
                {
                    return new HostnameAnalysisResult
                    {
                        DeviceType = pattern.DeviceType,
                        OperatingSystem = pattern.OperatingSystem,
                        Confidence = pattern.Confidence
                    };
                }
            }
            
            // Análise heurística adicional
            return PerformHeuristicAnalysis(hostnameLower);
        }
        
        private HostnameAnalysisResult PerformHeuristicAnalysis(string hostname)
        {
            // Windows naming patterns
            if (hostname.StartsWith("desktop-") || hostname.StartsWith("pc-"))
            {
                return new HostnameAnalysisResult
                {
                    DeviceType = "Desktop PC",
                    OperatingSystem = "Windows",
                    Confidence = 15
                };
            }
            
            if (hostname.StartsWith("laptop-") || hostname.StartsWith("nb-"))
            {
                return new HostnameAnalysisResult
                {
                    DeviceType = "Laptop",
                    OperatingSystem = "Windows",
                    Confidence = 15
                };
            }
            
            // Linux patterns
            if (hostname.Contains("ubuntu") || hostname.Contains("debian") || hostname.Contains("fedora"))
            {
                return new HostnameAnalysisResult
                {
                    DeviceType = "Linux PC",
                    OperatingSystem = "Linux",
                    Confidence = 15
                };
            }
            
            // Generic patterns
            if (hostname.Length == 12 && hostname.All(c => char.IsLetterOrDigit(c) || c == '-'))
            {
                // Padrão comum de hostname auto-gerado (ex: DESKTOP-ABC123)
                return new HostnameAnalysisResult
                {
                    DeviceType = "PC",
                    OperatingSystem = "Windows",
                    Confidence = 10
                };
            }
            
            return null;
        }
        
        private void InitializePatterns()
        {
            // Windows Desktop
            _patterns.Add(new HostnamePattern
            {
                Keywords = new[] { "desktop", "pc", "workstation" },
                DeviceType = "Laptop",
                OperatingSystem = "Windows",
                Confidence = 25
            });
            
            // Windows Laptop
            _patterns.Add(new HostnamePattern
            {
                Keywords = new[] { "laptop", "notebook", "nb-" },
                DeviceType = "Laptop",
                OperatingSystem = "Windows",
                Confidence = 20
            });
            
            // Apple iPhone
            _patterns.Add(new HostnamePattern
            {
                Keywords = new[] { "iphone", "iphone-de-", "iphone-da-", "iphone de", "iphone da" },
                DeviceType = "Smartphone",
                OperatingSystem = "iOS",
                Confidence = 25
            });
            
            // Apple iPad
            _patterns.Add(new HostnamePattern
            {
                Keywords = new[] { "ipad" },
                DeviceType = "Tablet",
                OperatingSystem = "iPadOS",
                Confidence = 25
            });
            
            // Apple MacBook
            _patterns.Add(new HostnamePattern
            {
                Keywords = new[] { "macbook" },
                DeviceType = "Laptop",
                OperatingSystem = "macOS",
                Confidence = 25
            });
            
            // Apple iMac
            _patterns.Add(new HostnamePattern
            {
                Keywords = new[] { "imac", "mac-" },
                DeviceType = "Desktop",
                OperatingSystem = "macOS",
                Confidence = 25
            });
            
            // Android
            _patterns.Add(new HostnamePattern
            {
                Keywords = new[] { "android", "galaxy", "pixel" },
                DeviceType = "Smartphone",
                OperatingSystem = "Android",
                Confidence = 20
            });
            
            // Router/Gateway
            _patterns.Add(new HostnamePattern
            {
                Keywords = new[] { "router", "gateway", "modem" },
                DeviceType = "Router",
                OperatingSystem = "Router OS",
                Confidence = 25
            });
            
            // Smart TV
            _patterns.Add(new HostnamePattern
            {
                Keywords = new[] { "tv", "smarttv", "television" },
                DeviceType = "Smart TV",
                OperatingSystem = "TV OS",
                Confidence = 20
            });
            
            // Raspberry Pi
            _patterns.Add(new HostnamePattern
            {
                Keywords = new[] { "raspberrypi", "raspberry", "rpi" },
                DeviceType = "Single Board Computer",
                OperatingSystem = "Linux",
                Confidence = 25
            });
            
            // Linux Server
            _patterns.Add(new HostnamePattern
            {
                Keywords = new[] { "server", "srv", "ubuntu", "debian", "centos" },
                DeviceType = "Server",
                OperatingSystem = "Linux",
                Confidence = 20
            });
            
            // PlayStation
            _patterns.Add(new HostnamePattern
            {
                Keywords = new[] { "playstation", "ps4", "ps5" },
                DeviceType = "Game Console",
                OperatingSystem = "PlayStation OS",
                Confidence = 25
            });
            
            // Xbox
            _patterns.Add(new HostnamePattern
            {
                Keywords = new[] { "xbox" },
                DeviceType = "Game Console",
                OperatingSystem = "Xbox OS",
                Confidence = 25
            });
            
            // Chromecast
            _patterns.Add(new HostnamePattern
            {
                Keywords = new[] { "chromecast" },
                DeviceType = "Streaming Device",
                OperatingSystem = "Android TV",
                Confidence = 25
            });
            
            // Amazon Echo
            _patterns.Add(new HostnamePattern
            {
                Keywords = new[] { "echo", "alexa" },
                DeviceType = "Smart Speaker",
                OperatingSystem = "Fire OS",
                Confidence = 25
            });
            
            // Fire TV
            _patterns.Add(new HostnamePattern
            {
                Keywords = new[] { "firetv", "fire-tv" },
                DeviceType = "Streaming Device",
                OperatingSystem = "Fire OS",
                Confidence = 25
            });
            
            // Roku
            _patterns.Add(new HostnamePattern
            {
                Keywords = new[] { "roku" },
                DeviceType = "Streaming Device",
                OperatingSystem = "Roku OS",
                Confidence = 25
            });
            
            // Printer
            _patterns.Add(new HostnamePattern
            {
                Keywords = new[] { "printer", "print", "canon", "epson", "hp-" },
                DeviceType = "Printer",
                OperatingSystem = "Printer OS",
                Confidence = 20
            });
            
            // NAS (Network Attached Storage)
            _patterns.Add(new HostnamePattern
            {
                Keywords = new[] { "nas", "storage", "synology", "qnap" },
                DeviceType = "NAS",
                OperatingSystem = "NAS OS",
                Confidence = 20
            });
            
            // Camera
            _patterns.Add(new HostnamePattern
            {
                Keywords = new[] { "camera", "cam", "ipcam" },
                DeviceType = "IP Camera",
                OperatingSystem = "Camera OS",
                Confidence = 20
            });
        }
    }
    
    public class HostnamePattern
    {
        public string[] Keywords { get; set; }
        public string DeviceType { get; set; }
        public string OperatingSystem { get; set; }
        public int Confidence { get; set; }
    }
    
    public class HostnameAnalysisResult
    {
        public string DeviceType { get; set; }
        public string OperatingSystem { get; set; }
        public int Confidence { get; set; }
    }
}
