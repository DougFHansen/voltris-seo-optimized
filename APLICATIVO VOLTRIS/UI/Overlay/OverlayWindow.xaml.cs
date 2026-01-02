using System;
using System.Collections.Generic;
using System.Globalization;
using System.Runtime.InteropServices;
using System.Windows;
using System.Windows.Input;
using System.Windows.Interop;
using System.Windows.Media;
using System.Windows.Threading;
using VoltrisOptimizer.Services.Gamer.Overlay.Models;

namespace VoltrisOptimizer.UI.Overlay
{
    /// <summary>
    /// Janela de overlay transparente para exibir métricas OSD
    /// CORREÇÃO: Configurada para NÃO aparecer no ALT+TAB usando estilos Win32 corretos
    /// </summary>
    public partial class OverlayWindow : Window
    {
        private OverlaySettings _settings;
        private DispatcherTimer? _updateTimer;
        private readonly object _lock = new object();
        private readonly Dictionary<string, System.Windows.Controls.TextBlock> _metricTextBlocks = new Dictionary<string, System.Windows.Controls.TextBlock>();

        // Win32 API para esconder do ALT+TAB
        private const int GWL_EXSTYLE = -20;
        private const int WS_EX_TOOLWINDOW = 0x00000080;
        private const int WS_EX_LAYERED = 0x80000;
        private const int WS_EX_TRANSPARENT = 0x20;
        private const int WS_EX_NOACTIVATE = 0x08000000;
        private const int WS_EX_TOPMOST = 0x00000008;

        [DllImport("user32.dll")]
        private static extern int GetWindowLong(IntPtr hWnd, int nIndex);

        [DllImport("user32.dll")]
        private static extern int SetWindowLong(IntPtr hWnd, int nIndex, int dwNewLong);

        [DllImport("user32.dll")]
        private static extern bool SetLayeredWindowAttributes(IntPtr hwnd, uint crKey, byte bAlpha, uint dwFlags);

        [DllImport("user32.dll")]
        private static extern IntPtr SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter, int X, int Y, int cx, int cy, uint uFlags);

        private const uint SWP_NOMOVE = 0x0002;
        private const uint SWP_NOSIZE = 0x0001;
        private const uint SWP_NOZORDER = 0x0004;
        private static readonly IntPtr HWND_TOPMOST = new IntPtr(-1);

        public OverlayWindow(OverlaySettings settings)
        {
            InitializeComponent();
            _settings = settings;
            
            ApplySettings();
            SetupWindow();
        }

        private void SetupWindow()
        {
            // Configurar janela para ficar sempre no topo e transparente
            Topmost = true;
            WindowStyle = WindowStyle.None;
            AllowsTransparency = true;
            Background = Brushes.Transparent;
            ShowInTaskbar = false;
            ResizeMode = ResizeMode.NoResize;
            
            // CORREÇÃO: Configurar estilos Win32 para esconder do ALT+TAB
            // Isso deve ser feito após a janela ser criada (SourceInitialized)
            SourceInitialized += OverlayWindow_SourceInitialized;

            // Posicionar janela baseado nas configurações
            UpdatePosition();

            // Timer para atualizar posição periodicamente (caso a resolução mude)
            _updateTimer = new DispatcherTimer
            {
                Interval = TimeSpan.FromSeconds(1)
            };
            _updateTimer.Tick += (s, e) => UpdatePosition();
            _updateTimer.Start();
        }

        /// <summary>
        /// CORREÇÃO: Configura estilos Win32 para esconder do ALT+TAB
        /// </summary>
        private void OverlayWindow_SourceInitialized(object? sender, EventArgs e)
        {
            try
            {
                var hwnd = new WindowInteropHelper(this).Handle;
                if (hwnd != IntPtr.Zero)
                {
                    // Obter estilos atuais
                    int exStyle = GetWindowLong(hwnd, GWL_EXSTYLE);
                    
                    // Adicionar estilos necessários:
                    // WS_EX_TOOLWINDOW: Remove da taskbar e ALT+TAB
                    // WS_EX_LAYERED: Permite transparência
                    // WS_EX_NOACTIVATE: Não recebe foco
                    // WS_EX_TOPMOST: Mantém no topo
                    exStyle |= WS_EX_TOOLWINDOW | WS_EX_LAYERED | WS_EX_NOACTIVATE | WS_EX_TOPMOST;
                    
                    // Remover WS_EX_TRANSPARENT (se estiver) para permitir interação quando necessário
                    // Mas manter transparente para passar eventos do mouse ao jogo quando não houver interação
                    // exStyle &= ~WS_EX_TRANSPARENT; // Comentado: queremos que seja clicável para arrastar
                    
                    // Aplicar estilos
                    SetWindowLong(hwnd, GWL_EXSTYLE, exStyle);
                    
                    // Garantir que está no topo
                    SetWindowPos(hwnd, HWND_TOPMOST, 0, 0, 0, 0, SWP_NOMOVE | SWP_NOSIZE);
                }
            }
            catch (Exception ex)
            {
                // Log erro mas não quebrar
                System.Diagnostics.Debug.WriteLine($"[OverlayWindow] Erro ao configurar estilos Win32: {ex.Message}");
            }
        }

