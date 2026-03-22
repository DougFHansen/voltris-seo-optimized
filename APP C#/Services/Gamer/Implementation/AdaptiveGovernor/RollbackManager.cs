using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Gamer.Interfaces;

namespace VoltrisOptimizer.Services.Gamer.Implementation.AdaptiveGovernor
{
    /// <summary>
    /// Gerenciador de rollback - reverte todas as ações aplicadas
    /// Garante que nada fique permanente se o sistema falhar
    /// </summary>
    internal class RollbackManager
    {
        private readonly ILoggingService _logger;
        private readonly IProcessPrioritizer _processPrioritizer;
        private readonly List<RollbackData> _rollbackStack = new List<RollbackData>();
        private readonly object _lock = new object();
        
        // Windows API para afinidade
        [DllImport("kernel32.dll")]
        private static extern bool SetProcessAffinityMask(IntPtr hProcess, IntPtr dwProcessAffinityMask);
        
        public RollbackManager(ILoggingService logger, IProcessPrioritizer processPrioritizer)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _processPrioritizer = processPrioritizer ?? throw new ArgumentNullException(nameof(processPrioritizer));
        }
        
        /// <summary>
        /// Registra uma ação para rollback futuro
        /// </summary>
        public void RegisterRollback(RollbackData rollbackData)
        {
            if (rollbackData == null)
                return;
            
            lock (_lock)
            {
                // Verificar se já existe rollback para este processo e tipo
                var existing = _rollbackStack.FirstOrDefault(r => 
                    r.ProcessId == rollbackData.ProcessId && 
                    r.Type == rollbackData.Type);
                
                if (existing != null)
                {
                    // Atualizar existente
                    _rollbackStack.Remove(existing);
                }
                
                _rollbackStack.Add(rollbackData);
                _logger.LogInfo($"[RollbackManager] Rollback registrado: {rollbackData.Type} para processo {rollbackData.ProcessId}");
            }
        }
        
        /// <summary>
        /// Reverte todas as ações registradas
        /// </summary>
        public async Task<int> RollbackAllAsync(CancellationToken cancellationToken = default)
        {
            List<RollbackData> toRollback;
            
            lock (_lock)
            {
                toRollback = _rollbackStack.ToList();
                _rollbackStack.Clear();
            }
            
            int rolledBack = 0;
            
            foreach (var rollback in toRollback)
            {
                try
                {
                    var success = await RollbackSingleAsync(rollback, cancellationToken);
                    if (success)
                    {
                        rolledBack++;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[RollbackManager] Erro ao reverter {rollback.Type}: {ex.Message}");
                }
            }
            
            if (rolledBack > 0)
            {
                _logger.LogInfo($"[RollbackManager] {rolledBack} ação(ões) revertida(s)");
            }
            
            return rolledBack;
        }
        
        /// <summary>
        /// Reverte uma ação específica
        /// </summary>
        private async Task<bool> RollbackSingleAsync(RollbackData rollback, CancellationToken cancellationToken)
        {
            return await Task.Run(() =>
            {
                try
                {
                    switch (rollback.Type)
                    {
                        case RollbackType.ProcessPriority:
                            return RollbackProcessPriority(rollback);
                        
                        case RollbackType.ProcessAffinity:
                            return RollbackProcessAffinity(rollback);
                        
                        default:
                            _logger.LogWarning($"[RollbackManager] Tipo de rollback desconhecido: {rollback.Type}");
                            return false;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[RollbackManager] Erro ao reverter {rollback.Type}: {ex.Message}", ex);
                    return false;
                }
            }, cancellationToken);
        }
        
        private bool RollbackProcessPriority(RollbackData rollback)
        {
            try
            {
                using var process = Process.GetProcessById(rollback.ProcessId);
                
                if (rollback.OriginalPriority.HasValue)
                {
                    process.PriorityClass = rollback.OriginalPriority.Value;
                    _logger.LogInfo($"[RollbackManager] Prioridade do processo {rollback.ProcessId} restaurada para {rollback.OriginalPriority.Value}");
                    return true;
                }
            }
            catch (ArgumentException)
            {
                // Processo não existe mais - não é erro
                _logger.LogInfo($"[RollbackManager] Processo {rollback.ProcessId} não existe mais (já encerrou)");
                return true; // Considerar sucesso
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[RollbackManager] Erro ao restaurar prioridade do processo {rollback.ProcessId}: {ex.Message}");
            }
            
            return false;
        }
        
        private bool RollbackProcessAffinity(RollbackData rollback)
        {
            try
            {
                using var process = Process.GetProcessById(rollback.ProcessId);
                
                if (rollback.OriginalAffinity.HasValue)
                {
                    if (SetProcessAffinityMask(process.Handle, rollback.OriginalAffinity.Value))
                    {
                        _logger.LogInfo($"[RollbackManager] Afinidade do processo {rollback.ProcessId} restaurada");
                        return true;
                    }
                }
            }
            catch (ArgumentException)
            {
                // Processo não existe mais - não é erro
                _logger.LogInfo($"[RollbackManager] Processo {rollback.ProcessId} não existe mais (já encerrou)");
                return true; // Considerar sucesso
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[RollbackManager] Erro ao restaurar afinidade do processo {rollback.ProcessId}: {ex.Message}");
            }
            
            return false;
        }
        
        /// <summary>
        /// Limpa o stack de rollback (usado quando tudo foi revertido)
        /// </summary>
        public void Clear()
        {
            lock (_lock)
            {
                _rollbackStack.Clear();
            }
        }
        
        /// <summary>
        /// Obtém número de ações pendentes de rollback
        /// </summary>
        public int PendingRollbacks
        {
            get
            {
                lock (_lock)
                {
                    return _rollbackStack.Count;
                }
            }
        }
    }
}

