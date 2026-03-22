using System;
using System.Collections.Generic;

namespace VoltrisOptimizer.Services.Gamer.AIAutoFixer.Models
{
    /// <summary>
    /// Tipo de correção
    /// </summary>
    public enum CorrectionType
    {
        AdjustProcessPriority,
        PauseService,
        OptimizeCpuAffinity,
        AdjustGamerModeParams,
        RevertOptimization,
        ApplyPatch,
        AdjustNetwork,
        FixMemoryLeak,
        OptimizeLoop,
        ReduceModuleOverhead,
        AdjustThreadPriority,
        DisableProblematicFeature
    }

    /// <summary>
    /// Status da correção
    /// </summary>
    public enum CorrectionStatus
    {
        Pending,
        Applied,
        Reverted,
        Failed
    }

    /// <summary>
    /// Correção automática aplicada
    /// </summary>
    public class AutoCorrection
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public CorrectionType Type { get; set; }
        public CorrectionStatus Status { get; set; }
        public string Description { get; set; } = "";
        public string Reason { get; set; } = "";
        public Dictionary<string, object> Parameters { get; set; } = new Dictionary<string, object>();
        public Dictionary<string, object> OriginalState { get; set; } = new Dictionary<string, object>();
        public TelemetrySnapshot? BeforeSnapshot { get; set; }
        public TelemetrySnapshot? AfterSnapshot { get; set; }
        public double ImprovementPercent { get; set; }
        public bool ImprovedPerformance { get; set; }
        public string? ErrorMessage { get; set; }
        public bool CanRevert { get; set; } = true;
    }
}


