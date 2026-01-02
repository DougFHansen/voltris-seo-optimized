using System;
using System.IO;
using Microsoft.Win32;
using VoltrisOptimizer.Helpers;

namespace VoltrisOptimizer.Services
{
    public class StartupService
    {
        private const string RegistryKey = @"SOFTWARE\Microsoft\Windows\CurrentVersion\Run";
        private const string StartupApprovedKey = @"SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\StartupApproved\Run";
        private const string AppName = "Voltris Optimizer";
        private const string LegacyAppName = "VoltrisOptimizer";

        public bool IsStartupEnabled()
        {
            try
            {
                var runValue = GetValueFromAnyView(RegistryKey, AppName) ?? GetValueFromAnyView(RegistryKey, LegacyAppName);
                if (runValue == null) return false;

                var approvedKind = GetValueKindFromAnyView(StartupApprovedKey, AppName) ?? GetValueKindFromAnyView(StartupApprovedKey, LegacyAppName);
                var approvedValue = GetValueFromAnyView(StartupApprovedKey, AppName) ?? GetValueFromAnyView(StartupApprovedKey, LegacyAppName);
                if (approvedValue == null) return true;
                if (approvedKind == RegistryValueKind.DWord)
                {
                    var v = (int)(approvedValue);
                    return v == 2;
                }

                if (approvedKind == RegistryValueKind.Binary)
                {
                    var bytes = approvedValue as byte[];
                    if (bytes != null && bytes.Length >= 4)
                    {
                        int status = BitConverter.ToInt32(bytes, 0);
                        return status == 2;
                    }
                }
                return true;
            }
            catch
            {
                return false;
            }
        }

