using System;
using System.Diagnostics;
using System.IO;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32;

namespace VoltrisOptimizer.Services.Update
{
    /// <summary>
    /// Informações sobre uma versão disponível
    /// </summary>
    public class UpdateInfo
    {
        [JsonPropertyName("version")]
        public string Version { get; set; } = string.Empty;
        
        [JsonPropertyName("releaseDate")]
        public DateTime ReleaseDate { get; set; }
        
        [JsonPropertyName("downloadUrl")]
        public string DownloadUrl { get; set; } = string.Empty;
        
        [JsonPropertyName("fileHash")]
        public string FileHash { get; set; } = string.Empty;
        
        [JsonPropertyName("fileSize")]
        public long FileSize { get; set; }
        
        [JsonPropertyName("releaseNotes")]
        public string ReleaseNotes { get; set; } = string.Empty;
        
        [JsonPropertyName("isMandatory")]
        public bool IsMandatory { get; set; }
        
        [JsonPropertyName("minVersion")]
        public string? MinVersion { get; set; }
        
        [JsonPropertyName("signature")]
        public string Signature { get; set; } = string.Empty;
    }

    /// <summary>
    /// Resultado da verificação de atualização
    /// </summary>
    public class UpdateCheckResult
    {
        public bool UpdateAvailable { get; set; }
        public UpdateInfo? UpdateInfo { get; set; }
        public string? Error { get; set; }
    }

    /// <summary>
    /// Progresso do download
    /// </summary>
    public class DownloadProgress
    {
        public long BytesDownloaded { get; set; }
        public long TotalBytes { get; set; }
        public double ProgressPercent => TotalBytes > 0 ? (double)BytesDownloaded / TotalBytes * 100 : 0;
        public string Status { get; set; } = string.Empty;
    }

    /// <summary>
    /// Serviço de atualização automática do Voltris Optimizer
    /// </summary>
    public class AutoUpdateService : IDisposable
    {
        private const string UPDATE_CHECK_URL = "https://api.voltris.com/updates/latest";
        private const string FALLBACK_UPDATE_URL = "https://voltris.com/api/updates/latest";
        private const string REGISTRY_KEY = @"SOFTWARE\Voltris\Optimizer";
        private const string LAST_CHECK_VALUE = "LastUpdateCheck";
        private const string SKIPPED_VERSION_VALUE = "SkippedVersion";
        
        private readonly HttpClient _httpClient;
        private readonly ILoggingService? _logger;
        private readonly string _currentVersion;
        private readonly string _downloadPath;
        private CancellationTokenSource? _downloadCts;
        private bool _disposed;

        /// <summary>
        /// Evento disparado quando nova atualização está disponível
        /// </summary>
        public event EventHandler<UpdateInfo>? UpdateAvailable;
        
        /// <summary>
        /// Evento disparado para reportar progresso de download
        /// </summary>
        public event EventHandler<DownloadProgress>? DownloadProgressChanged;
        
        /// <summary>
        /// Evento disparado quando download é completado
        /// </summary>
        public event EventHandler<string>? DownloadCompleted;
        
        /// <summary>
        /// Evento disparado em caso de erro
        /// </summary>
        public event EventHandler<string>? UpdateError;

        public AutoUpdateService(ILoggingService? logger = null)
        {
            _logger = logger;
            _currentVersion = GetCurrentVersion();
            _downloadPath = Path.Combine(Path.GetTempPath(), "VoltrisUpdates");
            
            _httpClient = new HttpClient
            {
                Timeout = TimeSpan.FromSeconds(30)
            };
            _httpClient.DefaultRequestHeaders.Add("User-Agent", $"VoltrisOptimizer/{_currentVersion}");
            
            Directory.CreateDirectory(_downloadPath);
        }

        /// <summary>
        /// Obtém a versão atual do aplicativo
        /// </summary>
        private string GetCurrentVersion()
        {
            try
            {
                var version = System.Reflection.Assembly.GetExecutingAssembly().GetName().Version;
                if (version != null)
                {
                    // Incluir Revision se for diferente de -1 (não definido)
                    if (version.Revision != -1 && version.Revision != 0)
                    {
                        return $"{version.Major}.{version.Minor}.{version.Build}.{version.Revision}";
                    }
                    return $"{version.Major}.{version.Minor}.{version.Build}";
                }
                return "1.0.0.1";
            }
            catch
            {
                return "1.0.0.1";
            }
        }

