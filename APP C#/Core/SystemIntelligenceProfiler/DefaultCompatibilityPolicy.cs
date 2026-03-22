using VoltrisOptimizer.Core.SystemIntelligenceProfiler;
using VoltrisOptimizer.Interfaces;

namespace VoltrisOptimizer.Core.SystemIntelligenceProfiler
{
    public class DefaultCompatibilityPolicy : ICompatibilityPolicy
    {
        public bool IsAllowed(ActionRecommendation recommendation, AuditData audit)
        {
            if (recommendation.Category == RecommendationCategory.Safe) return true;
            if (recommendation.Category == RecommendationCategory.Conditional)
            {
                if (audit.Windows.Build < 19041) return false;
                if (audit.Gpu.IsIntegrated && recommendation.Module == "AdvancedOptimizer") return false;
                return true;
            }
            return false;
        }
    }
}
