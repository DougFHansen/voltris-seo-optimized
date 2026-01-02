using System;
using System.Diagnostics;
using VoltrisOptimizer.Services.Gamer.Diagnostics.Interfaces;

namespace VoltrisOptimizer.Services.Gamer.Diagnostics.Helpers
{
    /// <summary>
    /// Helper para facilitar a integração de profiling nos módulos
    /// </summary>
    public static class ProfilingHelper
    {
        /// <summary>
        /// Executa uma ação com profiling automático
        /// </summary>
        public static T Profile<T>(string moduleName, Func<T> action, IGamerSelfProfiler? profiler = null)
        {
            profiler ??= (VoltrisOptimizer.Services.Gamer.Diagnostics.Interfaces.IGamerSelfProfiler?)typeof(App).GetProperty("GamerSelfProfiler")?.GetValue(null);
            if (profiler == null || !profiler.IsActive)
            {
                return action();
            }

            var stopwatch = Stopwatch.StartNew();
            try
            {
                profiler.BeginModuleExecution(moduleName);
                var result = action();
                stopwatch.Stop();
                profiler.RecordModuleExecution(moduleName, stopwatch.Elapsed.TotalMilliseconds);
                return result;
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                profiler.RecordModuleExecution(moduleName, stopwatch.Elapsed.TotalMilliseconds, 0, 0, 1);
                throw;
            }
        }

        /// <summary>
        /// Executa uma ação assíncrona com profiling automático
        /// </summary>
        public static async System.Threading.Tasks.Task<T> ProfileAsync<T>(string moduleName, Func<System.Threading.Tasks.Task<T>> action, IGamerSelfProfiler? profiler = null)
        {
            profiler ??= (VoltrisOptimizer.Services.Gamer.Diagnostics.Interfaces.IGamerSelfProfiler?)typeof(App).GetProperty("GamerSelfProfiler")?.GetValue(null);
            if (profiler == null || !profiler.IsActive)
            {
                return await action();
            }

            var stopwatch = Stopwatch.StartNew();
            try
            {
                profiler.BeginModuleExecution(moduleName);
                var result = await action();
                stopwatch.Stop();
                profiler.RecordModuleExecution(moduleName, stopwatch.Elapsed.TotalMilliseconds);
                return result;
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                profiler.RecordModuleExecution(moduleName, stopwatch.Elapsed.TotalMilliseconds, 0, 0, 1);
                throw;
            }
        }

        /// <summary>
        /// Executa uma ação void com profiling automático
        /// </summary>
        public static void Profile(string moduleName, Action action, IGamerSelfProfiler? profiler = null)
        {
            profiler ??= (VoltrisOptimizer.Services.Gamer.Diagnostics.Interfaces.IGamerSelfProfiler?)typeof(App).GetProperty("GamerSelfProfiler")?.GetValue(null);
            if (profiler == null || !profiler.IsActive)
            {
                action();
                return;
            }

            var stopwatch = Stopwatch.StartNew();
            try
            {
                profiler.BeginModuleExecution(moduleName);
                action();
                stopwatch.Stop();
                profiler.RecordModuleExecution(moduleName, stopwatch.Elapsed.TotalMilliseconds);
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                profiler.RecordModuleExecution(moduleName, stopwatch.Elapsed.TotalMilliseconds, 0, 0, 1);
                throw;
            }
        }

        /// <summary>
        /// Executa uma ação assíncrona void com profiling automático
        /// </summary>
        public static async System.Threading.Tasks.Task ProfileAsync(string moduleName, Func<System.Threading.Tasks.Task> action, IGamerSelfProfiler? profiler = null)
        {
            profiler ??= (VoltrisOptimizer.Services.Gamer.Diagnostics.Interfaces.IGamerSelfProfiler?)typeof(App).GetProperty("GamerSelfProfiler")?.GetValue(null);
            if (profiler == null || !profiler.IsActive)
            {
                await action();
                return;
            }

            var stopwatch = Stopwatch.StartNew();
            try
            {
                profiler.BeginModuleExecution(moduleName);
                await action();
                stopwatch.Stop();
                profiler.RecordModuleExecution(moduleName, stopwatch.Elapsed.TotalMilliseconds);
            }
            catch (Exception ex)
            {
                stopwatch.Stop();
                profiler.RecordModuleExecution(moduleName, stopwatch.Elapsed.TotalMilliseconds, 0, 0, 1);
                throw;
            }
        }
    }
}

