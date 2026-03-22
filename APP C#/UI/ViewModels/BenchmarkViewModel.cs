using System;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Input;
using System.Collections.ObjectModel;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Services.Performance;
using VoltrisOptimizer.Services.Performance.Benchmark;
using VoltrisOptimizer.Services.Performance.Benchmark.Models;
using VoltrisOptimizer.Services.Performance.Orchestration;

namespace VoltrisOptimizer.UI.ViewModels
{
    public class BenchmarkViewModel : ViewModelBase
    {
        private readonly BenchmarkEngine _benchmarkEngine;
        private readonly BenchmarkMetricCollector _metricCollector;
        private readonly BenchmarkStatisticalAnalyzer _analyzer;
        private readonly BenchmarkPersistenceService _persistence;
        private readonly IPerformanceOrchestrator _orchestrator;
        private readonly IPerformanceOptimizationService _performanceService;
        private readonly ILoggingService _logger;

        private bool _isRunning;
        private string _statusMessage;
        private double _progress;
        private BenchmarkResult? _lastResult;
        private bool _hasPendingPostReboot;

        // Commands
        public ICommand RunStandardBenchmarkCommand { get; }
        public ICommand ResumeBenchmarkCommand { get; }
        
        // Results Display
        private string _resultVerdict = "";
        private string _resultGain = "";
        private string _resultConfidence = "";
        private string _resultCpuIdleDelta = "";
        private string _resultRamDelta = "";
        private string _resultDiskDelta = "";
        private string _resultUxDelta = "";

        public string ResultVerdict
        {
            get => _resultVerdict;
            private set { SetProperty(ref _resultVerdict, value); }
        }
        public string ResultGain
        {
            get => _resultGain;
            private set { SetProperty(ref _resultGain, value); }
        }
        public string ResultConfidence
        {
            get => _resultConfidence;
            private set { SetProperty(ref _resultConfidence, value); }
        }
        public string ResultCpuIdleDelta
        {
            get => _resultCpuIdleDelta;
            private set { SetProperty(ref _resultCpuIdleDelta, value); }
        }
        public string ResultRamDelta
        {
            get => _resultRamDelta;
            private set { SetProperty(ref _resultRamDelta, value); }
        }
        public string ResultDiskDelta
        {
            get => _resultDiskDelta;
            private set { SetProperty(ref _resultDiskDelta, value); }
        }
        public string ResultUxDelta
        {
            get => _resultUxDelta;
            private set { SetProperty(ref _resultUxDelta, value); }
        }

        public bool IsRunning
        {
            get => _isRunning;
            set { SetProperty(ref _isRunning, value); }
        }

        public string StatusMessage
        {
            get => _statusMessage;
            set { SetProperty(ref _statusMessage, value); }
        }

        public double Progress
        {
            get => _progress;
            set { SetProperty(ref _progress, value); }
        }
        
        private bool _hasResult;
        public bool HasResult
        {
            get => _hasResult;
            private set { SetProperty(ref _hasResult, value); }
        }

        public bool HasPendingPostReboot
        {
            get => _hasPendingPostReboot;
            set { SetProperty(ref _hasPendingPostReboot, value); }
        }

        public BenchmarkViewModel(
            BenchmarkEngine benchmarkEngine,
            BenchmarkMetricCollector metricCollector,
            BenchmarkStatisticalAnalyzer analyzer,
            BenchmarkPersistenceService persistence,
            IPerformanceOrchestrator orchestrator,
            IPerformanceOptimizationService performanceService,
            ILoggingService logger)
        {
            _benchmarkEngine = benchmarkEngine ?? throw new ArgumentNullException(nameof(benchmarkEngine));
            _metricCollector = metricCollector ?? throw new ArgumentNullException(nameof(metricCollector));
            _analyzer = analyzer ?? throw new ArgumentNullException(nameof(analyzer));
            _persistence = persistence ?? throw new ArgumentNullException(nameof(persistence));
            _orchestrator = orchestrator ?? throw new ArgumentNullException(nameof(orchestrator));
            _performanceService = performanceService ?? throw new ArgumentNullException(nameof(performanceService));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));

            _statusMessage = "Pronto para iniciar benchmark científico.";
            
            RunStandardBenchmarkCommand = new AsyncRelayCommand(RunStandardBenchmarkAsync, () => !IsRunning);
            ResumeBenchmarkCommand = new AsyncRelayCommand(ResumeBenchmarkAsync, () => !IsRunning && HasPendingPostReboot);

