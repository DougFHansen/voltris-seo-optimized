using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Reflection;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;

namespace VoltrisOptimizer.Services.License
{
    /// <summary>
    /// Serviço de comunicação com a API de licenças
    /// </summary>
    public class LicenseApiService : IDisposable
    {
        private static LicenseApiService? _instance;
        public static LicenseApiService Instance => _instance ??= new LicenseApiService();
        
        private readonly HttpClient _httpClient;
        private const string DefaultApiBaseUrl = "https://api.voltris.com/v1/license";
        private readonly string _apiBaseUrl;
        private readonly JsonSerializerOptions _jsonOptions;
        
        // Retry configuration
        private const int MaxRetries = 3;
        private const int RetryDelayMs = 1000;
        
        private LicenseApiService()
        {
            _apiBaseUrl = GetApiBaseUrl();
            
            _httpClient = new HttpClient
            {
                Timeout = TimeSpan.FromSeconds(30)
            };
            
            _httpClient.DefaultRequestHeaders.Add("User-Agent", $"VoltrisOptimizer/{GetVersion()}");
            _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
            
            _jsonOptions = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
            };
        }
        
        private string GetApiBaseUrl()
        {
            // Pode ser configurado via settings ou ambiente
            try
            {
                var settings = SettingsService.Instance.Settings;
                if (!string.IsNullOrEmpty(settings.LicenseApiUrl))
                    return settings.LicenseApiUrl;
            }
            catch { }
            
            return DefaultApiBaseUrl;
        }
        
        private string GetVersion()
        {
            try
            {
                return Assembly.GetExecutingAssembly().GetName().Version?.ToString() ?? "1.0.0";
            }
            catch
            {
                return "1.0.0";
            }
        }
        
