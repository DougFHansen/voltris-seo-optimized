using System;
using System.Windows;
using System.Windows.Controls;
using VoltrisOptimizer;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.UI.Views
{
    public partial class NetworkView : UserControl
    {
        private bool _isRunning = false;

        public NetworkView()
        {
            InitializeComponent();
            Loaded += NetworkView_Loaded;
        }
        
        private void NetworkView_Loaded(object sender, RoutedEventArgs e)
        {
        }
        
        

        private async void RunNetworkButton_Click(object sender, RoutedEventArgs e)
        {
            if (_isRunning)
            {
                MessageBox.Show("Otimização de rede já está em execução. Aguarde a conclusão.", 
                              "Aviso", 
                              MessageBoxButton.OK, 
                              MessageBoxImage.Information);
                return;
            }

            try
            {
                _isRunning = true;
                RunNetworkButton.IsEnabled = false;
                RunNetworkButton.Content = "⏳ Otimizando...";

                if (App.NetworkOptimizer == null)
                {
                    MessageBox.Show("Serviço de rede não inicializado.", 
                                  "Erro", 
                                  MessageBoxButton.OK, 
                                  MessageBoxImage.Error);
                    return;
                }

                if (Application.Current.MainWindow is MainWindow mainWindow)
                {
                    mainWindow.UpdateStatus("Otimizando conexão de rede...");

                    // Limpar DNS
                    mainWindow.UpdateStatus("Limpando cache DNS...");
                    await App.NetworkOptimizer.FlushDnsAsync(progress =>
                    {
                        mainWindow.UpdateProgress(progress);
                    });

                    // Renovar DHCP
                    mainWindow.UpdateStatus("Renovando DHCP...");
                    await App.NetworkOptimizer.RenewDhcpAsync(progress =>
                    {
                        mainWindow.UpdateProgress(progress);
                    });

                    // Resetar Winsock (pode requerer reinicialização)
                    var result = MessageBox.Show(
                        "Deseja redefinir Winsock? Isso pode requerer reinicialização do computador.",
                        "Redefinir Winsock",
                        MessageBoxButton.YesNo,
                        MessageBoxImage.Question
                    );

                    if (result == MessageBoxResult.Yes)
                    {
                        mainWindow.UpdateStatus("Redefinindo Winsock...");
                        await App.NetworkOptimizer.ResetWinsockAsync(progress =>
                        {
                            mainWindow.UpdateProgress(progress);
                        });
                    }

                    mainWindow.UpdateStatus("Otimização de rede concluída!");
                    mainWindow.UpdateProgress(100);

                    new ToastService().Show("Sucesso", "Otimização de Rede concluída!");
                    MessageBox.Show(
                        "Otimização de rede concluída com sucesso!",
                        "Sucesso",
                        MessageBoxButton.OK,
                        MessageBoxImage.Information
                    );

                    mainWindow.UpdateProgress(0);
                    mainWindow.UpdateStatus("Pronto");
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show(
                    $"Erro ao executar otimização de rede: {ex.Message}",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error
                );
            }
            finally
            {
                _isRunning = false;
                RunNetworkButton.IsEnabled = true;
                RunNetworkButton.Content = "🌐 Executar Otimização";
            }
        }

        private void OptimizeStackButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (App.ExtremeOptimizations == null)
                {
                    MessageBox.Show("Serviço extremo não inicializado.", "Erro", MessageBoxButton.OK, MessageBoxImage.Error);
                    return;
                }
                var ok = App.ExtremeOptimizations.OptimizeNetworkStack();
                if (!ok)
                {
                    MessageBox.Show("Execute como Administrador para otimizar a pilha de rede.", "Permissão necessária", MessageBoxButton.OK, MessageBoxImage.Warning);
                    return;
                }
                MessageBox.Show("Pilha de rede otimizada. Reinicie o PC se solicitado.", "Sucesso", MessageBoxButton.OK, MessageBoxImage.Information);
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Erro ao otimizar pilha de rede: {ex.Message}", "Erro", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }
    }
}

