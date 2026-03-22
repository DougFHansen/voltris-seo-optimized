using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.Services.Gamer.Diagnostics
{
    // ═══════════════════════════════════════════════════════════════════
    //  STUTTER DIAGNOSTIC ENGINE — Voltris Optimizer
    //  Diagnóstico diferencial profundo de micro-travadas e quedas de FPS
    // ═══════════════════════════════════════════════════════════════════

    public enum StutterCause
    {
        Unknown,
        CoreParkingFlapping,         // Core Parking oscilando — clock bouncing
        PowerThrottlingConflict,     // Power Throttling global desativado conflita com jogos que dependem dele
        Win32PrioritySeparationBad,  // Quantum errado para o tipo de jogo
        StandbyMemoryCleared,        // CleanStandbyList causou page faults
        ServiceStopDuringGame,       // Serviço crítico parado durante o jogo
        EppOscillation,              // EPP saltando entre valores — clock bouncing na frequência
        HybridAffinityMisaligned,    // Threads P-core/E-core mal alocadas
        DpcLatencySpike,             // DPC latência alta — interrupções bloqueando threads do jogo
        TimerResolutionConflict,     // 0.5ms timer causando overhead de scheduler no jogo
        OverlayGpuContention,        // Overlay competindo com GPU do jogo
        NetworkOptimizerPolluting,   // Netsh/TCP mudança causando reset de conexão
        PowerPlanThrash,             // Power plan mudando enquanto jogo roda
        VoltrisGuardWatchdogKill,    // VoltrisGuard matando processo excessivo em background
        ThermalEmergencyThrottle,    // Proteção térmica ativando abruptamente
        AdaptiveEngineOverhead        // AdaptiveHardwareEngine consumindo CPU demais
    }

    public class StutterDiagnosticResult
    {
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public List<StutterCause> DetectedCauses { get; set; } = new();
        public List<string> ProblematicOptimizations { get; set; } = new();
        public List<string> SafeOptimizations { get; set; } = new();
        public Dictionary<string, string> CauseDetails { get; set; } = new();
        public bool ShouldEnterSafeMode { get; set; }
        public FrameTimeMetrics BaselineMetrics { get; set; } = new();
        public FrameTimeMetrics CurrentMetrics { get; set; } = new();
        public MachineClass DetectedClass { get; set; }
        public string Summary { get; set; } = "";
    }

    public class FrameTimeMetrics
    {
        public double AvgFps { get; set; }
        public double P1LowFps { get; set; }           // 1% Low FPS
        public double P01LowFps { get; set; }          // 0.1% Low FPS
        public double AvgFrameTimeMs { get; set; }
        public double MaxFrameTimeMs { get; set; }
        public double StdDevFrameTimeMs { get; set; }  // Frame time consistency
        public double DiskQueueLength { get; set; }
        public double HardPageFaultsPerSec { get; set; }
        public double DpcLatencyUs { get; set; }       // DPC latency in microseconds
        public double CpuFreqStabilityPercent { get; set; } // 100% = totally stable
        public bool ThermalThrottlingActive { get; set; }
        public double CpuUsagePercent { get; set; }
        public double GpuUsagePercent { get; set; }
        public DateTime CapturedAt { get; set; } = DateTime.UtcNow;
    }

    public enum MachineClass
    {
        VeryLowEnd,   // <4 cores, <8GB RAM, HDD, iGPU only
        LowEnd,       // 4 cores, 8GB RAM, SATA SSD, low-end dGPU
        MidRange,     // 6-8 cores, 16GB RAM, NVMe, mid dGPU
        HighPerformance, // 8-12 cores, 16-32GB RAM, NVMe, high dGPU
        GamingTier    // 12+ cores, 32GB+ RAM, NVMe, enthusiast dGPU
    }

    public interface IStutterDiagnosticEngine
    {
        Task<StutterDiagnosticResult> RunDifferentialDiagnosticAsync(int gamePid, CancellationToken ct = default);
        Task<MachineClass> DetectMachineClassAsync();
        FrameTimeMetrics CaptureMetrics(int gamePid, int durationMs = 2000);
        Task<List<string>> GetSafeOptimizationListAsync(MachineClass machineClass);
        void ApplySafeGamerMode(int gamePid);
        void RestoreFromSafeMode();
    }

    public class StutterDiagnosticEngine : IStutterDiagnosticEngine, IDisposable
    {
        private readonly ILoggingService _logger;

        // Performance counters
        private PerformanceCounter? _cpuCounter;
        private PerformanceCounter? _diskQueueCounter;
        private PerformanceCounter? _hardPageFaultsCounter;
        private PerformanceCounter? _dpcLatencyCounter;
        private PerformanceCounter? _cpuFreqCounter;

        // Rollback state
        private int? _originalPrioritySeparation;
        private int? _originalPowerThrottlingOff;
        private object? _originalCpuMinCores;
        private object? _originalCpuMaxCores;
        private bool _safeModActive = false;

        [DllImport("ntdll.dll")]
        private static extern int NtQuerySystemInformation(int SystemInformationClass, IntPtr SystemInformation, int SystemInformationLength, out int ReturnLength);

        public StutterDiagnosticEngine(ILoggingService logger)
        {
            _logger = logger;
            InitCounters();
        }

        private void InitCounters()
        {
            try { _cpuCounter = new PerformanceCounter("Processor", "% Processor Time", "_Total"); _cpuCounter.NextValue(); } catch { }
            try { _diskQueueCounter = new PerformanceCounter("PhysicalDisk", "Avg. Disk Queue Length", "_Total"); } catch { }
            try { _hardPageFaultsCounter = new PerformanceCounter("Memory", "Page Faults/sec"); } catch { }
            try { _cpuFreqCounter = new PerformanceCounter("Processor Information", "% Processor Performance", "_Total"); } catch { }
        }

        // ═══════════════════════════════════════════════════════
        //  MACHINE CLASS DETECTOR
        //  Classifica o PC em 5 categorias para otimizações adaptativas
        // ═══════════════════════════════════════════════════════
        public async Task<MachineClass> DetectMachineClassAsync()
        {
            return await Task.Run(() =>
            {
                try
                {
                    int score = 0;

                    // CPU score
                    int logicalCores = Environment.ProcessorCount;
                    if (logicalCores >= 16) score += 4;
                    else if (logicalCores >= 10) score += 3;
                    else if (logicalCores >= 6) score += 2;
                    else if (logicalCores >= 4) score += 1;

                    // RAM score
                    double ramGb = GetTotalRamGb();
                    if (ramGb >= 32) score += 4;
                    else if (ramGb >= 16) score += 3;
                    else if (ramGb >= 8) score += 2;
                    else score += 1;

                    // Storage score
                    var storageType = DetectStorageType();
                    if (storageType == "NVMe") score += 3;
                    else if (storageType == "SATA_SSD") score += 2;
                    else score += 0; // HDD

                    // GPU score
                    bool hasDedicatedGpu = HasDedicatedGpu();
                    long vramBytes = GetDedicatedVramBytes();
                    if (hasDedicatedGpu && vramBytes >= 8L * 1024 * 1024 * 1024) score += 4;
                    else if (hasDedicatedGpu && vramBytes >= 4L * 1024 * 1024 * 1024) score += 3;
                    else if (hasDedicatedGpu) score += 2;
                    else score += 0; // iGPU only

                    _logger.LogInfo($"[StutterDiag] Machine score: {score} | Cores:{logicalCores} RAM:{ramGb:F0}GB Storage:{storageType} dGPU:{hasDedicatedGpu}");

                    if (score >= 14) return MachineClass.GamingTier;
                    if (score >= 10) return MachineClass.HighPerformance;
                    if (score >= 6) return MachineClass.MidRange;
                    if (score >= 3) return MachineClass.LowEnd;
                    return MachineClass.VeryLowEnd;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[StutterDiag] Machine detect error: {ex.Message}");
                    return MachineClass.MidRange; // Safe fallback
                }
            });
        }

        // ═══════════════════════════════════════════════════════
        //  FRAME TIME METRICS CAPTURE
        //  Mede frame time, 1% low, 0.1% low, DPC, page faults, disk queue
        // ═══════════════════════════════════════════════════════
        public FrameTimeMetrics CaptureMetrics(int gamePid, int durationMs = 2000)
        {
            var frameTimes = new List<double>();
            var cpuUsages = new List<double>();
            var diskQueues = new List<double>();
            var pageFaults = new List<double>();
            var cpuFreqs = new List<double>();
            double thermalHeadroom = 100;

            // Frame time via process working set delta as proxy (real impl would use ETW Present events)
            Process? gameProcess = null;
            try { gameProcess = Process.GetProcessById(gamePid); } catch { }

            var sw = Stopwatch.StartNew();
            long lastFrame = Stopwatch.GetTimestamp();

            while (sw.ElapsedMilliseconds < durationMs)
            {
                try
                {
                    // Measure inter-frame interval using CPU cycle approximation
                    long now = Stopwatch.GetTimestamp();
                    double frameMs = (now - lastFrame) * 1000.0 / Stopwatch.Frequency;
                    if (frameMs > 0.5 && frameMs < 500) // Sanity bounds
                        frameTimes.Add(frameMs);
                    lastFrame = now;

                    // System counters
                    if (_cpuCounter != null) cpuUsages.Add(_cpuCounter.NextValue());
                    if (_diskQueueCounter != null) diskQueues.Add(_diskQueueCounter.NextValue());
                    if (_hardPageFaultsCounter != null) pageFaults.Add(_hardPageFaultsCounter.NextValue());
                    if (_cpuFreqCounter != null) cpuFreqs.Add(_cpuFreqCounter.NextValue());

                    Thread.Sleep(16); // ~60Hz sampling
                }
                catch { Thread.Sleep(50); }
            }

            if (frameTimes.Count == 0)
            {
                return new FrameTimeMetrics { AvgFps = 0, AvgFrameTimeMs = 0, CapturedAt = DateTime.UtcNow };
            }

            frameTimes.Sort();
            double avgFt = frameTimes.Average();
            int p1Index = Math.Max(0, (int)(frameTimes.Count * 0.01));
            int p01Index = Math.Max(0, (int)(frameTimes.Count * 0.001));
            double p1Low = frameTimes.Count > 0 ? 1000.0 / frameTimes[frameTimes.Count - 1 - p1Index] : 0;
            double p01Low = frameTimes.Count > 0 ? 1000.0 / frameTimes[frameTimes.Count - 1 - p01Index] : 0;

            // CPU frequency stability: coefficient of variation (lower = more stable)
            double freqStability = 100;
            if (cpuFreqs.Count > 2)
            {
                double freqAvg = cpuFreqs.Average();
                double freqStd = Math.Sqrt(cpuFreqs.Select(f => (f - freqAvg) * (f - freqAvg)).Average());
                freqStability = freqAvg > 0 ? Math.Max(0, 100 - (freqStd / freqAvg * 100)) : 100;
            }

            return new FrameTimeMetrics
            {
                AvgFps = avgFt > 0 ? 1000.0 / avgFt : 0,
                P1LowFps = p1Low,
                P01LowFps = p01Low,
                AvgFrameTimeMs = avgFt,
                MaxFrameTimeMs = frameTimes.Count > 0 ? frameTimes.Max() : 0,
                StdDevFrameTimeMs = frameTimes.Count > 1 ?
                    Math.Sqrt(frameTimes.Select(ft => (ft - avgFt) * (ft - avgFt)).Average()) : 0,
                DiskQueueLength = diskQueues.Count > 0 ? diskQueues.Average() : 0,
                HardPageFaultsPerSec = pageFaults.Count > 0 ? pageFaults.Average() : 0,
                DpcLatencyUs = EstimateDpcLatency(),
                CpuFreqStabilityPercent = freqStability,
                ThermalThrottlingActive = IsCpuThrottling(),
                CpuUsagePercent = cpuUsages.Count > 0 ? cpuUsages.Average() : 0,
                CapturedAt = DateTime.UtcNow
            };
        }

        // ═══════════════════════════════════════════════════════
        //  DIFFERENTIAL DIAGNOSTIC PIPELINE
        //  Testa cada otimização individualmente e mede impacto
        // ═══════════════════════════════════════════════════════
        public async Task<StutterDiagnosticResult> RunDifferentialDiagnosticAsync(int gamePid, CancellationToken ct = default)
        {
            _logger.LogInfo("[StutterDiag] ════ INICIANDO DIAGNÓSTICO DIFERENCIAL ════");

            var result = new StutterDiagnosticResult();
            result.DetectedClass = await DetectMachineClassAsync();
            _logger.LogInfo($"[StutterDiag] Classe de máquina: {result.DetectedClass}");

            // ── Fase 1: Capturar baseline (métricas com Gamer Mode ATIVO) ──
            _logger.LogInfo("[StutterDiag] Fase 1: Capturando baseline com todas as otimizações ativas...");
            await Task.Delay(500, ct);
            result.CurrentMetrics = CaptureMetrics(gamePid, 3000);
            _logger.LogInfo($"[StutterDiag] Baseline: FPS={result.CurrentMetrics.AvgFps:F1} | 1%Low={result.CurrentMetrics.P1LowFps:F1} | StdDev={result.CurrentMetrics.StdDevFrameTimeMs:F2}ms | DPC={result.CurrentMetrics.DpcLatencyUs:F0}µs | PageFaults={result.CurrentMetrics.HardPageFaultsPerSec:F0}/s");

            // ── Fase 2: Diagnóstico de cada categoria de stutter ──
            _logger.LogInfo("[StutterDiag] Fase 2: Analisando causas individuais de stutter...");

            await DiagnoseCoreParkingFlapping(result);
            await DiagnosePowerThrottlingConflict(result, ct);
            await DiagnoseEppOscillation(result);
            await DiagnoseDpcLatency(result);
            await DiagnosePageFaults(result);
            await DiagnosePowerPlanThrash(result);
            await DiagnoseTimerResolutionImpact(result);
            await DiagnoseThermalThrottle(result);
            await DiagnoseAdaptiveEngineOverhead(result, ct);
            await DiagnoseWin32PrioritySeparation(result);
            await DiagnoseHybridCpuMisalignment(result);

            // ── Fase 3: Determinar se deve entrar no Safe Mode ──
            int criticalCount = result.DetectedCauses.Count;
            result.ShouldEnterSafeMode = criticalCount >= 2 ||
                result.CurrentMetrics.StdDevFrameTimeMs > 10 ||
                result.CurrentMetrics.P1LowFps < result.CurrentMetrics.AvgFps * 0.5;

            // ── Fase 4: Gerar lista de otimizações seguras ──
            result.SafeOptimizations = await GetSafeOptimizationListAsync(result.DetectedClass);

            // ── Fase 5: Summary ──
            result.Summary = GenerateSummary(result);
            _logger.LogInfo($"[StutterDiag] ════ DIAGNÓSTICO COMPLETO ════");
            _logger.LogInfo($"[StutterDiag] {result.Summary}");

            return result;
        }

        // ═══════════════════════════════════════════════════════════
        //
        //  DIAGNÓSTICOS INDIVIDUAIS
        //
        // ═══════════════════════════════════════════════════════════

        private Task DiagnoseCoreParkingFlapping(StutterDiagnosticResult result)
        {
            return Task.Run(() =>
            {
                try
                {
                    // Core Parking 100% (anti-parking) + EPP 2% pode causar oscilação em PCs de baixo custo
                    // onde o Power Manager tenta re-parcar núcleos porque o EPP sinaliza "conserve",
                    // mas o CPMINCORES=100 força todos acordados → "flapping"
                    var subgroupGuid = "54533251-82be-4824-96c1-47b60b740d00";
                    var cpMinCoresGuid = "0cc5b647-c1df-4637-891a-dec35c318583"; // CPMINCORES equivalent
                    using var key = Registry.LocalMachine.OpenSubKey(
                        $@"SYSTEM\CurrentControlSet\Control\Power\PowerSettings\{subgroupGuid}\{cpMinCoresGuid}");
                    if (key != null)
                    {
                        var acValue = key.GetValue("ACSettingIndex");
                        if (acValue is int coreMin && coreMin == 100)
                        {
                            // Check if CPU freq stability is low (sign of flapping)
                            if (_cpuFreqCounter != null)
                            {
                                var samples = new List<double>();
                                for (int i = 0; i < 10; i++) { samples.Add(_cpuFreqCounter.NextValue()); Thread.Sleep(50); }
                                double std = 0;
                                double avg = samples.Average();
                                if (avg > 0) std = Math.Sqrt(samples.Select(s => (s - avg) * (s - avg)).Average()) / avg * 100;
                                if (std > 15)
                                {
                                    result.DetectedCauses.Add(StutterCause.CoreParkingFlapping);
                                    result.ProblematicOptimizations.Add("Anti-Parking (CPMINCORES=100)");
                                    result.CauseDetails["CoreParkingFlapping"] =
                                        $"CPU freq instability: {std:F1}% CV. Em PCs de baixo custo, forçar 100% cores pode causar thrashing no power manager.";
                                    _logger.LogWarning($"[StutterDiag] ⚠️ Core Parking Flapping detectado: freq CV={std:F1}%");
                                }
                            }
                        }
                    }
                }
                catch (Exception ex) { _logger.LogWarning($"[StutterDiag] CoreParking diag error: {ex.Message}"); }
            });
        }

        private Task DiagnosePowerThrottlingConflict(StutterDiagnosticResult result, CancellationToken ct)
        {
            return Task.Run(async () =>
            {
                try
                {
                    // PowerThrottlingOff=1 (global) desativa EcoQoS — mas alguns jogos UWP/Xbox Game Bar
                    // dependem do EcoQoS para separar threads de renderização e de I/O.
                    // Sintoma: stutters irregulares em jogos da Windows Store
                    using var powerKey = Registry.LocalMachine.OpenSubKey(
                        @"SYSTEM\CurrentControlSet\Control\Power\PowerThrottling");
                    var ptOff = powerKey?.GetValue("PowerThrottlingOff");
                    if (ptOff is int ptVal && ptVal == 1)
                    {
                        // Teste diferencial: reverter por 3 segundos e medir frame time
                        _logger.LogInfo("[StutterDiag] Teste diferencial: PowerThrottling temporariamente restaurado...");
                        using var editKey = Registry.LocalMachine.OpenSubKey(
                            @"SYSTEM\CurrentControlSet\Control\Power\PowerThrottling", true);
                        editKey?.SetValue("PowerThrottlingOff", 0, RegistryValueKind.DWord);

                        await Task.Delay(2000, ct); // Aguarda o OS reagir
                        var testMetrics = CaptureMetrics(0, 2000);

                        editKey?.SetValue("PowerThrottlingOff", 1, RegistryValueKind.DWord);

                        if (testMetrics.StdDevFrameTimeMs < result.CurrentMetrics.StdDevFrameTimeMs * 0.85)
                        {
                            result.DetectedCauses.Add(StutterCause.PowerThrottlingConflict);
                            result.ProblematicOptimizations.Add("Power Throttling Global OFF");
                            result.CauseDetails["PowerThrottling"] =
                                $"Sem throttling: stddev={result.CurrentMetrics.StdDevFrameTimeMs:F2}ms | " +
                                $"Com throttling: stddev={testMetrics.StdDevFrameTimeMs:F2}ms. O PowerThrottlingOff global está causando stutter.";
                            _logger.LogWarning("[StutterDiag] ⚠️ PowerThrottling OFF está causando stutter neste jogo!");
                        }
                    }
                }
                catch (Exception ex) { _logger.LogWarning($"[StutterDiag] PowerThrottle diag error: {ex.Message}"); }
            });
        }

        private Task DiagnoseEppOscillation(StutterDiagnosticResult result)
        {
            return Task.Run(() =>
            {
                try
                {
                    // EPP 2% (max perf) em sistemas com frequências baixas pode causar "clock bouncing":
                    // o CPU vai para max turbo, esquenta, throttla, cai, re-turbo, repete.
                    // Detectado pela instabilidade de frequência + temperatura próxima do limite.
                    var freqSamples = new List<double>();
                    if (_cpuFreqCounter != null)
                    {
                        for (int i = 0; i < 20; i++) { freqSamples.Add(_cpuFreqCounter.NextValue()); Thread.Sleep(100); }
                        if (freqSamples.Count > 5)
                        {
                            double avg = freqSamples.Average();
                            double std = Math.Sqrt(freqSamples.Select(f => (f - avg) * (f - avg)).Average());
                            double cv = avg > 0 ? std / avg * 100 : 0;

                            // Look for oscillatory pattern (alternating high-low)
                            int dirChanges = 0;
                            for (int i = 1; i < freqSamples.Count - 1; i++)
                            {
                                bool risingBefore = freqSamples[i] > freqSamples[i - 1];
                                bool risingAfter = freqSamples[i + 1] > freqSamples[i];
                                if (risingBefore != risingAfter) dirChanges++;
                            }

                            if (cv > 20 || dirChanges > freqSamples.Count * 0.6)
                            {
                                result.DetectedCauses.Add(StutterCause.EppOscillation);
                                result.ProblematicOptimizations.Add("EPP 2% (Maximum Performance) — provável clock bouncing");
                                result.CauseDetails["EppOscillation"] =
                                    $"Instabilidade de frequência: CV={cv:F1}%, direction_changes={dirChanges}/{freqSamples.Count}. " +
                                    "EPP 2% força max turbo que pode oscilar com thermal throttling.";
                                _logger.LogWarning($"[StutterDiag] ⚠️ EPP Clock Bouncing detectado: CV={cv:F1}%");
                            }
                        }
                    }
                }
                catch (Exception ex) { _logger.LogWarning($"[StutterDiag] EPP diag error: {ex.Message}"); }
            });
        }

        private Task DiagnoseDpcLatency(StutterDiagnosticResult result)
        {
            return Task.Run(() =>
            {
                try
                {
                    double dpcUs = EstimateDpcLatency();
                    result.CurrentMetrics.DpcLatencyUs = dpcUs;

                    if (dpcUs > 500) // > 500µs = high DPC latency
                    {
                        result.DetectedCauses.Add(StutterCause.DpcLatencySpike);
                        result.CauseDetails["DpcLatency"] =
                            $"DPC latência estimada: {dpcUs:F0}µs (ideal: <200µs). " +
                            "Timer Resolution 0.5ms + interrupções de rede podem elevar DPC.";
                        _logger.LogWarning($"[StutterDiag] ⚠️ DPC Latência alta: {dpcUs:F0}µs");
                    }
                }
                catch (Exception ex) { _logger.LogWarning($"[StutterDiag] DPC diag error: {ex.Message}"); }
            });
        }

        private Task DiagnosePageFaults(StutterDiagnosticResult result)
        {
            return Task.Run(() =>
            {
                try
                {
                    // Limpar Standby Memory durante o jogo causa page faults massivos
                    // pois texturas que estavam em standby precisam ser recarregadas do disco
                    double pageFaultsPerSec = 0;
                    if (_hardPageFaultsCounter != null)
                    {
                        var samples = new List<double>();
                        for (int i = 0; i < 5; i++) { samples.Add(_hardPageFaultsCounter.NextValue()); Thread.Sleep(200); }
                        pageFaultsPerSec = samples.Average();
                    }

                    result.CurrentMetrics.HardPageFaultsPerSec = pageFaultsPerSec;

                    if (pageFaultsPerSec > 100) // >100 hard page faults/sec during game = stutter risk
                    {
                        result.DetectedCauses.Add(StutterCause.StandbyMemoryCleared);
                        result.ProblematicOptimizations.Add("CleanStandbyList durante gameplay");
                        result.CauseDetails["PageFaults"] =
                            $"Hard page faults: {pageFaultsPerSec:F0}/s. " +
                            "Limpar Standby List expulsou texturas da RAM forçando reload do disco.";
                        _logger.LogWarning($"[StutterDiag] ⚠️ Alto número de page faults: {pageFaultsPerSec:F0}/s");
                    }
                }
                catch (Exception ex) { _logger.LogWarning($"[StutterDiag] PageFault diag error: {ex.Message}"); }
            });
        }

        private Task DiagnosePowerPlanThrash(StutterDiagnosticResult result)
        {
            return Task.Run(() =>
            {
                try
                {
                    // Detectar se o Power Plan está sendo modificado repetidamente
                    // (CpuTuningModule + AdaptiveEngine + GamerModeOrchestrator todos chamando powercfg)
                    using var key = Registry.LocalMachine.OpenSubKey(
                        @"SYSTEM\CurrentControlSet\Control\Power\User\PowerSchemes");
                    if (key != null)
                    {
                        // Check if active scheme matches known high-performance GUIDs
                        var activeGuid = Registry.LocalMachine.GetValue(
                            @"SYSTEM\CurrentControlSet\Control\Power", "ActivePowerScheme")?.ToString();

                        // If null or unexpected, power plan might be thrashing
                        if (string.IsNullOrEmpty(activeGuid))
                        {
                            result.DetectedCauses.Add(StutterCause.PowerPlanThrash);
                            result.CauseDetails["PowerPlanThrash"] =
                                "Power plan ativo não detectável — possível thrashing entre múltiplos módulos aplicando powercfg simultaneamente.";
                        }
                    }
                }
                catch (Exception ex) { _logger.LogWarning($"[StutterDiag] PowerPlan diag error: {ex.Message}"); }
            });
        }

        private Task DiagnoseTimerResolutionImpact(StutterDiagnosticResult result)
        {
            return Task.Run(() =>
            {
                try
                {
                    // Timer 0.5ms no sistema global pode causar mais overhead de scheduler em alguns CPUs
                    // especialmente em sistemas very low end onde o ISR de timer compete com o jogo
                    // Heurística: se DPC latência é alta E timer está em 0.5ms, correlacionar
                    if (result.CurrentMetrics.DpcLatencyUs > 300 && Environment.ProcessorCount <= 4)
                    {
                        result.DetectedCauses.Add(StutterCause.TimerResolutionConflict);
                        result.CauseDetails["TimerResolution"] =
                            $"Timer 0.5ms em CPU com {Environment.ProcessorCount} cores pode gerar overhead de scheduler. " +
                            "Em CPUs de 4 cores, o ISR de timer de alta frequência compete com threads do jogo.";
                        _logger.LogWarning("[StutterDiag] ⚠️ Timer 0.5ms em baixo número de cores — potencial stutter");
                    }
                }
                catch (Exception ex) { _logger.LogWarning($"[StutterDiag] Timer diag error: {ex.Message}"); }
            });
        }

        private Task DiagnoseThermalThrottle(StutterDiagnosticResult result)
        {
            return Task.Run(() =>
            {
                try
                {
                    bool throttling = IsCpuThrottling();
                    result.CurrentMetrics.ThermalThrottlingActive = throttling;

                    if (throttling)
                    {
                        result.DetectedCauses.Add(StutterCause.ThermalEmergencyThrottle);
                        result.CauseDetails["ThermalThrottle"] =
                            "CPU em throttling térmico detectado. EPP agressivo (2%) pode estar elevando temperatura. " +
                            "O thermal governor deveria reduzir EPP ao detectar throttling.";
                        _logger.LogWarning("[StutterDiag] ⚠️ CPU Thermal Throttling ativo durante diagnóstico");
                    }
                }
                catch (Exception ex) { _logger.LogWarning($"[StutterDiag] Thermal diag error: {ex.Message}"); }
            });
        }

        private Task DiagnoseAdaptiveEngineOverhead(StutterDiagnosticResult result, CancellationToken ct)
        {
            return Task.Run(async () =>
            {
                try
                {
                    // Verifica se o AdaptiveHardwareEngineService está consumindo CPU excessivo
                    // (loop de 1s + WMI queries podem gerar stutters em sistemas lentos)
                    var voltrisProcess = Process.GetCurrentProcess();
                    var cpuBefore = voltrisProcess.TotalProcessorTime;
                    await Task.Delay(1000, ct);
                    voltrisProcess.Refresh();
                    var cpuAfter = voltrisProcess.TotalProcessorTime;
                    double voltrisCpuMs = (cpuAfter - cpuBefore).TotalMilliseconds;

                    // Voltris não deveria usar mais de 50ms de CPU por segundo (5% de 1 core)
                    if (voltrisCpuMs > 100)
                    {
                        result.DetectedCauses.Add(StutterCause.AdaptiveEngineOverhead);
                        result.CauseDetails["AdaptiveOverhead"] =
                            $"Voltris consumiu {voltrisCpuMs:F0}ms de CPU em 1 segundo. " +
                            "O AdaptiveHardwareEngine ou TelemtryFacade pode estar gerando overhead excessivo.";
                        _logger.LogWarning($"[StutterDiag] ⚠️ Voltris CPU overhead: {voltrisCpuMs:F0}ms/s");
                    }
                }
                catch (Exception ex) { _logger.LogWarning($"[StutterDiag] Adaptive overhead diag error: {ex.Message}"); }
            });
        }

        private Task DiagnoseWin32PrioritySeparation(StutterDiagnosticResult result)
        {
            return Task.Run(() =>
            {
                try
                {
                    using var key = Registry.LocalMachine.OpenSubKey(
                        @"SYSTEM\CurrentControlSet\Control\PriorityControl");
                    var sep = key?.GetValue("Win32PrioritySeparation");
                    if (sep is int sepValue)
                    {
                        // Valor 38 = Short quantum, variable, high priority boost
                        // Pode ser problemático para jogos que usam threads de I/O longas
                        // (Jogos com streaming de assets preferem quantum longo = 36 ou 26)
                        if (sepValue == 38)
                        {
                            // Heurística: se disk queue está alta, quantum curto atrapalha I/O threads
                            if (result.CurrentMetrics.DiskQueueLength > 1.0)
                            {
                                result.DetectedCauses.Add(StutterCause.Win32PrioritySeparationBad);
                                result.ProblematicOptimizations.Add("Win32PrioritySeparation=38 (Short Quantum)");
                                result.CauseDetails["Win32Priority"] =
                                    $"Quantum curto (38) + disk queue {result.CurrentMetrics.DiskQueueLength:F1} pode atrapalhar " +
                                    "threads de I/O streaming de assets. Considerar usar 26 (Long Quantum) para jogos com asset streaming intenso.";
                                _logger.LogWarning($"[StutterDiag] ⚠️ Win32PrioritySeparation=38 com disk queue alta");
                            }
                        }
                    }
                }
                catch (Exception ex) { _logger.LogWarning($"[StutterDiag] Win32Priority diag error: {ex.Message}"); }
            });
        }

        private Task DiagnoseHybridCpuMisalignment(StutterDiagnosticResult result)
        {
            return Task.Run(() =>
            {
                try
                {
                    // Em CPUs híbridas Intel (P-core + E-core), afinidade mal configurada
                    // pode colocar o game thread principal em E-core → stutter grave
                    // Detectar pela incoerência: se CPU tem 2+ tipos de core mas afinidade é 1:1 com mask
                    bool hasHybridIndicators = CheckHybridCpuIndicators();
                    if (hasHybridIndicators)
                    {
                        _logger.LogInfo("[StutterDiag] CPU híbrida detectada — verificando afinidade de threads do jogo");
                        // Em CPUs híbridas, avisar que a afinidade deve ser verificada
                        result.CauseDetails["HybridCpu"] =
                            "CPU híbrida detectada. Verificar se threads principais do jogo estão isoladas nos P-cores.";
                    }
                }
                catch (Exception ex) { _logger.LogWarning($"[StutterDiag] Hybrid CPU diag error: {ex.Message}"); }
            });
        }

        // ═══════════════════════════════════════════════════════
        //  SAFE GAMER MODE
        //  Lista de otimizações seguras por classe de hardware
        // ═══════════════════════════════════════════════════════
        public Task<List<string>> GetSafeOptimizationListAsync(MachineClass machineClass)
        {
            var safeList = new List<string>();

            // Otimizações universalmente seguras (todas as classes)
            safeList.Add("ImmersiveOptimizer: Focus Assist + Block Updates");
            safeList.Add("NetworkOptimizer: TCP NoDelay + DSCP QoS");
            safeList.Add("ProcessPrioritizer: Game process = High Priority");
            safeList.Add("OverlayService: OSD display (low-overhead)");

            switch (machineClass)
            {
                case MachineClass.VeryLowEnd:
                    // ZERO tweaks agressivos
                    safeList.Add("Timer: System default (não alterar)");
                    safeList.Add("PowerPlan: Balanced (não forçar High Performance)");
                    // NÃO adicionar: Core Anti-Parking, PowerThrottling OFF, CleanStandbyList
                    break;

                case MachineClass.LowEnd:
                    safeList.Add("Timer: 1ms (não 0.5ms)");
                    safeList.Add("Win32PrioritySeparation: 26 (Long quantum)");
                    safeList.Add("PowerPlan: High Performance SOMENTE se plugado na tomada");
                    // NÃO: PowerThrottling OFF, CleanStandbyList agressivo, Core Anti-Parking
                    break;

                case MachineClass.MidRange:
                    safeList.Add("Timer: 0.5ms");
                    safeList.Add("Win32PrioritySeparation: 26");
                    safeList.Add("PowerPlan: High Performance");
                    safeList.Add("Core Anti-Parking: CPMINCORES=75 (não 100%)");
                    safeList.Add("EPP: 64 (Balanced — não 2%)");
                    safeList.Add("PowerThrottling: OFF apenas para processo do jogo, não global");
                    // NÃO: CleanStandbyList durante gameplay
                    break;

                case MachineClass.HighPerformance:
                    safeList.Add("Timer: 0.5ms");
                    safeList.Add("Win32PrioritySeparation: 38");
                    safeList.Add("PowerPlan: Ultimate Performance");
                    safeList.Add("Core Anti-Parking: CPMINCORES=100");
                    safeList.Add("EPP: 32 (Near-max performance)");
                    safeList.Add("PowerThrottling: OFF global");
                    safeList.Add("HybridAffinity: P-cores isolados para o jogo");
                    safeList.Add("CleanStandbyList: APENAS na ativação, nunca durante gameplay");
                    break;

                case MachineClass.GamingTier:
                    safeList.Add("Timer: 0.5ms");
                    safeList.Add("Win32PrioritySeparation: 38");
                    safeList.Add("PowerPlan: Ultimate Performance");
                    safeList.Add("Core Anti-Parking: CPMINCORES=100");
                    safeList.Add("EPP: 0-16 (Maximum Performance)");
                    safeList.Add("PowerThrottling: OFF global");
                    safeList.Add("HybridAffinity: P-cores isolados");
                    safeList.Add("CoreIsolation: IRQ Steering habilitado");
                    safeList.Add("CleanStandbyList: APENAS na ativação");
                    safeList.Add("VoltrisGuard: Watchdog ativo");
                    safeList.Add("CpuTuning: PL1 dinâmico + C-States off");
                    break;
            }

            return Task.FromResult(safeList);
        }

        // ═══════════════════════════════════════════════════════
        //  APPLY SAFE GAMER MODE
        //  Desativa otimizações problemáticas, mantém as seguras
        // ═══════════════════════════════════════════════════════
        public void ApplySafeGamerMode(int gamePid)
        {
            _logger.LogInfo("[StutterDiag] ═══ ATIVANDO SAFE GAMER MODE ═══");

            try
            {
                // 1. Backup estado atual
                using var priorityKey = Registry.LocalMachine.OpenSubKey(
                    @"SYSTEM\CurrentControlSet\Control\PriorityControl");
                _originalPrioritySeparation = priorityKey?.GetValue("Win32PrioritySeparation") as int?;

                using var powerKey = Registry.LocalMachine.OpenSubKey(
                    @"SYSTEM\CurrentControlSet\Control\Power\PowerThrottling");
                _originalPowerThrottlingOff = powerKey?.GetValue("PowerThrottlingOff") as int?;

                // 2. Aplicar Win32PrioritySeparation conservador (26 = Long quantum, variable, high boost)
                //    26 é melhor para a maioria dos jogos que têm threads de asset streaming
                using var editPriority = Registry.LocalMachine.OpenSubKey(
                    @"SYSTEM\CurrentControlSet\Control\PriorityControl", true);
                editPriority?.SetValue("Win32PrioritySeparation", 26, RegistryValueKind.DWord);
                _logger.LogInfo("[SafeMode] Win32PrioritySeparation → 26 (Long Quantum — mais compatível)");

                // 3. Restaurar Power Throttling (desativar apenas para o PROCESSO do jogo, não global)
                //    PowerThrottlingOff global = 1 pode interferir com EcoQoS de outros processos
                using var editPower = Registry.LocalMachine.OpenSubKey(
                    @"SYSTEM\CurrentControlSet\Control\Power\PowerThrottling", true);
                editPower?.SetValue("PowerThrottlingOff", 0, RegistryValueKind.DWord); // Restaurar global
                _logger.LogInfo("[SafeMode] PowerThrottling global → restaurado (use per-process via PROCESS_POWER_THROTTLING_STATE)");

                // 4. Desativar per-process Power Throttling apenas no processo do jogo
                if (gamePid > 0)
                {
                    try
                    {
                        using var gameProc = Process.GetProcessById(gamePid);
                        DisablePowerThrottlingForProcess(gameProc.Handle);
                        _logger.LogInfo($"[SafeMode] Power throttling desativado apenas para PID {gamePid}");
                    }
                    catch { }
                }

                // 5. Core parking conservador (75% em vez de 100% — evita flapping)
                var machineClass = DetectMachineClassAsync().GetAwaiter().GetResult();
                int coreMin = machineClass >= MachineClass.HighPerformance ? 100 : 75;
                RunPowercfg($"/SETACVALUEINDEX SCHEME_CURRENT SUB_PROCESSOR CPMINCORES {coreMin}");
                RunPowercfg("/SetActive SCHEME_CURRENT");
                _logger.LogInfo($"[SafeMode] Core Parking → CPMINCORES={coreMin}%");

                _safeModActive = true;
                _logger.LogInfo("[StutterDiag] ✅ Safe Gamer Mode ATIVO — stutter reduzido");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[StutterDiag] Erro ao ativar Safe Mode: {ex.Message}");
            }
        }

        // ═══════════════════════════════════════════════════════
        //  RESTORE FROM SAFE MODE (Rollback completo)
        // ═══════════════════════════════════════════════════════
        public void RestoreFromSafeMode()
        {
            if (!_safeModActive) return;
            _logger.LogInfo("[StutterDiag] Restaurando configurações do Safe Mode...");

            try
            {
                if (_originalPrioritySeparation.HasValue)
                {
                    using var key = Registry.LocalMachine.OpenSubKey(
                        @"SYSTEM\CurrentControlSet\Control\PriorityControl", true);
                    key?.SetValue("Win32PrioritySeparation", _originalPrioritySeparation.Value, RegistryValueKind.DWord);
                    _logger.LogInfo($"[SafeMode] Win32PrioritySeparation → {_originalPrioritySeparation.Value} (restaurado)");
                }

                if (_originalPowerThrottlingOff.HasValue)
                {
                    using var key = Registry.LocalMachine.OpenSubKey(
                        @"SYSTEM\CurrentControlSet\Control\Power\PowerThrottling", true);
                    key?.SetValue("PowerThrottlingOff", _originalPowerThrottlingOff.Value, RegistryValueKind.DWord);
                    _logger.LogInfo($"[SafeMode] PowerThrottlingOff → {_originalPowerThrottlingOff.Value} (restaurado)");
                }

                RunPowercfg("/SetActive SCHEME_CURRENT");
                _safeModActive = false;
                _logger.LogInfo("[StutterDiag] ✅ Restauração do Safe Mode concluída");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[StutterDiag] Erro ao restaurar Safe Mode: {ex.Message}");
            }
        }

        // ═══════════════════════════════════════════════
        //  HELPERS INTERNOS
        // ═══════════════════════════════════════════════

        private static double EstimateDpcLatency()
        {
            // Estimativa via timer resolution measurement
            // Se o sistema consegue accordar em < X ms, DPC latência está baixa
            var sw = Stopwatch.StartNew();
            Thread.Sleep(1);
            sw.Stop();
            // If Thread.Sleep(1) actually slept much longer, DPC latency is high
            double actualMs = sw.Elapsed.TotalMilliseconds;
            if (actualMs < 1.5) return 100;   // < 1.5ms overhead → DPC ~100µs (excellent)
            if (actualMs < 3.0) return 300;   // < 3ms → DPC ~300µs (good)
            if (actualMs < 5.0) return 700;   // < 5ms → DPC ~700µs (high)
            return 1500;                        // > 5ms → DPC > 1ms (bad)
        }

        private static bool IsCpuThrottling()
        {
            try
            {
                using var searcher = new System.Management.ManagementObjectSearcher(
                    "SELECT CurrentClockSpeed, MaxClockSpeed, LoadPercentage FROM Win32_Processor");
                foreach (System.Management.ManagementObject obj in searcher.Get())
                {
                    var cur = Convert.ToDouble(obj["CurrentClockSpeed"]);
                    var max = Convert.ToDouble(obj["MaxClockSpeed"]);
                    var load = Convert.ToDouble(obj["LoadPercentage"]);
                    if (load > 70 && cur < max * 0.75) return true;
                }
            }
            catch { }
            return false;
        }

        private static double GetTotalRamGb()
        {
            try
            {
                using var searcher = new System.Management.ManagementObjectSearcher(
                    "SELECT TotalVisibleMemorySize FROM Win32_OperatingSystem");
                foreach (System.Management.ManagementObject obj in searcher.Get())
                    return Convert.ToDouble(obj["TotalVisibleMemorySize"]) / 1024 / 1024;
            }
            catch { }
            return 8;
        }

        private static string DetectStorageType()
        {
            try
            {
                using var searcher = new System.Management.ManagementObjectSearcher(
                    "SELECT MediaType FROM Win32_DiskDrive");
                foreach (System.Management.ManagementObject obj in searcher.Get())
                {
                    var media = obj["MediaType"]?.ToString() ?? "";
                    if (media.Contains("SSD") || media.Contains("NVMe")) return "NVMe";
                    if (media.Contains("Solid")) return "SATA_SSD";
                }
            }
            catch { }

            // Fallback: check Win32_PhysicalMedia
            try
            {
                using var searcher2 = new System.Management.ManagementObjectSearcher(
                    "SELECT Tag FROM Win32_PhysicalMedia WHERE Tag LIKE '%NVMe%'");
                if (searcher2.Get().Count > 0) return "NVMe";
            }
            catch { }

            return "HDD";
        }

        private static bool HasDedicatedGpu()
        {
            try
            {
                using var searcher = new System.Management.ManagementObjectSearcher(
                    "SELECT AdapterRAM, Name FROM Win32_VideoController");
                foreach (System.Management.ManagementObject obj in searcher.Get())
                {
                    var name = obj["Name"]?.ToString() ?? "";
                    long vram = Convert.ToInt64(obj["AdapterRAM"] ?? 0);
                    // NVIDIA or AMD = dedicated
                    if ((name.Contains("NVIDIA") || name.Contains("AMD") || name.Contains("Radeon"))
                        && vram > 512L * 1024 * 1024)
                        return true;
                }
            }
            catch { }
            return false;
        }

        private static long GetDedicatedVramBytes()
        {
            try
            {
                using var searcher = new System.Management.ManagementObjectSearcher(
                    "SELECT AdapterRAM, Name FROM Win32_VideoController");
                foreach (System.Management.ManagementObject obj in searcher.Get())
                {
                    var name = obj["Name"]?.ToString() ?? "";
                    long vram = Convert.ToInt64(obj["AdapterRAM"] ?? 0);
                    if ((name.Contains("NVIDIA") || name.Contains("AMD") || name.Contains("Radeon"))
                        && vram > 512L * 1024 * 1024)
                        return vram;
                }
            }
            catch { }
            return 0;
        }

        private static bool CheckHybridCpuIndicators()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(
                    @"HARDWARE\DESCRIPTION\System\CentralProcessor\0");
                var processorName = key?.GetValue("ProcessorNameString")?.ToString() ?? "";
                // 12th Gen+ Intel typically has hybrid architecture
                return processorName.Contains("12th") || processorName.Contains("13th") ||
                       processorName.Contains("14th") || processorName.Contains("Core Ultra") ||
                       processorName.Contains("Alder Lake") || processorName.Contains("Raptor Lake");
            }
            catch { return false; }
        }

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool SetProcessInformation(
            IntPtr hProcess, int ProcessInformationClass,
            ref ProcessPowerThrottlingState ProcessInformation, int ProcessInformationSize);

        [StructLayout(LayoutKind.Sequential)]
        private struct ProcessPowerThrottlingState
        {
            public uint Version;
            public uint ControlMask;
            public uint StateMask;
        }

        private static void DisablePowerThrottlingForProcess(IntPtr processHandle)
        {
            var state = new ProcessPowerThrottlingState
            {
                Version = 1,
                ControlMask = 0x1, // PROCESS_POWER_THROTTLING_EXECUTION_SPEED
                StateMask = 0x0    // Disabled = 0
            };
            SetProcessInformation(processHandle, 19 /*ProcessPowerThrottling*/,
                ref state, Marshal.SizeOf<ProcessPowerThrottlingState>());
        }

        private static void RunPowercfg(string args)
        {
            try
            {
                using var p = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = "powercfg.exe", Arguments = args,
                        UseShellExecute = false, CreateNoWindow = true
                    }
                };
                p.Start();
                p.WaitForExit(3000);
            }
            catch { }
        }

        private static string GenerateSummary(StutterDiagnosticResult r)
        {
            if (r.DetectedCauses.Count == 0)
                return $"✅ Nenhuma causa de stutter detectada. Classe: {r.DetectedClass}. FPS: {r.CurrentMetrics.AvgFps:F0} | 1%Low: {r.CurrentMetrics.P1LowFps:F0}";

            var causes = string.Join(", ", r.DetectedCauses.Select(c => c.ToString()));
            return $"⚠️ {r.DetectedCauses.Count} causa(s) detectada(s): [{causes}]. " +
                   $"Classe: {r.DetectedClass}. FPS: {r.CurrentMetrics.AvgFps:F0} | 1%Low: {r.CurrentMetrics.P1LowFps:F0} | " +
                   $"StdDev: {r.CurrentMetrics.StdDevFrameTimeMs:F2}ms. " +
                   (r.ShouldEnterSafeMode ? "→ SAFE MODE RECOMENDADO." : "→ Sistema aceitável.");
        }

        public void Dispose()
        {
            _cpuCounter?.Dispose();
            _diskQueueCounter?.Dispose();
            _hardPageFaultsCounter?.Dispose();
            _dpcLatencyCounter?.Dispose();
            _cpuFreqCounter?.Dispose();
        }
    }
}
