using System;
using System.Collections.Generic;
using System.Linq;
using System.Management;
using System.Threading;
using System.Threading.Tasks;
using LibreHardwareMonitor.Hardware;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Services.Gamer.Overlay.Models;

namespace VoltrisOptimizer.Services.Gamer.Overlay.Helpers
{
    /// <summary>
    /// Serviço PROFISSIONAL de monitoramento de hardware usando LibreHardwareMonitor
    /// Captura TODAS as métricas com precisão igual ao MSI Afterburner
    /// </summary>
    public class LibreHardwareMonitorService : IDisposable
    {
        private readonly ILoggingService? _logger;
        private Computer? _computer;
        private bool _disposed = false;
        private readonly object _lock = new object();
        
        // Cache de sensores para acesso rápido
        private ISensor? _cpuUsageSensor;
        private ISensor? _cpuTempSensor;
        private ISensor? _cpuClockSensor;
        private ISensor? _gpuUsageSensor;
        private ISensor? _gpuTempSensor;
        private ISensor? _gpuCoreClockSensor;
        private ISensor? _gpuMemoryClockSensor;
        private ISensor? _gpuMemoryUsedSensor;
        private ISensor? _gpuMemoryTotalSensor;
        private ISensor? _ramUsedSensor;
        private ISensor? _ramAvailableSensor;
        
        // Valores em cache
        private MetricsData _cachedMetrics = new MetricsData();
        private DateTime _lastUpdate = DateTime.MinValue;
        private long _validateLogCounter;
        private const int UpdateIntervalMs = 2000; // Atualizar a cada 2000ms (reduzido de 100ms para economizar CPU)
        
        public LibreHardwareMonitorService(ILoggingService? logger = null)
        {
            _logger = logger;
            Initialize();
        }
        
        private void Initialize()
        {
            try
            {
                _logger?.LogInfo("[LibreHWMonitor] Inicializando LibreHardwareMonitor...");
                
                _computer = new Computer
                {
                    IsCpuEnabled = true,
                    IsGpuEnabled = true,
                    IsMemoryEnabled = true,
                    IsMotherboardEnabled = true,
                    IsNetworkEnabled = false, // Não precisamos de rede
                    IsStorageEnabled = false, // Não precisamos de storage
                    IsControllerEnabled = false,
                    IsBatteryEnabled = false
                };
                
                _computer.Open();
                _computer.Accept(new UpdateVisitor());
                
                // Descobrir e cachear sensores
                DiscoverSensors();
                
                _logger?.LogSuccess("[LibreHWMonitor] ✅ LibreHardwareMonitor inicializado com sucesso!");
                LogDiscoveredHardware();
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[LibreHWMonitor] Erro ao inicializar: {ex.Message}", ex);
            }
        }
        
