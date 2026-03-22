using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using VoltrisOptimizer.Services.Gamer.Models;
using VoltrisOptimizer.Services.Gamer.Implementation.AdaptiveGovernor;
using VoltrisOptimizer.Services.Gamer.Overlay.Implementation;
using VoltrisOptimizer.Services.Gamer.Overlay.Helpers;
using VoltrisOptimizer.Services.Gamer.GamerModeManager;

namespace VoltrisOptimizer.Services.Gamer.Implementation
{
    /// <summary>
    /// Serviço de governança adaptativa REAL para otimização de performance em tempo real
    /// 
    /// ARQUITETURA:
    /// - TelemetryLayer: Coleta métricas reais (somente leitura)
    /// - DecisionEngine: Decide se e o que fazer baseado em métricas
    /// - ActionLayer: Aplica ações seguras e reversíveis
    /// - RollbackManager: Reverte todas as ações aplicadas
    /// - SafetySystem: Watchdog de estabilidade
    /// 
    /// PRINCÍPIOS:
    /// - Observação contínua
    /// - Decisão baseada em métricas reais
    /// - Ação mínima necessária
    /// - Reversão garantida
    /// - Fallback automático
    /// - Zero impacto negativo se falhar
    /// </summary>
    public class AdaptiveGovernorService : IAdaptiveGovernor, IDisposable
    {
        private readonly ILoggingService _logger;
        private readonly ICpuGamingOptimizer _cpuOptimizer;
        private readonly IGpuGamingOptimizer _gpuOptimizer;
        private readonly IMemoryGamingOptimizer _memoryOptimizer;
        private readonly IProcessPrioritizer _processPrioritizer;
        
        // Componentes do Adaptive Governor
        private TelemetryLayer? _telemetryLayer;
        private DecisionEngine? _decisionEngine;
        private ActionLayer? _actionLayer;
        private RollbackManager? _rollbackManager;
        private SafetySystem? _safetySystem;
        
        // Estado
        private CancellationTokenSource? _monitoringCts;
        private Task? _monitoringTask;
        private int _gameProcessId;
        private Process? _gameProcess;
        private GamerOptimizationOptions _currentOptions = new();
        private readonly List<StutterIncident> _incidentHistory = new();
        private readonly object _historyLock = new();
        
        // Modo de operação
        private GovernorMode _mode = GovernorMode.Off;
        private SystemMetrics? _baselineMetrics; // Métricas antes de aplicar ações
        
        // Cooldown entre decisões (evitar ações muito frequentes)
        private DateTime _lastActionTime = DateTime.MinValue;
        private const int ActionCooldownSeconds = 5; // Mínimo 5 segundos entre ações
        
        // Controle de Aquecimento (Warm-up)
        private int _warmupCounter = 0;
        private const int WarmupIterations = 10; // ~5-10 segundos dependendo do intervalo
        
        // Integração com serviços existentes (opcional)
        private TelemetryService? _telemetryService;
        private FpsReader? _fpsReader;
        private IThermalMonitorService? _thermalMonitor;
        
        public event EventHandler<StutterIncident>? StutterDetected;
        
        public bool IsRunning { get; private set; }
        
        public GovernorMode Mode
        {
            get => _mode;
            private set
            {
                if (_mode != value)
                {
                    _mode = value;
                    _logger.LogInfo($"[AdaptiveGovernor] Modo alterado para: {value}");
                }
            }
        }
        
        public AdaptiveGovernorService(
            ILoggingService logger,
            ICpuGamingOptimizer cpuOptimizer,
            IGpuGamingOptimizer gpuOptimizer,
            IMemoryGamingOptimizer memoryOptimizer,
            IProcessPrioritizer processPrioritizer,
            IThermalMonitorService? thermalMonitor = null)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _cpuOptimizer = cpuOptimizer ?? throw new ArgumentNullException(nameof(cpuOptimizer));
            _gpuOptimizer = gpuOptimizer ?? throw new ArgumentNullException(nameof(gpuOptimizer));
            _memoryOptimizer = memoryOptimizer ?? throw new ArgumentNullException(nameof(memoryOptimizer));
            _processPrioritizer = processPrioritizer ?? throw new ArgumentNullException(nameof(processPrioritizer));
            _thermalMonitor = thermalMonitor;
        }
        
