using System;
using System.Runtime.InteropServices;

namespace VoltrisOptimizer.Services.Performance.Native
{
    /// <summary>
    /// P/Invoke para APIs nativas de gerenciamento de energia do Windows
    /// Documentação: https://docs.microsoft.com/en-us/windows/win32/power/power-management-functions
    /// </summary>
    internal static class PowerManagementNative
    {
        // GUIDs de Power Settings (REAIS do Windows - validados com Quick CPU)
        
        // SUB_PROCESSOR - Configurações de processador
        public static readonly Guid GUID_PROCESSOR_SETTINGS_SUBGROUP = new Guid("54533251-82be-4824-96c1-47b60b740d00");
        
        // Core Parking (REAL - usado pelo Quick CPU)
        public static readonly Guid GUID_PROCESSOR_PARKING_CORE_MIN_CORES = new Guid("0cc5b647-c1df-4637-891a-dec35c318583");
        public static readonly Guid GUID_PROCESSOR_PARKING_CORE_MAX_CORES = new Guid("ea062031-0e34-4ff1-9b6d-eb1059334028");
        
        // Processor Performance State (Min/Max CPU - REAL)
        public static readonly Guid GUID_PROCESSOR_PERF_MIN_POLICY = new Guid("893dee8e-2bef-41e0-89c6-b55d0929964c");
        public static readonly Guid GUID_PROCESSOR_PERF_MAX_POLICY = new Guid("bc5038f7-23e0-4960-96da-33abaf5935ec");
        
        // Performance Thresholds (REAL)
        public static readonly Guid GUID_PROCESSOR_PERF_INCREASE_THRESHOLD = new Guid("06cadf0e-64ed-448a-8927-ce7bf90eb35d");
        public static readonly Guid GUID_PROCESSOR_PERF_DECREASE_THRESHOLD = new Guid("12a0ab44-fe28-4fa9-b3bd-4b64f44960a6");
        
        // Turbo Boost (REAL - usado pelo Quick CPU)
        public static readonly Guid GUID_PROCESSOR_PERF_BOOST_MODE = new Guid("be337238-0d82-4146-a960-4f3749d470c7");
        public static readonly Guid GUID_PROCESSOR_PERF_BOOST_POLICY = new Guid("45bcc044-d885-43e2-8605-ee0ec6e96b59");
        
        // Throttling Control (REAL)
        public static readonly Guid GUID_PROCESSOR_ALLOW_THROTTLING = new Guid("3b04d4fd-1cc7-4f23-ab1c-d1337819c4bb");
        
        // Hetero Policy (Intel 12th gen+ P-cores/E-cores - REAL)
        public static readonly Guid GUID_PROCESSOR_HETERO_POLICY = new Guid("7f2f5cfa-f10c-4823-b5e1-e93ae85f46b5");
        
        // Power Plans conhecidos
        public static readonly Guid GUID_POWER_PLAN_HIGH_PERFORMANCE = new Guid("8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c");
        public static readonly Guid GUID_POWER_PLAN_BALANCED = new Guid("381b4222-f694-41f0-9685-ff5bb260df2e");
        public static readonly Guid GUID_POWER_PLAN_POWER_SAVER = new Guid("a1841308-3541-4fab-bc81-f71556f20b4a");

        // Valores de Boost Mode
        public const uint BOOST_MODE_DISABLED = 0;
        public const uint BOOST_MODE_ENABLED = 1;
        public const uint BOOST_MODE_AGGRESSIVE = 2;
        public const uint BOOST_MODE_EFFICIENT_ENABLED = 3;
        public const uint BOOST_MODE_EFFICIENT_AGGRESSIVE = 4;

        // Valores de Boost Policy
        public const uint BOOST_POLICY_MAX = 100;
        public const uint BOOST_POLICY_HIGH = 60;
        public const uint BOOST_POLICY_MEDIUM = 40;
        public const uint BOOST_POLICY_LOW = 20;

        [DllImport("powrprof.dll", SetLastError = true)]
        public static extern uint PowerGetActiveScheme(IntPtr UserRootPowerKey, out IntPtr ActivePolicyGuid);

