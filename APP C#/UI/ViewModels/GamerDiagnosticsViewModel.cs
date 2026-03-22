using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Input;
using System.Windows.Threading;
using VoltrisOptimizer.Services.Gamer.Diagnostics.Interfaces;
using VoltrisOptimizer.Services.Gamer.Diagnostics.Models;

namespace VoltrisOptimizer.UI.ViewModels
{
    /// <summary>
    /// ViewModel para o painel de diagnóstico do modo gamer
    /// </summary>
    public class GamerDiagnosticsViewModel : ViewModelBase
    {
        private readonly IGamerSelfProfiler _profiler;
        private readonly DispatcherTimer _updateTimer;
        private ProfilingSnapshot? _currentSnapshot;
        private ProfilingReport? _currentReport;
        private bool _isDeveloperModeEnabled;

        public GamerDiagnosticsViewModel(IGamerSelfProfiler profiler)
        {
            _profiler = profiler ?? throw new ArgumentNullException(nameof(profiler));
            App.LoggingService?.LogTrace("[GAMER_DIAG] ViewModel inicializado");

            // Inicializar coleções
            ModuleStatistics = new ObservableCollection<ModuleStatisticsViewModel>();
            Anomalies = new ObservableCollection<PerformanceAnomaly>();
            OrchestratorLoopHistory = new ObservableCollection<LoopTimePoint>();

            // Configurar timer de atualização (300-500ms para UI suave)
            _updateTimer = new DispatcherTimer
            {
                Interval = TimeSpan.FromMilliseconds(400)
            };
            _updateTimer.Tick += UpdateTimer_Tick;

            // Subscrever eventos do profiler
            _profiler.SnapshotUpdated += Profiler_SnapshotUpdated;
            _profiler.AnomalyDetected += Profiler_AnomalyDetected;

            // Comandos
            ExportReportCommand = new RelayCommand(async () => await ExportReportAsync());
            ClearHistoryCommand = new RelayCommand(() => ClearHistory());
            ToggleDeveloperModeCommand = new RelayCommand(() => IsDeveloperModeEnabled = !IsDeveloperModeEnabled);

            // Iniciar atualizações
            _updateTimer.Start();
        }

        #region Properties

        public ObservableCollection<ModuleStatisticsViewModel> ModuleStatistics { get; }
        public ObservableCollection<PerformanceAnomaly> Anomalies { get; }
        public ObservableCollection<LoopTimePoint> OrchestratorLoopHistory { get; }

        public ProfilingSnapshot? CurrentSnapshot
        {
            get => _currentSnapshot;
            set => SetProperty(ref _currentSnapshot, value);
        }

        public ProfilingReport? CurrentReport
        {
            get => _currentReport;
            set => SetProperty(ref _currentReport, value);
        }

        public bool IsDeveloperModeEnabled
        {
            get => _isDeveloperModeEnabled;
            set => SetProperty(ref _isDeveloperModeEnabled, value);
        }

        public double TotalCpuUsage => CurrentSnapshot?.TotalCpuUsagePercent ?? 0;
        public double OverlayGpuUsage => CurrentSnapshot?.OverlayGpuUsagePercent ?? 0;
        public double TotalMemoryUsage => CurrentSnapshot?.TotalMemoryUsageMb ?? 0;
        public double OrchestratorLoopTime => CurrentSnapshot?.OrchestratorLoopTimeMs ?? 0;
        public int ActiveThreads => CurrentSnapshot?.ActiveThreads ?? 0;
        public int PendingTasks => CurrentSnapshot?.PendingAsyncTasks ?? 0;
        public int CriticalAnomalies => CurrentSnapshot?.Anomalies.Count(a => a.Severity == AnomalySeverity.Critical) ?? 0;
        public int HighAnomalies => CurrentSnapshot?.Anomalies.Count(a => a.Severity == AnomalySeverity.High) ?? 0;
        public double InternalLatency => CurrentSnapshot?.InternalLatencyMs ?? 0;

        #endregion

        #region Commands

        public ICommand ExportReportCommand { get; }
        public ICommand ClearHistoryCommand { get; }
        public ICommand ToggleDeveloperModeCommand { get; }

        #endregion

        private void UpdateTimer_Tick(object? sender, EventArgs e)
        {
            UpdateData();
        }

        private void Profiler_SnapshotUpdated(object? sender, ProfilingSnapshot snapshot)
        {
            CurrentSnapshot = snapshot;
            if (snapshot.Anomalies.Count > 0)
            {
                App.LoggingService?.LogTrace($"[GAMER_DIAG] Snapshot atualizado. {snapshot.Anomalies.Count} anomalias presentes no momento.");
            }
            OnPropertyChanged(nameof(TotalCpuUsage));
            OnPropertyChanged(nameof(OverlayGpuUsage));
            OnPropertyChanged(nameof(TotalMemoryUsage));
            OnPropertyChanged(nameof(OrchestratorLoopTime));
            OnPropertyChanged(nameof(ActiveThreads));
            OnPropertyChanged(nameof(PendingTasks));
            OnPropertyChanged(nameof(CriticalAnomalies));
            OnPropertyChanged(nameof(HighAnomalies));
            OnPropertyChanged(nameof(InternalLatency));
        }

