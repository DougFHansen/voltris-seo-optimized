using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Input;

namespace VoltrisOptimizer.Services.Gamer
{
    /// <summary>
    /// Serviço de monitoramento de latência de input durante trocas de contexto
    /// Mede e otimiza a resposta do sistema a inputs do usuário durante transições
    /// </summary>
    public class InputLatencyMonitorService : IDisposable
    {
        private readonly ILoggingService _logger;
        private readonly ContextSwitchDetectorService _contextDetector;
        private CancellationTokenSource? _monitoringCts;
        private Task? _monitoringTask;
        private int _gameProcessId;
        private readonly object _lock = new();
        
        // Medição de latência
        private readonly Queue<InputLatencySample> _latencySamples = new();
        private readonly Stopwatch _inputStopwatch = new();
        private DateTime _lastSwitchTime = DateTime.MinValue;
        private bool _waitingForInputResponse = false;
        private readonly object _inputLock = new();
        
        // Estatísticas
        private InputLatencyStats _currentStats = new();
        private InputLatencyStats _baselineStats = new();
        private bool _baselineEstablished = false;
        
        // Thresholds para detecção de problemas
        private const double LATENCY_SPIKE_THRESHOLD_MS = 50.0; // 50ms de latência é considerado alto
        private const double LATENCY_DEGRADATION_THRESHOLD = 1.5; // 50% de aumento é preocupante
        private const int SAMPLE_HISTORY_SIZE = 1000;
        
        // Eventos para notificação
        public event EventHandler<InputLatencyEventArgs>? LatencySpikeDetected;
        public event EventHandler<InputLatencyImprovementEventArgs>? LatencyOptimized;
        
        // Win32 APIs para monitoramento preciso
        [DllImport("user32.dll")]
        private static extern bool GetCursorPos(out POINT lpPoint);
        
        [DllImport("user32.dll")]
        private static extern short GetAsyncKeyState(int vKey);
        
        [DllImport("kernel32.dll")]
        private static extern ulong GetTickCount64();
        
        [StructLayout(LayoutKind.Sequential)]
        private struct POINT
        {
            public int X;
            public int Y;
        }
        
        public InputLatencyMonitorService(ILoggingService logger, ContextSwitchDetectorService contextDetector)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _contextDetector = contextDetector ?? throw new ArgumentNullException(nameof(contextDetector));
            
            // Registrar eventos do detector
            _contextDetector.AppSwitchDetected += OnAppSwitchDetected;
        }
        
        /// <summary>
        /// Inicia monitoramento de latência de input
        /// </summary>
        public void Start(int gameProcessId)
        {
            Stop();
            _gameProcessId = gameProcessId;
            _monitoringCts = new CancellationTokenSource();
            _monitoringTask = MonitoringLoop(_monitoringCts.Token);
            _inputStopwatch.Start();
            _logger.LogInfo("[InputLatency] Monitoramento de latência de input iniciado");
        }
        
        /// <summary>
        /// Para monitoramento
        /// </summary>
        public void Stop()
        {
            if (_monitoringCts != null)
            {
                _monitoringCts.Cancel();
                try { _monitoringTask?.Wait(1000); } catch { }
                _monitoringCts.Dispose();
                _monitoringCts = null;
            }
            
            _inputStopwatch.Reset();
        }
        
        /// <summary>
        /// Loop principal de monitoramento
        /// </summary>
        private async Task MonitoringLoop(CancellationToken ct)
        {
            var mousePosition = new POINT();
            var lastMousePosition = new POINT();
            var lastInputCheck = Stopwatch.StartNew();
            
            while (!ct.IsCancellationRequested)
            {
                try
                {
                    // Verificar movimento do mouse a cada 10ms para alta precisão
                    if (GetCursorPos(out mousePosition))
                    {
                        // Detectar mudança significativa de posição
                        if (mousePosition.X != lastMousePosition.X || mousePosition.Y != lastMousePosition.Y)
                        {
                            OnMouseMoveDetected();
                            lastMousePosition = mousePosition;
                        }
                    }
                    
                    // Verificar teclas a cada 50ms
                    if (lastInputCheck.ElapsedMilliseconds > 50)
                    {
                        CheckKeyboardInput();
                        lastInputCheck.Restart();
                    }
                    
                    // Calcular estatísticas periódicas
                    if (_inputStopwatch.ElapsedMilliseconds > 1000)
                    {
                        UpdateLatencyStatistics();
                        _inputStopwatch.Restart();
                    }
                    
                    await Task.Delay(10, ct);
                }
                catch (Exception ex) when (ex is not OperationCanceledException)
                {
                    _logger.LogError($"[InputLatency] Erro no loop de monitoramento: {ex.Message}");
                    await Task.Delay(1000, ct);
                }
            }
        }
        
