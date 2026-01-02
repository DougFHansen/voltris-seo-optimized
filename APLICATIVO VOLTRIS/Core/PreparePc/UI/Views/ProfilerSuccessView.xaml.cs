using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Media.Animation;
using ShapesPath = System.Windows.Shapes.Path;

namespace VoltrisOptimizer.Core.PreparePc.UI.Views
{
    /// <summary>
    /// View de sucesso após aplicar otimizações do Profiler
    /// Oferece a opção de executar o Prepare PC
    /// </summary>
    public partial class ProfilerSuccessView : UserControl
    {
        private static readonly string ScheduleFilePath = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
            "Voltris", "preparepc_schedule.json");
        
        /// <summary>
        /// Evento disparado quando o usuário escolhe iniciar o Prepare PC
        /// </summary>
        public event EventHandler? OnPreparePcRequested;
        
        /// <summary>
        /// Evento disparado quando o usuário escolhe pular para o Dashboard
        /// </summary>
        public event EventHandler? OnSkipToDashboard;
        
        /// <summary>
        /// Evento disparado quando o usuário escolhe agendar para depois
        /// </summary>
        public event EventHandler? OnScheduleRequested;
        
        public ProfilerSuccessView()
        {
            InitializeComponent();
            
            // Adicionar itens padrão ao resumo
            AddDefaultOptimizations();
            
            // Animar entrada
            Loaded += (s, e) => AnimateEntrance();
        }
        
        private void AddDefaultOptimizations()
        {
            var defaultItems = new[]
            {
                ("✓", "Configurações de desempenho aplicadas", "#00B894"),
                ("✓", "Otimizações de rede configuradas", "#00B894"),
                ("✓", "Perfil de energia ajustado", "#00B894")
            };
            
            foreach (var (icon, text, color) in defaultItems)
            {
                AddOptimizationItem(icon, text, color);
            }
        }
        
        private void AddOptimizationItem(string icon, string text, string color)
        {
            var panel = new StackPanel
            {
                Orientation = Orientation.Horizontal,
                Margin = new Thickness(0, 6, 0, 6)
            };
            
            var iconBorder = new Border
            {
                Width = 24,
                Height = 24,
                CornerRadius = new CornerRadius(6),
                Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString(color + "20")),
                Margin = new Thickness(0, 0, 12, 0)
            };
            
            var iconText = new TextBlock
            {
                Text = icon,
                FontSize = 12,
                FontWeight = FontWeights.Bold,
                Foreground = new SolidColorBrush((Color)ColorConverter.ConvertFromString(color)),
                HorizontalAlignment = HorizontalAlignment.Center,
                VerticalAlignment = VerticalAlignment.Center
            };
            iconBorder.Child = iconText;
            
            var textBlock = new TextBlock
            {
                Text = text,
                FontSize = 14,
                Foreground = (Brush)FindResource("TextPrimaryBrush"),
                VerticalAlignment = VerticalAlignment.Center
            };
            
            panel.Children.Add(iconBorder);
            panel.Children.Add(textBlock);
            
