using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Win32;
using System.IO;
using VoltrisOptimizer.Interfaces;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using Microsoft.Extensions.DependencyInjection;
using VoltrisOptimizer.Core;
using VoltrisOptimizer.Core.SystemIntelligenceProfiler;
using VoltrisOptimizer.Services;

using VoltrisOptimizer.Services.Gamer.Interfaces;
using VoltrisOptimizer.Services.License;
using VoltrisOptimizer.Services.Optimization;
using VoltrisOptimizer.Services.Performance;
using VoltrisOptimizer.Services.Power;
using VoltrisOptimizer.Services.SystemIntelligenceProfiler;
using VoltrisOptimizer.Services.Gamer;
using VoltrisOptimizer.Services.Gamer.Intelligence;
using VoltrisOptimizer.UI.Views;
using VoltrisOptimizer.UI.Windows;
using Microsoft.Win32;
using System.Runtime.InteropServices;

namespace VoltrisOptimizer
{
    public partial class App : Application
    {
        private Mutex? _appMutex;
        private ILoggingService? _loggingService;
        private IServiceProvider? _serviceProvider;
        private SplashWindow? _splashWindow;
        
        // CONTROLE DE FLUXO PARA PREVENIR DUPLICAÇÕES
        private static bool _flowAlreadyStarted = false;
        
        // Indica se esta é a instância principal (com mutex). Instâncias secundárias
        // (lançadas pelo menu de contexto) NÃO devem remover o menu ao fechar.
        private bool _isPrimaryInstance = false;

        public App()
        {
            // PRIMEIRO DE TUDO: Iniciar CrashDiagnostics antes de qualquer código
            // Isso garante breadcrumbs mesmo se o construtor falhar
            Core.Diagnostics.CrashDiagnostics.Initialize();
            Core.Diagnostics.CrashDiagnostics.Mark("App() constructor START");
            
            InitializeComponent();
            Core.Diagnostics.CrashDiagnostics.Mark("InitializeComponent OK");
            
            // Aplicar bordas arredondadas em todos os ContextMenus do aplicativo
            Helpers.RoundedWindowHelper.EnableGlobalContextMenuRounding(12);
            
            // ✅ Safety net: ProcessExit é chamado mesmo em Environment.Exit / shutdown inesperado
            AppDomain.CurrentDomain.ProcessExit += OnProcessExit;
            Core.Diagnostics.CrashDiagnostics.Mark("App() constructor END");
        }

        /// <summary>
        /// Handler de último recurso — garante desativação do Modo Gamer
        /// mesmo em cenários de encerramento forçado (Environment.Exit, shutdown do SO).
        /// Timeout ultra-curto: o processo está morrendo, não há tempo para esperar.
        /// </summary>
        private void OnProcessExit(object? sender, EventArgs e)
        {
            try
            {
                if (_serviceProvider != null)
                {
                    // CORREÇÃO CRÍTICA: Restaurar CPU mesmo em shutdown forçado/crash.
                    // Timeout ultra-curto pois o processo está encerrando.
                    try
                    {
                        var cpuProfile = _serviceProvider.GetService<VoltrisOptimizer.Services.Power.CpuProfileOptimizationService>();
                        if (cpuProfile != null && cpuProfile.IsApplied)
                        {
                            Task.Run(() => cpuProfile.RestoreOriginalAsync())
                                .Wait(TimeSpan.FromSeconds(3));
                        }
                    }
                    catch { }

                    // Restaurar plano de energia nativo também em crash/shutdown forçado
                    try
                    {
                        var powerPlanService = _serviceProvider.GetService<VoltrisOptimizer.Services.Power.IntelligentPowerPlanService>();
                        if (powerPlanService != null)
                        {
                            Task.Run(() => powerPlanService.RestoreOriginalPlanAsync())
                                .Wait(TimeSpan.FromSeconds(3));
                        }
                    }
                    catch { }

                    var orchestrator = _serviceProvider.GetService<VoltrisOptimizer.Services.Gamer.Interfaces.IGamerModeOrchestrator>();
                    if (orchestrator != null && orchestrator.IsActive)
                    {
                        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(2));
                        Task.Run(async () => await orchestrator.DeactivateAsync(cancellationToken: cts.Token))
                            .GetAwaiter().GetResult();
                    }
                }
            }
            catch { /* Último recurso — não pode falhar */ }

            // Garantir remoção do menu mesmo em encerramentos abruptos
            try { if (_isPrimaryInstance) RemoverMenuDesktopContext(); } catch { }
        }

        // Propriedades estáticas necessárias para compatibilidade com outros arquivos
        public static IServiceProvider Services { get; private set; } = null!;
        public static ILoggingService? LoggingService { get; private set; }
        public static ISystemProfiler? SystemProfiler { get; private set; }
        public static ExtremeOptimizationsService? ExtremeOptimizations { get; private set; }
        public static UltraPerformanceService? UltraPerformance { get; private set; }
        public static UltraCleanerService? UltraCleaner { get; private set; }
        public static SystemCleaner? SystemCleaner { get; private set; }
        public static PerformanceOptimizer? PerformanceOptimizer { get; private set; }
        public static NetworkOptimizer? NetworkOptimizer { get; private set; }
        public static AdvancedOptimizer? AdvancedOptimizer { get; private set; }
        // public static GamerOptimizerService? GamerOptimizer { get; private set; } // LEGACY KILL SWITCHED
        public static AIOptimizerService? AIOptimizer { get; private set; }
        public static VoltrisOptimizer.Services.Gamer.Diagnostics.Interfaces.IGamerSelfProfiler? GamerSelfProfiler { get; private set; }
        public static HistoryService? HistoryService { get; private set; }
        public static GameDiagnosticsService? GameDiagnostics { get; private set; }
        public static VoltrisOptimizer.Services.Gamer.Overlay.Interfaces.IOverlayService? OverlayService { get; private set; }
        public static GameDetectionService? GameDetectionService { get; private set; }
        public static SchedulerService? SchedulerService { get; private set; }
        // TelemetryService mantido como null permanente — telemetria remota desativada.
        // Todas as chamadas App.TelemetryService?. viram no-op automaticamente.
        public static VoltrisOptimizer.Services.Telemetry.TelemetryService? TelemetryService => null;
        public static VoltrisOptimizer.Services.Thermal.IGlobalThermalMonitorService? ThermalMonitorService { get; private set; }
        public static VoltrisOptimizer.Services.Performance.HardwarePerformanceOptimizationService? HardwarePerformanceService { get; private set; }
        public static INeuralCoreService? NeuralCore { get; private set; }
        
        protected override async void OnStartup(StartupEventArgs e)
        {
            Core.Diagnostics.CrashDiagnostics.Mark("OnStartup ENTER");
            // Execução assíncrona com propagação de exceções para o handler global
            try
            {
                await InitializeInternalAsync(e);
            }
            catch (Exception ex)
            {
                Core.Diagnostics.CrashDiagnostics.TraceException("OnStartup FATAL", ex);
                MessageBox.Show($"Erro fatal na inicialização: {ex.Message}", "Erro Crítico", 
                    MessageBoxButton.OK, MessageBoxImage.Error);
                Shutdown();
            }
        }

