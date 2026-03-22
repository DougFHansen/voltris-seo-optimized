using Microsoft.Extensions.DependencyInjection;
using VoltrisOptimizer.Services.Gamer.Implementation;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using VoltrisOptimizer.Services.Gamer.GamerModeManager;

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
            services.AddSingleton<IImmersiveGamingOptimizer, ImmersiveEnvironmentService>();
            services.AddSingleton<IGameLibraryService, GameLibraryService>(); // Adicionado o registro do GameLibraryService
            
            // Registrar GamerModeManager e módulos de otimização temporária
            services.AddGamerModeManager();
            
            // Serviços adicionais
            services.AddSingleton<IGameProfileService, GameProfileService>();
            services.AddSingleton<IRealGameBoosterService, RealGameBoosterService>();
            services.AddSingleton<IGameDetector, GameDetectorService>();
            
            // Serviços de otimização de troca de contexto
            services.AddAppSwitchOptimizationServices();
            
            // Serviços de Overlay OSD
            services.AddSingleton<VoltrisOptimizer.Services.Gamer.Overlay.Interfaces.IOverlayService, 
                VoltrisOptimizer.Services.Gamer.Overlay.Implementation.OverlayService>();
            services.AddSingleton<VoltrisOptimizer.Services.Gamer.Overlay.Interfaces.IMetricsCollector, 
                VoltrisOptimizer.Services.Gamer.Overlay.Implementation.MetricsCollector>();
            
            // Orquestrador principal
            // State Memory e módulos de otimização (registrados antes do Orchestrator que os recebe via DI)
            services.AddSingleton<VoltrisOptimizer.Services.Gamer.Implementation.GamerStateMemory>();
            services.AddSingleton<VoltrisOptimizer.Services.Performance.HpetController>();
            services.AddSingleton<VoltrisOptimizer.Services.Gamer.OptimizationModules.WallpaperSlideshowModule>();
            services.AddSingleton<VoltrisOptimizer.Services.Gamer.OptimizationModules.UwpBackgroundAppsModule>();
            services.AddSingleton<VoltrisOptimizer.Services.Gamer.OptimizationModules.VisualEffectsOptimizer>();
            services.AddSingleton<IGamerModeOrchestrator, GamerModeOrchestrator>();
        }
    }
}