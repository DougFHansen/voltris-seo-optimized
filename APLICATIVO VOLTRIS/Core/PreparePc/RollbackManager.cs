using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Core.PreparePc.Interfaces;
using VoltrisOptimizer.Core.PreparePc.Steps;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.Core.PreparePc
{
    /// <summary>
    /// Gerenciador de rollback para reverter ações do Prepare PC
    /// </summary>
    public class RollbackManager : IRollbackManager
    {
        private readonly ILoggingService _logger;
        private readonly string _backupBasePath;
        private readonly string _actionsFilePath;
        private readonly List<RollbackAction> _actions = new();
        private readonly Dictionary<string, IRepairStep> _stepResolvers;
        
        public RollbackManager(ILoggingService logger, string backupBasePath)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _backupBasePath = backupBasePath;
            _actionsFilePath = Path.Combine(backupBasePath, "rollback_actions.json");
            
            // Inicializar resolvers de steps
            _stepResolvers = new Dictionary<string, IRepairStep>
            {
                { "Backup", new BackupStep(logger, backupBasePath) },
                { "Power Plan", new PowerPlanStep(logger, backupBasePath) }
            };
            
            // Carregar ações existentes
            LoadActions();
        }
        
        /// <summary>
        /// Registra uma ação para possível rollback
        /// </summary>
        public void RegisterAction(string stepName, string backupPath, DateTime timestamp)
        {
            var action = new RollbackAction
            {
                StepName = stepName,
                BackupPath = backupPath,
                Timestamp = timestamp,
                Type = DetermineActionType(stepName),
                IsRolledBack = false
            };
            
            _actions.Add(action);
            SaveActions();
            
            _logger.LogInfo($"[Rollback] Ação registrada: {stepName} -> {backupPath}");
        }
        
        /// <summary>
        /// Obtém todas as ações registradas
        /// </summary>
        public RollbackAction[] GetActions()
        {
            return _actions.Where(a => !a.IsRolledBack).ToArray();
        }
        
        /// <summary>
        /// Executa rollback de todas as ações em ordem inversa
        /// </summary>
        public async Task<bool> RollbackAllAsync(IProgress<StepProgress>? progress = null, CancellationToken ct = default)
        {
            var actionsToRollback = _actions
                .Where(a => !a.IsRolledBack)
                .OrderByDescending(a => a.Timestamp)
                .ToList();
            
            if (!actionsToRollback.Any())
            {
                _logger.LogInfo("[Rollback] Nenhuma ação para reverter");
                return true;
            }
            
            _logger.LogInfo($"[Rollback] Revertendo {actionsToRollback.Count} ações...");
            
            int successCount = 0;
            int failCount = 0;
            
            for (int i = 0; i < actionsToRollback.Count; i++)
            {
                var action = actionsToRollback[i];
                
                progress?.Report(new StepProgress
                {
                    StepName = "Rollback",
                    PercentComplete = ((i + 1) * 100) / actionsToRollback.Count,
                    CurrentAction = $"Revertendo: {action.StepName}"
                });
                
                var success = await RollbackActionInternalAsync(action, ct);
                
                if (success)
                {
                    successCount++;
                    action.IsRolledBack = true;
                }
                else
                {
                    failCount++;
                    _logger.LogWarning($"[Rollback] Falha ao reverter: {action.StepName}");
                }
            }
            
            SaveActions();
            
            _logger.LogInfo($"[Rollback] Concluído: {successCount} sucesso, {failCount} falhas");
            
            return failCount == 0;
        }
        
        /// <summary>
        /// Executa rollback de uma ação específica
        /// </summary>
        public async Task<bool> RollbackActionAsync(string stepName, CancellationToken ct = default)
        {
            var action = _actions.FirstOrDefault(a => a.StepName == stepName && !a.IsRolledBack);
            
            if (action == null)
            {
                _logger.LogWarning($"[Rollback] Ação não encontrada: {stepName}");
                return false;
            }
            
            var success = await RollbackActionInternalAsync(action, ct);
            
            if (success)
            {
                action.IsRolledBack = true;
                SaveActions();
            }
            
            return success;
        }
        
        /// <summary>
        /// Limpa backups antigos
        /// </summary>
        public async Task CleanOldBackupsAsync(int daysToKeep = 7)
        {
            await Task.Run(() =>
            {
                try
                {
                    if (!Directory.Exists(_backupBasePath)) return;
                    
                    var cutoffDate = DateTime.Now.AddDays(-daysToKeep);
                    var dirsToDelete = new List<string>();
                    
                    foreach (var dir in Directory.GetDirectories(_backupBasePath))
                    {
                        var dirInfo = new DirectoryInfo(dir);
                        if (dirInfo.CreationTime < cutoffDate)
                        {
                            dirsToDelete.Add(dir);
                        }
                    }
                    
                    foreach (var dir in dirsToDelete)
                    {
                        try
                        {
                            Directory.Delete(dir, true);
                            _logger.LogInfo($"[Rollback] Backup antigo removido: {dir}");
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"[Rollback] Erro ao remover backup: {ex.Message}");
                        }
                    }
                    
                    // Limpar ações antigas
                    _actions.RemoveAll(a => a.Timestamp < cutoffDate);
                    SaveActions();
                    
                    _logger.LogInfo($"[Rollback] Limpeza concluída: {dirsToDelete.Count} backups removidos");
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[Rollback] Erro na limpeza: {ex.Message}", ex);
                }
            });
        }
        
        private async Task<bool> RollbackActionInternalAsync(RollbackAction action, CancellationToken ct)
        {
            try
            {
                _logger.LogInfo($"[Rollback] Revertendo: {action.StepName}");
                
                // Verificar se o backup existe
                if (!string.IsNullOrEmpty(action.BackupPath) && !File.Exists(action.BackupPath) && !Directory.Exists(action.BackupPath))
                {
                    _logger.LogWarning($"[Rollback] Backup não encontrado: {action.BackupPath}");
                    return false;
                }
                
                // Tentar usar o step resolver específico
                if (_stepResolvers.TryGetValue(action.StepName, out var step))
                {
                    var result = await step.RollbackAsync(action.BackupPath, ct);
                    return result.Success;
                }
                
                // Rollback genérico baseado no tipo
                return action.Type switch
                {
                    "registry" => await RollbackRegistryAsync(action.BackupPath, ct),
                    "powerplan" => await RollbackPowerPlanAsync(action.BackupPath, ct),
                    "service" => await RollbackServiceAsync(action.BackupPath, ct),
                    _ => false
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"[Rollback] Erro: {ex.Message}", ex);
                return false;
            }
        }
        
        private async Task<bool> RollbackRegistryAsync(string backupPath, CancellationToken ct)
        {
            try
            {
                var psi = new System.Diagnostics.ProcessStartInfo
                {
                    FileName = "reg.exe",
                    Arguments = $"import \"{backupPath}\"",
                    UseShellExecute = false,
                    CreateNoWindow = true
                };
                
                using var proc = System.Diagnostics.Process.Start(psi);
                if (proc != null)
                {
                    await proc.WaitForExitAsync(ct);
                    return proc.ExitCode == 0;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }
        
        private async Task<bool> RollbackPowerPlanAsync(string backupPath, CancellationToken ct)
        {
            try
            {
                var psi = new System.Diagnostics.ProcessStartInfo
                {
                    FileName = "powercfg",
                    Arguments = $"/import \"{backupPath}\"",
                    UseShellExecute = false,
                    CreateNoWindow = true
                };
                
                using var proc = System.Diagnostics.Process.Start(psi);
                if (proc != null)
                {
                    await proc.WaitForExitAsync(ct);
                    return proc.ExitCode == 0;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }
        
        private async Task<bool> RollbackServiceAsync(string backupPath, CancellationToken ct)
        {
            // Ler snapshot de serviços e restaurar estados
            try
            {
                if (!File.Exists(backupPath)) return false;
                
                var json = await File.ReadAllTextAsync(backupPath, ct);
                var snapshot = JsonSerializer.Deserialize<ServiceSnapshot>(json);
                
                if (snapshot?.Services == null) return false;
                
                foreach (var svc in snapshot.Services)
                {
                    try
                    {
                        // Restaurar estado do serviço
                        if (svc.WasRunning)
                        {
                            var psi = new System.Diagnostics.ProcessStartInfo
                            {
                                FileName = "sc",
                                Arguments = $"start {svc.Name}",
                                UseShellExecute = false,
                                CreateNoWindow = true
                            };
                            using var proc = System.Diagnostics.Process.Start(psi);
                            proc?.WaitForExit(10000);
                        }
                    }
                    catch
                    {
                        // Continuar com próximo serviço
                    }
                }
                
                return true;
            }
            catch
            {
                return false;
            }
        }
        
        private string DetermineActionType(string stepName)
        {
            return stepName.ToLowerInvariant() switch
            {
                string s when s.Contains("backup") => "backup",
                string s when s.Contains("registry") => "registry",
                string s when s.Contains("power") => "powerplan",
                string s when s.Contains("service") => "service",
                _ => "generic"
            };
        }
        
        private void LoadActions()
        {
            try
            {
                if (File.Exists(_actionsFilePath))
                {
                    var json = File.ReadAllText(_actionsFilePath);
                    var loaded = JsonSerializer.Deserialize<List<RollbackAction>>(json);
                    if (loaded != null)
                    {
                        _actions.Clear();
                        _actions.AddRange(loaded);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[Rollback] Erro ao carregar ações: {ex.Message}");
            }
        }
        
        private void SaveActions()
        {
            try
            {
                Directory.CreateDirectory(Path.GetDirectoryName(_actionsFilePath)!);
                var json = JsonSerializer.Serialize(_actions, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_actionsFilePath, json);
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[Rollback] Erro ao salvar ações: {ex.Message}");
            }
        }
        
        private class ServiceSnapshot
        {
            public List<ServiceState>? Services { get; set; }
        }
        
        private class ServiceState
        {
            public string Name { get; set; } = "";
            public bool WasRunning { get; set; }
            public string StartType { get; set; } = "";
        }
    }
}

