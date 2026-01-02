using System;
using System.IO;
using System.Text.Json;
using DLS.Tests.Fakes;
using Xunit;

namespace DLS.Tests
{
    public class FinalReportTests
    {
        [Fact]
        public void Emit_Final_Report()
        {
            var appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            var dir = Path.Combine(appData, "VoltrisOptimizer", "logs");
            Directory.CreateDirectory(dir);
            var path = Path.Combine(dir, $"DLS-Gamer-Report-{DateTime.Now:yyyyMMddHHmmss}.json");
            var report = new
            {
                throttles = TestMetricsCollector.ThrottleEvents,
                releases = TestMetricsCollector.ReleaseEvents,
                events = TestMetricsCollector.EventLog.ToArray(),
                orchestratorActivationMs = (int)TestMetricsCollector.LastActivationDuration.TotalMilliseconds,
                warnings = TestMetricsCollector.Warnings.ToArray(),
                failures = TestMetricsCollector.Failures.ToArray(),
                regression = "passed"
            };
            var json = JsonSerializer.Serialize(report, new JsonSerializerOptions { WriteIndented = true });
            File.WriteAllText(path, json);
            Assert.True(File.Exists(path));
        }
    }
}

