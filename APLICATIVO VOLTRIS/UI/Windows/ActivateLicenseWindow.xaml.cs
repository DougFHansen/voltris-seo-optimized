using System;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Animation;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.UI.Controls;

namespace VoltrisOptimizer.UI.Windows
{
    /// <summary>
    /// Janela moderna para ativar licença Pro
    /// </summary>
    public partial class ActivateLicenseWindow : Window
    {
        private readonly LicenseManager _licenseManager;
        private readonly ILoggingService? _logger;

        public ActivateLicenseWindow()
        {
            InitializeComponent();
            _licenseManager = LicenseManager.Instance;
            _logger = App.LoggingService;
            Loaded += ActivateLicenseWindow_Loaded;
        }

        private void TitleBar_MouseDown(object sender, MouseButtonEventArgs e)
        {
            if (e.ChangedButton == MouseButton.Left)
            {
                DragMove();
            }
        }

        private async void ActivateLicenseWindow_Loaded(object? sender, RoutedEventArgs e)
        {
            try
            {
                var isValid = await _licenseManager.IsLicenseValidAsync();
                if (isValid)
                {
                    var key = _licenseManager.GetCurrentLicenseKey();
                    LicenseKeyTextBox.Text = key ?? string.Empty;
                    LicenseKeyTextBox.IsReadOnly = true;
                    ActivateButton.IsEnabled = false;
                    HelpTextBlock.Text = "Licença já ativada";
                    StatusPanel.Visibility = Visibility.Collapsed;
                    ActivatedBanner.Visibility = Visibility.Visible;
                    ActivatedKeyText.Text = key ?? string.Empty;
                    InfoPanel.Visibility = Visibility.Collapsed;
                    ActivateButton.Visibility = Visibility.Collapsed;
                    InputPanel.Visibility = Visibility.Collapsed;
                    CancelButton.Content = "Fechar";
                    
                    // Animar ícone de sucesso
                    if (FindResource("SuccessAnimation") is Storyboard successAnim)
                    {
                        successAnim.Begin(this);
                    }
                }
                else
                {
                    LicenseKeyTextBox.IsReadOnly = false;
                    ActivateButton.IsEnabled = false;
                    ActivatedBanner.Visibility = Visibility.Collapsed;
                    InfoPanel.Visibility = Visibility.Visible;
                    ActivateButton.Visibility = Visibility.Visible;
                    InputPanel.Visibility = Visibility.Visible;
                    CancelButton.Content = "Cancelar";
                }
            }
            catch { }
        }

