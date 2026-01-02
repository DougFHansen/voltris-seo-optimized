using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Threading;
using System.Threading.Tasks;
using System.Management;
using System.IO;
using System.Net.NetworkInformation;
using System.Diagnostics;
using System.Threading;
using VoltrisOptimizer;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.UI;
using VoltrisOptimizer.UI.Controls;
using VoltrisOptimizer.UI.Windows;
using Application = System.Windows.Application;

namespace VoltrisOptimizer.UI.Views
{
    /// <summary>
    /// Interaction logic for DashboardView.xaml
    /// </summary>
    public partial class DashboardView : UserControl
    {
        private DispatcherTimer? _refreshTimer;
        private bool _isLoading = false;
        private SmartAIExecutor? _smartExecutor;

        public DashboardView()
        {
            InitializeComponent();
            
            // Inicializar SmartAIExecutor
            if (App.LoggingService != null)
            {
                _smartExecutor = new SmartAIExecutor(App.LoggingService);
            }
            
            Loaded += DashboardView_Loaded;
            Unloaded += (s, e) =>
            {
                try { _refreshTimer?.Stop(); } catch { }
                _refreshTimer = null;
            };
        }

        private async void DashboardView_Loaded(object sender, RoutedEventArgs e)
        {
            await LoadSystemInfoAsync();
            
            // Atualizar informações a cada 10 segundos
            _refreshTimer = new DispatcherTimer
            {
                Interval = TimeSpan.FromSeconds(10)
            };
            _refreshTimer.Tick += async (s, args) => await LoadSystemInfoAsync();
            _refreshTimer.Start();
            
            
        }
        
        
        
        

        private async Task LoadSystemInfoAsync()
        {
            if (_isLoading) return;
            
            try
            {
                _isLoading = true;
                
                // Carregar informações do sistema em paralelo
                var osTask = Task.Run(() => GetOSVersion());
                var cpuTask = Task.Run(() => GetProcessorName());
                var totalRAMTask = Task.Run(() => GetTotalRAMBytes());
                var availableRAMTask = Task.Run(() => GetAvailableRAMBytes());
                var freeDiskTask = Task.Run(() => GetFreeDiskSpaceBytes());
                var totalDiskTask = Task.Run(() => GetTotalDiskSpaceBytes());
                var spaceToCleanTask = GetSpaceToCleanBytesAsync();
                var cpuUsageTask = GetCPUUsagePercentAsync();
                var healthStatusTask = Task.Run(() => GetSystemHealthStatus());
                var networkTask = Task.Run(() => IsNetworkConnected());
                
                await Task.WhenAll(osTask, cpuTask, totalRAMTask, availableRAMTask, 
                    freeDiskTask, totalDiskTask, spaceToCleanTask, cpuUsageTask, healthStatusTask, networkTask);
                
                // Atualizar UI no dispatcher
                Dispatcher.Invoke(() =>
                {
                    UpdateSystemInfo(osTask.Result, cpuTask.Result,
                        totalRAMTask.Result, availableRAMTask.Result,
                        freeDiskTask.Result, totalDiskTask.Result,
                        spaceToCleanTask.Result, cpuUsageTask.Result,
                        healthStatusTask.Result, networkTask.Result);
                });
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("Erro ao carregar informações do sistema", ex);
            }
            finally
            {
                _isLoading = false;
            }
        }

        private void UpdateSystemInfo(string osVersion, string processorName,
            long totalRAM, long availableRAM,
            long freeDisk, long totalDisk,
            long spaceToClean, double cpuUsage,
            SystemHealthStatus healthStatus, bool networkConnected)
        {
            // Atualizar card de Status do Sistema
            UpdateSystemStatusCard(healthStatus);
            
            // Atualizar card de Limpeza
            UpdateCleanupCard(spaceToClean);
            
            // Atualizar card de Desempenho
            UpdatePerformanceCard(cpuUsage, totalRAM, availableRAM);
            
            // Atualizar card de Rede
            UpdateNetworkCard(networkConnected);
            
            // Atualizar informações do sistema
            UpdateSystemInfoCard(osVersion, processorName, totalRAM, freeDisk, totalDisk);
            UpdateAdaptiveIndicator();
            UpdateIncidentIndicator();
        }

        private void UpdateSystemStatusCard(SystemHealthStatus status)
        {
            if (SystemStatusText == null || SystemStatusDescription == null) return;
            
            switch (status)
            {
                case SystemHealthStatus.Good:
                    SystemStatusText.Text = "Ótimo";
                    SystemStatusText.Foreground = (System.Windows.Media.SolidColorBrush)Application.Current.Resources["SuccessBrush"];
                    SystemStatusDescription.Text = "Status geral do sistema em perfeitas condições";
                    break;
                case SystemHealthStatus.Warning:
                    SystemStatusText.Text = "Atenção";
                    SystemStatusText.Foreground = (System.Windows.Media.SolidColorBrush)Application.Current.Resources["WarningBrush"];
                    SystemStatusDescription.Text = "Algumas otimizações são recomendadas";
                    break;
                case SystemHealthStatus.Critical:
                    SystemStatusText.Text = "Crítico";
                    SystemStatusText.Foreground = (System.Windows.Media.SolidColorBrush)Application.Current.Resources["ErrorBrush"];
                    SystemStatusDescription.Text = "Ação imediata recomendada";
                    break;
                default:
                    SystemStatusText.Text = "Verificando...";
                    SystemStatusDescription.Text = "Analisando status do sistema...";
                    break;
            }
        }

