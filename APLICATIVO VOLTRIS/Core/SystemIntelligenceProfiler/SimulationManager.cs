using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace VoltrisOptimizer.Core.SystemIntelligenceProfiler
{
    public class SimulationManager
    {
        public Task<SimulationResult> SimulateAsync(IEnumerable<ActionRecommendation> actions)
        {
            var list = actions.Where(a => a.Supported).ToList();
            var gain = list.Sum(a => a.ExpectedGainScore);
            var risk = list.Sum(a => a.RiskScore);
            return Task.FromResult(new SimulationResult
            {
                TotalActions = list.Count,
                AggregateExpectedGain = gain,
                AggregateRiskScore = risk,
            });
        }
    }

    public class SimulationResult
    {
        public int TotalActions { get; set; }
        public int AggregateExpectedGain { get; set; }
        public int AggregateRiskScore { get; set; }
    }
}

