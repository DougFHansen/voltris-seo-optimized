using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Interop;

namespace VoltrisOptimizer.Services.Gamer
{
    /// <summary>
    /// Serviço especializado para detectar trocas de contexto entre aplicativos (app switching)
    /// Especificamente projetado para identificar quando usuário alterna entre jogo e outros apps
    /// </summary>
    public class ContextSwitchDetectorService : IDisposable
    {
        private readonly ILoggingService _logger;
        private CancellationTokenSource? _monitoringCts;
        private Task? _monitoringTask;
        private int _gameProcessId;
        private readonly Dictionary<int, string> _processNames = new();
        private readonly object _lock = new();
        
        // Últimos processos em foco
        private int _lastForegroundProcessId;
        private int _currentForegroundProcessId;
        
        // Temporizadores para detecção precisa
        private readonly Stopwatch _focusTimer = new();
        private DateTime _lastSwitchTime = DateTime.MinValue;
        
        // Eventos para notificação
        public event EventHandler<AppSwitchEventArgs>? AppSwitchDetected;
        public event EventHandler<SwitchPatternEventArgs>? SwitchPatternIdentified;
        
        // Importações Win32 para monitoramento de foco
        [DllImport("user32.dll")]
        private static extern IntPtr GetForegroundWindow();
        
        [DllImport("user32.dll")]
        private static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);
        
        [DllImport("kernel32.dll")]
        private static extern IntPtr OpenProcess(uint processAccess, bool bInheritHandle, int processId);
        
        [DllImport("kernel32.dll")]
        private static extern bool CloseHandle(IntPtr handle);
        
        [DllImport("psapi.dll")]
        private static extern bool EnumProcesses(int[] processIds, int size, out int bytesReturned);
        
        private const uint PROCESS_QUERY_INFORMATION = 0x0400;
        private const uint PROCESS_VM_READ = 0x0010;
        
        public ContextSwitchDetectorService(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }
        
        /// <summary>
        /// Inicia monitoramento de trocas de contexto
        /// </summary>
        public void StartMonitoring(int gameProcessId)
        {
            StopMonitoring();
            _gameProcessId = gameProcessId;
            _monitoringCts = new CancellationTokenSource();
            _monitoringTask = MonitorContextSwitches(_monitoringCts.Token);
            _focusTimer.Start();
            _logger.LogInfo($"[ContextSwitch] Monitoramento iniciado para processo {gameProcessId}");
        }
        
        /// <summary>
        /// Para monitoramento
        /// </summary>
        public void StopMonitoring()
        {
            if (_monitoringCts != null)
            {
                _monitoringCts.Cancel();
                try { _monitoringTask?.Wait(1000); } catch { }
                _monitoringCts.Dispose();
                _monitoringCts = null;
            }
            _focusTimer.Reset();
        }
        
        /// <summary>
        /// Loop principal de monitoramento
        /// </summary>
        private async Task MonitorContextSwitches(CancellationToken ct)
        {
            IntPtr lastHwnd = IntPtr.Zero;
            var switchHistory = new Queue<DateTime>();
            const int HISTORY_WINDOW_SECONDS = 10;
            
            while (!ct.IsCancellationRequested)
            {
                try
                {
                    var hwnd = GetForegroundWindow();
                    if (hwnd != IntPtr.Zero && hwnd != lastHwnd)
                    {
                        lastHwnd = hwnd;
                        
                        if (GetWindowThreadProcessId(hwnd, out uint processId) > 0)
                        {
                            var processIdInt = (int)processId;
                            _currentForegroundProcessId = processIdInt;
                            
                            // Atualizar nome do processo se necessário
                            if (!_processNames.ContainsKey(processIdInt))
                            {
                                var processName = GetProcessName(processIdInt);
                                lock (_lock)
                                {
                                    _processNames[processIdInt] = processName;
                                }
                            }
                            
                            // Registrar troca de contexto
                            var currentTime = DateTime.UtcNow;
                            switchHistory.Enqueue(currentTime);
                            
                            // Remover entradas antigas
                            while (switchHistory.Count > 0 && 
                                   (currentTime - switchHistory.Peek()).TotalSeconds > HISTORY_WINDOW_SECONDS)
                            {
                                switchHistory.Dequeue();
                            }
                            
                            // Detectar padrões
                            var isGameFocus = processIdInt == _gameProcessId;
                            var wasGameFocus = _lastForegroundProcessId == _gameProcessId;
                            
                            // Notificar troca significativa
                            if (isGameFocus != wasGameFocus)
                            {
                                var switchType = isGameFocus ? SwitchType.ToGame : SwitchType.FromGame;
                                var args = new AppSwitchEventArgs
                                {
                                    Timestamp = currentTime,
                                    FromProcessId = _lastForegroundProcessId,
                                    ToProcessId = processIdInt,
                                    FromProcessName = GetCachedProcessName(_lastForegroundProcessId),
                                    ToProcessName = GetCachedProcessName(processIdInt),
                                    SwitchType = switchType,
                                    SwitchFrequency = switchHistory.Count / (double)HISTORY_WINDOW_SECONDS
                                };
                                
                                AppSwitchDetected?.Invoke(this, args);
                                _logger.LogInfo($"[ContextSwitch] Troca detectada: {args.FromProcessName} -> {args.ToProcessName} ({switchType})");
                                
                                // Verificar padrões de uso
                                if (switchHistory.Count >= 3)
                                {
                                    AnalyzeSwitchPatterns(switchHistory);
                                }
                            }
                            
                            _lastSwitchTime = currentTime;
                            _lastForegroundProcessId = processIdInt;
                        }
                    }
                    
                    // Pequeno delay para não sobrecarregar CPU
                    await Task.Delay(100, ct);
                }
                catch (Exception ex) when (ex is not OperationCanceledException)
                {
                    _logger.LogError($"[ContextSwitch] Erro no monitoramento: {ex.Message}");
                    await Task.Delay(1000, ct);
                }
            }
        }
        
