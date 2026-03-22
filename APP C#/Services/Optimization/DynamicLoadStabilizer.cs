using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Models;
using VoltrisOptimizer.Services.Optimization;
using VoltrisOptimizer.Services.Optimization.Engines;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Services.Gamer.GamerModeManager;
using VoltrisOptimizer.Services.Gamer.Implementation;

namespace VoltrisOptimizer.Services.Optimization
{
    /// <summary>
    /// DSL 5.0 - Motor de Estabilização Inteligente (Stability Agent).
    /// Integra todos os engines especializados em um loop unificado com telemetria do kernel.
    /// Foco em responsividade real: abertura de programas, troca de janelas, fluidez do Explorer.
    /// </summary>
    public class DynamicLoadStabilizer : IDynamicLoadStabilizer
    {
        private readonly object _lock = new();
        private CancellationTokenSource? _cts;
        private Task? _monitorTask;

        // Métricas e Estado
        private readonly ConcurrentDictionary<int, TimeSpan> _prevCpuTimes = new();
        private readonly HashSet<int> _throttled = new();
        private readonly ConcurrentDictionary<int, ProcessPriorityClass> _boostedProcesses = new();
        private DateTime _lastSampleTime = DateTime.MinValue;

        // Cache e Controle
        private DateTime _lastProcessRefresh = DateTime.MinValue;
        private DateTime _lastMemoryTrim = DateTime.MinValue;
        private Process[] _cachedProcesses = Array.Empty<Process>();
        private HashSet<int> _previousProcessPids = new();
        private int? _gamePid;
        private int? _lastForegroundPid;
        private IntelligentProfileType _currentProfile = IntelligentProfileType.GeneralBalanced;
        private readonly int _ownPid = Process.GetCurrentProcess().Id;

        // === DSL 5.0 ENGINES ===
        private readonly SharedTelemetryProvider _telemetry;
        private readonly DecisionEngine50 _decisionEngine;
        private readonly CpuGovernorEngine _cpuGovernor;
        private readonly IoSchedulerEngine _ioScheduler;
        private readonly InputLatencyEngine? _inputLatency;
        private readonly InterruptLatencyEngine _interruptLatency;
        private readonly ProcessBehaviorEngine _behaviorEngine;
        private readonly ThermalPowerEngine _thermalEngine;
        private readonly StabilityGuardEngine _stabilityGuard;
        private readonly HardwareDetectionEngine _hardwareDetection;
        private readonly ProcessLaunchAccelerator _launchAccelerator;
        private readonly SystemState50 _systemState = new();

        // Serviços base
        private readonly ILoggingService _logger;
        private readonly DlsLogger _dlsLogger;
        private readonly CoreLoadHeuristics _heuristics;
        private readonly Helpers.NativeSystemMetrics _nativeMetrics = new();
        private readonly CriticalProcessDetector _detector;
        private readonly Providers.IGpuLoadProvider? _gpuProvider;
        private readonly Providers.IProcessProvider? _processProvider;
        private readonly ProcessCacheService? _processCache;
        private readonly GameDetectionService? _gameDetection;
        private readonly StabilityEngineService? _stabilityEngine;

        // === MÉTRICAS DE IMPACTO ===
        private long _totalCycles;
        private long _totalActionsApplied;
        private long _totalProcessesThrottled;
        private long _totalStartupBoosts;
        private double _cycleTimeAccumulatorMs;
        private readonly Stopwatch _cycleStopwatch = new();

        // Explorer responsiveness tracking
        private DateTime _lastExplorerCheck = DateTime.MinValue;
        private int _explorerStallCount;

        public bool IsRunning { get; private set; }
        public bool Enabled { get; set; } = true;
        public TimeSpan Interval { get; set; } = TimeSpan.FromMilliseconds(5000);

        public event EventHandler<ThrottledEventArgs>? OnProcessThrottled;
        public event EventHandler<ThrottledEventArgs>? OnProcessReleased;

        public IReadOnlyCollection<int> ThrottledProcessIds
        {
            get { lock (_lock) { return _throttled.ToList().AsReadOnly(); } }
        }

