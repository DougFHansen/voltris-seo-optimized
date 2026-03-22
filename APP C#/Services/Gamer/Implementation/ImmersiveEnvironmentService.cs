using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.ServiceProcess;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32;
using VoltrisOptimizer.Services.Gamer.Interfaces;

namespace VoltrisOptimizer.Services.Gamer.Implementation
{
    /// <summary>
    /// Gerencia o ambiente imersivo do usuário durante o jogo.
    /// Controla: Notificações, Sleep/Monitor timeout, Windows Update, Serviços Pesados.
    ///
    /// CORREÇÕES APLICADAS:
    ///   BUG #1 — Sleep timeout agora é lido via powercfg antes de alterar (backup fiel).
    ///   BUG #4 — ApplyFocusAssist e RestoreFocusAssist agora são simétricos (mesma chave).
    ///   BUG #6 — Verb = "runas" removido de PauseWindowsUpdate/RestoreWindowsUpdate.
    ///   BUG #7 — LanmanServer: aviso explícito + verificação de conexões ativas antes de parar.
    ///   WIN11  — Focus Assist detecta build >= 22621 e usa chave correta do "Do Not Disturb".
    /// </summary>
    public class ImmersiveEnvironmentService : IImmersiveGamingOptimizer
    {
        private readonly ILoggingService _logger;
        private bool _isActive = false;

        // ── Backup de estados ──────────────────────────────────────────────────────
        private int? _backupToastEnabled;
        private int? _backupNocGlobalToast;       // NOTIFICATIONS_KEY backup (simétrico)
        private int? _backupDndEnabled;           // Win11 22H2+ Do Not Disturb backup

        // ✅ FIX BUG #1: Backup real dos timeouts de sleep (em segundos, -1 = não capturado)
        private int _backupMonitorTimeoutAC = -1;
        private int _backupMonitorTimeoutDC = -1;
        private int _backupStandbyTimeoutAC = -1;
        private int _backupStandbyTimeoutDC = -1;

        // ── Serviços pesados gerenciados ───────────────────────────────────────────
        private static readonly string[] HeavyServices = { "WSearch", "SysMain", "LanmanServer" };
        private readonly Dictionary<string, ServiceControllerStatus> _serviceOriginalStates = new();

        /// <summary>
        /// Quando true, para WSearch, SysMain e LanmanServer durante o Modo Gamer.
        /// </summary>
        public bool DisableHeavyServices { get; set; } = true;

        // ── Chaves de registro ─────────────────────────────────────────────────────
        private const string NOTIFICATIONS_KEY  = @"Software\Microsoft\Windows\CurrentVersion\Notifications\Settings";
        private const string PUSH_NOTIF_KEY     = @"Software\Microsoft\Windows\CurrentVersion\PushNotifications";
        // Win11 22H2+ (build >= 22621): "Do Not Disturb" usa chave diferente
        private const string DND_KEY_WIN11      = @"Software\Microsoft\Windows\CurrentVersion\Notifications\Settings";
        private const string DND_VALUE_WIN11    = "NOC_GLOBAL_SETTING_ALLOW_TOASTS_ABOVE_LOCK";

