using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using VoltrisOptimizer;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.UI.Controls;

namespace VoltrisOptimizer.UI.Views
{
    public partial class SchedulerView : UserControl
    {
        public SchedulerView()
        {
            InitializeComponent();
            Loaded += SchedulerView_Loaded;
            
            // Popular ComboBox de tipo
            ScheduleTypeComboBox.Items.Add("⏰ Diário");
            ScheduleTypeComboBox.Items.Add("📆 Semanal");
            ScheduleTypeComboBox.Items.Add("📅 Mensal");
            ScheduleTypeComboBox.Items.Add("🚀 Na Inicialização");
            ScheduleTypeComboBox.SelectedIndex = 0;
            
            // Popular ComboBoxes de horário
            for (int i = 0; i < 24; i++)
            {
                HourComboBox.Items.Add(i.ToString("D2"));
            }
            HourComboBox.SelectedIndex = 8; // 08:00 por padrão
            
            for (int i = 0; i < 60; i += 5)
            {
                MinuteComboBox.Items.Add(i.ToString("D2"));
            }
            MinuteComboBox.SelectedIndex = 0; // :00 por padrão
        }

        private void SchedulerView_Loaded(object sender, RoutedEventArgs e)
        {
            RefreshTasks();
            UpdateTimePickerVisibility();
        }
        
        private void ScheduleTypeComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            UpdateTimePickerVisibility();
        }
        
        private void UpdateTimePickerVisibility()
        {
            if (TimePickerPanel == null || DaysPickerPanel == null || ScheduleTypeComboBox == null) return;
            
            var selectedIndex = ScheduleTypeComboBox.SelectedIndex;
            
            // Mostrar seletor de horário para Diário e Semanal
            TimePickerPanel.Visibility = (selectedIndex == 0 || selectedIndex == 1) 
                ? Visibility.Visible 
                : Visibility.Collapsed;
            
            // Mostrar seletor de dias apenas para Semanal
            DaysPickerPanel.Visibility = selectedIndex == 1 
                ? Visibility.Visible 
                : Visibility.Collapsed;
        }

        private void RefreshTasks()
        {
            if (TasksListBox == null) return;
            
            TasksListBox.Items.Clear();

            if (App.SchedulerService == null)
            {
                EmptyMessage.Visibility = Visibility.Visible;
                TaskCountText.Text = "Serviço não disponível";
                return;
            }

            var tasks = App.SchedulerService.GetTasks();
            
            if (tasks.Count == 0)
            {
                EmptyMessage.Visibility = Visibility.Visible;
                TaskCountText.Text = "0 tarefas configuradas";
                return;
            }
            
            EmptyMessage.Visibility = Visibility.Collapsed;
            TaskCountText.Text = $"{tasks.Count} tarefa{(tasks.Count > 1 ? "s" : "")} configurada{(tasks.Count > 1 ? "s" : "")}";

            foreach (var task in tasks)
            {
                TasksListBox.Items.Add(CreateTaskCard(task));
            }
        }
        
