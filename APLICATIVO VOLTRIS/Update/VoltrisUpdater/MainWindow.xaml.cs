using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Media;
using Microsoft.Win32;

namespace VoltrisUpdater
{
    public partial class MainWindow : Window
    {
        private string? _updateUrl;
        private string? _targetPath;
        private string? _restartExe;
        private string? _restartArgs;
        private string _logFile;
        private HttpClient _httpClient;
        private CancellationTokenSource? _cancellationTokenSource;
        private string? _tempUpdatePath;
        private string? _backupPath;

        public MainWindow()
        {
            InitializeComponent();
            
            // Aplicar cantos arredondados
            WindowRoundedCornersHelper.ApplyRoundedCorners(this, cornerRadius: 12);
            
            // Inicializar HttpClient
            _httpClient = new HttpClient
            {
                Timeout = TimeSpan.FromMinutes(10)
            };
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "VoltrisUpdater/1.0");
            
            // Resolver log file
            var logDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Voltris", "Updater");
            Directory.CreateDirectory(logDir);
            _logFile = Path.Combine(logDir, "log.txt");
            
            // Parse argumentos
            ParseArguments();
            
            // Iniciar atualização
            Loaded += MainWindow_Loaded;
        }

        private void ParseArguments()
        {
            var args = Environment.GetCommandLineArgs();
            
            for (int i = 0; i < args.Length; i++)
            {
                var arg = args[i].ToLowerInvariant();
                
                if ((arg == "--url" || arg == "/url") && i + 1 < args.Length)
                {
                    _updateUrl = args[i + 1];
                    i++;
                }
                else if ((arg == "--target" || arg == "/target") && i + 1 < args.Length)
                {
                    _targetPath = args[i + 1];
                    i++;
                }
                else if ((arg == "--restart" || arg == "/restart") && i + 1 < args.Length)
                {
                    var restartValue = args[i + 1];
                    var parts = restartValue.Split(new[] { '|' }, 2);
                    _restartExe = parts[0];
                    _restartArgs = parts.Length > 1 ? parts[1] : "";
                    i++;
                }
            }
            
            // Valores padrão se não fornecidos
            if (string.IsNullOrEmpty(_targetPath))
            {
                _targetPath = DetectInstallPath();
            }
            
            Log($"Arguments parsed - URL: {_updateUrl}, Target: {_targetPath}, Restart: {_restartExe}");
        }

        private string? DetectInstallPath()
        {
            try
            {
                using var baseKey = RegistryKey.OpenBaseKey(RegistryHive.LocalMachine, RegistryView.Registry32);
                using var key = baseKey.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\VoltrisOptimizer");
                if (key != null)
                {
                    var path = key.GetValue("InstallLocation") as string;
                    if (!string.IsNullOrEmpty(path) && Directory.Exists(path))
                    {
                        return path;
                    }
                }
            }
            catch { }
            return null;
        }

        private async void MainWindow_Loaded(object sender, RoutedEventArgs e)
        {
            // Aguardar um pouco para a UI carregar
            await Task.Delay(500);
            
            // Iniciar processo de atualização
            _ = StartUpdateProcessAsync();
        }

