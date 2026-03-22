using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Gamer.Diagnostics.Interfaces;
using VoltrisOptimizer.Services.Gamer.Diagnostics.Models;

namespace VoltrisOptimizer.Services.Gamer.Diagnostics.Implementation
{
    /// <summary>
    /// Serviço principal de self-profiling do modo gamer
    /// Monitora e analisa o comportamento interno do Voltris em tempo real
    /// </summary>
    public class SelfProfilerService : IGamerSelfProfiler
    {
        private readonly IPerformanceAnomalyDetector _anomalyDetector;
        private readonly Dictionary<string, IModuleProfiler> _moduleProfilers = new Dictionary<string, IModuleProfiler>();
        private readonly object _lock = new object();
        private readonly Process _currentProcess;
        private readonly PerformanceCounter? _cpuCounter;
        private readonly PerformanceCounter? _memoryCounter;

        private CancellationTokenSource? _profilingCts;
        private Task? _profilingTask;
        private DateTime _startTime;
        private ProfilingSnapshot? _lastSnapshot;
        private readonly Queue<double> _orchestratorLoopTimes = new Queue<double>();
        private readonly int _maxOrchestratorHistory = 100;

        public bool IsActive { get; private set; }

        public event EventHandler<PerformanceAnomaly>? AnomalyDetected;
        public event EventHandler<ProfilingSnapshot>? SnapshotUpdated;

        // Módulos conhecidos para profiling
        private readonly string[] _knownModules = new[]
        {
            "GameDetectionService",
            "FrameTimeOptimizer",
            "InputLagOptimizer",
            "NetworkIntelligence",
            "VramManager",
            "PowerBalancer",
            "IntelligenceOrchestratorService",
            "OverlayService",
            "MetricsCollector"
        };

        public SelfProfilerService(IPerformanceAnomalyDetector anomalyDetector)
        {
            _anomalyDetector = anomalyDetector ?? throw new ArgumentNullException(nameof(anomalyDetector));
            _currentProcess = Process.GetCurrentProcess();

            // Inicializar performance counters
            try
            {
                _cpuCounter = new PerformanceCounter("Process", "% Processor Time", _currentProcess.ProcessName, true);
                _memoryCounter = new PerformanceCounter("Process", "Working Set", _currentProcess.ProcessName, true);
            }
            catch
            {
                // Performance counters podem não estar disponíveis em alguns sistemas
            }

            // Criar profilers para módulos conhecidos
            foreach (var moduleName in _knownModules)
            {
                _moduleProfilers[moduleName] = new ModuleProfiler(moduleName);
            }

            // Subscrever eventos do detector de anomalias
            _anomalyDetector.AnomalyDetected += (s, e) => AnomalyDetected?.Invoke(this, e);
        }

        public async Task StartAsync(CancellationToken cancellationToken = default)
        {
            lock (_lock)
            {
                if (IsActive)
                    return;

                IsActive = true;
                _startTime = DateTime.Now;
                _profilingCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);

                // Iniciar task de profiling
                _profilingTask = Task.Run(() => ProfilingLoopAsync(_profilingCts.Token), _profilingCts.Token);
            }

            await Task.CompletedTask;
        }

        public async Task StopAsync()
        {
            lock (_lock)
            {
                if (!IsActive)
                    return;

                IsActive = false;
                _profilingCts?.Cancel();
            }

            if (_profilingTask != null)
            {
                try
                {
                    await _profilingTask;
                }
                catch (OperationCanceledException)
                {
                    // Esperado ao cancelar
                }
            }

            _profilingCts?.Dispose();
            _profilingCts = null;
        }

        public void BeginModuleExecution(string moduleName)
        {
            if (!IsActive) return;

            var profiler = GetOrCreateModuleProfiler(moduleName);
            profiler.BeginExecution();
        }

        public void EndModuleExecution(string moduleName)
        {
            if (!IsActive) return;

            var profiler = GetOrCreateModuleProfiler(moduleName);
            using (profiler.BeginExecution())
            {
                // O using automaticamente registra a execução
            }
        }

