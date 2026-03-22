using System;
using System.Diagnostics;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Windows.Interop;
using System.Windows.Media.Animation;

namespace VoltrisUpdater
{
    public partial class MainWindow : Window
    {
        private string? _updateUrl;
        private string? _targetPath;
        private string? _restartExe;
        private string _logFile;
        private HttpClient _httpClient;
        private string? _tempZipPath;
        private string? _backupDir;

        public MainWindow()
        {
            InitializeComponent();
            _httpClient = new HttpClient { Timeout = TimeSpan.FromMinutes(5) };
            
            // Log de emergência absoluto
            Debug.WriteLine("DEBUG: MainWindow Constructor iniciada");

            Loaded += async (s, e) => {
                try 
                {
                    await InitializeUpdaterSafeAsync();
                }
                catch (Exception ex)
                {
                    MessageBox.Show($"ERRO FATAL NO LOADED: {ex.Message}\n\n{ex.StackTrace}", "Voltris Critical Error");
                }
            };
        }

        private async Task InitializeUpdaterSafeAsync()
        {
            try 
            {
                SetupLogging();
                Log("Iniciando motor de atualização...");
                
                await Task.Delay(200); 
                
                ParseArgs();
                SetupLogging();
                Log("========== VOLTRIS UPDATER ENTERPRISE STARTED (RELEASE) ==========");

                await ExecuteUpdateEngineAsync();
            }
            catch (Exception ex) 
            {
                string errMsg = $"Erro técnico na atualização: {ex.Message}";
                Log($"{errMsg}\n{ex.StackTrace}");
                MessageBox.Show(errMsg, "Voltris Updater", MessageBoxButton.OK, MessageBoxImage.Error);
                Application.Current.Shutdown();
            }
        }

        private void SetupLogging()
        {
            try
            {
                // Tentar gravar logs na pasta do executável ALVO (onde o usuário vai procurar)
                // Se _targetPath não estiver definido ainda, usamos AppData como fallback temporário
                string logDir;
                
                if (!string.IsNullOrEmpty(_targetPath))
                {
                    logDir = Path.Combine(_targetPath, "UpdateLogs");
                }
                else
                {
                    var appData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
                    logDir = Path.Combine(appData, "Voltris", "Updater");
                }

                if (!Directory.Exists(logDir)) Directory.CreateDirectory(logDir);
                _logFile = Path.Combine(logDir, $"updater_engine_{DateTime.Now:yyyy-MM-dd_HH-mm-ss}.log");
            }
            catch
            {
                // Fallback final para TEMP
                _logFile = Path.Combine(Path.GetTempPath(), "voltris_updater_fallback.log");
            }
        }

        private void ParseArgs()
        {
            try
            {
                var args = Environment.GetCommandLineArgs();
                Log($"Raw Args: {string.Join(" ", args)}");

                for (int i = 0; i < args.Length; i++)
                {
                    var arg = args[i].ToLower();
                    if (arg == "--url" && i + 1 < args.Length) _updateUrl = args[i + 1];
                    if (arg == "--target" && i + 1 < args.Length) _targetPath = args[i + 1];
                    if (arg == "--restart" && i + 1 < args.Length) _restartExe = args[i + 1];
                    if (arg == "--changelog" && i + 1 < args.Length) 
                    {
                        var changelog = args[i + 1];
                        UpdateUI("NOVAS MELHORIAS:\n\n" + changelog, 0, "Inicializando");
                    }
                }

                // Auto-detecção se target for vazio (execução manual na mesma pasta)
                if (string.IsNullOrEmpty(_targetPath)) 
                {
                    _targetPath = AppDomain.CurrentDomain.BaseDirectory;
                    Log($"Target não definido, usando diretório atual: {_targetPath}");
                }
                
                // Detectar arquitetura
                string architecture = Environment.Is64BitProcess ? "x64" : "x86";
                Log($"Arquitetura do Processo: {architecture}");
                Log($"Target Path: {_targetPath}");
                Log($"Restart Exe: {_restartExe}");
            }
            catch (Exception ex)
            {
                Log($"Erro ao processar argumentos: {ex.Message}");
                throw;
            }
        }

