using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Management;
using System.Threading.Tasks;
using Microsoft.Win32;
using VoltrisOptimizer.Core.Constants;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Interfaces;

namespace VoltrisOptimizer.Services.Power
{
    public enum DiagnosticSeverity { Ok, Warning, Critical }

    public class DiagnosticIssue
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Fix { get; set; } = string.Empty;
        public DiagnosticSeverity Severity { get; set; }
        public string SeverityColorHex => Severity switch
        {
            DiagnosticSeverity.Critical => "#FF4466",
            DiagnosticSeverity.Warning  => "#FFAA00",
            _                           => "#00FF88"
        };
        public string SeverityIcon => Severity switch
        {
            DiagnosticSeverity.Critical => "⛔",
            DiagnosticSeverity.Warning  => "⚠️",
            _                           => "✅"
        };
    }

    public class ThrottlingStatus
    {
        public bool IsThermalThrottling { get; set; }
        public bool IsPowerLimitThrottling { get; set; }
        public bool IsFirmwareLimitThrottling { get; set; }
        public bool IsOnBattery { get; set; }
        public double CurrentFreqMhz { get; set; }
        public double MaxFreqMhz { get; set; }
        public double FrequencyRatio => MaxFreqMhz > 0 ? CurrentFreqMhz / MaxFreqMhz : 1.0;
        public string StatusColorHex => IsThermalThrottling || IsPowerLimitThrottling
            ? "#FF4466" : FrequencyRatio < 0.7 ? "#FFAA00" : "#00FF88";
        public string StatusText => IsThermalThrottling ? "Throttling Termico"
            : IsPowerLimitThrottling ? "Throttling de Energia"
            : IsFirmwareLimitThrottling ? "Limitacao de Firmware"
            : FrequencyRatio < 0.7 ? "Performance Reduzida"
            : "Normal";
    }

    public sealed class EnergyDiagnosticsService
    {
        private const string TAG = "[EnergyDiag]";
        private readonly ILoggingService _logger;

        public EnergyDiagnosticsService(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        public bool CheckPowerThrottlingEnabled()
        {
            _logger.LogInfo($"{TAG} [CheckPowerThrottlingEnabled] Verificando estado do Power Throttling...");
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(SystemConstants.RegistryPaths.PowerThrottling);
                var val = key?.GetValue("PowerThrottlingOff");
                var result = val == null || Convert.ToInt32(val) == 0;
                _logger.LogInfo($"{TAG} [CheckPowerThrottlingEnabled] PowerThrottlingOff={val ?? "ausente"} => throttling_ativo={result}");
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError($"{TAG} [CheckPowerThrottlingEnabled] Erro: {ex.Message}", ex);
                return false;
            }
        }

        public async Task DisablePowerThrottlingAsync()
        {
            _logger.LogInfo($"{TAG} [DisablePowerThrottlingAsync] Iniciando desativação do Power Throttling...");
            await Task.Run(() =>
            {
                try
                {
                    using var key = Registry.LocalMachine.OpenSubKey(SystemConstants.RegistryPaths.PowerThrottling, true);
                    if (key != null)
                    {
                        key.SetValue("PowerThrottlingOff", 1, RegistryValueKind.DWord);
                        _logger.LogSuccess($"{TAG} [DisablePowerThrottlingAsync] PowerThrottlingOff=1 gravado na chave existente.");
                    }
                    else
                    {
                        using var newKey = Registry.LocalMachine.CreateSubKey(SystemConstants.RegistryPaths.PowerThrottling, true);
                        newKey?.SetValue("PowerThrottlingOff", 1, RegistryValueKind.DWord);
                        _logger.LogSuccess($"{TAG} [DisablePowerThrottlingAsync] Chave criada e PowerThrottlingOff=1 gravado.");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"{TAG} [DisablePowerThrottlingAsync] Erro: {ex.Message}", ex);
                    throw;
                }
            });
            _logger.LogInfo($"{TAG} [DisablePowerThrottlingAsync] Concluído.");
        }

        public async Task<List<DiagnosticIssue>> RunDiagnosticsAsync()
        {
            _logger.LogInfo($"{TAG} ══════════════════════════════════════════");
            _logger.LogInfo($"{TAG} INICIANDO DIAGNÓSTICO COMPLETO DE ENERGIA");
            _logger.LogInfo($"{TAG} ══════════════════════════════════════════");
            var issues = new List<DiagnosticIssue>();
            await Task.Run(async () =>
            {
                // 1. Plano ativo
                var activeGuid = new SmartEnergyService(_logger).GetActivePlanGuidSync();
                _logger.LogInfo($"{TAG} [Diagnóstico] Plano ativo: {activeGuid}");
                if (activeGuid == SystemConstants.PowerPlans.PowerSaver)
                {
                    _logger.LogWarning($"{TAG} [Diagnóstico] ⚠ Plano PowerSaver detectado — performance severamente limitada.");
                    issues.Add(new DiagnosticIssue { Title = "Plano de Economia Ativo", Description = "O plano Economia de Energia limita severamente a performance da CPU e GPU.", Fix = "Ativar plano de Alto Desempenho ou Balanceado", Severity = DiagnosticSeverity.Critical });
                }

                // 2. Throttling térmico
                _logger.LogInfo($"{TAG} [Diagnóstico] Verificando throttling e frequência da CPU...");
                var throttle = await GetThrottlingStatusAsync();
                _logger.LogInfo($"{TAG} [Diagnóstico] CPU: {throttle.CurrentFreqMhz:F0}MHz / {throttle.MaxFreqMhz:F0}MHz ({throttle.FrequencyRatio:P0}) | Térmico={throttle.IsThermalThrottling} | Bateria={throttle.IsOnBattery} | PowerLimit={throttle.IsPowerLimitThrottling}");
                if (throttle.IsThermalThrottling)
                {
                    _logger.LogWarning($"{TAG} [Diagnóstico] ⛔ Throttling térmico ativo — CPU abaixo de 70% da frequência máxima.");
                    issues.Add(new DiagnosticIssue { Title = "Throttling Termico Detectado", Description = "CPU operando abaixo da frequencia maxima por temperatura elevada.", Fix = "Limpar cooler, melhorar ventilacao ou reduzir carga", Severity = DiagnosticSeverity.Critical });
                }
                if (throttle.IsOnBattery)
                {
                    _logger.LogInfo($"{TAG} [Diagnóstico] ⚠ Dispositivo operando na bateria.");
                    issues.Add(new DiagnosticIssue { Title = "Operando na Bateria", Description = "Performance pode estar reduzida. Conecte o carregador para maxima performance.", Fix = "Conectar fonte de alimentacao", Severity = DiagnosticSeverity.Warning });
                }

                // 3. Power Throttling
                _logger.LogInfo($"{TAG} [Diagnóstico] Verificando Power Throttling...");
                var ptEnabled = CheckPowerThrottlingEnabled();
                _logger.LogInfo($"{TAG} [Diagnóstico] PowerThrottling ativo={ptEnabled}");
                if (ptEnabled)
                    issues.Add(new DiagnosticIssue { Title = "Power Throttling Ativo", Description = "Windows esta limitando energia de processos em background automaticamente.", Fix = "Desabilitar Power Throttling para maxima performance", Severity = DiagnosticSeverity.Warning });

                // 4. Frequência reduzida sem throttling térmico
                if (throttle.FrequencyRatio < 0.6 && !throttle.IsThermalThrottling)
                {
                    _logger.LogWarning($"{TAG} [Diagnóstico] ⚠ CPU abaixo de 60% sem causa térmica — possível limitação de plano de energia.");
                    issues.Add(new DiagnosticIssue { Title = "Frequencia de CPU Reduzida", Description = "CPU operando abaixo de 60% da frequencia maxima.", Fix = "Verificar configuracoes de CPU no plano de energia", Severity = DiagnosticSeverity.Warning });
                }

                // 5. Turbo Boost
                _logger.LogInfo($"{TAG} [Diagnóstico] Verificando Turbo Boost...");
                var turbo = IsTurboBoostEnabled();
                _logger.LogInfo($"{TAG} [Diagnóstico] TurboBoost habilitado={turbo}");
                if (!turbo)
                    issues.Add(new DiagnosticIssue { Title = "Turbo Boost Desabilitado", Description = "O Turbo Boost da CPU esta desativado, limitando performance de pico.", Fix = "Habilitar Turbo Boost no plano de energia", Severity = DiagnosticSeverity.Warning });

                // 6. Compatibilidade de firmware/hardware
                _logger.LogInfo($"{TAG} [Diagnóstico] Executando detecção de compatibilidade de firmware...");
                var compatIssues = DetectFirmwareCompatibilityIssues();
                _logger.LogInfo($"{TAG} [Diagnóstico] Problemas de compatibilidade encontrados: {compatIssues.Count}");
                issues.AddRange(compatIssues);

                // Resumo final
                var criticals = issues.Count(i => i.Severity == DiagnosticSeverity.Critical);
                var warnings  = issues.Count(i => i.Severity == DiagnosticSeverity.Warning);
                _logger.LogInfo($"{TAG} ══════════════════════════════════════════");
                _logger.LogInfo($"{TAG} DIAGNÓSTICO CONCLUÍDO — Críticos={criticals} | Avisos={warnings} | Total={issues.Count}");
                _logger.LogInfo($"{TAG} ══════════════════════════════════════════");

                if (issues.Count == 0)
                {
                    _logger.LogSuccess($"{TAG} ✓ Nenhum problema detectado. Sistema saudável.");
                    issues.Add(new DiagnosticIssue { Title = "Sistema Saudavel", Description = "Nenhum problema de energia detectado. Sistema operando normalmente.", Fix = string.Empty, Severity = DiagnosticSeverity.Ok });
                }
            });
            return issues;
        }

        /// <summary>
        /// Detecta conflitos entre otimizações aplicadas pelo Voltris e limitações de firmware/hardware.
        /// Identifica configurações que persistem após fechar o programa e podem causar travamentos.
        /// </summary>
        public List<DiagnosticIssue> DetectFirmwareCompatibilityIssues()
        {
            _logger.LogInfo($"{TAG} [FirmwareCompat] Iniciando detecção de compatibilidade de firmware/hardware...");
            var issues = new List<DiagnosticIssue>();
            try
            {
                // 1. EnergyEstimationEnabled e ExitLatency
                _logger.LogInfo($"{TAG} [FirmwareCompat] Verificando HKLM\\...\\Control\\Power (EnergyEstimationEnabled, ExitLatency)...");
                using (var key = Registry.LocalMachine.OpenSubKey(SystemConstants.RegistryPaths.PowerControl))
                {
                    if (key != null)
                    {
                        var energyEst = key.GetValue("EnergyEstimationEnabled");
                        _logger.LogInfo($"{TAG} [FirmwareCompat] EnergyEstimationEnabled={energyEst ?? "ausente"}");
                        if (energyEst != null && Convert.ToInt32(energyEst) == 0)
                        {
                            _logger.LogWarning($"{TAG} [FirmwareCompat] ⛔ EnergyEstimationEnabled=0 — C-states do firmware desativados. CAUSA PROVÁVEL DE TRAVAMENTOS.");
                            issues.Add(new DiagnosticIssue
                            {
                                Title = "Gerenciamento de Energia do Firmware Desativado",
                                Description = "EnergyEstimationEnabled=0 foi detectado no registro. Isso desativa o controle de estados de baixo consumo (C-states) do firmware, podendo causar travamentos severos em notebooks com firmware restritivo.",
                                Fix = "Restaurar: HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power → EnergyEstimationEnabled = 1",
                                Severity = DiagnosticSeverity.Critical
                            });
                        }

                        var exitLatency = key.GetValue("ExitLatency");
                        _logger.LogInfo($"{TAG} [FirmwareCompat] ExitLatency={exitLatency ?? "ausente"}");
                        if (exitLatency != null && Convert.ToInt32(exitLatency) == 1)
                        {
                            _logger.LogWarning($"{TAG} [FirmwareCompat] ⛔ ExitLatency=1 — saída forçada de estados de baixo consumo. Instabilidade em notebooks.");
                            issues.Add(new DiagnosticIssue
                            {
                                Title = "Latencia de Saida de Energia Forcada",
                                Description = "ExitLatency=1 foi detectado. Força saída imediata dos estados de baixo consumo, impedindo o processador de descansar adequadamente. Em notebooks com firmware limitado, isso causa instabilidade.",
                                Fix = "Restaurar: HKLM\\SYSTEM\\CurrentControlSet\\Control\\Power → ExitLatency = deletar ou restaurar valor padrão",
                                Severity = DiagnosticSeverity.Critical
                            });
                        }
                    }
                    else
                    {
                        _logger.LogInfo($"{TAG} [FirmwareCompat] Chave Control\\Power não encontrada — valores ausentes (normal).");
                    }
                }

                // 2. MinProcessorState
                _logger.LogInfo($"{TAG} [FirmwareCompat] Consultando MinProcessorState via powercfg...");
                var minProcOutput = SmartEnergyService.RunPowercfg("/query SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 893dee8e-2bef-41e0-89c6-b55d0929964c");
                _logger.LogInfo($"{TAG} [FirmwareCompat] powercfg MinProc output: {minProcOutput?.Replace("\n", " ").Replace("\r", "")}");
                if (!string.IsNullOrEmpty(minProcOutput))
                {
                    var lines = minProcOutput.Split('\n');
                    foreach (var line in lines)
                    {
                        if (line.Contains("Configuração de Energia CA Atual") || line.Contains("Current AC Power Setting Index"))
                        {
                            var hex = System.Text.RegularExpressions.Regex.Match(line, @"0x([0-9a-fA-F]+)");
                            if (hex.Success && int.TryParse(hex.Groups[1].Value, System.Globalization.NumberStyles.HexNumber, null, out int minProc))
                            {
                                _logger.LogInfo($"{TAG} [FirmwareCompat] MinProcessorState AC={minProc}%");
                                if (minProc >= 80)
                                {
                                    _logger.LogWarning($"{TAG} [FirmwareCompat] ⛔ MinProcessorState={minProc}% — CPU forçada em frequência máxima. CAUSA PROVÁVEL DE TRAVAMENTOS EM NOTEBOOKS.");
                                    issues.Add(new DiagnosticIssue
                                    {
                                        Title = $"Estado Minimo do Processador Elevado ({minProc}%)",
                                        Description = $"MinProcessorState={minProc}% detectado no plano ativo. Isso impede o processador de reduzir frequência, causando acúmulo de calor e ativação da proteção térmica do firmware em notebooks.",
                                        Fix = "Reduzir MinProcessorState para 5-10% no plano de energia ativo",
                                        Severity = DiagnosticSeverity.Critical
                                    });
                                }
                            }
                            break;
                        }
                    }
                }

                // 3. Planos Voltris
                _logger.LogInfo($"{TAG} [FirmwareCompat] Verificando planos de energia Voltris residuais...");
                var planList = SmartEnergyService.RunPowercfg("/list");
                var activePlanOutput = SmartEnergyService.RunPowercfg("/getactivescheme");
                _logger.LogInfo($"{TAG} [FirmwareCompat] Plano ativo: {activePlanOutput?.Trim()}");
                bool voltrisPlanActive = !string.IsNullOrEmpty(activePlanOutput) &&
                                         activePlanOutput.Contains("Voltris", StringComparison.OrdinalIgnoreCase);
                bool voltrisPlansExist = !string.IsNullOrEmpty(planList) &&
                                          planList.Contains("Voltris", StringComparison.OrdinalIgnoreCase);
                _logger.LogInfo($"{TAG} [FirmwareCompat] VoltrisPlanActive={voltrisPlanActive} | VoltrisPlansExist={voltrisPlansExist}");

                if (voltrisPlanActive)
                {
                    _logger.LogWarning($"{TAG} [FirmwareCompat] ⚠ Plano Voltris está ATIVO no sistema.");
                    issues.Add(new DiagnosticIssue
                    {
                        Title = "Plano de Energia Voltris Ativo",
                        Description = "Um plano de energia customizado do Voltris está ativo no sistema. Esses planos aplicam configurações agressivas de CPU que podem ser incompatíveis com o firmware do seu hardware.",
                        Fix = "Ativar o plano Balanceado nativo do Windows via Configurações → Energia",
                        Severity = DiagnosticSeverity.Warning
                    });
                }
                else if (voltrisPlansExist)
                {
                    _logger.LogInfo($"{TAG} [FirmwareCompat] Planos Voltris existem mas não estão ativos.");
                    issues.Add(new DiagnosticIssue
                    {
                        Title = "Planos de Energia Voltris Residuais",
                        Description = "Planos de energia com prefixo 'Voltris' foram encontrados no sistema mas não estão ativos. Podem ser removidos com segurança.",
                        Fix = "Executar powercfg /delete para cada plano Voltris listado",
                        Severity = DiagnosticSeverity.Warning
                    });
                }

                // 4. PCIe LSPM
                _logger.LogInfo($"{TAG} [FirmwareCompat] Verificando PCIe Link State Power Management...");
                var pcieOutput = SmartEnergyService.RunPowercfg("/query SCHEME_CURRENT 501a4d13-42af-4429-9fd1-a8218c268e20 ee12f906-d277-404b-b6da-e5fa1a576df5");
                _logger.LogInfo($"{TAG} [FirmwareCompat] powercfg PCIe output: {pcieOutput?.Replace("\n", " ").Replace("\r", "")}");
                if (!string.IsNullOrEmpty(pcieOutput))
                {
                    var lines = pcieOutput.Split('\n');
                    foreach (var line in lines)
                    {
                        if (line.Contains("Configuração de Energia CA Atual") || line.Contains("Current AC Power Setting Index"))
                        {
                            var hex = System.Text.RegularExpressions.Regex.Match(line, @"0x([0-9a-fA-F]+)");
                            _logger.LogInfo($"{TAG} [FirmwareCompat] PCIe LSPM AC value={hex.Groups[1].Value}");
                            if (hex.Success && hex.Groups[1].Value == "00000000")
                            {
                                _logger.LogWarning($"{TAG} [FirmwareCompat] ⚠ PCIe LSPM desabilitado — pode causar instabilidade em notebooks com firmware restritivo.");
                                issues.Add(new DiagnosticIssue
                                {
                                    Title = "PCIe Link State Power Management Desabilitado",
                                    Description = "O gerenciamento de energia do barramento PCIe está desativado. Em notebooks com firmware restritivo, isso pode causar instabilidade ao impedir que dispositivos PCIe entrem em estados de baixo consumo.",
                                    Fix = "Reabilitar PCIe LSPM: Painel de Controle → Opções de Energia → Configurações avançadas → PCI Express",
                                    Severity = DiagnosticSeverity.Warning
                                });
                            }
                            break;
                        }
                    }
                }

                // 5. Perfil agressivo em notebook
                _logger.LogInfo($"{TAG} [FirmwareCompat] Verificando perfil inteligente em notebook...");
                var isLaptop = false;
                try
                {
                    var sysInfo = App.Services?.GetService(typeof(ISystemInfoService)) as ISystemInfoService;
                    isLaptop = sysInfo?.IsLaptop() ?? false;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"{TAG} [FirmwareCompat] Não foi possível detectar tipo de dispositivo: {ex.Message}");
                }

                var currentProfile = SettingsService.Instance.Settings.IntelligentProfile;
                _logger.LogInfo($"{TAG} [FirmwareCompat] IsLaptop={isLaptop} | IntelligentProfile={currentProfile}");

                if (isLaptop)
                {
                    bool isAggressiveProfile = currentProfile == IntelligentProfileType.GamerCompetitive ||
                                               currentProfile == IntelligentProfileType.GamerSinglePlayer;
                    if (isAggressiveProfile)
                    {
                        _logger.LogWarning($"{TAG} [FirmwareCompat] ⛔ Perfil agressivo '{currentProfile}' em notebook — MinProc=80-100%, risco de travamento por proteção térmica do firmware.");
                        issues.Add(new DiagnosticIssue
                        {
                            Title = $"Perfil Agressivo em Notebook ({currentProfile})",
                            Description = $"O perfil '{currentProfile}' aplica MinProcessorState=80-100% e desabilita gerenciamento de energia. Em notebooks, especialmente modelos finos com firmware restritivo, isso ativa a proteção térmica do firmware e causa travamentos.",
                            Fix = "Alterar para perfil 'Balanceado' ou 'Escritório' nas Configurações → Perfil Inteligente",
                            Severity = DiagnosticSeverity.Critical
                        });
                    }
                }

                _logger.LogInfo($"{TAG} [FirmwareCompat] Detecção concluída — {issues.Count} problema(s) encontrado(s).");
            }
            catch (Exception ex)
            {
                _logger.LogError($"{TAG} [FirmwareCompat] Erro inesperado na detecção: {ex.Message}", ex);
            }
            return issues;
        }

        public async Task<ThrottlingStatus> GetThrottlingStatusAsync()
        {
            _logger.LogInfo($"{TAG} [GetThrottlingStatus] Coletando frequência e estado da CPU via WMI...");
            return await Task.Run(() =>
            {
                var status = new ThrottlingStatus();
                try
                {
                    using var searcher = new ManagementObjectSearcher("SELECT CurrentClockSpeed, MaxClockSpeed FROM Win32_Processor");
                    foreach (ManagementObject obj in searcher.Get())
                    {
                        status.CurrentFreqMhz = Convert.ToDouble(obj["CurrentClockSpeed"]);
                        status.MaxFreqMhz = Convert.ToDouble(obj["MaxClockSpeed"]);
                        break;
                    }
                    _logger.LogInfo($"{TAG} [GetThrottlingStatus] CPU: {status.CurrentFreqMhz:F0}MHz atual / {status.MaxFreqMhz:F0}MHz máx | Ratio={status.FrequencyRatio:P0}");

                    status.IsThermalThrottling = status.MaxFreqMhz > 0 && status.CurrentFreqMhz < status.MaxFreqMhz * 0.70;
                    if (status.IsThermalThrottling)
                        _logger.LogWarning($"{TAG} [GetThrottlingStatus] ⛔ Throttling térmico detectado (CPU < 70% do máximo).");

                    using var batSearcher = new ManagementObjectSearcher("SELECT BatteryStatus FROM Win32_Battery");
                    foreach (ManagementObject obj in batSearcher.Get())
                    {
                        status.IsOnBattery = Convert.ToInt32(obj["BatteryStatus"]) == 1;
                        break;
                    }
                    _logger.LogInfo($"{TAG} [GetThrottlingStatus] IsOnBattery={status.IsOnBattery}");

                    status.IsPowerLimitThrottling = CheckPowerLimitThrottling();
                    _logger.LogInfo($"{TAG} [GetThrottlingStatus] IsPowerLimitThrottling={status.IsPowerLimitThrottling}");
                }
                catch (Exception ex)
                {
                    _logger.LogError($"{TAG} [GetThrottlingStatus] Erro ao coletar dados: {ex.Message}", ex);
                }
                return status;
            });
        }

        public async Task FixAllIssuesAsync()
        {
            _logger.LogInfo($"{TAG} [FixAllIssues] Iniciando correção automática de problemas...");
            await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo($"{TAG} [FixAllIssues] Ativando plano High Performance...");
                    SmartEnergyService.RunPowercfg("/setactive " + SystemConstants.PowerPlans.HighPerformance);

                    _logger.LogInfo($"{TAG} [FixAllIssues] Desativando Power Throttling no registro...");
                    using var key = Registry.LocalMachine.OpenSubKey(SystemConstants.RegistryPaths.PowerThrottling, true);
                    key?.SetValue("PowerThrottlingOff", 1, RegistryValueKind.DWord);

                    _logger.LogInfo($"{TAG} [FixAllIssues] Ajustando MaxProcessorState=100%...");
                    SmartEnergyService.RunPowercfg("/setacvalueindex SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 bc5038f7-23e0-4960-96da-33abaf5935ec 100");
                    SmartEnergyService.RunPowercfg("/setactive SCHEME_CURRENT");

                    _logger.LogSuccess($"{TAG} [FixAllIssues] ✓ Correções automáticas aplicadas com sucesso.");
                }
                catch (Exception ex)
                {
                    _logger.LogError($"{TAG} [FixAllIssues] Erro: {ex.Message}", ex);
                }
            });
        }

        public async Task RestoreDefaultsAsync()
        {
            _logger.LogInfo($"{TAG} [RestoreDefaults] Restaurando planos de energia padrão do Windows...");
            await Task.Run(() =>
            {
                try
                {
                    SmartEnergyService.RunPowercfg("/setactive " + SystemConstants.PowerPlans.Balanced);
                    _logger.LogInfo($"{TAG} [RestoreDefaults] Plano Balanceado ativado.");
                    SmartEnergyService.RunPowercfg("/restoredefaultschemes");
                    _logger.LogSuccess($"{TAG} [RestoreDefaults] ✓ Planos padrão restaurados.");
                }
                catch (Exception ex)
                {
                    _logger.LogError($"{TAG} [RestoreDefaults] Erro: {ex.Message}", ex);
                }
            });
        }

        private bool IsTurboBoostEnabled()
        {
            try
            {
                var output = SmartEnergyService.RunPowercfg("/query SCHEME_CURRENT 54533251-82be-4824-96c1-47b60b740d00 be337238-0d82-4146-a960-4f3749d470c7");
                var enabled = !output.Contains("0x00000000");
                _logger.LogInfo($"{TAG} [IsTurboBoostEnabled] TurboBoost={enabled}");
                return enabled;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"{TAG} [IsTurboBoostEnabled] Erro ao verificar: {ex.Message}");
                return true;
            }
        }

        private bool CheckPowerLimitThrottling()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00");
                var exists = key != null;
                _logger.LogInfo($"{TAG} [CheckPowerLimitThrottling] PowerLimitKey exists={exists}");
                return exists;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"{TAG} [CheckPowerLimitThrottling] Erro: {ex.Message}");
                return false;
            }
        }
    }
}