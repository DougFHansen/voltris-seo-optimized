using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace VoltrisOptimizer.Core.SystemIntelligenceProfiler
{
    public interface ISystemProfiler
    {
        bool RequireGate { get; }
        bool IsGateCompleted { get; }
        Task<ProfilerReport> StartAuditAsync(CancellationToken ct);
        Task<ProfilerReport> AnalyzeAsync(CancellationToken ct = default);
        Task<ProfilerReport?> GetLastReportAsync();
        List<ActionRecommendation> GetRecommendations(ProfilerReport report, UserAnswers answers);
        Task<ApplyResult> ApplyActionsAsync(IEnumerable<ActionRecommendation> actions, bool simulateOnly, CancellationToken ct);
        void MarkGateCompleted();
    }
}
