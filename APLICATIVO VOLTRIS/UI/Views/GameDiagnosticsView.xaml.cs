using System;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Shapes;
using VoltrisOptimizer.Services;
using MediaColor = System.Windows.Media.Color;

namespace VoltrisOptimizer.UI.Views
{
    public partial class GameDiagnosticsView : UserControl
    {
        private readonly GameDiagnosticsService _svc;

        public GameDiagnosticsView()
        {
            InitializeComponent();
            _svc = (App.Services?.GetService(typeof(GameDiagnosticsService)) as GameDiagnosticsService) ?? new GameDiagnosticsService();
            Loaded += GameDiagnosticsView_Loaded;
            Unloaded += GameDiagnosticsView_Unloaded;
        }

        private void GameDiagnosticsView_Loaded(object sender, RoutedEventArgs e)
        {
            try
            {
                _svc.SamplesUpdated += OnSamples;
                _svc.Start();
            }
            catch { }
        }

        private void GameDiagnosticsView_Unloaded(object sender, RoutedEventArgs e)
        {
            try
            {
                _svc.SamplesUpdated -= OnSamples;
                _svc.Stop();
            }
            catch { }
        }

        private void OnSamples(System.Collections.Generic.IReadOnlyList<GameDiagnosticsService.Sample> samples)
        {
            try
            {
                var last = samples.Count > 0 ? samples[^1] : null;
                if (last != null)
                {
                    Dispatcher.Invoke(() =>
                    {
                        // Atualizar informações da CPU com temperatura
                        string cpuThermalStatus = last.CpuThrottling ? " 🔥 THROTTLE" : "";
                        CpuInfoText.Text = $"CPU {last.CpuPercent:F0}% | Q {last.CpuQueue:F1} | {last.CpuCurrentMhz:F0}/{last.CpuMaxMhz:F0} MHz | DPC {last.CpuDpcPercent:F1}% | INT {last.CpuInterruptPercent:F1}% | TEMP {last.CpuTemperature:F0}°C{cpuThermalStatus}";
                        
                        // Atualizar informações da GPU com temperatura
                        string gpuThermalStatus = last.GpuThrottling ? " 🔥 THROTTLE" : "";
                        GpuInfoText.Text = last.GpuUtilPercent >= 0 ? 
                            $"GPU {last.GpuUtilPercent:F0}% | VRAM {last.GpuVramUsedMb:F0} MB | TEMP {last.GpuTemperature:F0}°C{gpuThermalStatus}" : 
                            "GPU sem counters";
                            
                        FpsText.Text = last.Fps > 0 ? $"FPS {last.Fps:F0}" : "FPS N/D";
                        RamInfoText.Text = $"RAM {last.RamUsedGb:F1}/{last.RamTotalGb:F1} GB | PF {last.RamPageFaultsPerSec:F0}/s";
                        DiskInfoText.Text = $"R {last.DiskReadsPerSec:F0}/s • W {last.DiskWritesPerSec:F0}/s | Q {last.DiskQueueLen:F2} | Lat {last.DiskLatencySec * 1000:F0} ms";
                        PowerInfoText.Text = last.CpuMaxMhz > 0 ? $"Clock {last.CpuCurrentMhz:F0}/{last.CpuMaxMhz:F0} MHz" : "Clock N/D";
                        
                        // Atualizar informações de temperatura combinadas com indicadores visuais
                        string overallThermalStatus = (last.CpuThrottling || last.GpuThrottling) ? "🔥 THROTTLE ATIVO" : ".NORMAL";
                        TemperatureInfoText.Text = $"Status: {overallThermalStatus}";
                        
                        // Atualizar textos individuais de temperatura
                        if (CpuTempText != null)
                        {
                            CpuTempText.Text = $"CPU: {last.CpuTemperature:F0}°C";
                            // Cor dinâmica baseada na temperatura
                            if (last.CpuTemperature >= 85)
                                CpuTempText.Foreground = new SolidColorBrush(Color.FromRgb(239, 68, 68)); // Vermelho
                            else if (last.CpuTemperature >= 70)
                                CpuTempText.Foreground = new SolidColorBrush(Color.FromRgb(245, 158, 11)); // Laranja
                            else
                                CpuTempText.Foreground = new SolidColorBrush(Color.FromRgb(34, 197, 94)); // Verde
                        }
                        
                        if (GpuTempText != null)
                        {
                            GpuTempText.Text = $"GPU: {last.GpuTemperature:F0}°C";
                            // Cor dinâmica baseada na temperatura
                            if (last.GpuTemperature >= 80)
                                GpuTempText.Foreground = new SolidColorBrush(Color.FromRgb(239, 68, 68)); // Vermelho
                            else if (last.GpuTemperature >= 70)
                                GpuTempText.Foreground = new SolidColorBrush(Color.FromRgb(245, 158, 11)); // Laranja
                            else
                                GpuTempText.Foreground = new SolidColorBrush(Color.FromRgb(34, 197, 94)); // Verde
                        }
                        
                        // Atualizar indicadores visuais
                        if (CpuTempIndicator != null)
                        {
                            if (last.CpuTemperature >= 85)
                                CpuTempIndicator.Background = new SolidColorBrush(Color.FromRgb(239, 68, 68));
                            else if (last.CpuTemperature >= 70)
                                CpuTempIndicator.Background = new SolidColorBrush(Color.FromRgb(245, 158, 11));
                            else
                                CpuTempIndicator.Background = new SolidColorBrush(Color.FromRgb(34, 197, 94));
                        }
                        
                        if (GpuTempIndicator != null)
                        {
                            if (last.GpuTemperature >= 80)
                                GpuTempIndicator.Background = new SolidColorBrush(Color.FromRgb(239, 68, 68));
                            else if (last.GpuTemperature >= 70)
                                GpuTempIndicator.Background = new SolidColorBrush(Color.FromRgb(245, 158, 11));
                            else
                                GpuTempIndicator.Background = new SolidColorBrush(Color.FromRgb(34, 197, 94));
                        }
                        
                        CauseText.Text = string.IsNullOrWhiteSpace(last.Cause) ? "Indefinido" : last.Cause;
                        AnalysisText.Text = BuildAnalysis(last);
                        DrawSpark(CpuGraph, samples.Select(s => s.CpuPercent).ToArray());
                        DrawSpark(GpuGraph, samples.Select(s => Math.Max(0, s.GpuUtilPercent)).ToArray());
                        DrawSpark(FpsGraph, samples.Select(s => Math.Max(0, s.Fps)).ToArray());
                        DrawSpark(RamGraph, samples.Select(s => s.RamUsedGb).ToArray());
                        DrawSpark(DiskGraph, samples.Select(s => s.DiskLatencySec * 1000).ToArray());
                        DrawSpark(PowerGraph, samples.Select(s => s.CpuCurrentMhz).ToArray());
                        
                        // Desenhar gráfico de temperatura
                        DrawSpark(TemperatureGraph, samples.Select(s => Math.Max(s.CpuTemperature, s.GpuTemperature)).ToArray());
                        
                        UpdateIncidentsList();
                    });
                }
            }
            catch { }
        }

