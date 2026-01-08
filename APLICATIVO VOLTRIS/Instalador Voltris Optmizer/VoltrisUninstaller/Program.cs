using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Principal;
using System.Windows;
using VoltrisUninstaller.Core;

namespace VoltrisUninstaller
{
    /// <summary>
    /// Ponto de entrada da aplicação
    /// </summary>
    public class Program
    {
        [STAThread]
        public static int Main(string[] args)
        {
            try
            {
                // CRÍTICO: Verificar se estamos dentro da pasta de instalação ANTES de qualquer coisa
                // Se estivermos, reiniciar a partir de uma pasta temporária
                if (!args.Contains("--moved-to-temp", StringComparer.OrdinalIgnoreCase))
                {
                    var shouldRestart = CheckAndMoveToTempIfNeeded(args);
                    if (shouldRestart)
                    {
                        return 0; // O novo processo foi iniciado
                    }
                }
                
                // Parse de argumentos CLI
                var options = ParseArguments(args);
                
                // Criar logger
                var logPath = options.LogPath;
                if (string.IsNullOrWhiteSpace(logPath))
                {
                    var exePath = System.Reflection.Assembly.GetExecutingAssembly().Location;
                    var exeDir = string.IsNullOrEmpty(exePath) 
                        ? AppContext.BaseDirectory 
                        : Path.GetDirectoryName(exePath) ?? AppContext.BaseDirectory;
                    
                    var logDir = Path.Combine(exeDir, "Logs");
                    Directory.CreateDirectory(logDir);
                    logPath = Path.Combine(logDir, $"uninstall-{DateTime.Now:yyyyMMdd-HHmmss}.log");
                }
                
                var logger = new Logger(logPath);
                
                logger.LogInfo("=== VOLTRIS UNINSTALLER v1.0 ===");
                logger.LogInfo($"Argumentos recebidos: {string.Join(" ", args)}");
                logger.LogInfo($"Modo: {(options.Silent ? "Silent" : "Interativo")}");
                logger.LogInfo($"Manter dados do usuário: {options.KeepUserData}");

                // Verificar privilégios de administrador
                var isAdmin = IsAdministrator();
                logger.LogInfo($"Privilégios de administrador: {isAdmin}");
                
                if (!isAdmin)
                {
                    logger.LogWarning("Desinstalador requer privilégios de administrador. Tentando elevar...");
                    if (TryElevate(args))
                    {
                        return 0;
                    }
                    else
                    {
                        MessageBox.Show(
                            "Este desinstalador requer privilégios de administrador.\n\n" +
                            "Por favor, execute como administrador.",
                            "Privilégios Insuficientes",
                            MessageBoxButton.OK,
                            MessageBoxImage.Warning
                        );
                        return 1;
                    }
                }

                // Modo silent - executar diretamente
                if (options.Silent)
                {
                    logger.LogInfo("Executando em modo silent...");
                    return RunSilentMode(logger, options);
                }

                // Modo interativo - mostrar UI
                logger.LogInfo("Iniciando modo interativo...");
                
                // Criar App primeiro (isso inicializa os recursos)
                var app = new App();
                
                // Garantir que Application.Current.Resources esteja definido
                if (Application.Current != null && Application.Current.Resources == null)
                {
                    Application.Current.Resources = app.Resources;
                }
                
                // Agora criar MainWindow (recursos já estão disponíveis)
                var mainWindow = new MainWindow(logger, options);
                app.Run(mainWindow);
                
                logger.LogInfo("Desinstalador finalizado com sucesso");
                return 0;
            }
            catch (Exception ex)
            {
                try
                {
                    var emergencyLog = Path.Combine(Path.GetTempPath(), "VoltrisUninstaller_EMERGENCY.log");
                    File.AppendAllText(emergencyLog, $"[{DateTime.Now}] ERRO FATAL: {ex.Message}\n{ex.StackTrace}\n\n");
                }
                catch { }
                
                MessageBox.Show(
                    $"Erro fatal ao iniciar o desinstalador:\n\n{ex.Message}\n\n" +
                    "Verifique os logs para mais informações.",
                    "Erro Fatal",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error
                );
                
                return 1;
            }
        }

