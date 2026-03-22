using System.Windows;

namespace VoltrisOptimizer.UI.Views
{
    public partial class DlsTutorialPage : Window
    {
        public DlsTutorialPage()
        {
            InitializeComponent();
            App.LoggingService?.LogTrace("[UI] Aberta página de tutorial do DLS");
        }

        private void BtnClose_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }
    }
}
