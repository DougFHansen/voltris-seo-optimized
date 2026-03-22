using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Management;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Gamer.GamerModeManager;
using VoltrisOptimizer.Helpers;

namespace VoltrisOptimizer.Services
{
    public class GameDiagnosticsService
    {
        public class ProcessInfo
        {
            public string Name { get; set; } = "";
            public double CpuPercent { get; set; }
            public long RamBytes { get; set; }
            public int Pid { get; set; }
        }

        public class Sample
        {
            public DateTime T { get; set; }
            public double CpuPercent { get; set; }
            public double CpuQueue { get; set; }
            public double CpuCurrentMhz { get; set; }
            public double CpuMaxMhz { get; set; }
            public double CpuDpcPercent { get; set; }
            public double CpuInterruptPercent { get; set; }
            public double CpuTemperature { get; set; }
            public bool CpuThrottling { get; set; }
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
            public double GpuTemperature { get; set; }
            public bool GpuThrottling { get; set; }
            public double NetJitterMs { get; set; }
            public double Fps { get; set; }
            public string Cause { get; set; } = "";
            public List<ProcessInfo> TopProcesses { get; set; } = new();
        }

        public event Action<IReadOnlyList<Sample>>? SamplesUpdated;

        private readonly List<Sample> _samples = new List<Sample>(600);
        private readonly object _samplesLock = new object();
        private CancellationTokenSource? _cts;
        private Task? _pmTask;
        private readonly System.Collections.Concurrent.ConcurrentQueue<double> _ftQueue = new System.Collections.Concurrent.ConcurrentQueue<double>();
        
        // Campos para monitoramento térmico
        private readonly IThermalMonitorService _thermalMonitor;
        
        // Métricas nativas para alta precisão e baixo overhead
        private readonly NativeSystemMetrics _nativeMetrics = new();
        
        // Serviço de persistência (SaaS)
        private readonly DiagnosticPersistenceService _persistence;
        
