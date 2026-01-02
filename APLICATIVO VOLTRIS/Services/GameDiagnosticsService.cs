using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Management;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Gamer.GamerModeManager;

namespace VoltrisOptimizer.Services
{
    public class GameDiagnosticsService
    {
        public class Sample
        {
            public DateTime T { get; set; }
            public double CpuPercent { get; set; }
            public double CpuQueue { get; set; }
            public double CpuCurrentMhz { get; set; }
            public double CpuMaxMhz { get; set; }
            public double CpuDpcPercent { get; set; }
            public double CpuInterruptPercent { get; set; }
            public double CpuTemperature { get; set; } // Nova propriedade
            public bool CpuThrottling { get; set; } // Nova propriedade
            public double RamUsedGb { get; set; }
            public double RamTotalGb { get; set; }
            public double RamPageFaultsPerSec { get; set; }
            public double DiskReadsPerSec { get; set; }
            public double DiskWritesPerSec { get; set; }
            public double DiskQueueLen { get; set; }
            public double DiskLatencySec { get; set; }
            public double GpuUtilPercent { get; set; }
            public double GpuVramUsedMb { get; set; }
            public double GpuVramTotalMb { get; set; }
            public double GpuTemperature { get; set; } // Nova propriedade
            public bool GpuThrottling { get; set; } // Nova propriedade
            public double NetJitterMs { get; set; }
            public double Fps { get; set; }
            public string Cause { get; set; } = "";
        }

        public event Action<IReadOnlyList<Sample>>? SamplesUpdated;

        private readonly List<Sample> _samples = new List<Sample>(600);
        private readonly object _samplesLock = new object();
        private CancellationTokenSource? _cts;
        private Task? _pmTask;
        private readonly System.Collections.Concurrent.ConcurrentQueue<double> _ftQueue = new System.Collections.Concurrent.ConcurrentQueue<double>();
        
        // Campos para monitoramento térmico
        private readonly IThermalMonitorService _thermalMonitor;
        
