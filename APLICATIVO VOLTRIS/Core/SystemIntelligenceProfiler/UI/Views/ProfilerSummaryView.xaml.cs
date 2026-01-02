using System;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media.Animation;

namespace VoltrisOptimizer.Core.SystemIntelligenceProfiler.UI.Views
{
    public partial class ProfilerSummaryView : UserControl
    {
        private readonly UI.ViewModels.SummaryViewModel _vm;
        
        public ProfilerSummaryView()
        {
            InitializeComponent();
            _vm = new UI.ViewModels.SummaryViewModel();
            DataContext = _vm;
            RecommendationsList.SetBinding(ItemsControl.ItemsSourceProperty, new System.Windows.Data.Binding("RecommendationsView"));
            System.ComponentModel.PropertyChangedEventManager.AddHandler(_vm, Vm_PropertyChanged, string.Empty);
            Unloaded += (_, __) => { try { System.ComponentModel.PropertyChangedEventManager.RemoveHandler(_vm, Vm_PropertyChanged, string.Empty); } catch { } };
        }

        private void Vm_PropertyChanged(object? sender, System.ComponentModel.PropertyChangedEventArgs e)
        {
            if (e.PropertyName == "Status")
            {
                try
                {
                    // Usar Dispatcher para garantir que a atualização da UI ocorra na thread correta
                    Dispatcher.Invoke(() =>
                    {
                        var msg = _vm?.Status ?? string.Empty;
                        if (string.IsNullOrWhiteSpace(msg))
                            return;

                        // Se o status indica sucesso de Apply All, não mostrar toast (vamos mostrar celebração)
                        if (msg.Contains("ações SAFE aplicadas") || msg.Contains("Nenhuma ação SAFE"))
                            return;

                        ToastText.Text = msg;
                        ToastPanel.Visibility = Visibility.Visible;
                        ToastPanel.Opacity = 1.0;

                        var sb = new Storyboard();
                        var fade = new DoubleAnimation
                        {
                            From = 1.0,
                            To = 0.0,
                            BeginTime = TimeSpan.FromSeconds(2),
                            Duration = new Duration(TimeSpan.FromMilliseconds(450))
                        };
                        Storyboard.SetTarget(fade, ToastPanel);
                        Storyboard.SetTargetProperty(fade, new PropertyPath("Opacity"));
                        sb.Children.Add(fade);
                        sb.Completed += (s2, e2) => { ToastPanel.Visibility = Visibility.Collapsed; };
                        sb.Begin();
                    });
                }
                catch (Exception ex)
                {
                    try { App.LoggingService?.LogError($"[RESUMO] Erro ao mostrar toast: {ex.Message}", ex); } catch { }
                }
            }
        }

        private async void ApplyAllButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                App.LoggingService?.LogInfo("[RESUMO] ApplyAllButton_Click iniciado");
                
                // Desabilitar botão para evitar cliques duplos
                Dispatcher.Invoke(() =>
                {
                    ApplyAllButton.IsEnabled = false;
                    ApplyAllButton.Content = "Aplicando...";
                });
                
                // Executar o comando e aguardar até o Status mudar
                if (_vm.ApplyAllSafeCommand.CanExecute(null))
                {
                    _vm.ApplyAllSafeCommand.Execute(null);
                }
                
                // Aguardar o comando terminar (máximo 15 segundos)
                int attempts = 0;
                while (_vm.IsBusy && attempts < 150)
                {
                    await Task.Delay(100);
                    attempts++;
                }
                
                // Aguardar um pouco mais para o Status atualizar
                await Task.Delay(300);
                
                App.LoggingService?.LogInfo($"[RESUMO] Status após comando: {_vm.Status}");
                
