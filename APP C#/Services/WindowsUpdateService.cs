using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace VoltrisOptimizer.Services
{
    public class WindowsUpdateInfo
    {
        public string Title { get; set; } = string.Empty;
        public string KBArticle { get; set; } = string.Empty;
        public string Severity { get; set; } = "Normal";
        public long SizeBytes { get; set; }
        public string SizeDisplay => SizeBytes > 0
            ? SizeBytes >= 1_073_741_824 ? $"{SizeBytes / 1_073_741_824.0:F1} GB"
            : SizeBytes >= 1_048_576 ? $"{SizeBytes / 1_048_576.0:F1} MB"
            : $"{SizeBytes / 1024.0:F0} KB"
            : "—";
        public bool IsCritical => Severity.Contains("Critical", StringComparison.OrdinalIgnoreCase)
                               || Severity.Contains("Crítica", StringComparison.OrdinalIgnoreCase);
    }

    public class WindowsUpdateCheckResult
    {
        public bool Success { get; set; }
        public string ErrorMessage { get; set; } = string.Empty;
        public List<WindowsUpdateInfo> PendingUpdates { get; set; } = new();
        public bool IsUpToDate => Success && PendingUpdates.Count == 0;
    }

    public class WindowsUpdateService
    {
        private readonly ILoggingService? _logger;

        private static readonly string _psPath = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.Windows),
            "System32", "WindowsPowerShell", "v1.0", "powershell.exe");

        public WindowsUpdateService()
        {
            try { _logger = App.LoggingService; } catch { _logger = null; }
            _logger?.LogInfo($"[WU] WindowsUpdateService inicializado. PS path: {_psPath}");
        }

        // ─────────────────────────────────────────────────────────────────────
        // Scripts PS1 — salvos em arquivo temp para evitar problemas de escape
        // ─────────────────────────────────────────────────────────────────────
        private const string CheckScript = @"
try {
    $session  = New-Object -ComObject Microsoft.Update.Session
    $searcher = $session.CreateUpdateSearcher()
    $result   = $searcher.Search('IsInstalled=0 and Type=''Software''')
    if ($result.Updates.Count -eq 0) {
        Write-Output 'SISTEMA_ATUALIZADO'
        exit 0
    }
    $updates  = @()
    foreach ($u in $result.Updates) {
        $kb  = ''
        if ($u.KBArticleIDs.Count -gt 0) { $kb = 'KB' + $u.KBArticleIDs[0] }
        $sev  = if ($u.MsrcSeverity) { $u.MsrcSeverity } else { 'Normal' }
        $size = 0
        try { $size = $u.MaxDownloadSize } catch {}
        $updates += [PSCustomObject]@{
            Title    = $u.Title
            KB       = $kb
            Severity = $sev
            Size     = $size
        }
    }
    $updates | ConvertTo-Json -Depth 2
} catch {
    Write-Error $_.Exception.Message
    exit 1
}
";

        private const string InstallScript = @"