        private async Task InitializeInternalAsync(StartupEventArgs e)
        {
            try
            {
                // 1. Configurar logging PRIMEIRO (para capturar Mutex e outros diagnósticos iniciais)
                var logDirectory = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                if (!Directory.Exists(logDirectory)) Directory.CreateDirectory(logDirectory);
                _loggingService = new VoltrisOptimizer.Services.Logging.ProfessionalLoggingService(logDirectory);
                LoggingService = _loggingService; 
                VoltrisOptimizer.Services.NotificationManager.Initialize(_loggingService);
                _loggingService.LogInfo("[App] === ONSTARTUP INICIADO ===");
                _loggingService.LogInfo("[App] ProfessionalLoggingService inicializado para Real-time logs");

                // PREVENIR SHUTDOWN AUTOMÁTICO DO WPF IMEDIATAMENTE
                ShutdownMode = ShutdownMode.OnExplicitShutdown;
                _loggingService.LogInfo("[App] ShutdownMode definido para OnExplicitShutdown");
                
                base.OnStartup(e);
                _loggingService.LogInfo("[App] Base.OnStartup concluído");
                
                // Iniciar proteção contra debugging e tampering (background, não bloqueia)
                try { Core.Security.RuntimeProtection.Initialize(); } catch { }

                // Aplicar configuração de transparência salva (antes de qualquer janela abrir)
                try
                {
                    var transparencyEnabled = SettingsService.Instance.Settings.EnableTransparency;
                    if (!transparencyEnabled)
                    {
                        var dicts = Resources.MergedDictionaries;
                        for (int i = dicts.Count - 1; i >= 0; i--)
                        {
                            var src = dicts[i].Source?.ToString() ?? string.Empty;
                            if (src.EndsWith("TransparencyOn.xaml", StringComparison.OrdinalIgnoreCase))
                            {
                                dicts.RemoveAt(i);
                                break;
                            }
                        }
                        dicts.Add(new System.Windows.ResourceDictionary
                        {
                            Source = new Uri("/UI/Themes/TransparencyOff.xaml", UriKind.Relative)
                        });
                    }
                }
                catch { }

                Core.Diagnostics.CrashDiagnostics.Mark("Registering exception handlers");
                // Tratamento global de exceções
                this.DispatcherUnhandledException += App_DispatcherUnhandledException;
                AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;
                TaskScheduler.UnobservedTaskException += TaskScheduler_UnobservedTaskException;
                
                // FirstChanceException: captura AccessViolationException e outras exceções nativas
                // ANTES que elas matem o processo (em .NET 8, [HandleProcessCorruptedStateExceptions] não funciona)
                AppDomain.CurrentDomain.FirstChanceException += (s, args) =>
                {
                    if (args.Exception is AccessViolationException or StackOverflowException)
                    {
                        try
                        {
                            var crashPath = System.IO.Path.Combine(
                                AppDomain.CurrentDomain.BaseDirectory, "Logs",
                                $"crash_native_{DateTime.Now:yyyyMMdd_HHmmss}.log");
                            System.IO.File.WriteAllText(crashPath,
                                $"[{DateTime.Now:O}] NATIVE CRASH (FirstChanceException)\n" +
                                $"Type: {args.Exception.GetType().Name}\n" +
                                $"Message: {args.Exception.Message}\n" +
                                $"StackTrace: {args.Exception.StackTrace}\n" +
                                $"Source: {args.Exception.Source}");
                        }
                        catch { }
                    }
                };
                _loggingService.LogInfo("[App] Manipuladores de exceção registrados");

                // Mutex para evitar múltiplas instâncias
                bool createdNew;
                _loggingService.LogInfo($"[App] Tentando criar Mutex: VoltrisOptimizer_SingleInstance (ProcessID: {System.Diagnostics.Process.GetCurrentProcess().Id})");
                
                _appMutex = new Mutex(true, "VoltrisOptimizer_SingleInstance", out createdNew);
                if (!createdNew)
                {
                    _loggingService.LogWarning("[App] Outra instância detectada!");
                    
                    var startupArgs = Environment.GetCommandLineArgs();
                    ContextMenuDebugLog($"[SECONDARY] Args recebidos: {string.Join(" | ", startupArgs)}");

                    if (startupArgs.Length > 1)
                    {
                        var cmdToSend = string.Join(" ", startupArgs.Skip(1));
                        ContextMenuDebugLog($"[SECONDARY] Enviando para instância principal: '{cmdToSend}'");
                        _loggingService.LogInfo("[App] Enviando comandos para a instância principal...");
                        EnviarComandoParaInstanciaPrincipal(cmdToSend);
                    }
                    else
                    {
                        ContextMenuDebugLog("[SECONDARY] Sem args — trazendo janela para frente");
                        TrazerInstanciaPrincipalParaFrente();
                    }

                    Shutdown();
                    return;
                }
                _loggingService.LogInfo("[App] Mutex criado com sucesso (Instância Única Confirmada)");
                _isPrimaryInstance = true;
                // Processar argumentos de linha de comando
                var args = Environment.GetCommandLineArgs();
                if (args.Length > 1)
                {
                    _ = HandleCommandLineArgsAsync(args);
                }
                bool startMinimized = false;
                if (args != null)
                {
                    foreach (var arg in args)
                    {
                        if (arg.Equals("/minimized", StringComparison.OrdinalIgnoreCase) || 
                            arg.Equals("-minimized", StringComparison.OrdinalIgnoreCase) ||
                            arg.Equals("--minimized", StringComparison.OrdinalIgnoreCase))
                        {
                            startMinimized = true;
                            break;
                        }
                    }
                }
                
                _loggingService?.LogInfo($"[App] StartMinimized (arg): {startMinimized}");

                // === STARTUP MANAGER INTEGRAÇÃO ===
                try 
                {
                    _loggingService.LogInfo("[App] Inicializando StartupManager...");
                    var startupManager = new StartupManager(_loggingService);
                    
                    // Obter configurações
                    var settings = SettingsService.Instance.Settings;
                    bool startWithWindows = settings.StartWithWindows;
                    bool configStartMinimized = settings.StartMinimized;
                    
                    // Configurar startup (Habilitar ou Desabilitar) conforme preferência do usuário
                    // Isso corrige o problema de "Habilitado no Task Manager mas não inicia" ao garantir
                    // que a chave de registro esteja sempre atualizada e correta (ou removida se desativado)
                    startupManager.SetStartup(startWithWindows, configStartMinimized);
                    
                    _loggingService.LogInfo($"[App] StartupManager executado. StartWithWindows: {startWithWindows}, Minimized: {configStartMinimized}");
                }
                catch (Exception ex)
                {
                    _loggingService.LogError($"[App] Falha ao executar StartupManager: {ex.Message}", ex);
                    // Não impede o app de abrir, apenas loga o erro
                }

                _loggingService.LogInfo("[App] Iniciando aplicação...");

                // ═══════════════════════════════════════════════════════════════
                // SPLASH IMEDIATO: Mostrar splash ANTES de qualquer trabalho pesado
                // Isso garante que o usuário veja feedback visual instantâneo
                // ═══════════════════════════════════════════════════════════════
                if (!startMinimized)
                {
                    _splashWindow = new SplashWindow();
                    _splashWindow.WindowStartupLocation = WindowStartupLocation.CenterScreen;
                    _splashWindow.Show();
                    _splashWindow.Activate();
                    _splashWindow.SetProgress(3);
                    _splashWindow.SetStatus("Inicializando...");
                    _loggingService.LogInfo("[SPLASH] 3% — Inicializando...");
                    
                    // Forçar renderização do splash antes de continuar
                    await Dispatcher.InvokeAsync(() => { }, System.Windows.Threading.DispatcherPriority.Render);
                    await Task.Delay(100);
                }

                // OTIMIZAÇÃO DE PERFORMANCE: Delay adaptativo baseado em contexto de inicialização
                // Boot do Windows (minimizado): Delay necessário para estabilização do sistema
                // Abertura manual: SEM delay (splash já está visível)
                if (startMinimized)
                {
                    var processorCount = Environment.ProcessorCount;
                    var delaySeconds = processorCount < 4 ? 5 : processorCount < 8 ? 3 : 2;
                    _loggingService.LogInfo($"[App] Boot minimizado — aguardando {delaySeconds}s para estabilização do sistema");
                    await Task.Delay(delaySeconds * 1000);
                }

                // Configurar injeção de dependências via Bootstrapper
                _loggingService?.LogInfo("[SPLASH] Etapa: Configurando serviços...");
                await SplashStepAsync(10, "Configurando serviços...");
                
                Core.Diagnostics.CrashDiagnostics.Mark("Bootstrapper START");
                _loggingService?.LogInfo("[App] Iniciando Bootstrapper...");
                _serviceProvider = VoltrisOptimizer.Core.Bootstrapper.ConfigureServices(_loggingService!);
                _loggingService?.LogInfo("[App] Bootstrapper concluído - ServiceProvider criado");
                Core.Diagnostics.CrashDiagnostics.Mark("Bootstrapper END");
                Services = _serviceProvider;
                _loggingService?.LogInfo("[App] ServiceProvider criado");

                await SplashStepAsync(18, "Registrando módulos...");

                // Sistema de telemetria remota removido.

                await SplashStepAsync(25, "Conectando serviços de rede...");

                // Inicializar ServiceLocator
                ServiceLocator.Initialize(_serviceProvider);
                _loggingService?.LogInfo("[App] ServiceLocator inicializado");

                await SplashStepAsync(32, "Carregando módulos principais...");

                // ═══════════════════════════════════════════════════════════════
                // RESOLUÇÃO DE SERVIÇOS: Mover para background thread
                // GetService pode acionar construtores pesados (WMI, etc.)
                // ═══════════════════════════════════════════════════════════════
                await Task.Run(() =>
                {
                    _loggingService?.LogInfo("[SPLASH] Resolvendo serviços em background thread...");
                    SystemProfiler = _serviceProvider.GetService<ISystemProfiler>();
                    ExtremeOptimizations = _serviceProvider.GetService<ExtremeOptimizationsService>();
                    UltraPerformance = _serviceProvider.GetService<UltraPerformanceService>();
                    UltraCleaner = _serviceProvider.GetService<UltraCleanerService>();
                    SystemCleaner = _serviceProvider.GetService<SystemCleaner>();
                    PerformanceOptimizer = _serviceProvider.GetService<PerformanceOptimizer>();
                    NetworkOptimizer = _serviceProvider.GetService<NetworkOptimizer>();
                    AdvancedOptimizer = _serviceProvider.GetService<AdvancedOptimizer>();
                    AIOptimizer = _serviceProvider.GetService<AIOptimizerService>();
                    GamerSelfProfiler = _serviceProvider.GetService<VoltrisOptimizer.Services.Gamer.Diagnostics.Interfaces.IGamerSelfProfiler>();
                    HistoryService = _serviceProvider.GetService<HistoryService>();
                    GameDiagnostics = _serviceProvider.GetService<GameDiagnosticsService>();
                    OverlayService = _serviceProvider.GetService<VoltrisOptimizer.Services.Gamer.Overlay.Interfaces.IOverlayService>();
                    GameDetectionService = _serviceProvider.GetService<GameDetectionService>();
                    SchedulerService = _serviceProvider.GetService<SchedulerService>();
                    ThermalMonitorService = _serviceProvider.GetService<VoltrisOptimizer.Services.Thermal.IGlobalThermalMonitorService>();
                    NeuralCore = _serviceProvider.GetService<INeuralCoreService>();
                    _loggingService?.LogInfo("[SPLASH] Serviços resolvidos com sucesso.");
                });

                await SplashStepAsync(48, "Inicializando módulos...");
                
                // CORREÇÃO PERFORMANCE: GamerViewModel e ShieldNotifications movidos para
                // inicialização tardia (após MainWindow abrir). Resolver ViewModels pesados
                // durante o splash compete com a renderização e atrasa a abertura.
                // Serão inicializados sob demanda quando o usuário navegar para essas páginas.

                await SplashStepAsync(58, "Verificando serviços...");
                
                // Verificar serviços críticos
                var missingServices = new List<string>();
                if (SystemProfiler == null) missingServices.Add("SystemProfiler");
                if (SystemCleaner == null) missingServices.Add("SystemCleaner");
                if (PerformanceOptimizer == null) missingServices.Add("PerformanceOptimizer");
                if (NetworkOptimizer == null) missingServices.Add("NetworkOptimizer");
                if (AdvancedOptimizer == null) missingServices.Add("AdvancedOptimizer");
                
                if (missingServices.Count > 0)
                {
                    _loggingService?.LogWarning($"[App] Serviços não inicializados: {string.Join(", ", missingServices)}");
                }
                
                await SplashStepAsync(65, "Ativando monitoramento...");
                
                if (missingServices.Count == 0)
                {
                    // IRE v2: Startup Mode imediato — age ANTES do delay do DSL
                    // Não bloqueia o splash (fire-and-forget com budget de 200ms)
                    _ = Task.Run(async () =>
                    {
                        try
                        {
                            Core.Diagnostics.CrashDiagnostics.Mark("IRE StartupMode BEGIN");
                            var ire = _serviceProvider.GetService<VoltrisOptimizer.Services.Responsiveness.IImmediateResponsivenessEngine>();
                            if (ire != null)
                            {
                                await ire.RunStartupModeAsync();
                                _ = ire.StartAdaptiveLoopAsync();
                                _loggingService?.LogSuccess("[App] IRE v2 ATIVADO (startup + adaptive loop).");
                            }
                            Core.Diagnostics.CrashDiagnostics.Mark("IRE StartupMode END");
                        }
                        catch (Exception ex)
                        {
                            Core.Diagnostics.CrashDiagnostics.TraceException("IRE_Start", ex);
                            _loggingService?.LogError($"[App] Falha no IRE v2: {ex.Message}");
                        }
                    });

                    // MOVER TODA INICIALIZAÇÃO PESADA PARA BACKGROUND
                    // Não bloqueia o splash e não compete com a renderização da UI
                    _ = Task.Run(async () =>
                    {
                        try
                        {
                            // CORREÇÃO: Delay reduzido de 3s para 2s — DSL 5.0 é leve e não compete com a UI.
                            await Task.Delay(2000);

                            // INICIAR BACKGROUND SCHEDULER — orquestrador central de tarefas periódicas.
                            // Deve ser o primeiro serviço a subir para que os demais possam se registrar.
                            Core.BackgroundScheduler.Instance.Start();
                            _loggingService?.LogSuccess("[App] BackgroundScheduler INICIADO.");

                            // INICIAR SYSTEM METRICS CACHE — fonte única de CPU%, RAM, LastInput.
                            // Todos os serviços leem daqui; elimina N chamadas duplicadas ao kernel.
                            Core.SystemMetricsCache.Instance.Start();
                            _loggingService?.LogSuccess("[App] SystemMetricsCache INICIADO.");

                            // INICIAR FOREGROUND TRACKER — WinEventHook para detectar janela em foco.
                            // Substitui GetForegroundWindow() polling em todos os serviços.
                            Core.ForegroundWindowTracker.Instance.Start();
                            _loggingService?.LogSuccess("[App] ForegroundWindowTracker INICIADO.");
                            
                            // INICIAR AGENTE DE ESTABILIDADE GLOBAL
                            try
                            {
                                Core.Diagnostics.CrashDiagnostics.Mark("DSL StartGlobalAsync BEGIN");
                                var stabilizer = _serviceProvider.GetRequiredService<VoltrisOptimizer.Services.Optimization.IDynamicLoadStabilizer>();
                                var settings = VoltrisOptimizer.Services.SettingsService.Instance.Settings;
                                stabilizer.SetProfile(settings.IntelligentProfile);
                                _ = stabilizer.StartGlobalAsync();
                                _loggingService?.LogSuccess("[App] Stability Agent ATIVADO (background).");
                                Core.Diagnostics.CrashDiagnostics.Mark("DSL StartGlobalAsync END");
                            }
                            catch (Exception ex)
                            {
                                Core.Diagnostics.CrashDiagnostics.TraceException("DSL_Start", ex);
                                _loggingService?.LogError($"[App] Falha no Agente de Estabilidade: {ex.Message}");
                            }
                            
                            // ATIVAR VOLTRIS SHIELD (proteção em tempo real)
                            // Ativa o Shield no startup para que o tooltip e status reflitam corretamente.
                            // Antes, o Shield só era ativado quando o usuário navegava para a página Shield.
                            try
                            {
                                var shieldService = _serviceProvider.GetService<VoltrisOptimizer.Services.Shield.VoltrisShieldService>();
                                if (shieldService != null && !shieldService.IsProtectionActive)
                                {
                                    await shieldService.ActivateProtectionAsync();
                                    _loggingService?.LogSuccess("[App] Voltris Shield ATIVADO (background).");
                                }
                            }
                            catch (Exception ex)
                            {
                                _loggingService?.LogError($"[App] Falha ao ativar Voltris Shield: {ex.Message}");
                            }

                            // INICIAR MONITORAMENTO TÉRMICO GLOBAL
                            try
                            {
                                var thermalService = _serviceProvider.GetRequiredService<VoltrisOptimizer.Services.Thermal.IGlobalThermalMonitorService>();
                                _ = thermalService.StartMonitoringAsync();
                                _loggingService?.LogSuccess("[App] Monitoramento Térmico ATIVADO (background).");
                            }
                            catch (Exception ex)
                            {
                                _loggingService?.LogError($"[App] Falha no Monitoramento Térmico: {ex.Message}");
                            }

                            // INICIAR SERVIÇO INTELIGENTE DE PLANO DE ENERGIA
                            try
                            {
                                var powerPlanService = _serviceProvider.GetService<VoltrisOptimizer.Services.Power.IntelligentPowerPlanService>();
                                if (powerPlanService != null)
                                {
                                    _ = powerPlanService.InitializeAsync();
                                    _loggingService?.LogSuccess("[App] Plano de Energia Inteligente ATIVADO (background).");
                                }
                            }
                            catch (Exception ex)
                            {
                                _loggingService?.LogError($"[App] Falha no Plano de Energia Inteligente: {ex.Message}");
                            }

                            // NOTA: CpuProfileOptimizationService é chamado pelo OptimizationManager.ApplyIntelligentOptimizationsAsync()
                            // via delegação interna. Não chamar diretamente aqui para evitar aplicação duplicada.

                            // INICIAR OPTIMIZATION MANAGER CENTRAL (GPU, Latency, PCIe + CPU delegado)
                            try
                            {
                                var optManager = _serviceProvider.GetService<VoltrisOptimizer.Services.Power.OptimizationManager>();
                                if (optManager != null)
                                {
                                    var currentProfile = VoltrisOptimizer.Services.SettingsService.Instance.Settings.IntelligentProfile;
                                    _ = optManager.ApplyIntelligentOptimizationsAsync(currentProfile);
                                    _loggingService?.LogSuccess("[App] Optimization Manager ATIVADO (background).");
                                }
                            }
                            catch (Exception ex)
                            {
                                _loggingService?.LogError($"[App] Falha no Optimization Manager: {ex.Message}");
                            }

                            // INICIAR VOLTRIS NEURAL CORE (Hardware Surgery, Context-Aware Morphing, Predictive Healing)
                            try
                            {
                                var neuralCore = _serviceProvider.GetService<INeuralCoreService>();
                                if (neuralCore != null)
                                {
                                    neuralCore.Start();
                                    _loggingService?.LogSuccess("[App] VOLTRIS NEURAL CORE ATIVADO (background).");
                                }
                            }
                            catch (Exception ex)
                            {
                                _loggingService?.LogError($"[App] Falha ao ativar Neural Core: {ex.Message}");
                            }

                            // INICIAR OTIMIZAÇÃO DE PERFORMANCE DE HARDWARE
                            try
                            {
                                var hardwarePerfService = _serviceProvider.GetService<VoltrisOptimizer.Services.Performance.HardwarePerformanceOptimizationService>();
                                if (hardwarePerfService != null)
                                {
                                    HardwarePerformanceService = hardwarePerfService;
                                    _loggingService?.LogSuccess("[App] Hardware Performance PRONTA (background).");
                                }
                            }
                            catch (Exception ex)
                            {
                                _loggingService?.LogError($"[App] Falha na Otimização de Performance: {ex.Message}");
                            }
                        }
                        catch (Exception ex)
                        {
                            _loggingService?.LogError($"[App] Erro na inicialização de background: {ex.Message}");
                        }
                    });
                }

                // AGENDAMENTO AUTOMÁTICO: Limpeza Inteligente Semanal
                if (SchedulerService != null && !SchedulerService.GetTasks().Any(t => t.Name == "Limpeza Inteligente Automática"))
                {
                    SchedulerService.AddTask(new ScheduledTask
                    {
                        Name = "Limpeza Inteligente Automática",
                        Actions = new List<string> { "limpeza_inteligente" },
                        ScheduleType = ScheduleType.Weekly,
                        NextExecution = DateTime.Now.AddDays(1) // Começa amanha para não travar o primeiro uso
                    });
                }

                _loggingService.LogInfo("[App] Todos os serviços inicializados com sucesso");

                // REGISTRAR MENU DE CONTEXTO (se habilitado)
                try
                {
                    if (SettingsService.Instance.Settings.EnableDesktopContextMenu)
                    {
                        RegistrarMenuDesktopContext();
                    }
                }
                catch (Exception ex)
                {
                    _loggingService?.LogError($"[App] Falha ao registrar menu de contexto no startup: {ex.Message}");
                }

                await SplashStepAsync(72, "Preparando interface...");

                // Crash Protection: restaurar sistema em background (não bloqueia UI)
                _ = Task.Run(async () =>
                {
                    try
                    {
                        var orchestrator = _serviceProvider.GetService<VoltrisOptimizer.Services.Gamer.Interfaces.IGamerModeOrchestrator>();
                        if (orchestrator != null)
                            await orchestrator.RestoreIfCrashedAsync();
                    }
                    catch { }
                });

                await SplashStepAsync(78, "Verificando proteções...");

                // Iniciar fluxo da aplicação (Welcome, License, MainWindow)
                await InitializeApplicationFlowAsync(startMinimized);

                _loggingService?.LogInfo("[App] === ONSTARTUP CONCLUÍDO COM SUCESSO ===");
            }
            catch (Exception ex)
            {
                _loggingService?.LogError($"[App] Erro crítico em OnStartup: {ex.Message}", ex);
                MessageBox.Show($"Erro fatal na inicialização: {ex.Message}", "Erro Crítico", MessageBoxButton.OK, MessageBoxImage.Error);
                Shutdown();
            }
        }

