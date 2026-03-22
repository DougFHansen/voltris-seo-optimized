using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Management;
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
        
        // Watchers WMI para detecção em tempo real via kernel
        private ManagementEventWatcher? _startWatcher;
        private ManagementEventWatcher? _stopWatcher;
        private readonly SemaphoreSlim _wmiLock = new(1, 1);

        // Listas migradas para GameDatabase para melhor manutenção
        private static readonly HashSet<string> KnownGames = Gamer.Data.GameDatabase.KnownGames;
        private static readonly HashSet<string> SystemProcesses = Gamer.Data.GameDatabase.SystemProcesses;

        public event EventHandler<GamerModels.DetectedGame>? GameStarted;
        public event EventHandler<GamerModels.DetectedGame>? GameStopped;
        public bool IsMonitoring { get; private set; }

        public event EventHandler<GameDetectionProgress>? ProgressChanged;
        protected virtual void OnProgressChanged(GameDetectionProgress e)
        {
            ProgressChanged?.Invoke(this, e);
        }

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
                    OnProgressChanged(new GameDetectionProgress { Status = "Iniciando detecção...", PercentComplete = 0, GamesFound = 0 });

                    var searchPaths = GetGameSearchPaths().ToList();
                    int totalPaths = searchPaths.Count;
                    int pathsProcessed = 0;

                    foreach (var path in searchPaths)
                    {
                        if (!Directory.Exists(path)) continue;

                        cancellationToken.ThrowIfCancellationRequested();

                        pathsProcessed++;
                        OnProgressChanged(new GameDetectionProgress
                        {
                            Status = $"Escaneando: {Path.GetFileName(path)}...",
                            PercentComplete = (int)((double)pathsProcessed / totalPaths * 100),
                            GamesFound = games.Count
                        });

                        try
                        {
                            // 1. Detecção Inteligente via AppManifest (Steam)
                            if (path.EndsWith("common", StringComparison.OrdinalIgnoreCase))
                            {
                                var steamAppsPath = Path.GetDirectoryName(path);
                                if (!string.IsNullOrEmpty(steamAppsPath) && Directory.Exists(steamAppsPath))
                                {
                                    var steamGames = DetectSteamGamesFromManifests(steamAppsPath);
                                    foreach (var sg in steamGames)
                                    {
                                        if (!games.Any(existing => existing.ExecutablePath.Equals(sg.ExecutablePath, StringComparison.OrdinalIgnoreCase)))
                                            games.Add(sg);
                                    }
                                }
                            }

                            // 2. Scan de Diretório (Geral) - Profundidade aumentada para 8
                            var detected = ScanDirectory(path, 8);
                            games.AddRange(detected);
                        }
                        catch (OperationCanceledException) { throw; }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"[GameDetector] Erro ao escanear {path}: {ex.Message}");
                        }
                    }

                    // Detectar jogos em execução
                    OnProgressChanged(new GameDetectionProgress { Status = "Detectando jogos em execução...", PercentComplete = 90, GamesFound = games.Count });
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
                    OnProgressChanged(new GameDetectionProgress { Status = "Detecção concluída!", PercentComplete = 100, GamesFound = games.Count });
                }
                catch (OperationCanceledException)
                {
                    _logger.LogInfo("[GameDetector] Detecção cancelada");
                    OnProgressChanged(new GameDetectionProgress { Status = "Detecção cancelada.", PercentComplete = 0, GamesFound = games.Count });
                }
                catch (Exception ex)
                {
                    _logger.LogError("[GameDetector] Erro na detecção de jogos", ex);
                    OnProgressChanged(new GameDetectionProgress { Status = "Erro na detecção.", PercentComplete = 0, GamesFound = games.Count });
                }

                return games;
            }, cancellationToken);
        }

        private IEnumerable<string> GetGameSearchPaths()
        {
            var paths = new List<string>();
            
            // Adicionar diretórios de jogo padrão para cada drive fixo
            foreach (var drive in DriveInfo.GetDrives().Where(d => d.DriveType == DriveType.Fixed && d.IsReady))
            {
                var driveRoot = drive.RootDirectory.FullName;

                // Steam
                paths.Add(Path.Combine(driveRoot, "Program Files", "Steam"));
                paths.Add(Path.Combine(driveRoot, "Program Files (x86)", "Steam"));
                paths.Add(Path.Combine(driveRoot, "Steam"));
                paths.Add(Path.Combine(driveRoot, "SteamLibrary"));

                // Epic
                paths.Add(Path.Combine(driveRoot, "Program Files", "Epic Games"));
                paths.Add(Path.Combine(driveRoot, "Program Files (x86)", "Epic Games"));
                paths.Add(Path.Combine(driveRoot, "Epic Games"));
                paths.Add(Path.Combine(driveRoot, "EpicGames"));

                // GOG
                paths.Add(Path.Combine(driveRoot, "Program Files", "GOG Galaxy", "Games"));
                paths.Add(Path.Combine(driveRoot, "Program Files (x86)", "GOG Galaxy", "Games"));
                paths.Add(Path.Combine(driveRoot, "GOG Galaxy", "Games"));
                paths.Add(Path.Combine(driveRoot, "GOG Games"));

                // Riot
                paths.Add(Path.Combine(driveRoot, "Riot Games"));

                // Ubisoft
                paths.Add(Path.Combine(driveRoot, "Program Files", "Ubisoft", "Ubisoft Game Launcher", "games"));
                paths.Add(Path.Combine(driveRoot, "Program Files (x86)", "Ubisoft", "Ubisoft Game Launcher", "games"));
                paths.Add(Path.Combine(driveRoot, "Ubisoft Games"));

                // EA / Origin
                paths.Add(Path.Combine(driveRoot, "Program Files", "EA Games"));
                paths.Add(Path.Combine(driveRoot, "Program Files (x86)", "Origin Games"));
                paths.Add(Path.Combine(driveRoot, "EA Games"));

                // Outros diretórios comuns de jogos
                paths.Add(Path.Combine(driveRoot, "Games"));
                paths.Add(Path.Combine(driveRoot, "Jogos"));
                paths.Add(Path.Combine(driveRoot, "GameLibrary"));
            }
            
            // Xbox/Microsoft Store (caminho fixo no AppData)
            var xboxPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Packages");
            if (Directory.Exists(xboxPath)) paths.Add(xboxPath);

            // Adicionar também o caminho da biblioteca Steam via VDF (é mais preciso)
            paths.AddRange(GetSteamLibraryPaths());
            
            return paths.Where(Directory.Exists).Distinct().ToList();
        }

        /// <summary>
        /// Detecta todas as bibliotecas Steam usando libraryfolders.vdf
        /// </summary>
        private List<string> GetSteamLibraryPaths()
        {
            var paths = new List<string>();
            var commonPaths = new[]
            {
                @"C:\Program Files (x86)\Steam",
                @"C:\Program Files\Steam",
                @"D:\Steam",
                @"E:\Steam"
            };

            // Tentar localizar a instalação principal do Steam
            string? steamPath = null;
            
            // 1. Tentar via registro
            try
            {
                using var key = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(@"Software\Valve\Steam");
                if (key?.GetValue("SteamPath") is string regPath)
                {
                    steamPath = regPath.Replace("/", "\\");
                }
            }
            catch { }

            // 2. Tentar caminhos comuns se registro falhar
            if (string.IsNullOrEmpty(steamPath))
            {
                foreach (var path in commonPaths)
                {
                    if (Directory.Exists(path))
                    {
                        steamPath = path;
                        break;
                    }
                }
            }

            if (string.IsNullOrEmpty(steamPath)) return paths;

            // Adicionar biblioteca principal
            var mainLib = Path.Combine(steamPath, "steamapps", "common");
            if (Directory.Exists(mainLib)) paths.Add(mainLib);

            // Ler libraryfolders.vdf para bibliotecas adicionais
            try
            {
                var vdfPath = Path.Combine(steamPath, "steamapps", "libraryfolders.vdf");
                if (File.Exists(vdfPath))
                {
                    var content = File.ReadAllText(vdfPath);
                    // Parsing simples de VDF (busca por "path" "...")
                    var lines = content.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
                    foreach (var line in lines)
                    {
                        if (line.Trim().StartsWith("\"path\""))
                        {
                            var parts = line.Split(new[] { '"' }, StringSplitOptions.RemoveEmptyEntries);
                            if (parts.Length >= 4)
                            {
                                var libraryPath = parts[3].Replace("\\\\", "\\");
                                var commonPath = Path.Combine(libraryPath, "steamapps", "common");
                                if (Directory.Exists(commonPath))
                                {
                                    paths.Add(commonPath);
                                }
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[GameDetector] Erro ao ler libraryfolders.vdf: {ex.Message}");
            }

            return paths;
        }

        /// <summary>
        /// Detecta jogos Steam lendo os arquivos appmanifest_*.acf
        /// Isso é muito mais rápido e preciso que o scan de arquivos
        /// </summary>
        private List<GamerModels.DetectedGame> DetectSteamGamesFromManifests(string steamAppsPath)
        {
            var games = new List<GamerModels.DetectedGame>();
            try
            {
                var manifestFiles = Directory.GetFiles(steamAppsPath, "appmanifest_*.acf");
                foreach (var manifest in manifestFiles)
                {
                    try
                    {
                        var content = File.ReadAllText(manifest);
                        string? name = null;
                        string? installDir = null;

                        var lines = content.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
                        foreach (var line in lines)
                        {
                            var trimmed = line.Trim();
                            if (trimmed.StartsWith("\"name\""))
                            {
                                var parts = trimmed.Split(new[] { '"' }, StringSplitOptions.RemoveEmptyEntries);
                                if (parts.Length >= 2) name = parts[^1];
                            }
                            else if (trimmed.StartsWith("\"installdir\""))
                            {
                                var parts = trimmed.Split(new[] { '"' }, StringSplitOptions.RemoveEmptyEntries);
                                if (parts.Length >= 2) installDir = parts[^1];
                            }
                        }

                        if (!string.IsNullOrEmpty(name) && !string.IsNullOrEmpty(installDir))
                        {
                            var fullPath = Path.Combine(steamAppsPath, "common", installDir);
                            if (Directory.Exists(fullPath))
                            {
                                // Localizar o executável principal dentro da pasta
                                var exes = FileSystemHelper.EnumerateFilesIterative(fullPath, "*.exe", 3);
                                // Prioriza o maior exe ou que contenha o nome do jogo
                                var mainExe = exes.OrderByDescending(f => 
                                    (Path.GetFileNameWithoutExtension(f).ToLower().Contains(name.ToLower().Replace(" ", "")) ? 1000 : 0) + 
                                    new FileInfo(f).Length / 1024 / 1024
                                ).FirstOrDefault();

                                if (mainExe != null)
                                {
                                    games.Add(new GamerModels.DetectedGame
                                    {
                                        Name = name,
                                        ExecutablePath = mainExe,
                                        DetectedAt = DateTime.Now,
                                        Launcher = GamerModels.GameLauncher.Steam
                                    });
                                }
                            }
                        }
                    }
                    catch { }
                }
            }
            catch { }
            return games;
        }

        private List<GamerModels.DetectedGame> ScanDirectory(string directory, int maxDepth = 4)
        {
            var games = new List<GamerModels.DetectedGame>();

            foreach (var exePath in FileSystemHelper.EnumerateFilesIterative(directory, "*.exe", maxDepth))
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

                    foreach (var exeName in KnownGames)
                    {
                        try
                        {
                            var processes = Process.GetProcessesByName(exeName);
                            foreach (var proc in processes)
                            {
                                try
                                {
                                    var path = proc.MainModule?.FileName;
                                    // Para jogos conhecidos, não exigir IsGamePath - confiar na lista KnownGames
                                    if (!string.IsNullOrEmpty(path))
                                    {
                                        games.Add(new GamerModels.DetectedGame
                                        {
                                            Name = FormatGameName(proc.ProcessName),
                                            ExecutablePath = path,
                                            DetectedAt = DateTime.Now,
                                            Launcher = DetectLauncher(path)
                                        });
                                        _logger.LogSuccess($"[GameDetector] 🎮 Jogo em execução detectado: {FormatGameName(proc.ProcessName)} (PID: {proc.Id})");
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
            if (SystemProcesses.Contains(lowerName)) return false;

            // Verificar se é um jogo conhecido
            if (KnownGames.Contains(lowerName)) return true;

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
            if (SystemProcesses.Contains(lowerName)) return false;

            return IsGamePath(game.ExecutablePath) || game.Launcher != GamerModels.GameLauncher.Unknown;
        }

        public void StartMonitoring()
                {
                    lock (_monitorLock)
                    {
                        if (IsMonitoring) return;
                        IsMonitoring = true;

                        _monitorCts = new CancellationTokenSource();
                        var token = _monitorCts.Token;

                        // 1. Iniciar Watchers WMI (Kernel Events) - Real-time
                        InitializeWmiWatchers();

                        // 2. SCAN INICIAL: Detectar jogos que já estão rodando ANTES de iniciar o monitoramento
                        Task.Run(async () =>
                        {
                            try
                            {
                                _logger.LogInfo("[GameDetector] 🔍 Executando scan inicial para detectar jogos já em execução...");
                                await Task.Delay(2000, token); // Aguardar 2s para WMI inicializar
                                await FullSyncRunningGamesAsync(token);
                                _logger.LogInfo("[GameDetector] ✅ Scan inicial concluído");
                            }
                            catch (Exception ex)
                            {
                                _logger.LogWarning($"[GameDetector] ⚠️ Erro no scan inicial: {ex.Message}");
                            }
                        }, token);

                        // 3. Fallback Task: Sincronização periódica (10s) para garantir consistência
                        _monitorTask = Task.Run(async () =>
                        {
                            _logger.LogInfo("[GameDetector] Monitoramento híbrido iniciado");

                            while (!token.IsCancellationRequested)
                            {
                                try
                                {
                                    // Reduzido de 30s para 10s para detecção mais rápida
                                    await Task.Delay(TimeSpan.FromSeconds(10), token);

                                    // Sincronização de estado (Verificar se o jogo registrado ainda existe)
                                    await FullSyncRunningGamesAsync(token);
                                }
                                catch (OperationCanceledException) { break; }
                                catch (Exception ex)
                                {
                                    _logger.LogWarning($"[GameDetector] Erro no Fallback Poll: {ex.Message}");
                                }
                            }

                            _logger.LogInfo("[GameDetector] Monitoramento parado");
                        }, token);
                    }
                }

        private void InitializeWmiWatchers()
        {
            try
            {
                // Início de processo
                _startWatcher = new ManagementEventWatcher(new WqlEventQuery("SELECT * FROM Win32_ProcessStartTrace"));
                _startWatcher.EventArrived += (s, e) =>
                {
                    var processName = e.NewEvent.Properties["ProcessName"]?.Value?.ToString();
                    var processID = (uint)(e.NewEvent.Properties["ProcessID"]?.Value ?? 0);
                    if (!string.IsNullOrEmpty(processName))
                    {
                        _ = HandleProcessStartedAsync(processName, processID);
                    }
                };
                _startWatcher.Start();

                // Término de processo
                _stopWatcher = new ManagementEventWatcher(new WqlEventQuery("SELECT * FROM Win32_ProcessStopTrace"));
                _stopWatcher.EventArrived += (s, e) =>
                {
                    var processName = e.NewEvent.Properties["ProcessName"]?.Value?.ToString();
                    if (!string.IsNullOrEmpty(processName))
                    {
                        _ = HandleProcessStoppedAsync(processName);
                    }
                };
                _stopWatcher.Start();

                _logger.LogInfo("[GameDetector] WMI Process Watchers iniciados com sucesso.");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[GameDetector] Falha ao iniciar WMI. Modo degradação (polling lento) ativo. Erro: {ex.Message}");
            }
        }

        private async Task HandleProcessStartedAsync(string processName, uint pid)
        {
            await _wmiLock.WaitAsync();
            try
            {
                string nameLower = processName.Replace(".exe", "").ToLowerInvariant();
                
                if (SystemProcesses.Contains(nameLower))
                {
                    // Silencioso para processos do sistema para não poluir o log
                    return;
                }

                // Não re-detectar se já temos o jogo ativo e é o mesmo
                if (_lastRunningGame != null && nameLower.Equals(Path.GetFileNameWithoutExtension(_lastRunningGame.ExecutablePath), StringComparison.OrdinalIgnoreCase))
                {
                    return;
                }

                bool isKnown = KnownGames.Contains(nameLower);
                
                // Log apenas para processos que passaram pelo filtro de sistema
                _logger.LogInfo($"[GameDetector] 🔍 Processo detectado: '{processName}' (PID: {pid}) -> Nome normalizado: '{nameLower}'");
                
                try
                {
                    using var proc = pid > 0 ? Process.GetProcessById((int)pid) : Process.GetProcessesByName(nameLower).FirstOrDefault();
                    if (proc == null || proc.HasExited)
                    {
                        // Se o processo já saiu (comum com git/wsl), ignoramos silenciosamente
                        return;
                    }
                    
                    string exePath = "";
                    try { exePath = proc.MainModule?.FileName ?? ""; } catch { }
                    
                    _logger.LogInfo($"[GameDetector] 📁 Caminho do executável: '{exePath}'");

                    if (isKnown || (!string.IsNullOrEmpty(exePath) && IsGamePath(exePath)))
                    {
                        // Última barreira: rejeitar executáveis que são runtimes/browsers/helpers
                        // mesmo que o caminho contenha "games" (ex: msedgewebview2 em C:\Games\Launcher\...)
                        var exeNameOnly = Path.GetFileNameWithoutExtension(exePath).ToLowerInvariant();
                        if (!isKnown && FileSystemHelper.IsKnownNonGameExecutable(exeNameOnly))
                        {
                            _logger.LogInfo($"[GameDetector] ⏭️ Processo '{nameLower}' ignorado — executável de runtime/browser em pasta de jogos.");
                            return;
                        }
                        var detected = new GamerModels.DetectedGame
                        {
                            Name = GetGameDisplayName(nameLower, exePath),
                            ExecutablePath = string.IsNullOrEmpty(exePath) ? nameLower : exePath,
                            DetectedAt = DateTime.Now,
                            Launcher = string.IsNullOrEmpty(exePath) ? GamerModels.GameLauncher.Unknown : DetectLauncher(exePath)
                        };

                        _lastRunningGame = detected;
                        _logger.LogSuccess($"[GameDetector] ✅ JOGO INICIADO (WMI/Sync): {detected.Name}");
                        _logger.LogSuccess($"[GameDetector] 🚀 Disparando evento GameStarted para '{detected.Name}'");
                        GameStarted?.Invoke(this, detected);
                        _logger.LogSuccess($"[GameDetector] ✅ Evento GameStarted disparado com sucesso");
                    }
                    else
                    {
                        _logger.LogInfo($"[GameDetector] ⏭️ Processo '{nameLower}' não é um jogo (isKnown={isKnown}, IsGamePath={!string.IsNullOrEmpty(exePath) && IsGamePath(exePath)})");
                    }
                    
                    if (pid == 0) proc.Dispose(); // Se pegamos por nome no Sync, descartar
                }
                catch (Exception ex)
                {
                    // Ignorar erros de processos que terminaram rapidamente (race condition normal)
                    // Processos como reg.exe, netsh.exe, powercfg.exe, fsutil.exe são de curta duração
                    if (ex.Message.Contains("is not running") || ex is System.ComponentModel.Win32Exception)
                    {
                        // Log apenas em nível de debug para não poluir os logs
                        // _logger.LogDebug($"[GameDetector] Processo '{nameLower}' terminou antes da análise completa");
                        return; // Silenciosamente ignorar
                    }
                    
                    _logger.LogWarning($"[GameDetector] ⚠️ Erro ao processar '{nameLower}': {ex.Message}");
                }
            }
            finally { _wmiLock.Release(); }
        }

        private async Task HandleProcessStoppedAsync(string processName)
        {
            await _wmiLock.WaitAsync();
            try
            {
                if (_lastRunningGame == null) return;

                string stoppedName = processName.Replace(".exe", "").ToLowerInvariant();
                string activeName = Path.GetFileNameWithoutExtension(_lastRunningGame.ExecutablePath).ToLowerInvariant();

                if (stoppedName == activeName)
                {
                    // Delay para confirmar se não foi um restart/crash loop
                    await Task.Delay(1500);
                    
                    var procs = Process.GetProcessesByName(stoppedName);
                    if (procs.Length == 0)
                    {
                        _logger.LogInfo($"[GameDetector] Jogo encerrado: {_lastRunningGame.Name}");
                        GameStopped?.Invoke(this, _lastRunningGame);
                        _lastRunningGame = null;
                    }
                    else
                    {
                        foreach (var p in procs) p.Dispose();
                    }
                }
            }
            finally { _wmiLock.Release(); }
        }

        private async Task FullSyncRunningGamesAsync(CancellationToken token)
                {
                    // Sincronização de estado em background (polling lento para redundância)
                    if (_lastRunningGame != null)
                    {
                        try
                        {
                            string processName = Path.GetFileNameWithoutExtension(_lastRunningGame.ExecutablePath);
                            var procs = Process.GetProcessesByName(processName);
                            if (procs.Length == 0)
                            {
                                _logger.LogWarning($"[GameDetector] Sincronismo Detectado: Jogo {_lastRunningGame.Name} não está mais rodando.");
                                await HandleProcessStoppedAsync(processName + ".exe");
                            }
                            else
                            {
                                foreach (var p in procs) p.Dispose();
                            }
                        }
                        catch { }
                    }

                    // SEMPRE fazer scan para detectar jogos que já estavam rodando
                    // Isso é crítico para detectar jogos iniciados antes do app
                    var running = DetectRunningGames();
                    if (running.Count > 0)
                    {
                        // Se não há jogo ativo, ativar o primeiro encontrado
                        if (_lastRunningGame == null)
                        {
                            var game = running[0];
                            _logger.LogInfo($"[GameDetector] 🔍 Scan detectou jogo já em execução: {game.Name}");
                            await HandleProcessStartedAsync(Path.GetFileName(game.ExecutablePath), 0);
                        }
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
                    
                    // Cleanup WMI
                    if (_startWatcher != null) { try { _startWatcher.Stop(); _startWatcher.Dispose(); } catch { } }
                    if (_stopWatcher != null) { try { _stopWatcher.Stop(); _stopWatcher.Dispose(); } catch { } }
                    
                    _monitorCts?.Dispose();
                    _monitorCts = null;
                    _monitorTask = null;
                    IsMonitoring = false;
                    _lastRunningGame = null;
                    
                    _logger.LogInfo("[GameDetector] Monitoramento WMI e Fallback desativados.");
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[GameDetector] Erro ao parar monitoramento: {ex.Message}");
                }
            }
        }

        private static bool IsNonGameProcess(string processName)
        {
            return SystemProcesses.Contains(processName.ToLowerInvariant());
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

