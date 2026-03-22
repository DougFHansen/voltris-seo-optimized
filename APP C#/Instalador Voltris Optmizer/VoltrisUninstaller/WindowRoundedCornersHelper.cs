using System;
using System.Runtime.InteropServices;
using System.Windows;
using System.Windows.Interop;

namespace VoltrisUninstaller
{
    /// <summary>
    /// Helper para criar janelas com cantos arredondados perfeitos
    /// CompatÃ­vel com Windows 10 e Windows 11
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
        /// Aplica cantos arredondados Ã  janela WPF
        /// </summary>
        /// <param name="window">Janela WPF</param>
        /// <param name="cornerRadius">Raio dos cantos em pixels (padrÃ£o: 12)</param>
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
                    // Silenciosamente falhar se nÃ£o for possÃ­vel aplicar
                }
            };
        }

        private static bool IsWindows11OrGreater()
        {
            try
            {
                var version = Environment.OSVersion.Version;
                // Windows 11 Ã© versÃ£o 10.0.22000 ou superior
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
                // Usar DWMWCP_ROUNDSMALL para cantos mais arredondados (similar ao WPF)
                int cornerPreference = DWMWCP_ROUNDSMALL;
                DwmSetWindowAttribute(handle, DWMWA_WINDOW_CORNER_PREFERENCE, ref cornerPreference, sizeof(int));
            }
            catch
            {
                // Falhar silenciosamente se DWM nÃ£o estiver disponÃ­vel
            }
        }

        private static void ApplyWindows10RoundedCorners(Window window, IntPtr handle, int cornerRadius)
        {
            try
            {
                // Obter dimensÃµes da janela
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
                // Obter fator de escala DPI
                var source = PresentationSource.FromVisual(window);
                var dpiX = source?.CompositionTarget?.TransformToDevice.M11 ?? 1.0;
                var dpiY = source?.CompositionTarget?.TransformToDevice.M22 ?? 1.0;

                var width = (int)(window.ActualWidth * dpiX);
                var height = (int)(window.ActualHeight * dpiY);

                if (width <= 0 || height <= 0) return;

                // Ajustar raio para DPI tambÃ©m
                var scaledCornerRadius = (int)(cornerRadius * dpiX);

                // Criar regiÃ£o arredondada
                var hRgn = CreateRoundRectRgn(0, 0, width, height, scaledCornerRadius * 2, scaledCornerRadius * 2);

                if (hRgn != IntPtr.Zero)
                {
                    // Aplicar regiÃ£o Ã  janela
                    SetWindowRgn(handle, hRgn, true);
                    // A regiÃ£o serÃ¡ liberada automaticamente pelo Windows
                }
            }
            catch
            {
                // Falhar silenciosamente
            }
        }
    }
}