        public void EnableStartup(string executablePath, bool startMinimized = false)
        {
            try
            {
                // CRÍTICO: Garantir que o caminho está correto e existe
                if (string.IsNullOrEmpty(executablePath))
                {
                    throw new Exception("Caminho do executável não fornecido.");
                }
                
                // Normalizar o caminho (usar caminho completo, sem espaços extras)
                executablePath = Path.GetFullPath(executablePath).Trim();
                
                // Verificar se o arquivo existe ANTES de configurar
                if (!File.Exists(executablePath))
                {
                    // Tentar encontrar o executável em locais alternativos
                    var alternatePath = TryFindExecutable();
                    if (!string.IsNullOrEmpty(alternatePath) && File.Exists(alternatePath))
                    {
                        executablePath = alternatePath;
                        LogStartupAction($"Caminho original não encontrado. Usando caminho alternativo: {executablePath}");
                    }
                    else
                    {
                        throw new Exception($"Executável não encontrado em: {executablePath}");
                    }
                }
                
                // Verificar extensão do arquivo (deve ser .exe)
                if (!executablePath.EndsWith(".exe", StringComparison.OrdinalIgnoreCase))
                {
                    throw new Exception($"O arquivo especificado não é um executável: {executablePath}");
                }
                
                // Logar para debug
                LogStartupAction($"===== CONFIGURANDO STARTUP =====");
                LogStartupAction($"Caminho do executável: {executablePath}");
                LogStartupAction($"Arquivo existe: {File.Exists(executablePath)}");
                LogStartupAction($"Tamanho do arquivo: {new FileInfo(executablePath).Length} bytes");
                LogStartupAction($"Iniciar minimizado: {startMinimized}");
                
                var keyDefault = RegistryHelper.OpenKeySafe(RegistryHive.CurrentUser, RegistryView.Default, RegistryKey, true)
                    ?? RegistryHelper.CreateKeyPath(RegistryHive.CurrentUser, RegistryView.Default, RegistryKey);
                var key64 = RegistryHelper.OpenKeySafe(RegistryHive.CurrentUser, RegistryView.Registry64, RegistryKey, true)
                    ?? RegistryHelper.CreateKeyPath(RegistryHive.CurrentUser, RegistryView.Registry64, RegistryKey);
                var key32 = RegistryHelper.OpenKeySafe(RegistryHive.CurrentUser, RegistryView.Registry32, RegistryKey, true)
                    ?? RegistryHelper.CreateKeyPath(RegistryHive.CurrentUser, RegistryView.Registry32, RegistryKey);
                if (keyDefault == null && key64 == null && key32 == null)
                {
                    throw new Exception("Não foi possível acessar o registro do Windows (HKCU\\Run).");
                }
                
                try { keyDefault?.DeleteValue(LegacyAppName, false); } catch { }
                try { key64?.DeleteValue(LegacyAppName, false); } catch { }
                try { key32?.DeleteValue(LegacyAppName, false); } catch { }
                // Criar comando - FORMATO CORRETO para Windows Registry Run
                // CRÍTICO: O Windows requer formato específico para argumentos
                // Formato: "C:\caminho\completo\exe.exe" /minimized
                // IMPORTANTE: Aspas ao redor do caminho, argumentos FORA das aspas
                string registryValue;
                
                if (startMinimized)
                {
                    // Formato com argumento: "C:\caminho\completo\exe.exe" /minimized
                    registryValue = $"\"{executablePath}\" /minimized";
                }
                else
                {
                    // Formato sem argumento: "C:\caminho\completo\exe.exe"
                    registryValue = $"\"{executablePath}\"";
                }
                
                LogStartupAction($"Comando que será salvo no registro: {registryValue}");
                
                // Salvar no registro
                keyDefault?.SetValue(AppName, registryValue, RegistryValueKind.String);
                key64?.SetValue(AppName, registryValue, RegistryValueKind.String);
                key32?.SetValue(AppName, registryValue, RegistryValueKind.String);
                keyDefault?.Flush();
                key64?.Flush();
                key32?.Flush();
                
                // Verificar se foi salvo corretamente (relendo)
                var savedValue = RegistryHelper.GetValueString(keyDefault, AppName) ?? RegistryHelper.GetValueString(key64, AppName) ?? RegistryHelper.GetValueString(key32, AppName);
                LogStartupAction($"Valor salvo no registro: {savedValue ?? "(null)"}");
                
                if (string.IsNullOrEmpty(savedValue))
                {
                    throw new Exception("O valor não foi salvo no registro. Verifique permissões.");
                }
                
                // Verificar se o valor corresponde
                var normalizedSaved = savedValue.Trim();
                var normalizedExpected = registryValue.Trim();
                
                if (!normalizedSaved.Equals(normalizedExpected, StringComparison.OrdinalIgnoreCase))
                {
                    LogStartupAction($"AVISO: Valor salvo difere do esperado.");
                    LogStartupAction($"  Esperado: {normalizedExpected}");
                    LogStartupAction($"  Salvo: {normalizedSaved}");
                    // Mesmo assim, pode funcionar - o Windows pode normalizar o caminho
                }
                
                var approvedDefault = RegistryHelper.OpenKeySafe(RegistryHive.CurrentUser, RegistryView.Default, StartupApprovedKey, true)
                    ?? RegistryHelper.CreateKeyPath(RegistryHive.CurrentUser, RegistryView.Default, StartupApprovedKey);
                var approved64 = RegistryHelper.OpenKeySafe(RegistryHive.CurrentUser, RegistryView.Registry64, StartupApprovedKey, true)
                    ?? RegistryHelper.CreateKeyPath(RegistryHive.CurrentUser, RegistryView.Registry64, StartupApprovedKey);
                var approved32 = RegistryHelper.OpenKeySafe(RegistryHive.CurrentUser, RegistryView.Registry32, StartupApprovedKey, true)
                    ?? RegistryHelper.CreateKeyPath(RegistryHive.CurrentUser, RegistryView.Registry32, StartupApprovedKey);
                foreach (var approvedKey in new[] { approvedDefault, approved64, approved32 })
                {
                    if (approvedKey == null) continue;
                    try { approvedKey.DeleteValue(LegacyAppName, false); } catch { }
                    approvedKey.SetValue(AppName, 2, RegistryValueKind.DWord);
                    var data = new byte[12];
                    data[0] = 0x02; data[1] = 0x00; data[2] = 0x00; data[3] = 0x00;
                    approvedKey.SetValue(AppName, data, RegistryValueKind.Binary);
                    approvedKey.Flush();
                }

                LogStartupAction("✓ Startup configurado com sucesso no registro!");
                LogStartupAction("===== FIM CONFIGURAÇÃO STARTUP =====\n");
            }
            catch (Exception ex)
            {
                LogStartupAction($"✗ ERRO ao habilitar inicialização: {ex.Message}");
                LogStartupAction($"StackTrace: {ex.StackTrace}");
                LogStartupAction("===== FIM CONFIGURAÇÃO STARTUP (COM ERRO) =====\n");
                throw new Exception($"Erro ao habilitar inicialização: {ex.Message}", ex);
            }
        }