        private async Task StartUpdateProcessAsync()
        {
            try
            {
                _cancellationTokenSource = new CancellationTokenSource();
                var token = _cancellationTokenSource.Token;
                
                UpdateStatus("Preparando atualização...");
                ProgressBar.Value = 5;
                await Task.Delay(300, token);
                
                // Validar parâmetros
                if (string.IsNullOrEmpty(_targetPath) || !Directory.Exists(_targetPath))
                {
                    throw new Exception($"Caminho de instalação inválido: {_targetPath}");
                }
                
                UpdateStatus("Fechando aplicativo...");
                ProgressBar.Value = 10;
                await CloseApplicationAsync();
                
                UpdateStatus("Criando backup...");
                ProgressBar.Value = 15;
                await CreateBackupAsync();
                
                if (!string.IsNullOrEmpty(_updateUrl))
                {
                    // Modo: Download remoto
                    UpdateStatus("Baixando atualização...");
                    ProgressBar.Value = 20;
                    await DownloadUpdateAsync(_updateUrl, token);
                }
                else
                {
                    // Modo: Usar pacote embutido
                    UpdateStatus("Extraindo atualização...");
                    ProgressBar.Value = 20;
                    await ExtractEmbeddedUpdateAsync();
                }
                
                UpdateStatus("Validando integridade...");
                ProgressBar.Value = 60;
                await ValidateUpdateAsync();
                
                UpdateStatus("Aplicando atualização...");
                ProgressBar.Value = 70;
                await ApplyUpdateAsync();
                
                UpdateStatus("Finalizando...");
                ProgressBar.Value = 90;
                await Task.Delay(500, token);
                
                UpdateStatus("Atualização concluída!");
                ProgressBar.Value = 100;
                
                await Task.Delay(1000, token);
                
                // Reiniciar aplicativo
                RestartApplication();
            }
            catch (Exception ex)
            {
                LogError($"Erro durante atualização: {ex.Message}\n{ex.StackTrace}");
                UpdateStatus($"Erro: {ex.Message}");
                
                // Tentar rollback
                try
                {
                    await RollbackAsync();
                    UpdateStatus("Rollback realizado. Por favor, tente novamente.");
                }
                catch (Exception rollbackEx)
                {
                    LogError($"Erro no rollback: {rollbackEx.Message}");
                    UpdateStatus("Erro crítico. Por favor, reinstale o aplicativo.");
                }
                
                await Task.Delay(5000);
                Application.Current.Shutdown();
            }
        }

        private async Task CloseApplicationAsync()
        {
            if (string.IsNullOrEmpty(_restartExe))
                return;
            
            var exeName = Path.GetFileName(_restartExe);
            if (string.IsNullOrEmpty(exeName))
                return;
            
            // Aguardar até que o processo seja fechado
            int attempts = 0;
            while (attempts < 30) // 30 segundos máximo
            {
                var processes = Process.GetProcessesByName(Path.GetFileNameWithoutExtension(exeName));
                if (processes.Length == 0)
                {
                    Log("Aplicativo fechado com sucesso");
                    return;
                }
                
                // Tentar fechar graciosamente
                foreach (var proc in processes)
                {
                    try
                    {
                        if (!proc.HasExited)
                        {
                            proc.CloseMainWindow();
                        }
                    }
                    catch { }
                }
                
                await Task.Delay(1000);
                attempts++;
            }
            
            // Se ainda estiver rodando, forçar fechamento
            var remaining = Process.GetProcessesByName(Path.GetFileNameWithoutExtension(exeName));
            foreach (var proc in remaining)
            {
                try
                {
                    if (!proc.HasExited)
                    {
                        proc.Kill();
                        proc.WaitForExit(5000);
                    }
                }
                catch { }
            }
            
            Log("Aplicativo fechado (forçado se necessário)");
        }

        private async Task CreateBackupAsync()
        {
            try
            {
                _backupPath = Path.Combine(Path.GetTempPath(), "VoltrisBackup", Guid.NewGuid().ToString("N"));
                Directory.CreateDirectory(_backupPath);
                
                await Task.Run(() =>
                {
                    CopyDirectory(_targetPath!, _backupPath!);
                });
                
                Log($"Backup criado em: {_backupPath}");
            }
            catch (Exception ex)
            {
                LogError($"Erro ao criar backup: {ex.Message}");
                throw;
            }
        }

