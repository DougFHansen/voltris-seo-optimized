using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using VoltrisOptimizer.Core.PreparePc.Interfaces;
using Microsoft.Win32;

namespace VoltrisOptimizer.Core.PreparePc.UI.Views
{
    /// <summary>
    /// View de progresso da preparação do PC
    /// </summary>
    public partial class PreparePcProgressView : UserControl
    {
        private readonly PreparePcManager _manager;
        private readonly PreparePcOptions _options;
        private readonly StringBuilder _allLogs = new();
        private readonly Dictionary<string, Border> _stepBorders = new();
        private PreparePcResult? _result;
        private CancellationTokenSource? _cts;
        private DateTime _startTime;
        private System.Windows.Threading.DispatcherTimer? _uiTimer;
        private EventHandler<string>? _logHandler;
        private EventHandler<PreparePcProgress>? _progressHandler;
        
        /// <summary>
        /// Evento disparado quando a preparação termina
        /// </summary>
        public event EventHandler<PreparePcResult>? OnCompleted;
        
        /// <summary>
        /// Evento disparado quando o usuário escolhe continuar
        /// </summary>
        public event EventHandler? OnContinue;
        
        /// <summary>
        /// Evento disparado quando o usuário cancela
        /// </summary>
        public event EventHandler? OnCancelled;
        
        public PreparePcProgressView(PreparePcOptions options)
        {
            InitializeComponent();
            _options = options;
            _manager = new PreparePcManager(App.LoggingService!);
            _logHandler = (s, log) => AddLog(log);
            _progressHandler = (s, progress) => UpdateProgress(progress);
            
            _manager.LogAdded += _logHandler;
            _manager.ProgressChanged += _progressHandler;
            
            Loaded += async (s, e) => {
                // Desativar scroll do parent para garantir que o Viewbox funcione (fit-to-screen)
                var scrollViewer = FindParent<ScrollViewer>(this);
                if (scrollViewer != null)
                {
                    scrollViewer.VerticalScrollBarVisibility = ScrollBarVisibility.Disabled;
                    scrollViewer.HorizontalScrollBarVisibility = ScrollBarVisibility.Disabled;
                }

                await StartPreparationAsync();
            };
            Unloaded += (s, e) =>
            {
                try
                {
                    if (_logHandler != null) _manager.LogAdded -= _logHandler;
                    if (_progressHandler != null) _manager.ProgressChanged -= _progressHandler;
                }
                catch { }
                try { _cts?.Cancel(); } catch { }
                try { _uiTimer?.Stop(); _uiTimer = null; } catch { }
            };
        }

        private T? FindParent<T>(DependencyObject child) where T : DependencyObject
        {
            DependencyObject parentObject = VisualTreeHelper.GetParent(child);
            if (parentObject == null) return null;
            if (parentObject is T parent) return parent;
            return FindParent<T>(parentObject);
        }
        
        private async Task StartPreparationAsync()
        {
            _cts = new CancellationTokenSource();
            _startTime = DateTime.Now;
            
            // Configurar steps na UI
            InitializeStepsUI();
            
            // Iniciar timer de atualização
            _uiTimer = new System.Windows.Threading.DispatcherTimer
            {
                Interval = TimeSpan.FromSeconds(1)
            };
            _uiTimer.Tick += (s, e) =>
            {
                var elapsed = DateTime.Now - _startTime;
                ElapsedTimeText.Text = $"Tempo: {elapsed:mm\\:ss}";
            };
            _uiTimer.Start();
            
            try
            {
                // Executar preparação
                var progress = new Progress<PreparePcProgress>(UpdateProgress);
                _result = await _manager.ExecuteAsync(_options, progress, _cts.Token);
                
                _uiTimer?.Stop();
                
                // Mostrar resultado
                ShowCompletion(_result);
                
                OnCompleted?.Invoke(this, _result);
            }
            catch (OperationCanceledException)
            {
                _uiTimer?.Stop();
                ShowCancelled();
                OnCancelled?.Invoke(this, EventArgs.Empty);
            }
            catch (Exception ex)
            {
                _uiTimer?.Stop();
                AddLog($"❌ Erro crítico: {ex.Message}");
                ShowError(ex);
            }
        }
        