        public void EnableStartupViaReflection(bool startMinimized = false)
        {
            string? exe = null;
            try { exe = System.Reflection.Assembly.GetEntryAssembly()?.Location; } catch { }
            if (string.IsNullOrEmpty(exe))
            {
                try { exe = System.Environment.ProcessPath; } catch { }
            }
            if (string.IsNullOrEmpty(exe))
            {
                exe = TryFindExecutable();
            }
            if (string.IsNullOrEmpty(exe))
            {
                throw new Exception("Não foi possível determinar o caminho do executável.");
            }
            EnableStartup(exe!, startMinimized);
        }
        
        /// <summary>
        /// Tenta encontrar o executável em locais comuns
        /// </summary>
        private string? TryFindExecutable()
        {
            var possiblePaths = new[]
            {
                System.Environment.ProcessPath,
                System.Reflection.Assembly.GetExecutingAssembly().Location,
                Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "VoltrisOptimizer.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Voltris Optimizer", "VoltrisOptimizer.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Voltris Optimizer", "VoltrisOptimizer.exe"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Voltris Optimizer", "VoltrisOptimizer.exe")
            };
            
            foreach (var path in possiblePaths)
            {
                if (!string.IsNullOrEmpty(path) && File.Exists(path))
                {
                    LogStartupAction($"Executável encontrado em: {path}");
                    return path;
                }
            }
            
            return null;
        }
        
        public string? GetStartupCommand()
        {
            try
            {
                using var key = RegistryHelper.OpenKeySafe(RegistryHive.CurrentUser, RegistryView.Default, RegistryKey, false);
                return RegistryHelper.GetValueString(key, AppName);
            }
            catch
            {
                return null;
            }
        }

        public void DisableStartup()
        {
            try
            {
                var keyDefault = RegistryHelper.OpenKeySafe(RegistryHive.CurrentUser, RegistryView.Default, RegistryKey, true);
                var key64 = RegistryHelper.OpenKeySafe(RegistryHive.CurrentUser, RegistryView.Registry64, RegistryKey, true);
                var key32 = RegistryHelper.OpenKeySafe(RegistryHive.CurrentUser, RegistryView.Registry32, RegistryKey, true);
                foreach (var k in new[] { keyDefault, key64, key32 })
                {
                    try { k?.DeleteValue(AppName, false); } catch { }
                    try { k?.DeleteValue(LegacyAppName, false); } catch { }
                    try { k?.Flush(); } catch { }
                }

                var approvedDefault = RegistryHelper.OpenKeySafe(RegistryHive.CurrentUser, RegistryView.Default, StartupApprovedKey, true);
                var approved64 = RegistryHelper.OpenKeySafe(RegistryHive.CurrentUser, RegistryView.Registry64, StartupApprovedKey, true);
                var approved32 = RegistryHelper.OpenKeySafe(RegistryHive.CurrentUser, RegistryView.Registry32, StartupApprovedKey, true);
                foreach (var ak in new[] { approvedDefault, approved64, approved32 })
                {
                    try { ak?.DeleteValue(AppName, false); } catch { }
                    try { ak?.DeleteValue(LegacyAppName, false); } catch { }
                    try { ak?.Flush(); } catch { }
                }
                LogStartupAction("Startup desabilitado.");
            }
            catch (Exception ex)
            {
                LogStartupAction($"ERRO ao desabilitar inicialização: {ex.Message}");
                throw new Exception($"Erro ao desabilitar inicialização: {ex.Message}", ex);
            }
        }

