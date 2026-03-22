using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.NetworkInformation;
using System.Net.Sockets;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using VoltrisOptimizer;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.UI.Controls;

namespace VoltrisOptimizer.UI.Views
{
    public partial class NetworkView : UserControl
    {
        private bool _isRunning = false;
        private Dictionary<string, (string[] v4, string[] v6)> _dnsProviders;

        public NetworkView()
        {
            InitializeComponent();
            InitializeDNSProviders();
            Loaded += NetworkView_Loaded;
        }

        private void InitializeDNSProviders()
        {
            _dnsProviders = new Dictionary<string, (string[] v4, string[] v6)>
            {
                { "Google DNS", (new[] { "8.8.8.8", "8.8.4.4" }, new[] { "2001:4860:4860::8888", "2001:4860:4860::8844" }) },
                { "Cloudflare DNS", (new[] { "1.1.1.1", "1.0.0.1" }, new[] { "2606:4700:4700::1111", "2606:4700:4700::1001" }) },
                { "Quad9 DNS", (new[] { "9.9.9.9", "149.112.112.112" }, new[] { "2620:fe::fe", "2620:fe::9" }) },
                { "OpenDNS", (new[] { "208.67.222.222", "208.67.220.220" }, new[] { "2620:0:ccc::2", "2620:0:ccd::2" }) },
                { "AdGuard DNS", (new[] { "94.140.14.14", "94.140.15.15" }, new[] { "2a10:50c0::ad1:ff", "2a10:50c0::ad2:ff" }) }
            };

            cmbDNSOptions.ItemsSource = _dnsProviders.Keys;
            cmbDNSOptions.SelectedIndex = 1; // Default to Cloudflare
        }

        private void NetworkView_Loaded(object sender, RoutedEventArgs e)
        {
            PopulateNetworkInterfaces();
        }

        private void PopulateNetworkInterfaces()
        {
            try
            {
                App.LoggingService?.LogInfo("[NetworkView] Populando interfaces de rede...");
                cmbNetworkInterfaces.Items.Clear();

                var interfaces = NetworkInterface.GetAllNetworkInterfaces()
                    .Where(nic => (nic.NetworkInterfaceType == NetworkInterfaceType.Wireless80211 ||
                                  nic.NetworkInterfaceType == NetworkInterfaceType.Ethernet) &&
                                  nic.OperationalStatus == OperationalStatus.Up)
                    .ToList();

                foreach (var nic in interfaces)
                {
                    cmbNetworkInterfaces.Items.Add(nic.Name);
                }

                if (cmbNetworkInterfaces.Items.Count > 0)
                {
                    cmbNetworkInterfaces.SelectedIndex = 0;
                    App.LoggingService?.LogDebug($"[NetworkView] {cmbNetworkInterfaces.Items.Count} interfaces encontradas.");
                }
                else
                {
                    App.LoggingService?.LogWarning("[NetworkView] Nenhuma interface de rede ativa encontrada.");
                }
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[NetworkView] Erro ao popular interfaces", ex);
            }
        }

        private void cmbNetworkInterfaces_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            if (cmbNetworkInterfaces.SelectedItem != null)
            {
                DisplayNetworkInfo(cmbNetworkInterfaces.SelectedItem.ToString());
            }
        }

        private void DisplayNetworkInfo(string interfaceName)
        {
            try
            {
                var nic = NetworkInterface.GetAllNetworkInterfaces()
                    .FirstOrDefault(n => n.Name == interfaceName);

                if (nic == null) return;

                var ipProps = nic.GetIPProperties();
                var dnsAddresses = ipProps.DnsAddresses;

                // Reset fields
                txtIPv4DNSPrimary.Text = "Não definido";
                txtIPv4DNSSecondary.Text = "Não definido";
                txtIPv6DNSPrimary.Text = "Não definido";
                txtIPv6DNSSecondary.Text = "Não definido";

                var ipv4Dns = dnsAddresses.Where(d => d.AddressFamily == AddressFamily.InterNetwork).ToList();
                if (ipv4Dns.Count > 0) txtIPv4DNSPrimary.Text = ipv4Dns[0].ToString();
                if (ipv4Dns.Count > 1) txtIPv4DNSSecondary.Text = ipv4Dns[1].ToString();

                var ipv6Dns = dnsAddresses.Where(d => d.AddressFamily == AddressFamily.InterNetworkV6).ToList();
                if (ipv6Dns.Count > 0) txtIPv6DNSPrimary.Text = ipv6Dns[0].ToString();
                if (ipv6Dns.Count > 1) txtIPv6DNSSecondary.Text = ipv6Dns[1].ToString();

                App.LoggingService?.LogDebug($"[NetworkView] Info de rede atualizada para: {interfaceName}");
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[NetworkView] Erro ao exibir info de rede", ex);
            }
        }

