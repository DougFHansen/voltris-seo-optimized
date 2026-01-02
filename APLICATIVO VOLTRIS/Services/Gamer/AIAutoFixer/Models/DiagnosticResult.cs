using System;
using System.Collections.Generic;

namespace VoltrisOptimizer.Services.Gamer.AIAutoFixer.Models
{
    /// <summary>
    /// Tipo de problema detectado
    /// </summary>
    public enum ProblemType
    {
        CpuOverload,
        GpuUnderutilized,
        HighDpcLatency,
        ServiceCausingStutter,
        ProcessPriorityConflict,
        FrameTimeUnstable,
        ThermalThrottling,
        PowerThrottling,
        ExcessiveDiskIo,
        NetworkLatency,
        VoltrisOverhead,
        ModuleConsumingTooMuch,
        OptimizationConflict,
        ConfigurationRegression,
        MemoryLeak,
        ThreadBlock,
        KernelTimeSpike,
        Unknown
    }

    /// <summary>
    /// Severidade do problema
    /// </summary>
    public enum ProblemSeverity
    {
        Low,
        Medium,
        High,
        Critical
    }

    /// <summary>
    /// Resultado de diagnóstico
    /// </summary>
    public class DiagnosticResult
    {
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public ProblemType Type { get; set; }
        public ProblemSeverity Severity { get; set; }
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public string? AffectedComponent { get; set; }
        public Dictionary<string, object> Metrics { get; set; } = new Dictionary<string, object>();
        public RootCauseAnalysis? RootCause { get; set; }
        public List<RecommendedAction> RecommendedActions { get; set; } = new List<RecommendedAction>();
        public double Confidence { get; set; } // 0-1, confiança no diagnóstico
    }

    /// <summary>
    /// Análise de causa raiz
    /// </summary>
    public class RootCauseAnalysis
    {
        public string PrimaryCause { get; set; } = "";
        public List<string> ContributingFactors { get; set; } = new List<string>();
        public Dictionary<string, double> CauseConfidence { get; set; } = new Dictionary<string, double>();
        public string AnalysisDetails { get; set; } = "";
    }

    /// <summary>
    /// Ação recomendada
    /// </summary>
    public class RecommendedAction
    {
        public string Action { get; set; } = "";
        public string Description { get; set; } = "";
        public double ExpectedImprovement { get; set; } // 0-1, melhoria esperada
        public bool CanAutoApply { get; set; }
    }

    /// <summary>
    /// Regressão de performance detectada
    /// </summary>
    public class PerformanceRegression
    {
        public DateTime DetectedAt { get; set; }
        public string Metric { get; set; } = "";
        public double BeforeValue { get; set; }
        public double AfterValue { get; set; }
        public double RegressionPercent { get; set; }
        public string? ProbableCause { get; set; }
        public List<AutoCorrection> RelatedCorrections { get; set; } = new List<AutoCorrection>();
    }
}


