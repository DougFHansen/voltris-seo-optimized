using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Management;
using System.Net.NetworkInformation;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Gamer.AIAutoFixer.Interfaces;
using VoltrisOptimizer.Services.Gamer.AIAutoFixer.Models;

namespace VoltrisOptimizer.Services.Gamer.AIAutoFixer.Implementation
{
    /// <summary>
    /// Coletor de telemetria em tempo real
    /// </summary>
    public class TelemetryCollector : ITelemetryCollector
    {
        private readonly Process _currentProcess;
        private readonly PerformanceCounter? _cpuCounter;
        private readonly PerformanceCounter? _ramCounter;
        private readonly PerformanceCounter? _diskReadCounter;
        private readonly PerformanceCounter? _diskWriteCounter;
        private readonly Queue<TelemetrySnapshot> _history = new Queue<TelemetrySnapshot>();
        private readonly int _maxHistorySize = 1000;

        private CancellationTokenSource? _collectionCts;
        private Task? _collectionTask;
        private TelemetrySnapshot? _currentSnapshot;
        private readonly object _lock = new object();

        public bool IsCollecting { get; private set; }

        public event EventHandler<TelemetrySnapshot>? DataCollected;

        public TelemetryCollector()
        {
            _currentProcess = Process.GetCurrentProcess();

            try
            {
                _cpuCounter = new PerformanceCounter("Process", "% Processor Time", _currentProcess.ProcessName, true);
                _ramCounter = new PerformanceCounter("Process", "Working Set", _currentProcess.ProcessName, true);
                _diskReadCounter = new PerformanceCounter("PhysicalDisk", "Disk Read Bytes/sec", "_Total", true);
                _diskWriteCounter = new PerformanceCounter("PhysicalDisk", "Disk Write Bytes/sec", "_Total", true);
            }
            catch
            {
                // Performance counters podem não estar disponíveis
            }
        }

        public async Task StartAsync(CancellationToken cancellationToken = default)
        {
            lock (_lock)
            {
                if (IsCollecting)
                    return;

                IsCollecting = true;
                _collectionCts = CancellationTokenSource.CreateLinkedTokenSource(cancellationToken);
                _collectionTask = Task.Run(() => CollectionLoopAsync(_collectionCts.Token), _collectionCts.Token);
            }

            await Task.CompletedTask;
        }

        public async Task StopAsync()
        {
            lock (_lock)
            {
                if (!IsCollecting)
                    return;

                IsCollecting = false;
                _collectionCts?.Cancel();
            }

            if (_collectionTask != null)
            {
                try
                {
                    await _collectionTask;
                }
                catch (OperationCanceledException) { }
            }

            _collectionCts?.Dispose();
            _collectionCts = null;
        }

        public TelemetrySnapshot GetCurrentSnapshot()
        {
            lock (_lock)
            {
                return _currentSnapshot ?? new TelemetrySnapshot();
            }
        }

        public System.Collections.Generic.IReadOnlyList<TelemetrySnapshot> GetHistory(int maxItems = 100)
        {
            lock (_lock)
            {
                return _history.TakeLast(maxItems).ToList();
            }
        }

        private async Task CollectionLoopAsync(CancellationToken cancellationToken)
        {
            var frameTimeHistory = new Queue<double>();
            const int frameTimeHistorySize = 60; // 1 segundo a 60fps

            while (!cancellationToken.IsCancellationRequested && IsCollecting)
            {
                try
                {
                    var snapshot = await CollectSnapshotAsync(frameTimeHistory, frameTimeHistorySize);
                    
                    lock (_lock)
                    {
                        _currentSnapshot = snapshot;
                        _history.Enqueue(snapshot);
                        while (_history.Count > _maxHistorySize)
                        {
                            _history.Dequeue();
                        }
                    }

                    DataCollected?.Invoke(this, snapshot);

                    // Coletar a cada 500ms para não sobrecarregar
                    await Task.Delay(500, cancellationToken);
                }
                catch (OperationCanceledException)
                {
                    break;
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"[TelemetryCollector] Erro na coleta: {ex.Message}");
                    await Task.Delay(1000, cancellationToken);
                }
            }
        }

