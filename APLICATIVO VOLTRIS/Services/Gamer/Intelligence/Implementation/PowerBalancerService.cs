using System;
using System.Diagnostics;
using System.Linq;
using System.Management;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services.Gamer.Intelligence.Interfaces;
using VoltrisOptimizer.Services.Gamer.Intelligence.Models;

namespace VoltrisOptimizer.Services.Gamer.Intelligence.Implementation
{
    /// <summary>
    /// Balanceador de energia inteligente - otimiza entre performance e bateria
    /// </summary>
    public class PowerBalancerService : IPowerBalancer, IDisposable
    {
        private readonly ILoggingService _logger;
        private PowerProfile _currentPower = new();
        private CancellationTokenSource? _monitoringCts;
        private Task? _monitoringTask;
        private readonly object _lock = new();

        // GUIDs dos power plans
        private const string BalancedPlanGuid = "381b4222-f694-41f0-9685-ff5bb260df2e";
        private const string HighPerformanceGuid = "8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c";
        private const string PowerSaverGuid = "a1841308-3541-4fab-bc81-f71556f20b4a";
        private const string UltimatePerformanceGuid = "e9a42b02-d5df-448d-aa00-03f14749eb61";

        private string? _originalPowerPlan;

        public PowerProfile CurrentPower => _currentPower;
        public event EventHandler<PowerProfile>? PowerStatusChanged;

        public PowerBalancerService(ILoggingService logger)
        {
            _logger = logger;
            UpdatePowerProfile();
        }

