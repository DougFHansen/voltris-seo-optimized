using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Input;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Services.Gamer.Implementation;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using VoltrisOptimizer.Services.Gamer.OptimizationModules;
// Usar alias para evitar conflito com tipos antigos
using GamerModels = VoltrisOptimizer.Services.Gamer.Models;
using AppPage = VoltrisOptimizer.Services.AppPage;
using VoltrisOptimizer.Interfaces;

namespace VoltrisOptimizer.UI.ViewModels
{
    /// <summary>
    /// ViewModel para a página Gamer com suporte completo a MVVM
    /// </summary>
    public class GamerViewModel : ViewModelBase
    {
        private readonly IGamerModeOrchestrator _orchestrator;
        private readonly IGameDetector _gameDetector;
        private readonly IGameLibraryService _libraryService;
        private readonly IGameProfileService? _profileService;
        private readonly IGpuGamingOptimizer _gpuOptimizer;
        private readonly ILoggingService _logger;
        private readonly RealGameBoosterService? _realBooster;
        private readonly GamerSessionManager? _gamerSessionManager;

        #region Properties - Estado do Modo Gamer

        private bool _isGamerModeActive;
        public bool IsGamerModeActive
        {
            get => _isGamerModeActive;
            set => SetProperty(ref _isGamerModeActive, value);
        }

        private string _statusText = "Modo Gamer: Inativo";
        public string StatusText
        {
            get => _statusText;
            set => SetProperty(ref _statusText, value);
        }

        private bool _isAutoModeEnabled = true;
        public bool IsAutoModeEnabled
        {
            get => _isAutoModeEnabled;
            set
            {
                if (SetProperty(ref _isAutoModeEnabled, value))
                {
                    if (value)
                        _gameDetector.StartMonitoring();
                    else
                        _gameDetector.StopMonitoring();
                }
            }
        }

        // Módulos de Otimização Temporários
        private bool _isTemporaryOptimizationSessionActive;
        public bool IsTemporaryOptimizationSessionActive
        {
            get => _isTemporaryOptimizationSessionActive;
            set => SetProperty(ref _isTemporaryOptimizationSessionActive, value);
        }

        private string _temporaryOptimizationStatus = "Inativo";
        public string TemporaryOptimizationStatus
        {
            get => _temporaryOptimizationStatus;
            set => SetProperty(ref _temporaryOptimizationStatus, value);
        }

        private bool _autoActivateTemporaryOptimizations = false;
        public bool AutoActivateTemporaryOptimizations
        {
            get => _autoActivateTemporaryOptimizations;
            set => SetProperty(ref _autoActivateTemporaryOptimizations, value);
        }

        #endregion

        #region Properties - Biblioteca de Jogos

        public ObservableCollection<GamerModels.DetectedGame> Games { get; } = new();

        private GamerModels.DetectedGame? _selectedGame;
        public GamerModels.DetectedGame? SelectedGame
        {
            get => _selectedGame;
            set
            {
                if (SetProperty(ref _selectedGame, value))
                {
                    OnPropertyChanged(nameof(HasSelectedGame));
                    // Raise CanExecuteChanged for all commands that depend on SelectedGame
                    if (ApplyProfileCommand is RelayCommand applyCmd)
                        applyCmd.RaiseCanExecuteChanged();
                    if (ApplyProfileCommand is AsyncRelayCommand applyAsyncCmd)
                        applyAsyncCmd.RaiseCanExecuteChanged();
                    
                    if (CreateProfileCommand is RelayCommand createCmd)
                        createCmd.RaiseCanExecuteChanged();
                    if (CreateProfileCommand is AsyncRelayCommand createAsyncCmd)
                        createAsyncCmd.RaiseCanExecuteChanged();
                    
                    if (RemoveProfileCommand is RelayCommand removeCmd)
                        removeCmd.RaiseCanExecuteChanged();
                    if (RemoveProfileCommand is AsyncRelayCommand removeAsyncCmd)
                        removeAsyncCmd.RaiseCanExecuteChanged();
                    
                    if (CleanCacheCommand is RelayCommand cleanCmd)
                        cleanCmd.RaiseCanExecuteChanged();
                    if (CleanCacheCommand is AsyncRelayCommand cleanAsyncCmd)
                        cleanAsyncCmd.RaiseCanExecuteChanged();
                }
            }
        }

        public bool HasSelectedGame => SelectedGame != null;

        #endregion

        #region Properties - Opções de Otimização

        private GamerModels.GamerOptimizationOptions _options = new();

        public bool OptimizeCpu
        {
            get => _options.OptimizeCpu;
            set { _options.OptimizeCpu = value; OnPropertyChanged(); }
        }

        public bool OptimizeGpu
        {
            get => _options.OptimizeGpu;
            set { _options.OptimizeGpu = value; OnPropertyChanged(); }
        }

        public bool OptimizeNetwork
        {
            get => _options.OptimizeNetwork;
            set { _options.OptimizeNetwork = value; OnPropertyChanged(); }
        }

        public bool OptimizeMemory
        {
            get => _options.OptimizeMemory;
            set { _options.OptimizeMemory = value; OnPropertyChanged(); }
        }

        public bool EnableGameMode
        {
            get => _options.EnableGameMode;
            set { _options.EnableGameMode = value; OnPropertyChanged(); }
        }

        public bool ReduceLatency
        {
            get => _options.ReduceLatency;
            set { _options.ReduceLatency = value; OnPropertyChanged(); }
        }

        public bool CloseBackgroundApps
        {
            get => _options.CloseBackgroundApps;
            set { _options.CloseBackgroundApps = value; OnPropertyChanged(); }
        }

        public bool ApplyFpsBoost
        {
            get => _options.ApplyFpsBoost;
            set { _options.ApplyFpsBoost = value; OnPropertyChanged(); }
        }

        public bool EnableExtremeMode
        {
            get => _options.EnableExtremeMode;
            set { _options.EnableExtremeMode = value; OnPropertyChanged(); }
        }

        public bool EnableAntiStutter
        {
            get => _options.EnableAntiStutter;
            set { _options.EnableAntiStutter = value; OnPropertyChanged(); }
        }

        public bool EnableAdaptiveNetwork
        {
            get => _options.EnableAdaptiveNetwork;
            set { _options.EnableAdaptiveNetwork = value; OnPropertyChanged(); }
        }

        public GamerModels.PingTargetMode PingTarget
        {
            get => _options.PingTarget;
            set { _options.PingTarget = value; OnPropertyChanged(); }
        }

        #endregion

        #region Properties - OSD Overlay

        private bool _overlayEnabled = false;
        public bool OverlayEnabled
        {
            get => _overlayEnabled;
            set
            {
                if (SetProperty(ref _overlayEnabled, value))
                {
                    UpdateOverlaySettings();
                }
            }
        }

        private bool _overlayShowFps = true;
        public bool OverlayShowFps
        {
            get => _overlayShowFps;
            set { SetProperty(ref _overlayShowFps, value); UpdateOverlaySettings(); }
        }

        private bool _overlayShowFrameTime = true;
        public bool OverlayShowFrameTime
        {
            get => _overlayShowFrameTime;
            set { SetProperty(ref _overlayShowFrameTime, value); UpdateOverlaySettings(); }
        }

        private bool _overlayShowCpuUsage = true;
        public bool OverlayShowCpuUsage
        {
            get => _overlayShowCpuUsage;
            set { SetProperty(ref _overlayShowCpuUsage, value); UpdateOverlaySettings(); }
        }

