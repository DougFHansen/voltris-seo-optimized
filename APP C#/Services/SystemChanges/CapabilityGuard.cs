using System;
using System.Management;

namespace VoltrisOptimizer.Services.SystemChanges
{
    public class CapabilityGuard : ICapabilityGuard
    {
        public bool IsWindows10OrHigher() => Environment.OSVersion.Version.Major >= 10;
        public bool IsWindows11() => Environment.OSVersion.Version.Build >= 22000;

        public bool IsLaptop()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_Battery");
                return searcher.Get().Count > 0;
            }
            catch { return false; }
        }

        public bool AllowServiceTweaks() => IsWindows10OrHigher();
        public bool AllowRegistryTweaks() => IsWindows10OrHigher();
    }
}
