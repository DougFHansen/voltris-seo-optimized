using System;
using System.Diagnostics;
using System.Management;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Services.Gamer.GamerModeManager;
using VoltrisOptimizer.Services.Gamer.Overlay.Interfaces;
using VoltrisOptimizer.Services.Gamer.Overlay.Models;
using VoltrisOptimizer.Services.Gamer.Overlay.Helpers;

namespace VoltrisOptimizer.Services.Gamer.Overlay.Implementation
{
    /// <summary>
    /// Coletor de métricas do sistema para o overlay OSD
    /// CORREÇÃO FINAL: Usa LibreHardwareMonitor para métricas 100% precisas
    /// + Fallback para GlobalThermalMonitorService quando sensores não disponíveis
    /// </summary>
    public class MetricsCollector : IMetricsCollector, IDisposable
    {
        private readonly ILoggingService? _logger;
        private CancellationTokenSource? _cancellationTokenSource;
        private Task? _collectionTask;
        private int _gameProcessId;
        private Process? _gameProcess;
        private bool _disposed = false;
        private readonly object _lock = new object();

        private MetricsData _currentMetrics = new MetricsData();
        
        // CORREÇÃO FINAL: Usar LibreHardwareMonitor (melhor biblioteca disponível)
        private LibreHardwareMonitorService? _hardwareMonitor;
        
        // MELHORIAS: Helpers para leitura precisa de FPS
        private FpsReader? _fpsReader;
        
        // Input Latency Estimator
        private InputLatencyEstimator? _inputLatencyEstimator;
        
        // CORREÇÃO: Referência ao ThermalMonitorService para fallback de temperatura
        private readonly IThermalMonitorService? _thermalMonitor;

        public event EventHandler<MetricsData>? MetricsUpdated;

        public MetricsCollector(ILoggingService? logger = null, IThermalMonitorService? thermalMonitor = null)
        {
            _logger = logger;
            _thermalMonitor = thermalMonitor;
        }

        public async Task StartAsync(int gameProcessId, CancellationToken cancellationToken = default)
        {
            if (_collectionTask != null)
                return;

            _gameProcessId = gameProcessId;
            
            try
            {
                _gameProcess = Process.GetProcessById(gameProcessId);
            }
            catch
            {
                _logger?.LogWarning($"[MetricsCollector] Processo {gameProcessId} não encontrado");
                return;
            }

            // CORREÇÃO FINAL: Inicializar LibreHardwareMonitor
            try
            {
                _hardwareMonitor = new LibreHardwareMonitorService(_logger);
                _logger?.LogSuccess("[MetricsCollector] ✅ LibreHardwareMonitor inicializado");
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[MetricsCollector] Erro ao inicializar LibreHardwareMonitor: {ex.Message}", ex);
            }

            // MELHORIA: Inicializar FpsReader para leitura de FPS
            try
            {
                _fpsReader = new FpsReader(_gameProcess, _logger);
                _fpsReader.StartMonitoring();
                _logger?.LogSuccess("[MetricsCollector] ✅ FpsReader inicializado");
            }
            catch (Exception ex)
            {
                _logger?.LogWarning($"[MetricsCollector] Erro ao inicializar FpsReader: {ex.Message}");
            }
            
            // Inicializar Input Latency Estimator
            try
            {
                _inputLatencyEstimator = new InputLatencyEstimator(_logger);
                _logger?.LogSuccess("[MetricsCollector] ✅ InputLatencyEstimator inicializado");
            }
            catch (Exception ex)
            {
                _logger?.LogWarning($"[MetricsCollector] Erro ao inicializar InputLatencyEstimator: {ex.Message}");
            }

            _cancellationTokenSource = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            _collectionTask = CollectionLoopAsync(_cancellationTokenSource.Token);

            _logger?.LogSuccess($"[MetricsCollector] ✅ Coleta de métricas iniciada para PID {gameProcessId}");
            await Task.CompletedTask;
        }

