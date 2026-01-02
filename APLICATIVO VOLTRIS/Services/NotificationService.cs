using System;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Windows.Media.Animation;

namespace VoltrisOptimizer.Services
{
    // NotificationType já existe em NotificationManager.cs
    
    /// <summary>
    /// Serviço centralizado de notificações
    /// </summary>
    public class NotificationService
    {
        private static NotificationService? _instance;
        private static readonly object _lock = new();
        
        private readonly ILoggingService? _logger;
        private Border? _toastContainer;
        private TextBlock? _toastText;
        
        public static NotificationService Instance
        {
            get
            {
                if (_instance == null)
                {
                    lock (_lock)
                    {
                        _instance ??= new NotificationService(App.LoggingService);
                    }
                }
                return _instance;
            }
        }
        
        private NotificationService(ILoggingService? logger)
        {
            _logger = logger;
        }
        
        /// <summary>
        /// Inicializa o serviço com o container de toast
        /// </summary>
        public void Initialize(Border? toastContainer, TextBlock? toastText)
        {
            _toastContainer = toastContainer;
            _toastText = toastText;
        }
        
        /// <summary>
        /// Mostra uma notificação toast
        /// </summary>
        public async Task ShowToastAsync(string message, NotificationType type = NotificationType.Info, int durationMs = 3000)
        {
            if (_toastContainer == null || _toastText == null)
            {
                // Fallback para log
                LogMessage(message, type);
                return;
            }
            
            await Application.Current.Dispatcher.InvokeAsync(async () =>
            {
                try
                {
                    // Configurar cor baseada no tipo
                    _toastContainer.Background = type switch
                    {
                        NotificationType.Success => new SolidColorBrush(Color.FromRgb(39, 174, 96)),
                        NotificationType.Warning => new SolidColorBrush(Color.FromRgb(243, 156, 18)),
                        NotificationType.Error => new SolidColorBrush(Color.FromRgb(231, 76, 60)),
                        _ => new SolidColorBrush(Color.FromRgb(52, 152, 219))
                    };
                    
                    // Adicionar ícone
                    var icon = type switch
                    {
                        NotificationType.Success => "✓",
                        NotificationType.Warning => "⚠",
                        NotificationType.Error => "✕",
                        _ => "ℹ"
                    };
                    
                    _toastText.Text = $"{icon} {message}";
                    
                    // Mostrar com animação
                    _toastContainer.Visibility = Visibility.Visible;
                    
                    var fadeIn = new DoubleAnimation(0, 1, TimeSpan.FromMilliseconds(200));
                    _toastContainer.BeginAnimation(UIElement.OpacityProperty, fadeIn);
                    
                    // Aguardar duração
                    await Task.Delay(durationMs);
                    
                    // Esconder com animação
                    var fadeOut = new DoubleAnimation(1, 0, TimeSpan.FromMilliseconds(200));
                    fadeOut.Completed += (s, e) => _toastContainer.Visibility = Visibility.Collapsed;
                    _toastContainer.BeginAnimation(UIElement.OpacityProperty, fadeOut);
                }
                catch (Exception ex)
                {
                    _logger?.LogWarning($"[Notification] Erro ao mostrar toast: {ex.Message}");
                }
            });
            
            LogMessage(message, type);
        }
        
        /// <summary>
        /// Mostra um toast de sucesso
        /// </summary>
        public Task ShowSuccessAsync(string message, int durationMs = 3000)
            => ShowToastAsync(message, NotificationType.Success, durationMs);
        
        /// <summary>
        /// Mostra um toast de erro
        /// </summary>
        public Task ShowErrorAsync(string message, int durationMs = 4000)
            => ShowToastAsync(message, NotificationType.Error, durationMs);
        
        /// <summary>
        /// Mostra um toast de aviso
        /// </summary>
        public Task ShowWarningAsync(string message, int durationMs = 3500)
            => ShowToastAsync(message, NotificationType.Warning, durationMs);
        
        /// <summary>
        /// Mostra um toast de informação
        /// </summary>
        public Task ShowInfoAsync(string message, int durationMs = 3000)
            => ShowToastAsync(message, NotificationType.Info, durationMs);
        
        /// <summary>
        /// Mostra um diálogo de confirmação
        /// </summary>
        public async Task<bool> ShowConfirmationAsync(string message, string title = "Confirmação")
        {
            var result = await Application.Current.Dispatcher.InvokeAsync(() =>
            {
                return MessageBox.Show(
                    Application.Current.MainWindow,
                    message,
                    title,
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Question
                ) == MessageBoxResult.Yes;
            });
            
            return result;
        }
        
        /// <summary>
        /// Mostra um diálogo de confirmação com opções personalizadas
        /// </summary>
        public async Task<bool> ShowConfirmationWithWarningAsync(string message, string title, string[] warnings)
        {
            var warningText = string.Join("\n• ", warnings);
            var fullMessage = $"{message}\n\n⚠️ Avisos:\n• {warningText}";
            
            return await ShowConfirmationAsync(fullMessage, title);
        }
        
        /// <summary>
        /// Mostra diálogo que requer reinício
        /// </summary>
        public async Task<bool> ShowRestartRequiredAsync(string message)
        {
            var result = await Application.Current.Dispatcher.InvokeAsync(() =>
            {
                return MessageBox.Show(
                    Application.Current.MainWindow,
                    $"{message}\n\nDeseja reiniciar o computador agora?",
                    "Reinicialização Necessária",
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Warning
                ) == MessageBoxResult.Yes;
            });
            
            return result;
        }
        
        private void LogMessage(string message, NotificationType type)
        {
            switch (type)
            {
                case NotificationType.Success:
                    _logger?.LogSuccess(message);
                    break;
                case NotificationType.Warning:
                    _logger?.LogWarning(message);
                    break;
                case NotificationType.Error:
                    _logger?.LogError(message);
                    break;
                default:
                    _logger?.LogInfo(message);
                    break;
            }
        }
    }
}

