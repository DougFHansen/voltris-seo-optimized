using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using Microsoft.Win32;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.UI.Controls;

namespace VoltrisOptimizer.UI.Views
{
    public partial class LogsView : UserControl
    {
        private readonly ILoggingService? _loggingService;
        private readonly System.Collections.ObjectModel.ObservableCollection<LogItem> _logItems = new System.Collections.ObjectModel.ObservableCollection<LogItem>();
        private System.ComponentModel.ICollectionView _logsView;
        private bool _isLoading = false;

        public class LogItem
        {
            public string FullText { get; set; } = string.Empty;
            public string Level { get; set; } = "INFO";
            public Brush Color { get; set; } = Brushes.White;
        }

        public LogsView()
        {
            InitializeComponent();
            
            // Configurar a view para filtragem e ordenação
            _logsView = System.Windows.Data.CollectionViewSource.GetDefaultView(_logItems);
            _logsView.Filter = FilterLogs;
            
            if (LogsListBox != null)
                LogsListBox.ItemsSource = _logsView;
            
            // Obter o serviço de logging
            _loggingService = App.LoggingService;
            
            // Aguardar o Loaded para garantir que todos os elementos estão inicializados
            Loaded += LogsView_Loaded;
            Unloaded += LogsView_Unloaded;
        }

        private void LogsView_Unloaded(object sender, RoutedEventArgs e)
        {
            // Desinscrever do evento para evitar memory leak
            if (_loggingService != null)
            {
                _loggingService.LogEntryAdded -= LoggingService_LogEntryAdded;
            }
        }

        private async void LogsView_Loaded(object sender, RoutedEventArgs e)
        {
            // Track page view
            try
            {
                App.TelemetryService?.TrackEvent("PAGE_VIEW", new Dictionary<string, object>
                {
                    { "page", "Logs" },
                    { "action", "Load" }
                });
            }
            catch { /* Ignorar erros de telemetria */ }
            
            // Se inscrever no evento de novos logs ANTES de carregar
            if (_loggingService != null)
            {
                _loggingService.LogEntryAdded += LoggingService_LogEntryAdded;
            }
            
            // Carregar logs de forma assíncrona para não travar a UI
            await System.Threading.Tasks.Task.Run(() => LoadLogs());
        }

        private void LoadLogs()
        {
            if (_loggingService == null) return;

            try
            {
                _isLoading = true;
                
                // Obter logs em background thread
                var logs = _loggingService.GetLogs();
                
                // Processar logs em background
                var items = new System.Collections.Generic.List<LogItem>();
                if (logs != null)
                {
                    // Limitar a 10000 logs mais recentes para evitar travamento
                    var recentLogs = logs.Length > 10000 
                        ? logs.Skip(logs.Length - 10000).ToArray() 
                        : logs;
                    
                    foreach (var log in recentLogs)
                    {
                        if (string.IsNullOrEmpty(log)) continue;
                        items.Add(CreateLogItem(log));
                    }
                }

                // Atualizar UI na thread principal
                Dispatcher.Invoke(() =>
                {
                    try
                    {
                        _logItems.Clear();
                        foreach (var item in items)
                        {
                            _logItems.Add(item);
                        }
                        UpdateLogStats();
                        ScrollToEnd();
                    }
                    catch (Exception ex)
                    {
                        _logItems.Add(new LogItem 
                        { 
                            FullText = $"Erro ao atualizar UI: {ex.Message}", 
                            Level = "ERROR", 
                            Color = Brushes.Red 
                        });
                    }
                });
            }
            catch (Exception ex)
            {
                Dispatcher.Invoke(() =>
                {
                    _logItems.Add(new LogItem 
                    { 
                        FullText = $"Erro ao carregar logs: {ex.Message}", 
                        Level = "ERROR", 
                        Color = Brushes.Red 
                    });
                });
            }
            finally
            {
                _isLoading = false;
            }
        }

