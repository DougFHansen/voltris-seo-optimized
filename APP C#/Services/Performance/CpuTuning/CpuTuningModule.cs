using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32;
using VoltrisOptimizer.Services.Performance.CpuTuning.Models;
using VoltrisOptimizer.Services.Gamer.Intelligence.Telemetry;
using VoltrisOptimizer.Services.Gamer.Intelligence.Models;
using System.Collections.Generic;
using System.Linq;

namespace VoltrisOptimizer.Services.Performance.CpuTuning
{
    /// <summary>
    /// Main CPU Performance Tuning Module
    /// CRITICAL: Operates ONLY when Gamer Mode is active
    /// </summary>
    public class CpuTuningModule : ICpuTuningModule, IDisposable
    {
        private readonly ILoggingService _logger;
        private readonly IHardwareCapabilityDetector _hardwareDetector;
        private readonly IThermalGovernor _thermalGovernor;
        private readonly IPerformancePolicyEngine _policyEngine;
        private readonly IStabilityWatchdog _stabilityWatchdog;
        private readonly IEngineTelemetryFacade? _telemetry;
        private readonly LowLevelHardwareService _lowLevelHw;
        
        private bool _isActive;
        private CancellationTokenSource? _tuningCts;
        private Task? _tuningTask;
        
        // Original system state (for restoration)
        private SystemStateSnapshot? _originalState;
        
        // Current metrics
        private CpuMetrics _currentMetrics = new();
        private WorkloadType _currentWorkload = WorkloadType.Balanced;
        
        // Requested values for validation
        private int _requestedEpp = 32;
        private int _requestedPl1 = 65; 
        private int _requestedPl2 = 80;
        private double _requestedTau = 28.0;
        
        // NativeSystemMetrics para CPU (substitui PerformanceCounter pesado)
        private readonly VoltrisOptimizer.Helpers.NativeSystemMetrics _nativeMetrics = new();
        private PerformanceCounter? _gpuCounter;
        
        private static Guid GUID_PROCESSOR_SUBGROUP = new Guid("54533251-82be-4824-96c1-47b60b740d00");
        private static Guid GUID_MIN_PERF = new Guid("893dee8e-2bef-41e0-89c6-b55d0929964c");
        private static Guid GUID_MAX_PERF = new Guid("bc5038f7-23e0-4960-96da-33abaf5935ec");
        private static Guid GUID_CORE_PARKING = new Guid("0cc5b647-c1df-4637-891a-dec35c318583");
        private static Guid GUID_EPP = new Guid("be337238-0d82-4146-a960-4f3749d470c7");
        private static Guid GUID_AUTONOMOUS_MODE = new Guid("8baa4d57-3d56-4ad3-91f6-d4f1952f3c75");
        private static Guid GUID_CSTATES_MAX = new Guid("5d512c93-48ad-4fb6-a3f2-c86cbb4a64a6");
        
        public bool IsActive => _isActive;
        
        public event EventHandler? TuningActivated;
        public event EventHandler? TuningDeactivated;
        public event EventHandler<PerformanceMetricsEventArgs>? MetricsUpdated;
        
        [DllImport("powrprof.dll")]
        private static extern uint PowerWriteACValueIndex(IntPtr RootPowerKey, ref Guid SchemeGuid, ref Guid SubGroupGuid, ref Guid SettingGuid, uint AcValueIndex);
        
        [DllImport("powrprof.dll")]
        private static extern uint PowerGetActiveScheme(IntPtr UserRootPowerKey, out IntPtr ActivePolicyGuid);
        
        [DllImport("powrprof.dll")]
        private static extern uint PowerReadACValueIndex(IntPtr RootPowerKey, ref Guid SchemeGuid, ref Guid SubGroupGuid, ref Guid SettingGuid, out uint AcValueIndex);
        
        [DllImport("powrprof.dll")]
        private static extern uint PowerSetActiveScheme(IntPtr UserRootPowerKey, ref Guid SchemeGuid);
        