try {
    $session  = New-Object -ComObject Microsoft.Update.Session
    $searcher = $session.CreateUpdateSearcher()
    $result   = $searcher.Search('IsInstalled=0 and Type=''Software''')
    if ($result.Updates.Count -eq 0) {
        Write-Output 'NENHUMA_ATUALIZACAO'
        exit 0
    }
    $downloader         = $session.CreateUpdateDownloader()
    $downloader.Updates = $result.Updates
    Write-Output 'BAIXANDO'
    $downloader.Download()
    $installer         = $session.CreateUpdateInstaller()
    $installer.Updates = $result.Updates
    Write-Output 'INSTALANDO'
    $installResult = $installer.Install()
    $code = $installResult.ResultCode
    # 2=Succeeded 3=SucceededWithErrors 4=Failed 5=Aborted
    if ($code -eq 2 -or $code -eq 3) {
        Write-Output 'CONCLUIDO'
        if ($installResult.RebootRequired) { Write-Output 'REBOOT_REQUIRED' }
    } else {
        Write-Error ""Instalacao falhou com codigo: $code""
        exit 1
    }
} catch {
    Write-Error $_.Exception.Message
    exit 1
}
";

        // ─────────────────────────────────────────────────────────────────────
        // CHECK
        // ─────────────────────────────────────────────────────────────────────
        public async Task<WindowsUpdateCheckResult> CheckForUpdatesAsync(CancellationToken ct = default)
        {
            _logger?.LogInfo("[WU] ▶ Iniciando verificação de atualizações do Windows...");
            var result = new WindowsUpdateCheckResult();

            try
            {
                var sw = Stopwatch.StartNew();
                string output;

                try
                {
                    output = await RunPsScriptAsync(CheckScript, ct);
                }
                catch (Exception psEx)
                {
                    _logger?.LogError($"[WU] ❌ Falha ao executar script PS de verificação: {psEx.Message}", psEx);
                    result.Success = false;
                    result.ErrorMessage = psEx.Message;
                    return result;
                }

                sw.Stop();
                _logger?.LogInfo($"[WU] Script concluído em {sw.ElapsedMilliseconds}ms");
                _logger?.LogInfo($"[WU] Output bruto ({output.Length} chars): {(output.Length > 500 ? output[..500] + "..." : output)}");

                if (string.IsNullOrWhiteSpace(output) || output.Contains("SISTEMA_ATUALIZADO"))
                {
                    _logger?.LogInfo("[WU] ✅ Sistema já está atualizado (sem atualizações pendentes)");
                    result.Success = true;
                    return result;
                }

                var json = output.Trim();
                if (!json.StartsWith("["))
                {
                    _logger?.LogInfo("[WU] Output não é array — envolvendo em array (1 atualização)");
                    json = $"[{json}]";
                }

                List<JsonElement>? items;
                try
                {
                    items = JsonSerializer.Deserialize<List<JsonElement>>(json);
                    _logger?.LogInfo($"[WU] JSON desserializado: {items?.Count ?? 0} item(ns)");
                }
                catch (JsonException jsonEx)
                {
                    _logger?.LogError($"[WU] ❌ Falha ao desserializar JSON: {jsonEx.Message}");
                    _logger?.LogError($"[WU] JSON problemático: {json[..Math.Min(300, json.Length)]}");
                    result.Success = false;
                    result.ErrorMessage = $"Erro ao processar resposta: {jsonEx.Message}";
                    return result;
                }

                if (items != null)
                {
                    foreach (var item in items)
                    {
                        var info = new WindowsUpdateInfo
                        {
                            Title     = GetString(item, "Title"),
                            KBArticle = GetString(item, "KB"),
                            Severity  = GetString(item, "Severity", "Normal"),
                            SizeBytes = GetLong(item, "Size")
                        };
                        result.PendingUpdates.Add(info);
                        _logger?.LogInfo($"[WU]   • {info.Title} | {info.KBArticle} | {info.Severity} | {info.SizeDisplay}");
                    }
                }

                _logger?.LogSuccess($"[WU] ✅ {result.PendingUpdates.Count} atualização(ões) encontrada(s)");
                result.Success = true;
            }
            catch (OperationCanceledException)
            {
                _logger?.LogWarning("[WU] ⚠ Verificação cancelada pelo usuário");
                throw;
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[WU] ❌ Erro inesperado: {ex.GetType().Name}: {ex.Message}", ex);
                result.Success = false;
                result.ErrorMessage = ex.Message;
            }

            return result;
        }

        // ─────────────────────────────────────────────────────────────────────
        // INSTALL
        // ─────────────────────────────────────────────────────────────────────
        public async Task<(bool success, bool rebootRequired, string message)> InstallUpdatesAsync(
            IProgress<(int percent, string message)>? progress = null,
            CancellationToken ct = default)
        {
            _logger?.LogInfo("[WU] ▶ Iniciando instalação de atualizações...");

            try
            {
                progress?.Report((5, "Iniciando instalação de atualizações..."));

                string? output   = null;
                string? error    = null;
                int     exitCode = -1;

                var sw = Stopwatch.StartNew();

                await Task.Run(async () =>
                {
                    var scriptPath = WriteTempScript(InstallScript);
                    _logger?.LogInfo($"[WU] Script de instalação salvo em: {scriptPath}");

                    var psi = new ProcessStartInfo
                    {
                        FileName               = _psPath,
                        Arguments              = $"-NoProfile -NonInteractive -ExecutionPolicy Bypass -File \"{scriptPath}\"",
                        UseShellExecute        = false,
                        CreateNoWindow         = true,
                        RedirectStandardOutput = true,
                        RedirectStandardError  = true
                    };

                    using var proc = new Process { StartInfo = psi };

                    try
                    {
                        proc.Start();
                        _logger?.LogInfo($"[WU] Processo PS iniciado (PID: {proc.Id})");
                    }
                    catch (Exception startEx)
                    {
                        _logger?.LogError($"[WU] ❌ Falha ao iniciar processo PS: {startEx.Message}", startEx);
                        throw;
                    }

                    var outTask = proc.StandardOutput.ReadToEndAsync();
                    var errTask = proc.StandardError.ReadToEndAsync();

                    _ = Task.Run(async () =>
                    {
                        int p = 10;
                        while (!proc.HasExited && !ct.IsCancellationRequested)
                        {
                            await Task.Delay(3000, ct);
                            p = Math.Min(p + 5, 85);
                            progress?.Report((p, "Instalando atualizações do Windows..."));
                            _logger?.LogInfo($"[WU] Instalação em andamento... (~{p}%)");
                        }
                    }, ct);

                    await proc.WaitForExitAsync(ct);
                    exitCode = proc.ExitCode;
                    output   = await outTask;
                    error    = await errTask;

                    try { File.Delete(scriptPath); } catch { }
                }, ct);

                sw.Stop();
                _logger?.LogInfo($"[WU] Instalação finalizada em {sw.ElapsedMilliseconds}ms | ExitCode: {exitCode}");
                _logger?.LogInfo($"[WU] stdout: {output?.Trim() ?? "(vazio)"}");
                if (!string.IsNullOrWhiteSpace(error))
                    _logger?.LogWarning($"[WU] stderr: {error.Trim()}");

                progress?.Report((95, "Finalizando..."));

                if (output?.Contains("NENHUMA_ATUALIZACAO") == true)
                {
                    _logger?.LogInfo("[WU] ✅ Sistema já atualizado");
                    return (true, false, "Sistema já está atualizado.");
                }

                if (output?.Contains("CONCLUIDO") == true)
                {
                    bool reboot = output.Contains("REBOOT_REQUIRED");
                    var msg = reboot
                        ? "Atualizações instaladas. Reinicialização necessária."
                        : "Atualizações instaladas com sucesso.";
                    _logger?.LogSuccess($"[WU] ✅ {msg}");
                    return (true, reboot, msg);
                }

                var failMsg = $"Falha na instalação: {error?.Trim() ?? "erro desconhecido"} (ExitCode: {exitCode})";
                _logger?.LogError($"[WU] ❌ {failMsg}");
                return (false, false, failMsg);
            }
            catch (OperationCanceledException)
            {
                _logger?.LogWarning("[WU] ⚠ Instalação cancelada");
                throw;
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[WU] ❌ Erro inesperado na instalação: {ex.GetType().Name}: {ex.Message}", ex);
                return (false, false, $"Erro: {ex.Message}");
            }
        }

        // ─────────────────────────────────────────────────────────────────────
        // HELPERS
        // ─────────────────────────────────────────────────────────────────────

        /// <summary>
        /// Salva o script em arquivo .ps1 temporário e executa com -File.
        /// Evita todos os problemas de escape de argumentos inline.
        /// </summary>
        private async Task<string> RunPsScriptAsync(string script, CancellationToken ct)
        {
            var scriptPath = WriteTempScript(script);
            _logger?.LogInfo($"[WU] Script salvo em: {scriptPath}");

            var psi = new ProcessStartInfo
            {
                FileName               = _psPath,
                Arguments              = $"-NoProfile -NonInteractive -ExecutionPolicy Bypass -File \"{scriptPath}\"",
                UseShellExecute        = false,
                CreateNoWindow         = true,
                RedirectStandardOutput = true,
                RedirectStandardError  = true
            };

            _logger?.LogInfo($"[WU] Executando: {_psPath} {psi.Arguments}");

            using var proc = new Process { StartInfo = psi };

            try
            {
                proc.Start();
                _logger?.LogInfo($"[WU] Processo PS iniciado (PID: {proc.Id})");
            }
            catch (Exception startEx)
            {
                _logger?.LogError($"[WU] ❌ Não foi possível iniciar powershell.exe: {startEx.Message}", startEx);
                try { File.Delete(scriptPath); } catch { }
                throw;
            }

            var outTask = proc.StandardOutput.ReadToEndAsync();
            var errTask = proc.StandardError.ReadToEndAsync();

            await proc.WaitForExitAsync(ct);

            var stdout = await outTask;
            var stderr = await errTask;

            _logger?.LogInfo($"[WU] PS ExitCode: {proc.ExitCode}");
            if (!string.IsNullOrWhiteSpace(stderr))
                _logger?.LogWarning($"[WU] PS stderr: {stderr.Trim()}");

            try { File.Delete(scriptPath); } catch { }

            if (proc.ExitCode != 0 && !string.IsNullOrWhiteSpace(stderr))
            {
                _logger?.LogError($"[WU] ❌ Script PS falhou (ExitCode {proc.ExitCode}): {stderr.Trim()}");
                throw new Exception(stderr.Trim());
            }

            return stdout.Trim();
        }

        /// <summary>
        /// Escreve o script em um arquivo .ps1 temporário e retorna o caminho.
        /// </summary>
        private static string WriteTempScript(string scriptContent)
        {
            var path = Path.Combine(Path.GetTempPath(), $"voltris_wu_{Guid.NewGuid():N}.ps1");
            File.WriteAllText(path, scriptContent, System.Text.Encoding.UTF8);
            return path;
        }

        private static string GetString(JsonElement el, string key, string def = "")
        {
            try { return el.GetProperty(key).GetString() ?? def; } catch { return def; }
        }

        private static long GetLong(JsonElement el, string key)
        {
            try { return el.GetProperty(key).GetInt64(); } catch { return 0; }
        }
    }
}
