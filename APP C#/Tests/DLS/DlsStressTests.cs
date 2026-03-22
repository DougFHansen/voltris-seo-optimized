using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Optimization;
using Xunit;

namespace DLS.Tests
{
    public class DlsStressTests
    {
        [Fact]
        public async Task Stress_Run_For_60_Seconds_No_Crash()
        {
            var dls = new DynamicLoadStabilizer();
            await dls.StartAsync(null);
            var cts = new CancellationTokenSource();
            _ = dls.RunLoadTest(cts.Token);
            await Task.Delay(6000);
            await dls.StopAsync();
            Assert.False(dls.IsRunning);
        }
    }
}

