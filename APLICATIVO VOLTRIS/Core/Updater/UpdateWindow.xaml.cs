using System;
using System.Runtime.InteropServices;
using System.Windows;
using System.Windows.Input;
using System.Windows.Interop;
using System.Windows.Media.Animation;

namespace VoltrisOptimizer.Core.Updater
{
    /// <summary>
    /// Janela de atualização moderna
    /// </summary>
    public partial class UpdateWindow : Window
    {
        private readonly UpdateInfo _updateInfo;
        private bool _isDownloading = false;
        private string? _downloadedFilePath;
        
        public UpdateWindow(UpdateInfo updateInfo)
        {
            InitializeComponent();
            _updateInfo = updateInfo;
            
            // Configurar informações na UI
            VersionText.Text = $"v{UpdateService.GetCurrentVersion()} → v{updateInfo.LatestVersion}";
            
            // Formatar changelog
            if (!string.IsNullOrEmpty(updateInfo.Changelog))
            {
                ChangelogText.Text = "• " + updateInfo.Changelog.Replace("\n", "\n• ");
            }
            
            // Se for obrigatório, esconder botão "Depois"
            if (updateInfo.Mandatory)
            {
                LaterButton.Visibility = Visibility.Collapsed;
            }
            
            // Permitir arrastar a janela
            MouseLeftButtonDown += (s, e) =>
            {
                if (e.ChangedButton == MouseButton.Left)
                    DragMove();
            };
            
            // Aplicar cantos arredondados perfeitos (Windows 10/11)
            WindowRoundedCornersHelper.ApplyRoundedCorners(this, cornerRadius: 12);
            
            // Animação de entrada
            Opacity = 0;
            Loaded += (s, e) =>
            {
                var fadeIn = new DoubleAnimation(0, 1, TimeSpan.FromMilliseconds(300));
                BeginAnimation(OpacityProperty, fadeIn);
            };
        }
        
        private async void UpdateButton_Click(object sender, RoutedEventArgs e)
        {
            if (_isDownloading)
            {
                // Se já terminou o download, aplicar atualização
                if (!string.IsNullOrEmpty(_downloadedFilePath))
                {
                    ApplyUpdate();
                }
                return;
            }
            
            _isDownloading = true;
            
            // Mostrar barra de progresso
            ProgressPanel.Visibility = Visibility.Visible;
            UpdateButton.IsEnabled = false;
            UpdateButton.Content = "Preparando atualização...";
            LaterButton.IsEnabled = false;
            ProgressStatusText.Text = "Iniciando atualização automática...";
            
            try
            {
                // Usar o novo sistema de atualização automática
                var success = await UpdateService.StartAutoUpdateAsync(_updateInfo);
                
                if (success)
                {
                    // Atualização iniciada com sucesso - o programa será fechado automaticamente
                    ProgressStatusText.Text = "Atualização iniciada! O programa será fechado...";
                    UpdateButton.Content = "Aplicando...";
                    // O programa será fechado pelo StartAutoUpdateAsync
                }
                else
                {
                    // Fallback: tentar método antigo se o novo falhar
                    ProgressStatusText.Text = "Baixando atualização...";
                    UpdateButton.Content = "Baixando...";
                    
                    var progress = new Progress<double>(percentage =>
                    {
                        UpdateProgress(percentage);
                    });
                    
                    _downloadedFilePath = await UpdateService.DownloadUpdateAsync(_updateInfo, progress);
                    
                    if (!string.IsNullOrEmpty(_downloadedFilePath))
                    {
                        ProgressStatusText.Text = "Download concluído!";
                        UpdateButton.Content = "✨ Instalar e Reiniciar";
                        UpdateButton.IsEnabled = true;
                    }
                    else
                    {
                        ProgressStatusText.Text = "Erro no download. Tente novamente.";
                        UpdateButton.Content = "🔄 Tentar Novamente";
                        UpdateButton.IsEnabled = true;
                        LaterButton.IsEnabled = true;
                        _isDownloading = false;
                    }
                }
            }
            catch (Exception ex)
            {
                ProgressStatusText.Text = $"Erro: {ex.Message}";
                UpdateButton.Content = "🔄 Tentar Novamente";
                UpdateButton.IsEnabled = true;
                LaterButton.IsEnabled = true;
                _isDownloading = false;
            }
        }
        
        private async void ApplyUpdate()
        {
            try
            {
                UpdateButton.IsEnabled = false;
                UpdateButton.Content = "Iniciando atualização...";
                ProgressStatusText.Text = "Preparando atualização automática...";
                
                // Usar o novo sistema de atualização automática
                var success = await UpdateService.StartAutoUpdateAsync(_updateInfo);
                
                if (!success)
                {
                    // Fallback para método antigo se o novo falhar
                    if (!string.IsNullOrEmpty(_downloadedFilePath))
                    {
                        UpdateService.ApplyUpdateAndRestart(_downloadedFilePath);
                    }
                    else
                    {
                        throw new Exception("Não foi possível iniciar a atualização automática");
                    }
                }
            }
            catch (Exception ex)
            {
                MessageBox.Show($"Erro ao aplicar atualização: {ex.Message}", "Erro", 
                    MessageBoxButton.OK, MessageBoxImage.Error);
                UpdateButton.IsEnabled = true;
                UpdateButton.Content = "🔄 Tentar Novamente";
            }
        }
        