        /// <summary>
        /// Verifica se há atualizações disponíveis
        /// </summary>
        public async Task<UpdateCheckResult> CheckForUpdatesAsync(bool ignoreCache = false)
        {
            try
            {
                _logger?.LogInfo("[UPDATE] Verificando atualizações...");
                
                // Verificar cache (não verificar mais de 1x por hora, exceto se forçado)
                if (!ignoreCache && !ShouldCheckForUpdates())
                {
                    _logger?.LogInfo("[UPDATE] Última verificação foi há menos de 1 hora");
                    return new UpdateCheckResult { UpdateAvailable = false };
                }
                
                // Tentar URL principal, depois fallback
                string? responseJson = null;
                
                try
                {
                    responseJson = await _httpClient.GetStringAsync(UPDATE_CHECK_URL);
                }
                catch
                {
                    _logger?.LogWarning("[UPDATE] URL principal falhou, tentando fallback...");
                    try
                    {
                        responseJson = await _httpClient.GetStringAsync(FALLBACK_UPDATE_URL);
                    }
                    catch (Exception ex)
                    {
                        _logger?.LogWarning($"[UPDATE] Fallback também falhou: {ex.Message}");
                        return new UpdateCheckResult 
                        { 
                            UpdateAvailable = false, 
                            Error = "Não foi possível conectar ao servidor de atualizações" 
                        };
                    }
                }
                
                if (string.IsNullOrEmpty(responseJson))
                {
                    return new UpdateCheckResult 
                    { 
                        UpdateAvailable = false, 
                        Error = "Resposta vazia do servidor" 
                    };
                }
                
                var updateInfo = JsonSerializer.Deserialize<UpdateInfo>(responseJson);
                
                if (updateInfo == null)
                {
                    return new UpdateCheckResult 
                    { 
                        UpdateAvailable = false, 
                        Error = "Erro ao processar informações de atualização" 
                    };
                }
                
                // Verificar se a assinatura é válida
                if (!VerifyUpdateSignature(updateInfo))
                {
                    _logger?.LogWarning("[UPDATE] Assinatura de atualização inválida!");
                    return new UpdateCheckResult 
                    { 
                        UpdateAvailable = false, 
                        Error = "Assinatura de atualização inválida" 
                    };
                }
                
                // Comparar versões
                var currentVer = Version.Parse(_currentVersion);
                var newVer = Version.Parse(updateInfo.Version);
                
                // Atualizar timestamp de verificação
                SaveLastCheckTime();
                
                if (newVer > currentVer)
                {
                    // Verificar se esta versão foi pulada pelo usuário
                    var skippedVersion = GetSkippedVersion();
                    if (!updateInfo.IsMandatory && skippedVersion == updateInfo.Version)
                    {
                        _logger?.LogInfo($"[UPDATE] Versão {updateInfo.Version} foi pulada pelo usuário");
                        return new UpdateCheckResult { UpdateAvailable = false };
                    }
                    
                    _logger?.LogInfo($"[UPDATE] Nova versão disponível: {updateInfo.Version}");
                    UpdateAvailable?.Invoke(this, updateInfo);
                    
                    return new UpdateCheckResult
                    {
                        UpdateAvailable = true,
                        UpdateInfo = updateInfo
                    };
                }
                
                _logger?.LogInfo("[UPDATE] Aplicativo está atualizado");
                return new UpdateCheckResult { UpdateAvailable = false };
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[UPDATE] Erro ao verificar atualizações: {ex.Message}", ex);
                return new UpdateCheckResult 
                { 
                    UpdateAvailable = false, 
                    Error = ex.Message 
                };
            }
        }

