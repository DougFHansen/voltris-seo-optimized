using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Helpers;
using VoltrisOptimizer.Services.Uninstaller;

namespace VoltrisOptimizer.Services.Tuning
{
    public class DebloatTuningService : IDebloatTuningService
    {
        private readonly ILoggingService _logger;
        private readonly UninstallEngine _uninstallEngine;

        public DebloatTuningService(ILoggingService logger)
        {
            _logger = logger;
            _uninstallEngine = new UninstallEngine(logger);
        }

        public async Task<List<AppInfo>> GetInstalledAppsAsync(bool uninstallableOnly)
        {
            var apps = new List<AppInfo>();
            var sw = System.Diagnostics.Stopwatch.StartNew();
            try
            {
                _logger.LogInfo("[Debloat] ═══════════════════════════════════════════════════════");
                _logger.LogInfo($"[Debloat] ESCANEANDO APLICATIVOS INSTALADOS (uninstallableOnly={uninstallableOnly})");
                _logger.LogInfo("[Debloat] ═══════════════════════════════════════════════════════");
                
                // ETAPA 3: Execução paralela de UWP e Win32
                _logger.LogDebug("[Debloat] Iniciando scan paralelo: UWP + Win32...");
                var uwpTask = GetUwpAppsAsync(uninstallableOnly);
                var win32Task = Task.Run(() => _uninstallEngine.GetInstalledPrograms());

                await Task.WhenAll(uwpTask, win32Task);

                var uwpApps = uwpTask.Result;
                var win32Apps = win32Task.Result;

                _logger.LogInfo($"[Debloat] UWP apps encontrados: {uwpApps.Count}");
                _logger.LogInfo($"[Debloat] Win32 apps encontrados: {win32Apps.Count}");

                apps.AddRange(uwpApps);
                apps.AddRange(win32Apps);

                // Background loading for icons to not block the UI
                _ = Task.Run(async () =>
                {
                    // ETAPA 3: Carregamento paralelo de ícones
                    var iconTasks = apps.Select(async app =>
                    {
                        try
                        {
                            var icon = await AppIconExtractor.ExtractLogoPathAsync(app);
                            if (!string.IsNullOrEmpty(icon))
                            {
                                app.IconPath = icon;
                            }
                        }
                        catch { }
                    });

                    await Task.WhenAll(iconTasks);
                });

                _logger.LogInfo($"[Debloat] Escaneamento concluído: {apps.Count} aplicativos encontrados em {sw.ElapsedMilliseconds}ms");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[Debloat] ❌ Erro ao listar aplicativos: {ex.Message}", ex);
            }
            
            // Deduplicate (priorizar com uninstall string e ícone)
            return apps.OrderByDescending(a => !string.IsNullOrEmpty(a.UninstallString))
                       .ThenByDescending(a => !string.IsNullOrEmpty(a.IconPath))
                       .GroupBy(a => a.Name.ToLower().Trim())
                       .Select(g => g.First())
                       .OrderBy(a => a.Name)
                       .ToList();
        }

