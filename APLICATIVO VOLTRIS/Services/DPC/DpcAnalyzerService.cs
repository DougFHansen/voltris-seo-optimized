using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Management;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace VoltrisOptimizer.Services.DPC
{
    public record DpcSample(DateTime Timestamp, float DpcPercent, float[] PerCoreDpcPercent);
    public record DpcStats(double Avg, double P95, double P99, int SpikeCount);
    public record DpcSpike(DateTime Timestamp, float Value, string? Driver, string? ProcessName);
    public class DpcAnalysisResult
    {
        public DpcStats Stats { get; set; } = new DpcStats(0,0,0,0);
        public List<DpcSpike> Spikes { get; set; } = new List<DpcSpike>();
        public string Recommendation { get; set; } = "";
    }
    public class RepairPlan
    {
        public List<string> Actions { get; } = new List<string>();
        public static RepairPlan Generate(DpcAnalysisResult result)
        {
            var plan = new RepairPlan();
            var top = result.Spikes.GroupBy(s => s.Driver).OrderByDescending(g => g.Count()).FirstOrDefault();
            if (top != null && !string.IsNullOrEmpty(top.Key)) plan.Actions.Add($"Atualizar {top.Key}");
            var proc = result.Spikes.GroupBy(s => s.ProcessName).OrderByDescending(g => g.Count()).FirstOrDefault();
            if (proc != null && !string.IsNullOrEmpty(proc.Key)) plan.Actions.Add($"Isolar {proc.Key}");
            if (result.Stats.P99 > 20) plan.Actions.Add("Reverter último driver problemático");
            return plan;
        }
    }
    public interface IDpcAnalyzerService
    {
        void Start();
        void Stop();
        DpcAnalysisResult GetLatestAnalysis();
        Task<string> CreateSupportPackAsync();
        event Action<DpcSample>? SampleReceived;
    }
    public class DpcAnalyzerService : IDpcAnalyzerService, IDisposable
    {
        private readonly ILoggingService _logger;
        private Timer? _timer;
        private readonly List<DpcSample> _samples = new List<DpcSample>();
        private readonly object _lock = new object();
        private PerformanceCounter? _dpcTotal;
        private List<PerformanceCounter>? _dpcPerCore;
        private readonly string _logDir;
        public event Action<DpcSample>? SampleReceived;
        public DpcAnalyzerService(ILoggingService logger)
        {
            _logger = logger;
            var appData = Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData);
            _logDir = Path.Combine(appData, "Voltris", "logs", "dpc");
            Directory.CreateDirectory(_logDir);
            try
            {
                _dpcTotal = new PerformanceCounter("Processor", "% DPC Time", "_Total", true);
                var cpuCount = Environment.ProcessorCount;
                _dpcPerCore = Enumerable.Range(0, cpuCount).Select(i => new PerformanceCounter("Processor", "% DPC Time", i.ToString(), true)).ToList();
            }
            catch { }
        }
        public void Start()
        {
            _timer = new Timer(Collect, null, 0, 500);
            _logger.LogInfo("[DPC] Monitor iniciado");
        }
        public void Stop()
        {
            _timer?.Dispose();
            _timer = null;
            _logger.LogInfo("[DPC] Monitor parado");
        }
        private void Collect(object? state)
        {
            try
            {
                var total = _dpcTotal != null ? _dpcTotal.NextValue() : 0f;
                var cores = _dpcPerCore != null ? _dpcPerCore.Select(pc => pc.NextValue()).ToArray() : Array.Empty<float>();
                var sample = new DpcSample(DateTime.UtcNow, total, cores);
                lock (_lock)
                {
                    _samples.Add(sample);
                    if (_samples.Count > 2000) _samples.RemoveRange(0, _samples.Count - 2000);
                }
                SampleReceived?.Invoke(sample);
            }
            catch { }
        }
        public DpcAnalysisResult GetLatestAnalysis()
        {
            List<float> vals;
            lock (_lock) vals = _samples.Select(s => s.DpcPercent).ToList();
            if (vals.Count == 0) return new DpcAnalysisResult();
            var avg = vals.Average();
            var p95 = Percentile(vals, 95);
            var p99 = Percentile(vals, 99);
            var threshold = Math.Max(20f, (float)(avg * 3));
            var spikes = DetectSpikes(threshold);
            var rec = Recommendation(avg, p95, p99, spikes);
            return new DpcAnalysisResult { Stats = new DpcStats(avg, p95, p99, spikes.Count), Spikes = spikes, Recommendation = rec };
        }
        private static double Percentile(List<float> vals, int p)
        {
            var sorted = vals.Select(v => (double)v).OrderBy(v => v).ToArray();
            if (sorted.Length == 0) return 0;
            var rank = (p / 100.0) * (sorted.Length - 1);
            var lower = (int)Math.Floor(rank);
            var upper = (int)Math.Ceiling(rank);
            if (lower == upper) return sorted[lower];
            var w = rank - lower;
            return sorted[lower] * (1 - w) + sorted[upper] * w;
        }
        private List<DpcSpike> DetectSpikes(float threshold)
        {
            List<DpcSample> snap;
            lock (_lock) snap = _samples.ToList();
            var result = new List<DpcSpike>();
            foreach (var s in snap)
            {
                if (s.DpcPercent >= threshold)
                {
                    var assoc = FindDriversProcesses();
                    result.Add(new DpcSpike(s.Timestamp, s.DpcPercent, assoc.driver, assoc.process));
                }
            }
            return result;
        }
        private (string? driver, string? process) FindDriversProcesses()
        {
            try
            {
                using var search = new ManagementObjectSearcher("SELECT DeviceName, DriverVersion, Manufacturer FROM Win32_PnPSignedDriver");
                var d = search.Get().Cast<ManagementObject>().FirstOrDefault();
                var drv = d != null ? Convert.ToString(d["DeviceName"]) : null;
                var proc = Process.GetProcesses().OrderByDescending(p => SafeCpu(p)).FirstOrDefault();
                return (drv, proc?.ProcessName);
            }
            catch { return (null, null); }
        }
        private static double SafeCpu(Process p)
        {
            try { return p.TotalProcessorTime.TotalMilliseconds; } catch { return 0; }
        }
        private string Recommendation(double avg, double p95, double p99, List<DpcSpike> spikes)
        {
            if (p99 > 20 || spikes.Count > 5)
            {
                var topDrv = spikes.Where(s => !string.IsNullOrEmpty(s.Driver)).GroupBy(s => s.Driver!).OrderByDescending(g => g.Count()).FirstOrDefault()?.Key;
                if (!string.IsNullOrEmpty(topDrv)) return $"Atualizar {topDrv}";
                return "Atualizar drivers críticos e isolar processos com alto impacto";
            }
            if (p95 > 10) return "Verificar versões de drivers e reduzir carga de background";
            return "DPC saudável";
        }
        public async Task<string> CreateSupportPackAsync()
        {
            var packDir = Path.Combine(_logDir, "pack_" + DateTime.UtcNow.ToString("yyyyMMdd_HHmmss"));
            Directory.CreateDirectory(packDir);
            var meta = new Dictionary<string, object>();
            meta["windows_build"] = Environment.OSVersion.VersionString;
            try
            {
                using var search = new ManagementObjectSearcher("SELECT DeviceID, DriverVersion, Manufacturer FROM Win32_PnPSignedDriver");
                var list = search.Get().Cast<ManagementObject>().Select(m => new { DeviceID = Convert.ToString(m["DeviceID"]), DriverVersion = Convert.ToString(m["DriverVersion"]), Manufacturer = Convert.ToString(m["Manufacturer"]) }).ToList();
                meta["drivers"] = list;
            }
            catch { }
            var samplesFile = Path.Combine(packDir, "dpc_samples.json");
            List<DpcSample> snap;
            lock (_lock) snap = _samples.ToList();
            await File.WriteAllTextAsync(samplesFile, JsonSerializer.Serialize(snap));
            var metaFile = Path.Combine(packDir, "meta.json");
            await File.WriteAllTextAsync(metaFile, JsonSerializer.Serialize(meta));
            return packDir;
        }
        public void Dispose()
        {
            _timer?.Dispose();
            _dpcTotal?.Dispose();
            if (_dpcPerCore != null) foreach (var pc in _dpcPerCore) pc.Dispose();
        }
    }
}
