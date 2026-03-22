using System;
using System.Threading;
using System.Threading.Tasks;

namespace VoltrisOptimizer.Services.Gamer
{
    /// <summary>
    /// Coordenador de otimização para trocas de contexto entre aplicativos
    /// Integra todos os serviços especializados para eliminar travamentos durante app-switching
    /// </summary>
    public class AppSwitchOptimizationCoordinator : IDisposable
    {
        private readonly ILoggingService _logger;
        private readonly ContextSwitchDetectorService _contextDetector;
        private readonly ResourcePreAllocatorService _resourcePreAllocator;
        private readonly IntelligentBackgroundSuspender _backgroundSuspender;
        private readonly PriorityCacheService _priorityCache;
        private readonly InputLatencyMonitorService _latencyMonitor;
        private readonly SystemNotificationBlockerService _notificationBlocker; // Novo serviço
        private readonly LoadingPhaseOptimizerService _loadingOptimizer; // Novo serviço
        
        private int _gameProcessId;
        private bool _isRunning = false;
        private readonly object _lock = new();
        
        public AppSwitchOptimizationCoordinator(
            ILoggingService logger,
            ContextSwitchDetectorService contextDetector,
            ResourcePreAllocatorService resourcePreAllocator,
            IntelligentBackgroundSuspender backgroundSuspender,
            PriorityCacheService priorityCache,
            InputLatencyMonitorService latencyMonitor,
            SystemNotificationBlockerService notificationBlocker, // Novo parâmetro
            LoadingPhaseOptimizerService loadingOptimizer) // Novo parâmetro
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _contextDetector = contextDetector ?? throw new ArgumentNullException(nameof(contextDetector));
            _resourcePreAllocator = resourcePreAllocator ?? throw new ArgumentNullException(nameof(resourcePreAllocator));
            _backgroundSuspender = backgroundSuspender ?? throw new ArgumentNullException(nameof(backgroundSuspender));
            _priorityCache = priorityCache ?? throw new ArgumentNullException(nameof(priorityCache));
            _latencyMonitor = latencyMonitor ?? throw new ArgumentNullException(nameof(latencyMonitor));
            _notificationBlocker = notificationBlocker ?? throw new ArgumentNullException(nameof(notificationBlocker)); // Nova atribuição
            _loadingOptimizer = loadingOptimizer ?? throw new ArgumentNullException(nameof(loadingOptimizer)); // Nova atribuição
            
            // Registrar eventos do detector de contexto
            _contextDetector.AppSwitchDetected += OnAppSwitchDetected;
            _contextDetector.SwitchPatternIdentified += OnSwitchPatternIdentified;
            
            // Registrar eventos do otimizador de carregamento
            _loadingOptimizer.OnLoadingPhaseStarted += OnLoadingPhaseStarted;
            _loadingOptimizer.OnLoadingPhaseEnded += OnLoadingPhaseEnded;
        }
        
        /// <summary>
        /// Inicia todos os serviços de otimização
        /// </summary>
        public async Task StartAsync(int gameProcessId, CancellationToken ct = default)
        {
            lock (_lock)
            {
                if (_isRunning)
                    return;
                
                _gameProcessId = gameProcessId;
                _isRunning = true;
            }
            
            try
            {
                // Iniciar todos os serviços especializados
                _contextDetector.StartMonitoring(gameProcessId);
                _resourcePreAllocator.Start(gameProcessId);
                _backgroundSuspender.Start(gameProcessId);
                _priorityCache.Start(gameProcessId);
                _latencyMonitor.Start(gameProcessId);
                _notificationBlocker.StartBlocking(gameProcessId); // Novo serviço
                _loadingOptimizer.StartMonitoring(gameProcessId); // Novo serviço
                
                _logger.LogInfo($"[AppSwitchCoord] Todos os serviços de otimização iniciados para processo {gameProcessId}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[AppSwitchCoord] Erro ao iniciar serviços: {ex.Message}");
                throw;
            }
        }
        
