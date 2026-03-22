using System;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Services.Gamer.Overlay.Implementation;
using VoltrisOptimizer.Services.Gamer.Overlay.Helpers;
using VoltrisOptimizer.Services.Gamer.GamerModeManager;

namespace VoltrisOptimizer.Services.Gamer.Implementation.AdaptiveGovernor
{
    /// <summary>
    /// Camada de telemetria para coleta de métricas reais do sistema
    /// SOMENTE LEITURA - não modifica nada
    /// </summary>
    internal class TelemetryLayer : IDisposable
    {
        private readonly ILoggingService _logger;
        private readonly Process? _gameProcess;
        private readonly TelemetryService? _telemetryService;
        private readonly FpsReader? _fpsReader;
        private readonly IThermalMonitorService? _thermalMonitor;
        
        // NativeSystemMetrics para CPU/RAM (substitui PerformanceCounters pesados)
        private readonly VoltrisOptimizer.Helpers.NativeSystemMetrics _nativeMetrics = new();
        
        // Cache de frequência da CPU para evitar WMI lento no hot path
        private double _cachedCpuFreqCurrent;
        private double _cachedCpuFreqMax;
        private DateTime _lastFreqCheck = DateTime.MinValue;
        private readonly TimeSpan _freqCheckInterval = TimeSpan.FromSeconds(5);
        // Performance counters para métricas específicas (DPC, Interrupt, Queue - sem alternativa nativa)
        private PerformanceCounter? _cpuQueueCounter;
        private PerformanceCounter? _dpcCounter;
        private PerformanceCounter? _interruptCounter;
        private PerformanceCounter? _pageFaultsCounter;
        
        private bool _disposed = false;
        
        public TelemetryLayer(
            ILoggingService logger,
            Process? gameProcess,
            TelemetryService? telemetryService = null,
            FpsReader? fpsReader = null,
            IThermalMonitorService? thermalMonitor = null)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _gameProcess = gameProcess;
            _telemetryService = telemetryService;
            _fpsReader = fpsReader;
            _thermalMonitor = thermalMonitor;
            
            InitializeCounters();
        }
        