        /// <summary>
        /// Inicia governança para um processo de jogo
        /// </summary>
        public void Start(int gameProcessId, GamerOptimizationOptions options)
        {
            if (IsRunning)
            {
                _logger.LogWarning("[AdaptiveGovernor] Já está rodando");
                return;
            }
            
            try
            {
                _gameProcessId = gameProcessId;
                _currentOptions = options ?? new GamerOptimizationOptions();
                
                // Obter processo do jogo
                try
                {
                    _gameProcess = Process.GetProcessById(gameProcessId);
                }
                catch (ArgumentException)
                {
                    _logger.LogError($"[AdaptiveGovernor] Processo {gameProcessId} não encontrado");
                    return;
                }
                
                // Determinar modo baseado nas opções
                // Por padrão, Adaptive Governor está DESABILITADO (segurança)
                if (!_currentOptions.EnableAntiStutter)
                {
                    Mode = GovernorMode.Off;
                    _logger.LogInfo("[AdaptiveGovernor] Modo Anti-Stutter desabilitado nas opções - Governor não iniciará");
                    return;
                }
                
                // Por padrão, usar modo MONITOR (apenas observação)
                // Usuário deve habilitar explicitamente modo ACTIVE
                Mode = GovernorMode.Monitor;
                
                // Criar FpsReader para o processo do jogo (antes de InitializeComponents
                // para que o TelemetryLayer já receba a referência correta)
                _fpsReader = new FpsReader(_gameProcess, _logger);
                _fpsReader.StartMonitoring();
                
                // Inicializar componentes (TelemetryLayer usará _fpsReader e _thermalMonitor)
                InitializeComponents();
                
                // Iniciar loop de monitoramento
                _monitoringCts = new CancellationTokenSource();
                _monitoringTask = Task.Run(() => MonitorPerformanceAsync(_monitoringCts.Token), _monitoringCts.Token);
                
                IsRunning = true;
                _logger.LogSuccess($"[AdaptiveGovernor] ═══════════════════════════════════════");
                _logger.LogSuccess($"[AdaptiveGovernor] Governor iniciado (Modo: {Mode})");
                _logger.LogSuccess($"[AdaptiveGovernor] Processo: {_gameProcess.ProcessName} (PID: {gameProcessId})");
                _logger.LogSuccess($"[AdaptiveGovernor] ═══════════════════════════════════════");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[AdaptiveGovernor] Erro ao iniciar: {ex.Message}", ex);
                Cleanup();
            }
        }
        
        /// <summary>
        /// Para a governança e reverte todas as ações
        /// </summary>
        public void Stop()
        {
            if (!IsRunning)
                return;
            
            _logger.LogInfo("[AdaptiveGovernor] Parando governor...");
            
            // Cancelar monitoramento
            _monitoringCts?.Cancel();
            try
            {
                _monitoringTask?.Wait(2000); // Aguardar até 2 segundos
            }
            catch { }
            
            // Reverter todas as ações
            try
            {
                _rollbackManager?.RollbackAllAsync().Wait(3000);
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[AdaptiveGovernor] Erro ao reverter ações: {ex.Message}");
            }
            
            Cleanup();
            
            IsRunning = false;
            Mode = GovernorMode.Off;
            _logger.LogInfo("[AdaptiveGovernor] Governor parado e ações revertidas");
        }
        
        /// <summary>
        /// Define o modo de operação
        /// </summary>
        public void SetMode(GovernorMode mode)
        {
            if (!IsRunning)
            {
                _logger.LogWarning("[AdaptiveGovernor] Não é possível alterar modo - governor não está rodando");
                return;
            }
            
            Mode = mode;
            _logger.LogInfo($"[AdaptiveGovernor] Modo alterado para: {mode}");
        }
        
