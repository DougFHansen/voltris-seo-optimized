using System;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using VoltrisUninstaller.Core;

namespace VoltrisUninstaller
{
    public partial class MainWindow : Window
    {
        private readonly ILogger _logger;
        private readonly UninstallOptions _options;
        private bool _isUninstalling = false;

        public MainWindow(ILogger logger, UninstallOptions options)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _options = options ?? throw new ArgumentNullException(nameof(options));
            
            InitializeComponent();
            
            // Aplicar cantos arredondados perfeitos (Windows 10/11)
            WindowRoundedCornersHelper.ApplyRoundedCorners(this, cornerRadius: 12);
            
            // Aplicar estilo do ScrollViewer diretamente
            ApplyScrollViewerStyle();
            
            // Configurar opções da UI
            KeepUserDataCheckBox.IsChecked = _options.KeepUserData;
            KeepUserDataCheckBox.Checked += (s, e) => _options.KeepUserData = true;
            KeepUserDataCheckBox.Unchecked += (s, e) => _options.KeepUserData = false;
        }
        
        private void ApplyScrollViewerStyle()
        {
            // Forçar o ScrollBar a aparecer
            ContentScroll.VerticalScrollBarVisibility = ScrollBarVisibility.Auto;
            ContentScroll.HorizontalScrollBarVisibility = ScrollBarVisibility.Disabled;
            
            // Aplicar estilo após o Loaded para garantir que os recursos estejam disponíveis
            this.Loaded += (s, e) =>
            {
                try
                {
                    // Aplicar estilo do ScrollViewer se disponível
                    if (Application.Current.Resources.Contains("ModernScrollViewerStyle"))
                    {
                        ContentScroll.Style = (System.Windows.Style)Application.Current.Resources["ModernScrollViewerStyle"];
                    }
                    
                    // Garantir que o ScrollBar tenha o estilo correto
                    var scrollBar = ContentScroll.Template?.FindName("PART_VerticalScrollBar", ContentScroll) as System.Windows.Controls.Primitives.ScrollBar;
                    if (scrollBar != null && Application.Current.Resources.Contains("ModernVerticalScrollBarStyle"))
                    {
                        scrollBar.Style = (System.Windows.Style)Application.Current.Resources["ModernVerticalScrollBarStyle"];
                    }
                }
                catch
                {
                    // Tentar método alternativo com reflection
                    try
                    {
                        var scrollBarField = typeof(ScrollViewer).GetField("_verticalScrollBar", 
                            System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Instance);
                        
                        if (scrollBarField != null)
                        {
                            var scrollBar = scrollBarField.GetValue(ContentScroll) as System.Windows.Controls.Primitives.ScrollBar;
                            if (scrollBar != null && Application.Current.Resources.Contains("ModernVerticalScrollBarStyle"))
                            {
                                scrollBar.Style = (System.Windows.Style)Application.Current.Resources["ModernVerticalScrollBarStyle"];
                            }
                        }
                    }
                    catch { }
                }
            };
        }

        private void Header_MouseLeftButtonDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            if (e.ChangedButton == System.Windows.Input.MouseButton.Left && e.ButtonState == System.Windows.Input.MouseButtonState.Pressed)
            {
                try
                {
                    DragMove();
                }
                catch
                {
                    // Ignorar erros de DragMove (pode ocorrer se o mouse não estiver pressionado)
                }
            }
        }
        
        private void MinimizeButton_Click(object sender, RoutedEventArgs e)
        {
            WindowState = WindowState.Minimized;
        }
        
        private void CloseButton_Click(object sender, RoutedEventArgs e)
        {
            if (!_isUninstalling)
            {
                Close();
            }
        }

        private void CancelButton_Click(object sender, RoutedEventArgs e)
        {
            if (!_isUninstalling)
            {
                Close();
            }
        }

        private async void UninstallButton_Click(object sender, RoutedEventArgs e)
        {
            if (_isUninstalling)
                return;

            _isUninstalling = true;
            _options.KeepUserData = KeepUserDataCheckBox.IsChecked ?? false;

            // Desabilitar botões e checkbox
            UninstallButton.IsEnabled = false;
            CancelButton.IsEnabled = false;
            KeepUserDataCheckBox.IsEnabled = false;

            // Ocultar elementos desnecessários e mostrar progresso IMEDIATAMENTE
            Dispatcher.Invoke(() =>
            {
                // Ocultar elementos que não são mais necessários
                TitleTextBlock.Visibility = Visibility.Collapsed;
                DescriptionTextBlock.Visibility = Visibility.Collapsed;
                KeepUserDataCheckBox.Visibility = Visibility.Collapsed;
                
                // Mostrar progress bar
                ProgressBar.Visibility = Visibility.Visible;
                ProgressBar.Value = 1;
                
                // Atualizar status
                StatusText.Text = "Iniciando desinstalação...";
                
                // Forçar atualização visual e layout
                UpdateLayout();
                
                // Rolar o ScrollViewer para o topo (já que os elementos acima foram ocultados)
                ContentScroll.ScrollToTop();
                
                // Forçar renderização
                InvalidateVisual();
            }, System.Windows.Threading.DispatcherPriority.Send);

            // Aguardar um pouco para garantir que a UI seja atualizada
            await Task.Delay(300);

            try
            {
                var uninstaller = new Uninstaller(_logger, _options);
                var progress = new Progress<UninstallProgress>(p =>
                {
                    Dispatcher.Invoke(() =>
                    {
                        ProgressBar.Value = p.Percent;
                        StatusText.Text = p.Step;
                    }, System.Windows.Threading.DispatcherPriority.Normal);
                });

                var result = await uninstaller.ExecuteAsync(progress);

                if (result.Success)
                {
                    StatusText.Text = "Desinstalação concluída com sucesso!";
                    await Task.Delay(2000);
                    
                    Dispatcher.Invoke(() =>
                    {
                        CustomMessageBox.Show(
                            "Desinstalação Concluída",
                            "O Voltris Optimizer foi desinstalado com sucesso.",
                            MessageBoxImage.Information
                        );
                    });
                    
                    Application.Current.Shutdown();
                }
                else
                {
                    StatusText.Text = $"Erro: {result.ErrorMessage}";
                    Dispatcher.Invoke(() =>
                    {
                        CustomMessageBox.Show(
                            "Erro",
                            $"Erro durante a desinstalação:\n\n{result.ErrorMessage}",
                            MessageBoxImage.Error
                        );
                    });
                    
                    // Reabilitar botões
                    UninstallButton.IsEnabled = true;
                    CancelButton.IsEnabled = true;
                    _isUninstalling = false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Erro fatal durante desinstalação", ex);
                StatusText.Text = $"Erro: {ex.Message}";
                Dispatcher.Invoke(() =>
                {
                    CustomMessageBox.Show(
                        "Erro Fatal",
                        $"Erro fatal durante a desinstalação:\n\n{ex.Message}",
                        MessageBoxImage.Error
                    );
                });
                
                // Reabilitar botões
                UninstallButton.IsEnabled = true;
                CancelButton.IsEnabled = true;
                _isUninstalling = false;
            }
        }

        // DragMove agora é feito apenas no header através de Header_MouseLeftButtonDown
    }
}
