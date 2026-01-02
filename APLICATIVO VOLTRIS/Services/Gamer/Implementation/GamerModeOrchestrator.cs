using System;
using System.Diagnostics;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using VoltrisOptimizer.Services.Gamer.Models;

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
        private readonly AppSwitchOptimizationCoordinator? _appSwitchCoordinator; // Coordenador de app-switching
        
        private Models.GamerModeStatus _status = new();
        private Models.GamerOptimizationOptions _currentOptions = new();
        private Process? _activeGameProcess;
        private readonly object _statusLock = new();

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
            ITimerResolutionService? timerService = null,
            IAdaptiveGovernor? adaptiveGovernor = null,
            AppSwitchOptimizationCoordinator? appSwitchCoordinator = null) // Novo parâmetro
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
            _appSwitchCoordinator = appSwitchCoordinator; // Nova atribuição
        }

        /// <summary>
        /// Ativa o modo gamer com todas as otimizações
        /// </summary>
        public async Task<bool> ActivateAsync(
            Models.GamerOptimizationOptions options,
            string? gameExecutable = null,
            IProgress<int>? progress = null,
            CancellationToken cancellationToken = default)
        {
            try
            {
                // CORREÇÃO: Validar opções
                if (options == null)
                {
                    _logger.LogError("[Orchestrator] Opções de otimização são nulas");
                    return false;
                }

                _logger.LogInfo("[Orchestrator] Iniciando modo gamer...");
                
                _currentOptions = options;

                // 1. Detectar hardware
                var hardware = await _hardwareDetector.GetCapabilitiesAsync(cancellationToken);
                _logger.LogInfo($"[Orchestrator] Hardware: {hardware.CpuName}, {hardware.PrimaryGpu.Name}, {hardware.TotalRamGb}GB RAM");
                progress?.Report(10);

                cancellationToken.ThrowIfCancellationRequested();

                // 2. Fechar processos desnecessários
                if (options.CloseBackgroundApps == true)
                {
                    _processPrioritizer.CloseUnnecessaryProcesses();
                }
                progress?.Report(20);

                // 3. Detectar e priorizar processo do jogo
                if (!string.IsNullOrEmpty(gameExecutable))
                {
                    var processName = Path.GetFileNameWithoutExtension(gameExecutable);
                    var processes = Process.GetProcessesByName(processName);
                    
                    if (processes.Length > 0)
                    {
                        _activeGameProcess = processes[0];
                        _processPrioritizer.SetPriority(_activeGameProcess.Id, ProcessPriorityLevel.High);
                        
                        UpdateStatus(s =>
                        {
                            s.ActiveGameName = processName;
                            s.ActiveGameProcessId = _activeGameProcess.Id;
                        });
                    }
                }
                progress?.Report(30);

                cancellationToken.ThrowIfCancellationRequested();

                // 4. Otimizar CPU
                await _cpuOptimizer.OptimizeAsync(cancellationToken);
                progress?.Report(40);

                cancellationToken.ThrowIfCancellationRequested();

                // 5. Otimizar GPU
                await _gpuOptimizer.OptimizeAsync(cancellationToken);
                progress?.Report(50);

                cancellationToken.ThrowIfCancellationRequested();

                // 6. Otimizar rede
                if (options.OptimizeNetwork == true)
                {
                    await _networkOptimizer.OptimizeAsync(cancellationToken);
                }
                progress?.Report(60);

                cancellationToken.ThrowIfCancellationRequested();

                // 7. Otimizar memória
                if (options.OptimizeMemory == true)
                {
                    _memoryOptimizer.CleanStandbyList();
                }
                progress?.Report(70);

                cancellationToken.ThrowIfCancellationRequested();

                // 7.5. Habilitar Windows Game Mode (se solicitado)
                if (options.EnableGameMode == true)
                {
                    try
                    {
                        using var gameBarKey = Microsoft.Win32.Registry.CurrentUser.CreateSubKey(
                            @"SOFTWARE\Microsoft\GameBar", true);
                        gameBarKey?.SetValue("AllowAutoGameMode", 1, Microsoft.Win32.RegistryValueKind.DWord);
                        gameBarKey?.SetValue("AutoGameModeEnabled", 1, Microsoft.Win32.RegistryValueKind.DWord);
                        
                        using var gameConfigKey = Microsoft.Win32.Registry.CurrentUser.CreateSubKey(
                            @"System\GameConfigStore", true);
                        gameConfigKey?.SetValue("GameDVR_Enabled", 1, Microsoft.Win32.RegistryValueKind.DWord);
                        
                        _logger.LogInfo("[Orchestrator] Windows Game Mode habilitado");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"[Orchestrator] Erro ao habilitar Game Mode: {ex.Message}");
                    }
                }

                cancellationToken.ThrowIfCancellationRequested();

                // 7.6. Aplicar FPS Boost (se solicitado)
                if (options.ApplyFpsBoost == true)
                {
                    try
                    {
                        // Desativar GameDVR (causa overhead)
                        using var gameDvrKey = Microsoft.Win32.Registry.CurrentUser.CreateSubKey(
                            @"SOFTWARE\Microsoft\Windows\CurrentVersion\GameDVR", true);
                        gameDvrKey?.SetValue("AppCaptureEnabled", 0, Microsoft.Win32.RegistryValueKind.DWord);
                        
                        using var gameConfigKey = Microsoft.Win32.Registry.CurrentUser.CreateSubKey(
                            @"System\GameConfigStore", true);
                        gameConfigKey?.SetValue("GameDVR_Enabled", 0, Microsoft.Win32.RegistryValueKind.DWord);
                        gameConfigKey?.SetValue("GameDVR_FSEBehavior", 2, Microsoft.Win32.RegistryValueKind.DWord);
                        
                        // Habilitar HAGS se disponível
                        var gpuInfo = await _gpuOptimizer.GetGpuInfoAsync(cancellationToken);
                        if (gpuInfo.SupportsHags)
                        {
                            _gpuOptimizer.SetHagsEnabled(true);
                        }
                        
                        _logger.LogInfo("[Orchestrator] FPS Boost aplicado");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"[Orchestrator] Erro ao aplicar FPS Boost: {ex.Message}");
                    }
                }

                cancellationToken.ThrowIfCancellationRequested();

                // 7.7. Aplicar Modo Extremo (se solicitado)
                if (options.EnableExtremeMode == true)
                {
                    try
                    {
                        // Desativar todas as otimizações visuais do Windows
                        using var visualKey = Microsoft.Win32.Registry.CurrentUser.CreateSubKey(
                            @"Control Panel\Desktop", true);
                        visualKey?.SetValue("UserPreferencesMask", 
                            new byte[] { 0x90, 0x12, 0x01, 0x80, 0x10, 0x00, 0x00, 0x00 }, 
                            Microsoft.Win32.RegistryValueKind.Binary);

                        // Desativar animações
                        using var animKey = Microsoft.Win32.Registry.CurrentUser.CreateSubKey(
                            @"Control Panel\Desktop\WindowMetrics", true);
                        animKey?.SetValue("MinAnimate", "0", Microsoft.Win32.RegistryValueKind.String);

                        // Desativar efeitos visuais
                        using var effectsKey = Microsoft.Win32.Registry.CurrentUser.CreateSubKey(
                            @"Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects", true);
                        effectsKey?.SetValue("VisualFXSetting", 2, Microsoft.Win32.RegistryValueKind.DWord);

                        _logger.LogInfo("[Orchestrator] Modo Extremo aplicado");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"[Orchestrator] Erro ao aplicar Modo Extremo: {ex.Message}");
                    }
                }

                cancellationToken.ThrowIfCancellationRequested();

                // 8. Configurar timer resolution
                if (_timerService != null && options.ReduceLatency == true)
                {
                    _timerService.SetMaximumResolution();
                }
                progress?.Report(80);

                cancellationToken.ThrowIfCancellationRequested();

                // 9. Iniciar governor adaptativo
                if (_adaptiveGovernor != null && _currentOptions.EnableAntiStutter == true)
                {
                    _adaptiveGovernor.Start(_activeGameProcess?.Id ?? 0, _currentOptions);
                }
                progress?.Report(90);

                cancellationToken.ThrowIfCancellationRequested();

                // 10. Iniciar otimização de troca de contexto
                if (_appSwitchCoordinator != null && _activeGameProcess != null)
                {
                    await _appSwitchCoordinator.StartAsync(_activeGameProcess.Id, cancellationToken);
                }
                progress?.Report(95);

                cancellationToken.ThrowIfCancellationRequested();

                // 11. Atualizar status final
                UpdateStatus(s =>
                {
                    s.IsActive = true;
                    s.ActivatedAt = DateTime.Now;
                });

                _logger.LogSuccess("[Orchestrator] Modo gamer ativado com sucesso!");
                progress?.Report(100);

                return true;
            }
            catch (OperationCanceledException)
            {
                _logger.LogWarning("[Orchestrator] Ativação cancelada pelo usuário");
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[Orchestrator] Erro ao ativar modo gamer: {ex.Message}", ex);
                return false;
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
                _logger.LogInfo("[Orchestrator] Desativando modo gamer...");

                // 1. Parar otimização de troca de contexto
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

                // 3. Restaurar timer resolution
                if (_timerService != null)
                {
                    _timerService.ReleaseResolution();
                }
                progress?.Report(30);

                // 4. Restaurar prioridades de processos
                _processPrioritizer.RestoreAllPriorities();
                progress?.Report(40);

                // 5. Restaurar otimizações de rede
                await _networkOptimizer.RestoreAsync(cancellationToken);
                progress?.Report(50);

                // 6. Restaurar otimizações de GPU
                await _gpuOptimizer.RestoreAsync(cancellationToken);
                progress?.Report(60);

                // 7. Restaurar otimizações de CPU
                await _cpuOptimizer.RestoreAsync(cancellationToken);
                progress?.Report(70);

                // 7.5. Restaurar Windows Game Mode
                try
                {
                    using var gameBarKey = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(
                        @"SOFTWARE\Microsoft\GameBar", true);
                    if (gameBarKey != null)
                    {
                        gameBarKey.DeleteValue("AllowAutoGameMode", false);
                        gameBarKey.DeleteValue("AutoGameModeEnabled", false);
                    }
                    
                    _logger.LogInfo("[Orchestrator] Windows Game Mode restaurado");
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[Orchestrator] Erro ao restaurar Game Mode: {ex.Message}");
                }
                progress?.Report(75);

                // 8. Atualizar status
                UpdateStatus(s =>
                {
                    s.IsActive = false;
                    s.EndTime = DateTime.Now;
                    s.Duration = s.EndTime - s.ActivatedAt;
                    s.ActiveGameName = null;
                    s.ActiveGameProcessId = 0;
                });
                progress?.Report(80);

                _logger.LogSuccess("[Orchestrator] Modo gamer desativado com sucesso!");
                progress?.Report(100);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[Orchestrator] Erro ao desativar modo gamer: {ex.Message}", ex);
                return false;
            }
        }

        private void UpdateStatus(Action<Models.GamerModeStatus> updateAction)
        {
            lock (_statusLock)
            {
                updateAction(_status);
            }
            StatusChanged?.Invoke(this, _status);
        }

        public void Dispose()
        {
            if (IsActive)
            {
                // CORREÇÃO CRÍTICA #5: NÃO usar .Result - usar fire-and-forget com timeout
                // .Result bloqueia thread e pode causar deadlock se chamado da UI thread
                _ = Task.Run(async () =>
                {
                    try
                    {
                        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(5));
                        await DeactivateAsync(cancellationToken: cts.Token);
                    }
                    catch (OperationCanceledException)
                    {
                        _logger.LogWarning("[Orchestrator] Timeout ao desativar durante Dispose");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"[Orchestrator] Erro ao desativar durante Dispose: {ex.Message}", ex);
                    }
                });
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
    }
}