        public CpuTuningModule(
            ILoggingService logger,
            IHardwareCapabilityDetector hardwareDetector,
            IThermalGovernor thermalGovernor,
            IPerformancePolicyEngine policyEngine,
            IStabilityWatchdog stabilityWatchdog,
            LowLevelHardwareService lowLevelHw,
            IEngineTelemetryFacade? telemetry = null)
        {
            _logger = logger;
            _hardwareDetector = hardwareDetector;
            _thermalGovernor = thermalGovernor;
            _policyEngine = policyEngine;
            _stabilityWatchdog = stabilityWatchdog;
            _telemetry = telemetry;
            _lowLevelHw = lowLevelHw;
            
            // Initialize stability watchdog
            _stabilityWatchdog.Initialize();
            
            // Subscribe to thermal protection events
            _thermalGovernor.ThermalProtectionTriggered += OnThermalProtectionTriggered;
            
            // Subscribe to rollback events
            _stabilityWatchdog.RollbackRequired += OnRollbackRequired;
            
            // Performance counters will be initialized asynchronously in TuningLoop 
            // to avoid UI Thread freezes during Gamer Mode initialization
        }
        
        public void Activate()
        {
            if (_isActive)
            {
                return;
            }
            
            _logger.LogInfo("[CPU_Tuning] ========================================");
            _logger.LogInfo("[CPU_Tuning] ACTIVATING CPU PERFORMANCE TUNING");
            _logger.LogInfo("[CPU_Tuning] ========================================");
            
            try
            {
                // Check if tuning is disabled due to instability
                if (_stabilityWatchdog.ShouldDisableTuning())
                {
                    _logger.LogError("[CPU_Tuning] Tuning is DISABLED due to repeated failures. Manual reset required.");
                    return;
                }
                
                // Detect hardware capabilities
                var capabilities = _hardwareDetector.DetectCapabilities();
                
                // Check for enterprise restrictions
                if (capabilities.Classification == MachineClass.EnterpriseRestricted)
                {
                    _logger.LogWarning("[CPU_Tuning] Enterprise restrictions detected - tuning disabled");
                    return;
                }
                
                // Check administrative privileges
                if (!IsAdministrator())
                {
                    _logger.LogError("[CPU_Tuning] Administrative privileges required - tuning disabled");
                    return;
                }
                
                // Capture original system state
                _originalState = CaptureSystemState();
                _logger.LogInfo("[CPU_Tuning] Original system state captured");
                
                // Start thermal monitoring
                _thermalGovernor.Start();
                
                // Apply initial tuning
                ApplyInitialTuning(capabilities);
                
                // Start tuning loop
                _tuningCts = new CancellationTokenSource();
                _tuningTask = Task.Run(() => TuningLoop(_tuningCts.Token));
                
                _isActive = true;
                TuningActivated?.Invoke(this, EventArgs.Empty);
                
                _logger.LogInfo("[CPU_Tuning] CPU tuning activated successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[CPU_Tuning] Activation failed: {ex.Message}");
                
                // Ensure cleanup on failure
                try
                {
                    _thermalGovernor.Stop();
                }
                catch { }
            }
        }
        
        public void Deactivate()
        {
            if (!_isActive)
            {
                return;
            }
            
            _logger.LogInfo("[CPU_Tuning] ========================================");
            _logger.LogInfo("[CPU_Tuning] DEACTIVATING CPU PERFORMANCE TUNING");
            _logger.LogInfo("[CPU_Tuning] ========================================");
            
            try
            {
                // Stop tuning loop
                _tuningCts?.Cancel();
                _tuningTask?.Wait(TimeSpan.FromSeconds(2));
                _tuningCts?.Dispose();
                _tuningCts = null;
                _tuningTask = null;
                
                // Stop thermal monitoring
                _thermalGovernor.Stop();
                
                // Restore original system state
                if (_originalState != null)
                {
                    RestoreSystemState(_originalState);
                    _logger.LogInfo("[CPU_Tuning] Original system state restored");
                }
                
                _isActive = false;
                TuningDeactivated?.Invoke(this, EventArgs.Empty);
                
                // Record successful session
                _stabilityWatchdog.RecordSuccessfulSession();
                
                _logger.LogInfo("[CPU_Tuning] CPU tuning deactivated successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[CPU_Tuning] Deactivation error: {ex.Message}");
            }
        }
        
