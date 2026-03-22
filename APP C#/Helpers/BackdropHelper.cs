using System;
using System.Runtime.InteropServices;
using System.Windows;
using System.Windows.Interop;
using VoltrisOptimizer.Helpers;

namespace VoltrisOptimizer.UI.Helpers
{
    /// <summary>
    /// Aplica efeito acrylic/blur real via SetWindowCompositionAttribute.
    /// Funciona em WPF com AllowsTransparency=True no Windows 10 (1803+) e Windows 11.
    ///
    /// Após aplicar o efeito, delega ao RoundedWindowHelper para reaplicar
    /// Clip + SetWindowRgn, garantindo bordas arredondadas perfeitas.
    /// </summary>
    public static class BackdropHelper
    {
        [DllImport("user32.dll")]
        private static extern int SetWindowCompositionAttribute(IntPtr hwnd, ref WindowCompositionAttributeData data);

        [DllImport("dwmapi.dll", CharSet = CharSet.Unicode, PreserveSig = false)]
        private static extern void DwmSetWindowAttribute(IntPtr hwnd, int attr, ref int attrValue, int attrSize);

        [StructLayout(LayoutKind.Sequential)]
        private struct WindowCompositionAttributeData
        {
            public int Attribute;
            public IntPtr Data;
            public int SizeOfData;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct AccentPolicy
        {
            public int AccentState;
            public int AccentFlags;
            public int GradientColor;
            public int AnimationId;
        }

        private const int WCA_ACCENT_POLICY = 19;
        private const int ACCENT_DISABLED = 0;
        private const int ACCENT_ENABLE_BLURBEHIND = 3;
        private const int ACCENT_ENABLE_ACRYLICBLURBEHIND = 4;

        public enum SystemBackdropType { None, Acrylic }

        /// <summary>
        /// Aplica acrylic blur na janela WPF (AllowsTransparency=True).
        /// Deve ser chamado após a janela estar visível (evento Loaded ou ContentRendered).
        /// </summary>
        public static void ApplyModernBackdrop(Window window, SystemBackdropType type = SystemBackdropType.Acrylic, bool isLightTheme = false)
        {
            try
            {
                IntPtr hWnd = new WindowInteropHelper(window).Handle;
                if (hWnd == IntPtr.Zero)
                    hWnd = new WindowInteropHelper(window).EnsureHandle();
                if (hWnd == IntPtr.Zero) return;

                if (type == SystemBackdropType.None)
                {
                    DisableAccent(hWnd);
                    RoundedWindowHelper.ForceApply(window, 16);
                    return;
                }

                // 1. Aplicar região arredondada ANTES do efeito acrylic
                //    Isso garante que o compositor calcule o blur apenas dentro da região
                RoundedWindowHelper.ForceApply(window, 16);

                // 2. No Windows 11, pedir ao DWM para arredondar nativamente
                //    O DWM faz o clip no nível do compositor, perfeito com Acrylic
                if (Environment.OSVersion.Version.Build >= 22000)
                {
                    try
                    {
                        int preference = 2; // DWMWCP_ROUND
                        DwmSetWindowAttribute(hWnd, 33, ref preference, sizeof(int));
                    }
                    catch { }
                }

                // Tint: formato AABBGGRR
                // Dark:  #550A0A0F = alpha 0x55 (~33%), cor quase preta
                // Light: #40FCF8F8 = alpha 0x40 (~25%), cor quase branca
                int tintColor = isLightTheme
                    ? unchecked((int)0x40FCF8F8)
                    : unchecked((int)0x550A0A0F);

                // Acrylic (Win10 1803+), fallback para blur simples
                int accentState = ACCENT_ENABLE_ACRYLICBLURBEHIND;
                if (Environment.OSVersion.Version.Build < 17134)
                    accentState = ACCENT_ENABLE_BLURBEHIND;

                var accent = new AccentPolicy
                {
                    AccentState = accentState,
                    AccentFlags = 2,
                    GradientColor = tintColor,
                    AnimationId = 0
                };

                // 3. Aplicar o efeito acrylic
                SetAccent(hWnd, accent);

                // 4. Reaplicar região imediatamente após o acrylic
                //    (SetWindowCompositionAttribute pode resetar a região)
                RoundedWindowHelper.ForceApply(window, 16);

                // 5. Reaplicar novamente no próximo frame de render
                //    para garantir que o compositor processou tudo
                window.Dispatcher.BeginInvoke(new Action(() =>
                {
                    try { RoundedWindowHelper.ForceApply(window, 16); } catch { }
                }), System.Windows.Threading.DispatcherPriority.Render);

                // 6. Reaplicar com delay extra para cobrir race conditions do compositor
                window.Dispatcher.BeginInvoke(new Action(() =>
                {
                    try { RoundedWindowHelper.ForceApply(window, 16); } catch { }
                }), System.Windows.Threading.DispatcherPriority.Background);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[BackdropHelper] ApplyModernBackdrop failed: {ex.Message}");
            }
        }

        /// <summary>
        /// Remove o efeito acrylic e restaura fundo normal.
        /// </summary>
        public static void RemoveBackdrop(Window window)
        {
            try
            {
                IntPtr hWnd = new WindowInteropHelper(window).Handle;
                if (hWnd == IntPtr.Zero) return;
                DisableAccent(hWnd);
                RoundedWindowHelper.ForceApply(window, 16);
            }
            catch { }
        }

        private static void SetAccent(IntPtr hWnd, AccentPolicy accent)
        {
            int accentSize = Marshal.SizeOf(accent);
            IntPtr accentPtr = Marshal.AllocHGlobal(accentSize);
            try
            {
                Marshal.StructureToPtr(accent, accentPtr, false);
                var data = new WindowCompositionAttributeData
                {
                    Attribute = WCA_ACCENT_POLICY,
                    Data = accentPtr,
                    SizeOfData = accentSize
                };
                SetWindowCompositionAttribute(hWnd, ref data);
            }
            finally
            {
                Marshal.FreeHGlobal(accentPtr);
            }
        }

        private static void DisableAccent(IntPtr hWnd)
        {
            var accent = new AccentPolicy { AccentState = ACCENT_DISABLED };
            SetAccent(hWnd, accent);
        }
    }
}
