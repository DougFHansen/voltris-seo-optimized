using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services.Performance.Models;
using VoltrisOptimizer.Services.Performance.Native;

namespace VoltrisOptimizer.Services.Performance
{
    /// <summary>
    /// Gerenciador de Power Plans do Windows
    /// Controla Core Parking, Frequency Scaling, Turbo Boost
    /// Usa APENAS APIs oficiais do Windows (PowerSetActiveScheme, PowerWriteACValueIndex)
    /// CORREÇÃO: RISCO #1 - Read-after-write verification implementado
    /// </summary>
    public class PowerPlanManager
    {
        private readonly ILoggingService _logger;
        private Guid _originalPowerScheme;
        private readonly Dictionary<string, uint> _originalSettings = new();
        private readonly HardwareCapabilityDetector _hardwareDetector;

        public PowerPlanManager(ILoggingService logger, HardwareCapabilityDetector? hardwareDetector = null)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _hardwareDetector = hardwareDetector ?? new HardwareCapabilityDetector(logger);
        }

        /// <summary>
        /// Captura o estado atual do sistema para rollback
        /// </summary>
        public PerformanceStateSnapshot CaptureCurrentState()
        {
            try
            {
                var snapshot = new PerformanceStateSnapshot
                {
                    CapturedAt = DateTime.Now,
                    ActivePowerScheme = GetActivePowerScheme()
                };

                // Capturar configurações críticas
                var settingsToCapture = new[]
                {
                    (PowerManagementNative.GUID_PROCESSOR_SETTINGS_SUBGROUP, PowerManagementNative.GUID_PROCESSOR_PARKING_CORE_MIN_CORES, "CoreParkingMinCores"),
                    (PowerManagementNative.GUID_PROCESSOR_SETTINGS_SUBGROUP, PowerManagementNative.GUID_PROCESSOR_PERF_INCREASE_THRESHOLD, "PerfIncreaseThreshold"),
                    (PowerManagementNative.GUID_PROCESSOR_SETTINGS_SUBGROUP, PowerManagementNative.GUID_PROCESSOR_PERF_DECREASE_THRESHOLD, "PerfDecreaseThreshold"),
                    (PowerManagementNative.GUID_PROCESSOR_SETTINGS_SUBGROUP, PowerManagementNative.GUID_PROCESSOR_PERF_MIN_POLICY, "MinProcessorState"),
                    (PowerManagementNative.GUID_PROCESSOR_SETTINGS_SUBGROUP, PowerManagementNative.GUID_PROCESSOR_PERF_MAX_POLICY, "MaxProcessorState"),
                    (PowerManagementNative.GUID_PROCESSOR_SETTINGS_SUBGROUP, PowerManagementNative.GUID_PROCESSOR_PERF_BOOST_MODE, "TurboBoostMode"),
                    (PowerManagementNative.GUID_PROCESSOR_SETTINGS_SUBGROUP, PowerManagementNative.GUID_PROCESSOR_PERF_BOOST_POLICY, "TurboBoostPolicy"),
                };

                foreach (var (subgroup, setting, name) in settingsToCapture)
                {
                    uint value = ReadPowerSetting(snapshot.ActivePowerScheme, subgroup, setting);
                    snapshot.PowerSettings[name] = value;
                    _logger.LogDebug($"[PowerPlan] Capturado {name}: {value}");
                }

                _logger.LogInfo($"[PowerPlan] Estado capturado: Scheme={snapshot.ActivePowerScheme}, {snapshot.PowerSettings.Count} configurações");
                return snapshot;
            }
            catch (Exception ex)
            {
                _logger.LogError("[PowerPlan] Erro ao capturar estado atual", ex);
                throw;
            }
        }

