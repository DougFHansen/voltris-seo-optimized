using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Core.SystemIntelligenceProfiler;
using Xunit;

namespace SystemIntelligenceProfiler.Tests
{
    public class IntegrationTests
    {
        [Fact]
        public async Task Simulate_Apply_On_Mid_Tier()
        {
            var profiler = new VoltrisOptimizer.Core.SystemIntelligenceProfiler.SystemIntelligenceProfiler();
            var report = await profiler.StartAuditAsync(CancellationToken.None);
            var actions = report.Recommendations.Take(3);
            var result = await profiler.ApplyActionsAsync(actions, simulateOnly: true, CancellationToken.None);
            Assert.True(result.Success);
            Assert.NotEmpty(result.Applied);
        }

        [Fact]
        public async Task Simulate_Apply_On_High_End()
        {
            var audit = new AuditData { SupportsHighPerformancePlan = true, Cpu = new CpuInfo { LogicalCores = 16 }, Ram = new RamInfo { TotalMb = 32768 }, Windows = new WindowsInfo { IsAdmin = true } };
            var answers = new UserAnswers { UseCase = "Jogos competitivos", Priority = "Performance" };
            var engine = new DecisionEngine();
            var report = engine.Evaluate(audit, answers);
            var profiler = new VoltrisOptimizer.Core.SystemIntelligenceProfiler.SystemIntelligenceProfiler();
            var result = await profiler.ApplyActionsAsync(report.Recommendations.Take(4), simulateOnly: true, CancellationToken.None);
            Assert.True(result.Success);
        }
    }
}