        public DynamicLoadStabilizer(
            ILoggingService? logger = null,
            Providers.ICpuCoreLoadProvider? cpuProvider = null,
            Providers.IGpuLoadProvider? gpuProvider = null,
            Providers.IProcessProvider? processProvider = null,
            CoreLoadHeuristics? heuristics = null,
            CriticalProcessDetector? detector = null,
            ProcessCacheService? processCache = null,
            GameDetectionService? gameDetection = null,
            StabilityEngineService? stabilityEngine = null)
        {
            _gpuProvider = gpuProvider;
            _processProvider = processProvider;
            _processCache = processCache ?? Core.ServiceLocator.GetService<ProcessCacheService>();
            _gameDetection = gameDetection ?? Core.ServiceLocator.GetService<GameDetectionService>();
            _stabilityEngine = stabilityEngine ?? Core.ServiceLocator.GetService<StabilityEngineService>();

            _logger = logger ?? Core.ServiceLocator.GetService<ILoggingService>()
                      ?? throw new ArgumentNullException(nameof(logger), "LoggingService não encontrado.");
            _dlsLogger = new DlsLogger();
            _heuristics = heuristics ?? new CoreLoadHeuristics(cpuProvider);
            _detector = detector ?? new CriticalProcessDetector(processProvider);

            // Injetar logger no GamerNativeMethods para que o circuit breaker
            // apareça no voltris.log e não apenas no crash_trace
            VoltrisOptimizer.Services.Gamer.Implementation.GamerNativeMethods.SetLogger(_logger);

            // === INICIALIZAR ENGINES DSL 5.0 ===
            _telemetry = new SharedTelemetryProvider(_logger);
            _decisionEngine = new DecisionEngine50();
            _cpuGovernor = new CpuGovernorEngine(_logger);
            _ioScheduler = new IoSchedulerEngine(_logger);
            _interruptLatency = new InterruptLatencyEngine(_logger);
            _behaviorEngine = new ProcessBehaviorEngine(_logger);
            _thermalEngine = new ThermalPowerEngine(_logger);
            _stabilityGuard = new StabilityGuardEngine(_logger);
            _hardwareDetection = new HardwareDetectionEngine(_logger);
            _launchAccelerator = new ProcessLaunchAccelerator(_logger);

            // InputLatencyEngine precisa de ITimerResolutionService
            var timerService = Core.ServiceLocator.GetService<ITimerResolutionService>();
            _inputLatency = timerService != null
                ? new InputLatencyEngine(_logger, timerService)
                : null;

            _logger.LogInfo($"[DSL 5.0] Engines inicializados. Hardware: {_hardwareDetection.CpuVendor} ({_hardwareDetection.CpuCores} cores), SSD: {_hardwareDetection.IsSsd}, Laptop: {_hardwareDetection.IsLaptop}");
        }

        public void SetProfile(IntelligentProfileType profile)
        {
            lock (_lock)
            {
                _currentProfile = profile;
                _systemState.CurrentProfile = profile;
                _logger.LogInfo($"[DSL 5.0] Perfil definido: {profile}");

                // CORREÇÃO PERFORMANCE: Intervalos aumentados significativamente.
                // O DSL rodava a 1s em modo Gamer, varrendo ~200 processos + 14 engines por ciclo.
                // Isso sozinho causava 10-15% de CPU constante no app.
                // Intervalos novos: Gamer=3s, Creative=5s, Geral=8s (idle detection no BackgroundScheduler
                // aumenta ainda mais quando o usuário está inativo).
                Interval = profile switch
                {
                    IntelligentProfileType.GamerCompetitive    => TimeSpan.FromMilliseconds(3000),
                    IntelligentProfileType.CreativeVideoEditing => TimeSpan.FromMilliseconds(5000),
                    _                                           => TimeSpan.FromMilliseconds(8000)
                };

                // Ajustar boost duration baseado no perfil
                _launchAccelerator.BoostDurationSeconds = profile switch
                {
                    IntelligentProfileType.GamerCompetitive => 5,
                    _ => 8
                };

                // Aplicar otimizações de fluidez em TODOS os perfis
                _stabilityEngine?.ApplySmoothnessOptimizations();
            }
        }

        public async Task StartGlobalAsync(CancellationToken ct = default)
        {
            if (!Enabled)
            {
                _logger.LogWarning("[DSL 5.0] Agente desabilitado. StartGlobalAsync ignorado.");
                return;
            }
            lock (_lock)
            {
                if (IsRunning)
                {
                    _logger.LogWarning("[DSL 5.0] StartGlobalAsync chamado mas loop já está ativo. Ignorando.");
                    return;
                }
                _cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
                _gamePid = null;
                IsRunning = true;
                _monitorTask = Task.Run(() => MonitorLoopAsync(_cts.Token), _cts.Token);
            }

            // Registrar no BackgroundScheduler para que o adaptive throttling
            // do scheduler influencie o intervalo do loop via NotifyUserActivity.
            // O DSL mantém seu próprio loop interno, mas o scheduler monitora a carga
            // e pode sinalizar via evento quando o sistema está sob pressão.
            Core.BackgroundScheduler.Instance.Register(
                id:           "DSL.AdaptiveIntervalSync",
                action:       _ => { SyncIntervalFromScheduler(); return Task.CompletedTask; },
                baseInterval: TimeSpan.FromSeconds(5),
                priority:     Core.BackgroundScheduler.TaskPriority.Low,
                initialDelay: TimeSpan.FromSeconds(10));

            // Iniciar detecção de processos via WMI
            _launchAccelerator.Start();
            _logger.LogSuccess("[DSL 5.0] Agente Global INICIADO com todos os engines + LaunchAccelerator ativos.");
            _dlsLogger.Log("DSL 5.0 Global Agent STARTED");
            await Task.CompletedTask;
        }

