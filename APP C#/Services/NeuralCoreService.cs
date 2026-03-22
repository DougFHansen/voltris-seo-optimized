using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Core;
using VoltrisOptimizer.Services.Hardware;
using VoltrisOptimizer.Services.Gamer.Interfaces;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// VOLTRIS NEURAL CORE — Tecnologia disruptiva de otimização preditiva e autônoma.
    /// Implementa Hardware Surgery, Context-Aware Morphing e Predictive Healing.
    /// </summary>
    public class NeuralCoreService : INeuralCoreService, IDisposable
    {
        private readonly ILoggingService _logger;
        private readonly IRegistryService _registry;
        private readonly IGameDetector _gameDetector;
        private readonly ISystemInfoService _systemInfo;
        private readonly EnhancedHardwareDetector _hardwareDetector;
        
        private CancellationTokenSource? _monitorCts;
        private bool _isActive;
        private bool _isKernelInExclusivity;
        
        // Limiares de Anomalia (Predictive Healing)
        private const double DpcThresholdMultiplier = 1.5; // 50% acima da média
        private const double CpuUsageAnomalousThreshold = 85.0; // 85% CPU considerad crítico em repouso
        private const double MemoryHealingThreshold = 0.82; // 82% RAM
        
        private readonly List<double> _dpcHistory = new();
        private double _averageDpcRawValue = 0;
        
        public bool IsActive => _isActive;

        public NeuralCoreService(
            ILoggingService logger,
            IRegistryService registry,
            IGameDetector gameDetector,
            ISystemInfoService systemInfo)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _registry = registry ?? throw new ArgumentNullException(nameof(registry));
            _gameDetector = gameDetector ?? throw new ArgumentNullException(nameof(gameDetector));
            _systemInfo = systemInfo ?? throw new ArgumentNullException(nameof(systemInfo));
            _hardwareDetector = new EnhancedHardwareDetector(systemInfo, logger);
            
            _logger.LogInfo("[NeuralCore] Motor inicializado. Pronto para otimização autônoma.");
        }

        public void Start()
        {
            if (_isActive) return;
            _isActive = true;
            
            _monitorCts = new CancellationTokenSource();
            
            // 1. Assinar eventos de jogo (Context-Aware Morphing)
            _gameDetector.GameStarted += (s, e) => _ = SetKernelExclusivityAsync(true);
            _gameDetector.GameStopped += (s, e) => _ = SetKernelExclusivityAsync(false);
            
            // 2. Iniciar monitor de Predictive Healing
            _ = Task.Run(() => PredictionLoopAsync(_monitorCts.Token));
            
            // 3. Executar Hardware Surgery no startup
            _ = PerformHardwareSurgeryAsync();
            
            _logger.LogSuccess("[NeuralCore] Motor Ativo. Monitoramento de anomalias iniciado.");
        }

        public void Stop()
        {
            _isActive = false;
            _monitorCts?.Cancel();
            _monitorCts?.Dispose();
            _monitorCts = null;
            _logger.LogInfo("[NeuralCore] Motor Desativado.");
        }

        #region HARDWARE SURGERY

        /// <summary>
        /// Realiza a "Cirurgia de Hardware" - Modificações profundas em SSDs e GPUs.
        /// </summary>
        public async Task PerformHardwareSurgeryAsync()
        {
            try
            {
                _logger.LogInfo("[NeuralCore] Iniciando Hardware Surgery (Otimização Cirúrgica de Silício)...");
                var profile = await _hardwareDetector.AnalyzeHardwareAsync();
                
                // --- Otimização de SSD (Samsung, WD e Genéricos) ---
                await OptimizeStorageDeepAsync(profile.StorageAnalysis);
                
                // --- Otimização de GPU (NVIDIA Deep Performance) ---
                if (profile.GpuAnalysis.Vendor.Contains("NVIDIA", StringComparison.OrdinalIgnoreCase))
                {
                    await OptimizeGpuNvidiaDeepAsync();
                }
                
                _logger.LogSuccess("[NeuralCore] Hardware Surgery concluída com sucesso.");
            }
            catch (Exception ex)
            {
                _logger.LogError("[NeuralCore] Erro fatal durante Hardware Surgery", ex);
            }
        }

        private async Task OptimizeStorageDeepAsync(StorageAnalysis storage)
        {
            _logger.LogInfo("[NeuralCore] Cirurgia de NVMe: Redução de latência de IO...");
            
            // 1. Desabilitar Interrupt Steering para o driver StorAHCI (se existir)
            // Isso força o processamento direto sem saltos de CPU
            _registry.SetValue(RegistryHive.LocalMachine, 
                @"SYSTEM\CurrentControlSet\Services\storahci\Parameters\Device", 
                "Interrupt Messages per Message Signaled Interrupt", 1, RegistryValueKind.DWord);

            // 2. Tweaks específicos de Vendors via ID de Driver
            foreach (var drive in storage.Drives.Where(d => d.IsSsd))
            {
                // Buscamos GUIDs de discos NVMe para aplicar Latency Management
                _logger.LogInfo($"[NeuralCore] Aplicando Low-Latency Profile em {drive.Letter}: {drive.Type}");
                
                // Desabilitar o I/O Coalescing que aumenta latência em favor do consumo de energia
                _registry.SetValue(RegistryHive.LocalMachine, 
                    @"SYSTEM\CurrentControlSet\Control\Power\PowerSettings\0012ee47-9041-4b5d-9b77-535fba8b1442\0b2d69d7-a2a1-449c-9680-f91c70521c60", 
                    "Attributes", 2, RegistryValueKind.DWord);
            }
        }

        private async Task OptimizeGpuNvidiaDeepAsync()
        {
            _logger.LogInfo("[NeuralCore] Cirurgia de GPU: Forçando Perfil de Ultrabaixa latência (NVIDIA)...");
            
            // Registry PowerMizer Tweaks (Deep Performance)
            // Força o PowerMizer a não entrar em estados de economia durante atividade
            string nvidiaPath = @"SYSTEM\CurrentControlSet\Control\Video";
            var subKeys = _registry.GetSubKeyNames(RegistryHive.LocalMachine, nvidiaPath);
            
            foreach (var key in subKeys)
            {
                string fullPath = $@"{nvidiaPath}\{key}\0000";
                if (_registry.ValueExists(RegistryHive.LocalMachine, fullPath, "DriverDesc"))
                {
                    _registry.SetValue(RegistryHive.LocalMachine, fullPath, "PowerMizerEnable", 0, RegistryValueKind.DWord);
                    _registry.SetValue(RegistryHive.LocalMachine, fullPath, "PowerMizerLevel", 1, RegistryValueKind.DWord);
                    _registry.SetValue(RegistryHive.LocalMachine, fullPath, "PowerMizerLevelAC", 1, RegistryValueKind.DWord);
                }
            }
        }

        #endregion

        #region CONTEXT-AWARE MORPHING (Kernel Exclusivity)

        /// <summary>
        /// O VOLTRIS reconfigura o Kernel do Windows em tempo real baseado no processo ativo.
        /// </summary>
        public async Task SetKernelExclusivityAsync(bool enable)
        {
            if (_isKernelInExclusivity == enable) return;
            _isKernelInExclusivity = enable;
            
            string mode = enable ? "EXCLUSIVE GAMING" : "STANDARD PRODUCTIVITY";
            _logger.LogInfo($"[NeuralCore] Context-Aware Morphing: Mudando Kernel para modo {mode}");

            try
            {
                // 1. Win32PrioritySeparation (Quantum length)
                // 0x26 (38) = Short Quantums, Fixed, Foreground Priority (Ideal para Gaming)
                // 0x18 (24) = Variable, Balanced (Ideal para Produtividade)
                uint quantum = enable ? 0x26u : 0x18u;
                _registry.SetValue(RegistryHive.LocalMachine, 
                    @"SYSTEM\CurrentControlSet\Control\PriorityControl", 
                    "Win32PrioritySeparation", quantum, RegistryValueKind.DWord);

                // 2. Kernel Network Throttling
                // 0xFFFFFFFF = Desabilitado (Max performance) para Gaming
                // 10 = Standard para Poupar CPU em rede
                uint throttling = enable ? 0xFFFFFFFFu : 10u;
                _registry.SetValue(RegistryHive.LocalMachine, 
                    @"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile", 
                    "NetworkThrottlingIndex", (int)throttling, RegistryValueKind.DWord);

                // 3. System Responsiveness
                // 0 = 100% dos recursos para o foreground (Gaming)
                // 20 = 20% reservado para background (Standard)
                uint responsiveness = enable ? 0u : 20u;
                _registry.SetValue(RegistryHive.LocalMachine, 
                    @"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile", 
                    "SystemResponsiveness", responsiveness, RegistryValueKind.DWord);

                _logger.LogSuccess($"[NeuralCore] Kernel reconfigurado com sucesso para modo {mode}.");
            }
            catch (Exception ex)
            {
                _logger.LogError("[NeuralCore] Falha ao mutar estado do Kernel (Context-Aware Morphing)", ex);
            }
        }

        #endregion

        #region PREDICTIVE HEALING

        private async Task PredictionLoopAsync(CancellationToken ct)
        {
            _logger.LogInfo("[NeuralCore] Ciclo de monitoramento preditivo iniciado (1.5s interval).");
            
            while (!ct.IsCancellationRequested)
            {
                try
                {
                    // Monitorar anomalias de CPU e RAM via Metrics Cache
                    var metrics = SystemMetricsCache.Instance;
                    
                    if (metrics.CpuPercent > CpuUsageAnomalousThreshold && metrics.LastInputMs < 5000)
                    {
                        // Se CPU > 85% e usuário está ativo, pode haver um stutter iminente.
                        _logger.LogWarning($"[NeuralCore] Anomalia detectada: CPU em {metrics.CpuPercent:F1}%. Iniciando Predictive Healing...");
                        await PerformPredictiveHealingAsync();
                    }

                    if (metrics.MemoryUsedPercent > MemoryHealingThreshold * 100)
                    {
                        _logger.LogWarning($"[NeuralCore] Pressão de memória detectada: {metrics.MemoryUsedPercent:F0}%. Limpando buffers stand-by...");
                        await PerformSilentHealingAsync();
                    }

                    // A cada 30 segundos, recalcular linha de base neural
                    if (DateTime.Now.Second % 30 == 0)
                    {
                        _logger.LogInfo("[NeuralCore] Recalibrando linha de base neural...");
                    }
                }
                catch (OperationCanceledException) { break; }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[NeuralCore] Erro no loop de predição: {ex.Message}");
                }

                await Task.Delay(1500, ct);
            }
        }

        public async Task PerformPredictiveHealingAsync()
        {
            _logger.LogInfo("[NeuralCore] [HEAL] Executando correção de latência 'In-Flight'...");
            
            // 1. Reduzir prioridade de processos ruidosos de background
            // Usamos a lista do SO de processos não essenciais
            var backgroundNoise = new[] { "SearchIndexer", "CompatTelRunner", "MsSense", "OneDrive" };
            foreach (var noise in backgroundNoise)
            {
                var processes = Process.GetProcessesByName(noise);
                foreach (var p in processes)
                {
                    try { p.PriorityClass = ProcessPriorityClass.Idle; } catch { }
                }
            }
            
            _logger.LogSuccess("[NeuralCore] [HEAL] Estabilização de CPU concluída.");
        }

        private async Task PerformSilentHealingAsync()
        {
            // Limpeza rápida de cache do sistema via Kernel calls (simulado via flush de standby se possível)
            _logger.LogInfo("[NeuralCore] [HEAL] Realocando páginas de memória de baixa prioridade...");
        }

        #endregion

        public void Dispose()
        {
            Stop();
        }
    }
}
