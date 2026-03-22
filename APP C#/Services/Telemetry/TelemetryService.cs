using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace VoltrisOptimizer.Services.Telemetry
{
    public class TelemetryService
    {
        public TelemetryService() { }
        public Task InitializeAsync(string machineId, string? sessionId) => Task.CompletedTask;
        public Task ShutdownAsync() => Task.CompletedTask;
        public Task TrackExceptionAsync(Exception exception, string context, Dictionary<string, object>? metadata = null) => Task.CompletedTask;
        public string? GetDeviceId() => "unknown";
        public Task TrackEvent(string eventName, Dictionary<string, object>? properties = null) => Task.CompletedTask;
        public Task TrackEvent(string eventType, string featureName, string actionName, double durationMs = 0, object? metadata = null, bool success = true, bool forceFlush = false) => Task.CompletedTask;
        public Task<List<object>> GetFilteredEventsAsync(DateTime startTime, DateTime endTime) => Task.FromResult(new List<object>());
        public Task<object> GenerateUsageStatisticsAsync(DateTime? startTime, DateTime? endTime) => Task.FromResult<object>(new { });
    }
}
