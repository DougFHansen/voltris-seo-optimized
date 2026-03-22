using System;
using System.Diagnostics;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer;

namespace VoltrisOptimizer.Core.Benchmark
{
    /// <summary>
    /// Testes de benchmark de disco NVMe/SSD com leitura e escrita real.
    /// </summary>
    public sealed class BenchmarkDiskTests
    {
        /// <summary>
        /// Executa benchmark de disco com escrita sequencial, leitura sequencial e leitura aleatória.
        /// Retorna score normalizado (maior = melhor).
        /// </summary>
        public async Task<double> RunDiskBenchmarkAsync(IProgress<string>? progress = null, CancellationToken ct = default)
        {
            progress?.Report("Disco: Iniciando teste de I/O sequencial...");
            App.LoggingService?.LogInfo("[BenchmarkDisk] Iniciando teste de I/O sequencial (256MB)...");

            return await Task.Run(() =>
            {
                string path = Path.Combine(Path.GetTempPath(), $"voltris_bench_{Guid.NewGuid():N}.tmp");

                try
                {
                    byte[] data = new byte[256 * 1024 * 1024]; // 256 MB
                    new Random(42).NextBytes(data);

                    var sw = Stopwatch.StartNew();

                    // Escrita sequencial
                    File.WriteAllBytes(path, data);

                    // Leitura sequencial
                    _ = File.ReadAllBytes(path);

                    sw.Stop();
                    var score = 3000.0 / sw.Elapsed.TotalMilliseconds;
                    App.LoggingService?.LogInfo($"[BenchmarkDisk] Teste sequencial concluído em {sw.Elapsed.TotalSeconds:F2}s — Score: {score:F2}");
                    return score;
                }
                catch (Exception ex)
                {
                    App.LoggingService?.LogError($"[BenchmarkDisk] Erro no teste de disco: {ex.Message}", ex);
                    throw;
                }
                finally
                {
                    try { if (File.Exists(path)) File.Delete(path); } catch { }
                }
            }, ct);
        }

        /// <summary>
        /// Executa benchmark de leitura aleatória em blocos de 4KB.
        /// </summary>
        public async Task<double> RunRandomReadBenchmarkAsync(IProgress<string>? progress = null, CancellationToken ct = default)
        {
            progress?.Report("Disco: Teste de leitura aleatória 4K...");

            return await Task.Run(() =>
            {
                string path = Path.Combine(Path.GetTempPath(), $"voltris_bench_rnd_{Guid.NewGuid():N}.tmp");

                try
                {
                    // Criar arquivo de 64MB
                    byte[] data = new byte[64 * 1024 * 1024];
                    new Random(42).NextBytes(data);
                    File.WriteAllBytes(path, data);

                    var rng = new Random(42);
                    byte[] readBuf = new byte[4096];
                    int iterations = 10_000;

                    var sw = Stopwatch.StartNew();

                    using var fs = new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.None, 4096, FileOptions.RandomAccess);
                    for (int i = 0; i < iterations; i++)
                    {
                        ct.ThrowIfCancellationRequested();
                        long pos = rng.NextInt64(0, data.Length - 4096);
                        fs.Seek(pos, SeekOrigin.Begin);
                        fs.Read(readBuf, 0, readBuf.Length);
                    }

                    sw.Stop();
                    return 1500.0 / sw.Elapsed.TotalMilliseconds;
                }
                finally
                {
                    try { if (File.Exists(path)) File.Delete(path); } catch { }
                }
            }, ct);
        }
    }
}
