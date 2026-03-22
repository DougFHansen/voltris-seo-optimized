using System;
using System.IO;
using System.Text.Json;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Media.Animation;
using VoltrisOptimizer.Core.PreparePc.UI.Views;
using VoltrisOptimizer.Core.PreparePc;
using ShapesPath = System.Windows.Shapes.Path;
using System.Collections.ObjectModel;
using System.ComponentModel;

namespace VoltrisOptimizer.Core.PreparePc.UI.Views
{
    public partial class PreparePcIntroView : UserControl
    {
        public event EventHandler? OnStartRequested;
        public event EventHandler? OnSkip;
        public event EventHandler? OnSchedule;

        public ObservableCollection<UsageMetric> UsageMetrics { get; set; } = new();
        public ObservableCollection<KeyFeature> KeyFeatures { get; set; } = new();

        public PreparePcIntroView()
        {
            InitializeComponent();
            DataContext = this;
            LoadDefaultData();
            AnimateEntrance();
        }

        private void LoadDefaultData()
        {
            // Criar métricas padrão para a intro (valores simulados baseados em otimizações comuns)
            UsageMetrics.Add(new UsageMetric { IconData = "M21,16.5C21,16.88 20.79,17.21 20.47,17.38L12.57,21.82C12.41,21.94 12.21,22 12,22C11.79,22 11.59,21.94 11.43,21.82L3.53,17.38C3.21,17.21 3,16.88 3,16.5V7.5C3,7.12 3.21,6.79 3.53,6.62L11.43,2.18C11.59,2.06 11.79,2 12,2C12.21,2 12.41,2.06 12.57,2.18L20.47,6.62C20.79,6.79 21,7.12 21,7.5V16.5Z", Value = "92", Unit = "%", Label = "SISTEMA" });
            UsageMetrics.Add(new UsageMetric { IconData = "M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M13,7H11V13H17V11H13V7Z", Value = "2.4", Unit = "GB", Label = "MEMÓRIA" });
            UsageMetrics.Add(new UsageMetric { IconData = "M7,2V5H10V2H7M14,2V5H17V2H14M21,2V5H24V2H21M7,8V11H10V8H7M14,8V11H17V8H14M21,8V11H24V8H21M2,13V15H22V13H2M2,18V20H22V18H2", Value = "15", Unit = "min", Label = "TEMPO" });

            // Funcionalidades principais
            KeyFeatures.Add(new KeyFeature { IconData = "M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.47 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z", Title = "Reparo Profundo", Description = "Restaura arquivos corrompidos do sistema e otimiza a integridade do Windows." });
            KeyFeatures.Add(new KeyFeature { IconData = "M13,10h-2V8h2V10zM13,16h-2v-4h2V16zM12,2C6.48,2,2,6.48,2,12s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2z M12,20c-4.41,0-8-3.59-8-8s3.59-8,8-8s8,3.59,8,8S16.41,20,12,20z", Title = "Limpeza Inteligente", Description = "Remove lixo eletrônico, arquivos temporários e resíduos de atualizações antigas." });
        }

        private void AnimateEntrance()
        {
            var fadeIn = new DoubleAnimation(0, 1, TimeSpan.FromMilliseconds(500))
            {
                EasingFunction = new CubicEase { EasingMode = EasingMode.EaseOut }
            };
            this.BeginAnimation(OpacityProperty, fadeIn);
        }

        private void StartButton_Click(object sender, RoutedEventArgs e)
        {
            OnStartRequested?.Invoke(this, EventArgs.Empty);
        }

        private void SkipButton_Click(object sender, RoutedEventArgs e)
        {
            OnSkip?.Invoke(this, EventArgs.Empty);
        }

        private void ScheduleButton_Click(object sender, RoutedEventArgs e)
        {
            ShowScheduleDialog();
        }