        private async Task InitializeApplicationFlowAsync(bool startMinimized)
        {
            try
            {
                _loggingService?.LogInfo($"[App] === INITIALIZEAPPLICATIONFLOWASYNC INICIADO (StartMinimized: {startMinimized}) ===");
                
                UI.MainWindow mainWindow = null;

                // Se iniciar minimizado, pular Welcome e Splash para ser discreto
                // MAS: se for a primeira vez, mostrar Welcome mesmo assim
                var settings = SettingsService.Instance.Settings;
                bool isFirstRun = settings.IsFirstRun;
                bool isLinked = settings.IsDeviceLinked && !string.IsNullOrEmpty(settings.LinkedUserEmail);
                bool showWelcomeEvenWhenMinimized = isFirstRun || !isLinked;
                
                if (startMinimized && !showWelcomeEvenWhenMinimized)
                {
                    _loggingService?.LogInfo("[App] Iniciando em modo DISCRETO (Background)");
                    
                    var trialService = TrialProtectionService.Instance;
                    trialService.InitializeTrial();
                    
                    mainWindow = new UI.MainWindow();
                    mainWindow.Show();
                    
                    _loggingService?.LogInfo("[App] MainWindow criada em modo background");
                    return;
                }

                // --- FLUXO NORMAL ---
                // Splash já está visível (criado em InitializeInternalAsync)
                
                // CORREÇÃO AUTOMÁTICA: Se tem email mas não está marcado como vinculado, corrigir
                if (!settings.IsDeviceLinked && !string.IsNullOrEmpty(settings.LinkedUserEmail))
                {
                    settings.IsDeviceLinked = true;
                    SettingsService.Instance.SaveSettings();
                    isLinked = true;
                }
                
                bool showWelcome = isFirstRun || (!isLinked && !settings.WelcomePromptShown);
                
                await SplashStepAsync(82, "Verificando configuração...");
                
                if (showWelcome)
                {
                    _loggingService?.LogInfo("[App] Mostrando WelcomeLinkWindow");
                    
                    // Fechar splash antes de mostrar Welcome (para não sobrepor)
                    if (_splashWindow != null && _splashWindow.IsVisible)
                    {
                        _splashWindow.AllowClose();
                        _splashWindow.Close();
                        _splashWindow = null;
                    }
                    
                    var welcomeWindow = new WelcomeLinkWindow();
                    welcomeWindow.WindowStartupLocation = WindowStartupLocation.CenterScreen;
                    welcomeWindow.ShowDialog();
                    _loggingService?.LogInfo($"[App] WelcomeLinkWindow FECHADA. LinkRequested: {welcomeWindow.LinkRequested}");
                    
                    settings.IsFirstRun = false;
                    SettingsService.Instance.SaveSettings();
                    
                    // Sem recriar splash — prosseguir direto para licença/MainWindow
                }
                else
                {
                    await SplashStepAsync(88, "Verificando licença...");
                }

                // ETAPA: Verificação de Licença
                var licenseManager = LicenseManager.Instance;
                var trialService2 = TrialProtectionService.Instance;
                trialService2.InitializeTrial();
                
                bool isLicenseValid = LicenseManager.IsPro;
                bool isTrialExpired = trialService2.IsTrialExpired();
                int trialDaysRemaining = trialService2.GetDaysRemaining();
                
                bool showLicense = isTrialExpired && !isLicenseValid;
                _loggingService?.LogInfo($"[App] Licença - IsPro: {isLicenseValid}, Expired: {isTrialExpired}, Days: {trialDaysRemaining}, showLicense: {showLicense}");

                if (showLicense)
                {
                    // Fechar splash antes de mostrar licença
                    if (_splashWindow != null && _splashWindow.IsVisible)
                    {
                        _splashWindow.AllowClose();
                        _splashWindow.Close();
                    }
                    
                    var licenseWindow = new LicenseActivationView(isTrialExpired, trialDaysRemaining);
                    licenseWindow.WindowStartupLocation = WindowStartupLocation.CenterScreen;
                    var licenseResult = licenseWindow.ShowDialog();

                    if (!licenseResult.HasValue || !licenseResult.Value)
                    {
                        if (isTrialExpired)
                        {
                            _loggingService?.LogInfo("[App] Trial expirado e usuário fechou janela - encerrando");
                            Shutdown();
                            return;
                        }
                        else
                        {
                            licenseWindow.ContinuedWithTrial = true;
                        }
                    }

                    if (licenseWindow.ActivationSucceeded || licenseWindow.ContinuedWithTrial)
                    {
                        settings.LicensePageShown = true;
                        SettingsService.Instance.SaveSettings();
                    }
                    else if (isTrialExpired)
                    {
                        Shutdown();
                        return;
                    }
                }
                else
                {
                    if (!settings.FirstRunDate.HasValue)
                    {
                        settings.FirstRunDate = DateTime.Now;
                        SettingsService.Instance.SaveSettings();
                    }
                }

                // ETAPA FINAL: Fechar splash e abrir MainWindow
                await SplashStepAsync(94, "Abrindo Voltris...");
                
                await SplashStepAsync(100, "Concluído!");
                await Task.Delay(200);
                
                // Fechar splash
                if (_splashWindow != null && _splashWindow.IsVisible)
                {
                    _splashWindow.AllowClose();
                    _splashWindow.Close();
                }
                _splashWindow = null;
                
                // Criar MainWindow no thread da UI
                mainWindow = new UI.MainWindow();
                
                mainWindow.WindowStartupLocation = WindowStartupLocation.CenterScreen;
                mainWindow.Show();
                mainWindow.Activate();
                mainWindow.WindowState = WindowState.Normal;
                mainWindow.Visibility = Visibility.Visible;
                mainWindow.ShowInTaskbar = true;

                _loggingService?.LogInfo("[App] Aplicação inicializada com sucesso");
            }
            catch (Exception ex)
            {
                _loggingService?.LogError($"[App] ERRO FATAL em InitializeApplicationFlowAsync: {ex.Message}", ex);
                throw;
            }
        }

