using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Management;
using System.Runtime.InteropServices;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32;
using VoltrisOptimizer.Core.Constants;

namespace VoltrisOptimizer.Services.Power
{
    // ─────────────────────────────────────────────────────────────────────────
    // Models
    // ─────────────────────────────────────────────────────────────────────────

    public enum EnergyProfile { Gaming, Work, Economy, UltraPerformance, Balanced, Custom }
    public enum DeviceType { Desktop, Laptop, Unknown }

    public class PowerPlanInfo
    {
        public string Guid { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public bool IsVoltris { get; set; }
        public bool IsBuiltIn { get; set; }
    }

    public class EnergyRecommendation : System.ComponentModel.INotifyPropertyChanged
    {
        public EnergyProfile Profile { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Icon { get; set; } = string.Empty;
        public int EnergyScore { get; set; }
        public string AccentColor { get; set; } = "#31A8FF";

        // Estado visual de selecionado/ativado no card
        private bool _isSelected;
        public bool IsSelected
        {
            get => _isSelected;
            set
            {
                if (_isSelected != value)
                {
                    _isSelected = value;
                    Debug.WriteLine($"[EnergyRecommendation] IsSelected={value} para Profile={Profile} Title={Title}");
                    PropertyChanged?.Invoke(this, new System.ComponentModel.PropertyChangedEventArgs(nameof(IsSelected)));
                }
            }
        }

        public event System.ComponentModel.PropertyChangedEventHandler? PropertyChanged;
    }

    public class EnergyScore
    {
        public int Overall { get; set; }
        public int Performance { get; set; }
        public int Efficiency { get; set; }
        public int Thermal { get; set; }
        public string Grade => Overall switch { >= 90 => "S", >= 75 => "A", >= 60 => "B", >= 45 => "C", _ => "D" };
        public string GradeColor => Grade switch { "S" => "#FFD700", "A" => "#00FF88", "B" => "#31A8FF", "C" => "#FFAA00", _ => "#FF4466" };
    }

    public class PowerPlanSettings
    {
        public int CpuMinPercent { get; set; } = 5;
        public int CpuMaxPercent { get; set; } = 100;
        public int CpuBoostMode { get; set; } = 2;
        public int DiskTimeoutAc { get; set; } = 0;
        public int DiskTimeoutDc { get; set; } = 20;
        public bool UsbSelectiveSuspend { get; set; } = true;
        public int PcieLinkState { get; set; } = 0;
        public int DisplayTimeoutAc { get; set; } = 15;
        public int DisplayTimeoutDc { get; set; } = 5;
        public int WirelessMode { get; set; } = 0;
    }

    // ─────────────────────────────────────────────────────────────────────────
    // Smart Energy Service
    // ─────────────────────────────────────────────────────────────────────────

    public sealed class SmartEnergyService : IDisposable
    {
        private const string TAG = "[SmartEnergy]";
        private const string VOLTRIS_PREFIX = "Voltris Energy - ";

        private readonly ILoggingService _logger;
        private bool _disposed;

        [DllImport("kernel32.dll")]
        private static extern IntPtr CreateFile(string lpFileName, uint dwDesiredAccess,
            uint dwShareMode, IntPtr lpSecurityAttributes, uint dwCreationDisposition,
            uint dwFlagsAndAttributes, IntPtr hTemplateFile);

        [DllImport("powrprof.dll", SetLastError = true)]
        private static extern uint PowerGetActiveScheme(IntPtr UserRootPowerKey, out IntPtr ActivePolicyGuid);

        [DllImport("powrprof.dll")]
        private static extern uint PowerFreeMemory(IntPtr Memory);

        public event EventHandler<string>? ActivePlanChanged;

        public SmartEnergyService(ILoggingService logger)
        {
            Debug.WriteLine($"{TAG}[CTOR] Iniciando SmartEnergyService");
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            Debug.WriteLine($"{TAG}[CTOR] SmartEnergyService criado com sucesso");
        }

        // ── Hardware Detection ────────────────────────────────────────────────

