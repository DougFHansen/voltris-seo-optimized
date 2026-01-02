using System;
using System.Windows;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Serviço global para controlar o progressbar e status do footer
    /// </summary>
    public class GlobalProgressService
    {
        private static GlobalProgressService? _instance;
        public static GlobalProgressService Instance => _instance ??= new GlobalProgressService();

        public event EventHandler<ProgressEventArgs>? ProgressChanged;
        public event EventHandler<string>? StatusChanged;

        private GlobalProgressService() { }

        /// <summary>
        /// Atualiza o progresso (0-100)
        /// </summary>
        public void UpdateProgress(int percentage, string status)
        {
            Application.Current?.Dispatcher.Invoke(() =>
            {
                ProgressChanged?.Invoke(this, new ProgressEventArgs { Percentage = percentage });
                StatusChanged?.Invoke(this, status);
            });
        }

        /// <summary>
        /// Reseta o progresso para o estado inicial
        /// </summary>
        public void ResetProgress()
        {
            Application.Current?.Dispatcher.Invoke(() =>
            {
                ProgressChanged?.Invoke(this, new ProgressEventArgs { Percentage = 0 });
                StatusChanged?.Invoke(this, "Pronto");
            });
        }

        /// <summary>
        /// Define o status sem alterar o progresso
        /// </summary>
        public void SetStatus(string status)
        {
            Application.Current?.Dispatcher.Invoke(() =>
            {
                StatusChanged?.Invoke(this, status);
            });
        }
    }

    public class ProgressEventArgs : EventArgs
    {
        public int Percentage { get; set; }
    }
}