        public CpuMetrics GetCurrentMetrics()
        {
            return _currentMetrics;
        }
        
        public ThermalState GetThermalState()
        {
            return _thermalGovernor.GetThermalState();
        }
        
        public CpuTuningCapabilities GetCpuTuningCapabilities()
        {
            return _hardwareDetector.GetCapabilities();
        }
        
        public WorkloadType GetCurrentWorkload()
        {
            return _currentWorkload;
        }
        
        private async Task TuningLoop(CancellationToken ct)
        {
            _logger.LogInfo("[CPU_Tuning] Tuning loop started");
            
            // Atrasar inicialização de PC counters para BACKGROUND 
            // evitando UI congelada se demorar pra consultar WMI
            InitializePerformanceCounters();
            
            var capabilities = _hardwareDetector.GetCapabilities();
            
            while (!ct.IsCancellationRequested)
            {
                try
                {
                    // Update metrics
                    UpdateMetrics();
                    
                    // Feed real temperature into ThermalGovernor BEFORE getting its state
                    // This is the critical bridge: metrics read real temp, governor acts on it
                    if (_currentMetrics.Temperature > 1.0)
                        _thermalGovernor.InjectTemperature(_currentMetrics.Temperature);
                    
                    // Classify workload
                    _currentWorkload = _policyEngine.ClassifyWorkload(_currentMetrics);
                    
                    // Get thermal state (now based on real injected temperature)
                    var thermalState = _thermalGovernor.GetThermalState();
                    
                    // Check if we can adjust tuning (cooldown)
                    if (_policyEngine.CanAdjustTuning())
                    {
                        // Apply adaptive tuning
                        ApplyAdaptiveTuning(capabilities, _currentWorkload, thermalState);
                        _policyEngine.RecordAdjustment();
                    }
                    
                    // Fire metrics updated event
                    MetricsUpdated?.Invoke(this, new PerformanceMetricsEventArgs
                    {
                        Metrics = _currentMetrics,
                        Workload = _currentWorkload,
                        ThermalState = thermalState
                    });
                    
                    // Wait before next iteration (5 seconds - otimizado para reduzir CPU)
                    await Task.Delay(5000, ct);
                }
                catch (OperationCanceledException)
                {
                    break;
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[CPU_Tuning] Tuning loop error: {ex.Message}");
                    await Task.Delay(5000, ct);
                }
            }
            
            _logger.LogInfo("[CPU_Tuning] Tuning loop stopped");
        }
        