        [DllImport("powrprof.dll", SetLastError = true)]
        public static extern uint PowerSetActiveScheme(IntPtr UserRootPowerKey, ref Guid SchemeGuid);

        [DllImport("powrprof.dll", SetLastError = true)]
        public static extern uint PowerReadACValueIndex(
            IntPtr RootPowerKey,
            ref Guid SchemeGuid,
            ref Guid SubGroupOfPowerSettingsGuid,
            ref Guid PowerSettingGuid,
            out uint AcValueIndex);

        [DllImport("powrprof.dll", SetLastError = true)]
        public static extern uint PowerWriteACValueIndex(
            IntPtr RootPowerKey,
            ref Guid SchemeGuid,
            ref Guid SubGroupOfPowerSettingsGuid,
            ref Guid PowerSettingGuid,
            uint AcValueIndex);

        [DllImport("powrprof.dll", SetLastError = true)]
        public static extern uint PowerReadDCValueIndex(
            IntPtr RootPowerKey,
            ref Guid SchemeGuid,
            ref Guid SubGroupOfPowerSettingsGuid,
            ref Guid PowerSettingGuid,
            out uint DcValueIndex);

        [DllImport("powrprof.dll", SetLastError = true)]
        public static extern uint PowerWriteDCValueIndex(
            IntPtr RootPowerKey,
            ref Guid SchemeGuid,
            ref Guid SubGroupOfPowerSettingsGuid,
            ref Guid PowerSettingGuid,
            uint DcValueIndex);

        [DllImport("kernel32.dll", SetLastError = true)]
        public static extern IntPtr LocalFree(IntPtr hMem);

        /// <summary>
        /// Obtém o GUID do Power Plan ativo
        /// </summary>
        public static Guid GetActivePowerPlan()
        {
            IntPtr ptrGuid = IntPtr.Zero;
            try
            {
                uint result = PowerGetActiveScheme(IntPtr.Zero, out ptrGuid);
                if (result == 0 && ptrGuid != IntPtr.Zero)
                {
                    Guid guid = (Guid)Marshal.PtrToStructure(ptrGuid, typeof(Guid));
                    return guid;
                }
            }
            finally
            {
                if (ptrGuid != IntPtr.Zero)
                {
                    LocalFree(ptrGuid);
                }
            }
            return Guid.Empty;
        }

        /// <summary>
        /// Define o Power Plan ativo
        /// </summary>
        public static bool SetActivePowerPlan(Guid planGuid)
        {
            uint result = PowerSetActiveScheme(IntPtr.Zero, ref planGuid);
            return result == 0;
        }

        /// <summary>
        /// Lê um valor de configuração de energia (AC - plugado)
        /// </summary>
        public static uint ReadACValue(Guid schemeGuid, Guid subGroupGuid, Guid settingGuid)
        {
            uint value = 0;
            PowerReadACValueIndex(IntPtr.Zero, ref schemeGuid, ref subGroupGuid, ref settingGuid, out value);
            return value;
        }

        /// <summary>
        /// Escreve um valor de configuração de energia (AC - plugado)
        /// </summary>
        public static bool WriteACValue(Guid schemeGuid, Guid subGroupGuid, Guid settingGuid, uint value)
        {
            uint result = PowerWriteACValueIndex(IntPtr.Zero, ref schemeGuid, ref subGroupGuid, ref settingGuid, value);
            return result == 0;
        }

        /// <summary>
        /// Lê um valor de configuração de energia (DC - bateria)
        /// </summary>
        public static uint ReadDCValue(Guid schemeGuid, Guid subGroupGuid, Guid settingGuid)
        {
            uint value = 0;
            PowerReadDCValueIndex(IntPtr.Zero, ref schemeGuid, ref subGroupGuid, ref settingGuid, out value);
            return value;
        }

        /// <summary>
        /// Escreve um valor de configuração de energia (DC - bateria)
        /// </summary>
        public static bool WriteDCValue(Guid schemeGuid, Guid subGroupGuid, Guid settingGuid, uint value)
        {
            uint result = PowerWriteDCValueIndex(IntPtr.Zero, ref schemeGuid, ref subGroupGuid, ref settingGuid, value);
            return result == 0;
        }
    }
}
