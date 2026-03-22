using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Microsoft.Win32;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.Services.Personalize
{
    // ─── Modelos ────────────────────────────────────────────────────────────────

    public class SystemAnimationState
    {
        public bool WindowAnimations { get; set; }
        public bool MenuAnimations { get; set; }
        public bool TaskbarAnimations { get; set; }
        public bool TooltipAnimations { get; set; }
        public bool ListBoxSmoothScrolling { get; set; }
        public bool CursorShadow { get; set; }
        public bool DropShadows { get; set; }
        public bool FontSmoothing { get; set; }
    }

    public class VisualPerformanceState
    {
        public bool HardwareAcceleration { get; set; }
        public bool DwmComposition { get; set; }
        public bool AeroPeek { get; set; }
        public bool TransparencyEffects { get; set; }
        public bool ReduceMotion { get; set; }
    }

    public enum PersonalizeProfile { Normal, Performance, Ultra, Custom }

    // ─── Service ─────────────────────────────────────────────────────────────────

    public sealed class SystemTweaksService
    {
        private const string TAG = "[SystemTweaks]";
        private readonly ILoggingService _logger;

        // Chaves de registro
        private const string VisualEffectsKey = @"Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects";
        private const string DesktopKey = @"Control Panel\Desktop";
        private const string WindowMetricsKey = @"Control Panel\Desktop\WindowMetrics";
        private const string DwmKey = @"Software\Microsoft\Windows\DWM";
        private const string PersonalizeKey = @"Software\Microsoft\Windows\CurrentVersion\Themes\Personalize";
        private const string ExplorerKey = @"Software\Microsoft\Windows\CurrentVersion\Explorer\Advanced";

        public SystemTweaksService(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _logger.LogInfo($"{TAG} Instância criada.");
        }

        // ── Leitura do estado atual ──────────────────────────────────────────────

        public Task<SystemAnimationState> GetAnimationStateAsync() => Task.Run(() =>
        {
            _logger.LogInfo($"{TAG} [GetAnimationStateAsync] Lendo estado de animações...");
            var state = new SystemAnimationState();
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(DesktopKey);
                state.WindowAnimations = GetRegInt(key, "MinAnimate", 1) == 1;
                state.MenuAnimations = GetRegInt(key, "MenuShowDelay", 400) < 200;
                state.FontSmoothing = GetRegInt(key, "FontSmoothing", 2) == 2;

                using var advKey = Registry.CurrentUser.OpenSubKey(ExplorerKey);
                state.TaskbarAnimations = GetRegInt(advKey, "TaskbarAnimations", 1) == 1;
                state.ListBoxSmoothScrolling = GetRegInt(advKey, "ListviewShadow", 1) == 1;
                state.DropShadows = GetRegInt(advKey, "ListviewShadow", 1) == 1;
                state.CursorShadow = GetRegInt(advKey, "CursorShadow", 1) == 1;

                _logger.LogInfo($"{TAG} [GetAnimationStateAsync] WindowAnim={state.WindowAnimations} | TaskbarAnim={state.TaskbarAnimations} | FontSmooth={state.FontSmoothing}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"{TAG} [GetAnimationStateAsync] Erro: {ex.Message}", ex);
            }
            return state;
        });

        public Task<VisualPerformanceState> GetVisualPerformanceStateAsync() => Task.Run(() =>
        {
            _logger.LogInfo($"{TAG} [GetVisualPerformanceStateAsync] Lendo estado de performance visual...");
            var state = new VisualPerformanceState();
            try
            {
                using var dwmKey = Registry.CurrentUser.OpenSubKey(DwmKey);
                state.DwmComposition = GetRegInt(dwmKey, "Composition", 1) == 1;
                state.AeroPeek = GetRegInt(dwmKey, "EnableAeroPeek", 1) == 1;
                state.TransparencyEffects = GetRegInt(dwmKey, "ColorizationOpaqueBlend", 0) == 0;

                using var personKey = Registry.CurrentUser.OpenSubKey(PersonalizeKey);
                state.TransparencyEffects = GetRegInt(personKey, "EnableTransparency", 1) == 1;

                // Hardware Acceleration via registro de GPU
                using var gpuKey = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile");
                state.HardwareAcceleration = GetRegInt(gpuKey, "SystemResponsiveness", 20) <= 20;

                _logger.LogInfo($"{TAG} [GetVisualPerformanceStateAsync] DWM={state.DwmComposition} | Transparency={state.TransparencyEffects} | HWAccel={state.HardwareAcceleration}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"{TAG} [GetVisualPerformanceStateAsync] Erro: {ex.Message}", ex);
            }
            return state;
        });

        // ── Animações ────────────────────────────────────────────────────────────

        public Task SetWindowAnimationsAsync(bool enable) => Task.Run(() =>
        {
            _logger.LogInfo($"{TAG} [SetWindowAnimationsAsync] enable={enable}");
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(DesktopKey);
                key?.SetValue("MinAnimate", enable ? "1" : "0", RegistryValueKind.String);
                _logger.LogSuccess($"{TAG} [SetWindowAnimationsAsync] MinAnimate={enable}");
            }
            catch (Exception ex) { _logger.LogError($"{TAG} [SetWindowAnimationsAsync] Erro: {ex.Message}", ex); }
        });

        public Task SetMenuAnimationsAsync(bool enable) => Task.Run(() =>
        {
            _logger.LogInfo($"{TAG} [SetMenuAnimationsAsync] enable={enable}");
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(DesktopKey);
                key?.SetValue("MenuShowDelay", enable ? "400" : "0", RegistryValueKind.String);
                _logger.LogSuccess($"{TAG} [SetMenuAnimationsAsync] MenuShowDelay={( enable ? 400 : 0)}");
            }
            catch (Exception ex) { _logger.LogError($"{TAG} [SetMenuAnimationsAsync] Erro: {ex.Message}", ex); }
        });

        public Task SetTaskbarAnimationsAsync(bool enable) => Task.Run(() =>
        {
            _logger.LogInfo($"{TAG} [SetTaskbarAnimationsAsync] enable={enable}");
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(ExplorerKey);
                key?.SetValue("TaskbarAnimations", enable ? 1 : 0, RegistryValueKind.DWord);
                _logger.LogSuccess($"{TAG} [SetTaskbarAnimationsAsync] TaskbarAnimations={enable}");
            }
            catch (Exception ex) { _logger.LogError($"{TAG} [SetTaskbarAnimationsAsync] Erro: {ex.Message}", ex); }
        });

        public Task SetFontSmoothingAsync(bool enable) => Task.Run(() =>
        {
            _logger.LogInfo($"{TAG} [SetFontSmoothingAsync] enable={enable}");
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(DesktopKey);
                key?.SetValue("FontSmoothing", enable ? "2" : "0", RegistryValueKind.String);
                key?.SetValue("FontSmoothingType", enable ? 2 : 0, RegistryValueKind.DWord);
                _logger.LogSuccess($"{TAG} [SetFontSmoothingAsync] FontSmoothing={enable}");
            }
            catch (Exception ex) { _logger.LogError($"{TAG} [SetFontSmoothingAsync] Erro: {ex.Message}", ex); }
        });

        public Task SetDropShadowsAsync(bool enable) => Task.Run(() =>
        {
            _logger.LogInfo($"{TAG} [SetDropShadowsAsync] enable={enable}");
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(ExplorerKey);
                key?.SetValue("ListviewShadow", enable ? 1 : 0, RegistryValueKind.DWord);
                _logger.LogSuccess($"{TAG} [SetDropShadowsAsync] ListviewShadow={enable}");
            }
            catch (Exception ex) { _logger.LogError($"{TAG} [SetDropShadowsAsync] Erro: {ex.Message}", ex); }
        });

        // ── Transparência ────────────────────────────────────────────────────────

        public Task SetTransparencyEffectsAsync(bool enable) => Task.Run(() =>
        {
            _logger.LogInfo($"{TAG} [SetTransparencyEffectsAsync] enable={enable}");
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(PersonalizeKey);
                key?.SetValue("EnableTransparency", enable ? 1 : 0, RegistryValueKind.DWord);
                _logger.LogSuccess($"{TAG} [SetTransparencyEffectsAsync] EnableTransparency={enable}");
            }
            catch (Exception ex) { _logger.LogError($"{TAG} [SetTransparencyEffectsAsync] Erro: {ex.Message}", ex); }
        });

        // ── Hardware Acceleration ────────────────────────────────────────────────

        public Task SetHardwareAccelerationAsync(bool enable) => Task.Run(() =>
        {
            _logger.LogInfo($"{TAG} [SetHardwareAccelerationAsync] enable={enable}");
            try
            {
                // SystemResponsiveness: 0=máx GPU, 100=máx CPU
                using var key = Registry.LocalMachine.CreateSubKey(@"SOFTWARE\Microsoft\Windows NT\CurrentVersion\Multimedia\SystemProfile");
                key?.SetValue("SystemResponsiveness", enable ? 0 : 50, RegistryValueKind.DWord);
                _logger.LogSuccess($"{TAG} [SetHardwareAccelerationAsync] SystemResponsiveness={( enable ? 0 : 50)}");
            }
            catch (Exception ex) { _logger.LogError($"{TAG} [SetHardwareAccelerationAsync] Erro: {ex.Message}", ex); }
        });

        // ── Latência visual / Explorer ───────────────────────────────────────────

        public Task SetExplorerResponsivenessAsync(bool highPerf) => Task.Run(() =>
        {
            _logger.LogInfo($"{TAG} [SetExplorerResponsivenessAsync] highPerf={highPerf}");
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(DesktopKey);
                // HungAppTimeout: tempo antes de marcar app como travado
                key?.SetValue("HungAppTimeout", highPerf ? "1000" : "5000", RegistryValueKind.String);
                // WaitToKillAppTimeout: tempo para fechar app
                key?.SetValue("WaitToKillAppTimeout", highPerf ? "2000" : "20000", RegistryValueKind.String);
                // AutoEndTasks: fechar apps automaticamente
                key?.SetValue("AutoEndTasks", highPerf ? "1" : "0", RegistryValueKind.String);
                _logger.LogSuccess($"{TAG} [SetExplorerResponsivenessAsync] Responsividade do Explorer configurada (highPerf={highPerf}).");
            }
            catch (Exception ex) { _logger.LogError($"{TAG} [SetExplorerResponsivenessAsync] Erro: {ex.Message}", ex); }
        });

        // ── Perfis ───────────────────────────────────────────────────────────────

        public async Task ApplyProfileAsync(PersonalizeProfile profile)
        {
            _logger.LogInfo($"{TAG} [ApplyProfileAsync] Aplicando perfil: {profile}");
            switch (profile)
            {
                case PersonalizeProfile.Performance:
                    await SetWindowAnimationsAsync(false);
                    await SetMenuAnimationsAsync(false);
                    await SetTaskbarAnimationsAsync(false);
                    await SetDropShadowsAsync(false);
                    await SetHardwareAccelerationAsync(true);
                    await SetExplorerResponsivenessAsync(true);
                    _logger.LogSuccess($"{TAG} [ApplyProfileAsync] Perfil Performance aplicado.");
                    break;

                case PersonalizeProfile.Ultra:
                    await SetWindowAnimationsAsync(false);
                    await SetMenuAnimationsAsync(false);
                    await SetTaskbarAnimationsAsync(false);
                    await SetDropShadowsAsync(false);
                    await SetFontSmoothingAsync(false);
                    await SetTransparencyEffectsAsync(false);
                    await SetHardwareAccelerationAsync(true);
                    await SetExplorerResponsivenessAsync(true);
                    _logger.LogSuccess($"{TAG} [ApplyProfileAsync] Perfil Ultra aplicado.");
                    break;

                case PersonalizeProfile.Normal:
                    await SetWindowAnimationsAsync(true);
                    await SetMenuAnimationsAsync(true);
                    await SetTaskbarAnimationsAsync(true);
                    await SetDropShadowsAsync(true);
                    await SetFontSmoothingAsync(true);
                    await SetTransparencyEffectsAsync(true);
                    await SetHardwareAccelerationAsync(false);
                    await SetExplorerResponsivenessAsync(false);
                    _logger.LogSuccess($"{TAG} [ApplyProfileAsync] Perfil Normal aplicado.");
                    break;
            }
        }

        // ── Detecção de gargalos visuais ─────────────────────────────────────────

        public Task<string> DetectVisualBottlenecksAsync() => Task.Run(() =>
        {
            _logger.LogInfo($"{TAG} [DetectVisualBottlenecksAsync] Analisando gargalos visuais...");
            var issues = new System.Text.StringBuilder();
            try
            {
                // Verificar DWM
                using var dwmKey = Registry.CurrentUser.OpenSubKey(DwmKey);
                if (GetRegInt(dwmKey, "Composition", 1) == 0)
                    issues.AppendLine("• DWM desativado — pode causar tearing e instabilidade visual.");

                // Verificar animações excessivas
                using var advKey = Registry.CurrentUser.OpenSubKey(ExplorerKey);
                if (GetRegInt(advKey, "TaskbarAnimations", 1) == 1)
                    issues.AppendLine("• Animações da taskbar ativas — impacto leve em CPUs mais antigos.");

                // Verificar timeout do Explorer
                using var deskKey = Registry.CurrentUser.OpenSubKey(DesktopKey);
                var timeout = deskKey?.GetValue("WaitToKillAppTimeout")?.ToString() ?? "20000";
                if (int.TryParse(timeout, out int t) && t > 5000)
                    issues.AppendLine($"• WaitToKillAppTimeout={t}ms — apps travados demoram mais para fechar.");

                var result = issues.Length > 0 ? issues.ToString().Trim() : "Nenhum gargalo visual detectado.";
                _logger.LogInfo($"{TAG} [DetectVisualBottlenecksAsync] Resultado: {result}");
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError($"{TAG} [DetectVisualBottlenecksAsync] Erro: {ex.Message}", ex);
                return "Erro ao analisar gargalos.";
            }
        });

        // ── Helpers ──────────────────────────────────────────────────────────────

        private static int GetRegInt(RegistryKey? key, string name, int defaultVal)
        {
            if (key == null) return defaultVal;
            var val = key.GetValue(name);
            if (val == null) return defaultVal;
            return val is int i ? i : int.TryParse(val.ToString(), out int parsed) ? parsed : defaultVal;
        }
    }
}