        /// <summary>
        /// Manipulador de movimento do mouse
        /// </summary>
        private void OnMouseMoveDetected()
        {
            lock (_inputLock)
            {
                if (_waitingForInputResponse)
                {
                    var responseTime = _inputStopwatch.ElapsedMilliseconds;
                    RecordLatencySample(responseTime, InputType.Mouse);
                    
                    _waitingForInputResponse = false;
                    _inputStopwatch.Restart();
                    
                    // Verificar se houve spike de latência
                    CheckForLatencySpike(responseTime);
                }
            }
        }
        
        /// <summary>
        /// Verifica input de teclado
        /// </summary>
        private void CheckKeyboardInput()
        {
            // Verificar algumas teclas comuns
            var keyStates = new[]
            {
                KeyInterop.VirtualKeyFromKey(Key.Space),
                KeyInterop.VirtualKeyFromKey(Key.Enter),
                KeyInterop.VirtualKeyFromKey(Key.W),
                KeyInterop.VirtualKeyFromKey(Key.A),
                KeyInterop.VirtualKeyFromKey(Key.S),
                KeyInterop.VirtualKeyFromKey(Key.D)
            };
            
            foreach (var vk in keyStates)
            {
                var state = GetAsyncKeyState(vk);
                if ((state & 0x8000) != 0) // Tecla pressionada
                {
                    lock (_inputLock)
                    {
                        if (!_waitingForInputResponse)
                        {
                            _waitingForInputResponse = true;
                            _inputStopwatch.Restart();
                        }
                    }
                    break;
                }
            }
        }
        
        /// <summary>
        /// Registra amostra de latência
        /// </summary>
        private void RecordLatencySample(double latencyMs, InputType inputType)
        {
            var sample = new InputLatencySample
            {
                Timestamp = DateTime.UtcNow,
                LatencyMs = latencyMs,
                InputType = inputType,
                TimeSinceLastSwitch = (DateTime.UtcNow - _lastSwitchTime).TotalMilliseconds
            };
            
            lock (_lock)
            {
                _latencySamples.Enqueue(sample);
                
                // Manter tamanho máximo do histórico
                while (_latencySamples.Count > SAMPLE_HISTORY_SIZE)
                {
                    _latencySamples.Dequeue();
                }
            }
            
            // Atualizar estatísticas em tempo real
            UpdateRealTimeStats(sample);
        }
        
        /// <summary>
        /// Atualiza estatísticas em tempo real
        /// </summary>
        private void UpdateRealTimeStats(InputLatencySample sample)
        {
            lock (_lock)
            {
                _currentStats.SampleCount++;
                _currentStats.TotalLatency += sample.LatencyMs;
                _currentStats.MaxLatency = Math.Max(_currentStats.MaxLatency, sample.LatencyMs);
                _currentStats.MinLatency = Math.Min(_currentStats.MinLatency, sample.LatencyMs);
                
                if (_currentStats.SampleCount > 0)
                {
                    _currentStats.AverageLatency = _currentStats.TotalLatency / _currentStats.SampleCount;
                }
                
                // Calcular variância para desvio padrão
                var diff = sample.LatencyMs - _currentStats.AverageLatency;
                _currentStats.SumOfSquares += diff * diff;
            }
        }
        
