using System;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Shapes;
using System.Windows.Media;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Services.DPC;

namespace VoltrisOptimizer.UI.Views
{
    public partial class DpcHealthView : UserControl
    {
        private readonly IDpcAnalyzerService _svc;
        public DpcHealthView()
        {
            InitializeComponent();
            _svc = App.Services?.GetService(typeof(IDpcAnalyzerService)) as IDpcAnalyzerService ?? new DpcAnalyzerService(App.LoggingService!);
            _svc.SampleReceived += OnSample;
            _svc.Start();
            _ = RefreshUiLoop();
        }
        private void OnSupportPack(object sender, RoutedEventArgs e)
        {
            _ = CreatePack();
        }
        private async Task CreatePack()
        {
            var path = await _svc.CreateSupportPackAsync();
            App.LoggingService?.LogSuccess("[DPC] Support pack gerado: " + path);
        }
        private void OnSample(DpcSample s)
        {
            Dispatcher.Invoke(() =>
            {
                if (Chart.Items.Count > 300) Chart.Items.RemoveAt(0);
                var rect = new Rectangle { Width = 2, Height = Math.Min(100, s.DpcPercent * 2), Fill = Brushes.Lime, Margin = new Thickness(1,0,1,0), VerticalAlignment = VerticalAlignment.Bottom };
                Chart.Items.Add(rect);
            });
        }
        private async Task RefreshUiLoop()
        {
            while (true)
            {
                await Task.Delay(1000);
                var r = _svc.GetLatestAnalysis();
                StatsText.Text = $"AVG={r.Stats.Avg:F1}% P95={r.Stats.P95:F1}% P99={r.Stats.P99:F1}% Spikes={r.Stats.SpikeCount}";
                RecText.Text = r.Recommendation;
                SpikesList.ItemsSource = r.Spikes.Select(s => new { Time = s.Timestamp.ToLocalTime().ToString("HH:mm:ss"), Value = s.Value.ToString("F1") + "%", Driver = s.Driver ?? "-", Process = s.ProcessName ?? "-" }).ToList();
            }
        }
    }
}
