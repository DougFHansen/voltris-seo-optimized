using System;
using System.Diagnostics;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Core.Constants;
using VoltrisOptimizer.Services.Thermal;
using VoltrisOptimizer.Services.Thermal.Models;

namespace VoltrisOptimizer.Services.Power
{
    /// <summary>
    /// Enterprise-grade Intelligent Power Plan Service.
    /// Creates custom Windows power plans named "Voltris - {Profile}" for each Intelligent Profile,
    /// with real-time thermal protection and safety overrides.
    /// 
    /// Architecture:
    ///   SettingsView (ProfileCombo) → SettingsService.ProfileChanged → OnProfileChanged
    ///   GlobalThermalMonitorService.MetricsUpdated → OnThermalMetricsUpdated (thermal override)
    ///   GlobalThermalMonitorService.AlertGenerated → OnThermalAlert (emergency downgrade)
    ///   
    /// Power Plan Strategy:
    ///   Each profile gets a custom plan duplicated from the appropriate base plan (High Performance or Balanced),
    ///   named "Voltris - {ProfileName}" so it appears correctly in Windows power settings.
    ///   On thermal override, switches to the built-in Balanced plan directly.
    /// </summary>
    public sealed class IntelligentPowerPlanService : IDisposable
    {
        private const string TAG = "[PowerPlan]";
        private const string VOLTRIS_PLAN_PREFIX = "Voltris - ";

        private static readonly TimeSpan PlanSwitchCooldown = TimeSpan.FromSeconds(30);
        private static readonly TimeSpan ThermalOverrideCooldown = TimeSpan.FromMinutes(3);
        private static readonly int ThermalCoolReadingsRequired = 6;

        private readonly ILoggingService _logger;
        private readonly SettingsService _settings;
        private readonly IGlobalThermalMonitorService _thermal;

        // State
        private string _activePlanGuid = string.Empty;
        private static string _originalPlanGuid = string.Empty;
        private string _profileDesiredPlanGuid = string.Empty;
        private IntelligentProfileType _currentProfile;
        private DateTime _lastSwitchTime = DateTime.MinValue;
        private bool _thermalOverrideActive;
        private DateTime _thermalOverrideStartTime = DateTime.MinValue;
        private int _consecutiveCoolReadings;
        private readonly SemaphoreSlim _switchLock = new(1, 1);
        private bool _disposed;

        /// <summary>Fired after any plan switch (for systray tooltip updates etc.)</summary>
        public event EventHandler? PlanChanged;

        public IntelligentPowerPlanService(
            ILoggingService logger,
            SettingsService settings,
            IGlobalThermalMonitorService thermal)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _settings = settings ?? throw new ArgumentNullException(nameof(settings));
            _thermal = thermal ?? throw new ArgumentNullException(nameof(thermal));

            _currentProfile = _settings.Settings.IntelligentProfile;

            _settings.ProfileChanged += OnProfileChanged;
            _thermal.MetricsUpdated += OnThermalMetricsUpdated;
            _thermal.AlertGenerated += OnThermalAlert;

            _logger.LogInfo($"{TAG} Serviço inicializado | Perfil={_currentProfile}");
        }