        public void RecordModuleExecution(string moduleName, double executionTimeMs, double cpuUsagePercent = 0, double gpuUsagePercent = 0, int threadBlocks = 0)
        {
            if (!IsActive) return;

            var profiler = GetOrCreateModuleProfiler(moduleName);
            profiler.RecordExecution(executionTimeMs, cpuUsagePercent, gpuUsagePercent, threadBlocks);

            // Obter estatísticas e detectar anomalias
            var statistics = profiler.GetStatistics();
            var sample = new ModuleExecutionSample
            {
                ModuleName = moduleName,
                Timestamp = DateTime.Now,
                ExecutionTimeMs = executionTimeMs,
                CpuUsagePercent = cpuUsagePercent,
                GpuUsagePercent = gpuUsagePercent,
                ThreadBlocks = threadBlocks
            };

            var anomalies = _anomalyDetector.AnalyzeSample(sample, statistics);
            foreach (var anomaly in anomalies)
            {
                AnomalyDetected?.Invoke(this, anomaly);
            }
        }

        public void RecordOrchestratorLoop(double loopTimeMs)
        {
            if (!IsActive) return;

            lock (_lock)
            {
                _orchestratorLoopTimes.Enqueue(loopTimeMs);
                while (_orchestratorLoopTimes.Count > _maxOrchestratorHistory)
                {
                    _orchestratorLoopTimes.Dequeue();
                }
            }
        }

        public ProfilingReport GetCurrentReport()
        {
            lock (_lock)
            {
                var snapshot = GenerateSnapshot();
                var duration = DateTime.Now - _startTime;

                var report = new ProfilingReport
                {
                    GeneratedAt = DateTime.Now,
                    ProfilingDuration = duration,
                    CurrentSnapshot = snapshot,
                    ModuleStatistics = _moduleProfilers.ToDictionary(
                        kvp => kvp.Key,
                        kvp => kvp.Value.GetStatistics()
                    ),
                    AllAnomalies = _anomalyDetector.GetDetectedAnomalies().ToList(),
                    Summary = GenerateSummary(snapshot)
                };

                return report;
            }
        }

        public IReadOnlyList<ModuleExecutionSample> GetModuleHistory(string moduleName, int maxSamples = 100)
        {
            lock (_lock)
            {
                if (!_moduleProfilers.TryGetValue(moduleName, out var profiler))
                    return new List<ModuleExecutionSample>();

                return profiler.GetHistory(maxSamples);
            }
        }

        public IReadOnlyList<PerformanceAnomaly> GetDetectedAnomalies()
        {
            return _anomalyDetector.GetDetectedAnomalies();
        }

        public void ClearHistory()
        {
            lock (_lock)
            {
                foreach (var profiler in _moduleProfilers.Values)
                {
                    profiler.ClearHistory();
                }
                _orchestratorLoopTimes.Clear();
                _anomalyDetector.ClearAnomalies(TimeSpan.Zero);
            }
        }

        public async Task<string> ExportReportAsync()
        {
            var report = GetCurrentReport();
            var options = new JsonSerializerOptions
            {
                WriteIndented = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            };
            return JsonSerializer.Serialize(report, options);
        }