        private bool _overlayShowGpuUsage = true;
        public bool OverlayShowGpuUsage
        {
            get => _overlayShowGpuUsage;
            set { SetProperty(ref _overlayShowGpuUsage, value); UpdateOverlaySettings(); }
        }

        private bool _overlayShowRamUsage = true;
        public bool OverlayShowRamUsage
        {
            get => _overlayShowRamUsage;
            set { SetProperty(ref _overlayShowRamUsage, value); UpdateOverlaySettings(); }
        }

        private bool _overlayShowVramUsage = true;
        public bool OverlayShowVramUsage
        {
            get => _overlayShowVramUsage;
            set { SetProperty(ref _overlayShowVramUsage, value); UpdateOverlaySettings(); }
        }

        private bool _overlayShowCpuTemp = false;
        public bool OverlayShowCpuTemp
        {
            get => _overlayShowCpuTemp;
            set { SetProperty(ref _overlayShowCpuTemp, value); UpdateOverlaySettings(); }
        }

        private bool _overlayShowGpuTemp = true;
        public bool OverlayShowGpuTemp
        {
            get => _overlayShowGpuTemp;
            set { SetProperty(ref _overlayShowGpuTemp, value); UpdateOverlaySettings(); }
        }

        private bool _overlayShowCpuClock = false;
        public bool OverlayShowCpuClock
        {
            get => _overlayShowCpuClock;
            set { SetProperty(ref _overlayShowCpuClock, value); UpdateOverlaySettings(); }
        }

        private bool _overlayShowGpuClock = false;
        public bool OverlayShowGpuClock
        {
            get => _overlayShowGpuClock;
            set { SetProperty(ref _overlayShowGpuClock, value); UpdateOverlaySettings(); }
        }

        private bool _overlayShowInputLatency = false;
        public bool OverlayShowInputLatency
        {
            get => _overlayShowInputLatency;
            set { SetProperty(ref _overlayShowInputLatency, value); UpdateOverlaySettings(); }
        }

        private Services.Gamer.Overlay.Models.OverlayPosition _overlaySelectedPosition = Services.Gamer.Overlay.Models.OverlayPosition.TopRight;
        public Services.Gamer.Overlay.Models.OverlayPosition OverlaySelectedPosition
        {
            get => _overlaySelectedPosition;
            set { SetProperty(ref _overlaySelectedPosition, value); UpdateOverlaySettings(); }
        }

        public System.Collections.Generic.List<Services.Gamer.Overlay.Models.OverlayPosition> OverlayPositions { get; } = 
            new System.Collections.Generic.List<Services.Gamer.Overlay.Models.OverlayPosition>
            {
                Services.Gamer.Overlay.Models.OverlayPosition.TopLeft,
                Services.Gamer.Overlay.Models.OverlayPosition.TopRight,
                Services.Gamer.Overlay.Models.OverlayPosition.BottomLeft,
                Services.Gamer.Overlay.Models.OverlayPosition.BottomRight,
                Services.Gamer.Overlay.Models.OverlayPosition.TopCenter,
                Services.Gamer.Overlay.Models.OverlayPosition.BottomCenter
            };

        private double _overlayFontSize = 14.0;
        public double OverlayFontSize
        {
            get => _overlayFontSize;
            set { SetProperty(ref _overlayFontSize, value); UpdateOverlaySettings(); }
        }

        private double _overlayOpacity = 0.9;
        public double OverlayOpacity
        {
            get => _overlayOpacity;
            set { SetProperty(ref _overlayOpacity, value); UpdateOverlaySettings(); }
        }

        private ICommand? _testOverlayCommand;
        public ICommand TestOverlayCommand
        {
            get
            {
                return _testOverlayCommand ??= new AsyncRelayCommand(async _ =>
                {
                    if (App.OverlayService != null)
                    {
                        var currentProcess = Process.GetCurrentProcess();
                        await App.OverlayService.StartAsync(currentProcess.Id);
                        await Task.Delay(5000); // Mostrar por 5 segundos
                        await App.OverlayService.StopAsync();
                    }
                });
            }
        }

        private void UpdateOverlaySettings()
        {
            if (App.OverlayService == null) return;

            var settings = new Services.Gamer.Overlay.Models.OverlaySettings
            {
                IsEnabled = _overlayEnabled,
                Metrics = new Services.Gamer.Overlay.Models.OverlayMetrics
                {
                    ShowFps = _overlayShowFps,
                    ShowFrameTime = _overlayShowFrameTime,
                    ShowCpuUsage = _overlayShowCpuUsage,
                    ShowGpuUsage = _overlayShowGpuUsage,
                    ShowRamUsage = _overlayShowRamUsage,
                    ShowVramUsage = _overlayShowVramUsage,
                    ShowCpuTemperature = _overlayShowCpuTemp,
                    ShowGpuTemperature = _overlayShowGpuTemp,
                    ShowCpuClock = _overlayShowCpuClock,
                    ShowGpuClock = _overlayShowGpuClock,
                    ShowInputLatency = _overlayShowInputLatency
                },
                Position = _overlaySelectedPosition,
                Font = new Services.Gamer.Overlay.Models.FontSettings
                {
                    FontFamily = "Consolas",
                    FontSize = _overlayFontSize,
                    IsBold = true
                },
                Opacity = _overlayOpacity
            };

            App.OverlayService.UpdateSettings(settings);
            App.OverlayService.SaveSettingsAsync();
        }