        private static UninstallOptions ParseArguments(string[] args)
        {
            var options = new UninstallOptions();

            for (int i = 0; i < args.Length; i++)
            {
                var arg = args[i].ToLowerInvariant();

                if (arg == "/silent" || arg == "--silent" || arg == "/s" || arg == "/verysilent" || arg == "/quiet")
                {
                    options.Silent = true;
                }
                else if (arg == "/keep-user-data" || arg == "--keep-user-data" || arg == "/keepdata")
                {
                    options.KeepUserData = true;
                }
                else if (arg == "/dry-run" || arg == "--dry-run")
                {
                    options.DryRun = true;
                }
                else if (arg == "/force" || arg == "--force")
                {
                    options.Force = true;
                }
                else if ((arg == "/log" || arg == "--log") && i + 1 < args.Length)
                {
                    options.LogPath = args[++i];
                }
            }

            return options;
        }

        private static bool IsAdministrator()
        {
            try
            {
                var identity = WindowsIdentity.GetCurrent();
                var principal = new WindowsPrincipal(identity);
                return principal.IsInRole(WindowsBuiltInRole.Administrator);
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Verifica se o desinstalador está dentro da pasta de instalação e, se sim, move para temp e reinicia
        /// </summary>
        private static bool CheckAndMoveToTempIfNeeded(string[] args)
        {
            try
            {
                var currentExePath = System.Reflection.Assembly.GetExecutingAssembly().Location;
                if (string.IsNullOrEmpty(currentExePath))
                {
                    currentExePath = System.Diagnostics.Process.GetCurrentProcess().MainModule?.FileName;
                }
                
                if (string.IsNullOrEmpty(currentExePath) || !File.Exists(currentExePath))
                {
                    return false;
                }
                
                var currentExeDir = Path.GetDirectoryName(currentExePath);
                if (string.IsNullOrEmpty(currentExeDir))
                {
                    return false;
                }
                
                // Verificar se estamos dentro de uma pasta de instalação do Voltris
                var possibleInstallPaths = new List<string>();
                
                // Adicionar caminhos padrão
                var pfX86 = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86);
                if (!string.IsNullOrEmpty(pfX86))
                {
                    possibleInstallPaths.Add(Path.Combine(pfX86, "Voltris Corporation", "VoltrisOptimizer"));
                    possibleInstallPaths.Add(Path.Combine(pfX86, "Voltris Corporation", "VoltrisOptmizer"));
                }
                
                var pf = Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles);
                if (!string.IsNullOrEmpty(pf))
                {
                    possibleInstallPaths.Add(Path.Combine(pf, "Voltris Corporation", "VoltrisOptimizer"));
                    possibleInstallPaths.Add(Path.Combine(pf, "Voltris Corporation", "VoltrisOptmizer"));
                }
                
                // Verificar se estamos dentro de alguma dessas pastas
                foreach (var installDir in possibleInstallPaths)
                {
                    if (string.IsNullOrEmpty(installDir) || !Directory.Exists(installDir))
                        continue;
                    
                    var normalizedInstallDir = Path.GetFullPath(installDir).TrimEnd('\\', '/');
                    var normalizedCurrentDir = Path.GetFullPath(currentExeDir).TrimEnd('\\', '/');
                    
                    if (normalizedCurrentDir.StartsWith(normalizedInstallDir, StringComparison.OrdinalIgnoreCase))
                    {
                        // Estamos dentro da pasta de instalação! Precisamos mover para temp e reiniciar
                        try
                        {
                            // Criar pasta temporária
                            var tempDir = Path.Combine(Path.GetTempPath(), "VoltrisUninstaller_" + Guid.NewGuid().ToString("N").Substring(0, 8));
                            Directory.CreateDirectory(tempDir);
                            
                            var tempExePath = Path.Combine(tempDir, "uninstall.exe");
                            
                            // Copiar o desinstalador para temp
                            File.Copy(currentExePath, tempExePath, true);
                            
                            // Criar script batch AGressivo para remover a pasta após o desinstalador fechar
                            var batchPath = Path.Combine(tempDir, "cleanup_force.bat");
                            var parentDir = Path.GetDirectoryName(installDir);
                            // Usar a variável pfX86 já declarada no escopo externo
                            var batchContent = $@"@echo off
REM Aguardar desinstalador fechar
timeout /t 3 /nobreak >nul 2>&1

REM Tentar remover arquivos individualmente primeiro
if exist ""{installDir}"" (
    cd /d ""{installDir}""
    del /f /q /a *.* >nul 2>&1
    for /d %%d in (*) do rd /s /q ""%%d"" >nul 2>&1
    cd /d ""{parentDir}""
)

REM Tentar remover a pasta principal com múltiplas tentativas
:retry_main
if exist ""{installDir}"" (
    rd /s /q ""{installDir}"" >nul 2>&1
    timeout /t 1 /nobreak >nul 2>&1
    if exist ""{installDir}"" (
        goto retry_main
    )
)

REM Remover pasta 'Voltris Corporation' de forma agressiva
:retry_corp
if exist ""{parentDir}"" (
    cd /d ""{parentDir}""
    del /f /q /a *.* >nul 2>&1
    for /d %%d in (*) do rd /s /q ""%%d"" >nul 2>&1
    cd /d ""{pfX86}""
    rd /s /q ""{parentDir}"" >nul 2>&1
    timeout /t 1 /nobreak >nul 2>&1
    if exist ""{parentDir}"" (
        goto retry_corp
    )
)

REM Remover este script
del ""%~f0"" >nul 2>&1";
                            
                            File.WriteAllText(batchPath, batchContent);
                            
                            // Preparar argumentos incluindo o flag --moved-to-temp
                            var newArgs = new List<string>(args) { "--moved-to-temp" };
                            var arguments = string.Join(" ", newArgs.Select(a => a.Contains(" ") ? $"\"{a}\"" : a));
                            
                            // Reiniciar a partir da pasta temporária
                            var processInfo = new System.Diagnostics.ProcessStartInfo
                            {
                                FileName = tempExePath,
                                Arguments = arguments,
                                UseShellExecute = true,
                                WorkingDirectory = tempDir
                            };
                            
                            var process = System.Diagnostics.Process.Start(processInfo);
                            if (process != null)
                            {
                                // Iniciar script de limpeza em background
                                var cleanupInfo = new System.Diagnostics.ProcessStartInfo
                                {
                                    FileName = batchPath,
                                    UseShellExecute = true,
                                    WindowStyle = System.Diagnostics.ProcessWindowStyle.Hidden,
                                    CreateNoWindow = true
                                };
                                System.Diagnostics.Process.Start(cleanupInfo);
                                
                                // Aguardar um pouco para garantir que o novo processo iniciou
                                System.Threading.Thread.Sleep(500);
                                
                                // Fechar este processo
                                Environment.Exit(0);
                                return true;
                            }
                        }
                        catch (Exception ex)
                        {
                            // Se falhar, continuar normalmente (pode não conseguir remover a pasta, mas pelo menos tenta)
                            System.Diagnostics.Debug.WriteLine($"Erro ao mover desinstalador para temp: {ex.Message}");
                        }
                    }
                }
                
                return false;
            }
            catch
            {
                return false;
            }
        }

