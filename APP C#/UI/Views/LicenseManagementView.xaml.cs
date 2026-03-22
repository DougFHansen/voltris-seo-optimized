using System;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.UI.Controls;

namespace VoltrisOptimizer.UI.Views
{
    /// <summary>
    /// Professional Enterprise License Management View
    /// </summary>
    public partial class LicenseManagementView : UserControl
    {
        public LicenseManagementView()
        {
            InitializeComponent();
            LoadLicenseData();
        }

        private void LoadLicenseData()
        {
            try
            {
                var licenseInfo = LicenseManager.Instance.GetLicenseInfo();
                
                if (licenseInfo != null)
                {
                    // === HEADER UPDATES ===
                    HeaderPlanText.Text = licenseInfo.PlanType?.ToUpper() ?? "UNKNOWN";
                    
                    if (licenseInfo.IsLifetime)
                    {
                        HeaderExpiryText.Text = "Vitalício (Atualizações Incluídas)";
                        ExpiryDateText.Text = "Vitalício";
                        ExpiryDateText.Foreground = (Brush)FindResource("CheckColor");
                    }
                    else
                    {
                        HeaderExpiryText.Text = $"Válido até {licenseInfo.ExpiryDate:dd/MM/yyyy}";
                        ExpiryDateText.Text = licenseInfo.ExpiryDate.ToString("dd/MM/yyyy");
                        
                        // Check if expiring soon (less than 30 days)
                        if ((licenseInfo.ExpiryDate - DateTime.Now).TotalDays < 30)
                        {
                             ExpiryDateText.Foreground = new SolidColorBrush(Color.FromRgb(255, 160, 0)); // Warning Orange
                        }
                    }

                    // === DETAILS COLUMN ===
                    StatusText.Text = licenseInfo.IsActive ? "Ativo" : "Inativo";
                    PlanTypeText.Text = licenseInfo.PlanType;
                    
                    LicenseKeyText.Text = string.IsNullOrEmpty(licenseInfo.LicenseKey) 
                        ? "Nenhuma Chave" 
                        : licenseInfo.LicenseKey; 

                    // Device counts
                    if (licenseInfo.MaxDevices >= 9999)
                    {
                        DevicesText.Text = "Ilimitado";
                    }
                    else
                    {
                        DevicesText.Text = $"{licenseInfo.ActiveDevices}/{licenseInfo.MaxDevices}";
                    }
                    
                    ActivationDateText.Text = licenseInfo.ActivationDate.ToString("dd/MM/yyyy");
                    DeviceIdText.Text = licenseInfo.DeviceId ?? "Unknown";
                }
                else
                {
                    ShowTrialData();
                }
            }
            catch (Exception)
            {
                ShowTrialData();
            }
        }

        private void ShowTrialData()
        {
            HeaderPlanText.Text = "TRIAL";
            HeaderExpiryText.Text = "Expirado";
            StatusText.Text = "Inativo / Trial";
            StatusText.Foreground = new SolidColorBrush(Color.FromRgb(255, 75, 107)); // Error Red
            
            PlanTypeText.Text = "Trial Version";
            LicenseKeyText.Text = "TRIAL-MODE-active";
            ActivationDateText.Text = DateTime.Now.ToString("dd/MM/yyyy");
            ExpiryDateText.Text = DateTime.Now.AddDays(7).ToString("dd/MM/yyyy");
            DevicesText.Text = "1/1";
            DeviceIdText.Text = LicenseManager.Instance.GetDeviceId() ?? "Unknown";
        }

        // ===== EVENT HANDLERS =====
       
        private void CloseWindow_Click(object sender, RoutedEventArgs e)
        {
            Window.GetWindow(this)?.Close();
        }

        // ===== EVENT HANDLERS =====
       
