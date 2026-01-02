using System;
using System.Threading.Tasks;

namespace VoltrisOptimizer.Interfaces
{
    /// <summary>
    /// Interface para serviço de otimização de desempenho
    /// </summary>
    public interface IPerformanceOptimizer
    {
        Task<bool> SetHighPerformancePlanAsync(Action<int>? progressCallback = null);
        Task<bool> SetBalancedPlanAsync(Action<int>? progressCallback = null);
        Task<bool> OptimizeStartupAsync(Action<int>? progressCallback = null);
        Task<bool> OptimizeServicesAsync(Action<int>? progressCallback = null);
        Task<bool> OptimizeRAMAsync(Action<int>? progressCallback = null);
    }
}
