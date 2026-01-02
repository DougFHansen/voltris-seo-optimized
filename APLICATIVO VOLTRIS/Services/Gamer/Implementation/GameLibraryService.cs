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
    /// Implementação do serviço de biblioteca de jogos
    /// </summary>
    public class GameLibraryService : IGameLibraryService
    {
        private readonly ILoggingService _logger;
        private readonly string _libraryPath;
        private List<GamerModels.DetectedGame> _games = new();
        private readonly object _lock = new();

        public GameLibraryService(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            
            var gamesDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Games");
            Directory.CreateDirectory(gamesDir);
            _libraryPath = Path.Combine(gamesDir, "library.json");
            
            Load();
        }

        public IReadOnlyList<GamerModels.DetectedGame> GetAllGames()
        {
            lock (_lock)
            {
                return _games.ToList().AsReadOnly();
            }
        }

        public bool AddGame(GamerModels.DetectedGame game)
        {
            if (game == null) return false;
            if (string.IsNullOrEmpty(game.ExecutablePath)) return false;
            
            // Validate the executable path
            try
            {
                var fullPath = Path.GetFullPath(game.ExecutablePath);
                // Just validate the path format, not necessarily if the file exists
            }
            catch
            {
                return false; // Invalid path format
            }

            lock (_lock)
            {
                // Verificar se já existe
                if (_games.Any(g => g.ExecutablePath.Equals(game.ExecutablePath, StringComparison.OrdinalIgnoreCase)))
                {
                    return false;
                }

                _games.Add(game);
                Save();
                _logger.LogInfo($"[Library] Jogo adicionado: {game.Name}");
                return true;
            }
        }

        public bool RemoveGame(string executablePath)
        {
            if (string.IsNullOrEmpty(executablePath)) return false;

            lock (_lock)
            {
                var game = _games.FirstOrDefault(g => 
                    g.ExecutablePath.Equals(executablePath, StringComparison.OrdinalIgnoreCase));
                
                if (game == null) return false;

                _games.Remove(game);
                Save();
                _logger.LogInfo($"[Library] Jogo removido: {game.Name}");
                return true;
            }
        }

        public bool RemoveGameByName(string gameName)
        {
            if (string.IsNullOrEmpty(gameName)) return false;

            lock (_lock)
            {
                var game = _games.FirstOrDefault(g => 
                    g.Name.Equals(gameName, StringComparison.OrdinalIgnoreCase));
                
                if (game == null) return false;

                _games.Remove(game);
                Save();
                _logger.LogInfo($"[Library] Jogo removido pelo nome: {game.Name}");
                return true;
            }
        }

        public void UpdateGameProfile(string gameName, GamerModels.GameProfile profile)
        {
            if (string.IsNullOrEmpty(gameName) || profile == null) return;

            lock (_lock)
            {
                var game = _games.FirstOrDefault(g => 
                    g.Name.Equals(gameName, StringComparison.OrdinalIgnoreCase));
                
                if (game != null)
                {
                    // Atualizar informações do perfil no jogo
                    game.HasProfile = true;
                    Save();
                    _logger.LogInfo($"[Library] Perfil atualizado para: {game.Name}");
                }
            }
        }

        public bool ContainsGame(string executablePath)
        {
            if (string.IsNullOrEmpty(executablePath)) return false;

            lock (_lock)
            {
                return _games.Any(g => 
                    g.ExecutablePath.Equals(executablePath, StringComparison.OrdinalIgnoreCase));
            }
        }

        public async Task<int> RefreshAsync(CancellationToken cancellationToken = default)
        {
            // Este método seria chamado após uma detecção de novos jogos
            return await Task.FromResult(_games.Count);
        }

        public void Save()
        {
            try
            {
                lock (_lock)
                {
                    var options = new JsonSerializerOptions 
                    { 
                        WriteIndented = true,
                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                    };
                    var json = JsonSerializer.Serialize(_games, options);
                    File.WriteAllText(_libraryPath, json);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("[Library] Erro ao salvar biblioteca", ex);
            }
        }

        public void Load()
        {
            try
            {
                if (!File.Exists(_libraryPath))
                {
                    _games = new List<GamerModels.DetectedGame>();
                    return;
                }

                lock (_lock)
                {
                    var json = File.ReadAllText(_libraryPath);
                    if (string.IsNullOrWhiteSpace(json) || json.Trim() == "[]" || json.Trim() == "")
                    {
                        _games = new List<GamerModels.DetectedGame>();
                        return;
                    }
                    
                    var options = new JsonSerializerOptions 
                    { 
                        PropertyNamingPolicy = JsonNamingPolicy.CamelCase 
                    };
                    _games = JsonSerializer.Deserialize<List<GamerModels.DetectedGame>>(json, options) ?? new List<GamerModels.DetectedGame>();
                    
                    // Validar e limpar entradas inválidas
                    _games = _games.Where(g => 
                    {
                        // Check if executable path is not null or empty
                        if (string.IsNullOrEmpty(g.ExecutablePath))
                            return false;
                        
                        // Check if it's a valid path format (basic validation)
                        try
                        {
                            // This will throw if it's not a valid path format
                            var path = Path.GetFullPath(g.ExecutablePath);
                            return true;
                        }
                        catch
                        {
                            return false;
                        }
                    }).ToList();
                    
                    _logger.LogInfo($"[Library] Carregados {_games.Count} jogos da biblioteca");
                }
            }
            catch (JsonException jsonEx)
            {
                _logger.LogWarning($"[Library] Erro de formato JSON ao carregar biblioteca: {jsonEx.Message}");
                _games = new List<GamerModels.DetectedGame>();
                // Recreate the file with empty array
                Save();
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[Library] Erro ao carregar biblioteca: {ex.Message}");
                _games = new List<GamerModels.DetectedGame>();
            }
        }
    }
}