        private void InitializeStepsUI()
        {
            StepsStatusPanel.Children.Clear();
            _stepBorders.Clear();
            
            var steps = _manager.GetStepsToRun(_options);
            
            foreach (var (name, description, risk, _) in steps)
            {
                var stepBorder = new Border
                {
                    Background = new SolidColorBrush(Color.FromRgb(26, 26, 46)),
                    CornerRadius = new CornerRadius(6),
                    Padding = new Thickness(12, 8, 12, 8),
                    Margin = new Thickness(0, 0, 0, 6)
                };
                
                var stepGrid = new Grid();
                stepGrid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(24) });
                stepGrid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) });
                stepGrid.ColumnDefinitions.Add(new ColumnDefinition { Width = GridLength.Auto });
                
                var iconText = new TextBlock
                {
                    Text = "⏳",
                    FontSize = 14,
                    VerticalAlignment = VerticalAlignment.Center
                };
                Grid.SetColumn(iconText, 0);
                
                var nameText = new TextBlock
                {
                    Text = name,
                    Foreground = new SolidColorBrush(Color.FromRgb(160, 160, 160)),
                    VerticalAlignment = VerticalAlignment.Center,
                    FontSize = 12
                };
                Grid.SetColumn(nameText, 1);
                
                var statusText = new TextBlock
                {
                    Text = "Aguardando",
                    Foreground = new SolidColorBrush(Color.FromRgb(100, 100, 100)),
                    FontSize = 11,
                    VerticalAlignment = VerticalAlignment.Center
                };
                Grid.SetColumn(statusText, 2);
                
                stepGrid.Children.Add(iconText);
                stepGrid.Children.Add(nameText);
                stepGrid.Children.Add(statusText);
                stepBorder.Child = stepGrid;
                
                StepsStatusPanel.Children.Add(stepBorder);
                _stepBorders[name] = stepBorder;
            }
        }
        
        private void UpdateProgress(PreparePcProgress progress)
        {
            Dispatcher.Invoke(() =>
            {
                // Atualizar texto do step atual
                CurrentStepText.Text = $"Step {progress.CurrentStepIndex}/{progress.TotalSteps}: {progress.CurrentStepName}";
                CurrentActionText.Text = progress.CurrentAction;
                
                // Atualizar barra de progresso
                OverallProgress.Value = progress.OverallPercent;
                PercentText.Text = $"{progress.OverallPercent}%";
                
                // Atualizar tempo restante
                if (progress.EstimatedRemaining.TotalSeconds > 0)
                {
                    RemainingTimeText.Text = $"Restante: ~{FormatTime(progress.EstimatedRemaining)}";
                }
                
                // Atualizar status do step
                UpdateStepStatus(progress.CurrentStepName, progress.CurrentStatus);
            });
        }
        
        private void UpdateStepStatus(string stepName, StepStatus status)
        {
            if (!_stepBorders.TryGetValue(stepName, out var border)) return;
            
            var grid = border.Child as Grid;
            if (grid == null) return;
            
            var iconText = grid.Children[0] as TextBlock;
            var nameText = grid.Children[1] as TextBlock;
            var statusText = grid.Children[2] as TextBlock;
            
            switch (status)
            {
                case StepStatus.Running:
                    iconText!.Text = "🔄";
                    nameText!.Foreground = new SolidColorBrush(Colors.White);
                    statusText!.Text = "Executando...";
                    statusText.Foreground = new SolidColorBrush(Color.FromRgb(108, 92, 231));
                    border.Background = new SolidColorBrush(Color.FromRgb(37, 37, 66));
                    break;
                    
                case StepStatus.Completed:
                    iconText!.Text = "✅";
                    nameText!.Foreground = new SolidColorBrush(Color.FromRgb(76, 175, 80));
                    statusText!.Text = "Concluído";
                    statusText.Foreground = new SolidColorBrush(Color.FromRgb(76, 175, 80));
                    border.Background = new SolidColorBrush(Color.FromRgb(26, 42, 26));
                    break;
                    
                case StepStatus.Failed:
                    iconText!.Text = "❌";
                    nameText!.Foreground = new SolidColorBrush(Color.FromRgb(244, 67, 54));
                    statusText!.Text = "Falhou";
                    statusText.Foreground = new SolidColorBrush(Color.FromRgb(244, 67, 54));
                    border.Background = new SolidColorBrush(Color.FromRgb(42, 26, 26));
                    break;
                    
                case StepStatus.Skipped:
                    iconText!.Text = "⏭️";
                    nameText!.Foreground = new SolidColorBrush(Color.FromRgb(128, 128, 128));
                    statusText!.Text = "Ignorado";
                    statusText.Foreground = new SolidColorBrush(Color.FromRgb(128, 128, 128));
                    break;
                    
                case StepStatus.Cancelled:
                    iconText!.Text = "🚫";
                    nameText!.Foreground = new SolidColorBrush(Color.FromRgb(255, 193, 7));
                    statusText!.Text = "Cancelado";
                    statusText.Foreground = new SolidColorBrush(Color.FromRgb(255, 193, 7));
                    break;
            }
        }
        
        private void AddLog(string log)
        {
            Dispatcher.Invoke(() =>
            {
                _allLogs.AppendLine(log);
                LogsTextBlock.Text = _allLogs.ToString();
                
                // Scroll para o final
                LogsScrollViewer.ScrollToEnd();
            });
        }
        
        private void ShowCompletion(PreparePcResult result)
        {
            CancelBtn.Visibility = Visibility.Collapsed;
            CompletedActions.Visibility = Visibility.Visible;
            
            if (result.Success)
            {
                StatusText.Text = "CONCLUÍDO";
                HeaderText.Text = "Preparação Concluída!";
                SubHeaderText.Text = result.RequiresReboot 
                    ? "Algumas alterações requerem reinicialização do sistema."
                    : "Seu PC foi preparado com sucesso.";
            }
            else
            {
                StatusText.Text = "ATENÇÃO";
                HeaderText.Text = "Preparação Concluída com Avisos";
                SubHeaderText.Text = $"{result.FailedSteps} step(s) falharam. Verifique os logs para mais detalhes.";
                SubHeaderText.Foreground = new SolidColorBrush(Color.FromRgb(255, 193, 7));
            }
            
            OverallProgress.Value = 100;
            PercentText.Text = "100%";
            
            var totalTime = DateTime.Now - _startTime;
            ElapsedTimeText.Text = $"Tempo total: {totalTime:mm\\:ss}";
            RemainingTimeText.Visibility = Visibility.Collapsed;
            
            AddLog("");
            AddLog($"═══════════════════════════════════════");
            AddLog($"📊 RESUMO DA PREPARAÇÃO");
            AddLog($"═══════════════════════════════════════");
            AddLog($"Modo: {result.Mode}");
            AddLog($"Duração: {result.TotalDuration:mm\\:ss}");
            AddLog($"Sucesso: {result.SuccessfulSteps}");
            AddLog($"Falhas: {result.FailedSteps}");
            AddLog($"Ignorados: {result.SkippedSteps}");
            if (result.RequiresReboot)
            {
                AddLog($"⚠️ REINICIALIZAÇÃO NECESSÁRIA");
            }
            AddLog($"Backup: {result.BackupFolderPath}");
            AddLog($"═══════════════════════════════════════");
            
            // Registrar no histórico (Audit Trail SaaS)
            try
            {
                var historyEntry = new VoltrisOptimizer.Services.OptimizationHistory
                {
                    Id = Guid.NewGuid().ToString(),
                    ActionType = "Prepare PC",
                    Description = $"Preparação completa do PC ({result.Mode}): {result.SuccessfulSteps} steps concluídos",
                    Timestamp = DateTime.Now,
                    Duration = result.TotalDuration,
                    SpaceFreed = 0,
                    Success = result.Success,
                    Details = new Dictionary<string, object>
                    {
                        { "Mode", result.Mode },
                        { "SuccessfulSteps", result.SuccessfulSteps },
                        { "FailedSteps", result.FailedSteps },
                        { "SkippedSteps", result.SkippedSteps },
                        { "RequiresReboot", result.RequiresReboot },
                        { "BackupPath", result.BackupFolderPath ?? "N/A" }
                    }
                };
                VoltrisOptimizer.Services.HistoryService.Instance.AddHistoryEntry(historyEntry);
            }
            catch (Exception histEx)
            {
                App.LoggingService?.LogWarning($"Falha ao salvar histórico do Prepare PC: {histEx.Message}");
            }
        }
        
        private void ShowCancelled()
        {
            CancelBtn.Visibility = Visibility.Collapsed;
            CompletedActions.Visibility = Visibility.Visible;
            RollbackBtn.Visibility = Visibility.Visible;
            
            StatusText.Text = "CANCELADO";
            HeaderText.Text = "Preparação Cancelada";
            SubHeaderText.Text = "A preparação foi cancelada. Você pode reverter as alterações já aplicadas.";
            SubHeaderText.Foreground = new SolidColorBrush(Color.FromRgb(255, 193, 7));
        }
        
        private void ShowError(Exception ex)
        {
            CancelBtn.Visibility = Visibility.Collapsed;
            CompletedActions.Visibility = Visibility.Visible;
            
            StatusText.Text = "ERRO";
            HeaderText.Text = "Erro na Preparação";
            SubHeaderText.Text = ex.Message;
            SubHeaderText.Foreground = new SolidColorBrush(Color.FromRgb(244, 67, 54));
        }
        
        private void CancelBtn_Click(object sender, RoutedEventArgs e)
        {
            var result = MessageBox.Show(
                "Tem certeza que deseja cancelar a preparação?\n\n" +
                "As ações já executadas serão mantidas, mas você poderá revertê-las depois.",
                "Cancelar Preparação",
                MessageBoxButton.YesNo,
                MessageBoxImage.Warning);
            
            if (result == MessageBoxResult.Yes)
            {
                _manager.Cancel();
            }
        }
        
        private async void RollbackBtn_Click(object sender, RoutedEventArgs e)
        {
            var result = MessageBox.Show(
                "Deseja reverter todas as alterações feitas?\n\n" +
                "Isso irá restaurar as configurações anteriores usando os backups criados.",
                "Reverter Alterações",
                MessageBoxButton.YesNo,
                MessageBoxImage.Question);
            
            if (result == MessageBoxResult.Yes)
            {
                RollbackBtn.IsEnabled = false;
                RollbackBtn.Content = "↩️ Revertendo...";
                
                AddLog("");
                AddLog("═══════════════════════════════════════");
                AddLog("↩️ INICIANDO ROLLBACK");
                AddLog("═══════════════════════════════════════");
                
                var success = await _manager.RollbackAsync();
                
                if (success)
                {
                    AddLog("✅ Rollback concluído com sucesso");
                    RollbackBtn.Content = "✅ Revertido";
                    MessageBox.Show(
                        "Todas as alterações foram revertidas com sucesso.",
                        "Rollback Concluído",
                        MessageBoxButton.OK,
                        MessageBoxImage.Information);
                }
                else
                {
                    AddLog("⚠️ Rollback concluído com alguns erros");
                    RollbackBtn.Content = "⚠️ Parcial";
                    RollbackBtn.IsEnabled = true;
                    MessageBox.Show(
                        "Algumas alterações não puderam ser revertidas. Verifique os logs.",
                        "Rollback Parcial",
                        MessageBoxButton.OK,
                        MessageBoxImage.Warning);
                }
            }
        }
        
        private void ViewReportBtn_Click(object sender, RoutedEventArgs e)
        {
            if (_result?.ReportPath != null && File.Exists(_result.ReportPath))
            {
                try
                {
                    System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
                    {
                        FileName = _result.ReportPath,
                        UseShellExecute = true
                    });
                }
                catch
                {
                    // Abrir pasta do backup
                    System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
                    {
                        FileName = Path.GetDirectoryName(_result.ReportPath),
                        UseShellExecute = true
                    });
                }
            }
            else
            {
                MessageBox.Show(
                    "Relatório não encontrado.",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
        }
        
        private void ContinueBtn_Click(object sender, RoutedEventArgs e)
        {
            if (_result?.RequiresReboot == true)
            {
                var result = MessageBox.Show(
                    "Algumas alterações requerem reinicialização.\n\n" +
                    "Deseja reiniciar agora?",
                    "Reinicialização Necessária",
                    MessageBoxButton.YesNoCancel,
                    MessageBoxImage.Question);
                
                if (result == MessageBoxResult.Yes)
                {
                    // Reiniciar
                    System.Diagnostics.Process.Start("shutdown", "/r /t 10 /c \"Reiniciando para aplicar otimizações do Voltris\"");
                    Application.Current.Shutdown();
                    return;
                }
                else if (result == MessageBoxResult.Cancel)
                {
                    return;
                }
            }
            
            OnContinue?.Invoke(this, EventArgs.Empty);
        }
        
        private void ExportLogsBtn_Click(object sender, RoutedEventArgs e)
        {
            var dialog = new SaveFileDialog
            {
                Filter = "Arquivo de Log (*.log)|*.log|Arquivo de Texto (*.txt)|*.txt",
                FileName = $"voltris_preparepc_{DateTime.Now:yyyyMMdd_HHmmss}.log"
            };
            
            if (dialog.ShowDialog() == true)
            {
                try
                {
                    File.WriteAllText(dialog.FileName, _allLogs.ToString());
                    MessageBox.Show(
                        $"Logs exportados para:\n{dialog.FileName}",
                        "Exportação Concluída",
                        MessageBoxButton.OK,
                        MessageBoxImage.Information);
                }
                catch (Exception ex)
                {
                    MessageBox.Show(
                        $"Erro ao exportar logs: {ex.Message}",
                        "Erro",
                        MessageBoxButton.OK,
                        MessageBoxImage.Error);
                }
            }
        }
        
        private string FormatTime(TimeSpan time)
        {
            if (time.TotalHours >= 1)
                return $"{(int)time.TotalHours}h {time.Minutes}min";
            if (time.TotalMinutes >= 1)
                return $"{(int)time.TotalMinutes}min";
            return $"{(int)time.TotalSeconds}s";
        }
    }
}