        private LogItem CreateLogItem(string logEntry)
        {
            string level = "INFO";
            
            // Detectar formato PT-BR e EN
            if (logEntry.Contains("[Erro") || logEntry.Contains("[Error") || logEntry.Contains("[ERROR"))
                level = "ERROR";
            else if (logEntry.Contains("[Sucesso") || logEntry.Contains("[Success") || logEntry.Contains("[SUCCESS"))
                level = "SUCCESS";
            else if (logEntry.Contains("[Aviso") || logEntry.Contains("[Warning") || logEntry.Contains("[WARNING"))
                level = "WARNING";
            else if (logEntry.Contains("[Informação") || logEntry.Contains("[Info") || logEntry.Contains("[INFO"))
                level = "INFO";

            return new LogItem
            {
                FullText = logEntry,
                Level = level,
                Color = GetLogColor(logEntry)
            };
        }

        private bool FilterLogs(object item)
        {
            if (item is not LogItem logItem) return false;

            // Filtros de nível
            bool showInfo = FilterInfoCheckBox?.IsChecked ?? true;
            bool showSuccess = FilterSuccessCheckBox?.IsChecked ?? true;
            bool showWarning = FilterWarningCheckBox?.IsChecked ?? true;
            bool showError = FilterErrorCheckBox?.IsChecked ?? true;

            if (logItem.Level == "INFO" && !showInfo) return false;
            if (logItem.Level == "SUCCESS" && !showSuccess) return false;
            if (logItem.Level == "WARNING" && !showWarning) return false;
            if (logItem.Level == "ERROR" && !showError) return false;

            // Filtro de busca
            string searchText = SearchTextBox?.Text?.ToLower() ?? "";
            if (!string.IsNullOrWhiteSpace(searchText))
            {
                if (!logItem.FullText.ToLower().Contains(searchText))
                    return false;
            }

            return true;
        }

        private void LoggingService_LogEntryAdded(object? sender, string logEntry)
        {
            Dispatcher.BeginInvoke(() =>
            {
                var item = CreateLogItem(logEntry);
                _logItems.Add(item);
                UpdateLogStats();
                
                // Só scrollar se estiver no fim ou for erro/aviso
                if (item.Level == "ERROR" || item.Level == "WARNING")
                    ScrollToEnd();
            });
        }

        private void ApplyFilters()
        {
            if (_isLoading || _logsView == null) return;
            _logsView.Refresh();
            UpdateLogStats();
            ScrollToEnd();
        }
        
        private void UpdateLogStats()
        {
            try
            {
                int info = _logItems.Count(x => x.Level == "INFO");
                int success = _logItems.Count(x => x.Level == "SUCCESS");
                int warning = _logItems.Count(x => x.Level == "WARNING");
                int error = _logItems.Count(x => x.Level == "ERROR");

                if (InfoCountText != null) InfoCountText.Text = info.ToString();
                if (SuccessCountText != null) SuccessCountText.Text = success.ToString();
                if (WarningCountText != null) WarningCountText.Text = warning.ToString();
                if (ErrorCountText != null) ErrorCountText.Text = error.ToString();
            }
            catch { /* Ignorar erros de atualização de UI */ }
        }

        private Brush GetLogColor(string logEntry)
        {
            try
            {
                if (string.IsNullOrEmpty(logEntry))
                    return new SolidColorBrush(Colors.White);

                // Detectar formato PT-BR e EN
                if (logEntry.Contains("[Erro") || logEntry.Contains("[Error") || logEntry.Contains("[ERROR"))
                {
                    if (Application.Current.Resources.Contains("ErrorBrush"))
                        return (SolidColorBrush)Application.Current.Resources["ErrorBrush"];
                    return new SolidColorBrush(Colors.Red);
                }
                else if (logEntry.Contains("[Aviso") || logEntry.Contains("[Warning") || logEntry.Contains("[WARNING"))
                {
                    if (Application.Current.Resources.Contains("WarningBrush"))
                        return (SolidColorBrush)Application.Current.Resources["WarningBrush"];
                    return new SolidColorBrush(Colors.Orange);
                }
                else if (logEntry.Contains("[Sucesso") || logEntry.Contains("[Success") || logEntry.Contains("[SUCCESS"))
                {
                    if (Application.Current.Resources.Contains("SuccessBrush"))
                        return (SolidColorBrush)Application.Current.Resources["SuccessBrush"];
                    return new SolidColorBrush(Colors.Green);
                }
                else if (logEntry.Contains("[Informação") || logEntry.Contains("[Info") || logEntry.Contains("[INFO"))
                {
                    if (Application.Current.Resources.Contains("PrimaryBrush"))
                        return (SolidColorBrush)Application.Current.Resources["PrimaryBrush"];
                    return new SolidColorBrush(Colors.Cyan);
                }
                else
                {
                    if (Application.Current.Resources.Contains("TextPrimaryBrush"))
                        return (SolidColorBrush)Application.Current.Resources["TextPrimaryBrush"];
                    return new SolidColorBrush(Colors.White);
                }
            }
            catch
            {
                return new SolidColorBrush(Colors.White);
            }
        }

