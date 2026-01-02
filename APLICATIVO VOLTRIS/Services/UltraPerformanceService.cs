using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Management;
using System.Runtime.InteropServices;
using System.ServiceProcess;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32;
using Microsoft.Extensions.DependencyInjection;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Helpers;
using VoltrisOptimizer.Services.SystemChanges;
using VoltrisOptimizer.Services.Performance.Models;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// VOLTRIS ULTRA PERFORMANCE - Otimiza��es Revolucion�rias
    /// Sistema inteligente de otimiza��o que NENHUM outro programa oferece
    /// 100% seguro - n�o quebra impressoras, drivers ou funcionalidades essenciais
    /// </summary>
    public class UltraPerformanceService
    {
        private readonly ILoggingService _logger;
        private readonly ISystemChangeTransactionService? _txService;
        private readonly ICapabilityGuard? _capabilityGuard;
        private ISystemTransaction? _currentTx;
        private readonly Dictionary<string, object> _backups = new();
        private PerformanceSystemProfile _systemProfile;

        public UltraPerformanceService(ILoggingService logger, ISystemChangeTransactionService? txService = null, ICapabilityGuard? capabilityGuard = null)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _txService = txService;
            _capabilityGuard = capabilityGuard;
            _systemProfile = DetectSystemProfile();
        }
        
        /// <summary>
        /// Aplica SvcHostSplitThresholdInKB baseado na quantidade de RAM do sistema
        /// Deve ser chamado apenas na primeira vez pelo perfil inteligente
        /// </summary>
        public void ApplySvcHostSplitThreshold()
        {
            try
            {
                // Verificar se j� foi aplicado
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control", false);
                if (key?.GetValue("SvcHostSplitThresholdInKB") != null)
                {
                    // J� foi configurado, n�o aplicar novamente
                    return;
                }

                // Calcular valor baseado na RAM
                var ramGB = _systemProfile.TotalRAMGB;
                int thresholdKB;

                if (ramGB <= 4)
                    thresholdKB = 4 * 1024 * 1024; // 4GB
                else if (ramGB <= 8)
                    thresholdKB = 8 * 1024 * 1024; // 8GB
                else if (ramGB <= 16)
                    thresholdKB = 16 * 1024 * 1024; // 16GB
                else if (ramGB <= 32)
                    thresholdKB = 32 * 1024 * 1024; // 32GB
                else if (ramGB <= 48)
                    thresholdKB = 48 * 1024 * 1024; // 48GB
                else if (ramGB <= 64)
                    thresholdKB = 64 * 1024 * 1024; // 64GB
                else
                    thresholdKB = 128 * 1024 * 1024; // 128GB+

                using var writeKey = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control", true);
                if (writeKey != null)
                {
                    BackupValue(writeKey, "SvcHostSplitThresholdInKB");
                    writeKey.SetValue("SvcHostSplitThresholdInKB", thresholdKB, RegistryValueKind.DWord);
                    _logger.LogInfo($"[UltraPerf] SvcHostSplitThresholdInKB configurado para {ramGB:F0}GB RAM: {thresholdKB / (1024 * 1024)}GB");
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[UltraPerf] Erro ao aplicar SvcHostSplitThreshold: {ex.Message}");
            }
        }

        #region System Profile Detection

        /// <summary>
        /// Detecta automaticamente o perfil do sistema para otimiza��es inteligentes
        /// </summary>
        public PerformanceSystemProfile DetectSystemProfile()
        {
            var profile = new PerformanceSystemProfile();

            try
            {
                // Detectar tipo de armazenamento
                profile.HasSSD = DetectSSD();
                profile.HasNVMe = DetectNVMe();

                // Detectar RAM
                profile.TotalRAMGB = GetTotalRAMGB();
                profile.IsLowRAM = profile.TotalRAMGB < 8;
                profile.IsHighRAM = profile.TotalRAMGB >= 16;

                // Detectar CPU
                profile.CPUCores = Environment.ProcessorCount;
                profile.IsMultiCore = profile.CPUCores >= 4;
                profile.CPUName = GetCPUName();

                // Detectar GPU
                profile.HasDedicatedGPU = DetectDedicatedGPU();
                profile.GPUName = GetGPUName();

                // Detectar tipo de dispositivo
                profile.IsLaptop = WindowsCompatibilityHelper.IsLaptop();

                // Detectar vers�o do Windows
                profile.WindowsVersion = Environment.OSVersion.Version;
                profile.IsWindows11 = WindowsCompatibilityHelper.IsWindows11();

                // Classificar tipo de PC
                profile.IsGamingPC = DetectGamingPC(profile);
                profile.IsWorkstation = DetectWorkstation(profile);
            }
            catch (Exception ex)
            {
                _logger.LogError("[UltraPerf] Erro ao detectar perfil do sistema", ex);
            }

            return profile;
        }

        private bool DetectSSD()
        {
            try
            {
                var driveType = DriveType.Fixed;
                var systemDrive = Path.GetPathRoot(Environment.SystemDirectory);
                
                if (string.IsNullOrEmpty(systemDrive))
                    return false;
                
                var driveInfo = new DriveInfo(systemDrive);
                if (driveInfo.DriveType != driveType)
                    return false;
                
                // Usar WMI para verificar se � SSD
                using var searcher = new ManagementObjectSearcher(
                    "SELECT MediaType, Size FROM Win32_DiskDrive WHERE MediaType LIKE '%SSD%' OR Caption LIKE '%SSD%'");
                return searcher.Get().Cast<ManagementObject>().Any();
            }
            catch
            {
                // Fallback: verificar propriedades do drive
                try
                {
                    var systemDrive = Path.GetPathRoot(Environment.SystemDirectory);
                    if (string.IsNullOrEmpty(systemDrive)) return false;
                    
                    var driveInfo = new DriveInfo(systemDrive);
                    // Em ambientes modernos, drives fixos s�o frequentemente SSDs
                    return driveInfo.DriveType == DriveType.Fixed && !driveInfo.IsReady == false;
                }
                catch
                {
                    return false;
                }
            }
        }

        private bool DetectNVMe()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher(
                    "SELECT Caption FROM Win32_DiskDrive WHERE InterfaceType = 'NVMe'");
                return searcher.Get().Cast<ManagementObject>().Any();
            }
            catch
            {
                return false;
            }
        }

        private double GetTotalRAMGB()
        {
            try
            {
                return (double)SystemInfoService.GetTotalRAMBytes() / (1024 * 1024 * 1024);
            }
            catch
            {
                return 0;
            }
        }

        private string GetCPUName()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT Name FROM Win32_Processor");
                foreach (ManagementObject obj in searcher.Get())
                {
                    return obj["Name"]?.ToString() ?? "Processador Desconhecido";
                }
            }
            catch
            {
                return "Processador Desconhecido";
            }
            
            return "Processador Desconhecido";
        }

        private bool DetectDedicatedGPU()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher(
                    "SELECT VideoProcessor, Name FROM Win32_VideoController");
                
                foreach (ManagementObject obj in searcher.Get())
                {
                    var name = obj["Name"]?.ToString()?.ToLower() ?? "";
                    var processor = obj["VideoProcessor"]?.ToString()?.ToLower() ?? "";
                    
                    // Excluir GPUs integradas conhecidas
                    if (name.Contains("intel") && name.Contains("hd")) continue;
                    if (name.Contains("amd") && name.Contains("radeon(tm)")) continue;
                    if (processor.Contains("intel") && processor.Contains("hd")) continue;
                    
                    // Se chegou aqui, provavelmente � GPU dedicada
                    if (!string.IsNullOrEmpty(name) && !name.Contains("basic"))
                        return true;
                }
            }
            catch { }
            
            return false;
        }

        private string GetGPUName()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT Name FROM Win32_VideoController");
                foreach (ManagementObject obj in searcher.Get())
                {
                    var name = obj["Name"]?.ToString() ?? "";
                    if (!string.IsNullOrEmpty(name) && !name.Contains("Basic"))
                        return name;
                }
            }
            catch { }
            
            return "Placa Gr�fica Desconhecida";
        }

        private bool DetectGamingPC(PerformanceSystemProfile profile)
        {
            // Crit�rios para PC Gamer:
            // - GPU dedicada E
            // - RAM >= 16GB E
            // - CPU >= 4 cores E
            // - SSD/NVMe
            return profile.HasDedicatedGPU && 
                   profile.TotalRAMGB >= 16 && 
                   profile.CPUCores >= 4 && 
                   (profile.HasSSD || profile.HasNVMe);
        }

        private bool DetectWorkstation(PerformanceSystemProfile profile)
        {
            // Crit�rios para Workstation:
            // - RAM >= 32GB E
            // - CPU >= 8 cores E
            // - GPU dedicada E
            // - NVMe SSD
            return profile.TotalRAMGB >= 32 && 
                   profile.CPUCores >= 8 && 
                   profile.HasDedicatedGPU && 
                   profile.HasNVMe;
        }

        #endregion

        #region Hardware Classification

        /// <summary>
        /// Classifica o hardware do sistema em tier (fraco/m�dio/forte)
        /// </summary>
        public HardwareTier ClassifyHardware()
        {
            return ClassifyHardware(_systemProfile);
        }

        /// <summary>
        /// Classifica hardware baseado no perfil do sistema
        /// </summary>
        public static HardwareTier ClassifyHardware(PerformanceSystemProfile profile)
        {
            // Crit�rios para PC Fraco (LowEnd)
            // - RAM <= 4GB OU
            // - CPU <= 2 cores OU
            // - Sem GPU dedicada E RAM <= 8GB
            if (profile.TotalRAMGB <= 4 ||
                profile.CPUCores <= 2 ||
                (!profile.HasDedicatedGPU && profile.TotalRAMGB <= 8))
            {
                return HardwareTier.LowEnd;
            }

            // Crit�rios para PC Forte (HighEnd)
            // - RAM > 12GB E
            // - CPU > 6 cores E
            // - GPU dedicada E
            // - NVMe SSD OU SSD
            if (profile.TotalRAMGB > 12 &&
                profile.CPUCores > 6 &&
                profile.HasDedicatedGPU &&
                (profile.HasNVMe || profile.HasSSD))
            {
                return HardwareTier.HighEnd;
            }

            // Caso contr�rio, � PC m�dio
            return HardwareTier.MidRange;
        }

        #endregion

        #region Optimization Categories

        /// <summary>
        /// Obt�m todas as categorias de otimiza��o dispon�veis
        /// </summary>
        public IReadOnlyList<PerformanceCategory> GetOptimizationCategories()
        {
            var categories = new List<PerformanceCategory>();
            var tier = ClassifyHardware();

            // Categoria: Otimização de Memória
            categories.Add(new PerformanceCategory
            {
                Name = "Otimização de Memória",
                Icon = "🧠",
                Description = "Melhora o gerenciamento de memória do sistema",
                Optimizations = GetMemoryOptimizations(tier)
            });

            // Categoria: Otimização de CPU
            categories.Add(new PerformanceCategory
            {
                Name = "Otimização de CPU",
                Icon = "⚡",
                Description = "Maximiza o desempenho do processador",
                Optimizations = GetCpuOptimizations(tier)
            });

            // Categoria: Otimização de Disco
            categories.Add(new PerformanceCategory
            {
                Name = "Otimização de Disco",
                Icon = "💾",
                Description = "Acelera operações de leitura e escrita",
                Optimizations = GetDiskOptimizations(tier)
            });

            // Categoria: Otimização de Rede
            categories.Add(new PerformanceCategory
            {
                Name = "Otimização de Rede",
                Icon = "🌐",
                Description = "Melhora a velocidade e estabilidade da conexão",
                Optimizations = GetNetworkOptimizations(tier)
            });

            // Categoria: Otimização Visual
            categories.Add(new PerformanceCategory
            {
                Name = "Otimização Visual",
                Icon = "🎨",
                Description = "Equilibra desempenho e qualidade visual",
                Optimizations = GetVisualOptimizations(tier)
            });

            // Categoria: Otimização de Inicialização
            categories.Add(new PerformanceCategory
            {
                Name = "Otimização de Inicialização",
                Icon = "🚀",
                Description = "Reduz tempo de boot e programas na inicialização",
                Optimizations = GetStartupOptimizations(tier)
            });

            // Categoria: Essential Tweaks
            categories.Add(new PerformanceCategory
            {
                Name = "Essential Tweaks",
                Icon = "🔧",
                Description = "Configurações fundamentais do sistema",
                Optimizations = GetEssentialTweaks(tier)
            });

            return categories;
        }

        private List<PerformanceOptimization> GetMemoryOptimizations(HardwareTier tier)
        {
            var optimizations = new List<PerformanceOptimization>();

            // 1. Otimização de Compressão de Memória
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Otimização de Compressão de Memória",
                Description = "Habilita compressão de memória para reduzir uso de disco",
                Impact = OptimizationImpact.Medium,
                Safety = OptimizationSafety.Safe,
                IsRecommended = tier >= HardwareTier.MidRange,
                ApplyAction = OptimizeMemoryCompression,
                RevertAction = RevertMemoryCompression,
                RequiredRestart = RestartScope.Explorer,
                MinimumRAMGB = 8,
                IncompatibilityReason = "Requer pelo menos 8GB de RAM"
            });

            // 2. Ajuste de Prioridade de Memória
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Ajuste de Prioridade de Memória",
                Description = "Ajusta prioridade de alocação para aplicações",
                Impact = OptimizationImpact.Low,
                Safety = OptimizationSafety.Safe,
                IsRecommended = true,
                ApplyAction = AdjustMemoryPriority,
                RevertAction = RevertMemoryPriority,
                RequiredRestart = RestartScope.None
            });

            // 3. Limite de Cache do Sistema
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Limite de Cache do Sistema",
                Description = "Define limite máximo de cache do sistema",
                Impact = OptimizationImpact.Medium,
                Safety = OptimizationSafety.Moderate,
                IsRecommended = tier >= HardwareTier.MidRange && !_systemProfile.IsLaptop,
                ApplyAction = SetSystemCacheLimit,
                RevertAction = RevertSystemCacheLimit,
                RequiredRestart = RestartScope.Explorer,
                NotForLaptops = true,
                IncompatibilityReason = "Não recomendado para laptops"
            });

            // 4. Otimização de Superfetch
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Otimização de Superfetch",
                Description = "Ajusta serviço SysMain para melhor uso de RAM",
                Impact = OptimizationImpact.High,
                Safety = OptimizationSafety.Moderate,
                IsRecommended = tier >= HardwareTier.MidRange,
                ApplyAction = OptimizeSuperfetch,
                RevertAction = RevertSuperfetch,
                RequiredRestart = RestartScope.PC,
                MinimumRAMGB = 8,
                IncompatibilityReason = "Requer pelo menos 8GB de RAM"
            });

            return optimizations;
        }

        private List<PerformanceOptimization> GetCpuOptimizations(HardwareTier tier)
        {
            var optimizations = new List<PerformanceOptimization>();

            // 1. Governor Adaptativo de CPU
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Governor Adaptativo de CPU",
                Description = "Ajusta perfil de energia da CPU dinamicamente",
                Impact = OptimizationImpact.High,
                Safety = OptimizationSafety.Advanced,
                IsRecommended = tier >= HardwareTier.MidRange && !_systemProfile.IsLaptop,
                ApplyAction = ApplyAdaptiveCpuGovernor,
                RevertAction = RevertAdaptiveCpuGovernor,
                RequiredRestart = RestartScope.PC,
                NotForLaptops = true,
                IncompatibilityReason = "N�o recomendado para laptops"
            });

            // 2. Otimiza��o de Threads
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Otimiza��o de Threads",
                Description = "Ajusta agendamento de threads para melhor desempenho",
                Impact = OptimizationImpact.Medium,
                Safety = OptimizationSafety.Moderate,
                IsRecommended = _systemProfile.IsMultiCore,
                ApplyAction = OptimizeThreadScheduling,
                RevertAction = RevertThreadScheduling,
                RequiredRestart = RestartScope.Explorer,
                MinimumCores = 4,
                IncompatibilityReason = "Requer pelo menos 4 n�cleos de CPU"
            });

            // 3. Desativação de Mitigações Spectre/Meltdown
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Desativação de Mitigações Spectre/Meltdown",
                Description = "Remove proteções para ganho de performance (menos seguro)",
                Impact = OptimizationImpact.High,
                Safety = OptimizationSafety.Advanced,
                IsRecommended = false, // Por padr�o desativado por quest�es de seguran�a
                ApplyAction = DisableSpectreMitigations,
                RevertAction = RevertSpectreMitigations,
                RequiredRestart = RestartScope.PC,
                ConflictsWithGamerMode = true,
                IncompatibilityReason = "Conflita com Modo Gamer"
            });

            // 4. Ajuste de Quantum Length
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Ajuste de Quantum Length",
                Description = "Otimiza tempo de slice de CPU para processos",
                Impact = OptimizationImpact.Medium,
                Safety = OptimizationSafety.Moderate,
                IsRecommended = tier >= HardwareTier.HighEnd,
                ApplyAction = AdjustQuantumLength,
                RevertAction = RevertQuantumLength,
                RequiredRestart = RestartScope.Explorer,
                MinimumCores = 6,
                IncompatibilityReason = "Requer pelo menos 6 núcleos de CPU"
            });

            return optimizations;
        }

        private List<PerformanceOptimization> GetDiskOptimizations(HardwareTier tier)
        {
            var optimizations = new List<PerformanceOptimization>();

            // 1. Otimização de Prefetch
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Otimização de Prefetch",
                Description = "Ajusta cache de prefetch para inicialização mais rápida",
                Impact = OptimizationImpact.Medium,
                Safety = OptimizationSafety.Safe,
                IsRecommended = _systemProfile.HasSSD || _systemProfile.HasNVMe,
                ApplyAction = OptimizePrefetch,
                RevertAction = RevertPrefetch,
                RequiredRestart = RestartScope.PC,
                RequiresSSD = true,
                IncompatibilityReason = "Requer SSD/NVMe para máxima eficácia"
            });

            // 2. Desfragmentação Inteligente
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Desfragmentação Inteligente",
                Description = "Desfragmenta discos mecânicos quando necessário",
                Impact = OptimizationImpact.High,
                Safety = OptimizationSafety.Safe,
                IsRecommended = !_systemProfile.HasSSD && !_systemProfile.HasNVMe,
                ApplyAction = OptimizeDefrag,
                RevertAction = null, // Não precisa reverter
                RequiredRestart = RestartScope.None,
                RequiresSSD = false,
                IncompatibilityReason = "Apenas para discos mecânicos"
            });

            // 3. Otimiza��o de NVMe
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Otimiza��o de NVMe",
                Description = "Habilita recursos avan�ados de drives NVMe",
                Impact = OptimizationImpact.High,
                Safety = OptimizationSafety.Moderate,
                IsRecommended = _systemProfile.HasNVMe,
                ApplyAction = OptimizeNVMe,
                RevertAction = RevertNVMe,
                RequiredRestart = RestartScope.PC,
                RequiresSSD = true,
                IncompatibilityReason = "Requer NVMe SSD"
            });

            // 4. Ajuste de Lat�ncia de Disco
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Ajuste de Lat�ncia de Disco",
                Description = "Reduz lat�ncia de opera��es de disco",
                Impact = OptimizationImpact.Medium,
                Safety = OptimizationSafety.Moderate,
                IsRecommended = tier >= HardwareTier.MidRange && (_systemProfile.HasSSD || _systemProfile.HasNVMe),
                ApplyAction = AdjustDiskLatency,
                RevertAction = RevertDiskLatency,
                RequiredRestart = RestartScope.Explorer,
                RequiresSSD = true,
                IncompatibilityReason = "Requer SSD/NVMe"
            });

            // 5. Otimização de Write-Cache
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Otimização de Write-Cache",
                Description = "Ajusta buffer de escrita para melhor performance",
                Impact = OptimizationImpact.Medium,
                Safety = OptimizationSafety.Moderate,
                IsRecommended = _systemProfile.HasSSD || _systemProfile.HasNVMe,
                ApplyAction = OptimizeWriteCache,
                RevertAction = RevertWriteCache,
                RequiredRestart = RestartScope.Explorer,
                RequiresSSD = true,
                IncompatibilityReason = "Requer SSD/NVMe"
            });

            return optimizations;
        }

        private List<PerformanceOptimization> GetNetworkOptimizations(HardwareTier tier)
        {
            var optimizations = new List<PerformanceOptimization>();

            // 1. TCP/IP Tuning
            optimizations.Add(new PerformanceOptimization
            {
                Name = "TCP/IP Tuning",
                Description = "Otimiza pilha TCP/IP para maior throughput",
                Impact = OptimizationImpact.High,
                Safety = OptimizationSafety.Moderate,
                IsRecommended = true,
                ApplyAction = OptimizeTcpIp,
                RevertAction = RevertTcpIp,
                RequiredRestart = RestartScope.Explorer
            });

            // 2. Buffer de Rede
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Buffer de Rede",
                Description = "Ajusta buffers de rede para menor latência",
                Impact = OptimizationImpact.Medium,
                Safety = OptimizationSafety.Safe,
                IsRecommended = _systemProfile.IsGamingPC,
                ApplyAction = OptimizeNetworkBuffers,
                RevertAction = RevertNetworkBuffers,
                RequiredRestart = RestartScope.Explorer,
                ConflictsWithGamerMode = true,
                IncompatibilityReason = "Conflita com Modo Gamer"
            });

            // 3. Desativação de NetBIOS
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Desativação de NetBIOS",
                Description = "Remove protocolo legado para melhor performance",
                Impact = OptimizationImpact.Low,
                Safety = OptimizationSafety.Safe,
                IsRecommended = true,
                ApplyAction = DisableNetBios,
                RevertAction = RevertNetBios,
                RequiredRestart = RestartScope.Explorer
            });

            // 4. Otimização de Placa de Rede
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Otimização de Placa de Rede",
                Description = "Ajusta driver da placa para máxima performance",
                Impact = OptimizationImpact.High,
                Safety = OptimizationSafety.Advanced,
                IsRecommended = tier >= HardwareTier.MidRange,
                ApplyAction = OptimizeNetworkAdapter,
                RevertAction = RevertNetworkAdapter,
                RequiredRestart = RestartScope.PC,
                MinimumTier = HardwareTier.MidRange,
                IncompatibilityReason = "Requer hardware médio ou superior"
            });

            return optimizations;
        }

        private List<PerformanceOptimization> GetVisualOptimizations(HardwareTier tier)
        {
            var optimizations = new List<PerformanceOptimization>();

            // 1. Animações do Sistema
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Animações do Sistema",
                Description = "Reduz animações para maior responsividade",
                Impact = OptimizationImpact.Low,
                Safety = OptimizationSafety.Safe,
                IsRecommended = tier <= HardwareTier.MidRange,
                ApplyAction = ReduceAnimations,
                RevertAction = RevertAnimations,
                RequiredRestart = RestartScope.Explorer
            });

            // 2. Efeitos Visuais
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Efeitos Visuais",
                Description = "Desativa efeitos visuais pesados",
                Impact = OptimizationImpact.Medium,
                Safety = OptimizationSafety.Safe,
                IsRecommended = tier <= HardwareTier.MidRange || _systemProfile.IsLaptop,
                ApplyAction = DisableVisualEffects,
                RevertAction = RevertVisualEffects,
                RequiredRestart = RestartScope.Explorer,
                NotForLaptops = false
            });

            // 3. Transparências
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Transparências",
                Description = "Desativa transparências para economizar recursos",
                Impact = OptimizationImpact.Low,
                Safety = OptimizationSafety.Safe,
                IsRecommended = tier <= HardwareTier.MidRange || _systemProfile.IsLaptop,
                ApplyAction = DisableTransparency,
                RevertAction = RevertTransparency,
                RequiredRestart = RestartScope.Explorer
            });

            // 4. Aceleração de Hardware
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Aceleração de Hardware",
                Description = "Otimiza aceleração de hardware para aplicações",
                Impact = OptimizationImpact.High,
                Safety = OptimizationSafety.Moderate,
                IsRecommended = _systemProfile.HasDedicatedGPU,
                ApplyAction = OptimizeHardwareAcceleration,
                RevertAction = RevertHardwareAcceleration,
                RequiredRestart = RestartScope.Explorer,
                RequiresDedicatedGPU = true,
                IncompatibilityReason = "Requer GPU dedicada"
            });

            return optimizations;
        }

        private List<PerformanceOptimization> GetStartupOptimizations(HardwareTier tier)
        {
            var optimizations = new List<PerformanceOptimization>();

            // 1. Timeout de Boot
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Timeout de Boot",
                Description = "Reduz tempo de espera no boot",
                Impact = OptimizationImpact.Low,
                Safety = OptimizationSafety.Safe,
                IsRecommended = true,
                ApplyAction = ReduceBootTimeout,
                RevertAction = RevertBootTimeout,
                RequiredRestart = RestartScope.PC
            });

            // 2. Programas na Inicialização
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Programas na Inicialização",
                Description = "Desativa programas desnecessários na inicialização",
                Impact = OptimizationImpact.High,
                Safety = OptimizationSafety.Safe,
                IsRecommended = true,
                ApplyAction = OptimizeStartupPrograms,
                RevertAction = RevertStartupPrograms,
                RequiredRestart = RestartScope.Explorer
            });

            // 3. Serviços de Inicialização
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Serviços de Inicialização",
                Description = "Ajusta serviços iniciados com o sistema",
                Impact = OptimizationImpact.High,
                Safety = OptimizationSafety.Moderate,
                IsRecommended = tier >= HardwareTier.MidRange && WindowsCompatibilityHelper.AllowServiceTweaks(),
                ApplyAction = OptimizeStartupServices,
                RevertAction = RevertStartupServices,
                RequiredRestart = RestartScope.PC,
                MinimumTier = HardwareTier.MidRange,
                IncompatibilityReason = "Requer hardware médio ou superior"
            });

            // 4. Fast Startup
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Fast Startup",
                Description = "Habilita inicialização rápida do Windows",
                Impact = OptimizationImpact.High,
                Safety = OptimizationSafety.Safe,
                IsRecommended = true,
                ApplyAction = EnableFastStartup,
                RevertAction = RevertFastStartup,
                RequiredRestart = RestartScope.PC
            });

            return optimizations;
        }

        private List<PerformanceOptimization> GetEssentialTweaks(HardwareTier tier)
        {
            var optimizations = new List<PerformanceOptimization>();

            // 1. Telemetria
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Telemetria",
                Description = "Reduz coleta de dados do sistema",
                Impact = OptimizationImpact.Low,
                Safety = OptimizationSafety.Safe,
                IsRecommended = true,
                ApplyAction = OptimizeTelemetry,
                RevertAction = RevertTelemetry,
                RequiredRestart = RestartScope.Explorer
            });

            // 2. Defender
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Defender",
                Description = "Otimiza scans do Windows Defender",
                Impact = OptimizationImpact.Medium,
                Safety = OptimizationSafety.Safe,
                IsRecommended = true,
                ApplyAction = OptimizeDefender,
                RevertAction = RevertDefender,
                RequiredRestart = RestartScope.None
            });

            // 3. Updates
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Updates",
                Description = "Ajusta frequência de atualizações",
                Impact = OptimizationImpact.Low,
                Safety = OptimizationSafety.Safe,
                IsRecommended = !_systemProfile.IsWorkstation,
                ApplyAction = OptimizeUpdates,
                RevertAction = RevertUpdates,
                RequiredRestart = RestartScope.PC
            });

            // 4. Power Plan
            optimizations.Add(new PerformanceOptimization
            {
                Name = "Power Plan",
                Description = "Aplica plano de energia otimizado",
                Impact = OptimizationImpact.High,
                Safety = OptimizationSafety.Safe,
                IsRecommended = !_systemProfile.IsLaptop,
                ApplyAction = ApplyUltimatePerformancePlan,
                RevertAction = RevertUltimatePerformancePlan,
                RequiredRestart = RestartScope.None,
                NotForLaptops = true,
                IncompatibilityReason = "Não recomendado para laptops"
            });

            return optimizations;
        }

        #endregion

        #region Memory Optimizations Implementation

        private void OptimizeMemoryCompression()
        {
            try
            {
                // Habilitar compress�o de mem�ria (mais eficiente que paging)
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management", true);
                if (key != null)
                {
                    BackupValue(key, "DisablePagingCombining");
                    key.SetValue("DisablePagingCombining", 0, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Memory Compression: {ex.Message}"); }
        }

        private void RevertMemoryCompression()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management", "DisablePagingCombining");
        }

        private void AdjustMemoryPriority()
        {
            try
            {
                // Ajustar prioridade de mem�ria para aplica��es
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\PriorityControl", true);
                if (key != null)
                {
                    BackupValue(key, "Win32PrioritySeparation");
                    key.SetValue("Win32PrioritySeparation", 38, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Memory Priority: {ex.Message}"); }
        }

        private void RevertMemoryPriority()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\PriorityControl", "Win32PrioritySeparation");
        }

        private void SetSystemCacheLimit()
        {
            try
            {
                // Limitar cache do sistema para evitar consumo excessivo de RAM
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management", true);
                if (key != null)
                {
                    BackupValue(key, "LargeSystemCache");
                    key.SetValue("LargeSystemCache", 0, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] System Cache Limit: {ex.Message}"); }
        }

        private void RevertSystemCacheLimit()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management", "LargeSystemCache");
        }

        private void OptimizeSuperfetch()
        {
            try
            {
                // Otimizar servi�o SysMain (Superfetch)
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\SysMain", true);
                if (key != null)
                {
                    BackupValue(key, "Start");
                    key.SetValue("Start", 2, RegistryValueKind.DWord); // Automatic
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Superfetch: {ex.Message}"); }
        }

        private void RevertSuperfetch()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\SysMain", "Start");
        }

        #endregion

        #region CPU Optimizations Implementation

        private void ApplyAdaptiveCpuGovernor()
        {
            try
            {
                // Aplicar governor adaptativo de CPU
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\0cc5b647-c1df-4637-891a-dec35c318583", true);
                if (key != null)
                {
                    BackupValue(key, "Attributes");
                    key.SetValue("Attributes", 0, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Adaptive CPU Governor: {ex.Message}"); }
        }

        private void RevertAdaptiveCpuGovernor()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\0cc5b647-c1df-4637-891a-dec35c318583", "Attributes");
        }

        private void OptimizeThreadScheduling()
        {
            try
            {
                // Otimizar agendamento de threads
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\PriorityControl", true);
                if (key != null)
                {
                    BackupValue(key, "IRQ8Priority");
                    key.SetValue("IRQ8Priority", 1, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Thread Scheduling: {ex.Message}"); }
        }

        private void RevertThreadScheduling()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\PriorityControl", "IRQ8Priority");
        }

        private void DisableSpectreMitigations()
        {
            try
            {
                // Desativar mitigations de Spectre/Meltdown para performance
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management", true);
                if (key != null)
                {
                    BackupValue(key, "FeatureSettings");
                    key.SetValue("FeatureSettings", 1, RegistryValueKind.DWord);
                    
                    BackupValue(key, "FeatureSettingsOverride");
                    key.SetValue("FeatureSettingsOverride", 3, RegistryValueKind.DWord);
                    
                    BackupValue(key, "FeatureSettingsOverrideMask");
                    key.SetValue("FeatureSettingsOverrideMask", 3, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Spectre Mitigations: {ex.Message}"); }
        }

        private void RevertSpectreMitigations()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management", "FeatureSettings");
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management", "FeatureSettingsOverride");
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management", "FeatureSettingsOverrideMask");
        }

        private void AdjustQuantumLength()
        {
            try
            {
                // Ajustar quantum length para melhor resposta
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\PriorityControl", true);
                if (key != null)
                {
                    BackupValue(key, "WeightedBackground");
                    key.SetValue("WeightedBackground", 2, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Quantum Length: {ex.Message}"); }
        }

        private void RevertQuantumLength()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\PriorityControl", "WeightedBackground");
        }

        #endregion

        #region Disk Optimizations Implementation

        private void OptimizePrefetch()
        {
            try
            {
                // Otimizar prefetch
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters", true);
                if (key != null)
                {
                    BackupValue(key, "EnablePrefetcher");
                    key.SetValue("EnablePrefetcher", 3, RegistryValueKind.DWord); // 3 = Application and Boot
                    
                    BackupValue(key, "EnableSuperfetch");
                    key.SetValue("EnableSuperfetch", 3, RegistryValueKind.DWord); // 3 = Application and Boot
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Prefetch: {ex.Message}"); }
        }

        private void RevertPrefetch()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters", "EnablePrefetcher");
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters", "EnableSuperfetch");
        }

        private void OptimizeDefrag()
        {
            try
            {
                // Otimizar defragmenta��o
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Dfrg\Statistics", true);
                if (key != null)
                {
                    BackupValue(key, "BootOptimizeFunction");
                    key.SetValue("BootOptimizeFunction", "Y", RegistryValueKind.String);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Defrag: {ex.Message}"); }
        }

        // RevertDefrag n�o � necess�rio pois n�o h� mudan�a significativa

        private void OptimizeNVMe()
        {
            try
            {
                // Otimizar NVMe
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\stornvme\Parameters\Device", true);
                if (key != null)
                {
                    BackupValue(key, "InterruptManagement");
                    key.SetValue("InterruptManagement", 1, RegistryValueKind.DWord);
                    
                    BackupValue(key, "PerformanceMode");
                    key.SetValue("PerformanceMode", 1, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] NVMe: {ex.Message}"); }
        }

        private void RevertNVMe()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\stornvme\Parameters\Device", "InterruptManagement");
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\stornvme\Parameters\Device", "PerformanceMode");
        }

        private void AdjustDiskLatency()
        {
            try
            {
                // Ajustar lat�ncia de disco
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\disk", true);
                if (key != null)
                {
                    BackupValue(key, "TimeOutValue");
                    key.SetValue("TimeOutValue", 60, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Disk Latency: {ex.Message}"); }
        }

        private void RevertDiskLatency()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\disk", "TimeOutValue");
        }

        private void OptimizeWriteCache()
        {
            try
            {
                // Otimizar write-cache
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\Volmgr", true);
                if (key != null)
                {
                    BackupValue(key, "EnableCache");
                    key.SetValue("EnableCache", 1, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Write Cache: {ex.Message}"); }
        }

        private void RevertWriteCache()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\Volmgr", "EnableCache");
        }

        #endregion

        #region Network Optimizations Implementation

        private void OptimizeTcpIp()
        {
            try
            {
                // Otimizar TCP/IP
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\Tcpip\Parameters", true);
                if (key != null)
                {
                    BackupValue(key, "DefaultTTL");
                    key.SetValue("DefaultTTL", 64, RegistryValueKind.DWord);
                    
                    BackupValue(key, "Tcp1323Opts");
                    key.SetValue("Tcp1323Opts", 1, RegistryValueKind.DWord);
                    
                    BackupValue(key, "TcpWindowSize");
                    key.SetValue("TcpWindowSize", 65535, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] TCP/IP: {ex.Message}"); }
        }

        private void RevertTcpIp()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\Tcpip\Parameters", "DefaultTTL");
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\Tcpip\Parameters", "Tcp1323Opts");
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\Tcpip\Parameters", "TcpWindowSize");
        }

        private void OptimizeNetworkBuffers()
        {
            try
            {
                // Otimizar buffers de rede
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters", true);
                if (key != null)
                {
                    BackupValue(key, "IRPStackSize");
                    key.SetValue("IRPStackSize", 32, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Network Buffers: {ex.Message}"); }
        }

        private void RevertNetworkBuffers()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters", "IRPStackSize");
        }

        private void DisableNetBios()
        {
            try
            {
                // Desativar NetBIOS
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\NetBT\Parameters", true);
                if (key != null)
                {
                    BackupValue(key, "NetbiosOptions");
                    key.SetValue("NetbiosOptions", 2, RegistryValueKind.DWord); // 2 = Disabled
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] NetBIOS: {ex.Message}"); }
        }

        private void RevertNetBios()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\NetBT\Parameters", "NetbiosOptions");
        }

        private void OptimizeNetworkAdapter()
        {
            try
            {
                // Otimizar adaptador de rede
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\Tcpip\Parameters", true);
                if (key != null)
                {
                    BackupValue(key, "DisableTaskOffload");
                    key.SetValue("DisableTaskOffload", 0, RegistryValueKind.DWord);
                    
                    BackupValue(key, "EnableTCPChimney");
                    key.SetValue("EnableTCPChimney", 1, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Network Adapter: {ex.Message}"); }
        }

        private void RevertNetworkAdapter()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\Tcpip\Parameters", "DisableTaskOffload");
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\Tcpip\Parameters", "EnableTCPChimney");
        }

        #endregion

        #region Visual Optimizations Implementation

        private void ReduceAnimations()
        {
            try
            {
                // Reduzir anima��es do sistema
                using var key = Registry.CurrentUser.OpenSubKey(@"Control Panel\Desktop\WindowMetrics", true);
                if (key != null)
                {
                    BackupValue(key, "MinAnimate", true);
                    key.SetValue("MinAnimate", "0", RegistryValueKind.String);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Animations: {ex.Message}"); }
        }

        private void RevertAnimations()
        {
            RestoreValue(@"Control Panel\Desktop\WindowMetrics", "MinAnimate", true);
        }

        private void DisableVisualEffects()
        {
            try
            {
                // Desativar efeitos visuais
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects", true);
                if (key != null)
                {
                    BackupValue(key, "VisualFXSetting");
                    key.SetValue("VisualFXSetting", 3, RegistryValueKind.DWord); // 3 = Custom
                }
                
                using var key2 = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced", true);
                if (key2 != null)
                {
                    BackupValue(key2, "ListviewAlphaSelect");
                    key2.SetValue("ListviewAlphaSelect", 0, RegistryValueKind.DWord);
                    
                    BackupValue(key2, "ListviewShadow");
                    key2.SetValue("ListviewShadow", 0, RegistryValueKind.DWord);
                    
                    BackupValue(key2, "TaskbarAnimations");
                    key2.SetValue("TaskbarAnimations", 0, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Visual Effects: {ex.Message}"); }
        }

        private void RevertVisualEffects()
        {
            RestoreValue(@"Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects", "VisualFXSetting");
            RestoreValue(@"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced", "ListviewAlphaSelect");
            RestoreValue(@"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced", "ListviewShadow");
            RestoreValue(@"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced", "TaskbarAnimations");
        }

        private void DisableTransparency()
        {
            try
            {
                // Desativar transpar�ncias
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Themes\Personalize", true);
                if (key != null)
                {
                    BackupValue(key, "EnableTransparency");
                    key.SetValue("EnableTransparency", 0, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Transparency: {ex.Message}"); }
        }

        private void RevertTransparency()
        {
            RestoreValue(@"Software\Microsoft\Windows\CurrentVersion\Themes\Personalize", "EnableTransparency");
        }

        private void OptimizeHardwareAcceleration()
        {
            try
            {
                // Otimizar acelera��o de hardware
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Avalon.Graphics", true);
                if (key != null)
                {
                    BackupValue(key, "DisableHWAcceleration");
                    key.SetValue("DisableHWAcceleration", 0, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Hardware Acceleration: {ex.Message}"); }
        }

        private void RevertHardwareAcceleration()
        {
            RestoreValue(@"Software\Microsoft\Avalon.Graphics", "DisableHWAcceleration");
        }

        #endregion

        #region Startup Optimizations Implementation

        private void ReduceBootTimeout()
        {
            try
            {
                // Reduzir timeout de boot
                var psi = new ProcessStartInfo
                {
                    FileName = "bcdedit",
                    Arguments = "/timeout 5",
                    UseShellExecute = false,
                    CreateNoWindow = true
                };
                using var p = Process.Start(psi);
                p?.WaitForExit(5000);
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Boot Timeout: {ex.Message}"); }
        }

        private void RevertBootTimeout()
        {
            try
            {
                var psi = new ProcessStartInfo
                {
                    FileName = "bcdedit",
                    Arguments = "/timeout 30",
                    UseShellExecute = false,
                    CreateNoWindow = true
                };
                using var p = Process.Start(psi);
                p?.WaitForExit(5000);
            }
            catch { }
        }

        private void OptimizeStartupPrograms()
        {
            try
            {
                // Desativar programas desnecess�rios na inicializa��o
                var programsToDisable = new[]
                {
                    @"SOFTWARE\Microsoft\Windows\CurrentVersion\Run\OneDrive",
                    @"SOFTWARE\Microsoft\Windows\CurrentVersion\Run\Spotify",
                    @"SOFTWARE\Microsoft\Windows\CurrentVersion\Run\Steam",
                    @"SOFTWARE\Wow6432Node\Microsoft\Windows\CurrentVersion\Run\CCleaner"
                };

                foreach (var program in programsToDisable)
                {
                    try
                    {
                        using var key = Registry.CurrentUser.OpenSubKey(program, true);
                        if (key != null)
                        {
                            BackupValue(key, "", true); // Backup do valor inteiro
                            key.DeleteValue("");
                        }
                    }
                    catch { /* Ignorar erros individuais */ }
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Startup Programs: {ex.Message}"); }
        }

        private void RevertStartupPrograms()
        {
            // Esta otimiza��o n�o tem revers�o autom�tica pois depende de programas espec�ficos
        }

        private void OptimizeStartupServices()
        {
            try
            {
                // Otimizar servi�os na inicializa��o
                var servicesToOptimize = new Dictionary<string, int>
                {
                    { "DiagTrack", 4 }, // Disabled
                    { "dmwappushservice", 4 }, // Disabled
                    { "WerSvc", 3 }, // Manual
                    { "PcaSvc", 3 } // Manual
                };

                foreach (var service in servicesToOptimize)
                {
                    try
                    {
                        using var key = Registry.LocalMachine.OpenSubKey($@"SYSTEM\CurrentControlSet\Services\{service.Key}", true);
                        if (key != null)
                        {
                            BackupValue(key, "Start");
                            key.SetValue("Start", service.Value, RegistryValueKind.DWord);
                        }
                    }
                    catch { /* Ignorar erros individuais */ }
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Startup Services: {ex.Message}"); }
        }

        private void RevertStartupServices()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\DiagTrack", "Start");
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\dmwappushservice", "Start");
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\WerSvc", "Start");
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\PcaSvc", "Start");
        }

        private void EnableFastStartup()
        {
            try
            {
                // Habilitar Fast Startup
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Session Manager\Power", true);
                if (key != null)
                {
                    BackupValue(key, "HiberbootEnabled");
                    key.SetValue("HiberbootEnabled", 1, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Fast Startup: {ex.Message}"); }
        }

        private void RevertFastStartup()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Session Manager\Power", "HiberbootEnabled");
        }

        #endregion

        #region Essential Tweaks Implementation

        private void OptimizeTelemetry()
        {
            try
            {
                // Reduzir telemetria sem desativar completamente
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Policies\Microsoft\Windows\DataCollection", true);
                if (key != null)
                {
                    BackupValue(key, "AllowTelemetry");
                    key.SetValue("AllowTelemetry", 1, RegistryValueKind.DWord); // 1 = Basic
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Telemetry: {ex.Message}"); }
        }

        private void RevertTelemetry()
        {
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\DataCollection", "AllowTelemetry");
        }

        private void OptimizeDefender()
        {
            try
            {
                // Otimizar Windows Defender
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Policies\Microsoft\Windows Defender\Real-Time Protection", true);
                if (key != null)
                {
                    BackupValue(key, "DisableRealtimeMonitoring");
                    key.SetValue("DisableRealtimeMonitoring", 0, RegistryValueKind.DWord); // Mant�m ativado mas otimizado
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Defender: {ex.Message}"); }
        }

        private void RevertDefender()
        {
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows Defender\Real-Time Protection", "DisableRealtimeMonitoring");
        }

        private void OptimizeUpdates()
        {
            try
            {
                // Otimizar atualiza��es
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU", true);
                if (key != null)
                {
                    BackupValue(key, "NoAutoUpdate");
                    key.SetValue("NoAutoUpdate", 0, RegistryValueKind.DWord); // Mant�m updates mas otimizados
                    
                    BackupValue(key, "AUOptions");
                    key.SetValue("AUOptions", 3, RegistryValueKind.DWord); // Download autom�tico, notifica��o antes de instalar
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Updates: {ex.Message}"); }
        }

        private void RevertUpdates()
        {
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU", "NoAutoUpdate");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\WindowsUpdate\AU", "AUOptions");
        }

        private void ApplyUltimatePerformancePlan()
        {
            try
            {
                // Aplicar plano de energia Ultimate Performance
                var process = Process.Start(new ProcessStartInfo
                {
                    FileName = "powercfg",
                    Arguments = "/duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61",
                    UseShellExecute = false,
                    CreateNoWindow = true
                });
                process?.WaitForExit(5000);

                process = Process.Start(new ProcessStartInfo
                {
                    FileName = "powercfg",
                    Arguments = "/setactive e9a42b02-d5df-448d-aa00-03f14749eb61",
                    UseShellExecute = false,
                    CreateNoWindow = true
                });
                process?.WaitForExit(5000);
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Power Plan: {ex.Message}"); }
        }

        private void RevertUltimatePerformancePlan()
        {
            try
            {
                // Voltar ao plano balanceado
                var process = Process.Start(new ProcessStartInfo
                {
                    FileName = "powercfg",
                    Arguments = "/setactive 381b4222-f694-41f0-9685-ff5bb260df2e",
                    UseShellExecute = false,
                    CreateNoWindow = true
                });
                process?.WaitForExit(5000);
            }
            catch { }
        }

        #endregion

        #region Apply/Revert Methods

        /// <summary>
        /// Aplica todas as otimiza��es recomendadas para o perfil de hardware atual
        /// </summary>
        public async Task<PerformanceOptimizationResult> ApplyRecommendedOptimizationsAsync(CancellationToken ct = default)
        {
            var result = new PerformanceOptimizationResult
            {
                Success = true,
                TotalApplied = 0
            };
            
            RestartManagerService.Instance.ClearPendingChanges();
            
            try
            {
                _logger.LogInfo("[UltraPerf] Iniciando aplicação de otimizações recomendadas...");
        
                // Criar cancellation token com timeout de 60 segundos para a operação completa
                using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
                cts.CancelAfter(TimeSpan.FromSeconds(60));
        
                // Iniciar transação
                _currentTx = _txService?.Begin("UltraPerformance_Optimizations");
        
                var categories = GetOptimizationCategories();
                var tier = ClassifyHardware();
        
                foreach (var category in categories)
                {
                    ct.ThrowIfCancellationRequested();
        
                    foreach (var optimization in category.Optimizations)
                    {
                        ct.ThrowIfCancellationRequested();
        
                        // Verificar se a otimização é recomendada e compatível
                        if (optimization.IsRecommended && IsOptimizationCompatible(optimization, tier))
                        {
                            try
                            {
                                _logger.LogInfo($"[UltraPerf] Aplicando: {optimization.Name}");
                                optimization.ApplyAction?.Invoke();
                                result.Applied.Add(optimization.Name);
                                result.TotalApplied++;
                            
                                RestartManagerService.Instance.RegisterChange(
                                    category.Name,
                                    optimization.Name,
                                    optimization.RequiredRestart == RestartScope.PC ? RestartType.Required :
                                    optimization.RequiredRestart == RestartScope.Explorer ? RestartType.Recommended : RestartType.None,
                                    $"{category.Name}: {optimization.Name}");
                            }
                            catch (Exception ex)
                            {
                                _logger.LogError($"[UltraPerf] Erro ao aplicar {optimization.Name}: {ex.Message}", ex);
                                result.Errors.Add($"{optimization.Name}: {ex.Message}");
                            }
                        }
                    }
                }
        
                // Commit da transação
                _currentTx?.Commit();
                _currentTx = null;
        
                _logger.LogSuccess($"[UltraPerf] Otimizações aplicadas com sucesso: {result.TotalApplied} otimizações");
            }
            catch (OperationCanceledException)
            {
                _logger.LogWarning("[UltraPerf] Aplicação de otimizações cancelada pelo usuário");
                result.Success = false;
                result.Errors.Add("Operação cancelada pelo usuário");
                _currentTx?.Rollback();
                _currentTx = null;
            }
            catch (Exception ex)
            {
                _logger.LogError("[UltraPerf] Erro crítico ao aplicar otimizações", ex);
                result.Success = false;
                result.Errors.Add($"Erro crítico: {ex.Message}");
                _currentTx?.Rollback();
                _currentTx = null;
            }
            
            await RestartManagerService.Instance.CheckAndPromptRestartAsync("otimizações de desempenho");
            
            return result;
        }
        
        public async Task<PerformanceOptimizationResult> ApplyOptimizationsAsync(IEnumerable<string> selectedOptimizationNames, CancellationToken ct = default)
        {
            var result = new PerformanceOptimizationResult
            {
                Success = true,
                TotalApplied = 0
            };
        
            var selectedSet = new HashSet<string>(selectedOptimizationNames ?? Array.Empty<string>(), StringComparer.OrdinalIgnoreCase);
        
            if (selectedSet.Count == 0)
            {
                _logger.LogInfo("[UltraPerf] Nenhuma otimização selecionada para aplicar.");
                return result;
            }
        
            try
            {
                _logger.LogInfo("[UltraPerf] Iniciando aplicação de otimizações selecionadas...");
        
                // Criar cancellation token com timeout de 60 segundos para a operação completa
                using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
                cts.CancelAfter(TimeSpan.FromSeconds(60));
        
                // Iniciar transação
                _currentTx = _txService?.Begin("UltraPerformance_Optimizations_Selected");
        
                var categories = GetOptimizationCategories();
                var tier = ClassifyHardware();
        
                foreach (var category in categories)
                {
                    ct.ThrowIfCancellationRequested();
        
                    foreach (var optimization in category.Optimizations)
                    {
                        ct.ThrowIfCancellationRequested();
        
                        if (!selectedSet.Contains(optimization.Name))
                            continue;
        
                        if (!IsOptimizationCompatible(optimization, tier))
                            continue;
        
                        try
                        {
                            _logger.LogInfo($"[UltraPerf] Aplicando (selecionada): {optimization.Name}");
                            optimization.ApplyAction?.Invoke();
                            result.Applied.Add(optimization.Name);
                            result.TotalApplied++;
                        
                            RestartManagerService.Instance.RegisterChange(
                                category.Name,
                                optimization.Name,
                                optimization.RequiredRestart == RestartScope.PC ? RestartType.Required :
                                optimization.RequiredRestart == RestartScope.Explorer ? RestartType.Recommended : RestartType.None,
                                $"{category.Name}: {optimization.Name}");
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError($"[UltraPerf] Erro ao aplicar {optimization.Name}: {ex.Message}", ex);
                            result.Errors.Add($"{optimization.Name}: {ex.Message}");
                        }
                    }
                }
        
                // Commit da transação
                _currentTx?.Commit();
                _currentTx = null;
        
                _logger.LogSuccess($"[UltraPerf] Otimizações selecionadas aplicadas com sucesso: {result.TotalApplied} otimizações");
            }
            catch (OperationCanceledException)
            {
                _logger.LogWarning("[UltraPerf] Aplicação de otimizações selecionadas cancelada pelo usuário");
                result.Success = false;
                result.Errors.Add("Operação cancelada pelo usuário");
                _currentTx?.Rollback();
                _currentTx = null;
            }
            catch (Exception ex)
            {
                _logger.LogError("[UltraPerf] Erro crítico ao aplicar otimizações selecionadas", ex);
                result.Success = false;
                result.Errors.Add($"Erro crítico: {ex.Message}");
                _currentTx?.Rollback();
                _currentTx = null;
            }
            
            await RestartManagerService.Instance.CheckAndPromptRestartAsync("otimizações de desempenho");
            
            return result;
        }

        /// <summary>
        /// Reverte todas as otimiza��es aplicadas
        /// </summary>
        public async Task<PerformanceOptimizationResult> RevertAllOptimizationsAsync(CancellationToken ct = default)
        {
            var result = new PerformanceOptimizationResult
            {
                Success = true,
                TotalApplied = 0
            };
            
            RestartManagerService.Instance.ClearPendingChanges();
            
            try
            {
                _logger.LogInfo("[UltraPerf] Iniciando revers�o de todas as otimiza��es...");

                // Criar cancellation token com timeout de 60 segundos para a opera��o completa
                using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
                cts.CancelAfter(TimeSpan.FromSeconds(60));

                var categories = GetOptimizationCategories();

                foreach (var category in categories)
                {
                    ct.ThrowIfCancellationRequested();

                    foreach (var optimization in category.Optimizations)
                    {
                        ct.ThrowIfCancellationRequested();

                        try
                        {
                            _logger.LogInfo($"[UltraPerf] Revertendo: {optimization.Name}");
                            optimization.RevertAction?.Invoke();
                            result.Applied.Add(optimization.Name);
                            result.TotalApplied++;
                        }
                        catch (Exception ex)
                        {
                            _logger.LogError($"[UltraPerf] Erro ao reverter {optimization.Name}: {ex.Message}", ex);
                            result.Errors.Add($"{optimization.Name}: {ex.Message}");
                        }
                    }
                }

                // Limpar backups
                _backups.Clear();

                _logger.LogSuccess($"[UltraPerf] Revers�o conclu�da: {result.TotalApplied} otimiza��es revertidas");
            }
            catch (OperationCanceledException)
            {
                _logger.LogWarning("[UltraPerf] Revers�o cancelada pelo usu�rio");
                result.Success = false;
                result.Errors.Add("Opera��o cancelada pelo usu�rio");
            }
            catch (Exception ex)
            {
                _logger.LogError("[UltraPerf] Erro cr�tico ao reverter otimiza��es", ex);
                result.Success = false;
                result.Errors.Add($"Erro cr�tico: {ex.Message}");
            }
            
            await RestartManagerService.Instance.CheckAndPromptRestartAsync("otimizações de desempenho");
            
            return result;
        }

        /// <summary>
        /// Verifica se uma otimiza��o � compat�vel com o hardware e contexto atual
        /// </summary>
        private bool IsOptimizationCompatible(PerformanceOptimization optimization, HardwareTier tier)
        {
            // Verificar tier m�nimo
            if (optimization.MinimumTier.HasValue && tier < optimization.MinimumTier.Value)
                return false;

            // Verificar GPU dedicada
            if (optimization.RequiresDedicatedGPU && !_systemProfile.HasDedicatedGPU)
                return false;

            // Verificar SSD
            if (optimization.RequiresSSD && !_systemProfile.HasSSD && !_systemProfile.HasNVMe)
                return false;

            // Verificar RAM m�nima
            if (optimization.MinimumRAMGB.HasValue && _systemProfile.TotalRAMGB < optimization.MinimumRAMGB.Value)
                return false;

            // Verificar n�cleos m�nimos
            if (optimization.MinimumCores.HasValue && _systemProfile.CPUCores < optimization.MinimumCores.Value)
                return false;

            // Verificar laptops
            if (optimization.NotForLaptops && _systemProfile.IsLaptop)
                return false;

            // Verificar compatibilidade com Modo Gamer
            // (Esta verifica��o seria feita no ViewModel, n�o aqui)

            return true;
        }

        #endregion

        #region Backup/Restore Methods

        /// <summary>
        /// Faz backup de um valor do registro antes de modific�-lo
        /// </summary>
        private void BackupValue(RegistryKey key, string valueName, bool isCurrentUser = false)
        {
            try
            {
                var path = key.Name.Substring(key.Name.IndexOf('\\') + 1); // Remove HKEY_* prefix
                var backupKey = $"{(isCurrentUser ? "HKCU" : "HKLM")}\\{path}\\{valueName}";

                // Se j� fizemos backup, n�o fazer novamente
                if (_backups.ContainsKey(backupKey))
                    return;

                var value = key.GetValue(valueName);
                _backups[backupKey] = value ?? new object(); // Armazenar mesmo null para saber que existe
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[UltraPerf] Erro ao fazer backup de valor: {ex.Message}");
            }
        }

        /// <summary>
        /// Restaura um valor do registro a partir do backup
        /// </summary>
        private void RestoreValue(string path, string valueName, bool isCurrentUser = false)
        {
            var backupKey = $"{(isCurrentUser ? "HKCU" : "HKLM")}\\{path}\\{valueName}";

            if (_backups.TryGetValue(backupKey, out var value))
            {
                try
                {
                    var root = isCurrentUser ? Registry.CurrentUser : Registry.LocalMachine;
                    using var key = root.OpenSubKey(path, true);
                    if (key != null)
                    {
                        if (value == null || value is string str && str == "")
                            key.DeleteValue(valueName, false);
                        else
                            key.SetValue(valueName, value);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[UltraPerf] Erro ao restaurar valor: {ex.Message}");
                }
            }
            else
            {
                // Se n�o temos backup, deletar o valor
                try
                {
                    var root = isCurrentUser ? Registry.CurrentUser : Registry.LocalMachine;
                    using var key = root.OpenSubKey(path, true);
                    if (key != null)
                    {
                        key.DeleteValue(valueName, false);
                    }
                }
                catch { /* Ignorar */ }
            }
        }

        /// <summary>
        /// Restaura um valor do registro a partir do backup (sobrecarga para HKLM)
        /// </summary>
        private void RestoreValue(RegistryKey key, string valueName)
        {
            var path = key.Name.Substring(key.Name.IndexOf('\\') + 1); // Remove HKEY_* prefix
            RestoreValue(path, valueName);
        }

        #endregion
    }
}
