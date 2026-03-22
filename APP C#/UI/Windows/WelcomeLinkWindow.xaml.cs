using System;
using System.Linq;
using System.Windows;
using System.Windows.Input;
using System.Diagnostics;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Services.Enterprise;
using VoltrisOptimizer.Interfaces;

using System.Windows.Interop;
using VoltrisOptimizer.UI.Helpers;
using VoltrisOptimizer.Helpers;
using System.Threading.Tasks;

namespace VoltrisOptimizer.UI.Windows
{
    public partial class WelcomeLinkWindow : Window
    {
        public bool LinkRequested { get; private set; }

        public WelcomeLinkWindow()
        {
            InitializeComponent();
            RoundedWindowHelper.Apply(this, 24);
            Loaded += (s, e) => 
            {
                var helper = new WindowInteropHelper(this);
                Win32WindowHelper.ForceForegroundWindow(helper.Handle);
            };
        }

        private void Window_MouseDown(object sender, MouseButtonEventArgs e)
        {
            if (e.ChangedButton == MouseButton.Left)
                DragMove();
        }

        private async void LinkButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                App.LoggingService?.LogInfo("[WELCOME] Iniciando LinkButton_Click");
                
                // Verificar se é verificação manual (botão mudou o texto)
                if (LinkButton.Content.ToString().Contains("Verificar Manualmente"))
                {
                    LinkButton.IsEnabled = false;
                    LinkButton.Content = "Verificando...";
                    
                    var currentSettings = SettingsService.Instance.Settings;
                    var currentInstallationId = currentSettings.InstallationId;
                    
                    if (!string.IsNullOrEmpty(currentInstallationId))
                    {
                        // Verificar imediatamente
                        await CheckLinkStatusNow(currentInstallationId);
                    }
                    else
                    {
                        new ModernAlertWindow("Nenhum dispositivo registrado encontrado.\n\nPor favor, tente vincular novamente.", "Erro", false).ShowDialog();
                        LinkButton.IsEnabled = true;
                        LinkButton.Content = "Vincular Conta Agora";
                    }
                    return;
                }
                
                var settings = SettingsService.Instance.Settings;
                
                // Usar o MachineIdentityService para ter certeza que usamos o mesmo ID que o resto do sistema
                // Isso evita o erro de identificação que desvincula o PC sozinho
                var identityService = App.Services?.GetService(typeof(MachineIdentityService)) as MachineIdentityService;
                var identity = await (identityService?.GetMachineIdentityAsync() ?? Task.FromResult(new VoltrisOptimizer.Services.Enterprise.Models.MachineIdentity { MachineId = settings.InstallationId ?? Guid.NewGuid().ToString() }));
                var installationId = identity.MachineId;
                
                // Garantir que o ID está salvo no settings e na variável
                if (settings.InstallationId != installationId)
                {
                    settings.InstallationId = installationId;
                    SettingsService.Instance.SaveSettings();
                    
                    // Registrar instalação com informações de hardware se for ID novo
                    await RegisterInstallationWithHardware(installationId);
                }

                // 1. Abrir navegador com múltiplas tentativas
                var url = $"https://voltris.com.br/auth/link-device?installation_id={installationId}";
                App.LoggingService?.LogInfo($"[WELCOME] URL de vinculação: {url}");
                
                bool browserOpened = false;
                
