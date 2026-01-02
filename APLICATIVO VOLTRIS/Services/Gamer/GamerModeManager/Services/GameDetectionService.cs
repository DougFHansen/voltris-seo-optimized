using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Management;
using System.Threading;
using System.Threading.Tasks;

namespace VoltrisOptimizer.Services.Gamer.GamerModeManager
{
    /// <summary>
    /// Interface do serviço de detecção de jogos
    /// </summary>
    public interface IGameDetectionService : IDisposable
    {
        event EventHandler<GameDetectedEventArgs>? GameStarted;
        event EventHandler<GameDetectedEventArgs>? GameStopped;
        
        void Start(IEnumerable<string> processNames, int intervalMs = 2000);
        void Stop();
        bool IsRunning { get; }
        IReadOnlyList<string> GetMonitoredProcesses();
        void AddProcess(string processName);
        void RemoveProcess(string processName);
    }
    
    /// <summary>
    /// Serviço de detecção automática de jogos
    /// Monitora processos e dispara eventos quando jogos são iniciados/parados
    /// </summary>
    public class GameDetectionService : IGameDetectionService
    {
        private readonly ILoggingService _logger;
        private readonly HashSet<string> _monitoredProcesses = new(StringComparer.OrdinalIgnoreCase);
        private readonly Dictionary<string, int> _activeGames = new(StringComparer.OrdinalIgnoreCase);
        private Timer? _timer;
        private ManagementEventWatcher? _startWatcher;
        private ManagementEventWatcher? _stopWatcher;
        private bool _isRunning;
        private readonly object _lock = new();
        
        public event EventHandler<GameDetectedEventArgs>? GameStarted;
        public event EventHandler<GameDetectedEventArgs>? GameStopped;
        
        public bool IsRunning => _isRunning;
        
        // Lista de jogos conhecidos para detecção automática
        private static readonly HashSet<string> KnownGameProcesses = new(StringComparer.OrdinalIgnoreCase)
        {
            // Steam/Valve
            "steam", "steamwebhelper",
            
            // Epic Games
            "epicgameslauncher", "fortniteclient",
            
            // Battle.net
            "battle.net", "agent",
            
            // Popular Games
            "csgo", "cs2", "dota2", "valorant", "valorant-win64-shipping",
            "gta5", "gtav", "gta5.exe", "gtav.exe", "playgtav", "playgtav.exe",
            "rdr2", "reddeadredemption2", "eldenring", "darksouls3",
            "witcher3", "cyberpunk2077", "baldursgate3",
            "fortnite", "apex_legends", "leagueclient", "league of legends",
            "overwatch", "destiny2", "callofduty", "modernwarfare",
            "battlefield", "fifa", "nba2k", "rocketleague",
            "minecraft", "javaw", // Minecraft Java
            "rust", "pubg", "tarkov", "scum",
            "warframe", "path of exile", "pathofexile",
            "world of warcraft", "wow", "ffxiv", "finalfantasyxiv",
            "assassin's creed", "farcry", "watchdogs",
            "forza", "horizonzerodawn", "godofwar",
            "hogwartslegacy", "starfield", "residentevil",
            "monsterhunter", "devilmaycry", "sekiro",
            "deadspace", "deadisland", "dyinglight",
            "satisfactory", "valheim", "terraria",
            "ark", "conanexiles", "no man's sky"
        };
        
        public GameDetectionService(ILoggingService logger)
        {
            _logger = logger;
        }
        
        /// <summary>
        /// Inicia o monitoramento de processos
        /// </summary>
        public void Start(IEnumerable<string> processNames, int intervalMs = 2000)
        {
            lock (_lock)
            {
                if (_isRunning) return;
                
                // Adicionar processos customizados
                foreach (var name in processNames)
                {
                    _monitoredProcesses.Add(name.ToLowerInvariant());
                }
                
                // Adicionar jogos conhecidos
                foreach (var name in KnownGameProcesses)
                {
                    _monitoredProcesses.Add(name.ToLowerInvariant());
                }
                
                // Método 1: Timer para polling (mais confiável)
                _timer = new Timer(CheckProcesses, null, 0, intervalMs);
                
                // Método 2: WMI Events (mais eficiente, mas pode falhar)
                try
                {
                    SetupWmiWatchers();
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[GameDetection] WMI watchers não disponíveis: {ex.Message}");
                }
                
                _isRunning = true;
                _logger.LogInfo($"[GameDetection] Iniciado monitoramento de {_monitoredProcesses.Count} processos");
            }
        }
        
        /// <summary>
        /// Para o monitoramento
        /// </summary>
        public void Stop()
        {
            lock (_lock)
            {
                if (!_isRunning) return;
                
                _timer?.Dispose();
                _timer = null;
                
                _startWatcher?.Stop();
                _startWatcher?.Dispose();
                _startWatcher = null;
                
                _stopWatcher?.Stop();
                _stopWatcher?.Dispose();
                _stopWatcher = null;
                
                _activeGames.Clear();
                _isRunning = false;
                
                _logger.LogInfo("[GameDetection] Monitoramento parado");
            }
        }
        
