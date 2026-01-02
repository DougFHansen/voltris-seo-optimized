using System.Threading.Tasks;
using VoltrisOptimizer.Services.Optimization;
using Xunit;

namespace DLS.Tests
{
    public class DlsExceptionSafetyTests
    {
        [Fact]
        public async Task Exceptions_Are_Caught_And_No_Crash()
        {
            var dls = new DynamicLoadStabilizer();
            await dls.StartAsync(null);
            await Task.Delay(200);
            await dls.StopAsync();
            Assert.False(dls.IsRunning);
        }
    }
}

