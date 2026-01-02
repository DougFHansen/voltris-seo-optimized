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
        private readonly List<string> _allLogs = new List<string>();
        private bool _isLoading = false;

        public LogsView()
        {
            InitializeComponent();
            
            // Obter o serviço de logging
            _loggingService = App.LoggingService;
            
            // Aguardar o Loaded para garantir que todos os elementos estão inicializados
            Loaded += LogsView_Loaded;
        }

        private void LogsView_Loaded(object sender, RoutedEventArgs e)
        {
            // Carregar logs iniciais após o Loaded
            LoadLogs();
            
            // Se inscrever no evento de novos logs
            if (_loggingService != null)
            {
                _loggingService.LogEntryAdded += LoggingService_LogEntryAdded;
            }
        }

        private void LoadLogs()
        {
            // Verificar se os elementos estão inicializados
            if (LogsListBox == null)
                return;

            if (_loggingService == null)
            {
                LogsListBox.Items.Add(new TextBlock
                {
                    Text = "Serviço de logging não disponível.",
                    Foreground = new SolidColorBrush(Colors.Orange),
                    FontFamily = new FontFamily("Segoe UI"),
                    FontSize = 13
                });
                return;
            }

            try
            {
                _isLoading = true;
                _allLogs.Clear();
                LogsListBox.Items.Clear();

                // Carregar logs do arquivo
                var logs = _loggingService.GetLogs();
                if (logs != null)
                {
                    _allLogs.AddRange(logs);
                }

                // Aplicar filtros e busca
                ApplyFilters();
            }
            catch (Exception ex)
            {
                if (LogsListBox != null)
                {
                    LogsListBox.Items.Add(new TextBlock
                    {
                        Text = $"Erro ao carregar logs: {ex.Message}",
                        Foreground = new SolidColorBrush(Colors.Red),
                        FontFamily = new FontFamily("Segoe UI"),
                        FontSize = 13
                    });
                }
            }
            finally
            {
                _isLoading = false;
                ScrollToEnd();
            }
        }

        private void LoggingService_LogEntryAdded(object? sender, string logEntry)
        {
            // Adicionar novo log à lista
            Dispatcher.Invoke(() =>
            {
                _allLogs.Add(logEntry);
                ApplyFilters();
            });
        }

        private void ApplyFilters()
        {
            if (_isLoading || LogsListBox == null) return;

            try
            {
                LogsListBox.Items.Clear();

                bool showInfo = FilterInfoCheckBox?.IsChecked ?? true;
                bool showSuccess = FilterSuccessCheckBox?.IsChecked ?? true;
                bool showWarning = FilterWarningCheckBox?.IsChecked ?? true;
                bool showError = FilterErrorCheckBox?.IsChecked ?? true;

                string searchText = SearchTextBox?.Text?.ToLower() ?? "";
                
                // Contadores para estatísticas
                int infoCount = 0, successCount = 0, warningCount = 0, errorCount = 0;

                foreach (var logEntry in _allLogs)
                {
                    if (string.IsNullOrEmpty(logEntry)) continue;
                    
                    // Contar por tipo (sempre contar, independente do filtro)
                    if (logEntry.Contains("[INFO]")) infoCount++;
                    else if (logEntry.Contains("[SUCCESS]")) successCount++;
                    else if (logEntry.Contains("[WARNING]")) warningCount++;
                    else if (logEntry.Contains("[ERROR]")) errorCount++;

                    // Verificar filtro de nível
                    bool shouldShow = false;
                    if (logEntry.Contains("[INFO]") && showInfo) shouldShow = true;
                    else if (logEntry.Contains("[SUCCESS]") && showSuccess) shouldShow = true;
                    else if (logEntry.Contains("[WARNING]") && showWarning) shouldShow = true;
                    else if (logEntry.Contains("[ERROR]") && showError) shouldShow = true;

                    if (!shouldShow) continue;

                    // Verificar busca
                    if (!string.IsNullOrWhiteSpace(searchText))
                    {
                        if (!logEntry.ToLower().Contains(searchText))
                            continue;
                    }

                    // Criar TextBlock com cor apropriada
                    var textBlock = new TextBlock
                    {
                        Text = logEntry,
                        TextWrapping = System.Windows.TextWrapping.NoWrap,
                        FontFamily = new FontFamily("Consolas"),
                        FontSize = 11,
                        Foreground = GetLogColor(logEntry)
                    };

                    LogsListBox.Items.Add(textBlock);
                }
                
                // Atualizar contadores de estatísticas
                UpdateLogStats(infoCount, successCount, warningCount, errorCount);

                ScrollToEnd();
            }
            catch (Exception ex)
            {
                if (LogsListBox != null)
                {
                    LogsListBox.Items.Add(new TextBlock
                    {
                        Text = $"Erro ao aplicar filtros: {ex.Message}",
                        Foreground = new SolidColorBrush(Colors.Red),
                        FontFamily = new FontFamily("Segoe UI"),
                        FontSize = 13
                    });
                }
            }
        }
        
        private void UpdateLogStats(int info, int success, int warning, int error)
        {
            try
            {
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

                if (logEntry.Contains("[ERROR]"))
                {
                    if (Application.Current.Resources.Contains("ErrorBrush"))
                        return (SolidColorBrush)Application.Current.Resources["ErrorBrush"];
                    return new SolidColorBrush(Colors.Red);
                }
                else if (logEntry.Contains("[WARNING]"))
                {
                    if (Application.Current.Resources.Contains("WarningBrush"))
                        return (SolidColorBrush)Application.Current.Resources["WarningBrush"];
                    return new SolidColorBrush(Colors.Orange);
                }
                else if (logEntry.Contains("[SUCCESS]"))
                {
                    if (Application.Current.Resources.Contains("SuccessBrush"))
                        return (SolidColorBrush)Application.Current.Resources["SuccessBrush"];
                    return new SolidColorBrush(Colors.Green);
                }
                else if (logEntry.Contains("[INFO]"))
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
            LoadLogs();
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
                    _allLogs.Clear();
                    if (LogsListBox != null)
                    {
                        LogsListBox.Items.Clear();
                    }
                    
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
                    if (LogsListBox != null)
                    {
                        foreach (var item in LogsListBox.Items)
                        {
                            if (item is TextBlock textBlock)
                            {
                                logsToExport.Add(textBlock.Text);
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
