using System;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.Win32;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Interfaces;

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

        public async Task<bool> SetHighPerformancePlanAsync(Action<int>? progressCallback = null)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("Ativando modo alto desempenho...");
                    progressCallback?.Invoke(10);
                    
                    // Usar constante em vez de GUID hardcoded
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
                    
                    using (var process = Process.Start(processInfo))
                    {
                        if (process != null)
                        {
                            var output = process.StandardOutput.ReadToEnd();
                            var error = process.StandardError.ReadToEnd();
                            process.WaitForExit();
                            
                            if (process.ExitCode != 0 && !string.IsNullOrEmpty(error))
                            {
                                _logger.LogWarning($"Powercfg stderr: {error}");
                            }
                        }
                    }
                    
                    _logger.LogSuccess("Modo alto desempenho ativado");
                    progressCallback?.Invoke(100);
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError("Erro ao ativar modo alto desempenho", ex);
                    progressCallback?.Invoke(100);
                    return false;
                }
            });
        }

        /// <summary>
        /// Ativa o plano de energia balanceado (recomendado para notebooks)
        /// </summary>
        public async Task<bool> SetBalancedPlanAsync(Action<int>? progressCallback = null)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("Ativando modo balanceado...");
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
                    
                    using (var process = Process.Start(processInfo))
                    {
                        if (process != null)
                        {
                            var output = process.StandardOutput.ReadToEnd();
                            var error = process.StandardError.ReadToEnd();
                            process.WaitForExit();
                            
                            if (process.ExitCode != 0 && !string.IsNullOrEmpty(error))
                            {
                                _logger.LogWarning($"Powercfg stderr: {error}");
                            }
                        }
                    }
                    
                    _logger.LogSuccess("Modo balanceado ativado");
                    progressCallback?.Invoke(100);
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError("Erro ao ativar modo balanceado", ex);
                    progressCallback?.Invoke(100);
                    return false;
                }
            });
        }

        public async Task<bool> OptimizeStartupAsync(Action<int>? progressCallback = null)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("Otimizando inicialização...");
                    progressCallback?.Invoke(10);
                    
                    string keyPath = @"Software\Microsoft\Windows\CurrentVersion\Explorer\Serialize";
                    using (var key = Registry.CurrentUser.CreateSubKey(keyPath, true))
                    {
                        key?.SetValue("StartupDelayInMSec", 0, RegistryValueKind.DWord);
                    }
                    
                    _logger.LogSuccess("Inicialização otimizada (0ms de atraso)");
                    progressCallback?.Invoke(100);
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError("Erro ao otimizar inicialização", ex);
                    progressCallback?.Invoke(100);
                    return false;
                }
            });
        }

        public async Task<bool> OptimizeServicesAsync(Action<int>? progressCallback = null)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("Otimizando serviços...");
                    progressCallback?.Invoke(10);
                    
                    var services = new[]
                    {
                        new { Name = "SysMain", StartupType = "Manual" },
                        new { Name = "DiagTrack", StartupType = "Disabled" },
                        new { Name = "WSearch", StartupType = "Manual" }
                    };
                    
                    int current = 0;
                    foreach (var service in services)
                    {
                        try
                        {
                            var processInfo = new ProcessStartInfo
                            {
                                FileName = "sc.exe",
                                Arguments = $"config {service.Name} start= {service.StartupType.ToLower()}",
                                UseShellExecute = false,
                                CreateNoWindow = true
                            };
                            
                            using (var process = Process.Start(processInfo))
                            {
                                process?.WaitForExit();
                            }
                            
                            _logger.LogSuccess($"Serviço {service.Name} configurado para {service.StartupType}");
                            progressCallback?.Invoke(30 + (current * 20));
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"Erro ao configurar serviço {service.Name}: {ex.Message}");
                        }
                        current++;
                    }
                    
                    progressCallback?.Invoke(100);
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError("Erro ao otimizar serviços", ex);
                    progressCallback?.Invoke(100);
                    return false;
                }
            });
        }

        public async Task<bool> OptimizeRAMAsync(Action<int>? progressCallback = null)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("Otimizando memória RAM...");
                    progressCallback?.Invoke(10);
                    
                    // Limpar memória de processos não essenciais
                    var processInfo = new ProcessStartInfo
                    {
                        FileName = "rundll32.exe",
                        Arguments = "advapi32.dll,ProcessIdleTasks",
                        UseShellExecute = false,
                        CreateNoWindow = true
                    };
                    
                    using (var process = Process.Start(processInfo))
                    {
                        process?.WaitForExit();
                    }
                    
                    _logger.LogSuccess("Memória RAM otimizada");
                    progressCallback?.Invoke(100);
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError("Erro ao otimizar memória RAM", ex);
                    progressCallback?.Invoke(100);
                    return false;
                }
            });
        }
    }
}