                // Tentativa 1: UseShellExecute = true
                try
                {
                    var psi = new ProcessStartInfo
                    {
                        FileName = url,
                        UseShellExecute = true
                    };
                    Process.Start(psi);
                    browserOpened = true;
                    App.LoggingService?.LogInfo("[WELCOME] Navegador aberto com sucesso (tentativa 1)");
                }
                catch (Exception ex1)
                {
                    App.LoggingService?.LogWarning($"[WELCOME] Falha na tentativa 1: {ex1.Message}");
                    // Tentativa 2: cmd /c start
                    try
                    {
                        var psi = new ProcessStartInfo
                        {
                            FileName = "cmd",
                            Arguments = $"/c start \"\" \"{url}\"",
                            UseShellExecute = false,
                            CreateNoWindow = true
                        };
                        Process.Start(psi);
                        browserOpened = true;
                        App.LoggingService?.LogInfo("[WELCOME] Navegador aberto com sucesso (tentativa 2)");
                    }
                    catch (Exception ex2)
                    {
                        App.LoggingService?.LogWarning($"[WELCOME] Falha na tentativa 2: {ex2.Message}");
                        // Tentativa 3: explorer
                        try
                        {
                            var psi = new ProcessStartInfo
                            {
                                FileName = "explorer",
                                Arguments = url,
                                UseShellExecute = false
                            };
                            Process.Start(psi);
                            browserOpened = true;
                            App.LoggingService?.LogInfo("[WELCOME] Navegador aberto com sucesso (tentativa 3)");
                        }
                        catch (Exception ex3)
                        {
                            App.LoggingService?.LogError($"[WELCOME] Todas as tentativas falharam: {ex3.Message}", ex3);
                            browserOpened = false;
                        }
                    }
                }
                
                if (!browserOpened)
                {
                    // Se não conseguiu abrir, mostrar URL para copiar
                    System.Windows.Clipboard.SetText(url);
                    new ModernAlertWindow($"Não foi possível abrir o navegador automaticamente.\n\nA URL foi copiada para a área de transferência:\n{url}\n\nCole no seu navegador para continuar.", "Aviso", false).ShowDialog();
                    return;
                }
                
                // 2. Mudar estado visual para aguardando
                LinkButton.IsEnabled = false;
                LinkButton.Content = "Aguardando vinculação no navegador... (Não feche)";
                
