using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer;

namespace VoltrisOptimizer.Core.Benchmark
{
    /// <summary>
    /// Testes de benchmark de CPU com cálculo intensivo multithread
    /// e detecção de throttling.
    /// </summary>
    public sealed class BenchmarkCpuTests
    {
        private PerformanceCounter? _processorPerformance;

        /// <summary>
        /// Executa benchmark de CPU com cálculo intensivo multithread.
        /// Retorna score normalizado (maior = melhor).
        /// </summary>
        public async Task<double> RunCpuBenchmarkAsync(IProgress<string>? progress = null, CancellationToken ct = default)
        {
            progress?.Report("CPU: Iniciando teste de cálculo intensivo...");
            App.LoggingService?.LogInfo("[BenchmarkCPU] Iniciando teste de cálculo intensivo multithread...");

            return await Task.Run(() =>
            {
                var sw = Stopwatch.StartNew();

                Parallel.For(0, 100_000_000, new ParallelOptions { CancellationToken = ct }, i =>
                {
                    double x = Math.Sqrt(i);
                    _ = Math.Sin(x) * Math.Cos(x);
                });

                sw.Stop();
                var score = 100_000.0 / sw.Elapsed.TotalMilliseconds;
                App.LoggingService?.LogInfo($"[BenchmarkCPU] Teste concluído em {sw.Elapsed.TotalSeconds:F2}s — Score: {score:F2}");
                return score;
            }, ct);
        }

        /// <summary>
        /// Detecta throttling de CPU monitorando frequência durante carga.
        /// Retorna true se throttling foi detectado.
        /// </summary>
        public async Task<(bool IsThrottling, double MinFreqPercent, double MaxFreqPercent)> DetectThrottlingAsync(
            IProgress<string>? progress = null, CancellationToken ct = default)
        {
            progress?.Report("CPU: Verificando throttling...");

            return await Task.Run(async () =>
            {
                double minFreq = 100, maxFreq = 0;

                try
                {
                    _processorPerformance ??= new PerformanceCounter(
                        "Processor Information", "% Processor Performance", "_Total");
                    _processorPerformance.NextValue(); // Prime

                    // Monitor durante 5 segundos sob carga
                    var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
                    var loadTask = Task.Run(() =>
                    {
                        Parallel.For(0, int.MaxValue, new ParallelOptions { CancellationToken = cts.Token }, i =>
                        {
                            double x = Math.Sqrt(i);
                            _ = Math.Sin(x);
                        });
                    }, cts.Token);

                    for (int i = 0; i < 10; i++)
                    {
                        await Task.Delay(500, ct);
                        var freq = _processorPerformance.NextValue();
                        if (freq > 0)
                        {
                            minFreq = Math.Min(minFreq, freq);
                            maxFreq = Math.Max(maxFreq, freq);
                        }
                    }

                    cts.Cancel();
                    try { await loadTask; } catch (OperationCanceledException) { }
                }
                catch
                {
                    App.LoggingService?.LogWarning("[BenchmarkCPU] Falha ao acessar PerformanceCounter para detecção de throttling.");
                    return (false, 0, 100);
                }

                // Throttling se a frequência caiu mais de 15% durante o teste
                bool isThrottling = maxFreq > 0 && (maxFreq - minFreq) / maxFreq > 0.15;
                return (isThrottling, minFreq, maxFreq);
            }, ct);
        }
    }
}