        private async void ApplyDNS_Click(object sender, RoutedEventArgs e)
        {
            if (cmbNetworkInterfaces.SelectedItem == null || cmbDNSOptions.SelectedItem == null)
            {
                ModernMessageBox.Show("Selecione uma interface e um provedor de DNS.", "Aviso", MessageBoxButton.OK, MessageBoxImage.Warning, Window.GetWindow(this));
                return;
            }

            string nicName = cmbNetworkInterfaces.SelectedItem.ToString();
            string dnsProvider = cmbDNSOptions.SelectedItem.ToString();

            if (!_dnsProviders.ContainsKey(dnsProvider)) return;

            var (v4, v6) = _dnsProviders[dnsProvider];

            try
            {
                ApplyDNSButton.IsEnabled = false;
                ApplyDNSButton.Content = "⏳ Aplicando...";
                
                App.LoggingService?.LogInfo($"[NetworkView] Iniciando aplicação de DNS: {dnsProvider} em {nicName}");

                bool success = await App.NetworkOptimizer.SetDnsAsync(nicName, v4, v6);

                if (success)
                {
                    App.LoggingService?.LogSuccess($"[NetworkView] DNS {dnsProvider} aplicado com sucesso.");
                    new ToastService().Show("Sucesso", $"DNS {dnsProvider} aplicado!");
                    DisplayNetworkInfo(nicName);
                }
                else
                {
                    ModernMessageBox.Show("Falha ao aplicar DNS. Verifique os logs para detalhes.", "Erro", MessageBoxButton.OK, MessageBoxImage.Error, Window.GetWindow(this));
                }
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[NetworkView] Erro ao aplicar DNS", ex);
                ModernMessageBox.Show($"Erro: {ex.Message}", "Erro", MessageBoxButton.OK, MessageBoxImage.Error, Window.GetWindow(this));
            }
            finally
            {
                ApplyDNSButton.IsEnabled = true;
                ApplyDNSButton.Content = "Aplicar DNS";
            }
        }

        private async void ResetDefaultDNS_Click(object sender, RoutedEventArgs e)
        {
            if (cmbNetworkInterfaces.SelectedItem == null)
            {
                ModernMessageBox.Show("Selecione uma interface para restaurar.", "Aviso", MessageBoxButton.OK, MessageBoxImage.Warning, Window.GetWindow(this));
                return;
            }

            string nicName = cmbNetworkInterfaces.SelectedItem.ToString();

            try
            {
                ResetDNSButton.IsEnabled = false;
                ResetDNSButton.Content = "⏳ Restaurando...";
                
                App.LoggingService?.LogInfo($"[NetworkView] Restaurando DNS para DHCP em {nicName}");

                bool success = await App.NetworkOptimizer.ResetDnsAsync(nicName);

                if (success)
                {
                    App.LoggingService?.LogSuccess($"[NetworkView] DNS de {nicName} restaurado para DHCP.");
                    new ToastService().Show("Restaurado", "DNS restaurado para o padrão!");
                    DisplayNetworkInfo(nicName);
                }
                else
                {
                    ModernMessageBox.Show("Falha ao restaurar DNS.", "Erro", MessageBoxButton.OK, MessageBoxImage.Error, Window.GetWindow(this));
                }
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[NetworkView] Erro ao restaurar DNS", ex);
            }
            finally
            {
                ResetDNSButton.IsEnabled = true;
                ResetDNSButton.Content = "Restaurar Padrão";
            }
        }

