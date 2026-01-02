using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using VoltrisOptimizer.Core.PreparePc.Interfaces;
using VoltrisOptimizer.Utils;

namespace VoltrisOptimizer.Core.PreparePc.UI.Views
{
    /// <summary>
    /// Modal de confirmação para Prepare PC
    /// </summary>
    public partial class PreparePcConfirmationView : UserControl
    {
        private readonly PreparePcManager _manager;
        private readonly PreCheckResult? _preCheckResult;
        private PreparePcOptions _options = new();
        
        /// <summary>
        /// Evento disparado quando o usuário escolhe prosseguir
        /// </summary>
        public event EventHandler<PreparePcOptions>? OnProceed;
        
        /// <summary>
        /// Evento disparado quando o usuário escolhe pular
        /// </summary>
        public event EventHandler? OnSkip;
        
        /// <summary>
        /// Evento disparado quando o usuário escolhe agendar
        /// </summary>
        public event EventHandler? OnSchedule;
        
        public PreparePcConfirmationView()
        {
            InitializeComponent();
            _manager = new PreparePcManager(App.LoggingService!);
            
            // Configurar eventos de modo
            DryRunMode.Checked += Mode_Changed;
            RecommendedMode.Checked += Mode_Changed;
            FullMode.Checked += Mode_Changed;
            
            // Carregar pré-checks e steps
            Loaded += async (s, e) =>
            {
                await LoadPreChecksAsync();
                LoadSteps();
                UpdateUI();
            };
        }
        
        public PreparePcConfirmationView(PreCheckResult preCheckResult) : this()
        {
            _preCheckResult = preCheckResult;
        }
        
        private async System.Threading.Tasks.Task LoadPreChecksAsync()
        {
            try
            {
                var result = _preCheckResult ?? await _manager.RunPreChecksAsync();
                
                // Mostrar warnings
                var allWarnings = result.Warnings.Concat(result.Errors).ToList();
                if (allWarnings.Any())
                {
                    WarningsPanel.Visibility = Visibility.Visible;
                    WarningsList.ItemsSource = allWarnings;
                }
                
                // Desabilitar botão se não pode prosseguir
                if (!result.CanProceed)
                {
                    StartBtn.IsEnabled = false;
                    StartBtn.Content = "❌ Não é possível prosseguir";
                    StartBtn.ToolTip = string.Join("\n", result.Errors);
                }
                
                // Mostrar info de admin
                if (!result.IsAdmin)
                {
                    var adminWarning = new Border
                    {
                        Background = new SolidColorBrush(Color.FromRgb(42, 26, 26)),
                        BorderBrush = new SolidColorBrush(Color.FromRgb(255, 107, 107)),
                        BorderThickness = new Thickness(1),
                        CornerRadius = new CornerRadius(8),
                        Padding = new Thickness(16),
                        Margin = new Thickness(0, 0, 0, 16)
                    };
                    
                    var adminStack = new StackPanel();
                    adminStack.Children.Add(new TextBlock
                    {
                        Text = "🔒 Privilégios de Administrador Necessários",
                        Foreground = new SolidColorBrush(Colors.Salmon),
                        FontWeight = FontWeights.SemiBold
                    });
                    
                    var elevateBtn = new Button
                    {
                        Content = "🚀 Reiniciar como Administrador",
                        Margin = new Thickness(0, 8, 0, 0),
                        Padding = new Thickness(16, 8, 16, 8),
                        Background = new SolidColorBrush(Color.FromRgb(108, 92, 231)),
                        Foreground = new SolidColorBrush(Colors.White),
                        BorderThickness = new Thickness(0),
                        Cursor = System.Windows.Input.Cursors.Hand
                    };
                    elevateBtn.Click += ElevateBtn_Click;
                    adminStack.Children.Add(elevateBtn);
                    
                    adminWarning.Child = adminStack;
                    
                    // Inserir após header
                    var parent = WarningsPanel.Parent as Grid;
                    if (parent != null)
                    {
                        Grid.SetRow(adminWarning, 1);
                        parent.Children.Insert(1, adminWarning);
                    }
                }
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[PreparePc] Erro ao carregar pré-checks", ex);
            }
        }
        
