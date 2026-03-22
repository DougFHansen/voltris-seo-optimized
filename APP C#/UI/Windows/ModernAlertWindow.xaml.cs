using System.Windows;
using System.Windows.Input;
using System.Windows.Media;
using VoltrisOptimizer.Helpers;

namespace VoltrisOptimizer.UI.Windows
{
    public partial class ModernAlertWindow : Window
    {
        public ModernAlertWindow(string message, string title = "Sucesso", bool isSuccess = true)
        {
            InitializeComponent();
            RoundedWindowHelper.Apply(this, 20);
            App.LoggingService?.LogTrace($"[UI] ModernAlertWindow exibido: [{title}] {message}");
            
            // Garantir que a janela sempre fique no topo
            Topmost = true;
            ShowInTaskbar = false;
            
            // Definir Owner como a MainWindow se disponível
            try
            {
                if (Application.Current?.MainWindow != null && Application.Current.MainWindow.IsLoaded)
                {
                    Owner = Application.Current.MainWindow;
                }
            }
            catch { }
            
            MessageText.Text = message;
            TitleText.Text = title;
            
            // Forçar foco na janela
            Loaded += (s, e) =>
            {
                Activate();
                Focus();
                Topmost = true; // Garantir novamente
            };
        }

        private void OkButton_Click(object sender, RoutedEventArgs e)
        {
            App.LoggingService?.LogTrace("[UI] ModernAlertWindow fechado pelo usuário.");
            DialogResult = true;
            Close();
        }
        
        protected override void OnMouseLeftButtonDown(MouseButtonEventArgs e)
        {
            base.OnMouseLeftButtonDown(e);
            try
            {
                DragMove();
            }
            catch { }
        }
        
        protected override void OnActivated(System.EventArgs e)
        {
            base.OnActivated(e);
            // Garantir que sempre fique no topo mesmo após perder foco
            Topmost = true;
        }
    }
}