        private void App_DispatcherUnhandledException(object sender, System.Windows.Threading.DispatcherUnhandledExceptionEventArgs e)
        {
            Core.Diagnostics.CrashDiagnostics.TraceException("DISPATCHER_UNHANDLED", e.Exception);
            _loggingService?.LogError($"[App] DISPATCHER UNHANDLED EXCEPTION: {e.Exception.Message}", e.Exception);
            _loggingService?.LogError($"[App] StackTrace: {e.Exception.StackTrace}", e.Exception);
            
            // Crash dump de emergência para exceções do Dispatcher
            try
            {
                var crashPath = System.IO.Path.Combine(
                    AppDomain.CurrentDomain.BaseDirectory, "Logs",
                    $"crash_dispatcher_{DateTime.Now:yyyyMMdd_HHmmss}.log");
                System.IO.File.WriteAllText(crashPath,
                    $"[{DateTime.Now:O}] DISPATCHER CRASH\n" +
                    $"Exception: {e.Exception}\n" +
                    $"InnerException: {e.Exception.InnerException}");
            }
            catch { }
            
            // Telemetry: Force flush exception to ensure it reaches the server before potential crash
            _ = TelemetryService?.TrackExceptionAsync(e.Exception, "DispatcherUnhandledException");
            
            e.Handled = true;
        }