        private void DiscoverSensors()
        {
            if (_computer == null) return;
            
            try
            {
                foreach (var hardware in _computer.Hardware)
                {
                    hardware.Update();
                    
                    switch (hardware.HardwareType)
                    {
                        case HardwareType.Cpu:
                            DiscoverCpuSensors(hardware);
                            break;
                            
                        case HardwareType.GpuNvidia:
                        case HardwareType.GpuAmd:
                        case HardwareType.GpuIntel:
                            DiscoverGpuSensors(hardware);
                            break;
                            
                        case HardwareType.Memory:
                            DiscoverMemorySensors(hardware);
                            break;
                    }
                    
                    // Verificar sub-hardware
                    foreach (var subHardware in hardware.SubHardware)
                    {
                        subHardware.Update();
                        
                        if (subHardware.HardwareType == HardwareType.GpuNvidia ||
                            subHardware.HardwareType == HardwareType.GpuAmd ||
                            subHardware.HardwareType == HardwareType.GpuIntel)
                        {
                            DiscoverGpuSensors(subHardware);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger?.LogWarning($"[LibreHWMonitor] Erro ao descobrir sensores: {ex.Message}");
            }
        }
        
        private void DiscoverCpuSensors(IHardware hardware)
        {
            _logger?.LogInfo($"[LibreHWMonitor] 🔍 Descobrindo sensores de CPU: {hardware.Name}");
            _logger?.LogInfo($"[LibreHWMonitor] Total de sensores na CPU: {hardware.Sensors.Length}");
            
            // Log de TODOS os sensores para debug
            foreach (var sensor in hardware.Sensors)
            {
                _logger?.LogInfo($"[LibreHWMonitor]   [CPU] Sensor: Type={sensor.SensorType}, Name='{sensor.Name}', Value={sensor.Value}, Id={sensor.Identifier}");
            }
            
            foreach (var sensor in hardware.Sensors)
            {
                switch (sensor.SensorType)
                {
                    case SensorType.Load:
                        if (_cpuUsageSensor == null && 
                            (sensor.Name.Contains("CPU Total") || sensor.Name.Contains("Total")))
                        {
                            _cpuUsageSensor = sensor;
                            _logger?.LogSuccess($"[LibreHWMonitor] ✅ CPU Usage: {sensor.Name} (Identifier: {sensor.Identifier})");
                        }
                        break;
                        
                    case SensorType.Temperature:
                        // CORREÇÃO: Aceitar mais variantes de nomes de sensores de temperatura
                        if (_cpuTempSensor == null &&
                            (sensor.Name.Contains("Package") || sensor.Name.Contains("Core Average") || 
                             sensor.Name.Contains("CPU") || sensor.Name.Contains("Tctl") ||
                             sensor.Name.Contains("Tdie") || sensor.Name.Contains("CCD") ||
                             sensor.Name.Contains("Core #0") || sensor.Name.Contains("Core (Tctl")))
                        {
                            _cpuTempSensor = sensor;
                            _logger?.LogSuccess($"[LibreHWMonitor] ✅ CPU Temp: {sensor.Name} (Identifier: {sensor.Identifier})");
                        }
                        break;
                        
                    case SensorType.Clock:
                        // CORREÇÃO: Aceitar mais variantes de nomes de sensores de clock
                        if (_cpuClockSensor == null &&
                            (sensor.Name.Contains("Core #0") || sensor.Name.Contains("Core 0") || 
                             sensor.Name.Contains("CPU Core #1") || sensor.Name.Contains("Core #1") ||
                             sensor.Name.Contains("Bus Speed") == false)) // Excluir Bus Speed
                        {
                            // Pegar o primeiro sensor de clock que não seja Bus Speed
                            if (!sensor.Name.Contains("Bus"))
                            {
                                _cpuClockSensor = sensor;
                                _logger?.LogSuccess($"[LibreHWMonitor] ✅ CPU Clock: {sensor.Name} (Identifier: {sensor.Identifier})");
                            }
                        }
                        break;
                }
            }
        }
        
        private void DiscoverGpuSensors(IHardware hardware)
        {
            _logger?.LogInfo($"[LibreHWMonitor] 🔍 Descobrindo sensores de GPU: {hardware.Name}");
            _logger?.LogInfo($"[LibreHWMonitor] Total de sensores na GPU: {hardware.Sensors.Length}");
            
            // Log de TODOS os sensores para debug
            foreach (var sensor in hardware.Sensors)
            {
                _logger?.LogInfo($"[LibreHWMonitor]   [GPU] Sensor: Type={sensor.SensorType}, Name='{sensor.Name}', Value={sensor.Value}, Id={sensor.Identifier}");
            }
            
            foreach (var sensor in hardware.Sensors)
            {
                switch (sensor.SensorType)
                {
                    case SensorType.Load:
                        if (_gpuUsageSensor == null &&
                            (sensor.Name.Contains("GPU Core") || sensor.Name.Contains("D3D 3D") ||
                             sensor.Name.Contains("GPU") && !sensor.Name.Contains("Memory")))
                        {
                            _gpuUsageSensor = sensor;
                            _logger?.LogSuccess($"[LibreHWMonitor] ✅ GPU Usage: {sensor.Name} (Identifier: {sensor.Identifier})");
                        }
                        break;
                        
                    case SensorType.Temperature:
                        if (_gpuTempSensor == null &&
                            (sensor.Name.Contains("GPU Core") || sensor.Name.Contains("GPU Temperature") ||
                             sensor.Name.Contains("GPU Hot Spot") || sensor.Name.Contains("GPU")))
                        {
                            _gpuTempSensor = sensor;
                            _logger?.LogSuccess($"[LibreHWMonitor] ✅ GPU Temp: {sensor.Name} (Identifier: {sensor.Identifier})");
                        }
                        break;
                        
                    case SensorType.Clock:
                        if (_gpuCoreClockSensor == null && sensor.Name.Contains("GPU Core"))
                        {
                            _gpuCoreClockSensor = sensor;
                            _logger?.LogSuccess($"[LibreHWMonitor] ✅ GPU Core Clock: {sensor.Name} (Identifier: {sensor.Identifier})");
                        }
                        else if (_gpuMemoryClockSensor == null && sensor.Name.Contains("GPU Memory"))
                        {
                            _gpuMemoryClockSensor = sensor;
                            _logger?.LogSuccess($"[LibreHWMonitor] ✅ GPU Memory Clock: {sensor.Name} (Identifier: {sensor.Identifier})");
                        }
                        break;
                        
                    case SensorType.SmallData:
                        if (_gpuMemoryUsedSensor == null &&
                            (sensor.Name.Contains("GPU Memory Used") || sensor.Name.Contains("D3D Dedicated Memory Used")))
                        {
                            _gpuMemoryUsedSensor = sensor;
                            _logger?.LogSuccess($"[LibreHWMonitor] ✅ GPU Memory Used: {sensor.Name} (Identifier: {sensor.Identifier})");
                        }
                        else if (_gpuMemoryTotalSensor == null &&
                                 (sensor.Name.Contains("GPU Memory Total") || sensor.Name.Contains("D3D Dedicated Memory")))
                        {
                            _gpuMemoryTotalSensor = sensor;
                            _logger?.LogSuccess($"[LibreHWMonitor] ✅ GPU Memory Total: {sensor.Name} (Identifier: {sensor.Identifier})");
                        }
                        break;
                }
            }
        }
        
        private void DiscoverMemorySensors(IHardware hardware)
        {
            _logger?.LogInfo($"[LibreHWMonitor] 🔍 Descobrindo sensores de Memória: {hardware.Name}");
            _logger?.LogInfo($"[LibreHWMonitor] Total de sensores na RAM: {hardware.Sensors.Length}");
            
            // Log de TODOS os sensores para debug
            foreach (var sensor in hardware.Sensors)
            {
                _logger?.LogInfo($"[LibreHWMonitor]   [RAM] Sensor: Type={sensor.SensorType}, Name='{sensor.Name}', Value={sensor.Value}, Id={sensor.Identifier}");
            }
            
            foreach (var sensor in hardware.Sensors)
            {
                if (sensor.SensorType == SensorType.Data)
                {
                    if (_ramUsedSensor == null && sensor.Name.Contains("Memory Used"))
                    {
                        _ramUsedSensor = sensor;
                        _logger?.LogSuccess($"[LibreHWMonitor] ✅ RAM Used: {sensor.Name}");
                    }
                    else if (_ramAvailableSensor == null && sensor.Name.Contains("Memory Available"))
                    {
                        _ramAvailableSensor = sensor;
                        _logger?.LogSuccess($"[LibreHWMonitor] ✅ RAM Available: {sensor.Name}");
                    }
                }
                // CORREÇÃO: Também verificar Load para RAM usage percentual direto
                else if (sensor.SensorType == SensorType.Load && sensor.Name.Contains("Memory"))
                {
                    _logger?.LogInfo($"[LibreHWMonitor] RAM Load sensor encontrado: {sensor.Name} = {sensor.Value}%");
                }
            }
        }
        
        private void LogDiscoveredHardware()
        {
            if (_computer == null) return;
            
            _logger?.LogInfo("═══════════════════════════════════════════════════════════");
            _logger?.LogInfo("🖥️ HARDWARE DETECTADO:");
            
            foreach (var hardware in _computer.Hardware)
            {
                _logger?.LogInfo($"  • {hardware.HardwareType}: {hardware.Name}");
                
                foreach (var subHardware in hardware.SubHardware)
                {
                    _logger?.LogInfo($"    ↳ {subHardware.HardwareType}: {subHardware.Name}");
                }
            }
            
            _logger?.LogInfo("═══════════════════════════════════════════════════════════");
            _logger?.LogInfo("📊 SENSORES CONFIGURADOS:");
            _logger?.LogInfo($"  CPU Usage: {(_cpuUsageSensor != null ? "✅" : "❌")}");
            _logger?.LogInfo($"  CPU Temp: {(_cpuTempSensor != null ? "✅" : "❌")}");
            _logger?.LogInfo($"  CPU Clock: {(_cpuClockSensor != null ? "✅" : "❌")}");
            _logger?.LogInfo($"  GPU Usage: {(_gpuUsageSensor != null ? "✅" : "❌")}");
            _logger?.LogInfo($"  GPU Temp: {(_gpuTempSensor != null ? "✅" : "❌")}");
            _logger?.LogInfo($"  GPU Core Clock: {(_gpuCoreClockSensor != null ? "✅" : "❌")}");
            _logger?.LogInfo($"  GPU Memory Clock: {(_gpuMemoryClockSensor != null ? "✅" : "❌")}");
            _logger?.LogInfo($"  GPU Memory Used: {(_gpuMemoryUsedSensor != null ? "✅" : "❌")}");
            _logger?.LogInfo($"  GPU Memory Total: {(_gpuMemoryTotalSensor != null ? "✅" : "❌")}");
            _logger?.LogInfo($"  RAM Used: {(_ramUsedSensor != null ? "✅" : "❌")}");
            _logger?.LogInfo($"  RAM Available: {(_ramAvailableSensor != null ? "✅" : "❌")}");
            _logger?.LogInfo("═══════════════════════════════════════════════════════════");
        }
        
        /// <summary>
        /// Coleta todas as métricas do hardware
        /// </summary>
        public async Task<MetricsData> CollectMetricsAsync(CancellationToken cancellationToken = default)
        {
            var now = DateTime.Now;
            
            // Usar cache se atualização foi recente (< 100ms)
            if ((now - _lastUpdate).TotalMilliseconds < UpdateIntervalMs)
            {
                return _cachedMetrics;
            }
            
            try
            {
                lock (_lock)
                {
                    if (_computer == null)
                    {
                        return _cachedMetrics;
                    }
                    
                    // Atualizar apenas os hardwares com sensores cacheados (seletivo, muito mais leve que Computer.Accept)
                    UpdateRelevantHardware();
                    
                    var metrics = new MetricsData
                    {
                        Timestamp = now
                    };
                    
                    // CPU
                    if (_cpuUsageSensor?.Value.HasValue == true)
                    {
                        metrics.CpuUsagePercent = _cpuUsageSensor.Value.Value;
                    }
                    
                    if (_cpuTempSensor?.Value.HasValue == true)
                    {
                        metrics.CpuTemperature = _cpuTempSensor.Value.Value;
                    }
                    
                    if (_cpuClockSensor?.Value.HasValue == true)
                    {
                        metrics.CpuClockMhz = _cpuClockSensor.Value.Value;
                    }
                    
                    // GPU
                    if (_gpuUsageSensor?.Value.HasValue == true)
                    {
                        metrics.GpuUsagePercent = _gpuUsageSensor.Value.Value;
                    }
                    
                    if (_gpuTempSensor?.Value.HasValue == true)
                    {
                        metrics.GpuTemperature = _gpuTempSensor.Value.Value;
                    }
                    else if (_cpuTempSensor?.Value.HasValue == true && IsIntelIntegratedGpu())
                    {
                        // FALLBACK: iGPU segue temperatura da CPU com offset negativo leve
                        metrics.GpuTemperature = _cpuTempSensor.Value.Value - 1.5;
                        _logger?.LogDebug($"[LibreHWMonitor] iGPU Temp (estimada): {metrics.GpuTemperature:F1}°C");
                    }
                    
                    if (_gpuCoreClockSensor?.Value.HasValue == true)
                    {
                        metrics.GpuCoreClockMhz = _gpuCoreClockSensor.Value.Value;
                    }
                    
                    if (_gpuMemoryClockSensor?.Value.HasValue == true)
                    {
                        metrics.GpuMemoryClockMhz = _gpuMemoryClockSensor.Value.Value;
                    }

                    // FALLBACK MASTER: Se após LHM a temperatura ainda for NULA, tentar WMI local
                    if (!metrics.CpuTemperature.HasValue || metrics.CpuTemperature <= 0)
                    {
                        metrics.CpuTemperature = (float?)TryGetCpuTempFromWmi();
                    }
                    
                    if (!metrics.GpuTemperature.HasValue || metrics.GpuTemperature <= 0)
                    {
                        // Se for Intel ou se falhou, tentar WMI ou estimativa
                        if (metrics.CpuTemperature.HasValue)
                            metrics.GpuTemperature = metrics.CpuTemperature.Value - 2.0;
                    }
                    
                    // VRAM - CORREÇÃO: Buscar sensores alternativos se os principais não existirem
                    if (_gpuMemoryUsedSensor?.Value.HasValue == true && _gpuMemoryTotalSensor?.Value.HasValue == true)
                    {
                        var usedMb = _gpuMemoryUsedSensor.Value.Value;
                        var totalMb = _gpuMemoryTotalSensor.Value.Value;
                        
                        if (totalMb > 0)
                        {
                            metrics.VramUsagePercent = (usedMb / totalMb) * 100.0;
                            _logger?.LogInfo($"[LibreHWMonitor] VRAM: {usedMb:F0}MB / {totalMb:F0}MB = {metrics.VramUsagePercent:F1}%");
                        }
                    }
                    else
                    {
                        // FALLBACK: Tentar encontrar sensores de VRAM dinamicamente
                        metrics.VramUsagePercent = TryGetVramUsageFromAlternativeSensors();
                        if (metrics.VramUsagePercent > 0)
                        {
                            _logger?.LogInfo($"[LibreHWMonitor] VRAM (fallback): {metrics.VramUsagePercent:F1}%");
                        }
                    }
                    
                    // RAM
                    if (_ramUsedSensor?.Value.HasValue == true && _ramAvailableSensor?.Value.HasValue == true)
                    {
                        var usedGb = _ramUsedSensor.Value.Value;
                        var availableGb = _ramAvailableSensor.Value.Value;
                        var totalGb = usedGb + availableGb;
                        
                        if (totalGb > 0)
                        {
                            metrics.RamUsagePercent = (usedGb / totalGb) * 100.0;
                        }
                    }
                    
                    // Validar valores
                    ValidateMetrics(metrics);
                    
                    _cachedMetrics = metrics;
                    _lastUpdate = now;
                    
                    return metrics;
                }
            }
            catch (Exception ex)
            {
                _logger?.LogWarning($"[LibreHWMonitor] Erro ao coletar métricas: {ex.Message}");
                return _cachedMetrics;
            }
        }

        /// <summary>
        /// Atualiza apenas os hardwares que possuem sensores cacheados.
        /// Muito mais eficiente que Computer.Accept() que percorre TODOS os hardwares.
        /// </summary>
        private void UpdateRelevantHardware()
        {
            if (_computer == null) return;
            var seen = new HashSet<IHardware>(ReferenceEqualityComparer.Instance);
            
            // Coletar os hardwares pai dos sensores cacheados
            foreach (var hardware in _computer.Hardware)
            {
                bool needed = false;
                foreach (var sensor in hardware.Sensors)
                {
                    if (sensor == _cpuUsageSensor || sensor == _cpuTempSensor || sensor == _cpuClockSensor ||
                        sensor == _gpuUsageSensor || sensor == _gpuTempSensor || sensor == _gpuCoreClockSensor ||
                        sensor == _gpuMemoryClockSensor || sensor == _gpuMemoryUsedSensor || sensor == _gpuMemoryTotalSensor ||
                        sensor == _ramUsedSensor || sensor == _ramAvailableSensor)
                    {
                        needed = true;
                        break;
                    }
                }
                if (needed && seen.Add(hardware))
                    hardware.Update();

                // Sub-hardware
                foreach (var sub in hardware.SubHardware)
                {
                    bool subNeeded = false;
                    foreach (var sensor in sub.Sensors)
                    {
                        if (sensor == _gpuUsageSensor || sensor == _gpuTempSensor || sensor == _gpuCoreClockSensor ||
                            sensor == _gpuMemoryClockSensor || sensor == _gpuMemoryUsedSensor || sensor == _gpuMemoryTotalSensor)
                        {
                            subNeeded = true;
                            break;
                        }
                    }
                    if (subNeeded && seen.Add(sub))
                        sub.Update();
                }
            }
            
            // Fallback: se nenhum sensor foi cacheado ainda, atualizar tudo uma vez
            if (seen.Count == 0)
            {
                foreach (var hardware in _computer.Hardware)
                    hardware.Update();
            }
        }

        private bool IsIntelIntegratedGpu()        {
            if (_computer == null) return false;
            return _computer.Hardware.Any(h => h.HardwareType == HardwareType.GpuIntel);
        }

        private double? TryGetCpuTempFromWmi()
        {
            try
            {
                using (var searcher = new System.Management.ManagementObjectSearcher(@"root\WMI", "SELECT CurrentTemperature FROM MSAcpi_ThermalZoneTemperature"))
                {
                    foreach (var obj in searcher.Get())
                    {
                        double tempRaw = Convert.ToDouble(obj["CurrentTemperature"]);
                        return (tempRaw / 10.0) - 273.15;
                    }
                }
            }
            catch { }
            return null;
        }
        
        /// <summary>
        /// FALLBACK: Tenta obter uso de VRAM de sensores alternativos
        /// </summary>
        private double TryGetVramUsageFromAlternativeSensors()
        {
            if (_computer == null) return 0;
            
            try
            {
                foreach (var hardware in _computer.Hardware)
                {
                    if (hardware.HardwareType == HardwareType.GpuNvidia ||
                        hardware.HardwareType == HardwareType.GpuAmd ||
                        hardware.HardwareType == HardwareType.GpuIntel)
                    {
                        hardware.Update();
                        
                        double? usedMb = null;
                        double? totalMb = null;
                        double? usagePercent = null;
                        
                        foreach (var sensor in hardware.Sensors)
                        {
                            // Procurar por sensores de Load que possam ser VRAM
                            if (sensor.SensorType == SensorType.Load)
                            {
                                if (sensor.Name.Contains("Memory") || sensor.Name.Contains("VRAM"))
                                {
                                    usagePercent = sensor.Value;
                                    _logger?.LogInfo($"[LibreHWMonitor] VRAM Load encontrado: {sensor.Name} = {usagePercent:F1}%");
                                }
                            }
                            // Procurar por sensores de Data (MB)
                            else if (sensor.SensorType == SensorType.Data || sensor.SensorType == SensorType.SmallData)
                            {
                                if (sensor.Name.Contains("Memory Used") || sensor.Name.Contains("D3D Dedicated Memory Used"))
                                {
                                    usedMb = sensor.Value;
                                    _logger?.LogInfo($"[LibreHWMonitor] VRAM Used encontrado: {sensor.Name} = {usedMb:F0}MB");
                                }
                                else if (sensor.Name.Contains("Memory Total") || sensor.Name.Contains("D3D Dedicated Memory"))
                                {
                                    totalMb = sensor.Value;
                                    _logger?.LogInfo($"[LibreHWMonitor] VRAM Total encontrado: {sensor.Name} = {totalMb:F0}MB");
                                }
                            }
                        }
                        
                        // Se encontrou porcentagem direta, usar
                        if (usagePercent.HasValue && usagePercent.Value > 0)
                        {
                            return usagePercent.Value;
                        }
                        
                        // Se encontrou usado e total, calcular
                        if (usedMb.HasValue && totalMb.HasValue && totalMb.Value > 0)
                        {
                            return (usedMb.Value / totalMb.Value) * 100.0;
                        }
                    }
                    
                    // Verificar sub-hardware
                    foreach (var subHardware in hardware.SubHardware)
                    {
                        if (subHardware.HardwareType == HardwareType.GpuNvidia ||
                            subHardware.HardwareType == HardwareType.GpuAmd ||
                            subHardware.HardwareType == HardwareType.GpuIntel)
                        {
                            subHardware.Update();
                            
                            foreach (var sensor in subHardware.Sensors)
                            {
                                if (sensor.SensorType == SensorType.Load && 
                                    (sensor.Name.Contains("Memory") || sensor.Name.Contains("VRAM")) &&
                                    sensor.Value.HasValue)
                                {
                                    _logger?.LogInfo($"[LibreHWMonitor] VRAM Load (sub) encontrado: {sensor.Name} = {sensor.Value:F1}%");
                                    return sensor.Value.Value;
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger?.LogWarning($"[LibreHWMonitor] Erro ao buscar VRAM alternativo: {ex.Message}");
            }
            
            return 0;
        }
        
        private void ValidateMetrics(MetricsData metrics)
        {
            // Validar CPU — clampar valores em vez de usar cache (cache pode ter valores inválidos)
            if (metrics.CpuUsagePercent < 0) metrics.CpuUsagePercent = 0;
            else if (metrics.CpuUsagePercent > 100) metrics.CpuUsagePercent = 100;
            
            if (metrics.CpuTemperature.HasValue && (metrics.CpuTemperature.Value < 0 || metrics.CpuTemperature.Value > 150))
            {
                metrics.CpuTemperature = null;
            }
            
            if (metrics.CpuClockMhz.HasValue && (metrics.CpuClockMhz.Value < 100 || metrics.CpuClockMhz.Value > 10000))
            {
                metrics.CpuClockMhz = null;
            }
            
            // Validar GPU — clampar valores
            if (metrics.GpuUsagePercent < 0) metrics.GpuUsagePercent = 0;
            else if (metrics.GpuUsagePercent > 100) metrics.GpuUsagePercent = 100;
            
            if (metrics.GpuTemperature.HasValue && (metrics.GpuTemperature.Value < 0 || metrics.GpuTemperature.Value > 150))
            {
                metrics.GpuTemperature = null;
            }
            
            if (metrics.GpuCoreClockMhz.HasValue && (metrics.GpuCoreClockMhz.Value < 100 || metrics.GpuCoreClockMhz.Value > 5000))
            {
                metrics.GpuCoreClockMhz = null;
            }
            
            if (metrics.GpuMemoryClockMhz.HasValue && (metrics.GpuMemoryClockMhz.Value < 100 || metrics.GpuMemoryClockMhz.Value > 10000))
            {
                metrics.GpuMemoryClockMhz = null;
            }
            
            // Validar VRAM
            if (metrics.VramUsagePercent < 0) metrics.VramUsagePercent = 0;
            else if (metrics.VramUsagePercent > 100) metrics.VramUsagePercent = 100;
            
            // Validar RAM
            if (metrics.RamUsagePercent < 0) metrics.RamUsagePercent = 0;
            else if (metrics.RamUsagePercent > 100) metrics.RamUsagePercent = 100;

            // Log periódico (a cada 50 chamadas ~5s) em vez de a cada chamada
            _validateLogCounter++;
            if (_validateLogCounter % 50 == 1)
            {
                _logger?.LogInfo($"[LibreHWMonitor] ═══════════════════════════════════════════════════════");
                _logger?.LogInfo($"[LibreHWMonitor] 📊 MÉTRICAS REAIS COLETADAS:");
                _logger?.LogInfo($"[LibreHWMonitor]   CPU Usage: {metrics.CpuUsagePercent:F1}% | Temp: {metrics.CpuTemperature?.ToString("F1") ?? "N/A"}°C | Clock: {metrics.CpuClockMhz?.ToString("F0") ?? "N/A"} MHz");
                _logger?.LogInfo($"[LibreHWMonitor]   GPU Usage: {metrics.GpuUsagePercent:F1}% | Temp: {metrics.GpuTemperature?.ToString("F1") ?? "N/A"}°C | Core: {metrics.GpuCoreClockMhz?.ToString("F0") ?? "N/A"} MHz | Mem: {metrics.GpuMemoryClockMhz?.ToString("F0") ?? "N/A"} MHz");
                _logger?.LogInfo($"[LibreHWMonitor]   RAM: {metrics.RamUsagePercent:F1}% | VRAM: {metrics.VramUsagePercent:F1}%");
                _logger?.LogInfo($"[LibreHWMonitor]   FPS: {metrics.Fps:F1} | FrameTime: {metrics.FrameTimeMs:F2}ms");
                _logger?.LogInfo($"[LibreHWMonitor] ═══════════════════════════════════════════════════════");
            }
        }
        
        public void Dispose()
        {
            if (_disposed)
                return;
            
            try
            {
                _computer?.Close();
                _computer = null;
            }
            catch (Exception ex)
            {
                _logger?.LogWarning($"[LibreHWMonitor] Erro ao fechar: {ex.Message}");
            }
            
            _disposed = true;
        }
    }
    
    /// <summary>
    /// Visitor para atualizar todos os sensores
    /// </summary>
    internal class UpdateVisitor : IVisitor
    {
        public void VisitComputer(IComputer computer)
        {
            computer.Traverse(this);
        }
        
        public void VisitHardware(IHardware hardware)
        {
            hardware.Update();
            foreach (var subHardware in hardware.SubHardware)
            {
                subHardware.Accept(this);
            }
        }
        
        public void VisitSensor(ISensor sensor) { }
        public void VisitParameter(IParameter parameter) { }
    }
}
