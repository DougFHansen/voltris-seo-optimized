using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using VoltrisOptimizer.Core.Updater;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.UI.Controls;
using VoltrisOptimizer.UI.Windows;
using VoltrisOptimizer.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using VoltrisOptimizer.Services.Optimization;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using Language = VoltrisOptimizer.Services.Language;
using System.Security.Principal;
using System.ComponentModel;

namespace VoltrisOptimizer.UI.Views
{
    public partial class SettingsView : UserControl
    {
        private readonly LocalizationService _localization;
        private readonly SettingsService _settings;
        private readonly IDialogService? _dialogs;
        private readonly ILoggingService? _logger;
        private readonly StartupManager _startupManager;

        public string TitleText => _localization.GetString("Settings");
        public string LanguageSectionTitle => _localization.GetString("Language");
        public string StartupSectionTitle => _localization.GetString("StartWithWindows");
        public string BehaviorSectionTitle => _localization.GetString("AdvancedSettings");
        
        public string PortugueseText => _localization.GetString("Portuguese");
        public string SpanishText => _localization.GetString("Spanish");
        public string EnglishText => _localization.GetString("English");
        
        public string StartWithWindowsText => _localization.GetString("StartWithWindows");
        public string StartMinimizedText => _localization.GetString("StartMinimized");
        public string MinimizeToTrayText => _localization.GetString("MinimizeToTray");
        public string CloseToTrayText => _localization.GetString("CloseToTray");
        
        public string IntelligentProfileTitle => _localization.GetString("IntelligentProfile");
        public string IntelligentProfileDesc => _localization.GetString("IntelligentProfileDesc");
        public string ProfileGamerCompetitiveText => _localization.GetString("ProfileGamerCompetitive");
        public string ProfileGamerSinglePlayerText => _localization.GetString("ProfileGamerSinglePlayer");
        public string ProfileWorkOfficeText => _localization.GetString("ProfileWorkOffice");
        public string ProfileCreativeVideoEditingText => _localization.GetString("ProfileCreativeVideoEditing");
        public string ProfileDeveloperProgrammingText => _localization.GetString("ProfileDeveloperProgramming");
        public string ProfileGeneralBalancedText => _localization.GetString("ProfileGeneralBalanced");
        public string ProfileEnterpriseSecureText => _localization.GetString("ProfileEnterpriseSecure");
        

        
        public bool StartWithWindowsChecked
        {
            get => _settings.Settings.StartWithWindows;
            set
            {
                _settings.Settings.StartWithWindows = value;
                _settings.SaveSettings();
            }
        }
        
        public bool StartMinimizedChecked
        {
            get => _settings.Settings.StartMinimized;
            set
            {
                _settings.Settings.StartMinimized = value;
                _settings.SaveSettings();
            }
        }
        
        public bool MinimizeToTrayChecked
        {
            get => _settings.Settings.MinimizeToTray;
            set
            {
                _settings.Settings.MinimizeToTray = value;
                _settings.SaveSettings();
            }
        }
        
        public bool CloseToTrayChecked
        {
            get => _settings.Settings.CloseToTray;
            set
            {
                _settings.Settings.CloseToTray = value;
                _settings.SaveSettings();
            }
        }

        

        public bool IsDlsEnabled
        {
            get => _settings.Settings.EnableDynamicLoadStabilizer;
            set
            {
                if (_settings.Settings.EnableDynamicLoadStabilizer != value)
                {
                    _settings.Settings.EnableDynamicLoadStabilizer = value;
                    _settings.SaveSettings();
                    
                    // Notificar o serviço em tempo real
                    try
                    {
                        var dls = App.Services?.GetService<IDynamicLoadStabilizer>();
                        if (dls != null)
                        {
                            dls.Enabled = value;
                            if (value) _ = dls.StartGlobalAsync();
                            else _ = dls.StopAsync();
                        }
                    }
                    catch { }
                }
            }
        }

        private bool _isLoading = true; // Flag para evitar disparar eventos durante carregamento
        
        public SettingsView()
        {
            // CRITICAL FIX: Ensure Application resources are loaded before InitializeComponent
            if (Application.Current == null)
            {
                throw new InvalidOperationException("Application.Current is null. SettingsView must be created after Application initialization.");
            }

            // Verify that required resource dictionaries are loaded
            try
            {
                // Test if key resources are available
                var testBrush = Application.Current.TryFindResource("DarkBrush");
                if (testBrush == null)
                {
                    System.Diagnostics.Debug.WriteLine("WARNING: DarkBrush resource not found. Resources may not be fully loaded.");
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"WARNING: Error checking resources: {ex.Message}");
            }

            // CORREÇÃO CRÍTICA: Inicializar serviços ANTES de InitializeComponent
            _localization = LocalizationService.Instance;
            _settings = SettingsService.Instance;
            try { _dialogs = App.Services?.GetService<IDialogService>(); } catch { }
            try { _logger = App.Services?.GetService<ILoggingService>(); } catch { }
            _startupManager = new StartupManager(_logger);
            
            // CORREÇÃO CRÍTICA: Definir DataContext ANTES de InitializeComponent para evitar erros de binding
            DataContext = this;

            try
            {
                InitializeComponent();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"CRITICAL ERROR in InitializeComponent: {ex.Message}");
                System.Diagnostics.Debug.WriteLine($"Stack Trace: {ex.StackTrace}");
                
                // Log to file for debugging
                try
                {
                    var logDir = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                    if (!System.IO.Directory.Exists(logDir))
                        System.IO.Directory.CreateDirectory(logDir);
                    System.IO.File.AppendAllText(
                        System.IO.Path.Combine(logDir, "settingsview_error.log"),
                        $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] InitializeComponent Error:\n{ex.Message}\n{ex.StackTrace}\n\n"
                    );
                }
                catch { }
                
                throw; // Re-throw para que o erro seja capturado pelo MainWindow
            }
            
            // Carregar estado atual SEM disparar eventos
            _isLoading = true;
            
