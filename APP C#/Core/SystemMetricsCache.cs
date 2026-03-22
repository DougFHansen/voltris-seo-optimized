using System;
using System.Runtime.InteropServices;
using System.Threading;

namespace VoltrisOptimizer.Core
{
    /// <summary>
    /// SystemMetricsCache — cache centralizado de métricas do sistema.
    ///
    /// PROBLEMA:
    ///   15+ serviços chamavam GetCpuUsage(), GetMemoryUsage(), GetSystemTimes()
    ///   de forma independente, cada um com seu próprio loop e intervalo.
    ///   Resultado: dezenas de chamadas ao kernel por segundo, todas retornando
    ///   o mesmo valor (CPU% não muda em milissegundos).
    ///
    /// SOLUÇÃO:
    ///   Um único ponto de coleta que atualiza as métricas a cada 2 segundos.
    ///   Todos os serviços leem daqui — zero chamadas ao kernel fora deste cache.
    ///   Custo total: 1 atualização/2s em vez de N atualizações/s.
    /// </summary>
    public sealed class SystemMetricsCache
    {
        public static readonly SystemMetricsCache Instance = new();

        // ── Métricas publicadas (leitura sem lock — volatile garante visibilidade) ──
        public double CpuPercent        { get; private set; }
        public double MemoryUsedPercent { get; private set; }
        public double AvailableRamMb    { get; private set; }
        public float  DiskQueueLength   { get; private set; }
        public long   LastInputMs       { get; private set; } // ms desde último input do usuário
        public DateTime LastUpdated     { get; private set; } = DateTime.MinValue;

        // Estado interno para cálculo de CPU via GetSystemTimes
        private long _prevIdle, _prevKernel, _prevUser;
        private readonly object _updateLock = new();
        private Timer? _timer;
        private bool _started;

        private const int UpdateIntervalMs = 2000; // 2s — suficiente para todos os consumidores

        private SystemMetricsCache() { }

        /// <summary>Inicia o cache. Chamar uma vez no startup.</summary>
        public void Start()
        {
            lock (_updateLock)
            {
                if (_started) return;
                _started = true;
            }
            // Primeira leitura imediata para inicializar os deltas
            Update();
            _timer = new Timer(_ => Update(), null, UpdateIntervalMs, UpdateIntervalMs);
        }

        public void Stop()
        {
            _timer?.Dispose();
            _timer = null;
            _started = false;
        }

        private void Update()
        {
            lock (_updateLock)
            {
                try { CpuPercent = ReadCpuPercent(); } catch { }
                try { ReadMemory(); } catch { }
                try { LastInputMs = ReadLastInputMs(); } catch { }
                LastUpdated = DateTime.UtcNow;
            }
        }

        // ── CPU via GetSystemTimes (mesma fonte que o Task Manager) ─────────
        private double ReadCpuPercent()
        {
            if (!GetSystemTimes(out long idle, out long kernel, out long user))
                return CpuPercent; // retorna valor anterior se falhar

            long deltaIdle   = idle   - _prevIdle;
            long deltaKernel = kernel - _prevKernel;
            long deltaUser   = user   - _prevUser;

            _prevIdle   = idle;
            _prevKernel = kernel;
            _prevUser   = user;

            long total = deltaKernel + deltaUser;
            if (total <= 0) return CpuPercent;

            // kernel inclui idle — subtrair para obter CPU real
            double busy = total - deltaIdle;
            return Math.Max(0, Math.Min(100, (busy / total) * 100.0));
        }

        // ── RAM via GlobalMemoryStatusEx ─────────────────────────────────────
        private void ReadMemory()
        {
            var mem = new MEMORYSTATUSEX { dwLength = (uint)Marshal.SizeOf<MEMORYSTATUSEX>() };
            if (!GlobalMemoryStatusEx(ref mem)) return;
            MemoryUsedPercent = mem.dwMemoryLoad;
            AvailableRamMb    = mem.ullAvailPhys / (1024.0 * 1024.0);
        }

        // ── Último input do usuário ──────────────────────────────────────────
        private long ReadLastInputMs()
        {
            var info = new LASTINPUTINFO { cbSize = (uint)Marshal.SizeOf<LASTINPUTINFO>() };
            if (!GetLastInputInfo(ref info)) return LastInputMs;
            return Environment.TickCount - (int)info.dwTime;
        }

        // ── Win32 ────────────────────────────────────────────────────────────
        [DllImport("kernel32.dll")]
        private static extern bool GetSystemTimes(out long lpIdleTime, out long lpKernelTime, out long lpUserTime);

        [DllImport("kernel32.dll")]
        private static extern bool GlobalMemoryStatusEx(ref MEMORYSTATUSEX lpBuffer);

        [DllImport("user32.dll")]
        private static extern bool GetLastInputInfo(ref LASTINPUTINFO plii);

        [StructLayout(LayoutKind.Sequential)]
        private struct MEMORYSTATUSEX
        {
            public uint   dwLength;
            public uint   dwMemoryLoad;
            public ulong  ullTotalPhys;
            public ulong  ullAvailPhys;
            public ulong  ullTotalPageFile;
            public ulong  ullAvailPageFile;
            public ulong  ullTotalVirtual;
            public ulong  ullAvailVirtual;
            public ulong  ullAvailExtendedVirtual;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct LASTINPUTINFO
        {
            public uint cbSize;
            public uint dwTime;
        }
    }
}
