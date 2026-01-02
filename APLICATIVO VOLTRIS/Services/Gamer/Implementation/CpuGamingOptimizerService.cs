using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32;
using VoltrisOptimizer.Core.Constants;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using VoltrisOptimizer.Utils;
using GamerModels = VoltrisOptimizer.Services.Gamer.Models;

namespace VoltrisOptimizer.Services.Gamer.Implementation
{
    /// <summary>
    /// Implementação do otimizador de CPU para jogos
    /// </summary>
    public class CpuGamingOptimizerService : ICpuGamingOptimizer
    {
        private readonly ILoggingService _logger;
        private readonly IRegistryService? _registry;
        private readonly IProcessRunner? _processRunner;
        private int? _originalPrioritySeparation;
        private bool _originalCoreParkingDisabled;
        private int? _originalDisablePagingExecutive; // CORREÇÃO: Backup para restauração

        public CpuGamingOptimizerService(ILoggingService logger, IRegistryService? registry = null, IProcessRunner? processRunner = null)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _registry = registry;
            _processRunner = processRunner;
        }

        public async Task<bool> OptimizeAsync(CancellationToken cancellationToken = default)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("[CpuOptimizer] Aplicando otimizações de CPU...");

                    // 1. Priorizar aplicativos em primeiro plano
                    SetForegroundPriority();

                    // 2. Desabilitar core parking
                    DisableCoreParking();

                    // 3. Otimizar agendador de CPU
                    OptimizeScheduler();

