using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services;
using GameDetectedEventArgs = VoltrisOptimizer.Services.GameDetectedEventArgs;
using GameStoppedEventArgs = VoltrisOptimizer.Services.GameStoppedEventArgs;

namespace VoltrisOptimizer.Core.Intelligence
{
    /// <summary>
    /// Otimizador de performance para modo gamer
    /// Detecta quando jogo está rodando e otimiza todos os serviços para reduzir overhead
    /// OBJETIVO: Melhorar FPS, não piorar
    /// </summary>
    public class GameModePerformanceOptimizer : IDisposable
    {
        private readonly ILoggingService _logger;
        private readonly GameDetectionService _gameDetection;
        private Timer? _optimizationTimer;
        private bool _isGameRunning = false;
        private Process? _currentGameProcess;
        private readonly object _lock = new();
        
        // Cache de processos para evitar Process.GetProcesses() repetido
        private Dictionary<int, CachedProcessInfo> _processCache = new();
        private DateTime _lastProcessCacheUpdate = DateTime.MinValue;
        private readonly TimeSpan _processCacheTTL = TimeSpan.FromSeconds(5);
        
        // Configurações de performance
        private bool _performanceModeActive = false;
        private readonly List<IDisposable> _optimizedServices = new();

        public GameModePerformanceOptimizer(ILoggingService logger, GameDetectionService gameDetection)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _gameDetection = gameDetection ?? throw new ArgumentNullException(nameof(gameDetection));
            
            // Subscrever eventos de jogo
            _gameDetection.OnGameStarted += OnGameStarted;
            _gameDetection.OnGameStopped += OnGameStopped;
        }

        /// <summary>
        /// Inicia o otimizador de performance
        /// </summary>
        public void Start()
        {
            _optimizationTimer = new Timer(OptimizePerformance, null, TimeSpan.Zero, TimeSpan.FromSeconds(2));
            _logger.LogInfo("[GamePerf] Otimizador de performance iniciado");
        }

        /// <summary>
        /// Para o otimizador
        /// </summary>
        public void Stop()
        {
            _optimizationTimer?.Dispose();
            _optimizationTimer = null;
            
            // Restaurar configurações normais
            if (_performanceModeActive)
            {
                DisablePerformanceMode();
            }
        }