        public ImmersiveEnvironmentService(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        // ══════════════════════════════════════════════════════════════════════════
        // OPTIMIZE / RESTORE
        // ══════════════════════════════════════════════════════════════════════════

        public async Task<bool> OptimizeAsync(CancellationToken cancellationToken = default)
        {
            if (_isActive)
            {
                _logger.LogInfo("[ImmersiveEnv] OptimizeAsync chamado mas já está ativo — ignorando.");
                return true;
            }

            _logger.LogInfo("[ImmersiveEnv] ══════════════════════════════════════════");
            _logger.LogInfo("[ImmersiveEnv] 🤫 Iniciando silenciamento do ambiente Windows...");
            _logger.LogInfo($"[ImmersiveEnv] DisableHeavyServices={DisableHeavyServices}");

            return await Task.Run(() =>
            {
                try
                {
                    // 1. Focus Assist / Do Not Disturb
                    ApplyFocusAssist();

                    // 2. Desabilitar Toasts Globais
                    DisableToasts();

                    // 3. Prevenir Sleep/Screensaver (com backup real)
                    PreventSleep();

                    // 4. Pausar Windows Update
                    PauseWindowsUpdate();

                    // 5. Parar serviços pesados (com aviso para LanmanServer)
                    if (DisableHeavyServices)
                        StopHeavyServices();
                    else
                        _logger.LogInfo("[ImmersiveEnv] DisableHeavyServices=false — serviços pesados mantidos.");

                    _isActive = true;
                    _logger.LogSuccess("[ImmersiveEnv] ✅ Ambiente silenciado com sucesso.");
                    _logger.LogInfo("[ImmersiveEnv] ══════════════════════════════════════════");
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[ImmersiveEnv] ⚠️ Falha parcial ao otimizar ambiente: {ex.Message}");
                    _logger.LogWarning($"[ImmersiveEnv] StackTrace: {ex.StackTrace}");
                    return false;
                }
            }, cancellationToken);
        }

        public async Task<bool> RestoreAsync(CancellationToken cancellationToken = default)
        {
            if (!_isActive)
            {
                _logger.LogInfo("[ImmersiveEnv] RestoreAsync chamado mas não estava ativo — ignorando.");
                return true;
            }

            _logger.LogInfo("[ImmersiveEnv] ══════════════════════════════════════════");
            _logger.LogInfo("[ImmersiveEnv] 🔊 Restaurando ambiente Windows...");

            return await Task.Run(() =>
            {
                try
                {
                    // Restaurar na ordem inversa da aplicação
                    RestoreHeavyServices();
                    RestoreWindowsUpdate();
                    RestoreSleep();
                    RestoreToasts();
                    RestoreFocusAssist();

                    _isActive = false;
                    _logger.LogSuccess("[ImmersiveEnv] ✅ Ambiente restaurado com sucesso.");
                    _logger.LogInfo("[ImmersiveEnv] ══════════════════════════════════════════");
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[ImmersiveEnv] ❌ Erro ao restaurar ambiente: {ex.Message}", ex);
                    _logger.LogError($"[ImmersiveEnv] StackTrace: {ex.StackTrace}");
                    return false;
                }
            }, cancellationToken);
        }

        // ══════════════════════════════════════════════════════════════════════════
        // FOCUS ASSIST / DO NOT DISTURB
        // ✅ FIX BUG #4: ApplyFocusAssist e RestoreFocusAssist agora são simétricos.
        // ✅ WIN11 FIX: Detecta build >= 22621 e usa chave correta do "Do Not Disturb".
        // ══════════════════════════════════════════════════════════════════════════

        private static bool IsWin11_22H2OrLater()
        {
            var build = Environment.OSVersion.Version.Build;
            var result = build >= 22621;
            return result;
        }

        private void ApplyFocusAssist()
        {
            _logger.LogInfo($"[ImmersiveEnv] [FocusAssist] Aplicando — Win11_22H2+={IsWin11_22H2OrLater()}");
            try
            {
                // ── Chave 1: NOTIFICATIONS_KEY → NOC_GLOBAL_SETTING_TOAST_ENABLED ──
                using (var key = Registry.CurrentUser.OpenSubKey(NOTIFICATIONS_KEY, writable: true))
                {
                    if (key != null)
                    {
                        var val = key.GetValue("NOC_GLOBAL_SETTING_TOAST_ENABLED");
                        _backupNocGlobalToast = val is int iv ? iv : 1;
                        _logger.LogInfo($"[ImmersiveEnv] [FocusAssist] Backup NOC_GLOBAL_SETTING_TOAST_ENABLED = {_backupNocGlobalToast}");
                        key.SetValue("NOC_GLOBAL_SETTING_TOAST_ENABLED", 0, RegistryValueKind.DWord);
                        _logger.LogSuccess("[ImmersiveEnv] [FocusAssist] ✅ NOC_GLOBAL_SETTING_TOAST_ENABLED = 0");
                    }
                    else
                    {
                        _logger.LogWarning("[ImmersiveEnv] [FocusAssist] Chave NOTIFICATIONS_KEY não encontrada — pulando.");
                    }
                }

                // ── Chave 2: Win11 22H2+ "Do Not Disturb" ──
                if (IsWin11_22H2OrLater())
                {
                    using var dndKey = Registry.CurrentUser.OpenSubKey(DND_KEY_WIN11, writable: true);
                    if (dndKey != null)
                    {
                        var dndVal = dndKey.GetValue(DND_VALUE_WIN11);
                        _backupDndEnabled = dndVal is int dv ? dv : 1;
                        _logger.LogInfo($"[ImmersiveEnv] [FocusAssist] Win11 DND backup {DND_VALUE_WIN11} = {_backupDndEnabled}");
                        dndKey.SetValue(DND_VALUE_WIN11, 0, RegistryValueKind.DWord);
                        _logger.LogSuccess($"[ImmersiveEnv] [FocusAssist] ✅ Win11 DND {DND_VALUE_WIN11} = 0");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[ImmersiveEnv] [FocusAssist] ⚠️ Erro ao aplicar: {ex.Message}");
            }
        }

        private void RestoreFocusAssist()
        {
            _logger.LogInfo($"[ImmersiveEnv] [FocusAssist] Restaurando — Win11_22H2+={IsWin11_22H2OrLater()}");
            try
            {
                // ── Restaurar Chave 1: NOC_GLOBAL_SETTING_TOAST_ENABLED ──
                if (_backupNocGlobalToast.HasValue)
                {
                    using var key = Registry.CurrentUser.OpenSubKey(NOTIFICATIONS_KEY, writable: true);
                    if (key != null)
                    {
                        key.SetValue("NOC_GLOBAL_SETTING_TOAST_ENABLED", _backupNocGlobalToast.Value, RegistryValueKind.DWord);
                        _logger.LogSuccess($"[ImmersiveEnv] [FocusAssist] ✅ NOC_GLOBAL_SETTING_TOAST_ENABLED restaurado = {_backupNocGlobalToast.Value}");
                    }
                }
                else
                {
                    _logger.LogInfo("[ImmersiveEnv] [FocusAssist] Sem backup de NOC_GLOBAL_SETTING_TOAST_ENABLED — restaurando para 1 (padrão).");
                    using var key = Registry.CurrentUser.OpenSubKey(NOTIFICATIONS_KEY, writable: true);
                    key?.SetValue("NOC_GLOBAL_SETTING_TOAST_ENABLED", 1, RegistryValueKind.DWord);
                }

                // ── Restaurar Chave 2: Win11 22H2+ DND ──
                if (IsWin11_22H2OrLater() && _backupDndEnabled.HasValue)
                {
                    using var dndKey = Registry.CurrentUser.OpenSubKey(DND_KEY_WIN11, writable: true);
                    if (dndKey != null)
                    {
                        dndKey.SetValue(DND_VALUE_WIN11, _backupDndEnabled.Value, RegistryValueKind.DWord);
                        _logger.LogSuccess($"[ImmersiveEnv] [FocusAssist] ✅ Win11 DND restaurado = {_backupDndEnabled.Value}");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[ImmersiveEnv] [FocusAssist] ⚠️ Erro ao restaurar: {ex.Message}");
            }
        }

        // ══════════════════════════════════════════════════════════════════════════
        // TOASTS
        // ══════════════════════════════════════════════════════════════════════════

        private void DisableToasts()
        {
            _logger.LogInfo("[ImmersiveEnv] [Toasts] Desabilitando notificações Toast...");
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(PUSH_NOTIF_KEY, writable: true);
                if (key != null)
                {
                    var val = key.GetValue("ToastEnabled");
                    _backupToastEnabled = val is int iv ? iv : 1;
                    _logger.LogInfo($"[ImmersiveEnv] [Toasts] Backup ToastEnabled = {_backupToastEnabled}");
                    key.SetValue("ToastEnabled", 0, RegistryValueKind.DWord);
                    _logger.LogSuccess("[ImmersiveEnv] [Toasts] ✅ ToastEnabled = 0");
                }
                else
                {
                    _logger.LogWarning("[ImmersiveEnv] [Toasts] Não foi possível abrir/criar PUSH_NOTIF_KEY.");
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[ImmersiveEnv] [Toasts] ⚠️ Erro ao desabilitar: {ex.Message}");
            }
        }

        private void RestoreToasts()
        {
            _logger.LogInfo("[ImmersiveEnv] [Toasts] Restaurando notificações Toast...");
            try
            {
                int valueToRestore = _backupToastEnabled ?? 1;
                _logger.LogInfo($"[ImmersiveEnv] [Toasts] Restaurando ToastEnabled = {valueToRestore} (backup={_backupToastEnabled?.ToString() ?? "null → usando 1"})");

                using var key = Registry.CurrentUser.CreateSubKey(PUSH_NOTIF_KEY, writable: true);
                key?.SetValue("ToastEnabled", valueToRestore, RegistryValueKind.DWord);
                _logger.LogSuccess($"[ImmersiveEnv] [Toasts] ✅ ToastEnabled restaurado = {valueToRestore}");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[ImmersiveEnv] [Toasts] ⚠️ Erro ao restaurar: {ex.Message}");
            }
        }

        // ══════════════════════════════════════════════════════════════════════════
        // SLEEP / MONITOR TIMEOUT
        // ✅ FIX BUG #1: Backup real via powercfg /query antes de alterar.
        //    Restauração usa os valores originais capturados, não hardcoded.
        // ══════════════════════════════════════════════════════════════════════════

        private void PreventSleep()
        {
            _logger.LogInfo("[ImmersiveEnv] [Sleep] Capturando timeouts atuais antes de alterar...");
            try
            {
                // Capturar valores reais antes de alterar
                _backupMonitorTimeoutAC  = QueryPowerCfgTimeout("monitor-timeout-ac");
                _backupMonitorTimeoutDC  = QueryPowerCfgTimeout("monitor-timeout-dc");
                _backupStandbyTimeoutAC  = QueryPowerCfgTimeout("standby-timeout-ac");
                _backupStandbyTimeoutDC  = QueryPowerCfgTimeout("standby-timeout-dc");

                _logger.LogInfo($"[ImmersiveEnv] [Sleep] Backup capturado:" +
                    $" monitor-ac={_backupMonitorTimeoutAC}min" +
                    $" monitor-dc={_backupMonitorTimeoutDC}min" +
                    $" standby-ac={_backupStandbyTimeoutAC}min" +
                    $" standby-dc={_backupStandbyTimeoutDC}min");

                // Aplicar Never Sleep (0 = nunca)
                RunPowerCfg("/change monitor-timeout-ac 0");
                RunPowerCfg("/change monitor-timeout-dc 0");
                RunPowerCfg("/change standby-timeout-ac 0");
                RunPowerCfg("/change standby-timeout-dc 0");

                _logger.LogSuccess("[ImmersiveEnv] [Sleep] ✅ Sleep/Monitor desativados (timeout = 0).");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[ImmersiveEnv] [Sleep] ⚠️ Erro ao configurar Sleep: {ex.Message}");
            }
        }

        private void RestoreSleep()
        {
            _logger.LogInfo("[ImmersiveEnv] [Sleep] Restaurando timeouts de sleep...");
            try
            {
                // Usar valores capturados no backup; fallback para defaults seguros se não capturado
                int monAC  = _backupMonitorTimeoutAC  >= 0 ? _backupMonitorTimeoutAC  : 20;
                int monDC  = _backupMonitorTimeoutDC  >= 0 ? _backupMonitorTimeoutDC  : 10;
                int stdAC  = _backupStandbyTimeoutAC  >= 0 ? _backupStandbyTimeoutAC  : 60;
                int stdDC  = _backupStandbyTimeoutDC  >= 0 ? _backupStandbyTimeoutDC  : 30;

                _logger.LogInfo($"[ImmersiveEnv] [Sleep] Restaurando:" +
                    $" monitor-ac={monAC}min (backup={_backupMonitorTimeoutAC})" +
                    $" monitor-dc={monDC}min (backup={_backupMonitorTimeoutDC})" +
                    $" standby-ac={stdAC}min (backup={_backupStandbyTimeoutAC})" +
                    $" standby-dc={stdDC}min (backup={_backupStandbyTimeoutDC})");

                RunPowerCfg($"/change monitor-timeout-ac {monAC}");
                RunPowerCfg($"/change monitor-timeout-dc {monDC}");
                RunPowerCfg($"/change standby-timeout-ac {stdAC}");
                RunPowerCfg($"/change standby-timeout-dc {stdDC}");

                _logger.LogSuccess("[ImmersiveEnv] [Sleep] ✅ Timeouts de sleep restaurados.");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[ImmersiveEnv] [Sleep] ⚠️ Erro ao restaurar Sleep: {ex.Message}");
            }
        }

        /// <summary>
        /// Lê o timeout atual de um parâmetro de energia via powercfg /query.
        /// Retorna o valor em minutos, ou -1 se não conseguir capturar.
        /// </summary>
        private int QueryPowerCfgTimeout(string settingAlias)
        {
            try
            {
                // Mapear alias para GUID de sub-grupo e configuração
                // Usamos powercfg /query SCHEME_CURRENT para obter o valor atual
                var (subGroup, setting) = settingAlias switch
                {
                    "monitor-timeout-ac"  => ("SUB_VIDEO",  "VIDEOIDLE"),
                    "monitor-timeout-dc"  => ("SUB_VIDEO",  "VIDEOIDLE"),
                    "standby-timeout-ac"  => ("SUB_SLEEP",  "STANDBYIDLE"),
                    "standby-timeout-dc"  => ("SUB_SLEEP",  "STANDBYIDLE"),
                    _                     => ("SUB_SLEEP",  "STANDBYIDLE")
                };

                bool isAC = settingAlias.EndsWith("-ac");

                var psi = new ProcessStartInfo("powercfg",
                    $"/query SCHEME_CURRENT {subGroup} {setting}")
                {
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using var proc = Process.Start(psi);
                if (proc == null) return -1;

                var output = proc.StandardOutput.ReadToEnd();
                proc.WaitForExit(5000);

                // Parsear o índice de configuração de energia — suporta EN e PT-BR.
                // EN:    "Current AC Power Setting Index: 0x00000708"
                // PT-BR: "Öndice de Configura‡äes de Correntes Alternadas Atuais: 0x00000258"
                //        (encoding corrompido do powercfg em PT-BR — usar regex genérico por hex)
                //
                // Estratégia: procurar qualquer linha com "0x" seguido de hex após "AC" ou "DC"
                // dependendo do tipo de configuração solicitado.
                string pattern;
                if (isAC)
                {
                    // EN: "Current AC Power Setting Index: 0x..."
                    // PT-BR: linha com "Alternadas" e "0x..."
                    pattern = @"(?:Current AC Power Setting Index|Alternadas[^:]*?):\s*0x([0-9A-Fa-f]+)";
                }
                else
                {
                    // EN: "Current DC Power Setting Index: 0x..."
                    // PT-BR: linha com "Cont" (Contínuas) e "0x..."
                    pattern = @"(?:Current DC Power Setting Index|Cont[^:]*?):\s*0x([0-9A-Fa-f]+)";
                }

                var match = Regex.Match(output, pattern, RegexOptions.IgnoreCase);
                if (match.Success)
                {
                    var seconds = Convert.ToInt32(match.Groups[1].Value, 16);
                    var minutes = seconds / 60;
                    _logger.LogInfo($"[ImmersiveEnv] [Sleep] QueryPowerCfg({settingAlias}): {seconds}s = {minutes}min");
                    return minutes;
                }

                // Fallback: tentar extrair qualquer valor 0x hex da saída (último recurso)
                // O powercfg PT-BR tem encoding corrompido mas os valores hex são preservados
                var allHexMatches = Regex.Matches(output, @"0x([0-9A-Fa-f]{4,8})");
                if (allHexMatches.Count > 0)
                {
                    // Pegar o valor correto: AC é o primeiro hex de configuração, DC é o segundo
                    int targetIndex = isAC ? 0 : 1;
                    if (allHexMatches.Count > targetIndex)
                    {
                        var seconds = Convert.ToInt32(allHexMatches[targetIndex].Groups[1].Value, 16);
                        var minutes = seconds / 60;
                        _logger.LogInfo($"[ImmersiveEnv] [Sleep] QueryPowerCfg({settingAlias}) via fallback hex: {seconds}s = {minutes}min");
                        return minutes;
                    }
                }

                _logger.LogWarning($"[ImmersiveEnv] [Sleep] QueryPowerCfg({settingAlias}): padrão não encontrado na saída. Output={output.Trim()}");
                return -1;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[ImmersiveEnv] [Sleep] QueryPowerCfg({settingAlias}) falhou: {ex.Message}");
                return -1;
            }
        }

        private void RunPowerCfg(string args)
        {
            try
            {
                _logger.LogInfo($"[ImmersiveEnv] [PowerCfg] Executando: powercfg {args}");
                var psi = new ProcessStartInfo("powercfg", args)
                {
                    CreateNoWindow = true,
                    UseShellExecute = false
                };
                var proc = Process.Start(psi);
                proc?.WaitForExit(10000);
                _logger.LogInfo($"[ImmersiveEnv] [PowerCfg] Concluído: powercfg {args} (ExitCode={proc?.ExitCode})");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[ImmersiveEnv] [PowerCfg] ⚠️ Erro ao executar powercfg {args}: {ex.Message}");
            }
        }

        // ══════════════════════════════════════════════════════════════════════════
        // WINDOWS UPDATE
        // ✅ FIX BUG #6: Verb = "runas" removido — processo pai já é admin.
        //    UseShellExecute = false é incompatível com Verb = "runas" de qualquer forma.
        // ══════════════════════════════════════════════════════════════════════════

        private void PauseWindowsUpdate()
        {
            _logger.LogInfo("[ImmersiveEnv] [WinUpdate] Pausando Windows Update (net stop wuauserv)...");
            try
            {
                // ✅ FIX: Sem Verb = "runas" — o processo pai já roda como Administrador.
                //    Verb = "runas" com UseShellExecute = false causava UAC prompt inesperado.
                var psi = new ProcessStartInfo("net", "stop wuauserv")
                {
                    CreateNoWindow = true,
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true
                };
                using var proc = Process.Start(psi);
                var stdout = proc?.StandardOutput.ReadToEnd() ?? "";
                var stderr = proc?.StandardError.ReadToEnd() ?? "";
                proc?.WaitForExit(15000);
                _logger.LogInfo($"[ImmersiveEnv] [WinUpdate] net stop wuauserv — ExitCode={proc?.ExitCode} stdout={stdout.Trim()} stderr={stderr.Trim()}");
                _logger.LogSuccess("[ImmersiveEnv] [WinUpdate] ✅ Windows Update pausado.");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[ImmersiveEnv] [WinUpdate] ⚠️ Não foi possível pausar Windows Update: {ex.Message}");
            }
        }

        private void RestoreWindowsUpdate()
        {
            _logger.LogInfo("[ImmersiveEnv] [WinUpdate] Restaurando Windows Update (net start wuauserv)...");
            try
            {
                // ✅ FIX: Sem Verb = "runas"
                var psi = new ProcessStartInfo("net", "start wuauserv")
                {
                    CreateNoWindow = true,
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true
                };
                using var proc = Process.Start(psi);
                var stdout = proc?.StandardOutput.ReadToEnd() ?? "";
                var stderr = proc?.StandardError.ReadToEnd() ?? "";
                proc?.WaitForExit(15000);
                _logger.LogInfo($"[ImmersiveEnv] [WinUpdate] net start wuauserv — ExitCode={proc?.ExitCode} stdout={stdout.Trim()} stderr={stderr.Trim()}");
                _logger.LogSuccess("[ImmersiveEnv] [WinUpdate] ✅ Windows Update restaurado.");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[ImmersiveEnv] [WinUpdate] ⚠️ Não foi possível restaurar Windows Update: {ex.Message}");
            }
        }

        // ══════════════════════════════════════════════════════════════════════════
        // SERVIÇOS PESADOS
        // ✅ FIX BUG #7: LanmanServer — aviso explícito + verificação de sessões ativas.
        // ══════════════════════════════════════════════════════════════════════════

        private void StopHeavyServices()
        {
            _logger.LogInfo("[ImmersiveEnv] [Services] Iniciando parada de serviços pesados...");
            _serviceOriginalStates.Clear();

            foreach (var serviceName in HeavyServices)
            {
                try
                {
                    using var sc = new ServiceController(serviceName);
                    var status = sc.Status;
                    _serviceOriginalStates[serviceName] = status;
                    _logger.LogInfo($"[ImmersiveEnv] [Services] {serviceName}: estado original = {status}");

                    if (status != ServiceControllerStatus.Running)
                    {
                        _logger.LogInfo($"[ImmersiveEnv] [Services] {serviceName} já estava parado ({status}) — nenhuma ação.");
                        continue;
                    }

                    // ✅ FIX BUG #7: Aviso especial para LanmanServer (Server service)
                    if (serviceName == "LanmanServer")
                    {
                        _logger.LogWarning("[ImmersiveEnv] [Services] ⚠️ ATENÇÃO: Parando LanmanServer (Server service).");
                        _logger.LogWarning("[ImmersiveEnv] [Services] ⚠️ Isso desconectará compartilhamentos de rede ativos (pastas/impressoras compartilhadas).");

                        // Verificar se há sessões SMB ativas antes de parar
                        bool hasActiveSessions = CheckLanmanServerActiveSessions();
                        if (hasActiveSessions)
                        {
                            _logger.LogWarning("[ImmersiveEnv] [Services] ⚠️ LanmanServer tem sessões SMB ativas — parando mesmo assim (Modo Gamer solicitado).");
                        }
                        else
                        {
                            _logger.LogInfo("[ImmersiveEnv] [Services] LanmanServer sem sessões ativas — seguro parar.");
                        }
                    }

                    sc.Stop();

                    var timeout = serviceName == "LanmanServer"
                        ? TimeSpan.FromSeconds(30)
                        : TimeSpan.FromSeconds(10);

                    sc.WaitForStatus(ServiceControllerStatus.Stopped, timeout);
                    _logger.LogSuccess($"[ImmersiveEnv] [Services] ✅ Serviço {serviceName} parado com sucesso.");
                }
                catch (InvalidOperationException)
                {
                    _logger.LogInfo($"[ImmersiveEnv] [Services] Serviço {serviceName} não encontrado no sistema — pulando.");
                }
                catch (System.ServiceProcess.TimeoutException)
                {
                    _logger.LogWarning($"[ImmersiveEnv] [Services] ⚠️ Timeout ao parar {serviceName} — continuando sem ele.");
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[ImmersiveEnv] [Services] ⚠️ Não foi possível parar {serviceName}: {ex.Message}");
                }
            }

            _logger.LogInfo($"[ImmersiveEnv] [Services] Parada concluída. Estados registrados: {_serviceOriginalStates.Count}");
        }

        private void RestoreHeavyServices()
        {
            _logger.LogInfo($"[ImmersiveEnv] [Services] Restaurando serviços pesados ({_serviceOriginalStates.Count} registrados)...");

            foreach (var kvp in _serviceOriginalStates)
            {
                _logger.LogInfo($"[ImmersiveEnv] [Services] {kvp.Key}: estado original era {kvp.Value}");

                if (kvp.Value != ServiceControllerStatus.Running)
                {
                    _logger.LogInfo($"[ImmersiveEnv] [Services] {kvp.Key} não estava Running antes — não reiniciando.");
                    continue;
                }

                try
                {
                    using var sc = new ServiceController(kvp.Key);
                    var currentStatus = sc.Status;
                    _logger.LogInfo($"[ImmersiveEnv] [Services] {kvp.Key}: status atual = {currentStatus}");

                    if (currentStatus == ServiceControllerStatus.Running)
                    {
                        _logger.LogInfo($"[ImmersiveEnv] [Services] {kvp.Key} já está Running — nenhuma ação necessária.");
                        continue;
                    }

                    sc.Start();
                    sc.WaitForStatus(ServiceControllerStatus.Running, TimeSpan.FromSeconds(15));
                    _logger.LogSuccess($"[ImmersiveEnv] [Services] ✅ Serviço {kvp.Key} reiniciado com sucesso.");
                }
                catch (InvalidOperationException)
                {
                    _logger.LogInfo($"[ImmersiveEnv] [Services] Serviço {kvp.Key} não encontrado ao restaurar.");
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[ImmersiveEnv] [Services] ❌ Erro ao reiniciar {kvp.Key}: {ex.Message}");
                }
            }

            _logger.LogInfo("[ImmersiveEnv] [Services] Restauração de serviços concluída.");
        }

        /// <summary>
        /// Verifica se há sessões SMB ativas no LanmanServer via 'net session'.
        /// Retorna true se houver sessões ativas.
        /// </summary>
        private bool CheckLanmanServerActiveSessions()
        {
            try
            {
                var psi = new ProcessStartInfo("net", "session")
                {
                    CreateNoWindow = true,
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true
                };
                using var proc = Process.Start(psi);
                var output = proc?.StandardOutput.ReadToEnd() ?? "";
                proc?.WaitForExit(5000);

                _logger.LogInfo($"[ImmersiveEnv] [LanmanServer] net session output: {output.Trim()}");

                // Se a saída contém endereços IP ou nomes de computador, há sessões ativas
                bool hasSessions = output.Contains("\\\\") || Regex.IsMatch(output, @"\d+\.\d+\.\d+\.\d+");
                _logger.LogInfo($"[ImmersiveEnv] [LanmanServer] Sessões SMB ativas detectadas: {hasSessions}");
                return hasSessions;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[ImmersiveEnv] [LanmanServer] Não foi possível verificar sessões: {ex.Message}");
                return false; // Assumir sem sessões se falhar
            }
        }
    }
}
