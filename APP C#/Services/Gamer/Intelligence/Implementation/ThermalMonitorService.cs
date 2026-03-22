using System;
using System.Management;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services.Gamer.Intelligence.Interfaces;
using VoltrisOptimizer.Services.Gamer.Intelligence.Models;

namespace VoltrisOptimizer.Services.Gamer.Intelligence.Implementation
{
    /// <summary>
    /// Monitor térmico - detecta throttling e ajusta otimizações
    /// </summary>
    public class ThermalMonitorService : IThermalMonitor, IDisposable
    {
        private readonly ILoggingService _logger;
        private ThermalProfile _currentThermal = new();
        private CancellationTokenSource? _monitoringCts;
        private Task? _monitoringTask;
        private readonly object _lock = new();

        private double _maxCpuTemp;
        private double _maxGpuTemp;
        private bool _throttlingDetected;

        private const double CpuThrottleThreshold = 90.0;
        private const double GpuThrottleThreshold = 85.0;
        private const double CriticalThreshold = 95.0;

        public ThermalProfile CurrentThermal => _currentThermal;
        public event EventHandler<ThermalProfile>? ThrottlingDetected;

        public ThermalMonitorService(ILoggingService logger)
        {
            _logger = logger;
        }

        public void StartMonitoring(int intervalMs = 2000)
        {
            StopMonitoring();
            _monitoringCts = new CancellationTokenSource();
            _monitoringTask = MonitorLoop(intervalMs, _monitoringCts.Token);
            _logger.LogInfo("[Thermal] Iniciando monitoramento de temperatura");
        }

        public void StopMonitoring()
        {
            if (_monitoringCts != null)
            {
                _monitoringCts.Cancel();
                try { _monitoringTask?.Wait(1000); } catch { }
                _monitoringCts.Dispose();
                _monitoringCts = null;
            }
        }

        private async Task MonitorLoop(int intervalMs, CancellationToken ct)
        {
            while (!ct.IsCancellationRequested)
            {
                try
                {
                    UpdateTemperatures();

                    // Verifica throttling
                    bool isThrottling = IsThrottling();
                    if (isThrottling && !_throttlingDetected)
                    {
                        _throttlingDetected = true;
                        _logger.LogWarning($"[Thermal] ⚠️ THROTTLING DETECTADO! CPU: {_currentThermal.CpuTempCurrent:F0}°C, GPU: {_currentThermal.GpuTempCurrent:F0}°C");
                        ThrottlingDetected?.Invoke(this, _currentThermal);
                    }
                    else if (!isThrottling && _throttlingDetected)
                    {
                        _throttlingDetected = false;
                        _logger.LogInfo("[Thermal] Temperaturas normalizadas");
                    }

                    await Task.Delay(intervalMs, ct);
                }
                catch (Exception ex) when (ex is not OperationCanceledException)
                {
                    _logger.LogError($"[Thermal] Erro no monitoramento: {ex.Message}");
                    await Task.Delay(5000, ct);
                }
            }
        }

        private void UpdateTemperatures()
        {
            var cpuTemp = GetCpuTemperature();
            var gpuTemp = GetGpuTemperature();

            lock (_lock)
            {
                _currentThermal.CpuTempCurrent = cpuTemp;
                _currentThermal.GpuTempCurrent = gpuTemp;

                if (cpuTemp > _maxCpuTemp) _maxCpuTemp = cpuTemp;
                if (gpuTemp > _maxGpuTemp) _maxGpuTemp = gpuTemp;

                _currentThermal.CpuTempMax = _maxCpuTemp;
                _currentThermal.GpuTempMax = _maxGpuTemp;
                _currentThermal.IsThermalConstrained = 
                    cpuTemp > CpuThrottleThreshold || gpuTemp > GpuThrottleThreshold;
            }
        }

        private double GetCpuTemperature()
        {
            try
            {
                // Tenta WMI MSAcpi_ThermalZoneTemperature
                var obj = VoltrisOptimizer.Utils.WmiHelper.QueryFirstSafe("SELECT CurrentTemperature FROM MSAcpi_ThermalZoneTemperature", "root\\WMI");
                if (obj != null)
                {
                    var kelvin = Convert.ToDouble(obj["CurrentTemperature"]);
                    var celsius = (kelvin / 10.0) - 273.15;
                    if (celsius > 0 && celsius < 150)
                        return celsius;
                }
            }
            catch { }

            // Fallback: tenta OpenHardwareMonitor/LibreHardwareMonitor WMI
            try
            {
                var obj = VoltrisOptimizer.Utils.WmiHelper.QueryFirstSafe("SELECT Value FROM Sensor WHERE SensorType='Temperature' AND Name LIKE '%CPU%'", "root\\OpenHardwareMonitor");
                if (obj != null) return Convert.ToDouble(obj["Value"]);
                
                obj = VoltrisOptimizer.Utils.WmiHelper.QueryFirstSafe("SELECT Value FROM Sensor WHERE SensorType='Temperature' AND Name LIKE '%CPU%'", "root\\LibreHardwareMonitor");
                if (obj != null) return Convert.ToDouble(obj["Value"]);
            }
            catch { }

            // Se não conseguir ler, retorna valor seguro
            return 60.0;
        }

        private double GetGpuTemperature()
        {
            // NVIDIA via WMI
            try
            {
                var obj = VoltrisOptimizer.Utils.WmiHelper.QueryFirstSafe("SELECT SensorValue FROM NvGpuSensor WHERE SensorID=15", "root\\CIMV2\\NV");
                if (obj != null) return Convert.ToDouble(obj["SensorValue"]);
            }
            catch { }

            // AMD via WMI
            try
            {
                var obj = VoltrisOptimizer.Utils.WmiHelper.QueryFirstSafe("SELECT Temperature FROM ADL_GpuTemperature", "root\\AMD\\ADL");
                if (obj != null) return Convert.ToDouble(obj["Temperature"]);
            }
            catch { }

            // OpenHardwareMonitor/LibreHardwareMonitor fallback
            try
            {
                var obj = VoltrisOptimizer.Utils.WmiHelper.QueryFirstSafe("SELECT Value FROM Sensor WHERE SensorType='Temperature' AND Name LIKE '%GPU%'", "root\\OpenHardwareMonitor");
                if (obj != null) return Convert.ToDouble(obj["Value"]);
                
                obj = VoltrisOptimizer.Utils.WmiHelper.QueryFirstSafe("SELECT Value FROM Sensor WHERE SensorType='Temperature' AND Name LIKE '%GPU%'", "root\\LibreHardwareMonitor");
                if (obj != null) return Convert.ToDouble(obj["Value"]);
            }
            catch { }

            return 55.0; // Valor seguro padrão
        }

        public bool IsThrottling()
        {
            lock (_lock)
            {
                return _currentThermal.CpuTempCurrent > CpuThrottleThreshold ||
                       _currentThermal.GpuTempCurrent > GpuThrottleThreshold;
            }
        }

        public ThermalAction GetRecommendedAction()
        {
            lock (_lock)
            {
                var maxTemp = Math.Max(_currentThermal.CpuTempCurrent, _currentThermal.GpuTempCurrent);

                return maxTemp switch
                {
                    >= CriticalThreshold => ThermalAction.EmergencyThrottle,
                    >= 90 => ThermalAction.PauseOptimizations,
                    >= 85 => ThermalAction.ReduceOptimizations,
                    _ => ThermalAction.None
                };
            }
        }

        public void Dispose()
        {
            StopMonitoring();
            GC.SuppressFinalize(this);
        }
    }
}

