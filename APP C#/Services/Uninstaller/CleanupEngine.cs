using System;
using System.Collections.Generic;
using System.IO;
using System.Diagnostics;
using Microsoft.Win32;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.Services.Uninstaller
{
    public class CleanupEngine
    {
        private readonly ILoggingService _logger;

        public CleanupEngine(ILoggingService logger)
        {
            _logger = logger;
        }

        public void KillProcesses(string appName, string? publisher)
        {
            _logger.LogInfo($"Finalizando processos relacionados a: {appName}");
            foreach (var proc in Process.GetProcesses())
            {
                try
                {
                    if (proc.ProcessName.Contains(appName, StringComparison.OrdinalIgnoreCase))
                    {
                        proc.Kill();
                        _logger.LogInfo($"Processo finalizado: {proc.ProcessName}");
                    }
                }
                catch { }
            }
        }

        public void DeleteFolders(List<string> folders)
        {
            _logger.LogInfo($"[Cleanup] Iniciando remoção de {folders.Count} pastas...");
            
            foreach (var folder in folders)
            {
                if (!Directory.Exists(folder))
                {
                    _logger.LogInfo($"[Cleanup]   ⊘ Pasta já não existe: {folder}");
                    continue;
                }

                try
                {
                    _logger.LogInfo($"[Cleanup]   → Removendo: {folder}");
                    
                    // Tentar remover atributos readonly recursivamente
                    try
                    {
                        var dirInfo = new DirectoryInfo(folder);
                        SetAttributesNormal(dirInfo);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"[Cleanup]   ⚠ Falha ao remover atributos: {ex.Message}");
                    }
                    
                    // Tentar remoção direta
                    Directory.Delete(folder, true);
                    _logger.LogSuccess($"[Cleanup]   ✓ Pasta removida: {folder}");
                }
                catch (UnauthorizedAccessException)
                {
                    _logger.LogWarning($"[Cleanup]   ✗ Acesso negado: {folder}");
                    
                    // Tentar com takeown e icacls
                    TryForceDeleteWithPermissions(folder);
                }
                catch (IOException ex)
                {
                    _logger.LogWarning($"[Cleanup]   ✗ Erro de I/O: {folder} - {ex.Message}");
                    
                    // Tentar forçar com cmd
                    TryForceDeleteWithCmd(folder);
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[Cleanup]   ✗ Erro ao remover {folder}: {ex.Message}");
                }
            }
        }

        private void SetAttributesNormal(DirectoryInfo dir)
        {
            // Remover readonly de todos os arquivos
            foreach (var file in dir.GetFiles("*", SearchOption.AllDirectories))
            {
                try
                {
                    file.Attributes = FileAttributes.Normal;
                }
                catch { }
            }
            
            // Remover readonly de todas as pastas
            foreach (var subDir in dir.GetDirectories("*", SearchOption.AllDirectories))
            {
                try
                {
                    subDir.Attributes = FileAttributes.Normal;
                }
                catch { }
            }
            
            dir.Attributes = FileAttributes.Normal;
        }

        private void TryForceDeleteWithPermissions(string folder)
        {
            try
            {
                _logger.LogInfo($"[Cleanup]   ⚡ Tentando remoção forçada com permissões: {folder}");
                
                // Tomar posse da pasta
                using var takeown = Process.Start(new ProcessStartInfo
                {
                    FileName = "takeown.exe",
                    Arguments = $"/F \"{folder}\" /R /D Y",
                    CreateNoWindow = true,
                    UseShellExecute = false,
                    RedirectStandardOutput = true
                });
                takeown?.WaitForExit(10000);
                
                // Dar permissões totais
                using var icacls = Process.Start(new ProcessStartInfo
                {
                    FileName = "icacls.exe",
                    Arguments = $"\"{folder}\" /grant *S-1-1-0:F /T /C /Q",
                    CreateNoWindow = true,
                    UseShellExecute = false,
                    RedirectStandardOutput = true
                });
                icacls?.WaitForExit(10000);
                
                // Tentar remover novamente
                Directory.Delete(folder, true);
                _logger.LogSuccess($"[Cleanup]   ✓ Pasta removida com permissões forçadas: {folder}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[Cleanup]   ✗ Falha na remoção forçada: {ex.Message}");
            }
        }

        private void TryForceDeleteWithCmd(string folder)
        {
            try
            {
                _logger.LogInfo($"[Cleanup]   ⚡ Tentando remoção com CMD: {folder}");
                
                using var process = Process.Start(new ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    Arguments = $"/C rd /S /Q \"{folder}\"",
                    CreateNoWindow = true,
                    UseShellExecute = false,
                    RedirectStandardOutput = true
                });
                process?.WaitForExit(15000);
                
                if (!Directory.Exists(folder))
                {
                    _logger.LogSuccess($"[Cleanup]   ✓ Pasta removida com CMD: {folder}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[Cleanup]   ✗ Falha com CMD: {ex.Message}");
            }
        }

        public void DeleteRegistryKeys(List<string> keys)
        {
            foreach (var keyPath in keys)
            {
                try
                {
                    // Format: HKEY_LOCAL_MACHINE\PATH\TO\KEY
                    _logger.LogInfo($"[Cleanup] Tentando remover chave: {keyPath}");
                    
                    var parts = keyPath.Split('\\', 2);
                    if (parts.Length < 2)
                    {
                        _logger.LogWarning($"[Cleanup] Formato de chave inválido: {keyPath}");
                        continue;
                    }

                    var hiveStr = parts[0];
                    var subPath = parts[1];

                    RegistryHive hive;
                    RegistryKey? hiveKey = null;

                    switch (hiveStr)
                    {
                        case "HKEY_LOCAL_MACHINE":
                            hive = RegistryHive.LocalMachine;
                            break;
                        case "HKEY_CURRENT_USER":
                            hive = RegistryHive.CurrentUser;
                            break;
                        case "HKEY_CLASSES_ROOT":
                            hive = RegistryHive.ClassesRoot;
                            break;
                        default:
                            _logger.LogWarning($"[Cleanup] Hive desconhecido: {hiveStr}");
                            continue;
                    }

                    // Try both 64-bit and 32-bit views to handle WOW6432Node redirection
                    bool deleted = false;
                    
                    // Try 64-bit view first
                    try
                    {
                        hiveKey = RegistryKey.OpenBaseKey(hive, RegistryView.Registry64);
                        using var testKey = hiveKey.OpenSubKey(subPath);
                        if (testKey != null)
                        {
                            _logger.LogInfo($"[Cleanup] Chave encontrada em 64-bit view, deletando...");
                            hiveKey.DeleteSubKeyTree(subPath, false);
                            deleted = true;
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogInfo($"[Cleanup] Não encontrado em 64-bit view ou erro: {ex.Message}");
                    }
                    finally
                    {
                        hiveKey?.Dispose();
                    }

                    // Try 32-bit view if not deleted
                    if (!deleted)
                    {
                        try
                        {
                            hiveKey = RegistryKey.OpenBaseKey(hive, RegistryView.Registry32);
                            using var testKey = hiveKey.OpenSubKey(subPath);
                            if (testKey != null)
                            {
                                _logger.LogInfo($"[Cleanup] Chave encontrada em 32-bit view, deletando...");
                                hiveKey.DeleteSubKeyTree(subPath, false);
                                deleted = true;
                            }
                        }
                        catch (Exception ex)
                        {
                            _logger.LogInfo($"[Cleanup] Não encontrado em 32-bit view ou erro: {ex.Message}");
                        }
                        finally
                        {
                            hiveKey?.Dispose();
                        }
                    }

                    // Verify deletion
                    if (deleted)
                    {
                        // Double-check in both views
                        bool stillExists = false;
                        try
                        {
                            using var check64 = RegistryKey.OpenBaseKey(hive, RegistryView.Registry64).OpenSubKey(subPath);
                            if (check64 != null) stillExists = true;
                        }
                        catch { }

                        try
                        {
                            using var check32 = RegistryKey.OpenBaseKey(hive, RegistryView.Registry32).OpenSubKey(subPath);
                            if (check32 != null) stillExists = true;
                        }
                        catch { }

                        if (stillExists)
                        {
                            _logger.LogWarning($"[Cleanup] ATENÇÃO: A chave {keyPath} ainda existe após deleção!");
                        }
                        else
                        {
                            _logger.LogSuccess($"[Cleanup] ✓ Chave {keyPath} removida com sucesso do sistema.");
                        }
                    }
                    else
                    {
                        _logger.LogWarning($"[Cleanup] Chave {keyPath} não foi encontrada em nenhuma view do registro.");
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[Cleanup] Erro ao remover chave {keyPath}: {ex.Message}");
                }
            }
        }

        public void RemoveServices(List<string> services)
        {
            foreach (var srv in services)
            {
                try
                {
                    _logger.LogInfo($"Removendo serviço residual: {srv}");
                    using var proc = Process.Start(new ProcessStartInfo
                    {
                        FileName = "sc.exe",
                        Arguments = $"delete \"{srv}\"",
                        CreateNoWindow = true,
                        UseShellExecute = false
                    });
                    proc?.WaitForExit();
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"Falha ao remover serviço {srv}: {ex.Message}");
                }
            }
        }
    }
}
