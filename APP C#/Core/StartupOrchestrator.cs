using System;
using System.Threading.Tasks;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.Core
{
    public interface IStartupOrchestrator
    {
        Task RunAsync();
    }

    /// <summary>
    /// StartupOrchestrator — stub. Sistema de telemetria e sessões remotas removido.
    /// </summary>
    public class StartupOrchestrator : IStartupOrchestrator
    {
        private readonly ILoggingService _logger;

        public StartupOrchestrator(ILoggingService logger)
        {
            _logger = logger;
        }

        public Task RunAsync()
        {
            _logger.LogInfo("[Startup] Telemetria remota desativada. Orquestração concluída.");
            return Task.CompletedTask;
        }
    }
}
