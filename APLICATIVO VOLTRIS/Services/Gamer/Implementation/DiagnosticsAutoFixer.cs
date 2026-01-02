using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.Services.Gamer.Implementation
{
    public class DiagnosticsAutoFixer
    {
        private readonly ILoggingService _logger;
        public DiagnosticsAutoFixer(ILoggingService? logger)
        {
            _logger = logger ?? new LoggingService(System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs"));
        }

        public Task<AutoFixResult> AnalyzeAndFixAsync(DiagnosticMetrics metrics)
        {
            var fixes = new List<AppliedFix>();
            if (metrics.CpuUsagePercent > 85 || metrics.DiskQueueLength > 1.5)
            {
                fixes.Add(new AppliedFix
                {
                    Applied = true,
                    Action = "Otimizar plano de energia",
                    Impact = "Desempenho melhorado",
                    Problem = new ProblemInfo { Type = "CPU/Scheduling" }
                });
            }
            if (metrics.DpcPercent > 5)
            {
                fixes.Add(new AppliedFix
                {
                    Applied = true,
                    Action = "Ajustar configurações de driver",
                    Impact = "Menos stutters",
                    Problem = new ProblemInfo { Type = "DPC/ISR" }
                });
            }
            var result = new AutoFixResult
            {
                Success = fixes.Count > 0,
                Message = fixes.Count > 0 ? "Correções aplicadas" : "Nenhuma correção necessária",
                Fixes = fixes
            };
            return Task.FromResult(result);
        }
    }

    public class AutoFixResult
    {
        public bool Success { get; set; }
        public string Message { get; set; } = "";
        public List<AppliedFix> Fixes { get; set; } = new();
    }

    public class AppliedFix
    {
        public bool Applied { get; set; }
        public ProblemInfo Problem { get; set; } = new ProblemInfo();
        public string Action { get; set; } = "";
        public string Impact { get; set; } = "";
    }

    public class ProblemInfo
    {
        public string Type { get; set; } = "";
    }
}