        private string BuildAnalysis(GameDiagnosticsService.Sample s)
        {
            try
            {
                if (s.Cause == "CPU/Scheduling") return "Queda por saturação de CPU e fila de threads. Reduza processos em background e ajuste afinidade.";
                if (s.Cause == "Drivers/DPC/Interrupt") return "Travadas por DPC/Interrupts. Atualize drivers de rede/áudio/GPU e desative dispositivos ruidosos.";
                if (s.Cause == "Memória/Paging") return "Falta de RAM disponível levando a paginação. Feche apps pesados e aumente RAM.";
                if (s.Cause == "Disco/IO") return "Fila/latência de disco alta. Verifique SSD, modo NVMe, drivers e I/O em segundo plano.";
                if (s.Cause == "GPU/Render") return "GPU limitando o render. Reduza presets/RT, atualize drivers, ajuste DLSS/FSR.";
                if (s.Cause == "Energia/Throttling") 
                {
                    // Verificar se é throttling térmico específico
                    if (s.CpuThrottling || s.GpuThrottling)
                    {
                        string thermalMsg = "Throttling térmico detectado: ";
                        if (s.CpuThrottling) thermalMsg += $"CPU a {s.CpuTemperature:F0}°C. ";
                        if (s.GpuThrottling) thermalMsg += $"GPU a {s.GpuTemperature:F0}°C. ";
                        thermalMsg += "Verifique o sistema de refrigeração e limpeza de poeira.";
                        return thermalMsg;
                    }
                    return "Limite térmico/energético detectado. Ajuste plano de energia, resfriamento e TDP.";
                }
            }
            catch { }
            return "Sem causa definida. Continue jogando para coleta e correlação.";
        }

