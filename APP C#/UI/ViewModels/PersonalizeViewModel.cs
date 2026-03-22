using System;
using System.Collections.ObjectModel;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Input;
using System.Linq;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Services.Personalize;

namespace VoltrisOptimizer.UI.ViewModels
{
    public class PersonalizeViewModel : ViewModelBase
    {
        private const string TAG = "[PersonalizeVM]";

        private readonly SystemTweaksService _tweaks;
        private readonly GpuControlService _gpu;
        private readonly ILoggingService _logger;
        private readonly TaskbarControlService _taskbarCtrl;
        private readonly VoltrisBlurService _explorerBlur;
        private readonly Windows11IconsService _win11Icons;
        private readonly CursorThemeService _cursorTheme;

        private PersonalizeProfile _selectedProfile = PersonalizeProfile.Normal;
        public PersonalizeProfile SelectedProfile
        {
            get => _selectedProfile;
            set
            {
                if (SetProperty(ref _selectedProfile, value))
                {
                    _logger.LogInfo($"{TAG} Perfil selecionado: {value}");
                    OnPropertyChanged(nameof(IsCustomProfile));
                }
            }
        }
        public bool IsCustomProfile => SelectedProfile == PersonalizeProfile.Custom;

        public ObservableCollection<string> ProfileNames { get; } = new()
        {
            "Normal", "Performance", "Ultra", "Custom"
        };

        private string _selectedProfileName = "Normal";
        public string SelectedProfileName
        {
            get => _selectedProfileName;
            set
            {
                if (SetProperty(ref _selectedProfileName, value))
                {
                    SelectedProfile = value switch
                    {
                        "Performance" => PersonalizeProfile.Performance,
                        "Ultra"       => PersonalizeProfile.Ultra,
                        "Custom"      => PersonalizeProfile.Custom,
                        _             => PersonalizeProfile.Normal
                    };
                }
            }
        }

        // â”€â”€ AnimaÃ§Ãµes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

        private bool _windowAnimations = true;
        public bool WindowAnimations
        {
            get => _windowAnimations;
            set { if (SetProperty(ref _windowAnimations, value)) _ = _tweaks.SetWindowAnimationsAsync(value); }
        }

        private bool _menuAnimations = true;
        public bool MenuAnimations
        {
            get => _menuAnimations;
            set { if (SetProperty(ref _menuAnimations, value)) _ = _tweaks.SetMenuAnimationsAsync(value); }
        }

        private bool _taskbarAnimations = true;
        public bool TaskbarAnimations
        {
            get => _taskbarAnimations;
            set { if (SetProperty(ref _taskbarAnimations, value)) _ = _tweaks.SetTaskbarAnimationsAsync(value); }
        }

        private bool _dropShadows = true;
        public bool DropShadows
        {
            get => _dropShadows;
            set { if (SetProperty(ref _dropShadows, value)) _ = _tweaks.SetDropShadowsAsync(value); }
        }

        private bool _fontSmoothing = true;
        public bool FontSmoothing
        {
            get => _fontSmoothing;
            set { if (SetProperty(ref _fontSmoothing, value)) _ = _tweaks.SetFontSmoothingAsync(value); }
        }

        private bool _transparencyEffects = true;
        public bool TransparencyEffects
        {
            get => _transparencyEffects;
            set { if (SetProperty(ref _transparencyEffects, value)) _ = _tweaks.SetTransparencyEffectsAsync(value); }
        }

        private bool _hardwareAcceleration = false;
        public bool HardwareAcceleration
        {
            get => _hardwareAcceleration;
            set { if (SetProperty(ref _hardwareAcceleration, value)) _ = _tweaks.SetHardwareAccelerationAsync(value); }
        }

        private bool _explorerHighPerf = false;
        public bool ExplorerHighPerf
        {
            get => _explorerHighPerf;
            set { if (SetProperty(ref _explorerHighPerf, value)) _ = _tweaks.SetExplorerResponsivenessAsync(value); }
        }

        // â”€â”€ GPU â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

        private bool _hardwareScheduling = false;
        public bool HardwareScheduling
        {
            get => _hardwareScheduling;
            set
            {
                if (SetProperty(ref _hardwareScheduling, value))
                    _ = _gpu.SetHardwareSchedulingAsync(value);
            }
        }

        private bool _gamingGpuPriority = false;
        public bool GamingGpuPriority
        {
            get => _gamingGpuPriority;
            set
            {
                if (SetProperty(ref _gamingGpuPriority, value))
                    _ = _gpu.SetGamingGpuPriorityAsync(value);
            }
        }

        private bool _mpoEnabled = true;
        public bool MpoEnabled
        {
            get => _mpoEnabled;
            set
            {
                if (SetProperty(ref _mpoEnabled, value))
                    _ = _gpu.SetMpoAsync(value);
            }
        }

