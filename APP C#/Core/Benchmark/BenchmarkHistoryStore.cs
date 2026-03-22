using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using VoltrisOptimizer;

namespace VoltrisOptimizer.Core.Benchmark
{
    /// <summary>
    /// Armazena e recupera histórico de benchmarks em AppData.
    /// </summary>
    public sealed class BenchmarkHistoryStore
    {
        private static readonly string HistoryPath = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "VoltrisOptimizer", "BenchmarkHistory.json");

        private static readonly JsonSerializerOptions JsonOpts = new()
        {
            WriteIndented = true
        };

        public async Task SaveResultAsync(BenchmarkFullResult result)
        {
            var history = await LoadHistoryAsync();
            history.Add(result);

            // Manter últimos 50 resultados
            if (history.Count > 50)
                history.RemoveRange(0, history.Count - 50);

            var dir = Path.GetDirectoryName(HistoryPath);
            if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
                Directory.CreateDirectory(dir);

            var json = JsonSerializer.Serialize(history, JsonOpts);
            await File.WriteAllTextAsync(HistoryPath, json);
            App.LoggingService?.LogInfo($"[BenchmarkHistory] Resultado salvo — Total no histórico: {history.Count}");
        }

        public async Task<List<BenchmarkFullResult>> LoadHistoryAsync()
        {
            if (!File.Exists(HistoryPath))
            {
                App.LoggingService?.LogInfo("[BenchmarkHistory] Arquivo de histórico não encontrado, retornando lista vazia.");
                return new List<BenchmarkFullResult>();
            }

            try
            {
                var json = await File.ReadAllTextAsync(HistoryPath);
                var list = JsonSerializer.Deserialize<List<BenchmarkFullResult>>(json) ?? new List<BenchmarkFullResult>();
                App.LoggingService?.LogInfo($"[BenchmarkHistory] Histórico carregado — {list.Count} registros.");
                return list;
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogWarning($"[BenchmarkHistory] Erro ao carregar histórico: {ex.Message}");
                return new List<BenchmarkFullResult>();
            }
        }
    }
}
