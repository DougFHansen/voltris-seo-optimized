using System;
using System.Security;
using System.Security.Principal;
using System.Diagnostics;
using Microsoft.Win32;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Gerencia as entradas de "Iniciar com o Windows" de forma profissional e robusta.
    /// Implementa exatamente a lógica solicitada pelo script BAT: cria valores do tipo REG_SZ
    /// com nome "VoltrisOptimizer" e dados contendo o caminho completo do exe entre aspas.
    /// </summary>
    public class StartupManager
    {
        private const string ValueName = "VoltrisOptimizer";
        private readonly ILoggingService? _logger;

        public StartupManager(ILoggingService? logger)
        {
            _logger = logger;
        }

        // Subchaves alvo para startup persistente.
        // CORREÇÃO: Policies\Explorer\Run REMOVIDO — é uma chave de política de grupo
        // que o Windows trata como obrigatória e não pode ser desabilitada pelo usuário
        // no Gerenciador de Tarefas. Usar apenas Run para comportamento normal de startup.
        private static readonly string[] HklmSubKeys = new[]
        {
            @"Software\Microsoft\Windows\CurrentVersion\Run"
        };

        private static readonly string[] HkcuSubKeys = new[]
        {
            @"Software\Microsoft\Windows\CurrentVersion\Run"
        };

        /// <summary>
        /// Configura a inicialização (Ativa ou Desativa)
        /// </summary>
        public void SetStartup(bool enable, bool startMinimized)
        {
            if (enable)
            {
                EnableStartup(startMinimized);
            }
            else
            {
                DisableStartup();
            }
        }

        private void EnableStartup(bool startMinimized)
        {
            var exePath = Process.GetCurrentProcess().MainModule!.FileName;
            // Inclui o argumento --minimized quando configurado, necessário para iniciar minimizado na bandeja
            var valueData = startMinimized
                ? $"\"{exePath}\" --minimized"
                : $"\"{exePath}\""; // caminho completo entre aspas

            // 1. LIMPEZA PROFISSIONAL:
            // Removemos entradas de todas as outras localizações para garantir que apenas 1 apareça no Gerenciador de Tarefas.
            CleanLegacyPoliciesKeys();
            
            // Se formos admin, limpamos as chaves de HKLM para que não haja duplicatas.
            if (IsRunningAsAdministrator())
            {
                foreach (var subKey in HklmSubKeys)
                {
                    TryDeleteRegistryValue(RegistryHive.LocalMachine, RegistryView.Registry64, subKey, ValueName);
                    TryDeleteRegistryValue(RegistryHive.LocalMachine, RegistryView.Registry32, subKey, ValueName);
                }
            }

            // 2. REGISTRO ÚNICO (Padrão Profissional):
            // Usamos HKCU\Run como o local padrão. Isso é o que a maioria das aplicações (Spotify, Discord, etc) faz.
            foreach (var subKey in HkcuSubKeys)
            {
                TryWriteRegistry(RegistryHive.CurrentUser, RegistryView.Default, subKey, ValueName, valueData);
            }

            _logger?.LogInfo("[StartupManager] Inicialização configurada para registro único em HKCU.");
        }

        /// <summary>
        /// Remove entradas legadas de Policies\Explorer\Run gravadas por versões anteriores do app.
        /// </summary>
        private void CleanLegacyPoliciesKeys()
        {
            const string legacyHkcu = @"Software\Microsoft\Windows\CurrentVersion\Policies\Explorer\Run";
            const string legacyHklm = @"Software\Microsoft\Windows\CurrentVersion\Policies\Explorer\Run";

            TryDeleteRegistryValue(RegistryHive.CurrentUser, RegistryView.Default, legacyHkcu, ValueName);

            if (IsRunningAsAdministrator())
            {
                TryDeleteRegistryValue(RegistryHive.LocalMachine, RegistryView.Registry64, legacyHklm, ValueName);
                TryDeleteRegistryValue(RegistryHive.LocalMachine, RegistryView.Registry32, legacyHklm, ValueName);
            }
        }

        private void DisableStartup()
        {
            // Limpar chaves legadas também ao desabilitar
            CleanLegacyPoliciesKeys();

            foreach (var subKey in HkcuSubKeys)
            {
                TryDeleteRegistryValue(RegistryHive.CurrentUser, RegistryView.Default, subKey, ValueName);
            }

            if (IsRunningAsAdministrator())
            {
                if (Environment.Is64BitOperatingSystem)
                {
                    foreach (var subKey in HklmSubKeys)
                    {
                        TryDeleteRegistryValue(RegistryHive.LocalMachine, RegistryView.Registry64, subKey, ValueName);
                        TryDeleteRegistryValue(RegistryHive.LocalMachine, RegistryView.Registry32, subKey, ValueName);
                    }
                }
                else
                {
                    foreach (var subKey in HklmSubKeys)
                    {
                        TryDeleteRegistryValue(RegistryHive.LocalMachine, RegistryView.Default, subKey, ValueName);
                    }
                }
            }
        }

        /// <summary>
        /// Verifica se existe qualquer entrada válida de startup.
        /// Considera tanto o valor com quanto sem o argumento --minimized.
        /// </summary>
        public bool IsStartupEnabled()
        {
            var exePath = Process.GetCurrentProcess().MainModule!.FileName;
            var expectedBase = $"\"{exePath}\"";

            bool MatchesCurrentExe(string? val)
            {
                if (val == null) return false;
                // Aceita tanto "exe" quanto "exe --minimized"
                return val.StartsWith(expectedBase, StringComparison.OrdinalIgnoreCase);
            }

            // Checar HKCU (nosso local padrão)
            foreach (var subKey in HkcuSubKeys)
            {
                var val = TryReadRegistryValue(RegistryHive.CurrentUser, RegistryView.Default, subKey, ValueName);
                if (MatchesCurrentExe(val))
                    return true;
            }

            // Fallback para HKLM (caso não tenha passado pela limpeza ainda)
            if (IsRunningAsAdministrator())
            {
                foreach (var subKey in HklmSubKeys)
                {
                    var v1 = TryReadRegistryValue(RegistryHive.LocalMachine, RegistryView.Registry64, subKey, ValueName);
                    var v2 = TryReadRegistryValue(RegistryHive.LocalMachine, RegistryView.Registry32, subKey, ValueName);
                    if (MatchesCurrentExe(v1) || MatchesCurrentExe(v2))
                        return true;
                }
            }

            return false;
        }

        #region Helpers Registry

        private bool TryWriteRegistry(RegistryHive hive, RegistryView view, string subKey, string name, string data)
        {
            try
            {
                using (var baseKey = RegistryKey.OpenBaseKey(hive, view))
                using (var rk = baseKey.CreateSubKey(subKey, writable: true))
                {
                    rk.SetValue(name, data, RegistryValueKind.String);
                    _logger?.LogInfo($"Startup: gravado {hive} ({view})\\{subKey} -> {name} = {data}");
                    return true;
                }
            }
            catch (UnauthorizedAccessException ua)
            {
                _logger?.LogWarning($"Startup: sem permissão para gravar {hive} ({view})\\{subKey}: {ua.Message}");
                return false;
            }
            catch (SecurityException se)
            {
                _logger?.LogWarning($"Startup: falha de segurança ao gravar {hive} ({view})\\{subKey}: {se.Message}");
                return false;
            }
            catch (Exception ex)
            {
                _logger?.LogWarning($"Startup: erro ao gravar {hive} ({view})\\{subKey}: {ex.Message}");
                return false;
            }
        }

        private bool TryDeleteRegistryValue(RegistryHive hive, RegistryView view, string subKey, string name)
        {
            try
            {
                using (var baseKey = RegistryKey.OpenBaseKey(hive, view))
                using (var rk = baseKey.OpenSubKey(subKey, writable: true))
                {
                    if (rk == null) return false;
                    if (rk.GetValue(name) != null)
                    {
                        rk.DeleteValue(name);
                        _logger?.LogInfo($"Startup: removido {hive} ({view})\\{subKey} -> {name}");
                        return true;
                    }
                }
            }
            catch (UnauthorizedAccessException ua)
            {
                _logger?.LogWarning($"Startup: sem permissão para deletar {hive} ({view})\\{subKey}: {ua.Message}");
            }
            catch (Exception ex)
            {
                _logger?.LogWarning($"Startup: erro ao deletar {hive} ({view})\\{subKey}: {ex.Message}");
            }
            return false;
        }

        private string? TryReadRegistryValue(RegistryHive hive, RegistryView view, string subKey, string name)
        {
            try
            {
                using (var baseKey = RegistryKey.OpenBaseKey(hive, view))
                using (var rk = baseKey.OpenSubKey(subKey, writable: false)) // apenas leitura
                {
                    if (rk == null) return null;
                    var v = rk.GetValue(name) as string;
                    return v;
                }
            }
            catch (Exception ex)
            {
                _logger?.LogWarning($"Startup: erro ao ler {hive} ({view})\\{subKey}: {ex.Message}");
                return null;
            }
        }

        private static bool IsRunningAsAdministrator()
        {
            try
            {
                using (WindowsIdentity identity = WindowsIdentity.GetCurrent())
                {
                    var principal = new WindowsPrincipal(identity);
                    return principal.IsInRole(WindowsBuiltInRole.Administrator);
                }
            }
            catch
            {
                return false;
            }
        }

        #endregion
    }
}
