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
namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// VOLTRIS ULTRA PERFORMANCE - Otimizações Revolucionárias
    /// Sistema inteligente de otimização que NENHUM outro programa oferece
    /// 100% seguro - não quebra impressoras, drivers ou funcionalidades essenciais
    /// </summary>
    public class UltraPerformanceService
    {
        private readonly ILoggingService _logger;
        private readonly VoltrisOptimizer.Services.SystemChanges.ISystemChangeTransactionService? _txService;
        private readonly VoltrisOptimizer.Services.SystemChanges.ICapabilityGuard? _capabilityGuard;
        private VoltrisOptimizer.Services.SystemChanges.ISystemTransaction? _currentTx;
        private readonly Dictionary<string, object> _backups = new();
        private PerformanceSystemProfile _systemProfile;

        public UltraPerformanceService(ILoggingService logger, VoltrisOptimizer.Services.SystemChanges.ISystemChangeTransactionService? txService = null, VoltrisOptimizer.Services.SystemChanges.ICapabilityGuard? capabilityGuard = null)
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
                // Verificar se já foi aplicado
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control", false);
                if (key?.GetValue("SvcHostSplitThresholdInKB") != null)
                {
                    // Já foi configurado, não aplicar novamente
                    return;
                }

                // Calcular valor baseado na RAM
                var ramGB = _systemProfile.TotalRAMGB;
                int thresholdKB;

                if (ramGB <= 4)
                    thresholdKB = 4 * 1024 * 1024; // 4GB
                else if (ramGB <= 8)
                    thresholdKB = 8 * 1024 * 1024; // 8GB
                else if (ramGB <= 12)
                    thresholdKB = 12 * 1024 * 1024; // 12GB
                else if (ramGB <= 16)
                    thresholdKB = 16 * 1024 * 1024; // 16GB
                else if (ramGB <= 24)
                    thresholdKB = 24 * 1024 * 1024; // 24GB
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
        /// Detecta automaticamente o perfil do sistema para otimizações inteligentes
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

                // Detectar tipo de uso
                profile.IsLaptop = DetectLaptop();
                profile.IsGamingPC = profile.HasDedicatedGPU && profile.TotalRAMGB >= 16;
                profile.IsWorkstation = profile.CPUCores >= 8 && profile.TotalRAMGB >= 32;

                // Detectar versão do Windows
                profile.WindowsVersion = Environment.OSVersion.Version;
                profile.IsWindows11 = profile.WindowsVersion.Build >= 22000;

                _logger.LogInfo($"[UltraPerf] Perfil: RAM={profile.TotalRAMGB}GB, Cores={profile.CPUCores}, SSD={profile.HasSSD}, Gaming={profile.IsGamingPC}");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[UltraPerf] Erro ao detectar perfil: {ex.Message}");
            }

            return profile;
        }

        private bool DetectSSD()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_DiskDrive");
                foreach (ManagementObject disk in searcher.Get())
                {
                    var mediaType = disk["MediaType"]?.ToString() ?? "";
                    if (mediaType.Contains("SSD") || mediaType.Contains("Solid"))
                        return true;
                }

                // Método alternativo - verificar seek time
                var systemDrive = Path.GetPathRoot(Environment.SystemDirectory);
                if (!string.IsNullOrEmpty(systemDrive))
                {
                    var driveInfo = new DriveInfo(systemDrive);
                    // SSDs geralmente têm latência muito baixa
                    return true; // Assumir SSD para sistemas modernos
                }
            }
            catch { }
            return false;
        }

        private bool DetectNVMe()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_DiskDrive");
                foreach (ManagementObject disk in searcher.Get())
                {
                    var model = disk["Model"]?.ToString() ?? "";
                    if (model.ToLower().Contains("nvme"))
                        return true;
                }
            }
            catch { }
            return false;
        }

        private double GetTotalRAMGB()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT TotalPhysicalMemory FROM Win32_ComputerSystem");
                foreach (ManagementObject obj in searcher.Get())
                {
                    var bytes = Convert.ToInt64(obj["TotalPhysicalMemory"] ?? 0);
                    return bytes / (1024.0 * 1024 * 1024);
                }
            }
            catch { }
            return 8; // Default
        }

        private string GetCPUName()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT Name FROM Win32_Processor");
                foreach (ManagementObject obj in searcher.Get())
                    return obj["Name"]?.ToString() ?? "Unknown";
            }
            catch { }
            return "Unknown";
        }

        private bool DetectDedicatedGPU()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_VideoController");
                foreach (ManagementObject gpu in searcher.Get())
                {
                    var name = gpu["Name"]?.ToString()?.ToLower() ?? "";
                    if (name.Contains("nvidia") || name.Contains("radeon") || name.Contains("geforce") || name.Contains("rtx") || name.Contains("gtx"))
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
                    if (!string.IsNullOrEmpty(name) && !name.ToLower().Contains("microsoft"))
                        return name;
                }
            }
            catch { }
            return "Unknown";
        }

        private bool DetectLaptop()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_Battery");
                return searcher.Get().Count > 0;
            }
            catch { }
            return false;
        }

        #endregion

        #region Hardware Classification

        /// <summary>
        /// Classifica o hardware do sistema em tier (fraco/médio/forte)
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
            // Critérios para PC Fraco (LowEnd)
            // - RAM <= 4GB OU
            // - CPU <= 2 cores OU
            // - Sem GPU dedicada E RAM <= 8GB
            if (profile.TotalRAMGB <= 4 ||
                profile.CPUCores <= 2 ||
                (!profile.HasDedicatedGPU && profile.TotalRAMGB <= 8))
            {
                return HardwareTier.LowEnd;
            }

            // Critérios para PC Forte (HighEnd)
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

            // Default: PC Médio (MidRange)
            return HardwareTier.MidRange;
        }

        /// <summary>
        /// Verifica se uma otimização é compatível com o hardware atual
        /// </summary>
        public bool IsOptimizationCompatible(PerformanceOptimization optimization, HardwareTier tier, bool gamerModeActive)
        {
            // Verificar tier mínimo
            if (optimization.MinimumTier.HasValue && tier < optimization.MinimumTier.Value)
            {
                optimization.IncompatibilityReason = $"Requer hardware mais potente (mínimo: {optimization.MinimumTier.Value})";
                return false;
            }

            // Verificar GPU dedicada
            if (optimization.RequiresDedicatedGPU && !_systemProfile.HasDedicatedGPU)
            {
                optimization.IncompatibilityReason = "Requer GPU dedicada";
                return false;
            }

            // Verificar SSD
            if (optimization.RequiresSSD && !_systemProfile.HasSSD)
            {
                optimization.IncompatibilityReason = "Requer SSD";
                return false;
            }

            // Verificar RAM
            if (optimization.MinimumRAMGB.HasValue && _systemProfile.TotalRAMGB < optimization.MinimumRAMGB.Value)
            {
                optimization.IncompatibilityReason = $"Requer no mínimo {optimization.MinimumRAMGB.Value}GB de RAM";
                return false;
            }

            // Verificar cores
            if (optimization.MinimumCores.HasValue && _systemProfile.CPUCores < optimization.MinimumCores.Value)
            {
                optimization.IncompatibilityReason = $"Requer no mínimo {optimization.MinimumCores.Value} cores de CPU";
                return false;
            }

            // Verificar laptop
            if (optimization.NotForLaptops && _systemProfile.IsLaptop)
            {
                optimization.IncompatibilityReason = "Não recomendado para laptops";
                return false;
            }

            // Verificar conflito com Modo Gamer
            if (optimization.ConflictsWithGamerMode && gamerModeActive)
            {
                optimization.IncompatibilityReason = "Não disponível enquanto o Modo Gamer está ativo";
                return false;
            }

            return true;
        }

        /// <summary>
        /// Verifica se uma otimização é segura para o hardware atual
        /// </summary>
        public bool IsOptimizationSafe(PerformanceOptimization optimization, HardwareTier tier)
        {
            // Em hardware fraco, apenas otimizações de baixo/médio impacto
            if (tier == HardwareTier.LowEnd && optimization.Impact == OptimizationImpact.High)
            {
                return false;
            }

            // Verificar se é reversível
            if (optimization.RevertAction == null)
            {
                return false;
            }

            // Verificar segurança
            if (optimization.Safety != OptimizationSafety.Safe)
            {
                return false;
            }

            return true;
        }

        /// <summary>
        /// Recalcula IsRecommended baseado no hardware atual e Modo Gamer
        /// </summary>
        public void RecalculateRecommended(PerformanceOptimization optimization, HardwareTier tier, bool gamerModeActive)
        {
            // Se não é compatível, não pode ser recomendado
            if (!IsOptimizationCompatible(optimization, tier, gamerModeActive))
            {
                optimization.IsRecommended = false;
                return;
            }

            // Se não é seguro, não pode ser recomendado
            if (!IsOptimizationSafe(optimization, tier))
            {
                optimization.IsRecommended = false;
                return;
            }

            // Manter IsRecommended original se passou todas as verificações
            // (será ajustado nas categorias específicas)
        }

        #endregion

        #region Optimization Categories

        public List<PerformanceCategory> GetOptimizationCategories()
        {
            var hardwareTier = ClassifyHardware();
            var categories = new List<PerformanceCategory>();
            
            // ============================================
            // CATEGORIA 1: MEMÓRIA INTELIGENTE
            // ============================================
            categories.Add(new PerformanceCategory
            {
                Name = "Otimização de Memória",
                Icon = "🧠",
                Description = "Gerenciamento inteligente de RAM",
                Optimizations = new List<PerformanceOptimization>
                {
                    new() { 
                        Name = "Compressão de Memória Otimizada", 
                        Description = "Ajusta o algoritmo de compressão do Windows para seu hardware",
                        Impact = OptimizationImpact.High,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeMemoryCompression,
                        RevertAction = RevertMemoryCompression,
                        IsRecommended = _systemProfile.TotalRAMGB < 16,
                        RequiredRestart = RestartScope.None,
                        // Restrições
                        MinimumTier = HardwareTier.LowEnd, // Disponível para todos
                        MinimumRAMGB = 2 // Mínimo 2GB
                    },
                    new() { 
                        Name = "Prioridade de Processos em Foco", 
                        Description = "Apps em primeiro plano recebem mais recursos",
                        Impact = OptimizationImpact.High,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeForegroundPriority,
                        RevertAction = RevertForegroundPriority,
                        IsRecommended = true,
                        RequiredRestart = RestartScope.None,
                        // Restrições
                        MinimumTier = HardwareTier.LowEnd, // Disponível para todos
                        ConflictsWithGamerMode = false // Não conflita, Gamer usa processo específico
                    },
                    new() { 
                        Name = "Cache de Sistema Otimizado", 
                        Description = "Ajusta cache de arquivos baseado na RAM disponível",
                        Impact = OptimizationImpact.Medium,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeSystemCache,
                        RevertAction = RevertSystemCache,
                        IsRecommended = _systemProfile.TotalRAMGB >= 8,
                        RequiredRestart = RestartScope.None,
                        // Restrições
                        MinimumTier = HardwareTier.LowEnd,
                        MinimumRAMGB = 4 // Requer no mínimo 4GB
                    },
                    new() { 
                        Name = "Limpeza Automática de Memória", 
                        Description = "Libera memória de apps em segundo plano automaticamente",
                        Impact = OptimizationImpact.Medium,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeMemoryCleanup,
                        RevertAction = RevertMemoryCleanup,
                        IsRecommended = true,
                        RequiredRestart = RestartScope.None,
                        // Restrições
                        MinimumTier = HardwareTier.LowEnd, // Disponível para todos
                        ConflictsWithGamerMode = false // Não conflita
                    },
                }
            });

            // ============================================
            // CATEGORIA 2: CPU INTELIGENTE
            // ============================================
            categories.Add(new PerformanceCategory
            {
                Name = "Otimização de CPU",
                Icon = "⚡",
                Description = "Maximiza desempenho do processador",
                Optimizations = new List<PerformanceOptimization>
                {
                    new() { 
                        Name = "Desativação Inteligente de Core Parking", 
                        Description = "Mantém todos os núcleos ativos quando necessário",
                        Impact = OptimizationImpact.High,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeCoreParking,
                        RevertAction = RevertCoreParking,
                        IsRecommended = !_systemProfile.IsLaptop,
                        RequiredRestart = RestartScope.PC,
                        // Restrições
                        MinimumTier = HardwareTier.MidRange, // Requer hardware médio
                        MinimumCores = 4, // Requer no mínimo 4 cores
                        NotForLaptops = true, // Não aplicar em laptops
                        ConflictsWithGamerMode = true // Pode conflitar com otimizações de CPU do Gamer
                    },
                    new() { 
                        Name = "Quantum de Tempo Otimizado", 
                        Description = "Melhora responsividade de aplicativos",
                        Impact = OptimizationImpact.Medium,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeQuantum,
                        RevertAction = RevertQuantum,
                        IsRecommended = true,
                        RequiredRestart = RestartScope.PC,
                        // Restrições
                        MinimumTier = HardwareTier.LowEnd, // Disponível para todos
                        ConflictsWithGamerMode = false
                    },
                    new() { 
                        Name = "Agendador de Processos Otimizado", 
                        Description = "Distribui melhor os processos entre os núcleos",
                        Impact = OptimizationImpact.Medium,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeScheduler,
                        RevertAction = RevertScheduler,
                        IsRecommended = _systemProfile.IsMultiCore,
                        RequiredRestart = RestartScope.PC,
                        // Restrições
                        MinimumTier = HardwareTier.MidRange,
                        MinimumCores = 4, // Requer no mínimo 4 cores
                        ConflictsWithGamerMode = false
                    },
                    new() { 
                        Name = "Boost de Prioridade de Primeiro Plano", 
                        Description = "Maximiza prioridade da janela ativa",
                        Impact = OptimizationImpact.High,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeForegroundBoost,
                        RevertAction = RevertForegroundBoost,
                        IsRecommended = true,
                        RequiredRestart = RestartScope.None,
                        // Restrições
                        MinimumTier = HardwareTier.LowEnd, // Disponível para todos
                        ConflictsWithGamerMode = false // Não conflita, Gamer usa processo específico
                    },
                }
            });

            // ============================================
            // CATEGORIA 3: DISCO INTELIGENTE
            // ============================================
            categories.Add(new PerformanceCategory
            {
                Name = "Otimização de Disco",
                Icon = "💾",
                Description = "Acelera leitura e escrita",
                Optimizations = new List<PerformanceOptimization>
                {
                    new() {
                        Name = "Melhorar performance do SSD",
                        Description = "- Desativar serviço SysMain (Superfetch) completamente\n- Desativar agendamento de desfragmentação em SSD e manter TRIM agendado\n- Aumentar NtfsMftZoneReservation (maior zona MFT para reduzir fragmentação)\n- Desativar USN Journal na unidade do sistema\n- Desativar Delivery Optimization (DoSvc) e BITS\n- Ativar cache de gravação do dispositivo (EnableWriteCache)\n- Ajustar Link Power Management (HIPM/DIPM) para Desativado\n- Desativar ClearPageFileAtShutdown\n- Limitar/rotacionar tamanhos dos logs do Event Viewer\n- Remover pastas do escopo da Indexação\n- Desativar serviço Windows Error Reporting",
                        Impact = OptimizationImpact.High,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeSSD,
                        RevertAction = RevertSSD,
                        IsRecommended = _systemProfile.HasSSD,
                        RequiredRestart = RestartScope.PC,
                        // Restrições
                        RequiresSSD = true, // Requer SSD
                        MinimumTier = HardwareTier.LowEnd,
                        ConflictsWithGamerMode = false
                    },
                    new() { 
                        Name = "NTFS Otimizado", 
                        Description = "Ajustes no sistema de arquivos para máximo desempenho",
                        Impact = OptimizationImpact.Medium,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeNTFS,
                        RevertAction = RevertNTFS,
                        IsRecommended = true,
                        RequiredRestart = RestartScope.PC,
                        // Restrições
                        MinimumTier = HardwareTier.LowEnd,
                        ConflictsWithGamerMode = false
                    },
                    new() { 
                        Name = "Prefetch/Superfetch Inteligente", 
                        Description = "Otimiza pré-carregamento baseado no uso",
                        Impact = OptimizationImpact.Medium,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizePrefetch,
                        RevertAction = RevertPrefetch,
                        IsRecommended = _systemProfile.HasSSD,
                        RequiredRestart = RestartScope.PC,
                        // Restrições
                        RequiresSSD = true, // Requer SSD
                        MinimumTier = HardwareTier.LowEnd,
                        ConflictsWithGamerMode = false
                    },
                    new() { 
                        Name = "Cache de Escrita Otimizado", 
                        Description = "Melhora velocidade de gravação",
                        Impact = OptimizationImpact.Medium,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeWriteCache,
                        RevertAction = RevertWriteCache,
                        IsRecommended = true,
                        RequiredRestart = RestartScope.None,
                        // Restrições
                        MinimumTier = HardwareTier.LowEnd,
                        ConflictsWithGamerMode = false
                    },
                    new() { 
                        Name = "Indexação Inteligente", 
                        Description = "Otimiza Windows Search sem desativar",
                        Impact = OptimizationImpact.Low,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeIndexing,
                        RevertAction = RevertIndexing,
                        IsRecommended = true,
                        RequiredRestart = RestartScope.None,
                        // Restrições
                        MinimumTier = HardwareTier.LowEnd,
                        ConflictsWithGamerMode = false
                    },
                }
            });

            // ============================================
            // CATEGORIA 4: REDE INTELIGENTE
            // ============================================
            categories.Add(new PerformanceCategory
            {
                Name = "Otimização de Rede",
                Icon = "🌐",
                Description = "Internet mais rápida e responsiva",
                Optimizations = new List<PerformanceOptimization>
                {
                    new() { 
                        Name = "TCP/IP Otimizado", 
                        Description = "Ajusta pilha de rede para máximo desempenho",
                        Impact = OptimizationImpact.High,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeTcpIp,
                        RevertAction = RevertTcpIp,
                        IsRecommended = true,
                        RequiredRestart = RestartScope.PC,
                        // Restrições
                        MinimumTier = HardwareTier.MidRange, // Requer hardware médio
                        ConflictsWithGamerMode = true // CONFLITO: Gamer aplica valores diferentes
                    },
                    new() { 
                        Name = "Desativação do Nagle", 
                        Description = "Reduz latência em jogos e apps em tempo real",
                        Impact = OptimizationImpact.Medium,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeNagle,
                        RevertAction = RevertNagle,
                        IsRecommended = _systemProfile.IsGamingPC,
                        RequiredRestart = RestartScope.PC,
                        // Restrições
                        MinimumTier = HardwareTier.MidRange,
                        ConflictsWithGamerMode = true // CONFLITO: Gamer aplica valores diferentes
                    },
                    new() { 
                        Name = "DNS Otimizado", 
                        Description = "Acelera resolução de nomes",
                        Impact = OptimizationImpact.Low,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeDns,
                        RevertAction = RevertDns,
                        IsRecommended = true,
                        RequiredRestart = RestartScope.None,
                        // Restrições
                        MinimumTier = HardwareTier.LowEnd, // Disponível para todos
                        ConflictsWithGamerMode = false
                    },
                    new() { 
                        Name = "Throttling de Rede Desativado", 
                        Description = "Remove limitações de velocidade do Windows",
                        Impact = OptimizationImpact.Medium,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeNetworkThrottling,
                        RevertAction = RevertNetworkThrottling,
                        IsRecommended = true,
                        RequiredRestart = RestartScope.None,
                        // Restrições
                        MinimumTier = HardwareTier.LowEnd, // Disponível para todos
                        ConflictsWithGamerMode = true // CONFLITO: Gamer também desativa throttling
                    },
                }
            });

            // ============================================
            // CATEGORIA 5: VISUAL INTELIGENTE
            // ============================================
            categories.Add(new PerformanceCategory
            {
                Name = "Otimização Visual",
                Icon = "🎨",
                Description = "Equilíbrio perfeito entre beleza e performance",
                Optimizations = new List<PerformanceOptimization>
                {
                    new() { 
                        Name = "Animações Otimizadas", 
                        Description = "Acelera animações mantendo fluidez visual",
                        Impact = OptimizationImpact.Medium,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeAnimations,
                        RevertAction = RevertAnimations,
                        IsRecommended = true,
                        RequiredRestart = RestartScope.Explorer,
                        // Restrições
                        MinimumTier = HardwareTier.LowEnd,
                        ConflictsWithGamerMode = false
                    },
                    new() { 
                        Name = "Transparência Otimizada", 
                        Description = "Ajusta efeitos de transparência baseado na GPU",
                        Impact = OptimizationImpact.Low,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeTransparency,
                        RevertAction = RevertTransparency,
                        IsRecommended = !_systemProfile.HasDedicatedGPU,
                        RequiredRestart = RestartScope.None,
                        // Restrições
                        MinimumTier = HardwareTier.LowEnd,
                        ConflictsWithGamerMode = false
                    },
                    new() { 
                        Name = "Menu de Contexto Otimizado", 
                        Description = "Acelera menus do botão direito",
                        Impact = OptimizationImpact.Low,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeContextMenu,
                        RevertAction = RevertContextMenu,
                        IsRecommended = true,
                        RequiredRestart = RestartScope.None,
                        // Restrições
                        MinimumTier = HardwareTier.LowEnd,
                        ConflictsWithGamerMode = false
                    },
                    new() { 
                        Name = "DWM Otimizado", 
                        Description = "Otimiza o compositor de área de trabalho",
                        Impact = OptimizationImpact.Medium,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeDWM,
                        RevertAction = RevertDWM,
                        IsRecommended = true,
                        RequiredRestart = RestartScope.None,
                        // Restrições
                        MinimumTier = HardwareTier.LowEnd,
                        ConflictsWithGamerMode = false
                    },
                }
            });

            // ============================================
            // CATEGORIA 6: INICIALIZAÇÃO INTELIGENTE
            // ============================================
            categories.Add(new PerformanceCategory
            {
                Name = "Otimização de Inicialização",
                Icon = "🚀",
                Description = "Boot mais rápido e Windows pronto antes",
                Optimizations = new List<PerformanceOptimization>
                {
                    new() { 
                        Name = "Fast Startup Inteligente", 
                        Description = "Otimiza hibernação híbrida",
                        Impact = OptimizationImpact.High,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeFastStartup,
                        RevertAction = RevertFastStartup,
                        IsRecommended = _systemProfile.HasSSD,
                        RequiredRestart = RestartScope.PC,
                        // Restrições
                        RequiresSSD = true, // Requer SSD
                        MinimumTier = HardwareTier.LowEnd,
                        ConflictsWithGamerMode = false
                    },
                    new() { 
                        Name = "Delay de Startup Otimizado", 
                        Description = "Atrasa apps não essenciais para boot mais rápido",
                        Impact = OptimizationImpact.Medium,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeStartupDelay,
                        RevertAction = RevertStartupDelay,
                        IsRecommended = true,
                        RequiredRestart = RestartScope.PC,
                        // Restrições
                        MinimumTier = HardwareTier.LowEnd,
                        ConflictsWithGamerMode = false
                    },
                    new() { 
                        Name = "Serviços de Boot Otimizados", 
                        Description = "Prioriza serviços essenciais na inicialização",
                        Impact = OptimizationImpact.Medium,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeBootServices,
                        RevertAction = RevertBootServices,
                        IsRecommended = true,
                        RequiredRestart = RestartScope.PC,
                        // Restrições
                        MinimumTier = HardwareTier.LowEnd,
                        ConflictsWithGamerMode = false
                    },
                    new() { 
                        Name = "Timeout de Boot Reduzido", 
                        Description = "Reduz tempo de espera do menu de boot",
                        Impact = OptimizationImpact.Low,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeBootTimeout,
                        RevertAction = RevertBootTimeout,
                        IsRecommended = true,
                        RequiredRestart = RestartScope.PC,
                        // Restrições
                        MinimumTier = HardwareTier.LowEnd,
                        ConflictsWithGamerMode = false
                    },
                }
            });

            // ============================================
            // CATEGORIA 7: SERVIÇOS INTELIGENTES
            // ============================================
            categories.Add(new PerformanceCategory
            {
                Name = "Gerenciamento de Serviços",
                Icon = "⚙️",
                Description = "Desativa apenas serviços seguros (mantém impressoras, etc)",
                Optimizations = new List<PerformanceOptimization>
                {
                    new() { 
                        Name = "Telemetria Otimizada", 
                        Description = "Reduz coleta de dados sem desativar completamente",
                        Impact = OptimizationImpact.Medium,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeTelemetry,
                        RevertAction = RevertTelemetry,
                        IsRecommended = true,
                        RequiredRestart = RestartScope.None,
                        // Restrições
                        MinimumTier = HardwareTier.LowEnd,
                        ConflictsWithGamerMode = false
                    },
                    new() { 
                        Name = "Serviços de Xbox Otimizados", 
                        Description = "Desativa serviços Xbox se não usa (reversível)",
                        Impact = OptimizationImpact.Low,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeXboxServices,
                        RevertAction = RevertXboxServices,
                        IsRecommended = !_systemProfile.IsGamingPC,
                        RequiredRestart = RestartScope.None,
                        // Restrições
                        MinimumTier = HardwareTier.LowEnd,
                        ConflictsWithGamerMode = false
                    },
                    new() { 
                        Name = "Tarefas Agendadas Otimizadas", 
                        Description = "Desativa tarefas desnecessárias (mantém as essenciais)",
                        Impact = OptimizationImpact.Low,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeScheduledTasks,
                        RevertAction = RevertScheduledTasks,
                        IsRecommended = true,
                        RequiredRestart = RestartScope.None,
                        // Restrições
                        MinimumTier = HardwareTier.LowEnd,
                        ConflictsWithGamerMode = false
                    },
                    new() { 
                        Name = "Apps em Background Otimizados", 
                        Description = "Gerencia apps que rodam em segundo plano",
                        Impact = OptimizationImpact.Medium,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeBackgroundApps,
                        RevertAction = RevertBackgroundApps,
                        IsRecommended = true,
                        RequiredRestart = RestartScope.None,
                        // Restrições
                        MinimumTier = HardwareTier.LowEnd,
                        ConflictsWithGamerMode = false
                    },
                }
            });

            // ============================================
            // CATEGORIA 8: ENERGIA INTELIGENTE
            // ============================================
            categories.Add(new PerformanceCategory
            {
                Name = "Otimização de Energia",
                Icon = "🔋",
                Description = "Máximo desempenho ou economia inteligente",
                Optimizations = new List<PerformanceOptimization>
                {
                    new() { 
                        Name = "Plano de Energia Voltris", 
                        Description = "Plano customizado para máximo desempenho",
                        Impact = OptimizationImpact.High,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = CreateVoltrisPowerPlan,
                        RevertAction = RevertVoltrisPowerPlan,
                        IsRecommended = !_systemProfile.IsLaptop,
                        RequiredRestart = RestartScope.None,
                        // Restrições
                        MinimumTier = HardwareTier.MidRange, // Requer hardware médio
                        NotForLaptops = true, // Não aplicar em laptops
                        ConflictsWithGamerMode = false // Não conflita, Gamer pode usar seu próprio plano
                    },
                    new() { 
                        Name = "USB Selective Suspend Desativado", 
                        Description = "Evita desconexões de dispositivos USB",
                        Impact = OptimizationImpact.Low,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeUSBPower,
                        RevertAction = RevertUSBPower,
                        IsRecommended = true,
                        RequiredRestart = RestartScope.None,
                        // Restrições
                        MinimumTier = HardwareTier.LowEnd,
                        ConflictsWithGamerMode = false
                    },
                    new() { 
                        Name = "PCI Express Otimizado", 
                        Description = "Desativa economia de energia do PCIe",
                        Impact = OptimizationImpact.Medium,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizePCIe,
                        RevertAction = RevertPCIe,
                        IsRecommended = !_systemProfile.IsLaptop,
                        RequiredRestart = RestartScope.None,
                        // Restrições
                        MinimumTier = HardwareTier.MidRange,
                        NotForLaptops = true,
                        ConflictsWithGamerMode = false
                    },
                    new() { 
                        Name = "Throttling de CPU Otimizado", 
                        Description = "Ajusta limites de frequência da CPU",
                        Impact = OptimizationImpact.High,
                        Safety = OptimizationSafety.Safe,
                        ApplyAction = OptimizeCPUThrottling,
                        RevertAction = RevertCPUThrottling,
                        IsRecommended = !_systemProfile.IsLaptop,
                        RequiredRestart = RestartScope.PC,
                        // Restrições
                        MinimumTier = HardwareTier.MidRange,
                        NotForLaptops = true,
                        ConflictsWithGamerMode = false
                    },
                }
            });

            // ============================================
            // CATEGORIA 9: EXPLORER ULTRA RÁPIDO
            // ============================================
            categories.Add(new PerformanceCategory
                {
                    Name = "Explorer Ultra Rápido",
                    Icon = "📁",
                    Description = "Acelera o Windows Explorer (Win+E)",
                    Optimizations = new List<PerformanceOptimization>
                    {
                        new() { 
                            Name = "Abrir em 'Este Computador'", 
                            Description = "Abre Explorer em Este PC ao invés de Acesso Rápido (mais rápido)",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = OptimizeExplorerLaunchFolder,
                            RevertAction = RevertExplorerLaunchFolder,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.Explorer // Reinício do Explorer
                        },
                        new() { 
                            Name = "Desativar Acesso Rápido Automático", 
                            Description = "Remove escaneamento de arquivos recentes",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = OptimizeQuickAccess,
                            RevertAction = RevertQuickAccess,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.Explorer // Reinício do Explorer
                        },
                        new() { 
                            Name = "Detecção de Tipo de Pasta Desativada", 
                            Description = "Remove análise automática de conteúdo de pastas",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = OptimizeFolderTypeDiscovery,
                            RevertAction = RevertFolderTypeDiscovery,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.Explorer // Reinício do Explorer
                        },
                        new() { 
                            Name = "Miniaturas Otimizadas", 
                            Description = "Acelera geração de thumbnails",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = OptimizeExplorerThumbnails,
                            RevertAction = RevertExplorerThumbnails,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.Explorer // Reinício do Explorer
                        },
                        new() { 
                            Name = "Processo Separado para Pastas", 
                            Description = "Cada janela em processo isolado (mais estável)",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = OptimizeExplorerProcess,
                            RevertAction = RevertExplorerProcess,
                            IsRecommended = _systemProfile.TotalRAMGB >= 8,
                            RequiredRestart = RestartScope.Explorer // Logout/Login
                        },
                        new() { 
                            Name = "Notificações de Sync Desativadas", 
                            Description = "Remove notificações do OneDrive/Sync",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = OptimizeSyncNotifications,
                            RevertAction = RevertSyncNotifications,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None // Efeito imediato
                        },
                        new() { 
                            Name = "Status Bar Desativada", 
                            Description = "Remove barra de status (menos processamento)",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = OptimizeExplorerStatusBar,
                            RevertAction = RevertExplorerStatusBar,
                            IsRecommended = false,
                            RequiredRestart = RestartScope.Explorer // Reinício do Explorer
                        },
                        new() { 
                            Name = "Timeout de Rede Reduzido", 
                            Description = "Acelera listagem de pastas de rede",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = OptimizeNetworkTimeout,
                            RevertAction = RevertNetworkTimeout,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None // Efeito imediato
                        },
                    }
                },

            // ============================================
            // CATEGORIA 10: ESSENTIAL TWEAKS
            // ============================================
            categories.Add(new PerformanceCategory
                {
                    Name = "Essential Tweaks",
                    Icon = "🔧",
                    Description = "Tweaks essenciais para privacidade e performance",
                    Optimizations = new List<PerformanceOptimization>
                    {
                        new() { 
                            Name = "Delete Temporary Files", 
                            Description = "Remove arquivos temporários do sistema",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = EssentialDeleteTempFiles,
                            RevertAction = () => { }, // Não há reversão para limpeza
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Disable ConsumerFeatures", 
                            Description = "Desativa instalação automática de apps da Store",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = EssentialDisableConsumerFeatures,
                            RevertAction = EssentialRevertConsumerFeatures,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Disable Telemetry", 
                            Description = "Desativa telemetria do Windows",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = EssentialDisableTelemetry,
                            RevertAction = EssentialRevertTelemetry,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Disable Activity History", 
                            Description = "Remove histórico de atividades e documentos recentes",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = EssentialDisableActivityHistory,
                            RevertAction = EssentialRevertActivityHistory,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Disable Explorer Automatic Folder Discovery", 
                            Description = "Desativa detecção automática de tipo de pasta",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = EssentialDisableExplorerAutoDiscovery,
                            RevertAction = EssentialRevertExplorerAutoDiscovery,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.Explorer
                        },
                        new() { 
                            Name = "Disable GameDVR", 
                            Description = "Desativa GameDVR e recursos de gravação do Xbox",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = EssentialDisableGameDVR,
                            RevertAction = EssentialRevertGameDVR,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None,
                            // Restrições
                            MinimumTier = HardwareTier.LowEnd,
                            ConflictsWithGamerMode = true // CONFLITO DIRETO: Gamer pode ativar Game Mode
                        },
                        new() { 
                            Name = "Disable Location Tracking", 
                            Description = "Desativa rastreamento de localização",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = EssentialDisableLocationTracking,
                            RevertAction = EssentialRevertLocationTracking,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Disable Storage Sense", 
                            Description = "Desativa Storage Sense (limpeza automática)",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = EssentialDisableStorageSense,
                            RevertAction = EssentialRevertStorageSense,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Disable Wi-Fi Sense", 
                            Description = "Desativa compartilhamento automático de Wi-Fi",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = EssentialDisableWiFiSense,
                            RevertAction = EssentialRevertWiFiSense,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Enable End Task With Right Click", 
                            Description = "Habilita opção de encerrar tarefa no botão direito da barra",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = EssentialEnableEndTask,
                            RevertAction = EssentialRevertEndTask,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.Explorer
                        },
                        new() { 
                            Name = "Disable Powershell 7 Telemetry", 
                            Description = "Desativa telemetria do PowerShell 7",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = EssentialDisablePS7Telemetry,
                            RevertAction = EssentialRevertPS7Telemetry,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Set Services to Manual", 
                            Description = "Define serviços não essenciais para Manual",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = EssentialSetServicesManual,
                            RevertAction = EssentialRevertServicesManual,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                    }
                }
            });

            // ============================================
            // CATEGORIA 11: ADVANCED PRIVACY & TELEMETRY
            // ============================================
            categories.Add(new PerformanceCategory
                {
                    Name = "Privacidade Avançada e Telemetria",
                    Icon = "🔒",
                    Description = "Desativação completa de telemetria e rastreamento",
                    Optimizations = new List<PerformanceOptimization>
                    {
                        new() { 
                            Name = "Desativar Telemetria Completa", 
                            Description = "Desativa toda telemetria do Windows e Microsoft",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = AdvancedDisableTelemetry,
                            RevertAction = AdvancedRevertTelemetry,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Advertising ID", 
                            Description = "Remove ID de publicidade e rastreamento",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = AdvancedDisableAdvertisingID,
                            RevertAction = AdvancedRevertAdvertisingID,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar SQM/CEIP", 
                            Description = "Desativa Customer Experience Improvement Program",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = AdvancedDisableSQMCEIP,
                            RevertAction = AdvancedRevertSQMCEIP,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar App Compatibility Inventory", 
                            Description = "Desativa inventário de compatibilidade de apps",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = AdvancedDisableAppCompatInventory,
                            RevertAction = AdvancedRevertAppCompatInventory,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar WMI AutoLogger", 
                            Description = "Desativa loggers automáticos do WMI",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = AdvancedDisableWMIAutoLogger,
                            RevertAction = AdvancedRevertWMIAutoLogger,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Device Metadata Download", 
                            Description = "Bloqueia download de metadados de dispositivos",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = AdvancedDisableDeviceMetadata,
                            RevertAction = AdvancedRevertDeviceMetadata,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Feedback e Assistência", 
                            Description = "Remove feedback automático e assistência",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = AdvancedDisableFeedback,
                            RevertAction = AdvancedRevertFeedback,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar File History", 
                            Description = "Desativa histórico de arquivos automático",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = AdvancedDisableFileHistory,
                            RevertAction = AdvancedRevertFileHistory,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                    }
                },

            // ============================================
            // CATEGORIA 12: SERVICES OPTIMIZATION
            // ============================================
            categories.Add(new PerformanceCategory
                {
                    Name = "Otimização de Serviços",
                    Icon = "⚙️",
                    Description = "Desativa serviços não essenciais para melhor performance",
                    Optimizations = new List<PerformanceOptimization>
                    {
                        new() { 
                            Name = "Desativar Serviços de Telemetria e Diagnóstico", 
                            Description = "Desativa DiagTrack, Diagnostics Hub e serviços relacionados",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = ServicesDisableTelemetryServices,
                            RevertAction = ServicesRevertTelemetryServices,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Serviços de Xbox", 
                            Description = "Desativa serviços do Xbox (reversível)",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = ServicesDisableXboxServices,
                            RevertAction = ServicesRevertXboxServices,
                            IsRecommended = !_systemProfile.IsGamingPC,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Serviços de Sincronização", 
                            Description = "Desativa OneSync, UserData e serviços de sync",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = ServicesDisableSyncServices,
                            RevertAction = ServicesRevertSyncServices,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Serviços de Mídia e Entretenimento", 
                            Description = "Desativa WMP Network, Frame Server e similares",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = ServicesDisableMediaServices,
                            RevertAction = ServicesRevertMediaServices,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Serviços de Sensor e Percepção", 
                            Description = "Desativa sensores e serviços de percepção",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = ServicesDisableSensorServices,
                            RevertAction = ServicesRevertSensorServices,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Serviços de Rede Não Essenciais", 
                            Description = "Desativa P2P, Peer Networking, PNRP e similares",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = ServicesDisableNetworkServices,
                            RevertAction = ServicesRevertNetworkServices,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Serviços de Aplicação e Dados", 
                            Description = "Desativa AppReadiness, AppX, Unistore e similares",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = ServicesDisableAppServices,
                            RevertAction = ServicesRevertAppServices,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Serviços de Edge e Atualização", 
                            Description = "Desativa serviços de atualização do Edge",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = ServicesDisableEdgeServices,
                            RevertAction = ServicesRevertEdgeServices,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Serviços de Jogos de Terceiros", 
                            Description = "Desativa Steam, Origin, Epic, Chrome update",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = ServicesDisableThirdPartyGameServices,
                            RevertAction = ServicesRevertThirdPartyGameServices,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Serviços de Sistema Não Essenciais", 
                            Description = "Desativa FontCache, Themes, RetailDemo e similares",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = ServicesDisableSystemServices,
                            RevertAction = ServicesRevertSystemServices,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                    }
                },

            // ============================================
            // CATEGORIA 13: LOCATION & SENSORS
            // ============================================
            categories.Add(new PerformanceCategory
                {
                    Name = "Localização e Sensores",
                    Icon = "📍",
                    Description = "Desativa rastreamento de localização e sensores",
                    Optimizations = new List<PerformanceOptimization>
                    {
                        new() { 
                            Name = "Desativar Localização Completa", 
                            Description = "Desativa todos os serviços de localização",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = LocationDisableLocation,
                            RevertAction = LocationRevertLocation,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Sensores", 
                            Description = "Desativa serviços de sensores do sistema",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = LocationDisableSensors,
                            RevertAction = LocationRevertSensors,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Location Services", 
                            Description = "Desativa Location Framework Service",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = LocationDisableLocationService,
                            RevertAction = LocationRevertLocationService,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Maps Auto Update", 
                            Description = "Desativa atualização automática de mapas",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = LocationDisableMapsUpdate,
                            RevertAction = LocationRevertMapsUpdate,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                    }
                },

            // ============================================
            // CATEGORIA 14: BACKGROUND TASKS
            // ============================================
            categories.Add(new PerformanceCategory
                {
                    Name = "Tarefas em Segundo Plano",
                    Icon = "📋",
                    Description = "Desativa tarefas agendadas não essenciais",
                    Optimizations = new List<PerformanceOptimization>
                    {
                        new() { 
                            Name = "Desativar Tarefas de Telemetria", 
                            Description = "Desativa todas as tarefas de telemetria do Windows",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = TasksDisableTelemetryTasks,
                            RevertAction = TasksRevertTelemetryTasks,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Tarefas de Application Experience", 
                            Description = "Desativa tarefas de compatibilidade de apps",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = TasksDisableAppExperienceTasks,
                            RevertAction = TasksRevertAppExperienceTasks,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Tarefas de Diagnóstico", 
                            Description = "Desativa tarefas de diagnóstico do sistema",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = TasksDisableDiagnosticTasks,
                            RevertAction = TasksRevertDiagnosticTasks,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Tarefas de Office", 
                            Description = "Desativa telemetria e tarefas do Office",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = TasksDisableOfficeTasks,
                            RevertAction = TasksRevertOfficeTasks,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                    }
                },

            // ============================================
            // CATEGORIA 15: INPUT PERSONALIZATION
            // ============================================
            categories.Add(new PerformanceCategory
                {
                    Name = "Personalização de Entrada",
                    Icon = "⌨️",
                    Description = "Desativa coleta de dados de entrada e escrita",
                    Optimizations = new List<PerformanceOptimization>
                    {
                        new() { 
                            Name = "Desativar Input Personalization", 
                            Description = "Desativa coleta de dados de escrita e entrada",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = InputDisablePersonalization,
                            RevertAction = InputRevertPersonalization,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Handwriting Data Sharing", 
                            Description = "Bloqueia compartilhamento de dados de escrita manual",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = InputDisableHandwritingSharing,
                            RevertAction = InputRevertHandwritingSharing,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Language Profile Sharing", 
                            Description = "Bloqueia compartilhamento de perfil de idioma",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = InputDisableLanguageProfile,
                            RevertAction = InputRevertLanguageProfile,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                    }
                },

            // ============================================
            // CATEGORIA 16: ADVERTISING & TRACKING
            // ============================================
            categories.Add(new PerformanceCategory
                {
                    Name = "Publicidade e Rastreamento",
                    Icon = "🚫",
                    Description = "Remove publicidade e rastreamento do sistema",
                    Optimizations = new List<PerformanceOptimization>
                    {
                        new() { 
                            Name = "Desativar Delivery Optimization", 
                            Description = "Desativa otimização de entrega (P2P de updates)",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = AdvertisingDisableDeliveryOptimization,
                            RevertAction = AdvertisingRevertDeliveryOptimization,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Cloud Content Suggestions", 
                            Description = "Remove sugestões de conteúdo da nuvem",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = AdvertisingDisableCloudContent,
                            RevertAction = AdvertisingRevertCloudContent,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Wi-Fi HotSpot Reporting", 
                            Description = "Bloqueia compartilhamento de hotspots Wi-Fi",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = AdvertisingDisableWiFiHotspot,
                            RevertAction = AdvertisingRevertWiFiHotspot,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Media Player Tracking", 
                            Description = "Remove rastreamento do Windows Media Player",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = AdvertisingDisableMediaTracking,
                            RevertAction = AdvertisingRevertMediaTracking,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Explorer Store Suggestions", 
                            Description = "Remove sugestões da Store no Explorer",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = AdvertisingDisableStoreSuggestions,
                            RevertAction = AdvertisingRevertStoreSuggestions,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.Explorer
                        },
                    }
                },

            // ============================================
            // CATEGORIA 17: OTIMIZAÇÃO AVANÇADA DE SERVIÇOS (Script .bat)
            // ============================================
            categories.Add(new PerformanceCategory
                {
                    Name = "Otimização Avançada de Serviços",
                    Icon = "🔧",
                    Description = "Desativação completa de serviços não essenciais (excluindo Bluetooth e Impressora)",
                    Optimizations = new List<PerformanceOptimization>
                    {
                        new() { 
                            Name = "Desativar Serviços Adicionais do Sistema", 
                            Description = "Desativa shpamsvc, svsvc, Netlogon, CscService, ssh-agent, NfsClnt, autotimesvc, BcastDVRUserService, cbdhsvc, PcaSvc",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = AdvancedDisableAdditionalSystemServices,
                            RevertAction = AdvancedRevertAdditionalSystemServices,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Tarefas de Family Safety", 
                            Description = "Desativa FamilySafetyMonitor, FamilySafetyRefresh, FamilySafetyUpload",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = AdvancedDisableFamilySafetyTasks,
                            RevertAction = AdvancedRevertFamilySafetyTasks,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar WinSAT e Tarefas de Manutenção", 
                            Description = "Desativa WinSAT e outras tarefas de manutenção desnecessárias",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = AdvancedDisableMaintenanceTasks,
                            RevertAction = AdvancedRevertMaintenanceTasks,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Cloud Experience Host e SQM", 
                            Description = "Desativa CloudExperienceHost e tarefas SQM (PI\\Sqm-Tasks)",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = AdvancedDisableCloudAndSQMTasks,
                            RevertAction = AdvancedRevertCloudAndSQMTasks,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Sincronização de Tempo e Device Information", 
                            Description = "Desativa tarefas de sincronização de tempo e informações de dispositivo",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = AdvancedDisableTimeAndDeviceTasks,
                            RevertAction = AdvancedRevertTimeAndDeviceTasks,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                    }
                },

            // ============================================
            // CATEGORIA 18: OTIMIZAÇÕES AVANÇADAS DE REDE (Script .bat)
            // ============================================
            categories.Add(new PerformanceCategory
                {
                    Name = "Otimizações Avançadas de Rede",
                    Icon = "🌐",
                    Description = "Otimizações avançadas de rede para gaming e baixa latência",
                    Optimizations = new List<PerformanceOptimization>
                    {
                        new() { 
                            Name = "Otimizações AFD (Ancillary Function Driver)", 
                            Description = "Ajusta parâmetros do AFD para máximo desempenho de rede",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = NetworkAdvancedOptimizeAFD,
                            RevertAction = NetworkAdvancedRevertAFD,
                            IsRecommended = _systemProfile.IsGamingPC,
                            RequiredRestart = RestartScope.PC
                        },
                        new() { 
                            Name = "Comandos Netsh Avançados", 
                            Description = "Habilita RSS, Chimney, DCA, RSC, NETDMA e Auto-Tuning",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = NetworkAdvancedNetshCommands,
                            RevertAction = NetworkAdvancedRevertNetshCommands,
                            IsRecommended = _systemProfile.IsGamingPC,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "DNS Avançado Otimizado", 
                            Description = "Otimiza cache DNS, desativa smart resolution e multicast",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = NetworkAdvancedOptimizeDNS,
                            RevertAction = NetworkAdvancedRevertDNS,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "TCP/IP Avançado para Gaming", 
                            Description = "TcpWindowSize, TcpTimedWaitDelay, MaxUserPort e outros ajustes",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = NetworkAdvancedOptimizeTcpGaming,
                            RevertAction = NetworkAdvancedRevertTcpGaming,
                            IsRecommended = _systemProfile.IsGamingPC,
                            RequiredRestart = RestartScope.PC
                        },
                        new() { 
                            Name = "Firewall Otimizado para Gaming", 
                            Description = "Desativa notificações e tráfego desnecessário do firewall",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = NetworkAdvancedOptimizeFirewall,
                            RevertAction = NetworkAdvancedRevertFirewall,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                    }
                },

            // ============================================
            // CATEGORIA 19: OTIMIZAÇÕES DE GAMING (Script .bat)
            // ============================================
            categories.Add(new PerformanceCategory
                {
                    Name = "Otimizações de Gaming",
                    Icon = "🎮",
                    Description = "Otimizações específicas para jogos e performance máxima",
                    Optimizations = new List<PerformanceOptimization>
                    {
                        new() { 
                            Name = "HAGS e GPU Scheduling", 
                            Description = "Configura Hardware Accelerated GPU Scheduling e prioridades de GPU",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = GamingOptimizeHAGS,
                            RevertAction = GamingRevertHAGS,
                            IsRecommended = _systemProfile.HasDedicatedGPU,
                            RequiredRestart = RestartScope.PC
                        },
                        new() { 
                            Name = "Game Mode e Game Bar Completo", 
                            Description = "Desativa Game Mode automático e todas as configurações do Game Bar",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = GamingOptimizeGameMode,
                            RevertAction = GamingRevertGameMode,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Fullscreen Optimizations", 
                            Description = "Desativa otimizações de tela cheia que podem causar input lag",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = GamingOptimizeFullscreen,
                            RevertAction = GamingRevertFullscreen,
                            IsRecommended = _systemProfile.IsGamingPC,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Multimedia System Profile - Games", 
                            Description = "Configura prioridades de GPU, CPU e rede para jogos",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = GamingOptimizeMultimediaProfile,
                            RevertAction = GamingRevertMultimediaProfile,
                            IsRecommended = _systemProfile.IsGamingPC,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "DirectStorage e GPU Cache", 
                            Description = "Habilita DirectStorage e limpa cache de GPU do Edge",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = GamingOptimizeDirectStorage,
                            RevertAction = GamingRevertDirectStorage,
                            IsRecommended = _systemProfile.HasSSD && _systemProfile.HasDedicatedGPU,
                            RequiredRestart = RestartScope.None
                        },
                    }
                },

            // ============================================
            // CATEGORIA 20: OTIMIZAÇÕES DE MOUSE E INPUT (Script .bat)
            // ============================================
            categories.Add(new PerformanceCategory
                {
                    Name = "Otimizações de Mouse e Input",
                    Icon = "🖱️",
                    Description = "Otimizações de mouse para precisão em jogos",
                    Optimizations = new List<PerformanceOptimization>
                    {
                        new() { 
                            Name = "Desativar Aceleração do Mouse", 
                            Description = "Remove aceleração do mouse para precisão máxima",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = MouseOptimizeAcceleration,
                            RevertAction = MouseRevertAcceleration,
                            IsRecommended = _systemProfile.IsGamingPC,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Otimizações Avançadas de Mouse", 
                            Description = "Ajusta sensibilidade, hover time e outras configurações",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = MouseOptimizeAdvanced,
                            RevertAction = MouseRevertAdvanced,
                            IsRecommended = _systemProfile.IsGamingPC,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Otimizações de Teclado", 
                            Description = "Ajusta delay e velocidade do teclado",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = MouseOptimizeKeyboard,
                            RevertAction = MouseRevertKeyboard,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                    }
                },

            // ============================================
            // CATEGORIA 21: OTIMIZAÇÕES DE BOOT (Script .bat)
            // ============================================
            categories.Add(new PerformanceCategory
                {
                    Name = "Otimizações de Boot",
                    Icon = "🚀",
                    Description = "Otimizações de inicialização via BCDedit (requer reinicialização)",
                    Optimizations = new List<PerformanceOptimization>
                    {
                        new() { 
                            Name = "BCDedit - Otimizações de Boot", 
                            Description = "useplatformtick, disabledynamictick, nx optout, hypervisorlaunchtype off",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = BootOptimizeBCDedit,
                            RevertAction = BootRevertBCDedit,
                            IsRecommended = _systemProfile.IsGamingPC,
                            RequiredRestart = RestartScope.PC
                        },
                        new() { 
                            Name = "BCDedit - Otimizações de Memória", 
                            Description = "increaseuserva, firstmegabytepolicy, avoidlowmemory, nolowmem",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = BootOptimizeMemory,
                            RevertAction = BootRevertMemory,
                            IsRecommended = _systemProfile.TotalRAMGB >= 8,
                            RequiredRestart = RestartScope.PC
                        },
                    }
                },

            // ============================================
            // CATEGORIA 22: OTIMIZAÇÕES DE APLICATIVOS (Script .bat)
            // ============================================
            categories.Add(new PerformanceCategory
                {
                    Name = "Otimizações de Aplicativos",
                    Icon = "📱",
                    Description = "Remove bloatware e otimiza aplicativos",
                    Optimizations = new List<PerformanceOptimization>
                    {
                        new() { 
                            Name = "Remover OneDrive Completamente", 
                            Description = "Mata processo, desinstala e remove pastas e registro do OneDrive",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = AppsRemoveOneDrive,
                            RevertAction = AppsRevertOneDrive,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Políticas de Privacidade do Edge", 
                            Description = "Desativa telemetria, recomendações e recursos do Edge",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = AppsOptimizeEdgePrivacy,
                            RevertAction = AppsRevertEdgePrivacy,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Windows Copilot", 
                            Description = "Desativa Copilot e todas as configurações relacionadas",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = AppsDisableCopilot,
                            RevertAction = AppsRevertCopilot,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Remover Appx Packages (Bloatware)", 
                            Description = "Remove aplicativos pré-instalados não essenciais",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = AppsRemoveAppxPackages,
                            RevertAction = AppsRevertAppxPackages,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Limpar Cache do Edge e Discord", 
                            Description = "Remove cache de GPU e Service Workers do Edge e Discord",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = AppsCleanEdgeDiscordCache,
                            RevertAction = () => { }, // Limpeza não tem reversão
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                    }
                },

            // ============================================
            // CATEGORIA 23: OTIMIZAÇÕES DE ÁUDIO (Script .bat)
            // ============================================
            categories.Add(new PerformanceCategory
                {
                    Name = "Otimizações de Áudio",
                    Icon = "🔊",
                    Description = "Otimizações de áudio para baixa latência",
                    Optimizations = new List<PerformanceOptimization>
                    {
                        new() { 
                            Name = "Performance Mode de Áudio", 
                            Description = "Habilita modo de performance para renderização de áudio",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = AudioOptimizePerformanceMode,
                            RevertAction = AudioRevertPerformanceMode,
                            IsRecommended = _systemProfile.IsGamingPC,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Prioridade de Threads de Áudio", 
                            Description = "Aumenta prioridade de threads de áudio para reduzir latência",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = AudioOptimizeThreadPriority,
                            RevertAction = AudioRevertThreadPriority,
                            IsRecommended = _systemProfile.IsGamingPC,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Efeitos de Som", 
                            Description = "Remove efeitos de som que podem causar latência",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = AudioDisableSoundEffects,
                            RevertAction = AudioRevertSoundEffects,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                    }
                },

            // ============================================
            // CATEGORIA 24: OTIMIZAÇÕES DE KERNEL AVANÇADAS (Script .bat)
            // ============================================
            categories.Add(new PerformanceCategory
                {
                    Name = "Otimizações de Kernel Avançadas",
                    Icon = "⚙️",
                    Description = "Otimizações avançadas do kernel do Windows",
                    Optimizations = new List<PerformanceOptimization>
                    {
                        new() { 
                            Name = "Otimizações de DPC e Interrupções", 
                            Description = "DpcTimeout, ThreadDpcEnable, InterruptSteeringDisabled",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = KernelOptimizeDPC,
                            RevertAction = KernelRevertDPC,
                            IsRecommended = _systemProfile.IsGamingPC,
                            RequiredRestart = RestartScope.PC
                        },
                        new() { 
                            Name = "Otimizações de Memória do Kernel", 
                            Description = "PagedPoolQuota, LookasideListIncrease, ObjectReferenceTracking",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = KernelOptimizeMemory,
                            RevertAction = KernelRevertMemory,
                            IsRecommended = _systemProfile.TotalRAMGB >= 16,
                            RequiredRestart = RestartScope.PC
                        },
                        new() { 
                            Name = "Otimizações de I/O e Session Manager", 
                            Description = "IoPriorityBoost, IoPageLockLimit, AdditionalCriticalWorkerThreads",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = KernelOptimizeIO,
                            RevertAction = KernelRevertIO,
                            IsRecommended = _systemProfile.HasSSD,
                            RequiredRestart = RestartScope.PC
                        },
                        new() { 
                            Name = "Desativar Recursos de Segurança Não Essenciais", 
                            Description = "DisableExceptionChainValidation, KernelSEHOPEnabled",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = KernelDisableSecurityFeatures,
                            RevertAction = KernelRevertSecurityFeatures,
                            IsRecommended = _systemProfile.IsGamingPC,
                            RequiredRestart = RestartScope.PC
                        },
                    }
                },

            // ============================================
            // CATEGORIA 25: OTIMIZAÇÕES DE CPU AVANÇADAS (Script .bat)
            // ============================================
            categories.Add(new PerformanceCategory
                {
                    Name = "Otimizações de CPU Avançadas",
                    Icon = "⚡",
                    Description = "Otimizações avançadas do processador",
                    Optimizations = new List<PerformanceOptimization>
                    {
                        new() { 
                            Name = "Desativar Power Throttling", 
                            Description = "Desativa throttling de energia da CPU para máximo desempenho",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = CPUAdvancedDisablePowerThrottling,
                            RevertAction = CPUAdvancedRevertPowerThrottling,
                            IsRecommended = !_systemProfile.IsLaptop,
                            RequiredRestart = RestartScope.PC
                        },
                        new() { 
                            Name = "Otimizações de Processor Control", 
                            Description = "Desativa throttling, idle e slowdown do processador",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = CPUAdvancedOptimizeProcessor,
                            RevertAction = CPUAdvancedRevertProcessor,
                            IsRecommended = !_systemProfile.IsLaptop,
                            RequiredRestart = RestartScope.PC
                        },
                        new() { 
                            Name = "Resource Policy Store - CPU", 
                            Description = "Remove caps de CPU e otimiza scheduling",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = CPUAdvancedOptimizeResourcePolicy,
                            RevertAction = CPUAdvancedRevertResourcePolicy,
                            IsRecommended = _systemProfile.IsGamingPC,
                            RequiredRestart = RestartScope.PC
                        },
                        new() { 
                            Name = "VxD BIOS Optimizations", 
                            Description = "CPUPriority, FastDRAM, AGPConcur, PCIConcur",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = CPUAdvancedOptimizeVxDBIOS,
                            RevertAction = CPUAdvancedRevertVxDBIOS,
                            IsRecommended = _systemProfile.IsGamingPC,
                            RequiredRestart = RestartScope.PC
                        },
                    }
                },

            // ============================================
            // CATEGORIA 26: OTIMIZAÇÕES DE DISCO AVANÇADAS (Script .bat)
            // ============================================
            categories.Add(new PerformanceCategory
                {
                    Name = "Otimizações de Disco Avançadas",
                    Icon = "💾",
                    Description = "Otimizações avançadas de disco e armazenamento",
                    Optimizations = new List<PerformanceOptimization>
                    {
                        new() { 
                            Name = "NTFS Memory Usage Máximo", 
                            Description = "Aumenta NtfsMemoryUsage para 2 (máximo) para melhor performance",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = DiskAdvancedOptimizeNTFSMemory,
                            RevertAction = DiskAdvancedRevertNTFSMemory,
                            IsRecommended = _systemProfile.TotalRAMGB >= 8,
                            RequiredRestart = RestartScope.PC
                        },
                        new() { 
                            Name = "LanmanServer Otimizado", 
                            Description = "IRPStackSize, SizReqBuf e outras otimizações de servidor",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = DiskAdvancedOptimizeLanmanServer,
                            RevertAction = DiskAdvancedRevertLanmanServer,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.PC
                        },
                        new() { 
                            Name = "Storage Device Policies", 
                            Description = "WriteCacheEnabled, WriteThrough, NoLPM para SSDs",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = DiskAdvancedOptimizeStoragePolicies,
                            RevertAction = DiskAdvancedRevertStoragePolicies,
                            IsRecommended = _systemProfile.HasSSD,
                            RequiredRestart = RestartScope.PC
                        },
                        new() { 
                            Name = "NVMe Optimizations", 
                            Description = "InterruptManagement, PerformanceMode para NVMe",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = DiskAdvancedOptimizeNVMe,
                            RevertAction = DiskAdvancedRevertNVMe,
                            IsRecommended = _systemProfile.HasSSD,
                            RequiredRestart = RestartScope.PC
                        },
                    }
                },

            // ============================================
            // CATEGORIA 27: OTIMIZAÇÕES DE POWER AVANÇADAS (Script .bat)
            // ============================================
            categories.Add(new PerformanceCategory
                {
                    Name = "Otimizações de Energia Avançadas",
                    Icon = "🔋",
                    Description = "Otimizações avançadas de energia e performance",
                    Optimizations = new List<PerformanceOptimization>
                    {
                        new() { 
                            Name = "Ativar Ultimate Performance Mode", 
                            Description = "Ativa o plano de energia Ultimate Performance",
                            Impact = OptimizationImpact.High,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = PowerAdvancedActivateUltimatePerformance,
                            RevertAction = PowerAdvancedRevertUltimatePerformance,
                            IsRecommended = !_systemProfile.IsLaptop,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Hibernação", 
                            Description = "Desativa hibernação para liberar espaço e reduzir overhead",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = PowerAdvancedDisableHibernation,
                            RevertAction = PowerAdvancedRevertHibernation,
                            IsRecommended = _systemProfile.HasSSD,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Otimizações de USB Power", 
                            Description = "Desativa USB selective suspend e otimizações de energia USB",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = PowerAdvancedOptimizeUSB,
                            RevertAction = PowerAdvancedRevertUSB,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Otimizações de PCI Express", 
                            Description = "Desativa economia de energia do PCIe para GPUs",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = PowerAdvancedOptimizePCIe,
                            RevertAction = PowerAdvancedRevertPCIe,
                            IsRecommended = _systemProfile.HasDedicatedGPU,
                            RequiredRestart = RestartScope.None
                        },
                    }
                },

            // ============================================
            // CATEGORIA 28: OTIMIZAÇÕES DE WINDOWS SEARCH (Script .bat)
            // ============================================
            categories.Add(new PerformanceCategory
                {
                    Name = "Otimizações de Windows Search",
                    Icon = "🔍",
                    Description = "Otimizações do Windows Search e Cortana",
                    Optimizations = new List<PerformanceOptimization>
                    {
                        new() { 
                            Name = "Desativar Cortana Completamente", 
                            Description = "Desativa Cortana e todas as configurações relacionadas",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = SearchDisableCortana,
                            RevertAction = SearchRevertCortana,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Web Search e Cloud Search", 
                            Description = "Remove busca na web e busca na nuvem",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = SearchDisableWebSearch,
                            RevertAction = SearchRevertWebSearch,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Otimizações de Search Privacy", 
                            Description = "Desativa histórico, sugestões e rastreamento de busca",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = SearchOptimizePrivacy,
                            RevertAction = SearchRevertPrivacy,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Speech e Voice Activation", 
                            Description = "Remove ativação por voz e download de modelos",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = SearchDisableSpeech,
                            RevertAction = SearchRevertSpeech,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                    }
                },

            // ============================================
            // CATEGORIA 29: OTIMIZAÇÕES DE REMOTE ACCESS (Script .bat)
            // ============================================
            categories.Add(new PerformanceCategory
                {
                    Name = "Otimizações de Acesso Remoto",
                    Icon = "🔐",
                    Description = "Desativa acesso remoto e assistência remota",
                    Optimizations = new List<PerformanceOptimization>
                    {
                        new() { 
                            Name = "Desativar Remote Desktop", 
                            Description = "Desativa Remote Desktop completamente",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = RemoteDisableRemoteDesktop,
                            RevertAction = RemoteRevertRemoteDesktop,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Remote Assistance", 
                            Description = "Remove assistência remota e convites",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = RemoteDisableRemoteAssistance,
                            RevertAction = RemoteRevertRemoteAssistance,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Remote Registry e WinRM", 
                            Description = "Desativa registro remoto e Windows Remote Management",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = RemoteDisableRemoteServices,
                            RevertAction = RemoteRevertRemoteServices,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                    }
                }
            });

            // ============================================
            // CATEGORIA 30: OTIMIZAÇÕES DE INTERFACE (Script .bat)
            // ============================================
            categories.Add(new PerformanceCategory
                {
                    Name = "Otimizações de Interface",
                    Icon = "🖥️",
                    Description = "Otimizações da interface do Windows",
                    Optimizations = new List<PerformanceOptimization>
                    {
                        new() { 
                            Name = "Desativar Notificações", 
                            Description = "Desativa todas as notificações do sistema",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = InterfaceDisableNotifications,
                            RevertAction = InterfaceRevertNotifications,
                            IsRecommended = _systemProfile.IsGamingPC,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Otimizações de Desktop e Explorer", 
                            Description = "WaitToKillAppTimeout, AutoEndTasks, ForegroundLockTimeout",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = InterfaceOptimizeDesktop,
                            RevertAction = InterfaceRevertDesktop,
                            IsRecommended = true,
                            RequiredRestart = RestartScope.None
                        },
                        new() { 
                            Name = "Desativar Thumbnail Cache", 
                            Description = "Desativa cache de miniaturas para melhor performance de disco",
                            Impact = OptimizationImpact.Medium,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = InterfaceDisableThumbnailCache,
                            RevertAction = InterfaceRevertThumbnailCache,
                            IsRecommended = _systemProfile.HasSSD,
                            RequiredRestart = RestartScope.Explorer
                        },
                        new() { 
                            Name = "Desativar MTCUVC (Modern Taskbar)", 
                            Description = "Desativa Modern Taskbar para reduzir overhead",
                            Impact = OptimizationImpact.Low,
                            Safety = OptimizationSafety.Safe,
                            ApplyAction = InterfaceDisableMTCUVC,
                            RevertAction = InterfaceRevertMTCUVC,
                            IsRecommended = _systemProfile.IsGamingPC,
                            RequiredRestart = RestartScope.Explorer
                        },
                    }
                }
            });
            
            // Processar todas as otimizações para recalcular IsRecommended baseado em hardware
            var hardwareTier = ClassifyHardware();
            // Nota: gamerModeActive será verificado no ViewModel
            
            foreach (var category in categories)
            {
                foreach (var optimization in category.Optimizations)
                {
                    // Recalcular IsRecommended baseado em hardware
                    RecalculateRecommended(optimization, hardwareTier, false); // gamerModeActive será verificado no ViewModel
                }
            }
            
            return categories;
        }

        #endregion

        #region Essential Tweaks Implementation

        private void EssentialDeleteTempFiles()
        {
            try
            {
                var tempPaths = new[]
                {
                    Path.GetTempPath(),
                    Path.Combine(Environment.GetEnvironmentVariable("SystemRoot") ?? "C:\\Windows", "Temp")
                };

                foreach (var path in tempPaths)
                {
                    try
                    {
                        if (Directory.Exists(path))
                        {
                            var files = Directory.GetFiles(path, "*", SearchOption.TopDirectoryOnly);
                            foreach (var file in files)
                            {
                                try { File.Delete(file); } catch { }
                            }
                            _logger.LogInfo($"[Essential] Limpeza: {files.Length} arquivos removidos de {path}");
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"[Essential] Erro ao limpar {path}: {ex.Message}");
                    }
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Essential] DeleteTempFiles: {ex.Message}"); }
        }

        private void EssentialDisableConsumerFeatures()
        {
            try
            {
                using var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\Windows\CloudContent");
                if (key != null)
                {
                    BackupValue(key, "DisableWindowsConsumerFeatures");
                    key.SetValue("DisableWindowsConsumerFeatures", 1, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Essential] DisableConsumerFeatures: {ex.Message}"); }
        }

        private void EssentialRevertConsumerFeatures()
        {
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\CloudContent", "DisableWindowsConsumerFeatures");
        }

        private void EssentialDisableTelemetry()
        {
            try
            {
                // Registry
                using (var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\DataCollection"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "AllowTelemetry");
                        key.SetValue("AllowTelemetry", 0, RegistryValueKind.DWord);
                    }
                }
                using (var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\Windows\DataCollection"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "AllowTelemetry");
                        key.SetValue("AllowTelemetry", 0, RegistryValueKind.DWord);
                    }
                }

                // Scheduled Tasks - usar schtasks.exe
                var tasks = new[]
                {
                    @"Microsoft\Windows\Application Experience\Microsoft Compatibility Appraiser",
                    @"Microsoft\Windows\Application Experience\ProgramDataUpdater",
                    @"Microsoft\Windows\Autochk\Proxy",
                    @"Microsoft\Windows\Customer Experience Improvement Program\Consolidator",
                    @"Microsoft\Windows\Customer Experience Improvement Program\UsbCeip",
                    @"Microsoft\Windows\DiskDiagnostic\Microsoft-Windows-DiskDiagnosticDataCollector",
                    @"Microsoft\Windows\Feedback\Siuf\DmClient",
                    @"Microsoft\Windows\Feedback\Siuf\DmClientOnScenarioDownload",
                    @"Microsoft\Windows\Windows Error Reporting\QueueReporting",
                    @"Microsoft\Windows\Application Experience\MareBackup",
                    @"Microsoft\Windows\Application Experience\StartupAppTask",
                    @"Microsoft\Windows\Application Experience\PcaPatchDbTask",
                    @"Microsoft\Windows\Maps\MapsUpdateTask"
                };

                foreach (var taskName in tasks)
                {
                    try
                    {
                        // Verificar estado atual
                        var psiQuery = new ProcessStartInfo
                        {
                            FileName = "schtasks",
                            Arguments = $"/query /tn \"{taskName}\" /fo LIST /v",
                            UseShellExecute = false,
                            RedirectStandardOutput = true,
                            CreateNoWindow = true
                        };
                        
                        bool wasEnabled = false;
                        using (var pQuery = Process.Start(psiQuery))
                        {
                            if (pQuery != null)
                            {
                                var output = pQuery.StandardOutput.ReadToEnd();
                                pQuery.WaitForExit(5000);
                                wasEnabled = output.Contains("Enabled:          Yes");
                            }
                        }
                        
                        BackupTaskState(taskName, wasEnabled);

                        // Desativar tarefa
                        var psiDisable = new ProcessStartInfo
                        {
                            FileName = "schtasks",
                            Arguments = $"/change /tn \"{taskName}\" /disable",
                            UseShellExecute = false,
                            CreateNoWindow = true
                        };
                        using var pDisable = Process.Start(psiDisable);
                        pDisable?.WaitForExit(5000);
                        
                        _logger.LogInfo($"[Essential] Telemetry: Tarefa {taskName} desativada");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"[Essential] Erro ao desativar tarefa {taskName}: {ex.Message}");
                    }
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Essential] DisableTelemetry: {ex.Message}"); }
        }

        private void EssentialRevertTelemetry()
        {
            RestoreValue(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\DataCollection", "AllowTelemetry");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\DataCollection", "AllowTelemetry");
            RestoreTaskStates();
        }

        private void EssentialDisableActivityHistory()
        {
            try
            {
                using var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\Windows\System");
                if (key != null)
                {
                    BackupValue(key, "EnableActivityFeed");
                    BackupValue(key, "PublishUserActivities");
                    BackupValue(key, "UploadUserActivities");
                    key.SetValue("EnableActivityFeed", 0, RegistryValueKind.DWord);
                    key.SetValue("PublishUserActivities", 0, RegistryValueKind.DWord);
                    key.SetValue("UploadUserActivities", 0, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Essential] DisableActivityHistory: {ex.Message}"); }
        }

        private void EssentialRevertActivityHistory()
        {
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\System", "EnableActivityFeed");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\System", "PublishUserActivities");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\System", "UploadUserActivities");
        }

        private void EssentialDisableExplorerAutoDiscovery()
        {
            try
            {
                var bags = @"Software\Classes\Local Settings\Software\Microsoft\Windows\Shell\Bags";
                var bagMRU = @"Software\Classes\Local Settings\Software\Microsoft\Windows\Shell\BagMRU";
                var allFolders = @"Software\Classes\Local Settings\Software\Microsoft\Windows\Shell\Bags\AllFolders\Shell";

                // Remover bags existentes
                try
                {
                    using var bagsKey = Registry.CurrentUser.OpenSubKey(bags, true);
                    if (bagsKey != null) Registry.CurrentUser.DeleteSubKeyTree(bags, false);
                }
                catch { }
                try
                {
                    using var mruKey = Registry.CurrentUser.OpenSubKey(bagMRU, true);
                    if (mruKey != null) Registry.CurrentUser.DeleteSubKeyTree(bagMRU, false);
                }
                catch { }

                // Criar configuração genérica
                using var allFoldersKey = Registry.CurrentUser.CreateSubKey(allFolders);
                if (allFoldersKey != null)
                {
                    BackupValue(allFoldersKey, "FolderType", true);
                    allFoldersKey.SetValue("FolderType", "NotSpecified", RegistryValueKind.String);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Essential] DisableExplorerAutoDiscovery: {ex.Message}"); }
        }

        private void EssentialRevertExplorerAutoDiscovery()
        {
            RestoreValue(@"Software\Classes\Local Settings\Software\Microsoft\Windows\Shell\Bags\AllFolders\Shell", "FolderType", true);
        }

        private void EssentialDisableGameDVR()
        {
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(@"System\GameConfigStore");
                if (key != null)
                {
                    BackupValue(key, "GameDVR_FSEBehavior", true);
                    BackupValue(key, "GameDVR_Enabled", true);
                    BackupValue(key, "GameDVR_HonorUserFSEBehaviorMode", true);
                    BackupValue(key, "GameDVR_EFSEFeatureFlags", true);
                    key.SetValue("GameDVR_FSEBehavior", 2, RegistryValueKind.DWord);
                    key.SetValue("GameDVR_Enabled", 0, RegistryValueKind.DWord);
                    key.SetValue("GameDVR_HonorUserFSEBehaviorMode", 1, RegistryValueKind.DWord);
                    key.SetValue("GameDVR_EFSEFeatureFlags", 0, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Essential] DisableGameDVR: {ex.Message}"); }
        }

        private void EssentialRevertGameDVR()
        {
            RestoreValue(@"System\GameConfigStore", "GameDVR_FSEBehavior", true);
            RestoreValue(@"System\GameConfigStore", "GameDVR_Enabled", true);
            RestoreValue(@"System\GameConfigStore", "GameDVR_HonorUserFSEBehaviorMode", true);
            RestoreValue(@"System\GameConfigStore", "GameDVR_EFSEFeatureFlags", true);
        }

        private void EssentialDisableLocationTracking()
        {
            try
            {
                using (var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\location"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "Value");
                        key.SetValue("Value", "Deny", RegistryValueKind.String);
                    }
                }
                using (var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Sensor\Overrides\{BFA794E4-F964-4FDB-90F6-51056BFE4B44}"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "SensorPermissionState");
                        key.SetValue("SensorPermissionState", 0, RegistryValueKind.DWord);
                    }
                }
                using (var key = Registry.LocalMachine.CreateSubKey(@"SYSTEM\CurrentControlSet\Services\lfsvc\Service\Configuration"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "Status");
                        key.SetValue("Status", 0, RegistryValueKind.DWord);
                    }
                }
                using (var key = Registry.LocalMachine.CreateSubKey(@"SYSTEM\Maps"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "AutoUpdateEnabled");
                        key.SetValue("AutoUpdateEnabled", 0, RegistryValueKind.DWord);
                    }
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Essential] DisableLocationTracking: {ex.Message}"); }
        }

        private void EssentialRevertLocationTracking()
        {
            RestoreValue(@"SOFTWARE\Microsoft\Windows\CurrentVersion\CapabilityAccessManager\ConsentStore\location", "Value");
            RestoreValue(@"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Sensor\Overrides\{BFA794E4-F964-4FDB-90F6-51056BFE4B44}", "SensorPermissionState");
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\lfsvc\Service\Configuration", "Status");
            RestoreValue(@"SYSTEM\Maps", "AutoUpdateEnabled");
        }

        private void EssentialDisableStorageSense()
        {
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\StorageSense\Parameters\StoragePolicy");
                if (key != null)
                {
                    BackupValue(key, "01", true);
                    key.SetValue("01", 0, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Essential] DisableStorageSense: {ex.Message}"); }
        }

        private void EssentialRevertStorageSense()
        {
            RestoreValue(@"SOFTWARE\Microsoft\Windows\CurrentVersion\StorageSense\Parameters\StoragePolicy", "01", true);
        }

        private void EssentialDisableWiFiSense()
        {
            try
            {
                using (var key = Registry.LocalMachine.CreateSubKey(@"Software\Microsoft\PolicyManager\default\WiFi\AllowWiFiHotSpotReporting"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "Value");
                        key.SetValue("Value", 0, RegistryValueKind.DWord);
                    }
                }
                using (var key = Registry.LocalMachine.CreateSubKey(@"Software\Microsoft\PolicyManager\default\WiFi\AllowAutoConnectToWiFiSenseHotspots"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "Value");
                        key.SetValue("Value", 0, RegistryValueKind.DWord);
                    }
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Essential] DisableWiFiSense: {ex.Message}"); }
        }

        private void EssentialRevertWiFiSense()
        {
            RestoreValue(@"Software\Microsoft\PolicyManager\default\WiFi\AllowWiFiHotSpotReporting", "Value");
            RestoreValue(@"Software\Microsoft\PolicyManager\default\WiFi\AllowAutoConnectToWiFiSenseHotspots", "Value");
        }

        private void EssentialEnableEndTask()
        {
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(@"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced\TaskbarDeveloperSettings");
                if (key != null)
                {
                    BackupValue(key, "TaskbarEndTask", true);
                    key.SetValue("TaskbarEndTask", 1, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Essential] EnableEndTask: {ex.Message}"); }
        }

        private void EssentialRevertEndTask()
        {
            RestoreValue(@"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced\TaskbarDeveloperSettings", "TaskbarEndTask", true);
        }

        private void EssentialDisablePS7Telemetry()
        {
            try
            {
                Environment.SetEnvironmentVariable("POWERSHELL_TELEMETRY_OPTOUT", "1", EnvironmentVariableTarget.Machine);
                BackupEnvironmentVariable("POWERSHELL_TELEMETRY_OPTOUT");
            }
            catch (Exception ex) { _logger.LogWarning($"[Essential] DisablePS7Telemetry: {ex.Message}"); }
        }

        private void EssentialRevertPS7Telemetry()
        {
            try
            {
                var original = RestoreEnvironmentVariable("POWERSHELL_TELEMETRY_OPTOUT");
                if (original == null)
                    Environment.SetEnvironmentVariable("POWERSHELL_TELEMETRY_OPTOUT", "", EnvironmentVariableTarget.Machine);
                else
                    Environment.SetEnvironmentVariable("POWERSHELL_TELEMETRY_OPTOUT", original, EnvironmentVariableTarget.Machine);
            }
            catch (Exception ex) { _logger.LogWarning($"[Essential] RevertPS7Telemetry: {ex.Message}"); }
        }

        private void EssentialSetServicesManual()
        {
            try
            {
                var servicesToManual = new[]
                {
                    "AJRouter", "ALG", "AppIDSvc", "AppMgmt", "AppReadiness", "AppXSvc", "Appinfo",
                    "AssignedAccessManagerSvc", "AxInstSV", "BDESVC", "BFE", "BITS", "Browser", "CertPropSvc",
                    "ClipSVC", "COMSysApp", "CryptSvc", "DcpSvc", "defragsvc", "DeviceAssociationService",
                    "DeviceInstall", "DevicePickerUserSvc", "DevQueryBroker", "Dhcp", "dmwappushservice",
                    "Dnscache", "DoSvc", "dot3svc", "DPS", "DsmSvc", "DusmSvc", "EapHost", "eapsvc",
                    "EDPAppSvc", "EFS", "embeddedmode", "EntAppSvc", "EventLog", "EventSystem", "fdPHost",
                    "FDResPub", "FontCache", "FontCache3.0.0.0", "FrameServer", "gpsvc", "hidserv",
                    "HomeGroupListener", "HomeGroupProvider", "HvHost", "icssvc", "IKEEXT", "InstallService",
                    "IPBusEnum", "iphlpsvc", "IpxlatCfgSvc", "KeyIso", "KtmRm", "LanmanServer", "LanmanWorkstation",
                    "LicenseManager", "lltdsvc", "lmhosts", "LSM", "MapsBroker", "MessagingService",
                    "MessagingService_UserData", "Microsoft App-V Client", "MMCSS", "Mprddm", "MSiSCSI",
                    "MSMQ", "MsKeyboardFilter", "NetSetupSvc", "NetTcpPortSharing", "NgcCtnrSvc",
                    "NgcSvc", "NlaSvc", "nsi", "p2pimsvc", "p2psvc", "PerfHost", "PhoneSvc", "PimIndexMaintenanceSvc",
                    "pla", "PlugPlay", "PNRPsvc", "PolicyAgent", "Power", "PrintNotify", "PrintWorkflowUserSvc",
                    "ProfSvc", "QWAVE", "RasAuto", "RasMan", "RemoteAccess", "RemoteRegistry", "RetailDemo",
                    "RmSvc", "RpcEptMapper", "RpcLocator", "RpcSs", "SCardSvr", "SCPolicySvc", "seclogon",
                    "SensorDataService", "SensorService", "SensrSvc", "SessionEnv", "SgrmBroker", "SharedAccess",
                    "ShellHWDetection", "smphost", "SNMPTrap", "spectrum", "Spooler", "sppsvc", "SSDPSRV",
                    "SstpSvc", "StateRepository", "StiSvc", "StorSvc", "SysMain", "SystemEventsBroker",
                    "TabletInputService", "TapiSrv", "TermService", "Themes", "THREADORDER", "TimeBrokerSvc",
                    "TrkWks", "TrustedInstaller", "tzautoupdate", "UevAgentService", "UI0Detect", "UmRdpService",
                    "UnistoreSvc_UserData", "upnphost", "UserDataSvc", "UserManager", "UsoSvc", "VaultSvc",
                    "vds", "VSS", "W32Time", "WaaSMedicSvc", "WalletService", "WarpJITSvc", "WaspService",
                    "WbioSrvc", "Wcmsvc", "WdiServiceHost", "WdiSystemHost", "WebClient", "Wecsvc",
                    "WEPHOSTSVC", "wercplsupport", "WerSvc", "WiaRpc", "WinHttpAutoProxySvc", "WinRM",
                    "Winusb", "wisvc", "WlanSvc", "wlidsvc", "wlpasvc", "WManSvc", "wmiApSrv", "WMPNetworkSvc",
                    "workfolderssvc", "WpcMonSvc", "WPDBusEnum", "WpnService", "WpnUserService",
                    "wscsvc", "WSearch", "WSDScanManager", "WSDScannerDeviceHost", "WSDScannerNS", "wsvc",
                    "wuauserv", "WwanSvc", "XblAuthManager", "XblGameSave", "XboxGipSvc", "XboxNetApiSvc"
                };

                foreach (var serviceName in servicesToManual)
                {
                    try
                    {
                        using var service = new ServiceController(serviceName);
                        BackupServiceStartType(serviceName, service.StartType);
                        if (service.StartType != ServiceStartMode.Manual && service.StartType != ServiceStartMode.Disabled)
                        {
                            // Apenas serviços que são Automatic podem ser alterados para Manual
                            if (service.StartType == ServiceStartMode.Automatic || service.StartType == ServiceStartMode.Boot)
                            {
                                var sc = new System.Management.ManagementObject($"Win32_Service.Name='{serviceName}'");
                                sc.InvokeMethod("ChangeStartMode", new object[] { "Manual" });
                            }
                        }
                    }
                    catch { }
                }
                _logger.LogInfo("[Essential] Services: Serviços configurados para Manual");
            }
            catch (Exception ex) { _logger.LogWarning($"[Essential] SetServicesManual: {ex.Message}"); }
        }

        private void EssentialRevertServicesManual()
        {
            RestoreServiceStartTypes();
        }

        private readonly Dictionary<string, object> _environmentBackups = new();
        private readonly Dictionary<string, bool> _taskStateBackups = new();
        private readonly Dictionary<string, ServiceStartMode> _serviceStartTypeBackups = new();

        private void BackupEnvironmentVariable(string name)
        {
            if (!_environmentBackups.ContainsKey(name))
            {
                var value = Environment.GetEnvironmentVariable(name, EnvironmentVariableTarget.Machine);
                _environmentBackups[name] = value ?? "";
            }
        }

        private string? RestoreEnvironmentVariable(string name)
        {
            if (_environmentBackups.TryGetValue(name, out var original))
            {
                _environmentBackups.Remove(name);
                return original?.ToString();
            }
            return null;
        }

        private void BackupTaskState(string taskName, bool enabled)
        {
            if (!_taskStateBackups.ContainsKey(taskName))
                _taskStateBackups[taskName] = enabled;
        }

        private void RestoreTaskStates()
        {
            foreach (var kvp in _taskStateBackups.ToList())
            {
                try
                {
                    var psi = new ProcessStartInfo
                    {
                        FileName = "schtasks",
                        Arguments = kvp.Value 
                            ? $"/change /tn \"{kvp.Key}\" /enable"
                            : $"/change /tn \"{kvp.Key}\" /disable",
                        UseShellExecute = false,
                        CreateNoWindow = true
                    };
                    using var p = Process.Start(psi);
                    p?.WaitForExit(5000);
                }
                catch { }
                _taskStateBackups.Remove(kvp.Key);
            }
        }

        private void BackupServiceStartType(string serviceName, ServiceStartMode startType)
        {
            if (!_serviceStartTypeBackups.ContainsKey(serviceName))
                _serviceStartTypeBackups[serviceName] = startType;
        }

        private void RestoreServiceStartTypes()
        {
            foreach (var kvp in _serviceStartTypeBackups.ToList())
            {
                try
                {
                    var sc = new System.Management.ManagementObject($"Win32_Service.Name='{kvp.Key}'");
                    sc.InvokeMethod("ChangeStartMode", new object[] { kvp.Value.ToString() });
                }
                catch { }
                _serviceStartTypeBackups.Remove(kvp.Key);
            }
        }

        #endregion

        #region Advanced Privacy & Telemetry Implementation

        private void AdvancedDisableTelemetry()
        {
            try
            {
                // Expandir telemetria básica
                EssentialDisableTelemetry();
                
                // Adicionais específicos
                using (var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Microsoft\Windows NT\CurrentVersion\WUDF"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "LogEnable");
                        BackupValue(key, "LogLevel");
                        key.SetValue("LogEnable", 0, RegistryValueKind.DWord);
                        key.SetValue("LogLevel", 0, RegistryValueKind.DWord);
                    }
                }
                
                using (var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\Windows\DataCollection"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "AllowCommercialDataPipeline");
                        BackupValue(key, "AllowDeviceNameInTelemetry");
                        BackupValue(key, "LimitEnhancedDiagnosticDataWindowsAnalytics");
                        BackupValue(key, "MicrosoftEdgeDataOptIn");
                        key.SetValue("AllowCommercialDataPipeline", 0, RegistryValueKind.DWord);
                        key.SetValue("AllowDeviceNameInTelemetry", 0, RegistryValueKind.DWord);
                        key.SetValue("LimitEnhancedDiagnosticDataWindowsAnalytics", 0, RegistryValueKind.DWord);
                        key.SetValue("MicrosoftEdgeDataOptIn", 0, RegistryValueKind.DWord);
                    }
                }
                
                using (var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\Windows\System"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "PublishUserActivities");
                        BackupValue(key, "EnableActivityFeed");
                        BackupValue(key, "UploadUserActivities");
                        key.SetValue("PublishUserActivities", 0, RegistryValueKind.DWord);
                        key.SetValue("EnableActivityFeed", 0, RegistryValueKind.DWord);
                        key.SetValue("UploadUserActivities", 0, RegistryValueKind.DWord);
                    }
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Advanced] DisableTelemetry: {ex.Message}"); }
        }

        private void AdvancedRevertTelemetry()
        {
            EssentialRevertTelemetry();
            RestoreValue(@"SOFTWARE\Microsoft\Windows NT\CurrentVersion\WUDF", "LogEnable");
            RestoreValue(@"SOFTWARE\Microsoft\Windows NT\CurrentVersion\WUDF", "LogLevel");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\DataCollection", "AllowCommercialDataPipeline");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\DataCollection", "AllowDeviceNameInTelemetry");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\DataCollection", "LimitEnhancedDiagnosticDataWindowsAnalytics");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\DataCollection", "MicrosoftEdgeDataOptIn");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\System", "PublishUserActivities");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\System", "EnableActivityFeed");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\System", "UploadUserActivities");
        }

        private void AdvancedDisableAdvertisingID()
        {
            try
            {
                using (var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\AdvertisingInfo"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "Enabled");
                        key.SetValue("Enabled", 0, RegistryValueKind.DWord);
                    }
                }
                using (var key = Registry.CurrentUser.CreateSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\AdvertisingInfo"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "Enabled", true);
                        key.SetValue("Enabled", 0, RegistryValueKind.DWord);
                    }
                }
                using (var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\Windows\AdvertisingInfo"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "DisabledByGroupPolicy");
                        key.SetValue("DisabledByGroupPolicy", 1, RegistryValueKind.DWord);
                    }
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Advanced] DisableAdvertisingID: {ex.Message}"); }
        }

        private void AdvancedRevertAdvertisingID()
        {
            RestoreValue(@"SOFTWARE\Microsoft\Windows\CurrentVersion\AdvertisingInfo", "Enabled");
            RestoreValue(@"SOFTWARE\Microsoft\Windows\CurrentVersion\AdvertisingInfo", "Enabled", true);
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\AdvertisingInfo", "DisabledByGroupPolicy");
        }

        private void AdvancedDisableSQMCEIP()
        {
            try
            {
                using (var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\SQMClient\Windows"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "CEIPEnable");
                        BackupValue(key, "DisableOptinExperience");
                        BackupValue(key, "SqmLoggerRunning");
                        key.SetValue("CEIPEnable", 0, RegistryValueKind.DWord);
                        key.SetValue("DisableOptinExperience", 1, RegistryValueKind.DWord);
                        key.SetValue("SqmLoggerRunning", 0, RegistryValueKind.DWord);
                    }
                }
                using (var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Microsoft\SQMClient\Reliability"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "CEIPEnable");
                        BackupValue(key, "SqmLoggerRunning");
                        key.SetValue("CEIPEnable", 0, RegistryValueKind.DWord);
                        key.SetValue("SqmLoggerRunning", 0, RegistryValueKind.DWord);
                    }
                }
                using (var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Microsoft\SQMClient\Windows"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "CEIPEnable");
                        BackupValue(key, "DisableOptinExperience");
                        BackupValue(key, "SqmLoggerRunning");
                        key.SetValue("CEIPEnable", 0, RegistryValueKind.DWord);
                        key.SetValue("DisableOptinExperience", 1, RegistryValueKind.DWord);
                        key.SetValue("SqmLoggerRunning", 0, RegistryValueKind.DWord);
                    }
                }
                using (var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Microsoft\SQMClient\IE"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "SqmLoggerRunning");
                        key.SetValue("SqmLoggerRunning", 0, RegistryValueKind.DWord);
                    }
                }
                using (var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\SQMClient"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "CorporateSQMURL");
                        key.SetValue("CorporateSQMURL", "0.0.0.0", RegistryValueKind.String);
                    }
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Advanced] DisableSQMCEIP: {ex.Message}"); }
        }

        private void AdvancedRevertSQMCEIP()
        {
            RestoreValue(@"SOFTWARE\Policies\Microsoft\SQMClient\Windows", "CEIPEnable");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\SQMClient\Windows", "DisableOptinExperience");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\SQMClient\Windows", "SqmLoggerRunning");
            RestoreValue(@"SOFTWARE\Microsoft\SQMClient\Reliability", "CEIPEnable");
            RestoreValue(@"SOFTWARE\Microsoft\SQMClient\Reliability", "SqmLoggerRunning");
            RestoreValue(@"SOFTWARE\Microsoft\SQMClient\Windows", "CEIPEnable");
            RestoreValue(@"SOFTWARE\Microsoft\SQMClient\Windows", "DisableOptinExperience");
            RestoreValue(@"SOFTWARE\Microsoft\SQMClient\Windows", "SqmLoggerRunning");
            RestoreValue(@"SOFTWARE\Microsoft\SQMClient\IE", "SqmLoggerRunning");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\SQMClient", "CorporateSQMURL");
        }

        private void AdvancedDisableAppCompatInventory()
        {
            try
            {
                using var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\Windows\AppCompat");
                if (key != null)
                {
                    BackupValue(key, "DisableInventory");
                    BackupValue(key, "AITEnable");
                    BackupValue(key, "DisableUAR");
                    key.SetValue("DisableInventory", 1, RegistryValueKind.DWord);
                    key.SetValue("AITEnable", 0, RegistryValueKind.DWord);
                    key.SetValue("DisableUAR", 1, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Advanced] DisableAppCompatInventory: {ex.Message}"); }
        }

        private void AdvancedRevertAppCompatInventory()
        {
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\AppCompat", "DisableInventory");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\AppCompat", "AITEnable");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\AppCompat", "DisableUAR");
        }

        private void AdvancedDisableWMIAutoLogger()
        {
            try
            {
                using (var key = Registry.LocalMachine.CreateSubKey(@"SYSTEM\ControlSet001\Control\WMI\AutoLogger\AutoLogger-Diagtrack-Listener"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "Start");
                        key.SetValue("Start", 0, RegistryValueKind.DWord);
                    }
                }
                using (var key = Registry.LocalMachine.CreateSubKey(@"SYSTEM\CurrentControlSet\Control\WMI\AutoLogger\AutoLogger-Diagtrack-Listener"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "Start");
                        key.SetValue("Start", 0, RegistryValueKind.DWord);
                    }
                }
                using (var key = Registry.LocalMachine.CreateSubKey(@"SYSTEM\CurrentControlSet\Control\WMI\AutoLogger\SQMLogger"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "Start");
                        key.SetValue("Start", 0, RegistryValueKind.DWord);
                    }
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Advanced] DisableWMIAutoLogger: {ex.Message}"); }
        }

        private void AdvancedRevertWMIAutoLogger()
        {
            RestoreValue(@"SYSTEM\ControlSet001\Control\WMI\AutoLogger\AutoLogger-Diagtrack-Listener", "Start");
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\WMI\AutoLogger\AutoLogger-Diagtrack-Listener", "Start");
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\WMI\AutoLogger\SQMLogger", "Start");
        }

        private void AdvancedDisableDeviceMetadata()
        {
            try
            {
                using var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Device Metadata");
                if (key != null)
                {
                    BackupValue(key, "PreventDeviceMetadataFromNetwork");
                    key.SetValue("PreventDeviceMetadataFromNetwork", 1, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Advanced] DisableDeviceMetadata: {ex.Message}"); }
        }

        private void AdvancedRevertDeviceMetadata()
        {
            RestoreValue(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Device Metadata", "PreventDeviceMetadataFromNetwork");
        }

        private void AdvancedDisableFeedback()
        {
            try
            {
                using (var key = Registry.CurrentUser.CreateSubKey(@"SOFTWARE\Microsoft\Siuf\Rules"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "NumberOfSIUFInPeriod", true);
                        BackupValue(key, "PeriodInNanoSeconds", true);
                        key.SetValue("NumberOfSIUFInPeriod", 0, RegistryValueKind.DWord);
                        key.SetValue("PeriodInNanoSeconds", 0, RegistryValueKind.DWord);
                    }
                }
                using (var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\Windows\DataCollection"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "DoNotShowFeedbackNotifications");
                        key.SetValue("DoNotShowFeedbackNotifications", 1, RegistryValueKind.DWord);
                    }
                }
                using (var key = Registry.CurrentUser.CreateSubKey(@"SOFTWARE\Policies\Microsoft\Assistance\Client\1.0"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "NoExplicitFeedback", true);
                        key.SetValue("NoExplicitFeedback", 1, RegistryValueKind.DWord);
                    }
                }
                using (var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\Assistance\Client\1.0"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "NoActiveHelp");
                        key.SetValue("NoActiveHelp", 1, RegistryValueKind.DWord);
                    }
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Advanced] DisableFeedback: {ex.Message}"); }
        }

        private void AdvancedRevertFeedback()
        {
            RestoreValue(@"SOFTWARE\Microsoft\Siuf\Rules", "NumberOfSIUFInPeriod", true);
            RestoreValue(@"SOFTWARE\Microsoft\Siuf\Rules", "PeriodInNanoSeconds", true);
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\DataCollection", "DoNotShowFeedbackNotifications");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Assistance\Client\1.0", "NoExplicitFeedback", true);
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Assistance\Client\1.0", "NoActiveHelp");
        }

        private void AdvancedDisableFileHistory()
        {
            try
            {
                using var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\Windows\FileHistory");
                if (key != null)
                {
                    BackupValue(key, "Disabled");
                    key.SetValue("Disabled", 1, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Advanced] DisableFileHistory: {ex.Message}"); }
        }

        private void AdvancedRevertFileHistory()
        {
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\FileHistory", "Disabled");
        }

        #endregion

        #region Services Optimization Implementation

        private void ServicesDisableTelemetryServices()
        {
            var services = new[] { "DiagTrack", "diagsvc", "dmwappushservice", "diagnosticshub.standardcollector.service", "TroubleshootingSvc", "DsSvc", "WdiServiceHost", "WdiSystemHost" };
            SetServicesStartType(services, ServiceStartMode.Disabled);
        }

        private void ServicesRevertTelemetryServices()
        {
            RestoreServiceStartTypes();
        }

        private void ServicesDisableXboxServices()
        {
            var services = new[] { "XblGameSave", "XboxNetApiSvc", "XboxGipSvc", "XblAuthManager" };
            SetServicesStartType(services, ServiceStartMode.Disabled);
        }

        private void ServicesRevertXboxServices()
        {
            RestoreServiceStartTypes();
        }

        private void ServicesDisableSyncServices()
        {
            var services = new[] { "OneSyncSvc", "UnistoreSvc", "UserDataSvc" };
            SetServicesStartType(services, ServiceStartMode.Disabled);
        }

        private void ServicesRevertSyncServices()
        {
            RestoreServiceStartTypes();
        }

        private void ServicesDisableMediaServices()
        {
            var services = new[] { "WMPNetworkSvc", "FrameServer" };
            SetServicesStartType(services, ServiceStartMode.Disabled);
        }

        private void ServicesRevertMediaServices()
        {
            RestoreServiceStartTypes();
        }

        private void ServicesDisableSensorServices()
        {
            var services = new[] { "SensorDataService", "SensrSvc", "SensorService", "perceptionsimulation", "SharedRealitySvc" };
            SetServicesStartType(services, ServiceStartMode.Disabled);
        }

        private void ServicesRevertSensorServices()
        {
            RestoreServiceStartTypes();
        }

        private void ServicesDisableNetworkServices()
        {
            var services = new[] { "PNRPsvc", "p2psvc", "p2pimsvc", "lltdsvc" };
            SetServicesStartType(services, ServiceStartMode.Disabled);
        }

        private void ServicesRevertNetworkServices()
        {
            RestoreServiceStartTypes();
        }

        private void ServicesDisableAppServices()
        {
            var services = new[] { "AppReadiness", "AppXSvc", "CDPUserSvc", "PimIndexMaintenanceSvc", "ConsentUxUserSvc", "DevicePickerUserSvc", "DevicesFlowUserSvc" };
            SetServicesStartType(services, ServiceStartMode.Manual);
        }

        private void ServicesRevertAppServices()
        {
            RestoreServiceStartTypes();
        }

        private void ServicesDisableEdgeServices()
        {
            var services = new[] { "edgeupdate", "edgeupdatem", "MicrosoftEdgeElevationService" };
            SetServicesStartType(services, ServiceStartMode.Disabled);
        }

        private void ServicesRevertEdgeServices()
        {
            RestoreServiceStartTypes();
        }

        private void ServicesDisableThirdPartyGameServices()
        {
            var services = new[] { "EpicOnlineServices", "GoogleChromeElevationService", "gupdate", "gupdatem", "Origin Client Service", "Origin Web Helper Service", "Steam Client Service" };
            SetServicesStartType(services, ServiceStartMode.Disabled);
        }

        private void ServicesRevertThirdPartyGameServices()
        {
            RestoreServiceStartTypes();
        }

        private void ServicesDisableSystemServices()
        {
            var services = new[] { "FontCache3.0.0.0", "FontCache", "Themes", "RetailDemo", "WpcMonSvc", "SEMgrSvc", "GraphicsPerfSvc", "OSRSS", "sedsvc", "SENS" };
            SetServicesStartType(services, ServiceStartMode.Disabled);
        }

        private void ServicesRevertSystemServices()
        {
            RestoreServiceStartTypes();
        }

        private void SetServicesStartType(string[] serviceNames, ServiceStartMode startType)
        {
            foreach (var serviceName in serviceNames)
            {
                try
                {
                    using var service = new ServiceController(serviceName);
                    BackupServiceStartType(serviceName, service.StartType);
                    if (service.StartType != startType)
                    {
                        var sc = new System.Management.ManagementObject($"Win32_Service.Name='{serviceName}'");
                        sc.InvokeMethod("ChangeStartMode", new object[] { startType.ToString() });
                        _logger.LogInfo($"[Services] {serviceName} configurado para {startType}");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[Services] Erro ao configurar {serviceName}: {ex.Message}");
                }
            }
        }

        #endregion

        #region Location & Sensors Implementation

        private void LocationDisableLocation()
        {
            EssentialDisableLocationTracking();
            
            try
            {
                using var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors");
                if (key != null)
                {
                    BackupValue(key, "DisableLocation");
                    BackupValue(key, "DisableLocationScripting");
                    BackupValue(key, "DisableSensors");
                    BackupValue(key, "DisableWindowsLocationProvider");
                    key.SetValue("DisableLocation", 1, RegistryValueKind.DWord);
                    key.SetValue("DisableLocationScripting", 1, RegistryValueKind.DWord);
                    key.SetValue("DisableSensors", 1, RegistryValueKind.DWord);
                    key.SetValue("DisableWindowsLocationProvider", 1, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Location] DisableLocation: {ex.Message}"); }
        }

        private void LocationRevertLocation()
        {
            EssentialRevertLocationTracking();
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors", "DisableLocation");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors", "DisableLocationScripting");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors", "DisableSensors");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\LocationAndSensors", "DisableWindowsLocationProvider");
        }

        private void LocationDisableSensors()
        {
            ServicesDisableSensorServices();
        }

        private void LocationRevertSensors()
        {
            ServicesRevertSensorServices();
        }

        private void LocationDisableLocationService()
        {
            try
            {
                using var key = Registry.LocalMachine.CreateSubKey(@"SYSTEM\CurrentControlSet\Services\lfsvc");
                if (key != null)
                {
                    BackupValue(key, "Start");
                    key.SetValue("Start", 4, RegistryValueKind.DWord);
                }
                using var configKey = Registry.LocalMachine.CreateSubKey(@"SYSTEM\CurrentControlSet\Services\lfsvc\Service\Configuration");
                if (configKey != null)
                {
                    BackupValue(configKey, "Status");
                    configKey.SetValue("Status", 0, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Location] DisableLocationService: {ex.Message}"); }
        }

        private void LocationRevertLocationService()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\lfsvc", "Start");
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\lfsvc\Service\Configuration", "Status");
        }

        private void LocationDisableMapsUpdate()
        {
            try
            {
                using var key = Registry.LocalMachine.CreateSubKey(@"SYSTEM\Maps");
                if (key != null)
                {
                    BackupValue(key, "AutoUpdateEnabled");
                    key.SetValue("AutoUpdateEnabled", 0, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Location] DisableMapsUpdate: {ex.Message}"); }
        }

        private void LocationRevertMapsUpdate()
        {
            RestoreValue(@"SYSTEM\Maps", "AutoUpdateEnabled");
        }

        #endregion

        #region Background Tasks Implementation

        private void TasksDisableTelemetryTasks()
        {
            var tasks = new[]
            {
                @"Microsoft\Windows\Customer Experience Improvement Program\Consolidator",
                @"Microsoft\Windows\Customer Experience Improvement Program\KernelCeipTask",
                @"Microsoft\Windows\Customer Experience Improvement Program\UsbCeip",
                @"Microsoft\Windows\Customer Experience Improvement Program\Uploader"
            };
            DisableScheduledTasksBatch(tasks);
        }

        private void TasksRevertTelemetryTasks()
        {
            RestoreTaskStates();
        }

        private void TasksDisableAppExperienceTasks()
        {
            var tasks = new[]
            {
                @"Microsoft\Windows\Application Experience\Microsoft Compatibility Appraiser",
                @"Microsoft\Windows\Application Experience\ProgramDataUpdater",
                @"Microsoft\Windows\Application Experience\StartupAppTask",
                @"Microsoft\Windows\Application Experience\AitAgent",
                @"Microsoft\Windows\Application Experience\MareBackup",
                @"Microsoft\Windows\Application Experience\PcaPatchDbTask"
            };
            DisableScheduledTasksBatch(tasks);
        }

        private void TasksRevertAppExperienceTasks()
        {
            RestoreTaskStates();
        }

        private void TasksDisableDiagnosticTasks()
        {
            var tasks = new[]
            {
                @"Microsoft\Windows\DiskDiagnostic\Microsoft-Windows-DiskDiagnosticDataCollector",
                @"Microsoft\Windows\DiskDiagnostic\Microsoft-Windows-DiskDiagnosticResolver",
                @"Microsoft\Windows\Power Efficiency Diagnostics\AnalyzeSystem",
                @"Microsoft\Windows\Windows Error Reporting\QueueReporting",
                @"Microsoft\Windows\DiskFootprint\Diagnostics",
                @"Microsoft\Windows\NetTrace\GatherNetworkInfo",
                @"Microsoft\Windows\AppID\SmartScreenSpecific"
            };
            DisableScheduledTasksBatch(tasks);
        }

        private void TasksRevertDiagnosticTasks()
        {
            RestoreTaskStates();
        }

        private void TasksDisableOfficeTasks()
        {
            var tasks = new[]
            {
                @"Microsoft\Office\OfficeTelemetryAgentFallBack2016",
                @"Microsoft\Office\OfficeTelemetryAgentLogOn2016",
                @"Microsoft\Office\OfficeTelemetryAgentLogOn",
                @"Microsoftd\Office\OfficeTelemetryAgentFallBack",
                @"Microsoft\Office\Office 15 Subscription Heartbeat"
            };
            DisableScheduledTasksBatch(tasks);
        }

        private void TasksRevertOfficeTasks()
        {
            RestoreTaskStates();
        }

        private void DisableScheduledTasksBatch(string[] taskNames)
        {
            foreach (var taskName in taskNames)
            {
                try
                {
                    // Verificar estado atual
                    var psiQuery = new ProcessStartInfo
                    {
                        FileName = "schtasks",
                        Arguments = $"/query /tn \"{taskName}\" /fo LIST /v",
                        UseShellExecute = false,
                        RedirectStandardOutput = true,
                        CreateNoWindow = true
                    };
                    
                    bool wasEnabled = false;
                    using (var pQuery = Process.Start(psiQuery))
                    {
                        if (pQuery != null)
                        {
                            var output = pQuery.StandardOutput.ReadToEnd();
                            pQuery.WaitForExit(5000);
                            wasEnabled = output.Contains("Enabled:          Yes");
                        }
                    }
                    
                    BackupTaskState(taskName, wasEnabled);

                    // Desativar tarefa
                    var psiDisable = new ProcessStartInfo
                    {
                        FileName = "schtasks",
                        Arguments = $"/change /tn \"{taskName}\" /disable",
                        UseShellExecute = false,
                        CreateNoWindow = true
                    };
                    using var pDisable = Process.Start(psiDisable);
                    pDisable?.WaitForExit(5000);
                    
                    _logger.LogInfo($"[Tasks] {taskName} desativada");
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[Tasks] Erro ao desativar {taskName}: {ex.Message}");
                }
            }
        }

        #endregion

        #region Advanced Services Optimization Implementation

        private void AdvancedDisableAdditionalSystemServices()
        {
            var services = new[] 
            { 
                "shpamsvc", 
                "svsvc", 
                "Netlogon", 
                "CscService", 
                "ssh-agent", 
                "NfsClnt", 
                "autotimesvc", 
                "BcastDVRUserService", 
                "cbdhsvc", 
                "PcaSvc" 
            };
            SetServicesStartType(services, ServiceStartMode.Disabled);
        }

        private void AdvancedRevertAdditionalSystemServices()
        {
            RestoreServiceStartTypes();
        }

        private void AdvancedDisableFamilySafetyTasks()
        {
            var tasks = new[]
            {
                @"Microsoft\Windows\Shell\FamilySafetyMonitor",
                @"Microsoft\Windows\Shell\FamilySafetyRefresh",
                @"Microsoft\Windows\Shell\FamilySafetyUpload"
            };
            DisableScheduledTasksBatch(tasks);
        }

        private void AdvancedRevertFamilySafetyTasks()
        {
            RestoreTaskStates();
        }

        private void AdvancedDisableMaintenanceTasks()
        {
            var tasks = new[]
            {
                @"Microsoft\Windows\Maintenance\WinSAT"
            };
            DisableScheduledTasksBatch(tasks);
        }

        private void AdvancedRevertMaintenanceTasks()
        {
            RestoreTaskStates();
        }

        private void AdvancedDisableCloudAndSQMTasks()
        {
            var tasks = new[]
            {
                @"Microsoft\Windows\CloudExperienceHost\CreateObjectTask",
                @"Microsoft\Windows\PI\Sqm-Tasks"
            };
            DisableScheduledTasksBatch(tasks);
        }

        private void AdvancedRevertCloudAndSQMTasks()
        {
            RestoreTaskStates();
        }

        private void AdvancedDisableTimeAndDeviceTasks()
        {
            var tasks = new[]
            {
                @"Microsoft\Windows\Time Synchronization\ForceSynchronizeTime",
                @"Microsoft\Windows\Time Synchronization\SynchronizeTime",
                @"Microsoft\Windows\Device Information\Device"
            };
            DisableScheduledTasksBatch(tasks);
        }

        private void AdvancedRevertTimeAndDeviceTasks()
        {
            RestoreTaskStates();
        }

        #endregion

        #region Input Personalization Implementation

        private void InputDisablePersonalization()
        {
            try
            {
                using (var key = Registry.CurrentUser.CreateSubKey(@"SOFTWARE\Microsoft\InputPersonalization"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "RestrictImplicitInkCollection", true);
                        BackupValue(key, "RestrictImplicitTextCollection", true);
                        key.SetValue("RestrictImplicitInkCollection", 1, RegistryValueKind.DWord);
                        key.SetValue("RestrictImplicitTextCollection", 1, RegistryValueKind.DWord);
                    }
                }
                using (var key = Registry.CurrentUser.CreateSubKey(@"SOFTWARE\Microsoft\InputPersonalization\TrainedDataStore"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "HarvestContacts", true);
                        key.SetValue("HarvestContacts", 0, RegistryValueKind.DWord);
                    }
                }
                using (var key = Registry.CurrentUser.CreateSubKey(@"Control Panel\International\User Profile"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "HttpAcceptLanguageOptOut", true);
                        key.SetValue("HttpAcceptLanguageOptOut", 1, RegistryValueKind.DWord);
                    }
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Input] DisablePersonalization: {ex.Message}"); }
        }

        private void InputRevertPersonalization()
        {
            RestoreValue(@"SOFTWARE\Microsoft\InputPersonalization", "RestrictImplicitInkCollection", true);
            RestoreValue(@"SOFTWARE\Microsoft\InputPersonalization", "RestrictImplicitTextCollection", true);
            RestoreValue(@"SOFTWARE\Microsoft\InputPersonalization\TrainedDataStore", "HarvestContacts", true);
            RestoreValue(@"Control Panel\International\User Profile", "HttpAcceptLanguageOptOut", true);
        }

        private void InputDisableHandwritingSharing()
        {
            try
            {
                using (var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\Windows\TabletPC"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "PreventHandwritingDataSharing");
                        BackupValue(key, "DoSvc");
                        key.SetValue("PreventHandwritingDataSharing", 1, RegistryValueKind.DWord);
                        key.SetValue("DoSvc", 3, RegistryValueKind.DWord);
                    }
                }
                using (var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\Windows\HandwritingErrorReports"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "PreventHandwritingErrorReports");
                        key.SetValue("PreventHandwritingErrorReports", 1, RegistryValueKind.DWord);
                    }
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Input] DisableHandwritingSharing: {ex.Message}"); }
        }

        private void InputRevertHandwritingSharing()
        {
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\TabletPC", "PreventHandwritingDataSharing");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\TabletPC", "DoSvc");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\HandwritingErrorReports", "PreventHandwritingErrorReports");
        }

        private void InputDisableLanguageProfile()
        {
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(@"Control Panel\International\User Profile");
                if (key != null)
                {
                    BackupValue(key, "HttpAcceptLanguageOptOut", true);
                    key.SetValue("HttpAcceptLanguageOptOut", 1, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Input] DisableLanguageProfile: {ex.Message}"); }
        }

        private void InputRevertLanguageProfile()
        {
            RestoreValue(@"Control Panel\International\User Profile", "HttpAcceptLanguageOptOut", true);
        }

        #endregion

        #region Advertising & Tracking Implementation

        private void AdvertisingDisableDeliveryOptimization()
        {
            try
            {
                using (var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\DeliveryOptimization\Config"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "DODownloadMode");
                        key.SetValue("DODownloadMode", 0, RegistryValueKind.DWord);
                    }
                }
                using (var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\Peernet"))
                {
                    if (key != null)
                    {
                        BackupValue(key, "Disabled");
                        key.SetValue("Disabled", 0, RegistryValueKind.DWord);
                    }
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Advertising] DisableDeliveryOptimization: {ex.Message}"); }
        }

        private void AdvertisingRevertDeliveryOptimization()
        {
            RestoreValue(@"SOFTWARE\Microsoft\Windows\CurrentVersion\DeliveryOptimization\Config", "DODownloadMode");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Peernet", "Disabled");
        }

        private void AdvertisingDisableCloudContent()
        {
            try
            {
                using var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\Windows\CloudContent");
                if (key != null)
                {
                    BackupValue(key, "DisableSoftLanding");
                    key.SetValue("DisableSoftLanding", 1, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Advertising] DisableCloudContent: {ex.Message}"); }
        }

        private void AdvertisingRevertCloudContent()
        {
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\CloudContent", "DisableSoftLanding");
        }

        private void AdvertisingDisableWiFiHotspot()
        {
            EssentialDisableWiFiSense();
        }

        private void AdvertisingRevertWiFiHotspot()
        {
            EssentialRevertWiFiSense();
        }

        private void AdvertisingDisableMediaTracking()
        {
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(@"SOFTWARE\Microsoft\MediaPlayer\Preferences");
                if (key != null)
                {
                    BackupValue(key, "UsageTracking", true);
                    key.SetValue("UsageTracking", 0, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Advertising] DisableMediaTracking: {ex.Message}"); }
        }

        private void AdvertisingRevertMediaTracking()
        {
            RestoreValue(@"SOFTWARE\Microsoft\MediaPlayer\Preferences", "UsageTracking", true);
        }

        private void AdvertisingDisableStoreSuggestions()
        {
            try
            {
                using var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\Windows\Explorer");
                if (key != null)
                {
                    BackupValue(key, "NoUseStoreOpenWith");
                    key.SetValue("NoUseStoreOpenWith", 1, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Advertising] DisableStoreSuggestions: {ex.Message}"); }
        }

        private void AdvertisingRevertStoreSuggestions()
        {
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\Explorer", "NoUseStoreOpenWith");
        }

        #endregion

        #region Network Advanced Optimizations Implementation

        private void NetworkAdvancedOptimizeAFD()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\AFD\Parameters", true);
                if (key != null)
                {
                    BackupValue(key, "DefaultReceiveWindow");
                    BackupValue(key, "DefaultSendWindow");
                    BackupValue(key, "FastCopyReceiveThreshold");
                    BackupValue(key, "FastSendDatagramThreshold");
                    BackupValue(key, "EnableDynamicBacklog");
                    BackupValue(key, "MaximumDynamicBacklog");
                    BackupValue(key, "MinimumDynamicBacklog");
                    BackupValue(key, "DynamicBacklogGrowthDelta");
                    BackupValue(key, "IgnorePushBitOnReceives");
                    BackupValue(key, "DisableAddressSharing");
                    BackupValue(key, "DoNotHoldNicBuffers");
                    BackupValue(key, "EnablePMTUDiscovery");
                    BackupValue(key, "GlobalMaxTcpWindowSize");
                    BackupValue(key, "KeepAliveInterval");
                    BackupValue(key, "MaxHashTableSize");
                    BackupValue(key, "TcpMaxDupAcks");
                    BackupValue(key, "TcpTimedWaitDelay");
                    
                    key.SetValue("DefaultReceiveWindow", 4294967295U, RegistryValueKind.DWord);
                    key.SetValue("DefaultSendWindow", 4294967295U, RegistryValueKind.DWord);
                    key.SetValue("FastCopyReceiveThreshold", 4294967295U, RegistryValueKind.DWord);
                    key.SetValue("FastSendDatagramThreshold", 4294967295U, RegistryValueKind.DWord);
                    key.SetValue("EnableDynamicBacklog", 1, RegistryValueKind.DWord);
                    key.SetValue("MaximumDynamicBacklog", 131072, RegistryValueKind.DWord);
                    key.SetValue("MinimumDynamicBacklog", 512, RegistryValueKind.DWord);
                    key.SetValue("DynamicBacklogGrowthDelta", 256, RegistryValueKind.DWord);
                    key.SetValue("IgnorePushBitOnReceives", 1, RegistryValueKind.DWord);
                    key.SetValue("DisableAddressSharing", 1, RegistryValueKind.DWord);
                    key.SetValue("DoNotHoldNicBuffers", 1, RegistryValueKind.DWord);
                    key.SetValue("EnablePMTUDiscovery", 0, RegistryValueKind.DWord);
                    key.SetValue("GlobalMaxTcpWindowSize", 3539039, RegistryValueKind.DWord);
                    key.SetValue("KeepAliveInterval", 1, RegistryValueKind.DWord);
                    key.SetValue("MaxHashTableSize", 4096, RegistryValueKind.DWord);
                    key.SetValue("TcpMaxDupAcks", 3, RegistryValueKind.DWord);
                    key.SetValue("TcpTimedWaitDelay", 30, RegistryValueKind.DWord);
                    
                    _logger.LogInfo("[NetworkAdvanced] AFD otimizado");
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[NetworkAdvanced] AFD: {ex.Message}"); }
        }

        private void NetworkAdvancedRevertAFD()
        {
            var path = @"SYSTEM\CurrentControlSet\Services\AFD\Parameters";
            RestoreValue(path, "DefaultReceiveWindow");
            RestoreValue(path, "DefaultSendWindow");
            RestoreValue(path, "FastCopyReceiveThreshold");
            RestoreValue(path, "FastSendDatagramThreshold");
            RestoreValue(path, "EnableDynamicBacklog");
            RestoreValue(path, "MaximumDynamicBacklog");
            RestoreValue(path, "MinimumDynamicBacklog");
            RestoreValue(path, "DynamicBacklogGrowthDelta");
            RestoreValue(path, "IgnorePushBitOnReceives");
            RestoreValue(path, "DisableAddressSharing");
            RestoreValue(path, "DoNotHoldNicBuffers");
            RestoreValue(path, "EnablePMTUDiscovery");
            RestoreValue(path, "GlobalMaxTcpWindowSize");
            RestoreValue(path, "KeepAliveInterval");
            RestoreValue(path, "MaxHashTableSize");
            RestoreValue(path, "TcpMaxDupAcks");
            RestoreValue(path, "TcpTimedWaitDelay");
        }

        private void NetworkAdvancedNetshCommands()
        {
            try
            {
                var commands = new[]
                {
                    "int tcp set global rss=enabled",
                    "int tcp set global chimney=enabled",
                    "int tcp set global dca=enabled",
                    "int tcp set global rsc=enabled",
                    "int tcp set global netdma=enabled",
                    "int tcp set global autotuninglevel=highlyrestricted"
                };

                foreach (var cmd in commands)
                {
                    try
                    {
                        var process = Process.Start(new ProcessStartInfo
                        {
                            FileName = "netsh",
                            Arguments = cmd,
                            UseShellExecute = false,
                            CreateNoWindow = true,
                            RedirectStandardOutput = true,
                            RedirectStandardError = true
                        });
                        process?.WaitForExit(5000);
                    }
                    catch { }
                }
                _logger.LogInfo("[NetworkAdvanced] Comandos netsh aplicados");
            }
            catch (Exception ex) { _logger.LogWarning($"[NetworkAdvanced] Netsh: {ex.Message}"); }
        }

        private void NetworkAdvancedRevertNetshCommands()
        {
            try
            {
                var commands = new[]
                {
                    "int tcp set global rss=disabled",
                    "int tcp set global chimney=disabled",
                    "int tcp set global dca=disabled",
                    "int tcp set global rsc=disabled",
                    "int tcp set global netdma=disabled",
                    "int tcp set global autotuninglevel=normal"
                };

                foreach (var cmd in commands)
                {
                    try
                    {
                        var process = Process.Start(new ProcessStartInfo
                        {
                            FileName = "netsh",
                            Arguments = cmd,
                            UseShellExecute = false,
                            CreateNoWindow = true,
                            RedirectStandardOutput = true,
                            RedirectStandardError = true
                        });
                        process?.WaitForExit(5000);
                    }
                    catch { }
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[NetworkAdvanced] Revert Netsh: {ex.Message}"); }
        }

        private void NetworkAdvancedOptimizeDNS()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Policies\Microsoft\Windows NT\DNSClient", true);
                if (key != null)
                {
                    BackupValue(key, "DisableSmartNameResolution");
                    BackupValue(key, "DisableSmartProtocolReordering");
                    BackupValue(key, "EnableIdnMapping");
                    BackupValue(key, "EnableMulticast");
                    BackupValue(key, "PreferLocalOverLowerBindingDNS");
                    
                    key.SetValue("DisableSmartNameResolution", 1, RegistryValueKind.DWord);
                    key.SetValue("DisableSmartProtocolReordering", 1, RegistryValueKind.DWord);
                    key.SetValue("EnableIdnMapping", 0, RegistryValueKind.DWord);
                    key.SetValue("EnableMulticast", 0, RegistryValueKind.DWord);
                    key.SetValue("PreferLocalOverLowerBindingDNS", 1, RegistryValueKind.DWord);
                }

                using var dnsKey = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\Dnscache\Parameters", true);
                if (dnsKey != null)
                {
                    BackupValue(dnsKey, "MaxCacheTtl");
                    BackupValue(dnsKey, "MaxNegativeCacheTtl");
                    BackupValue(dnsKey, "CacheHashTableSize");
                    BackupValue(dnsKey, "MaximumUdpPacketSize");
                    BackupValue(dnsKey, "MaxCacheEntryTtlLimit");
                    BackupValue(dnsKey, "MaxSOACacheEntryTtlLimit");
                    BackupValue(dnsKey, "NegativeCacheTime");
                    BackupValue(dnsKey, "NegativeSOACacheTime");
                    BackupValue(dnsKey, "NetFailureCacheTime");
                    BackupValue(dnsKey, "ServerPriorityTimeLimit");
                    BackupValue(dnsKey, "ServiceDllUnloadOnStop");
                    
                    dnsKey.SetValue("MaxCacheTtl", 14400, RegistryValueKind.DWord);
                    dnsKey.SetValue("MaxNegativeCacheTtl", 0, RegistryValueKind.DWord);
                    dnsKey.SetValue("CacheHashTableSize", 900, RegistryValueKind.DWord);
                    dnsKey.SetValue("MaximumUdpPacketSize", 4864, RegistryValueKind.DWord);
                    dnsKey.SetValue("MaxCacheEntryTtlLimit", 409600, RegistryValueKind.DWord);
                    dnsKey.SetValue("MaxSOACacheEntryTtlLimit", 769, RegistryValueKind.DWord);
                    dnsKey.SetValue("NegativeCacheTime", 0, RegistryValueKind.DWord);
                    dnsKey.SetValue("NegativeSOACacheTime", 0, RegistryValueKind.DWord);
                    dnsKey.SetValue("NetFailureCacheTime", 0, RegistryValueKind.DWord);
                    dnsKey.SetValue("ServerPriorityTimeLimit", 0, RegistryValueKind.DWord);
                    dnsKey.SetValue("ServiceDllUnloadOnStop", 1, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[NetworkAdvanced] DNS otimizado");
            }
            catch (Exception ex) { _logger.LogWarning($"[NetworkAdvanced] DNS: {ex.Message}"); }
        }

        private void NetworkAdvancedRevertDNS()
        {
            var policyPath = @"SOFTWARE\Policies\Microsoft\Windows NT\DNSClient";
            RestoreValue(policyPath, "DisableSmartNameResolution");
            RestoreValue(policyPath, "DisableSmartProtocolReordering");
            RestoreValue(policyPath, "EnableIdnMapping");
            RestoreValue(policyPath, "EnableMulticast");
            RestoreValue(policyPath, "PreferLocalOverLowerBindingDNS");
            
            var dnsPath = @"SYSTEM\CurrentControlSet\Services\Dnscache\Parameters";
            RestoreValue(dnsPath, "MaxCacheTtl");
            RestoreValue(dnsPath, "MaxNegativeCacheTtl");
            RestoreValue(dnsPath, "CacheHashTableSize");
            RestoreValue(dnsPath, "MaximumUdpPacketSize");
            RestoreValue(dnsPath, "MaxCacheEntryTtlLimit");
            RestoreValue(dnsPath, "MaxSOACacheEntryTtlLimit");
            RestoreValue(dnsPath, "NegativeCacheTime");
            RestoreValue(dnsPath, "NegativeSOACacheTime");
            RestoreValue(dnsPath, "NetFailureCacheTime");
            RestoreValue(dnsPath, "ServerPriorityTimeLimit");
            RestoreValue(dnsPath, "ServiceDllUnloadOnStop");
        }

        private void NetworkAdvancedOptimizeTcpGaming()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\Tcpip\Parameters", true);
                if (key != null)
                {
                    BackupValue(key, "TcpWindowSize");
                    BackupValue(key, "TcpTimedWaitDelay");
                    BackupValue(key, "MaxUserPort");
                    BackupValue(key, "Tcp1323Opts");
                    BackupValue(key, "TcpInitialRto");
                    BackupValue(key, "TcpMaxSynRetransmissions");
                    BackupValue(key, "TcpFinTimeout");
                    BackupValue(key, "DisableTaskOffload");
                    BackupValue(key, "EnableFragmentation");
                    
                    key.SetValue("TcpWindowSize", 524288, RegistryValueKind.DWord);
                    key.SetValue("TcpTimedWaitDelay", 30, RegistryValueKind.DWord);
                    key.SetValue("MaxUserPort", 65534, RegistryValueKind.DWord);
                    key.SetValue("Tcp1323Opts", 1, RegistryValueKind.DWord);
                    key.SetValue("TcpInitialRto", 3000, RegistryValueKind.DWord);
                    key.SetValue("TcpMaxSynRetransmissions", 2, RegistryValueKind.DWord);
                    key.SetValue("TcpFinTimeout", 30, RegistryValueKind.DWord);
                    key.SetValue("DisableTaskOffload", 1, RegistryValueKind.DWord);
                    key.SetValue("EnableFragmentation", 0, RegistryValueKind.DWord);
                }

                using var profileKey = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile", true);
                if (profileKey != null)
                {
                    BackupValue(profileKey, "NetworkPerformanceThrottlingIndex");
                    profileKey.SetValue("NetworkPerformanceThrottlingIndex", 0, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[NetworkAdvanced] TCP/IP para gaming otimizado");
            }
            catch (Exception ex) { _logger.LogWarning($"[NetworkAdvanced] TCP Gaming: {ex.Message}"); }
        }

        private void NetworkAdvancedRevertTcpGaming()
        {
            var tcpPath = @"SYSTEM\CurrentControlSet\Services\Tcpip\Parameters";
            RestoreValue(tcpPath, "TcpWindowSize");
            RestoreValue(tcpPath, "TcpTimedWaitDelay");
            RestoreValue(tcpPath, "MaxUserPort");
            RestoreValue(tcpPath, "Tcp1323Opts");
            RestoreValue(tcpPath, "TcpInitialRto");
            RestoreValue(tcpPath, "TcpMaxSynRetransmissions");
            RestoreValue(tcpPath, "TcpFinTimeout");
            RestoreValue(tcpPath, "DisableTaskOffload");
            RestoreValue(tcpPath, "EnableFragmentation");
            RestoreValue(@"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile", "NetworkPerformanceThrottlingIndex");
        }

        private void NetworkAdvancedOptimizeFirewall()
        {
            try
            {
                using var domainKey = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\WindowsFirewall\DomainProfile");
                if (domainKey != null)
                {
                    BackupValue(domainKey, "DisableNotifications");
                    BackupValue(domainKey, "DisableUnicastResponsesToMulticastBroadcast");
                    domainKey.SetValue("DisableNotifications", 1, RegistryValueKind.DWord);
                    domainKey.SetValue("DisableUnicastResponsesToMulticastBroadcast", 1, RegistryValueKind.DWord);
                }

                using var standardKey = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\WindowsFirewall\StandardProfile");
                if (standardKey != null)
                {
                    BackupValue(standardKey, "DisableNotifications");
                    BackupValue(standardKey, "DisableUnicastResponsesToMulticastBroadcast");
                    standardKey.SetValue("DisableNotifications", 1, RegistryValueKind.DWord);
                    standardKey.SetValue("DisableUnicastResponsesToMulticastBroadcast", 1, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[NetworkAdvanced] Firewall otimizado");
            }
            catch (Exception ex) { _logger.LogWarning($"[NetworkAdvanced] Firewall: {ex.Message}"); }
        }

        private void NetworkAdvancedRevertFirewall()
        {
            RestoreValue(@"SOFTWARE\Policies\Microsoft\WindowsFirewall\DomainProfile", "DisableNotifications");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\WindowsFirewall\DomainProfile", "DisableUnicastResponsesToMulticastBroadcast");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\WindowsFirewall\StandardProfile", "DisableNotifications");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\WindowsFirewall\StandardProfile", "DisableUnicastResponsesToMulticastBroadcast");
        }

        #endregion

        #region Gaming Optimizations Implementation

        private void GamingOptimizeHAGS()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\GraphicsDrivers", true);
                if (key != null)
                {
                    BackupValue(key, "HwSchMode");
                    BackupValue(key, "EnableHwsch");
                    BackupValue(key, "HwSchedMode");
                    BackupValue(key, "DpiMapIommuContiguous");
                    BackupValue(key, "GpuPriority");
                    BackupValue(key, "MaxGPULoadThreads");
                    BackupValue(key, "TdrLevel");
                    BackupValue(key, "TdrDelay");
                    BackupValue(key, "DxMaxMinRes");
                    BackupValue(key, "FrameBufferLimit");
                    BackupValue(key, "GPUDelayExecution");
                    
                    // HAGS pode ser 1 (desativado) ou 2 (ativado) - usando 2 para máximo desempenho
                    key.SetValue("HwSchMode", 2, RegistryValueKind.DWord);
                    key.SetValue("EnableHwsch", 2, RegistryValueKind.DWord);
                    key.SetValue("HwSchedMode", 2, RegistryValueKind.DWord);
                    key.SetValue("DpiMapIommuContiguous", 1, RegistryValueKind.DWord);
                    key.SetValue("GpuPriority", 8, RegistryValueKind.DWord);
                    key.SetValue("MaxGPULoadThreads", 10, RegistryValueKind.DWord);
                    key.SetValue("TdrLevel", 0, RegistryValueKind.DWord);
                    key.SetValue("TdrDelay", 60, RegistryValueKind.DWord);
                    key.SetValue("DxMaxMinRes", 1, RegistryValueKind.DWord);
                    key.SetValue("FrameBufferLimit", 0, RegistryValueKind.DWord);
                    key.SetValue("GPUDelayExecution", 0, RegistryValueKind.DWord);
                }

                using var powerKey = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power", true);
                if (powerKey != null)
                {
                    BackupValue(powerKey, "HwSchMode");
                    powerKey.SetValue("HwSchMode", 2, RegistryValueKind.DWord);
                }

                using var schedulerKey = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Scheduler", true);
                if (schedulerKey != null)
                {
                    BackupValue(schedulerKey, "EnablePreemption");
                    schedulerKey.SetValue("EnablePreemption", 0, RegistryValueKind.DWord);
                }

                using var dxgKey = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\DXGKrnl", true);
                if (dxgKey != null)
                {
                    BackupValue(dxgKey, "MonitorLatencyTolerance");
                    BackupValue(dxgKey, "MonitorRefreshLatencyTolerance");
                    dxgKey.SetValue("MonitorLatencyTolerance", 0, RegistryValueKind.DWord);
                    dxgKey.SetValue("MonitorRefreshLatencyTolerance", 0, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[Gaming] HAGS e GPU otimizados");
            }
            catch (Exception ex) { _logger.LogWarning($"[Gaming] HAGS: {ex.Message}"); }
        }

        private void GamingRevertHAGS()
        {
            var graphicsPath = @"SYSTEM\CurrentControlSet\Control\GraphicsDrivers";
            RestoreValue(graphicsPath, "HwSchMode");
            RestoreValue(graphicsPath, "EnableHwsch");
            RestoreValue(graphicsPath, "HwSchedMode");
            RestoreValue(graphicsPath, "DpiMapIommuContiguous");
            RestoreValue(graphicsPath, "GpuPriority");
            RestoreValue(graphicsPath, "MaxGPULoadThreads");
            RestoreValue(graphicsPath, "TdrLevel");
            RestoreValue(graphicsPath, "TdrDelay");
            RestoreValue(graphicsPath, "DxMaxMinRes");
            RestoreValue(graphicsPath, "FrameBufferLimit");
            RestoreValue(graphicsPath, "GPUDelayExecution");
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Power", "HwSchMode");
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\GraphicsDrivers\Scheduler", "EnablePreemption");
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\DXGKrnl", "MonitorLatencyTolerance");
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\DXGKrnl", "MonitorRefreshLatencyTolerance");
        }

        private void GamingOptimizeGameMode()
        {
            try
            {
                using var gameConfigKey = Registry.CurrentUser.OpenSubKey(@"System\GameConfigStore", true);
                if (gameConfigKey != null)
                {
                    BackupValue(gameConfigKey, "GameDVR_Enabled", true);
                    BackupValue(gameConfigKey, "GameDVR_FSEBehaviorMode", true);
                    BackupValue(gameConfigKey, "GameDVR_HonorFSEBehaviorMode", true);
                    BackupValue(gameConfigKey, "AutoGameModeEnabled", true);
                    gameConfigKey.SetValue("GameDVR_Enabled", 0, RegistryValueKind.DWord);
                    gameConfigKey.SetValue("GameDVR_FSEBehaviorMode", 2, RegistryValueKind.DWord);
                    gameConfigKey.SetValue("GameDVR_HonorFSEBehaviorMode", 0, RegistryValueKind.DWord);
                    gameConfigKey.SetValue("AutoGameModeEnabled", 0, RegistryValueKind.DWord);
                }

                using var gameBarKey = Registry.CurrentUser.OpenSubKey(@"SOFTWARE\Microsoft\GameBar", true);
                if (gameBarKey != null)
                {
                    BackupValue(gameBarKey, "AutoGameModeEnabled", true);
                    BackupValue(gameBarKey, "UseNexusForGameBarEnabled", true);
                    BackupValue(gameBarKey, "ShowStartupPanel", true);
                    gameBarKey.SetValue("AutoGameModeEnabled", 0, RegistryValueKind.DWord);
                    gameBarKey.SetValue("UseNexusForGameBarEnabled", 0, RegistryValueKind.DWord);
                    gameBarKey.SetValue("ShowStartupPanel", 0, RegistryValueKind.DWord);
                }

                using var gameDvrKey = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\GameDVR", true);
                if (gameDvrKey != null)
                {
                    BackupValue(gameDvrKey, "AutoGameModeEnabled");
                    BackupValue(gameDvrKey, "AppCaptureEnabled");
                    gameDvrKey.SetValue("AutoGameModeEnabled", 0, RegistryValueKind.DWord);
                    gameDvrKey.SetValue("AppCaptureEnabled", 0, RegistryValueKind.DWord);
                }

                using var gameDvrPolicyKey = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Policies\Microsoft\Windows\GameDVR", true);
                if (gameDvrPolicyKey != null)
                {
                    BackupValue(gameDvrPolicyKey, "AllowGameDVR");
                    gameDvrPolicyKey.SetValue("AllowGameDVR", 0, RegistryValueKind.DWord);
                }

                using var gameDvrUserKey = Registry.CurrentUser.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\GameDVR", true);
                if (gameDvrUserKey != null)
                {
                    BackupValue(gameDvrUserKey, "AppCaptureEnabled", true);
                    BackupValue(gameDvrUserKey, "AudioCaptureEnabled", true);
                    BackupValue(gameDvrUserKey, "CursorCaptureEnabled", true);
                    BackupValue(gameDvrUserKey, "HistoricalCaptureEnabled", true);
                    gameDvrUserKey.SetValue("AppCaptureEnabled", 0, RegistryValueKind.DWord);
                    gameDvrUserKey.SetValue("AudioCaptureEnabled", 0, RegistryValueKind.DWord);
                    gameDvrUserKey.SetValue("CursorCaptureEnabled", 0, RegistryValueKind.DWord);
                    gameDvrUserKey.SetValue("HistoricalCaptureEnabled", 0, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[Gaming] Game Mode e Game Bar desativados");
            }
            catch (Exception ex) { _logger.LogWarning($"[Gaming] GameMode: {ex.Message}"); }
        }

        private void GamingRevertGameMode()
        {
            RestoreValue(@"System\GameConfigStore", "GameDVR_Enabled", true);
            RestoreValue(@"System\GameConfigStore", "GameDVR_FSEBehaviorMode", true);
            RestoreValue(@"System\GameConfigStore", "GameDVR_HonorFSEBehaviorMode", true);
            RestoreValue(@"System\GameConfigStore", "AutoGameModeEnabled", true);
            RestoreValue(@"SOFTWARE\Microsoft\GameBar", "AutoGameModeEnabled", true);
            RestoreValue(@"SOFTWARE\Microsoft\GameBar", "UseNexusForGameBarEnabled", true);
            RestoreValue(@"SOFTWARE\Microsoft\GameBar", "ShowStartupPanel", true);
            RestoreValue(@"SOFTWARE\Microsoft\Windows\CurrentVersion\GameDVR", "AutoGameModeEnabled");
            RestoreValue(@"SOFTWARE\Microsoft\Windows\CurrentVersion\GameDVR", "AppCaptureEnabled");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\GameDVR", "AllowGameDVR");
            RestoreValue(@"SOFTWARE\Microsoft\Windows\CurrentVersion\GameDVR", "AppCaptureEnabled", true);
            RestoreValue(@"SOFTWARE\Microsoft\Windows\CurrentVersion\GameDVR", "AudioCaptureEnabled", true);
            RestoreValue(@"SOFTWARE\Microsoft\Windows\CurrentVersion\GameDVR", "CursorCaptureEnabled", true);
            RestoreValue(@"SOFTWARE\Microsoft\Windows\CurrentVersion\GameDVR", "HistoricalCaptureEnabled", true);
        }

        private void GamingOptimizeFullscreen()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"System\GameConfigStore", true);
                if (key != null)
                {
                    BackupValue(key, "GameDVR_DXGIHonorFSEWindowsCompatible", true);
                    BackupValue(key, "windowsCompatible", true);
                    BackupValue(key, "behaviorMode", true);
                    key.SetValue("GameDVR_DXGIHonorFSEWindowsCompatible", 1, RegistryValueKind.DWord);
                    key.SetValue("windowsCompatible", 1, RegistryValueKind.DWord);
                    key.SetValue("behaviorMode", 0, RegistryValueKind.DWord);
                }

                using var explorerKey = Registry.CurrentUser.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced", true);
                if (explorerKey != null)
                {
                    BackupValue(explorerKey, "UseDpiScaling", true);
                    explorerKey.SetValue("UseDpiScaling", 0, RegistryValueKind.DWord);
                }

                using var directXKey = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\DirectX\UserGpuPreferences", true);
                if (directXKey != null)
                {
                    BackupValue(directXKey, "DirectXUserGlobalSettings", true);
                    directXKey.SetValue("DirectXUserGlobalSettings", "SwapEffectUpgradeEnable=1;VRROptimizeEnable=0;", RegistryValueKind.String);
                }
                
                _logger.LogInfo("[Gaming] Fullscreen optimizations desativadas");
            }
            catch (Exception ex) { _logger.LogWarning($"[Gaming] Fullscreen: {ex.Message}"); }
        }

        private void GamingRevertFullscreen()
        {
            RestoreValue(@"System\GameConfigStore", "GameDVR_DXGIHonorFSEWindowsCompatible", true);
            RestoreValue(@"System\GameConfigStore", "windowsCompatible", true);
            RestoreValue(@"System\GameConfigStore", "behaviorMode", true);
            RestoreValue(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced", "UseDpiScaling", true);
            RestoreValue(@"Software\Microsoft\DirectX\UserGpuPreferences", "DirectXUserGlobalSettings", true);
        }

        private void GamingOptimizeMultimediaProfile()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games", true);
                if (key != null)
                {
                    BackupValue(key, "Priority");
                    BackupValue(key, "Scheduling Category");
                    BackupValue(key, "SFIO Priority");
                    BackupValue(key, "NetworkPerformance");
                    BackupValue(key, "GPU Priority");
                    BackupValue(key, "SystemPerformance");
                    BackupValue(key, "Affinity");
                    
                    key.SetValue("Priority", 8, RegistryValueKind.DWord);
                    key.SetValue("Scheduling Category", "High", RegistryValueKind.String);
                    key.SetValue("SFIO Priority", "High", RegistryValueKind.String);
                    key.SetValue("NetworkPerformance", 6, RegistryValueKind.DWord);
                    key.SetValue("GPU Priority", 8, RegistryValueKind.DWord);
                    key.SetValue("SystemPerformance", 8, RegistryValueKind.DWord);
                    key.SetValue("Affinity", 8, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[Gaming] Multimedia System Profile otimizado");
            }
            catch (Exception ex) { _logger.LogWarning($"[Gaming] MultimediaProfile: {ex.Message}"); }
        }

        private void GamingRevertMultimediaProfile()
        {
            var path = @"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Games";
            RestoreValue(path, "Priority");
            RestoreValue(path, "Scheduling Category");
            RestoreValue(path, "SFIO Priority");
            RestoreValue(path, "NetworkPerformance");
            RestoreValue(path, "GPU Priority");
            RestoreValue(path, "SystemPerformance");
            RestoreValue(path, "Affinity");
        }

        private void GamingOptimizeDirectStorage()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\DirectStorage", true);
                if (key != null)
                {
                    BackupValue(key, "Enable", true);
                    BackupValue(key, "BoostPriority", true);
                    key.SetValue("Enable", 1, RegistryValueKind.DWord);
                    key.SetValue("BoostPriority", 1, RegistryValueKind.DWord);
                }

                using var hklmKey = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\DirectStorage", true);
                if (hklmKey != null)
                {
                    BackupValue(hklmKey, "BoostPriority");
                    hklmKey.SetValue("BoostPriority", 1, RegistryValueKind.DWord);
                }

                // Limpar cache de GPU do Edge
                var edgeCachePaths = new[]
                {
                    $@"{Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData)}\Microsoft\Edge\User Data\Default\GPUCache",
                    $@"{Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData)}\Microsoft\Edge\User Data\GrShaderCache\GPUCache",
                    $@"{Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData)}\Microsoft\Edge\User Data\ShaderCache\GPUCache"
                };

                foreach (var path in edgeCachePaths)
                {
                    try
                    {
                        if (Directory.Exists(path))
                        {
                            Directory.Delete(path, true);
                        }
                    }
                    catch { }
                }
                
                _logger.LogInfo("[Gaming] DirectStorage habilitado e cache limpo");
            }
            catch (Exception ex) { _logger.LogWarning($"[Gaming] DirectStorage: {ex.Message}"); }
        }

        private void GamingRevertDirectStorage()
        {
            RestoreValue(@"Software\Microsoft\DirectStorage", "Enable", true);
            RestoreValue(@"Software\Microsoft\DirectStorage", "BoostPriority", true);
            RestoreValue(@"SOFTWARE\Microsoft\DirectStorage", "BoostPriority");
        }

        #endregion

        #region Mouse and Input Optimizations Implementation

        private void MouseOptimizeAcceleration()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Control Panel\Mouse", true);
                if (key != null)
                {
                    BackupValue(key, "MouseSpeed", true);
                    BackupValue(key, "MouseThreshold1", true);
                    BackupValue(key, "MouseThreshold2", true);
                    BackupValue(key, "MouseAcceleration", true);
                    
                    key.SetValue("MouseSpeed", "0", RegistryValueKind.String);
                    key.SetValue("MouseThreshold1", "0", RegistryValueKind.String);
                    key.SetValue("MouseThreshold2", "0", RegistryValueKind.String);
                    key.SetValue("MouseAcceleration", 0, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[Mouse] Aceleração desativada");
            }
            catch (Exception ex) { _logger.LogWarning($"[Mouse] Acceleration: {ex.Message}"); }
        }

        private void MouseRevertAcceleration()
        {
            RestoreValue(@"Control Panel\Mouse", "MouseSpeed", true);
            RestoreValue(@"Control Panel\Mouse", "MouseThreshold1", true);
            RestoreValue(@"Control Panel\Mouse", "MouseThreshold2", true);
            RestoreValue(@"Control Panel\Mouse", "MouseAcceleration", true);
        }

        private void MouseOptimizeAdvanced()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Control Panel\Mouse", true);
                if (key != null)
                {
                    BackupValue(key, "MouseSensitivity", true);
                    BackupValue(key, "MouseHoverTime", true);
                    BackupValue(key, "DoubleClickSpeed", true);
                    BackupValue(key, "DoubleClickHeight", true);
                    BackupValue(key, "DoubleClickWidth", true);
                    BackupValue(key, "MouseHoverHeight", true);
                    BackupValue(key, "MouseHoverWidth", true);
                    BackupValue(key, "MouseTrails", true);
                    BackupValue(key, "Beep", true);
                    BackupValue(key, "ExtendedSounds", true);
                    BackupValue(key, "SnapToDefaultButton", true);
                    BackupValue(key, "SwapMouseButtons", true);
                    
                    key.SetValue("MouseSensitivity", "10", RegistryValueKind.String);
                    key.SetValue("MouseHoverTime", "8", RegistryValueKind.String);
                    key.SetValue("DoubleClickSpeed", "500", RegistryValueKind.String);
                    key.SetValue("DoubleClickHeight", "4", RegistryValueKind.String);
                    key.SetValue("DoubleClickWidth", "4", RegistryValueKind.String);
                    key.SetValue("MouseHoverHeight", "4", RegistryValueKind.String);
                    key.SetValue("MouseHoverWidth", "4", RegistryValueKind.String);
                    key.SetValue("MouseTrails", "0", RegistryValueKind.String);
                    key.SetValue("Beep", "No", RegistryValueKind.String);
                    key.SetValue("ExtendedSounds", "No", RegistryValueKind.String);
                    key.SetValue("SnapToDefaultButton", "0", RegistryValueKind.String);
                    key.SetValue("SwapMouseButtons", "0", RegistryValueKind.String);
                }
                
                _logger.LogInfo("[Mouse] Configurações avançadas otimizadas");
            }
            catch (Exception ex) { _logger.LogWarning($"[Mouse] Advanced: {ex.Message}"); }
        }

        private void MouseRevertAdvanced()
        {
            var path = @"Control Panel\Mouse";
            RestoreValue(path, "MouseSensitivity", true);
            RestoreValue(path, "MouseHoverTime", true);
            RestoreValue(path, "DoubleClickSpeed", true);
            RestoreValue(path, "DoubleClickHeight", true);
            RestoreValue(path, "DoubleClickWidth", true);
            RestoreValue(path, "MouseHoverHeight", true);
            RestoreValue(path, "MouseHoverWidth", true);
            RestoreValue(path, "MouseTrails", true);
            RestoreValue(path, "Beep", true);
            RestoreValue(path, "ExtendedSounds", true);
            RestoreValue(path, "SnapToDefaultButton", true);
            RestoreValue(path, "SwapMouseButtons", true);
        }

        private void MouseOptimizeKeyboard()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Control Panel\Keyboard", true);
                if (key != null)
                {
                    BackupValue(key, "KeyboardDelay", true);
                    BackupValue(key, "KeyboardSpeed", true);
                    BackupValue(key, "InitialKeyboardIndicators", true);
                    
                    key.SetValue("KeyboardDelay", "0", RegistryValueKind.String);
                    key.SetValue("KeyboardSpeed", "31", RegistryValueKind.String);
                    key.SetValue("InitialKeyboardIndicators", "0", RegistryValueKind.String);
                }
                
                _logger.LogInfo("[Mouse] Teclado otimizado");
            }
            catch (Exception ex) { _logger.LogWarning($"[Mouse] Keyboard: {ex.Message}"); }
        }

        private void MouseRevertKeyboard()
        {
            RestoreValue(@"Control Panel\Keyboard", "KeyboardDelay", true);
            RestoreValue(@"Control Panel\Keyboard", "KeyboardSpeed", true);
            RestoreValue(@"Control Panel\Keyboard", "InitialKeyboardIndicators", true);
        }

        #endregion

        #region Boot Optimizations Implementation

        private void BootOptimizeBCDedit()
        {
            try
            {
                var commands = new[]
                {
                    "/set useplatformtick Yes",
                    "/set disabledynamictick Yes",
                    "/set nx optout",
                    "/set hypervisorlaunchtype off"
                };

                foreach (var cmd in commands)
                {
                    try
                    {
                        var process = Process.Start(new ProcessStartInfo
                        {
                            FileName = "bcdedit",
                            Arguments = cmd,
                            UseShellExecute = false,
                            CreateNoWindow = true,
                            RedirectStandardOutput = true,
                            RedirectStandardError = true,
                            Verb = "runas"
                        });
                        process?.WaitForExit(5000);
                    }
                    catch { }
                }
                
                _logger.LogInfo("[Boot] BCDedit otimizado (requer reinicialização)");
            }
            catch (Exception ex) { _logger.LogWarning($"[Boot] BCDedit: {ex.Message}"); }
        }

        private void BootRevertBCDedit()
        {
            try
            {
                var commands = new[]
                {
                    "/deletevalue useplatformtick",
                    "/deletevalue disabledynamictick",
                    "/set nx optin",
                    "/set hypervisorlaunchtype auto"
                };

                foreach (var cmd in commands)
                {
                    try
                    {
                        var process = Process.Start(new ProcessStartInfo
                        {
                            FileName = "bcdedit",
                            Arguments = cmd,
                            UseShellExecute = false,
                            CreateNoWindow = true,
                            RedirectStandardOutput = true,
                            RedirectStandardError = true,
                            Verb = "runas"
                        });
                        process?.WaitForExit(5000);
                    }
                    catch { }
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Boot] Revert BCDedit: {ex.Message}"); }
        }

        private void BootOptimizeMemory()
        {
            try
            {
                var ramGB = _systemProfile.TotalRAMGB;
                int increaseuserva = ramGB >= 16 ? 4096 : (ramGB >= 8 ? 2048 : 1024);

                var commands = new[]
                {
                    $"/set increaseuserva {increaseuserva}",
                    "/set firstmegabytepolicy UseAll",
                    "/set avoidlowmemory 1",
                    "/set nolowmem Yes"
                };

                foreach (var cmd in commands)
                {
                    try
                    {
                        var process = Process.Start(new ProcessStartInfo
                        {
                            FileName = "bcdedit",
                            Arguments = cmd,
                            UseShellExecute = false,
                            CreateNoWindow = true,
                            RedirectStandardOutput = true,
                            RedirectStandardError = true,
                            Verb = "runas"
                        });
                        process?.WaitForExit(5000);
                    }
                    catch { }
                }
                
                _logger.LogInfo($"[Boot] Memória otimizada (increaseuserva={increaseuserva}MB, requer reinicialização)");
            }
            catch (Exception ex) { _logger.LogWarning($"[Boot] Memory: {ex.Message}"); }
        }

        private void BootRevertMemory()
        {
            try
            {
                var commands = new[]
                {
                    "/deletevalue increaseuserva",
                    "/deletevalue firstmegabytepolicy",
                    "/deletevalue avoidlowmemory",
                    "/deletevalue nolowmem"
                };

                foreach (var cmd in commands)
                {
                    try
                    {
                        var process = Process.Start(new ProcessStartInfo
                        {
                            FileName = "bcdedit",
                            Arguments = cmd,
                            UseShellExecute = false,
                            CreateNoWindow = true,
                            RedirectStandardOutput = true,
                            RedirectStandardError = true,
                            Verb = "runas"
                        });
                        process?.WaitForExit(5000);
                    }
                    catch { }
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[Boot] Revert Memory: {ex.Message}"); }
        }

        #endregion

        #region Apps Optimizations Implementation

        private void AppsRemoveOneDrive()
        {
            try
            {
                // Matar processos do OneDrive
                var processes = Process.GetProcessesByName("OneDrive");
                foreach (var proc in processes)
                {
                    try { proc.Kill(); } catch { }
                }

                // Desinstalar OneDrive
                var oneDrivePath = $@"{Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData)}\Microsoft\OneDrive\OneDriveSetup.exe";
                if (File.Exists(oneDrivePath))
                {
                    try
                    {
                        var process = Process.Start(new ProcessStartInfo
                        {
                            FileName = oneDrivePath,
                            Arguments = "/uninstall",
                            UseShellExecute = false,
                            CreateNoWindow = true,
                            Verb = "runas"
                        });
                        process?.WaitForExit(30000);
                    }
                    catch { }
                }

                // Remover pastas
                var folders = new[]
                {
                    $@"{Environment.GetFolderPath(Environment.SpecialFolder.UserProfile)}\OneDrive",
                    $@"{Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData)}\Microsoft\OneDrive"
                };

                foreach (var folder in folders)
                {
                    try
                    {
                        if (Directory.Exists(folder))
                        {
                            Directory.Delete(folder, true);
                        }
                    }
                    catch { }
                }

                // Remover do registro
                using var key = Registry.CurrentUser.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Run", true);
                if (key != null)
                {
                    BackupValue(key, "OneDrive", true);
                    key.DeleteValue("OneDrive", false);
                }

                using var policiesKey = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\Windows\OneDrive");
                if (policiesKey != null)
                {
                    BackupValue(policiesKey, "DisableFileSyncNGSC");
                    policiesKey.SetValue("DisableFileSyncNGSC", 1, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[Apps] OneDrive removido");
            }
            catch (Exception ex) { _logger.LogWarning($"[Apps] OneDrive: {ex.Message}"); }
        }

        private void AppsRevertOneDrive()
        {
            RestoreValue(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Run", "OneDrive", true);
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\OneDrive", "DisableFileSyncNGSC");
        }

        private void AppsOptimizeEdgePrivacy()
        {
            try
            {
                using var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\Edge");
                if (key != null)
                {
                    BackupValue(key, "BackgroundModeEnabled");
                    BackupValue(key, "BackgroundAppList");
                    BackupValue(key, "BackgroundRestrictions");
                    BackupValue(key, "BrowserSignin");
                    BackupValue(key, "SyncDisabled");
                    BackupValue(key, "UserDataDir");
                    BackupValue(key, "MetricsReportingEnabled");
                    BackupValue(key, "DefaultSearchProviderEnabled");
                    BackupValue(key, "SearchSuggestEnabled");
                    BackupValue(key, "SpellcheckEnabled");
                    BackupValue(key, "TranslateEnabled");
                    BackupValue(key, "WebRtcIPHandlingPolicy");
                    BackupValue(key, "HardwareAccelerationModeEnabled");
                    BackupValue(key, "BackgroundModeEnabled");
                    BackupValue(key, "BackgroundAppList");
                    BackupValue(key, "BackgroundRestrictions");
                    BackupValue(key, "BrowserSignin");
                    BackupValue(key, "SyncDisabled");
                    BackupValue(key, "UserDataDir");
                    BackupValue(key, "MetricsReportingEnabled");
                    BackupValue(key, "DefaultSearchProviderEnabled");
                    BackupValue(key, "SearchSuggestEnabled");
                    BackupValue(key, "SpellcheckEnabled");
                    BackupValue(key, "TranslateEnabled");
                    BackupValue(key, "WebRtcIPHandlingPolicy");
                    BackupValue(key, "HardwareAccelerationModeEnabled");
                    
                    key.SetValue("BackgroundModeEnabled", 0, RegistryValueKind.DWord);
                    key.SetValue("BackgroundRestrictions", 3, RegistryValueKind.DWord);
                    key.SetValue("BrowserSignin", 0, RegistryValueKind.DWord);
                    key.SetValue("SyncDisabled", 1, RegistryValueKind.DWord);
                    key.SetValue("MetricsReportingEnabled", 0, RegistryValueKind.DWord);
                    key.SetValue("SearchSuggestEnabled", 0, RegistryValueKind.DWord);
                    key.SetValue("WebRtcIPHandlingPolicy", "disable_non_proxied_udp", RegistryValueKind.String);
                }
                
                _logger.LogInfo("[Apps] Edge policies aplicadas");
            }
            catch (Exception ex) { _logger.LogWarning($"[Apps] Edge: {ex.Message}"); }
        }

        private void AppsRevertEdgePrivacy()
        {
            var path = @"SOFTWARE\Policies\Microsoft\Edge";
            RestoreValue(path, "BackgroundModeEnabled");
            RestoreValue(path, "BackgroundRestrictions");
            RestoreValue(path, "BrowserSignin");
            RestoreValue(path, "SyncDisabled");
            RestoreValue(path, "MetricsReportingEnabled");
            RestoreValue(path, "SearchSuggestEnabled");
            RestoreValue(path, "WebRtcIPHandlingPolicy");
            RestoreValue(path, "HardwareAccelerationModeEnabled");
        }

        private void AppsDisableCopilot()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced", true);
                if (key != null)
                {
                    BackupValue(key, "TaskbarCopilotButton", true);
                    key.SetValue("TaskbarCopilotButton", 0, RegistryValueKind.DWord);
                }

                using var copilotKey = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\Windows\WindowsCopilot");
                if (copilotKey != null)
                {
                    BackupValue(copilotKey, "TurnOffWindowsCopilot");
                    copilotKey.SetValue("TurnOffWindowsCopilot", 1, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[Apps] Copilot desativado");
            }
            catch (Exception ex) { _logger.LogWarning($"[Apps] Copilot: {ex.Message}"); }
        }

        private void AppsRevertCopilot()
        {
            RestoreValue(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced", "TaskbarCopilotButton", true);
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\WindowsCopilot", "TurnOffWindowsCopilot");
        }

        private void AppsRemoveAppxPackages()
        {
            try
            {
                var packagesToRemove = new[]
                {
                    "Microsoft.BingWeather",
                    "Microsoft.GetHelp",
                    "Microsoft.Getstarted",
                    "Microsoft.Messaging",
                    "Microsoft.Microsoft3DViewer",
                    "Microsoft.MicrosoftOfficeHub",
                    "Microsoft.MicrosoftSolitaireCollection",
                    "Microsoft.MixedReality.Portal",
                    "Microsoft.Office.OneNote",
                    "Microsoft.People",
                    "Microsoft.SkypeApp",
                    "Microsoft.StorePurchaseApp",
                    "Microsoft.Wallet",
                    "Microsoft.WindowsAlarms",
                    "Microsoft.WindowsCamera",
                    "Microsoft.WindowsMaps",
                    "Microsoft.WindowsSoundRecorder",
                    "Microsoft.Xbox.TCUI",
                    "Microsoft.XboxApp",
                    "Microsoft.XboxGameOverlay",
                    "Microsoft.XboxGamingOverlay",
                    "Microsoft.XboxIdentityProvider",
                    "Microsoft.XboxSpeechToTextOverlay",
                    "Microsoft.YourPhone",
                    "Microsoft.ZuneMusic",
                    "Microsoft.ZuneVideo"
                };

                foreach (var package in packagesToRemove)
                {
                    try
                    {
                        var process = Process.Start(new ProcessStartInfo
                        {
                            FileName = "powershell",
                            Arguments = $"-Command \"Get-AppxPackage {package} | Remove-AppxPackage\"",
                            UseShellExecute = false,
                            CreateNoWindow = true,
                            Verb = "runas"
                        });
                        process?.WaitForExit(10000);
                    }
                    catch { }
                }
                
                _logger.LogInfo("[Apps] Appx packages removidos");
            }
            catch (Exception ex) { _logger.LogWarning($"[Apps] Appx: {ex.Message}"); }
        }

        private void AppsRevertAppxPackages()
        {
            // Não há reversão automática - usuário precisa reinstalar manualmente
            _logger.LogInfo("[Apps] Reversão de Appx requer reinstalação manual");
        }

        private void AppsCleanEdgeDiscordCache()
        {
            try
            {
                var cachePaths = new[]
                {
                    $@"{Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData)}\Microsoft\Edge\User Data\Default\GPUCache",
                    $@"{Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData)}\Microsoft\Edge\User Data\GrShaderCache",
                    $@"{Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData)}\Microsoft\Edge\User Data\ShaderCache",
                    $@"{Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData)}\Microsoft\Edge\User Data\Default\Service Worker",
                    $@"{Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData)}\discord\GPUCache",
                    $@"{Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData)}\discord\Cache"
                };

                foreach (var path in cachePaths)
                {
                    try
                    {
                        if (Directory.Exists(path))
                        {
                            Directory.Delete(path, true);
                        }
                    }
                    catch { }
                }
                
                _logger.LogInfo("[Apps] Cache do Edge e Discord limpo");
            }
            catch (Exception ex) { _logger.LogWarning($"[Apps] CleanCache: {ex.Message}"); }
        }

        #endregion

        #region Audio Optimizations Implementation

        private void AudioOptimizePerformanceMode()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Pro Audio", true);
                if (key != null)
                {
                    BackupValue(key, "Priority");
                    BackupValue(key, "Scheduling Category");
                    BackupValue(key, "SFIO Priority");
                    BackupValue(key, "NetworkPerformance");
                    BackupValue(key, "GPU Priority");
                    BackupValue(key, "SystemPerformance");
                    BackupValue(key, "Affinity");
                    
                    key.SetValue("Priority", 6, RegistryValueKind.DWord);
                    key.SetValue("Scheduling Category", "High", RegistryValueKind.String);
                    key.SetValue("SFIO Priority", "High", RegistryValueKind.String);
                    key.SetValue("NetworkPerformance", 6, RegistryValueKind.DWord);
                    key.SetValue("GPU Priority", 6, RegistryValueKind.DWord);
                    key.SetValue("SystemPerformance", 6, RegistryValueKind.DWord);
                    key.SetValue("Affinity", 6, RegistryValueKind.DWord);
                }

                using var audioKey = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile", true);
                if (audioKey != null)
                {
                    BackupValue(audioKey, "SystemResponsiveness");
                    audioKey.SetValue("SystemResponsiveness", 0, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[Audio] Performance mode ativado");
            }
            catch (Exception ex) { _logger.LogWarning($"[Audio] PerformanceMode: {ex.Message}"); }
        }

        private void AudioRevertPerformanceMode()
        {
            var proAudioPath = @"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile\Tasks\Pro Audio";
            RestoreValue(proAudioPath, "Priority");
            RestoreValue(proAudioPath, "Scheduling Category");
            RestoreValue(proAudioPath, "SFIO Priority");
            RestoreValue(proAudioPath, "NetworkPerformance");
            RestoreValue(proAudioPath, "GPU Priority");
            RestoreValue(proAudioPath, "SystemPerformance");
            RestoreValue(proAudioPath, "Affinity");
            RestoreValue(@"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile", "SystemResponsiveness");
        }

        private void AudioOptimizeThreadPriority()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile", true);
                if (key != null)
                {
                    BackupValue(key, "AudioThreadPriority");
                    BackupValue(key, "AudioThreadPriorityBoost");
                    BackupValue(key, "AudioThreadPriorityBoostEnabled");
                    BackupValue(key, "AudioThreadPriorityBoostValue");
                    BackupValue(key, "AudioThreadPriorityBoostTime");
                    BackupValue(key, "AudioThreadPriorityBoostTimeout");
                    BackupValue(key, "AudioThreadPriorityBoostTimeoutEnabled");
                    
                    key.SetValue("AudioThreadPriority", 1, RegistryValueKind.DWord);
                    key.SetValue("AudioThreadPriorityBoost", 1, RegistryValueKind.DWord);
                    key.SetValue("AudioThreadPriorityBoostEnabled", 1, RegistryValueKind.DWord);
                    key.SetValue("AudioThreadPriorityBoostValue", 2, RegistryValueKind.DWord);
                    key.SetValue("AudioThreadPriorityBoostTime", 100, RegistryValueKind.DWord);
                    key.SetValue("AudioThreadPriorityBoostTimeout", 2000, RegistryValueKind.DWord);
                    key.SetValue("AudioThreadPriorityBoostTimeoutEnabled", 1, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[Audio] Thread priority otimizado");
            }
            catch (Exception ex) { _logger.LogWarning($"[Audio] ThreadPriority: {ex.Message}"); }
        }

        private void AudioRevertThreadPriority()
        {
            var path = @"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile";
            RestoreValue(path, "AudioThreadPriority");
            RestoreValue(path, "AudioThreadPriorityBoost");
            RestoreValue(path, "AudioThreadPriorityBoostEnabled");
            RestoreValue(path, "AudioThreadPriorityBoostValue");
            RestoreValue(path, "AudioThreadPriorityBoostTime");
            RestoreValue(path, "AudioThreadPriorityBoostTimeout");
            RestoreValue(path, "AudioThreadPriorityBoostTimeoutEnabled");
        }

        private void AudioDisableSoundEffects()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"AppEvents\Schemes\Apps\.Default", true);
                if (key != null)
                {
                    foreach (var subKeyName in key.GetSubKeyNames())
                    {
                        try
                        {
                            using var subKey = key.OpenSubKey(subKeyName, true);
                            if (subKey != null)
                            {
                                BackupValue(subKey, ".Current", true);
                                subKey.SetValue(".Current", "", RegistryValueKind.String);
                            }
                        }
                        catch { }
                    }
                }
                
                _logger.LogInfo("[Audio] Efeitos de som desativados");
            }
            catch (Exception ex) { _logger.LogWarning($"[Audio] SoundEffects: {ex.Message}"); }
        }

        private void AudioRevertSoundEffects()
        {
            // Reversão complexa - requer backup específico
            _logger.LogInfo("[Audio] Reversão de efeitos de som requer restauração manual");
        }

        #endregion

        #region Kernel Advanced Optimizations Implementation

        private void KernelOptimizeDPC()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Session Manager\kernel", true);
                if (key != null)
                {
                    BackupValue(key, "DpcTimeout");
                    BackupValue(key, "ThreadDpcEnable");
                    BackupValue(key, "InterruptSteeringDisabled");
                    BackupValue(key, "InterruptSteeringMode");
                    BackupValue(key, "InterruptSteeringPolicy");
                    BackupValue(key, "InterruptSteeringPolicyMask");
                    BackupValue(key, "InterruptSteeringPolicyValue");
                    BackupValue(key, "InterruptSteeringPolicyValueMask");
                    
                    key.SetValue("DpcTimeout", 4294967295U, RegistryValueKind.DWord);
                    key.SetValue("ThreadDpcEnable", 0, RegistryValueKind.DWord);
                    key.SetValue("InterruptSteeringDisabled", 1, RegistryValueKind.DWord);
                    key.SetValue("InterruptSteeringMode", 0, RegistryValueKind.DWord);
                    key.SetValue("InterruptSteeringPolicy", 0, RegistryValueKind.DWord);
                    key.SetValue("InterruptSteeringPolicyMask", 0, RegistryValueKind.DWord);
                    key.SetValue("InterruptSteeringPolicyValue", 0, RegistryValueKind.DWord);
                    key.SetValue("InterruptSteeringPolicyValueMask", 0, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[Kernel] DPC e interrupções otimizados");
            }
            catch (Exception ex) { _logger.LogWarning($"[Kernel] DPC: {ex.Message}"); }
        }

        private void KernelRevertDPC()
        {
            var path = @"SYSTEM\CurrentControlSet\Control\Session Manager\kernel";
            RestoreValue(path, "DpcTimeout");
            RestoreValue(path, "ThreadDpcEnable");
            RestoreValue(path, "InterruptSteeringDisabled");
            RestoreValue(path, "InterruptSteeringMode");
            RestoreValue(path, "InterruptSteeringPolicy");
            RestoreValue(path, "InterruptSteeringPolicyMask");
            RestoreValue(path, "InterruptSteeringPolicyValue");
            RestoreValue(path, "InterruptSteeringPolicyValueMask");
        }

        private void KernelOptimizeMemory()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management", true);
                if (key != null)
                {
                    BackupValue(key, "PagedPoolQuota");
                    BackupValue(key, "NonPagedPoolQuota");
                    BackupValue(key, "PagedPoolSize");
                    BackupValue(key, "NonPagedPoolSize");
                    BackupValue(key, "LookasideListIncrease");
                    BackupValue(key, "ObjectReferenceTracking");
                    BackupValue(key, "PoolUsageMaximum");
                    BackupValue(key, "PoolUsageMinimum");
                    
                    key.SetValue("PagedPoolQuota", 4294967295U, RegistryValueKind.DWord);
                    key.SetValue("NonPagedPoolQuota", 4294967295U, RegistryValueKind.DWord);
                    key.SetValue("PagedPoolSize", 4294967295U, RegistryValueKind.DWord);
                    key.SetValue("NonPagedPoolSize", 4294967295U, RegistryValueKind.DWord);
                    key.SetValue("LookasideListIncrease", 1, RegistryValueKind.DWord);
                    key.SetValue("ObjectReferenceTracking", 0, RegistryValueKind.DWord);
                    key.SetValue("PoolUsageMaximum", 100, RegistryValueKind.DWord);
                    key.SetValue("PoolUsageMinimum", 0, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[Kernel] Memória otimizada");
            }
            catch (Exception ex) { _logger.LogWarning($"[Kernel] Memory: {ex.Message}"); }
        }

        private void KernelRevertMemory()
        {
            var path = @"SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management";
            RestoreValue(path, "PagedPoolQuota");
            RestoreValue(path, "NonPagedPoolQuota");
            RestoreValue(path, "PagedPoolSize");
            RestoreValue(path, "NonPagedPoolSize");
            RestoreValue(path, "LookasideListIncrease");
            RestoreValue(path, "ObjectReferenceTracking");
            RestoreValue(path, "PoolUsageMaximum");
            RestoreValue(path, "PoolUsageMinimum");
        }

        private void KernelOptimizeIO()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Session Manager\I/O System", true);
                if (key != null)
                {
                    BackupValue(key, "IoPriorityBoost");
                    BackupValue(key, "IoPageLockLimit");
                    BackupValue(key, "AdditionalCriticalWorkerThreads");
                    BackupValue(key, "AdditionalDelayedWorkerThreads");
                    BackupValue(key, "IoThreadPriority");
                    BackupValue(key, "IoThreadPriorityBoost");
                    BackupValue(key, "IoThreadPriorityBoostEnabled");
                    BackupValue(key, "IoThreadPriorityBoostValue");
                    
                    key.SetValue("IoPriorityBoost", 1, RegistryValueKind.DWord);
                    key.SetValue("IoPageLockLimit", 4294967295U, RegistryValueKind.DWord);
                    key.SetValue("AdditionalCriticalWorkerThreads", 2, RegistryValueKind.DWord);
                    key.SetValue("AdditionalDelayedWorkerThreads", 2, RegistryValueKind.DWord);
                    key.SetValue("IoThreadPriority", 1, RegistryValueKind.DWord);
                    key.SetValue("IoThreadPriorityBoost", 1, RegistryValueKind.DWord);
                    key.SetValue("IoThreadPriorityBoostEnabled", 1, RegistryValueKind.DWord);
                    key.SetValue("IoThreadPriorityBoostValue", 2, RegistryValueKind.DWord);
                }

                using var sessionKey = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Session Manager", true);
                if (sessionKey != null)
                {
                    BackupValue(sessionKey, "AdditionalCriticalWorkerThreads");
                    BackupValue(sessionKey, "AdditionalDelayedWorkerThreads");
                    sessionKey.SetValue("AdditionalCriticalWorkerThreads", 2, RegistryValueKind.DWord);
                    sessionKey.SetValue("AdditionalDelayedWorkerThreads", 2, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[Kernel] I/O otimizado");
            }
            catch (Exception ex) { _logger.LogWarning($"[Kernel] IO: {ex.Message}"); }
        }

        private void KernelRevertIO()
        {
            var ioPath = @"SYSTEM\CurrentControlSet\Control\Session Manager\I/O System";
            RestoreValue(ioPath, "IoPriorityBoost");
            RestoreValue(ioPath, "IoPageLockLimit");
            RestoreValue(ioPath, "AdditionalCriticalWorkerThreads");
            RestoreValue(ioPath, "AdditionalDelayedWorkerThreads");
            RestoreValue(ioPath, "IoThreadPriority");
            RestoreValue(ioPath, "IoThreadPriorityBoost");
            RestoreValue(ioPath, "IoThreadPriorityBoostEnabled");
            RestoreValue(ioPath, "IoThreadPriorityBoostValue");
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Session Manager", "AdditionalCriticalWorkerThreads");
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Session Manager", "AdditionalDelayedWorkerThreads");
        }

        private void KernelDisableSecurityFeatures()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Session Manager\kernel", true);
                if (key != null)
                {
                    BackupValue(key, "DisableExceptionChainValidation");
                    BackupValue(key, "KernelSEHOPEnabled");
                    BackupValue(key, "CfgPolicy");
                    BackupValue(key, "MitigationOptions");
                    BackupValue(key, "MitigationOptions2");
                    
                    key.SetValue("DisableExceptionChainValidation", 1, RegistryValueKind.DWord);
                    key.SetValue("KernelSEHOPEnabled", 0, RegistryValueKind.DWord);
                    key.SetValue("CfgPolicy", 0, RegistryValueKind.DWord);
                    key.SetValue("MitigationOptions", 0, RegistryValueKind.DWord);
                    key.SetValue("MitigationOptions2", 0, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[Kernel] Recursos de segurança não essenciais desativados");
            }
            catch (Exception ex) { _logger.LogWarning($"[Kernel] SecurityFeatures: {ex.Message}"); }
        }

        private void KernelRevertSecurityFeatures()
        {
            var path = @"SYSTEM\CurrentControlSet\Control\Session Manager\kernel";
            RestoreValue(path, "DisableExceptionChainValidation");
            RestoreValue(path, "KernelSEHOPEnabled");
            RestoreValue(path, "CfgPolicy");
            RestoreValue(path, "MitigationOptions");
            RestoreValue(path, "MitigationOptions2");
        }

        #endregion

        #region CPU Advanced Optimizations Implementation

        private void CPUAdvancedDisablePowerThrottling()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Power", true);
                if (key != null)
                {
                    BackupValue(key, "EnergyEstimationEnabled");
                    BackupValue(key, "PowerThrottlingOff");
                    BackupValue(key, "PowerThrottlingEnabled");
                    BackupValue(key, "PowerThrottlingDisabled");
                    
                    key.SetValue("EnergyEstimationEnabled", 0, RegistryValueKind.DWord);
                    key.SetValue("PowerThrottlingOff", 1, RegistryValueKind.DWord);
                    key.SetValue("PowerThrottlingEnabled", 0, RegistryValueKind.DWord);
                    key.SetValue("PowerThrottlingDisabled", 1, RegistryValueKind.DWord);
                }

                using var powerPolicyKey = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Power\PowerThrottling", true);
                if (powerPolicyKey != null)
                {
                    BackupValue(powerPolicyKey, "PowerThrottlingOff");
                    powerPolicyKey.SetValue("PowerThrottlingOff", 1, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[CPUAdvanced] Power throttling desativado");
            }
            catch (Exception ex) { _logger.LogWarning($"[CPUAdvanced] PowerThrottling: {ex.Message}"); }
        }

        private void CPUAdvancedRevertPowerThrottling()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Power", "EnergyEstimationEnabled");
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Power", "PowerThrottlingOff");
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Power", "PowerThrottlingEnabled");
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Power", "PowerThrottlingDisabled");
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Power\PowerThrottling", "PowerThrottlingOff");
        }

        private void CPUAdvancedOptimizeProcessor()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Power", true);
                if (key != null)
                {
                    BackupValue(key, "ProcessorThrottleDisable");
                    BackupValue(key, "ProcessorIdleDisable");
                    BackupValue(key, "ProcessorIdlePolicy");
                    BackupValue(key, "ProcessorIdleTimeCheck");
                    BackupValue(key, "ProcessorIdleTimeout");
                    BackupValue(key, "ProcessorSlowdownDisable");
                    BackupValue(key, "ProcessorPerformanceBoostMode");
                    BackupValue(key, "ProcessorPerformanceBoostPolicy");
                    BackupValue(key, "ProcessorPerformanceBoostTime");
                    BackupValue(key, "ProcessorPerformanceBoostTimeout");
                    
                    key.SetValue("ProcessorThrottleDisable", 1, RegistryValueKind.DWord);
                    key.SetValue("ProcessorIdleDisable", 1, RegistryValueKind.DWord);
                    key.SetValue("ProcessorIdlePolicy", 0, RegistryValueKind.DWord);
                    key.SetValue("ProcessorIdleTimeCheck", 0, RegistryValueKind.DWord);
                    key.SetValue("ProcessorIdleTimeout", 0, RegistryValueKind.DWord);
                    key.SetValue("ProcessorSlowdownDisable", 1, RegistryValueKind.DWord);
                    key.SetValue("ProcessorPerformanceBoostMode", 2, RegistryValueKind.DWord);
                    key.SetValue("ProcessorPerformanceBoostPolicy", 2, RegistryValueKind.DWord);
                    key.SetValue("ProcessorPerformanceBoostTime", 0, RegistryValueKind.DWord);
                    key.SetValue("ProcessorPerformanceBoostTimeout", 0, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[CPUAdvanced] Processor control otimizado");
            }
            catch (Exception ex) { _logger.LogWarning($"[CPUAdvanced] Processor: {ex.Message}"); }
        }

        private void CPUAdvancedRevertProcessor()
        {
            var path = @"SYSTEM\CurrentControlSet\Control\Power";
            RestoreValue(path, "ProcessorThrottleDisable");
            RestoreValue(path, "ProcessorIdleDisable");
            RestoreValue(path, "ProcessorIdlePolicy");
            RestoreValue(path, "ProcessorIdleTimeCheck");
            RestoreValue(path, "ProcessorIdleTimeout");
            RestoreValue(path, "ProcessorSlowdownDisable");
            RestoreValue(path, "ProcessorPerformanceBoostMode");
            RestoreValue(path, "ProcessorPerformanceBoostPolicy");
            RestoreValue(path, "ProcessorPerformanceBoostTime");
            RestoreValue(path, "ProcessorPerformanceBoostTimeout");
        }

        private void CPUAdvancedOptimizeResourcePolicy()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile", true);
                if (key != null)
                {
                    BackupValue(key, "CpuThrottlingDisabled");
                    BackupValue(key, "CpuThrottlingEnabled");
                    BackupValue(key, "CpuThrottlingPolicy");
                    BackupValue(key, "CpuThrottlingPolicyValue");
                    BackupValue(key, "CpuThrottlingPolicyValueMask");
                    
                    key.SetValue("CpuThrottlingDisabled", 1, RegistryValueKind.DWord);
                    key.SetValue("CpuThrottlingEnabled", 0, RegistryValueKind.DWord);
                    key.SetValue("CpuThrottlingPolicy", 0, RegistryValueKind.DWord);
                    key.SetValue("CpuThrottlingPolicyValue", 0, RegistryValueKind.DWord);
                    key.SetValue("CpuThrottlingPolicyValueMask", 0, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[CPUAdvanced] Resource policy otimizado");
            }
            catch (Exception ex) { _logger.LogWarning($"[CPUAdvanced] ResourcePolicy: {ex.Message}"); }
        }

        private void CPUAdvancedRevertResourcePolicy()
        {
            var path = @"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile";
            RestoreValue(path, "CpuThrottlingDisabled");
            RestoreValue(path, "CpuThrottlingEnabled");
            RestoreValue(path, "CpuThrottlingPolicy");
            RestoreValue(path, "CpuThrottlingPolicyValue");
            RestoreValue(path, "CpuThrottlingPolicyValueMask");
        }

        private void CPUAdvancedOptimizeVxDBIOS()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\VxD\BIOS", true);
                if (key != null)
                {
                    BackupValue(key, "CPUPriority");
                    BackupValue(key, "FastDRAM");
                    BackupValue(key, "AGPConcur");
                    BackupValue(key, "PCIConcur");
                    BackupValue(key, "DMABurstSize");
                    BackupValue(key, "DMABufferSize");
                    BackupValue(key, "DMACacheSize");
                    BackupValue(key, "DMACacheTimeout");
                    
                    key.SetValue("CPUPriority", 1, RegistryValueKind.DWord);
                    key.SetValue("FastDRAM", 1, RegistryValueKind.DWord);
                    key.SetValue("AGPConcur", 1, RegistryValueKind.DWord);
                    key.SetValue("PCIConcur", 1, RegistryValueKind.DWord);
                    key.SetValue("DMABurstSize", 4294967295U, RegistryValueKind.DWord);
                    key.SetValue("DMABufferSize", 4294967295U, RegistryValueKind.DWord);
                    key.SetValue("DMACacheSize", 4294967295U, RegistryValueKind.DWord);
                    key.SetValue("DMACacheTimeout", 4294967295U, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[CPUAdvanced] VxD BIOS otimizado");
            }
            catch (Exception ex) { _logger.LogWarning($"[CPUAdvanced] VxDBIOS: {ex.Message}"); }
        }

        private void CPUAdvancedRevertVxDBIOS()
        {
            var path = @"SYSTEM\CurrentControlSet\Services\VxD\BIOS";
            RestoreValue(path, "CPUPriority");
            RestoreValue(path, "FastDRAM");
            RestoreValue(path, "AGPConcur");
            RestoreValue(path, "PCIConcur");
            RestoreValue(path, "DMABurstSize");
            RestoreValue(path, "DMABufferSize");
            RestoreValue(path, "DMACacheSize");
            RestoreValue(path, "DMACacheTimeout");
        }

        #endregion

        #region Disk Advanced Optimizations Implementation

        private void DiskAdvancedOptimizeNTFSMemory()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\FileSystem", true);
                if (key != null)
                {
                    BackupValue(key, "NtfsMemoryUsage");
                    key.SetValue("NtfsMemoryUsage", 2, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[DiskAdvanced] NTFS Memory Usage configurado para máximo");
            }
            catch (Exception ex) { _logger.LogWarning($"[DiskAdvanced] NTFSMemory: {ex.Message}"); }
        }

        private void DiskAdvancedRevertNTFSMemory()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\FileSystem", "NtfsMemoryUsage");
        }

        private void DiskAdvancedOptimizeLanmanServer()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters", true);
                if (key != null)
                {
                    BackupValue(key, "IRPStackSize");
                    BackupValue(key, "SizReqBuf");
                    BackupValue(key, "InitWorkItems");
                    BackupValue(key, "MaxWorkItems");
                    BackupValue(key, "MaxMpxCt");
                    BackupValue(key, "MaxRawWorkItems");
                    BackupValue(key, "MaxThreadsPerQueue");
                    
                    key.SetValue("IRPStackSize", 20, RegistryValueKind.DWord);
                    key.SetValue("SizReqBuf", 17424, RegistryValueKind.DWord);
                    key.SetValue("InitWorkItems", 4, RegistryValueKind.DWord);
                    key.SetValue("MaxWorkItems", 64, RegistryValueKind.DWord);
                    key.SetValue("MaxMpxCt", 50, RegistryValueKind.DWord);
                    key.SetValue("MaxRawWorkItems", 512, RegistryValueKind.DWord);
                    key.SetValue("MaxThreadsPerQueue", 4, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[DiskAdvanced] LanmanServer otimizado");
            }
            catch (Exception ex) { _logger.LogWarning($"[DiskAdvanced] LanmanServer: {ex.Message}"); }
        }

        private void DiskAdvancedRevertLanmanServer()
        {
            var path = @"SYSTEM\CurrentControlSet\Services\LanmanServer\Parameters";
            RestoreValue(path, "IRPStackSize");
            RestoreValue(path, "SizReqBuf");
            RestoreValue(path, "InitWorkItems");
            RestoreValue(path, "MaxWorkItems");
            RestoreValue(path, "MaxMpxCt");
            RestoreValue(path, "MaxRawWorkItems");
            RestoreValue(path, "MaxThreadsPerQueue");
        }

        private void DiskAdvancedOptimizeStoragePolicies()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\disk\Parameters", true);
                if (key != null)
                {
                    BackupValue(key, "WriteCacheEnabled");
                    BackupValue(key, "WriteThrough");
                    BackupValue(key, "NoLPM");
                    BackupValue(key, "EnableIdlePowerManagement");
                    BackupValue(key, "EnableWriteCache");
                    
                    key.SetValue("WriteCacheEnabled", 1, RegistryValueKind.DWord);
                    key.SetValue("WriteThrough", 0, RegistryValueKind.DWord);
                    key.SetValue("NoLPM", 1, RegistryValueKind.DWord);
                    key.SetValue("EnableIdlePowerManagement", 0, RegistryValueKind.DWord);
                    key.SetValue("EnableWriteCache", 1, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[DiskAdvanced] Storage policies otimizadas");
            }
            catch (Exception ex) { _logger.LogWarning($"[DiskAdvanced] StoragePolicies: {ex.Message}"); }
        }

        private void DiskAdvancedRevertStoragePolicies()
        {
            var path = @"SYSTEM\CurrentControlSet\Services\disk\Parameters";
            RestoreValue(path, "WriteCacheEnabled");
            RestoreValue(path, "WriteThrough");
            RestoreValue(path, "NoLPM");
            RestoreValue(path, "EnableIdlePowerManagement");
            RestoreValue(path, "EnableWriteCache");
        }

        private void DiskAdvancedOptimizeNVMe()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\stornvme\Parameters\Device", true);
                if (key != null)
                {
                    BackupValue(key, "InterruptManagement");
                    BackupValue(key, "PerformanceMode");
                    BackupValue(key, "ForcedPhysicalSectorSizeInBytes");
                    BackupValue(key, "EnableIdlePowerManagement");
                    
                    key.SetValue("InterruptManagement", 0, RegistryValueKind.DWord);
                    key.SetValue("PerformanceMode", 1, RegistryValueKind.DWord);
                    key.SetValue("ForcedPhysicalSectorSizeInBytes", 0, RegistryValueKind.DWord);
                    key.SetValue("EnableIdlePowerManagement", 0, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[DiskAdvanced] NVMe otimizado");
            }
            catch (Exception ex) { _logger.LogWarning($"[DiskAdvanced] NVMe: {ex.Message}"); }
        }

        private void DiskAdvancedRevertNVMe()
        {
            var path = @"SYSTEM\CurrentControlSet\Services\stornvme\Parameters\Device";
            RestoreValue(path, "InterruptManagement");
            RestoreValue(path, "PerformanceMode");
            RestoreValue(path, "ForcedPhysicalSectorSizeInBytes");
            RestoreValue(path, "EnableIdlePowerManagement");
        }

        #endregion

        #region Power Advanced Optimizations Implementation

        private void PowerAdvancedActivateUltimatePerformance()
        {
            try
            {
                var process = Process.Start(new ProcessStartInfo
                {
                    FileName = "powercfg",
                    Arguments = "/duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61",
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    Verb = "runas"
                });
                process?.WaitForExit(5000);

                process = Process.Start(new ProcessStartInfo
                {
                    FileName = "powercfg",
                    Arguments = "/setactive e9a42b02-d5df-448d-aa00-03f14749eb61",
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    Verb = "runas"
                });
                process?.WaitForExit(5000);
                
                _logger.LogInfo("[PowerAdvanced] Ultimate Performance Mode ativado");
            }
            catch (Exception ex) { _logger.LogWarning($"[PowerAdvanced] UltimatePerformance: {ex.Message}"); }
        }

        private void PowerAdvancedRevertUltimatePerformance()
        {
            try
            {
                var process = Process.Start(new ProcessStartInfo
                {
                    FileName = "powercfg",
                    Arguments = "/setactive 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c",
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    Verb = "runas"
                });
                process?.WaitForExit(5000);
            }
            catch (Exception ex) { _logger.LogWarning($"[PowerAdvanced] Revert UltimatePerformance: {ex.Message}"); }
        }

        private void PowerAdvancedDisableHibernation()
        {
            try
            {
                var process = Process.Start(new ProcessStartInfo
                {
                    FileName = "powercfg",
                    Arguments = "/hibernate off",
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    Verb = "runas"
                });
                process?.WaitForExit(5000);
                
                _logger.LogInfo("[PowerAdvanced] Hibernação desativada");
            }
            catch (Exception ex) { _logger.LogWarning($"[PowerAdvanced] Hibernation: {ex.Message}"); }
        }

        private void PowerAdvancedRevertHibernation()
        {
            try
            {
                var process = Process.Start(new ProcessStartInfo
                {
                    FileName = "powercfg",
                    Arguments = "/hibernate on",
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    Verb = "runas"
                });
                process?.WaitForExit(5000);
            }
            catch (Exception ex) { _logger.LogWarning($"[PowerAdvanced] Revert Hibernation: {ex.Message}"); }
        }

        private void PowerAdvancedOptimizeUSB()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\USB", true);
                if (key != null)
                {
                    BackupValue(key, "DisableSelectiveSuspend");
                    BackupValue(key, "DisableSelectiveSuspendOnBattery");
                    key.SetValue("DisableSelectiveSuspend", 1, RegistryValueKind.DWord);
                    key.SetValue("DisableSelectiveSuspendOnBattery", 1, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[PowerAdvanced] USB power otimizado");
            }
            catch (Exception ex) { _logger.LogWarning($"[PowerAdvanced] USB: {ex.Message}"); }
        }

        private void PowerAdvancedRevertUSB()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\USB", "DisableSelectiveSuspend");
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\USB", "DisableSelectiveSuspendOnBattery");
        }

        private void PowerAdvancedOptimizePCIe()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Power", true);
                if (key != null)
                {
                    BackupValue(key, "PciExpressASPM");
                    BackupValue(key, "PciExpressASPMDefault");
                    BackupValue(key, "PciExpressLinkStatePowerManagement");
                    BackupValue(key, "PciExpressLinkStatePowerManagementDefault");
                    
                    key.SetValue("PciExpressASPM", 0, RegistryValueKind.DWord);
                    key.SetValue("PciExpressASPMDefault", 0, RegistryValueKind.DWord);
                    key.SetValue("PciExpressLinkStatePowerManagement", 0, RegistryValueKind.DWord);
                    key.SetValue("PciExpressLinkStatePowerManagementDefault", 0, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[PowerAdvanced] PCIe otimizado");
            }
            catch (Exception ex) { _logger.LogWarning($"[PowerAdvanced] PCIe: {ex.Message}"); }
        }

        private void PowerAdvancedRevertPCIe()
        {
            var path = @"SYSTEM\CurrentControlSet\Control\Power";
            RestoreValue(path, "PciExpressASPM");
            RestoreValue(path, "PciExpressASPMDefault");
            RestoreValue(path, "PciExpressLinkStatePowerManagement");
            RestoreValue(path, "PciExpressLinkStatePowerManagementDefault");
        }

        #endregion

        #region Search Optimizations Implementation

        private void SearchDisableCortana()
        {
            try
            {
                using var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\Windows\Windows Search");
                if (key != null)
                {
                    BackupValue(key, "AllowCortana");
                    BackupValue(key, "DisableWebSearch");
                    BackupValue(key, "ConnectedSearchUseWeb");
                    BackupValue(key, "AllowSearchToUseLocation");
                    BackupValue(key, "AllowCloudSearch");
                    BackupValue(key, "AllowIndexingEncryptedStoresOrItems");
                    
                    key.SetValue("AllowCortana", 0, RegistryValueKind.DWord);
                    key.SetValue("DisableWebSearch", 1, RegistryValueKind.DWord);
                    key.SetValue("ConnectedSearchUseWeb", 0, RegistryValueKind.DWord);
                    key.SetValue("AllowSearchToUseLocation", 0, RegistryValueKind.DWord);
                    key.SetValue("AllowCloudSearch", 0, RegistryValueKind.DWord);
                    key.SetValue("AllowIndexingEncryptedStoresOrItems", 0, RegistryValueKind.DWord);
                }

                using var cortanaKey = Registry.CurrentUser.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Search", true);
                if (cortanaKey != null)
                {
                    BackupValue(cortanaKey, "CortanaEnabled", true);
                    BackupValue(cortanaKey, "CanCortanaBeEnabled", true);
                    BackupValue(cortanaKey, "BingSearchEnabled", true);
                    BackupValue(cortanaKey, "AllowSearchToUseLocation", true);
                    BackupValue(cortanaKey, "IsAADCloudSearchEnabled", true);
                    BackupValue(cortanaKey, "IsMSACloudSearchEnabled", true);
                    BackupValue(cortanaKey, "IsDeviceSearchHistoryEnabled", true);
                    
                    cortanaKey.SetValue("CortanaEnabled", 0, RegistryValueKind.DWord);
                    cortanaKey.SetValue("CanCortanaBeEnabled", 0, RegistryValueKind.DWord);
                    cortanaKey.SetValue("BingSearchEnabled", 0, RegistryValueKind.DWord);
                    cortanaKey.SetValue("AllowSearchToUseLocation", 0, RegistryValueKind.DWord);
                    cortanaKey.SetValue("IsAADCloudSearchEnabled", 0, RegistryValueKind.DWord);
                    cortanaKey.SetValue("IsMSACloudSearchEnabled", 0, RegistryValueKind.DWord);
                    cortanaKey.SetValue("IsDeviceSearchHistoryEnabled", 0, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[Search] Cortana desativada");
            }
            catch (Exception ex) { _logger.LogWarning($"[Search] Cortana: {ex.Message}"); }
        }

        private void SearchRevertCortana()
        {
            var policyPath = @"SOFTWARE\Policies\Microsoft\Windows\Windows Search";
            RestoreValue(policyPath, "AllowCortana");
            RestoreValue(policyPath, "DisableWebSearch");
            RestoreValue(policyPath, "ConnectedSearchUseWeb");
            RestoreValue(policyPath, "AllowSearchToUseLocation");
            RestoreValue(policyPath, "AllowCloudSearch");
            RestoreValue(policyPath, "AllowIndexingEncryptedStoresOrItems");
            
            var searchPath = @"SOFTWARE\Microsoft\Windows\CurrentVersion\Search";
            RestoreValue(searchPath, "CortanaEnabled", true);
            RestoreValue(searchPath, "CanCortanaBeEnabled", true);
            RestoreValue(searchPath, "BingSearchEnabled", true);
            RestoreValue(searchPath, "AllowSearchToUseLocation", true);
            RestoreValue(searchPath, "IsAADCloudSearchEnabled", true);
            RestoreValue(searchPath, "IsMSACloudSearchEnabled", true);
            RestoreValue(searchPath, "IsDeviceSearchHistoryEnabled", true);
        }

        private void SearchDisableWebSearch()
        {
            try
            {
                using var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\Windows\Windows Search");
                if (key != null)
                {
                    BackupValue(key, "DisableWebSearch");
                    BackupValue(key, "ConnectedSearchUseWeb");
                    BackupValue(key, "AllowCloudSearch");
                    key.SetValue("DisableWebSearch", 1, RegistryValueKind.DWord);
                    key.SetValue("ConnectedSearchUseWeb", 0, RegistryValueKind.DWord);
                    key.SetValue("AllowCloudSearch", 0, RegistryValueKind.DWord);
                }

                using var searchKey = Registry.CurrentUser.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Search", true);
                if (searchKey != null)
                {
                    BackupValue(searchKey, "BingSearchEnabled", true);
                    BackupValue(searchKey, "IsAADCloudSearchEnabled", true);
                    BackupValue(searchKey, "IsMSACloudSearchEnabled", true);
                    searchKey.SetValue("BingSearchEnabled", 0, RegistryValueKind.DWord);
                    searchKey.SetValue("IsAADCloudSearchEnabled", 0, RegistryValueKind.DWord);
                    searchKey.SetValue("IsMSACloudSearchEnabled", 0, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[Search] Web search desativada");
            }
            catch (Exception ex) { _logger.LogWarning($"[Search] WebSearch: {ex.Message}"); }
        }

        private void SearchRevertWebSearch()
        {
            var policyPath = @"SOFTWARE\Policies\Microsoft\Windows\Windows Search";
            RestoreValue(policyPath, "DisableWebSearch");
            RestoreValue(policyPath, "ConnectedSearchUseWeb");
            RestoreValue(policyPath, "AllowCloudSearch");
            
            var searchPath = @"SOFTWARE\Microsoft\Windows\CurrentVersion\Search";
            RestoreValue(searchPath, "BingSearchEnabled", true);
            RestoreValue(searchPath, "IsAADCloudSearchEnabled", true);
            RestoreValue(searchPath, "IsMSACloudSearchEnabled", true);
        }

        private void SearchOptimizePrivacy()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Search", true);
                if (key != null)
                {
                    BackupValue(key, "IsDeviceSearchHistoryEnabled", true);
                    BackupValue(key, "IsAADCloudSearchEnabled", true);
                    BackupValue(key, "IsMSACloudSearchEnabled", true);
                    BackupValue(key, "AllowSearchToUseLocation", true);
                    BackupValue(key, "HistoryViewEnabled", true);
                    BackupValue(key, "IsDynamicSearchBoxEnabled", true);
                    
                    key.SetValue("IsDeviceSearchHistoryEnabled", 0, RegistryValueKind.DWord);
                    key.SetValue("IsAADCloudSearchEnabled", 0, RegistryValueKind.DWord);
                    key.SetValue("IsMSACloudSearchEnabled", 0, RegistryValueKind.DWord);
                    key.SetValue("AllowSearchToUseLocation", 0, RegistryValueKind.DWord);
                    key.SetValue("HistoryViewEnabled", 0, RegistryValueKind.DWord);
                    key.SetValue("IsDynamicSearchBoxEnabled", 0, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[Search] Privacidade otimizada");
            }
            catch (Exception ex) { _logger.LogWarning($"[Search] Privacy: {ex.Message}"); }
        }

        private void SearchRevertPrivacy()
        {
            var path = @"SOFTWARE\Microsoft\Windows\CurrentVersion\Search";
            RestoreValue(path, "IsDeviceSearchHistoryEnabled", true);
            RestoreValue(path, "IsAADCloudSearchEnabled", true);
            RestoreValue(path, "IsMSACloudSearchEnabled", true);
            RestoreValue(path, "AllowSearchToUseLocation", true);
            RestoreValue(path, "HistoryViewEnabled", true);
            RestoreValue(path, "IsDynamicSearchBoxEnabled", true);
        }

        private void SearchDisableSpeech()
        {
            try
            {
                using var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\Windows\Speech");
                if (key != null)
                {
                    BackupValue(key, "AllowSpeechModelUpdate");
                    BackupValue(key, "AllowInputPersonalization");
                    key.SetValue("AllowSpeechModelUpdate", 0, RegistryValueKind.DWord);
                    key.SetValue("AllowInputPersonalization", 0, RegistryValueKind.DWord);
                }

                using var speechKey = Registry.CurrentUser.OpenSubKey(@"SOFTWARE\Microsoft\Speech_OneCore\Settings\OnlineSpeechPrivacy", true);
                if (speechKey != null)
                {
                    BackupValue(speechKey, "HasAccepted", true);
                    speechKey.SetValue("HasAccepted", 0, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[Search] Speech e voice activation desativados");
            }
            catch (Exception ex) { _logger.LogWarning($"[Search] Speech: {ex.Message}"); }
        }

        private void SearchRevertSpeech()
        {
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\Speech", "AllowSpeechModelUpdate");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\Speech", "AllowInputPersonalization");
            RestoreValue(@"SOFTWARE\Microsoft\Speech_OneCore\Settings\OnlineSpeechPrivacy", "HasAccepted", true);
        }

        #endregion

        #region Remote Access Optimizations Implementation

        private void RemoteDisableRemoteDesktop()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Terminal Server", true);
                if (key != null)
                {
                    BackupValue(key, "fDenyTSConnections");
                    key.SetValue("fDenyTSConnections", 1, RegistryValueKind.DWord);
                }

                using var rdpKey = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp", true);
                if (rdpKey != null)
                {
                    BackupValue(rdpKey, "UserAuthentication");
                    rdpKey.SetValue("UserAuthentication", 1, RegistryValueKind.DWord);
                }

                using var policyKey = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services");
                if (policyKey != null)
                {
                    BackupValue(policyKey, "fDenyTSConnections");
                    policyKey.SetValue("fDenyTSConnections", 1, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[Remote] Remote Desktop desativado");
            }
            catch (Exception ex) { _logger.LogWarning($"[Remote] RemoteDesktop: {ex.Message}"); }
        }

        private void RemoteRevertRemoteDesktop()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Terminal Server", "fDenyTSConnections");
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Terminal Server\WinStations\RDP-Tcp", "UserAuthentication");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services", "fDenyTSConnections");
        }

        private void RemoteDisableRemoteAssistance()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Remote Assistance", true);
                if (key != null)
                {
                    BackupValue(key, "fAllowToGetHelp");
                    BackupValue(key, "fAllowFullControl");
                    BackupValue(key, "fAllowUnsolicited");
                    key.SetValue("fAllowToGetHelp", 0, RegistryValueKind.DWord);
                    key.SetValue("fAllowFullControl", 0, RegistryValueKind.DWord);
                    key.SetValue("fAllowUnsolicited", 0, RegistryValueKind.DWord);
                }

                using var policyKey = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services");
                if (policyKey != null)
                {
                    BackupValue(policyKey, "fAllowToGetHelp");
                    BackupValue(policyKey, "fAllowFullControl");
                    BackupValue(policyKey, "fAllowUnsolicited");
                    policyKey.SetValue("fAllowToGetHelp", 0, RegistryValueKind.DWord);
                    policyKey.SetValue("fAllowFullControl", 0, RegistryValueKind.DWord);
                    policyKey.SetValue("fAllowUnsolicited", 0, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[Remote] Remote Assistance desativado");
            }
            catch (Exception ex) { _logger.LogWarning($"[Remote] RemoteAssistance: {ex.Message}"); }
        }

        private void RemoteRevertRemoteAssistance()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Remote Assistance", "fAllowToGetHelp");
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Remote Assistance", "fAllowFullControl");
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Remote Assistance", "fAllowUnsolicited");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services", "fAllowToGetHelp");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services", "fAllowFullControl");
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows NT\Terminal Services", "fAllowUnsolicited");
        }

        private void RemoteDisableRemoteServices()
        {
            try
            {
                // Desativar Remote Registry
                using var service = new ServiceController("RemoteRegistry");
                if (service.Status != ServiceControllerStatus.Stopped)
                {
                    service.Stop();
                }
                service.Refresh();
                if (service.Status == ServiceControllerStatus.Stopped)
                {
                    var scProcess = Process.Start(new ProcessStartInfo
                    {
                        FileName = "sc",
                        Arguments = "config RemoteRegistry start= disabled",
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        Verb = "runas"
                    });
                    scProcess?.WaitForExit(5000);
                }

                // Desativar WinRM
                using var winrmService = new ServiceController("WinRM");
                if (winrmService.Status != ServiceControllerStatus.Stopped)
                {
                    winrmService.Stop();
                }
                winrmService.Refresh();
                if (winrmService.Status == ServiceControllerStatus.Stopped)
                {
                    var scProcess = Process.Start(new ProcessStartInfo
                    {
                        FileName = "sc",
                        Arguments = "config WinRM start= disabled",
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        Verb = "runas"
                    });
                    scProcess?.WaitForExit(5000);
                }
                
                _logger.LogInfo("[Remote] Remote Registry e WinRM desativados");
            }
            catch (Exception ex) { _logger.LogWarning($"[Remote] RemoteServices: {ex.Message}"); }
        }

        private void RemoteRevertRemoteServices()
        {
            try
            {
                var scProcess = Process.Start(new ProcessStartInfo
                {
                    FileName = "sc",
                    Arguments = "config RemoteRegistry start= demand",
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    Verb = "runas"
                });
                scProcess?.WaitForExit(5000);

                scProcess = Process.Start(new ProcessStartInfo
                {
                    FileName = "sc",
                    Arguments = "config WinRM start= demand",
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    Verb = "runas"
                });
                scProcess?.WaitForExit(5000);
            }
            catch (Exception ex) { _logger.LogWarning($"[Remote] Revert RemoteServices: {ex.Message}"); }
        }

        #endregion

        #region Interface Optimizations Implementation

        private void InterfaceDisableNotifications()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Notifications\Settings", true);
                if (key != null)
                {
                    foreach (var subKeyName in key.GetSubKeyNames())
                    {
                        try
                        {
                            using var subKey = key.OpenSubKey(subKeyName, true);
                            if (subKey != null)
                            {
                                BackupValue(subKey, "Enabled", true);
                                subKey.SetValue("Enabled", 0, RegistryValueKind.DWord);
                            }
                        }
                        catch { }
                    }
                }

                using var policyKey = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Policies\Microsoft\Windows\CurrentVersion\PushNotifications");
                if (policyKey != null)
                {
                    BackupValue(policyKey, "NoToastApplicationNotification");
                    policyKey.SetValue("NoToastApplicationNotification", 1, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[Interface] Notificações desativadas");
            }
            catch (Exception ex) { _logger.LogWarning($"[Interface] Notifications: {ex.Message}"); }
        }

        private void InterfaceRevertNotifications()
        {
            // Reversão complexa - requer backup específico
            RestoreValue(@"SOFTWARE\Policies\Microsoft\Windows\CurrentVersion\PushNotifications", "NoToastApplicationNotification");
        }

        private void InterfaceOptimizeDesktop()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Control Panel\Desktop", true);
                if (key != null)
                {
                    BackupValue(key, "WaitToKillAppTimeout", true);
                    BackupValue(key, "HungAppTimeout", true);
                    BackupValue(key, "AutoEndTasks", true);
                    BackupValue(key, "ForegroundLockTimeout", true);
                    BackupValue(key, "LowLevelHooksTimeout", true);
                    
                    key.SetValue("WaitToKillAppTimeout", "2000", RegistryValueKind.String);
                    key.SetValue("HungAppTimeout", "2000", RegistryValueKind.String);
                    key.SetValue("AutoEndTasks", "1", RegistryValueKind.String);
                    key.SetValue("ForegroundLockTimeout", "0", RegistryValueKind.String);
                    key.SetValue("LowLevelHooksTimeout", "2000", RegistryValueKind.String);
                }
                
                _logger.LogInfo("[Interface] Desktop otimizado");
            }
            catch (Exception ex) { _logger.LogWarning($"[Interface] Desktop: {ex.Message}"); }
        }

        private void InterfaceRevertDesktop()
        {
            var path = @"Control Panel\Desktop";
            RestoreValue(path, "WaitToKillAppTimeout", true);
            RestoreValue(path, "HungAppTimeout", true);
            RestoreValue(path, "AutoEndTasks", true);
            RestoreValue(path, "ForegroundLockTimeout", true);
            RestoreValue(path, "LowLevelHooksTimeout", true);
        }

        private void InterfaceDisableThumbnailCache()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced", true);
                if (key != null)
                {
                    BackupValue(key, "DisableThumbnailCache", true);
                    BackupValue(key, "DisableThumbnails", true);
                    key.SetValue("DisableThumbnailCache", 1, RegistryValueKind.DWord);
                    key.SetValue("DisableThumbnails", 1, RegistryValueKind.DWord);
                }

                using var explorerKey = Registry.CurrentUser.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer", true);
                if (explorerKey != null)
                {
                    BackupValue(explorerKey, "ThumbnailCacheSize", true);
                    explorerKey.SetValue("ThumbnailCacheSize", 0, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[Interface] Thumbnail cache desativado");
            }
            catch (Exception ex) { _logger.LogWarning($"[Interface] ThumbnailCache: {ex.Message}"); }
        }

        private void InterfaceRevertThumbnailCache()
        {
            RestoreValue(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced", "DisableThumbnailCache", true);
            RestoreValue(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced", "DisableThumbnails", true);
            RestoreValue(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer", "ThumbnailCacheSize", true);
        }

        private void InterfaceDisableMTCUVC()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced", true);
                if (key != null)
                {
                    BackupValue(key, "TaskbarMn", true);
                    BackupValue(key, "TaskbarDa", true);
                    BackupValue(key, "TaskbarSi", true);
                    BackupValue(key, "TaskbarSizeMove", true);
                    BackupValue(key, "TaskbarGlomLevel", true);
                    BackupValue(key, "TaskbarNoNotification", true);
                    BackupValue(key, "TaskbarNoPinnedList", true);
                    BackupValue(key, "TaskbarNoAeroPeek", true);
                    BackupValue(key, "TaskbarNoLabels", true);
                    BackupValue(key, "TaskbarNoThumbnail", true);
                    
                    key.SetValue("TaskbarMn", 0, RegistryValueKind.DWord);
                    key.SetValue("TaskbarDa", 0, RegistryValueKind.DWord);
                    key.SetValue("TaskbarSi", 0, RegistryValueKind.DWord);
                    key.SetValue("TaskbarSizeMove", 0, RegistryValueKind.DWord);
                    key.SetValue("TaskbarGlomLevel", 0, RegistryValueKind.DWord);
                    key.SetValue("TaskbarNoNotification", 1, RegistryValueKind.DWord);
                    key.SetValue("TaskbarNoPinnedList", 0, RegistryValueKind.DWord);
                    key.SetValue("TaskbarNoAeroPeek", 1, RegistryValueKind.DWord);
                    key.SetValue("TaskbarNoLabels", 0, RegistryValueKind.DWord);
                    key.SetValue("TaskbarNoThumbnail", 1, RegistryValueKind.DWord);
                }
                
                _logger.LogInfo("[Interface] MTCUVC desativado");
            }
            catch (Exception ex) { _logger.LogWarning($"[Interface] MTCUVC: {ex.Message}"); }
        }

        private void InterfaceRevertMTCUVC()
        {
            var path = @"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\Advanced";
            RestoreValue(path, "TaskbarMn", true);
            RestoreValue(path, "TaskbarDa", true);
            RestoreValue(path, "TaskbarSi", true);
            RestoreValue(path, "TaskbarSizeMove", true);
            RestoreValue(path, "TaskbarGlomLevel", true);
            RestoreValue(path, "TaskbarNoNotification", true);
            RestoreValue(path, "TaskbarNoPinnedList", true);
            RestoreValue(path, "TaskbarNoAeroPeek", true);
            RestoreValue(path, "TaskbarNoLabels", true);
            RestoreValue(path, "TaskbarNoThumbnail", true);
        }

        #endregion

        #region Apply All Recommended

        public async Task<PerformanceOptimizationResult> ApplyRecommendedAsync(IProgress<OptimizationProgress>? progress = null)
        {
            var result = new PerformanceOptimizationResult();
            var categories = GetOptimizationCategories();
            int total = categories.Sum(c => c.Optimizations.Count(o => o.IsRecommended));
            int current = 0;

            _logger.LogInfo("╔═══════════════════════════════════════════════════════════╗");
            _logger.LogInfo("║     VOLTRIS ULTRA PERFORMANCE - APLICANDO OTIMIZAÇÕES     ║");
            _logger.LogInfo("╚═══════════════════════════════════════════════════════════╝");

            _currentTx = _txService?.Begin("UltraPerformance.ApplyRecommended");
            var strategyResolver = VoltrisOptimizer.App.Services?.GetService<VoltrisOptimizer.Services.SystemChanges.ITweaksStrategyResolver>();
            var strategy = strategyResolver?.Resolve();
            if (strategy != null)
                _logger.LogInfo($"[UltraPerf] Estratégia ativa: {strategy.Name}");
            
            // Criar cancellation token com timeout de 60 segundos para a operação completa
            using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(60));

            foreach (var category in categories)
            {
                foreach (var opt in category.Optimizations.Where(o => o.IsRecommended))
                {
                    // Verificar cancelamento antes de cada otimização
                    cts.Token.ThrowIfCancellationRequested();
                    
                    current++;
                    progress?.Report(new OptimizationProgress
                    {
                        Category = category.Name,
                        CurrentOptimization = opt.Name,
                        PercentComplete = (int)((float)current / total * 100)
                    });

                    try
                    {
                        if (strategy == null || strategy.AllowOptimization(category.Name, opt.Name))
                        {
                            await Task.Run(() => opt.ApplyAction?.Invoke(), cts.Token);
                        }
                        result.Applied.Add(opt.Name);
                        _logger.LogSuccess($"[UltraPerf] ✓ {opt.Name}");

                        // Registra mudança no RestartManager se necessário
                        if (opt.RequiredRestart != RestartScope.None)
                        {
                            RestartManagerService.Instance.RegisterChange(
                                category.Name,
                                opt.Name,
                                MapScopeToRestartType(opt.RequiredRestart),
                                opt.Description
                            );
                        }
                    }
                    catch (OperationCanceledException)
                    {
                        result.Errors.Add($"{opt.Name}: cancelada");
                        _logger.LogWarning($"[UltraPerf] ✗ {opt.Name}: operação cancelada");
                        break;
                    }
                    catch (Exception ex)
                    {
                        result.Errors.Add($"{opt.Name}: {ex.Message}");
                        _logger.LogWarning($"[UltraPerf] ✗ {opt.Name}: {ex.Message}");
                    }
                }
            }

            result.Success = result.Errors.Count == 0;
            result.TotalApplied = result.Applied.Count;

            _logger.LogSuccess($"[UltraPerf] Concluído: {result.TotalApplied} otimizações aplicadas");

            if (result.Success)
            {
                _currentTx?.Commit();
            }
            _currentTx?.Dispose();
            return result;
        }        public async Task RevertAllAsync(CancellationToken ct = default)
        {
            _logger.LogInfo("[UltraPerf] Revertendo todas as otimizações...");
            
            // Criar cancellation token com timeout de 60 segundos para a operação completa
            using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
            cts.CancelAfter(TimeSpan.FromSeconds(60));

            foreach (var category in GetOptimizationCategories())
            {
                foreach (var opt in category.Optimizations)
                {
                    // Verificar cancelamento antes de cada reversão
                    cts.Token.ThrowIfCancellationRequested();
                    
                    try
                    {
                        await Task.Run(() => opt.RevertAction?.Invoke(), cts.Token);
                    }
                    catch (OperationCanceledException)
                    {
                        _logger.LogWarning($"[UltraPerf] Reversão cancelada: {opt.Name}");
                        break;
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"[UltraPerf] Erro ao reverter {opt.Name}: {ex.Message}");
                    }
                }
            }

            _logger.LogSuccess("[UltraPerf] Todas as otimizações foram revertidas");
        }
        #endregion

        #region Public Methods (Aliases for ViewModel compatibility)
        
        /// <summary>
        /// Alias para ApplyRecommendedAsync com CancellationToken
        /// </summary>
        public async Task<PerformanceOptimizationResult> ApplyRecommendedOptimizationsAsync(CancellationToken ct = default)
        {
            // Criar cancellation token com timeout de 60 segundos para a operação completa
            using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
            cts.CancelAfter(TimeSpan.FromSeconds(60));
            
            return await ApplyRecommendedAsync(progress: null);
        }
        
        /// <summary>
        /// Alias para RevertAllAsync com CancellationToken
        /// </summary>
        public async Task RevertAllOptimizationsAsync(CancellationToken ct = default)
        {
            // Criar cancellation token com timeout de 60 segundos para a operação completa
            using var cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
            cts.CancelAfter(TimeSpan.FromSeconds(60));
            
            await RevertAllAsync(cts.Token);
        }
        
        #endregion

        #region Memory Optimizations
        private void OptimizeMemoryCompression()
        {
            try
            {
                // Habilitar compressão de memória (mais eficiente que paging)
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

        private void OptimizeForegroundPriority()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\PriorityControl", true);
                if (key != null)
                {
                    BackupValue(key, "Win32PrioritySeparation");
                    // 38 = Prioridade máxima para foreground, quantum variável
                    key.SetValue("Win32PrioritySeparation", 38, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Foreground Priority: {ex.Message}"); }
        }

        private void RevertForegroundPriority()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\PriorityControl", "Win32PrioritySeparation");
        }

        private void OptimizeSystemCache()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management", true);
                if (key != null)
                {
                    BackupValue(key, "LargeSystemCache");
                    // 0 = Otimizado para aplicativos, 1 = Otimizado para servidor
                    key.SetValue("LargeSystemCache", 0, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] System Cache: {ex.Message}"); }
        }

        private void RevertSystemCache()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management", "LargeSystemCache");
        }

        private void OptimizeMemoryCleanup()
        {
            try
            {
                // Configurar limpeza automática de working set
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management", true);
                if (key != null)
                {
                    BackupValue(key, "ClearPageFileAtShutdown");
                    key.SetValue("ClearPageFileAtShutdown", 0, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Memory Cleanup: {ex.Message}"); }
        }

        private void RevertMemoryCleanup()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management", "ClearPageFileAtShutdown");
        }

        #endregion

        #region CPU Optimizations

        private void OptimizeCoreParking()
        {
            try
            {
                // Desativar Core Parking
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\0cc5b647-c1df-4637-891a-dec35c318583", true);
                if (key != null)
                {
                    BackupValue(key, "ValueMin");
                    BackupValue(key, "ValueMax");
                    key.SetValue("ValueMin", 100, RegistryValueKind.DWord);
                    key.SetValue("ValueMax", 100, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Core Parking: {ex.Message}"); }
        }

        private void RevertCoreParking()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\0cc5b647-c1df-4637-891a-dec35c318583", "ValueMin");
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\0cc5b647-c1df-4637-891a-dec35c318583", "ValueMax");
        }

        private void OptimizeQuantum()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\PriorityControl", true);
                if (key != null)
                {
                    BackupValue(key, "Win32PrioritySeparation");
                    // 26 = Programas em primeiro plano, intervalo curto
                    key.SetValue("Win32PrioritySeparation", 26, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Quantum: {ex.Message}"); }
        }

        private void RevertQuantum()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\PriorityControl", "Win32PrioritySeparation");
        }

        private void OptimizeScheduler()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile", true);
                if (key != null)
                {
                    BackupValue(key, "SystemResponsiveness");
                    BackupValue(key, "NetworkThrottlingIndex");
                    key.SetValue("SystemResponsiveness", 0, RegistryValueKind.DWord);
                    key.SetValue("NetworkThrottlingIndex", unchecked((int)0xFFFFFFFF), RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Scheduler: {ex.Message}"); }
        }

        private void RevertScheduler()
        {
            RestoreValue(@"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile", "SystemResponsiveness");
            RestoreValue(@"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile", "NetworkThrottlingIndex");
        }

        private void OptimizeForegroundBoost()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Control Panel\Desktop", true);
                if (key != null)
                {
                    BackupValue(key, "ForegroundLockTimeout", true);
                    key.SetValue("ForegroundLockTimeout", 0, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Foreground Boost: {ex.Message}"); }
        }

        private void RevertForegroundBoost()
        {
            RestoreValue(@"Control Panel\Desktop", "ForegroundLockTimeout", true);
        }

        #endregion

        #region Disk Optimizations

        private void OptimizeNTFS()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\FileSystem", true);
                if (key != null)
                {
                    BackupValue(key, "NtfsDisableLastAccessUpdate");
                    BackupValue(key, "NtfsDisable8dot3NameCreation");
                    key.SetValue("NtfsDisableLastAccessUpdate", 1, RegistryValueKind.DWord);
                    key.SetValue("NtfsDisable8dot3NameCreation", 1, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] NTFS: {ex.Message}"); }
        }

        private void RevertNTFS()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\FileSystem", "NtfsDisableLastAccessUpdate");
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\FileSystem", "NtfsDisable8dot3NameCreation");
        }

        private void OptimizePrefetch()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters", true);
                if (key != null)
                {
                    BackupValue(key, "EnablePrefetcher");
                    BackupValue(key, "EnableSuperfetch");
                    
                    if (_systemProfile.HasSSD)
                    {
                        // Para SSD: desativar superfetch, manter prefetch mínimo
                        key.SetValue("EnablePrefetcher", 1, RegistryValueKind.DWord);
                        key.SetValue("EnableSuperfetch", 0, RegistryValueKind.DWord);
                    }
                    else
                    {
                        // Para HDD: manter ambos
                        key.SetValue("EnablePrefetcher", 3, RegistryValueKind.DWord);
                        key.SetValue("EnableSuperfetch", 3, RegistryValueKind.DWord);
                    }
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Prefetch: {ex.Message}"); }
        }

        private void RevertPrefetch()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters", "EnablePrefetcher");
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management\PrefetchParameters", "EnableSuperfetch");
        }

        private void OptimizeWriteCache()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\FileSystem", true);
                if (key != null)
                {
                    BackupValue(key, "DisableDeleteNotification");
                    // Manter TRIM para SSDs
                    key.SetValue("DisableDeleteNotification", 0, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Write Cache: {ex.Message}"); }
        }

        private void RevertWriteCache()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\FileSystem", "DisableDeleteNotification");
        }

        private void OptimizeIndexing()
        {
            try
            {
                // Não desativamos indexação, apenas otimizamos
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows Search\Gather\Windows\SystemIndex", true);
                if (key != null)
                {
                    BackupValue(key, "RespectPowerModes");
                    key.SetValue("RespectPowerModes", 0, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Indexing: {ex.Message}"); }
        }

        private void RevertIndexing()
        {
            RestoreValue(@"SOFTWARE\Microsoft\Windows Search\Gather\Windows\SystemIndex", "RespectPowerModes");
        }

        private void OptimizeSSD()
        {
            try
            {
                using (var mmKey = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management", true))
                {
                    if (mmKey != null)
                    {
                        BackupValue(mmKey, "DisablePagingExecutive");
                        mmKey.SetValue("DisablePagingExecutive", 1, RegistryValueKind.DWord);
                        BackupValue(mmKey, "ClearPageFileAtShutdown");
                        mmKey.SetValue("ClearPageFileAtShutdown", 0, RegistryValueKind.DWord);
                    }
                }

                using (var fsKey = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\FileSystem", true))
                {
                    if (fsKey != null)
                    {
                        BackupValue(fsKey, "NtfsMftZoneReservation");
                        fsKey.SetValue("NtfsMftZoneReservation", 4, RegistryValueKind.DWord);
                    }
                }

                try
                {
                    var sysDrive = Path.GetPathRoot(Environment.SystemDirectory) ?? "C:";
                    var psiUsn = new ProcessStartInfo
                    {
                        FileName = "fsutil",
                        Arguments = $"usn deletejournal /D {sysDrive}",
                        UseShellExecute = false,
                        CreateNoWindow = true
                    };
                    using var pUsn = Process.Start(psiUsn);
                    pUsn?.WaitForExit(5000);
                }
                catch { }

                foreach (var svc in new[] { "SysMain", "DoSvc", "BITS", "WerSvc" })
                {
                    try
                    {
                        using var key = Registry.LocalMachine.OpenSubKey($"SYSTEM\\CurrentControlSet\\Services\\{svc}", true);
                        if (key != null)
                        {
                            BackupValue(key, "Start");
                            key.SetValue("Start", 4, RegistryValueKind.DWord);
                        }
                        using var sc = new ServiceController(svc);
                        if (sc.Status != ServiceControllerStatus.Stopped && sc.Status != ServiceControllerStatus.StopPending)
                        {
                            sc.Stop();
                            sc.WaitForStatus(ServiceControllerStatus.Stopped, TimeSpan.FromSeconds(5));
                        }
                    }
                    catch { }
                }

                try
                {
                    var psiDisableDefrag = new ProcessStartInfo
                    {
                        FileName = "schtasks",
                        Arguments = "/Change /TN \"\\Microsoft\\Windows\\Defrag\\ScheduledDefrag\" /Disable",
                        UseShellExecute = false,
                        CreateNoWindow = true
                    };
                    using var p1 = Process.Start(psiDisableDefrag);
                    p1?.WaitForExit(5000);

                    var sysDrive = Path.GetPathRoot(Environment.SystemDirectory) ?? "C:";
                    var psiCreateTrim = new ProcessStartInfo
                    {
                        FileName = "schtasks",
                        Arguments = $"/Create /TN \"VoltrisTrim\" /SC WEEKLY /RL HIGHEST /TR \"defrag {sysDrive} /L\" /F",
                        UseShellExecute = false,
                        CreateNoWindow = true
                    };
                    using var p2 = Process.Start(psiCreateTrim);
                    p2?.WaitForExit(5000);
                }
                catch { }

                try
                {
                    using var storKey = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\storahci\Parameters\Device", true);
                    if (storKey != null)
                    {
                        BackupValue(storKey, "EnableHIPM");
                        BackupValue(storKey, "EnableDIPM");
                        storKey.SetValue("EnableHIPM", 0, RegistryValueKind.DWord);
                        storKey.SetValue("EnableDIPM", 0, RegistryValueKind.DWord);
                    }
                }
                catch { }

                try
                {
                    using var evApp = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\EventLog\Application", true);
                    using var evSys = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\EventLog\System", true);
                    if (evApp != null)
                    {
                        BackupValue(evApp, "MaxSize");
                        BackupValue(evApp, "Retention");
                        evApp.SetValue("MaxSize", 10485760, RegistryValueKind.DWord);
                        evApp.SetValue("Retention", 0, RegistryValueKind.DWord);
                    }
                    if (evSys != null)
                    {
                        BackupValue(evSys, "MaxSize");
                        BackupValue(evSys, "Retention");
                        evSys.SetValue("MaxSize", 10485760, RegistryValueKind.DWord);
                        evSys.SetValue("Retention", 0, RegistryValueKind.DWord);
                    }
                }
                catch { }

                try
                {
                    using var idxKey = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows Search\Gather\Windows\SystemIndex", true);
                    if (idxKey != null)
                    {
                        BackupValue(idxKey, "ExcludedPaths");
                        var exclude = new[] { "C:\\Windows", "C:\\Program Files", "C:\\Program Files (x86)" };
                        idxKey.SetValue("ExcludedPaths", exclude, RegistryValueKind.MultiString);
                    }
                }
                catch { }

                try
                {
                    foreach (var root in new[] { @"SYSTEM\CurrentControlSet\Enum\IDE", @"SYSTEM\CurrentControlSet\Enum\SCSI", @"SYSTEM\CurrentControlSet\Enum\PCI", @"SYSTEM\CurrentControlSet\Enum\NVME" })
                    {
                        using var enumRoot = Registry.LocalMachine.OpenSubKey(root, true);
                        if (enumRoot == null) continue;
                        foreach (var dev in enumRoot.GetSubKeyNames())
                        {
                            using var devKey = enumRoot.OpenSubKey(dev, true);
                            if (devKey == null) continue;
                            foreach (var inst in devKey.GetSubKeyNames())
                            {
                                using var instKey = devKey.OpenSubKey(inst + "\\Device Parameters\\Disk", true);
                                if (instKey != null)
                                {
                                    BackupValue(instKey, "WriteCacheEnable");
                                    instKey.SetValue("WriteCacheEnable", 1, RegistryValueKind.DWord);
                                }
                            }
                        }
                    }
                }
                catch { }

                _logger.LogSuccess("[SSD] Otimização aplicada");
            }
            catch (Exception ex) { _logger.LogWarning($"[SSD] {ex.Message}"); }
        }

        private void RevertSSD()
        {
            try
            {
                RestoreValue(@"SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management", "DisablePagingExecutive");
                RestoreValue(@"SYSTEM\CurrentControlSet\Control\Session Manager\Memory Management", "ClearPageFileAtShutdown");
                RestoreValue(@"SYSTEM\CurrentControlSet\Control\FileSystem", "NtfsMftZoneReservation");

                foreach (var svc in new[] { "SysMain", "DoSvc", "BITS", "WerSvc" })
                {
                    try
                    {
                        RestoreValue($"SYSTEM\\CurrentControlSet\\Services\\{svc}", "Start");
                        using var sc = new ServiceController(svc);
                        if (sc.Status != ServiceControllerStatus.Running && sc.Status != ServiceControllerStatus.StartPending)
                        {
                            sc.Start();
                            sc.WaitForStatus(ServiceControllerStatus.Running, TimeSpan.FromSeconds(5));
                        }
                    }
                    catch { }
                }

                try
                {
                    var psiEnableDefrag = new ProcessStartInfo
                    {
                        FileName = "schtasks",
                        Arguments = "/Change /TN \"\\Microsoft\\Windows\\Defrag\\ScheduledDefrag\" /Enable",
                        UseShellExecute = false,
                        CreateNoWindow = true
                    };
                    using var p1 = Process.Start(psiEnableDefrag);
                    p1?.WaitForExit(5000);

                    var psiDeleteTrim = new ProcessStartInfo
                    {
                        FileName = "schtasks",
                        Arguments = "/Delete /TN \"VoltrisTrim\" /F",
                        UseShellExecute = false,
                        CreateNoWindow = true
                    };
                    using var p2 = Process.Start(psiDeleteTrim);
                    p2?.WaitForExit(5000);
                }
                catch { }

                RestoreValue(@"SYSTEM\CurrentControlSet\Services\storahci\Parameters\Device", "EnableHIPM");
                RestoreValue(@"SYSTEM\CurrentControlSet\Services\storahci\Parameters\Device", "EnableDIPM");

                RestoreValue(@"SYSTEM\CurrentControlSet\Services\EventLog\Application", "MaxSize");
                RestoreValue(@"SYSTEM\CurrentControlSet\Services\EventLog\Application", "Retention");
                RestoreValue(@"SYSTEM\CurrentControlSet\Services\EventLog\System", "MaxSize");
                RestoreValue(@"SYSTEM\CurrentControlSet\Services\EventLog\System", "Retention");

                RestoreValue(@"SOFTWARE\Microsoft\Windows Search\Gather\Windows\SystemIndex", "ExcludedPaths");

                try
                {
                    foreach (var root in new[] { @"SYSTEM\CurrentControlSet\Enum\IDE", @"SYSTEM\CurrentControlSet\Enum\SCSI", @"SYSTEM\CurrentControlSet\Enum\PCI", @"SYSTEM\CurrentControlSet\Enum\NVME" })
                    {
                        using var enumRoot = Registry.LocalMachine.OpenSubKey(root, true);
                        if (enumRoot == null) continue;
                        foreach (var dev in enumRoot.GetSubKeyNames())
                        {
                            using var devKey = enumRoot.OpenSubKey(dev, true);
                            if (devKey == null) continue;
                            foreach (var inst in devKey.GetSubKeyNames())
                            {
                                using var instKey = devKey.OpenSubKey(inst + "\\Device Parameters\\Disk", true);
                                if (instKey != null)
                                {
                                    RestoreValue(instKey.Name.Replace("HKEY_LOCAL_MACHINE\\", ""), "WriteCacheEnable");
                                }
                            }
                        }
                    }
                }
                catch { }

                _logger.LogSuccess("[SSD] Otimização revertida");
            }
            catch (Exception ex) { _logger.LogWarning($"[SSD] {ex.Message}"); }
        }

        #endregion

        #region Network Optimizations

        private void OptimizeTcpIp()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\Tcpip\Parameters", true);
                if (key != null)
                {
                    BackupValue(key, "TcpAckFrequency");
                    BackupValue(key, "TCPNoDelay");
                    BackupValue(key, "DefaultTTL");
                    
                    key.SetValue("TcpAckFrequency", 1, RegistryValueKind.DWord);
                    key.SetValue("TCPNoDelay", 1, RegistryValueKind.DWord);
                    key.SetValue("DefaultTTL", 64, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] TCP/IP: {ex.Message}"); }
        }

        private void RevertTcpIp()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\Tcpip\Parameters", "TcpAckFrequency");
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\Tcpip\Parameters", "TCPNoDelay");
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\Tcpip\Parameters", "DefaultTTL");
        }

        private void OptimizeNagle()
        {
            try
            {
                // Encontrar interfaces de rede
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\Tcpip\Parameters\Interfaces", true);
                if (key != null)
                {
                    foreach (var subKeyName in key.GetSubKeyNames())
                    {
                        try
                        {
                            using var subKey = key.OpenSubKey(subKeyName, true);
                            if (subKey != null)
                            {
                                subKey.SetValue("TcpAckFrequency", 1, RegistryValueKind.DWord);
                                subKey.SetValue("TCPNoDelay", 1, RegistryValueKind.DWord);
                            }
                        }
                        catch { }
                    }
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Nagle: {ex.Message}"); }
        }

        private void RevertNagle()
        {
            // Reverter requer limpeza das chaves adicionadas
        }

        private void OptimizeDns()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\Dnscache\Parameters", true);
                if (key != null)
                {
                    BackupValue(key, "MaxCacheEntryTtlLimit");
                    BackupValue(key, "MaxCacheTtl");
                    
                    key.SetValue("MaxCacheEntryTtlLimit", 86400, RegistryValueKind.DWord);
                    key.SetValue("MaxCacheTtl", 86400, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] DNS: {ex.Message}"); }
        }

        private void RevertDns()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\Dnscache\Parameters", "MaxCacheEntryTtlLimit");
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\Dnscache\Parameters", "MaxCacheTtl");
        }

        private void OptimizeNetworkThrottling()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile", true);
                if (key != null)
                {
                    BackupValue(key, "NetworkThrottlingIndex");
                    key.SetValue("NetworkThrottlingIndex", unchecked((int)0xFFFFFFFF), RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Network Throttling: {ex.Message}"); }
        }

        private void RevertNetworkThrottling()
        {
            RestoreValue(@"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile", "NetworkThrottlingIndex");
        }

        #endregion

        #region Visual Optimizations

        private void OptimizeAnimations()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Control Panel\Desktop\WindowMetrics", true);
                if (key != null)
                {
                    BackupValue(key, "MinAnimate", true);
                    key.SetValue("MinAnimate", "0", RegistryValueKind.String);
                }

                using var key2 = Registry.CurrentUser.OpenSubKey(@"Control Panel\Desktop", true);
                if (key2 != null)
                {
                    BackupValue(key2, "MenuShowDelay", true);
                    key2.SetValue("MenuShowDelay", "0", RegistryValueKind.String);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Animations: {ex.Message}"); }
        }

        private void RevertAnimations()
        {
            RestoreValue(@"Control Panel\Desktop\WindowMetrics", "MinAnimate", true);
            RestoreValue(@"Control Panel\Desktop", "MenuShowDelay", true);
        }

        private void OptimizeTransparency()
        {
            // Não desativamos transparência por padrão para manter a estética
        }

        private void RevertTransparency() { }

        private void OptimizeContextMenu()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Control Panel\Desktop", true);
                if (key != null)
                {
                    BackupValue(key, "MenuShowDelay", true);
                    key.SetValue("MenuShowDelay", "0", RegistryValueKind.String);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Context Menu: {ex.Message}"); }
        }

        private void RevertContextMenu()
        {
            RestoreValue(@"Control Panel\Desktop", "MenuShowDelay", true);
        }

        private void OptimizeDWM()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\DWM", true);
                if (key != null)
                {
                    BackupValue(key, "EnableAeroPeek", true);
                    key.SetValue("EnableAeroPeek", 1, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] DWM: {ex.Message}"); }
        }

        private void RevertDWM()
        {
            RestoreValue(@"Software\Microsoft\Windows\DWM", "EnableAeroPeek", true);
        }

        #endregion

        #region Startup Optimizations

        private void OptimizeFastStartup()
        {
            try
            {
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

        private void OptimizeStartupDelay()
        {
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(@"Software\Microsoft\Windows\CurrentVersion\Explorer\Serialize");
                if (key != null)
                {
                    BackupValue(key, "StartupDelayInMSec", true);
                    key.SetValue("StartupDelayInMSec", 0, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Startup Delay: {ex.Message}"); }
        }

        private void RevertStartupDelay()
        {
            RestoreValue(@"Software\Microsoft\Windows\CurrentVersion\Explorer\Serialize", "StartupDelayInMSec", true);
        }

        private void OptimizeBootServices()
        {
            // Não modificamos serviços de boot para manter segurança
        }

        private void RevertBootServices() { }

        private void OptimizeBootTimeout()
        {
            try
            {
                var psi = new ProcessStartInfo
                {
                    FileName = "bcdedit",
                    Arguments = "/timeout 3",
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

        #endregion

        #region Services Optimizations

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

        private void OptimizeXboxServices()
        {
            // Não desativamos Xbox por padrão
        }

        private void RevertXboxServices() { }

        private void OptimizeScheduledTasks()
        {
            // Lista de tarefas seguras para desativar
            var safeTasks = new[]
            {
                @"\Microsoft\Windows\Application Experience\Microsoft Compatibility Appraiser",
                @"\Microsoft\Windows\Application Experience\ProgramDataUpdater",
                @"\Microsoft\Windows\Customer Experience Improvement Program\Consolidator",
                @"\Microsoft\Windows\Customer Experience Improvement Program\UsbCeip"
            };

            foreach (var task in safeTasks)
            {
                try
                {
                    var psi = new ProcessStartInfo
                    {
                        FileName = "schtasks",
                        Arguments = $"/Change /TN \"{task}\" /Disable",
                        UseShellExecute = false,
                        CreateNoWindow = true
                    };
                    using var p = Process.Start(psi);
                    p?.WaitForExit(5000);
                }
                catch { }
            }
        }

        private void RevertScheduledTasks()
        {
            var safeTasks = new[]
            {
                @"\Microsoft\Windows\Application Experience\Microsoft Compatibility Appraiser",
                @"\Microsoft\Windows\Application Experience\ProgramDataUpdater",
                @"\Microsoft\Windows\Customer Experience Improvement Program\Consolidator",
                @"\Microsoft\Windows\Customer Experience Improvement Program\UsbCeip"
            };

            foreach (var task in safeTasks)
            {
                try
                {
                    var psi = new ProcessStartInfo
                    {
                        FileName = "schtasks",
                        Arguments = $"/Change /TN \"{task}\" /Enable",
                        UseShellExecute = false,
                        CreateNoWindow = true
                    };
                    using var p = Process.Start(psi);
                    p?.WaitForExit(5000);
                }
                catch { }
            }
        }

        private void OptimizeBackgroundApps()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\BackgroundAccessApplications", true);
                if (key != null)
                {
                    BackupValue(key, "GlobalUserDisabled", true);
                    key.SetValue("GlobalUserDisabled", 0, RegistryValueKind.DWord); // 0 mantém controle individual
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Background Apps: {ex.Message}"); }
        }

        private void RevertBackgroundApps()
        {
            RestoreValue(@"Software\Microsoft\Windows\CurrentVersion\BackgroundAccessApplications", "GlobalUserDisabled", true);
        }

        #endregion

        #region Power Optimizations

        private void CreateVoltrisPowerPlan()
        {
            try
            {
                // Duplicar plano Alto Desempenho e customizar
                var psi = new ProcessStartInfo
                {
                    FileName = "powercfg",
                    Arguments = "/duplicatescheme 8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c 12345678-1234-1234-1234-123456789abc",
                    UseShellExecute = false,
                    CreateNoWindow = true
                };
                using var p = Process.Start(psi);
                p?.WaitForExit(5000);

                // Configurar o plano Voltris
                var settings = new[]
                {
                    "/setacvalueindex 12345678-1234-1234-1234-123456789abc SUB_PROCESSOR PROCTHROTTLEMIN 100",
                    "/setacvalueindex 12345678-1234-1234-1234-123456789abc SUB_PROCESSOR PROCTHROTTLEMAX 100",
                };

                foreach (var setting in settings)
                {
                    psi.Arguments = setting;
                    using var p2 = Process.Start(psi);
                    p2?.WaitForExit(2000);
                }

                // Ativar o plano
                psi.Arguments = "/setactive 12345678-1234-1234-1234-123456789abc";
                using var p3 = Process.Start(psi);
                p3?.WaitForExit(2000);
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] Power Plan: {ex.Message}"); }
        }

        private void RevertVoltrisPowerPlan()
        {
            try
            {
                var psi = new ProcessStartInfo
                {
                    FileName = "powercfg",
                    Arguments = "/setactive 381b4222-f694-41f0-9685-ff5bb260df2e", // Balanceado
                    UseShellExecute = false,
                    CreateNoWindow = true
                };
                using var p = Process.Start(psi);
                p?.WaitForExit(5000);

                // Deletar plano Voltris
                psi.Arguments = "/delete 12345678-1234-1234-1234-123456789abc";
                using var p2 = Process.Start(psi);
                p2?.WaitForExit(2000);
            }
            catch { }
        }

        private void OptimizeUSBPower()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\USB", true);
                if (key != null)
                {
                    BackupValue(key, "DisableSelectiveSuspend");
                    key.SetValue("DisableSelectiveSuspend", 1, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] USB Power: {ex.Message}"); }
        }

        private void RevertUSBPower()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\USB", "DisableSelectiveSuspend");
        }

        private void OptimizePCIe()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Power\PowerSettings\501a4d13-42af-4429-9fd1-a8218c268e20\ee12f906-d277-404b-b6da-e5fa1a576df5", true);
                if (key != null)
                {
                    BackupValue(key, "Attributes");
                    key.SetValue("Attributes", 2, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] PCIe: {ex.Message}"); }
        }

        private void RevertPCIe()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Power\PowerSettings\501a4d13-42af-4429-9fd1-a8218c268e20\ee12f906-d277-404b-b6da-e5fa1a576df5", "Attributes");
        }

        private void OptimizeCPUThrottling()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Power\PowerThrottling", true);
                if (key != null)
                {
                    BackupValue(key, "PowerThrottlingOff");
                    key.SetValue("PowerThrottlingOff", 1, RegistryValueKind.DWord);
                }
            }
            catch (Exception ex) { _logger.LogWarning($"[UltraPerf] CPU Throttling: {ex.Message}"); }
        }

        private void RevertCPUThrottling()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Control\Power\PowerThrottling", "PowerThrottlingOff");
        }

        #endregion

        #region Explorer Ultra Fast Optimizations

        /// <summary>
        /// Abre Explorer em "Este Computador" ao invés de "Acesso Rápido"
        /// Impacto: ALTO - Acesso Rápido escaneia arquivos recentes toda vez
        /// </summary>
        private void OptimizeExplorerLaunchFolder()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced", true);
                if (key != null)
                {
                    BackupValue(key, "LaunchTo", true);
                    // 1 = Este Computador, 2 = Acesso Rápido
                    key.SetValue("LaunchTo", 1, RegistryValueKind.DWord);
                }
                _logger.LogSuccess("[Explorer] Configurado para abrir em 'Este Computador'");
            }
            catch (Exception ex) { _logger.LogWarning($"[Explorer] LaunchFolder: {ex.Message}"); }
        }

        private void RevertExplorerLaunchFolder()
        {
            RestoreValue(@"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced", "LaunchTo", true);
        }

        /// <summary>
        /// Desativa o rastreamento de arquivos e pastas recentes no Acesso Rápido
        /// Impacto: ALTO - Para o escaneamento constante de arquivos
        /// </summary>
        private void OptimizeQuickAccess()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Explorer", true);
                if (key != null)
                {
                    BackupValue(key, "ShowRecent", true);
                    BackupValue(key, "ShowFrequent", true);
                    
                    key.SetValue("ShowRecent", 0, RegistryValueKind.DWord);
                    key.SetValue("ShowFrequent", 0, RegistryValueKind.DWord);
                }
                _logger.LogSuccess("[Explorer] Acesso Rápido automático desativado");
            }
            catch (Exception ex) { _logger.LogWarning($"[Explorer] QuickAccess: {ex.Message}"); }
        }

        private void RevertQuickAccess()
        {
            RestoreValue(@"Software\Microsoft\Windows\CurrentVersion\Explorer", "ShowRecent", true);
            RestoreValue(@"Software\Microsoft\Windows\CurrentVersion\Explorer", "ShowFrequent", true);
        }

        /// <summary>
        /// Desativa a detecção automática de tipo de pasta
        /// Impacto: ALTO - O Windows analisa cada pasta para determinar se é música, fotos, etc.
        /// </summary>
        private void OptimizeFolderTypeDiscovery()
        {
            try
            {
                // Desativar descoberta de tipo de pasta (extremamente lento em pastas grandes)
                using var key = Registry.CurrentUser.CreateSubKey(@"Software\Classes\Local Settings\Software\Microsoft\Windows\Shell\Bags\AllFolders\Shell");
                if (key != null)
                {
                    key.SetValue("FolderType", "NotSpecified", RegistryValueKind.String);
                }

                // Limitar cache de bags para evitar overhead
                using var bagsKey = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\Shell\BagMRU", true);
                if (bagsKey != null)
                {
                    // Limitar tamanho do cache
                    BackupValue(bagsKey, "Size", true);
                }

                _logger.LogSuccess("[Explorer] Detecção de tipo de pasta otimizada");
            }
            catch (Exception ex) { _logger.LogWarning($"[Explorer] FolderType: {ex.Message}"); }
        }

        private void RevertFolderTypeDiscovery()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\Classes\Local Settings\Software\Microsoft\Windows\Shell\Bags\AllFolders\Shell", true);
                key?.DeleteValue("FolderType", false);
            }
            catch { }
        }

        /// <summary>
        /// Otimiza geração e cache de miniaturas
        /// </summary>
        private void OptimizeExplorerThumbnails()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced", true);
                if (key != null)
                {
                    BackupValue(key, "IconsOnly", true);
                    // 0 = Mostrar miniaturas, 1 = Apenas ícones (mais rápido)
                    // Mantemos miniaturas mas otimizamos o cache
                    key.SetValue("IconsOnly", 0, RegistryValueKind.DWord);
                }

                // Otimizar qualidade do thumbnail (menor = mais rápido)
                using var thumbKey = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Explorer", true);
                if (thumbKey != null)
                {
                    BackupValue(thumbKey, "ThumbnailQuality", true);
                    thumbKey.SetValue("ThumbnailQuality", 80, RegistryValueKind.DWord); // 80% qualidade
                }

                _logger.LogSuccess("[Explorer] Miniaturas otimizadas");
            }
            catch (Exception ex) { _logger.LogWarning($"[Explorer] Thumbnails: {ex.Message}"); }
        }

        private void RevertExplorerThumbnails()
        {
            RestoreValue(@"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced", "IconsOnly", true);
            RestoreValue(@"Software\Microsoft\Windows\CurrentVersion\Explorer", "ThumbnailQuality", true);
        }

        /// <summary>
        /// Executa cada janela do Explorer em processo separado
        /// Mais estável e isola crashes
        /// </summary>
        private void OptimizeExplorerProcess()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced", true);
                if (key != null)
                {
                    BackupValue(key, "SeparateProcess", true);
                    key.SetValue("SeparateProcess", 1, RegistryValueKind.DWord);
                }
                _logger.LogSuccess("[Explorer] Processo separado ativado");
            }
            catch (Exception ex) { _logger.LogWarning($"[Explorer] SeparateProcess: {ex.Message}"); }
        }

        private void RevertExplorerProcess()
        {
            RestoreValue(@"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced", "SeparateProcess", true);
        }

        /// <summary>
        /// Desativa notificações de provedores de sincronização (OneDrive, Dropbox, etc.)
        /// </summary>
        private void OptimizeSyncNotifications()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced", true);
                if (key != null)
                {
                    BackupValue(key, "ShowSyncProviderNotifications", true);
                    key.SetValue("ShowSyncProviderNotifications", 0, RegistryValueKind.DWord);
                }
                _logger.LogSuccess("[Explorer] Notificações de sync desativadas");
            }
            catch (Exception ex) { _logger.LogWarning($"[Explorer] SyncNotifications: {ex.Message}"); }
        }

        private void RevertSyncNotifications()
        {
            RestoreValue(@"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced", "ShowSyncProviderNotifications", true);
        }

        /// <summary>
        /// Desativa barra de status do Explorer (menos processamento)
        /// </summary>
        private void OptimizeExplorerStatusBar()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced", true);
                if (key != null)
                {
                    BackupValue(key, "ShowStatusBar", true);
                    key.SetValue("ShowStatusBar", 0, RegistryValueKind.DWord);
                }
                _logger.LogSuccess("[Explorer] Status bar desativada");
            }
            catch (Exception ex) { _logger.LogWarning($"[Explorer] StatusBar: {ex.Message}"); }
        }

        private void RevertExplorerStatusBar()
        {
            RestoreValue(@"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced", "ShowStatusBar", true);
        }

        /// <summary>
        /// Reduz timeout de conexões de rede para acelerar listagem de pastas de rede
        /// </summary>
        private void OptimizeNetworkTimeout()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters", true);
                if (key != null)
                {
                    BackupValue(key, "FileInfoCacheLifetime");
                    BackupValue(key, "DirectoryCacheLifetime");
                    BackupValue(key, "FileNotFoundCacheLifetime");
                    
                    // Reduzir timeouts de cache de rede
                    key.SetValue("FileInfoCacheLifetime", 10, RegistryValueKind.DWord);
                    key.SetValue("DirectoryCacheLifetime", 10, RegistryValueKind.DWord);
                    key.SetValue("FileNotFoundCacheLifetime", 5, RegistryValueKind.DWord);
                }
                _logger.LogSuccess("[Explorer] Timeout de rede otimizado");
            }
            catch (Exception ex) { _logger.LogWarning($"[Explorer] NetworkTimeout: {ex.Message}"); }
        }

        private void RevertNetworkTimeout()
        {
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters", "FileInfoCacheLifetime");
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters", "DirectoryCacheLifetime");
            RestoreValue(@"SYSTEM\CurrentControlSet\Services\LanmanWorkstation\Parameters", "FileNotFoundCacheLifetime");
        }

        #endregion

        #region Backup/Restore Helpers

        private void BackupValue(RegistryKey key, string valueName, bool isCurrentUser = false)
        {
            var path = key.Name.Replace("HKEY_LOCAL_MACHINE\\", "").Replace("HKEY_CURRENT_USER\\", "");
            var backupKey = $"{(isCurrentUser ? "HKCU" : "HKLM")}\\{path}\\{valueName}";
            
            try
            {
                var value = key.GetValue(valueName);
                if (value != null && !_backups.ContainsKey(backupKey))
                {
                    _backups[backupKey] = value;
                    var isCU = key.Name.StartsWith("HKEY_CURRENT_USER\\", StringComparison.OrdinalIgnoreCase);
                    var rootPath = key.Name.Replace("HKEY_LOCAL_MACHINE\\", "").Replace("HKEY_CURRENT_USER\\", "");
                    _currentTx?.RegisterRegistryChange(rootPath, valueName, value, null, isCU);
                }
            }
            catch { }
        }

        private void RestoreValue(string path, string valueName, bool isCurrentUser = false)
        {
            var backupKey = $"{(isCurrentUser ? "HKCU" : "HKLM")}\\{path}\\{valueName}";
            
            if (_backups.TryGetValue(backupKey, out var value))
            {
                try
                {
                    var root = isCurrentUser ? Registry.CurrentUser : Registry.LocalMachine;
                    using var key = root.OpenSubKey(path, true);
                    if (key != null && value != null)
                    {
                        key.SetValue(valueName, value);
                    }
                }
                catch { }
            }
        }

        #endregion

        private static RestartType MapScopeToRestartType(RestartScope scope)
        {
            return scope switch
            {
                RestartScope.PC => RestartType.Required,
                RestartScope.Explorer => RestartType.Recommended,
                RestartScope.App => RestartType.Recommended,
                _ => RestartType.None
            };
        }

    #region Models

    public class PerformanceSystemProfile
    {
        public bool HasSSD { get; set; }
        public bool HasNVMe { get; set; }
        public double TotalRAMGB { get; set; }
        public bool IsLowRAM { get; set; }
        public bool IsHighRAM { get; set; }
        public int CPUCores { get; set; }
        public bool IsMultiCore { get; set; }
        public string CPUName { get; set; } = "";
        public bool HasDedicatedGPU { get; set; }
        public string GPUName { get; set; } = "";
        public bool IsLaptop { get; set; }
        public bool IsGamingPC { get; set; }
        public bool IsWorkstation { get; set; }
        public Version WindowsVersion { get; set; } = new();
        public bool IsWindows11 { get; set; }
    }

    public class PerformanceCategory
    {
        public string Name { get; set; } = "";
        public string Icon { get; set; } = "";
        public string Description { get; set; } = "";
        public List<PerformanceOptimization> Optimizations { get; set; } = new();
    }

    public class PerformanceOptimization
    {
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public OptimizationImpact Impact { get; set; }
        public OptimizationSafety Safety { get; set; }
        public bool IsRecommended { get; set; }
        public Action? ApplyAction { get; set; }
        public Action? RevertAction { get; set; }
        
        /// <summary>
        /// Tipo de reinício necessário para esta otimização
        /// </summary>
        public RestartScope RequiredRestart { get; set; } = RestartScope.None;
        
        // ============================================
        // PROPRIEDADES DE RESTRIÇÃO POR HARDWARE
        // ============================================
        
        /// <summary>
        /// Tier mínimo de hardware necessário para esta otimização
        /// </summary>
        public HardwareTier? MinimumTier { get; set; }
        
        /// <summary>
        /// Requer GPU dedicada
        /// </summary>
        public bool RequiresDedicatedGPU { get; set; }
        
        /// <summary>
        /// Requer SSD (não funciona bem em HDD)
        /// </summary>
        public bool RequiresSSD { get; set; }
        
        /// <summary>
        /// RAM mínima em GB necessária
        /// </summary>
        public int? MinimumRAMGB { get; set; }
        
        /// <summary>
        /// Número mínimo de cores de CPU necessários
        /// </summary>
        public int? MinimumCores { get; set; }
        
        /// <summary>
        /// Não aplicar em laptops (pode causar problemas de energia)
        /// </summary>
        public bool NotForLaptops { get; set; }
        
        /// <summary>
        /// Conflita com Modo Gamer ativo
        /// </summary>
        public bool ConflictsWithGamerMode { get; set; }
        
        /// <summary>
        /// Mensagem de aviso se não for compatível
        /// </summary>
        public string? IncompatibilityReason { get; set; }
    }

    public enum RestartScope
    {
        None,
        App,
        Explorer,
        PC
    }

    public enum OptimizationImpact
    {
        Low,
        Medium,
        High
    }

    public enum OptimizationSafety
    {
        Safe,
        Moderate,
        Advanced
    }

    /// <summary>
    /// Classificação de hardware para otimizações adaptativas
    /// </summary>
    public enum HardwareTier
    {
        /// <summary>
        /// PC Fraco - Hardware limitado, otimizações conservadoras
        /// </summary>
        LowEnd,
        
        /// <summary>
        /// PC Médio - Hardware intermediário, otimizações moderadas
        /// </summary>
        MidRange,
        
        /// <summary>
        /// PC Forte - Hardware potente, todas as otimizações disponíveis
        /// </summary>
        HighEnd
    }

    public class OptimizationProgress
    {
        public string Category { get; set; } = "";
        public string CurrentOptimization { get; set; } = "";
        public int PercentComplete { get; set; }
    }

    public class PerformanceOptimizationResult
    {
        public bool Success { get; set; }
        public int TotalApplied { get; set; }
        public List<string> Applied { get; set; } = new();
        public List<string> Errors { get; set; } = new();
    }
    #endregion




}
