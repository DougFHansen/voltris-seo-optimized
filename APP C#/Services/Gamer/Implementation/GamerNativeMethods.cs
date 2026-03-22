using System;
using System.Runtime.InteropServices;

namespace VoltrisOptimizer.Services.Gamer.Implementation
{
    internal static class GamerNativeMethods
    {
        [DllImport("kernel32.dll", SetLastError = true)]
        public static extern bool SetProcessWorkingSetSize(IntPtr hProcess, int dwMinimumWorkingSetSize, int dwMaximumWorkingSetSize);

        [DllImport("psapi.dll", SetLastError = true)]
        public static extern bool EmptyWorkingSet(IntPtr hProcess);

        // ENTERPRISE-GRADE: I/O Priority with proper structure
        [DllImport("ntdll.dll", EntryPoint = "NtSetInformationProcess", SetLastError = true)]
        private static extern int NtSetInformationProcessNative(IntPtr processHandle, int processInformationClass, ref IO_PRIORITY_HINT processInformation, int processInformationLength);

        // Contador de chamadas para logging periódico (evita flood)
        private static long _ntSetCallCount;
        private static long _ntSetFailCount;

        // Circuit breaker: se NtSetInformationProcess falhar com STATUS_PRIVILEGE_NOT_HELD
        // consecutivamente, desabilita chamadas nativas e usa apenas fallback (SetPriorityClass)
        private static volatile bool _nativeIoPriorityDisabled;
        private static int _consecutivePrivilegeFailures;
        private const int MaxPrivilegeFailures = 3;

        // Logger estático opcional — injetado pelo bootstrap para que o circuit breaker
        // apareça no voltris.log e não apenas no crash_trace
        private static ILoggingService? _logger;
        public static void SetLogger(ILoggingService logger) => _logger = logger;

        [DllImport("advapi32.dll", SetLastError = true)]
        private static extern bool AdjustTokenPrivileges(IntPtr TokenHandle, bool DisableAllPrivileges, ref TOKEN_PRIVILEGES NewState, int BufferLength, IntPtr PreviousState, IntPtr ReturnLength);

        [DllImport("kernel32.dll")]
        private static extern IntPtr GetCurrentProcess();

        [DllImport("advapi32.dll", SetLastError = true)]
        private static extern bool OpenProcessToken(IntPtr ProcessHandle, int DesiredAccess, ref IntPtr TokenHandle);

        [DllImport("advapi32.dll", CharSet = CharSet.Unicode, SetLastError = true)]
        private static extern bool LookupPrivilegeValue(string? lpSystemName, string lpName, ref LUID lpLuid);

        [StructLayout(LayoutKind.Sequential)]
        private struct TOKEN_PRIVILEGES
        {
            public int PrivilegeCount;
            public LUID Luid;
            public int Attributes;
        }

        [StructLayout(LayoutKind.Sequential)]
        private struct LUID
        {
            public uint LowPart;
            public int HighPart;
        }

        private static bool _privilegeChecked = false;
        
        public static void EnsurePrivilege()
        {
            if (_privilegeChecked) return;
            _privilegeChecked = true;
            try
            {
                IntPtr hToken = IntPtr.Zero;
                if (OpenProcessToken(GetCurrentProcess(), 0x0020 | 0x0008, ref hToken)) // TOKEN_ADJUST_PRIVILEGES | TOKEN_QUERY
                {
                    LUID luid = new LUID();
                    if (LookupPrivilegeValue(null, "SeIncreaseBasePriorityPrivilege", ref luid))
                    {
                        var tp = new TOKEN_PRIVILEGES { PrivilegeCount = 1, Luid = luid, Attributes = 0x00000002 }; // SE_PRIVILEGE_ENABLED
                        AdjustTokenPrivileges(hToken, false, ref tp, 0, IntPtr.Zero, IntPtr.Zero);
                    }
                }
            }
            catch { }
        }

