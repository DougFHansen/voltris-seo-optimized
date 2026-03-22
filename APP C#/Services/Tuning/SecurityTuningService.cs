using System;
using System.Diagnostics;
using System.Linq;
using System.Management;
using System.Threading;
using System.Threading.Tasks;
using System.IO;
using Microsoft.Win32;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Utils;

namespace VoltrisOptimizer.Services.Tuning
{
    public class SecurityTuningService : ISecurityTuningService
    {
        private readonly ILoggingService _logger;
        private const string RegistryBaseKey = @"SOFTWARE\Voltris\Optimizations";

        // ── Cache de status (TTL: 30 s) ───────────────────────────────────────
        private SecurityStatus? _cachedStatus;
        private DateTime _cacheExpiry = DateTime.MinValue;
        private readonly SemaphoreSlim _cacheLock = new SemaphoreSlim(1, 1);

        public SecurityTuningService(ILoggingService logger)
        {
            _logger = logger;
        }

        public async Task<SecurityStatus> GetSecurityStatusAsync()
        {
            // Retornar do cache se ainda válido (TTL: 30 s)
            if (_cachedStatus != null && DateTime.UtcNow < _cacheExpiry)
                return _cachedStatus;

            await _cacheLock.WaitAsync();
            try
            {
                // Double-check após adquirir o lock
                if (_cachedStatus != null && DateTime.UtcNow < _cacheExpiry)
                    return _cachedStatus;

                _logger.LogInfo("[Security] ▶ Iniciando coleta de status de segurança...");
                var sw = Stopwatch.StartNew();
                
                var status = new SecurityStatus();
                try
                {
                    // ── FASE 1: Verificações RÁPIDAS (registry-only, < 10ms cada) ──
                    _logger.LogInfo("[Security] Fase 1: Verificações rápidas (registry)...");
                    var winUpdateTask            = IsWindowsUpdateEnabledAsync();
                    var smartScreenTask          = IsSmartScreenEnabledAsync();
                    var rtpTask                  = IsRealTimeProtectionEnabledAsync();
                    var uacTask                  = IsUACEnabledAsync();
                    var tamperTask               = IsTamperProtectionEnabledAsync();
                    var defenderServiceTask      = IsDefenderServiceEnabledAsync();

                    await Task.WhenAll(
                        winUpdateTask, smartScreenTask, rtpTask,
                        uacTask, tamperTask, defenderServiceTask);

                    status.WindowsUpdateEnabled          = winUpdateTask.Result;
                    status.SmartScreenEnabled            = smartScreenTask.Result;
                    status.RealTimeProtectionEnabled     = rtpTask.Result;
                    status.UacEnabled                   = uacTask.Result;
                    status.TamperProtectionEnabled      = tamperTask.Result;
                    status.DefenderServiceEnabled        = defenderServiceTask.Result;
                    
                    _logger.LogInfo($"[Security] Fase 1 concluída em {sw.ElapsedMilliseconds}ms");
                    _logger.LogInfo($"[Security]   WinUpdate={status.WindowsUpdateEnabled}, SmartScreen={status.SmartScreenEnabled}, RTP={status.RealTimeProtectionEnabled}");
                    _logger.LogInfo($"[Security]   UAC={status.UacEnabled}, TamperProtection={status.TamperProtectionEnabled}, DefenderService={status.DefenderServiceEnabled}");

                    // ── FASE 2: Verificações LENTAS (PowerShell/WMI, podem levar segundos) ──
                    _logger.LogInfo("[Security] Fase 2: Verificações lentas (PowerShell/WMI)...");
                    var avTask                   = GetAntivirusInfoAsync();
                    var firewallTask             = IsFirewallEnabledAsync();
                    var cfaTask                  = IsControlledFolderAccessEnabledAsync();
                    var bitLockerTask            = IsBitLockerEnabledAsync();

                    await Task.WhenAll(avTask, firewallTask, cfaTask, bitLockerTask);

                    var avInfo = avTask.Result;
                    status.AntivirusEnabled              = avInfo.IsEnabled;
                    status.AntivirusProduct              = avInfo.ProductName;
                    status.LastSignatureUpdate           = avInfo.SignatureUpdated;
                    status.FirewallEnabled               = firewallTask.Result;
                    status.ControlledFolderAccessEnabled = cfaTask.Result;
                    status.BitLockerEnabled              = bitLockerTask.Result;
                    
                    sw.Stop();
                    _logger.LogInfo($"[Security] Fase 2 concluída em {sw.ElapsedMilliseconds}ms total");
                    _logger.LogInfo($"[Security]   AV={status.AntivirusProduct} (enabled={status.AntivirusEnabled}), Firewall={status.FirewallEnabled}");
                    _logger.LogInfo($"[Security]   CFA={status.ControlledFolderAccessEnabled}, BitLocker={status.BitLockerEnabled}");
                }
                catch (Exception ex)
                {
                    _logger.LogError("Erro ao obter status de segurança", ex);
                }

                _logger.LogSuccess($"[Security] ✅ Status de segurança coletado em {sw.ElapsedMilliseconds}ms");

                // Armazenar no cache com TTL de 30 segundos
                _cachedStatus = status;
                _cacheExpiry  = DateTime.UtcNow.AddSeconds(30);
                return status;
            }
            finally
            {
                _cacheLock.Release();
            }
        }

