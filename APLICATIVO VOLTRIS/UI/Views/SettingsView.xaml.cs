using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using VoltrisOptimizer.Core.Updater;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.UI.Controls;
using VoltrisOptimizer.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using VoltrisOptimizer.Services.Optimization;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using Language = VoltrisOptimizer.Services.Language;

namespace VoltrisOptimizer.UI.Views
{
    public partial class SettingsView : UserControl
    {
        private readonly LocalizationService _localization;
        private readonly SettingsService _settings;
        private readonly StartupManager _startup;
        private readonly IDialogService? _dialogs;

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

        

        private bool _isLoading = true; // Flag para evitar disparar eventos durante carregamento
        
        public SettingsView()
        {
            InitializeComponent();
            _localization = LocalizationService.Instance;
            _settings = SettingsService.Instance;
            _startup = new StartupManager();
            try { _dialogs = VoltrisOptimizer.App.Services?.GetService<IDialogService>(); } catch { }
            
            DataContext = this;
            
            // Carregar estado atual SEM disparar eventos
            _isLoading = true;
            Loaded += async (s, e) =>
            {
                try
                {
                    var enabled = await _startup.IsEnabledAsync();
                    _isLoading = true;
                    CheckStartWithWindows.IsChecked = enabled;
                    _settings.Settings.StartWithWindows = enabled;
                    _settings.SaveSettings();
                }
                finally
                {
                    _isLoading = false;
                }
            };
            CheckStartMinimized.IsChecked = _settings.Settings.StartMinimized;
            CheckMinimizeToTray.IsChecked = _settings.Settings.MinimizeToTray;
            CheckCloseToTray.IsChecked = _settings.Settings.CloseToTray;
            
            try
            {
                var extreme = App.ExtremeOptimizations;
                if (extreme != null)
                {
                    CheckDryRun.IsChecked = extreme.DryRun;
                    // Carregar estado do DPC Watchdog das configurações ou padrão
                    CheckAllowWatchdog.IsChecked = extreme.AllowBackgroundWatchdog;
                }
                
                // Carregar estado do DLS das configurações
                CheckEnableDls.IsChecked = _settings.Settings.EnableDynamicLoadStabilizer;
            }
            catch { }
            
            _isLoading = false;
            
            // Configurar idioma
            UpdateLanguageRadioButtons();
            UpdateAllTexts();
            
            
            _localization.LanguageChanged += (s, e) => UpdateAllTexts();
            
            // Atualizar status do trial
            Loaded += (s, e) => 
            {
                UpdateVersionInfo();
            };

            // Selecionar tema atual
            try
            {
                _isLoading = true;
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
                // Verificar também nas configurações salvas
                if (!hasLight && _settings.Settings.Theme == "Light")
                {
                    hasLight = true;
                }
                ThemeCombo.SelectedIndex = hasLight ? 1 : 0;
            }
            catch { }
            finally { _isLoading = false; }

            try
            {
                var dls = VoltrisOptimizer.App.Services?.GetService<VoltrisOptimizer.Services.Optimization.IDynamicLoadStabilizer>();
                // Garantir que DLS venha marcado por padrão
                var settingsEnabled = _settings.Settings.EnableDynamicLoadStabilizer;
                if (!settingsEnabled)
                {
                    _settings.Settings.EnableDynamicLoadStabilizer = true;
                    _settings.SaveSettings();
                    settingsEnabled = true;
                }
                CheckEnableDls.IsChecked = settingsEnabled;
                if (dls != null)
                {
                    dls.OnProcessThrottled += (s, e) => Dispatcher.Invoke(() => { try { DlsOptimizedList.Items.Add($"{e.ProcessName} ({e.ProcessId})"); } catch { } });
                    dls.OnProcessReleased += (s, e) => Dispatcher.Invoke(() =>
                    {
                        try
                        {
                            for (int i = DlsOptimizedList.Items.Count - 1; i >= 0; i--)
                            {
                                var item = DlsOptimizedList.Items[i]?.ToString() ?? string.Empty;
                                if (item.Contains($"({e.ProcessId})")) DlsOptimizedList.Items.RemoveAt(i);
                            }
                        }
                        catch { }
                    });
                    Dispatcher.InvokeAsync(() => RefreshProcessList());
                }
            }
            catch { }
        }

        

        private void UpdateLanguageRadioButtons()
        {
            var currentLang = _settings.Settings.Language;
            RadioPortuguese.IsChecked = currentLang == VoltrisOptimizer.Services.Language.Portuguese;
            RadioSpanish.IsChecked = currentLang == VoltrisOptimizer.Services.Language.Spanish;
            RadioEnglish.IsChecked = currentLang == VoltrisOptimizer.Services.Language.English;
        }