        private void UpdatePosition()
        {
            // Usar WPF para obter informações da tela
            var primaryScreen = SystemParameters.PrimaryScreenWidth > 0 
                ? new { Width = SystemParameters.PrimaryScreenWidth, Height = SystemParameters.PrimaryScreenHeight }
                : null;
            
            if (primaryScreen == null) return;

            var workingAreaWidth = SystemParameters.WorkArea.Width;
            var workingAreaHeight = SystemParameters.WorkArea.Height;
            var workingAreaLeft = SystemParameters.WorkArea.Left;
            var workingAreaTop = SystemParameters.WorkArea.Top;
            
            double left = 0, top = 0;

            switch (_settings.Position)
            {
                case OverlayPosition.TopLeft:
                    left = workingAreaLeft + _settings.Margin.Left;
                    top = workingAreaTop + _settings.Margin.Top;
                    break;
                case OverlayPosition.TopRight:
                    left = workingAreaLeft + workingAreaWidth - ActualWidth - _settings.Margin.Right;
                    top = workingAreaTop + _settings.Margin.Top;
                    break;
                case OverlayPosition.BottomLeft:
                    left = workingAreaLeft + _settings.Margin.Left;
                    top = workingAreaTop + workingAreaHeight - ActualHeight - _settings.Margin.Bottom;
                    break;
                case OverlayPosition.BottomRight:
                    left = workingAreaLeft + workingAreaWidth - ActualWidth - _settings.Margin.Right;
                    top = workingAreaTop + workingAreaHeight - ActualHeight - _settings.Margin.Bottom;
                    break;
                case OverlayPosition.TopCenter:
                    left = workingAreaLeft + (workingAreaWidth - ActualWidth) / 2;
                    top = workingAreaTop + _settings.Margin.Top;
                    break;
                case OverlayPosition.BottomCenter:
                    left = workingAreaLeft + (workingAreaWidth - ActualWidth) / 2;
                    top = workingAreaTop + workingAreaHeight - ActualHeight - _settings.Margin.Bottom;
                    break;
            }

            Left = left;
            Top = top;
        }

        public void UpdateSettings(OverlaySettings settings)
        {
            lock (_lock)
            {
                _settings = settings;
            }

            Dispatcher.Invoke(() =>
            {
                ApplySettings();
                UpdatePosition();
            });
        }

        public void UpdateMetrics(MetricsData metrics)
        {
            Dispatcher.Invoke(() =>
            {
                lock (_lock)
                {
                    // CORREÇÃO: Atualizar valores existentes ao invés de recriar elementos
                    // Isso evita piscar e melhora performance

                    // FPS
                    if (_settings.Metrics.ShowFps)
                    {
                        UpdateOrCreateMetric("FPS", $"FPS: {metrics.Fps:F1}");
                    }
                    else
                    {
                        RemoveMetric("FPS");
                    }

                    // FrameTime
                    if (_settings.Metrics.ShowFrameTime)
                    {
                        UpdateOrCreateMetric("FrameTime", $"FrameTime: {metrics.FrameTimeMs:F2} ms");
                    }
                    else
                    {
                        RemoveMetric("FrameTime");
                    }

                    // CPU
                    if (_settings.Metrics.ShowCpuUsage)
                    {
                        UpdateOrCreateMetric("CPU", $"CPU: {metrics.CpuUsagePercent:F1}%");
                    }
                    else
                    {
                        RemoveMetric("CPU");
                    }

                    // GPU
                    if (_settings.Metrics.ShowGpuUsage)
                    {
                        UpdateOrCreateMetric("GPU", $"GPU: {metrics.GpuUsagePercent:F1}%");
                    }
                    else
                    {
                        RemoveMetric("GPU");
                    }

                    // RAM
                    if (_settings.Metrics.ShowRamUsage)
                    {
                        UpdateOrCreateMetric("RAM", $"RAM: {metrics.RamUsagePercent:F1}%");
                    }
                    else
                    {
                        RemoveMetric("RAM");
                    }

                    // VRAM
                    if (_settings.Metrics.ShowVramUsage)
                    {
                        UpdateOrCreateMetric("VRAM", $"VRAM: {metrics.VramUsagePercent:F1}%");
                    }
                    else
                    {
                        RemoveMetric("VRAM");
                    }

                    // CPU Temp
                    if (_settings.Metrics.ShowCpuTemperature && metrics.CpuTemperature.HasValue)
                    {
                        UpdateOrCreateMetric("CPUTemp", $"CPU Temp: {metrics.CpuTemperature.Value:F1}°C");
                    }
                    else
                    {
                        RemoveMetric("CPUTemp");
                    }

                    // GPU Temp
                    if (_settings.Metrics.ShowGpuTemperature && metrics.GpuTemperature.HasValue)
                    {
                        UpdateOrCreateMetric("GPUTemp", $"GPU Temp: {metrics.GpuTemperature.Value:F1}°C");
                    }
                    else
                    {
                        RemoveMetric("GPUTemp");
                    }

                    // CPU Clock
                    if (_settings.Metrics.ShowCpuClock && metrics.CpuClockMhz.HasValue)
                    {
                        UpdateOrCreateMetric("CPUClock", $"CPU Clock: {metrics.CpuClockMhz.Value:F0} MHz");
                    }
                    else
                    {
                        RemoveMetric("CPUClock");
                    }

                    // GPU Clock
                    if (_settings.Metrics.ShowGpuClock)
                    {
                        if (metrics.GpuCoreClockMhz.HasValue)
                        {
                            var clockText = $"GPU Core: {metrics.GpuCoreClockMhz.Value:F0} MHz";
                            if (metrics.GpuMemoryClockMhz.HasValue)
                            {
                                clockText += $" | Mem: {metrics.GpuMemoryClockMhz.Value:F0} MHz";
                            }
                            UpdateOrCreateMetric("GPUClock", clockText);
                        }
                    }
                    else
                    {
                        RemoveMetric("GPUClock");
                    }

                    // Input Latency
                    if (_settings.Metrics.ShowInputLatency && metrics.InputLatencyMs.HasValue)
                    {
                        UpdateOrCreateMetric("InputLatency", $"Input Latency: {metrics.InputLatencyMs.Value:F2} ms");
                    }
                    else
                    {
                        RemoveMetric("InputLatency");
                    }

                    // Atualizar tamanho da janela apenas se necessário
                    SizeToContent = SizeToContent.WidthAndHeight;
                }
            });
        }