            CheckForPendingBenchmark();
        }

        private async void CheckForPendingBenchmark()
        {
            var pending = await _persistence.LoadPendingBenchmarkAsync();
            HasPendingPostReboot = pending != null;
            if (HasPendingPostReboot)
            {
                StatusMessage = "Detectada validação pendente pós-reinício!";
            }
        }

        private async Task RunStandardBenchmarkAsync()
        {
            if (IsRunning) return;

            IsRunning = true;
            Progress = 0;
            _lastResult = null;
            HasResult = false;
            
            try
            {
                StatusMessage = "Iniciando validação científica...";
                
                Func<Task> optimizationAction = async () =>
                {
                    await System.Windows.Application.Current.Dispatcher.InvokeAsync(() =>
                    {
                        StatusMessage = "Aplicando otimizações recomendadas...";
                    });
                    await _performanceService.ApplyRecommendedOptimizationsAsync();
                };

                var result = await _benchmarkEngine.RunBenchmarkAsync(
                    "Otimização Completa do Sistema",
                    optimizationAction,
                    TimeSpan.FromSeconds(30),
                    (stage, pct) => 
                    {
                        System.Windows.Application.Current?.Dispatcher.InvokeAsync(() =>
                        {
                            StatusMessage = stage;
                            Progress = pct;
                        });
                    }
                );

                if (result.Verdict == BenchmarkVerdict.AwaitingReboot)
                {
                    await _persistence.SavePendingBenchmarkAsync(result.OptimizationApplied, result.Before);
                    HasPendingPostReboot = true;
                    StatusMessage = "Otimizações aplicadas. Reinicie o PC para completar a validação.";
                    
                    // Trigger Restart Manager prompt
                    _ = RestartManagerService.Instance.CheckAndPromptRestartAsync("Otimizações de Performance");
                }
                else
                {
                    _lastResult = result;
                    await System.Windows.Application.Current.Dispatcher.InvokeAsync(() =>
                    {
                        DisplayResults(result);
                        HasResult = true;
                    });
                    StatusMessage = "Validação concluída com sucesso!";
                }
            }
            catch (Exception ex)
            {
                StatusMessage = $"Erro no benchmark: {ex.Message}";
                _logger.LogError("Benchmark Error", ex);
                HasResult = false;
            }
            finally
            {
                IsRunning = false;
            }
        }

        private async Task ResumeBenchmarkAsync()
        {
            if (IsRunning) return;

            var pending = await _persistence.LoadPendingBenchmarkAsync();
            if (pending == null) 
            {
                HasPendingPostReboot = false;
                return;
            }

            IsRunning = true;
            Progress = 0;
            
            try
            {
                var sw = System.Diagnostics.Stopwatch.StartNew();
                StatusMessage = "Capturando métricas pós-reinício...";
                Progress = 20;

                // Stabilize briefly after reboot
                await Task.Delay(5000); 
                
                var afterContext = await _metricCollector.CaptureSnapshotAsync();
                Progress = 80;

                StatusMessage = "Analisando resultados estatísticos...";
                var (delta, confidence, verdict) = _analyzer.Analyze(pending.BeforeContext, afterContext);
                
                sw.Stop();
                _lastResult = new BenchmarkResult(
                    pending.OptimizationName,
                    pending.BeforeContext,
                    afterContext,
                    delta,
                    confidence,
                    verdict,
                    TimeSpan.Zero,
                    sw.Elapsed
                );

                await System.Windows.Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    DisplayResults(_lastResult);
                    HasResult = true;
                });
                
                _persistence.ClearPendingBenchmark();
                HasPendingPostReboot = false;
                StatusMessage = "Validação pós-reinício concluída!";
            }
            catch (Exception ex)
            {
                StatusMessage = $"Erro ao retomar benchmark: {ex.Message}";
                _logger.LogError("Resume Benchmark Error", ex);
            }
            finally
            {
                IsRunning = false;
            }
        }

        private void DisplayResults(BenchmarkResult result)
        {
            ResultVerdict = result.Verdict.ToString();
            ResultGain = $"{result.Delta.OverallGainPercent:F2}%";
            ResultConfidence = result.Confidence.ToString();
            
            ResultCpuIdleDelta = FormatDelta(result.Delta.CpuIdleImprovement);
            ResultRamDelta = $"{result.After.Memory.AvailableMB - result.Before.Memory.AvailableMB:+#;-#;0} MB";
            ResultDiskDelta = FormatDelta(result.Delta.DiskLatencyReduction, inverse: true);
            ResultUxDelta = FormatDelta(result.Delta.ResponsivenessGain);
        }

        private string FormatDelta(double value, bool inverse = false)
        {
            if (inverse) value = -value;
            return $"{value:+#.00;-#.00;0.00}%";
        }
    }
}