        /// <summary>
        /// Sincroniza o intervalo do DSL com o estado de carga reportado pelo BackgroundScheduler.
        /// Chamado periodicamente pelo scheduler — aumenta o intervalo quando CPU está alta.
        /// </summary>
        private void SyncIntervalFromScheduler()
        {
            var metrics = Core.BackgroundScheduler.Instance.GetMetrics();
            lock (_lock)
            {
                var baseMs = _currentProfile switch
                {
                    IntelligentProfileType.GamerCompetitive    => 3000.0,
                    IntelligentProfileType.CreativeVideoEditing => 5000.0,
                    _                                           => 8000.0
                };

                // Multiplicar intervalo baseado na carga atual
                double multiplier = metrics.LoadLevel switch
                {
                    2 => 3.0, // CPU crítica (>80%) — DSL roda 3x mais devagar
                    1 => 1.5, // CPU alta (>60%)    — DSL roda 1.5x mais devagar
                    _ => 1.0  // Normal
                };

                // Em idle, aumentar ainda mais (usuário não está usando o PC)
                if (metrics.IsIdle) multiplier *= 2.0;

                Interval = TimeSpan.FromMilliseconds(baseMs * multiplier);
                _logger.LogInfo($"[DSL] Intervalo adaptativo: {Interval.TotalMilliseconds:F0}ms (load={metrics.LoadLevel}, idle={metrics.IsIdle}, cpu={metrics.CurrentCpuPct:F1}%)");
            }
        }

        public async Task StartAsync(int? gameProcessId = null, CancellationToken ct = default)
        {
            if (!Enabled) return;
            lock (_lock)
            {
                if (IsRunning)
                {
                    _gamePid = gameProcessId;
                    _logger.LogInfo($"[DSL 5.0] Reorientado para PID: {gameProcessId}");
                    return;
                }
                _cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
                _gamePid = gameProcessId;
                IsRunning = true;
                _monitorTask = Task.Run(() => MonitorLoopAsync(_cts.Token), _cts.Token);
            }
            _launchAccelerator.Start();
            _logger.LogSuccess($"[DSL 5.0] Agente iniciado para PID: {gameProcessId}");
            await Task.CompletedTask;
        }

        public async Task StopAsync(CancellationToken ct = default)
        {
            lock (_lock)
            {
                if (!IsRunning) return;
                try { _cts?.Cancel(); } catch { }
            }

            try
            {
                if (_monitorTask != null)
                    await Task.WhenAny(_monitorTask, Task.Delay(3000, ct));
            }
            catch { }

            RestoreAll();

            lock (_lock)
            {
                IsRunning = false;
                _cts?.Dispose();
                _cts = null;
                _gamePid = null;
            }
            _logger.LogInfo("[DSL 5.0] Agente PARADO. Todos os processos restaurados.");
            _dlsLogger.Log("DSL 5.0 Agent STOPPED");
            _dlsLogger.Flush();
        }