        public async Task RunQuickScanAsync()
        {
            try
            {
                _logger.LogInfo("Iniciando Verificação Rápida do Windows Defender...");
                await RunPowerShellAsync("Start-MpScan -ScanType QuickScan");
                _logger.LogSuccess("Verificação Rápida concluída.");
            }
            catch (Exception ex)
            {
                _logger.LogError("Erro ao executar verificação rápida", ex);
            }
        }

        public async Task UpdateSignaturesAsync()
        {
            try
            {
                _logger.LogInfo("Atualizando definições do Windows Defender...");
                await RunPowerShellAsync("Update-MpSignature");
                _logger.LogSuccess("Definições atualizadas com sucesso.");
            }
            catch (Exception ex)
            {
                _logger.LogError("Erro ao atualizar definições", ex);
            }
        }

        public async Task<bool> ApplyTweakAsync(string tag, bool enable)
        {
            try
            {
                _logger.LogInfo($"Aplicando tweak de segurança: {tag} ({enable})");
                bool success = false;
                switch (tag)
                {
                    case "SmartScreen":
                        if (!enable) await RunCommandAsync("reg add \"HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System\" /v EnableSmartScreen /t REG_DWORD /d 0 /f");
                        else await RunCommandAsync("reg delete \"HKLM\\SOFTWARE\\Policies\\Microsoft\\Windows\\System\" /v EnableSmartScreen /f");
                        success = true;
                        break;
                    case "VBS":
                        if (!enable) await RunCommandAsync("reg add \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\DeviceGuard\\Scenarios\\HypervisorEnforcedCodeIntegrity\" /v Enabled /t REG_DWORD /d 0 /f");
                        else await RunCommandAsync("reg delete \"HKLM\\SYSTEM\\CurrentControlSet\\Control\\DeviceGuard\\Scenarios\\HypervisorEnforcedCodeIntegrity\" /v Enabled /f");
                        success = true;
                        break;
                }

                if (success)
                {
                    SaveTweakState(tag, enable);
                    // Invalidar cache para forçar leitura atualizada
                    _cacheExpiry = DateTime.MinValue;
                    return true;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Erro ao aplicar tweak {tag}", ex);
            }
            return false;
        }

        public void InvalidateCache()
        {
            _cacheExpiry = DateTime.MinValue;
            _cachedStatus = null;
        }

        public Task<bool> GetTweakStateAsync(string tag)
        {
            using var key = Registry.LocalMachine.OpenSubKey(RegistryBaseKey);
            if (key?.GetValue(tag) is int state)
            {
                return Task.FromResult(state == 1);
            }
            return Task.FromResult(false);
        }

        private void SaveTweakState(string tag, bool enable)
        {
            using var key = Registry.LocalMachine.CreateSubKey(RegistryBaseKey);
            key.SetValue(tag, enable ? 1 : 0, RegistryValueKind.DWord);
        }

        #region Helper Methods (RyTuneX Logic)

        private async Task<(string ProductName, bool IsEnabled, DateTime? SignatureUpdated)> GetAntivirusInfoAsync()
        {
            string product = "Windows Defender";
            bool enabled = false;
            DateTime? updated = null;

            try
            {
                var command = @"
                    $av = Get-CimInstance -Namespace 'root\SecurityCenter2' -ClassName 'AntiVirusProduct' -ErrorAction SilentlyContinue | Select-Object -First 1
                    if ($av) { $av.displayName; $av.productState } else { 'Windows Defender'; '0' }";
                
                var output = await RunPowerShellAsync(command);
                var lines = output.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);

                if (lines.Length >= 2)
                {
                    product = lines[0];
                    if (int.TryParse(lines[1], out var state))
                    {
                        enabled = (state & 0xF000) == 0x1000;
                    }
                }

                var sigOutput = await RunPowerShellAsync("(Get-MpComputerStatus -ErrorAction SilentlyContinue).AntivirusSignatureLastUpdated.ToString('o')");
                if (DateTime.TryParse(sigOutput, out var sigDate))
                {
                    updated = sigDate;
                }
            }
            catch { }
            return (product, enabled, updated);
        }