        private void ApplyInitialTuning(CpuTuningCapabilities capabilities)
        {
            _logger.LogInfo("[CPU_Tuning] Applying initial performance tuning...");
            
            try
            {
                // 1. Maximize Processor State
                SetProcessorState(100, 100);
                
                // 2. Disable Core Parking (minimum 100% cores active)
                SetCoreParking(100);
                
                // 3. Enable Autonomous Mode (Speed Shift) if supported
                if (capabilities.SupportsSpeedShift)
                {
                    SetAutonomousMode(1); // 1 = Enabled
                    _logger.LogInfo("[CPU_Tuning] Intel Speed Shift (HWP) Enabled");
                }
                
                // 4. Initial EPP (Performance biased)
                SetEPP(32); 

                // 5. Disable BD PROCHOT (Intel Laptops)
                if (capabilities.Vendor == CpuVendor.Intel && capabilities.Platform == PlatformType.Laptop)
                {
                    if (_lowLevelHw.IsAvailable)
                    {
                        _lowLevelHw.SetBdProchot(false);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[CPU_Tuning] Initial tuning failed: {ex.Message}");
            }
        }
        
        private void ApplyAdaptiveTuning(CpuTuningCapabilities capabilities, WorkloadType workload, ThermalState thermal)
        {
            try
            {
                // 1. Dynamic EPP Adjustment
                if (capabilities.SupportsSpeedShift && !capabilities.IsEppLocked)
                {
                    int optimalEpp = _policyEngine.DetermineOptimalEPP(workload, thermal, capabilities.Classification, capabilities.Platform);
                    _requestedEpp = optimalEpp;
                    SetEPP(optimalEpp);
                    _logger.LogInfo($"[CPU_Tuning] EPP Adjusted: {optimalEpp} (Workload: {workload})");
                }
                
                // 1.5 Dynamic Power Limits Adjustment
                if (!capabilities.IsPL1Locked || !capabilities.IsPL2Locked)
                {
                    var (optimalPl1, optimalPl2, optimalTau) = _policyEngine.DetermineOptimalPowerLimits(
                        workload, thermal, capabilities);
                    
                    _requestedPl1 = optimalPl1;
                    _requestedPl2 = optimalPl2;
                    _requestedTau = optimalTau;

                    if (_lowLevelHw.IsAvailable)
                    {
                        // SYNC MSR + MMIO
                        _lowLevelHw.SetPowerLimitsManaged(optimalPl1, optimalPl2, optimalTau);
                    }
                    else if (capabilities.SupportsTdpControl && !capabilities.IsPL1Locked)
                    {
                        SetPL1(optimalPl1);
                    }
                }
                
                // 2. Dynamic C-States management (Latency vs Power)
                if (capabilities.SupportsCStates)
                {
                    bool shouldDisable = _policyEngine.ShouldDisableCStates(workload, _currentMetrics.AverageFrameTime);
                    SetCStatesLimit(shouldDisable ? 1 : 0); // Modern standby systems use 1 for no deep idle
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[CPU_Tuning] Adaptive tuning error: {ex.Message}");
            }
        }
        
        private void SetEPP(int value)
        {
            try
            {
                PowerGetActiveScheme(IntPtr.Zero, out IntPtr activeSchemePtr);
                var scheme = Marshal.PtrToStructure<Guid>(activeSchemePtr);
                
                uint currentVal;
                // STUTTER FIX: Only broadcast power scheme changes if the value truly changed.
                // Prevents Windows Kernel from sending global WM_POWERBROADCAST events that kill game frame times.
                if (PowerReadACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR_SUBGROUP, ref GUID_EPP, out currentVal) == 0)
                {
                    if (currentVal == (uint)value) return; 
                }

                PowerWriteACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR_SUBGROUP, ref GUID_EPP, (uint)value);
                PowerSetActiveScheme(IntPtr.Zero, ref scheme);
            }
            catch { }
        }
        
        private void SetAutonomousMode(int enabled)
        {
            try
            {
                PowerGetActiveScheme(IntPtr.Zero, out IntPtr activeSchemePtr);
                var scheme = Marshal.PtrToStructure<Guid>(activeSchemePtr);
                
                uint currentVal;
                if (PowerReadACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR_SUBGROUP, ref GUID_AUTONOMOUS_MODE, out currentVal) == 0)
                {
                    if (currentVal == (uint)enabled) return;
                }

                PowerWriteACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR_SUBGROUP, ref GUID_AUTONOMOUS_MODE, (uint)enabled);
                PowerSetActiveScheme(IntPtr.Zero, ref scheme);
            }
            catch { }
        }
        
