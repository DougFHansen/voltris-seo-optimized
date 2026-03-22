using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Serviço de histórico de otimizações
    /// </summary>
    public class HistoryService
    {
        private readonly ILoggingService _logger;
        private readonly string _historyPath;
        private List<OptimizationHistory> _history = new List<OptimizationHistory>();
        
        // Singleton instance
        private static HistoryService? _instance;
        public static HistoryService Instance => _instance ??= new HistoryService(App.LoggingService!);

        public HistoryService(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _historyPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "history.json");
            LoadHistory();
        }

        public void AddHistoryEntry(OptimizationHistory entry)
        {
            _history.Insert(0, entry); // Adicionar no início
            
            // Manter apenas os últimos 1000 registros
            if (_history.Count > 1000)
            {
                _history = _history.Take(1000).ToList();
            }
            
            SaveHistory();
        }

        public List<OptimizationHistory> GetHistory(int? limit = null)
        {
            return limit.HasValue ? _history.Take(limit.Value).ToList() : _history.ToList();
        }

        public OptimizationStats GetStats()
        {
            var last30Days = _history.Where(h => h.Timestamp >= DateTime.Now.AddDays(-30)).ToList();
            
            return new OptimizationStats
            {
                TotalOptimizations = _history.Count,
                Last30DaysCount = last30Days.Count,
                TotalSpaceFreed = _history.Sum(h => h.SpaceFreed),
                Last30DaysSpaceFreed = last30Days.Sum(h => h.SpaceFreed),
                AverageTime = _history.Any() ? _history.Average(h => h.Duration.TotalSeconds) : 0,
                MostUsedAction = _history
                    .GroupBy(h => h.ActionType)
                    .OrderByDescending(g => g.Count())
                    .FirstOrDefault()?.Key ?? "Nenhuma"
            };
        }

        public void ClearHistory()
        {
            _history.Clear();
            SaveHistory();
            _logger.LogInfo("Histórico de otimizações limpo");
        }
        
        /// <summary>
        /// Registra uma otimização genérica no histórico
        /// </summary>
        public void RecordOptimization(DateTime timestamp)
        {
            var entry = new OptimizationHistory
            {
                ActionType = "System Optimization",
                Description = "Otimização geral do sistema",
                Timestamp = timestamp,
                Success = true
            };
            
            AddHistoryEntry(entry);
        }
        
        /// <summary>
        /// Obtém o timestamp da última otimização realizada
        /// </summary>
        public DateTime? GetLastOptimizationTimestamp()
        {
            var lastOptimization = _history
                .Where(h => h.ActionType == "System Optimization" || h.ActionType == "Ultra Clean")
                .OrderByDescending(h => h.Timestamp)
                .FirstOrDefault();
                
            return lastOptimization?.Timestamp;
        }

        private void LoadHistory()
        {
            try
            {
                if (File.Exists(_historyPath))
                {
                    var json = File.ReadAllText(_historyPath);
                    _history = JsonSerializer.Deserialize<List<OptimizationHistory>>(json) ?? new List<OptimizationHistory>();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Erro ao carregar histórico", ex);
                _history = new List<OptimizationHistory>();
            }
        }

        private readonly object _fileLock = new object();

        private void SaveHistory()
        {
            lock (_fileLock)
            {
                int maxRetries = 3;
                int currentRetry = 0;
                
                while (currentRetry < maxRetries)
                {
                    try
                    {
                        var json = JsonSerializer.Serialize(_history, new JsonSerializerOptions { WriteIndented = true });
                        File.WriteAllText(_historyPath, json);
                        return; // Sucesso
                    }
                    catch (IOException)
                    {
                        currentRetry++;
                        if (currentRetry >= maxRetries)
                        {
                            // Se falhar após todas as tentativas, registrar o erro
                            _logger.LogError($"Erro ao salvar histórico após {maxRetries} tentativas. O arquivo pode estar bloqueado por outro processo.");
                        }
                        else
                        {
                            // Esperar um pouco antes de tentar novamente
                            System.Threading.Thread.Sleep(100);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError("Erro ao salvar histórico", ex);
                        break; // Outros erros não adianta tentar de novo
                    }
                }
            }
        }
    }

    public class OptimizationHistory
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string ActionType { get; set; } = "";
        public string Description { get; set; } = "";
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public TimeSpan Duration { get; set; }
        public long SpaceFreed { get; set; }
        public bool Success { get; set; }
        public Dictionary<string, object> Details { get; set; } = new Dictionary<string, object>();
    }

    public class OptimizationStats
    {
        public int TotalOptimizations { get; set; }
        public int Last30DaysCount { get; set; }
        public long TotalSpaceFreed { get; set; }
        public long Last30DaysSpaceFreed { get; set; }
        public double AverageTime { get; set; }
        public string MostUsedAction { get; set; } = "";
    }
}

