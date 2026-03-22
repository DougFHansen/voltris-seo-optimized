using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.Core.Configuration
{
    /// <summary>
    /// GERENCIADOR DE FEATURE FLAGS (ENTERPRISE CONFIGURATION)
    /// 
    /// Permite ativar/desativar funcionalidades remotamente sem precisar de updates de código.
    /// Essencial para deploys seguros ("Kill Switch" para features bugadas).
    /// </summary>
    public class FeatureFlagManager
    {
        private const string REMOTE_FLAGS_URL = "https://api.voltris.com.br/flags.json"; // URL simulada
        private readonly string _localFlagsPath;
        private readonly ILoggingService _logger;
        private Dictionary<string, bool> _flags = new Dictionary<string, bool>();

        // Flags padrão (Hardcoded safe defaults)
        private readonly Dictionary<string, bool> _defaults = new Dictionary<string, bool>
        {
            { "UseNewCleanerEngine", true },
            { "AllowGodModeValues", true },
            { "EnableContextAwareness", true },
            { "EnableTelemetryLocal", true },
            { "ShowBetaFeatures", false }
        };

        public FeatureFlagManager(ILoggingService logger)
        {
            _logger = logger;
            _localFlagsPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Config", "feature_flags.json");
            Initialize();
        }

        private void Initialize()
        {
            // 1. Carregar Defaults
            _flags = new Dictionary<string, bool>(_defaults);

            // 2. Carregar Cache Local
            LoadLocalCache();

            // 3. Tentar Atualizar Remoto (Async Fire-and-Forget)
            Task.Run(RefreshFlagsAsync);
        }

        public bool IsEnabled(string featureKey)
        {
            if (_flags.TryGetValue(featureKey, out bool value))
            {
                return value;
            }
            return false; // Default safe = disabled se não existir a flag
        }

        private void LoadLocalCache()
        {
            try
            {
                if (File.Exists(_localFlagsPath))
                {
                    var json = File.ReadAllText(_localFlagsPath);
                    var localFlags = JsonSerializer.Deserialize<Dictionary<string, bool>>(json);
                    
                    if (localFlags != null)
                    {
                        foreach (var kvp in localFlags)
                        {
                            _flags[kvp.Key] = kvp.Value;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Falha ao carregar flags locais", ex);
            }
        }

        private async Task RefreshFlagsAsync()
        {
            try
            {
                using (var client = new HttpClient())
                {
                    // Timeout curto para não impactar performance de startup
                    client.Timeout = TimeSpan.FromSeconds(5);
                    
                    // Em produção: Usar URL real. Aqui simulamos falha se não existir.
                    var json = await client.GetStringAsync(REMOTE_FLAGS_URL);
                    var remoteFlags = JsonSerializer.Deserialize<Dictionary<string, bool>>(json);

                    if (remoteFlags != null)
                    {
                        foreach (var kvp in remoteFlags)
                        {
                            _flags[kvp.Key] = kvp.Value;
                        }
                        
                        // Persistir cache atualizado
                        SaveLocalCache();
                        _logger.LogInfo("[FLAGS] Feature Flags atualizadas remotamente.");
                    }
                }
            }
            catch
            {
                // Silencioso: Se falhar a rede, usa o cache local ou defaults. Normal operation.
            }
        }

        private void SaveLocalCache()
        {
            try
            {
                var dir = Path.GetDirectoryName(_localFlagsPath);
                if (!Directory.Exists(dir)) Directory.CreateDirectory(dir!);

                var json = JsonSerializer.Serialize(_flags, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_localFlagsPath, json);
            }
            catch { }
        }
    }
}