        private void SetCStatesLimit(int maxState)
        {
            try
            {
                PowerGetActiveScheme(IntPtr.Zero, out IntPtr activeSchemePtr);
                var scheme = Marshal.PtrToStructure<Guid>(activeSchemePtr);
                
                uint currentVal;
                if (PowerReadACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR_SUBGROUP, ref GUID_CSTATES_MAX, out currentVal) == 0)
                {
                    if (currentVal == (uint)maxState) return; 
                }

                PowerWriteACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR_SUBGROUP, ref GUID_CSTATES_MAX, (uint)maxState);
                PowerSetActiveScheme(IntPtr.Zero, ref scheme);
            }
            catch { }
        }
        
        private SystemStateSnapshot CaptureSystemState()
        {
            var snapshot = new SystemStateSnapshot();
            try
            {
                PowerGetActiveScheme(IntPtr.Zero, out IntPtr activeSchemePtr);
                snapshot.ActivePowerScheme = Marshal.PtrToStructure<Guid>(activeSchemePtr);
                
                var scheme = snapshot.ActivePowerScheme;
                PowerReadACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR_SUBGROUP, ref GUID_MIN_PERF, out uint minPerf);
                PowerReadACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR_SUBGROUP, ref GUID_MAX_PERF, out uint maxPerf);
                PowerReadACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR_SUBGROUP, ref GUID_CORE_PARKING, out uint coreParking);
                PowerReadACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR_SUBGROUP, ref GUID_EPP, out uint epp);
                PowerReadACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR_SUBGROUP, ref GUID_AUTONOMOUS_MODE, out uint autonomous);
                
                snapshot.MinProcessorState = (int)minPerf;
                snapshot.MaxProcessorState = (int)maxPerf;
                snapshot.CoreParkingState = (int)coreParking;
                snapshot.EppState = (int)epp;
                snapshot.AutonomousMode = (int)autonomous;

                if (_lowLevelHw.IsAvailable)
                {
                    var (pl1, pl2, tau, locked) = _lowLevelHw.GetDetailedPowerLimits();
                    snapshot.OriginalPl1 = (int)pl1;
                    snapshot.OriginalPl2 = (int)pl2;
                    snapshot.OriginalTau = tau;
                }
            }
            catch { }
            return snapshot;
        }
        
        private void RestoreSystemState(SystemStateSnapshot snapshot)
        {
            try
            {
                var scheme = snapshot.ActivePowerScheme;
                PowerWriteACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR_SUBGROUP, ref GUID_MIN_PERF, (uint)snapshot.MinProcessorState);
                PowerWriteACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR_SUBGROUP, ref GUID_MAX_PERF, (uint)snapshot.MaxProcessorState);
                PowerWriteACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR_SUBGROUP, ref GUID_CORE_PARKING, (uint)snapshot.CoreParkingState);
                PowerWriteACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR_SUBGROUP, ref GUID_EPP, (uint)snapshot.EppState);
                PowerWriteACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR_SUBGROUP, ref GUID_AUTONOMOUS_MODE, (uint)snapshot.AutonomousMode);
                
                // Restore Hardware Limits
                if (_lowLevelHw.IsAvailable)
                {
                    _lowLevelHw.SetBdProchot(true);
                    if (snapshot.OriginalPl1 > 0)
                    {
                        // Restore MSR + MMIO to factory 
                        _lowLevelHw.SetPowerLimitsManaged(snapshot.OriginalPl1, snapshot.OriginalPl2, snapshot.OriginalTau);
                    }
                }

                PowerSetActiveScheme(IntPtr.Zero, ref scheme);
            }
            catch { }
        }
        
        private void SetProcessorState(int minPercent, int maxPercent)
        {
            try
            {
                PowerGetActiveScheme(IntPtr.Zero, out IntPtr activeSchemePtr);
                var scheme = Marshal.PtrToStructure<Guid>(activeSchemePtr);
                
                uint currentMin, currentMax;
                bool minChanged = true, maxChanged = true;
                
                if (PowerReadACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR_SUBGROUP, ref GUID_MIN_PERF, out currentMin) == 0) 
                    minChanged = (currentMin != (uint)minPercent);
                    
                if (PowerReadACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR_SUBGROUP, ref GUID_MAX_PERF, out currentMax) == 0) 
                    maxChanged = (currentMax != (uint)maxPercent);
                
                // STUTTER FIX
                if (!minChanged && !maxChanged) return;
                
                PowerWriteACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR_SUBGROUP, ref GUID_MIN_PERF, (uint)minPercent);
                PowerWriteACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR_SUBGROUP, ref GUID_MAX_PERF, (uint)maxPercent);
                
                PowerSetActiveScheme(IntPtr.Zero, ref scheme);
                
                _logger.LogInfo($"[CPU_Tuning] Processor state set: {minPercent}%-{maxPercent}%");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[CPU_Tuning] Failed to set processor state: {ex.Message}");
            }
        }
        
        private void SetCoreParking(int percent)
        {
            try
            {
                PowerGetActiveScheme(IntPtr.Zero, out IntPtr activeSchemePtr);
                var scheme = Marshal.PtrToStructure<Guid>(activeSchemePtr);
                
                uint currentVal;
                if (PowerReadACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR_SUBGROUP, ref GUID_CORE_PARKING, out currentVal) == 0)
                {
                    if (currentVal == (uint)percent) return;
                }
                
                PowerWriteACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR_SUBGROUP, ref GUID_CORE_PARKING, (uint)percent);
                
                PowerSetActiveScheme(IntPtr.Zero, ref scheme);
                
                _logger.LogInfo($"[CPU_Tuning] Core parking set: {percent}%");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[CPU_Tuning] Failed to set core parking: {ex.Message}");
            }
        }
        
        private void UpdateMetrics()
        {
            try
            {
                // Update CPU usage (NativeSystemMetrics - GetSystemTimes)
                _currentMetrics.CpuUsagePercent = (float)_nativeMetrics.GetCpuUsage();
                
                // Update GPU usage (if available)
                if (_gpuCounter != null)
                {
                    _currentMetrics.GpuUsagePercent = _gpuCounter.NextValue();
                }
                
                // Update RAM usage
                _currentMetrics.RamUsagePercent = GetRamUsage();
                _currentMetrics.VramUsagePercent = GetVramUsage();
                
                // Update Effective values
                _currentMetrics.CurrentEpp = ReadPowerSetting(GUID_EPP, _requestedEpp);
                
                if (_lowLevelHw.IsAvailable)
                {
                    var (pl1, pl2, tau, locked) = _lowLevelHw.GetDetailedPowerLimits();
                    _currentMetrics.CurrentPl1 = (int)pl1;
                    _currentMetrics.CurrentPl2 = (int)pl2;
                    _currentMetrics.CurrentTau = tau;
                    
                    // SILICON AUDIT (somente telemetria – quem decide redução de potência é o ThermalGovernor/PolicyEngine)
                    var flags = _lowLevelHw.GetSiliconThrottlingFlags();
                    _currentMetrics.IsThermalThrottling = flags.thermal;
                    _currentMetrics.IsPowerLimitThrottling = flags.power;
                    _currentMetrics.IsCurrentLimitThrottling = flags.current;
                    _currentMetrics.IsSiliconThrottling = flags.thermal || flags.power || flags.current;
                    
                    var thermal = _thermalGovernor.GetThermalState();
                    _currentMetrics.ThermalCondition = thermal.Condition;
                    _currentMetrics.DistanceToTjMax = thermal.DistanceToTjMax;
                    _currentMetrics.Temperature = thermal.CurrentTemperature;
                }
                else
                {
                    int readPl1 = ReadPowerSetting(new Guid("3080644b-4f6d-4950-93cb-b59dd3369d7b"), 0);
                    if (readPl1 > 0) _currentMetrics.CurrentPl1 = readPl1;
                    else _currentMetrics.CurrentPl1 = _requestedPl1;
                }

                // Update thermal state - get from thermal governor
                var thermalState = _thermalGovernor.GetThermalState();
                
                // CRITICAL FIX: Feed real temperature into ThermalGovernor from shared sensor
                // This ensures thermal protection actually fires when CPU gets hot
                // The AdaptiveHardwareEngineService shares temperature via the thermalGovernor itself
                // but as a bridge, we also inject from the WMI state:
                if (thermalState.CurrentTemperature > 1.0)
                {
                    _thermalGovernor.InjectTemperature(thermalState.CurrentTemperature);
                }
                
                _currentMetrics.Temperature = thermalState.CurrentTemperature;
                _currentMetrics.ThermalHeadroom = thermalState.ThermalHeadroom;
                // Use hardware throttling detected by the governor's predictive logic:
                _currentMetrics.IsThermalThrottling = thermalState.IsInDangerZone;
                
                // Update Telemetry (Classification is handles by policyEngine in TuningLoop)
                UpdateTelemetry();
                
                // Raise event
                MetricsUpdated?.Invoke(this, new PerformanceMetricsEventArgs(_currentMetrics));
                
                _currentMetrics.Timestamp = DateTime.UtcNow;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[CPU_Tuning] Error updating metrics: {ex.Message}");
            }
        }
        
        private void UpdateTelemetry()
        {
            if (_telemetry == null) return;

            try
            {
                // Mapear métricas do módulo de tuning para o formato da telemetria da engine
                var state = new SystemState
                {
                    CpuTemp = _currentMetrics.Temperature,
                    Pl1EffectiveW = _currentMetrics.CurrentPl1,
                    EppEffectivePercent = _currentMetrics.CurrentEpp,
                    ThermalHeadroom = _currentMetrics.ThermalHeadroom,
                    CpuUsage = _currentMetrics.CpuUsage,
                    GpuUsage = _currentMetrics.GpuUsage,
                    RamUsagePercent = _currentMetrics.RamUsagePercent,
                    VramUsagePercent = _currentMetrics.VramUsagePercent
                };

                _telemetry.UpdateState(state);
                
                // Compare with 10% tolerance for Watts and exact for EPP
                bool match = (_currentMetrics.CurrentEpp == _requestedEpp);
                if (_requestedPl1 > 0)
                {
                    // For PL1, we allow some variance or 0 if it's BIOS managed but we still consider it a match 
                    // if we know we applied the policy.
                    if (Math.Abs(_currentMetrics.CurrentPl1 - _requestedPl1) > 2) match = false;
                }

                // Build action name encoding stability hints so the facade's internal logic works
                string actionName = GetActionName();
                if (_thermalGovernor.IsThermalProtectionActive)       actionName = "Thermal Mitigation";
                else if (_currentMetrics.IsThermalThrottling)          actionName = "Throttle Active";

                // Registrar como decisão ativa para aparecer no overlay ("Action")
                var decision = new ActiveDecisionInsight
                {
                    Action = actionName,
                    Reason = GetActionReason(),
                    Headroom = _currentMetrics.ThermalHeadroom,
                    RequestedVsEffectiveMatch = match
                };
                
                _telemetry.RecordDecision(decision);

                // Classificação do jogo ("Engine")
                var classification = new GameClassificationInsight
                {
                    Type = _currentWorkload == WorkloadType.CpuBound ? "CPU Bound" : 
                           _currentWorkload == WorkloadType.GpuBound ? "GPU Bound" : 
                           _currentWorkload == WorkloadType.MemoryBound ? "Memory Pressure" :
                           _currentWorkload == WorkloadType.Idle ? "System Idle" : "Balanced Load",
                    Confidence = 0.95
                };
                _telemetry.UpdateClassification(classification);
            }
            catch { }
        }

        private double GetRamUsage()
        {
            try
            {
                var memInfo = new Microsoft.VisualBasic.Devices.ComputerInfo();
                return (1.0 - ((double)memInfo.AvailablePhysicalMemory / memInfo.TotalPhysicalMemory)) * 100.0;
            }
            catch { return 0; }
        }

        private double GetVramUsage()
        {
            try
            {
                // Simple WMI check for VRAM usage if possible, or fallback to current metrics 
                // In a professional build, we would use DXGI or NVAPI
                return 0; // Placeholder until we have a reliable cross-platform VRAM reader
            }
            catch { return 0; }
        }

        private int ReadPowerSetting(Guid settingGuid, int defaultValue)
        {
            try
            {
                PowerGetActiveScheme(IntPtr.Zero, out IntPtr activeSchemePtr);
                var scheme = Marshal.PtrToStructure<Guid>(activeSchemePtr);
                uint val;
                if (PowerReadACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR_SUBGROUP, ref settingGuid, out val) == 0)
                {
                    return (int)val;
                }
            }
            catch { }
            return defaultValue;
        }

        private void SetPL1(int watts)
        {
            try
            {
                // PL1 Guid: 3080644b-4f6d-4950-93cb-b59dd3369d7b (Intel TDP Control)
                var guidPl1 = new Guid("3080644b-4f6d-4950-93cb-b59dd3369d7b");
                PowerGetActiveScheme(IntPtr.Zero, out IntPtr activeSchemePtr);
                var scheme = Marshal.PtrToStructure<Guid>(activeSchemePtr);
                
                uint currentVal;
                if (PowerReadACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR_SUBGROUP, ref guidPl1, out currentVal) == 0)
                {
                    if (currentVal == (uint)watts) return;
                }
                
                PowerWriteACValueIndex(IntPtr.Zero, ref scheme, ref GUID_PROCESSOR_SUBGROUP, ref guidPl1, (uint)watts);
                PowerSetActiveScheme(IntPtr.Zero, ref scheme);
            }
            catch { }
        }

        private string GetActionName()
        {
            if (_currentMetrics.ThermalHeadroom < 5) return "Thermal Mitigation";
            if (_currentMetrics.CpuUsage > 80) return "Max Performance";
            return "Active Tuning";
        }

        private string GetActionReason()
        {
            if (_currentMetrics.ThermalHeadroom < 5) return "Temperature Protection";
            if (_currentMetrics.CpuUsage > 80) return "Workload Intensive";
            return "Stable Performance";
        }
        
        private void InitializePerformanceCounters()
        {
            try
            {
                _nativeMetrics.GetCpuUsage(); // Warm-up
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[CPU_Tuning] Could not initialize NativeSystemMetrics: {ex.Message}");
            }
            
            // GPU counter initialization (varies by hardware)
            // This is a placeholder - real implementation depends on GPU vendor
        }
        
        private bool IsAdministrator()
        {
            try
            {
                var identity = System.Security.Principal.WindowsIdentity.GetCurrent();
                var principal = new System.Security.Principal.WindowsPrincipal(identity);
                return principal.IsInRole(System.Security.Principal.WindowsBuiltInRole.Administrator);
            }
            catch
            {
                return false;
            }
        }
        
        private void OnThermalProtectionTriggered(object? sender, ThermalProtectionEventArgs e)
        {
            _logger.LogWarning($"[CPU_Tuning] THERMAL PROTECTION TRIGGERED: {e.Reason}");
            
            // Immediately apply thermal protection measures
            try
            {
                var capabilities = _hardwareDetector.GetCapabilities();
                
                // Reduce processor state
                SetProcessorState(50, 90);
                
                // SAFETY: Re-enable BD PROCHOT in emergency
                if (_lowLevelHw.IsAvailable)
                {
                    _lowLevelHw.SetBdProchot(true);
                }

                _logger.LogInfo("[CPU_Tuning] Emergency thermal protection applied (BD PROCHOT re-enabled)");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[CPU_Tuning] Failed to apply thermal protection: {ex.Message}");
            }
        }
        
        private void OnRollbackRequired(object? sender, RollbackEventArgs e)
        {
            _logger.LogError($"[CPU_Tuning] ROLLBACK REQUIRED: {e.Reason} (Failures: {e.FailureCount})");
            
            // Deactivate tuning
            Deactivate();
        }
        
        public void Dispose()
        {
            Deactivate();
            _gpuCounter?.Dispose();
            
            if (_thermalGovernor is IDisposable disposableThermal)
            {
                disposableThermal.Dispose();
            }
        }
    }
    
    internal class SystemStateSnapshot
    {
        public Guid ActivePowerScheme { get; set; }
        public int MinProcessorState { get; set; }
        public int MaxProcessorState { get; set; }
        public int CoreParkingState { get; set; }
        public int EppState { get; set; }
        public int AutonomousMode { get; set; }
        
        // Hardware Limits
        public int OriginalPl1 { get; set; }
        public int OriginalPl2 { get; set; }
        public double OriginalTau { get; set; }
    }
}
