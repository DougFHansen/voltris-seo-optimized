using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using Microsoft.Win32;
using VoltrisOptimizer.Interfaces;

namespace VoltrisOptimizer.Services.Gamer.OptimizationModules
{
    /// <summary>
    /// Registry de rollback para armazenar snapshots do estado do sistema
    /// antes de aplicar otimizações temporárias
    /// </summary>
    public class RollbackRegistry
    {
        private readonly ILoggingService? _logger;
        private readonly Dictionary<string, RollbackEntry> _entries = new();
        private readonly object _lock = new();
        
        public RollbackRegistry(ILoggingService? logger = null)
        {
            _logger = logger;
        }
        
        /// <summary>
        /// Registra um snapshot de power plan
        /// </summary>
        public void RegisterPowerPlan(string originalGuid, string originalName)
        {
            lock (_lock)
            {
                _entries["PowerPlan"] = new RollbackEntry
                {
                    Type = RollbackType.PowerPlan,
                    Timestamp = DateTime.Now,
                    Data = JsonSerializer.Serialize(new { Guid = originalGuid, Name = originalName })
                };
                _logger?.LogInfo($"[RollbackRegistry] Power plan registrado: {originalName} ({originalGuid})");
            }
        }
        
        /// <summary>
        /// Registra um snapshot de registry key
        /// </summary>
        public void RegisterRegistryKey(RegistryHive hive, string subKey, string valueName, object? originalValue, RegistryValueKind valueKind)
        {
            lock (_lock)
            {
                var key = $"{hive}\\{subKey}\\{valueName}";
                _entries[key] = new RollbackEntry
                {
                    Type = RollbackType.Registry,
                    Timestamp = DateTime.Now,
                    Data = JsonSerializer.Serialize(new 
                    { 
                        Hive = hive.ToString(),
                        SubKey = subKey,
                        ValueName = valueName,
                        Value = originalValue?.ToString(),
                        ValueKind = valueKind.ToString()
                    })
                };
                _logger?.LogInfo($"[RollbackRegistry] Registry key registrada: {key}");
            }
        }
        
        /// <summary>
        /// Registra um snapshot de prioridade de processo
        /// </summary>
        public void RegisterProcessPriority(int processId, System.Diagnostics.ProcessPriorityClass originalPriority)
        {
            lock (_lock)
            {
                var key = $"ProcessPriority_{processId}";
                _entries[key] = new RollbackEntry
                {
                    Type = RollbackType.ProcessPriority,
                    Timestamp = DateTime.Now,
                    Data = JsonSerializer.Serialize(new { ProcessId = processId, Priority = originalPriority.ToString() })
                };
                _logger?.LogInfo($"[RollbackRegistry] Prioridade de processo registrada: PID {processId} = {originalPriority}");
            }
        }
        
        /// <summary>
        /// Registra um snapshot de afinidade de processo
        /// </summary>
        public void RegisterProcessAffinity(int processId, IntPtr originalAffinity)
        {
            lock (_lock)
            {
                var key = $"ProcessAffinity_{processId}";
                _entries[key] = new RollbackEntry
                {
                    Type = RollbackType.ProcessAffinity,
                    Timestamp = DateTime.Now,
                    Data = JsonSerializer.Serialize(new { ProcessId = processId, Affinity = originalAffinity.ToInt64() })
                };
                _logger?.LogInfo($"[RollbackRegistry] Afinidade de processo registrada: PID {processId}");
            }
        }
        
        /// <summary>
        /// Obtém o snapshot do power plan
        /// </summary>
        public (string Guid, string Name)? GetPowerPlanSnapshot()
        {
            lock (_lock)
            {
                if (_entries.TryGetValue("PowerPlan", out var entry))
                {
                    var data = JsonSerializer.Deserialize<JsonElement>(entry.Data);
                    return (data.GetProperty("Guid").GetString() ?? "", data.GetProperty("Name").GetString() ?? "");
                }
                return null;
            }
        }
        