        private bool _taskbarCenteringEnabled = false;
        public bool TaskbarCenteringEnabled
        {
            get => _taskbarCenteringEnabled;
            set
            {
                if (SetProperty(ref _taskbarCenteringEnabled, value))
                {
                    // Centralização só funciona no Windows 10 — Win11 já centraliza nativamente
                    if (IsWin11)
                    {
                        _logger.LogInfo($"{TAG} [Taskbar] Centralização ignorada — Windows 11 já centraliza ícones nativamente.");
                        _taskbarCenteringEnabled = false;
                        OnPropertyChanged(nameof(TaskbarCenteringEnabled));
                        return;
                    }
                    _logger.LogInfo($"{TAG} [Taskbar] Centralização: {value}");
                    _taskbarCtrl.SetCentering(value);

                    // CORREÇÃO CRÍTICA: Se o usuário quer centralizar, o app PRECISA iniciar com o Windows
                    // para manter o efeito após o reboot (já que o Win10 não tem registro nativo para isso).
                    if (value && !SettingsService.Instance.Settings.StartWithWindows)
                    {
                        _logger.LogInfo($"{TAG} [Taskbar] Ativando 'Iniciar com o Windows' automaticamente para persistência.");
                        SettingsService.Instance.Settings.StartWithWindows = true;
                        try 
                        {
                            new StartupManager(_logger).SetStartup(true, SettingsService.Instance.Settings.StartMinimized);
                        }
                        catch (Exception ex) 
                        {
                            _logger.LogWarning($"{TAG} [Taskbar] Falha ao configurar startup automático: {ex.Message}");
                        }
                    }

                    // Persistir escolha do usuário
                    SettingsService.Instance.Settings.TaskbarCenteringEnabled = value;
                    SettingsService.Instance.SaveSettings();
                }
            }
        }

        private bool _taskbarStyleEnabled = false;
        public bool TaskbarStyleEnabled
        {
            get => _taskbarStyleEnabled;
            set
            {
                if (SetProperty(ref _taskbarStyleEnabled, value))
                {
                    _logger.LogInfo($"{TAG} [Taskbar] Estilo visual: {value}");
                    ApplyTaskbarStyle();
                    SettingsService.Instance.Settings.TaskbarStyleEnabled = value;
                    SettingsService.Instance.SaveSettings();
                }
            }
        }

        private int _taskbarStyleIndex = 0; // 0=Transparent 1=Blur 2=Acrylic 3=Gradient
        public int TaskbarStyleIndex
        {
            get => _taskbarStyleIndex;
            set
            {
                if (SetProperty(ref _taskbarStyleIndex, value))
                {
                    _logger.LogInfo($"{TAG} [Taskbar] StyleIndex alterado para {value}");
                    if (_taskbarStyleEnabled) ApplyTaskbarStyle();
                    SettingsService.Instance.Settings.TaskbarStyleIndex = value;
                    SettingsService.Instance.SaveSettings();
                }
            }
        }

        private int _taskbarOpacity = 255;
        public int TaskbarOpacity
        {
            get => _taskbarOpacity;
            set
            {
                if (SetProperty(ref _taskbarOpacity, value))
                {
                    _logger.LogInfo($"{TAG} [Taskbar] Opacidade: {value}");
                    if (_taskbarStyleEnabled) ScheduleApplyTaskbarStyle();
                    SettingsService.Instance.Settings.TaskbarOpacity = value;
                    // Não salvar aqui imediatamente por causa do debounce — salvar no apply
                }
            }
        }

        // Debounce: cancela chamadas anteriores e aplica após 80ms sem mudança
        private CancellationTokenSource? _styleDebounce;
        private void ScheduleApplyTaskbarStyle()
        {
            _styleDebounce?.Cancel();
            _styleDebounce = new CancellationTokenSource();
            var token = _styleDebounce.Token;
            Task.Run(async () =>
            {
                try
                {
                    await Task.Delay(80, token); // 80ms debounce
                    if (!token.IsCancellationRequested)
                    {
                        _logger.LogDebug($"{TAG} [Taskbar] Debounce disparado — aplicando estilo.", source: "PersonalizeVM");
                        ApplyTaskbarStyle();
                        // Salvar opacidade após aplicar (debounce garante que não salvamos a cada tick do slider)
                        SettingsService.Instance.Settings.TaskbarOpacity = _taskbarOpacity;
                        SettingsService.Instance.SaveSettings();
                    }
                }
                catch (OperationCanceledException) { /* cancelado por nova mudança */ }
            }, token);
        }

        private void ApplyTaskbarStyle()
        {
            var mode = (TaskbarStyleMode)_taskbarStyleIndex;
            byte opacity = (byte)Math.Clamp(_taskbarOpacity, 0, 255);
            _logger.LogDebug($"{TAG} [Taskbar] ApplyTaskbarStyle: enabled={_taskbarStyleEnabled} mode={mode} opacity={opacity}", source: "PersonalizeVM");
            _taskbarCtrl.SetVoltrisBlurActive(false);
            _taskbarCtrl.SetStyle(_taskbarStyleEnabled, mode, opacity);
        }

        private string _gpuName = "Detectando...";
        public string GpuName
        {
            get => _gpuName;
            set => SetProperty(ref _gpuName, value);
        }

        // â”€â”€ DiagnÃ³stico â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

        private string _bottleneckReport = string.Empty;
        public string BottleneckReport
        {
            get => _bottleneckReport;
            set => SetProperty(ref _bottleneckReport, value);
        }

        private string _statusMessage = string.Empty;
        public string StatusMessage
        {
            get => _statusMessage;
            set => SetProperty(ref _statusMessage, value);
        }

