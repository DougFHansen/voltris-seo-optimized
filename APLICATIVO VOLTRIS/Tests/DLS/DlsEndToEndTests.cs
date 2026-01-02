using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Optimization;
using Xunit;

namespace DLS.Tests
{
    public class DlsEndToEndTests
    {
        [Fact]
        public async Task EndToEnd_Simple_Flow()
        {
            var dls = new DynamicLoadStabilizer();
            await dls.StartAsync(null);
            await Task.Delay(500);
            await dls.StopAsync();
            Assert.False(dls.IsRunning);
        }
    }
}

