using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.Core.Intelligence
{
    /// <summary>
    /// USAGE PROFILER - TELEMETRIA LOCAL (PRIVACY FIRST)
    /// 
    /// Aprende os hábitos de uso do usuário LOCALMENTE, sem enviar dados para a nuvem.
    /// Permite ao software fazer sugestões proativas (ex: "Limpar RAM antes do horário habitual de jogo").
    /// </summary>
    public class UsageProfiler
    {
        private readonly string _profilePath;
        private readonly ILoggingService _logger;
        private UserUsageData _data;
        private readonly object _lock = new object();

        public UsageProfiler(ILoggingService logger)
        {
            _logger = logger;
            _profilePath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Data", "usage_profile.json");
            _data = LoadProfile();
        }

        /// <summary>
        /// Registra o uso de uma feature ou evento (ex: "GameLaunched", "CleanupRun").
        /// </summary>
        public void RecordUsage(string featureName)
        {
            Task.Run(() =>
            {
                lock (_lock)
                {
                    var record = new UsageEvent
                    {
                        Feature = featureName,
                        Timestamp = DateTime.Now,
                        DayOfWeek = DateTime.Now.DayOfWeek
                    };

                    _data.History.Add(record);
                    
                    // Manter histórico limpo (últimos 1000 eventos)
                    if (_data.History.Count > 1000)
                    {
                        _data.History = _data.History.OrderByDescending(x => x.Timestamp).Take(1000).ToList();
                    }

                    SaveProfile();
                }
            });
        }

        /// <summary>
        /// Prevê se o usuário provavelmente vai jogar em breve baseada no histórico.
        /// Exemplo: Se o usuário joga todo dia às 19h, e agora são 18:50, retorna true.
        /// </summary>
        public bool IsGamingExpectedSoon()
        {
            var now = DateTime.Now;
            var currentHour = now.Hour;
            var currentDay = now.DayOfWeek;

            // Filtrar eventos de "GameLaunched" nos últimos 30 dias para este dia da semana
            var gamingEvents = _data.History
                .Where(x => x.Feature == "GameLaunched" && 
                            x.DayOfWeek == currentDay && 
                            x.Timestamp > now.AddDays(-30))
                .ToList();

            if (!gamingEvents.Any()) return false;

            // Verificar se há concentração de eventos na próxima hora
            var eventsInNextHour = gamingEvents.Count(x => x.Timestamp.Hour == currentHour || x.Timestamp.Hour == currentHour + 1);
            
            // Heurística simples: Se mais de 30% das sessões de jogo ocorreram neste horário
            bool highLikelihood = (double)eventsInNextHour / gamingEvents.Count > 0.3;

            if (highLikelihood)
            {
                _logger.LogInfo($"[AI] Previsão de uso: Alta probabilidade de jogo detectada para o horário atual ({currentHour}h).");
            }

            return highLikelihood;
        }

        public UserUsageData GetRawData() => _data;

        private UserUsageData LoadProfile()
        {
            try
            {
                if (File.Exists(_profilePath))
                {
                    var json = File.ReadAllText(_profilePath);
                    return JsonSerializer.Deserialize<UserUsageData>(json) ?? new UserUsageData();
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Falha ao carregar perfil de uso", ex);
            }
            return new UserUsageData();
        }

        private void SaveProfile()
        {
            try
            {
                var dir = Path.GetDirectoryName(_profilePath);
                if (!Directory.Exists(dir)) Directory.CreateDirectory(dir!);

                var json = JsonSerializer.Serialize(_data, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_profilePath, json);
            }
            catch (Exception ex)
            {
                _logger.LogError("Falha ao salvar perfil de uso", ex);
            }
        }
    }

    public class UserUsageData
    {
        public List<UsageEvent> History { get; set; } = new List<UsageEvent>();
    }

    public class UsageEvent
    {
        public string Feature { get; set; } = "";
        public DateTime Timestamp { get; set; }
        public DayOfWeek DayOfWeek { get; set; }
    }
}