        public GameDiagnosticsService()
        {
            _thermalMonitor = new ThermalMonitorService(new LoggingService(System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs")));
            _persistence = new DiagnosticPersistenceService();
        }
        
        public void Start(string? gameName = null)
        {
            Stop();
            _cts = new CancellationTokenSource();
            var token = _cts.Token;
            
            // Iniciar sessão de diagnóstico
            _persistence.StartSession(gameName);
            
            Task.Run(() => RunLoop(token), token);
            TryStartPresentMon(token);
        }

        public void Stop()
        {
            try { _cts?.Cancel(); } catch { }
            _cts = null;
            try { _pmTask?.Dispose(); } catch { }
            _pmTask = null;
            
            // Finalizar sessão de diagnóstico
            try { _persistence?.EndSession(); } catch { }
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
            PerformanceCounter? ramAvailCombined = null;
            double maxMhz = 0;
            double totalRamGb = 0;
            double vramTot = 0;
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
                
                // Usar NativeSystemMetrics para RAM total (mais confiável que WMI)
                var memInfo = _nativeMetrics.GetMemoryUsage();
                totalRamGb = memInfo.TotalGb;

                try
                {
                    using var s = new ManagementObjectSearcher("SELECT AdapterRAM FROM Win32_VideoController");
                    foreach (ManagementObject o in s.Get()) 
                    { 
                        long.TryParse(o["AdapterRAM"]?.ToString() ?? "0", out var vram);
                        // AdapterRAM retorna valor em bytes, mas às vezes negativo se > 2GB (unsigned/signed bug em algumas versões do WMI)
                        double vramMb = (uint)vram / (1024.0 * 1024.0);
                        if (vramMb > vramTot) vramTot = vramMb;
                    }
                }
                catch { vramTot = 0; }

            }
            catch { }

            int loopCount = 0;
            while (!token.IsCancellationRequested)
            {
                loopCount++;
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
                        }
                    }
                    catch { vram = -1; }
                    // Coleta de frequência CPU (Otimizada: a cada ~6 segundos via loopCount)
                    double curMhz = _samples.Count > 0 ? _samples[^1].CpuCurrentMhz : 0;
                    if (loopCount % 8 == 0) // aprox 6s (750ms * 8)
                    {
                        try
                        {
                            using var s = new ManagementObjectSearcher("SELECT CurrentClockSpeed FROM Win32_Processor");
                            foreach (ManagementObject o in s.Get()) { curMhz = Convert.ToDouble(o["CurrentClockSpeed"] ?? 0); break; }
                        }
                        catch { }
                    }

                    // Usar NativeSystemMetrics para RAM em tempo real
                    var mem = _nativeMetrics.GetMemoryUsage();
                    double usedGb = mem.UsedGb;
                    totalRamGb = mem.TotalGb; // Atualizar caso tenha mudado (raro, mas possível em VMs)
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

                    // Coleta de Top Processos (Otimizada: a cada ~3 segundos para economizar CPU)
                    var topProcs = new List<ProcessInfo>();
                    if (loopCount % 4 == 0) // aprox 3s (750ms * 4)
                    {
                        try
                        {
                            var allProcs = Process.GetProcesses();
                            topProcs = allProcs
                                .Where(p => p.Id != 0 && p.Id != 4)
                                .Select(p => {
                                    try {
                                        return new ProcessInfo {
                                            Name = p.ProcessName,
                                            Pid = p.Id,
                                            RamBytes = p.WorkingSet64
                                        };
                                    } catch { return null; }
                                })
                                .Where(p => p != null)
                                .OrderByDescending(p => p!.RamBytes)
                                .Take(5)
                                .ToList()!;
                        }
                        catch { }
                    }
                    else if (_samples.Count > 0)
                    {
                        topProcs = _samples[^1].TopProcesses;
                    }
                    
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
                        Cause = cause,
                        TopProcesses = topProcs
                    };
                    List<Sample> snapshot;
                    lock (_samplesLock)
                    {
                        _samples.Add(sample);
                        if (_samples.Count > 600) _samples.RemoveRange(0, _samples.Count - 600);
                        snapshot = _samples.ToList();
                    }
                    
                    // Adicionar à persistência (SaaS)
                    try { _persistence?.AddSample(sample); } catch { }
                    
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
                if (ramTotalGb > 1.0) // Garante que temos leitura válida de RAM total
                {
                    double ramUsagePercent = (ramUsedGb / ramTotalGb) * 100;
                    
                    // Só diagnosticar como causa raiz se RAM estiver REALMENTE alta (> 94%) 
                    // E houver muitos page faults (> 10000/s - soft faults são comuns)
                    if (ramUsagePercent > 94 && pf > 10000)
                    {
                        double memScore = (ramUsagePercent - 90) * 2 + (pf / 1000);
                        scores["Memória/Paging"] = memScore;
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
                // LEGACY KILL SWITCHED - TODO: Fetch PID from Orchestrator
                var pid = 0; // App.GamerOptimizer?.GetMonitoredGameProcessId() ?? 0;
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
        
        /// <summary>
        /// Obtém incidentes ativos detectados
        /// </summary>
        public List<DiagnosticIncident> GetActiveIncidents()
        {
            return _persistence?.GetActiveIncidents() ?? new List<DiagnosticIncident>();
        }
        
        /// <summary>
        /// Carrega sessões salvas anteriormente
        /// </summary>
        public List<DiagnosticSession> LoadSessions(int maxCount = 10)
        {
            return _persistence?.LoadSessions(maxCount) ?? new List<DiagnosticSession>();
        }
        
        /// <summary>
        /// Marca incidente como resolvido
        /// </summary>
        public void ResolveIncident(string incidentId)
        {
            _persistence?.ResolveIncident(incidentId);
        }
        
        /// <summary>
        /// Limpa todos os incidentes
        /// </summary>
        public void ClearIncidents()
        {
            _persistence?.ClearIncidents();
        }
        
        public void Dispose()
        {
            Stop();
            (_thermalMonitor as IDisposable)?.Dispose();
        }
    }
}