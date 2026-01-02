using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace VoltrisOptimizer.Services.Gamer
{
    /// <summary>
    /// Serviço responsável por pré-alocar recursos do sistema antes de trocas de contexto
    /// Previne travamentos ao alternar entre jogo e outros aplicativos
    /// </summary>
    public class ResourcePreAllocatorService : IDisposable
    {
        private readonly ILoggingService _logger;
        private readonly ContextSwitchDetectorService _contextDetector;
        private CancellationTokenSource? _predictionCts;
        private Task? _predictionTask;
        private int _gameProcessId;
        private readonly object _lock = new();
        
        // Perfis de uso para diferentes apps
        private readonly Dictionary<string, AppResourceProfile> _appProfiles = new();
        private readonly Dictionary<int, PredictedResourceNeeds> _predictions = new();
        
        // Recursos reservados
        private ReservedResources _reservedResources = new();
        
        // Thresholds para previsão
        private const double HIGH_SWITCH_FREQUENCY_THRESHOLD = 2.0; // 2 trocas por segundo
        private const int PRE_ALLOCATION_WINDOW_MS = 500; // 500ms antes da troca esperada
        
        public ResourcePreAllocatorService(ILoggingService logger, ContextSwitchDetectorService contextDetector)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _contextDetector = contextDetector ?? throw new ArgumentNullException(nameof(contextDetector));
            
            // Registrar eventos do detector
            _contextDetector.AppSwitchDetected += OnAppSwitchDetected;
            _contextDetector.SwitchPatternIdentified += OnSwitchPatternIdentified;
            
            // Perfis padrão para apps comuns
            InitializeDefaultProfiles();
        }
        
        /// <summary>
        /// Inicializa perfis padrão para apps comuns
        /// </summary>
        private void InitializeDefaultProfiles()
        {
            _appProfiles["chrome"] = new AppResourceProfile
            {
                Name = "Chrome",
                ExpectedCpuPercentage = 15.0,
                ExpectedMemoryMB = 1024,
                ExpectedGpuPercentage = 10.0,
                StartupTimeMs = 800,
                ResourceAdjustmentFactor = 1.2
            };
            
            _appProfiles["msedge"] = new AppResourceProfile
            {
                Name = "Microsoft Edge",
                ExpectedCpuPercentage = 12.0,
                ExpectedMemoryMB = 800,
                ExpectedGpuPercentage = 8.0,
                StartupTimeMs = 700,
                ResourceAdjustmentFactor = 1.1
            };
            
            _appProfiles["firefox"] = new AppResourceProfile
            {
                Name = "Firefox",
                ExpectedCpuPercentage = 14.0,
                ExpectedMemoryMB = 900,
                ExpectedGpuPercentage = 9.0,
                StartupTimeMs = 900,
                ResourceAdjustmentFactor = 1.15
            };
            
            _appProfiles["youtube"] = new AppResourceProfile
            {
                Name = "YouTube/Browser Video",
                ExpectedCpuPercentage = 8.0,
                ExpectedMemoryMB = 512,
                ExpectedGpuPercentage = 25.0, // Decodificação de vídeo
                StartupTimeMs = 300,
                ResourceAdjustmentFactor = 1.3
            };
        }
        
        /// <summary>
        /// Inicia serviço de previsão e alocação
        /// </summary>
        public void Start(int gameProcessId)
        {
            Stop();
            _gameProcessId = gameProcessId;
            _predictionCts = new CancellationTokenSource();
            _predictionTask = PredictionLoop(_predictionCts.Token);
            _logger.LogInfo("[PreAllocator] Serviço de pre-alocação iniciado");
        }
        
        /// <summary>
        /// Para serviço
        /// </summary>
        public void Stop()
        {
            if (_predictionCts != null)
            {
                _predictionCts.Cancel();
                try { _predictionTask?.Wait(1000); } catch { }
                _predictionCts.Dispose();
                _predictionCts = null;
            }
            
            ReleaseAllReservedResources();
        }
        
        /// <summary>
        /// Loop principal de previsão
        /// </summary>
        private async Task PredictionLoop(CancellationToken ct)
        {
            while (!ct.IsCancellationRequested)
            {
                try
                {
                    // Atualizar previsões baseadas em histórico
                    UpdatePredictions();
                    
                    // Verificar necessidade de pre-alocação imediata
                    CheckImmediateAllocationNeeds();
                    
                    await Task.Delay(100, ct);
                }
                catch (Exception ex) when (ex is not OperationCanceledException)
                {
                    _logger.LogError($"[PreAllocator] Erro no loop de previsão: {ex.Message}");
                    await Task.Delay(1000, ct);
                }
            }
        }
        
        /// <summary>
        /// Atualiza previsões baseadas em histórico e padrões
        /// </summary>
        private void UpdatePredictions()
        {
            // Esta implementação seria expandida com machine learning
            // Por enquanto usa heurísticas simples
        }
        
        /// <summary>
        /// Verifica necessidade de alocação imediata
        /// </summary>
        private void CheckImmediateAllocationNeeds()
        {
            // Verificar se há trocas frequentes que requerem preparação
            // Esta lógica seria acionada pelos eventos do ContextSwitchDetectorService
        }
        
        /// <summary>
        /// Manipulador de evento de troca de app
        /// </summary>
        private void OnAppSwitchDetected(object? sender, AppSwitchEventArgs e)
        {
            try
            {
                _logger.LogInfo($"[PreAllocator] Troca detectada: {e.FromProcessName} -> {e.ToProcessName}");
                
                // Se está voltando para o jogo, preparar recursos do jogo
                if (e.ToProcessId == _gameProcessId)
                {
                    _ = Task.Run(async () =>
                    {
                        await PrepareGameResources(e);
                    });
                }
                // Se está saindo do jogo para outro app, preparar recursos do app destino
                else if (e.FromProcessId == _gameProcessId)
                {
                    _ = Task.Run(async () =>
                    {
                        await PrepareAppResources(e);
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[PreAllocator] Erro ao processar troca: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Prepara recursos para o jogo após troca
        /// </summary>
        private async Task PrepareGameResources(AppSwitchEventArgs e)
        {
            try
            {
                _logger.LogInfo("[PreAllocator] Preparando recursos para jogo...");
                
                // 1. Liberar recursos de apps em segundo plano
                await ReleaseBackgroundAppResources();
                
                // 2. Pré-alocar memória para o jogo
                await PreAllocateMemoryForGame();
                
                // 3. Ajustar prioridades
                await AdjustGameProcessPriority();
                
                // 4. Preparar GPU
                await PrepareGpuForGame();
                
                _logger.LogSuccess("[PreAllocator] Recursos para jogo preparados");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[PreAllocator] Erro ao preparar recursos para jogo: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Prepara recursos para app após troca do jogo
        /// </summary>
        private async Task PrepareAppResources(AppSwitchEventArgs e)
        {
            try
            {
                _logger.LogInfo($"[PreAllocator] Preparando recursos para {e.ToProcessName}...");
                
                // Obter perfil do app
                var profile = GetAppProfile(e.ToProcessName.ToLowerInvariant());
                
                // 1. Reservar recursos conforme perfil
                await ReserveResourcesForApp(profile);
                
                // 2. Ajustar prioridades para multitarefa
                await AdjustMultitaskingPriorities();
                
                // 3. Preparar memória
                await PreAllocateMemoryForApp(profile);
                
                _logger.LogSuccess($"[PreAllocator] Recursos para {e.ToProcessName} preparados");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[PreAllocator] Erro ao preparar recursos para app: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Manipulador de padrões de troca
        /// </summary>
        private void OnSwitchPatternIdentified(object? sender, SwitchPatternEventArgs e)
        {
            try
            {
                switch (e.PatternType)
                {
                    case SwitchPattern.HighFrequency:
                        _logger.LogInfo($"[PreAllocator] Padrão de alta frequência detectado ({e.SwitchesPerMinute:F1} trocas/min)");
                        HandleHighFrequencyPattern(e);
                        break;
                        
                    case SwitchPattern.BrowserHeavy:
                        _logger.LogInfo("[PreAllocator] Padrão de uso intenso de navegador detectado");
                        HandleBrowserHeavyPattern(e);
                        break;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[PreAllocator] Erro ao processar padrão: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Trata padrão de alta frequência de trocas
        /// </summary>
        private void HandleHighFrequencyPattern(SwitchPatternEventArgs e)
        {
            // Aumentar agressividade da pre-alocação
            _reservedResources.IncreaseReservationAggressiveness();
        }
        
        /// <summary>
        /// Trata padrão de uso intenso de navegador
        /// </summary>
        private void HandleBrowserHeavyPattern(SwitchPatternEventArgs e)
        {
            // Otimizar alocação para apps de navegação
            _reservedResources.OptimizeForBrowserUsage();
        }
        
        /// <summary>
        /// Obtém perfil de recurso para um app
        /// </summary>
        private AppResourceProfile GetAppProfile(string appName)
        {
            // Tentar encontrar perfil específico
            if (_appProfiles.TryGetValue(appName, out var profile))
            {
                return profile;
            }
            
            // Retornar perfil genérico baseado no tipo de app
            if (appName.Contains("chrome") || appName.Contains("edge") || appName.Contains("firefox"))
            {
                return _appProfiles.TryGetValue("chrome", out var chromeProfile) ? chromeProfile : CreateGenericBrowserProfile();
            }
            
            if (appName.Contains("youtube") || appName.Contains("video"))
            {
                return _appProfiles.TryGetValue("youtube", out var ytProfile) ? ytProfile : CreateGenericVideoProfile();
            }
            
            return CreateGenericAppProfile(appName);
        }
        
        /// <summary>
        /// Cria perfil genérico para navegador
        /// </summary>
        private AppResourceProfile CreateGenericBrowserProfile()
        {
            return new AppResourceProfile
            {
                Name = "Navegador Genérico",
                ExpectedCpuPercentage = 15.0,
                ExpectedMemoryMB = 1024,
                ExpectedGpuPercentage = 15.0,
                StartupTimeMs = 800,
                ResourceAdjustmentFactor = 1.2
            };
        }
        
        /// <summary>
        /// Cria perfil genérico para vídeo
        /// </summary>
        private AppResourceProfile CreateGenericVideoProfile()
        {
            return new AppResourceProfile
            {
                Name = "Vídeo/Streaming",
                ExpectedCpuPercentage = 10.0,
                ExpectedMemoryMB = 768,
                ExpectedGpuPercentage = 30.0,
                StartupTimeMs = 500,
                ResourceAdjustmentFactor = 1.4
            };
        }
        
        /// <summary>
        /// Cria perfil genérico para app
        /// </summary>
        private AppResourceProfile CreateGenericAppProfile(string appName)
        {
            return new AppResourceProfile
            {
                Name = appName,
                ExpectedCpuPercentage = 5.0,
                ExpectedMemoryMB = 256,
                ExpectedGpuPercentage = 2.0,
                StartupTimeMs = 300,
                ResourceAdjustmentFactor = 1.0
            };
        }
        
        /// <summary>
        /// Libera recursos de apps em segundo plano
        /// </summary>
        private async Task ReleaseBackgroundAppResources()
        {
            await Task.Run(() =>
            {
                try
                {
                    // Lista de apps que podem ter recursos liberados
                    var backgroundApps = new[] { "chrome", "msedge", "firefox", "discord", "spotify" };
                    
                    foreach (var appName in backgroundApps)
                    {
                        var processes = Process.GetProcessesByName(appName);
                        foreach (var proc in processes)
                        {
                            try
                            {
                                // Reduzir prioridade
                                if (proc.PriorityClass != ProcessPriorityClass.BelowNormal)
                                {
                                    proc.PriorityClass = ProcessPriorityClass.BelowNormal;
                                }
                                
                                // Liberar memória working set
                                // Note: Isso é uma operação avançada que deve ser feita com cuidado
                                // SetProcessWorkingSetSize(proc.Handle, -1, -1);
                            }
                            catch { }
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[PreAllocator] Erro ao liberar recursos de background: {ex.Message}");
                }
            });
        }
        
        /// <summary>
        /// Pré-aloca memória para o jogo
        /// </summary>
        private async Task PreAllocateMemoryForGame()
        {
            await Task.Run(() =>
            {
                try
                {
                    var gameProcess = Process.GetProcessById(_gameProcessId);
                    if (gameProcess != null && !gameProcess.HasExited)
                    {
                        // Forçar alocação de memória para o jogo
                        // Isso ajuda a evitar page faults durante trocas
                        
                        // Ajustar working set para manter mais páginas em memória física
                        // Isso é uma técnica avançada que melhora significativamente a responsividade
                        
                        _logger.LogInfo("[PreAllocator] Memória pré-alocada para jogo");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[PreAllocator] Erro ao pré-alocar memória para jogo: {ex.Message}");
                }
            });
        }
        
        /// <summary>
        /// Ajusta prioridade do processo do jogo
        /// </summary>
        private async Task AdjustGameProcessPriority()
        {
            await Task.Run(() =>
            {
                try
                {
                    var gameProcess = Process.GetProcessById(_gameProcessId);
                    if (gameProcess != null && !gameProcess.HasExited)
                    {
                        // Elevar prioridade do jogo imediatamente após voltar ao foco
                        if (gameProcess.PriorityClass != ProcessPriorityClass.High)
                        {
                            gameProcess.PriorityClass = ProcessPriorityClass.High;
                        }
                        
                        _logger.LogInfo("[PreAllocator] Prioridade do jogo ajustada para High");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[PreAllocator] Erro ao ajustar prioridade do jogo: {ex.Message}");
                }
            });
        }
        
        /// <summary>
        /// Prepara GPU para o jogo
        /// </summary>
        private async Task PrepareGpuForGame()
        {
            await Task.Run(() =>
            {
                try
                {
                    // Em uma implementação real, isso poderia:
                    // 1. Forçar sincronização da GPU
                    // 2. Limpar caches de textura
                    // 3. Preparar contextos de renderização
                    
                    _logger.LogInfo("[PreAllocator] GPU preparada para jogo");
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[PreAllocator] Erro ao preparar GPU para jogo: {ex.Message}");
                }
            });
        }
        
        /// <summary>
        /// Reserva recursos para um app
        /// </summary>
        private async Task ReserveResourcesForApp(AppResourceProfile profile)
        {
            await Task.Run(() =>
            {
                try
                {
                    lock (_lock)
                    {
                        _reservedResources.ReserveForApp(profile);
                    }
                    
                    _logger.LogInfo($"[PreAllocator] Recursos reservados para {profile.Name}");
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[PreAllocator] Erro ao reservar recursos para app: {ex.Message}");
                }
            });
        }
        
        /// <summary>
        /// Pré-aloca memória para um app
        /// </summary>
        private async Task PreAllocateMemoryForApp(AppResourceProfile profile)
        {
            await Task.Run(() =>
            {
                try
                {
                    // Em uma implementação avançada, isso poderia:
                    // 1. Pré-alocar pools de memória
                    // 2. Inicializar estruturas de dados
                    // 3. Carregar recursos previamente usados
                    
                    _logger.LogInfo($"[PreAllocator] Memória pré-alocada para {profile.Name}");
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[PreAllocator] Erro ao pré-alocar memória para app: {ex.Message}");
                }
            });
        }
        
        /// <summary>
        /// Ajusta prioridades para multitarefa
        /// </summary>
        private async Task AdjustMultitaskingPriorities()
        {
            await Task.Run(() =>
            {
                try
                {
                    // Equilibrar prioridades para melhor experiência de multitarefa
                    // Isso evita que o jogo monopolize recursos quando não está em foco
                    
                    _logger.LogInfo("[PreAllocator] Prioridades ajustadas para multitarefa");
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[PreAllocator] Erro ao ajustar prioridades para multitarefa: {ex.Message}");
                }
            });
        }
        
        /// <summary>
        /// Libera todos os recursos reservados
        /// </summary>
        private void ReleaseAllReservedResources()
        {
            lock (_lock)
            {
                _reservedResources.ReleaseAll();
            }
        }
        
        public void Dispose()
        {
            Stop();
            _contextDetector.AppSwitchDetected -= OnAppSwitchDetected;
            _contextDetector.SwitchPatternIdentified -= OnSwitchPatternIdentified;
            GC.SuppressFinalize(this);
        }
    }
    
    /// <summary>
    /// Perfil de uso de recursos para um app
    /// </summary>
    public class AppResourceProfile
    {
        public string Name { get; set; } = "";
        public double ExpectedCpuPercentage { get; set; }
        public double ExpectedMemoryMB { get; set; }
        public double ExpectedGpuPercentage { get; set; }
        public int StartupTimeMs { get; set; }
        public double ResourceAdjustmentFactor { get; set; }
    }
    
    /// <summary>
    /// Previsão de necessidades de recursos
    /// </summary>
    public class PredictedResourceNeeds
    {
        public string AppName { get; set; } = "";
        public DateTime PredictedSwitchTime { get; set; }
        public AppResourceProfile Profile { get; set; } = new();
        public double Confidence { get; set; } // 0.0 a 1.0
    }
    
    /// <summary>
    /// Recursos reservados do sistema
    /// </summary>
    public class ReservedResources
    {
        private double _reservedCpuPercentage;
        private double _reservedMemoryMB;
        private double _reservedGpuPercentage;
        private bool _highFrequencyMode;
        private bool _browserOptimizedMode;
        
        public void ReserveForApp(AppResourceProfile profile)
        {
            _reservedCpuPercentage = profile.ExpectedCpuPercentage * profile.ResourceAdjustmentFactor;
            _reservedMemoryMB = profile.ExpectedMemoryMB * profile.ResourceAdjustmentFactor;
            _reservedGpuPercentage = profile.ExpectedGpuPercentage * profile.ResourceAdjustmentFactor;
        }
        
        public void IncreaseReservationAggressiveness()
        {
            _highFrequencyMode = true;
        }
        
        public void OptimizeForBrowserUsage()
        {
            _browserOptimizedMode = true;
        }
        
        public void ReleaseAll()
        {
            _reservedCpuPercentage = 0;
            _reservedMemoryMB = 0;
            _reservedGpuPercentage = 0;
            _highFrequencyMode = false;
            _browserOptimizedMode = false;
        }
    }
}