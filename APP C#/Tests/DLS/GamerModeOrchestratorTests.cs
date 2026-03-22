using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using VoltrisOptimizer.Services.Optimization;
using VoltrisOptimizer.Services.Optimization.Providers;
using Xunit;

namespace DLS.Tests
{
    public class GamerModeOrchestratorTests
    {
        [Fact]
        public async Task Activating_Gamer_Starts_DLS()
        {
            var services = new ServiceCollection();
            services.AddSingleton<IDynamicLoadStabilizer, DynamicLoadStabilizer>();
            var sp = services.BuildServiceProvider();
            var prop = typeof(VoltrisOptimizer.App).GetProperty("Services", System.Reflection.BindingFlags.Static | System.Reflection.BindingFlags.Public);
            var setter = prop?.GetSetMethod(true);
            setter?.Invoke(null, new object[] { sp });
            var dls = sp.GetService<IDynamicLoadStabilizer>()!;
            await dls.StartAsync(null, CancellationToken.None);
            Assert.True(dls.IsRunning);
            await dls.StopAsync(CancellationToken.None);
            Assert.False(dls.IsRunning);
        }
    }
}