        /// <summary>
        /// Obtém lista de processos monitorados
        /// </summary>
        public IReadOnlyList<string> GetMonitoredProcesses()
        {
            lock (_lock)
            {
                return _monitoredProcesses.ToList().AsReadOnly();
            }
        }
        
        /// <summary>
        /// Adiciona processo à lista de monitoramento
        /// </summary>
        public void AddProcess(string processName)
        {
            lock (_lock)
            {
                _monitoredProcesses.Add(processName.ToLowerInvariant());
            }
        }
        
        /// <summary>
        /// Remove processo da lista de monitoramento
        /// </summary>
        public void RemoveProcess(string processName)
        {
            lock (_lock)
            {
                _monitoredProcesses.Remove(processName.ToLowerInvariant());
            }
        }
        
        /// <summary>
        /// Verifica processos em execução
        /// CORREÇÃO: Melhorada detecção de jogos ao iniciar, incluindo GTA 5
        /// </summary>
        private void CheckProcesses(object? state)
        {
            try
            {
                // CORREÇÃO: Usar HashSet para verificação mais rápida
                var runningProcessNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
                var runningProcesses = new List<(string Name, int Id, string? Path)>();
                
                // CORREÇÃO: Verificar processos monitorados (incluindo variações)
                foreach (var monitoredName in _monitoredProcesses)
                {
                    try
                    {
                        // Tentar buscar sem extensão primeiro
                        var processes = Process.GetProcessesByName(monitoredName);
                        
                        // Se não encontrou, tentar com extensão .exe
                        if (processes.Length == 0 && !monitoredName.EndsWith(".exe"))
                        {
                            processes = Process.GetProcessesByName(monitoredName + ".exe");
                        }
                        
                        foreach (var proc in processes)
                        {
                            try
                            {
                                if (proc.HasExited) continue;
                                
                                var name = proc.ProcessName.ToLowerInvariant();
                                runningProcessNames.Add(name);
                                
                                // CORREÇÃO: Verificar se parece um jogo ANTES de adicionar à lista
                                if (IsLikelyGame(proc))
                                {
                                    string? path = null;
                                    try { path = proc.MainModule?.FileName; } catch { }
                                    
                                    runningProcesses.Add((name, proc.Id, path));
                                    
                                    _logger.LogInfo($"[GameDetection] Processo detectado: {name} (PID: {proc.Id}, Memória: {proc.WorkingSet64 / 1024 / 1024}MB)");
                                }
                                
                                proc.Dispose();
                            }
                            catch (Exception ex)
                            {
                                _logger.LogWarning($"[GameDetection] Erro ao processar processo: {ex.Message}");
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"[GameDetection] Erro ao buscar processo '{monitoredName}': {ex.Message}");
                    }
                }
                
                lock (_lock)
                {
                    // Verificar novos jogos
                    foreach (var proc in runningProcesses)
                    {
                        if (!_activeGames.ContainsKey(proc.Name))
                        {
                            _activeGames[proc.Name] = proc.Id;
                            OnGameStarted(proc.Name, proc.Path ?? "", proc.Id);
                        }
                    }
                    
                    // Verificar jogos encerrados
                    var stoppedGames = _activeGames.Keys.Where(name => !runningProcessNames.Contains(name)).ToList();
                    
                    foreach (var name in stoppedGames)
                    {
                        var pid = _activeGames[name];
                        _activeGames.Remove(name);
                        OnGameStopped(name, "", pid);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[GameDetection] Erro no check de processos: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Verifica se o processo parece ser um jogo
        /// CORREÇÃO: Melhorada lógica de detecção para GTA 5 e outros jogos
        /// </summary>
        private bool IsLikelyGame(Process? proc)
        {
            if (proc == null) return false;
            
            try
            {
                var processName = proc.ProcessName.ToLowerInvariant();
                
                // CORREÇÃO: Se está na lista de processos conhecidos, aceitar imediatamente
                // (mesmo que não passe em outras verificações, pode ser um jogo iniciando)
                if (_monitoredProcesses.Contains(processName))
                {
                    // Para processos conhecidos, ser mais permissivo
                    // Verificar apenas memória mínima (10MB ao invés de 50MB)
                    if (proc.WorkingSet64 < 10 * 1024 * 1024) // 10MB mínimo para processos conhecidos
                        return false;
                    
                    // Se é um processo conhecido, aceitar mesmo sem janela principal
                    // (alguns jogos podem não ter janela principal imediatamente)
                    return true;
                }
                
                // Para processos não conhecidos, usar verificações mais rigorosas
                // 1. Verificar memória (jogos usam pelo menos 50MB)
                if (proc.WorkingSet64 < 50 * 1024 * 1024) // 50MB mínimo
                    return false;
                
                // 2. Verificar se está em diretórios comuns de jogos OU tem janela principal
                try
                {
                    var path = proc.MainModule?.FileName?.ToLowerInvariant() ?? "";
                    
                    // Se está em diretório de jogo, aceitar imediatamente
                    if (path.Contains("steamapps") ||
                        path.Contains("epic games") ||
                        path.Contains("battle.net") ||
                        path.Contains("origin games") ||
                        path.Contains("ubisoft") ||
                        path.Contains("rockstar") ||
                        path.Contains("games") ||
                        path.Contains("game") ||
                        path.Contains("riot games") ||
                        path.Contains("valve") ||
                        path.Contains("common"))
                    {
                        return true;
                    }
                    
                    // Se tem janela principal E usa bastante memória, provavelmente é jogo
                    if (proc.MainWindowHandle != IntPtr.Zero && proc.WorkingSet64 > 100 * 1024 * 1024)
                    {
                        return true;
                    }
                }
                catch { }
                
                // Se não passou nos checks, não considerar como jogo
                return false;
            }
            catch
            {
                return false;
            }
        }
        
        /// <summary>
        /// Configura watchers WMI para eventos de processo
        /// </summary>
        private void SetupWmiWatchers()
        {
            // Watcher para processos iniciados
            var startQuery = new WqlEventQuery(
                "SELECT * FROM __InstanceCreationEvent WITHIN 1 WHERE TargetInstance ISA 'Win32_Process'");
            
            _startWatcher = new ManagementEventWatcher(startQuery);
            _startWatcher.EventArrived += OnProcessStarted;
            _startWatcher.Start();
            
            // Watcher para processos encerrados
            var stopQuery = new WqlEventQuery(
                "SELECT * FROM __InstanceDeletionEvent WITHIN 1 WHERE TargetInstance ISA 'Win32_Process'");
            
            _stopWatcher = new ManagementEventWatcher(stopQuery);
            _stopWatcher.EventArrived += OnProcessStopped;
            _stopWatcher.Start();
        }
        
        private void OnProcessStarted(object sender, EventArrivedEventArgs e)
        {
            try
            {
                var targetInstance = (ManagementBaseObject)e.NewEvent["TargetInstance"];
                var processName = targetInstance["Name"]?.ToString()?.Replace(".exe", "").ToLowerInvariant() ?? "";
                var processId = Convert.ToInt32(targetInstance["ProcessId"]);
                var commandLine = targetInstance["CommandLine"]?.ToString() ?? "";
                
                lock (_lock)
                {
                    if (_monitoredProcesses.Contains(processName) && !_activeGames.ContainsKey(processName))
                    {
                        _activeGames[processName] = processId;
                        
                        // Tentar extrair path do command line
                        var path = ExtractPathFromCommandLine(commandLine);
                        OnGameStarted(processName, path, processId);
                    }
                }
            }
            catch { }
        }
        
        private void OnProcessStopped(object sender, EventArrivedEventArgs e)
        {
            try
            {
                var targetInstance = (ManagementBaseObject)e.NewEvent["TargetInstance"];
                var processName = targetInstance["Name"]?.ToString()?.Replace(".exe", "").ToLowerInvariant() ?? "";
                var processId = Convert.ToInt32(targetInstance["ProcessId"]);
                
                lock (_lock)
                {
                    if (_activeGames.ContainsKey(processName) && _activeGames[processName] == processId)
                    {
                        _activeGames.Remove(processName);
                        OnGameStopped(processName, "", processId);
                    }
                }
            }
            catch { }
        }
        
        private void OnGameStarted(string name, string path, int pid)
        {
            _logger.LogInfo($"[GameDetection] Jogo iniciado: {name} (PID: {pid})");
            
            GameStarted?.Invoke(this, new GameDetectedEventArgs
            {
                GameName = name,
                ExecutablePath = path,
                ProcessId = pid,
                IsStarting = true
            });
        }
        
        private void OnGameStopped(string name, string path, int pid)
        {
            _logger.LogInfo($"[GameDetection] Jogo encerrado: {name} (PID: {pid})");
            
            GameStopped?.Invoke(this, new GameDetectedEventArgs
            {
                GameName = name,
                ExecutablePath = path,
                ProcessId = pid,
                IsStarting = false
            });
        }
        
        private string ExtractPathFromCommandLine(string commandLine)
        {
            if (string.IsNullOrEmpty(commandLine))
                return "";
            
            // Remove aspas e pega primeiro argumento
            var cleaned = commandLine.Trim().Trim('"');
            var firstSpace = cleaned.IndexOf(' ');
            
            if (firstSpace > 0)
                cleaned = cleaned.Substring(0, firstSpace);
            
            if (File.Exists(cleaned))
                return cleaned;
            
            return "";
        }
        
        public void Dispose()
        {
            Stop();
        }
    }
}

