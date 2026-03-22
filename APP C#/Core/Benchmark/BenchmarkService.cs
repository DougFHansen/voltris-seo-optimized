using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using VoltrisOptimizer;

namespace VoltrisOptimizer.Core.Benchmark
{
    /// <summary>
    /// Serviço orquestrador que executa todos os testes de benchmark
    /// e calcula o score global do sistema.
    /// </summary>
    public sealed class BenchmarkService
    {
        private readonly BenchmarkCpuTests _cpuTests = new();
        private readonly BenchmarkMemoryTests _memoryTests = new();
        private readonly BenchmarkDiskTests _diskTests = new();
        private readonly BenchmarkSchedulerTests _schedulerTests = new();
        private readonly BenchmarkScoreCalculator _scoreCalculator = new();
        private readonly BenchmarkHistoryStore _historyStore = new();

        public BenchmarkHistoryStore HistoryStore => _historyStore;

        /// <summary>
        /// Executa benchmark completo do sistema.
        /// </summary>
        public async Task<BenchmarkFullResult> RunFullBenchmarkAsync(
            string label,
            IProgress<(string Message, double Percent)>? progress = null,
            CancellationToken ct = default)
        {
            var result = new BenchmarkFullResult { Label = label };
            var msgProgress = new Progress<string>(msg =>
                progress?.Report((msg, 0)));

            App.LoggingService?.LogInfo($"[BenchmarkService] RunFullBenchmarkAsync iniciado — Label: {label}");
            var totalSw = System.Diagnostics.Stopwatch.StartNew();

            // 1. CPU Benchmark (0-25%)
            progress?.Report(("Executando benchmark de CPU...", 5));
            result.CpuScore = await _cpuTests.RunCpuBenchmarkAsync(msgProgress, ct);
            App.LoggingService?.LogInfo($"[BenchmarkService] CPU Score: {result.CpuScore:F2}");
            progress?.Report(($"CPU Score: {result.CpuScore:F2}", 20));

            // 2. CPU Throttling Detection (25-30%)
            progress?.Report(("Detectando throttling de CPU...", 25));
            var (throttling, minFreq, maxFreq) = await _cpuTests.DetectThrottlingAsync(msgProgress, ct);
            result.ThrottlingDetected = throttling;
            result.MinCpuFreqPercent = minFreq;
            result.MaxCpuFreqPercent = maxFreq;
            App.LoggingService?.LogInfo($"[BenchmarkService] Throttling: {(throttling ? "SIM" : "NÃO")} (Min: {minFreq:F0}%, Max: {maxFreq:F0}%)");
            progress?.Report(($"Throttling: {(throttling ? "Detectado" : "Não detectado")}", 30));

            // 3. Memory Benchmark (30-50%)
            progress?.Report(("Executando benchmark de memória...", 35));
            result.MemoryScore = await _memoryTests.RunMemoryBenchmarkAsync(msgProgress, ct);
            App.LoggingService?.LogInfo($"[BenchmarkService] Memory Score: {result.MemoryScore:F2}");
            progress?.Report(($"Memory Score: {result.MemoryScore:F2}", 50));

            // 4. Disk Benchmark (50-70%)
            progress?.Report(("Executando benchmark de disco...", 55));
            result.DiskScore = await _diskTests.RunDiskBenchmarkAsync(msgProgress, ct);
            App.LoggingService?.LogInfo($"[BenchmarkService] Disk Score: {result.DiskScore:F2}");
            progress?.Report(($"Disk Score: {result.DiskScore:F2}", 70));

            // 5. Scheduler Latency (70-85%)
            progress?.Report(("Medindo latência do scheduler...", 75));
            var (schedScore, schedLatency) = await _schedulerTests.RunSchedulerBenchmarkAsync(msgProgress, ct);
            result.SchedulerScore = schedScore;
            result.SchedulerLatencyUs = schedLatency;
            App.LoggingService?.LogInfo($"[BenchmarkService] Scheduler Score: {schedScore:F2} (Latência: {schedLatency:F1}µs)");
            progress?.Report(($"Scheduler Latency: {schedLatency:F1}µs", 85));

            // 6. UI Latency (85-95%)
            progress?.Report(("Medindo latência da UI...", 88));
            result.UiScore = await MeasureUiLatencyAsync(ct);
            result.UiLatencyMs = result.UiScore > 0 ? 1000.0 / result.UiScore : 0;
            App.LoggingService?.LogInfo($"[BenchmarkService] UI Score: {result.UiScore:F2} (Latência: {result.UiLatencyMs:F1}ms)");
            progress?.Report(($"UI Score: {result.UiScore:F2}", 95));

            // 7. Calculate Overall Score
            result.OverallScore = _scoreCalculator.Calculate(
                result.CpuScore, result.MemoryScore, result.DiskScore,
                result.SchedulerScore, result.UiScore);
            result.Timestamp = DateTime.Now;

            // 8. Save to history
            try
            {
                await _historyStore.SaveResultAsync(result);
                App.LoggingService?.LogInfo("[BenchmarkService] Resultado salvo no histórico.");
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogWarning($"[BenchmarkService] Falha ao salvar histórico: {ex.Message}");
            }

            totalSw.Stop();
            App.LoggingService?.LogInfo($"[BenchmarkService] Benchmark '{label}' concluído em {totalSw.Elapsed.TotalSeconds:F1}s — Score Global: {result.OverallScore:F2}");

            progress?.Report(($"Benchmark concluído! Score Global: {result.OverallScore:F2}", 100));
            return result;
        }

        private async Task<double> MeasureUiLatencyAsync(CancellationToken ct)
        {
            try
            {
                var sw = Stopwatch.StartNew();
                await Application.Current.Dispatcher.InvokeAsync(() => { });
                sw.Stop();
                return sw.Elapsed.TotalMilliseconds > 0 ? 1000.0 / sw.Elapsed.TotalMilliseconds : 100;
            }
            catch
            {
                return 50; // Fallback score
            }
        }
    }
}