        private string _statusColor = "#00FF88";
        public string StatusColor
        {
            get { return _statusColor; }
            set { SetProperty(ref _statusColor, value); }
        }

        public bool IsWindows11 => SystemInfoService.IsWindows11;
        public bool IsWindows10 => !IsWindows11;

        // ── Ícones do Windows 11 ──────────────────────────────────────────

        private bool _win11IconsEnabled = false;
        public bool Win11IconsEnabled
        {
            get => _win11IconsEnabled;
            set
            {
                if (SetProperty(ref _win11IconsEnabled, value))
                {
                    _logger.LogInfo($"{TAG} [Win11Icons] Alterando estado para: {value}");
                    _ = ApplyWin11IconsAsync(value);
                }
            }
        }

        // ── Cursor Personalizado ──────────────────────────────────────────────────────

        public System.Collections.ObjectModel.ObservableCollection<CursorThemeInfo> AvailableCursorThemes { get; } = new();

        private CursorThemeInfo? _selectedCursorTheme;
        public CursorThemeInfo? SelectedCursorTheme
        {
            get => _selectedCursorTheme;
            set
            {
                if (SetProperty(ref _selectedCursorTheme, value))
                {
                    _logger.LogInfo($"{TAG} [Cursor] Tema selecionado com aplicação em tempo real: {value?.Name ?? "(nenhum)"}");
                    if (value != null)
                    {
                        // APLICAÇÃO INSTANTÂNEA EM TEMPO REAL
                        _ = ApplyCursorThemeAsync();
                    }
                }
            }
        }

        private string _cursorStatusMessage = string.Empty;
        public string CursorStatusMessage
        {
            get => _cursorStatusMessage;
            set => SetProperty(ref _cursorStatusMessage, value);
        }

        private string _cursorStatusColor = "#00FF88";
        public string CursorStatusColor
        {
            get => _cursorStatusColor;
            set => SetProperty(ref _cursorStatusColor, value);
        }

        public ICommand ApplyCursorThemeCommand  { get; private set; } = null!;
        public ICommand RestoreCursorCommand     { get; private set; } = null!;

        private async Task ApplyWin11IconsAsync(bool enable)
        {
            await RunBusyAsync(async () =>
            {
                SetStatus(enable ? "Aplicando ícones do Windows 11..." : "Revertendo ícones...", "#31A8FF");
                bool ok = enable ? await _win11Icons.InstallIconsAsync() : await _win11Icons.UninstallIconsAsync();
                
                if (ok)
                {
                    SetStatus(enable ? "Ícones aplicados com sucesso! (Explorer reiniciado)" : "Ícones revertidos! (Explorer reiniciado)", "#00FF88");
                    _logger.LogSuccess($"{TAG} [Win11Icons] Ação '{(enable ? "Apply" : "Revert")}' completada sem tocar em DLLs.");
                }
                else
                {
                    SetStatus("Falha ao configurar ícones. Verifique os logs.", "#FF4466");
                    // Reverte o visual toggle para o estado real
                    _win11IconsEnabled = _win11Icons.IsInstalled();
                    OnPropertyChanged(nameof(Win11IconsEnabled));
                }
            }, busyMessage: enable ? "Modificando Registro para Ícones Win11..." : "Limpando mapeamento de ícones...");
        }

        // â”€â”€ Explorer Blur Mica â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

        private bool _explorerBlurDllPresent = false;
        public bool ExplorerBlurDllPresent
        {
            get => _explorerBlurDllPresent;
            set => SetProperty(ref _explorerBlurDllPresent, value);
        }

        private bool _explorerBlurInstalled = false;
        public bool ExplorerBlurInstalled
        {
            get => _explorerBlurInstalled;
            set
            {
                if (SetProperty(ref _explorerBlurInstalled, value))
                {
                    _logger.LogInfo($"{TAG} [Explorer] ExplorerBlurInstalled={value} — notificando TaskbarControlService.");
                    _taskbarCtrl.SetVoltrisBlurActive(value);
                    // Se desinstalado e estilo nativo estava ativo, reaplicar
                    if (!value && _taskbarStyleEnabled)
                    {
                        _logger.LogInfo($"{TAG} [Explorer] VoltrisBlur desinstalado — reaplicando estilo nativo da taskbar.");
                        ApplyTaskbarStyle();
                    }
                }
            }
        }

        private int _explorerEffectIndex = 1; // 1=Acrylic default
        public int ExplorerEffectIndex
        {
            get => _explorerEffectIndex;
            set { if (SetProperty(ref _explorerEffectIndex, value)) _logger.LogDebug($"{TAG} [Explorer] EffectIndex={value}", source: "PersonalizeVM"); }
        }

        private bool _explorerClearAddress = true;
        public bool ExplorerClearAddress
        {
            get => _explorerClearAddress;
            set { if (SetProperty(ref _explorerClearAddress, value)) _logger.LogDebug($"{TAG} [Explorer] ClearAddress={value}", source: "PersonalizeVM"); }
        }

        private bool _explorerClearBarBg = true;
        public bool ExplorerClearBarBg
        {
            get => _explorerClearBarBg;
            set { if (SetProperty(ref _explorerClearBarBg, value)) _logger.LogDebug($"{TAG} [Explorer] ClearBarBg={value}", source: "PersonalizeVM"); }
        }

