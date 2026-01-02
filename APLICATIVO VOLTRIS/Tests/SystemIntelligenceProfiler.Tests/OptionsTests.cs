using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using VoltrisOptimizer.Config;
using Xunit;

namespace SystemIntelligenceProfiler.Tests
{
    public class OptionsTests
    {
        [Fact]
        public void OptimizationOptions_Loads_From_AppSettings()
        {
            var services = new ServiceCollection();
            var config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json", optional: true)
                .Build();
            services.AddSingleton<IConfiguration>(config);
            services.Configure<OptimizationOptions>(config.GetSection("Optimization"));
            var sp = services.BuildServiceProvider();

            var opts = sp.GetRequiredService<IOptions<OptimizationOptions>>().Value;
            Assert.NotNull(opts);
        }
    }
}