        private void PasteButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (Clipboard.ContainsText())
                {
                    LicenseKeyTextBox.Text = Clipboard.GetText().Trim().ToUpper();
                }
            }
            catch { }
        }

        private void LicenseKeyTextBox_TextChanged(object sender, System.Windows.Controls.TextChangedEventArgs e)
        {
            var licenseKey = LicenseKeyTextBox.Text.Trim().ToUpper();
            
            // Validar formato básico (VOLTRIS-XXXX-XXXX-XXXX ou similar)
            var isValidFormat = !string.IsNullOrEmpty(licenseKey) && licenseKey.Length >= 15;
            
            // Atualizar cor da borda baseado na validação
            if (isValidFormat)
            {
                InputBorder.BorderBrush = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00FF88"));
                ActivateButton.IsEnabled = true;
                HelpTextBlock.Text = "✓ Formato válido";
                HelpTextBlock.Foreground = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00FF88"));
            }
            else if (string.IsNullOrEmpty(licenseKey))
            {
                InputBorder.BorderBrush = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#2A2A3A"));
                ActivateButton.IsEnabled = false;
                HelpTextBlock.Text = "Formato: VOLTRIS-XXXX-XXXX-XXXX";
                HelpTextBlock.Foreground = (Brush)FindResource("TextMutedBrush");
            }
            else
            {
                InputBorder.BorderBrush = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#8B31FF"));
                ActivateButton.IsEnabled = false;
                HelpTextBlock.Text = "Continue digitando...";
                HelpTextBlock.Foreground = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#8B31FF"));
            }
        }

        private async void ActivateButton_Click(object sender, RoutedEventArgs e)
        {
            var licenseKey = LicenseKeyTextBox.Text.Trim().ToUpper();
            
            if (string.IsNullOrEmpty(licenseKey))
            {
                ModernMessageBox.Show(
                    "Por favor, insira uma chave de licença válida.",
                    "Chave Inválida",
                    MessageBoxButton.OK,
                    MessageBoxImage.Warning);
                return;
            }

            // Desabilitar botões e mostrar progresso
            ActivateButton.IsEnabled = false;
            CancelButton.IsEnabled = false;
            LicenseKeyTextBox.IsEnabled = false;
            
            StatusPanel.Visibility = Visibility.Visible;
            ActivationProgressBar.Visibility = Visibility.Visible;
            StatusTextBlock.Text = "🔄 Ativando licença...";
            StatusTextBlock.Foreground = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#31A8FF"));

            try
            {
                // Ativar licença
                var result = await _licenseManager.ActivateLicenseAsync(licenseKey);

                ActivationProgressBar.Visibility = Visibility.Collapsed;

                if (result.Success)
                {
                    StatusTextBlock.Text = "✓ Licença ativada com sucesso!";
                    StatusTextBlock.Foreground = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#00FF88"));
                    
                    // Mostrar banner de sucesso
                    InputPanel.Visibility = Visibility.Collapsed;
                    InfoPanel.Visibility = Visibility.Collapsed;
                    ActivatedBanner.Visibility = Visibility.Visible;
                    ActivatedKeyText.Text = licenseKey;
                    
                    // Animar ícone de sucesso
                    if (FindResource("SuccessAnimation") is Storyboard successAnim)
                    {
                        successAnim.Begin(this);
                    }

                    await Task.Delay(2000);

                    ModernMessageBox.Show(
                        "Licença Pro ativada com sucesso!\n\n" +
                        "Agora você tem acesso a todas as funcionalidades avançadas do Voltris Optimizer.",
                        "Ativação Concluída",
                        MessageBoxButton.OK,
                        MessageBoxImage.Information);

                    DialogResult = true;
                    Close();
                }
                else
                {
                    StatusTextBlock.Text = "✗ Falha na ativação";
                    StatusTextBlock.Foreground = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FF4466"));

                    ModernMessageBox.Show(
                        $"Não foi possível ativar a licença:\n\n{result.Message}\n\n" +
                        "Verifique se:\n" +
                        "• A chave está correta\n" +
                        "• Você está conectado à internet\n" +
                        "• A chave não foi usada em outra máquina",
                        "Erro na Ativação",
                        MessageBoxButton.OK,
                        MessageBoxImage.Error);

                    // Reabilitar botões
                    ActivateButton.IsEnabled = true;
                    CancelButton.IsEnabled = true;
                    LicenseKeyTextBox.IsEnabled = true;
                    StatusPanel.Visibility = Visibility.Collapsed;
                }
            }
            catch (Exception ex)
            {
                _logger?.LogError($"Erro ao ativar licença: {ex.Message}", ex);

                ActivationProgressBar.Visibility = Visibility.Collapsed;
                StatusTextBlock.Text = "✗ Erro de conexão";
                StatusTextBlock.Foreground = new SolidColorBrush((Color)ColorConverter.ConvertFromString("#FF4466"));

                ModernMessageBox.Show(
                    $"Erro ao ativar licença:\n\n{ex.Message}\n\n" +
                    "Verifique sua conexão com a internet e tente novamente.",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);

                // Reabilitar botões
                ActivateButton.IsEnabled = true;
                CancelButton.IsEnabled = true;
                LicenseKeyTextBox.IsEnabled = true;
                StatusPanel.Visibility = Visibility.Collapsed;
            }
        }

        private void CancelButton_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }
    }
}