        private bool _explorerClearWinUIBg = true; // Win11: SEMPRE true — clearWinUIBg=true é necessário para blur na página Início (WinUI3)
        public bool ExplorerClearWinUIBg
        {
            get => _explorerClearWinUIBg;
            set
            {
                if (SetProperty(ref _explorerClearWinUIBg, value))
                    _logger.LogDebug($"{TAG} [Explorer] ClearWinUIBg={value}", source: "PersonalizeVM");
            }
        }

        public bool IsWin11 => Environment.OSVersion.Version.Build >= 22000;
        public bool IsWin10 => Environment.OSVersion.Version.Build < 22000;

        private bool _explorerShowLine = false;
        public bool ExplorerShowLine
        {
            get => _explorerShowLine;
            set { if (SetProperty(ref _explorerShowLine, value)) _logger.LogDebug($"{TAG} [Explorer] ShowLine={value}", source: "PersonalizeVM"); }
        }

        private int _explorerAlpha = 120;
        public int ExplorerAlpha
        {
            get => _explorerAlpha;
            set { if (SetProperty(ref _explorerAlpha, value)) _logger.LogDebug($"{TAG} [Explorer] Alpha={value}", source: "PersonalizeVM"); }
        }

        private int _explorerColorR = 0;
        public int ExplorerColorR
        {
            get => _explorerColorR;
            set { if (SetProperty(ref _explorerColorR, value)) _logger.LogDebug($"{TAG} [Explorer] R={value}", source: "PersonalizeVM"); }
        }

        private int _explorerColorG = 0;
        public int ExplorerColorG
        {
            get => _explorerColorG;
            set { if (SetProperty(ref _explorerColorG, value)) _logger.LogDebug($"{TAG} [Explorer] G={value}", source: "PersonalizeVM"); }
        }

        private int _explorerColorB = 0;
        public int ExplorerColorB
        {
            get => _explorerColorB;
            set { if (SetProperty(ref _explorerColorB, value)) _logger.LogDebug($"{TAG} [Explorer] B={value}", source: "PersonalizeVM"); }
        }

        public ICommand InstallExplorerBlurCommand { get; private set; } = null!;
        public ICommand UninstallExplorerBlurCommand { get; private set; } = null!;

        public ICommand ApplyProfileCommand { get; }
        public ICommand DetectBottlenecksCommand { get; }
        public ICommand RestoreDefaultsCommand { get; }
        public ICommand LoadCommand { get; }

        // â”€â”€ Construtor â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

        public PersonalizeViewModel(
            SystemTweaksService tweaks,
            GpuControlService gpu,
            ILoggingService logger,
            TaskbarControlService taskbarCtrl,
            VoltrisBlurService explorerBlur,
            Windows11IconsService win11Icons,
            CursorThemeService cursorTheme)
        {
            _tweaks       = tweaks       ?? throw new ArgumentNullException(nameof(tweaks));
            _gpu          = gpu          ?? throw new ArgumentNullException(nameof(gpu));
            _logger       = logger       ?? throw new ArgumentNullException(nameof(logger));
            _taskbarCtrl  = taskbarCtrl  ?? throw new ArgumentNullException(nameof(taskbarCtrl));
            _explorerBlur = explorerBlur ?? throw new ArgumentNullException(nameof(explorerBlur));
            _win11Icons   = win11Icons   ?? throw new ArgumentNullException(nameof(win11Icons));
            _cursorTheme  = cursorTheme  ?? throw new ArgumentNullException(nameof(cursorTheme));

            ApplyProfileCommand       = new AsyncRelayCommand(p => ApplyProfileAsync(p as string));
            DetectBottlenecksCommand  = new AsyncRelayCommand(_ => DetectBottlenecksAsync());
            RestoreDefaultsCommand    = new AsyncRelayCommand(_ => RestoreDefaultsAsync());
            LoadCommand               = new AsyncRelayCommand(_ => LoadAsync());
            InstallExplorerBlurCommand   = new AsyncRelayCommand(_ => InstallExplorerBlurAsync());
            UninstallExplorerBlurCommand = new AsyncRelayCommand(_ => UninstallExplorerBlurAsync());
            ApplyCursorThemeCommand  = new AsyncRelayCommand(p =>
            {
                // Se chamado via MouseBinding do card, p é o CursorThemeInfo — selecionar + aplicar
                if (p is CursorThemeInfo theme)
                    SelectedCursorTheme = theme;
                return ApplyCursorThemeAsync();
            });
            RestoreCursorCommand = new AsyncRelayCommand(_ => RestoreCursorAsync());

            ExplorerBlurDllPresent = _explorerBlur.IsDllPresent();
            ExplorerBlurInstalled  = _explorerBlur.IsInstalled;

            // Assinar o evento para atualizar o botão ASSIM QUE a verificação de registro terminar
            // (independentemente de o usuário abrir a página PERSONALIZAR)
            _explorerBlur.InstalledStateResolved += OnExplorerBlurInstalledStateResolved;

            // Popular lista de temas de cursor (snapshot inicial)
            LoadCursorThemes();

            _logger.LogInfo($"{TAG} ViewModel criado.");
            _logger.LogInfo($"{TAG} [Explorer] DLL presente: {ExplorerBlurDllPresent}");
            _logger.LogInfo($"{TAG} [Explorer] Já instalado: {ExplorerBlurInstalled}");
        }