        private void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
        {
            Core.Diagnostics.CrashDiagnostics.Mark($"DOMAIN_UNHANDLED IsTerminating={e.IsTerminating}");
            if (e.ExceptionObject is Exception ex)
            {
                Core.Diagnostics.CrashDiagnostics.TraceException("DOMAIN_UNHANDLED", ex);
                _loggingService?.LogError($"[App] CURRENT DOMAIN UNHANDLED EXCEPTION: {ex.Message}", ex);
                _loggingService?.LogError($"[App] StackTrace: {ex.StackTrace}", ex);
                
                // Crash dump de emergência — gravar direto no disco para não perder
                try
                {
                    var crashPath = System.IO.Path.Combine(
                        AppDomain.CurrentDomain.BaseDirectory, "Logs",
                        $"crash_{DateTime.Now:yyyyMMdd_HHmmss}.log");
                    System.IO.File.WriteAllText(crashPath,
                        $"[{DateTime.Now:O}] FATAL CRASH\n" +
                        $"IsTerminating: {e.IsTerminating}\n" +
                        $"Exception: {ex}\n" +
                        $"InnerException: {ex.InnerException}");
                }
                catch { }
                
                // Telemetry
                _ = TelemetryService?.TrackExceptionAsync(ex, "CurrentDomain_UnhandledException");
            }
            else
            {
                _loggingService?.LogError($"[App] CURRENT DOMAIN UNHANDLED EXCEPTION (objeto): {e.ExceptionObject}");
            }
        }

