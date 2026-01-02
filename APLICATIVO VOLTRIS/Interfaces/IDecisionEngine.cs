using System.Collections.Generic;

namespace VoltrisOptimizer.Core.SystemIntelligenceProfiler
{
    public interface IDecisionEngine
    {
        List<ActionRecommendation> Evaluate(AuditData audit, UserAnswers answers);
    }
}

