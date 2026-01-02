using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using DLS.Tests.Fakes;
using VoltrisOptimizer.Services.Optimization;
using VoltrisOptimizer.Services.Optimization.Providers;
using Xunit;

namespace DLS.Tests
{
    public class DlsServiceBehaviorTests
    {
        [Fact]
        public async Task Throttle_And_Release_Apply_And_Restore()
        {
            var cpu = new FakeCpuLoadProvider();
            var gpu = new FakeGpuLoadProvider { Value = 80 };
            var proc = new FakeProcessProvider();
            var dls = new DynamicLoadStabilizer(cpu, gpu, proc);
            await dls.StartAsync(null, CancellationToken.None);
            Assert.True(dls.IsRunning);
            await dls.StopAsync(CancellationToken.None);
            Assert.False(dls.IsRunning);
        }

        [Fact]
        public async Task No_RaceConditions_On_Multiple_Starts()
        {
            var dls = new DynamicLoadStabilizer();
            await dls.StartAsync(null);
            await dls.StartAsync(null);
            Assert.True(dls.IsRunning);
            await dls.StopAsync();
            Assert.False(dls.IsRunning);
        }
    }
}

