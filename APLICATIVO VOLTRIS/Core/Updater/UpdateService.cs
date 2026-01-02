using System;
using System.Diagnostics;
using System.IO;
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
            
            return "1.0.0.1"; // Versão fallback
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
                
                foreach (var asset in assets.EnumerateArray())
                {
                    var name = asset.GetProperty("name").GetString() ?? "";
                    Debug.WriteLine($"[UpdateService] Asset: {name}");
                    
                    if (name.Contains("Setup.exe") || name.Contains("Installer.exe"))
                    {
                        downloadUrl = asset.GetProperty("browser_download_url").GetString();
                        Debug.WriteLine($"[UpdateService] Asset do instalador encontrado: {downloadUrl}");
                        break;
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
                // Garantir que o diretório existe
                Directory.CreateDirectory(_updateFolder);
                
                var fileName = $"VoltrisOptimizer_{updateInfo.LatestVersion}.exe";
                var filePath = Path.Combine(_updateFolder, fileName);
                
                // Remover arquivo anterior se existir
                if (File.Exists(filePath))
                    File.Delete(filePath);
                
                using var response = await _httpClient.GetAsync(updateInfo.DownloadUrl, HttpCompletionOption.ResponseHeadersRead);
                response.EnsureSuccessStatusCode();
                
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
                
                return filePath;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"[UpdateService] Erro ao baixar atualização: {ex.Message}");
                return null;
            }
        }
        
        /// <summary>
        /// Baixa o Updater.exe e inicia o processo de atualização automática
        /// </summary>
        public static async Task<bool> StartAutoUpdateAsync(UpdateInfo updateInfo)
        {
            try
            {
                // Caminho onde o Updater será baixado
                var updaterDir = Path.Combine(_updateFolder, "Updater");
                Directory.CreateDirectory(updaterDir);
                var updaterExe = Path.Combine(updaterDir, "VoltrisUpdater.exe");
                
                // Se o Updater já existe, usar ele. Senão, baixar do GitHub
                if (!File.Exists(updaterExe))
                {
                    // Tentar usar Updater local se existir na pasta Update (para testes)
                    var localUpdater = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "..", "..", "Update", "VoltrisUpdater_v1.0.0.2.exe");
                    var localUpdater2 = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Update", "VoltrisUpdater_v1.0.0.2.exe");
                    
                    if (File.Exists(localUpdater))
                    {
                        Debug.WriteLine($"[UpdateService] Usando Updater local: {localUpdater}");
                        File.Copy(localUpdater, updaterExe, true);
                    }
                    else if (File.Exists(localUpdater2))
                    {
                        Debug.WriteLine($"[UpdateService] Usando Updater local: {localUpdater2}");
                        File.Copy(localUpdater2, updaterExe, true);
                    }
                    else
                    {
                        // Tentar baixar o Updater do release do GitHub
                        var updaterUrl = await GetUpdaterUrlAsync(updateInfo);
                        if (!string.IsNullOrEmpty(updaterUrl))
                        {
                            Debug.WriteLine($"[UpdateService] Baixando Updater de: {updaterUrl}");
                            using var response = await _httpClient.GetAsync(updaterUrl);
                            response.EnsureSuccessStatusCode();
                            
                            using var contentStream = await response.Content.ReadAsStreamAsync();
                            using var fileStream = new FileStream(updaterExe, FileMode.Create, FileAccess.Write, FileShare.None);
                            await contentStream.CopyToAsync(fileStream);
                        }
                        else
                        {
                            Debug.WriteLine("[UpdateService] Updater não encontrado. Verifique se o release foi criado no GitHub.");
                            return false;
                        }
                    }
                }
                
                // Obter caminho de instalação do registro
                var installPath = GetInstallPath();
                if (string.IsNullOrEmpty(installPath))
                {
                    installPath = Path.GetDirectoryName(Process.GetCurrentProcess().MainModule?.FileName) ?? AppDomain.CurrentDomain.BaseDirectory;
                }
                
                // Obter executável atual
                var currentExe = Process.GetCurrentProcess().MainModule?.FileName ?? 
                                Path.Combine(installPath, "VoltrisOptimizer.exe");
                
                // Construir argumentos para o Updater
                // O Updater tem payload embutido, então não precisa de --url
                // Se não tiver payload, ele pode usar --url, mas vamos deixar ele usar o embutido
                var args = $"--target \"{installPath}\" " +
                          $"--restart \"{currentExe}\"";
                
                Debug.WriteLine($"[UpdateService] Iniciando Updater: {updaterExe} {args}");
                
                // Executar o Updater
                var startInfo = new ProcessStartInfo
                {
                    FileName = updaterExe,
                    Arguments = args,
                    UseShellExecute = true,
                    Verb = "runas" // Executar como administrador
                };
                
                Process.Start(startInfo);
                
                // Aguardar um pouco para garantir que o Updater iniciou
                await Task.Delay(1000);
                
                // Fechar o aplicativo atual
                System.Windows.Application.Current.Dispatcher.Invoke(() =>
                {
                    System.Windows.Application.Current.Shutdown();
                });
                
                return true;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"[UpdateService] Erro ao iniciar atualização automática: {ex.Message}");
                return false;
            }
        }
        
        /// <summary>
        /// Obtém a URL do Updater.exe do release do GitHub
        /// </summary>
        private static async Task<string?> GetUpdaterUrlAsync(UpdateInfo updateInfo)
        {
            try
            {
                // Tentar buscar do repositório de releases (voltris-releases)
                Debug.WriteLine($"[UpdateService] Buscando Updater em: {GITHUB_RELEASES_REPO_API}");
                var response = await _httpClient.GetStringAsync(GITHUB_RELEASES_REPO_API);
                
                using var doc = JsonDocument.Parse(response);
                var root = doc.RootElement;
                var assets = root.GetProperty("assets");
                
                Debug.WriteLine($"[UpdateService] Assets encontrados: {assets.GetArrayLength()}");
                
                foreach (var asset in assets.EnumerateArray())
                {
                    var name = asset.GetProperty("name").GetString() ?? "";
                    Debug.WriteLine($"[UpdateService] Verificando asset: {name}");
                    
                    if (name.Contains("Updater.exe", StringComparison.OrdinalIgnoreCase) || 
                        name.Contains("VoltrisUpdater", StringComparison.OrdinalIgnoreCase))
                    {
                        var url = asset.GetProperty("browser_download_url").GetString();
                        Debug.WriteLine($"[UpdateService] Updater encontrado: {url}");
                        return url;
                    }
                }
                
                Debug.WriteLine("[UpdateService] Updater não encontrado nos assets");
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"[UpdateService] Erro ao buscar Updater: {ex.Message}");
            }
            
            return null;
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
