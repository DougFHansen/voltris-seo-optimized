using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using VoltrisOptimizer.Services.Gamer.Models;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Services.Gamer.Implementation;
using VoltrisOptimizer.Services.Gamer.Adaptive;
using VoltrisOptimizer.Services.Gamer.Intelligence;

namespace VoltrisOptimizer.Services.Gamer.Implementation
{
    /// <summary>
    /// Orquestrador principal do modo gamer
    /// Coordena todos os serviços de otimização para maximizar performance
    /// </summary>
    public class GamerModeOrchestrator : IGamerModeOrchestrator, IDisposable
    {
        private readonly ILoggingService _logger;
        private readonly ICpuGamingOptimizer _cpuOptimizer;
        private readonly IGpuGamingOptimizer _gpuOptimizer;
        private readonly INetworkGamingOptimizer _networkOptimizer;
        private readonly IMemoryGamingOptimizer _memoryOptimizer;
        private readonly IProcessPrioritizer _processPrioritizer;
        private readonly IHardwareDetector _hardwareDetector;
        private readonly ITimerResolutionService? _timerService;
        private readonly IAdaptiveGovernor? _adaptiveGovernor;
        private readonly AppSwitchOptimizationCoordinator? _appSwitchCoordinator;
        private readonly IGameDetector _gameDetector;
        private readonly HistoryService _historyService;
        private readonly IImmersiveGamingOptimizer _immersiveOptimizer;
        private readonly VoltrisOptimizer.Services.Gamer.Overlay.Interfaces.IOverlayService? _overlayService;
        private readonly GamerProfileResolver _profileResolver;
        private bool _isAutoPilotEnabled;
        private bool _isManualActivation;
        private readonly SemaphoreSlim _deactivationLock = new(1, 1);
        private readonly SemaphoreSlim _activationLock = new(1, 1);
        private bool _isActivating = false;
        
        private Models.GamerModeStatus _status = new();
        private Models.GamerOptimizationOptions _currentOptions = new();
        private Process? _activeGameProcess;
        private readonly object _statusLock = new();
        private readonly string _restorationFilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "restoration_state.json");
        private string? _activeGameExecutablePath; // Caminho do executável do jogo ativo (para revert de QoS)
        private readonly VoltrisOptimizer.Services.Optimization.StabilityEngineService _stabilityEngine;
        private readonly VoltrisOptimizer.Services.Optimization.IDynamicLoadStabilizer? _dynamicLoadStabilizer;
        private CancellationTokenSource? _watchdogCts;
        
        // ✅ CORREÇÃO ENTERPRISE: Novos serviços para 100% de eficácia
        private readonly GamerModePreOptimizer _preOptimizer;
        private readonly RegistryValidator _registryValidator;
        private readonly WindowsGameModeController _gameModeController;
        private GpuDriverInterop? _gpuDriverInterop;
        private readonly HybridCpuOptimizer _hybridCpuOptimizer;
        private readonly GamerModeAuditor _auditor;
        private readonly IAdaptiveOptimizationEngine? _adaptiveOptimizationEngine;

        // ✅ NOVOS: State Memory + módulos de otimização
        private readonly GamerStateMemory _stateMemory;
        private readonly VoltrisOptimizer.Services.Performance.HpetController _hpetController;
        private readonly VoltrisOptimizer.Services.Gamer.OptimizationModules.WallpaperSlideshowModule _wallpaperModule;
        private readonly VoltrisOptimizer.Services.Gamer.OptimizationModules.UwpBackgroundAppsModule _uwpModule;
        private readonly VoltrisOptimizer.Services.Gamer.OptimizationModules.VisualEffectsOptimizer _visualOptimizer;

        // ✅ FIX BUG #3: RollbackRegistry compartilhado por sessão (não recriado a cada chamada)
        // Garante que ApplyAsync e RevertAsync dos módulos usem o mesmo registry
        private VoltrisOptimizer.Services.Gamer.OptimizationModules.RollbackRegistry _sessionRollbackRegistry = new();

        public Models.GamerModeStatus Status
        {
            get
            {
                lock (_statusLock)
                {
                    return _status;
                }
            }
        }

        public bool IsActive => Status.IsActive;

        public event EventHandler<Models.GamerModeStatus>? StatusChanged;

        public GamerModeOrchestrator(
            ILoggingService logger,
            ICpuGamingOptimizer cpuOptimizer,
            IGpuGamingOptimizer gpuOptimizer,
            INetworkGamingOptimizer networkOptimizer,
            IMemoryGamingOptimizer memoryOptimizer,
            IProcessPrioritizer processPrioritizer,
            IHardwareDetector hardwareDetector,
            IGameDetector gameDetector,
            HistoryService historyService,
            IImmersiveGamingOptimizer immersiveOptimizer,
            GamerStateMemory stateMemory,
            VoltrisOptimizer.Services.Performance.HpetController hpetController,
            VoltrisOptimizer.Services.Gamer.OptimizationModules.WallpaperSlideshowModule wallpaperModule,
            VoltrisOptimizer.Services.Gamer.OptimizationModules.UwpBackgroundAppsModule uwpModule,
            VoltrisOptimizer.Services.Gamer.OptimizationModules.VisualEffectsOptimizer visualOptimizer,
            ITimerResolutionService? timerService = null,
            IAdaptiveGovernor? adaptiveGovernor = null,
            AppSwitchOptimizationCoordinator? appSwitchCoordinator = null,
            VoltrisOptimizer.Services.Gamer.Overlay.Interfaces.IOverlayService? overlayService = null,
            VoltrisOptimizer.Services.Optimization.IDynamicLoadStabilizer? dynamicLoadStabilizer = null)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _cpuOptimizer = cpuOptimizer ?? throw new ArgumentNullException(nameof(cpuOptimizer));
            _gpuOptimizer = gpuOptimizer ?? throw new ArgumentNullException(nameof(gpuOptimizer));
            _networkOptimizer = networkOptimizer ?? throw new ArgumentNullException(nameof(networkOptimizer));
            _memoryOptimizer = memoryOptimizer ?? throw new ArgumentNullException(nameof(memoryOptimizer));
            _processPrioritizer = processPrioritizer ?? throw new ArgumentNullException(nameof(processPrioritizer));
            _hardwareDetector = hardwareDetector ?? throw new ArgumentNullException(nameof(hardwareDetector));
            _timerService = timerService;
            _adaptiveGovernor = adaptiveGovernor;
            _appSwitchCoordinator = appSwitchCoordinator; 
            _gameDetector = gameDetector ?? throw new ArgumentNullException(nameof(gameDetector));
            _historyService = historyService ?? throw new ArgumentNullException(nameof(historyService));
            _immersiveOptimizer = immersiveOptimizer ?? throw new ArgumentNullException(nameof(immersiveOptimizer));
            _overlayService = overlayService;
            _dynamicLoadStabilizer = dynamicLoadStabilizer;
            _stabilityEngine = new VoltrisOptimizer.Services.Optimization.StabilityEngineService(_logger);
            _profileResolver = new GamerProfileResolver(SettingsService.Instance, _logger);
            _status = new Models.GamerModeStatus();
            
            // ✅ CORREÇÃO ENTERPRISE: Criar instâncias dos novos serviços
            _preOptimizer = new GamerModePreOptimizer(
                logger, cpuOptimizer, gpuOptimizer, networkOptimizer, memoryOptimizer, timerService);
            _registryValidator = new RegistryValidator(logger);
            _gameModeController = new WindowsGameModeController(logger);
            _auditor = new GamerModeAuditor(logger);
            _hybridCpuOptimizer = new HybridCpuOptimizer(logger, hardwareDetector);
            _gpuDriverInterop = null; // Será inicializado sob demanda

            // ✅ CORREÇÃO CRÍTICA: Remover dependência circular
            // AdaptiveOptimizationEngine será obtido via ServiceLocator quando necessário
            _adaptiveOptimizationEngine = null;