        // --- Scheduling Logic (Ported from ProfilerSuccessView) ---
        // Note: Using ProfilerSuccessView.ScheduleData for compatibility if it's public, otherwise we redefine or need to move it.
        // ProfilerSuccessView.ScheduleData is public class ScheduleData at end of file.

        private void ShowScheduleDialog()
        {
            // Criar modal de agendamento same as before
             var dialog = new Window
            {
                Title = "Agendar Prepare PC",
                Width = 480,
                MinHeight = 380,
                WindowStartupLocation = WindowStartupLocation.CenterScreen,
                Owner = Window.GetWindow(this),
                WindowStyle = WindowStyle.None,
                AllowsTransparency = true,
                Background = Brushes.Transparent,
                ResizeMode = ResizeMode.NoResize,
                Topmost = true
            };
            dialog.SizeToContent = SizeToContent.Height;
            
            var mainBorder = new Border
            {
                Background = new SolidColorBrush(Color.FromRgb(10, 10, 15)), // #0A0A0F
                BorderBrush = new SolidColorBrush(Color.FromRgb(30, 30, 46)), // #1E1E2E
                BorderThickness = new Thickness(1),
                CornerRadius = new CornerRadius(16),
                Padding = new Thickness(24)
            };
            
            var mainStack = new StackPanel { Margin = new Thickness(0,0,0,4) };
            
            // Header
            var headerStack = new StackPanel { Orientation = Orientation.Horizontal, Margin = new Thickness(0, 0, 0, 20) };
            var calendarIcon = new ShapesPath
            {
                Data = Geometry.Parse("M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z"),
                Fill = (Brush)(TryFindResource("PrimaryBrush") ?? Brushes.RoyalBlue),
                Width = 24,
                Height = 24,
                Stretch = Stretch.Uniform,
                Margin = new Thickness(0, 0, 12, 0),
                VerticalAlignment = VerticalAlignment.Center
            };
            headerStack.Children.Add(calendarIcon);
            var headerTextStack = new StackPanel();
            headerTextStack.Children.Add(new TextBlock 
            { 
                Text = "Agendar Prepare PC", 
                FontSize = 18, 
                FontWeight = FontWeights.SemiBold, 
                Foreground = (Brush)(TryFindResource("TextPrimaryBrush") ?? Brushes.White) 
            });
            headerTextStack.Children.Add(new TextBlock 
            { 
                Text = "Escolha quando executar a preparação", 
                FontSize = 12, 
                Foreground = (Brush)(TryFindResource("TextMutedBrush") ?? Brushes.Gray),
                Margin = new Thickness(0, 4, 0, 0)
            });
            headerStack.Children.Add(headerTextStack);
            mainStack.Children.Add(headerStack);
            
            // Opções de agendamento
            var optionsStack = new StackPanel { Margin = new Thickness(0, 0, 0, 20) };
            
            // Opção 1: Próxima inicialização
            var option1 = CreateScheduleOption(
                "M12,2L13.09,8.26L22,9L13.09,9.74L12,16L10.91,9.74L2,9L10.91,8.26L12,2Z", 
                "Na próxima inicialização", 
                "O Prepare PC será executado quando você abrir o Voltris novamente",
                true);
            optionsStack.Children.Add(option1);
            
            // Opção 2: Em X horas
            var option2 = CreateScheduleOption(
                "M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z", 
                "Em algumas horas", 
                "Agende para executar em 2, 4 ou 8 horas",
                false);
            optionsStack.Children.Add(option2);
            
            // Opção 3: Data específica
            var option3 = CreateScheduleOption(
                "M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1M17,12H12V17H17V12Z", 
                "Data e hora específica", 
                "Escolha exatamente quando executar",
                false);
            optionsStack.Children.Add(option3);
            
            mainStack.Children.Add(optionsStack);
            
            // Seletor de horas (inicialmente oculto)
            var hoursPanel = new StackPanel { Visibility = Visibility.Collapsed, Margin = new Thickness(0, 0, 0, 16) };
            var hoursLabel = new TextBlock 
            { 
                Text = "Selecione o intervalo:", 
                Foreground = (Brush)(TryFindResource("TextSecondaryBrush") ?? Brushes.LightGray),
                FontSize = 13,
                Margin = new Thickness(0, 0, 0, 8)
            };
            hoursPanel.Children.Add(hoursLabel);
            
            var hoursButtonsPanel = new StackPanel { Orientation = Orientation.Horizontal };
            var hours2Btn = CreateHoursButton("2 horas");
            var hours4Btn = CreateHoursButton("4 horas");
            var hours8Btn = CreateHoursButton("8 horas");
            hoursButtonsPanel.Children.Add(hours2Btn);
            hoursButtonsPanel.Children.Add(hours4Btn);
            hoursButtonsPanel.Children.Add(hours8Btn);
            hoursPanel.Children.Add(hoursButtonsPanel);
            mainStack.Children.Add(hoursPanel);
            
            // Date/Time picker (inicialmente oculto)
            var datePanel = new StackPanel { Visibility = Visibility.Collapsed, Margin = new Thickness(0, 0, 0, 16) };
            var datePicker = new DatePicker 
            { 
                SelectedDate = DateTime.Now.AddDays(1),
                SelectedDateFormat = DatePickerFormat.Short,
                Background = Brushes.White,
                Foreground = Brushes.Black,
                BorderBrush = (Brush)(TryFindResource("DarkBorderBrush") ?? Brushes.Gray),
                Margin = new Thickness(0, 0, 0, 8)
            };
            // Garantir texto legível na caixa branca
            datePicker.Loaded += (s, e) =>
            {
                try
                {
                    var tb = FindVisualChild<TextBox>(datePicker);
                    if (tb != null)
                    {
                        tb.Background = Brushes.White;
                        tb.Foreground = Brushes.Black;
                        tb.Padding = new Thickness(8, 4, 8, 4);
                    }
                }
                catch { }
            };
            datePanel.Children.Add(datePicker);
            mainStack.Children.Add(datePanel);
            
            // Variáveis para rastrear seleção
            int selectedOption = 0;
            int selectedHours = 2;
            
            // Eventos dos options
            (option1 as Border)!.MouseDown += (s, e) => 
            {
                selectedOption = 0;
                UpdateOptionSelection(option1, option2, option3, 0);
                hoursPanel.Visibility = Visibility.Collapsed;
                datePanel.Visibility = Visibility.Collapsed;
            };
            
            (option2 as Border)!.MouseDown += (s, e) => 
            {
                selectedOption = 1;
                UpdateOptionSelection(option1, option2, option3, 1);
                hoursPanel.Visibility = Visibility.Visible;
                datePanel.Visibility = Visibility.Collapsed;
            };
            
            (option3 as Border)!.MouseDown += (s, e) => 
            {
                selectedOption = 2;
                UpdateOptionSelection(option1, option2, option3, 2);
                hoursPanel.Visibility = Visibility.Collapsed;
                datePanel.Visibility = Visibility.Visible;
            };
            
            // Eventos dos botões de horas
            hours2Btn.Click += (s, e) => { selectedHours = 2; UpdateHoursSelection(hours2Btn, hours4Btn, hours8Btn, 0); };
            hours4Btn.Click += (s, e) => { selectedHours = 4; UpdateHoursSelection(hours2Btn, hours4Btn, hours8Btn, 1); };
            hours8Btn.Click += (s, e) => { selectedHours = 8; UpdateHoursSelection(hours2Btn, hours4Btn, hours8Btn, 2); };
            
            // Botões de ação
            var buttonsPanel = new StackPanel 
            { 
                Orientation = Orientation.Horizontal, 
                HorizontalAlignment = HorizontalAlignment.Right,
                Margin = new Thickness(0, 16, 0, 0)
            };
            
            var cancelBtn = new Button
            {
                Content = "Cancelar",
                Padding = new Thickness(20, 10, 20, 10),
                Cursor = System.Windows.Input.Cursors.Hand,
                Margin = new Thickness(0, 0, 10, 0),
                FontFamily = new FontFamily("Segoe UI Variable, Segoe UI")
            };
            cancelBtn.Style = (Style)TryFindResource("NeonSecondaryButtonStyle");
            cancelBtn.Click += (s, e) => dialog.Close();
            
            var confirmBtn = new Button
            {
                Padding = new Thickness(24, 12, 24, 12),
                FontWeight = FontWeights.SemiBold,
                FontFamily = new FontFamily("Segoe UI Variable, Segoe UI"),
                Cursor = System.Windows.Input.Cursors.Hand
            };
            confirmBtn.Style = (Style)TryFindResource("NeonButtonStyle");
            
            var confirmStack = new StackPanel { Orientation = Orientation.Horizontal };
            var checkPath = new ShapesPath
            {
                Data = Geometry.Parse("M9,16.17L4.83,12L3.41,13.41L9,19L21,7L19.59,5.59L9,16.17Z"),
                Fill = Brushes.White,
                Width = 16,
                Height = 16,
                Stretch = Stretch.Uniform,
                Margin = new Thickness(0, 0, 8, 0),
                VerticalAlignment = VerticalAlignment.Center
            };
            confirmStack.Children.Add(checkPath);
            confirmStack.Children.Add(new TextBlock 
            { 
                Text = "Confirmar Agendamento",
                VerticalAlignment = VerticalAlignment.Center
            });
            confirmBtn.Content = confirmStack;
            confirmBtn.Click += (s, e) =>
            {
                DateTime scheduledTime;
                
                switch (selectedOption)
                {
                    case 0: // Próxima inicialização
                        scheduledTime = DateTime.MinValue; // Flag especial
                        break;
                    case 1: // Em X horas
                        scheduledTime = DateTime.Now.AddHours(selectedHours);
                        break;
                    case 2: // Data específica
                        scheduledTime = datePicker.SelectedDate ?? DateTime.Now.AddDays(1);
                        break;
                    default:
                        scheduledTime = DateTime.MinValue;
                        break;
                }
                
                // Using reflection or duplicated method to save
                SaveSchedule(scheduledTime, selectedOption);
                dialog.Close();
                
                ShowScheduleConfirmation(scheduledTime, selectedOption);
                
                OnSchedule?.Invoke(this, EventArgs.Empty);
            };
            
            buttonsPanel.Children.Add(cancelBtn);
            buttonsPanel.Children.Add(confirmBtn);
            mainStack.Children.Add(buttonsPanel);
            
            // Evitar corte dos botões em telas menores
            var scroller = new ScrollViewer
            {
                VerticalScrollBarVisibility = ScrollBarVisibility.Auto,
                HorizontalScrollBarVisibility = ScrollBarVisibility.Disabled,
                Content = mainStack
            };
            mainBorder.Child = scroller;
            dialog.Content = mainBorder;
            
            // Permitir arrastar a janela
            mainBorder.MouseDown += (s, e) =>
            {
                if (e.ChangedButton == System.Windows.Input.MouseButton.Left)
                    dialog.DragMove();
            };
            
            dialog.ShowDialog();
        }