        public void ApplyDefaultStartupPolicy()
        {
            try
            {
                var enabled = IsStartupEnabled();
                if (!enabled)
                {
                    EnableStartupViaReflection(false);
                    return;
                }

                var runDefault = RegistryHelper.OpenKeySafe(RegistryHive.CurrentUser, RegistryView.Default, RegistryKey, true)
                    ?? RegistryHelper.CreateKeyPath(RegistryHive.CurrentUser, RegistryView.Default, RegistryKey);
                var run64 = RegistryHelper.OpenKeySafe(RegistryHive.CurrentUser, RegistryView.Registry64, RegistryKey, true)
                    ?? RegistryHelper.CreateKeyPath(RegistryHive.CurrentUser, RegistryView.Registry64, RegistryKey);
                var run32 = RegistryHelper.OpenKeySafe(RegistryHive.CurrentUser, RegistryView.Registry32, RegistryKey, true)
                    ?? RegistryHelper.CreateKeyPath(RegistryHive.CurrentUser, RegistryView.Registry32, RegistryKey);
                var approvedDefault = RegistryHelper.OpenKeySafe(RegistryHive.CurrentUser, RegistryView.Default, StartupApprovedKey, true)
                    ?? RegistryHelper.CreateKeyPath(RegistryHive.CurrentUser, RegistryView.Default, StartupApprovedKey);
                var approved64 = RegistryHelper.OpenKeySafe(RegistryHive.CurrentUser, RegistryView.Registry64, StartupApprovedKey, true)
                    ?? RegistryHelper.CreateKeyPath(RegistryHive.CurrentUser, RegistryView.Registry64, StartupApprovedKey);
                var approved32 = RegistryHelper.OpenKeySafe(RegistryHive.CurrentUser, RegistryView.Registry32, StartupApprovedKey, true)
                    ?? RegistryHelper.CreateKeyPath(RegistryHive.CurrentUser, RegistryView.Registry32, StartupApprovedKey);
                foreach (var k in new[] { runDefault, run64, run32 }) { try { k?.DeleteValue(LegacyAppName, false); } catch { } }
                foreach (var ak in new[] { approvedDefault, approved64, approved32 }) { try { ak?.DeleteValue(LegacyAppName, false); } catch { } }
                var runVal = runDefault?.GetValue(AppName) ?? run64?.GetValue(AppName) ?? run32?.GetValue(AppName);
                if (runVal == null)
                {
                    EnableStartupViaReflection(false);
                }
                else
                {
                    foreach (var ak in new[] { approvedDefault, approved64, approved32 })
                    {
                        try
                        {
                            ak?.SetValue(AppName, 2, RegistryValueKind.DWord);
                            var data = new byte[12]; data[0] = 0x02;
                            ak?.SetValue(AppName, data, RegistryValueKind.Binary);
                            ak?.Flush();
                        }
                        catch { }
                    }
                }
            }
            catch (Exception ex)
            {
                LogStartupAction($"Erro ao aplicar política de inicialização: {ex.Message}");
            }
        }

        private object? GetValueFromAnyView(string subKey, string valueName)
        {
            try
            {
                using var def = RegistryHelper.OpenKeySafe(RegistryHive.CurrentUser, RegistryView.Default, subKey, false);
                var v = def?.GetValue(valueName);
                if (v != null) return v;
                using var v64 = RegistryHelper.OpenKeySafe(RegistryHive.CurrentUser, RegistryView.Registry64, subKey, false);
                v = v64?.GetValue(valueName);
                if (v != null) return v;
                using var v32 = RegistryHelper.OpenKeySafe(RegistryHive.CurrentUser, RegistryView.Registry32, subKey, false);
                return v32?.GetValue(valueName);
            }
            catch { return null; }
        }

        private RegistryValueKind? GetValueKindFromAnyView(string subKey, string valueName)
        {
            try
            {
                using var def = RegistryHelper.OpenKeySafe(RegistryHive.CurrentUser, RegistryView.Default, subKey, false);
                if (def != null)
                {
                    try { return def.GetValueKind(valueName); } catch { }
                }
                using var v64 = RegistryHelper.OpenKeySafe(RegistryHive.CurrentUser, RegistryView.Registry64, subKey, false);
                if (v64 != null)
                {
                    try { return v64.GetValueKind(valueName); } catch { }
                }
                using var v32 = RegistryHelper.OpenKeySafe(RegistryHive.CurrentUser, RegistryView.Registry32, subKey, false);
                if (v32 != null)
                {
                    try { return v32.GetValueKind(valueName); } catch { }
                }
                return null;
            }
            catch { return null; }
        }
        
        private void LogStartupAction(string message)
        {
            try
            {
                var logDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs");
                if (!Directory.Exists(logDir))
                    Directory.CreateDirectory(logDir);
                    
                var logFile = Path.Combine(logDir, "startup_config.log");
                File.AppendAllText(logFile, $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] {message}\n");
            }
            catch
            {
                // Ignorar erros de log
            }
        }
    }
}
