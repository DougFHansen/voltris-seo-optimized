using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.Services
{
    public class SettingsService
    {
        private static SettingsService? _instance;
        private const string SettingsFileName = "settings.json";
        private string SettingsPath => Path.Combine(AppDomain.CurrentDomain.BaseDirectory, SettingsFileName);

        // Lock para garantir thread-safety em operações de arquivo
        private static readonly object _settingsLock = new object();

        public static SettingsService Instance => _instance ??= new SettingsService();

        public AppSettings Settings { get; private set; }
        
        // Evento para notificar mudanças de perfil
        public event EventHandler<IntelligentProfileType>? ProfileChanged;

        private SettingsService()
        {
            Settings = new AppSettings();
            LoadSettings();
        }

        public void LoadSettings()
        {
            lock (_settingsLock)
            {
                try
                {
                    App.LoggingService?.LogInfo("[SETTINGS] Iniciando LoadSettings()");
                    
                    if (File.Exists(SettingsPath))
                    {
                        App.LoggingService?.LogInfo("[SETTINGS] Arquivo settings.json encontrado");
                        var json = File.ReadAllText(SettingsPath);
                        Settings = JsonSerializer.Deserialize<AppSettings>(json) ?? new AppSettings();
                        
                        App.LoggingService?.LogInfo($"[SETTINGS] Valores carregados:");
                        App.LoggingService?.LogInfo($"[SETTINGS]   IsFirstRun: {Settings.IsFirstRun}");
                        App.LoggingService?.LogInfo($"[SETTINGS]   IsDeviceLinked: {Settings.IsDeviceLinked}");
                        App.LoggingService?.LogInfo($"[SETTINGS]   LinkedUserEmail: '{Settings.LinkedUserEmail}'");
                        App.LoggingService?.LogInfo($"[SETTINGS]   OnboardingCompleted: {Settings.OnboardingCompleted}");
                        
                        // Migração: Garantir que DLS e DPC Watchdog venham ativados por padrão
                        var needsSave = false;
                        
                        if (!Settings.EnableDynamicLoadStabilizer)
                        {
                            Settings.EnableDynamicLoadStabilizer = true;
                            needsSave = true;
                        }

                        // Garantir que AutoGamerMode seja true por padrão
                        try
                        {
                            using var doc = JsonDocument.Parse(json);
                            if (!doc.RootElement.TryGetProperty("AutoGamerMode", out _) || !Settings.AutoGamerMode)
                            {
                                Settings.AutoGamerMode = true;
                                needsSave = true;
                            }
                            if (!doc.RootElement.TryGetProperty("HasGamerModeConfigured", out _))
                            {
                                Settings.HasGamerModeConfigured = false;
                                needsSave = true;
                            }
                        }
                        catch { }

                        // Verificar AllowBackgroundDpcWatchdog
                        try
                        {
                            var jsonDoc = JsonDocument.Parse(json);
                            if (!jsonDoc.RootElement.TryGetProperty("AllowBackgroundDpcWatchdog", out _))
                            {
                                Settings.AllowBackgroundDpcWatchdog = true;
                                needsSave = true;
                            }
                            else if (!Settings.AllowBackgroundDpcWatchdog)
                            {
                                Settings.AllowBackgroundDpcWatchdog = true;
                                needsSave = true;
                            }
                        }
                        catch
                        {
                            Settings.AllowBackgroundDpcWatchdog = true;
                            needsSave = true;
                        }
                        
                        // IntelligentProfile padrão
                        try
                        {
                            using var doc = JsonDocument.Parse(json);
                            if (!doc.RootElement.TryGetProperty("IntelligentProfile", out _))
                            {
                                Settings.IntelligentProfile = IntelligentProfileType.GeneralBalanced;
                                needsSave = true;
                            }
                        }
                        catch { }

                        if (needsSave)
                        {
                            // Chamada interna segura (já estamos no lock, mas SaveSettings tem lock, então cuidado com reentrância se não usar Monitor)
                            // Como lock suporta reentrância na mesma thread, ok chamar SaveSettings aqui.
                            SaveSettingsInternal(); 
                        }
                    }
                    else
                    {
                        Settings = new AppSettings();
                        Settings.IntelligentProfile = IntelligentProfileType.GeneralBalanced;
                        Settings.StartWithWindows = true;
                        Settings.StartMinimized = true;
                        Settings.EnableDynamicLoadStabilizer = true;
                        Settings.AllowBackgroundDpcWatchdog = true;
                        Settings.AutoGamerMode = true;
                    }
                }
                catch
                {
                    Settings = new AppSettings();
                    Settings.StartWithWindows = true;
                    Settings.StartMinimized = true;
                    Settings.EnableDynamicLoadStabilizer = true;
                    Settings.AllowBackgroundDpcWatchdog = true;
                }
            }
        }

        public void SaveSettings()
        {
            lock (_settingsLock)
            {
                SaveSettingsInternal();
            }
        }

        private void SaveSettingsInternal()
        {
            App.LoggingService?.LogInfo("[SETTINGS] Iniciando SaveSettings()");
            App.LoggingService?.LogInfo($"[SETTINGS] Valores a salvar:");
            App.LoggingService?.LogInfo($"[SETTINGS]   IsFirstRun: {Settings.IsFirstRun}");
            App.LoggingService?.LogInfo($"[SETTINGS]   IsDeviceLinked: {Settings.IsDeviceLinked}");
            App.LoggingService?.LogInfo($"[SETTINGS]   LinkedUserEmail: '{Settings.LinkedUserEmail}'");
            App.LoggingService?.LogInfo($"[SETTINGS]   OnboardingCompleted: {Settings.OnboardingCompleted}");
            
            const int maxRetries = 3;
            int retryCount = 0;
            Exception? lastException = null;

            while (retryCount < maxRetries)
            {
                try
                {
                    if (Settings == null) throw new InvalidOperationException("Settings object is null");

                    var json = JsonSerializer.Serialize(Settings, new JsonSerializerOptions { WriteIndented = true });
                    
                    if (string.IsNullOrWhiteSpace(json)) throw new InvalidOperationException("Generated JSON is empty");

                    // Backup seguro
                    if (File.Exists(SettingsPath))
                    {
                        var backupPath = SettingsPath + ".bak";
                        File.Copy(SettingsPath, backupPath, true);
                    }

                    // Escrita atômica via arquivo temporário
                    var tempPath = SettingsPath + ".tmp";
                    File.WriteAllText(tempPath, json);
                    
                    if (!File.Exists(tempPath)) throw new IOException("Failed to write temporary settings file");

                    File.Move(tempPath, SettingsPath, true);
                    
                    if (!File.Exists(SettingsPath)) throw new IOException("Settings file was not created successfully");

                    CreateBackupInternal();
                    
                    return;
                }
                catch (Exception ex)
                {
                    lastException = ex;
                    retryCount++;
                    
                    try
                    {
                        var logPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs", "settings_errors.log");
                        var logDir = Path.GetDirectoryName(logPath);
                        if (!string.IsNullOrEmpty(logDir) && !Directory.Exists(logDir)) Directory.CreateDirectory(logDir);
                        File.AppendAllText(logPath, $"[{DateTime.Now:yyyy-MM-dd HH:mm:ss}] Attempt {retryCount}/{maxRetries} failed: {ex.Message}\n");
                    }
                    catch { }

                    if (retryCount < maxRetries) System.Threading.Thread.Sleep(100 * retryCount);
                }
            }

            if (lastException != null)
            {
                // Restaurar backup em caso de falha catastrófica
                try
                {
                    var backupPath = SettingsPath + ".bak";
                    if (File.Exists(backupPath)) File.Copy(backupPath, SettingsPath, true);
                }
                catch { }

                var telemetry = App.Services?.GetService(typeof(VoltrisOptimizer.Services.Telemetry.TelemetryService)) as VoltrisOptimizer.Services.Telemetry.TelemetryService;
                _ = telemetry?.TrackExceptionAsync(lastException, "SaveSettings Failed After Retries");
                
                throw new IOException($"Failed to save settings after {maxRetries} attempts", lastException);
            }
        }

        public void CreateBackup()
        {
            lock (_settingsLock)
            {
                CreateBackupInternal();
            }
        }

        private void CreateBackupInternal()
        {
            try
            {
                var backupDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Backups");
                if (!Directory.Exists(backupDir)) Directory.CreateDirectory(backupDir);

                var backupPath = Path.Combine(backupDir, $"settings_backup_{DateTime.Now:yyyy-MM-dd_HH-mm-ss}.json");
                File.Copy(SettingsPath, backupPath, true);

                var backups = Directory.GetFiles(backupDir, "settings_backup_*.json")
                    .OrderByDescending(f => File.GetCreationTime(f))
                    .Skip(10)
                    .ToList();

                foreach (var oldBackup in backups)
                {
                    try { File.Delete(oldBackup); } catch { }
                }
            }
            catch { }
        }

        public bool RestoreBackup(string backupPath)
        {
            lock (_settingsLock)
            {
                try
                {
                    if (File.Exists(backupPath))
                    {
                        File.Copy(backupPath, SettingsPath, true);
                        if (File.Exists(SettingsPath))
                        {
                            var json = File.ReadAllText(SettingsPath);
                            Settings = JsonSerializer.Deserialize<AppSettings>(json) ?? new AppSettings();
                        }
                        return true;
                    }
                }
                catch { }
                return false;
            }
        }

        public List<string> GetAvailableBackups()
        {
            try
            {
                var backupDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Backups");
                if (Directory.Exists(backupDir))
                {
                    return Directory.GetFiles(backupDir, "settings_backup_*.json")
                        .OrderByDescending(f => File.GetCreationTime(f))
                        .ToList();
                }
            }
            catch { }
            return new List<string>();
        }
        
        /// <summary>
        /// Notifica listeners sobre mudança de perfil inteligente
        /// </summary>
        public void NotifyProfileChanged(IntelligentProfileType newProfile)
        {
            ProfileChanged?.Invoke(this, newProfile);
            App.LoggingService?.LogInfo($"[SETTINGS] Perfil alterado para: {newProfile}");
        }
    }

    public enum IntelligentProfileType
    {
        GamerCompetitive,      // Gamer Competitivo
        GamerSinglePlayer,     // Gamer SinglePlayer
        WorkOffice,           // Empresarial Escritório
        CreativeVideoEditing, // Edição de Vídeo / Design
        DeveloperProgramming, // Desenvolvimento / Programação
        GeneralBalanced,      // Uso Geral Balanceado
        EnterpriseSecure      // Enterprise Seguro (Corporativo)
    }

    public class AppSettings
    {
        // Geral
        public Language Language { get; set; } = Language.Portuguese;
        public string Theme { get; set; } = "Dark";
        public IntelligentProfileType IntelligentProfile { get; set; } = IntelligentProfileType.GeneralBalanced;
        public bool StartWithWindows { get; set; } = true;
        public bool StartMinimized { get; set; } = true;
        public bool EnableTransparency { get; set; } = true;
        public bool MinimizeToTray { get; set; } = true;
        public bool CloseToTray { get; set; } = true;
        public bool VoiceControlEnabled { get; set; } = false;
        public string OpenAIApiKey { get; set; } = "";
        
        // Onboarding
        public bool IsFirstRun { get; set; } = true;
        public bool OnboardingCompleted { get; set; } = false;
        
        // Trial de 15 dias
        public DateTime? FirstRunDate { get; set; } = null;
        public bool LicensePageShown { get; set; } = false;
        public bool TrialExpired { get; set; } = false;
        
        // Para testes (DEBUG)
        public bool ForceTrialExpired { get; set; } = false;
        public bool ForcePurchaseModal { get; set; } = false;
        
        // License API
        public string LicenseApiUrl { get; set; } = "https://api.voltris.com/v1/license";
        public string? LicenseKey { get; set; }
        public string? LicenseType { get; set; }
        public DateTime? LicenseExpiresAt { get; set; }
        
        // Empresa / Telemetria
        public bool UseLocalApi { get; set; } = false; // Forçar produção por padrão
        public string? InstallationId { get; set; }
        public bool WelcomePromptShown { get; set; }
        public string? LinkedUserEmail { get; set; }
        public bool IsDeviceLinked { get; set; } = false;
        public bool IsLicenseRevoked { get; set; } = false;
        
        // CORREÇÃO ENTERPRISE: Telemetria opt-out
        public bool TelemetryEnabled { get; set; } = true; // Opt-out por padrão (GDPR compliant)
        
        // ============================================
        // Página Personalizar (PersonalizeView)
        // ============================================
        public bool TaskbarCenteringEnabled { get; set; } = false;
        public bool TaskbarStyleEnabled { get; set; } = false;
        public int TaskbarStyleIndex { get; set; } = 0;
        public int TaskbarOpacity { get; set; } = 255;

        // VoltrisBlur (Explorer effect)
        public bool VoltrisBlurInstalled { get; set; } = false;
        public int VoltrisBlurEffectIndex { get; set; } = 1;   // 1=Acrylic default
        public bool VoltrisBlurClearAddress { get; set; } = true;
        public bool VoltrisBlurClearBarBg { get; set; } = true;
        public bool VoltrisBlurClearWinUIBg { get; set; } = true;
        public bool VoltrisBlurShowLine { get; set; } = false;
        public int VoltrisBlurAlpha { get; set; } = 120;
        public int VoltrisBlurColorR { get; set; } = 0;
        public int VoltrisBlurColorG { get; set; } = 0;
        public int VoltrisBlurColorB { get; set; } = 0;

        // Cursor Personalizado
        public string SelectedCursorTheme { get; set; } = string.Empty; // "" = padrão do Windows

        // ============================================
        // Página de Limpeza (CleanupView)
        // ============================================
        public bool CleanCache { get; set; } = true;
        public bool CleanTemp { get; set; } = true;
        public bool CleanRecycle { get; set; } = true;
        public bool CleanThumbnails { get; set; } = true;
        public bool CleanBrowsers { get; set; } = true;
        public bool CleanLogs { get; set; } = false;
        public bool CleanPrefetch { get; set; } = false;
        public bool CleanWindowsUpdate { get; set; } = false;
        
        // ============================================
        // Página de Desempenho (PerformanceView)
        // ============================================
        public bool OptimizeStartup { get; set; } = true;
        public bool OptimizeServices { get; set; } = true;
        public bool OptimizeVisualEffects { get; set; } = true;
        public bool OptimizePower { get; set; } = true;
        public bool OptimizeMemory { get; set; } = true;
        public bool OptimizeDisk { get; set; } = true;
        
        // ============================================
        // Página de Rede (NetworkView)
        // ============================================
        public bool OptimizeDns { get; set; } = true;
        public bool OptimizeTcp { get; set; } = true;
        public bool OptimizeWinsock { get; set; } = true;
        public bool OptimizeNetworkAdapter { get; set; } = true;
        
        // ============================================
        // Página de Sistema (SystemView)
        // ============================================
        public bool OptimizeRegistry { get; set; } = false;
        public bool OptimizeTelemetry { get; set; } = true;
        public bool OptimizePrivacy { get; set; } = true;
        public bool OptimizeDefender { get; set; } = false;
        public bool OptimizeIndexing { get; set; } = true;
        public bool OptimizeSuperfetch { get; set; } = false;
        
        // ============================================
        // Página Gamer (GamerView)
        // ============================================
        public bool AutoGamerMode { get; set; } = true; // Ativado por padrão
        public bool HasGamerModeConfigured { get; set; } = false; // Novo: Indica se o usuário já definiu a preferência
        public bool GamerOptimizeCpu { get; set; } = true;
        public bool GamerOptimizeGpu { get; set; } = true;
        public bool GamerOptimizeRam { get; set; } = true;
        public bool GamerOptimizeNetwork { get; set; } = true;
        public bool GamerCloseBackground { get; set; } = true;
        public bool GamerDisableEffects { get; set; } = true;

        // Otimizações Avançadas
        public bool EnableDynamicLoadStabilizer { get; set; } = true; // Ativado por padrão
        public List<string> DlsWhitelist { get; set; } = new List<string>();
        public List<string> DlsBlacklist { get; set; } = new List<string>();
        public string? DlsManualGameProcess { get; set; }
        
        // DPC Watchdog
        public bool AllowBackgroundDpcWatchdog { get; set; } = true; // Ativado por padrão
        
        // ============================================
        // Notificações do Sistema
        // ============================================
        public bool NotificationsEnabled { get; set; } = true;
        public bool NotifyOnThreatDetected { get; set; } = true;
        public bool NotifyOnScanComplete { get; set; } = true;
        public bool NotifyOnNewDevice { get; set; } = true;
        
        // Context Menu
        public bool EnableDesktopContextMenu { get; set; } = true;
    }
}