        private async Task ExecuteUpdateEngineAsync()
        {
            try
            {
                // Etapa 1: Encerramento de processos
                UpdateUI("Encerrando processos ativos...", 10, "Etapa 1 de 4");
                await KillOptimizerProcessesAsync();

                // Etapa 2: Backup de segurança
                UpdateUI("Criando ponto de restauração...", 25, "Etapa 2 de 4");
                _backupDir = Path.Combine(Path.GetTempPath(), "Voltris_Backup_" + DateTime.Now.Ticks);
                await CreateSecurityBackupAsync();

                // Etapa 3: Obtenção do Pacote
                UpdateUI("Sincronizando arquivos...", 40, "Etapa 3 de 4");
                await ResolveUpdatePackageAsync();

                // Etapa 4: Extração Direta (O "Pulo do Gato")
                UpdateUI("Aplicando novos recursos...", 70, "Etapa 4 de 4");
                await ExtractAndApplyAsync();

                UpdateUI("Sistema Atualizado!", 100, "Concluído");
                await Task.Delay(1000);
                
                RestartOptimizer();
            }
            catch (Exception ex)
            {
                Log("FATAL ENGINE ERROR: " + ex.Message);
                Log(ex.StackTrace);
                await HandleFailureAsync(ex.Message);
            }
        }

        private async Task KillOptimizerProcessesAsync()
        {
            Log("Iniciando encerramento de processos...");
            string[] targets = { "VoltrisOptimizer", "Voltris Optimizer", "VoltrisService" };
            
            // Tentar por até 10 segundos
            for (int i = 0; i < 10; i++)
            {
                bool anyRunning = false;
                foreach (var name in targets)
                {
                    var procs = Process.GetProcessesByName(name);
                    if (procs.Length > 0)
                    {
                        anyRunning = true;
                        foreach (var p in procs)
                        {
                            try 
                            { 
                                Log($"Matando processo {p.ProcessName} (PID: {p.Id})...");
                                p.Kill(); 
                                p.WaitForExit(1000); 
                            } 
                            catch (Exception ex)
                            {
                                Log($"Erro ao matar PID {p.Id}: {ex.Message}");
                            }
                        }
                    }
                }
                
                if (!anyRunning)
                {
                    Log("Todos os processos encerrados com sucesso.");
                    break;
                }
                
                await Task.Delay(1000);
            }
            
            // Garantia extra
            await Task.Delay(1000);
        }

        private async Task CreateSecurityBackupAsync()
        {
            LogInfo($"Iniciando backup de segurança em: {_backupDir}");
            await Task.Run(() => {
                try
                {
                    Directory.CreateDirectory(_backupDir!);
                    var files = Directory.GetFiles(_targetPath!, "*.*", SearchOption.TopDirectoryOnly);
                    LogInfo($"Copiando {files.Length} arquivos para a pasta de backup...");
                    
                    foreach (var file in files)
                    {
                        try 
                        { 
                            File.Copy(file, Path.Combine(_backupDir!, Path.GetFileName(file)), true); 
                        } 
                        catch (Exception ex)
                        {
                            LogWarning($"Não foi possível copiar arquivo para backup: {Path.GetFileName(file)} ({ex.Message})");
                        }
                    }
                    LogSuccess("Backup de segurança concluído.");
                }
                catch (Exception ex)
                {
                    LogError("Falha crítica ao criar diretório de backup", ex);
                }
            });
        }

