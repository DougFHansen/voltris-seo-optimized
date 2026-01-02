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

        public static SettingsService Instance => _instance ??= new SettingsService();

        public AppSettings Settings { get; private set; }

        private SettingsService()
        {
            Settings = new AppSettings();
            LoadSettings();
        }

        public void LoadSettings()
        {
            try
            {
                if (File.Exists(SettingsPath))
                {
                    var json = File.ReadAllText(SettingsPath);
                    Settings = JsonSerializer.Deserialize<AppSettings>(json) ?? new AppSettings();
                    
                    // Migração: Garantir que DLS e DPC Watchdog venham ativados por padrão
                    // Se não existirem no JSON ou estiverem como false, atualizar para true
                    var needsSave = false;
                    if (!Settings.EnableDynamicLoadStabilizer)
                    {
                        Settings.EnableDynamicLoadStabilizer = true;
                        needsSave = true;
                    }
                    
                    // Verificar se AllowBackgroundDpcWatchdog existe (propriedade pode não existir em versões antigas)
                    try
                    {
                        var jsonDoc = System.Text.Json.JsonDocument.Parse(json);
                        if (!jsonDoc.RootElement.TryGetProperty("AllowBackgroundDpcWatchdog", out _))
                        {
                            // Propriedade não existe, usar padrão true
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
                        // Se falhar ao parsear, garantir que a propriedade seja true
                        Settings.AllowBackgroundDpcWatchdog = true;
                        needsSave = true;
                    }
                    
                    if (needsSave)
                    {
                        SaveSettings();
                    }
                }
                else
                {
                    Settings = new AppSettings();
                }
            }
            catch
            {
                Settings = new AppSettings();
            }
        }

        public void SaveSettings()
        {
            try
            {
                var json = JsonSerializer.Serialize(Settings, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(SettingsPath, json);
                
                // Backup automático
                CreateBackup();
            }
            catch
            {
                // Ignorar erros de salvamento
            }
        }

        public void CreateBackup()
        {
            try
            {
                var backupDir = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Backups");
                if (!Directory.Exists(backupDir))
                {
                    Directory.CreateDirectory(backupDir);
                }

                var backupPath = Path.Combine(backupDir, $"settings_backup_{DateTime.Now:yyyy-MM-dd_HH-mm-ss}.json");
                File.Copy(SettingsPath, backupPath, true);

                // Manter apenas os últimos 10 backups
                var backups = Directory.GetFiles(backupDir, "settings_backup_*.json")
                    .OrderByDescending(f => File.GetCreationTime(f))
                    .Skip(10)
                    .ToList();

                foreach (var oldBackup in backups)
                {
                    try { File.Delete(oldBackup); } catch { }
                }
            }
            catch
            {
                // Ignorar erros de backup
            }
        }

        public bool RestoreBackup(string backupPath)
        {
            try
            {
                if (File.Exists(backupPath))
                {
                    File.Copy(backupPath, SettingsPath, true);
                    LoadSettings();
                    return true;
                }
            }
            catch { }
            return false;
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
    }

    public class AppSettings
    {
        // Geral
        public Language Language { get; set; } = Language.Portuguese;
        public string Theme { get; set; } = "Dark";
        public bool StartWithWindows { get; set; } = true;
        public bool StartMinimized { get; set; } = false;
        public bool MinimizeToTray { get; set; } = true;
        public bool CloseToTray { get; set; } = true;
        public bool VoiceControlEnabled { get; set; } = false;
        public string OpenAIApiKey { get; set; } = "";
        
        // Onboarding
        public bool IsFirstRun { get; set; } = true;
        public bool OnboardingCompleted { get; set; } = false;
        
        // Trial de 7 dias
        public DateTime? FirstRunDate { get; set; } = null;
        public bool TrialExpired { get; set; } = false;
        
        // Para testes (DEBUG)
        public bool ForceTrialExpired { get; set; } = false;
        public bool ForcePurchaseModal { get; set; } = false;
        
        // License API
        public string LicenseApiUrl { get; set; } = "https://api.voltris.com/v1/license";
        public string? LicenseKey { get; set; }
        public string? LicenseType { get; set; }
        public DateTime? LicenseExpiresAt { get; set; }
        
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
    }
}

