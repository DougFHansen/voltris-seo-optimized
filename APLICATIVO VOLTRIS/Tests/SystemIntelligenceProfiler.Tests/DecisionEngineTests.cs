using System.Collections.Generic;
using VoltrisOptimizer.Core.SystemIntelligenceProfiler;
using Xunit;

namespace SystemIntelligenceProfiler.Tests
{
    public class DecisionEngineTests
    {
        [Fact]
        public void Evaluate_Returns_Safe_Conditional_Risky()
        {
            var audit = new AuditData { SupportsHighPerformancePlan = true, Windows = new WindowsInfo { IsAdmin = true } };
            var answers = new UserAnswers { UseCase = "Jogos competitivos", Priority = "Performance" };
            var engine = new DecisionEngine();

            List<ActionRecommendation> recs = engine.Evaluate(audit, answers);

            Assert.Contains(recs, r => r.Category == RecommendationCategory.Safe);
            Assert.Contains(recs, r => r.Category == RecommendationCategory.Conditional);
            Assert.Contains(recs, r => r.Category == RecommendationCategory.Risky);
        }
    }
}
