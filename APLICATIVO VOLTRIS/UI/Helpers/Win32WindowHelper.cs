using System;
using System.Runtime.InteropServices;

namespace VoltrisOptimizer.UI.Helpers
{
    public static class Win32WindowHelper
    {
        public const int GWL_EXSTYLE = -20;
        public const int WS_EX_APPWINDOW = 0x00040000;
        public const int WS_EX_TOOLWINDOW = 0x00000080;
        public const int SW_HIDE = 0;
        public const int SW_SHOW = 5;
        public const int SW_RESTORE = 9;

        [DllImport("user32.dll", EntryPoint = "GetWindowLong", SetLastError = true)]
        private static extern int GetWindowLong32(IntPtr hWnd, int nIndex);

        [DllImport("user32.dll", EntryPoint = "GetWindowLongPtr", SetLastError = true)]
        private static extern IntPtr GetWindowLongPtr64(IntPtr hWnd, int nIndex);

        [DllImport("user32.dll", EntryPoint = "SetWindowLong", SetLastError = true)]
        private static extern int SetWindowLong32(IntPtr hWnd, int nIndex, int dwNewLong);

        [DllImport("user32.dll", EntryPoint = "SetWindowLongPtr", SetLastError = true)]
        private static extern IntPtr SetWindowLongPtr64(IntPtr hWnd, int nIndex, IntPtr dwNewLong);

        [DllImport("user32.dll", SetLastError = true)]
        public static extern bool ShowWindowAsync(IntPtr hWnd, int nCmdShow);

        [DllImport("user32.dll", SetLastError = true)]
        public static extern bool SetForegroundWindow(IntPtr hWnd);
        
        [DllImport("user32.dll", SetLastError = true)]
        public static extern bool BringWindowToTop(IntPtr hWnd);

        public static IntPtr GetExStyle(IntPtr hWnd)
        {
            if (IntPtr.Size == 8) return GetWindowLongPtr64(hWnd, GWL_EXSTYLE);
            return new IntPtr(GetWindowLong32(hWnd, GWL_EXSTYLE));
        }

        public static void SetExStyle(IntPtr hWnd, IntPtr style)
        {
            if (IntPtr.Size == 8) SetWindowLongPtr64(hWnd, GWL_EXSTYLE, style);
            else SetWindowLong32(hWnd, GWL_EXSTYLE, style.ToInt32());
        }

        public static void AddExStyle(IntPtr hWnd, int style)
        {
            var ex = GetExStyle(hWnd);
            var n = new IntPtr(ex.ToInt64() | style);
            SetExStyle(hWnd, n);
        }

        public static void RemoveExStyle(IntPtr hWnd, int style)
        {
            var ex = GetExStyle(hWnd);
            var n = new IntPtr(ex.ToInt64() & ~style);
            SetExStyle(hWnd, n);
        }
    }
}
