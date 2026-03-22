using System.Collections.ObjectModel;
using System.Windows.Input;

namespace VoltrisOptimizer.Core.SystemIntelligenceProfiler.UI.ViewModels
{
    public class LogConsoleViewModel : System.ComponentModel.INotifyPropertyChanged
    {
        public ObservableCollection<string> Logs { get; } = new ObservableCollection<string>();
        public ICommand ExportCommand { get; }
        public ICommand ClearCommand { get; }

        public LogConsoleViewModel()
        {
            ExportCommand = new RelayCommand(_ => Export());
            ClearCommand = new RelayCommand(_ => Clear());

            try
            {
                if (App.LoggingService != null)
                {
                    foreach (var line in App.LoggingService.GetLogs()) Logs.Add(line);
                    App.LoggingService.LogEntryAdded += OnLogEntryAdded;
                }
            }
            catch { }
        }

        private void OnLogEntryAdded(object? sender, string e)
        {
            try { Logs.Add(e); } catch { }
        }

        private void Export()
        {
            try
            {
                var path = System.IO.Path.Combine(System.IO.Path.GetTempPath(), "voltris_logs_export.txt");
                App.LoggingService?.ExportLogs(path);
                System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo { FileName = path, UseShellExecute = true });
            }
            catch { }
        }

        private void Clear()
        {
            try { App.LoggingService?.ClearLogs(); Logs.Clear(); } catch { }
        }

        public event System.ComponentModel.PropertyChangedEventHandler? PropertyChanged;
        private void OnPropertyChanged(string name) => PropertyChanged?.Invoke(this, new System.ComponentModel.PropertyChangedEventArgs(name));
    }
}