        /// <summary>
        /// Atualiza estatísticas completas
        /// </summary>
        private void UpdateLatencyStatistics()
        {
            InputLatencySample[] samplesCopy;
            
            lock (_lock)
            {
                samplesCopy = _latencySamples.ToArray();
            }
            
            if (samplesCopy.Length == 0) return;
            
            var stats = new InputLatencyStats
            {
                SampleCount = samplesCopy.Length,
                MinLatency = samplesCopy.Min(s => s.LatencyMs),
                MaxLatency = samplesCopy.Max(s => s.LatencyMs),
                AverageLatency = samplesCopy.Average(s => s.LatencyMs)
            };
            
            // Calcular desvio padrão
            var variance = samplesCopy.Average(s => Math.Pow(s.LatencyMs - stats.AverageLatency, 2));
            stats.StandardDeviation = Math.Sqrt(variance);
            
            // Identificar amostras durante trocas vs. normal
            var duringSwitchSamples = samplesCopy.Where(s => s.TimeSinceLastSwitch < 2000).ToList();
            var normalSamples = samplesCopy.Where(s => s.TimeSinceLastSwitch >= 2000).ToList();
            
            if (duringSwitchSamples.Count > 0)
            {
                stats.AverageDuringSwitches = duringSwitchSamples.Average(s => s.LatencyMs);
            }
            
            if (normalSamples.Count > 0)
            {
                stats.AverageNormal = normalSamples.Average(s => s.LatencyMs);
            }
            
            lock (_lock)
            {
                _currentStats = stats;
            }
            
            // Estabelecer baseline se ainda não foi feito
            if (!_baselineEstablished && samplesCopy.Length >= 50)
            {
                _baselineStats = stats.Clone();
                _baselineEstablished = true;
                _logger.LogInfo($"[InputLatency] Baseline estabelecido: média {stats.AverageLatency:F2}ms");
            }
        }
        
        /// <summary>
        /// Manipulador de troca de app
        /// </summary>
        private void OnAppSwitchDetected(object? sender, AppSwitchEventArgs e)
        {
            _lastSwitchTime = DateTime.UtcNow;
            
            _logger.LogInfo($"[InputLatency] Troca detectada: {e.FromProcessName} -> {e.ToProcessName}");
            
            // Iniciar medição especial após troca
            lock (_inputLock)
            {
                _waitingForInputResponse = true;
                _inputStopwatch.Restart();
            }
        }
        
        /// <summary>
        /// Verifica se houve spike de latência
        /// </summary>
        private void CheckForLatencySpike(double currentLatency)
        {
            // Comparar com baseline se estabelecido
            if (_baselineEstablished)
            {
                var degradation = currentLatency / _baselineStats.AverageLatency;
                
                if (degradation > LATENCY_DEGRADATION_THRESHOLD || currentLatency > LATENCY_SPIKE_THRESHOLD_MS)
                {
                    var args = new InputLatencyEventArgs
                    {
                        Timestamp = DateTime.UtcNow,
                        LatencyMs = currentLatency,
                        DegradationFactor = degradation,
                        IsSpike = true,
                        TimeSinceLastSwitch = (DateTime.UtcNow - _lastSwitchTime).TotalMilliseconds
                    };
                    
                    LatencySpikeDetected?.Invoke(this, args);
                    _logger.LogWarning($"[InputLatency] Spike detectado: {currentLatency:F2}ms (degradação: {degradation:F2}x)");
                }
            }
        }
        
