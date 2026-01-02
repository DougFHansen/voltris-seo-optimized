using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Serviço profissional e inteligente de detecção de jogos
    /// Utiliza lógica HÍBRIDA para detectar jogos:
    /// - Detecção Heurística: Fullscreen Exclusivo (para jogos modernos)
    /// - Detecção por Lista Manual: Processos em foco que estão na lista (para jogos em janela)
    /// </summary>
    public class GameDetectionService : IDisposable
    {
        private readonly ILoggingService? _logger;
        private CancellationTokenSource? _cancellationTokenSource;
        private Task? _monitoringTask;
        private readonly HashSet<int> _detectedGameProcessIds = new HashSet<int>();
        private readonly object _lockObject = new object();
        private bool _isMonitoring = false;
        
        // Lista manual de processos de jogos (case-insensitive)
        private readonly HashSet<string> _manualGameProcessList = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
        private readonly string _manualGamesListPath;

        /// <summary>
        /// Evento disparado quando um jogo é detectado/iniciado
        /// </summary>
        public event EventHandler<GameDetectedEventArgs>? OnGameStarted;

        /// <summary>
        /// Evento disparado quando um jogo é encerrado
        /// </summary>
        public event EventHandler<GameStoppedEventArgs>? OnGameStopped;

        public GameDetectionService(ILoggingService? logger = null)
        {
            _logger = logger;
            
            // Caminho para o arquivo de lista manual de jogos
            var gamesDirectory = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Games");
            Directory.CreateDirectory(gamesDirectory);
            _manualGamesListPath = Path.Combine(gamesDirectory, "manual_games_list.json");
            
            // Carregar lista manual de jogos
            LoadManualGamesList();
            
            // Adicionar alguns jogos conhecidos por padrão
            InitializeDefaultGames();
        }
        
        /// <summary>
        /// Carrega a lista manual de jogos do arquivo JSON
        /// </summary>
        private void LoadManualGamesList()
        {
            try
            {
                if (File.Exists(_manualGamesListPath))
                {
                    var json = File.ReadAllText(_manualGamesListPath);
                    var gameList = JsonSerializer.Deserialize<List<string>>(json);
                    if (gameList != null)
                    {
                        foreach (var gameName in gameList)
                        {
                            if (!string.IsNullOrWhiteSpace(gameName))
                            {
                                // Adicionar com e sem .exe
                                var name = gameName.Trim();
                                _manualGameProcessList.Add(name);
                                if (!name.EndsWith(".exe", StringComparison.OrdinalIgnoreCase))
                                {
                                    _manualGameProcessList.Add(name + ".exe");
                                }
                            }
                        }
                        _logger?.LogInfo($"📋 Lista manual carregada: {_manualGameProcessList.Count} jogos");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger?.LogWarning($"Erro ao carregar lista manual de jogos: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Salva a lista manual de jogos no arquivo JSON
        /// </summary>
        private void SaveManualGamesList()
        {
            try
            {
                // Remover duplicatas (.exe e sem .exe)
                var uniqueNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
                foreach (var name in _manualGameProcessList)
                {
                    var cleanName = name.EndsWith(".exe", StringComparison.OrdinalIgnoreCase) 
                        ? name.Substring(0, name.Length - 4) 
                        : name;
                    uniqueNames.Add(cleanName);
                }
                
                var json = JsonSerializer.Serialize(uniqueNames.ToList(), new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_manualGamesListPath, json);
                _logger?.LogInfo($"💾 Lista manual salva: {uniqueNames.Count} jogos");
            }
            catch (Exception ex)
            {
                _logger?.LogError($"Erro ao salvar lista manual de jogos: {ex.Message}", ex);
            }
        }
        
        /// <summary>
        /// Inicializa alguns jogos conhecidos por padrão
        /// 
        /// ═══════════════════════════════════════════════════════════════
        /// 📝 ONDE ADICIONAR JOGOS MANUALMENTE:
        /// ═══════════════════════════════════════════════════════════════
        /// 
        /// MÉTODO 1 (Recomendado): Editar o arquivo JSON
        ///   Caminho: bin\Debug\net8.0-windows\Games\manual_games_list.json
        ///   Formato: ["main", "hl2", "csgo", "fortnite"]
        ///   Nota: Não precisa incluir .exe, o sistema adiciona automaticamente
        /// 
        /// MÉTODO 2: Adicionar no código abaixo (neste array)
        ///   Adicione o nome do processo (sem .exe) no array defaultGames
        ///   Exemplo: "main", "hl2", "csgo", "fortnite"
        /// 
        /// MÉTODO 3: Usar o método AddManualGame() programaticamente
        ///   App.GameDetectionService?.AddManualGame("nomeDoProcesso");
        /// 
        /// ═══════════════════════════════════════════════════════════════
        /// </summary>
        private void InitializeDefaultGames()
        {
            // ═══════════════════════════════════════════════════════════
            // 📝 ADICIONE SEUS JOGOS AQUI (para detecção em modo janela)
            // ═══════════════════════════════════════════════════════════
            // 
            // Adicione o nome do processo (sem .exe) neste array.
            // O sistema automaticamente adiciona também com .exe.
            // 
            // Exemplos:
            // - "main" para Mu Online (main.exe)
            // - "hl2" para Half-Life 2 (hl2.exe)
            // - "csgo" para CS:GO (csgo.exe)
            // - "fortnite" para Fortnite (FortniteClient-Win64-Shipping.exe)
            //
            // ═══════════════════════════════════════════════════════════
            
            var defaultGames = new[]
            {
                "main",        // Mu Online (main.exe - minúsculo)
                "Main",        // Mu Online (Main.exe - maiúsculo)
                // Adicione mais jogos aqui:
                // "hl2",
                // "csgo",
                // "fortnite",
            };
            
            bool hasNewGames = false;
            foreach (var game in defaultGames)
            {
                if (!_manualGameProcessList.Contains(game))
                {
                    _manualGameProcessList.Add(game);
                    hasNewGames = true;
                }
            }
            
            if (hasNewGames)
            {
                SaveManualGamesList();
            }
        }
        
        /// <summary>
        /// Adiciona um processo à lista manual de jogos
        /// Use este método para adicionar jogos que rodam em modo janela
        /// </summary>
        public void AddManualGame(string processName)
        {
            if (string.IsNullOrWhiteSpace(processName))
                return;
                
            var name = processName.Trim();
            lock (_lockObject)
            {
                _manualGameProcessList.Add(name);
                if (!name.EndsWith(".exe", StringComparison.OrdinalIgnoreCase))
                {
                    _manualGameProcessList.Add(name + ".exe");
                }
            }
            
            SaveManualGamesList();
            _logger?.LogInfo($"➕ Jogo adicionado à lista manual: {name}");
        }
        
        /// <summary>
        /// Remove um processo da lista manual de jogos
        /// </summary>
        public void RemoveManualGame(string processName)
        {
            if (string.IsNullOrWhiteSpace(processName))
                return;
                
            var name = processName.Trim();
            lock (_lockObject)
            {
                _manualGameProcessList.Remove(name);
                _manualGameProcessList.Remove(name + ".exe");
                _manualGameProcessList.Remove(name.Replace(".exe", ""));
            }
            
            SaveManualGamesList();
            _logger?.LogInfo($"➖ Jogo removido da lista manual: {name}");
        }
        
        /// <summary>
        /// Retorna a lista atual de jogos manuais
        /// </summary>
        public List<string> GetManualGamesList()
        {
            lock (_lockObject)
            {
                // Remover duplicatas (.exe e sem .exe)
                var uniqueNames = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
                foreach (var name in _manualGameProcessList)
                {
                    var cleanName = name.EndsWith(".exe", StringComparison.OrdinalIgnoreCase) 
                        ? name.Substring(0, name.Length - 4) 
                        : name;
                    uniqueNames.Add(cleanName);
                }
                return uniqueNames.ToList();
            }
        }

        /// <summary>
        /// Inicia o monitoramento em segundo plano
        /// </summary>
        public void StartMonitoring()
        {
            lock (_lockObject)
            {
                if (_isMonitoring)
                {
                    _logger?.LogWarning("⚠️ GameDetectionService já está monitorando!");
                    return;
                }

                _isMonitoring = true;
                _cancellationTokenSource = new CancellationTokenSource();
                _monitoringTask = Task.Run(() => MonitorGamesAsync(_cancellationTokenSource.Token), _cancellationTokenSource.Token);
                
                _logger?.LogInfo("🎮 GameDetectionService iniciado - Monitoramento ativo");
            }
        }

        /// <summary>
        /// Para o monitoramento
        /// </summary>
        public void StopMonitoring()
        {
            lock (_lockObject)
            {
                if (!_isMonitoring)
                    return;

                _isMonitoring = false;
                _cancellationTokenSource?.Cancel();
                
                try
                {
                    _monitoringTask?.Wait(TimeSpan.FromSeconds(2));
                }
                catch { }

                _cancellationTokenSource?.Dispose();
                _cancellationTokenSource = null;
                
                _logger?.LogInfo("🛑 GameDetectionService parado");
            }
        }

        public bool IsMonitoring
        {
            get { lock (_lockObject) { return _isMonitoring; } }
        }

        /// <summary>
        /// Loop principal de monitoramento
        /// </summary>
        private async Task MonitorGamesAsync(CancellationToken cancellationToken)
        {
            while (!cancellationToken.IsCancellationRequested)
            {
                try
                {
                    // CORREÇÃO CRÍTICA: Aumentar intervalo para reduzir overhead
                    // ANTES: 1s idle / 10s active = 2-4% CPU overhead
                    // DEPOIS: 5s idle / 30s active = <1% CPU overhead
                    var interval = _detectedGameProcessIds.Count > 0 
                        ? 30000  // 30s quando jogo já detectado (evita polling desnecesário)
                        : 5000;  // 5s quando procurando jogos (balanço entre detecção rápida e performance)
                    
                    await Task.Delay(interval, cancellationToken);

                    // Obter processo em primeiro plano
                    var foregroundProcess = GetForegroundProcess();
                    if (foregroundProcess == null)
                        continue;

                    // Verificar se já está sendo monitorado
                    lock (_lockObject)
                    {
                        if (_detectedGameProcessIds.Contains(foregroundProcess.Id))
                            continue;
                    }

                    var processName = foregroundProcess.ProcessName;
                    var processNameWithExe = processName + ".exe";
                    
                    // OTIMIZAÇÃO: Usar HashSet lookup (O(1)) em vez de LINQ .Any (O(n))
                    int score = ComputeGameScore(foregroundProcess);
                    bool isDetected = score >= 70;
                    string detectionMethod = isDetected ? $"Score={score}" : "";
                    if (!isDetected)
                    {
                        lock (_lockObject)
                        {
                            // CORREÇÃO: Verificação otimizada usando HashSet
                            bool isInList = _manualGameProcessList.Contains(processName) ||
                                           _manualGameProcessList.Contains(processNameWithExe);
                            
                            if (isInList && ValidateAsGame(foregroundProcess))
                            {
                                int manualScore = ComputeGameScore(foregroundProcess);
                                if (manualScore >= 50)
                                {
                                    isDetected = true;
                                    detectionMethod = $"Lista Manual Score={manualScore}";
                                }
                            }
                        }
                    }
                    
                    // Se detectado, disparar evento
                    if (isDetected)
                    {
                        _logger?.LogInfo($"🎮 Jogo detectado via {detectionMethod}: {processName}");
                        OnGameDetected(foregroundProcess, detectionMethod);
                    }

                    // Verificar jogos previamente detectados que foram encerrados
                    try
                    {
                        List<int> toRemove = new List<int>();
                        lock (_lockObject)
                        {
                            foreach (var pid in _detectedGameProcessIds)
                            {
                                try
                                {
                                    var p = Process.GetProcessById(pid);
                                    if (p == null || p.HasExited)
                                    {
                                        toRemove.Add(pid);
                                    }
                                }
                                catch
                                {
                                    toRemove.Add(pid);
                                }
                            }
                            foreach (var pid in toRemove) _detectedGameProcessIds.Remove(pid);
                        }
                        foreach (var pid in toRemove)
                        {
                            try
                            {
                                OnGameStopped?.Invoke(this, new GameStoppedEventArgs { ProcessName = "", ProcessId = pid });
                            }
                            catch { }
                        }
                    }
                    catch { }
                }
                catch (OperationCanceledException)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger?.LogWarning($"Erro no monitoramento de jogos: {ex.Message}");
                    await Task.Delay(5000, cancellationToken); // Aguardar mais tempo em caso de erro
                }
            }
        }

        private int ComputeGameScore(Process process)
        {
            int score = 0;
            if (process == null || process.HasExited) return 0;
            var path = GetProcessPath(process)?.ToLowerInvariant() ?? string.Empty;
            if (!string.IsNullOrEmpty(path))
            {
                if (path.Contains("steamapps\\common") || path.Contains("\\epic games\\") || path.Contains("\\gog galaxy\\games\\") || path.Contains("\\riot games\\") || path.Contains("\\ubisoft\\"))
                {
                    score += 50;
                }
                if (path.Contains("\\appdata\\local\\programs\\"))
                {
                    score -= 20;
                }
            }
            bool exclusive = IsExclusiveFullScreen(process);
            bool borderless = IsFullscreenOrBorderless(process);
            if (exclusive) score += 30;
            if (borderless) score += 25;
            int moduleHits = 0;
            int overlayHits = 0;
            try
            {
                foreach (ProcessModule? m in process.Modules)
                {
                    if (m == null) continue;
                    var name = System.IO.Path.GetFileName(m.FileName).ToLowerInvariant();
                    if (name.Contains("d3d11") || name.Contains("d3d12") || name.Contains("dxgi") || name.Contains("vulkan")) moduleHits++;
                    if (name.Contains("unityplayer") || name.Contains("unreal") || name.Contains("cry") || name.Contains("sdl2")) moduleHits++;
                    if (name.Contains("gameoverlayrenderer")) overlayHits++;
                    if (name.Contains("chrome") || name.Contains("libcef") || name.Contains("electron")) score -= 20;
                }
            }
            catch { }
            score += Math.Min(moduleHits * 5, 20);
            score += Math.Min(overlayHits * 10, 20);
            try
            {
                IntPtr hWnd = process.MainWindowHandle;
                if (hWnd == IntPtr.Zero) hWnd = FindMainWindow((uint)process.Id);
                if (hWnd != IntPtr.Zero)
                {
                    var cls = GetWindowClass(hWnd)?.ToLowerInvariant() ?? string.Empty;
                    if (cls.Contains("unity") || cls.Contains("unreal") || cls.Contains("sdl") || cls.Contains("glfw")) score += 15;
                }
            }
            catch { }
            if (!ValidateAsGame(process)) score = 0;
            return Math.Max(0, score);
        }

        /// <summary>
        /// Obtém o processo em primeiro plano (foreground)
        /// </summary>
        private Process? GetForegroundProcess()
        {
            try
            {
                IntPtr hWnd = GetForegroundWindow();
                if (hWnd == IntPtr.Zero)
                    return null;

                GetWindowThreadProcessId(hWnd, out uint processId);
                if (processId == 0)
                    return null;

                return Process.GetProcessById((int)processId);
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// Verifica se o processo está em modo Fullscreen Exclusivo
        /// Esta é a técnica mais confiável para detectar jogos
        /// </summary>
        private bool IsExclusiveFullScreen(Process process)
        {
            try
            {
                if (process.HasExited)
                    return false;

                IntPtr hWnd = process.MainWindowHandle;
                if (hWnd == IntPtr.Zero)
                {
                    // Tentar encontrar a janela principal
                    hWnd = FindMainWindow((uint)process.Id);
                    if (hWnd == IntPtr.Zero)
                        return false;
                }

                // Verificar se a janela está visível
                if (!IsWindowVisible(hWnd))
                    return false;

                // Obter dimensões da janela
                if (!GetWindowRect(hWnd, out RECT windowRect))
                    return false;

                // Obter dimensões da tela primária
                int screenWidth = GetSystemMetrics(SM_CXSCREEN);
                int screenHeight = GetSystemMetrics(SM_CYSCREEN);

                // Verificar se a janela cobre toda a tela (com margem mínima)
                int windowWidth = windowRect.Right - windowRect.Left;
                int windowHeight = windowRect.Bottom - windowRect.Top;

                // Fullscreen exclusivo geralmente cobre 99.9% da tela
                bool coversScreen = windowWidth >= screenWidth - 5 && windowHeight >= screenHeight - 5;

                // Verificar estilo da janela (fullscreen exclusivo não tem bordas)
                int style = GetWindowLong(hWnd, GWL_STYLE);
                bool hasNoBorders = (style & WS_BORDER) == 0 && (style & WS_CAPTION) == 0;

                // Verificar se está maximizado
                WINDOWPLACEMENT placement = new WINDOWPLACEMENT();
                placement.length = Marshal.SizeOf(placement);
                bool isMaximized = GetWindowPlacement(hWnd, ref placement) && placement.showCmd == SW_SHOWMAXIMIZED;

                // É fullscreen exclusivo se cobre a tela E não tem bordas
                return coversScreen && hasNoBorders && (isMaximized || windowWidth == screenWidth);
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Verifica se o processo está em modo fullscreen ou borderless fullscreen
        /// </summary>
        private bool IsFullscreenOrBorderless(Process process)
        {
            try
            {
                if (process.HasExited)
                    return false;

                IntPtr hWnd = process.MainWindowHandle;
                if (hWnd == IntPtr.Zero)
                {
                    hWnd = FindMainWindow((uint)process.Id);
                    if (hWnd == IntPtr.Zero)
                        return false;
                }

                if (!IsWindowVisible(hWnd))
                    return false;

                if (!GetWindowRect(hWnd, out RECT windowRect))
                    return false;

                int screenWidth = GetSystemMetrics(SM_CXSCREEN);
                int screenHeight = GetSystemMetrics(SM_CYSCREEN);

                int windowWidth = windowRect.Right - windowRect.Left;
                int windowHeight = windowRect.Bottom - windowRect.Top;

                // Verificar se ocupa >= 95% da tela
                double coverageWidth = (double)windowWidth / screenWidth;
                double coverageHeight = (double)windowHeight / screenHeight;

                return coverageWidth >= 0.95 && coverageHeight >= 0.95;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Verifica se o processo tem características de jogo
        /// (DLLs de jogos, uso intensivo de recursos, etc.)
        /// </summary>
        private bool HasGameCharacteristics(Process process)
        {
            try
            {
                if (process.HasExited)
                    return false;

                // Verificar DLLs de jogos
                var gameDLLs = new[]
                {
                    "d3d11.dll", "d3d12.dll", "dxgi.dll", "d3d9.dll",
                    "vulkan-1.dll", "vulkan32.dll", "vulkan64.dll",
                    "steam_api.dll", "steam_api64.dll",
                    "eos_sdk.dll", "battlenet.dll", "riotclient.dll"
                };

                try
                {
                    foreach (ProcessModule? module in process.Modules)
                    {
                        if (module == null) continue;
                        var moduleName = System.IO.Path.GetFileName(module.FileName).ToLowerInvariant();
                        if (gameDLLs.Any(dll => moduleName.Contains(dll, StringComparison.OrdinalIgnoreCase)))
                        {
                            return true;
                        }
                    }
                }
                catch { }

                var processPath = GetProcessPath(process)?.ToLowerInvariant() ?? string.Empty;
                if (!string.IsNullOrEmpty(processPath))
                {
                    if (processPath.Contains("steamapps\\common") ||
                        processPath.Contains("\\epic games\\") ||
                        processPath.Contains("\\gog galaxy\\games\\") ||
                        processPath.Contains("\\riot games\\") ||
                        processPath.Contains("\\ubisoft\\"))
                    {
                        return true;
                    }
                }

                return false;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Valida se o processo realmente parece ser um jogo (evita falsos positivos)
        /// </summary>
        private bool ValidateAsGame(Process process)
        {
            try
            {
                if (process.HasExited)
                    return false;

                var processName = process.ProcessName.ToLowerInvariant();
                var processPath = GetProcessPath(process);

                // Ignorar processos do sistema
                var systemProcesses = new[]
                {
                    "explorer", "dwm", "winlogon", "csrss", "lsass", "services",
                    "svchost", "chrome", "firefox", "edge", "notepad", "calc"
                };

                if (systemProcesses.Contains(processName))
                    return false;

                var nonGames = new[]
                {
                    "voltrisoptimizer", "trae", "devenv", "code", "powershell",
                    "cmd", "dotnet", "discord", "teams", "slack"
                };
                if (nonGames.Contains(processName))
                    return false;

                // Ignorar se estiver em pastas do sistema
                if (!string.IsNullOrEmpty(processPath))
                {
                    var pathLower = processPath.ToLowerInvariant();
                    if (pathLower.Contains("\\windows\\") || 
                        pathLower.Contains("\\system32\\") || 
                        pathLower.Contains("\\syswow64\\"))
                    {
                        return false;
                    }
                }

                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Chamado quando um jogo é detectado
        /// </summary>
        private void OnGameDetected(Process process, string detectionMethod = "Desconhecido")
        {
            try
            {
                lock (_lockObject)
                {
                    if (_detectedGameProcessIds.Contains(process.Id))
                        return;

                    _detectedGameProcessIds.Add(process.Id);
                }

                var processName = process.ProcessName;
                var processPath = GetProcessPath(process);
                var gameName = ExtractGameName(processName, processPath);

                _logger?.LogInfo($"🎮 Jogo detectado: {gameName} (PID: {process.Id})");

                // Disparar evento
                OnGameStarted?.Invoke(this, new GameDetectedEventArgs
                {
                    Process = process,
                    ProcessName = processName,
                    ProcessId = process.Id,
                    GameName = gameName,
                    ProcessPath = processPath
                });
            }
            catch (Exception ex)
            {
                _logger?.LogError($"Erro ao processar jogo detectado: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Extrai o nome do jogo de forma inteligente
        /// </summary>
        private string ExtractGameName(string processName, string? processPath)
        {
            // Tentar extrair do caminho primeiro
            if (!string.IsNullOrEmpty(processPath))
            {
                try
                {
                    // Steam: ...\steamapps\common\NomeDoJogo\executable.exe
                    if (processPath.Contains("steamapps\\common", StringComparison.OrdinalIgnoreCase))
                    {
                        var parts = processPath.Split(new[] { '\\', '/' }, StringSplitOptions.RemoveEmptyEntries);
                        var commonIndex = Array.FindIndex(parts, p => p.Equals("common", StringComparison.OrdinalIgnoreCase));
                        if (commonIndex >= 0 && commonIndex < parts.Length - 1)
                        {
                            return parts[commonIndex + 1];
                        }
                    }

                    // Tentar pegar do diretório pai
                    var dir = System.IO.Path.GetDirectoryName(processPath);
                    if (!string.IsNullOrEmpty(dir))
                    {
                        var dirName = System.IO.Path.GetFileName(dir);
                        if (!string.IsNullOrEmpty(dirName) && dirName != processName)
                        {
                            return dirName;
                        }
                    }
                }
                catch { }
            }

            // Fallback: formatar nome do processo
            if (processName.EndsWith(".exe", StringComparison.OrdinalIgnoreCase))
            {
                processName = processName.Substring(0, processName.Length - 4);
            }

            if (processName.Length > 0)
            {
                return char.ToUpperInvariant(processName[0]) + processName.Substring(1);
            }

            return processName;
        }

        /// <summary>
        /// Obtém caminho do processo de forma segura
        /// </summary>
        private string? GetProcessPath(Process process)
        {
            try
            {
                return process.MainModule?.FileName;
            }
            catch
            {
                try
                {
                    using var searcher = new System.Management.ManagementObjectSearcher(
                        $"SELECT ExecutablePath FROM Win32_Process WHERE ProcessId = {process.Id}");
                    foreach (System.Management.ManagementObject obj in searcher.Get())
                    {
                        return obj["ExecutablePath"]?.ToString();
                    }
                }
                catch { }
            }

            return null;
        }

        /// <summary>
        /// Encontra a janela principal de um processo
        /// </summary>
        private IntPtr FindMainWindow(uint processId)
        {
            IntPtr mainWindow = IntPtr.Zero;
            var windows = new List<IntPtr>();

            EnumWindows((hWnd, lParam) =>
            {
                GetWindowThreadProcessId(hWnd, out uint windowProcessId);
                if (windowProcessId == processId && IsWindowVisible(hWnd))
                {
                    windows.Add(hWnd);
                }
                return true;
            }, IntPtr.Zero);

            // Retornar a maior janela (provavelmente a principal)
            if (windows.Count > 0)
            {
                mainWindow = windows.OrderByDescending(hWnd =>
                {
                    if (GetWindowRect(hWnd, out RECT rect))
                    {
                        return (rect.Right - rect.Left) * (rect.Bottom - rect.Top);
                    }
                    return 0;
                }).First();
            }

            return mainWindow;
        }

        public void Dispose()
        {
            StopMonitoring();
        }

        #region Win32 API P/Invoke

        [DllImport("user32.dll")]
        private static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll")]
        private static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

        [DllImport("user32.dll")]
        private static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);

        [DllImport("user32.dll")]
        private static extern bool IsWindowVisible(IntPtr hWnd);

        [DllImport("user32.dll")]
        private static extern int GetWindowLong(IntPtr hWnd, int nIndex);

        [DllImport("user32.dll")]
        private static extern bool GetWindowPlacement(IntPtr hWnd, ref WINDOWPLACEMENT lpwndpl);

        [DllImport("user32.dll")]
        private static extern int GetSystemMetrics(int nIndex);

        [DllImport("user32.dll", CharSet = CharSet.Unicode)]
        private static extern int GetClassName(IntPtr hWnd, System.Text.StringBuilder lpClassName, int nMaxCount);

        [DllImport("user32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool EnumWindows(EnumWindowsProc enumProc, IntPtr lParam);

        private delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);

        private const int GWL_STYLE = -16;
        private const int WS_BORDER = 0x00800000;
        private const int WS_CAPTION = 0x00C00000;
        private const uint SW_SHOWMAXIMIZED = 3;
        private const int SM_CXSCREEN = 0;
        private const int SM_CYSCREEN = 1;

        [StructLayout(LayoutKind.Sequential)]
        private struct RECT
        {
            public int Left;
            public int Top;
            public int Right;
            public int Bottom;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct WINDOWPLACEMENT
        {
            public int length;
            public int flags;
            public int showCmd;
            public System.Drawing.Point ptMinPosition;
            public System.Drawing.Point ptMaxPosition;
            public RECT rcNormalPosition;
        }

        #endregion

        private string? GetWindowClass(IntPtr hWnd)
        {
            try
            {
                var sb = new System.Text.StringBuilder(256);
                int len = GetClassName(hWnd, sb, sb.Capacity);
                if (len > 0) return sb.ToString();
            }
            catch { }
            return null;
        }
    }

    /// <summary>
    /// Argumentos do evento de jogo detectado
    /// </summary>
    public class GameDetectedEventArgs : EventArgs
    {
        public Process? Process { get; set; }
        public string ProcessName { get; set; } = "";
        public int ProcessId { get; set; }
        public string GameName { get; set; } = "";
        public string? ProcessPath { get; set; }
    }

    /// <summary>
    /// Argumentos do evento de jogo parado
    /// </summary>
    public class GameStoppedEventArgs : EventArgs
    {
        public string ProcessName { get; set; } = "";
        public int ProcessId { get; set; }
    }
}