        private async Task DownloadUpdateAsync(string url, CancellationToken token)
        {
            try
            {
                _tempUpdatePath = Path.Combine(Path.GetTempPath(), "VoltrisUpdate", $"update_{Guid.NewGuid():N}.zip");
                Directory.CreateDirectory(Path.GetDirectoryName(_tempUpdatePath)!);
                
                using var response = await _httpClient.GetAsync(url, HttpCompletionOption.ResponseHeadersRead, token);
                response.EnsureSuccessStatusCode();
                
                var totalBytes = response.Content.Headers.ContentLength ?? -1L;
                var downloadedBytes = 0L;
                
                using var contentStream = await response.Content.ReadAsStreamAsync(token);
                using var fileStream = new FileStream(_tempUpdatePath, FileMode.Create, FileAccess.Write, FileShare.None, 8192, true);
                
                var buffer = new byte[8192];
                int bytesRead;
                
                while ((bytesRead = await contentStream.ReadAsync(buffer, 0, buffer.Length, token)) > 0)
                {
                    await fileStream.WriteAsync(buffer, 0, bytesRead, token);
                    downloadedBytes += bytesRead;
                    
                    if (totalBytes > 0)
                    {
                        var progress = 20 + (int)((downloadedBytes * 40.0 / totalBytes));
                        ProgressBar.Value = progress;
                        UpdateStatus($"Baixando... {downloadedBytes / 1024 / 1024} MB / {totalBytes / 1024 / 1024} MB");
                    }
                }
                
                Log($"Download concluído: {_tempUpdatePath}");
            }
            catch (Exception ex)
            {
                LogError($"Erro no download: {ex.Message}");
                throw;
            }
        }

        private async Task ExtractEmbeddedUpdateAsync()
        {
            try
            {
                _tempUpdatePath = Path.Combine(Path.GetTempPath(), "VoltrisUpdate", $"update_{Guid.NewGuid():N}.zip");
                Directory.CreateDirectory(Path.GetDirectoryName(_tempUpdatePath)!);
                
                await Task.Run(() =>
                {
                    var ns = typeof(MainWindow).Namespace ?? "VoltrisUpdater";
                    var resourceName = $"{ns}.Payload.update.zip";
                    
                    using var stream = Assembly.GetExecutingAssembly().GetManifestResourceStream(resourceName);
                    if (stream == null)
                    {
                        throw new FileNotFoundException($"Recurso embutido não encontrado: {resourceName}");
                    }
                    
                    using var fileStream = new FileStream(_tempUpdatePath, FileMode.Create, FileAccess.Write);
                    stream.CopyTo(fileStream);
                });
                
                Log($"Pacote embutido extraído: {_tempUpdatePath}");
            }
            catch (Exception ex)
            {
                LogError($"Erro ao extrair pacote embutido: {ex.Message}");
                throw;
            }
        }

        private async Task ValidateUpdateAsync()
        {
            try
            {
                await Task.Run(() =>
                {
                    if (!File.Exists(_tempUpdatePath))
                    {
                        throw new FileNotFoundException($"Arquivo de atualização não encontrado: {_tempUpdatePath}");
                    }
                    
                    // Verificar se é um ZIP válido
                    using var zip = ZipFile.OpenRead(_tempUpdatePath);
                    var entries = zip.Entries.Count;
                    if (entries == 0)
                    {
                        throw new InvalidDataException("Arquivo ZIP de atualização está vazio");
                    }
                    
                    Log($"Validação OK: {entries} arquivos no pacote");
                });
            }
            catch (Exception ex)
            {
                LogError($"Erro na validação: {ex.Message}");
                throw;
            }
        }

