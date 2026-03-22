using System;
using System.IO;
using Microsoft.Win32;

namespace VoltrisOptimizer.Services.Performance.CpuTuning
{
    /// <summary>
    /// Monitors system stability and triggers automatic rollback on crashes
    /// </summary>
    public class StabilityWatchdog : IStabilityWatchdog
    {
        private readonly ILoggingService _logger;
        private const string RegistryPath = @"SOFTWARE\VoltrisOptimizer\CpuTuning";
        private const string FailureCountKey = "FailureCount";
        private const string LastCrashKey = "LastCrashTime";
        private const string DisabledKey = "TuningDisabled";
        private const int MaxFailures = 3;
        
        private int _failureCount;
        private bool _tuningDisabled;
        
        public event EventHandler<RollbackEventArgs>? RollbackRequired;
        
        public StabilityWatchdog(ILoggingService logger)
        {
            _logger = logger;
        }
        
        public void Initialize()
        {
            _logger.LogInfo("[StabilityWatchdog] Initializing...");
            
            try
            {
                // Read failure count from registry
                using var key = Registry.CurrentUser.CreateSubKey(RegistryPath);
                _failureCount = (int)(key.GetValue(FailureCountKey, 0) ?? 0);
                _tuningDisabled = Convert.ToBoolean(key.GetValue(DisabledKey, false) ?? false);
                
                if (_failureCount > 0)
                {
                    _logger.LogWarning($"[StabilityWatchdog] Previous failures detected: {_failureCount}");
                    
                    // Check if last crash was recent (within 5 minutes)
                    var lastCrashStr = key.GetValue(LastCrashKey) as string;
                    if (!string.IsNullOrEmpty(lastCrashStr) && DateTime.TryParse(lastCrashStr, out var lastCrash))
                    {
                        var timeSinceCrash = DateTime.UtcNow - lastCrash;
                        if (timeSinceCrash.TotalMinutes < 5)
                        {
                            _logger.LogWarning($"[StabilityWatchdog] Recent crash detected ({timeSinceCrash.TotalMinutes:F1} minutes ago)");
                            RecordCrash("System restarted after crash");
                        }
                    }
                }
                
                if (_tuningDisabled)
                {
                    _logger.LogWarning("[StabilityWatchdog] CPU tuning is DISABLED due to repeated failures");
                }
                else
                {
                    _logger.LogInfo("[StabilityWatchdog] Initialized successfully");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[StabilityWatchdog] Initialization failed: {ex.Message}");
            }
        }
        
        public void RecordSuccessfulSession()
        {
            // Successful session - gradually reduce failure count
            if (_failureCount > 0)
            {
                _failureCount = Math.Max(0, _failureCount - 1);
                SaveFailureCount();
                _logger.LogInfo($"[StabilityWatchdog] Successful session recorded. Failure count: {_failureCount}");
            }
        }
        
        public bool ShouldDisableTuning()
        {
            return _tuningDisabled || _failureCount >= MaxFailures;
        }
        
        public void RecordCrash(string reason)
        {
            _failureCount++;
            _logger.LogError($"[StabilityWatchdog] Crash recorded: {reason}. Failure count: {_failureCount}");
            
            SaveFailureCount();
            SaveLastCrashTime();
            
            // Trigger rollback event
            RollbackRequired?.Invoke(this, new RollbackEventArgs
            {
                Reason = reason,
                FailureCount = _failureCount
            });
            
            // Check if we should disable tuning
            if (_failureCount >= MaxFailures)
            {
                _tuningDisabled = true;
                SaveDisabledState();
                _logger.LogError($"[StabilityWatchdog] TUNING DISABLED after {_failureCount} failures. Manual re-enable required.");
            }
        }
        
        public void ResetFailureCounter()
        {
            _logger.LogInfo("[StabilityWatchdog] Failure counter reset by user");
            _failureCount = 0;
            _tuningDisabled = false;
            SaveFailureCount();
            SaveDisabledState();
        }
        
        public int GetFailureCount()
        {
            return _failureCount;
        }
        
        private void SaveFailureCount()
        {
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(RegistryPath);
                key.SetValue(FailureCountKey, _failureCount, RegistryValueKind.DWord);
            }
            catch (Exception ex)
            {
                _logger.LogError($"[StabilityWatchdog] Failed to save failure count: {ex.Message}");
            }
        }
        
        private void SaveLastCrashTime()
        {
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(RegistryPath);
                key.SetValue(LastCrashKey, DateTime.UtcNow.ToString("O"), RegistryValueKind.String);
            }
            catch (Exception ex)
            {
                _logger.LogError($"[StabilityWatchdog] Failed to save crash time: {ex.Message}");
            }
        }
        
        private void SaveDisabledState()
        {
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(RegistryPath);
                key.SetValue(DisabledKey, _tuningDisabled ? 1 : 0, RegistryValueKind.DWord);
            }
            catch (Exception ex)
            {
                _logger.LogError($"[StabilityWatchdog] Failed to save disabled state: {ex.Message}");
            }
        }
    }
}
