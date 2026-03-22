using System;

namespace VoltrisOptimizer.Services.Performance.CpuTuning
{
    /// <summary>
    /// Stability watchdog - monitors system stability and triggers rollback
    /// </summary>
    public interface IStabilityWatchdog
    {
        /// <summary>
        /// Initialize watchdog
        /// </summary>
        void Initialize();
        
        /// <summary>
        /// Record successful tuning session
        /// </summary>
        void RecordSuccessfulSession();
        
        /// <summary>
        /// Check if tuning should be disabled due to instability
        /// </summary>
        bool ShouldDisableTuning();
        
        /// <summary>
        /// Record crash or instability event
        /// </summary>
        void RecordCrash(string reason);
        
        /// <summary>
        /// Reset failure counter (manual user action)
        /// </summary>
        void ResetFailureCounter();
        
        /// <summary>
        /// Get current failure count
        /// </summary>
        int GetFailureCount();
        
        /// <summary>
        /// Event fired when rollback is required
        /// </summary>
        event EventHandler<RollbackEventArgs>? RollbackRequired;
    }
    
    public class RollbackEventArgs : EventArgs
    {
        public string Reason { get; set; } = string.Empty;
        public int FailureCount { get; set; }
    }
}
