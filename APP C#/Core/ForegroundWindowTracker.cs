using System;
using System.Runtime.InteropServices;
using System.Threading;

namespace VoltrisOptimizer.Core
{
    /// <summary>
    /// ForegroundWindowTracker — rastreia a janela em foco via WinEventHook.
    ///
    /// PROBLEMA ANTERIOR:
    ///   Cada serviço chamava GetForegroundWindow() + GetWindowThreadProcessId()
    ///   dentro de seus loops de polling. Isso significa N chamadas Win32 por segundo,
    ///   onde N = número de serviços com loops.
    ///
    /// SOLUÇÃO:
    ///   Um único SetWinEventHook(EVENT_SYSTEM_FOREGROUND) registrado uma vez.
    ///   O SO chama nosso callback APENAS quando a janela em foco muda.
    ///   CPU em idle: 0 chamadas/segundo. CPU durante uso normal: ~1-5 chamadas/minuto.
    ///
    /// USO:
    ///   ForegroundWindowTracker.Instance.CurrentPid  → PID atual, sem custo
    ///   ForegroundWindowTracker.ForegroundChanged    → evento quando muda
    /// </summary>
    public sealed class ForegroundWindowTracker : IDisposable
    {
        public static readonly ForegroundWindowTracker Instance = new();

        public event EventHandler<int>? ForegroundChanged;

        public int CurrentPid { get; private set; }
        public IntPtr CurrentHwnd { get; private set; }

        private IntPtr _hookHandle = IntPtr.Zero;
        private WinEventDelegate? _delegateRef; // manter referência para evitar GC
        private bool _started;
        private readonly object _lock = new();

        private ForegroundWindowTracker() { }

        /// <summary>
        /// Instala o hook. Deve ser chamado na UI thread (ou qualquer thread com message loop).
        /// Se chamado de thread sem message loop, usa thread dedicada.
        /// </summary>
        public void Start()
        {
            lock (_lock)
            {
                if (_started) return;
                _started = true;
            }

            // Capturar foreground atual imediatamente
            RefreshCurrent();

            // Instalar hook em thread dedicada com message loop
            // (SetWinEventHook requer que a thread que instala processe mensagens)
            var thread = new Thread(HookThread) { IsBackground = true, Name = "ForegroundHookThread" };
            thread.SetApartmentState(ApartmentState.STA);
            thread.Start();
        }

        public void Stop()
        {
            lock (_lock)
            {
                if (!_started) return;
                _started = false;
                if (_hookHandle != IntPtr.Zero)
                {
                    UnhookWinEvent(_hookHandle);
                    _hookHandle = IntPtr.Zero;
                }
            }
        }

        private void HookThread()
        {
            _delegateRef = OnWinEvent;
            _hookHandle = SetWinEventHook(
                EVENT_SYSTEM_FOREGROUND,
                EVENT_SYSTEM_FOREGROUND,
                IntPtr.Zero,
                _delegateRef,
                0, 0,
                WINEVENT_OUTOFCONTEXT | WINEVENT_SKIPOWNPROCESS);

            if (_hookHandle == IntPtr.Zero) return;

            // Message loop — necessário para receber callbacks do hook
            MSG msg;
            while (_started && GetMessage(out msg, IntPtr.Zero, 0, 0) > 0)
            {
                TranslateMessage(ref msg);
                DispatchMessage(ref msg);
            }
        }

        private void OnWinEvent(IntPtr hWinEventHook, uint eventType,
            IntPtr hwnd, int idObject, int idChild, uint dwEventThread, uint dwmsEventTime)
        {
            if (hwnd == IntPtr.Zero) return;
            try
            {
                GetWindowThreadProcessId(hwnd, out uint pid);
                if (pid == 0) return;

                CurrentHwnd = hwnd;
                CurrentPid  = (int)pid;

                ForegroundChanged?.Invoke(this, (int)pid);
            }
            catch { }
        }

        private void RefreshCurrent()
        {
            try
            {
                var hwnd = GetForegroundWindow();
                if (hwnd == IntPtr.Zero) return;
                GetWindowThreadProcessId(hwnd, out uint pid);
                CurrentHwnd = hwnd;
                CurrentPid  = (int)pid;
            }
            catch { }
        }

        public void Dispose() => Stop();

        // ── Win32 ────────────────────────────────────────────────────────────
        private const uint EVENT_SYSTEM_FOREGROUND = 0x0003;
        private const uint WINEVENT_OUTOFCONTEXT   = 0x0000;
        private const uint WINEVENT_SKIPOWNPROCESS = 0x0002;

        private delegate void WinEventDelegate(IntPtr hWinEventHook, uint eventType,
            IntPtr hwnd, int idObject, int idChild, uint dwEventThread, uint dwmsEventTime);

        [DllImport("user32.dll")] private static extern IntPtr SetWinEventHook(
            uint eventMin, uint eventMax, IntPtr hmodWinEventProc,
            WinEventDelegate lpfnWinEventProc, uint idProcess, uint idThread, uint dwFlags);

        [DllImport("user32.dll")] private static extern bool UnhookWinEvent(IntPtr hWinEventHook);
        [DllImport("user32.dll")] private static extern IntPtr GetForegroundWindow();
        [DllImport("user32.dll")] private static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);
        [DllImport("user32.dll")] private static extern int GetMessage(out MSG lpMsg, IntPtr hWnd, uint wMsgFilterMin, uint wMsgFilterMax);
        [DllImport("user32.dll")] private static extern bool TranslateMessage(ref MSG lpMsg);
        [DllImport("user32.dll")] private static extern IntPtr DispatchMessage(ref MSG lpmsg);

        [StructLayout(LayoutKind.Sequential)]
        private struct MSG
        {
            public IntPtr hwnd;
            public uint message;
            public IntPtr wParam;
            public IntPtr lParam;
            public uint time;
            public System.Drawing.Point pt;
        }
    }
}
