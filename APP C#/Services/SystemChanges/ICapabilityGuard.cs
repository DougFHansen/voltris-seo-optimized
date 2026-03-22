namespace VoltrisOptimizer.Services.SystemChanges
{
    public interface ICapabilityGuard
    {
        bool IsWindows10OrHigher();
        bool IsWindows11();
        bool IsLaptop();
        bool AllowServiceTweaks();
        bool AllowRegistryTweaks();
    }
}
