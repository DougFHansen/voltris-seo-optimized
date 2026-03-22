using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using VoltrisOptimizer.Services.Gamer.Models;
using GamerModels = VoltrisOptimizer.Services.Gamer.Models;

namespace VoltrisOptimizer.Services.Gamer.Implementation.AdaptiveGovernor
{
    /// <summary>
    /// Camada de ação - aplica ações seguras e reversíveis
    /// NUNCA aplica ações irreversíveis ou perigosas
    /// </summary>
    internal class ActionLayer
    {
        private readonly ILoggingService _logger;
        private readonly IProcessPrioritizer _processPrioritizer;
        private readonly IMemoryGamingOptimizer _memoryOptimizer;
        private readonly Process? _gameProcess;
        
        // Windows API para afinidade
        [DllImport("kernel32.dll")]
        private static extern bool SetProcessAffinityMask(IntPtr hProcess, IntPtr dwProcessAffinityMask);
        
        [DllImport("kernel32.dll")]
        private static extern bool GetProcessAffinityMask(IntPtr hProcess, out IntPtr lpProcessAffinityMask, out IntPtr lpSystemAffinityMask);
        
        public ActionLayer(
            ILoggingService logger,
            IProcessPrioritizer processPrioritizer,
            IMemoryGamingOptimizer memoryOptimizer,
            Process? gameProcess)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _processPrioritizer = processPrioritizer ?? throw new ArgumentNullException(nameof(processPrioritizer));
            _memoryOptimizer = memoryOptimizer ?? throw new ArgumentNullException(nameof(memoryOptimizer));
            _gameProcess = gameProcess;
        }
        
        /// <summary>
        /// Executa uma ação adaptativa de forma segura
        /// </summary>
        public async Task<ActionResult> ExecuteActionAsync(AdaptiveAction action, CancellationToken cancellationToken = default)
        {
            var result = new ActionResult
            {
                Action = action,
                Success = false,
                Timestamp = DateTime.UtcNow
            };
            
            try
            {
                switch (action.Type)
                {
                    case ActionType.IncreaseGamePriority:
                        result = await IncreaseGamePriorityAsync(cancellationToken);
                        break;
                    
                    case ActionType.ReduceBackgroundPriorities:
                        result = await ReduceBackgroundPrioritiesAsync(cancellationToken);
                        break;
                    
                    case ActionType.CleanStandbyList:
                        result = await CleanStandbyListAsync(cancellationToken);
                        break;
                    
                    case ActionType.AdjustAffinity:
                        result = await AdjustAffinityAsync(cancellationToken);
                        break;
                    
                    default:
                        result.ErrorMessage = "Tipo de ação desconhecido";
                        return result;
                }
                
                result.Success = true;
                _logger.LogInfo($"[ActionLayer] ✓ Ação executada: {action.Type} - {action.Reason}");
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.ErrorMessage = ex.Message;
                _logger.LogError($"[ActionLayer] ✗ Erro ao executar ação {action.Type}: {ex.Message}", ex);
            }
            
            return result;
        }
        
        private async Task<ActionResult> IncreaseGamePriorityAsync(CancellationToken cancellationToken)
        {
            var result = new ActionResult
            {
                Action = new AdaptiveAction { Type = ActionType.IncreaseGamePriority },
                Timestamp = DateTime.UtcNow
            };
            
            if (_gameProcess == null || _gameProcess.HasExited)
            {
                result.ErrorMessage = "Processo do jogo não disponível";
                return result;
            }
            
            return await Task.Run(() =>
            {
                try
                {
                    // Verificar prioridade atual
                    var currentPriority = _gameProcess.PriorityClass;
                    
                    // Se já está em High ou RealTime, não fazer nada
                    if (currentPriority == ProcessPriorityClass.High || 
                        currentPriority == ProcessPriorityClass.RealTime)
                    {
                        result.Success = true;
                        result.Message = $"Prioridade já está em {currentPriority}";
                        return result;
                    }
                    
                    // Aumentar para High (nunca RealTime - muito perigoso)
                    _processPrioritizer.SetPriority(
                        _gameProcess.Id, 
                        GamerModels.ProcessPriorityLevel.High);
                    
                    result.Success = true;
                    result.Message = $"Prioridade aumentada de {currentPriority} para High";
                    result.RollbackData = new RollbackData
                    {
                        Type = RollbackType.ProcessPriority,
                        ProcessId = _gameProcess.Id,
                        OriginalPriority = currentPriority
                    };
                    
                    return result;
                }
                catch (Exception ex)
                {
                    result.ErrorMessage = ex.Message;
                    return result;
                }
            }, cancellationToken);
        }
        
