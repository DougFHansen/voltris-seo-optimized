using Microsoft.Extensions.DependencyInjection;
using VoltrisOptimizer.Services.Gamer.OptimizationModules;

namespace VoltrisOptimizer.Services.Gamer.GamerModeManager
{
    /// <summary>
    /// Extensões de DI para o GamerModeManager
    /// </summary>
    public static class GamerModeServiceExtensions
    {
        /// <summary>
        /// Registra todos os serviços do GamerModeManager
        /// </summary>
        public static IServiceCollection AddGamerModeManager(this IServiceCollection services)
        {
            // Serviços internos
            services.AddSingleton<IPowerPlanService, PowerPlanService>();
            
            // Registrar módulos de otimização gamer temporários
            services.AddGamerOptimizationModules();
            services.AddSingleton<IGpuOptimizationService, GpuOptimizationService>();
            services.AddSingleton<IThermalMonitorService, ThermalMonitorService>();
            services.AddSingleton<IGameDetectionService, GameDetectionService>();
            services.AddSingleton<IProcessOptimizationService, ProcessOptimizationService>();
            
            // Manager principal - injetar o GameDetectionService compartilhado
            services.AddSingleton<IGamerModeManager>(provider =>
                new GamerModeManager(
                    provider.GetRequiredService<ILoggingService>(),
                    provider.GetRequiredService<IGameDetectionService>()
                ));
            
            return services;
        }
    }
}

