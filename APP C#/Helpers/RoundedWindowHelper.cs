using System;
using System.Runtime.InteropServices;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Interop;
using System.Windows.Media;

namespace VoltrisOptimizer.Helpers
{
    /// <summary>
    /// Helper reutilizável para bordas arredondadas perfeitas em janelas WPF.
    ///
    /// Estratégia:
    /// - Window.Clip (RectangleGeometry com RadiusX/RadiusY) para anti-aliasing suave
    /// - SetWindowRgn (CreateRoundRectRgn) para eliminar pixels transparentes nos cantos
    ///   usando raio ligeiramente maior que o clip WPF (serrilhado fica escondido)
    /// - No Windows 11, DWM nativo como complemento
    ///
    /// Também suporta ContextMenu via ApplyToContextMenu().
    /// </summary>
    public static class RoundedWindowHelper
    {
        #region Win32 Imports

        [DllImport("dwmapi.dll", CharSet = CharSet.Unicode, PreserveSig = false)]
        private static extern void DwmSetWindowAttribute(IntPtr hwnd, int attr, ref int attrValue, int attrSize);

        [DllImport("user32.dll")]
        private static extern int SetWindowRgn(IntPtr hWnd, IntPtr hRgn, bool bRedraw);

        [DllImport("gdi32.dll")]
        private static extern IntPtr CreateRoundRectRgn(int x1, int y1, int x2, int y2, int cx, int cy);

        [DllImport("user32.dll")]
        private static extern IntPtr GetParent(IntPtr hWnd);

        [DllImport("user32.dll")]
        private static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);

        [StructLayout(LayoutKind.Sequential)]
        private struct RECT
        {
            public int Left, Top, Right, Bottom;
        }

        private const int DWMWA_WINDOW_CORNER_PREFERENCE = 33;
        private const int DWMWCP_ROUND = 2;

        private const int WM_SIZE = 0x0005;
        private const int WM_DPICHANGED = 0x02E0;
        private const int WM_EXITSIZEMOVE = 0x0232;
        private const int WM_WINDOWPOSCHANGED = 0x0047;

        #endregion

        /// <summary>
        /// Aplica bordas arredondadas reais em uma janela WPF.
        /// Deve ser chamado no construtor da janela.
        /// </summary>
        public static void Apply(Window window, double radius = 16)
        {
            if (window == null) return;

            window.SourceInitialized += (s, e) => OnSourceReady(window, radius);
            window.Loaded += (s, e) => ApplySafe(window, radius);
            window.SizeChanged += (s, e) => ApplySafe(window, radius);

            window.StateChanged += (s, e) =>
            {
                if (window.WindowState == WindowState.Normal)
                {
                    window.Dispatcher.BeginInvoke(new Action(() => ApplySafe(window, radius)),
                        System.Windows.Threading.DispatcherPriority.Render);
                }
                else if (window.WindowState == WindowState.Maximized)
                {
                    // Maximizado: sem cantos arredondados
                    window.Clip = null;
                    var hwnd = new WindowInteropHelper(window).Handle;
                    if (hwnd != IntPtr.Zero)
                        SetWindowRgn(hwnd, IntPtr.Zero, true);
                }
            };
        }

        /// <summary>
        /// Aplica bordas arredondadas em todos os ContextMenus do aplicativo.
        /// Deve ser chamado uma vez no App.xaml.cs (após InitializeComponent).
        /// Intercepta o evento Opened de cada ContextMenu para aplicar SetWindowRgn no popup.
        /// </summary>
        public static void ApplyToContextMenu(ContextMenu menu, double radius = 12)
        {
            if (menu == null) return;

            menu.Opened += (s, e) =>
            {
                // Agendar para depois que o popup renderize
                menu.Dispatcher.BeginInvoke(new Action(() =>
                {
                    try
                    {
                        ApplyRegionToPopup(menu, radius);
                    }
                    catch { }
                }), System.Windows.Threading.DispatcherPriority.Loaded);
            };
        }

        /// <summary>
        /// Registra um handler global para aplicar bordas arredondadas em TODOS os
        /// ContextMenus que abrirem no aplicativo. Chamar uma vez no startup.
        /// </summary>
        public static void EnableGlobalContextMenuRounding(double radius = 12)
        {
            EventManager.RegisterClassHandler(
                typeof(ContextMenu),
                ContextMenu.OpenedEvent,
                new RoutedEventHandler((s, e) =>
                {
                    if (s is ContextMenu cm)
                    {
                        cm.Dispatcher.BeginInvoke(new Action(() =>
                        {
                            try { ApplyRegionToPopup(cm, radius); } catch { }
                        }), System.Windows.Threading.DispatcherPriority.Loaded);
                    }
                }));
        }

        #region Private Implementation

