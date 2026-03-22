using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer;

namespace VoltrisOptimizer.Core.Benchmark
{
    /// <summary>
    /// Testes de benchmark de memória com acesso sequencial e aleatório.
    /// </summary>
    public sealed class BenchmarkMemoryTests
    {
        /// <summary>
        /// Executa benchmark de memória com acesso sequencial a buffer grande.
        /// Retorna score normalizado (maior = melhor).
        /// </summary>
        public async Task<double> RunMemoryBenchmarkAsync(IProgress<string>? progress = null, CancellationToken ct = default)
        {
            progress?.Report("Memória: Iniciando teste de acesso sequencial...");
            App.LoggingService?.LogInfo("[BenchmarkMemory] Iniciando teste de acesso sequencial (512MB)...");

            return await Task.Run(() =>
            {
                byte[] buffer = new byte[512 * 1024 * 1024]; // 512 MB

                var sw = Stopwatch.StartNew();

                for (int i = 0; i < buffer.Length; i += 4096)
                {
                    ct.ThrowIfCancellationRequested();
                    buffer[i]++;
                }

                sw.Stop();
                var score = 5000.0 / sw.Elapsed.TotalMilliseconds;
                App.LoggingService?.LogInfo($"[BenchmarkMemory] Teste sequencial concluído em {sw.Elapsed.TotalSeconds:F2}s — Score: {score:F2}");
                return score;
            }, ct);
        }

        /// <summary>
        /// Executa benchmark de latência de memória com acesso aleatório.
        /// </summary>
        public async Task<double> RunMemoryLatencyBenchmarkAsync(IProgress<string>? progress = null, CancellationToken ct = default)
        {
            progress?.Report("Memória: Teste de latência aleatória...");

            return await Task.Run(() =>
            {
                const int size = 64 * 1024 * 1024; // 64 MB
                byte[] buffer = new byte[size];
                var rng = new Random(42);
                int iterations = 1_000_000;

                var sw = Stopwatch.StartNew();

                for (int i = 0; i < iterations; i++)
                {
                    ct.ThrowIfCancellationRequested();
                    int idx = rng.Next(0, size);
                    buffer[idx]++;
                }

                sw.Stop();
                return 2000.0 / sw.Elapsed.TotalMilliseconds;
            }, ct);
        }
    }
}