        // â”€â”€ Carregamento inicial â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

        public async Task LoadAsync()
        {
            _logger.LogInfo($"{TAG} [LoadAsync] Iniciando carregamento...");
            await RunBusyAsync(() => LoadInternalAsync(), busyMessage: "Carregando configurações...");
        }

        // Carregamento sem guard IsBusy â€” para ser chamado dentro de outros RunBusyAsync
        private async Task LoadInternalAsync()
        {
            var animState = await _tweaks.GetAnimationStateAsync();
            WindowAnimations  = animState.WindowAnimations;
            MenuAnimations    = animState.MenuAnimations;
            TaskbarAnimations = animState.TaskbarAnimations;
            DropShadows       = animState.DropShadows;
            FontSmoothing     = animState.FontSmoothing;

            var perfState = await _tweaks.GetVisualPerformanceStateAsync();
            TransparencyEffects  = perfState.TransparencyEffects;
            HardwareAcceleration = perfState.HardwareAcceleration;

            HardwareScheduling = await _gpu.GetHardwareSchedulingEnabledAsync();
            MpoEnabled         = await _gpu.GetMpoEnabledAsync();

            var gpus = await _gpu.GetGpuInfoAsync();
            GpuName = gpus.Count > 0 ? gpus[0].Name : "GPU não detectada";

            // Sincronizar UI com o estado atual dos ícones do Windows 11 no Registro
            _win11IconsEnabled = _win11Icons.IsInstalled();
            OnPropertyChanged(nameof(Win11IconsEnabled));
            _logger.LogInfo($"{TAG} [LoadAsync] Ícones Win11 habilitados: {_win11IconsEnabled}");

            // Popular lista de temas de cursor (atualizada se novos forem adicionados à pasta)
            LoadCursorThemes();

            // Aguardar verificação do estado do VoltrisBlur (evita race condition no construtor)
            ExplorerBlurInstalled = await _explorerBlur.GetInstalledStateAsync();
            _logger.LogInfo($"{TAG} [LoadAsync] VoltrisBlur instalado: {ExplorerBlurInstalled}");
            // Sincronizar TaskbarControlService com o estado atual do VoltrisBlur
            _taskbarCtrl.SetVoltrisBlurActive(ExplorerBlurInstalled);

            // Restaurar tema de cursor selecionado
            var savedThemeName = SettingsService.Instance.Settings.SelectedCursorTheme;
            if (!string.IsNullOrEmpty(savedThemeName))
            {
                var found = AvailableCursorThemes.FirstOrDefault(t =>
                    string.Equals(t.Name, savedThemeName, StringComparison.OrdinalIgnoreCase));
                if (found != null)
                {
                    _selectedCursorTheme = found;
                    OnPropertyChanged(nameof(SelectedCursorTheme));
                    _logger.LogInfo($"{TAG} [Cursor] Tema salvo restaurado na UI: '{savedThemeName}'");
                }
                else
                {
                    _logger.LogWarning($"{TAG} [Cursor] Tema salvo '{savedThemeName}' não encontrado na pasta.");
                }
            }
            else
            {
                _logger.LogInfo($"{TAG} [Cursor] Nenhum tema de cursor salvo (usando padrão do Windows).");
            }

            // Restaurar configurações persistidas do VoltrisBlur (sliders)
            var sv = SettingsService.Instance.Settings;
            _explorerEffectIndex   = sv.VoltrisBlurEffectIndex;
            _explorerClearAddress  = sv.VoltrisBlurClearAddress;
            _explorerClearBarBg    = sv.VoltrisBlurClearBarBg;
            _explorerClearWinUIBg  = sv.VoltrisBlurClearWinUIBg;
            _explorerShowLine      = sv.VoltrisBlurShowLine;
            _explorerAlpha         = sv.VoltrisBlurAlpha;
            _explorerColorR        = sv.VoltrisBlurColorR;
            _explorerColorG        = sv.VoltrisBlurColorG;
            _explorerColorB        = sv.VoltrisBlurColorB;
            OnPropertyChanged(nameof(ExplorerEffectIndex));
            OnPropertyChanged(nameof(ExplorerClearAddress));
            OnPropertyChanged(nameof(ExplorerClearBarBg));
            OnPropertyChanged(nameof(ExplorerClearWinUIBg));
            OnPropertyChanged(nameof(ExplorerShowLine));
            OnPropertyChanged(nameof(ExplorerAlpha));
            OnPropertyChanged(nameof(ExplorerColorR));
            OnPropertyChanged(nameof(ExplorerColorG));
            OnPropertyChanged(nameof(ExplorerColorB));
            _logger.LogInfo($"{TAG} [LoadAsync] VoltrisBlur sliders restaurados: Effect={_explorerEffectIndex} Alpha={_explorerAlpha} R={_explorerColorR} G={_explorerColorG} B={_explorerColorB}");

            // Restaurar configurações persistidas do Taskbar (salvas pelo usuário)
            var s = SettingsService.Instance.Settings;
            _logger.LogInfo($"{TAG} [LoadAsync] Restaurando estado do Taskbar — CenteringEnabled={s.TaskbarCenteringEnabled} StyleEnabled={s.TaskbarStyleEnabled} StyleIndex={s.TaskbarStyleIndex} Opacity={s.TaskbarOpacity}");

            // Definir campos internos diretamente (sem passar pelo setter público) para evitar
            // salvar de volta e para controlar a ordem de restauração
            _taskbarStyleIndex   = s.TaskbarStyleIndex;
            _taskbarOpacity      = s.TaskbarOpacity;
            _taskbarStyleEnabled = s.TaskbarStyleEnabled;
            OnPropertyChanged(nameof(TaskbarStyleIndex));
            OnPropertyChanged(nameof(TaskbarOpacity));
            OnPropertyChanged(nameof(TaskbarStyleEnabled));

            if (_taskbarStyleEnabled)
                ApplyTaskbarStyle();

            // Restaurar centralização por último (garante loop já está ativo se style também ativo)
            if (s.TaskbarCenteringEnabled && !IsWin11)
            {
                _taskbarCenteringEnabled = true;
                OnPropertyChanged(nameof(TaskbarCenteringEnabled));
                _taskbarCtrl.SetCentering(true);
                _logger.LogInfo($"{TAG} [LoadAsync] Centralização do Taskbar restaurada e aplicada.");
            }

            SetStatus("Configurações carregadas.", "#00FF88");
            _logger.LogSuccess($"{TAG} [LoadAsync] Carregamento concluído. GPU={GpuName}");
        }