        private async Task<ActionResult> ReduceBackgroundPrioritiesAsync(CancellationToken cancellationToken)
        {
            var result = new ActionResult
            {
                Action = new AdaptiveAction { Type = ActionType.ReduceBackgroundPriorities },
                Timestamp = DateTime.UtcNow
            };
            
            return await Task.Run(() =>
            {
                try
                {
                    // Usar método existente do ProcessPrioritizer
                    var count = _processPrioritizer.LowerBackgroundProcessesPriority();
                    
                    result.Success = true;
                    result.Message = $"{count} processos em background tiveram prioridade reduzida";
                    
                    // Nota: Rollback é gerenciado pelo ProcessPrioritizer
                    return result;
                }
                catch (Exception ex)
                {
                    result.ErrorMessage = ex.Message;
                    return result;
                }
            }, cancellationToken);
        }
        
        private async Task<ActionResult> CleanStandbyListAsync(CancellationToken cancellationToken)
        {
            var result = new ActionResult
            {
                Action = new AdaptiveAction { Type = ActionType.CleanStandbyList },
                Timestamp = DateTime.UtcNow
            };
            
            return await Task.Run(() =>
            {
                try
                {
                    // Limpar standby list (ação temporária, não precisa rollback)
                    _memoryOptimizer.CleanStandbyList();
                    
                    result.Success = true;
                    result.Message = "Standby list limpa";
                    
                    // Não precisa rollback - efeito é temporário
                    return result;
                }
                catch (Exception ex)
                {
                    result.ErrorMessage = ex.Message;
                    return result;
                }
            }, cancellationToken);
        }
        
        private async Task<ActionResult> AdjustAffinityAsync(CancellationToken cancellationToken)
        {
            var result = new ActionResult
            {
                Action = new AdaptiveAction { Type = ActionType.AdjustAffinity },
                Timestamp = DateTime.UtcNow
            };
            
            if (_gameProcess == null || _gameProcess.HasExited)
            {
                result.ErrorMessage = "Processo do jogo não disponível";
                return result;
            }
            
            return await Task.Run(() =>
            {
                try
                {
                    var coreCount = Environment.ProcessorCount;
                    
                    // SEGURANÇA: Só ajustar afinidade em CPUs com 8+ cores
                    // Em CPUs pequenas, deixar Windows gerenciar
                    if (coreCount < 8)
                    {
                        result.Success = false;
                        result.ErrorMessage = $"Afinidade não ajustada: CPU tem apenas {coreCount} cores (mínimo: 8)";
                        return result;
                    }
                    
                    // Obter afinidade atual
                    if (!GetProcessAffinityMask(_gameProcess.Handle, out var currentAffinity, out var systemAffinity))
                    {
                        result.ErrorMessage = "Não foi possível obter afinidade atual";
                        return result;
                    }
                    
                    // Reservar apenas core 0 para sistema, usar todos os outros para o jogo
                    IntPtr newAffinity = (IntPtr)(((1L << coreCount) - 1) & ~1L);
                    
                    if (SetProcessAffinityMask(_gameProcess.Handle, newAffinity))
                    {
                        result.Success = true;
                        result.Message = $"Afinidade ajustada: cores 1-{coreCount - 1} (core 0 reservado)";
                        result.RollbackData = new RollbackData
                        {
                            Type = RollbackType.ProcessAffinity,
                            ProcessId = _gameProcess.Id,
                            OriginalAffinity = currentAffinity
                        };
                    }
                    else
                    {
                        result.ErrorMessage = "Não foi possível definir afinidade";
                    }
                    
                    return result;
                }
                catch (Exception ex)
                {
                    result.ErrorMessage = ex.Message;
                    return result;
                }
            }, cancellationToken);
        }
    }
    
    /// <summary>
    /// Resultado da execução de uma ação
    /// </summary>
    internal class ActionResult
    {
        public AdaptiveAction Action { get; set; } = null!;
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public string ErrorMessage { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public RollbackData? RollbackData { get; set; }
    }
    
    /// <summary>
    /// Dados para rollback
    /// </summary>
    internal class RollbackData
    {
        public RollbackType Type { get; set; }
        public int ProcessId { get; set; }
        public ProcessPriorityClass? OriginalPriority { get; set; }
        public IntPtr? OriginalAffinity { get; set; }
    }
    
    /// <summary>
    /// Tipos de rollback
    /// </summary>
    internal enum RollbackType
    {
        ProcessPriority,
        ProcessAffinity
    }
}

