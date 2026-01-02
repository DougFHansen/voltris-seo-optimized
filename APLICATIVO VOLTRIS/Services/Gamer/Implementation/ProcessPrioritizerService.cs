using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using VoltrisOptimizer.Core.Constants;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using GamerModels = VoltrisOptimizer.Services.Gamer.Models;

namespace VoltrisOptimizer.Services.Gamer.Implementation
{
    /// <summary>
    /// Implementação do gerenciador de prioridade de processos
    /// </summary>
    public class ProcessPrioritizerService : IProcessPrioritizer
    {
        private readonly ILoggingService _logger;
        private readonly Dictionary<int, ProcessPriorityClass> _originalPriorities = new();
        private readonly object _lock = new();

        /// <summary>
        /// Processos que podem ser fechados durante jogos
        /// </summary>
        private static readonly string[] ClosableProcesses = new[]
        {
            "Skype", "Teams", "Zoom", "OneDrive", "Dropbox", "GoogleDriveSync",
            "iCloudServices", "CCleaner", "MalwareBytes", "AdobeUpdateService"
        };

        /// <summary>
        /// Processos a ter prioridade reduzida
        /// </summary>
        private static readonly string[] LowerPriorityProcesses = new[]
        {
            "SearchIndexer", "WSearch", "SysMain", "DiagTrack", "WMIProviderHost",
            "MsMpEng", "Windows Defender", "backgroundTaskHost", "SettingSyncHost"
        };

        public ProcessPrioritizerService(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public int CloseUnnecessaryProcesses()
        {
            int closedCount = 0;

            foreach (var processName in ClosableProcesses)
            {
                try
                {
                    var processes = Process.GetProcessesByName(processName);
                    
                    foreach (var process in processes)
                    {
                        try
                        {
                            if (IsProtectedProcess(process.ProcessName)) continue;

                            // Tentar fechar graciosamente primeiro
                            process.CloseMainWindow();
                            
                            if (!process.WaitForExit(2000))
                            {
                                process.Kill();
                            }

                            closedCount++;
                            _logger.LogInfo($"[Prioritizer] Processo fechado: {processName}");
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"[Prioritizer] Falha ao fechar {processName}: {ex.Message}");
                        }
                        finally
                        {
                            process.Dispose();
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[Prioritizer] Erro ao processar {processName}: {ex.Message}");
                }
            }

            if (closedCount > 0)
            {
                _logger.LogSuccess($"[Prioritizer] {closedCount} processo(s) fechado(s)");
            }

            return closedCount;
        }

        public bool SetPriority(int processId, GamerModels.ProcessPriorityLevel priority)
        {
            try
            {
                using var process = Process.GetProcessById(processId);

                lock (_lock)
                {
                    // Salvar prioridade original se não existe
                    if (!_originalPriorities.ContainsKey(processId))
                    {
                        _originalPriorities[processId] = process.PriorityClass;
                    }
                }

                var targetPriority = priority switch
                {
                    GamerModels.ProcessPriorityLevel.Normal => ProcessPriorityClass.Normal,
                    GamerModels.ProcessPriorityLevel.AboveNormal => ProcessPriorityClass.AboveNormal,
                    GamerModels.ProcessPriorityLevel.High => ProcessPriorityClass.High,
                    GamerModels.ProcessPriorityLevel.RealTime => ProcessPriorityClass.RealTime,
                    _ => ProcessPriorityClass.Normal
                };

                process.PriorityClass = targetPriority;
                _logger.LogInfo($"[Prioritizer] Processo {processId} definido para {priority}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[Prioritizer] Erro ao definir prioridade: {ex.Message}");
                return false;
            }
        }

        public int LowerBackgroundProcessesPriority()
        {
            int loweredCount = 0;

            foreach (var processName in LowerPriorityProcesses)
            {
                try
                {
                    var processes = Process.GetProcessesByName(processName);
                    
                    foreach (var process in processes)
                    {
                        try
                        {
                            lock (_lock)
                            {
                                if (!_originalPriorities.ContainsKey(process.Id))
                                {
                                    _originalPriorities[process.Id] = process.PriorityClass;
                                }
                            }

                            process.PriorityClass = ProcessPriorityClass.BelowNormal;
                            loweredCount++;
                        }
                        catch
                        {
                            // Alguns processos do sistema não permitem alteração
                        }
                        finally
                        {
                            process.Dispose();
                        }
                    }
                }
                catch
                {
                    // Ignorar erros ao enumerar processos
                }
            }

            if (loweredCount > 0)
            {
                _logger.LogInfo($"[Prioritizer] {loweredCount} processo(s) com prioridade reduzida");
            }

            return loweredCount;
        }

        public void RestoreAllPriorities()
        {
            int restoredCount = 0;

            lock (_lock)
            {
                foreach (var kvp in _originalPriorities.ToList())
                {
                    try
                    {
                        using var process = Process.GetProcessById(kvp.Key);
                        process.PriorityClass = kvp.Value;
                        restoredCount++;
                    }
                    catch
                    {
                        // Processo pode não existir mais
                    }
                }

                _originalPriorities.Clear();
            }

            if (restoredCount > 0)
            {
                _logger.LogInfo($"[Prioritizer] {restoredCount} prioridade(s) restaurada(s)");
            }
        }

        public bool IsProtectedProcess(string processName)
        {
            if (string.IsNullOrEmpty(processName)) return true;

            var lowerName = processName.ToLowerInvariant();

            // Processos do sistema
            if (SystemConstants.ProtectedProcesses.System.Any(p => 
                lowerName.Equals(p, StringComparison.OrdinalIgnoreCase)))
            {
                return true;
            }

            // Voltris
            if (SystemConstants.ProtectedProcesses.Voltris.Any(p => 
                lowerName.Equals(p, StringComparison.OrdinalIgnoreCase)))
            {
                return true;
            }

            // Launchers de jogos
            if (SystemConstants.ProtectedProcesses.Launchers.Any(p => 
                lowerName.Equals(p, StringComparison.OrdinalIgnoreCase)))
            {
                return true;
            }

            return false;
        }
    }
}