            // ✅ CORREÇÃO DI: Módulos recebidos via injeção de dependência (instância única)
            _stateMemory = stateMemory ?? throw new ArgumentNullException(nameof(stateMemory));
            _hpetController = hpetController ?? throw new ArgumentNullException(nameof(hpetController));
            _wallpaperModule = wallpaperModule ?? throw new ArgumentNullException(nameof(wallpaperModule));
            _uwpModule = uwpModule ?? throw new ArgumentNullException(nameof(uwpModule));
            _visualOptimizer = visualOptimizer ?? throw new ArgumentNullException(nameof(visualOptimizer));
        }

        public void StartAutoPilot()
        {
            _logger.LogInfo("[Orchestrator] 🔍 [AUTOPILOT] Solicitação de ativação recebida");
            _logger.LogDebug($"[Orchestrator] Estado inicial: _isAutoPilotEnabled={_isAutoPilotEnabled}, IsActive={IsActive}");
            
            if (_isAutoPilotEnabled)
            {
                _logger.LogWarning("[Orchestrator] ⚠️ AutoPilot já está monitorando o sistema.");
                return;
            }
            
            _isAutoPilotEnabled = true;
            _logger.LogInfo("[Orchestrator] 🧊 Ativando Radar de Jogos (AutoPilot)...");
            
            _logger.LogTrace("[Orchestrator] Vinculando eventos do GameDetector");
            _gameDetector.GameStarted += OnGameStarted;
            _gameDetector.GameStopped += OnGameStopped;
            
            _logger.LogSuccess("[Orchestrator] ✅ AutoPilot em execução: Monitoramento de processos de alta performance ativo.");
            _gameDetector.StartMonitoring();
        }

        public void StopAutoPilot()
        {
            if (!_isAutoPilotEnabled) return;
            _isAutoPilotEnabled = false;
            _logger.LogInfo("[Orchestrator] 🧊 Desativando AutoPilot...");
            _gameDetector.GameStarted -= OnGameStarted;
            _gameDetector.GameStopped -= OnGameStopped;
            _gameDetector.StopMonitoring();
            _logger.LogInfo("[Orchestrator] ✅ AutoPilot desativado.");
        }

        private async void OnGameStarted(object sender, Models.DetectedGame game)
        {
            try
            {
            Core.Diagnostics.CrashDiagnostics.Mark($"OnGameStarted ENTER: {game.Name}");
            _logger.Log(LogLevel.Info, LogCategory.Gamer, $"[GamerMode][Orchestrator] 🎮 OnGameStarted CHAMADO para '{game.Name}'");
            _logger.Log(LogLevel.Info, LogCategory.Gamer, $"[GamerMode][Orchestrator] Estado atual: AutoPilot={_isAutoPilotEnabled}, Já Ativo={IsActive}");
            
            // CORREÇÃO: Se já está ativo, atualizar o processo do jogo e reiniciar overlay
            if (IsActive && _overlayService != null && _overlayService.Settings.IsEnabled)
            {
                _logger.Log(LogLevel.Info, LogCategory.Gamer, $"[Overlay] Modo gamer já ativo, atualizando processo do jogo para '{game.Name}'");
                
                // Tentar encontrar o processo do jogo
                var processName = Path.GetFileNameWithoutExtension(game.ExecutablePath);
                _logger.Log(LogLevel.Info, LogCategory.Gamer, $"[Overlay] Buscando processo: {processName}");
                var processes = Process.GetProcessesByName(processName);
                
                if (processes.Length > 0)
                {
                    var gameProcess = processes[0];
                    _logger.Log(LogLevel.Info, LogCategory.Gamer, $"[Overlay] ✓ Processo encontrado: {processName} (PID: {gameProcess.Id})");
                    
                    // Parar overlay atual se estiver ativo
                    if (_overlayService.IsActive)
                    {
                        _logger.Log(LogLevel.Info, LogCategory.Gamer, "[Overlay] Parando overlay anterior");
                        await _overlayService.StopAsync();
                    }
                    
                    // Iniciar overlay para o novo jogo
                    _logger.Log(LogLevel.Info, LogCategory.Gamer, $"[Overlay] Iniciando overlay para {processName}");
                    try
                    {
                        var overlayStarted = await _overlayService.StartAsync(gameProcess.Id);
                        if (overlayStarted)
                        {
                            _logger.Log(LogLevel.Success, LogCategory.Gamer, $"[Overlay] ✅ Overlay iniciado para {processName}");
                        }
                        else
                        {
                            _logger.Log(LogLevel.Warning, LogCategory.Gamer, $"[Overlay] ⚠️ Falha ao iniciar overlay para {processName}");
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.Log(LogLevel.Error, LogCategory.Gamer, $"[Overlay] ❌ Erro ao iniciar overlay: {ex.Message}");
                    }
                    
                    // Atualizar _activeGameProcess
                    _activeGameProcess = gameProcess;
                    
                    UpdateStatus(s =>
                    {
                        s.ActiveGameName = processName;
                        s.ActiveGameProcessId = gameProcess.Id;
                    });
                    
                    _logger.Log(LogLevel.Success, LogCategory.Gamer, $"[Overlay] ✅ Processo do jogo atualizado: {processName} (PID: {gameProcess.Id})");
                }
                else
                {
                    _logger.Log(LogLevel.Warning, LogCategory.Gamer, $"[Overlay] ⚠️ Processo não encontrado: {processName}");
                }
                
                return;
            }
            
            if (!_isAutoPilotEnabled || IsActive)
            {
                _logger.Log(LogLevel.Info, LogCategory.Gamer, $"[GamerMode][Orchestrator] ⏭️ Ativação auto ignorada para '{game.Name}': AutoPilot={_isAutoPilotEnabled}, Já Ativo={IsActive}");
                return;
            }
            
            _logger.Log(LogLevel.AI_DECISION, LogCategory.Gamer, $"[GamerMode][Orchestrator] 🚀 Auto-Pilot: Decidido ativar otimizações para o jogo '{game.Name}'.");
            Core.Diagnostics.CrashDiagnostics.Mark($"OnGameStarted calling ActivateAsync for {game.Name}");
            await ActivateAsync(_currentOptions, game.ExecutablePath, isManual: false);
            Core.Diagnostics.CrashDiagnostics.Mark($"OnGameStarted ActivateAsync COMPLETED for {game.Name}");
            }
            catch (Exception ex)
            {
                // CRITICAL: async void exceptions kill the process instantly.
                // This catch prevents that from happening.
                Core.Diagnostics.CrashDiagnostics.TraceException("OnGameStarted_ASYNC_VOID", ex);
                _logger.Log(LogLevel.Error, LogCategory.Gamer, $"[GamerMode][Orchestrator] ERRO FATAL em OnGameStarted: {ex.Message}");
                _logger.Log(LogLevel.Error, LogCategory.Gamer, $"[GamerMode][Orchestrator] StackTrace: {ex.StackTrace}");
            }
        }

        private async void OnGameStopped(object sender, Models.DetectedGame game)
        {
            try
            {
            if (!_isAutoPilotEnabled || !IsActive || _isManualActivation)
            {
                _logger.Log(LogLevel.Info, LogCategory.Gamer, $"[GamerMode][Orchestrator] Desativação auto ignorada para '{game.Name}': AutoPilot={_isAutoPilotEnabled}, Ativo={IsActive}, Manual={_isManualActivation}");
                return;
            }
            
            _logger.Log(LogLevel.AI_DECISION, LogCategory.Gamer, $"Auto-Pilot: Detectada intenção de desativar após encerramento de '{game.Name}'.");
            await HandleAutoDeactivationAsync(game.Name);
            }
            catch (Exception ex)
            {
                Core.Diagnostics.CrashDiagnostics.TraceException("OnGameStopped_ASYNC_VOID", ex);
                _logger.Log(LogLevel.Error, LogCategory.Gamer, $"[GamerMode][Orchestrator] ERRO em OnGameStopped: {ex.Message}");
            }
        }

        private async Task HandleAutoDeactivationAsync(string gameName)
        {
            if (!await _deactivationLock.WaitAsync(0)) return; // Evitar execuções simultâneas

            try
            {
                _logger.Log(LogLevel.Info, LogCategory.Gamer, "[GamerMode][Orchestrator] Iniciando validação para desativação automática");
                
                // Grace period: Esperar 3 segundos para garantir que o processo não está apenas reiniciando ou trocando de executável
                await Task.Delay(3000);

                // Re-validar: Existe algum jogo rodando agora? (Evita desativar se o usuário abriu outro jogo rápido)
                // Nota: Usamos o IsActive interno pois ele é atualizado em tempo real pelo GameDetectorService
                if (_gameDetector.IsMonitoring && IsActive && !_isManualActivation)
                {
                    // Fazemos uma verificação manual rápida como fallback
                    var processName = Status.ActiveGameName;
                    if (!string.IsNullOrEmpty(processName))
                    {
                        var procs = Process.GetProcessesByName(processName);
                        if (procs.Length > 0)
                        {
                            _logger.Log(LogLevel.Warning, LogCategory.Gamer, $"[GamerMode][Orchestrator] Desativação cancelada: jogo ainda ativo ({processName})");
                            foreach (var p in procs) p.Dispose();
                            return;
                        }
                    }
                }

                _logger.Log(LogLevel.Info, LogCategory.Gamer, "[GamerMode][Orchestrator] Modo Gamer desativado automaticamente (Reason=GameExited)");
                await DeactivateAsync();
            }
            finally
            {
                _deactivationLock.Release();
            }
        }

        private void OnProcessExited(object? sender, EventArgs e)
        {
            if (sender is Process proc)
            {
                _logger.Log(LogLevel.Info, LogCategory.Gamer, $"[GamerMode][Detection] Jogo encerrado: {proc.ProcessName} (PID={proc.Id})");
                
                // Limpar handler para evitar duplicidade
                proc.Exited -= OnProcessExited;
                
                if (_isAutoPilotEnabled && !_isManualActivation)
                {
                    _ = HandleAutoDeactivationAsync(proc.ProcessName);
                }
            }
        }

        /// <summary>
        /// Ativa o modo gamer com todas as otimizações
        /// </summary>
        public async Task<bool> ActivateAsync(
            Models.GamerOptimizationOptions options,
            string? gameExecutable = null,
            IProgress<int>? progress = null,
            CancellationToken cancellationToken = default,
            bool isManual = true)
        {
            if (!await _activationLock.WaitAsync(0))
            {
                _logger.Log(LogLevel.Warning, LogCategory.Gamer, "[GamerMode][Orchestrator] Ativação já em progresso ou lock ocupado.");
                return false;
            }

            if (IsActive && !isManual)
            {
                _logger.Log(LogLevel.Info, LogCategory.Gamer, "[GamerMode][Orchestrator] Modo Gamer já está ativo. Abortando ativação automática redundante.");
                _activationLock.Release();
                return true;
            }

            try
            {
                _isActivating = true;
                // CORREÇÃO: Validar opções
                if (options == null)
                {
                    _logger.Log(LogLevel.Error, LogCategory.Gamer, "Falha ao ativar Modo Gamer: Opções de otimização inválidas.");
                    return false;
                }

                _logger.Log(LogLevel.Info, LogCategory.Gamer, "[GamerMode][Orchestrator] Iniciando ativação do Modo Gamer.");
                Core.Diagnostics.CrashDiagnostics.Mark("GamerMode ActivateAsync BEGIN");
                var startTime = DateTime.Now;
                _logger.LogInfo($"[GamerMode][Orchestrator] Alvo detectado: {gameExecutable ?? "Global Boost"} | Manual={isManual}");
                _currentOptions = options;
                _activeGameExecutablePath = gameExecutable;
                
                _isManualActivation = isManual;
                
                // ✅ CORREÇÃO CRÍTICA: Consultar Perfil Inteligente ANTES de aplicar otimizações
                _logger.LogInfo("[Orchestrator] 🧠 Consultando Perfil Inteligente...");
                var intelligentProfile = SettingsService.Instance.Settings.IntelligentProfile;
                
                _logger.LogInfo($"[Orchestrator] 🧠 Perfil Ativo: {intelligentProfile}");
                
                // ✅ BLOQUEIO TOTAL: EnterpriseSecure não permite Modo Gamer
                if (intelligentProfile == IntelligentProfileType.EnterpriseSecure)
                {
                    _logger.LogWarning("[Orchestrator] ⛔ BLOQUEADO: Perfil EnterpriseSecure não permite Modo Gamer");
                    
                    // Notificar usuário
                    try
                    {
                        NotificationManager.ShowWarning(
                            "Modo Gamer Bloqueado",
                            "O Perfil Inteligente atual (EnterpriseSecure) não permite ativação do Modo Gamer por questões de estabilidade.");
                    }
                    catch { }
                    
                    return false;
                }
                
                // ✅ Ajustar opções baseado no perfil inteligente global
                _logger.LogInfo("[Orchestrator] 🔧 Ajustando otimizações conforme Perfil Inteligente...");
                
                if (intelligentProfile == IntelligentProfileType.WorkOffice)
                {
                    _logger.LogInfo("[Orchestrator] ⚠️ Perfil WorkOffice: Otimizações conservadoras");
                    options.OptimizeMemory = false; // Não otimizar RAM agressivamente
                    options.CloseBackgroundApps = false; // Evitar fechar apps de produtividade
                }
                
                // ✅ DETECÇÃO ADAPTATIVA POR HARDWARE (baixa, média, alta, gamer)
                MachineProfileResult? machineProfile = null;
                try
                {
                    var profileDetector = VoltrisOptimizer.Core.ServiceLocator
                        .GetService<IMachineProfileDetector>();
                    
                    if (profileDetector != null)
                    {
                        _logger.LogInfo("[Orchestrator] 🧠 Analisando perfil de máquina (Entry/Mid/High/Gaming)...");
                        machineProfile = await profileDetector.AnalyzeMachineProfileAsync();
                        _logger.LogInfo($"[Orchestrator] Perfil de máquina: {machineProfile.Profile} | CPU:{machineProfile.CpuTier} GPU:{machineProfile.GpuTier} RAM:{machineProfile.RamTier} Notebook:{machineProfile.IsNotebook}");

                        // Política de agressividade por perfil
                        switch (machineProfile.Profile)
                        {
                            case MachineProfile.EntryLevel:
                                // PCs fracos: foco em estabilidade e ruído de background
                                options.ApplyFpsBoost = false;          // Evitar tweaks agressivos de GPU
                                options.ReduceLatency = true;           // Timer e pequenas otimizações
                                options.OptimizeNetwork = true;        // Ajuda em jogos online leves
                                options.OptimizeMemory = true;         // Mas sem limpeza muito agressiva
                                break;

                            case MachineProfile.MidRange:
                                // PCs médios: equilíbrio agressivo/estável
                                options.ApplyFpsBoost = true;
                                options.OptimizeMemory = true;
                                options.OptimizeNetwork = true;
                                if (!options.CloseBackgroundApps)
                                {
                                    options.CloseBackgroundApps = true;
                                }
                                break;

                            case MachineProfile.HighEnd:
                            case MachineProfile.GamingMachine:
                                // PCs fortes/gamer: liberar tudo que for suportado
                                options.ApplyFpsBoost = true;
                                options.OptimizeMemory = true;
                                options.OptimizeNetwork = true;
                                options.ReduceLatency = true;
                                options.EnableAntiStutter = true;
                                if (!options.CloseBackgroundApps)
                                {
                                    options.CloseBackgroundApps = true;
                                }
                                break;
                        }

                        // Regras específicas de notebook/bateria
                        if (machineProfile.IsNotebook)
                        {
                            _logger.LogInfo("[Orchestrator] 🔋 Notebook detectado - evitando agressividade extrema de energia");
                            // Em notebooks, evitar power-plan extremo; focar em latência e background
                            options.ApplyFpsBoost = machineProfile.GpuTier >= HardwareTier.Medium;
                        }

                        // Logar recomendações e restrições para auditoria
                        if (machineProfile.Recommendations.Length > 0)
                        {
                            _logger.LogInfo("[Orchestrator] Recomendações de perfil: " +
                                string.Join(" | ", machineProfile.Recommendations));
                        }
                        if (machineProfile.Restrictions.Length > 0)
                        {
                            _logger.LogInfo("[Orchestrator] Restrições de perfil: " +
                                string.Join(" | ", machineProfile.Restrictions));
                        }

                        // ✅ CHAMADA INTELIGENTE: Otimizações adaptativas em tempo real
                        // Obter via ServiceLocator para evitar dependência circular
                        var adaptiveEngine = VoltrisOptimizer.Core.ServiceLocator.GetService<IAdaptiveOptimizationEngine>();
                        if (adaptiveEngine != null)
                        {
                            _logger.LogInfo("[Orchestrator] 🤖 Analisando ajustes adaptativos em tempo real via Adaptive Optimization Engine...");
                            var rtResult = await adaptiveEngine.ApplyRealTimeOptimizationsAsync(
                                options,
                                machineProfile,
                                cancellationToken);

                            if (rtResult.Success)
                            {
                                _logger.LogSuccess($"[Orchestrator] ✅ {rtResult.RealTimeAdjustments} Ajustes aplicados: [{string.Join(", ", rtResult.AppliedAdjustments)}]");
                                _auditor.LogOptimization("ADAPTIVE", "RealTime", true, $"Ajustes: {rtResult.RealTimeAdjustments}");
                            }
                            else
                            {
                                _logger.LogWarning("[Orchestrator] ⚠️ Adaptive Engine não identificou ajustes adicionais necessários.");
                                _auditor.LogOptimization("ADAPTIVE", "RealTime", false, "Nenhum ajuste recomendado");
                            }
                        }
                        else
                        {
                            _logger.LogInfo("[Orchestrator] AdaptiveOptimizationEngine não disponível - pulando otimizações em tempo real.");
                        }
                    }
                    else
                    {
                        _logger.LogInfo("[Orchestrator] IMachineProfileDetector não disponível - seguindo apenas Perfil Inteligente global.");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[Orchestrator] Falha ao aplicar ajustes adaptativos por perfil de máquina: {ex.Message}");
                }
                
                _logger.LogInfo("[Orchestrator] ✅ Otimizações ajustadas com sucesso (Perfil Inteligente + Perfil de Máquina + Adaptive Engine)");

                // TELEMETRIA ENTERPRISE
                var telemetry = VoltrisOptimizer.Core.ServiceLocator.GetService<VoltrisOptimizer.Services.Telemetry.TelemetryService>();
                if (telemetry != null) 
                {
                    telemetry.TrackEvent("FEATURE_EXECUTE", "GamerMode", "Activate", 
                        metadata: new { 
                            game = gameExecutable ?? "Global", 
                            options = options 
                        });
                }
                
                // ✅ CORREÇÃO CRÍTICA #1: AUDITORIA INICIADA
                _auditor.LogOptimization("ORCHESTRATOR", "ActivationStarted", true, 
                    $"Game: {gameExecutable ?? "Global"}, Manual: {isManual}");
                
                // 0. Salvar estado de restauração (Crash Protection)
                await SaveRestorationStateAsync(gameExecutable, options);

                // ✅ CORREÇÃO CRÍTICA #2: RESOLVER CONFLITOS (ANTES DE TUDO)
                Core.Diagnostics.CrashDiagnostics.Mark("GamerMode FASE 0 — ResolveConflict");
                _logger.LogInfo("[Orchestrator] 🔍 [FASE 0] Resolvendo conflitos com Windows...");
                bool conflictResolved = _gameModeController.ResolveConflict();
                _auditor.LogOptimization("CONFLICT_RESOLUTION", "WindowsGameMode", 
                    conflictResolved, conflictResolved ? "Desabilitado" : "Falha ao desabilitar");
                progress?.Report(5);

                // ✅ CORREÇÃO CRÍTICA #3: PRE-OPTIMIZATION (ANTES DO JOGO)
                Core.Diagnostics.CrashDiagnostics.Mark("GamerMode FASE PRE-OPTIMIZATION");
                _logger.LogInfo("═══════════════════════════════════════════");
                _logger.LogInfo("🚀 [PRE-OPTIMIZATION] PREPARANDO SISTEMA ANTES DO JOGO");
                _logger.LogInfo("═══════════════════════════════════════════");
                
                bool systemPrepared = await _preOptimizer.PrepareSystemForGamingAsync(options, cancellationToken);
                
                if (!systemPrepared)
                {
                    _logger.LogError("[Orchestrator] ❌ Falha na preparação do sistema");
                    _auditor.LogOptimization("PRE_OPTIMIZATION", "SystemPreparation", false, "Falha crítica");
                    _auditor.PrintSummary();
                    _auditor.SaveToFile();
                    return false;
                }
                
                _auditor.LogOptimization("PRE_OPTIMIZATION", "SystemPreparation", true, "Sistema preparado");
                progress?.Report(25);

                // 1. Detectar hardware
                _logger.LogInfo("[Orchestrator] 🔍 [FASE 1] Detectando capacidades de hardware...");
                var hardware = await _hardwareDetector.GetCapabilitiesAsync(cancellationToken);
                _logger.LogInfo($"[Orchestrator] 🖥️ Hardware detectado: {hardware.CpuName}, GPU: {hardware.PrimaryGpu.Name}, {hardware.TotalRamGb}GB RAM.");
                progress?.Report(30);
                
                // 1.1 Estabilização do sistema (SaaS Smoothing)
                _logger.LogInfo("[Orchestrator] 🚀 [FASE 1.1] Aplicando motor de estabilidade e fluidez...");
                _stabilityEngine.ApplySmoothnessOptimizations();

                cancellationToken.ThrowIfCancellationRequested();

                // 2. Fechar processos desnecessários
                _logger.LogInfo("[Orchestrator] 🧹 [FASE 2] Limpando processos em segundo plano...");
                if (options.CloseBackgroundApps == true)
                {
                    _logger.Log(LogLevel.Info, LogCategory.Gamer, "Executando limpeza de processos...");
                    _processPrioritizer.CloseUnnecessaryProcesses();
                    _auditor.LogOptimization("PROCESS", "CloseBackground", true, "Processos fechados");
                }
                progress?.Report(35);

                // ✅ FASE 2.5: Limpar State Memory da sessão anterior (memória + disco)
                _stateMemory.Clear();
                _stateMemory.ClearDiskState();
                _logger.LogInfo("[Orchestrator] 🧠 [FASE 2.5] State Memory limpo para nova sessão.");

                // ✅ FIX BUG #3: Resetar RollbackRegistry compartilhado para nova sessão limpa
                // Garante que módulos não herdem estado de sessão anterior
                _sessionRollbackRegistry = new VoltrisOptimizer.Services.Gamer.OptimizationModules.RollbackRegistry();
                _logger.LogInfo($"[Orchestrator] 🔄 [FASE 2.5] SessionRollbackRegistry resetado (nova instância #{_sessionRollbackRegistry.GetHashCode()}).");

                // ✅ FASE 4: HPET
                if (options.DisableHpet)
                {
                    _logger.LogInfo("[Orchestrator] ⏲️ [FASE 4] Desativando HPET...");
                    bool hpetResult = await Task.Run(() => _hpetController.DisableHpet(), cancellationToken);
                    if (hpetResult)
                        _auditor.LogOptimization("HPET", "Disable", true, "HPET desativado via BCDEdit/DeviceManager");
                    else
                        _logger.LogWarning("[Orchestrator] ⚠️ HPET não pôde ser desativado, continuando...");
                }

                // ✅ FASE 5: Wallpaper → Cor sólida
                if (options.DisableWallpaperSlideshow)
                {
                    _logger.LogInfo("[Orchestrator] 🖼️ [FASE 5] Mudando wallpaper para cor sólida...");
                    var sessionCtxWallpaper = BuildMinimalSessionContext();
                    await _wallpaperModule.ApplyAsync(sessionCtxWallpaper, cancellationToken);
                }

                // ✅ FASE 6: Apps UWP em segundo plano
                if (options.DisableUwpBackgroundApps)
                {
                    _logger.LogInfo("[Orchestrator] 📱 [FASE 6] Desativando apps UWP em segundo plano...");
                    var sessionCtxUwp = BuildMinimalSessionContext();
                    await _uwpModule.ApplyAsync(sessionCtxUwp, cancellationToken);
                }

                // ✅ FASE 8: Efeitos visuais
                if (options.VisualLevel != VoltrisOptimizer.Services.Gamer.Models.VisualOptimizationLevel.None)
                {
                    _logger.LogInfo($"[Orchestrator] 🎨 [FASE 8] Aplicando otimizações visuais (nível: {options.VisualLevel})...");
                    _visualOptimizer.SetLevel(options.VisualLevel);
                    var sessionCtxVisual = BuildMinimalSessionContext();
                    await _visualOptimizer.ApplyAsync(sessionCtxVisual, cancellationToken);
                }

                // ✅ CORREÇÃO CRÍTICA #4: DETECTAR E VINCULAR AO JOGO (APÓS PRE-OPTIMIZATION)
                Core.Diagnostics.CrashDiagnostics.Mark("GamerMode FASE 3 — DetectGame");
                _logger.LogInfo("[Orchestrator] 🎯 [FASE 3] Detectando e vinculando ao jogo...");
                if (!string.IsNullOrEmpty(gameExecutable))
                {
                    var processName = Path.GetFileNameWithoutExtension(gameExecutable);
                    _logger.LogInfo($"[Orchestrator] Procurando {processName}...");
                    var processes = Process.GetProcessesByName(processName);
                    
                    if (processes.Length > 0)
                    {
                        _activeGameProcess = processes[0];
                        _logger.LogSuccess($"[Orchestrator] ✅ Jogo detectado: {processName} (PID: {_activeGameProcess.Id})");
                        
                        // ✅ APLICAR PRIORIDADE
                        _processPrioritizer.SetPriority(_activeGameProcess.Id, ProcessPriorityLevel.High);
                        _auditor.LogOptimization("PROCESS", "SetPriority", true, $"PID: {_activeGameProcess.Id}");
                        
                        // ✅ CORREÇÃO CRÍTICA #5: THREAD AFFINITY (CPUs HÍBRIDAS)
                        if (_hardwareDetector.IsHybridCpu())
                        {
                            bool affinityApplied = _hybridCpuOptimizer.ApplyHybridAffinity(_activeGameProcess.Id);
                            _auditor.LogOptimization("CPU", "HybridAffinity", affinityApplied, 
                                affinityApplied ? "P-cores isolados" : "Falha ao aplicar");
                        }
                        
                        // ✅ CORREÇÃO CRÍTICA #6: INTERAGIR COM DRIVER GPU
                        if (_gpuDriverInterop == null)
                        {
                            var gpuInfo = await _gpuOptimizer.GetGpuInfoAsync(cancellationToken);
                            _gpuDriverInterop = new GpuDriverInterop(_logger, gpuInfo.Vendor);
                        }
                        
                        bool driverOptimized = _gpuDriverInterop.SetMaxPerformanceMode();
                        _auditor.LogOptimization("GPU_DRIVER", "MaxPerformance", driverOptimized,
                            driverOptimized ? "Driver configurado" : "Driver não suporta - configure manualmente");
                        
                        // CORREÇÃO CRÍTICA: Notificar DynamicLoadStabilizer sobre o PID do jogo
                        if (_dynamicLoadStabilizer != null)
                        {
                            Core.Diagnostics.CrashDiagnostics.Mark($"GamerMode DSL.StartAsync PID={_activeGameProcess.Id}");
                            _logger.LogInfo($"[Orchestrator] 🛡️ Notificando StabilityAgent para PROTEGER o jogo (PID: {_activeGameProcess.Id})");
                            await _dynamicLoadStabilizer.StartAsync(_activeGameProcess.Id, cancellationToken);
                            Core.Diagnostics.CrashDiagnostics.Mark("GamerMode DSL.StartAsync DONE");
                        }
                        
                        UpdateStatus(s =>
                        {
                            s.ActiveGameName = processName;
                            s.ActiveGameProcessId = _activeGameProcess.Id;
                            s.IsActive = true;
                        });

                        // Monitorar saída do processo
                        try
                        {
                            _activeGameProcess.EnableRaisingEvents = true;
                            _activeGameProcess.Exited += OnProcessExited;
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"[Orchestrator] Não foi possível monitorar saída do processo: {ex.Message}");
                        }
                    }
                    else
                    {
                        _logger.LogWarning($"[Orchestrator] ⚠️ Processo '{processName}' não encontrado");
                        _auditor.LogOptimization("DETECTION", "GameProcess", false, $"Processo não encontrado: {processName}");
                    }
                }
                
                progress?.Report(50);

                cancellationToken.ThrowIfCancellationRequested();

                // 5.5 e 5.6: CPU e GPU já otimizados pelo PreOptimizer (FASE 0)
                // As opções OptimizeCpu/OptimizeGpu controlam se o PreOptimizer aplica ou não
                // (ver PrepareSystemForGamingAsync)

                cancellationToken.ThrowIfCancellationRequested();

                // 6. Otimizar rede (já feito pelo PreOptimizer se OptimizeNetwork=true)
                _logger.LogInfo("[Orchestrator] 🌐 [FASE 6] Rede...");
                progress?.Report(60);

                cancellationToken.ThrowIfCancellationRequested();

                // 7. Memória (já feito pelo PreOptimizer se OptimizeMemory=true)
                progress?.Report(70);

                cancellationToken.ThrowIfCancellationRequested();

                // 8. Timer resolution (já feito pelo PreOptimizer se ReduceLatency=true)
                progress?.Report(80);

                cancellationToken.ThrowIfCancellationRequested();

                // 9. Iniciar governor adaptativo
                if (_adaptiveGovernor != null && _currentOptions.EnableAntiStutter == true)
                {
                    _logger.Log(LogLevel.Info, LogCategory.Gamer, "Iniciando Adaptive Governor (Monitoramento de Stutters em tempo real).");
                    _adaptiveGovernor.Start(_activeGameProcess?.Id ?? 0, _currentOptions);
                }
                progress?.Report(90);

                cancellationToken.ThrowIfCancellationRequested();

                // 10. Iniciar otimização de troca de contexto
                if (_appSwitchCoordinator != null && _activeGameProcess != null)
                {
                    await _appSwitchCoordinator.StartAsync(_activeGameProcess.Id, cancellationToken);
                }
                
                // 11. Iniciar Overlay OSD (se habilitado)
                _logger.Log(LogLevel.Info, LogCategory.Gamer, $"[DEBUG] Verificando Overlay: _overlayService={(_overlayService != null ? "OK" : "NULL")}, _activeGameProcess={(_activeGameProcess != null ? $"PID {_activeGameProcess.Id}" : "NULL")}");
                
                if (_overlayService != null)
                {
                    _logger.Log(LogLevel.Info, LogCategory.Gamer, $"[DEBUG] Overlay Settings: IsEnabled={_overlayService.Settings.IsEnabled}");
                    
                    // CORREÇÃO: Tentar encontrar processo do jogo para o overlay
                    Process? gameProcessForOverlay = _activeGameProcess;

                    // Se não temos processo, tentar encontrar pelo gameExecutable
                    if (gameProcessForOverlay == null && !string.IsNullOrEmpty(gameExecutable))
                    {
                        var processName = Path.GetFileNameWithoutExtension(gameExecutable);
                        _logger.Log(LogLevel.Info, LogCategory.Gamer, $"[Overlay] Buscando processo pelo executável: {processName}");
                        var processes = Process.GetProcessesByName(processName);
                        if (processes.Length > 0)
                        {
                            gameProcessForOverlay = processes[0];
                            _logger.Log(LogLevel.Info, LogCategory.Gamer, $"[Overlay] ✓ Processo encontrado: {processName} (PID: {gameProcessForOverlay.Id})");
                        }
                        else
                        {
                            _logger.Log(LogLevel.Warning, LogCategory.Gamer, $"[Overlay] ✗ Processo não encontrado: {processName}");
                        }
                    }

                    // Se ainda não temos processo, tentar encontrar pelo Status.ActiveGameName
                    if (gameProcessForOverlay == null && !string.IsNullOrEmpty(Status.ActiveGameName))
                    {
                        _logger.Log(LogLevel.Info, LogCategory.Gamer, $"[Overlay] Buscando processo pelo Status: {Status.ActiveGameName}");
                        var processes = Process.GetProcessesByName(Status.ActiveGameName);
                        if (processes.Length > 0)
                        {
                            gameProcessForOverlay = processes[0];
                            _logger.Log(LogLevel.Info, LogCategory.Gamer, $"[Overlay] ✓ Processo encontrado pelo Status: {Status.ActiveGameName} (PID: {gameProcessForOverlay.Id})");
                        }
                        else
                        {
                            _logger.Log(LogLevel.Warning, LogCategory.Gamer, $"[Overlay] ✗ Processo não encontrado pelo Status: {Status.ActiveGameName}");
                        }
                    }
                    
                    if (gameProcessForOverlay != null)
                    {
                        // CORREÇÃO: Verificar IsEnabled OU AutoStartWithGamerMode
                        // Se AutoStartWithGamerMode está ativo, iniciar overlay mesmo que IsEnabled esteja false
                        bool shouldStartOverlay = _overlayService.Settings.IsEnabled || _overlayService.Settings.AutoStartWithGamerMode;
                        
                        if (shouldStartOverlay)
                        {
                            _logger.Log(LogLevel.Info, LogCategory.Gamer, $"🎮 Iniciando Overlay OSD... (IsEnabled={_overlayService.Settings.IsEnabled}, AutoStart={_overlayService.Settings.AutoStartWithGamerMode})");
                            try
                            {
                                // Se AutoStart está ativo mas IsEnabled não, habilitar temporariamente
                                if (!_overlayService.Settings.IsEnabled && _overlayService.Settings.AutoStartWithGamerMode)
                                {
                                    var settings = _overlayService.Settings;
                                    settings.IsEnabled = true;
                                    _overlayService.UpdateSettings(settings);
                                    await _overlayService.SaveSettingsAsync();
                                    _logger.Log(LogLevel.Info, LogCategory.Gamer, "[Overlay] IsEnabled ativado automaticamente via AutoStartWithGamerMode");
                                }
                                
                                var overlayStarted = await _overlayService.StartAsync(gameProcessForOverlay.Id, cancellationToken);
                                if (overlayStarted)
                                {
                                    _logger.Log(LogLevel.Success, LogCategory.Gamer, $"✅ Overlay OSD iniciado com sucesso para PID {gameProcessForOverlay.Id}!");
                                }
                                else
                                {
                                    _logger.Log(LogLevel.Warning, LogCategory.Gamer, "⚠️ Overlay OSD não pôde ser iniciado");
                                }
                            }
                            catch (Exception ex)
                            {
                                _logger.Log(LogLevel.Error, LogCategory.Gamer, $"❌ Erro ao iniciar Overlay: {ex.Message}");
                                _logger.Log(LogLevel.Error, LogCategory.Gamer, $"Stack: {ex.StackTrace}");
                            }
                        }
                        else
                        {
                            _logger.Log(LogLevel.Info, LogCategory.Gamer, "ℹ️ Overlay está desabilitado nas configurações e AutoStart não está ativo");
                        }
                    }
                    else
                    {
                        _logger.Log(LogLevel.Warning, LogCategory.Gamer, "⚠️ Nenhum processo de jogo encontrado para iniciar overlay (tentou gameExecutable e Status.ActiveGameName)");
                    }
                }
                else
                {
                    _logger.Log(LogLevel.Error, LogCategory.Gamer, "❌ OverlayService é NULL! Serviço não foi injetado corretamente!");
                }
                
                // 11.5. Rede Adaptativa (QoS DSCP + NIC Interrupt Moderation)
                if (options.EnableAdaptiveNetwork)
                {
                    _logger.LogInfo("[Orchestrator] 🌐 [FASE 11.5] Aplicando rede adaptativa (QoS DSCP + NIC low-latency)...");
                    try
                    {
                        // Aplicar QoS DSCP ao executável do jogo (prioridade EF = 46)
                        if (!string.IsNullOrEmpty(gameExecutable))
                        {
                            bool qosApplied = _networkOptimizer.ApplyQosDscp(gameExecutable, 46);
                            _auditor.LogOptimization("ADAPTIVE_NETWORK", "QosDscp", qosApplied,
                                qosApplied ? $"DSCP 46 aplicado a {Path.GetFileName(gameExecutable)}" : "Falha ao aplicar QoS");
                        }

                        // Desativar interrupt moderation da NIC para menor latência
                        bool nicOptimized = _networkOptimizer.SetNicInterruptModeration(false);
                        _auditor.LogOptimization("ADAPTIVE_NETWORK", "NicInterruptModeration", nicOptimized,
                            nicOptimized ? "Interrupt moderation desativado" : "NIC não suporta ou falha");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"[Orchestrator] ⚠️ Erro ao aplicar rede adaptativa: {ex.Message}");
                    }
                }

                // 12. Otimizar Ambiente (Silenciar Notificações, Updates)
                _logger.Log(LogLevel.Info, LogCategory.Gamer, "Silenciando ambiente (Focus Assist, Updates, Sleep)...");
                if (_immersiveOptimizer is VoltrisOptimizer.Services.Gamer.Implementation.ImmersiveEnvironmentService immersiveSvc)
                    immersiveSvc.DisableHeavyServices = options.DisableHeavyServices;
                await _immersiveOptimizer.OptimizeAsync(cancellationToken);
                
                progress?.Report(98);

                cancellationToken.ThrowIfCancellationRequested();

                UpdateStatus(s =>
                {
                    s.IsActive = true;
                    s.ActivatedAt = DateTime.Now;
                });

                var duration = DateTime.Now - startTime;
                _logger.LogSuccess("═══════════════════════════════════════════");
                _logger.LogSuccess($"✅ MODO GAMER ATIVADO em {duration.TotalMilliseconds:F0}ms");
                _logger.LogSuccess("═══════════════════════════════════════════");
                
                // ✅ CORREÇÃO CRÍTICA #7: GERAR RELATÓRIO DE AUDITORIA
                _auditor.PrintSummary();
                _auditor.SaveToFile();
                
                // TELEMETRIA SUCESSO
                if (telemetry != null)
                {
                    telemetry.TrackEvent("FEATURE_SUCCESS", "GamerMode", "Activate", 
                        durationMs: duration.TotalMilliseconds,
                        metadata: new { game = gameExecutable ?? "Global" });
                }
                
                // Exibir notificação com taxa de efetividade
                try
                {
                    var report = _auditor.GenerateReport();
                    var gameName = Status.ActiveGameName ?? "Sistema";
                    
                    if (report.EffectivenessRate >= 80)
                    {
                        NotificationManager.ShowSuccess(
                            "Modo Gamer ⚡",
                            $"Otimizações aplicadas para {gameName}. Efetividade: {report.EffectivenessRate:F0}%");
                    }
                    else if (report.EffectivenessRate >= 60)
                    {
                        NotificationManager.ShowWarning(
                            "Modo Gamer ⚠️",
                            $"Ativado para {gameName}. Efetividade: {report.EffectivenessRate:F0}% - Algumas otimizações falharam");
                    }
                    else
                    {
                        NotificationManager.ShowError(
                            "Modo Gamer Parcial",
                            $"Efetividade: {report.EffectivenessRate:F0}% - Muitas otimizações falharam. Verifique logs.");
                    }
                }
                catch { }
                
                // Registrar no Histórico
                _historyService.AddHistoryEntry(new OptimizationHistory {
                    ActionType = "Gamer Mode Activation",
                    Description = $"Modo Gamer ativado para {gameExecutable ?? "Sistema"}.",
                    Timestamp = DateTime.Now,
                    Success = true,
                    Details = new Dictionary<string, object> {
                        { "Target", gameExecutable ?? "Global" },
                        { "DurationMs", duration.TotalMilliseconds }
                    }
                });

                progress?.Report(100);

                // ✅ PERSISTIR STATE MEMORY EM DISCO (Crash Protection)
                try
                {
                    await _stateMemory.SaveToDiskAsync();
                    _logger.LogInfo("[Orchestrator] 🛡️ State Memory persistido em disco para crash recovery.");
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[Orchestrator] Falha ao persistir State Memory: {ex.Message}");
                }

                // INICIAR WATCHDOG DE INTEGRIDADE (Enterprise Pattern)
                _watchdogCts?.Cancel();
                _watchdogCts = new CancellationTokenSource();
                _ = StartIntegrityWatchdogAsync(_watchdogCts.Token);

                return true;
            }
            catch (OperationCanceledException)
            {
                _logger.Log(LogLevel.Warning, LogCategory.Gamer, "[GamerMode][Service] Ativação cancelada pelo usuário ou timeout.");
                return false;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, LogCategory.Gamer, $"[GamerMode][Service] FALHA CRÍTICA na ativação: {ex.Message}");
                _auditor.LogOptimization("ORCHESTRATOR", "ActivationFailed", false, ex.Message);
                _auditor.PrintSummary();
                _auditor.SaveToFile();
                return false;
            }
            finally
            {
                _isActivating = false;
                _activationLock.Release();
            }
        }

        /// <summary>
        /// Desativa o modo gamer e restaura configurações originais
        /// </summary>
        public async Task<bool> DeactivateAsync(
            IProgress<int>? progress = null,
            CancellationToken cancellationToken = default)
        {
            try
            {
                _logger.Log(LogLevel.Info, LogCategory.Gamer, "[GamerMode][Orchestrator] Iniciando desativação do Modo Gamer.");
                var startTime = DateTime.Now;

                // Parar Watchdog antes de qualquer restauração
                _watchdogCts?.Cancel();
                _watchdogCts?.Dispose();
                _watchdogCts = null;

                // 1. Parar otimização de troca de contexto
                _logger.LogInfo("[Orchestrator] 🔄 Restaurando Context Switching...");
                if (_appSwitchCoordinator != null)
                {
                    await _appSwitchCoordinator.StopAsync(cancellationToken);
                }
                progress?.Report(10);

                // 2. Parar governor adaptativo
                if (_adaptiveGovernor != null)
                {
                    _adaptiveGovernor.Stop();
                }
                progress?.Report(20);
                
                // 2.1 Parar Overlay OSD
                if (_overlayService != null && _overlayService.IsActive)
                {
                    _logger.Log(LogLevel.Info, LogCategory.Gamer, "Parando Overlay OSD...");
                    try
                    {
                        await _overlayService.StopAsync();
                        _logger.Log(LogLevel.Success, LogCategory.Gamer, "✅ Overlay OSD parado");
                    }
                    catch (Exception ex)
                    {
                        _logger.Log(LogLevel.Warning, LogCategory.Gamer, $"⚠️ Erro ao parar Overlay: {ex.Message}");
                    }
                }
                progress?.Report(22);

                // ✅ CORREÇÃO CRÍTICA #8: RESTAURAR USANDO PRE-OPTIMIZER
                _logger.LogInfo("[Orchestrator] 🔄 Restaurando sistema (PRE-OPTIMIZER)...");
                await _preOptimizer.RestoreSystemAsync(cancellationToken);
                progress?.Report(35);
                
                // ✅ RESTAURAR DRIVER GPU
                if (_gpuDriverInterop != null)
                {
                    _gpuDriverInterop.RestoreDefaults();
                }
                progress?.Report(38);
                
                // ✅ RESTAURAR THREAD AFFINITY
                if (_activeGameProcess != null && !_activeGameProcess.HasExited)
                {
                    _hybridCpuOptimizer.RestoreDefaultAffinity(_activeGameProcess.Id);
                }
                progress?.Report(40);
                
                // ✅ RESTAURAR WINDOWS GAME MODE
                _gameModeController.RestoreWindowsGameMode();
                progress?.Report(42);

                // 3-7. CPU, GPU, Rede, Memória e Timer já restaurados pelo PreOptimizer
                // Restaurar apenas prioridades de processos (não coberto pelo PreOptimizer)
                _processPrioritizer.RestoreAllPriorities();
                progress?.Report(55);

                // 7.1 Restaurar Ambiente
                _logger.Log(LogLevel.Info, LogCategory.Gamer, "Restaurando ambiente (Notificações, Sleep)...");
                await _immersiveOptimizer.RestoreAsync(cancellationToken);

                // 7.2 Restaurar Rede Adaptativa (QoS DSCP + NIC Interrupt Moderation)
                if (_currentOptions?.EnableAdaptiveNetwork == true)
                {
                    _logger.LogInfo("[Orchestrator] 🌐 Restaurando rede adaptativa...");
                    try
                    {
                        // Remover QoS DSCP do executável do jogo
                        if (!string.IsNullOrEmpty(_activeGameExecutablePath))
                        {
                            _networkOptimizer.RemoveQosDscp(_activeGameExecutablePath);
                        }

                        // Restaurar interrupt moderation da NIC
                        _networkOptimizer.SetNicInterruptModeration(true);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"[Orchestrator] ⚠️ Erro ao restaurar rede adaptativa: {ex.Message}");
                    }
                }

                // ✅ RESTAURAR NOVOS MÓDULOS (ordem LIFO)
                var revertCtx = BuildMinimalSessionContext();
                await _visualOptimizer.RevertAsync(revertCtx, cancellationToken);
                await _uwpModule.RevertAsync(revertCtx, cancellationToken);
                await _wallpaperModule.RevertAsync(revertCtx, cancellationToken);
                if (_currentOptions?.DisableHpet == true)
                {
                    await Task.Run(() => _hpetController.RestoreHpet(), cancellationToken);
                }

                progress?.Report(75);

                // 8. Atualizar status
                var gameName = Status.ActiveGameName;
                UpdateStatus(s =>
                {
                    s.IsActive = false;
                    s.EndTime = DateTime.Now;
                    s.Duration = s.EndTime - s.ActivatedAt;
                    s.ActiveGameName = null;
                    s.ActiveGameProcessId = 0;
                });

                // LIBERAÇÃO DE HANDLE DO PROCESSO (Enterprise Hardening)
                if (_activeGameProcess != null)
                {
                    try 
                    { 
                        _activeGameProcess.EnableRaisingEvents = false;
                        _activeGameProcess.Exited -= OnProcessExited;
                        _activeGameProcess.Dispose(); 
                    } 
                    catch { }
                    _activeGameProcess = null;
                    _activeGameExecutablePath = null;
                }
                
                // CORREÇÃO CRÍTICA: Limpar PID do jogo no DynamicLoadStabilizer
                // Isso garante que o StabilityAgent volte ao modo global
                if (_dynamicLoadStabilizer != null)
                {
                    _logger.LogInfo("[Orchestrator] 🛡️ Limpando proteção de jogo no StabilityAgent");
                    await _dynamicLoadStabilizer.StartAsync(null, cancellationToken);
                }
                
                // 9. Limpar estado de restauração
                ClearRestorationState();

                _isManualActivation = false; // Resetar flag de ativação manual
                progress?.Report(80);

                var duration = DateTime.Now - startTime;
                _logger.Log(LogLevel.Success, LogCategory.Gamer, $"[GamerMode][Service] Modo Gamer DESATIVADO com sucesso em {duration.TotalMilliseconds:F0}ms.");
                
                // Limpar no histórico
                _historyService.AddHistoryEntry(new OptimizationHistory {
                    ActionType = "Gamer Mode Deactivation",
                    Description = $"Sessão gamer encerrada para {gameName ?? "Sistema"}.",
                    Timestamp = DateTime.Now,
                    Success = true,
                    Details = new Dictionary<string, object> {
                        { "Game", gameName ?? "N/A" },
                        { "TotalDuration", duration.TotalSeconds }
                    }
                });

                // 10. Restaurar fluidez do SO (SaaS Revert)
                try { _stabilityEngine.RevertSmoothness(); } catch { }

                progress?.Report(100);

                return true;
            }
            catch (OperationCanceledException)
            {
                // Cancelamento normal durante desativação — não é falha crítica
                _logger.Log(LogLevel.Info, LogCategory.Gamer, "[GamerMode][Service] Desativação concluída (operação cancelada graciosamente).");
                
                // Garantir limpeza de estado mesmo com cancelamento
                UpdateStatus(s =>
                {
                    s.IsActive = false;
                    s.EndTime = DateTime.Now;
                    s.ActiveGameName = null;
                    s.ActiveGameProcessId = 0;
                });
                ClearRestorationState();
                _isManualActivation = false;
                
                return true;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, LogCategory.Gamer, $"[GamerMode][Service] FALHA CRÍTICA na desativação: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Cria um contexto de sessão para os módulos de otimização.
        /// ✅ FIX BUG #3: Usa _sessionRollbackRegistry compartilhado por toda a sessão,
        /// garantindo que ApplyAsync e RevertAsync dos módulos operem sobre o mesmo registry.
        /// </summary>
        private VoltrisOptimizer.Services.Gamer.OptimizationModules.GamerSessionContext BuildMinimalSessionContext()
        {
            _logger.LogInfo($"[Orchestrator][SessionCtx] Construindo contexto de sessão — RollbackRegistry instância #{_sessionRollbackRegistry.GetHashCode()}");
            return new VoltrisOptimizer.Services.Gamer.OptimizationModules.GamerSessionContext
            {
                Logger = _logger,
                RollbackRegistry = _sessionRollbackRegistry
            };
        }

        private void UpdateStatus(Action<Models.GamerModeStatus> updateAction)
        {
            var oldState = Status.IsActive;
            lock (_statusLock)
            {
                updateAction(_status);
            }
            var newState = Status.IsActive;
            
            if (oldState != newState)
            {
                _logger.Log(LogLevel.Info, LogCategory.Gamer, $"[GamerMode][Service] Estado alterado: {oldState} → {newState} (ActiveGame: {Status.ActiveGameName ?? "N/A"})");
            }
            
            StatusChanged?.Invoke(this, _status);
        }

        public void Dispose()
        {
            StopAutoPilot();
            _watchdogCts?.Cancel();
            _watchdogCts?.Dispose();

            if (IsActive)
            {
                // Desativação síncrona com timeout curto.
                // ExitApplication já tenta desativar — este é fallback via ServiceProvider.Dispose().
                try
                {
                    using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(3));
                    Task.Run(async () => await DeactivateAsync(cancellationToken: cts.Token))
                        .GetAwaiter().GetResult();
                }
                catch { }
            }
        }
        
        /// <summary>
        /// Obtém as opções atuais de otimização
        /// </summary>
        public Models.GamerOptimizationOptions GetCurrentOptions()
        {
            return _currentOptions;
        }
        
        /// <summary>
        /// Define as opções de otimização
        /// </summary>
        public void SetOptions(Models.GamerOptimizationOptions options)
        {
            _currentOptions = options;
        }

        public async Task ApplyPersistentOptimizationsAsync(Models.GamerOptimizationOptions options, CancellationToken cancellationToken = default)
        {
            await Task.Run(async () => {

                _logger.LogInfo("═══════════════════════════════════════════");
                _logger.LogInfo("🛡️ [ORCHESTRATOR] APLICANDO TWEAKS PERSISTENTES (Registro)");
                _logger.LogInfo("═══════════════════════════════════════════");
                var startTime = DateTime.Now;

                // 1. Windows Game Mode
                if (options.EnableGameMode)
                {
                    try
                    {
                        _logger.Log(LogLevel.Info, LogCategory.Gamer, "Habilitando Windows Game Mode (Registro)...");
                        using var gameBarKey = Microsoft.Win32.Registry.CurrentUser.CreateSubKey(@"SOFTWARE\Microsoft\GameBar", true);
                        gameBarKey?.SetValue("AllowAutoGameMode", 1, Microsoft.Win32.RegistryValueKind.DWord);
                        gameBarKey?.SetValue("AutoGameModeEnabled", 1, Microsoft.Win32.RegistryValueKind.DWord);
                        using var gameConfigKey = Microsoft.Win32.Registry.CurrentUser.CreateSubKey(@"System\GameConfigStore", true);
                        gameConfigKey?.SetValue("GameDVR_Enabled", 1, Microsoft.Win32.RegistryValueKind.DWord);
                    }
                    catch (Exception ex) { _logger.Log(LogLevel.Warning, LogCategory.Gamer, $"Falha ao configurar Game Mode: {ex.Message}"); }
                }

                // 2. FPS Boost (GameDVR + HAGS)
                if (options.ApplyFpsBoost)
                {
                    try
                    {
                        _logger.Log(LogLevel.Info, LogCategory.Gamer, "Aplicando FPS Boost (Otimizações de latência e GPU)...");
                        using var gameDvrKey = Microsoft.Win32.Registry.CurrentUser.CreateSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\GameDVR", true);
                        gameDvrKey?.SetValue("AppCaptureEnabled", 0, Microsoft.Win32.RegistryValueKind.DWord);
                         using var gameConfigKey = Microsoft.Win32.Registry.CurrentUser.CreateSubKey(@"System\GameConfigStore", true);
                        gameConfigKey?.SetValue("GameDVR_Enabled", 0, Microsoft.Win32.RegistryValueKind.DWord);
                        gameConfigKey?.SetValue("GameDVR_FSEBehavior", 2, Microsoft.Win32.RegistryValueKind.DWord);
                        
                         // Habilitar HAGS (Requer Restart)
                        var gpuInfo = await _gpuOptimizer.GetGpuInfoAsync(default);
                        if (gpuInfo.SupportsHags) 
                        {
                            _logger.Log(LogLevel.Info, LogCategory.Gamer, "HGS detectado. Habilitando Hardware-Accelerated GPU Scheduling.");
                            _gpuOptimizer.SetHagsEnabled(true);
                        }
                    }
                    catch (Exception ex) { _logger.Log(LogLevel.Warning, LogCategory.Gamer, $"Falha ao aplicar FPS Boost: {ex.Message}"); }
                }

                // 3. Otimização Visual Granular — delegada ao VisualEffectsOptimizer (caminho único)
                if (options.VisualLevel != VisualOptimizationLevel.None || options.EnableExtremeMode)
                {
                    try
                    {
                        var level = options.EnableExtremeMode ? VisualOptimizationLevel.MaximumPerformance : options.VisualLevel;
                        _logger.Log(LogLevel.Info, LogCategory.Gamer, $"Configurando Efeitos Visuais via VisualEffectsOptimizer (Nível: {level})...");
                        _visualOptimizer.SetLevel(level);
                        var sessionCtx = BuildMinimalSessionContext();
                        await _visualOptimizer.ApplyAsync(sessionCtx, default);
                    }
                    catch (Exception ex) { _logger.Log(LogLevel.Warning, LogCategory.Gamer, $"Falha ao configurar Otimização Visual: {ex.Message}"); }
                }
                
                var duration = DateTime.Now - startTime;
                _logger.Log(LogLevel.Success, LogCategory.Gamer, "Otimizações persistentes aplicadas com sucesso. É necessário reiniciar o sistema para oficializar as mudanças de registro.");
                
                // Registrar no Histórico
                _historyService.AddHistoryEntry(new OptimizationHistory {
                    ActionType = "Advanced Gamer Tweaks",
                    Description = "Aplicação de otimizações de registro e sistema (Nível Profissional).",
                    Timestamp = DateTime.Now,
                    Success = true,
                    Details = new Dictionary<string, object> {
                        { "GameMode", options.EnableGameMode },
                        { "FpsBoost", options.ApplyFpsBoost },
                        { "ExtremeMode", options.EnableExtremeMode },
                        { "RequiresRestart", true }
                    }
                });
            });
        }
        
        public async Task RevertPersistentOptimizationsAsync()
        {
             await Task.Run(async () => {
                _logger.Log(LogLevel.Info, LogCategory.Gamer, "Iniciando reversão total das otimizações persistentes...");
                try 
                {
                    // Restore Game Mode
                    _logger.Log(LogLevel.Info, LogCategory.Gamer, "Restaurando configurações do Windows Game Mode...");
                     using var gameBarKey = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(@"SOFTWARE\Microsoft\GameBar", true);
                    if (gameBarKey != null) { gameBarKey.DeleteValue("AllowAutoGameMode", false); gameBarKey.DeleteValue("AutoGameModeEnabled", false); }

                    // Restore Visuals — delegado ao VisualEffectsOptimizer (restauração completa)
                    _logger.Log(LogLevel.Info, LogCategory.Gamer, "Restaurando efeitos visuais via VisualEffectsOptimizer...");
                    var revertCtx = BuildMinimalSessionContext();
                    await _visualOptimizer.RevertAsync(revertCtx, default);
                    
                    // Disable HAGS
                    _logger.Log(LogLevel.Info, LogCategory.Gamer, "Desabilitando HAGS...");
                     _gpuOptimizer.SetHagsEnabled(false);
                     
                     _logger.Log(LogLevel.Success, LogCategory.Gamer, "Reversão concluída. Reinicie o sistema para aplicar.");
                     
                     // Registrar no Histórico
                    _historyService.AddHistoryEntry(new OptimizationHistory {
                        ActionType = "Gamer Tweaks Reversal",
                        Description = "Reversão de todas as otimizações persistentes do modo gamer.",
                        Timestamp = DateTime.Now,
                        Success = true
                    });
                } 
                catch (Exception ex)
                {
                    _logger.Log(LogLevel.Error, LogCategory.Gamer, $"Erro durante a reversão: {ex.Message}", ex);
                }
            });
        }

        #region Safety & Restoration (Crash Protection)

        private async Task SaveRestorationStateAsync(string? gameExecutable, GamerOptimizationOptions options)
        {
            try
            {
                var state = new GamerRestorationState
                {
                    WasGamerModeActive = true,
                    ActivatedAt = DateTime.Now,
                    GameExecutable = gameExecutable,
                    Options = options
                };
                var json = System.Text.Json.JsonSerializer.Serialize(state);
                await File.WriteAllTextAsync(_restorationFilePath, json);
                _logger.LogInfo("[Orchestrator] 🛡️ Estado de restauração salvo com sucesso.");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[Orchestrator] Falha ao salvar estado de restauração: {ex.Message}");
            }
        }

        private void ClearRestorationState()
        {
            try
            {
                if (File.Exists(_restorationFilePath))
                {
                    File.Delete(_restorationFilePath);
                    _logger.LogInfo("[Orchestrator] 🛡️ Estado de restauração removido (Sessão finalizada com sucesso).");
                }
                // Limpar também o State Memory do disco
                _stateMemory.ClearDiskState();
                _stateMemory.Clear();
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[Orchestrator] Falha ao remover estado de restauração: {ex.Message}");
            }
        }

        public async Task<bool> RestoreIfCrashedAsync()
        {
            if (!File.Exists(_restorationFilePath)) return false;

            try
            {
                var json = await File.ReadAllTextAsync(_restorationFilePath);
                var state = System.Text.Json.JsonSerializer.Deserialize<GamerRestorationState>(json);
                
                if (state == null || !state.WasGamerModeActive)
                {
                    ClearRestorationState();
                    return false;
                }

                // CORREÇÃO: Validar se realmente houve crash.
                // Se o arquivo foi criado há menos de 30 segundos, é impossível ser um crash real —
                // provavelmente é a mesma sessão que acabou de salvar o estado.
                var fileAge = DateTime.Now - state.ActivatedAt;
                if (fileAge.TotalSeconds < 30)
                {
                    _logger.LogInfo($"[Orchestrator] 🛡️ Estado de restauração encontrado mas é recente ({fileAge.TotalSeconds:F0}s). Ignorando — não é crash.");
                    ClearRestorationState();
                    return false;
                }

                _logger.LogWarning("⚠️ [ORCHESTRATOR] DETECTADO CRASH OU DESLIGAMENTO INESPERADO DURANTE MODO GAMER.");
                _logger.LogInfo("[Orchestrator] 🛡️ Iniciando rollback automático do sistema...");
                _logger.LogInfo($"[Orchestrator] Restaurando estado anterior de: {state.ActivatedAt} (idade: {fileAge.TotalMinutes:F1} min)");
                
                // ✅ CORREÇÃO: Carregar State Memory do disco para restauração fiel
                bool stateMemoryLoaded = await _stateMemory.LoadFromDiskAsync();
                if (stateMemoryLoaded)
                {
                    _logger.LogInfo("[Orchestrator] 🧠 State Memory carregado do disco — restauração será fiel ao estado original do usuário.");
                }
                else
                {
                    _logger.LogWarning("[Orchestrator] ⚠️ State Memory não encontrado no disco — restauração usará valores padrão.");
                }

                // Restaurar opções para que DeactivateAsync saiba o que reverter
                _currentOptions = state.Options;
                _activeGameExecutablePath = state.GameExecutable;

                await DeactivateAsync();
                _logger.LogSuccess("[Orchestrator] ✅ Sistema restaurado com sucesso após crash.");
                
                ClearRestorationState();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[Orchestrator] Falha crítica ao restaurar após crash: {ex.Message}", ex);
                return false;
            }
        }

        #endregion

        private async Task StartIntegrityWatchdogAsync(CancellationToken token)
        {
            try
            {
                while (!token.IsCancellationRequested)
                {
                    await Task.Delay(TimeSpan.FromSeconds(30), token);
                    if (!IsActive) break;
                    var gameName = Status.ActiveGameName;
                    if (!string.IsNullOrEmpty(gameName))
                    {
                        var procs = Process.GetProcessesByName(gameName);
                        if (procs.Length == 0) { _ = DeactivateAsync(); break; }
                        foreach (var p in procs) {
                            try { if (p.PriorityClass != ProcessPriorityClass.High) p.PriorityClass = ProcessPriorityClass.High; } catch {}
                            p.Dispose();
                        }
                    }
                }
            }
            catch (OperationCanceledException) { }
            catch (Exception ex) { _logger.LogError($"[Orchestrator] Watchdog error: {ex.Message}"); }
        }

    }
}