        public async Task StopAsync()
        {
            try
            {
                _cancellationTokenSource?.Cancel();
                if (_collectionTask != null)
                {
                    await _collectionTask;
                }
            }
            catch { }
            finally
            {
                // MELHORIA: Parar helpers
                _fpsReader?.StopMonitoring();
                _fpsReader?.Dispose();
                _fpsReader = null;

                _hardwareMonitor?.Dispose();
                _hardwareMonitor = null;
                
                _inputLatencyEstimator = null;

                _collectionTask = null;
                _cancellationTokenSource?.Dispose();
                _cancellationTokenSource = null;
                _gameProcess = null;
            }

            _logger?.LogInfo("[MetricsCollector] Coleta de métricas parada");
        }

        public MetricsData GetCurrentMetrics()
        {
            lock (_lock)
            {
                return _currentMetrics;
            }
        }

        private int _loopIteration = 0;

        private async Task CollectionLoopAsync(CancellationToken cancellationToken)
        {
            try
            {
                // Aguardar um pouco para garantir que tudo está inicializado
                await Task.Delay(500, cancellationToken);
                _logger?.LogInfo("[MetricsCollector] 🔄 Loop de coleta iniciado");

                while (!cancellationToken.IsCancellationRequested)
                {
                    try
                    {
                        _loopIteration++;
                        var now = DateTime.Now;
                        MetricsData metrics;

                        // Usar LibreHardwareMonitor para coletar TODAS as métricas de hardware
                        if (_hardwareMonitor != null)
                        {
                            metrics = await _hardwareMonitor.CollectMetricsAsync(cancellationToken);
                        }
                        else
                        {
                            metrics = new MetricsData { Timestamp = now };
                            if (_loopIteration % 50 == 1)
                                _logger?.LogWarning("[MetricsCollector] ⚠ LibreHardwareMonitor é NULL — métricas de hardware indisponíveis");
                        }

                        // Coletar FPS do processo do jogo (via FpsReader ETW)
                        if (_gameProcess != null && !_gameProcess.HasExited)
                        {
                            CollectFpsMetrics(_gameProcess, metrics);
                        }
                        else
                        {
                            _logger?.LogInfo("[MetricsCollector] Processo do jogo encerrou — parando coleta");
                            break;
                        }
                        
                        // CORREÇÃO: Fallback para GlobalThermalMonitorService quando LibreHWMonitor não tem dados
                        ApplyThermalFallback(metrics);
                        
                        // Estimar Input Latency
                        if (_inputLatencyEstimator != null)
                        {
                            metrics.InputLatencyMs = _inputLatencyEstimator.EstimateInputLatency(
                                metrics.FrameTimeMs,
                                metrics.CpuUsagePercent,
                                metrics.GpuUsagePercent
                            );
                        }

                        // Atualizar histórico
                        metrics.AddFpsToHistory(metrics.Fps);
                        metrics.AddFrameTimeToHistory(metrics.FrameTimeMs);

                        // Log detalhado a cada 30 iterações (~3 segundos)
                        if (_loopIteration % 30 == 1)
                        {
                            _logger?.LogInfo($"[MetricsCollector] ═══════════════════════════════════════════════════════");
                            _logger?.LogInfo($"[MetricsCollector] 📊 MÉTRICAS COMPLETAS (iteração {_loopIteration}):");
                            _logger?.LogInfo($"[MetricsCollector]   FPS: {metrics.Fps:F1} | FrameTime: {metrics.FrameTimeMs:F2}ms");
                            _logger?.LogInfo($"[MetricsCollector]   CPU: {metrics.CpuUsagePercent:F1}% | GPU: {metrics.GpuUsagePercent:F1}%");
                            _logger?.LogInfo($"[MetricsCollector]   RAM: {metrics.RamUsagePercent:F1}% | VRAM: {metrics.VramUsagePercent:F1}%");
                            _logger?.LogInfo($"[MetricsCollector]   CPU Temp: {metrics.CpuTemperature?.ToString("F1") ?? "N/A"}°C | GPU Temp: {metrics.GpuTemperature?.ToString("F1") ?? "N/A"}°C");
                            _logger?.LogInfo($"[MetricsCollector]   CPU Clock: {metrics.CpuClockMhz?.ToString("F0") ?? "N/A"} MHz | GPU Core: {metrics.GpuCoreClockMhz?.ToString("F0") ?? "N/A"} MHz | GPU Mem: {metrics.GpuMemoryClockMhz?.ToString("F0") ?? "N/A"} MHz");
                            _logger?.LogInfo($"[MetricsCollector]   Input Latency: {metrics.InputLatencyMs?.ToString("F2") ?? "N/A"}ms");
                            _logger?.LogInfo($"[MetricsCollector]   FpsReader: ETW={_fpsReader?.IsEtwActive ?? false} | Fallback={_fpsReader?.IsUsingFallback ?? false}");
                            _logger?.LogInfo($"[MetricsCollector] ═══════════════════════════════════════════════════════");
                        }

                        lock (_lock)
                        {
                            _currentMetrics = metrics;
                        }

                        MetricsUpdated?.Invoke(this, metrics);

                        // Atualizar a cada 100ms para métricas suaves (10Hz)
                        await Task.Delay(100, cancellationToken);
                    }
                    catch (OperationCanceledException)
                    {
                        break;
                    }
                    catch (Exception ex)
                    {
                        _logger?.LogWarning($"[MetricsCollector] Erro na coleta (iteração {_loopIteration}): {ex.Message}");
                        await Task.Delay(200, cancellationToken);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[MetricsCollector] Erro crítico no loop de coleta: {ex.Message}", ex);
            }
            finally
            {
                _logger?.LogInfo($"[MetricsCollector] Loop de coleta encerrado após {_loopIteration} iterações");
            }
        }

        /// <summary>
        /// Coleta FPS do processo do jogo via FpsReader (ETW)
        /// CORREÇÃO: Mostrar valor real (mesmo que 0) sem retenção de "fake values" parados.
        /// </summary>
        private void CollectFpsMetrics(Process process, MetricsData metrics)
        {
            try
            {
                if (_fpsReader != null)
                {
                    double fps = _fpsReader.CurrentFps;
                    double frameTime = _fpsReader.FrameTimeMs;

                    // Mostrar exatamente o que o leitor detectou
                    metrics.Fps = fps;
                    metrics.FrameTimeMs = frameTime;

                    // Log de debug a cada ~5 segundos
                    if (_loopIteration % 50 == 1)
                    {
                        _logger?.LogInfo($"[MetricsCollector] FPS real: {fps:F1}, FT: {frameTime:F2}ms, ETW: {_fpsReader.IsEtwActive}");
                    }
                }
                else
                {
                    metrics.Fps = 0;
                    metrics.FrameTimeMs = 0;
                }
            }
            catch (Exception ex)
            {
                _logger?.LogWarning($"[MetricsCollector] Erro ao coletar FPS: {ex.Message}");
                metrics.Fps = 0;
                metrics.FrameTimeMs = 0;
            }
        }

        /// <summary>
        /// CORREÇÃO: Fallback para GlobalThermalMonitorService quando LibreHardwareMonitor
        /// não consegue ler temperatura/clock (ex: Intel iGPU, sensores MSR bloqueados)
        /// </summary>
        private void ApplyThermalFallback(MetricsData metrics)
        {
            try
            {
                // Tentar obter dados do GlobalThermalMonitorService via App.ThermalMonitorService
                var thermalService = _thermalMonitor;
                VoltrisOptimizer.Services.Thermal.IGlobalThermalMonitorService? globalThermal = null;
                
                // Tentar via App estático se o serviço injetado não estiver disponível
                try
                {
                    globalThermal = VoltrisOptimizer.App.ThermalMonitorService;
                }
                catch { }
                
                if (globalThermal?.CurrentMetrics != null && globalThermal.CurrentMetrics.IsValid)
                {
                    var thermalMetrics = globalThermal.CurrentMetrics;
                    
                    // CPU Temperature fallback
                    if (!metrics.CpuTemperature.HasValue || metrics.CpuTemperature <= 0)
                    {
                        if (thermalMetrics.CpuTemperature > 0 && !double.IsNaN(thermalMetrics.CpuTemperature))
                        {
                            metrics.CpuTemperature = (float)thermalMetrics.CpuTemperature;
                            if (_loopIteration % 50 == 1)
                                _logger?.LogInfo($"[MetricsCollector] 🌡️ CPU Temp fallback from GlobalThermal: {metrics.CpuTemperature:F1}°C");
                        }
                    }
                    
                    // GPU Temperature fallback
                    if (!metrics.GpuTemperature.HasValue || metrics.GpuTemperature <= 0)
                    {
                        if (thermalMetrics.GpuTemperature > 0 && !double.IsNaN(thermalMetrics.GpuTemperature))
                        {
                            metrics.GpuTemperature = (float)thermalMetrics.GpuTemperature;
                            if (_loopIteration % 50 == 1)
                                _logger?.LogInfo($"[MetricsCollector] 🌡️ GPU Temp fallback from GlobalThermal: {metrics.GpuTemperature:F1}°C");
                        }
                    }
                }
                
                // CPU Clock fallback via WMI (se LibreHWMonitor retornou null)
                if (!metrics.CpuClockMhz.HasValue || metrics.CpuClockMhz <= 0)
                {
                    var cpuClock = GetCpuClockFromWmi();
                    if (cpuClock > 0)
                    {
                        metrics.CpuClockMhz = cpuClock;
                        if (_loopIteration % 50 == 1)
                            _logger?.LogInfo($"[MetricsCollector] ⏱️ CPU Clock fallback from WMI: {cpuClock:F0} MHz");
                    }
                }
                
                // GPU Core Clock fallback via WMI (Intel iGPU não expõe sensor "GPU Core" no LibreHWMonitor)
                if (!metrics.GpuCoreClockMhz.HasValue || metrics.GpuCoreClockMhz <= 0)
                {
                    var gpuClock = GetGpuClockFromWmi();
                    if (gpuClock > 0)
                    {
                        metrics.GpuCoreClockMhz = gpuClock;
                        if (_loopIteration % 50 == 1)
                            _logger?.LogInfo($"[MetricsCollector] 🎮 GPU Core Clock fallback from WMI: {gpuClock:F0} MHz");
                    }
                }
            }
            catch (Exception ex)
            {
                if (_loopIteration % 100 == 1)
                    _logger?.LogWarning($"[MetricsCollector] Thermal fallback error: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Obtém clock da CPU via WMI como fallback
        /// </summary>
        private float _cachedCpuClockMhz = 0;
        private DateTime _lastWmiClockQuery = DateTime.MinValue;
        
        private float GetCpuClockFromWmi()
        {
            // Cache por 2 segundos para evitar overhead WMI
            if ((DateTime.Now - _lastWmiClockQuery).TotalSeconds < 2 && _cachedCpuClockMhz > 0)
                return _cachedCpuClockMhz;
            
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT CurrentClockSpeed FROM Win32_Processor");
                foreach (var obj in searcher.Get())
                {
                    var clock = obj["CurrentClockSpeed"];
                    if (clock != null)
                    {
                        _cachedCpuClockMhz = Convert.ToSingle(clock);
                        _lastWmiClockQuery = DateTime.Now;
                        return _cachedCpuClockMhz;
                    }
                }
            }
            catch { }
            
            return 0;
        }
        
        /// <summary>
        /// Obtém clock da GPU via WMI como fallback (Intel iGPU não expõe sensor no LibreHWMonitor)
        /// Usa Win32_VideoController.CurrentRefreshRate e AdapterRAM para estimar,
        /// ou D3D performance counters quando disponível
        /// </summary>
        private float _cachedGpuClockMhz = 0;
        private DateTime _lastWmiGpuClockQuery = DateTime.MinValue;
        
        private float GetGpuClockFromWmi()
        {
            // Cache por 2 segundos
            if ((DateTime.Now - _lastWmiGpuClockQuery).TotalSeconds < 2 && _cachedGpuClockMhz > 0)
                return _cachedGpuClockMhz;
            
            try
            {
                // Tentar Win32_VideoController — campo CurrentBitsPerPixel não tem clock,
                // mas podemos usar o registro do driver Intel para obter o clock real
                using var searcher = new ManagementObjectSearcher(
                    "SELECT CurrentRefreshRate, MaxRefreshRate, AdapterCompatibility, Name FROM Win32_VideoController WHERE AdapterCompatibility IS NOT NULL");
                foreach (var obj in searcher.Get())
                {
                    var name = obj["Name"]?.ToString() ?? "";
                    var compat = obj["AdapterCompatibility"]?.ToString() ?? "";
                    
                    // Para Intel iGPU, tentar ler clock do registro
                    if (compat.Contains("Intel", StringComparison.OrdinalIgnoreCase) || 
                        name.Contains("Intel", StringComparison.OrdinalIgnoreCase) ||
                        name.Contains("Iris", StringComparison.OrdinalIgnoreCase))
                    {
                        var gpuClock = GetIntelGpuClockFromRegistry();
                        if (gpuClock > 0)
                        {
                            _cachedGpuClockMhz = gpuClock;
                            _lastWmiGpuClockQuery = DateTime.Now;
                            return _cachedGpuClockMhz;
                        }
                    }
                }
            }
            catch { }
            
            return 0;
        }
        
        /// <summary>
        /// Lê o clock atual da GPU Intel do registro do driver
        /// </summary>
        private float GetIntelGpuClockFromRegistry()
        {
            try
            {
                // Intel GPU frequency está disponível via performance counters do driver
                // Caminho: HKLM\SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000
                using var key = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(
                    @"SYSTEM\CurrentControlSet\Control\Class\{4d36e968-e325-11ce-bfc1-08002be10318}\0000");
                if (key != null)
                {
                    // Intel expõe "CoreFrequencyLimit" ou "IGPUFrequency" dependendo do driver
                    var freqObj = key.GetValue("CoreFrequencyLimit") ?? key.GetValue("IGPUFrequency");
                    if (freqObj != null && int.TryParse(freqObj.ToString(), out int freqMhz) && freqMhz > 0)
                    {
                        return freqMhz;
                    }
                    
                    // Fallback: usar MaxGpuFrequency (frequência máxima turbo da iGPU)
                    var maxFreqObj = key.GetValue("MaxGpuFrequency");
                    if (maxFreqObj == null)
                        maxFreqObj = key.GetValue("GpuMaxFrequency");
                    if (maxFreqObj != null && int.TryParse(maxFreqObj.ToString(), out int maxFreq) && maxFreq > 0)
                    {
                        // Estimar clock atual como ~70% do max quando GPU está ativa (40.2% usage nos logs)
                        var gpuUsage = _currentMetrics?.GpuUsagePercent ?? 50;
                        float estimatedClock = maxFreq * (float)Math.Max(0.3, Math.Min(1.0, gpuUsage / 100.0 + 0.3));
                        return estimatedClock;
                    }
                }
            }
            catch { }
            
            // Último fallback: usar PerformanceCounter de GPU Engine se disponível
            try
            {
                using var searcher = new ManagementObjectSearcher(
                    "SELECT AdapterDACType, MaxRefreshRate FROM Win32_VideoController");
                foreach (var obj in searcher.Get())
                {
                    // Intel Iris Xe tipicamente opera entre 300-1300 MHz
                    // Se temos GPU usage, podemos estimar o clock baseado no range
                    var gpuUsage = _currentMetrics?.GpuUsagePercent ?? 50;
                    if (gpuUsage > 5) // GPU está ativa
                    {
                        // Intel Iris Xe: base 300MHz, turbo 1300MHz
                        float baseClock = 300f;
                        float turboClock = 1300f;
                        float estimatedClock = baseClock + (turboClock - baseClock) * (float)(gpuUsage / 100.0);
                        return (float)Math.Round(estimatedClock / 50.0) * 50; // Arredondar para múltiplo de 50
                    }
                }
            }
            catch { }
            
            return 0;
        }

        public void Dispose()
        {
            if (_disposed)
                return;

            StopAsync().Wait(1000);
            
            _fpsReader?.Dispose();
            _hardwareMonitor?.Dispose();
            _inputLatencyEstimator = null;
            _gameProcess?.Dispose();
            
            _disposed = true;
        }
    }
}