        private void SaveSchedule(DateTime scheduledTime, int scheduleType)
        {
             // Duplicate logic from ProfilerSuccessView pending improved shared service
             try
            {
                 var path = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                    "Voltris", "preparepc_schedule.json");
                    
                var schedule = new ScheduleData
                {
                    ScheduledTime = scheduledTime,
                    ScheduleType = scheduleType,
                    CreatedAt = DateTime.Now,
                    IsNextStartup = scheduleType == 0
                };
                
                var dir = Path.GetDirectoryName(path);
                if (!string.IsNullOrEmpty(dir))
                    Directory.CreateDirectory(dir);
                
                var json = JsonSerializer.Serialize(schedule, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(path, json);
                
                App.LoggingService?.LogInfo($"[PreparePc] Agendamento salvo: Type={scheduleType}, Time={scheduledTime}");
                
                // Se for agendamento por tempo, criar tarefa no Windows
                if (scheduleType == 1 || scheduleType == 2)
                {
                    CreateWindowsScheduledTask(scheduledTime);
                }
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[PreparePc] Erro ao salvar agendamento", ex);
            }
        }
        
        private void CreateWindowsScheduledTask(DateTime scheduledTime)
        {
             // Duplicate logic
             try
            {
                var exePath = System.Reflection.Assembly.GetExecutingAssembly().Location.Replace(".dll", ".exe");
                var taskName = "VoltrisPreparePc";
                
                var psi = new System.Diagnostics.ProcessStartInfo
                {
                    FileName = "schtasks",
                    Arguments = $"/create /tn \"{taskName}\" /tr \"\\\"{exePath}\\\" --preparepc\" /sc once /st {scheduledTime:HH:mm} /sd {scheduledTime:dd/MM/yyyy} /f",
                    UseShellExecute = false,
                    CreateNoWindow = true
                };
                
                using var proc = System.Diagnostics.Process.Start(psi);
                proc?.WaitForExit(5000);
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogWarning($"[PreparePc] Não foi possível criar tarefa agendada: {ex.Message}");
            }
        }
        
