using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Threading;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.UI.Views
{
    /// <summary>
    /// Interaction logic for LyraResponseView.xaml
    /// </summary>
    public partial class LyraResponseView : UserControl
    {
        private readonly DispatcherTimer _statusTimer;
        private int _statusIndex = 0;
        private readonly string[] _statusMessages = new[]
        {
            "Preparando Lyra...",
            "Analisando sua mensagem...",
            "Coletando contexto...",
            "Processando intenção...",
            "Gerando resposta...",
            "Finalizando..."
        };

        public string UserQuery { get; set; } = "";

        public LyraResponseView()
        {
            InitializeComponent();
            
            // Inicializar timer para status dinâmico
            _statusTimer = new DispatcherTimer
            {
                Interval = TimeSpan.FromSeconds(1.8)
            };
            _statusTimer.Tick += StatusTimer_Tick;
        }

        public async Task ProcessQueryAsync(string query)
        {
            try
            {
                // Configurar estado inicial
                UserQuery = query;
                UserQuestionText.Text = query;
                UserQuestionTextResponse.Text = query;
                
                // Mostrar estado de carregamento
                LoadingState.Visibility = Visibility.Visible;
                ResponseState.Visibility = Visibility.Collapsed;
                
                // Iniciar animação de status
                _statusIndex = 0;
                StatusText.Text = _statusMessages[0];
                _statusTimer.Start();
                
                App.LoggingService?.LogInfo("[LYRA] ===== INÍCIO DA CONSULTA =====");
                App.LoggingService?.LogInfo($"[LYRA] Query recebida: '{query}' (Length: {query.Length})");
                
                var response = await App.AIOptimizer!.ProcessLyraQueryAsync(query);
                
                App.LoggingService?.LogInfo($"[LYRA] Resposta recebida. Response Length: {response?.Response?.Length ?? 0}");
                App.LoggingService?.LogInfo($"[LYRA] Actions Count: {response?.Actions?.Count ?? 0}");
                App.LoggingService?.LogInfo($"[LYRA] Confidence: {response?.Confidence ?? 0}");
                
                // Parar timer de status
                _statusTimer.Stop();
                
                // Verificar resposta
                if (response == null)
                {
                    App.LoggingService?.LogError("[LYRA] Response é NULL!", null);
                    ShowError("Erro: Resposta nula do serviço de IA.", new List<string>());
                    return;
                }
                
                if (string.IsNullOrWhiteSpace(response.Response))
                {
                    App.LoggingService?.LogWarning("[LYRA] Response.Response está vazio ou em branco");
                    ShowError(
                        "Desculpe, não consegui processar sua consulta.\n\nPor favor, tente novamente ou use uma pergunta mais específica.",
                        new List<string> { "Tentar Novamente" });
                    return;
                }
                
                // Mostrar resposta formatada
                ShowResponse(response.Response, response.Actions ?? new List<string>(), response.Confidence);
                
                App.LoggingService?.LogSuccess($"[LYRA] Resposta exibida com sucesso");
                App.LoggingService?.LogInfo("[LYRA] ===== FIM DA CONSULTA =====");
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[LYRA] EXCEÇÃO CAPTURADA no ProcessQueryAsync", ex);
                _statusTimer.Stop();
                ShowError(
                    $"Erro ao processar consulta: {ex.Message}\n\nDetalhes: {ex.GetType().Name}",
                    new List<string> { "Verificar Configurações", "Tentar Novamente" });
            }
        }

        private void StatusTimer_Tick(object? sender, EventArgs e)
        {
            if (StatusText != null)
            {
                _statusIndex = (_statusIndex + 1) % _statusMessages.Length;
                StatusText.Text = _statusMessages[_statusIndex];
            }
        }

        private void ShowResponse(string responseText, List<string> actions, double confidence)
        {
            // Atualizar UI no dispatcher
            Dispatcher.Invoke(() =>
            {
                try
                {
                    ResponseText.Text = responseText;
                    
                    // Configurar ações sugeridas
                    if (actions != null && actions.Any())
                    {
                        ActionsContainer.ItemsSource = actions;
                        ActionsContainer.Visibility = Visibility.Visible;
                    }
                    else
                    {
                        ActionsContainer.Visibility = Visibility.Collapsed;
                    }
                    
                    // Trocar estados
                    LoadingState.Visibility = Visibility.Collapsed;
                    ResponseState.Visibility = Visibility.Visible;
                }
                catch (Exception ex)
                {
                    App.LoggingService?.LogError($"[LYRA] Erro ao atualizar UI: {ex.Message}", ex);
                }
            });
        }

        private void ShowError(string errorMessage, List<string> suggestedActions)
        {
            // Atualizar UI no dispatcher
            Dispatcher.Invoke(() =>
            {
                try
                {
                    ResponseText.Text = errorMessage;
                    
                    // Configurar ações sugeridas
                    if (suggestedActions != null && suggestedActions.Any())
                    {
                        ActionsContainer.ItemsSource = suggestedActions;
                        ActionsContainer.Visibility = Visibility.Visible;
                    }
                    else
                    {
                        ActionsContainer.Visibility = Visibility.Collapsed;
                    }
                    
                    // Trocar estados
                    LoadingState.Visibility = Visibility.Collapsed;
                    ResponseState.Visibility = Visibility.Visible;
                }
                catch (Exception ex)
                {
                    App.LoggingService?.LogError($"[LYRA] Erro ao mostrar erro: {ex.Message}", ex);
                }
            });
        }

        private void BackButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                // Navegar de volta para o Dashboard
                if (Application.Current.MainWindow is MainWindow mainWindow)
                {
                    mainWindow.NavigateToPageFromOutside("Dashboard");
                }
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[LYRA] Erro ao voltar ao Dashboard: {ex.Message}", ex);
            }
        }

        private async void ActionButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (sender is Button button && button.Content is Border border)
                {
                    // Encontrar o TextBlock com o texto da ação
                    var textBlock = FindVisualChild<TextBlock>(border);
                    if (textBlock != null)
                    {
                        var actionText = textBlock.Text;
                        App.LoggingService?.LogInfo($"[LYRA] Ação clicada: {actionText}");

                        // Processar ações específicas
                        await App.AIOptimizer!.ExecuteLyraActionAsync(actionText);
                    }
                }
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[LYRA] Erro ao processar ação: {ex.Message}", ex);
            }
        }

        private static T? FindVisualChild<T>(DependencyObject parent) where T : DependencyObject
        {
            for (int i = 0; i < System.Windows.Media.VisualTreeHelper.GetChildrenCount(parent); i++)
            {
                var child = System.Windows.Media.VisualTreeHelper.GetChild(parent, i);
                if (child is T t)
                {
                    return t;
                }
                var childOfChild = FindVisualChild<T>(child);
                if (childOfChild != null)
                {
                    return childOfChild;
                }
            }
            return null;
        }
    }
}