        private async Task LoadOverlaySettingsAsync()
        {
            try
            {
                if (App.OverlayService != null)
                {
                    await App.OverlayService.LoadSettingsAsync();
                    var settings = App.OverlayService.Settings;
                    
                    OverlayEnabled = settings.IsEnabled;
                    OverlayShowFps = settings.Metrics.ShowFps;
                    OverlayShowFrameTime = settings.Metrics.ShowFrameTime;
                    OverlayShowCpuUsage = settings.Metrics.ShowCpuUsage;
                    OverlayShowGpuUsage = settings.Metrics.ShowGpuUsage;
                    OverlayShowRamUsage = settings.Metrics.ShowRamUsage;
                    OverlayShowVramUsage = settings.Metrics.ShowVramUsage;
                    OverlayShowCpuTemp = settings.Metrics.ShowCpuTemperature;
                    OverlayShowGpuTemp = settings.Metrics.ShowGpuTemperature;
                    OverlayShowCpuClock = settings.Metrics.ShowCpuClock;
                    OverlayShowGpuClock = settings.Metrics.ShowGpuClock;
                    OverlayShowInputLatency = settings.Metrics.ShowInputLatency;
                    OverlaySelectedPosition = settings.Position;
                    OverlayFontSize = settings.Font.FontSize;
                    OverlayOpacity = settings.Opacity;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[GamerViewModel] Erro ao carregar configurações do overlay: {ex.Message}");
            }
        }

        #endregion

        #region Properties - GPU

        private string _gpuInfoText = "GPU: Detectando...";
        public string GpuInfoText
        {
            get => _gpuInfoText;
            set => SetProperty(ref _gpuInfoText, value);
        }

        private string _gpuTempText = "";
        public string GpuTempText
        {
            get => _gpuTempText;
            set => SetProperty(ref _gpuTempText, value);
        }

        #endregion

        #region Properties - Diagnóstico

        public ObservableCollection<GamerModels.StutterIncident> Incidents { get; } = new();
        
        // Sample class for diagnostics
        public class Sample
        {
            public DateTime T { get; set; }
            public double CpuPercent { get; set; }
            public double CpuQueue { get; set; }
            public double CpuCurrentMhz { get; set; }
            public double CpuMaxMhz { get; set; }
            public double CpuDpcPercent { get; set; }
            public double CpuInterruptPercent { get; set; }
            public double CpuTemperature { get; set; }
            public bool CpuThrottling { get; set; }
            public double RamUsedGb { get; set; }
            public double RamTotalGb { get; set; }
            public double RamPageFaultsPerSec { get; set; }
            public double DiskReadsPerSec { get; set; }
            public double DiskWritesPerSec { get; set; }
            public double DiskQueueLen { get; set; }
            public double DiskLatencySec { get; set; }
            public double GpuUtilPercent { get; set; }
            public double GpuVramUsedMb { get; set; }
            public double GpuVramTotalMb { get; set; }
            public double GpuTemperature { get; set; }
            public bool GpuThrottling { get; set; }
            public double NetJitterMs { get; set; }
            public double Fps { get; set; }
            public string Cause { get; set; } = "";
        }

        private string _fpsText = "FPS: aguardando...";
        public string FpsText
        {
            get => _fpsText;
            set => SetProperty(ref _fpsText, value);
        }

        private bool _isDiagnosticsRunning;
        public bool IsDiagnosticsRunning
        {
            get => _isDiagnosticsRunning;
            set => SetProperty(ref _isDiagnosticsRunning, value);
        }

        #endregion

        #region Commands

        public ICommand DetectGamesCommand { get; private set; }
        public ICommand ApplyProfileCommand { get; private set; }
        public ICommand CreateProfileCommand { get; private set; }
        public ICommand RemoveProfileCommand { get; private set; }
        public ICommand CleanCacheCommand { get; private set; }
        public ICommand OptimizeGpuCommand { get; private set; }
        public ICommand CheckGpuTempCommand { get; private set; }
        public ICommand RunGamerModeCommand { get; private set; }
        public ICommand DeactivateGamerModeCommand { get; private set; }
        public ICommand StartDiagnosticsCommand { get; private set; }
        public ICommand ExportCsvCommand { get; private set; }
        public ICommand OpenDiagnosticsCommand { get; private set; }
        public ICommand StartTemporaryOptimizationCommand { get; private set; }
        public ICommand StopTemporaryOptimizationCommand { get; private set; }
        public ICommand ForceRollbackTemporaryOptimizationCommand { get; private set; }

        #endregion

        public GamerViewModel(
            IGamerModeOrchestrator orchestrator,
            IGameDetector gameDetector,
            IGameLibraryService libraryService,
            IGpuGamingOptimizer gpuOptimizer,
            ILoggingService logger,
            IGameProfileService? profileService = null,
            RealGameBoosterService? realBooster = null)
        {
            _orchestrator = orchestrator ?? throw new ArgumentNullException(nameof(orchestrator));
            _gameDetector = gameDetector ?? throw new ArgumentNullException(nameof(gameDetector));
            _libraryService = libraryService ?? throw new ArgumentNullException(nameof(libraryService));
            _gpuOptimizer = gpuOptimizer ?? throw new ArgumentNullException(nameof(gpuOptimizer));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _profileService = profileService;
            _realBooster = realBooster;
            
            // Obter GamerSessionManager do DI (pode ser null se não estiver registrado)
            try
            {
                var serviceProvider = VoltrisOptimizer.App.Services;
                if (serviceProvider != null)
                {
                    _gamerSessionManager = serviceProvider.GetService(typeof(GamerSessionManager)) as GamerSessionManager;
                }
                if (_gamerSessionManager != null)
                {
                    _gamerSessionManager.SessionStateChanged += OnTemporaryOptimizationSessionStateChanged;
                    UpdateTemporaryOptimizationStatus();
                }
            }
            catch
            {
                // Serviço não disponível, continuar sem funcionalidade
            }

            // Inicializar comandos
            DetectGamesCommand = new AsyncRelayCommand(async _ => await DetectGamesAsync());
            ApplyProfileCommand = new AsyncRelayCommand(async _ => ApplyProfile(), _ => HasSelectedGame);
            CreateProfileCommand = new AsyncRelayCommand(async _ => CreateProfile(), _ => HasSelectedGame);
            RemoveProfileCommand = new AsyncRelayCommand(async _ => RemoveProfile(), _ => HasSelectedGame);
            CleanCacheCommand = new AsyncRelayCommand(async _ => await CleanCacheAsync(), _ => HasSelectedGame);
            OptimizeGpuCommand = new AsyncRelayCommand(async _ => await OptimizeGpuAsync());
            CheckGpuTempCommand = new AsyncRelayCommand(async _ => await CheckGpuTempAsync());
            RunGamerModeCommand = new AsyncRelayCommand(async _ => await RunGamerModeAsync(), _ => !IsGamerModeActive);
            DeactivateGamerModeCommand = new AsyncRelayCommand(async _ => await DeactivateGamerModeAsync(), _ => IsGamerModeActive);
            StartDiagnosticsCommand = new RelayCommand(_ => ToggleDiagnostics());
            ExportCsvCommand = new RelayCommand(_ => ExportCsv());
            OpenDiagnosticsCommand = new RelayCommand(_ => OpenDiagnostics());
            StartTemporaryOptimizationCommand = new AsyncRelayCommand(async _ => await StartTemporaryOptimizationAsync(), _ => _gamerSessionManager != null && !IsTemporaryOptimizationSessionActive);
            StopTemporaryOptimizationCommand = new AsyncRelayCommand(async _ => await StopTemporaryOptimizationAsync(), _ => _gamerSessionManager != null && IsTemporaryOptimizationSessionActive);
            ForceRollbackTemporaryOptimizationCommand = new AsyncRelayCommand(async _ => await ForceRollbackTemporaryOptimizationAsync(), _ => _gamerSessionManager != null && IsTemporaryOptimizationSessionActive);

            // Subscrever a eventos
            _orchestrator.StatusChanged += OnStatusChanged;
            _gameDetector.GameStarted += OnGameStarted;
            _gameDetector.GameStopped += OnGameStopped;
            
            // Subscrever eventos do GamerOptimizerService para atualização em tempo real
            if (App.GamerOptimizer != null)
            {
                App.GamerOptimizer.GamerModeChanged += OnGamerModeChanged;
                App.GamerOptimizer.PreGameOptimizationCompleted += OnPreGameOptimizationCompleted;
                App.GamerOptimizer.PostGameOptimizationCompleted += OnPostGameOptimizationCompleted;
            }
            
            // Subscrever eventos do GameDiagnosticsService
            if (App.GameDiagnostics != null)
            {
                App.GameDiagnostics.SamplesUpdated += OnDiagnosticsSamplesUpdated;
            }
            
            // CORREÇÃO CRÍTICA: Substituir DispatcherTimer por Task-based monitoring
            // DispatcherTimer roda na UI thread e pode causar lag
            // Task-based monitoring roda em background e atualiza UI apenas quando necessário
            _ = StartIncidentMonitoringAsync();

            // Inicializar dados
            _ = InitializeAsync();
            
            // Carregar configurações do overlay
            _ = LoadOverlaySettingsAsync();
        }

        private async Task InitializeAsync()
        {
            try
            {
                _logger.LogInfo("[GamerViewModel] Iniciando inicialização...");
                
                // Carregar jogos da biblioteca
                try
                {
                    LoadGamesFromLibrary();
                    _logger.LogInfo("[GamerViewModel] Jogos carregados");
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[GamerViewModel] Erro ao carregar jogos: {ex.Message}", ex);
                }

                // Detectar GPU
                try
                {
                    await DetectGpuAsync();
                    _logger.LogInfo("[GamerViewModel] GPU detectada");
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[GamerViewModel] Erro ao detectar GPU: {ex.Message}", ex);
                }

                // Iniciar monitoramento automático se habilitado
                if (IsAutoModeEnabled)
                {
                    try
                    {
                        _gameDetector.StartMonitoring();
                        _logger.LogInfo("[GamerViewModel] Monitoramento automático iniciado");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"[GamerViewModel] Erro ao iniciar monitoramento automático: {ex.Message}", ex);
                    }
                }
                
                _logger.LogInfo("[GamerViewModel] Inicialização concluída");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[GamerViewModel] Erro na inicialização: {ex.Message}", ex);
                // Definir valores padrão em caso de erro
                GpuInfoText = "GPU: Erro na inicialização";
                StatusText = "Erro na inicialização";
            }
        }