        private async Task<TelemetrySnapshot> CollectSnapshotAsync(Queue<double> frameTimeHistory, int historySize)
        {
            var snapshot = new TelemetrySnapshot();

            // Coletar dados básicos do processo
            try
            {
                snapshot.VoltrisCpuUsagePercent = _cpuCounter?.NextValue() / Environment.ProcessorCount ?? 0;
                snapshot.VoltrisMemoryUsageMb = _ramCounter?.NextValue() / 1024.0 / 1024.0 ?? _currentProcess.WorkingSet64 / 1024.0 / 1024.0;
            }
            catch { }

            // Coletar dados do sistema (CPU, RAM, GPU via WMI)
            await CollectSystemMetricsAsync(snapshot);

            // Coletar dados de rede
            await CollectNetworkMetricsAsync(snapshot);

            // Coletar dados de disco
            await CollectDiskMetricsAsync(snapshot);

            // Coletar processos problemáticos
            await CollectProcessInfoAsync(snapshot);

            // Coletar DPC latency (simplificado)
            await CollectDpcLatencyAsync(snapshot);

            // Calcular stutter baseado em frame time
            CalculateStutter(snapshot, frameTimeHistory, historySize);

            return snapshot;
        }

        private async Task CollectSystemMetricsAsync(TelemetrySnapshot snapshot)
        {
            await Task.Run(() =>
            {
                try
                {
                    // CPU Usage via Performance Counter
                    using var cpuCounter = new PerformanceCounter("Processor", "% Processor Time", "_Total", true);
                    snapshot.CpuUsagePercent = cpuCounter.NextValue();

                    // RAM Usage via WMI
                    try
                    {
                        using var ramSearcher = new ManagementObjectSearcher("SELECT TotalPhysicalMemory, FreePhysicalMemory FROM Win32_OperatingSystem");
                        foreach (ManagementObject obj in ramSearcher.Get())
                        {
                            var totalRam = Convert.ToDouble(obj["TotalPhysicalMemory"]) / 1024.0 / 1024.0;
                            var freeRam = Convert.ToDouble(obj["FreePhysicalMemory"]) / 1024.0;
                            snapshot.RamUsagePercent = ((totalRam - freeRam) / totalRam) * 100;
                            break;
                        }
                    }
                    catch { }

                    // Temperaturas via WMI (se disponível)
                    try
                    {
                        using var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_TemperatureProbe");
                        foreach (ManagementObject obj in searcher.Get())
                        {
                            var temp = Convert.ToDouble(obj["CurrentReading"]);
                            if (temp > 0 && temp < 150) // Valores razoáveis
                            {
                                if (snapshot.CpuTemperature == 0)
                                    snapshot.CpuTemperature = temp;
                                else if (snapshot.GpuTemperature == 0)
                                    snapshot.GpuTemperature = temp;
                            }
                        }
                    }
                    catch { }
                }
                catch { }
            });
        }

        private async Task CollectNetworkMetricsAsync(TelemetrySnapshot snapshot)
        {
            await Task.Run(() =>
            {
                try
                {
                    var ping = new Ping();
                    var reply = ping.Send("8.8.8.8", 1000);
                    if (reply != null && reply.Status == IPStatus.Success)
                    {
                        snapshot.NetworkLatencyMs = reply.RoundtripTime;
                    }
                }
                catch { }
            });
        }

        private async Task CollectDiskMetricsAsync(TelemetrySnapshot snapshot)
        {
            await Task.Run(() =>
            {
                try
                {
                    if (_diskReadCounter != null)
                        snapshot.DiskReadMbPerSec = _diskReadCounter.NextValue() / 1024.0 / 1024.0;
                    if (_diskWriteCounter != null)
                        snapshot.DiskWriteMbPerSec = _diskWriteCounter.NextValue() / 1024.0 / 1024.0;

                    snapshot.HasExcessiveDiskIo = snapshot.DiskReadMbPerSec > 50 || snapshot.DiskWriteMbPerSec > 30;
                }
                catch { }
            });
        }

