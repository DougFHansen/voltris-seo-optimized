using System;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using System.Security.Cryptography;

namespace VoltrisOptimizer.Services.Licensing
{
    /// <summary>
    /// Validador de licença server-side para prevenir pirataria
    /// CORREÇÃO ENTERPRISE: Anti-pirataria robusto
    /// </summary>
    public class ServerSideLicenseValidator
    {
        private readonly HttpClient _httpClient;
        private readonly ILoggingService _logger;
        private readonly string _apiEndpoint;
        private DateTime _lastValidation = DateTime.MinValue;
        private bool _lastValidationResult = false;
        
        private const int ValidationIntervalHours = 24; // Revalidar a cada 24h
        private const int ValidationTimeoutSeconds = 10;
        
        public ServerSideLicenseValidator(ILoggingService logger, string apiEndpoint = "https://voltris.com.br/api/license")
        {
            _logger = logger;
            _apiEndpoint = apiEndpoint;
            _httpClient = new HttpClient
            {
                Timeout = TimeSpan.FromSeconds(ValidationTimeoutSeconds)
            };
        }
        
        /// <summary>
        /// Valida licença no servidor
        /// </summary>
        public async Task<LicenseValidationResult> ValidateAsync(string licenseKey, bool forceRevalidation = false)
        {
            try
            {
                // Verificar se precisa revalidar
                if (!forceRevalidation && _lastValidation != DateTime.MinValue)
                {
                    var elapsed = DateTime.UtcNow - _lastValidation;
                    if (elapsed.TotalHours < ValidationIntervalHours)
                    {
                        _logger.LogInfo("[License] Usando validação em cache");
                        return new LicenseValidationResult
                        {
                            IsValid = _lastValidationResult,
                            Message = "Validação em cache",
                            CachedResult = true
                        };
                    }
                }
                
                _logger.LogInfo("[License] Validando licença no servidor...");
                
                // Preparar payload
                var payload = new
                {
                    license_key = licenseKey,
                    machine_id = GetMachineId(),
                    app_version = GetAppVersion(),
                    timestamp = DateTime.UtcNow.ToString("o")
                };
                
                var json = JsonSerializer.Serialize(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                
                // Enviar requisição
                var response = await _httpClient.PostAsync($"{_apiEndpoint}/validate", content);
                
                if (!response.IsSuccessStatusCode)
                {
                    _logger.LogWarning($"[License] Servidor retornou erro: {response.StatusCode}");
                    
                    // Fallback: Se servidor offline, usar última validação conhecida
                    if (_lastValidation != DateTime.MinValue)
                    {
                        _logger.LogWarning("[License] Servidor offline - usando última validação conhecida");
                        return new LicenseValidationResult
                        {
                            IsValid = _lastValidationResult,
                            Message = "Servidor offline - validação offline",
                            ServerOffline = true
                        };
                    }
                    
                    return new LicenseValidationResult
                    {
                        IsValid = false,
                        Message = "Falha na comunicação com servidor"
                    };
                }
                
                // Parse resposta
                var responseJson = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<ServerValidationResponse>(responseJson);
                
                if (result == null)
                {
                    return new LicenseValidationResult
                    {
                        IsValid = false,
                        Message = "Resposta inválida do servidor"
                    };
                }
                
                // Atualizar cache
                _lastValidation = DateTime.UtcNow;
                _lastValidationResult = result.IsValid;
                
                _logger.LogInfo($"[License] Validação concluída: {(result.IsValid ? "VÁLIDA" : "INVÁLIDA")}");
                
                return new LicenseValidationResult
                {
                    IsValid = result.IsValid,
                    Message = result.Message ?? "",
                    ExpirationDate = result.ExpirationDate,
                    PlanType = result.PlanType ?? "Unknown",
                    MaxDevices = result.MaxDevices,
                    CurrentDevices = result.CurrentDevices
                };
            }
            catch (TaskCanceledException)
            {
                _logger.LogWarning("[License] Timeout na validação");
                
                // Fallback em caso de timeout
                if (_lastValidation != DateTime.MinValue)
                {
                    return new LicenseValidationResult
                    {
                        IsValid = _lastValidationResult,
                        Message = "Timeout - usando validação offline",
                        ServerOffline = true
                    };
                }
                
                return new LicenseValidationResult
                {
                    IsValid = false,
                    Message = "Timeout na validação"
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"[License] Erro na validação: {ex.Message}", ex);
                
                // Fallback em caso de erro
                if (_lastValidation != DateTime.MinValue)
                {
                    return new LicenseValidationResult
                    {
                        IsValid = _lastValidationResult,
                        Message = "Erro - usando validação offline",
                        ServerOffline = true
                    };
                }
                
                return new LicenseValidationResult
                {
                    IsValid = false,
                    Message = $"Erro: {ex.Message}"
                };
            }
        }
        
        /// <summary>
        /// Ativa licença no servidor
        /// </summary>
        public async Task<LicenseActivationResult> ActivateAsync(string licenseKey)
        {
            try
            {
                _logger.LogInfo("[License] Ativando licença no servidor...");
                
                var payload = new
                {
                    license_key = licenseKey,
                    machine_id = GetMachineId(),
                    machine_name = Environment.MachineName,
                    os_version = Environment.OSVersion.ToString(),
                    app_version = GetAppVersion()
                };
                
                var json = JsonSerializer.Serialize(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                
                var response = await _httpClient.PostAsync($"{_apiEndpoint}/activate", content);
                var responseJson = await response.Content.ReadAsStringAsync();
                
                if (!response.IsSuccessStatusCode)
                {
                    var error = JsonSerializer.Deserialize<ServerErrorResponse>(responseJson);
                    return new LicenseActivationResult
                    {
                        Success = false,
                        Message = error?.Message ?? "Erro desconhecido"
                    };
                }
                
                var result = JsonSerializer.Deserialize<ServerActivationResponse>(responseJson);
                
                if (result == null)
                {
                    return new LicenseActivationResult
                    {
                        Success = false,
                        Message = "Resposta inválida do servidor"
                    };
                }
                
                _logger.LogSuccess("[License] Licença ativada com sucesso");
                
                return new LicenseActivationResult
                {
                    Success = result.Success,
                    Message = result.Message ?? "",
                    ActivationToken = result.ActivationToken
                };
            }
            catch (Exception ex)
            {
                _logger.LogError($"[License] Erro na ativação: {ex.Message}", ex);
                return new LicenseActivationResult
                {
                    Success = false,
                    Message = $"Erro: {ex.Message}"
                };
            }
        }
        
        /// <summary>
        /// Desativa licença no servidor
        /// </summary>
        public async Task<bool> DeactivateAsync(string licenseKey)
        {
            try
            {
                _logger.LogInfo("[License] Desativando licença no servidor...");
                
                var payload = new
                {
                    license_key = licenseKey,
                    machine_id = GetMachineId()
                };
                
                var json = JsonSerializer.Serialize(payload);
                var content = new StringContent(json, Encoding.UTF8, "application/json");
                
                var response = await _httpClient.PostAsync($"{_apiEndpoint}/deactivate", content);
                
                if (response.IsSuccessStatusCode)
                {
                    _logger.LogSuccess("[License] Licença desativada com sucesso");
                    return true;
                }
                
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[License] Erro na desativação: {ex.Message}", ex);
                return false;
            }
        }
        
        private string GetMachineId()
        {
            try
            {
                // Gerar ID único baseado em hardware
                var machineInfo = $"{Environment.MachineName}_{Environment.UserName}_{Environment.ProcessorCount}";
                
                using var sha256 = SHA256.Create();
                var hash = sha256.ComputeHash(Encoding.UTF8.GetBytes(machineInfo));
                return Convert.ToBase64String(hash);
            }
            catch
            {
                return "unknown";
            }
        }
        
        private string GetAppVersion()
        {
            try
            {
                var assembly = System.Reflection.Assembly.GetExecutingAssembly();
                var version = assembly.GetName().Version;
                return version?.ToString() ?? "unknown";
            }
            catch
            {
                return "unknown";
            }
        }
    }
    
    #region Response Models
    
    public class LicenseValidationResult
    {
        public bool IsValid { get; set; }
        public string Message { get; set; } = "";
        public DateTime? ExpirationDate { get; set; }
        public string PlanType { get; set; } = "";
        public int MaxDevices { get; set; }
        public int CurrentDevices { get; set; }
        public bool CachedResult { get; set; }
        public bool ServerOffline { get; set; }
    }
    
    public class LicenseActivationResult
    {
        public bool Success { get; set; }
        public string Message { get; set; } = "";
        public string? ActivationToken { get; set; }
    }
    
    internal class ServerValidationResponse
    {
        public bool IsValid { get; set; }
        public string? Message { get; set; }
        public DateTime? ExpirationDate { get; set; }
        public string? PlanType { get; set; }
        public int MaxDevices { get; set; }
        public int CurrentDevices { get; set; }
    }
    
    internal class ServerActivationResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public string? ActivationToken { get; set; }
    }
    
    internal class ServerErrorResponse
    {
        public string? Message { get; set; }
    }
    
    #endregion
}
