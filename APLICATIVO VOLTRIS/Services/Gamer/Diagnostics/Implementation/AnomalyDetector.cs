using System;
using System.Collections.Generic;
using System.Linq;
using VoltrisOptimizer.Services.Gamer.Diagnostics.Interfaces;
using VoltrisOptimizer.Services.Gamer.Diagnostics.Models;

namespace VoltrisOptimizer.Services.Gamer.Diagnostics.Implementation
{
    /// <summary>
    /// Detector de anomalias de performance
    /// </summary>
    public class AnomalyDetector : IPerformanceAnomalyDetector
    {
        private readonly List<PerformanceAnomaly> _detectedAnomalies = new List<PerformanceAnomaly>();
        private readonly object _lock = new object();
        private readonly int _maxAnomalies = 1000;

        // Thresholds configuráveis
        private const double ExecutionTimeThresholdMs = 3.0;
        private const double OrchestratorLoopThresholdMs = 10.0;
        private const double CpuUsageThresholdPercent = 5.0;
        private const double GpuUsageThresholdPercent = 2.0;
        private const double OverlayGpuThresholdPercent = 2.0;
        private const double VramFreezeThresholdMs = 50.0;

        public event EventHandler<PerformanceAnomaly>? AnomalyDetected;

        public IReadOnlyList<PerformanceAnomaly> AnalyzeSample(ModuleExecutionSample sample, ModuleStatistics statistics)
        {
            var anomalies = new List<PerformanceAnomaly>();

            // Verificar tempo de execução
            if (sample.ExecutionTimeMs > ExecutionTimeThresholdMs)
            {
                var anomaly = new PerformanceAnomaly
                {
                    Type = AnomalyType.ExecutionTimeExceeded,
                    Severity = sample.ExecutionTimeMs > 10 ? AnomalySeverity.Critical : AnomalySeverity.High,
                    ModuleName = sample.ModuleName,
                    Message = $"{sample.ModuleName} está consumindo {sample.ExecutionTimeMs:F2}ms — risco de microstutters.",
                    Timestamp = sample.Timestamp,
                    MeasuredValue = sample.ExecutionTimeMs,
                    ThresholdValue = ExecutionTimeThresholdMs,
                    Recommendation = $"Otimizar {sample.ModuleName} para reduzir tempo de execução abaixo de {ExecutionTimeThresholdMs}ms"
                };
                anomalies.Add(anomaly);
            }

            // Verificar uso de CPU
            if (sample.CpuUsagePercent > CpuUsageThresholdPercent)
            {
                var anomaly = new PerformanceAnomaly
                {
                    Type = AnomalyType.CpuUsageHigh,
                    Severity = sample.CpuUsagePercent > 10 ? AnomalySeverity.Critical : AnomalySeverity.Medium,
                    ModuleName = sample.ModuleName,
                    Message = $"{sample.ModuleName} está consumindo {sample.CpuUsagePercent:F1}% de CPU.",
                    Timestamp = sample.Timestamp,
                    MeasuredValue = sample.CpuUsagePercent,
                    ThresholdValue = CpuUsageThresholdPercent,
                    Recommendation = $"Reduzir overhead de CPU em {sample.ModuleName}"
                };
                anomalies.Add(anomaly);
            }

            // Verificar uso de GPU
            if (sample.GpuUsagePercent > GpuUsageThresholdPercent)
            {
                var anomaly = new PerformanceAnomaly
                {
                    Type = sample.ModuleName.Contains("Overlay") ? AnomalyType.OverlayGpuUsageHigh : AnomalyType.GpuUsageHigh,
                    Severity = AnomalySeverity.Medium,
                    ModuleName = sample.ModuleName,
                    Message = sample.ModuleName.Contains("Overlay") 
                        ? $"O overlay está consumindo {sample.GpuUsagePercent:F1}% de GPU."
                        : $"{sample.ModuleName} está consumindo {sample.GpuUsagePercent:F1}% de GPU.",
                    Timestamp = sample.Timestamp,
                    MeasuredValue = sample.GpuUsagePercent,
                    ThresholdValue = GpuUsageThresholdPercent,
                    Recommendation = $"Otimizar uso de GPU em {sample.ModuleName}"
                };
                anomalies.Add(anomaly);
            }

            // Verificar bloqueios de thread
            if (sample.ThreadBlocks > 0)
            {
                var anomaly = new PerformanceAnomaly
                {
                    Type = AnomalyType.ThreadBlockDetected,
                    Severity = sample.ThreadBlocks > 3 ? AnomalySeverity.Critical : AnomalySeverity.High,
                    ModuleName = sample.ModuleName,
                    Message = $"{sample.ModuleName} detectou {sample.ThreadBlocks} bloqueio(s) de thread.",
                    Timestamp = sample.Timestamp,
                    MeasuredValue = sample.ThreadBlocks,
                    ThresholdValue = 0,
                    Recommendation = $"Investigar bloqueios de thread em {sample.ModuleName}"
                };
                anomalies.Add(anomaly);
            }

            // Verificar exceções silenciosas
            if (sample.HadSilentException)
            {
                var anomaly = new PerformanceAnomaly
                {
                    Type = AnomalyType.SilentException,
                    Severity = AnomalySeverity.High,
                    ModuleName = sample.ModuleName,
                    Message = $"{sample.ModuleName} teve uma exceção silenciosa: {sample.ExceptionMessage}",
                    Timestamp = sample.Timestamp,
                    MeasuredValue = 1,
                    ThresholdValue = 0,
                    Recommendation = $"Corrigir exceção em {sample.ModuleName}: {sample.ExceptionMessage}"
                };
                anomalies.Add(anomaly);
            }

            // Verificar se está recalculando muito rápido (InputLagOptimizer)
            if (sample.ModuleName.Contains("InputLagOptimizer") && sample.ExecutionTimeMs < 0.1)
            {
                var anomaly = new PerformanceAnomaly
                {
                    Type = AnomalyType.ModuleRecalculatingTooFast,
                    Severity = AnomalySeverity.Low,
                    ModuleName = sample.ModuleName,
                    Message = $"{sample.ModuleName} está recalculando parâmetros rápido demais.",
                    Timestamp = sample.Timestamp,
                    MeasuredValue = sample.ExecutionTimeMs,
                    ThresholdValue = 0.1,
                    Recommendation = $"Ajustar frequência de recálculo em {sample.ModuleName}"
                };
                anomalies.Add(anomaly);
            }

            // Registrar anomalias
            foreach (var anomaly in anomalies)
            {
                RegisterAnomaly(anomaly);
            }

            return anomalies;
        }

