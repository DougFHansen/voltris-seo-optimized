using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Helpers;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using GamerModels = VoltrisOptimizer.Services.Gamer.Models;

namespace VoltrisOptimizer.Services.Gamer.Implementation
{
    /// <summary>
    /// Implementação do detector de jogos
    /// </summary>
    public class GameDetectorService : IGameDetector
    {
        private readonly ILoggingService _logger;
        private readonly IGameLibraryService _library;
        private CancellationTokenSource? _monitorCts;
        private Task? _monitorTask;
        private readonly object _monitorLock = new();
        private GamerModels.DetectedGame? _lastRunningGame;

        /// <summary>
        /// Executáveis conhecidos de jogos populares
        /// </summary>
        private static readonly string[] KnownGameExecutables = new[]
        {
            "csgo", "cs2", "dota2", "lol", "leagueclient", "valorant", "valorant-win64-shipping",
            "fortnite", "fortniteclient-win64-shipping", "minecraft", "javaw",
            "gta5", "gtav", "rdr2", "witcher3", "cyberpunk2077",
            "apexlegends", "r5apex", "overwatchlauncher", "overwatch",
            "pubg", "tslgame", "eFootball", "fifa", "nba2k",
            "fallguys_client", "rocketleague", "destiny2", "steam",
            "warzone", "cod", "modernwarfare", "blackops"
        };

        /// <summary>
        /// Processos que NÃO são jogos
        /// CORREÇÃO: Removido "steam" para não bloquear jogos Steam que usam wrappers
        /// </summary>
        private static readonly string[] NonGameProcesses = new[]
        {
            "voltrisoptimizer", "code", "devenv", "explorer", "svchost",
            "csrss", "dwm", "taskmgr", "cmd", "powershell", "conhost",
            "chrome", "firefox", "edge", "msedge", "opera", "brave",
            "discord", "spotify", "epicgameslauncher", "origin",
            "eadesktop", "ubisoftconnect", "galaxyclient", "battlenet",
            "winpty-agent", "openconsole", "rg", "fd", "vsce-sign", "code-tunnel",
            "trae", "qoder", "mmc", "regedit", "notepad"
        };

        public event EventHandler<GamerModels.DetectedGame>? GameStarted;
        public event EventHandler<GamerModels.DetectedGame>? GameStopped;
        public bool IsMonitoring { get; private set; }

        public GameDetectorService(ILoggingService logger, IGameLibraryService library)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _library = library ?? throw new ArgumentNullException(nameof(library));
        }