        /// <summary>
        /// Valida uma licença no servidor
        /// </summary>
        public async Task<LicenseValidationResponse> ValidateLicenseAsync(
            string licenseKey, 
            string deviceId, 
            CancellationToken ct = default)
        {
            var request = new LicenseValidationRequest
            {
                LicenseKey = licenseKey,
                DeviceId = deviceId,
                Version = GetVersion(),
                Platform = "Windows",
                MachineName = Environment.MachineName
            };
            
            return await ExecuteWithRetryAsync(async () =>
            {
                var response = await _httpClient.PostAsJsonAsync(
                    $"{_apiBaseUrl}/validate", 
                    request, 
                    _jsonOptions, 
                    ct);
                
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync(ct);
                    App.LoggingService?.LogWarning($"[LicenseAPI] Erro HTTP {response.StatusCode}: {errorContent}");
                    
                    return new LicenseValidationResponse
                    {
                        Valid = false,
                        ErrorMessage = $"Erro de comunicação: {response.StatusCode}",
                        ErrorCode = "HTTP_ERROR"
                    };
                }
                
                var result = await response.Content.ReadFromJsonAsync<LicenseValidationResponse>(_jsonOptions, ct);
                return result ?? new LicenseValidationResponse { Valid = false, ErrorMessage = "Resposta inválida" };
                
            }, ct);
        }
        
        /// <summary>
        /// Ativa uma licença no servidor (registra o dispositivo)
        /// </summary>
        public async Task<LicenseActivationResponse> ActivateLicenseAsync(
            string licenseKey,
            string deviceId,
            CancellationToken ct = default)
        {
            var request = new LicenseActivationRequest
            {
                LicenseKey = licenseKey,
                DeviceId = deviceId,
                Version = GetVersion(),
                Platform = "Windows",
                MachineName = Environment.MachineName,
                OSVersion = Environment.OSVersion.VersionString,
                ProcessorCount = Environment.ProcessorCount
            };
            
            return await ExecuteWithRetryAsync(async () =>
            {
                var response = await _httpClient.PostAsJsonAsync(
                    $"{_apiBaseUrl}/activate",
                    request,
                    _jsonOptions,
                    ct);
                
                if (!response.IsSuccessStatusCode)
                {
                    var errorContent = await response.Content.ReadAsStringAsync(ct);
                    App.LoggingService?.LogWarning($"[LicenseAPI] Erro HTTP {response.StatusCode}: {errorContent}");
                    
                    // Tentar parsear erro estruturado
                    try
                    {
                        var errorResponse = JsonSerializer.Deserialize<LicenseActivationResponse>(errorContent, _jsonOptions);
                        if (errorResponse != null)
                            return errorResponse;
                    }
                    catch { }
                    
                    return new LicenseActivationResponse
                    {
                        Success = false,
                        ErrorMessage = $"Erro de comunicação: {response.StatusCode}",
                        ErrorCode = "HTTP_ERROR"
                    };
                }
                
                var result = await response.Content.ReadFromJsonAsync<LicenseActivationResponse>(_jsonOptions, ct);
                return result ?? new LicenseActivationResponse { Success = false, ErrorMessage = "Resposta inválida" };
                
            }, ct);
        }
        
        /// <summary>
        /// Desativa um dispositivo (libera slot)
        /// </summary>
        public async Task<LicenseDeactivationResponse> DeactivateDeviceAsync(
            string licenseKey,
            string deviceId,
            CancellationToken ct = default)
        {
            var request = new LicenseDeactivationRequest
            {
                LicenseKey = licenseKey,
                DeviceId = deviceId
            };
            
            return await ExecuteWithRetryAsync(async () =>
            {
                var response = await _httpClient.PostAsJsonAsync(
                    $"{_apiBaseUrl}/deactivate",
                    request,
                    _jsonOptions,
                    ct);
                
                if (!response.IsSuccessStatusCode)
                {
                    return new LicenseDeactivationResponse
                    {
                        Success = false,
                        ErrorMessage = $"Erro de comunicação: {response.StatusCode}"
                    };
                }
                
                var result = await response.Content.ReadFromJsonAsync<LicenseDeactivationResponse>(_jsonOptions, ct);
                return result ?? new LicenseDeactivationResponse { Success = false };
                
            }, ct);
        }
        
        /// <summary>
        /// Obtém informações detalhadas da licença
        /// </summary>
        public async Task<LicenseInfoResponse> GetLicenseInfoAsync(
            string licenseKey,
            CancellationToken ct = default)
        {
            return await ExecuteWithRetryAsync(async () =>
            {
                var response = await _httpClient.GetAsync(
                    $"{_apiBaseUrl}/info?key={Uri.EscapeDataString(licenseKey)}",
                    ct);
                
                if (!response.IsSuccessStatusCode)
                {
                    return new LicenseInfoResponse { Valid = false };
                }
                
                var result = await response.Content.ReadFromJsonAsync<LicenseInfoResponse>(_jsonOptions, ct);
                return result ?? new LicenseInfoResponse { Valid = false };
                
            }, ct);
        }
        
        /// <summary>
        /// Executa uma operação com retry inteligente
        /// </summary>
        private async Task<T> ExecuteWithRetryAsync<T>(
            Func<Task<T>> operation, 
            CancellationToken ct) where T : class, new()
        {
            Exception? lastException = null;
            
            for (int attempt = 0; attempt < MaxRetries; attempt++)
            {
                try
                {
                    if (attempt > 0)
                    {
                        var delay = RetryDelayMs * (int)Math.Pow(2, attempt - 1);
                        await Task.Delay(delay, ct);
                        App.LoggingService?.LogInfo($"[LicenseAPI] Tentativa {attempt + 1}/{MaxRetries}...");
                    }
                    
                    return await operation();
                }
                catch (TaskCanceledException) when (ct.IsCancellationRequested)
                {
                    throw;
                }
                catch (HttpRequestException ex)
                {
                    lastException = ex;
                    App.LoggingService?.LogWarning($"[LicenseAPI] Erro de rede: {ex.Message}");
                }
                catch (Exception ex)
                {
                    lastException = ex;
                    App.LoggingService?.LogError($"[LicenseAPI] Erro inesperado", ex);
                    break;
                }
            }
            
            App.LoggingService?.LogError($"[LicenseAPI] Falha após {MaxRetries} tentativas", lastException);
            return new T();
        }
        
        /// <summary>
        /// Verifica se o servidor está acessível
        /// </summary>
        public async Task<bool> IsServerReachableAsync(CancellationToken ct = default)
        {
            try
            {
                var response = await _httpClient.GetAsync($"{_apiBaseUrl}/health", ct);
                return response.IsSuccessStatusCode;
            }
            catch
            {
                return false;
            }
        }
        
        public void Dispose()
        {
            _httpClient.Dispose();
        }
    }
    
    #region Request/Response Models
    
    public class LicenseValidationRequest
    {
        public string LicenseKey { get; set; } = "";
        public string DeviceId { get; set; } = "";
        public string Version { get; set; } = "";
        public string Platform { get; set; } = "";
        public string MachineName { get; set; } = "";
    }
    
    public class LicenseValidationResponse
    {
        public bool Valid { get; set; }
        public string Type { get; set; } = "Trial";
        public int MaxDevices { get; set; } = 1;
        public int DevicesInUse { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public string? ErrorMessage { get; set; }
        public string? ErrorCode { get; set; }
        public bool DeviceRegistered { get; set; }
    }
    
    public class LicenseActivationRequest
    {
        public string LicenseKey { get; set; } = "";
        public string DeviceId { get; set; } = "";
        public string Version { get; set; } = "";
        public string Platform { get; set; } = "";
        public string MachineName { get; set; } = "";
        public string OSVersion { get; set; } = "";
        public int ProcessorCount { get; set; }
    }
    
    public class LicenseActivationResponse
    {
        public bool Success { get; set; }
        public string Type { get; set; } = "Trial";
        public int MaxDevices { get; set; } = 1;
        public int DevicesInUse { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public string? ErrorMessage { get; set; }
        public string? ErrorCode { get; set; }
    }
    
    public class LicenseDeactivationRequest
    {
        public string LicenseKey { get; set; } = "";
        public string DeviceId { get; set; } = "";
    }
    
    public class LicenseDeactivationResponse
    {
        public bool Success { get; set; }
        public string? ErrorMessage { get; set; }
    }
    
    public class LicenseInfoResponse
    {
        public bool Valid { get; set; }
        public string Type { get; set; } = "Trial";
        public int MaxDevices { get; set; } = 1;
        public int DevicesInUse { get; set; }
        public DateTime? ExpiresAt { get; set; }
        public DateTime? ActivatedAt { get; set; }
        public string? CustomerEmail { get; set; }
        public string[] RegisteredDevices { get; set; } = Array.Empty<string>();
    }
    
    #endregion
}