        private void UpdateProgress(double percentage)
        {
            ProgressPercentText.Text = $"{percentage:F0}%";
            
            // Calcular largura da barra (container tem ~440px de largura utilizável)
            var maxWidth = 440.0 - 60; // Descontar padding
            ProgressBar.Width = (percentage / 100.0) * maxWidth;
        }
        
        private void LaterButton_Click(object sender, RoutedEventArgs e)
        {
            if (_updateInfo.Mandatory)
            {
                // Se for obrigatório, não pode fechar
                MessageBox.Show("Esta atualização é obrigatória.", "Aviso", 
                    MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }
            
            // Animar saída
            var fadeOut = new DoubleAnimation(1, 0, TimeSpan.FromMilliseconds(200));
            fadeOut.Completed += (s, args) => Close();
            BeginAnimation(OpacityProperty, fadeOut);
        }
        
        protected override void OnKeyDown(KeyEventArgs e)
        {
            base.OnKeyDown(e);
            
            if (e.Key == Key.Escape && !_updateInfo.Mandatory && !_isDownloading)
            {
                LaterButton_Click(this, new RoutedEventArgs());
            }
        }
    }
    
    // Helper para cantos arredondados - Compatível Windows 10 e 11
    public static class WindowRoundedCornersHelper
    {
        private const int DWMWA_WINDOW_CORNER_PREFERENCE = 33;
        private const int DWMWCP_ROUND = 2;

        [DllImport("dwmapi.dll", CharSet = CharSet.Unicode, PreserveSig = false)]
        private static extern void DwmSetWindowAttribute(IntPtr hwnd, int attr, ref int attrValue, int attrSize);

        [DllImport("user32.dll")]
        private static extern int SetWindowRgn(IntPtr hWnd, IntPtr hRgn, bool bRedraw);

        [DllImport("gdi32.dll")]
        private static extern IntPtr CreateRoundRectRgn(int x1, int y1, int x2, int y2, int cx, int cy);

        [DllImport("gdi32.dll")]
        private static extern bool DeleteObject(IntPtr hObject);

        public static void ApplyRoundedCorners(Window window, int cornerRadius = 12)
        {
            if (window == null) return;

            // Aguardar a janela estar totalmente carregada
            window.Loaded += (s, e) =>
            {
                try
                {
                    var handle = new WindowInteropHelper(window).Handle;
                    if (handle == IntPtr.Zero) return;

                    // Tentar Windows 11+ primeiro (DWM nativo)
                    if (IsWindows11OrGreater())
                    {
                        ApplyWindows11RoundedCorners(handle);
                    }
                    else
                    {
                        // Fallback para Windows 10 (SetWindowRgn)
                        ApplyWindows10RoundedCorners(window, handle, cornerRadius);
                    }
                }
                catch
                {
                    // Silenciosamente falhar se não for possível aplicar
                }
            };
        }

        private static bool IsWindows11OrGreater()
        {
            try
            {
                var version = Environment.OSVersion.Version;
                // Windows 11 é versão 10.0.22000 ou superior
                return version.Major >= 10 && version.Build >= 22000;
            }
            catch
            {
                return false;
            }
        }

        private static void ApplyWindows11RoundedCorners(IntPtr handle)
        {
            try
            {
                // Usar DWMWCP_ROUND para cantos arredondados perfeitos sem transparência
                int cornerPreference = DWMWCP_ROUND;
                DwmSetWindowAttribute(handle, DWMWA_WINDOW_CORNER_PREFERENCE, ref cornerPreference, sizeof(int));
            }
            catch
            {
                // Falhar silenciosamente se DWM não estiver disponível
            }
        }

        private static void ApplyWindows10RoundedCorners(Window window, IntPtr handle, int cornerRadius)
        {
            try
            {
                // Obter dimensões da janela
                window.SizeChanged += (s, e) =>
                {
                    UpdateWindowRegion(window, handle, cornerRadius);
                };

                // Aplicar inicialmente
                UpdateWindowRegion(window, handle, cornerRadius);
            }
            catch
            {
                // Falhar silenciosamente
            }
        }

        private static void UpdateWindowRegion(Window window, IntPtr handle, int cornerRadius)
        {
            try
            {
                var width = (int)window.ActualWidth;
                var height = (int)window.ActualHeight;

                if (width <= 0 || height <= 0) return;

                // Criar região arredondada - usar cornerRadius * 2 para raio adequado
                var hRgn = CreateRoundRectRgn(0, 0, width, height, cornerRadius * 2, cornerRadius * 2);

                if (hRgn != IntPtr.Zero)
                {
                    // Aplicar região à janela - isso recorta os cantos perfeitamente
                    SetWindowRgn(handle, hRgn, true);
                    // A região será liberada automaticamente pelo Windows quando a janela for destruída
                }
            }
            catch
            {
                // Falhar silenciosamente
            }
        }
    }
}