        public async Task<bool> UninstallAppAsync(string appName, bool isWin32, CancellationToken cancellationToken = default)
        {
            var sw = System.Diagnostics.Stopwatch.StartNew();
            try
            {
                _logger.LogInfo($"[Debloat] ═══════════════════════════════════════════════════════");
                _logger.LogInfo($"[Debloat] INICIANDO DESINSTALAÇÃO: {appName}");
                _logger.LogInfo($"[Debloat]   Tipo: {(isWin32 ? "Win32" : "UWP/MSIX")}");
                _logger.LogInfo($"[Debloat]   Timestamp: {DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}");
                _logger.LogInfo($"[Debloat] ═══════════════════════════════════════════════════════");

                // Verificar cancelamento antes de iniciar
                cancellationToken.ThrowIfCancellationRequested();

                if (isWin32)                {
                    _logger.LogInfo($"[Debloat] [Win32] Buscando '{appName}' no registro...");
                    var app = _uninstallEngine.GetInstalledPrograms()
                                .FirstOrDefault(a => a.Name.Equals(appName, StringComparison.OrdinalIgnoreCase));

                    if (app != null)
                    {
                        _logger.LogInfo($"[Debloat] [Win32] App encontrado: Name='{app.Name}', UninstallString='{app.UninstallString}', InstallLocation='{app.InstallLocation}'");
                        var result = await _uninstallEngine.PerformProfessionalUninstall(app);
                        _logger.LogInfo($"[Debloat] [Win32] Resultado: {(result ? "SUCESSO" : "FALHA")} em {sw.ElapsedMilliseconds}ms");
                        return result;
                    }
                    else
                    {
                        _logger.LogError($"[Debloat] [Win32] App '{appName}' NÃO encontrado no registro. Desinstalação impossível.");
                        return false;
                    }
                }
                else
                {
                    // ── ETAPA 1: Listar pacotes existentes antes da remoção ──
                    _logger.LogInfo($"[Debloat] [UWP] ── ETAPA 1: Verificando pacotes existentes ──");
                    var listCmd = $"Get-AppxPackage -AllUsers -Name '{appName}' | Select-Object Name,PackageFullName,Status,InstallLocation | Format-List";
                    var existingPackages = await RunPowerShellAsync(listCmd);
                    _logger.LogInfo($"[Debloat] [UWP] Pacotes encontrados ANTES da remoção:\n{(string.IsNullOrWhiteSpace(existingPackages) ? "(NENHUM - pacote não está instalado como AppxPackage)" : existingPackages.Trim())}");

                    // Verificar pacotes provisionados
                    var listProvCmd = $"Get-AppxProvisionedPackage -Online | Where-Object {{ $_.DisplayName -eq '{appName}' }} | Select-Object DisplayName,PackageName | Format-List";
                    var existingProvisioned = await RunPowerShellAsync(listProvCmd);
                    _logger.LogInfo($"[Debloat] [UWP] Pacotes provisionados encontrados:\n{(string.IsNullOrWhiteSpace(existingProvisioned) ? "(NENHUM)" : existingProvisioned.Trim())}");

                    // ── ETAPA 2: Remover pacote provisionado ──
                    _logger.LogInfo($"[Debloat] [UWP] ── ETAPA 2: Removendo pacote provisionado ──");
                    cancellationToken.ThrowIfCancellationRequested();
                    var cmdProvisioned = $"Get-AppxProvisionedPackage -Online | Where-Object {{ $_.DisplayName -eq '{appName}' }} | ForEach-Object {{ Remove-AppxProvisionedPackage -Online -PackageName $_.PackageName -ErrorAction SilentlyContinue; Write-Output \"Removed provisioned: $($_.PackageName)\" }}";
                    var provOutput = await RunPowerShellAsync(cmdProvisioned);
                    _logger.LogInfo($"[Debloat] [UWP] Resultado Remove-AppxProvisionedPackage: {(string.IsNullOrWhiteSpace(provOutput) ? "(sem output - nenhum pacote provisionado encontrado)" : provOutput.Trim())}");

                    // ── ETAPA 3: Remover pacote do usuário (AllUsers) ──
                    _logger.LogInfo($"[Debloat] [UWP] ── ETAPA 3: Removendo pacote AppxPackage (AllUsers) ──");
                    cancellationToken.ThrowIfCancellationRequested();
                    var cmdAppx = $"Get-AppxPackage -AllUsers | Where-Object {{ $_.Name -eq '{appName}' }} | ForEach-Object {{ Write-Output \"Removendo: $($_.PackageFullName)\"; Remove-AppxPackage -Package $_.PackageFullName -AllUsers -ErrorAction Stop; Write-Output \"Removido: $($_.PackageFullName)\" }}";
                    var appxOutput = await RunPowerShellAsync(cmdAppx);
                    _logger.LogInfo($"[Debloat] [UWP] Resultado Remove-AppxPackage: {(string.IsNullOrWhiteSpace(appxOutput) ? "(sem output - nenhum pacote encontrado para remover)" : appxOutput.Trim())}");

                    // ── ETAPA 4: Verificação pós-remoção ──
                    _logger.LogInfo($"[Debloat] [UWP] ── ETAPA 4: Verificação pós-remoção ──");
                    var verifyCmd = $"(Get-AppxPackage -AllUsers -Name '{appName}' | Measure-Object).Count";
                    var countOutput = (await RunPowerShellAsync(verifyCmd)).Trim();
                    _logger.LogInfo($"[Debloat] [UWP] Contagem de pacotes restantes: '{countOutput}'");

                    if (countOutput == "0" || string.IsNullOrWhiteSpace(countOutput))
                    {
                        sw.Stop();
                        _logger.LogSuccess($"[Debloat] [UWP] ✅ Aplicativo '{appName}' removido com SUCESSO em {sw.ElapsedMilliseconds}ms");
                        return true;
                    }

                    // ── ETAPA 5: Fallback winget ──
                    _logger.LogWarning($"[Debloat] [UWP] ⚠ Pacote '{appName}' ainda presente (count={countOutput}). Tentando fallback winget...");

                    // Tentar com --name primeiro (mais confiável para apps com nomes diferentes do ID)
                    try
                    {
                        _logger.LogInfo($"[Debloat] [Winget] Tentativa 1: winget uninstall --id '{appName}'");
                        var wingetOutput = await RunPowerShellAsync($"winget uninstall --id '{appName}' --silent --accept-source-agreements --disable-interactivity 2>&1");
                        _logger.LogInfo($"[Debloat] [Winget] Output (--id): {(string.IsNullOrWhiteSpace(wingetOutput) ? "(vazio)" : wingetOutput.Trim())}");

                        // Verificar se winget reportou sucesso
                        bool wingetSuccess = !string.IsNullOrWhiteSpace(wingetOutput) &&
                            (wingetOutput.Contains("Successfully uninstalled", StringComparison.OrdinalIgnoreCase) ||
                             wingetOutput.Contains("desinstalado com êxito", StringComparison.OrdinalIgnoreCase));

                        if (!wingetSuccess)
                        {
                            // Tentar com --name como fallback
                            _logger.LogInfo($"[Debloat] [Winget] Tentativa 2: winget uninstall --name '{appName}'");
                            wingetOutput = await RunPowerShellAsync($"winget uninstall --name '{appName}' --silent --accept-source-agreements --disable-interactivity 2>&1");
                            _logger.LogInfo($"[Debloat] [Winget] Output (--name): {(string.IsNullOrWhiteSpace(wingetOutput) ? "(vazio)" : wingetOutput.Trim())}");
                        }

                        // Verificação final
                        countOutput = (await RunPowerShellAsync(verifyCmd)).Trim();
                        _logger.LogInfo($"[Debloat] [Winget] Contagem final de pacotes: '{countOutput}'");

                        if (countOutput == "0" || string.IsNullOrWhiteSpace(countOutput))
                        {
                            sw.Stop();
                            _logger.LogSuccess($"[Debloat] ✅ Aplicativo '{appName}' removido via winget em {sw.ElapsedMilliseconds}ms");
                            return true;
                        }

                        // ── ETAPA 6: Último recurso - DISM ──
                        _logger.LogWarning($"[Debloat] [DISM] Tentando remoção via DISM como último recurso...");
                        var dismCmd = $"Get-AppxProvisionedPackage -Online | Where-Object {{ $_.DisplayName -eq '{appName}' }} | ForEach-Object {{ $pkg = $_.PackageName; Write-Output \"DISM removendo provisionado: $pkg\"; dism /Online /Remove-ProvisionedAppxPackage /PackageName:$pkg 2>&1 }}; Get-AppxPackage -AllUsers -Name '{appName}' | ForEach-Object {{ Write-Output \"Removendo AppxPackage: $($_.PackageFullName)\"; Remove-AppxPackage -Package $_.PackageFullName -AllUsers -ErrorAction SilentlyContinue 2>&1 }}";
                        var dismOutput = await RunPowerShellAsync(dismCmd);
                        _logger.LogInfo($"[Debloat] [DISM] Output: {(string.IsNullOrWhiteSpace(dismOutput) ? "(vazio)" : dismOutput.Trim())}");

                        // Verificação final após DISM
                        countOutput = (await RunPowerShellAsync(verifyCmd)).Trim();
                        if (countOutput == "0" || string.IsNullOrWhiteSpace(countOutput))
                        {
                            sw.Stop();
                            _logger.LogSuccess($"[Debloat] ✅ Aplicativo '{appName}' removido via DISM em {sw.ElapsedMilliseconds}ms");
                            return true;
                        }

                        sw.Stop();
                        _logger.LogError($"[Debloat] ❌ FALHA TOTAL: Aplicativo '{appName}' NÃO pôde ser removido após todas as tentativas ({sw.ElapsedMilliseconds}ms)");
                        _logger.LogError($"[Debloat] ❌ Métodos tentados: Remove-AppxPackage, winget (--id e --name), DISM");
                        _logger.LogError($"[Debloat] ❌ Pacotes restantes: {countOutput}");

                        // Log detalhado do estado final
                        var finalState = await RunPowerShellAsync(listCmd);
                        _logger.LogError($"[Debloat] ❌ Estado final dos pacotes:\n{(string.IsNullOrWhiteSpace(finalState) ? "(nenhum)" : finalState.Trim())}");

                        return false;
                    }
                    catch (Exception ex)
                    {
                        sw.Stop();
                        _logger.LogError($"[Debloat] ❌ Exceção no fallback winget/DISM para '{appName}': {ex.Message}");
                        _logger.LogError($"[Debloat] ❌ StackTrace: {ex.StackTrace}");
                        return false;
                    }
                }
            }
            catch (Exception ex)
            {
                sw.Stop();
                _logger.LogError($"[Debloat] ❌ EXCEÇÃO FATAL na desinstalação de '{appName}': {ex.Message}");
                _logger.LogError($"[Debloat] ❌ StackTrace: {ex.StackTrace}");
                return false;
            }
        }