                // Verificar se foi sucesso
                if (_vm.Status?.Contains("ações SAFE aplicadas") == true || _vm.Status?.Contains("Nenhuma ação SAFE") == true)
                {
                    // Extrair quantidade de otimizações
                    var match = System.Text.RegularExpressions.Regex.Match(_vm.Status ?? "", @"(\d+) ações");
                    var count = match.Success ? match.Groups[1].Value : "0";
                    
                    // Usar Dispatcher para atualizar a UI
                    Dispatcher.Invoke(() =>
                    {
                        if (count == "0" || _vm.Status?.Contains("Nenhuma ação SAFE") == true)
                        {
                            OptimizationCountText.Text = "Sistema já otimizado!";
                        }
                        else
                        {
                            OptimizationCountText.Text = $"{count} otimizações aplicadas";
                        }
                        
                        // Mostrar celebração
                        _ = ShowCelebrationAsync();
                    });
                }
                else if (_vm.Status?.Contains("Erros ao aplicar") == true)
                {
                    // Tratar erro
                    ShowToast("Erro ao aplicar otimizações. Verifique o log.");
                    
                    // Usar Dispatcher para atualizar a UI
                    Dispatcher.Invoke(() =>
                    {
                        ApplyAllButton.IsEnabled = true;
                        ApplyAllButton.Content = "Aplicar Todas (SAFE)";
                    });
                }
                else
                {
                    // Timeout ou outro problema
                    ShowToast("Operação demorou muito. Verifique o status.");
                    
                    // Usar Dispatcher para atualizar a UI
                    Dispatcher.Invoke(() =>
                    {
                        ApplyAllButton.IsEnabled = true;
                        ApplyAllButton.Content = "Aplicar Todas (SAFE)";
                    });
                }
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[RESUMO] Erro ao mostrar celebração", ex);
                ShowToast("Erro inesperado. Verifique o log.");
                