        private async Task<bool> IsFirewallEnabledAsync()
        {
            try
            {
                var output = await RunPowerShellAsync("(Get-NetFirewallProfile -ErrorAction SilentlyContinue | Where-Object { $_.Enabled -eq 'True' }).Count -gt 0");
                bool enabled = output.Trim().Equals("True", StringComparison.OrdinalIgnoreCase);
                _logger.LogInfo($"[Security] Firewall: output='{output.Trim()}', enabled={enabled}");
                return enabled;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[Security] Erro ao verificar Firewall: {ex.Message}");
                return false;
            }
        }

        private async Task<bool> IsWindowsUpdateEnabledAsync()
        {
            return await Task.Run(() =>
            {
                try
                {
                    using var key1 = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU");
                    if (key1?.GetValue("NoAutoUpdate") is int noAutoUpdate && noAutoUpdate == 1)
                    {
                        _logger.LogInfo("[Security] WindowsUpdate: Desabilitado via NoAutoUpdate policy");
                        return false;
                    }

                    using var key2 = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate");
                    if (key2?.GetValue("DisableWindowsUpdateAccess") is int disabled && disabled == 1)
                    {
                        _logger.LogInfo("[Security] WindowsUpdate: Desabilitado via DisableWindowsUpdateAccess policy");
                        return false;
                    }

                    using var key3 = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\wuauserv");
                    if (key3?.GetValue("Start") is int start && start == 4)
                    {
                        _logger.LogInfo("[Security] WindowsUpdate: Serviço wuauserv desabilitado (Start=4)");
                        return false;
                    }

                    _logger.LogInfo("[Security] WindowsUpdate: Ativo");
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[Security] Erro ao verificar WindowsUpdate: {ex.Message}");
                    return false;
                }
            });
        }

        private async Task<bool> IsSmartScreenEnabledAsync()
        {
            return await Task.Run(() =>
            {
                try
                {
                    using var policyKey = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Policies\Microsoft\Windows\System");
                    if (policyKey?.GetValue("EnableSmartScreen") is int policyValue && policyValue == 0)
                    {
                        _logger.LogInfo("[Security] SmartScreen: Desabilitado via Group Policy");
                        return false;
                    }

                    using var explorerKey = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer");
                    if (explorerKey?.GetValue("SmartScreenEnabled") as string == "Off")
                    {
                        _logger.LogInfo("[Security] SmartScreen: Desabilitado via Explorer key");
                        return false;
                    }

                    _logger.LogInfo("[Security] SmartScreen: Ativo");
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[Security] Erro ao verificar SmartScreen: {ex.Message}");
                    return true;
                }
            });
        }