        /// <summary>
        /// Loop principal DSL 5.0 — integra telemetria unificada + todos os engines.
        /// Foco em responsividade real do Windows.
        /// </summary>
        private async Task MonitorLoopAsync(CancellationToken ct)
        {
            _logger.LogInfo("[DSL 5.0] Monitor Loop iniciado.");
            _dlsLogger.Log("MonitorLoop STARTED");

            await Task.Delay(2000, ct);

            try
            {
                var initialProcesses = RefreshProcessList();
                _previousProcessPids = new HashSet<int>(initialProcesses.Select(p => p.Id));
            }
            catch { }

            while (!ct.IsCancellationRequested)
            {
                _cycleStopwatch.Restart();
                int actionsThisCycle = 0;
                int processesAnalyzed = 0;
                int processesThrottled = 0;

                try
                {
                    // 1. COLETAR PROCESSOS
                    var processes = RefreshProcessList();
                    processesAnalyzed = processes.Length;

                    // 2. TELEMETRIA + FOREGROUND
                    _telemetry.Update(_systemState);
                    // ForegroundPid vem do ForegroundWindowTracker (WinEventHook) — zero custo.
                    // O tracker é notificado pelo SO quando a janela muda; não há polling aqui.
                    var fgPid = Core.ForegroundWindowTracker.Instance.CurrentPid;
                    if (fgPid > 0) _systemState.ForegroundPid = fgPid;
                    else if (_systemState.ForegroundPid == 0) UpdateForegroundPid(); // fallback único

                    // CPU% vem do SystemMetricsCache — atualizado 1x/2s, compartilhado por todos os serviços.
                    // Elimina a chamada duplicada a GetSystemTimes() que existia aqui.
                    _systemState.CpuUsagePercent = Core.SystemMetricsCache.Instance.CpuPercent;
                    _systemState.AvailableRamMb  = Core.SystemMetricsCache.Instance.AvailableRamMb;
                    ClassifyPressureLevels();

                    // 3. DECISION ENGINE
                    bool shouldCpu      = _decisionEngine.ShouldOptimizeCpu(_systemState);
                    bool shouldMemory   = _decisionEngine.ShouldOptimizeMemory(_systemState);
                    bool shouldIo       = _decisionEngine.ShouldOptimizeIo(_systemState);
                    bool shouldLowLatency = _decisionEngine.ShouldApplyLowLatency(_systemState);
                    bool shouldThermal  = _decisionEngine.ShouldApplyThermalContention(_systemState);

                    // 4. THERMAL ENGINE
                    _thermalEngine.Update();
                    if (_systemState.ThermalThrottlingDetected) shouldThermal = true;
                    actionsThisCycle++;

                    // 5. INTERRUPT LATENCY ENGINE
                    _interruptLatency.Update(_systemState.ForegroundPid > 0 ? _systemState.ForegroundPid : (int?)null);
                    actionsThisCycle++;

                    // 6. INPUT LATENCY ENGINE
                    if (_inputLatency != null)
                        _inputLatency.Update(shouldLowLatency ? _systemState.ForegroundPid : 0);

                    // 7. BEHAVIOR ENGINE
                    _behaviorEngine.Update(processes, _systemState.ForegroundPid > 0 ? _systemState.ForegroundPid : (int?)null);
                    actionsThisCycle++;

                    // 8. STABILITY GUARD
                    _stabilityGuard.CheckGlobalHealth(_systemState);
                    actionsThisCycle++;

                    // 9. PROCESS LAUNCH ACCELERATOR
                    _launchAccelerator.CheckNewProcesses(processes, _previousProcessPids);
                    _previousProcessPids = new HashSet<int>(processes.Select(p => p.Id));
                    actionsThisCycle++;

                    // 10. SHELL SHIELD + EXPLORER RESPONSIVENESS
                    ProtectShell();
                    MonitorExplorerResponsiveness();

                    // 11. FOREGROUND BOOST
                    ApplyForegroundBoost();
                    actionsThisCycle++;

                    // 12. BACKGROUND SUPPRESSION during disk contention
                    if (shouldIo && _systemState.DiskActiveTime > 60f)
                    {
                        SuppressBackgroundDuringContention(processes);
                        actionsThisCycle++;
                    }

                    // 13. PER-PROCESS GOVERNANCE
                    if (shouldCpu || shouldIo)
                    {
                        var samples = CollectCpuUsage(processes);
                        processesThrottled = ExecuteEngineGovernance(processes, samples, shouldCpu, shouldIo);
                        actionsThisCycle += 2;
                    }

                    // 14. MEMORY GUARDIAN
                    if (shouldMemory)
                    {
                        MaintainMemoryPressure();
                        actionsThisCycle++;
                    }

                    // === MÉTRICAS DE IMPACTO ===
                    _cycleStopwatch.Stop();
                    _totalCycles++;
                    _totalActionsApplied += actionsThisCycle;
                    _totalProcessesThrottled += processesThrottled;
                    double cycleMs = _cycleStopwatch.Elapsed.TotalMilliseconds;
                    _cycleTimeAccumulatorMs += cycleMs;

                    // Log resumido a cada 30 ciclos — não a cada ciclo
                    if (_totalCycles % 30 == 0)
                    {
                        double avgCycle = _cycleTimeAccumulatorMs / _totalCycles;
                        _dlsLogger.Log($"Impact: cycles={_totalCycles}, actions={_totalActionsApplied}, throttled={_totalProcessesThrottled}, avgCycleMs={avgCycle:F1}");
                        _logger.LogInfo($"[DSL] Cycles={_totalCycles} | Actions={_totalActionsApplied} | Throttled={_totalProcessesThrottled} | AvgCycle={avgCycle:F1}ms");
                    }

                    await Task.Delay(Interval, ct);
                }
                catch (OperationCanceledException) { break; }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[DSL 5.0] Erro no loop: {ex.Message}");
                    _dlsLogger.Log($"ERROR: {ex.Message}");
                    try { await Task.Delay(2000, ct); } catch { break; }
                }
            }

            _dlsLogger.Log($"MonitorLoop STOPPED after {_totalCycles} cycles");
            _dlsLogger.Flush();
        }

        private void ClassifyPressureLevels()
        {
            _systemState.CpuPressure = _systemState.CpuQueueLength switch
            {
                > 10f => PressureLevel.Critical,
                > 4f => PressureLevel.High,
                > 1.5f => PressureLevel.Medium,
                _ => PressureLevel.Low
            };

            _systemState.MemoryPressure = _systemState.CommitChargePercent switch
            {
                > 95 => PressureLevel.Critical,
                > 85 => PressureLevel.High,
                > 70 => PressureLevel.Medium,
                _ => PressureLevel.Low
            };

            _systemState.IoPressure = _systemState.DiskQueueLength switch
            {
                > 3f => PressureLevel.Critical,
                > 1.5f => PressureLevel.High,
                > 0.5f => PressureLevel.Medium,
                _ => PressureLevel.Low
            };

            _systemState.InputLatencyRisk = _systemState.DpcTime > 0.8f || _systemState.InterruptTime > 1.0f;
        }

        private void UpdateForegroundPid()
        {
            try
            {
                var hwnd = GetForegroundWindow();
                if (hwnd != IntPtr.Zero)
                {
                    GetWindowThreadProcessId(hwnd, out uint pid);
                    _systemState.ForegroundPid = (int)pid;
                }
            }
            catch { }
        }

