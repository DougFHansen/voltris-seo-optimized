using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Interop;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.UI.Controls;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Core;
using Microsoft.Extensions.DependencyInjection;
using VoltrisOptimizer.Utils;
using VoltrisOptimizer.Services.Gamer;
using VoltrisOptimizer.Services.Gamer.Intelligence;
using VoltrisOptimizer.Services.Gamer.GamerModeManager;
using VoltrisOptimizer.Services.Optimization.AMPO;
using VoltrisOptimizer.Services.License;
using VoltrisOptimizer.Core.Updater;
using VoltrisOptimizer.UI.Views;
using Microsoft.Toolkit.Uwp.Notifications;
using Microsoft.Extensions.Configuration;
using VoltrisOptimizer.Core.Intelligence;

namespace VoltrisOptimizer
{
    /// <summary>
    /// Interaction logic for App.xaml
    /// </summary>
    public partial class App : Application
    {
        private Services.ILoggingService? _loggingService;
        private Microsoft.Extensions.DependencyInjection.ServiceProvider? _serviceProvider;
        public static Microsoft.Extensions.DependencyInjection.ServiceProvider? Services { get; private set; }
        private static Mutex? _mutex;
        private const string MutexName = "Global\\VoltrisOptimizer_SingleInstance_Mutex";
        
        // Serviços estáticos para acesso global
        public static Services.ILoggingService? LoggingService { get; private set; }
        public static SystemCleaner? SystemCleaner { get; private set; }
        public static PerformanceOptimizer? PerformanceOptimizer { get; private set; }
        public static Services.UltraCleanerService? UltraCleaner { get; private set; }
        public static Services.UltraPerformanceService? UltraPerformance { get; private set; }
        public static NetworkOptimizer? NetworkOptimizer { get; private set; }
        public static HistoryService? HistoryService { get; private set; }
        public static SchedulerService? SchedulerService { get; private set; }
        public static AdvancedOptimizer? AdvancedOptimizer { get; private set; }
        public static ExtremeOptimizationsService? ExtremeOptimizations { get; private set; }
        public static GamerOptimizerService? GamerOptimizer { get; private set; }
        public static AIOptimizerService? AIOptimizer { get; private set; }
        public static Services.GameDetectionService? GameDetectionService { get; private set; }
        public static Core.SystemIntelligenceProfiler.SystemIntelligenceProfiler? SystemProfiler { get; private set; }
        public static GameDiagnosticsService? GameDiagnostics { get; private set; }
        public static VoltrisOptimizer.Services.Gamer.Overlay.Interfaces.IOverlayService? OverlayService { get; private set; }
        public static VoltrisOptimizer.Services.Gamer.Diagnostics.Interfaces.IGamerSelfProfiler? GamerSelfProfiler { get; private set; }
        
        /// <summary>
        /// Referência global ao Voltris Intelligence Framework
        /// </summary>
        public static VoltrisOptimizer.Core.Intelligence.IVoltrisIntelligenceOrchestrator? VoltrisIntelligence { get; set; }

        // Win32 API para trazer janela ao primeiro plano
        [DllImport("user32.dll")]
        private static extern bool ShowWindowAsync(IntPtr hWnd, int nCmdShow);

        [DllImport("user32.dll")]
        private static extern bool SetForegroundWindow(IntPtr hWnd);

        [DllImport("user32.dll")]
        private static extern bool IsIconic(IntPtr hWnd);

        [DllImport("user32.dll")]
        private static extern IntPtr FindWindow(string? lpClassName, string? lpWindowName);

        [DllImport("user32.dll", SetLastError = true)]
        private static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

        [DllImport("kernel32.dll")]
        private static extern uint GetCurrentThreadId();

        [DllImport("user32.dll")]
        private static extern bool AttachThreadInput(uint idAttach, uint idAttachTo, bool fAttach);

        private const int SW_RESTORE = 9;
        private const int SW_SHOW = 5;

        // Win32 API para forçar DPI Awareness
        [DllImport("user32.dll", SetLastError = true)]
        private static extern bool SetProcessDpiAwarenessContext(IntPtr dpiFlag);
        
        private static readonly IntPtr DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2 = new IntPtr(-4);
        
        public App()
        {
            // Forçar DPI Awareness ANTES de qualquer inicialização
            try
            {
                SetProcessDpiAwarenessContext(DPI_AWARENESS_CONTEXT_PER_MONITOR_AWARE_V2);
            }
            catch
            {
                // Fallback: manifest já configura DPI
            }
        }

        protected override async void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e); // IMPORTANTE: Inicializar base primeiro para carregar recursos do XAML
            ToastNotificationManagerCompat.OnActivated += args => { LoggingService?.LogInfo("Toast ativado"); };
            
            // Carregar tema salvo nas configurações
            LoadSavedTheme();
            