        // â”€â”€ Aplicar perfil â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

        private async Task ApplyProfileAsync(string? profileParam = null)
        {
            // Resolver perfil a partir do CommandParameter (botÃµes do XAML) ou do SelectedProfile
            if (profileParam != null)
            {
                SelectedProfileName = profileParam;
            }

            _logger.LogInfo($"{TAG} [ApplyProfileAsync] Aplicando perfil: {SelectedProfile}");
            await RunBusyAsync(async () =>
            {
                await _tweaks.ApplyProfileAsync(SelectedProfile);
                await LoadInternalAsync(); // sem IsBusy guard â€” jÃ¡ estamos dentro do RunBusyAsync
                SetStatus($"Perfil '{SelectedProfileName}' aplicado com sucesso.", "#00FF88");
                _logger.LogSuccess($"{TAG} [ApplyProfileAsync] Perfil {SelectedProfile} aplicado.");
            }, busyMessage: $"Aplicando perfil {SelectedProfileName}...");
        }

        // â”€â”€ Detectar gargalos â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

        private async Task DetectBottlenecksAsync()
        {
            _logger.LogInfo($"{TAG} [DetectBottlenecksAsync] Iniciando anÃ¡lise...");
            await RunBusyAsync(async () =>
            {
                BottleneckReport = await _tweaks.DetectVisualBottlenecksAsync();
                SetStatus("AnÃ¡lise concluÃ­da.", "#00FF88");
                _logger.LogInfo($"{TAG} [DetectBottlenecksAsync] RelatÃ³rio: {BottleneckReport}");
            }, busyMessage: "Analisando gargalos visuais...");
        }

        // â”€â”€ Restaurar padrÃµes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

        private async Task RestoreDefaultsAsync()
        {
            _logger.LogInfo($"{TAG} [RestoreDefaultsAsync] Restaurando padrÃµes...");
            await RunBusyAsync(async () =>
            {
                await _tweaks.ApplyProfileAsync(PersonalizeProfile.Normal);
                await _gpu.SetHardwareSchedulingAsync(false);
                await _gpu.SetGamingGpuPriorityAsync(false);
                await _gpu.SetMpoAsync(true);
                await LoadInternalAsync(); // sem IsBusy guard â€” jÃ¡ estamos dentro do RunBusyAsync
                SetStatus("PadrÃµes restaurados com sucesso.", "#00FF88");
                _logger.LogSuccess($"{TAG} [RestoreDefaultsAsync] PadrÃµes restaurados.");
            }, busyMessage: "Restaurando padrÃµes...");
        }

        // â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

        private void SetStatus(string msg, string color)
        {
            StatusMessage = msg;
            StatusColor   = color;
        }

        private async Task RunBusyAsync(Func<Task> action, string busyMessage = "Processando...")
        {
            // Aguardar até que o ViewModel não esteja mais ocupado (ex: LoadAsync inicial)
            int waited = 0;
            while (IsBusy && waited < 5000)
            {
                await Task.Delay(100);
                waited += 100;
            }

            if (IsBusy)
            {
                _logger.LogWarning($"{TAG} [RunBusyAsync] IsBusy ainda true após 5s de espera — forçando IsBusy=false para prosseguir.");
                IsBusy = false;
            }

            // IMPORTANTE: NÃO usar ExecuteSafeAsync aqui pois ele tem guard "if (IsBusy) return"
            // que pode silenciosamente ignorar a ação. Gerenciar IsBusy manualmente.
            _logger.LogInfo($"{TAG} [RunBusyAsync] Iniciando ação: {busyMessage}");
            try
            {
                IsBusy = true;
                BusyMessage = busyMessage;
                await action();
            }
            catch (Exception ex)
            {
                SetStatus($"Erro: {ex.Message}", "#FF4466");
                _logger.LogError($"{TAG} [RunBusyAsync] ❌ Exceção capturada: {ex.GetType().Name}: {ex.Message}", ex);
                if (ex.InnerException != null)
                    _logger.LogError($"{TAG} [RunBusyAsync] InnerException: {ex.InnerException.GetType().Name}: {ex.InnerException.Message}", ex.InnerException);
            }
            finally
            {
                IsBusy = false;
                BusyMessage = string.Empty;
                _logger.LogInfo($"{TAG} [RunBusyAsync] Ação concluída: {busyMessage}");
            }
        }
        // â”€â”€ Explorer Blur Mica: Instalar / Desinstalar â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