        private void TaskScheduler_UnobservedTaskException(object? sender, UnobservedTaskExceptionEventArgs e)
        {
            _loggingService?.LogError($"[App] UNOBSERVED TASK EXCEPTION: {e.Exception?.Flatten().InnerException?.Message ?? e.Exception?.Message}", e.Exception);
            _loggingService?.LogError($"[App] StackTrace: {e.Exception?.Flatten().InnerException?.StackTrace ?? e.Exception?.StackTrace}");
            e.SetObserved(); // Prevenir crash do processo
        }

        protected override void OnExit(ExitEventArgs e)
        {
            Core.Diagnostics.CrashDiagnostics.Mark("OnExit ENTER — normal shutdown");
            // Cleanup rápido e não-bloqueante.
            // Gamer Mode já foi desativado pelo ExitApplication() — não duplicar.
            // Chamadas HTTP (Enterprise, Session) são fire-and-forget com timeout curto.

            // Parar proteção de runtime
            try { Core.Security.RuntimeProtection.Shutdown(); } catch { }

            // Parar BackgroundScheduler, SystemMetricsCache e ForegroundWindowTracker
            try { Core.BackgroundScheduler.Instance.StopAsync().Wait(TimeSpan.FromSeconds(2)); } catch { }
            try { Core.SystemMetricsCache.Instance.Stop(); } catch { }
            try { Core.ForegroundWindowTracker.Instance.Stop(); } catch { }

            try
            {
                if (_serviceProvider != null)
                {
                    // CORREÇÃO CRÍTICA: Restaurar configurações de CPU antes de sair.
                    // Isso garante que Max Processor State, Core Parking, EPP e Turbo Boost
                    // sejam revertidos ao estado original — evita lentidão permanente.
                    try
                    {
                        var cpuProfile = _serviceProvider.GetService<VoltrisOptimizer.Services.Power.CpuProfileOptimizationService>();
                        if (cpuProfile != null && cpuProfile.IsApplied)
                        {
                            _loggingService?.LogInfo("[App] Restaurando configurações de CPU...");
                            Task.Run(() => cpuProfile.RestoreOriginalAsync()).Wait(TimeSpan.FromSeconds(5));
                            _loggingService?.LogInfo("[App] Configurações de CPU restauradas.");
                        }
                    }
                    catch { }

                    // CORREÇÃO CRÍTICA: Restaurar plano de energia nativo do Windows.
                    // O IntelligentPowerPlanService cria planos "Voltris - *" que persistem
                    // no Windows. Ao fechar, restaurar o plano Balanceado nativo para que
                    // o sistema não fique com configurações do Voltris após reiniciar.
                    try
                    {
                        var powerPlanService = _serviceProvider.GetService<VoltrisOptimizer.Services.Power.IntelligentPowerPlanService>();
                        if (powerPlanService != null)
                        {
                            _loggingService?.LogInfo("[App] Restaurando plano de energia nativo...");
                            Task.Run(() => powerPlanService.RestoreOriginalPlanAsync()).Wait(TimeSpan.FromSeconds(5));
                            _loggingService?.LogInfo("[App] Plano de energia nativo restaurado.");
                        }
                    }
                    catch { }

                    // Enterprise + Session: fire-and-forget com timeout de 2s
                    // Não bloquear o encerramento por causa de chamadas de rede
                    _ = Task.Run(async () =>
                    {
                        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(2));
                        try
                        {
                            var tasks = new List<Task>();

                            var enterprise = _serviceProvider.GetService<VoltrisOptimizer.Services.Enterprise.EnterpriseService>();
                            if (enterprise != null)
                                tasks.Add(enterprise.StopBackgroundServicesAsync());

                            var session = _serviceProvider.GetService<VoltrisOptimizer.Services.Session.SessionManager>();
                            if (session != null)
                                tasks.Add(session.EndSessionAsync());

                            await Task.WhenAll(tasks).WaitAsync(cts.Token);
                        }
                        catch { }
                    });
                }

                // Overlay: fire-and-forget (sem await)
                if (OverlayService != null && OverlayService.IsActive)
                {
                    _ = OverlayService.StopAsync();
                }

                // Dispose do ServiceProvider com timeout curto (2s)
                // Isso dispara Orchestrator.Dispose() que já verifica IsActive
                if (_serviceProvider is IDisposable disposableProvider)
                {
                    try
                    {
                        Task.Run(() => disposableProvider.Dispose()).Wait(TimeSpan.FromSeconds(2));
                    }
                    catch { }
                }
            }
            catch { }
            
            // Remover menu de contexto do desktop ao fechar
            try { if (_isPrimaryInstance) RemoverMenuDesktopContext(); } catch { }

            // Mutex: liberação rápida
            try
            {
                if (_appMutex != null)
                {
                    try { _appMutex.ReleaseMutex(); } catch { }
                    _appMutex.Dispose();
                    _appMutex = null;
                }
            }
            catch { }
            