        /// <summary>
        /// Aplica um perfil de performance com validação de hardware e verificação
        /// CORREÇÃO: RISCO #1 e #4 - Read-after-write + validação de hardware
        /// </summary>
        public PerformanceOperationResult ApplyProfile(PerformanceProfile profile, PerformanceStateSnapshot originalState)
        {
            var result = new PerformanceOperationResult { Status = OperationStatus.Success };
            int totalSettings = 0;
            int appliedSettings = 0;
            int skippedSettings = 0;

            try
            {
                _logger.LogInfo($"[PowerPlan] Aplicando perfil: {profile.Name} (Agressividade: {profile.AggressivenessLevel}%)");
                _logger.LogInfo($"[PowerPlan] Hardware: {_hardwareDetector.Capabilities.ProcessorName}");

                // Obter o power scheme ativo
                Guid activeScheme = GetActivePowerScheme();
                _logger.LogDebug($"[PowerPlan] Power Scheme ativo: {activeScheme}");

                // 1. CORE PARKING - Controla quantos cores ficam ativos
                if (profile.CoreParkingMinCores > 0 && _hardwareDetector.Capabilities.SupportsCoreParking)
                {
                    totalSettings++;
                    if (ApplyCoreParking(activeScheme, profile.CoreParkingMinCores, result))
                        appliedSettings++;
                }
                else if (profile.CoreParkingMinCores > 0)
                {
                    skippedSettings++;
                    _logger.LogInfo("[PowerPlan] Core Parking não suportado neste hardware - ignorando");
                }

                // 2. FREQUENCY SCALING - Controla frequência mínima/máxima do processador
                if (_hardwareDetector.Capabilities.SupportsFrequencyScaling)
                {
                    totalSettings += 2;
                    if (ApplyFrequencyScaling(activeScheme, profile.MinProcessorState, profile.MaxProcessorState, result))
                        appliedSettings += 2;
                }

                // 3. TURBO BOOST - Controla boost de frequência
                if (_hardwareDetector.Capabilities.SupportsTurboBoost)
                {
                    totalSettings++;
                    if (ApplyTurboBoost(activeScheme, profile.TurboBoostEnabled, profile.TurboBoostPolicy, result))
                        appliedSettings++;
                }
                else if (profile.TurboBoostEnabled)
                {
                    skippedSettings++;
                    _logger.LogInfo("[PowerPlan] Turbo Boost não suportado neste hardware - ignorando");
                }

                // 4. HETERO POLICY - Para CPUs híbridas (Intel 12th gen+)
                if (profile.HeteroPolicy > 0 && _hardwareDetector.Capabilities.SupportsHeteroPolicy)
                {
                    totalSettings++;
                    if (ApplyHeteroPolicy(activeScheme, profile.HeteroPolicy, result))
                        appliedSettings++;
                }
                else if (profile.HeteroPolicy > 0)
                {
                    skippedSettings++;
                    _logger.LogInfo("[PowerPlan] Hetero Policy não suportado neste hardware - ignorando");
                }

                // 5. PERFORMANCE THRESHOLDS - Ajusta responsividade
                totalSettings += 2;
                if (ApplyPerformanceThresholds(activeScheme, profile.AggressivenessLevel, result))
                    appliedSettings += 2;

                // Aplicar mudanças (força o Windows a recarregar as configurações)
                RefreshPowerScheme(activeScheme);

                // Determinar status final
                if (appliedSettings == totalSettings)
                {
                    result.Status = OperationStatus.Success;
                    result.Message = $"Perfil '{profile.Name}' aplicado completamente ({appliedSettings}/{totalSettings} configurações)";
                }
                else if (appliedSettings > 0)
                {
                    result.Status = OperationStatus.PartialSuccess;
                    result.Message = $"Perfil '{profile.Name}' aplicado parcialmente ({appliedSettings}/{totalSettings} configurações)";
                    result.Warnings.Add($"{skippedSettings} configurações não suportadas pelo hardware");
                }
                else
                {
                    result.Status = OperationStatus.Failed;
                    result.Message = "Nenhuma configuração pôde ser aplicada";
                }

                result.Details["ProfileName"] = profile.Name;
                result.Details["AggressivenessLevel"] = profile.AggressivenessLevel;
                result.Details["AppliedSettings"] = appliedSettings;
                result.Details["TotalSettings"] = totalSettings;
                result.Details["SkippedSettings"] = skippedSettings;

                if (result.Status == OperationStatus.Success)
                    _logger.LogSuccess($"[PowerPlan] {result.Message}");
                else if (result.Status == OperationStatus.PartialSuccess)
                    _logger.LogWarning($"[PowerPlan] {result.Message}");
                else
                    _logger.LogError($"[PowerPlan] {result.Message}");
            }
            catch (Exception ex)
            {
                result.Status = OperationStatus.Failed;
                result.Message = $"Erro ao aplicar perfil: {ex.Message}";
                result.Errors.Add(ex.Message);
                _logger.LogError($"[PowerPlan] {result.Message}", ex);
            }

            return result;
        }