        public GameDiagnosticsService()
        {
            _thermalMonitor = new ThermalMonitorService(new LoggingService(System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs")));
        }
        
        public void Start()
        {
            Stop();
            _cts = new CancellationTokenSource();
            var token = _cts.Token;
            Task.Run(() => RunLoop(token), token);
            TryStartPresentMon(token);
        }

        public void Stop()
        {
            try { _cts?.Cancel(); } catch { }
            _cts = null;
            try { _pmTask?.Dispose(); } catch { }
            _pmTask = null;
        }

        private void RunLoop(CancellationToken token)
        {
            PerformanceCounter? cpu = null;
            PerformanceCounter? qlen = null;
            PerformanceCounter? dpc = null;
            PerformanceCounter? intr = null;
            PerformanceCounter? pf = null;
            PerformanceCounter? diskR = null;
            PerformanceCounter? diskW = null;
            PerformanceCounter? diskQ = null;
            PerformanceCounter? diskLat = null;
            List<PerformanceCounter>? gpu3d = null;
            List<PerformanceCounter>? vramUsed = null;
            double maxMhz = 0;
            try
            {
                cpu = new PerformanceCounter("Processor", "% Processor Time", "_Total"); cpu.NextValue();
                qlen = new PerformanceCounter("System", "Processor Queue Length"); qlen.NextValue();
                try { dpc = new PerformanceCounter("Processor", "% DPC Time", "_Total"); dpc.NextValue(); } catch { }
                try { intr = new PerformanceCounter("Processor", "% Interrupt Time", "_Total"); intr.NextValue(); } catch { }
                try { pf = new PerformanceCounter("Memory", "Page Faults/sec"); pf.NextValue(); } catch { }
                try { diskR = new PerformanceCounter("PhysicalDisk", "Disk Reads/sec", "_Total"); diskR.NextValue(); } catch { }
                try { diskW = new PerformanceCounter("PhysicalDisk", "Disk Writes/sec", "_Total"); diskW.NextValue(); } catch { }
                try { diskQ = new PerformanceCounter("PhysicalDisk", "Avg. Disk Queue Length", "_Total"); diskQ.NextValue(); } catch { }
                try { diskLat = new PerformanceCounter("PhysicalDisk", "Avg. Disk sec/Transfer", "_Total"); diskLat.NextValue(); } catch { }
                try
                {
                    var cat = new PerformanceCounterCategory("GPU Engine");
                    gpu3d = new List<PerformanceCounter>();
                    foreach (var inst in cat.GetInstanceNames())
                    {
                        if (inst.Contains("engtype_3D", StringComparison.OrdinalIgnoreCase))
                        {
                            try { gpu3d.Add(new PerformanceCounter("GPU Engine", "Utilization Percentage", inst)); } catch { }
                        }
                    }
                }
                catch { gpu3d = null; }
                try
                {
                    var catMem = new PerformanceCounterCategory("GPU Adapter Memory");
                    vramUsed = new List<PerformanceCounter>();
                    foreach (var inst in catMem.GetInstanceNames())
                    {
                        try { vramUsed.Add(new PerformanceCounter("GPU Adapter Memory", "Dedicated Usage", inst)); } catch { }
                    }
                }
                catch { vramUsed = null; }
                try
                {
                    using var s = new ManagementObjectSearcher("SELECT MaxClockSpeed FROM Win32_Processor");
                    foreach (ManagementObject o in s.Get()) { maxMhz = Convert.ToDouble(o["MaxClockSpeed"] ?? 0); break; }
                }
                catch { maxMhz = 0; }
            }
            catch { }

            while (!token.IsCancellationRequested)
            {
                try
                {
                    var t = DateTime.UtcNow;
                    double cpuPct = Safe(cpu);
                    double q = Safe(qlen);
                    double dpcPct = Safe(dpc);
                    double intrPct = Safe(intr);
                    double pfsec = Safe(pf);
                    double rps = Safe(diskR);
                    double wps = Safe(diskW);
                    double dq = Safe(diskQ);
                    double dlat = Safe(diskLat);
                    double gpu = -1;
                    double vram = -1;
                    double vramTot = -1;
                    try
                    {
                        if (gpu3d != null && gpu3d.Count > 0)
                        {
                            double sum = 0; foreach (var c in gpu3d) { try { sum += c.NextValue(); } catch { } }
                            gpu = Math.Max(0, Math.Min(100, sum));
                        }
                    }
                    catch { gpu = -1; }
                    try
                    {
                        if (vramUsed != null && vramUsed.Count > 0)
                        {
                            double sum = 0; foreach (var c in vramUsed) { try { sum += c.NextValue(); } catch { } }
                            vram = sum / (1024 * 1024);
                            vramTot = 0;
                        }
                    }
                    catch { vram = -1; }
                    double curMhz = 0;
                    try
                    {
                        using var s = new ManagementObjectSearcher("SELECT CurrentClockSpeed FROM Win32_Processor");
                        foreach (ManagementObject o in s.Get()) { curMhz = Convert.ToDouble(o["CurrentClockSpeed"] ?? 0); break; }
                    }
                    catch { curMhz = 0; }
                    double totalRamGb = 0;
                    try
                    {
                        long total = 0;
                        using var searcher = new ManagementObjectSearcher("SELECT Capacity FROM Win32_PhysicalMemory");
                        foreach (ManagementObject obj in searcher.Get()) { long.TryParse(obj["Capacity"]?.ToString() ?? "0", out var cap); total += cap; }
                        totalRamGb = total / (1024.0 * 1024 * 1024);
                    }
                    catch { totalRamGb = 0; }
                    double availGb = 0;
                    try
                    {
                        var pc = new PerformanceCounter("Memory", "Available MBytes"); availGb = pc.NextValue() / 1024.0;
                        pc.Dispose();
                    }
                    catch { availGb = 0; }
                    var usedGb = totalRamGb > 0 ? Math.Max(0, totalRamGb - availGb) : 0;
                    double fps = 0;
                    try
                    {
                        if (_ftQueue.Count >= 5)
                        {
                            var arr = _ftQueue.ToArray();
                            var avgMs = arr.Average();
                            fps = avgMs > 0 ? 1000.0 / avgMs : 0;
                        }
                    }
                    catch { fps = 0; }
                    
                    // Coletar dados térmicos
                    double cpuTemp = _thermalMonitor.GetCpuTemperature();
                    double gpuTemp = _thermalMonitor.GetGpuTemperature();
                    bool cpuThrottling = _thermalMonitor.IsCpuThrottling();
                    bool gpuThrottling = _thermalMonitor.IsGpuThrottling();
                    
                    var cause = Infer(cpuPct, q, dpcPct, intrPct, pfsec, dq, dlat, gpu, usedGb, totalRamGb, curMhz, maxMhz, cpuTemp, cpuThrottling, gpuTemp, gpuThrottling);
                    var sample = new Sample
                    {
                        T = t,
                        CpuPercent = cpuPct,
                        CpuQueue = q,
                        CpuCurrentMhz = curMhz,
                        CpuMaxMhz = maxMhz,
                        CpuDpcPercent = dpcPct,
                        CpuInterruptPercent = intrPct,
                        CpuTemperature = cpuTemp, // Nova propriedade
                        CpuThrottling = cpuThrottling, // Nova propriedade
                        RamUsedGb = usedGb,
                        RamTotalGb = totalRamGb,
                        RamPageFaultsPerSec = pfsec,
                        DiskReadsPerSec = rps,
                        DiskWritesPerSec = wps,
                        DiskQueueLen = dq,
                        DiskLatencySec = dlat,
                        GpuUtilPercent = gpu,
                        GpuVramUsedMb = vram,
                        GpuVramTotalMb = vramTot,
                        GpuTemperature = gpuTemp, // Nova propriedade
                        GpuThrottling = gpuThrottling, // Nova propriedade
                        Fps = fps,
                        Cause = cause
                    };
                    List<Sample> snapshot;
                    lock (_samplesLock)
                    {
                        _samples.Add(sample);
                        if (_samples.Count > 600) _samples.RemoveRange(0, _samples.Count - 600);
                        snapshot = _samples.ToList();
                    }
                    SamplesUpdated?.Invoke(snapshot);
                }
                catch { }
                Thread.Sleep(750);
            }

            try { cpu?.Dispose(); } catch { }
            try { qlen?.Dispose(); } catch { }
            try { dpc?.Dispose(); } catch { }
            try { intr?.Dispose(); } catch { }
            try { pf?.Dispose(); } catch { }
            try { diskR?.Dispose(); } catch { }
            try { diskW?.Dispose(); } catch { }
            try { diskQ?.Dispose(); } catch { }
            try { diskLat?.Dispose(); } catch { }
            if (gpu3d != null) { foreach (var c in gpu3d) { try { c.Dispose(); } catch { } } }
            if (vramUsed != null) { foreach (var c in vramUsed) { try { c.Dispose(); } catch { } } }
        }

        private static double Safe(PerformanceCounter? c)
        {
            try { return c != null ? c.NextValue() : 0; } catch { return 0; }
        }

        private string Infer(double cpu, double q, double dpc, double intr, double pf, double dq, double dlat, double gpu, double ramUsedGb, double ramTotalGb, double curMhz, double maxMhz, double cpuTemp, bool cpuThrottling, double gpuTemp, bool gpuThrottling)
        {
            try
            {
                // Sistema de pontuação para determinar a causa mais provável
                // Cada problema recebe uma pontuação baseada na severidade
                var scores = new Dictionary<string, double>();
                
                // 1. Throttling térmico (prioridade máxima - causa real e crítica)
                if (cpuThrottling || gpuThrottling)
                {
                    double thermalScore = 0;
                    if (cpuThrottling) thermalScore += (cpuTemp - 70) * 2; // Quanto mais quente, maior a pontuação
                    if (gpuThrottling) thermalScore += (gpuTemp - 70) * 2;
                    scores["Energia/Throttling"] = thermalScore;
                }
                
                // 2. CPU/Scheduling (verificar saturação real)
                if (cpu > 85 || q > 2)
                {
                    double cpuScore = (cpu - 80) * 1.5 + (q > 2 ? q * 10 : 0);
                    scores["CPU/Scheduling"] = cpuScore;
                }
                
                // 3. Drivers/DPC/Interrupt (verificar valores anormais)
                if (dpc > 5 || intr > 5)
                {
                    double driverScore = (dpc > 5 ? dpc * 5 : 0) + (intr > 5 ? intr * 5 : 0);
                    scores["Drivers/DPC/Interrupt"] = driverScore;
                }
                
                // 4. Memória/Paging (verificar uso REAL de RAM e page faults significativos)
                if (ramTotalGb > 0)
                {
                    double ramUsagePercent = (ramUsedGb / ramTotalGb) * 100;
                    // Só considerar problema se RAM > 90% E page faults > 1000/s (não 500)
                    if (ramUsagePercent > 90 && pf > 1000)
                    {
                        double memScore = (ramUsagePercent - 85) * 2 + (pf > 1000 ? (pf - 1000) / 100 : 0);
                        scores["Memória/Paging"] = memScore;
                    }
                    // Ou se page faults são extremamente altos (> 2000/s) mesmo com RAM moderada
                    else if (pf > 2000 && ramUsagePercent > 75)
                    {
                        scores["Memória/Paging"] = (pf - 1500) / 50;
                    }
                }
                
                // 5. Disco/IO (verificar latência e fila significativas)
                if (dq > 1.0 || dlat > 0.05)
                {
                    double diskScore = (dq > 1.0 ? dq * 20 : 0) + (dlat > 0.05 ? dlat * 1000 : 0);
                    scores["Disco/IO"] = diskScore;
                }
                
                // 6. GPU/Render (GPU saturada enquanto CPU não está)
                if (gpu >= 85 && cpu < 70)
                {
                    scores["GPU/Render"] = (gpu - 80) * 2;
                }
                
                // 7. Energia/Throttling (frequência reduzida sem causa térmica)
                if (maxMhz > 0 && curMhz > 0)
                {
                    double clockRatio = curMhz / maxMhz;
                    if (clockRatio < 0.6 && cpu > 60 && !cpuThrottling)
                    {
                        scores["Energia/Throttling"] = (0.6 - clockRatio) * 100;
                    }
                }
                
                // Retornar a causa com maior pontuação, ou "Indefinido" se nenhuma for significativa
                if (scores.Count > 0)
                {
                    var topCause = scores.OrderByDescending(kvp => kvp.Value).First();
                    // Só retornar se a pontuação for significativa (>= 10)
                    if (topCause.Value >= 10)
                    {
                        return topCause.Key;
                    }
                }
            }
            catch { }
            return "Indefinido";
        }

        private void TryStartPresentMon(CancellationToken token)
        {
            try
            {
                var pid = VoltrisOptimizer.App.GamerOptimizer?.GetMonitoredGameProcessId() ?? 0;
                if (pid <= 0) return;
                var exe = FindPresentMonExecutable();
                if (string.IsNullOrWhiteSpace(exe) || !System.IO.File.Exists(exe)) return;
                _pmTask = Task.Run(() =>
                {
                    try
                    {
                        var psi = new ProcessStartInfo
                        {
                            FileName = exe,
                            Arguments = $"-process_id {pid} -qpc_time -csv",
                            UseShellExecute = false,
                            RedirectStandardOutput = true,
                            RedirectStandardError = true,
                            CreateNoWindow = true
                        };
                        using var p = Process.Start(psi);
                        if (p == null) return;
                        var reader = p.StandardOutput;
                        while (!token.IsCancellationRequested && !reader.EndOfStream)
                        {
                            var line = reader.ReadLine();
                            if (string.IsNullOrWhiteSpace(line)) continue;
                            try
                            {
                                var parts = line.Split(',');
                                double ms = 0;
                                for (int i = parts.Length - 1; i >= 0; i--)
                                {
                                    if (double.TryParse(parts[i], System.Globalization.NumberStyles.Float, System.Globalization.CultureInfo.InvariantCulture, out ms))
                                    {
                                        break;
                                    }
                                }
                                if (ms > 0 && ms < 200)
                                {
                                    _ftQueue.Enqueue(ms);
                                    while (_ftQueue.Count > 240) { _ftQueue.TryDequeue(out _); }
                                }
                            }
                            catch { }
                        }
                        try { if (!p.HasExited) p.Kill(); } catch { }
                    }
                    catch { }
                }, token);
            }
            catch { }
        }

        private string? FindPresentMonExecutable()
        {
            try
            {
                var local = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "PresentMon.exe");
                if (System.IO.File.Exists(local)) return local;
                var prog = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles);
                var intelPath = System.IO.Path.Combine(prog, "Intel", "PresentMon", "PresentMon.exe");
                if (System.IO.File.Exists(intelPath)) return intelPath;
            }
            catch { }
            return null;
        }

        public IReadOnlyList<Sample> GetSamplesSnapshot()
        {
            try
            {
                lock (_samplesLock)
                {
                    return _samples.ToList();
                }
            }
            catch { return Array.Empty<Sample>(); }
        }
        
        public void Dispose()
        {
            Stop();
            (_thermalMonitor as IDisposable)?.Dispose();
        }
    }
}