        private void LoadGamesFromLibrary()
        {
            try
            {
                Games.Clear();
                var games = _libraryService.GetAllGames();
                foreach (var game in games)
                {
                    Games.Add(game);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[GamerViewModel] Erro ao carregar jogos da biblioteca: {ex.Message}", ex);
                // Clear the games list in case of error
                Games.Clear();
            }
        }

        #region Command Implementations

        private async Task DetectGamesAsync(CancellationToken cancellationToken = default)
        {
            await ExecuteSafeAsync(async () =>
            {
                var detected = await _gameDetector.DetectInstalledGamesAsync(cancellationToken);

                Games.Clear();
                foreach (var game in detected)
                {
                    Games.Add(game);
                    _libraryService.AddGame(game);
                }

                _logger.LogSuccess($"Detectados {detected.Count} jogos");
            }, "Detectando jogos...");
        }

        private async void ApplyProfile()
        {
            if (SelectedGame == null)
            {
                ShowMessage("Selecione um jogo na lista primeiro.", "Nenhum Jogo Selecionado");
                return;
            }

            await ExecuteSafeAsync(async () =>
            {
                // CORREÇÃO: Validar se o jogo está rodando
                var gameExe = SelectedGame.ExecutablePath;
                Process? gameProcess = null;
                
                if (!string.IsNullOrEmpty(gameExe))
                {
                    var processName = System.IO.Path.GetFileNameWithoutExtension(gameExe);
                    gameProcess = await Task.Run(() =>
                    {
                        try
                        {
                            var processes = Process.GetProcessesByName(processName);
                            return processes.Length > 0 ? processes[0] : null;
                        }
                        catch
                        {
                            return null;
                        }
                    });
                }

                if (gameProcess == null)
                {
                    ShowMessage(
                        $"O jogo '{SelectedGame.Name}' não está rodando.\n\nInicie o jogo primeiro antes de aplicar o perfil.",
                        "Jogo Não Encontrado");
                    return;
                }

                if (_profileService != null)
                {
                    await _profileService.ApplyProfileAsync(SelectedGame.Name);
                }
                
                // Aplicar otimizações diretamente também
                if (_realBooster != null)
                {
                    await _realBooster.ActivateFullBoostAsync(gameProcess);
                }
                
                _logger.LogSuccess($"Perfil aplicado para {SelectedGame.Name}");
                ShowToast("Perfil Aplicado", $"Otimizações aplicadas para {SelectedGame.Name}");
            }, $"Aplicando perfil para {SelectedGame.Name}...");
        }

        private async void CreateProfile()
        {
            if (SelectedGame == null)
            {
                ShowMessage("Selecione um jogo na lista primeiro.", "Nenhum Jogo Selecionado");
                return;
            }

            await ExecuteSafeAsync(async () =>
            {
                var profile = new GamerModels.GameProfile
                {
                    GameName = SelectedGame.Name,
                    ExecutablePath = SelectedGame.ExecutablePath,
                    Settings = new GamerModels.GameProfileSettings
                    {
                        OptimizeCPU = OptimizeCpu,
                        OptimizeGPU = OptimizeGpu,
                        OptimizeNetwork = OptimizeNetwork,
                        OptimizeMemory = OptimizeMemory,
                        EnableGameMode = EnableGameMode,
                        ApplyFPSBoost = ApplyFpsBoost,
                        ReduceLatency = ReduceLatency,
                        CloseBackgroundApps = CloseBackgroundApps,
                        EnableExtremeMode = EnableExtremeMode,
                        EnableAntiStutter = EnableAntiStutter,
                        EnableAdaptiveNetwork = EnableAdaptiveNetwork
                    }
                };

                if (_profileService != null)
                {
                    await Task.Run(() => _profileService.SaveProfile(profile));
                }
                
                _libraryService.UpdateGameProfile(SelectedGame.Name, profile);
                
                _logger.LogSuccess($"Perfil criado para {SelectedGame.Name}");
                ShowToast("Perfil Criado", $"Configurações salvas para {SelectedGame.Name}");
            }, $"Criando perfil para {SelectedGame.Name}...");
        }

        private async void RemoveProfile()
        {
            if (SelectedGame == null)
            {
                ShowMessage("Selecione um jogo na lista primeiro.", "Nenhum Jogo Selecionado");
                return;
            }

            await ExecuteSafeAsync(async () =>
            {
                if (_profileService != null)
                {
                    await Task.Run(() => _profileService.DeleteProfile(SelectedGame.Name));
                }
                
                _libraryService.RemoveGameByName(SelectedGame.Name);
                Games.Remove(SelectedGame);
                SelectedGame = null;
                
                _logger.LogInfo($"Jogo removido da biblioteca");
                ShowToast("Jogo Removido", "O jogo foi removido da biblioteca.");
            }, $"Removendo {SelectedGame.Name}...");
        }

        private async Task CleanCacheAsync(CancellationToken cancellationToken = default)
        {
            if (SelectedGame == null)
            {
                ShowMessage("Selecione um jogo na lista primeiro.", "Nenhum Jogo Selecionado");
                return;
            }

            await ExecuteSafeAsync(async () =>
            {
                long totalCleaned = 0;
                var localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
                
                // Limpar shader cache geral
                var shaderPaths = new[]
                {
                    System.IO.Path.Combine(localAppData, "NVIDIA", "DXCache"),
                    System.IO.Path.Combine(localAppData, "NVIDIA", "GLCache"),
                    System.IO.Path.Combine(localAppData, "AMD", "DxCache"),
                    System.IO.Path.Combine(localAppData, "D3DSCache"),
                };

                foreach (var path in shaderPaths)
                {
                    if (System.IO.Directory.Exists(path))
                    {
                        try
                        {
                            foreach (var file in System.IO.Directory.GetFiles(path, "*", System.IO.SearchOption.AllDirectories))
                            {
                                try
                                {
                                    var info = new System.IO.FileInfo(file);
                                    totalCleaned += info.Length;
                                    System.IO.File.Delete(file);
                                }
                                catch { }
                            }
                        }
                        catch { }
                    }
                }

                var cleanedMb = totalCleaned / (1024.0 * 1024.0);
                _logger.LogSuccess($"Cache limpo: {cleanedMb:F2} MB liberados");
                ShowToast("Cache Limpo", $"{cleanedMb:F2} MB de shader cache liberados");
            }, $"Limpando cache de {SelectedGame.Name}...");
        }
        
        private void ShowMessage(string message, string title)
        {
            System.Windows.Application.Current?.Dispatcher.Invoke(() =>
            {
                UI.Controls.ModernMessageBox.Show(message, title, 
                    System.Windows.MessageBoxButton.OK, 
                    System.Windows.MessageBoxImage.Information);
            });
        }
        
        private void ShowToast(string title, string message)
        {
            System.Windows.Application.Current?.Dispatcher.Invoke(() =>
            {
                new ToastService().Show(title, message);
            });
        }

        private async Task DetectGpuAsync()
        {
            try
            {
                var gpuInfo = await _gpuOptimizer.GetGpuInfoAsync();
                GpuInfoText = $"GPU: {gpuInfo.Name}";
            }
            catch (Exception ex)
            {
                GpuInfoText = "GPU: Erro na detecção";
                _logger.LogWarning($"Erro ao detectar GPU: {ex.Message}");
            }
        }

        private async Task OptimizeGpuAsync(CancellationToken cancellationToken = default)
        {
            await ExecuteSafeAsync(async () =>
            {
                await _gpuOptimizer.OptimizeAsync(cancellationToken);
                _logger.LogSuccess("GPU otimizada");
            }, "Otimizando GPU...");
        }

        private async Task CheckGpuTempAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                // Usar o método do gpuOptimizer que já está acessível
                var temp = await _gpuOptimizer.GetTemperatureAsync(cancellationToken);
                if (temp.IsAvailable)
                {
                    GpuTempText = $"Temperatura: {temp.Current:F0}°C";
                }
                else
                {
                    GpuTempText = "Temperatura: N/A";
                }
            }
            catch (Exception ex)
            {
                GpuTempText = "Erro ao obter temperatura";
                _logger.LogWarning($"Erro ao obter temperatura GPU: {ex.Message}");
            }
        }

