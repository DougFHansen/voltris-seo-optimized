using System;
using System.Runtime.InteropServices;
using System.Windows;
using System.Windows.Interop;

namespace VoltrisOptimizer.UI.Helpers
{
    /// <summary>
    /// Helper para criar janelas com cantos arredondados perfeitos
    /// Compatível com Windows 10 e Windows 11
    /// </summary>
    public static class WindowRoundedCornersHelper
    {
        private const int DWMWA_WINDOW_CORNER_PREFERENCE = 33;
        private const int DWMWCP_ROUND = 2;
        private const int DWMWCP_ROUNDSMALL = 3;

        [DllImport("dwmapi.dll", CharSet = CharSet.Unicode, PreserveSig = false)]
        private static extern void DwmSetWindowAttribute(IntPtr hwnd, int attr, ref int attrValue, int attrSize);

        [DllImport("user32.dll")]
        private static extern int SetWindowRgn(IntPtr hWnd, IntPtr hRgn, bool bRedraw);

        [DllImport("gdi32.dll")]
        private static extern IntPtr CreateRoundRectRgn(int x1, int y1, int x2, int y2, int cx, int cy);

        [DllImport("gdi32.dll")]
        private static extern bool DeleteObject(IntPtr hObject);

        /// <summary>
        /// Aplica cantos arredondados à janela WPF
        /// </summary>
        /// <param name="window">Janela WPF</param>
        /// <param name="cornerRadius">Raio dos cantos em pixels (padrão: 12)</param>
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
                // OBTER DPI DA JANELA (CRÍTICO PARA CORREÇÃO DE ESCALA)
                var dpi = System.Windows.Media.VisualTreeHelper.GetDpi(window);
                
                // Converter pixels lógicos (WPF) para pixels físicos (Device)
                // Usamos Ceiling para garantir que a região cubra toda a janela visualmente
                var width = (int)Math.Ceiling(window.ActualWidth * dpi.DpiScaleX);
                var height = (int)Math.Ceiling(window.ActualHeight * dpi.DpiScaleY);
                
                // Ajustar também o raio para o DPI
                var physicalCornerRadius = (int)Math.Round(cornerRadius * dpi.DpiScaleX);

                if (width <= 0 || height <= 0) return;

                // Criar região arredondada usando coordenadas FÍSICAS
                // Adicionamos +1 para evitar glitches de serrilhado na borda direita/inferior em alguns DPIs
                var hRgn = CreateRoundRectRgn(0, 0, width + 1, height + 1, physicalCornerRadius * 2, physicalCornerRadius * 2);

                if (hRgn != IntPtr.Zero)
                {
                    // Aplicar região à janela
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
