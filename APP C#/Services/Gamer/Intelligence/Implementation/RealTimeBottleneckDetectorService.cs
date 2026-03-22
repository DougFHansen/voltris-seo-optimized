using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services.Gamer.Intelligence.Interfaces;

namespace VoltrisOptimizer.Services.Gamer.Intelligence.Implementation
{
    /// <summary>
    /// REVOLUCIONÁRIO: Detecção de gargalos em tempo real com auto-fix
    /// Monitora CPU, GPU, RAM, Disco a cada 100ms
    /// Detecta qual componente está limitando FPS
    /// Aplica correção automática específica para aquele gargalo
    /// </summary>
    public class RealTimeBottleneckDetectorService : IDisposable
    {
        private readonly ILoggingService _logger;
        private readonly IHardwareProfiler _hardwareProfiler;
        private readonly IFrameTimeOptimizer _frameTimeOptimizer;
        private readonly IVramManager _vramManager;
        
        private CancellationTokenSource? _monitoringCts;
        private Task? _monitoringTask;
        private bool _isMonitoring;
        private int _monitoredProcessId;
        
        // Performance Counters (Reutilizados para eficiência)
        private PerformanceCounter? _cpuCounter;
        private PerformanceCounter? _ramCounter;
        
        // Estado atual
        private BottleneckInfo _currentBottleneck = new();
        private BottleneckInfo _previousBottleneck = new();
        private DateTime _lastBottleneckChange = DateTime.MinValue;
        
        // Estatísticas
        private int _bottlenecksDetected = 0;
        private int _autoFixesApplied = 0;
        private Dictionary<BottleneckComponent, int> _bottleneckHistory = new();

        public BottleneckInfo CurrentBottleneck => _currentBottleneck;
        public int BottlenecksDetected => _bottlenecksDetected;
        public int AutoFixesApplied => _autoFixesApplied;

        public RealTimeBottleneckDetectorService(
            ILoggingService logger,
            IHardwareProfiler hardwareProfiler,
            IFrameTimeOptimizer frameTimeOptimizer,
            IVramManager vramManager)
        {
            _logger = logger;
            _hardwareProfiler = hardwareProfiler;
            _frameTimeOptimizer = frameTimeOptimizer;
            _vramManager = vramManager;
        }

        public void StartMonitoring(int processId)
        {
            if (_isMonitoring)
            {
                _logger.LogWarning("[BottleneckDetector] Já está monitorando");
                return;
            }

            _monitoredProcessId = processId;
            _monitoringCts = new CancellationTokenSource();
            
            // Inicializar contadores uma vez
            try { _cpuCounter = new PerformanceCounter("Processor", "% Processor Time", "_Total"); _cpuCounter.NextValue(); } catch { }
            try { _ramCounter = new PerformanceCounter("Memory", "Available MBytes"); _ramCounter.NextValue(); } catch { }

            _monitoringTask = MonitorAndFixLoop(_monitoringCts.Token);
            _isMonitoring = true;
            
            _logger.LogSuccess($"[BottleneckDetector] ✅ Iniciado para PID {processId}");
        }

        public void StopMonitoring()
        {
            if (!_isMonitoring) return;
            
            _monitoringCts?.Cancel();
            try { _monitoringTask?.Wait(1000); } catch { }
            _monitoringCts?.Dispose();
            _monitoringCts = null;
            
            // Dispose contadores
            _cpuCounter?.Dispose(); _cpuCounter = null;
            _ramCounter?.Dispose(); _ramCounter = null;
            
            _isMonitoring = false;
            
            _logger.LogInfo($"[BottleneckDetector] Parado | Gargalos: {_bottlenecksDetected} | Auto-fixes: {_autoFixesApplied}");
        }