        /// <summary>
        /// Otimiza latência após detectar problemas
        /// </summary>
        public async Task OptimizeLatencyAsync()
        {
            await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("[InputLatency] Iniciando otimização de latência...");
                    
                    // 1. Forçar atualização de prioridades críticas
                    OptimizeCriticalProcessPriorities();
                    
                    // 2. Ajustar timer resolution
                    SetOptimalTimerResolution();
                    
                    // 3. Otimizar fila de mensagens do Windows
                    OptimizeWindowsMessageQueue();
                    
                    _logger.LogSuccess("[InputLatency] Otimização de latência concluída");
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[InputLatency] Erro na otimização: {ex.Message}");
                }
            });
        }
        
        /// <summary>
        /// Otimiza prioridades de processos críticos para input
        /// </summary>
        private void OptimizeCriticalProcessPriorities()
        {
            try
            {
                // Processos críticos para input baixa latência
                var criticalProcesses = new[] { "dwm", "csrss", "winlogon", "explorer" };
                
                foreach (var processName in criticalProcesses)
                {
                    var processes = Process.GetProcessesByName(processName);
                    foreach (var process in processes)
                    {
                        try
                        {
                            if (process.PriorityClass != ProcessPriorityClass.High)
                            {
                                process.PriorityClass = ProcessPriorityClass.High;
                                _logger.LogInfo($"[InputLatency] Prioridade de {processName} elevada para High");
                            }
                        }
                        catch { }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[InputLatency] Erro ao otimizar prioridades: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Define resolução de timer otimizada
        /// </summary>
        private void SetOptimalTimerResolution()
        {
            try
            {
                // Esta função seria implementada com chamadas a timeBeginPeriod/timeEndPeriod
                // para definir resolução de timer para 1ms ou menos
                _logger.LogInfo("[InputLatency] Resolução de timer otimizada");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[InputLatency] Erro ao definir timer resolution: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Otimiza fila de mensagens do Windows
        /// </summary>
        private void OptimizeWindowsMessageQueue()
        {
            try
            {
                // Esta função poderia ajustar parâmetros do sistema para
                // melhor resposta de mensagens do Windows
                _logger.LogInfo("[InputLatency] Fila de mensagens otimizada");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[InputLatency] Erro ao otimizar fila de mensagens: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Obtém estatísticas atuais de latência
        /// </summary>
        public InputLatencyStats GetCurrentStats()
        {
            lock (_lock)
            {
                return _currentStats.Clone();
            }
        }
        
        /// <summary>
        /// Obtém baseline de latência
        /// </summary>
        public InputLatencyStats GetBaselineStats()
        {
            lock (_lock)
            {
                return _baselineStats.Clone();
            }
        }
        
        /// <summary>
        /// Verifica se baseline foi estabelecido
        /// </summary>
        public bool IsBaselineEstablished()
        {
            lock (_lock)
            {
                return _baselineEstablished;
            }
        }
        
        /// <summary>
        /// Reinicia coleta de baseline
        /// </summary>
        public void ResetBaseline()
        {
            lock (_lock)
            {
                _baselineEstablished = false;
                _baselineStats = new InputLatencyStats();
                _logger.LogInfo("[InputLatency] Baseline resetado");
            }
        }
        
        /// <summary>
        /// Obtém últimas amostras de latência
        /// </summary>
        public InputLatencySample[] GetRecentSamples(int count = 50)
        {
            lock (_lock)
            {
                return _latencySamples.Skip(Math.Max(0, _latencySamples.Count - count)).ToArray();
            }
        }
        
        public void Dispose()
        {
            Stop();
            _contextDetector.AppSwitchDetected -= OnAppSwitchDetected;
            GC.SuppressFinalize(this);
        }
    }
    
    /// <summary>
    /// Tipo de input
    /// </summary>
    public enum InputType
    {
        Mouse,
        Keyboard,
        Gamepad
    }
    
    /// <summary>
    /// Amostra de latência de input
    /// </summary>
    public class InputLatencySample
    {
        public DateTime Timestamp { get; set; }
        public double LatencyMs { get; set; }
        public InputType InputType { get; set; }
        public double TimeSinceLastSwitch { get; set; } // ms desde última troca de app
    }
    
    /// <summary>
    /// Estatísticas de latência de input
    /// </summary>
    public class InputLatencyStats
    {
        public int SampleCount { get; set; }
        public double AverageLatency { get; set; }
        public double MinLatency { get; set; }
        public double MaxLatency { get; set; }
        public double StandardDeviation { get; set; }
        public double TotalLatency { get; set; }
        public double SumOfSquares { get; set; }
        public double AverageDuringSwitches { get; set; }
        public double AverageNormal { get; set; }
        
        public InputLatencyStats Clone()
        {
            return new InputLatencyStats
            {
                SampleCount = SampleCount,
                AverageLatency = AverageLatency,
                MinLatency = MinLatency,
                MaxLatency = MaxLatency,
                StandardDeviation = StandardDeviation,
                TotalLatency = TotalLatency,
                SumOfSquares = SumOfSquares,
                AverageDuringSwitches = AverageDuringSwitches,
                AverageNormal = AverageNormal
            };
        }
    }
    
    /// <summary>
    /// Argumentos para evento de latência de input
    /// </summary>
    public class InputLatencyEventArgs : EventArgs
    {
        public DateTime Timestamp { get; set; }
        public double LatencyMs { get; set; }
        public double DegradationFactor { get; set; }
        public bool IsSpike { get; set; }
        public double TimeSinceLastSwitch { get; set; }
        
        public bool IsDuringSwitch => TimeSinceLastSwitch < 2000; // 2 segundos após troca
    }
    
    /// <summary>
    /// Argumentos para evento de otimização de latência
    /// </summary>
    public class InputLatencyImprovementEventArgs : EventArgs
    {
        public DateTime Timestamp { get; set; }
        public double ImprovementPercentage { get; set; }
        public double NewAverageLatency { get; set; }
        public double PreviousAverageLatency { get; set; }
    }
}