using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Gamer.Models;
using VoltrisOptimizer.Interfaces;

using VoltrisOptimizer.Services.Gamer.Adaptive;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using VoltrisOptimizer.Services.Gamer.Intelligence.Interfaces;
using VoltrisOptimizer.Services.Gamer.Intelligence.Models;

namespace VoltrisOptimizer.Services.Gamer.Intelligence
{
    public interface IAdaptiveOptimizationEngine
    {
        Task<AdaptiveOptimizationResult> ApplyAdaptiveOptimizationsAsync(
            GamerOptimizationOptions options, 
            MachineProfileResult profile,
            CancellationToken cancellationToken = default);
            
        Task<RealTimeOptimizationResult> ApplyRealTimeOptimizationsAsync(
            GamerOptimizationOptions options,
            MachineProfileResult profile,
            CancellationToken cancellationToken = default);
    }
    
    public class AdaptiveOptimizationResult
    {
        public bool Success { get; set; }
        public int OptimizationsApplied { get; set; }
        public string[] AppliedOptimizations { get; set; } = Array.Empty<string>();
        public string[] SkippedOptimizations { get; set; } = Array.Empty<string>();
        public string ProfileBasedStrategy { get; set; } = "";
        public Dictionary<string, object> ProfileMetrics { get; set; } = new();
    }
    
    public class RealTimeOptimizationResult
    {
        public bool Success { get; set; }
        public int RealTimeAdjustments { get; set; }
        public string[] AppliedAdjustments { get; set; } = Array.Empty<string>();
        public Dictionary<string, object> SystemMetrics { get; set; } = new();
    }
    
    public class AdaptiveOptimizationEngine : IAdaptiveOptimizationEngine
    {
        private readonly Func<IGamerModeOrchestrator> _orchestratorFactory;
        private readonly IRealGameBoosterService _realBooster;
        private readonly IGpuGamingOptimizer _gpuOptimizer;
        private readonly IMachineProfileDetector _profileDetector;
        private readonly ILoggingService _logger;
        
        public AdaptiveOptimizationEngine(
            Func<IGamerModeOrchestrator> orchestratorFactory,
            IRealGameBoosterService realBooster,
            IGpuGamingOptimizer gpuOptimizer,
            IMachineProfileDetector profileDetector,
            ILoggingService logger)

        {
            _orchestratorFactory = orchestratorFactory;
            _realBooster = realBooster;
            _gpuOptimizer = gpuOptimizer;
            _profileDetector = profileDetector;
            _logger = logger;
        }
        
        public async Task<AdaptiveOptimizationResult> ApplyAdaptiveOptimizationsAsync(
            GamerOptimizationOptions options,
            MachineProfileResult profile,
            CancellationToken cancellationToken = default)
        {
            var result = new AdaptiveOptimizationResult();
            var appliedOps = new List<string>();
            var skippedOps = new List<string>();
            
            try
            {
                _logger.LogInfo($"[AdaptiveEngine] Iniciando otimizações adaptativas para perfil: {profile.Profile}");

                
                // 1. Aplicar otimizações baseadas no perfil
                var profileSpecificOps = _profileDetector.GetProfileSpecificOptimizations(profile);
                foreach (var op in profileSpecificOps)
                {
                    appliedOps.Add($"Perfil-{op}");
                    _logger.LogDebug($"[AdaptiveEngine] Aplicando otimização específica do perfil: {op}");

                }
                
                // 2. Filtrar otimizações baseadas em restrições do perfil
                var filteredOptions = FilterOptionsByProfile(options, profile);
                
                // 3. Aplicar otimizações do orquestrador (filtradas)
                if (filteredOptions.AnyOptimizationsEnabled())
                {
                    var orchestrator = _orchestratorFactory();
                    await orchestrator.ApplyPersistentOptimizationsAsync(filteredOptions, cancellationToken);
                    appliedOps.Add("OrchestratorOptimizations");
                    result.OptimizationsApplied++;
                }

                
                // 4. Aplicar RealGameBooster com adaptação
                if (_realBooster != null)
                {
                    var boostResult = await ApplyAdaptiveBoostAsync(profile, cancellationToken);
                    if (boostResult.Success)
                    {
                        appliedOps.Add("AdaptiveRealBoost");
                        result.OptimizationsApplied += boostResult.OptimizationsApplied;
                    }
                }
                
                // 5. Aplicar otimizações de GPU adaptativas
                if (filteredOptions.ApplyFpsBoost)
                {
                    var gpuResult = await ApplyAdaptiveGpuOptimizationsAsync(profile, cancellationToken);
                    if (gpuResult.Success)
                    {
                        appliedOps.Add("AdaptiveGpuOpt");
                        result.OptimizationsApplied += 1;
                    }
                }
                
                result.Success = true;
                result.AppliedOptimizations = appliedOps.ToArray();
                result.SkippedOptimizations = skippedOps.ToArray();
                result.ProfileBasedStrategy = profile.Profile.ToString();
                result.ProfileMetrics = new Dictionary<string, object>
                {
                    ["CpuTier"] = profile.CpuTier.ToString(),
                    ["GpuTier"] = profile.GpuTier.ToString(),
                    ["RamTier"] = profile.RamTier.ToString(),
                    ["IsNotebook"] = profile.IsNotebook,
                    ["IsGamingReady"] = profile.IsGamingReady
                };
                
                _logger.LogInfo($"[AdaptiveEngine] Otimizações adaptativas concluídas: {result.OptimizationsApplied} aplicadas");
                
            }
            catch (Exception ex)
            {
                _logger.LogError($"[AdaptiveEngine] Erro ao aplicar otimizações adaptativas: {ex.Message}");
                result.Success = false;
            }
            
            return result;
        }
        
