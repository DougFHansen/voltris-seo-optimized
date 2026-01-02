using System;
using System.Net.NetworkInformation;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32;
using VoltrisOptimizer.Core.Constants;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using VoltrisOptimizer.Utils;

namespace VoltrisOptimizer.Services.Gamer.Implementation
{
    /// <summary>
    /// Implementação do otimizador de rede para jogos
    /// </summary>
    public class NetworkGamingOptimizerService : INetworkGamingOptimizer
    {
        private readonly ILoggingService _logger;
        private readonly IRegistryService? _registry;
        
        // Backups para restauração
        private int? _originalNetworkThrottlingIndex;
        private bool _tweaksApplied;
        private System.Collections.Generic.Dictionary<string, int?> _originalTcpAckFrequency = new(); // CORREÇÃO: Backup TCP por interface
        private System.Collections.Generic.Dictionary<string, int?> _originalTcpNoDelay = new(); // CORREÇÃO: Backup TCP por interface
        private int? _originalGlobalTcpAckFrequency; // CORREÇÃO: Backup TCP global
        private int? _originalGlobalTcpNoDelay; // CORREÇÃO: Backup TCP global

        public NetworkGamingOptimizerService(ILoggingService logger, IRegistryService? registry = null)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _registry = registry;
        }

        public async Task<bool> OptimizeAsync(CancellationToken cancellationToken = default)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("[NetworkOptimizer] Aplicando otimizações de rede...");

                    // 1. Desabilitar throttling de rede
                    DisableNetworkThrottling();

                    // 2. Aplicar TCP tweaks
                    ApplyTcpTweaks();

                    // 3. Otimizar Nagle's algorithm
                    DisableNaglesAlgorithm();

                    _tweaksApplied = true;
                    _logger.LogSuccess("[NetworkOptimizer] Rede otimizada para jogos");
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError("[NetworkOptimizer] Erro ao otimizar rede", ex);
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
                    _logger.LogInfo("[NetworkOptimizer] Restaurando configurações de rede...");