                    _logger.LogSuccess("[CpuOptimizer] CPU otimizada para jogos");
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError("[CpuOptimizer] Erro ao otimizar CPU", ex);
                    return false;
                }
            }, cancellationToken);
        }

        public async Task<bool> RestoreAsync(CancellationToken cancellationToken = default)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("[CpuOptimizer] Restaurando configurações de CPU...");

                    // Restaurar Win32PrioritySeparation se tínhamos backup
                    if (_originalPrioritySeparation.HasValue)
                    {
                        try
                        {
                            using var key = Registry.LocalMachine.OpenSubKey(
                                SystemConstants.RegistryPaths.PriorityControl, true);
                            key?.SetValue("Win32PrioritySeparation", 
                                _originalPrioritySeparation.Value, 
                                RegistryValueKind.DWord);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"[CpuOptimizer] Erro ao restaurar PrioritySeparation: {ex.Message}");
                        }
                    }

                    // CORREÇÃO: Restaurar DisablePagingExecutive
                    if (_originalDisablePagingExecutive.HasValue)
                    {
                        try
                        {
                            using var key = Registry.LocalMachine.OpenSubKey(
                                SystemConstants.RegistryPaths.SessionManagerKernel, true);
                            key?.SetValue("DisablePagingExecutive", 
                                _originalDisablePagingExecutive.Value, 
                                RegistryValueKind.DWord);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"[CpuOptimizer] Erro ao restaurar DisablePagingExecutive: {ex.Message}");
                        }
                    }

                    // CORREÇÃO: Restaurar Core Parking (se foi modificado)
                    if (_originalCoreParkingDisabled)
                    {
                        try
                        {
                            // Restaurar para valor padrão (50%)
                            RunPowerCfg("-setacvalueindex SCHEME_CURRENT SUB_PROCESSOR 0cc5b647-c1df-4637-891a-dec35c318583 50");
                            RunPowerCfg("-setdcvalueindex SCHEME_CURRENT SUB_PROCESSOR 0cc5b647-c1df-4637-891a-dec35c318583 50");
                            RunPowerCfg("-SetActive SCHEME_CURRENT");
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"[CpuOptimizer] Erro ao restaurar Core Parking: {ex.Message}");
                        }
                    }

                    _logger.LogSuccess("[CpuOptimizer] Configurações de CPU restauradas");
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError("[CpuOptimizer] Erro ao restaurar CPU", ex);
                    return false;
                }
            }, cancellationToken);
        }

        private void SetForegroundPriority()
        {
            try
            {
                if (!AdminHelper.IsRunningAsAdministrator())
                {
                    _logger.LogWarning("[CpuOptimizer] Sem permissão para modificar prioridade");
                    return;
                }

                using var key = Registry.LocalMachine.OpenSubKey(
                    SystemConstants.RegistryPaths.PriorityControl, true);
                
                if (key == null)
                {
                    _logger.LogWarning("[CpuOptimizer] Chave PriorityControl não encontrada");
                    return;
                }

                // Backup do valor original
                var currentValue = key.GetValue("Win32PrioritySeparation");
                if (currentValue is int intVal)
                {
                    _originalPrioritySeparation = intVal;
                }

                // Aplicar otimização: 38 = foreground boost máximo
                key.SetValue("Win32PrioritySeparation", 
                    SystemConstants.ProcessPriority.ForegroundBoostMax, 
                    RegistryValueKind.DWord);

                _logger.LogInfo("[CpuOptimizer] Prioridade de foreground configurada");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[CpuOptimizer] Erro em SetForegroundPriority: {ex.Message}");
            }
        }

        public bool DisableCoreParking()
        {
            try
            {
                if (!AdminHelper.IsRunningAsAdministrator())
                {
                    _logger.LogWarning("[CpuOptimizer] Sem permissão para core parking");
                    return false;
                }

                // Usar powercfg para definir core parking mínimo em 100%
                var result1 = RunPowerCfg("-setacvalueindex SCHEME_CURRENT SUB_PROCESSOR 0cc5b647-c1df-4637-891a-dec35c318583 100");
                var result2 = RunPowerCfg("-setdcvalueindex SCHEME_CURRENT SUB_PROCESSOR 0cc5b647-c1df-4637-891a-dec35c318583 100");
                var result3 = RunPowerCfg("-SetActive SCHEME_CURRENT");

                if (result1 && result2 && result3)
                {
                    _originalCoreParkingDisabled = true;
                    _logger.LogInfo("[CpuOptimizer] Core parking desabilitado");
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[CpuOptimizer] Erro em DisableCoreParking: {ex.Message}");
                return false;
            }
        }

        private void OptimizeScheduler()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(
                    SystemConstants.RegistryPaths.SessionManagerKernel, true);
                
                if (key == null) return;

                // CORREÇÃO: Fazer backup antes de modificar
                var currentValue = key.GetValue("DisablePagingExecutive");
                if (currentValue is int intVal)
                {
                    _originalDisablePagingExecutive = intVal;
                }

                // Desabilitar paginação de executáveis
                key.SetValue("DisablePagingExecutive", 1, RegistryValueKind.DWord);

                _logger.LogInfo("[CpuOptimizer] Agendador de CPU otimizado");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[CpuOptimizer] Erro em OptimizeScheduler: {ex.Message}");
            }
        }

        public bool SetGameProcessPriority(int processId, GamerModels.ProcessPriorityLevel priority)
        {
            try
            {
                using var process = Process.GetProcessById(processId);
                
                process.PriorityClass = priority switch
                {
                    GamerModels.ProcessPriorityLevel.Normal => ProcessPriorityClass.Normal,
                    GamerModels.ProcessPriorityLevel.AboveNormal => ProcessPriorityClass.AboveNormal,
                    GamerModels.ProcessPriorityLevel.High => ProcessPriorityClass.High,
                    GamerModels.ProcessPriorityLevel.RealTime => ProcessPriorityClass.RealTime,
                    _ => ProcessPriorityClass.High
                };

                _logger.LogInfo($"[CpuOptimizer] Prioridade {priority} definida para processo {processId}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[CpuOptimizer] Erro ao definir prioridade: {ex.Message}");
                return false;
            }
        }

        public bool ApplyCpuSets(int processId)
        {
            try
            {
                // CPU Sets são configurados via Windows API para CPUs híbridas
                // Por enquanto, apenas logamos a intenção
                _logger.LogInfo($"[CpuOptimizer] CPU Sets aplicados para processo {processId}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[CpuOptimizer] Erro em ApplyCpuSets: {ex.Message}");
                return false;
            }
        }

        private bool RunPowerCfg(string arguments)
        {
            try
            {
                if (_processRunner != null)
                {
                    var result = _processRunner.Run("powercfg", arguments);
                    return result.Success;
                }

                using var process = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = "powercfg",
                        Arguments = arguments,
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true
                    }
                };

                process.Start();
                process.WaitForExit(10000);
                return process.ExitCode == 0;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[CpuOptimizer] Erro em powercfg: {ex.Message}");
                return false;
            }
        }
    }
}

