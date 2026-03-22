using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace VoltrisOptimizer.Interfaces
{
    public interface ISecurityTuningService
    {
        Task<SecurityStatus> GetSecurityStatusAsync();
        Task RunQuickScanAsync();
        Task UpdateSignaturesAsync();
        Task<bool> ApplyTweakAsync(string tag, bool enable);
        Task<bool> GetTweakStateAsync(string tag);
        void InvalidateCache();
    }

    public class SecurityStatus
    {
        public bool AntivirusEnabled { get; set; }
        public string AntivirusProduct { get; set; } = string.Empty;
        public DateTime? LastSignatureUpdate { get; set; }
        public bool FirewallEnabled { get; set; }
        public bool WindowsUpdateEnabled { get; set; }
        public bool SmartScreenEnabled { get; set; }
        public bool RealTimeProtectionEnabled { get; set; }
        public bool UacEnabled { get; set; }
        public bool TamperProtectionEnabled { get; set; }
        public bool ControlledFolderAccessEnabled { get; set; }
        public bool BitLockerEnabled { get; set; }
        public bool DefenderServiceEnabled { get; set; }
    }
}
