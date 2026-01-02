using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Core.SystemIntelligenceProfiler;
using Xunit;

namespace SystemIntelligenceProfiler.Tests
{
    public class AuditCollectorTests
    {
        [Fact]
        public async Task CollectAsync_Returns_Basic_Data()
        {
            var collector = new AuditCollector();
            var data = await collector.CollectAsync(CancellationToken.None);
            Assert.NotNull(data);
            Assert.True(data.Cpu.LogicalCores > 0);
            Assert.True(data.Ram.TotalMb >= 0);
        }
    }
}