        public async Task<bool> RemoveTempFilesAsync()
        {
            try
            {
                _logger.LogInfo("Limpando arquivos temporários do sistema...");
                var tempPath = Path.GetTempPath();
                var winTempPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "Temp");

                await Task.Run(() => {
                    DeleteFiles(tempPath);
                    DeleteFiles(winTempPath);
                });

                _logger.LogSuccess("Limpeza de temporários concluída.");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError("Erro ao limpar temporários", ex);
                return false;
            }
        }

        private void DeleteFiles(string path)
        {
            if (!Directory.Exists(path)) return;
            var di = new DirectoryInfo(path);
            foreach (var file in di.GetFiles()) { try { file.Delete(); } catch { } }
            foreach (var dir in di.GetDirectories()) { try { dir.Delete(true); } catch { } }
        }

        private async Task<List<AppInfo>> GetUwpAppsAsync(bool uninstallableOnly)
        {
            var apps = new List<AppInfo>();
            try
            {
                var command = uninstallableOnly
                    ? "Get-AppxPackage -AllUsers | Where-Object { $_.NonRemovable -eq $false } | Select-Object Name,InstallLocation | Format-List"
                    : "Get-AppxPackage -AllUsers | Select-Object Name,InstallLocation | Format-List";

                _logger.LogDebug($"[Debloat] [UWP-Scan] Comando: {command}");
                var output = await RunPowerShellAsync(command);
                _logger.LogDebug($"[Debloat] [UWP-Scan] Output length: {output?.Length ?? 0} chars");
                
                string currentName = null;
                string currentLocation = null;

                foreach (var line in output.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    if (line.StartsWith("Name"))
                    {
                        if (!string.IsNullOrEmpty(currentName))
                        {
                             apps.Add(new AppInfo { Name = currentName, InstallLocation = currentLocation, IsWin32 = false });
                        }

                        var parts = line.Split(new[] { ':' }, 2);
                        if (parts.Length == 2) currentName = parts[1].Trim();
                        currentLocation = null;
                    }
                    else if (line.StartsWith("InstallLocation"))
                    {
                        var parts = line.Split(new[] { ':' }, 2);
                        if (parts.Length == 2) currentLocation = parts[1].Trim();
                    }
                    else if (!string.IsNullOrWhiteSpace(currentLocation) && line.StartsWith(" "))
                    {
                        currentLocation += " " + line.Trim();
                    }
                }

                if (!string.IsNullOrEmpty(currentName))
                {
                    apps.Add(new AppInfo { Name = currentName, InstallLocation = currentLocation, IsWin32 = false });
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[Debloat] [UWP-Scan] ❌ Erro ao obter apps UWP: {ex.Message}");
                _logger.LogDebug($"[Debloat] [UWP-Scan] StackTrace: {ex.StackTrace}");
            }
            return apps;
        }

        private async Task<string> RunPowerShellAsync(string command)
        {
            var psPath = Environment.Is64BitOperatingSystem && !Environment.Is64BitProcess
                ? Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "SysNative", "WindowsPowerShell", "v1.0", "powershell.exe")
                : Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "System32", "WindowsPowerShell", "v1.0", "powershell.exe");

