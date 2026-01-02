using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading;
using VoltrisOptimizer.Services.Gamer.Interfaces;

namespace VoltrisOptimizer.Services.Gamer.Implementation
{
    /// <summary>
    /// Implementação do otimizador de memória para jogos
    /// </summary>
    public class MemoryGamingOptimizerService : IMemoryGamingOptimizer
    {
        private readonly ILoggingService _logger;
        private Thread? _monitorThread;
        private CancellationTokenSource? _monitorCts;
        private PerformanceCounter? _standbyNormal;
        private PerformanceCounter? _standbyReserve;
        private PerformanceCounter? _standbyCore;
        private bool _isMonitoring;

        // Native methods para limpeza de standby list
        [DllImport("ntdll.dll")]
        private static extern int NtSetSystemInformation(int SystemInformationClass, ref int SystemInformation, int SystemInformationLength);

        [DllImport("kernel32.dll")]
        private static extern bool GlobalMemoryStatusEx(ref MEMORYSTATUSEX lpBuffer);

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
        }

        private const int SystemMemoryListInformation = 80;
        private const int MemoryPurgeStandbyList = 4;
        private const int MemoryPurgeLowPriorityStandbyList = 5;

        public MemoryGamingOptimizerService(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            InitializeCounters();
        }

        private void InitializeCounters()
        {
            try
            {
                _standbyNormal = new PerformanceCounter("Memory", "Standby Cache Normal Priority Bytes", readOnly: true);
                _standbyReserve = new PerformanceCounter("Memory", "Standby Cache Reserve Bytes", readOnly: true);
                _standbyCore = new PerformanceCounter("Memory", "Standby Cache Core Bytes", readOnly: true);
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[MemoryOptimizer] Erro ao inicializar contadores: {ex.Message}");
            }
        }

        public bool CleanStandbyList()
        {
            try
            {
                var cmd1 = MemoryPurgeStandbyList;
                var status1 = NtSetSystemInformation(SystemMemoryListInformation, ref cmd1, Marshal.SizeOf<int>());

                var cmd2 = MemoryPurgeLowPriorityStandbyList;
                var status2 = NtSetSystemInformation(SystemMemoryListInformation, ref cmd2, Marshal.SizeOf<int>());

                var success = status1 == 0 || status2 == 0;

                if (success)
                {
                    _logger.LogSuccess("[MemoryOptimizer] Standby list limpa");
                }
                else
                {
                    _logger.LogWarning($"[MemoryOptimizer] Falha ao limpar standby list: {status1}/{status2}");
                }

                return success;
            }
            catch (Exception ex)
            {
                _logger.LogError("[MemoryOptimizer] Erro ao limpar standby list", ex);
                return false;
            }
        }

        public void StartMonitoring(int thresholdMb = 1024, int standbyThresholdMb = 1024)
        {
            if (_isMonitoring) return;

            try
            {
                _monitorCts = new CancellationTokenSource();
                var token = _monitorCts.Token;

                _monitorThread = new Thread(() =>
                {
                    _logger.LogInfo("[MemoryOptimizer] Monitor de RAM iniciado");

                    while (!token.IsCancellationRequested)
                    {
                        try
                        {
                            var freeMb = GetFreeMemoryMb();
                            var standbyMb = GetStandbyCacheMb();

                            // Se memória livre baixa e standby cache alta, limpar
                            if (freeMb < thresholdMb && standbyMb > standbyThresholdMb)
                            {
                                _logger.LogInfo($"[MemoryOptimizer] RAM baixa ({freeMb:F0}MB), limpando standby ({standbyMb:F0}MB)");
                                CleanStandbyList();
                            }

                            Thread.Sleep(4000);
                        }
                        catch (OperationCanceledException) { break; }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"[MemoryOptimizer] Erro no monitor: {ex.Message}");
                            Thread.Sleep(10000); // Esperar mais tempo em caso de erro
                        }
                    }

                    _logger.LogInfo("[MemoryOptimizer] Monitor de RAM parado");
                })
                {
                    IsBackground = true,
                    Name = "Voltris_RAMMonitor"
                };

                _monitorThread.Start();
                _isMonitoring = true;
            }
            catch (Exception ex)
            {
                _logger.LogError("[MemoryOptimizer] Erro ao iniciar monitor", ex);
            }
        }

        public void StopMonitoring()
        {
            if (!_isMonitoring) return;

            try
            {
                _monitorCts?.Cancel();
                _monitorCts?.Dispose();
                _monitorCts = null;
                _monitorThread = null;
                _isMonitoring = false;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[MemoryOptimizer] Erro ao parar monitor: {ex.Message}");
            }
        }

        public double GetFreeMemoryMb()
        {
            try
            {
                var memoryStatus = new MEMORYSTATUSEX
                {
                    dwLength = (uint)Marshal.SizeOf<MEMORYSTATUSEX>()
                };

                if (GlobalMemoryStatusEx(ref memoryStatus))
                {
                    return memoryStatus.ullAvailPhys / (1024.0 * 1024.0);
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[MemoryOptimizer] Erro ao obter memória livre: {ex.Message}");
            }

            return 0;
        }

        public double GetStandbyCacheMb()
        {
            try
            {
                var normal = _standbyNormal?.NextValue() ?? 0;
                var reserve = _standbyReserve?.NextValue() ?? 0;
                var core = _standbyCore?.NextValue() ?? 0;

                return (normal + reserve + core) / (1024.0 * 1024.0);
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[MemoryOptimizer] Erro ao obter standby cache: {ex.Message}");
                return 0;
            }
        }

        /// <summary>
        /// Libera recursos
        /// </summary>
        public void Dispose()
        {
            StopMonitoring();

            try
            {
                _standbyNormal?.Dispose();
                _standbyReserve?.Dispose();
                _standbyCore?.Dispose();
            }
            catch { }
        }
    }
}

