using System;
using System.Linq;
using System.Management;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using GamerModels = VoltrisOptimizer.Services.Gamer.Models;

namespace VoltrisOptimizer.Services.Gamer.Implementation
{
    /// <summary>
    /// Implementação do detector de hardware usando WMI
    /// </summary>
    public class HardwareDetectorService : IHardwareDetector
    {
        private readonly ILoggingService _logger;
        private GamerModels.HardwareCapabilities? _cachedCapabilities;
        private DateTime _cacheTime = DateTime.MinValue;
        private static readonly TimeSpan CacheDuration = TimeSpan.FromMinutes(5);

        public HardwareDetectorService(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<GamerModels.HardwareCapabilities> GetCapabilitiesAsync(CancellationToken cancellationToken = default)
        {
            // Usar cache se ainda válido
            if (_cachedCapabilities != null && DateTime.Now - _cacheTime < CacheDuration)
            {
                return _cachedCapabilities;
            }

            return await Task.Run(() =>
            {
                var caps = new GamerModels.HardwareCapabilities();

                try
                {
                    // CPU
                    DetectCpu(caps);
                    
                    // GPU
                    caps.PrimaryGpu = GetGpuInfoSync();
                    caps.HasDiscreteGpu = caps.PrimaryGpu.IsDiscrete;
                    
                    // RAM
                    caps.TotalRamGb = GetTotalRamGbSync();
                    
                    // Network
                    DetectNetworkAdapter(caps);

                    _cachedCapabilities = caps;
                    _cacheTime = DateTime.Now;
                    
                    _logger.LogInfo($"[Hardware] CPU: {caps.CpuName}, Cores: {caps.CoreCount}, Hybrid: {caps.IsHybridCpu}");
                    _logger.LogInfo($"[Hardware] GPU: {caps.PrimaryGpu.Name}, Vendor: {caps.PrimaryGpu.Vendor}, Discrete: {caps.HasDiscreteGpu}");
                    _logger.LogInfo($"[Hardware] RAM: {caps.TotalRamGb}GB, Network: {caps.NetworkAdapterVendor}");
                }
                catch (Exception ex)
                {
                    _logger.LogError("[Hardware] Erro ao detectar hardware", ex);
                }

                return caps;
            }, cancellationToken);
        }

        private void DetectCpu(GamerModels.HardwareCapabilities caps)
        {
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_Processor");
                foreach (ManagementObject obj in searcher.Get())
                {
                    caps.CpuName = obj["Name"]?.ToString() ?? "Unknown";
                    caps.CoreCount = Convert.ToInt32(obj["NumberOfCores"] ?? 0);
                    caps.ThreadCount = Convert.ToInt32(obj["NumberOfLogicalProcessors"] ?? 0);
                    caps.MaxClockSpeedMhz = Convert.ToDouble(obj["MaxClockSpeed"] ?? 0);
                    
                    // Detectar CPU híbrida Intel 12th gen+
                    var name = caps.CpuName.ToUpperInvariant();
                    caps.IsHybridCpu = name.Contains("INTEL") && 
                        (name.Contains("12") || name.Contains("13") || name.Contains("14") || 
                         name.Contains("ULTRA") || name.Contains("CORE"));
                    
                    break; // Pegar apenas o primeiro processador
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[Hardware] Erro ao detectar CPU: {ex.Message}");
            }
        }

        public async Task<GamerModels.GpuInfo> GetGpuInfoAsync(CancellationToken cancellationToken = default)
        {
            return await Task.Run(GetGpuInfoSync, cancellationToken);
        }

        private GamerModels.GpuInfo GetGpuInfoSync()
        {
            var gpuInfo = new GamerModels.GpuInfo();

            try
            {
                int adapterCount = 0;
                GamerModels.GpuInfo? discreteGpu = null;
                GamerModels.GpuInfo? integratedGpu = null;

                using var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_VideoController");
                foreach (ManagementObject obj in searcher.Get())
                {
                    adapterCount++;
                    var name = obj["Name"]?.ToString() ?? "Unknown";
                    var driverVersion = obj["DriverVersion"]?.ToString() ?? "";
                    var vramBytes = Convert.ToInt64(obj["AdapterRAM"] ?? 0);

                    var info = new GamerModels.GpuInfo
                    {
                        Name = name,
                        DriverVersion = driverVersion,
                        VideoMemoryBytes = vramBytes
                    };

                    // Detectar vendor
                    var upperName = name.ToUpperInvariant();
                    if (upperName.Contains("NVIDIA") || upperName.Contains("GEFORCE") || upperName.Contains("RTX") || upperName.Contains("GTX"))
                    {
                        info.Vendor = GamerModels.GpuVendor.Nvidia;
                        info.IsDiscrete = true;
                        info.SupportsHags = true;
                        info.SupportsVrr = true;
                        discreteGpu = info;
                    }
                    else if (upperName.Contains("AMD") || upperName.Contains("RADEON") || upperName.Contains("RX "))
                    {
                        info.Vendor = GamerModels.GpuVendor.Amd;
                        info.IsDiscrete = !upperName.Contains("VEGA") || vramBytes > 2L * 1024 * 1024 * 1024;
                        info.SupportsHags = true;
                        info.SupportsVrr = true;
                        if (info.IsDiscrete) discreteGpu = info;
                        else integratedGpu = info;
                    }
                    else if (upperName.Contains("INTEL"))
                    {
                        info.Vendor = GamerModels.GpuVendor.Intel;
                        info.IsDiscrete = upperName.Contains("ARC");
                        info.SupportsHags = upperName.Contains("ARC") || upperName.Contains("IRIS");
                        info.SupportsVrr = upperName.Contains("ARC");
                        if (info.IsDiscrete) discreteGpu = info;
                        else integratedGpu = info;
                    }
                }

                // Preferir GPU discreta
                gpuInfo = discreteGpu ?? integratedGpu ?? gpuInfo;
                gpuInfo.IsDiscrete = adapterCount > 1 && discreteGpu != null;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[Hardware] Erro ao detectar GPU: {ex.Message}");
            }

            return gpuInfo;
        }

        private void DetectNetworkAdapter(GamerModels.HardwareCapabilities caps)
        {
            try
            {
                using var searcher = new ManagementObjectSearcher(
                    "SELECT Name, Manufacturer FROM Win32_NetworkAdapter WHERE NetEnabled = TRUE");
                
                foreach (ManagementObject obj in searcher.Get())
                {
                    var name = obj["Name"]?.ToString() ?? "";
                    var manufacturer = obj["Manufacturer"]?.ToString() ?? "";
                    
                    // Ignorar adapters virtuais
                    if (name.Contains("Virtual", StringComparison.OrdinalIgnoreCase) ||
                        name.Contains("VPN", StringComparison.OrdinalIgnoreCase) ||
                        name.Contains("Loopback", StringComparison.OrdinalIgnoreCase))
                    {
                        continue;
                    }

                    caps.NetworkAdapterName = name;
                    caps.NetworkAdapterVendor = !string.IsNullOrEmpty(manufacturer) ? manufacturer : name;
                    break;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[Hardware] Erro ao detectar adaptador de rede: {ex.Message}");
            }
        }

        public bool IsHybridCpu()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT Name FROM Win32_Processor");
                foreach (ManagementObject obj in searcher.Get())
                {
                    var name = (obj["Name"]?.ToString() ?? "").ToUpperInvariant();
                    return name.Contains("INTEL") && 
                        (name.Contains("12") || name.Contains("13") || name.Contains("14") || 
                         name.Contains("ULTRA") || name.Contains("CORE I"));
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[Hardware] Erro ao verificar CPU híbrida: {ex.Message}");
            }
            return false;
        }

        public int GetTotalRamGb()
        {
            return GetTotalRamGbSync();
        }

        private int GetTotalRamGbSync()
        {
            try
            {
                long totalBytes = 0;
                using var searcher = new ManagementObjectSearcher("SELECT Capacity FROM Win32_PhysicalMemory");
                foreach (ManagementObject obj in searcher.Get())
                {
                    if (obj["Capacity"] != null && long.TryParse(obj["Capacity"].ToString(), out var cap))
                    {
                        totalBytes += cap;
                    }
                }
                return (int)(totalBytes / (1024L * 1024 * 1024));
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[Hardware] Erro ao obter RAM: {ex.Message}");
                return 8; // Assumir 8GB como fallback
            }
        }
    }
}