        private async Task ProfilingLoopAsync(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested && IsActive)
            {
                try
                {
                    var snapshot = GenerateSnapshot();
                    _lastSnapshot = snapshot;

                    // Detectar anomalias no snapshot
                    var anomalies = _anomalyDetector.AnalyzeSnapshot(snapshot);
                    foreach (var anomaly in anomalies)
                    {
                        AnomalyDetected?.Invoke(this, anomaly);
                    }

                    // Disparar evento de atualização
                    SnapshotUpdated?.Invoke(this, snapshot);

                    // Aguardar antes da próxima iteração (300-500ms para UI suave)
                    await Task.Delay(400, cancellationToken);
                }
                catch (OperationCanceledException)
                {
                    break;
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"[SelfProfiler] Erro no loop de profiling: {ex.Message}");
                    await Task.Delay(1000, cancellationToken);
                }
            }
        }

        private ProfilingSnapshot GenerateSnapshot()
        {
            lock (_lock)
            {
                var snapshot = new ProfilingSnapshot
                {
                    Timestamp = DateTime.Now
                };

                // Calcular tempo médio do loop do orquestrador
                if (_orchestratorLoopTimes.Count > 0)
                {
                    snapshot.OrchestratorLoopTimeMs = _orchestratorLoopTimes.Average();
                }

                // Obter uso de CPU total
                try
                {
                    if (_cpuCounter != null)
                    {
                        snapshot.TotalCpuUsagePercent = _cpuCounter.NextValue() / Environment.ProcessorCount;
                    }
                    else
                    {
                        snapshot.TotalCpuUsagePercent = _currentProcess.TotalProcessorTime.TotalMilliseconds / 100.0;
                    }
                }
                catch
                {
                    snapshot.TotalCpuUsagePercent = 0;
                }

                // Obter uso de memória
                try
                {
                    if (_memoryCounter != null)
                    {
                        snapshot.TotalMemoryUsageMb = _memoryCounter.NextValue() / 1024.0 / 1024.0;
                    }
                    else
                    {
                        snapshot.TotalMemoryUsageMb = _currentProcess.WorkingSet64 / 1024.0 / 1024.0;
                    }
                }
                catch
                {
                    snapshot.TotalMemoryUsageMb = _currentProcess.WorkingSet64 / 1024.0 / 1024.0;
                }

                // Obter número de threads
                snapshot.ActiveThreads = _currentProcess.Threads.Count;

                // Obter estatísticas de cada módulo
                foreach (var kvp in _moduleProfilers)
                {
                    var stats = kvp.Value.GetStatistics();
                    snapshot.ModuleStatistics[kvp.Key] = stats;

                    // Calcular uso de GPU do overlay se disponível
                    if (kvp.Key == "OverlayService" && stats.AverageGpuUsagePercent > 0)
                    {
                        snapshot.OverlayGpuUsagePercent = stats.AverageGpuUsagePercent;
                    }
                }

                // Obter anomalias
                snapshot.Anomalies = _anomalyDetector.GetDetectedAnomalies()
                    .Where(a => (DateTime.Now - a.Timestamp).TotalMinutes < 5)
                    .ToList();

                // Calcular latência interna (soma dos tempos médios dos módulos)
                snapshot.InternalLatencyMs = snapshot.ModuleStatistics.Values
                    .Sum(s => s.AverageExecutionTimeMs);

                // Detectar deadlocks parciais (threads bloqueadas)
                snapshot.PartialDeadlocks = snapshot.ModuleStatistics.Values
                    .Sum(s => s.TotalThreadBlocks);

                return snapshot;
            }
        }

        private ProfilingSummary GenerateSummary(ProfilingSnapshot snapshot)
        {
            var summary = new ProfilingSummary();

            if (snapshot.ModuleStatistics.Count > 0)
            {
                var slowest = snapshot.ModuleStatistics
                    .OrderByDescending(kvp => kvp.Value.AverageExecutionTimeMs)
                    .FirstOrDefault();
                summary.SlowestModule = slowest.Key;

                var highestCpu = snapshot.ModuleStatistics
                    .OrderByDescending(kvp => kvp.Value.AverageCpuUsagePercent)
                    .FirstOrDefault();
                summary.HighestCpuModule = highestCpu.Key;
            }

            summary.CriticalAnomalies = snapshot.Anomalies.Count(a => a.Severity == AnomalySeverity.Critical);
            summary.HighSeverityAnomalies = snapshot.Anomalies.Count(a => a.Severity == AnomalySeverity.High);
            summary.AverageOrchestratorLoopTimeMs = snapshot.OrchestratorLoopTimeMs;
            summary.AverageCpuUsagePercent = snapshot.TotalCpuUsagePercent;

            // Gerar recomendações
            if (summary.CriticalAnomalies > 0)
            {
                summary.Recommendations.Add("Corrigir anomalias críticas imediatamente");
            }
            if (snapshot.OrchestratorLoopTimeMs > 10)
            {
                summary.Recommendations.Add("Otimizar loop do orquestrador");
            }
            if (snapshot.TotalCpuUsagePercent > 10)
            {
                summary.Recommendations.Add("Reduzir overhead geral do Voltris");
            }

            return summary;
        }

        private IModuleProfiler GetOrCreateModuleProfiler(string moduleName)
        {
            lock (_lock)
            {
                if (!_moduleProfilers.TryGetValue(moduleName, out var profiler))
                {
                    profiler = new ModuleProfiler(moduleName);
                    _moduleProfilers[moduleName] = profiler;
                }
                return profiler;
            }
        }

        public void Dispose()
        {
            StopAsync().Wait(5000);
            _cpuCounter?.Dispose();
            _memoryCounter?.Dispose();
        }
    }
}