        private void ShowScheduleConfirmation(DateTime scheduledTime, int scheduleType)
        {
            string message;
            
            if (scheduleType == 0)
            {
                message = "O Prepare PC será executado na próxima vez que você iniciar o Voltris.";
            }
            else if (scheduleType == 1)
            {
                var hours = (scheduledTime - DateTime.Now).TotalHours;
                message = $"O Prepare PC foi agendado para daqui a {hours:F0} horas ({scheduledTime:HH:mm}).";
            }
            else
            {
                message = $"O Prepare PC foi agendado para {scheduledTime:dd/MM/yyyy às HH:mm}.";
            }
            
            MessageBox.Show(
                message + "\n\nVocê pode cancelar ou modificar o agendamento nas configurações.",
                "✓ Agendamento Confirmado",
                MessageBoxButton.OK,
                MessageBoxImage.Information);
        }

        private Border CreateScheduleOption(string iconPath, string title, string description, bool isSelected)
        {
            var border = new Border
            {
                Background = isSelected 
                    ? new SolidColorBrush(Color.FromRgb(37, 37, 53)) // #252535
                    : new SolidColorBrush(Color.FromRgb(18, 18, 26)), // #12121A
                BorderBrush = isSelected 
                    ? (Brush)(TryFindResource("PrimaryBrush") ?? Brushes.RoyalBlue)
                    : new SolidColorBrush(Color.FromRgb(30, 30, 46)), // #1E1E2E
                BorderThickness = new Thickness(isSelected ? 2 : 1),
                CornerRadius = new CornerRadius(12),
                Padding = new Thickness(16, 12, 16, 12),
                Margin = new Thickness(0, 0, 0, 10),
                Cursor = System.Windows.Input.Cursors.Hand
            };
            
            if (isSelected)
            {
                border.Effect = new System.Windows.Media.Effects.DropShadowEffect
                {
                    BlurRadius = 15,
                    ShadowDepth = 0,
                    Color = Colors.Purple,
                    Opacity = 0.4
                };
            }
            
            var stack = new StackPanel { Orientation = Orientation.Horizontal };
            
            var iconPathElement = new ShapesPath
            {
                Data = Geometry.Parse(iconPath),
                Fill = isSelected ? (Brush)(TryFindResource("PrimaryBrush") ?? Brushes.RoyalBlue) : (Brush)(TryFindResource("TextSecondaryBrush") ?? Brushes.Gray),
                Width = 20,
                Height = 20,
                Stretch = Stretch.Uniform,
                Margin = new Thickness(0, 0, 14, 0),
                VerticalAlignment = VerticalAlignment.Center
            };
            
            var textStack = new StackPanel();
            textStack.Children.Add(new TextBlock
            {
                Text = title,
                FontSize = 14,
                FontWeight = FontWeights.SemiBold,
                FontFamily = new FontFamily("Segoe UI Variable, Segoe UI"),
                Foreground = (Brush)(TryFindResource("TextPrimaryBrush") ?? Brushes.White)
            });
            textStack.Children.Add(new TextBlock
            {
                Text = description,
                FontSize = 11,
                FontFamily = new FontFamily("Segoe UI Variable, Segoe UI"),
                Foreground = (Brush)(TryFindResource("TextMutedBrush") ?? Brushes.Gray),
                Margin = new Thickness(0, 3, 0, 0)
            });
            
            stack.Children.Add(iconPathElement);
            stack.Children.Add(textStack);
            border.Child = stack;
            
            border.Tag = isSelected;
            
            return border;
        }