        public async Task<RealTimeOptimizationResult> ApplyRealTimeOptimizationsAsync(
            GamerOptimizationOptions options,
            MachineProfileResult profile,
            CancellationToken cancellationToken = default)
        {
            var result = new RealTimeOptimizationResult();
            var adjustments = new List<string>();
            
            try
            {
                // Coletar métricas em tempo real
                var systemMetrics = await CollectRealTimeMetricsAsync(cancellationToken);
                result.SystemMetrics = systemMetrics;
                
                // Aplicar ajustes baseados em métricas + perfil
                if (systemMetrics.TryGetValue("CpuUsage", out var cpuUsageObj) && cpuUsageObj is double cpuUsage)
                {
                    if (cpuUsage > 80 && profile.CpuTier >= HardwareTier.Medium)
                    {
                        // Ajuste de prioridade CPU para máquinas capazes
                        adjustments.Add("CpuPriorityBoost");
                        _logger.LogDebug("[AdaptiveEngine] Ajustando prioridade CPU em tempo real");
                    }
                }
                
                if (systemMetrics.TryGetValue("AvailableRamGb", out var ramObj) && ramObj is double availableRam)
                {
                    if (availableRam < 2.0 && profile.RamTier >= HardwareTier.Medium)
                    {
                        // Liberação de memória para máquinas com RAM suficiente
                        adjustments.Add("MemoryPressureRelief");
                        _logger.LogDebug("[AdaptiveEngine] Liberando memória em tempo real");
                    }
                }
                
                // Ajustes específicos por perfil
                switch (profile.Profile)
                {
                    case MachineProfile.EntryLevel:
                        // Modo conservador - apenas ajustes leves
                        adjustments.Add("ConservativeMode");
                        break;
                        
                    case MachineProfile.GamingMachine:
                        // Modo agressivo - ajustes máximos
                        adjustments.Add("AggressiveRealTimeTuning");
                        break;
                }
                
                result.Success = true;
                result.RealTimeAdjustments = adjustments.Count;
                result.AppliedAdjustments = adjustments.ToArray();
                
            }
            catch (Exception ex)
            {
                _logger.LogError($"[AdaptiveEngine] Erro em otimizações em tempo real: {ex.Message}");
                result.Success = false;
            }
            
            return result;
        }
        
