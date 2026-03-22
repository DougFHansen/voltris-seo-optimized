using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Management;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32;
using VoltrisOptimizer.Core.Constants;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using VoltrisOptimizer.Utils;
// Usar alias para evitar conflito
using GamerModels = VoltrisOptimizer.Services.Gamer.Models;

namespace VoltrisOptimizer.Services.Gamer.Implementation
{
    /// <summary>
    /// Implementação do otimizador de GPU para jogos
    /// </summary>
    public class GpuGamingOptimizerService : IGpuGamingOptimizer
    {
        private readonly ILoggingService _logger;
        private readonly IHardwareDetector _hardwareDetector;
        private readonly IRegistryService? _registry;

        // Backups para restauração
        private int? _originalHwSchMode;
        private int? _originalTdrDelay;
        private int? _originalTdrLevel;
        private int? _originalTdrDdiDelay;

        public GpuGamingOptimizerService(ILoggingService logger, IHardwareDetector hardwareDetector, IRegistryService? registry = null)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _hardwareDetector = hardwareDetector ?? throw new ArgumentNullException(nameof(hardwareDetector));
            _registry = registry;
        }

        public async Task<GamerModels.GpuInfo> GetGpuInfoAsync(CancellationToken cancellationToken = default)
        {
            return await _hardwareDetector.GetGpuInfoAsync(cancellationToken);
        }

