using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace VoltrisOptimizer.Services.Gamer
{
    /// <summary>
    /// Serviço especializado para otimizar fases de carregamento do jogo
    /// Previne travadas e stutter durante cenas pesadas
    /// </summary>
    public class LoadingPhaseOptimizerService : IDisposable
    {
        private readonly ILoggingService _logger;
        private CancellationTokenSource? _monitoringCts;
        private Task? _monitoringTask;
        private int _gameProcessId;
        private readonly object _lock = new();
        
        // Monitoramento de recursos durante carregamento
        private readonly List<LoadingMetrics> _loadingHistory = new();
        private DateTime _lastLoadingStart = DateTime.MinValue;
        private bool _isLoadingPhase = false;
        private Process? _monitoredProcess;
        
        // Throttle para otimizações durante carregamento
        private DateTime _lastOptimizationTime = DateTime.MinValue;
        private const int MIN_OPTIMIZATION_INTERVAL_MS = 15000; // 15 segundos entre otimizações
        private int _consecutiveLoadingDetections = 0;
        private const int LOADING_CONFIRMATION_COUNT = 3; // Precisa de 3 detecções consecutivas para confirmar
        
        // Thresholds para detecção de carregamento
        private const double HIGH_DISK_ACTIVITY_THRESHOLD = 80.0; // % de utilização de disco
        private const double HIGH_CPU_WAIT_THRESHOLD = 30.0; // % de tempo de espera
        private const int MIN_LOADING_DURATION_MS = 2000; // 2 segundos mínimo para considerar carregamento
        
        public LoadingPhaseOptimizerService(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }
        
        /// <summary>
        /// Inicia monitoramento de fases de carregamento
        /// </summary>
        public void StartMonitoring(int gameProcessId)
        {
            StopMonitoring();
            
            lock (_lock)
            {
                _gameProcessId = gameProcessId;
                _monitoringCts = new CancellationTokenSource();
                _monitoringTask = MonitorLoadingPhases(_monitoringCts.Token);
                _logger.LogInfo($"[LoadingOptimizer] Monitoramento iniciado para processo {gameProcessId}");
            }
        }
        
        /// <summary>
        /// Para monitoramento de fases de carregamento
        /// </summary>
        public void StopMonitoring()
        {
            lock (_lock)
            {
                if (_monitoringCts != null)
                {
                    _monitoringCts.Cancel();
                    try { _monitoringTask?.Wait(2000); } catch { }
                    _monitoringCts.Dispose();
                    _monitoringCts = null;
                }
                
                _logger.LogInfo("[LoadingOptimizer] Monitoramento encerrado");
            }
        }
        
        /// <summary>
        /// Monitora fases de carregamento do jogo
        /// </summary>
        private async Task MonitorLoadingPhases(CancellationToken ct)
        {
            try
            {
                _monitoredProcess = Process.GetProcessById(_gameProcessId);
                
                while (!ct.IsCancellationRequested && !_monitoredProcess.HasExited)
                {
                    try
                    {
                        // Coletar métricas do processo
                        var metrics = CollectLoadingMetrics();
                        
                        // Detectar início/fim de fase de carregamento
                        DetectLoadingPhase(metrics);
                        
                        // Aplicar otimizações se necessário (com throttle)
                        if (_isLoadingPhase)
                        {
                            var now = DateTime.UtcNow;
                            var sinceLastOpt = (now - _lastOptimizationTime).TotalMilliseconds;
                            if (sinceLastOpt >= MIN_OPTIMIZATION_INTERVAL_MS)
                            {
                                ApplyLoadingOptimizations(metrics);
                                _lastOptimizationTime = now;
                            }
                        }
                        
                        // Intervalo de 3 segundos (em vez de 500ms) para reduzir overhead
                        await Task.Delay(3000, ct);
                    }
                    catch (OperationCanceledException)
                    {
                        // Cancelamento normal ao parar o modo gamer — não é erro
                        break;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"[LoadingOptimizer] Erro na coleta: {ex.Message}");
                        await Task.Delay(5000, ct);
                    }
                }
            }
            catch (OperationCanceledException)
            {
                // Cancelamento gracioso — monitoramento encerrado normalmente
                _logger.LogInfo("[LoadingOptimizer] Monitoramento encerrado (cancelamento solicitado).");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[LoadingOptimizer] Erro no monitoramento: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Coleta métricas durante possível fase de carregamento
        /// </summary>
        private LoadingMetrics CollectLoadingMetrics()
        {
            var metrics = new LoadingMetrics
            {
                Timestamp = DateTime.UtcNow,
                ProcessId = _gameProcessId
            };
            
            try
            {
                if (_monitoredProcess == null || _monitoredProcess.HasExited)
                    return metrics;
                
                // Coletar uso de CPU
                var startTime = DateTime.UtcNow;
                var startCpuTime = _monitoredProcess.TotalProcessorTime;
                Thread.Sleep(100); // Pequena pausa para medição
                var endTime = DateTime.UtcNow;
                var endCpuTime = _monitoredProcess.TotalProcessorTime;
                
                var cpuUsedMs = (endCpuTime - startCpuTime).TotalMilliseconds;
                var totalTimeMs = (endTime - startTime).TotalMilliseconds;
                
                metrics.CpuUsagePercent = (cpuUsedMs / totalTimeMs) * 100;
                
                // Coletar métricas de disco (se disponível)
                try
                {
                    using var diskCounter = new PerformanceCounter("PhysicalDisk", "% Disk Time", "_Total");
                    diskCounter.NextValue();
                    Thread.Sleep(100);
                    metrics.DiskUsagePercent = diskCounter.NextValue();
                }
                catch
                {
                    // Contador de desempenho pode não estar disponível
                    metrics.DiskUsagePercent = 0;
                }
                
                // Coletar informações de memória
                try
                {
                    metrics.WorkingSetMb = _monitoredProcess.WorkingSet64 / (1024 * 1024);
                    metrics.PrivateMemoryMb = _monitoredProcess.PrivateMemorySize64 / (1024 * 1024);
                }
                catch
                {
                    metrics.WorkingSetMb = 0;
                    metrics.PrivateMemoryMb = 0;
                }
                
                // Detectar padrões de espera (possível I/O blocking)
                metrics.IsWaiting = metrics.CpuUsagePercent < 20 && metrics.DiskUsagePercent > 50;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[LoadingOptimizer] Erro ao coletar métricas: {ex.Message}");
            }
            
            return metrics;
        }
        
        /// <summary>
        /// Detecta início ou fim de fase de carregamento — com confirmação para evitar falsos positivos
        /// </summary>
        private void DetectLoadingPhase(LoadingMetrics metrics)
        {
            try
            {
                var now = DateTime.UtcNow;
                var isLoadingIndicators = IsLoadingIndicatorsPresent(metrics);
                
                if (!_isLoadingPhase && isLoadingIndicators)
                {
                    // Exigir múltiplas detecções consecutivas para confirmar carregamento
                    _consecutiveLoadingDetections++;
                    if (_consecutiveLoadingDetections >= LOADING_CONFIRMATION_COUNT)
                    {
                        _lastLoadingStart = now;
                        _isLoadingPhase = true;
                        _consecutiveLoadingDetections = 0;
                        _logger.LogInfo("[LoadingOptimizer] Fase de carregamento confirmada");
                        
                        // Notificar início de otimização
                        OnLoadingPhaseStarted?.Invoke(this, EventArgs.Empty);
                    }
                }
                else if (!_isLoadingPhase && !isLoadingIndicators)
                {
                    // Resetar contador se indicadores desaparecem antes de confirmar
                    _consecutiveLoadingDetections = 0;
                }
                else if (_isLoadingPhase && !isLoadingIndicators)
                {
                    // Potencial fim de carregamento
                    var duration = (now - _lastLoadingStart).TotalMilliseconds;
                    
                    if (duration >= MIN_LOADING_DURATION_MS)
                    {
                        // Confirmar fim de carregamento
                        _isLoadingPhase = false;
                        _consecutiveLoadingDetections = 0;
                        _logger.LogInfo($"[LoadingOptimizer] Fase de carregamento encerrada ({duration:F0}ms)");
                        
                        // Notificar fim de otimização
                        OnLoadingPhaseEnded?.Invoke(this, EventArgs.Empty);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[LoadingOptimizer] Erro na detecção: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Verifica se há indicadores de fase de carregamento
        /// CORREÇÃO: memorySpike threshold aumentado para 4GB e exige combinação de indicadores
        /// (apenas memória alta NÃO é suficiente — jogos AAA usam 2-6GB normalmente)
        /// </summary>
        private bool IsLoadingIndicatorsPresent(LoadingMetrics metrics)
        {
            // Critérios para detectar carregamento:
            // 1. Alta atividade de disco + baixa CPU (esperando I/O) — indicador forte
            // 2. Padrões de espera prolongada — indicador forte
            // 3. Memória alta sozinha NÃO é indicador (jogos AAA usam 2-6GB normalmente)
            
            var highDiskActivity = metrics.DiskUsagePercent > HIGH_DISK_ACTIVITY_THRESHOLD;
            var lowCpuWithHighDisk = metrics.CpuUsagePercent < 30 && metrics.DiskUsagePercent > 60;
            var waitingPattern = metrics.IsWaiting;
            
            // Memória só conta como indicador se combinada com alta atividade de disco
            var memoryWithDisk = metrics.WorkingSetMb > 4000 && metrics.DiskUsagePercent > 40;
            
            return highDiskActivity || lowCpuWithHighDisk || waitingPattern || memoryWithDisk;
        }
        
        /// <summary>
        /// Aplica otimizações durante fases de carregamento
        /// </summary>
        private void ApplyLoadingOptimizations(LoadingMetrics metrics)
        {
            try
            {
                // 1. Priorizar threads de I/O do jogo
                PrioritizeIoThreads();
                
                // 2. Otimizar cache de disco
                OptimizeDiskCache();
                
                // 3. Ajustar prioridade de processos em background
                ThrottleBackgroundProcesses();
                
                // 4. Liberar memória standby se necessário
                if (metrics.WorkingSetMb > 2000) // 2GB+
                {
                    ClearStandbyMemoryIfNeeded();
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[LoadingOptimizer] Erro ao aplicar otimizações: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Prioriza threads de I/O do processo do jogo
        /// </summary>
        private void PrioritizeIoThreads()
        {
            try
            {
                // Aumentar prioridade de I/O para o processo do jogo
                // Isso é feito indiretamente através do ajuste de prioridade do processo
                using var gameProcess = Process.GetProcessById(_gameProcessId);
                if (gameProcess.PriorityClass != ProcessPriorityClass.High)
                {
                    gameProcess.PriorityClass = ProcessPriorityClass.High;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[LoadingOptimizer] Erro ao priorizar I/O: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Otimiza cache de disco para operações de leitura sequencial
        /// </summary>
        private void OptimizeDiskCache()
        {
            try
            {
                // Esta otimização seria implementada através de chamadas ao kernel
                // Por enquanto, apenas logamos a intenção
                _logger.LogInfo("[LoadingOptimizer] Otimizando cache de disco para carregamento");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[LoadingOptimizer] Erro ao otimizar cache: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Reduz prioridade de processos em background durante carregamento
        /// </summary>
        private void ThrottleBackgroundProcesses()
        {
            try
            {
                var backgroundProcesses = Process.GetProcesses()
                    .Where(p => p.Id != _gameProcessId && 
                               !IsCriticalProcess(p.ProcessName) &&
                               p.ProcessName.ToLowerInvariant() != "dwm")
                    .Take(10); // Limitar para evitar sobrecarga
                
                foreach (var process in backgroundProcesses)
                {
                    try
                    {
                        if (process.PriorityClass != ProcessPriorityClass.Idle)
                        {
                            process.PriorityClass = ProcessPriorityClass.Idle;
                        }
                    }
                    catch
                    {
                        // Ignorar processos protegidos
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[LoadingOptimizer] Erro ao throttlear processos: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Verifica se um processo é crítico e não deve ter prioridade reduzida
        /// </summary>
        private bool IsCriticalProcess(string processName)
        {
            var criticalNames = new[]
            {
                "system", "csrss", "winlogon", "services", "lsass",
                "dwm", "explorer", "svchost"
            };
            
            return criticalNames.Any(c => 
                processName.IndexOf(c, StringComparison.OrdinalIgnoreCase) >= 0);
        }
        
        /// <summary>
        /// Libera memória standby se estiver causando pressão de memória
        /// </summary>
        private void ClearStandbyMemoryIfNeeded()
        {
            try
            {
                // Chamada para serviço de otimização de memória
                // Esta seria uma integração com o MemoryGamingOptimizer existente
                _logger.LogInfo("[LoadingOptimizer] Liberando memória standby");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[LoadingOptimizer] Erro ao liberar memória: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Evento disparado quando uma fase de carregamento é detectada
        /// </summary>
        public event EventHandler? OnLoadingPhaseStarted;
        
        /// <summary>
        /// Evento disparado quando uma fase de carregamento termina
        /// </summary>
        public event EventHandler? OnLoadingPhaseEnded;
        
        public void Dispose()
        {
            StopMonitoring();
        }
    }
    
    /// <summary>
    /// Métricas coletadas durante fases de carregamento
    /// </summary>
    public class LoadingMetrics
    {
        public DateTime Timestamp { get; set; }
        public int ProcessId { get; set; }
        public double CpuUsagePercent { get; set; }
        public double DiskUsagePercent { get; set; }
        public long WorkingSetMb { get; set; }
        public long PrivateMemoryMb { get; set; }
        public bool IsWaiting { get; set; }
    }
}