        /// <summary>
        /// Monitora responsividade do Explorer.exe.
        /// Detecta stalls de I/O e wait chains que bloqueiam o shell.
        /// </summary>
        private void MonitorExplorerResponsiveness()
        {
            if ((DateTime.Now - _lastExplorerCheck).TotalSeconds < 5) return;
            _lastExplorerCheck = DateTime.Now;

            try
            {
                var explorer = _cachedProcesses.FirstOrDefault(p =>
                    p.ProcessName.Equals("explorer", StringComparison.OrdinalIgnoreCase));
                if (explorer == null || explorer.HasExited) return;

                // Verificar se Explorer está respondendo (thread count e responding state)
                bool isResponding = explorer.Responding;
                int threadCount = explorer.Threads.Count;

                if (!isResponding)
                {
                    _explorerStallCount++;
                    _logger.LogWarning($"[DSL] Explorer NOT RESPONDING (stall #{_explorerStallCount}, threads: {threadCount})");

                    // Ação: elevar prioridade do Explorer e reduzir I/O de background
                    try
                    {
                        explorer.PriorityClass = ProcessPriorityClass.High;
                        IntPtr hExp = OpenProcess(0x0200 | 0x0400, false, explorer.Id);
                        if (hExp != IntPtr.Zero)
                        {
                            try
                            {
                                GamerNativeMethods.SetProcessIoPriority(hExp, GamerNativeMethods.IoPriorityLevel.IoPriorityHigh, out _);
                            }
                            finally { CloseHandle(hExp); }
                        }
                    }
                    catch { }
                }
                else
                {
                    // Explorer respondendo — manter AboveNormal
                    try
                    {
                        if (explorer.PriorityClass == ProcessPriorityClass.High)
                            explorer.PriorityClass = ProcessPriorityClass.AboveNormal;
                    }
                    catch { }
                }
            }
            catch { }
        }

        /// <summary>
        /// Suprime processos de background durante contenção de disco.
        /// Reduz I/O priority de processos que não são foreground/explorer/game.
        /// </summary>
        private void SuppressBackgroundDuringContention(Process[] processes)
        {
            int suppressedCount = 0;
            foreach (var p in processes)
            {
                try
                {
                    if (p.HasExited || p.Id == _ownPid) continue;
                    if (p.Id == _systemState.ForegroundPid) continue;
                    if (_gamePid.HasValue && p.Id == _gamePid.Value) continue;
                    if (p.ProcessName.Equals("explorer", StringComparison.OrdinalIgnoreCase)) continue;
                    if (p.ProcessName.Equals("dwm", StringComparison.OrdinalIgnoreCase)) continue;
                    if (IsProtected(p)) continue;

                    // Só suprimir processos com working set significativo (proxy para atividade de I/O)
                    if (p.WorkingSet64 > 50 * 1024 * 1024)
                    {
                        IntPtr hSup = OpenProcess(0x0200 | 0x0400, false, p.Id);
                        if (hSup != IntPtr.Zero)
                        {
                            try
                            {
                                GamerNativeMethods.SetProcessIoPriority(hSup, GamerNativeMethods.IoPriorityLevel.IoPriorityVeryLow, out _);
                            }
                            finally { CloseHandle(hSup); }
                        }
                        suppressedCount++;
                    }
                }
                catch { }
            }

            if (suppressedCount > 0)
                _logger.LogInfo($"[DSL] Disk contention: {suppressedCount} background processes I/O suppressed (DiskActive: {_systemState.DiskActiveTime:F0}%)");
        }

        private int ExecuteEngineGovernance(Process[] processes, List<(Process p, double cpu)> samples, bool shouldCpu, bool shouldIo)
        {
            int throttledCount = 0;

            // Construir lookup O(1) por PID para evitar O(n²) no loop principal
            var samplesByPid = new Dictionary<int, (Process p, double cpu)>(samples.Count);
            foreach (var s in samples)
            {
                samplesByPid[s.p.Id] = s;
            }

            foreach (var p in processes)
            {
                try
                {
                    if (p.HasExited || p.Id == _ownPid) continue;
                    if (IsProtected(p)) continue;

                    if (shouldCpu)
                    {
                        _cpuGovernor.Governance(p, _systemState);
                        _stabilityGuard.Governance(p, _systemState);
                    }

                    if (shouldIo)
                        _ioScheduler.Governance(p, _systemState);

                    if (samplesByPid.TryGetValue(p.Id, out var sample) && sample.cpu > GetThrottleThreshold())
                    {
                        bool wasNew;
                        lock (_lock) { wasNew = _throttled.Add(p.Id); }
                        if (wasNew)
                        {
                            throttledCount++;
                            OnProcessThrottled?.Invoke(this, new ThrottledEventArgs { ProcessId = p.Id, ProcessName = p.ProcessName, CpuPercent = sample.cpu, IsHeavy = sample.cpu > 50 });
                        }
                    }
                }
                catch { }
            }

            // Release processos que não estão mais pesados
            if (_systemState.CpuPressure == PressureLevel.Low)
            {
                // Construir lookup O(1) para processos cached
                var cachedByPid = new Dictionary<int, Process>();
                foreach (var cp in _cachedProcesses)
                {
                    try { cachedByPid[cp.Id] = cp; } catch { }
                }
                
                var toRelease = ThrottledProcessIds.ToList();
                foreach (var pid in toRelease)
                {
                    try
                    {
                        if (cachedByPid.TryGetValue(pid, out var p))
                        {
                            lock (_lock) { _throttled.Remove(pid); }
                            OnProcessReleased?.Invoke(this, new ThrottledEventArgs { ProcessId = pid, ProcessName = p.ProcessName });
                        }
                    }
                    catch { }
                }
            }

            return throttledCount;
        }

        private double GetThrottleThreshold()
        {
            return _currentProfile switch
            {
                IntelligentProfileType.GamerCompetitive => 25.0,
                IntelligentProfileType.GamerSinglePlayer => 30.0,
                _ => 40.0
            };
        }

