using Microsoft.Extensions.DependencyInjection;
using VoltrisOptimizer.Services.Gamer.Intelligence.Interfaces;
using VoltrisOptimizer.Services.Gamer.Intelligence.Implementation;

namespace VoltrisOptimizer.Services.Gamer.Intelligence
{
    /// <summary>
    /// Extensões para registro de serviços de inteligência no DI
    /// </summary>
    public static class IntelligenceServiceExtensions
    {
        /// <summary>
        /// Registra todos os serviços de inteligência de gaming
        /// </summary>
        public static IServiceCollection AddGamerIntelligenceServices(this IServiceCollection services)
        {
            // Core Services
            services.AddSingleton<IHardwareProfiler, HardwareProfilerService>();
            services.AddSingleton<IGameIntelligence, GameIntelligenceService>();
            
            // Monitoring Services
            services.AddSingleton<IFrameTimeOptimizer, FrameTimeOptimizerService>();
            services.AddSingleton<IThermalMonitor, ThermalMonitorService>();
            services.AddSingleton<IVramManager, VramManagerService>();
            
            // Optimization Services
            services.AddSingleton<IInputLagOptimizer, InputLagOptimizerService>();
            services.AddSingleton<INetworkIntelligence, NetworkIntelligenceService>();
            services.AddSingleton<IPowerBalancer, PowerBalancerService>();
            
            // Benchmark
            services.AddSingleton<IAutoBenchmark, AutoBenchmarkService>();
            
            // Orchestrator (coordena todos)
            services.AddSingleton<IIntelligenceOrchestrator, IntelligenceOrchestratorService>();

            return services;
        }
    }
}

