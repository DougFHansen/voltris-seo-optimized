using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using GamerModels = VoltrisOptimizer.Services.Gamer.Models;

namespace VoltrisOptimizer.Services.Gamer.Implementation
{
    /// <summary>
    /// Implementação do serviço de perfis de jogos
    /// </summary>
    public class GameProfileService : IGameProfileService
    {
        private readonly ILoggingService _logger;
        private readonly IGamerModeOrchestrator _orchestrator;
        private readonly string _profilesPath;
        private List<GamerModels.GameProfile> _profiles = new();
        private readonly object _lock = new();

        public GameProfileService(ILoggingService logger, IGamerModeOrchestrator orchestrator)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _orchestrator = orchestrator ?? throw new ArgumentNullException(nameof(orchestrator));
            
            var gamesDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Games");
            Directory.CreateDirectory(gamesDir);
            _profilesPath = Path.Combine(gamesDir, "profiles.json");
            
            Load();
        }

        public IReadOnlyList<GamerModels.GameProfile> GetAllProfiles()
        {
            lock (_lock)
            {
                return _profiles.ToList().AsReadOnly();
            }
        }

        public GamerModels.GameProfile? GetProfile(string gameName)
        {
            lock (_lock)
            {
                return _profiles.FirstOrDefault(p => 
                    p.GameName.Equals(gameName, StringComparison.OrdinalIgnoreCase));
            }
        }

        public GamerModels.GameProfile? GetProfileByPath(string executablePath)
        {
            lock (_lock)
            {
                return _profiles.FirstOrDefault(p => 
                    p.ExecutablePath.Equals(executablePath, StringComparison.OrdinalIgnoreCase));
            }
        }

        public void SaveProfile(GamerModels.GameProfile profile)
        {
            if (profile == null) return;

            lock (_lock)
            {
                var existing = _profiles.FirstOrDefault(p => p.Id == profile.Id);
                
                if (existing != null)
                {
                    // Atualizar existente
                    existing.GameName = profile.GameName;
                    existing.ExecutablePath = profile.ExecutablePath;
                    existing.Settings = profile.Settings;
                    _logger.LogInfo($"[Profile] Perfil atualizado: {profile.GameName}");
                }
                else
                {
                    // Adicionar novo
                    if (string.IsNullOrEmpty(profile.Id))
                    {
                        profile.Id = Guid.NewGuid().ToString();
                    }
                    profile.CreatedAt = DateTime.Now;
                    _profiles.Add(profile);
                    _logger.LogInfo($"[Profile] Perfil criado: {profile.GameName}");
                }

                Save();
            }
        }

        public bool DeleteProfile(string gameName)
        {
            lock (_lock)
            {
                var profile = _profiles.FirstOrDefault(p => 
                    p.GameName.Equals(gameName, StringComparison.OrdinalIgnoreCase));
                
                if (profile == null) return false;

                _profiles.Remove(profile);
                Save();
                _logger.LogInfo($"[Profile] Perfil removido: {gameName}");
                return true;
            }
        }

        public async Task<bool> ApplyProfileAsync(string gameName, IProgress<int>? progress = null, CancellationToken cancellationToken = default)
        {
            try
            {
                var profile = GetProfile(gameName);
                if (profile == null)
                {
                    _logger.LogWarning($"[Profile] Perfil não encontrado: {gameName}");
                    return false;
                }

                _logger.LogInfo($"[Profile] Aplicando perfil: {gameName}");
                progress?.Report(10);

                // Converter settings do perfil para opções de otimização
                var options = new GamerModels.GamerOptimizationOptions
                {
                    OptimizeCpu = profile.Settings.OptimizeCPU,
                    OptimizeGpu = profile.Settings.OptimizeGPU,
                    OptimizeNetwork = profile.Settings.OptimizeNetwork,
                    OptimizeMemory = profile.Settings.OptimizeMemory,
                    EnableGameMode = profile.Settings.EnableGameMode,
                    ReduceLatency = profile.Settings.ReduceLatency,
                    CloseBackgroundApps = profile.Settings.CloseBackgroundApps,
                    ApplyFpsBoost = profile.Settings.ApplyFPSBoost,
                    EnableExtremeMode = profile.Settings.EnableExtremeMode,
                    EnableAntiStutter = profile.Settings.EnableAntiStutter,
                    EnableAdaptiveNetwork = profile.Settings.EnableAdaptiveNetwork
                };

                progress?.Report(30);

                // Ativar modo gamer com as configurações do perfil
                var result = await _orchestrator.ActivateAsync(options, profile.ExecutablePath, progress, cancellationToken);

                if (result)
                {
                    profile.LastUsed = DateTime.Now;
                    SaveProfile(profile);
                    _logger.LogSuccess($"[Profile] Perfil aplicado: {gameName}");
                }

                progress?.Report(100);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[Profile] Erro ao aplicar perfil {gameName}", ex);
                return false;
            }
        }

        private void Save()
        {
            try
            {
                var options = new JsonSerializerOptions 
                { 
                    WriteIndented = true,
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                };
                var json = JsonSerializer.Serialize(_profiles, options);
                File.WriteAllText(_profilesPath, json);
            }
            catch (Exception ex)
            {
                _logger.LogError("[Profile] Erro ao salvar perfis", ex);
            }
        }

        private void Load()
        {
            try
            {
                if (!File.Exists(_profilesPath))
                {
                    _profiles = new List<GamerModels.GameProfile>();
                    return;
                }

                var json = File.ReadAllText(_profilesPath);
                var options = new JsonSerializerOptions 
                { 
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase 
                };
                _profiles = JsonSerializer.Deserialize<List<GamerModels.GameProfile>>(json, options) ?? new List<GamerModels.GameProfile>();
                _logger.LogInfo($"[Profile] Carregados {_profiles.Count} perfis");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[Profile] Erro ao carregar perfis: {ex.Message}");
                _profiles = new List<GamerModels.GameProfile>();
            }
        }
    }
}