        private Process[] RefreshProcessList()
        {
            if (_processCache != null)
                return _cachedProcesses = _processCache.GetCachedProcesses().ToArray();

            if ((DateTime.Now - _lastProcessRefresh).TotalMilliseconds > 5000)
            {
                try
                {
                    _cachedProcesses = _processProvider != null ? _processProvider.GetProcesses() : Process.GetProcesses();
                    _lastProcessRefresh = DateTime.Now;
                }
                catch { }
            }
            return _cachedProcesses;
        }

        private List<(Process p, double cpuPercent)> CollectCpuUsage(Process[] processes)
        {
            var now = DateTime.UtcNow;
            var realInterval = _lastSampleTime == DateTime.MinValue
                ? Interval.TotalMilliseconds
                : (now - _lastSampleTime).TotalMilliseconds;
            _lastSampleTime = now;

            if (realInterval < 100) realInterval = Interval.TotalMilliseconds;

            var samples = new List<(Process p, double cpu)>();
            foreach (var p in processes)
            {
                try
                {
                    if (p.HasExited) continue;
                    var cpuNow = p.TotalProcessorTime;
                    if (_prevCpuTimes.TryGetValue(p.Id, out var prev))
                    {
                        var delta = cpuNow - prev;
                        var cpu = (delta.TotalMilliseconds / realInterval) * 100.0 / Environment.ProcessorCount;
                        samples.Add((p, Math.Max(0, Math.Min(100, cpu))));
                    }
                    _prevCpuTimes[p.Id] = cpuNow;
                }
                catch (InvalidOperationException) { }
                catch { }
            }
            return samples;
        }

        /// <summary>
        /// Protege o shell (explorer.exe) com prioridade elevada e I/O priority alta.
        /// </summary>
        private void ProtectShell()
        {
            try
            {
                var explorer = _cachedProcesses.FirstOrDefault(p =>
                    p.ProcessName.Equals("explorer", StringComparison.OrdinalIgnoreCase));
                if (explorer == null || explorer.HasExited) return;

                try
                {
                    if (explorer.PriorityClass < ProcessPriorityClass.AboveNormal)
                    {
                        explorer.PriorityClass = ProcessPriorityClass.AboveNormal;
                        SetMemoryPriorityWin32(explorer, 5);
                        // Garantir I/O priority alta para o Explorer — usar OpenProcess seguro
                        IntPtr hExplorer = OpenProcess(0x0200 | 0x0400, false, explorer.Id);
                        if (hExplorer != IntPtr.Zero)
                        {
                            try
                            {
                                GamerNativeMethods.SetProcessIoPriority(hExplorer, GamerNativeMethods.IoPriorityLevel.IoPriorityHigh, out _);
                            }
                            finally { CloseHandle(hExplorer); }
                        }
                        // Desabilitar EcoQoS para Explorer
                        SetPowerThrottling(explorer, false);
                    }
                }
                catch { }
            }
            catch { }
        }

        /// <summary>
        /// Foreground boost completo: CPU priority + I/O priority + Memory priority + EcoQoS off.
        /// Também eleva prioridade de threads GUI do processo foreground.
        /// </summary>
        private void ApplyForegroundBoost()
        {
            try
            {
                var hwnd = GetForegroundWindow();
                if (hwnd == IntPtr.Zero) return;

                GetWindowThreadProcessId(hwnd, out uint pid);
                if (pid == 0 || pid == _lastForegroundPid) return;
                if (pid == _ownPid) return;

                try
                {
                    var p = Process.GetProcessById((int)pid);
                    if (p.HasExited) return;
                    if (_detector.IsCritical(p)) return;

                    // Reverter boost anterior
                    if (_lastForegroundPid.HasValue && _boostedProcesses.TryGetValue(_lastForegroundPid.Value, out var oldPri))
                    {
                        try
                        {
                            var oldP = Process.GetProcessById(_lastForegroundPid.Value);
                            if (!oldP.HasExited)
                            {
                                oldP.PriorityClass = oldPri;
                        // Restaurar I/O para Normal — usar OpenProcess em vez de p.Handle para segurança
                                IntPtr hOld = OpenProcess(0x0200 | 0x0400, false, oldP.Id);
                                if (hOld != IntPtr.Zero)
                                {
                                    try
                                    {
                                        GamerNativeMethods.SetProcessIoPriority(hOld, GamerNativeMethods.IoPriorityLevel.IoPriorityNormal, out _);
                                    }
                                    finally { CloseHandle(hOld); }
                                }
                            }
                        }
                        catch { }
                        _boostedProcesses.TryRemove(_lastForegroundPid.Value, out _);
                    }

                    // Novo boost completo
                    if (!_boostedProcesses.ContainsKey(p.Id) && !p.HasExited)
                    {
                        _boostedProcesses[p.Id] = p.PriorityClass;
                        var targetPri = _currentProfile switch
                        {
                            IntelligentProfileType.GamerCompetitive => ProcessPriorityClass.High,
                            IntelligentProfileType.CreativeVideoEditing => ProcessPriorityClass.High,
                            _ => ProcessPriorityClass.AboveNormal
                        };

                        // 1. CPU Priority
                        p.PriorityClass = targetPri;

                        // 2. I/O Priority — usar OpenProcess seguro em vez de p.Handle direto
                        IntPtr hProc = OpenProcess(0x0200 | 0x0400, false, p.Id);
                        if (hProc != IntPtr.Zero)
                        {
                            try
                            {
                                GamerNativeMethods.SetProcessIoPriority(hProc, GamerNativeMethods.IoPriorityLevel.IoPriorityHigh, out _);
                            }
                            finally { CloseHandle(hProc); }
                        }

                        // 3. Memory Priority
                        SetMemoryPriorityWin32(p, 5);

                        // 4. Desabilitar EcoQoS
                        SetPowerThrottling(p, false);

                        // 5. PriorityBoost para scheduling mais responsivo
                        try { p.PriorityBoostEnabled = true; } catch { }

                        // 6. Elevar prioridade da thread GUI (thread que possui a janela)
                        BoostGuiThread(hwnd);

                        _logger.LogInfo($"[DSL] Foreground boost: {p.ProcessName} (PID: {p.Id}) → CPU: {targetPri}, IO: High, Mem: 5, EcoQoS: Off");
                    }

                    _lastForegroundPid = (int)pid;
                }
                catch { }
            }
            catch { }
        }