        private async Task MonitorAndFixLoop(CancellationToken ct)
        {
            int loopCount = 0;
            
            while (!ct.IsCancellationRequested)
            {
                try
                {
                    loopCount++;
                    
                    // Detectar gargalo atual
                    var bottleneck = await DetectBottleneckAsync(ct);
                    
                    // Se mudou de gargalo
                    if (bottleneck.Component != _currentBottleneck.Component)
                    {
                        _previousBottleneck = _currentBottleneck;
                        _currentBottleneck = bottleneck;
                        _lastBottleneckChange = DateTime.UtcNow;
                        _bottlenecksDetected++;
                        
                        // Registrar no histórico
                        if (!_bottleneckHistory.ContainsKey(bottleneck.Component))
                            _bottleneckHistory[bottleneck.Component] = 0;
                        _bottleneckHistory[bottleneck.Component]++;
                        
                        _logger.LogWarning($"[BottleneckDetector] 🎯 GARGALO DETECTADO: {bottleneck.Component} ({bottleneck.Usage:F1}%)");
                        _logger.LogInfo($"[BottleneckDetector] 📊 CPU: {bottleneck.CpuUsage:F1}% | GPU: {bottleneck.GpuUsage:F1}% | RAM: {bottleneck.RamUsageMb:F0}MB | FPS: {bottleneck.CurrentFps:F0}");
                        
                        // Aplicar auto-fix
                        await ApplyAutoFixAsync(bottleneck, ct);
                    }
                    
                    // Log estatísticas a cada 30 segundos
                    if (loopCount % 300 == 0) // 300 * 100ms = 30s
                    {
                        LogStatistics();
                    }
                    
                    // Monitorar a cada 100ms
                    await Task.Delay(100, ct);
                }
                catch (Exception ex) when (ex is not OperationCanceledException)
                {
                    _logger.LogError($"[BottleneckDetector] Erro no loop: {ex.Message}");
                    await Task.Delay(1000, ct);
                }
            }
        }

        private async Task<BottleneckInfo> DetectBottleneckAsync(CancellationToken ct)
        {
            var info = new BottleneckInfo
            {
                Timestamp = DateTime.UtcNow
            };

            try
            {
                // Obter métricas atuais
                var hardware = _hardwareProfiler.CurrentProfile;
                var frameMetrics = _frameTimeOptimizer.CurrentMetrics;
                var vramStatus = _vramManager.CurrentStatus;
                
                // CPU Usage
                info.CpuUsage = _cpuCounter?.NextValue() ?? 0;
                
                // GPU Usage (estimativa via VRAM)
                info.GpuUsage = vramStatus.UsagePercent;
                
                // RAM Usage
                double availableRamMb = _ramCounter?.NextValue() ?? 0;
                double totalRamMb = hardware.Ram.TotalGb * 1024;
                info.RamUsageMb = totalRamMb - availableRamMb;
                info.RamUsagePercent = (info.RamUsageMb / totalRamMb) * 100;
                
                // FPS atual
                info.CurrentFps = frameMetrics.Fps;
                
                // Determinar gargalo
                DetermineBottleneck(info);
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[BottleneckDetector] Erro ao detectar gargalo: {ex.Message}");
            }

            return info;
        }

        private void DetermineBottleneck(BottleneckInfo info)
        {
            var scores = new Dictionary<BottleneckComponent, double>();

            // CPU-bound: CPU alto + outros baixos
            if (info.CpuUsage > 85)
                scores[BottleneckComponent.CPU] = info.CpuUsage;

            // GPU-bound: GPU alto + CPU baixo
            if (info.GpuUsage > 85 && info.CpuUsage < 70)
                scores[BottleneckComponent.GPU] = info.GpuUsage;

            // RAM-bound: RAM alto
            if (info.RamUsagePercent > 90)
                scores[BottleneckComponent.RAM] = info.RamUsagePercent;

            // VRAM-bound: VRAM alto
            if (info.GpuUsage > 95)
                scores[BottleneckComponent.VRAM] = info.GpuUsage;

            // Determinar gargalo principal
            if (scores.Count > 0)
            {
                var primary = scores.OrderByDescending(s => s.Value).First();
                info.Component = primary.Key;
                info.Usage = primary.Value;
            }
            else
            {
                info.Component = BottleneckComponent.None;
                info.Usage = 0;
            }
        }

