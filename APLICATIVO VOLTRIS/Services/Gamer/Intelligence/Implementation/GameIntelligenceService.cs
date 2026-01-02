using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services.Gamer.Intelligence.Interfaces;
using VoltrisOptimizer.Services.Gamer.Intelligence.Models;

namespace VoltrisOptimizer.Services.Gamer.Intelligence.Implementation
{
    /// <summary>
    /// Inteligência de jogos - perfis otimizados por jogo com ML simplificado
    /// </summary>
    public class GameIntelligenceService : IGameIntelligence
    {
        private readonly ILoggingService _logger;
        private readonly Dictionary<string, GameIntelligenceProfile> _gameProfiles;
        private readonly Dictionary<string, List<FrameTimeMetrics>> _gameMetricsHistory;
        private readonly string _profilesPath;

        public GameIntelligenceService(ILoggingService logger)
        {
            _logger = logger;
            _gameProfiles = InitializeBuiltInProfiles();
            _gameMetricsHistory = new Dictionary<string, List<FrameTimeMetrics>>();
            _profilesPath = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "VoltrisOptimizer", "GameProfiles");
            
            Directory.CreateDirectory(_profilesPath);
            LoadCustomProfiles();
        }

        private Dictionary<string, GameIntelligenceProfile> InitializeBuiltInProfiles()
        {
            return new Dictionary<string, GameIntelligenceProfile>(StringComparer.OrdinalIgnoreCase)
            {
                // FPS Competitivos - Prioridade: Input Lag
                ["cs2"] = CreateProfile("Counter-Strike 2", "cs2.exe", GameCategory.FPS, OptimizationPriority.InputLag,
                    cpuIntensity: GameIntensity.High, gpuIntensity: GameIntensity.Medium,
                    needsLowLatency: true, dscp: 46, ports: new[] { 27015, 27016, 27017, 27018, 27019, 27020 }),
                
                ["valorant"] = CreateProfile("VALORANT", "valorant.exe", GameCategory.FPS, OptimizationPriority.InputLag,
                    cpuIntensity: GameIntensity.Medium, gpuIntensity: GameIntensity.Low,
                    needsLowLatency: true, dscp: 46, ports: new[] { 7000, 8000 }),
                
                ["apex"] = CreateProfile("Apex Legends", "r5apex.exe", GameCategory.BattleRoyale, OptimizationPriority.InputLag,
                    cpuIntensity: GameIntensity.High, gpuIntensity: GameIntensity.High,
                    needsLowLatency: true, dscp: 46),
                
                ["overwatch"] = CreateProfile("Overwatch 2", "overwatch.exe", GameCategory.FPS, OptimizationPriority.InputLag,
                    cpuIntensity: GameIntensity.Medium, gpuIntensity: GameIntensity.Medium,
                    needsLowLatency: true, dscp: 46),
                
                ["rainbow6"] = CreateProfile("Rainbow Six Siege", "rainbowsix.exe", GameCategory.FPS, OptimizationPriority.InputLag,
                    cpuIntensity: GameIntensity.High, gpuIntensity: GameIntensity.Medium,
                    needsLowLatency: true, dscp: 46),

                // Battle Royale
                ["fortnite"] = CreateProfile("Fortnite", "fortniteclient-win64-shipping.exe", GameCategory.BattleRoyale, OptimizationPriority.InputLag,
                    cpuIntensity: GameIntensity.High, gpuIntensity: GameIntensity.High,
                    needsLowLatency: true, dscp: 46),
                
                ["pubg"] = CreateProfile("PUBG", "tslgame.exe", GameCategory.BattleRoyale, OptimizationPriority.InputLag,
                    cpuIntensity: GameIntensity.VeryHigh, gpuIntensity: GameIntensity.High,
                    needsLowLatency: true, dscp: 46),
                
                ["warzone"] = CreateProfile("Call of Duty: Warzone", "cod.exe", GameCategory.BattleRoyale, OptimizationPriority.InputLag,
                    cpuIntensity: GameIntensity.VeryHigh, gpuIntensity: GameIntensity.VeryHigh,
                    needsLowLatency: true, needsHighVram: true, dscp: 46),

                // MOBAs
                ["lol"] = CreateProfile("League of Legends", "league of legends.exe", GameCategory.MOBA, OptimizationPriority.InputLag,
                    cpuIntensity: GameIntensity.Low, gpuIntensity: GameIntensity.Low,
                    needsLowLatency: true, dscp: 46, ports: new[] { 5000, 5100, 8393, 8394 }),
                
                ["dota2"] = CreateProfile("Dota 2", "dota2.exe", GameCategory.MOBA, OptimizationPriority.InputLag,
                    cpuIntensity: GameIntensity.Medium, gpuIntensity: GameIntensity.Medium,
                    needsLowLatency: true, dscp: 46),

                // RPGs - Prioridade: Frame Stability
                ["cyberpunk"] = CreateProfile("Cyberpunk 2077", "cyberpunk2077.exe", GameCategory.RPG, OptimizationPriority.FrameStability,
                    cpuIntensity: GameIntensity.VeryHigh, gpuIntensity: GameIntensity.Extreme, vramIntensity: GameIntensity.Extreme,
                    needsStableFrameTime: true, needsHighVram: true, benefitsFromHags: true),
                
                ["eldenring"] = CreateProfile("Elden Ring", "eldenring.exe", GameCategory.RPG, OptimizationPriority.FrameStability,
                    cpuIntensity: GameIntensity.High, gpuIntensity: GameIntensity.High,
                    needsStableFrameTime: true),
                
                ["witcher3"] = CreateProfile("The Witcher 3", "witcher3.exe", GameCategory.RPG, OptimizationPriority.FrameStability,
                    cpuIntensity: GameIntensity.High, gpuIntensity: GameIntensity.VeryHigh,
                    needsStableFrameTime: true, needsHighVram: true),
                
                ["hogwarts"] = CreateProfile("Hogwarts Legacy", "hogwartslegacy.exe", GameCategory.RPG, OptimizationPriority.FrameStability,
                    cpuIntensity: GameIntensity.High, gpuIntensity: GameIntensity.Extreme, vramIntensity: GameIntensity.Extreme,
                    needsStableFrameTime: true, needsHighVram: true),

                // Racing
                ["forza"] = CreateProfile("Forza Horizon 5", "forzahorizon5.exe", GameCategory.Racing, OptimizationPriority.FrameStability,
                    cpuIntensity: GameIntensity.High, gpuIntensity: GameIntensity.VeryHigh,
                    needsStableFrameTime: true, benefitsFromHags: true),
                
                ["f1"] = CreateProfile("F1 2024", "f1_24.exe", GameCategory.Racing, OptimizationPriority.InputLag,
                    cpuIntensity: GameIntensity.High, gpuIntensity: GameIntensity.High,
                    needsLowLatency: true, needsStableFrameTime: true),

                // Simulação
                ["msfs"] = CreateProfile("Microsoft Flight Simulator", "flightsimulator.exe", GameCategory.Simulation, OptimizationPriority.FrameStability,
                    cpuIntensity: GameIntensity.Extreme, gpuIntensity: GameIntensity.Extreme, vramIntensity: GameIntensity.Extreme,
                    networkIntensity: GameIntensity.High, needsStableFrameTime: true, needsHighVram: true),

                // Indie/Leve
                ["minecraft"] = CreateProfile("Minecraft", "javaw.exe", GameCategory.Sandbox, OptimizationPriority.MaxFps,
                    cpuIntensity: GameIntensity.High, gpuIntensity: GameIntensity.Low),
                
                ["terraria"] = CreateProfile("Terraria", "terraria.exe", GameCategory.Sandbox, OptimizationPriority.MaxFps,
                    cpuIntensity: GameIntensity.Low, gpuIntensity: GameIntensity.VeryLow),

                // MMOs
                ["wow"] = CreateProfile("World of Warcraft", "wow.exe", GameCategory.MMO, OptimizationPriority.FrameStability,
                    cpuIntensity: GameIntensity.Medium, gpuIntensity: GameIntensity.Medium,
                    networkIntensity: GameIntensity.High, needsStableFrameTime: true),
                
                ["ff14"] = CreateProfile("Final Fantasy XIV", "ffxiv_dx11.exe", GameCategory.MMO, OptimizationPriority.FrameStability,
                    cpuIntensity: GameIntensity.Medium, gpuIntensity: GameIntensity.High,
                    needsStableFrameTime: true),

                // Estratégia
                ["aoe4"] = CreateProfile("Age of Empires IV", "reliccoregame.exe", GameCategory.Strategy, OptimizationPriority.FrameStability,
                    cpuIntensity: GameIntensity.VeryHigh, gpuIntensity: GameIntensity.Medium),
                
                ["civ6"] = CreateProfile("Civilization VI", "civilizationvi.exe", GameCategory.Strategy, OptimizationPriority.FrameStability,
                    cpuIntensity: GameIntensity.High, gpuIntensity: GameIntensity.Medium)
            };
        }