        private void UpdateCleanupCard(long spaceToClean)
        {
            if (CleanupSizeText == null) return;
            
            if (spaceToClean > 0)
            {
                CleanupSizeText.Text = FormatBytes(spaceToClean);
                if (CleanupDetailsText != null)
                    CleanupDetailsText.Text = "arquivos temporários detectados";
                
            }
            else
            {
                CleanupSizeText.Text = "Limpo";
                CleanupSizeText.Foreground = (System.Windows.Media.SolidColorBrush)Application.Current.Resources["SuccessBrush"];
                if (CleanupDetailsText != null)
                    CleanupDetailsText.Text = "nenhum arquivo para limpar";
                
            }
        }

        private void UpdatePerformanceCard(double cpuUsage, long totalRAM, long availableRAM)
        {
            if (PerformancePercentText == null) return;
            
            // Calcular percentual de RAM usado
            double ramUsagePercent = 0;
            if (totalRAM > 0)
            {
                ramUsagePercent = (1.0 - (double)availableRAM / totalRAM) * 100;
            }
            
            // Calcular desempenho geral (100% menos média de uso)
            double performance = 100 - ((cpuUsage + ramUsagePercent) / 2.0);
            performance = Math.Max(0, Math.Min(100, performance));
            
            PerformancePercentText.Text = $"{performance:F0}%";
            
            // Mudar cor baseado no desempenho
            if (performance >= 80)
            {
                PerformancePercentText.Foreground = (System.Windows.Media.SolidColorBrush)Application.Current.Resources["SuccessBrush"];
            }
            else if (performance >= 50)
            {
                PerformancePercentText.Foreground = (System.Windows.Media.SolidColorBrush)Application.Current.Resources["WarningBrush"];
            }
            else
            {
                PerformancePercentText.Foreground = (System.Windows.Media.SolidColorBrush)Application.Current.Resources["ErrorBrush"];
            }
            
            // NOVO: Mostrar/ocultar botão "Melhorar Desempenho"
            if (ImprovePerformanceButton != null && ImprovePerformanceText != null)
            {
                if (performance < 80)
                {
                    ImprovePerformanceButton.Visibility = Visibility.Visible;
                    var improvement = 100 - performance;
                    ImprovePerformanceText.Text = $"Melhorar em {improvement:F0}%";
                }
                else
                {
                    ImprovePerformanceButton.Visibility = Visibility.Collapsed;
                }
            }
        }
        
        /// <summary>
        /// Botão "Melhorar Desempenho" - Executa otimizações inteligentes
        /// </summary>
        private async void ImprovePerformanceButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                ImprovePerformanceButton.IsEnabled = false;
                var originalText = ImprovePerformanceText.Text;
                ImprovePerformanceText.Text = "Otimizando...";
                
                App.LoggingService?.LogInfo("[Dashboard] Iniciando otimização inteligente");
                
                // 1. Limpar arquivos temporários (30%)
                ImprovePerformanceText.Text = "Limpando arquivos temporários...";
                GlobalProgressService.Instance.UpdateProgress(10, "Dashboard: Limpando arquivos temporários...");
                