        private void ScrollToEnd()
        {
            if (LogsListBox != null && LogsListBox.Items.Count > 0)
            {
                try
                {
                    LogsListBox.ScrollIntoView(LogsListBox.Items[LogsListBox.Items.Count - 1]);
                }
                catch { /* Ignorar erros de scroll */ }
            }
        }

        private void FilterCheckBox_Changed(object sender, RoutedEventArgs e)
        {
            ApplyFilters();
        }

        private void SearchTextBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            ApplyFilters();
        }

        private void RefreshButton_Click(object sender, RoutedEventArgs e)
        {
            // Executar em background para não travar a UI
            System.Threading.Tasks.Task.Run(() => LoadLogs());
        }

        private void ClearLogsButton_Click(object sender, RoutedEventArgs e)
        {
            if (_loggingService == null)
            {
                ModernMessageBox.Show(
                    "Serviço de logging não disponível.",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
                return;
            }

            var result = ModernMessageBox.Show(
                "Tem certeza que deseja limpar todos os logs?\n\nEsta ação não pode ser desfeita.",
                "Limpar Logs",
                MessageBoxButton.YesNo,
                MessageBoxImage.Warning);

            if (result == MessageBoxResult.Yes)
            {
                try
                {
                    _loggingService.ClearLogs();
                    _logItems.Clear();
                    UpdateLogStats();
                    
                    ModernMessageBox.Show(
                        "Logs limpos com sucesso!",
                        "Sucesso",
                        MessageBoxButton.OK,
                        MessageBoxImage.Information);
                }
                catch (Exception ex)
                {
                    ModernMessageBox.Show(
                        $"Erro ao limpar logs:\n\n{ex.Message}",
                        "Erro",
                        MessageBoxButton.OK,
                        MessageBoxImage.Error);
                }
            }
        }

        private void ExportLogsButton_Click(object sender, RoutedEventArgs e)
        {
            if (_loggingService == null)
            {
                ModernMessageBox.Show(
                    "Serviço de logging não disponível.",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
                return;
            }

            try
            {
                var saveDialog = new SaveFileDialog
                {
                    Filter = "Arquivos de Texto (*.txt)|*.txt|Todos os Arquivos (*.*)|*.*",
                    FileName = $"VoltrisOptimizer_Logs_{DateTime.Now:yyyy-MM-dd_HH-mm-ss}.txt",
                    DefaultExt = "txt"
                };

                if (saveDialog.ShowDialog() == true)
                {
                    // Exportar todos os logs filtrados
                    var logsToExport = new List<string>();
                    if (_logsView != null)
                    {
                        foreach (var item in _logsView)
                        {
                            if (item is LogItem logItem)
                            {
                                logsToExport.Add(logItem.FullText);
                            }
                        }
                    }

                    if (logsToExport.Count == 0)
                    {
                        ModernMessageBox.Show(
                            "Não há logs para exportar.",
                            "Aviso",
                            MessageBoxButton.OK,
                            MessageBoxImage.Warning);
                        return;
                    }

                    File.WriteAllLines(saveDialog.FileName, logsToExport);
                    
                    ModernMessageBox.Show(
                        $"Logs exportados com sucesso!\n\nArquivo: {saveDialog.FileName}",
                        "Exportação Concluída",
                        MessageBoxButton.OK,
                        MessageBoxImage.Information);
                }
            }
            catch (Exception ex)
            {
                ModernMessageBox.Show(
                    $"Erro ao exportar logs:\n\n{ex.Message}",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
        }
    }
}
