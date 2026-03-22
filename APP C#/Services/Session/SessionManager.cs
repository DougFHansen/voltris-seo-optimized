using System;
using System.Threading.Tasks;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.Services.Session
{
    public class SessionManager
    {
        public SessionManager(ILoggingService logger, object activityMonitor, VoltrisOptimizer.Services.Telemetry.TelemetryService telemetryService, object identityService) { }
        public Task StartSessionAsync(string machineId) => Task.CompletedTask;
        public Task EndSessionAsync() => Task.CompletedTask;
    }
}
