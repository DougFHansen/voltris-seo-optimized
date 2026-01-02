using Microsoft.Extensions.DependencyInjection;
using VoltrisOptimizer.Services.Gamer.Implementation;
using VoltrisOptimizer.Services.Gamer.Interfaces;

namespace VoltrisOptimizer.Services.Gamer
{
    /// <summary>
    /// Extensões para registro de serviços do modo gamer
    /// </summary>
    public static class GamerServiceExtensions
    {
        /// <summary>
        /// Registra todos os serviços necessários para o modo gamer
        /// </summary>
        public static void AddGamerServices(this IServiceCollection services)
        {
            // Serviços principais
            services.AddSingleton<ICpuGamingOptimizer, CpuGamingOptimizerService>();
            services.AddSingleton<IGpuGamingOptimizer, GpuGamingOptimizerService>();
            services.AddSingleton<INetworkGamingOptimizer, NetworkGamingOptimizerService>();
            services.AddSingleton<IMemoryGamingOptimizer, MemoryGamingOptimizerService>();
            services.AddSingleton<IProcessPrioritizer, ProcessPrioritizerService>();
            services.AddSingleton<IHardwareDetector, HardwareDetectorService>();
            services.AddSingleton<ITimerResolutionService, TimerResolutionService>();
            services.AddSingleton<IAdaptiveGovernor, AdaptiveGovernorService>();
            services.AddSingleton<IGameLibraryService, GameLibraryService>(); // Adicionado o registro do GameLibraryService
            services.AddSingleton<IGameProfileService, GameProfileService>(); // Adicionado o registro do GameProfileService
            services.AddSingleton<RealGameBoosterService>(); // Adicionado o registro do RealGameBoosterService
            services.AddSingleton<IGameDetector, GameDetectorService>(); // Adicionado o registro do GameDetectorService
            
            // Serviços de otimização de troca de contexto
            services.AddAppSwitchOptimizationServices();
            
            // Orquestrador principal
            services.AddSingleton<IGamerModeOrchestrator, GamerModeOrchestrator>();
        }
    }
}