using System;
using System.Collections.Generic;

namespace VoltrisOptimizer.Services.Gamer.AIAutoFixer.Models
{
    /// <summary>
    /// Registro de problema para dataset de treinamento
    /// </summary>
    public class ProblemRecord
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public ProblemType Type { get; set; }
        public ProblemSeverity Severity { get; set; }

        // Contexto do Sistema
        public TelemetrySnapshot SystemContext { get; set; } = new TelemetrySnapshot();
        public Dictionary<string, object> ActiveConfigurations { get; set; } = new Dictionary<string, object>();
        public List<string> ActiveVoltrisModules { get; set; } = new List<string>();

        // Resultado Mensurado
        public double MeasuredFps { get; set; }
        public double MeasuredFrameTimeMs { get; set; }
        public double MeasuredCpuUsage { get; set; }
        public double MeasuredGpuUsage { get; set; }
        public bool HadStutter { get; set; }
        public double StutterSeverity { get; set; }

        // Causa Provável
        public string ProbableCause { get; set; } = "";
        public RootCauseAnalysis? RootCause { get; set; }

        // Solução Aplicada
        public List<AutoCorrection> AppliedCorrections { get; set; } = new List<AutoCorrection>();
        public bool WasResolved { get; set; }
        public double ImprovementAfterCorrection { get; set; }

        // Metadados
        public string GameName { get; set; } = "";
        public string SystemInfo { get; set; } = "";
    }
}