        /// <summary>
        /// Wrapper seguro para NtSetInformationProcess com validação, diagnóstico e circuit breaker.
        /// Se a API retornar STATUS_PRIVILEGE_NOT_HELD (0xC0000061) repetidamente,
        /// desabilita chamadas nativas para evitar overhead inútil.
        /// </summary>
        public static int NtSetInformationProcess(IntPtr processHandle, int processInformationClass, ref IO_PRIORITY_HINT processInformation, int processInformationLength)
        {
            // Circuit breaker: se já sabemos que não temos privilégio, retorna imediatamente
            if (_nativeIoPriorityDisabled && processInformationClass == ProcessIoPriority)
                return unchecked((int)0xC0000061); // STATUS_PRIVILEGE_NOT_HELD

            EnsurePrivilege();

            // Validação de handle — handle inválido/zero pode causar access violation
            if (processHandle == IntPtr.Zero || processHandle == new IntPtr(-1))
                return -1; // STATUS_INVALID_HANDLE

            var callNum = System.Threading.Interlocked.Increment(ref _ntSetCallCount);

            // Breadcrumb apenas na 1ª chamada (evita flood no log)
            if (callNum == 1)
            {
                Core.Diagnostics.CrashDiagnostics.Mark(
                    $"NtSetInfoProcess #{callNum} handle=0x{processHandle:X} class=0x{processInformationClass:X2} prio={processInformation.Priority}");
            }

            try
            {
                int status = NtSetInformationProcessNative(processHandle, processInformationClass, ref processInformation, processInformationLength);

                if (status != 0)
                {
                    var fails = System.Threading.Interlocked.Increment(ref _ntSetFailCount);

                    // Circuit breaker para STATUS_PRIVILEGE_NOT_HELD (0xC0000061)
                    if (status == unchecked((int)0xC0000061) && processInformationClass == ProcessIoPriority)
                    {
                        var consecutive = System.Threading.Interlocked.Increment(ref _consecutivePrivilegeFailures);
                        if (consecutive >= MaxPrivilegeFailures && !_nativeIoPriorityDisabled)
                        {
                            _nativeIoPriorityDisabled = true;
                            var msg = $"[NativeInterop] CIRCUIT BREAKER: NtSetInformationProcess I/O Priority desabilitado após {consecutive} falhas STATUS_PRIVILEGE_NOT_HELD. " +
                                      "Causa provável: processo alvo tem integridade alta (Protected Process Light). " +
                                      "Fallback SetPriorityClass ativo — funcionalidade preservada com menor granularidade.";
                            Core.Diagnostics.CrashDiagnostics.Mark(msg);
                            _logger?.LogWarning(msg);
                        }
                    }

                    if (fails <= 1 || fails % 500 == 0)
                    {
                        Core.Diagnostics.CrashDiagnostics.Mark(
                            $"NtSetInfoProcess NTSTATUS=0x{status:X8} (fail #{fails})");
                    }
                }
                else
                {
                    // Reset circuit breaker em caso de sucesso
                    System.Threading.Interlocked.Exchange(ref _consecutivePrivilegeFailures, 0);
                }

                return status;
            }
            catch (Exception ex)
            {
                Core.Diagnostics.CrashDiagnostics.TraceException("NtSetInformationProcess", ex);
                return -1;
            }
        }

        [DllImport("ntdll.dll")]
        public static extern int NtSetSystemInformation(int SystemInformationClass, ref int SystemInformation, int SystemInformationLength);

        // ProcessInformationClass for I/O Priority
        public const int ProcessIoPriority = 0x21; // Correct value for Windows Vista+

        // I/O Priority Hint structure (Windows documented)
        [StructLayout(LayoutKind.Sequential)]
        public struct IO_PRIORITY_HINT
        {
            public int Priority;
        }

        // I/O Priority levels (Windows documented)
        public enum IoPriorityLevel
        {
            IoPriorityVeryLow = 0,
            IoPriorityLow = 1,
            IoPriorityNormal = 2,
            IoPriorityHigh = 3,
            IoPriorityCritical = 4
        }

        // Fallback: Standard documented Windows API
        [DllImport("kernel32.dll", SetLastError = true)]
        public static extern bool SetPriorityClass(IntPtr hProcess, uint dwPriorityClass);

        public const uint IDLE_PRIORITY_CLASS = 0x00000040;
        public const uint BELOW_NORMAL_PRIORITY_CLASS = 0x00004000;
        public const uint NORMAL_PRIORITY_CLASS = 0x00000020;
        public const uint ABOVE_NORMAL_PRIORITY_CLASS = 0x00008000;
        public const uint HIGH_PRIORITY_CLASS = 0x00000080;
        public const uint REALTIME_PRIORITY_CLASS = 0x00000100;

        // Helper method: Enterprise-grade I/O priority setter with fallback
        public static bool SetProcessIoPriority(IntPtr processHandle, IoPriorityLevel priority, out string method)
        {
            // Method 1: Try native I/O priority API (Windows Vista+)
            try
            {
                var ioPriority = new IO_PRIORITY_HINT { Priority = (int)priority };
                int ntStatus = NtSetInformationProcess(processHandle, ProcessIoPriority, ref ioPriority, Marshal.SizeOf<IO_PRIORITY_HINT>());
                
                if (ntStatus == 0) // STATUS_SUCCESS
                {
                    method = "NtSetInformationProcess (Native I/O Priority)";
                    return true;
                }
            }
            catch
            {
                // Silent fallback to Method 2
            }

            // Method 2: Fallback to process priority class (100% compatible)
            try
            {
                uint priorityClass = priority switch
                {
                    IoPriorityLevel.IoPriorityCritical => HIGH_PRIORITY_CLASS,
                    IoPriorityLevel.IoPriorityHigh => ABOVE_NORMAL_PRIORITY_CLASS,
                    IoPriorityLevel.IoPriorityNormal => NORMAL_PRIORITY_CLASS,
                    IoPriorityLevel.IoPriorityLow => BELOW_NORMAL_PRIORITY_CLASS,
                    IoPriorityLevel.IoPriorityVeryLow => IDLE_PRIORITY_CLASS,
                    _ => NORMAL_PRIORITY_CLASS
                };

                bool success = SetPriorityClass(processHandle, priorityClass);
                if (success)
                {
                    method = "SetPriorityClass (Standard Windows API)";
                    return true;
                }
            }
            catch
            {
                // Complete failure
            }

            method = "Failed";
            return false;
        }
    }
}