        private void LoadSteps()
        {
            StepsList.Children.Clear();
            
            _options.Mode = GetSelectedMode();
            var steps = _manager.GetStepsToRun(_options);
            
            foreach (var (name, description, risk, estimatedSeconds) in steps)
            {
                var stepPanel = new StackPanel 
                { 
                    Orientation = Orientation.Horizontal,
                    Margin = new Thickness(0, 4, 0, 4)
                };
                
                // Ícone de risco
                var riskIcon = risk switch
                {
                    RiskCategory.Safe => "✅",
                    RiskCategory.Conditional => "⚠️",
                    RiskCategory.Risky => "❌",
                    _ => "•"
                };
                
                var riskColor = risk switch
                {
                    RiskCategory.Safe => Colors.LightGreen,
                    RiskCategory.Conditional => Colors.Yellow,
                    RiskCategory.Risky => Colors.Salmon,
                    _ => Colors.Gray
                };
                
                stepPanel.Children.Add(new TextBlock
                {
                    Text = riskIcon,
                    FontSize = 14,
                    VerticalAlignment = VerticalAlignment.Center,
                    Margin = new Thickness(0, 0, 8, 0)
                });
                
                stepPanel.Children.Add(new TextBlock
                {
                    Text = name,
                    Foreground = new SolidColorBrush(riskColor),
                    FontWeight = FontWeights.SemiBold,
                    VerticalAlignment = VerticalAlignment.Center,
                    Margin = new Thickness(0, 0, 8, 0)
                });
                
                stepPanel.Children.Add(new TextBlock
                {
                    Text = $"- {description}",
                    Foreground = new SolidColorBrush(Color.FromRgb(160, 160, 160)),
                    FontSize = 12,
                    VerticalAlignment = VerticalAlignment.Center
                });
                
                // Tempo estimado
                if (estimatedSeconds > 0)
                {
                    stepPanel.Children.Add(new TextBlock
                    {
                        Text = $" (~{FormatTime(estimatedSeconds)})",
                        Foreground = new SolidColorBrush(Color.FromRgb(100, 100, 100)),
                        FontSize = 11,
                        VerticalAlignment = VerticalAlignment.Center
                    });
                }
                
                StepsList.Children.Add(stepPanel);
            }
            
            // Atualizar tempo estimado total
            var totalMinutes = _manager.GetEstimatedTimeMinutes(_options);
            EstimatedTimeText.Text = $"Tempo estimado: {totalMinutes}-{totalMinutes * 2} minutos";
            
            // Atualizar caminho de backup
            var backupPath = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                "Voltris", "Backups");
            BackupPathText.Text = $"Backups em: {backupPath}";
        }
        
        private void Mode_Changed(object sender, RoutedEventArgs e)
        {
            UpdateUI();
            LoadSteps();
        }
        
        private void UpdateUI()
        {
            var mode = GetSelectedMode();
            
            // Mostrar confirmação extra para modo Full
            FullModeConfirmation.Visibility = mode == PreparePcMode.Full 
                ? Visibility.Visible 
                : Visibility.Collapsed;
            
            // Atualizar texto do botão
            StartBtn.Content = mode switch
            {
                PreparePcMode.DryRun => "🔍 Simular Preparação",
                PreparePcMode.Recommended => "✅ Iniciar Preparação",
                PreparePcMode.Full => "⚡ Iniciar Preparação Completa",
                _ => "▶️ Iniciar"
            };
        }
        
        private PreparePcMode GetSelectedMode()
        {
            if (DryRunMode.IsChecked == true) return PreparePcMode.DryRun;
            if (FullMode.IsChecked == true) return PreparePcMode.Full;
            return PreparePcMode.Recommended;
        }
        
        private void StartBtn_Click(object sender, RoutedEventArgs e)
        {
            var mode = GetSelectedMode();
            
            // Verificar confirmação para modo Full
            if (mode == PreparePcMode.Full && FullModeConfirmCheck.IsChecked != true)
            {
                MessageBox.Show(
                    "Por favor, confirme que você entende os riscos do modo Completo.",
                    "Confirmação Necessária",
                    MessageBoxButton.OK,
                    MessageBoxImage.Warning);
                return;
            }
            
            _options.Mode = mode;
            OnProceed?.Invoke(this, _options);
        }
        
        private void SkipBtn_Click(object sender, RoutedEventArgs e)
        {
            OnSkip?.Invoke(this, EventArgs.Empty);
        }
        
        private void ScheduleBtn_Click(object sender, RoutedEventArgs e)
        {
            OnSchedule?.Invoke(this, EventArgs.Empty);
        }
        
        private void CreateRestorePointBtn_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                // Abrir painel de proteção do sistema
                var psi = new System.Diagnostics.ProcessStartInfo
                {
                    FileName = "SystemPropertiesProtection.exe",
                    UseShellExecute = true,
                    Verb = AdminHelper.IsRunningAsAdministrator() ? "" : "runas"
                };
                System.Diagnostics.Process.Start(psi);
                
                MessageBox.Show(
                    "O painel de Proteção do Sistema foi aberto.\n\n" +
                    "Clique em 'Criar...' para criar um ponto de restauração antes de prosseguir.",
                    "Criar Ponto de Restauração",
                    MessageBoxButton.OK,
                    MessageBoxImage.Information);
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[PreparePc] Erro ao abrir proteção do sistema", ex);
                MessageBox.Show(
                    "Não foi possível abrir o painel de Proteção do Sistema.\n\n" +
                    "Você pode acessá-lo manualmente: Painel de Controle > Sistema > Proteção do Sistema",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
        }
        
        private void ElevateBtn_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var exePath = System.Reflection.Assembly.GetExecutingAssembly().Location;
                // Para .NET 8, usar o executável .exe, não .dll
                exePath = exePath.Replace(".dll", ".exe");
                
                var psi = new System.Diagnostics.ProcessStartInfo
                {
                    FileName = exePath,
                    UseShellExecute = true,
                    Verb = "runas"
                };
                System.Diagnostics.Process.Start(psi);
                Application.Current.Shutdown();
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[PreparePc] Erro ao elevar privilégios", ex);
                MessageBox.Show(
                    "Não foi possível reiniciar como Administrador.\n\n" +
                    "Por favor, feche o programa e execute-o novamente clicando com o botão direito e selecionando 'Executar como Administrador'.",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
        }
        
        private string FormatTime(int seconds)
        {
            if (seconds < 60) return $"{seconds}s";
            if (seconds < 3600) return $"{seconds / 60}min";
            return $"{seconds / 3600}h {(seconds % 3600) / 60}min";
        }
    }
}