        private async Task<bool> IsRealTimeProtectionEnabledAsync()
        {
            return await Task.Run(() =>
            {
                try
                {
                    using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows Defender\Real-Time Protection");
                    var value = key?.GetValue("DisableRealtimeMonitoring");
                    bool enabled;
                    if (value == null)
                    {
                        enabled = true; // Se a chave não existe, RTP está ativo (padrão do Windows)
                    }
                    else
                    {
                        enabled = Convert.ToInt32(value) == 0;
                    }
                    _logger.LogInfo($"[Security] RealTimeProtection: DisableRealtimeMonitoring={value}, enabled={enabled}");
                    return enabled;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[Security] Erro ao verificar RealTimeProtection: {ex.Message}");
                    return false;
                }
            });
        }

        private async Task<bool> IsUACEnabledAsync()
        {
            return await Task.Run(() =>
            {
                try
                {
                    using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System");
                    var value = key?.GetValue("EnableLUA");
                    bool enabled = value != null && Convert.ToInt32(value) == 1;
                    _logger.LogInfo($"[Security] UAC: EnableLUA={value}, enabled={enabled}");
                    return enabled;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[Security] Erro ao verificar UAC: {ex.Message}");
                    return false;
                }
            });
        }

        private async Task<bool> IsTamperProtectionEnabledAsync()
        {
            return await Task.Run(() =>
            {
                try
                {
                    // CORREÇÃO PROFISSIONAL: Leitura robusta do Tamper Protection
                    // Valor 5 = Ativado, Valor 4 = Desativado, Valor 0 = Desativado
                    // Se a chave não existe, tentar via WMI/PowerShell como fallback
                    
                    using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows Defender\Features");
                    if (key == null)
                    {
                        _logger.LogWarning("[Security] Chave de registro do Windows Defender Features não encontrada — Tamper Protection indeterminado");
                        return false;
                    }
                    
                    var value = key.GetValue("TamperProtection");
                    if (value == null)
                    {
                        _logger.LogWarning("[Security] Valor TamperProtection não encontrado no registro");
                        return false;
                    }
                    
                    // CORREÇÃO: Converter de forma segura (DWORD pode vir como int ou uint)
                    int tamperValue;
                    try
                    {
                        tamperValue = Convert.ToInt32(value);
                    }
                    catch
                    {
                        _logger.LogWarning($"[Security] Valor TamperProtection não é numérico: {value} (tipo: {value.GetType().Name})");
                        return false;
                    }
                    
                    // 5 = Ativado, qualquer outro valor = Desativado
                    bool isEnabled = tamperValue == 5;
                    _logger.LogInfo($"[Security] Tamper Protection registry value={tamperValue}, enabled={isEnabled}");
                    return isEnabled;
                }
                catch (System.Security.SecurityException secEx)
                {
                    // Sem permissão para ler — tentar via PowerShell
                    _logger.LogWarning($"[Security] Sem permissão para ler Tamper Protection via registro: {secEx.Message}");
                    return TryGetTamperProtectionViaPowerShell();
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[Security] Erro ao verificar Tamper Protection: {ex.Message}");
                    return false;
                }
            });
        }
        