                // Usar Dispatcher para atualizar a UI
                Dispatcher.Invoke(() =>
                {
                    ApplyAllButton.IsEnabled = true;
                    ApplyAllButton.Content = "Aplicar Todas (SAFE)";
                });
            }
        }
        
        private void ShowToast(string message)
        {
            try
            {
                // Usar Dispatcher para garantir que a atualização da UI ocorra na thread correta
                Dispatcher.Invoke(() =>
                {
                    ToastText.Text = message;
                    ToastPanel.Visibility = Visibility.Visible;
                    ToastPanel.Opacity = 1.0;

                    var sb = new Storyboard();
                    var fade = new DoubleAnimation
                    {
                        From = 1.0,
                        To = 0.0,
                        BeginTime = TimeSpan.FromSeconds(3),
                        Duration = new Duration(TimeSpan.FromMilliseconds(450))
                    };
                    Storyboard.SetTarget(fade, ToastPanel);
                    Storyboard.SetTargetProperty(fade, new PropertyPath("Opacity"));
                    sb.Children.Add(fade);
                    sb.Completed += (s2, e2) => { ToastPanel.Visibility = Visibility.Collapsed; };
                    sb.Begin();
                });
            }
            catch (Exception ex)
            {
                try { App.LoggingService?.LogError($"[RESUMO] Erro ao mostrar toast: {ex.Message}", ex); } catch { }
            }
        }

        private async Task ShowCelebrationAsync()
        {
            try
            {
                App.LoggingService?.LogInfo("[RESUMO] Mostrando celebração...");
                
                // Usar Dispatcher para atualizar a UI
                await Dispatcher.InvokeAsync(() =>
                {
                    // Mostrar overlay
                    CelebrationOverlay.Visibility = Visibility.Visible;
                    
                    // Animar entrada
                    var fadeIn = new DoubleAnimation(0, 1, TimeSpan.FromMilliseconds(400));
                    fadeIn.EasingFunction = new CubicEase { EasingMode = EasingMode.EaseOut };
                    CelebrationOverlay.BeginAnimation(OpacityProperty, fadeIn);
                    
                    // Animar ícone de sucesso (scale bounce)
                    var scaleX = new DoubleAnimation(0.5, 1, TimeSpan.FromMilliseconds(500));
                    scaleX.EasingFunction = new ElasticEase { EasingMode = EasingMode.EaseOut, Oscillations = 1 };
                    var scaleY = new DoubleAnimation(0.5, 1, TimeSpan.FromMilliseconds(500));
                    scaleY.EasingFunction = new ElasticEase { EasingMode = EasingMode.EaseOut, Oscillations = 1 };
                    
                    if (SuccessIcon.RenderTransform is System.Windows.Media.ScaleTransform scale)
                    {
                        scale.BeginAnimation(System.Windows.Media.ScaleTransform.ScaleXProperty, scaleX);
                        scale.BeginAnimation(System.Windows.Media.ScaleTransform.ScaleYProperty, scaleY);
                    }
                });
                
                // Countdown e barra de progresso
                for (int i = 3; i >= 1; i--)
                {
                    // Usar Dispatcher para atualizar a UI
                    await Dispatcher.InvokeAsync(() =>
                    {
                        RedirectText.Text = $"Próximo passo em {i}...";
                        
                        // Animar barra de progresso
                        var progressWidth = 200.0 * (4 - i) / 3.0;
                        var progressAnim = new DoubleAnimation(RedirectProgress.Width, progressWidth, TimeSpan.FromMilliseconds(900));
                        progressAnim.EasingFunction = new QuadraticEase { EasingMode = EasingMode.EaseOut };
                        RedirectProgress.BeginAnimation(WidthProperty, progressAnim);
                    });
                    
                    await Task.Delay(1000);
                }
                
                // Completar barra
                await Dispatcher.InvokeAsync(() =>
                {
                    RedirectText.Text = "Preparando...";
                    var finalAnim = new DoubleAnimation(200, TimeSpan.FromMilliseconds(200));
                    RedirectProgress.BeginAnimation(WidthProperty, finalAnim);
                });
                
                await Task.Delay(300);
                
                // Marcar onboarding como completo
                MarkOnboardingComplete();
                
                // NOVO: Iniciar fluxo do Prepare PC ao invés de ir direto para Dashboard
                ShowPreparePcFlow();
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[RESUMO] Erro na celebração", ex);
                try 
                { 
                    MessageBox.Show("Erro na animação de conclusão. Continuando...", "Erro", MessageBoxButton.OK, MessageBoxImage.Warning); 
                } 
                catch { }
                // Em caso de erro, ainda tenta redirecionar
                MarkOnboardingComplete();
                NavigateToDashboard();
            }
        }
        
        /// <summary>
        /// Inicia o fluxo do Prepare PC após as otimizações do Profiler
        /// </summary>
        private void ShowPreparePcFlow()
        {
            try
            {
                App.LoggingService?.LogInfo("[RESUMO] Iniciando fluxo do Prepare PC...");
                
                Dispatcher.Invoke(() =>
                {
                    if (Application.Current.MainWindow is VoltrisOptimizer.UI.MainWindow mainWindow)
                    {
                        // Obter o ContentFrame
                        var contentFrame = mainWindow.FindName("ContentFrame") as ContentControl;
                        if (contentFrame == null)
                        {
                            App.LoggingService?.LogWarning("[RESUMO] ContentFrame não encontrado, indo para Dashboard");
                            NavigateToDashboard();
                            return;
                        }
                        
                        // Obter lista de otimizações aplicadas
                        var appliedOptimizations = GetAppliedOptimizations();
                        
                        // Criar controlador de fluxo
                        var flowController = new VoltrisOptimizer.Core.PreparePc.PreparePcFlowController(
                            contentFrame,
                            App.LoggingService,
                            onComplete: () =>
                            {
                                // Quando o fluxo terminar, ir para o Dashboard
                                Dispatcher.Invoke(() =>
                                {
                                    mainWindow.UnlockGate();
                                    mainWindow.EnableSidebar();
                                    mainWindow.NavigateToPageFromOutside("Dashboard");
                                    App.LoggingService?.LogSuccess("[RESUMO] Fluxo Prepare PC concluído, navegando para Dashboard");
                                });
                            });
                        
                        // Iniciar fluxo
                        flowController.StartAfterProfilerOptimizations(appliedOptimizations);
                    }
                    else
                    {
                        App.LoggingService?.LogWarning("[RESUMO] MainWindow não encontrada, indo para Dashboard");
                        NavigateToDashboard();
                    }
                });
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[RESUMO] Erro ao iniciar fluxo Prepare PC", ex);
                try 
                { 
                    MessageBox.Show("Erro ao iniciar o fluxo de preparação. Continuando para o Dashboard.", "Erro", MessageBoxButton.OK, MessageBoxImage.Warning); 
                } 
                catch { }
                NavigateToDashboard();
            }
        }
        
        /// <summary>
        /// Obtém lista de otimizações que foram aplicadas
        /// </summary>
        private string[] GetAppliedOptimizations()
        {
            var optimizations = new System.Collections.Generic.List<string>();
            
            try
            {
                foreach (var rec in _vm.Recommendations)
                {
                    if (rec.Category == RecommendationCategory.Safe && rec.Supported)
                    {
                        optimizations.Add(rec.Name);
                    }
                }
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[RESUMO] Erro ao obter otimizações aplicadas: {ex.Message}", ex);
                // Fallback para lista genérica
                optimizations.AddRange(new[]
                {
                    "Configurações de desempenho aplicadas",
                    "Otimizações de rede configuradas",
                    "Perfil de energia ajustado"
                });
            }
            
            return optimizations.ToArray();
        }

        private void MarkOnboardingComplete()
        {
            try
            {
                // Salvar nas configurações que o onboarding foi completado
                var settings = VoltrisOptimizer.Services.SettingsService.Instance.Settings;
                settings.IsFirstRun = false;
                settings.OnboardingCompleted = true;
                VoltrisOptimizer.Services.SettingsService.Instance.SaveSettings();
                
                // Também marcar no OnboardingService (arquivo onboarding.json)
                var onboardingService = new VoltrisOptimizer.Services.OnboardingService();
                onboardingService.MarkOnboardingComplete();
                
                // Marcar gate como completo no SystemProfiler
                App.SystemProfiler?.MarkGateCompleted();
                
                App.LoggingService?.LogSuccess("[RESUMO] Onboarding marcado como completo (Settings + OnboardingService + SystemProfiler)");
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[RESUMO] Erro ao marcar onboarding completo", ex);
                try 
                { 
                    // Tentar fallback - mostrar mensagem para o usuário
                    MessageBox.Show("Erro ao concluir o processo de onboarding. Por favor, reinicie o aplicativo.", "Erro", MessageBoxButton.OK, MessageBoxImage.Warning); 
                } 
                catch { }
            }
        }

        private void NavigateToDashboard()
        {
            try
            {
                App.LoggingService?.LogInfo("[RESUMO] Navegando para Dashboard e desbloqueando sidebar...");
                
                Dispatcher.Invoke(() =>
                {
                    if (Application.Current.MainWindow is VoltrisOptimizer.UI.MainWindow mainWindow)
                    {
                        // IMPORTANTE: Desbloquear o gate/sidebar ANTES de navegar
                        mainWindow.UnlockGate();
                        mainWindow.EnableSidebar();
                        
                        // Navegar para o Dashboard
                        mainWindow.NavigateToPageFromOutside("Dashboard");
                        
                        App.LoggingService?.LogSuccess("[RESUMO] Sidebar desbloqueado e navegação para Dashboard concluída");
                    }
                    else
                    {
                        // Fallback caso não consiga acessar a MainWindow
                        App.LoggingService?.LogWarning("[RESUMO] MainWindow não encontrada, tentando fallback");
                        try 
                        { 
                            MessageBox.Show("Erro na navegação automática. Por favor, selecione 'Dashboard' no menu.", "Navegação", MessageBoxButton.OK, MessageBoxImage.Information); 
                        } 
                        catch { }
                    }
                });
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[RESUMO] Erro ao navegar para Dashboard", ex);
                try 
                { 
                    MessageBox.Show("Erro ao navegar para o Dashboard. Por favor, selecione 'Dashboard' no menu.", "Erro", MessageBoxButton.OK, MessageBoxImage.Error); 
                } 
                catch { }
            }
        }
    }
}
