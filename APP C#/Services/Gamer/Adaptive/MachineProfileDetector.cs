using System;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Gamer.Models;
using VoltrisOptimizer.Interfaces;



namespace VoltrisOptimizer.Services.Gamer.Adaptive
{
    public enum MachineProfile
    {
        EntryLevel,      // Notebook fraco, PC básico
        MidRange,        // PC médio, notebook médio  
        HighEnd,         // PC forte
        GamingMachine    // PC/notebook gamer
    }
    
    public enum HardwareTier
    {
        Low,     // < 8GB RAM, CPU fraco, GPU integrada
        Medium,  // 8-16GB RAM, CPU médio, GPU dedicada média
        High     // > 16GB RAM, CPU forte, GPU dedicada alta
    }
    
    public class MachineProfileResult
    {
        public MachineProfile Profile { get; set; }
        public HardwareTier CpuTier { get; set; }
        public HardwareTier GpuTier { get; set; }
        public HardwareTier RamTier { get; set; }
        public bool IsNotebook { get; set; }
        public bool IsGamingReady { get; set; }
        public string[] Recommendations { get; set; } = Array.Empty<string>();
        public string[] Restrictions { get; set; } = Array.Empty<string>();
    }
    
    public interface IMachineProfileDetector
    {
        Task<MachineProfileResult> AnalyzeMachineProfileAsync();
        bool ShouldApplyOptimization(string optimizationName, MachineProfileResult profile);
        string[] GetProfileSpecificOptimizations(MachineProfileResult profile);
    }
    
    public class MachineProfileDetector : IMachineProfileDetector
    {
        private readonly ISystemInfoService _systemInfo;
        private readonly ILoggingService _logger;
        
        public MachineProfileDetector(ISystemInfoService systemInfo, ILoggingService logger)
        {
            _systemInfo = systemInfo;
            _logger = logger;
        }

        
        public async Task<MachineProfileResult> AnalyzeMachineProfileAsync()
        {
            _logger.LogInfo("[ProfileDetector] Iniciando análise detalhada de hardware para definição de perfil adaptativo...");
            try
            {
                var capabilities = await _systemInfo.GetHardwareCapabilitiesAsync();
                _logger.LogInfo($"[ProfileDetector] Capacidades brutas: CPU {capabilities.Cpu.CoreCount} Cores/{capabilities.Cpu.ThreadCount} Threads | GPU: {capabilities.Gpu.Name} ({capabilities.Gpu.Vendor}) | RAM: {capabilities.Ram.TotalGB:F1}GB");
                
                var cpuTier = ClassifyCpu(capabilities.Cpu.CoreCount, capabilities.Cpu.ThreadCount);
                _logger.LogInfo($"[ProfileDetector] Tier de CPU: {cpuTier}");

                var gpuVendor = MapVendor(capabilities.Gpu.Vendor);
                var gpuTier = ClassifyGpu(gpuVendor, capabilities.Gpu.Name);
                _logger.LogInfo($"[ProfileDetector] Tier de GPU: {gpuTier} (Vendor:{gpuVendor})");

                var ramTier = ClassifyRam(capabilities.Ram.TotalGB);
                _logger.LogInfo($"[ProfileDetector] Tier de RAM: {ramTier}");

                var isNotebook = DetectNotebook();
                _logger.LogInfo($"[ProfileDetector] Chassis: {(isNotebook ? "Laptops/Notebook" : "Desktop/Workstation")}");

                var profile = DetermineMachineProfile(cpuTier, gpuTier, ramTier, isNotebook);
                var recommendations = GenerateRecommendations(profile, cpuTier, gpuTier, ramTier);
                var restrictions = GenerateRestrictions(profile, cpuTier, gpuTier, ramTier);
                var isGamingReady = EvaluateGamingReadiness(gpuTier, ramTier);
                
                _logger.LogSuccess($"[ProfileDetector] ===== PERFIL FINAL: {profile} =====");
                _logger.LogInfo($"[ProfileDetector] Gaming Ready: {isGamingReady}");
                if (recommendations.Length > 0) _logger.LogInfo($"[ProfileDetector] Recomendações: {string.Join(", ", recommendations)}");
                if (restrictions.Length > 0) _logger.LogInfo($"[ProfileDetector] Restrições: {string.Join(", ", restrictions)}");

                return new MachineProfileResult
                {
                    Profile = profile,
                    CpuTier = cpuTier,
                    GpuTier = gpuTier,
                    RamTier = ramTier,
                    IsNotebook = isNotebook,
                    IsGamingReady = isGamingReady,
                    Recommendations = recommendations,
                    Restrictions = restrictions
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"[ProfileDetector] ❌ Erro CRÍTICO na análise: {ex.Message}", ex);
                return CreateFallbackProfile();
            }
        }
        
