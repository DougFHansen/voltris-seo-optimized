using System;
using System.Diagnostics;
using System.Windows;
using VoltrisOptimizer.Helpers;

namespace VoltrisOptimizer.UI.Windows
{
    public partial class RestartConfirmationModal : Window
    {
        public enum RestartChoice
        {
            Cancel,          // Usuário cancelou - NÃO aplicar nada
            RestartLater,    // Aplicar otimizações SEM reiniciar
            RestartNow       // Aplicar otimizações E reiniciar
        }

        public RestartChoice UserChoice { get; private set; }
        public bool ShouldRestart => UserChoice == RestartChoice.RestartNow;
        public bool ShouldApplyOptimizations => UserChoice != RestartChoice.Cancel;

        public RestartConfirmationModal()
        {
            InitializeComponent();
            App.LoggingService?.LogInfo("[RESTART] Exibindo modal de confirmação de reinicialização");
            RoundedWindowHelper.Apply(this, 16);
            UserChoice = RestartChoice.Cancel; // Padrão: cancelar
        }

        /// <summary>
        /// Define uma mensagem customizada exibida no modal (ex: "REPARO COMPLETO FINALIZADO COM SUCESSO").
        /// Se null, exibe o texto padrão.
        /// </summary>
        public void SetCustomMessage(string? title, string? description)
        {
            if (title != null && ModalTitleText != null)
                ModalTitleText.Text = title;
            if (description != null && ModalDescriptionText != null)
                ModalDescriptionText.Text = description;
        }

        private void Window_MouseDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            if (e.ChangedButton == System.Windows.Input.MouseButton.Left)
                this.DragMove();
        }

        private void CancelButton_Click(object sender, RoutedEventArgs e)
        {
            App.LoggingService?.LogInfo("[RESTART] Usuário CANCELOU a aplicação e o reinício");
            UserChoice = RestartChoice.Cancel;
            DialogResult = false; // Cancelado
            Close();
        }

        private void RestartLaterButton_Click(object sender, RoutedEventArgs e)
        {
            App.LoggingService?.LogInfo("[RESTART] Usuário escolheu: APLICAR AGORA, REINICIAR DEPOIS");
            UserChoice = RestartChoice.RestartLater;
            DialogResult = true; // Confirmado (aplicar sem reiniciar)
            Close();
        }

        private void RestartNowButton_Click(object sender, RoutedEventArgs e)
        {
            App.LoggingService?.LogWarning("[RESTART] Usuário escolheu: REINICIAR IMEDIATAMENTE");
            UserChoice = RestartChoice.RestartNow;
            DialogResult = true; // Confirmado (aplicar e reiniciar)
            Close();
        }
    }
}
