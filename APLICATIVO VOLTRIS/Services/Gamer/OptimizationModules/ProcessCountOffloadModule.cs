using System;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32;

namespace VoltrisOptimizer.Services.Gamer.OptimizationModules
{
    /// <summary>
    /// Módulo de offload de processos - reduz prioridade de processos de background
    /// e otimiza afinidade de processos do jogo
    /// 
    /// REUTILIZA: IProcessOptimizationService (não duplica lógica)
    /// </summary>
    public class ProcessCountOffloadModule : IGamerOptimizationModule
    {
        public string Name => "Process Count Offload";
        public string Description => "Reduz prioridade de processos de background e otimiza processos do jogo";

        public async Task<ModuleApplyResult> ApplyAsync(GamerSessionContext ctx, CancellationToken ct = default)
        {
            var result = new ModuleApplyResult();
            var changes = new System.Collections.Generic.List<string>();

            try
            {
                ctx.Logger.LogInfo("[ProcessOffload] Aplicando otimizações de processo...");

                // 1. Reduzir prioridade de processos de background
                // REUTILIZA: IProcessOptimizationService.LowerBackgroundPriorities()
                ctx.ProcessService.LowerBackgroundPriorities();
                changes.Add("Prioridades de background reduzidas");
                result.ChangesApplied++;

                // 2. Tentar otimizar processo do jogo se detectado
                var gameProcess = DetectGameProcess();
                if (gameProcess != null)
                {
                    try
                    {
                        // Registrar prioridade original no RollbackRegistry
                        ctx.RollbackRegistry.RegisterProcessPriority(gameProcess.Id, gameProcess.PriorityClass);
                        
                        // Elevar prioridade do jogo para High
                        ctx.ProcessService.SetProcessPriority(gameProcess.Id, GamerModeManager.ProcessPriorityLevel.High);
                        changes.Add($"Prioridade do jogo elevada: PID {gameProcess.Id}");
                        result.ChangesApplied++;

                        // Otimizar afinidade (todos os cores)
                        ctx.RollbackRegistry.RegisterProcessAffinity(gameProcess.Id, gameProcess.ProcessorAffinity);
                        ctx.ProcessService.SetProcessAffinityAllCores(gameProcess.Id);
                        changes.Add($"Afinidade otimizada: PID {gameProcess.Id}");
                        result.ChangesApplied++;
                    }
                    catch (Exception ex)
                    {
                        ctx.Logger.LogWarning($"[ProcessOffload] Erro ao otimizar processo do jogo: {ex.Message}");
                    }
                }

                result.Success = true;
                result.AppliedChanges = changes.ToArray();
                ctx.Logger.LogSuccess($"[ProcessOffload] {result.ChangesApplied} otimizações aplicadas");
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.ErrorMessage = ex.Message;
                ctx.Logger.LogError($"[ProcessOffload] Erro ao aplicar: {ex.Message}", ex);
            }

            return await Task.FromResult(result);
        }

        public async Task<ModuleRevertResult> RevertAsync(GamerSessionContext ctx, CancellationToken ct = default)
        {
            var result = new ModuleRevertResult();
            var changes = new System.Collections.Generic.List<string>();

            try
            {
                ctx.Logger.LogInfo("[ProcessOffload] Revertendo otimizações de processo...");

                // 1. Restaurar prioridades de background
                // REUTILIZA: IProcessOptimizationService.RestoreBackgroundPriorities()
                ctx.ProcessService.RestoreBackgroundPriorities();
                changes.Add("Prioridades de background restauradas");
                result.ChangesReverted++;

                // 2. Restaurar processos individuais
                var processSnapshots = ctx.RollbackRegistry.GetProcessSnapshots().ToList();
                foreach (var snapshot in processSnapshots)
                {
                    try
                    {
                        using var proc = Process.GetProcessById(snapshot.ProcessId);
                        
                        // Restaurar prioridade
                        proc.PriorityClass = snapshot.OriginalPriority;
                        changes.Add($"Prioridade restaurada: PID {snapshot.ProcessId}");
                        result.ChangesReverted++;

                        // Restaurar afinidade se disponível
                        if (snapshot.OriginalAffinity.HasValue)
                        {
                            proc.ProcessorAffinity = snapshot.OriginalAffinity.Value;
                            changes.Add($"Afinidade restaurada: PID {snapshot.ProcessId}");
                            result.ChangesReverted++;
                        }
                    }
                    catch (Exception ex)
                    {
                        ctx.Logger.LogWarning($"[ProcessOffload] Erro ao restaurar processo {snapshot.ProcessId}: {ex.Message}");
                    }
                }

                result.Success = true;
                result.RevertedChanges = changes.ToArray();
                ctx.Logger.LogSuccess($"[ProcessOffload] {result.ChangesReverted} otimizações revertidas");
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.ErrorMessage = ex.Message;
                ctx.Logger.LogError($"[ProcessOffload] Erro ao reverter: {ex.Message}", ex);
            }

            return await Task.FromResult(result);
        }

        /// <summary>
        /// Detecta processo de jogo em execução (heurística simples)
        /// </summary>
        private Process? DetectGameProcess()
        {
            try
            {
                // Lista de processos comuns de jogos
                var gameProcessNames = new[]
                {
                    "csgo", "valorant", "league of legends", "dota2", "overwatch",
                    "fortnite", "apex", "pubg", "warzone", "destiny2",
                    "eldenring", "cyberpunk2077", "witcher3", "gta5", "rdr2"
                };

                var processes = Process.GetProcesses();
                foreach (var proc in processes)
                {
                    try
                    {
                        var name = proc.ProcessName.ToLowerInvariant();
                        if (gameProcessNames.Any(g => name.Contains(g, StringComparison.OrdinalIgnoreCase)))
                        {
                            // Não dispose - o processo será usado pelo caller
                            return proc;
                        }
                    }
                    catch
                    {
                        // Processo pode ter terminado
                    }
                    finally
                    {
                        // Dispose apenas se não for o processo de jogo
                        try
                        {
                            var name = proc.ProcessName.ToLowerInvariant();
                            if (!gameProcessNames.Any(g => name.Contains(g, StringComparison.OrdinalIgnoreCase)))
                            {
                                proc.Dispose();
                            }
                        }
                        catch
                        {
                            // Ignorar erros de dispose
                        }
                    }
                }
            }
            catch
            {
                // Ignorar erros de detecção
            }

            return null;
        }
    }
}