        private async void RunNetworkButton_Click(object sender, RoutedEventArgs e)
        {
            if (_isRunning)
            {
                ModernMessageBox.Show("Otimização de rede já está em execução. Aguarde a conclusão.", 
                               "Aviso", 
                               MessageBoxButton.OK, 
                               MessageBoxImage.Information,
                               Window.GetWindow(this));
                return;
            }

            try
            {
                _isRunning = true;
                RunNetworkButton.IsEnabled = false;
                RunNetworkButton.Content = "⏳ Otimizando...";

                App.LoggingService?.LogInfo("[NetworkView] Iniciando bateria de otimizações selecionadas...");

                // Telemetry
                App.TelemetryService?.TrackEvent("NETWORK_OPTIMIZE", "Standard", "Start", forceFlush: true);

                if (App.NetworkOptimizer == null)
                {
                    ModernMessageBox.Show("Serviço de rede não inicializado.", "Erro", MessageBoxButton.OK, MessageBoxImage.Error, Window.GetWindow(this));
                    return;
                }

                // Iniciar operação prioritária
                GlobalProgressService.Instance.StartOperation("Otimização de Rede", isPriority: true);

                // 1. Flush DNS
                if (NetworkFlushDNS.IsChecked == true)
                {
                    GlobalProgressService.Instance.UpdateProgress(20, "Limpando cache DNS...");
                    await App.NetworkOptimizer.FlushDnsAsync();
                }

                // 2. Renew DHCP
                if (NetworkRenewDHCP.IsChecked == true)
                {
                    GlobalProgressService.Instance.UpdateProgress(40, "Renovando DHCP...");
                    await App.NetworkOptimizer.RenewDhcpAsync();
                }

                // 3. Reset Winsock
                if (NetworkResetWinsock.IsChecked == true)
                {
                    GlobalProgressService.Instance.UpdateProgress(60, "Redefinindo Winsock...");
                    await App.NetworkOptimizer.ResetWinsockAsync();
                }

                // 4. Reset TCP/IP
                if (NetworkResetTCP.IsChecked == true)
                {
                    GlobalProgressService.Instance.UpdateProgress(80, "Redefinindo Pilha IP...");
                    await App.NetworkOptimizer.ResetIPStackAsync();
                }

                GlobalProgressService.Instance.UpdateProgress(100, "Concluído!");
                
                new ToastService().Show("Sucesso", "Otimização de Rede concluída!");
                ModernMessageBox.Show("Processo de otimização concluído com sucesso!", "Sucesso", MessageBoxButton.OK, MessageBoxImage.Information, Window.GetWindow(this));
                
                // Telemetry End
                App.TelemetryService?.TrackEvent("NETWORK_OPTIMIZE_END", "Standard", "End", success: true, forceFlush: true);
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[NetworkView] Erro crítico na otimização", ex);
                ModernMessageBox.Show($"Erro: {ex.Message}", "Erro", MessageBoxButton.OK, MessageBoxImage.Error, Window.GetWindow(this));
            }
            finally
            {
                GlobalProgressService.Instance.CompleteOperation("Otimização de Rede Concluída");
                _isRunning = false;
                RunNetworkButton.IsEnabled = true;
                RunNetworkButton.Content = "🚀 Otimizar Agora";
            }
        }

        private void OptimizeStackButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                App.LoggingService?.LogInfo("[NetworkView] Solicitando otimização extrema da pilha de rede...");
                
                // Telemetry
                App.TelemetryService?.TrackEvent("NETWORK_OPTIMIZE_STACK", "Extreme", "Start", forceFlush: true);

                if (App.ExtremeOptimizations == null)
                {
                    ModernMessageBox.Show("Serviço extremo não inicializado.", "Erro", MessageBoxButton.OK, MessageBoxImage.Error, Window.GetWindow(this));
                    return;
                }

                var ok = App.ExtremeOptimizations.OptimizeNetworkStack();
                if (!ok)
                {
                    if (Utils.AdminHelper.IsRunningAsAdministrator())
                    {
                        ModernMessageBox.Show("A pilha de rede não pôde ser totalmente redefinida. Alguns recursos podem estar em uso.\nRecomendamos reiniciar o PC.", "Aviso", MessageBoxButton.OK, MessageBoxImage.Warning, Window.GetWindow(this));
                    }
                    else
                    {
                        ModernMessageBox.Show("Execute como Administrador para esta ação.", "Permissão necessária", MessageBoxButton.OK, MessageBoxImage.Warning, Window.GetWindow(this));
                    }
                    return;
                }

                App.LoggingService?.LogSuccess("[NetworkView] Pilha de rede resetada/otimizada com sucesso.");
                ModernMessageBox.Show("Pilha de rede otimizada! É altamente recomendado reiniciar o computador.", "Sucesso", MessageBoxButton.OK, MessageBoxImage.Information, Window.GetWindow(this));
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[NetworkView] Erro no reset de stack", ex);
                ModernMessageBox.Show($"Erro: {ex.Message}", "Erro", MessageBoxButton.OK, MessageBoxImage.Error, Window.GetWindow(this));
            }
        }
    }
}