            _logger.LogDebug($"[Debloat] [PS] Executando: {psPath}");
            _logger.LogDebug($"[Debloat] [PS] Comando: {command}");

            var sw = System.Diagnostics.Stopwatch.StartNew();
            using var process = new Process
            {
                StartInfo = new ProcessStartInfo
                {
                    FileName = psPath,
                    Arguments = $"-NoProfile -NonInteractive -Command \"{command}\"",
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    CreateNoWindow = true
                }
            };
            process.Start();
            _logger.LogDebug($"[Debloat] [PS] Processo iniciado PID={process.Id}");

            var outputTask = process.StandardOutput.ReadToEndAsync();
            var errorTask = process.StandardError.ReadToEndAsync();
            await process.WaitForExitAsync();
            sw.Stop();
            
            var output = await outputTask;
            var error = await errorTask;
            
            _logger.LogDebug($"[Debloat] [PS] ExitCode={process.ExitCode} | Tempo={sw.ElapsedMilliseconds}ms");
            
            if (!string.IsNullOrWhiteSpace(output))
            {
                _logger.LogDebug($"[Debloat] [PS] Stdout ({output.Length} chars): {output.Trim().Substring(0, Math.Min(output.Trim().Length, 500))}");
            }
            
            if (!string.IsNullOrWhiteSpace(error))
            {
                if (process.ExitCode != 0)
                {
                    _logger.LogError($"[Debloat] [PS] ❌ Stderr (ExitCode={process.ExitCode}): {error.Trim()}");
                }
                else
                {
                    _logger.LogWarning($"[Debloat] [PS] Stderr (ExitCode=0, não-fatal): {error.Trim()}");
                }
            }
            
            return output;
        }
    }
}