        /// <summary>
        /// Eleva a prioridade da thread GUI que possui a janela foreground.
        /// Threads GUI precisam de prioridade adequada para manter fluidez da interface.
        /// </summary>
        private void BoostGuiThread(IntPtr hwnd)
        {
            try
            {
                uint threadId = GetWindowThreadProcessId(hwnd, out _);
                if (threadId == 0) return;

                IntPtr hThread = OpenThread(0x0020, false, threadId); // THREAD_SET_INFORMATION
                if (hThread != IntPtr.Zero)
                {
                    try
                    {
                        // THREAD_PRIORITY_ABOVE_NORMAL = 1
                        SetThreadPriority(hThread, 1);
                    }
                    finally { CloseHandle(hThread); }
                }
            }
            catch { }
        }

        /// <summary>
        /// Memory Guardian com verificação de pressão real, cooldown e exclusão de processos ativos.
        /// </summary>
        private void MaintainMemoryPressure()
        {
            if ((DateTime.Now - _lastMemoryTrim).TotalMinutes < 3) return;

            try
            {
                var mem = new MEMORYSTATUSEX();
                mem.dwLength = (uint)Marshal.SizeOf<MEMORYSTATUSEX>();
                if (!GlobalMemoryStatusEx(ref mem)) return;
                if (mem.dwMemoryLoad <= 85) return;

                int trimmedCount = 0;
                long totalFreed = 0;

                foreach (var p in _cachedProcesses)
                {
                    try
                    {
                        if (p.HasExited) continue;
                        if (IsProtected(p)) continue;
                        if (p.Id == _lastForegroundPid || p.Id == _gamePid) continue;
                        if (p.Id == _systemState.ForegroundPid) continue;
                        if (p.WorkingSet64 <= 300 * 1024 * 1024) continue;

                        // Verificar se o processo está ativo
                        if (_prevCpuTimes.TryGetValue(p.Id, out var prevTime))
                        {
                            try
                            {
                                var currentTime = p.TotalProcessorTime;
                                if ((currentTime - prevTime).TotalMilliseconds > 500)
                                    continue;
                            }
                            catch { }
                        }

                        long beforeWs = p.WorkingSet64;
                        // Usar OpenProcess seguro em vez de p.Handle direto
                        IntPtr hMem = OpenProcess(0x0200 | 0x0400 | 0x0100, false, p.Id);
                        if (hMem != IntPtr.Zero)
                        {
                            try { EmptyWorkingSet(hMem); }
                            finally { CloseHandle(hMem); }
                        }
                        long afterWs = p.WorkingSet64;
                        totalFreed += (beforeWs - afterWs);
                        trimmedCount++;
                    }
                    catch { }
                }

                if (trimmedCount > 0)
                    _logger.LogInfo($"[DSL] Memory Guardian: {trimmedCount} processes trimmed, ~{totalFreed / 1024 / 1024}MB freed (RAM: {mem.dwMemoryLoad}%)");
            }
            catch { }
            _lastMemoryTrim = DateTime.Now;
        }

        /// <summary>
        /// Lista de proteção reduzida — apenas processos críticos do sistema.
        /// </summary>
        public bool IsProtected(Process p)
        {
            try
            {
                if (p.Id == _ownPid) return true;
                if (_gamePid.HasValue && p.Id == _gamePid.Value) return true;
                if (_lastForegroundPid.HasValue && p.Id == _lastForegroundPid.Value) return true;

                var hwnd = GetForegroundWindow();
                if (hwnd != IntPtr.Zero)
                {
                    GetWindowThreadProcessId(hwnd, out uint fgPid);
                    if (fgPid == p.Id) return true;
                }

                var name = p.ProcessName.ToLowerInvariant();

                if (VoltrisOptimizer.Services.Gamer.Data.GameDatabase.KnownGames.Contains(name))
                    return true;

                if (Core.Constants.SystemConstants.ProtectedProcesses.System.Any(x => x.Equals(name, StringComparison.OrdinalIgnoreCase))) return true;

                if (name.StartsWith("voltris", StringComparison.OrdinalIgnoreCase)) return true;
                if (name.Contains("voltrisoptimizer")) return true;

                if (Core.Constants.SystemConstants.ProtectedProcesses.Voltris.Any(x => x.Equals(name, StringComparison.OrdinalIgnoreCase))) return true;

                if (name.Contains("nvcontainer") || name.Contains("amd") || name.Contains("radeon")) return true;

                var whitelist = SettingsService.Instance.Settings.DlsWhitelist;
                if (whitelist != null && whitelist.Contains(p.ProcessName, StringComparer.OrdinalIgnoreCase)) return true;

                return false;
            }
            catch { return false; }
        }