        private GpuVendor MapVendor(string vendor)
        {
            if (string.IsNullOrEmpty(vendor)) return GpuVendor.Unknown;
            var v = vendor.ToLowerInvariant();
            if (v.Contains("nvidia")) return GpuVendor.Nvidia;
            if (v.Contains("amd") || v.Contains("ati")) return GpuVendor.Amd;
            if (v.Contains("intel")) return GpuVendor.Intel;
            return GpuVendor.Unknown;
        }

        private HardwareTier ClassifyCpu(int cores, int threads)

        {
            // Classificação baseada em núcleos e threads
            if (cores <= 2 && threads <= 4)
                return HardwareTier.Low;
            else if (cores <= 4 && threads <= 8)
                return HardwareTier.Medium;
            else
                return HardwareTier.High;
        }
        
        private HardwareTier ClassifyGpu(GpuVendor vendor, string model)
        {
            // GPUs integradas
            if (vendor == GpuVendor.Intel)
                return HardwareTier.Low;
                
            // GPUs dedicadas - classificação simplificada
            if (model.Contains("RTX") || model.Contains("RX") && 
                (model.Contains("6") || model.Contains("7") || model.Contains("8")))
                return HardwareTier.High;
            else if (model.Contains("GTX") || model.Contains("RTX") || model.Contains("RX"))
                return HardwareTier.Medium;
            else
                return HardwareTier.Low;
        }
        
        private HardwareTier ClassifyRam(double ramGb)
        {
            if (ramGb < 8)
                return HardwareTier.Low;
            else if (ramGb <= 16)
                return HardwareTier.Medium;
            else
                return HardwareTier.High;
        }
        
        private bool DetectNotebook()
        {
            try
            {
                // Verificar chassis type via WMI
                using var searcher = new System.Management.ManagementObjectSearcher(
                    "SELECT ChassisTypes FROM Win32_SystemEnclosure");
                
                foreach (System.Management.ManagementObject obj in searcher.Get())
                {
                    var chassisTypes = obj["ChassisTypes"] as ushort[];
                    if (chassisTypes != null && chassisTypes.Length > 0)
                    {
                        // Types 8, 9, 10, 11, 12, 14, 18, 21 são notebooks/laptops
                        var notebookTypes = new ushort[] { 8, 9, 10, 11, 12, 14, 18, 21 };
                        return Array.Exists(notebookTypes, type => type == chassisTypes[0]);
                    }
                }
            }
            catch { }
            
            return false;
        }
        
        private MachineProfile DetermineMachineProfile(HardwareTier cpu, HardwareTier gpu, HardwareTier ram, bool isNotebook)
        {
            var lowestTier = (HardwareTier)Math.Min(Math.Min((int)cpu, (int)gpu), (int)ram);
            var highestTier = (HardwareTier)Math.Max(Math.Max((int)cpu, (int)gpu), (int)ram);
            
            if (lowestTier == HardwareTier.Low)
                return MachineProfile.EntryLevel;
            else if (highestTier == HardwareTier.High && !isNotebook)
                return MachineProfile.GamingMachine;
            else if (lowestTier == HardwareTier.Medium)
                return MachineProfile.MidRange;
            else
                return MachineProfile.HighEnd;
        }
        
        private bool EvaluateGamingReadiness(HardwareTier gpuTier, HardwareTier ramTier)
        {
            // Mínimo para gaming: GPU média OU RAM alta + GPU baixa
            return gpuTier >= HardwareTier.Medium || (ramTier >= HardwareTier.High && gpuTier >= HardwareTier.Low);
        }
        
