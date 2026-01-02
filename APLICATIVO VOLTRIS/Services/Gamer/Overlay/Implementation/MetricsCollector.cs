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
    /// CORREÇÃO: Reconstruído para usar TelemetryService profissional
    /// Atualização em tempo real (100-200ms) com fallbacks robustos
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
        
        // CORREÇÃO: Usar TelemetryService profissional
        private TelemetryService? _telemetryService;
        private IThermalMonitorService? _thermalMonitor;
        
        // MELHORIAS: Helpers para leitura precisa de FPS
        private FpsReader? _fpsReader;
        private HardwareMonitorHelper? _hardwareMonitor;

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

            // CORREÇÃO: Inicializar TelemetryService profissional
            try
            {
                _telemetryService = new TelemetryService(_logger, _gameProcess, _thermalMonitor);
                _logger?.LogInfo("[MetricsCollector] TelemetryService inicializado");
            }
            catch (Exception ex)
            {
                _logger?.LogWarning($"[MetricsCollector] Erro ao inicializar TelemetryService: {ex.Message}");
            }

            // MELHORIA: Inicializar helpers para leitura precisa de FPS
            try
            {
                _fpsReader = new FpsReader(_gameProcess, _logger);
                _fpsReader.StartMonitoring();
                _logger?.LogInfo("[MetricsCollector] FpsReader inicializado");
            }
            catch (Exception ex)
            {
                _logger?.LogWarning($"[MetricsCollector] Erro ao inicializar FpsReader: {ex.Message}");
            }

            try
            {
                _hardwareMonitor = new HardwareMonitorHelper();
                _logger?.LogInfo("[MetricsCollector] HardwareMonitorHelper inicializado");
                
                // Log de GPU detectada
                if (_hardwareMonitor.HasDedicatedGpu())
                {
                    var gpuName = _hardwareMonitor.GetDedicatedGpuName();
                    _logger?.LogInfo($"[MetricsCollector] GPU dedicada detectada: {gpuName}");
                }
            }
            catch (Exception ex)
            {
                _logger?.LogWarning($"[MetricsCollector] Erro ao inicializar HardwareMonitorHelper: {ex.Message}");
            }

            _cancellationTokenSource = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
            _collectionTask = CollectionLoopAsync(_cancellationTokenSource.Token);

            _logger?.LogInfo($"[MetricsCollector] Coleta de métricas iniciada para PID {gameProcessId}");
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

        private async Task CollectionLoopAsync(CancellationToken cancellationToken)
        {
            try
            {
                // CORREÇÃO: Aguardar um pouco para garantir que tudo está inicializado
                await Task.Delay(100, cancellationToken);

                while (!cancellationToken.IsCancellationRequested)
                {
                    try
                    {
                        var now = DateTime.Now;
                        MetricsData metrics;

                        // CORREÇÃO: Usar TelemetryService profissional para coletar métricas
                        if (_telemetryService != null)
                        {
                            metrics = await _telemetryService.CollectMetricsAsync(cancellationToken);
                        }
                        else
                        {
                            // Fallback: criar métricas vazias
                            metrics = new MetricsData { Timestamp = now };
                        }

                        // Coletar FPS do processo do jogo (via FpsReader)
                        if (_gameProcess != null && !_gameProcess.HasExited)
                        {
                            await CollectFpsMetricsAsync(_gameProcess, metrics, cancellationToken);
                        }
                        else
                        {
                            // Processo encerrou, parar coleta
                            break;
                        }

                        // Atualizar histórico
                        metrics.AddFpsToHistory(metrics.Fps);
                        metrics.AddFrameTimeToHistory(metrics.FrameTimeMs);

                        lock (_lock)
                        {
                            _currentMetrics = metrics;
                        }

                        MetricsUpdated?.Invoke(this, metrics);

                        // CORREÇÃO: Atualizar a cada 100ms para métricas suaves (10Hz)
                        // Isso garante atualização fluida sem sobrecarregar o sistema
                        await Task.Delay(100, cancellationToken);
                    }
                    catch (OperationCanceledException)
                    {
                        break;
                    }
                    catch (Exception ex)
                    {
                        _logger?.LogWarning($"[MetricsCollector] Erro na coleta: {ex.Message}");
                        await Task.Delay(200, cancellationToken);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[MetricsCollector] Erro crítico no loop de coleta: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// CORREÇÃO: Coleta apenas FPS do processo (outras métricas via TelemetryService)
        /// </summary>
        private async Task CollectFpsMetricsAsync(Process process, MetricsData metrics, CancellationToken cancellationToken)
        {
            try
            {
                process.Refresh();

                // CORREÇÃO: Usar FpsReader para leitura real de FPS
                if (_fpsReader != null)
                {
                    try
                    {
                        metrics.Fps = _fpsReader.CurrentFps;
                        metrics.FrameTimeMs = _fpsReader.FrameTimeMs;
                        
                        // Validar valores
                        if (metrics.Fps <= 0 || metrics.Fps > 1000)
                        {
                            // Usar valores anteriores se inválidos
                            metrics.Fps = _currentMetrics.Fps > 0 ? _currentMetrics.Fps : 60;
                            metrics.FrameTimeMs = _currentMetrics.FrameTimeMs > 0 ? _currentMetrics.FrameTimeMs : 16.67;
                        }
                    }
                    catch
                    {
                        // Fallback para valores anteriores
                        metrics.Fps = _currentMetrics.Fps > 0 ? _currentMetrics.Fps : 60;
                        metrics.FrameTimeMs = _currentMetrics.FrameTimeMs > 0 ? _currentMetrics.FrameTimeMs : 16.67;
                    }
                }
                else
                {
                    // Fallback: usar valores anteriores
                    metrics.Fps = _currentMetrics.Fps > 0 ? _currentMetrics.Fps : 60;
                    metrics.FrameTimeMs = _currentMetrics.FrameTimeMs > 0 ? _currentMetrics.FrameTimeMs : 16.67;
                }
            }
            catch
            {
                // Em caso de erro, usar valores anteriores
                metrics.Fps = _currentMetrics.Fps > 0 ? _currentMetrics.Fps : 60;
                metrics.FrameTimeMs = _currentMetrics.FrameTimeMs > 0 ? _currentMetrics.FrameTimeMs : 16.67;
            }
            
            await Task.CompletedTask;
        }

        public void Dispose()
        {
            if (_disposed)
                return;

            StopAsync().Wait(1000);
            
            _telemetryService?.Dispose();
            _fpsReader?.Dispose();
            _hardwareMonitor?.Dispose();
            _gameProcess?.Dispose();
            
            _disposed = true;
        }
    }
}


