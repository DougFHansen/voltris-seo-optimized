using System;
using System.Diagnostics;
using System.Windows;
using System.Windows.Input;

namespace VoltrisOptimizer.UI.Windows
{
    public partial class PurchaseLicenseWindow : Window
    {
        // Número do WhatsApp para compra
        private const string WhatsAppNumber = "5511996716235";
        private const string WhatsAppMessage = "Olá! Gostaria de adquirir a licença Pro do Voltris Optimizer.";
        
        /// <summary>
        /// Se true, fechar este modal irá fechar o aplicativo inteiro
        /// </summary>
        public bool BlockApplication { get; set; } = false;
        
        public PurchaseLicenseWindow()
        {
            InitializeComponent();
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
                // Abrir WhatsApp com a mensagem pré-definida
                var url = $"https://wa.me/{WhatsAppNumber}?text={Uri.EscapeDataString(WhatsAppMessage)}";
                Process.Start(new ProcessStartInfo
                {
                    FileName = url,
                    UseShellExecute = true
                });
                
                App.LoggingService?.LogInfo("[LICENSE] Usuário redirecionado para WhatsApp para compra");
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[LICENSE] Erro ao abrir WhatsApp: {ex.Message}");
                
                // Tentar abrir o WhatsApp Desktop
                try
                {
                    var whatsappUrl = $"whatsapp://send?phone={WhatsAppNumber}&text={Uri.EscapeDataString(WhatsAppMessage)}";
                    Process.Start(new ProcessStartInfo
                    {
                        FileName = whatsappUrl,
                        UseShellExecute = true
                    });
                }
                catch
                {
                    // Se ainda falhar, mostrar o número para o usuário
                    UI.Controls.ModernMessageBox.Show(
                        $"Não foi possível abrir o WhatsApp automaticamente.\n\n" +
                        $"Entre em contato pelo número:\n+55 11 99671-6235\n\n" +
                        "Ou copie o número e cole no WhatsApp manualmente.",
                        "Contato",
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