            // CORREÇÃO CRÍTICA: Mover TODA inicialização de controles para o evento Loaded
            Loaded += async (s, e) =>
            {
                try
                {
                    // Sincronizar estado do startup com as configurações
                    // O WindowsStartupManager garante que o registro reflita as configurações
                    await Task.Run(() =>
                    {
                        _startupManager.SetStartup(
                            _settings.Settings.StartWithWindows,
                            _settings.Settings.StartMinimized
                        );
                    });

                    // Atualizar UI para refletir o estado real
                    var isEnabled = await Task.Run(() => _startupManager.IsStartupEnabled());
                    if (CheckStartWithWindows != null)
                        CheckStartWithWindows.IsChecked = isEnabled;
                }
                catch (Exception ex)
                {
                    // Em caso de erro, refletir o estado real do sistema
                    try
                    {
                        var isEnabled = await Task.Run(() => _startupManager.IsStartupEnabled());
                        if (CheckStartWithWindows != null)
                            CheckStartWithWindows.IsChecked = isEnabled;
                        _settings.Settings.StartWithWindows = isEnabled;
                        _settings.SaveSettings();
                    }
                    catch
                    {
                        // Se tudo falhar, usar o valor das configurações
                        if (CheckStartWithWindows != null)
                            CheckStartWithWindows.IsChecked = _settings.Settings.StartWithWindows;
                    }
                }
                
                // INICIALIZAR TODOS OS CONTROLES AQUI (após Loaded)
                try
                {
                    if (CheckStartMinimized != null)
                        CheckStartMinimized.IsChecked = _settings.Settings.StartMinimized;
                    if (CheckMinimizeToTray != null)
                        CheckMinimizeToTray.IsChecked = _settings.Settings.MinimizeToTray;
                    if (CheckCloseToTray != null)
                        CheckCloseToTray.IsChecked = _settings.Settings.CloseToTray;
                    
                    var extreme = App.ExtremeOptimizations;
                    if (extreme != null)
                    {
                        if (CheckDryRun != null)
                            CheckDryRun.IsChecked = extreme.DryRun;
                        if (CheckAllowWatchdog != null)
                            CheckAllowWatchdog.IsChecked = extreme.AllowBackgroundWatchdog;
                    }
                    
                    // Carregar estado do DLS das configurações
                    if (CheckEnableDls != null)
                        CheckEnableDls.IsChecked = _settings.Settings.EnableDynamicLoadStabilizer;
                    
                    // Carregar estado do menu de contexto do desktop
                    if (CheckDesktopContextMenu != null)
                        CheckDesktopContextMenu.IsChecked = _settings.Settings.EnableDesktopContextMenu;
                    
                    // Carregar estado da transparência
                    if (TransparencyToggle != null)
                        TransparencyToggle.IsChecked = _settings.Settings.EnableTransparency;
                    
                    // Carregar estado das notificações
                    if (CheckNotificationsEnabled != null)
                        CheckNotificationsEnabled.IsChecked = _settings.Settings.NotificationsEnabled;
                    if (CheckNotifyThreats != null)
                        CheckNotifyThreats.IsChecked = _settings.Settings.NotifyOnThreatDetected;
                    if (CheckNotifyScanComplete != null)
                        CheckNotifyScanComplete.IsChecked = _settings.Settings.NotifyOnScanComplete;
                    if (CheckNotifyNewDevice != null)
                        CheckNotifyNewDevice.IsChecked = _settings.Settings.NotifyOnNewDevice;
                    
                    // Selecionar tema atual
                    var dicts = Application.Current.Resources.MergedDictionaries;
                    var hasLight = false;
                    foreach (var d in dicts)
                    {
                        var src = d.Source?.ToString() ?? string.Empty;
                        if (src.EndsWith("LightTheme.xaml", StringComparison.OrdinalIgnoreCase))
                        {
                            hasLight = true;
                            break;
                        }
                    }
                    if (!hasLight && _settings.Settings.Theme == "Light")
                    {
                        hasLight = true;
                    }
                    if (ThemeCombo != null)
                        ThemeCombo.SelectedIndex = hasLight ? 1 : 0;
                    
                    // Configurar DLS
                    var dls = App.Services?.GetService<VoltrisOptimizer.Services.Optimization.IDynamicLoadStabilizer>();
                    if (!_settings.Settings.EnableDynamicLoadStabilizer)
                    {
                        _settings.Settings.EnableDynamicLoadStabilizer = true;
                        _settings.SaveSettings();
                    }
                    if (CheckEnableDls != null)
                        CheckEnableDls.IsChecked = true;

                    if (dls != null && DlsOptimizedList != null)
                    {
                        dls.Enabled = true;
                        _ = dls.StartGlobalAsync();
                        
                        dls.OnProcessThrottled += (s2, e2) => Dispatcher.BeginInvoke(() => { try { DlsOptimizedList.Items.Add(new DslOptimizedItem { ProcessName = $"{e2.ProcessName} ({e2.ProcessId})", Status = e2.IsHeavy ? "PESADO" : "OTIMIZADO" }); } catch { } });
                        dls.OnProcessReleased += (s2, e2) => Dispatcher.BeginInvoke(() =>
                        {
                            try
                            {
                                for (int i = DlsOptimizedList.Items.Count - 1; i >= 0; i--)
                                {
                                    if (DlsOptimizedList.Items[i] is DslOptimizedItem item && item.ProcessName.Contains($"({e2.ProcessId})"))
                                        DlsOptimizedList.Items.RemoveAt(i);
                                }
                            }
                            catch { }
                        });
                        Dispatcher.InvokeAsync(() => RefreshProcessList());
                    }
                    
                    // Configurar Perfil Inteligente
                    UpdateProfileSelection();
                    
                    // Configurar idioma
                    UpdateLanguageRadioButtons();
                    UpdateAllTexts();
                    
                    // Atualizar versão
                    UpdateVersionInfo();
                }
                catch (Exception initEx)
                {
                    System.Diagnostics.Debug.WriteLine($"Erro ao inicializar controles: {initEx.Message}");
                }
                
                // Atualizar Status Admin
                try
                {
                    bool isAdmin = IsRunningAsAdministrator();
                    if (isAdmin)
                    {
                        if (AdminStatusText != null)
                        {
                            AdminStatusText.Text = "Administrador (Elevado)";
                            try { AdminStatusText.Foreground = (System.Windows.Media.Brush)Application.Current.Resources["SuccessBrush"]; } catch { }
                        }
                        if (RestartAdminButton != null)
                            RestartAdminButton.Visibility = Visibility.Collapsed;
                    }
                    else
                    {
                        if (AdminStatusText != null)
                        {
                            AdminStatusText.Text = "Usuário Padrão";
                            try { AdminStatusText.Foreground = (System.Windows.Media.Brush)Application.Current.Resources["TextSecondaryBrush"]; } catch { }
                        }
                        if (RestartAdminButton != null)
                            RestartAdminButton.Visibility = Visibility.Visible;
                    }
                }
                catch { }

                _isLoading = false;
                
                // Atualizar status da conta
                _ = UpdateAccountStatusAsync();
            };
            
            // Configurar evento de mudança de idioma
            _localization.LanguageChanged += (s, e) => UpdateAllTexts();
            