        /// <summary>
        /// Restaura o estado original do sistema
        /// </summary>
        public PerformanceOperationResult RestoreOriginalState(PerformanceStateSnapshot snapshot)
        {
            var result = new PerformanceOperationResult { Success = true };

            try
            {
                _logger.LogInfo("[PowerPlan] Restaurando estado original do sistema...");

                Guid activeScheme = GetActivePowerScheme();

                // Restaurar cada configuração capturada
                foreach (var kvp in snapshot.PowerSettings)
                {
                    try
                    {
                        var settingGuid = GetSettingGuidByName(kvp.Key);
                        if (settingGuid != Guid.Empty)
                        {
                            WritePowerSetting(activeScheme, PowerManagementNative.GUID_PROCESSOR_SETTINGS_SUBGROUP, settingGuid, kvp.Value);
                            _logger.LogDebug($"[PowerPlan] Restaurado {kvp.Key}: {kvp.Value}");
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"[PowerPlan] Falha ao restaurar {kvp.Key}: {ex.Message}");
                        result.Errors.Add($"Falha ao restaurar {kvp.Key}");
                    }
                }

                // Aplicar mudanças
                RefreshPowerScheme(activeScheme);

                result.Message = "Estado original restaurado com sucesso";
                _logger.LogSuccess($"[PowerPlan] {result.Message}");
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.Message = $"Erro ao restaurar estado: {ex.Message}";
                result.Errors.Add(ex.Message);
                _logger.LogError($"[PowerPlan] {result.Message}", ex);
            }

            return result;
        }

        #region Private Methods

        private bool ApplyCoreParking(Guid scheme, int minCoresPercent, PerformanceOperationResult result)
        {
            try
            {
                // Core Parking: 0 = Permitir parking de todos os cores, 100 = Todos os cores sempre ativos
                uint expectedValue = (uint)minCoresPercent;
                
                WritePowerSetting(scheme, PowerManagementNative.GUID_PROCESSOR_SETTINGS_SUBGROUP,
                    PowerManagementNative.GUID_PROCESSOR_PARKING_CORE_MIN_CORES, expectedValue);

                // READ-AFTER-WRITE VERIFICATION
                uint actualValue = ReadPowerSetting(scheme, PowerManagementNative.GUID_PROCESSOR_SETTINGS_SUBGROUP,
                    PowerManagementNative.GUID_PROCESSOR_PARKING_CORE_MIN_CORES);

                var verification = new SettingVerificationResult
                {
                    SettingName = "CoreParkingMinCores",
                    ExpectedValue = expectedValue,
                    ActualValue = actualValue,
                    Verified = actualValue == expectedValue,
                    Reason = actualValue == expectedValue ? "OK" : "Windows ignorou a configuração"
                };

                result.VerificationResults["CoreParkingMinCores"] = verification;

                if (!verification.Verified)
                {
                    result.Warnings.Add($"Core Parking: esperado={expectedValue}, real={actualValue}");
                    _logger.LogWarning($"[PowerPlan] Core Parking não aplicado corretamente: esperado={expectedValue}, real={actualValue}");
                    return false;
                }

                // Desabilitar Core Parking completamente se minCores = 100
                if (minCoresPercent == 100)
                {
                    WritePowerSetting(scheme, PowerManagementNative.GUID_PROCESSOR_SETTINGS_SUBGROUP,
                        PowerManagementNative.GUID_PROCESSOR_ALLOW_THROTTLING, 0);
                }

                result.Details["CoreParkingMinCores"] = minCoresPercent;
                _logger.LogInfo($"[PowerPlan] Core Parking configurado: {minCoresPercent}% (verificado)");
                return true;
            }
            catch (Exception ex)
            {
                result.Errors.Add($"Core Parking: {ex.Message}");
                _logger.LogWarning($"[PowerPlan] Falha ao configurar Core Parking: {ex.Message}");
                return false;
            }
        }