        /// <summary>
        /// Initialize: ensure custom Voltris plan exists for current profile and activate it.
        /// Call once after DI construction, on a background thread.
        /// </summary>
        public async Task InitializeAsync()
        {
            try
            {
                _activePlanGuid = await GetActiveWindowsPlanGuidAsync();

                if (string.IsNullOrEmpty(_originalPlanGuid))
                {
                    var output = RunPowercfgStatic("/getactivescheme");
                    if (!string.IsNullOrEmpty(output) && !output.Contains(VOLTRIS_PLAN_PREFIX, StringComparison.OrdinalIgnoreCase))
                    {
                        _originalPlanGuid = _activePlanGuid;
                        _logger.LogInfo($"{TAG} Plano nativo original capturado: {_originalPlanGuid}");
                    }
                    else
                    {
                        // Se for nulo ou se já for um plano do Voltris (recuperação de crash), assume o Balanceado NATIVO
                        _originalPlanGuid = SystemConstants.PowerPlans.Balanced;
                        _logger.LogInfo($"{TAG} Plano original desconhecido ou já modificado. Salvaguarda definida para Balanceado.");
                    }
                }

                var planName = GetVoltrisPlanName(_currentProfile);
                var basePlanGuid = ResolveBasePlanGuid(_currentProfile);

                _logger.LogInfo($"{TAG} Estado inicial | Plano Windows ativo={_activePlanGuid} | Original={_originalPlanGuid}");
                _logger.LogInfo($"{TAG} Perfil={_currentProfile} | Plano desejado=\"{planName}\" | Base={FormatPlanName(basePlanGuid)}");

                _profileDesiredPlanGuid = await EnsureVoltrisPlanExistsAsync(_currentProfile);

                if (string.IsNullOrEmpty(_profileDesiredPlanGuid))
                {
                    _logger.LogWarning($"{TAG} Não foi possível criar plano customizado. Usando plano base: {FormatPlanName(basePlanGuid)}");
                    _profileDesiredPlanGuid = basePlanGuid;
                }

                if (!string.Equals(_activePlanGuid, _profileDesiredPlanGuid, StringComparison.OrdinalIgnoreCase))
                {
                    _logger.LogInfo($"{TAG} Plano atual difere do perfil. Aplicando \"{planName}\"...");
                    await ApplyPlanAsync(_profileDesiredPlanGuid, $"Inicialização (perfil={_currentProfile})");
                }
                else
                {
                    _logger.LogInfo($"{TAG} Plano já corresponde ao perfil. Nenhuma ação necessária.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"{TAG} Erro na inicialização: {ex.Message}", ex);
            }
        }

        #region Profile → Power Plan Mapping

        /// <summary>
        /// Returns the display name for the custom Voltris power plan.
        /// This name appears in Windows Settings → Power &amp; Sleep.
        /// </summary>
        public static string GetVoltrisPlanName(IntelligentProfileType profile)
        {
            return profile switch
            {
                IntelligentProfileType.GamerCompetitive     => VOLTRIS_PLAN_PREFIX + "Game Competitivo",
                IntelligentProfileType.GamerSinglePlayer    => VOLTRIS_PLAN_PREFIX + "Game SinglePlayer",
                IntelligentProfileType.CreativeVideoEditing => VOLTRIS_PLAN_PREFIX + "Criativo",
                IntelligentProfileType.DeveloperProgramming => VOLTRIS_PLAN_PREFIX + "Desenvolvedor",
                IntelligentProfileType.WorkOffice           => VOLTRIS_PLAN_PREFIX + "Escritório",
                IntelligentProfileType.GeneralBalanced      => VOLTRIS_PLAN_PREFIX + "Balanceado",
                IntelligentProfileType.EnterpriseSecure     => VOLTRIS_PLAN_PREFIX + "Enterprise",
                _ => VOLTRIS_PLAN_PREFIX + "Balanceado"
            };
        }

        /// <summary>
        /// Returns the base Windows plan GUID to duplicate from for each profile.
        /// </summary>
        private static string ResolveBasePlanGuid(IntelligentProfileType profile)
        {
            return profile switch
            {
                IntelligentProfileType.GamerCompetitive     => SystemConstants.PowerPlans.HighPerformance,
                IntelligentProfileType.GamerSinglePlayer    => SystemConstants.PowerPlans.HighPerformance,
                IntelligentProfileType.CreativeVideoEditing => SystemConstants.PowerPlans.HighPerformance,
                IntelligentProfileType.DeveloperProgramming => SystemConstants.PowerPlans.Balanced,
                IntelligentProfileType.WorkOffice           => SystemConstants.PowerPlans.Balanced,
                IntelligentProfileType.GeneralBalanced      => SystemConstants.PowerPlans.Balanced,
                IntelligentProfileType.EnterpriseSecure     => SystemConstants.PowerPlans.Balanced,
                _ => SystemConstants.PowerPlans.Balanced
            };
        }

        /// <summary>
        /// Returns a user-friendly profile name for display (tooltip, etc.)
        /// </summary>
        public static string GetProfileDisplayName(IntelligentProfileType profile)
        {
            return profile switch
            {
                IntelligentProfileType.GamerCompetitive     => "Game Competitivo",
                IntelligentProfileType.GamerSinglePlayer    => "Game SinglePlayer",
                IntelligentProfileType.CreativeVideoEditing => "Criativo",
                IntelligentProfileType.DeveloperProgramming => "Desenvolvedor",
                IntelligentProfileType.WorkOffice           => "Escritório",
                IntelligentProfileType.GeneralBalanced      => "Balanceado",
                IntelligentProfileType.EnterpriseSecure     => "Enterprise",
                _ => "Balanceado"
            };
        }

        #endregion

        #region Custom Plan Management

        /// <summary>
        /// Ensures a custom "Voltris - {Profile}" plan exists in Windows.
        /// If it already exists, returns its GUID. Otherwise, duplicates from the base plan.
        /// </summary>
        private async Task<string> EnsureVoltrisPlanExistsAsync(IntelligentProfileType profile)
        {
            var planName = GetVoltrisPlanName(profile);
            var basePlanGuid = ResolveBasePlanGuid(profile);

            return await Task.Run(() =>
            {
                try
                {
                    // 1. Check if a Voltris plan with this name already exists
                    var existingGuid = FindPlanByName(planName);
                    if (!string.IsNullOrEmpty(existingGuid))
                    {
                        _logger.LogInfo($"{TAG} Plano existente encontrado: \"{planName}\" ({existingGuid})");
                        return existingGuid;
                    }

                    // 2. Duplicate from base plan
                    _logger.LogInfo($"{TAG} Criando plano customizado: \"{planName}\" (base={FormatPlanName(basePlanGuid)})");

                    var duplicateOutput = RunPowercfg($"/duplicatescheme {basePlanGuid}");
                    if (string.IsNullOrEmpty(duplicateOutput))
                    {
                        _logger.LogError($"{TAG} powercfg /duplicatescheme retornou vazio");
                        return string.Empty;
                    }

                    // Extract GUID from output: "Power Scheme GUID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx  (...)"
                    var guidMatch = Regex.Match(duplicateOutput,
                        @"([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})");
                    if (!guidMatch.Success)
                    {
                        _logger.LogError($"{TAG} Não foi possível extrair GUID do output: {duplicateOutput.Trim()}");
                        return string.Empty;
                    }

                    var newGuid = guidMatch.Value.ToLowerInvariant();

                    // 3. Rename the duplicated plan
                    RunPowercfg($"/changename {newGuid} \"{planName}\" \"Plano de energia gerenciado pelo Voltris Optimizer\"");

                    _logger.LogSuccess($"{TAG} ✓ Plano criado: \"{planName}\" ({newGuid})");
                    return newGuid;
                }
                catch (Exception ex)
                {
                    _logger.LogError($"{TAG} Erro ao criar plano customizado: {ex.Message}", ex);
                    return string.Empty;
                }
            });
        }

        /// <summary>
        /// Finds an existing power plan by exact name match.
        /// </summary>
        private string FindPlanByName(string planName)
        {
            try
            {
                var output = RunPowercfg("/list");
                if (string.IsNullOrEmpty(output)) return string.Empty;

                // Each line: "Power Scheme GUID: xxx  (Plan Name) *"
                var lines = output.Split('\n');
                foreach (var line in lines)
                {
                    if (line.Contains(planName, StringComparison.OrdinalIgnoreCase))
                    {
                        var guidMatch = Regex.Match(line,
                            @"([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})");
                        if (guidMatch.Success)
                            return guidMatch.Value.ToLowerInvariant();
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"{TAG} Erro ao buscar plano por nome: {ex.Message}", ex);
            }
            return string.Empty;
        }

        /// <summary>
        /// Removes old Voltris plans that don't match the current profile.
        /// Keeps the system clean — only one Voltris plan active at a time.
        /// </summary>
        private void CleanupOldVoltrisPlans(string keepGuid)
        {
            try
            {
                var output = RunPowercfg("/list");
                if (string.IsNullOrEmpty(output)) return;

                var lines = output.Split('\n');
                foreach (var line in lines)
                {
                    if (line.Contains(VOLTRIS_PLAN_PREFIX, StringComparison.OrdinalIgnoreCase))
                    {
                        var guidMatch = Regex.Match(line,
                            @"([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})");
                        if (guidMatch.Success)
                        {
                            var guid = guidMatch.Value.ToLowerInvariant();
                            if (!string.Equals(guid, keepGuid, StringComparison.OrdinalIgnoreCase))
                            {
                                _logger.LogInfo($"{TAG} Removendo plano Voltris antigo: {guid}");
                                RunPowercfg($"/delete {guid}");
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"{TAG} Erro ao limpar planos antigos: {ex.Message}");
            }
        }

        #endregion

        #region Event Handlers

        private async void OnProfileChanged(object? sender, IntelligentProfileType newProfile)
        {
            if (_disposed) return;

            var previousProfile = _currentProfile;
            _currentProfile = newProfile;

            _logger.LogInfo($"{TAG} ═══ PERFIL ALTERADO: {previousProfile} → {newProfile} ═══");

            // If thermal override is active, prepare the plan but don't switch yet
            if (_thermalOverrideActive)
            {
                // Still create the plan so it's ready when thermal clears
                _profileDesiredPlanGuid = await EnsureVoltrisPlanExistsAsync(newProfile);
                _logger.LogWarning($"{TAG} Override térmico ATIVO. Plano \"{GetVoltrisPlanName(newProfile)}\" preparado, será ativado quando temperatura normalizar.");
                PlanChanged?.Invoke(this, EventArgs.Empty);
                return;
            }

            // Check thermal safety before applying — apenas com temperatura REAL (não estimada)
            var metrics = _thermal.CurrentMetrics;
            if (metrics != null && metrics.IsValid && !metrics.IsCpuTemperatureEstimated)
            {
                var thresholds = ThermalThresholds.GetForProfile(newProfile);
                if (metrics.CpuTemperature > thresholds.CpuCriticalThreshold ||
                    metrics.GpuTemperature > thresholds.GpuCriticalThreshold)
                {
                    _logger.LogWarning($"{TAG} Temperatura elevada (CPU={metrics.CpuTemperature:F1}°C, GPU={metrics.GpuTemperature:F1}°C)");
                    _profileDesiredPlanGuid = await EnsureVoltrisPlanExistsAsync(newProfile);
                    await ActivateThermalOverrideAsync(metrics, "Temperatura elevada durante troca de perfil");
                    return;
                }
            }

            // Create/find the custom plan and activate it
            _profileDesiredPlanGuid = await EnsureVoltrisPlanExistsAsync(newProfile);
            if (!string.IsNullOrEmpty(_profileDesiredPlanGuid))
            {
                await ApplyPlanAsync(_profileDesiredPlanGuid, $"Perfil alterado para {newProfile}");
                // Cleanup old Voltris plans after successful switch
                CleanupOldVoltrisPlans(_profileDesiredPlanGuid);
            }
            else
            {
                var fallback = ResolveBasePlanGuid(newProfile);
                _logger.LogWarning($"{TAG} Fallback para plano base: {FormatPlanName(fallback)}");
                _profileDesiredPlanGuid = fallback;
                await ApplyPlanAsync(fallback, $"Fallback — perfil {newProfile}");
            }
        }

        private async void OnThermalMetricsUpdated(object? sender, ThermalMetrics metrics)
        {
            if (_disposed || !metrics.IsValid) return;

            try
            {
                var thresholds = ThermalThresholds.GetForProfile(_currentProfile);

                if (_thermalOverrideActive)
                {
                    bool isCool = metrics.CpuTemperature < (thresholds.CpuWarningThreshold - 5) &&
                                  metrics.GpuTemperature < (thresholds.GpuWarningThreshold - 5);

                    if (isCool)
                    {
                        _consecutiveCoolReadings++;
                        if (_consecutiveCoolReadings >= ThermalCoolReadingsRequired &&
                            (DateTime.Now - _thermalOverrideStartTime) > ThermalOverrideCooldown)
                        {
                            _logger.LogInfo($"{TAG} ✓ Temperatura normalizada (CPU={metrics.CpuTemperature:F1}°C, GPU={metrics.GpuTemperature:F1}°C)");
                            _logger.LogInfo($"{TAG} Levantando override térmico. Restaurando \"{GetVoltrisPlanName(_currentProfile)}\"");
                            _thermalOverrideActive = false;
                            _consecutiveCoolReadings = 0;

                            // Re-ensure the plan exists (may have been cleaned up)
                            if (string.IsNullOrEmpty(_profileDesiredPlanGuid))
                                _profileDesiredPlanGuid = await EnsureVoltrisPlanExistsAsync(_currentProfile);

                            await ApplyPlanAsync(_profileDesiredPlanGuid, "Temperatura normalizada — restaurando plano do perfil");
                        }
                    }
                    else
                    {
                        _consecutiveCoolReadings = 0;
                    }
                }
                else
                {
                    // CORREÇÃO CRÍTICA: Não ativar override térmico com temperatura ESTIMADA.
                    // Temperaturas estimadas são baseadas em uso de CPU e podem ser muito
                    // imprecisas no boot, causando throttle desnecessário e lentidão permanente.
                    if (metrics.IsCpuTemperatureEstimated || metrics.IsGpuTemperatureEstimated)
                        return;

                    bool cpuCritical = metrics.CpuTemperature > thresholds.CpuCriticalThreshold;
                    bool gpuCritical = metrics.GpuTemperature > thresholds.GpuCriticalThreshold;

                    if (cpuCritical || gpuCritical)
                    {
                        string component = cpuCritical ? "CPU" : "GPU";
                        double temp = cpuCritical ? metrics.CpuTemperature : metrics.GpuTemperature;
                        double threshold = cpuCritical ? thresholds.CpuCriticalThreshold : thresholds.GpuCriticalThreshold;

                        _logger.LogWarning($"{TAG} ⚠ TEMPERATURA CRÍTICA: {component}={temp:F1}°C (limite={threshold:F0}°C para perfil {_currentProfile})");
                        await ActivateThermalOverrideAsync(metrics, $"{component} atingiu {temp:F1}°C (limite={threshold:F0}°C)");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"{TAG} Erro ao processar métricas térmicas: {ex.Message}", ex);
            }
        }

        private void OnThermalAlert(object? sender, ThermalAlert alert)
        {
            if (_disposed) return;
            if (alert.Level == ThermalAlertLevel.Critical)
                _logger.LogWarning($"{TAG} Alerta térmico CRÍTICO recebido: {alert.Component}={alert.Temperature:F1}°C");
        }

        #endregion

        #region Core Plan Switching

        private async Task ActivateThermalOverrideAsync(ThermalMetrics metrics, string reason)
        {
            if (_thermalOverrideActive) return;

            _thermalOverrideActive = true;
            _thermalOverrideStartTime = DateTime.Now;
            _consecutiveCoolReadings = 0;

            _logger.LogWarning($"{TAG} ═══ OVERRIDE TÉRMICO ATIVADO ═══");
            _logger.LogWarning($"{TAG} Motivo: {reason}");
            _logger.LogWarning($"{TAG} CPU={metrics.CpuTemperature:F1}°C | GPU={metrics.GpuTemperature:F1}°C");
            _logger.LogWarning($"{TAG} Forçando plano: Balanceado ({SystemConstants.PowerPlans.Balanced})");
            _logger.LogInfo($"{TAG} Plano do perfil será restaurado quando temperatura normalizar (cooldown={ThermalOverrideCooldown.TotalMinutes:F0}min)");

            await ApplyPlanAsync(SystemConstants.PowerPlans.Balanced, $"Override térmico: {reason}");
        }

        private async Task ApplyPlanAsync(string targetGuid, string reason)
        {
            if (!await _switchLock.WaitAsync(0))
            {
                _logger.LogInfo($"{TAG} Troca de plano já em andamento. Ignorando: {reason}");
                return;
            }

            try
            {
                var elapsed = DateTime.Now - _lastSwitchTime;
                if (elapsed < PlanSwitchCooldown && _lastSwitchTime != DateTime.MinValue)
                {
                    _logger.LogInfo($"{TAG} Cooldown ativo ({elapsed.TotalSeconds:F0}s/{PlanSwitchCooldown.TotalSeconds:F0}s). Ignorando: {reason}");
                    return;
                }

                if (string.Equals(_activePlanGuid, targetGuid, StringComparison.OrdinalIgnoreCase))
                {
                    _logger.LogInfo($"{TAG} Plano já ativo: {targetGuid}. Nenhuma ação: {reason}");
                    return;
                }

                _logger.LogInfo($"{TAG} ──── Aplicando plano de energia ────");
                _logger.LogInfo($"{TAG} De: {_activePlanGuid}");
                _logger.LogInfo($"{TAG} Para: {targetGuid}");
                _logger.LogInfo($"{TAG} Motivo: {reason}");

                var sw = Stopwatch.StartNew();
                bool success = await SetWindowsPlanAsync(targetGuid);
                sw.Stop();

                if (success)
                {
                    var actualGuid = await GetActiveWindowsPlanGuidAsync();
                    bool validated = string.Equals(actualGuid, targetGuid, StringComparison.OrdinalIgnoreCase);

                    if (validated)
                    {
                        _activePlanGuid = targetGuid;
                        _lastSwitchTime = DateTime.Now;
                        _logger.LogSuccess($"{TAG} ✓ Plano aplicado e VALIDADO em {sw.ElapsedMilliseconds}ms");
                        PlanChanged?.Invoke(this, EventArgs.Empty);
                    }
                    else
                    {
                        _activePlanGuid = actualGuid;
                        _logger.LogError($"{TAG} ✗ VALIDAÇÃO FALHOU! Esperado={targetGuid}, Atual={actualGuid}");
                    }
                }
                else
                {
                    _logger.LogError($"{TAG} ✗ Falha ao aplicar plano ({sw.ElapsedMilliseconds}ms)");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"{TAG} Exceção ao aplicar plano: {ex.Message}", ex);
            }
            finally
            {
                _switchLock.Release();
            }
        }

        #endregion

        #region Windows Power Plan Operations

        private static async Task<bool> SetWindowsPlanAsync(string guid)
        {
            return await Task.Run(() =>
            {
                try
                {
                    using var process = Process.Start(new ProcessStartInfo
                    {
                        FileName = "powercfg.exe",
                        Arguments = $"/setactive {guid}",
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true
                    });
                    if (process == null) return false;
                    process.WaitForExit(10_000);
                    return process.ExitCode == 0;
                }
                catch { return false; }
            });
        }

        private static async Task<string> GetActiveWindowsPlanGuidAsync()
        {
            return await Task.Run(() =>
            {
                try
                {
                    var output = RunPowercfgStatic("/getactivescheme");
                    var match = Regex.Match(output,
                        @"([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})");
                    return match.Success ? match.Value.ToLowerInvariant() : string.Empty;
                }
                catch { return string.Empty; }
            });
        }

        private string RunPowercfg(string arguments)
        {
            return RunPowercfgStatic(arguments);
        }

        private static string RunPowercfgStatic(string arguments)
        {
            try
            {
                using var process = Process.Start(new ProcessStartInfo
                {
                    FileName = "powercfg.exe",
                    Arguments = arguments,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true
                });
                if (process == null) return string.Empty;
                var output = process.StandardOutput.ReadToEnd();
                process.WaitForExit(10_000);
                return output;
            }
            catch { return string.Empty; }
        }

        #endregion

        #region Public State (for UI / Systray)

        public bool IsThermalOverrideActive => _thermalOverrideActive;
        public string ActivePlanGuid => _activePlanGuid;
        public string DesiredPlanGuid => _profileDesiredPlanGuid;
        public IntelligentProfileType CurrentProfile => _currentProfile;

        /// <summary>
        /// Returns the current active plan display name for tooltip/UI.
        /// Queries the real Windows active plan to ensure accuracy.
        /// </summary>
        public string GetActivePlanDisplayName()
        {
            if (_thermalOverrideActive)
                return "Balanceado (Proteção Térmica)";

            // Return the Voltris plan name based on the current profile
            // This reflects the plan that was actually applied by the service
            var planName = GetVoltrisPlanName(_currentProfile);

            // If we have a known active GUID, verify it matches what we expect
            if (!string.IsNullOrEmpty(_activePlanGuid))
            {
                // Check if the active plan is a Voltris plan
                try
                {
                    var output = RunPowercfg("/getactivescheme");
                    if (!string.IsNullOrEmpty(output) && output.Contains(VOLTRIS_PLAN_PREFIX, StringComparison.OrdinalIgnoreCase))
                    {
                        // Extract the plan name from the output
                        var nameStart = output.IndexOf('(');
                        var nameEnd = output.LastIndexOf(')');
                        if (nameStart >= 0 && nameEnd > nameStart)
                        {
                            var realName = output.Substring(nameStart + 1, nameEnd - nameStart - 1).Trim();
                            if (!string.IsNullOrEmpty(realName))
                                return realName;
                        }
                    }
                    else if (!string.IsNullOrEmpty(output))
                    {
                        // Not a Voltris plan — show the real Windows plan name
                        var nameStart = output.IndexOf('(');
                        var nameEnd = output.LastIndexOf(')');
                        if (nameStart >= 0 && nameEnd > nameStart)
                        {
                            var realName = output.Substring(nameStart + 1, nameEnd - nameStart - 1).Trim();
                            if (realName.EndsWith("*"))
                                realName = realName.TrimEnd('*', ' ');
                            if (!string.IsNullOrEmpty(realName))
                                return realName;
                        }
                    }
                }
                catch { /* fallback to profile-based name */ }
            }

            return planName;
        }

        private static string FormatPlanName(string guid)
        {
            if (string.IsNullOrEmpty(guid)) return "(desconhecido)";
            return guid.ToLowerInvariant() switch
            {
                SystemConstants.PowerPlans.HighPerformance => "Alto Desempenho",
                SystemConstants.PowerPlans.Balanced => "Balanceado",
                SystemConstants.PowerPlans.PowerSaver => "Economia de Energia",
                SystemConstants.PowerPlans.UltimatePerformance => "Desempenho Máximo",
                _ => guid
            };
        }

        #endregion

        #region Restore on Exit

        /// <summary>
        /// Restaura o plano de energia original do sistema ao fechar o app.
        /// Garante que nenhum plano "Voltris - *" fique ativo após o encerramento,
        /// devolvendo o controle térmico correto para OEM (como Samsung, Dell, etc).
        /// </summary>
        public async Task RestoreOriginalPlanAsync()
        {
            try
            {
                var targetPlan = string.IsNullOrEmpty(_originalPlanGuid) 
                    ? SystemConstants.PowerPlans.Balanced 
                    : _originalPlanGuid;

                _logger.LogInfo($"{TAG} Restaurando plano de energia original do sistema: {targetPlan}...");

                // Restaurar para o plano anterior ao Voltris (ex: plano nativo da placa mãe) ou Balanceado em último caso.
                bool success = await SetWindowsPlanAsync(targetPlan);

                if (success)
                    _logger.LogSuccess($"{TAG} ✓ Plano nativo original restaurado ao fechar.");
                else
                    _logger.LogWarning($"{TAG} ✗ Falha ao restaurar plano nativo. Plano Voltris pode permanecer ativo.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"{TAG} Erro ao restaurar plano original: {ex.Message}", ex);
            }
        }

        #endregion

        #region IDisposable

        public void Dispose()
        {
            if (_disposed) return;
            _disposed = true;

            _settings.ProfileChanged -= OnProfileChanged;
            _thermal.MetricsUpdated -= OnThermalMetricsUpdated;
            _thermal.AlertGenerated -= OnThermalAlert;
            _switchLock.Dispose();

            _logger.LogInfo($"{TAG} Serviço descartado.");
        }

        #endregion
    }
}
