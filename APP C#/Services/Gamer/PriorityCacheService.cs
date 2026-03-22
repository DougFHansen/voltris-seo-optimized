using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace VoltrisOptimizer.Services.Gamer
{
    /// <summary>
    /// Serviço de cache de prioridades para restauração instantânea durante trocas de contexto
    /// Armazena e restaura rapidamente configurações de prioridade de processos
    /// </summary>
    public class PriorityCacheService : IDisposable
    {
        private readonly ILoggingService _logger;
        private readonly ContextSwitchDetectorService _contextDetector;
        private CancellationTokenSource? _cacheMaintenanceCts;
        private Task? _cacheMaintenanceTask;
        private int _gameProcessId;
        private readonly object _lock = new();
        
        // Cache de prioridades
        private readonly Dictionary<int, ProcessPrioritySnapshot> _priorityCache = new();
        private readonly Dictionary<int, ProcessAffinitySnapshot> _affinityCache = new();
        
        // Estados otimizados para diferentes cenários
        private readonly Dictionary<string, PriorityState> _optimizedStates = new();
        
        // Controles para manutenção do cache
        private readonly Stopwatch _lastUpdateTimer = new();
        private const int CACHE_REFRESH_INTERVAL_MS = 5000; // 5 segundos
        private const int MAX_CACHE_AGE_MINUTES = 10; // 10 minutos
        
        // Debounce para trocas de contexto — evita sweeps massivos em trocas rápidas
        private DateTime _lastSwitchTime = DateTime.MinValue;
        private string _lastAppliedState = "";
        private const int SWITCH_DEBOUNCE_MS = 3000; // 3 segundos entre trocas
        
        public PriorityCacheService(ILoggingService logger, ContextSwitchDetectorService contextDetector)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _contextDetector = contextDetector ?? throw new ArgumentNullException(nameof(contextDetector));
            
            // Registrar eventos do detector
            _contextDetector.AppSwitchDetected += OnAppSwitchDetected;
        }
        
        /// <summary>
        /// Inicia serviço de cache de prioridades
        /// </summary>
        public void Start(int gameProcessId)
        {
            Stop();
            _gameProcessId = gameProcessId;
            _cacheMaintenanceCts = new CancellationTokenSource();
            _cacheMaintenanceTask = CacheMaintenanceLoop(_cacheMaintenanceCts.Token);
            _lastUpdateTimer.Start();
            _logger.LogInfo("[PriorityCache] Serviço de cache de prioridades iniciado");
        }
        
        /// <summary>
        /// Para serviço
        /// </summary>
        public void Stop()
        {
            if (_cacheMaintenanceCts != null)
            {
                _cacheMaintenanceCts.Cancel();
                try { _cacheMaintenanceTask?.Wait(1000); } catch { }
                _cacheMaintenanceCts.Dispose();
                _cacheMaintenanceCts = null;
            }
            
            _lastUpdateTimer.Reset();
        }
        
        /// <summary>
        /// Loop de manutenção do cache
        /// </summary>
        private async Task CacheMaintenanceLoop(CancellationToken ct)
        {
            while (!ct.IsCancellationRequested)
            {
                try
                {
                    // Atualizar cache se necessário
                    if (_lastUpdateTimer.ElapsedMilliseconds > CACHE_REFRESH_INTERVAL_MS)
                    {
                        await RefreshPriorityCache();
                        _lastUpdateTimer.Restart();
                    }
                    
                    // Limpar entradas antigas
                    CleanupExpiredCacheEntries();
                    
                    await Task.Delay(1000, ct);
                }
                catch (Exception ex) when (ex is not OperationCanceledException)
                {
                    _logger.LogError($"[PriorityCache] Erro no loop de manutenção: {ex.Message}");
                    await Task.Delay(2000, ct);
                }
            }
        }
        
        /// <summary>
        /// Atualiza o cache de prioridades
        /// </summary>
        private async Task RefreshPriorityCache()
        {
            await Task.Run(() =>
            {
                try
                {
                    var processes = Process.GetProcesses();
                    
                    foreach (var process in processes)
                    {
                        try
                        {
                            var processId = process.Id;
                            
                            // Capturar snapshot de prioridade
                            var prioritySnapshot = new ProcessPrioritySnapshot
                            {
                                ProcessId = processId,
                                ProcessName = process.ProcessName,
                                PriorityClass = process.PriorityClass,
                                CaptureTime = DateTime.UtcNow
                            };
                            
                            // Capturar snapshot de afinidade
                            var affinitySnapshot = new ProcessAffinitySnapshot
                            {
                                ProcessId = processId,
                                ProcessName = process.ProcessName,
                                AffinityMask = process.ProcessorAffinity,
                                CaptureTime = DateTime.UtcNow
                            };
                            
                            lock (_lock)
                            {
                                _priorityCache[processId] = prioritySnapshot;
                                _affinityCache[processId] = affinitySnapshot;
                            }
                        }
                        catch
                        {
                            // Ignorar processos que não podem ser acessados
                        }
                        finally
                        {
                            try { process.Dispose(); } catch { }
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[PriorityCache] Erro ao atualizar cache: {ex.Message}");
                }
            });
        }
        
        /// <summary>
        /// Limpa entradas expiradas do cache
        /// </summary>
        private void CleanupExpiredCacheEntries()
        {
            try
            {
                var cutoffTime = DateTime.UtcNow.AddMinutes(-MAX_CACHE_AGE_MINUTES);
                
                lock (_lock)
                {
                    var expiredPriorityKeys = _priorityCache
                        .Where(kvp => kvp.Value.CaptureTime < cutoffTime)
                        .Select(kvp => kvp.Key)
                        .ToList();
                    
                    var expiredAffinityKeys = _affinityCache
                        .Where(kvp => kvp.Value.CaptureTime < cutoffTime)
                        .Select(kvp => kvp.Key)
                        .ToList();
                    
                    foreach (var key in expiredPriorityKeys)
                    {
                        _priorityCache.Remove(key);
                    }
                    
                    foreach (var key in expiredAffinityKeys)
                    {
                        _affinityCache.Remove(key);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[PriorityCache] Erro ao limpar cache: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Manipulador de troca de app — com debounce para evitar sweeps massivos
        /// </summary>
        private void OnAppSwitchDetected(object? sender, AppSwitchEventArgs e)
        {
            try
            {
                var now = DateTime.UtcNow;
                var targetState = e.ToProcessId == _gameProcessId ? "game_mode" : $"multitask_{e.ToProcessName?.ToLowerInvariant()}";
                
                // Debounce: ignorar se mesma troca aconteceu recentemente
                // CORREÇÃO: Também bloquear trocas rápidas entre estados DIFERENTES (ex: game_mode <-> multitask_explorer)
                var elapsed = (now - _lastSwitchTime).TotalMilliseconds;
                if (elapsed < SWITCH_DEBOUNCE_MS)
                {
                    if (targetState == _lastAppliedState)
                    {
                        _logger.LogInfo($"[PriorityCache] Troca ignorada (debounce mesmo estado {elapsed:F0}ms): {e.FromProcessName} -> {e.ToProcessName}");
                        return;
                    }
                    // Intervalo mínimo global entre QUALQUER troca de estado (evita ping-pong durante startup)
                    if (elapsed < 1500)
                    {
                        _logger.LogInfo($"[PriorityCache] Troca ignorada (cooldown global {elapsed:F0}ms): {e.FromProcessName} -> {e.ToProcessName}");
                        return;
                    }
                }
                
                _lastSwitchTime = now;
                _lastAppliedState = targetState;
                
                _logger.LogInfo($"[PriorityCache] Troca detectada: {e.FromProcessName} -> {e.ToProcessName}");
                
                // Se está voltando para o jogo, aplicar estado otimizado para jogo
                if (e.ToProcessId == _gameProcessId)
                {
                    _ = Task.Run(async () =>
                    {
                        await ApplyOptimizedGameState();
                    });
                }
                // Se está saindo do jogo, salvar estado atual e aplicar estado otimizado para multitarefa
                else if (e.FromProcessId == _gameProcessId)
                {
                    _ = Task.Run(async () =>
                    {
                        await SaveAndApplyMultitaskingState(e.ToProcessName);
                    });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[PriorityCache] Erro ao processar troca: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Aplica estado otimizado para jogo
        /// </summary>
        private async Task ApplyOptimizedGameState()
        {
            await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("[PriorityCache] Aplicando estado otimizado para jogo...");
                    
                    // Verificar se temos estado otimizado salvo
                    if (_optimizedStates.TryGetValue("game_mode", out var gameState))
                    {
                        ApplyPriorityState(gameState);
                        _logger.LogSuccess("[PriorityCache] Estado otimizado para jogo aplicado");
                    }
                    else
                    {
                        // Criar e salvar estado otimizado para jogo
                        var newState = CreateOptimizedGameState();
                        _optimizedStates["game_mode"] = newState;
                        ApplyPriorityState(newState);
                        _logger.LogSuccess("[PriorityCache] Novo estado otimizado para jogo criado e aplicado");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[PriorityCache] Erro ao aplicar estado de jogo: {ex.Message}");
                }
            });
        }
        
        /// <summary>
        /// Salva estado atual e aplica estado otimizado para multitarefa
        /// </summary>
        private async Task SaveAndApplyMultitaskingState(string targetAppName)
        {
            await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo($"[PriorityCache] Salvando estado e aplicando multitarefa para {targetAppName}...");
                    
                    // Salvar estado atual como estado de jogo
                    var currentGameState = CaptureCurrentState();
                    _optimizedStates["game_mode"] = currentGameState;
                    
                    // Aplicar estado otimizado para multitarefa
                    var multitaskKey = $"multitask_{targetAppName.ToLowerInvariant()}";
                    
                    if (_optimizedStates.TryGetValue(multitaskKey, out var multitaskState))
                    {
                        ApplyPriorityState(multitaskState);
                        _logger.LogSuccess($"[PriorityCache] Estado otimizado para {targetAppName} aplicado");
                    }
                    else
                    {
                        // Criar novo estado otimizado para multitarefa
                        var newState = CreateOptimizedMultitaskingState(targetAppName);
                        _optimizedStates[multitaskKey] = newState;
                        ApplyPriorityState(newState);
                        _logger.LogSuccess($"[PriorityCache] Novo estado otimizado para {targetAppName} criado e aplicado");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[PriorityCache] Erro ao aplicar estado de multitarefa: {ex.Message}");
                }
            });
        }
        
        /// <summary>
        /// Cria estado otimizado para jogo
        /// </summary>
        private PriorityState CreateOptimizedGameState()
        {
            var state = new PriorityState
            {
                Name = "game_mode",
                CreatedAt = DateTime.UtcNow,
                ProcessPriorities = new Dictionary<int, ProcessPriorityClass>(),
                ProcessAffinities = new Dictionary<int, IntPtr>()
            };
            
            try
            {
                var processes = Process.GetProcesses();
                
                foreach (var process in processes)
                {
                    try
                    {
                        var processId = process.Id;
                        var processName = process.ProcessName.ToLowerInvariant();
                        
                        // Processo do jogo - máxima prioridade
                        if (processId == _gameProcessId)
                        {
                            state.ProcessPriorities[processId] = ProcessPriorityClass.High;
                            // Manter todas as CPUs disponíveis para o jogo
                            state.ProcessAffinities[processId] = (IntPtr)(-1); // Todas as CPUs
                        }
                        // Processos críticos do sistema - manter prioridade normal
                        else if (IsCriticalSystemProcess(processName))
                        {
                            state.ProcessPriorities[processId] = ProcessPriorityClass.Normal;
                        }
                        // Outros processos - prioridade reduzida
                        else
                        {
                            state.ProcessPriorities[processId] = ProcessPriorityClass.BelowNormal;
                        }
                    }
                    catch
                    {
                        // Ignorar erros
                    }
                    finally
                    {
                        try { process.Dispose(); } catch { }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[PriorityCache] Erro ao criar estado de jogo: {ex.Message}");
            }
            
            return state;
        }
        
        /// <summary>
        /// Cria estado otimizado para multitarefa
        /// </summary>
        private PriorityState CreateOptimizedMultitaskingState(string targetAppName)
        {
            var state = new PriorityState
            {
                Name = $"multitask_{targetAppName}",
                CreatedAt = DateTime.UtcNow,
                ProcessPriorities = new Dictionary<int, ProcessPriorityClass>(),
                ProcessAffinities = new Dictionary<int, IntPtr>()
            };
            
            try
            {
                var processes = Process.GetProcesses();
                var targetProcessName = targetAppName.ToLowerInvariant();
                
                foreach (var process in processes)
                {
                    try
                    {
                        var processId = process.Id;
                        var processName = process.ProcessName.ToLowerInvariant();
                        
                        // Processo alvo - prioridade elevada
                        if (processName.Contains(targetProcessName))
                        {
                            state.ProcessPriorities[processId] = ProcessPriorityClass.AboveNormal;
                        }
                        // Processo do jogo - prioridade normal (não em foco)
                        else if (processId == _gameProcessId)
                        {
                            state.ProcessPriorities[processId] = ProcessPriorityClass.Normal;
                        }
                        // Processos críticos - manter normal
                        else if (IsCriticalSystemProcess(processName))
                        {
                            state.ProcessPriorities[processId] = ProcessPriorityClass.Normal;
                        }
                        // Outros processos - prioridade padrão
                        else
                        {
                            state.ProcessPriorities[processId] = ProcessPriorityClass.Normal;
                        }
                    }
                    catch
                    {
                        // Ignorar erros
                    }
                    finally
                    {
                        try { process.Dispose(); } catch { }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[PriorityCache] Erro ao criar estado de multitarefa: {ex.Message}");
            }
            
            return state;
        }
        
        /// <summary>
        /// Captura estado atual do sistema
        /// </summary>
        private PriorityState CaptureCurrentState()
        {
            var state = new PriorityState
            {
                Name = "current_state",
                CreatedAt = DateTime.UtcNow,
                ProcessPriorities = new Dictionary<int, ProcessPriorityClass>(),
                ProcessAffinities = new Dictionary<int, IntPtr>()
            };
            
            try
            {
                var processes = Process.GetProcesses();
                
                foreach (var process in processes)
                {
                    try
                    {
                        var processId = process.Id;
                        state.ProcessPriorities[processId] = process.PriorityClass;
                        state.ProcessAffinities[processId] = process.ProcessorAffinity;
                    }
                    catch
                    {
                        // Ignorar erros
                    }
                    finally
                    {
                        try { process.Dispose(); } catch { }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[PriorityCache] Erro ao capturar estado atual: {ex.Message}");
            }
            
            return state;
        }
        
        /// <summary>
        /// Aplica um estado de prioridades
        /// </summary>
        private void ApplyPriorityState(PriorityState state)
        {
            try
            {
                int priorityChanges = 0;
                int affinityChanges = 0;
                
                foreach (var kvp in state.ProcessPriorities)
                {
                    try
                    {
                        var processId = kvp.Key;
                        var priority = kvp.Value;
                        
                        var process = Process.GetProcessById(processId);
                        if (process != null && !process.HasExited)
                        {
                            // Somente alterar se diferente
                            if (process.PriorityClass != priority)
                            {
                                process.PriorityClass = priority;
                                priorityChanges++;
                            }
                        }
                    }
                    catch
                    {
                        // Processo pode ter terminado
                    }
                }
                
                // Aplicar afinidades se especificadas
                foreach (var kvp in state.ProcessAffinities)
                {
                    try
                    {
                        var processId = kvp.Key;
                        var affinity = kvp.Value;
                        
                        var process = Process.GetProcessById(processId);
                        if (process != null && !process.HasExited)
                        {
                            // Somente alterar se diferente
                            if (process.ProcessorAffinity != affinity)
                            {
                                process.ProcessorAffinity = affinity;
                                affinityChanges++;
                            }
                        }
                    }
                    catch
                    {
                        // Processo pode ter terminado
                    }
                }
                
                // CORREÇÃO: Log consolidado em vez de um log por processo (reduz spam massivo)
                if (priorityChanges > 0 || affinityChanges > 0)
                {
                    _logger.LogInfo($"[PriorityCache] Estado '{state.Name}' aplicado: {priorityChanges} prioridades, {affinityChanges} afinidades alteradas");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[PriorityCache] Erro ao aplicar estado de prioridades: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Verifica se é um processo crítico do sistema
        /// </summary>
        private bool IsCriticalSystemProcess(string processName)
        {
            var criticalNames = new[]
            {
                "dwm", "csrss", "winlogon", "explorer", "system", "lsass", "services",
                "svchost", "fontdrvhost", "audiodg", "conhost", "runtimebroker"
            };
            
            return criticalNames.Any(critical => processName.Contains(critical, StringComparison.OrdinalIgnoreCase));
        }
        
        /// <summary>
        /// Restaura todas as prioridades para seus valores originais
        /// </summary>
        public void RestoreAllPriorities()
        {
            try
            {
                ProcessPrioritySnapshot[] snapshots;
                
                lock (_lock)
                {
                    snapshots = _priorityCache.Values.ToArray();
                }
                
                foreach (var snapshot in snapshots)
                {
                    try
                    {
                        var process = Process.GetProcessById(snapshot.ProcessId);
                        if (process != null && !process.HasExited)
                        {
                            if (process.PriorityClass != snapshot.PriorityClass)
                            {
                                process.PriorityClass = snapshot.PriorityClass;
                                _logger.LogInfo($"[PriorityCache] Prioridade de {snapshot.ProcessName} restaurada para {snapshot.PriorityClass}");
                            }
                        }
                    }
                    catch
                    {
                        // Processo pode ter terminado
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[PriorityCache] Erro ao restaurar prioridades: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Obtém snapshot de prioridade de um processo
        /// </summary>
        public ProcessPrioritySnapshot? GetPrioritySnapshot(int processId)
        {
            lock (_lock)
            {
                return _priorityCache.TryGetValue(processId, out var snapshot) ? snapshot : null;
            }
        }
        
        /// <summary>
        /// Obtém snapshot de afinidade de um processo
        /// </summary>
        public ProcessAffinitySnapshot? GetAffinitySnapshot(int processId)
        {
            lock (_lock)
            {
                return _affinityCache.TryGetValue(processId, out var snapshot) ? snapshot : null;
            }
        }
        
        /// <summary>
        /// Força atualização do cache
        /// </summary>
        public async Task ForceCacheRefresh()
        {
            await RefreshPriorityCache();
            _lastUpdateTimer.Restart();
        }
        
        public void Dispose()
        {
            Stop();
            _contextDetector.AppSwitchDetected -= OnAppSwitchDetected;
            GC.SuppressFinalize(this);
        }
    }
    
    /// <summary>
    /// Snapshot de prioridade de processo
    /// </summary>
    public class ProcessPrioritySnapshot
    {
        public int ProcessId { get; set; }
        public string ProcessName { get; set; } = "";
        public ProcessPriorityClass PriorityClass { get; set; }
        public DateTime CaptureTime { get; set; }
    }
    
    /// <summary>
    /// Snapshot de afinidade de processo
    /// </summary>
    public class ProcessAffinitySnapshot
    {
        public int ProcessId { get; set; }
        public string ProcessName { get; set; } = "";
        public IntPtr AffinityMask { get; set; }
        public DateTime CaptureTime { get; set; }
    }
    
    /// <summary>
    /// Estado de prioridades otimizado
    /// </summary>
    public class PriorityState
    {
        public string Name { get; set; } = "";
        public DateTime CreatedAt { get; set; }
        public Dictionary<int, ProcessPriorityClass> ProcessPriorities { get; set; } = new();
        public Dictionary<int, IntPtr> ProcessAffinities { get; set; } = new();
    }
}