        public async Task<GamerModels.GpuTemperature> GetTemperatureAsync(CancellationToken cancellationToken = default)
        {
            try
            {
                double temperature = await GetGpuTemperatureRealAsync();
                
                if (temperature > 0 && temperature < 150) // Sanity check
                {
                    return new GamerModels.GpuTemperature
                    {
                        Current = temperature,
                        Max = 83, // Temperatura máxima típica para GPUs
                        IsAvailable = true
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[GpuOptimizer] Erro ao obter temperatura: {ex.Message}");
            }
            
            return new GamerModels.GpuTemperature
            {
                Current = 0,
                Max = 83,
                IsAvailable = false
            };
        }
        
        /// <summary>
        /// Obtém temperatura real da GPU usando múltiplos métodos
        /// </summary>
        private async Task<double> GetGpuTemperatureRealAsync()
        {
            // Detectar fabricante da GPU para usar método apropriado
            bool isIntel = false;
            // ✅ CORREÇÃO: Usar async/await em vez de .Wait()
            try
            {
                var gpuInfo = await GetGpuInfoAsync();
                isIntel = gpuInfo.Vendor == GamerModels.GpuVendor.Intel;
            }
            catch
            {
                // Se não conseguir detectar, tentar todos os métodos
                isIntel = false;
            }
            
            // Método 1: NVIDIA via nvidia-smi (mais confiável)
            if (HasNvidiaSmi())
            {
                try
                {
                    var temp = GetNvidiaTemperatureViaSmi();
                    if (temp > 0) return temp;
                }
                catch { }
            }
            
            // Método 2: NVIDIA via WMI
            try
            {
                var obj = VoltrisOptimizer.Utils.WmiHelper.QueryFirstSafe("SELECT * FROM NvGpuSensor WHERE SensorID=15", "root\\CIMV2\\NV");
                if (obj != null)
                {
                    var temp = Convert.ToDouble(obj["SensorValue"]);
                    if (temp > 0 && temp < 150) return temp;
                }
            }
            catch { }
            
            // Método 3: AMD via WMI
            try
            {
                var obj = VoltrisOptimizer.Utils.WmiHelper.QueryFirstSafe("SELECT * FROM ADL_GpuTemperature", "root\\AMD\\ADL");
                if (obj != null)
                {
                    var temp = Convert.ToDouble(obj["Temperature"]);
                    if (temp > 0 && temp < 150) return temp;
                }
            }
            catch { }
            
            // Método 4: Intel - MSAcpi_ThermalZoneTemperature (pode incluir GPU integrada)
            if (isIntel)
            {
                try
                {
                    var obj = VoltrisOptimizer.Utils.WmiHelper.QueryFirstSafe("SELECT * FROM MSAcpi_ThermalZoneTemperature", "root\\WMI");
                    if (obj != null)
                    {
                        var temp = Convert.ToDouble(obj["CurrentTemperature"]);
                        // Converter de Kelvin * 10 para Celsius
                        var celsius = (temp - 2732) / 10.0;
                        
                        if (celsius > 0 && celsius < 150)
                        {
                            if (celsius >= 30 && celsius <= 100)
                            {
                                return celsius;
                            }
                        }
                    }
                }
                catch { }
                
                // Método 4b: Intel - Win32_TemperatureProbe
                try
                {
                    var obj = VoltrisOptimizer.Utils.WmiHelper.QueryFirstSafe("SELECT * FROM Win32_TemperatureProbe");
                    if (obj != null)
                    {
                        var temp = obj["CurrentReading"];
                        if (temp != null)
                        {
                            var celsius = Convert.ToDouble(temp);
                            if (celsius > 0 && celsius < 150) return celsius;
                        }
                    }
                }
                catch { }
            }
            
            // Método 5: OpenHardwareMonitor/LibreHardwareMonitor
            try
            {
                var query = "SELECT * FROM Sensor WHERE SensorType='Temperature' AND (Name LIKE '%GPU%' OR Name LIKE '%Intel%' OR Name LIKE '%Iris%' OR Name LIKE '%Arc%' OR Name LIKE '%UHD%')";
                
                var obj = VoltrisOptimizer.Utils.WmiHelper.QueryFirstSafe(query, "root\\OpenHardwareMonitor");
                if (obj != null) return Convert.ToDouble(obj["Value"]);
                
                obj = VoltrisOptimizer.Utils.WmiHelper.QueryFirstSafe(query, "root\\LibreHardwareMonitor");
                if (obj != null) return Convert.ToDouble(obj["Value"]);
            }
            catch { }
            
            return 0; // Não foi possível obter temperatura
        }
        
        /// <summary>
        /// Verifica se nvidia-smi está disponível
        /// </summary>
        private bool HasNvidiaSmi()
        {
            try
            {
                var nvidiaSmiPath = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles),
                    "NVIDIA Corporation", "NVSMI", "nvidia-smi.exe");
                
                if (File.Exists(nvidiaSmiPath)) return true;
                
                // Tentar via PATH
                var startInfo = new ProcessStartInfo
                {
                    FileName = "nvidia-smi",
                    Arguments = "--version",
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true
                };
                
                using var process = Process.Start(startInfo);
                if (process != null)
                {
                    process.WaitForExit(1000);
                    return process.ExitCode == 0;
                }
            }
            catch { }
            
            return false;
        }
        
        /// <summary>
        /// Obtém temperatura NVIDIA via nvidia-smi
        /// </summary>
        private double GetNvidiaTemperatureViaSmi()
        {
            try
            {
                var startInfo = new ProcessStartInfo
                {
                    FileName = "nvidia-smi",
                    Arguments = "--query-gpu=temperature.gpu --format=csv,noheader,nounits",
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true
                };
                
                using var process = Process.Start(startInfo);
                if (process != null)
                {
                    process.WaitForExit(2000);
                    if (process.ExitCode == 0)
                    {
                        var output = process.StandardOutput.ReadToEnd().Trim();
                        if (double.TryParse(output, out var temp) && temp > 0 && temp < 150)
                        {
                            return temp;
                        }
                    }
                }
            }
            catch { }
            
            return 0;
        }