        private void InitializeCounters()
        {
            try
            {
                // CPU/RAM: NativeSystemMetrics (warm-up)
                _nativeMetrics.GetCpuUsage();
                
                _cpuQueueCounter = new PerformanceCounter("System", "Processor Queue Length");
                _cpuQueueCounter.NextValue();
                
                try
                {
                    _dpcCounter = new PerformanceCounter("Processor", "% DPC Time", "_Total");
                    _dpcCounter.NextValue();
                }
                catch
                {
                    _logger.LogWarning("[TelemetryLayer] DPC Counter não disponível");
                }
                
                try
                {
                    _interruptCounter = new PerformanceCounter("Processor", "% Interrupt Time", "_Total");
                    _interruptCounter.NextValue();
                }
                catch
                {
                    _logger.LogWarning("[TelemetryLayer] Interrupt Counter não disponível");
                }
                
                try
                {
                    _pageFaultsCounter = new PerformanceCounter("Memory", "Page Faults/sec");
                    _pageFaultsCounter.NextValue();
                }
                catch
                {
                    _logger.LogWarning("[TelemetryLayer] Page Faults Counter não disponível");
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[TelemetryLayer] Erro ao inicializar contadores: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Coleta todas as métricas do sistema em tempo real
        /// </summary>
        public async Task<SystemMetrics> CollectMetricsAsync(CancellationToken cancellationToken = default)
        {
            var metrics = new SystemMetrics
            {
                Timestamp = DateTime.UtcNow
            };
            
            try
            {
                // Coletar métricas em paralelo quando possível
                var cpuTask = Task.Run(() => CollectCpuMetrics(metrics), cancellationToken);
                var ramTask = Task.Run(() => CollectRamMetrics(metrics), cancellationToken);
                var gpuTask = CollectGpuMetricsAsync(metrics, cancellationToken);
                var fpsTask = CollectFpsMetricsAsync(metrics, cancellationToken);
                var processTask = CollectProcessMetricsAsync(metrics, cancellationToken);
                
                await Task.WhenAll(cpuTask, ramTask, gpuTask, fpsTask, processTask);
            }
            catch (OperationCanceledException)
            {
                // Cancelamento normal durante shutdown — não é erro
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[TelemetryLayer] Erro ao coletar métricas: {ex.Message}");
            }
            
            return metrics;
        }
        
        private void CollectCpuMetrics(SystemMetrics metrics)
        {
            try
            {
                // CPU Usage Total (NativeSystemMetrics - GetSystemTimes)
                metrics.CpuUsagePercent = _nativeMetrics.GetCpuUsage();
                
                // Processor Queue Length
                if (_cpuQueueCounter != null)
                {
                    metrics.ProcessorQueueLength = _cpuQueueCounter.NextValue();
                }
                
                // DPC Time
                if (_dpcCounter != null)
                {
                    metrics.DpcPercent = _dpcCounter.NextValue();
                }
                
                // Interrupt Time
                if (_interruptCounter != null)
                {
                    metrics.InterruptPercent = _interruptCounter.NextValue();
                }
                
                // Page Faults
                if (_pageFaultsCounter != null)
                {
                    metrics.PageFaultsPerSec = _pageFaultsCounter.NextValue();
                }
                
                // CPU Clock via WMI - OTIMIZADO: Apenas a cada 5 segundos
                // WMI é extremamente lento e causa stutter se chamado no hot path
                if (DateTime.UtcNow - _lastFreqCheck > _freqCheckInterval)
                {
                    try
                    {
                        using var searcher = new System.Management.ManagementObjectSearcher(
                            "SELECT CurrentClockSpeed, MaxClockSpeed FROM Win32_Processor");
                        foreach (System.Management.ManagementObject obj in searcher.Get())
                        {
                            var current = obj["CurrentClockSpeed"];
                            var max = obj["MaxClockSpeed"];
                            if (current != null) _cachedCpuFreqCurrent = Convert.ToDouble(current);
                            if (max != null) _cachedCpuFreqMax = Convert.ToDouble(max);
                            break;
                        }
                        _lastFreqCheck = DateTime.UtcNow;
                    }
                    catch { }
                }
                
                metrics.CpuFreqCurrentMhz = _cachedCpuFreqCurrent;
                metrics.CpuFreqMaxMhz = _cachedCpuFreqMax;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[TelemetryLayer] Erro ao coletar métricas de CPU: {ex.Message}");
            }
        }
        
        private void CollectRamMetrics(SystemMetrics metrics)
        {
            try
            {
                var memInfo = _nativeMetrics.GetMemoryUsage();
                metrics.RamUsagePercent = memInfo.UsagePercent;
                metrics.RamUsedGb = memInfo.UsedGb;
                metrics.RamTotalGb = memInfo.TotalGb;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[TelemetryLayer] Erro ao coletar métricas de RAM: {ex.Message}");
            }
        }
        
        private async Task CollectGpuMetricsAsync(SystemMetrics metrics, CancellationToken cancellationToken)
        {
            try
            {
                // Usar TelemetryService se disponível (mais confiável)
                if (_telemetryService != null)
                {
                    var telemetryData = await _telemetryService.CollectMetricsAsync(cancellationToken);
                    metrics.GpuUsagePercent = telemetryData.GpuUsagePercent;
                    metrics.GpuTemperature = telemetryData.GpuTemperature;
                    metrics.VramUsagePercent = telemetryData.VramUsagePercent;
                }
                // Fallback para ThermalMonitorService
                else if (_thermalMonitor != null)
                {
                    var thermalMetrics = await _thermalMonitor.GetMetricsAsync(cancellationToken);
                    metrics.GpuUsagePercent = thermalMetrics.GpuUsage;
                    metrics.GpuTemperature = thermalMetrics.GpuTemperature > 0 ? thermalMetrics.GpuTemperature : null;
                    
                    if (thermalMetrics.GpuVramTotal > 0)
                    {
                        metrics.VramUsagePercent = (thermalMetrics.GpuVramUsed / thermalMetrics.GpuVramTotal) * 100;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[TelemetryLayer] Erro ao coletar métricas de GPU: {ex.Message}");
            }
        }
        
        private async Task CollectFpsMetricsAsync(SystemMetrics metrics, CancellationToken cancellationToken)
        {
            try
            {
                if (_fpsReader != null)
                {
                    // FPS já está sendo atualizado em background pelo FpsReader
                    metrics.Fps = _fpsReader.CurrentFps;
                    metrics.FrameTimeMs = _fpsReader.FrameTimeMs;
                    
                    // Calcular jitter (variação de frame time)
                    // Nota: FpsReader já calcula isso internamente, mas podemos melhorar aqui
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[TelemetryLayer] Erro ao coletar métricas de FPS: {ex.Message}");
            }
        }
        
        private async Task CollectProcessMetricsAsync(SystemMetrics metrics, CancellationToken cancellationToken)
        {
            try
            {
                if (_gameProcess != null && !_gameProcess.HasExited)
                {
                    // CPU Usage do processo do jogo
                    metrics.GameCpuPercent = await GetProcessCpuUsageAsync(_gameProcess, cancellationToken);
                    
                    // Memory do processo
                    metrics.GameMemoryMb = _gameProcess.WorkingSet64 / (1024.0 * 1024.0);
                }
            }
            catch (OperationCanceledException)
            {
                // Cancelamento normal durante shutdown do AdaptiveGovernor — não é erro
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[TelemetryLayer] Erro ao coletar métricas do processo: {ex.Message}");
            }
        }
        
        private async Task<double> GetProcessCpuUsageAsync(Process process, CancellationToken cancellationToken)
        {
            try
            {
                var startTime = DateTime.UtcNow;
                var startCpu = process.TotalProcessorTime;

                // Task.Delay respeita o CancellationToken — sem bloquear thread
                await Task.Delay(100, cancellationToken);

                var endTime = DateTime.UtcNow;
                var endCpu = process.TotalProcessorTime;

                var cpuUsedMs = (endCpu - startCpu).TotalMilliseconds;
                var totalMs = (endTime - startTime).TotalMilliseconds;
                var cpuCount = Environment.ProcessorCount;

                return (cpuUsedMs / (totalMs * cpuCount)) * 100.0;
            }
            catch (OperationCanceledException)
            {
                return 0;
            }
            catch
            {
                return 0;
            }
        }
        
        private double GetTotalRamGb()
        {
            try
            {
                using var searcher = new System.Management.ManagementObjectSearcher(
                    "SELECT Capacity FROM Win32_PhysicalMemory");
                long totalBytes = 0;
                
                foreach (System.Management.ManagementObject obj in searcher.Get())
                {
                    if (obj["Capacity"] != null)
                    {
                        totalBytes += Convert.ToInt64(obj["Capacity"]);
                    }
                }
                
                return totalBytes / (1024.0 * 1024.0 * 1024.0);
            }
            catch
            {
                return 0;
            }
        }
        
        public void Dispose()
        {
            if (_disposed)
                return;
            
            _cpuQueueCounter?.Dispose();
            _dpcCounter?.Dispose();
            _interruptCounter?.Dispose();
            _pageFaultsCounter?.Dispose();
            
            _disposed = true;
        }
    }
    
    /// <summary>
    /// Métricas coletadas do sistema
    /// </summary>
    internal class SystemMetrics
    {
        public DateTime Timestamp { get; set; }
        
        // CPU
        public double CpuUsagePercent { get; set; }
        public double ProcessorQueueLength { get; set; }
        public double DpcPercent { get; set; }
        public double InterruptPercent { get; set; }
        public double PageFaultsPerSec { get; set; }
        public double CpuFreqCurrentMhz { get; set; }
        public double CpuFreqMaxMhz { get; set; }
        
        // RAM
        public double RamUsagePercent { get; set; }
        public double RamUsedGb { get; set; }
        public double RamTotalGb { get; set; }
        
        // GPU
        public double GpuUsagePercent { get; set; }
        public double? GpuTemperature { get; set; }
        public double VramUsagePercent { get; set; }
        
        // FPS
        public double Fps { get; set; }
        public double FrameTimeMs { get; set; }
        
        // Processo do Jogo
        public double GameCpuPercent { get; set; }
        public double GameMemoryMb { get; set; }
    }
}

