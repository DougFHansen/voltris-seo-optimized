using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace VoltrisOptimizer.Services.Gamer.Diagnostics.Models
{
    /// <summary>
    /// Tipo de anomalia detectada
    /// </summary>
    public enum AnomalyType
    {
        ExecutionTimeExceeded,
        CpuUsageHigh,
        GpuUsageHigh,
        ThreadBlockDetected,
        MemoryLeakSuspected,
        LoopTooSlow,
        AsyncCallSlow,
        NetworkCallDuringGameplay,
        OverlayGpuUsageHigh,
        VramFreezeDetected,
        OrchestratorLoopSlow,
        ModuleRecalculatingTooFast,
        SilentException,
        DeadlockPartial
    }

    /// <summary>
    /// Severidade da anomalia
    /// </summary>
    public enum AnomalySeverity
    {
        Low,
        Medium,
        High,
        Critical
    }

    /// <summary>
    /// Representa uma anomalia de performance detectada
    /// </summary>
    public class PerformanceAnomaly
    {
        /// <summary>
        /// Tipo da anomalia
        /// </summary>
        public AnomalyType Type { get; set; }

        /// <summary>
        /// Severidade da anomalia
        /// </summary>
        public AnomalySeverity Severity { get; set; }

        /// <summary>
        /// Nome do módulo afetado
        /// </summary>
        public string ModuleName { get; set; } = "";

        /// <summary>
        /// Mensagem descritiva da anomalia
        /// </summary>
        public string Message { get; set; } = "";

        /// <summary>
        /// Timestamp da detecção
        /// </summary>
        public DateTime Timestamp { get; set; } = DateTime.Now;

        /// <summary>
        /// Valor medido que causou a anomalia
        /// </summary>
        public double MeasuredValue { get; set; }

        /// <summary>
        /// Valor threshold que foi ultrapassado
        /// </summary>
        public double ThresholdValue { get; set; }

        /// <summary>
        /// Recomendação para resolver o problema
        /// </summary>
        public string Recommendation { get; set; } = "";

        /// <summary>
        /// Dados adicionais da anomalia
        /// </summary>
        public Dictionary<string, object> AdditionalData { get; set; } = new Dictionary<string, object>();
    }
}

