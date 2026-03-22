// ARQUIVO ATUALIZADO AGORA PELA IA - Lógica de Respeitar Plano de Energia Manual Aplicada
using System;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Interop;
using VoltrisOptimizer.Services.Performance.Native;

namespace VoltrisOptimizer.Services.Performance
{
    public sealed class PowerPlanEnforcer : IDisposable
    {
        private static Guid GUID_POWERSCHEME_PERSONALITY = new Guid("245d8541-3943-4422-b025-13A784F679B7");
        
        private readonly IntPtr _hwnd;
        private HwndSource? _hwndSource;
        private IntPtr _hPowerNotify;
        private Guid _enforcedPlanGuid;
        private volatile bool _isRevertingSelf;

        public PowerPlanEnforcer(Window window)
        {
            _hwnd = new WindowInteropHelper(window).EnsureHandle();
            _hwndSource = HwndSource.FromHwnd(_hwnd);
            _hwndSource?.AddHook(WndProc);

            _hPowerNotify = RegisterPowerSettingNotification(_hwnd, ref GUID_POWERSCHEME_PERSONALITY, 0);
        }

        public void EnforcePlan(Guid planGuid)
        {
            _enforcedPlanGuid = planGuid;
            SetPowerPlan(planGuid);
        }

        private IntPtr WndProc(IntPtr hwnd, int msg, IntPtr wParam, IntPtr lParam, ref bool handled)
        {
            const int WM_POWERBROADCAST = 0x0218;
            const int PBT_POWERSETTINGCHANGE = 0x8013;

            if (msg == WM_POWERBROADCAST && wParam.ToInt32() == PBT_POWERSETTINGCHANGE)
            {
                var setting = Marshal.PtrToStructure<POWERBROADCAST_SETTING>(lParam);
                if (setting.PowerSetting == GUID_POWERSCHEME_PERSONALITY)
                {
                    IntPtr dataPtr = new IntPtr(lParam.ToInt64() + Marshal.OffsetOf<POWERBROADCAST_SETTING>("Data").ToInt64());
                    Guid activePlan = Marshal.PtrToStructure<Guid>(dataPtr);
                    
                    if (activePlan != _enforcedPlanGuid && !_isRevertingSelf && _enforcedPlanGuid != Guid.Empty)
                    {
                        // Respeitar a alteração manual do usuário, seja por tecla, seja pelo próprio Windows,
                        // ao invés de forçá-lo de volta ao plano anterior.
                        _enforcedPlanGuid = activePlan;
                        App.LoggingService?.LogInfo($"[PowerPlan] Plano de energia alterado externamente para {activePlan}. Respeitando nova escolha.");
                    }
                }
            }
            return IntPtr.Zero;
        }

        private void SetPowerPlan(Guid planGuid)
        {
            _isRevertingSelf = true;
            try { PowerManagementNative.SetActivePowerPlan(planGuid); }
            finally { _isRevertingSelf = false; }
        }

        [StructLayout(LayoutKind.Sequential, Pack = 4)]
        private struct POWERBROADCAST_SETTING 
        { 
            public Guid PowerSetting; 
            public uint DataLength; 
            public byte Data; 
        }

        [DllImport("User32.dll", SetLastError = true, EntryPoint = "RegisterPowerSettingNotification")]
        private static extern IntPtr RegisterPowerSettingNotification(IntPtr hWnd, ref Guid PowerSettingGuid, uint Flags);
        
        [DllImport("User32.dll", SetLastError = true)]
        private static extern bool UnregisterPowerSettingNotification(IntPtr Handle);

        public void Dispose() 
        {
            if (_hPowerNotify != IntPtr.Zero)
            {
                UnregisterPowerSettingNotification(_hPowerNotify);
                _hPowerNotify = IntPtr.Zero;
            }
            _hwndSource?.RemoveHook(WndProc);
        }
    }
}
