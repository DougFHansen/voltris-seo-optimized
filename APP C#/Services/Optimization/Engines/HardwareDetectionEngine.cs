using System;
using System.Management;
using System.Runtime.InteropServices;
using System.Linq;

namespace VoltrisOptimizer.Services.Optimization.Engines
{
    /// <summary>
    /// DSL 5.0 - Hardware Detection Engine
    /// Identificação automática de hardware para adaptação de algoritmos.
    /// </summary>
    public class HardwareDetectionEngine : IDisposable
    {
        private readonly ILoggingService _logger;

        public void Dispose() { }

        public string CpuVendor { get; private set; } = "Unknown";
        public int CpuCores { get; private set; }
        public ulong TotalRamBytes { get; private set; }
        public bool IsSsd { get; private set; } = true;
        public bool IsLaptop { get; private set; } = false;

        public HardwareDetectionEngine(ILoggingService logger)
        {
            _logger = logger;
            CollectInfo();
        }

        private void CollectInfo()
        {
            try
            {
                // CPU
                CpuCores = Environment.ProcessorCount;
                
                using (var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_Processor"))
                {
                    foreach (var obj in searcher.Get())
                    {
                        CpuVendor = obj["Manufacturer"]?.ToString() ?? "Unknown";
                        break;
                    }
                }

                // RAM
                var mem = new MEMORYSTATUSEX();
                mem.dwLength = (uint)Marshal.SizeOf(typeof(MEMORYSTATUSEX));
                GlobalMemoryStatusEx(ref mem);
                TotalRamBytes = mem.ullTotalPhys;

                // SSD Detection (Simplified)
                try {
                    using (var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_DiskDrive")) {
                        foreach (var obj in searcher.Get()) {
                            string mediaType = obj["MediaType"]?.ToString() ?? "";
                            string model = obj["Model"]?.ToString()?.ToUpper() ?? "";
                            if (model.Contains("SSD") || model.Contains("NVME")) IsSsd = true;
                        }
                    }
                } catch { }

                // Laptop Detection
                try {
                    using (var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_SystemEnclosure")) {
                        foreach (var obj in searcher.Get()) {
                            var types = obj["ChassisTypes"] as ushort[];
                            if (types != null && types.Any(t => t >= 8 && t <= 11)) IsLaptop = true;
                        }
                    }
                } catch { }

                _logger.LogInfo($"[DSL 5.0] Hardware: CPU {CpuVendor} ({CpuCores}), RAM: {TotalRamBytes / 1024 / 1024 / 1024}GB, SSD: {IsSsd}, Laptop: {IsLaptop}");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[Hardware] Erro na detecção: {ex.Message}");
            }
        }

        [DllImport("kernel32.dll")]
        private static extern bool GlobalMemoryStatusEx(ref MEMORYSTATUSEX lpBuffer);

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
    }
}