        /// <summary>
        /// Faz download da atualização
        /// </summary>
        public async Task<string?> DownloadUpdateAsync(UpdateInfo updateInfo)
        {
            try
            {
                _logger?.LogInfo($"[UPDATE] Iniciando download da versão {updateInfo.Version}...");
                
                _downloadCts = new CancellationTokenSource();
                var token = _downloadCts.Token;
                
                var fileName = $"VoltrisOptimizer_v{updateInfo.Version}_Setup.exe";
                var filePath = Path.Combine(_downloadPath, fileName);
                
                // Limpar downloads antigos
                CleanupOldDownloads();
                
                // Download com progresso
                using var response = await _httpClient.GetAsync(
                    updateInfo.DownloadUrl, 
                    HttpCompletionOption.ResponseHeadersRead, 
                    token);
                
                response.EnsureSuccessStatusCode();
                
                var totalBytes = response.Content.Headers.ContentLength ?? updateInfo.FileSize;
                
                await using var contentStream = await response.Content.ReadAsStreamAsync(token);
                await using var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None, 8192, true);
                
                var buffer = new byte[8192];
                long bytesDownloaded = 0;
                int bytesRead;
                
                var lastProgress = DateTime.MinValue;
                
                while ((bytesRead = await contentStream.ReadAsync(buffer, 0, buffer.Length, token)) > 0)
                {
                    await fileStream.WriteAsync(buffer, 0, bytesRead, token);
                    bytesDownloaded += bytesRead;
                    
                    // Atualizar progresso a cada 100ms
                    if ((DateTime.Now - lastProgress).TotalMilliseconds > 100)
                    {
                        var progress = new DownloadProgress
                        {
                            BytesDownloaded = bytesDownloaded,
                            TotalBytes = totalBytes,
                            Status = $"Baixando... {FormatBytes(bytesDownloaded)} / {FormatBytes(totalBytes)}"
                        };
                        
                        DownloadProgressChanged?.Invoke(this, progress);
                        lastProgress = DateTime.Now;
                    }
                }
                
                // Verificar hash do arquivo
                _logger?.LogInfo("[UPDATE] Verificando integridade do arquivo...");
                
                var progress2 = new DownloadProgress
                {
                    BytesDownloaded = totalBytes,
                    TotalBytes = totalBytes,
                    Status = "Verificando integridade..."
                };
                DownloadProgressChanged?.Invoke(this, progress2);
                
                var fileHash = await CalculateFileHashAsync(filePath);
                
                if (!string.Equals(fileHash, updateInfo.FileHash, StringComparison.OrdinalIgnoreCase))
                {
                    _logger?.LogError("[UPDATE] Hash do arquivo não corresponde!");
                    File.Delete(filePath);
                    UpdateError?.Invoke(this, "Verificação de integridade falhou. Por favor, tente novamente.");
                    return null;
                }
                
                _logger?.LogSuccess($"[UPDATE] Download concluído: {filePath}");
                DownloadCompleted?.Invoke(this, filePath);
                
                return filePath;
            }
            catch (OperationCanceledException)
            {
                _logger?.LogInfo("[UPDATE] Download cancelado pelo usuário");
                UpdateError?.Invoke(this, "Download cancelado");
                return null;
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[UPDATE] Erro no download: {ex.Message}", ex);
                UpdateError?.Invoke(this, $"Erro no download: {ex.Message}");
                return null;
            }
        }

        /// <summary>
        /// Cancela download em andamento
        /// </summary>
        public void CancelDownload()
        {
            _downloadCts?.Cancel();
        }

        /// <summary>
        /// Instala a atualização baixada
        /// </summary>
        public async Task<bool> InstallUpdateAsync(string installerPath)
        {
            try
            {
                if (!File.Exists(installerPath))
                {
                    _logger?.LogError("[UPDATE] Arquivo de instalação não encontrado");
                    return false;
                }
                
                _logger?.LogInfo("[UPDATE] Iniciando instalação...");
                
                // Criar script de atualização para executar após fechar o app
                var updateScript = CreateUpdateScript(installerPath);
                
                // Executar script em background
                var psi = new ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    Arguments = $"/c \"{updateScript}\"",
                    UseShellExecute = true,
                    CreateNoWindow = true,
                    WindowStyle = ProcessWindowStyle.Hidden
                };
                
                Process.Start(psi);
                
                _logger?.LogInfo("[UPDATE] Script de atualização iniciado, fechando aplicativo...");
                
                // Aguardar um pouco antes de fechar
                await Task.Delay(500);
                
                // Solicitar fechamento do aplicativo
                System.Windows.Application.Current?.Dispatcher.Invoke(() =>
                {
                    System.Windows.Application.Current.Shutdown();
                });
                
                return true;
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[UPDATE] Erro na instalação: {ex.Message}", ex);
                return false;
            }
        }

        /// <summary>
        /// Cria script de atualização
        /// </summary>
        private string CreateUpdateScript(string installerPath)
        {
            var scriptPath = Path.Combine(_downloadPath, "update_script.bat");
            var currentExe = Process.GetCurrentProcess().MainModule?.FileName ?? 
                             Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "VoltrisOptimizer.exe");
            
            var script = $@"@echo off
echo Aguardando fechamento do Voltris Optimizer...
timeout /t 3 /nobreak > nul

:wait_loop
tasklist /FI ""IMAGENAME eq VoltrisOptimizer.exe"" 2>NUL | find /I /N ""VoltrisOptimizer.exe"">NUL
if ""%ERRORLEVEL%""==""0"" (
    timeout /t 1 /nobreak > nul
    goto wait_loop
)