            Core.Diagnostics.CrashDiagnostics.Shutdown();
            base.OnExit(e);
        }

        /// <summary>
        /// Helper para inicializar serviço em background com proteção contra exceções
        /// </summary>
        private async Task SafeInitAsync(string name, Func<Task> action)
        {
            try
            {
                await action();
                _loggingService?.LogInfo($"[App] {name} inicializado.");
            }
            catch (Exception ex)
            {
                _loggingService?.LogError($"[App] Falha {name}: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Atualiza o splash com progresso e status, garantindo que a UI renderize.
        /// Tempo mínimo entre etapas para que o usuário veja cada passo.
        /// </summary>
        private async Task SplashStepAsync(double progress, string status)
        {
            if (_splashWindow == null) return;
            
            _loggingService?.LogInfo($"[SPLASH] {progress:F0}% — {status}");
            
            _splashWindow.SetProgress(progress);
            _splashWindow.SetStatus(status);
            
            // Yield para a UI thread renderizar a animação e o texto
            await Dispatcher.InvokeAsync(() => { }, System.Windows.Threading.DispatcherPriority.Render);
            
            // Tempo mínimo para o usuário ver a etapa (a animação da barra precisa de tempo)
            await Task.Delay(120);
        }

        #region CLI & Context Menu Handling

        public async Task HandleCommandLineArgsAsync(string[] args)
        {
            if (args == null || args.Length == 0) return;

            ContextMenuDebugLog($"[HANDLER] HandleCommandLineArgsAsync chamado. Args: {string.Join(" | ", args)}");

            // Aguardar inicialização mínima dos serviços se necessário
            int retry = 0;
            while (Services == null && retry < 10)
            {
                await Task.Delay(500);
                retry++;
            }

            if (Services == null)
            {
                ContextMenuDebugLog("[HANDLER] ERRO: Services == null após espera. Abortando.");
                return;
            }

            _loggingService?.LogInfo($"[App] Executando comandos CLI: {string.Join(" ", args)}");

            try
            {
                foreach (var arg in args)
                {
                    ContextMenuDebugLog($"[HANDLER] Processando arg: '{arg}'");
                    if (arg.Equals("/show", StringComparison.OrdinalIgnoreCase))
                    {
                        ContextMenuDebugLog("[HANDLER] /show — restaurando janela do systray");
                        await System.Windows.Application.Current?.Dispatcher.InvokeAsync(() =>
                        {
                            var mainWindow = System.Windows.Application.Current?.MainWindow as UI.MainWindow;
                            mainWindow?.ShowFromContextMenu();
                        });
                    }
                    else if (arg.Equals("/boost", StringComparison.OrdinalIgnoreCase))
                    {
                        var orchestrator = Services.GetService<VoltrisOptimizer.Services.Gamer.Interfaces.IGamerModeOrchestrator>();
                        ContextMenuDebugLog($"[HANDLER] /boost — orchestrator={orchestrator != null}");
                        if (orchestrator != null) 
                        {
                            var options = orchestrator.GetCurrentOptions();
                            await orchestrator.ActivateAsync(options);
                        }
                    }
                    else if (arg.Equals("/optimize", StringComparison.OrdinalIgnoreCase))
                    {
                        ContextMenuDebugLog($"[HANDLER] /optimize — usando DashboardViewModel.QuickOptimizeAsync");
                        var dashVM = Services?.GetService<VoltrisOptimizer.UI.ViewModels.DashboardViewModel>();
                        if (dashVM != null)
                        {
                            var dispatcher = System.Windows.Application.Current?.Dispatcher;
                            if (dispatcher != null && !dispatcher.CheckAccess())
                                await dispatcher.InvokeAsync(async () => await dashVM.QuickOptimizeAsync("ContextMenu"));
                            else
                                await dashVM.QuickOptimizeAsync("ContextMenu");
                        }
                        else
                        {
                            ContextMenuDebugLog("[HANDLER] /optimize — DashboardViewModel não disponível, fallback AIOptimizer");
                            if (AIOptimizer != null) await AIOptimizer.PerformIntelligentOptimizationAsync();
                        }
                    }
                    else if (arg.Equals("/cleanup", StringComparison.OrdinalIgnoreCase))
                    {
                        ContextMenuDebugLog($"[HANDLER] /cleanup — usando DashboardViewModel.QuickCleanupAsync");
                        var dashVM = Services?.GetService<VoltrisOptimizer.UI.ViewModels.DashboardViewModel>();
                        if (dashVM != null)
                        {
                            var dispatcher = System.Windows.Application.Current?.Dispatcher;
                            if (dispatcher != null && !dispatcher.CheckAccess())
                                await dispatcher.InvokeAsync(async () => await dashVM.QuickCleanupAsync("ContextMenu"));
                            else
                                await dashVM.QuickCleanupAsync("ContextMenu");
                        }
                        else
                        {
                            ContextMenuDebugLog("[HANDLER] /cleanup — DashboardViewModel não disponível, fallback SystemCleaner");
                            if (SystemCleaner != null) await SystemCleaner.CleanTempFilesAsync();
                        }
                    }
                    else if (arg.Equals("/status", StringComparison.OrdinalIgnoreCase))
                    {
                        ContextMenuDebugLog("[HANDLER] /status");
                        if (ThermalMonitorService != null)
                        {
                            var metrics = ThermalMonitorService.CurrentMetrics;
                            string status = $"CPU: {metrics?.CpuTemperature:F0}°C | GPU: {metrics?.GpuTemperature:F0}°C | Sistema Estável";
                            VoltrisOptimizer.Services.NotificationManager.Show("Voltris Status", status, VoltrisOptimizer.Services.NotificationType.Info);
                        }
                    }
                    else if (arg.Equals("/network", StringComparison.OrdinalIgnoreCase))
                    {
                        ContextMenuDebugLog("[HANDLER] /network — otimização de rede via NetworkOptimizer");
                        if (NetworkOptimizer != null)
                        {
                            GlobalProgressService.Instance.StartOperation("Otimização de Rede", isPriority: true);
                            try
                            {
                                GlobalProgressService.Instance.UpdateProgress(10, "Limpando cache DNS...");
                                await NetworkOptimizer.FlushDnsAsync(p => GlobalProgressService.Instance.UpdateProgress(10 + (int)(p * 0.3), "Limpando cache DNS..."));

                                GlobalProgressService.Instance.UpdateProgress(40, "Renovando DHCP...");
                                await NetworkOptimizer.RenewDhcpAsync(p => GlobalProgressService.Instance.UpdateProgress(40 + (int)(p * 0.3), "Renovando DHCP..."));

                                GlobalProgressService.Instance.UpdateProgress(70, "Otimizando TCP/IP...");
                                await NetworkOptimizer.OptimizeTcpSettingsAsync(p => GlobalProgressService.Instance.UpdateProgress(70 + (int)(p * 0.25), "Otimizando TCP/IP..."));

                                GlobalProgressService.Instance.CompleteOperation("Rede Otimizada");
                                VoltrisOptimizer.Services.NotificationManager.Show("Rede Otimizada", "DNS, DHCP e TCP/IP otimizados com sucesso.", VoltrisOptimizer.Services.NotificationType.Success);
                                App.TelemetryService?.TrackEvent("NETWORK_OPTIMIZE", "ContextMenu", "Complete", success: true);
                            }
                            catch (Exception ex)
                            {
                                GlobalProgressService.Instance.CompleteOperation("Erro na Rede");
                                ContextMenuDebugLog($"[HANDLER] /network ERRO: {ex.Message}");
                            }
                        }
                    }
                    else if (arg.Equals("/scan", StringComparison.OrdinalIgnoreCase))
                    {
                        ContextMenuDebugLog("[HANDLER] /scan — scan rápido via ShieldViewModel");
                        var shieldVM = Services?.GetService<VoltrisOptimizer.UI.ViewModels.ShieldViewModel>();
                        if (shieldVM != null)
                        {
                            var dispatcher = System.Windows.Application.Current?.Dispatcher;
                            if (dispatcher != null && !dispatcher.CheckAccess())
                                await dispatcher.InvokeAsync(async () => await shieldVM.RunQuickScanAsync());
                            else
                                await shieldVM.RunQuickScanAsync();
                        }
                        else
                        {
                            ContextMenuDebugLog("[HANDLER] /scan — ShieldViewModel não disponível");
                        }
                    }
                    else if (arg.Equals("/register-menu", StringComparison.OrdinalIgnoreCase))
                    {
                        RegistrarMenuDesktopContext();
                    }
                    else if (arg.Equals("/unregister-menu", StringComparison.OrdinalIgnoreCase))
                    {
                        RemoverMenuDesktopContext();
                    }
                    else
                    {
                        ContextMenuDebugLog($"[HANDLER] Arg não reconhecido: '{arg}'");
                    }
                }
            }
            catch (Exception ex)
            {
                ContextMenuDebugLog($"[HANDLER] EXCEÇÃO: {ex.Message}");
                _loggingService?.LogError($"[App] Erro ao processar argumentos CLI: {ex.Message}", ex);
            }
        }

        public void RegistrarMenuDesktopContext()
        {
            try
            {
                string exePath = System.Diagnostics.Process.GetCurrentProcess().MainModule?.FileName ?? "";
                if (string.IsNullOrEmpty(exePath)) return;

                string iconPath = exePath + ",0";
                string quotedExePath = "\"" + exePath + "\"";

                // Labels alinhados com o dashboard do app
                var subItems = new[]
                {
                    ("01_Open",      "Abrir VOLTRIS",     quotedExePath + " /show"),
                    ("02_Optimize",  "Otimizar Agora",    $"{quotedExePath} /optimize"),
                    ("03_Cleanup",   "Limpeza Rápida",    $"{quotedExePath} /cleanup"),
                    ("04_Network",   "Otimizar Rede",     $"{quotedExePath} /network"),
                    ("05_GamerMode", "Ativar Modo Gamer", $"{quotedExePath} /boost"),
                    ("06_Scan",      "Scan de Proteção",  $"{quotedExePath} /scan"),
                    ("07_Status",    "Status do Sistema", $"{quotedExePath} /status"),
                };

                // HKLM é obrigatório para o flyout funcionar no Windows 10/11.
                // HKCU\Software\Classes não expande submenus no DesktopBackground.
                // Registrar nos dois caminhos conhecidos para máxima compatibilidade.
                string[] hklmPaths = new[]
                {
                    @"SOFTWARE\Classes\DesktopBackground\Shell\VOLTRIS",
                    @"SOFTWARE\Classes\Directory\Background\shell\VOLTRIS",
                };

                foreach (var path in hklmPaths)
                {
                    using var key = Registry.LocalMachine.CreateSubKey(path, true);
                    if (key == null) continue;

                    key.SetValue("MUIVerb",     "VOLTRIS");
                    key.SetValue("Icon",        iconPath);
                    key.SetValue("Position",    "Top");
                    // SubCommands="" + shell\ aninhado = mecanismo correto para HKLM no Win10/11
                    key.SetValue("SubCommands", "");

                    using var shellKey = key.CreateSubKey("shell");
                    foreach (var (keyName, label, command) in subItems)
                        AddContextMenuItem(shellKey, keyName, label, command, iconPath);
                }

                _loggingService?.LogInfo("[App] Menu de contexto registrado em HKLM com sucesso.");
            }
            catch (UnauthorizedAccessException)
            {
                // App sem elevação — fallback para HKCU (funciona no Win11 22H2+)
                RegistrarMenuDesktopContextHkcu();
            }
            catch (Exception ex)
            {
                _loggingService?.LogError("[App] Erro ao registrar menu de contexto", ex);
            }
        }

        private void RegistrarMenuDesktopContextHkcu()
        {
            try
            {
                string exePath = System.Diagnostics.Process.GetCurrentProcess().MainModule?.FileName ?? "";
                if (string.IsNullOrEmpty(exePath)) return;

                string iconPath = exePath + ",0";
                string quotedExePath = "\"" + exePath + "\"";

                var subItems = new[]
                {
                    ("01_Open",      "Abrir VOLTRIS",     quotedExePath + " /show"),
                    ("02_Optimize",  "Otimizar Agora",    $"{quotedExePath} /optimize"),
                    ("03_Cleanup",   "Limpeza Rápida",    $"{quotedExePath} /cleanup"),
                    ("04_Network",   "Otimizar Rede",     $"{quotedExePath} /network"),
                    ("05_GamerMode", "Ativar Modo Gamer", $"{quotedExePath} /boost"),
                    ("06_Scan",      "Scan de Proteção",  $"{quotedExePath} /scan"),
                    ("07_Status",    "Status do Sistema", $"{quotedExePath} /status"),
                };

                string[] hkcuPaths = new[]
                {
                    @"Software\Classes\DesktopBackground\Shell\VOLTRIS",
                    @"Software\Classes\Directory\Background\shell\VOLTRIS",
                };

                foreach (var path in hkcuPaths)
                {
                    using var key = Registry.CurrentUser.CreateSubKey(path, true);
                    if (key == null) continue;

                    key.SetValue("MUIVerb",     "VOLTRIS");
                    key.SetValue("Icon",        iconPath);
                    key.SetValue("Position",    "Top");
                    key.SetValue("SubCommands", "");

                    using var shellKey = key.CreateSubKey("shell");
                    foreach (var (keyName, label, command) in subItems)
                        AddContextMenuItem(shellKey, keyName, label, command, iconPath);
                }

                _loggingService?.LogInfo("[App] Menu de contexto registrado em HKCU (fallback).");
            }
            catch (Exception ex)
            {
                _loggingService?.LogError("[App] Erro ao registrar menu de contexto (HKCU fallback)", ex);
            }
        }

        private void AddContextMenuItem(RegistryKey parentShellKey, string keyName, string label, string command, string icon)
        {
            using var itemKey = parentShellKey.CreateSubKey(keyName);
            if (itemKey == null) return;
            itemKey.SetValue("MUIVerb", label);
            itemKey.SetValue("Icon",    icon);
            using var cmdKey = itemKey.CreateSubKey("command");
            cmdKey?.SetValue("", command);
        }

        public void RemoverMenuDesktopContext()
        {
            try
            {
                string[] names = new[] { "VOLTRIS", "Voltiris", "Voltris" };

                // Remover de HKLM
                foreach (var name in names)
                {
                    TryDeleteSubKeyTree(Registry.LocalMachine, $@"SOFTWARE\Classes\DesktopBackground\Shell\{name}");
                    TryDeleteSubKeyTree(Registry.LocalMachine, $@"SOFTWARE\Classes\Directory\Background\shell\{name}");
                }

                // Remover de HKCU (fallback)
                foreach (var name in names)
                {
                    TryDeleteSubKeyTree(Registry.CurrentUser, $@"Software\Classes\DesktopBackground\Shell\{name}");
                    TryDeleteSubKeyTree(Registry.CurrentUser, $@"Software\Classes\Directory\Background\shell\{name}");
                }

                // Remover entradas legadas via HKCR (compatibilidade com versões anteriores)
                foreach (var name in names)
                {
                    TryDeleteSubKeyTree(Registry.ClassesRoot, $@"DesktopBackground\Shell\{name}");
                    TryDeleteSubKeyTree(Registry.ClassesRoot, $@"Directory\Background\shell\{name}");
                }

                _loggingService?.LogInfo("[App] Menu de contexto removido com sucesso.");
            }
            catch (Exception ex)
            {
                _loggingService?.LogError("[App] Erro ao remover menu de contexto", ex);
            }
        }

        private static void TryDeleteSubKeyTree(RegistryKey hive, string path)
        {
            try { hive.DeleteSubKeyTree(path, false); } catch { }
        }

        #endregion

        #region Native IPC & Instance Management

        private static readonly string MainWindowTitle = "Voltris Optimizer - Sistema Profissional de Otimização para Windows 10/11";

        private void TrazerInstanciaPrincipalParaFrente()
        {
            // Enviar /show via WM_COPYDATA para que o MainWindow chame RestoreFromTray()
            // (SetForegroundWindow sozinho não funciona quando a janela está oculta no systray)
            IntPtr hWnd = FindWindow(null, MainWindowTitle);
            ContextMenuDebugLog($"[IPC] TrazerParaFrente — hWnd={hWnd}");
            if (hWnd != IntPtr.Zero)
            {
                EnviarComandoParaInstanciaPrincipal("/show");
            }
        }

        private void EnviarComandoParaInstanciaPrincipal(string command)
        {
            IntPtr hWnd = FindWindow(null, MainWindowTitle);
            ContextMenuDebugLog($"[IPC] EnviarComando '{command}' — hWnd={hWnd}");

            if (hWnd == IntPtr.Zero)
            {
                ContextMenuDebugLog("[IPC] ERRO: janela principal não encontrada. Comando perdido.");
                return;
            }

            byte[] commandBytes = System.Text.Encoding.Unicode.GetBytes(command);
            IntPtr ptrData = Marshal.AllocCoTaskMem(commandBytes.Length);
            try
            {
                Marshal.Copy(commandBytes, 0, ptrData, commandBytes.Length);
                COPYDATASTRUCT cds = new COPYDATASTRUCT
                {
                    dwData = new IntPtr(123),
                    cbData = commandBytes.Length,
                    lpData = ptrData
                };
                var result = SendMessage(hWnd, WM_COPYDATA, IntPtr.Zero, ref cds);
                ContextMenuDebugLog($"[IPC] SendMessage resultado={result}");
                SetForegroundWindow(hWnd);
            }
            finally
            {
                Marshal.FreeCoTaskMem(ptrData);
            }
        }

        internal static void ContextMenuDebugLog(string message)
        {
            try
            {
                var logPath = System.IO.Path.Combine(
                    AppDomain.CurrentDomain.BaseDirectory, "Logs", "contextmenu_debug.log");
                System.IO.File.AppendAllText(logPath,
                    $"[{DateTime.Now:HH:mm:ss.fff}] {message}{Environment.NewLine}");
            }
            catch { }
        }

        [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
        private static extern IntPtr FindWindow(string? lpClassName, string lpWindowName);

        [DllImport("user32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool SetForegroundWindow(IntPtr hWnd);

        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        private static extern IntPtr SendMessage(IntPtr hWnd, uint Msg, IntPtr wParam, ref COPYDATASTRUCT lParam);

        private struct COPYDATASTRUCT
        {
            public IntPtr dwData;
            public int cbData;
            public IntPtr lpData;
        }

        private const uint WM_COPYDATA = 0x004A;

        #endregion
    }
}