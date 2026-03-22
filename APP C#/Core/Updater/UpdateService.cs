using System;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Win32;

namespace VoltrisOptimizer.Core.Updater
{
    /// <summary>
    /// Serviço de atualização automática - busca, baixa e aplica atualizações
    /// </summary>
    public class UpdateService
    {
        // =====================================================
        // CONFIGURAÇÃO - ALTERE O REPOSITÓRIO AQUI
        // =====================================================
        // Para repositórios privados, usamos GitHub Releases API
        // Releases públicos podem ser acessados mesmo de repositórios privados
        private const string GITHUB_REPO_OWNER = "DougFHansen";
        private const string GITHUB_REPO_NAME = "voltris-seo-optimized"; // Repositório principal (instalador)
        private const string GITHUB_RELEASES_API = $"https://api.github.com/repos/{GITHUB_REPO_OWNER}/{GITHUB_REPO_NAME}/releases/latest";
        
        // Repositório de releases (onde está o Updater)
        private const string GITHUB_RELEASES_REPO_NAME = "voltris-releases";
        private const string GITHUB_RELEASES_REPO_API = $"https://api.github.com/repos/{GITHUB_REPO_OWNER}/{GITHUB_RELEASES_REPO_NAME}/releases/latest";
        
        // Fallback: tentar version.json do repositório público de releases
        private const string VERSION_JSON_URL = "https://raw.githubusercontent.com/DougFHansen/voltris-releases/main/version.json";
        
        // OPÇÃO: Se o repositório for completamente privado, você pode usar um token de acesso pessoal
        // Crie um token em: https://github.com/settings/tokens (com permissão "public_repo" ou "repo")
        // ATENÇÃO: Não coloque o token diretamente no código! Use uma variável de ambiente ou arquivo de configuração
        // private const string GITHUB_TOKEN = ""; // Deixe vazio se não usar
        
        private static readonly HttpClient _httpClient = new HttpClient
        {
            Timeout = TimeSpan.FromSeconds(30)
        };
        
        static UpdateService()
        {
            // Adicionar User-Agent (requerido pela GitHub API)
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "VoltrisOptimizer-Updater/1.0");
            _httpClient.DefaultRequestHeaders.Add("Accept", "application/vnd.github.v3+json");
            
            // Se você tiver um token, descomente e configure:
            // if (!string.IsNullOrEmpty(GITHUB_TOKEN))
            // {
            //     _httpClient.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("token", GITHUB_TOKEN);
            // }
        }
        