        private Button CreateHoursButton(string text)
        {
            var btn = new Button
            {
                Content = text,
                Padding = new Thickness(16, 8, 16, 8),
                Background = (Brush)(TryFindResource("DarkPanelAltBrush") ?? new SolidColorBrush(Color.FromRgb(20, 20, 25))),
                Foreground = (Brush)(TryFindResource("TextSecondaryBrush") ?? Brushes.Gray),
                BorderThickness = new Thickness(1),
                BorderBrush = (Brush)(TryFindResource("DarkBorderBrush") ?? Brushes.Gray),
                Margin = new Thickness(0, 0, 8, 0),
                Cursor = System.Windows.Input.Cursors.Hand
            };
            return btn;
        }

        private void UpdateOptionSelection(Border opt1, Border opt2, Border opt3, int selected)
        {
            var options = new[] { opt1, opt2, opt3 };
            for (int i = 0; i < options.Length; i++)
            {
                options[i].Background = i == selected 
                    ? (Brush)(TryFindResource("DarkHoverBrush") ?? new SolidColorBrush(Color.FromRgb(30, 30, 40)))
                    : (Brush)(TryFindResource("DarkPanelAltBrush") ?? new SolidColorBrush(Color.FromRgb(20, 20, 25)));
                options[i].BorderBrush = i == selected 
                    ? (Brush)(TryFindResource("PrimaryBrush") ?? Brushes.RoyalBlue)
                    : (Brush)(TryFindResource("DarkBorderBrush") ?? Brushes.DimGray);
                options[i].BorderThickness = new Thickness(i == selected ? 2 : 1);
            }
        }

