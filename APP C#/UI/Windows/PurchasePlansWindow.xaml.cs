using System.Windows;
using VoltrisOptimizer.UI.Controls;
using VoltrisOptimizer.Helpers;

namespace VoltrisOptimizer.UI.Windows
{
    public partial class PurchasePlansWindow : Window
    {
        public PurchasePlansWindow()
        {
            InitializeComponent();
            App.LoggingService?.LogTrace("[UI] Aberta janela de planos de aquisição");
            RoundedWindowHelper.Apply(this, 16);
        }

        private void CloseButton_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }

        private void BuyStandard_Click(object sender, RoutedEventArgs e)
        {
            App.LoggingService?.LogInfo("[PLANS] Plano STANDARD selecionado");
            OpenUrl("https://voltris.com.br/plans?plan=standard");
        }

        private void BuyPro_Click(object sender, RoutedEventArgs e)
        {
            App.LoggingService?.LogInfo("[PLANS] Plano PRO selecionado");
            OpenUrl("https://voltris.com.br/plans?plan=pro");
        }

        private void BuyEnterprise_Click(object sender, RoutedEventArgs e)
        {
            App.LoggingService?.LogInfo("[PLANS] Plano ENTERPRISE selecionado");
            OpenUrl("https://voltris.com.br/plans?plan=enterprise");
        }

        private void OpenUrl(string url)
        {
            try
            {
                System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
                {
                    FileName = url,
                    UseShellExecute = true
                });
                Close();
            }
            catch
            {
                 ModernMessageBox.Show($"Não foi possível abrir: {url}", "Erro", MessageBoxButton.OK, MessageBoxImage.Error, this);
            }
        }
    }
}
