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
        private double _lastCpuTemp = 0;
        private double _lastGpuTemp = 0;

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
                
                // CORREÇÃO: Subscrever ao GlobalThermalMonitorService para temperaturas em tempo real
                if (App.ThermalMonitorService != null)
                {
                    App.ThermalMonitorService.MetricsUpdated += OnThermalMetricsUpdated;
                    App.LoggingService?.LogInfo("[GameDiagnosticsView] Subscrito ao GlobalThermalMonitorService");
                }
                else
                {
                    App.LoggingService?.LogWarning("[GameDiagnosticsView] ThermalMonitorService não disponível");
                }
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[GameDiagnosticsView] Erro ao carregar: {ex.Message}");
            }
        }

        private void GameDiagnosticsView_Unloaded(object sender, RoutedEventArgs e)
        {
            try
            {
                _svc.SamplesUpdated -= OnSamples;
                _svc.Stop();
                
                // CORREÇÃO: Desinscrever do GlobalThermalMonitorService
                if (App.ThermalMonitorService != null)
                {
                    App.ThermalMonitorService.MetricsUpdated -= OnThermalMetricsUpdated;
                }
            }
            catch { }
        }
        
        /// <summary>
        /// Callback para atualização de temperaturas em tempo real do GlobalThermalMonitorService
        /// </summary>
        private void OnThermalMetricsUpdated(object? sender, VoltrisOptimizer.Services.Thermal.Models.ThermalMetrics metrics)
        {
            try
            {
                Dispatcher.BeginInvoke(() =>
                {
                    // Atualizar cache de temperaturas
                    _lastCpuTemp = double.IsNaN(metrics.CpuTemperature) ? 0 : metrics.CpuTemperature;
                    _lastGpuTemp = double.IsNaN(metrics.GpuTemperature) ? 0 : metrics.GpuTemperature;
                    
                    // Atualizar UI de temperatura
                    UpdateTemperatureUI(_lastCpuTemp, _lastGpuTemp, metrics.CpuThrottling, metrics.GpuThrottling);
                });
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[GameDiagnosticsView] Erro ao atualizar temperatura: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Atualiza a UI de temperatura com as métricas mais recentes
        /// </summary>
        private void UpdateTemperatureUI(double cpuTemp, double gpuTemp, bool cpuThrottling, bool gpuThrottling)
        {
            try
            {
                // Atualizar status geral
                string overallThermalStatus = (cpuThrottling || gpuThrottling) ? "🔥 THROTTLE ATIVO" : "NORMAL";
                if (TemperatureInfoText != null)
                {
                    TemperatureInfoText.Text = $"Status: {overallThermalStatus}";
                }
                
                // Atualizar texto de CPU
                if (CpuTempText != null && cpuTemp > 0)
                {
                    CpuTempText.Text = $"CPU: {cpuTemp:F0}°C";
                    // Cor dinâmica baseada na temperatura
                    if (cpuTemp >= 85)
                        CpuTempText.Foreground = new SolidColorBrush(Color.FromRgb(239, 68, 68)); // Vermelho
                    else if (cpuTemp >= 70)
                        CpuTempText.Foreground = new SolidColorBrush(Color.FromRgb(245, 158, 11)); // Laranja
                    else
                        CpuTempText.Foreground = new SolidColorBrush(Color.FromRgb(34, 197, 94)); // Verde
                }
                
                // Atualizar texto de GPU
                if (GpuTempText != null && gpuTemp > 0)
                {
                    GpuTempText.Text = $"GPU: {gpuTemp:F0}°C";
                    // Cor dinâmica baseada na temperatura
                    if (gpuTemp >= 80)
                        GpuTempText.Foreground = new SolidColorBrush(Color.FromRgb(239, 68, 68)); // Vermelho
                    else if (gpuTemp >= 70)
                        GpuTempText.Foreground = new SolidColorBrush(Color.FromRgb(245, 158, 11)); // Laranja
                    else
                        GpuTempText.Foreground = new SolidColorBrush(Color.FromRgb(34, 197, 94)); // Verde
                }
                
                // Atualizar indicadores visuais
                if (CpuTempIndicator != null && cpuTemp > 0)
                {
                    if (cpuTemp >= 85)
                        CpuTempIndicator.Background = new SolidColorBrush(Color.FromRgb(239, 68, 68));
                    else if (cpuTemp >= 70)
                        CpuTempIndicator.Background = new SolidColorBrush(Color.FromRgb(245, 158, 11));
                    else
                        CpuTempIndicator.Background = new SolidColorBrush(Color.FromRgb(34, 197, 94));
                }
                
                if (GpuTempIndicator != null && gpuTemp > 0)
                {
                    if (gpuTemp >= 80)
                        GpuTempIndicator.Background = new SolidColorBrush(Color.FromRgb(239, 68, 68));
                    else if (gpuTemp >= 70)
                        GpuTempIndicator.Background = new SolidColorBrush(Color.FromRgb(245, 158, 11));
                    else
                        GpuTempIndicator.Background = new SolidColorBrush(Color.FromRgb(34, 197, 94));
                }
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
                    Dispatcher.BeginInvoke(() =>
                    {
                        // CORREÇÃO: Usar temperaturas do GlobalThermalMonitorService se disponíveis (mais precisas e em tempo real)
                        double cpuTemp = _lastCpuTemp > 0 ? _lastCpuTemp : last.CpuTemperature;
                        double gpuTemp = _lastGpuTemp > 0 ? _lastGpuTemp : last.GpuTemperature;
                        
                        // Atualizar informações da CPU com temperatura
                        string cpuThermalStatus = last.CpuThrottling ? " 🔥 THROTTLE" : "";
                        CpuInfoText.Text = $"CPU {last.CpuPercent:F0}% | Q {last.CpuQueue:F1} | {last.CpuCurrentMhz:F0}/{last.CpuMaxMhz:F0} MHz | DPC {last.CpuDpcPercent:F1}% | INT {last.CpuInterruptPercent:F1}% | TEMP {cpuTemp:F0}°C{cpuThermalStatus}";
                        
                        // Atualizar informações da GPU com temperatura
                        string gpuThermalStatus = last.GpuThrottling ? " 🔥 THROTTLE" : "";
                        GpuInfoText.Text = last.GpuUtilPercent >= 0 ? 
                            $"GPU {last.GpuUtilPercent:F0}% | VRAM {last.GpuVramUsedMb:F0} MB | TEMP {gpuTemp:F0}°C{gpuThermalStatus}" : 
                            "GPU sem counters";
                            
                        FpsText.Text = last.Fps > 0 ? $"FPS {last.Fps:F0}" : "FPS N/D";
                        RamInfoText.Text = $"RAM {last.RamUsedGb:F1}/{last.RamTotalGb:F1} GB | PF {last.RamPageFaultsPerSec:F0}/s";
                        DiskInfoText.Text = $"R {last.DiskReadsPerSec:F0}/s • W {last.DiskWritesPerSec:F0}/s | Q {last.DiskQueueLen:F2} | Lat {last.DiskLatencySec * 1000:F0} ms";
                        PowerInfoText.Text = last.CpuMaxMhz > 0 ? $"Clock {last.CpuCurrentMhz:F0}/{last.CpuMaxMhz:F0} MHz" : "Clock N/D";
                        
                        // Atualizar UI de temperatura com valores mais recentes
                        UpdateTemperatureUI(cpuTemp, gpuTemp, last.CpuThrottling, last.GpuThrottling);
                        
                        UpdateTopProcessesUI(last.TopProcesses);
                        
                        CauseText.Text = string.IsNullOrWhiteSpace(last.Cause) ? "Escananeando estabilidade..." : last.Cause;
                        AnalysisText.Text = BuildAnalysis(last);
                        DrawSpark(CpuGraph, samples.Select(s => s.CpuPercent).ToArray());
                        DrawSpark(GpuGraph, samples.Select(s => Math.Max(0, s.GpuUtilPercent)).ToArray());
                        DrawSpark(FpsGraph, samples.Select(s => Math.Max(0, s.Fps)).ToArray());
                        DrawSpark(RamGraph, samples.Select(s => s.RamUsedGb).ToArray());
                        DrawSpark(DiskGraph, samples.Select(s => s.DiskLatencySec * 1000).ToArray());
                        DrawSpark(PowerGraph, samples.Select(s => s.CpuCurrentMhz).ToArray());
                        
                        // Desenhar gráfico de temperatura usando valores mais precisos
                        DrawSpark(TemperatureGraph, samples.Select(s => Math.Max(
                            _lastCpuTemp > 0 ? _lastCpuTemp : s.CpuTemperature, 
                            _lastGpuTemp > 0 ? _lastGpuTemp : s.GpuTemperature
                        )).ToArray());
                        
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
                if (s.Cause == "CPU/Scheduling") return "⚠️ SATURAÇÃO DE CPU: Detectada alta carga ou fila de execução. Causa provável: Processos ruidosos em segundo plano. Solução: VOLTRIS Neural Core está tentando silenciá-los automaticamente.";
                if (s.Cause == "Drivers/DPC/Interrupt") return "🔴 LATÊNCIA DE DRIVER (DPC): Detectados picos de interrupção de hardware. Verifique drivers de rede ou áudio. Isso causa micro-engasgos (stuttering).";
                if (s.Cause == "Memória/Paging") return "🟡 PRESSÃO DE MEMÓRIA: O Windows está usando o Pagefile (disco) como RAM. Isso destrói a performance. Feche navegadores ou apps pesados.";
                if (s.Cause == "Disco/IO") return "🟠 FILA DE DISCO CRÍTICA: O SSD não está conseguindo acompanhar as requisições. Verifique se há downloads ou varreduras de antivírus em andamento.";
                if (s.Cause == "GPU/Render") return "🔵 LIMITE DE GPU: Sua placa de vídeo está a 100%. Se o FPS estiver baixo, reduza as configurações gráficas do jogo.";
                if (s.Cause == "Energia/Throttling") 
                {
                    if (s.CpuThrottling || s.GpuThrottling)
                    {
                        string thermalMsg = "🔥 THROTTLING TÉRMICO CRÍTICO: ";
                        if (s.CpuThrottling) thermalMsg += $"CPU a {s.CpuTemperature:F0}°C. ";
                        if (s.GpuThrottling) thermalMsg += $"GPU a {s.GpuTemperature:F0}°C. ";
                        thermalMsg += "Limpe seu hardware ou use um suporte de resfriamento. O clock foi reduzido drasticamente.";
                        return thermalMsg;
                    }
                    return "⚡ LIMITE DE ENERGIA: A CPU não está recebendo energia suficiente para atingir o clock máximo. Verifique o plano de energia e a fonte.";
                }
            }
            catch { }
            return "✅ SISTEMA ESTÁVEL: Monitoramento inteligente ativo. Nenhuma anomalia crítica detectada nos últimos 60 segundos.";
        }

        private void UpdateTopProcessesUI(System.Collections.Generic.List<GameDiagnosticsService.ProcessInfo> processes)
        {
            if (processes == null || TopProcessesList == null) return;
            
            // Vamos usar o maior processo como base 100% para a barra (visual)
            long maxRam = processes.Count > 0 ? processes.Max(p => p.RamBytes) : 1;
            
            var items = processes.Select(p => new {
                p.Name,
                DisplayValue = FormatBytes(p.RamBytes),
                Percent = (double)p.RamBytes / maxRam * 100 // Percentagem visual relativa
            }).ToList();
            
            TopProcessesList.ItemsSource = items;
        }

        private string FormatBytes(long bytes)
        {
            string[] Suffix = { "B", "KB", "MB", "GB", "TB" };
            int i;
            double dblSByte = bytes;
            for (i = 0; i < Suffix.Length && bytes >= 1024; i++, bytes /= 1024)
            {
                dblSByte = bytes / 1024.0;
            }
            return string.Format("{0:0.1} {1}", dblSByte, Suffix[i]);
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
                if (IncidentsList == null) return;
                
                var incidents = _svc?.GetActiveIncidents() ?? new System.Collections.Generic.List<DiagnosticIncident>();
                
                if (incidents.Count == 0)
                {
                    IncidentsList.ItemsSource = new[] { "Nenhum incidente detectado" };
                    return;
                }
                
                var items = incidents
                    .OrderByDescending(i => i.Timestamp)
                    .Take(20)
                    .Select(i => FormatIncident(i))
                    .ToArray();
                
                IncidentsList.ItemsSource = items;
            }
            catch { }
        }
        
        private string FormatIncident(DiagnosticIncident incident)
        {
            var severityIcon = incident.Severity switch
            {
                "Critical" => "🔴",
                "High" => "🟠",
                "Medium" => "🟡",
                _ => "🟢"
            };
            
            var time = incident.Timestamp.ToLocalTime().ToString("HH:mm:ss");
            return $"{severityIcon} {time} • {incident.Cause} - {incident.Description}";
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