        private void OnExplorerBlurInstalledStateResolved(object? sender, bool isInstalled)
        {
            _logger.LogInfo($"{TAG} [InstalledStateResolved] IsInstalled={isInstalled} — atualizando botão.");
            System.Windows.Application.Current?.Dispatcher?.Invoke(() =>
            {
                ExplorerBlurInstalled = isInstalled;
                _taskbarCtrl.SetVoltrisBlurActive(isInstalled);
            });
        }

        private async Task InstallExplorerBlurAsync()
        {
            _logger.LogInfo($"{TAG} [InstallExplorerBlur] Comando acionado pelo usuário.");
            _logger.LogInfo($"{TAG} [InstallExplorerBlur] Efeito={ExplorerEffectIndex} ClearAddr={ExplorerClearAddress} ClearBar={ExplorerClearBarBg} ClearWinUI={ExplorerClearWinUIBg} ShowLine={ExplorerShowLine}");
            _logger.LogInfo($"{TAG} [InstallExplorerBlur] Alpha={ExplorerAlpha} R={ExplorerColorR} G={ExplorerColorG} B={ExplorerColorB}");
            _logger.LogInfo($"{TAG} [InstallExplorerBlur] JáInstalado={ExplorerBlurInstalled} — usando {(ExplorerBlurInstalled ? "ApplyConfigOnly" : "Install")}");
            // NOTA: light e dark usam os mesmos valores do slider — no Win10 tema escuro a DLL usa [dark],
            // no Win11 tema claro usa [light]. Passar os mesmos valores garante que funciona em ambos os temas.
            _logger.LogInfo($"{TAG} [InstallExplorerBlur] [light] e [dark] = R={ExplorerColorR} G={ExplorerColorG} B={ExplorerColorB} A={ExplorerAlpha}");

            await RunBusyAsync(async () =>
            {
                SetStatus("Aplicando VoltrisBlur...", "#31A8FF");

                bool ok;
                if (ExplorerBlurInstalled)
                {
                    // Já instalado: só reescreve config.ini e reinicia Explorer (sem re-registrar DLL)
                    ok = await _explorerBlur.ApplyConfigOnlyAsync(
                        effect:       (ExplorerEffect)ExplorerEffectIndex,
                        clearAddress: ExplorerClearAddress,
                        clearBarBg:   ExplorerClearBarBg,
                        clearWinUIBg: ExplorerClearWinUIBg,
                        showLine:     ExplorerShowLine,
                        lightR: ExplorerColorR, lightG: ExplorerColorG, lightB: ExplorerColorB, lightA: ExplorerAlpha,
                        darkR:  ExplorerColorR, darkG:  ExplorerColorG, darkB:  ExplorerColorB, darkA:  ExplorerAlpha);
                }
                else
                {
                    // Primeira instalação: processo completo (registrar DLL + reiniciar Explorer)
                    ok = await _explorerBlur.InstallAsync(
                        effect:       (ExplorerEffect)ExplorerEffectIndex,
                        clearAddress: ExplorerClearAddress,
                        clearBarBg:   ExplorerClearBarBg,
                        clearWinUIBg: ExplorerClearWinUIBg,
                        showLine:     ExplorerShowLine,
                        lightR: ExplorerColorR, lightG: ExplorerColorG, lightB: ExplorerColorB, lightA: ExplorerAlpha,
                        darkR:  ExplorerColorR, darkG:  ExplorerColorG, darkB:  ExplorerColorB, darkA:  ExplorerAlpha);
                }

                ExplorerBlurInstalled = ok || ExplorerBlurInstalled;
                if (ok)
                {
                    // Persistir configurações do VoltrisBlur
                    var s = SettingsService.Instance.Settings;
                    s.VoltrisBlurInstalled    = true;
                    s.VoltrisBlurEffectIndex  = ExplorerEffectIndex;
                    s.VoltrisBlurClearAddress = ExplorerClearAddress;
                    s.VoltrisBlurClearBarBg   = ExplorerClearBarBg;
                    s.VoltrisBlurClearWinUIBg = ExplorerClearWinUIBg;
                    s.VoltrisBlurShowLine     = ExplorerShowLine;
                    s.VoltrisBlurAlpha        = ExplorerAlpha;
                    s.VoltrisBlurColorR       = ExplorerColorR;
                    s.VoltrisBlurColorG       = ExplorerColorG;
                    s.VoltrisBlurColorB       = ExplorerColorB;
                    SettingsService.Instance.SaveSettings();
                    _logger.LogInfo($"{TAG} [InstallExplorerBlur] Configurações persistidas.");

                    SetStatus(ExplorerBlurInstalled ? "VoltrisBlur aplicado!" : "VoltrisBlur instalado!", "#00FF88");
                    _logger.LogSuccess($"{TAG} [InstallExplorerBlur] Aplicado com sucesso.");
                }
                else
                {
                    SetStatus("Falha ao aplicar VoltrisBlur. Veja os logs.", "#FF4466");
                    _logger.LogError($"{TAG} [InstallExplorerBlur] Falha na aplicação.", null);
                }
            }, busyMessage: ExplorerBlurInstalled ? "Aplicando configurações..." : "Instalando VoltrisBlur...");
        }