        private bool ApplyFrequencyScaling(Guid scheme, int minState, int maxState, PerformanceOperationResult result)
        {
            bool success = true;
            
            try
            {
                // Frequência mínima (0-100%)
                WritePowerSetting(scheme, PowerManagementNative.GUID_PROCESSOR_SETTINGS_SUBGROUP,
                    PowerManagementNative.GUID_PROCESSOR_PERF_MIN_POLICY, (uint)minState);

                // READ-AFTER-WRITE VERIFICATION
                uint actualMin = ReadPowerSetting(scheme, PowerManagementNative.GUID_PROCESSOR_SETTINGS_SUBGROUP,
                    PowerManagementNative.GUID_PROCESSOR_PERF_MIN_POLICY);

                var verificationMin = new SettingVerificationResult
                {
                    SettingName = "MinProcessorState",
                    ExpectedValue = (uint)minState,
                    ActualValue = actualMin,
                    Verified = actualMin == (uint)minState,
                    Reason = actualMin == (uint)minState ? "OK" : "Windows ignorou a configuração"
                };

                result.VerificationResults["MinProcessorState"] = verificationMin;

                if (!verificationMin.Verified)
                {
                    result.Warnings.Add($"MinProcessorState: esperado={minState}, real={actualMin}");
                    _logger.LogWarning($"[PowerPlan] MinProcessorState não aplicado: esperado={minState}, real={actualMin}");
                    success = false;
                }

                // Frequência máxima (0-100%)
                WritePowerSetting(scheme, PowerManagementNative.GUID_PROCESSOR_SETTINGS_SUBGROUP,
                    PowerManagementNative.GUID_PROCESSOR_PERF_MAX_POLICY, (uint)maxState);

                uint actualMax = ReadPowerSetting(scheme, PowerManagementNative.GUID_PROCESSOR_SETTINGS_SUBGROUP,
                    PowerManagementNative.GUID_PROCESSOR_PERF_MAX_POLICY);

                var verificationMax = new SettingVerificationResult
                {
                    SettingName = "MaxProcessorState",
                    ExpectedValue = (uint)maxState,
                    ActualValue = actualMax,
                    Verified = actualMax == (uint)maxState,
                    Reason = actualMax == (uint)maxState ? "OK" : "Windows ignorou a configuração"
                };

                result.VerificationResults["MaxProcessorState"] = verificationMax;

                if (!verificationMax.Verified)
                {
                    result.Warnings.Add($"MaxProcessorState: esperado={maxState}, real={actualMax}");
                    _logger.LogWarning($"[PowerPlan] MaxProcessorState não aplicado: esperado={maxState}, real={actualMax}");
                    success = false;
                }

                result.Details["MinProcessorState"] = minState;
                result.Details["MaxProcessorState"] = maxState;
                
                if (success)
                    _logger.LogInfo($"[PowerPlan] Frequency Scaling: Min={minState}%, Max={maxState}% (verificado)");
                
                return success;
            }
            catch (Exception ex)
            {
                result.Errors.Add($"Frequency Scaling: {ex.Message}");
                _logger.LogWarning($"[PowerPlan] Falha ao configurar Frequency Scaling: {ex.Message}");
                return false;
            }
        }

        private bool ApplyTurboBoost(Guid scheme, bool enabled, int policy, PerformanceOperationResult result)
        {
            try
            {
                // Turbo Boost Mode: 0 = Desativado, 1 = Ativado, 2 = Agressivo
                uint mode = enabled ? (policy >= 75 ? 2u : 1u) : 0u;
                WritePowerSetting(scheme, PowerManagementNative.GUID_PROCESSOR_SETTINGS_SUBGROUP,
                    PowerManagementNative.GUID_PROCESSOR_PERF_BOOST_MODE, mode);

                // READ-AFTER-WRITE VERIFICATION
                uint actualMode = ReadPowerSetting(scheme, PowerManagementNative.GUID_PROCESSOR_SETTINGS_SUBGROUP,
                    PowerManagementNative.GUID_PROCESSOR_PERF_BOOST_MODE);

                var verificationMode = new SettingVerificationResult
                {
                    SettingName = "TurboBoostMode",
                    ExpectedValue = mode,
                    ActualValue = actualMode,
                    Verified = actualMode == mode,
                    Reason = actualMode == mode ? "OK" : "Windows ignorou a configuração"
                };

                result.VerificationResults["TurboBoostMode"] = verificationMode;

                if (!verificationMode.Verified)
                {
                    result.Warnings.Add($"TurboBoostMode: esperado={mode}, real={actualMode}");
                    _logger.LogWarning($"[PowerPlan] TurboBoostMode não aplicado: esperado={mode}, real={actualMode}");
                    return false;
                }

                // Turbo Boost Policy (0-100)
                if (enabled)
                {
                    WritePowerSetting(scheme, PowerManagementNative.GUID_PROCESSOR_SETTINGS_SUBGROUP,
                        PowerManagementNative.GUID_PROCESSOR_PERF_BOOST_POLICY, (uint)policy);
                }

                result.Details["TurboBoostEnabled"] = enabled;
                result.Details["TurboBoostPolicy"] = policy;
                _logger.LogInfo($"[PowerPlan] Turbo Boost: {(enabled ? $"Ativado (Policy={policy})" : "Desativado")} (verificado)");
                return true;
            }
            catch (Exception ex)
            {
                result.Errors.Add($"Turbo Boost: {ex.Message}");
                _logger.LogWarning($"[PowerPlan] Falha ao configurar Turbo Boost: {ex.Message}");
                return false;
            }
        }