        /// <summary>
        /// Loop principal de monitoramento adaptativo
        /// </summary>
        private async Task MonitorPerformanceAsync(CancellationToken ct)
        {
            // Intervalo de monitoramento (configurável)
            var intervalMs = Mode == GovernorMode.Monitor ? 1000 : 500; // Monitor: 1s, Active: 500ms
            
            while (!ct.IsCancellationRequested)
            {
                try
                {
                    // Verificar se processo ainda está rodando
                    if (_gameProcess == null || _gameProcess.HasExited)
                    {
                        _logger.LogInfo("[AdaptiveGovernor] Processo do jogo encerrou - parando governor");
                        break;
                    }
                    
                    // Capturar referências locais para evitar NRE se Cleanup() for chamado concorrentemente
                    var telemetryLayer = _telemetryLayer;
                    var safetySystem = _safetySystem;
                    var decisionEngine = _decisionEngine;
                    var actionLayer = _actionLayer;
                    var rollbackManager = _rollbackManager;
                    
                    // Se qualquer componente vital for nulo, parar monitoramento
                    if (telemetryLayer == null || safetySystem == null || decisionEngine == null || actionLayer == null || rollbackManager == null)
                    {
                         // Se foi cancelado, sair silenciosamente
                         if (ct.IsCancellationRequested) break;
                         
                         _logger.LogWarning("[AdaptiveGovernor] Componentes não inicializados ou descartados - parando loop");
                         break;
                    }

                    // Coletar métricas
                    var metrics = await telemetryLayer.CollectMetricsAsync(ct);

                    // LÓGICA DE AQUECIMENTO (WARM-UP)
                    // Ignora os primeiros ciclos para dar tempo ao jogo de carregar e estabilizar
                    // Evita que o carregamento inicial (0% -> 100% CPU) seja visto como instabilidade
                    if (_warmupCounter < WarmupIterations)
                    {
                        _warmupCounter++;
                        // Log periódico durante aquecimento (a cada 2 segundos aprox)
                        if (_warmupCounter % 4 == 0)
                        {
                            _logger.LogInfo($"[AdaptiveGovernor] 🔥 Aquecendo... ({_warmupCounter}/{WarmupIterations}) - Aguardando estabilização do jogo.");
                        }
                        
                        // Durante o aquecimento, apenas coletamos, não agimos nem definimos baseline real
                        await Task.Delay(intervalMs, ct);
                        continue;
                    }
                    
                    // Estabelecer baseline apenas se tivermos dados válidos
                    if (_baselineMetrics == null)
                    {
                        // Só aceita baseline se o jogo estiver realmente rodando (consumindo recursos)
                        if (metrics.CpuUsagePercent > 1.0 || metrics.Fps > 1.0) 
                        {
                            _baselineMetrics = metrics;
                            _logger.LogInfo($"[AdaptiveGovernor] 🏁 Baseline estabelecido: FPS={metrics.Fps:F1}, CPU={metrics.CpuUsagePercent:F1}%, GPU={metrics.GpuUsagePercent:F1}%");
                        }
                        else
                        {
                            // Continuar esperando se os contadores estiverem zerados
                            await Task.Delay(intervalMs, ct);
                            continue;
                        }
                    }
                    
                    // Verificar estabilidade (watchdog)
                    // Agora comparamos com um baseline realista
                    var safetyCheck = safetySystem.CheckStability(metrics, _baselineMetrics);
                    if (safetyCheck.ShouldRollback)
                    {
                        _logger.LogWarning($"[AdaptiveGovernor] ⚠️ Degradação detectada - revertendo ações: {safetyCheck.Reason}");
                        await rollbackManager.RollbackAllAsync(ct);
                        
                        // Atualizar baseline para as métricas atuais após rollback para evitar
                        // loop de falhas consecutivas quando o jogo naturalmente opera em FPS mais baixo
                        // (ex: cenas pesadas, loading screens, menus)
                        _baselineMetrics = metrics;
                        _logger.LogInfo($"[AdaptiveGovernor] Baseline atualizado pós-rollback: FPS={metrics.Fps:F1}");
                        
                        safetySystem.RegisterFailure();
                        
                        // Se muitas falhas, desativar governor
                        if (safetySystem.ShouldDisableGovernor())
                        {
                            _logger.LogError("[AdaptiveGovernor] ⚠️ Muitas falhas consecutivas - desativando governor automaticamente");
                            Mode = GovernorMode.Off;
                            break;
                        }
                        
                        await Task.Delay(intervalMs, ct);
                        continue;
                    }
                    
                    // Se modo é MONITOR, apenas coletar e logar
                    if (Mode == GovernorMode.Monitor)
                    {
                        LogMetrics(metrics);
                        await Task.Delay(intervalMs, ct);
                        continue;
                    }
                    
                    // Se modo é ACTIVE, tomar decisões
                    if (Mode == GovernorMode.Active)
                    {
                        // Verificar cooldown
                        if ((DateTime.UtcNow - _lastActionTime).TotalSeconds < ActionCooldownSeconds)
                        {
                            await Task.Delay(intervalMs, ct);
                            continue;
                        }
                        
                        // Analisar e decidir
                        var decision = decisionEngine.AnalyzeAndDecide(metrics);
                        
                        // Registrar stutter se detectado
                        if (decision.StutterIncident != null)
                        {
                            RegisterStutterIncident(decision.StutterIncident);
                        }
                        
                        // Executar ação se necessário
                        if (decision.ShouldAct && decision.Action != null)
                        {
                            _logger.LogInfo($"[AdaptiveGovernor] 📊 Decisão: {decision.Action.Type} - {decision.Reason}");
                            
                            // Executar ação
                            var actionResult = await actionLayer.ExecuteActionAsync(decision.Action, ct);
                            
                            if (actionResult.Success)
                            {
                                _logger.LogSuccess($"[AdaptiveGovernor] ✓ Ação executada: {actionResult.Message}");
                                
                                // Registrar rollback se necessário
                                if (actionResult.RollbackData != null)
                                {
                                    rollbackManager.RegisterRollback(actionResult.RollbackData);
                                }
                                
                                _lastActionTime = DateTime.UtcNow;
                                safetySystem.ResetFailureCount();
                                
                                // Aguardar um pouco antes de coletar métricas novamente
                                await Task.Delay(1000, ct); // 1 segundo para ação ter efeito
                            }
                            else
                            {
                                _logger.LogWarning($"[AdaptiveGovernor] ✗ Ação falhou: {actionResult.ErrorMessage}");
                                safetySystem.RegisterFailure();
                            }
                        }
                    }
                    
                    await Task.Delay(intervalMs, ct);
                }
                catch (OperationCanceledException)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[AdaptiveGovernor] Erro no loop de monitoramento: {ex.Message}", ex);
                    _safetySystem?.RegisterFailure();
                    
                    // Se muitas falhas, desativar
                    if (_safetySystem?.ShouldDisableGovernor() == true)
                    {
                        _logger.LogError("[AdaptiveGovernor] ⚠️ Muitas falhas - desativando governor");
                        break;
                    }
                    
                    await Task.Delay(5000, ct); // Aguardar 5s antes de tentar novamente
                }
            }
            
