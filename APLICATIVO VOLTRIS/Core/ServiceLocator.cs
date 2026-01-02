using System;
using Microsoft.Extensions.DependencyInjection;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services;

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
            services.AddSingleton<ILoggingService>(provider =>
            {
                var logDirectory = System.IO.Path.Combine(
                    AppDomain.CurrentDomain.BaseDirectory,
                    "Logs"
                );
                return new LoggingService(logDirectory);
            });

            services.AddSingleton<IProcessRunner, ProcessRunnerService>();
            services.AddSingleton<IRegistryService, RegistryService>();
            services.AddSingleton<SystemSafetyService>();
            
            // NOVOS SERVIÇOS DE CACHE - CRÍTICO PARA PERFORMANCE
            services.AddSingleton<ProcessCacheService>();
            services.AddSingleton<WmiCacheService>();

            // Serviços de otimização
            services.AddSingleton<SystemCleaner>();
            services.AddSingleton<PerformanceOptimizer>();
            services.AddSingleton<NetworkOptimizer>();
            services.AddSingleton<AdvancedOptimizer>();
            services.AddSingleton<AdvancedTweaksService>();
            services.AddSingleton<ExtremeOptimizationsService>();
            services.AddSingleton<GamerOptimizerService>();
            services.AddSingleton<GodModeService>();
            services.AddSingleton<GameDiagnosticsService>();
            services.AddSingleton<VoltrisOptimizer.Services.Optimization.IDynamicLoadStabilizer, VoltrisOptimizer.Services.Optimization.DynamicLoadStabilizer>();

            // Serviços de suporte
            services.AddSingleton<HistoryService>();
            services.AddSingleton<SchedulerService>();
            services.AddSingleton<IDialogService, DialogService>();
            services.AddSingleton<INavigationService, NavigationService>();

            // Serviços do Core
            services.AddSingleton<VoltrisOptimizer.Core.SystemIntelligenceProfiler.ProfileStore>();
            services.AddSingleton<VoltrisOptimizer.Core.SystemIntelligenceProfiler.IRollbackManager, 
                VoltrisOptimizer.Core.SystemIntelligenceProfiler.RollbackManager>();
            services.AddSingleton<VoltrisOptimizer.Core.SystemIntelligenceProfiler.IAuditCollector, 
                VoltrisOptimizer.Core.SystemIntelligenceProfiler.AuditCollector>();
            services.AddSingleton<VoltrisOptimizer.Core.SystemIntelligenceProfiler.IDecisionEngine, 
                VoltrisOptimizer.Core.SystemIntelligenceProfiler.DecisionEngine>();
            services.AddSingleton<ICompatibilityPolicy, 
                VoltrisOptimizer.Core.SystemIntelligenceProfiler.DefaultCompatibilityPolicy>();
            services.AddSingleton<VoltrisOptimizer.Core.SystemIntelligenceProfiler.ISystemProfiler, 
                VoltrisOptimizer.Core.SystemIntelligenceProfiler.SystemIntelligenceProfiler>();

            // Serviços de detecção de jogos
            services.AddSingleton<GameDetectionService>();
            services.AddSingleton<IGameProfileRepository, 
                VoltrisOptimizer.Core.GameRecognition.GameProfileRepositoryAdapter>();
            services.AddSingleton<VoltrisOptimizer.Core.GameRecognition.IGameRecognitionEngine, 
                VoltrisOptimizer.Core.GameRecognition.GameRecognitionEngine>();

            return services;
        }
    }
}