        private async Task ResolveUpdatePackageAsync()
        {
            LogInfo("========== RESOLVENDO PACOTE DE ATUALIZAÇÃO ==========");
            
            // Verificar Payload Embarcado PRIMEIRO (Prioridade Mxima)
            if (TryExtractEmbeddedPayload())
            {
                Log($"Usando payload embarcado (prioridade máxima): {_tempZipPath}");
                Log($"Tamanho do pacote: {new FileInfo(_tempZipPath).Length / 1024 / 1024:F2} MB");
                return;
            }

            if (string.IsNullOrEmpty(_updateUrl))
            {
                Log("ERRO: Origem da atualização não definida e nenhum payload embarcado encontrado!");
                throw new Exception("Origem da atualização não definida.");
            }

            Log($"URL/Caminho fornecido: {_updateUrl}");

            if (File.Exists(_updateUrl))
            {
                _tempZipPath = _updateUrl;
                Log($"Usando pacote local pré-baixado: {_tempZipPath}");
                Log($"Tamanho do arquivo: {new FileInfo(_tempZipPath).Length / 1024 / 1024:F2} MB");
                
                // Validar se é um arquivo ZIP válido
                try
                {
                    using var testZip = System.IO.Compression.ZipFile.OpenRead(_tempZipPath);
                    Log($"Arquivo ZIP válido! Entradas: {testZip.Entries.Count}");
                }
                catch (Exception zipEx)
                {
                    Log($"ERRO: Arquivo não é um ZIP válido! {zipEx.Message}");
                    throw new Exception($"Arquivo de atualização inválido: {zipEx.Message}");
                }
            }
            else if (_updateUrl.StartsWith("http"))
            {
                Log("Iniciando download remoto...");
                _tempZipPath = Path.Combine(Path.GetTempPath(), "voltris_download.zip");
                
                Log($"Destino do download: {_tempZipPath}");
                
                using var stream = await _httpClient.GetStreamAsync(_updateUrl);
                using var fs = new FileStream(_tempZipPath, FileMode.Create);
                await stream.CopyToAsync(fs);
                
                Log($"Download remoto concluído!");
                Log($"Tamanho do arquivo: {new FileInfo(_tempZipPath).Length / 1024 / 1024:F2} MB");
            }
            else
            {
                Log($"ERRO: Formato de origem inválido: {_updateUrl}");
                throw new Exception("Formato de origem inválido: " + _updateUrl);
            }
            
            Log("========== PACOTE RESOLVIDO COM SUCESSO ==========");
        }

        private async Task ExtractAndApplyAsync()
        {
            Log("========== EXTRAINDO E APLICANDO ARQUIVOS (SMART SWAP) ==========");
            
            await Task.Run(() => {
                using var zip = ZipFile.OpenRead(_tempZipPath!);
                
                Log($"Total de arquivos no pacote: {zip.Entries.Count}");
                int filesExtracted = 0;
                int filesSkipped = 0;
                
                foreach (var entry in zip.Entries)
                {
                    // Ignorar diretórios
                    if (string.IsNullOrEmpty(entry.Name) || entry.FullName.EndsWith("/") || entry.FullName.EndsWith("\\"))
                    {
                        try
                        {
                            var dirPath = Path.Combine(_targetPath!, entry.FullName);
                            Directory.CreateDirectory(dirPath);
                        }
                        catch { }
                        continue;
                    }
                    
                    var destPath = Path.Combine(_targetPath!, entry.FullName);
                    var destDir = Path.GetDirectoryName(destPath);
                    
                    if (!string.IsNullOrEmpty(destDir)) Directory.CreateDirectory(destDir);

                    // ESTRATÉGIA ANTI-LOCK: RENAME-SWAP
                    // 1. Se arquivo existe, tentar renomear para .old
                    // 2. Extrair novo arquivo
                    // 3. Marcar .old para deleção futura (opcional)
                    
                    bool success = false;
                    Exception? lastError = null;

                    for (int i = 0; i < 3; i++) // 3 tentativas
                    {
                        try
                        {
                            if (File.Exists(destPath))
                            {
                                var oldPath = destPath + ".old_" + Guid.NewGuid().ToString().Substring(0, 5);
                                try 
                                {
                                    // Tentar mover o arquivo existente para tirar do caminho
                                    File.Move(destPath, oldPath);
                                    Log($"Arquivo movido para evitar lock: {Path.GetFileName(destPath)} -> {Path.GetFileName(oldPath)}");
                                }
                                catch (IOException)
                                {
                                    // Se não der pra mover, tentar deletar direto
                                    File.Delete(destPath);
                                }
                            }
                            
                            entry.ExtractToFile(destPath, true);
                            success = true;
                            filesExtracted++;
                            break;
                        }
                        catch (Exception ex)
                        {
                            lastError = ex;
                            Thread.Sleep(500); // Wait bit
                        }
                    }

                    if (!success)
                    {
                        Log($"FALHA CRITICA ao atualizar arquivo {entry.FullName}: {lastError?.Message}");
                        filesSkipped++;
                        // Se falhar num executável ou DLL, é grave.
                        if (entry.FullName.EndsWith(".exe") || entry.FullName.EndsWith(".dll"))
                        {
                            throw new Exception($"Impossível atualizar arquivo crítico: {entry.Name}. Erro: {lastError?.Message}");
                        }
                    }
                }
                
                Log($"========== EXTRAÇÃO CONCLUÍDA ==========");
                Log($"Arquivos atualizados: {filesExtracted}");
                Log($"Falhas (não críticas): {filesSkipped}");
                
                // Limpeza de .old files (Fire and forget)
                CleanupOldFiles();
            });
        }