            // Sincronizar perfil quando alterado externamente (ex: systray)
            SettingsService.Instance.ProfileChanged += (_, newProfile) =>
            {
                Dispatcher.BeginInvoke(() =>
                {
                    // Evitar re-entrância: se _isLoading já é true, outra operação está em andamento
                    if (_isLoading) return;
                    _isLoading = true;
                    try
                    {
                        UpdateProfileSelection();
                    }
                    finally { _isLoading = false; }
                });
            };
        }

        

        private void UpdateLanguageRadioButtons()
        {
            try
            {
                var currentLang = _settings.Settings.Language;
                if (RadioPortuguese != null)
                    RadioPortuguese.IsChecked = currentLang == VoltrisOptimizer.Services.Language.Portuguese;
                if (RadioSpanish != null)
                    RadioSpanish.IsChecked = currentLang == VoltrisOptimizer.Services.Language.Spanish;
                if (RadioEnglish != null)
                    RadioEnglish.IsChecked = currentLang == VoltrisOptimizer.Services.Language.English;
            }
            catch { }
        }

        private void UpdateAllTexts()
        {
            try
            {
                // Atualizar textos dos radio buttons
                if (RadioPortuguese != null)
                    RadioPortuguese.Content = _localization.GetString("Portuguese");
                if (RadioSpanish != null)
                    RadioSpanish.Content = _localization.GetString("Spanish");
                if (RadioEnglish != null)
                    RadioEnglish.Content = _localization.GetString("English");
                
                // Atualizar outros textos via binding
                DataContext = null;
                DataContext = this;
            }
            catch { }
        }

        private void RadioPortuguese_Checked(object sender, RoutedEventArgs e)
        {
            // CORREÇÃO: Verificar se está carregando ou se os controles estão nulos
            if (_isLoading || RadioPortuguese == null || _settings == null || _localization == null) return;
            
            if (RadioPortuguese.IsChecked == true)
            {
                _settings.Settings.Language = VoltrisOptimizer.Services.Language.Portuguese;
                _localization.SetLanguage(VoltrisOptimizer.Services.Language.Portuguese);
                _settings.SaveSettings();
                UpdateAllTexts();
            }
        }

        private void RadioSpanish_Checked(object sender, RoutedEventArgs e)
        {
            // CORREÇÃO: Verificar se está carregando ou se os controles estão nulos
            if (_isLoading || RadioSpanish == null || _settings == null || _localization == null) return;
            
            if (RadioSpanish.IsChecked == true)
            {
                _settings.Settings.Language = VoltrisOptimizer.Services.Language.Spanish;
                _localization.SetLanguage(VoltrisOptimizer.Services.Language.Spanish);
                _settings.SaveSettings();
                UpdateAllTexts();
            }
        }

        private void RadioEnglish_Checked(object sender, RoutedEventArgs e)
        {
            // CORREÇÃO: Verificar se está carregando ou se os controles estão nulos
            if (_isLoading || RadioEnglish == null || _settings == null || _localization == null) return;
            
            if (RadioEnglish.IsChecked == true)
            {
                _settings.Settings.Language = VoltrisOptimizer.Services.Language.English;
                _localization.SetLanguage(VoltrisOptimizer.Services.Language.English);
                _settings.SaveSettings();
                UpdateAllTexts();
            }
        }

        private void UpdateProfileSelection()
        {
            if (ProfileCombo == null) return;
            
            var profile = _settings.Settings.IntelligentProfile;
            // Mapeamento 1:1 entre índice do Combo e IntelligentProfileType
            // Ordem no XAML:
            // 0 = GamerCompetitive
            // 1 = GamerSinglePlayer
            // 2 = WorkOffice
            // 3 = CreativeVideoEditing
            // 4 = DeveloperProgramming
            // 5 = EnterpriseSecure
            // 6 = GeneralBalanced
            ProfileCombo.SelectedIndex = profile switch
            {
                IntelligentProfileType.GamerCompetitive => 0,
                IntelligentProfileType.GamerSinglePlayer => 1,
                IntelligentProfileType.WorkOffice => 2,
                IntelligentProfileType.CreativeVideoEditing => 3,
                IntelligentProfileType.DeveloperProgramming => 4,
                IntelligentProfileType.EnterpriseSecure => 5,
                IntelligentProfileType.GeneralBalanced => 6,
                _ => 6
            };
        }

        private void ProfileCombo_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (_isLoading) return;
            
            var selectedIndex = ProfileCombo.SelectedIndex;
            // Mapeamento inverso consistente com UpdateProfileSelection e ordem do XAML
            // 0 = GamerCompetitive
            // 1 = GamerSinglePlayer
            // 2 = WorkOffice
            // 3 = CreativeVideoEditing
            // 4 = DeveloperProgramming
            // 5 = EnterpriseSecure
            // 6 = GeneralBalanced
            var profile = selectedIndex switch
            {
                0 => IntelligentProfileType.GamerCompetitive,
                1 => IntelligentProfileType.GamerSinglePlayer,
                2 => IntelligentProfileType.WorkOffice,
                3 => IntelligentProfileType.CreativeVideoEditing,
                4 => IntelligentProfileType.DeveloperProgramming,
                5 => IntelligentProfileType.EnterpriseSecure,
                6 => IntelligentProfileType.GeneralBalanced,
                _ => IntelligentProfileType.GeneralBalanced
            };

            _settings.Settings.IntelligentProfile = profile;
            _settings.SaveSettings();

            _logger?.Log(LogLevel.Info, LogCategory.System, $"Perfil Inteligente alterado para: {profile}");

            // NotifyProfileChanged dispara:
            //   1. IntelligentPowerPlanService → aplica plano de energia correspondente
            //   2. GlobalThermalMonitorService → atualiza thresholds térmicos
            //   3. DynamicLoadStabilizer → atualiza perfil de estabilidade
            _settings.NotifyProfileChanged(profile);
            
            // ATUALIZAR AGENTE DE ESTABILIDADE EM TEMPO REAL
            try
            {
                var dls = App.Services?.GetService<VoltrisOptimizer.Services.Optimization.IDynamicLoadStabilizer>();
                dls?.SetProfile(profile);
            }
            catch { }

            // Mostrar feedback visual das otimizações ativas
            ShowProfileFeedback(profile);

            // Telemetry
            App.TelemetryService?.TrackEvent("SETTINGS_PROFILE_CHANGE", "Settings", "Change", metadata: new { Profile = profile.ToString() });
        }
        
        private void ShowProfileFeedback(IntelligentProfileType profile)
        {
            if (ProfileFeedbackPanel == null || ProfileFeedbackText == null) return;
            
            string powerPlan = profile switch
            {
                IntelligentProfileType.GamerCompetitive or
                IntelligentProfileType.GamerSinglePlayer or
                IntelligentProfileType.CreativeVideoEditing => "⚡ Alto Desempenho",
                _ => "⚖ Balanceado"
            };
            
            string feedbackText = profile switch
            {
                IntelligentProfileType.GamerCompetitive => 
                    $"✅ Plano de energia: {powerPlan}\n" +
                    "✅ Prioridade GPU máxima (8)\n" +
                    "✅ Prioridade de jogos elevada (6)\n" +
                    "✅ Redução de latência de input\n" +
                    "✅ Otimizações de memória e CPU\n" +
                    "🛡 Proteção térmica: Override automático se CPU>90°C\n\n" +
                    "💡 Ganho esperado: 5-15% em latência",
                            
                IntelligentProfileType.GamerSinglePlayer => 
                    $"✅ Plano de energia: {powerPlan}\n" +
                    "✅ Prioridade GPU alta (7)\n" +
                    "✅ Prioridade de jogos média (5)\n" +
                    "✅ Otimizações para mundo aberto\n" +
                    "✅ Otimizações de memória e CPU\n" +
                    "🛡 Proteção térmica: Override automático se CPU>88°C\n\n" +
                    "💡 Ganho esperado: 3-10% em performance",
                            
                IntelligentProfileType.WorkOffice => 
                    $"✅ Plano de energia: {powerPlan}\n" +
                    "✅ MaxCmds = 100 (mais conexões simultâneas)\n" +
                    "✅ Estabilidade de rede SMB\n" +
                    "✅ Foco em serviços essenciais\n" +
                    "✅ Otimizações de memória e CPU\n\n" +
                    "💡 Ganho esperado: 10-20% em performance de rede",
                            
                IntelligentProfileType.CreativeVideoEditing => 
                    $"✅ Plano de energia: {powerPlan}\n" +
                    "✅ Win32PrioritySeparation = 24\n" +
                    "✅ Balanceamento foreground/background\n" +
                    "✅ Otimização multithreading\n" +
                    "✅ Otimizações de memória e CPU\n" +
                    "🛡 Proteção térmica: Override automático se CPU>85°C\n\n" +
                    "💡 Ganho esperado: 8-12% em renderização",
                            
                IntelligentProfileType.DeveloperProgramming => 
                    $"✅ Plano de energia: {powerPlan}\n" +
                    "✅ Otimizações para IDEs e compiladores\n" +
                    "✅ Prioridade para processos de build\n" +
                    "✅ Gestão avançada de memória\n" +
                    "✅ Otimizações de disco e I/O\n\n" +
                    "💡 Ganho esperado: 5-15% em performance de build",
                            
                IntelligentProfileType.GeneralBalanced => 
                    $"✅ Plano de energia: {powerPlan}\n" +
                    "✅ Apenas otimizações comuns\n" +
                    "✅ Baseado em hardware detectado\n" +
                    "✅ Sem otimizações específicas de perfil\n" +
                    "✅ Ideal para uso misto\n\n" +
                    "💡 Ganho esperado: 3-8% geral",
                            
                IntelligentProfileType.EnterpriseSecure => 
                    $"✅ Plano de energia: {powerPlan}\n" +
                    "✅ Estabilidade de rede corporativa\n" +
                    "✅ Proteção de kernel habilitada\n" +
                    "✅ Cache de rede otimizado (Large)\n" +
                    "✅ Buffer de auditoria expandido (20MB)\n" +
                    "✅ Validações de segurança extras\n" +
                    "✅ Proteção de compatibilidade de jogos\n" +
                    "✅ Otimizações de memória e CPU\n\n" +
                    "💡 Ganho esperado: 10-20% com máxima segurança",
                            
                _ => "Perfil não reconhecido"
            };
            
            ProfileFeedbackText.Text = feedbackText;
            ProfileFeedbackPanel.Visibility = Visibility.Visible;
        }

        private void ThemeCombo_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (_isLoading) return;
            try
            {
                var selected = (ThemeCombo.SelectedItem as ComboBoxItem)?.Content?.ToString() ?? "Dark";
                var isLight = selected.Contains("Light", StringComparison.OrdinalIgnoreCase);
                _settings.Settings.Theme = isLight ? "Light" : "Dark";
                _settings.SaveSettings();
                ApplyThemeAndTransparency(_settings.Settings.Theme, _settings.Settings.EnableTransparency);
                
                // Atualizar ícones do header em tempo real
                SyncHeaderIcons();
                
                App.TelemetryService?.TrackEvent("SETTINGS_THEME_CHANGE", "Settings", "Change", metadata: new { Theme = _settings.Settings.Theme });
            }
            catch { }
        }

        private async void CheckStartWithWindows_Checked(object sender, RoutedEventArgs e)
        {
            // Ignorar se estiver carregando (evitar disparar ao abrir configurações)
            if (_isLoading)
                return;
                
            try
            {
                // Verificar se o checkbox de iniciar minimizado já está marcado
                var startMinimized = CheckStartMinimized.IsChecked == true;
                
                // Habilitar startup usando o novo gerenciador
                await Task.Run(() => _startupManager.SetStartup(true, startMinimized));
                
                // Atualizar configurações
                _settings.Settings.StartWithWindows = true;
                _settings.Settings.StartMinimized = startMinimized;
                _settings.SaveSettings();
                

                // Telemetry
                App.TelemetryService?.TrackEvent("SETTINGS_STARTUP_TOGGLE", "Settings", "Change", metadata: new { Enabled = true });
            }
            catch (Exception ex)
            {
                // Em caso de erro, desmarcar e notificar
                CheckStartWithWindows.IsChecked = false;
                _settings.Settings.StartWithWindows = false;
                _settings.SaveSettings();
                
                // Logar erro para debug
                try
                {
                    var logDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                    if (!Directory.Exists(logDir))
                        Directory.CreateDirectory(logDir);
                    File.AppendAllText(
                        Path.Combine(logDir, "startup_error.log"),
                        $"[{DateTime.Now}] Erro ao habilitar startup: {ex.Message}\n{ex.StackTrace}\n\n"
                    );
                }
                catch { }
                
                // Mostrar erro ao usuário
                _dialogs?.ShowError("Erro ao Habilitar Startup", 
                    $"Não foi possível configurar a inicialização automática.\n\nDetalhes: {ex.Message}");
            }
        }
        
        private string? GetExecutablePath()
        {
            // CRÍTICO: Tentar múltiplos métodos para encontrar o executável
            // Priorizar ProcessPath pois é o mais confiável
            var paths = new[]
            {
                // 1. ProcessPath - mais confiável, sempre retorna o .exe real
                System.Environment.ProcessPath,
                
                // 2. Assembly Location (pode retornar .dll em alguns casos)
                System.Reflection.Assembly.GetExecutingAssembly().Location,
                
                // 3. BaseDirectory + nome do executável
                System.IO.Path.Combine(System.AppContext.BaseDirectory, "VoltrisOptimizer.exe"),
                
                // 4. Locais de instalação padrão
                System.IO.Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Voltris Optimizer", "VoltrisOptimizer.exe"),
                System.IO.Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Voltris Optimizer", "VoltrisOptimizer.exe"),
                System.IO.Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Voltris Optimizer", "VoltrisOptimizer.exe")
            };
            
            // Logar tentativas
            try
            {
                var logDir = System.IO.Path.Combine(System.AppContext.BaseDirectory, "Logs");
                if (!System.IO.Directory.Exists(logDir))
                    System.IO.Directory.CreateDirectory(logDir);
                var logFile = System.IO.Path.Combine(logDir, "path_detection.log");
                System.IO.File.AppendAllText(logFile, 
                    $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] ===== DETECÇÃO DE EXECUTÁVEL =====\n");
                
                foreach (var path in paths)
                {
                    if (string.IsNullOrEmpty(path))
                    {
                        System.IO.File.AppendAllText(logFile, $"  Tentando: (null)\n");
                        continue;
                    }
                    
                    // Normalizar o caminho
                    var normalizedPath = System.IO.Path.GetFullPath(path);
                    System.IO.File.AppendAllText(logFile, $"  Tentando: {normalizedPath}\n");
                    
                    // Verificar se existe e é .exe
                    if (System.IO.File.Exists(normalizedPath))
                    {
                        // Se for .dll, tentar converter para .exe (para casos onde Assembly.Location retorna .dll)
                        if (normalizedPath.EndsWith(".dll", StringComparison.OrdinalIgnoreCase))
                        {
                            var exePath = normalizedPath.Replace(".dll", ".exe", StringComparison.OrdinalIgnoreCase);
                            if (System.IO.File.Exists(exePath))
                            {
                                System.IO.File.AppendAllText(logFile, $"  ✓ ENCONTRADO (convertido de .dll): {exePath}\n");
                                System.IO.File.AppendAllText(logFile, $"===== FIM DETECÇÃO =====\n\n");
                                return exePath;
                            }
                        }
                        else if (normalizedPath.EndsWith(".exe", StringComparison.OrdinalIgnoreCase))
                        {
                            System.IO.File.AppendAllText(logFile, $"  ✓ ENCONTRADO: {normalizedPath}\n");
                            System.IO.File.AppendAllText(logFile, $"  Tamanho: {new System.IO.FileInfo(normalizedPath).Length} bytes\n");
                            System.IO.File.AppendAllText(logFile, $"===== FIM DETECÇÃO =====\n\n");
                            return normalizedPath;
                        }
                    }
                }
                
                System.IO.File.AppendAllText(logFile, "  ✗ NENHUM CAMINHO ENCONTRADO!\n");
                System.IO.File.AppendAllText(logFile, $"===== FIM DETECÇÃO (SEM SUCESSO) =====\n\n");
            }
            catch (Exception ex)
            {
                try
                {
                    var logDir = System.IO.Path.Combine(System.AppContext.BaseDirectory, "Logs");
                    var logFile = System.IO.Path.Combine(logDir, "path_detection.log");
                    System.IO.File.AppendAllText(logFile, $"ERRO ao detectar caminho: {ex.Message}\n");
                }
                catch { }
            }
            
            return null;
        }

        private async void CheckStartWithWindows_Unchecked(object sender, RoutedEventArgs e)
        {
            // Ignorar se estiver carregando
            if (_isLoading)
                return;
                
            try
            {
                // Desabilitar startup usando o novo gerenciador
                await Task.Run(() => _startupManager.SetStartup(false, false));
                
                // Atualizar configurações
                _settings.Settings.StartWithWindows = false;
                _settings.Settings.StartWithWindows = false;
                _settings.SaveSettings();

                // Telemetry
                App.TelemetryService?.TrackEvent("SETTINGS_STARTUP_TOGGLE", "Settings", "Change", metadata: new { Enabled = false });
            }
            catch (Exception ex)
            {
                // Em caso de erro, remarcar e notificar
                CheckStartWithWindows.IsChecked = true;
                _settings.Settings.StartWithWindows = true;
                _settings.SaveSettings();
                
                _dialogs?.ShowError("Erro ao Desabilitar Startup", 
                    $"Não foi possível desabilitar a inicialização automática.\n\nDetalhes: {ex.Message}");
            }
        }
        
        private async void CheckStartMinimized_Checked(object sender, RoutedEventArgs e)
        {
            // Ignorar se estiver carregando
            if (_isLoading)
                return;
                
            // Quando o usuário marca "Iniciar minimizado", atualizar as configurações
            _settings.Settings.StartMinimized = true;
            _settings.SaveSettings();
            
            // Se já está configurado para iniciar com Windows, atualizar o registro automaticamente
            if (CheckStartWithWindows.IsChecked == true)
            {
                try
                {
                    await Task.Run(() => _startupManager.SetStartup(true, true));
                }
                catch
                {
                    // Ignorar erros silenciosamente
                }
            }
        }
        
        private async void CheckStartMinimized_Unchecked(object sender, RoutedEventArgs e)
        {
            // Ignorar se estiver carregando
            if (_isLoading)
                return;
                
            // Quando o usuário desmarca "Iniciar minimizado", atualizar as configurações
            _settings.Settings.StartMinimized = false;
            _settings.SaveSettings();
            
            // Se já está configurado para iniciar com Windows, atualizar o registro automaticamente
            if (CheckStartWithWindows.IsChecked == true)
            {
                try
                {
                    await Task.Run(() => _startupManager.SetStartup(true, false));
                }
                catch
                {
                    // Ignorar erros silenciosamente
                }
            }
        }

        private void CheckDesktopContextMenu_Checked(object sender, RoutedEventArgs e)
        {
            if (_isLoading) return;
            _settings.Settings.EnableDesktopContextMenu = true;
            _settings.SaveSettings();
            try { (Application.Current as App)?.RegistrarMenuDesktopContext(); } catch { }
        }

        private void CheckDesktopContextMenu_Unchecked(object sender, RoutedEventArgs e)
        {
            if (_isLoading) return;
            _settings.Settings.EnableDesktopContextMenu = false;
            _settings.SaveSettings();
            try { (Application.Current as App)?.RemoverMenuDesktopContext(); } catch { }
        }

        

        private void ShowOnboardingButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var onboardingService = new OnboardingService();
                
                // Perguntar se quer ver agora ou na próxima inicialização
                var result = ModernMessageBox.Show(
                    "Como deseja ver o tutorial?\n\n" +
                    "• Agora: O tutorial será exibido imediatamente\n" +
                    "• Na próxima inicialização: O tutorial aparecerá quando você abrir o programa novamente",
                    "Ver Tutorial",
                    MessageBoxButton.YesNoCancel,
                    MessageBoxImage.Question
                );

                if (result == MessageBoxResult.Yes)
                {
                    // Mostrar agora
                    onboardingService.ResetOnboarding();
                    
                    if (Application.Current.MainWindow is MainWindow mainWindow)
                    {
                        var onboardingView = new OnboardingView();
                        onboardingView.OnboardingCompleted += (s, args) =>
                        {
                            // Após tutorial, ir para o Questionário
                            var contentFrame = mainWindow.FindName("ContentFrame") as ContentControl;
                            if (contentFrame != null)
                            {
                                contentFrame.Content = new VoltrisOptimizer.Core.SystemIntelligenceProfiler.UI.Views.ProfilerQuestionnaireView();
                            }
                        };
                        
                        // Encontrar o ContentFrame e substituir o conteúdo
                        var contentFrame = mainWindow.FindName("ContentFrame") as ContentControl;
                        if (contentFrame != null)
                        {
                            contentFrame.Content = onboardingView;
                        }
                    }
                }
                else if (result == MessageBoxResult.No)
                {
                    // Resetar para próxima inicialização
                    onboardingService.ResetOnboarding();
                    
                    _dialogs?.ShowInfo("Tutorial Reativado", "O tutorial será exibido na próxima vez que você abrir o programa.");
                }
            }
            catch (Exception ex)
            {
                _dialogs?.ShowError("Erro", $"Erro ao reativar tutorial: {ex.Message}");
            }
        }


        



        private void CheckDryRun_Checked(object sender, RoutedEventArgs e)
        {
            if (_isLoading) return;
            try
            {
                var extreme = App.ExtremeOptimizations;
                if (extreme == null) return;
                extreme.DryRun = true;
                _dialogs?.ShowInfo("Dry-Run Ativado", "Alterações não serão aplicadas. Apenas simulação/logs.");
            }
            catch (Exception ex)
            {
                _dialogs?.ShowError("Erro", $"Erro ao ativar Dry-Run: {ex.Message}");
            }
        }

        private void CheckDryRun_Unchecked(object sender, RoutedEventArgs e)
        {
            if (_isLoading) return;
            try
            {
                var confirm = ModernMessageBox.Show(
                    "Desativar Dry-Run aplicará mudanças reais no sistema. Confirmar?",
                    "Confirmar Alterações Reais",
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Warning);
                if (confirm != MessageBoxResult.Yes)
                {
                    CheckDryRun.IsChecked = true;
                    return;
                }
                var extreme = App.ExtremeOptimizations;
                if (extreme == null) return;
                extreme.DryRun = false;
                _dialogs?.ShowInfo("Dry-Run Desativado", "O sistema aplicará alterações reais ao otimizar.");
            }
            catch (Exception ex)
            {
                _dialogs?.ShowError("Erro", $"Erro ao desativar Dry-Run: {ex.Message}");
                CheckDryRun.IsChecked = true;
            }
        }

        private void CheckAllowWatchdog_Checked(object sender, RoutedEventArgs e)
        {
            if (_isLoading) return;
            try
            {
                _settings.Settings.AllowBackgroundDpcWatchdog = true;
                _settings.SaveSettings();
                
                var extreme = App.ExtremeOptimizations;
                if (extreme != null)
                {
                    extreme.AllowBackgroundWatchdog = true;
                    extreme.StartDpcWatchdog();
                }
            }
            catch { }
        }

        private void CheckAllowWatchdog_Unchecked(object sender, RoutedEventArgs e)
        {
            if (_isLoading) return;
            try
            {
                _settings.Settings.AllowBackgroundDpcWatchdog = false;
                _settings.SaveSettings();
                
                var extreme = App.ExtremeOptimizations;
                if (extreme != null)
                {
                    extreme.AllowBackgroundWatchdog = false;
                    extreme.StopDpcWatchdog();
                }
            }
            catch { }
        }


        
        // ============================================
        // ATUALIZAÇÕES
        // ============================================
        
        private void UpdateVersionInfo()
        {
            try
            {
                var currentVersion = UpdateService.GetCurrentVersion();
                CurrentVersionText.Text = $"Versão atual: {currentVersion}";
                UpdateStatusText.Text = "Clique para verificar atualizações";
            }
            catch (Exception ex)
            {
                CurrentVersionText.Text = "Versão atual: Erro ao obter";
                UpdateStatusText.Text = $"Erro: {ex.Message}";
            }
        }
        
        private async void CheckUpdatesButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                // Desabilitar botão durante verificação
                CheckUpdatesButton.IsEnabled = false;
                CheckUpdatesButton.Content = "🔄 Verificando...";
                UpdateStatusText.Text = "Verificando atualizações...";
                
                // Verificar atualizações
                var updateInfo = await UpdateService.CheckForUpdatesAsync();
                
                if (updateInfo != null)
                {
                    UpdateStatusText.Text = $"Nova versão disponível: {updateInfo.LatestVersion}";
                    
                    // Mostrar janela de atualização
                    var updateWindow = new UpdateWindow(updateInfo);
                    updateWindow.Owner = Application.Current.MainWindow;
                    updateWindow.ShowDialog();
                }
                else
                {
                    UpdateStatusText.Text = "Você está usando a versão mais recente!";
                    // Não mostrar diálogo automático, apenas atualizar o texto
                    // _dialogs?.ShowInfo("Atualizado", $"Você já está usando a versão mais recente ({UpdateService.GetCurrentVersion()}).");
                }
            }
            catch (Exception ex)
            {
                _dialogs?.ShowError("Erro", $"Erro ao verificar atualizações: {ex.Message}");
                UpdateStatusText.Text = $"Erro: {ex.Message}";
            }
            finally
            {
                // Restaurar botão
                CheckUpdatesButton.IsEnabled = true;
                CheckUpdatesButton.Content = "🔍 Verificar Atualizações";
            }
        }

        private async void CheckEnableDls_Checked(object sender, RoutedEventArgs e)
        {
            if (_isLoading) return;
            _settings.Settings.EnableDynamicLoadStabilizer = true;
            _settings.SaveSettings();
            try
            {
                var dls = App.Services?.GetService<IDynamicLoadStabilizer>();
                if (dls != null)
                {
                    dls.Enabled = true;
                    dls.SetProfile(_settings.Settings.IntelligentProfile);
                    await dls.StartGlobalAsync();
                    _logger?.LogSuccess("[Settings] Stability Agent ATIVADO.");
                }
            }
            catch { }
        }

        private async void CheckEnableDls_Unchecked(object sender, RoutedEventArgs e)
        {
            if (_isLoading) return;
            _settings.Settings.EnableDynamicLoadStabilizer = false;
            _settings.SaveSettings();
            try
            {
                var dls = App.Services?.GetService<IDynamicLoadStabilizer>();
                if (dls != null)
                {
                    dls.Enabled = false;
                    await dls.StopAsync();
                    _logger?.LogInfo("[Settings] Stability Agent DESATIVADO.");
                }
            }
            catch { }
        }

        private void RefreshProcessList()
        {
            try
            {
                DlsProcessCombo.Items.Clear();
                foreach (var p in System.Diagnostics.Process.GetProcesses())
                {
                    try
                    {
                        if (p.MainWindowHandle != IntPtr.Zero)
                        {
                            DlsProcessCombo.Items.Add(p.ProcessName);
                        }
                    }
                    catch { }
                }
                var manual = _settings.Settings.DlsManualGameProcess;
                if (!string.IsNullOrEmpty(manual)) DlsProcessCombo.Text = manual;
            }
            catch { }
        }

        private async void DlsSetGameButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var sel = DlsProcessCombo.Text?.Trim();
                App.LoggingService?.LogInfo($"[DSL-UI] Botão 'Definir Foco' clicado. Processo selecionado: '{sel}'");
                
                if (string.IsNullOrWhiteSpace(sel))
                {
                    App.LoggingService?.LogWarning("[DSL-UI] Nenhum processo selecionado no combo.");
                    return;
                }
                
                // Salvar nas configurações
                _settings.Settings.DlsManualGameProcess = sel;
                _settings.SaveSettings();
                App.LoggingService?.LogInfo($"[DSL-UI] Processo '{sel}' salvo nas configurações.");
                
                // Encontrar o PID do processo pelo nome
                var dls = App.Services?.GetService<VoltrisOptimizer.Services.Optimization.IDynamicLoadStabilizer>();
                if (dls == null)
                {
                    App.LoggingService?.LogWarning("[DSL-UI] IDynamicLoadStabilizer não disponível no ServiceProvider.");
                    return;
                }
                
                int? targetPid = null;
                try
                {
                    var processes = System.Diagnostics.Process.GetProcessesByName(sel);
                    if (processes.Length > 0)
                    {
                        targetPid = processes[0].Id;
                        App.LoggingService?.LogInfo($"[DSL-UI] Processo '{sel}' encontrado com PID: {targetPid}");
                        // Dispose dos objetos Process extras
                        foreach (var p in processes) p.Dispose();
                    }
                    else
                    {
                        App.LoggingService?.LogWarning($"[DSL-UI] Processo '{sel}' não encontrado em execução. Tentando definir foco mesmo assim.");
                    }
                }
                catch (Exception ex)
                {
                    App.LoggingService?.LogWarning($"[DSL-UI] Erro ao buscar PID de '{sel}': {ex.Message}");
                }
                
                // Chamar StartAsync com o PID — funciona independente do Gamer Mode
                // Se o DSL já está rodando, ele reorienta para o novo PID
                App.LoggingService?.LogInfo($"[DSL-UI] Chamando dls.StartAsync(PID={targetPid}) para foco em '{sel}'...");
                await dls.StartAsync(targetPid);
                App.LoggingService?.LogSuccess($"[DSL-UI] Foco definido com sucesso para '{sel}' (PID={targetPid}).");
                
                // Atualizar a lista de processos otimizados na UI
                Dispatcher.Invoke(() =>
                {
                    try
                    {
                        // Adicionar o processo focado na lista visual
                        if (DlsOptimizedList != null && targetPid.HasValue)
                        {
                            // Verificar se já não está na lista
                            bool alreadyInList = false;
                            foreach (var item in DlsOptimizedList.Items)
                            {
                                if (item is DslOptimizedItem existing && existing.ProcessName == sel)
                                {
                                    alreadyInList = true;
                                    break;
                                }
                            }
                            if (!alreadyInList)
                            {
                                DlsOptimizedList.Items.Insert(0, new DslOptimizedItem 
                                { 
                                    ProcessName = $"{sel} (PID {targetPid})", 
                                    Status = "EM FOCO" 
                                });
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        App.LoggingService?.LogWarning($"[DSL-UI] Erro ao atualizar lista visual: {ex.Message}");
                    }
                });
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[DSL-UI] Erro ao definir foco: {ex.Message}", ex);
            }
        }

        private void SupportButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var url = "https://wa.me/5511996716235";
                var psi = new System.Diagnostics.ProcessStartInfo
                {
                    FileName = url,
                    UseShellExecute = true
                };
                System.Diagnostics.Process.Start(psi);
            }
            catch (Exception ex)
            {
                _dialogs?.ShowError("Erro", $"Não foi possível abrir o link: {ex.Message}");
            }
        }

        private void DlsTutorialButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var tutorial = new DlsTutorialPage();
                tutorial.Owner = Window.GetWindow(this);
                tutorial.ShowDialog();
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Erro ao abrir tutorial DLS: {ex.Message}");
            }
        }

        private async void UnlinkDevice_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                // Mostrar diálogo de confirmação
                var result = ModernMessageBox.Show(
                    "Tem certeza que deseja desvincular este dispositivo da sua conta Voltris Cloud?\n\n" +
                    "Você perderá:\n" +
                    "• Sincronização de configurações\n" +
                    "• Gerenciamento remoto\n" +
                    "• Backup na nuvem\n\n" +
                    "Você pode vincular novamente a qualquer momento.",
                    "Confirmar Desvinculação",
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Warning
                );

                if (result != MessageBoxResult.Yes)
                    return;

                // Desabilitar botão durante o processo
                if (UnlinkButton != null)
                    UnlinkButton.IsEnabled = false;

                // Chamar API para desvincular
                await VoltrisOptimizer.Services.Enterprise.EnterpriseService.Instance.UnlinkThisDeviceAsync();

                // Limpar configurações locais
                _settings.Settings.IsDeviceLinked = false;
                _settings.Settings.LinkedUserEmail = null;
                _settings.SaveSettings();

                // Atualizar UI em tempo real
                await Dispatcher.InvokeAsync(() =>
                {
                    AccountSection.Visibility = Visibility.Collapsed;
                    LinkAccountSection.Visibility = Visibility.Visible;
                });

                // Mostrar mensagem de sucesso
                ModernMessageBox.Show(
                    "Seu dispositivo foi desvinculado da conta Voltris Cloud.",
                    "Desvinculado com Sucesso",
                    MessageBoxButton.OK,
                    MessageBoxImage.Information
                );

                _logger?.Log(LogLevel.Info, LogCategory.System, "Dispositivo desvinculado com sucesso");
            }
            catch (Exception ex)
            {
                _logger?.Log(LogLevel.Error, LogCategory.System, $"Erro ao desvincular dispositivo: {ex.Message}");
                
                ModernMessageBox.Show(
                    $"Ocorreu um erro ao desvincular o dispositivo:\n{ex.Message}\n\nTente novamente mais tarde.",
                    "Erro ao Desvincular",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error
                );
            }
            finally
            {
                // Reabilitar botão
                if (UnlinkButton != null)
                    UnlinkButton.IsEnabled = true;
            }
        }

        private void LinkAccount_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                // Abrir o Welcome Window para o usuário vincular a conta
                var welcomeWindow = new WelcomeLinkWindow();
                welcomeWindow.Owner = Window.GetWindow(this);
                welcomeWindow.WindowStartupLocation = WindowStartupLocation.CenterOwner;
                welcomeWindow.ShowDialog();
                
                // Atualizar status após fechar o Welcome
                _ = UpdateAccountStatusAsync();
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Erro ao abrir janela de vinculação: {ex.Message}", "Erro", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        private async Task UpdateAccountStatusAsync()
        {
            try
            {
                var email = await VoltrisOptimizer.Services.Enterprise.EnterpriseService.Instance.GetLinkingStatusAsync();
                bool isLinked = !string.IsNullOrEmpty(email);

                await Dispatcher.InvokeAsync(() =>
                {
                    if (isLinked)
                    {
                        AccountSection.Visibility = Visibility.Visible;
                        LinkAccountSection.Visibility = Visibility.Collapsed;
                        AccountEmailText.Text = $"Vinculado a: {email}";
                        
                        // Salvar email nas configurações se mudou
                        if (_settings.Settings.LinkedUserEmail != email)
                        {
                            _settings.Settings.LinkedUserEmail = email;
                            _settings.SaveSettings();
                        }
                    }
                    else
                    {
                        AccountSection.Visibility = Visibility.Collapsed;
                        LinkAccountSection.Visibility = Visibility.Visible;
                        
                        if (_settings.Settings.LinkedUserEmail != null)
                        {
                            _settings.Settings.LinkedUserEmail = null;
                            _settings.SaveSettings();
                        }
                    }
                });
            }
            catch { }
        }
        private void RestartAsAdmin_Click(object sender, RoutedEventArgs e)
        {
            if (IsRunningAsAdministrator())
            {
                _dialogs?.ShowInfo("Já Elevado", "O aplicativo já está rodando com privilégios de administrador.");
                return;
            }

            var result = ModernMessageBox.Show(
                "Algumas otimizações profundas exigem permissões administrativas.\n\n" +
                "O aplicativo será reiniciado e o Windows solicitará permissão (UAC).\n" +
                "Deseja continuar?",
                "Modo Administrador",
                MessageBoxButton.YesNo,
                MessageBoxImage.Question); // Usando Question pois Shield pode não existir no enum do ModernMessageBox

            if (result == MessageBoxResult.Yes)
            {
                try
                {
                    var exeName = System.Diagnostics.Process.GetCurrentProcess().MainModule?.FileName ?? "VoltrisOptimizer.exe";
                    var startInfo = new System.Diagnostics.ProcessStartInfo
                    {
                        FileName = exeName,
                        UseShellExecute = true,
                        Verb = "runas" 
                    };

                    System.Diagnostics.Process.Start(startInfo);
                    Application.Current.Shutdown();
                }
                catch (Win32Exception)
                {
                    // Usuário cancelou o UAC ou erro de permissão do Windows
                    // Não fazer nada, apenas logar se possível
                    try { 
                        var logDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                        if (!Directory.Exists(logDir)) Directory.CreateDirectory(logDir);
                        File.AppendAllText(Path.Combine(logDir, "admin_elevation.log"), $"[{DateTime.Now}] UAC Cancelado pelo usuário.\n");
                    } catch { }
                }
                catch (Exception ex)
                {
                    _dialogs?.ShowError("Erro", $"Não foi possível reiniciar como administrador.\n\n{ex.Message}");
                }
            }
        }

        public static bool IsRunningAsAdministrator()
        {
            try
            {
                using (var identity = WindowsIdentity.GetCurrent())
                {
                    var principal = new WindowsPrincipal(identity);
                    return principal.IsInRole(WindowsBuiltInRole.Administrator);
                }
            }
            catch
            {
                return false;
            }
        }

        private void TransparencyToggle_Checked(object sender, RoutedEventArgs e)
        {
            if (_isLoading) return;
            
            try
            {
                ApplyTransparency(true);
                _settings.Settings.EnableTransparency = true;
                _settings.SaveSettings();
                
                // Atualizar ícones do header em tempo real
                SyncHeaderIcons();
                
                App.TelemetryService?.TrackEvent("SETTINGS_TRANSPARENCY_TOGGLE", "Settings", "Change", metadata: new { Enabled = true });
            }
            catch (Exception ex)
            {
                _logger?.Log(LogLevel.Error, LogCategory.System, $"Erro ao ativar transparência: {ex.Message}");
            }
        }

        private void TransparencyToggle_Unchecked(object sender, RoutedEventArgs e)
        {
            if (_isLoading) return;
            
            try
            {
                ApplyTransparency(false);
                _settings.Settings.EnableTransparency = false;
                _settings.SaveSettings();
                
                // Atualizar ícones do header em tempo real
                SyncHeaderIcons();
                
                App.TelemetryService?.TrackEvent("SETTINGS_TRANSPARENCY_TOGGLE", "Settings", "Change", metadata: new { Enabled = false });
            }
            catch (Exception ex)
            {
                _logger?.Log(LogLevel.Error, LogCategory.System, $"Erro ao desativar transparência: {ex.Message}");
            }
        }

        // ============================================
        // NOTIFICAÇÕES
        // ============================================

        private void CheckNotificationsEnabled_Checked(object sender, RoutedEventArgs e)
        {
            if (_isLoading) return;
            _settings.Settings.NotificationsEnabled = true;
            _settings.SaveSettings();
            
            // Habilitar sub-opções
            if (CheckNotifyThreats != null) CheckNotifyThreats.IsEnabled = true;
            if (CheckNotifyScanComplete != null) CheckNotifyScanComplete.IsEnabled = true;
            if (CheckNotifyNewDevice != null) CheckNotifyNewDevice.IsEnabled = true;
        }

        private void CheckNotificationsEnabled_Unchecked(object sender, RoutedEventArgs e)
        {
            if (_isLoading) return;
            _settings.Settings.NotificationsEnabled = false;
            _settings.SaveSettings();
            
            // Desabilitar sub-opções visualmente
            if (CheckNotifyThreats != null) CheckNotifyThreats.IsEnabled = false;
            if (CheckNotifyScanComplete != null) CheckNotifyScanComplete.IsEnabled = false;
            if (CheckNotifyNewDevice != null) CheckNotifyNewDevice.IsEnabled = false;
        }

        private void CheckNotifyThreats_Changed(object sender, RoutedEventArgs e)
        {
            if (_isLoading) return;
            _settings.Settings.NotifyOnThreatDetected = CheckNotifyThreats?.IsChecked ?? true;
            _settings.SaveSettings();
        }

        private void CheckNotifyScanComplete_Changed(object sender, RoutedEventArgs e)
        {
            if (_isLoading) return;
            _settings.Settings.NotifyOnScanComplete = CheckNotifyScanComplete?.IsChecked ?? true;
            _settings.SaveSettings();
        }

        private void CheckNotifyNewDevice_Changed(object sender, RoutedEventArgs e)
        {
            if (_isLoading) return;
            _settings.Settings.NotifyOnNewDevice = CheckNotifyNewDevice?.IsChecked ?? true;
            _settings.SaveSettings();
        }

        /// <summary>
        /// Sincroniza os ícones do header da MainWindow com o estado atual das configurações.
        /// Chamado quando tema ou transparência são alterados pela SettingsView.
        /// </summary>
        private void SyncHeaderIcons()
        {
            try
            {
                if (Application.Current.MainWindow is MainWindow mainWindow)
                {
                    var isLight = _settings.Settings.Theme?.Equals("Light", StringComparison.OrdinalIgnoreCase) == true;
                    var transparency = _settings.Settings.EnableTransparency;
                    mainWindow.SyncHeaderToggleIcons(isLight, transparency);
                }
            }
            catch { }
        }

        /// <summary>
        /// Atualiza os controles da SettingsView para refletir o estado atual das configurações.
        /// Chamado pela MainWindow quando tema/transparência são alterados pelo header.
        /// </summary>
        public void SyncFromSettings()
        {
            try
            {
                _isLoading = true;
                
                // Sincronizar ThemeCombo
                if (ThemeCombo != null)
                {
                    var isLight = _settings.Settings.Theme?.Equals("Light", StringComparison.OrdinalIgnoreCase) == true;
                    ThemeCombo.SelectedIndex = isLight ? 1 : 0;
                }
                
                // Sincronizar TransparencyToggle
                if (TransparencyToggle != null)
                {
                    TransparencyToggle.IsChecked = _settings.Settings.EnableTransparency;
                }
                
                _isLoading = false;
            }
            catch
            {
                _isLoading = false;
            }
        }

        private void ApplyTransparency(bool enabled)
        {
            try
            {
                ApplyThemeAndTransparency(_settings.Settings.Theme, enabled);
                _logger?.Log(LogLevel.Info, LogCategory.System, $"Transparência {(enabled ? "ativada" : "desativada")} com sucesso");
            }
            catch (Exception ex)
            {
                _logger?.Log(LogLevel.Error, LogCategory.System, $"Erro ao aplicar transparência: {ex.Message}");
                throw;
            }
        }

        private void ApplyThemeAndTransparency(string? theme, bool transparency)
        {
            var dicts = Application.Current.Resources.MergedDictionaries;

            // Remover tema e transparência existentes
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

            // 3. Backdrop DWM
            if (Application.Current.MainWindow is VoltrisOptimizer.UI.MainWindow mainWindow)
                mainWindow.ApplyWindowTransparency(transparency);
        }

    }
    
    /// <summary>
    /// Item de dados para a lista de processos otimizados pelo DSL.
    /// </summary>
    public class DslOptimizedItem
    {
        public string ProcessName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }
}