            // ============================================================
            // VERIFICAÇÃO DE INSTÂNCIA ÚNICA (SINGLE INSTANCE) - MUTEX
            // ============================================================
            bool isNewInstance;
            try
            {
                // Tentar criar um Mutex global
                // O prefixo "Global\\" garante que o Mutex seja acessível mesmo em sessões diferentes
                _mutex = new Mutex(true, MutexName, out isNewInstance);
                
                if (!isNewInstance)
                {
                    // Outra instância já está em execução
                    try
                    {
                        // Logar tentativa de segunda instância (se possível)
                        var logDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                        if (!Directory.Exists(logDir))
                            Directory.CreateDirectory(logDir);
                        var immediateLog = Path.Combine(logDir, "immediate_startup.log");
                        File.AppendAllText(immediateLog, 
                            $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] Tentativa de iniciar segunda instância detectada. Fechando...\n\n");
                    }
                    catch { }

                    // Procurar e ativar a janela principal da instância existente
                    ActivateExistingInstance();

                    // Exibir mensagem moderna ao usuário usando ModernMessageBox
                    // Os recursos do WPF já foram carregados com base.OnStartup(e)
                    try
                    {
                        // Verificar se os recursos necessários estão disponíveis
                        var darkPanel = Application.Current.TryFindResource("DarkPanelBrush");
                        if (darkPanel == null)
                        {
                            throw new InvalidOperationException("Recursos do WPF não estão disponíveis. Usando MessageBox padrão.");
                        }
                        
                        // Usar o método estático Show() do ModernMessageBox
                        // Passar null como owner pois ainda não há MainWindow nesta instância
                        ModernMessageBox.Show(
                            "O Voltris Optimizer já está em execução.\n\n" +
                            "A janela principal foi trazida para o primeiro plano.",
                            "Voltris Optimizer",
                            MessageBoxButton.OK,
                            MessageBoxImage.Information,
                            owner: null // Sem owner pois ainda não há MainWindow nesta instância
                        );
                    }
                    catch (Exception ex)
                    {
                        // Fallback para MessageBox padrão se houver erro
                        // Registrar o erro para debug
                        try
                        {
                            var logDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                            if (!Directory.Exists(logDir))
                                Directory.CreateDirectory(logDir);
                            var immediateLog = Path.Combine(logDir, "immediate_startup.log");
                            File.AppendAllText(immediateLog, 
                                $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] ERRO ao exibir ModernMessageBox: {ex.Message}\n" +
                                $"Tipo: {ex.GetType().Name}\n" +
                                $"StackTrace: {ex.StackTrace}\n\n");
                        }
                        catch { }
                        
                        // Usar MessageBox padrão do Windows como fallback
                        MessageBox.Show(
                            "O Voltris Optimizer já está em execução.\n\n" +
                            "A janela principal foi trazida para o primeiro plano.",
                            "Voltris Optimizer",
                            MessageBoxButton.OK,
                            MessageBoxImage.Information
                        );
                    }

                    // Fechar esta nova instância imediatamente, sem carregar a MainWindow
                    Shutdown();
                    return;
                }
            }
            catch (Exception ex)
            {
                // Se houver erro ao criar o Mutex, permitir continuar (fallback)
                // Mas registrar o erro
                try
                {
                    var logDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                    if (!Directory.Exists(logDir))
                        Directory.CreateDirectory(logDir);
                    var immediateLog = Path.Combine(logDir, "immediate_startup.log");
                    File.AppendAllText(immediateLog, 
                        $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] ERRO ao criar Mutex: {ex.Message}\n" +
                        $"Continuando sem verificação de instância única...\n\n");
                }
                catch { }
            }

            // Splash
            Current.ShutdownMode = ShutdownMode.OnExplicitShutdown;
            var splash = new UI.Windows.SplashWindow();
            Application.Current.MainWindow = splash;
            splash.Show();
            splash.SetStatus("Inicializando serviços...");
            splash.SetProgress(10);

            // LOGAR IMEDIATAMENTE - ANTES DE QUALQUER VERIFICAÇÃO
            // Isso é crítico para diagnosticar se o programa está sendo executado
            try
            {
                var logDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                if (!Directory.Exists(logDir))
                    Directory.CreateDirectory(logDir);
                    
                var immediateLog = Path.Combine(logDir, "immediate_startup.log");
                File.AppendAllText(immediateLog, 
                    $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] ===== PROGRAMA INICIADO =====\n" +
                    $"ProcessPath: {System.Environment.ProcessPath ?? "NULL"}\n" +
                    $"BaseDirectory: {AppDomain.CurrentDomain.BaseDirectory}\n" +
                    $"CommandLine: {Environment.CommandLine}\n" +
                    $"Args: {string.Join(" | ", e.Args)}\n" +
                    $"WorkingDirectory: {Environment.CurrentDirectory}\n" +
                    $"UserName: {Environment.UserName}\n" +
                    $"IsAdmin: {AdminHelper.IsRunningAsAdministrator()}\n" +
                    $"===== INÍCIO DO PROCESSAMENTO =====\n\n");
            }
            catch { }

            // VERIFICAR LICENÇA E TRIAL ANTES DE INICIAR
            try
            {
                var licenseManager = LicenseManager.Instance;
                
                // Inicializar o trial (registra data de primeiro uso se necessário)
                licenseManager.InitializeTrial();
                
                var isLicenseValid = await licenseManager.IsLicenseValidAsync();
                var isTrialExpired = licenseManager.IsTrialExpired();
                var trialDaysRemaining = licenseManager.GetTrialDaysRemaining();
                
                splash.SetStatus("Verificando licença...");
                splash.SetProgress(5);
                
                // Se não tem licença válida E o trial expirou
                if (!isLicenseValid && isTrialExpired)
                {
                    // Mostrar página de ativação BLOQUEANTE
                    Current.ShutdownMode = ShutdownMode.OnExplicitShutdown;
                    
                    splash.Hide(); // Esconder splash
                    
                    var activationWindow = new UI.Views.LicenseActivationView(true, 0);
                    var result = activationWindow.ShowDialog();
                    
                    // Se não ativou licença, fechar
                    if (result != true || (!activationWindow.ActivationSucceeded && !activationWindow.ContinuedWithTrial))
                    {
                        Shutdown();
                        return;
                    }
                    
                    // Se ativou, continuar
                    splash.Show();
                }
                else if (!isLicenseValid && !isTrialExpired)
                {
                    // Está no período de trial - permitir uso
                    try
                    {
                        var logDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                        var immediateLog = Path.Combine(logDir, "immediate_startup.log");
                        _ = Task.Run(() =>
                        {
                            try
                            {
                                System.IO.Directory.CreateDirectory(System.IO.Path.GetDirectoryName(immediateLog) ?? logDir);
                                System.IO.File.AppendAllText(immediateLog,
                                    $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] Período de trial: {trialDaysRemaining} dias restantes\n\n");
                            }
                            catch { }
                        });
                    }
                    catch { }
                    
                    // Se for o primeiro uso ou restarem poucos dias, mostrar página de ativação
                    var settings = SettingsService.Instance.Settings;
                    if (settings.IsFirstRun || trialDaysRemaining <= 2)
                    {
                        splash.Hide();
                        
                        var activationWindow = new UI.Views.LicenseActivationView(false, trialDaysRemaining);
                        var result = activationWindow.ShowDialog();
                        
                        splash.Show();
                        
                        // Marcar que não é mais first run
                        settings.IsFirstRun = false;
                        SettingsService.Instance.SaveSettings();
                    }
                }
                else if (isLicenseValid)
                {
                    // Licença válida
                    LicenseManager.IsPro = true;
                }
            }
            catch (Exception ex)
            {
                // Em caso de erro na verificação de licença, permitir continuar
                // mas registrar o erro
                try
                {
                    var logDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                    var immediateLog = Path.Combine(logDir, "immediate_startup.log");
                    _ = Task.Run(() =>
                    {
                        try
                        {
                            System.IO.Directory.CreateDirectory(System.IO.Path.GetDirectoryName(immediateLog) ?? logDir);
                            System.IO.File.AppendAllText(immediateLog,
                                $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] ERRO na verificação de licença: {ex.Message}\n" +
                                $"Continuando sem bloqueio...\n\n");
                        }
                        catch { }
                    });
                }
                catch { }
            }

            // Verificar privilégios de administrador
            var args = e.Args;
            var isAutoStart = args.Any(arg => arg.Equals("/minimized", StringComparison.OrdinalIgnoreCase) || 
                                             arg.Equals("-minimized", StringComparison.OrdinalIgnoreCase));
            
            var isAdmin = AdminHelper.IsRunningAsAdministrator();
            
            // Logar sempre, independente de ser admin ou não
            try
            {
                var logDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                var immediateLog = Path.Combine(logDir, "immediate_startup.log");
                _ = Task.Run(() =>
                {
                    try
                    {
                        System.IO.Directory.CreateDirectory(System.IO.Path.GetDirectoryName(immediateLog) ?? logDir);
                        System.IO.File.AppendAllText(immediateLog,
                            $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] Iniciando - AutoStart: {isAutoStart}, Admin: {isAdmin}\n\n");
                    }
                    catch { }
                });
            }
            catch { }
            
            // IMPORTANTE: O programa agora pode iniciar SEM admin (manifest mudado para asInvoker)
            // Ele solicitará elevação apenas quando necessário para operações específicas
            // Isso permite que o programa inicie automaticamente com o Windows
            if (!isAdmin)
            {
                try
                {
                    var logDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                    var immediateLog = Path.Combine(logDir, "immediate_startup.log");
                    _ = Task.Run(() =>
                    {
                        try
                        {
                            System.IO.Directory.CreateDirectory(System.IO.Path.GetDirectoryName(immediateLog) ?? logDir);
                            System.IO.File.AppendAllText(immediateLog,
                                $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] Executando sem privilégios de admin. Elevação será solicitada quando necessário.\n\n");
                        }
                        catch { }
                    });
                }
                catch { }
                
                // Se não for auto-start e não for admin, mostrar aviso discreto mas não fechar
                // O programa pode funcionar em modo limitado e solicitar elevação quando necessário
                if (!isAutoStart)
                {
                    // Aviso discreto apenas na primeira execução (pode verificar em settings)
                    // Por enquanto, apenas logar - não bloquear a execução
                }
            }

            // Verificar versão mínima do Windows (Windows 10 build 10240 ou superior)
            try
            {
                var osVersion = Environment.OSVersion;
                if (osVersion.Version.Major < 10)
                {
                    MessageBox.Show(
                        "Este programa requer Windows 10 ou superior.\n\n" +
                        $"Versão detectada: Windows {osVersion.Version.Major}.{osVersion.Version.Minor}\n\n" +
                        "Por favor, atualize seu sistema operacional.",
                        "Versão do Windows Não Suportada",
                        MessageBoxButton.OK,
                        MessageBoxImage.Error
                    );
                    Shutdown();
                    return;
                }
            }
            catch { /* Continuar se não conseguir verificar */ }

            // Inicializar logging
            try
            {
                var logDirectory = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                _loggingService = new VoltrisOptimizer.Services.Logging.ProfessionalLoggingService(logDirectory);
                LoggingService = _loggingService;
                
                _loggingService.LogInfo("=== Voltris Optimizer 3.0 iniciado ===");
                _loggingService.LogInfo($"Sistema: {Environment.OSVersion}");
                _loggingService.LogInfo($"Arquitetura: {(Environment.Is64BitOperatingSystem ? "64-bit" : "32-bit")}");
                _loggingService.LogInfo($"Processo: {(Environment.Is64BitProcess ? "64-bit" : "32-bit")}");
                _loggingService.LogInfo($"Usuário: {Environment.UserName}");
                _loggingService.LogInfo($"Computador: {Environment.MachineName}");
                _loggingService.LogInfo($"Argumentos de linha de comando: {string.Join(" ", args)}");
                _loggingService.LogInfo($"É inicialização automática: {isAutoStart}");
                _loggingService.LogInfo($"Privilégios de Admin: {AdminHelper.IsRunningAsAdministrator()}");
                _loggingService.LogInfo($"Caminho do executável: {System.Environment.ProcessPath ?? "N/A"}");
                _loggingService.LogInfo($"Base Directory: {AppDomain.CurrentDomain.BaseDirectory}");
                
                // Logar no arquivo imediato também
                try
                {
                    var immediateLog = Path.Combine(logDirectory, "immediate_startup.log");
                    File.AppendAllText(immediateLog, 
                        $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] LoggingService inicializado com sucesso\n\n");
                }
                catch { }
                
                splash.SetStatus("Carregando componentes...");
                splash.SetProgress(40);
                
                // Configurar serviços usando o método de extensão centralizado
                var services = new Microsoft.Extensions.DependencyInjection.ServiceCollection();

                var configuration = new ConfigurationBuilder()
                    .SetBasePath(AppDomain.CurrentDomain.BaseDirectory)
                    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                    .Build();
                services.AddSingleton<IConfiguration>(configuration);
                services.Configure<VoltrisOptimizer.Config.OptimizationOptions>(configuration.GetSection("Optimization"));
                
                // Registrar o LoggingService já criado
                services.AddSingleton<Services.ILoggingService>(_loggingService);
                
                // Registrar novas interfaces e implementações
                services.AddSingleton<IProcessRunner, ProcessRunnerService>();
                services.AddSingleton<IRegistryService, RegistryService>();
                services.AddSingleton<SystemSafetyService>();
                services.AddSingleton<VoltrisOptimizer.Services.SystemChanges.ISystemChangeTransactionService, VoltrisOptimizer.Services.SystemChanges.SystemChangeTransactionService>();
                services.AddSingleton<VoltrisOptimizer.Services.SystemChanges.ICapabilityGuard, VoltrisOptimizer.Services.SystemChanges.CapabilityGuard>();
                services.AddSingleton<VoltrisOptimizer.Services.SystemChanges.ITweaksStrategyResolver, VoltrisOptimizer.Services.SystemChanges.TweaksStrategyResolver>();
                services.AddSingleton<VoltrisOptimizer.Services.DPC.IDpcAnalyzerService, VoltrisOptimizer.Services.DPC.DpcAnalyzerService>();
                services.AddSingleton<VoltrisOptimizer.Services.Prediction.IPredictionSchedulerService, VoltrisOptimizer.Services.Prediction.PredictionSchedulerService>();
                services.AddSingleton<VoltrisOptimizer.Services.AMPO.IAMPOService, VoltrisOptimizer.Services.AMPO.AMPOService>();
                services.AddTransient<VoltrisOptimizer.UI.ViewModels.GamerViewModel>(sp => new VoltrisOptimizer.UI.ViewModels.GamerViewModel(
                    sp.GetRequiredService<VoltrisOptimizer.Services.Gamer.Interfaces.IGamerModeOrchestrator>(),
                    sp.GetRequiredService<VoltrisOptimizer.Services.Gamer.Interfaces.IGameDetector>(),
                    sp.GetRequiredService<VoltrisOptimizer.Services.Gamer.Interfaces.IGameLibraryService>(),
                    sp.GetRequiredService<VoltrisOptimizer.Services.Gamer.Interfaces.IGpuGamingOptimizer>(),
                    sp.GetRequiredService<VoltrisOptimizer.Services.ILoggingService>(),
                    sp.GetService<VoltrisOptimizer.Services.Gamer.Interfaces.IGameProfileService>(),
                    sp.GetService<VoltrisOptimizer.Services.Gamer.Implementation.RealGameBoosterService>()
                ));
                
                // Registrar serviços do módulo Gamer
                services.AddGamerServices();
                services.AddAmpoServices();
                
                // Registrar serviços de inteligência de gaming
                services.AddGamerIntelligenceServices();
                
                // Registrar o Voltris Intelligence Framework (VIF)
                services.AddVoltrisIntelligenceFramework();
                
                // Registrar o serviço de informações do sistema
                services.AddSingleton<VoltrisOptimizer.Interfaces.ISystemInfoService, VoltrisOptimizer.Services.SystemInfoServiceImpl>();
                
                // Serviços de otimização com interfaces
                services.AddSingleton<VoltrisOptimizer.Interfaces.ISystemCleaner, SystemCleaner>();
                services.AddSingleton<SystemCleaner>(sp => (SystemCleaner)sp.GetRequiredService<VoltrisOptimizer.Interfaces.ISystemCleaner>());
                
                services.AddSingleton<VoltrisOptimizer.Interfaces.IPerformanceOptimizer, PerformanceOptimizer>();
                services.AddSingleton<PerformanceOptimizer>(sp => (PerformanceOptimizer)sp.GetRequiredService<VoltrisOptimizer.Interfaces.IPerformanceOptimizer>());
                
                services.AddSingleton<VoltrisOptimizer.Interfaces.INetworkOptimizer, NetworkOptimizer>();
                services.AddSingleton<NetworkOptimizer>(sp => (NetworkOptimizer)sp.GetRequiredService<VoltrisOptimizer.Interfaces.INetworkOptimizer>());
                
                services.AddSingleton<VoltrisOptimizer.Interfaces.IAdvancedOptimizer, AdvancedOptimizer>();
                services.AddSingleton<AdvancedOptimizer>(sp => (AdvancedOptimizer)sp.GetRequiredService<VoltrisOptimizer.Interfaces.IAdvancedOptimizer>());
                
                services.AddSingleton<Services.UltraCleanerService>();
                services.AddSingleton<Services.UltraPerformanceService>();
                services.AddSingleton<HistoryService>();
                services.AddSingleton<SchedulerService>();
                services.AddSingleton<AdvancedTweaksService>();
                services.AddSingleton<ExtremeOptimizationsService>();
                services.AddSingleton<GamerOptimizerService>();
                services.AddSingleton<GameDiagnosticsService>();
                services.AddSingleton<VoltrisOptimizer.Services.Optimization.IDynamicLoadStabilizer, VoltrisOptimizer.Services.Optimization.DynamicLoadStabilizer>();
                services.AddSingleton<AIOptimizerService>();
                services.AddSingleton<StartupService>();
                services.AddSingleton<SystemValidationService>();
                services.AddSingleton<VoltrisOptimizer.Interfaces.IDialogService, VoltrisOptimizer.Services.DialogService>();
                services.AddSingleton<VoltrisOptimizer.Interfaces.INavigationService, VoltrisOptimizer.Services.NavigationService>();
                services.AddSingleton<VoltrisOptimizer.Core.SystemIntelligenceProfiler.ProfileStore>();
                services.AddSingleton<VoltrisOptimizer.Core.SystemIntelligenceProfiler.IRollbackManager, VoltrisOptimizer.Core.SystemIntelligenceProfiler.RollbackManager>();
                services.AddSingleton<VoltrisOptimizer.Core.SystemIntelligenceProfiler.IAuditCollector, VoltrisOptimizer.Core.SystemIntelligenceProfiler.AuditCollector>();
                services.AddSingleton<VoltrisOptimizer.Core.SystemIntelligenceProfiler.IDecisionEngine, VoltrisOptimizer.Core.SystemIntelligenceProfiler.DecisionEngine>();
                services.AddSingleton<VoltrisOptimizer.Interfaces.ICompatibilityPolicy, VoltrisOptimizer.Core.SystemIntelligenceProfiler.DefaultCompatibilityPolicy>();
                
                // Registrar o SystemIntelligenceProfiler com tratamento de erro
                try
                {
                    services.AddSingleton<VoltrisOptimizer.Core.SystemIntelligenceProfiler.ISystemProfiler, VoltrisOptimizer.Core.SystemIntelligenceProfiler.SystemIntelligenceProfiler>();
                    _loggingService.LogInfo("SystemIntelligenceProfiler registrado com sucesso");
                }
                catch (Exception ex)
                {
                    _loggingService.LogError("Erro ao registrar SystemIntelligenceProfiler: " + ex.Message, ex);
                    // Continuar mesmo com erro no profiler
                }
                
                services.AddSingleton<Services.GameDetectionService>();
                services.AddSingleton<VoltrisOptimizer.Interfaces.IGameProfileRepository, VoltrisOptimizer.Core.GameRecognition.GameProfileRepositoryAdapter>();
                services.AddSingleton<VoltrisOptimizer.Core.GameRecognition.IGameRecognitionEngine, VoltrisOptimizer.Core.GameRecognition.GameRecognitionEngine>();
                
                // Registrar serviços de Overlay OSD
                // CORREÇÃO: Registrar MetricsCollector com ThermalMonitorService
                services.AddSingleton<VoltrisOptimizer.Services.Gamer.Overlay.Interfaces.IMetricsCollector>(sp =>
                    new VoltrisOptimizer.Services.Gamer.Overlay.Implementation.MetricsCollector(
                        sp.GetService<VoltrisOptimizer.Services.ILoggingService>(),
                        sp.GetService<VoltrisOptimizer.Services.Gamer.GamerModeManager.IThermalMonitorService>()));
                
                // CORREÇÃO: Registrar OverlayService com ThermalMonitorService
                services.AddSingleton<VoltrisOptimizer.Services.Gamer.Overlay.Interfaces.IOverlayService>(sp =>
                    new VoltrisOptimizer.Services.Gamer.Overlay.Implementation.OverlayService(
                        sp.GetService<VoltrisOptimizer.Services.ILoggingService>(),
                        sp.GetService<VoltrisOptimizer.Services.Gamer.Overlay.Interfaces.IMetricsCollector>(),
                        sp.GetService<VoltrisOptimizer.Services.Gamer.GamerModeManager.IThermalMonitorService>()));
                
                // Registrar serviços de Self-Profiling do Modo Gamer
                services.AddSingleton<VoltrisOptimizer.Services.Gamer.Diagnostics.Interfaces.IPerformanceAnomalyDetector,
                    VoltrisOptimizer.Services.Gamer.Diagnostics.Implementation.AnomalyDetector>();
                services.AddSingleton<VoltrisOptimizer.Services.Gamer.Diagnostics.Interfaces.IGamerSelfProfiler,
                    VoltrisOptimizer.Services.Gamer.Diagnostics.Implementation.SelfProfilerService>();
                
                // Registrar GamerModeManager e módulos de otimização temporários
                services.AddGamerModeManager();
                
                // Registrar Performance Optimization Service
                services.AddSingleton<VoltrisOptimizer.Services.Performance.IPerformanceOptimizationService>(
                    sp => new VoltrisOptimizer.Services.Performance.PerformanceOptimizationService(
                        sp.GetRequiredService<Services.UltraPerformanceService>(), 
                        sp.GetRequiredService<Services.ILoggingService>()));
                
                _serviceProvider = services.BuildServiceProvider();
                Services = _serviceProvider;
                
                // Inicializar WindowsCompatibilityHelper após build do service provider
                var capabilityGuard = _serviceProvider.GetService<VoltrisOptimizer.Services.SystemChanges.ICapabilityGuard>();
                if (capabilityGuard != null)
                {
                    VoltrisOptimizer.Helpers.WindowsCompatibilityHelper.Initialize(capabilityGuard);
                }
                
                // Inicializar o ServiceLocator para compatibilidade com código legado
                // NOTA: Este padrão será gradualmente removido em favor de DI puro
                ServiceLocator.Initialize(_serviceProvider);
                try
                {
                    var startupManager = new StartupManager();
                    Task.Run(async () =>
                    {
                        var enabled = await startupManager.IsEnabledAsync();
                        var settingsSvc = SettingsService.Instance;
                        settingsSvc.Settings.StartWithWindows = enabled;
                        settingsSvc.SaveSettings();
                    });
                    var startupService = _serviceProvider.GetService<StartupService>();
                    startupService?.ApplyDefaultStartupPolicy();
                }
                catch { }

                SystemCleaner = _serviceProvider.GetService<SystemCleaner>();
                PerformanceOptimizer = _serviceProvider.GetService<PerformanceOptimizer>();
                UltraCleaner = _serviceProvider.GetService<Services.UltraCleanerService>();
                UltraPerformance = _serviceProvider.GetService<Services.UltraPerformanceService>();
                NetworkOptimizer = _serviceProvider.GetService<NetworkOptimizer>();
                HistoryService = _serviceProvider.GetService<HistoryService>();
                SchedulerService = _serviceProvider.GetService<SchedulerService>();
                AdvancedOptimizer = _serviceProvider.GetService<AdvancedOptimizer>();
                var advancedTweaks = _serviceProvider.GetService<AdvancedTweaksService>();
                ExtremeOptimizations = _serviceProvider.GetService<ExtremeOptimizationsService>();
                GamerOptimizer = _serviceProvider.GetService<GamerOptimizerService>();
                GameDiagnostics = _serviceProvider.GetService<GameDiagnosticsService>();
                OverlayService = _serviceProvider.GetService<VoltrisOptimizer.Services.Gamer.Overlay.Interfaces.IOverlayService>();
                try
                {
                    GamerSelfProfiler = _serviceProvider.GetService<VoltrisOptimizer.Services.Gamer.Diagnostics.Interfaces.IGamerSelfProfiler>();
                }
                catch { }
                GamerSelfProfiler = _serviceProvider.GetService<VoltrisOptimizer.Services.Gamer.Diagnostics.Interfaces.IGamerSelfProfiler>();
                AIOptimizer = _serviceProvider.GetService<AIOptimizerService>();
                
                // Obter SystemProfiler com tratamento de erro
                try
                {
                    SystemProfiler = _serviceProvider.GetService<Core.SystemIntelligenceProfiler.ISystemProfiler>() as Core.SystemIntelligenceProfiler.SystemIntelligenceProfiler;
                    if (SystemProfiler != null)
                    {
                        _loggingService.LogInfo("SystemProfiler inicializado com sucesso");
                    }
                    else
                    {
                        _loggingService.LogWarning("SystemProfiler não pôde ser inicializado");
                    }
                }
                catch (Exception ex)
                {
                    _loggingService.LogError("Erro ao inicializar SystemProfiler: " + ex.Message, ex);
                }
                
                GameDetectionService = _serviceProvider.GetService<Services.GameDetectionService>();

                if (ExtremeOptimizations != null)
                {
                    ExtremeOptimizations.DryRun = false; // false = aplica otimizações reais para usuários finais
                    // DPC Watchdog ativado por padrão para melhor performance
                    var watchdogEnabled = SettingsService.Instance.Settings.AllowBackgroundDpcWatchdog;
                    ExtremeOptimizations.AllowBackgroundWatchdog = watchdogEnabled;
                    // Iniciar DPC Watchdog automaticamente se estiver habilitado
                    if (watchdogEnabled)
                    {
                        try
                        {
                            ExtremeOptimizations.StartDpcWatchdog();
                        }
                        catch (Exception ex)
                        {
                            _loggingService.LogWarning($"Erro ao iniciar DPC Watchdog: {ex.Message}");
                        }
                    }
                }
                if (advancedTweaks != null)
                {
                    advancedTweaks.DryRun = true;
                }
                
                // Inicializar DLS automaticamente se estiver habilitado nas configurações
                try
                {
                    var settings = SettingsService.Instance;
                    if (settings.Settings.EnableDynamicLoadStabilizer)
                    {
                        var dls = _serviceProvider.GetService<VoltrisOptimizer.Services.Optimization.IDynamicLoadStabilizer>();
                        if (dls != null)
                        {
                            dls.Enabled = true;
                            Task.Run(async () =>
                            {
                                try
                                {
                                    await dls.StartAsync(null);
                                    _loggingService.LogInfo("DLS iniciado automaticamente");
                                }
                                catch (Exception ex)
                                {
                                    _loggingService.LogWarning($"Erro ao iniciar DLS automaticamente: {ex.Message}");
                                }
                            });
                        }
                    }
                }
                catch (Exception ex)
                {
                    _loggingService.LogWarning($"Erro ao inicializar DLS: {ex.Message}");
                }
                
                // Configurar eventos do GameDetectionService
                var realBooster = _serviceProvider?.GetService<Services.Gamer.Implementation.RealGameBoosterService>();
                
                if (GameDetectionService != null && GamerOptimizer != null)
                {
                    GameDetectionService.OnGameStarted += (s, e) =>
                    {
                        try
                        {
                            _loggingService.LogInfo($"🎮 Jogo detectado: {e.GameName} (PID: {e.ProcessId})");
                            
                            // CORREÇÃO: Usar NotificationManager para notificações confiáveis
                            // ToastService pode não funcionar corretamente em alguns casos
                            try
                            {
                                NotificationManager.ShowSuccess(
                                    "🎮 Modo Jogo Ativado",
                                    $"Jogo detectado: {e.GameName}\nSistema otimizado automaticamente para melhor desempenho."
                                );
                            }
                            catch (Exception notifEx)
                            {
                                _loggingService.LogWarning($"Erro ao enviar notificação: {notifEx.Message}");
                            }
                            
                            // Aplicar otimizações em background
                            Task.Run(async () =>
                            {
                                try
                                {
                                    if (e.Process != null && !e.Process.HasExited && e.ProcessPath != null)
                                    {
                                        try
                                        {
                                            var detectedGame = new Services.DetectedGame { Name = e.GameName, ExecutablePath = e.ProcessPath, DetectedAt = DateTime.Now };
                                            GamerOptimizer.AddDetectedGameToLibrary(detectedGame);
                                        }
                                        catch { }
                                        
                                        // USAR REAL GAME BOOSTER para otimizações de alto impacto
                                        if (realBooster != null)
                                        {
                                            _loggingService.LogInfo("[AUTO] Aplicando Real Game Boost...");
                                            var boostResult = await realBooster.ActivateFullBoostAsync(e.Process);
                                            _loggingService.LogSuccess($"[AUTO] Real Boost: {boostResult.OptimizationsApplied}/8 otimizações aplicadas");
                                        }
                                        
                                        await GamerOptimizer.ActivateGamerModeAsync(e.ProcessPath, null);
                                        _loggingService.LogSuccess($"✅ Otimizações aplicadas para {e.GameName}");
                                        
                                        // Iniciar overlay OSD se habilitado
                                        if (OverlayService != null && OverlayService.Settings.IsEnabled && e.Process != null)
                                        {
                                            try
                                            {
                                                await OverlayService.StartAsync(e.Process.Id);
                                                _loggingService.LogInfo($"[Overlay] OSD iniciado para {e.GameName}");
                                            }
                                            catch (Exception overlayEx)
                                            {
                                                _loggingService.LogWarning($"[Overlay] Erro ao iniciar overlay: {overlayEx.Message}");
                                            }
                                        }
                                    }
                                }
                                catch (Exception ex)
                                {
                                    _loggingService.LogWarning($"Não foi possível aplicar otimizações: {ex.Message}");
                                }
                            });
                        }
                        catch (Exception ex)
                        {
                            _loggingService.LogError($"Erro ao processar jogo detectado: {ex.Message}", ex);
                        }
                    };
                    
                    GameDetectionService.OnGameStopped += (s, e) =>
                    {
                        _loggingService.LogInfo($"🛑 Jogo parado: {e.ProcessName} (PID: {e.ProcessId})");
                        try 
                        { 
                            // Parar overlay OSD
                            if (OverlayService != null && OverlayService.IsActive)
                            {
                                _ = OverlayService.StopAsync();
                                _loggingService.LogInfo("[Overlay] OSD parado");
                            }
                            
                            // Desativar Real Game Booster
                            if (realBooster != null && realBooster.IsActive)
                            {
                                _ = realBooster.DeactivateAsync();
                            }
                            _ = GamerOptimizer.DeactivateGamerModeAsync(); 
                        } 
                        catch { }
                    };
                    
                    splash.SetStatus("Validando segurança...");
                    splash.SetProgress(70);
                    GameDetectionService.StartMonitoring();
                    
                    _loggingService.LogInfo("✅ Sistema de detecção de jogos inteligente iniciado com sucesso");
                    
                    // Inicializar Voltris Intelligence Framework (VIF) - EM BACKGROUND para não bloquear
                    try
                    {
                        var vif = _serviceProvider.GetRequiredService<VoltrisOptimizer.Core.Intelligence.IVoltrisIntelligenceOrchestrator>();
                        App.VoltrisIntelligence = vif;
                        // Iniciar VIF em background para não bloquear a UI
                        Task.Run(() =>
                        {
                            try
                            {
                                vif.Start();
                                _loggingService.LogInfo("✅ Voltris Intelligence Framework (VIF) iniciado");
                            }
                            catch (Exception ex)
                            {
                                _loggingService.LogWarning($"⚠️ Erro ao iniciar VIF: {ex.Message}");
                            }
                        });
                    }
                    catch (Exception ex)
                    {
                        _loggingService.LogWarning($"⚠️ Erro ao obter VIF: {ex.Message}");
                    }
                    
                    // Inicializar GameModePerformanceOptimizer (otimizações de FPS) - EM BACKGROUND
                    try
                    {
                        var perfOptimizer = _serviceProvider.GetRequiredService<VoltrisOptimizer.Core.Intelligence.GameModePerformanceOptimizer>();
                        // Iniciar em background para não bloquear
                        Task.Run(() =>
                        {
                            try
                            {
                                perfOptimizer.Start();
                                _loggingService.LogInfo("✅ GameModePerformanceOptimizer iniciado - FPS otimizado");
                            }
                            catch (Exception ex)
                            {
                                _loggingService.LogWarning($"⚠️ Erro ao iniciar GameModePerformanceOptimizer: {ex.Message}");
                            }
                        });
                    }
                    catch (Exception ex)
                    {
                        _loggingService.LogWarning($"⚠️ Erro ao obter GameModePerformanceOptimizer: {ex.Message}");
                    }
                }
            }
            catch (Exception ex)
            {
                try
                {
                    var dialog = new VoltrisOptimizer.Services.DialogService();
                    dialog.ShowError("Erro de Inicialização", "Erro ao inicializar sistema de logs: " + ex.Message);
                }
                catch
                {
                    MessageBox.Show("Erro ao inicializar sistema de logs: " + ex.Message, "Erro de Inicialização", MessageBoxButton.OK, MessageBoxImage.Error);
                }
            }

            // LOGAR APÓS INICIALIZAÇÃO DOS SERVIÇOS - ANTES DO TRATAMENTO DE EXCEÇÕES
            try
            {
                var logDir = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                if (!System.IO.Directory.Exists(logDir))
                    System.IO.Directory.CreateDirectory(logDir);
                var logFile = System.IO.Path.Combine(logDir, "app_startup.log");
                System.IO.File.AppendAllText(logFile, 
                    $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] ===== APÓS INICIALIZAÇÃO DOS SERVIÇOS =====\n" +
                    $"Serviços inicializados com sucesso\n" +
                    $"Splash está visível: {splash.IsVisible}\n" +
                    $"Splash WindowState: {splash.WindowState}\n\n");
            }
            catch { }

            // Tratamento global de exceções
            DispatcherUnhandledException += App_DispatcherUnhandledException;
            AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;
            TaskScheduler.UnobservedTaskException += TaskScheduler_UnobservedTaskException;
            
            // LOGAR ANTES DO TASK.RUN - CRÍTICO PARA DIAGNÓSTICO
            try
            {
                var logDir = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                if (!System.IO.Directory.Exists(logDir))
                    System.IO.Directory.CreateDirectory(logDir);
                var logFile = System.IO.Path.Combine(logDir, "app_startup.log");
                System.IO.File.AppendAllText(logFile, 
                    $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] ===== ANTES DO TASK.RUN =====\n" +
                    $"Splash está visível: {splash.IsVisible}\n" +
                    $"Splash WindowState: {splash.WindowState}\n" +
                    $"Splash IsLoaded: {splash.IsLoaded}\n" +
                    $"Current.MainWindow: {Current.MainWindow?.GetType().Name ?? "NULL"}\n" +
                    $"Dispatcher.Thread: {Dispatcher.Thread.ManagedThreadId}\n\n");
            }
            catch (Exception logEx)
            {
                // Se não conseguir logar, pelo menos tentar no immediate log
                try
                {
                    var logDir = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                    var immediateLog = System.IO.Path.Combine(logDir, "immediate_startup.log");
                    System.IO.File.AppendAllText(immediateLog, 
                        $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] ERRO ao logar antes do Task.Run: {logEx.Message}\n");
                }
                catch { }
            }
            
            Task.Run(async () =>
            {
                try
                {
                    // LOGAR DENTRO DO TASK.RUN
                    try
                    {
                        var logDir = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                        var logFile = System.IO.Path.Combine(logDir, "app_startup.log");
                        System.IO.File.AppendAllText(logFile, 
                            $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] ===== DENTRO DO TASK.RUN =====\n");
                    }
                    catch { }
                    
                    splash.SetStatus("Preparando interface...");
                    // CORREÇÃO CRÍTICA: Usar await Task.Delay em vez de Thread.Sleep
                    // Thread.Sleep bloqueia thread do ThreadPool e pode causar deadlocks
                    await Task.Delay(200);
                    splash.SetProgress(80);
                    splash.SetStatus("Pronto");
                    await Task.Delay(150);
                    splash.SetProgress(100);
                    
                    // LOGAR ANTES DO DISPATCHER.INVOKE
                    try
                    {
                        var logDir = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                        var logFile = System.IO.Path.Combine(logDir, "app_startup.log");
                        System.IO.File.AppendAllText(logFile, 
                            $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] ===== ANTES DO DISPATCHER.INVOKE =====\n");
                    }
                    catch { }
                    
                    await Dispatcher.InvokeAsync(async () =>
                    {
                        try
                        {
                            var logDir = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                            if (!System.IO.Directory.Exists(logDir))
                                System.IO.Directory.CreateDirectory(logDir);
            var logFile = System.IO.Path.Combine(logDir, "app_startup.log");
                            System.IO.File.AppendAllText(logFile, 
                                $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] ===== DENTRO DO DISPATCHER.INVOKE - CRIANDO MAINWINDOW =====\n");
                            
                            // FECHAR SPLASH PRIMEIRO para não bloquear
                            splash.Close();
                            
                            var mainWindow = new UI.MainWindow();
                            Application.Current.MainWindow = mainWindow;
                            
                            System.IO.File.AppendAllText(logFile, 
                                $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] MainWindow criado\n" +
                                $"  WindowState: {mainWindow.WindowState}\n" +
                                $"  ShowInTaskbar: {mainWindow.ShowInTaskbar}\n" +
                                $"  Visibility: {mainWindow.Visibility}\n");
                            
                            // FORÇAR EXIBIÇÃO IMEDIATA - SEM DELAYS
                            System.IO.File.AppendAllText(logFile, 
                                $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] FORÇANDO exibição imediata...\n");
                            
                            // Configurar propriedades ANTES de Show()
                            mainWindow.WindowState = WindowState.Normal;
                            mainWindow.ShowInTaskbar = true;
                            mainWindow.Visibility = Visibility.Visible;
                            mainWindow.Topmost = false;
                            
                            // Mostrar a janela
                            mainWindow.Show();
                            
                            // CORREÇÃO CRÍTICA: Usar await Task.Delay em vez de Thread.Sleep
                            // Aguardar um frame para o handle ser criado
                            await Task.Delay(50);
                            
                            // Forçar a janela para frente usando Win32
                            try
                            {
                                var hwnd = new System.Windows.Interop.WindowInteropHelper(mainWindow).Handle;
                                System.IO.File.AppendAllText(logFile, 
                                    $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] Handle obtido: {hwnd}\n");
                                
                                if (hwnd != IntPtr.Zero)
                                {
                                    // Forçar exibição usando múltiplas APIs Win32
                                    VoltrisOptimizer.UI.Helpers.Win32WindowHelper.ShowWindowAsync(hwnd, VoltrisOptimizer.UI.Helpers.Win32WindowHelper.SW_SHOW);
                                    // CORREÇÃO: Usar await Task.Delay
                                    await Task.Delay(10);
                                    VoltrisOptimizer.UI.Helpers.Win32WindowHelper.SetForegroundWindow(hwnd);
                                    await Task.Delay(10);
                                    VoltrisOptimizer.UI.Helpers.Win32WindowHelper.BringWindowToTop(hwnd);
                                    System.IO.File.AppendAllText(logFile, 
                                        $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] Win32 APIs chamadas\n");
                                }
                            }
                            catch (Exception ex)
                            {
                                System.IO.File.AppendAllText(logFile, 
                                    $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] ERRO Win32: {ex.Message}\n");
                            }
                            
                            // Ativar janela
                            mainWindow.Activate();
                            mainWindow.Focus();
                            mainWindow.BringIntoView();
                            
                            Current.ShutdownMode = ShutdownMode.OnLastWindowClose;
                            
                            System.IO.File.AppendAllText(logFile, 
                                $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] Estado final:\n" +
                                $"  WindowState: {mainWindow.WindowState}\n" +
                                $"  ShowInTaskbar: {mainWindow.ShowInTaskbar}\n" +
                                $"  Visibility: {mainWindow.Visibility}\n" +
                                $"  IsLoaded: {mainWindow.IsLoaded}\n" +
                                $"===== FIM CRIACAO MAINWINDOW =====\n\n");
                            
                            // Inicializar sistema de atualização automática
                            InitializeAutoUpdater();
                        }
                        catch (Exception ex)
                        {
                            try
                            {
                                var logDir = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                                var logFile = System.IO.Path.Combine(logDir, "app_startup.log");
                                System.IO.File.AppendAllText(logFile, 
                                    $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] ERRO CRÍTICO: {ex.Message}\n{ex.StackTrace}\n\n");
                            }
                            catch { }
                        }
                    });
                }
                catch (Exception taskEx)
                {
                    // LOGAR ERRO NO TASK.RUN
                    try
                    {
                        var logDir = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                        var logFile = System.IO.Path.Combine(logDir, "app_startup.log");
                        System.IO.File.AppendAllText(logFile, 
                            $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] ===== ERRO NO TASK.RUN =====\n" +
                            $"Erro: {taskEx.Message}\n" +
                            $"StackTrace: {taskEx.StackTrace}\n\n");
                    }
                    catch { }
                    
                    Dispatcher.Invoke(() =>
                    {
                        try
                        {
                            var logDir = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                            var logFile = System.IO.Path.Combine(logDir, "app_startup.log");
                            System.IO.File.AppendAllText(logFile, 
                                $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] ===== CATCH BLOCK - CRIANDO MAINWINDOW =====\n");
                        }
                        catch { }
                        
                        var mainWindow = new UI.MainWindow();
                        Application.Current.MainWindow = mainWindow;
                        
                        // CRÍTICO: Garantir que a janela seja exibida corretamente
                        mainWindow.WindowState = WindowState.Normal;
                        mainWindow.ShowInTaskbar = true;
                        mainWindow.Visibility = Visibility.Visible;
                        mainWindow.Topmost = false;
                        mainWindow.Show();
                        
                        // Forçar a janela para frente usando Win32
                        try
                        {
                            var hwnd = new System.Windows.Interop.WindowInteropHelper(mainWindow).Handle;
                            if (hwnd != IntPtr.Zero)
                            {
                                VoltrisOptimizer.UI.Helpers.Win32WindowHelper.ShowWindowAsync(hwnd, VoltrisOptimizer.UI.Helpers.Win32WindowHelper.SW_SHOW);
                                VoltrisOptimizer.UI.Helpers.Win32WindowHelper.SetForegroundWindow(hwnd);
                                VoltrisOptimizer.UI.Helpers.Win32WindowHelper.BringWindowToTop(hwnd);
                            }
                        }
                        catch { }
                        
                        mainWindow.Activate();
                        mainWindow.Focus();
                        mainWindow.BringIntoView();
                        
                        splash.Close();
                        Current.ShutdownMode = ShutdownMode.OnLastWindowClose;
                    });
                }
            });
        }
        
        /// <summary>
        /// Inicializa o sistema de atualização automática
        /// </summary>
        private async void InitializeAutoUpdater()
        {
            try
            {
                var corrId = Guid.NewGuid().ToString("N");
                _loggingService?.LogInfo($"[App] Verificando atualizações... (corrId={corrId})");
                
                // Limpar atualizações antigas
                Core.Updater.UpdateService.CleanupOldUpdates();
                
                // Aguardar um pouco após o startup
                await Task.Delay(3000);
                
                // Verificar se há atualização
                var updateInfo = await Core.Updater.UpdateService.CheckForUpdatesAsync();
                
                if (updateInfo != null)
                {
                    _loggingService?.LogInfo($"[App] Nova versão disponível: {updateInfo.LatestVersion}");
                    
                    // Mostrar janela de atualização na UI thread
                    await Dispatcher.InvokeAsync(() =>
                    {
                        var updateWindow = new Core.Updater.UpdateWindow(updateInfo);
                        updateWindow.Owner = Current.MainWindow;
                        updateWindow.ShowDialog();
                    });
                }
                else
                {
                    _loggingService?.LogInfo($"[App] Aplicativo está atualizado (corrId={corrId})");
                }
            }
            catch (Exception ex)
            {
                _loggingService?.LogError("[App] Erro ao verificar atualizações", ex);
            }
        }

        private void LoadSavedTheme()
        {
            try
            {
                var settings = SettingsService.Instance.Settings;
                if (settings.Theme == "Light")
                {
                    var dicts = Application.Current.Resources.MergedDictionaries;
                    for (int i = 0; i < dicts.Count; i++)
                    {
                        var src = dicts[i].Source?.ToString() ?? string.Empty;
                        if (src.EndsWith("DarkTheme.xaml", StringComparison.OrdinalIgnoreCase))
                        {
                            dicts.RemoveAt(i);
                            break;
                        }
                    }
                    dicts.Add(new ResourceDictionary { Source = new Uri("/UI/Themes/LightTheme.xaml", UriKind.Relative) });
                }
            }
            catch { /* Theme loading is non-critical */ }
        }

        protected override void OnExit(ExitEventArgs e)
        {
            _loggingService?.LogInfo("=== Voltris Optimizer finalizado ===");
            
            // Parar VIF e GameModePerformanceOptimizer
            try
            {
                VoltrisIntelligence?.Stop();
                VoltrisIntelligence?.Dispose();
                
                var perfOptimizer = Services?.GetService<VoltrisOptimizer.Core.Intelligence.GameModePerformanceOptimizer>();
                perfOptimizer?.Stop();
                perfOptimizer?.Dispose();
            }
            catch { }
            
            _loggingService?.Dispose();
            
            // Liberar o Mutex quando a aplicação for fechada
            try
            {
                if (_mutex != null)
                {
                    _mutex.ReleaseMutex();
                    _mutex.Dispose();
                }
            }
            catch { }
            
            base.OnExit(e);
        }

        /// <summary>
        /// Ativa a janela principal da instância existente do Voltris Optimizer
        /// </summary>
        private void ActivateExistingInstance()
        {
            try
            {
                // Procurar por todas as janelas com o título do Voltris Optimizer
                Process[] processes = Process.GetProcessesByName("VoltrisOptimizer");
                
                foreach (Process process in processes)
                {
                    // Ignorar o processo atual (esta nova instância)
                    if (process.Id == Process.GetCurrentProcess().Id)
                        continue;

                    try
                    {
                        // Tentar obter a janela principal do processo
                        IntPtr mainWindowHandle = process.MainWindowHandle;
                        
                        if (mainWindowHandle != IntPtr.Zero)
                        {
                            // Obter thread ID da janela e do thread atual
                            GetWindowThreadProcessId(mainWindowHandle, out uint windowThreadProcessId);
                            uint currentThreadId = GetCurrentThreadId();
                            
                            // Se não estiver no mesmo thread, anexar os threads
                            if (windowThreadProcessId != currentThreadId)
                            {
                                AttachThreadInput(currentThreadId, windowThreadProcessId, true);
                            }

                            // Restaurar a janela se estiver minimizada
                            if (IsIconic(mainWindowHandle))
                            {
                                ShowWindowAsync(mainWindowHandle, SW_RESTORE);
                            }

                            // Trazer a janela para o primeiro plano
                            ShowWindowAsync(mainWindowHandle, SW_SHOW);
                            SetForegroundWindow(mainWindowHandle);

                            // Desanexar os threads
                            if (windowThreadProcessId != currentThreadId)
                            {
                                AttachThreadInput(currentThreadId, windowThreadProcessId, false);
                            }

                            // Se encontrou uma janela válida, parar a busca
                            break;
                        }
                    }
                    catch
                    {
                        // Continuar tentando com o próximo processo
                        continue;
                    }
                }
            }
            catch
            {
                // Se houver erro, simplesmente não fazer nada
                // O programa já exibirá a mensagem ao usuário
            }
        }

        private void App_DispatcherUnhandledException(object sender, System.Windows.Threading.DispatcherUnhandledExceptionEventArgs e)
        {
            try
            {
                _loggingService?.LogError($"Exceção não tratada na UI: {e.Exception.Message}\nStackTrace: {e.Exception.StackTrace}", e.Exception);
                
                // Detectar stack overflow especificamente
                if (e.Exception is StackOverflowException)
                {
                    MessageBox.Show(
                        "Stack Overflow detectado!\n\n" +
                        "O programa encontrou um loop infinito. Isso pode ser causado por:\n" +
                        "- Animações recursivas\n" +
                        "- Eventos que se disparam infinitamente\n" +
                        "- Problemas com triggers do WPF\n\n" +
                        "O programa será fechado para proteger o sistema.",
                        "Erro Crítico - Stack Overflow",
                        MessageBoxButton.OK,
                        MessageBoxImage.Stop
                    );
                    e.Handled = false; // Não tratar para permitir fechamento
                    Shutdown();
                    return;
                }
                
                MessageBox.Show(
                    $"Ocorreu um erro inesperado:\n\n{e.Exception.Message}\n\nTipo: {e.Exception.GetType().Name}\n\nO programa continuará, mas algumas funcionalidades podem não funcionar corretamente.",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error
                );

                e.Handled = true; // Tratar para evitar fechamento
            }
            catch
            {
                // Se houver erro ao tratar o erro, apenas garantir que o programa não trave
                e.Handled = true;
            }
        }

        private void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
        {
            try
            {
                if (e.ExceptionObject is Exception ex)
                {
                    _loggingService?.LogError($"Exceção crítica não tratada: {ex.Message}\nStackTrace: {ex.StackTrace}", ex);
                    
                    // Se for stack overflow, não tentar mostrar mensagem (pode causar mais problemas)
                    if (ex is StackOverflowException)
                    {
                        // Apenas logar e deixar o sistema lidar
                        return;
                    }
                    
                    MessageBox.Show(
                        $"Erro crítico:\n\n{ex.Message}\n\nTipo: {ex.GetType().Name}",
                        "Erro Crítico",
                        MessageBoxButton.OK,
                        MessageBoxImage.Stop
                    );
                }
            }
            catch
            {
                // Ignorar erros ao tentar tratar exceção crítica
            }
        }
        
        private void TaskScheduler_UnobservedTaskException(object? sender, UnobservedTaskExceptionEventArgs e)
        {
            try
            {
                // Marcar como observada para não crashar a aplicação
                e.SetObserved();
                
                var innerEx = e.Exception?.InnerException ?? e.Exception;
                _loggingService?.LogError($"[TASK] Exceção não observada em Task: {innerEx?.Message}\nStackTrace: {innerEx?.StackTrace}", innerEx);
                
                // Log detalhado para arquivo
                try
                {
                    var logDir = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                    if (!System.IO.Directory.Exists(logDir))
                        System.IO.Directory.CreateDirectory(logDir);
                    var crashLog = System.IO.Path.Combine(logDir, "unobserved_task_exceptions.log");
                    System.IO.File.AppendAllText(crashLog,
                        $"\n[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] ===== UNOBSERVED TASK EXCEPTION =====\n" +
                        $"Message: {innerEx?.Message}\n" +
                        $"Type: {innerEx?.GetType().Name}\n" +
                        $"StackTrace:\n{innerEx?.StackTrace}\n" +
                        $"===========================================\n");
                }
                catch { }
            }
            catch
            {
                // Silently ignore
            }
        }
    }
}