        private async Task ApplyUpdateAsync()
        {
            try
            {
                await Task.Run(() =>
                {
                    using var zip = ZipFile.OpenRead(_tempUpdatePath!);
                    
                    foreach (var entry in zip.Entries)
                    {
                        if (string.IsNullOrEmpty(entry.Name))
                            continue; // Diretório
                        
                        var targetFile = Path.Combine(_targetPath!, entry.FullName);
                        var targetDir = Path.GetDirectoryName(targetFile);
                        
                        if (!string.IsNullOrEmpty(targetDir))
                        {
                            Directory.CreateDirectory(targetDir);
                        }
                        
                        // Remover arquivo antigo se existir
                        if (File.Exists(targetFile))
                        {
                            try
                            {
                                File.SetAttributes(targetFile, FileAttributes.Normal);
                                File.Delete(targetFile);
                            }
                            catch
                            {
                                // Tentar novamente após um delay
                                Thread.Sleep(100);
                                try
                                {
                                    File.SetAttributes(targetFile, FileAttributes.Normal);
                                    File.Delete(targetFile);
                                }
                                catch { }
                            }
                        }
                        
                        // Extrair novo arquivo
                        entry.ExtractToFile(targetFile, true);
                    }
                    
                    Log("Atualização aplicada com sucesso");
                });
            }
            catch (Exception ex)
            {
                LogError($"Erro ao aplicar atualização: {ex.Message}");
                throw;
            }
        }

        private async Task RollbackAsync()
        {
            if (string.IsNullOrEmpty(_backupPath) || !Directory.Exists(_backupPath))
            {
                Log("Backup não disponível para rollback");
                return;
            }
            
            try
            {
                await Task.Run(() =>
                {
                    // Limpar diretório atual
                    if (Directory.Exists(_targetPath))
                    {
                        foreach (var file in Directory.GetFiles(_targetPath, "*", SearchOption.AllDirectories))
                        {
                            try
                            {
                                File.SetAttributes(file, FileAttributes.Normal);
                                File.Delete(file);
                            }
                            catch { }
                        }
                    }
                    
                    // Restaurar backup
                    CopyDirectory(_backupPath, _targetPath!);
                    
                    Log("Rollback concluído");
                });
            }
            catch (Exception ex)
            {
                LogError($"Erro no rollback: {ex.Message}");
                throw;
            }
        }

        private void RestartApplication()
        {
            try
            {
                if (string.IsNullOrEmpty(_restartExe))
                {
                    Log("Nenhum executável para reiniciar");
                    Application.Current.Shutdown();
                    return;
                }
                
                var startInfo = new ProcessStartInfo
                {
                    FileName = _restartExe,
                    Arguments = _restartArgs ?? "",
                    WorkingDirectory = Path.GetDirectoryName(_restartExe) ?? _targetPath,
                    UseShellExecute = true
                };
                
                Process.Start(startInfo);
                Log($"Aplicativo reiniciado: {_restartExe}");
                
                Application.Current.Shutdown();
            }
            catch (Exception ex)
            {
                LogError($"Erro ao reiniciar aplicativo: {ex.Message}");
                Application.Current.Shutdown();
            }
        }

        private void UpdateStatus(string message)
        {
            Dispatcher.Invoke(() =>
            {
                StatusText.Text = message;
                Log(message);
            });
        }

        private void CopyDirectory(string sourceDir, string destDir)
        {
            Directory.CreateDirectory(destDir);
            
            foreach (var dir in Directory.GetDirectories(sourceDir, "*", SearchOption.AllDirectories))
            {
                var targetSubDir = dir.Replace(sourceDir, destDir);
                Directory.CreateDirectory(targetSubDir);
            }
            
            foreach (var file in Directory.GetFiles(sourceDir, "*", SearchOption.AllDirectories))
            {
                var targetFile = file.Replace(sourceDir, destDir);
                try
                {
                    File.Copy(file, targetFile, true);
                }
                catch
                {
                    // Tentar novamente
                    Thread.Sleep(100);
                    try
                    {
                        File.SetAttributes(targetFile, FileAttributes.Normal);
                        File.Copy(file, targetFile, true);
                    }
                    catch { }
                }
            }
        }

