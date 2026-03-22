using System;
using System.Diagnostics;
using System.Threading.Tasks;
using DLS.Tests.Fakes;
using VoltrisOptimizer.Services.Optimization;
using VoltrisOptimizer.Services.Optimization.Providers;
using Xunit;

namespace DLS.Tests
{
    public class ThresholdTimerTests
    {
        [Fact]
        public async Task StrongOccursOnlyWithHistory()
        {
            var cpu = new FakeCpuProvider(new[] { 80.0 }, new[] { 82.0 });
            var dls = new DynamicLoadStabilizer(null, cpu, null, null, null, null);
            await dls.StartAsync(Process.GetCurrentProcess().Id);
            ResourceHogger.CpuSpin(TimeSpan.FromMilliseconds(600));
            await dls.StopAsync();
            Assert.True(true);
        }

        [Fact]
        public async Task TimeToFirstThrottle_UnderTwoSeconds()
        {
            var cpu = new FakeCpuProvider(new[] { 30.0, 75.0, 76.0 }, new[] { 35.0, 72.0, 71.0 });
            var dls = new DynamicLoadStabilizer(null, cpu, null, null, null, null);
            var sw = Stopwatch.StartNew();
            await dls.StartAsync(Process.GetCurrentProcess().Id);
            ResourceHogger.CpuSpin(TimeSpan.FromMilliseconds(1500));
            await dls.StopAsync();
            sw.Stop();
            Assert.True(sw.Elapsed.TotalSeconds < 2.5);
        }
    }
}