        private void CleanupOldFiles()
        {
            try
            {
                var files = Directory.GetFiles(_targetPath!, "*.old_*", SearchOption.AllDirectories);
                foreach (var f in files)
                {
                    try { File.Delete(f); } catch { }
                }
            }
            catch { }
        }

        private async Task HandleFailureAsync(string error)
        {
            UpdateUI("Erro detectado. Restaurando...", 50, "Erro Crítico");
            if (!string.IsNullOrEmpty(_backupDir) && Directory.Exists(_backupDir))
            {
                try
                {
                    foreach (var file in Directory.GetFiles(_backupDir))
                    {
                        File.Copy(file, Path.Combine(_targetPath!, Path.GetFileName(file)), true);
                    }
                    UpdateUI("Rollback realizado com sucesso.", 0, "Reinicie o programa.");
                }
                catch { UpdateUI("Falha total na restauração.", 0, "Reinstale o app."); }
            }
            await Task.Delay(5000);
            Application.Current.Shutdown();
        }

        private void RestartOptimizer()
        {
            try
            {
                Log("========== INICIANDO PROCESSO DE REINICIALIZAÇÃO ==========");
                
                var exe = _restartExe ?? Path.Combine(_targetPath!, "VoltrisOptimizer.exe");
                
                Log($"Executável para reiniciar: {exe}");
                Log($"Arquivo existe: {File.Exists(exe)}");
                
                if (!File.Exists(exe))
                {
                    Log("ERRO: Executável não encontrado!");
                    
                    // Tentar encontrar o executável na pasta de destino
                    var exeFiles = Directory.GetFiles(_targetPath!, "*.exe", SearchOption.TopDirectoryOnly)
                        .Where(f => f.Contains("Voltris", StringComparison.OrdinalIgnoreCase) && 
                                   !f.Contains("Updater", StringComparison.OrdinalIgnoreCase))
                        .ToList();
                    
                    Log($"Arquivos .exe encontrados na pasta de destino: {exeFiles.Count}");
                    
                    if (exeFiles.Count > 0)
                    {
                        exe = exeFiles.First();
                        Log($"Usando executável alternativo: {exe}");
                    }
                    else
                    {
                        Log("ERRO CRÍTICO: Nenhum executável válido encontrado!");
                        UpdateUI("Erro ao reiniciar. Inicie manualmente.", 100, "Atualização Concluída");
                        return;
                    }
                }
                
                Log($"Tamanho do executável: {new FileInfo(exe).Length / 1024:F2} KB");
                Log($"Data de modificação: {File.GetLastWriteTime(exe)}");
                
                // Aguardar um pouco antes de reiniciar
                Log("Aguardando 2 segundos antes de reiniciar...");
                Thread.Sleep(2000);
                
                Log("Iniciando processo...");
                
                var startInfo = new ProcessStartInfo
                {
                    FileName = exe,
                    UseShellExecute = true,
                    WorkingDirectory = Path.GetDirectoryName(exe) ?? _targetPath!,
                    Verb = "" // Não usar "runas" para evitar prompt de UAC
                };
                
                Log($"WorkingDirectory: {startInfo.WorkingDirectory}");
                Log($"UseShellExecute: {startInfo.UseShellExecute}");
                
                var process = Process.Start(startInfo);
                
                if (process != null)
                {
                    Log($"Processo iniciado com sucesso! PID: {process.Id}");
                    Log("Aguardando 1 segundo para confirmar inicialização...");
                    Thread.Sleep(1000);
                    
                    if (!process.HasExited)
                    {
                        Log("Processo confirmado em execução!");
                        Log("========== REINICIALIZAÇÃO BEM-SUCEDIDA ==========");
                    }
                    else
                    {
                        Log($"AVISO: Processo finalizou imediatamente! ExitCode: {process.ExitCode}");
                    }
                }
                else
                {
                    Log("ERRO: Process.Start retornou null!");
                }
            }
            catch (Exception ex)
            {
                Log($"ERRO CRÍTICO ao reiniciar: {ex.Message}");
                Log($"StackTrace: {ex.StackTrace}");
                UpdateUI("Erro ao reiniciar. Inicie manualmente.", 100, "Atualização Concluída");
            }
            finally
            {
                Log("Encerrando VoltrisUpdater...");
                Application.Current.Shutdown();
            }
        }