        private GameIntelligenceProfile CreateProfile(
            string name, string exe, GameCategory category, OptimizationPriority priority,
            GameIntensity cpuIntensity = GameIntensity.Medium,
            GameIntensity gpuIntensity = GameIntensity.Medium,
            GameIntensity vramIntensity = GameIntensity.Medium,
            GameIntensity networkIntensity = GameIntensity.Low,
            bool needsLowLatency = false,
            bool needsStableFrameTime = false,
            bool needsHighVram = false,
            bool benefitsFromHags = false,
            int dscp = 34,
            int[]? ports = null)
        {
            return new GameIntelligenceProfile
            {
                GameId = Path.GetFileNameWithoutExtension(exe).ToLowerInvariant(),
                GameName = name,
                ExecutableName = exe,
                Category = category,
                Priority = priority,
                CpuIntensity = cpuIntensity,
                GpuIntensity = gpuIntensity,
                VramIntensity = vramIntensity,
                NetworkIntensity = networkIntensity,
                NeedsLowLatency = needsLowLatency,
                NeedsStableFrameTime = needsStableFrameTime,
                NeedsHighVram = needsHighVram,
                BenefitsFromHAGS = benefitsFromHags,
                RecommendedDscp = dscp,
                KnownPorts = ports?.ToList() ?? new List<int>()
            };
        }