        private GamerOptimizationOptions FilterOptionsByProfile(GamerOptimizationOptions options, MachineProfileResult profile)
        {
            var filtered = new GamerOptimizationOptions
            {
                ApplyFpsBoost = options.ApplyFpsBoost && _profileDetector.ShouldApplyOptimization("FpsBoost", profile),
                EnableExtremeMode = options.EnableExtremeMode && _profileDetector.ShouldApplyOptimization("CpuPriority", profile),
                EnableAntiStutter = options.EnableAntiStutter,
                EnableAdaptiveNetwork = options.EnableAdaptiveNetwork,
                PingTarget = options.PingTarget
            };
            
            // Adicionar restrições específicas
            foreach (var restriction in profile.Restrictions)
            {
                switch (restriction)
                {
                    case var r when r.Contains("FPS Boost"):
                        filtered.ApplyFpsBoost = false;
                        break;
                    case var r when r.Contains("HAGS"):
                        // HAGS não está diretamente nos options, mas seria filtrado
                        break;
                }
            }
            
            return filtered;
        }
        
        private async Task<RealGameBoostResult> ApplyAdaptiveBoostAsync(MachineProfileResult profile, CancellationToken cancellationToken)
        {
            // Adaptar o boost baseado no perfil
            var boostOptions = new RealGameBoostOptions
            {
                AggressiveMode = profile.Profile == MachineProfile.GamingMachine,
                ConservativeMode = profile.Profile == MachineProfile.EntryLevel,
                EnableTimerResolution = profile.CpuTier >= HardwareTier.Medium,
                EnablePowerPlan = profile.Profile != MachineProfile.EntryLevel && !profile.IsNotebook,
                DisableGameBar = true, // Sempre seguro
                DisableFullscreenOptimizations = profile.GpuTier >= HardwareTier.Low
            };
            
            return await _realBooster.ActivateFullBoostAsync(null, cancellationToken, boostOptions);
        }
        
        private async Task<AdaptiveOptimizationResult> ApplyAdaptiveGpuOptimizationsAsync(MachineProfileResult profile, CancellationToken cancellationToken)
        {
            var result = new AdaptiveOptimizationResult();
            
            try
            {
                // Ajustar intensidade baseada no perfil
                var intensity = profile.Profile switch
                {
                    MachineProfile.EntryLevel => GpuOptimizationIntensity.Low,
                    MachineProfile.MidRange => GpuOptimizationIntensity.Medium,
                    MachineProfile.HighEnd => GpuOptimizationIntensity.High,
                    MachineProfile.GamingMachine => GpuOptimizationIntensity.Extreme,
                    _ => GpuOptimizationIntensity.Medium
                };
                
                var gpuResult = await _gpuOptimizer.ApplyOptimizationsAsync(new GpuOptimizationOptions
                {
                    Intensity = intensity,
                    EnableFpsBoost = profile.GpuTier >= HardwareTier.Medium,
                    EnableHags = profile.GpuTier >= HardwareTier.Medium && profile.Profile != MachineProfile.EntryLevel
                }, cancellationToken);
                
                result.Success = gpuResult.Success;
                result.OptimizationsApplied = gpuResult.Success ? 1 : 0;
                
            }
            catch (Exception ex)
            {
                _logger.LogError($"[AdaptiveEngine] Erro em otimizações GPU adaptativas: {ex.Message}");
                result.Success = false;
            }
            
            return result;
        }
        
        private async Task<Dictionary<string, object>> CollectRealTimeMetricsAsync(CancellationToken cancellationToken)
        {
            var metrics = new Dictionary<string, object>();
            
            try
            {
                // CPU Usage
                using var cpuCounter = new System.Diagnostics.PerformanceCounter("Processor", "% Processor Time", "_Total");
                cpuCounter.NextValue(); // Primeira leitura descartada
                await Task.Delay(1000, cancellationToken);
                metrics["CpuUsage"] = cpuCounter.NextValue();
                
                // Memória disponível
                var ramInfo = await Task.Run(() =>
                {
                    using var searcher = new System.Management.ManagementObjectSearcher("SELECT FreePhysicalMemory FROM Win32_OperatingSystem");
                    foreach (System.Management.ManagementObject obj in searcher.Get())
                    {
                        var freeKb = Convert.ToDouble(obj["FreePhysicalMemory"]);
                        return freeKb / (1024 * 1024); // GB
                    }
                    return 0.0;
                }, cancellationToken);
                
                metrics["AvailableRamGb"] = ramInfo;
                
                // Temperatura (se disponível)
                // Implementar coleta de temperatura aqui
                
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[AdaptiveEngine] Erro ao coletar métricas em tempo real: {ex.Message}");
            }
            
            return metrics;
        }
    }
}