        private void UpdateHoursSelection(Button btn2, Button btn4, Button btn8, int selected)
        {
            var buttons = new[] { btn2, btn4, btn8 };
            for (int i = 0; i < buttons.Length; i++)
            {
                buttons[i].Background = i == selected 
                    ? (Brush)(TryFindResource("VoltrisGradientBrush") ?? Brushes.RoyalBlue)
                    : (Brush)(TryFindResource("DarkPanelAltBrush") ?? new SolidColorBrush(Color.FromRgb(20, 20, 25)));
                buttons[i].Foreground = i == selected 
                    ? Brushes.White 
                    : (Brush)(TryFindResource("TextSecondaryBrush") ?? Brushes.Gray);
            }
        }

        private static T? FindVisualChild<T>(DependencyObject parent) where T : DependencyObject
        {
            for (int i = 0; i < VisualTreeHelper.GetChildrenCount(parent); i++)
            {
                var child = VisualTreeHelper.GetChild(parent, i);
                if (child is T t)
                    return t;
                var result = FindVisualChild<T>(child);
                if (result != null)
                    return result;
            }
            return null;
        }
    }

    public class UsageMetric
    {
        public string IconData { get; set; } = string.Empty;
        public string Value { get; set; } = string.Empty;
        public string Unit { get; set; } = string.Empty;
        public string Label { get; set; } = string.Empty;
    }

    public class KeyFeature
    {
        public string IconData { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
    }
}
