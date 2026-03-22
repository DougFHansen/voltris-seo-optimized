using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Accessibility;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.Services.Personalize
{
    // ══════════════════════════════════════════════════════════════════════════════
    // TaskbarControlService — Motor idêntico ao TaskbarX (TaskbarCenter.vb)
    //
    // CORREÇÃO DEFINITIVA: accLocation() retorna 0 neste sistema por diferença de
    // sessão/integridade entre o Voltris e o Explorer. Toda medição de posição e
    // tamanho usa GetWindowRect (Win32 puro), que nunca falha.
    //
    // Algoritmo de centralização (idêntico ao PositionCalculator do TaskbarX):
    //   TrayWndWidth  = Shell_TrayWnd.right  - Shell_TrayWnd.left
    //   RebarWndLeft  = ReBarWindow32.left   - Shell_TrayWnd.left   (offset do rebar)
    //   TaskListWidth = MSTaskListWClass.right - MSTaskListWClass.left
    //   Position      = (TrayWndWidth / 2) – (TaskListWidth / 2) – RebarWndLeft
    //
    // O estado (string de detecção de mudança) é:
    //   orient + taskListWidth + trayWndWidth
    // ══════════════════════════════════════════════════════════════════════════════

    public enum TaskbarStyleMode
    {
        Transparent = 0,
        Blur        = 1,
        Acrylic     = 2,
        Gradient    = 3,
    }

    public class TaskbarControlService
    {
        private readonly ILoggingService _logger;
        private const string TAG = "[TaskbarCtrl]";

        private CancellationTokenSource? _loopCts;
        private bool _centeringEnabled;
        private bool _styleEnabled;
        private const int LoopRefreshRate = 200;
        private volatile bool _forceRecenter = false; // força re-centralização no próximo ciclo

        private TaskbarStyleMode _styleMode = TaskbarStyleMode.Transparent;
        private byte   _opacity    = 255;
        private int    _colorR, _colorG, _colorB, _colorAlpha;

        // Debounce para aplicação de estilo — evita bloquear UI thread durante drag do slider
        private volatile bool _pendingStyleApply = false;

        // Quando VoltrisBlur está ativo, NÃO aplicar SetWindowCompositionAttribute na taskbar.
        // A DLL VoltrisBlur.dll gerencia o efeito da taskbar diretamente — qualquer chamada
        // a SetWindowCompositionAttribute sobrescreve o efeito dela e deixa a taskbar branca.
        private volatile bool _voltrisBlurActive = false;

        /// <summary>
        /// Informa ao TaskbarControlService se o VoltrisBlur está ativo.
        /// Quando ativo, o estilo nativo (SetWindowCompositionAttribute) é suprimido
        /// para não conflitar com a DLL VoltrisBlur.
        /// </summary>
        public void SetVoltrisBlurActive(bool active)
        {
            _logger.LogInfo($"{TAG} SetVoltrisBlurActive({active}) — styleEnabled={_styleEnabled}");
            _voltrisBlurActive = active;
            // VoltrisBlur afeta apenas o Explorer (File Explorer), não a Taskbar.
            // Não resetar o accent da taskbar aqui — são features independentes.
        }

        // ══════════════════════════════════════════════════════════════════════════
        // Win32 P/Invoke
        // ══════════════════════════════════════════════════════════════════════════
        #region Win32

        [DllImport("user32.dll", CharSet = CharSet.Auto)]
        private static extern int GetClassName(IntPtr hWnd, StringBuilder lpClassName, int nMaxCount);

        [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
        private static extern IntPtr FindWindowEx(IntPtr parentHandle, IntPtr childAfter, string lclassName, string? windowTitle);

        [DllImport("user32.dll", SetLastError = true, CharSet = CharSet.Auto)]
        private static extern IntPtr FindWindow(string lpClassName, string? lpWindowName);

        [DllImport("user32.dll")]
        private static extern IntPtr GetParent(IntPtr hWnd);

        [DllImport("user32.dll", SetLastError = true)]
        private static extern bool SetWindowPos(IntPtr hWnd, IntPtr hWndInsertAfter,
            int X, int Y, int cx, int cy, uint uFlags);

        [DllImport("user32.dll")]
        private static extern int SetWindowCompositionAttribute(IntPtr hwnd, ref WindowCompositionAttributeData data);

        [DllImport("user32.dll")]
        private static extern bool SetLayeredWindowAttributes(IntPtr hwnd, uint crKey, byte bAlpha, uint dwFlags);

        [DllImport("user32.dll")]
        private static extern int SetWindowLong(IntPtr hWnd, int nIndex, int dwNewLong);

        [DllImport("user32.dll")]
        private static extern int GetWindowLong(IntPtr hWnd, int nIndex);

        [DllImport("user32.dll", SetLastError = true)]
        private static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);

        private delegate bool EnumChildProc(IntPtr hwnd, IntPtr lParam);
        [DllImport("user32.dll")]
        private static extern bool EnumChildWindows(IntPtr hWndParent, EnumChildProc lpEnumFunc, IntPtr lParam);

        private const uint SWP_NOSIZE         = 0x0001;
        private const uint SWP_NOZORDER       = 0x0004;
        private const uint SWP_NOACTIVATE     = 0x0010;
        private const uint SWP_ASYNCWINDOWPOS = 0x4000;
        private const uint SWP_NOSENDCHANGING = 0x0400;
        private const int  GWL_EXSTYLE        = -20;
        private const int  WS_EX_LAYERED      = 0x80000;

        private enum AccentState : int
        {
            ACCENT_DISABLED                   = 0,
            ACCENT_ENABLE_GRADIENT            = 1,
            ACCENT_ENABLE_TRANSPARENTGRADIENT = 2,
            ACCENT_ENABLE_BLURBEHIND          = 3,
            ACCENT_ENABLE_ACRYLICBLURBEHIND   = 4,
            ACCENT_ENABLE_TRANSPARENT         = 6,
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct AccentPolicy
        {
            public AccentState AccentState;
            public int AccentFlags;
            public int GradientColor;
            public int AnimationId;
        }

        private enum WindowCompositionAttribute { WCA_ACCENT_POLICY = 19 }

        [StructLayout(LayoutKind.Sequential)]
        private struct WindowCompositionAttributeData
        {
            public WindowCompositionAttribute Attribute;
            public IntPtr Data;
            public int SizeOfData;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct RECT { public int Left, Top, Right, Bottom; }

        #endregion

        // ─── Construtor ───────────────────────────────────────────────────────────
        public TaskbarControlService(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _logger.LogInfo($"{TAG} TaskbarControlService instanciado.");
        }

        // ══════════════════════════════════════════════════════════════════════════
        // API PÚBLICA
        // ══════════════════════════════════════════════════════════════════════════

        public void SetCentering(bool enable)
        {
            _logger.LogInfo($"{TAG} SetCentering({enable}) — styleEnabled={_styleEnabled}");
            _centeringEnabled = enable;
            if (enable)
            {
                // Forçar re-centralização mesmo que o estado não mude
                _forceRecenter = true;
                EnsureLoopRunning();
            }
            else
            {
                RevertTasklistToZero();
                StopLoopIfIdle();
            }
        }

        public void SetStyle(bool enable, TaskbarStyleMode mode = TaskbarStyleMode.Transparent,
            byte opacity = 255, int r = 0, int g = 0, int b = 0, int alpha = 0)
        {
            _logger.LogInfo($"{TAG} SetStyle(enable={enable} mode={mode} opacity={opacity} rgba={r},{g},{b},{alpha}) — centeringEnabled={_centeringEnabled}");
            bool modeChanged = _styleMode != mode || _opacity != opacity || _colorR != r || _colorG != g || _colorB != b || _colorAlpha != alpha || _styleEnabled != enable;
            _logger.LogDebug($"{TAG} [SetStyle] modeChanged={modeChanged} (prev: mode={_styleMode} opacity={_opacity})", source: "TaskbarCtrl");

            _styleEnabled = enable;
            _styleMode    = mode;
            _opacity      = opacity;
            _colorR = r; _colorG = g; _colorB = b; _colorAlpha = alpha;

            if (enable)
            {
                // CORREÇÃO: NÃO chamar ApplyStyleToAllTaskbars() aqui no UI thread.
                // Isso bloqueava o UI thread durante drag do slider (opacidade "travava").
                // Em vez disso, sinaliza _pendingStyleApply=true para o loop de background aplicar
                // imediatamente na próxima iteração (≤200ms de latência, sem travar a UI).
                _pendingStyleApply = true;
                _logger.LogDebug($"{TAG} [SetStyle] pendingStyleApply=true — loop de background vai aplicar.", source: "TaskbarCtrl");

                // Se centralização está ativa, forçar re-centralização após aplicar estilo
                if (_centeringEnabled)
                {
                    _logger.LogInfo($"{TAG} [SetStyle] Estilo com centralização ativa — forçando re-centralização.");
                    _forceRecenter = true;
                }
                EnsureLoopRunning();
            }
            else
            {
                // Desabilitar: aplicar reset em background também para não travar UI
                Task.Run(() => ResetStyleOnAllTaskbars());
                StopLoopIfIdle();
            }
        }

        public void StopAll()
        {
            _logger.LogInfo($"{TAG} StopAll()");
            _centeringEnabled = false;
            _styleEnabled     = false;
            RevertTasklistToZero();
            ResetStyleOnAllTaskbars();
            StopLoop();
        }

        // ══════════════════════════════════════════════════════════════════════════
        // LOOP DE MONITORAMENTO — idêntico ao Looper() do TaskbarX
        // ══════════════════════════════════════════════════════════════════════════

        private readonly object _loopLock = new object();

        private void EnsureLoopRunning()
        {
            lock (_loopLock)
            {
                if (_loopCts != null && !_loopCts.IsCancellationRequested)
                {
                    _logger.LogDebug($"{TAG} [Loop] Já ativo — nenhuma ação necessária.", source: "TaskbarCtrl");
                    return;
                }
                _logger.LogInfo($"{TAG} [Loop] Iniciando (intervalo={LoopRefreshRate}ms, centering={_centeringEnabled}, style={_styleEnabled}, voltrisBlur={_voltrisBlurActive}).");
                _loopCts = new CancellationTokenSource();
                var token = _loopCts.Token;
                Task.Run(() => MonitorLoop(token), token);
            }
        }

        private void StopLoop()
        {
            if (_loopCts != null)
            {
                _logger.LogInfo($"{TAG} [Loop] Parando.");
                _loopCts.Cancel();
                _loopCts.Dispose();
                _loopCts = null;
            }
        }

        private void StopLoopIfIdle()
        {
            if (!_centeringEnabled && !_styleEnabled) StopLoop();
        }

        private int _stateChangeRetryCount = 0;
        private const int StateChangeRetryMax  = 15;  // reaplica por ~3s após mudança de estado
        private const int StateChangeRetryMs   = 200; // intervalo entre reaplicações

        private async Task MonitorLoop(CancellationToken ct)
        {
            _logger.LogInfo($"{TAG} [Loop] ══ Thread INICIADA tid={Environment.CurrentManagedThreadId} centering={_centeringEnabled} style={_styleEnabled} voltrisBlur={_voltrisBlurActive} ══");
            string lastState = string.Empty;

            while (!ct.IsCancellationRequested)
            {
                try
                {
                    // ── Estilo nativo da taskbar ──────────────────────────────────
                    if (_styleEnabled)
                    {
                        bool pending = _pendingStyleApply;
                        if (pending)
                        {
                            _pendingStyleApply = false;
                            _logger.LogInfo($"{TAG} [Loop] pendingStyleApply=true — aplicando estilo mode={_styleMode} opacity={_opacity}.");
                            ApplyStyleToAllTaskbars();
                        }
                        else
                        {
                            _logger.LogDebug($"{TAG} [Loop] Estilo ativo, sem mudança pendente (mode={_styleMode} opacity={_opacity}).", source: "TaskbarCtrl");
                        }
                    }

                    // ── Centralização ─────────────────────────────────────────────
                    if (_centeringEnabled)
                    {
                        bool forced = _forceRecenter;
                        if (forced)
                        {
                            _forceRecenter = false;
                            _logger.LogInfo($"{TAG} [Loop] 🔄 Re-centralização FORÇADA (forceRecenter=true).");
                        }

                        string currentState = BuildStateString();
                        bool stateChanged = currentState != lastState && !string.IsNullOrEmpty(currentState);

                        if (stateChanged)
                        {
                            _logger.LogInfo($"{TAG} [Loop] 📐 Estado MUDOU: '{lastState}' → '{currentState}' — aguardando 300ms para layout estabilizar...");
                            lastState = currentState;
                            await Task.Delay(300, ct);

                            // Re-ler estado APÓS o delay — o Windows pode ter feito mais mudanças
                            string stateAfterDelay = BuildStateString();
                            if (stateAfterDelay != lastState && !string.IsNullOrEmpty(stateAfterDelay))
                            {
                                _logger.LogInfo($"{TAG} [Loop] 📐 Estado mudou DURANTE delay: '{lastState}' → '{stateAfterDelay}' — atualizando.");
                                lastState = stateAfterDelay;
                            }

                            _stateChangeRetryCount = StateChangeRetryMax;
                            _logger.LogInfo($"{TAG} [Loop] Iniciando {StateChangeRetryMax} reaplicações após mudança. Estado final: '{lastState}'");
                        }

                        // CORREÇÃO DEFINITIVA: verificar posição atual do TaskList a cada ciclo.
                        // Quando Notícias/Pesquisa é desativado, o Windows reposiciona o MSTaskListWClass
                        // para a posição 0 (esquerda) sem mudar o estado (tamanhos permanecem iguais).
                        // Detectar isso comparando a posição atual com a posição esperada (centralizada).
                        bool positionDrifted = false;
                        if (!forced && !stateChanged && _stateChangeRetryCount <= 0)
                        {
                            positionDrifted = IsTaskListPositionDrifted();
                            if (positionDrifted)
                            {
                                _logger.LogInfo($"{TAG} [Loop] 🎯 Posição do TaskList DESVIOU (Windows reposicionou) — recentralizando. state='{currentState}'");
                                _stateChangeRetryCount = StateChangeRetryMax;
                            }
                        }

                        if (forced || stateChanged || positionDrifted || _stateChangeRetryCount > 0)
                        {
                            if (_stateChangeRetryCount > 0)
                            {
                                _stateChangeRetryCount--;
                                _logger.LogInfo($"{TAG} [Loop] ▶ Centralizando (retry={_stateChangeRetryCount}/{StateChangeRetryMax}) forced={forced} drifted={positionDrifted} state='{lastState}'");
                            }
                            else
                            {
                                _logger.LogInfo($"{TAG} [Loop] ▶ Centralizando — forced={forced} drifted={positionDrifted} state='{lastState}'");
                            }

                            CenterAllTaskbars();

                            // Verificar se o estado mudou DURANTE a centralização
                            string stateAfterCenter = BuildStateString();
                            if (stateAfterCenter != lastState && !string.IsNullOrEmpty(stateAfterCenter))
                            {
                                _logger.LogInfo($"{TAG} [Loop] 📐 Estado mudou DURANTE centralização: '{lastState}' → '{stateAfterCenter}' — reiniciando reaplicações.");
                                lastState = stateAfterCenter;
                                if (_stateChangeRetryCount < StateChangeRetryMax)
                                    _stateChangeRetryCount = StateChangeRetryMax;
                            }
                        }
                        else
                        {
                            _logger.LogDebug($"{TAG} [Loop] state='{currentState}' pos=ok (sem mudança, retry={_stateChangeRetryCount})", source: "TaskbarCtrl");
                        }
                    }

                    await Task.Delay(LoopRefreshRate, ct);
                }
                catch (OperationCanceledException) { break; }
                catch (Exception ex)
                {
                    _logger.LogWarning($"{TAG} [Loop] Erro: {ex.Message}");
                    try { await Task.Delay(1000, ct); } catch { break; }
                }
            }
            _logger.LogInfo($"{TAG} [Loop] ══ Thread ENCERRADA tid={Environment.CurrentManagedThreadId} ══");
        }

        // ══════════════════════════════════════════════════════════════════════════
        // IsTaskListPositionDrifted — verifica se o TaskList foi reposicionado pelo Windows
        //
        // Quando Notícias/Pesquisa é desativado, o Windows move o MSTaskListWClass para
        // a posição 0 (esquerda) sem mudar os tamanhos. Isso não é detectado pelo estado.
        // Este método compara a posição atual com a posição centralizada esperada.
        // Retorna true se a diferença for > 5px (tolerância para pequenas variações).
        // ══════════════════════════════════════════════════════════════════════════
        private bool IsTaskListPositionDrifted()
        {
            try
            {
                foreach (var info in GetAllTaskbarInfos())
                {
                    if (!info.Valid) continue;

                    GetWindowRect(info.TrayWnd,      out var trayRect);
                    GetWindowRect(info.RebarHwnd,    out var rebarRect);
                    GetWindowRect(info.TaskListHwnd, out var taskListRect);

                    int tlW = taskListRect.Right  - taskListRect.Left;
                    int tlH = taskListRect.Bottom - taskListRect.Top;
                    string orient = info.Orientation;

                    int iconsWidth = GetTaskbarIconsWidth(info.TaskListHwnd, orient);
                    bool usedAccessible = iconsWidth > 0;
                    int taskbarWidth = usedAccessible ? iconsWidth : (orient == "H" ? tlW : tlH);

                    int trayWndLeft, trayWndWidth, rebarWndLeft, taskbarLeft, expectedPos, currentPos;
                    if (orient == "H")
                    {
                        trayWndLeft  = Math.Abs(trayRect.Left);
                        trayWndWidth = Math.Abs(trayRect.Right - trayRect.Left);
                        rebarWndLeft = Math.Abs(rebarRect.Left);
                        taskbarLeft  = Math.Abs(rebarWndLeft - trayWndLeft);
                        expectedPos  = Math.Abs((trayWndWidth / 2) - (taskbarWidth / 2) - taskbarLeft);
                        currentPos   = taskListRect.Left - rebarRect.Left;
                    }
                    else
                    {
                        trayWndLeft  = Math.Abs(trayRect.Top);
                        trayWndWidth = Math.Abs(trayRect.Bottom - trayRect.Top);
                        rebarWndLeft = Math.Abs(rebarRect.Top);
                        taskbarLeft  = Math.Abs(rebarWndLeft - trayWndLeft);
                        expectedPos  = Math.Abs((trayWndWidth / 2) - (taskbarWidth / 2) - taskbarLeft);
                        currentPos   = taskListRect.Top - rebarRect.Top;
                    }

                    int diff = Math.Abs(expectedPos - currentPos);
                    _logger.LogDebug($"{TAG} [DriftCheck] orient={orient} expectedPos={expectedPos} currentPos={currentPos} diff={diff}px", source: "TaskbarCtrl");

                    if (diff > 5) // tolerância de 5px
                    {
                        _logger.LogInfo($"{TAG} [DriftCheck] ⚠️ Desvio detectado: expectedPos={expectedPos} currentPos={currentPos} diff={diff}px");
                        return true;
                    }
                }
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogDebug($"{TAG} [DriftCheck] Exceção: {ex.Message}", source: "TaskbarCtrl");
                return false;
            }
        }



        private string BuildStateString()
        {
            var sb = new StringBuilder();
            foreach (var info in GetAllTaskbarInfos())
            {
                if (!info.Valid) continue;

                GetWindowRect(info.TrayWnd,      out var trayRect);
                GetWindowRect(info.RebarHwnd,    out var rebarRect);
                GetWindowRect(info.TaskListHwnd, out var taskListRect);

                int trayW = trayRect.Right  - trayRect.Left;
                int trayH = trayRect.Bottom - trayRect.Top;
                int tlW   = taskListRect.Right  - taskListRect.Left;
                int tlH   = taskListRect.Bottom - taskListRect.Top;

                string orient = (tlH >= tlW && tlH > 0) ? "V" : "H";

                // Usar IAccessible para medir ícones reais (mais preciso para detectar mudanças)
                int iconsSize = GetTaskbarIconsWidth(info.TaskListHwnd, orient);
                if (iconsSize <= 0)
                {
                    iconsSize = orient == "H" ? tlW : tlH;
                    _logger.LogDebug($"{TAG} [State] IAccessible falhou — usando GetWindowRect fallback iconsSize={iconsSize}", source: "TaskbarCtrl");
                }

                int traySize = orient == "H" ? trayW : trayH;

                // CORREÇÃO: incluir rebarOffset E rebarWidth no estado monitorado.
                // Quando o usuário desliga "Notícias e interesses" ou a barra de pesquisa,
                // o Windows redimensiona o ReBarWindow32 — o offset OU o tamanho do rebar muda.
                // Sem isso no estado, o loop não detecta a mudança e não recentraliza.
                int rebarOffset, rebarSize;
                if (orient == "H")
                {
                    rebarOffset = rebarRect.Left - trayRect.Left;
                    rebarSize   = rebarRect.Right - rebarRect.Left;
                }
                else
                {
                    rebarOffset = rebarRect.Top - trayRect.Top;
                    rebarSize   = rebarRect.Bottom - rebarRect.Top;
                }

                _logger.LogDebug(
                    $"{TAG} [State] tray={info.TrayWnd} orient={orient} iconsSize={iconsSize} traySize={traySize} rebarOffset={rebarOffset} rebarSize={rebarSize}",
                    source: "TaskbarCtrl");

                sb.Append($"{orient}{iconsSize}{traySize}R{rebarOffset}S{rebarSize}");
            }
            return sb.ToString();
        }

        // ══════════════════════════════════════════════════════════════════════════
        // CenterAllTaskbars — algoritmo EXATO do TaskbarX PositionCalculator
        //
        // CORREÇÃO DEFINITIVA: O TaskbarX usa IAccessible para medir a largura REAL
        // dos ícones (LastChildPos.left - TaskListPos.left). Sem isso, taskbarWidth
        // é a largura total do MSTaskListWClass (área reservada), não os ícones reais,
        // causando centralização incorreta.
        //
        // Algoritmo (TaskbarCenter.vb PositionCalculator):
        //   TaskbarWidth = LastChildPos.left - TaskListPos.left  (via IAccessible)
        //   TrayWndLeft  = Abs(TrayWndPos.left)
        //   TrayWndWidth = Abs(TrayWndPos.width)
        //   RebarWndLeft = Abs(RebarPos.left)
        //   TaskbarLeft  = Abs(RebarWndLeft - TrayWndLeft)
        //   Position     = Abs((TrayWndWidth/2) - (TaskbarWidth/2) - TaskbarLeft)
        // ══════════════════════════════════════════════════════════════════════════

        // IAccessible via COM — necessário para medir largura real dos ícones
        [DllImport("oleacc.dll")]
        private static extern int AccessibleObjectFromWindow(
            IntPtr hwnd, uint dwId, ref Guid riid, [MarshalAs(UnmanagedType.IUnknown)] out object ppvObject);

        private static readonly Guid IID_IAccessible = new Guid("618736E0-3C3D-11CF-810C-00AA00389B71");
        private const uint OBJID_CLIENT = 0xFFFFFFFC;
        private const uint OBJID_WINDOW = 0x00000000;

        /// <summary>
        /// Obtém a largura real dos ícones na taskbar via IAccessible.
        /// Usa get_accChild() para cada filho (abordagem correta — GetAccessibleChildren
        /// retorna child IDs como int, não IAccessible objects, causando iconsWidth=-1).
        /// Retorna -1 se não conseguir (fallback para GetWindowRect).
        /// </summary>
        private int GetTaskbarIconsWidth(IntPtr taskListHwnd, string orient)
        {
            try
            {
                object? accObj = null;
                var guid = IID_IAccessible;
                // OBJID_CLIENT é o correto para MSTaskListWClass
                int hr = AccessibleObjectFromWindow(taskListHwnd, OBJID_CLIENT, ref guid, out accObj!);
                if (hr != 0 || accObj == null)
                {
                    _logger.LogDebug($"{TAG} [IAccessible] AccessibleObjectFromWindow hr=0x{hr:X} — fallback", source: "TaskbarCtrl");
                    return -1;
                }

                var taskListAcc = (IAccessible)accObj;

                // Posição da TaskList (origem) — accLocation com childId=0 = self
                taskListAcc.accLocation(out int tlLeft, out int tlTop, out int tlW, out int tlH, 0);
                _logger.LogDebug($"{TAG} [IAccessible] TaskList accLocation: left={tlLeft} top={tlTop} w={tlW} h={tlH}", source: "TaskbarCtrl");

                int childCount = taskListAcc.accChildCount;
                _logger.LogDebug($"{TAG} [IAccessible] TaskList childCount={childCount}", source: "TaskbarCtrl");
                if (childCount <= 0) return -1;

                // Iterar filhos via get_accChild(childId) — childId começa em 1
                // Procurar o filho com role=TOOLBAR (22 = 0x16)
                IAccessible? toolbar = null;
                for (int i = 1; i <= childCount; i++)
                {
                    try
                    {
                        object childId = i;
                        object? childObj = taskListAcc.get_accChild(childId);
                        if (childObj is IAccessible childAcc)
                        {
                            object roleObj = childAcc.get_accRole(0);
                            int role = roleObj is int ri ? ri : (roleObj != null ? Convert.ToInt32(roleObj) : 0);
                            _logger.LogDebug($"{TAG} [IAccessible] Filho [{i}] role={role}", source: "TaskbarCtrl");
                            if (role == 22) // ROLE_SYSTEM_TOOLBAR
                            {
                                toolbar = childAcc;
                                _logger.LogDebug($"{TAG} [IAccessible] Toolbar encontrado no filho [{i}]", source: "TaskbarCtrl");
                                break;
                            }
                        }
                        else
                        {
                            _logger.LogDebug($"{TAG} [IAccessible] Filho [{i}] não é IAccessible (tipo={childObj?.GetType().Name ?? "null"})", source: "TaskbarCtrl");
                        }
                    }
                    catch (Exception ex) { _logger.LogDebug($"{TAG} [IAccessible] Filho [{i}] exceção: {ex.Message}", source: "TaskbarCtrl"); }
                }

                if (toolbar == null)
                {
                    // Fallback: a própria TaskList pode ser o toolbar
                    object roleObj2 = taskListAcc.get_accRole(0);
                    int role2 = roleObj2 is int ri2 ? ri2 : (roleObj2 != null ? Convert.ToInt32(roleObj2) : 0);
                    _logger.LogDebug($"{TAG} [IAccessible] Fallback: TaskList role={role2}", source: "TaskbarCtrl");
                    if (role2 == 22) toolbar = taskListAcc;
                }

                if (toolbar == null)
                {
                    _logger.LogDebug($"{TAG} [IAccessible] Toolbar não encontrado entre {childCount} filhos — retornando -1", source: "TaskbarCtrl");
                    return -1;
                }

                // Contar ícones no toolbar e pegar posição do último
                int tbChildCount = toolbar.accChildCount;
                _logger.LogDebug($"{TAG} [IAccessible] Toolbar childCount={tbChildCount}", source: "TaskbarCtrl");
                if (tbChildCount <= 0) return -1;

                // Pegar posição do último ícone (childId = tbChildCount)
                int lastLeft = tlLeft, lastTop = tlTop, lastW = 0, lastH = 0;
                bool foundLast = false;

                // Iterar de trás para frente para achar o último ícone visível
                for (int i = tbChildCount; i >= 1; i--)
                {
                    try
                    {
                        object childId = i;
                        object? childObj = toolbar.get_accChild(childId);
                        if (childObj is IAccessible iconAcc)
                        {
                            iconAcc.accLocation(out int iLeft, out int iTop, out int iW, out int iH, 0);
                            _logger.LogDebug($"{TAG} [IAccessible] Ícone [{i}]: left={iLeft} top={iTop} w={iW} h={iH}", source: "TaskbarCtrl");
                            if (iW > 0 || iH > 0)
                            {
                                lastLeft = iLeft; lastTop = iTop; lastW = iW; lastH = iH;
                                foundLast = true;
                                _logger.LogDebug($"{TAG} [IAccessible] ✅ Último ícone visível [{i}]: left={iLeft} top={iTop} w={iW} h={iH}", source: "TaskbarCtrl");
                                break;
                            }
                        }
                        else
                        {
                            // get_accChild retornou null ou int — usar accLocation diretamente com childId no toolbar
                            // (comportamento padrão no Win10 onde filhos são child IDs simples, não objetos IAccessible)
                            int directId = childObj is int cid ? cid : i;
                            toolbar.accLocation(out int iLeft, out int iTop, out int iW, out int iH, directId);
                            _logger.LogDebug($"{TAG} [IAccessible] Ícone [{i}] (directId={directId}): left={iLeft} top={iTop} w={iW} h={iH}", source: "TaskbarCtrl");
                            if (iW > 0 || iH > 0)
                            {
                                lastLeft = iLeft; lastTop = iTop; lastW = iW; lastH = iH;
                                foundLast = true;
                                _logger.LogDebug($"{TAG} [IAccessible] ✅ Último ícone visível [{i}] (directId={directId}): left={iLeft} top={iTop} w={iW} h={iH}", source: "TaskbarCtrl");
                                break;
                            }
                        }
                    }
                    catch (Exception ex) { _logger.LogDebug($"{TAG} [IAccessible] Ícone [{i}] exceção: {ex.Message}", source: "TaskbarCtrl"); }
                }

                if (!foundLast)
                {
                    _logger.LogDebug($"{TAG} [IAccessible] Nenhum ícone visível encontrado no toolbar ({tbChildCount} filhos) — retornando -1", source: "TaskbarCtrl");
                    return -1;
                }

                // Largura real = (posição do último ícone + largura) - posição da TaskList
                // Exatamente como o TaskbarX: TaskbarWidth = LastChildPos.left - TaskListPos.left
                // (TaskbarX usa .left do último filho, não .left+.width)
                int width = orient == "H"
                    ? Math.Max(0, lastLeft - tlLeft)
                    : Math.Max(0, lastTop - tlTop);

                _logger.LogDebug($"{TAG} [IAccessible] iconsWidth={width} (lastLeft={lastLeft} tlLeft={tlLeft})", source: "TaskbarCtrl");
                return width > 0 ? width : -1;
            }
            catch (Exception ex)
            {
                _logger.LogDebug($"{TAG} [IAccessible] Exceção: {ex.Message}", source: "TaskbarCtrl");
                return -1;
            }
        }

        private void CenterAllTaskbars()
        {
            _logger.LogDebug($"{TAG} [Center] Iniciando PositionCalculator...", source: "TaskbarCtrl");

            foreach (var info in GetAllTaskbarInfos())
            {
                try
                {
                    if (!info.Valid)
                    {
                        _logger.LogWarning($"{TAG} [Center] Info inválido — pulando.");
                        continue;
                    }

                    // ── GetWindowRect de todos os handles ──────────────────────────
                    bool ok1 = GetWindowRect(info.TrayWnd,      out var trayRect);
                    bool ok2 = GetWindowRect(info.RebarHwnd,    out var rebarRect);
                    bool ok3 = GetWindowRect(info.TaskListHwnd, out var taskListRect);

                    _logger.LogDebug(
                        $"{TAG} [Center] GetWindowRect ok=({ok1},{ok2},{ok3})",
                        source: "TaskbarCtrl");

                    int tlW = taskListRect.Right  - taskListRect.Left;
                    int tlH = taskListRect.Bottom - taskListRect.Top;

                    string orient = info.Orientation;

                    // ── Largura REAL dos ícones via IAccessible (como o TaskbarX faz) ──
                    // Se IAccessible falhar, usa GetWindowRect como fallback
                    int iconsWidth = GetTaskbarIconsWidth(info.TaskListHwnd, orient);
                    bool usedAccessible = iconsWidth > 0;
                    int taskbarWidth = usedAccessible ? iconsWidth : (orient == "H" ? tlW : tlH);

                    _logger.LogDebug(
                        $"{TAG} [Center] iconsWidth={iconsWidth} (IAccessible={usedAccessible}) taskbarWidth={taskbarWidth}",
                        source: "TaskbarCtrl");

                    // ── Cálculo idêntico ao TaskbarX PositionCalculator ────────────
                    int trayWndLeft, trayWndWidth, rebarWndLeft, taskbarLeft, position, currentPos;

                    if (orient == "H")
                    {
                        trayWndLeft  = Math.Abs(trayRect.Left);
                        trayWndWidth = Math.Abs(trayRect.Right - trayRect.Left);
                        rebarWndLeft = Math.Abs(rebarRect.Left);
                        taskbarLeft  = Math.Abs(rebarWndLeft - trayWndLeft);
                        position     = Math.Abs((trayWndWidth / 2) - (taskbarWidth / 2) - taskbarLeft);
                        currentPos   = taskListRect.Left - rebarRect.Left;
                    }
                    else // V
                    {
                        trayWndLeft  = Math.Abs(trayRect.Top);
                        trayWndWidth = Math.Abs(trayRect.Bottom - trayRect.Top);
                        rebarWndLeft = Math.Abs(rebarRect.Top);
                        taskbarLeft  = Math.Abs(rebarWndLeft - trayWndLeft);
                        position     = Math.Abs((trayWndWidth / 2) - (taskbarWidth / 2) - taskbarLeft);
                        currentPos   = taskListRect.Top - rebarRect.Top;
                    }

                    _logger.LogInfo(
                        $"{TAG} [Center] orient={orient} trayW={trayWndWidth} taskW={taskbarWidth} rebarOff={taskbarLeft} currentPos={currentPos} → newPos={position}");

                    // Evita mover se já estiver na posição correta (diff ≤ 2px)
                    // NOTA: durante reaplicações (_stateChangeRetryCount > 0) NÃO pular mesmo se diff≤2px
                    // porque o Windows pode ter sobrescrito nossa posição com valor próximo mas errado
                    if (_stateChangeRetryCount <= 0 && Math.Abs(position - currentPos) <= 2)
                    {
                        _logger.LogDebug($"{TAG} [Center] Já centralizado (diff≤2px). Sem movimento.", source: "TaskbarCtrl");
                        continue;
                    }

                    _logger.LogInfo($"{TAG} [Center] Movendo: currentPos={currentPos} → newPos={position} diff={position - currentPos}px (retry={_stateChangeRetryCount})");

                    // ── SetWindowPos — síncrono (sem SWP_ASYNCWINDOWPOS) para garantir que o move
                    // acontece ANTES do próximo layout do Explorer sobrescrever a posição.
                    // SWP_ASYNCWINDOWPOS causava race condition: Explorer sobrescrevia nossa posição
                    // porque o move era enfileirado e processado depois do layout do widget removido.
                    bool swpOk;
                    if (orient == "H")
                        swpOk = SetWindowPos(info.TaskListHwnd, IntPtr.Zero, position, 0, 0, 0,
                            SWP_NOSIZE | SWP_NOACTIVATE | SWP_NOZORDER | SWP_NOSENDCHANGING);
                    else
                        swpOk = SetWindowPos(info.TaskListHwnd, IntPtr.Zero, 0, position, 0, 0,
                            SWP_NOSIZE | SWP_NOACTIVATE | SWP_NOZORDER | SWP_NOSENDCHANGING);

                    int err = Marshal.GetLastWin32Error();

                    // Verificar posição real após o move (confirma se o Windows aceitou)
                    GetWindowRect(info.TaskListHwnd, out var taskListAfter);
                    int posAfter = orient == "H"
                        ? taskListAfter.Left - rebarRect.Left
                        : taskListAfter.Top  - rebarRect.Top;

                    if (swpOk)
                        _logger.LogInfo($"{TAG} [Center] ✅ TaskList movida para pos={position} | posReal={posAfter} (orient={orient})");
                    else
                        _logger.LogWarning($"{TAG} [Center] ❌ SetWindowPos FALHOU err=0x{err:X} hwnd={info.TaskListHwnd} posReal={posAfter}");
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"{TAG} [Center] Exceção: {ex.GetType().Name}: {ex.Message}\n{ex.StackTrace}");
                }
            }
        }

        // ══════════════════════════════════════════════════════════════════════════
        // RevertToZero — idêntico ao RevertToZero() do TaskbarX
        // ══════════════════════════════════════════════════════════════════════════

        private void RevertTasklistToZero()
        {
            _logger.LogInfo($"{TAG} [Revert] Revertendo taskList para posição 0.");
            foreach (var info in GetAllTaskbarInfos())
            {
                try
                {
                    if (!info.Valid) continue;
                    bool ok = SetWindowPos(info.TaskListHwnd, IntPtr.Zero, 0, 0, 0, 0,
                        SWP_NOSIZE | SWP_NOACTIVATE | SWP_NOZORDER | SWP_NOSENDCHANGING);
                    _logger.LogDebug($"{TAG} [Revert] hwnd={info.TaskListHwnd} ok={ok}", source: "TaskbarCtrl");
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"{TAG} [Revert] Erro: {ex.Message}");
                }
            }
        }

        // ══════════════════════════════════════════════════════════════════════════
        // ESTILO (Transparência / Blur / Acrílico)
        // ══════════════════════════════════════════════════════════════════════════

        private void ApplyStyleToAllTaskbars()
        {
            // ══════════════════════════════════════════════════════════════════════
            // GradientColor formato ABGR (little-endian): bytes [R, G, B, A]
            //
            // Como o slider de opacidade funciona em cada modo (Win10):
            //
            // Transparent (ACCENT_ENABLE_TRANSPARENTGRADIENT):
            //   alpha=0   → totalmente transparente (sem cor)
            //   alpha=255 → cor sólida (preta por padrão)
            //   → slider controla diretamente o alpha
            //
            // Blur (ACCENT_ENABLE_BLURBEHIND):
            //   alpha=0   → blur puro (sem sobreposição de cor) — efeito máximo visível
            //   alpha=255 → blur coberto por cor sólida — efeito mínimo visível
            //   → slider INVERTIDO: opacity=255 → alpha=0 (blur puro), opacity=0 → alpha=255 (cor sólida)
            //   Isso faz o slider funcionar intuitivamente: mais opacidade = mais blur visível
            //
            // Acrylic (ACCENT_ENABLE_ACRYLICBLURBEHIND):
            //   alpha=0   → acrílico transparente
            //   alpha=255 → acrílico opaco
            //   → slider direto
            //
            // Gradient (ACCENT_ENABLE_GRADIENT):
            //   alpha=0   → gradiente transparente
            //   alpha=255 → gradiente opaco
            //   → slider direto
            // ══════════════════════════════════════════════════════════════════════

            int bgAlpha;
            int colorR = _colorR, colorG = _colorG, colorB = _colorB;
            AccentState accentState;
            int accentFlags;

            switch (_styleMode)
            {
                case TaskbarStyleMode.Transparent:
                    bgAlpha     = Math.Clamp((int)_opacity, 0, 255);
                    colorR = 0; colorG = 0; colorB = 0;
                    accentState = AccentState.ACCENT_ENABLE_TRANSPARENTGRADIENT;
                    accentFlags = 0;
                    break;

                case TaskbarStyleMode.Blur:
                    // INVERTIDO: opacity=255 → alpha=0 (blur puro, máximo visível)
                    //            opacity=0   → alpha=255 (cor sólida cobrindo o blur)
                    // Isso faz o slider funcionar de forma intuitiva no Win10
                    bgAlpha     = 255 - Math.Clamp((int)_opacity, 0, 255);
                    colorR = 0; colorG = 0; colorB = 0;
                    accentState = AccentState.ACCENT_ENABLE_BLURBEHIND;
                    accentFlags = 0;
                    break;

                case TaskbarStyleMode.Acrylic:
                    bgAlpha     = Math.Clamp((int)_opacity, 0, 255);
                    accentState = AccentState.ACCENT_ENABLE_ACRYLICBLURBEHIND;
                    accentFlags = 2;
                    break;

                case TaskbarStyleMode.Gradient:
                    bgAlpha     = Math.Clamp((int)_opacity, 0, 255);
                    accentState = AccentState.ACCENT_ENABLE_GRADIENT;
                    accentFlags = 2;
                    break;

                default:
                    bgAlpha = 0; colorR = 0; colorG = 0; colorB = 0;
                    accentState = AccentState.ACCENT_ENABLE_TRANSPARENT;
                    accentFlags = 0;
                    break;
            }

            // GradientColor: little-endian ABGR → bytes [R, G, B, A]
            int gradientColor = BitConverter.ToInt32(new byte[]
            {
                (byte)colorR,
                (byte)colorG,
                (byte)colorB,
                (byte)bgAlpha
            }, 0);

            _logger.LogInfo($"{TAG} [Style] mode={_styleMode} accentState={accentState} opacity={_opacity} accentFlags={accentFlags} bgAlpha={bgAlpha} rgb=({colorR},{colorG},{colorB}) gradientColor=0x{gradientColor:X8}");

            var accent = new AccentPolicy
            {
                AccentState   = accentState,
                AccentFlags   = accentFlags,
                GradientColor = gradientColor,
                AnimationId   = 0,
            };

            int sz = Marshal.SizeOf<AccentPolicy>();
            IntPtr ptr = Marshal.AllocHGlobal(sz);
            try
            {
                Marshal.StructureToPtr(accent, ptr, false);
                var data = new WindowCompositionAttributeData
                {
                    Attribute  = WindowCompositionAttribute.WCA_ACCENT_POLICY,
                    SizeOfData = sz,
                    Data       = ptr
                };

                foreach (var trayWnd in GetAllTrayHandles())
                {
                    try
                    {
                        // Remover WS_EX_LAYERED se presente — interfere com SetWindowCompositionAttribute
                        int exStyle = GetWindowLong(trayWnd, GWL_EXSTYLE);
                        bool hadLayered = (exStyle & WS_EX_LAYERED) != 0;
                        if (hadLayered)
                        {
                            SetWindowLong(trayWnd, GWL_EXSTYLE, exStyle & ~WS_EX_LAYERED);
                            _logger.LogDebug($"{TAG} [Style] hwnd={trayWnd} WS_EX_LAYERED removido (exStyle=0x{exStyle:X})", source: "TaskbarCtrl");
                        }

                        int res = SetWindowCompositionAttribute(trayWnd, ref data);
                        _logger.LogDebug($"{TAG} [Style] hwnd={trayWnd} accent={accent.AccentState} flags={accentFlags} bgAlpha={bgAlpha} hadLayered={hadLayered} result={res}", source: "TaskbarCtrl");

                        if (res == 0)
                            _logger.LogWarning($"{TAG} [Style] ⚠️ SetWindowCompositionAttribute retornou 0 para hwnd={trayWnd} — efeito pode não ter sido aplicado");
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"{TAG} [Style] Erro hwnd={trayWnd}: {ex.Message}");
                    }
                }
            }
            finally { Marshal.FreeHGlobal(ptr); }
        }

        private void ResetStyleOnAllTaskbars()
        {
            _logger.LogInfo($"{TAG} [Style] Restaurando ACCENT_DISABLED em todas as taskbars.");
            var accent = new AccentPolicy { AccentState = AccentState.ACCENT_DISABLED };
            int sz  = Marshal.SizeOf<AccentPolicy>();
            IntPtr ptr = Marshal.AllocHGlobal(sz);
            try
            {
                Marshal.StructureToPtr(accent, ptr, false);
                var data = new WindowCompositionAttributeData
                {
                    Attribute  = WindowCompositionAttribute.WCA_ACCENT_POLICY,
                    SizeOfData = sz,
                    Data       = ptr
                };
                foreach (var trayWnd in GetAllTrayHandles())
                {
                    try
                    {
                        int exStyle = GetWindowLong(trayWnd, GWL_EXSTYLE);
                        if ((exStyle & WS_EX_LAYERED) != 0)
                        {
                            SetWindowLong(trayWnd, GWL_EXSTYLE, exStyle & ~WS_EX_LAYERED);
                            _logger.LogDebug($"{TAG} [Style] Reset hwnd={trayWnd} WS_EX_LAYERED removido", source: "TaskbarCtrl");
                        }

                        int res = SetWindowCompositionAttribute(trayWnd, ref data);
                        _logger.LogDebug($"{TAG} [Style] Reset hwnd={trayWnd} ACCENT_DISABLED result={res}", source: "TaskbarCtrl");
                    }
                    catch (Exception ex) { _logger.LogWarning($"{TAG} [Style] Erro reset hwnd={trayWnd}: {ex.Message}"); }
                }
            }
            finally { Marshal.FreeHGlobal(ptr); }
        }

        private static AccentState MapStyleMode(TaskbarStyleMode mode) => mode switch
        {
            TaskbarStyleMode.Transparent => AccentState.ACCENT_ENABLE_TRANSPARENT,
            TaskbarStyleMode.Blur        => AccentState.ACCENT_ENABLE_BLURBEHIND,
            TaskbarStyleMode.Acrylic     => AccentState.ACCENT_ENABLE_ACRYLICBLURBEHIND,
            TaskbarStyleMode.Gradient    => AccentState.ACCENT_ENABLE_GRADIENT,
            _                            => AccentState.ACCENT_ENABLE_TRANSPARENT,
        };

        // ══════════════════════════════════════════════════════════════════════════
        // HELPERS — localizar handles da taskbar
        // ══════════════════════════════════════════════════════════════════════════

        private record struct TaskbarInfo(
            bool    Valid,
            IntPtr  TrayWnd,
            IntPtr  RebarHwnd,
            IntPtr  SwHwnd,
            IntPtr  TaskListHwnd,
            string  Orientation);

        private List<IntPtr> GetAllTrayHandles()
        {
            var list = new List<IntPtr>();
            IntPtr main = FindWindow("Shell_TrayWnd", null);
            if (main != IntPtr.Zero) list.Add(main);
            IntPtr sec  = FindWindow("Shell_SecondaryTrayWnd", null);
            if (sec  != IntPtr.Zero) list.Add(sec);
            return list;
        }

        private List<TaskbarInfo> GetAllTaskbarInfos()
        {
            var infos = new List<TaskbarInfo>();
            foreach (var tray in GetAllTrayHandles())
                infos.Add(GetTaskbarInfo(tray));
            return infos;
        }

        /// <summary>
        /// Resolve todos os handles necessários para uma taskbar.
        /// Suporta hierarquia clássica (Win10) e fallback via EnumChildWindows (Win11).
        /// </summary>
        private TaskbarInfo GetTaskbarInfo(IntPtr trayWnd)
        {
            var sb = new StringBuilder(256);
            GetClassName(trayWnd, sb, 256);
            string cls = sb.ToString();

            IntPtr rebarHwnd    = IntPtr.Zero;
            IntPtr swHwnd       = IntPtr.Zero;
            IntPtr taskListHwnd = IntPtr.Zero;

            if (cls == "Shell_TrayWnd")
            {
                // Hierarquia CLÁSSICA: Shell_TrayWnd → ReBarWindow32 → MSTaskSwWClass → MSTaskListWClass
                rebarHwnd    = FindWindowEx(trayWnd,   IntPtr.Zero, "ReBarWindow32",   null);
                swHwnd       = FindWindowEx(rebarHwnd, IntPtr.Zero, "MSTaskSwWClass",   null);
                taskListHwnd = FindWindowEx(swHwnd,    IntPtr.Zero, "MSTaskListWClass", null);

                _logger.LogDebug(
                    $"{TAG} [GetInfo] Primary: tray={trayWnd} rebar={rebarHwnd} sw={swHwnd} taskList={taskListHwnd}",
                    source: "TaskbarCtrl");

                // Fallback Win11: enumeração recursiva de filhos
                if (taskListHwnd == IntPtr.Zero)
                {
                    _logger.LogWarning($"{TAG} [GetInfo] MSTaskListWClass não encontrado via FindWindowEx — EnumChildWindows fallback...");
                    taskListHwnd = FindChildByClass(trayWnd, "MSTaskListWClass");
                    if (taskListHwnd != IntPtr.Zero)
                    {
                        swHwnd    = GetParent(taskListHwnd);
                        rebarHwnd = GetParent(swHwnd);
                        _logger.LogInfo($"{TAG} [GetInfo] MSTaskListWClass encontrado via fallback: {taskListHwnd}");
                    }
                }
            }
            else if (cls == "Shell_SecondaryTrayWnd")
            {
                IntPtr worker = FindWindowEx(trayWnd, IntPtr.Zero, "WorkerW", null);
                taskListHwnd  = FindWindowEx(worker,  IntPtr.Zero, "MSTaskListWClass", null);
                rebarHwnd     = worker;
                swHwnd        = worker;

                _logger.LogDebug(
                    $"{TAG} [GetInfo] Secondary: tray={trayWnd} worker={worker} taskList={taskListHwnd}",
                    source: "TaskbarCtrl");

                if (taskListHwnd == IntPtr.Zero)
                    taskListHwnd = FindChildByClass(trayWnd, "MSTaskListWClass");
            }

            if (taskListHwnd == IntPtr.Zero)
            {
                _logger.LogWarning($"{TAG} [GetInfo] ❌ MSTaskListWClass NÃO encontrado para {cls} (hwnd={trayWnd}).");
                return new TaskbarInfo(false, trayWnd, IntPtr.Zero, IntPtr.Zero, IntPtr.Zero, "H");
            }

            // Orientação via GetWindowRect — idêntico ao TaskbarX: if tH >= tW → V else H
            GetWindowRect(taskListHwnd, out var tlRect);
            int w = tlRect.Right - tlRect.Left, h = tlRect.Bottom - tlRect.Top;
            string orient = (h >= w && h > 0) ? "V" : "H";

            _logger.LogDebug(
                $"{TAG} [GetInfo] taskList={taskListHwnd} orient={orient} W={w} H={h}",
                source: "TaskbarCtrl");

            return new TaskbarInfo(true, trayWnd, rebarHwnd, swHwnd, taskListHwnd, orient);
        }

        private IntPtr FindChildByClass(IntPtr parent, string className)
        {
            IntPtr found = IntPtr.Zero;
            var sbLocal  = new StringBuilder(256);
            _logger.LogDebug($"{TAG} [FindChild] Buscando '{className}' em hwnd={parent}...", source: "TaskbarCtrl");
            EnumChildWindows(parent, (h, _) =>
            {
                sbLocal.Clear();
                GetClassName(h, sbLocal, 256);
                if (sbLocal.ToString() == className)
                {
                    found = h;
                    return false; // para a enumeração
                }
                return true;
            }, IntPtr.Zero);
            if (found != IntPtr.Zero)
                _logger.LogDebug($"{TAG} [FindChild] '{className}' encontrado: hwnd={found}", source: "TaskbarCtrl");
            else
                _logger.LogDebug($"{TAG} [FindChild] '{className}' NÃO encontrado em hwnd={parent}", source: "TaskbarCtrl");
            return found;
        }
    }
}
