using System;
using System.Runtime.InteropServices;
using System.Windows;
using System.Windows.Interop;
using System.Windows.Media;
using VoltrisOptimizer.UI.Helpers;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.UI.Controls
{
    /// <summary>
    /// Tooltip customizado do systray com posicionamento e Z-order corretos.
    ///
    /// ANÁLISE DO PROBLEMA:
    ///   O NotifyIconOverflowWindow é uma janela TOPMOST gerenciada pelo Explorer.
    ///   Existem dois problemas distintos que precisam ser resolvidos separadamente:
    ///
    ///   PROBLEMA 1 — Z-order (quem fica na frente):
    ///     O tooltip precisa ser TOPMOST para aparecer na frente de janelas normais.
    ///     Mas ao usar HWND_TOPMOST, ele fica acima do overflow também.
    ///     SOLUÇÃO: Usar HWND_TOPMOST (necessário para visibilidade), mas garantir
    ///     que o tooltip nunca se sobreponha GEOMETRICAMENTE ao overflow.
    ///     O tooltip nativo do Windows usa exatamente essa abordagem.
    ///
    ///   PROBLEMA 2 — Posicionamento geométrico (onde aparece na tela):
    ///     Quando o ícone está no overflow, o tooltip deve aparecer ACIMA do painel
    ///     de overflow, não sobre ele. O rect de referência para posicionamento deve
    ///     ser o rect do próprio painel de overflow (NotifyIconOverflowWindow),
    ///     não o rect do ícone individual dentro dele.
    ///
    ///   SOLUÇÃO COMBINADA:
    ///     - Usar HWND_TOPMOST para Z-order (tooltip sempre visível)
    ///     - Posicionar ACIMA do painel de overflow geometricamente
    ///     - Nunca há sobreposição porque o tooltip está fisicamente acima do painel
    ///
    /// COMPATIBILIDADE:
    ///   Windows 10 / 11, multi-monitor, DPI por monitor, taskbar em qualquer posição.
    /// </summary>
    public partial class ModernTrayTooltip : Window
    {
        // ── Window styles ────────────────────────────────────────────────────────
        private const int GWL_EXSTYLE      = -20;
        private const int WS_EX_TOOLWINDOW = 0x00000080;
        private const int WS_EX_APPWINDOW  = 0x00040000;
        private const int WS_EX_NOACTIVATE = 0x08000000;

        // ── SetWindowPos ─────────────────────────────────────────────────────────
        private static readonly IntPtr HWND_TOPMOST   = new IntPtr(-1);
        private static readonly IntPtr HWND_NOTOPMOST = new IntPtr(-2);
        private static readonly IntPtr HWND_TOP       = new IntPtr(0);

        private const uint SWP_NOMOVE     = 0x0002;
        private const uint SWP_NOSIZE     = 0x0001;
        private const uint SWP_NOACTIVATE = 0x0010;
        private const uint SWP_NOZORDER   = 0x0004;

        // ── GetAncestor ──────────────────────────────────────────────────────────
        private const uint GA_ROOT = 2;

        // ── Overflow window class name ───────────────────────────────────────────
        // Consistente entre Windows 10 e Windows 11
        private const string OverflowClassName = "NotifyIconOverflowWindow";

        // ── P/Invoke ─────────────────────────────────────────────────────────────

        [DllImport("user32.dll")]
        private static extern int GetWindowLong(IntPtr hWnd, int nIndex);

        [DllImport("user32.dll")]
        private static extern int SetWindowLong(IntPtr hWnd, int nIndex, int dwNewLong);

        [DllImport("user32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool SetWindowPos(
            IntPtr hWnd, IntPtr hWndInsertAfter,
            int x, int y, int cx, int cy, uint uFlags);

        [DllImport("user32.dll")]
        private static extern bool GetCursorPos(out System.Drawing.Point lpPoint);

        [DllImport("user32.dll")]
        private static extern IntPtr WindowFromPoint(System.Drawing.Point point);

        [DllImport("user32.dll")]
        private static extern IntPtr GetAncestor(IntPtr hWnd, uint gaFlags);

        [DllImport("user32.dll", CharSet = CharSet.Unicode)]
        private static extern int GetClassName(IntPtr hWnd, System.Text.StringBuilder lpClassName, int nMaxCount);

        [DllImport("user32.dll", CharSet = CharSet.Unicode)]
        private static extern IntPtr FindWindow(string? lpClassName, string? lpWindowName);

        [DllImport("user32.dll")]
        [return: MarshalAs(UnmanagedType.Bool)]
        private static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);

        [StructLayout(LayoutKind.Sequential)]
        private struct RECT
        {
            public int Left, Top, Right, Bottom;
            public System.Drawing.Rectangle ToRectangle() =>
                System.Drawing.Rectangle.FromLTRB(Left, Top, Right, Bottom);
        }

        // ── SHAppBarMessage ──────────────────────────────────────────────────────
        [StructLayout(LayoutKind.Sequential)]
        private struct APPBARDATA
        {
            public uint   cbSize;
            public IntPtr hWnd;
            public uint   uCallbackMessage;
            public uint   uEdge;
            public RECT   rc;
            public IntPtr lParam;
        }
        private const uint ABM_GETTASKBARPOS = 5;
        private const uint ABE_LEFT   = 0;
        private const uint ABE_TOP    = 1;
        private const uint ABE_RIGHT  = 2;
        private const uint ABE_BOTTOM = 3;

        [DllImport("shell32.dll")]
        private static extern IntPtr SHAppBarMessage(uint dwMessage, ref APPBARDATA pData);

        // ── Estado ───────────────────────────────────────────────────────────────
        private HwndSource? _hwndSource;
        private IntPtr      _hwnd = IntPtr.Zero;
        private System.Drawing.Rectangle _iconRectPhysical = System.Drawing.Rectangle.Empty;

        // ── Construtor ───────────────────────────────────────────────────────────

        public ModernTrayTooltip()
        {
            InitializeComponent();
            // Topmost=false no construtor — será aplicado via SetWindowPos após Show()
            // para ter controle preciso do momento e evitar conflito com o WPF
            Topmost = false;
            SourceInitialized += OnSourceInitialized;
            ContentRendered   += (s, e) => ApplyBackdropIfEnabled();
        }

        private void OnSourceInitialized(object? sender, EventArgs e)
        {
            _hwnd = new WindowInteropHelper(this).Handle;
            _hwndSource = HwndSource.FromHwnd(_hwnd);

            // WS_EX_TOOLWINDOW  → remove do Alt+Tab e da taskbar
            // WS_EX_NOACTIVATE  → nunca rouba foco
            int exStyle = GetWindowLong(_hwnd, GWL_EXSTYLE);
            exStyle = (exStyle | WS_EX_TOOLWINDOW | WS_EX_NOACTIVATE) & ~WS_EX_APPWINDOW;
            SetWindowLong(_hwnd, GWL_EXSTYLE, exStyle);
        }

        protected override void OnClosed(EventArgs e)
        {
            _hwndSource = null;
            _hwnd = IntPtr.Zero;
            base.OnClosed(e);
        }

        // ── API pública ──────────────────────────────────────────────────────────

        public void SetIconRect(System.Drawing.Rectangle iconRectPhysical)
        {
            _iconRectPhysical = iconRectPhysical;
        }

        /// <summary>
        /// Mostra o tooltip com posição e Z-order corretos.
        ///
        /// TIMING:
        ///   O SizeToContent="Height" faz ActualHeight só ficar correto após layout completo.
        ///   Por isso usamos dois passes de posicionamento:
        ///   - Passe 1 (Loaded): layout calculado, ActualHeight disponível
        ///   - Passe 2 (Background): confirmação após qualquer ajuste de DPI/backdrop
        ///   A janela fica invisível (Opacity=0) até o posicionamento final ser aplicado.
        /// </summary>
        public void ShowAboveTray()
        {
            // Ocultar visualmente até ter a posição correta (evita flash)
            Opacity = 0;
            Show();

            // Passe 1: após layout completo (ActualHeight real disponível)
            Dispatcher.BeginInvoke(System.Windows.Threading.DispatcherPriority.Loaded, new Action(() =>
            {
                PositionNearTray();
                ApplyZOrder();
                Opacity = 1;
            }));

            // Passe 2: confirmação após Background (garante estabilidade com SizeToContent)
            Dispatcher.BeginInvoke(System.Windows.Threading.DispatcherPriority.Background, new Action(() =>
            {
                PositionNearTray();
                ApplyZOrder();
            }));
        }

        // ── Posicionamento ───────────────────────────────────────────────────────

        /// <summary>
        /// Calcula e aplica a posição do tooltip.
        ///
        /// Trabalha inteiramente em pixels físicos internamente e converte para
        /// DIPs (WPF) apenas no final — elimina erros de DPI scaling.
        /// </summary>
        public void PositionNearTray()
        {
            try
            {
                double dpi = GetDpiScale();

                // Tamanho do tooltip em pixels físicos
                double tooltipWDip = ActualWidth  > 10 ? ActualWidth  : 300;
                double tooltipHDip = ActualHeight > 10 ? ActualHeight : 260;

                if (tooltipWDip <= 10 || tooltipHDip <= 10)
                {
                    Measure(new Size(double.PositiveInfinity, double.PositiveInfinity));
                    Arrange(new Rect(DesiredSize));
                    tooltipWDip = DesiredSize.Width  > 10 ? DesiredSize.Width  : 300;
                    tooltipHDip = DesiredSize.Height > 10 ? DesiredSize.Height : 260;
                }

                // Converter para pixels físicos para cálculos precisos
                int tooltipWPx = (int)Math.Ceiling(tooltipWDip * dpi);
                int tooltipHPx = (int)Math.Ceiling(tooltipHDip * dpi);
                const int gapPx = 8; // gap em pixels físicos

                var (taskbarRect, taskbarEdge) = GetTaskbarInfo();
                bool inFlyOut    = DetectOverflow(taskbarRect);
                bool hasIconRect = !_iconRectPhysical.IsEmpty;

                int leftPx, topPx;

                if (inFlyOut)
                {
                    // ── CASO OVERFLOW ────────────────────────────────────────────
                    // Referência: rect do painel NotifyIconOverflowWindow
                    var overflowRect = GetOverflowWindowRect();

                    int refTopPx, refCenterXPx;

                    if (!overflowRect.IsEmpty)
                    {
                        refTopPx     = overflowRect.Top;
                        refCenterXPx = (overflowRect.Left + overflowRect.Right) / 2;
                    }
                    else if (hasIconRect)
                    {
                        refTopPx     = _iconRectPhysical.Top;
                        refCenterXPx = (_iconRectPhysical.Left + _iconRectPhysical.Right) / 2;
                    }
                    else
                    {
                        GetCursorPos(out var mp);
                        refTopPx     = mp.Y;
                        refCenterXPx = mp.X;
                    }

                    leftPx = refCenterXPx - tooltipWPx / 2;
                    topPx  = refTopPx - tooltipHPx - gapPx;

                    System.Diagnostics.Debug.WriteLine(
                        $"[TOOLTIP-POS] OVERFLOW: overflowRect={overflowRect} " +
                        $"refTopPx={refTopPx} refCenterXPx={refCenterXPx} " +
                        $"tooltipHPx={tooltipHPx} topPx={topPx}");
                }
                else
                {
                    // ── CASO TASKBAR NORMAL ──────────────────────────────────────
                    int iconCenterXPx, iconCenterYPx;

                    if (hasIconRect)
                    {
                        iconCenterXPx = (_iconRectPhysical.Left + _iconRectPhysical.Right)  / 2;
                        iconCenterYPx = (_iconRectPhysical.Top  + _iconRectPhysical.Bottom) / 2;
                    }
                    else
                    {
                        GetCursorPos(out var mp);
                        iconCenterXPx = mp.X;
                        iconCenterYPx = mp.Y;
                    }

                    switch (taskbarEdge)
                    {
                        case ABE_TOP:
                            leftPx = iconCenterXPx - tooltipWPx / 2;
                            topPx  = taskbarRect.IsEmpty ? gapPx : taskbarRect.Bottom + gapPx;
                            break;
                        case ABE_LEFT:
                            leftPx = taskbarRect.IsEmpty ? gapPx : taskbarRect.Right + gapPx;
                            topPx  = iconCenterYPx - tooltipHPx / 2;
                            break;
                        case ABE_RIGHT:
                            leftPx = taskbarRect.IsEmpty ? 0 : taskbarRect.Left - tooltipWPx - gapPx;
                            topPx  = iconCenterYPx - tooltipHPx / 2;
                            break;
                        case ABE_BOTTOM:
                        default:
                            leftPx = iconCenterXPx - tooltipWPx / 2;
                            // CRÍTICO: posicionar acima do TOPO da taskbar, não da área de trabalho
                            topPx  = taskbarRect.IsEmpty
                                ? (int)(SystemParameters.WorkArea.Bottom * dpi) - tooltipHPx - gapPx
                                : taskbarRect.Top - tooltipHPx - gapPx;
                            break;
                    }

                    System.Diagnostics.Debug.WriteLine(
                        $"[TOOLTIP-POS] TASKBAR: edge={taskbarEdge} taskbarRect={taskbarRect} " +
                        $"iconCenterX={iconCenterXPx} tooltipHPx={tooltipHPx} topPx={topPx}");
                }

                // Clamp em pixels físicos
                var screen = System.Windows.Forms.Screen.FromPoint(
                    new System.Drawing.Point(leftPx + tooltipWPx / 2, topPx + tooltipHPx / 2));
                var wa = screen.WorkingArea;

                if (leftPx < wa.Left + 8)                    leftPx = wa.Left + 8;
                if (leftPx + tooltipWPx > wa.Right - 8)      leftPx = wa.Right - 8 - tooltipWPx;
                if (topPx  < wa.Top  + 8)                    topPx  = wa.Top  + 8;
                if (topPx  + tooltipHPx > wa.Bottom - gapPx) topPx  = wa.Bottom - gapPx - tooltipHPx;

                // Converter de volta para DIPs para WPF
                Left = leftPx / dpi;
                Top  = topPx  / dpi;

                System.Diagnostics.Debug.WriteLine(
                    $"[TOOLTIP-POS] Final: Left={Left:F1} Top={Top:F1} " +
                    $"(px: {leftPx},{topPx}) dpi={dpi:F2} " +
                    $"tooltipH={tooltipHDip:F1}dip/{tooltipHPx}px inFlyOut={inFlyOut}");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[TOOLTIP-POS] ERRO: {ex.Message}");
                Left = SystemParameters.WorkArea.Right  - 316;
                Top  = SystemParameters.WorkArea.Bottom - 280;
            }
        }

        // ── Z-order ──────────────────────────────────────────────────────────────

        /// <summary>
        /// Aplica Z-order correto.
        ///
        /// ESTRATÉGIA:
        ///   Usar HWND_TOPMOST para que o tooltip fique visível acima de janelas normais.
        ///   Isso é necessário e correto — o tooltip nativo do Windows também é TOPMOST.
        ///   A sobreposição com o overflow é evitada pelo POSICIONAMENTO GEOMÉTRICO
        ///   (o tooltip está fisicamente acima do painel, não sobre ele).
        ///
        ///   Quando o ícone está na taskbar normal (não no overflow), o overflow
        ///   geralmente não está visível, então HWND_TOPMOST não causa problema.
        ///
        ///   Quando o ícone está no overflow e o painel está aberto, o tooltip
        ///   é posicionado ACIMA do painel — sem sobreposição geométrica, portanto
        ///   o Z-order TOPMOST não causa problema visual.
        /// </summary>
        private void ApplyZOrder()
        {
            if (_hwnd == IntPtr.Zero) return;

            try
            {
                // HWND_TOPMOST: tooltip fica acima de janelas normais.
                // A não-sobreposição com o overflow é garantida pelo posicionamento,
                // não pelo Z-order — igual ao comportamento do tooltip nativo do Windows.
                SetWindowPos(
                    _hwnd,
                    HWND_TOPMOST,
                    0, 0, 0, 0,
                    SWP_NOMOVE | SWP_NOSIZE | SWP_NOACTIVATE);

                System.Diagnostics.Debug.WriteLine("[TOOLTIP-ZORDER] HWND_TOPMOST aplicado");
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"[TOOLTIP-ZORDER] ERRO: {ex.Message}");
            }
        }

        // ── Detecção de overflow ─────────────────────────────────────────────────

        /// <summary>
        /// Detecta se o ícone está no painel de overflow.
        ///
        /// Método 1 (primário): rect do ícone não intersecta o rect da taskbar.
        /// Método 2 (fallback): cursor está sobre a janela NotifyIconOverflowWindow.
        /// </summary>
        private bool DetectOverflow(System.Drawing.Rectangle taskbarRect)
        {
            // Método 1: rect do ícone vs taskbar
            if (!_iconRectPhysical.IsEmpty && !taskbarRect.IsEmpty)
                return !taskbarRect.IntersectsWith(_iconRectPhysical);

            // Método 2: cursor sobre o overflow
            IntPtr overflowHwnd = FindWindow(OverflowClassName, null);
            if (overflowHwnd == IntPtr.Zero) return false;

            GetCursorPos(out var cursorPos);
            IntPtr windowUnderCursor = WindowFromPoint(cursorPos);
            IntPtr rootWindow        = GetAncestor(windowUnderCursor, GA_ROOT);

            if (rootWindow == overflowHwnd) return true;

            var sb = new System.Text.StringBuilder(256);
            GetClassName(rootWindow, sb, sb.Capacity);
            return sb.ToString().Equals(OverflowClassName, StringComparison.OrdinalIgnoreCase);
        }

        /// <summary>
        /// Obtém o rect físico (pixels) do painel NotifyIconOverflowWindow.
        /// Retorna Empty se a janela não existir ou não estiver visível.
        /// </summary>
        private System.Drawing.Rectangle GetOverflowWindowRect()
        {
            try
            {
                IntPtr overflowHwnd = FindWindow(OverflowClassName, null);
                if (overflowHwnd == IntPtr.Zero) return System.Drawing.Rectangle.Empty;

                if (!GetWindowRect(overflowHwnd, out RECT r)) return System.Drawing.Rectangle.Empty;

                var rect = r.ToRectangle();

                // Sanity check: rect válido (painel pode existir mas estar minimizado/oculto)
                if (rect.Width < 10 || rect.Height < 10) return System.Drawing.Rectangle.Empty;

                System.Diagnostics.Debug.WriteLine($"[TOOLTIP-POS] OverflowRect={rect}");
                return rect;
            }
            catch
            {
                return System.Drawing.Rectangle.Empty;
            }
        }

        // ── Taskbar info ─────────────────────────────────────────────────────────

        private (System.Drawing.Rectangle rect, uint edge) GetTaskbarInfo()
        {
            try
            {
                IntPtr hTaskbar = FindWindow("Shell_TrayWnd", null);
                var abd = new APPBARDATA
                {
                    cbSize = (uint)Marshal.SizeOf<APPBARDATA>(),
                    hWnd   = hTaskbar
                };
                SHAppBarMessage(ABM_GETTASKBARPOS, ref abd);
                return (abd.rc.ToRectangle(), abd.uEdge);
            }
            catch
            {
                return (System.Drawing.Rectangle.Empty, ABE_BOTTOM);
            }
        }

        // ── DPI ──────────────────────────────────────────────────────────────────

        private double GetDpiScale()
        {
            try
            {
                var source = PresentationSource.FromVisual(this);
                if (source?.CompositionTarget != null)
                    return source.CompositionTarget.TransformToDevice.M11;
            }
            catch { }
            return 1.0;
        }

        // ── Dados ────────────────────────────────────────────────────────────────

        public void UpdateStatus(bool shieldActive, string profileName, string powerPlanName, string version)
        {
            VersionText.Text = $"v{version}";

            if (shieldActive)
            {
                ShieldStatusText.Text = "Ativo";
                ShieldStatusFg.Color  = Color.FromRgb(0x4A, 0xDE, 0x80);
                ShieldBadgeBg.Color   = Color.FromRgb(0x0D, 0x3B, 0x1E);
            }
            else
            {
                ShieldStatusText.Text = "Inativo";
                ShieldStatusFg.Color  = Color.FromRgb(0xFB, 0xBF, 0x24);
                ShieldBadgeBg.Color   = Color.FromRgb(0x3B, 0x2F, 0x0D);
            }

            ProfileText.Text   = string.IsNullOrEmpty(profileName)   ? "—" : profileName;
            PowerPlanText.Text = string.IsNullOrEmpty(powerPlanName) ? "—" : powerPlanName;
        }

        // ── Backdrop ─────────────────────────────────────────────────────────────

        private void ApplyBackdropIfEnabled()
        {
            try
            {
                var transparencyEnabled = SettingsService.Instance.Settings.EnableTransparency;
                if (transparencyEnabled)
                {
                    bool isLight = SettingsService.Instance.Settings.Theme?
                        .Equals("Light", StringComparison.OrdinalIgnoreCase) == true;
                    BackdropHelper.ApplyModernBackdrop(
                        this,
                        BackdropHelper.SystemBackdropType.Acrylic,
                        isLight);

                    if (RootBg != null)
                        RootBg.Opacity = 0.55;
                }
            }
            catch { /* backdrop não suportado */ }
        }
    }
}
