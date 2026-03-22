using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Management;
using System.Threading;
using System.Threading.Tasks;

namespace VoltrisOptimizer.Services.Gamer.GamerModeManager
{
    /// <summary>
    /// Interface do serviço de monitoramento térmico
    /// </summary>
    public interface IThermalMonitorService : IDisposable
    {
        Task<HardwareMetrics> GetMetricsAsync(CancellationToken ct = default);
        double GetCpuTemperature();
        double GetGpuTemperature();
        double GetCpuUsage();
        double GetGpuUsage();
        bool IsCpuThrottling();
        bool IsGpuThrottling();
    }
    
    /// <summary>
    /// Serviço de monitoramento de hardware em tempo real
    /// Usa WMI, Performance Counters e nvidia-smi/AMD CLI
    /// </summary>
    public class ThermalMonitorService : IThermalMonitorService
    {
        private readonly ILoggingService _logger;
        private PerformanceCounter? _cpuCounter;
        private readonly bool _hasNvidiaSmi;
        
        // Cache de valores
        private double _lastCpuTemp;
        private double _lastGpuTemp;
        private double _lastCpuUsage;
        private double _lastGpuUsage;
        private DateTime _lastUpdate;
        
        private static readonly string NvidiaSmiPath = @"C:\Windows\System32\nvidia-smi.exe";
        
        public ThermalMonitorService(ILoggingService logger)
        {
            _logger = logger;
            _hasNvidiaSmi = File.Exists(NvidiaSmiPath);
            
            InitializeCounters();
        }
        
        private void InitializeCounters()
        {
            try
            {
                _cpuCounter = new PerformanceCounter("Processor", "% Processor Time", "_Total");
                _cpuCounter.NextValue(); // Primeira leitura inicializa o contador
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[Thermal] Erro ao inicializar contador de CPU: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Obtém todas as métricas de hardware
        /// </summary>
        public async Task<HardwareMetrics> GetMetricsAsync(CancellationToken ct = default)
        {
            var metrics = new HardwareMetrics
            {
                Timestamp = DateTime.Now
            };
            
            try
            {
                // CPU
                metrics.CpuUsage = GetCpuUsage();
                metrics.CpuTemperature = GetCpuTemperature();
                metrics.CpuThrottling = IsCpuThrottling();
                metrics.CpuFrequency = GetCpuFrequency();
                
                // GPU
                var gpuMetrics = await GetGpuMetricsAsync(ct);
                metrics.GpuTemperature = gpuMetrics.Temperature;
                metrics.GpuUsage = gpuMetrics.Usage;
                metrics.GpuPower = gpuMetrics.Power;
                metrics.GpuCoreClock = gpuMetrics.CoreClock;
                metrics.GpuMemoryClock = gpuMetrics.MemoryClock;
                metrics.GpuVramUsed = gpuMetrics.VramUsed;
                metrics.GpuVramTotal = gpuMetrics.VramTotal;
                metrics.GpuThrottling = IsGpuThrottling();
                
                // RAM
                var ramInfo = GetRamInfo();
                metrics.RamUsagePercent = ramInfo.UsagePercent;
                metrics.RamUsedGb = ramInfo.UsedGb;
                metrics.RamTotalGb = ramInfo.TotalGb;
                
                _lastUpdate = DateTime.Now;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[Thermal] Erro ao coletar métricas: {ex.Message}");
            }
            
            return metrics;
        }
        
        /// <summary>
        /// Obtém temperatura da CPU via WMI
        /// </summary>
        public double GetCpuTemperature()
        {
            try
            {
                // Método 1: MSAcpi_ThermalZoneTemperature (mais comum)
                using var searcher = new ManagementObjectSearcher(@"root\WMI", 
                    "SELECT * FROM MSAcpi_ThermalZoneTemperature");
                
                foreach (ManagementObject obj in searcher.Get())
                {
                    var temp = Convert.ToDouble(obj["CurrentTemperature"]);
                    // Converter de Kelvin * 10 para Celsius
                    var celsius = (temp - 2732) / 10.0;
                    
                    if (celsius > 0 && celsius < 150) // Sanity check
                    {
                        _lastCpuTemp = celsius;
                        return celsius;
                    }
                }
            }
            catch { }
            
            // Método 2: Win32_TemperatureProbe (menos comum)
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_TemperatureProbe");
                
                foreach (ManagementObject obj in searcher.Get())
                {
                    var temp = obj["CurrentReading"];
                    if (temp != null)
                    {
                        var celsius = Convert.ToDouble(temp);
                        if (celsius > 0 && celsius < 150)
                        {
                            _lastCpuTemp = celsius;
                            return celsius;
                        }
                    }
                }
            }
            catch { }
            
            // Método 3: Estimar pela carga
            var usage = GetCpuUsage();
            var estimated = 40 + (usage * 0.5); // Estimativa grosseira
            
            return _lastCpuTemp > 0 ? _lastCpuTemp : estimated;
        }
        
        /// <summary>
        /// Obtém temperatura da GPU
        /// </summary>
        public double GetGpuTemperature()
        {
            if (_hasNvidiaSmi)
            {
                return GetNvidiaTemperature();
            }
            
            // Tentar via WMI para AMD/Intel
            try
            {
                // AMD via WMI
                using var searcher = new ManagementObjectSearcher(
                    @"root\AMD\ADL", "SELECT * FROM ADL_GpuTemperature");
                
                foreach (ManagementObject obj in searcher.Get())
                {
                    var temp = Convert.ToDouble(obj["Temperature"]);
                    if (temp > 0 && temp < 150)
                    {
                        _lastGpuTemp = temp;
                        return temp;
                    }
                }
            }
            catch { }
            
            // OpenHardwareMonitor fallback
            try
            {
                using var searcher = new ManagementObjectSearcher(
                    @"root\OpenHardwareMonitor", 
                    "SELECT * FROM Sensor WHERE SensorType='Temperature' AND Name LIKE '%GPU%'");
                
                foreach (ManagementObject obj in searcher.Get())
                {
                    var temp = Convert.ToDouble(obj["Value"]);
                    if (temp > 0 && temp < 150)
                    {
                        _lastGpuTemp = temp;
                        return temp;
                    }
                }
            }
            catch { }
            
            return _lastGpuTemp;
        }
        
        private double GetNvidiaTemperature()
        {
            try
            {
                using var proc = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = NvidiaSmiPath,
                        Arguments = "--query-gpu=temperature.gpu --format=csv,noheader,nounits",
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        RedirectStandardOutput = true
                    }
                };
                
                proc.Start();
                var output = proc.StandardOutput.ReadToEnd().Trim();
                proc.WaitForExit(1000);
                
                if (double.TryParse(output, System.Globalization.NumberStyles.Float, System.Globalization.CultureInfo.InvariantCulture, out var temp))
                {
                    if (temp > 0 && temp < 150) // Sanity check
                    {
                        _lastGpuTemp = temp;
                        return temp;
                    }
                }
            }
            catch { }
            
