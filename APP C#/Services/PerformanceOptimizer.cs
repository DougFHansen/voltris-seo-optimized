using System;
using System.Runtime.InteropServices;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.ServiceProcess;
using System.Threading.Tasks;
using Microsoft.Win32;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Core;
using VoltrisOptimizer.Core.Validation;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Serviço de otimização de desempenho baseado no PS1
    /// </summary>
    public class PerformanceOptimizer : IPerformanceOptimizer
    {
        private readonly ILoggingService _logger;
        
        public PerformanceOptimizer(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public static bool HasHighPerformancePlan()
        {
            try
            {
                var psi = new ProcessStartInfo
                {
                    FileName = "powercfg.exe",
                    Arguments = "/list",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    CreateNoWindow = true
                };
                using var p = Process.Start(psi);
                if (p == null) return false;
                var output = p.StandardOutput.ReadToEnd();
                p.WaitForExit();
                
                // Usar constante em vez de GUID hardcoded
                var highPerformanceGuid = Core.Constants.SystemConstants.PowerPlans.HighPerformance;
                return output.IndexOf(highPerformanceGuid, StringComparison.OrdinalIgnoreCase) >= 0;
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogWarning($"Erro ao verificar plano de alto desempenho: {ex.Message}");
                return false;
            }
        }

        public async Task<OperationResult> SetHighPerformancePlanAsync(Action<int>? progressCallback = null)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("[PERFORMANCE] Ativando modo alto desempenho...");
                    progressCallback?.Invoke(10);
                    
                    var highPerformanceGuid = Core.Constants.SystemConstants.PowerPlans.HighPerformance;
                    
                    var processInfo = new ProcessStartInfo
                    {
                        FileName = "powercfg.exe",
                        Arguments = $"/setactive {highPerformanceGuid}",
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true
                    };
                    
                    progressCallback?.Invoke(30);
                    
                    using (var process = Process.Start(processInfo))
                    {
                        if (process == null)
                        {
                            var failureResult = OperationResult.CreateFailure(
                                "Failed to start powercfg.exe",
                                "Process.Start returned null");
                            _logger.LogError($"[PERFORMANCE] {failureResult.GetFullMessage()}");
                            RecordHistory("SetHighPerformancePlan", failureResult.ErrorMessage!, false);
                            progressCallback?.Invoke(100);
                            return failureResult;
                        }
                        
                        var output = process.StandardOutput.ReadToEnd();
                        var error = process.StandardError.ReadToEnd();
                        process.WaitForExit();
                        
                        if (process.ExitCode != 0)
                        {
                            var failureResult = OperationResult.CreateFailure(
                                $"powercfg.exe failed with exit code {process.ExitCode}",
                                $"Error output: {error}");
                            _logger.LogError($"[PERFORMANCE] {failureResult.GetFullMessage()}");
                            RecordHistory("SetHighPerformancePlan", failureResult.ErrorMessage!, false);
                            progressCallback?.Invoke(100);
                            return failureResult;
                        }
                    }
                    
                    progressCallback?.Invoke(60);
                    
                    // ✅ VALIDAÇÃO PÓS-APLICAÇÃO OBRIGATÓRIA
                    _logger.LogInfo("[PERFORMANCE] Validando que plano foi realmente ativado...");
                    var validationResult = OptimizationValidators.ValidatePowerPlan(highPerformanceGuid);
                    
                    if (!validationResult.Success)
                    {
                        _logger.LogError($"[PERFORMANCE] VALIDATION FAILED: {validationResult.GetFullMessage()}");
                        RecordHistory("SetHighPerformancePlan", 
                            $"Aplicado mas validação falhou: {validationResult.ErrorMessage}", false);
                        progressCallback?.Invoke(100);
                        return validationResult;
                    }
                    
                    _logger.LogSuccess($"[PERFORMANCE] ✓ VALIDATED: {validationResult.GetFullMessage()}");
                    RecordHistory("SetHighPerformancePlan", "Plano de Alta Performance ativado e validado", true);
                    progressCallback?.Invoke(100);
                    return validationResult;
                }
                catch (Exception ex)
                {
                    var failureResult = OperationResult.CreateFailure(
                        "Exception during power plan activation",
                        ex.Message);
                    _logger.LogError($"[PERFORMANCE] {failureResult.GetFullMessage()}", ex);
                    RecordHistory("SetHighPerformancePlan", $"Exceção: {ex.Message}", false);
                    progressCallback?.Invoke(100);
                    return failureResult;
                }
            });
        }

        private void RecordHistory(string action, string description, bool success)
        {
            try
            {
                var entry = new OptimizationHistory
                {
                    ActionType = "Performance",
                    Description = description,
                    Timestamp = DateTime.Now,
                    Success = success,
                    Details = new Dictionary<string, object> { { "Action", action } }
                };
                HistoryService.Instance.AddHistoryEntry(entry);
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"Falha ao gravar histórico: {ex.Message}");
            }
        }

        /// <summary>
        /// Ativa o plano de energia balanceado (recomendado para notebooks)
        /// </summary>
        public async Task<OperationResult> SetBalancedPlanAsync(Action<int>? progressCallback = null)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("[PERFORMANCE] Ativando modo balanceado...");
                    progressCallback?.Invoke(10);
                    
                    // GUID do plano balanceado do Windows
                    var balancedGuid = "381b4222-f694-41f0-9685-ff5bb260df2e";
                    
                    var processInfo = new ProcessStartInfo
                    {
                        FileName = "powercfg.exe",
                        Arguments = $"/setactive {balancedGuid}",
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true
                    };
                    
                    progressCallback?.Invoke(30);
                    
                    using (var process = Process.Start(processInfo))
                    {
                        if (process == null)
                        {
                            var failureResult = OperationResult.CreateFailure(
                                "Failed to start powercfg.exe",
                                "Process.Start returned null");
                            _logger.LogError($"[PERFORMANCE] {failureResult.GetFullMessage()}");
                            RecordHistory("SetBalancedPlan", failureResult.ErrorMessage!, false);
                            progressCallback?.Invoke(100);
                            return failureResult;
                        }
                        
                        var output = process.StandardOutput.ReadToEnd();
                        var error = process.StandardError.ReadToEnd();
                        process.WaitForExit();
                        
                        if (process.ExitCode != 0)
                        {
                            var failureResult = OperationResult.CreateFailure(
                                $"powercfg.exe failed with exit code {process.ExitCode}",
                                $"Error output: {error}");
                            _logger.LogError($"[PERFORMANCE] {failureResult.GetFullMessage()}");
                            RecordHistory("SetBalancedPlan", failureResult.ErrorMessage!, false);
                            progressCallback?.Invoke(100);
                            return failureResult;
                        }
                    }
                    
                    progressCallback?.Invoke(60);
                    
                    // ✅ VALIDAÇÃO PÓS-APLICAÇÃO OBRIGATÓRIA
                    _logger.LogInfo("[PERFORMANCE] Validando que plano foi realmente ativado...");
                    var validationResult = OptimizationValidators.ValidatePowerPlan(balancedGuid);
                    
                    if (!validationResult.Success)
                    {
                        _logger.LogError($"[PERFORMANCE] VALIDATION FAILED: {validationResult.GetFullMessage()}");
                        RecordHistory("SetBalancedPlan", 
                            $"Aplicado mas validação falhou: {validationResult.ErrorMessage}", false);
                        progressCallback?.Invoke(100);
                        return validationResult;
                    }
                    
                    _logger.LogSuccess($"[PERFORMANCE] ✓ VALIDATED: {validationResult.GetFullMessage()}");
                    RecordHistory("SetBalancedPlan", "Plano Balanceado ativado e validado", true);
                    progressCallback?.Invoke(100);
                    return validationResult;
                }
                catch (Exception ex)
                {
                    var failureResult = OperationResult.CreateFailure(
                        "Exception during balanced plan activation",
                        ex.Message);
                    _logger.LogError($"[PERFORMANCE] {failureResult.GetFullMessage()}", ex);
                    RecordHistory("SetBalancedPlan", $"Exceção: {ex.Message}", false);
                    progressCallback?.Invoke(100);
                    return failureResult;
                }
            });
        }

        public async Task<OperationResult> OptimizeStartupAsync(Action<int>? progressCallback = null)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("[PERFORMANCE] Otimizando inicialização...");
                    progressCallback?.Invoke(10);
                    
                    string keyPath = @"Software\Microsoft\Windows\CurrentVersion\Explorer\Serialize";
                    string valueName = "StartupDelayInMSec";
                    int expectedValue = 0;
                    
                    progressCallback?.Invoke(30);
                    
                    using (var key = Registry.CurrentUser.CreateSubKey(keyPath, true))
                    {
                        if (key == null)
                        {
                            var failureResult = OperationResult.CreateFailure(
                                "Failed to open registry key",
                                $"CreateSubKey returned null for path: {keyPath}");
                            _logger.LogError($"[PERFORMANCE] {failureResult.GetFullMessage()}");
                            RecordHistory("OptimizeStartup", failureResult.ErrorMessage!, false);
                            progressCallback?.Invoke(100);
                            return failureResult;
                        }
                        
                        // Tentar escrever valor
                        key.SetValue(valueName, expectedValue, RegistryValueKind.DWord);
                    }
                    
                    progressCallback?.Invoke(60);
                    
                    // ✅ VALIDAÇÃO PÓS-APLICAÇÃO OBRIGATÓRIA
                    _logger.LogInfo("[PERFORMANCE] Validando que valor foi realmente escrito no registro...");
                    var validationResult = OptimizationValidators.ValidateRegistryValue(
                        Registry.CurrentUser,
                        keyPath,
                        valueName,
                        expectedValue,
                        RegistryValueKind.DWord);
                    
                    if (!validationResult.Success)
                    {
                        _logger.LogError($"[PERFORMANCE] VALIDATION FAILED: {validationResult.GetFullMessage()}");
                        RecordHistory("OptimizeStartup", 
                            $"Escrito mas validação falhou: {validationResult.ErrorMessage}", false);
                        progressCallback?.Invoke(100);
                        return validationResult;
                    }
                    
                    _logger.LogSuccess($"[PERFORMANCE] ✓ VALIDATED: {validationResult.GetFullMessage()}");
                    RecordHistory("OptimizeStartup", "StartupDelay reduzido para 0ms e validado", true);
                    progressCallback?.Invoke(100);
                    return validationResult;
                }
                catch (UnauthorizedAccessException ex)
                {
                    var failureResult = OperationResult.CreateFailure(
                        "Access denied to registry",
                        $"Insufficient permissions: {ex.Message}");
                    _logger.LogError($"[PERFORMANCE] {failureResult.GetFullMessage()}", ex);
                    RecordHistory("OptimizeStartup", $"Sem permissão: {ex.Message}", false);
                    progressCallback?.Invoke(100);
                    return failureResult;
                }
                catch (Exception ex)
                {
                    var failureResult = OperationResult.CreateFailure(
                        "Exception during startup optimization",
                        ex.Message);
                    _logger.LogError($"[PERFORMANCE] {failureResult.GetFullMessage()}", ex);
                    RecordHistory("OptimizeStartup", $"Exceção: {ex.Message}", false);
                    progressCallback?.Invoke(100);
                    return failureResult;
                }
            });
        }

        public async Task<OperationResult> OptimizeServicesAsync(Action<int>? progressCallback = null)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("[PERFORMANCE] Otimizando serviços...");
                    progressCallback?.Invoke(10);
                    
                    var services = new[]
                    {
                        new { Name = "SysMain", StartupType = ServiceStartMode.Manual },
                        new { Name = "DiagTrack", StartupType = ServiceStartMode.Disabled },
                        new { Name = "WSearch", StartupType = ServiceStartMode.Manual }
                    };
                    
                    var results = new List<OperationResult>();
                    int current = 0;
                    
                    foreach (var service in services)
                    {
                        try
                        {
                            _logger.LogInfo($"[PERFORMANCE] Configurando serviço {service.Name}...");
                            
                            // Mapear ServiceStartMode para string do sc.exe
                            string scStartType = service.StartupType switch
                            {
                                ServiceStartMode.Disabled => "disabled",
                                ServiceStartMode.Manual => "demand",
                                ServiceStartMode.Automatic => "auto",
                                _ => "demand"
                            };
                            
                            var processInfo = new ProcessStartInfo
                            {
                                FileName = "sc.exe",
                                Arguments = $"config {service.Name} start= {scStartType}",
                                UseShellExecute = false,
                                CreateNoWindow = true,
                                RedirectStandardOutput = true,
                                RedirectStandardError = true
                            };
                            
                            using (var process = Process.Start(processInfo))
                            {
                                if (process == null)
                                {
                                    var failureResult = OperationResult.CreateFailure(
                                        $"Failed to start sc.exe for service {service.Name}",
                                        "Process.Start returned null");
                                    _logger.LogError($"[PERFORMANCE] {failureResult.GetFullMessage()}");
                                    results.Add(failureResult);
                                    continue;
                                }
                                
                                var output = process.StandardOutput.ReadToEnd();
                                var error = process.StandardError.ReadToEnd();
                                process.WaitForExit();
                                
                                // ✅ VERIFICAR EXIT CODE (CRÍTICO - estava faltando)
                                if (process.ExitCode != 0)
                                {
                                    var failureResult = OperationResult.CreateFailure(
                                        $"sc.exe failed for service {service.Name} with exit code {process.ExitCode}",
                                        $"Error: {error}");
                                    _logger.LogError($"[PERFORMANCE] {failureResult.GetFullMessage()}");
                                    results.Add(failureResult);
                                    continue;
                                }
                            }
                            
                            // ✅ VALIDAÇÃO PÓS-APLICAÇÃO OBRIGATÓRIA
                            _logger.LogInfo($"[PERFORMANCE] Validando serviço {service.Name}...");
                            var validationResult = OptimizationValidators.ValidateServiceStartupType(
                                service.Name,
                                service.StartupType);
                            
                            if (!validationResult.Success)
                            {
                                _logger.LogError($"[PERFORMANCE] VALIDATION FAILED: {validationResult.GetFullMessage()}");
                                results.Add(validationResult);
                            }
                            else
                            {
                                _logger.LogSuccess($"[PERFORMANCE] ✓ VALIDATED: {validationResult.GetFullMessage()}");
                                results.Add(validationResult);
                            }
                            
                            progressCallback?.Invoke(30 + (current * 20));
                        }
                        catch (Exception ex)
                        {
                            var failureResult = OperationResult.CreateFailure(
                                $"Exception configuring service {service.Name}",
                                ex.Message);
                            _logger.LogError($"[PERFORMANCE] {failureResult.GetFullMessage()}", ex);
                            results.Add(failureResult);
                        }
                        current++;
                    }
                    
                    // Combinar resultados
                    var combinedResult = OperationResult.Combine(results.ToArray());
                    
                    if (combinedResult.Success)
                    {
                        _logger.LogSuccess($"[PERFORMANCE] ✓ Todos os {services.Length} serviços configurados e validados");
                        RecordHistory("OptimizeServices", 
                            $"Serviços otimizados e validados: {string.Join(", ", services.Select(s => s.Name))}", true);
                    }
                    else
                    {
                        _logger.LogError($"[PERFORMANCE] Falhas na otimização de serviços: {combinedResult.ErrorMessage}");
                        RecordHistory("OptimizeServices", 
                            $"Falhas: {combinedResult.ErrorMessage}", false);
                    }
                    
                    progressCallback?.Invoke(100);
                    return combinedResult;
                }
                catch (Exception ex)
                {
                    var failureResult = OperationResult.CreateFailure(
                        "Exception during services optimization",
                        ex.Message);
                    _logger.LogError($"[PERFORMANCE] {failureResult.GetFullMessage()}", ex);
                    RecordHistory("OptimizeServices", $"Exceção: {ex.Message}", false);
                    progressCallback?.Invoke(100);
                    return failureResult;
                }
            });
        }

        public async Task<OperationResult> OptimizeRAMAsync(Action<int>? progressCallback = null)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("[PERFORMANCE] Otimizando memória RAM (Trim Working Sets)...");
                    progressCallback?.Invoke(10);
                    
                    var processes = Process.GetProcesses();
                    int total = processes.Length;
                    int successCount = 0;
                    long bytesBefore = GC.GetTotalMemory(false);
                    
                    // Lista de processos que não devemos tocar
                    var criticalProcesses = new HashSet<string>(StringComparer.OrdinalIgnoreCase)
                    {
                        "dwm", "csrss", "winlogon", "explorer", "System", "nvcontainer", "lsass", "smss", "services", "spoolsv"
                    };

                    for (int i = 0; i < total; i++)
                    {
                        var p = processes[i];
                        try
                        {
                            if (criticalProcesses.Contains(p.ProcessName)) continue;
                            if (p.Id == Process.GetCurrentProcess().Id) continue;

                            var hProcess = OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_SET_QUOTA, false, p.Id);
                            if (hProcess != IntPtr.Zero)
                            {
                                if (EmptyWorkingSet(hProcess))
                                {
                                    successCount++;
                                }
                                CloseHandle(hProcess);
                            }
                        }
                        catch { /* Ignorar falhas em processos individuais */ }
                        
                        if (i % 10 == 0)
                        {
                            progressCallback?.Invoke(10 + (int)((i / (float)total) * 80));
                        }
                    }

                    progressCallback?.Invoke(90);
                    
                    // Também forçar um GC na nossa própria aplicação
                    GC.Collect(2, GCCollectionMode.Forced, true, true);
                    GC.WaitForPendingFinalizers();
                    
                    _logger.LogSuccess($"[PERFORMANCE] RAM Otimizada: {successCount} processos processados.");
                    RecordHistory("OptimizeRAM", $"RAM Otimizada em {successCount} processos. Sistema mais responsivo.", true);
                    
                    progressCallback?.Invoke(100);
                    return OperationResult.CreateSuccess("Memória RAM otimizada com sucesso.", true);
                }
                catch (Exception ex)
                {
                    var failureResult = OperationResult.CreateFailure("Erro ao otimizar RAM", ex.Message);
                    _logger.LogError("[PERFORMANCE] Erro na otimização de RAM", ex);
                    RecordHistory("OptimizeRAM", $"Erro: {ex.Message}", false);
                    progressCallback?.Invoke(100);
                    return failureResult;
                }
            });
        }

        #region Win32 P/Invokes
        [DllImport("psapi.dll")]
        private static extern bool EmptyWorkingSet(IntPtr hProcess);

        [DllImport("kernel32.dll")]
        private static extern IntPtr OpenProcess(uint dwDesiredAccess, bool bInheritHandle, int dwProcessId);

        [DllImport("kernel32.dll")]
        private static extern bool CloseHandle(IntPtr hObject);

        private const uint PROCESS_QUERY_INFORMATION = 0x0400;
        private const uint PROCESS_SET_QUOTA = 0x0100;
        #endregion
    }
}