        private void LoadCustomProfiles()
        {
            try
            {
                var customFile = Path.Combine(_profilesPath, "custom_profiles.json");
                if (File.Exists(customFile))
                {
                    var json = File.ReadAllText(customFile);
                    var customs = JsonSerializer.Deserialize<List<GameIntelligenceProfile>>(json);
                    if (customs != null)
                    {
                        foreach (var profile in customs)
                        {
                            _gameProfiles[profile.GameId] = profile;
                        }
                        _logger.LogInfo($"[GameIntelligence] {customs.Count} perfis customizados carregados");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[GameIntelligence] Erro ao carregar perfis: {ex.Message}");
            }
        }

        public GameIntelligenceProfile? GetGameProfile(string gameNameOrExe)
        {
            var key = Path.GetFileNameWithoutExtension(gameNameOrExe).ToLowerInvariant();
            
            // Busca exata
            if (_gameProfiles.TryGetValue(key, out var profile))
                return profile;

            // Busca por nome parcial
            foreach (var p in _gameProfiles.Values)
            {
                if (p.GameName.Contains(gameNameOrExe, StringComparison.OrdinalIgnoreCase) ||
                    p.ExecutableName.Contains(gameNameOrExe, StringComparison.OrdinalIgnoreCase))
                    return p;
            }

            return null;
        }

        public GameCategory DetectGameCategory(string executablePath)
        {
            var exe = Path.GetFileName(executablePath).ToLowerInvariant();
            
            // Tenta match por perfil conhecido
            var profile = GetGameProfile(exe);
            if (profile != null)
                return profile.Category;

            // Heurística baseada no nome
            var name = Path.GetFileNameWithoutExtension(exe);
            
            if (ContainsAny(name, "shooter", "fps", "gun", "war", "combat", "battle"))
                return GameCategory.FPS;
            
            if (ContainsAny(name, "racing", "race", "drive", "car", "speed", "forza", "f1"))
                return GameCategory.Racing;
            
            if (ContainsAny(name, "rpg", "quest", "fantasy", "dragon", "souls", "ring"))
                return GameCategory.RPG;
            
            if (ContainsAny(name, "strategy", "civ", "empire", "age", "war"))
                return GameCategory.Strategy;
            
            if (ContainsAny(name, "sport", "fifa", "nba", "football", "soccer"))
                return GameCategory.Sports;

            return GameCategory.Unknown;
        }

        private bool ContainsAny(string text, params string[] terms) =>
            terms.Any(t => text.Contains(t, StringComparison.OrdinalIgnoreCase));

        public OptimizationStrategy GetGameStrategy(string gameNameOrExe, HardwareProfile hardware)
        {
            var gameProfile = GetGameProfile(gameNameOrExe);
            var strategy = new OptimizationStrategy
            {
                TargetClass = hardware.Classification,
                GameId = gameProfile?.GameId ?? ""
            };

            // Se não tiver perfil, usa estratégia genérica baseada no hardware
            if (gameProfile == null)
            {
                return GetGenericStrategy(hardware);
            }

            // Ajusta níveis baseado na intensidade do jogo vs capacidade do hardware
            strategy.CpuOptimizationLevel = CalculateOptimizationLevel(
                gameProfile.CpuIntensity, hardware.Cpu.CpuScore);
            
            strategy.GpuOptimizationLevel = CalculateOptimizationLevel(
                gameProfile.GpuIntensity, hardware.Gpu.GpuScore);
            
            strategy.MemoryOptimizationLevel = gameProfile.NeedsHighVram ? 3 : 2;
            
            strategy.NetworkOptimizationLevel = gameProfile.NeedsLowLatency ? 3 : 
                                                gameProfile.NetworkIntensity >= GameIntensity.High ? 2 : 1;

            // Flags específicos do jogo
            strategy.EnableQoS = gameProfile.NeedsLowLatency;
            strategy.EnableTimerResolution = gameProfile.Priority == OptimizationPriority.InputLag;
            strategy.EnableHags = gameProfile.BenefitsFromHAGS && hardware.Gpu.SupportsHAGS;
            strategy.EnableTdrTweaks = gameProfile.GpuIntensity >= GameIntensity.High && 
                                       hardware.Classification >= HardwareClass.High;
            
            strategy.EnableVramMonitor = gameProfile.NeedsHighVram;
            strategy.EnableThermalMonitor = hardware.IsLaptop;
            strategy.EnableAdaptiveGovernor = gameProfile.Priority == OptimizationPriority.FrameStability;

            _logger.LogInfo($"[GameIntelligence] Estratégia para {gameProfile.GameName}: " +
                        $"CPU={strategy.CpuOptimizationLevel}, GPU={strategy.GpuOptimizationLevel}");

            return strategy;
        }

        private int CalculateOptimizationLevel(GameIntensity intensity, int hardwareScore)
        {
            // Se o jogo é pesado mas hardware é fraco, otimiza mais agressivamente
            int intensityScore = (int)intensity * 20; // 0-100
            int delta = intensityScore - hardwareScore;

            return delta switch
            {
                > 40 => 3,  // Jogo muito pesado para o hardware
                > 20 => 2,  // Jogo pesado
                > 0 => 2,   // Jogo moderado
                _ => 1      // Hardware superior ao necessário
            };
        }

        private OptimizationStrategy GetGenericStrategy(HardwareProfile hardware)
        {
            return new OptimizationStrategy
            {
                TargetClass = hardware.Classification,
                CpuOptimizationLevel = hardware.Classification >= HardwareClass.High ? 2 : 1,
                GpuOptimizationLevel = hardware.Classification >= HardwareClass.High ? 2 : 1,
                NetworkOptimizationLevel = 2,
                MemoryOptimizationLevel = hardware.Ram.TotalGb >= 16 ? 2 : 3,
                EnableTimerResolution = hardware.Classification >= HardwareClass.Medium,
                EnableQoS = true,
                EnableAdaptiveGovernor = true
            };
        }

        public void RecordGameMetrics(string gameId, FrameTimeMetrics metrics)
        {
            if (!_gameMetricsHistory.ContainsKey(gameId))
                _gameMetricsHistory[gameId] = new List<FrameTimeMetrics>();

            var history = _gameMetricsHistory[gameId];
            history.Add(metrics);

            // Mantém apenas últimas 1000 amostras
            while (history.Count > 1000)
                history.RemoveAt(0);

            // Analisa padrões para aprendizado
            if (history.Count >= 100)
            {
                AnalyzeAndLearn(gameId, history);
            }
        }

        private void AnalyzeAndLearn(string gameId, List<FrameTimeMetrics> history)
        {
            // Calcula métricas agregadas
            var avgStutterRatio = history.Average(m => m.StutterRatio);
            var avgJitter = history.Average(m => m.JitterMs);
            var avgFps = history.Average(m => m.Fps);

            // Se temos perfil, ajusta baseado no histórico
            if (_gameProfiles.TryGetValue(gameId, out var profile))
            {
                // Se muitos stutters, aumenta prioridade de estabilidade
                if (avgStutterRatio > 0.1)
                {
                    profile.NeedsStableFrameTime = true;
                    _logger.LogInfo($"[GameIntelligence] Aprendizado: {gameId} precisa de frame time estável");
                }

                // Se baixo FPS, pode precisar de mais otimização de RAM
                if (avgFps < 30)
                {
                    profile.NeedsHighVram = true;
                    _logger.LogInfo($"[GameIntelligence] Aprendizado: {gameId} pode ter gargalo de memória");
                }
            }
        }

        public Dictionary<string, string> GetRecommendedSettings(string gameId, HardwareProfile hardware)
        {
            var settings = new Dictionary<string, string>();
            var profile = GetGameProfile(gameId);

            if (profile == null)
                return settings;

            // Recomendações baseadas no hardware
            switch (hardware.Classification)
            {
                case HardwareClass.UltraLow:
                case HardwareClass.Low:
                    settings["Resolution"] = "1280x720";
                    settings["Quality"] = "Low";
                    settings["VSync"] = "Off";
                    settings["Shadows"] = "Off";
                    settings["AntiAliasing"] = "Off";
                    settings["RayTracing"] = "Off";
                    break;

                case HardwareClass.Medium:
                    settings["Resolution"] = "1920x1080";
                    settings["Quality"] = "Medium";
                    settings["VSync"] = profile.NeedsLowLatency ? "Off" : "On";
                    settings["Shadows"] = "Medium";
                    settings["AntiAliasing"] = "FXAA";
                    settings["RayTracing"] = "Off";
                    break;

                case HardwareClass.High:
                    settings["Resolution"] = "1920x1080";
                    settings["Quality"] = "High";
                    settings["VSync"] = profile.NeedsLowLatency ? "Off" : "On";
                    settings["Shadows"] = "High";
                    settings["AntiAliasing"] = "TAA";
                    settings["RayTracing"] = hardware.Gpu.SupportsRayTracing ? "Low" : "Off";
                    settings["DLSS/FSR"] = hardware.Gpu.SupportsDLSS ? "Quality" : 
                                          hardware.Gpu.SupportsFSR ? "Quality" : "Off";
                    break;

                case HardwareClass.Ultra:
                case HardwareClass.Enthusiast:
                    settings["Resolution"] = hardware.Gpu.VramMb >= 10000 ? "2560x1440" : "1920x1080";
                    settings["Quality"] = "Ultra";
                    settings["VSync"] = profile.NeedsLowLatency ? "Off" : "On";
                    settings["Shadows"] = "Ultra";
                    settings["AntiAliasing"] = "TAA";
                    settings["RayTracing"] = hardware.Gpu.SupportsRayTracing ? "Ultra" : "Off";
                    settings["DLSS/FSR"] = hardware.Gpu.SupportsDLSS ? "Balanced" : 
                                          hardware.Gpu.SupportsFSR ? "Balanced" : "Off";
                    break;
            }

            // Ajustes específicos por categoria
            if (profile.Priority == OptimizationPriority.InputLag)
            {
                settings["VSync"] = "Off";
                settings["FrameLimit"] = "Unlimited";
                settings["ReduceInputLatency"] = "On";
            }

            return settings;
        }
    }
}