        private async Task UninstallExplorerBlurAsync()
        {
            _logger.LogInfo($"{TAG} [UninstallExplorerBlur] Comando acionado pelo usuário.");
            await RunBusyAsync(async () =>
            {
                SetStatus("Removendo VoltrisBlur...", "#FFAA00");
                bool ok = await _explorerBlur.UninstallAsync();
                ExplorerBlurInstalled = !ok ? ExplorerBlurInstalled : false;
                if (ok)
                {
                    SettingsService.Instance.Settings.VoltrisBlurInstalled = false;
                    SettingsService.Instance.SaveSettings();
                    _logger.LogInfo($"{TAG} [UninstallExplorerBlur] VoltrisBlurInstalled=false persistido.");
                    SetStatus("VoltrisBlur removido.", "#00FF88");
                    _logger.LogSuccess($"{TAG} [UninstallExplorerBlur] Removido com sucesso.");
                }
                else
                {
                    SetStatus("Falha ao remover VoltrisBlur.", "#FF4466");
                    _logger.LogError($"{TAG} [UninstallExplorerBlur] Falha na remoção.", null);
                }
            }, busyMessage: "Removendo VoltrisBlur...");
        }

        // ── Cursor Personalizado: métodos ─────────────────────────────────────────

        private void LoadCursorThemes()
        {
            try
            {
                _logger.LogInfo($"{TAG} [Cursor] Carregando temas disponíveis...");
                AvailableCursorThemes.Clear();
                var themes = _cursorTheme.GetAvailableThemes();
                foreach (var t in themes)
                    AvailableCursorThemes.Add(t);
                _logger.LogInfo($"{TAG} [Cursor] {AvailableCursorThemes.Count} temas carregados.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"{TAG} [Cursor] Erro ao carregar temas: {ex.Message}", ex);
            }
        }

        private async Task ApplyCursorThemeAsync()
        {
            if (_selectedCursorTheme == null)
            {
                CursorStatusMessage = "Selecione um tema antes de aplicar.";
                CursorStatusColor   = "#FFAA00";
                _logger.LogWarning($"{TAG} [Cursor] ApplyCursorThemeAsync chamado sem tema selecionado.");
                return;
            }

            _logger.LogInfo($"{TAG} [Cursor] Aplicando tema: '{_selectedCursorTheme.Name}'");
            await RunBusyAsync(async () =>
            {
                CursorStatusMessage = $"Aplicando tema {_selectedCursorTheme.DisplayName}...";
                CursorStatusColor   = "#31A8FF";
                bool ok = await _cursorTheme.ApplyThemeAsync(_selectedCursorTheme);
                if (ok)
                {
                    SettingsService.Instance.Settings.SelectedCursorTheme = _selectedCursorTheme.Name;
                    SettingsService.Instance.SaveSettings();
                    CursorStatusMessage = $"Tema '{_selectedCursorTheme.DisplayName}' aplicado!";
                    CursorStatusColor   = "#00FF88";
                    _logger.LogSuccess($"{TAG} [Cursor] Tema '{_selectedCursorTheme.Name}' aplicado e salvo.");
                }
                else
                {
                    CursorStatusMessage = "Falha ao aplicar cursor. Verifique os logs.";
                    CursorStatusColor   = "#FF4466";
                    _logger.LogError($"{TAG} [Cursor] Falha ao aplicar tema '{_selectedCursorTheme.Name}'.", null);
                }
            }, busyMessage: $"Aplicando cursor {_selectedCursorTheme.DisplayName}...");
        }

        private async Task RestoreCursorAsync()
        {
            _logger.LogInfo($"{TAG} [Cursor] Restaurando cursor padrão do Windows...");
            await RunBusyAsync(async () =>
            {
                CursorStatusMessage = "Restaurando cursor padrão...";
                CursorStatusColor   = "#FFAA00";
                bool ok = await _cursorTheme.RestoreDefaultAsync();
                if (ok)
                {
                    SettingsService.Instance.Settings.SelectedCursorTheme = string.Empty;
                    SettingsService.Instance.SaveSettings();
                    SelectedCursorTheme = null;
                    CursorStatusMessage = "Cursor padrão do Windows restaurado.";
                    CursorStatusColor   = "#00FF88";
                    _logger.LogSuccess($"{TAG} [Cursor] Cursor padrão restaurado.");
                }
                else
                {
                    CursorStatusMessage = "Falha ao restaurar cursor padrão.";
                    CursorStatusColor   = "#FF4466";
                }
            }, busyMessage: "Restaurando cursor padrão...");
        }

    }
}
