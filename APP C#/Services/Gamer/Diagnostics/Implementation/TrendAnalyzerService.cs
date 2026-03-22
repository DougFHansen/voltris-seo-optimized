using System;
using System.Collections.Generic;
using System.Linq;
using VoltrisOptimizer.Services.Gamer.Models;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.Services.Gamer.Diagnostics.Implementation
{
    public class TrendAnalyzerService
    {
        private readonly ILoggingService _logger;
        private readonly List<GameDiagnosticsService.Sample> _history = new();
        private const int MaxHistory = 50;

        public event Action<TrendWarning>? WarningDetected;

        public TrendAnalyzerService(ILoggingService logger)
        {
            _logger = logger;
        }

        public void Analyze(IEnumerable<GameDiagnosticsService.Sample> samples)
        {
            var latest = samples.LastOrDefault();
            if (latest == null) return;

            _history.Add(latest);
            if (_history.Count > MaxHistory) _history.RemoveAt(0);

            if (_history.Count < 5) return;

            // 1. Thermal Runaway Detect (Rising fast)
            AnalyzeThermalTrends();

            // 2. Performance Degradation Detect
            AnalyzePerfTrends();

            // 3. Resource Exhaustion
            AnalyzeResourceExhaustion(latest);
        }

        private void AnalyzeThermalTrends()
        {
            if (_history.Count < 10) return;

            var recent = _history.TakeLast(10).ToList();
            var cpuDelta = recent.Last().CpuTemperature - recent.First().CpuTemperature;
            var gpuDelta = recent.Last().GpuTemperature - recent.First().GpuTemperature;

            // Se subiu mais de 5 graus em 10 amostras (aprox 7.5s)
            if (cpuDelta > 5 && recent.Last().CpuTemperature > 75)
            {
                NotifyWarning(new TrendWarning 
                { 
                    Type = WarningType.Thermal, 
                    Severity = WarningSeverity.Warning,
                    Message = "CPU esquentando rapidamente! Verifique a ventilação." 
                });
            }

            if (gpuDelta > 5 && recent.Last().GpuTemperature > 75)
            {
                NotifyWarning(new TrendWarning 
                { 
                    Type = WarningType.Thermal, 
                    Severity = WarningSeverity.Warning,
                    Message = "GPU esquentando rapidamente! Fan curve pode estar baixa." 
                });
            }
        }

        private void AnalyzePerfTrends()
        {
            var recent = _history.TakeLast(20).ToList();
            if (recent.Count < 20) return;

            var avgFpsFirst = recent.Take(10).Average(s => s.Fps);
            var avgFpsLast = recent.TakeLast(10).Average(s => s.Fps);

            if (avgFpsFirst > 30 && avgFpsLast < avgFpsFirst * 0.7) // 30% drop
            {
                NotifyWarning(new TrendWarning 
                { 
                    Type = WarningType.Performance, 
                    Severity = WarningSeverity.Critical,
                    Message = "Queda severa de performance detectada! Possível stutter eminente." 
                });
            }
        }

        private void AnalyzeResourceExhaustion(GameDiagnosticsService.Sample latest)
        {
            if (latest.RamTotalGb > 1.0 && latest.RamUsedGb > latest.RamTotalGb * 0.95)
            {
                NotifyWarning(new TrendWarning 
                { 
                    Type = WarningType.Resource, 
                    Severity = WarningSeverity.Critical,
                    Message = "Memória RAM quase esgotada! Risco de crash do sistema." 
                });
            }

            if (latest.GpuVramUsedMb > 0 && latest.GpuVramTotalMb > 0 && latest.GpuVramUsedMb > latest.GpuVramTotalMb * 0.95)
            {
                NotifyWarning(new TrendWarning 
                { 
                    Type = WarningType.Resource, 
                    Severity = WarningSeverity.Warning,
                    Message = "VRAM da GPU quase esgotada. Pode ocorrer stuttering por swap de memória." 
                });
            }
        }

        private DateTime _lastWarningTime = DateTime.MinValue;
        private string _lastWarningMsg = "";

        private void NotifyWarning(TrendWarning warning)
        {
            // Throttling de notificações (1 por 30 segundos se for a mesma mensagem)
            if (warning.Message == _lastWarningMsg && (DateTime.Now - _lastWarningTime).TotalSeconds < 30)
                return;

            _lastWarningTime = DateTime.Now;
            _lastWarningMsg = warning.Message;

            _logger.LogWarning($"[TrendAI] ⚠️ {warning.Message}");
            WarningDetected?.Invoke(warning);
        }
    }

    public enum WarningType { Thermal, Performance, Resource, Stability }
    public enum WarningSeverity { Info, Warning, Critical }

    public class TrendWarning
    {
        public WarningType Type { get; set; }
        public WarningSeverity Severity { get; set; }
        public string Message { get; set; } = "";
        public DateTime Timestamp { get; set; } = DateTime.Now;
    }
}