        private void RestoreAll()
        {
            foreach (var pid in ThrottledProcessIds.ToList())
            {
                try
                {
                    var p = Process.GetProcessById(pid);
                    if (p.HasExited) continue;
                    p.PriorityClass = ProcessPriorityClass.Normal;
                    SetPowerThrottling(p, false);
                    SetMemoryPriorityWin32(p, 5);
                    IntPtr hRestore = OpenProcess(0x0200 | 0x0400, false, pid);
                    if (hRestore != IntPtr.Zero)
                    {
                        try
                        {
                            GamerNativeMethods.SetProcessIoPriority(hRestore, GamerNativeMethods.IoPriorityLevel.IoPriorityNormal, out _);
                        }
                        finally { CloseHandle(hRestore); }
                    }
                }
                catch { }
            }

            foreach (var kvp in _boostedProcesses.ToList())
            {
                try
                {
                    var p = Process.GetProcessById(kvp.Key);
                    if (p.HasExited) continue;
                    p.PriorityClass = kvp.Value;
                    IntPtr hRestore = OpenProcess(0x0200 | 0x0400, false, kvp.Key);
                    if (hRestore != IntPtr.Zero)
                    {
                        try
                        {
                            GamerNativeMethods.SetProcessIoPriority(hRestore, GamerNativeMethods.IoPriorityLevel.IoPriorityNormal, out _);
                        }
                        finally { CloseHandle(hRestore); }
                    }
                }
                catch { }
            }
        }

        #region Win32 P/Invoke

        private void SetPowerThrottling(Process p, bool enable)
        {
            try
            {
                var h = OpenProcess(0x0200 | 0x0400, false, p.Id);
                if (h == IntPtr.Zero) return;
                try
                {
                    var state = new PROCESS_POWER_THROTTLING_STATE
                    {
                        Version = 1,
                        ControlMask = 0x1,
                        StateMask = enable ? 0x1u : 0u
                    };
                    SetProcessInformation(h, 4, ref state, Marshal.SizeOf(state));
                }
                finally { CloseHandle(h); }
            }
            catch { }
        }

        private void SetMemoryPriorityWin32(Process p, uint level)
        {
            try
            {
                var h = OpenProcess(0x0200 | 0x0400, false, p.Id);
                if (h == IntPtr.Zero) return;
                try
                {
                    var mem = new MEMORY_PRIORITY_INFORMATION { MemoryPriority = level };
                    SetProcessInformation(h, 1, ref mem, Marshal.SizeOf(mem));
                }
                finally { CloseHandle(h); }
            }
            catch { }
        }

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern IntPtr OpenProcess(uint access, bool inherit, int pid);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool CloseHandle(IntPtr h);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool SetProcessInformation(IntPtr h, int infoClass, ref PROCESS_POWER_THROTTLING_STATE state, int size);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool SetProcessInformation(IntPtr h, int infoClass, ref MEMORY_PRIORITY_INFORMATION state, int size);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool SetProcessAffinityMask(IntPtr h, IntPtr mask);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern IntPtr OpenThread(uint dwDesiredAccess, bool bInheritHandle, uint dwThreadId);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool SetThreadPriority(IntPtr hThread, int nPriority);

        [DllImport("user32.dll")]
        private static extern IntPtr GetForegroundWindow();

        [DllImport("user32.dll")]
        private static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);

        [DllImport("psapi.dll")]
        private static extern bool EmptyWorkingSet(IntPtr hProcess);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool GlobalMemoryStatusEx(ref MEMORYSTATUSEX lpBuffer);

        [StructLayout(LayoutKind.Sequential)]
        private struct PROCESS_POWER_THROTTLING_STATE { public uint Version; public uint ControlMask; public uint StateMask; }

        [StructLayout(LayoutKind.Sequential)]
        private struct MEMORY_PRIORITY_INFORMATION { public uint MemoryPriority; }

        [StructLayout(LayoutKind.Sequential)]
        private struct MEMORYSTATUSEX
        {
            public uint dwLength;
            public uint dwMemoryLoad;
            public ulong ullTotalPhys;
            public ulong ullAvailPhys;
            public ulong ullTotalPageFile;
            public ulong ullAvailPageFile;
            public ulong ullTotalVirtual;
            public ulong ullAvailVirtual;
            public ulong ullAvailExtendedVirtual;
        }

        #endregion

        public void Dispose()
        {
            _ = StopAsync();
            _telemetry?.Dispose();
            _cpuGovernor?.Dispose();
            _ioScheduler?.Dispose();
            _inputLatency?.Dispose();
            _interruptLatency?.Dispose();
            _behaviorEngine?.Dispose();
            _thermalEngine?.Dispose();
            _hardwareDetection?.Dispose();
            _launchAccelerator?.Dispose();
        }
    }
}
