using System;
using System.IO;
using System.Net.Http;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Win32;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Serviço de proteção do período de trial
    /// Implementa múltiplas camadas de segurança para evitar manipulação
    /// </summary>
    public class TrialProtectionService
    {
        private static TrialProtectionService? _instance;
        public static TrialProtectionService Instance => _instance ??= new TrialProtectionService();
        
        // Constantes
        public const int TRIAL_DAYS = 7;
        private const string REGISTRY_KEY_PATH = @"SOFTWARE\Voltris\Optimizer";
        private const string TRIAL_START_VALUE = "InstallDate";
        private const string TRIAL_HASH_VALUE = "InstallHash";
        private const string MACHINE_ID_VALUE = "MachineId";
        
        // Caminho do arquivo de trial oculto
        private static readonly string TrialFilePath = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
            "Voltris", ".trial");
        
        // Caminho secundário (backup)
        private static readonly string TrialBackupPath = Path.Combine(
            Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData),
            "Voltris", ".trialdata");
        
        // Chave de ofuscação (gerada a partir do hardware ID)
        private string? _encryptionKey;
        
        private TrialProtectionService()
        {
            _encryptionKey = GenerateMachineKey();
        }
        
        /// <summary>
        /// Inicializa o período de trial
        /// </summary>
        public void InitializeTrial()
        {
            try
            {
                var existingTrial = GetTrialStartDate();
                
                if (existingTrial == null)
                {
                    // Primeira instalação - registrar data de início
                    var startDate = DateTime.UtcNow;
                    SaveTrialData(startDate);
                    
                    App.LoggingService?.LogInfo($"[Trial] Trial iniciado: {startDate:yyyy-MM-dd HH:mm:ss}");
                }
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[Trial] Erro ao inicializar trial", ex);
            }
        }
        
        /// <summary>
        /// Verifica se o trial expirou
        /// </summary>
        public bool IsTrialExpired()
        {
            try
            {
                // Verificar se tem licença Pro
                if (LicenseManager.IsPro)
                    return false;
                
                // Verificar forçar expiração (debug)
                if (SettingsService.Instance.Settings.ForceTrialExpired)
                    return true;
                
                // Obter data de início
                var startDate = GetTrialStartDate();
                
                if (startDate == null)
                {
                    // Se não tem data, inicializar agora
                    InitializeTrial();
                    return false;
                }
                
                // Verificar manipulação de clock
                if (IsClockManipulated(startDate.Value))
                {
                    App.LoggingService?.LogWarning("[Trial] Possível manipulação de clock detectada");
                    return true;
                }
                
                // Calcular dias passados
                var daysPassed = (DateTime.UtcNow - startDate.Value).TotalDays;
                var expired = daysPassed > TRIAL_DAYS;
                
                if (expired)
                {
                    App.LoggingService?.LogInfo($"[Trial] Trial expirado. Dias passados: {daysPassed:F1}");
                }
                
                return expired;
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[Trial] Erro ao verificar trial", ex);
                return false;
            }
        }
        
        /// <summary>
        /// Obtém dias restantes do trial
        /// </summary>
        public int GetDaysRemaining()
        {
            try
            {
                if (LicenseManager.IsPro)
                    return -1; // Licenciado
                
                var startDate = GetTrialStartDate();
                if (startDate == null)
                    return TRIAL_DAYS;
                
                var daysPassed = (DateTime.UtcNow - startDate.Value).TotalDays;
                var remaining = TRIAL_DAYS - (int)Math.Floor(daysPassed);
                
                return Math.Max(0, remaining);
            }
            catch
            {
                return TRIAL_DAYS;
            }
        }
        
        /// <summary>
        /// Obtém a data de início do trial de múltiplas fontes
        /// </summary>
        private DateTime? GetTrialStartDate()
        {
            DateTime? fromRegistry = null;
            DateTime? fromFile = null;
            DateTime? fromBackup = null;
            DateTime? fromSettings = null;
            
            // 1. Tentar do registro
            fromRegistry = GetTrialFromRegistry();
            
            // 2. Tentar do arquivo oculto
            fromFile = GetTrialFromFile(TrialFilePath);
            
            // 3. Tentar do backup
            fromBackup = GetTrialFromFile(TrialBackupPath);
            
            // 4. Tentar das configurações
            fromSettings = SettingsService.Instance.Settings.FirstRunDate;
            
            // Usar a data mais antiga (mais confiável - previne reset)
            DateTime? result = null;
            
            if (fromRegistry.HasValue)
                result = fromRegistry;
            
            if (fromFile.HasValue && (!result.HasValue || fromFile.Value < result.Value))
                result = fromFile;
            
            if (fromBackup.HasValue && (!result.HasValue || fromBackup.Value < result.Value))
                result = fromBackup;
            
            if (fromSettings.HasValue && (!result.HasValue || fromSettings.Value < result.Value))
                result = fromSettings;
            
            // Se encontrou uma data, garantir que está sincronizada em todas as fontes
            if (result.HasValue)
            {
                SyncTrialData(result.Value);
            }
            
            return result;
        }
        
        /// <summary>
        /// Obtém trial do registro do Windows
        /// </summary>
        private DateTime? GetTrialFromRegistry()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(REGISTRY_KEY_PATH);
                if (key == null) return null;
                
                var encryptedDate = key.GetValue(TRIAL_START_VALUE)?.ToString();
                var storedHash = key.GetValue(TRIAL_HASH_VALUE)?.ToString();
                var storedMachineId = key.GetValue(MACHINE_ID_VALUE)?.ToString();
                
                if (string.IsNullOrEmpty(encryptedDate) || string.IsNullOrEmpty(storedHash))
                    return null;
                
                // Verificar machine ID
                var currentMachineId = GetMachineId();
                if (storedMachineId != currentMachineId)
                {
                    App.LoggingService?.LogWarning("[Trial] Machine ID diferente detectado");
                    return null;
                }
                
                // Descriptografar e verificar hash
                var decrypted = Decrypt(encryptedDate);
                var expectedHash = ComputeHash(decrypted + currentMachineId);
                
                if (storedHash != expectedHash)
                {
                    App.LoggingService?.LogWarning("[Trial] Hash de trial inválido no registro");
                    return null;
                }
                
                if (DateTime.TryParse(decrypted, out var date))
                    return date;
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogWarning($"[Trial] Erro ao ler registro: {ex.Message}");
            }
            
            return null;
        }
        
        /// <summary>
        /// Obtém trial de arquivo
        /// </summary>
        private DateTime? GetTrialFromFile(string path)
        {
            try
            {
                if (!File.Exists(path)) return null;
                
                var content = File.ReadAllText(path);
                var data = JsonSerializer.Deserialize<TrialFileData>(Decrypt(content));
                
                if (data == null) return null;
                
                // Verificar machine ID
                if (data.MachineId != GetMachineId())
                {
                    App.LoggingService?.LogWarning("[Trial] Machine ID diferente no arquivo");
                    return null;
                }
                
                // Verificar hash
                var expectedHash = ComputeHash(data.StartDate.ToString("o") + data.MachineId);
                if (data.Hash != expectedHash)
                {
                    App.LoggingService?.LogWarning("[Trial] Hash de trial inválido no arquivo");
                    return null;
                }
                
                return data.StartDate;
            }
            catch
            {
                return null;
            }
        }
        
        /// <summary>
        /// Salva dados do trial em múltiplas localizações
        /// </summary>
        private void SaveTrialData(DateTime startDate)
        {
            var machineId = GetMachineId();
            var hash = ComputeHash(startDate.ToString("o") + machineId);
            
            // 1. Salvar no registro
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(REGISTRY_KEY_PATH);
                key.SetValue(TRIAL_START_VALUE, Encrypt(startDate.ToString("o")));
                key.SetValue(TRIAL_HASH_VALUE, hash);
                key.SetValue(MACHINE_ID_VALUE, machineId);
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogWarning($"[Trial] Erro ao salvar no registro: {ex.Message}");
            }
            
            // 2. Salvar em arquivo oculto
            SaveTrialToFile(TrialFilePath, startDate, machineId, hash);
            
            // 3. Salvar backup
            SaveTrialToFile(TrialBackupPath, startDate, machineId, hash);
            
            // 4. Salvar nas configurações
            SettingsService.Instance.Settings.FirstRunDate = startDate;
            SettingsService.Instance.SaveSettings();
        }
        
        private void SaveTrialToFile(string path, DateTime startDate, string machineId, string hash)
        {
            try
            {
                var dir = Path.GetDirectoryName(path);
                if (!string.IsNullOrEmpty(dir))
                    Directory.CreateDirectory(dir);
                
                var data = new TrialFileData
                {
                    StartDate = startDate,
                    MachineId = machineId,
                    Hash = hash,
                    Version = 1
                };
                
                var json = JsonSerializer.Serialize(data);
                File.WriteAllText(path, Encrypt(json));
                
                // Ocultar arquivo
                File.SetAttributes(path, FileAttributes.Hidden | FileAttributes.System);
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogWarning($"[Trial] Erro ao salvar arquivo {path}: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Sincroniza dados de trial entre todas as fontes
        /// </summary>
        private void SyncTrialData(DateTime startDate)
        {
            var machineId = GetMachineId();
            var hash = ComputeHash(startDate.ToString("o") + machineId);
            
            // Verificar e atualizar registro
            var fromRegistry = GetTrialFromRegistry();
            if (!fromRegistry.HasValue || fromRegistry.Value != startDate)
            {
                try
                {
                    using var key = Registry.CurrentUser.CreateSubKey(REGISTRY_KEY_PATH);
                    key.SetValue(TRIAL_START_VALUE, Encrypt(startDate.ToString("o")));
                    key.SetValue(TRIAL_HASH_VALUE, hash);
                    key.SetValue(MACHINE_ID_VALUE, machineId);
                }
                catch { }
            }
            
            // Verificar e atualizar arquivos
            var fromFile = GetTrialFromFile(TrialFilePath);
            if (!fromFile.HasValue || fromFile.Value != startDate)
            {
                SaveTrialToFile(TrialFilePath, startDate, machineId, hash);
            }
            
            var fromBackup = GetTrialFromFile(TrialBackupPath);
            if (!fromBackup.HasValue || fromBackup.Value != startDate)
            {
                SaveTrialToFile(TrialBackupPath, startDate, machineId, hash);
            }
            
            // Atualizar settings
            if (SettingsService.Instance.Settings.FirstRunDate != startDate)
            {
                SettingsService.Instance.Settings.FirstRunDate = startDate;
                SettingsService.Instance.SaveSettings();
            }
        }
        
        /// <summary>
        /// Detecta manipulação de clock do sistema
        /// </summary>
        private bool IsClockManipulated(DateTime trialStart)
        {
            try
            {
                // Se a data do sistema é anterior à data de início do trial, é suspeito
                if (DateTime.UtcNow < trialStart.AddHours(-1))
                {
                    return true;
                }
                
                // Verificar última data conhecida
                var lastKnownDate = GetLastKnownDate();
                if (lastKnownDate.HasValue && DateTime.UtcNow < lastKnownDate.Value.AddHours(-1))
                {
                    return true;
                }
                
                // Atualizar última data conhecida
                SaveLastKnownDate(DateTime.UtcNow);
                
                return false;
            }
            catch
            {
                return false;
            }
        }
        
        private DateTime? GetLastKnownDate()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(REGISTRY_KEY_PATH);
                var value = key?.GetValue("LastSeen")?.ToString();
                if (!string.IsNullOrEmpty(value) && DateTime.TryParse(Decrypt(value), out var date))
                    return date;
            }
            catch { }
            return null;
        }
        
        private void SaveLastKnownDate(DateTime date)
        {
            try
            {
                using var key = Registry.CurrentUser.CreateSubKey(REGISTRY_KEY_PATH);
                key.SetValue("LastSeen", Encrypt(date.ToString("o")));
            }
            catch { }
        }
        
        /// <summary>
        /// Gera ID único da máquina
        /// </summary>
        private string GetMachineId()
        {
            try
            {
                var sb = new StringBuilder();
                
                // CPU ID
                using (var searcher = new System.Management.ManagementObjectSearcher("SELECT ProcessorId FROM Win32_Processor"))
                {
                    foreach (var obj in searcher.Get())
                    {
                        sb.Append(obj["ProcessorId"]?.ToString() ?? "");
                        break;
                    }
                }
                
                // Motherboard serial
                using (var searcher = new System.Management.ManagementObjectSearcher("SELECT SerialNumber FROM Win32_BaseBoard"))
                {
                    foreach (var obj in searcher.Get())
                    {
                        sb.Append(obj["SerialNumber"]?.ToString() ?? "");
                        break;
                    }
                }
                
                // BIOS serial
                using (var searcher = new System.Management.ManagementObjectSearcher("SELECT SerialNumber FROM Win32_BIOS"))
                {
                    foreach (var obj in searcher.Get())
                    {
                        sb.Append(obj["SerialNumber"]?.ToString() ?? "");
                        break;
                    }
                }
                
                return ComputeHash(sb.ToString()).Substring(0, 16);
            }
            catch
            {
                // Fallback para nome da máquina + usuário
                return ComputeHash(Environment.MachineName + Environment.UserName).Substring(0, 16);
            }
        }
        
        private string GenerateMachineKey()
        {
            var machineId = GetMachineId();
            return ComputeHash("VOLTRIS_KEY_" + machineId).Substring(0, 32);
        }
        
        #region Criptografia
        
        private string Encrypt(string plainText)
        {
            try
            {
                if (string.IsNullOrEmpty(_encryptionKey))
                    _encryptionKey = GenerateMachineKey();
                
                var key = Encoding.UTF8.GetBytes(_encryptionKey);
                var iv = new byte[16];
                Array.Copy(key, iv, 16);
                
                using var aes = Aes.Create();
                aes.Key = key;
                aes.IV = iv;
                
                using var encryptor = aes.CreateEncryptor();
                var plainBytes = Encoding.UTF8.GetBytes(plainText);
                var encryptedBytes = encryptor.TransformFinalBlock(plainBytes, 0, plainBytes.Length);
                
                return Convert.ToBase64String(encryptedBytes);
            }
            catch
            {
                // Fallback: Base64 simples
                return Convert.ToBase64String(Encoding.UTF8.GetBytes(plainText));
            }
        }
        
        private string Decrypt(string cipherText)
        {
            try
            {
                if (string.IsNullOrEmpty(_encryptionKey))
                    _encryptionKey = GenerateMachineKey();
                
                var key = Encoding.UTF8.GetBytes(_encryptionKey);
                var iv = new byte[16];
                Array.Copy(key, iv, 16);
                
                using var aes = Aes.Create();
                aes.Key = key;
                aes.IV = iv;
                
                using var decryptor = aes.CreateDecryptor();
                var cipherBytes = Convert.FromBase64String(cipherText);
                var plainBytes = decryptor.TransformFinalBlock(cipherBytes, 0, cipherBytes.Length);
                
                return Encoding.UTF8.GetString(plainBytes);
            }
            catch
            {
                // Fallback: Base64 simples
                try
                {
                    return Encoding.UTF8.GetString(Convert.FromBase64String(cipherText));
                }
                catch
                {
                    return cipherText;
                }
            }
        }
        
        private string ComputeHash(string input)
        {
            using var sha256 = SHA256.Create();
            var bytes = sha256.ComputeHash(Encoding.UTF8.GetBytes(input));
            return BitConverter.ToString(bytes).Replace("-", "").ToLowerInvariant();
        }
        
        #endregion
        
        /// <summary>
        /// Verifica a integridade do trial de forma assíncrona (pode consultar servidor)
        /// </summary>
        public async Task<bool> VerifyTrialIntegrityAsync()
        {
            try
            {
                // Verificações locais
                var startDate = GetTrialStartDate();
                if (startDate == null)
                    return true; // Primeiro uso
                
                // Verificar manipulação de clock
                if (IsClockManipulated(startDate.Value))
                    return false;
                
                // Tentar verificar hora online (opcional)
                var onlineTime = await GetOnlineTimeAsync();
                if (onlineTime.HasValue)
                {
                    // Se a hora online mostra que o trial expirou, mas o clock local não
                    var onlineDaysPassed = (onlineTime.Value - startDate.Value).TotalDays;
                    if (onlineDaysPassed > TRIAL_DAYS)
                    {
                        App.LoggingService?.LogWarning("[Trial] Verificação online indica trial expirado");
                        return false;
                    }
                }
                
                return true;
            }
            catch
            {
                return true; // Em caso de erro, permitir uso
            }
        }
        
        private async Task<DateTime?> GetOnlineTimeAsync()
        {
            try
            {
                using var client = new HttpClient { Timeout = TimeSpan.FromSeconds(5) };
                var response = await client.GetAsync("http://worldtimeapi.org/api/ip");
                
                if (response.IsSuccessStatusCode)
                {
                    var json = await response.Content.ReadAsStringAsync();
                    var doc = JsonDocument.Parse(json);
                    var dateStr = doc.RootElement.GetProperty("utc_datetime").GetString();
                    if (DateTime.TryParse(dateStr, out var date))
                        return date;
                }
            }
            catch { }
            
            return null;
        }
        
        /// <summary>
        /// Classe para serialização do arquivo de trial
        /// </summary>
        private class TrialFileData
        {
            public DateTime StartDate { get; set; }
            public string MachineId { get; set; } = "";
            public string Hash { get; set; } = "";
            public int Version { get; set; }
        }
    }
}