        public async Task<IReadOnlyList<GamerModels.DetectedGame>> DetectInstalledGamesAsync(CancellationToken cancellationToken = default)
        {
            return await Task.Run(() =>
            {
                var games = new List<GamerModels.DetectedGame>();

                try
                {
                    _logger.LogInfo("[GameDetector] Iniciando detecção de jogos...");

                    // Caminhos comuns de instalação
                    var searchPaths = GetGameSearchPaths();

                    foreach (var path in searchPaths)
                    {
                        if (!Directory.Exists(path)) continue;

                        cancellationToken.ThrowIfCancellationRequested();

                        try
                        {
                            var detected = ScanDirectory(path);
                            games.AddRange(detected);
                        }
                        catch (OperationCanceledException) { throw; }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"[GameDetector] Erro ao escanear {path}: {ex.Message}");
                        }
                    }

                    // Detectar jogos em execução
                    var runningGames = DetectRunningGames();
                    foreach (var game in runningGames)
                    {
                        if (!games.Any(g => g.ExecutablePath.Equals(game.ExecutablePath, StringComparison.OrdinalIgnoreCase)))
                        {
                            games.Add(game);
                        }
                    }

                    // Remover duplicatas e filtrar
                    games = games
                        .Where(g => IsValidGame(g))
                        .GroupBy(g => g.ExecutablePath.ToLowerInvariant())
                        .Select(g => g.First())
                        .ToList();

                    _logger.LogSuccess($"[GameDetector] Detectados {games.Count} jogos");
                }
                catch (OperationCanceledException)
                {
                    _logger.LogInfo("[GameDetector] Detecção cancelada");
                }
                catch (Exception ex)
                {
                    _logger.LogError("[GameDetector] Erro na detecção de jogos", ex);
                }

                return games;
            }, cancellationToken);
        }

        private IEnumerable<string> GetGameSearchPaths()
        {
            var paths = new List<string>();
            
            // Steam
            var steamPaths = new[]
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Steam", "steamapps", "common"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Steam", "steamapps", "common"),
                @"C:\Program Files (x86)\Steam\steamapps\common",
                @"D:\Steam\steamapps\common",
                @"E:\Steam\steamapps\common"
            };
            paths.AddRange(steamPaths);

            // Epic Games
            paths.Add(@"C:\Program Files\Epic Games");
            paths.Add(@"C:\Program Files (x86)\Epic Games");
            paths.Add(@"D:\Epic Games");

            // GOG Galaxy
            paths.Add(@"C:\Program Files\GOG Galaxy\Games");
            paths.Add(@"C:\Program Files (x86)\GOG Galaxy\Games");
            paths.Add(@"D:\GOG Galaxy\Games");

            // Riot Games
            paths.Add(@"C:\Riot Games");
            paths.Add(@"D:\Riot Games");

            // Ubisoft
            paths.Add(@"C:\Program Files\Ubisoft");
            paths.Add(@"C:\Program Files (x86)\Ubisoft");

            // EA/Origin
            paths.Add(@"C:\Program Files\EA");
            paths.Add(@"C:\Program Files (x86)\Origin Games");

            // Xbox/Microsoft Store
            var xboxPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Packages");
            if (Directory.Exists(xboxPath)) paths.Add(xboxPath);

            return paths.Where(Directory.Exists).Distinct();
        }

        private List<GamerModels.DetectedGame> ScanDirectory(string directory)
        {
            var games = new List<GamerModels.DetectedGame>();

            foreach (var exePath in FileSystemHelper.EnumerateFilesIterative(directory, "*.exe", 4))
            {
                try
                {
                    var fileName = Path.GetFileNameWithoutExtension(exePath).ToLowerInvariant();
                    
                    // Ignorar instaladores e launchers
                    if (fileName.Contains("uninstall") || fileName.Contains("setup") ||
                        fileName.Contains("installer") || fileName.Contains("launcher") ||
                        fileName.Contains("updater") || fileName.Contains("crash") ||
                        fileName.Contains("helper") || fileName.Contains("service"))
                    {
                        continue;
                    }

                    var fileInfo = new FileInfo(exePath);
                    
                    // Jogos geralmente têm mais de 1MB
                    if (fileInfo.Length < 1024 * 1024) continue;

                    var launcher = DetectLauncher(exePath);
                    
                    games.Add(new GamerModels.DetectedGame
                    {
                        Name = FormatGameName(Path.GetFileNameWithoutExtension(exePath)),
                        ExecutablePath = exePath,
                        DetectedAt = DateTime.Now,
                        Size = fileInfo.Length,
                        Launcher = launcher
                    });
                }
                catch
                {
                    // Ignorar arquivos que não podem ser acessados
                }
            }

            return games.Take(100).ToList(); // Limitar para performance
        }

        private List<GamerModels.DetectedGame> DetectRunningGames()
        {
            var games = new List<GamerModels.DetectedGame>();

            foreach (var exeName in KnownGameExecutables)
            {
                try
                {
                    var processes = Process.GetProcessesByName(exeName);
                    foreach (var proc in processes)
                    {
                        try
                        {
                            var path = proc.MainModule?.FileName;
                            if (!string.IsNullOrEmpty(path) && IsGamePath(path))
                            {
                                games.Add(new GamerModels.DetectedGame
                                {
                                    Name = FormatGameName(proc.ProcessName),
                                    ExecutablePath = path,
                                    DetectedAt = DateTime.Now,
                                    Launcher = DetectLauncher(path)
                                });
                            }
                        }
                        catch { }
                        finally
                        {
                            proc.Dispose();
                        }
                    }
                }
                catch { }
            }

            return games;
        }

        private static GamerModels.GameLauncher DetectLauncher(string path)
        {
            var lowerPath = path.ToLowerInvariant();

            if (lowerPath.Contains("steamapps")) return GamerModels.GameLauncher.Steam;
            if (lowerPath.Contains("epic games")) return GamerModels.GameLauncher.EpicGames;
            if (lowerPath.Contains("gog galaxy")) return GamerModels.GameLauncher.GOG;
            if (lowerPath.Contains("ubisoft") || lowerPath.Contains("uplay")) return GamerModels.GameLauncher.Ubisoft;
            if (lowerPath.Contains("origin") || lowerPath.Contains("\\ea\\")) return GamerModels.GameLauncher.EA;
            if (lowerPath.Contains("riot games")) return GamerModels.GameLauncher.Riot;
            if (lowerPath.Contains("battle.net") || lowerPath.Contains("blizzard")) return GamerModels.GameLauncher.Blizzard;
            if (lowerPath.Contains("xbox") || lowerPath.Contains("windowsapps")) return GamerModels.GameLauncher.Xbox;

            return GamerModels.GameLauncher.Unknown;
        }

        private static string FormatGameName(string rawName)
        {
            // Converter "game_name" ou "GameName" para "Game Name"
            var name = rawName.Replace("_", " ").Replace("-", " ");
            
            // Adicionar espaços antes de maiúsculas (CamelCase)
            name = System.Text.RegularExpressions.Regex.Replace(name, "([a-z])([A-Z])", "$1 $2");
            
            // Capitalizar primeira letra de cada palavra
            return System.Globalization.CultureInfo.CurrentCulture.TextInfo.ToTitleCase(name.ToLower());
        }

        public bool IsKnownGame(string processName, string? executablePath = null)
        {
            var lowerName = processName.ToLowerInvariant();

            // Verificar se é um não-jogo
            if (NonGameProcesses.Contains(lowerName)) return false;

            // Verificar se é um jogo conhecido
            if (KnownGameExecutables.Any(g => lowerName.Contains(g))) return true;

            // Verificar caminho se disponível
            if (!string.IsNullOrEmpty(executablePath) && IsGamePath(executablePath)) return true;

            // Verificar na biblioteca
            if (_library.ContainsGame(executablePath ?? processName)) return true;

            return false;
        }

        private bool IsGamePath(string path)
        {
            return FileSystemHelper.IsGameDirectory(path);
        }

        private bool IsValidGame(GamerModels.DetectedGame game)
        {
            if (string.IsNullOrEmpty(game.ExecutablePath)) return false;
            if (string.IsNullOrEmpty(game.Name)) return false;
            
            var lowerName = game.Name.ToLowerInvariant();
            if (NonGameProcesses.Contains(lowerName)) return false;

            return IsGamePath(game.ExecutablePath) || game.Launcher != GamerModels.GameLauncher.Unknown;
        }

        public void StartMonitoring()
        {
            lock (_monitorLock)
            {
                if (IsMonitoring) return;

                _monitorCts = new CancellationTokenSource();
                var token = _monitorCts.Token;

                _monitorTask = Task.Run(async () =>
                {
                    _logger.LogInfo("[GameDetector] Monitoramento iniciado");

                    while (!token.IsCancellationRequested)
                    {
                        try
                        {
                            await Task.Delay(2000, token); // Reduzido para 2s para detecção mais rápida

                            // CORREÇÃO: Monitorar TODOS os processos primeiro, não apenas os da biblioteca
                            var processes = Process.GetProcesses();
                            GamerModels.DetectedGame? detectedGame = null;

                            foreach (var proc in processes)
                            {
                                try
                                {
                                    if (proc.HasExited) continue;

                                    string name = proc.ProcessName.ToLowerInvariant();

                                    // Ignorar processos conhecidos não jogos
                                    if (NonGameProcesses.Contains(name))
                                        continue;

                                    // Detecta se é jogo pela lista ou pelo caminho
                                    bool isKnown = KnownGameExecutables.Any(g => name.Contains(g));
                                    bool isValid = false;

                                    string exePath = "";

                                    try
                                    {
                                        exePath = proc.MainModule?.FileName ?? "";
                                        isValid = IsGamePath(exePath);
                                    }
                                    catch
                                    {
                                        // Alguns processos anti-cheat bloqueiam MainModule
                                        // Então tentamos detectar pelo nome
                                        isValid = isKnown;
                                    }

                                    if (!isKnown && !isValid)
                                        continue;

                                    // Se MainModule falhou, usar apenas nome do processo (mas ainda considerar válido se é conhecido)
                                    if (string.IsNullOrEmpty(exePath))
                                    {
                                        if (!isKnown)
                                            continue; // Se não é conhecido e não temos caminho, pular
                                        exePath = name; // Fallback para processos conhecidos sem MainModule
                                    }

                                    // Jogo válido detectado - usar este (priorizar o que já estava rodando se existir)
                                    if (detectedGame == null || 
                                        (_lastRunningGame != null && 
                                         exePath.Equals(_lastRunningGame.ExecutablePath, StringComparison.OrdinalIgnoreCase)))
                                    {
                                        detectedGame = new GamerModels.DetectedGame
                                        {
                                            Name = GetGameDisplayName(name, exePath),
                                            ExecutablePath = exePath,
                                            DetectedAt = DateTime.Now
                                        };
                                        
                                        // Se encontramos o jogo que já estava rodando, parar de procurar
                                        if (_lastRunningGame != null && 
                                            exePath.Equals(_lastRunningGame.ExecutablePath, StringComparison.OrdinalIgnoreCase))
                                        {
                                            break;
                                        }
                                    }
                                }
                                catch { }
                                finally
                                {
                                    proc.Dispose();
                                }
                            }

                            // Verificar mudança de jogo ou novo jogo
                            if (detectedGame != null)
                            {
                                if (_lastRunningGame == null ||
                                    !_lastRunningGame.ExecutablePath.Equals(detectedGame.ExecutablePath, StringComparison.OrdinalIgnoreCase))
                                {
                                    _lastRunningGame = detectedGame;
                                    _logger.LogInfo($"[GameDetector] Jogo detectado: {detectedGame.Name}");
                                    GameStarted?.Invoke(this, detectedGame);
                                }
                            }
                            else if (_lastRunningGame != null)
                            {
                                // Nenhum jogo detectado - verificar se o anterior ainda está rodando
                                bool stillRunning = false;
                                try
                                {
                                    var processName = Path.GetFileNameWithoutExtension(_lastRunningGame.ExecutablePath);
                                    if (!string.IsNullOrEmpty(processName))
                                    {
                                        stillRunning = Process.GetProcessesByName(processName)
                                            .Any(p => 
                                            {
                                                try
                                                {
                                                    var path = p.MainModule?.FileName ?? "";
                                                    var result = path.Equals(_lastRunningGame.ExecutablePath, StringComparison.OrdinalIgnoreCase);
                                                    p.Dispose();
                                                    return result;
                                                }
                                                catch
                                                {
                                                    p.Dispose();
                                                    return false;
                                                }
                                            });
                                    }
                                }
                                catch { }

                                if (!stillRunning)
                                {
                                    _logger.LogInfo($"[GameDetector] Jogo encerrado: {_lastRunningGame.Name}");
                                    GameStopped?.Invoke(this, _lastRunningGame);
                                    _lastRunningGame = null;
                                }
                            }
                        }
                        catch (OperationCanceledException) { break; }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"[GameDetector] Erro no monitoramento: {ex.Message}");
                        }
                    }

                    _logger.LogInfo("[GameDetector] Monitoramento parado");
                }, token);

                IsMonitoring = true;
            }
        }

        public void StopMonitoring()
        {
            lock (_monitorLock)
            {
                if (!IsMonitoring) return;

                try
                {
                    _monitorCts?.Cancel();
                    _monitorCts?.Dispose();
                    _monitorCts = null;
                    _monitorTask = null;
                    IsMonitoring = false;
                    _lastRunningGame = null;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[GameDetector] Erro ao parar monitoramento: {ex.Message}");
                }
            }
        }

        private static bool IsNonGameProcess(string processName)
        {
            return NonGameProcesses.Contains(processName.ToLowerInvariant());
        }

        /// <summary>
        /// Obtém o nome de exibição do jogo baseado no nome do processo ou caminho
        /// </summary>
        private string GetGameDisplayName(string processName, string executablePath)
        {
            // Primeiro tentar obter da biblioteca se disponível
            if (!string.IsNullOrEmpty(executablePath))
            {
                try
                {
                    var game = _library.GetAllGames()
                        .FirstOrDefault(g => g.ExecutablePath.Equals(executablePath, StringComparison.OrdinalIgnoreCase));
                    
                    if (game != null)
                        return game.Name;
                }
                catch { }
            }

            // Tentar formatar pelo nome do processo
            var displayName = FormatGameName(processName);

            // Mapear nomes conhecidos para nomes amigáveis
            var nameMap = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase)
            {
                { "valorant-win64-shipping", "Valorant" },
                { "valorant", "Valorant" },
                { "fortniteclient-win64-shipping", "Fortnite" },
                { "fortnite", "Fortnite" },
                { "csgo", "Counter-Strike: Global Offensive" },
                { "cs2", "Counter-Strike 2" },
                { "dota2", "Dota 2" },
                { "leagueclient", "League of Legends" },
                { "lol", "League of Legends" },
                { "javaw", "Minecraft" },
                { "minecraft", "Minecraft" },
                { "gta5", "Grand Theft Auto V" },
                { "gtav", "Grand Theft Auto V" },
                { "playgtav", "Grand Theft Auto V" },
                { "rdr2", "Red Dead Redemption 2" },
                { "r5apex", "Apex Legends" },
                { "apexlegends", "Apex Legends" },
                { "overwatch", "Overwatch" },
                { "overwatchlauncher", "Overwatch" },
                { "tslgame", "PUBG" },
                { "pubg", "PUBG" },
                { "witcher3", "The Witcher 3" },
                { "cyberpunk2077", "Cyberpunk 2077" },
                { "destiny2", "Destiny 2" },
                { "warzone", "Call of Duty: Warzone" },
                { "modernwarfare", "Call of Duty: Modern Warfare" }
            };

            if (nameMap.TryGetValue(processName, out var mappedName))
                return mappedName;

            return displayName;
        }
    }
}