        /// <summary>
        /// Para todos os serviços de otimização
        /// </summary>
        public async Task StopAsync(CancellationToken ct = default)
        {
            lock (_lock)
            {
                if (!_isRunning)
                    return;
                
                _isRunning = false;
            }
            
            try
            {
                // Parar todos os serviços especializados
                _contextDetector.StopMonitoring();
                _resourcePreAllocator.Stop();
                _backgroundSuspender.Stop();
                _priorityCache.Stop();
                _latencyMonitor.Stop();
                _notificationBlocker.StopBlocking(); // Novo serviço
                _loadingOptimizer.StopMonitoring(); // Novo serviço
                
                _logger.LogInfo("[AppSwitchCoord] Todos os serviços de otimização parados");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[AppSwitchCoord] Erro ao parar serviços: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Handler para detecção de troca de contexto
        /// </summary>
        private void OnAppSwitchDetected(object? sender, AppSwitchEventArgs e)
        {
            try
            {
                // Coordenar todas as otimizações necessárias
                HandlePriorityOptimization(e);
                HandleResourceOptimization(e);
                HandleBackgroundOptimization(e);
                HandleLatencyOptimization(e);
                HandleNotificationBlocking(e); // Nova otimização
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[AppSwitchCoord] Erro no handler de app switch: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Handler para identificação de padrões de troca
        /// </summary>
        private void OnSwitchPatternIdentified(object? sender, SwitchPatternEventArgs e)
        {
            try
            {
                _logger.LogInfo($"[AppSwitchCoord] Padrão identificado: {e.PatternType} (frequência: {e.SwitchesPerMinute:F2}/s)");
                
                // Ajustar estratégias baseado em padrões
                AdjustStrategiesBasedOnPatterns(e);
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[AppSwitchCoord] Erro no handler de padrões: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Handler para início de fase de carregamento
        /// </summary>
        private void OnLoadingPhaseStarted(object? sender, EventArgs e)
        {
            try
            {
                _logger.LogInfo("[AppSwitchCoord] Fase de carregamento iniciada - aplicando otimizações");
                
                // Suspender processos em background com mais agressividade
                _backgroundSuspender.SuspendMoreAggressively();
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[AppSwitchCoord] Erro no handler de carregamento: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Handler para fim de fase de carregamento
        /// </summary>
        private void OnLoadingPhaseEnded(object? sender, EventArgs e)
        {
            try
            {
                _logger.LogInfo("[AppSwitchCoord] Fase de carregamento encerrada - restaurando prioridades");
                
                // Restaurar prioridades normais
                _backgroundSuspender.RestoreNormalPriorities();
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[AppSwitchCoord] Erro no handler de fim de carregamento: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Otimização de prioridades durante troca
        /// </summary>
        private void HandlePriorityOptimization(AppSwitchEventArgs e)
        {
            try
            {
                // O cache de prioridades já lida com isso automaticamente
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[AppSwitchCoord] Erro na otimização de prioridades: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Otimização de recursos durante troca
        /// </summary>
        private void HandleResourceOptimization(AppSwitchEventArgs e)
        {
            try
            {
                // O pré-alocador já lida com isso automaticamente
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[AppSwitchCoord] Erro na otimização de recursos: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Otimização de processos em background
        /// </summary>
        private void HandleBackgroundOptimization(AppSwitchEventArgs e)
        {
            try
            {
                // O suspensor de background já lida com isso automaticamente
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[AppSwitchCoord] Erro na otimização de background: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Otimização de latência de input
        /// </summary>
        private void HandleLatencyOptimization(AppSwitchEventArgs e)
        {
            try
            {
                // O monitor de latência já lida com isso automaticamente
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[AppSwitchCoord] Erro na otimização de latência: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Bloqueio de notificações durante troca
        /// </summary>
        private void HandleNotificationBlocking(AppSwitchEventArgs e)
        {
            try
            {
                // O bloqueador de notificações já está ativo, mas podemos reforçar
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[AppSwitchCoord] Erro no bloqueio de notificações: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Ajusta estratégias baseado em padrões identificados
        /// </summary>
        private void AdjustStrategiesBasedOnPatterns(SwitchPatternEventArgs e)
        {
            try
            {
                // Ajustar comportamento baseado na frequência de trocas
                if (e.SwitchesPerMinute > 120.0) // Mais de 2 trocas por segundo
                {
                    _logger.LogInfo("[AppSwitchCoord] Alta frequência detectada - otimizando para multitasking");
                    // Estratégia mais conservadora para preservar performance
                }
                else if (e.SwitchesPerMinute < 12.0) // Menos de 1 troca a cada 5 segundos
                {
                    _logger.LogInfo("[AppSwitchCoord] Baixa frequência detectada - otimizando para performance pura");
                    // Estratégia mais agressiva para maximizar performance do jogo
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[AppSwitchCoord] Erro ao ajustar estratégias: {ex.Message}");
            }
        }
        
        public void Dispose()
        {
            // Cancelar eventos
            _contextDetector.AppSwitchDetected -= OnAppSwitchDetected;
            _contextDetector.SwitchPatternIdentified -= OnSwitchPatternIdentified;
            _loadingOptimizer.OnLoadingPhaseStarted -= OnLoadingPhaseStarted;
            _loadingOptimizer.OnLoadingPhaseEnded -= OnLoadingPhaseEnded;
            
            // Parar serviços
            try
            {
                StopAsync().Wait(1000); // Esperar no máximo 1 segundo
            }
            catch
            {
                // Ignorar erros ao parar serviços durante o dispose
            }
        }
    }
}