        private void DrawSpark(Canvas canvas, double[] values)
        {
            try
            {
                if (canvas == null || values == null || values.Length < 2) return;
                canvas.Children.Clear();
                var w = canvas.ActualWidth > 0 ? canvas.ActualWidth : canvas.Width;
                var h = canvas.ActualHeight > 0 ? canvas.ActualHeight : canvas.Height;
                if (w <= 0 || h <= 0) { w = 300; h = 100; }
                var max = values.Max();
                var min = values.Min();
                if (Math.Abs(max - min) < 1e-6) max = min + 1;
                var pl = new Polyline { Stroke = (Brush)Application.Current.FindResource("AccentBrush"), StrokeThickness = 2 };
                int n = values.Length;
                for (int i = 0; i < n; i++)
                {
                    var x = (w - 4) * i / (double)(n - 1) + 2;
                    var norm = (values[i] - min) / (max - min);
                    var y = h - 2 - norm * (h - 4);
                    pl.Points.Add(new System.Windows.Point(x, y));
                }
                canvas.Children.Add(pl);
            }
            catch { }
        }

        private void UpdateIncidentsList()
        {
            try
            {
                var svc = VoltrisOptimizer.App.GamerOptimizer;
                if (svc == null || IncidentsList == null) return;
                var items = svc.GetRecentStutterIncidents()
                    .Select(i => $"{i.Timestamp.ToLocalTime():HH:mm:ss} • {i.Cause} | CPU {i.TotalCpu:F0}% | Q {i.QueueLength:F1} | DPC {i.DpcPercent:F1}% | PF {i.PageFaultsPerSec:F0}/s | DiskQ {i.DiskQueue:F2} | FTj {i.FrameJitterMs:F1}ms | Netj {i.NetworkJitterMs:F1}ms")
                    .ToArray();
                IncidentsList.ItemsSource = items;
            }
            catch { }
        }

        private void ExportCsvButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var dir = System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                System.IO.Directory.CreateDirectory(dir);
                var path = System.IO.Path.Combine(dir, $"diagnostics_{DateTime.Now:yyyyMMdd_HHmmss}.csv");
                using var sw = new System.IO.StreamWriter(path);
                sw.WriteLine("time,cpu%,queue,currentMHz,maxMHz,dpc%,interrupt%,cpuTemp,cpuThrottle,gpu%,vramMB,gpuTemp,gpuThrottle,ramUsedGB,ramTotalGB,pageFaults,diskRps,diskWps,diskQueue,diskLatencySec,fps,cause");
                var svc = _svc;
                var samples = typeof(GameDiagnosticsService)
                    .GetField("_samples", System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance)?
                    .GetValue(svc) as System.Collections.Generic.List<GameDiagnosticsService.Sample>;
                if (samples != null)
                {
                    foreach (var s in samples)
                    {
                        sw.WriteLine($"{s.T:o},{s.CpuPercent:F2},{s.CpuQueue:F2},{s.CpuCurrentMhz:F0},{s.CpuMaxMhz:F0},{s.CpuDpcPercent:F2},{s.CpuInterruptPercent:F2},{s.CpuTemperature:F1},{s.CpuThrottling},{s.GpuUtilPercent:F2},{s.GpuVramUsedMb:F0},{s.GpuTemperature:F1},{s.GpuThrottling},{s.RamUsedGb:F2},{s.RamTotalGb:F2},{s.RamPageFaultsPerSec:F0},{s.DiskReadsPerSec:F0},{s.DiskWritesPerSec:F0},{s.DiskQueueLen:F2},{s.DiskLatencySec:F4},{s.Fps:F0},{s.Cause}");
                    }
                }
                VoltrisOptimizer.UI.Controls.ModernMessageBox.Show($"Exportado para\n{path}", "Exportar CSV", MessageBoxButton.OK, MessageBoxImage.Information);
            }
            catch (Exception ex)
            {
                VoltrisOptimizer.UI.Controls.ModernMessageBox.Show($"Erro ao exportar: {ex.Message}", "Exportar CSV", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }
}