        /// <summary>
        /// Fallback: Ler Tamper Protection via PowerShell/WMI quando o registro não é acessível
        /// </summary>
        private bool TryGetTamperProtectionViaPowerShell()
        {
            try
            {
                // Tentar via WMI (MSFT_MpComputerStatus)
                using var searcher = new System.Management.ManagementObjectSearcher(
                    @"root\Microsoft\Windows\Defender",
                    "SELECT IsTamperProtected FROM MSFT_MpComputerStatus");
                
                foreach (System.Management.ManagementObject obj in searcher.Get())
                {
                    var isTamperProtected = obj["IsTamperProtected"];
                    if (isTamperProtected != null)
                    {
                        bool result = Convert.ToBoolean(isTamperProtected);
                        _logger.LogInfo($"[Security] Tamper Protection via WMI: {result}");
                        return result;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[Security] Fallback WMI para Tamper Protection falhou: {ex.Message}");
            }
            
            return false;
        }

        private async Task<bool> IsControlledFolderAccessEnabledAsync()
        {
            try
            {
                var output = await RunPowerShellAsync("(Get-MpPreference).EnableControlledFolderAccess");
                if (int.TryParse(output.Trim(), out var status))
                {
                    bool enabled = status != 0;
                    _logger.LogInfo($"[Security] ControlledFolderAccess: PowerShell value={status}, enabled={enabled}");
                    return enabled;
                }

                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows Defender\Windows Defender Exploit Guard\Controlled Folder Access");
                var regValue = key?.GetValue("EnableControlledFolderAccess");
                bool regEnabled = regValue is int regStatus && regStatus != 0;
                _logger.LogInfo($"[Security] ControlledFolderAccess: Registry value={regValue}, enabled={regEnabled}");
                return regEnabled;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[Security] Erro ao verificar ControlledFolderAccess: {ex.Message}");
                return false;
            }
        }

        private async Task<bool> IsBitLockerEnabledAsync()
        {
            try
            {
                var output = await RunPowerShellAsync("(Get-BitLockerVolume -ErrorAction SilentlyContinue | Where-Object { $_.ProtectionStatus -eq 'On' }).Count -gt 0");
                bool enabled = output.Trim().Equals("True", StringComparison.OrdinalIgnoreCase);
                _logger.LogInfo($"[Security] BitLocker: output='{output.Trim()}', enabled={enabled}");
                return enabled;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[Security] Erro ao verificar BitLocker: {ex.Message}");
                return false;
            }
        }

        private async Task<bool> IsDefenderServiceEnabledAsync()
        {
            return await Task.Run(() =>
            {
                try
                {
                    using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\WinDefend");
                    var value = key?.GetValue("Start");
                    bool enabled = value != null && Convert.ToInt32(value) != 4; // 4 = Disabled
                    _logger.LogInfo($"[Security] DefenderService: Start={value}, enabled={enabled}");
                    return enabled;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[Security] Erro ao verificar DefenderService: {ex.Message}");
                    return false;
                }
            });
        }

        private async Task<string> RunPowerShellAsync(string command)
        {
            var psPath = Environment.Is64BitOperatingSystem && !Environment.Is64BitProcess
                ? Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "SysNative", "WindowsPowerShell", "v1.0", "powershell.exe")
                : Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "System32", "WindowsPowerShell", "v1.0", "powershell.exe");

            using var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = psPath,
                    Arguments = $"-NoProfile -NonInteractive -Command \"{command}\"",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true
                }
            };
            
            process.Start();
            
            // CORREÇÃO: Timeout de 10 segundos para evitar travamento
            var outputTask = process.StandardOutput.ReadToEndAsync();
            var errorTask = process.StandardError.ReadToEndAsync();
            
            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(10));
            try
            {
                await process.WaitForExitAsync(cts.Token);
            }
            catch (OperationCanceledException)
            {
                _logger.LogWarning($"[Security] PowerShell timeout (10s) para comando: {command.Substring(0, Math.Min(80, command.Length))}...");
                try { process.Kill(true); } catch { }
                return string.Empty;
            }
            
            var output = await outputTask;
            var error = await errorTask;
            
            if (!string.IsNullOrWhiteSpace(error))
            {
                _logger.LogWarning($"[Security] PowerShell stderr: {error.Trim().Substring(0, Math.Min(200, error.Trim().Length))}");
            }
            
            return output;
        }

        private async Task RunCommandAsync(string command)
        {
            var cmdPath = Environment.Is64BitOperatingSystem && !Environment.Is64BitProcess
                ? Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "SysNative", "cmd.exe")
                : Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "System32", "cmd.exe");

            using var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = cmdPath,
                    Arguments = $"/c {command}",
                    UseShellExecute = false,
                    CreateNoWindow = true
                }
            };
            process.Start();
            await process.WaitForExitAsync();
        }

        #endregion
    }
}
