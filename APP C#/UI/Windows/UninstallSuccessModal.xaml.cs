using System.Windows;
using VoltrisOptimizer.Helpers;

namespace VoltrisOptimizer.UI.Windows
{
    /// <summary>
    /// Modal de sucesso exibido após a desinstalação de aplicativos no Debloat.
    /// Mostra o total de programas desinstalados com sucesso e os que falharam.
    /// </summary>
    public partial class UninstallSuccessModal : Window
    {
        public UninstallSuccessModal()
        {
            InitializeComponent();
            App.LoggingService?.LogTrace("[DEBLOAT] Exibindo modal de sucesso de desinstalação");
            RoundedWindowHelper.Apply(this, 20);
        }

        /// <summary>
        /// Configura os dados exibidos no modal.
        /// </summary>
        /// <param name="successCount">Quantidade de apps desinstalados com sucesso.</param>
        /// <param name="failureCount">Quantidade de apps que falharam na desinstalação.</param>
        public void SetResults(int successCount, int failureCount)
        {
            App.LoggingService?.LogInfo($"[DEBLOAT] Resultados: {successCount} sucesso(s), {failureCount} falha(s)");
            SuccessCountText.Text = successCount.ToString();
            FailureCountText.Text = failureCount.ToString();

            // Mostrar badge de falhas apenas se houver
            FailureBadge.Visibility = failureCount > 0
                ? Visibility.Visible
                : Visibility.Collapsed;

            // Ajustar título e subtítulo conforme resultado
            if (successCount == 0 && failureCount > 0)
            {
                TitleText.Text = "Nenhum programa foi removido";
                SubtitleText.Text = $"Ocorreram falhas ao tentar desinstalar {failureCount} programa(s). Verifique os logs para mais detalhes.";
            }
            else if (failureCount > 0)
            {
                TitleText.Text = $"{successCount} programa(s) removido(s) com sucesso";
                SubtitleText.Text = $"{failureCount} programa(s) não puderam ser removidos. Verifique os logs para mais detalhes.";
            }
            else
            {
                int total = successCount;
                TitleText.Text = total == 1
                    ? "1 programa removido com sucesso"
                    : $"{total} programas removidos com sucesso";
                SubtitleText.Text = "O sistema foi atualizado e a lista de aplicativos foi reconstruída.";
            }
        }

        private void OkButton_Click(object sender, RoutedEventArgs e)
        {
            DialogResult = true;
            Close();
        }

        private void Window_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            if (e.ChangedButton == System.Windows.Input.MouseButton.Left)
                DragMove();
        }
    }
}