        public async Task<DeviceType> DetectDeviceTypeAsync()
        {
            Debug.WriteLine($"{TAG}[DetectDeviceTypeAsync] INÍCIO");
            return await Task.Run(() =>
            {
                Debug.WriteLine($"{TAG}[DetectDeviceTypeAsync] Consultando Win32_Battery via WMI...");
                try
                {
                    using var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_Battery");
                    var batteries = searcher.Get();
                    var count = batteries.Count;
                    Debug.WriteLine($"{TAG}[DetectDeviceTypeAsync] Baterias encontradas: {count}");
                    var result = count > 0 ? DeviceType.Laptop : DeviceType.Desktop;
                    Debug.WriteLine($"{TAG}[DetectDeviceTypeAsync] Resultado: {result}");
                    return result;
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"{TAG}[DetectDeviceTypeAsync] EXCEÇÃO: {ex.GetType().Name} => {ex.Message}");
                    Debug.WriteLine($"{TAG}[DetectDeviceTypeAsync] StackTrace: {ex.StackTrace}");
                    return DeviceType.Unknown;
                }
            });
        }

        public async Task<string> GetCpuNameAsync()
        {
            Debug.WriteLine($"{TAG}[GetCpuNameAsync] INÍCIO");
            return await Task.Run(() =>
            {
                Debug.WriteLine($"{TAG}[GetCpuNameAsync] Consultando Win32_Processor via WMI...");
                try
                {
                    using var searcher = new ManagementObjectSearcher("SELECT Name FROM Win32_Processor");
                    foreach (ManagementObject obj in searcher.Get())
                    {
                        var name = obj["Name"]?.ToString()?.Trim() ?? "Unknown CPU";
                        Debug.WriteLine($"{TAG}[GetCpuNameAsync] CPU encontrada: {name}");
                        return name;
                    }
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"{TAG}[GetCpuNameAsync] EXCEÇÃO: {ex.GetType().Name} => {ex.Message}");
                    Debug.WriteLine($"{TAG}[GetCpuNameAsync] StackTrace: {ex.StackTrace}");
                }
                Debug.WriteLine($"{TAG}[GetCpuNameAsync] Nenhuma CPU encontrada, retornando 'Unknown CPU'");
                return "Unknown CPU";
            });
        }

        // ── Plan Management ───────────────────────────────────────────────────

        public async Task<List<PowerPlanInfo>> GetAllPlansAsync()
        {
            Debug.WriteLine($"{TAG}[GetAllPlansAsync] INÍCIO");
            return await Task.Run(() =>
            {
                var plans = new List<PowerPlanInfo>();
                try
                {
                    Debug.WriteLine($"{TAG}[GetAllPlansAsync] Executando powercfg /list...");
                    var output = RunPowercfg("/list");
                    Debug.WriteLine($"{TAG}[GetAllPlansAsync] Output powercfg /list:\n{output}");

                    Debug.WriteLine($"{TAG}[GetAllPlansAsync] Obtendo GUID do plano ativo...");
                    var activeGuid = GetActivePlanGuidSync();
                    Debug.WriteLine($"{TAG}[GetAllPlansAsync] GUID ativo: {activeGuid}");

                    var lines = output.Split('\n');
                    Debug.WriteLine($"{TAG}[GetAllPlansAsync] Linhas para parsear: {lines.Length}");

                    foreach (var line in lines)
                    {
                        var match = Regex.Match(line,
                            @"([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})\s+\((.+?)\)");
                        if (!match.Success)
                        {
                            Debug.WriteLine($"{TAG}[GetAllPlansAsync] Linha sem match: '{line.Trim()}'");
                            continue;
                        }

                        var guid = match.Groups[1].Value.ToLowerInvariant();
                        var name = match.Groups[2].Value.Trim().TrimEnd('*').Trim();
                        var isActive = string.Equals(guid, activeGuid, StringComparison.OrdinalIgnoreCase);
                        var isVoltris = name.StartsWith(VOLTRIS_PREFIX, StringComparison.OrdinalIgnoreCase);
                        var isBuiltIn = IsBuiltInPlan(guid);

                        Debug.WriteLine($"{TAG}[GetAllPlansAsync] Plano parseado: Name='{name}' Guid={guid} IsActive={isActive} IsVoltris={isVoltris} IsBuiltIn={isBuiltIn}");

                        plans.Add(new PowerPlanInfo
                        {
                            Guid = guid,
                            Name = name,
                            IsActive = isActive,
                            IsVoltris = isVoltris,
                            IsBuiltIn = isBuiltIn
                        });
                    }
                    Debug.WriteLine($"{TAG}[GetAllPlansAsync] Total de planos encontrados: {plans.Count}");
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"{TAG}[GetAllPlansAsync] EXCEÇÃO: {ex.GetType().Name} => {ex.Message}");
                    Debug.WriteLine($"{TAG}[GetAllPlansAsync] StackTrace: {ex.StackTrace}");
                    _logger.LogError($"{TAG} Erro ao listar planos: {ex.Message}", ex);
                }
                Debug.WriteLine($"{TAG}[GetAllPlansAsync] FIM => {plans.Count} planos");
                return plans;
            });
        }

