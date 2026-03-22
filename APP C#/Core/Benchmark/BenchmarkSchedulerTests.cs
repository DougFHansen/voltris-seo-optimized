using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer;

namespace VoltrisOptimizer.Core.Benchmark
{
    /// <summary>
    /// Testes de latência do scheduler do Windows.
    /// Mede latência de troca de contexto entre threads.
    /// </summary>
    public sealed class BenchmarkSchedulerTests
    {
        /// <summary>
        /// Mede a latência média de wake de threads.
        /// Retorna score normalizado (maior = melhor, menor latência).
        /// </summary>
        public async Task<(double Score, double AvgLatencyUs)> RunSchedulerBenchmarkAsync(
            IProgress<string>? progress = null, CancellationToken ct = default)
        {
            progress?.Report("Scheduler: Medindo latência de troca de contexto...");
            App.LoggingService?.LogInfo("[BenchmarkScheduler] Iniciando teste de latência de troca de contexto (500 iterações)...");

            return await Task.Run(async () =>
            {
                var latencies = new List<double>();
                int iterations = 500;

                for (int i = 0; i < iterations; i++)
                {
                    ct.ThrowIfCancellationRequested();

                    var signal = new ManualResetEventSlim(false);
                    var sw = Stopwatch.StartNew();

                    _ = Task.Run(() =>
                    {
                        signal.Set();
                    }, ct);

                    signal.Wait(ct);
                    sw.Stop();

                    latencies.Add(sw.Elapsed.TotalMicroseconds);
                    signal.Dispose();
                }

                // Remover outliers (top/bottom 10%)
                var sorted = latencies.OrderBy(x => x).ToList();
                int trim = sorted.Count / 10;
                var trimmed = sorted.Skip(trim).Take(sorted.Count - 2 * trim).ToList();

                double avgLatencyUs = trimmed.Count > 0 ? trimmed.Average() : latencies.Average();

                // Score: menor latência = maior score
                double score = avgLatencyUs > 0 ? 1000.0 / avgLatencyUs : 100;
                score = Math.Min(100, score);

                App.LoggingService?.LogInfo($"[BenchmarkScheduler] Teste concluído — Latência média: {avgLatencyUs:F1}µs, Score: {score:F2}");

                return (score, avgLatencyUs);
            }, ct);
        }
    }
}