            return _lastGpuTemp;
        }
        
        /// <summary>
        /// Obtém uso da CPU
        /// </summary>
        public double GetCpuUsage()
        {
            try
            {
                if (_cpuCounter != null)
                {
                    _lastCpuUsage = _cpuCounter.NextValue();
                    return _lastCpuUsage;
                }
            }
            catch { }
            
            // Fallback via WMI
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT LoadPercentage FROM Win32_Processor");
                
                foreach (ManagementObject obj in searcher.Get())
                {
                    var load = Convert.ToDouble(obj["LoadPercentage"]);
                    _lastCpuUsage = load;
                    return load;
                }
            }
            catch { }
            
            return _lastCpuUsage;
        }
        
        /// <summary>
        /// Obtém uso da GPU
        /// </summary>
        public double GetGpuUsage()
        {
            if (_hasNvidiaSmi)
            {
                try
                {
                    using var proc = new Process
                    {
                        StartInfo = new ProcessStartInfo
                        {
                            FileName = NvidiaSmiPath,
                            Arguments = "--query-gpu=utilization.gpu --format=csv,noheader,nounits",
                            UseShellExecute = false,
                            CreateNoWindow = true,
                            RedirectStandardOutput = true
                        }
                    };
                    
                    proc.Start();
                    var output = proc.StandardOutput.ReadToEnd().Trim();
                    proc.WaitForExit(1000);
                    
                    if (double.TryParse(output, out var usage))
                    {
                        _lastGpuUsage = usage;
                        return usage;
                    }
                }
                catch { }
            }
            
            return _lastGpuUsage;
        }
        
        /// <summary>
        /// Verifica se CPU está em throttling
        /// </summary>
        public bool IsCpuThrottling()
        {
            try
            {
                // Verificar temperatura primeiro (mais confiável)
                if (_lastCpuTemp > 85)
                    return true;
                
                using var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_Processor");
                
                foreach (ManagementObject obj in searcher.Get())
                {
                    // Verificar se a frequência está abaixo do máximo
                    var currentMhz = Convert.ToDouble(obj["CurrentClockSpeed"]);
                    var maxMhz = Convert.ToDouble(obj["MaxClockSpeed"]);
                    
                    // Se está rodando a menos de 80% da frequência máxima e a carga é alta
                    if (maxMhz > 0 && currentMhz < maxMhz * 0.8 && _lastCpuUsage > 80)
                    {
                        return true;
                    }
                }
            }
            catch { }
            
            return false;
        }
        
        /// <summary>
        /// Verifica se GPU está em throttling
        /// </summary>
        public bool IsGpuThrottling()
        {
            // GPU throttling detectado por temperatura alta + uso alto
            // NVIDIA geralmente throttla acima de 83°C
            if (_lastGpuTemp > 83)
                return true;
            
            // Também verificar se uso está alto mas temperatura não está sendo reportada corretamente
            if (_lastGpuTemp > 0 && _lastGpuTemp > 80 && _lastGpuUsage > 90)
                return true;
            
            return false;
        }
        
        /// <summary>
        /// Obtém frequência atual da CPU
        /// </summary>
        private double GetCpuFrequency()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT CurrentClockSpeed FROM Win32_Processor");
                
                foreach (ManagementObject obj in searcher.Get())
                {
                    return Convert.ToDouble(obj["CurrentClockSpeed"]);
                }
            }
            catch { }
            
            return 0;
        }
        
        /// <summary>
        /// Obtém métricas detalhadas da GPU
        /// </summary>
        private async Task<(double Temperature, double Usage, double Power, 
            double CoreClock, double MemoryClock, double VramUsed, double VramTotal)> GetGpuMetricsAsync(CancellationToken ct)
        {
            if (!_hasNvidiaSmi)
                return (0, 0, 0, 0, 0, 0, 0);
            
            try
            {
                using var proc = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = NvidiaSmiPath,
                        Arguments = "--query-gpu=temperature.gpu,utilization.gpu,power.draw,clocks.gr,clocks.mem,memory.used,memory.total --format=csv,noheader,nounits",
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        RedirectStandardOutput = true
                    }
                };
                
                proc.Start();
                var output = await proc.StandardOutput.ReadToEndAsync();
                await proc.WaitForExitAsync(ct);
                
                var parts = output.Split(',');
                if (parts.Length >= 7)
                {
                    double.TryParse(parts[0].Trim(), out var temp);
                    double.TryParse(parts[1].Trim(), out var usage);
                    double.TryParse(parts[2].Trim(), out var power);
                    double.TryParse(parts[3].Trim(), out var coreClock);
                    double.TryParse(parts[4].Trim(), out var memClock);
                    double.TryParse(parts[5].Trim(), out var vramUsed);
                    double.TryParse(parts[6].Trim(), out var vramTotal);
                    
                    _lastGpuTemp = temp;
                    _lastGpuUsage = usage;
                    
                    return (temp, usage, power, coreClock, memClock, vramUsed / 1024, vramTotal / 1024);
                }
            }
            catch { }
            
            return (_lastGpuTemp, _lastGpuUsage, 0, 0, 0, 0, 0);
        }
        
        /// <summary>
        /// Obtém informações de RAM
        /// </summary>
        private (double UsagePercent, double UsedGb, double TotalGb) GetRamInfo()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_OperatingSystem");
                
                foreach (ManagementObject obj in searcher.Get())
                {
                    var totalKb = Convert.ToDouble(obj["TotalVisibleMemorySize"]);
                    var freeKb = Convert.ToDouble(obj["FreePhysicalMemory"]);
                    
                    var totalGb = totalKb / 1024 / 1024;
                    var usedGb = (totalKb - freeKb) / 1024 / 1024;
                    var usagePercent = ((totalKb - freeKb) / totalKb) * 100;
                    
                    return (usagePercent, usedGb, totalGb);
                }
            }
            catch { }
            
            return (0, 0, 0);
        }
        
        public void Dispose()
        {
            _cpuCounter?.Dispose();
        }
    }
}

