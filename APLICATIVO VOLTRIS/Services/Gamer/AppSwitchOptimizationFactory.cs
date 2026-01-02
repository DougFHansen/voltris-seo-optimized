using System;
using Microsoft.Extensions.DependencyInjection;

namespace VoltrisOptimizer.Services.Gamer
{
    /// <summary>
    /// Fábrica para criação dos serviços de otimização de troca de contexto
    /// </summary>
    public static class AppSwitchOptimizationFactory
    {
        /// <summary>
        /// Registra todos os serviços de otimização de app-switching no container de DI
        /// </summary>
        public static void AddAppSwitchOptimizationServices(this IServiceCollection services)
        {
            // Serviços principais
            services.AddSingleton<ContextSwitchDetectorService>();
            services.AddSingleton<ResourcePreAllocatorService>();
            services.AddSingleton<IntelligentBackgroundSuspender>();
            services.AddSingleton<PriorityCacheService>();
            services.AddSingleton<InputLatencyMonitorService>();
            services.AddSingleton<SystemNotificationBlockerService>(); // Novo serviço
            services.AddSingleton<LoadingPhaseOptimizerService>(); // Novo serviço
            services.AddSingleton<AppSwitchOptimizationCoordinator>();
        }
        
        /// <summary>
        /// Cria instância do coordenador de otimização com todas as dependências
        /// </summary>
        public static AppSwitchOptimizationCoordinator CreateAppSwitchCoordinator(IServiceProvider serviceProvider)
        {
            ILoggingService? logger = null;
            try
            {
                logger = serviceProvider.GetService<ILoggingService>();
                if (logger == null)
                    throw new InvalidOperationException("ILoggingService não disponível");
                
                return new AppSwitchOptimizationCoordinator(
                    logger,
                    serviceProvider.GetRequiredService<ContextSwitchDetectorService>(),
                    serviceProvider.GetRequiredService<ResourcePreAllocatorService>(),
                    serviceProvider.GetRequiredService<IntelligentBackgroundSuspender>(),
                    serviceProvider.GetRequiredService<PriorityCacheService>(),
                    serviceProvider.GetRequiredService<InputLatencyMonitorService>(),
                    serviceProvider.GetRequiredService<SystemNotificationBlockerService>(), // Novo serviço
                    serviceProvider.GetRequiredService<LoadingPhaseOptimizerService>()); // Novo serviço
            }
            catch (Exception ex)
            {
                logger?.LogError($"Falha ao criar AppSwitchCoordinator: {ex.Message}");
                throw;
            }
        }
    }
}