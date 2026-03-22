using System;
using System.IO;
using System.Windows;

namespace VoltrisUpdater
{
    public partial class App : Application
    {
        protected override void OnStartup(StartupEventArgs e)
        {
            base.OnStartup(e);
            
            // Tratamento global de exceções
            this.DispatcherUnhandledException += App_DispatcherUnhandledException;
            AppDomain.CurrentDomain.UnhandledException += CurrentDomain_UnhandledException;
            
            try
            {
                var mainWindow = new MainWindow();
                mainWindow.Show();
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    $"Erro ao iniciar o atualizador:\n{ex.Message}\n\n{ex.StackTrace}",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error
                );
                Shutdown();
            }
        }
        
        private void App_DispatcherUnhandledException(object sender, System.Windows.Threading.DispatcherUnhandledExceptionEventArgs e)
        {
            string errorMsg = $"Ocorreu um erro inesperado na interface (Dispatcher):\n\n{e.Exception.Message}\n\n{e.Exception.StackTrace}";
            LogError(errorMsg);
            
            MessageBox.Show(
                errorMsg,
                "Erro Crítico - Voltris Updater",
                MessageBoxButton.OK,
                MessageBoxImage.Error
            );
            
            e.Handled = true;
            Shutdown();
        }
        
        private void CurrentDomain_UnhandledException(object sender, UnhandledExceptionEventArgs e)
        {
            if (e.ExceptionObject is Exception ex)
            {
                string errorMsg = $"Ocorreu um erro crítico no núcleo (Domain):\n\n{ex.Message}\n\n{ex.StackTrace}";
                LogError(errorMsg);
                
                MessageBox.Show(
                    errorMsg,
                    "Erro Fatal - Voltris Updater",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error
                );
            }
            
            Shutdown();
        }
        
        private void LogError(string message)
        {
            try
            {
                var logDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Voltris", "Updater");
                Directory.CreateDirectory(logDir);
                var logFile = Path.Combine(logDir, "log.txt");
                File.AppendAllText(logFile, $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] {message}{Environment.NewLine}");
            }
            catch { }
        }
    }
}


