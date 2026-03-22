using System;
using System.Runtime.InteropServices;
using System.Threading;

namespace VoltrisOptimizer.Helpers
{
    /// <summary>
    /// Coleta métricas de CPU e memória usando APIs nativas do Windows (kernel32.dll).
    /// Mesmo método usado pelo Gerenciador de Tarefas do Windows.
    /// Thread-safe via lock para evitar race conditions em Task.Run.
    /// </summary>
    public sealed class NativeSystemMetrics
    {
        private readonly object _cpuLock = new();
        private ulong _prevIdleTime;
        private ulong _prevKernelTime;
        private ulong _prevUserTime;
        private bool _initialized;
        private double _lastCpuValue;

        /// <summary>
        /// Obtém o uso real da CPU usando GetSystemTimes (mesmo que o Task Manager).
        /// Retorna porcentagem de 0 a 100. Thread-safe.
        /// </summary>
        public double GetCpuUsage()
        {
            lock (_cpuLock)
            {
                if (!GetSystemTimes(out var idleTime, out var kernelTime, out var userTime))
                    return _lastCpuValue;

                var idle = FileTimeToUInt64(idleTime);
                var kernel = FileTimeToUInt64(kernelTime);
                var user = FileTimeToUInt64(userTime);

                if (!_initialized)
                {
                    _prevIdleTime = idle;
                    _prevKernelTime = kernel;
                    _prevUserTime = user;
                    _initialized = true;
                    return 0;
                }

                var idleDiff = idle - _prevIdleTime;
                var kernelDiff = kernel - _prevKernelTime;
                var userDiff = user - _prevUserTime;

                _prevIdleTime = idle;
                _prevKernelTime = kernel;
                _prevUserTime = user;

                // kernel inclui idle no Windows, então total = kernel + user
                var total = kernelDiff + userDiff;
                if (total == 0) return _lastCpuValue;

                // Subtrair idle do total para obter tempo ativo
                var usage = (total - idleDiff) * 100.0 / total;
                _lastCpuValue = Math.Clamp(Math.Round(usage, 1), 0, 100);
                return _lastCpuValue;
            }
        }

        /// <summary>
        /// Obtém o uso de memória usando GlobalMemoryStatusEx (mesmo que o Task Manager).
        /// Chamada instantânea, sem overhead.
        /// </summary>
        public MemoryInfo GetMemoryUsage()
        {
            var memStatus = new MEMORYSTATUSEX();
            if (!GlobalMemoryStatusEx(ref memStatus))
                return new MemoryInfo();

            double totalMb = memStatus.ullTotalPhys / 1024.0 / 1024.0;
            double availMb = memStatus.ullAvailPhys / 1024.0 / 1024.0;
            double usedMb = totalMb - availMb;

            return new MemoryInfo
            {
                UsagePercent = memStatus.dwMemoryLoad,
                UsedGb = usedMb / 1024.0,
                TotalGb = totalMb / 1024.0
            };
        }

        private static ulong FileTimeToUInt64(FILETIME ft)
            => ((ulong)ft.dwHighDateTime << 32) | ft.dwLowDateTime;

        #region P/Invoke

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool GetSystemTimes(
            out FILETIME lpIdleTime,
            out FILETIME lpKernelTime,
            out FILETIME lpUserTime);

        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool GlobalMemoryStatusEx(ref MEMORYSTATUSEX lpBuffer);

        [StructLayout(LayoutKind.Sequential)]
        private struct FILETIME
        {
            public uint dwLowDateTime;
            public uint dwHighDateTime;
        }

        [StructLayout(LayoutKind.Sequential, CharSet = CharSet.Auto)]
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

            public MEMORYSTATUSEX()
            {
                dwLength = (uint)Marshal.SizeOf(typeof(MEMORYSTATUSEX));
            }
        }

        #endregion
    }

    public struct MemoryInfo
    {
        public uint UsagePercent;
        public double UsedGb;
        public double TotalGb;
    }
}
