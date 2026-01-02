using System;
using System.Windows;
using System.Windows.Input;
using VoltrisOptimizer.UI.ViewModels;
using VoltrisOptimizer.UI.Helpers;

namespace VoltrisOptimizer.UI.Views
{
    /// <summary>
    /// Janela de ativação de licença profissional
    /// </summary>
    public partial class LicenseActivationView : Window
    {
        private readonly LicenseActivationViewModel _viewModel;
        
        /// <summary>
        /// Resultado da ativação
        /// </summary>
        public bool ActivationSucceeded { get; private set; }
        
        /// <summary>
        /// Se o usuário optou por continuar o trial
        /// </summary>
        public bool ContinuedWithTrial { get; private set; }
        
        public LicenseActivationView()
        {
            InitializeComponent();
            
            // Aplicar cantos arredondados perfeitos (Windows 10/11)
            WindowRoundedCornersHelper.ApplyRoundedCorners(this, cornerRadius: 16);
            
            _viewModel = new LicenseActivationViewModel();
            DataContext = _viewModel;
            
            // Conectar eventos do ViewModel
            _viewModel.ActivationSucceeded += OnActivationSucceeded;
            _viewModel.CloseRequested += OnCloseRequested;
            
            // Inicializar quando a janela carregar
            Loaded += async (s, e) =>
            {
                await _viewModel.InitializeAsync();
                LicenseKeyInput.Focus();
            };
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
                    "Seu período de teste expirou. Você precisa ativar uma licença para continuar usando o programa.\n\nDeseja sair do programa?",
                    "Trial Expirado",
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Warning);
                
                if (result == MessageBoxResult.Yes)
                {
                    Application.Current.Shutdown();
                }
                return;
            }
            
            DialogResult = false;
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

