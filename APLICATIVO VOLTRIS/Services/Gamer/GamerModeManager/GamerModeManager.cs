using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32;

namespace VoltrisOptimizer.Services.Gamer.GamerModeManager
{
    /// <summary>
    /// GamerModeManager - Implementação robusta do modo gamer
    /// 
    /// Funcionalidades:
    /// - Ativação automática ao detectar jogos
    /// - Otimização de plano de energia
    /// - Priorização de processos
    /// - Otimização GPU (NVIDIA/AMD)
    /// - Monitoramento térmico com rollback automático
    /// - Restauração completa após crash
    /// </summary>
    public class GamerModeManager : IGamerModeManager
    {
        #region Fields
        
        private readonly ILoggingService _logger;
        private readonly IPowerPlanService _powerPlanService;
        private readonly IGpuOptimizationService _gpuService;
        private readonly IThermalMonitorService _thermalMonitor;
        private readonly IGameDetectionService _gameDetection;
        private readonly IProcessOptimizationService _processService;
        
        private GamerModeState _state = new();
        private GamerModeConfig _config = new();
        private HardwareMetrics _metrics = new();
        
        private readonly ConcurrentQueue<GamerModeLogEntry> _logEntries = new();
        private readonly object _stateLock = new();
        private CancellationTokenSource? _monitoringCts;
        private Task? _thermalMonitorTask;
        private bool _isDisposed;
        
        // Paths
        private static readonly string ConfigPath = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
            "Voltris", "GamerMode", "config.json");
        