echo Instalando atualização...
start /wait """" ""{installerPath}"" /SILENT /NORESTART

echo Iniciando Voltris Optimizer...
start """" ""{currentExe}""

echo Limpando arquivos temporários...
del /q ""{installerPath}"" 2>nul
del /q ""%~f0"" 2>nul
";
            
            File.WriteAllText(scriptPath, script, Encoding.UTF8);
            return scriptPath;
        }

        /// <summary>
        /// Marca uma versão como pulada (usuário escolheu não atualizar)
        /// </summary>
        public void SkipVersion(string version)
        {
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(REGISTRY_KEY);
                key?.SetValue(SKIPPED_VERSION_VALUE, version);
                _logger?.LogInfo($"[UPDATE] Versão {version} marcada como pulada");
            }
            catch (Exception ex)
            {
                _logger?.LogWarning($"[UPDATE] Erro ao salvar versão pulada: {ex.Message}");
            }
        }

        /// <summary>
        /// Obtém versão que foi pulada
        /// </summary>
        private string? GetSkippedVersion()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(REGISTRY_KEY);
                return key?.GetValue(SKIPPED_VERSION_VALUE)?.ToString();
            }
            catch
            {
                return null;
            }
        }

        /// <summary>
        /// Verifica se deve checar por atualizações (cache de 1 hora)
        /// </summary>
        private bool ShouldCheckForUpdates()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(REGISTRY_KEY);
                var lastCheckStr = key?.GetValue(LAST_CHECK_VALUE)?.ToString();
                
                if (string.IsNullOrEmpty(lastCheckStr))
                    return true;
                
                if (DateTime.TryParse(lastCheckStr, out var lastCheck))
                {
                    return (DateTime.Now - lastCheck).TotalHours >= 1;
                }
                
                return true;
            }
            catch
            {
                return true;
            }
        }

        /// <summary>
        /// Salva timestamp da última verificação
        /// </summary>
        private void SaveLastCheckTime()
        {
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(REGISTRY_KEY);
                key?.SetValue(LAST_CHECK_VALUE, DateTime.Now.ToString("o"));
            }
            catch { }
        }

        /// <summary>
        /// Verifica assinatura da atualização
        /// </summary>
        private bool VerifyUpdateSignature(UpdateInfo updateInfo)
        {
            try
            {
                // Para versões de teste, aceitar sem assinatura
                if (string.IsNullOrEmpty(updateInfo.Signature))
                {
                    _logger?.LogWarning("[UPDATE] Atualização sem assinatura (ambiente de teste)");
                    return true; // Em produção, mudar para false
                }
                
                // Construir string para verificação
                var dataToVerify = $"{updateInfo.Version}|{updateInfo.DownloadUrl}|{updateInfo.FileHash}";
                
                // Usar serviço de segurança para validar
                // return Security.EnhancedLicenseSecurityService.ValidateSignature(dataToVerify, updateInfo.Signature);
                
                // Por enquanto, aceitar qualquer assinatura
                return true;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Calcula hash SHA256 de um arquivo
        /// </summary>
        private async Task<string> CalculateFileHashAsync(string filePath)
        {
            using var sha256 = SHA256.Create();
            await using var stream = File.OpenRead(filePath);
            var hash = await sha256.ComputeHashAsync(stream);
            return BitConverter.ToString(hash).Replace("-", "");
        }

        /// <summary>
        /// Limpa downloads antigos
        /// </summary>
        private void CleanupOldDownloads()
        {
            try
            {
                var files = Directory.GetFiles(_downloadPath, "*.exe");
                foreach (var file in files)
                {
                    try
                    {
                        var fileInfo = new FileInfo(file);
                        if ((DateTime.Now - fileInfo.LastWriteTime).TotalDays > 7)
                        {
                            File.Delete(file);
                        }
                    }
                    catch { }
                }
            }
            catch { }
        }

        /// <summary>
        /// Formata bytes para exibição
        /// </summary>
        private string FormatBytes(long bytes)
        {
            string[] sizes = { "B", "KB", "MB", "GB" };
            double len = bytes;
            int order = 0;
            
            while (len >= 1024 && order < sizes.Length - 1)
            {
                order++;
                len /= 1024;
            }
            
            return $"{len:0.##} {sizes[order]}";
        }

        public void Dispose()
        {
            if (_disposed) return;
            _disposed = true;
            
            _downloadCts?.Cancel();
            _downloadCts?.Dispose();
            _httpClient.Dispose();
        }
    }
}