            AppliedSummary.Children.Add(panel);
        }
        
        /// <summary>
        /// Define o resumo das otimizações aplicadas
        /// </summary>
        public void SetAppliedOptimizations(IEnumerable<string> optimizations)
        {
            AppliedSummary.Children.Clear();
            
            foreach (var opt in optimizations)
            {
                AddOptimizationItem("✓", opt, "#00B894");
            }
        }
        
        private void AnimateEntrance()
        {
            // Fade in geral
            var fadeIn = new DoubleAnimation(0, 1, TimeSpan.FromMilliseconds(500))
            {
                EasingFunction = new CubicEase { EasingMode = EasingMode.EaseOut }
            };
            this.BeginAnimation(OpacityProperty, fadeIn);
        }
        
        private void PreparePcBtn_Click(object sender, RoutedEventArgs e)
        {
            OnPreparePcRequested?.Invoke(this, EventArgs.Empty);
        }
        
        private void SkipBtn_Click(object sender, RoutedEventArgs e)
        {
            OnSkipToDashboard?.Invoke(this, EventArgs.Empty);
        }
        
        private void ScheduleBtn_Click(object sender, RoutedEventArgs e)
        {
            ShowScheduleDialog();
        }
        
        private void ShowScheduleDialog()
        {
            // Criar modal de agendamento
            var dialog = new Window
            {
                Title = "Agendar Prepare PC",
                Width = 480,
                MinHeight = 380,
                WindowStartupLocation = WindowStartupLocation.CenterOwner,
                Owner = Window.GetWindow(this),
                WindowStyle = WindowStyle.None,
                AllowsTransparency = true,
                Background = Brushes.Transparent,
                ResizeMode = ResizeMode.NoResize
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
                Fill = (Brush)FindResource("PrimaryBrush"),
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
                Foreground = (Brush)FindResource("TextPrimaryBrush") 
            });
            headerTextStack.Children.Add(new TextBlock 
            { 
                Text = "Escolha quando executar a preparação", 
                FontSize = 12, 
                Foreground = (Brush)FindResource("TextMutedBrush"),
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
                Foreground = (Brush)FindResource("TextSecondaryBrush"),
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
                BorderBrush = (Brush)FindResource("DarkBorderBrush"),
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
            cancelBtn.Style = (Style)FindResource("NeonSecondaryButtonStyle");
            cancelBtn.Click += (s, e) => dialog.Close();
            
            var confirmBtn = new Button
            {
                Padding = new Thickness(24, 12, 24, 12),
                FontWeight = FontWeights.SemiBold,
                FontFamily = new FontFamily("Segoe UI Variable, Segoe UI"),
                Cursor = System.Windows.Input.Cursors.Hand
            };
            confirmBtn.Style = (Style)FindResource("NeonButtonStyle");
            
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
                
                SaveSchedule(scheduledTime, selectedOption);
                dialog.Close();
                
                ShowScheduleConfirmation(scheduledTime, selectedOption);
                
                OnScheduleRequested?.Invoke(this, EventArgs.Empty);
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
        
        private Border CreateScheduleOption(string iconPath, string title, string description, bool isSelected)
        {
            var border = new Border
            {
                Background = isSelected 
                    ? new SolidColorBrush(Color.FromRgb(37, 37, 53)) // #252535
                    : new SolidColorBrush(Color.FromRgb(18, 18, 26)), // #12121A
                BorderBrush = isSelected 
                    ? (Brush)FindResource("PrimaryBrush")
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
                Fill = isSelected ? (Brush)FindResource("PrimaryBrush") : (Brush)FindResource("TextSecondaryBrush"),
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
                Foreground = (Brush)FindResource("TextPrimaryBrush")
            });
            textStack.Children.Add(new TextBlock
            {
                Text = description,
                FontSize = 11,
                FontFamily = new FontFamily("Segoe UI Variable, Segoe UI"),
                Foreground = (Brush)FindResource("TextMutedBrush"),
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
                Background = (Brush)FindResource("DarkPanelAltBrush"),
                Foreground = (Brush)FindResource("TextSecondaryBrush"),
                BorderThickness = new Thickness(1),
                BorderBrush = (Brush)FindResource("DarkBorderBrush"),
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
                    ? (Brush)FindResource("DarkHoverBrush")
                    : (Brush)FindResource("DarkPanelAltBrush");
                options[i].BorderBrush = i == selected 
                    ? (Brush)FindResource("PrimaryBrush")
                    : (Brush)FindResource("DarkBorderBrush");
                options[i].BorderThickness = new Thickness(i == selected ? 2 : 1);
            }
        }
        
        private void UpdateHoursSelection(Button btn2, Button btn4, Button btn8, int selected)
        {
            var buttons = new[] { btn2, btn4, btn8 };
            for (int i = 0; i < buttons.Length; i++)
            {
                buttons[i].Background = i == selected 
                    ? (Brush)FindResource("VoltrisGradientBrush")
                    : (Brush)FindResource("DarkPanelAltBrush");
                buttons[i].Foreground = i == selected 
                    ? Brushes.White 
                    : (Brush)FindResource("TextSecondaryBrush");
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
        
        private void SaveSchedule(DateTime scheduledTime, int scheduleType)
        {
            try
            {
                var schedule = new ScheduleData
                {
                    ScheduledTime = scheduledTime,
                    ScheduleType = scheduleType,
                    CreatedAt = DateTime.Now,
                    IsNextStartup = scheduleType == 0
                };
                
                var dir = Path.GetDirectoryName(ScheduleFilePath);
                if (!string.IsNullOrEmpty(dir))
                    Directory.CreateDirectory(dir);
                
                var json = JsonSerializer.Serialize(schedule, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(ScheduleFilePath, json);
                
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
            try
            {
                var exePath = System.Reflection.Assembly.GetExecutingAssembly().Location.Replace(".dll", ".exe");
                var taskName = "VoltrisPreparePc";
                var dateStr = scheduledTime.ToString("yyyy-MM-ddTHH:mm:ss");
                
                // Criar tarefa agendada usando schtasks
                var psi = new System.Diagnostics.ProcessStartInfo
                {
                    FileName = "schtasks",
                    Arguments = $"/create /tn \"{taskName}\" /tr \"\\\"{exePath}\\\" --preparepc\" /sc once /st {scheduledTime:HH:mm} /sd {scheduledTime:dd/MM/yyyy} /f",
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true
                };
                
                using var proc = System.Diagnostics.Process.Start(psi);
                proc?.WaitForExit(5000);
                
                App.LoggingService?.LogInfo($"[PreparePc] Tarefa agendada criada para {scheduledTime}");
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
        
        /// <summary>
        /// Verifica se há agendamento pendente
        /// </summary>
        public static bool HasPendingSchedule()
        {
            try
            {
                if (!File.Exists(ScheduleFilePath))
                    return false;
                
                var json = File.ReadAllText(ScheduleFilePath);
                var schedule = JsonSerializer.Deserialize<ScheduleData>(json);
                
                if (schedule == null)
                    return false;
                
                // Se for próxima inicialização, sempre retorna true
                if (schedule.IsNextStartup)
                    return true;
                
                // Se for agendamento por tempo, verificar se já passou
                if (schedule.ScheduledTime > DateTime.Now)
                    return false; // Ainda não é hora
                
                return true;
            }
            catch
            {
                return false;
            }
        }
        
        /// <summary>
        /// Obtém informações do agendamento pendente
        /// </summary>
        public static ScheduleData? GetPendingSchedule()
        {
            try
            {
                if (!File.Exists(ScheduleFilePath))
                    return null;
                
                var json = File.ReadAllText(ScheduleFilePath);
                return JsonSerializer.Deserialize<ScheduleData>(json);
            }
            catch
            {
                return null;
            }
        }
        
        /// <summary>
        /// Limpa o agendamento
        /// </summary>
        public static void ClearSchedule()
        {
            try
            {
                if (File.Exists(ScheduleFilePath))
                    File.Delete(ScheduleFilePath);
                
                // Remover tarefa agendada do Windows
                var psi = new System.Diagnostics.ProcessStartInfo
                {
                    FileName = "schtasks",
                    Arguments = "/delete /tn \"VoltrisPreparePc\" /f",
                    UseShellExecute = false,
                    CreateNoWindow = true
                };
                
                using var proc = System.Diagnostics.Process.Start(psi);
                proc?.WaitForExit(3000);
            }
            catch
            {
                // Ignorar erros
            }
        }
    }
    
    /// <summary>
    /// Dados do agendamento
    /// </summary>
    public class ScheduleData
    {
        public DateTime ScheduledTime { get; set; }
        public int ScheduleType { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsNextStartup { get; set; }
    }
}