        private Border CreateTaskCard(ScheduledTask task)
        {
            var border = new Border
            {
                CornerRadius = new CornerRadius(14),
                Padding = new Thickness(20, 18, 20, 18),
                Margin = new Thickness(0, 0, 0, 12)
            };

            // Gradiente de fundo baseado no estado
            if (task.IsEnabled)
            {
                border.Background = new SolidColorBrush(Color.FromArgb(15, 16, 185, 129)); // Verde sutil
                border.BorderBrush = new SolidColorBrush(Color.FromArgb(40, 16, 185, 129));
            }
            else
            {
                border.Background = new SolidColorBrush(Color.FromArgb(15, 107, 114, 128)); // Cinza sutil
                border.BorderBrush = new SolidColorBrush(Color.FromArgb(40, 107, 114, 128));
            }
            border.BorderThickness = new Thickness(1);

            var mainGrid = new Grid();
            mainGrid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Auto) });
            mainGrid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Star) });
            mainGrid.ColumnDefinitions.Add(new ColumnDefinition { Width = new GridLength(1, GridUnitType.Auto) });

            // Ícone de status
            var statusBorder = new Border
            {
                Width = 44,
                Height = 44,
                CornerRadius = new CornerRadius(12),
                Margin = new Thickness(0, 0, 18, 0),
                VerticalAlignment = VerticalAlignment.Center
            };
            
            if (task.IsEnabled)
            {
                statusBorder.Background = new LinearGradientBrush
                {
                    StartPoint = new Point(0, 0),
                    EndPoint = new Point(1, 1),
                    GradientStops = new GradientStopCollection
                    {
                        new GradientStop(Color.FromRgb(16, 185, 129), 0),
                        new GradientStop(Color.FromRgb(5, 150, 105), 1)
                    }
                };
            }
            else
            {
                statusBorder.Background = new SolidColorBrush(Color.FromRgb(75, 85, 99));
            }
            
            var statusIcon = new TextBlock
            {
                Text = task.IsEnabled ? "✓" : "⏸",
                FontSize = 18,
                Foreground = Brushes.White,
                HorizontalAlignment = HorizontalAlignment.Center,
                VerticalAlignment = VerticalAlignment.Center
            };
            statusBorder.Child = statusIcon;
            Grid.SetColumn(statusBorder, 0);
            mainGrid.Children.Add(statusBorder);

            // Conteúdo
            var contentPanel = new StackPanel { VerticalAlignment = VerticalAlignment.Center };
            
            // Nome da tarefa
            contentPanel.Children.Add(new TextBlock
            {
                Text = task.Name,
                FontSize = 15,
                FontWeight = FontWeights.SemiBold,
                Foreground = (SolidColorBrush)Application.Current.Resources["TextPrimaryBrush"],
                Margin = new Thickness(0, 0, 0, 4)
            });
            
            // Descrição do agendamento
            contentPanel.Children.Add(new TextBlock
            {
                Text = GetScheduleDescription(task),
                FontSize = 13,
                Foreground = (SolidColorBrush)Application.Current.Resources["TextSecondaryBrush"],
                Margin = new Thickness(0, 0, 0, 6)
            });
            
            // Ações
            var actionsPanel = new WrapPanel { Orientation = Orientation.Horizontal };
            foreach (var action in task.Actions)
            {
                var actionBadge = new Border
                {
                    Background = new SolidColorBrush(Color.FromArgb(25, 139, 92, 246)),
                    CornerRadius = new CornerRadius(6),
                    Padding = new Thickness(10, 4, 10, 4),
                    Margin = new Thickness(0, 0, 8, 0)
                };
                actionBadge.Child = new TextBlock
                {
                    Text = GetActionEmoji(action) + " " + action,
                    FontSize = 11,
                    FontWeight = FontWeights.Medium,
                    Foreground = new SolidColorBrush(Color.FromRgb(139, 92, 246))
                };
                actionsPanel.Children.Add(actionBadge);
            }
            contentPanel.Children.Add(actionsPanel);
            
            // Próxima execução
            if (task.NextExecution.HasValue && task.IsEnabled)
            {
                var nextExecPanel = new StackPanel { Orientation = Orientation.Horizontal, Margin = new Thickness(0, 8, 0, 0) };
                nextExecPanel.Children.Add(new TextBlock
                {
                    Text = "⏰ Próxima: ",
                    FontSize = 11,
                    Foreground = (SolidColorBrush)Application.Current.Resources["TextMutedBrush"]
                });
                nextExecPanel.Children.Add(new TextBlock
                {
                    Text = task.NextExecution.Value.ToString("dd/MM/yyyy HH:mm"),
                    FontSize = 11,
                    FontWeight = FontWeights.SemiBold,
                    Foreground = new SolidColorBrush(Color.FromRgb(16, 185, 129))
                });
                contentPanel.Children.Add(nextExecPanel);
            }
            
            Grid.SetColumn(contentPanel, 1);
            mainGrid.Children.Add(contentPanel);

            // Botões de ação
            var buttonPanel = new StackPanel 
            { 
                Orientation = Orientation.Horizontal,
                VerticalAlignment = VerticalAlignment.Center
            };
            
            var toggleButton = new Button
            {
                Content = task.IsEnabled ? "⏸ Pausar" : "▶ Ativar",
                Style = (Style)Application.Current.Resources["NeonSecondaryButtonStyle"],
                Height = 40,
                MinWidth = 110,
                Margin = new Thickness(0, 0, 10, 0),
                Tag = task.Id,
                FontSize = 12,
                FontWeight = FontWeights.SemiBold
            };
            toggleButton.Click += (s, e) =>
            {
                task.IsEnabled = !task.IsEnabled;
                App.SchedulerService?.RemoveTask(task.Id);
                App.SchedulerService?.AddTask(task);
                RefreshTasks();
                
                new ToastService().Show(
                    task.IsEnabled ? "Tarefa Ativada" : "Tarefa Pausada",
                    $"'{task.Name}' foi {(task.IsEnabled ? "ativada" : "pausada")}."
                );
            };
            
            var deleteButton = new Button
            {
                Content = "🗑",
                Style = (Style)Application.Current.Resources["NeonSecondaryButtonStyle"],
                Height = 40,
                Width = 40,
                Tag = task.Id,
                FontSize = 14
            };
            deleteButton.Click += (s, e) =>
            {
                if (ModernMessageBox.Show(
                    $"Deseja remover a tarefa '{task.Name}'?\n\nEsta ação não pode ser desfeita.",
                    "Confirmar Remoção",
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Question) == MessageBoxResult.Yes)
                {
                    App.SchedulerService?.RemoveTask(task.Id);
                    RefreshTasks();
                    new ToastService().Show("Tarefa Removida", $"'{task.Name}' foi removida.");
                }
            };
            
            buttonPanel.Children.Add(toggleButton);
            buttonPanel.Children.Add(deleteButton);
            Grid.SetColumn(buttonPanel, 2);
            mainGrid.Children.Add(buttonPanel);

            border.Child = mainGrid;
            return border;
        }
        
        private string GetActionEmoji(string action)
        {
            return action.ToLower() switch
            {
                "limpeza" => "🧹",
                "desempenho" => "⚡",
                "rede" => "🌐",
                "avançado" => "🔧",
                _ => "📋"
            };
        }

        private string GetScheduleDescription(ScheduledTask task)
        {
            return task.ScheduleType switch
            {
                ScheduleType.Daily => $"📅 Diário às {task.ScheduledTime?.ToString("HH:mm") ?? "08:00"}",
                ScheduleType.Weekly => $"📆 Semanal às {task.ScheduledTime?.ToString("HH:mm") ?? "08:00"}",
                ScheduleType.Monthly => "📅 Uma vez por mês",
                ScheduleType.OnStartup => "🚀 Ao iniciar o sistema",
                _ => "Não agendado"
            };
        }

        private void AddTaskButton_Click(object sender, RoutedEventArgs e)
        {
            if (App.SchedulerService == null)
            {
                ModernMessageBox.Show(
                    "Serviço de agendamento não disponível.",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
                return;
            }

            var taskName = TaskNameTextBox.Text?.Trim();
            if (string.IsNullOrWhiteSpace(taskName))
            {
                ModernMessageBox.Show(
                    "Por favor, informe um nome para a tarefa.",
                    "Campo Obrigatório",
                    MessageBoxButton.OK,
                    MessageBoxImage.Warning);
                TaskNameTextBox.Focus();
                return;
            }

            var actions = new List<string>();
            if (ActionCleanup.IsChecked == true) actions.Add("Limpeza");
            if (ActionPerformance.IsChecked == true) actions.Add("Desempenho");
            if (ActionNetwork.IsChecked == true) actions.Add("Rede");
            if (ActionAdvanced.IsChecked == true) actions.Add("Avançado");

            if (actions.Count == 0)
            {
                ModernMessageBox.Show(
                    "Por favor, selecione pelo menos uma ação para executar.",
                    "Selecione uma Ação",
                    MessageBoxButton.OK,
                    MessageBoxImage.Warning);
                return;
            }

            var scheduleType = ScheduleTypeComboBox.SelectedIndex switch
            {
                0 => ScheduleType.Daily,
                1 => ScheduleType.Weekly,
                2 => ScheduleType.Monthly,
                3 => ScheduleType.OnStartup,
                _ => ScheduleType.Daily
            };
            
            // Obter horário selecionado
            DateTime? scheduledTime = null;
            if ((scheduleType == ScheduleType.Daily || scheduleType == ScheduleType.Weekly) 
                && HourComboBox.SelectedItem != null && MinuteComboBox.SelectedItem != null)
            {
                var hour = int.Parse(HourComboBox.SelectedItem.ToString()!);
                var minute = int.Parse(MinuteComboBox.SelectedItem.ToString()!);
                scheduledTime = DateTime.Today.AddHours(hour).AddMinutes(minute);
            }

            var task = new ScheduledTask
            {
                Name = taskName,
                ScheduleType = scheduleType,
                ScheduledTime = scheduledTime,
                Actions = actions,
                IsEnabled = true
            };

            App.SchedulerService.AddTask(task);
            
            // Limpar formulário
            TaskNameTextBox.Clear();
            ActionCleanup.IsChecked = false;
            ActionPerformance.IsChecked = false;
            ActionNetwork.IsChecked = false;
            ActionAdvanced.IsChecked = false;
            
            RefreshTasks();
            
            new ToastService().Show(
                "Tarefa Criada! ✓",
                $"'{taskName}' foi agendada com sucesso."
            );
        }
        
        private void RefreshTasks_Click(object sender, RoutedEventArgs e)
        {
            RefreshTasks();
        }
        
        // Handlers para os cards de ação (toggle checkbox ao clicar no card)
        private void ActionCleanup_Click(object sender, MouseButtonEventArgs e)
        {
            ActionCleanup.IsChecked = !ActionCleanup.IsChecked;
        }
        
        private void ActionPerformance_Click(object sender, MouseButtonEventArgs e)
        {
            ActionPerformance.IsChecked = !ActionPerformance.IsChecked;
        }
        
        private void ActionNetwork_Click(object sender, MouseButtonEventArgs e)
        {
            ActionNetwork.IsChecked = !ActionNetwork.IsChecked;
        }
        
        private void ActionAdvanced_Click(object sender, MouseButtonEventArgs e)
        {
            ActionAdvanced.IsChecked = !ActionAdvanced.IsChecked;
        }
    }
}