        private void UpdatePowerProfile()
        {
            try
            {
                var power = new PowerProfile();

                // Detecta laptop
                using var enclosureSearcher = new ManagementObjectSearcher("SELECT * FROM Win32_SystemEnclosure");
                foreach (ManagementObject obj in enclosureSearcher.Get())
                {
                    var types = (ushort[]?)obj["ChassisTypes"];
                    if (types != null)
                        power.IsLaptop = types.Any(t => t == 8 || t == 9 || t == 10 || t == 14);
                }

                // Status da bateria
                if (power.IsLaptop)
                {
                    power.IsOnBattery = SystemInformation.PowerStatus.PowerLineStatus != PowerLineStatus.Online;
                    power.BatteryPercent = (int)(SystemInformation.PowerStatus.BatteryLifePercent * 100);
                }

                // Power plan atual
                var activePlan = GetActivePowerPlan();
                power.CurrentPowerPlan = activePlan.name;
                power.SupportsUltimatePerformance = CheckUltimatePerformanceAvailable();

                lock (_lock)
                {
                    var previousBattery = _currentPower.IsOnBattery;
                    _currentPower = power;

                    // Notifica mudança de status de bateria
                    if (power.IsLaptop && previousBattery != power.IsOnBattery)
                    {
                        _logger.LogInfo($"[PowerBalancer] Status de energia: {(power.IsOnBattery ? "Bateria" : "Tomada")}");
                        PowerStatusChanged?.Invoke(this, power);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[PowerBalancer] Erro ao atualizar perfil: {ex.Message}");
            }
        }

        private (string guid, string name) GetActivePowerPlan()
        {
            try
            {
                var psi = new ProcessStartInfo
                {
                    FileName = "powercfg",
                    Arguments = "/getactivescheme",
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using var process = Process.Start(psi);
                var output = process?.StandardOutput.ReadToEnd() ?? "";
                
                // Formato: "Power Scheme GUID: xxxx-xxxx  (Name)"
                var guidStart = output.IndexOf(':') + 2;
                var guidEnd = output.IndexOf(' ', guidStart);
                var guid = output.Substring(guidStart, guidEnd - guidStart).Trim();

                var nameStart = output.IndexOf('(') + 1;
                var nameEnd = output.IndexOf(')');
                var name = nameStart > 0 && nameEnd > nameStart 
                    ? output.Substring(nameStart, nameEnd - nameStart) 
                    : "Unknown";

                return (guid, name);
            }
            catch
            {
                return ("", "Unknown");
            }
        }

        private bool CheckUltimatePerformanceAvailable()
        {
            try
            {
                var psi = new ProcessStartInfo
                {
                    FileName = "powercfg",
                    Arguments = "/list",
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using var process = Process.Start(psi);
                var output = process?.StandardOutput.ReadToEnd() ?? "";
                return output.Contains(UltimatePerformanceGuid, StringComparison.OrdinalIgnoreCase);
            }
            catch
            {
                return false;
            }
        }

        public PowerMode GetOptimalPowerMode(bool isGaming)
        {
            var power = _currentPower;

            if (!power.IsLaptop)
            {
                // Desktop: sempre máxima performance para jogos
                return isGaming 
                    ? (power.SupportsUltimatePerformance ? PowerMode.UltimatePerformance : PowerMode.Performance)
                    : PowerMode.Balanced;
            }

            // Laptop
            if (power.IsOnBattery)
            {
                if (isGaming)
                {
                    // Gaming na bateria - balanceia
                    return power.BatteryPercent > 50 
                        ? PowerMode.GamingOnBattery 
                        : PowerMode.Balanced;
                }
                
                return power.BatteryPercent < 20 
                    ? PowerMode.BatterySaver 
                    : PowerMode.Balanced;
            }

            // Laptop na tomada
            return isGaming 
                ? (power.SupportsUltimatePerformance ? PowerMode.UltimatePerformance : PowerMode.Performance)
                : PowerMode.Performance;
        }

        public async Task<bool> ApplyPowerModeAsync(PowerMode mode, CancellationToken cancellationToken = default)
        {
            try
            {
                // Salva plano original
                if (_originalPowerPlan == null)
                {
                    var (guid, _) = GetActivePowerPlan();
                    _originalPowerPlan = guid;
                }

                string targetGuid = mode switch
                {
                    PowerMode.BatterySaver => PowerSaverGuid,
                    PowerMode.Balanced => BalancedPlanGuid,
                    PowerMode.Performance => HighPerformanceGuid,
                    PowerMode.UltimatePerformance => UltimatePerformanceGuid,
                    PowerMode.GamingOnBattery => HighPerformanceGuid, // Usa High mas com ajustes
                    PowerMode.GamingPluggedIn => _currentPower.SupportsUltimatePerformance 
                        ? UltimatePerformanceGuid : HighPerformanceGuid,
                    _ => BalancedPlanGuid
                };

                // Verifica se Ultimate Performance existe, senão cria
                if (mode == PowerMode.UltimatePerformance && !_currentPower.SupportsUltimatePerformance)
                {
                    await CreateUltimatePerformancePlanAsync(cancellationToken);
                }

                // Aplica o plano
                var psi = new ProcessStartInfo
                {
                    FileName = "powercfg",
                    Arguments = $"/setactive {targetGuid}",
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using var process = Process.Start(psi);
                if (process != null)
                    await process.WaitForExitAsync(cancellationToken);

                // Ajustes adicionais para gaming
                if (mode == PowerMode.GamingOnBattery || mode == PowerMode.GamingPluggedIn)
                {
                    await ApplyGamingPowerTweaksAsync(cancellationToken);
                }

                _logger.LogInfo($"[PowerBalancer] Modo de energia aplicado: {mode}");
                UpdatePowerProfile();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[PowerBalancer] Erro ao aplicar modo: {ex.Message}");
                return false;
            }
        }

        private async Task CreateUltimatePerformancePlanAsync(CancellationToken cancellationToken)
        {
            try
            {
                // Duplica High Performance como base para Ultimate
                var psi = new ProcessStartInfo
                {
                    FileName = "powercfg",
                    Arguments = $"/duplicatescheme {HighPerformanceGuid} {UltimatePerformanceGuid}",
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using var process = Process.Start(psi);
                if (process != null)
                    await process.WaitForExitAsync(cancellationToken);

                // Renomeia
                psi.Arguments = $"/changename {UltimatePerformanceGuid} \"Ultimate Performance\"";
                using var process2 = Process.Start(psi);
                if (process2 != null)
                    await process2.WaitForExitAsync(cancellationToken);

                _logger.LogInfo("[PowerBalancer] Ultimate Performance plan criado");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[PowerBalancer] Erro ao criar plan: {ex.Message}");
            }
        }

        private async Task ApplyGamingPowerTweaksAsync(CancellationToken cancellationToken)
        {
            try
            {
                var (guid, _) = GetActivePowerPlan();

                // Desabilita Core Parking
                await RunPowerCfgAsync($"/setacvalueindex {guid} 54533251-82be-4824-96c1-47b60b740d00 0cc5b647-c1df-4637-891a-dec35c318583 0", cancellationToken);

                // CPU min 100%
                await RunPowerCfgAsync($"/setacvalueindex {guid} 54533251-82be-4824-96c1-47b60b740d00 893dee8e-2bef-41e0-89c6-b55d0929964c 100", cancellationToken);

                // Desabilita USB selective suspend
                await RunPowerCfgAsync($"/setacvalueindex {guid} 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0", cancellationToken);

                // PCI Express - Off
                await RunPowerCfgAsync($"/setacvalueindex {guid} 501a4d13-42af-4429-9fd1-a8218c268e20 ee12f906-d277-404b-b6da-e5fa1a576df5 0", cancellationToken);

                _logger.LogInfo("[PowerBalancer] Tweaks de gaming aplicados");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[PowerBalancer] Erro nos tweaks: {ex.Message}");
            }
        }

        private async Task RunPowerCfgAsync(string arguments, CancellationToken cancellationToken)
        {
            var psi = new ProcessStartInfo
            {
                FileName = "powercfg",
                Arguments = arguments,
                UseShellExecute = false,
                CreateNoWindow = true
            };

            using var process = Process.Start(psi);
            if (process != null)
                await process.WaitForExitAsync(cancellationToken);
        }

        public OptimizationStrategy AdjustForBattery(OptimizationStrategy baseStrategy)
        {
            var power = _currentPower;

            // Se não é laptop ou está na tomada, não ajusta
            if (!power.IsLaptop || !power.IsOnBattery)
                return baseStrategy;

            var adjusted = new OptimizationStrategy
            {
                TargetClass = baseStrategy.TargetClass,
                GameId = baseStrategy.GameId
            };

            // Ajusta níveis baseado no nível de bateria
            double factor = power.BatteryPercent / 100.0;

            // Bateria < 30%: reduz bastante
            // Bateria 30-60%: reduz moderadamente
            // Bateria > 60%: reduz pouco
            if (power.BatteryPercent < 30)
            {
                adjusted.CpuOptimizationLevel = Math.Max(1, baseStrategy.CpuOptimizationLevel - 2);
                adjusted.GpuOptimizationLevel = Math.Max(1, baseStrategy.GpuOptimizationLevel - 2);
                adjusted.EnableTimerResolution = false;
                adjusted.EnableTdrTweaks = false;
            }
            else if (power.BatteryPercent < 60)
            {
                adjusted.CpuOptimizationLevel = Math.Max(1, baseStrategy.CpuOptimizationLevel - 1);
                adjusted.GpuOptimizationLevel = Math.Max(1, baseStrategy.GpuOptimizationLevel - 1);
                adjusted.EnableTimerResolution = false;
            }
            else
            {
                adjusted.CpuOptimizationLevel = baseStrategy.CpuOptimizationLevel;
                adjusted.GpuOptimizationLevel = Math.Max(2, baseStrategy.GpuOptimizationLevel - 1);
                adjusted.EnableTimerResolution = baseStrategy.EnableTimerResolution;
            }

            // Mantém otimizações que não afetam bateria
            adjusted.NetworkOptimizationLevel = baseStrategy.NetworkOptimizationLevel;
            adjusted.MemoryOptimizationLevel = baseStrategy.MemoryOptimizationLevel;
            adjusted.EnableQoS = baseStrategy.EnableQoS;
            adjusted.EnableAdaptiveGovernor = true; // Importante para bateria
            adjusted.EnableThermalMonitor = true; // Laptops aquecem mais na bateria

            _logger.LogInfo($"[PowerBalancer] Estratégia ajustada para bateria ({power.BatteryPercent}%): " +
                        $"CPU={adjusted.CpuOptimizationLevel}, GPU={adjusted.GpuOptimizationLevel}");

            return adjusted;
        }

        public async Task<bool> RestoreOriginalPowerPlanAsync(CancellationToken cancellationToken = default)
        {
            if (string.IsNullOrEmpty(_originalPowerPlan))
                return true;

            try
            {
                var psi = new ProcessStartInfo
                {
                    FileName = "powercfg",
                    Arguments = $"/setactive {_originalPowerPlan}",
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using var process = Process.Start(psi);
                if (process != null)
                    await process.WaitForExitAsync(cancellationToken);

                _logger.LogInfo("[PowerBalancer] Plano de energia original restaurado");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[PowerBalancer] Erro ao restaurar: {ex.Message}");
                return false;
            }
        }

        public void Dispose()
        {
            _monitoringCts?.Cancel();
            _monitoringCts?.Dispose();
            GC.SuppressFinalize(this);
        }

        #region System Power Status

        private static class SystemInformation
        {
            public static PowerStatus PowerStatus => new();
        }

        private class PowerStatus
        {
            public PowerLineStatus PowerLineStatus
            {
                get
                {
                    SYSTEM_POWER_STATUS status;
                    if (GetSystemPowerStatus(out status))
                        return status.ACLineStatus == 1 ? PowerLineStatus.Online : PowerLineStatus.Offline;
                    return PowerLineStatus.Unknown;
                }
            }

            public float BatteryLifePercent
            {
                get
                {
                    SYSTEM_POWER_STATUS status;
                    if (GetSystemPowerStatus(out status))
                        return status.BatteryLifePercent / 100f;
                    return 1f;
                }
            }
        }

        private enum PowerLineStatus
        {
            Offline = 0,
            Online = 1,
            Unknown = 255
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct SYSTEM_POWER_STATUS
        {
            public byte ACLineStatus;
            public byte BatteryFlag;
            public byte BatteryLifePercent;
            public byte SystemStatusFlag;
            public int BatteryLifeTime;
            public int BatteryFullLifeTime;
        }

        [DllImport("kernel32.dll")]
        private static extern bool GetSystemPowerStatus(out SYSTEM_POWER_STATUS lpSystemPowerStatus);

        #endregion
    }
}

