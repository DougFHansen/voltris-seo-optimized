using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using DLS.Tests.Fakes;
using VoltrisOptimizer.Services.Gamer.Implementation;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using VoltrisOptimizer.Services.Gamer.Models;
using VoltrisOptimizer.Services.Optimization;
using Xunit;
using Microsoft.Extensions.DependencyInjection;

namespace DLS.Tests
{
    public class GamerOrchestratorIntegrationTests
    {
        [Fact]
        public async Task Activate_Enables_DLS_And_Sets_Status()
        {
            TestMetricsCollector.Reset();
            var logger = new FakeLoggingService();
            var cpu = new FakeCpuGamingOptimizer();
            var gpu = new FakeGpuGamingOptimizer();
            var net = new FakeNetworkGamingOptimizer();
            var mem = new FakeMemoryGamingOptimizer();
            var proc = new FakeProcessPrioritizer();
            var hw = new FakeHardwareDetector();
            var timer = new FakeTimerResolutionService();
            var gov = new FakeAdaptiveGovernor();
            var detector = new FakeGameDetector();
            var history = new VoltrisOptimizer.Services.HistoryService(logger);
            var immersive = new FakeImmersiveGamingOptimizer();

            var services = new Microsoft.Extensions.DependencyInjection.ServiceCollection();
            var dls = new DynamicLoadStabilizer(null, null, null, null, null, null);
            services.AddSingleton<IDynamicLoadStabilizer>(dls);
            var sp = services.BuildServiceProvider();
            var prop = typeof(VoltrisOptimizer.App).GetProperty("Services", System.Reflection.BindingFlags.Static | System.Reflection.BindingFlags.Public);
            var setter = prop?.GetSetMethod(true);
            setter?.Invoke(null, new object[] { sp });

            var orch = new GamerModeOrchestrator(logger, cpu, gpu, net, mem, proc, hw, detector, history, immersive, timer, gov);

            var options = new GamerOptimizationOptions
            {
                OptimizeCpu = true,
                OptimizeGpu = true,
                OptimizeNetwork = true,
                OptimizeMemory = true,
                ReduceLatency = true,
                EnableAntiStutter = true,
            };

            var sw = Stopwatch.StartNew();
            var ok = await orch.ActivateAsync(options, "FakeGame.exe", null, CancellationToken.None);
            sw.Stop();
            TestMetricsCollector.LastActivationDuration = sw.Elapsed;

            Assert.True(ok);
            Assert.True(orch.IsActive);

            await dls.StartAsync(Process.GetCurrentProcess().Id);
            ResourceHogger.CpuSpin(TimeSpan.FromMilliseconds(800), threads: Math.Max(1, Environment.ProcessorCount / 2));
            await dls.StopAsync();

            var okStop = await orch.DeactivateAsync(null, CancellationToken.None);
            Assert.True(okStop);
            Assert.False(orch.IsActive);
        }
    }
}