        private static bool TryElevate(string[] args)
        {
            try
            {
                var exePath = System.Reflection.Assembly.GetExecutingAssembly().Location;
                
                if (string.IsNullOrWhiteSpace(exePath))
                {
                    exePath = System.Diagnostics.Process.GetCurrentProcess().MainModule?.FileName;
                }
                
                if (string.IsNullOrWhiteSpace(exePath) || !File.Exists(exePath))
                {
                    return false;
                }
                
                var processInfo = new System.Diagnostics.ProcessStartInfo
                {
                    UseShellExecute = true,
                    WorkingDirectory = Path.GetDirectoryName(exePath) ?? Environment.CurrentDirectory,
                    FileName = exePath,
                    Verb = "runas",
                    Arguments = string.Join(" ", args.Select(a => a.Contains(" ") ? $"\"{a}\"" : a))
                };

                var process = System.Diagnostics.Process.Start(processInfo);
                return process != null;
            }
            catch
            {
                return false;
            }
        }

        private static int RunSilentMode(ILogger logger, UninstallOptions options)
        {
            try
            {
                logger.LogInfo("Executando em modo silent...");

                var uninstaller = new Uninstaller(logger, options);
                var task = uninstaller.ExecuteAsync();
                task.Wait();

                var result = task.Result;

                if (result.Success)
                {
                    logger.LogInfo("Desinstalação concluída com sucesso (silent mode)");
                    return 0;
                }
                else
                {
                    logger.LogError($"Desinstalação falhou: {result.ErrorMessage}");
                    return 1;
                }
            }
            catch (Exception ex)
            {
                logger.LogError($"Erro durante desinstalação silent: {ex.Message}", ex);
                return 1;
            }
        }
    }
}
