using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Cache global de processos para eliminar chamadas repetidas a Process.GetProcesses()
    /// CRÍTICO: Process.GetProcesses() é MUITO custoso (50-150ms) e causa stuttering
    /// </summary>
    public class ProcessCacheService : IDisposable
    {
        private readonly Dictionary<int, CachedProcessInfo> _cache = new();
        private readonly ReaderWriterLockSlim _lock = new();
        private readonly ILoggingService? _logger;
        private DateTime _lastFullRefresh = DateTime.MinValue;
        private readonly TimeSpan _fullRefreshInterval = TimeSpan.FromSeconds(30);
        private CancellationTokenSource? _cts;
        private Task? _backgroundRefreshTask;
        private bool _disposed = false;

        public ProcessCacheService(ILoggingService? logger = null)
        {
            _logger = logger;
            
            // Iniciar refresh em background
            _cts = new CancellationTokenSource();
            _backgroundRefreshTask = Task.Run(() => BackgroundRefreshLoopAsync(_cts.Token));
            
            _logger?.LogInfo("[ProcessCache] Cache de processos inicializado");
        }

        /// <summary>
        /// Retorna processos do cache (rápido - sem chamadas ao kernel)
        /// </summary>
        public IEnumerable<Process> GetCachedProcesses()
        {
            _lock.EnterReadLock();
            try
            {
                // Filtrar processos que ainda existem
                var validProcesses = new List<Process>();
                foreach (var info in _cache.Values)
                {
                    try
                    {
                        if (!info.Process.HasExited)
                        {
                            validProcesses.Add(info.Process);
                        }
                    }
                    catch
                    {
                        // Processo já terminou
                    }
                }
                return validProcesses;
            }
            finally
            {
                _lock.ExitReadLock();
            }
        }

        /// <summary>
        /// Retorna processos filtrados por nome (rápido - usa cache)
        /// </summary>
        public IEnumerable<Process> GetProcessesByName(string processName)
        {
            _lock.EnterReadLock();
            try
            {
                return _cache.Values
                    .Where(c => c.ProcessName.Equals(processName, StringComparison.OrdinalIgnoreCase))
                    .Select(c => c.Process)
                    .Where(p => !p.HasExited)
                    .ToList();
            }
            catch
            {
                return Array.Empty<Process>();
            }
            finally
            {
                _lock.ExitReadLock();
            }
        }

        /// <summary>
        /// Verifica se processo existe (rápido - usa cache)
        /// </summary>
        public bool ProcessExists(int pid)
        {
            _lock.EnterReadLock();
            try
            {
                if (_cache.TryGetValue(pid, out var info))
                {
                    try
                    {
                        return !info.Process.HasExited;
                    }
                    catch
                    {
                        return false;
                    }
                }
                return false;
            }
            finally
            {
                _lock.ExitReadLock();
            }
        }

        /// <summary>
        /// Loop de refresh em background (não bloqueia)
        /// </summary>
        private async Task BackgroundRefreshLoopAsync(CancellationToken ct)
        {
            while (!ct.IsCancellationRequested)
            {
                try
                {
                    await Task.Delay(_fullRefreshInterval, ct);
                    await RefreshCacheAsync();
                }
                catch (OperationCanceledException)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger?.LogWarning($"[ProcessCache] Erro no refresh: {ex.Message}");
                }
            }
        }

        /// <summary>
        /// Atualiza cache de processos (executado em background)
        /// </summary>
        private async Task RefreshCacheAsync()
        {
            try
            {
                // Executar Process.GetProcesses() em background thread
                var processes = await Task.Run(() => Process.GetProcesses());

                _lock.EnterWriteLock();
                try
                {
                    // Limpar processos antigos
                    var toRemove = _cache.Keys
                        .Except(processes.Select(p => p.Id))
                        .ToList();

                    foreach (var pid in toRemove)
                    {
                        if (_cache.TryGetValue(pid, out var info))
                        {
                            try
                            {
                                info.Process?.Dispose();
                            }
                            catch { }
                            _cache.Remove(pid);
                        }
                    }

                    // Adicionar/atualizar processos
                    foreach (var proc in processes)
                    {
                        try
                        {
                            if (!_cache.ContainsKey(proc.Id))
                            {
                                _cache[proc.Id] = new CachedProcessInfo
                                {
                                    Process = proc,
                                    ProcessName = proc.ProcessName,
                                    LastSeen = DateTime.Now
                                };
                            }
                            else
                            {
                                _cache[proc.Id].LastSeen = DateTime.Now;
                            }
                        }
                        catch
                        {
                            // Processo pode ter terminado durante iteração
                        }
                    }

                    _lastFullRefresh = DateTime.Now;
                    
                    _logger?.LogInfo($"[ProcessCache] Cache atualizado: {_cache.Count} processos");
                }
                finally
                {
                    _lock.ExitWriteLock();
                }
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[ProcessCache] Erro ao atualizar cache: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Força refresh imediato (útil para casos específicos)
        /// </summary>
        public async Task ForceRefreshAsync()
        {
            await RefreshCacheAsync();
        }

        public void Dispose()
        {
            if (_disposed)
                return;

            _cts?.Cancel();
            
            try
            {
                _backgroundRefreshTask?.Wait(TimeSpan.FromSeconds(2));
            }
            catch { }

            _cts?.Dispose();

            _lock.EnterWriteLock();
            try
            {
                foreach (var info in _cache.Values)
                {
                    try
                    {
                        info.Process?.Dispose();
                    }
                    catch { }
                }
                _cache.Clear();
            }
            finally
            {
                _lock.ExitWriteLock();
            }

            _lock.Dispose();
            _disposed = true;

            _logger?.LogInfo("[ProcessCache] Cache de processos disposed");
        }

        private class CachedProcessInfo
        {
            public Process Process { get; set; } = null!;
            public string ProcessName { get; set; } = string.Empty;
            public DateTime LastSeen { get; set; }
        }
    }
}
