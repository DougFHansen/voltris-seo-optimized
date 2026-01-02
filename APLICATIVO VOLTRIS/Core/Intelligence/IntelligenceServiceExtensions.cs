using Microsoft.Extensions.DependencyInjection;
using VoltrisOptimizer.Core.Intelligence;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Services.Gamer.Intelligence;

namespace VoltrisOptimizer.Core.Intelligence
{
    /// <summary>
    /// Extensões para registro do Voltris Intelligence Framework (VIF) no DI
    /// </summary>
    public static class IntelligenceServiceExtensions
    {
        /// <summary>
        /// Registra o Voltris Intelligence Framework (VIF v1.0)
        /// IMPORTANTE: Requer que os serviços de inteligência de gaming já estejam registrados
        /// Use AddGamerIntelligenceServices() antes de chamar este método
        /// </summary>
        public static IServiceCollection AddVoltrisIntelligenceFramework(this IServiceCollection services)
        {
            // Registrar o orquestrador principal do VIF
            // Ele depende dos serviços já existentes em Services/Gamer/Intelligence
            services.AddSingleton<IVoltrisIntelligenceOrchestrator, IntelligenceOrchestratorService>();
            
            // Registrar o otimizador de performance para modo gamer
            services.AddSingleton<GameModePerformanceOptimizer>();

            return services;
        }
    }
}

