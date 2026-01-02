using System;
using System.IO;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.UI.Controls;

namespace VoltrisOptimizer.UI.Views
{
    public partial class SystemView : UserControl
    {
        private readonly SystemToolsService _systemToolsService;
        private readonly ILoggingService _loggingService;

        public SystemView()
        {
            InitializeComponent();
            
            var logDirectory = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
            _loggingService = App.LoggingService ?? new LoggingService(logDirectory);
            _systemToolsService = new SystemToolsService(_loggingService);
        }

        private async void CreateRestorePointButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                CreateRestorePointButton.IsEnabled = false;
                CreateRestorePointButton.Content = "Criando...";

                var result = await _systemToolsService.CreateSystemRestorePointAsync();
                
                if (result)
                {
                    _loggingService.LogSuccess("Ponto de restauração criado com sucesso!");
                }
            }
            catch (Exception ex)
            {
                _loggingService.LogError($"Erro ao criar ponto de restauração: {ex.Message}");
                ModernMessageBox.Show(
                    $"Erro ao criar ponto de restauração:\n\n{ex.Message}",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
            finally
            {
                CreateRestorePointButton.IsEnabled = true;
                CreateRestorePointButton.Content = "Criar Ponto de Restauração";
            }
        }

        private void RestoreSystemButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                _systemToolsService.OpenSystemRestoreSelector();
            }
            catch (Exception ex)
            {
                _loggingService.LogError($"Erro ao abrir restauração: {ex.Message}");
                ModernMessageBox.Show(
                    $"Erro ao abrir restauração:\n\n{ex.Message}",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
        }

        private async void RepairSystemButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var result = ModernMessageBox.Show(
                    "Esta operação irá executar DISM e SFC para reparar o sistema.\n\n" +
                    "Isso pode levar vários minutos. Deseja continuar?",
                    "Reparar Sistema",
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Question);

                if (result != MessageBoxResult.Yes)
                    return;

                RepairSystemButton.IsEnabled = false;
                RepairSystemButton.Content = "Reparando...";

                await _systemToolsService.RepairSystemAsync((progress) =>
                {
                    // Atualizar progresso se necessário
                    Application.Current.Dispatcher.Invoke(() =>
                    {
                        RepairSystemButton.Content = $"Reparando... {progress}%";
                    });
                });
            }
            catch (Exception ex)
            {
                _loggingService.LogError($"Erro ao reparar sistema: {ex.Message}");
                ModernMessageBox.Show(
                    $"Erro ao reparar sistema:\n\n{ex.Message}",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
            finally
            {
                RepairSystemButton.IsEnabled = true;
                RepairSystemButton.Content = "Reparar Sistema (DISM + SFC)";
            }
        }

        private void UpdateDriversButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                _systemToolsService.OpenDeviceManager();
            }
            catch (Exception ex)
            {
                _loggingService.LogError($"Erro ao abrir Gerenciador de Dispositivos: {ex.Message}");
                ModernMessageBox.Show(
                    $"Erro ao abrir Gerenciador de Dispositivos:\n\n{ex.Message}",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
        }

        private void ResourceMonitorButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                _systemToolsService.OpenResourceMonitor();
            }
            catch (Exception ex)
            {
                _loggingService.LogError($"Erro ao abrir Monitor de Recursos: {ex.Message}");
                ModernMessageBox.Show(
                    $"Erro ao abrir Monitor de Recursos:\n\n{ex.Message}",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
        }
        
        private void DiskCleanupButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
                {
                    FileName = "cleanmgr.exe",
                    UseShellExecute = true
                });
                _loggingService.LogInfo("Limpeza de Disco do Windows aberta");
            }
            catch (Exception ex)
            {
                _loggingService.LogError($"Erro ao abrir Limpeza de Disco: {ex.Message}");
                ModernMessageBox.Show(
                    $"Erro ao abrir Limpeza de Disco:\n\n{ex.Message}",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
        }
        
        private void DefragButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
                {
                    FileName = "dfrgui.exe",
                    UseShellExecute = true
                });
                _loggingService.LogInfo("Desfragmentador do Windows aberto");
            }
            catch (Exception ex)
            {
                _loggingService.LogError($"Erro ao abrir Desfragmentador: {ex.Message}");
                ModernMessageBox.Show(
                    $"Erro ao abrir Desfragmentador:\n\n{ex.Message}",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
        }
        
        private void SystemInfoButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
                {
                    FileName = "ms-settings:about",
                    UseShellExecute = true
                });
                _loggingService.LogInfo("Informações do Sistema abertas");
            }
            catch (Exception ex)
            {
                _loggingService.LogError($"Erro ao abrir Informações do Sistema: {ex.Message}");
                ModernMessageBox.Show(
                    $"Erro ao abrir Informações do Sistema:\n\n{ex.Message}",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
        }
        
        private void TaskManagerButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
                {
                    FileName = "taskmgr.exe",
                    UseShellExecute = true
                });
                _loggingService.LogInfo("Gerenciador de Tarefas aberto");
            }
            catch (Exception ex)
            {
                _loggingService.LogError($"Erro ao abrir Gerenciador de Tarefas: {ex.Message}");
                ModernMessageBox.Show(
                    $"Erro ao abrir Gerenciador de Tarefas:\n\n{ex.Message}",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
        }
    }
}

