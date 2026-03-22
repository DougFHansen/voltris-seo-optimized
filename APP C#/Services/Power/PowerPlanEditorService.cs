using System;
using System.Diagnostics;
using System.Threading.Tasks;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.Services.Power
{
    /// <summary>
    /// Editor avançado de configurações de planos de energia via powercfg /setacvalueindex
    /// </summary>
    public sealed class PowerPlanEditorService
    {
        private const string TAG = "[PlanEditor]";

        // Subgroup GUIDs
        private const string SUB_PROCESSOR = "54533251-82be-4824-96c1-47b60b740d00";
        private const string SUB_DISK      = "0012ee47-9041-4b5d-9b77-535fba8b1442";
        private const string SUB_USB       = "2a737441-1930-4402-8d77-b2bebba308a3";
        private const string SUB_PCIE      = "501a4d13-42af-4429-9fd1-a8218c268e20";
        private const string SUB_DISPLAY   = "7516b95f-f776-4464-8c53-06167f40cc99";
        private const string SUB_WIRELESS  = "19caa586-e017-45cd-bf73-05f3498e2f82";

        // Setting GUIDs
        private const string SET_CPU_MIN       = "893dee8e-2bef-41e0-89c6-b55d0929964c";
        private const string SET_CPU_MAX       = "bc5038f7-23e0-4960-96da-33abaf5935ec";
        private const string SET_CPU_BOOST     = "be337238-0d82-4146-a960-4f3749d470c7";
        private const string SET_DISK_TIMEOUT  = "6738e2c4-e8a5-4a42-b16a-e040e769756e";
        private const string SET_USB_SUSPEND   = "48e6b7a6-50f5-4782-a5d4-53bb8f07e226";
        private const string SET_PCIE_LINK     = "ee12f906-d277-404b-b6da-e5fa1a576df5";
        private const string SET_DISPLAY_OFF   = "3c0bc021-c8a8-4e07-a973-6b14cbcb2b7e";
        private const string SET_WIRELESS_MODE = "12bbebe6-58d6-4636-95bb-3217ef867c1a";

        private readonly ILoggingService _logger;

        public PowerPlanEditorService(ILoggingService logger)
        {
            Debug.WriteLine($"{TAG}[CTOR] Iniciando PowerPlanEditorService");
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            Debug.WriteLine($"{TAG}[CTOR] PowerPlanEditorService criado com sucesso");
        }

        public async Task ApplySettingsAsync(string planGuid, PowerPlanSettings settings)
        {
            Debug.WriteLine($"{TAG}[ApplySettingsAsync] INÍCIO => planGuid={planGuid}");
            Debug.WriteLine($"{TAG}[ApplySettingsAsync] Settings: CpuMin={settings.CpuMinPercent} CpuMax={settings.CpuMaxPercent} Boost={settings.CpuBoostMode} DiskAC={settings.DiskTimeoutAc} DiskDC={settings.DiskTimeoutDc} USB={settings.UsbSelectiveSuspend} PCIe={settings.PcieLinkState} DisplayAC={settings.DisplayTimeoutAc} DisplayDC={settings.DisplayTimeoutDc} Wireless={settings.WirelessMode}");

            await Task.Run(() =>
            {
                _logger.LogInfo($"{TAG} Aplicando configurações ao plano {planGuid}");

                Debug.WriteLine($"{TAG}[ApplySettingsAsync] Aplicando CPU Min AC={settings.CpuMinPercent}%...");
                SetValue(planGuid, SUB_PROCESSOR, SET_CPU_MIN, settings.CpuMinPercent, ac: true);
                Debug.WriteLine($"{TAG}[ApplySettingsAsync] Aplicando CPU Min DC={settings.CpuMinPercent}%...");
                SetValue(planGuid, SUB_PROCESSOR, SET_CPU_MIN, settings.CpuMinPercent, ac: false);

                Debug.WriteLine($"{TAG}[ApplySettingsAsync] Aplicando CPU Max AC={settings.CpuMaxPercent}%...");
                SetValue(planGuid, SUB_PROCESSOR, SET_CPU_MAX, settings.CpuMaxPercent, ac: true);
                Debug.WriteLine($"{TAG}[ApplySettingsAsync] Aplicando CPU Max DC={settings.CpuMaxPercent}%...");
                SetValue(planGuid, SUB_PROCESSOR, SET_CPU_MAX, settings.CpuMaxPercent, ac: false);

                Debug.WriteLine($"{TAG}[ApplySettingsAsync] Aplicando CPU Boost AC={settings.CpuBoostMode}...");
                SetValue(planGuid, SUB_PROCESSOR, SET_CPU_BOOST, settings.CpuBoostMode, ac: true);
                Debug.WriteLine($"{TAG}[ApplySettingsAsync] Aplicando CPU Boost DC={settings.CpuBoostMode}...");
                SetValue(planGuid, SUB_PROCESSOR, SET_CPU_BOOST, settings.CpuBoostMode, ac: false);

                var diskAcSec = settings.DiskTimeoutAc * 60;
                var diskDcSec = settings.DiskTimeoutDc * 60;
                Debug.WriteLine($"{TAG}[ApplySettingsAsync] Aplicando Disk Timeout AC={diskAcSec}s ({settings.DiskTimeoutAc}min)...");
                SetValue(planGuid, SUB_DISK, SET_DISK_TIMEOUT, diskAcSec, ac: true);
                Debug.WriteLine($"{TAG}[ApplySettingsAsync] Aplicando Disk Timeout DC={diskDcSec}s ({settings.DiskTimeoutDc}min)...");
                SetValue(planGuid, SUB_DISK, SET_DISK_TIMEOUT, diskDcSec, ac: false);

                var usbVal = settings.UsbSelectiveSuspend ? 1 : 0;
                Debug.WriteLine($"{TAG}[ApplySettingsAsync] Aplicando USB Selective Suspend AC={usbVal} (enabled={settings.UsbSelectiveSuspend})...");
                SetValue(planGuid, SUB_USB, SET_USB_SUSPEND, usbVal, ac: true);
                Debug.WriteLine($"{TAG}[ApplySettingsAsync] Aplicando USB Selective Suspend DC={usbVal}...");
                SetValue(planGuid, SUB_USB, SET_USB_SUSPEND, usbVal, ac: false);

                Debug.WriteLine($"{TAG}[ApplySettingsAsync] Aplicando PCIe Link State AC={settings.PcieLinkState}...");
                SetValue(planGuid, SUB_PCIE, SET_PCIE_LINK, settings.PcieLinkState, ac: true);
                Debug.WriteLine($"{TAG}[ApplySettingsAsync] Aplicando PCIe Link State DC={settings.PcieLinkState}...");
                SetValue(planGuid, SUB_PCIE, SET_PCIE_LINK, settings.PcieLinkState, ac: false);

                var displayAcSec = settings.DisplayTimeoutAc * 60;
                var displayDcSec = settings.DisplayTimeoutDc * 60;
                Debug.WriteLine($"{TAG}[ApplySettingsAsync] Aplicando Display Timeout AC={displayAcSec}s ({settings.DisplayTimeoutAc}min)...");
                SetValue(planGuid, SUB_DISPLAY, SET_DISPLAY_OFF, displayAcSec, ac: true);
                Debug.WriteLine($"{TAG}[ApplySettingsAsync] Aplicando Display Timeout DC={displayDcSec}s ({settings.DisplayTimeoutDc}min)...");
                SetValue(planGuid, SUB_DISPLAY, SET_DISPLAY_OFF, displayDcSec, ac: false);

                Debug.WriteLine($"{TAG}[ApplySettingsAsync] Aplicando Wireless Mode AC={settings.WirelessMode}...");
                SetValue(planGuid, SUB_WIRELESS, SET_WIRELESS_MODE, settings.WirelessMode, ac: true);
                Debug.WriteLine($"{TAG}[ApplySettingsAsync] Aplicando Wireless Mode DC={settings.WirelessMode}...");
                SetValue(planGuid, SUB_WIRELESS, SET_WIRELESS_MODE, settings.WirelessMode, ac: false);

                Debug.WriteLine($"{TAG}[ApplySettingsAsync] Ativando plano para aplicar mudanças...");
                SmartEnergyService.RunPowercfg($"/setactive {planGuid}");
                _logger.LogSuccess($"{TAG} Configurações aplicadas com sucesso");
                Debug.WriteLine($"{TAG}[ApplySettingsAsync] FIM — todas as configurações aplicadas");
            });
        }

        public async Task<PowerPlanSettings> ReadSettingsAsync(string planGuid)
        {
            Debug.WriteLine($"{TAG}[ReadSettingsAsync] INÍCIO => planGuid={planGuid}");
            return await Task.Run(() =>
            {
                var s = new PowerPlanSettings();
                try
                {
                    Debug.WriteLine($"{TAG}[ReadSettingsAsync] Lendo CpuMinPercent (AC)...");
                    s.CpuMinPercent = ReadValue(planGuid, SUB_PROCESSOR, SET_CPU_MIN, ac: true);
                    Debug.WriteLine($"{TAG}[ReadSettingsAsync] CpuMinPercent={s.CpuMinPercent}");

                    Debug.WriteLine($"{TAG}[ReadSettingsAsync] Lendo CpuMaxPercent (AC)...");
                    s.CpuMaxPercent = ReadValue(planGuid, SUB_PROCESSOR, SET_CPU_MAX, ac: true);
                    Debug.WriteLine($"{TAG}[ReadSettingsAsync] CpuMaxPercent={s.CpuMaxPercent}");

                    Debug.WriteLine($"{TAG}[ReadSettingsAsync] Lendo CpuBoostMode (AC)...");
                    s.CpuBoostMode = ReadValue(planGuid, SUB_PROCESSOR, SET_CPU_BOOST, ac: true);
                    Debug.WriteLine($"{TAG}[ReadSettingsAsync] CpuBoostMode={s.CpuBoostMode}");

                    Debug.WriteLine($"{TAG}[ReadSettingsAsync] Lendo DiskTimeoutAc...");
                    s.DiskTimeoutAc = ReadValue(planGuid, SUB_DISK, SET_DISK_TIMEOUT, ac: true) / 60;
                    Debug.WriteLine($"{TAG}[ReadSettingsAsync] DiskTimeoutAc={s.DiskTimeoutAc} min");

                    Debug.WriteLine($"{TAG}[ReadSettingsAsync] Lendo DiskTimeoutDc...");
                    s.DiskTimeoutDc = ReadValue(planGuid, SUB_DISK, SET_DISK_TIMEOUT, ac: false) / 60;
                    Debug.WriteLine($"{TAG}[ReadSettingsAsync] DiskTimeoutDc={s.DiskTimeoutDc} min");

                    Debug.WriteLine($"{TAG}[ReadSettingsAsync] Lendo UsbSelectiveSuspend (AC)...");
                    s.UsbSelectiveSuspend = ReadValue(planGuid, SUB_USB, SET_USB_SUSPEND, ac: true) == 1;
                    Debug.WriteLine($"{TAG}[ReadSettingsAsync] UsbSelectiveSuspend={s.UsbSelectiveSuspend}");

                    Debug.WriteLine($"{TAG}[ReadSettingsAsync] Lendo PcieLinkState (AC)...");
                    s.PcieLinkState = ReadValue(planGuid, SUB_PCIE, SET_PCIE_LINK, ac: true);
                    Debug.WriteLine($"{TAG}[ReadSettingsAsync] PcieLinkState={s.PcieLinkState}");

                    Debug.WriteLine($"{TAG}[ReadSettingsAsync] Lendo DisplayTimeoutAc...");
                    s.DisplayTimeoutAc = ReadValue(planGuid, SUB_DISPLAY, SET_DISPLAY_OFF, ac: true) / 60;
                    Debug.WriteLine($"{TAG}[ReadSettingsAsync] DisplayTimeoutAc={s.DisplayTimeoutAc} min");

                    Debug.WriteLine($"{TAG}[ReadSettingsAsync] Lendo DisplayTimeoutDc...");
                    s.DisplayTimeoutDc = ReadValue(planGuid, SUB_DISPLAY, SET_DISPLAY_OFF, ac: false) / 60;
                    Debug.WriteLine($"{TAG}[ReadSettingsAsync] DisplayTimeoutDc={s.DisplayTimeoutDc} min");

                    Debug.WriteLine($"{TAG}[ReadSettingsAsync] Lendo WirelessMode (AC)...");
                    s.WirelessMode = ReadValue(planGuid, SUB_WIRELESS, SET_WIRELESS_MODE, ac: true);
                    Debug.WriteLine($"{TAG}[ReadSettingsAsync] WirelessMode={s.WirelessMode}");
                }
                catch (Exception ex)
                {
                    Debug.WriteLine($"{TAG}[ReadSettingsAsync] EXCEÇÃO: {ex.GetType().Name} => {ex.Message}");
                    Debug.WriteLine($"{TAG}[ReadSettingsAsync] StackTrace: {ex.StackTrace}");
                    _logger.LogWarning($"{TAG} Erro ao ler configurações: {ex.Message}");
                }
                Debug.WriteLine($"{TAG}[ReadSettingsAsync] FIM => CpuMin={s.CpuMinPercent} CpuMax={s.CpuMaxPercent} Boost={s.CpuBoostMode}");
                return s;
            });
        }

        private void SetValue(string planGuid, string subGroup, string setting, int value, bool ac)
        {
            var flag = ac ? "/setacvalueindex" : "/setdcvalueindex";
            var cmd = $"{flag} {planGuid} {subGroup} {setting} {value}";
            Debug.WriteLine($"{TAG}[SetValue] Executando: powercfg {cmd}");
            try
            {
                SmartEnergyService.RunPowercfg(cmd);
                Debug.WriteLine($"{TAG}[SetValue] OK => subGroup={subGroup} setting={setting} value={value} ac={ac}");
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"{TAG}[SetValue] EXCEÇÃO: {ex.GetType().Name} => {ex.Message} | cmd={cmd}");
            }
        }

        private int ReadValue(string planGuid, string subGroup, string setting, bool ac)
        {
            Debug.WriteLine($"{TAG}[ReadValue] INÍCIO => planGuid={planGuid} subGroup={subGroup} setting={setting} ac={ac}");
            try
            {
                var output = RunPowercfgEnglish($"/query {planGuid} {subGroup} {setting}");
                Debug.WriteLine($"{TAG}[ReadValue] Output powercfg /query (len={output.Length}): '{output.Trim()}'");

                // Patterns in English (forced via RunPowercfgEnglish)
                var pattern = ac ? @"Current AC Power Setting Index:\s+0x([0-9a-fA-F]+)"
                                 : @"Current DC Power Setting Index:\s+0x([0-9a-fA-F]+)";
                var match = System.Text.RegularExpressions.Regex.Match(output, pattern);
                if (match.Success)
                {
                    var val = Convert.ToInt32(match.Groups[1].Value, 16);
                    Debug.WriteLine($"{TAG}[ReadValue] Valor encontrado: 0x{match.Groups[1].Value} = {val}");
                    return val;
                }

                // Fallback: parse hex index directly (works regardless of language)
                var hexMatch = System.Text.RegularExpressions.Regex.Match(
                    output, @"(?:AC|DC)[^\n]*\n[^\n]*0x([0-9a-fA-F]+)", System.Text.RegularExpressions.RegexOptions.IgnoreCase);
                if (hexMatch.Success)
                {
                    var val = Convert.ToInt32(hexMatch.Groups[1].Value, 16);
                    Debug.WriteLine($"{TAG}[ReadValue] Valor encontrado via fallback hex: 0x{hexMatch.Groups[1].Value} = {val}");
                    return val;
                }

                Debug.WriteLine($"{TAG}[ReadValue] Padrão não encontrado no output, retornando 0");
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"{TAG}[ReadValue] EXCEÇÃO: {ex.GetType().Name} => {ex.Message}");
            }
            return 0;
        }

        /// <summary>
        /// Runs powercfg forcing English output via environment variable to avoid encoding issues
        /// with localized Windows (PT-BR, etc.) where regex patterns would fail.
        /// </summary>
        private static string RunPowercfgEnglish(string args)
        {
            Debug.WriteLine($"[PlanEditor][RunPowercfgEnglish] args='{args}'");
            try
            {
                var psi = new System.Diagnostics.ProcessStartInfo
                {
                    FileName = "powercfg.exe",
                    Arguments = args,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    StandardOutputEncoding = System.Text.Encoding.Unicode
                };
                // Force English output
                psi.EnvironmentVariables["__COMPAT_LAYER"] = "";
                psi.EnvironmentVariables["VSLANG"] = "1033";

                using var p = System.Diagnostics.Process.Start(psi);
                if (p == null)
                {
                    Debug.WriteLine($"[PlanEditor][RunPowercfgEnglish] Process.Start retornou null");
                    return SmartEnergyService.RunPowercfg(args); // fallback
                }
                var output = p.StandardOutput.ReadToEnd();
                p.WaitForExit(10_000);
                Debug.WriteLine($"[PlanEditor][RunPowercfgEnglish] ExitCode={p.ExitCode} OutputLen={output.Length}");
                return output;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"[PlanEditor][RunPowercfgEnglish] EXCEÇÃO: {ex.GetType().Name} => {ex.Message} — usando fallback");
                return SmartEnergyService.RunPowercfg(args);
            }
        }
    }
}