        private void UpdateOrCreateMetric(string key, string text)
        {
            if (_metricTextBlocks.TryGetValue(key, out var existingBlock))
            {
                // Atualizar texto existente (não recriar - evita piscar)
                existingBlock.Text = text;
            }
            else
            {
                // Criar novo elemento
                var textBlock = new System.Windows.Controls.TextBlock
                {
                    Text = text,
                    FontFamily = new FontFamily(_settings.Font.FontFamily),
                    FontSize = _settings.Font.FontSize,
                    FontWeight = _settings.Font.IsBold ? FontWeights.Bold : FontWeights.Normal,
                    Foreground = new SolidColorBrush((Color)ColorConverter.ConvertFromString(_settings.TextColor)),
                    Margin = new Thickness(0, 2, 0, 2)
                };

                _metricTextBlocks[key] = textBlock;
                MetricsPanel.Children.Add(textBlock);
            }
        }

        private void RemoveMetric(string key)
        {
            if (_metricTextBlocks.TryGetValue(key, out var block))
            {
                MetricsPanel.Children.Remove(block);
                _metricTextBlocks.Remove(key);
            }
        }

        private void AddMetricLine(string text)
        {
            var textBlock = new System.Windows.Controls.TextBlock
            {
                Text = text,
                FontFamily = new FontFamily(_settings.Font.FontFamily),
                FontSize = _settings.Font.FontSize,
                FontWeight = _settings.Font.IsBold ? FontWeights.Bold : FontWeights.Normal,
                Foreground = new SolidColorBrush((Color)ColorConverter.ConvertFromString(_settings.TextColor)),
                Margin = new Thickness(0, 2, 0, 2)
            };

            MetricsPanel.Children.Add(textBlock);
        }

        private void ApplySettings()
        {
            // Aplicar cor de fundo
            if (!string.IsNullOrEmpty(_settings.BackgroundColor))
            {
                try
                {
                    MainBorder.Background = new SolidColorBrush((Color)ColorConverter.ConvertFromString(_settings.BackgroundColor));
                }
                catch
                {
                    MainBorder.Background = new SolidColorBrush(Color.FromArgb(200, 0, 0, 0)); // Preto semi-transparente padrão
                }
            }
            else
            {
                MainBorder.Background = new SolidColorBrush(Color.FromArgb(200, 0, 0, 0));
            }

            // Aplicar opacidade
            MainBorder.Opacity = _settings.Opacity;
        }

        private void Window_Loaded(object sender, RoutedEventArgs e)
        {
            UpdatePosition();
        }

        private void Window_MouseDown(object sender, MouseButtonEventArgs e)
        {
            // Permitir arrastar a janela
            if (e.ChangedButton == MouseButton.Left)
            {
                DragMove();
            }
        }

        protected override void OnClosed(EventArgs e)
        {
            _updateTimer?.Stop();
            base.OnClosed(e);
        }
    }
}