        private void ChangeLicense_Click(object sender, RoutedEventArgs e)
        {
            var result = ModernMessageBox.Show(
                "Deseja ativar uma nova chave de licença?\n\n" +
                "Isso irá substituir sua licença atual.",
                "Trocar Licença",
                MessageBoxButton.YesNo,
                MessageBoxImage.Question,
                Window.GetWindow(this));

            if (result == MessageBoxResult.Yes)
            {
                try 
                {
                    // Abrir janela de ativação
                    var activationWindow = new LicenseActivationView(false, 0);
                    activationWindow.ShowDialog();
                    
                    // Reload data after potential activation
                    LoadLicenseData();
                }
                catch (Exception ex)
                {
                    ModernMessageBox.Show("Erro ao abrir janela de ativação: " + ex.Message, "Erro", MessageBoxButton.OK, MessageBoxImage.Error, Window.GetWindow(this));
                }
            }
        }

        private void BuyLicense_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                // Abre a janela de ativação padrão (Original)
                var activationWindow = new LicenseActivationView();
                activationWindow.Owner = Window.GetWindow(this);
                activationWindow.ShowDialog();
                
                // Recarrega os dados caso tenha ativado
                LoadLicenseData();
            }
            catch (Exception ex)
            {
                ModernMessageBox.Show("Erro ao abrir janela de ativação: " + ex.Message, "Erro", MessageBoxButton.OK, MessageBoxImage.Error, Window.GetWindow(this));
            }
        }

        private void Support_Click(object sender, RoutedEventArgs e)
        {
            OpenUrl("https://wa.me/5511996716235");
        }

        private void DeactivateLicense_Click(object sender, RoutedEventArgs e)
        {
            var result = ModernMessageBox.Show(
                "⚠️ ATENÇÃO ⚠️\n\n" +
                "Tem certeza que deseja DESATIVAR sua licença?\n\n" +
                "Você perderá acesso a todos os recursos premium.\n" +
                "O aplicativo voltará para o modo Trial.",
                "Confirmar Desativação",
                MessageBoxButton.YesNo,
                MessageBoxImage.Warning,
                Window.GetWindow(this));

            if (result == MessageBoxResult.Yes)
            {
                try
                {
                    LicenseManager.Instance.ResetTrial();
                    
                    ModernMessageBox.Show(
                        "Licença desativada com sucesso.\n\n" +
                        "O aplicativo agora está em modo Trial.",
                        "Licença Desativada",
                        MessageBoxButton.OK,
                        MessageBoxImage.Information,
                        Window.GetWindow(this));
                    
                    // Close the window
                    Window.GetWindow(this)?.Close();
                }
                catch (Exception ex)
                {
                     ModernMessageBox.Show($"Erro ao desativar licença:\n\n{ex.Message}", "Erro", MessageBoxButton.OK, MessageBoxImage.Error, Window.GetWindow(this));
                }
            }
        }

        private void CopyLicenseKey_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                var key = LicenseKeyText.Text;
                if (!string.IsNullOrWhiteSpace(key) && key != "Nenhuma Chave")
                {
                    Clipboard.SetText(key);
                    ModernMessageBox.Show("Chave copiada para a área de transferência!", "Sucesso", MessageBoxButton.OK, MessageBoxImage.Information, Window.GetWindow(this));
                }
            }
            catch { }
        }

        private void OpenUrl(string url)
        {
            try
            {
                System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
                {
                    FileName = url,
                    UseShellExecute = true
                });
            }
            catch
            {
                 ModernMessageBox.Show($"Não foi possível abrir o link: {url}", "Erro", MessageBoxButton.OK, MessageBoxImage.Error, Window.GetWindow(this));
            }
        }
    }

    // License Info Model (aligned with LicenseManager)
    public class LicenseInfo
    {
        public string LicenseKey { get; set; } = "";
        public string PlanType { get; set; } = "Trial";
        public DateTime ActivationDate { get; set; } = DateTime.Now;
        public DateTime ExpiryDate { get; set; } = DateTime.Now.AddDays(7);
        public bool IsLifetime { get; set; } = false;
        public int MaxDevices { get; set; } = 1;
        public int ActiveDevices { get; set; } = 1;
        public string RegisteredTo { get; set; } = "";
        public string DeviceId { get; set; } = "";
        public bool IsActive { get; set; } = false;
    }
}