        private bool ApplyHeteroPolicy(Guid scheme, int policy, PerformanceOperationResult result)
        {
            try
            {
                // Hetero Policy: 0 = Automático, 1 = Preferir P-cores, 2 = Preferir E-cores
                WritePowerSetting(scheme, PowerManagementNative.GUID_PROCESSOR_SETTINGS_SUBGROUP,
                    PowerManagementNative.GUID_PROCESSOR_HETERO_POLICY, (uint)policy);

                // READ-AFTER-WRITE VERIFICATION
                uint actualPolicy = ReadPowerSetting(scheme, PowerManagementNative.GUID_PROCESSOR_SETTINGS_SUBGROUP,
                    PowerManagementNative.GUID_PROCESSOR_HETERO_POLICY);

                var verification = new SettingVerificationResult
                {
                    SettingName = "HeteroPolicy",
                    ExpectedValue = (uint)policy,
                    ActualValue = actualPolicy,
                    Verified = actualPolicy == (uint)policy,
                    Reason = actualPolicy == (uint)policy ? "OK" : "Windows ignorou a configuração"
                };

                result.VerificationResults["HeteroPolicy"] = verification;

                if (!verification.Verified)
                {
                    result.Warnings.Add($"HeteroPolicy: esperado={policy}, real={actualPolicy}");
                    _logger.LogWarning($"[PowerPlan] HeteroPolicy não aplicado: esperado={policy}, real={actualPolicy}");
                    return false;
                }

                result.Details["HeteroPolicy"] = policy;
                string policyName = policy switch
                {
                    1 => "P-cores (Performance)",
                    2 => "E-cores (Efficiency)",
                    _ => "Automático"
                };
                _logger.LogInfo($"[PowerPlan] Hetero Policy: {policyName} (verificado)");
                return true;
            }
            catch (Exception ex)
            {
                result.Errors.Add($"Hetero Policy: {ex.Message}");
                _logger.LogWarning($"[PowerPlan] Falha ao configurar Hetero Policy: {ex.Message}");
                return false;
            }
        }

        private bool ApplyPerformanceThresholds(Guid scheme, int aggressiveness, PerformanceOperationResult result)
        {
            bool success = true;
            
            try
            {
                // Performance Increase Threshold: Quanto menor, mais rápido aumenta frequência
                // Agressivo: 10, Moderado: 50, Conservador: 90
                uint increaseThreshold = (uint)(100 - aggressiveness);
                WritePowerSetting(scheme, PowerManagementNative.GUID_PROCESSOR_SETTINGS_SUBGROUP,
                    PowerManagementNative.GUID_PROCESSOR_PERF_INCREASE_THRESHOLD, increaseThreshold);

                // READ-AFTER-WRITE VERIFICATION
                uint actualIncrease = ReadPowerSetting(scheme, PowerManagementNative.GUID_PROCESSOR_SETTINGS_SUBGROUP,
                    PowerManagementNative.GUID_PROCESSOR_PERF_INCREASE_THRESHOLD);

                if (actualIncrease != increaseThreshold)
                {
                    result.Warnings.Add($"PerfIncreaseThreshold: esperado={increaseThreshold}, real={actualIncrease}");
                    _logger.LogWarning($"[PowerPlan] PerfIncreaseThreshold não aplicado: esperado={increaseThreshold}, real={actualIncrease}");
                    success = false;
                }

                // Performance Decrease Threshold: Quanto maior, mais lento diminui frequência
                // Agressivo: 20, Moderado: 50, Conservador: 80
                uint decreaseThreshold = (uint)(20 + (aggressiveness * 0.6));
                WritePowerSetting(scheme, PowerManagementNative.GUID_PROCESSOR_SETTINGS_SUBGROUP,
                    PowerManagementNative.GUID_PROCESSOR_PERF_DECREASE_THRESHOLD, decreaseThreshold);

                uint actualDecrease = ReadPowerSetting(scheme, PowerManagementNative.GUID_PROCESSOR_SETTINGS_SUBGROUP,
                    PowerManagementNative.GUID_PROCESSOR_PERF_DECREASE_THRESHOLD);

                if (actualDecrease != decreaseThreshold)
                {
                    result.Warnings.Add($"PerfDecreaseThreshold: esperado={decreaseThreshold}, real={actualDecrease}");
                    _logger.LogWarning($"[PowerPlan] PerfDecreaseThreshold não aplicado: esperado={decreaseThreshold}, real={actualDecrease}");
                    success = false;
                }

                result.Details["PerfIncreaseThreshold"] = increaseThreshold;
                result.Details["PerfDecreaseThreshold"] = decreaseThreshold;
                
                if (success)
                    _logger.LogInfo($"[PowerPlan] Performance Thresholds: Increase={increaseThreshold}, Decrease={decreaseThreshold} (verificado)");
                
                return success;
            }
            catch (Exception ex)
            {
                result.Errors.Add($"Performance Thresholds: {ex.Message}");
                _logger.LogWarning($"[PowerPlan] Falha ao configurar Performance Thresholds: {ex.Message}");
                return false;
            }
        }