        /// <summary>
        /// Analisa padrões de troca para otimização proativa
        /// </summary>
        private void AnalyzeSwitchPatterns(Queue<DateTime> switchHistory)
        {
            var now = DateTime.UtcNow;
            var recentSwitches = switchHistory.Where(t => (now - t).TotalSeconds <= 30).Count();
            
            // Detectar padrão de uso intensivo
            if (recentSwitches >= 5)
            {
                var patternArgs = new SwitchPatternEventArgs
                {
                    PatternType = SwitchPattern.HighFrequency,
                    DetectedAt = now,
                    SwitchesPerMinute = recentSwitches * 2 // Projeção para 1 minuto
                };
                
                SwitchPatternIdentified?.Invoke(this, patternArgs);
                _logger.LogInfo($"[ContextSwitch] Padrão de alta frequência detectado: {recentSwitches} trocas em 30s");
            }
        }
        
        /// <summary>
        /// Obtém nome do processo com cache
        /// </summary>
        private string GetCachedProcessName(int processId)
        {
            lock (_lock)
            {
                return _processNames.TryGetValue(processId, out var name) ? name : $"Process_{processId}";
            }
        }
        
        /// <summary>
        /// Obtém nome do processo via Win32 API
        /// </summary>
        private string GetProcessName(int processId)
        {
            try
            {
                var handle = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, false, processId);
                if (handle != IntPtr.Zero)
                {
                    try
                    {
                        var process = Process.GetProcessById(processId);
                        return process.ProcessName;
                    }
                    catch
                    {
                        return $"Process_{processId}";
                    }
                    finally
                    {
                        CloseHandle(handle);
                    }
                }
            }
            catch { }
            
            return $"Process_{processId}";
        }
        
        /// <summary>
        /// Verifica se determinado processo está em foco
        /// </summary>
        public bool IsProcessInFocus(int processId)
        {
            return _currentForegroundProcessId == processId;
        }
        
        /// <summary>
        /// Obtém informações sobre o último evento de troca
        /// </summary>
        public AppSwitchEventArgs? GetLastSwitchInfo()
        {
            // Esta informação seria preenchida pelos eventos
            return null;
        }
        
        public void Dispose()
        {
            StopMonitoring();
            GC.SuppressFinalize(this);
        }
    }
    
    /// <summary>
    /// Argumentos para evento de troca de app
    /// </summary>
    public class AppSwitchEventArgs : EventArgs
    {
        public DateTime Timestamp { get; set; }
        public int FromProcessId { get; set; }
        public int ToProcessId { get; set; }
        public string FromProcessName { get; set; } = "";
        public string ToProcessName { get; set; } = "";
        public SwitchType SwitchType { get; set; }
        public double SwitchFrequency { get; set; } // Trocas por segundo
        public bool IsCriticalSwitch => SwitchType == SwitchType.ToGame || SwitchType == SwitchType.FromGame;
    }
    
    /// <summary>
    /// Tipos de troca de contexto
    /// </summary>
    public enum SwitchType
    {
        Unknown,
        ToGame,        // De qualquer app para o jogo
        FromGame,      // Do jogo para qualquer app
        BetweenApps,   // Entre apps diferentes (sem envolver o jogo)
        SystemDialog   // Para/da caixas de diálogo do sistema
    }
    
    /// <summary>
    /// Argumentos para evento de padrão de troca
    /// </summary>
    public class SwitchPatternEventArgs : EventArgs
    {
        public SwitchPattern PatternType { get; set; }
        public DateTime DetectedAt { get; set; }
        public double SwitchesPerMinute { get; set; }
        public string[]? CommonSwitchTargets { get; set; }
    }
    
    /// <summary>
    /// Padrões de troca identificados
    /// </summary>
    public enum SwitchPattern
    {
        None,
        HighFrequency,     // Muitas trocas em curto período
        RegularInterval,   // Trocas em intervalos regulares
        BrowserHeavy,      // Muito envolvimento com navegadores
        Multitasking       // Uso intenso de multitarefa
    }
}