        private async Task CollectProcessInfoAsync(TelemetrySnapshot snapshot)
        {
            await Task.Run(() =>
            {
                try
                {
                    var processes = Process.GetProcesses();
                    snapshot.ActiveProcessCount = processes.Length;

                    // Identificar processos problemáticos (alto uso de CPU)
                    foreach (var proc in processes.Take(20)) // Limitar para performance
                    {
                        try
                        {
                            if (proc.Id == _currentProcess.Id) continue;

                            var cpu = proc.TotalProcessorTime.TotalMilliseconds;
                            if (cpu > 100) // Processo usando CPU significativamente
                            {
                                snapshot.ProblematicProcesses.Add(new ProcessInfo
                                {
                                    Name = proc.ProcessName,
                                    ProcessId = proc.Id,
                                    CpuUsagePercent = cpu / 10, // Aproximação
                                    MemoryUsageMb = proc.WorkingSet64 / 1024.0 / 1024.0,
                                    Priority = (int)proc.PriorityClass,
                                    IsCausingIssues = true,
                                    IssueDescription = "Alto uso de CPU"
                                });
                            }
                        }
                        catch { }
                    }
                }
                catch { }
            });
        }

        private async Task CollectDpcLatencyAsync(TelemetrySnapshot snapshot)
        {
            await Task.Run(() =>
            {
                // DPC Latency é complexo de medir diretamente
                // Usar aproximação baseada em kernel time
                try
                {
                    using var kernelCounter = new PerformanceCounter("Processor", "% Privileged Time", "_Total", true);
                    snapshot.KernelTimePercent = kernelCounter.NextValue();
                    snapshot.HasKernelTimeSpikes = snapshot.KernelTimePercent > 20;
                    snapshot.DpcLatencyUs = snapshot.KernelTimePercent * 10; // Aproximação
                    snapshot.HasDpcSpikes = snapshot.KernelTimePercent > 15;
                }
                catch { }
            });
        }

        private void CalculateStutter(TelemetrySnapshot snapshot, Queue<double> frameTimeHistory, int historySize)
        {
            // Adicionar frame time atual (simulado - em produção viria do jogo)
            var currentFrameTime = snapshot.FrameTimeMs > 0 ? snapshot.FrameTimeMs : 16.67;
            frameTimeHistory.Enqueue(currentFrameTime);
            while (frameTimeHistory.Count > historySize)
            {
                frameTimeHistory.Dequeue();
            }

            if (frameTimeHistory.Count >= 10)
            {
                var frameTimes = frameTimeHistory.ToList();
                var avg = frameTimes.Average();
                var stdDev = Math.Sqrt(frameTimes.Sum(x => Math.Pow(x - avg, 2)) / frameTimes.Count);
                
                snapshot.AverageFrameTimeMs = avg;
                snapshot.FrameTimeStdDev = stdDev;

                // Detectar stutter: desvio padrão alto indica frame time instável
                snapshot.HasStutter = stdDev > 2.0;
                snapshot.StutterSeverity = Math.Min(1.0, stdDev / 10.0);

                if (snapshot.HasStutter)
                {
                    snapshot.StutterEvents.Add(new StutterEvent
                    {
                        Timestamp = DateTime.Now,
                        FrameTimeMs = currentFrameTime,
                        Severity = snapshot.StutterSeverity,
                        ProbableCause = snapshot.KernelTimePercent > 15 ? "Kernel time spike" : "Frame time instability"
                    });
                }
            }
        }

        public void Dispose()
        {
            StopAsync().Wait(5000);
            _cpuCounter?.Dispose();
            _ramCounter?.Dispose();
            _diskReadCounter?.Dispose();
            _diskWriteCounter?.Dispose();
        }
    }
}