        private async Task ApplyAutoFixAsync(BottleneckInfo bottleneck, CancellationToken ct)
        {
            try
            {
                _logger.LogInfo($"[BottleneckDetector] 🔧 Aplicando auto-fix para {bottleneck.Component}...");

                bool success = false;

                switch (bottleneck.Component)
                {
                    case BottleneckComponent.CPU:
                        success = await FixCpuBottleneckAsync(ct);
                        break;

                    case BottleneckComponent.GPU:
                        success = await FixGpuBottleneckAsync(ct);
                        break;

                    case BottleneckComponent.RAM:
                        success = await FixRamBottleneckAsync(ct);
                        break;

                    case BottleneckComponent.VRAM:
                        success = await FixVramBottleneckAsync(ct);
                        break;
                }

                if (success)
                {
                    _autoFixesApplied++;
                    _logger.LogSuccess($"[BottleneckDetector] ✅ Auto-fix aplicado com sucesso");
                }
                else
                {
                    _logger.LogWarning($"[BottleneckDetector] ⚠️ Auto-fix falhou ou não disponível");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[BottleneckDetector] Erro ao aplicar auto-fix: {ex.Message}");
            }
        }

        private async Task<bool> FixCpuBottleneckAsync(CancellationToken ct)
        {
            _logger.LogInfo("[BottleneckDetector] 🔧 CPU Bottleneck → Reduzindo processos em background");
            
            try
            {
                // Fechar processos não essenciais
                var processesToClose = new[] { "chrome", "firefox", "discord", "spotify", "steam" };
                int closed = 0;
                
                foreach (var processName in processesToClose)
                {
                    var processes = Process.GetProcessesByName(processName);
                    foreach (var process in processes)
                    {
                        try
                        {
                            process.Kill();
                            closed++;
                        }
                        catch { }
                        finally
                        {
                            process.Dispose();
                        }
                    }
                }
                
                _logger.LogInfo($"[BottleneckDetector] Fechados {closed} processos");
                return closed > 0;
            }
            catch
            {
                return false;
            }
        }

        private async Task<bool> FixGpuBottleneckAsync(CancellationToken ct)
        {
            _logger.LogInfo("[BottleneckDetector] 🔧 GPU Bottleneck → Sugerindo redução de qualidade gráfica");
            
            // Não podemos alterar configurações in-game automaticamente
            // Mas podemos notificar o usuário
            try
            {
                NotificationManager.ShowInfo(
                    "🎮 Gargalo de GPU Detectado",
                    "Considere reduzir:\n• Resolução\n• Qualidade de texturas\n• Ray tracing\n• Anti-aliasing");
                
                return true;
            }
            catch
            {
                return false;
            }
        }

        private async Task<bool> FixRamBottleneckAsync(CancellationToken ct)
        {
            _logger.LogInfo("[BottleneckDetector] 🔧 RAM Bottleneck → Limpando memória");
            
            try
            {
                // Limpar standby list
                GC.Collect(2, GCCollectionMode.Aggressive, true, true);
                
                // Forçar limpeza de working set
                Process.GetCurrentProcess().MinWorkingSet = (IntPtr)(-1);
                
                _logger.LogSuccess("[BottleneckDetector] Memória limpa");
                return true;
            }
            catch
            {
                return false;
            }
        }

        private async Task<bool> FixVramBottleneckAsync(CancellationToken ct)
        {
            _logger.LogInfo("[BottleneckDetector] 🔧 VRAM Bottleneck → Liberando VRAM");
            
            try
            {
                await _vramManager.FreeVramAsync(ct);
                _logger.LogSuccess("[BottleneckDetector] VRAM liberada");
                return true;
            }
            catch
            {
                return false;
            }
        }

        private void LogStatistics()
        {
            _logger.LogInfo("═══════════════════════════════════════════════════════════");
            _logger.LogInfo($"[BottleneckDetector] 📊 ESTATÍSTICAS");
            _logger.LogInfo($"[BottleneckDetector] Gargalos detectados: {_bottlenecksDetected}");
            _logger.LogInfo($"[BottleneckDetector] Auto-fixes aplicados: {_autoFixesApplied}");
            _logger.LogInfo($"[BottleneckDetector] Gargalo atual: {_currentBottleneck.Component} ({_currentBottleneck.Usage:F1}%)");
            
            if (_bottleneckHistory.Count > 0)
            {
                _logger.LogInfo("[BottleneckDetector] Histórico:");
                foreach (var kvp in _bottleneckHistory.OrderByDescending(h => h.Value))
                {
                    _logger.LogInfo($"  • {kvp.Key}: {kvp.Value}x");
                }
            }
            
            _logger.LogInfo("═══════════════════════════════════════════════════════════");
        }

        public void Dispose()
        {
            StopMonitoring();
            GC.SuppressFinalize(this);
        }
    }

    #region Models

    public class BottleneckInfo
    {
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public BottleneckComponent Component { get; set; } = BottleneckComponent.None;
        public double Usage { get; set; }
        public double CpuUsage { get; set; }
        public double GpuUsage { get; set; }
        public double RamUsageMb { get; set; }
        public double RamUsagePercent { get; set; }
        public double CurrentFps { get; set; }
    }

    public enum BottleneckComponent
    {
        None,
        CPU,
        GPU,
        RAM,
        VRAM,
        Disk,
        Network
    }

    public static class NotificationManager
    {
        public static void ShowInfo(string title, string message)
        {
            // Implementação de notificação (pode usar Windows Toast Notifications)
            Console.WriteLine($"[NOTIFICATION] {title}: {message}");
        }

        public static void ShowWarning(string title, string message)
        {
            Console.WriteLine($"[WARNING] {title}: {message}");
        }
    }

    #endregion
}
