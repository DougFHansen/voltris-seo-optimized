using System;
using System.Net.Http;
using System.Text.Json;
using System.Security.Cryptography;
using System.Threading.Tasks;
using Microsoft.Win32;

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
                // Primeiro verificar se há uma licença armazenada
                var storedLicense = GetStoredLicenseKey();
                if (string.IsNullOrEmpty(storedLicense))
                {
                    return false;
                }

                // Parse da licença (formato: VOLTRIS-LIC-ID-VALIDADE-HASH)
                var parts = storedLicense.Split('-');
                if (parts.Length < 5 || parts[0] != "VOLTRIS" || parts[1] != "LIC")
                {
                    return false;
                }

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

                // Reconstruir o conteúdo da licença para verificar a assinatura
                var licenseContent = $"{{\"id\":\"{clientId}\",\"validUntil\":\"{validityDate:yyyy-MM-dd}\",\"plan\":\"Mensal\"}}";
                var expectedSignature = GenerateLicenseSignature(licenseContent);

                // Verificar se a assinatura corresponde
                if (signature != expectedSignature)
                {
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
                if (parts.Length < 5 || parts[0] != "VOLTRIS" || parts[1] != "LIC")
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
                        return new LicenseActivationResult { Success = true, Message = "Licença de teste ativada" };
                    }
                    catch (Exception ex)
                    {
                        return new LicenseActivationResult { Success = false, Message = $"Erro ao ativar licença de teste: {ex.Message}" };
                    }
                }

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

                var licenseContent = $"{{\"id\":\"{clientId}\",\"validUntil\":\"{validityDate:yyyy-MM-dd}\",\"plan\":\"Mensal\"}}";
                var expectedSignature = GenerateLicenseSignature(licenseContent);
                if (!string.Equals(signature, expectedSignature, StringComparison.Ordinal))
                {
                    return new LicenseActivationResult { Success = false, Message = "Assinatura inválida" };
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
                await Task.CompletedTask;
                return new LicenseActivationResult { Success = true, Message = "Licença ativada" };
            }
            catch (Exception ex)
            {
                return new LicenseActivationResult { Success = false, Message = ex.Message };
            }
        }
    }
}