            _logger.LogInfo("[AdaptiveGovernor] Loop de monitoramento encerrado");
        }
        
        private void InitializeComponents()
        {
            // Inicializar TelemetryLayer
            _telemetryLayer = new TelemetryLayer(
                _logger,
                _gameProcess,
                _telemetryService,
                _fpsReader,
                _thermalMonitor);
            
            // Inicializar DecisionEngine
            _decisionEngine = new DecisionEngine(_logger);
            
            // Inicializar ActionLayer
            _actionLayer = new ActionLayer(
                _logger,
                _processPrioritizer,
                _memoryOptimizer,
                _gameProcess);
            
            // Inicializar RollbackManager
            _rollbackManager = new RollbackManager(_logger, _processPrioritizer);
            
            // Inicializar SafetySystem
            _safetySystem = new SafetySystem(_logger);
        }
        
        private void Cleanup()
        {
            _monitoringCts?.Dispose();
            _monitoringCts = null;
            _monitoringTask = null;
            
            _fpsReader?.StopMonitoring();
            _fpsReader?.Dispose();
            _fpsReader = null;
            
            _telemetryLayer?.Dispose();
            _telemetryLayer = null;
            
            _decisionEngine?.ClearHistory();
            _decisionEngine = null;
            
            _rollbackManager?.Clear();
            _rollbackManager = null;
            
            _safetySystem?.ClearHistory();
            _safetySystem = null;
            
            _gameProcess = null;
            _baselineMetrics = null;
        }
        
        private void LogMetrics(SystemMetrics metrics)
        {
            _logger.LogInfo($"[AdaptiveGovernor] 📊 FPS: {metrics.Fps:F1} | " +
                          $"CPU: {metrics.CpuUsagePercent:F1}% | " +
                          $"GPU: {metrics.GpuUsagePercent:F1}% | " +
                          $"RAM: {metrics.RamUsagePercent:F1}% | " +
                          $"FrameTime: {metrics.FrameTimeMs:F2}ms");
        }
        
        private void RegisterStutterIncident(StutterIncident incident)
        {
            lock (_historyLock)
            {
                _incidentHistory.Add(incident);
                
                // Manter apenas últimos 100 incidentes
                if (_incidentHistory.Count > 100)
                {
                    _incidentHistory.RemoveAt(0);
                }
            }
            
            StutterDetected?.Invoke(this, incident);
            _logger.LogWarning($"[AdaptiveGovernor] ⚠️ Stutter detectado: {incident.Cause} - {incident.Summary}");
        }
        
        public IReadOnlyList<StutterIncident> GetRecentIncidents()
        {
            lock (_historyLock)
            {
                return _incidentHistory.AsReadOnly();
            }
        }
        
        public void ClearIncidents()
        {
            lock (_historyLock)
            {
                _incidentHistory.Clear();
            }
        }
        
        public void Dispose()
        {
            Stop();
            GC.SuppressFinalize(this);
        }
    }
    
    /// <summary>
    /// Modos de operação do Adaptive Governor
    /// </summary>
    public enum GovernorMode
    {
        /// <summary>
        /// Desabilitado - nada acontece
        /// </summary>
        Off,
        
        /// <summary>
        /// Modo monitor - apenas coleta métricas e gera logs
        /// Nenhuma ação é aplicada
        /// </summary>
        Monitor,
        
        /// <summary>
        /// Modo ativo - aplica decisões adaptativas reais
        /// Com todos os sistemas de segurança ativos
        /// </summary>
        Active
    }
}
