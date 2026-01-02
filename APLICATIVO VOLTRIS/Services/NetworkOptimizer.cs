using System;
using System.Diagnostics;
using System.Threading.Tasks;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Interfaces;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Serviço de otimização de rede baseado no PS1
    /// </summary>
    public class NetworkOptimizer : INetworkOptimizer
    {
        private readonly ILoggingService _logger;
        
        public NetworkOptimizer(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public async Task<bool> FlushDnsAsync(Action<int>? progressCallback = null)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("Limpando cache DNS...");
                    progressCallback?.Invoke(50);
                    
                    var processInfo = new ProcessStartInfo
                    {
                        FileName = "ipconfig.exe",
                        Arguments = "/flushdns",
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        RedirectStandardOutput = true
                    };
                    
                    using (var process = Process.Start(processInfo))
                    {
                        process?.WaitForExit();
                    }
                    
                    _logger.LogSuccess("Cache DNS limpo");
                    progressCallback?.Invoke(100);
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError("Erro ao limpar cache DNS", ex);
                    progressCallback?.Invoke(100);
                    return false;
                }
            });
        }

        public async Task<bool> ResetWinsockAsync(Action<int>? progressCallback = null)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("Redefinindo Winsock...");
                    progressCallback?.Invoke(50);
                    
                    var processInfo = new ProcessStartInfo
                    {
                        FileName = "netsh.exe",
                        Arguments = "winsock reset",
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        Verb = "runas" // Executar como admin
                    };
                    
                    using (var process = Process.Start(processInfo))
                    {
                        process?.WaitForExit();
                    }
                    
                    _logger.LogSuccess("Winsock redefinido. Reinicie o computador para aplicar.");
                    progressCallback?.Invoke(100);
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError("Erro ao redefinir Winsock", ex);
                    progressCallback?.Invoke(100);
                    return false;
                }
            });
        }

        public async Task<bool> ResetIPStackAsync(Action<int>? progressCallback = null)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("Redefinindo pilha IP...");
                    progressCallback?.Invoke(50);
                    
                    var processInfo = new ProcessStartInfo
                    {
                        FileName = "netsh.exe",
                        Arguments = "int ip reset",
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        Verb = "runas" // Executar como admin
                    };
                    
                    using (var process = Process.Start(processInfo))
                    {
                        process?.WaitForExit();
                    }
                    
                    _logger.LogSuccess("Pilha IP redefinida. Reinicie o computador para aplicar.");
                    progressCallback?.Invoke(100);
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError("Erro ao redefinir pilha IP", ex);
                    progressCallback?.Invoke(100);
                    return false;
                }
            });
        }

        public async Task<bool> RenewDhcpAsync(Action<int>? progressCallback = null)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("Renovando concessão DHCP...");
                    progressCallback?.Invoke(30);
                    
                    var releaseInfo = new ProcessStartInfo
                    {
                        FileName = "ipconfig.exe",
                        Arguments = "/release",
                        UseShellExecute = false,
                        CreateNoWindow = true
                    };
                    
                    using (var process = Process.Start(releaseInfo))
                    {
                        process?.WaitForExit();
                    }
                    
                    progressCallback?.Invoke(60);
                    
                    var renewInfo = new ProcessStartInfo
                    {
                        FileName = "ipconfig.exe",
                        Arguments = "/renew",
                        UseShellExecute = false,
                        CreateNoWindow = true
                    };
                    
                    using (var process = Process.Start(renewInfo))
                    {
                        process?.WaitForExit();
                    }
                    
                    _logger.LogSuccess("DHCP renovado");
                    progressCallback?.Invoke(100);
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError("Erro ao renovar DHCP", ex);
                    progressCallback?.Invoke(100);
                    return false;
                }
            });
        }

        /// <summary>
        /// Otimiza configurações TCP para melhor desempenho de rede
        /// Inclui RSS (Receive-Side Scaling), Auto-Tuning e ECN
        /// </summary>
        public async Task<bool> OptimizeTcpSettingsAsync(Action<int>? progressCallback = null)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("Otimizando configurações TCP...");
                    progressCallback?.Invoke(10);

                    // Habilitar RSS (Receive-Side Scaling) para melhor distribuição de carga
                    RunNetshCommand("int tcp set global rss=enabled");
                    progressCallback?.Invoke(25);

                    // Configurar Auto-Tuning Level para normal (melhor desempenho)
                    RunNetshCommand("int tcp set global autotuninglevel=normal");
                    progressCallback?.Invoke(40);

                    // Habilitar Direct Cache Access
                    RunNetshCommand("int tcp set global dca=enabled");
                    progressCallback?.Invoke(55);

                    // Habilitar ECN Capability (Explicit Congestion Notification)
                    RunNetshCommand("int tcp set global ecncapability=enabled");
                    progressCallback?.Invoke(70);

                    // Habilitar timestamps para melhor controle de congestionamento
                    RunNetshCommand("int tcp set global timestamps=enabled");
                    progressCallback?.Invoke(85);

                    // Configurar Initial RTO para 2000ms (mais agressivo)
                    RunNetshCommand("int tcp set global initialrto=2000");
                    progressCallback?.Invoke(100);

                    _logger.LogSuccess("Configurações TCP otimizadas (RSS, Auto-Tuning, ECN habilitados)");
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError("Erro ao otimizar configurações TCP", ex);
                    progressCallback?.Invoke(100);
                    return false;
                }
            });
        }

        private bool RunNetshCommand(string arguments)
        {
            try
            {
                var processInfo = new ProcessStartInfo
                {
                    FileName = "netsh.exe",
                    Arguments = arguments,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true
                };

                using var process = Process.Start(processInfo);
                if (process != null)
                {
                    process.WaitForExit(5000);
                    return process.ExitCode == 0;
                }
                return false;
            }
            catch
            {
                return false;
            }
        }
    }
}

