using System;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Interop;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using VoltrisOptimizer.UI.Views;
using VoltrisOptimizer.UI.Controls;
using VoltrisOptimizer.UI.Windows;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.UI.Helpers;
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
        private bool _isUpdatingSelection = false; // Flag para prevenir loops recursivos
        
        // Recursos estáticos para evitar criação excessiva
        private static SolidColorBrush? _primaryBrush;
        private static SolidColorBrush? _secondaryTextBrush;
        
        // Serviços
        private readonly LocalizationService _localization;
        private readonly SettingsService _settings;
        private WinForms.NotifyIcon? _notifyIcon;
        private bool _isClosing = false;
        private IntPtr _hwnd;
        private HwndSource? _dummySource;
        

        public MainWindow()
        {
            // LOG CRÍTICO: Início do construtor
            LogToFile("===== MAINWINDOW CONSTRUTOR INICIADO =====");
            
            InitializeComponent();
            
            // LOG: Após InitializeComponent
            LogToFile("InitializeComponent() concluído");
            
            // Inicializar serviços
            _localization = LocalizationService.Instance;
            _settings = SettingsService.Instance;
            
            LogToFile($"Serviços inicializados - StartMinimized: {_settings.Settings.StartMinimized}, StartWithWindows: {_settings.Settings.StartWithWindows}");
            
            // Conectar ao serviço global de progresso
            GlobalProgressService.Instance.ProgressChanged += OnGlobalProgressChanged;
            GlobalProgressService.Instance.StatusChanged += OnGlobalStatusChanged;
            
            // Carregar idioma salvo
            _localization.SetLanguage(_settings.Settings.Language);
            
            // Carregar recursos estáticos uma única vez
            _primaryBrush = (SolidColorBrush)Application.Current.Resources["PrimaryBrush"];
            _secondaryTextBrush = (SolidColorBrush)Application.Current.Resources["TextSecondaryBrush"];
            
            // Verificar argumentos de linha de comando
            var args = Environment.GetCommandLineArgs();
            var startMinimized = args.Any(arg => arg.Equals("/minimized", StringComparison.OrdinalIgnoreCase) || 
                                                 arg.Equals("-minimized", StringComparison.OrdinalIgnoreCase));
            
            // Logar inicialização IMEDIATAMENTE
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
                    
                // Também logar no arquivo imediato
                var immediateLog = System.IO.Path.Combine(logDir, "immediate_startup.log");
                System.IO.File.AppendAllText(immediateLog, 
                    $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] MainWindow construído\n\n");
            }
            catch { }
            
            LogToFile("Iniciando InitializeNotifyIcon()...");
            InitializeNotifyIcon();
            LogToFile("InitializeNotifyIcon() concluído");
            
            InitializeNavigation();
            UpdateLocalizedTexts();
            
            // Inicializar evento de mudança de idioma
            _localization.LanguageChanged += (s, e) => UpdateLocalizedTexts();
            
            // Configurar atalhos de teclado
            SetupKeyboardShortcuts();
            
            // Verificar se precisa mostrar onboarding
            CheckOnboarding();
            
            // Atualizar versão
            UpdateVersionInfo();

            
            
            
            // CORREÇÃO RADICAL: A JANELA SEMPRE DEVE APARECER
            // Remover TODA lógica de minimizar no startup
            // A janela será SEMPRE exibida primeiro, independente de qualquer configuração
            
            Loaded += (s, e) =>
            {
                LogToFile("===== EVENTO LOADED (FORÇAR EXIBIÇÃO) =====\n" +
                         $"  WindowState ANTES: {WindowState}\n" +
                         $"  ShowInTaskbar ANTES: {ShowInTaskbar}\n" +
                         $"  Visibility ANTES: {Visibility}\n" +
                         $"  startMinimized: {startMinimized}\n");
                
                // FORÇAR exibição - SEMPRE, SEM EXCEÇÕES
                LogToFile("FORÇANDO WindowState = Normal");
                WindowState = WindowState.Normal;
                
                LogToFile("FORÇANDO ShowInTaskbar = true");
                ShowInTaskbar = true;
                
                LogToFile("FORÇANDO Visibility = Visible");
                Visibility = Visibility.Visible;
                
                LogToFile("FORÇANDO Topmost = false");
                Topmost = false;
                
                LogToFile("Chamando Show()");
                Show();
                
                LogToFile("Chamando Activate()");
                Activate();
                
                LogToFile("Chamando Focus()");
                Focus();
                
                LogToFile("Chamando BringIntoView()");
                BringIntoView();
                
                // Marcar que a janela foi totalmente carregada
                _isWindowFullyLoaded = true;
                LogToFile("_isWindowFullyLoaded = true");
                
                // Forçar a janela para frente usando Win32 API
                try
                {
                    LogToFile("Obtendo handle Win32...");
                    if (_hwnd == IntPtr.Zero) 
                    {
                        _hwnd = new WindowInteropHelper(this).Handle;
                        LogToFile($"Handle obtido: {_hwnd}");
                    }
                    
                    if (_hwnd != IntPtr.Zero)
                    {
                        LogToFile("Chamando Win32 APIs...");
                        Win32WindowHelper.ShowWindowAsync(_hwnd, Win32WindowHelper.SW_SHOW);
                        System.Threading.Thread.Sleep(10);
                        Win32WindowHelper.SetForegroundWindow(_hwnd);
                        System.Threading.Thread.Sleep(10);
                        Win32WindowHelper.BringWindowToTop(_hwnd);
                        LogToFile("Win32 APIs executadas");
                    }
                    else
                    {
                        LogToFile("ERRO: Handle é zero!");
                    }
                }
                catch (Exception ex)
                {
                    LogToFile($"ERRO Win32: {ex.Message}\n{ex.StackTrace}");
                }
                
                LogToFile($"===== EVENTO LOADED FINALIZADO =====\n" +
                         $"  WindowState DEPOIS: {WindowState}\n" +
                         $"  ShowInTaskbar DEPOIS: {ShowInTaskbar}\n" +
                         $"  Visibility DEPOIS: {Visibility}\n" +
                         $"  _isWindowFullyLoaded: {_isWindowFullyLoaded}\n");
            };
            _gateLocked = App.SystemProfiler != null && App.SystemProfiler.RequireGate;
            Loaded += MainWindow_Loaded_Gate;
            
            // LOG CRÍTICO: Fim do construtor
            LogToFile($"===== MAINWINDOW CONSTRUTOR FINALIZADO =====\n" +
                     $"  WindowState: {WindowState}\n" +
                     $"  ShowInTaskbar: {ShowInTaskbar}\n" +
                     $"  Visibility: {Visibility}\n" +
                     $"  IsLoaded: {IsLoaded}\n");
        }
        
        private void LogToFile(string message)
        {
            try
            {
                var logDir = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                if (!System.IO.Directory.Exists(logDir))
                    System.IO.Directory.CreateDirectory(logDir);
                var logFile = System.IO.Path.Combine(logDir, "window_debug.log");
                System.IO.File.AppendAllText(logFile, 
                    $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] {message}\n");
            }
            catch { }
        }

        private void MainWindow_Loaded_Gate(object sender, RoutedEventArgs e)
        {
            LogToFile("===== MainWindow_Loaded_Gate INICIADO =====");
            
            // CRÍTICO: Garantir que a janela esteja visível ANTES de qualquer outra coisa
            if (WindowState == WindowState.Minimized)
            {
                LogToFile("WARNING: Janela está minimizada no MainWindow_Loaded_Gate - restaurando...");
                WindowState = WindowState.Normal;
            }
            
            if (Visibility != Visibility.Visible)
            {
                LogToFile("WARNING: Janela não está visível no MainWindow_Loaded_Gate - mostrando...");
                Visibility = Visibility.Visible;
                Show();
            }
            
            if (!ShowInTaskbar)
            {
                LogToFile("WARNING: ShowInTaskbar está false no MainWindow_Loaded_Gate - corrigindo...");
                ShowInTaskbar = true;
            }
            
            // Verificar se o onboarding foi completado
            var onboardingService = new OnboardingService();
            var onboardingCompleted = onboardingService.HasCompletedOnboarding();
            
            LogToFile($"Onboarding completado: {onboardingCompleted}");
            
            // Se o onboarding NÃO foi completado, bloquear TUDO
            if (!onboardingCompleted)
            {
                _gateLocked = true;
                DisableSidebarCompletely();
                LogToFile("Onboarding não completado - sidebar bloqueado");
                return;
            }
            
            // Onboarding já foi completado - verificar se precisa mostrar o gate do SystemProfiler
            if (App.SystemProfiler != null && App.SystemProfiler.RequireGate)
            {
                try
                {
                    // Evitar sobrescrever se já estamos mostrando algo do onboarding
                    if (ContentFrame?.Content is VoltrisOptimizer.UI.Views.OnboardingView)
                        return;
                    if (ContentFrame?.Content is VoltrisOptimizer.Core.SystemIntelligenceProfiler.UI.Views.ProfilerQuestionnaireView)
                        return;
                    if (ContentFrame?.Content is VoltrisOptimizer.Core.SystemIntelligenceProfiler.UI.Views.ProfilerSummaryView)
                        return;

                    var view = new VoltrisOptimizer.Core.SystemIntelligenceProfiler.UI.Views.ProfilerQuestionnaireView();
                    if (ContentFrame != null)
                    {
                        ContentFrame.Content = view;
                    }
                    
                    // Bloquear sidebar durante o gate
                    DisableSidebarCompletely();
                    LogToFile("SystemProfiler gate ativado");
                }
                catch (Exception ex)
                {
                    LogToFile($"ERRO no SystemProfiler gate: {ex.Message}");
                }
            }
            
            LogToFile("===== MainWindow_Loaded_Gate FINALIZADO =====");
        }

        public void UnlockGate()
        {
            _gateLocked = false;
            EnableSidebar();
        }
        
        /// <summary>
        /// Habilita todos os botões da sidebar (após completar onboarding)
        /// </summary>
        public void EnableSidebar()
        {
            var buttons = new[] { NavDashboard, NavCleanup, NavPerformance, NavNetwork, NavSystem, NavGamer, NavDiagnostics, NavHistory, NavScheduler, NavLogs };
            foreach (var btn in buttons.Where(b => b != null))
            {
                btn.IsEnabled = true;
                btn.Opacity = 1.0; // Restaurar opacidade normal
            }
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
            
            // Também gravar em arquivo para debug
            try
            {
                var logFile = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs", "voice_debug.log");
                System.IO.File.AppendAllText(logFile, $"[{DateTime.Now:HH:mm:ss}] {message}\n");
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
        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            LogToFile("===== Window_Loaded (XAML) INICIADO =====");
            LogToFile($"  WindowState: {WindowState}");
            LogToFile($"  ShowInTaskbar: {ShowInTaskbar}");
            LogToFile($"  Visibility: {Visibility}");
            
            // CRÍTICO: Garantir visibilidade
            if (WindowState == WindowState.Minimized)
            {
                LogToFile("CORREÇÃO: WindowState estava Minimized - corrigindo para Normal");
                WindowState = WindowState.Normal;
            }
            
            if (Visibility != Visibility.Visible)
            {
                LogToFile("CORREÇÃO: Visibility não estava Visible - corrigindo");
                Visibility = Visibility.Visible;
                Show();
            }
            
            if (!ShowInTaskbar)
            {
                LogToFile("CORREÇÃO: ShowInTaskbar estava false - corrigindo");
                ShowInTaskbar = true;
            }
            
            // CORREÇÃO: Garantir que o ícone esteja definido (fallback caso SourceInitialized não tenha funcionado)
            if (_hwnd != IntPtr.Zero)
            {
                SetWindowIcon(_hwnd);
            }
            else
            {
                // Tentar obter o handle novamente
                Dispatcher.BeginInvoke(new Action(() =>
                {
                    try
                    {
                        var hwnd = new WindowInteropHelper(this).Handle;
                        if (hwnd != IntPtr.Zero)
                        {
                            _hwnd = hwnd;
                            SetWindowIcon(hwnd);
                        }
                    }
                    catch { }
                }), System.Windows.Threading.DispatcherPriority.Loaded);
            }
            
            UpdateClipGeometry();
            SizeChanged += (s, args) => UpdateClipGeometry();
            
            LogToFile("===== Window_Loaded (XAML) FINALIZADO =====");
        }
        
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
                
                // CORREÇÃO CRÍTICA: Definir ícone da janela programaticamente
                // Isso garante que o ícone apareça na barra de tarefas e no Alt+Tab
                SetWindowIcon(hwnd);
                
                // Tentar aplicar bordas arredondadas nativas do Windows 11
                if (Environment.OSVersion.Version.Build >= 22000) // Windows 11
                {
                    try
                    {
                        var preference = (int)Win32.DWM_WINDOW_CORNER_PREFERENCE.DWMWCP_ROUND;
                        Win32.DwmSetWindowAttribute(
                            hwnd,
                            Win32.DWMWINDOWATTRIBUTE.DWMWA_WINDOW_CORNER_PREFERENCE,
                            ref preference,
                            sizeof(int));
                    }
                    catch
                    {
                        // Fallback: usar região arredondada
                        ApplyRoundedRegion(hwnd);
                    }
                }
                else
                {
                    // Windows 10: usar região arredondada
                    ApplyRoundedRegion(hwnd);
                }
                
                // Adicionar hook para atualizar região quando a janela é redimensionada
                var source = HwndSource.FromHwnd(hwnd);
                source?.AddHook(WndProc);
                CreateDummyWindow();
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogWarning($"Erro ao aplicar bordas arredondadas: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Define o ícone da janela usando Win32 API para garantir que apareça na barra de tarefas e Alt+Tab
        /// </summary>
        private void SetWindowIcon(IntPtr hwnd)
        {
            try
            {
                // Tentar carregar o ícone do arquivo
                var iconPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Images", "favicon.ico");
                if (File.Exists(iconPath))
                {
                    try
                    {
                        // Carregar ícone grande (32x32) e pequeno (16x16)
                        System.Drawing.Icon? iconLarge = null;
                        System.Drawing.Icon? iconSmall = null;
                        
                        using (var iconStream = File.OpenRead(iconPath))
                        {
                            var icon = new System.Drawing.Icon(iconStream);
                            
                            // Criar versões grandes e pequenas do ícone
                            try
                            {
                                iconLarge = new System.Drawing.Icon(icon, 32, 32);
                            }
                            catch
                            {
                                iconLarge = icon;
                            }
                            
                            try
                            {
                                iconSmall = new System.Drawing.Icon(icon, 16, 16);
                            }
                            catch
                            {
                                iconSmall = icon;
                            }
                        }
                        
                        if (iconLarge != null && iconSmall != null)
                        {
                            // Definir ícone grande (32x32) - usado na barra de tarefas e Alt+Tab
                            Win32.SendMessage(hwnd, Win32.WM_SETICON, new IntPtr(1), iconLarge.Handle); // ICON_BIG
                            
                            // Definir ícone pequeno (16x16) - usado na barra de título
                            Win32.SendMessage(hwnd, Win32.WM_SETICON, new IntPtr(0), iconSmall.Handle); // ICON_SMALL
                            
                            // Também definir via SetClassLongPtr para garantir persistência
                            Win32.SetClassLongPtrSafe(hwnd, Win32.GCL_HICON, iconLarge.Handle);
                            Win32.SetClassLongPtrSafe(hwnd, Win32.GCL_HICONSM, iconSmall.Handle);
                            
                            App.LoggingService?.LogInfo("Ícone da janela definido com sucesso via Win32 API");
                        }
                    }
                    catch (Exception ex)
                    {
                        App.LoggingService?.LogWarning($"Erro ao definir ícone via Win32: {ex.Message}");
                    }
                }
                else
                {
                    App.LoggingService?.LogWarning($"Arquivo de ícone não encontrado: {iconPath}");
                }
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogWarning($"Erro ao definir ícone da janela: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Aplica região arredondada à janela (fallback para Windows 10)
        /// </summary>
        private void ApplyRoundedRegion(IntPtr hwnd)
        {
            try
            {
                int cornerRadius = 16;
                int width = (int)ActualWidth;
                int height = (int)ActualHeight;
                
                if (width > 0 && height > 0)
                {
                    IntPtr rgn = Win32.CreateRoundRectRgn(0, 0, width + 1, height + 1, cornerRadius, cornerRadius);
                    Win32.SetWindowRgn(hwnd, rgn, true);
                    // Nota: Não deletamos rgn porque SetWindowRgn assume propriedade dele
                }
            }
            catch { }
        }
        
        /// <summary>
        /// Processa mensagens do Windows para manter bordas arredondadas ao redimensionar
        /// </summary>
        private IntPtr WndProc(IntPtr hwnd, int msg, IntPtr wParam, IntPtr lParam, ref bool handled)
        {
            const int WM_SIZE = 0x0005;
            const int WM_SIZING = 0x0214;
            const int WM_EXITSIZEMOVE = 0x0232;
            
            if (msg == WM_SIZE || msg == WM_SIZING || msg == WM_EXITSIZEMOVE)
            {
                // Apenas aplicar região no Windows 10 (Windows 11 usa DWM nativo)
                if (Environment.OSVersion.Version.Build < 22000)
                {
                    Dispatcher.BeginInvoke(new Action(() =>
                    {
                        try
                        {
                            ApplyRoundedRegion(hwnd);
                        }
                        catch { }
                    }), System.Windows.Threading.DispatcherPriority.Render);
                }
            }
            
            return IntPtr.Zero;
        }

        protected override void OnSourceInitialized(EventArgs e)
        {
            base.OnSourceInitialized(e);
            _hwnd = new WindowInteropHelper(this).Handle;
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
                var icon = GetApplicationIcon();
                if (icon == null)
                {
                    LogToFile("ERRO: Ícone é null, usando ícone padrão do sistema");
                    App.LoggingService?.LogError("Não foi possível obter o ícone do aplicativo para o systray");
                    icon = System.Drawing.SystemIcons.Application;
                }
                else
                {
                    LogToFile("Ícone obtido com sucesso");
                }
                
                LogToFile("Criando NotifyIcon...");
                _notifyIcon = new WinForms.NotifyIcon
                {
                    Icon = icon,
                    Visible = true,
                    Text = "Voltris Optimizer"
                };
                
                LogToFile($"NotifyIcon criado - Visible: {_notifyIcon.Visible}, Text: {_notifyIcon.Text}");
                
                // Usar MouseClick para abrir menu customizado
                _notifyIcon.MouseClick += NotifyIcon_MouseClick;
                _notifyIcon.DoubleClick += (s, e) => 
                {
                    LogToFile("NotifyIcon DoubleClick - chamando ShowWindow()");
                    ShowWindow();
                };
                
                LogToFile("InitializeNotifyIcon() - SUCESSO");
            }
            catch (Exception ex)
            {
                LogToFile($"ERRO CRÍTICO em InitializeNotifyIcon(): {ex.Message}\n{ex.StackTrace}");
                App.LoggingService?.LogError($"Erro ao inicializar systray: {ex.Message}", ex);
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
            Application.Current.Dispatcher.Invoke(() =>
            {
                try
                {
                    var contextMenu = CreateTrayContextMenu();
                    
                    // Obter posição do cursor em coordenadas da tela
                    var mousePos = System.Windows.Forms.Control.MousePosition;
                    
                    // Obter informações da tela onde o cursor está
                    var screen = System.Windows.Forms.Screen.FromPoint(mousePos);
                    var screenBounds = screen.WorkingArea;
                    
                    // O ContextMenu do WPF precisa estar associado a um elemento visual
                    // Usamos a MainWindow como elemento base
                    if (Application.Current.MainWindow != null)
                    {
                        Application.Current.MainWindow.ContextMenu = contextMenu;
                        
                        // Configurar posicionamento inteligente
                        // O WPF automaticamente ajusta se o menu sair da tela
                        contextMenu.Placement = System.Windows.Controls.Primitives.PlacementMode.AbsolutePoint;
                        contextMenu.PlacementRectangle = new Rect(mousePos.X, mousePos.Y, 0, 0);
                        contextMenu.HorizontalOffset = 0;
                        contextMenu.VerticalOffset = 0;
                        
                        // Abrir o menu
                        contextMenu.IsOpen = true;
                        
                        // Limpar após fechar
                        contextMenu.Closed += (s, e) =>
                        {
                            if (Application.Current.MainWindow != null)
                            {
                                Application.Current.MainWindow.ContextMenu = null;
                            }
                        };
                    }
                }
                catch (Exception ex)
                {
                    App.LoggingService?.LogError("Erro ao exibir menu do systray", ex);
                }
            });
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
                versionString = "v1.0.0.1";
            }
            
            // Cabeçalho (não clicável, apenas visual)
            var headerItem = new MenuItem
            {
                Header = CreateHeaderContent("Voltris Optimizer", versionString),
                IsEnabled = false,
                Background = new SolidColorBrush((MediaColor)Application.Current.Resources["DarkPanelAltColor"]),
                Padding = new Thickness(12, 10, 12, 10),
                Height = 60
            };
            menu.Items.Add(headerItem);
            
            menu.Items.Add(CreateFullWidthSeparator());
            
            // Seção: Ações Rápidas
            var quickActionsHeader = new MenuItem
            {
                Header = "Ações Rápidas",
                IsEnabled = false,
                Foreground = new SolidColorBrush((MediaColor)Application.Current.Resources["TextMutedColor"]),
                FontSize = 11,
                FontWeight = FontWeights.SemiBold,
                Padding = new Thickness(8, 6, 8, 6)
            };
            menu.Items.Add(quickActionsHeader);
            
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
                ShowWindow();
                NavigateToPageSafe("Cleanup");
                await System.Threading.Tasks.Task.Delay(300);
                if (Application.Current.MainWindow is MainWindow mainWindow)
                {
                    var contentFrame = mainWindow.FindName("ContentFrame") as ContentControl;
                    if (contentFrame?.Content is Views.CleanupView cleanupView)
                    {
                        var runButton = cleanupView.FindName("RunCleanupButton") as System.Windows.Controls.Button;
                        runButton?.RaiseEvent(new RoutedEventArgs(System.Windows.Controls.Button.ClickEvent));
                    }
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
                ShowWindow();
                NavigateToPageSafe("Performance");
                await System.Threading.Tasks.Task.Delay(300);
                if (Application.Current.MainWindow is MainWindow mainWindow)
                {
                    var contentFrame = mainWindow.FindName("ContentFrame") as ContentControl;
                    if (contentFrame?.Content is Views.PerformanceView perfView)
                    {
                        var runButton = perfView.FindName("RunPerformanceButton") as System.Windows.Controls.Button;
                        runButton?.RaiseEvent(new RoutedEventArgs(System.Windows.Controls.Button.ClickEvent));
                    }
                }
            };
            menu.Items.Add(optimizeItem);
            
            menu.Items.Add(CreateFullWidthSeparator());
            
            // Seção: Navegação
            var navigationHeader = new MenuItem
            {
                Header = "Navegação",
                IsEnabled = false,
                Foreground = new SolidColorBrush((MediaColor)Application.Current.Resources["TextMutedColor"]),
                FontSize = 11,
                FontWeight = FontWeights.SemiBold,
                Padding = new Thickness(8, 6, 8, 6)
            };
            menu.Items.Add(navigationHeader);
            
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
            var grid = new Grid();
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = GridLength.Auto });
            grid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) });
            
            // Ícone
            var icon = new System.Windows.Controls.Image
            {
                Width = 20,
                Height = 20,
                VerticalAlignment = VerticalAlignment.Center,
                Margin = new Thickness(0, 0, 12, 0),
                SnapsToDevicePixels = true
            };
            try
            {
                var icoUri = new Uri("pack://siteoforigin:,,,/Images/favicon.ico", UriKind.Absolute);
                var decoder = new IconBitmapDecoder(icoUri, BitmapCreateOptions.None, BitmapCacheOption.OnLoad);
                if (decoder.Frames.Count > 0)
                {
                    icon.Source = decoder.Frames[0];
                    RenderOptions.SetBitmapScalingMode(icon, BitmapScalingMode.HighQuality);
                }
            }
            catch { }
            var gradient = new LinearGradientBrush
            {
                StartPoint = new System.Windows.Point(0, 0),
                EndPoint = new System.Windows.Point(1, 0)
            };
            gradient.GradientStops.Add(new GradientStop((MediaColor)Application.Current.Resources["AccentColor"], 0));
            gradient.GradientStops.Add(new GradientStop((MediaColor)Application.Current.Resources["SecondaryColor"], 0.5));
            gradient.GradientStops.Add(new GradientStop((MediaColor)Application.Current.Resources["PrimaryColor"], 1));
            Grid.SetColumn(icon, 0);
            grid.Children.Add(icon);
            
            // Texto
            var stackPanel = new StackPanel
            {
                VerticalAlignment = VerticalAlignment.Center
            };
            var titleBlock = new TextBlock
            {
                Text = title,
                FontSize = 13,
                FontWeight = FontWeights.SemiBold
            };
            titleBlock.Foreground = gradient;
            stackPanel.Children.Add(titleBlock);
            
            var versionBlock = new TextBlock
            {
                Text = version,
                FontSize = 10,
                Foreground = new SolidColorBrush((MediaColor)Application.Current.Resources["TextSecondaryColor"]),
                Margin = new Thickness(0, 2, 0, 0)
            };
            stackPanel.Children.Add(versionBlock);
            
            Grid.SetColumn(stackPanel, 1);
            grid.Children.Add(stackPanel);
            
            return grid;
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
                Margin = new Thickness(0, 8, 0, 8)
            };
            var item = new MenuItem
            {
                Header = border,
                IsEnabled = false,
                Padding = new Thickness(0),
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
        }
        
        private void ExitApplication()
        {
            _isClosing = true;
            _notifyIcon?.Dispose();
            Application.Current.Shutdown();
        }
        
        private void UpdateLocalizedTexts()
        {
            // Os botões de navegação agora usam ícones vetoriais, não precisam de atualização de texto aqui
            // A localização do texto é feita via binding ou diretamente no XAML
            
            // Atualizar status
            if (StatusText != null) StatusText.Text = _localization.GetString("StatusReady");
            if (StatusLabel != null) StatusLabel.Text = _localization.GetString("Ready");
            
            // Atualizar tooltips
            if (SettingsButton != null) SettingsButton.ToolTip = _localization.GetString("Settings");
            if (MinimizeButton != null) MinimizeButton.ToolTip = _localization.GetString("Minimize");
            if (MaximizeButton != null) MaximizeButton.ToolTip = _localization.GetString("Maximize");
            if (CloseButton != null) CloseButton.ToolTip = _localization.GetString("Close");
        }

        private void InitializeNavigation()
        {
            try
            {
                var dashboardView = new DashboardView();
                ContentFrame.Content = dashboardView;
                _currentView = dashboardView;
                
                // Marcar o botão Dashboard como selecionado usando Dispatcher para garantir que o layout esteja completo
                Dispatcher.BeginInvoke(new System.Action(() =>
                {
                    try
                    {
                        if (NavDashboard != null && _primaryBrush != null)
                        {
                            NavDashboard.Foreground = _primaryBrush;
                            _currentSelectedButton = NavDashboard;
                        }
                    }
                    catch
                    {
                        // Ignorar silenciosamente
                    }
                }), System.Windows.Threading.DispatcherPriority.Loaded);
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    $"Erro ao inicializar navegação: {ex.Message}",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error
                );
            }
        }

        private void NavButton_Click(object sender, RoutedEventArgs e)
        {
            // Proteção absoluta contra navegações concorrentes
            if (_isNavigating || _isUpdatingSelection)
                return;
                
            if (!(sender is Button button) || !(button.Tag is string pageName))
                return;

            // Verificar se já está na página atual
            if (button == _currentSelectedButton)
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
                
                // Navegar PRIMEIRO (sem atualizar Foreground durante)
                NavigateToPageSafe(pageName);
                
                // Atualizar seleção visual APÓS a navegação estar completa
                // Usar Dispatcher com prioridade baixa para garantir que o layout pass esteja completo
                Dispatcher.BeginInvoke(new System.Action(() =>
                {
                    try
                    {
                        if (!_isUpdatingSelection && _currentSelectedButton == button && button != null)
                        {
                            UpdateButtonSelectionSafe(button);
                        }
                    }
                    catch
                    {
                        // Ignorar silenciosamente
                    }
                }), System.Windows.Threading.DispatcherPriority.ContextIdle);
            }
            catch (Exception ex)
            {
                // Restaurar botão anterior em caso de erro
                _currentSelectedButton = previousButton;
                MessageBox.Show(
                    $"Erro ao navegar: {ex.Message}",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error
                );
            }
            finally
            {
                // Reabilitar botões após um delay
                Dispatcher.BeginInvoke(new System.Action(() =>
                {
                    try
                    {
                        _isNavigating = false;
                        EnableNavigationButtons();
                    }
                    catch
                    {
                        // Ignorar silenciosamente
                    }
                }), System.Windows.Threading.DispatcherPriority.ContextIdle);
            }
        }

        private void DisableNavigationButtons()
        {
            var buttons = new[] { NavDashboard, NavCleanup, NavPerformance, NavNetwork, NavSystem, NavGamer, NavDiagnostics, NavHistory, NavScheduler, NavLogs };
            foreach (var btn in buttons.Where(b => b != null))
            {
                btn.IsEnabled = false;
            }
        }

        private void EnableNavigationButtons()
        {
            var buttons = new[] { NavDashboard, NavCleanup, NavPerformance, NavNetwork, NavSystem, NavGamer, NavDiagnostics, NavHistory, NavScheduler, NavLogs };
            foreach (var btn in buttons.Where(b => b != null))
            {
                btn.IsEnabled = true;
            }
        }

        private void UpdateButtonSelectionSafe(Button selectedButton)
        {
            // Proteção absoluta contra loops recursivos
            if (_isUpdatingSelection || selectedButton == null)
                return;

            try
            {
                // Ativar flag de proteção
                _isUpdatingSelection = true;

                // Armazenar botão selecionado
                _currentSelectedButton = selectedButton;

                var buttons = new[] { NavDashboard, NavCleanup, NavPerformance, NavNetwork, NavSystem, NavGamer, NavDiagnostics, NavHistory, NavScheduler, NavLogs };
                
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
                        
                        // Atualizar cor do ícone Path dentro do botão
                        var content = btn.Content as StackPanel;
                        if (content != null && content.Children.Count > 0)
                        {
                            var pathIcon = content.Children[0] as System.Windows.Shapes.Path;
                            if (pathIcon != null)
                            {
                                pathIcon.Fill = isSelected ? _primaryBrush : _secondaryTextBrush;
                            }
                        }
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

        private void NavigateToPageSafe(string pageName)
        {
            try
            {
                UserControl? newView = null;
                
                // Criar view de forma segura
                try
                {
                    newView = pageName switch
                    {
                        "Dashboard" => new DashboardView(),
                        "Cleanup" => new CleanupView(),
                        "Performance" => new PerformanceView(),
                        "Network" => new NetworkView(),
                        "System" => new SystemView(),
                        "Gamer" => new GamerView(),
                        "History" => new HistoryView(),
                        "Scheduler" => new SchedulerView(),
                        "Logs" => new LogsView(),
                        "Settings" => new SettingsView(),
                        "Diagnostics" => new GameDiagnosticsView(),
                        _ => null
                    };
                }
                catch (Exception ex)
                {
                    MessageBox.Show(
                        $"Erro ao criar página '{pageName}': {ex.Message}",
                        "Erro",
                        MessageBoxButton.OK,
                        MessageBoxImage.Error
                    );
                    return;
                }

                if (newView != null)
                {
                    // Navegação direta sem animações - simples e seguro
                    ContentFrame.Content = newView;
                    
                    // Limpar referência anterior
                    if (_currentView != null)
                    {
                        _currentView = null;
                    }
                    
                    _currentView = newView;
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    $"Erro ao navegar: {ex.Message}",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error
                );
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
                    MessageBox.Show("Finalize o questionário e o tutorial para destravar.", "Voltris", MessageBoxButton.OK, MessageBoxImage.Information);
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
        /// Atualiza a barra de progresso (footer e sidebar)
        /// </summary>
        public void UpdateProgress(int percentage)
        {
            Dispatcher.Invoke(() =>
            {
                // Atualizar progressbar do footer
                if (ProgressBarFill != null && ContentFrame != null && ContentFrame.ActualWidth > 0)
                {
                    double width = (ContentFrame.ActualWidth / 100.0) * percentage;
                    ProgressBarFill.Width = Math.Max(0, Math.Min(width, ContentFrame.ActualWidth));
                }
                
                // Atualizar barra da sidebar
                if (StatusIndicator != null && StatusIndicatorContainer != null)
                {
                    if (percentage == 0)
                    {
                        // Quando em 0%, mostrar 100% (estado "Pronto")
                        StatusIndicator.HorizontalAlignment = HorizontalAlignment.Stretch;
                        StatusIndicator.Width = double.NaN; // Auto width
                    }
                    else if (percentage == 100)
                    {
                        // Quando completo, mostrar 100%
                        StatusIndicator.HorizontalAlignment = HorizontalAlignment.Stretch;
                        StatusIndicator.Width = double.NaN; // Auto width
                    }
                    else
                    {
                        // Durante operação, mostrar progresso proporcional
                        StatusIndicator.HorizontalAlignment = HorizontalAlignment.Left;
                        if (StatusIndicatorContainer.ActualWidth > 0)
                        {
                            double sidebarWidth = (StatusIndicatorContainer.ActualWidth / 100.0) * percentage;
                            StatusIndicator.Width = Math.Max(10, Math.Min(sidebarWidth, StatusIndicatorContainer.ActualWidth));
                        }
                    }
                }
            });
        }

        /// <summary>
        /// Atualiza o status (footer e sidebar)
        /// </summary>
        public void UpdateStatus(string message)
        {
            Dispatcher.Invoke(() =>
            {
                // Atualizar label do footer
                if (StatusLabel != null)
                {
                    StatusLabel.Text = message;
                }
                
                // Atualizar texto da sidebar
                if (StatusText != null)
                {
                    StatusText.Text = $"Status: {message}";
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
            if (e.ChangedButton == System.Windows.Input.MouseButton.Left)
            {
                DragMove();
            }
        }

        /// <summary>
        /// Minimiza a janela
        /// </summary>
        private void MinimizeButton_Click(object sender, RoutedEventArgs e)
        {
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
        
        /// <summary>
        /// Abre as configurações
        /// </summary>
        private void SettingsButton_Click(object sender, RoutedEventArgs e)
        {
            NavigateToPageSafe("Settings");
        }
        
        protected override void OnStateChanged(EventArgs e)
        {
            base.OnStateChanged(e);
            
            LogToFile($"OnStateChanged: WindowState={WindowState}, _isWindowFullyLoaded={_isWindowFullyLoaded}");
            
            // CORREÇÃO RADICAL: NUNCA esconder automaticamente no startup
            // Só esconder se o usuário minimizou manualmente DEPOIS que a janela foi totalmente carregada
            // E a configuração está ativada
            if (WindowState == WindowState.Minimized && _settings.Settings.MinimizeToTray && _isWindowFullyLoaded)
            {
                LogToFile("OnStateChanged: Escondendo para tray (usuário minimizou manualmente)");
                HideToTray();
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
        }
        
        private bool _isWindowFullyLoaded = false;
        
        private void CheckOnboarding()
        {
            var onboardingService = new OnboardingService();
            if (!onboardingService.HasCompletedOnboarding())
            {
                // BLOQUEAR o sidebar IMEDIATAMENTE durante todo o onboarding
                _gateLocked = true;
                DisableSidebarCompletely();
                
                // Mostrar onboarding
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
                    catch { }
                };
                
                // Substituir conteúdo atual pelo onboarding
                if (ContentFrame != null)
                {
                    ContentFrame.Content = onboardingView;
                }
            }
        }
        
        /// <summary>
        /// Desabilita completamente o sidebar durante o onboarding
        /// </summary>
        public void DisableSidebarCompletely()
        {
            var buttons = new[] { NavDashboard, NavCleanup, NavPerformance, NavNetwork, NavSystem, NavGamer, NavDiagnostics, NavHistory, NavScheduler, NavLogs };
            foreach (var btn in buttons.Where(b => b != null))
            {
                btn.IsEnabled = false;
                btn.Opacity = 0.5; // Mostrar visualmente que está desabilitado
            }
        }

        private void SetupKeyboardShortcuts()
        {
            // Atalhos serão tratados no Window_KeyDown
        }

        private void Window_KeyDown(object sender, System.Windows.Input.KeyEventArgs e)
        {
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
                    versionString = "v1.0.0.1";
                }
                
                if (VersionText != null)
                {
                    VersionText.Text = versionString;
                }
                
                if (SidebarVersionText != null)
                {
                    SidebarVersionText.Text = versionString;
                }
            }
            catch
            {
                // Se houver erro, usar versão padrão
                if (VersionText != null)
                {
                    VersionText.Text = "v1.0.0.1";
                }
                
                if (SidebarVersionText != null)
                {
                    SidebarVersionText.Text = "v1.0.0.1";
                }
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
                _notifyIcon?.Dispose();
            }
            
            base.OnClosing(e);
        }

        /// <summary>
        /// Handler para o botão de ativação de licença no header
        /// </summary>
        private void ActivateLicenseHeaderButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var licenseManager = VoltrisOptimizer.Services.LicenseManager.Instance;
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
    }
}
