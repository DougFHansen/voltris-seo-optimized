using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;

namespace VoltrisOptimizer.Services.Performance
{
    /// <summary>
    /// Módulo de otimização de Scheduled Tasks do Windows.
    /// Desativa tarefas agendadas de telemetria, diagnóstico e coleta de dados.
    /// Suporta backup/restore completo para reversão segura.
    /// </summary>
    public sealed class ScheduledTasksOptimizer
    {
        private readonly ILoggingService _logger;
        private readonly string _backupPath;

        /// <summary>
        /// Lista completa de tarefas agendadas a desativar, agrupadas por categoria.
        /// </summary>
        private static readonly Dictionary<string, string[]> TasksByCategory = new()
        {
            ["Customer Experience Improvement Program"] = new[]
            {
                @"\Microsoft\Windows\Customer Experience Improvement Program\Consolidator",
                @"\Microsoft\Windows\Customer Experience Improvement Program\KernelCeipTask",
                @"\Microsoft\Windows\Customer Experience Improvement Program\UsbCeip",
                @"\Microsoft\Windows\Customer Experience Improvement Program\Uploader"
            },
            ["Application Experience / Telemetria"] = new[]
            {
                @"\Microsoft\Windows\Application Experience\Microsoft Compatibility Appraiser",
                @"\Microsoft\Windows\Application Experience\ProgramDataUpdater",
                @"\Microsoft\Windows\Application Experience\StartupAppTask",
                @"\Microsoft\Windows\Application Experience\AitAgent"
            },
            ["Diagnóstico de Disco"] = new[]
            {
                @"\Microsoft\Windows\DiskDiagnostic\Microsoft-Windows-DiskDiagnosticDataCollector",
                @"\Microsoft\Windows\DiskDiagnostic\Microsoft-Windows-DiskDiagnosticResolver",
                @"\Microsoft\Windows\DiskFootprint\Diagnostics"
            },
            ["Diagnóstico e Troubleshooting"] = new[]
            {
                @"\Microsoft\Windows\Power Efficiency Diagnostics\AnalyzeSystem",
                @"\Microsoft\Windows\Diagnosis\RecommendedTroubleshootingScanner",
                @"\Microsoft\Windows\Diagnosis\Scheduled"
            },
            ["Family Safety / Shell"] = new[]
            {
                @"\Microsoft\Windows\Shell\FamilySafetyMonitor",
                @"\Microsoft\Windows\Shell\FamilySafetyRefresh",
                @"\Microsoft\Windows\Shell\FamilySafetyUpload"
            },
            ["Manutenção e Sistema"] = new[]
            {
                @"\Microsoft\Windows\Autochk\Proxy",
                @"\Microsoft\Windows\Maintenance\WinSAT",
                @"\Microsoft\Windows\Defrag\ScheduledDefrag",
                @"\Microsoft\Windows\SystemRestore\SR"
            },
            ["Error Reporting e Cloud"] = new[]
            {
                @"\Microsoft\Windows\Windows Error Reporting\QueueReporting",
                @"\Microsoft\Windows\CloudExperienceHost\CreateObjectTask"
            },
            ["Coleta de Dados e Rede"] = new[]
            {
                @"\Microsoft\Windows\PI\Sqm-Tasks",
                @"\Microsoft\Windows\NetTrace\GatherNetworkInfo",
                @"\Microsoft\Windows\Device Information\Device"
            },
            ["Office Telemetria"] = new[]
            {
                @"\Microsoft\Office\OfficeTelemetryAgentFallBack2016",
                @"\Microsoft\Office\OfficeTelemetryAgentLogOn2016",
                @"\Microsoft\Office\OfficeTelemetryAgentLogOn",
                @"\Microsoft\Office\OfficeTelemetryAgentFallBack",
                @"\Microsoft\Office\Office 15 Subscription Heartbeat"
            },
            ["Sincronização e Localização"] = new[]
            {
                @"\Microsoft\Windows\Time Synchronization\ForceSynchronizeTime",
                @"\Microsoft\Windows\Time Synchronization\SynchronizeTime",
                @"\Microsoft\Windows\Location\Notifications",
                @"\Microsoft\Windows\Location\WindowsActionDialog"
            },
            ["Diversos"] = new[]
            {
                @"\Microsoft\Windows\AppID\SmartScreenSpecific",
                @"\Microsoft\Windows\Bluetooth\UninstallDeviceTask",
                @"\Microsoft\Windows\Maps\MapsToastTask",
                @"\Microsoft\Windows\RemoteAssistance\RemoteAssistanceTask",
                @"\Microsoft\Windows\RetailDemo\CleanupOfflineContent",
                @"\Microsoft\Windows\Speech\SpeechModelDownloadTask",
                @"\Microsoft\Windows\Sysmain\ResPriStaticDbSync",
                @"\Microsoft\Windows\Sysmain\WsSwapAssessmentTask",
                @"\Microsoft\XblGameSave\XblGameSaveTask",
                @"\Microsoft\Windows\Work Folders\Work Folders Logon Synchronization",
                @"\Microsoft\Windows\Work Folders\Work Folders Maintenance Work",
                @"\Microsoft\Windows\Mobile Broadband Accounts\MNO Metadata Parser"
            }
        };

