using System;
using System.Diagnostics;
using System.Runtime.InteropServices;

namespace VoltrisOptimizer.Services.Win32
{
    public class WindowsProcessApi : IProcessApi
    {
        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern IntPtr Kernel32_OpenProcess(int access, bool inheritHandle, int processId);
        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool Kernel32_CloseHandle(IntPtr hObject);
        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool Kernel32_SetPriorityClass(IntPtr hProcess, ProcessPriorityClass dwPriorityClass);
        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool Kernel32_SetProcessAffinityMask(IntPtr hProcess, IntPtr dwProcessAffinityMask);
        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool Kernel32_GetProcessAffinityMask(IntPtr hProcess, out IntPtr lpProcessAffinityMask, out IntPtr lpSystemAffinityMask);
        [DllImport("kernel32.dll", SetLastError = true)]
        private static extern bool Kernel32_SetProcessInformation(IntPtr hProcess, int infoClass, ref byte state, int size);

        public IntPtr OpenProcess(int access, bool inheritHandle, int processId) => Kernel32_OpenProcess(access, inheritHandle, processId);
        public bool CloseHandle(IntPtr hObject) => Kernel32_CloseHandle(hObject);
        public bool SetPriorityClass(IntPtr hProcess, ProcessPriorityClass cls) => Kernel32_SetPriorityClass(hProcess, cls);
        public bool SetProcessAffinityMask(IntPtr hProcess, IntPtr mask) => Kernel32_SetProcessAffinityMask(hProcess, mask);
        public bool GetProcessAffinityMask(IntPtr hProcess, out IntPtr processMask, out IntPtr systemMask) => Kernel32_GetProcessAffinityMask(hProcess, out processMask, out systemMask);

        public bool SetProcessInformation<T>(IntPtr hProcess, int infoClass, ref T state, int size) where T : struct
        {
            var bytes = StructureToByteArray(state);
            return Kernel32_SetProcessInformation(hProcess, infoClass, ref bytes[0], size);
        }

        private static byte[] StructureToByteArray<T>(T obj) where T : struct
        {
            int length = Marshal.SizeOf<T>();
            byte[] arr = new byte[length];
            IntPtr ptr = Marshal.AllocHGlobal(length);
            try
            {
                Marshal.StructureToPtr(obj, ptr, false);
                Marshal.Copy(ptr, arr, 0, length);
                return arr;
            }
            finally
            {
                Marshal.FreeHGlobal(ptr);
            }
        }
    }
}