        public async Task<bool> SetActivePlanAsync(string guid)
        {
            Debug.WriteLine($"{TAG}[SetActivePlanAsync] INÍCIO => guid={guid}");
            return await Task.Run(() =>
            {
                try
                {
                    Debug.WriteLine($"{TAG}[SetActivePlanAsync] Executando powercfg /setactive {guid}...");
                    var result = RunPowercfg($"/setactive {guid}");
                    Debug.WriteLine($"{TAG}[SetActivePlanAsync] Output: '{result}'");
                    _logger.LogInfo($"{TAG} Plano ativado: {guid}");
                    Debug.WriteLine($"{TAG}[SetActivePlanAsync] Disparando evento ActivePlanChanged");
                    ActivePlanChanged?.Invoke(this, guid);
                    Debug.WriteLine($"{TAG}[SetActivePlanAsync] FIM => true");
                    return true;
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"{TAG}[SetActivePlanAsync] EXCEÇÃO: {ex.GetType().Name} => {ex.Message}");
                    Debug.WriteLine($"{TAG}[SetActivePlanAsync] StackTrace: {ex.StackTrace}");
                    _logger.LogError($"{TAG} Erro ao ativar plano: {ex.Message}", ex);
                    return false;
                }
            });
        }

        public async Task<string?> ClonePlanAsync(string sourceGuid, string newName)
        {
            Debug.WriteLine($"{TAG}[ClonePlanAsync] INÍCIO => sourceGuid={sourceGuid} newName='{newName}'");
            return await Task.Run(() =>
            {
                try
                {
                    Debug.WriteLine($"{TAG}[ClonePlanAsync] Executando powercfg /duplicatescheme {sourceGuid}...");
                    var output = RunPowercfg($"/duplicatescheme {sourceGuid}");
                    Debug.WriteLine($"{TAG}[ClonePlanAsync] Output duplicatescheme: '{output}'");

                    var match = Regex.Match(output,
                        @"([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})");
                    if (!match.Success)
                    {
                        Debug.WriteLine($"{TAG}[ClonePlanAsync] GUID não encontrado no output, retornando null");
                        return null;
                    }

                    var newGuid = match.Value.ToLowerInvariant();
                    Debug.WriteLine($"{TAG}[ClonePlanAsync] Novo GUID: {newGuid}");
                    Debug.WriteLine($"{TAG}[ClonePlanAsync] Renomeando plano para '{newName}'...");
                    RunPowercfg($"/changename {newGuid} \"{newName}\" \"Plano personalizado Voltris\"");
                    _logger.LogSuccess($"{TAG} Plano clonado: {newName} ({newGuid})");
                    Debug.WriteLine($"{TAG}[ClonePlanAsync] FIM => {newGuid}");
                    return newGuid;
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"{TAG}[ClonePlanAsync] EXCEÇÃO: {ex.GetType().Name} => {ex.Message}");
                    Debug.WriteLine($"{TAG}[ClonePlanAsync] StackTrace: {ex.StackTrace}");
                    _logger.LogError($"{TAG} Erro ao clonar plano: {ex.Message}", ex);
                    return null;
                }
            });
        }

        public async Task<bool> DeletePlanAsync(string guid)
        {
            Debug.WriteLine($"{TAG}[DeletePlanAsync] INÍCIO => guid={guid}");
            if (IsBuiltInPlan(guid))
            {
                Debug.WriteLine($"{TAG}[DeletePlanAsync] Plano é built-in, não pode ser removido. Retornando false");
                return false;
            }
            return await Task.Run(() =>
            {
                try
                {
                    Debug.WriteLine($"{TAG}[DeletePlanAsync] Executando powercfg /delete {guid}...");
                    RunPowercfg($"/delete {guid}");
                    _logger.LogInfo($"{TAG} Plano removido: {guid}");
                    Debug.WriteLine($"{TAG}[DeletePlanAsync] FIM => true");
                    return true;
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"{TAG}[DeletePlanAsync] EXCEÇÃO: {ex.GetType().Name} => {ex.Message}");
                    Debug.WriteLine($"{TAG}[DeletePlanAsync] StackTrace: {ex.StackTrace}");
                    _logger.LogError($"{TAG} Erro ao remover plano: {ex.Message}", ex);
                    return false;
                }
            });
        }

        public async Task<bool> RenamePlanAsync(string guid, string newName)
        {
            Debug.WriteLine($"{TAG}[RenamePlanAsync] INÍCIO => guid={guid} newName='{newName}'");
            return await Task.Run(() =>
            {
                try
                {
                    Debug.WriteLine($"{TAG}[RenamePlanAsync] Executando powercfg /changename...");
                    RunPowercfg($"/changename {guid} \"{newName}\"");
                    Debug.WriteLine($"{TAG}[RenamePlanAsync] FIM => true");
                    return true;
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"{TAG}[RenamePlanAsync] EXCEÇÃO: {ex.GetType().Name} => {ex.Message}");
                    Debug.WriteLine($"{TAG}[RenamePlanAsync] StackTrace: {ex.StackTrace}");
                    _logger.LogError($"{TAG} Erro ao renomear plano: {ex.Message}", ex);
                    return false;
                }
            });
        }

        public async Task<bool> ExportPlanAsync(string guid, string filePath)
        {
            Debug.WriteLine($"{TAG}[ExportPlanAsync] INÍCIO => guid={guid} filePath='{filePath}'");
            return await Task.Run(() =>
            {
                try
                {
                    Debug.WriteLine($"{TAG}[ExportPlanAsync] Executando powercfg /export...");
                    RunPowercfg($"/export \"{filePath}\" {guid}");
                    Debug.WriteLine($"{TAG}[ExportPlanAsync] FIM => true");
                    return true;
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"{TAG}[ExportPlanAsync] EXCEÇÃO: {ex.GetType().Name} => {ex.Message}");
                    Debug.WriteLine($"{TAG}[ExportPlanAsync] StackTrace: {ex.StackTrace}");
                    _logger.LogError($"{TAG} Erro ao exportar plano: {ex.Message}", ex);
                    return false;
                }
            });
        }

        public async Task<string?> ImportPlanAsync(string filePath)
        {
            Debug.WriteLine($"{TAG}[ImportPlanAsync] INÍCIO => filePath='{filePath}'");
            return await Task.Run(() =>
            {
                try
                {
                    Debug.WriteLine($"{TAG}[ImportPlanAsync] Executando powercfg /import...");
                    var output = RunPowercfg($"/import \"{filePath}\"");
                    Debug.WriteLine($"{TAG}[ImportPlanAsync] Output: '{output}'");
                    var match = Regex.Match(output,
                        @"([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})");
                    if (match.Success)
                    {
                        Debug.WriteLine($"{TAG}[ImportPlanAsync] GUID importado: {match.Value}");
                        return match.Value.ToLowerInvariant();
                    }
                    Debug.WriteLine($"{TAG}[ImportPlanAsync] GUID não encontrado no output");
                    return null;
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"{TAG}[ImportPlanAsync] EXCEÇÃO: {ex.GetType().Name} => {ex.Message}");
                    Debug.WriteLine($"{TAG}[ImportPlanAsync] StackTrace: {ex.StackTrace}");
                    _logger.LogError($"{TAG} Erro ao importar plano: {ex.Message}", ex);
                    return null;
                }
            });
        }

        // ── Smart Recommendations ─────────────────────────────────────────────

        public async Task<List<EnergyRecommendation>> GetRecommendationsAsync()
        {
            Debug.WriteLine($"{TAG}[GetRecommendationsAsync] INÍCIO");
            var deviceType = await DetectDeviceTypeAsync();
            var cpuName = await GetCpuNameAsync();
            var isLaptop = deviceType == DeviceType.Laptop;
            Debug.WriteLine($"{TAG}[GetRecommendationsAsync] deviceType={deviceType} isLaptop={isLaptop} cpuName='{cpuName}'");

            var recs = new List<EnergyRecommendation>
            {
                new()
                {
                    Profile = EnergyProfile.Gaming,
                    Title = "Modo Gamer",
                    Description = isLaptop
                        ? "Máxima performance com proteção térmica para notebooks"
                        : "CPU e GPU sem limitações — latência mínima para jogos",
                    Icon = "🎮",
                    EnergyScore = isLaptop ? 72 : 95,
                    AccentColor = "#FF4B6B"
                },
                new()
                {
                    Profile = EnergyProfile.Work,
                    Title = "Modo Trabalho",
                    Description = "Balanceado entre performance e consumo — ideal para produtividade",
                    Icon = "💼",
                    EnergyScore = 78,
                    AccentColor = "#31A8FF"
                },
                new()
                {
                    Profile = EnergyProfile.Economy,
                    Title = "Modo Economia",
                    Description = isLaptop
                        ? "Maximiza autonomia da bateria com performance adequada"
                        : "Reduz consumo elétrico mantendo responsividade",
                    Icon = "🔋",
                    EnergyScore = isLaptop ? 95 : 60,
                    AccentColor = "#00FF88"
                },
                new()
                {
                    Profile = EnergyProfile.UltraPerformance,
                    Title = "Ultra Performance",
                    Description = "Desempenho máximo absoluto — sem nenhuma limitação de energia",
                    Icon = "⚡",
                    EnergyScore = 100,
                    AccentColor = "#FFD700"
                }
            };
            Debug.WriteLine($"{TAG}[GetRecommendationsAsync] FIM => {recs.Count} recomendações geradas");
            return recs;
        }

        // ── One-Click Apply ───────────────────────────────────────────────────

        public async Task<bool> ApplyProfileAsync(EnergyProfile profile)
        {
            Debug.WriteLine($"{TAG}[ApplyProfileAsync] INÍCIO => profile={profile}");
            _logger.LogInfo($"{TAG} Aplicando perfil: {profile}");

            Debug.WriteLine($"{TAG}[ApplyProfileAsync] Determinando GUID alvo para perfil {profile}...");
            var targetGuid = profile switch
            {
                EnergyProfile.Gaming          => SystemConstants.PowerPlans.HighPerformance,
                EnergyProfile.Work            => SystemConstants.PowerPlans.Balanced,
                EnergyProfile.Economy         => SystemConstants.PowerPlans.PowerSaver,
                EnergyProfile.UltraPerformance => await EnsureUltimatePerformanceAsync(),
                EnergyProfile.Balanced        => SystemConstants.PowerPlans.Balanced,
                _                             => SystemConstants.PowerPlans.Balanced
            };
            Debug.WriteLine($"{TAG}[ApplyProfileAsync] GUID alvo: {targetGuid}");

            Debug.WriteLine($"{TAG}[ApplyProfileAsync] Chamando SetActivePlanAsync...");
            var success = await SetActivePlanAsync(targetGuid);
            Debug.WriteLine($"{TAG}[ApplyProfileAsync] SetActivePlanAsync retornou: {success}");

            if (success && profile == EnergyProfile.Gaming)
            {
                Debug.WriteLine($"{TAG}[ApplyProfileAsync] Perfil Gaming — aplicando tweaks de gaming...");
                await ApplyGamingTweaksAsync();
                Debug.WriteLine($"{TAG}[ApplyProfileAsync] Gaming tweaks aplicados");
            }
            else if (success && profile == EnergyProfile.UltraPerformance)
            {
                Debug.WriteLine($"{TAG}[ApplyProfileAsync] Perfil UltraPerformance — aplicando tweaks ultra...");
                await ApplyUltraPerformanceTweaksAsync();
                Debug.WriteLine($"{TAG}[ApplyProfileAsync] Ultra tweaks aplicados");
            }
            else
            {
                Debug.WriteLine($"{TAG}[ApplyProfileAsync] Nenhum tweak adicional para perfil {profile}");
            }

            Debug.WriteLine($"{TAG}[ApplyProfileAsync] FIM => {success}");
            return success;
        }

        // ── Energy Score ──────────────────────────────────────────────────────

        public async Task<EnergyScore> CalculateEnergyScoreAsync()
        {
            Debug.WriteLine($"{TAG}[CalculateEnergyScoreAsync] INÍCIO");
            return await Task.Run(async () =>
            {
                Debug.WriteLine($"{TAG}[CalculateEnergyScoreAsync] Obtendo GUID ativo...");
                var activeGuid = GetActivePlanGuidSync();
                Debug.WriteLine($"{TAG}[CalculateEnergyScoreAsync] GUID ativo: {activeGuid}");

                Debug.WriteLine($"{TAG}[CalculateEnergyScoreAsync] Obtendo frequência atual e máxima da CPU...");
                var cpuFreq = await GetCurrentCpuFrequencyMhzAsync();
                var maxFreq = await GetMaxCpuFrequencyMhzAsync();
                Debug.WriteLine($"{TAG}[CalculateEnergyScoreAsync] CpuFreq={cpuFreq} MHz MaxFreq={maxFreq} MHz");

                int perfScore = activeGuid switch
                {
                    var g when g == SystemConstants.PowerPlans.UltimatePerformance => 100,
                    var g when g == SystemConstants.PowerPlans.HighPerformance      => 90,
                    var g when g == SystemConstants.PowerPlans.Balanced             => 65,
                    var g when g == SystemConstants.PowerPlans.PowerSaver           => 35,
                    _                                                               => 70
                };
                Debug.WriteLine($"{TAG}[CalculateEnergyScoreAsync] perfScore={perfScore}");

                int effScore = activeGuid switch
                {
                    var g when g == SystemConstants.PowerPlans.PowerSaver           => 95,
                    var g when g == SystemConstants.PowerPlans.Balanced             => 75,
                    var g when g == SystemConstants.PowerPlans.HighPerformance      => 50,
                    var g when g == SystemConstants.PowerPlans.UltimatePerformance  => 30,
                    _                                                               => 65
                };
                Debug.WriteLine($"{TAG}[CalculateEnergyScoreAsync] effScore={effScore}");

                int thermalScore = maxFreq > 0 ? (int)((double)cpuFreq / maxFreq * 100) : 70;
                thermalScore = Math.Clamp(thermalScore, 0, 100);
                Debug.WriteLine($"{TAG}[CalculateEnergyScoreAsync] thermalScore={thermalScore}");

                var score = new EnergyScore
                {
                    Performance = perfScore,
                    Efficiency  = effScore,
                    Thermal     = thermalScore,
                    Overall     = (perfScore + effScore + thermalScore) / 3
                };
                Debug.WriteLine($"{TAG}[CalculateEnergyScoreAsync] FIM => Overall={score.Overall} Grade={score.Grade}");
                return score;
            });
        }

        // ── Helpers ───────────────────────────────────────────────────────────

        public string GetActivePlanGuidSync()
        {
            Debug.WriteLine($"{TAG}[GetActivePlanGuidSync] INÍCIO");
            try
            {
                Debug.WriteLine($"{TAG}[GetActivePlanGuidSync] Executando powercfg /getactivescheme...");
                var output = RunPowercfg("/getactivescheme");
                Debug.WriteLine($"{TAG}[GetActivePlanGuidSync] Output: '{output.Trim()}'");
                var match = Regex.Match(output,
                    @"([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})");
                if (match.Success)
                {
                    Debug.WriteLine($"{TAG}[GetActivePlanGuidSync] GUID encontrado: {match.Value}");
                    return match.Value.ToLowerInvariant();
                }
                Debug.WriteLine($"{TAG}[GetActivePlanGuidSync] GUID não encontrado no output");
                return string.Empty;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"{TAG}[GetActivePlanGuidSync] EXCEÇÃO: {ex.GetType().Name} => {ex.Message}");
                return string.Empty;
            }
        }

        public async Task<int> GetCurrentCpuFrequencyMhzAsync()
        {
            Debug.WriteLine($"{TAG}[GetCurrentCpuFrequencyMhzAsync] INÍCIO");
            return await Task.Run(() =>
            {
                try
                {
                    Debug.WriteLine($"{TAG}[GetCurrentCpuFrequencyMhzAsync] Consultando Win32_Processor CurrentClockSpeed...");
                    using var searcher = new ManagementObjectSearcher("SELECT CurrentClockSpeed FROM Win32_Processor");
                    foreach (ManagementObject obj in searcher.Get())
                    {
                        var freq = Convert.ToInt32(obj["CurrentClockSpeed"]);
                        Debug.WriteLine($"{TAG}[GetCurrentCpuFrequencyMhzAsync] CurrentClockSpeed={freq} MHz");
                        return freq;
                    }
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"{TAG}[GetCurrentCpuFrequencyMhzAsync] EXCEÇÃO: {ex.GetType().Name} => {ex.Message}");
                }
                Debug.WriteLine($"{TAG}[GetCurrentCpuFrequencyMhzAsync] Retornando 0 (fallback)");
                return 0;
            });
        }

        public async Task<int> GetMaxCpuFrequencyMhzAsync()
        {
            Debug.WriteLine($"{TAG}[GetMaxCpuFrequencyMhzAsync] INÍCIO");
            return await Task.Run(() =>
            {
                try
                {
                    Debug.WriteLine($"{TAG}[GetMaxCpuFrequencyMhzAsync] Consultando Win32_Processor MaxClockSpeed...");
                    using var searcher = new ManagementObjectSearcher("SELECT MaxClockSpeed FROM Win32_Processor");
                    foreach (ManagementObject obj in searcher.Get())
                    {
                        var freq = Convert.ToInt32(obj["MaxClockSpeed"]);
                        Debug.WriteLine($"{TAG}[GetMaxCpuFrequencyMhzAsync] MaxClockSpeed={freq} MHz");
                        return freq;
                    }
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"{TAG}[GetMaxCpuFrequencyMhzAsync] EXCEÇÃO: {ex.GetType().Name} => {ex.Message}");
                }
                Debug.WriteLine($"{TAG}[GetMaxCpuFrequencyMhzAsync] Retornando 0 (fallback)");
                return 0;
            });
        }

        private async Task<string> EnsureUltimatePerformanceAsync()
        {
            Debug.WriteLine($"{TAG}[EnsureUltimatePerformanceAsync] INÍCIO");
            return await Task.Run(() =>
            {
                Debug.WriteLine($"{TAG}[EnsureUltimatePerformanceAsync] Verificando se Ultimate Performance já existe...");
                var output = RunPowercfg("/list");
                if (output.Contains(SystemConstants.PowerPlans.UltimatePerformance, StringComparison.OrdinalIgnoreCase))
                {
                    Debug.WriteLine($"{TAG}[EnsureUltimatePerformanceAsync] Ultimate Performance já existe, retornando GUID");
                    return SystemConstants.PowerPlans.UltimatePerformance;
                }
                Debug.WriteLine($"{TAG}[EnsureUltimatePerformanceAsync] Não encontrado — provisionando via duplicatescheme...");
                RunPowercfg($"/duplicatescheme {SystemConstants.PowerPlans.UltimatePerformance}");
                Debug.WriteLine($"{TAG}[EnsureUltimatePerformanceAsync] FIM => {SystemConstants.PowerPlans.UltimatePerformance}");
                return SystemConstants.PowerPlans.UltimatePerformance;
            });
        }

        private async Task ApplyGamingTweaksAsync()
        {
            Debug.WriteLine($"{TAG}[ApplyGamingTweaksAsync] INÍCIO");
            await Task.Run(() =>
            {
                try
                {
                    Debug.WriteLine($"{TAG}[ApplyGamingTweaksAsync] Desabilitando USB selective suspend...");
                    RunPowercfg("/setacvalueindex SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0");
                    Debug.WriteLine($"{TAG}[ApplyGamingTweaksAsync] USB selective suspend desabilitado");

                    Debug.WriteLine($"{TAG}[ApplyGamingTweaksAsync] Desabilitando PCIe Link State Power Management...");
                    RunPowercfg("/setacvalueindex SCHEME_CURRENT 501a4d13-42af-4429-9fd1-a8218c268e20 ee12f906-d277-404b-b6da-e5fa1a576df5 0");
                    Debug.WriteLine($"{TAG}[ApplyGamingTweaksAsync] PCIe LSPM desabilitado");

                    Debug.WriteLine($"{TAG}[ApplyGamingTweaksAsync] Aplicando SCHEME_CURRENT...");
                    RunPowercfg("/setactive SCHEME_CURRENT");
                    Debug.WriteLine($"{TAG}[ApplyGamingTweaksAsync] FIM");
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"{TAG}[ApplyGamingTweaksAsync] EXCEÇÃO (parcial): {ex.GetType().Name} => {ex.Message}");
                    _logger.LogWarning($"{TAG} Gaming tweaks parciais: {ex.Message}");
                }
            });
        }

        private async Task ApplyUltraPerformanceTweaksAsync()
        {
            Debug.WriteLine($"{TAG}[ApplyUltraPerformanceTweaksAsync] INÍCIO");
            await Task.Run(() =>
            {
                try
                {
                    Debug.WriteLine($"{TAG}[ApplyUltraPerformanceTweaksAsync] Abrindo chave de registro PowerControl...");
                    using var key = Registry.LocalMachine.OpenSubKey(SystemConstants.RegistryPaths.PowerControl, true);
                    if (key != null)
                    {
                        Debug.WriteLine($"{TAG}[ApplyUltraPerformanceTweaksAsync] Chave aberta, definindo EnergyEstimationEnabled=0 e ExitLatency=1");
                        key.SetValue("EnergyEstimationEnabled", 0, RegistryValueKind.DWord);
                        key.SetValue("ExitLatency", 1, RegistryValueKind.DWord);
                        Debug.WriteLine($"{TAG}[ApplyUltraPerformanceTweaksAsync] Valores de registro definidos");
                    }
                    else
                    {
                        Debug.WriteLine($"{TAG}[ApplyUltraPerformanceTweaksAsync] Chave de registro não encontrada (null)");
                    }
                    Debug.WriteLine($"{TAG}[ApplyUltraPerformanceTweaksAsync] FIM");
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"{TAG}[ApplyUltraPerformanceTweaksAsync] EXCEÇÃO: {ex.GetType().Name} => {ex.Message}");
                    _logger.LogWarning($"{TAG} Ultra tweaks parciais: {ex.Message}");
                }
            });
        }

        private static bool IsBuiltInPlan(string guid)
        {
            var result =
                guid.Equals(SystemConstants.PowerPlans.Balanced, StringComparison.OrdinalIgnoreCase) ||
                guid.Equals(SystemConstants.PowerPlans.HighPerformance, StringComparison.OrdinalIgnoreCase) ||
                guid.Equals(SystemConstants.PowerPlans.PowerSaver, StringComparison.OrdinalIgnoreCase) ||
                guid.Equals(SystemConstants.PowerPlans.UltimatePerformance, StringComparison.OrdinalIgnoreCase);
            Debug.WriteLine($"[SmartEnergy][IsBuiltInPlan] guid={guid} => {result}");
            return result;
        }

        internal static string RunPowercfg(string args)
        {
            Debug.WriteLine($"[SmartEnergy][RunPowercfg] INÍCIO => args='{args}'");
            try
            {
                using var p = Process.Start(new ProcessStartInfo
                {
                    FileName = "powercfg.exe",
                    Arguments = args,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true
                });
                if (p == null)
                {
                    Debug.WriteLine($"[SmartEnergy][RunPowercfg] Process.Start retornou null para args='{args}'");
                    return string.Empty;
                }
                var output = p.StandardOutput.ReadToEnd();
                var error  = p.StandardError.ReadToEnd();
                p.WaitForExit(10_000);
                Debug.WriteLine($"[SmartEnergy][RunPowercfg] ExitCode={p.ExitCode} OutputLen={output.Length} ErrorLen={error.Length}");
                if (!string.IsNullOrWhiteSpace(error))
                    Debug.WriteLine($"[SmartEnergy][RunPowercfg] STDERR: {error.Trim()}");
                Debug.WriteLine($"[SmartEnergy][RunPowercfg] FIM => output='{output.Trim()}'");
                return output;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"[SmartEnergy][RunPowercfg] EXCEÇÃO: {ex.GetType().Name} => {ex.Message}");
                return string.Empty;
            }
        }

        public void Dispose()
        {
            Debug.WriteLine($"{TAG}[Dispose] Dispose chamado, _disposed={_disposed}");
            _disposed = true;
            Debug.WriteLine($"{TAG}[Dispose] FIM");
        }
    }
}