        public IReadOnlyList<PerformanceAnomaly> AnalyzeSnapshot(ProfilingSnapshot snapshot)
        {
            var anomalies = new List<PerformanceAnomaly>();

            // Verificar loop do orquestrador
            if (snapshot.OrchestratorLoopTimeMs > OrchestratorLoopThresholdMs)
            {
                var anomaly = new PerformanceAnomaly
                {
                    Type = AnomalyType.OrchestratorLoopSlow,
                    Severity = snapshot.OrchestratorLoopTimeMs > 20 ? AnomalySeverity.Critical : AnomalySeverity.High,
                    ModuleName = "IntelligenceOrchestratorService",
                    Message = $"Orchestrator loop está demorando {snapshot.OrchestratorLoopTimeMs:F2}ms — deveria ser <{OrchestratorLoopThresholdMs}ms.",
                    Timestamp = snapshot.Timestamp,
                    MeasuredValue = snapshot.OrchestratorLoopTimeMs,
                    ThresholdValue = OrchestratorLoopThresholdMs,
                    Recommendation = "Otimizar loop do orquestrador ou reduzir frequência de execução"
                };
                anomalies.Add(anomaly);
            }

            // Verificar uso total de CPU
            if (snapshot.TotalCpuUsagePercent > 10)
            {
                var anomaly = new PerformanceAnomaly
                {
                    Type = AnomalyType.CpuUsageHigh,
                    Severity = snapshot.TotalCpuUsagePercent > 20 ? AnomalySeverity.Critical : AnomalySeverity.High,
                    ModuleName = "VoltrisOptimizer",
                    Message = $"Voltris está consumindo {snapshot.TotalCpuUsagePercent:F1}% de CPU — muito alto.",
                    Timestamp = snapshot.Timestamp,
                    MeasuredValue = snapshot.TotalCpuUsagePercent,
                    ThresholdValue = 5.0,
                    Recommendation = "Reduzir overhead geral do Voltris"
                };
                anomalies.Add(anomaly);
            }

            // Verificar uso de GPU do overlay
            if (snapshot.OverlayGpuUsagePercent > OverlayGpuThresholdPercent)
            {
                var anomaly = new PerformanceAnomaly
                {
                    Type = AnomalyType.OverlayGpuUsageHigh,
                    Severity = AnomalySeverity.Medium,
                    ModuleName = "OverlayService",
                    Message = $"O overlay está consumindo {snapshot.OverlayGpuUsagePercent:F1}% de GPU.",
                    Timestamp = snapshot.Timestamp,
                    MeasuredValue = snapshot.OverlayGpuUsagePercent,
                    ThresholdValue = OverlayGpuThresholdPercent,
                    Recommendation = "Otimizar renderização do overlay ou reduzir frequência de atualização"
                };
                anomalies.Add(anomaly);
            }

            // Verificar chamadas de rede durante gameplay
            if (snapshot.HasActiveNetworkCalls)
            {
                var anomaly = new PerformanceAnomaly
                {
                    Type = AnomalyType.NetworkCallDuringGameplay,
                    Severity = AnomalySeverity.Medium,
                    ModuleName = "NetworkIntelligence",
                    Message = "Chamadas de rede foram detectadas no modo gamer — possível lag.",
                    Timestamp = snapshot.Timestamp,
                    MeasuredValue = 1,
                    ThresholdValue = 0,
                    Recommendation = "Desabilitar chamadas de rede durante gameplay ativo"
                };
                anomalies.Add(anomaly);
            }

            // Verificar deadlocks parciais
            if (snapshot.PartialDeadlocks > 0)
            {
                var anomaly = new PerformanceAnomaly
                {
                    Type = AnomalyType.DeadlockPartial,
                    Severity = AnomalySeverity.Critical,
                    ModuleName = "System",
                    Message = $"Detectados {snapshot.PartialDeadlocks} deadlock(s) parcial(is).",
                    Timestamp = snapshot.Timestamp,
                    MeasuredValue = snapshot.PartialDeadlocks,
                    ThresholdValue = 0,
                    Recommendation = "Investigar e corrigir deadlocks parciais"
                };
                anomalies.Add(anomaly);
            }

            // Registrar anomalias
            foreach (var anomaly in anomalies)
            {
                RegisterAnomaly(anomaly);
            }

            return anomalies;
        }

        public IReadOnlyList<PerformanceAnomaly> GetDetectedAnomalies()
        {
            lock (_lock)
            {
                return _detectedAnomalies.ToList();
            }
        }

        public void ClearAnomalies(TimeSpan olderThan)
        {
            lock (_lock)
            {
                var cutoff = DateTime.Now - olderThan;
                _detectedAnomalies.RemoveAll(a => a.Timestamp < cutoff);
            }
        }

        private void RegisterAnomaly(PerformanceAnomaly anomaly)
        {
            lock (_lock)
            {
                _detectedAnomalies.Add(anomaly);
                while (_detectedAnomalies.Count > _maxAnomalies)
                {
                    _detectedAnomalies.RemoveAt(0);
                }
            }

            AnomalyDetected?.Invoke(this, anomaly);
        }
    }
}