        public async Task<GamerModels.GpuOptimizationResult> ApplyOptimizationsAsync(GamerModels.GpuOptimizationOptions options, CancellationToken cancellationToken = default)
        {
            try
            {
                _logger.LogInfo($"[GpuOptimizer] Aplicando otimizações customizadas (Intensidade: {options.Intensity})");
                
                // 1. HAGS
                if (options.EnableHags)
                {
                    SetHagsEnabled(true);
                }
                
                // 2. Performance Mode
                SetPerformanceMode();
                
                // 3. Tweaks baseados em intensidade
                if (options.Intensity >= GamerModels.GpuOptimizationIntensity.High)
                {
                    ApplyTdrTweaks(true);
                }

                return new GamerModels.GpuOptimizationResult { Success = true };
            }
            catch (Exception ex)
            {
                _logger.LogError("[GpuOptimizer] Erro em ApplyOptimizationsAsync", ex);
                return new GamerModels.GpuOptimizationResult { Success = false, Details = ex.Message };
            }
        }

        public async Task<bool> OptimizeAsync(CancellationToken cancellationToken = default)
        {
            return await Task.Run(async () =>
            {
                try
                {
                    _logger.LogInfo("[GpuOptimizer] Aplicando otimizações de GPU...");

                    var gpuInfo = await GetGpuInfoAsync(cancellationToken);

                    // 1. Habilitar Hardware-Accelerated GPU Scheduling (HAGS)
                    if (gpuInfo.SupportsHags)
                    {
                        SetHagsEnabled(true);
                    }

                    // 2. Configurar modo de performance
                    SetPerformanceMode();

                    // 3. Aplicar TDR tweaks para GPUs discretas (exceto Intel integrada)
                    if (gpuInfo.IsDiscrete || gpuInfo.Vendor != GamerModels.GpuVendor.Intel)
                    {
                        ApplyTdrTweaks(true);
                    }

                    _logger.LogSuccess("[GpuOptimizer] GPU otimizada para jogos");
                    _logger.LogInfo("[GpuOptimizer] Nota: Otimizações de registro aplicadas. Para controle preciso de Clocks/Fans, utilize o painel do fabricante (GeForce Experience/Adrenalin).");
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError("[GpuOptimizer] Erro ao otimizar GPU", ex);
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
                    _logger.LogInfo("[GpuOptimizer] Restaurando configurações de GPU...");

                    // Restaurar HAGS
                    if (_originalHwSchMode.HasValue)
                    {
                        try
                        {
                            using var key = Registry.LocalMachine.OpenSubKey(
                                SystemConstants.RegistryPaths.GraphicsDrivers, true);
                            key?.SetValue("HwSchMode", _originalHwSchMode.Value, RegistryValueKind.DWord);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"[GpuOptimizer] Erro ao restaurar HAGS: {ex.Message}");
                        }
                    }

                    // Restaurar TDR
                    RestoreTdrSettings();

                    _logger.LogSuccess("[GpuOptimizer] Configurações de GPU restauradas");
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError("[GpuOptimizer] Erro ao restaurar GPU", ex);
                    return false;
                }
            }, cancellationToken);
        }

        public bool SetHagsEnabled(bool enabled)
        {
            try
            {
                if (!AdminHelper.IsRunningAsAdministrator())
                {
                    _logger.LogWarning("[GpuOptimizer] Sem permissão para HAGS");
                    return false;
                }

                using var key = Registry.LocalMachine.OpenSubKey(
                    SystemConstants.RegistryPaths.GraphicsDrivers, true);

                if (key == null)
                {
                    _logger.LogWarning("[GpuOptimizer] Chave GraphicsDrivers não encontrada");
                    return false;
                }

                // Backup
                var current = key.GetValue("HwSchMode");
                if (current is int intVal)
                {
                    _originalHwSchMode = intVal;
                }

                // HwSchMode: 1 = Desabilitado, 2 = Habilitado
                var value = enabled 
                    ? SystemConstants.HagsSettings.Enabled 
                    : SystemConstants.HagsSettings.Disabled;

                key.SetValue("HwSchMode", value, RegistryValueKind.DWord);

                _logger.LogInfo($"[GpuOptimizer] HAGS {(enabled ? "habilitado" : "desabilitado")}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[GpuOptimizer] Erro em SetHagsEnabled: {ex.Message}");
                return false;
            }
        }

        private void SetPerformanceMode()
        {
            try
            {
                if (!AdminHelper.IsRunningAsAdministrator()) return;

                using var key = Registry.LocalMachine.OpenSubKey(
                    SystemConstants.RegistryPaths.GraphicsDrivers, true);

                if (key == null) return;

                // DCI timeout
                using var dciKey = Registry.LocalMachine.OpenSubKey(
                    SystemConstants.RegistryPaths.GraphicsDriversDci, true);
                dciKey?.SetValue("Timeout", 7, RegistryValueKind.DWord);

                _logger.LogInfo("[GpuOptimizer] Modo de performance configurado");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[GpuOptimizer] Erro em SetPerformanceMode: {ex.Message}");
            }
        }

        public bool ApplyTdrTweaks(bool enable)
        {
            try
            {
                if (!AdminHelper.IsRunningAsAdministrator())
                {
                    _logger.LogWarning("[GpuOptimizer] Sem permissão para TDR");
                    return false;
                }

                using var key = Registry.LocalMachine.OpenSubKey(
                    SystemConstants.RegistryPaths.GraphicsDrivers, true);

                if (key == null)
                {
                    _logger.LogWarning("[GpuOptimizer] Chave GraphicsDrivers não encontrada");
                    return false;
                }

                if (enable)
                {
                    // Backup valores originais
                    BackupTdrSettings(key);

                    // Aplicar tweaks para jogos
                    // AVISO: NUNCA desabilitar TDR (TdrLevel=0) pois trava o PC em caso de crash do driver
                    // Solução Enterprise: Aumentar o delay para permitir recuperação
                    key.SetValue("TdrDelay", 
                        10, // 10 segundos (Recomendação Enterprise)
                        RegistryValueKind.DWord);
                    
                    // Remover TdrLevel=0 se existir (reverter para padrão/ativo)
                    try { key.DeleteValue("TdrLevel", false); } catch {}
                    
                    key.SetValue("TdrDdiDelay", 
                        SystemConstants.TdrSettings.DdiDelayDefault, 
                        RegistryValueKind.DWord);

                    _logger.LogInfo("[GpuOptimizer] TDR otimizado (Delay=10s) - Seguro para Overclock");
                }
                else
                {
                    // Restaurar
                    RestoreTdrSettings();
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[GpuOptimizer] Erro em ApplyTdrTweaks: {ex.Message}");
                return false;
            }
        }

        private void BackupTdrSettings(RegistryKey key)
        {
            try
            {
                var delay = key.GetValue("TdrDelay");
                if (delay is int d) _originalTdrDelay = d;

                var level = key.GetValue("TdrLevel");
                if (level is int l) _originalTdrLevel = l;

                var ddiDelay = key.GetValue("TdrDdiDelay");
                if (ddiDelay is int dd) _originalTdrDdiDelay = dd;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[GpuOptimizer] Erro ao fazer backup TDR: {ex.Message}");
            }
        }

        private void RestoreTdrSettings()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(
                    SystemConstants.RegistryPaths.GraphicsDrivers, true);

                if (key == null) return;

                if (_originalTdrDelay.HasValue)
                    key.SetValue("TdrDelay", _originalTdrDelay.Value, RegistryValueKind.DWord);
                else
                    key.DeleteValue("TdrDelay", false);

                if (_originalTdrLevel.HasValue)
                    key.SetValue("TdrLevel", _originalTdrLevel.Value, RegistryValueKind.DWord);
                else
                    key.DeleteValue("TdrLevel", false);

                if (_originalTdrDdiDelay.HasValue)
                    key.SetValue("TdrDdiDelay", _originalTdrDdiDelay.Value, RegistryValueKind.DWord);
                else
                    key.DeleteValue("TdrDdiDelay", false);

                _logger.LogInfo("[GpuOptimizer] TDR restaurado");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[GpuOptimizer] Erro ao restaurar TDR: {ex.Message}");
            }
        }
    }
}