        private void Log(string message)
        {
            try
            {
                var logMessage = $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss.fff}] {message}";
                File.AppendAllText(_logFile, logMessage + Environment.NewLine);
                Debug.WriteLine(logMessage);
            }
            catch { }
        }

        private void LogError(string message)
        {
            Log($"ERROR: {message}");
        }

        protected override void OnClosed(EventArgs e)
        {
            _cancellationTokenSource?.Cancel();
            _httpClient?.Dispose();
            base.OnClosed(e);
        }
    }
    
    // Helper para cantos arredondados - Compatível Windows 10 e 11
    public static class WindowRoundedCornersHelper
    {
        private const int DWMWA_WINDOW_CORNER_PREFERENCE = 33;
        private const int DWMWCP_ROUND = 2;

        [System.Runtime.InteropServices.DllImport("dwmapi.dll", CharSet = System.Runtime.InteropServices.CharSet.Unicode, PreserveSig = false)]
        private static extern void DwmSetWindowAttribute(IntPtr hwnd, int attr, ref int attrValue, int attrSize);

        [System.Runtime.InteropServices.DllImport("user32.dll")]
        private static extern int SetWindowRgn(IntPtr hWnd, IntPtr hRgn, bool bRedraw);

        [System.Runtime.InteropServices.DllImport("gdi32.dll")]
        private static extern IntPtr CreateRoundRectRgn(int x1, int y1, int x2, int y2, int cx, int cy);

        [System.Runtime.InteropServices.DllImport("gdi32.dll")]
        private static extern bool DeleteObject(IntPtr hObject);

        public static void ApplyRoundedCorners(Window window, int cornerRadius = 12)
        {
            if (window == null) return;

            // Aguardar a janela estar totalmente carregada
            window.Loaded += (s, e) =>
            {
                try
                {
                    var handle = new System.Windows.Interop.WindowInteropHelper(window).Handle;
                    if (handle == IntPtr.Zero) return;

                    // Tentar Windows 11+ primeiro (DWM nativo)
                    if (IsWindows11OrGreater())
                    {
                        ApplyWindows11RoundedCorners(handle);
                    }
                    else
                    {
                        // Fallback para Windows 10 (SetWindowRgn)
                        ApplyWindows10RoundedCorners(window, handle, cornerRadius);
                    }
                }
                catch
                {
                    // Silenciosamente falhar se não for possível aplicar
                }
            };
        }

        private static bool IsWindows11OrGreater()
        {
            try
            {
                var version = Environment.OSVersion.Version;
                // Windows 11 é versão 10.0.22000 ou superior
                return version.Major >= 10 && version.Build >= 22000;
            }
            catch
            {
                return false;
            }
        }

        private static void ApplyWindows11RoundedCorners(IntPtr handle)
        {
            try
            {
                // Usar DWMWCP_ROUND para cantos arredondados perfeitos sem transparência
                int cornerPreference = DWMWCP_ROUND;
                DwmSetWindowAttribute(handle, DWMWA_WINDOW_CORNER_PREFERENCE, ref cornerPreference, sizeof(int));
            }
            catch
            {
                // Falhar silenciosamente se DWM não estiver disponível
            }
        }

        private static void ApplyWindows10RoundedCorners(Window window, IntPtr handle, int cornerRadius)
        {
            try
            {
                // Obter dimensões da janela
                window.SizeChanged += (s, e) =>
                {
                    UpdateWindowRegion(window, handle, cornerRadius);
                };

                // Aplicar inicialmente
                UpdateWindowRegion(window, handle, cornerRadius);
            }
            catch
            {
                // Falhar silenciosamente
            }
        }

        private static void UpdateWindowRegion(Window window, IntPtr handle, int cornerRadius)
        {
            try
            {
                var width = (int)window.ActualWidth;
                var height = (int)window.ActualHeight;

                if (width <= 0 || height <= 0) return;

                // Criar região arredondada - usar cornerRadius * 2 para raio adequado
                var hRgn = CreateRoundRectRgn(0, 0, width, height, cornerRadius * 2, cornerRadius * 2);

                if (hRgn != IntPtr.Zero)
                {
                    // Aplicar região à janela - isso recorta os cantos perfeitamente
                    SetWindowRgn(handle, hRgn, true);
                    // A região será liberada automaticamente pelo Windows quando a janela for destruída
                }
            }
            catch
            {
                // Falhar silenciosamente
            }
        }
    }
}


