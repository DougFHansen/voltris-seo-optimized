using System;
using System.Windows;
using System.Windows.Input;
using VoltrisOptimizer.UI.ViewModels;
using VoltrisOptimizer.UI.Helpers;
using VoltrisOptimizer.Helpers;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.UI.Views
{
    /// <summary>
    /// Janela de ativação de licença profissional
    /// </summary>
    public partial class LicenseActivationView : Window
    {
        private readonly LicenseActivationViewModel _viewModel;
        
        public bool ActivationSucceeded { get; private set; }
        public bool ContinuedWithTrial { get; set; }
        
        public LicenseActivationView()
        {
            InitializeComponent();
            
            RoundedWindowHelper.Apply(this, 16);
            
            _viewModel = new LicenseActivationViewModel();
            DataContext = _viewModel;
            
            _viewModel.ActivationSucceeded += OnActivationSucceeded;
            _viewModel.CloseRequested += OnCloseRequested;
            
            // Aplicar backdrop quando a janela renderizar
            ContentRendered += (s, e) => ApplyTransparency();

            Loaded += async (s, e) =>
            {
                await _viewModel.InitializeAsync();
                LicenseKeyInput.Focus();
                
                Dispatcher.BeginInvoke(new Action(() => MainScrollViewer.ScrollToTop()), 
                    System.Windows.Threading.DispatcherPriority.Background);
            };
        }

        private void ApplyTransparency()
        {
            try
            {
                var settings = SettingsService.Instance.Settings;
                if (settings.EnableTransparency)
                {
                    bool isLight = settings.Theme?.Equals("Light", StringComparison.OrdinalIgnoreCase) == true;
                    BackdropHelper.ApplyModernBackdrop(this, BackdropHelper.SystemBackdropType.Acrylic, isLight);

                    // Reduzir opacidade do overlay para deixar o backdrop visível
                    if (LicenseOverlay != null)
                        LicenseOverlay.Opacity = 0.55;
                }
                else
                {
                    BackdropHelper.RemoveBackdrop(this);

                    // Restaurar opacidade total do overlay
                    if (LicenseOverlay != null)
                        LicenseOverlay.Opacity = 0.92;
                }
            }
            catch { /* backdrop não suportado — manter visual padrão */ }
        }
        
        /// <summary>
        /// Construtor com parâmetros de inicialização
        /// </summary>
        public LicenseActivationView(bool trialExpired, int trialDaysRemaining) : this()
        {
            if (trialExpired)
            {
                // Esconder botão de continuar trial se expirou
                _viewModel.ContinueTrialCommand.CanExecute(null);
            }
        }
        
        private void OnActivationSucceeded(object? sender, EventArgs e)
        {
            ActivationSucceeded = true;
            DialogResult = true;
            Close();
        }
        
        private void OnCloseRequested(object? sender, EventArgs e)
        {
            ContinuedWithTrial = true;
            DialogResult = true;
            Close();
        }
        
        private void TitleBar_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            if (e.ClickCount == 2)
            {
                // Double click - não faz nada (janela não maximiza)
                return;
            }
            
            DragMove();
        }
        
        private void MinimizeButton_Click(object sender, RoutedEventArgs e)
        {
            WindowState = WindowState.Minimized;
        }
        
        private void CloseButton_Click(object sender, RoutedEventArgs e)
        {
            // Se o trial expirou, não permitir fechar sem ativar
            if (_viewModel.TrialDaysRemaining <= 0 && !_viewModel.CurrentState.IsActivated)
            {
                var result = MessageBox.Show(
                    "Seu período de teste foi encerrado.\nPara continuar utilizando o Voltris Optimizer, adquira uma licença através do nosso site oficial.\n\nDeseja sair do programa?",
                    "Trial Encerrado",
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Information);
                
                if (result == MessageBoxResult.Yes)
                {
                    // Usuário escolheu sair - não definir ContinuedWithTrial
                    DialogResult = false;
                    Close();
                    return;
                }
                // Se escolheu "Não", não fechar a janela
                return;
            }
            
            // Trial ainda válido ou licença ativada - fechar e continuar com trial normalmente
            // O App.xaml.cs vai tratar isso como "continuar com trial"
            ContinuedWithTrial = true;
            DialogResult = true; // Mudado para true para indicar que deve continuar
            Close();
        }
        
        protected override void OnKeyDown(KeyEventArgs e)
        {
            base.OnKeyDown(e);
            
            if (e.Key == Key.Escape)
            {
                CloseButton_Click(this, new RoutedEventArgs());
            }
            else if (e.Key == Key.Enter && _viewModel.CanActivate)
            {
                _viewModel.ActivateCommand.Execute(null);
            }
        }
        
        protected override void OnClosed(EventArgs e)
        {
            _viewModel.ActivationSucceeded -= OnActivationSucceeded;
            _viewModel.CloseRequested -= OnCloseRequested;
            base.OnClosed(e);
        }
    }
}

