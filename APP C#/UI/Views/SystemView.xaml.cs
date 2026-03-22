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

                // Telemetry
                App.TelemetryService?.TrackEvent("SYSTEM_CREATE_RESTORE", "System", "Start", forceFlush: true);

                // Iniciar operação prioritária
                GlobalProgressService.Instance.StartOperation("Criando Ponto de Restauração", isPriority: true);
                GlobalProgressService.Instance.UpdateProgress(10, "Criando ponto de restauração...");

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
                // Completar operação
                GlobalProgressService.Instance.CompleteOperation("Ponto de Restauração Criado");
                
                CreateRestorePointButton.IsEnabled = true;
                CreateRestorePointButton.Content = "Criar Ponto de Restauração";
            }
        }

        private void RestoreSystemButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                _systemToolsService.OpenSystemRestoreSelector();
                // Telemetry
                App.TelemetryService?.TrackEvent("SYSTEM_OPEN_RESTORE", "System", "Open", forceFlush: true);
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

        private void PreparePcButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                // Encontrar a MainWindow para bloquear a sidebar e acessar o ContentFrame
                var mainWindow = Window.GetWindow(this) as MainWindow;
                if (mainWindow != null)
                {
                    // Bloquear navegação
                    mainWindow.DisableSidebarCompletely();
                    
                    // Criar controlador de fluxo (usando o ContentFrame da MainWindow)
                    var flowController = new VoltrisOptimizer.Core.PreparePc.PreparePcFlowController(
                        mainWindow.ContentFrame,
                        App.LoggingService,
                        onComplete: () =>
                        {
                            // Quando terminar, desbloquear e voltar para o Dashboard (ou ficar no System)
                            mainWindow.UnlockGate();
                            mainWindow.NavigateToPageFromOutside("System");
                        });
                    
                    // Iniciar o fluxo diretamente
                    flowController.StartManually();
                }
            }
            catch (Exception ex)
            {
                _loggingService.LogError($"Erro ao iniciar Prepare PC: {ex.Message}");
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

                // Telemetry
                App.TelemetryService?.TrackEvent("SYSTEM_REPAIR", "System", "Start", forceFlush: true);

                // Iniciar operação prioritária
                GlobalProgressService.Instance.StartOperation("Reparando Sistema", isPriority: true);
                GlobalProgressService.Instance.UpdateProgress(5, "Iniciando reparo do sistema...");

                await _systemToolsService.RepairSystemAsync((progress) =>
                {
                    GlobalProgressService.Instance.UpdateProgress(progress, $"Reparando sistema... {progress}%");
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
                GlobalProgressService.Instance.CompleteOperation("Reparo do Sistema Concluído");
            }
        }

        private void UpdateDriversButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                _systemToolsService.OpenDeviceManager();
                // Telemetry
                App.TelemetryService?.TrackEvent("SYSTEM_OPEN_DEVMGR", "System", "Open", forceFlush: true);
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
                // Telemetry
                App.TelemetryService?.TrackEvent("SYSTEM_OPEN_RESMON", "System", "Open", forceFlush: true);
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
                // Telemetry
                App.TelemetryService?.TrackEvent("SYSTEM_OPEN_CLEANMGR", "System", "Open");
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
                // Telemetry
                App.TelemetryService?.TrackEvent("SYSTEM_OPEN_DEFRAG", "System", "Open");
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
                // Telemetry
                App.TelemetryService?.TrackEvent("SYSTEM_OPEN_SYSINFO", "System", "Open");
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
                // Telemetry
                App.TelemetryService?.TrackEvent("SYSTEM_OPEN_TASKMGR", "System", "Open");
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

        private void RestartButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var result = ModernMessageBox.Show(
                    "Tem certeza que deseja REINICIAR o computador?\n\n" +
                    "O sistema será reiniciado em 10 segundos após confirmar.",
                    "Reiniciar Computador",
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Warning);

                if (result != MessageBoxResult.Yes)
                    return;

                System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
                {
                    FileName = "shutdown",
                    Arguments = "/r /t 10 /c \"Reinicialização via Voltris Optimizer\"",
                    UseShellExecute = false,
                    CreateNoWindow = true
                });

                _loggingService.LogInfo("Comando de reinicialização enviado");
                App.TelemetryService?.TrackEvent("SYSTEM_RESTART", "System", "Execute");

                ModernMessageBox.Show(
                    "O computador será reiniciado em 10 segundos.",
                    "Reinicialização Agendada",
                    MessageBoxButton.OK,
                    MessageBoxImage.Information);
            }
            catch (Exception ex)
            {
                _loggingService.LogError($"Erro ao reiniciar: {ex.Message}");
                ModernMessageBox.Show(
                    $"Erro ao reiniciar o computador:\n\n{ex.Message}",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
        }

        private void ShutdownButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var result = ModernMessageBox.Show(
                    "Tem certeza que deseja DESLIGAR o computador?\n\n" +
                    "O sistema será desligado em 10 segundos após confirmar.",
                    "Desligar Computador",
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Warning);

                if (result != MessageBoxResult.Yes)
                    return;

                System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
                {
                    FileName = "shutdown",
                    Arguments = "/s /t 10 /c \"Desligamento via Voltris Optimizer\"",
                    UseShellExecute = false,
                    CreateNoWindow = true
                });

                _loggingService.LogInfo("Comando de desligamento enviado");
                App.TelemetryService?.TrackEvent("SYSTEM_SHUTDOWN", "System", "Execute");

                ModernMessageBox.Show(
                    "O computador será desligado em 10 segundos.",
                    "Desligamento Agendado",
                    MessageBoxButton.OK,
                    MessageBoxImage.Information);
            }
            catch (Exception ex)
            {
                _loggingService.LogError($"Erro ao desligar: {ex.Message}");
                ModernMessageBox.Show(
                    $"Erro ao desligar o computador:\n\n{ex.Message}",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
        }
    }
}