        private void UpdateAllTexts()
        {
            // Atualizar textos dos radio buttons
            RadioPortuguese.Content = _localization.GetString("Portuguese");
            RadioSpanish.Content = _localization.GetString("Spanish");
            RadioEnglish.Content = _localization.GetString("English");
            
            // Atualizar outros textos via binding
            DataContext = null;
            DataContext = this;
        }

        private void RadioPortuguese_Checked(object sender, RoutedEventArgs e)
        {
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
            if (RadioEnglish.IsChecked == true)
            {
                _settings.Settings.Language = VoltrisOptimizer.Services.Language.English;
                _localization.SetLanguage(VoltrisOptimizer.Services.Language.English);
                _settings.SaveSettings();
                UpdateAllTexts();
            }
        }

        private void ThemeCombo_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (_isLoading) return;
            try
            {
                var selected = (ThemeCombo.SelectedItem as ComboBoxItem)?.Content?.ToString() ?? "Dark";
                var isLight = selected.Contains("Light", StringComparison.OrdinalIgnoreCase);
                
                var dicts = Application.Current.Resources.MergedDictionaries;
                for (int i = 0; i < dicts.Count; i++)
                {
                    var src = dicts[i].Source?.ToString() ?? string.Empty;
                    if (src.EndsWith("DarkTheme.xaml", StringComparison.OrdinalIgnoreCase) || 
                        src.EndsWith("LightTheme.xaml", StringComparison.OrdinalIgnoreCase))
                    {
                        dicts.RemoveAt(i);
                        i--;
                    }
                }

                var uri = isLight
                    ? new Uri("/UI/Themes/LightTheme.xaml", UriKind.Relative)
                    : new Uri("/UI/Themes/DarkTheme.xaml", UriKind.Relative);
                dicts.Add(new ResourceDictionary { Source = uri });
                
                // Salvar preferência de tema
                _settings.Settings.Theme = isLight ? "Light" : "Dark";
                _settings.SaveSettings();
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
                await _startup.EnableStartupAsync(startMinimized);
                _settings.Settings.StartWithWindows = true;
                _settings.Settings.StartMinimized = startMinimized;
                _settings.SaveSettings();
                
                // Executar diagnóstico após configurar
                try
                {
                    VoltrisOptimizer.Utils.StartupDiagnostic.RunDiagnostic();
                }
                catch { }
            }
            catch (Exception ex)
            {
                // Em caso de erro, desmarcar silenciosamente
                CheckStartWithWindows.IsChecked = false;
                // Logar erro para debug (sem mostrar ao usuário)
                try
                {
                    var logDir = System.IO.Path.Combine(System.AppContext.BaseDirectory, "Logs");
                    if (!System.IO.Directory.Exists(logDir))
                        System.IO.Directory.CreateDirectory(logDir);
                    System.IO.File.AppendAllText(
                        System.IO.Path.Combine(logDir, "startup_error.log"),
                        $"[{DateTime.Now}] Erro ao configurar startup: {ex.Message}\n{ex.StackTrace}\n\n"
                    );
                }
                catch { }
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
                await _startup.DisableStartupAsync();
                _settings.Settings.StartWithWindows = false;
                _settings.SaveSettings();
            }
            catch (Exception ex)
            {
                _dialogs?.ShowError("Erro", $"Erro ao desabilitar inicialização: {ex.Message}");
                CheckStartWithWindows.IsChecked = true;
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
                    await _startup.EnableStartupAsync(true);
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
                    await _startup.EnableStartupAsync(false);
                }
                catch
                {
                    // Ignorar erros silenciosamente
                }
            }
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
                var orchestrator = VoltrisOptimizer.App.Services?.GetService<IGamerModeOrchestrator>();
                var dls = VoltrisOptimizer.App.Services?.GetService<IDynamicLoadStabilizer>();
                if (orchestrator != null && dls != null && !orchestrator.IsActive)
                {
                    dls.Enabled = true;
                    await dls.StartAsync(null);
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
                var orchestrator = VoltrisOptimizer.App.Services?.GetService<IGamerModeOrchestrator>();
                var dls = VoltrisOptimizer.App.Services?.GetService<IDynamicLoadStabilizer>();
                if (orchestrator != null && dls != null && !orchestrator.IsActive)
                {
                    dls.Enabled = false;
                    await dls.StopAsync();
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
                var sel = DlsProcessCombo.Text;
                if (!string.IsNullOrWhiteSpace(sel))
                {
                    _settings.Settings.DlsManualGameProcess = sel;
                    _settings.SaveSettings();
                    var orchestrator = VoltrisOptimizer.App.Services?.GetService<VoltrisOptimizer.Services.Gamer.Interfaces.IGamerModeOrchestrator>();
                    var dls = VoltrisOptimizer.App.Services?.GetService<VoltrisOptimizer.Services.Optimization.IDynamicLoadStabilizer>();
                    if (orchestrator != null && dls != null && orchestrator.IsActive)
                    {
                        await dls.StartAsync(null);
                    }
                }
            }
            catch { }
        }

    }
}