        private string[] GenerateRecommendations(MachineProfile profile, HardwareTier cpu, HardwareTier gpu, HardwareTier ram)
        {
            var recommendations = new System.Collections.Generic.List<string>();
            
            switch (profile)
            {
                case MachineProfile.EntryLevel:
                    recommendations.Add("Priorizar otimizações leves de memória");
                    recommendations.Add("Evitar overclock e ajustes agressivos");
                    recommendations.Add("Foco em gerenciamento de processos");
                    break;
                    
                case MachineProfile.MidRange:
                    recommendations.Add("Balancear performance e estabilidade");
                    recommendations.Add("Ativar otimizações moderadas de GPU");
                    recommendations.Add("Monitorar temperatura constantemente");
                    break;
                    
                case MachineProfile.HighEnd:
                    recommendations.Add("Ativar otimizações avançadas disponíveis");
                    recommendations.Add("Configurar para máxima performance");
                    break;
                    
                case MachineProfile.GamingMachine:
                    recommendations.Add("Aplicar todas as otimizações suportadas");
                    recommendations.Add("Configurar para latência mínima");
                    recommendations.Add("Ativar recursos gaming premium");
                    break;
            }
            
            return recommendations.ToArray();
        }
        
        private string[] GenerateRestrictions(MachineProfile profile, HardwareTier cpu, HardwareTier gpu, HardwareTier ram)
        {
            var restrictions = new System.Collections.Generic.List<string>();
            
            if (profile == MachineProfile.EntryLevel)
            {
                restrictions.Add("Desativar FPS Boost (requer GPU dedicada)");
                restrictions.Add("Evitar ajustes de energia agressivos");
                restrictions.Add("Não aplicar overclock de CPU");
            }
            
            if (gpu == HardwareTier.Low)

            {
                restrictions.Add("HAGS não suportado em GPUs integradas Intel");
                restrictions.Add("FPS Boost não disponível");
            }
            
            if (ram == HardwareTier.Low)

            {
                restrictions.Add("Evitar otimizações que aumentam uso de RAM");
            }
            
            return restrictions.ToArray();
        }
        
        private MachineProfileResult CreateFallbackProfile()
        {
            return new MachineProfileResult
            {
                Profile = MachineProfile.MidRange,
                CpuTier = HardwareTier.Medium,
                GpuTier = HardwareTier.Medium,
                RamTier = HardwareTier.Medium,
                IsNotebook = false,
                IsGamingReady = true,
                Recommendations = new[] { "Perfil de fallback - modo médio aplicado" },
                Restrictions = Array.Empty<string>()
            };
        }
        
        public bool ShouldApplyOptimization(string optimizationName, MachineProfileResult profile)
        {
            // Regras adaptativas baseadas no perfil
            return optimizationName switch
            {
                "FpsBoost" => profile.GpuTier >= HardwareTier.Medium && profile.Profile != MachineProfile.EntryLevel,
                "Hags" => profile.GpuTier >= HardwareTier.Medium && profile.Profile != MachineProfile.EntryLevel,
                "CpuPriority" => profile.CpuTier >= HardwareTier.Medium,
                "MemoryOptimization" => profile.RamTier >= HardwareTier.Low, // Sempre aplicável
                "AggressivePowerPlan" => profile.Profile != MachineProfile.EntryLevel && !profile.IsNotebook,
                "ProcessOffload" => profile.CpuTier >= HardwareTier.Medium,
                _ => true // Padrão: aplicar
            };
        }
        
        public string[] GetProfileSpecificOptimizations(MachineProfileResult profile)
        {
            return profile.Profile switch
            {
                MachineProfile.EntryLevel => new[] { "LightMemoryOpt", "ProcessPriority", "BackgroundAppReduction" },
                MachineProfile.MidRange => new[] { "BalancedGpuOpt", "ModerateCpuBoost", "NetworkOptimization" },
                MachineProfile.HighEnd => new[] { "AdvancedGpuTuning", "CpuOverclockPrep", "StorageOptimization" },
                MachineProfile.GamingMachine => new[] { "UltimatePerformance", "LatencyReduction", "FullscreenOptDisable" },
                _ => Array.Empty<string>()
            };
        }
    }
}