        private static readonly string StatePath = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
            "Voltris", "GamerMode", "state.json");
        
        private const int MAX_LOG_ENTRIES = 1000;
        
        #endregion
        
        #region Properties
        
        public GamerModeState CurrentState
        {
            get { lock (_stateLock) return _state; }
        }
        
        public bool IsActive => CurrentState.IsActive;
        
        public HardwareMetrics CurrentMetrics => _metrics;
        
        public GamerModeConfig Config => _config;
        
        #endregion
        
        #region Events
        
        public event EventHandler<GamerModeState>? StateChanged;
        public event EventHandler<HardwareMetrics>? MetricsUpdated;
        public event EventHandler<SafetyRollbackEventArgs>? SafetyRollbackTriggered;
        public event EventHandler<GameDetectedEventArgs>? GameDetected;
        public event EventHandler<GamerModeLogEntry>? LogEntry;
        
        #endregion
        
        #region Constructor
        
        public GamerModeManager(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            
            // Inicializar serviços internos
            _powerPlanService = new PowerPlanService(logger);
            _gpuService = new GpuOptimizationService(logger);
            _thermalMonitor = new ThermalMonitorService(logger);
            _gameDetection = new GameDetectionService(logger);
            _processService = new ProcessOptimizationService(logger);
            
            // Configurar eventos do detector de jogos
            _gameDetection.GameStarted += OnGameStarted;
            _gameDetection.GameStopped += OnGameStopped;
            
            // Carregar configuração
            _ = LoadConfigAsync();
            
            // Verificar estado anterior (crash recovery)
            _ = RestorePreviousStateAsync();
            
            Log(LogLevel.Info, "GamerModeManager inicializado", "Init");
        }
        
        #endregion
        
        #region Activation/Deactivation
        
        public async Task<bool> ActivateAsync(string? gameExecutable = null, CancellationToken ct = default)
        {
            if (IsActive)
            {
                Log(LogLevel.Warning, "Modo gamer já está ativo", "Activate");
                return false;
            }
            
            try
            {
                Log(LogLevel.Info, "Iniciando ativação do modo gamer...", "Activate");
                
                // Salvar estado para crash recovery
                await SaveStateAsync();
                
                // 1. Detectar e salvar plano de energia atual
                if (_config.OptimizePowerPlan)
                {
                    Log(LogLevel.Info, "Configurando plano de energia...", "PowerPlan");
                    var (originalGuid, originalName) = _powerPlanService.GetActivePowerPlan();
                    
                    UpdateState(s =>
                    {
                        s.OriginalPowerPlanGuid = originalGuid;
                    });
                    
                    // Aplicar plano de alta performance
                    var targetPlan = _config.PreferUltimatePerformance 
                        ? PowerPlanType.UltimatePerformance 
                        : PowerPlanType.HighPerformance;
                    
                    var (newGuid, newName) = _powerPlanService.SetPowerPlan(targetPlan);
                    
                    UpdateState(s =>
                    {
                        s.CurrentPowerPlanGuid = newGuid;
                        s.CurrentPowerPlanName = newName;
                    });
                    
                    Log(LogLevel.Info, $"Plano de energia alterado para: {newName}", "PowerPlan");
                }
                
                ct.ThrowIfCancellationRequested();
                
                // 2. Otimizar GPU
                if (_config.OptimizeGpu)
                {
                    Log(LogLevel.Info, "Otimizando GPU...", "GPU");
                    var gpuResult = await _gpuService.OptimizeAsync(_config.ForceMaxPerformance, ct);
                    
                    UpdateState(s =>
                    {
                        s.GpuVendor = gpuResult.Vendor;
                        s.GpuName = gpuResult.Name;
                        s.GpuOptimized = gpuResult.Success;
                        s.GpuPowerMode = gpuResult.PowerMode;
                    });
                    
                    if (gpuResult.Success)
                    {
                        Log(LogLevel.Info, $"GPU {gpuResult.Name} otimizada: {gpuResult.PowerMode}", "GPU");
                    }
                    else
                    {
                        Log(LogLevel.Warning, $"Falha ao otimizar GPU: {gpuResult.ErrorMessage}", "GPU");
                    }
                }
                
                ct.ThrowIfCancellationRequested();
                
                // 3. Otimizar processo do jogo
                if (!string.IsNullOrEmpty(gameExecutable))
                {
                    await OptimizeGameProcessAsync(gameExecutable, ct);
                }
                
                ct.ThrowIfCancellationRequested();
                
                // 4. Fechar apps de background
                if (_config.CloseBackgroundApps && _config.AppsToClose.Any())
                {
                    Log(LogLevel.Info, "Fechando aplicativos em segundo plano...", "Process");
                    _processService.CloseProcesses(_config.AppsToClose);
                }
                
                // 5. Iniciar monitoramento térmico
                StartThermalMonitoring();
                
                // 6. Marcar como ativo
                UpdateState(s =>
                {
                    s.IsActive = true;
                    s.ActivatedAt = DateTime.Now;
                    s.ActiveGamePath = gameExecutable;
                });
                
                // Salvar estado final
                await SaveStateAsync();
                
                // CORREÇÃO: Enviar notificação Windows quando modo gamer é ativado
                try
                {
                    VoltrisOptimizer.Services.NotificationManager.ShowSuccess(
                        "Modo Gamer Ativado",
                        "Otimizações aplicadas com sucesso! 🎮"
                    );
                }
                catch (Exception ex)
                {
                    Log(LogLevel.Warning, $"Erro ao enviar notificação: {ex.Message}", "Notification");
                }
                
                Log(LogLevel.Info, "✓ Modo gamer ativado com sucesso!", "Activate");
                return true;
            }
            catch (OperationCanceledException)
            {
                Log(LogLevel.Warning, "Ativação cancelada pelo usuário", "Activate");
                await DeactivateAsync(CancellationToken.None);
                return false;
            }
            catch (Exception ex)
            {
                Log(LogLevel.Error, $"Erro ao ativar modo gamer: {ex.Message}", "Activate");
                await DeactivateAsync(CancellationToken.None);
                return false;
            }
        }
        
        public async Task<bool> DeactivateAsync(CancellationToken ct = default)
        {
            try
            {
                Log(LogLevel.Info, "Desativando modo gamer...", "Deactivate");
                
                // 1. Parar monitoramento térmico
                StopThermalMonitoring();
                
                // 2. Restaurar prioridade do processo
                if (_state.ProcessPrioritySet && _state.ActiveGameProcessId.HasValue)
                {
                    Log(LogLevel.Info, "Restaurando prioridade do processo...", "Process");
                    _processService.RestoreProcessPriority(_state.ActiveGameProcessId.Value);
                }
                
                // 3. Restaurar GPU
                if (_state.GpuOptimized)
                {
                    Log(LogLevel.Info, "Restaurando configurações da GPU...", "GPU");
                    await _gpuService.RestoreAsync(ct);
                }
                
                // 4. Restaurar plano de energia
                if (!string.IsNullOrEmpty(_state.OriginalPowerPlanGuid))
                {
                    Log(LogLevel.Info, "Restaurando plano de energia original...", "PowerPlan");
                    _powerPlanService.SetPowerPlanByGuid(_state.OriginalPowerPlanGuid);
                }
                
                // 5. Resetar estado
                UpdateState(s =>
                {
                    s.IsActive = false;
                    s.ActivatedAt = null;
                    s.ActiveGameName = null;
                    s.ActiveGameProcessId = null;
                    s.ActiveGamePath = null;
                    s.GpuOptimized = false;
                    s.ProcessPrioritySet = false;
                    s.ProcessAffinitySet = false;
                    s.ThermalMonitoringActive = false;
                    s.CurrentPowerPlanGuid = null;
                    s.CurrentPowerPlanName = null;
                });
                
                // 6. Limpar arquivo de estado
                DeleteStateFile();
                
                Log(LogLevel.Info, "✓ Modo gamer desativado", "Deactivate");
                return true;
            }
            catch (Exception ex)
            {
                Log(LogLevel.Error, $"Erro ao desativar modo gamer: {ex.Message}", "Deactivate");
                return false;
            }
        }
        
        public async Task ForceEmergencyRollbackAsync()
        {
            Log(LogLevel.Critical, "⚠️ ROLLBACK DE EMERGÊNCIA INICIADO", "Safety");
            
            try
            {
                // Forçar rollback de tudo ignorando erros
                StopThermalMonitoring();
                
                try { await _gpuService.RestoreAsync(CancellationToken.None); } catch { }
                
                if (!string.IsNullOrEmpty(_state.OriginalPowerPlanGuid))
                {
                    try { _powerPlanService.SetPowerPlanByGuid(_state.OriginalPowerPlanGuid); } catch { }
                }
                
                if (_state.ActiveGameProcessId.HasValue)
                {
                    try { _processService.RestoreProcessPriority(_state.ActiveGameProcessId.Value); } catch { }
                }
                
                UpdateState(s =>
                {
                    s.IsActive = false;
                    s.SafetyRollbackOccurred = true;
                });
                
                DeleteStateFile();
                
                Log(LogLevel.Info, "Rollback de emergência concluído", "Safety");
            }
            catch (Exception ex)
            {
                Log(LogLevel.Error, $"Erro durante rollback de emergência: {ex.Message}", "Safety");
            }
        }
        
        #endregion
        
        #region Game Detection
        
        public void StartGameDetection()
        {
            if (_state.GameDetectionActive)
                return;
            
            _gameDetection.Start(_config.WatchedGames.Select(g => g.ProcessName).ToList(), 
                                 _config.GameDetectionIntervalMs);
            
            UpdateState(s => s.GameDetectionActive = true);
            Log(LogLevel.Info, "Detecção de jogos iniciada", "GameDetection");
        }
        
        public void StopGameDetection()
        {
            _gameDetection.Stop();
            UpdateState(s => s.GameDetectionActive = false);
            Log(LogLevel.Info, "Detecção de jogos parada", "GameDetection");
        }
        
        private async void OnGameStarted(object? sender, GameDetectedEventArgs e)
        {
            try
            {
                Log(LogLevel.Info, $"🎮 Jogo detectado: {e.GameName}", "GameDetection");
                GameDetected?.Invoke(this, e);
                
                if (_config.AutoActivateOnGameStart && !IsActive)
                {
                    await ActivateAsync(e.ExecutablePath);
                }
            }
            catch (Exception ex)
            {
                Log(LogLevel.Error, $"Erro ao iniciar modo gamer: {ex.Message}", "GameDetection");
            }
        }
        
        private async void OnGameStopped(object? sender, GameDetectedEventArgs e)
        {
            try
            {
                Log(LogLevel.Info, $"🎮 Jogo encerrado: {e.GameName}", "GameDetection");
                GameDetected?.Invoke(this, e);
                
                var game = _config.WatchedGames.FirstOrDefault(g => 
                    g.ProcessName.Equals(e.GameName, StringComparison.OrdinalIgnoreCase));
                
                if (game != null)
                {
                    game.LastPlayed = DateTime.Now;
                    if (_state.ActivatedAt.HasValue)
                    {
                        game.TotalPlayTime += DateTime.Now - _state.ActivatedAt.Value;
                    }
                    await SaveConfigAsync();
                }
                
                if (_config.AutoDeactivateOnGameEnd && IsActive)
                {
                    await DeactivateAsync();
                }
            }
            catch (Exception ex)
            {
                Log(LogLevel.Error, $"Erro ao finalizar modo gamer: {ex.Message}", "GameDetection");
            }
        }
        
        public void AddGameToWatch(string executablePath, GameProfile? profile = null)
        {
            var name = Path.GetFileNameWithoutExtension(executablePath);
            
            var existing = _config.WatchedGames.FirstOrDefault(g => 
                g.ExecutablePath.Equals(executablePath, StringComparison.OrdinalIgnoreCase));
            
            if (existing != null)
            {
                existing.CustomProfile = profile;
            }
            else
            {
                _config.WatchedGames.Add(new WatchedGame
                {
                    Name = name,
                    ExecutablePath = executablePath,
                    ProcessName = name,
                    Enabled = true,
                    CustomProfile = profile
                });
            }
            
            Log(LogLevel.Info, $"Jogo adicionado: {name}", "Config");
            _ = SaveConfigAsync();
        }
        
        public void RemoveGameFromWatch(string executablePath)
        {
            var game = _config.WatchedGames.FirstOrDefault(g => 
                g.ExecutablePath.Equals(executablePath, StringComparison.OrdinalIgnoreCase));
            
            if (game != null)
            {
                _config.WatchedGames.Remove(game);
                Log(LogLevel.Info, $"Jogo removido: {game.Name}", "Config");
                _ = SaveConfigAsync();
            }
        }
        
        public IReadOnlyList<WatchedGame> GetWatchedGames() => _config.WatchedGames.AsReadOnly();
        
        #endregion
        
        #region Thermal Monitoring
        
        private void StartThermalMonitoring()
        {
            if (_state.ThermalMonitoringActive)
                return;
            
            _monitoringCts = new CancellationTokenSource();
            _thermalMonitorTask = Task.Run(() => ThermalMonitorLoop(_monitoringCts.Token));
            
            UpdateState(s => s.ThermalMonitoringActive = true);
            Log(LogLevel.Info, "Monitoramento térmico iniciado", "Thermal");
        }
        
        private void StopThermalMonitoring()
        {
            if (!_state.ThermalMonitoringActive)
                return;
            
            _monitoringCts?.Cancel();
            
            try
            {
                _thermalMonitorTask?.Wait(2000);
            }
            catch { }
            
            _monitoringCts?.Dispose();
            _monitoringCts = null;
            _thermalMonitorTask = null;
            
            UpdateState(s => s.ThermalMonitoringActive = false);
            Log(LogLevel.Info, "Monitoramento térmico parado", "Thermal");
        }
        
        private async Task ThermalMonitorLoop(CancellationToken ct)
        {
            int consecutiveCpuOverheat = 0;
            int consecutiveGpuOverheat = 0;
            
            while (!ct.IsCancellationRequested)
            {
                try
                {
                    // Coletar métricas
                    var metrics = await _thermalMonitor.GetMetricsAsync(ct);
                    _metrics = metrics;
                    MetricsUpdated?.Invoke(this, metrics);
                    
                    // Verificar CPU
                    if (metrics.CpuTemperature >= _config.CpuMaxTemp)
                    {
                        consecutiveCpuOverheat++;
                        Log(LogLevel.Warning, $"⚠️ CPU quente: {metrics.CpuTemperature}°C (limite: {_config.CpuMaxTemp}°C)", "Thermal");
                        
                        if (consecutiveCpuOverheat >= 2 && _config.AutoRollbackOnOverheat) // 1 segundo (2 x 500ms)
                        {
                            await TriggerSafetyRollback(SafetyTrigger.CpuOverheat, metrics.CpuTemperature, 
                                $"CPU ultrapassou {_config.CpuMaxTemp}°C");
                            break;
                        }
                    }
                    else
                    {
                        consecutiveCpuOverheat = 0;
                    }
                    
                    // Verificar GPU
                    if (metrics.GpuTemperature >= _config.GpuMaxTemp)
                    {
                        consecutiveGpuOverheat++;
                        Log(LogLevel.Warning, $"⚠️ GPU quente: {metrics.GpuTemperature}°C (limite: {_config.GpuMaxTemp}°C)", "Thermal");
                        
                        if (consecutiveGpuOverheat >= 2 && _config.AutoRollbackOnOverheat)
                        {
                            await TriggerSafetyRollback(SafetyTrigger.GpuOverheat, metrics.GpuTemperature,
                                $"GPU ultrapassou {_config.GpuMaxTemp}°C");
                            break;
                        }
                    }
                    else
                    {
                        consecutiveGpuOverheat = 0;
                    }
                    
                    // Verificar throttling
                    if (metrics.CpuThrottling)
                    {
                        Log(LogLevel.Warning, "CPU em thermal throttling detectado", "Thermal");
                    }
                    
                    if (metrics.GpuThrottling)
                    {
                        Log(LogLevel.Warning, "GPU em thermal throttling detectado", "Thermal");
                    }
                    
                    await Task.Delay(_config.ThermalCheckIntervalMs, ct);
                }
                catch (OperationCanceledException)
                {
                    break;
                }
                catch (Exception ex)
                {
                    Log(LogLevel.Error, $"Erro no monitoramento térmico: {ex.Message}", "Thermal");
                    await Task.Delay(1000, ct);
                }
            }
        }
        
        private async Task TriggerSafetyRollback(SafetyTrigger trigger, double? temperature, string reason)
        {
            Log(LogLevel.Critical, $"🛑 ROLLBACK DE SEGURANÇA: {reason}", "Safety");
            
            UpdateState(s =>
            {
                s.SafetyRollbackOccurred = true;
                s.LastSafetyReason = reason;
            });
            
            var args = new SafetyRollbackEventArgs
            {
                Trigger = trigger,
                Temperature = temperature,
                Reason = reason
            };
            
            SafetyRollbackTriggered?.Invoke(this, args);
            
            await DeactivateAsync(CancellationToken.None);
        }
        
        #endregion
        
        #region Process Optimization
        
        private async Task OptimizeGameProcessAsync(string gameExecutable, CancellationToken ct)
        {
            var processName = Path.GetFileNameWithoutExtension(gameExecutable);
            var profile = _config.WatchedGames
                .FirstOrDefault(g => g.ProcessName.Equals(processName, StringComparison.OrdinalIgnoreCase))
                ?.CustomProfile;
            
            // Aguardar processo iniciar
            Process? gameProcess = null;
            for (int i = 0; i < 10 && gameProcess == null; i++)
            {
                ct.ThrowIfCancellationRequested();
                var processes = Process.GetProcessesByName(processName);
                if (processes.Length > 0)
                {
                    gameProcess = processes[0];
                }
                else
                {
                    await Task.Delay(500, ct);
                }
            }
            
            if (gameProcess == null)
            {
                Log(LogLevel.Warning, $"Processo {processName} não encontrado", "Process");
                return;
            }
            
            UpdateState(s =>
            {
                s.ActiveGameName = processName;
                s.ActiveGameProcessId = gameProcess.Id;
            });
            
            // Definir prioridade
            if (_config.SetHighPriority)
            {
                var priority = profile?.Priority ?? ProcessPriorityLevel.High;
                _processService.SetProcessPriority(gameProcess.Id, priority);
                UpdateState(s => s.ProcessPrioritySet = true);
                Log(LogLevel.Info, $"Prioridade do processo definida: {priority}", "Process");
            }
            
            // Definir afinidade
            if (_config.OptimizeAffinity)
            {
                if (profile?.SpecificCores != null)
                {
                    _processService.SetProcessAffinity(gameProcess.Id, profile.SpecificCores);
                }
                else if (profile?.UseAllCores ?? true)
                {
                    _processService.SetProcessAffinityAllCores(gameProcess.Id);
                }
                UpdateState(s => s.ProcessAffinitySet = true);
                Log(LogLevel.Info, "Afinidade do processo configurada", "Process");
            }
        }
        
        #endregion
        
        #region Configuration
        
        public async Task LoadConfigAsync()
        {
            try
            {
                if (File.Exists(ConfigPath))
                {
                    var json = await File.ReadAllTextAsync(ConfigPath);
                    _config = JsonSerializer.Deserialize<GamerModeConfig>(json) ?? new GamerModeConfig();
                    Log(LogLevel.Info, "Configuração carregada", "Config");
                }
            }
            catch (Exception ex)
            {
                Log(LogLevel.Warning, $"Erro ao carregar configuração: {ex.Message}", "Config");
                _config = new GamerModeConfig();
            }
        }
        
        public async Task SaveConfigAsync()
        {
            try
            {
                var dir = Path.GetDirectoryName(ConfigPath);
                if (!string.IsNullOrEmpty(dir))
                    Directory.CreateDirectory(dir);
                
                var json = JsonSerializer.Serialize(_config, new JsonSerializerOptions { WriteIndented = true });
                await File.WriteAllTextAsync(ConfigPath, json);
            }
            catch (Exception ex)
            {
                Log(LogLevel.Warning, $"Erro ao salvar configuração: {ex.Message}", "Config");
            }
        }
        
        private async Task SaveStateAsync()
        {
            try
            {
                var dir = Path.GetDirectoryName(StatePath);
                if (!string.IsNullOrEmpty(dir))
                    Directory.CreateDirectory(dir);
                
                var json = JsonSerializer.Serialize(_state, new JsonSerializerOptions { WriteIndented = true });
                await File.WriteAllTextAsync(StatePath, json);
            }
            catch { }
        }
        
        private void DeleteStateFile()
        {
            try
            {
                if (File.Exists(StatePath))
                    File.Delete(StatePath);
            }
            catch { }
        }
        
        public async Task RestorePreviousStateAsync()
        {
            try
            {
                if (!File.Exists(StatePath))
                    return;
                
                var json = await File.ReadAllTextAsync(StatePath);
                var previousState = JsonSerializer.Deserialize<GamerModeState>(json);
                
                if (previousState?.IsActive == true)
                {
                    Log(LogLevel.Warning, "Estado anterior encontrado - executando rollback de recuperação", "Recovery");
                    
                    // Restaurar plano de energia se necessário
                    if (!string.IsNullOrEmpty(previousState.OriginalPowerPlanGuid))
                    {
                        try
                        {
                            _powerPlanService.SetPowerPlanByGuid(previousState.OriginalPowerPlanGuid);
                            Log(LogLevel.Info, "Plano de energia restaurado", "Recovery");
                        }
                        catch { }
                    }
                    
                    // Restaurar GPU
                    if (previousState.GpuOptimized)
                    {
                        try
                        {
                            await _gpuService.RestoreAsync(CancellationToken.None);
                            Log(LogLevel.Info, "Configurações de GPU restauradas", "Recovery");
                        }
                        catch { }
                    }
                    
                    DeleteStateFile();
                    Log(LogLevel.Info, "✓ Recuperação de crash concluída", "Recovery");
                }
            }
            catch (Exception ex)
            {
                Log(LogLevel.Error, $"Erro na recuperação de crash: {ex.Message}", "Recovery");
            }
        }
        
        #endregion
        
        #region Logging
        
        public IReadOnlyList<GamerModeLogEntry> GetRecentLogs(int count = 100)
        {
            return _logEntries.TakeLast(count).ToList().AsReadOnly();
        }
        
        private void Log(LogLevel level, string message, string category)
        {
            var entry = new GamerModeLogEntry
            {
                Timestamp = DateTime.Now,
                Level = level,
                Message = message,
                Category = category
            };
            
            _logEntries.Enqueue(entry);
            
            // Limitar tamanho do log
            while (_logEntries.Count > MAX_LOG_ENTRIES)
            {
                _logEntries.TryDequeue(out _);
            }
            
            LogEntry?.Invoke(this, entry);
            
            // Também logar no serviço principal
            switch (level)
            {
                case LogLevel.Error:
                case LogLevel.Critical:
                    _logger.LogError($"[GamerMode:{category}] {message}");
                    break;
                case LogLevel.Warning:
                    _logger.LogWarning($"[GamerMode:{category}] {message}");
                    break;
                default:
                    _logger.LogInfo($"[GamerMode:{category}] {message}");
                    break;
            }
        }
        
        #endregion
        
        #region State Management
        
        private void UpdateState(Action<GamerModeState> updateAction)
        {
            lock (_stateLock)
            {
                updateAction(_state);
            }
            StateChanged?.Invoke(this, _state);
        }
        
        #endregion
        
        #region IDisposable
        
        public void Dispose()
        {
            if (_isDisposed) return;
            _isDisposed = true;
            
            StopGameDetection();
            StopThermalMonitoring();
            
            _gameDetection.GameStarted -= OnGameStarted;
            _gameDetection.GameStopped -= OnGameStopped;
            
            (_powerPlanService as IDisposable)?.Dispose();
            (_gpuService as IDisposable)?.Dispose();
            (_thermalMonitor as IDisposable)?.Dispose();
            (_gameDetection as IDisposable)?.Dispose();
            (_processService as IDisposable)?.Dispose();
        }
        
        #endregion
    }
}