        private void Profiler_AnomalyDetected(object? sender, PerformanceAnomaly anomaly)
        {
            App.LoggingService?.LogWarning($"[GAMER_DIAG] Anomalia detectada: {anomaly.Name} - Severidade: {anomaly.Severity}");
            App.Current.Dispatcher.BeginInvoke(() =>
            {
                Anomalies.Insert(0, anomaly);
                while (Anomalies.Count > 100)
                {
                    Anomalies.RemoveAt(Anomalies.Count - 1);
                }
            });
        }

        private void UpdateData()
        {
            try
            {
                var report = _profiler.GetCurrentReport();
                CurrentReport = report;

                // Atualizar estatísticas de módulos
                App.Current.Dispatcher.BeginInvoke(() =>
                {
                    ModuleStatistics.Clear();
                    foreach (var kvp in report.ModuleStatistics.OrderByDescending(x => x.Value.AverageExecutionTimeMs))
                    {
                        ModuleStatistics.Add(new ModuleStatisticsViewModel
                        {
                            ModuleName = kvp.Key,
                            AverageExecutionTime = kvp.Value.AverageExecutionTimeMs,
                            MaxExecutionTime = kvp.Value.MaxExecutionTimeMs,
                            CpuUsage = kvp.Value.AverageCpuUsagePercent,
                            GpuUsage = kvp.Value.AverageGpuUsagePercent,
                            ThreadBlocks = kvp.Value.TotalThreadBlocks,
                            TotalExecutions = kvp.Value.TotalExecutions,
                            ExecutionsAboveThreshold = kvp.Value.ExecutionsAboveThreshold
                        });
                    }

                    // Atualizar histórico do loop do orquestrador
                    if (report.CurrentSnapshot.OrchestratorLoopTimeMs > 0)
                    {
                        OrchestratorLoopHistory.Add(new LoopTimePoint
                        {
                            Time = DateTime.Now,
                            LoopTimeMs = report.CurrentSnapshot.OrchestratorLoopTimeMs
                        });
                        while (OrchestratorLoopHistory.Count > 120) // 2 minutos a 1Hz
                        {
                            OrchestratorLoopHistory.RemoveAt(0);
                        }
                    }
                });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[GamerDiagnostics] Erro ao atualizar dados: {ex.Message}");
            }
        }

        private async Task ExportReportAsync()
        {
            try
            {
                var json = await _profiler.ExportReportAsync();
                var fileName = $"VoltrisDiagnostics_{DateTime.Now:yyyyMMdd_HHmmss}.json";
                var filePath = System.IO.Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments),
                    fileName
                );
                await System.IO.File.WriteAllTextAsync(filePath, json);
                App.LoggingService?.LogSuccess($"[GAMER_DIAG] Relatório de diagnóstico exportado com sucesso em: {filePath}");
                System.Windows.MessageBox.Show($"Relatório exportado para:\n{filePath}", "Exportar Relatório", System.Windows.MessageBoxButton.OK, System.Windows.MessageBoxImage.Information);
            }
            catch (Exception ex)
            {
                System.Windows.MessageBox.Show($"Erro ao exportar relatório: {ex.Message}", "Erro", System.Windows.MessageBoxButton.OK, System.Windows.MessageBoxImage.Error);
            }
        }

        private void ClearHistory()
        {
            _profiler.ClearHistory();
            App.Current.Dispatcher.BeginInvoke(() =>
            {
                ModuleStatistics.Clear();
                Anomalies.Clear();
                OrchestratorLoopHistory.Clear();
            });
        }
        
        protected override void OnDisposing()
        {
            _updateTimer.Stop();
            _updateTimer.Tick -= UpdateTimer_Tick;
            _profiler.SnapshotUpdated -= Profiler_SnapshotUpdated;
            _profiler.AnomalyDetected -= Profiler_AnomalyDetected;
            base.OnDisposing();
        }
    }

    /// <summary>
    /// ViewModel para estatísticas de módulo (para binding na UI)
    /// </summary>
    public class ModuleStatisticsViewModel
    {
        public string ModuleName { get; set; } = "";
        public double AverageExecutionTime { get; set; }
        public double MaxExecutionTime { get; set; }
        public double CpuUsage { get; set; }
        public double GpuUsage { get; set; }
        public int ThreadBlocks { get; set; }
        public int TotalExecutions { get; set; }
        public int ExecutionsAboveThreshold { get; set; }
    }

    /// <summary>
    /// Ponto de dados para histórico do loop do orquestrador
    /// </summary>
    public class LoopTimePoint
    {
        public DateTime Time { get; set; }
        public double LoopTimeMs { get; set; }
    }
}