        public ScheduledTasksOptimizer(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _backupPath = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "VoltrisOptimizer", "Backups", "ScheduledTasks");
            Directory.CreateDirectory(_backupPath);
        }

        /// <summary>
        /// Retorna todas as task paths como lista plana.
        /// </summary>
        public static IReadOnlyList<string> GetAllTaskPaths()
        {
            var all = new List<string>();
            foreach (var group in TasksByCategory.Values)
                all.AddRange(group);
            return all;
        }

        /// <summary>
        /// Desativa todas as tarefas agendadas de telemetria/diagnóstico.
        /// Faz backup do estado anterior para permitir reversão.
        /// </summary>
        public void DisableAllTasks()
        {
            _logger.LogInfo("[ScheduledTasks] ========== INÍCIO: Desativar Tarefas Agendadas ==========");
            var backup = new Dictionary<string, string>();
            int successCount = 0;
            int skipCount = 0;
            int errorCount = 0;

            foreach (var kvp in TasksByCategory)
            {
                _logger.LogInfo($"[ScheduledTasks] Processando grupo: {kvp.Key} ({kvp.Value.Length} tarefas)");

                foreach (var taskPath in kvp.Value)
                {
                    try
                    {
                        // Verificar estado atual antes de desativar
                        var currentState = QueryTaskState(taskPath);
                        backup[taskPath] = currentState;

                        if (currentState == "Disabled" || currentState == "NotFound")
                        {
                            _logger.LogInfo($"[ScheduledTasks] SKIP: '{taskPath}' já está {currentState}");
                            skipCount++;
                            continue;
                        }

                        // Encerrar a tarefa se estiver rodando
                        EndTask(taskPath);

                        // Desativar a tarefa
                        bool disabled = DisableTask(taskPath);
                        if (disabled)
                        {
                            successCount++;
                            _logger.LogSuccess($"[ScheduledTasks] ✓ Desativada: {taskPath}");
                        }
                        else
                        {
                            errorCount++;
                            _logger.LogWarning($"[ScheduledTasks] ✗ Falha ao desativar: {taskPath}");
                        }
                    }
                    catch (Exception ex)
                    {
                        errorCount++;
                        backup[taskPath] = "Error";
                        _logger.LogError($"[ScheduledTasks] Erro em '{taskPath}': {ex.Message}", ex);
                    }
                }
            }

            // Salvar backup
            SaveBackup(backup);

            _logger.LogInfo($"[ScheduledTasks] ========== FIM: {successCount} desativadas, {skipCount} ignoradas, {errorCount} erros ==========");
        }