                // 3. Iniciar verificação em loop
                LinkRequested = true;
                await WaitForLinking(installationId);
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[WELCOME] Erro ao abrir link: {ex.Message}", ex);
                new ModernAlertWindow($"Erro ao tentar vincular:\n{ex.Message}", "Erro", false).ShowDialog();
                // Restaurar estado
                LinkButton.IsEnabled = true;
                LinkButton.Content = "Vincular Conta Agora";
            }
        }

        private async System.Threading.Tasks.Task WaitForLinking(string installationId)
        {
            var service = VoltrisOptimizer.Services.Enterprise.EnterpriseService.Instance;
            
            // Tentar por até 5 minutos (300 segundos)
            // Intervalo de 2 segundos = 150 tentativas
            for (int i = 0; i < 150; i++)
            {
                // Verificar se janela ainda existe
                if (!this.IsVisible) return;

                try
                {
                    // Fazer requisição direta para a API do site para verificar status
                    using (var httpClient = new System.Net.Http.HttpClient())
                    {
                        httpClient.Timeout = TimeSpan.FromSeconds(10);
                        
                        var response = await httpClient.GetAsync($"https://voltris.com.br/api/v1/install/status?installation_id={installationId}");
                        
                        App.LoggingService?.LogInfo($"[WELCOME] Status API call - StatusCode: {response.StatusCode}");
                        
                        if (response.IsSuccessStatusCode)
                        {
                            var content = await response.Content.ReadAsStringAsync();
                            App.LoggingService?.LogInfo($"[WELCOME] Status API Response: {content}");
                            
                            var statusData = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(content);
                            
                            // Log the linked property for debugging
                            bool isLinked = false;
                                                        
                            // Check for both possible property names
                            if (statusData.TryGetProperty("linked", out var linkedProp))
                            {
                                // Handle different data types for linked property
                                if (linkedProp.ValueKind == System.Text.Json.JsonValueKind.String)
                                {
                                    // If it's a string (UUID), check if it's not empty/null
                                    var linkedValue = linkedProp.GetString();
                                    isLinked = !string.IsNullOrEmpty(linkedValue);
                                    App.LoggingService?.LogInfo($"[WELCOME] Linked property (string): '{linkedValue}' -> isLinked: {isLinked}");
                                }
                                else if (linkedProp.ValueKind == System.Text.Json.JsonValueKind.True)
                                {
                                    isLinked = true;
                                    App.LoggingService?.LogInfo("[WELCOME] Linked property (boolean): true");
                                }
                                else if (linkedProp.ValueKind == System.Text.Json.JsonValueKind.False)
                                {
                                    isLinked = false;
                                    App.LoggingService?.LogInfo("[WELCOME] Linked property (boolean): false");
                                }
                                else if (linkedProp.ValueKind == System.Text.Json.JsonValueKind.Null)
                                {
                                    isLinked = false;
                                    App.LoggingService?.LogInfo("[WELCOME] Linked property is null");
                                }
                                else
                                {
                                    App.LoggingService?.LogWarning($"[WELCOME] Unexpected linked property type: {linkedProp.ValueKind}");
                                }
                            }
                            else if (statusData.TryGetProperty("is_linked", out var isLinkedProp))
                            {
                                isLinked = isLinkedProp.GetBoolean();
                                App.LoggingService?.LogInfo($"[WELCOME] is_linked property value: {isLinked}");
                            }
                            else
                            {
                                App.LoggingService?.LogWarning("[WELCOME] Neither 'linked' nor 'is_linked' property found in response");
                                // Log full response for debugging
                                App.LoggingService?.LogWarning($"[WELCOME] Full response: {content}");
                            }
                            
                            if (isLinked)
                            {
                                string email = "usuário";
                                // Check for both possible email property names
                                if (statusData.TryGetProperty("user_email", out var userEmailProp))
                                {
                                    email = userEmailProp.GetString() ?? "usuário";
                                }
                                else if (statusData.TryGetProperty("email", out var emailProp))
                                {
                                    email = emailProp.GetString() ?? "usuário";
                                }
                                
                                // SUCESSO!
                                var settings = SettingsService.Instance.Settings;
                                settings.LinkedUserEmail = email;
                                settings.IsDeviceLinked = true;
                                settings.WelcomePromptShown = true; // Marcar que o Welcome foi mostrado
                                settings.IsFirstRun = false;
                                SettingsService.Instance.SaveSettings();
                                
                                App.LoggingService?.LogInfo($"[WELCOME] Dispositivo vinculado com sucesso a: {email}");
                                
                                Dispatcher.Invoke(() =>
                                {
                                    // Fechar a janela de Welcome primeiro
                                    DialogResult = true;
                                    Close();
                                    
                                    // Aguardar um pouco para garantir que a janela fechou
                                    System.Threading.Thread.Sleep(100);
                                    
                                    // Mostrar o modal de sucesso
                                    new ModernAlertWindow($"Dispositivo vinculado com sucesso!\n\nConta: {email}\n\nO aplicativo continuará normalmente.", "Vinculado!", true).ShowDialog();
                                });
                                
                                return;
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    App.LoggingService?.LogWarning($"[WELCOME] Erro ao verificar status (tentativa {i+1}): {ex.Message}");
                    App.LoggingService?.LogWarning($"[WELCOME] Exception details: {ex}");
                }
                
                // Aguardar antes de tentar de novo
                await System.Threading.Tasks.Task.Delay(2000);
            }
            
            // Timeout - oferecer opção de verificação manual
            Dispatcher.Invoke(() =>
            {
                LinkButton.IsEnabled = true;
                LinkButton.Content = "Verificar Manualmente";
                var result = new ModernAlertWindow(
                    "O tempo limite para vinculação expirou.\n\n" +
                    "Você pode:\n" +
                    "• Clicar em \"Verificar Manualmente\" para checar novamente\n" +
                    "• Tentar vincular novamente\n" +
                    "• Continuar sem vincular",
                    "Tempo Esgotado", 
                    false
                ).ShowDialog();
                
                // Se usuário fechar o alerta, continuar normalmente
                if (result != true)
                {
                    DialogResult = false;
                    Close();
                }
            });
        }

        private void SkipButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                // Marcar que o welcome já foi mostrado para não aparecer novamente
                var settings = SettingsService.Instance.Settings;
                settings.IsFirstRun = false;
                settings.WelcomePromptShown = true;
                
                // NÃO marcar como vinculado - apenas indicar que o usuário já viu o Welcome
                // IsDeviceLinked deve permanecer false quando o usuário pula
                settings.IsDeviceLinked = false;
                settings.LinkedUserEmail = null;
                
                SettingsService.Instance.SaveSettings();
                
                App.LoggingService?.LogInfo("[WELCOME] Usuário optou por continuar sem vincular - WelcomePromptShown = true, IsDeviceLinked = false");
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[WELCOME] Erro ao salvar skip: {ex.Message}", ex);
            }
            
            DialogResult = false;
            Close();
        }

        private async System.Threading.Tasks.Task RegisterInstallationWithHardware(string installationId)
        {
            try
            {
                App.LoggingService?.LogInfo($"[WELCOME] Registrando instalação com hardware: {installationId}");
                
                // Obter informações de hardware
                var systemInfoService = App.Services?.GetService(typeof(ISystemInfoService)) as ISystemInfoService;
                if (systemInfoService == null)
                {
                    App.LoggingService?.LogWarning("[WELCOME] ISystemInfoService não disponível");
                    return;
                }
                
                var cpuInfo = await systemInfoService.GetCpuInfoAsync();
                var ramInfo = await systemInfoService.GetRamInfoAsync();
                var gpuInfo = await systemInfoService.GetGpuInfoAsync();
                var drives = await systemInfoService.GetDrivesInfoAsync();
                
                // Detectar tipo de disco principal (C:)
                string diskType = "HDD";
                if (drives != null && drives.Length > 0)
                {
                    var mainDrive = drives.FirstOrDefault(d => d.Letter.StartsWith("C", StringComparison.OrdinalIgnoreCase));
                    if (mainDrive != null)
                    {
                        diskType = mainDrive.IsSsd ? "SSD" : "HDD";
                    }
                }
                
                // Obter versão e edição do Windows
                string windowsVersion = systemInfoService.GetWindowsVersion();
                string windowsEdition = systemInfoService.GetWindowsEdition();
                int windowsBuild = systemInfoService.GetWindowsBuild();
                
                // Preparar payload de hardware
                var hardwareData = new
                {
                    cpu_name = cpuInfo?.Name ?? "Unknown CPU",
                    ram_gb_total = ramInfo != null ? (int)Math.Round(ramInfo.TotalBytes / (1024.0 * 1024 * 1024)) : 0,
                    gpu_name = gpuInfo?.Name ?? "Unknown GPU",
                    disk_type = diskType,
                    os_name = windowsVersion,
                    os_build = windowsBuild.ToString(),
                    windows_edition = windowsEdition,
                    architecture = Environment.Is64BitOperatingSystem ? "x64" : "x86"
                };
                
                var payload = new
                {
                    installation_id = installationId,
                    app_version = System.Reflection.Assembly.GetExecutingAssembly().GetName().Version?.ToString() ?? "1.0.0",
                    hardware = hardwareData
                };
                
                // Enviar para API
                using (var httpClient = new System.Net.Http.HttpClient())
                {
                    httpClient.Timeout = TimeSpan.FromSeconds(30);
                    
                    var json = System.Text.Json.JsonSerializer.Serialize(payload);
                    var content = new System.Net.Http.StringContent(json, System.Text.Encoding.UTF8, "application/json");
                    
                    var response = await httpClient.PostAsync("https://voltris.com.br/api/v1/install", content);
                    
                    App.LoggingService?.LogInfo($"[WELCOME] Registro de instalação - StatusCode: {response.StatusCode}");
                    
                    if (response.IsSuccessStatusCode)
                    {
                        App.LoggingService?.LogSuccess("[WELCOME] Instalação registrada com sucesso no servidor");
                    }
                    else
                    {
                        var errorContent = await response.Content.ReadAsStringAsync();
                        App.LoggingService?.LogWarning($"[WELCOME] Falha ao registrar instalação: {response.StatusCode} - {errorContent}");
                    }
                }
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[WELCOME] Erro ao registrar instalação: {ex.Message}", ex);
            }
        }

        private async System.Threading.Tasks.Task CheckLinkStatusNow(string installationId)
        {
            try
            {
                App.LoggingService?.LogInfo($"[WELCOME] Verificação manual iniciada para ID: {installationId}");
                
                using (var httpClient = new System.Net.Http.HttpClient())
                {
                    httpClient.Timeout = TimeSpan.FromSeconds(10);
                    
                    var response = await httpClient.GetAsync($"https://voltris.com.br/api/v1/install/status?installation_id={installationId}");
                    
                    App.LoggingService?.LogInfo($"[WELCOME] Status API call - StatusCode: {response.StatusCode}");
                    
                    if (response.IsSuccessStatusCode)
                    {
                        var content = await response.Content.ReadAsStringAsync();
                        App.LoggingService?.LogInfo($"[WELCOME] Status API Response: {content}");
                        
                        var statusData = System.Text.Json.JsonSerializer.Deserialize<System.Text.Json.JsonElement>(content);
                        
                        // Check for both possible property names
                        bool isLinked = false;
                        if (statusData.TryGetProperty("linked", out var linkedProp))
                        {
                            // Handle different data types for linked property
                            if (linkedProp.ValueKind == System.Text.Json.JsonValueKind.String)
                            {
                                // If it's a string (UUID), check if it's not empty/null
                                var linkedValue = linkedProp.GetString();
                                isLinked = !string.IsNullOrEmpty(linkedValue);
                            }
                            else if (linkedProp.ValueKind == System.Text.Json.JsonValueKind.True)
                            {
                                isLinked = true;
                            }
                            else if (linkedProp.ValueKind == System.Text.Json.JsonValueKind.False)
                            {
                                isLinked = false;
                            }
                            else if (linkedProp.ValueKind == System.Text.Json.JsonValueKind.Null)
                            {
                                isLinked = false;
                            }
                        }
                        else if (statusData.TryGetProperty("is_linked", out var isLinkedProp))
                        {
                            isLinked = isLinkedProp.GetBoolean();
                        }
                        
                        if (isLinked)
                        {
                            string email = "usuário";
                            // Check for both possible email property names
                            if (statusData.TryGetProperty("user_email", out var userEmailProp))
                            {
                                email = userEmailProp.GetString() ?? "usuário";
                            }
                            else if (statusData.TryGetProperty("email", out var emailProp))
                            {
                                email = emailProp.GetString() ?? "usuário";
                            }
                            
                            // SUCESSO!
                            var settings = SettingsService.Instance.Settings;
                            settings.LinkedUserEmail = email;
                            settings.IsDeviceLinked = true;
                            settings.WelcomePromptShown = true; // Marcar que o Welcome foi mostrado
                            settings.IsFirstRun = false;
                            SettingsService.Instance.SaveSettings();
                            
                            App.LoggingService?.LogInfo($"[WELCOME] Dispositivo vinculado com sucesso a: {email}");
                            
                            // Fechar a janela de Welcome primeiro
                            DialogResult = true;
                            Close();
                            
                            // Aguardar um pouco para garantir que a janela fechou
                            System.Threading.Thread.Sleep(100);
                            
                            // Mostrar o modal de sucesso
                            new ModernAlertWindow($"Dispositivo vinculado com sucesso!\n\nConta: {email}\n\nO aplicativo continuará normalmente.", "Vinculado!", true).ShowDialog();
                            
                            return;
                        }
                        else
                        {
                            new ModernAlertWindow("O dispositivo ainda não está vinculado.\n\nPor favor, complete o processo de vinculação no site e tente novamente.", "Ainda Não Vinculado", false).ShowDialog();
                        }
                    }
                    else
                    {
                        new ModernAlertWindow($"Erro ao verificar status: {response.StatusCode}\n\nPor favor, tente novamente mais tarde.", "Erro de Conexão", false).ShowDialog();
                    }
                }
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[WELCOME] Erro na verificação manual: {ex.Message}", ex);
                new ModernAlertWindow($"Erro ao verificar status:\n{ex.Message}", "Erro", false).ShowDialog();
            }
            finally
            {
                // Restaurar estado do botão
                LinkButton.IsEnabled = true;
                LinkButton.Content = "Verificar Manualmente";
            }
        }
    }
}