        /// <summary>
        /// Obtém todos os snapshots de registry
        /// </summary>
        public IEnumerable<RegistrySnapshot> GetRegistrySnapshots()
        {
            lock (_lock)
            {
                return _entries
                    .Where(e => e.Value.Type == RollbackType.Registry)
                    .Select(e =>
                    {
                        var data = JsonSerializer.Deserialize<JsonElement>(e.Value.Data);
                        return new RegistrySnapshot
                        {
                            Hive = Enum.Parse<RegistryHive>(data.GetProperty("Hive").GetString()!),
                            SubKey = data.GetProperty("SubKey").GetString()!,
                            ValueName = data.GetProperty("ValueName").GetString()!,
                            OriginalValue = data.GetProperty("Value").GetString(),
                            ValueKind = Enum.Parse<RegistryValueKind>(data.GetProperty("ValueKind").GetString()!)
                        };
                    });
            }
        }
        
        /// <summary>
        /// Obtém todos os snapshots de processo
        /// </summary>
        public IEnumerable<ProcessSnapshot> GetProcessSnapshots()
        {
            lock (_lock)
            {
                var priorities = _entries
                    .Where(e => e.Value.Type == RollbackType.ProcessPriority)
                    .Select(e =>
                    {
                        var data = JsonSerializer.Deserialize<JsonElement>(e.Value.Data);
                        return new ProcessSnapshot
                        {
                            ProcessId = data.GetProperty("ProcessId").GetInt32(),
                            OriginalPriority = Enum.Parse<System.Diagnostics.ProcessPriorityClass>(data.GetProperty("Priority").GetString()!),
                            OriginalAffinity = null
                        };
                    });
                
                var affinities = _entries
                    .Where(e => e.Value.Type == RollbackType.ProcessAffinity)
                    .Select(e =>
                    {
                        var data = JsonSerializer.Deserialize<JsonElement>(e.Value.Data);
                        return new ProcessSnapshot
                        {
                            ProcessId = data.GetProperty("ProcessId").GetInt32(),
                            OriginalPriority = System.Diagnostics.ProcessPriorityClass.Normal,
                            OriginalAffinity = new IntPtr(data.GetProperty("Affinity").GetInt64())
                        };
                    });
                
                // Combinar por ProcessId
                return priorities
                    .GroupBy(p => p.ProcessId)
                    .Select(g =>
                    {
                        var priority = g.First();
                        var affinity = affinities.FirstOrDefault(a => a.ProcessId == g.Key);
                        return new ProcessSnapshot
                        {
                            ProcessId = priority.ProcessId,
                            OriginalPriority = priority.OriginalPriority,
                            OriginalAffinity = affinity?.OriginalAffinity
                        };
                    });
            }
        }
        
        /// <summary>
        /// Limpa todos os snapshots
        /// </summary>
        public void Clear()
        {
            lock (_lock)
            {
                _entries.Clear();
                _logger?.LogInfo("[RollbackRegistry] Registry limpo");
            }
        }
        
        /// <summary>
        /// Obtém contagem de snapshots
        /// </summary>
        public int Count => _entries.Count;
    }
    
    /// <summary>
    /// Tipo de rollback
    /// </summary>
    public enum RollbackType
    {
        PowerPlan,
        Registry,
        ProcessPriority,
        ProcessAffinity
    }
    
    /// <summary>
    /// Entrada no registry de rollback
    /// </summary>
    internal class RollbackEntry
    {
        public RollbackType Type { get; set; }
        public DateTime Timestamp { get; set; }
        public string Data { get; set; } = "";
    }
    
    /// <summary>
    /// Snapshot de registry
    /// </summary>
    public class RegistrySnapshot
    {
        public RegistryHive Hive { get; set; }
        public string SubKey { get; set; } = "";
        public string ValueName { get; set; } = "";
        public string? OriginalValue { get; set; }
        public RegistryValueKind ValueKind { get; set; }
    }
    
    /// <summary>
    /// Snapshot de processo
    /// </summary>
    public class ProcessSnapshot
    {
        public int ProcessId { get; set; }
        public System.Diagnostics.ProcessPriorityClass OriginalPriority { get; set; }
        public IntPtr? OriginalAffinity { get; set; }
    }
}