        /// <summary>
        /// Restaura todas as tarefas ao estado original usando o backup salvo.
        /// </summary>
        public void RestoreAllTasks()
        {
            _logger.LogInfo("[ScheduledTasks] ========== INÍCIO: Restaurar Tarefas Agendadas ==========");

            var backup = LoadBackup();
            if (backup == null || backup.Count == 0)
            {
                _logger.LogWarning("[ScheduledTasks] Nenhum backup encontrado. Reativando todas as tarefas conhecidas.");
                EnableAllKnownTasks();
                return;
            }

            int restored = 0;
            int errors = 0;

            foreach (var kvp in backup)
            {
                try
                {
                    // Só reativar se o estado original era Ready/Running
                    if (kvp.Value == "Ready" || kvp.Value == "Running")
                    {
                        bool enabled = EnableTask(kvp.Key);
                        if (enabled)
                        {
                            restored++;
                            _logger.LogSuccess($"[ScheduledTasks] ✓ Restaurada: {kvp.Key}");
                        }
                        else
                        {
                            errors++;
                            _logger.LogWarning($"[ScheduledTasks] ✗ Falha ao restaurar: {kvp.Key}");
                        }
                    }
                    else
                    {
                        _logger.LogInfo($"[ScheduledTasks] SKIP restauração: '{kvp.Key}' estado original era '{kvp.Value}'");
                    }
                }
                catch (Exception ex)
                {
                    errors++;
                    _logger.LogError($"[ScheduledTasks] Erro ao restaurar '{kvp.Key}': {ex.Message}", ex);
                }
            }

            // Limpar backup após restauração
            ClearBackup();

            _logger.LogInfo($"[ScheduledTasks] ========== FIM: {restored} restauradas, {errors} erros ==========");
        }

        /// <summary>
        /// Consulta o estado atual de uma tarefa agendada.
        /// </summary>
        private string QueryTaskState(string taskPath)
        {
            try
            {
                var safeTaskPath = SanitizeTaskPath(taskPath);
                var (output, exitCode) = RunSchtasks($"/Query /TN \"{safeTaskPath}\" /FO CSV /NH");
                if (exitCode != 0 || string.IsNullOrWhiteSpace(output) 
                    || output.Contains("ERROR", StringComparison.OrdinalIgnoreCase) 
                    || output.Contains("ERRO", StringComparison.OrdinalIgnoreCase))
                    return "NotFound";

                // CSV: "TaskName","Next Run Time","Status"
                var parts = output.Split(',');
                if (parts.Length >= 3)
                {
                    var status = parts[2].Trim().Trim('"');
                    return status; // Ready, Running, Disabled, etc.
                }

                return "Unknown";
            }
            catch
            {
                return "NotFound";
            }
        }

        /// <summary>
        /// Encerra uma tarefa agendada se estiver rodando.
        /// </summary>
        private void EndTask(string taskPath)
        {
            try
            {
                var safeTaskPath = SanitizeTaskPath(taskPath);
                var (output, _) = RunSchtasks($"/End /TN \"{safeTaskPath}\"");
                _logger.LogInfo($"[ScheduledTasks] End '{taskPath}': {output.Trim()}");
            }
            catch (Exception ex)
            {
                // Não é erro crítico se a tarefa não estiver rodando
                _logger.LogInfo($"[ScheduledTasks] End '{taskPath}' (ignorável): {ex.Message}");
            }
        }

