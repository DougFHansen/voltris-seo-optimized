using System;
using System.Net.Http;
using System.Text.Json;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.Win32;
using VoltrisOptimizer.Services.Enterprise;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Gerenciador de licenças Pro para o Voltris Optimizer
    /// Gerencia ativação, validação e armazenamento seguro de licenças
    /// </summary>
    public class LicenseManager
    {
        private static LicenseManager? _instance;
        private const string RegistryKeyPath = @"Software\Voltris\Optimizer";
        private const string LicenseKeyName = "LicenseKey";
        private const string HardwareIdName = "HardwareId";
        private const string ActivationDateName = "ActivationDate";
        
        // URL da API back-end (deve ser configurável)
        private const string ApiBaseUrl = "https://api.voltris.com";
        
        // Chave secreta agora é gerenciada pelo LicenseSecurityService (ofuscada)
        
        private bool? _isProCached;
        private string? _hardwareIdCache;
        
        /// <summary>
        /// Evento disparado quando o status da licença muda
        /// </summary>
        public event EventHandler? LicenseStatusChanged;

        public static LicenseManager Instance => _instance ??= new LicenseManager();

        private LicenseManager()
        {
        }
        
        /// <summary>
        /// Propriedade estática simples para verificar se o usuário é Pro
        /// Por padrão, é false
        /// </summary>
        public static bool IsPro { get; set; } = false;
        
        /// <summary>
        /// Dias de trial permitidos
        /// </summary>
        public const int TrialDays = TrialProtectionService.TRIAL_DAYS;
        
        /// <summary>
        /// Verifica se o período de trial expirou
        /// Usa o TrialProtectionService para proteção robusta
        /// </summary>
        public bool IsTrialExpired()
        {
            return TrialProtectionService.Instance.IsTrialExpired();
        }
        
        /// <summary>
        /// Retorna quantos dias restam no trial
        /// </summary>
        public int GetTrialDaysRemaining()
        {
            return TrialProtectionService.Instance.GetDaysRemaining();
        }
        
        /// <summary>
        /// Inicializa o trial se for a primeira execução
        /// </summary>
        public void InitializeTrial()
        {
            TrialProtectionService.Instance.InitializeTrial();
        }
        
        /// <summary>
        /// Verifica integridade do trial de forma assíncrona
        /// </summary>
        public async Task<bool> VerifyTrialIntegrityAsync()
        {
            return await TrialProtectionService.Instance.VerifyTrialIntegrityAsync();
        }
        
        /// <summary>
        /// Reseta completamente o período de trial e remove qualquer licença
        /// </summary>
        public void ResetTrial()
        {
            try
            {
                // Resetar flag de Pro
                IsPro = false;
                _isProCached = null;
                
                // Limpar licença do registro
                try
                {
                    using var baseKey = RegistryKey.OpenBaseKey(RegistryHive.CurrentUser, RegistryView.Default);
                    using var key = baseKey.OpenSubKey(RegistryKeyPath, true);
                    if (key != null)
                    {
                        try { key.DeleteValue(LicenseKeyName, false); } catch { }
                        try { key.DeleteValue(ActivationDateName, false); } catch { }
                    }
                }
                catch { }
                
                // Resetar configurações do trial
                var settings = SettingsService.Instance.Settings;
                settings.FirstRunDate = DateTime.Now;
                settings.ForceTrialExpired = false;
                settings.TrialExpired = false;
                SettingsService.Instance.SaveSettings();
                
                // Disparar evento de mudança de status
                LicenseStatusChanged?.Invoke(this, EventArgs.Empty);
            }
            catch { }
        }
        
        /// <summary>
        /// Força o trial como expirado (para testes)
        /// </summary>
        public void ForceExpireTrial()
        {
            try
            {
                // Garantir que IsPro seja false para que o trial possa expirar
                IsPro = false;
                _isProCached = null;
                
                // Limpar licença do registro
                try
                {
                    using var baseKey = RegistryKey.OpenBaseKey(RegistryHive.CurrentUser, RegistryView.Default);
                    using var key = baseKey.OpenSubKey(RegistryKeyPath, true);
                    if (key != null)
                    {
                        try { key.DeleteValue(LicenseKeyName, false); } catch { }
                        try { key.DeleteValue(ActivationDateName, false); } catch { }
                    }
                }
                catch { }
                
                var settings = SettingsService.Instance.Settings;
                settings.ForceTrialExpired = true;
                SettingsService.Instance.SaveSettings();
                
                // Disparar evento de mudança de status
                LicenseStatusChanged?.Invoke(this, EventArgs.Empty);
            }
            catch { }
        }

        /// <summary>
        /// Verifica se a licença atual é válida
        /// </summary>
        public async Task<bool> IsLicenseValidAsync()
        {
            try
            {
                // Verificar se a licença foi revogada remotamente (Corporate Lock)
                if (SettingsService.Instance.Settings.IsLicenseRevoked)
                {
                    return false;
                }

                // Primeiro verificar se há uma licença armazenada
                var storedLicense = GetStoredLicenseKey();
                if (string.IsNullOrEmpty(storedLicense))
                {
                    return false;
                }

                // Parse da licença (formato: VOLTRIS-PLANCODE-ID-VALIDADE-HASH)
                // Exemplo: VOLTRIS-ENT-230697-20271201-90E94D559FBB75FD
                var parts = storedLicense.Split('-');
                if (parts.Length < 5 || parts[0] != "VOLTRIS")
                {
                    return false;
                }

                var planCode = parts[1];
                var clientId = parts[2];
                var validityDateStr = parts[3];
                var signature = parts[4];

                // Verificar se a data de validade está no formato correto
                if (!DateTime.TryParseExact(validityDateStr, "yyyyMMdd", null, System.Globalization.DateTimeStyles.None, out var validityDate))
                {
                    return false;
                }

                // Verificar se a licença expirou
                if (validityDate < DateTime.Today)
                {
                    return false;
                }

                // Resolver detalhes do plano baseado no código
                var (planName, maxDevices) = GetPlanDetails(planCode);

                // Reconstruir o conteúdo da licença EXATAMENTE como no gerador
                // Generator: $"{{\"id\":\"{clientId}\",\"validUntil\":\"{validUntil:yyyy-MM-dd}\",\"plan\":\"{plan}\",\"maxDevices\":{maxDevices}}}"
                var licenseContent = $"{{\"id\":\"{clientId}\",\"validUntil\":\"{validityDate:yyyy-MM-dd}\",\"plan\":\"{planName}\",\"maxDevices\":{maxDevices}}}";
                
                var expectedSignature = GenerateLicenseSignature(licenseContent);

                // Verificar se a assinatura corresponde
                if (signature != expectedSignature)
                {
                    // Tentar fallback para o formato antigo "VOLTRIS-LIC" e "Mensal" se falhar
                    if (planCode == "LIC")
                    {
                        var legacyContent = $"{{\"id\":\"{clientId}\",\"validUntil\":\"{validityDate:yyyy-MM-dd}\",\"plan\":\"Mensal\"}}";
                        if (signature == GenerateLicenseSignature(legacyContent))
                        {
                            return true;
                        }
                    }
                    return false;
                }

                // Se chegou aqui, a licença é válida
                return true;
            }
            catch (Exception ex)
            {
                // Em caso de erro, considerar a licença inválida
                return false;
            }
        }

        private (string plan, int devices) GetPlanDetails(string code)
        {
            return code.ToUpperInvariant() switch
            {
                "TRI" => ("trial", 1),
                "STA" => ("standard", 1),
                "PRO" => ("pro", 3),
                "ENT" => ("enterprise", 9999),
                "LIC" => ("standard", 1), // Default/Fallback
                 _    => ("standard", 1)
            };
        }

        private string? GetStoredLicenseKey()
        {
            try
            {
                using var baseKey = RegistryKey.OpenBaseKey(RegistryHive.CurrentUser, RegistryView.Default);
                using var key = baseKey.OpenSubKey(RegistryKeyPath, false);
                return key?.GetValue(LicenseKeyName)?.ToString();
            }
            catch
            {
                return null;
            }
        }

        public string? GetCurrentLicenseKey()
        {
            return GetStoredLicenseKey();
        }

        /// <summary>
        /// Get device ID/Hardware ID
        /// </summary>
        public string GetDeviceId()
        {
            if (_hardwareIdCache != null)
                return _hardwareIdCache;

            try
            {
                using var baseKey = RegistryKey.OpenBaseKey(RegistryHive.CurrentUser, RegistryView.Default);
                using var key = baseKey.OpenSubKey(RegistryKeyPath, false);
                var storedId = key?.GetValue(HardwareIdName)?.ToString();
                
                if (!string.IsNullOrEmpty(storedId))
                {
                    _hardwareIdCache = storedId;
                    return storedId;
                }
            }
            catch { }

            // Generate new one
            var newId = GenerateUniqueHardwareId();
            _hardwareIdCache = newId;
            return newId;
        }

        private string GenerateUniqueHardwareId()
        {
            // Generate a simple but consistent hardware ID
            var machineName = Environment.MachineName;
            var userName = Environment.UserName;
            var osVersion = Environment.OSVersion.ToString();
            
            var combined = $"{machineName}-{userName}-{osVersion}";
            
            using (var sha256 = System.Security.Cryptography.SHA256.Create())
            {
                var hashBytes = sha256.ComputeHash(System.Text.Encoding.UTF8.GetBytes(combined));
                return BitConverter.ToString(hashBytes).Replace("-", "").Substring(0, 16).ToUpperInvariant();
            }
        }

        /// <summary>
        /// Get comprehensive license information for UI display
        /// </summary>
        public UI.Views.LicenseInfo? GetLicenseInfo()
        {
            try
            {
                var licenseKey = GetStoredLicenseKey();
                
                if (string.IsNullOrEmpty(licenseKey))
                {
                    // Return trial info
                    return new UI.Views.LicenseInfo
                    {
                        LicenseKey = "TRIAL",
                        PlanType = "Trial",
                        ActivationDate = DateTime.Now.AddDays(-1),
                        ExpiryDate = DateTime.Now.AddDays(GetTrialDaysRemaining()),
                        IsLifetime = false,
                        MaxDevices = 1,
                        ActiveDevices = 1,
                        RegisteredTo = Environment.UserName,
                        DeviceId = GetDeviceId(),
                        IsActive = !IsTrialExpired()
                    };
                }

                // Parse license details
                var parts = licenseKey.Split('-');
                var planCode = parts.Length >= 2 ? parts[1] : "STA";
                var planDetails = GetPlanDetails(planCode);
                var activationDate = GetActivationDate();

                // Calculate expiry based on license key date component (index 3: yyyyMMdd)
                DateTime expiryDate;
                bool isLifetime = false;

                if (parts.Length >= 4 && DateTime.TryParseExact(parts[3], "yyyyMMdd", null, System.Globalization.DateTimeStyles.None, out var keyDate))
                {
                    expiryDate = keyDate;
                    if (expiryDate.Year > 2090) isLifetime = true;
                }
                else
                {
                    isLifetime = planDetails.plan.ToLower() == "enterprise";
                    expiryDate = isLifetime ? DateTime.MaxValue : activationDate.AddYears(1);
                }

                return new UI.Views.LicenseInfo
                {
                    LicenseKey = licenseKey,
                    PlanType = CapitalizePlanName(planDetails.plan),
                    ActivationDate = activationDate,
                    ExpiryDate = expiryDate,
                    IsLifetime = isLifetime,
                    MaxDevices = planDetails.devices == 9999 ? int.MaxValue : planDetails.devices,
                    ActiveDevices = 1, // TODO: Get from server
                    RegisteredTo = Environment.UserName,
                    DeviceId = GetDeviceId(),
                    IsActive = true
                };
            }
            catch
            {
                return null;
            }
        }

        private DateTime GetActivationDate()
        {
            try
            {
                using var baseKey = RegistryKey.OpenBaseKey(RegistryHive.CurrentUser, RegistryView.Default);
                using var key = baseKey.OpenSubKey(RegistryKeyPath, false);
                var stored = key?.GetValue(ActivationDateName)?.ToString();
                
                if (!string.IsNullOrEmpty(stored) && DateTime.TryParse(stored, out var date))
                {
                    return date;
                }
            }
            catch { }
            
            return DateTime.Now;
        }

        private string CapitalizePlanName(string plan)
        {
            return plan.ToLower() switch
            {
                "trial" => "Trial",
                "standard" => "Standard",
                "pro" => "Pro",
                "enterprise" => "Enterprise",
                _ => plan
            };
        }

        private int GetMaxDevicesForPlan(string planName)
        {
            return planName.ToLower() switch
            {
                "trial" => 1,
                "standard" => 1,
                "pro" => 3,
                "enterprise" => int.MaxValue,
                _ => 1
            };
        }



        /// <summary>
        /// Gera a assinatura para uma licença usando serviço de segurança ofuscado
        /// </summary>
        private string GenerateLicenseSignature(string content)
        {
            // Usar serviço de segurança com chave ofuscada
            return LicenseSecurityService.GenerateSignature(content);
        }

        /// <summary>
        /// Gera uma licença para um cliente
        /// </summary>
        public string GenerateLicense(string clientId, DateTime validUntil)
        {
            // Nota: Esta função no cliente gera apenas licenças padrão "Mensal"
            // Recomenda-se usar o LicenseGenerator para criar licenças com planos específicos
            try
            {
                // Criar o conteúdo da licença em formato JSON
                var licenseContent = $"{{\"id\":\"{clientId}\",\"validUntil\":\"{validUntil:yyyy-MM-dd}\",\"plan\":\"Mensal\"}}";
                
                // Gerar a assinatura
                var signature = GenerateLicenseSignature(licenseContent);
                
                // Formatar a chave de licença final
                var formattedDate = validUntil.ToString("yyyyMMdd");
                return $"VOLTRIS-LIC-{clientId}-{formattedDate}-{signature}";
            }
            catch (Exception ex)
            {
                throw new Exception($"Erro ao gerar licença: {ex.Message}", ex);
            }
        }

        public class LicenseActivationResult
        {
            public bool Success { get; set; }
            public string Message { get; set; } = string.Empty;
            public string Plan { get; set; } = "Infos";
            public int MaxDevices { get; set; } = 1;
        }

        public async Task<LicenseActivationResult> ActivateLicenseAsync(string licenseKey)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(licenseKey))
                {
                    return new LicenseActivationResult { Success = false, Message = "Chave de licença vazia" };
                }

                // Validar estrutura da licença
                var parts = licenseKey.Trim().ToUpper().Split('-');
                if (parts.Length < 5 || parts[0] != "VOLTRIS")
                {
                    return new LicenseActivationResult { Success = false, Message = "Formato de licença inválido" };
                }
                
                // Tratamento especial para chave de teste
                if (licenseKey == "VOLTRIS-LIC-TESTE-20260113-ABC123DEF456")
                {
                    try
                    {
                        // Persistir chave de teste diretamente
                        using (var baseKey = RegistryKey.OpenBaseKey(RegistryHive.CurrentUser, RegistryView.Default))
                        using (var key = baseKey.CreateSubKey(RegistryKeyPath))
                        {
                            key.SetValue(LicenseKeyName, licenseKey, RegistryValueKind.String);
                            key.SetValue(ActivationDateName, DateTime.UtcNow.ToString("o"), RegistryValueKind.String);
                        }
                        
                        IsPro = true;
                        LicenseStatusChanged?.Invoke(this, EventArgs.Empty);
                        return new LicenseActivationResult { 
                            Success = true, 
                            Message = "Licença de teste ativada",
                            Plan = "pro",
                            MaxDevices = 3
                        };
                    }
                    catch (Exception ex)
                    {
                        return new LicenseActivationResult { Success = false, Message = $"Erro ao ativar licença de teste: {ex.Message}" };
                    }
                }

                var planCode = parts[1];
                var clientId = parts[2];
                var validityDateStr = parts[3];
                var signature = parts[4];

                if (!DateTime.TryParseExact(validityDateStr, "yyyyMMdd", null, System.Globalization.DateTimeStyles.None, out var validityDate))
                {
                    return new LicenseActivationResult { Success = false, Message = "Data de validade inválida" };
                }

                if (validityDate < DateTime.Today)
                {
                    return new LicenseActivationResult { Success = false, Message = "Licença expirada" };
                }

                // Resolver detalhes do plano baseado no código
                var (planName, maxDevices) = GetPlanDetails(planCode);

                // Reconstruir o conteúdo da licença EXATAMENTE como no gerador
                // O gerador cria: $"{{\"id\":\"{clientId}\",\"validUntil\":\"{validUntil:yyyy-MM-dd}\",\"plan\":\"{plan}\",\"maxDevices\":{maxDevices}}}"
                var licenseContent = $"{{\"id\":\"{clientId}\",\"validUntil\":\"{validityDate:yyyy-MM-dd}\",\"plan\":\"{planName}\",\"maxDevices\":{maxDevices}}}";
                
                var expectedSignature = GenerateLicenseSignature(licenseContent);
                
                bool isValid = string.Equals(signature, expectedSignature, StringComparison.Ordinal);

                // Fallback para licenças antigas se falhar
                if (!isValid && planCode == "LIC")
                {
                     var legacyContent = $"{{\"id\":\"{clientId}\",\"validUntil\":\"{validityDate:yyyy-MM-dd}\",\"plan\":\"Mensal\"}}";
                     isValid = string.Equals(signature, GenerateLicenseSignature(legacyContent), StringComparison.Ordinal);
                }

                if (!isValid)
                {
                    return new LicenseActivationResult { Success = false, Message = "Assinatura inválida (código de erro: SIG-MISMATCH)" };
                }

                // Persistir licença no registro
                using (var baseKey = RegistryKey.OpenBaseKey(RegistryHive.CurrentUser, RegistryView.Default))
                using (var key = baseKey.CreateSubKey(RegistryKeyPath))
                {
                    key.SetValue(LicenseKeyName, licenseKey, RegistryValueKind.String);
                    key.SetValue(ActivationDateName, DateTime.UtcNow.ToString("o"), RegistryValueKind.String);
                }

                IsPro = true;
                LicenseStatusChanged?.Invoke(this, EventArgs.Empty);
                
                // Sincronizar com servidor
                try
                {
                    if (EnterpriseService.Instance != null)
                    {
                        await EnterpriseService.Instance.SyncLicenseStatusAsync();
                    }
                }
                catch (Exception syncEx)
                {
                    // Não falhar a ativação se a sincronização falhar
                    System.Diagnostics.Debug.WriteLine($"Erro ao sincronizar licença: {syncEx.Message}");
                }
                
                await Task.CompletedTask;
                return new LicenseActivationResult { 
                    Success = true, 
                    Message = "Licença ativada com sucesso!",
                    Plan = planName,
                    MaxDevices = maxDevices
                };
            }
            catch (Exception ex)
            {
                return new LicenseActivationResult { Success = false, Message = $"Erro na ativação: {ex.Message}" };
            }
        }
    }
}