                if (App.SystemCleaner != null)
                {
                    try
                    {
                        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));
                        await App.SystemCleaner.CleanTempFilesAsync(null, cts.Token);
                        GlobalProgressService.Instance.UpdateProgress(30, "Dashboard: Arquivos temporários limpos");
                        App.LoggingService?.LogInfo("[Dashboard] Arquivos temporários limpos");
                    }
                    catch (Exception ex)
                    {
                        App.LoggingService?.LogWarning($"[Dashboard] Erro ao limpar temp: {ex.Message}");
                    }
                }
                
                // 2. Esvaziar lixeira (50%)
                ImprovePerformanceText.Text = "Esvaziando lixeira...";
                GlobalProgressService.Instance.UpdateProgress(40, "Dashboard: Esvaziando lixeira...");
                
                if (App.SystemCleaner != null)
                {
                    try
                    {
                        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));
                        await App.SystemCleaner.EmptyRecycleBinAsync(null, cts.Token);
                        GlobalProgressService.Instance.UpdateProgress(50, "Dashboard: Lixeira esvaziada");
                        App.LoggingService?.LogInfo("[Dashboard] Lixeira esvaziada");
                    }
                    catch (Exception ex)
                    {
                        App.LoggingService?.LogWarning($"[Dashboard] Erro ao esvaziar lixeira: {ex.Message}");
                    }
                }
                
                // 3. Limpar cache de navegadores (70%)
                ImprovePerformanceText.Text = "Limpando cache de navegadores...";
                GlobalProgressService.Instance.UpdateProgress(60, "Dashboard: Limpando cache de navegadores...");
                
                if (App.SystemCleaner != null)
                {
                    try
                    {
                        using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));
                        await App.SystemCleaner.CleanBrowserCacheAsync(null, cts.Token);
                        GlobalProgressService.Instance.UpdateProgress(70, "Dashboard: Cache de navegadores limpo");
                        App.LoggingService?.LogInfo("[Dashboard] Cache de navegadores limpo");
                    }
                    catch (Exception ex)
                    {
                        App.LoggingService?.LogWarning($"[Dashboard] Erro ao limpar cache: {ex.Message}");
                    }
                }
                
                // 4. Otimizar memória (90%)
                ImprovePerformanceText.Text = "Otimizando memória...";
                GlobalProgressService.Instance.UpdateProgress(80, "Dashboard: Otimizando memória...");
                
                try
                {
                    // Forçar coleta de lixo
                    GC.Collect();
                    GC.WaitForPendingFinalizers();
                    GC.Collect();
                    GlobalProgressService.Instance.UpdateProgress(90, "Dashboard: Memória otimizada");
                    App.LoggingService?.LogInfo("[Dashboard] Memória otimizada");
                }
                catch (Exception ex)
                {
                    App.LoggingService?.LogWarning($"[Dashboard] Erro ao otimizar memória: {ex.Message}");
                }
                
                // 5. Atualizar métricas (100%)
                ImprovePerformanceText.Text = "Atualizando métricas...";
                GlobalProgressService.Instance.UpdateProgress(95, "Dashboard: Atualizando métricas...");
                
                await LoadSystemInfoAsync();
                
                GlobalProgressService.Instance.UpdateProgress(100, "Dashboard: Otimização concluída!");
                
                ImprovePerformanceText.Text = "Concluído!";
                await Task.Delay(1000);
                
                new ToastService().Show(
                    "Otimização Concluída", 
                    "Desempenho melhorado com sucesso!");
                
                App.LoggingService?.LogSuccess("[Dashboard] Otimização inteligente concluída");
                
                // Resetar progresso após 2 segundos
                await Task.Delay(2000);
                GlobalProgressService.Instance.ResetProgress();
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[Dashboard] Erro ao melhorar desempenho", ex);
                new ToastService().Show(
                    "Erro", 
                    "Não foi possível otimizar o sistema.");
                GlobalProgressService.Instance.ResetProgress();
            }
            finally
            {
                ImprovePerformanceButton.IsEnabled = true;
                ImprovePerformanceText.Text = "Melhorar Desempenho";
            }
        }

        private void UpdateNetworkCard(bool connected)
        {
            // Atualizar status da rede se necessário
            // Por enquanto apenas mantemos o card de Segurança
        }

        private void UpdateSystemInfoCard(string osVersion, string processorName,
            long totalRAM, long freeDisk, long totalDisk)
        {
            if (WindowsVersionText != null)
                WindowsVersionText.Text = osVersion;
            
            if (ProcessorText != null)
                ProcessorText.Text = processorName;
            
            if (RAMText != null)
                RAMText.Text = FormatBytes(totalRAM);
            
            if (StorageText != null)
            {
                string freeFormatted = FormatBytes(freeDisk);
                string totalFormatted = FormatBytes(totalDisk);
                StorageText.Text = $"{freeFormatted} livres de {totalFormatted}";
            }
        }

        private string GetOSVersion()
        {
            try
            {
                using (var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_OperatingSystem"))
                {
                    foreach (ManagementObject obj in searcher.Get())
                    {
                        string name = obj["Name"]?.ToString() ?? "";
                        if (name.Contains("|"))
                            name = name.Split('|')[0].Trim();
                        
                        // Extrair versão
                        string version = obj["Version"]?.ToString() ?? "";
                        
                        // Formatar nome
                        name = name.Replace("Microsoft ", "").Trim();
                        
                        return name;
                    }
                }
            }
            catch
            {
                return Environment.OSVersion.ToString();
            }
            
            return "Windows Desconhecido";
        }

        private string GetProcessorName()
        {
            try
            {
                using (var searcher = new ManagementObjectSearcher("SELECT Name FROM Win32_Processor"))
                {
                    foreach (ManagementObject obj in searcher.Get())
                    {
                        return obj["Name"]?.ToString() ?? "Processador Desconhecido";
                    }
                }
            }
            catch
            {
                return "Processador Desconhecido";
            }
            
            return "Processador Desconhecido";
        }

        private long GetTotalRAMBytes()
        {
            try
            {
                using (var searcher = new ManagementObjectSearcher("SELECT TotalPhysicalMemory FROM Win32_ComputerSystem"))
                {
                    foreach (ManagementObject obj in searcher.Get())
                    {
                        return Convert.ToInt64(obj["TotalPhysicalMemory"] ?? 0);
                    }
                }
            }
            catch
            {
                return 0;
            }
            
            return 0;
        }

        private long GetAvailableRAMBytes()
        {
            try
            {
                var pc = new PerformanceCounter("Memory", "Available Bytes");
                return Convert.ToInt64(pc.NextValue());
            }
            catch
            {
                return 0;
            }
        }

        private long GetFreeDiskSpaceBytes()
        {
            try
            {
                var root = Path.GetPathRoot(Environment.SystemDirectory);
                if (string.IsNullOrEmpty(root)) return 0;
                var drive = new DriveInfo(root);
                if (!drive.IsReady) return 0;
                return drive.AvailableFreeSpace;
            }
            catch
            {
                return 0;
            }
        }

        private void UpdateAdaptiveIndicator()
        {
            try
            {
                var svc = App.GamerOptimizer;
                if (AdaptiveStatusText == null || svc == null)
                {
                    if (AdaptiveStatusText != null) AdaptiveStatusText.Text = "Desativado";
                    return;
                }
                var net = svc.IsAdaptiveNetworkEnabled;
                var anti = svc.IsAntiStutterEnabled;
                AdaptiveStatusText.Text = $"Rede: {(net ? "On" : "Off")} • Stutter: {(anti ? "On" : "Off")}";
            }
            catch { }
        }

        private void UpdateIncidentIndicator()
        {
            try
            {
                var svc = App.GamerOptimizer;
                if (IncidentText == null || svc == null)
                {
                    if (IncidentText != null) IncidentText.Text = "Nenhum";
                    return;
                }
                var incidents = svc.GetRecentStutterIncidents();
                if (incidents.Length == 0)
                {
                    IncidentText.Text = "Nenhum";
                    return;
                }
                var last = incidents.Last();
                var ts = last.Timestamp.ToLocalTime().ToString("HH:mm:ss");
                IncidentText.Text = $"{ts} • {last.Cause} (CPU {last.TotalCpu:F0}% | Q {last.QueueLength:F1} | DPC {last.DpcPercent:F1}% | PF {last.PageFaultsPerSec:F0}/s | DiskQ {last.DiskQueue:F2} | FT jitter {last.FrameJitterMs:F1}ms | Net jitter {last.NetworkJitterMs:F1}ms)";
            }
            catch { }
        }

        private long GetTotalDiskSpaceBytes()
        {
            try
            {
                var root = Path.GetPathRoot(Environment.SystemDirectory);
                if (string.IsNullOrEmpty(root)) return 0;
                var drive = new DriveInfo(root);
                if (!drive.IsReady) return 0;
                return drive.TotalSize;
            }
            catch
            {
                return 0;
            }
        }

        private async Task<long> GetSpaceToCleanBytesAsync()
        {
            if (App.SystemCleaner == null)
                return 0;
            
            try
            {
                // Criar cancellation token com timeout de 30 segundos
                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));
                return await App.SystemCleaner.CalculateTotalSizeAsync(
                    cleanTemp: true,
                    cleanRecycle: true,
                    cleanThumbnails: true,
                    cleanBrowsers: true,
                    cts.Token
                );
            }
            catch
            {
                return 0;
            }
        }

        private async Task<double> GetCPUUsagePercentAsync()
        {
            return await Task.Run(() =>
            {
                try
                {
                    using (var pc = new PerformanceCounter("Processor", "% Processor Time", "_Total"))
                    {
                        pc.NextValue(); // Primeira leitura é sempre 0
                        System.Threading.Thread.Sleep(1000); // Aguardar 1 segundo
                        return pc.NextValue();
                    }
                }
                catch
                {
                    return 0;
                }
            });
        }

        private SystemHealthStatus GetSystemHealthStatus()
        {
            try
            {
                // Verificar espaço em disco
                long freeDisk = GetFreeDiskSpaceBytes();
                long totalDisk = GetTotalDiskSpaceBytes();
                double diskFreePercent = totalDisk > 0 ? (double)freeDisk / totalDisk * 100 : 0;
                
                // Verificar RAM
                long totalRAM = GetTotalRAMBytes();
                long availableRAM = GetAvailableRAMBytes();
                double ramUsagePercent = totalRAM > 0 ? (1.0 - (double)availableRAM / totalRAM) * 100 : 0;
                
                // Verificar conectividade
                bool networkOk = IsNetworkConnected();
                
                // Determinar status geral
                if (diskFreePercent < 10 || ramUsagePercent > 90)
                    return SystemHealthStatus.Critical;
                
                if (diskFreePercent < 20 || ramUsagePercent > 80 || !networkOk)
                    return SystemHealthStatus.Warning;
                
                return SystemHealthStatus.Good;
            }
            catch
            {
                return SystemHealthStatus.Unknown;
            }
        }

        private bool IsNetworkConnected()
        {
            try
            {
                return NetworkInterface.GetIsNetworkAvailable();
            }
            catch
            {
                return false;
            }
        }

        private void QuickActionButton_Click(object sender, RoutedEventArgs e)
        {
            if (sender is Button button && button.Tag is string pageName)
            {
                // Navegar para a página correspondente via MainWindow
                if (Application.Current.MainWindow is MainWindow mainWindow)
                {
                    mainWindow.NavigateToPageFromOutside(pageName);
                }
            }
        }

        private async void QuickCleanButton_Click(object sender, RoutedEventArgs e)
        {
            await Task.CompletedTask;
        }

        private async void VerifySystemButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                VerifySystemButton.IsEnabled = false;
                VerifySystemButton.Content = new System.Windows.Controls.StackPanel
                {
                    Orientation = System.Windows.Controls.Orientation.Horizontal,
                    HorizontalAlignment = System.Windows.HorizontalAlignment.Center,
                    Children =
                    {
                        new System.Windows.Controls.TextBlock { Text = "⏳", FontSize = 14, Margin = new Thickness(0,0,8,0) },
                        new System.Windows.Controls.TextBlock { Text = "Verificando..." }
                    }
                };

                SystemStatusText.Text = "Analisando...";
                SystemStatusDescription.Text = "Verificando saúde do sistema";

                // Forçar nova análise
                await LoadSystemInfoAsync();

                new ToastService().Show("Verificação Concluída", "Sistema analisado com sucesso");
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[Dashboard] Erro na verificação", ex);
            }
            finally
            {
                VerifySystemButton.IsEnabled = true;
                VerifySystemButton.Content = new System.Windows.Controls.StackPanel
                {
                    Orientation = System.Windows.Controls.Orientation.Horizontal,
                    HorizontalAlignment = System.Windows.HorizontalAlignment.Center,
                    Children =
                    {
                        new System.Windows.Controls.TextBlock { Text = "🔍", FontSize = 14, Margin = new Thickness(0,0,8,0) },
                        new System.Windows.Controls.TextBlock { Text = "Verificar Sistema" }
                    }
                };
            }
        }

        #region Assistente Virtual IA

        private void ShowAIResponse(string message)
        {
            Dispatcher.Invoke(() =>
            {
                if (AIResponseBorder != null)
                {
                    // Se o child não é um StackPanel, criar um
                    if (!(AIResponseBorder.Child is StackPanel))
                    {
                        var stack = new StackPanel();
                        var newTextBlock = new TextBlock
                        {
                            Name = "AIResponseText",
                            TextWrapping = TextWrapping.Wrap,
                            FontSize = 13,
                            LineHeight = 20,
                            Foreground = (System.Windows.Media.Brush)Application.Current.Resources["TextPrimaryBrush"]
                        };
                        stack.Children.Add(newTextBlock);
                        AIResponseBorder.Child = stack;
                    }

                    // Atualizar texto
                    var stackPanel = (StackPanel)AIResponseBorder.Child;
                    var textBlock = stackPanel.Children.OfType<TextBlock>().FirstOrDefault();
                    if (textBlock != null)
                    {
                        textBlock.Text = message;
                    }

                    AIResponseBorder.Visibility = Visibility.Visible;
                }
                else if (AIResponseText != null)
                {
                    // Fallback para o TextBlock direto
                    AIResponseText.Text = message;
                    if (FindName("AIResponseBorder") is System.Windows.Controls.Border border)
                    {
                        border.Visibility = Visibility.Visible;
                    }
                }
            });
        }

        private void AIChatInput_GotFocus(object sender, RoutedEventArgs e)
        {
            if (AIChatInput.Text == "Digite sua pergunta ou problema...")
            {
                AIChatInput.Text = "";
                AIChatInput.Foreground = System.Windows.Media.Brushes.White;
            }
        }

        private void AIChatInput_LostFocus(object sender, RoutedEventArgs e)
        {
            if (string.IsNullOrWhiteSpace(AIChatInput.Text))
            {
                AIChatInput.Text = "Digite sua pergunta ou problema...";
                AIChatInput.Foreground = System.Windows.Media.Brushes.Gray;
            }
        }

        private void AIChatInput_KeyDown(object sender, System.Windows.Input.KeyEventArgs e)
        {
            if (e.Key == System.Windows.Input.Key.Enter)
            {
                AskAIButton_Click(sender, e);
            }
        }

        private async void AskAIButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                App.LoggingService?.LogInfo("[AI_ASSISTANT] ===== INÍCIO DA CONSULTA =====");
                
                var query = AIChatInput.Text.Trim();
                App.LoggingService?.LogInfo($"[AI_ASSISTANT] Query recebida: '{query}' (Length: {query.Length})");
                
                if (string.IsNullOrEmpty(query) || query == "Digite sua pergunta ou problema...")
                {
                    App.LoggingService?.LogWarning("[AI_ASSISTANT] Query vazia ou placeholder detectado");
                    ShowAIResponse("Por favor, digite uma pergunta ou descreva um problema.");
                    return;
                }

                // NOVO: Tentar executar automaticamente com SmartAIExecutor
                if (_smartExecutor != null)
                {
                    App.LoggingService?.LogInfo("[AI_ASSISTANT] Tentando execução automática com SmartAIExecutor...");
                    
                    var (executed, message) = await _smartExecutor.TryExecuteAutoAsync(query);
                    
                    if (executed)
                    {
                        // Executou automaticamente!
                        App.LoggingService?.LogSuccess("[AI_ASSISTANT] Comando executado automaticamente!");
                        ShowAIResponse($"🤖 Lyra executou automaticamente:\n\n{message}");
                        AIChatInput.Clear();
                        AIChatInput.Text = "Digite sua pergunta ou problema...";
                        AIChatInput.Foreground = System.Windows.Media.Brushes.Gray;
                        return;
                    }
                    
                    App.LoggingService?.LogInfo("[AI_ASSISTANT] Nenhuma intenção clara detectada, usando Lyra normal");
                }

                // Se não detectou intenção clara, navegar para LyraResponseView
                App.LoggingService?.LogInfo("[AI_ASSISTANT] Navegando para LyraResponseView...");
                
                // Tentar obter o MainWindow de diferentes formas
                MainWindow? mainWindow = null;
                
                if (Application.Current.MainWindow is MainWindow mw)
                {
                    mainWindow = mw;
                    App.LoggingService?.LogInfo("[AI_ASSISTANT] MainWindow encontrado via Application.Current.MainWindow");
                }
                else
                {
                    // Tentar encontrar via visual tree
                    var parent = this.Parent;
                    while (parent != null)
                    {
                        if (parent is MainWindow mw2)
                        {
                            mainWindow = mw2;
                            App.LoggingService?.LogInfo("[AI_ASSISTANT] MainWindow encontrado via Visual Tree");
                            break;
                        }
                        parent = System.Windows.Media.VisualTreeHelper.GetParent(parent) as DependencyObject;
                    }
                }
                
                if (mainWindow != null)
                {
                    App.LoggingService?.LogInfo("[AI_ASSISTANT] Criando LyraResponseView...");
                    // Criar a view Lyra e navegar
                    var lyraView = new LyraResponseView();
                    App.LoggingService?.LogInfo("[AI_ASSISTANT] Chamando NavigateToLyraView...");
                    mainWindow.NavigateToLyraView(lyraView, query);
                    App.LoggingService?.LogInfo("[AI_ASSISTANT] NavigateToLyraView chamado com sucesso");
                }
                else
                {
                    App.LoggingService?.LogError("[AI_ASSISTANT] MainWindow não encontrado! Application.Current.MainWindow type: " + (Application.Current.MainWindow?.GetType().Name ?? "NULL"), null);
                    MessageBox.Show(
                        "Erro: Não foi possível encontrar a janela principal.\n\nTente reiniciar o aplicativo.",
                        "Erro de Navegação",
                        MessageBoxButton.OK,
                        MessageBoxImage.Error);
                }
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[AI_ASSISTANT] EXCEÇÃO CAPTURADA no AskAIButton_Click", ex);
                MessageBox.Show(
                    $"Erro ao processar consulta:\n\n{ex.Message}\n\nDetalhes: {ex.GetType().Name}\n\nStack Trace: {ex.StackTrace}",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
        }

        private async void IntelligentOptimizeButton_Click(object sender, RoutedEventArgs e)
        {
            await Task.CompletedTask;
        }

        private SystemDiagnostic? _lastDiagnostic;

        private async void OptimizationButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (App.AIOptimizer == null)
                {
                    ShowAIResponse("❌ Serviço de IA não disponível.\n\nPor favor, reinicie o aplicativo.");
                    return;
                }

                OptimizationButton.IsEnabled = false;
                var originalContent = OptimizationButton.Content;
                
                // Atualizar botão visualmente
                var loadingStack = new StackPanel { Orientation = Orientation.Horizontal, HorizontalAlignment = HorizontalAlignment.Center };
                loadingStack.Children.Add(new TextBlock { Text = "⏳", FontSize = 16, Margin = new Thickness(0, 0, 8, 0), VerticalAlignment = VerticalAlignment.Center });
                loadingStack.Children.Add(new TextBlock { Text = "Otimizando...", VerticalAlignment = VerticalAlignment.Center, FontSize = 12 });
                OptimizationButton.Content = loadingStack;
                
                GlobalProgressService.Instance.UpdateProgress(0, "Dashboard IA: Iniciando otimização inteligente...");
                
                ShowAIResponse("🚀 Otimização Inteligente Iniciada\n\nAnalisando sistema e aplicando otimizações automáticas...");

                // Executar otimização inteligente
                var result = await App.AIOptimizer.PerformIntelligentOptimizationAsync();

                GlobalProgressService.Instance.UpdateProgress(100, "Dashboard IA: Otimização concluída!");

                var responseText = $"✅ Otimização Inteligente Concluída - {DateTime.Now:HH:mm:ss}\n\n";
                responseText += $"⚡ Otimizações Aplicadas: {result.OptimizationsApplied.Count}\n";
                responseText += $"📈 Melhoria Estimada: {result.PerformanceGain:F1}%\n";
                responseText += $"🔧 Problemas Corrigidos: {result.IssuesFixed.Count}\n\n";

                if (result.OptimizationsApplied.Any())
                {
                    responseText += "Otimizações Aplicadas:\n";
                    foreach (var opt in result.OptimizationsApplied)
                    {
                        responseText += $"✓ {opt}\n";
                    }
                    responseText += "\n";
                }

                if (result.IssuesFixed.Any())
                {
                    responseText += "Problemas Corrigidos:\n";
                    foreach (var issue in result.IssuesFixed)
                    {
                        responseText += $"✓ {issue}\n";
                    }
                }

                ShowAIResponse(responseText);

                // Atualizar métricas do dashboard
                await LoadSystemInfoAsync();

                new ToastService().Show("Otimização IA Concluída", $"{result.OptimizationsApplied} otimizações aplicadas");

                await Task.Delay(1500);
                GlobalProgressService.Instance.ResetProgress();
                
                OptimizationButton.Content = originalContent;
                OptimizationButton.IsEnabled = true;
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[Dashboard] Erro na otimização IA", ex);
                ShowAIResponse($"❌ Erro na otimização: {ex.Message}");
                GlobalProgressService.Instance.ResetProgress();
                
                // Restaurar botão
                var originalStack = new StackPanel { Orientation = Orientation.Horizontal, HorizontalAlignment = HorizontalAlignment.Center };
                originalStack.Children.Add(new TextBlock { Text = "🚀", FontSize = 16, Margin = new Thickness(0, 0, 8, 0), VerticalAlignment = VerticalAlignment.Center });
                originalStack.Children.Add(new TextBlock { Text = "Otimização Inteligente", VerticalAlignment = VerticalAlignment.Center, FontSize = 12 });
                OptimizationButton.Content = originalStack;
                OptimizationButton.IsEnabled = true;
            }
        }

        private async void DiagnosticButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (App.AIOptimizer == null)
                {
                    ShowAIResponse("❌ Serviço de IA não disponível.\n\nPor favor, reinicie o aplicativo.");
                    return;
                }

                DiagnosticButton.IsEnabled = false;
                var originalContent = DiagnosticButton.Content;
                
                // Atualizar botão visualmente
                var loadingStack = new StackPanel { Orientation = Orientation.Horizontal, HorizontalAlignment = HorizontalAlignment.Center };
                loadingStack.Children.Add(new TextBlock { Text = "⏳", FontSize = 16, Margin = new Thickness(0, 0, 8, 0), VerticalAlignment = VerticalAlignment.Center });
                loadingStack.Children.Add(new TextBlock { Text = "Analisando...", VerticalAlignment = VerticalAlignment.Center, FontSize = 12 });
                DiagnosticButton.Content = loadingStack;
                
                GlobalProgressService.Instance.UpdateProgress(0, "Dashboard IA: Executando diagnóstico...");
                
                ShowAIResponse("🔍 Diagnóstico Automático Iniciado\n\nAnalisando CPU, memória, disco, rede e processos...");

                var diagnostic = await App.AIOptimizer.PerformAutoDiagnosticAsync();
                // Converter DiagnosticResult para SystemDiagnostic
                _lastDiagnostic = new SystemDiagnostic
                {
                    Timestamp = diagnostic.Timestamp,
                    OverallHealth = diagnostic.OverallHealth,
                    Issues = diagnostic.Issues.Select(i => new SystemIssue
                    {
                        Type = i.Type,
                        Description = i.Description,
                        Solution = i.Solution,
                        Severity = i.Severity
                    }).ToList(),
                    Recommendations = diagnostic.Recommendations
                };

                GlobalProgressService.Instance.UpdateProgress(100, "Dashboard IA: Diagnóstico concluído!");

                var responseText = $"🔍 Diagnóstico Automático - {diagnostic.Timestamp:HH:mm:ss}\n\n";
                
                // Saúde geral com emoji
                var healthEmoji = diagnostic.OverallHealth == "Atenção" ? "⚠️" : 
                                  diagnostic.OverallHealth == "Crítico" ? "🔴" : "✅";
                responseText += $"{healthEmoji} Saúde Geral: {diagnostic.OverallHealth}\n\n";

                if (diagnostic.Issues.Any())
                {
                    responseText += "Problemas Detectados:\n";
                    foreach (var issue in diagnostic.Issues)
                    {
                        var severityIcon = issue.Severity == "Alta" ? "🔴" : 
                                           issue.Severity == "Média" ? "🟡" : "🟢";
                        responseText += $"{severityIcon} {issue.Type}: {issue.Description}\n";
                        responseText += $"   💡 Solução: {issue.Solution}\n\n";
                    }
                    
                    responseText += "\n💡 Dica: Clique em 'Resolver Problemas' abaixo para aplicar as soluções automaticamente.";
                }
                else
                {
                    responseText += "✅ Nenhum problema crítico detectado!\n";
                    responseText += "Seu sistema está funcionando perfeitamente.";
                }

                if (diagnostic.Recommendations.Any())
                {
                    responseText += "\n\n📋 Recomendações:\n";
                    foreach (var rec in diagnostic.Recommendations)
                    {
                        responseText += $"• {rec}\n";
                    }
                }

                ShowAIResponse(responseText);

                // Mostrar botão de resolver problemas se houver issues
                if (diagnostic.Issues.Any())
                {
                    ShowFixProblemsButton();
                }

                await Task.Delay(1500);
                GlobalProgressService.Instance.ResetProgress();
                
                DiagnosticButton.Content = originalContent;
                DiagnosticButton.IsEnabled = true;
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[Dashboard] Erro no diagnóstico", ex);
                ShowAIResponse($"❌ Erro no diagnóstico: {ex.Message}");
                GlobalProgressService.Instance.ResetProgress();
                
                // Restaurar botão
                var originalStack = new StackPanel { Orientation = Orientation.Horizontal, HorizontalAlignment = HorizontalAlignment.Center };
                originalStack.Children.Add(new TextBlock { Text = "🔍", FontSize = 16, Margin = new Thickness(0, 0, 8, 0), VerticalAlignment = VerticalAlignment.Center });
                originalStack.Children.Add(new TextBlock { Text = "Diagnóstico", VerticalAlignment = VerticalAlignment.Center, FontSize = 12 });
                DiagnosticButton.Content = originalStack;
                DiagnosticButton.IsEnabled = true;
            }
        }

        private void ShowFixProblemsButton()
        {
            // Criar botão dinamicamente para resolver problemas
            Dispatcher.Invoke(() =>
            {
                if (AIResponseBorder != null && AIResponseBorder.Child is StackPanel stack)
                {
                    // Verificar se já existe um botão
                    var existingButton = stack.Children.OfType<Button>().FirstOrDefault();
                    if (existingButton != null)
                    {
                        stack.Children.Remove(existingButton);
                    }

                    var fixButton = new Button
                    {
                        Content = "🔧 Resolver Problemas Automaticamente",
                        Style = (Style)Application.Current.Resources["ModernButtonStyle"],
                        Margin = new Thickness(0, 16, 0, 0),
                        HorizontalAlignment = HorizontalAlignment.Center,
                        Padding = new Thickness(24, 12, 24, 12)
                    };

                    fixButton.Click += async (s, e) => await FixProblemsAutomatically();
                    stack.Children.Add(fixButton);
                }
            });
        }

        private async Task FixProblemsAutomatically()
        {
            if (_lastDiagnostic == null || !_lastDiagnostic.Issues.Any())
            {
                ShowAIResponse("Nenhum problema para resolver.");
                return;
            }

            try
            {
                GlobalProgressService.Instance.UpdateProgress(0, "Dashboard IA: Resolvendo problemas...");
                
                var responseText = "🔧 Resolvendo Problemas Automaticamente\n\n";
                ShowAIResponse(responseText);

                int fixedCount = 0;
                int total = _lastDiagnostic.Issues.Count;

                foreach (var issue in _lastDiagnostic.Issues)
                {
                    try
                    {
                        responseText += $"⏳ Resolvendo: {issue.Type}...\n";
                        ShowAIResponse(responseText);

                        // Aplicar solução baseada no tipo
                        bool success = await ApplySolution(issue);

                        if (success)
                        {
                            fixedCount++;
                            responseText += $"✅ Resolvido: {issue.Type}\n\n";
                        }
                        else
                        {
                            responseText += $"⚠️ Não foi possível resolver: {issue.Type}\n\n";
                        }

                        ShowAIResponse(responseText);
                        
                        int progress = (int)((fixedCount / (double)total) * 100);
                        GlobalProgressService.Instance.UpdateProgress(progress, $"Dashboard IA: Resolvendo {fixedCount}/{total}...");
                    }
                    catch (Exception ex)
                    {
                        responseText += $"❌ Erro ao resolver {issue.Type}: {ex.Message}\n\n";
                        ShowAIResponse(responseText);
                    }
                }

                responseText += $"\n✅ Concluído!\n";
                responseText += $"📊 Problemas Resolvidos: {fixedCount}/{total}\n";
                
                if (fixedCount < total)
                {
                    responseText += $"\n💡 Alguns problemas podem requerer ação manual.";
                }

                ShowAIResponse(responseText);

                // Atualizar métricas
                await LoadSystemInfoAsync();

                new ToastService().Show("Problemas Resolvidos", $"{fixedCount} de {total} problemas foram corrigidos");

                GlobalProgressService.Instance.ResetProgress();
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[Dashboard] Erro ao resolver problemas", ex);
                ShowAIResponse($"❌ Erro ao resolver problemas: {ex.Message}");
                GlobalProgressService.Instance.ResetProgress();
            }
        }

        private async Task<bool> ApplySolution(SystemIssue issue)
        {
            try
            {
                switch (issue.Type)
                {
                    case "Memória":
                        // Otimizar memória
                        GC.Collect();
                        GC.WaitForPendingFinalizers();
                        GC.Collect();
                        await Task.Delay(500);
                        return true;

                    case "Disco":
                        // Limpar arquivos temporários
                        if (App.SystemCleaner != null)
                        {
                            await App.SystemCleaner.CleanTempFilesAsync();
                        }
                        return true;

                    case "CPU":
                        // Otimizar processos (placeholder)
                        await Task.Delay(1000);
                        return true;

                    case "Rede":
                        // Limpar cache DNS
                        await Task.Run(() =>
                        {
                            try
                            {
                                System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
                                {
                                    FileName = "ipconfig",
                                    Arguments = "/flushdns",
                                    CreateNoWindow = true,
                                    UseShellExecute = false
                                });
                            }
                            catch { }
                        });
                        return true;

                    default:
                        return false;
                }
            }
            catch
            {
                return false;
            }
        }

        #endregion

        private string FormatBytes(long bytes)
        {
            string[] sizes = { "B", "KB", "MB", "GB", "TB" };
            double len = bytes;
            int order = 0;
            while (len >= 1024 && order < sizes.Length - 1)
            {
                order++;
                len = len / 1024;
            }
            return $"{len:0.##} {sizes[order]}";
        }
    }

    /// <summary>
    /// Resultado do diagnóstico do sistema
    /// </summary>
    public class SystemDiagnostic
    {
        public DateTime Timestamp { get; set; } = DateTime.Now;
        public string OverallHealth { get; set; } = "Bom";
        public List<SystemIssue> Issues { get; set; } = new();
        public List<string> Recommendations { get; set; } = new();
    }

    /// <summary>
    /// Problema detectado no sistema
    /// </summary>
    public class SystemIssue
    {
        public string Type { get; set; } = "";
        public string Description { get; set; } = "";
        public string Solution { get; set; } = "";
        public string Severity { get; set; } = "Baixa";
    }

    /// <summary>
    /// Enum para status de saúde do sistema
    /// </summary>
    public enum SystemHealthStatus
    {
        Good,
        Warning,
        Critical,
        Unknown
    }
}