        /// <summary>
        /// Desativa uma tarefa agendada.
        /// </summary>
        private bool DisableTask(string taskPath)
        {
            try
            {
                var safeTaskPath = SanitizeTaskPath(taskPath);
                var (output, exitCode) = RunSchtasks($"/Change /TN \"{safeTaskPath}\" /Disable");
                // Exit code 0 = sucesso, independente do encoding do output
                if (exitCode == 0) return true;
                // Fallback: verificar texto (com encoding corrigido)
                bool success = output.Contains("SUCCESS", StringComparison.OrdinalIgnoreCase) 
                    || output.Contains("ÊXITO", StringComparison.OrdinalIgnoreCase) 
                    || output.Contains("XITO", StringComparison.OrdinalIgnoreCase)
                    || output.Contains("alterada", StringComparison.OrdinalIgnoreCase)
                    || output.Contains("changed", StringComparison.OrdinalIgnoreCase);
                return success;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[ScheduledTasks] Disable '{taskPath}': {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Reativa uma tarefa agendada.
        /// </summary>
        private bool EnableTask(string taskPath)
        {
            try
            {
                var safeTaskPath = SanitizeTaskPath(taskPath);
                var (output, exitCode) = RunSchtasks($"/Change /TN \"{safeTaskPath}\" /Enable");
                if (exitCode == 0) return true;
                bool success = output.Contains("SUCCESS", StringComparison.OrdinalIgnoreCase) 
                    || output.Contains("ÊXITO", StringComparison.OrdinalIgnoreCase) 
                    || output.Contains("XITO", StringComparison.OrdinalIgnoreCase)
                    || output.Contains("alterada", StringComparison.OrdinalIgnoreCase)
                    || output.Contains("changed", StringComparison.OrdinalIgnoreCase);
                return success;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[ScheduledTasks] Enable '{taskPath}': {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Reativa todas as tarefas conhecidas (fallback sem backup).
        /// </summary>
        private void EnableAllKnownTasks()
        {
            int count = 0;
            foreach (var group in TasksByCategory.Values)
            {
                foreach (var taskPath in group)
                {
                    try
                    {
                        EnableTask(taskPath);
                        count++;
                    }
                    catch { /* ignorar erros individuais */ }
                }
            }
            _logger.LogInfo($"[ScheduledTasks] Fallback: tentou reativar {count} tarefas");
        }

        /// <summary>
        /// Sanitiza um task path para uso seguro como argumento de schtasks.exe.
        /// Remove caracteres que poderiam causar injeção de comando.
        /// </summary>
        private static string SanitizeTaskPath(string taskPath)
        {
            if (string.IsNullOrEmpty(taskPath)) return taskPath;
            // Permitir apenas caracteres válidos para task paths do Windows: letras, números, espaços, \, /, -, _
            var sanitized = System.Text.RegularExpressions.Regex.Replace(taskPath, @"[^a-zA-Z0-9\s\\_/\-\.]", "");
            return sanitized;
        }

        /// <summary>
        /// Executa schtasks.exe com os argumentos fornecidos.
        /// Task paths são sanitizados para prevenir injeção de comando.
        /// </summary>
        private static (string Output, int ExitCode) RunSchtasks(string arguments)
        {
            using var process = new Process();
            process.StartInfo = new ProcessStartInfo
            {
                FileName = "schtasks.exe",
                Arguments = arguments,
                UseShellExecute = false,
                RedirectStandardOutput = true,
                RedirectStandardError = true,
                CreateNoWindow = true,
                WindowStyle = ProcessWindowStyle.Hidden
            };

            // Registrar CodePages para suportar encoding OEM (CP850/437)
            try { System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance); } catch { }
            try
            {
                process.StartInfo.StandardOutputEncoding = System.Text.Encoding.GetEncoding(850);
                process.StartInfo.StandardErrorEncoding = System.Text.Encoding.GetEncoding(850);
            }
            catch
            {
                // Fallback: se CP850 não disponível, usar default
            }

            process.Start();
            string output = process.StandardOutput.ReadToEnd();
            string error = process.StandardError.ReadToEnd();
            process.WaitForExit(10000); // 10s timeout por tarefa

            var text = string.IsNullOrEmpty(output) ? error : output;
            return (text, process.ExitCode);
        }

        #region Backup / Restore

        private void SaveBackup(Dictionary<string, string> states)
        {
            try
            {
                var filePath = Path.Combine(_backupPath, "scheduled_tasks_backup.json");
                var json = JsonSerializer.Serialize(states, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(filePath, json);
                _logger.LogInfo($"[ScheduledTasks] Backup salvo: {states.Count} tarefas em {filePath}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[ScheduledTasks] Erro ao salvar backup: {ex.Message}", ex);
            }
        }

        private Dictionary<string, string>? LoadBackup()
        {
            try
            {
                var filePath = Path.Combine(_backupPath, "scheduled_tasks_backup.json");
                if (!File.Exists(filePath))
                    return null;

                var json = File.ReadAllText(filePath);
                return JsonSerializer.Deserialize<Dictionary<string, string>>(json);
            }
            catch (Exception ex)
            {
                _logger.LogError($"[ScheduledTasks] Erro ao carregar backup: {ex.Message}", ex);
                return null;
            }
        }

        private void ClearBackup()
        {
            try
            {
                var filePath = Path.Combine(_backupPath, "scheduled_tasks_backup.json");
                if (File.Exists(filePath))
                    File.Delete(filePath);
                _logger.LogInfo("[ScheduledTasks] Backup limpo após restauração");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[ScheduledTasks] Erro ao limpar backup: {ex.Message}");
            }
        }

        #endregion
    }
}
