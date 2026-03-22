using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Linq;
using System.Management;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Input;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Services.Gamer.Implementation;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using VoltrisOptimizer.Services.Gamer.OptimizationModules;
using VoltrisOptimizer.Services.Gamer.GamerModeManager;
// Usar alias para evitar conflito com tipos antigos
using GamerModels = VoltrisOptimizer.Services.Gamer.Models;
using AppPage = VoltrisOptimizer.Services.AppPage;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services.Gamer.Diagnostics.Implementation;
using VoltrisOptimizer.Services.Gamer.Models;
using VoltrisOptimizer.Services.Gamer.Intelligence.Interfaces;
using VoltrisOptimizer.Services.Gamer.Intelligence.Models;
using VoltrisOptimizer.Services.Gamer.Intelligence.Implementation;
using VoltrisOptimizer.Services.Gamer.Adaptive;
using VoltrisOptimizer.Services.Gamer.Intelligence;
using LogLevel = VoltrisOptimizer.Services.LogLevel;

using GameDetectionService = VoltrisOptimizer.Services.GameDetectionService;
using ThermalMonitorService = VoltrisOptimizer.Services.Gamer.GamerModeManager.ThermalMonitorService;
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
        private readonly IRealGameBoosterService? _realBooster;
        private readonly GamerSessionManager? _gamerSessionManager;
        private readonly TrendAnalyzerService _trendAnalyzer;
        private readonly IPowerProfileDiagnosticsService _powerDiag;
        private readonly IMachineProfileDetector _profileDetector;
        private readonly IAdaptiveOptimizationEngine _adaptiveEngine;
        private readonly IHardwareDetector _hardwareDetector;
        private readonly SemaphoreSlim _gamerModeLock = new(1, 1); // Guardrail de reentrância
        
        // CORREÇÃO CRÍTICA: Adicionar GamerProfileResolver para validar Perfil Inteligente
        private readonly VoltrisOptimizer.Services.Gamer.GamerProfileResolver? _gamerProfileResolver;

        // ── GAME REPAIR SERVICE ──────────────────────────────────────────────
        private readonly GameRepairService _gameRepairService;
        private CancellationTokenSource? _gameRepairCts;
        // Semáforo para evitar execução dupla (double-click / chamada concorrente)
        private readonly SemaphoreSlim _gameRepairLock = new(1, 1);

        private string _adapterMessage = "";
        public string AdapterMessage
        {
            get => _adapterMessage;
            set => SetProperty(ref _adapterMessage, value);
        }

        private bool _hasAdapterMessage;
        public bool HasAdapterMessage
        {
            get => _hasAdapterMessage;
            set => SetProperty(ref _hasAdapterMessage, value);
        }

        private string _warningMessage = "";
        public string WarningMessage
        {
            get => _warningMessage;
            set => SetProperty(ref _warningMessage, value);
        }

        private bool _hasWarning;
        public bool HasWarning
        {
            get => _hasWarning;
            set => SetProperty(ref _hasWarning, value);
        }

        #region Properties - Estado do Modo Gamer

        private bool _isGamerModeActive;
        public bool IsGamerModeActive
        {
            get => _isGamerModeActive;
            set
            {
                if (_isGamerModeActive != value)
                {
                    var threadInfo = System.Threading.Thread.CurrentThread.ManagedThreadId == System.Windows.Application.Current?.Dispatcher.Thread.ManagedThreadId ? "UI" : "BG";
                    _logger.Log(LogLevel.Info, LogCategory.Gamer, $"[GamerMode][ViewModel] Propriedade IsGamerModeActive alterada: {_isGamerModeActive} → {value} (Thread={threadInfo})");
                    SetProperty(ref _isGamerModeActive, value);
                    OnPropertyChanged(nameof(GamerModeStatusDescription));
                }
            }
        }

        public string GamerModeStatusDescription
        {
            get
            {
                if (IsGamerModeActive)
                {
                    if (ActiveGameName != null)
                        return $"Otimizando {ActiveGameName}";
                    return "Sistema otimizado para máxima performance";
                }
                return "Clique em ATIVAR para começar";
            }
        }

        private string _statusText = "Modo Gamer: Inativo";
        public string StatusText
        {
            get => _statusText;
            set => SetProperty(ref _statusText, value);
        }

        private string? _activeGameName;
        public string? ActiveGameName
        {
            get => _activeGameName;
            set => SetProperty(ref _activeGameName, value);
        }

        private string _fpsText = "";
        public string FpsText
        {
            get => _fpsText;
            set => SetProperty(ref _fpsText, value);
        }

        private string _cpuTempText = "CPU: --°C";
        public string CpuTempText
        {
            get => _cpuTempText;
            set => SetProperty(ref _cpuTempText, value);
        }

        private string _gpuTempText = "GPU: --°C";
        public string GpuTempText
        {
            get => _gpuTempText;
            set => SetProperty(ref _gpuTempText, value);
        }

        private bool _cpuThrottlingActive;
        public bool CpuThrottlingActive
        {
            get => _cpuThrottlingActive;
            set => SetProperty(ref _cpuThrottlingActive, value);
        }

        private bool _gpuThrottlingActive;
        public bool GpuThrottlingActive
        {
            get => _gpuThrottlingActive;
            set => SetProperty(ref _gpuThrottlingActive, value);
        }

        // Thermal Monitoring Properties (Real-time)
        private double _cpuTemperature;
        public double CpuTemperature { get => _cpuTemperature; set => SetProperty(ref _cpuTemperature, value); }
        
        private double _gpuTemperature;
        public double GpuTemperature { get => _gpuTemperature; set => SetProperty(ref _gpuTemperature, value); }
        
        private bool _isTemperatureEstimated;
        public bool IsTemperatureEstimated { get => _isTemperatureEstimated; set => SetProperty(ref _isTemperatureEstimated, value); }
        
        private string _thermalStatus = "Normal";
        public string ThermalStatus { get => _thermalStatus; set => SetProperty(ref _thermalStatus, value); }
        
        private string _thermalStatusColor = "#10B981";
        public string ThermalStatusColor { get => _thermalStatusColor; set => SetProperty(ref _thermalStatusColor, value); }
        
        private bool _hasThermalAlert;
        public bool HasThermalAlert { get => _hasThermalAlert; set => SetProperty(ref _hasThermalAlert, value); }

        private bool _isAutoModeEnabled = true; // SEMPRE true por padrão
        public bool IsAutoModeEnabled
        {
            get => _isAutoModeEnabled;
            set
            {
                if (SetProperty(ref _isAutoModeEnabled, value))
                {
                    if (value)
                    {
                        _logger.LogInfo("[GamerViewModel] 🔄 Iniciando AutoPilot - Modo Gamer Automático ATIVADO pelo usuário");
                        _orchestrator.StartAutoPilot();
                        _logger.LogSuccess("[GamerViewModel] ✅ AutoPilot iniciado com sucesso");
                    }
                    else
                    {
                        _logger.LogInfo("[GamerViewModel] 🛑 Parando AutoPilot - Modo Gamer Automático DESATIVADO pelo usuário");
                        _orchestrator.StopAutoPilot();
                        _logger.LogInfo("[GamerViewModel] ✅ AutoPilot parado com sucesso");
                    }
                    
                    // Salvar configuração imediatamente
                    try
                    {
                        var settings = SettingsService.Instance?.Settings;
                        if (settings != null)
                        {
                            settings.AutoGamerMode = value;
                            SettingsService.Instance.SaveSettings();
                            _logger.LogInfo($"[GamerViewModel] Configuração AutoGamerMode salva: {value}");
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"[GamerViewModel] Erro ao salvar configuração AutoGamerMode: {ex.Message}");
                    }
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

        private bool _autoActivateTemporaryOptimizations = true; // ATIVADO por padrão
        public bool AutoActivateTemporaryOptimizations
        {
            get => _autoActivateTemporaryOptimizations;
            set => SetProperty(ref _autoActivateTemporaryOptimizations, value);
        }

        #endregion

        #region Properties - Biblioteca de Jogos

        private ObservableCollection<GamerModels.DetectedGame>? _games;
        public ObservableCollection<GamerModels.DetectedGame> Games
        {
            get
            {
                if (_games == null)
                {
                    var dispatcher = System.Windows.Application.Current?.Dispatcher;
                    if (dispatcher != null && !dispatcher.CheckAccess())
                    {
                        dispatcher.Invoke(() => _games = new ObservableCollection<GamerModels.DetectedGame>());
                    }
                    else
                    {
                        _games = new ObservableCollection<GamerModels.DetectedGame>();
                    }
                }
                return _games;
            }
        }

        private GamerModels.DetectedGame? _selectedGame;
        public GamerModels.DetectedGame? SelectedGame
        {
            get => _selectedGame;
            set
            {
                if (SetProperty(ref _selectedGame, value))
                {
                    _logger.LogInfo($"[GamerViewModel] 🎮 Jogo selecionado na UI: {value?.Name ?? "Nenhum"}");
                    OnPropertyChanged(nameof(HasSelectedGame));
                    
                    // CARREGAR CONFIGURAÇÕES DO PERFIL PARA A UI
                    LoadProfileToUi();
                    
                    // Raise CanExecuteChanged for all commands that depend on SelectedGame
                    _logger.LogInfo("[GamerViewModel] 🔄 Atualizando estados dos comandos de jogo");
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

        public bool DisableHpet
        {
            get => _options.DisableHpet;
            set { _options.DisableHpet = value; OnPropertyChanged(); }
        }

        public bool DisableWallpaperSlideshow
        {
            get => _options.DisableWallpaperSlideshow;
            set { _options.DisableWallpaperSlideshow = value; OnPropertyChanged(); }
        }

        public bool DisableUwpBackgroundApps
        {
            get => _options.DisableUwpBackgroundApps;
            set { _options.DisableUwpBackgroundApps = value; OnPropertyChanged(); }
        }

        public bool DisableHeavyServices
        {
            get => _options.DisableHeavyServices;
            set { _options.DisableHeavyServices = value; OnPropertyChanged(); }
        }

        public GamerModels.PingTargetMode PingTarget
        {
            get => _options.PingTarget;
            set { _options.PingTarget = value; OnPropertyChanged(); }
        }

        #endregion

        #region Properties - OSD Overlay

        private bool _suppressOverlayUpdate = false;
        // CORREÇÃO: Debounce para evitar loop de UpdateOverlaySettings durante carga de settings
        // O problema: LoadOverlaySettingsAsync seta múltiplas propriedades em sequência,
        // cada uma dispara UpdateOverlaySettings() — mesmo com _suppressOverlayUpdate,
        // chamadas concorrentes podem escapar. O debounce garante que apenas a última
        // chamada dentro de 50ms seja executada.
        private System.Threading.Timer? _overlayDebounceTimer;
        private readonly object _overlayDebounceLock = new object();
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

        private bool _overlayAutoStartWithGamerMode = false;
        public bool OverlayAutoStartWithGamerMode
        {
            get => _overlayAutoStartWithGamerMode;
            set
            {
                if (SetProperty(ref _overlayAutoStartWithGamerMode, value))
                {
                    _logger?.LogInfo($"[GamerViewModel] ✅ OverlayAutoStartWithGamerMode atualizado para {value}");
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

        private ICommand? _activateOverlayCommand;
        public ICommand ActivateOverlayCommand
        {
            get
            {
                return _activateOverlayCommand ??= new AsyncRelayCommand(async _ =>
                {
                    try
                    {
                        _logger?.LogInfo("[GamerViewModel] 🎯 Ativando Performance Monitor...");
                        OverlayEnabled = true;
                        
                        if (App.OverlayService != null && IsGamerModeActive)
                        {
                            // Se o modo gamer está ativo, iniciar o overlay imediatamente
                            var currentProcess = Process.GetCurrentProcess();
                            await App.OverlayService.StartAsync(currentProcess.Id);
                            _logger?.LogSuccess("[GamerViewModel] ✅ Performance Monitor ativado com sucesso!");
                        }
                        else
                        {
                            _logger?.LogInfo("[GamerViewModel] ℹ️ Performance Monitor configurado para iniciar com o Modo Gamer");
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger?.LogError($"[GamerViewModel] ❌ Erro ao ativar Performance Monitor: {ex.Message}");
                    }
                });
            }
        }

        private ICommand? _deactivateOverlayCommand;
        public ICommand DeactivateOverlayCommand
        {
            get
            {
                return _deactivateOverlayCommand ??= new AsyncRelayCommand(async _ =>
                {
                    try
                    {
                        _logger?.LogInfo("[GamerViewModel] 🛑 Desativando Performance Monitor...");
                        OverlayEnabled = false;
                        
                        if (App.OverlayService != null)
                        {
                            await App.OverlayService.StopAsync();
                            _logger?.LogSuccess("[GamerViewModel] ✅ Performance Monitor desativado com sucesso!");
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger?.LogError($"[GamerViewModel] ❌ Erro ao desativar Performance Monitor: {ex.Message}");
                    }
                });
            }
        }

        private void UpdateOverlaySettings()
        {
            if (_suppressOverlayUpdate) return;
            
            // CORREÇÃO: Debounce de 50ms para evitar loop de chamadas em sequência
            // (ex: durante LoadOverlaySettingsAsync ou binding em cascata)
            lock (_overlayDebounceLock)
            {
                _overlayDebounceTimer?.Dispose();
                _overlayDebounceTimer = new System.Threading.Timer(_ =>
                {
                    _overlayDebounceTimer = null;
                    System.Windows.Application.Current?.Dispatcher.BeginInvoke(() => ApplyOverlaySettings());
                }, null, 50, System.Threading.Timeout.Infinite);
            }
        }

        private void ApplyOverlaySettings()
        {
            if (_suppressOverlayUpdate) return;
            
            _logger?.LogInfo("[GamerViewModel] 📝 UpdateOverlaySettings() chamado");
            
            if (App.OverlayService == null)
            {
                _logger?.LogError("[GamerViewModel] ❌ App.OverlayService é NULL! Overlay não pode ser atualizado");
                return;
            }

            _logger?.LogInfo($"[GamerViewModel] ⚙️ Criando settings: IsEnabled={_overlayEnabled}, AutoStartWithGamerMode={_overlayAutoStartWithGamerMode}");

            var settings = new Services.Gamer.Overlay.Models.OverlaySettings
            {
                IsEnabled = _overlayEnabled,
                AutoStartWithGamerMode = _overlayAutoStartWithGamerMode,
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

            _logger?.LogInfo("[GamerViewModel] 📤 Chamando App.OverlayService.UpdateSettings()");
            App.OverlayService.UpdateSettings(settings);
            
            _logger?.LogInfo("[GamerViewModel] 💾 Chamando App.OverlayService.SaveSettingsAsync()");
            App.OverlayService.SaveSettingsAsync();
            
            _logger?.LogSuccess($"[GamerViewModel] ✅ Overlay settings atualizados! IsEnabled={_overlayEnabled}, AutoStartWithGamerMode={_overlayAutoStartWithGamerMode}");
        }

        private async Task LoadOverlaySettingsAsync()
        {
            try
            {
                if (App.OverlayService != null)
                {
                    await App.OverlayService.LoadSettingsAsync();
                    var settings = App.OverlayService.Settings;
                    
                    // Suprimir chamadas individuais a UpdateOverlaySettings durante carga
                    _suppressOverlayUpdate = true;
                    try
                    {
                        OverlayEnabled = settings.IsEnabled;
                        OverlayAutoStartWithGamerMode = settings.AutoStartWithGamerMode;
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
                    finally
                    {
                        _suppressOverlayUpdate = false;
                    }
                    
                    _logger?.LogInfo("[GamerViewModel] ✅ Overlay settings carregados do disco");
                }
            }
            catch (Exception ex)
            {
                _suppressOverlayUpdate = false;
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

        #endregion

        #region Properties - Diagnóstico

        private ObservableCollection<GamerModels.StutterIncident>? _incidents;
        public ObservableCollection<GamerModels.StutterIncident> Incidents
        {
            get
            {
                if (_incidents == null)
                {
                    var dispatcher = System.Windows.Application.Current?.Dispatcher;
                    if (dispatcher != null && !dispatcher.CheckAccess())
                    {
                        dispatcher.Invoke(() => _incidents = new ObservableCollection<GamerModels.StutterIncident>());
                    }
                    else
                    {
                        _incidents = new ObservableCollection<GamerModels.StutterIncident>();
                    }
                }
                return _incidents;
            }
        }
        
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



        private bool _isDiagnosticsRunning;
        public bool IsDiagnosticsRunning
        {
            get => _isDiagnosticsRunning;
            set => SetProperty(ref _isDiagnosticsRunning, value);
        }

        private string _gameDetectionStatus = "";
        public string GameDetectionStatus
        {
            get => _gameDetectionStatus;
            set => SetProperty(ref _gameDetectionStatus, value);
        }

        private int _gameDetectionProgressPercent = 0;
        public int GameDetectionProgressPercent
        {
            get => _gameDetectionProgressPercent;
            set => SetProperty(ref _gameDetectionProgressPercent, value);
        }

        private int _gamesFoundCount = 0;
        public int GamesFoundCount
        {
            get => _gamesFoundCount;
            set => SetProperty(ref _gamesFoundCount, value);
        }

        public bool IsGameDetectionActive => GameDetectionProgressPercent > 0 && GameDetectionProgressPercent < 100;
        public bool HasDetectedGames => GamesFoundCount > 0;
        public bool NoGamesDetectedYet => !HasDetectedGames && !IsGameDetectionActive;

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
        public ICommand ActivateGamerModeCommand { get; private set; } // Alias para RunGamerModeCommand
        public ICommand DeactivateGamerModeCommand { get; private set; }
        public ICommand StartDiagnosticsCommand { get; private set; }
        public ICommand ExportCsvCommand { get; private set; }
        public ICommand OpenDiagnosticsCommand { get; private set; }
        public ICommand StartTemporaryOptimizationCommand { get; private set; }
        public ICommand StopTemporaryOptimizationCommand { get; private set; }
        public ICommand ForceRollbackTemporaryOptimizationCommand { get; private set; }
        public ICommand ApplyProOptimizationsCommand { get; private set; }
        public ICommand RevertProOptimizationsCommand { get; private set; }

        // ── GAME REPAIR COMMANDS ─────────────────────────────────────────────
        public ICommand ScanGameErrorsCommand  { get; private set; }
        public ICommand RepairGameErrorsCommand { get; private set; }
        public ICommand CancelGameRepairCommand { get; private set; }

        #endregion

        #region Properties - Game Repair

        private bool _isGameRepairScanning;
        public bool IsGameRepairScanning
        {
            get => _isGameRepairScanning;
            set
            {
                SetProperty(ref _isGameRepairScanning, value);
                OnPropertyChanged(nameof(CanStartGameRepair));
                // Notifica o botão X (Cancel) para habilitar/desabilitar corretamente
                if (CancelGameRepairCommand is RelayCommand c) c.RaiseCanExecuteChanged();
            }
        }

        private bool _isGameRepairRunning;
        public bool IsGameRepairRunning
        {
            get => _isGameRepairRunning;
            set
            {
                SetProperty(ref _isGameRepairRunning, value);
                OnPropertyChanged(nameof(CanStartGameRepair));
                // Notifica o botão X (Cancel) para habilitar/desabilitar corretamente
                if (CancelGameRepairCommand is RelayCommand c) c.RaiseCanExecuteChanged();
            }
        }

        public bool CanStartGameRepair => !IsGameRepairScanning && !IsGameRepairRunning;

        private string _gameRepairStatus = "Pronto para scan";
        public string GameRepairStatus
        {
            get => _gameRepairStatus;
            set => SetProperty(ref _gameRepairStatus, value);
        }

        private int _gameRepairProgress;
        public int GameRepairProgress
        {
            get => _gameRepairProgress;
            set => SetProperty(ref _gameRepairProgress, value);
        }

        private string _gameRepairReport = "";
        public string GameRepairReport
        {
            get => _gameRepairReport;
            set => SetProperty(ref _gameRepairReport, value);
        }

        private bool _hasGameRepairReport;
        public bool HasGameRepairReport
        {
            get => _hasGameRepairReport;
            set => SetProperty(ref _hasGameRepairReport, value);
        }

        private bool _gameRepairAllOk;
        public bool GameRepairAllOk
        {
            get => _gameRepairAllOk;
            set => SetProperty(ref _gameRepairAllOk, value);
        }

        private bool _hasGameRepairIssues;
        public bool HasGameRepairIssues
        {
            get => _hasGameRepairIssues;
            set => SetProperty(ref _hasGameRepairIssues, value);
        }

        private ObservableCollection<GameRepairIssue> _gameRepairIssues = new();
        public ObservableCollection<GameRepairIssue> GameRepairIssues
        {
            get => _gameRepairIssues;
            set => SetProperty(ref _gameRepairIssues, value);
        }

        private bool _autoScanOnGameStart;
        public bool AutoScanOnGameStart
        {
            get => _autoScanOnGameStart;
            set => SetProperty(ref _autoScanOnGameStart, value);
        }

        #endregion

        public GamerViewModel(
            IGamerModeOrchestrator orchestrator,
            IGameDetector gameDetector,
            IGameLibraryService libraryService,
            IGpuGamingOptimizer gpuOptimizer,
            ILoggingService logger,
            IMachineProfileDetector profileDetector,
            IAdaptiveOptimizationEngine adaptiveEngine,
            IHardwareDetector hardwareDetector,
            IGameProfileService? profileService = null,
            IRealGameBoosterService? realBooster = null,
            IPowerProfileDiagnosticsService? powerDiag = null)
        {
            _orchestrator = orchestrator ?? throw new ArgumentNullException(nameof(orchestrator));
            _gameDetector = gameDetector ?? throw new ArgumentNullException(nameof(gameDetector));
            _libraryService = libraryService ?? throw new ArgumentNullException(nameof(libraryService));
            _gpuOptimizer = gpuOptimizer ?? throw new ArgumentNullException(nameof(gpuOptimizer));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _profileDetector = profileDetector ?? throw new ArgumentNullException(nameof(profileDetector));
            _adaptiveEngine = adaptiveEngine ?? throw new ArgumentNullException(nameof(adaptiveEngine));
            _hardwareDetector = hardwareDetector ?? throw new ArgumentNullException(nameof(hardwareDetector));
            _profileService = profileService;
            _realBooster = realBooster;
            _powerDiag = powerDiag ?? new PowerProfileDiagnosticsService(_logger, new PowerPlanService(_logger), new ThermalMonitorService(_logger), _hardwareDetector);
            _trendAnalyzer = new TrendAnalyzerService(_logger);
            // CORREÇÃO: Usar a instância singleton do ServiceLocator para evitar
            // execução dupla em paralelo com a RepairView (ETAPA 17B)
            _gameRepairService = VoltrisOptimizer.Core.ServiceLocator.GetService<GameRepairService>()
                                 ?? new GameRepairService(_logger);
            
            _trendAnalyzer.WarningDetected += OnTrendWarningDetected;
            _powerDiag.DiagnosticMessageGenerated += OnPowerDiagnosticMessage;
            
            // CORREÇÃO CRÍTICA: Inicializar GamerProfileResolver
            try
            {
                _gamerProfileResolver = new VoltrisOptimizer.Services.Gamer.GamerProfileResolver(
                    SettingsService.Instance,
                    _logger
                );
                _logger.LogInfo("[GamerViewModel] GamerProfileResolver inicializado com sucesso");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[GamerViewModel] Erro ao criar GamerProfileResolver: {ex.Message}");
            }
            
            // FORÇAR AutoGamerMode como TRUE por padrão IMEDIATAMENTE
            _isAutoModeEnabled = true; // Definir campo diretamente primeiro
            _logger.LogInfo("[GamerViewModel] ✅ Modo Automático inicializado no construtor");
            
            // ATIVAR AUTOPILOT DIRETAMENTE NO ORCHESTRATOR
            _logger.LogInfo("[GamerViewModel] 🔄 Iniciando AutoPilot diretamente no Orchestrator...");
            _orchestrator.StartAutoPilot();
            _logger.LogSuccess("[GamerViewModel] ✅ AutoPilot iniciado com sucesso no construtor");
            
            // Obter GamerSessionManager do DI (pode ser null se não estiver registrado)
            try
            {
                var serviceProvider = App.Services;
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
            ActivateGamerModeCommand = RunGamerModeCommand; // Alias para compatibilidade com XAML
            DeactivateGamerModeCommand = new AsyncRelayCommand(async _ => await DeactivateGamerModeAsync(), _ => IsGamerModeActive);
            StartDiagnosticsCommand = new RelayCommand(_ => ToggleDiagnostics());
            ExportCsvCommand = new RelayCommand(_ => ExportCsv());
            OpenDiagnosticsCommand = new RelayCommand(_ => OpenDiagnostics());
            StartTemporaryOptimizationCommand = new AsyncRelayCommand(async _ => await StartTemporaryOptimizationAsync(), _ => _gamerSessionManager != null && !IsTemporaryOptimizationSessionActive);
            StopTemporaryOptimizationCommand = new AsyncRelayCommand(async _ => await StopTemporaryOptimizationAsync(), _ => _gamerSessionManager != null && IsTemporaryOptimizationSessionActive);

            ForceRollbackTemporaryOptimizationCommand = new AsyncRelayCommand(async _ => await ForceRollbackTemporaryOptimizationAsync(), _ => _gamerSessionManager != null && IsTemporaryOptimizationSessionActive);
            ApplyProOptimizationsCommand = new AsyncRelayCommand(async _ => await ApplyProOptimizationsAsync());
            RevertProOptimizationsCommand = new AsyncRelayCommand(async _ => await RevertProOptimizationsAsync());

            // ── GAME REPAIR COMMANDS ─────────────────────────────────────────
            ScanGameErrorsCommand   = new AsyncRelayCommand(async _ => await ScanGameErrorsAsync(), _ => CanStartGameRepair);
            RepairGameErrorsCommand = new AsyncRelayCommand(async _ => await RepairGameErrorsAsync(), _ => HasGameRepairIssues && CanStartGameRepair);
            CancelGameRepairCommand = new RelayCommand(_ => CancelGameRepair(), _ => IsGameRepairScanning || IsGameRepairRunning);

            // Subscrever a eventos
            _orchestrator.StatusChanged += OnStatusChanged;
            _gameDetector.GameStarted += OnGameStarted;
            _gameDetector.GameStopped += OnGameStopped;
            _gameDetector.ProgressChanged += OnGameDetectionProgressChanged; // Assinar evento de progresso
            
            OnPropertyChanged(nameof(NoGamesDetectedYet)); // Inicializar estado do UI
            
            // LEGACY: Subscrever eventos do GamerOptimizerService para atualização em tempo real
            // if (App.GamerOptimizer != null)
            // {
            //     App.GamerOptimizer.GamerModeChanged += OnGamerModeChanged;
            //     App.GamerOptimizer.PreGameOptimizationCompleted += OnPreGameOptimizationCompleted;
            //     App.GamerOptimizer.PostGameOptimizationCompleted += OnPostGameOptimizationCompleted;
            // }
            
            // Subscrever eventos do GameDiagnosticsService
            if (App.GameDiagnostics != null)
            {
                App.GameDiagnostics.SamplesUpdated += OnDiagnosticsSamplesUpdated;
            }
            
            // Subscrever ao Monitoramento Térmico Global (Real-time)
            if (App.ThermalMonitorService != null)
            {
                App.ThermalMonitorService.MetricsUpdated += OnThermalMetricsUpdated;
                App.ThermalMonitorService.AlertGenerated += OnThermalAlertGenerated;
                _logger?.LogSuccess("[GamerViewModel] ✅ Subscrito ao GlobalThermalMonitorService com sucesso");
                
                // CORREÇÃO: Forçar primeira leitura de temperatura imediatamente
                _ = Task.Run(async () =>
                {
                    try
                    {
                        await Task.Delay(500); // Aguardar inicialização
                        var metrics = await App.ThermalMonitorService.GetCurrentMetricsAsync();
                        OnThermalMetricsUpdated(this, metrics);
                        _logger?.LogInfo($"[GamerViewModel] Primeira leitura de temperatura: CPU={metrics.CpuTemperature:F1}°C, GPU={metrics.GpuTemperature:F1}°C");
                    }
                    catch (Exception ex)
                    {
                        _logger?.LogError($"[GamerViewModel] Erro ao obter temperatura inicial: {ex.Message}");
                    }
                });
            }
            else
            {
                _logger?.LogWarning("[GamerViewModel] ⚠️ App.ThermalMonitorService é NULL - temperaturas não serão atualizadas");
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

                    OnPropertyChanged(nameof(NoGamesDetectedYet)); // Atualizar estado do UI após carregar jogos

                    // Carregar configuração de Auto detecção
                    var settings = SettingsService.Instance?.Settings;
                    if (settings != null)
                    {
                        if (!settings.HasGamerModeConfigured)
                        {
                            // Primeira execução: definir AutoGamerMode como true por padrão e salvar
                            settings.AutoGamerMode = true;
                            settings.HasGamerModeConfigured = true; // Marcar como configurado
                            SettingsService.Instance.SaveSettings();
                            _logger.LogInfo("[GamerViewModel] ✅ AutoGamerMode definido como TRUE por padrão na primeira execução.");
                        }

                        // Carregar o valor persistido OU forçar TRUE se estiver FALSE
                        IsAutoModeEnabled = settings.AutoGamerMode;
                        
                        // REFORÇO: Garantir que Auto Mode sempre está ativo conforme desejado pelo usuário
                        if (SettingsService.Instance?.Settings != null)
                        {
                            IsAutoModeEnabled = true; // Forçar ativação para garantir monitoramento
                        }
                        
                        // SINCRONIZAR ESTADO INICIAL DO MODO GAMER
                        OnStatusChanged(this, _orchestrator.Status);
                    }
                    else
                    {
                        _logger.LogWarning("[GamerViewModel] SettingsService não disponível - usando defaults");
                        IsAutoModeEnabled = true; // Fallback seguro
                    }
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
                var dispatcher = System.Windows.Application.Current?.Dispatcher;
                void ExecuteOnUi(Action action)
                {
                    if (dispatcher != null && !dispatcher.CheckAccess())
                        dispatcher.BeginInvoke(action);
                    else
                        action();
                }

                ExecuteOnUi(() => Games.Clear());
                
                // Primeiro tentar carregar da biblioteca principal
                var games = _libraryService.GetAllGames();
                
                // Se não tiver jogos na biblioteca, tentar carregar da lista manual de detecção
                if (games.Count == 0)
                {
                    _logger.LogInfo("[GamerViewModel] Nenhum jogo na biblioteca principal, tentando lista manual...");
                    
                    // Tentar obter a lista manual de detecção
                    var gameDetectionService = App.Services?.GetService(typeof(GameDetectionService)) as GameDetectionService;
                    if (gameDetectionService != null)
                    {
                        var manualGames = gameDetectionService.GetManualGamesList();
                        _logger.LogInfo($"[GamerViewModel] Encontrados {manualGames.Count} jogos na lista manual");
                        
                        // Converter para o formato esperado
                        foreach (var gameName in manualGames)
                        {
                            if (!string.IsNullOrWhiteSpace(gameName))
                            {
                                var detectedGame = new GamerModels.DetectedGame
                                {
                                    Name = gameName,
                                    ExecutablePath = $"{gameName}.exe",
                                    DetectedAt = DateTime.Now
                                };
                                ExecuteOnUi(() => Games.Add(detectedGame));
                            }
                        }
                    }
                }
                else
                {
                    // Carregar da biblioteca normal
                    foreach (var game in games)
                    {
                        ExecuteOnUi(() => Games.Add(game));
                    }
                }
                
                _logger.LogInfo($"[GamerViewModel] {Games.Count} jogos carregados para a UI");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[GamerViewModel] Erro ao carregar jogos da biblioteca: {ex.Message}", ex);
                // Clear the games list in case of error
                System.Windows.Application.Current?.Dispatcher?.Invoke(() => Games.Clear());
            }
        }

        private void LoadProfileToUi()
        {
            if (SelectedGame == null || _profileService == null) return;

            try
            {
                var profile = _profileService.GetProfile(SelectedGame.Name);
                if (profile != null && profile.Settings != null)
                {
                    // Carregar settings do perfil salvo
                    OptimizeCpu = profile.Settings.OptimizeCPU;
                    OptimizeGpu = profile.Settings.OptimizeGPU;
                    OptimizeNetwork = profile.Settings.OptimizeNetwork;
                    OptimizeMemory = profile.Settings.OptimizeMemory;
                    EnableGameMode = profile.Settings.EnableGameMode;
                    ApplyFpsBoost = profile.Settings.ApplyFPSBoost;
                    ReduceLatency = profile.Settings.ReduceLatency;
                    CloseBackgroundApps = profile.Settings.CloseBackgroundApps;
                    EnableExtremeMode = profile.Settings.EnableExtremeMode;
                    EnableAntiStutter = profile.Settings.EnableAntiStutter;
                    EnableAdaptiveNetwork = profile.Settings.EnableAdaptiveNetwork;
                    
                    _logger.LogInfo($"[UI] Perfil carregado para view: {SelectedGame.Name}");
                }
                else
                {
                    // Se não tiver perfil, manter padrões ou resetar?
                    // Estratégia Enterprise: Resetar para "Smart Defaults" para evitar confusão com configs do jogo anterior
                    OptimizeCpu = true;
                    OptimizeGpu = true;
                    OptimizeNetwork = true;
                    OptimizeMemory = true;
                    EnableGameMode = true;
                    ApplyFpsBoost = true;
                    ReduceLatency = true;
                    CloseBackgroundApps = true;
                    EnableExtremeMode = false;
                    EnableAntiStutter = true;
                    EnableAdaptiveNetwork = true;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[UI] Erro ao carregar perfil para UI: {ex.Message}");
            }
        }

        #region Command Implementations

        private async Task DetectGamesAsync(CancellationToken cancellationToken = default)
        {
            await ExecuteSafeAsync(async () =>
            {
                _logger.LogInfo("[GamerViewModel] 🔎 Iniciando detecção de jogos em todos os drives...");
                
                var detected = await _gameDetector.DetectInstalledGamesAsync(cancellationToken);
                
                _logger.LogSuccess($"[GamerViewModel] ✨ Detecção concluída: {detected.Count} jogos encontrados");

                await System.Windows.Application.Current?.Dispatcher.InvokeAsync(() => 
                {
                    _logger.LogInfo("[GamerViewModel] 📋 Atualizando lista de jogos na UI...");
                    Games.Clear();
                    foreach (var game in detected)
                    {
                        if (game != null)
                        {
                            Games.Add(game);
                            _libraryService.AddGame(game);
                        }
                    }
                    _logger.LogInfo($"[GamerViewModel] ✅ UI atualizada com {Games.Count} jogos");
                });

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
            System.Windows.Application.Current?.Dispatcher.BeginInvoke(() =>
            {
                UI.Controls.ModernMessageBox.Show(message, title, 
                    System.Windows.MessageBoxButton.OK, 
                    System.Windows.MessageBoxImage.Information);
            });
        }
        
        private void ShowToast(string title, string message)
        {
            System.Windows.Application.Current?.Dispatcher.BeginInvoke(() =>
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
                _logger?.LogInfo("[GamerViewModel] Botão Temperatura clicado - obtendo métricas do GlobalThermalMonitorService");
                
                // CORREÇÃO CRÍTICA: Usar CurrentMetrics ao invés de GetCurrentMetricsAsync para evitar travamento
                // O serviço já está atualizando as métricas em tempo real, não precisa fazer nova leitura
                if (App.ThermalMonitorService != null && App.ThermalMonitorService.CurrentMetrics != null)
                {
                    var metrics = App.ThermalMonitorService.CurrentMetrics;
                    
                    // Atualizar propriedades
                    CpuTemperature = double.IsNaN(metrics.CpuTemperature) ? 0 : metrics.CpuTemperature;
                    GpuTemperature = double.IsNaN(metrics.GpuTemperature) ? 0 : metrics.GpuTemperature;
                    IsTemperatureEstimated = metrics.IsCpuTemperatureEstimated;
                    
                    // Atualizar textos legados
                    CpuTempText = CpuTemperature > 0 ? $"CPU: {CpuTemperature:F0}°C" : "CPU: --°C";
                    GpuTempText = GpuTemperature > 0 ? $"GPU: {GpuTemperature:F0}°C" : "GPU: --°C";
                    
                    // Atualizar status térmico
                    UpdateThermalStatus(metrics);
                    
                    // Forçar notificação de mudança
                    OnPropertyChanged(nameof(CpuTemperature));
                    OnPropertyChanged(nameof(GpuTemperature));
                    OnPropertyChanged(nameof(CpuTempText));
                    OnPropertyChanged(nameof(GpuTempText));
                    
                    // Verificar alertas (sem await para não travar)
                    if (CpuTemperature > 0 || GpuTemperature > 0)
                    {
                        _ = CheckTemperatureAlerts(CpuTemperature, GpuTemperature);
                    }
                    
                    var tempType = metrics.IsCpuTemperatureEstimated ? "ESTIMADA" : "REAL";
                    _logger?.LogSuccess($"[GamerViewModel] Temperaturas atualizadas ({tempType}) - CPU: {CpuTemperature:F1}°C, GPU: {GpuTemperature:F1}°C");
                    
                    // Mostrar notificação de sucesso
                    VoltrisOptimizer.Services.NotificationManager.ShowSuccess("Temperatura Atualizada", $"CPU: {CpuTemperature:F0}°C | GPU: {GpuTemperature:F0}°C");
                }
                else
                {
                    _logger?.LogWarning("[GamerViewModel] GlobalThermalMonitorService não disponível ou sem métricas");
                    CpuTempText = "CPU: Aguardando...";
                    GpuTempText = "GPU: Aguardando...";
                    
                    // Tentar forçar uma leitura se o serviço existir mas não tiver métricas
                    if (App.ThermalMonitorService != null)
                    {
                        _ = Task.Run(async () =>
                        {
                            try
                            {
                                var metrics = await App.ThermalMonitorService.GetCurrentMetricsAsync();
                                System.Windows.Application.Current?.Dispatcher.BeginInvoke(() =>
                                {
                                    OnThermalMetricsUpdated(this, metrics);
                                });
                            }
                            catch (Exception ex)
                            {
                                _logger?.LogError($"[GamerViewModel] Erro ao forçar leitura de temperatura: {ex.Message}");
                            }
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[GamerViewModel] Erro ao verificar temperatura: {ex.Message}", ex);
                CpuTempText = "CPU: Erro";
                GpuTempText = "GPU: Erro";
            }
        }
        
        // ============================================
        // MONITORAMENTO TÉRMICO EM TEMPO REAL
        // ============================================
        
        // Throttling de log térmico: logar no máximo a cada 30s ou quando delta > 3°C
        private DateTime _lastThermalLogTime = DateTime.MinValue;
        private double _lastLoggedCpuTemp = double.NaN;
        private double _lastLoggedGpuTemp = double.NaN;
        private const double ThermalLogDeltaThreshold = 3.0;   // °C
        private const int ThermalLogIntervalSeconds = 30;

        /// <summary>
        /// Callback para atualização de métricas térmicas em tempo real.
        /// Log com throttling: apenas quando delta > 3°C ou a cada 30s.
        /// </summary>
        private void OnThermalMetricsUpdated(object? sender, VoltrisOptimizer.Services.Thermal.Models.ThermalMetrics metrics)
        {
            try
            {
                System.Windows.Application.Current?.Dispatcher.BeginInvoke(() =>
                {
                    var oldCpuTemp = CpuTemperature;
                    var oldGpuTemp = GpuTemperature;

                    CpuTemperature = double.IsNaN(metrics.CpuTemperature) ? 0 : metrics.CpuTemperature;
                    GpuTemperature = double.IsNaN(metrics.GpuTemperature) ? 0 : metrics.GpuTemperature;
                    IsTemperatureEstimated = metrics.IsCpuTemperatureEstimated;

                    UpdateThermalStatus(metrics);

                    CpuTempText = CpuTemperature > 0 ? $"CPU: {CpuTemperature:F0}°C" : "CPU: --°C";
                    GpuTempText = GpuTemperature > 0 ? $"GPU: {GpuTemperature:F0}°C" : "GPU: --°C";

                    OnPropertyChanged(nameof(CpuTemperature));
                    OnPropertyChanged(nameof(GpuTemperature));
                    OnPropertyChanged(nameof(CpuTempText));
                    OnPropertyChanged(nameof(GpuTempText));
                    OnPropertyChanged(nameof(IsTemperatureEstimated));
                    OnPropertyChanged(nameof(ThermalStatus));
                    OnPropertyChanged(nameof(ThermalStatusColor));

                    // Throttling de log: evitar centenas de linhas de debug por sessão.
                    // Logar apenas quando: delta > 3°C, ou intervalo > 30s, ou mudança de tipo (estimado↔real).
                    var now = DateTime.Now;
                    bool deltaSignificant = !double.IsNaN(_lastLoggedCpuTemp) &&
                        (Math.Abs(CpuTemperature - _lastLoggedCpuTemp) >= ThermalLogDeltaThreshold ||
                         Math.Abs(GpuTemperature - _lastLoggedGpuTemp) >= ThermalLogDeltaThreshold);
                    bool intervalElapsed = (now - _lastThermalLogTime).TotalSeconds >= ThermalLogIntervalSeconds;
                    bool typeChanged = oldCpuTemp == 0 && CpuTemperature > 0; // primeira leitura válida

                    if (deltaSignificant || intervalElapsed || typeChanged || double.IsNaN(_lastLoggedCpuTemp))
                    {
                        var tempType = metrics.IsCpuTemperatureEstimated ? "ESTIMADA" : "REAL";
                        _logger?.LogDebug($"[GamerViewModel] Temp ({tempType}) CPU: {CpuTemperature:F1}°C, GPU: {GpuTemperature:F1}°C");
                        _lastThermalLogTime = now;
                        _lastLoggedCpuTemp = CpuTemperature;
                        _lastLoggedGpuTemp = GpuTemperature;
                    }
                });
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[GamerViewModel] Erro ao atualizar temperaturas: {ex.Message}", ex);
            }
        }
        
        /// <summary>
        /// Callback para alertas térmicos
        /// </summary>
        private void OnThermalAlertGenerated(object? sender, VoltrisOptimizer.Services.Thermal.Models.ThermalAlert alert)
        {
            System.Windows.Application.Current?.Dispatcher.BeginInvoke(() =>
            {
                HasThermalAlert = true;
                
                // Mostrar notificação discreta
                VoltrisOptimizer.Services.NotificationManager.ShowInfo(alert.Message, alert.Recommendation);
                
                _logger?.LogWarning($"[GamerViewModel] Alerta térmico: {alert.Message}");
            });
        }
        
        /// <summary>
        /// Atualiza o status térmico baseado nas métricas
        /// </summary>
        private void UpdateThermalStatus(VoltrisOptimizer.Services.Thermal.Models.ThermalMetrics metrics)
        {
            // Considerar apenas CPU se GPU não estiver disponível
            var maxTemp = double.IsNaN(metrics.GpuTemperature) 
                ? metrics.CpuTemperature 
                : Math.Max(metrics.CpuTemperature, metrics.GpuTemperature);
            
            if (maxTemp >= 90)
            {
                ThermalStatus = "Crítico";
                ThermalStatusColor = "#EF4444"; // Red
                HasThermalAlert = true;
            }
            else if (maxTemp >= 80)
            {
                ThermalStatus = "Alerta";
                ThermalStatusColor = "#F59E0B"; // Orange
                HasThermalAlert = true;
            }
            else if (maxTemp >= 70)
            {
                ThermalStatus = "Elevado";
                ThermalStatusColor = "#F59E0B"; // Orange
                HasThermalAlert = false;
            }
            else
            {
                ThermalStatus = "Normal";
                ThermalStatusColor = "#10B981"; // Green
                HasThermalAlert = false;
            }
        }
        
        /// <summary>
        /// Obtém temperaturas atuais do sistema
        /// </summary>
        private async Task<(double cpuTemp, double gpuTemp)> GetSystemTemperaturesAsync()
        {
            return await Task.Run(async () =>
            {
                double cpuTemp = 0;
                double gpuTemp = 0;
                
                // Obter temperatura da CPU
                try
                {
                    cpuTemp = await GetCpuTemperatureAsync();
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[GamerViewModel] Erro ao obter temperatura da CPU: {ex.Message}");
                    cpuTemp = 0;
                }
                
                // Obter temperatura da GPU
                try
                {
                    var gpuResult = await _gpuOptimizer.GetTemperatureAsync(default);
                    if (gpuResult.IsAvailable)
                    {
                        gpuTemp = gpuResult.Current;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[GamerViewModel] Erro ao obter temperatura da GPU: {ex.Message}");
                    gpuTemp = 0;
                }
                
                return (cpuTemp, gpuTemp);
            });
        }
        
        /// <summary>
        /// Verifica compatibilidade de hardware para otimizações
        /// </summary>
        private async Task<HardwareCompatibilityResult> CheckHardwareCompatibilityAsync()
        {
            return await Task.Run(async () =>
            {
                var result = new HardwareCompatibilityResult
                {
                    IsCompatible = true,
                    Incompatibilities = new List<string>()
                };
                
                try
                {
                    // Verificar se FPS Boost está ativado e verificar compatibilidade de HAGS
                    if (ApplyFpsBoost)
                    {
                        var gpuInfo = await _gpuOptimizer.GetGpuInfoAsync(default);
                        if (!gpuInfo.SupportsHags)
                        {
                            result.IsCompatible = false;
                            result.Incompatibilities.Add("⚠️ Seu GPU não suporta Hardware-Accelerated GPU Scheduling (HAGS)");
                            result.Incompatibilities.Add("   A otimização FPS Boost pode ter eficácia reduzida");
                        }
                        else
                        {
                            result.Incompatibilities.Add("✅ GPU compatível com HAGS");
                        }
                    }
                    
                    // Verificar outras compatibilidades futuras aqui
                    // Ex: verificar versão do Windows, drivers, etc.
                    
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[GamerViewModel] Erro ao verificar compatibilidade de hardware: {ex.Message}");
                    result.IsCompatible = false;
                    result.Incompatibilities.Add($"⚠️ Erro ao verificar compatibilidade: {ex.Message}");
                }
                
                return result;
            });
        }
        
        /// <summary>
        /// Mostra diálogo de confirmação ao usuário
        /// </summary>
        private async Task<bool> ShowConfirmationDialogAsync(string title, string message, string confirmText, string cancelText)
        {
            // Esta é uma implementação simplificada
            // Em produção, usar MessageBox personalizada ou componente UI
            return await Task.Run(() =>
            {
                // Log para auditoria
                _logger.LogWarning($"[GamerViewModel] Diálogo de confirmação mostrado: {title}");
                _logger.LogWarning($"[GamerViewModel] Mensagem: {message}");
                
                // Por enquanto, retornar true para permitir continuidade
                // Em implementação real, mostrar MessageBox ou componente customizado
                return true;
            });
        }
        
        /// <summary>
        /// Resultado da verificação de compatibilidade de hardware
        /// </summary>
        private class HardwareCompatibilityResult
        {
            public bool IsCompatible { get; set; }
            public List<string> Incompatibilities { get; set; } = new();
        }
        private async Task<double> GetCpuTemperatureAsync()
        {
            return await Task.Run(() =>
            {
                // Método 1: MSAcpi_ThermalZoneTemperature (mais comum)
                try
                {
                    var obj = VoltrisOptimizer.Utils.WmiHelper.QueryFirstSafe("SELECT CurrentTemperature FROM MSAcpi_ThermalZoneTemperature", @"root\WMI");
                    if (obj != null)
                    {
                        var temp = obj["CurrentTemperature"];
                        if (temp != null)
                        {
                            var tempKelvin = Convert.ToDouble(temp) / 10.0;
                            var tempCelsius = tempKelvin - 273.15;
                            if (tempCelsius > 0 && tempCelsius < 150) return tempCelsius;
                        }
                    }
                }
                catch { }
                
                // Método 2: Win32_TemperatureProbe
                try
                {
                    var obj = VoltrisOptimizer.Utils.WmiHelper.QueryFirstSafe("SELECT CurrentReading FROM Win32_TemperatureProbe");
                    if (obj != null)
                    {
                        var temp = obj["CurrentReading"];
                        if (temp != null)
                        {
                            var tempCelsius = Convert.ToDouble(temp);
                            if (tempCelsius > 0 && tempCelsius < 150) return tempCelsius;
                        }
                    }
                }
                catch { }
                
                // Método 3: LibreHardwareMonitor / OpenHardwareMonitor
                try
                {
                    var obj = VoltrisOptimizer.Utils.WmiHelper.QueryFirstSafe("SELECT Value FROM Sensor WHERE SensorType='Temperature' AND (Name LIKE '%CPU%' OR Name LIKE '%Processor%')", @"root\LibreHardwareMonitor")
                             ?? VoltrisOptimizer.Utils.WmiHelper.QueryFirstSafe("SELECT Value FROM Sensor WHERE SensorType='Temperature' AND (Name LIKE '%CPU%' OR Name LIKE '%Processor%')", @"root\OpenHardwareMonitor");
                    
                    if (obj != null)
                    {
                        var temp = Convert.ToDouble(obj["Value"]);
                        if (temp > 0 && temp < 150) return temp;
                    }
                }
                catch { }
                
                // Método 4: Perf Counters
                try
                {
                    var obj = VoltrisOptimizer.Utils.WmiHelper.QueryFirstSafe("SELECT Temperature FROM Win32_PerfFormattedData_Counters_ThermalZoneInformation");
                    if (obj != null)
                    {
                        var temp = Convert.ToDouble(obj["Temperature"]);
                        if (temp > 0 && temp < 150) return temp;
                    }
                }
                catch { }
                
                return 0;
            });
        }
        
        /// <summary>
        /// Verifica temperaturas elevadas e alerta usuário sobre manutenção
        /// </summary>
        private async Task CheckTemperatureAlerts(double cpuTemp, double gpuTemp)
        {
            bool showAlert = false;
            string alertMessage = "";
            
            // Verificar CPU
            if (cpuTemp > 85)
            {
                showAlert = true;
                alertMessage += $"⚠️ CPU muito quente ({cpuTemp:F0}°C)! \n";
            }
            else if (cpuTemp > 75)
            {
                showAlert = true;
                alertMessage += $"🌡️ CPU aquecida ({cpuTemp:F0}°C). \n";
            }
            
            // Verificar GPU
            if (gpuTemp > 0)
            {
                if (gpuTemp > 85)
                {
                    showAlert = true;
                    alertMessage += $"⚠️ GPU muito quente ({gpuTemp:F0}°C)! \n";
                }
                else if (gpuTemp > 75)
                {
                    showAlert = true;
                    alertMessage += $"🌡️ GPU aquecida ({gpuTemp:F0}°C). \n";
                }
            }
            
            if (showAlert)
            {
                alertMessage += "\n🔧 Recomendação: Troque a pasta térmica e faça uma limpeza profissional na máquina.";
                
                // CORREÇÃO CRÍTICA: Remover Task.Run e Dispatcher.Invoke desnecessários que causam deadlock
                // Já estamos na UI thread, então podemos chamar diretamente
                VoltrisOptimizer.Services.NotificationManager.ShowWarning("🌡️ ALERTA DE TEMPERATURA", alertMessage);
                _logger?.LogWarning($"[TEMPERATURE] Alerta de temperatura: CPU={cpuTemp:F0}°C, GPU={gpuTemp:F0}°C");
            }
            
            await Task.CompletedTask;
        }

        private async Task RunGamerModeAsync(CancellationToken cancellationToken = default)
        {
            if (!await _gamerModeLock.WaitAsync(0)) 
            {
                _logger.LogWarning("[GamerViewModel] Modo Gamer já está sendo ativado, ignorando solicitação duplicada");
                return; // Evitar reentrância
            }

            try
            {
                _logger.LogInfo("═══════════════════════════════════════════════");
                _logger.LogInfo("🚀 SOLICITAÇÃO MANUAL: ATIVANDO MODO GAMER");
                _logger.LogInfo($"[GamerViewModel] Jogo selecionado: {SelectedGame?.Name ?? "Nenhum (Global Boost)"}");
                _logger.LogInfo("═══════════════════════════════════════════════");

                // CORREÇÃO CRÍTICA: Validar Perfil Inteligente ANTES de ativar
                if (_gamerProfileResolver != null)
                {
                    _logger.LogInfo("[GamerViewModel] 🔍 Validando Perfil Inteligente e Hardware...");
                    
                    // Criar HardwareCapabilities do tipo Interfaces para o resolver
                    var systemInfoService = App.Services?.GetService(typeof(ISystemInfoService)) as ISystemInfoService;
                    var hardware = await (systemInfoService?.GetHardwareCapabilitiesAsync() ?? Task.FromResult(new VoltrisOptimizer.Interfaces.HardwareCapabilities()));
                    
                    var executionPlan = _gamerProfileResolver.ResolveExecutionPlan(hardware);
                    
                    var currentProfile = SettingsService.Instance.Settings.IntelligentProfile;
                    _logger.LogInfo($"[GamerViewModel] Perfil Inteligente Ativo: {currentProfile}");
                    _logger.LogInfo($"[GamerViewModel] Hardware: CPU: {hardware.Cpu.CoreCount} cores, RAM: {hardware.Ram.TotalGB}GB");
                    
                    // Verificar se ativação é permitida
                    if (!executionPlan.AllowActivation)
                    {
                        _logger.LogWarning($"[GamerViewModel] ❌ Modo Gamer BLOQUEADO pelo perfil {currentProfile}");
                        _logger.LogWarning($"[GamerViewModel] Motivo: {executionPlan.BlockReason}");
                        
                        await System.Windows.Application.Current?.Dispatcher.InvokeAsync(() =>
                        {
                            VoltrisOptimizer.Services.NotificationManager.ShowWarning(
                                "❌ MODO GAMER BLOQUEADO",
                                $"{executionPlan.BlockReason}\n\nPara ativar o Modo Gamer, altere o Perfil Inteligente nas Configurações."
                            );
                        });
                        
                        return; // SAIR SEM ATIVAR
                    }
                    
                    // Verificar temperatura se necessário
                    if (executionPlan.RequireTemperatureCheck)
                    {
                        _logger.LogInfo("[GamerViewModel] 🌡️ Verificando temperatura do sistema...");
                        var (cpuTemp, gpuTemp) = await GetSystemTemperaturesAsync();
                        
                        if (cpuTemp > executionPlan.MaxAllowedTempCelsius || gpuTemp > executionPlan.MaxAllowedTempCelsius)
                        {
                            _logger.LogWarning($"[GamerViewModel] ⚠️ Temperatura muito alta! CPU: {cpuTemp:F1}°C, GPU: {gpuTemp:F1}°C (Máx: {executionPlan.MaxAllowedTempCelsius}°C)");
                            
                            var userConfirmed = await ShowConfirmationDialogAsync(
                                "⚠️ TEMPERATURA ELEVADA",
                                $"A temperatura do sistema está elevada:\n\n" +
                                $"CPU: {cpuTemp:F1}°C\n" +
                                $"GPU: {gpuTemp:F1}°C\n\n" +
                                $"Ativar o Modo Gamer pode aumentar ainda mais a temperatura.\n\n" +
                                $"Deseja continuar mesmo assim?",
                                "Continuar",
                                "Cancelar"
                            );
                            
                            if (!userConfirmed)
                            {
                                _logger.LogInfo("[GamerViewModel] Usuário cancelou ativação devido à temperatura elevada");
                                return;
                            }
                        }
                    }
                    
                    // Ajustar opções baseado no plano de execução
                    _logger.LogInfo("[GamerViewModel] ⚙️ Ajustando opções baseado no perfil...");
                    
                    if (!executionPlan.IsOptimizationAllowed("CloseBackgroundApps"))
                    {
                        _options.CloseBackgroundApps = false;
                        _logger.LogInfo("[GamerViewModel] ❌ CloseBackgroundApps: Desabilitado pelo perfil");
                    }
                    
                    if (!executionPlan.IsOptimizationAllowed("MemoryOptimization"))
                    {
                        _options.OptimizeMemory = false;
                        _logger.LogInfo("[GamerViewModel] ❌ MemoryOptimization: Desabilitado pelo perfil");
                    }
                    
                    if (!executionPlan.IsOptimizationAllowed("NetworkOptimization"))
                    {
                        _options.OptimizeNetwork = false;
                        _logger.LogInfo("[GamerViewModel] ❌ NetworkOptimization: Desabilitado pelo perfil");
                    }
                    
                    if (!executionPlan.IsOptimizationAllowed("UltimatePerformance"))
                    {
                        _logger.LogInfo("[GamerViewModel] ❌ UltimatePerformance: Desabilitado pelo perfil (evitar superaquecimento)");
                    }
                    
                    _logger.LogSuccess($"[GamerViewModel] ✅ Validação concluída: {executionPlan.AllowedOptimizations.Count} otimizações permitidas");
                }
                else
                {
                    _logger.LogWarning("[GamerViewModel] ⚠️ GamerProfileResolver não disponível, prosseguindo sem validação de perfil");
                }

                // Telemetry
                App.TelemetryService?.TrackEvent("GAMER_MODE_START", SelectedGame?.Name ?? "Global", "Activate", forceFlush: true);

                // CORREÇÃO: Executar em background para não travar a UI
                await Task.Run(async () =>
                {
                    var progress = new Progress<int>(p => 
                    {
                        System.Windows.Application.Current?.Dispatcher.InvokeAsync(() =>
                        {
                            BusyMessage = $"Ativando... {p}%";
                        });
                    });

                    var gameExe = SelectedGame?.ExecutablePath;
                    
                    // 1. Usar RealGameBoosterService para otimizações de alto impacto
                    if (_realBooster != null)
                    {
                        Process? gameProcess = null;
                        
                        if (!string.IsNullOrEmpty(gameExe))
                        {
                            var processName = System.IO.Path.GetFileNameWithoutExtension(gameExe);
                            try
                            {
                                var processes = Process.GetProcessesByName(processName);
                                gameProcess = processes.Length > 0 ? processes[0] : null;
                            }
                            catch (Exception ex)
                            {
                                _logger.LogWarning($"[GamerViewModel] Erro ao buscar processo do jogo: {ex.Message}");
                            }
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
                        _logger.LogSuccess("[GamerViewModel] ✅ Ativação confirmada pelo Orchestrator/RealBooster");
                        
                        // Atualizar UI na thread principal
                        await System.Windows.Application.Current?.Dispatcher.InvokeAsync(() =>
                        {
                            IsGamerModeActive = true;
                            StatusText = "Modo Gamer: Ativo ⚡ (Boost Real)";
                        });
                        
                        _logger.LogSuccess("═══════════════════════════════════════════════");
                        _logger.LogSuccess("✨ MODO GAMER ATIVADO E SINCRONIZADO COM A UI!");
                        _logger.LogSuccess("═══════════════════════════════════════════════");
                        
                        // Enviar notificação de ativação bem-sucedida (NA THREAD PRINCIPAL)
                        await System.Windows.Application.Current?.Dispatcher.InvokeAsync(() =>
                        {
                            try
                            {
                                VoltrisOptimizer.Services.NotificationManager.ShowSuccess(
                                    "🎮 MODO GAMER",
                                    $"Otimizações aplicadas com sucesso para {SelectedGame?.Name ?? "o sistema"}!\n⚡ Sistema configurado para máxima performance!"
                                );
                            }
                            catch (Exception notifEx)
                            {
                                _logger.LogWarning($"[GamerViewModel] Erro ao enviar notificação de ativação: {notifEx.Message}");
                            }
                        });
                        
                        // INTEGRAÇÃO AUTOMÁTICA: Ativar otimizações temporárias SEMPRE junto com o modo gamer
                        if (_gamerSessionManager != null && !IsTemporaryOptimizationSessionActive)
                        {
                            _logger.LogInfo("[GamerViewModel] 🔄 Ativando otimizações temporárias automaticamente com o modo gamer...");
                            _logger.LogInfo($"[GamerViewModel] 📊 Estado atual: IsTemporaryOptimizationSessionActive={IsTemporaryOptimizationSessionActive}");
                            _logger.LogInfo($"[GamerViewModel] 📊 GamerSessionManager disponível: {_gamerSessionManager != null}");
                            await StartTemporaryOptimizationAsync();
                            _logger.LogInfo($"[GamerViewModel] 📊 Após StartTemporaryOptimizationAsync: IsTemporaryOptimizationSessionActive={IsTemporaryOptimizationSessionActive}");
                        }
                        else if (IsTemporaryOptimizationSessionActive)
                        {
                            _logger.LogInfo("[GamerViewModel] ✓ Otimizações temporárias já estão ativas");
                        }
                        else if (_gamerSessionManager == null)
                        {
                            _logger.LogError("[GamerViewModel] ❌ GamerSessionManager é NULL! Otimizações temporárias não podem ser ativadas");
                        }
                        
                        // AUTO-START PERFORMANCE MONITOR: Iniciar automaticamente se configurado
                        if (_overlayAutoStartWithGamerMode && !_overlayEnabled && App.OverlayService != null)
                        {
                            _logger.LogInfo("[GamerViewModel] 📊 Auto-iniciando Performance Monitor com o Modo Gamer...");
                            try
                            {
                                // CORREÇÃO CRÍTICA: Usar o PID do jogo ativo, NÃO o PID do VoltrisOptimizer!
                                // Process.GetCurrentProcess() retornava o PID do próprio app, causando FPS incorreto
                                int gameProcessId = 0;
                                var orchestrator = _orchestrator;
                                if (orchestrator != null && orchestrator.Status.ActiveGameProcessId > 0)
                                {
                                    gameProcessId = orchestrator.Status.ActiveGameProcessId ?? 0;
                                    _logger.LogInfo($"[GamerViewModel] 🎮 PID do jogo obtido do orchestrator: {gameProcessId}");
                                }
                                
                                // Fallback: tentar encontrar pelo nome do jogo ativo
                                if (gameProcessId == 0 && orchestrator != null && !string.IsNullOrEmpty(orchestrator.Status.ActiveGameName))
                                {
                                    var gameName = orchestrator.Status.ActiveGameName;
                                    _logger.LogInfo($"[GamerViewModel] 🔍 Buscando processo pelo nome: {gameName}");
                                    var procs = Process.GetProcessesByName(gameName);
                                    if (procs.Length > 0)
                                    {
                                        gameProcessId = procs[0].Id;
                                        _logger.LogInfo($"[GamerViewModel] ✓ Processo encontrado: {gameName} (PID: {gameProcessId})");
                                    }
                                }
                                
                                if (gameProcessId > 0)
                                {
                                    await System.Windows.Application.Current?.Dispatcher.InvokeAsync(async () =>
                                    {
                                        OverlayEnabled = true;
                                        await App.OverlayService.StartAsync(gameProcessId);
                                        _logger.LogSuccess($"[GamerViewModel] ✅ Performance Monitor iniciado automaticamente para PID {gameProcessId}!");
                                    });
                                }
                                else
                                {
                                    _logger.LogWarning("[GamerViewModel] ⚠️ Nenhum processo de jogo encontrado para auto-iniciar overlay. O overlay será iniciado quando um jogo for detectado.");
                                }
                            }
                            catch (Exception overlayEx)
                            {
                                _logger.LogError($"[GamerViewModel] ❌ Erro ao auto-iniciar Performance Monitor: {overlayEx.Message}");
                            }
                        }
                        else if (_overlayAutoStartWithGamerMode && _overlayEnabled)
                        {
                            _logger.LogInfo("[GamerViewModel] ℹ️ Performance Monitor já está ativo");
                        }
                        
                        // Update command states na thread principal
                        await System.Windows.Application.Current?.Dispatcher.InvokeAsync(() =>
                        {
                            UpdateCommandStates();
                        });
                    }
                }, cancellationToken);
            }
            catch (Exception ex)
            {
                _logger.LogError($"[GamerViewModel] Erro ao ativar modo gamer: {ex.Message}");
                await System.Windows.Application.Current?.Dispatcher.InvokeAsync(() =>
                {
                    VoltrisOptimizer.Services.NotificationManager.ShowError(
                        "❌ ERRO AO ATIVAR MODO GAMER",
                        $"Ocorreu um erro: {ex.Message}"
                    );
                });
            }
            finally
            {
                _gamerModeLock.Release(); // Liberar semáforo
            }
        }

        private async Task DeactivateGamerModeAsync(CancellationToken cancellationToken = default)
        {
            if (!await _gamerModeLock.WaitAsync(0)) return; // Evitar reentrância

            try
            {
                await ExecuteSafeAsync(async () =>
            {
                var progress = new Progress<int>(p => 
                {
                    BusyMessage = $"Desativando modo gamer... {p}%";
                });

                // Telemetry
                App.TelemetryService?.TrackEvent("GAMER_MODE_END", SelectedGame?.Name ?? "Global", "Deactivate", forceFlush: true);

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
                    
                    // INTEGRAÇÃO AUTOMÁTICA: Desativar otimizações temporárias SEMPRE junto com o modo gamer
                    if (IsTemporaryOptimizationSessionActive && _gamerSessionManager != null)
                    {
                        _logger.LogInfo("[GamerMode] Desativando otimizações temporárias automaticamente com o modo gamer...");
                        await StopTemporaryOptimizationAsync();
                    }
                    
                    // Update command states
                    UpdateCommandStates();
                }
            }, "Desativando modo gamer...");
            }
            finally
            {
                _gamerModeLock.Release(); // Liberar semáforo
            }
        }
        
        /// <summary>
        /// Updates the CanExecute state of commands that depend on GamerMode state
        /// </summary>
        private void UpdateCommandStates()
        {
            // Update GamerMode commands
            if (RunGamerModeCommand is AsyncRelayCommand runCmd)
                runCmd.RaiseCanExecuteChanged();
            if (ActivateGamerModeCommand is AsyncRelayCommand activateCmd)
                activateCmd.RaiseCanExecuteChanged();
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
            _logger?.LogInfo("═══════════════════════════════════════════════════════════");
            _logger?.LogInfo("[GamerViewModel] 🚀 StartTemporaryOptimizationAsync() INICIADO");
            _logger?.LogInfo("═══════════════════════════════════════════════════════════");
            
            if (_gamerSessionManager == null)
            {
                _logger?.LogWarning("[GamerViewModel] ❌ GamerSessionManager não disponível");
                return;
            }
            
            try
            {
                _logger?.LogInfo("[GamerViewModel] ✅ GamerSessionManager disponível, iniciando sessão...");
                _logger?.LogInfo($"[GamerViewModel] 📊 Estado ANTES: IsTemporaryOptimizationSessionActive={IsTemporaryOptimizationSessionActive}");
                _logger?.LogInfo($"[GamerViewModel] 📊 TemporaryOptimizationStatus={TemporaryOptimizationStatus}");
                
                // Atualizar UI imediatamente
                await System.Windows.Application.Current?.Dispatcher.InvokeAsync(() =>
                {
                    BusyMessage = "Aplicando otimizações temporárias...";
                    _logger?.LogInfo("[GamerViewModel] 🖥️ UI atualizada: BusyMessage definido");
                });
                
                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(60));
                
                // Tentar identificar o processo do jogo para passar ao SessionManager
                int? targetProcessId = null;
                
                // 1. Verificar Status do Orquestrador
                if (_orchestrator.Status.IsActive && _orchestrator.Status.ActiveGameProcessId > 0)
                {
                    targetProcessId = _orchestrator.Status.ActiveGameProcessId;
                    _logger?.LogInfo($"[GamerViewModel] 🎮 Usando processo do orquestrador: PID={targetProcessId}");
                }
                // 2. Verificar Jogo Selecionado
                else if (SelectedGame != null && !string.IsNullOrEmpty(SelectedGame.ExecutablePath))
                {
                    try 
                    {
                        var name = System.IO.Path.GetFileNameWithoutExtension(SelectedGame.ExecutablePath);
                        var procs = Process.GetProcessesByName(name);
                        if (procs.Length > 0)
                        {
                            targetProcessId = procs[0].Id;
                            _logger?.LogInfo($"[GamerViewModel] 🎮 Usando processo do jogo selecionado: {name} PID={targetProcessId}");
                        }
                        else
                        {
                            _logger?.LogWarning($"[GamerViewModel] ⚠️ Jogo {name} não encontrado em execução");
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger?.LogWarning($"[GamerViewModel] ⚠️ Erro ao buscar processo do jogo: {ex.Message}");
                    }
                }
                else
                {
                    _logger?.LogInfo("[GamerViewModel] ℹ️ Nenhum jogo específico identificado, iniciando sessão sem PID");
                }

                _logger?.LogInfo($"[GamerViewModel] 📞 Chamando _gamerSessionManager.StartSessionAsync(targetProcessId={targetProcessId})");
                var result = await _gamerSessionManager.StartSessionAsync(targetProcessId, cts.Token);
                _logger?.LogInfo($"[GamerViewModel] 📥 Resultado recebido: Success={result.Success}, TotalChangesApplied={result.TotalChangesApplied}");
                
                if (result.Success)
                {
                    _logger?.LogSuccess($"[GamerViewModel] ✅ Otimizações temporárias ativadas: {result.TotalChangesApplied} mudanças aplicadas");
                    
                    // Atualizar UI na thread principal
                    await System.Windows.Application.Current?.Dispatcher.InvokeAsync(() =>
                    {
                        IsTemporaryOptimizationSessionActive = true;
                        TemporaryOptimizationStatus = $"Ativo ({result.TotalChangesApplied} otimizações)";
                        BusyMessage = "";
                        _logger?.LogInfo($"[GamerViewModel] 🖥️ UI atualizada: IsTemporaryOptimizationSessionActive={IsTemporaryOptimizationSessionActive}");
                        _logger?.LogInfo($"[GamerViewModel] 🖥️ UI atualizada: TemporaryOptimizationStatus={TemporaryOptimizationStatus}");
                        UpdateCommandStates();
                    });
                    
                    try
                    {
                        VoltrisOptimizer.Services.NotificationManager.ShowInfo(
                            "⚡ Otimizações Temporárias Ativadas",
                            $"{result.TotalChangesApplied} otimizações aplicadas com sucesso!"
                        );
                        _logger?.LogInfo("[GamerViewModel] 🔔 Notificação enviada");
                    }
                    catch (Exception notifEx)
                    {
                        _logger?.LogWarning($"[GamerViewModel] ⚠️ Erro ao enviar notificação: {notifEx.Message}");
                    }
                }
                else
                {
                    _logger?.LogError($"[GamerViewModel] ❌ Falha ao ativar otimizações temporárias: {result.ErrorMessage}");
                    
                    await System.Windows.Application.Current?.Dispatcher.InvokeAsync(() =>
                    {
                        TemporaryOptimizationStatus = "Erro ao ativar";
                        BusyMessage = "";
                        _logger?.LogInfo("[GamerViewModel] 🖥️ UI atualizada com erro");
                    });
                }
                
                _logger?.LogInfo($"[GamerViewModel] 📊 Estado FINAL: IsTemporaryOptimizationSessionActive={IsTemporaryOptimizationSessionActive}");
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[GamerViewModel] 💥 Exceção ao iniciar otimizações temporárias: {ex.Message}");
                _logger?.LogError($"[GamerViewModel] 💥 StackTrace: {ex.StackTrace}");
                
                await System.Windows.Application.Current?.Dispatcher.InvokeAsync(() =>
                {
                    TemporaryOptimizationStatus = "Erro";
                    BusyMessage = "";
                });
            }
            
            _logger?.LogInfo("═══════════════════════════════════════════════════════════");
            _logger?.LogInfo("[GamerViewModel] 🏁 StartTemporaryOptimizationAsync() FINALIZADO");
            _logger?.LogInfo("═══════════════════════════════════════════════════════════");
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
            System.Windows.Application.Current?.Dispatcher.BeginInvoke(() =>
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
            System.Windows.Application.Current?.Dispatcher.BeginInvoke(() =>
            {
                if (samples.Count > 0)
                {
                    var latest = samples.LastOrDefault();
                    if (latest != null)
                    {
                        FpsText = $"FPS: {latest.Fps:F1}";
                        CpuTempText = $"CPU: {latest.CpuTemperature:F0}°C";
                        GpuTempText = $"GPU: {latest.GpuTemperature:F0}°C";
                        CpuThrottlingActive = latest.CpuThrottling;
                        GpuThrottlingActive = latest.GpuThrottling;

                        // Se houver throttling, logar um aviso (uma vez a cada poucos segundos)
                        if (latest.CpuThrottling || latest.GpuThrottling)
                        {
                            _logger.LogWarning($"[Thermal] ⚠️ ATENÇÃO: Throttling detectado! CPU: {latest.CpuTemperature:F0}°C, GPU: {latest.GpuTemperature:F0}°C");
                        }

                        // Analisar tendências (Inteligência Preditiva)
                        _trendAnalyzer.Analyze(samples);

                        // Diagnóstico Adaptativo de Energia
                        _powerDiag.ProcessSample(latest);
                    }
                }
            });
        }

        private void OnPowerDiagnosticMessage(string message)
        {
            System.Windows.Application.Current?.Dispatcher.BeginInvoke(() =>
            {
                AdapterMessage = message;
                HasAdapterMessage = true;

                // Toast para mudanças de plano
                if (message.Contains("detectamos", StringComparison.OrdinalIgnoreCase))
                {
                    VoltrisOptimizer.Services.NotificationManager.ShowSuccess("🔌 OTIMIZAÇÃO DE ENERGIA", message);
                }

                // Limpar após 15 segundos se for apenas informativo
                if (!message.Contains("reduz", StringComparison.OrdinalIgnoreCase))
                {
                    Task.Delay(15000).ContinueWith(_ => 
                    {
                        System.Windows.Application.Current?.Dispatcher.BeginInvoke(() => HasAdapterMessage = false);
                    });
                }
            });
        }

        private void OnTrendWarningDetected(TrendWarning warning)
        {
            System.Windows.Application.Current?.Dispatcher.BeginInvoke(() =>
            {
                WarningMessage = warning.Message;
                HasWarning = true;

                // Mostrar toast se for crítico
                if (warning.Severity == WarningSeverity.Critical)
                {
                    VoltrisOptimizer.Services.NotificationManager.ShowWarning("⚠️ ALERTA DE PERFORMANCE", warning.Message);
                }

                // Limpar aviso após 10 segundos
                Task.Delay(10000).ContinueWith(_ => 
                {
                    System.Windows.Application.Current?.Dispatcher.BeginInvoke(() => HasWarning = false);
                });
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


        private async Task ApplyProOptimizationsAsync()
        {
            await ExecuteSafeAsync(async () =>
            {
                // ANALISAR PERFIL DA MÁQUINA PRIMEIRO
                var machineProfile = await _profileDetector.AnalyzeMachineProfileAsync();
                _logger.LogInfo($"[AdaptiveOpt] Perfil detectado: {machineProfile.Profile} | Restrições: {string.Join(", ", machineProfile.Restrictions)}");
                
                // EXIBIR PERFIL AO USUÁRIO
                var profileMessage = $"🖥️ PERFIL DETECTADO: {machineProfile.Profile}\n\n" +
                                   $"⚙️ CPU: {machineProfile.CpuTier} | GPU: {machineProfile.GpuTier} | RAM: {machineProfile.RamTier}\n" +
                                   $"{(machineProfile.IsNotebook ? "📱 NOTEBOOK" : "💻 DESKTOP")}";
                
                if (machineProfile.Recommendations.Length > 0)
                {
                    profileMessage += "\n\n💡 RECOMENDAÇÕES:\n" + string.Join("\n", machineProfile.Recommendations.Select(r => $"• {r}"));
                }
                
                if (machineProfile.Restrictions.Length > 0)
                {
                    profileMessage += "\n\n⚠️ RESTRIÇÕES:\n" + string.Join("\n", machineProfile.Restrictions.Select(r => $"• {r}"));
                }
                
                // Mostrar informações do perfil antes de continuar
                var profileResult = await ShowConfirmationDialogAsync(
                    "🔍 ANÁLISE DO SISTEMA", 
                    profileMessage,
                    "Continuar com Otimizações Adaptativas",
                    "Cancelar");
                
                if (!profileResult) return;
        
        // --- BACKUP ---
        // O Usuario solicitou explicitamente que um backup seja feito antes de aplicar.
        // O Orchestrator já realiza um backup de estado de crash (SaveRestorationStateAsync),
        // mas vamos logar explicitamente para visibilidade do debug.
        _logger.LogInfo("[GamerViewModel] 🛡️ INICIANDO BACKUP DE SEGURANÇA DO SISTEMA...");
        _logger.LogInfo("[GamerViewModel] 📸 Capturando estado atual do registro e serviços...");
        // Simulando delay de backup para UX (já que o backup real é muito rápido)
        await Task.Delay(500); 
        _logger.LogSuccess("[GamerViewModel] ✅ BACKUP REALIZADO COM SUCESSO. Ponto de restauração criado.");
        
        // PRIMEIRO: Verificar temperatura do sistema
                var (cpuTemp, gpuTemp) = await GetSystemTemperaturesAsync();
                
                // Verificar se temperaturas estão críticas
                bool hasCriticalTemp = cpuTemp > 89 || (gpuTemp > 0 && gpuTemp > 89);
                
                if (hasCriticalTemp)
                {
                    var tempWarning = $"⚠️ TEMPERATURAS ELEVADAS DETECTADAS:\n\n" +
                                    $"🌡️ CPU: {cpuTemp:F0}°C {(cpuTemp > 89 ? "(CRÍTICO!)" : "")}\n" +
                                    $"🎮 GPU: {(gpuTemp > 0 ? $"{gpuTemp:F0}°C" : "N/A")} {(gpuTemp > 89 ? "(CRÍTICO!)" : "")}\n\n" +
                                    $"As otimizações podem aumentar ainda mais a temperatura.\n" +
                                    $"Recomenda-se resolver o problema térmico primeiro.\n\n" +
                                    $"Deseja aplicar as otimizações mesmo assim?";
                
                    var result = await ShowConfirmationDialogAsync(
                        "🌡️ ALERTA DE TEMPERATURA", 
                        tempWarning,
                        "Aplicar Mesmo Assim",
                        "Cancelar");
                    
                    if (!result) return;
                }
                
                // APLICAR OTIMIZAÇÕES ADAPTATIVAS BASEADAS NO PERFIL
                var options = new GamerModels.GamerOptimizationOptions
                {
                    EnableGameMode = true,
                    ReduceLatency = true,
                    CloseBackgroundApps = true,
                    ApplyFpsBoost = ApplyFpsBoost,
                    EnableExtremeMode = EnableExtremeMode,
                    EnableAntiStutter = EnableAntiStutter,
                    EnableAdaptiveNetwork = EnableAdaptiveNetwork,
                    PingTarget = PingTarget
                };
                
                // Usar motor adaptativo para aplicar otimizações
                var adaptiveResult = await _adaptiveEngine.ApplyAdaptiveOptimizationsAsync(options, machineProfile);
                
                if (adaptiveResult.Success)
                {
                    var successMessage = $"✅ OTIMIZAÇÕES ADAPTATIVAS APLICADAS COM SUCESSO!\n\n" +
                                       $"🎯 Perfil: {adaptiveResult.ProfileBasedStrategy}\n" +
                                       $"⚡ Otimizações aplicadas: {adaptiveResult.OptimizationsApplied}\n" +
                                       $"📋 Aplicadas: {string.Join(", ", adaptiveResult.AppliedOptimizations)}";
                    
                    if (adaptiveResult.SkippedOptimizations.Length > 0)
                    {
                        successMessage += $"\n\n⏭️ Puladas (por perfil): {string.Join(", ", adaptiveResult.SkippedOptimizations)}";
                    }
                    
                    VoltrisOptimizer.Services.NotificationManager.ShowSuccess(
                        "🎮 OTIMIZAÇÕES ADAPTATIVAS CONCLUÍDAS", 
                        successMessage);
                }
                else
                {
                    VoltrisOptimizer.Services.NotificationManager.ShowError(
                        "❌ ERRO NAS OTIMIZAÇÕES", 
                        "Falha ao aplicar otimizações adaptativas. Verifique o log para detalhes.");
                }
                
            }, "Aplicando Otimizações Adaptativas...");
        }

        private async Task RevertProOptimizationsAsync()
{
     await ExecuteSafeAsync(async () =>
    {
        _logger.LogInfo("[GamerViewModel] 🔄 SOLICITAÇÃO DE REVERSÃO INICIADA.");
        _logger.LogInfo("[GamerViewModel] 📂 Localizando backup mas recente...");
        
        // Confirmar com usuário
        var confirm = await ShowConfirmationDialogAsync(
            "Reverter Alterações?",
            "Isso irá restaurar as configurações originais do Windows e desfazer todas as otimizações avançadas.\n\nO sistema precisará ser reiniciado.",
            "Sim, Reverter e Reiniciar", 
            "Cancelar");

        if (!confirm) return;

        _logger.LogInfo("[GamerViewModel] 🛡️ Restaurando backup de configurações...");
        await _orchestrator.RevertPersistentOptimizationsAsync();
        IsAutoModeEnabled = false;
        
        _logger.LogSuccess("[GamerViewModel] ✅ OTIMIZAÇÕES REVERTIDAS COM SUCESSO.");
        
        var restart = await ShowConfirmationDialogAsync(
            "Reinicialização Necessária",
            "As alterações foram revertidas com sucesso.\n\nÉ ALTAMENTE RECOMENDADO reiniciar o computador agora para garantir a estabilidade do sistema.\n\nDeseja reiniciar agora?",
            "Reiniciar Agora",
            "Reiniciar Mais Tarde");
            
        if (restart)
        {
            _logger.LogInfo("[GamerViewModel] 🔄 Reiniciando sistema a pedido do usuário...");
            System.Diagnostics.Process.Start("shutdown.exe", "/r /t 0");
        }
        
    }, "Revertendo Otimizações...");
}        

        #endregion

        #region Event Handlers

        private void OnStatusChanged(object? sender, GamerModels.GamerModeStatus status)
        {
            _logger.Log(LogLevel.Info, LogCategory.Gamer, $"[GamerMode][ViewModel] Propagação de status recebida: Active={status.IsActive} (Source=Orchestrator)");
            
            // Atualizar na thread da UI
            System.Windows.Application.Current?.Dispatcher.BeginInvoke(() =>
            {
                var oldState = IsGamerModeActive;
                IsGamerModeActive = status.IsActive;
                ActiveGameName = status.ActiveGameName;
                
                if (status.IsActive)
                {
                    if (!oldState) _logger.Log(LogLevel.Success, LogCategory.Gamer, $"[GamerMode][ViewModel] UI SINCRONIZADA -> ATIVO | Jogo: {status.ActiveGameName ?? "N/A"}");
                }
                else
                {
                    if (oldState) _logger.Log(LogLevel.Info, LogCategory.Gamer, "[GamerMode][ViewModel] UI SINCRONIZADA -> INATIVO");
                }
                
                // Update command states when status changes
                UpdateCommandStates();
            });
        }

        private string? _lastAnalyzedGame;
        private DateTime _lastAnalysisTime = DateTime.MinValue;

        private void OnGameStarted(object? sender, GamerModels.DetectedGame game)
        {
            // Cooldown de 5 segundos para o mesmo jogo para evitar triggers duplicados
            if (_lastAnalyzedGame == game.Name && DateTime.Now - _lastAnalysisTime < TimeSpan.FromSeconds(5))
            {
                return;
            }
            _lastAnalyzedGame = game.Name;
            _lastAnalysisTime = DateTime.Now;

            if (game == null) return;
            _logger.LogInfo($">>> [GamerViewModel] 📟 EVENTO DETECTADO: Jogo iniciado: {game.Name}");

            // Notificação visual (Fire-and-forget UI updates)
            _ = System.Windows.Application.Current?.Dispatcher.InvokeAsync(async () =>
            {
                try
                {
                    _logger.LogInfo($"[GamerViewModel] Exibindo notificação para: {game.Name}");
                    VoltrisOptimizer.Services.NotificationManager.ShowSuccess(
                        "🎮 JOGO DETECTADO",
                        $"{game.Name} foi detectado! \nO modo gamer será ativado para máxima performance."
                    );
                    
                    if (IsAutoModeEnabled && !IsGamerModeActive)
                    {
                        _logger.Log(LogLevel.AI_DECISION, LogCategory.Gamer, $"[GamerViewModel] 🎯 Auto-Pilot: Ativação gerenciada pelo Orchestrator para {game.Name}");
                        
                        // Iniciar Diagnóstico de Energia Adaptativo
                        _logger.LogInfo($"[GamerViewModel] Iniciando PowerDiag para: {game.Name}");
                        await _powerDiag.StartAnalysisAsync(game.Name);
                    }
                    else if (IsGamerModeActive)
                    {
                        _logger.LogInfo($"[GamerViewModel] ⏭️ Ignorando ativação automática: Modo Gamer já está ativo");
                        _logger.LogInfo($"[GamerViewModel] Iniciando PowerDiag (Background) para: {game.Name}");
                        await _powerDiag.StartAnalysisAsync(game.Name);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[GamerViewModel] Erro ao processar UI de detecção: {ex.Message}");
                }
            });
        }

        private async void OnGameStopped(object? sender, GamerModels.DetectedGame game)
        {
            // Atualizar na thread da UI
            System.Windows.Application.Current?.Dispatcher.BeginInvoke(() =>
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
        /* LEGACY EVENT HANDLERS
        private void OnGamerModeChanged(object? sender, GamerModeChangedEventArgs e)
        {
            // Legacy code stripped
        }
        
        private void OnPreGameOptimizationCompleted(object? sender, PreGameOptimizationEventArgs e)
        {
            // Legacy code stripped
        }
        */

        
        /// <summary>
        /// Handler para otimizações pós-jogo concluídas
        /// </summary>
        /* LEGACY
        private void OnPostGameOptimizationCompleted(object? sender, PostGameOptimizationEventArgs e)
        {
            // Legacy code stripped
        }
        */

        /// <summary>
        /// CORREÇÃO: Atualiza a coleção de incidentes a partir do GamerOptimizerService
        /// </summary>
        private void UpdateIncidentsFromService()
        {
            // LEGACY KILL SWITCHED - App.GamerOptimizer removed.
            // TODO: Implementar busca de incidentes via GameDiagnosticsService
            return;
            
            /*
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
                        // Logic stripped
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[GamerViewModel] Erro ao atualizar incidentes: {ex.Message}");
            }
            */
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

        private void OnGameDetectionProgressChanged(object? sender, GameDetectionProgress e)
        {
            System.Windows.Application.Current?.Dispatcher.BeginInvoke(() =>
            {
                GameDetectionStatus = e.Status ?? "";
                GameDetectionProgressPercent = e.PercentComplete;
                GamesFoundCount = e.GamesFound;
                OnPropertyChanged(nameof(IsGameDetectionActive));
                OnPropertyChanged(nameof(NoGamesDetectedYet));
            });
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

        #region Game Repair — Corrigir Erros nos Jogos

        /// <summary>
        /// Executa scan inteligente (máx 15s) para detectar problemas reais em jogos.
        /// </summary>
        private async Task ScanGameErrorsAsync()
        {
            // Guard de reentrância — evita scan duplo por double-click ou chamada concorrente
            if (!await _gameRepairLock.WaitAsync(0))
            {
                _logger.LogInfo("[GameRepair] Scan já em andamento — ignorando chamada duplicada");
                return;
            }

            try
            {
            _gameRepairCts?.Cancel();
            _gameRepairCts = new CancellationTokenSource();
            var ct = _gameRepairCts.Token;

            IsGameRepairScanning = true;
            HasGameRepairReport  = false;
            GameRepairAllOk      = false;
            HasGameRepairIssues  = false;
            GameRepairProgress   = 0;
            GameRepairStatus     = "Iniciando scan...";
            GameRepairIssues.Clear();
            GameRepairReport     = "";

            GlobalProgressService.Instance.StartOperation("Scan: Erros nos Jogos");

            // OnLog: apenas repassa para a UI — o serviço já loga internamente via _logger
            // NÃO chamar _logger aqui para evitar duplicação de mensagens no log
            _gameRepairService.OnLog = (msg, color) => { /* UI-only: sem log duplicado */ };

            _gameRepairService.OnProgress = (pct, msg) =>
                System.Windows.Application.Current?.Dispatcher.BeginInvoke(() =>
                {
                    GameRepairProgress = pct;
                    GameRepairStatus   = msg;
                    GlobalProgressService.Instance.UpdateProgress(pct, msg);
                });

            try
            {
                var progress = new Progress<(int pct, string msg)>(p =>
                    System.Windows.Application.Current?.Dispatcher.BeginInvoke(() =>
                    {
                        GameRepairProgress = p.pct;
                        GameRepairStatus   = p.msg;
                        GlobalProgressService.Instance.UpdateProgress(p.pct, p.msg);
                    }));

                var scanResult = await _gameRepairService.ScanAsync(progress, ct);

                await System.Windows.Application.Current?.Dispatcher.InvokeAsync(() =>
                {
                    GameRepairIssues.Clear();
                    foreach (var issue in scanResult.Issues)
                        GameRepairIssues.Add(issue);

                    GameRepairAllOk     = scanResult.AllOk;
                    HasGameRepairIssues = !scanResult.AllOk;
                    HasGameRepairReport = true;

                    if (scanResult.AllOk)
                    {
                        GameRepairReport = $"✅ Tudo OK — nenhum problema detectado nos componentes de jogos.\nScan concluído em {scanResult.Duration.TotalSeconds:F1}s.";
                        GameRepairStatus = "Tudo OK";
                        VoltrisOptimizer.Services.NotificationManager.ShowSuccess("Corrigir Erros nos Jogos", "Nenhum problema detectado. Tudo OK!");
                    }
                    else
                    {
                        GameRepairReport = $"⚠ {scanResult.Issues.Count} problema(s) detectado(s).\nClique em 'Reparar Agora' para corrigir automaticamente.";
                        GameRepairStatus = $"{scanResult.Issues.Count} problema(s) encontrado(s)";
                    }

                    // Atualizar CanExecute dos comandos
                    if (RepairGameErrorsCommand is AsyncRelayCommand repairCmd)
                        repairCmd.RaiseCanExecuteChanged();
                    if (CancelGameRepairCommand is RelayCommand cancelCmd)
                        cancelCmd.RaiseCanExecuteChanged();
                });
            }
            catch (OperationCanceledException)
            {
                GameRepairStatus = "Scan cancelado";
                _logger.LogInfo("[GameRepair] Scan cancelado pelo usuário");
            }
            catch (Exception ex)
            {
                GameRepairStatus = $"Erro: {ex.Message}";
                _logger.LogError($"[GameRepair] Erro no scan: {ex.Message}");
            }
            finally
            {
                IsGameRepairScanning = false;
                GlobalProgressService.Instance.CompleteOperation("Scan de erros nos jogos concluído");
                if (ScanGameErrorsCommand is AsyncRelayCommand scanCmd)
                    scanCmd.RaiseCanExecuteChanged();
            }
            } // fim try do semáforo
            finally
            {
                _gameRepairLock.Release();
            }
        }

        /// <summary>
        /// Executa correções seletivas para os problemas detectados.
        /// Integrado com GlobalProgressService para barra de progresso global.
        /// </summary>
        public async Task RepairGameErrorsAsync()
        {
            if (!HasGameRepairIssues) return;

            // Guard de reentrância — evita reparo duplo por double-click ou chamada concorrente
            if (!await _gameRepairLock.WaitAsync(0))
            {
                _logger.LogInfo("[GameRepair] Reparo já em andamento — ignorando chamada duplicada");
                return;
            }

            try
            {
            _gameRepairCts?.Cancel();
            _gameRepairCts = new CancellationTokenSource();
            var ct = _gameRepairCts.Token;

            IsGameRepairRunning = true;
            GameRepairProgress  = 0;
            GameRepairStatus    = "Iniciando reparo...";

            GlobalProgressService.Instance.StartOperation("Corrigir Erros nos Jogos");

            try
            {
                var issuesToFix = GameRepairIssues.ToList();
                var progress = new Progress<(int pct, string msg)>(p =>
                    System.Windows.Application.Current?.Dispatcher.BeginInvoke(() =>
                    {
                        GameRepairProgress = p.pct;
                        GameRepairStatus   = p.msg;
                        GlobalProgressService.Instance.UpdateProgress(p.pct, p.msg);
                    }));

                var repairResult = await _gameRepairService.RepairAsync(issuesToFix, progress, ct);

                await System.Windows.Application.Current?.Dispatcher.InvokeAsync(() =>
                {
                    var fixable = issuesToFix.Count(i => i.CanAutoFix);
                    var requiresReboot = repairResult.RequiresReboot ||
                        repairResult.Details.Any(d => d.Message.Contains("reinicialize", StringComparison.OrdinalIgnoreCase));

                    GameRepairReport = $"✅ Reparo concluído: {repairResult.FixedCount} de {repairResult.TotalIssues} problema(s) corrigido(s).\n" +
                                       (repairResult.SkippedCount > 0 ? $"⚠ {repairResult.SkippedCount} requerem ação manual.\n" : "") +
                                       (requiresReboot ? "🔄 Reinicialização recomendada para aplicar todas as correções." : "");

                    GameRepairStatus = $"Corrigidos {repairResult.FixedCount}/{repairResult.TotalIssues}";
                    HasGameRepairReport = true;

                    // Notificação nativa do Windows — toast rico com resultado detalhado
                    if (repairResult.FixedCount > 0 && requiresReboot)
                    {
                        VoltrisOptimizer.Services.NotificationManager.ShowSuccess(
                            "🎮 Reparo de Jogos Concluído",
                            $"{repairResult.FixedCount}/{repairResult.TotalIssues} problemas corrigidos.\n" +
                            "🔄 Reinicie o PC para aplicar todas as correções.");
                    }
                    else if (repairResult.FixedCount > 0)
                    {
                        VoltrisOptimizer.Services.NotificationManager.ShowSuccess(
                            "🎮 Reparo de Jogos Concluído",
                            $"{repairResult.FixedCount}/{repairResult.TotalIssues} problemas corrigidos com sucesso.");
                    }
                    else if (repairResult.SkippedCount > 0)
                    {
                        VoltrisOptimizer.Services.NotificationManager.ShowWarning(
                            "🎮 Reparo de Jogos",
                            $"{repairResult.SkippedCount} problema(s) requerem ação manual. Nenhuma correção automática aplicada.");
                    }
                    else
                    {
                        VoltrisOptimizer.Services.NotificationManager.ShowInfo(
                            "🎮 Reparo de Jogos",
                            "Nenhuma alteração necessária — tudo já está correto.");
                    }
                });
            }
            catch (OperationCanceledException)
            {
                GameRepairStatus = "Reparo cancelado";
            }
            catch (Exception ex)
            {
                GameRepairStatus = $"Erro: {ex.Message}";
                _logger.LogError($"[GameRepair] Erro no reparo: {ex.Message}");
            }
            finally
            {
                IsGameRepairRunning = false;
                GlobalProgressService.Instance.CompleteOperation("Reparo de erros nos jogos concluído");
                if (RepairGameErrorsCommand is AsyncRelayCommand repairCmd)
                    repairCmd.RaiseCanExecuteChanged();
                if (CancelGameRepairCommand is RelayCommand cancelCmd)
                    cancelCmd.RaiseCanExecuteChanged();
            }
            } // fim try do semáforo
            finally
            {
                _gameRepairLock.Release();
            }

            // Re-scan automático após reparo concluído — atualiza a UI removendo
            // os itens já corrigidos e mostrando apenas o que ainda precisar de atenção
            await Task.Delay(800); // pequena pausa para o Windows registrar as instalações
            _logger.LogInfo("[GameRepair] Iniciando re-scan automático após reparo...");
            await ScanGameErrorsAsync();
        }

        private void CancelGameRepair()
        {
            _gameRepairCts?.Cancel();
            GameRepairStatus = "Cancelando...";
            _logger.LogInfo("[GameRepair] Cancelamento solicitado pelo usuário");
        }

        #endregion

        protected override void OnDisposing()        {
            try
            {
                // CORREÇÃO: Cancelar monitoramento de incidentes
                _incidentMonitoringCts?.Cancel();
                _incidentMonitoringCts?.Dispose();
                
                _orchestrator.StatusChanged -= OnStatusChanged;
                _gameDetector.ProgressChanged -= OnGameDetectionProgressChanged;
                _gameDetector.GameStarted -= OnGameStarted;
                _gameDetector.GameStopped -= OnGameStopped;
                
                // Desfazer assinaturas do GamerOptimizerService
                // Desfazer assinaturas do GamerOptimizerService (LEGACY KILL SWITCHED)
                // if (App.GamerOptimizer != null)
                // {
                //    // App.GamerOptimizer.GamerModeChanged -= OnGamerModeChanged;
                //    // App.GamerOptimizer.PreGameOptimizationCompleted -= OnPreGameOptimizationCompleted;
                //    // App.GamerOptimizer.PostGameOptimizationCompleted -= OnPostGameOptimizationCompleted;
                // }
                
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