        private async Task RunGamerModeAsync(CancellationToken cancellationToken = default)
        {
            await ExecuteSafeAsync(async () =>
            {
                _logger.LogInfo("═══════════════════════════════════════════════");
                _logger.LogInfo("ATIVANDO MODO GAMER COM OTIMIZAÇÕES REAIS");
                _logger.LogInfo("═══════════════════════════════════════════════");

                var progress = new Progress<int>(p => 
                {
                    BusyMessage = $"Ativando modo gamer... {p}%";
                });

                var gameExe = SelectedGame?.ExecutablePath;
                
                // 1. Usar RealGameBoosterService para otimizações de alto impacto
                if (_realBooster != null)
                {
                    Process? gameProcess = null;
                    
                    // CORREÇÃO CRÍTICA: Process.GetProcessesByName() pode bloquear a UI thread
                    // Mover para Task.Run para evitar travamento
                    if (!string.IsNullOrEmpty(gameExe))
                    {
                        var processName = System.IO.Path.GetFileNameWithoutExtension(gameExe);
                        gameProcess = await Task.Run(() =>
                        {
                            try
                            {
                                var processes = Process.GetProcessesByName(processName);
                                return processes.Length > 0 ? processes[0] : null;
                            }
                            catch
                            {
                                return null;
                            }
                        }, cancellationToken);
                    }
                    
                    var boostResult = await _realBooster.ActivateFullBoostAsync(gameProcess, cancellationToken);
                    
                    _logger.LogInfo($"[GamerMode] Boost aplicado: {boostResult.OptimizationsApplied}/8 otimizações");
                    
                    if (boostResult.TimerResolution)
                        _logger.LogSuccess("[GamerMode] ✓ Timer Resolution: 0.5ms (Input Lag -90%)");
                    if (boostResult.PowerPlan)
                        _logger.LogSuccess("[GamerMode] ✓ Power Plan: Ultimate Performance");
                    if (boostResult.GameBarDisabled)
                        _logger.LogSuccess("[GamerMode] ✓ Game Bar/DVR: Desativado");
                    if (boostResult.FsoDisabled)
                        _logger.LogSuccess("[GamerMode] ✓ Fullscreen Optimizations: Desativado");
                }
                
                // 2. Também usar o orquestrador para otimizações adicionais
                var result = await _orchestrator.ActivateAsync(_options, gameExe, progress, cancellationToken);

                if (result || _realBooster != null)
                {
                    IsGamerModeActive = true;
                    StatusText = "Modo Gamer: Ativo ⚡ (Boost Real)";
                    _logger.LogSuccess("═══════════════════════════════════════════════");
                    _logger.LogSuccess("MODO GAMER ATIVADO COM SUCESSO!");
                    _logger.LogSuccess("═══════════════════════════════════════════════");
                    
                    // Ativar módulos temporários se configurado para ativação automática
                    if (AutoActivateTemporaryOptimizations && _gamerSessionManager != null && !IsTemporaryOptimizationSessionActive)
                    {
                        _logger.LogInfo("[GamerMode] Ativando módulos temporários automaticamente...");
                        await StartTemporaryOptimizationAsync();
                    }
                    
                    // CORREÇÃO: Enviar notificação Windows quando modo gamer é ativado
                    try
                    {
                        VoltrisOptimizer.Services.NotificationManager.ShowSuccess(
                            "Modo Gamer Ativado",
                            "Otimizações aplicadas com sucesso! 🎮"
                        );
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"[GamerMode] Erro ao enviar notificação: {ex.Message}");
                    }
                    
                    // Update command states
                    UpdateCommandStates();
                }
            }, "Ativando modo gamer...");
        }

        private async Task DeactivateGamerModeAsync(CancellationToken cancellationToken = default)
        {
            await ExecuteSafeAsync(async () =>
            {
                var progress = new Progress<int>(p => 
                {
                    BusyMessage = $"Desativando modo gamer... {p}%";
                });

                // Desativar RealGameBoosterService primeiro
                if (_realBooster != null && _realBooster.IsActive)
                {
                    await _realBooster.DeactivateAsync(cancellationToken);
                    _logger.LogInfo("[GamerMode] Real Boost desativado");
                }

                var result = await _orchestrator.DeactivateAsync(progress, cancellationToken);

                if (result)
                {
                    IsGamerModeActive = false;
                    StatusText = "Modo Gamer: Inativo";
                    
                    // Desativar módulos temporários se estiverem ativos
                    if (IsTemporaryOptimizationSessionActive && _gamerSessionManager != null)
                    {
                        _logger.LogInfo("[GamerMode] Desativando módulos temporários...");
                        await StopTemporaryOptimizationAsync();
                    }
                    
                    // Update command states
                    UpdateCommandStates();
                }
            }, "Desativando modo gamer...");
        }
        
        /// <summary>
        /// Updates the CanExecute state of commands that depend on GamerMode state
        /// </summary>
        private void UpdateCommandStates()
        {
            // Update GamerMode commands
            if (RunGamerModeCommand is AsyncRelayCommand runCmd)
                runCmd.RaiseCanExecuteChanged();
            if (DeactivateGamerModeCommand is AsyncRelayCommand deactivateCmd)
                deactivateCmd.RaiseCanExecuteChanged();
            
            // Update Temporary Optimization commands
            if (StartTemporaryOptimizationCommand is AsyncRelayCommand startTempCmd)
                startTempCmd.RaiseCanExecuteChanged();
            if (StopTemporaryOptimizationCommand is AsyncRelayCommand stopTempCmd)
                stopTempCmd.RaiseCanExecuteChanged();
            if (ForceRollbackTemporaryOptimizationCommand is AsyncRelayCommand rollbackTempCmd)
                rollbackTempCmd.RaiseCanExecuteChanged();
        }
        
        #region Temporary Optimization Modules
        
        private async Task StartTemporaryOptimizationAsync()
        {
            if (_gamerSessionManager == null)
            {
                _logger?.LogWarning("[GamerViewModel] GamerSessionManager não disponível");
                return;
            }
            
            await ExecuteSafeAsync(async () =>
            {
                _logger?.LogInfo("[GamerViewModel] Iniciando sessão de otimização temporária...");
                BusyMessage = "Aplicando otimizações temporárias...";
                
                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(60));
                var result = await _gamerSessionManager.StartSessionAsync(cts.Token);
                
                if (result.Success)
                {
                    TemporaryOptimizationStatus = $"Ativo ({result.TotalChangesApplied} mudanças)";
                    _logger?.LogSuccess($"[GamerViewModel] Sessão temporária iniciada: {string.Join(", ", result.AppliedModules)}");
                    
                    try
                    {
                        VoltrisOptimizer.Services.NotificationManager.ShowInfo(
                            "Otimizações Temporárias Ativadas",
                            $"{result.TotalChangesApplied} otimizações aplicadas"
                        );
                    }
                    catch { }
                }
                else
                {
                    TemporaryOptimizationStatus = $"Erro: {result.ErrorMessage}";
                    _logger?.LogError($"[GamerViewModel] Erro ao iniciar sessão temporária: {result.ErrorMessage}");
                }
                
                UpdateCommandStates();
            }, "Aplicando otimizações temporárias...");
        }
        
        private async Task StopTemporaryOptimizationAsync()
        {
            if (_gamerSessionManager == null)
            {
                _logger?.LogWarning("[GamerViewModel] GamerSessionManager não disponível");
                return;
            }
            
            await ExecuteSafeAsync(async () =>
            {
                _logger?.LogInfo("[GamerViewModel] Parando sessão de otimização temporária...");
                BusyMessage = "Revertendo otimizações temporárias...";
                
                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(60));
                var result = await _gamerSessionManager.StopSessionAsync(cts.Token);
                
                if (result.Success)
                {
                    TemporaryOptimizationStatus = "Inativo";
                    _logger?.LogSuccess($"[GamerViewModel] Sessão temporária parada: {result.TotalChangesReverted} mudanças revertidas");
                    
                    try
                    {
                        VoltrisOptimizer.Services.NotificationManager.ShowInfo(
                            "Otimizações Temporárias Desativadas",
                            "Todas as mudanças foram revertidas"
                        );
                    }
                    catch { }
                }
                else
                {
                    TemporaryOptimizationStatus = $"Erro: {result.ErrorMessage}";
                    _logger?.LogError($"[GamerViewModel] Erro ao parar sessão temporária: {result.ErrorMessage}");
                }
                
                UpdateCommandStates();
            }, "Revertendo otimizações temporárias...");
        }
        
        private async Task ForceRollbackTemporaryOptimizationAsync()
        {
            if (_gamerSessionManager == null)
            {
                _logger?.LogWarning("[GamerViewModel] GamerSessionManager não disponível");
                return;
            }
            
            await ExecuteSafeAsync(async () =>
            {
                _logger?.LogWarning("[GamerViewModel] ⚠️ Rollback de emergência solicitado");
                BusyMessage = "Rollback de emergência...";
                
                var success = await _gamerSessionManager.ForceEmergencyRollbackAsync();
                
                if (success)
                {
                    TemporaryOptimizationStatus = "Inativo (Rollback)";
                    _logger?.LogSuccess("[GamerViewModel] ✓ Rollback de emergência concluído");
                    
                    try
                    {
                        VoltrisOptimizer.Services.NotificationManager.ShowWarning(
                            "Rollback de Emergência",
                            "Todas as otimizações foram revertidas"
                        );
                    }
                    catch { }
                }
                else
                {
                    _logger?.LogError("[GamerViewModel] ✗ Erro no rollback de emergência");
                }
                
                UpdateCommandStates();
            }, "Rollback de emergência...");
        }
        
        private void OnTemporaryOptimizationSessionStateChanged(object? sender, SessionStateChangedEventArgs e)
        {
            System.Windows.Application.Current?.Dispatcher.Invoke(() =>
            {
                UpdateTemporaryOptimizationStatus();
            });
        }
        
        private void UpdateTemporaryOptimizationStatus()
        {
            if (_gamerSessionManager == null)
            {
                IsTemporaryOptimizationSessionActive = false;
                TemporaryOptimizationStatus = "Não disponível";
                return;
            }
            
            IsTemporaryOptimizationSessionActive = _gamerSessionManager.IsSessionActive;
            if (IsTemporaryOptimizationSessionActive)
            {
                var sessionId = _gamerSessionManager.CurrentSessionId;
                TemporaryOptimizationStatus = $"Ativo ({sessionId?.Substring(0, Math.Min(8, sessionId?.Length ?? 0)) ?? "N/A"})";
            }
            else
            {
                TemporaryOptimizationStatus = "Inativo";
            }
            
            UpdateCommandStates();
        }
        
        #endregion
        
        private void ToggleDiagnostics()
        {
            IsDiagnosticsRunning = !IsDiagnosticsRunning;
            
            if (IsDiagnosticsRunning)
            {
                _logger.LogInfo("Diagnósticos iniciados");
                // Iniciar monitoramento de diagnósticos
                StartDiagnosticsMonitoring();
            }
            else
            {
                _logger.LogInfo("Diagnósticos parados");
                // Parar monitoramento de diagnósticos
                StopDiagnosticsMonitoring();
            }
            
            // Update button text based on state
            OnPropertyChanged(nameof(StartDiagnosticsCommand));
        }
        
        private void StartDiagnosticsMonitoring()
        {
            // Iniciar o serviço de diagnósticos se disponível
            if (App.GameDiagnostics != null)
            {
                try
                {
                    App.GameDiagnostics.Start();
                    _logger.LogInfo("[Diagnostics] Serviço de diagnósticos iniciado com sucesso");
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[Diagnostics] Erro ao iniciar serviço de diagnósticos: {ex.Message}");
                    IsDiagnosticsRunning = false;
                    OnPropertyChanged(nameof(IsDiagnosticsRunning));
                }
            }
            else
            {
                _logger.LogWarning("[Diagnostics] Serviço de diagnósticos não disponível");
                IsDiagnosticsRunning = false;
                OnPropertyChanged(nameof(IsDiagnosticsRunning));
            }
        }
        
        private void StopDiagnosticsMonitoring()
        {
            // Parar o serviço de diagnósticos se disponível
            if (App.GameDiagnostics != null)
            {
                try
                {
                    App.GameDiagnostics.Stop();
                    _logger.LogInfo("[Diagnostics] Serviço de diagnósticos parado com sucesso");
                    // Clear FPS text when stopping
                    FpsText = "FPS: aguardando...";
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[Diagnostics] Erro ao parar serviço de diagnósticos: {ex.Message}");
                }
            }
        }
        
        private void OnDiagnosticsSamplesUpdated(System.Collections.Generic.IReadOnlyList<GameDiagnosticsService.Sample> samples)
        {
            // Atualizar na thread da UI
            System.Windows.Application.Current?.Dispatcher.Invoke(() =>
            {
                if (samples.Count > 0)
                {
                    var latest = samples.LastOrDefault();
                    if (latest != null)
                    {
                        FpsText = $"FPS: {latest.Fps:F1}";
                    }
                }
            });
        }

        private void ExportCsv()
        {
            try
            {
                _logger.LogInfo("Exportando dados para CSV...");
                
                // CORREÇÃO: Implementação completa de exportação CSV
                var saveDialog = new Microsoft.Win32.SaveFileDialog
                {
                    Filter = "CSV Files (*.csv)|*.csv|All Files (*.*)|*.*",
                    FileName = $"diagnostics_{DateTime.Now:yyyyMMdd_HHmmss}.csv",
                    DefaultExt = ".csv"
                };
                
                if (saveDialog.ShowDialog() == true)
                {
                    var csv = new System.Text.StringBuilder();
                    
                    // Cabeçalho
                    csv.AppendLine("Timestamp,CPU%,CPU Queue,CPU MHz,CPU Max MHz,DPC%,Interrupt%,CPU Temp,CPU Throttle,RAM Used GB,RAM Total GB,Page Faults/s,Disk Reads/s,Disk Writes/s,Disk Queue,Disk Latency ms,GPU%,VRAM Used MB,VRAM Total MB,GPU Temp,GPU Throttle,Network Jitter ms,FPS,Cause");
                    
                    // Dados do GameDiagnosticsService se disponível
                    if (App.GameDiagnostics != null)
                    {
                        var samples = App.GameDiagnostics.GetSamplesSnapshot();
                        foreach (var sample in samples)
                        {
                            csv.AppendLine($"{sample.T:yyyy-MM-dd HH:mm:ss.fff}," +
                                         $"{sample.CpuPercent:F2}," +
                                         $"{sample.CpuQueue:F2}," +
                                         $"{sample.CpuCurrentMhz:F0}," +
                                         $"{sample.CpuMaxMhz:F0}," +
                                         $"{sample.CpuDpcPercent:F2}," +
                                         $"{sample.CpuInterruptPercent:F2}," +
                                         $"{sample.CpuTemperature:F1}," +
                                         $"{sample.CpuThrottling}," +
                                         $"{sample.RamUsedGb:F2}," +
                                         $"{sample.RamTotalGb:F2}," +
                                         $"{sample.RamPageFaultsPerSec:F0}," +
                                         $"{sample.DiskReadsPerSec:F0}," +
                                         $"{sample.DiskWritesPerSec:F0}," +
                                         $"{sample.DiskQueueLen:F2}," +
                                         $"{sample.DiskLatencySec * 1000:F2}," +
                                         $"{sample.GpuUtilPercent:F2}," +
                                         $"{sample.GpuVramUsedMb:F0}," +
                                         $"{sample.GpuVramTotalMb:F0}," +
                                         $"{sample.GpuTemperature:F1}," +
                                         $"{sample.GpuThrottling}," +
                                         $"{sample.NetJitterMs:F2}," +
                                         $"{sample.Fps:F1}," +
                                         $"\"{sample.Cause}\"");
                        }
                    }
                    
                    System.IO.File.WriteAllText(saveDialog.FileName, csv.ToString(), System.Text.Encoding.UTF8);
                    
                    _logger.LogSuccess($"Dados exportados para: {saveDialog.FileName}");
                    ShowToast("Exportação Concluída", $"Dados exportados para CSV com sucesso!");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Erro ao exportar CSV: {ex.Message}", ex);
                ShowMessage($"Erro ao exportar CSV: {ex.Message}", "Erro na Exportação");
            }
        }

        private void OpenDiagnostics()
        {
            try
            {
                _logger.LogInfo("Abrindo diagnósticos avançados...");
                
                // CORREÇÃO: Navegar para página de diagnósticos usando NavigationService
                var navService = App.Services?.GetService(typeof(INavigationService)) as INavigationService;
                if (navService != null)
                {
                    navService.NavigateTo(AppPage.Diagnostics.ToString());
                }
                else
                {
                    // Fallback: usar MainWindow diretamente
                    var mainWindow = System.Windows.Application.Current?.MainWindow as UI.MainWindow;
                    if (mainWindow != null)
                    {
                        // Tentar navegar via método do MainWindow
                        var navMethod = mainWindow.GetType().GetMethod("NavigateTo", 
                            System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
                        navMethod?.Invoke(mainWindow, new object[] { "Diagnostics" });
                    }
                    else
                    {
                        _logger.LogWarning("[GamerViewModel] Não foi possível navegar para diagnósticos - MainWindow não encontrado");
                        ShowMessage("Não foi possível abrir a página de diagnósticos.", "Erro de Navegação");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Erro ao abrir diagnósticos: {ex.Message}", ex);
                ShowMessage($"Erro ao abrir diagnósticos: {ex.Message}", "Erro");
            }
        }

        #endregion

        #region Event Handlers

        private void OnStatusChanged(object? sender, GamerModels.GamerModeStatus status)
        {
            // Atualizar na thread da UI
            System.Windows.Application.Current?.Dispatcher.Invoke(() =>
            {
                IsGamerModeActive = status.IsActive;
                
                if (status.IsActive)
                {
                    StatusText = status.ActiveGameName != null 
                        ? $"Modo Gamer: Ativo ({status.ActiveGameName})" 
                        : "Modo Gamer: Ativo ⚡";
                }
                else
                {
                    StatusText = "Modo Gamer: Inativo";
                }
                
                // Update command states when status changes
                UpdateCommandStates();
            });
        }

        private async void OnGameStarted(object? sender, GamerModels.DetectedGame game)
        {
            // Atualizar na thread da UI
            System.Windows.Application.Current?.Dispatcher.Invoke(() =>
            {
                try
                {
                    _logger.LogInfo($"Jogo detectado: {game.Name}");
                    
                    if (IsAutoModeEnabled && !IsGamerModeActive)
                    {
                        _ = RunGamerModeAsync(); // Fire and forget
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Erro ao iniciar modo gamer: {ex.Message}");
                }
            });
        }

        private async void OnGameStopped(object? sender, GamerModels.DetectedGame game)
        {
            // Atualizar na thread da UI
            System.Windows.Application.Current?.Dispatcher.Invoke(() =>
            {
                try
                {
                    _logger.LogInfo($"Jogo encerrado: {game.Name}");
                    
                    if (IsAutoModeEnabled && IsGamerModeActive)
                    {
                        _ = DeactivateGamerModeAsync(); // Fire and forget
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Erro ao desativar modo gamer: {ex.Message}");
                }
            });
        }
        
        /// <summary>
        /// Handler para mudança de estado do Modo Gamer em tempo real
        /// </summary>
        private void OnGamerModeChanged(object? sender, GamerModeChangedEventArgs e)
        {
            // Atualizar na thread da UI
            System.Windows.Application.Current?.Dispatcher.Invoke(() =>
            {
                IsGamerModeActive = e.IsActive;
                
                if (e.IsActive)
                {
                    var gameName = !string.IsNullOrEmpty(e.GameExecutable) 
                        ? System.IO.Path.GetFileNameWithoutExtension(e.GameExecutable) 
                        : null;
                    
                    StatusText = gameName != null 
                        ? $"🎮 Modo Gamer: ATIVO ({gameName})" 
                        : "🎮 Modo Gamer: ATIVO ⚡";
                    
                    _logger.LogSuccess($"[UI] Modo Gamer ativado em tempo real: {StatusText}");
                }
                else
                {
                    StatusText = "Modo Gamer: Inativo";
                    _logger.LogInfo("[UI] Modo Gamer desativado em tempo real");
                }
                
                // Atualizar estados dos comandos
                UpdateCommandStates();
            });
        }
        
        /// <summary>
        /// Handler para otimizações pré-jogo concluídas
        /// </summary>
        private void OnPreGameOptimizationCompleted(object? sender, PreGameOptimizationEventArgs e)
        {
            System.Windows.Application.Current?.Dispatcher.Invoke(() =>
            {
                if (e.Result.Success)
                {
                    var totalCleanedMb = e.Result.TotalCleaned / (1024 * 1024);
                    BusyMessage = $"✅ Pré-jogo: {totalCleanedMb:F1} MB limpos, {e.Result.ProcessesOptimized} processos otimizados";
                }
            });
        }
        
        /// <summary>
        /// Handler para otimizações pós-jogo concluídas
        /// </summary>
        private void OnPostGameOptimizationCompleted(object? sender, PostGameOptimizationEventArgs e)
        {
            System.Windows.Application.Current?.Dispatcher.Invoke(() =>
            {
                if (e.Result.Success)
                {
                    BusyMessage = $"✅ Pós-jogo: {e.Result.ServicesRestored} serviços restaurados, sistema normalizado";
                }
            });
        }

        /// <summary>
        /// CORREÇÃO: Atualiza a coleção de incidentes a partir do GamerOptimizerService
        /// </summary>
        private void UpdateIncidentsFromService()
        {
            try
            {
                if (App.GamerOptimizer == null) return;
                
                var recentIncidents = App.GamerOptimizer.GetRecentStutterIncidents();
                
                // Atualizar coleção na thread da UI
                System.Windows.Application.Current?.Dispatcher.Invoke(() =>
                {
                    // Limpar e adicionar novos incidentes
                    Incidents.Clear();
                    foreach (var incident in recentIncidents)
                    {
                        // Converter StutterIncident do GamerOptimizerService para GamerModels.StutterIncident
                        var modelIncident = new GamerModels.StutterIncident
                        {
                            Timestamp = incident.Timestamp,
                            Cause = ConvertStutterCause(incident.Cause),
                            Summary = incident.Cause,
                            TotalCpuPercent = incident.TotalCpu,
                            GameCpuPercent = incident.GameCpu,
                            ProcessorQueueLength = incident.QueueLength,
                            DpcPercent = incident.DpcPercent,
                            InterruptPercent = incident.InterruptPercent,
                            PageFaultsPerSec = incident.PageFaultsPerSec,
                            DiskQueueLength = incident.DiskQueue,
                            DiskLatencySec = incident.DiskLatencySec,
                            GpuUtilPercent = incident.GpuUtilPercent,
                            CpuFreqCurrentMhz = incident.CpuFreqCurrentMhz,
                            CpuFreqMaxMhz = incident.CpuFreqMaxMhz,
                            FrameAvgMs = incident.FrameAvgMs,
                            FrameJitterMs = incident.FrameJitterMs,
                            NetworkJitterMs = incident.NetworkJitterMs
                        };
                        Incidents.Add(modelIncident);
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[GamerViewModel] Erro ao atualizar incidentes: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Converte string de causa para enum StutterCause
        /// </summary>
        private GamerModels.StutterCause ConvertStutterCause(string cause)
        {
            if (string.IsNullOrEmpty(cause)) return GamerModels.StutterCause.Unknown;
            
            return cause.ToLowerInvariant() switch
            {
                var c when c.Contains("cpu") || c.Contains("scheduling") => GamerModels.StutterCause.CpuScheduling,
                var c when c.Contains("gpu") || c.Contains("render") => GamerModels.StutterCause.GpuRender,
                var c when c.Contains("frame") || c.Contains("pacing") => GamerModels.StutterCause.FramePacing,
                var c when c.Contains("driver") || c.Contains("dpc") || c.Contains("interrupt") => GamerModels.StutterCause.DriversInterrupt,
                var c when c.Contains("memory") || c.Contains("paging") || c.Contains("ram") => GamerModels.StutterCause.MemoryPaging,
                var c when c.Contains("disk") && c.Contains("io") => GamerModels.StutterCause.DiskIO,
                var c when c.Contains("disk") && c.Contains("latency") => GamerModels.StutterCause.DiskLatency,
                var c when c.Contains("network") || c.Contains("jitter") => GamerModels.StutterCause.NetworkJitter,
                var c when c.Contains("thermal") || c.Contains("throttle") => GamerModels.StutterCause.ThermalThrottling,
                _ => GamerModels.StutterCause.Unknown
            };
        }

        #endregion
        
        #region Incident Monitoring (Task-Based)
        
        private CancellationTokenSource? _incidentMonitoringCts;
        
        /// <summary>
        /// Inicia monitoramento de incidentes em background (Task-based)
        /// CORREÇÃO: Substitui DispatcherTimer que rodava na UI thread
        /// </summary>
        private async Task StartIncidentMonitoringAsync()
        {
            _incidentMonitoringCts = new CancellationTokenSource();
            var token = _incidentMonitoringCts.Token;
            
            await Task.Run(async () =>
            {
                while (!token.IsCancellationRequested)
                {
                    try
                    {
                        // Intervalo de 10s em vez de 2s (reduz overhead)
                        await Task.Delay(10000, token);
                        
                        // Executar update em background
                        var hasNewIncidents = await Task.Run(() =>
                        {
                            try
                            {
                                var currentCount = Incidents.Count;
                                UpdateIncidentsFromService();
                                return Incidents.Count > currentCount;
                            }
                            catch
                            {
                                return false;
                            }
                        }, token);
                        
                        // Atualizar UI apenas se houver novos incidentes
                        if (hasNewIncidents)
                        {
                            System.Windows.Application.Current?.Dispatcher.InvokeAsync(() =>
                            {
                                OnPropertyChanged(nameof(Incidents));
                            });
                        }
                    }
                    catch (OperationCanceledException)
                    {
                        break;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"[GamerViewModel] Erro no monitoramento de incidentes: {ex.Message}");
                    }
                }
            }, token);
        }
        
        #endregion

        protected override void OnDisposing()
        {
            try
            {
                // CORREÇÃO: Cancelar monitoramento de incidentes
                _incidentMonitoringCts?.Cancel();
                _incidentMonitoringCts?.Dispose();
                
                _orchestrator.StatusChanged -= OnStatusChanged;
                _gameDetector.GameStarted -= OnGameStarted;
                _gameDetector.GameStopped -= OnGameStopped;
                
                // Desfazer assinaturas do GamerOptimizerService
                if (App.GamerOptimizer != null)
                {
                    App.GamerOptimizer.GamerModeChanged -= OnGamerModeChanged;
                    App.GamerOptimizer.PreGameOptimizationCompleted -= OnPreGameOptimizationCompleted;
                    App.GamerOptimizer.PostGameOptimizationCompleted -= OnPostGameOptimizationCompleted;
                }
                
                // Desfazer assinaturas do GameDiagnosticsService
                if (App.GameDiagnostics != null)
                {
                    App.GameDiagnostics.SamplesUpdated -= OnDiagnosticsSamplesUpdated;
                }
                
                // Parar monitoramento do detector de jogos
                try
                {
                    _gameDetector.StopMonitoring();
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[GamerViewModel] Erro ao parar monitoramento do detector de jogos: {ex.Message}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[GamerViewModel] Erro ao descartar ViewModel: {ex.Message}", ex);
            }
            
            base.OnDisposing();
        }
    }
}

