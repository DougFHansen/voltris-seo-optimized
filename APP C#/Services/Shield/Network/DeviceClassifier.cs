using System;
using System.Collections.Generic;
using System.Linq;
using VoltrisOptimizer.Interfaces;

namespace VoltrisOptimizer.Services.Shield.Network
{
    /// <summary>
    /// Classificador inteligente de dispositivos baseado em fabricante e hostname
    /// </summary>
    public class DeviceClassifier
    {
        private readonly ILoggingService _logger;
        private readonly Dictionary<string, DeviceClassificationRule> _rules;
        
        public DeviceClassifier(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _rules = new Dictionary<string, DeviceClassificationRule>(StringComparer.OrdinalIgnoreCase);
            InitializeRules();
        }
        
        /// <summary>
        /// Classifica um dispositivo baseado no fabricante e hostname
        /// </summary>
        public DeviceClassificationResult ClassifyDevice(string vendor, string hostname, bool isGateway)
        {
            if (string.IsNullOrEmpty(vendor) || vendor == "Unknown")
                return null;
            
            var vendorLower = vendor.ToLowerInvariant();
            var hostnameLower = hostname?.ToLowerInvariant() ?? "";
            
            // Se é gateway, classificar como router
            if (isGateway)
            {
                return new DeviceClassificationResult
                {
                    DeviceType = "Router",
                    OperatingSystem = "Router OS",
                    Icon = "🌐",
                    Confidence = 40
                };
            }
            
            // Verificar regras específicas de fabricante
            foreach (var rule in _rules.Values)
            {
                if (rule.VendorPatterns.Any(p => vendorLower.Contains(p.ToLowerInvariant())))
                {
                    // Verificar se hostname fornece informação adicional
                    var hostnameType = InferFromHostname(hostnameLower);
                    if (hostnameType != null)
                    {
                        return new DeviceClassificationResult
                        {
                            DeviceType = hostnameType.DeviceType ?? rule.DefaultDeviceType,
                            OperatingSystem = hostnameType.OperatingSystem ?? rule.DefaultOS,
                            Icon = hostnameType.Icon ?? rule.Icon,
                            Confidence = 30 + hostnameType.Confidence
                        };
                    }
                    
                    return new DeviceClassificationResult
                    {
                        DeviceType = rule.DefaultDeviceType,
                        OperatingSystem = rule.DefaultOS,
                        Icon = rule.Icon,
                        Confidence = 25
                    };
                }
            }
            
            return null;
        }
        
        private DeviceClassificationResult InferFromHostname(string hostname)
        {
            if (string.IsNullOrEmpty(hostname))
                return null;
            
            // Windows Desktop
            if (hostname.Contains("desktop") || hostname.Contains("pc-"))
            {
                return new DeviceClassificationResult
                {
                    DeviceType = "Laptop",
                    OperatingSystem = "Windows",
                    Icon = "💻",
                    Confidence = 25
                };
            }
            
            // Windows Laptop
            if (hostname.Contains("laptop") || hostname.Contains("notebook"))
            {
                return new DeviceClassificationResult
                {
                    DeviceType = "Laptop",
                    OperatingSystem = "Windows",
                    Icon = "💻",
                    Confidence = 20
                };
            }
            
            // Android
            if (hostname.Contains("android"))
            {
                return new DeviceClassificationResult
                {
                    DeviceType = "Smartphone",
                    OperatingSystem = "Android",
                    Icon = "📱",
                    Confidence = 20
                };
            }
            
            // iPhone/iPad
            if (hostname.Contains("iphone"))
            {
                return new DeviceClassificationResult
                {
                    DeviceType = "Smartphone",
                    OperatingSystem = "iOS",
                    Icon = "📱",
                    Confidence = 20
                };
            }
            
            if (hostname.Contains("ipad"))
            {
                return new DeviceClassificationResult
                {
                    DeviceType = "Tablet",
                    OperatingSystem = "iPadOS",
                    Icon = "📱",
                    Confidence = 20
                };
            }
            
            // Mac
            if (hostname.Contains("macbook"))
            {
                return new DeviceClassificationResult
                {
                    DeviceType = "Laptop",
                    OperatingSystem = "macOS",
                    Icon = "💻",
                    Confidence = 20
                };
            }
            
            if (hostname.Contains("imac") || hostname.Contains("mac-"))
            {
                return new DeviceClassificationResult
                {
                    DeviceType = "Desktop",
                    OperatingSystem = "macOS",
                    Icon = "🖥️",
                    Confidence = 20
                };
            }
            
            // Router
            if (hostname.Contains("router") || hostname.Contains("gateway"))
            {
                return new DeviceClassificationResult
                {
                    DeviceType = "Router",
                    OperatingSystem = "Router OS",
                    Icon = "🌐",
                    Confidence = 20
                };
            }
            
            // Smart TV
            if (hostname.Contains("tv") || hostname.Contains("smarttv"))
            {
                return new DeviceClassificationResult
                {
                    DeviceType = "Smart TV",
                    OperatingSystem = "TV OS",
                    Icon = "📺",
                    Confidence = 20
                };
            }
            
            // Raspberry Pi
            if (hostname.Contains("raspberrypi") || hostname.Contains("raspberry"))
            {
                return new DeviceClassificationResult
                {
                    DeviceType = "Single Board Computer",
                    OperatingSystem = "Linux",
                    Icon = "🔧",
                    Confidence = 20
                };
            }
            
            return null;
        }
        