        private bool TryExtractEmbeddedPayload()
        {
            try
            {
                var assembly = Assembly.GetExecutingAssembly();
                var resourceNames = assembly.GetManifestResourceNames();
                
                // Listar recursos para debug
                Log($"Procurando payload em {resourceNames.Length} recursos...");
                
                // Procurar recurso que termine com .zip e contenha Payload
                // Isso resolve problemas de namespace aleatório ou lógico no compilador
                var resourceName = resourceNames.FirstOrDefault(r => r.Contains("Payload.zip"));
                
                if (string.IsNullOrEmpty(resourceName))
                {
                    Log("ERRO CRÍTICO: Payload não encontrado nos recursos embutidos!");
                    Log("Recursos disponíveis:");
                    foreach (var name in resourceNames) Log($"- {name}");
                    return false;
                }
                
                Log($"Recurso de payload identificado: {resourceName}");
                
                using var stream = assembly.GetManifestResourceStream(resourceName);
                if (stream == null) 
                {
                    Log("ERRO: GetManifestResourceStream retornou null!");
                    return false;
                }
                
                _tempZipPath = Path.Combine(Path.GetTempPath(), $"voltris_update_{DateTime.Now.Ticks}.zip");
                Log($"Extraindo para temporário: {_tempZipPath}");
                
                using var fileStream = new FileStream(_tempZipPath, FileMode.Create);
                stream.CopyTo(fileStream);
                
                Log($"Payload extraído com sucesso! Tamanho: {new FileInfo(_tempZipPath).Length / 1024 / 1024:F2} MB");
                return true;
            }
            catch (Exception ex)
            {
                Log($"ERRO FATAL ao extrair payload embarcado: {ex.Message}");
                Log(ex.StackTrace);
                return false;
            }
        }


        private void UpdateUI(string status, double percent, string step)
        {
            Dispatcher.Invoke(() => {
                StatusText.Text = status;
                StepLabel.Text = step;
                PercentLabel.Text = (int)percent + "%";
                
                var anim = new DoubleAnimation {
                    To = (percent / 100.0) * (ProgressBar.Parent as Border)!.ActualWidth,
                    Duration = TimeSpan.FromMilliseconds(400),
                    EasingFunction = new QuadraticEase { EasingMode = EasingMode.EaseOut }
                };
                ProgressBar.BeginAnimation(WidthProperty, anim);
            });
        }

        private void Log(string msg) {
            try { File.AppendAllText(_logFile, $"[{DateTime.Now}] {msg}\n"); } catch { }
        }
    }
}
