using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using System.Threading;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Interop;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using VoltrisOptimizer.UI.Views;
using VoltrisOptimizer.UI.Controls;
using VoltrisOptimizer.UI.Windows;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Services.Enterprise;
using VoltrisOptimizer.UI.Helpers;
using VoltrisOptimizer.UI.ViewModels;
using VoltrisOptimizer.Helpers;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using VoltrisOptimizer.Services.Gamer.Models;
using VoltrisOptimizer.Core.Updater;
using Microsoft.Extensions.DependencyInjection;
using Application = System.Windows.Application;
using WinForms = System.Windows.Forms;
using System.Reflection;
using MediaColor = System.Windows.Media.Color;

namespace VoltrisOptimizer.UI
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private UserControl? _currentView;
        private Button? _currentSelectedButton;
        private bool _isNavigating = false;
        private bool _gateLocked = false;
        private bool _isLockedForOnboarding = false;
        private bool _isUpdatingSelection = false; // Flag para prevenir loops recursivos
        
        // Recursos estáticos para evitar criação excessiva
        private static SolidColorBrush? _primaryBrush;
        private static SolidColorBrush? _secondaryTextBrush;
        
        // Serviços
        private readonly LocalizationService _localization;
        private readonly SettingsService _settings;
        private WinForms.NotifyIcon? _notifyIcon;
        private VoltrisOptimizer.UI.Controls.ModernTrayTooltip? _modernTooltip;
        private System.Windows.Threading.DispatcherTimer? _tooltipShowTimer;
        private System.Windows.Threading.DispatcherTimer? _tooltipMousePollTimer;
        private System.Drawing.Point _lastMousePos;
        private System.Drawing.Point _tooltipAnchorPos; // posição do mouse no momento do show
        private bool _tooltipVisible = false;
        /// <summary>Enquanto este timestamp estiver no futuro, nenhum tooltip será exibido (cooldown pós-restart do Explorer).</summary>
        private DateTime _suppressTooltipUntil = DateTime.MinValue;
        private ContextMenu? _cachedTrayMenu;
        private bool _isTrayContextMenuOpen = false;
        private bool _isClosing = false;
        private IntPtr _hwnd;
        private HwndSource? _dummySource;
        
        // Gamer Mode Integration
        private GamerViewModel? _gamerViewModel;
        private IGamerModeOrchestrator? _gamerOrchestrator;
        
        // CONTROLE DE ESTADO PARA PREVENIR DUPLICAÇÕES
        private static bool _initializationStarted = false;
        private static bool _initializationCompleted = false;
        
        // Timer de status para o footer
        private readonly System.Windows.Threading.DispatcherTimer _statusTimer;
        
        // CancellationToken para loops de background (polling, etc.)
        private bool _isAppActive = true;
        public bool IsAppActive
        {
            get => _isAppActive;
            set
            {
                if (_isAppActive != value)
                {
                    _isAppActive = value;
                    LogToFile($"[Main] State changed: IsAppActive={value}");
                    UpdateAllViewModelsActiveState();
                }
            }
        }

        private void UpdateAllViewModelsActiveState()
        {
            try
            {
                // Atualizar o ViewModel da página ATUAL
                if (_currentView?.DataContext is ViewModelBase vm)
                {
                    vm.IsActive = _isAppActive;
                }
            }
            catch (Exception ex)
            {
                LogToFile($"Erro ao atualizar estado dos ViewModels: {ex.Message}");
            }
        }

        private readonly CancellationTokenSource _backgroundCts = new();

        private Dictionary<string, UserControl> _viewCache = new Dictionary<string, UserControl>();

        public MainWindow()
        {
            // LOG CRÍTICO: Início do construtor (Async)
            LogToFile("===== MAINWINDOW CONSTRUTOR INICIADO =====");
            
            InitializeComponent();
            
            // Aplicar bordas arredondadas reais (Win32 Region + WPF Clip)
            RoundedWindowHelper.Apply(this, 16);
            
            // LOG: Após InitializeComponent
            LogToFile("InitializeComponent() concluído");
            
            // Inicializar serviços
            _localization = LocalizationService.Instance;
            _settings = SettingsService.Instance;
            
            LogToFile($"Serviços inicializados - StartMinimized: {_settings.Settings.StartMinimized}, StartWithWindows: {_settings.Settings.StartWithWindows}");
            
            // Conectar ao serviço global de progresso
            GlobalProgressService.Instance.ProgressChanged += OnGlobalProgressChanged;
            GlobalProgressService.Instance.StatusChanged += OnGlobalStatusChanged;
            
            // CORREÇÃO PERFORMANCE: Mover InitializeGamerModeIntegration para depois do Loaded.
            // Resolver serviços do DI container no construtor bloqueia a UI thread.
            // Será chamado no evento Loaded via Dispatcher com prioridade baixa.
            
            // Carregar idioma salvo
            _localization.SetLanguage(_settings.Settings.Language);
            
            // Carregar recursos estáticos uma única vez
            _primaryBrush = (SolidColorBrush)Application.Current.Resources["PrimaryBrush"];
            _secondaryTextBrush = (SolidColorBrush)Application.Current.Resources["TextSecondaryBrush"];
            
            // Verificar argumentos de linha de comando (Aliasing total para --minimized, -minimized, /minimized)
            var args = Environment.GetCommandLineArgs();
            var startMinimized = args.Any(arg => 
                arg.Equals("/minimized", StringComparison.OrdinalIgnoreCase) || 
                arg.Equals("-minimized", StringComparison.OrdinalIgnoreCase) ||
                arg.Equals("--minimized", StringComparison.OrdinalIgnoreCase));

            // SUPPRESS TOOLTIP AT STARTUP:
            // Evita que o tooltip "现代" apareça do nada enquanto o sistema termina de carregar.
            _suppressTooltipUntil = DateTime.Now.AddSeconds(5);
            
            // Logar inicialização (Async/Fire-and-forget para não bloquear UI Thread)
            Task.Run(() =>
            {
                try
                {
                    var logDir = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                    if (!System.IO.Directory.Exists(logDir))
                        System.IO.Directory.CreateDirectory(logDir);
                    var logFile = System.IO.Path.Combine(logDir, "startup_execution.log");
                    System.IO.File.AppendAllText(logFile, 
                        $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] ===== MAINWINDOW CONSTRUTOR =====\n" +
                        $"  Argumentos: {string.Join(" ", args)}\n" +
                        $"  StartMinimized (arg): {startMinimized}\n" +
                        $"  StartMinimized (config): {_settings.Settings.StartMinimized}\n" +
                        $"  StartWithWindows (config): {_settings.Settings.StartWithWindows}\n" +
                        $"  ProcessPath: {System.Environment.ProcessPath ?? "N/A"}\n" +
                        $"  BaseDirectory: {AppDomain.CurrentDomain.BaseDirectory}\n" +
                        $"  WindowState: {WindowState}\n" +
                        $"  ShowInTaskbar: {ShowInTaskbar}\n" +
                        $"===== FIM MAINWINDOW CONSTRUTOR =====\n\n");
                }
                catch { }
            });
            
            LogToFile("Iniciando InitializeNotifyIcon()...");
            InitializeNotifyIcon();
            UpdateLocalizedTexts();
            
            // Inicializar timer de status (5 segundos de exibição)
            _statusTimer = new System.Windows.Threading.DispatcherTimer
            {
                Interval = TimeSpan.FromSeconds(5)
            };
            _statusTimer.Tick += (s, e) => 
            {
                _statusTimer.Stop();
                UpdateStatus(string.Empty);
            };
            
            // Inicializar evento de mudança de idioma
            _localization.LanguageChanged += (s, e) => UpdateLocalizedTexts();
            
            // Configurar atalhos de teclado
            SetupKeyboardShortcuts();
            
            // Atualizar versão
            UpdateVersionInfo();

            // OTIMIZAÇÃO PERFORMANCE: Monitorar visibilidade para pausar serviços
            this.StateChanged += MainWindow_StateChanged;
            this.IsVisibleChanged += MainWindow_IsVisibleChanged;
            this.Activated += (s, e) => { if (this.WindowState != WindowState.Minimized && this.IsVisible) IsAppActive = true; };

            Loaded += (s, e) =>
            {
                LogToFile($"===== EVENTO LOADED =====\n" +
                         $"  WindowState ANTES: {WindowState}\n" +
                         $"  ShowInTaskbar ANTES: {ShowInTaskbar}\n" +
                         $"  Visibility ANTES: {Visibility}\n" +
                         $"  startMinimized: {startMinimized}\n");

                // Marcar que a janela foi totalmente carregada
                _isWindowFullyLoaded = true;
                LogToFile("_isWindowFullyLoaded = true");

                // Garantir que o sidebar começa sempre no topo (PRINCIPAL visível)
                SidebarScrollViewer?.ScrollToTop();

                if (startMinimized)
                {
                    LogToFile("INICIANDO MINIMIZADO (Argumento detectado)");
                    
                    // Garantir que o handle foi criado
                    if (_hwnd == IntPtr.Zero) 
                    {
                        _hwnd = new WindowInteropHelper(this).Handle;
                    }

                    // Esconder para a bandeja
                    HideToTray();
                    
                    // Notificar usuário silenciosamente via log
                    LogToFile("Aplicativo iniciado na bandeja do sistema.");
                }
                else
                {
                    // INICIAR NORMAL
                    LogToFile("INICIANDO NORMAL (Sem argumento minimized)");
                    
                    // Apenas forçar se não estiver minimizado propositalmente
                    if (WindowState == WindowState.Minimized)
                    {
                         WindowState = WindowState.Normal;
                    }
                    
                    ShowInTaskbar = true;
                    Visibility = Visibility.Visible;
                    Topmost = false;
                    
                    Show();
                    Activate();
                }
                
                LogToFile($"===== EVENTO LOADED FINALIZADO =====\n" +
                         $"  WindowState DEPOIS: {WindowState}\n" +
                         $"  ShowInTaskbar DEPOIS: {ShowInTaskbar}\n" +
                         $"  Visibility DEPOIS: {Visibility}\n");
                
                // CORREÇÃO PERFORMANCE: Inicializar Gamer Mode Integration após a janela renderizar
                // para não bloquear a UI thread durante a criação da janela.
                _ = Dispatcher.InvokeAsync(() => InitializeGamerModeIntegration(), 
                    System.Windows.Threading.DispatcherPriority.Background);

                // CORREÇÃO CRÍTICA: Restaurar configurações do Taskbar (centralização + estilo)
                // Isso deve rodar mesmo se o app iniciar MINIMIZADO (onde ContentRendered não dispara).
                _ = RestoreSavedTaskbarSettingsAsync();
            };
            
            _gateLocked = App.SystemProfiler != null && App.SystemProfiler.RequireGate;
            Loaded += MainWindow_Loaded_Gate;
            
            // LOG CRÍTICO: Fim do construtor
            LogToFile("===== MAINWINDOW CONSTRUTOR FINALIZADO COM SUCESSO =====");
        }

        private void MainWindow_StateChanged(object? sender, EventArgs e)
        {
            bool isMinimized = this.WindowState == WindowState.Minimized;
            IsAppActive = !isMinimized && this.IsVisible;
            LogToFile($"[Main] WindowState={this.WindowState}, IsAppActive={IsAppActive}");
        }

        private void MainWindow_IsVisibleChanged(object sender, DependencyPropertyChangedEventArgs e)
        {
            bool isVisible = (bool)e.NewValue;
            IsAppActive = isVisible && this.WindowState != WindowState.Minimized;
            LogToFile($"[Main] IsVisible={isVisible}, IsAppActive={IsAppActive}");
        }

        private void InitializeNavigation()
        {
            try
            {
                // Iniciar navegando para o dashboard (isso já cuida da seleção visual)
                NavigateToDashboard();
            }
            catch (Exception ex)
            {
                LogToFile($"Erro ao inicializar navegação: {ex.Message}");
            }
        }

        private void MainWindow_Loaded_Gate(object sender, RoutedEventArgs e)
        {
            LogToFile("===== MainWindow_Loaded_Gate INICIADO =====");
            
            if (_initializationStarted) return;
            _initializationStarted = true;
            
            var args = Environment.GetCommandLineArgs();
            var startedMinimized = args.Any(arg => arg.Equals("/minimized", StringComparison.OrdinalIgnoreCase) || 
                                                 arg.Equals("-minimized", StringComparison.OrdinalIgnoreCase));

            if (!startedMinimized)
            {
                // Só garantir visibilidade se deveria estar visível
                if (Visibility != Visibility.Visible)
                {
                    Visibility = Visibility.Visible;
                    Show();
                }
                
                if (!ShowInTaskbar) ShowInTaskbar = true;
            }
            // else: Se iniciou minimizado, respeitar e não forçar Show()
            
            var settings = SettingsService.Instance.Settings;
            
            // Verificar se o usuário já fez uma escolha (vinculou OU pulou)
            bool userMadeChoice = settings.IsDeviceLinked || settings.WelcomePromptShown;
            
            if (!userMadeChoice)
            {
                ShowWelcomeScreen();
            }
            else
            {
                ContinueNormalFlow();
            }
            
            _initializationCompleted = true;
            
            // Verificação automática de atualizações (Silencioso e Mandatório)
            _ = CheckForUpdatesAutomaticallyAsync();

            // Atualizar status de vinculação inicialmente e iniciar polling
            _ = UpdateLinkingStatusAsync();
        }

        private async Task CheckForUpdatesAutomaticallyAsync()
        {
            try
            {
                LogToFile("Iniciando verificação automática de atualizações...");
                
                // Aguardar um pouco para não competir com a renderização inicial do Dashboard
                await Task.Delay(TimeSpan.FromSeconds(3));

                var updateInfo = await UpdateService.CheckForUpdatesAsync();

                if (updateInfo != null)
                {
                    LogToFile($"Nova versão detectada: {updateInfo.LatestVersion}. Abrindo janela de atualização mandatória.");
                    
                    await Dispatcher.InvokeAsync(() =>
                    {
                        var updateWindow = new VoltrisOptimizer.Core.Updater.UpdateWindow(updateInfo);
                        updateWindow.Owner = this;
                        updateWindow.ShowDialog();
                    });
                }
                else
                {
                    LogToFile("Nenhuma atualização pendente encontrada.");
                }
            }
            catch (Exception ex)
            {
                LogToFile($"Erro na verificação automática de updates: {ex.Message}");
            }
        }

        private async Task UpdateLinkingStatusAsync()
        {
            var token = _backgroundCts.Token;
            while (!token.IsCancellationRequested)
            {
                try
                {
                    var email = await EnterpriseService.Instance.GetLinkingStatusAsync();
                    bool isLinked = !string.IsNullOrEmpty(email);
                    
                    // Sincronizar com as configurações para que o Dashboard e outras telas vejam a mudança em tempo real
                    var settings = SettingsService.Instance.Settings;
                    bool changed = false;
                    
                    if (settings.IsDeviceLinked != isLinked)
                    {
                        settings.IsDeviceLinked = isLinked;
                        changed = true;
                    }
                    
                    if (settings.LinkedUserEmail != email)
                    {
                        settings.LinkedUserEmail = email;
                        changed = true;
                    }
                    
                    if (changed)
                    {
                        SettingsService.Instance.SaveSettings();
                    }

                    await Dispatcher.InvokeAsync(() =>
                    {
                        if (LoginWebButton != null)
                        {
                            if (isLinked)
                            {
                                LoginWebButton.ToolTip = $"Conta Vinculada: {email}";
                                if (LoginWebButton.Content is TextBlock tb)
                                {
                                    tb.Text = "✅"; 
                                }
                            }
                            else
                            {
                                LoginWebButton.ToolTip = "Voltris Cloud - Sincronizar Conta";
                                if (LoginWebButton.Content is TextBlock tb)
                                {
                                    tb.Text = "☁️";
                                }
                            }
                        }
                    });
                }
                catch (OperationCanceledException) { break; }
                catch { }
                
                try { await Task.Delay(TimeSpan.FromSeconds(30), token); }
                catch (OperationCanceledException) { break; }
            }
        }

        // ... (Mantendo métodos auxiliares como LogToFile, ShowWelcomeScreen, ContinueNormalFlow sem alterações maiores, apenas garantindo que LogSafe use Task.Run)

        private void NavigateToPageSafe(string pageName)
        {
            try
            {
                UserControl? viewToNavigate = null;

                // 1. Tentar obter do cache
                if (_viewCache.ContainsKey(pageName))
                {
                    viewToNavigate = _viewCache[pageName];
                }
                else
                {
                    // 2. Se não existir, criar e cachear
                    try
                    {
                        LogToFile($"Criando nova view: {pageName}");
                        
                        viewToNavigate = pageName switch
                        {
                            "Dashboard" => new DashboardView(),
                            "Cleanup" => new CleanupView(),
                            "Performance" => new PerformanceView(),
                            "Network" => new NetworkView(),
                            "System" => new SystemView(),
                            "Gamer" => new GamerView(),
                            "Shield" => new ShieldView(),
                            "Repair" => new RepairView(),
                            "Security" => new SecurityView(),
                            "Privacy" => new PrivacyView(),
                            "Debloat" => new DebloatView(),
                            "DeviceInfo" => new DeviceInfoView(),
                            "History" => new HistoryView(),
                            "Scheduler" => new SchedulerView(),
                            "Logs" => new LogsView(),
                            "Settings" => new SettingsView(),
                            "Diagnostics" => new GameDiagnosticsView(),
                            "ProfessionalServices" => new VoltrisOptimizer.UI.Views.ProfessionalServicesView(),
                            "Benchmark" => new VoltrisOptimizer.UI.Views.BenchmarkPage(),
                            "Energy" => new VoltrisOptimizer.UI.Views.EnergyView(),
                            "Personalize" => new VoltrisOptimizer.UI.Views.PersonalizeView(),
                            "Display" => new VoltrisOptimizer.UI.Views.DisplayView(),
                            "StreamHub" => new VoltrisOptimizer.UI.Views.StreamHubView(),
                            _ => null
                        };

                        if (viewToNavigate != null)
                        {
                            _viewCache[pageName] = viewToNavigate;
                            LogToFile($"View '{pageName}' criada e cacheada com sucesso");
                        }
                    }
                    catch (Exception ex)
                    {
                         LogToFile($"ERRO CRÍTICO ao criar página '{pageName}': {ex.Message}\nStack: {ex.StackTrace}");
                         
                         var errorMsg = $"Erro ao criar página '{pageName}':\n\n{ex.Message}";
                         if (ex.InnerException != null)
                         {
                             errorMsg += $"\n\nErro interno: {ex.InnerException.Message}";
                         }
                         
                         MessageBox.Show(errorMsg, "Erro", MessageBoxButton.OK, MessageBoxImage.Error);
                         return;
                    }
                }

                if (viewToNavigate != null)
                {
                    // DESATIVAR MONITORAMENTO DA VIEW ANTERIOR
                    if (_currentView?.DataContext is ViewModelBase oldVm)
                    {
                        oldVm.IsActive = false;
                        App.LoggingService?.LogTrace($"[Navigation] Pausando ViewModel: {oldVm.GetType().Name}");
                    }

                    ContentFrame.Content = viewToNavigate;
                    _currentView = viewToNavigate;
                    _lastPageName = pageName;

                    // ATIVAR MONITORAMENTO DA NOVA VIEW (Respeitando estado da janela)
                    if (viewToNavigate.DataContext is ViewModelBase newVm)
                    {
                        // Só ativar se a janela estiver visível e não minimizada no tray
                        newVm.IsActive = WindowState != WindowState.Minimized && Visibility == Visibility.Visible;
                        App.LoggingService?.LogTrace($"[Navigation] Ativando ViewModel: {newVm.GetType().Name} (Active={newVm.IsActive})");
                    }
                    
                    // CORREÇÃO PERFORMANCE: Telemetria em background para não bloquear navegação
                    _ = Task.Run(() => App.TelemetryService?.TrackEvent("PAGE_VIEW", "Navigation", pageName, forceFlush: true));
                }
            }
            catch (Exception ex)
            {
                LogToFile($"Erro ao navegar: {ex.Message}");
            }
        }

        private string _lastPageName = "Dashboard";

        /// <summary>
        /// CORREÇÃO CRÍTICA: Versão assíncrona de NavigateToPageSafe para Systray
        /// Aguarda a navegação ser concluída antes de retornar
        /// </summary>
        private async Task NavigateToPageSafeAsync(string pageName)
        {
            var tcs = new TaskCompletionSource<bool>();
            
            try
            {
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    try
                    {
                        NavigateToPageSafe(pageName);
                        
                        // Aguardar frame carregar
                        if (ContentFrame != null && ContentFrame.Content != null)
                        {
                            var content = ContentFrame.Content as FrameworkElement;
                            if (content != null)
                            {
                                if (content.IsLoaded)
                                {
                                    tcs.TrySetResult(true);
                                }
                                else
                                {
                                    RoutedEventHandler? loadedHandler = null;
                                    loadedHandler = (s, e) =>
                                    {
                                        content.Loaded -= loadedHandler;
                                        tcs.TrySetResult(true);
                                    };
                                    content.Loaded += loadedHandler;
                                    Task.Delay(3000).ContinueWith(_ => tcs.TrySetResult(false));
                                }
                            }
                            else
                            {
                                tcs.TrySetResult(true);
                            }
                        }
                        else
                        {
                            tcs.TrySetResult(false);
                        }
                    }
                    catch (Exception ex)
                    {
                        App.LoggingService?.LogError($"[NavigateToPageSafeAsync] Erro ao navegar para {pageName}", ex);
                        tcs.TrySetException(ex);
                    }
                });
                
                await tcs.Task;
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[NavigateToPageSafeAsync] Erro crítico ao navegar para {pageName}", ex);
            }
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            // Simplificado para evitar conflitos com MainWindow_Loaded_Gate
            var args = Environment.GetCommandLineArgs();
            var startedMinimized = args.Any(arg => arg.Equals("/minimized", StringComparison.OrdinalIgnoreCase) || 
                                                 arg.Equals("-minimized", StringComparison.OrdinalIgnoreCase));
            
            if (!startedMinimized)
            {
                 // Garantias básicas de UI apenas se não for background startup
                 if (_hwnd != IntPtr.Zero) SetWindowIcon(_hwnd);
            }
            
            UpdateClipGeometry();
            SizeChanged += (s, args) => UpdateClipGeometry();
            
            // Aplicar backdrop no ContentRendered — único evento que garante que a janela
            // está de fato visível e pintada na tela (necessário para SetWindowCompositionAttribute)
            ContentRendered += Window_ContentRendered;

            // CORREÇÃO PERFORMANCE: Remover duplicação — GlobalProgressService já é conectado no construtor.
            // Conectar duas vezes causa handlers duplicados e processamento dobrado.
        }

        private void Window_ContentRendered(object? sender, EventArgs e)
        {
            // Desinscrever para não chamar múltiplas vezes
            ContentRendered -= Window_ContentRendered;

            // Aplicar tema + transparência na ordem correta
            ApplyThemeAndTransparency(_settings.Settings.Theme, _settings.Settings.EnableTransparency);

            // Inicializar ícones do header com o estado atual
            bool isLight = _settings.Settings.Theme?.Equals("Light", StringComparison.OrdinalIgnoreCase) == true;
            UpdateThemeToggleIcon(isLight);
            UpdateTransparencyToggleIcon(_settings.Settings.EnableTransparency);

            // Reaplicar bordas arredondadas após backdrop/transparência
            // (SetWindowCompositionAttribute pode interferir com a região)
            Dispatcher.BeginInvoke(new Action(() =>
            {
                RoundedWindowHelper.ForceApply(this, 16);
            }), System.Windows.Threading.DispatcherPriority.Render);

            // Tentar restaurar aqui também como redundância se a janela for aberta manualmente
            _ = RestoreSavedTaskbarSettingsAsync();
        }

        /// <summary>
        /// Restaurar configurações do Taskbar persistidas (centralização + estilo)
        /// INDEPENDENTEMENTE de o usuário abrir a página PERSONALIZAR ou renderizar a janela.
        /// </summary>
        private async Task RestoreSavedTaskbarSettingsAsync()
        {
            var taskbarCtrl = App.Services?.GetService<VoltrisOptimizer.Services.Personalize.TaskbarControlService>();
            if (taskbarCtrl == null) return;

            var s = _settings.Settings;
            bool isWin11 = Environment.OSVersion.Version.Build >= 22000;

            // Evitar múltiplas execuções simultâneas se chamado de Loaded e ContentRendered
            if (System.Threading.Interlocked.CompareExchange(ref _taskbarRestoreStarted, 1, 0) != 0)
                return;

            try
            {
                // Restaurar estilo e centralização em múltiplas tentativas para garantir que o
                // Explorer já terminou de inicializar (especialmente após reinicialização do PC).
                int[] delaysMs = { 3000, 8000, 20000 };

                for (int attempt = 0; attempt < delaysMs.Length; attempt++)
                {
                    await Task.Delay(delaysMs[attempt]);
                    try
                    {
                        App.LoggingService?.LogInfo($"[MainWindow] [TaskbarRestore] Tentativa {attempt + 1}/{delaysMs.Length} — CenteringEnabled={s.TaskbarCenteringEnabled} StyleEnabled={s.TaskbarStyleEnabled} IsWin11={isWin11}");

                        // Restaurar estilo visual (apenas na primeira tentativa)
                        if (attempt == 0 && s.TaskbarStyleEnabled)
                        {
                            var mode = (VoltrisOptimizer.Services.Personalize.TaskbarStyleMode)s.TaskbarStyleIndex;
                            taskbarCtrl.SetStyle(true, mode, (byte)System.Math.Clamp(s.TaskbarOpacity, 0, 255));
                        }

                        // Restaurar centralização (apenas Win10)
                        if (s.TaskbarCenteringEnabled && !isWin11)
                        {
                            taskbarCtrl.SetCentering(true);
                            App.LoggingService?.LogInfo($"[MainWindow] [TaskbarRestore] Centralização aplicada (tentativa {attempt + 1}).");
                        }

                        // Restaurar VoltrisBlur (apenas na primeira tentativa)
                        if (attempt == 0 && s.VoltrisBlurInstalled)
                        {
                            var voltrisBlur = App.Services?.GetService<VoltrisOptimizer.Services.Personalize.VoltrisBlurService>();
                            if (voltrisBlur != null)
                            {
                                var effect = (VoltrisOptimizer.Services.Personalize.ExplorerEffect)s.VoltrisBlurEffectIndex;
                                await voltrisBlur.ApplyConfigOnlyAsync(
                                    effect,
                                    s.VoltrisBlurClearAddress, s.VoltrisBlurClearBarBg,
                                    s.VoltrisBlurClearWinUIBg, s.VoltrisBlurShowLine,
                                    s.VoltrisBlurColorR, s.VoltrisBlurColorG, s.VoltrisBlurColorB, s.VoltrisBlurAlpha,
                                    s.VoltrisBlurColorR, s.VoltrisBlurColorG, s.VoltrisBlurColorB, s.VoltrisBlurAlpha,
                                    restartExplorer: false);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        App.LoggingService?.LogWarning($"[MainWindow] [TaskbarRestore] Tentativa {attempt + 1} erro: {ex.Message}");
                    }
                }
            }
            finally
            {
                // Permitir nova restauração se necessário (ex: em switch de usuário futuro)
                // Mas geralmente 1x por sessão de app é suficiente.
            }
        }

        private int _taskbarRestoreStarted = 0;

        // Restante do arquivo mantido... (Métodos auxiliares, NotifyIcon, etc)

        
        private void LogToFile(string message)
        {
            // Usar logging centralizado em vez de I/O direto
            try
            {
                App.LoggingService?.LogInfo($"[MainWindow] {message}");
            }
            catch { }
        }



        private void ShowWelcomeScreen()
        {
            try
            {
                LogToFile("Mostrando tela de welcome/vinculação");
                
                // PREVENIR DUPLICAÇÃO: O fluxo principal já está no App.xaml.cs
                // Esta chamada não deve mostrar a janela novamente
                
                LogToFile("WARNING: ShowWelcomeScreen chamado no MainWindow - ignorando (fluxo centralizado no App.xaml.cs)");
                
                // Marcar que o welcome foi mostrado para evitar loops infinitos
                var settings = SettingsService.Instance.Settings;
                settings.WelcomePromptShown = true;
                SettingsService.Instance.SaveSettings();
                
                // Continuar fluxo normal
                LogToFile("Welcome concluído - continuando para próxima etapa do fluxo");
                ContinueNormalFlow();
            }
            catch (Exception ex)
            {
                LogToFile($"ERRO na tela de welcome: {ex.Message}");
                ContinueNormalFlow();
            }
        }

        private void ContinueNormalFlow()
        {
            try
            {
                LogToFile("Iniciando fluxo normal — Verificando estado do perfil.");
                
                // FONTE ÚNICA DE VERDADE: SystemProfiler.RequireGate
                // Isso verifica tanto o ProfileStore quanto o OnboardingService
                bool needsOnboarding = true;
                var profileStore = new Core.SystemIntelligenceProfiler.ProfileStore();
                var profileState = profileStore.Load();

                if (App.SystemProfiler != null)
                {
                    needsOnboarding = App.SystemProfiler.RequireGate;
                    LogToFile($"[FLOW] SystemProfiler.RequireGate: {needsOnboarding}");
                }
                else
                {
                    // Fallback se o serviço não estiver pronto
                    needsOnboarding = !profileState.QuestionnaireCompleted;
                    LogToFile($"[FLOW] Usando fallback ProfileStore: {needsOnboarding}");
                }

                if (needsOnboarding)
                {
                    LogToFile("[FLOW] Onboarding pendente. Direcionando para ProfilerQuestionnaireView.");
                    
                    // Bloquear interface completamente
                    _isLockedForOnboarding = true;
                    DisableSidebarCompletely();
                    
                    // Definir o conteúdo para o questionário
                    var questionnaireView = new Core.SystemIntelligenceProfiler.UI.Views.ProfilerQuestionnaireView();
                    ContentFrame.Content = questionnaireView;
                    
                    // NÃO mostrar o modal aqui — ele será mostrado apenas quando o usuário
                    // tentar clicar no sidebar ou nas opções do header (já tratado nos handlers)
                    
                    // Atualizar barra de progresso global
                    try { GlobalProgressService.Instance.StartOperation("Configuração de Perfil"); } catch { }
                    return;
                }

                LogToFile("[FLOW] Perfil e Onboarding OK. Prosseguindo para o Dashboard.");
                NavigateToDashboard();

                // Verificação de agendamento pendente do Prepare PC (silenciosa).
                // Só executa se o usuário agendou explicitamente — não interrompe o boot normal.
                try
                {
                    var flowController = new VoltrisOptimizer.Core.PreparePc.PreparePcFlowController(
                        ContentFrame, 
                        App.LoggingService,
                        onComplete: () => NavigateToDashboard());
                    
                    flowController.ExecuteScheduledPreparePcIfPending();
                }
                catch (Exception ex)
                {
                    LogToFile($"Erro ao verificar agendamento pendente: {ex.Message}");
                }
            }
            catch (Exception ex)
            {
                LogToFile($"ERRO CRÍTICO no fluxo normal: {ex.Message}");
                // Fallback de segurança: Se falhar ao decidir, tentamos o Dashboard como última instância
                // MAS apenas se não estivermos no primeiro boot (segurança)
                if (!_isLockedForOnboarding) NavigateToDashboard();
            }
        }



        private void ShowOnboardingFlow()
        {
            try
            {
                var onboardingView = new OnboardingView();
                onboardingView.OnboardingCompleted += (s, e) =>
                {
                    try
                    {
                        // Após tutorial, mostrar o Questionário do Profiler
                        // O sidebar continua BLOQUEADO
                        var questionnaire = new VoltrisOptimizer.Core.SystemIntelligenceProfiler.UI.Views.ProfilerQuestionnaireView();
                        if (ContentFrame != null)
                        {
                            ContentFrame.Content = questionnaire;
                        }
                    }
                    catch (Exception ex)
                    {
                        LogToFile($"ERRO após onboarding: {ex.Message}");
                        NavigateToDashboard();
                    }
                };
                
                // Substituir conteúdo atual pelo onboarding
                if (ContentFrame != null)
                {
                    ContentFrame.Content = onboardingView;
                }
            }
            catch (Exception ex)
            {
                LogToFile($"ERRO ao mostrar onboarding: {ex.Message}");
                NavigateToDashboard();
            }
        }

        private void NavigateToDashboard()
        {
            try
            {
                LogToFile("Navegando para dashboard");
                _gateLocked = false;
                EnableSidebar();
                
                // Navegar para dashboard e atualizar seleção visual
                NavigateToPageSafe("Dashboard");
                
                // Usar Dispatcher para garantir que os recursos e estilos estejam prontos
                Dispatcher.BeginInvoke(new Action(() =>
                {
                    if (NavDashboard != null)
                    {
                        UpdateButtonSelectionSafe(NavDashboard);
                    }
                }), System.Windows.Threading.DispatcherPriority.Loaded);
            }
            catch (Exception ex)
            {
                LogToFile($"ERRO ao navegar para dashboard: {ex.Message}");
            }
        }

        public void UnlockGate()
        {
            _gateLocked = false;
            _isLockedForOnboarding = false;
            EnableSidebar();
        }
        
        /// <summary>
        /// Habilita todos os botões da sidebar (após completar onboarding)
        /// </summary>
        public void EnableSidebar()
        {
            _isLockedForOnboarding = false;
            var buttons = new[] { NavDashboard, NavCleanup, NavPerformance, NavNetwork, NavSystem, NavGamer, NavDiagnostics, NavHistory, NavScheduler, NavLogs, NavProfessionalServices, NavEnergy, NavShield, NavRepair, NavPersonalize, NavDisplay, NavSecurity, NavPrivacy, NavDebloat, NavDeviceInfo, NavBenchmark };
            foreach (var btn in buttons.Where(b => b != null))
            {
                btn.IsEnabled = true;
                btn.Opacity = 1.0; 
            }
            
            // Habilitar header também
            if (SettingsButton != null) { SettingsButton.IsEnabled = true; SettingsButton.Opacity = 1.0; }
            if (LoginWebButton != null) { LoginWebButton.IsEnabled = true; LoginWebButton.Opacity = 1.0; }
            if (ActivateLicenseHeaderButton != null) { ActivateLicenseHeaderButton.IsEnabled = true; ActivateLicenseHeaderButton.Opacity = 1.0; }
        }

        

        
        
        /// <summary>
        /// Executa comando de forma segura na UI thread
        /// </summary>
        
        
        /// <summary>
        /// Executa a ação do comando (SEM async)
        /// </summary>
        
        
        /// <summary>
        /// Log seguro que nunca lança exceção
        /// </summary>
        private void LogSafe(string message)
        {
            try
            {
                App.LoggingService?.LogInfo(message);
            }
            catch { }
        }
        
        /// <summary>
        /// Retorna o feedback de voz apropriado para cada comando
        /// </summary>
        
        
        /// <summary>
        /// Processa comandos de voz com tratamento de erro seguro
        /// </summary>
        
        
        /// <summary>
        /// Fala de forma segura, tratando exceções
        /// </summary>
        

        
        
        /// <summary>
        /// Evento chamado quando a janela é carregada - aplica clipping
        /// </summary>

        
        /// <summary>
        /// Atualiza a geometria de clipping para bordas arredondadas perfeitas
        /// </summary>
        private void UpdateClipGeometry()
        {
            try
            {
                if (RootContainer != null && ClipGeometry != null)
                {
                    ClipGeometry.Rect = new Rect(0, 0, RootContainer.ActualWidth, RootContainer.ActualHeight);
                }
            }
            catch { }
        }
        
        /// <summary>
        /// Aplica bordas arredondadas nativas do Windows 11 quando disponível
        /// </summary>
        private void Window_SourceInitialized(object sender, EventArgs e)
        {
            try
            {
                var hwnd = new WindowInteropHelper(this).Handle;
                _hwnd = hwnd;
                
                // Definir ícone da janela programaticamente
                SetWindowIcon(hwnd);
                
                // Bordas arredondadas são gerenciadas pelo RoundedWindowHelper.Apply()
                // chamado no construtor — não duplicar aqui.
                
                CreateDummyWindow();
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogWarning($"Erro no SourceInitialized: {ex.Message}");
            }
        }

        /// <summary>
        /// Aplica ou remove o efeito acrylic/blur na janela principal.
        /// Chamado no startup e quando o usuário altera a configuração nas Settings.
        /// </summary>
        public void ApplyWindowTransparency(bool enabled)
        {
            try
            {
                if (enabled)
                {
                    bool isLight = _settings.Settings.Theme?.Equals("Light", StringComparison.OrdinalIgnoreCase) == true;
                    VoltrisOptimizer.UI.Helpers.BackdropHelper.ApplyModernBackdrop(this, VoltrisOptimizer.UI.Helpers.BackdropHelper.SystemBackdropType.Acrylic, isLight);
                }
                else
                    VoltrisOptimizer.UI.Helpers.BackdropHelper.RemoveBackdrop(this);
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogWarning($"Erro ao aplicar transparência: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Define o ícone da janela usando Win32 API para garantir que apareça na barra de tarefas e Alt+Tab
        /// </summary>
        /// <summary>
        /// Define o ícone da janela usando Win32 API para garantir que apareça na barra de tarefas e Alt+Tab
        /// </summary>
        private void SetWindowIcon(IntPtr hwnd)
        {
            try
            {
                // Carregar do recurso embutido (mais seguro que arquivo solto)
                var iconUri = new Uri("pack://application:,,,/Images/favicon.ico");
                var resourceInfo = Application.GetResourceStream(iconUri);
                
                if (resourceInfo != null)
                {
                    using (var iconStream = resourceInfo.Stream)
                    {
                        // Carregar o .ico completo - Windows escolhe automaticamente as melhores resoluções
                        var icon = new System.Drawing.Icon(iconStream);
                        
                        // Definir ícone grande (usado na barra de tarefas e Alt+Tab)
                        // O Windows seleciona automaticamente a melhor resolução do .ico
                        Win32.SendMessage(hwnd, Win32.WM_SETICON, new IntPtr(1), icon.Handle); // ICON_BIG
                        
                        // Definir ícone pequeno (usado na barra de título)
                        Win32.SendMessage(hwnd, Win32.WM_SETICON, new IntPtr(0), icon.Handle); // ICON_SMALL
                        
                        // Também definir via SetClassLongPtr para garantir persistência
                        Win32.SetClassLongPtrSafe(hwnd, Win32.GCL_HICON, icon.Handle);
                        Win32.SetClassLongPtrSafe(hwnd, Win32.GCL_HICONSM, icon.Handle);
                        
                        // Forçar atualização do ícone WPF também
                        try 
                        {
                            iconStream.Position = 0;
                            this.Icon = System.Windows.Media.Imaging.BitmapFrame.Create(
                                iconStream,
                                System.Windows.Media.Imaging.BitmapCreateOptions.None,
                                System.Windows.Media.Imaging.BitmapCacheOption.OnLoad
                            );
                        }
                        catch (Exception ex)
                        {
                            App.LoggingService?.LogWarning($"Erro ao definir this.Icon WPF: {ex.Message}");
                        }

                        App.LoggingService?.LogInfo("Ícone da janela definido com sucesso (multi-resolução)");
                    }
                }
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogWarning($"Erro ao definir ícone da janela: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Aplica região arredondada à janela (fallback para Windows 10)
        protected override void OnSourceInitialized(EventArgs e)
        {
            base.OnSourceInitialized(e);
            _hwnd = new WindowInteropHelper(this).Handle;
            
            HwndSource? source = HwndSource.FromHwnd(_hwnd);
            source?.AddHook(WndProc);
            
            LogToFile($"[MainWindow] WndProc Hook registrado no HWND: {_hwnd}");
            
            CreateDummyWindow();
        }

        private void CreateDummyWindow()
        {
            try
            {
                if (_dummySource != null) return;
                var p = new HwndSourceParameters("VoltrisOptimizer.Hidden");
                p.Width = 0;
                p.Height = 0;
                p.PositionX = -32000;
                p.PositionY = -32000;
                p.WindowStyle = unchecked((int)0x80000000);
                p.ExtendedWindowStyle = Win32WindowHelper.WS_EX_TOOLWINDOW;
                _dummySource = new HwndSource(p);
            }
            catch { }
        }

        private void HideToTray()
        {
            try
            {
                if (_hwnd == IntPtr.Zero) _hwnd = new WindowInteropHelper(this).Handle;
                Win32WindowHelper.RemoveExStyle(_hwnd, Win32WindowHelper.WS_EX_APPWINDOW);
                Win32WindowHelper.AddExStyle(_hwnd, Win32WindowHelper.WS_EX_TOOLWINDOW);
                ShowInTaskbar = false;
                Hide();
                Win32WindowHelper.ShowWindowAsync(_hwnd, Win32WindowHelper.SW_HIDE);
            }
            catch { }
        }

        private void RestoreFromTray()
        {
            try
            {
                if (_hwnd == IntPtr.Zero) _hwnd = new WindowInteropHelper(this).Handle;
                Win32WindowHelper.RemoveExStyle(_hwnd, Win32WindowHelper.WS_EX_TOOLWINDOW);
                Win32WindowHelper.AddExStyle(_hwnd, Win32WindowHelper.WS_EX_APPWINDOW);
                ShowInTaskbar = true;
                Show();
                WindowState = WindowState.Normal;
                Activate();
                Win32WindowHelper.ShowWindowAsync(_hwnd, Win32WindowHelper.SW_SHOW);
                Win32WindowHelper.SetForegroundWindow(_hwnd);
            }
            catch { }
        }
        

        
        
        private void InitializeNotifyIcon()
        {
            LogToFile("InitializeNotifyIcon() - INÍCIO");
            try
            {
                LogToFile("Obtendo ícone do aplicativo...");
                
                System.Drawing.Icon? icon = null;
                
                // Tentar carregar de recurso embutido (MÉTODO PREFERIDO)
                try 
                {
                    var iconUri = new Uri("pack://application:,,,/Images/favicon.ico");
                    var resourceInfo = Application.GetResourceStream(iconUri);
                    if (resourceInfo != null)
                    {
                        using (var stream = resourceInfo.Stream)
                        {
                            // Carregar o .ico completo (todas as resoluções)
                            // O Windows automaticamente seleciona a melhor resolução para o System Tray
                            icon = new System.Drawing.Icon(stream);
                            LogToFile($"Ícone carregado de recurso embutido - Tamanho: {icon.Width}x{icon.Height}");
                        }
                    }
                }
                catch (Exception ex)
                {
                    LogToFile($"Erro ao carregar ícone de recurso embutido: {ex.Message}");
                }

                // Fallback: tentar carregar de arquivo físico
                if (icon == null)
                {
                    try
                    {
                        var iconPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Images", "favicon.ico");
                        if (File.Exists(iconPath))
                        {
                            icon = new System.Drawing.Icon(iconPath);
                            LogToFile($"Ícone carregado de arquivo físico: {iconPath}");
                        }
                    }
                    catch (Exception ex)
                    {
                        LogToFile($"Erro ao carregar ícone de arquivo físico: {ex.Message}");
                    }
                }

                // Último fallback: ícone do sistema
                if (icon == null)
                {
                    LogToFile("AVISO: Ícone não encontrado, usando SystemIcons.Application");
                    icon = System.Drawing.SystemIcons.Application;
                }
                
                // CRÍTICO: Criar NotifyIcon com ícone otimizado
                // O Windows automaticamente seleciona a melhor resolução do .ico multi-resolução
                LogToFile("Criando NotifyIcon...");
                _notifyIcon = new WinForms.NotifyIcon
                {
                    Icon = icon, // Usar o .ico completo - Windows escolhe a resolução automaticamente
                    Visible = true,
                    Text = "" // Tooltip clássico desativado — usamos o ModernTrayTooltip
                };
                
                LogToFile($"NotifyIcon criado - Visible: {_notifyIcon.Visible}, Text: {_notifyIcon.Text}");
                
                // Eventos
                _notifyIcon.MouseClick += NotifyIcon_MouseClick;
                _notifyIcon.DoubleClick += (s, e) => 
                {
                    LogToFile("NotifyIcon DoubleClick - chamando ShowWindow()");
                    ShowWindow();
                };

                // Modern tooltip: show on hover via MouseMove do NotifyIcon
                _notifyIcon.MouseMove += NotifyIcon_MouseMove;

                // Timer de delay para mostrar o tooltip (evita flash ao passar rapidamente)
                _tooltipShowTimer = new System.Windows.Threading.DispatcherTimer
                {
                    Interval = TimeSpan.FromMilliseconds(400)
                };
                _tooltipShowTimer.Tick += (s, e) =>
                {
                    _tooltipShowTimer.Stop();
                    ShowModernTooltip();
                };

                // Timer de polling: verifica se o mouse ainda está sobre o ícone do systray.
                // É a única forma confiável — WM_MOUSELEAVE não funciona bem com NotifyIcon
                // porque a janela do tooltip fica sobre o ícone e intercepta os eventos.
                // CORREÇÃO PERFORMANCE: 200ms é suficiente para detectar saída do mouse do ícone.
                // 100ms era desnecessariamente agressivo e gerava 10 ticks/s na UI thread.
                _tooltipMousePollTimer = new System.Windows.Threading.DispatcherTimer
                {
                    Interval = TimeSpan.FromMilliseconds(200)
                };
                _tooltipMousePollTimer.Tick += TooltipMousePollTimer_Tick;

                // Tooltip rico: atualizar com status do Shield + Perfil + Plano de Energia
                UpdateSystrayTooltip();

                // Subscrever a mudanças de perfil e plano de energia para atualizar tooltip
                SettingsService.Instance.ProfileChanged += (_, __) => UpdateSystrayTooltip();
                try
                {
                    if (App.Services != null)
                    {
                        var powerPlanService = App.Services.GetService<VoltrisOptimizer.Services.Power.IntelligentPowerPlanService>();
                        if (powerPlanService != null)
                            powerPlanService.PlanChanged += (_, __) => UpdateSystrayTooltip();

                        // Subscrever a mudanças de status do Shield para tooltip em tempo real
                        var shieldService = App.Services.GetService<VoltrisOptimizer.Services.Shield.VoltrisShieldService>();
                        if (shieldService != null)
                            shieldService.StatusChanged += (_, __) => UpdateSystrayTooltip();

                        // CORREÇÃO TOOLTIP: quando o VoltrisBlur reinicia o Explorer, a taskbar é
                        // destruída e recriada. O tooltip precisa ser fechado e recriado para que
                        // o posicionamento seja calculado com base na nova taskbar.
                        var voltrisBlurService = App.Services.GetService<VoltrisOptimizer.Services.Personalize.VoltrisBlurService>();
                        if (voltrisBlurService != null)
                        {
                            voltrisBlurService.ExplorerRestarted += (_, __) =>
                            {
                                TooltipLog("[ExplorerRestarted] Explorer reiniciando — supprimindo tooltip por 6 segundos.");
                                _suppressTooltipUntil = DateTime.UtcNow.AddSeconds(6);
                                HideModernTooltip();
                                _tooltipShowTimer?.Stop();
                                _tooltipMousePollTimer?.Stop();
                            };
                            TooltipLog("ExplorerRestarted event subscrito com sucesso.");
                        }
                    }
                }
                catch { }
                
                LogToFile("InitializeNotifyIcon() - SUCESSO");
            }
            catch (Exception ex)
            {
                LogToFile($"ERRO CRÍTICO em InitializeNotifyIcon(): {ex.Message}\\n{ex.StackTrace}");
                App.LoggingService?.LogError($"Erro ao inicializar systray: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Atualiza os dados do ModernTrayTooltip com status atual.
        /// O tooltip clássico (NotifyIcon.Text) é mantido vazio intencionalmente.
        /// </summary>
        private void UpdateSystrayTooltip()
        {
            if (_notifyIcon == null) return;

            try
            {
                // Atualizar o tooltip moderno se estiver visível
                if (_modernTooltip != null && _modernTooltip.IsVisible)
                {
                    Dispatcher.Invoke(() => RefreshModernTooltipData());
                }
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogWarning($"[Systray] Erro ao atualizar tooltip: {ex.Message}");
            }
        }

        private void RefreshModernTooltipData()
        {
            if (_modernTooltip == null) return;
            var shieldService = App.Services?.GetService<VoltrisOptimizer.Services.Shield.VoltrisShieldService>();
            var shieldActive = shieldService?.IsProtectionActive ?? false;
            var profile = SettingsService.Instance.Settings.IntelligentProfile;
            var profileName = VoltrisOptimizer.Services.Power.IntelligentPowerPlanService.GetProfileDisplayName(profile);
            string planName;
            try
            {
                var powerService = App.Services?.GetService<VoltrisOptimizer.Services.Power.IntelligentPowerPlanService>();
                planName = powerService?.GetActivePlanDisplayName() ?? "—";
            }
            catch { planName = "—"; }
            var version = System.Reflection.Assembly.GetExecutingAssembly().GetName().Version?.ToString(4) ?? "—";
            _modernTooltip.UpdateStatus(shieldActive, profileName, planName, version);
        }

        // ── P/Invoke para obter posição real do cursor (independente de DPI/WinForms) ──
        [DllImport("user32.dll")]
        private static extern bool GetCursorPos(out System.Drawing.Point lpPoint);

        // ── Shell_NotifyIconGetRect: obtém o rect exato do ícone no systray ──
        [StructLayout(LayoutKind.Sequential)]
        private struct NOTIFYICONIDENTIFIER
        {
            public uint cbSize;
            public IntPtr hWnd;
            public uint uID;
            public Guid guidItem;
        }
        [DllImport("shell32.dll", SetLastError = true)]
        private static extern int Shell_NotifyIconGetRect(ref NOTIFYICONIDENTIFIER identifier, out RECT iconLocation);
        [StructLayout(LayoutKind.Sequential)]
        private struct RECT { public int Left, Top, Right, Bottom; }

        private void TooltipLog(string msg)
        {
            var line = $"[{DateTime.Now:HH:mm:ss.fff}] [TOOLTIP] {msg}";
            System.Diagnostics.Debug.WriteLine(line);
            try
            {
                var logDir = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                System.IO.Directory.CreateDirectory(logDir);
                System.IO.File.AppendAllText(System.IO.Path.Combine(logDir, "tooltip_debug.log"), line + "\n");
            }
            catch { }
        }

        private System.Drawing.Rectangle GetTrayIconRect()
        {
            try
            {
                if (_notifyIcon == null) return System.Drawing.Rectangle.Empty;

                // .NET 8+ renomeou os campos internos de "id"/"window" para "_id"/"_window"
                // Tentamos ambas as variantes para compatibilidade com .NET 6/7/8+
                var idField = typeof(WinForms.NotifyIcon)
                    .GetField("_id", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                    ?? typeof(WinForms.NotifyIcon)
                    .GetField("id", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
                var windowField = typeof(WinForms.NotifyIcon)
                    .GetField("_window", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)
                    ?? typeof(WinForms.NotifyIcon)
                    .GetField("window", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);

                if (idField == null || windowField == null)
                {
                    TooltipLog("GetTrayIconRect: campos 'id' ou 'window' não encontrados via reflexão");
                    return System.Drawing.Rectangle.Empty;
                }

                uint id = 0;
                try { id = Convert.ToUInt32(idField.GetValue(_notifyIcon)); } catch { }
                var nativeWindow = windowField.GetValue(_notifyIcon);
                if (nativeWindow == null) return System.Drawing.Rectangle.Empty;

                var handleProp = nativeWindow.GetType().GetProperty("Handle",
                    System.Reflection.BindingFlags.Public | System.Reflection.BindingFlags.Instance);
                IntPtr hWnd = (IntPtr)(handleProp?.GetValue(nativeWindow) ?? IntPtr.Zero);

                TooltipLog($"GetTrayIconRect: hWnd=0x{hWnd:X} id={id}");

                if (hWnd == IntPtr.Zero) return System.Drawing.Rectangle.Empty;

                var nid = new NOTIFYICONIDENTIFIER
                {
                    cbSize   = (uint)Marshal.SizeOf<NOTIFYICONIDENTIFIER>(),
                    hWnd     = hWnd,
                    uID      = id,
                    guidItem = Guid.Empty
                };

                int hr = Shell_NotifyIconGetRect(ref nid, out RECT r);
                TooltipLog($"GetTrayIconRect: Shell_NotifyIconGetRect hr=0x{hr:X8} rect=({r.Left},{r.Top},{r.Right},{r.Bottom})");

                if (hr == 0) // S_OK
                    return System.Drawing.Rectangle.FromLTRB(r.Left, r.Top, r.Right, r.Bottom);
            }
            catch (Exception ex)
            {
                TooltipLog($"GetTrayIconRect ERRO: {ex.Message}");
            }
            return System.Drawing.Rectangle.Empty;
        }

        private void NotifyIcon_MouseMove(object? sender, WinForms.MouseEventArgs e)
        {
            if (_isTrayContextMenuOpen) return;
            // Cooldown pós-restart do Explorer: evita que o tooltip reapareça imediatamente
            if (DateTime.UtcNow < _suppressTooltipUntil) return;

            // e.Location retorna (0,0) no NotifyIcon — usar GetCursorPos para posição real
            GetCursorPos(out System.Drawing.Point realPos);
            _lastMousePos = realPos;

            // CORREÇÃO CRÍTICA: Só disparar se o mouse estiver REALMENTE sobre o ícone.
            // Isso evita que o tooltip apareça do nada no startup ou se o mouse estiver em (0,0).
            var iconRect = GetTrayIconRect();
            if (iconRect.IsEmpty) 
            {
                // Se não conseguimos o rect, não podemos confirmar o hover com segurança.
                // Logamos mas não prosseguimos para evitar tooltips "fantasmas".
                return; 
            }

            // Adicionar uma margem de tolerância de 5px.
            var toleranceRect = iconRect;
            toleranceRect.Inflate(5, 5);
            if (!toleranceRect.Contains(realPos))
            {
                // Mouse disparou o evento mas não está sobre o rect (evento espúrio do Windows)
                return;
            }

            TooltipLog($"MouseMove e.Location=({e.Location.X},{e.Location.Y}) realPos=({realPos.X},{realPos.Y}) _tooltipVisible={_tooltipVisible} showTimerActive={_tooltipShowTimer?.IsEnabled}");

            // Se o tooltip já está visível ou o timer de show já está rodando, não fazer nada
            if (_tooltipVisible) return;
            if (_tooltipShowTimer?.IsEnabled ?? false) return;

            TooltipLog("MouseMove → iniciando _tooltipShowTimer");
            _tooltipShowTimer?.Start();
        }

        /// <summary>
        /// Polling a cada 100ms: verifica se o mouse ainda está sobre o ícone do systray.
        /// Usa Shell_NotifyIconGetRect para obter o rect exato do ícone, sem depender de
        /// NotifyIcon.MouseMove (que para de disparar quando o tooltip está visível).
        /// </summary>
        private void TooltipMousePollTimer_Tick(object? sender, EventArgs e)
        {
            // Guard: só processar se o tooltip está visível segundo nosso flag
            if (!_tooltipVisible) return;

            try
            {
                GetCursorPos(out System.Drawing.Point curPos);

                // 1. Tentar obter o rect exato do ícone via Shell API
                var iconRect = GetTrayIconRect();
                bool iconRectValid = !iconRect.IsEmpty;

                // 2. Fallback: usar posição do mouse no momento do show + tolerância generosa
                //    _tooltipAnchorPos é capturado via GetCursorPos no ShowModernTooltip, então é confiável
                if (!iconRectValid)
                {
                    // Tolerância de 60px — cobre o ícone (~24px) + margem de erro generosa
                    iconRect = new System.Drawing.Rectangle(
                        _tooltipAnchorPos.X - 60, _tooltipAnchorPos.Y - 60, 120, 120);
                }

                // 3. Expandir levemente o rect do ícone para evitar saída acidental por 1px
                var expandedIconRect = iconRectValid
                    ? System.Drawing.Rectangle.Inflate(iconRect, 4, 4)
                    : iconRect; // fallback já tem tolerância generosa

                // 4. Rect do tooltip em coordenadas de tela (pixels físicos)
                //    Usar tamanho mínimo de 300x160 se ainda não renderizou
                var dpi = GetSystemDpiScale();
                var tooltipScreenRect = _modernTooltip != null ? new System.Drawing.Rectangle(
                    (int)(_modernTooltip.Left   * dpi),
                    (int)(_modernTooltip.Top    * dpi),
                    (int)(Math.Max(_modernTooltip.ActualWidth,  300) * dpi),
                    (int)(Math.Max(_modernTooltip.ActualHeight, 160) * dpi)) : System.Drawing.Rectangle.Empty;

                bool overIcon    = expandedIconRect.Contains(curPos);
                bool overTooltip = !tooltipScreenRect.IsEmpty && tooltipScreenRect.Contains(curPos);

                TooltipLog($"Poll cursor=({curPos.X},{curPos.Y}) iconRect={expandedIconRect} overIcon={overIcon} overTooltip={overTooltip} iconRectValid={iconRectValid} lastMousePos=({_lastMousePos.X},{_lastMousePos.Y})");

                if (overIcon || overTooltip)
                    return; // mouse ainda na área — manter visível

                // Mouse saiu — esconder
                TooltipLog("Poll → mouse saiu da área → HideModernTooltip");
                _tooltipShowTimer?.Stop();
                _tooltipMousePollTimer?.Stop();
                HideModernTooltip();
            }
            catch (Exception ex)
            {
                TooltipLog($"Poll ERRO: {ex.Message}");
            }
        }

        private double GetSystemDpiScale()
        {
            try
            {
                var source = PresentationSource.FromVisual(this);
                if (source?.CompositionTarget != null)
                    return source.CompositionTarget.TransformToDevice.M11;
            }
            catch { }
            return 1.0;
        }

        private void ShowModernTooltip()
        {
            // Guard fora do Dispatcher para evitar enfileiramento de múltiplas chamadas
            if (_tooltipVisible) { TooltipLog("ShowModernTooltip → já visível, ignorando"); return; }
            if (_isTrayContextMenuOpen) return;
            // Cooldown pós-restart do Explorer
            if (DateTime.UtcNow < _suppressTooltipUntil)
            {
                TooltipLog("ShowModernTooltip → suprimido (cooldown pós-restart do Explorer ainda ativo).");
                return;
            }

            TooltipLog($"ShowModernTooltip → INICIANDO (lastMousePos={_lastMousePos.X},{_lastMousePos.Y})");

            try
            {
                Dispatcher.Invoke(() =>
                {
                    // Double-check dentro do Dispatcher (thread-safe)
                    if (_tooltipVisible) { TooltipLog("ShowModernTooltip Dispatcher → já visível, ignorando"); return; }

                    if (_modernTooltip == null)
                    {
                        _modernTooltip = new VoltrisOptimizer.UI.Controls.ModernTrayTooltip();
                        // Topmost NÃO é setado aqui — o Z-order é gerenciado internamente
                        // pelo ModernTrayTooltip via SetWindowPos (veja ApplyCorrectZOrder).
                        TooltipLog("ShowModernTooltip → ModernTrayTooltip criado");
                    }

                    // Setar flag ANTES de Show() para bloquear qualquer re-entrada
                    _tooltipVisible = true;

                    // Salvar posição do mouse no momento do show — usada pelo poll timer
                    GetCursorPos(out _tooltipAnchorPos);

                    RefreshModernTooltipData();

                    // Passar o rect físico do ícone para o tooltip posicionar-se corretamente
                    var iconRect = GetTrayIconRect();
                    if (iconRect.IsEmpty)
                    {
                        TooltipLog("ShowModernTooltip → ABORTANDO (iconRect está vazio, evita tooltip em posição aleatória)");
                        _tooltipVisible = false;
                        return;
                    }

                    TooltipLog($"ShowModernTooltip → iconRect={iconRect}");
                    _modernTooltip.SetIconRect(iconRect);

                    _modernTooltip.ShowAboveTray();

                    TooltipLog($"ShowModernTooltip → ShowAboveTray() chamado.");

                    // Iniciar polling
                    if (!(_tooltipMousePollTimer?.IsEnabled ?? false))
                    {
                        _tooltipMousePollTimer?.Start();
                        TooltipLog("ShowModernTooltip → _tooltipMousePollTimer iniciado");
                    }
                });
            }
            catch (Exception ex)
            {
                _tooltipVisible = false;
                TooltipLog($"ShowModernTooltip ERRO: {ex.Message}");
            }
        }

        private void HideModernTooltip()
        {
            TooltipLog("HideModernTooltip → chamado");
            try
            {
                Dispatcher.Invoke(() =>
                {
                    _tooltipVisible = false;
                    _tooltipMousePollTimer?.Stop();
                    if (_modernTooltip != null)
                    {
                        _modernTooltip.Hide();
                        // CORREÇÃO: fechar e recriar o tooltip após cada uso.
                        // Quando o Explorer reinicia (VoltrisBlur), a taskbar é destruída e recriada.
                        // O tooltip mantém referências antigas (DPI source, posição, HWND da taskbar).
                        // Recriar garante que na próxima exibição o posicionamento seja calculado
                        // com base na taskbar nova — elimina o problema de tooltip em posição errada.
                        try { _modernTooltip.Close(); } catch { }
                        _modernTooltip = null;
                        TooltipLog("HideModernTooltip → tooltip fechado e descartado (será recriado no próximo show)");
                    }
                });
            }
            catch (Exception ex)
            {
                TooltipLog($"HideModernTooltip ERRO: {ex.Message}");
            }
        }

        private void NotifyIcon_MouseClick(object? sender, WinForms.MouseEventArgs e)
        {
            if (e.Button == WinForms.MouseButtons.Right)
            {
                ShowContextMenu();
            }
            else if (e.Button == WinForms.MouseButtons.Left)
            {
                ShowWindow();
            }
        }

        private void ShowContextMenu()
        {
            // Usar BeginInvoke para evitar bloqueio e re-entrância no dispatcher
            Application.Current.Dispatcher.BeginInvoke(new Action(() =>
            {
                try
                {
                    // Parar timers de tooltip e esconder tooltip imediatamente
                    // para evitar que o tooltip roube foco e feche o menu
                    _tooltipShowTimer?.Stop();
                    HideModernTooltip();

                    // Se já existe um menu aberto, fechar antes de recriar
                    if (_isTrayContextMenuOpen && _cachedTrayMenu != null)
                    {
                        _cachedTrayMenu.IsOpen = false;
                    }

                    // Sempre recriar para refletir estado atual
                    _cachedTrayMenu = CreateTrayContextMenu();
                    var contextMenu = _cachedTrayMenu;

                    var mousePos = System.Windows.Forms.Control.MousePosition;

                    // CORREÇÃO: Usar a janela dummy (invisível) para SetForegroundWindow.
                    // Usar a janela principal (que pode estar oculta com WS_EX_TOOLWINDOW)
                    // causa instabilidade de foco e faz o menu piscar/fechar.
                    IntPtr foregroundHwnd = IntPtr.Zero;
                    if (_dummySource != null && _dummySource.Handle != IntPtr.Zero)
                    {
                        foregroundHwnd = _dummySource.Handle;
                    }
                    else
                    {
                        if (_hwnd == IntPtr.Zero)
                            _hwnd = new WindowInteropHelper(this).Handle;
                        foregroundHwnd = _hwnd;
                    }

                    if (foregroundHwnd != IntPtr.Zero)
                    {
                        Win32.SetForegroundWindow(foregroundHwnd);
                    }

                    // Rastrear estado do menu para impedir tooltip de interferir
                    _isTrayContextMenuOpen = true;
                    contextMenu.Closed += (s, e) =>
                    {
                        _isTrayContextMenuOpen = false;
                    };

                    contextMenu.PlacementTarget = this;
                    contextMenu.Placement = System.Windows.Controls.Primitives.PlacementMode.AbsolutePoint;
                    contextMenu.PlacementRectangle = new Rect(mousePos.X, mousePos.Y, 0, 0);
                    contextMenu.HorizontalOffset = 0;
                    contextMenu.VerticalOffset = 0;
                    contextMenu.StaysOpen = false;

                    contextMenu.IsOpen = true;
                }
                catch (Exception ex)
                {
                    _isTrayContextMenuOpen = false;
                    App.LoggingService?.LogError("Erro ao exibir menu do systray", ex);
                }
            }), System.Windows.Threading.DispatcherPriority.Send);
        }

        private ContextMenu CreateTrayContextMenu()
        {
            var menu = new ContextMenu();
            
            // Obter versão
            var version = System.Reflection.Assembly.GetExecutingAssembly().GetName().Version;
            string versionString;
            if (version != null)
            {
                if (version.Revision != -1 && version.Revision != 0)
                {
                    versionString = $"v{version.Major}.{version.Minor}.{version.Build}.{version.Revision}";
                }
                else
                {
                    versionString = $"v{version.Major}.{version.Minor}.{version.Build}";
                }
            }
            else
            {
                versionString = "v1.0.0.9";
            }
            
            // Cabeçalho (não clicável, apenas visual)
            var headerItem = new MenuItem
            {
                Header = CreateHeaderContent("Voltris Optimizer", versionString),
                IsEnabled = false,
                Background = new SolidColorBrush(MediaColor.FromRgb(0x1A, 0x1A, 0x2E)),
                Padding = new Thickness(16, 12, 16, 12),
                Height = 72,
                HorizontalContentAlignment = HorizontalAlignment.Center
            };
            menu.Items.Add(headerItem);
            
            menu.Items.Add(CreateFullWidthSeparator());
            
            // Seção: Ações Rápidas
            menu.Items.Add(CreateSectionHeader("Ações Rápidas"));
            
            // Mostrar
            var showItem = new MenuItem
            {
                Header = "Mostrar",
                Icon = new TextBlock { Text = "👁️", FontSize = 14 }
            };
            showItem.Click += (s, e) => ShowWindow();
            menu.Items.Add(showItem);
            
            // Dashboard
            var dashboardItem = new MenuItem
            {
                Header = "Dashboard",
                Icon = new TextBlock { Text = "🏠", FontSize = 14 }
            };
            dashboardItem.Click += (s, e) =>
            {
                ShowWindow();
                NavigateToPageSafe("Dashboard");
            };
            menu.Items.Add(dashboardItem);
            
            // Limpeza Rápida
            var cleanupItem = new MenuItem
            {
                Header = "Limpeza Rápida",
                Icon = new TextBlock { Text = "🧹", FontSize = 14 }
            };
            cleanupItem.Click += async (s, e) =>
            {
                try
                {
                    App.LoggingService?.LogInfo("[Systray] Limpeza Rápida iniciada via Systray");
                    
                    ShowWindow();
                    await NavigateToPageSafeAsync("Dashboard");
                    
                    var dashboardVM = App.Services?.GetService(typeof(DashboardViewModel)) as DashboardViewModel;
                    if (dashboardVM != null)
                    {
                        await Application.Current.Dispatcher.InvokeAsync(async () => 
                        {
                            await dashboardVM.QuickCleanupAsync("Systray");
                        });
                    }
                    else
                    {
                        App.LoggingService?.LogError("[Systray.QuickCleanup] DashboardViewModel não disponível");
                    }
                }
                catch (Exception ex)
                {
                    App.LoggingService?.LogError("[Systray.QuickCleanup] Erro ao executar limpeza", ex);
                }
            };
            menu.Items.Add(cleanupItem);
            
            // Otimizar Agora
            var optimizeItem = new MenuItem
            {
                Header = "Otimizar Agora",
                Icon = new TextBlock { Text = "⚡", FontSize = 14 }
            };
            optimizeItem.Click += async (s, e) =>
            {
                try
                {
                    App.LoggingService?.LogInfo("[Systray] Otimizar Agora iniciado via Systray");
                    
                    ShowWindow();
                    await NavigateToPageSafeAsync("Dashboard");
                    
                    var dashboardVM = App.Services?.GetService(typeof(DashboardViewModel)) as DashboardViewModel;
                    if (dashboardVM != null)
                    {
                        await Application.Current.Dispatcher.InvokeAsync(async () => 
                        {
                            await dashboardVM.QuickOptimizeAsync("Systray");
                        });
                    }
                    else
                    {
                        App.LoggingService?.LogError("[Systray.QuickOptimize] DashboardViewModel não disponível");
                    }
                }
                catch (Exception ex)
                {
                    App.LoggingService?.LogError("[Systray.QuickOptimize] Erro ao executar otimização", ex);
                }
            };
            menu.Items.Add(optimizeItem);
            
            menu.Items.Add(CreateFullWidthSeparator());
            
            // Seção: Navegação
            menu.Items.Add(CreateSectionHeader("Navegação"));
            
            // Histórico
            var historyItem = new MenuItem
            {
                Header = "Histórico",
                Icon = new TextBlock { Text = "📊", FontSize = 14 }
            };
            historyItem.Click += (s, e) =>
            {
                ShowWindow();
                NavigateToPageSafe("History");
            };
            menu.Items.Add(historyItem);
            
            // Agendamento
            var schedulerItem = new MenuItem
            {
                Header = "Agendamento",
                Icon = new TextBlock { Text = "⏰", FontSize = 14 }
            };
            schedulerItem.Click += (s, e) =>
            {
                ShowWindow();
                NavigateToPageSafe("Scheduler");
            };
            menu.Items.Add(schedulerItem);
            
            // Configurações
            var settingsItem = new MenuItem
            {
                Header = "Configurações",
                Icon = new TextBlock { Text = "⚙️", FontSize = 14 }
            };
            settingsItem.Click += (s, e) =>
            {
                ShowWindow();
                NavigateToPageSafe("Settings");
            };
            menu.Items.Add(settingsItem);
            
            menu.Items.Add(CreateFullWidthSeparator());

            // ============================================
            // SUBMENU: Modo Gamer
            // ============================================
            menu.Items.Add(CreateSectionHeader("Controles"));
            bool isGamerActive = _gamerOrchestrator?.IsActive ?? false;

            var gamerMenu = new MenuItem
            {
                Header = isGamerActive ? "Modo Gamer  ●" : "Modo Gamer",
                Icon = new TextBlock { Text = "🎮", FontSize = 14 },
                Padding = new Thickness(8, 6, 8, 6)
            };

            var activateGamerItem = new MenuItem
            {
                Header = "Ativar Modo Gamer",
                Icon = new TextBlock { Text = "▶", FontSize = 12 },
                IsEnabled = !isGamerActive,
                FontWeight = isGamerActive ? FontWeights.Normal : FontWeights.SemiBold
            };
            activateGamerItem.Click += async (s, e) =>
            {
                try
                {
                    if (_gamerOrchestrator == null)
                        _gamerOrchestrator = App.Services?.GetService(typeof(IGamerModeOrchestrator)) as IGamerModeOrchestrator;
                    if (_gamerOrchestrator != null)
                    {
                        var options = _gamerOrchestrator.GetCurrentOptions();
                        await _gamerOrchestrator.ActivateAsync(options, null, null, default, true);
                        App.LoggingService?.LogInfo("[Systray] Modo Gamer ativado via Systray");
                    }
                }
                catch (Exception ex) { App.LoggingService?.LogError("[Systray] Erro ao ativar Modo Gamer", ex); }
            };
            gamerMenu.Items.Add(activateGamerItem);

            var deactivateGamerItem = new MenuItem
            {
                Header = "Desativar Modo Gamer",
                Icon = new TextBlock { Text = "⏹", FontSize = 12 },
                IsEnabled = isGamerActive,
                FontWeight = isGamerActive ? FontWeights.SemiBold : FontWeights.Normal
            };
            deactivateGamerItem.Click += async (s, e) =>
            {
                try
                {
                    if (_gamerOrchestrator == null)
                        _gamerOrchestrator = App.Services?.GetService(typeof(IGamerModeOrchestrator)) as IGamerModeOrchestrator;
                    if (_gamerOrchestrator != null)
                    {
                        await _gamerOrchestrator.DeactivateAsync();
                        App.LoggingService?.LogInfo("[Systray] Modo Gamer desativado via Systray");
                    }
                }
                catch (Exception ex) { App.LoggingService?.LogError("[Systray] Erro ao desativar Modo Gamer", ex); }
            };
            gamerMenu.Items.Add(deactivateGamerItem);

            menu.Items.Add(gamerMenu);

            // ============================================
            // SUBMENU: Perfil Inteligente
            // ============================================
            var currentProfile = SettingsService.Instance.Settings.IntelligentProfile;

            string currentProfileLabel = currentProfile switch
            {
                IntelligentProfileType.GamerCompetitive    => "Gamer Competitivo",
                IntelligentProfileType.GamerSinglePlayer   => "Gamer Single Player",
                IntelligentProfileType.WorkOffice          => "Trabalho / Office",
                IntelligentProfileType.CreativeVideoEditing=> "Vídeo / Design",
                IntelligentProfileType.DeveloperProgramming=> "Programação / Dev",
                IntelligentProfileType.EnterpriseSecure    => "Enterprise Seguro",
                IntelligentProfileType.GeneralBalanced     => "Uso Geral",
                _ => "Uso Geral"
            };

            var profileMenu = new MenuItem
            {
                Header = "Perfil Inteligente",
                Icon = new TextBlock { Text = "🧠", FontSize = 14 },
                Padding = new Thickness(8, 6, 8, 6)
            };

            var profileEntries = new[]
            {
                (IntelligentProfileType.GamerCompetitive,    "🎮", "Gamer Competitivo"),
                (IntelligentProfileType.GamerSinglePlayer,   "🎯", "Gamer Single Player"),
                (IntelligentProfileType.WorkOffice,          "💼", "Trabalho / Office"),
                (IntelligentProfileType.CreativeVideoEditing,"🎬", "Vídeo / Design"),
                (IntelligentProfileType.DeveloperProgramming,"💻", "Programação / Dev"),
                (IntelligentProfileType.EnterpriseSecure,    "🏢", "Enterprise Seguro"),
                (IntelligentProfileType.GeneralBalanced,     "⚖️", "Uso Geral"),
            };

            foreach (var (profileType, profileIcon, profileLabel) in profileEntries)
            {
                bool isActive = currentProfile == profileType;
                var profileItem = new MenuItem
                {
                    Header = isActive ? $"✔ {profileLabel}" : profileLabel,
                    Icon = new TextBlock { Text = profileIcon, FontSize = 13 },
                    FontWeight = isActive ? FontWeights.SemiBold : FontWeights.Normal,
                    IsEnabled = !isActive
                };
                var capturedType = profileType;
                profileItem.Click += (s, e) =>
                {
                    try
                    {
                        SettingsService.Instance.Settings.IntelligentProfile = capturedType;
                        SettingsService.Instance.SaveSettings();
                        SettingsService.Instance.NotifyProfileChanged(capturedType);
                        App.LoggingService?.LogInfo($"[Systray] Perfil Inteligente alterado para: {capturedType}");
                    }
                    catch (Exception ex) { App.LoggingService?.LogError("[Systray] Erro ao aplicar perfil", ex); }
                };
                profileMenu.Items.Add(profileItem);
            }

            menu.Items.Add(profileMenu);

            // ============================================
            // SUBMENU: Voltris Shield
            // ============================================
            var shieldMenu = new MenuItem
            {
                Header = "Voltris Shield",
                Icon = new TextBlock { Text = "🛡️", FontSize = 14 },
                Padding = new Thickness(8, 6, 8, 6)
            };

            var openShieldItem = new MenuItem
            {
                Header = "Abrir Voltris Shield",
                Icon = new TextBlock { Text = "🛡️", FontSize = 13 }
            };
            openShieldItem.Click += (s, e) => { ShowWindow(); NavigateToPageSafe("Shield"); };
            shieldMenu.Items.Add(openShieldItem);

            shieldMenu.Items.Add(new Separator());

            var quickScanItem = new MenuItem
            {
                Header = "Verificação rápida",
                Icon = new TextBlock { Text = "🔍", FontSize = 13 }
            };
            quickScanItem.Click += async (s, e) =>
            {
                try
                {
                    var shieldVM = App.Services?.GetService(typeof(VoltrisOptimizer.UI.ViewModels.ShieldViewModel)) as VoltrisOptimizer.UI.ViewModels.ShieldViewModel;
                    if (shieldVM != null)
                    {
                        App.LoggingService?.LogInfo("[Systray] Verificação rápida iniciada via Systray");
                        _ = Task.Run(() => Application.Current.Dispatcher.InvokeAsync(async () => await shieldVM.RunQuickScanAsync()));
                    }
                    else { ShowWindow(); NavigateToPageSafe("Shield"); }
                }
                catch (Exception ex) { App.LoggingService?.LogError("[Systray] Erro na verificação rápida", ex); }
            };
            shieldMenu.Items.Add(quickScanItem);

            var fullScanItem = new MenuItem
            {
                Header = "Verificação completa",
                Icon = new TextBlock { Text = "🔎", FontSize = 13 }
            };
            fullScanItem.Click += async (s, e) =>
            {
                try
                {
                    var shieldVM = App.Services?.GetService(typeof(VoltrisOptimizer.UI.ViewModels.ShieldViewModel)) as VoltrisOptimizer.UI.ViewModels.ShieldViewModel;
                    if (shieldVM != null)
                    {
                        App.LoggingService?.LogInfo("[Systray] Verificação completa iniciada via Systray");
                        _ = Task.Run(() => Application.Current.Dispatcher.InvokeAsync(async () => await shieldVM.RunFullScanAsync()));
                    }
                    else { ShowWindow(); NavigateToPageSafe("Shield"); }
                }
                catch (Exception ex) { App.LoggingService?.LogError("[Systray] Erro na verificação completa", ex); }
            };
            shieldMenu.Items.Add(fullScanItem);

            shieldMenu.Items.Add(new Separator());

            var networkGuardianItem = new MenuItem
            {
                Header = "Network Guardian",
                Icon = new TextBlock { Text = "🌐", FontSize = 13 }
            };
            networkGuardianItem.Click += async (s, e) =>
            {
                try
                {
                    var shieldVM = App.Services?.GetService(typeof(VoltrisOptimizer.UI.ViewModels.ShieldViewModel)) as VoltrisOptimizer.UI.ViewModels.ShieldViewModel;
                    if (shieldVM != null)
                    {
                        App.LoggingService?.LogInfo("[Systray] Network Guardian scan iniciado via Systray");
                        _ = Task.Run(() => Application.Current.Dispatcher.InvokeAsync(async () => await shieldVM.RunNetworkScanAsync()));
                    }
                    ShowWindow();
                    NavigateToPageSafe("Shield");
                }
                catch (Exception ex) { App.LoggingService?.LogError("[Systray] Erro no Network Guardian", ex); }
            };
            shieldMenu.Items.Add(networkGuardianItem);

            var securityLogsItem = new MenuItem
            {
                Header = "Logs de segurança",
                Icon = new TextBlock { Text = "📋", FontSize = 13 }
            };
            securityLogsItem.Click += (s, e) => { ShowWindow(); NavigateToPageSafe("Shield"); };
            shieldMenu.Items.Add(securityLogsItem);

            menu.Items.Add(shieldMenu);

            menu.Items.Add(CreateFullWidthSeparator());
            
            // Sair
            var exitItem = new MenuItem
            {
                Header = "Sair",
                Icon = new TextBlock { Text = "🚪", FontSize = 14 },
                Foreground = new SolidColorBrush((MediaColor)Application.Current.Resources["AccentColor"])
            };
            exitItem.Click += (s, e) => ExitApplication();
            menu.Items.Add(exitItem);
            
            return menu;
        }

        private FrameworkElement CreateHeaderContent(string title, string version)
        {
            var container = new StackPanel
            {
                Orientation = Orientation.Horizontal,
                HorizontalAlignment = HorizontalAlignment.Center,
                VerticalAlignment = VerticalAlignment.Center
            };

            // Ícone — 36px, centralizado verticalmente com o bloco de texto
            bool iconLoaded = false;
            var icon = new System.Windows.Controls.Image
            {
                Width = 36,
                Height = 36,
                VerticalAlignment = VerticalAlignment.Center,
                Margin = new Thickness(0, 0, 12, 0),
                SnapsToDevicePixels = true,
                UseLayoutRounding = true
            };
            try
            {
                var pngUri = new Uri("pack://application:,,,/Images/voltris.png", UriKind.Absolute);
                icon.Source = new BitmapImage(pngUri);
                RenderOptions.SetBitmapScalingMode(icon, BitmapScalingMode.HighQuality);
                iconLoaded = true;
            }
            catch { }

            if (iconLoaded)
            {
                container.Children.Add(icon);
            }
            else
            {
                var gradient = new LinearGradientBrush
                {
                    StartPoint = new System.Windows.Point(0, 0),
                    EndPoint = new System.Windows.Point(1, 0)
                };
                gradient.GradientStops.Add(new GradientStop((MediaColor)Application.Current.Resources["AccentColor"], 0));
                gradient.GradientStops.Add(new GradientStop((MediaColor)Application.Current.Resources["SecondaryColor"], 0.5));
                gradient.GradientStops.Add(new GradientStop((MediaColor)Application.Current.Resources["PrimaryColor"], 1));
                container.Children.Add(new TextBlock
                {
                    Text = "⚡",
                    FontSize = 28,
                    VerticalAlignment = VerticalAlignment.Center,
                    Margin = new Thickness(0, 0, 12, 0),
                    Foreground = gradient
                });
            }

            // Bloco de texto: título + versão
            var textGradient = new LinearGradientBrush
            {
                StartPoint = new System.Windows.Point(0, 0),
                EndPoint = new System.Windows.Point(1, 0)
            };
            textGradient.GradientStops.Add(new GradientStop((MediaColor)Application.Current.Resources["AccentColor"], 0));
            textGradient.GradientStops.Add(new GradientStop((MediaColor)Application.Current.Resources["SecondaryColor"], 0.5));
            textGradient.GradientStops.Add(new GradientStop((MediaColor)Application.Current.Resources["PrimaryColor"], 1));

            var textStack = new StackPanel
            {
                VerticalAlignment = VerticalAlignment.Center,
                Orientation = Orientation.Vertical
            };
            var titleBlock = new TextBlock
            {
                Text = title,
                FontSize = 14,
                FontWeight = FontWeights.SemiBold,
                Foreground = textGradient
            };
            TextOptions.SetTextRenderingMode(titleBlock, System.Windows.Media.TextRenderingMode.ClearType);
            textStack.Children.Add(titleBlock);
            textStack.Children.Add(new TextBlock
            {
                Text = version,
                FontSize = 11,
                Foreground = new SolidColorBrush(MediaColor.FromRgb(0x94, 0xA3, 0xB8)),
                Margin = new Thickness(0, 2, 0, 0)
            });

            container.Children.Add(textStack);
            return container;
        }

        private MenuItem CreateSectionHeader(string title)
        {
            var text = new TextBlock
            {
                Text = title.ToUpperInvariant(),
                FontSize = 10,
                FontWeight = FontWeights.SemiBold,
                Foreground = new SolidColorBrush((MediaColor)Application.Current.Resources["TextSecondaryColor"]),
                HorizontalAlignment = HorizontalAlignment.Center,
                VerticalAlignment = VerticalAlignment.Center,
                TextAlignment = TextAlignment.Center
            };
            var item = new MenuItem
            {
                Header = text,
                IsEnabled = false,
                Padding = new Thickness(8, 5, 8, 5),
                HorizontalContentAlignment = HorizontalAlignment.Stretch
            };
            return item;
        }

        private MenuItem CreateFullWidthSeparator()
        {
            var gradient = new LinearGradientBrush
            {
                StartPoint = new System.Windows.Point(0, 0),
                EndPoint = new System.Windows.Point(1, 0)
            };
            gradient.GradientStops.Add(new GradientStop((MediaColor)Application.Current.Resources["AccentColor"], 0));
            gradient.GradientStops.Add(new GradientStop((MediaColor)Application.Current.Resources["SecondaryColor"], 0.5));
            gradient.GradientStops.Add(new GradientStop((MediaColor)Application.Current.Resources["PrimaryColor"], 1));
            var border = new Border
            {
                Height = 1,
                HorizontalAlignment = HorizontalAlignment.Stretch,
                Background = gradient,
                // Margem negativa horizontal para compensar o padding interno do MenuItem
                Margin = new Thickness(-12, 4, -12, 4)
            };
            var item = new MenuItem
            {
                Header = border,
                IsEnabled = false,
                Padding = new Thickness(12, 0, 12, 0),
                HorizontalContentAlignment = HorizontalAlignment.Stretch
            };
            return item;
        }
        
        private System.Drawing.Icon GetApplicationIcon()
        {
            try
            {
                int iconSize = 128;
                try
                {
                    // Tentar obter DPI, mas não falhar se não conseguir
                    if (Application.Current.MainWindow != null)
                    {
                        var dpi = VisualTreeHelper.GetDpi(Application.Current.MainWindow);
                        iconSize = (int)Math.Round(48 * dpi.DpiScaleX);
                        iconSize = Math.Min(Math.Max(iconSize, 128), 256);
                    }
                }
                catch { }
                
                try
                {
                    App.LoggingService?.LogInfo($"Systray icon size selected: {iconSize}px");
                }
                catch { }

                var icoPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Images", "favicon.ico");
                if (File.Exists(icoPath))
                {
                    try
                    {
                        using (var iconStream = File.OpenRead(icoPath))
                        {
                            var ico = new System.Drawing.Icon(iconStream);
                            try
                            {
                                return new System.Drawing.Icon(ico, new System.Drawing.Size(iconSize, iconSize));
                            }
                            catch
                            {
                                return ico;
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        App.LoggingService?.LogWarning($"Erro ao carregar favicon.ico: {ex.Message}");
                    }
                }

                var pngPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Images", "logo.png");
                if (File.Exists(pngPath))
                {
                    try
                    {
                        using (var bitmap = new Bitmap(pngPath))
                        {
                            using (var resizedBitmap = new Bitmap(bitmap, iconSize, iconSize))
                            {
                                var iconHandle = resizedBitmap.GetHicon();
                                var icon = (System.Drawing.Icon)System.Drawing.Icon.FromHandle(iconHandle).Clone();
                                Win32.DestroyIcon(iconHandle);
                                return icon;
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        App.LoggingService?.LogWarning($"Erro ao carregar logo.png: {ex.Message}");
                    }
                }
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"Erro ao obter ícone do aplicativo: {ex.Message}", ex);
            }

            // Fallback: usar ícone padrão do sistema
            try
            {
                return System.Drawing.SystemIcons.Application;
            }
            catch
            {
                // Último recurso: criar um ícone simples
                return new System.Drawing.Icon(System.Drawing.SystemIcons.Application, 16, 16);
            }
        }
        
        // Helper class para liberar handles de ícones e APIs DWM
        private static class Win32
        {
            [DllImport("user32.dll", CharSet = CharSet.Auto)]
            public static extern bool DestroyIcon(IntPtr handle);
            
            [DllImport("user32.dll")]
            public static extern bool SetForegroundWindow(IntPtr hWnd);
            
            // APIs para definir ícone da janela
            [DllImport("user32.dll", CharSet = CharSet.Auto)]
            internal static extern IntPtr SendMessage(IntPtr hWnd, uint Msg, IntPtr wParam, IntPtr lParam);
            
            [DllImport("user32.dll", SetLastError = true)]
            internal static extern IntPtr SetClassLongPtr(IntPtr hWnd, int nIndex, IntPtr dwNewLong);
            
            [DllImport("user32.dll", SetLastError = true, EntryPoint = "SetClassLong")]
            internal static extern IntPtr SetClassLong32(IntPtr hWnd, int nIndex, IntPtr dwNewLong);
            
            // Constantes para mensagens e índices
            internal const uint WM_SETICON = 0x0080;
            internal const int GCL_HICON = -14;
            internal const int GCL_HICONSM = -34;
            
            // DWM APIs para bordas arredondadas nativas do Windows 11
            [DllImport("dwmapi.dll", CharSet = CharSet.Unicode, PreserveSig = false)]
            internal static extern void DwmSetWindowAttribute(IntPtr hwnd, DWMWINDOWATTRIBUTE attribute, ref int pvAttribute, uint cbAttribute);
            
            [DllImport("dwmapi.dll", CharSet = CharSet.Unicode, PreserveSig = false)]
            internal static extern void DwmExtendFrameIntoClientArea(IntPtr hwnd, ref MARGINS margins);
            
            [DllImport("user32.dll")]
            internal static extern int SetWindowRgn(IntPtr hWnd, IntPtr hRgn, bool bRedraw);
            
            [DllImport("gdi32.dll")]
            internal static extern IntPtr CreateRoundRectRgn(int x1, int y1, int x2, int y2, int cx, int cy);
            
            [DllImport("gdi32.dll")]
            internal static extern bool DeleteObject(IntPtr hObject);
            
            // Helper para SetClassLongPtr (compatível com 32-bit e 64-bit)
            internal static IntPtr SetClassLongPtrSafe(IntPtr hWnd, int nIndex, IntPtr dwNewLong)
            {
                if (IntPtr.Size == 8) // 64-bit
                    return SetClassLongPtr(hWnd, nIndex, dwNewLong);
                else // 32-bit
                    return SetClassLong32(hWnd, nIndex, dwNewLong);
            }
            
            internal enum DWMWINDOWATTRIBUTE
            {
                DWMWA_WINDOW_CORNER_PREFERENCE = 33,
                DWMWA_BORDER_COLOR = 34,
                DWMWA_CAPTION_COLOR = 35,
                DWMWA_TEXT_COLOR = 36,
                DWMWA_VISIBLE_FRAME_BORDER_THICKNESS = 37,
                DWMWA_SYSTEMBACKDROP_TYPE = 38,
                DWMWA_MICA_EFFECT = 1029
            }
            
            internal enum DWM_WINDOW_CORNER_PREFERENCE
            {
                DWMWCP_DEFAULT = 0,
                DWMWCP_DONOTROUND = 1,
                DWMWCP_ROUND = 2,
                DWMWCP_ROUNDSMALL = 3
            }
            
            [StructLayout(LayoutKind.Sequential)]
            internal struct MARGINS
            {
                public int Left;
                public int Right;
                public int Top;
                public int Bottom;
            }
        }
        
        private void ShowWindow()
        {
            RestoreFromTray();
            Win32WindowHelper.ForceForegroundWindow(_hwnd);
        }

        /// <summary>
        /// Chamado pelo menu de contexto do desktop (/show) para restaurar a janela do systray.
        /// </summary>
        public void ShowFromContextMenu()
        {
            try
            {
                if (_hwnd == IntPtr.Zero) _hwnd = new WindowInteropHelper(this).Handle;
                RestoreFromTray();
                Win32WindowHelper.ForceForegroundWindow(_hwnd);
                LogToFile("[MainWindow] ShowFromContextMenu — janela restaurada do systray");
            }
            catch (Exception ex)
            {
                LogToFile($"[MainWindow] ShowFromContextMenu erro: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Fecha a aplicação completamente, liberando todos os recursos.
        /// Estratégia: ocultar janela IMEDIATAMENTE, disparar cleanup em background,
        /// e forçar Environment.Exit após timeout curto para nunca travar.
        /// </summary>
        private void ExitApplication()
        {
            try
            {
                _isClosing = true;
                
                // 0. CANCELAR TODOS OS LOOPS DE BACKGROUND (polling, etc.)
                try { _backgroundCts.Cancel(); } catch { }

                // 1. OCULTAR TUDO IMEDIATAMENTE — percepção de fechamento instantâneo
                try { this.Hide(); } catch { }
                if (_notifyIcon != null)
                {
                    _notifyIcon.Visible = false;
                    _notifyIcon.Dispose();
                    _notifyIcon = null;
                }

                // 2. Desinscrever eventos (rápido, sem IO)
                try { if (_gamerViewModel != null) _gamerViewModel.PropertyChanged -= OnGamerViewModelPropertyChanged; } catch { }
                try { if (_dummySource != null) { _dummySource.Dispose(); _dummySource = null; } } catch { }

                // 3. Disparar cleanup em background com timeout RÍGIDO de 2s
                // Gamer Mode + Enterprise + Session — tudo em paralelo, fire-and-forget
                _ = Task.Run(async () =>
                {
                    using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(2));
                    var tasks = new List<Task>();

                    // Gamer Mode deactivation (única tentativa — OnExit/ProcessExit não duplicam)
                    if (_gamerOrchestrator != null && _gamerOrchestrator.IsActive)
                    {
                        tasks.Add(Task.Run(async () =>
                        {
                            try { await _gamerOrchestrator.DeactivateAsync(cancellationToken: cts.Token); }
                            catch { }
                        }));
                    }

                    try { await Task.WhenAll(tasks).WaitAsync(cts.Token); } catch { }
                });

                // 4. Forçar encerramento do processo após 2.5s (safety net absoluto)
                // Isso garante que NUNCA trave, mesmo se alguma task ignorar o CancellationToken
                _ = Task.Run(async () =>
                {
                    await Task.Delay(2500);
                    Environment.Exit(0);
                });

                // 5. Iniciar shutdown do WPF Dispatcher (não-bloqueante)
                Application.Current.Dispatcher.InvokeShutdown();
            }
            catch
            {
                // Fallback absoluto
                try { Environment.Exit(0); } catch { }
            }
        }
        
        private void UpdateLocalizedTexts()
        {
            // Os botões de navegação agora usam ícones vetoriais, não precisam de atualização de texto aqui
            // A localização do texto é feita via binding ou diretamente no XAML
            
            // Atualizar status
            if (StatusLabel != null) StatusLabel.Text = _localization.GetString("Ready");
            
            // Atualizar tooltips
            if (SettingsButton != null) SettingsButton.ToolTip = _localization.GetString("Settings");
            if (MinimizeButton != null) MinimizeButton.ToolTip = _localization.GetString("Minimize");
            if (MaximizeButton != null) MaximizeButton.ToolTip = _localization.GetString("Maximize");
            if (CloseButton != null) CloseButton.ToolTip = _localization.GetString("Close");
        }



        private void NavButton_Click(object sender, RoutedEventArgs e)
        {
            // Verificar trava de onboarding
            if (_isLockedForOnboarding)
            {
                LockModal.Show();
                return;
            }

            // Proteção absoluta contra navegações concorrentes
            if (_isNavigating)
                return;
                
            if (!(sender is Button button) || !(button.Tag is string pageName))
                return;

            // Verificar se já está na página atual (se não for null)
            if (_currentSelectedButton != null && button == _currentSelectedButton)
                return;

            Button? previousButton = null;
            try
            {
                _isNavigating = true;
                
                // Desabilitar todos os botões temporariamente
                DisableNavigationButtons();
                
                // Armazenar botão selecionado ANTES de navegar (evita loops)
                previousButton = _currentSelectedButton;
                _currentSelectedButton = button;
                
                // Navegar PRIMEIRO
                NavigateToPageSafe(pageName);
                
                // Registrar telemetria de navegação
                _ = Task.Run(async () =>
                {
                    try
                    {
                        await VoltrisOptimizer.Services.Enterprise.TelemetryService.Instance.LogNavigationAsync(pageName);
                    }
                    catch { }
                });
                
                // Atualizar seleção visual
                Dispatcher.BeginInvoke(new System.Action(() =>
                {
                    try
                    {
                        if (_currentSelectedButton == button && button != null)
                        {
                            UpdateButtonSelectionSafe(button);
                        }
                    }
                    catch { }
                }), System.Windows.Threading.DispatcherPriority.Normal);
            }
            catch (Exception ex)
            {
                // Restaurar botão anterior em caso de erro
                _currentSelectedButton = previousButton;
                MessageBox.Show($"Erro ao navegar para {pageName}: {ex.Message}", "Erro", MessageBoxButton.OK, MessageBoxImage.Error);
            }
            finally
            {
                // Reabilitar botões IMEDIATAMENTE após a navegação (mas ainda via Dispatcher para evitar flickering)
                Dispatcher.BeginInvoke(new System.Action(() =>
                {
                    try
                    {
                        _isNavigating = false;
                        EnableNavigationButtons();
                    }
                    catch
                    {
                        _isNavigating = false;
                    }
                }), System.Windows.Threading.DispatcherPriority.Send); // Prioridade bem alta para reabilitar rápido
            }
        }

        private void DisableNavigationButtons()
        {
            var buttons = new[] { NavDashboard, NavCleanup, NavPerformance, NavNetwork, NavSystem, NavGamer, NavDiagnostics, NavHistory, NavScheduler, NavLogs, NavProfessionalServices, NavEnergy, NavShield, NavRepair, NavPersonalize, NavDisplay, NavSecurity, NavPrivacy, NavDebloat, NavDeviceInfo, NavBenchmark };
            foreach (var btn in buttons.Where(b => b != null))
            {
                btn.IsEnabled = false;
            }
        }

        private void EnableNavigationButtons()
        {
            var buttons = new[] { NavDashboard, NavCleanup, NavPerformance, NavNetwork, NavSystem, NavGamer, NavDiagnostics, NavHistory, NavScheduler, NavLogs, NavProfessionalServices, NavEnergy, NavShield, NavRepair, NavPersonalize, NavDisplay, NavSecurity, NavPrivacy, NavDebloat, NavDeviceInfo, NavBenchmark };
            foreach (var btn in buttons.Where(b => b != null))
            {
                btn.IsEnabled = true;
            }
        }

        private void UpdateButtonSelectionSafe(Button? selectedButton)
        {
            // Proteção absoluta contra loops recursivos
            if (_isUpdatingSelection)
                return;
            
            // Permitir null para limpar seleção

            try
            {
                // Ativar flag de proteção
                _isUpdatingSelection = true;

                // Armazenar botão selecionado
                _currentSelectedButton = selectedButton;

                var buttons = new[] { NavDashboard, NavCleanup, NavPerformance, NavNetwork, NavSystem, NavGamer, NavDiagnostics, NavHistory, NavScheduler, NavLogs, NavProfessionalServices, NavEnergy, NavShield, NavRepair, NavPersonalize, NavDisplay, NavSecurity, NavPrivacy, NavDebloat, NavDeviceInfo, NavBenchmark };
                
                // Verificar se os brushes não são nulos antes de aplicar
                if (_primaryBrush == null || _secondaryTextBrush == null)
                {
                    _isUpdatingSelection = false;
                    return;
                }

                // Aplicar estilos e cores para indicar seleção
                foreach (var btn in buttons.Where(b => b != null))
                {
                    try
                    {
                        bool isSelected = btn == selectedButton;
                        
                        // Aplicar estilo visual
                        if (isSelected)
                        {
                            btn.Style = (Style)Application.Current.Resources["PremiumNavButtonActiveStyle"];
                            btn.Foreground = _primaryBrush;
                            btn.FontWeight = FontWeights.SemiBold;
                        }
                        else
                        {
                            btn.Style = (Style)Application.Current.Resources["PremiumNavButtonStyle"];
                            btn.Foreground = _secondaryTextBrush;
                            btn.FontWeight = FontWeights.Medium;
                        }
                        
                        // O preenchimento (Fill) do ícone agora é controlado puramente pelo XAML (DataTriggers)
                        // para garantir que as cores originais (Azul, Roxo, Verde, etc) sejam mantidas.
                    }
                    catch
                    {
                        // Ignorar erro individual de cada botão
                        continue;
                    }
                }
            }
            catch
            {
                // Se houver erro, restaurar referência anterior
                _currentSelectedButton = null;
            }
            finally
            {
                // Sempre desativar flag de proteção
                _isUpdatingSelection = false;
            }
        }



        /// <summary>
        /// Método público para navegação externa (chamado por outras views)
        /// </summary>
        public void NavigateToPageFromOutside(string pageName)
        {
            if (_isNavigating)
                return;

            try
            {
                _isNavigating = true;
                if (_gateLocked && pageName != "Logs" && pageName != "Settings")
                {
                    LockModal.Show();
                    return;
                }
                
                // Atualizar botão da sidebar se necessário
                Button? targetButton = pageName switch
                {
                    "Dashboard" => NavDashboard,
                    "Cleanup" => NavCleanup,
                    "Performance" => NavPerformance,
                    "Network" => NavNetwork,
                    "System" => NavSystem,
                    "Gamer" => NavGamer,
                    "History" => NavHistory,
                    "Diagnostics" => NavDiagnostics,
                    "Scheduler" => NavScheduler,
                    "Logs" => NavLogs,
                    _ => null
                };

                if (targetButton != null)
                {
                    UpdateButtonSelectionSafe(targetButton);
                }

                NavigateToPageSafe(pageName);
            }
            finally
            {
                _isNavigating = false;
            }
        }

        /// <summary>
        /// Navega para a LyraResponseView e inicia o processamento da query
        /// </summary>
        public void NavigateToLyraView(LyraResponseView lyraView, string query)
        {
            try
            {
                App.LoggingService?.LogInfo("[MAIN_WINDOW] NavigateToLyraView chamado");
                App.LoggingService?.LogInfo($"[MAIN_WINDOW] _isNavigating: {_isNavigating}");
                App.LoggingService?.LogInfo($"[MAIN_WINDOW] ContentFrame é null: {ContentFrame == null}");
                
                if (_isNavigating)
                {
                    App.LoggingService?.LogWarning("[MAIN_WINDOW] Navegação já em andamento, ignorando...");
                    return;
                }

                if (ContentFrame == null)
                {
                    App.LoggingService?.LogError("[MAIN_WINDOW] ContentFrame é NULL!", null);
                    MessageBox.Show(
                        "Erro: ContentFrame não encontrado. Por favor, reinicie o aplicativo.",
                        "Erro",
                        MessageBoxButton.OK,
                        MessageBoxImage.Error
                    );
                    return;
                }

                _isNavigating = true;
                App.LoggingService?.LogInfo("[MAIN_WINDOW] Navegando para LyraResponseView...");
                
                // Navegar para a view
                ContentFrame.Content = lyraView;
                App.LoggingService?.LogInfo("[MAIN_WINDOW] ContentFrame.Content definido");
                
                // Limpar referência anterior
                if (_currentView != null)
                {
                    _currentView = null;
                }
                
                _currentView = lyraView;
                App.LoggingService?.LogInfo("[MAIN_WINDOW] _currentView atualizado");
                
                // Iniciar processamento da query de forma assíncrona
                // Usar Dispatcher para garantir que a UI seja atualizada corretamente
                App.LoggingService?.LogInfo("[MAIN_WINDOW] Iniciando processamento assíncrono da query...");
                Dispatcher.BeginInvoke(new System.Action(async () =>
                {
                    try
                    {
                        App.LoggingService?.LogInfo($"[MAIN_WINDOW] Processando query: '{query}'");
                        await lyraView.ProcessQueryAsync(query);
                        App.LoggingService?.LogInfo("[MAIN_WINDOW] Query processada com sucesso");
                    }
                    catch (Exception ex)
                    {
                        App.LoggingService?.LogError($"[MAIN_WINDOW] Erro ao processar query na Lyra: {ex.Message}", ex);
                    }
                }), System.Windows.Threading.DispatcherPriority.Normal);
                
                App.LoggingService?.LogInfo("[MAIN_WINDOW] NavigateToLyraView concluído com sucesso");
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[MAIN_WINDOW] EXCEÇÃO em NavigateToLyraView: {ex.Message}", ex);
                MessageBox.Show(
                    $"Erro ao navegar para Lyra: {ex.Message}\n\nStack Trace: {ex.StackTrace}",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error
                );
            }
            finally
            {
                _isNavigating = false;
                App.LoggingService?.LogInfo("[MAIN_WINDOW] _isNavigating resetado para false");
            }
        }

        /// <summary>
        /// Event handler para mudanças de progresso global
        /// </summary>
        private void OnGlobalProgressChanged(object? sender, ProgressEventArgs e)
        {
            UpdateProgress(e.Percentage);
        }

        /// <summary>
        /// Event handler para mudanças de status global
        /// </summary>
        private void OnGlobalStatusChanged(object? sender, string status)
        {
            UpdateStatus(status);
        }

        /// <summary>
        /// Atualiza a barra de progresso (footer apenas)
        /// </summary>
        public void UpdateProgress(int percentage)
        {
            Dispatcher.InvokeAsync(() =>
            {
                if (ProgressBarFill != null)
                {
                    double totalWidth = 0;
                    if (ProgressBarFill.Parent is Border track)
                    {
                        totalWidth = track.ActualWidth;
                    }
                    
                    if (totalWidth <= 0 && ContentFrame != null)
                    {
                        totalWidth = ContentFrame.ActualWidth;
                    }
                    
                    if (totalWidth <= 0)
                    {
                        totalWidth = this.ActualWidth > 300 ? this.ActualWidth - 300 : 500;
                    }

                    if (percentage <= 0)
                    {
                        // Só esconde quando for 0 (limpeza do estado)
                        var anim = new System.Windows.Media.Animation.DoubleAnimation(0, TimeSpan.FromMilliseconds(400));
                        ProgressBarFill.BeginAnimation(WidthProperty, anim);
                        ProgressBarFill.Opacity = 0;
                    }
                    else
                    {
                        // Mostrar e atualizar — inclusive para 100% (conclusão)
                        ProgressBarFill.Opacity = 1;
                        double targetWidth = (totalWidth / 100.0) * Math.Min(percentage, 100);
                        targetWidth = Math.Max(1, Math.Min(targetWidth, totalWidth));
                        
                        var anim = new System.Windows.Media.Animation.DoubleAnimation(targetWidth, TimeSpan.FromMilliseconds(200));
                        ProgressBarFill.BeginAnimation(WidthProperty, anim);
                    }
                }
            });
        }

        /// <summary>
        /// Atualiza o status (footer apenas)
        /// </summary>
        public void UpdateStatus(string message)
        {
            Dispatcher.InvokeAsync(() =>
            {
                _statusTimer?.Stop();

                if (StatusLabel != null)
                {
                    if (string.IsNullOrWhiteSpace(message))
                    {
                        StatusLabel.Text = string.Empty;
                        StatusLabel.Visibility = Visibility.Collapsed;
                    }
                    else
                    {
                        StatusLabel.Text = message;
                        StatusLabel.Visibility = Visibility.Visible;
                        // Timer para limpar o status após 5 segundos (só para mensagens não-conclusão)
                        // Não iniciar se houver uma operação em andamento, para não esconder a mensagem do progresso
                        if (!message.StartsWith("✅") && !GlobalProgressService.Instance.IsOperationRunning)
                        {
                            _statusTimer?.Start();
                        }
                    }
                }
            });
        }

        // ============================================
        // EVENTOS DA BARRA DE TÍTULO MODERNA
        // ============================================

        /// <summary>
        /// Permite arrastar a janela pela barra de título
        /// </summary>
        private void TitleBar_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            if (e.ChangedButton == System.Windows.Input.MouseButton.Left && e.LeftButton == System.Windows.Input.MouseButtonState.Pressed)
            {
                try
                {
                    DragMove();
                }
                catch (InvalidOperationException)
                {
                    // Evitar crash em condições de race condition
                }
            }
        }

        /// <summary>
        /// Minimiza a janela
        /// </summary>
        private void MinimizeButton_Click(object sender, RoutedEventArgs e)
        {
            _userInitiatedMinimize = true;
            WindowState = WindowState.Minimized;
        }

        /// <summary>
        /// Maximiza ou restaura a janela
        /// </summary>
        private void MaximizeButton_Click(object sender, RoutedEventArgs e)
        {
            if (WindowState == WindowState.Maximized)
            {
                WindowState = WindowState.Normal;
                // Manter o ícone com tamanho consistente
                if (MaximizeIcon != null)
                {
                    MaximizeIcon.Data = Geometry.Parse("M4,4 L20,4 L20,20 L4,20 Z");
                }
            }
            else
            {
                WindowState = WindowState.Maximized;
                // Manter o ícone com tamanho consistente
                if (MaximizeIcon != null)
                {
                    MaximizeIcon.Data = Geometry.Parse("M4,4 L12,4 L12,12 L4,12 Z M12,12 L20,12 L20,20 L12,20 Z");
                }
            }
        }

        /// <summary>
        /// Fecha a janela
        /// </summary>
        private void CloseButton_Click(object sender, RoutedEventArgs e)
        {
            if (_settings.Settings.CloseToTray)
            {
                // Minimizar para systray
                WindowState = WindowState.Minimized;
                HideToTray();
            }
            else
            {
                ExitApplication();
            }
        }
        private void SettingsButton_Click(object sender, RoutedEventArgs e)
        {
            if (_isLockedForOnboarding)
            {
                LockModal.Show();
                return;
            }

            // Limpar seleção da sidebar ao ir para configurações para permitir voltar clicando em qualquer botão
            UpdateButtonSelectionSafe(null);
            NavigateToPageSafe("Settings");
        }

        private void ThemeToggleButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var settings = SettingsService.Instance.Settings;
                bool isCurrentlyLight = settings.Theme?.Equals("Light", StringComparison.OrdinalIgnoreCase) == true;
                bool goLight = !isCurrentlyLight;
                settings.Theme = goLight ? "Light" : "Dark";
                SettingsService.Instance.SaveSettings();
                ApplyThemeAndTransparency(settings.Theme, settings.EnableTransparency);
                UpdateThemeToggleIcon(goLight);
                
                // Sincronizar SettingsView se estiver visível
                SyncSettingsViewFromHeader();
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[Header] Erro ao alternar tema", ex);
            }
        }

        private void TransparencyToggleButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var settings = SettingsService.Instance.Settings;
                bool enable = !settings.EnableTransparency;
                settings.EnableTransparency = enable;
                SettingsService.Instance.SaveSettings();
                ApplyThemeAndTransparency(settings.Theme, enable);
                UpdateTransparencyToggleIcon(enable);
                
                // Sincronizar SettingsView se estiver visível
                SyncSettingsViewFromHeader();
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[Header] Erro ao alternar transparência", ex);
            }
        }

        /// <summary>
        /// Aplica tema e transparência na ordem correta:
        /// 1. Transparência (Off/On) — define brushes base
        /// 2. Tema (Dark/Light) — sobrescreve por cima, garantindo que o tema vença
        /// 3. Backdrop DWM
        /// </summary>
        private void ApplyThemeAndTransparency(string? theme, bool transparency)
        {
            var dicts = Application.Current.Resources.MergedDictionaries;

            // Remover todos os dicionários de tema e transparência
            for (int i = dicts.Count - 1; i >= 0; i--)
            {
                var src = dicts[i].Source?.ToString() ?? string.Empty;
                if (src.EndsWith("DarkTheme.xaml",           StringComparison.OrdinalIgnoreCase) ||
                    src.EndsWith("LightTheme.xaml",          StringComparison.OrdinalIgnoreCase) ||
                    src.EndsWith("TransparencyOn.xaml",      StringComparison.OrdinalIgnoreCase) ||
                    src.EndsWith("TransparencyOff.xaml",     StringComparison.OrdinalIgnoreCase) ||
                    src.EndsWith("LightTransparencyOn.xaml", StringComparison.OrdinalIgnoreCase))
                    dicts.RemoveAt(i);
            }

            bool isLight = theme?.Equals("Light", StringComparison.OrdinalIgnoreCase) == true;

            // 1. Tema base — define todas as cores sólidas do tema
            dicts.Add(new ResourceDictionary
            {
                Source = new Uri(isLight ? "/UI/Themes/LightTheme.xaml" : "/UI/Themes/DarkTheme.xaml", UriKind.Relative)
            });

            // 2. Transparência por cima — sobrescreve fundos com versões semi-transparentes
            //    Dark+transparência: TransparencyOn.xaml sobrescreve DarkBrush/DarkPanelBrush etc.
            //    Light+transparência: LightTransparencyOn.xaml sobrescreve com versões claras semi-transparentes
            //    Sem transparência: TransparencyOff.xaml (brushes sólidos, sem efeito)
            if (transparency)
            {
                if (isLight)
                {
                    dicts.Add(new ResourceDictionary
                    {
                        Source = new Uri("/UI/Themes/LightTransparencyOn.xaml", UriKind.Relative)
                    });
                }
                else
                {
                    dicts.Add(new ResourceDictionary
                    {
                        Source = new Uri("/UI/Themes/TransparencyOn.xaml", UriKind.Relative)
                    });
                }
            }
            else
            {
                dicts.Add(new ResourceDictionary
                {
                    Source = new Uri("/UI/Themes/TransparencyOff.xaml", UriKind.Relative)
                });
            }

            // 3. Backdrop DWM — só faz sentido com transparência ativa
            ApplyWindowTransparency(transparency);
        }

        private void UpdateThemeToggleIcon(bool isLight)
        {
            if (ThemeToggleIcon == null) return;
            const string sunPath  = "M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,2L14.39,5.42C13.65,5.15 12.84,5 12,5C11.16,5 10.35,5.15 9.61,5.42L12,2M3.34,7L7.5,6.65C6.9,7.16 6.36,7.78 5.94,8.5C5.5,9.24 5.25,10 5.11,10.79L3.34,7M3.36,17L5.12,13.23C5.26,14 5.53,14.78 5.95,15.5C6.37,16.24 6.91,16.86 7.5,17.37L3.36,17M20.65,7L18.88,10.79C18.74,10 18.47,9.23 18.05,8.5C17.63,7.78 17.1,7.15 16.5,6.64L20.65,7M20.64,17L16.5,17.36C17.09,16.85 17.62,16.22 18.04,15.5C18.46,14.77 18.73,14 18.87,13.21L20.64,17M12,22L9.59,18.56C10.33,18.83 11.14,19 12,19C12.82,19 13.63,18.83 14.37,18.56L12,22Z";
            const string moonPath = "M17.75,4.09L15.22,6.03L16.13,9.09L13.5,7.28L10.87,9.09L11.78,6.03L9.25,4.09L12.44,4L13.5,1L14.56,4L17.75,4.09M21.25,11L19.61,12.25L20.2,14.23L18.5,13.06L16.8,14.23L17.39,12.25L15.75,11L17.81,10.95L18.5,9L19.19,10.95L21.25,11M18.97,15.95C19.8,15.87 20.69,17.05 20.16,17.8C19.84,18.25 19.5,18.67 19.08,19.07C15.17,23 8.84,23 4.94,19.07C1.03,15.17 1.03,8.83 4.94,4.93C5.34,4.53 5.76,4.17 6.21,3.85C6.96,3.32 8.14,4.21 8.06,5.04C7.79,7.9 8.75,10.87 10.95,13.06C13.14,15.26 16.1,16.22 18.97,15.95Z";

            ThemeToggleIcon.Data = System.Windows.Media.Geometry.Parse(isLight ? sunPath : moonPath);
            ThemeToggleIcon.Fill = isLight
                ? new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0xF5, 0x9E, 0x0B))
                : new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x94, 0xA3, 0xB8));
            ThemeToggleButton.ToolTip = isLight ? "Mudar para Tema Escuro" : "Mudar para Tema Claro";
        }

        private void UpdateTransparencyToggleIcon(bool enabled)
        {
            if (TransparencyToggleIcon == null) return;
            const string onPath  = "M12,3C7.05,3 3,7.05 3,12C3,16.95 7.05,21 12,21C16.95,21 21,16.95 21,12C21,7.05 16.95,3 12,3M12,5C15.87,5 19,8.13 19,12C19,15.87 15.87,19 12,19V5Z";
            const string offPath = "M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4Z";

            TransparencyToggleIcon.Data = System.Windows.Media.Geometry.Parse(enabled ? onPath : offPath);
            TransparencyToggleIcon.Fill = enabled
                ? new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x31, 0xA8, 0xFF))
                : new System.Windows.Media.SolidColorBrush(System.Windows.Media.Color.FromRgb(0x94, 0xA3, 0xB8));
            TransparencyToggleButton.ToolTip = enabled ? "Desativar Transparência" : "Ativar Transparência";
        }

        /// <summary>
        /// Chamado pela SettingsView para sincronizar os ícones do header
        /// quando tema ou transparência são alterados pela página de configurações.
        /// </summary>
        public void SyncHeaderToggleIcons(bool isLight, bool transparencyEnabled)
        {
            try
            {
                Dispatcher.BeginInvoke(() =>
                {
                    UpdateThemeToggleIcon(isLight);
                    UpdateTransparencyToggleIcon(transparencyEnabled);
                });
            }
            catch { }
        }

        /// <summary>
        /// Sincroniza a SettingsView (se estiver visível no ContentFrame)
        /// quando tema ou transparência são alterados pelos botões do header.
        /// </summary>
        private void SyncSettingsViewFromHeader()
        {
            try
            {
                if (ContentFrame?.Content is VoltrisOptimizer.UI.Views.SettingsView settingsView)
                {
                    settingsView.SyncFromSettings();
                }
            }
            catch { }
        }
        
        /// <summary>
        /// Abre a página de login no site para vincular a conta
        /// </summary>
        private void LoginWebButton_Click(object sender, RoutedEventArgs e)
        {
            if (_isLockedForOnboarding)
            {
                LockModal.Show();
                return;
            }

            try
            {
                var settings = SettingsService.Instance.Settings;
                bool isLinked = settings.IsDeviceLinked && !string.IsNullOrEmpty(settings.LinkedUserEmail);
                
                if (isLinked)
                {
                    // Conta já vinculada - abrir dashboard
                    App.LoggingService?.LogInfo("[ENTERPRISE] Conta vinculada - abrindo dashboard");
                    
                    var url = "https://voltris.com.br/dashboard";
                    System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
                    {
                        FileName = url,
                        UseShellExecute = true
                    });
                }
                else
                {
                    // Conta não vinculada - abrir Welcome Window
                    App.LoggingService?.LogInfo("[ENTERPRISE] Conta não vinculada - abrindo Welcome Window");
                    
                    var welcomeWindow = new WelcomeLinkWindow();
                    welcomeWindow.Owner = this;
                    welcomeWindow.WindowStartupLocation = WindowStartupLocation.CenterOwner;
                    welcomeWindow.ShowDialog();
                    
                    // Atualizar status após fechar o Welcome
                    _ = UpdateLinkingStatusAsync();
                }
                
                App.LoggingService?.LogInfo($"[ENTERPRISE] Ação concluída");
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("Erro ao processar ação de vinculação", ex);
                MessageBox.Show("Erro ao processar a ação.", "Erro", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
        
        protected override void OnStateChanged(EventArgs e)
        {
            base.OnStateChanged(e);
            
            LogToFile($"OnStateChanged: WindowState={WindowState}, _isWindowFullyLoaded={_isWindowFullyLoaded}, _userInitiatedMinimize={_userInitiatedMinimize}");
            
            if (WindowState == WindowState.Minimized && _settings.Settings.MinimizeToTray && _isWindowFullyLoaded)
            {
                // Só vai para o tray se o usuário clicou no botão minimizar do app
                // Win+D, Win+M ou minimização pelo sistema NÃO devem ir para o tray
                if (_userInitiatedMinimize)
                {
                    LogToFile("OnStateChanged: Escondendo para tray (usuário minimizou manualmente)");
                    _userInitiatedMinimize = false;
                    HideToTray();
                }
                else
                {
                    LogToFile("OnStateChanged: Minimização externa (Win+D/sistema) — mantendo na barra de tarefas");
                    _userInitiatedMinimize = false;
                }
            }
            else if (WindowState == WindowState.Minimized && !_isWindowFullyLoaded)
            {
                LogToFile("WARNING: Janela foi minimizada antes de estar totalmente carregada - RESTAURANDO");
                WindowState = WindowState.Normal;
                ShowInTaskbar = true;
                Visibility = Visibility.Visible;
                Show();
                Activate();
            }
            else
            {
                _userInitiatedMinimize = false;
            }
        }
        
        private bool _userInitiatedMinimize = false;
        
        private bool _isWindowFullyLoaded = false;
        
        private void CheckOnboarding()
        {
            // BYPASS: Marcar sempre como concluído — app abre direto no Dashboard.
            try
            {
                var onboardingService = new OnboardingService();
                if (!onboardingService.HasCompletedOnboarding())
                {
                    onboardingService.MarkOnboardingComplete();
                    LogToFile("CheckOnboarding: marcado como concluído (bypass).");
                }
            }
            catch { }
        }
        
        /// <summary>
        /// Desabilita visualmente o sidebar durante o onboarding mas mantém cliques para o modal
        /// </summary>
        public void DisableSidebarCompletely()
        {
            _isLockedForOnboarding = true;
            var buttons = new[] { NavDashboard, NavCleanup, NavPerformance, NavNetwork, NavSystem, NavGamer, NavDiagnostics, NavHistory, NavScheduler, NavLogs, NavProfessionalServices, NavEnergy, NavShield, NavRepair, NavPersonalize, NavDisplay, NavSecurity, NavPrivacy, NavDebloat, NavDeviceInfo, NavBenchmark };
            foreach (var btn in buttons.Where(b => b != null))
            {
                // Não desabilite IsEnabled, senão o clique não chega no handler
                btn.IsEnabled = true; 
                btn.Opacity = 0.5; 
            }
            
            // Visual do header também
            if (SettingsButton != null) SettingsButton.Opacity = 0.5;
            if (LoginWebButton != null) LoginWebButton.Opacity = 0.5;
            if (ActivateLicenseHeaderButton != null) ActivateLicenseHeaderButton.Opacity = 0.5;
        }

        private void SetupKeyboardShortcuts()
        {
            // Atalhos serão tratados no Window_KeyDown
        }

        private void Window_KeyDown(object sender, System.Windows.Input.KeyEventArgs e)
        {
            if (_isLockedForOnboarding && e.KeyboardDevice.Modifiers == System.Windows.Input.ModifierKeys.Control)
            {
                // Permitir Logs e Settings talvez? Não, o usuário disse "acessar o Sidebar e configurações no geral".
                // Deixa bloqueado tudo que for Ctrl + Número
                if (e.Key >= System.Windows.Input.Key.D1 && e.Key <= System.Windows.Input.Key.D9)
                {
                    LockModal.Show();
                    e.Handled = true;
                    return;
                }
            }

            // Ctrl + número para navegação rápida
            if (e.KeyboardDevice.Modifiers == System.Windows.Input.ModifierKeys.Control)
            {
                switch (e.Key)
                {
                    case System.Windows.Input.Key.D1:
                        NavigateToPageSafe("Dashboard");
                        e.Handled = true;
                        break;
                    case System.Windows.Input.Key.D2:
                        NavigateToPageSafe("Cleanup");
                        e.Handled = true;
                        break;
                    case System.Windows.Input.Key.D3:
                        NavigateToPageSafe("Performance");
                        e.Handled = true;
                        break;
                    case System.Windows.Input.Key.D4:
                        NavigateToPageSafe("Network");
                        e.Handled = true;
                        break;
                    case System.Windows.Input.Key.D5:
                        NavigateToPageSafe("System");
                        e.Handled = true;
                        break;
                    case System.Windows.Input.Key.D6:
                        NavigateToPageSafe("Gamer");
                        e.Handled = true;
                        break;
                    case System.Windows.Input.Key.D7:
                        NavigateToPageSafe("History");
                        e.Handled = true;
                        break;
                    case System.Windows.Input.Key.D8:
                        NavigateToPageSafe("Logs");
                        e.Handled = true;
                        break;
                    case System.Windows.Input.Key.D9:
                        NavigateToPageSafe("Settings");
                        e.Handled = true;
                        break;
                }
            }
            
            // F5 para atualizar/refresh
            if (e.Key == System.Windows.Input.Key.F5)
            {
                if (_currentView is HistoryView historyView)
                {
                    var refreshMethod = historyView.GetType().GetMethod("RefreshButton_Click", 
                        System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
                    refreshMethod?.Invoke(historyView, new object[] { historyView, new RoutedEventArgs() });
                }
                e.Handled = true;
            }
        }

        
        
        private T? FindVisualChild<T>(DependencyObject parent) where T : DependencyObject
        {
            for (int i = 0; i < System.Windows.Media.VisualTreeHelper.GetChildrenCount(parent); i++)
            {
                var child = System.Windows.Media.VisualTreeHelper.GetChild(parent, i);
                if (child is T t)
                    return t;
                var childOfChild = FindVisualChild<T>(child);
                if (childOfChild != null)
                    return childOfChild;
            }
            return null;
        }
        
        private void UpdateVersionInfo()
        {
            try
            {
                // Versão forçada conforme solicitado para v1.0.0.9
                string versionString = "v1.0.0.9";
                
                if (VersionText != null)
                {
                    VersionText.Text = versionString;
                }
                
                if (SidebarVersionText != null)
                {
                    SidebarVersionText.Text = versionString;
                }
            }
            catch (Exception ex)
            {
                LogToFile($"Erro ao atualizar versão: {ex.Message}");
            }
        }

        protected override void OnClosing(System.ComponentModel.CancelEventArgs e)
        {
            if (!_isClosing && _settings.Settings.CloseToTray)
            {
                e.Cancel = true;
                WindowState = WindowState.Minimized;
                HideToTray();
            }
            else
            {
                // Gamer Mode já é desativado pelo ExitApplication() — não duplicar aqui
                _notifyIcon?.Dispose();
                HideModernTooltip();
            }
            
            base.OnClosing(e);
        }

        /// <summary>
        /// Handler para o botão Shield no header
        /// </summary>
        private void ShieldHeaderButton_Click(object sender, RoutedEventArgs e)
        {
            if (_isLockedForOnboarding)
            {
                LockModal.Show();
                return;
            }

            try
            {
                NavigateToPageSafe("Shield");
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[MAIN_WINDOW] Erro ao navegar para Shield", ex);
            }
        }

        /// <summary>
        /// Handler para o botão de ativação de licença no header
        /// </summary>
        private void ActivateLicenseHeaderButton_Click(object sender, RoutedEventArgs e)
        {
            if (_isLockedForOnboarding)
            {
                LockModal.Show();
                return;
            }

            try
            {
                var licenseManager = VoltrisOptimizer.Services.LicenseManager.Instance;
                
                // Se já é PRO, mostrar informações da licença em vez de pedir ativação
                if (VoltrisOptimizer.Services.LicenseManager.IsPro)
                {
                    var licenseKey = licenseManager.GetCurrentLicenseKey();
                    var parts = licenseKey?.Split('-');
                    string plan = "Profissional";
                    string expiry = "Vitalícia / Permanente";
                    
                    if (parts?.Length >= 4)
                    {
                        plan = parts[1].ToUpper() switch {
                            "STA" => "Standard (Base)",
                            "PRO" => "Pro (Avançado)",
                            "ENT" => "Enterprise (Empresarial)",
                            "TRI" => "Trial (Teste)",
                            "LIC" => "Mensal",
                            _ => "Profissional"
                        };
                        
                        if (DateTime.TryParseExact(parts[3], "yyyyMMdd", null, System.Globalization.DateTimeStyles.None, out var expiryDate))
                        {
                            expiry = expiryDate.ToString("dd/MM/yyyy");
                        }
                    }

                    // Licença já está ativa - mostrar interface enterprise de gerenciamento
                    var managementWindow = new Window
                    {
                        Title = "Gerenciamento de Licença - VOLTris Optimizer",
                        Content = new VoltrisOptimizer.UI.Views.LicenseManagementView(),
                        Width = 900,
                        Height = 620,
                        WindowStartupLocation = WindowStartupLocation.CenterScreen,
                        ResizeMode = ResizeMode.NoResize,
                        Owner = this,
                        WindowStyle = WindowStyle.None,
                        AllowsTransparency = true,
                        Background = System.Windows.Media.Brushes.Transparent
                    };

                    managementWindow.SourceInitialized += (s, args) => 
                    {
                         VoltrisOptimizer.UI.Helpers.WindowRoundedCornersHelper.ApplyRoundedCorners((Window)s, 16);
                    };
                    
                    managementWindow.ShowDialog();
                    return;
                }

                var trialDaysRemaining = licenseManager.GetTrialDaysRemaining();
                var isTrialExpired = licenseManager.IsTrialExpired();
                
                var licenseWindow = new LicenseActivationView(isTrialExpired, trialDaysRemaining);
                licenseWindow.Owner = this;
                
                var result = licenseWindow.ShowDialog();
                
                if (result == true && licenseWindow.ActivationSucceeded)
                {
                    // Licença ativada com sucesso
                    ModernMessageBox.Show(
                        "Licença ativada com sucesso!\n\nObrigado por escolher o Voltris Optimizer.",
                        "Sucesso",
                        MessageBoxButton.OK,
                        MessageBoxImage.Information,
                        this);
                }
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("Erro ao abrir janela de ativação de licença", ex);
                ModernMessageBox.Show(
                    $"Erro ao abrir a janela de ativação de licença:\n\n{ex.Message}",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error,
                    this);
            }
        }
        
        /// <summary>
        /// Inicializa a integração com o Modo Gamer para atualizar o status na sidebar
        /// </summary>
        private void InitializeGamerModeIntegration()
        {
            try
            {
                LogToFile("[GamerMode] Iniciando integração com Modo Gamer...");
                
                // Obter serviços do DI container
                var serviceProvider = App.Services;
                if (serviceProvider != null)
                {
                    // Obter GamerViewModel
                    _gamerViewModel = serviceProvider.GetService(typeof(GamerViewModel)) as GamerViewModel;
                    if (_gamerViewModel != null)
                    {
                        LogToFile("[GamerMode] GamerViewModel obtido com sucesso");
                        
                        // Subscrever ao evento de mudança de propriedade IsGamerModeActive
                        _gamerViewModel.PropertyChanged += OnGamerViewModelPropertyChanged;
                        
                        // Atualizar status inicial
                        UpdateGamerModeStatus(_gamerViewModel.IsGamerModeActive);
                    }
                    else
                    {
                        LogToFile("[GamerMode] ⚠️ GamerViewModel não encontrado no container de serviços");
                    }
                    
                    // Obter GamerModeOrchestrator
                    _gamerOrchestrator = serviceProvider.GetService(typeof(IGamerModeOrchestrator)) as IGamerModeOrchestrator;
                    if (_gamerOrchestrator != null)
                    {
                        LogToFile("[GamerMode] GamerModeOrchestrator obtido com sucesso");
                        
                        // Subscrever ao evento StatusChanged
                        _gamerOrchestrator.StatusChanged += OnGamerOrchestratorStatusChanged;
                    }
                    else
                    {
                        LogToFile("[GamerMode] ⚠️ GamerModeOrchestrator não encontrado no container de serviços");
                    }
                }
                else
                {
                    LogToFile("[GamerMode] ⚠️ ServiceProvider não disponível");
                }
            }
            catch (Exception ex)
            {
                LogToFile($"[GamerMode] ❌ Erro ao inicializar integração: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Handler para eventos de mudança de propriedades no GamerViewModel
        /// </summary>
        private void OnGamerViewModelPropertyChanged(object? sender, System.ComponentModel.PropertyChangedEventArgs e)
        {
            if (e.PropertyName == nameof(GamerViewModel.IsGamerModeActive))
            {
                Dispatcher.BeginInvoke(() =>
                {
                    if (_gamerViewModel != null)
                    {
                        UpdateGamerModeStatus(_gamerViewModel.IsGamerModeActive);
                    }
                });
            }
        }
        
        /// <summary>
        /// Handler para eventos StatusChanged do GamerModeOrchestrator
        /// </summary>
        private void OnGamerOrchestratorStatusChanged(object? sender, VoltrisOptimizer.Services.Gamer.Models.GamerModeStatus status)
        {
            Dispatcher.BeginInvoke(() =>
            {
                UpdateGamerModeStatus(status.IsActive);
            });
        }
        
        /// <summary>
        /// Atualiza o status do modo gamer na sidebar com cores apropriadas
        /// </summary>
        private void UpdateGamerModeStatus(bool isActive)
        {
            try
            {
                // Status visual removido do shell global para manter design limpo
                // O status do Modo Gamer agora reside apenas na Dashboard e na View Gamer
                LogToFile($"[GamerMode] Status atualizado internamente - Ativo: {isActive}");
            }
            catch (Exception ex)
            {
                LogToFile($"[GamerMode] ❌ Erro ao atualizar status: {ex.Message}");
            }
        }
        
        /// <summary>
        /// CORREÇÃO CRÍTICA: Limpeza de recursos ao fechar a janela
        /// </summary>
        protected override void OnClosed(EventArgs e)
        {
            try
            {
                // Remover event handlers do GlobalProgressService
                GlobalProgressService.Instance.ProgressChanged -= OnGlobalProgressChanged;
                GlobalProgressService.Instance.StatusChanged -= OnGlobalStatusChanged;
                
                // Limpar cache de views e chamar Dispose em cada uma
                foreach (var view in _viewCache.Values)
                {
                    if (view is IDisposable disposable)
                    {
                        try { disposable.Dispose(); } catch { }
                    }
                }
                _viewCache.Clear();
                
                // Limpar NotifyIcon
                if (_notifyIcon != null)
                {
                    _notifyIcon.Visible = false;
                    _notifyIcon.Dispose();
                    _notifyIcon = null;
                }
                
                // Parar timer de status
                _statusTimer?.Stop();
                
                LogToFile("[MainWindow] Recursos limpos com sucesso");
            }
            catch (Exception ex)
            {
                LogToFile($"[MainWindow] Erro ao limpar recursos: {ex.Message}");
            }
            base.OnClosed(e);
        }
        
        
        // ── WM_GETMINMAXINFO structs ─────────────────────────────────────────────
        [StructLayout(LayoutKind.Sequential)]
        private struct POINT { public int x, y; }

        [StructLayout(LayoutKind.Sequential)]
        private struct MINMAXINFO
        {
            public POINT ptReserved;
            public POINT ptMaxSize;
            public POINT ptMaxPosition;
            public POINT ptMinTrackSize;
            public POINT ptMaxTrackSize;
        }

        [DllImport("user32.dll", SetLastError = true)]
        private static extern IntPtr MonitorFromWindow(IntPtr hwnd, uint dwFlags);

        [StructLayout(LayoutKind.Sequential)]
        private struct MONITORINFO
        {
            public int cbSize;
            public RECT rcMonitor;
            public RECT rcWork;
            public uint dwFlags;
        }

        [DllImport("user32.dll")]
        private static extern bool GetMonitorInfo(IntPtr hMonitor, ref MONITORINFO lpmi);

        private const uint MONITOR_DEFAULTTONEAREST = 0x00000002;

        // ─────────────────────────────────────────────────────────────────────────
        private IntPtr WndProc(IntPtr hwnd, int msg, IntPtr wParam, IntPtr lParam, ref bool handled)
        {
            const int WM_GETMINMAXINFO = 0x0024;
            const int WM_COPYDATA      = 0x004A;
            const int WM_NCHITTEST     = 0x0084;

            // ── Corrige maximização para respeitar a taskbar (WorkArea) ──────────────
            if (msg == WM_GETMINMAXINFO)
            {
                var mmi = Marshal.PtrToStructure<MINMAXINFO>(lParam);

                // Obter o monitor onde a janela está (suporte a múltiplos monitores)
                IntPtr monitor = MonitorFromWindow(hwnd, MONITOR_DEFAULTTONEAREST);
                if (monitor != IntPtr.Zero)
                {
                    var info = new MONITORINFO { cbSize = Marshal.SizeOf<MONITORINFO>() };
                    if (GetMonitorInfo(monitor, ref info))
                    {
                        // rcWork = área de trabalho (exclui taskbar)
                        // ptMaxPosition é relativo ao canto superior esquerdo do MONITOR (não da tela virtual)
                        mmi.ptMaxPosition.x = info.rcWork.Left - info.rcMonitor.Left;
                        mmi.ptMaxPosition.y = info.rcWork.Top  - info.rcMonitor.Top;
                        mmi.ptMaxSize.x     = info.rcWork.Right  - info.rcWork.Left;
                        mmi.ptMaxSize.y     = info.rcWork.Bottom - info.rcWork.Top;
                        // Limites mínimos de redimensionamento
                        mmi.ptMinTrackSize.x = (int)MinWidth;
                        mmi.ptMinTrackSize.y = (int)MinHeight;
                    }
                }

                Marshal.StructureToPtr(mmi, lParam, true);
                handled = true;
                return IntPtr.Zero;
            }

            // ── Resize por bordas (WindowStyle=None + AllowsTransparency) ──────────────
            if (msg == WM_NCHITTEST)
            {
                // Só processar se a janela não estiver maximizada
                if (WindowState != WindowState.Maximized)
                {
                    const int HTCLIENT      = 1;
                    const int HTLEFT        = 10;
                    const int HTRIGHT       = 11;
                    const int HTTOP         = 12;
                    const int HTTOPLEFT     = 13;
                    const int HTTOPRIGHT    = 14;
                    const int HTBOTTOM      = 15;
                    const int HTBOTTOMLEFT  = 16;
                    const int HTBOTTOMRIGHT = 17;

                    // Posição do cursor em coordenadas de tela
                    int x = unchecked((short)(lParam.ToInt64() & 0xFFFF));
                    int y = unchecked((short)((lParam.ToInt64() >> 16) & 0xFFFF));

                    // Converter para coordenadas da janela
                    var dpi    = GetSystemDpiScale();
                    var origin = PointToScreen(new System.Windows.Point(0, 0));
                    double relX = (x - origin.X) / dpi;
                    double relY = (y - origin.Y) / dpi;
                    double w    = ActualWidth;
                    double h    = ActualHeight;

                    const double grip = 4; // largura da zona de resize em DIPs — 4px para não conflitar com scrollbar de 8px nas páginas

                    bool left   = relX <= grip;
                    bool right  = relX >= w - grip;
                    bool top    = relY <= grip;
                    bool bottom = relY >= h - grip;

                    int hit = HTCLIENT;
                    if      (top    && left)  hit = HTTOPLEFT;
                    else if (top    && right) hit = HTTOPRIGHT;
                    else if (bottom && left)  hit = HTBOTTOMLEFT;
                    else if (bottom && right) hit = HTBOTTOMRIGHT;
                    else if (top)             hit = HTTOP;
                    else if (bottom)          hit = HTBOTTOM;
                    else if (left)            hit = HTLEFT;
                    else if (right)           hit = HTRIGHT;

                    if (hit != HTCLIENT)
                    {
                        handled = true;
                        return new IntPtr(hit);
                    }
                }
            }

            if (msg == WM_COPYDATA)
            {
                try
                {
                    COPYDATASTRUCT cds = Marshal.PtrToStructure<COPYDATASTRUCT>(lParam);
                    if (cds.cbData > 0 && cds.lpData != IntPtr.Zero)
                    {
                        string command = Marshal.PtrToStringUni(cds.lpData, cds.cbData / 2);
                        LogToFile($"[MainWindow] Comando recebido via WM_COPYDATA: {command}");
                        App.ContextMenuDebugLog($"[WNDPROC] WM_COPYDATA recebido: '{command}'");
                        
                        // Processar comando em background para não bloquear WndProc
                        Dispatcher.InvokeAsync(async () =>
                        {
                            if (Application.Current is App app)
                            {
                                string[] args = command.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
                                App.ContextMenuDebugLog($"[WNDPROC] Chamando HandleCommandLineArgsAsync com {args.Length} args: {string.Join("|", args)}");
                                await app.HandleCommandLineArgsAsync(args);
                            }
                            
                            // Trazer para frente se necessário
                            if (WindowState == WindowState.Minimized)
                                WindowState = WindowState.Normal;
                            
                            Show();
                            Activate();
                            Topmost = true;
                            Topmost = false;
                        });
                        
                        handled = true;
                        return new IntPtr(1);
                    }
                }
                catch (Exception ex)
                {
                    LogToFile($"[MainWindow] Erro ao processar WM_COPYDATA: {ex.Message}");
                }
            }
            return IntPtr.Zero;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct COPYDATASTRUCT
        {
            public IntPtr dwData;
            public int cbData;
            public IntPtr lpData;
        }
    }
}