        /// <summary>
        /// Força a reaplicação imediata do clip + região na janela.
        /// Útil após operações que podem resetar a região (ex: SetWindowCompositionAttribute).
        /// </summary>
        public static void ForceApply(Window window, double radius = 16)
        {
            ApplySafe(window, radius);
        }

        private static void OnSourceReady(Window window, double radius)
        {
            var hwnd = new WindowInteropHelper(window).Handle;
            if (hwnd == IntPtr.Zero) return;

            TryApplyDwmRoundCorners(hwnd);
            ApplyClipAndRegion(window, hwnd, radius);

            var source = HwndSource.FromHwnd(hwnd);
            source?.AddHook((IntPtr h, int msg, IntPtr wParam, IntPtr lParam, ref bool handled) =>
            {
                if (msg == WM_SIZE || msg == WM_DPICHANGED || msg == WM_EXITSIZEMOVE)
                {
                    window.Dispatcher.BeginInvoke(new Action(() =>
                    {
                        if (window.WindowState == WindowState.Normal)
                        {
                            try { ApplyClipAndRegion(window, h, radius); } catch { }
                        }
                    }), System.Windows.Threading.DispatcherPriority.Render);
                }
                return IntPtr.Zero;
            });
        }

        private static void ApplySafe(Window window, double radius)
        {
            if (window.WindowState != WindowState.Normal) return;
            var hwnd = new WindowInteropHelper(window).Handle;
            if (hwnd != IntPtr.Zero)
                ApplyClipAndRegion(window, hwnd, radius);
        }

        private static void TryApplyDwmRoundCorners(IntPtr hwnd)
        {
            if (Environment.OSVersion.Version.Build < 22000) return;
            try
            {
                int preference = DWMWCP_ROUND;
                DwmSetWindowAttribute(hwnd, DWMWA_WINDOW_CORNER_PREFERENCE, ref preference, sizeof(int));
            }
            catch { }
        }

        private static void ApplyClipAndRegion(Window window, IntPtr hwnd, double radius)
        {
            try
            {
                double w = window.ActualWidth;
                double h = window.ActualHeight;

                // Fallback: se ActualWidth/Height ainda não foram calculados (SourceInitialized),
                // usar Width/Height ou MinWidth/MinHeight como estimativa
                if (w <= 0) w = !double.IsNaN(window.Width) ? window.Width : window.MinWidth;
                if (h <= 0) h = !double.IsNaN(window.Height) ? window.Height : window.MinHeight;
                if (w <= 0 || h <= 0) return;

                // 1. Clip WPF — anti-aliased (bordas suaves)
                window.Clip = new RectangleGeometry(
                    new Rect(0, 0, w, h), radius, radius);

                // 2. Região Win32 — elimina pixels transparentes
                ApplyRegionToHwnd(window, hwnd, w, h, radius);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[RoundedWindowHelper] Error: {ex.Message}");
            }
        }

        private static void ApplyRegionToHwnd(Visual visual, IntPtr hwnd, double width, double height, double radius)
        {
            double dpiX = 1.0, dpiY = 1.0;
            var ps = PresentationSource.FromVisual(visual);
            if (ps?.CompositionTarget != null)
            {
                dpiX = ps.CompositionTarget.TransformToDevice.M11;
                dpiY = ps.CompositionTarget.TransformToDevice.M22;
            }

            int pw = (int)Math.Ceiling(width * dpiX);
            int ph = (int)Math.Ceiling(height * dpiY);

            // Raio da região: +2px lógicos para esconder serrilhado atrás do clip WPF
            double rgnRadius = radius + 2;
            int diamX = (int)Math.Round(rgnRadius * 2 * dpiX);
            int diamY = (int)Math.Round(rgnRadius * 2 * dpiY);

            IntPtr rgn = CreateRoundRectRgn(0, 0, pw + 1, ph + 1, diamX, diamY);
            SetWindowRgn(hwnd, rgn, true);
        }

        private static void ApplyRegionToPopup(ContextMenu menu, double radius)
        {
            try
            {
                // Encontrar o HwndSource do popup
                var source = PresentationSource.FromVisual(menu) as HwndSource;
                if (source == null) return;

                var hwnd = source.Handle;
                if (hwnd == IntPtr.Zero) return;

                // Obter dimensões do popup via Win32
                if (!GetWindowRect(hwnd, out RECT rect)) return;

                int pw = rect.Right - rect.Left;
                int ph = rect.Bottom - rect.Top;
                if (pw <= 0 || ph <= 0) return;

                // DPI
                double dpiX = 1.0;
                if (source.CompositionTarget != null)
                    dpiX = source.CompositionTarget.TransformToDevice.M11;

                int diam = (int)Math.Round(radius * 2 * dpiX);

                IntPtr rgn = CreateRoundRectRgn(0, 0, pw + 1, ph + 1, diam, diam);
                SetWindowRgn(hwnd, rgn, true);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[RoundedWindowHelper] ContextMenu error: {ex.Message}");
            }
        }

        #endregion
    }
}