        /// <summary>
        /// Callback do timer - otimiza performance continuamente
        /// </summary>
        private void OptimizePerformance(object? state)
        {
            try
            {
                lock (_lock)
                {
                    // Verificar se jogo está rodando
                    var gameRunning = CheckIfGameRunning();
                    
                    if (gameRunning && !_performanceModeActive)
                    {
                        EnablePerformanceMode();
                    }
                    else if (!gameRunning && _performanceModeActive)
                    {
                        DisablePerformanceMode();
                    }
                    
                    // Se jogo está rodando, aplicar otimizações contínuas
                    if (_performanceModeActive && _currentGameProcess != null)
                    {
                        ApplyContinuousOptimizations();
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[GamePerf] Erro na otimização: {ex.Message}");
            }
        }

        /// <summary>
        /// Verifica se há jogo rodando (otimizado)
        /// </summary>
        private bool CheckIfGameRunning()
        {
            try
            {
                // Usar cache em vez de Process.GetProcesses() sempre
                if (_currentGameProcess != null)
                {
                    try
                    {
                        _currentGameProcess.Refresh();
                        if (!_currentGameProcess.HasExited)
                        {
                            return true;
                        }
                    }
                    catch
                    {
                        _currentGameProcess = null;
                    }
                }
                
                return false;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Ativa modo de performance (quando jogo detectado)
        /// </summary>
        private void EnablePerformanceMode()
        {
            if (_performanceModeActive) return;
            
            _logger.LogInfo("[GamePerf] ⚡ MODO DE PERFORMANCE ATIVADO - Reduzindo overhead");
            
            _performanceModeActive = true;
            
            // 1. Aumentar prioridade do processo do jogo
            if (_currentGameProcess != null)
            {
                try
                {
                    if (_currentGameProcess.PriorityClass != ProcessPriorityClass.High &&
                        _currentGameProcess.PriorityClass != ProcessPriorityClass.RealTime)
                    {
                        _currentGameProcess.PriorityClass = ProcessPriorityClass.High;
                        _logger.LogInfo("[GamePerf] Prioridade do jogo elevada para High");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[GamePerf] Erro ao elevar prioridade: {ex.Message}");
                }
            }
            
            // 2. Reduzir prioridade do próprio Voltris Optimizer
            try
            {
                var selfProcess = Process.GetCurrentProcess();
                if (selfProcess.PriorityClass != ProcessPriorityClass.BelowNormal)
                {
                    selfProcess.PriorityClass = ProcessPriorityClass.BelowNormal;
                    _logger.LogInfo("[GamePerf] Prioridade do Voltris Optimizer reduzida para BelowNormal");
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[GamePerf] Erro ao reduzir prioridade própria: {ex.Message}");
            }
            
            // 3. Forçar garbage collection para liberar memória
            GC.Collect(GC.MaxGeneration, GCCollectionMode.Optimized);
            GC.WaitForPendingFinalizers();
            _logger.LogInfo("[GamePerf] Garbage collection executado");
            
            // 4. Otimizar threads do próprio processo
            try
            {
                var selfProcess = Process.GetCurrentProcess();
                foreach (ProcessThread thread in selfProcess.Threads)
                {
                    try
                    {
                        // Reduzir prioridade de threads não críticas
                        if (thread.PriorityLevel != ThreadPriorityLevel.Lowest)
                        {
                            thread.PriorityLevel = ThreadPriorityLevel.Lowest;
                        }
                    }
                    catch { }
                }
                _logger.LogInfo("[GamePerf] Threads do Voltris Optimizer otimizadas");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[GamePerf] Erro ao otimizar threads: {ex.Message}");
            }
        }

        /// <summary>
        /// Desativa modo de performance (quando jogo encerrado)
        /// </summary>
        private void DisablePerformanceMode()
        {
            if (!_performanceModeActive) return;
            
            _logger.LogInfo("[GamePerf] 🔄 MODO DE PERFORMANCE DESATIVADO - Restaurando configurações");
            
            _performanceModeActive = false;
            
            // Restaurar prioridade do próprio processo
            try
            {
                var selfProcess = Process.GetCurrentProcess();
                if (selfProcess.PriorityClass == ProcessPriorityClass.BelowNormal)
                {
                    selfProcess.PriorityClass = ProcessPriorityClass.Normal;
                    _logger.LogInfo("[GamePerf] Prioridade do Voltris Optimizer restaurada para Normal");
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[GamePerf] Erro ao restaurar prioridade: {ex.Message}");
            }
        }

        /// <summary>
        /// Aplica otimizações contínuas durante o jogo
        /// </summary>
        private void ApplyContinuousOptimizations()
        {
            try
            {
                // 1. Monitorar FPS do jogo (heurística)
                var frameTime = EstimateFrameTime();
                
                // 2. Se FPS está baixo, aplicar otimizações mais agressivas
                if (frameTime > 33.3) // < 30 FPS
                {
                    _logger.LogWarning($"[GamePerf] ⚠️ FPS baixo detectado ({1000/frameTime:F0} FPS) - Aplicando otimizações agressivas");
                    
                    // Limpar cache de processos para liberar memória
                    if (_processCache.Count > 100)
                    {
                        _processCache.Clear();
                        _logger.LogInfo("[GamePerf] Cache de processos limpo");
                    }
                    
                    // Forçar GC se necessário
                    if (GC.GetTotalMemory(false) > 100 * 1024 * 1024) // > 100MB
                    {
                        GC.Collect(GC.MaxGeneration, GCCollectionMode.Optimized);
                        _logger.LogInfo("[GamePerf] Garbage collection forçado");
                    }
                }
                
                // 3. Atualizar cache de processos (menos frequente)
                if (DateTime.Now - _lastProcessCacheUpdate > _processCacheTTL)
                {
                    UpdateProcessCache();
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[GamePerf] Erro em otimizações contínuas: {ex.Message}");
            }
        }

        /// <summary>
        /// Estima frame time do jogo (heurística)
        /// </summary>
        private double EstimateFrameTime()
        {
            if (_currentGameProcess == null) return 16.67; // Assume 60 FPS
            
            try
            {
                _currentGameProcess.Refresh();
                
                // Heurística: se CPU usage está muito alto, FPS provavelmente está baixo
                // CORREÇÃO: Reduzir tempo de bloqueio
                var cpuTime = _currentGameProcess.TotalProcessorTime;
                Thread.Sleep(25); // Reduzido para 25ms (mínimo necessário)
                var cpuTime2 = _currentGameProcess.TotalProcessorTime;
                
                var cpuDelta = (cpuTime2 - cpuTime).TotalMilliseconds;
                var cores = Environment.ProcessorCount;
                var cpuPercent = (cpuDelta / (50.0 * cores)) * 100;
                
                // Se CPU está saturado (>90%), assumir FPS baixo
                if (cpuPercent > 90)
                {
                    return 50.0; // ~20 FPS
                }
                
                // Caso contrário, assumir FPS normal
                return 16.67; // 60 FPS
            }
            catch
            {
                return 16.67;
            }
        }

        /// <summary>
        /// Atualiza cache de processos (otimizado)
        /// </summary>
        private void UpdateProcessCache()
        {
            try
            {
                // Limpar cache antigo
                var now = DateTime.Now;
                var toRemove = _processCache.Where(kvp => now - kvp.Value.LastSeen > TimeSpan.FromMinutes(1)).ToList();
                foreach (var kvp in toRemove)
                {
                    _processCache.Remove(kvp.Key);
                }
                
                // Atualizar apenas processos importantes (não todos)
                // Isso reduz drasticamente o overhead
                var importantProcesses = new[] { "dwm", "explorer", "csrss", "winlogon" };
                foreach (var procName in importantProcesses)
                {
                    try
                    {
                        var procs = Process.GetProcessesByName(procName);
                        foreach (var proc in procs)
                        {
                            _processCache[proc.Id] = new CachedProcessInfo
                            {
                                ProcessName = proc.ProcessName,
                                LastSeen = now
                            };
                            proc.Dispose();
                        }
                    }
                    catch { }
                }
                
                _lastProcessCacheUpdate = now;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[GamePerf] Erro ao atualizar cache: {ex.Message}");
            }
        }

        /// <summary>
        /// Handler para quando jogo é detectado
        /// </summary>
        private void OnGameStarted(object? sender, GameDetectedEventArgs e)
        {
            try
            {
                lock (_lock)
                {
                    _currentGameProcess = e.Process;
                    _isGameRunning = true;
                    _logger.LogInfo($"[GamePerf] 🎮 Jogo detectado: {e.GameName} - Ativando modo de performance");
                    
                    // Ativar modo de performance imediatamente
                    EnablePerformanceMode();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[GamePerf] Erro ao processar jogo iniciado: {ex.Message}");
            }
        }

        /// <summary>
        /// Handler para quando jogo é encerrado
        /// </summary>
        private void OnGameStopped(object? sender, GameStoppedEventArgs e)
        {
            try
            {
                lock (_lock)
                {
                    if (_currentGameProcess?.Id == e.ProcessId)
                    {
                        _currentGameProcess = null;
                        _isGameRunning = false;
                        _logger.LogInfo($"[GamePerf] 🛑 Jogo encerrado - Desativando modo de performance");
                        
                        // Desativar modo de performance
                        DisablePerformanceMode();
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[GamePerf] Erro ao processar jogo encerrado: {ex.Message}");
            }
        }

        /// <summary>
        /// Obtém informações de performance atuais
        /// </summary>
        public PerformanceInfo GetPerformanceInfo()
        {
            lock (_lock)
            {
                return new PerformanceInfo
                {
                    IsPerformanceModeActive = _performanceModeActive,
                    IsGameRunning = _isGameRunning,
                    GameProcessName = _currentGameProcess?.ProcessName,
                    EstimatedFrameTime = _currentGameProcess != null ? EstimateFrameTime() : 0,
                    ProcessCacheSize = _processCache.Count
                };
            }
        }

        public void Dispose()
        {
            Stop();
            
            // Desinscrever eventos
            if (_gameDetection != null)
            {
                _gameDetection.OnGameStarted -= OnGameStarted;
                _gameDetection.OnGameStopped -= OnGameStopped;
            }
            
            // Limpar cache
            _processCache.Clear();
            
            GC.SuppressFinalize(this);
        }
    }

    /// <summary>
    /// Informações de performance
    /// </summary>
    public class PerformanceInfo
    {
        public bool IsPerformanceModeActive { get; set; }
        public bool IsGameRunning { get; set; }
        public string? GameProcessName { get; set; }
        public double EstimatedFrameTime { get; set; }
        public int ProcessCacheSize { get; set; }
    }

    /// <summary>
    /// Informações de processo em cache
    /// </summary>
    internal class CachedProcessInfo
    {
        public string ProcessName { get; set; } = string.Empty;
        public DateTime LastSeen { get; set; }
    }
}

