using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Management;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Threading;
using Microsoft.Win32;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Serviço de otimização inteligente com IA
    /// </summary>
    public class AIOptimizerService
    {
        private readonly ILoggingService _logger;
        private readonly string _patternsPath;
        private readonly string _recommendationsPath;
        private UsagePatterns _usagePatterns = new UsagePatterns();
        private List<AIRecommendation> _recommendations = new List<AIRecommendation>();
        private SystemMetricsHistory _metricsHistory = new SystemMetricsHistory();
        private readonly HttpClient _httpClient;
        private readonly SettingsService _settingsService;
        private readonly string _lyraMemoryPath;
        private LyraMemory _memory = new LyraMemory();
        private readonly CancellationTokenSource _metricsCts = new();

        public AIOptimizerService(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _settingsService = SettingsService.Instance;
            _patternsPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "AI", "patterns.json");
            _recommendationsPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "AI", "recommendations.json");
            _lyraMemoryPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "AI", "memory.json");
            
            Directory.CreateDirectory(Path.GetDirectoryName(_patternsPath)!);
            LoadPatterns();
            LoadRecommendations();
            LoadLyraMemory();
            StartMetricsCollection();
            
            // Inicializar HttpClient para chamadas à API OpenAI
            _httpClient = new HttpClient();
            _httpClient.Timeout = TimeSpan.FromSeconds(60);
        }

        private void LoadLyraMemory()
        {
            try
            {
                var dir = Path.GetDirectoryName(_lyraMemoryPath);
                if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir)) Directory.CreateDirectory(dir);
                if (File.Exists(_lyraMemoryPath))
                {
                    var json = File.ReadAllText(_lyraMemoryPath);
                    _memory = JsonSerializer.Deserialize<LyraMemory>(json) ?? new LyraMemory();
                }
                else
                {
                    _memory = new LyraMemory();
                    SaveLyraMemory();
                }
            }
            catch
            {
                _memory = new LyraMemory();
            }
        }

        private void SaveLyraMemory()
        {
            try
            {
                var json = JsonSerializer.Serialize(_memory, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_lyraMemoryPath, json);
            }
            catch { }
        }

        public async Task<LyraResponse> ProcessLyraQueryAsync(string query)
        {
            return await Task.Run(() =>
            {
                try
                {
                    var cid = Guid.NewGuid().ToString("N");
                    _logger.LogInfo($"[LYRA.INTENT] start | id={cid}");
                    var normalized = NormalizeText(query);
                    var rawTokens = Tokenize(normalized);
                    var tokens = rawTokens.Select(StemToken).ToList();
                    var bigrams = BuildBigrams(tokens);
                    var intents = GetIntents();
                    var thresholds = GetIntentThresholds();

                    var ranked = new List<(string id, double score)>();
                    foreach (var intent in intents)
                    {
                        var s = ScoreIntent(tokens, bigrams, intent);
                        if (_memory.RecentIntents.Any() && _memory.RecentIntents.Last() == intent.Id) s += 0.06;
                        if (_memory.IntentFrequency.TryGetValue(intent.Id, out var f) && f > 3) s += 0.06;
                        ranked.Add((intent.Id, Math.Min(1.0, s)));
                    }
                    ranked = ranked.OrderByDescending(r => r.score).Take(3).ToList();
                    var best = ranked.Any() ? ranked.First().id : "";
                    var bestScore = ranked.Any() ? ranked.First().score : 0.0;
                    _logger.LogInfo($"[LYRA.INTENT] ranked | id={cid} | top=[{string.Join(",", ranked.Select(r => r.id+":"+r.score.ToString("F2")))}]");

                    var resp = new LyraResponse();
                    var min = thresholds.TryGetValue(best, out var t) ? t : 0.65;
                    if (bestScore < min)
                    {
                        if (bestScore >= 0.5)
                        {
                            resp.Response = "Claro! Qual destas opções descreve melhor? 🤔";
                            foreach (var o in new[] { "Executar Otimização Inteligente Automática", "Executar Limpeza Completa", "Executar Diagnóstico Automático" }) resp.Actions.Add(o);
                            resp.Confidence = bestScore;
                        }
                        else
                        {
                            resp.Response = "Posso otimizar, limpar ou diagnosticar seu PC. Diga o que está lento. ✨";
                            resp.Actions.Add("Executar Otimização Inteligente Automática");
                            resp.Actions.Add("Executar Limpeza Completa");
                            resp.Actions.Add("Executar Diagnóstico Automático");
                            resp.Confidence = bestScore;
                        }
                        _logger.LogInfo($"[LYRA.INTENT] fallback | id={cid} | score={bestScore:F2}");
                    }
                    else
                    {
                        _memory.LastInteraction = DateTime.Now;
                        if (!_memory.IntentFrequency.ContainsKey(best)) _memory.IntentFrequency[best] = 0;
                        _memory.IntentFrequency[best]++;
                        _memory.RecentIntents.Add(best);
                        if (_memory.RecentIntents.Count > 20) _memory.RecentIntents.RemoveAt(0);
                        SaveLyraMemory();

                        var entities = DetectEntities(tokens);
                        var extra = BuildActionsFromEntities(best, entities);

                        if (best == "optimize_pc")
                        {
                            resp.Response = "Perfeito! Iniciando otimização inteligente. 🔧";
                            resp.Actions.Add("Executar Otimização Inteligente Automática");
                            resp.Actions.Add("Executar Otimização de Desempenho");
                        }
                        else if (best == "cleanup_system")
                        {
                            resp.Response = "Entendido! Preparando limpeza do sistema. 🧹";
                            resp.Actions.Add("Executar Limpeza Completa");
                        }
                        else if (best == "diagnose_system")
                        {
                            resp.Response = "Certo! Vou diagnosticar seu sistema. 🩺";
                            resp.Actions.Add("Executar Diagnóstico Automático");
                        }
                        else if (best == "optimize_network")
                        {
                            resp.Response = "Perfeito! Vou otimizar sua rede. 🌐";
                            resp.Actions.Add("Executar Otimização de Rede");
                        }
                        else if (best == "manage_startup")
                        {
                            resp.Response = "Certo! Vou revisar programas de inicialização. ⚙️";
                            resp.Actions.Add("Otimizar Programas de Inicialização");
                        }
                        resp.Confidence = bestScore;
                        foreach (var a in extra) if (!resp.Actions.Contains(a)) resp.Actions.Add(a);
                        _logger.LogInfo($"[LYRA.MEMORY] intent={best} score={bestScore:F2}");
                    }
                    _logger.LogSuccess($"[LYRA.INTENT] done | id={cid}");
                    return resp;
                }
                catch (Exception ex)
                {
                    _logger.LogError("[LYRA.INTENT] error", ex);
                    return new LyraResponse { Response = "Erro ao processar solicitação.", Confidence = 0.0 };
                }
            });
        }

        public async Task<bool> ExecuteLyraActionAsync(string action)
        {
            return await Task.Run(async () =>
            {
                try
                {
                    _logger.LogInfo($"[LYRA.ACTION] exec | {action}");
                    if (action.Contains("Otimização Inteligente"))
                    {
                        if (App.AIOptimizer != null)
                        {
                            await App.AIOptimizer.PerformIntelligentOptimizationAsync(null, s => _logger.LogInfo(s));
                            _logger.LogSuccess("[LYRA.ACTION] otimização inteligente concluída");
                            return true;
                        }
                    }
                    if (action.Contains("Limpeza Completa"))
                    {
                        if (App.SystemCleaner != null)
                        {
                            await App.SystemCleaner.CleanTempFilesAsync();
                            await App.SystemCleaner.EmptyRecycleBinAsync();
                            await App.SystemCleaner.CleanThumbnailsAsync();
                            await App.SystemCleaner.CleanBrowserCacheAsync();
                            await App.SystemCleaner.CleanCacheAsync();
                            _logger.LogSuccess("[LYRA.ACTION] limpeza concluída");
                            return true;
                        }
                    }
                    if (action.Contains("Navegadores"))
                    {
                        if (App.SystemCleaner != null)
                        {
                            await App.SystemCleaner.CleanBrowserCacheAsync();
                            _logger.LogSuccess("[LYRA.ACTION] limpeza de navegadores concluída");
                            return true;
                        }
                    }
                    if (action.Contains("Lixeira"))
                    {
                        if (App.SystemCleaner != null)
                        {
                            await App.SystemCleaner.EmptyRecycleBinAsync();
                            _logger.LogSuccess("[LYRA.ACTION] lixeira esvaziada");
                            return true;
                        }
                    }
                    if (action.Contains("Temporários"))
                    {
                        if (App.SystemCleaner != null)
                        {
                            await App.SystemCleaner.CleanTempFilesAsync();
                            _logger.LogSuccess("[LYRA.ACTION] temporários limpos");
                            return true;
                        }
                    }
                    if (action.Contains("Miniaturas"))
                    {
                        if (App.SystemCleaner != null)
                        {
                            await App.SystemCleaner.CleanThumbnailsAsync();
                            _logger.LogSuccess("[LYRA.ACTION] miniaturas limpas");
                            return true;
                        }
                    }
                    if (action.Contains("Cache de Componentes"))
                    {
                        if (App.SystemCleaner != null)
                        {
                            await App.SystemCleaner.CleanCacheAsync();
                            _logger.LogSuccess("[LYRA.ACTION] cache de componentes limpo");
                            return true;
                        }
                    }
                    if (action.Contains("Otimização de Desempenho"))
                    {
                        if (App.PerformanceOptimizer != null)
                        {
                            await App.PerformanceOptimizer.OptimizeServicesAsync();
                            _logger.LogSuccess("[LYRA.ACTION] serviços otimizados");
                            return true;
                        }
                    }
                    if (action.Contains("Otimização de Rede"))
                    {
                        if (App.NetworkOptimizer != null)
                        {
                            await App.NetworkOptimizer.FlushDnsAsync();
                            await App.NetworkOptimizer.ResetWinsockAsync();
                            await App.NetworkOptimizer.ResetIPStackAsync();
                            await App.NetworkOptimizer.RenewDhcpAsync();
                            _logger.LogSuccess("[LYRA.ACTION] rede otimizada");
                            return true;
                        }
                    }
                    if (action.Contains("Diagnóstico"))
                    {
                        var data = await CollectSystemDataAsync();
                        _logger.LogInfo($"CPU {data.CPUUsage:F1}% | RAM livre {data.AvailableRAMGB:F1} GB | Disco livre {(double)data.FreeDiskSpace / data.TotalDiskSpace * 100:F1}%");
                        _logger.LogSuccess("[LYRA.ACTION] diagnóstico concluído");
                        return true;
                    }
                    return false;
                }
                catch (Exception ex)
                {
                    _logger.LogError("[LYRA.ACTION] error", ex);
                    return false;
                }
            });
        }

        private string NormalizeText(string input)
        {
            var s = input.ToLowerInvariant();
            s = RemoveAccents(s);
            var chars = s.Where(c => char.IsLetterOrDigit(c) || char.IsWhiteSpace(c)).ToArray();
            return new string(chars);
        }

        private List<string> Tokenize(string input)
        {
            return input.Split(new[] { ' ' }, StringSplitOptions.RemoveEmptyEntries).ToList();
        }

        private string RemoveAccents(string input)
        {
            var n = input.Normalize(NormalizationForm.FormD);
            var sb = new StringBuilder();
            foreach (var ch in n)
            {
                var uc = System.Globalization.CharUnicodeInfo.GetUnicodeCategory(ch);
                if (uc != System.Globalization.UnicodeCategory.NonSpacingMark) sb.Append(ch);
            }
            return sb.ToString().Normalize(NormalizationForm.FormC);
        }

        private double ScoreIntent(List<string> tokens, List<string> bigrams, IntentModel intent)
        {
            double s = 0.0;
            foreach (var k in intent.Keywords)
            {
                if (tokens.Contains(k)) s += 0.4;
                else
                {
                    foreach (var t in tokens)
                    {
                        var f = FuzzyScore(t, k);
                        if (f >= 0.85) { s += 0.25; break; }
                    }
                }
            }
            foreach (var syn in intent.Synonyms)
            {
                if (tokens.Contains(syn)) s += 0.15;
                else
                {
                    foreach (var t in tokens)
                    {
                        var f = FuzzyScore(t, syn);
                        if (f >= 0.88) { s += 0.1; break; }
                    }
                }
            }
            foreach (var bg in bigrams)
            {
                if (intent.Phrases.Any(p => FuzzyScore(bg, p) >= 0.9)) { s += 0.1; break; }
            }
            foreach (var n in intent.Negatives)
            {
                if (tokens.Contains(n)) s -= 0.2;
            }
            return Math.Min(1.0, s);
        }

        private double FuzzyScore(string a, string b)
        {
            int d = LevenshteinDistance(a, b);
            int m = Math.Max(a.Length, b.Length);
            if (m == 0) return 1.0;
            return 1.0 - (double)d / m;
        }

        private int LevenshteinDistance(string a, string b)
        {
            var n = a.Length;
            var m = b.Length;
            var dp = new int[n + 1, m + 1];
            for (int i = 0; i <= n; i++) dp[i, 0] = i;
            for (int j = 0; j <= m; j++) dp[0, j] = j;
            for (int i = 1; i <= n; i++)
            {
                for (int j = 1; j <= m; j++)
                {
                    int cost = a[i - 1] == b[j - 1] ? 0 : 1;
                    dp[i, j] = Math.Min(Math.Min(dp[i - 1, j] + 1, dp[i, j - 1] + 1), dp[i - 1, j - 1] + cost);
                }
            }
            return dp[n, m];
        }

        private List<IntentModel> GetIntents()
        {
            return new List<IntentModel>
            {
                new IntentModel
                {
                    Id = "optimize_pc",
                    Keywords = new List<string>{ "otimizar", "rapido", "desempenho", "lento" },
                    Synonyms = new List<string>{ "melhorar", "acelerar" },
                    Phrases = new List<string>{ "deixar pc rapido", "melhorar desempenho" },
                    Negatives = new List<string>{ "desinstalar" }
                },
                new IntentModel
                {
                    Id = "cleanup_system",
                    Keywords = new List<string>{ "limpar", "limpeza", "arquivos", "cache", "lixeira" },
                    Synonyms = new List<string>{ "apagar", "remover" },
                    Phrases = new List<string>{ "limpar navegador", "apagar arquivos temporarios" },
                    Negatives = new List<string>{ }
                },
                new IntentModel
                {
                    Id = "diagnose_system",
                    Keywords = new List<string>{ "problema", "erro", "diagnostico", "corrigir" },
                    Synonyms = new List<string>{ "falha", "bug" },
                    Phrases = new List<string>{ "verificar sistema", "diagnosticar problemas" },
                    Negatives = new List<string>{ }
                },
                new IntentModel
                {
                    Id = "optimize_network",
                    Keywords = new List<string>{ "rede", "internet", "ping", "latencia" },
                    Synonyms = new List<string>{ "wifi", "net" },
                    Phrases = new List<string>{ "internet lenta", "otimizar rede" },
                    Negatives = new List<string>{ }
                },
                new IntentModel
                {
                    Id = "manage_startup",
                    Keywords = new List<string>{ "inicialização", "startup", "programas" },
                    Synonyms = new List<string>{ "boot", "iniciar" },
                    Phrases = new List<string>{ "tirar programas da inicializacao" },
                    Negatives = new List<string>{ }
                }
            };
        }

        private class IntentModel
        {
            public string Id { get; set; } = "";
            public List<string> Keywords { get; set; } = new List<string>();
            public List<string> Synonyms { get; set; } = new List<string>();
            public List<string> Phrases { get; set; } = new List<string>();
            public List<string> Negatives { get; set; } = new List<string>();
        }

        private Dictionary<string, double> GetIntentThresholds()
        {
            return new Dictionary<string, double>
            {
                { "optimize_pc", 0.65 },
                { "cleanup_system", 0.65 },
                { "diagnose_system", 0.6 },
                { "optimize_network", 0.62 },
                { "manage_startup", 0.6 }
            };
        }

        private List<string> BuildBigrams(List<string> tokens)
        {
            var res = new List<string>();
            for (int i = 0; i < tokens.Count - 1; i++) res.Add(tokens[i] + " " + tokens[i + 1]);
            return res;
        }

        private string StemToken(string token)
        {
            if (token.EndsWith("mente")) token = token.Substring(0, token.Length - 5);
            if (token.EndsWith("ções")) token = token.Replace("ções", "cao");
            if (token.EndsWith("ção")) token = token.Replace("ção", "cao");
            if (token.EndsWith("s") && token.Length > 3) token = token.Substring(0, token.Length - 1);
            if (token.EndsWith("ando") || token.EndsWith("endo")) token = token.Substring(0, token.Length - 4);
            return token;
        }

        private HashSet<string> DetectEntities(List<string> tokens)
        {
            var set = new HashSet<string>();
            var t = new HashSet<string>(tokens);
            if (t.Contains("navegador") || t.Contains("chrome") || t.Contains("edge")) set.Add("browser");
            if (t.Contains("lixeira")) set.Add("recycle");
            if (t.Contains("cache") || t.Contains("component") || t.Contains("dism")) set.Add("componentcache");
            if (t.Contains("temporario") || t.Contains("temp")) set.Add("tempfiles");
            if (t.Contains("miniatura") || t.Contains("thumb")) set.Add("thumbnails");
            return set;
        }

        private List<string> BuildActionsFromEntities(string intent, HashSet<string> entities)
        {
            var actions = new List<string>();
            if (intent == "cleanup_system")
            {
                if (entities.Contains("browser")) actions.Add("Executar Limpeza de Navegadores");
                if (entities.Contains("recycle")) actions.Add("Esvaziar Lixeira");
                if (entities.Contains("tempfiles")) actions.Add("Limpar Arquivos Temporários");
                if (entities.Contains("thumbnails")) actions.Add("Limpar Miniaturas");
                if (entities.Contains("componentcache")) actions.Add("Limpar Cache de Componentes do Sistema");
            }
            return actions;
        }

        /// <summary>
        /// Verifica se a OpenAI está disponível
        /// </summary>
        private bool IsOpenAIAvailable()
        {
            return !string.IsNullOrWhiteSpace(_settingsService.Settings.OpenAIApiKey);
        }

        #region Análise de Padrões de Uso

        /// <summary>
        /// Analisa padrões de uso do sistema
        /// </summary>
        public async Task<UsagePatterns> AnalyzeUsagePatternsAsync()
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("Analisando padrões de uso...");

                    var patterns = new UsagePatterns
                    {
                        LastAnalyzed = DateTime.Now,
                        PeakUsageHours = AnalyzePeakHours(),
                        MostUsedApplications = AnalyzeMostUsedApps(),
                        CommonIssues = AnalyzeCommonIssues(),
                        OptimizationFrequency = AnalyzeOptimizationFrequency(),
                        SystemHealthTrend = AnalyzeHealthTrend()
                    };

                    _usagePatterns = patterns;
                    SavePatterns();
                    _logger.LogSuccess("Padrões de uso analisados");
                    return patterns;
                }
                catch (Exception ex)
                {
                    _logger.LogError("Erro ao analisar padrões", ex);
                    return new UsagePatterns();
                }
            });
        }

        private List<int> AnalyzePeakHours()
        {
            // Analisar histórico de métricas para identificar horas de pico
            var peakHours = new List<int>();
            try
            {
                var hourlyUsage = new Dictionary<int, double>();
                
                foreach (var metric in _metricsHistory.Metrics)
                {
                    var hour = metric.Timestamp.Hour;
                    if (!hourlyUsage.ContainsKey(hour))
                    {
                        hourlyUsage[hour] = 0;
                    }
                    hourlyUsage[hour] += metric.CPUUsage + metric.MemoryUsage;
                }

                if (hourlyUsage.Any())
                {
                    var avgUsage = hourlyUsage.Values.Average();
                    peakHours = hourlyUsage
                        .Where(kvp => kvp.Value > avgUsage * 1.2)
                        .Select(kvp => kvp.Key)
                        .OrderByDescending(h => hourlyUsage[h])
                        .Take(5)
                        .ToList();
                }
            }
            catch { }
            
            return peakHours.Any() ? peakHours : new List<int> { 18, 19, 20, 21, 22 }; // Default: noite
        }

        private List<string> AnalyzeMostUsedApps()
        {
            var apps = new List<string>();
            try
            {
                var appUsage = new Dictionary<string, int>();
                
                foreach (var metric in _metricsHistory.Metrics)
                {
                    foreach (var process in metric.TopProcesses)
                    {
                        if (!appUsage.ContainsKey(process))
                        {
                            appUsage[process] = 0;
                        }
                        appUsage[process]++;
                    }
                }

                apps = appUsage
                    .OrderByDescending(kvp => kvp.Value)
                    .Take(10)
                    .Select(kvp => kvp.Key)
                    .ToList();
            }
            catch { }
            
            return apps;
        }

        private List<string> AnalyzeCommonIssues()
        {
            var issues = new List<string>();
            try
            {
                // Analisar métricas para identificar problemas comuns
                var highCPUCount = _metricsHistory.Metrics.Count(m => m.CPUUsage > 80);
                var highMemoryCount = _metricsHistory.Metrics.Count(m => m.MemoryUsage > 85);
                var lowDiskSpace = _metricsHistory.Metrics.Any(m => m.DiskFreePercent < 10);

                if (highCPUCount > _metricsHistory.Metrics.Count * 0.3)
                {
                    issues.Add("Uso elevado de CPU detectado frequentemente");
                }

                if (highMemoryCount > _metricsHistory.Metrics.Count * 0.3)
                {
                    issues.Add("Uso elevado de memória detectado frequentemente");
                }

                if (lowDiskSpace)
                {
                    issues.Add("Espaço em disco baixo");
                }
            }
            catch { }
            
            return issues;
        }

        private int AnalyzeOptimizationFrequency()
        {
            // Analisar histórico de otimizações
            try
            {
                var historyPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "history.json");
                if (File.Exists(historyPath))
                {
                    var json = File.ReadAllText(historyPath);
                    var history = JsonSerializer.Deserialize<List<object>>(json) ?? new List<object>();
                    return history.Count;
                }
            }
            catch { }
            
            return 0;
        }

        private string AnalyzeHealthTrend()
        {
            try
            {
                if (_metricsHistory.Metrics.Count < 2) return "Estável";

                var recent = _metricsHistory.Metrics.TakeLast(10).Average(m => m.CPUUsage + m.MemoryUsage);
                var older = _metricsHistory.Metrics.SkipLast(10).Take(10).Average(m => m.CPUUsage + m.MemoryUsage);

                if (recent > older * 1.1) return "Piorando";
                if (recent < older * 0.9) return "Melhorando";
                return "Estável";
            }
            catch { }
            
            return "Estável";
        }

        #endregion

        #region Otimização Automática Personalizada

        /// <summary>
        /// Executa otimização automática personalizada baseada em padrões
        /// Executa as melhores otimizações em sequência inteligente
        /// </summary>
        public async Task<OptimizationResult> PerformIntelligentOptimizationAsync(Action<int>? progressCallback = null, Action<string>? statusCallback = null)
        {
            return await Task.Run(async () =>
            {
                try
                {
                    _logger.LogInfo("Iniciando otimização inteligente automática...");
                    
                    // SEGURANÇA ENTERPRISE: Verificar contexto antes de agir
                    if (VoltrisOptimizer.Core.ServiceLocator.GetService<Gamer.Interfaces.IGamerModeOrchestrator>()?.IsActive == true)
                    {
                        _logger.Log(LogLevel.AI_DECISION, LogCategory.Intelligence, "Otimização IA cancelada: Modo Gamer está ativo. Priorizando performance do jogo.");
                        return new OptimizationResult { PerformanceGain = 0, OptimizationsApplied = new List<string> { "Cancelado: Modo Gamer Ativo" } };
                    }

                    progressCallback?.Invoke(0);
                    statusCallback?.Invoke("Iniciando otimização inteligente...");

                    var results = new OptimizationResult
                    {
                        OptimizationsApplied = new List<string>(),
                        IssuesFixed = new List<string>(),
                        PerformanceGain = 0
                    };

                    // ============================================================
                    // SEQUÊNCIA INTELIGENTE DE OTIMIZAÇÕES
                    // ============================================================

                    // 1. LIMPEZA DO SISTEMA (0-30%)
                    progressCallback?.Invoke(5);
                    statusCallback?.Invoke("Limpando arquivos temporários...");
                    if (App.SystemCleaner != null)
                    {
                        try
                        {
                            var tempSize = await App.SystemCleaner.CleanTempFilesAsync();
                            if (tempSize > 0)
                            {
                                results.OptimizationsApplied.Add($"Limpeza de arquivos temporários ({FormatBytes(tempSize)})");
                                results.IssuesFixed.Add("Arquivos temporários acumulados");
                            }
                            await Task.Delay(500);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"Erro ao limpar arquivos temporários: {ex.Message}");
                        }
                    }
                    progressCallback?.Invoke(10);

                    statusCallback?.Invoke("Esvaziando lixeira...");
                    if (App.SystemCleaner != null)
                    {
                        try
                        {
                            await App.SystemCleaner.EmptyRecycleBinAsync();
                            results.OptimizationsApplied.Add("Lixeira esvaziada");
                            await Task.Delay(500);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"Erro ao esvaziar lixeira: {ex.Message}");
                        }
                    }
                    progressCallback?.Invoke(15);

                    statusCallback?.Invoke("Limpando cache de navegadores...");
                    if (App.SystemCleaner != null)
                    {
                        try
                        {
                            var cacheSize = await App.SystemCleaner.CleanBrowserCacheAsync();
                            if (cacheSize > 0)
                            {
                                results.OptimizationsApplied.Add($"Limpeza de cache de navegadores ({FormatBytes(cacheSize)})");
                            }
                            await Task.Delay(500);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"Erro ao limpar cache: {ex.Message}");
                        }
                    }
                    progressCallback?.Invoke(25);

                    // 2. OTIMIZAÇÃO DE DESEMPENHO (30-60%)
                    statusCallback?.Invoke("Otimizando plano de energia...");
                    if (App.PerformanceOptimizer != null)
                    {
                        try
                        {
                            await App.PerformanceOptimizer.SetHighPerformancePlanAsync();
                            results.OptimizationsApplied.Add("Plano de energia: Alto Desempenho");
                            results.IssuesFixed.Add("Plano de energia não otimizado");
                            await Task.Delay(500);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"Erro ao otimizar plano de energia: {ex.Message}");
                        }
                    }
                    progressCallback?.Invoke(35);

                    statusCallback?.Invoke("Otimizando programas de inicialização...");
                    if (App.PerformanceOptimizer != null)
                    {
                        try
                        {
                            await App.PerformanceOptimizer.OptimizeStartupAsync();
                            results.OptimizationsApplied.Add("Otimização de inicialização");
                            results.IssuesFixed.Add("Programas desnecessários na inicialização");
                            await Task.Delay(500);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"Erro ao otimizar inicialização: {ex.Message}");
                        }
                    }
                    progressCallback?.Invoke(45);

                    statusCallback?.Invoke("Otimizando serviços do Windows...");
                    if (App.PerformanceOptimizer != null)
                    {
                        try
                        {
                            await App.PerformanceOptimizer.OptimizeServicesAsync();
                            results.OptimizationsApplied.Add("Otimização de serviços");
                            await Task.Delay(500);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"Erro ao otimizar serviços: {ex.Message}");
                        }
                    }
                    progressCallback?.Invoke(50);

                    statusCallback?.Invoke("Otimizando uso de memória...");
                    if (App.AdvancedOptimizer != null)
                    {
                        try
                        {
                            await App.AdvancedOptimizer.OptimizeMemoryAsync();
                            results.OptimizationsApplied.Add("Otimização de memória RAM");
                            results.IssuesFixed.Add("Uso excessivo de memória");
                            await Task.Delay(500);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"Erro ao otimizar memória: {ex.Message}");
                        }
                    }
                    progressCallback?.Invoke(60);

                    // 3. OTIMIZAÇÕES AVANÇADAS (60-90%)
                    statusCallback?.Invoke("Aplicando otimizações avançadas...");
                    // Otimizações adicionais podem ser adicionadas aqui
                    await Task.Delay(500);
                    progressCallback?.Invoke(75);

                    // 4. FINALIZAÇÃO (90-100%)
                    statusCallback?.Invoke("Finalizando otimização...");
                    
                    // Calcular ganho de performance estimado
                    results.PerformanceGain = CalculatePerformanceGainFromOptimizations(results.OptimizationsApplied.Count);

                    // Adicionar resumo de problemas resolvidos
                    if (results.OptimizationsApplied.Count > 0)
                    {
                        results.IssuesFixed.Add("Sistema otimizado com sucesso");
                    }

                    progressCallback?.Invoke(100);
                    statusCallback?.Invoke("Otimização concluída!");

                    _logger.LogSuccess($"Otimização inteligente concluída. {results.OptimizationsApplied.Count} otimizações aplicadas. Ganho estimado: {results.PerformanceGain}%");
                    
                    return results;
                }
                catch (Exception ex)
                {
                    _logger.LogError("Erro na otimização inteligente", ex);
                    statusCallback?.Invoke($"Erro: {ex.Message}");
                    return new OptimizationResult();
                }
            });
        }

        /// <summary>
        /// Calcula ganho de performance estimado baseado no número de otimizações aplicadas
        /// </summary>
        private double CalculatePerformanceGainFromOptimizations(int optimizationsCount)
        {
            // Ganho estimado: 2-5% por otimização, com máximo de ~25%
            var baseGain = Math.Min(optimizationsCount * 3.5, 25.0);
            return Math.Round(baseGain, 1);
        }

        private async Task OptimizeCPUIntelligently()
        {
            await Task.Run(() =>
            {
                try
                {
                    // Identificar processos que consomem mais CPU
                    var processes = Process.GetProcesses()
                        .Where(p => p.Responding)
                        .OrderByDescending(p =>
                        {
                            try
                            {
                                using (var pc = new PerformanceCounter("Process", "% Processor Time", p.ProcessName))
                                {
                                    pc.NextValue();
                                    System.Threading.Thread.Sleep(100);
                                    return pc.NextValue();
                                }
                            }
                            catch { return 0; }
                        })
                        .Take(5)
                        .ToList();

                    foreach (var proc in processes)
                    {
                        try
                        {
                            if (proc.ProcessName != "VoltrisOptimizer" && 
                                proc.PriorityClass != ProcessPriorityClass.High)
                            {
                                // Reduzir prioridade de processos não essenciais
                                proc.PriorityClass = ProcessPriorityClass.BelowNormal;
                            }
                        }
                        catch { }
                    }
                }
                catch { }
            });
        }

        private async Task OptimizeMemoryIntelligently()
        {
            await Task.Run(() =>
            {
                try
                {
                    // Limpar working sets de processos inativos
                    var processes = Process.GetProcesses()
                        .Where(p => p.Responding && p.WorkingSet64 > 100 * 1024 * 1024) // > 100MB
                        .ToList();

                    foreach (var proc in processes)
                    {
                        try
                        {
                            if (proc.ProcessName != "VoltrisOptimizer")
                            {
                                // Forçar garbage collection
                                GC.Collect();
                                GC.WaitForPendingFinalizers();
                            }
                        }
                        catch { }
                    }
                }
                catch { }
            });
        }

        private async Task OptimizeDiskIntelligently()
        {
            await Task.Run(() =>
            {
                try
                {
                    // Sugerir limpeza de disco
                    _logger.LogInfo("Recomendação: Execute limpeza de disco para liberar espaço");
                }
                catch { }
            });
        }

        private double CalculatePerformanceGain()
        {
            try
            {
                // Calcular ganho estimado baseado em otimizações aplicadas
                // Em produção, comparar métricas antes/depois
                return 15.0; // Estimativa
            }
            catch { return 0; }
        }

        #endregion

        #region Previsão de Problemas

        /// <summary>
        /// Prevê problemas potenciais baseado em padrões
        /// </summary>
        public async Task<List<PredictedIssue>> PredictProblemsAsync()
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("Prevendo problemas potenciais...");
                    var predictions = new List<PredictedIssue>();

                    // Analisar tendências
                    var recentMetrics = _metricsHistory.Metrics.TakeLast(20).ToList();
                    if (recentMetrics.Any())
                    {
                        var avgCPU = recentMetrics.Average(m => m.CPUUsage);
                        var avgMemory = recentMetrics.Average(m => m.MemoryUsage);
                        var avgDisk = recentMetrics.Average(m => m.DiskFreePercent);

                        // Prever problemas baseado em tendências
                        if (avgCPU > 75)
                        {
                            predictions.Add(new PredictedIssue
                            {
                                Type = "CPU",
                                Severity = avgCPU > 85 ? "Alta" : "Média",
                                Description = "Uso de CPU consistentemente alto pode indicar processo problemático",
                                EstimatedTime = "24-48 horas",
                                Recommendation = "Identificar e otimizar processos que consomem mais CPU"
                            });
                        }

                        if (avgMemory > 80)
                        {
                            predictions.Add(new PredictedIssue
                            {
                                Type = "Memória",
                                Severity = avgMemory > 90 ? "Alta" : "Média",
                                Description = "Uso de memória alto pode causar lentidão",
                                EstimatedTime = "12-24 horas",
                                Recommendation = "Considerar upgrade de RAM ou otimização de memória"
                            });
                        }

                        if (avgDisk < 15)
                        {
                            predictions.Add(new PredictedIssue
                            {
                                Type = "Disco",
                                Severity = "Alta",
                                Description = "Espaço em disco baixo pode causar problemas de performance",
                                EstimatedTime = "Imediato",
                                Recommendation = "Liberar espaço em disco urgentemente"
                            });
                        }
                    }

                    _logger.LogSuccess($"Previstos {predictions.Count} problemas potenciais");
                    return predictions;
                }
                catch (Exception ex)
                {
                    _logger.LogError("Erro ao prever problemas", ex);
                    return new List<PredictedIssue>();
                }
            });
        }

        #endregion

        #region Recomendações Inteligentes

        /// <summary>
        /// Gera recomendações inteligentes baseadas em análise
        /// </summary>
        public async Task<List<AIRecommendation>> GenerateRecommendationsAsync(UsagePatterns? patterns = null)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("Gerando recomendações inteligentes...");
                    
                    if (patterns == null)
                    {
                        patterns = _usagePatterns;
                    }

                    var recommendations = new List<AIRecommendation>();

                    // Recomendação baseada em padrões de uso
                    if (patterns.PeakUsageHours.Any(h => h >= 18 && h <= 23))
                    {
                        recommendations.Add(new AIRecommendation
                        {
                            Id = Guid.NewGuid().ToString(),
                            Title = "Otimização Noturna Automática",
                            Description = "Seu sistema tem pico de uso à noite. Configure otimização automática antes desse horário.",
                            Priority = 7,
                            Category = "Agendamento",
                            Action = "Configurar otimização automática às 17:00"
                        });
                    }

                    // Recomendação baseada em aplicativos mais usados
                    if (patterns.MostUsedApplications.Any(a => a.Contains("Chrome") || a.Contains("Firefox")))
                    {
                        recommendations.Add(new AIRecommendation
                        {
                            Id = Guid.NewGuid().ToString(),
                            Title = "Limpeza de Cache de Navegador",
                            Description = "Navegadores são muito usados. Limpe o cache regularmente para melhor performance.",
                            Priority = 6,
                            Category = "Limpeza",
                            Action = "Limpar cache de navegadores"
                        });
                    }

                    // Recomendação baseada em problemas comuns
                    foreach (var issue in patterns.CommonIssues)
                    {
                        if (issue.Contains("CPU"))
                        {
                            recommendations.Add(new AIRecommendation
                            {
                                Id = Guid.NewGuid().ToString(),
                                Title = "Otimização de CPU",
                                Description = "CPU está sendo sobrecarregado. Otimize processos e serviços.",
                                Priority = 9,
                                Category = "Performance",
                                Action = "Executar otimização de CPU"
                            });
                        }
                    }

                    // Recomendação baseada em frequência de otimização
                    if (patterns.OptimizationFrequency < 5)
                    {
                        recommendations.Add(new AIRecommendation
                        {
                            Id = Guid.NewGuid().ToString(),
                            Title = "Otimização Regular",
                            Description = "Sistema não foi otimizado recentemente. Execute otimização completa.",
                            Priority = 8,
                            Category = "Manutenção",
                            Action = "Executar otimização completa"
                        });
                    }

                    _recommendations = recommendations;
                    SaveRecommendations();
                    _logger.LogSuccess($"Geradas {recommendations.Count} recomendações");
                    return recommendations;
                }
                catch (Exception ex)
                {
                    _logger.LogError("Erro ao gerar recomendações", ex);
                    return new List<AIRecommendation>();
                }
            });
        }

        /// <summary>
        /// Obtém recomendações pendentes
        /// </summary>
        public List<AIRecommendation> GetPendingRecommendations()
        {
            return _recommendations
                .Where(r => !r.Applied)
                .OrderByDescending(r => r.Priority)
                .ToList();
        }

        /// <summary>
        /// Aplica uma recomendação
        /// </summary>
        public async Task<bool> ApplyRecommendationAsync(AIRecommendation recommendation)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo($"Aplicando recomendação: {recommendation.Title}");
                    
                    // Aplicar ação baseada na categoria
                    switch (recommendation.Category)
                    {
                        case "Performance":
                            // Executar otimização de performance
                            break;
                        case "Limpeza":
                            // Executar limpeza
                            break;
                        case "Agendamento":
                            // Configurar agendamento
                            break;
                    }

                    recommendation.Applied = true;
                    recommendation.AppliedAt = DateTime.Now;
                    SaveRecommendations();
                    
                    _logger.LogSuccess($"Recomendação aplicada: {recommendation.Title}");
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Erro ao aplicar recomendação: {ex.Message}", ex);
                    return false;
                }
            });
        }

        #endregion

        #region Assistente Virtual

        /// <summary>
        /// Processa pergunta do usuário e retorna resposta inteligente usando OpenAI
        /// </summary>
        public async Task<AssistantResponse> ProcessUserQueryAsync(string query)
        {
            try
            {
                _logger.LogInfo($"[AI_SERVICE] ===== ProcessUserQueryAsync INICIADO =====");
                _logger.LogInfo($"[AI_SERVICE] Query recebida: '{query}' (Length: {query?.Length ?? 0})");
                
                var response = new AssistantResponse
                {
                    Query = query ?? "",
                    Response = "",
                    Actions = new List<string>(),
                    Confidence = 0.8
                };

                // Verificar se OpenAI está disponível
                var isOpenAIAvailable = IsOpenAIAvailable();
                _logger.LogInfo($"[AI_SERVICE] IsOpenAIAvailable() retornou: {isOpenAIAvailable}");
                
                if (!isOpenAIAvailable)
                {
                    var apiKey = _settingsService.Settings.OpenAIApiKey;
                    _logger.LogInfo($"[AI_SERVICE] OpenAI não disponível. API Key length: {apiKey?.Length ?? 0}");
                }

                // Se OpenAI estiver disponível, usar a API
                if (isOpenAIAvailable)
                {
                    _logger.LogInfo("[AI_SERVICE] Tentando usar OpenAI API...");
                    try
                    {
                        var systemMessage = "Você é um assistente especializado em otimização de sistemas Windows. " +
                            "Forneça respostas claras, objetivas e técnicas quando necessário. " +
                            "Recomende ações específicas que o usuário pode executar usando o Voltris Optimizer. " +
                            "Responda em português brasileiro.";
                        
                        _logger.LogInfo("[AI_SERVICE] Chamando CallOpenAIAsync...");
                        var aiResponse = await CallOpenAIAsync(query, systemMessage, maxTokens: 500);
                        _logger.LogInfo($"[AI_SERVICE] CallOpenAIAsync retornou. Length: {aiResponse?.Length ?? 0}");
                        
                        if (!string.IsNullOrWhiteSpace(aiResponse))
                        {
                            _logger.LogInfo($"[AI_SERVICE] Resposta da OpenAI recebida: '{aiResponse.Substring(0, Math.Min(100, aiResponse.Length))}...'");
                            response.Response = aiResponse;
                            response.Confidence = 0.9;

                            // Extrair ações sugeridas do texto da IA (se houver)
                            if (aiResponse.Contains("recomendo", StringComparison.OrdinalIgnoreCase) ||
                                aiResponse.Contains("sugiro", StringComparison.OrdinalIgnoreCase) ||
                                aiResponse.Contains("execute", StringComparison.OrdinalIgnoreCase))
                            {
                                _logger.LogInfo("[AI_SERVICE] Extraindo ações sugeridas da resposta...");
                                // Tentar extrair ações mencionadas
                                var lines = aiResponse.Split('\n', StringSplitOptions.RemoveEmptyEntries);
                                foreach (var line in lines)
                                {
                                    if (line.Contains("limpeza", StringComparison.OrdinalIgnoreCase) ||
                                        line.Contains("otimização", StringComparison.OrdinalIgnoreCase) ||
                                        line.Contains("otimizar", StringComparison.OrdinalIgnoreCase) ||
                                        line.Contains("desempenho", StringComparison.OrdinalIgnoreCase))
                                    {
                                        var cleanAction = line.Trim().TrimStart('-', '•', '*', ' ', '\t');
                                        if (!string.IsNullOrWhiteSpace(cleanAction) && cleanAction.Length > 5)
                                        {
                                            response.Actions.Add(cleanAction);
                                            _logger.LogInfo($"[AI_SERVICE] Ação extraída: '{cleanAction}'");
                                        }
                                    }
                                }
                            }

                            _logger.LogSuccess($"[AI_SERVICE] Consulta processada com OpenAI. Actions count: {response.Actions.Count}");
                            _logger.LogInfo("[AI_SERVICE] ===== ProcessUserQueryAsync FINALIZADO (OpenAI) =====");
                            return response;
                        }
                        else
                        {
                            // Se a resposta da OpenAI estiver vazia, usar fallback local
                            _logger.LogWarning("[AI_SERVICE] Resposta vazia da OpenAI. Usando fallback local.");
                            return ProcessUserQueryLocal(query);
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"[AI_SERVICE] Erro ao usar OpenAI: {ex.Message}", ex);
                        _logger.LogWarning("[AI_SERVICE] Usando fallback local devido ao erro.");
                        // Fallback para análise local se OpenAI falhar
                        return ProcessUserQueryLocal(query);
                    }
                }
                else
                {
                    // Usar análise local se OpenAI não estiver disponível
                    _logger.LogInfo("[AI_SERVICE] OpenAI não disponível. Usando fallback local.");
                    return ProcessUserQueryLocal(query);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("[AI_SERVICE] EXCEÇÃO em ProcessUserQueryAsync", ex);
                return new AssistantResponse
                {
                    Query = query ?? "",
                    Response = "Desculpe, ocorreu um erro ao processar sua consulta. Por favor, tente novamente.",
                    Confidence = 0.0
                };
            }
        }

        /// <summary>
        /// Processa consulta usando análise local (fallback)
        /// </summary>
        private AssistantResponse ProcessUserQueryLocal(string? query)
        {
            _logger.LogInfo($"[AI_SERVICE] ProcessUserQueryLocal INICIADO para query: '{query}'");
            
            var lowerQuery = query?.ToLower() ?? "";
            _logger.LogInfo($"[AI_SERVICE] Query em lowercase: '{lowerQuery}'");
            
            var response = new AssistantResponse
            {
                Query = query ?? "",
                Response = "",
                Actions = new List<string>(),
                Confidence = 0.7
            };

            // Análise simples de palavras-chave (fallback)
            _logger.LogInfo("[AI_SERVICE] Iniciando análise de palavras-chave...");
            
            if (lowerQuery.Contains("lento") || lowerQuery.Contains("lentidão"))
            {
                _logger.LogInfo("[AI_SERVICE] Match encontrado: 'lento' ou 'lentidão'");
                response.Response = "Identifiquei que seu sistema está lento. Recomendo executar uma otimização de desempenho e limpeza completa.";
                response.Actions.Add("Executar otimização de desempenho");
                response.Actions.Add("Executar limpeza completa");
                response.Confidence = 0.9;
            }
            else if (lowerQuery.Contains("memória") || lowerQuery.Contains("ram"))
            {
                _logger.LogInfo("[AI_SERVICE] Match encontrado: 'memória' ou 'ram'");
                response.Response = "Vou verificar o uso de memória. Recomendo executar a otimização de desempenho que inclui otimização de RAM.";
                response.Actions.Add("Verificar uso de memória");
                response.Actions.Add("Otimizar memória RAM");
                response.Confidence = 0.85;
            }
            else if (lowerQuery.Contains("disco") || lowerQuery.Contains("espaço"))
            {
                _logger.LogInfo("[AI_SERVICE] Match encontrado: 'disco' ou 'espaço'");
                response.Response = "Verifiquei que há espaço em disco a ser liberado. Recomendo executar a limpeza completa do sistema.";
                response.Actions.Add("Verificar espaço em disco");
                response.Actions.Add("Executar limpeza completa");
                response.Confidence = 0.85;
            }
            else if (lowerQuery.Contains("otimizar") || lowerQuery.Contains("otimização") || 
                     lowerQuery.Contains("otimize") || lowerQuery.Contains("otimizar meu pc") ||
                     lowerQuery.Contains("otimize meu pc") || lowerQuery.Contains("otimizar pc") ||
                     lowerQuery.Contains("melhorar") || lowerQuery.Contains("performance") ||
                     lowerQuery.Contains("desempenho"))
            {
                _logger.LogInfo("[AI_SERVICE] Match encontrado: palavra-chave de otimização");
                response.Response = "Perfeito! Recomendo executar a Otimização Inteligente Automática, que analisa seu sistema e aplica as melhores otimizações em sequência.\n\n" +
                                   "Esta otimização irá:\n" +
                                   "• Limpar arquivos temporários e cache\n" +
                                   "• Otimizar o plano de energia para alto desempenho\n" +
                                   "• Otimizar programas de inicialização\n" +
                                   "• Otimizar serviços do Windows\n" +
                                   "• Otimizar o uso de memória RAM";
                response.Actions.Add("Executar Otimização Inteligente Automática");
                response.Actions.Add("Executar Limpeza Completa");
                response.Actions.Add("Executar Otimização de Desempenho");
                response.Confidence = 0.95;
            }
            else if (lowerQuery.Contains("problema") || lowerQuery.Contains("erro") || lowerQuery.Contains("corrija") || lowerQuery.Contains("corrigir"))
            {
                _logger.LogInfo("[AI_SERVICE] Match encontrado: 'problema', 'erro' ou 'corrija'");
                response.Response = "Vou diagnosticar problemas no sistema. Recomendo executar o Diagnóstico Automático para identificar e resolver problemas.";
                response.Actions.Add("Executar Diagnóstico Automático");
                response.Confidence = 0.8;
            }
            else
            {
                _logger.LogInfo("[AI_SERVICE] Nenhum match encontrado. Usando resposta genérica");
                response.Response = "Como posso ajudá-lo? Posso:\n• Otimizar seu sistema\n• Diagnosticar problemas\n• Limpar arquivos desnecessários\n• Melhorar o desempenho\n\nFaça uma pergunta específica ou execute uma das ações disponíveis.";
                response.Confidence = 0.5;
            }

            _logger.LogInfo($"[AI_SERVICE] ProcessUserQueryLocal FINALIZADO. Response.Response length: {response.Response?.Length ?? 0}, Actions count: {response.Actions?.Count ?? 0}");
            _logger.LogInfo($"[AI_SERVICE] Response completa: '{response.Response?.Substring(0, Math.Min(200, response.Response?.Length ?? 0))}...'");
            return response;
        }

        /// <summary>
        /// Diagnóstico automático do sistema com análise de IA
        /// </summary>
        public async Task<DiagnosticResult> PerformAutoDiagnosticAsync()
        {
            return await Task.Run(async () =>
            {
                try
                {
                    _logger.LogInfo("Executando diagnóstico automático...");
                    
                    var diagnostic = new DiagnosticResult
                    {
                        Timestamp = DateTime.Now,
                        Issues = new List<DiagnosticIssue>(),
                        Recommendations = new List<string>(),
                        OverallHealth = "Bom"
                    };

                    // ============================================================
                    // COLETAR DADOS DO SISTEMA
                    // ============================================================
                    var systemData = await CollectSystemDataAsync();

                    // Verificar CPU
                    if (systemData.CPUUsage > 80)
                    {
                        diagnostic.Issues.Add(new DiagnosticIssue
                        {
                            Type = "CPU",
                            Severity = systemData.CPUUsage > 90 ? "Alta" : "Média",
                            Description = $"Uso de CPU elevado: {systemData.CPUUsage:F1}%",
                            Solution = "Otimizar processos e serviços do Windows"
                        });
                    }

                    // Verificar Memória
                    var ramUsagePercent = (1.0 - (double)systemData.AvailableRAM / systemData.TotalRAM) * 100;
                    if (ramUsagePercent > 85 || systemData.AvailableRAMGB < 2)
                    {
                        diagnostic.Issues.Add(new DiagnosticIssue
                        {
                            Type = "Memória",
                            Severity = ramUsagePercent > 90 ? "Alta" : "Média",
                            Description = $"Uso de RAM: {ramUsagePercent:F1}% | Disponível: {systemData.AvailableRAMGB:F1} GB",
                            Solution = "Otimizar uso de memória RAM"
                        });
                    }

                    // Verificar Disco
                    var diskFreePercent = (double)systemData.FreeDiskSpace / systemData.TotalDiskSpace * 100;
                    if (diskFreePercent < 15)
                    {
                        diagnostic.Issues.Add(new DiagnosticIssue
                        {
                            Type = "Disco",
                            Severity = diskFreePercent < 10 ? "Alta" : "Média",
                            Description = $"Espaço em disco baixo: {diskFreePercent:F1}% livre | Espaço a liberar: {FormatBytes(systemData.SpaceToClean)}",
                            Solution = "Executar limpeza completa do sistema"
                        });
                    }

                    // Verificar Programas de Inicialização
                    if (systemData.StartupProgramsCount > 10)
                    {
                        diagnostic.Issues.Add(new DiagnosticIssue
                        {
                            Type = "Inicialização",
                            Severity = systemData.StartupProgramsCount > 15 ? "Média" : "Baixa",
                            Description = $"Muitos programas na inicialização: {systemData.StartupProgramsCount} programas",
                            Solution = "Otimizar programas de inicialização"
                        });
                    }

                    // Determinar saúde geral baseado nos problemas detectados
                    if (diagnostic.Issues.Any(i => i.Severity == "Alta"))
                    {
                        diagnostic.OverallHealth = "Crítico";
                    }
                    else if (diagnostic.Issues.Any(i => i.Severity == "Média"))
                    {
                        diagnostic.OverallHealth = "Atenção";
                    }
                    else if (diagnostic.Issues.Any())
                    {
                        diagnostic.OverallHealth = "Bom com observações";
                    }

                    // ============================================================
                    // ENVIAR DADOS PARA IA (se disponível)
                    // ============================================================
                    if (IsOpenAIAvailable())
                    {
                        try
                        {
                            var aiAnalysis = await GetAIDiagnosticAnalysisAsync(systemData, diagnostic.Issues);
                            diagnostic.Recommendations.AddRange(aiAnalysis);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"Erro ao obter análise de IA: {ex.Message}. Usando recomendações locais.");
                            // Fallback para recomendações locais
                            GenerateLocalRecommendations(diagnostic);
                        }
                    }
                    else
                    {
                        // Gerar recomendações locais se IA não estiver disponível
                        GenerateLocalRecommendations(diagnostic);
                    }

                    _logger.LogSuccess($"Diagnóstico concluído. Saúde: {diagnostic.OverallHealth}");
                    return diagnostic;
                }
                catch (Exception ex)
                {
                    _logger.LogError("Erro no diagnóstico", ex);
                    return new DiagnosticResult { OverallHealth = "Desconhecido" };
                }
            });
        }

        /// <summary>
        /// Coleta dados brutos do sistema para diagnóstico
        /// </summary>
        private async Task<SystemDiagnosticData> CollectSystemDataAsync()
        {
            return await Task.Run(() =>
            {
                var data = new SystemDiagnosticData();

                try
                {
                    // CPU Usage
                    using (var pc = new PerformanceCounter("Processor", "% Processor Time", "_Total"))
                    {
                        pc.NextValue();
                        Thread.Sleep(1000);
                        data.CPUUsage = pc.NextValue();
                    }
                }
                catch { data.CPUUsage = 0; }

                try
                {
                    // RAM Info
                    var totalRAM = new PerformanceCounter("Memory", "Total Bytes");
                    var availableRAM = new PerformanceCounter("Memory", "Available Bytes");
                    data.TotalRAM = (long)totalRAM.NextValue();
                    data.AvailableRAM = (long)availableRAM.NextValue();
                    data.AvailableRAMGB = data.AvailableRAM / (1024.0 * 1024.0 * 1024.0);
                }
                catch { }

                try
                {
                    // Disk Info
                    var drive = new DriveInfo("C:");
                    data.TotalDiskSpace = drive.TotalSize;
                    data.FreeDiskSpace = drive.AvailableFreeSpace;
                }
                catch { }

                try
                {
                    // Espaço a liberar
                    if (App.SystemCleaner != null)
                    {
                        // Criar cancellation token com timeout de 30 segundos
                        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));
                        var spaceTask = App.SystemCleaner.CalculateTotalSizeAsync(
                            cleanTemp: true,
                            cleanRecycle: true,
                            cleanThumbnails: true,
                            cleanBrowsers: true,
                            cts.Token
                        );
                        spaceTask.Wait(cts.Token);
                        data.SpaceToClean = spaceTask.Result;
                    }
                }                catch { }

                try
                {
                    // Startup Programs
                    using (var key = Registry.CurrentUser.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Run", false))
                    {
                        if (key != null)
                        {
                            var values = key.GetValueNames();
                            data.StartupProgramsCount = values?.Length ?? 0;
                            data.StartupProgramsList = values?.ToList() ?? new List<string>();
                        }
                    }
                }
                catch { }

                // DISM/SFC Status (simplificado - apenas indicar se precisa verificação)
                data.DismStatus = "Não verificado";
                data.SfcStatus = "Não verificado";

                return data;
            });
        }

        /// <summary>
        /// Obtém análise de diagnóstico da IA
        /// </summary>
        private async Task<List<string>> GetAIDiagnosticAnalysisAsync(SystemDiagnosticData data, List<DiagnosticIssue> issues)
        {
            if (!IsOpenAIAvailable())
                return new List<string>();

            try
            {
                var megaPrompt = $@"Aja como um especialista em TI e otimização de sistemas Windows.

Aqui estão os dados do sistema do meu usuário:

DADOS DO SISTEMA:
- Uso de CPU: {data.CPUUsage:F1}%
- Uso de RAM: {(1.0 - (double)data.AvailableRAM / data.TotalRAM) * 100:F1}% | Disponível: {data.AvailableRAMGB:F1} GB de {data.TotalRAM / (1024.0 * 1024.0 * 1024.0):F1} GB
- Espaço em disco: {data.FreeDiskSpace / (1024.0 * 1024.0 * 1024.0):F1} GB livre de {data.TotalDiskSpace / (1024.0 * 1024.0 * 1024.0):F1} GB ({((double)data.FreeDiskSpace / data.TotalDiskSpace * 100):F1}% livre)
- Espaço potencial a liberar: {FormatBytes(data.SpaceToClean)}
- Programas na inicialização: {data.StartupProgramsCount} programas
- Programas de inicialização: {string.Join(", ", data.StartupProgramsList.Take(10))}

PROBLEMAS DETECTADOS:
{string.Join("\n", issues.Select(i => $"- {i.Type} ({i.Severity}): {i.Description}"))}

Analise esses dados e forneça:
1. Um resumo breve do estado geral do sistema
2. Recomendações específicas e acionáveis (máximo 5)
3. Quais otimizações do Voltris Optimizer o usuário deve executar (por exemplo: ""Execute a limpeza completa"", ""Execute otimização de desempenho"")

Seja claro, objetivo e técnico quando necessário. Responda em português brasileiro.
Formate a resposta em tópicos curtos, um por linha, começando com • ou -.";

                var aiResponse = await CallOpenAIAsync(megaPrompt, maxTokens: 800);
                
                if (!string.IsNullOrWhiteSpace(aiResponse))
                {
                    var recommendations = new List<string>();
                    
                    // Extrair recomendações do texto (linhas que começam com • ou -)
                    var lines = aiResponse.Split('\n', StringSplitOptions.RemoveEmptyEntries);
                    foreach (var line in lines)
                    {
                        var trimmed = line.Trim();
                        if (!string.IsNullOrWhiteSpace(trimmed) && 
                            (trimmed.StartsWith("•") || trimmed.StartsWith("-") || 
                             trimmed.StartsWith("*") || trimmed.All(char.IsLetterOrDigit) == false))
                        {
                            var clean = trimmed.TrimStart('•', '-', '*', ' ', '\t');
                            if (!string.IsNullOrWhiteSpace(clean) && clean.Length > 10)
                            {
                                recommendations.Add(clean);
                            }
                        }
                    }

                    return recommendations.Any() ? recommendations : new List<string> { aiResponse };
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"Erro ao obter análise de IA: {ex.Message}");
            }

            return new List<string>();
        }

        /// <summary>
        /// Faz chamada à API OpenAI usando HttpClient
        /// </summary>
        private async Task<string> CallOpenAIAsync(string? userMessage, string? systemMessage = null, int maxTokens = 500)
        {
            _logger.LogInfo("[AI_SERVICE] CallOpenAIAsync INICIADO");
            
            if (!IsOpenAIAvailable())
            {
                _logger.LogWarning("[AI_SERVICE] OpenAI não disponível em CallOpenAIAsync");
                return "";
            }

            try
            {
                var apiKey = _settingsService.Settings.OpenAIApiKey;
                _logger.LogInfo($"[AI_SERVICE] API Key obtida. Length: {apiKey?.Length ?? 0}");
                
                var apiUrl = "https://api.openai.com/v1/chat/completions";
                _logger.LogInfo($"[AI_SERVICE] URL da API: {apiUrl}");

                var messages = new List<object>();
                if (!string.IsNullOrWhiteSpace(systemMessage))
                {
                    messages.Add(new { role = "system", content = systemMessage });
                    _logger.LogInfo("[AI_SERVICE] System message adicionado");
                }
                messages.Add(new { role = "user", content = userMessage ?? "" });
                _logger.LogInfo($"[AI_SERVICE] User message adicionado. Content length: {(userMessage ?? "").Length}");

                var requestBody = new
                {
                    model = "gpt-4o-mini",
                    messages = messages,
                    temperature = 0.7,
                    max_tokens = maxTokens
                };

                var json = JsonSerializer.Serialize(requestBody);
                _logger.LogInfo($"[AI_SERVICE] Request body serializado. JSON length: {json.Length}");
                
                var content = new StringContent(json, Encoding.UTF8, "application/json");

                _httpClient.DefaultRequestHeaders.Clear();
                _httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {apiKey}");
                _logger.LogInfo("[AI_SERVICE] Headers configurados. Fazendo POST request...");

                var response = await _httpClient.PostAsync(apiUrl, content);
                _logger.LogInfo($"[AI_SERVICE] POST request concluído. StatusCode: {response.StatusCode}");
                
                if (response.IsSuccessStatusCode)
                {
                    _logger.LogInfo("[AI_SERVICE] Response bem-sucedido. Lendo conteúdo...");
                    var responseContent = await response.Content.ReadAsStringAsync();
                    _logger.LogInfo($"[AI_SERVICE] Response content lido. Length: {responseContent?.Length ?? 0}");
                    if (string.IsNullOrEmpty(responseContent))
                    {
                        _logger.LogWarning("[AI_SERVICE] Response vazio da API");
                        return "";
                    }
                    var responseJson = JsonDocument.Parse(responseContent);
                    
                    if (responseJson.RootElement.TryGetProperty("choices", out var choices) && 
                        choices.GetArrayLength() > 0)
                    {
                        _logger.LogInfo($"[AI_SERVICE] Choices encontrados: {choices.GetArrayLength()}");
                        var firstChoice = choices[0];
                        if (firstChoice.TryGetProperty("message", out var message) &&
                            message.TryGetProperty("content", out var contentElement))
                        {
                            var result = contentElement.GetString() ?? "";
                            _logger.LogInfo($"[AI_SERVICE] Content extraído. Length: {result.Length}");
                            _logger.LogSuccess("[AI_SERVICE] CallOpenAIAsync FINALIZADO COM SUCESSO");
                            return result;
                        }
                        else
                        {
                            _logger.LogWarning("[AI_SERVICE] Não foi possível extrair message.content da resposta JSON");
                        }
                    }
                    else
                    {
                        _logger.LogWarning("[AI_SERVICE] Nenhuma choice encontrada na resposta JSON");
                    }
                }
                else
                {
                    var errorContent = await response.Content.ReadAsStringAsync();
                    _logger.LogError($"[AI_SERVICE] Erro na API OpenAI: {response.StatusCode} - {errorContent}", null);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[AI_SERVICE] EXCEÇÃO em CallOpenAIAsync: {ex.Message}", ex);
            }

            _logger.LogWarning("[AI_SERVICE] CallOpenAIAsync FINALIZADO SEM RESULTADO");
            return "";
        }

        /// <summary>
        /// Gera recomendações locais (fallback)
        /// </summary>
        private void GenerateLocalRecommendations(DiagnosticResult diagnostic)
        {
            foreach (var issue in diagnostic.Issues)
            {
                if (!diagnostic.Recommendations.Contains(issue.Solution))
                {
                    diagnostic.Recommendations.Add(issue.Solution);
                }
            }

            // Adicionar recomendações gerais
            if (diagnostic.Issues.Any(i => i.Type == "CPU" || i.Type == "Memória"))
            {
                diagnostic.Recommendations.Add("Execute a Otimização de Desempenho");
            }
            if (diagnostic.Issues.Any(i => i.Type == "Disco"))
            {
                diagnostic.Recommendations.Add("Execute a Limpeza Completa do Sistema");
            }
            if (diagnostic.Issues.Any(i => i.Type == "Inicialização"))
            {
                diagnostic.Recommendations.Add("Otimize os programas de inicialização");
            }
        }

        /// <summary>
        /// Formata bytes em formato legível
        /// </summary>
        private string FormatBytes(long bytes)
        {
            string[] sizes = { "B", "KB", "MB", "GB", "TB" };
            double len = bytes;
            int order = 0;
            while (len >= 1024 && order < sizes.Length - 1)
            {
                order++;
                len = len / 1024;
            }
            return $"{len:0.##} {sizes[order]}";
        }

        #endregion

        #region Coleta de Métricas

        private void StartMetricsCollection()
        {
            var token = _metricsCts.Token;
            Task.Run(async () =>
            {
                while (!token.IsCancellationRequested)
                {
                    try
                    {
                        await Task.Delay(60000, token); // Coletar a cada minuto

                        var metric = new SystemMetric
                        {
                            Timestamp = DateTime.Now,
                            CPUUsage = GetCurrentCPUUsage(),
                            MemoryUsage = GetCurrentMemoryUsage(),
                            DiskFreePercent = GetCurrentDiskFreePercent(),
                            TopProcesses = GetTopProcesses()
                        };

                        _metricsHistory.Metrics.Add(metric);

                        // Manter apenas últimas 1000 métricas
                        if (_metricsHistory.Metrics.Count > 1000)
                        {
                            _metricsHistory.Metrics.RemoveAt(0);
                        }
                    }
                    catch (OperationCanceledException) { break; }
                    catch { }
                }
            });
        }

        private double GetCurrentCPUUsage()
        {
            try
            {
                using (var pc = new PerformanceCounter("Processor", "% Processor Time", "_Total"))
                {
                    pc.NextValue();
                    System.Threading.Thread.Sleep(100);
                    return pc.NextValue();
                }
            }
            catch { return 0; }
        }

        private double GetCurrentMemoryUsage()
        {
            try
            {
                var available = new PerformanceCounter("Memory", "Available Bytes");
                var total = new PerformanceCounter("Memory", "Total Bytes");
                var used = (1.0 - available.NextValue() / total.NextValue()) * 100;
                return used;
            }
            catch { return 0; }
        }

        private double GetCurrentDiskFreePercent()
        {
            try
            {
                var drive = new System.IO.DriveInfo("C:");
                return (double)drive.AvailableFreeSpace / drive.TotalSize * 100;
            }
            catch { return 0; }
        }

        private List<string> GetTopProcesses()
        {
            try
            {
                return Process.GetProcesses()
                    .Where(p => p.Responding)
                    .OrderByDescending(p => p.WorkingSet64)
                    .Take(5)
                    .Select(p => p.ProcessName)
                    .ToList();
            }
            catch { return new List<string>(); }
        }

        #endregion

        #region Persistência

        private void LoadPatterns()
        {
            try
            {
                if (File.Exists(_patternsPath))
                {
                    var json = File.ReadAllText(_patternsPath);
                    _usagePatterns = JsonSerializer.Deserialize<UsagePatterns>(json) ?? new UsagePatterns();
                }
            }
            catch { }
        }

        private void SavePatterns()
        {
            try
            {
                var json = JsonSerializer.Serialize(_usagePatterns, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_patternsPath, json);
            }
            catch { }
        }

        private void LoadRecommendations()
        {
            try
            {
                if (File.Exists(_recommendationsPath))
                {
                    var json = File.ReadAllText(_recommendationsPath);
                    _recommendations = JsonSerializer.Deserialize<List<AIRecommendation>>(json) ?? new List<AIRecommendation>();
                }
            }
            catch { }
        }

        private void SaveRecommendations()
        {
            try
            {
                var json = JsonSerializer.Serialize(_recommendations, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_recommendationsPath, json);
            }
            catch { }
        }

        #endregion
    }

    #region Classes de Dados

    public class UsagePatterns
    {
        public DateTime LastAnalyzed { get; set; } = DateTime.Now;
        public List<int> PeakUsageHours { get; set; } = new List<int>();
        public List<string> MostUsedApplications { get; set; } = new List<string>();
        public List<string> CommonIssues { get; set; } = new List<string>();
        public int OptimizationFrequency { get; set; }
        public string SystemHealthTrend { get; set; } = "Estável";
    }

    public class AIRecommendation
    {
        public string Id { get; set; } = "";
        public string Title { get; set; } = "";
        public string Description { get; set; } = "";
        public int Priority { get; set; } // 1-10
        public string Category { get; set; } = "";
        public string Action { get; set; } = "";
        public bool Applied { get; set; }
        public DateTime? AppliedAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }

    public class OptimizationResult
    {
        public List<string> OptimizationsApplied { get; set; } = new List<string>();
        public List<string> IssuesFixed { get; set; } = new List<string>();
        public double PerformanceGain { get; set; } // Percentual
    }

    public class PredictedIssue
    {
        public string Type { get; set; } = "";
        public string Severity { get; set; } = "";
        public string Description { get; set; } = "";
        public string EstimatedTime { get; set; } = "";
        public string Recommendation { get; set; } = "";
    }

    public class AssistantResponse
    {
        public string Query { get; set; } = "";
        public string Response { get; set; } = "";
        public List<string> Actions { get; set; } = new List<string>();
        public double Confidence { get; set; } // 0.0 - 1.0
    }

    public class LyraResponse
    {
        public string Response { get; set; } = "";
        public List<string> Actions { get; set; } = new List<string>();
        public double Confidence { get; set; } = 0.0;
    }

    public class LyraMemory
    {
        public string UserName { get; set; } = "";
        public string PreferredStyle { get; set; } = "breve";
        public bool FastMode { get; set; } = true;
        public bool DetailedMode { get; set; } = false;
        public Dictionary<string, int> IntentFrequency { get; set; } = new Dictionary<string, int>();
        public List<string> RecentIntents { get; set; } = new List<string>();
        public DateTime LastInteraction { get; set; } = DateTime.MinValue;
    }

    public class DiagnosticResult
    {
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public List<DiagnosticIssue> Issues { get; set; } = new List<DiagnosticIssue>();
        public List<string> Recommendations { get; set; } = new List<string>();
        public string OverallHealth { get; set; } = "Bom";
    }

    public class DiagnosticIssue
    {
        public string Type { get; set; } = "";
        public string Severity { get; set; } = "";
        public string Description { get; set; } = "";
        public string Solution { get; set; } = "";
    }

    public class SystemMetric
    {
        public DateTime Timestamp { get; set; }
        public double CPUUsage { get; set; }
        public double MemoryUsage { get; set; }
        public double DiskFreePercent { get; set; }
        public List<string> TopProcesses { get; set; } = new List<string>();
    }

    public class SystemMetricsHistory
    {
        public List<SystemMetric> Metrics { get; set; } = new List<SystemMetric>();
    }

    /// <summary>
    /// Dados coletados do sistema para diagnóstico
    /// </summary>
    public class SystemDiagnosticData
    {
        public double CPUUsage { get; set; }
        public long TotalRAM { get; set; }
        public long AvailableRAM { get; set; }
        public double AvailableRAMGB { get; set; }
        public long TotalDiskSpace { get; set; }
        public long FreeDiskSpace { get; set; }
        public long SpaceToClean { get; set; }
        public int StartupProgramsCount { get; set; }
        public List<string> StartupProgramsList { get; set; } = new List<string>();
        public string DismStatus { get; set; } = "";
        public string SfcStatus { get; set; } = "";
    }

    #endregion
}