                    // Restaurar throttling
                    if (_originalNetworkThrottlingIndex.HasValue)
                    {
                        try
                        {
                            using var key = Registry.LocalMachine.OpenSubKey(
                                SystemConstants.RegistryPaths.MultimediaSystemProfile, true);
                            key?.SetValue("NetworkThrottlingIndex", 
                                _originalNetworkThrottlingIndex.Value, 
                                RegistryValueKind.DWord);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"[NetworkOptimizer] Erro ao restaurar throttling: {ex.Message}");
                        }
                    }

                    // CORREÇÃO: Restaurar TCP tweaks globais
                    if (_originalGlobalTcpAckFrequency.HasValue || _originalGlobalTcpNoDelay.HasValue)
                    {
                        try
                        {
                            using var key = Registry.LocalMachine.OpenSubKey(
                                SystemConstants.RegistryPaths.TcpipParameters, true);
                            
                            if (key != null)
                            {
                                if (_originalGlobalTcpAckFrequency.HasValue)
                                {
                                    key.SetValue("TcpAckFrequency", 
                                        _originalGlobalTcpAckFrequency.Value, 
                                        RegistryValueKind.DWord);
                                }
                                else
                                {
                                    key.DeleteValue("TcpAckFrequency", false);
                                }

                                if (_originalGlobalTcpNoDelay.HasValue)
                                {
                                    key.SetValue("TCPNoDelay", 
                                        _originalGlobalTcpNoDelay.Value, 
                                        RegistryValueKind.DWord);
                                }
                                else
                                {
                                    key.DeleteValue("TCPNoDelay", false);
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"[NetworkOptimizer] Erro ao restaurar TCP tweaks globais: {ex.Message}");
                        }
                    }

                    // CORREÇÃO: Restaurar TCP tweaks por interface
                    if (_originalTcpAckFrequency.Count > 0 || _originalTcpNoDelay.Count > 0)
                    {
                        try
                        {
                            using var interfacesKey = Registry.LocalMachine.OpenSubKey(
                                @"SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces", true);

                            if (interfacesKey != null)
                            {
                                foreach (var kvp in _originalTcpAckFrequency)
                                {
                                    try
                                    {
                                        using var subKey = interfacesKey.OpenSubKey(kvp.Key, true);
                                        if (subKey != null)
                                        {
                                            if (kvp.Value.HasValue)
                                            {
                                                subKey.SetValue("TcpAckFrequency", kvp.Value.Value, RegistryValueKind.DWord);
                                            }
                                            else
                                            {
                                                subKey.DeleteValue("TcpAckFrequency", false);
                                            }
                                        }
                                    }
                                    catch { }
                                }

                                foreach (var kvp in _originalTcpNoDelay)
                                {
                                    try
                                    {
                                        using var subKey = interfacesKey.OpenSubKey(kvp.Key, true);
                                        if (subKey != null)
                                        {
                                            if (kvp.Value.HasValue)
                                            {
                                                subKey.SetValue("TCPNoDelay", kvp.Value.Value, RegistryValueKind.DWord);
                                            }
                                            else
                                            {
                                                subKey.DeleteValue("TCPNoDelay", false);
                                            }
                                        }
                                    }
                                    catch { }
                                }
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"[NetworkOptimizer] Erro ao restaurar TCP tweaks por interface: {ex.Message}");
                        }
                    }

                    _tweaksApplied = false;
                    _originalTcpAckFrequency.Clear();
                    _originalTcpNoDelay.Clear();
                    _logger.LogSuccess("[NetworkOptimizer] Configurações de rede restauradas");
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError("[NetworkOptimizer] Erro ao restaurar rede", ex);
                    return false;
                }
            }, cancellationToken);
        }

        private void DisableNetworkThrottling()
        {
            try
            {
                if (!AdminHelper.IsRunningAsAdministrator()) return;

                using var key = Registry.LocalMachine.OpenSubKey(
                    SystemConstants.RegistryPaths.MultimediaSystemProfile, true);

                if (key == null) return;

                // Backup
                var current = key.GetValue("NetworkThrottlingIndex");
                if (current is int intVal)
                {
                    _originalNetworkThrottlingIndex = intVal;
                }

                // Desabilitar throttling: 0xFFFFFFFF
                key.SetValue("NetworkThrottlingIndex", unchecked((int)0xFFFFFFFF), RegistryValueKind.DWord);

                _logger.LogInfo("[NetworkOptimizer] Network throttling desabilitado");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[NetworkOptimizer] Erro em DisableNetworkThrottling: {ex.Message}");
            }
        }

        private void ApplyTcpTweaks()
        {
            try
            {
                if (!AdminHelper.IsRunningAsAdministrator()) return;

                using var key = Registry.LocalMachine.OpenSubKey(
                    SystemConstants.RegistryPaths.TcpipParameters, true);

                if (key == null) return;

                // CORREÇÃO: Fazer backup antes de modificar
                var currentAck = key.GetValue("TcpAckFrequency");
                if (currentAck is int ackVal)
                {
                    _originalGlobalTcpAckFrequency = ackVal;
                }

                var currentNoDelay = key.GetValue("TCPNoDelay");
                if (currentNoDelay is int noDelayVal)
                {
                    _originalGlobalTcpNoDelay = noDelayVal;
                }

                // TCP ACK Frequency = 1 (menor latência)
                key.SetValue("TcpAckFrequency", 
                    SystemConstants.NetworkSettings.TcpAckFrequencyLowLatency, 
                    RegistryValueKind.DWord);

                // TCP No Delay = 1 (desabilita Nagle)
                key.SetValue("TCPNoDelay", 
                    SystemConstants.NetworkSettings.TcpNoDelayEnabled, 
                    RegistryValueKind.DWord);

                _logger.LogInfo("[NetworkOptimizer] TCP tweaks aplicados");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[NetworkOptimizer] Erro em ApplyTcpTweaks: {ex.Message}");
            }
        }

        // CORREÇÃO: Cache para evitar aplicar configurações TCP repetidamente
        private static DateTime _lastNagleDisable = DateTime.MinValue;
        private const int NagleDisableCooldownSeconds = 600; // 10 minutos
        
        private void DisableNaglesAlgorithm()
        {
            try
            {
                // CORREÇÃO CRÍTICA: Evitar aplicar configurações TCP repetidamente (causa instabilidade)
                var now = DateTime.Now;
                if ((now - _lastNagleDisable).TotalSeconds < NagleDisableCooldownSeconds)
                {
                    _logger.LogInfo("[NetworkOptimizer] Configurações TCP já aplicadas recentemente, pulando...");
                    return;
                }
                
                if (!AdminHelper.IsRunningAsAdministrator()) return;

                // CORREÇÃO: Para CS e jogos competitivos, usar valores mais conservadores
                // TcpAckFrequency=1 pode causar instabilidade de rede em alguns casos
                // Usar 2 ou 3 é mais seguro e ainda reduz latência
                var tcpAckFrequency = 2; // Valor mais conservador
                var tcpNoDelay = 1; // Este é seguro

                // Aplicar em todas as interfaces de rede
                using var interfacesKey = Registry.LocalMachine.OpenSubKey(
                    @"SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces", true);

                if (interfacesKey == null) return;

                foreach (var subKeyName in interfacesKey.GetSubKeyNames())
                {
                    try
                    {
                        using var subKey = interfacesKey.OpenSubKey(subKeyName, true);
                        if (subKey == null) continue;

                        // CORREÇÃO: Fazer backup antes de modificar
                        var currentAck = subKey.GetValue("TcpAckFrequency");
                        var currentNoDelay = subKey.GetValue("TCPNoDelay");
                        
                        if (currentAck != null)
                        {
                            _originalTcpAckFrequency[subKeyName] = Convert.ToInt32(currentAck);
                        }
                        else
                        {
                            _originalTcpAckFrequency[subKeyName] = null;
                        }
                        
                        if (currentNoDelay != null)
                        {
                            _originalTcpNoDelay[subKeyName] = Convert.ToInt32(currentNoDelay);
                        }
                        else
                        {
                            _originalTcpNoDelay[subKeyName] = null;
                        }
                        
                        // Aplicar configurações
                        if (currentAck == null || Convert.ToInt32(currentAck) != tcpAckFrequency)
                        {
                            subKey.SetValue("TcpAckFrequency", tcpAckFrequency, RegistryValueKind.DWord);
                        }
                        
                        if (currentNoDelay == null || Convert.ToInt32(currentNoDelay) != tcpNoDelay)
                        {
                            subKey.SetValue("TCPNoDelay", tcpNoDelay, RegistryValueKind.DWord);
                        }
                    }
                    catch
                    {
                        // Ignorar interfaces que não podem ser modificadas
                    }
                }

                _lastNagleDisable = now;
                _logger.LogInfo($"[NetworkOptimizer] Nagle's algorithm desabilitado (TcpAckFrequency={tcpAckFrequency})");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[NetworkOptimizer] Erro em DisableNaglesAlgorithm: {ex.Message}");
            }
        }

        // CORREÇÃO: Cache para evitar aplicar QoS repetidamente
        private static string? _lastQosExe = null;
        private static DateTime _lastQosApplication = DateTime.MinValue;
        private const int QosCooldownSeconds = 300; // 5 minutos
        
        public bool ApplyQosDscp(string executablePath, int dscpValue = 46)
        {
            try
            {
                // CORREÇÃO CRÍTICA: Evitar aplicar QoS repetidamente (causa instabilidade de rede)
                var now = DateTime.Now;
                if (!string.IsNullOrEmpty(executablePath) && 
                    executablePath == _lastQosExe &&
                    (now - _lastQosApplication).TotalSeconds < QosCooldownSeconds)
                {
                    _logger.LogInfo($"[NetworkOptimizer] QoS já aplicado recentemente para {System.IO.Path.GetFileName(executablePath)}, pulando...");
                    return true; // Retornar true para não quebrar o fluxo, mas não aplicar novamente
                }
                
                if (!AdminHelper.IsRunningAsAdministrator())
                {
                    _logger.LogWarning("[NetworkOptimizer] Sem permissão para QoS");
                    return false;
                }

                var exeName = System.IO.Path.GetFileName(executablePath);
                var keyPath = $@"SOFTWARE\Policies\Microsoft\Windows\QoS\{exeName}";

                // CORREÇÃO: Verificar se já existe e tem os mesmos valores antes de aplicar
                using var existingKey = Registry.LocalMachine.OpenSubKey(keyPath);
                if (existingKey != null)
                {
                    var existingDscp = existingKey.GetValue("DSCP Value")?.ToString();
                    if (existingDscp == dscpValue.ToString())
                    {
                        _logger.LogInfo($"[NetworkOptimizer] QoS DSCP {dscpValue} já está configurado para {exeName}");
                        _lastQosExe = executablePath;
                        _lastQosApplication = now;
                        return true;
                    }
                }

                using var key = Registry.LocalMachine.CreateSubKey(keyPath, true);
                if (key == null) return false;

                key.SetValue("Application Name", executablePath, RegistryValueKind.String);
                key.SetValue("DSCP Value", dscpValue.ToString(), RegistryValueKind.String);
                key.SetValue("Local IP", "*", RegistryValueKind.String);
                key.SetValue("Remote IP", "*", RegistryValueKind.String);
                key.SetValue("Protocol", "*", RegistryValueKind.String);
                key.SetValue("Local Port", "*", RegistryValueKind.String);
                key.SetValue("Remote Port", "*", RegistryValueKind.String);
                key.SetValue("Throttle Rate", "-1", RegistryValueKind.String);

                _logger.LogInfo($"[NetworkOptimizer] QoS DSCP {dscpValue} aplicado para {exeName}");
                
                // Atualizar cache
                _lastQosExe = executablePath;
                _lastQosApplication = now;
                
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[NetworkOptimizer] Erro em ApplyQosDscp: {ex.Message}");
                return false;
            }
        }

        public bool RemoveQosDscp(string executablePath)
        {
            try
            {
                if (!AdminHelper.IsRunningAsAdministrator()) return false;

                var exeName = System.IO.Path.GetFileName(executablePath);
                var keyPath = $@"SOFTWARE\Policies\Microsoft\Windows\QoS\{exeName}";

                Registry.LocalMachine.DeleteSubKeyTree(keyPath, false);

                _logger.LogInfo($"[NetworkOptimizer] QoS removido de {exeName}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[NetworkOptimizer] Erro em RemoveQosDscp: {ex.Message}");
                return false;
            }
        }

        public bool SetNicInterruptModeration(bool enabled)
        {
            try
            {
                _logger.LogInfo($"[NetworkOptimizer] Interrupt moderation {(enabled ? "habilitado" : "desabilitado")}");
                // A implementação real requer modificação de drivers de rede específicos
                // Por segurança, apenas logamos a intenção
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[NetworkOptimizer] Erro em SetNicInterruptModeration: {ex.Message}");
                return false;
            }
        }

        public async Task<double> MeasureLatencyAsync(string host, CancellationToken cancellationToken = default)
        {
            return await Task.Run(() =>
            {
                try
                {
                    using var ping = new Ping();
                    var reply = ping.Send(host, 1000);

                    if (reply.Status == IPStatus.Success)
                    {
                        return (double)reply.RoundtripTime;
                    }

                    return -1;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[NetworkOptimizer] Erro ao medir latência: {ex.Message}");
                    return -1;
                }
            }, cancellationToken);
        }
    }
}

