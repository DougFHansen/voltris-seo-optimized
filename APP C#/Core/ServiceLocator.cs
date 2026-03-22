using System;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Core.EnterpriseCheck;
using VoltrisOptimizer.Services.Enterprise; // Adicionado para MachineIdentityService e MonitorService
using VoltrisOptimizer.Services.Gamer; // Adicionado para AddGamerServices()
using VoltrisOptimizer.Services.SystemIntelligenceProfiler; // Add for EtwAnalyzer
using VoltrisOptimizer.Core.Intelligence; // Add for IntelligenceOrchestratorService
using VoltrisOptimizer.Services.Gamer.Adaptive;
using VoltrisOptimizer.Services.Gamer.Intelligence;
using VoltrisOptimizer.Services.Gamer.Interfaces; // Para IGamerModeOrchestrator, IRealGameBoosterService, IGpuGamingOptimizer


namespace VoltrisOptimizer.Core
{
    /// <summary>
    /// Service Locator temporário para transição gradual para DI puro
    /// Este padrão será removido gradualmente conforme a refatoração avança
    /// </summary>
    /// <remarks>
    /// IMPORTANTE: Este é um padrão temporário (anti-pattern) mantido apenas para
    /// compatibilidade com código legado. Novas implementações devem usar
    /// injeção de dependência via construtor.
    /// </remarks>
    public static class ServiceLocator
    {
        private static IServiceProvider? _serviceProvider;
        private static readonly object _lock = new();
        private static bool _isInitialized;

        /// <summary>
        /// Indica se o ServiceLocator foi inicializado
        /// </summary>
        public static bool IsInitialized => _isInitialized;

        /// <summary>
        /// Inicializa o ServiceLocator com um ServiceProvider
        /// </summary>
        /// <param name="serviceProvider">Provider de serviços do DI</param>
        public static void Initialize(IServiceProvider serviceProvider)
        {
            lock (_lock)
            {
                if (_isInitialized)
                    throw new InvalidOperationException("ServiceLocator já foi inicializado.");

                _serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
                _isInitialized = true;
            }
        }

        /// <summary>
        /// Obtém um serviço do container
        /// </summary>
        /// <typeparam name="T">Tipo do serviço</typeparam>
        /// <returns>Instância do serviço ou null</returns>
        public static T? GetService<T>() where T : class
        {
            if (!_isInitialized || _serviceProvider == null)
                return null;

            return _serviceProvider.GetService<T>();
        }

        /// <summary>
        /// Obtém um serviço obrigatório do container
        /// </summary>
        /// <typeparam name="T">Tipo do serviço</typeparam>
        /// <returns>Instância do serviço</returns>
        /// <exception cref="InvalidOperationException">Se o serviço não estiver registrado</exception>
        public static T GetRequiredService<T>() where T : class
        {
            if (!_isInitialized || _serviceProvider == null)
                throw new InvalidOperationException("ServiceLocator não foi inicializado.");

            return _serviceProvider.GetRequiredService<T>();
        }

        /// <summary>
        /// Reseta o ServiceLocator (apenas para testes)
        /// </summary>
        internal static void Reset()
        {
            lock (_lock)
            {
                _serviceProvider = null;
                _isInitialized = false;
            }
        }

        #region Atalhos para serviços comuns (temporário)

        /// <summary>
        /// Obtém o serviço de logging
        /// </summary>
        public static ILoggingService? Logger => GetService<ILoggingService>();

        /// <summary>
        /// Obtém o serviço de registro
        /// </summary>
        public static IRegistryService? Registry => GetService<IRegistryService>();

        /// <summary>
        /// Obtém o serviço de execução de processos
        /// </summary>
        public static IProcessRunner? ProcessRunner => GetService<IProcessRunner>();

        /// <summary>
        /// Obtém o serviço de informações do sistema
        /// </summary>
        public static ISystemInfoService? SystemInfo => GetService<ISystemInfoService>();