        private static readonly string _updateFolder = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "VoltrisOptimizer", "Updates");
        
        /// <summary>
        /// Obtém a versão atual do aplicativo
        /// </summary>
        public static string GetCurrentVersion()
        {
            try
            {
                var version = Assembly.GetExecutingAssembly().GetName().Version;
                if (version != null)
                {
                    // Incluir Revision se for diferente de -1 (não definido)
                    if (version.Revision != -1 && version.Revision != 0)
                    {
                        return $"{version.Major}.{version.Minor}.{version.Build}.{version.Revision}";
                    }
                    return $"{version.Major}.{version.Minor}.{version.Build}";
                }
            }
            catch { }
            
            return "1.0.0.2"; // Versão fallback
        }
        
        /// <summary>
        /// Verifica se há atualizações disponíveis
        /// </summary>
        public static async Task<UpdateInfo?> CheckForUpdatesAsync()
        {
            try
            {
                // Tentar primeiro usar GitHub Releases API (funciona com repositórios privados se o release for público)
                UpdateInfo? updateInfo = await CheckViaGitHubReleasesAPIAsync();
                
                // Se falhar, tentar version.json como fallback (para repositórios públicos)
                if (updateInfo == null)
                {
                    updateInfo = await CheckViaVersionJsonAsync();
                }
                
                if (updateInfo != null)
                {
                    var currentVersion = GetCurrentVersion();
                    Debug.WriteLine($"[UpdateService] Versão atual: {currentVersion}");
                    Debug.WriteLine($"[UpdateService] Versão disponível: {updateInfo.LatestVersion}");
                    Debug.WriteLine($"[UpdateService] Comparação: {UpdateInfo.CompareVersions(updateInfo.LatestVersion, currentVersion)}");
                    
                    if (updateInfo.IsNewerThan(currentVersion))
                    {
                        Debug.WriteLine($"[UpdateService] Nova versão detectada!");
                        return updateInfo;
                    }
                    else
                    {
                        Debug.WriteLine($"[UpdateService] Versão disponível não é mais nova que a atual");
                    }
                }
                else
                {
                    Debug.WriteLine($"[UpdateService] Nenhuma informação de atualização encontrada");
                }
                
                return null; // Nenhuma atualização disponível
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"[UpdateService] Erro ao verificar atualizações: {ex.Message}");
                return null;
            }
        }
        
        /// <summary>
        /// Verifica atualizações via GitHub Releases API (funciona com repositórios privados)
        /// </summary>
        private static async Task<UpdateInfo?> CheckViaGitHubReleasesAPIAsync()
        {
            try
            {
                Debug.WriteLine($"[UpdateService] Tentando acessar: {GITHUB_RELEASES_API}");
                var response = await _httpClient.GetStringAsync(GITHUB_RELEASES_API);
                
                Debug.WriteLine($"[UpdateService] Resposta recebida, tamanho: {response.Length} bytes");
                
                using var doc = JsonDocument.Parse(response);
                var root = doc.RootElement;
                
                // Extrair informações do release
                var tagName = root.GetProperty("tag_name").GetString() ?? "";
                var version = tagName.TrimStart('v', 'V'); // Remove prefixo 'v' se existir
                var body = root.GetProperty("body").GetString() ?? "";
                
                Debug.WriteLine($"[UpdateService] Release encontrado: {tagName} (versão: {version})");
                
                // Buscar o asset do instalador
                var assets = root.GetProperty("assets");
                string? downloadUrl = null;
                
                Debug.WriteLine($"[UpdateService] Procurando assets... ({assets.GetArrayLength()} encontrados)");
                
                string archSuffix = Environment.Is64BitProcess ? "x64" : "x86";
                Debug.WriteLine($"[UpdateService] Arquitetura detectada: {archSuffix}");
                
                foreach (var asset in assets.EnumerateArray())
                {
                    var name = asset.GetProperty("name").GetString() ?? "";
                    Debug.WriteLine($"[UpdateService] Asset: {name}");
                    
                    // PRIORIDADE MÁXIMA: Buscar o Updater EXE da arquitetura (que tem o ZIP integrado)
                    if ((name.Contains("VoltrisUpdater", StringComparison.OrdinalIgnoreCase) || name.Contains("Updater", StringComparison.OrdinalIgnoreCase)) && 
                        name.Contains(archSuffix, StringComparison.OrdinalIgnoreCase) && 
                        name.EndsWith(".exe", StringComparison.OrdinalIgnoreCase))
                    {
                        downloadUrl = asset.GetProperty("browser_download_url").GetString();
                        Debug.WriteLine($"[UpdateService] Atualizador integrado ({archSuffix}) encontrado: {downloadUrl}");
                        break;
                    }
                }
                
                // Fallback: Se não achar o EXE específico, tenta o ZIP (para manter flexibilidade)
                if (string.IsNullOrEmpty(downloadUrl))
                {
                    foreach (var asset in assets.EnumerateArray())
                    {
                        var name = asset.GetProperty("name").GetString() ?? "";
                        if (name.EndsWith(".zip", StringComparison.OrdinalIgnoreCase) && name.Contains(archSuffix))
                        {
                            downloadUrl = asset.GetProperty("browser_download_url").GetString();
                            Debug.WriteLine($"[UpdateService] Usando pacote ZIP de fallback: {downloadUrl}");
                            break;
                        }
                    }
                }
                
                if (string.IsNullOrEmpty(downloadUrl))
                {
                    // Se não encontrar asset, construir URL padrão
                    downloadUrl = $"https://github.com/{GITHUB_REPO_OWNER}/{GITHUB_REPO_NAME}/releases/download/{tagName}/VoltrisOptimizer_v{version}_Setup.exe";
                    Debug.WriteLine($"[UpdateService] Nenhum asset encontrado, usando URL padrão: {downloadUrl}");
                }
                
                var updateInfo = new UpdateInfo
                {
                    LatestVersion = version,
                    DownloadUrl = downloadUrl,
                    Changelog = body,
                    Mandatory = false // Você pode adicionar lógica para determinar se é obrigatório
                };
                
                Debug.WriteLine($"[UpdateService] UpdateInfo criado: Versão={version}, URL={downloadUrl}");
                return updateInfo;
            }
            catch (HttpRequestException httpEx) when (httpEx.Message.Contains("404"))
            {
                Debug.WriteLine($"[UpdateService] Erro 404: Nenhum release encontrado ou repositório não acessível.");
                Debug.WriteLine($"[UpdateService] Possíveis causas:");
                Debug.WriteLine($"[UpdateService] 1. Não há releases criados no GitHub");
                Debug.WriteLine($"[UpdateService] 2. O release não está público (mesmo em repositório privado, o release deve ser público)");
                Debug.WriteLine($"[UpdateService] 3. O repositório não permite acesso público aos releases");
                Debug.WriteLine($"[UpdateService] 4. O release está como 'Draft' ou 'Pre-release'");
                Debug.WriteLine($"[UpdateService] URL tentada: {GITHUB_RELEASES_API}");
                return null;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"[UpdateService] Erro ao verificar via GitHub Releases API: {ex.GetType().Name} - {ex.Message}");
                Debug.WriteLine($"[UpdateService] StackTrace: {ex.StackTrace}");
                return null;
            }
        }
        
        /// <summary>
        /// Verifica atualizações via version.json (fallback para repositórios públicos)
        /// </summary>
        private static async Task<UpdateInfo?> CheckViaVersionJsonAsync()
        {
            try
            {
                var response = await _httpClient.GetStringAsync(VERSION_JSON_URL);
                
                var options = new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                };
                
                var updateInfo = JsonSerializer.Deserialize<UpdateInfo>(response, options);
                return updateInfo;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"[UpdateService] Erro ao verificar via version.json: {ex.Message}");
                return null;
            }
        }
        
        /// <summary>
        /// Baixa a atualização com progresso
        /// </summary>
        public static async Task<string?> DownloadUpdateAsync(UpdateInfo updateInfo, IProgress<double>? progress = null)
        {
            try
            {
                LogUpdate("INICIANDO DOWNLOAD DA ATUALIZAÇÃO...");
                
                // --- DETECÇÃO DE ARQUITETURA BLINDADA ---
                string archSuffix = Environment.Is64BitProcess ? "x64" : "x86";
                string targetName = $"VoltrisUpdater_{archSuffix}.exe";
                string actualUrl = updateInfo.DownloadUrl;

                // Se a URL no JSON não bate com a nossa arquitetura, tentamos corrigir
                if (!actualUrl.Contains(targetName, StringComparison.OrdinalIgnoreCase))
                {
                    LogUpdate($"AVISO: URL do JSON ({actualUrl}) não bate com arquitetura {archSuffix}. Tentando resolver...");
                    string resolvedUrl = await GetUpdaterUrlAsync(updateInfo);
                    if (!string.IsNullOrEmpty(resolvedUrl))
                    {
                        actualUrl = resolvedUrl;
                        LogUpdate($"URL Resolvida dinamicamente: {actualUrl}");
                    }
                    else
                    {
                        LogUpdate("Não foi possível resolver a URL por arquitetura. Tentando URL original do JSON...");
                    }
                }

                // Garantir que o diretório existe
                if (!Directory.Exists(_updateFolder)) Directory.CreateDirectory(_updateFolder);
                
                var fileName = $"VoltrisOptimizer_Update_{updateInfo.LatestVersion}_{archSuffix}.exe";
                var filePath = Path.Combine(_updateFolder, fileName);
                
                LogUpdate($"Baixando de: {actualUrl}");
                LogUpdate($"Destino: {filePath}");

                using var response = await _httpClient.GetAsync(actualUrl, HttpCompletionOption.ResponseHeadersRead);
                
                if (!response.IsSuccessStatusCode)
                {
                    string error = $"Falha no download (HTTP {(int)response.StatusCode}). Verifique se o arquivo existe no GitHub.";
                    LogUpdate(error);
                    System.Windows.MessageBox.Show(error, "SaaS Update Engine");
                    return null;
                }

                var totalBytes = response.Content.Headers.ContentLength ?? -1L;
                
                using var contentStream = await response.Content.ReadAsStreamAsync();
                using var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None, 8192, true);
                
                var buffer = new byte[8192];
                long totalBytesRead = 0;
                int bytesRead;
                
                while ((bytesRead = await contentStream.ReadAsync(buffer, 0, buffer.Length)) > 0)
                {
                    await fileStream.WriteAsync(buffer, 0, bytesRead);
                    totalBytesRead += bytesRead;
                    
                    if (totalBytes > 0)
                    {
                        var percentage = (double)totalBytesRead / totalBytes * 100;
                        progress?.Report(percentage);
                    }
                }
                
                progress?.Report(100);
                LogUpdate("Download concluído com sucesso!");
                return filePath;
            }
            catch (Exception ex)
            {
                string errorMsg = $"ERRO CRÍTICO NO DOWNLOAD: {ex.Message}\n\nURL Tentada: {updateInfo.DownloadUrl}";
                LogUpdate(errorMsg);
                System.Windows.MessageBox.Show(errorMsg, "Erro de Download - Voltris");
                return null;
            }
        }
        
        // =====================================================
        // FORENSIC LOGGING SYSTEM
        // =====================================================
        public static void LogUpdate(string message)
        {
            try
            {
                string logDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "UpdateLogs");
                try
                {
                    if (!Directory.Exists(logDir)) Directory.CreateDirectory(logDir);
                }
                catch
                {
                    logDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Desktop), "Voltris_Debug_Logs");
                    if (!Directory.Exists(logDir)) Directory.CreateDirectory(logDir);
                }
                
                string logFile = Path.Combine(logDir, $"update_session_{DateTime.Now:yyyy-MM-dd}.log");
                string logEntry = $"[{DateTime.Now:HH:mm:ss}] {message}{Environment.NewLine}";
                File.AppendAllText(logFile, logEntry);
                Debug.WriteLine($"[UPDATE_LOG] {message}");
            }
            catch { }
        }

        /// <summary>
        /// Baixa o Updater.exe e inicia o processo de atualização automática
        /// ENTERPRISE-LEVEL: Detecção de arquitetura, validação e shutdown controlado
        /// </summary>
        public static async Task<bool> StartAutoUpdateAsync(UpdateInfo updateInfo, string? localFilePath = null)
        {
            try
            {
                LogUpdate("========== INICIANDO PROCESSO DE ATUALIZAÇÃO BLINDADA ==========");
                LogUpdate($"Versão Alvo: {updateInfo.LatestVersion}");
                
                string architecture = Environment.Is64BitProcess ? "x64" : "x86";
                LogUpdate($"Arquitetura detectada: {architecture}");
                
                // Diretório temporário para o Updater
                var updaterDir = Path.Combine(_updateFolder, "Bin");
                Directory.CreateDirectory(updaterDir);
                
                // Definir nome do executável do updater
                var updaterExePath = Path.Combine(updaterDir, $"VoltrisUpdater_{architecture}.exe");
                
                // Limpar anterior
                if (File.Exists(updaterExePath)) 
                {
                    try { File.Delete(updaterExePath); } catch { }
                }

                // ETAPA 1: Obter o Updater Monolítico (Local ou Remoto)
                if (!string.IsNullOrEmpty(localFilePath) && File.Exists(localFilePath))
                {
                    LogUpdate($"Usando arquivo local já baixado: {localFilePath}");
                    
                    if (localFilePath.EndsWith(".zip", StringComparison.OrdinalIgnoreCase))
                    {
                         LogUpdate("AVISO: O arquivo local é um ZIP, não um executável monolítico auto-contido. Isso pode falhar se não houver um descompactador externo.");
                    }

                    File.Copy(localFilePath, updaterExePath, true);
                }
                else
                {
                    LogUpdate("Arquivo local não fornecido, iniciando download...");
                    LogUpdate($"URL de origem: {updateInfo.DownloadUrl}");
                
                    using (var response = await _httpClient.GetAsync(updateInfo.DownloadUrl, HttpCompletionOption.ResponseHeadersRead))
                    {
                        response.EnsureSuccessStatusCode();
                        using var stream = await response.Content.ReadAsStreamAsync();
                        using var fs = new FileStream(updaterExePath, FileMode.Create, FileAccess.Write, FileShare.None);
                        await stream.CopyToAsync(fs);
                    }
                }
                
                LogUpdate($"Updater pronto: {updaterExePath}");
                LogUpdate($"Tamanho: {new FileInfo(updaterExePath).Length / 1024 / 1024:F2} MB");

                // ETAPA 2: Preparar Argumentos
                var installPath = AppDomain.CurrentDomain.BaseDirectory;
                var currentExe = Process.GetCurrentProcess().MainModule?.FileName ?? Path.Combine(installPath, "VoltrisOptimizer.exe");
                
                // ETAPA 3: Executar Updater (Safe Execution)
                var startInfo = new ProcessStartInfo
                {
                    FileName = updaterExePath,
                    UseShellExecute = true,
                    Verb = "runas", // Forçar elevação para garantir que possa substituir arquivos
                    WorkingDirectory = Path.GetDirectoryName(updaterExePath)
                };

                // Argumentos com aspas reforçadas e changelog
                string safeChangelog = updateInfo.Changelog?.Replace("\"", "\\\"") ?? "";
                startInfo.Arguments = $"--target \"{installPath.TrimEnd('\\')}\" --restart \"{currentExe}\" --changelog \"{safeChangelog}\"";
                
                LogUpdate($"Lançando Atualizador: {updaterExePath}");
                LogUpdate($"Argumentos: {startInfo.Arguments}");

                try 
                {
                    var process = Process.Start(startInfo);
                    if (process != null)
                    {
                        LogUpdate($"SUCESSO: Atualizador lançado com PID {process.Id}.");
                        // Aguardar um pouco para garantir que o Windows iniciou o processo antes de fechar o pai
                        await Task.Delay(1000);
                        System.Windows.Application.Current.Dispatcher.Invoke(() => System.Windows.Application.Current.Shutdown());
                        return true;
                    }
                }
                catch (Exception ex)
                {
                    string launchError = $"ERRO AO LANÇAR PROCESSO: {ex.Message}";
                    LogUpdate(launchError);
                    System.Windows.MessageBox.Show(launchError, "Falha de Execução");
                }
                
                return false;
            }
            catch (Exception ex)
            {
                LogUpdate($"ERRO GERAL: {ex.Message}");
                return false;
            }
        }
        
        private static async Task<string?> GetUpdaterUrlAsync(UpdateInfo updateInfo)
        {
            try
            {
                LogUpdate("Iniciando busca do Updater no GitHub...");
                
                string archSuffix = Environment.Is64BitProcess ? "x64" : "x86";
                string targetName = $"VoltrisUpdater_{archSuffix}.exe";
                
                // Tenta buscar no repo de releases
                LogUpdate($"Procurando {targetName} em voltris-releases...");
                
                var response = await _httpClient.GetStringAsync(GITHUB_RELEASES_REPO_API);
                using var doc = JsonDocument.Parse(response);
                var root = doc.RootElement;

                if (root.TryGetProperty("assets", out var assets))
                {
                    foreach (var asset in assets.EnumerateArray())
                    {
                        string name = asset.GetProperty("name").GetString() ?? "";
                        if (name.Contains(targetName, StringComparison.OrdinalIgnoreCase))
                        {
                            return asset.GetProperty("browser_download_url").GetString();
                        }
                    }
                }

                LogUpdate("Não encontrado no latest. Tentando via link direto do JSON...");
                if (!string.IsNullOrEmpty(updateInfo.DownloadUrl))
                {
                    // Se o JSON tem o link (mesmo que seja x64), vamos tentar substituir pra ver se o x86 existe
                    string fixedUrl = updateInfo.DownloadUrl.Replace("VoltrisUpdater_x64.exe", targetName);
                    LogUpdate($"Tentando URL corrigida: {fixedUrl}");
                    return fixedUrl;
                }

                return null;
            }
            catch (Exception ex)
            {
                string error = $"Erro ao obter URL: {ex.Message}";
                LogUpdate(error);
                System.Windows.MessageBox.Show(error, "Update Debug");
                return null;
            }
        }
        
        /// <summary>
        /// Obtém o caminho de instalação do registro
        /// </summary>
        private static string? GetInstallPath()
        {
            try
            {
                using var baseKey = RegistryKey.OpenBaseKey(RegistryHive.LocalMachine, RegistryView.Registry32);
                using var key = baseKey.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall\VoltrisOptimizer");
                return key?.GetValue("InstallLocation") as string;
            }
            catch
            {
                return null;
            }
        }
        
        /// <summary>
        /// Aplica a atualização - substitui o executável e reinicia o app (MÉTODO LEGADO - usar StartAutoUpdateAsync)
        /// </summary>
        [Obsolete("Use StartAutoUpdateAsync instead")]
        public static void ApplyUpdateAndRestart(string newExePath)
        {
            try
            {
                var currentExe = Process.GetCurrentProcess().MainModule?.FileName;
                
                if (string.IsNullOrEmpty(currentExe))
                {
                    currentExe = Environment.ProcessPath;
                }
                
                if (string.IsNullOrEmpty(currentExe) || !File.Exists(newExePath))
                {
                    throw new Exception("Caminho do executável não encontrado");
                }
                
                // Criar script batch para substituir o exe após o app fechar
                var batchPath = Path.Combine(_updateFolder, "update.bat");
                var batchContent = $@"
@echo off
echo Aguardando o aplicativo fechar...
timeout /t 2 /nobreak > nul

echo Aplicando atualização...
:retry
del ""{currentExe}"" > nul 2>&1
if exist ""{currentExe}"" (
    timeout /t 1 /nobreak > nul
    goto retry
)

copy /y ""{newExePath}"" ""{currentExe}""

echo Iniciando aplicativo atualizado...
start """" ""{currentExe}""

echo Limpando arquivos temporários...
del ""{newExePath}"" > nul 2>&1
del ""%~f0"" > nul 2>&1
";
                
                File.WriteAllText(batchPath, batchContent);
                
                // Executar o batch script em background
                var startInfo = new ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    Arguments = $"/c \"{batchPath}\"",
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    WindowStyle = ProcessWindowStyle.Hidden
                };
                
                Process.Start(startInfo);
                
                // Fechar o aplicativo atual
                System.Windows.Application.Current.Dispatcher.Invoke(() =>
                {
                    System.Windows.Application.Current.Shutdown();
                });
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"[UpdateService] Erro ao aplicar atualização: {ex.Message}");
                throw;
            }
        }
        
        /// <summary>
        /// Limpa arquivos de atualização antigos
        /// </summary>
        public static void CleanupOldUpdates()
        {
            try
            {
                if (!Directory.Exists(_updateFolder))
                    return;
                
                foreach (var file in Directory.GetFiles(_updateFolder))
                {
                    try
                    {
                        var info = new FileInfo(file);
                        if (info.LastWriteTime < DateTime.Now.AddDays(-7))
                        {
                            File.Delete(file);
                        }
                    }
                    catch { }
                }
            }
            catch { }
        }
    }
}
