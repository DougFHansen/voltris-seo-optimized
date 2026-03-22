using System;
using System.Diagnostics;
using System.Windows;
using System.Windows.Input;

using System.Windows.Interop;
using VoltrisOptimizer.UI.Helpers;
using VoltrisOptimizer.Helpers;

namespace VoltrisOptimizer.UI.Windows
{
    public partial class PurchaseLicenseWindow : Window
    {
        // URL de compra oficial
        private const string PurchaseUrl = "https://voltris.com.br/adquirir-licenca";
        
        /// <summary>
        /// Se true, fechar este modal irá fechar o aplicativo inteiro
        /// </summary>
        public bool BlockApplication { get; set; } = false;
        
        public PurchaseLicenseWindow()
        {
            InitializeComponent();
            RoundedWindowHelper.Apply(this, 24);
            Loaded += (s, e) => 
            {
                var helper = new WindowInteropHelper(this);
                Win32WindowHelper.ForceForegroundWindow(helper.Handle);
            };
        }

        private void TitleBar_MouseDown(object sender, MouseButtonEventArgs e)
        {
            if (e.ChangedButton == MouseButton.Left)
            {
                DragMove();
            }
        }

        private void BuyButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                // Abrir site oficial para compra
                Process.Start(new ProcessStartInfo
                {
                    FileName = PurchaseUrl,
                    UseShellExecute = true
                });
                
                App.LoggingService?.LogInfo("[LICENSE] Usuário redirecionado para site oficial de compra");
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[LICENSE] Erro ao abrir site: {ex.Message}");
                
                // Fallback: tentar copiar URL para área de transferência
                try
                {
                    Clipboard.SetText(PurchaseUrl);
                    UI.Controls.ModernMessageBox.Show(
                        $"Não foi possível abrir o navegador automaticamente.\n\n" +
                        $"O link foi copiado para sua área de transferência:\n{PurchaseUrl}\n\n" +
                        "Cole no seu navegador para adquirir uma licença.",
                        "Link Copiado",
                        MessageBoxButton.OK,
                        MessageBoxImage.Information);
                }
                catch
                {
                    UI.Controls.ModernMessageBox.Show(
                        $"Acesse nosso site para adquirir uma licença:\n{PurchaseUrl}",
                        "Adquirir Licença",
                        MessageBoxButton.OK,
                        MessageBoxImage.Information);
                }
            }
        }

        private void HaveLicenseButton_Click(object sender, RoutedEventArgs e)
        {
            // Abrir janela de ativação de licença
            var activateWindow = new ActivateLicenseWindow();
            activateWindow.Owner = this;
            
            var result = activateWindow.ShowDialog();
            
            if (result == true)
            {
                // Licença ativada com sucesso - desbloquear
                BlockApplication = false;
                DialogResult = true;
                Close();
            }
        }

        private void CloseButton_Click(object sender, RoutedEventArgs e)
        {
            if (BlockApplication)
            {
                // Se estiver bloqueando, fechar o aplicativo inteiro
                var result = UI.Controls.ModernMessageBox.Show(
                    "Sem uma licença ativa, o aplicativo será fechado.\n\nDeseja realmente sair?",
                    "Confirmar Saída",
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Warning);
                
                if (result == MessageBoxResult.Yes)
                {
                    Application.Current.Shutdown();
                }
            }
            else
            {
                DialogResult = false;
                Close();
            }
        }
        
        protected override void OnClosing(System.ComponentModel.CancelEventArgs e)
        {
            if (BlockApplication && DialogResult != true)
            {
                // Prevenir fechamento via Alt+F4
                e.Cancel = true;
                CloseButton_Click(this, new RoutedEventArgs());
            }
            base.OnClosing(e);
        }
    }
}