        /// <summary>
        /// Obtém o serviço de segurança do sistema
        /// </summary>
        public static SystemSafetyService? SystemSafety => GetService<SystemSafetyService>();

        #endregion
    }

    /// <summary>
    /// Extensões para configuração de serviços
    /// </summary>
    public static class ServiceCollectionExtensions
    {
        /// <summary>
        /// Adiciona todos os serviços do Voltris Optimizer ao container
        /// </summary>
        public static IServiceCollection AddVoltrisServices(this IServiceCollection services)
        {
            // Serviços de infraestrutura
            // Só registra se ainda não foi fornecido pelo Bootstrapper
            if (!services.Any(d => d.ServiceType == typeof(ILoggingService)))
            {
                services.AddSingleton<ILoggingService>(provider =>
                {
                    var logDirectory = System.IO.Path.Combine(
                        AppDomain.CurrentDomain.BaseDirectory,
                        "Logs"
                    );
                    return new VoltrisOptimizer.Services.Logging.ProfessionalLoggingService(logDirectory);
                });
            }

            services.AddSingleton<IProcessRunner, ProcessRunnerService>();
            services.AddSingleton<IRegistryService, RegistryService>();
            services.AddSingleton<ISystemInfoService, SystemInfoServiceImpl>(); // Registrando ISystemInfoService
            services.AddSingleton<MachineIdentityService>(); // Registrando MachineIdentityService
            services.AddSingleton<MonitorService>(); // Registrando MonitorService
            services.AddSingleton<SystemSafetyService>();
            
            // Registrando SettingsService (necessário para GlobalThermalMonitorService)
            services.AddSingleton<SettingsService>(provider => SettingsService.Instance);
            
            // Session Services removidos (telemetria desativada)

            // NOVOS SERVIÇOS DE CACHE - CRÍTICO PARA PERFORMANCE
            services.AddSingleton<ProcessCacheService>();
            services.AddSingleton<WmiCacheService>();
            
            // SERVIÇOS ADAPTATIVOS ENTERPRISE-GRADE
            services.AddSingleton<IMachineProfileDetector, MachineProfileDetector>();
            services.AddSingleton<IAdaptiveOptimizationEngine>(sp => 
                new AdaptiveOptimizationEngine(
                    () => sp.GetRequiredService<IGamerModeOrchestrator>(),
                    sp.GetRequiredService<IRealGameBoosterService>(),
                    sp.GetRequiredService<IGpuGamingOptimizer>(),
                    sp.GetRequiredService<IMachineProfileDetector>(),
                    sp.GetRequiredService<ILoggingService>()
                ));

            // Serviços de otimização
            services.AddSingleton<SystemCleaner>();
            services.AddSingleton<PerformanceOptimizer>();
            services.AddSingleton<NetworkOptimizer>();
            services.AddSingleton<AdvancedOptimizer>();
            services.AddSingleton<AdvancedTweaksService>();
            services.AddSingleton<ExtremeOptimizationsService>();
            services.AddSingleton<VoltrisOptimizer.Services.Gamer.GameSessionOptimizerService>();
            services.AddSingleton<GamerOptimizerService>();
            services.AddSingleton<GodModeService>();
            services.AddSingleton<GameDiagnosticsService>();
            services.AddSingleton<GameRepairService>();
            services.AddSingleton<UltraPerformanceService>();
            services.AddSingleton<UltraCleanerService>();
            // Dynamic Load Stabilization Infrastructure
            services.AddSingleton<VoltrisOptimizer.Services.Optimization.Providers.IProcessProvider, VoltrisOptimizer.Services.Optimization.Providers.WindowsProcessProvider>();
            services.AddSingleton<VoltrisOptimizer.Services.Optimization.Providers.ICpuCoreLoadProvider, VoltrisOptimizer.Services.Optimization.Providers.WindowsCpuCoreLoadProvider>();
            services.AddSingleton<VoltrisOptimizer.Services.Optimization.Providers.IGpuLoadProvider, VoltrisOptimizer.Services.Optimization.Providers.WindowsGpuLoadProvider>();
            services.AddSingleton<VoltrisOptimizer.Services.Optimization.CoreLoadHeuristics>();
            services.AddSingleton<VoltrisOptimizer.Services.Optimization.CriticalProcessDetector>();
            services.AddSingleton<VoltrisOptimizer.Services.Optimization.StabilityEngineService>();
            services.AddSingleton<VoltrisOptimizer.Services.Optimization.IDynamicLoadStabilizer, VoltrisOptimizer.Services.Optimization.DynamicLoadStabilizer>();

            // Serviços de suporte
            services.AddSingleton<HistoryService>();
            services.AddSingleton<SchedulerService>();
            services.AddSingleton<IntelligentCleanupEngine>();
            services.AddSingleton<IDialogService, DialogService>();
            services.AddSingleton<INavigationService, NavigationService>();
            
            // VOLTRIS NEURAL CORE - Motor Disruptivo (Hardware Surgery, Context Morphing, Prediction)
            services.AddSingleton<INeuralCoreService, NeuralCoreService>();

            // Serviços do Core
            services.AddSingleton<VoltrisOptimizer.Core.SystemIntelligenceProfiler.ProfileStore>();
            services.AddSingleton<VoltrisOptimizer.Core.SystemIntelligenceProfiler.IRollbackManager, 
                VoltrisOptimizer.Core.SystemIntelligenceProfiler.RollbackManager>();
            services.AddSingleton<VoltrisOptimizer.Core.SystemIntelligenceProfiler.IAuditCollector, 
                VoltrisOptimizer.Core.SystemIntelligenceProfiler.AuditCollector>();
                
            // Register Enhanced Rollback Manager (Services based)
            services.AddSingleton<VoltrisOptimizer.Services.SystemChanges.IRollbackManager, 
                VoltrisOptimizer.Services.SystemChanges.EnhancedRollbackManager>();
            services.AddSingleton<VoltrisOptimizer.Core.SystemIntelligenceProfiler.IDecisionEngine, 
                VoltrisOptimizer.Core.SystemIntelligenceProfiler.DecisionEngine>();
            services.AddSingleton<ICompatibilityPolicy, 
                VoltrisOptimizer.Core.SystemIntelligenceProfiler.DefaultCompatibilityPolicy>();
            services.AddSingleton<VoltrisOptimizer.Core.SystemIntelligenceProfiler.ISystemProfiler, 
                VoltrisOptimizer.Core.SystemIntelligenceProfiler.SystemIntelligenceProfiler>();

            // ETW Infrastructure (New Intelligence Core)
            services.AddSingleton<EtwSession>();
            services.AddSingleton<EtwEventParser>();
            services.AddSingleton<IEtwAnalyzer>(provider => 
                new EtwAnalyzer(
                    provider.GetRequiredService<EtwSession>(),
                    provider.GetRequiredService<EtwEventParser>(),
                    provider.GetRequiredService<ILoggingService>()));

            // Intelligence Orchestrator (The Brain)
            services.AddSingleton<IVoltrisIntelligenceOrchestrator, IntelligenceOrchestratorService>(); // Register Interface
            services.AddSingleton<IntelligenceOrchestratorService>(provider => 
                (IntelligenceOrchestratorService)provider.GetRequiredService<IVoltrisIntelligenceOrchestrator>()); // Self-bind
            
            // Serviços de detecção de jogos

            // Serviços de detecção de jogos
            services.AddSingleton<GameDetectionService>();
            services.AddSingleton<IGameProfileRepository, 
                VoltrisOptimizer.Core.GameRecognition.GameProfileRepositoryAdapter>();
            services.AddSingleton<VoltrisOptimizer.Core.GameRecognition.IGameRecognitionEngine, 
                VoltrisOptimizer.Core.GameRecognition.GameRecognitionEngine>();
            
            // SERVIÇOS GAMER MODE - REGISTRO COMPLETO
            services.AddSingleton<VoltrisOptimizer.Services.Gamer.Interfaces.IGamerModeOrchestrator, 
                VoltrisOptimizer.Services.Gamer.Implementation.GamerModeOrchestrator>();
            services.AddSingleton<VoltrisOptimizer.Services.Gamer.Interfaces.IGameDetector, GameDetectionService>();
            services.AddSingleton<VoltrisOptimizer.Services.Gamer.Interfaces.IGameLibraryService, 
                VoltrisOptimizer.Services.Gamer.Implementation.GameLibraryService>();
            services.AddSingleton<VoltrisOptimizer.Services.Gamer.Interfaces.IGameProfileService, 
                VoltrisOptimizer.Services.Gamer.Implementation.GameProfileService>();
            services.AddSingleton<VoltrisOptimizer.Services.Gamer.Interfaces.IGpuGamingOptimizer, 
                VoltrisOptimizer.Services.Gamer.Implementation.GpuGamingOptimizerService>();
            services.AddSingleton<VoltrisOptimizer.Services.Gamer.Interfaces.IRealGameBoosterService, 
                VoltrisOptimizer.Services.Gamer.Implementation.RealGameBoosterService>();
            
            // SERVIÇO DE MONITORAMENTO TÉRMICO GLOBAL
            services.AddSingleton<VoltrisOptimizer.Services.Thermal.GlobalThermalMonitorService>();
            services.AddSingleton<VoltrisOptimizer.Services.Thermal.IGlobalThermalMonitorService>(provider =>
                provider.GetRequiredService<VoltrisOptimizer.Services.Thermal.GlobalThermalMonitorService>());

            // SERVIÇO INTELIGENTE DE PLANO DE ENERGIA (integrado com perfil + térmico)
            services.AddSingleton<VoltrisOptimizer.Services.Power.IntelligentPowerPlanService>(provider =>
                new VoltrisOptimizer.Services.Power.IntelligentPowerPlanService(
                    provider.GetRequiredService<ILoggingService>(),
                    VoltrisOptimizer.Services.SettingsService.Instance,
                    provider.GetRequiredService<VoltrisOptimizer.Services.Thermal.IGlobalThermalMonitorService>()
                ));

            // SERVIÇO DE OTIMIZAÇÃO CPU POR PERFIL (powrprof.dll nativo)
            services.AddSingleton<VoltrisOptimizer.Services.Power.CpuProfileOptimizationService>(provider =>
                new VoltrisOptimizer.Services.Power.CpuProfileOptimizationService(
                    provider.GetRequiredService<ILoggingService>(),
                    VoltrisOptimizer.Services.SettingsService.Instance,
                    provider.GetRequiredService<VoltrisOptimizer.Services.Thermal.IGlobalThermalMonitorService>()
                ));

            // OPTIMIZATION MANAGER CENTRAL (GPU, Latency, PCIe + deduplicação com Gamer Mode)
            services.AddSingleton<VoltrisOptimizer.Services.Power.OptimizationManager>(provider =>
                new VoltrisOptimizer.Services.Power.OptimizationManager(
                    provider.GetRequiredService<ILoggingService>(),
                    VoltrisOptimizer.Services.SettingsService.Instance,
                    provider.GetRequiredService<VoltrisOptimizer.Services.Thermal.IGlobalThermalMonitorService>(),
                    provider.GetService<VoltrisOptimizer.Services.Gamer.Interfaces.IGamerModeOrchestrator>(),
                    provider.GetService<VoltrisOptimizer.Services.Power.CpuProfileOptimizationService>()
                ));

            // SERVIÇO DE OTIMIZAÇÃO DE PERFORMANCE DE HARDWARE (QUICK CPU)
            // Integrado com Perfil Inteligente, Modo Gamer e Monitoramento Térmico
            services.AddSingleton<VoltrisOptimizer.Services.Performance.HardwarePerformanceOptimizationService>(provider =>
                new VoltrisOptimizer.Services.Performance.HardwarePerformanceOptimizationService(
                    provider.GetRequiredService<ILoggingService>(),
                    provider.GetRequiredService<VoltrisOptimizer.Services.Thermal.GlobalThermalMonitorService>(),
                    provider.GetService<VoltrisOptimizer.Services.Gamer.Interfaces.IGamerModeOrchestrator>()
                ));
            
            // REGISTRAR GAMER MODE MANAGER E MÓDULOS
            services.AddGamerServices(); // Registra todos os serviços do Gamer namespace
            
            // REGISTRAR SHIELD SERVICES (PROTEÇÃO DO SISTEMA)
            services.AddSingleton<VoltrisOptimizer.Services.Shield.FileMonitorService>();
            services.AddSingleton<VoltrisOptimizer.Services.Shield.StartupMonitorService>();
            services.AddSingleton<VoltrisOptimizer.Services.Shield.AdwareScannerService>();
            services.AddSingleton<VoltrisOptimizer.Services.Shield.DefenderIntegrationService>();
            services.AddSingleton<VoltrisOptimizer.Services.Shield.RansomwareMonitorService>();
            services.AddSingleton<VoltrisOptimizer.Services.Shield.SecurityLogService>();
            services.AddSingleton<VoltrisOptimizer.Services.Shield.VoltrisShieldService>();
            services.AddSingleton<VoltrisOptimizer.Services.Shield.ShieldNotificationService>();
            
            // REGISTRAR SHIELD NETWORK SERVICES
            services.AddSingleton<VoltrisOptimizer.Services.Shield.Network.NetworkMonitorService>();
            services.AddSingleton<VoltrisOptimizer.Services.Shield.Network.NetworkScannerService>();
            services.AddSingleton<VoltrisOptimizer.Services.Shield.Network.DeviceTrackerService>();
            services.AddSingleton<VoltrisOptimizer.Services.Shield.Network.DeviceIdentificationEngine>();
            services.AddSingleton<VoltrisOptimizer.Services.Shield.Network.DeviceClassifier>();
            services.AddSingleton<VoltrisOptimizer.Services.Shield.Network.DeviceVendorService>();
            services.AddSingleton<VoltrisOptimizer.Services.Shield.Network.HostnameAnalyzer>();
            services.AddSingleton<VoltrisOptimizer.Services.Shield.Network.OUIDatabase>();
            
            // REGISTRAR SHIELD VIEWMODEL
            services.AddSingleton<VoltrisOptimizer.UI.ViewModels.ShieldViewModel>();
            
            // REGISTRAR VIEWMODEL COMO SINGLETON PARA EVITAR DUPLICIDADE DE EVENTOS E LEAK DE MEMÓRIA
            services.AddSingleton<VoltrisOptimizer.UI.ViewModels.GamerViewModel>(provider =>
                new VoltrisOptimizer.UI.ViewModels.GamerViewModel(
                    provider.GetRequiredService<VoltrisOptimizer.Services.Gamer.Interfaces.IGamerModeOrchestrator>(),
                    provider.GetRequiredService<VoltrisOptimizer.Services.Gamer.Interfaces.IGameDetector>(),
                    provider.GetRequiredService<VoltrisOptimizer.Services.Gamer.Interfaces.IGameLibraryService>(),
                    provider.GetRequiredService<VoltrisOptimizer.Services.Gamer.Interfaces.IGpuGamingOptimizer>(),
                    provider.GetRequiredService<ILoggingService>(),
                    provider.GetRequiredService<IMachineProfileDetector>(),
                    provider.GetRequiredService<IAdaptiveOptimizationEngine>(),
                    provider.GetRequiredService<VoltrisOptimizer.Services.Gamer.Interfaces.IHardwareDetector>(),
                    provider.GetService<VoltrisOptimizer.Services.Gamer.Interfaces.IGameProfileService>(),
                    provider.GetService<VoltrisOptimizer.Services.Gamer.Interfaces.IRealGameBoosterService>(),
                    provider.GetRequiredService<VoltrisOptimizer.Services.Gamer.Intelligence.Interfaces.IPowerProfileDiagnosticsService>()
                ));

            services.AddSingleton<EnvironmentDetector>();

            // PERFORMANCE SYSTEM (NEW INTELLIGENCE LAYER)
            services.AddSingleton<VoltrisOptimizer.Services.Performance.Decision.IPerformanceDecisionEngine, 
                VoltrisOptimizer.Services.Performance.Decision.RuleBasedDecisionEngine>();
            services.AddSingleton<VoltrisOptimizer.Services.Performance.Orchestration.IPerformanceOrchestrator, 
                VoltrisOptimizer.Services.Performance.Orchestration.PerformanceOrchestrator>();
            services.AddSingleton<VoltrisOptimizer.Services.Performance.Orchestration.PerformanceContextBuilder>();
            services.AddSingleton<VoltrisOptimizer.Services.Performance.PerformanceValidationService>();
            services.AddSingleton<VoltrisOptimizer.Services.Performance.IntelligentPerformanceCoordinator>();

            // CORE PERFORMANCE OPTIMIZATION SERVICE
            services.AddSingleton<VoltrisOptimizer.Services.Performance.IPerformanceOptimizationService, 
                VoltrisOptimizer.Services.Performance.PerformanceOptimizationService>();

            // BENCHMARK SYSTEM (SCIENTIFIC VALIDATION)
            services.AddSingleton<VoltrisOptimizer.Services.Performance.Benchmark.BenchmarkMetricCollector>();
            services.AddSingleton<VoltrisOptimizer.Services.Performance.Benchmark.BenchmarkStatisticalAnalyzer>();
            services.AddSingleton<VoltrisOptimizer.Services.Performance.Benchmark.BenchmarkEngine>();
            services.AddSingleton<VoltrisOptimizer.Services.Performance.Benchmark.BenchmarkPersistenceService>();
            
            // Tuning Services
            services.AddSingleton<VoltrisOptimizer.Interfaces.ISecurityTuningService, VoltrisOptimizer.Services.Tuning.SecurityTuningService>();
            services.AddSingleton<VoltrisOptimizer.Interfaces.IPrivacyTuningService, VoltrisOptimizer.Services.Tuning.PrivacyTuningService>();
            services.AddSingleton<VoltrisOptimizer.Interfaces.IDebloatTuningService, VoltrisOptimizer.Services.Tuning.DebloatTuningService>();

            // ViewModels
            services.AddSingleton<VoltrisOptimizer.UI.ViewModels.DashboardViewModel>();
            services.AddTransient<VoltrisOptimizer.UI.ViewModels.BenchmarkViewModel>();
            services.AddTransient<VoltrisOptimizer.UI.ViewModels.ProfessionalServicesViewModel>();
            services.AddTransient<VoltrisOptimizer.UI.ViewModels.DebloatViewModel>();
            services.AddTransient<VoltrisOptimizer.UI.ViewModels.PrivacyViewModel>();
            services.AddTransient<VoltrisOptimizer.UI.ViewModels.SecurityViewModel>();


            
            // SERVIÇO DE LOCALIZAÇÃO ENTERPRISE
            services.AddSingleton<VoltrisOptimizer.Services.Localization.LocalizationService>();

            // IMMEDIATE RESPONSIVENESS ENGINE v2
            services.AddSingleton<VoltrisOptimizer.Services.Responsiveness.ResponsivenessConfig>();
            services.AddSingleton<VoltrisOptimizer.Services.Responsiveness.IImmediateResponsivenessEngine>(provider =>
                new VoltrisOptimizer.Services.Responsiveness.ImmediateResponsivenessEngine(
                    provider.GetRequiredService<ILoggingService>(),
                    provider.GetRequiredService<VoltrisOptimizer.Services.Optimization.CriticalProcessDetector>()
                ));

            return services;
        }
    }
}