        private void InitializeRules()
        {
            // Apple Devices
            _rules["Apple"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "Apple" },
                DefaultDeviceType = "Apple Device",
                DefaultOS = "iOS/macOS",
                Icon = "🍎"
            };
            
            // Samsung - Smartphones e TVs
            _rules["Samsung"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "Samsung" },
                DefaultDeviceType = "Smartphone",
                DefaultOS = "Android",
                Icon = "📱"
            };
            
            // Xiaomi - Smartphones
            _rules["Xiaomi"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "Xiaomi" },
                DefaultDeviceType = "Smartphone",
                DefaultOS = "Android",
                Icon = "📱"
            };
            
            // Huawei - Smartphones e Routers
            _rules["Huawei"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "Huawei" },
                DefaultDeviceType = "Smartphone/Router",
                DefaultOS = "Android/HarmonyOS",
                Icon = "📱"
            };
            
            // Motorola - Smartphones
            _rules["Motorola"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "Motorola" },
                DefaultDeviceType = "Smartphone",
                DefaultOS = "Android",
                Icon = "📱"
            };
            
            // TP-Link - Routers
            _rules["TP-Link"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "TP-Link" },
                DefaultDeviceType = "Router",
                DefaultOS = "Router OS",
                Icon = "🌐"
            };
            
            // D-Link - Routers
            _rules["D-Link"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "D-Link" },
                DefaultDeviceType = "Router",
                DefaultOS = "Router OS",
                Icon = "🌐"
            };
            
            // Asus - Routers e PCs
            _rules["Asus"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "Asus" },
                DefaultDeviceType = "Router/PC",
                DefaultOS = "Router OS/Windows",
                Icon = "🌐"
            };
            
            // Cisco - Enterprise Networking
            _rules["Cisco"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "Cisco" },
                DefaultDeviceType = "Network Device",
                DefaultOS = "IOS",
                Icon = "🌐"
            };
            
            // Netgear - Routers
            _rules["Netgear"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "Netgear" },
                DefaultDeviceType = "Router",
                DefaultOS = "Router OS",
                Icon = "🌐"
            };
            
            // Ubiquiti - Enterprise WiFi
            _rules["Ubiquiti"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "Ubiquiti" },
                DefaultDeviceType = "Access Point",
                DefaultOS = "UniFi OS",
                Icon = "📡"
            };
            
            // MikroTik - Routers
            _rules["MikroTik"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "MikroTik" },
                DefaultDeviceType = "Router",
                DefaultOS = "RouterOS",
                Icon = "🌐"
            };
            
            // Intel - Network Adapters
            _rules["Intel"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "Intel" },
                DefaultDeviceType = "Laptop",
                DefaultOS = "Windows",
                Icon = "💻"
            };
            
            // Realtek - Network Adapters
            _rules["Realtek"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "Realtek" },
                DefaultDeviceType = "PC",
                DefaultOS = "Windows/Linux",
                Icon = "💻"
            };
            
            // Microsoft - Surface, Xbox
            _rules["Microsoft"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "Microsoft" },
                DefaultDeviceType = "PC/Console",
                DefaultOS = "Windows",
                Icon = "💻"
            };
            
            // Dell - PCs
            _rules["Dell"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "Dell" },
                DefaultDeviceType = "PC",
                DefaultOS = "Windows",
                Icon = "💻"
            };
            
            // HP - PCs e Printers
            _rules["HP"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "HP" },
                DefaultDeviceType = "PC/Printer",
                DefaultOS = "Windows",
                Icon = "💻"
            };
            
            // Lenovo - PCs
            _rules["Lenovo"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "Lenovo" },
                DefaultDeviceType = "PC",
                DefaultOS = "Windows",
                Icon = "💻"
            };
            
            // Sony - PlayStation, TVs
            _rules["Sony"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "Sony" },
                DefaultDeviceType = "Console/TV",
                DefaultOS = "PlayStation OS",
                Icon = "🎮"
            };
            
            // LG - TVs
            _rules["LG"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "LG" },
                DefaultDeviceType = "Smart TV",
                DefaultOS = "webOS",
                Icon = "📺"
            };
            
            // Google - Chromecast, Nest
            _rules["Google"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "Google" },
                DefaultDeviceType = "Streaming Device",
                DefaultOS = "Android TV",
                Icon = "📡"
            };
            
            // Amazon - Echo, Fire TV
            _rules["Amazon"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "Amazon" },
                DefaultDeviceType = "Smart Speaker/Streaming",
                DefaultOS = "Fire OS",
                Icon = "🔊"
            };
            
            // Raspberry Pi - IoT
            _rules["Raspberry Pi"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "Raspberry Pi" },
                DefaultDeviceType = "Single Board Computer",
                DefaultOS = "Linux",
                Icon = "🔧"
            };
            
            // Nvidia - Shield TV
            _rules["Nvidia"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "Nvidia" },
                DefaultDeviceType = "Streaming Device",
                DefaultOS = "Android TV",
                Icon = "📡"
            };
            
            // Roku - Streaming
            _rules["Roku"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "Roku" },
                DefaultDeviceType = "Streaming Device",
                DefaultOS = "Roku OS",
                Icon = "📡"
            };
            
            // Canon - Printers
            _rules["Canon"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "Canon" },
                DefaultDeviceType = "Printer",
                DefaultOS = "Printer OS",
                Icon = "🖨️"
            };
            
            // Epson - Printers
            _rules["Epson"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "Epson" },
                DefaultDeviceType = "Printer",
                DefaultOS = "Printer OS",
                Icon = "🖨️"
            };
            
            // Brother - Printers
            _rules["Brother"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "Brother" },
                DefaultDeviceType = "Printer",
                DefaultOS = "Printer OS",
                Icon = "🖨️"
            };
            
            // Philips - Hue, TVs
            _rules["Philips"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "Philips" },
                DefaultDeviceType = "Smart Home/TV",
                DefaultOS = "IoT OS",
                Icon = "💡"
            };
            
            // Ring - Security Cameras
            _rules["Ring"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "Ring" },
                DefaultDeviceType = "Security Camera",
                DefaultOS = "IoT OS",
                Icon = "📹"
            };
            
            // Nest - Smart Home
            _rules["Nest"] = new DeviceClassificationRule
            {
                VendorPatterns = new[] { "Nest" },
                DefaultDeviceType = "Smart Home Device",
                DefaultOS = "IoT OS",
                Icon = "🏠"
            };
        }
    }
    
    public class DeviceClassificationRule
    {
        public string[] VendorPatterns { get; set; }
        public string DefaultDeviceType { get; set; }
        public string DefaultOS { get; set; }
        public string Icon { get; set; }
    }
    
    public class DeviceClassificationResult
    {
        public string DeviceType { get; set; }
        public string OperatingSystem { get; set; }
        public string Icon { get; set; }
        public int Confidence { get; set; }
    }
}