        private Guid GetActivePowerScheme()
        {
            IntPtr ptrActiveGuid = IntPtr.Zero;
            try
            {
                uint result = PowerManagementNative.PowerGetActiveScheme(IntPtr.Zero, out ptrActiveGuid);
                if (result != 0)
                {
                    throw new InvalidOperationException($"PowerGetActiveScheme falhou com código: {result}");
                }

                Guid activeGuid = Marshal.PtrToStructure<Guid>(ptrActiveGuid);
                return activeGuid;
            }
            finally
            {
                if (ptrActiveGuid != IntPtr.Zero)
                {
                    PowerManagementNative.LocalFree(ptrActiveGuid);
                }
            }
        }

        private uint ReadPowerSetting(Guid scheme, Guid subgroup, Guid setting)
        {
            uint value = 0;
            uint result = PowerManagementNative.PowerReadACValueIndex(IntPtr.Zero, ref scheme, ref subgroup, ref setting, out value);
            if (result != 0)
            {
                _logger.LogWarning($"[PowerPlan] PowerReadACValueIndex falhou: {result}");
            }
            return value;
        }

        private void WritePowerSetting(Guid scheme, Guid subgroup, Guid setting, uint value)
        {
            uint result = PowerManagementNative.PowerWriteACValueIndex(IntPtr.Zero, ref scheme, ref subgroup, ref setting, value);
            if (result != 0)
            {
                throw new InvalidOperationException($"PowerWriteACValueIndex falhou com código: {result}");
            }
        }

        private void RefreshPowerScheme(Guid scheme)
        {
            // Força o Windows a recarregar as configurações
            uint result = PowerManagementNative.PowerSetActiveScheme(IntPtr.Zero, ref scheme);
            if (result != 0)
            {
                _logger.LogWarning($"[PowerPlan] PowerSetActiveScheme falhou: {result}");
            }
        }

        private Guid GetSettingGuidByName(string name)
        {
            return name switch
            {
                "CoreParkingMinCores" => PowerManagementNative.GUID_PROCESSOR_PARKING_CORE_MIN_CORES,
                "PerfIncreaseThreshold" => PowerManagementNative.GUID_PROCESSOR_PERF_INCREASE_THRESHOLD,
                "PerfDecreaseThreshold" => PowerManagementNative.GUID_PROCESSOR_PERF_DECREASE_THRESHOLD,
                "MinProcessorState" => PowerManagementNative.GUID_PROCESSOR_PERF_MIN_POLICY,
                "MaxProcessorState" => PowerManagementNative.GUID_PROCESSOR_PERF_MAX_POLICY,
                "TurboBoostMode" => PowerManagementNative.GUID_PROCESSOR_PERF_BOOST_MODE,
                "TurboBoostPolicy" => PowerManagementNative.GUID_PROCESSOR_PERF_BOOST_POLICY,
                _ => Guid.Empty
            };
        }

        #endregion
    }
}
