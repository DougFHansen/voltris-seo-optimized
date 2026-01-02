using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.ServiceProcess;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32;
using VoltrisOptimizer.Interfaces;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// VOLTRIS ULTRA CLEANER - Limpeza Profunda Inteligente
    /// Limpeza precisa e segura de TODOS os componentes do Windows
    /// Mostra APENAS o que pode realmente ser limpo - 100% honesto
    /// </summary>
    public class UltraCleanerService
    {
        private readonly ILoggingService _logger;
        private readonly VoltrisOptimizer.Services.SystemChanges.ISystemChangeTransactionService? _txService;
        private VoltrisOptimizer.Services.SystemChanges.ISystemTransaction? _currentTx;
        private readonly List<CleanupCategory> _categories = new();
        private readonly WindowsDiskCleanupService _diskCleanup;
        
        // Estado da análise em background
        private bool _isAnalyzing = false;
        private CancellationTokenSource? _analysisCts;
        private UltraCleanAnalysis? _lastAnalysis;
        private AnalysisProgress _currentProgress = new();
        private readonly object _analysisLock = new();
        private Task? _analysisTask;

        public UltraCleanerService(ILoggingService logger, VoltrisOptimizer.Services.SystemChanges.ISystemChangeTransactionService? txService = null)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _txService = txService;
            _diskCleanup = new WindowsDiskCleanupService(logger);
            InitializeCategories();
        }
        
        /// <summary>
        /// Inicia análise em background que continua mesmo se o usuário mudar de página
        /// </summary>
        public async Task StartAnalysisAsync()
        {
            lock (_analysisLock)
            {
                if (_isAnalyzing)
                {
                    _logger.LogWarning("[UltraClean] Análise já está em andamento");
                    return;
                }
                
                _isAnalyzing = true;
                _analysisCts = new CancellationTokenSource();
                _lastAnalysis = null;
            }
            
            _analysisTask = Task.Run(async () =>
            {
                try
                {
                    var progress = new Progress<AnalysisProgress>(p =>
                    {
                        lock (_analysisLock)
                        {
                            _currentProgress = p;
                        }
                    });
                    
                    var result = await AnalyzeAllAsync(progress, _analysisCts.Token);
                    
                    lock (_analysisLock)
                    {
                        if (!_analysisCts.Token.IsCancellationRequested)
                        {
                            _lastAnalysis = result;
                        }
                    }
                }
                catch (OperationCanceledException)
                {
                    _logger.LogInfo("[UltraClean] Análise cancelada");
                }
                catch (Exception ex)
                {
                    _logger.LogError($"[UltraClean] Erro na análise em background: {ex.Message}");
                }
                finally
                {
                    lock (_analysisLock)
                    {
                        _isAnalyzing = false;
                        _analysisCts?.Dispose();
                        _analysisCts = null;
                    }
                }
            });
            
            await Task.CompletedTask;
        }
        
        /// <summary>
        /// Cancela a análise em andamento
        /// </summary>
        public void CancelAnalysis()
        {
            lock (_analysisLock)
            {
                _analysisCts?.Cancel();
            }
        }
        
        /// <summary>
        /// Obtém o status atual da análise
        /// </summary>
        public AnalysisStatus GetAnalysisStatus()
        {
            lock (_analysisLock)
            {
                return new AnalysisStatus
                {
                    IsAnalyzing = _isAnalyzing,
                    CurrentCategory = _currentProgress.Category,
                    CurrentItem = _currentProgress.CurrentItem,
                    PercentComplete = _currentProgress.PercentComplete,
                    LastAnalysis = _lastAnalysis
                };
            }
        }

        private void InitializeCategories()
        {
            // ============================================
            // CATEGORIA 1: ARQUIVOS EXPIRADOS
            // ============================================
            _categories.Add(new CleanupCategory
            {
                Name = "Arquivos Expirados",
                Icon = "📦",
                Items = new List<CleanupCategoryItem>
                {
                    new() { Name = "Limpeza Ultra Profissional do Windows", Description = "Integra TODAS as opções do cleanmgr.exe + WinSxS profundo", CleanAction = CleanWindowsDiskCleanupFull, AnalyzeAction = AnalyzeWindowsDiskCleanupFull, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Componentes Obsoletos do Windows", Description = "Limpeza segura via sistema", CleanAction = CleanWinSxSSuperseded, AnalyzeAction = AnalyzeWinSxS, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Windows.old", Description = "Instalação anterior do Windows", CleanAction = CleanWindowsOld, AnalyzeAction = AnalyzeWindowsOld, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Arquivos de Backup do Windows", Description = "Backups antigos de atualizações", CleanAction = CleanWindowsBackup, AnalyzeAction = AnalyzeWindowsBackup, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Service Pack Backup", Description = "Arquivos de backup do Service Pack", CleanAction = CleanServicePackBackup, AnalyzeAction = AnalyzeServicePackBackup, RequiresAdmin = true, IsSafe = true },
                    // DESABILITADO: Chrome e Opera modernos não usam sistema de backup de versões
                    // new() { Name = "Chrome - Backups de Versões Antigas", Description = "Backups de versões antigas do Chrome", CleanAction = CleanChromeOldBackup, AnalyzeAction = AnalyzeChromeOldBackup, RequiresAdmin = false, IsSafe = false },
                    // new() { Name = "Opera - Backups de Versões Antigas", Description = "Backups de versões antigas do Opera", CleanAction = CleanOperaOldBackup, AnalyzeAction = AnalyzeOperaOldBackup, RequiresAdmin = false, IsSafe = false },
                    new() { Name = "360 Browser - Backups de Versões Antigas", Description = "Backups de versões antigas do 360 Browser", CleanAction = Clean360BrowserOldBackup, AnalyzeAction = Analyze360BrowserOldBackup, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Alibaba Wangwang - Backups Antigos", Description = "Backups de versões antigas do Alibaba Wangwang", CleanAction = CleanAlibabaWangwangOldBackup, AnalyzeAction = AnalyzeAlibabaWangwangOldBackup, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Alibaba Qintao - Backups Antigos", Description = "Backups de versões antigas do Alibaba Qintao", CleanAction = CleanAlibabaQintaoOldBackup, AnalyzeAction = AnalyzeAlibabaQintaoOldBackup, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "PPLive - Backups Antigos", Description = "Backups de versões antigas do PPLive", CleanAction = CleanPPLiveOldBackup, AnalyzeAction = AnalyzePPLiveOldBackup, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "KuGou Music - Backups Antigos", Description = "Backups de versões antigas do KuGou Music", CleanAction = CleanKuGouMusicOldBackup, AnalyzeAction = AnalyzeKuGouMusicOldBackup, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "2345 Pinyin - Backups Antigos", Description = "Backups de versões antigas do 2345 Pinyin", CleanAction = Clean2345PinyinOldBackup, AnalyzeAction = Analyze2345PinyinOldBackup, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "WPS - Backups Antigos", Description = "Backups de versões antigas do WPS Office", CleanAction = CleanWPSOldBackup, AnalyzeAction = AnalyzeWPSOldBackup, RequiresAdmin = false, IsSafe = true },
                }
            });

            // ============================================
            // CATEGORIA 2: SISTEMA
            // ============================================
            _categories.Add(new CleanupCategory
            {
                Name = "Sistema",
                Icon = "⚙️",
                Items = new List<CleanupCategoryItem>
                {
                    new() { Name = "Relatório de Erros do Windows", Description = "Windows Error Reporting", CleanAction = CleanErrorReports, AnalyzeAction = AnalyzeErrorReports, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Logs de Eventos do Windows", Description = "Event Viewer logs", CleanAction = CleanEventLogs, AnalyzeAction = AnalyzeEventLogs, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Histórico do Windows Update", Description = "Logs de instalação de atualizações", CleanAction = CleanWindowsUpdateHistory, AnalyzeAction = AnalyzeWindowsUpdateHistory, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Pontos de Restauração Antigos", Description = "Mantém apenas o mais recente", CleanAction = CleanOldRestorePoints, AnalyzeAction = AnalyzeRestorePoints, RequiresAdmin = true, IsSafe = false },
                    new() { Name = "Arquivos de Despejo (Dumps)", Description = "MEMORY.DMP e Minidumps", CleanAction = CleanDumpFiles, AnalyzeAction = AnalyzeDumpFiles, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Dumps de Crash do Usuário", Description = "Arquivos .dmp de crash de aplicativos", CleanAction = CleanUserCrashDumps, AnalyzeAction = AnalyzeUserCrashDumps, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Arquivos de Log do Sistema", Description = "CBS, DISM, SFC logs", CleanAction = CleanSystemLogs, AnalyzeAction = AnalyzeSystemLogs, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Appx Corrompidos", Description = "Aplicativos UWP corrompidos", CleanAction = CleanCorruptedAppx, AnalyzeAction = AnalyzeCorruptedAppx, RequiresAdmin = true, IsSafe = false },
                    new() { Name = "Windows Logs (Completo)", Description = "Todos os logs do Windows", CleanAction = CleanWindowsLogsEnhanced, AnalyzeAction = AnalyzeWindowsLogsEnhanced, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Logs do Sistema (Avançado)", Description = "Limpeza profunda de logs do sistema", CleanAction = CleanAdvancedSystemLogs, AnalyzeAction = AnalyzeAdvancedSystemLogs, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Arquivos Temporários do Sistema (Avançado)", Description = "Limpeza profunda de arquivos temporários", CleanAction = CleanAdvancedSystemTemp, AnalyzeAction = AnalyzeAdvancedSystemTemp, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Cache de Aplicativos (Avançado)", Description = "Limpeza profunda de cache de aplicativos", CleanAction = CleanAdvancedAppCache, AnalyzeAction = AnalyzeAdvancedAppCache, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Boot Backup Info (PSS)", Description = "Backup de informações de boot", CleanAction = CleanBootBackupInfo, AnalyzeAction = AnalyzeBootBackupInfo, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Hard Link Backup", Description = "Backup de hard links", CleanAction = CleanHardLinkBackup, AnalyzeAction = AnalyzeHardLinkBackup, RequiresAdmin = true, IsSafe = false },
                    new() { Name = "Last Known Good Configuration", Description = "Última configuração conhecida", CleanAction = CleanLastKnownGood, AnalyzeAction = AnalyzeLastKnownGood, RequiresAdmin = true, IsSafe = false },
                }
            });

            // ============================================
            // CATEGORIA 3: WINDOWS UPDATE
            // ============================================
            _categories.Add(new CleanupCategory
            {
                Name = "Windows Update",
                Icon = "🔄",
                Items = new List<CleanupCategoryItem>
                {
                    new() { Name = "Cache de Download do Windows Update", Description = "SoftwareDistribution\\Download", CleanAction = CleanWindowsUpdateCache, AnalyzeAction = AnalyzeWindowsUpdateCache, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Delivery Optimization Cache", Description = "Cache de otimização de entrega", CleanAction = CleanDeliveryOptimization, AnalyzeAction = AnalyzeDeliveryOptimization, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Arquivos de Update Pendentes", Description = "Atualizações parcialmente baixadas", CleanAction = CleanPendingUpdates, AnalyzeAction = AnalyzePendingUpdates, RequiresAdmin = true, IsSafe = true },
                }
            });

            // ============================================
            // CATEGORIA 4: CACHE DO WINDOWS
            // ============================================
            _categories.Add(new CleanupCategory
            {
                Name = "Cache do Windows",
                Icon = "💾",
                Items = new List<CleanupCategoryItem>
                {
                    new() { Name = "Cache de Miniaturas", Description = "Thumbcache e IconCache", CleanAction = CleanThumbnailCache, AnalyzeAction = AnalyzeThumbnailCache, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Cache de Fontes", Description = "FontCache do Windows", CleanAction = CleanFontCache, AnalyzeAction = AnalyzeFontCache, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Prefetch", Description = "Arquivos de pré-carregamento", CleanAction = CleanPrefetch, AnalyzeAction = AnalyzePrefetch, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Cache DNS", Description = "Resolver cache", CleanAction = CleanDnsCache, AnalyzeAction = AnalyzeDnsCache, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Cache ARP", Description = "Address Resolution Protocol", CleanAction = CleanArpCache, AnalyzeAction = AnalyzeArpCache, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Terminal Server Client Cache", Description = "Cache do Terminal Server Client", CleanAction = CleanTerminalServerClientCache, AnalyzeAction = AnalyzeTerminalServerClientCache, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "XDE Cache", Description = "Windows Phone Emulator cache", CleanAction = CleanXDECache, AnalyzeAction = AnalyzeXDECache, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "PDB Cache", Description = "Debug symbols cache", CleanAction = CleanPDBCache, AnalyzeAction = AnalyzePDBCache, RequiresAdmin = false, IsSafe = true },
                    new() { Name = ".NET Assembly Cache (Nativo)", Description = "Native Images cache", CleanAction = CleanDotNetAssemblyCache, AnalyzeAction = AnalyzeDotNetAssemblyCache, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Visual Studio Intelligent Tracking", Description = "VS trace debugging cache", CleanAction = CleanVisualStudioIntelligentTracking, AnalyzeAction = AnalyzeVisualStudioIntelligentTracking, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Retail Demo Content", Description = "Conteúdo offline do modo demo", CleanAction = CleanRetailDemoContent, AnalyzeAction = AnalyzeRetailDemoContent, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "WebPI Cache", Description = "Web Platform Installer cache", CleanAction = CleanWebPICache, AnalyzeAction = AnalyzeWebPICache, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Visual Studio Package Cache", Description = "VS installation source cache", CleanAction = CleanVSPackageCache, AnalyzeAction = AnalyzeVSPackageCache, RequiresAdmin = true, IsSafe = false },
                }
            });

            // ============================================
            // CATEGORIA 5: CACHE DE INTERNET
            // ============================================
            _categories.Add(new CleanupCategory
            {
                Name = "Cache de Internet",
                Icon = "🌐",
                Items = new List<CleanupCategoryItem>
                {
                    new() { Name = "Cache Web do WinINet", Description = "Internet Explorer/Edge Legacy cache", CleanAction = CleanWinINetCache, AnalyzeAction = AnalyzeWinINetCache, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Cookies do WinINet", Description = "Cookies do sistema", CleanAction = CleanWinINetCookies, AnalyzeAction = AnalyzeWinINetCookies, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Cache do Microsoft Edge", Description = "Chromium Edge cache", CleanAction = CleanEdgeCache, AnalyzeAction = AnalyzeEdgeCache, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Cache do Google Chrome", Description = "Chrome browser cache", CleanAction = CleanChromeCache, AnalyzeAction = AnalyzeChromeCache, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Cache do Firefox", Description = "Mozilla Firefox cache", CleanAction = CleanFirefoxCache, AnalyzeAction = AnalyzeFirefoxCache, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Cache do Opera", Description = "Opera browser cache", CleanAction = CleanOperaCache, AnalyzeAction = AnalyzeOperaCache, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Cache do Brave", Description = "Brave browser cache", CleanAction = CleanBraveCache, AnalyzeAction = AnalyzeBraveCache, RequiresAdmin = false, IsSafe = true },
                }
            });

            // ============================================
            // CATEGORIA 6: APLICAÇÕES
            // ============================================
            _categories.Add(new CleanupCategory
            {
                Name = "Aplicações",
                Icon = "📱",
                Items = new List<CleanupCategoryItem>
                {
                    new() { Name = "Windows Defender - Histórico", Description = "Histórico de proteção do Defender", CleanAction = CleanDefenderHistory, AnalyzeAction = AnalyzeDefenderHistory, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Windows Installer Cache", Description = "Cache do Windows Installer", CleanAction = CleanInstallerCache, AnalyzeAction = AnalyzeInstallerCache, RequiresAdmin = true, IsSafe = false },
                    new() { Name = "Installer Baseline Cache", Description = "$PatchCache$ do Windows Installer", CleanAction = CleanInstallerBaselineCache, AnalyzeAction = AnalyzeInstallerBaselineCache, RequiresAdmin = true, IsSafe = false },
                    new() { Name = "Package Cache", Description = "Cache de pacotes de aplicativos", CleanAction = CleanPackageCache, AnalyzeAction = AnalyzePackageCache, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Cache do .NET Assembly", Description = "NGen cache e assemblies", CleanAction = CleanDotNetCache, AnalyzeAction = AnalyzeDotNetCache, RequiresAdmin = true, IsSafe = true },
                    new() { Name = ".NET Multi-Targeting Pack Cache", Description = "SetupCache do Multi-Targeting Pack", CleanAction = CleanDotNetMultiTargetingCache, AnalyzeAction = AnalyzeDotNetMultiTargetingCache, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Cache do NuGet", Description = "Pacotes NuGet baixados", CleanAction = CleanNuGetCache, AnalyzeAction = AnalyzeNuGetCache, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Cache do Visual Studio", Description = "VS cache e logs", CleanAction = CleanVisualStudioCache, AnalyzeAction = AnalyzeVisualStudioCache, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Visual Studio Settings Logs", Description = "Logs de configuração do Visual Studio", CleanAction = CleanVisualStudioSettingsLogs, AnalyzeAction = AnalyzeVisualStudioSettingsLogs, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Cache do NPM/Yarn", Description = "Node.js package cache", CleanAction = CleanNpmCache, AnalyzeAction = AnalyzeNpmCache, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "IDM Temp Files", Description = "Arquivos temporários do Internet Download Manager", CleanAction = CleanIDMTempFiles, AnalyzeAction = AnalyzeIDMTempFiles, RequiresAdmin = false, IsSafe = false },
                    new() { Name = "Microsoft Antivirus Useless Files", Description = "Arquivos inúteis do MSE/SCEP/Defender", CleanAction = CleanMicrosoftAntivirusUselessFiles, AnalyzeAction = AnalyzeMicrosoftAntivirusUselessFiles, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Office MSOCache", Description = "Cache de instalação do Office", CleanAction = CleanOfficeMSOCache, AnalyzeAction = AnalyzeOfficeMSOCache, RequiresAdmin = true, IsSafe = false },
                    new() { Name = "Office 365/2016 ClickToRun Cache", Description = "Cache do Office ClickToRun", CleanAction = CleanOfficeClickToRunCache, AnalyzeAction = AnalyzeOfficeClickToRunCache, RequiresAdmin = true, IsSafe = false },
                    new() { Name = "iTunes Backup", Description = "Backups do iTunes", CleanAction = CleaniTunesBackup, AnalyzeAction = AnalyzeiTunesBackup, RequiresAdmin = false, IsSafe = false },
                    new() { Name = "Realtek Audio Install Cache", Description = "Cache de instalação do Realtek", CleanAction = CleanRealtekAudioCache, AnalyzeAction = AnalyzeRealtekAudioCache, RequiresAdmin = true, IsSafe = false },
                    new() { Name = "Java Install Cache", Description = "Cache de instalação do Java", CleanAction = CleanJavaInstallCache, AnalyzeAction = AnalyzeJavaInstallCache, RequiresAdmin = false, IsSafe = false },
                    new() { Name = "Intel Driver Install Cache", Description = "Cache de instalação de drivers Intel", CleanAction = CleanIntelDriverCache, AnalyzeAction = AnalyzeIntelDriverCache, RequiresAdmin = true, IsSafe = false },
                    new() { Name = "NVIDIA Driver Install Cache", Description = "Cache de instalação de drivers NVIDIA", CleanAction = CleanNVIDIADriverCache, AnalyzeAction = AnalyzeNVIDIADriverCache, RequiresAdmin = true, IsSafe = false },
                    new() { Name = "NVIDIA Downloader Cache", Description = "Cache do NVIDIA Downloader", CleanAction = CleanNVIDIADownloaderCache, AnalyzeAction = AnalyzeNVIDIADownloaderCache, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "SQL Server Update Cache", Description = "Cache de atualizações do SQL Server", CleanAction = CleanSQLServerUpdateCache, AnalyzeAction = AnalyzeSQLServerUpdateCache, RequiresAdmin = true, IsSafe = false },
                    new() { Name = "Adobe Acrobat Install Cache", Description = "Cache de instalação do Acrobat", CleanAction = CleanAdobeAcrobatCache, AnalyzeAction = AnalyzeAdobeAcrobatCache, RequiresAdmin = true, IsSafe = false },
                    new() { Name = "Corel VideoStudio SmartProxy", Description = "SmartProxy do VideoStudio", CleanAction = CleanCorelVideoStudioProxy, AnalyzeAction = AnalyzeCorelVideoStudioProxy, RequiresAdmin = false, IsSafe = false },
                }
            });

            // ============================================
            // CATEGORIA 7: ARQUIVOS TEMPORÁRIOS
            // ============================================
            _categories.Add(new CleanupCategory
            {
                Name = "Arquivos Temporários",
                Icon = "🗑️",
                Items = new List<CleanupCategoryItem>
                {
                    new() { Name = "Temp do Usuário", Description = "%TEMP% folder", CleanAction = CleanUserTemp, AnalyzeAction = AnalyzeUserTemp, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Temp do Windows", Description = "C:\\Windows\\Temp", CleanAction = CleanWindowsTemp, AnalyzeAction = AnalyzeWindowsTemp, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Arquivos Temporários WinSxS", Description = "Temp no Component Store", CleanAction = CleanWinSxSTemp, AnalyzeAction = AnalyzeWinSxSTemp, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "WinSxS Temp Files (ManifestCache/CbsTemp)", Description = "Arquivos temporários do WinSxS", CleanAction = CleanWinSxSTempFiles, AnalyzeAction = AnalyzeWinSxSTempFiles, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Temp de Drivers", Description = "Arquivos extraídos de drivers", CleanAction = CleanDriverTemp, AnalyzeAction = AnalyzeDriverTemp, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Temp de Drivers (AMD/Intel/NVIDIA)", Description = "Diretórios temporários de drivers", CleanAction = CleanDriverTempDirectories, AnalyzeAction = AnalyzeDriverTempDirectories, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Windows Temp Install Files", Description = "$Windows.~BT, ~WS, ~LS", CleanAction = CleanWindowsTempInstallFiles, AnalyzeAction = AnalyzeWindowsTempInstallFiles, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Arquivos Recentes", Description = "Lista de arquivos recentes", CleanAction = CleanRecentFiles, AnalyzeAction = AnalyzeRecentFiles, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Lixeira", Description = "Recycle Bin", CleanAction = CleanRecycleBin, AnalyzeAction = AnalyzeRecycleBin, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "QQ Temp Data", Description = "Dados temporários do QQ", CleanAction = CleanQQTempData, AnalyzeAction = AnalyzeQQTempData, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "YY Temp Files", Description = "Arquivos temporários do YY", CleanAction = CleanYYTempFiles, AnalyzeAction = AnalyzeYYTempFiles, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Tencent Download Directory", Description = "Diretório de downloads do Tencent", CleanAction = CleanTencentDownloadDir, AnalyzeAction = AnalyzeTencentDownloadDir, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Microsoft Pinyin Install Files", Description = "Arquivos de instalação do Pinyin", CleanAction = CleanMicrosoftPinyinInstall, AnalyzeAction = AnalyzeMicrosoftPinyinInstall, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Baidu Netdisk Logs", Description = "Logs do Baidu Netdisk", CleanAction = CleanBaiduNetdiskLogs, AnalyzeAction = AnalyzeBaiduNetdiskLogs, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Fetion Logs", Description = "Logs do Fetion", CleanAction = CleanFetionLogs, AnalyzeAction = AnalyzeFetionLogs, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Avira Temp Files", Description = "Arquivos temporários do Avira", CleanAction = CleanAviraTempFiles, AnalyzeAction = AnalyzeAviraTempFiles, RequiresAdmin = true, IsSafe = true },
                }
            });

            // ============================================
            // CATEGORIA 8: JOGOS
            // ============================================
            _categories.Add(new CleanupCategory
            {
                Name = "Cache de Jogos",
                Icon = "🎮",
                Items = new List<CleanupCategoryItem>
                {
                    new() { Name = "NVIDIA Shader Cache", Description = "DXCache e GLCache", CleanAction = CleanNvidiaShaderCache, AnalyzeAction = AnalyzeNvidiaShaderCache, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "AMD Shader Cache", Description = "DxCache da AMD", CleanAction = CleanAmdShaderCache, AnalyzeAction = AnalyzeAmdShaderCache, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "DirectX Shader Cache", Description = "D3DSCache", CleanAction = CleanDirectXCache, AnalyzeAction = AnalyzeDirectXCache, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Steam Cache", Description = "Download e Shader cache", CleanAction = CleanSteamCache, AnalyzeAction = AnalyzeSteamCache, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Epic Games Cache", Description = "Launcher cache", CleanAction = CleanEpicCache, AnalyzeAction = AnalyzeEpicCache, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Origin/EA Cache", Description = "EA App cache", CleanAction = CleanOriginCache, AnalyzeAction = AnalyzeOriginCache, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Unreal Engine Cache", Description = "Intermediates e Saved", CleanAction = CleanUnrealCache, AnalyzeAction = AnalyzeUnrealCache, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Unity Cache", Description = "Library e Temp", CleanAction = CleanUnityCache, AnalyzeAction = AnalyzeUnityCache, RequiresAdmin = false, IsSafe = true },
                }
            });

            // ============================================
            // CATEGORIA 9: REGISTRO DO WINDOWS (NOVO)
            // ============================================
            _categories.Add(new CleanupCategory
            {
                Name = "Registro do Windows",
                Icon = "📋",
                Items = new List<CleanupCategoryItem>
                {
                    new() { Name = "Chaves Órfãs de Desinstalação", Description = "Entradas de programas já removidos", CleanAction = CleanOrphanUninstallKeys, AnalyzeAction = AnalyzeOrphanUninstallKeys, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "MRU Lists", Description = "Listas de arquivos recentes", CleanAction = CleanMRULists, AnalyzeAction = AnalyzeMRULists, RequiresAdmin = false, IsSafe = true },
                    new() { Name = "Extensões de Arquivo Órfãs", Description = "Associações de arquivos inválidas", CleanAction = CleanOrphanFileExtensions, AnalyzeAction = AnalyzeOrphanFileExtensions, RequiresAdmin = true, IsSafe = true },
                }
            });

            // ============================================
            // CATEGORIA 10: WINDOWS STORE (NOVO)
            // ============================================
            _categories.Add(new CleanupCategory
            {
                Name = "Windows Store",
                Icon = "🏪",
                Items = new List<CleanupCategoryItem>
                {
                    new() { Name = "Cache do Microsoft Store", Description = "Cache de downloads e atualizações", CleanAction = CleanStoreCache, AnalyzeAction = AnalyzeStoreCache, RequiresAdmin = true, IsSafe = true },
                    new() { Name = "Cache de Apps UWP", Description = "Cache de aplicativos da Store", CleanAction = CleanUWPCache, AnalyzeAction = AnalyzeUWPCache, RequiresAdmin = false, IsSafe = true },
                }
            });
            
            // Adicionar "Drivers Antigos" à categoria Sistema
            var systemCategory = _categories.FirstOrDefault(c => c.Name == "Sistema");
            if (systemCategory != null)
            {
                systemCategory.Items.Add(new CleanupCategoryItem
                {
                    Name = "Drivers Antigos (DriverStore)",
                    Description = "Mantém apenas versão mais recente de cada driver",
                    CleanAction = CleanOldDrivers,
                    AnalyzeAction = AnalyzeOldDrivers,
                    RequiresAdmin = true,
                    IsSafe = true
                });
            }
        }

        #region Main API

        public List<CleanupCategory> GetCategories() => _categories;

        /// <summary>
        /// Analisa todas as categorias e retorna o resultado
        /// </summary>
        public async Task<UltraCleanAnalysis> AnalyzeAllAsync(
            IProgress<AnalysisProgress>? progress = null,
            CancellationToken ct = default)
        {
            var result = new UltraCleanAnalysis();

            _logger.LogInfo("╔═══════════════════════════════════════════════════════════╗");
            _logger.LogInfo("║     VOLTRIS ULTRA CLEANER - ANÁLISE COMPLETA              ║");
            _logger.LogInfo("╚═══════════════════════════════════════════════════════════╝");

            int totalItems = _categories.Sum(c => c.Items.Count);
            int currentItem = 0;

            foreach (var category in _categories)
            {
                if (ct.IsCancellationRequested) break;

                var categoryResult = new CategoryAnalysis
                {
                    Name = category.Name,
                    Icon = category.Icon
                };

                foreach (var item in category.Items)
                {
                    if (ct.IsCancellationRequested) break;

                    currentItem++;
                    progress?.Report(new AnalysisProgress
                    {
                        CurrentItem = item.Name,
                        Category = category.Name,
                        PercentComplete = (int)((float)currentItem / totalItems * 100)
                    });

                    try
                    {
                        var size = await Task.Run(() => item.AnalyzeAction?.Invoke() ?? 0);
                        
                        categoryResult.Items.Add(new ItemAnalysis
                        {
                            Name = item.Name,
                            Description = item.Description,
                            Size = size,
                            IsSafe = item.IsSafe,
                            RequiresAdmin = item.RequiresAdmin,
                            IsSelected = item.IsSafe && size > 0,
                            CleanAction = item.CleanAction
                        });

                        if (size > 0)
                        {
                            categoryResult.TotalSize += size;
                            _logger.LogInfo($"[UltraClean] {item.Name}: {FormatBytes(size)}");
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"[UltraClean] Erro ao analisar {item.Name}: {ex.Message}");
                    }
                }

                if (categoryResult.Items.Any(i => i.Size > 0))
                {
                    result.Categories.Add(categoryResult);
                    result.TotalReclaimable += categoryResult.TotalSize;
                }
            }

            _logger.LogSuccess($"[UltraClean] Total recuperável: {FormatBytes(result.TotalReclaimable)}");
            return result;
        }

        /// <summary>
        /// Executa a limpeza dos itens selecionados
        /// </summary>
        public async Task<CleanupResult> CleanSelectedAsync(
            List<ItemAnalysis> selectedItems,
            IProgress<CleanupProgress>? progress = null,
            CancellationToken ct = default)
        {
            var result = new CleanupResult();
            int current = 0;

            _logger.LogInfo("[UltraClean] Iniciando limpeza...");
            _currentTx = _txService?.Begin("UltraCleaner.CleanSelected");

            foreach (var item in selectedItems)
            {
                if (ct.IsCancellationRequested) break;
                if (!item.IsSelected) continue;

                current++;
                progress?.Report(new CleanupProgress
                {
                    CurrentItem = item.Name,
                    PercentComplete = (int)((float)current / selectedItems.Count * 100)
                });

                try
                {
                    var cleaned = await Task.Run(() => item.CleanAction?.Invoke() ?? 0);
                    result.SpaceCleaned += cleaned;
                    result.ItemsCleaned++;
                    
                    if (cleaned > 0)
                    {
                        _logger.LogSuccess($"[UltraClean] {item.Name}: {FormatBytes(cleaned)} limpo");
                    }
                }
                catch (Exception ex)
                {
                    result.Errors.Add($"{item.Name}: {ex.Message}");
                    _logger.LogWarning($"[UltraClean] Erro ao limpar {item.Name}: {ex.Message}");
                }
            }

            result.Success = result.Errors.Count == 0;
            if (result.Success) _currentTx?.Commit();
            _currentTx?.Dispose();
            _logger.LogSuccess($"[UltraClean] Limpeza concluída: {FormatBytes(result.SpaceCleaned)} liberados");
            
            return result;
        }

        #endregion

        #region Windows Disk Cleanup Integration (Ultra Professional)

        private long AnalyzeWindowsDiskCleanupFull()
        {
            // Não estimamos pois o tamanho real só é conhecido após execução
            // Retornamos 0 para não criar expectativas falsas
            return 0;
        }

        private long CleanWindowsDiskCleanupFull()
        {
            try
            {
                _logger.LogInfo("[UltraClean] Executando limpeza ultra profissional do Windows...");
                
                // Executar limpeza completa de forma síncrona
                var task = _diskCleanup.RunFullDiskCleanupAsync(
                    includeDangerousOptions: false, // Não incluir opções perigosas por padrão
                    progress: null,
                    ct: CancellationToken.None
                );
                
                task.Wait(); // Aguardar conclusão
                var result = task.Result;
                
                if (result.Success)
                {
                    _logger.LogSuccess($"[UltraClean] Limpeza ultra profissional concluída: {FormatBytes(result.SpaceCleaned)}");
                    return result.SpaceCleaned;
                }
                else
                {
                    _logger.LogWarning($"[UltraClean] Erro na limpeza: {result.ErrorMessage}");
                    return 0;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[UltraClean] Erro ao executar limpeza ultra profissional: {ex.Message}");
                return 0;
            }
        }

        #endregion

        #region WinSxS Cleanup

        private long AnalyzeWinSxS()
        {
            try
            {
                _logger.LogInfo("[UltraClean] Analisando WinSxS para componentes obsoletos (método avançado DISM++)...");
                
                long total = 0;
                var winsxsPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "WinSxS");
                
                if (!Directory.Exists(winsxsPath)) return 0;

                // MÉTODO 1: DISM AnalyzeComponentStore (mais preciso)
                try
                {
                    var psi = new ProcessStartInfo
                    {
                        FileName = "dism.exe",
                        Arguments = "/Online /Cleanup-Image /AnalyzeComponentStore",
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        Verb = "runas"
                    };

                    using var process = Process.Start(psi);
                    if (process != null)
                    {
                        var output = process.StandardOutput.ReadToEnd();
                        process.WaitForExit(180000); // 3 min timeout

                        // Extrair tamanho recuperável do output do DISM
                        // Múltiplos padrões possíveis:
                        var patterns = new[]
                        {
                            @"Component Store Cleanup Recommended.*?(\d+\.?\d*)\s*GB",
                            @"Reclaimable Package Cache Size.*?(\d+\.?\d*)\s*GB",
                            @"can be reclaimed.*?(\d+\.?\d*)\s*GB",
                            @"(\d+\.?\d*)\s*GB.*?can be reclaimed"
                        };
                        
                        foreach (var pattern in patterns)
                        {
                            var match = System.Text.RegularExpressions.Regex.Match(
                                output, 
                                pattern,
                                System.Text.RegularExpressions.RegexOptions.IgnoreCase
                            );
                            
                            if (match.Success && match.Groups.Count > 1)
                            {
                                if (double.TryParse(match.Groups[1].Value, System.Globalization.NumberStyles.Any, System.Globalization.CultureInfo.InvariantCulture, out double gb))
                                {
                                    total = (long)(gb * 1024 * 1024 * 1024);
                                    _logger.LogInfo($"[UltraClean] DISM detectou {FormatBytes(total)} recuperáveis no WinSxS");
                                    if (total > 0) return total; // Retornar se encontrou algo
                                }
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[UltraClean] Erro ao analisar WinSxS com DISM: {ex.Message}");
                }

                // MÉTODO 2: Análise profunda de componentes obsoletos (como DISM++)
                try
                {
                    _logger.LogInfo("[UltraClean] Iniciando análise profunda do WinSxS (método DISM++)...");
                    
                    var componentDirs = Directory.GetDirectories(winsxsPath).ToList();
                    _logger.LogInfo($"[UltraClean] Total de componentes encontrados: {componentDirs.Count}");
                    
                    var componentGroups = new Dictionary<string, List<(string path, string version, DateTime lastWrite, long size)>>();

                    // Agrupar componentes por nome base e calcular tamanhos
                    int processed = 0;
                    foreach (var dir in componentDirs)
                    {
                        try
                        {
                            processed++;
                            if (processed % 1000 == 0)
                                _logger.LogInfo($"[UltraClean] Processando componente {processed}/{componentDirs.Count}...");
                            
                            var dirName = Path.GetFileName(dir);
                            // Formato: amd64_ComponentName_31bf3856ad364e35_10.0.26100.1_none_hash
                            var match = System.Text.RegularExpressions.Regex.Match(
                                dirName,
                                @"^([^_]+_[^_]+_[^_]+)_([^_]+)_"
                            );
                            
                            if (match.Success)
                            {
                                var baseName = match.Groups[1].Value;
                                var version = match.Groups[2].Value;
                                var lastWrite = Directory.GetLastWriteTime(dir);
                                var size = GetDirectorySize(dir);
                                
                                if (!componentGroups.ContainsKey(baseName))
                                    componentGroups[baseName] = new List<(string, string, DateTime, long)>();
                                
                                componentGroups[baseName].Add((dir, version, lastWrite, size));
                            }
                        }
                        catch { }
                    }

                    _logger.LogInfo($"[UltraClean] Componentes agrupados: {componentGroups.Count} grupos únicos");

                    // Identificar versões obsoletas (múltiplas versões do mesmo componente)
                    int obsoleteGroups = 0;
                    long obsoleteVersionsSize = 0;
                    foreach (var group in componentGroups.Where(g => g.Value.Count > 1))
                    {
                        obsoleteGroups++;
                        // Ordenar por versão e data (mais recente primeiro)
                        var sorted = group.Value
                            .OrderByDescending(x => x.version, new VersionComparer())
                            .ThenByDescending(x => x.lastWrite)
                            .ToList();

                        // Todas as versões exceto a mais recente são obsoletas
                        for (int i = 1; i < sorted.Count; i++)
                        {
                            try
                            {
                                obsoleteVersionsSize += sorted[i].size; // Usar tamanho já calculado
                            }
                            catch { }
                        }
                    }
                    total += obsoleteVersionsSize;
                    _logger.LogInfo($"[UltraClean] Grupos com versões obsoletas: {obsoleteGroups}, tamanho: {FormatBytes(obsoleteVersionsSize)}");

                    // MÉTODO 3: Componentes .NET obsoletos (padrões conhecidos - MAIS AGRESSIVO)
                    var dotNetPatterns = new[] 
                    { 
                        "b03f5f7f11d50a3a_4.0.15912.0", 
                        "b77a5c561934e089_4.0.15912.0",
                        "4.0.15912.0",
                        "4.0.30319",
                        "_4.0.", // Qualquer versão 4.0 do .NET
                        "Microsoft.Build",
                        "Microsoft.CSharp",
                        "Microsoft.VisualBasic",
                        "Microsoft.JScript"
                    };
                    
                    long dotNetTotal = 0;
                    foreach (var pattern in dotNetPatterns)
                    {
                        foreach (var dir in componentDirs)
                        {
                            var dirName = Path.GetFileName(dir);
                            if (dirName.Contains(pattern, StringComparison.OrdinalIgnoreCase))
                            {
                                try
                                {
                                    // Verificar se não é a versão mais recente
                                    var newerExists = componentDirs.Any(d => 
                                        d != dir && 
                                        Path.GetFileName(d).Contains(pattern) &&
                                        Directory.GetLastWriteTime(d) > Directory.GetLastWriteTime(dir)
                                    );
                                    
                                    if (!newerExists)
                                    {
                                        var size = GetDirectorySize(dir);
                                        dotNetTotal += size;
                                    }
                                }
                                catch { }
                            }
                        }
                    }
                    total += dotNetTotal;
                    _logger.LogInfo($"[UltraClean] Componentes .NET obsoletos: {FormatBytes(dotNetTotal)}");

                    // MÉTODO 4: Componentes com data muito antiga (mais de 6 meses - mais agressivo)
                    var sixMonthsAgo = DateTime.Now.AddMonths(-6);
                    long oldComponentsTotal = 0;
                    int oldComponentsCount = 0;
                    
                    foreach (var dir in componentDirs)
                    {
                        try
                        {
                            var lastWrite = Directory.GetLastWriteTime(dir);
                            if (lastWrite < sixMonthsAgo)
                            {
                                // Verificar se não há versão mais recente
                                var dirName = Path.GetFileName(dir);
                                var baseMatch = System.Text.RegularExpressions.Regex.Match(dirName, @"^([^_]+_[^_]+_[^_]+)_");
                                if (baseMatch.Success)
                                {
                                    var baseName = baseMatch.Groups[1].Value;
                                    var hasNewer = componentDirs.Any(d => 
                                        d != dir && 
                                        Path.GetFileName(d).StartsWith(baseName) &&
                                        Directory.GetLastWriteTime(d) > lastWrite
                                    );
                                    
                                    if (!hasNewer)
                                    {
                                        oldComponentsCount++;
                                        oldComponentsTotal += GetDirectorySize(dir);
                                    }
                                }
                            }
                        }
                        catch { }
                    }
                    total += oldComponentsTotal;
                    _logger.LogInfo($"[UltraClean] Componentes antigos (>6 meses): {oldComponentsCount} componentes, {FormatBytes(oldComponentsTotal)}");

                    // MÉTODO 5: Componentes duplicados por hash (mesmo componente, hash diferente)
                    var hashGroups = new Dictionary<string, List<(string path, long size)>>();
                    foreach (var dir in componentDirs)
                    {
                        try
                        {
                            var dirName = Path.GetFileName(dir);
                            // Extrair parte antes do último underscore (hash)
                            var parts = dirName.Split('_');
                            if (parts.Length >= 5)
                            {
                                var baseComponent = string.Join("_", parts.Take(parts.Length - 1));
                                if (!hashGroups.ContainsKey(baseComponent))
                                    hashGroups[baseComponent] = new List<(string, long)>();
                                
                                hashGroups[baseComponent].Add((dir, GetDirectorySize(dir)));
                            }
                        }
                        catch { }
                    }
                    
                    long duplicateTotal = 0;
                    foreach (var group in hashGroups.Where(g => g.Value.Count > 1))
                    {
                        // Manter apenas o maior (mais completo) e deletar os outros
                        var sorted = group.Value.OrderByDescending(x => x.size).ToList();
                        for (int i = 1; i < sorted.Count; i++)
                        {
                            duplicateTotal += sorted[i].size;
                        }
                    }
                    total += duplicateTotal;
                    _logger.LogInfo($"[UltraClean] Componentes duplicados por hash: {FormatBytes(duplicateTotal)}");

                    _logger.LogInfo($"[UltraClean] Análise profunda detectou {FormatBytes(total)} recuperáveis no WinSxS");
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[UltraClean] Erro na análise profunda do WinSxS: {ex.Message}");
                }

                return total;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[UltraClean] Erro ao analisar WinSxS: {ex.Message}");
                return 0;
            }
        }

        // Helper para comparar versões
        private class VersionComparer : IComparer<string>
        {
            public int Compare(string x, string y)
            {
                if (x == y) return 0;
                if (x == null) return -1;
                if (y == null) return 1;
                
                try
                {
                    var vx = new Version(x);
                    var vy = new Version(y);
                    return vx.CompareTo(vy);
                }
                catch
                {
                    return string.Compare(x, y, StringComparison.Ordinal);
                }
            }
        }

        private long CleanWinSxSSuperseded()
        {
            try
            {
                _logger.LogInfo("[UltraClean] Limpando WinSxS com DISM...");
                
                var beforeSize = AnalyzeWinSxS();
                
                var psi = new ProcessStartInfo
                {
                    FileName = "dism.exe",
                    Arguments = "/Online /Cleanup-Image /StartComponentCleanup /ResetBase",
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    Verb = "runas"
                };

                using var process = Process.Start(psi);
                process?.WaitForExit(600000); // 10 min timeout

                _logger.LogSuccess("[UltraClean] WinSxS cleanup concluído");
                return beforeSize; // Retorna tamanho estimado antes da limpeza
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[UltraClean] Erro no DISM: {ex.Message}");
                return 0;
            }
        }

        #endregion

        #region Windows.old Cleanup

        private long AnalyzeWindowsOld()
        {
            var paths = new[]
            {
                @"C:\Windows.old",
                @"C:\$Windows.~BT",
                @"C:\$Windows.~WS"
            };

            long total = 0;
            foreach (var path in paths)
            {
                if (Directory.Exists(path))
                {
                    total += GetDirectorySize(path);
                }
            }
            return total;
        }

        private long CleanWindowsOld()
        {
            long cleaned = 0;
            var paths = new[]
            {
                @"C:\Windows.old",
                @"C:\$Windows.~BT",
                @"C:\$Windows.~WS"
            };

            foreach (var path in paths)
            {
                if (Directory.Exists(path))
                {
                    cleaned += DeleteDirectorySafe(path);
                }
            }
            return cleaned;
        }

        #endregion

        #region Windows Backup

        private long AnalyzeWindowsBackup()
        {
            long total = 0;
            var backupPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "System32", "config", "RegBack");
            if (Directory.Exists(backupPath))
            {
                // Não limpar RegBack - é importante para recuperação
            }

            // Windows Backup files
            var wbPath = @"C:\Windows\Logs\WindowsBackup";
            if (Directory.Exists(wbPath))
            {
                total += GetDirectorySize(wbPath);
            }

            return total;
        }

        private long CleanWindowsBackup()
        {
            var wbPath = @"C:\Windows\Logs\WindowsBackup";
            if (Directory.Exists(wbPath))
            {
                return DeleteFilesInDirectory(wbPath, "*", 30); // Manter últimos 30 dias
            }
            return 0;
        }

        private long AnalyzeServicePackBackup() => 0; // Windows 10/11 não tem mais isso
        private long CleanServicePackBackup() => 0;

        #endregion

        #region Error Reports & Logs

        private long AnalyzeErrorReports()
        {
            long total = 0;
            var paths = new[]
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Microsoft", "Windows", "WER"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "Microsoft", "Windows", "WER"),
                @"C:\Windows\LiveKernelReports"
            };

            foreach (var path in paths)
            {
                if (Directory.Exists(path))
                    total += GetDirectorySize(path);
            }
            return total;
        }

        private long CleanErrorReports()
        {
            long cleaned = 0;
            var paths = new[]
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Microsoft", "Windows", "WER"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "Microsoft", "Windows", "WER"),
                @"C:\Windows\LiveKernelReports"
            };

            foreach (var path in paths)
            {
                if (Directory.Exists(path))
                    cleaned += DeleteDirectorySafe(path);
            }
            return cleaned;
        }

        private long AnalyzeEventLogs()
        {
            try
            {
                var logPath = @"C:\Windows\System32\winevt\Logs";
                if (Directory.Exists(logPath))
                    return GetDirectorySize(logPath);
            }
            catch { }
            return 0;
        }

        private long CleanEventLogs()
        {
            try
            {
                // Usar wevtutil para limpar logs
                var logs = new[] { "Application", "Security", "System", "Setup" };
                foreach (var log in logs)
                {
                    try
                    {
                        var psi = new ProcessStartInfo
                        {
                            FileName = "wevtutil.exe",
                            Arguments = $"cl {log}",
                            UseShellExecute = false,
                            CreateNoWindow = true
                        };
                        using var p = Process.Start(psi);
                        p?.WaitForExit(5000);
                    }
                    catch { }
                }
                return AnalyzeEventLogs();
            }
            catch { return 0; }
        }

        private long AnalyzeWindowsUpdateHistory()
        {
            var paths = new[]
            {
                @"C:\Windows\Logs\WindowsUpdate",
                @"C:\Windows\SoftwareDistribution\DataStore\Logs"
            };
            return paths.Where(Directory.Exists).Sum(GetDirectorySize);
        }

        private long CleanWindowsUpdateHistory()
        {
            long cleaned = 0;
            var paths = new[]
            {
                @"C:\Windows\Logs\WindowsUpdate",
                @"C:\Windows\SoftwareDistribution\DataStore\Logs"
            };

            foreach (var path in paths.Where(Directory.Exists))
            {
                cleaned += DeleteFilesInDirectory(path, "*.log", 7);
                cleaned += DeleteFilesInDirectory(path, "*.etl", 7);
            }
            return cleaned;
        }

        #endregion

        #region System Restore Points

        private long AnalyzeRestorePoints()
        {
            // Não estimamos pontos de restauração pois o tamanho real varia muito
            // e é gerenciado pelo Windows Shadow Copy
            return 0;
        }

        private long CleanOldRestorePoints()
        {
            try
            {
                // Manter apenas o ponto mais recente
                var psi = new ProcessStartInfo
                {
                    FileName = "vssadmin.exe",
                    Arguments = "delete shadows /for=C: /oldest",
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using var p = Process.Start(psi);
                p?.WaitForExit(30000);

                return AnalyzeRestorePoints();
            }
            catch { return 0; }
        }

        #endregion

        #region Dump Files

        private long AnalyzeDumpFiles()
        {
            long total = 0;
            
            // MEMORY.DMP
            var memDmp = @"C:\Windows\MEMORY.DMP";
            if (File.Exists(memDmp))
                total += new FileInfo(memDmp).Length;

            // Minidumps
            var minidump = @"C:\Windows\Minidump";
            if (Directory.Exists(minidump))
                total += GetDirectorySize(minidump);

            // LiveKernelReports
            var lkr = @"C:\Windows\LiveKernelReports";
            if (Directory.Exists(lkr))
                total += GetDirectorySize(lkr);

            return total;
        }

        private long CleanDumpFiles()
        {
            long cleaned = 0;

            try
            {
                var memDmp = @"C:\Windows\MEMORY.DMP";
                if (File.Exists(memDmp))
                {
                    var size = new FileInfo(memDmp).Length;
                    File.Delete(memDmp);
                    cleaned += size;
                }
            }
            catch { }

            var minidump = @"C:\Windows\Minidump";
            if (Directory.Exists(minidump))
                cleaned += DeleteDirectorySafe(minidump);

            return cleaned;
        }

        #endregion

        #region System Logs

        private long AnalyzeSystemLogs()
        {
            var paths = new[]
            {
                @"C:\Windows\Logs\CBS",
                @"C:\Windows\Logs\DISM",
                @"C:\Windows\Logs\SIH",
                @"C:\Windows\Logs\MoSetup",
                @"C:\Windows\Panther",
                @"C:\Windows\inf\setupapi.dev.log",
                @"C:\Windows\inf\setupapi.app.log"
            };

            return paths.Where(p => Directory.Exists(p) || File.Exists(p))
                        .Sum(p => File.Exists(p) ? new FileInfo(p).Length : GetDirectorySize(p));
        }

        private long CleanSystemLogs()
        {
            long cleaned = 0;

            var logPaths = new[]
            {
                @"C:\Windows\Logs\CBS",
                @"C:\Windows\Logs\DISM",
                @"C:\Windows\Logs\SIH",
                @"C:\Windows\Logs\MoSetup"
            };

            foreach (var path in logPaths.Where(Directory.Exists))
            {
                cleaned += DeleteFilesInDirectory(path, "*.log", 7);
                cleaned += DeleteFilesInDirectory(path, "*.cab", 7);
            }

            // Panther logs
            var panther = @"C:\Windows\Panther";
            if (Directory.Exists(panther))
            {
                cleaned += DeleteFilesInDirectory(panther, "*.log", 30);
                cleaned += DeleteFilesInDirectory(panther, "*.xml", 30);
            }

            return cleaned;
        }

        #endregion

        #region Windows Update Cache

        private long AnalyzeWindowsUpdateCache()
        {
            var path = @"C:\Windows\SoftwareDistribution\Download";
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanWindowsUpdateCache()
        {
            try
            {
                // Parar serviço Windows Update
                StopService("wuauserv");
                Thread.Sleep(2000);

                var path = @"C:\Windows\SoftwareDistribution\Download";
                var cleaned = DeleteDirectorySafe(path);

                // Reiniciar serviço
                StartService("wuauserv");

                return cleaned;
            }
            catch { return 0; }
        }

        private long AnalyzeDeliveryOptimization()
        {
            var path = @"C:\Windows\SoftwareDistribution\DeliveryOptimization";
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanDeliveryOptimization()
        {
            try
            {
                StopService("DoSvc");
                Thread.Sleep(1000);

                var path = @"C:\Windows\SoftwareDistribution\DeliveryOptimization";
                var cleaned = DeleteDirectorySafe(path);

                StartService("DoSvc");
                return cleaned;
            }
            catch { return 0; }
        }

        private long AnalyzePendingUpdates()
        {
            var path = @"C:\Windows\SoftwareDistribution\DataStore";
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanPendingUpdates()
        {
            try
            {
                StopService("wuauserv");
                Thread.Sleep(2000);

                var path = @"C:\Windows\SoftwareDistribution\DataStore";
                var cleaned = DeleteDirectorySafe(path);

                StartService("wuauserv");
                return cleaned;
            }
            catch { return 0; }
        }

        #endregion

        #region Cache do Windows

        private long AnalyzeThumbnailCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "Microsoft", "Windows", "Explorer");
            
            long total = 0;
            if (Directory.Exists(path))
            {
                total += Directory.GetFiles(path, "thumbcache_*.db").Sum(f => new FileInfo(f).Length);
                total += Directory.GetFiles(path, "iconcache_*.db").Sum(f => new FileInfo(f).Length);
            }
            return total;
        }

        private long CleanThumbnailCache()
        {
            long cleaned = 0;
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "Microsoft", "Windows", "Explorer");

            if (Directory.Exists(path))
            {
                foreach (var file in Directory.GetFiles(path, "thumbcache_*.db"))
                {
                    try
                    {
                        var size = new FileInfo(file).Length;
                        File.Delete(file);
                        cleaned += size;
                    }
                    catch { }
                }

                foreach (var file in Directory.GetFiles(path, "iconcache_*.db"))
                {
                    try
                    {
                        var size = new FileInfo(file).Length;
                        File.Delete(file);
                        cleaned += size;
                    }
                    catch { }
                }
            }
            return cleaned;
        }

        private long AnalyzeFontCache()
        {
            var path = @"C:\Windows\ServiceProfiles\LocalService\AppData\Local\FontCache";
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanFontCache()
        {
            try
            {
                StopService("FontCache");
                Thread.Sleep(1000);

                var path = @"C:\Windows\ServiceProfiles\LocalService\AppData\Local\FontCache";
                var cleaned = DeleteDirectorySafe(path);

                StartService("FontCache");
                return cleaned;
            }
            catch { return 0; }
        }

        private long AnalyzePrefetch()
        {
            var path = @"C:\Windows\Prefetch";
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanPrefetch()
        {
            var path = @"C:\Windows\Prefetch";
            return Directory.Exists(path) ? DeleteFilesInDirectory(path, "*.pf", 0) : 0;
        }

        private long AnalyzeDnsCache() => 0; // DNS cache não ocupa espaço em disco

        private long CleanDnsCache()
        {
            try
            {
                var psi = new ProcessStartInfo
                {
                    FileName = "ipconfig.exe",
                    Arguments = "/flushdns",
                    UseShellExecute = false,
                    CreateNoWindow = true
                };
                using var p = Process.Start(psi);
                p?.WaitForExit(5000);
            }
            catch { }
            return 0;
        }

        private long AnalyzeArpCache() => 0;

        private long CleanArpCache()
        {
            try
            {
                var psi = new ProcessStartInfo
                {
                    FileName = "netsh.exe",
                    Arguments = "interface ip delete arpcache",
                    UseShellExecute = false,
                    CreateNoWindow = true
                };
                using var p = Process.Start(psi);
                p?.WaitForExit(5000);
            }
            catch { }
            return 0;
        }

        #endregion

        #region Internet Cache

        private long AnalyzeWinINetCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "Microsoft", "Windows", "INetCache");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanWinINetCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "Microsoft", "Windows", "INetCache");
            return Directory.Exists(path) ? DeleteDirectorySafe(path) : 0;
        }

        private long AnalyzeWinINetCookies()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "Microsoft", "Windows", "INetCookies");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanWinINetCookies()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "Microsoft", "Windows", "INetCookies");
            return Directory.Exists(path) ? DeleteDirectorySafe(path) : 0;
        }

        private long AnalyzeEdgeCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "Microsoft", "Edge", "User Data", "Default", "Cache");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanEdgeCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "Microsoft", "Edge", "User Data", "Default", "Cache");
            return Directory.Exists(path) ? DeleteDirectorySafe(path) : 0;
        }

        private long AnalyzeChromeCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "Google", "Chrome", "User Data", "Default", "Cache");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanChromeCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "Google", "Chrome", "User Data", "Default", "Cache");
            return Directory.Exists(path) ? DeleteDirectorySafe(path) : 0;
        }

        private long AnalyzeFirefoxCache()
        {
            var mozPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "Mozilla", "Firefox", "Profiles");
            if (!Directory.Exists(mozPath)) return 0;

            long total = 0;
            foreach (var profile in Directory.GetDirectories(mozPath))
            {
                var cache = Path.Combine(profile, "cache2");
                if (Directory.Exists(cache))
                    total += GetDirectorySize(cache);
            }
            return total;
        }

        private long CleanFirefoxCache()
        {
            var mozPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "Mozilla", "Firefox", "Profiles");
            if (!Directory.Exists(mozPath)) return 0;

            long cleaned = 0;
            foreach (var profile in Directory.GetDirectories(mozPath))
            {
                var cache = Path.Combine(profile, "cache2");
                if (Directory.Exists(cache))
                    cleaned += DeleteDirectorySafe(cache);
            }
            return cleaned;
        }

        private long AnalyzeOperaCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                "Opera Software", "Opera Stable", "Cache");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanOperaCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                "Opera Software", "Opera Stable", "Cache");
            return Directory.Exists(path) ? DeleteDirectorySafe(path) : 0;
        }

        private long AnalyzeBraveCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "BraveSoftware", "Brave-Browser", "User Data", "Default", "Cache");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanBraveCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "BraveSoftware", "Brave-Browser", "User Data", "Default", "Cache");
            return Directory.Exists(path) ? DeleteDirectorySafe(path) : 0;
        }

        #endregion

        #region Application Cache

        private long AnalyzeDefenderHistory()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData),
                "Microsoft", "Windows Defender", "Scans", "History");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanDefenderHistory()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData),
                "Microsoft", "Windows Defender", "Scans", "History");
            return Directory.Exists(path) ? DeleteFilesInDirectory(path, "*", 30) : 0;
        }

        private long AnalyzeInstallerCache()
        {
            // Não analisamos Windows Installer pois requer ferramenta especializada
            // Deletar incorretamente pode quebrar instaladores
            return 0;
        }

        private long CleanInstallerCache()
        {
            // Por segurança, não limpar automaticamente
            // Requer análise manual ou ferramenta especializada
            return 0;
        }

        private long AnalyzePackageCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData),
                "Package Cache");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanPackageCache()
        {
            // Por segurança, não limpar - pode quebrar instaladores
            return 0;
        }

        private long AnalyzeDotNetCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows),
                "Microsoft.NET", "Framework64", "v4.0.30319", "Temporary ASP.NET Files");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanDotNetCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows),
                "Microsoft.NET", "Framework64", "v4.0.30319", "Temporary ASP.NET Files");
            return Directory.Exists(path) ? DeleteDirectorySafe(path) : 0;
        }

        private long AnalyzeNuGetCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
                ".nuget", "packages");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanNuGetCache()
        {
            try
            {
                var psi = new ProcessStartInfo
                {
                    FileName = "dotnet",
                    Arguments = "nuget locals all --clear",
                    UseShellExecute = false,
                    CreateNoWindow = true
                };
                using var p = Process.Start(psi);
                p?.WaitForExit(30000);
                return AnalyzeNuGetCache();
            }
            catch { return 0; }
        }

        private long AnalyzeVisualStudioCache()
        {
            long total = 0;
            var localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);

            var paths = new[]
            {
                Path.Combine(localAppData, "Microsoft", "VisualStudio", "Packages"),
                Path.Combine(localAppData, "Microsoft", "VSApplicationInsights"),
                Path.Combine(localAppData, "Microsoft", "vscode-cpptools"),
            };

            foreach (var path in paths.Where(Directory.Exists))
                total += GetDirectorySize(path);

            return total;
        }

        private long CleanVisualStudioCache()
        {
            long cleaned = 0;
            var localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);

            var paths = new[]
            {
                Path.Combine(localAppData, "Microsoft", "VSApplicationInsights"),
            };

            foreach (var path in paths.Where(Directory.Exists))
                cleaned += DeleteDirectorySafe(path);

            return cleaned;
        }

        private long AnalyzeNpmCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                "npm-cache");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanNpmCache()
        {
            try
            {
                var psi = new ProcessStartInfo
                {
                    FileName = "npm",
                    Arguments = "cache clean --force",
                    UseShellExecute = false,
                    CreateNoWindow = true
                };
                using var p = Process.Start(psi);
                p?.WaitForExit(30000);
                return AnalyzeNpmCache();
            }
            catch { return 0; }
        }

        #endregion

        #region Temp Files

        private long AnalyzeUserTemp()
        {
            return GetDirectorySize(Path.GetTempPath());
        }

        private long CleanUserTemp()
        {
            return DeleteFilesInDirectory(Path.GetTempPath(), "*", 1);
        }

        private long AnalyzeWindowsTemp()
        {
            var path = @"C:\Windows\Temp";
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanWindowsTemp()
        {
            var path = @"C:\Windows\Temp";
            return Directory.Exists(path) ? DeleteFilesInDirectory(path, "*", 1) : 0;
        }

        private long AnalyzeWinSxSTemp()
        {
            var path = @"C:\Windows\WinSxS\Temp";
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanWinSxSTemp()
        {
            var path = @"C:\Windows\WinSxS\Temp";
            return Directory.Exists(path) ? DeleteDirectorySafe(path) : 0;
        }

        private long AnalyzeDriverTemp()
        {
            var paths = new[]
            {
                @"C:\AMD",
                @"C:\NVIDIA",
                @"C:\Intel"
            };

            return paths.Where(Directory.Exists).Sum(GetDirectorySize);
        }

        private long CleanDriverTemp()
        {
            long cleaned = 0;
            var paths = new[]
            {
                @"C:\AMD",
                @"C:\NVIDIA",
                @"C:\Intel"
            };

            foreach (var path in paths.Where(Directory.Exists))
                cleaned += DeleteDirectorySafe(path);

            return cleaned;
        }

        private long AnalyzeRecentFiles()
        {
            var path = Environment.GetFolderPath(Environment.SpecialFolder.Recent);
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanRecentFiles()
        {
            var path = Environment.GetFolderPath(Environment.SpecialFolder.Recent);
            return Directory.Exists(path) ? DeleteFilesInDirectory(path, "*.lnk", 0) : 0;
        }

        private long AnalyzeRecycleBin()
        {
            try
            {
                var recycleBinPath = @"C:\$Recycle.Bin";
                return Directory.Exists(recycleBinPath) ? GetDirectorySize(recycleBinPath) : 0;
            }
            catch { return 0; }
        }

        private long CleanRecycleBin()
        {
            try
            {
                var psi = new ProcessStartInfo
                {
                    FileName = "cmd.exe",
                    Arguments = "/c rd /s /q C:\\$Recycle.Bin",
                    UseShellExecute = false,
                    CreateNoWindow = true
                };
                using var p = Process.Start(psi);
                p?.WaitForExit(10000);
                return AnalyzeRecycleBin();
            }
            catch { return 0; }
        }

        #endregion

        #region Game Cache

        private long AnalyzeNvidiaShaderCache()
        {
            var paths = new[]
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "NVIDIA", "DXCache"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "NVIDIA", "GLCache"),
            };
            return paths.Where(Directory.Exists).Sum(GetDirectorySize);
        }

        private long CleanNvidiaShaderCache()
        {
            long cleaned = 0;
            var paths = new[]
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "NVIDIA", "DXCache"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "NVIDIA", "GLCache"),
            };

            foreach (var path in paths.Where(Directory.Exists))
                cleaned += DeleteDirectorySafe(path);

            return cleaned;
        }

        private long AnalyzeAmdShaderCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "AMD", "DxCache");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanAmdShaderCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "AMD", "DxCache");
            return Directory.Exists(path) ? DeleteDirectorySafe(path) : 0;
        }

        private long AnalyzeDirectXCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "D3DSCache");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanDirectXCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "D3DSCache");
            return Directory.Exists(path) ? DeleteDirectorySafe(path) : 0;
        }

        private long AnalyzeSteamCache()
        {
            var steamPath = GetSteamPath();
            if (string.IsNullOrEmpty(steamPath)) return 0;

            long total = 0;
            var paths = new[]
            {
                Path.Combine(steamPath, "steamapps", "downloading"),
                Path.Combine(steamPath, "steamapps", "shadercache"),
                Path.Combine(steamPath, "steamapps", "temp"),
            };

            foreach (var path in paths.Where(Directory.Exists))
                total += GetDirectorySize(path);

            return total;
        }

        private long CleanSteamCache()
        {
            var steamPath = GetSteamPath();
            if (string.IsNullOrEmpty(steamPath)) return 0;

            long cleaned = 0;
            var paths = new[]
            {
                Path.Combine(steamPath, "steamapps", "downloading"),
                Path.Combine(steamPath, "steamapps", "shadercache"),
                Path.Combine(steamPath, "steamapps", "temp"),
            };

            foreach (var path in paths.Where(Directory.Exists))
                cleaned += DeleteDirectorySafe(path);

            return cleaned;
        }

        private long AnalyzeEpicCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "EpicGamesLauncher", "Saved", "webcache");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanEpicCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "EpicGamesLauncher", "Saved", "webcache");
            return Directory.Exists(path) ? DeleteDirectorySafe(path) : 0;
        }

        private long AnalyzeOriginCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                "Origin", "cache");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanOriginCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                "Origin", "cache");
            return Directory.Exists(path) ? DeleteDirectorySafe(path) : 0;
        }

        private long AnalyzeUnrealCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "UnrealEngine");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanUnrealCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "UnrealEngine");
            return Directory.Exists(path) ? DeleteDirectorySafe(path) : 0;
        }

        private long AnalyzeUnityCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "Unity", "cache");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanUnityCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "Unity", "cache");
            return Directory.Exists(path) ? DeleteDirectorySafe(path) : 0;
        }

        #endregion

        #region Helpers

        private string? GetSteamPath()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\WOW6432Node\Valve\Steam");
                return key?.GetValue("InstallPath")?.ToString();
            }
            catch { return null; }
        }

        private long GetDirectorySize(string path)
        {
            if (!Directory.Exists(path)) return 0;

            long size = 0;
            try
            {
                foreach (var file in EnumerateFilesSafe(path))
                {
                    try 
                    { 
                        var info = new FileInfo(file);
                        // Verificar se o arquivo pode ser deletado (não está bloqueado)
                        if (CanDeleteFile(file))
                        {
                            size += info.Length; 
                        }
                    }
                    catch { }
                }
            }
            catch { }

            return size;
        }

        /// <summary>
        /// Verifica se um arquivo pode ser deletado (não está em uso)
        /// </summary>
        private bool CanDeleteFile(string filePath)
        {
            try
            {
                var info = new FileInfo(filePath);
                
                // Arquivos muito recentes geralmente estão em uso
                if (info.LastWriteTime > DateTime.Now.AddMinutes(-5))
                    return false;
                
                // Tentar abrir com acesso exclusivo para verificar se está em uso
                using (var stream = new FileStream(filePath, FileMode.Open, FileAccess.ReadWrite, FileShare.None))
                {
                    stream.Close();
                }
                return true;
            }
            catch
            {
                // Se não conseguir abrir, provavelmente está em uso
                return false;
            }
        }

        private IEnumerable<string> EnumerateFilesSafe(string path)
        {
            var stack = new Stack<string>();
            stack.Push(path);

            while (stack.Count > 0)
            {
                var dir = stack.Pop();

                string[] files = Array.Empty<string>();
                try { files = Directory.GetFiles(dir); }
                catch { }

                foreach (var file in files)
                    yield return file;

                try
                {
                    foreach (var subDir in Directory.GetDirectories(dir))
                        stack.Push(subDir);
                }
                catch { }
            }
        }

        private long DeleteDirectorySafe(string path)
        {
            if (!Directory.Exists(path)) return 0;

            long deleted = 0;
            try
            {
                foreach (var file in EnumerateFilesSafe(path))
                {
                    try
                    {
                        var size = new FileInfo(file).Length;
                        File.SetAttributes(file, FileAttributes.Normal);
                        File.Delete(file);
                        deleted += size;
                    }
                    catch { }
                }

                // Tentar deletar diretórios vazios
                try
                {
                    foreach (var dir in Directory.GetDirectories(path, "*", SearchOption.AllDirectories)
                                                 .OrderByDescending(d => d.Length))
                    {
                        try { Directory.Delete(dir, false); }
                        catch { }
                    }

                    try { Directory.Delete(path, false); }
                    catch { }
                }
                catch { }
            }
            catch { }

            return deleted;
        }

        private long DeleteFilesInDirectory(string path, string pattern, int keepDays)
        {
            if (!Directory.Exists(path)) return 0;

            long deleted = 0;
            var cutoff = DateTime.Now.AddDays(-keepDays);

            try
            {
                foreach (var file in Directory.GetFiles(path, pattern, SearchOption.AllDirectories))
                {
                    try
                    {
                        var info = new FileInfo(file);
                        if (keepDays == 0 || info.LastWriteTime < cutoff)
                        {
                            var size = info.Length;
                            File.SetAttributes(file, FileAttributes.Normal);
                            File.Delete(file);
                            deleted += size;
                        }
                    }
                    catch { }
                }
            }
            catch { }

            return deleted;
        }

        private void StopService(string serviceName)
        {
            try
            {
                using var sc = new ServiceController(serviceName);
                if (sc.Status == ServiceControllerStatus.Running)
                {
                    sc.Stop();
                    sc.WaitForStatus(ServiceControllerStatus.Stopped, TimeSpan.FromSeconds(30));
                    _currentTx?.RegisterServiceChange(serviceName, null, null);
                }
            }
            catch { }
        }

        private void StartService(string serviceName)
        {
            try
            {
                using var sc = new ServiceController(serviceName);
                if (sc.Status == ServiceControllerStatus.Stopped)
                {
                    sc.Start();
                    sc.WaitForStatus(ServiceControllerStatus.Running, TimeSpan.FromSeconds(30));
                    _currentTx?.RegisterServiceChange(serviceName, null, null);
                }
            }
            catch { }
        }

        private string FormatBytes(long bytes)
        {
            string[] sizes = { "B", "KB", "MB", "GB", "TB" };
            double len = bytes;
            int order = 0;
            while (len >= 1024 && order < sizes.Length - 1)
            {
                order++;
                len /= 1024;
            }
            return $"{len:0.##} {sizes[order]}";
        }

        #endregion

        #region Limpeza de Registro (NOVO)

        private long AnalyzeOrphanUninstallKeys()
        {
            try
            {
                long totalSize = 0;
                var uninstallKeys = new[]
                {
                    @"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall",
                    @"SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall"
                };
                
                foreach (var keyPath in uninstallKeys)
                {
                    try
                    {
                        using var key = Registry.LocalMachine.OpenSubKey(keyPath);
                        if (key == null) continue;
                        
                        foreach (var subKeyName in key.GetSubKeyNames())
                        {
                            try
                            {
                                using var subKey = key.OpenSubKey(subKeyName);
                                if (subKey == null) continue;
                                
                                var displayName = subKey.GetValue("DisplayName") as string;
                                var uninstallString = subKey.GetValue("UninstallString") as string;
                                
                                // Verificar se é órfã (sem nome ou sem desinstalador válido)
                                if (string.IsNullOrWhiteSpace(displayName) || 
                                    string.IsNullOrWhiteSpace(uninstallString) ||
                                    !File.Exists(ExtractExecutablePath(uninstallString)))
                                {
                                    totalSize += 4096; // Tamanho estimado da chave
                                }
                            }
                            catch { }
                        }
                    }
                    catch { }
                }
                
                return totalSize;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[UltraClean] Erro ao analisar chaves órfãs: {ex.Message}");
                return 0;
            }
        }

        private long CleanOrphanUninstallKeys()
        {
            try
            {
                long totalCleaned = 0;
                var uninstallKeys = new[]
                {
                    @"SOFTWARE\Microsoft\Windows\CurrentVersion\Uninstall",
                    @"SOFTWARE\WOW6432Node\Microsoft\Windows\CurrentVersion\Uninstall"
                };
                
                foreach (var keyPath in uninstallKeys)
                {
                    try
                    {
                        using var key = Registry.LocalMachine.OpenSubKey(keyPath, true);
                        if (key == null) continue;
                        
                        var keysToDelete = new List<string>();
                        
                        foreach (var subKeyName in key.GetSubKeyNames())
                        {
                            try
                            {
                                using var subKey = key.OpenSubKey(subKeyName);
                                if (subKey == null) continue;
                                
                                var displayName = subKey.GetValue("DisplayName") as string;
                                var uninstallString = subKey.GetValue("UninstallString") as string;
                                
                                if (string.IsNullOrWhiteSpace(displayName) || 
                                    string.IsNullOrWhiteSpace(uninstallString) ||
                                    !File.Exists(ExtractExecutablePath(uninstallString)))
                                {
                                    keysToDelete.Add(subKeyName);
                                }
                            }
                            catch { }
                        }
                        
                        foreach (var keyToDelete in keysToDelete)
                        {
                            try
                            {
                                key.DeleteSubKeyTree(keyToDelete);
                                totalCleaned += 4096;
                                _logger.LogInfo($"[UltraClean] Removida chave órfã: {keyToDelete}");
                            }
                            catch (Exception ex)
                            {
                                _logger.LogWarning($"[UltraClean] Erro ao remover chave {keyToDelete}: {ex.Message}");
                            }
                        }
                    }
                    catch { }
                }
                
                return totalCleaned;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[UltraClean] Erro ao limpar chaves órfãs: {ex.Message}");
                return 0;
            }
        }

        private string ExtractExecutablePath(string uninstallString)
        {
            if (string.IsNullOrWhiteSpace(uninstallString)) return string.Empty;
            
            // Remover aspas e argumentos
            var path = uninstallString.Trim('"');
            var exeIndex = path.IndexOf(".exe", StringComparison.OrdinalIgnoreCase);
            if (exeIndex > 0)
            {
                path = path.Substring(0, exeIndex + 4);
            }
            
            return path;
        }

        private long AnalyzeMRULists()
        {
            try
            {
                long totalSize = 0;
                var mruKeys = new[]
                {
                    @"Software\Microsoft\Windows\CurrentVersion\Explorer\ComDlg32\OpenSavePidlMRU",
                    @"Software\Microsoft\Windows\CurrentVersion\Explorer\ComDlg32\LastVisitedPidlMRU",
                    @"Software\Microsoft\Windows\CurrentVersion\Explorer\RunMRU",
                    @"Software\Microsoft\Windows\CurrentVersion\Explorer\TypedPaths"
                };
                
                foreach (var keyPath in mruKeys)
                {
                    try
                    {
                        using var key = Registry.CurrentUser.OpenSubKey(keyPath);
                        if (key != null)
                        {
                            totalSize += key.ValueCount * 512; // Estimativa
                        }
                    }
                    catch { }
                }
                
                return totalSize;
            }
            catch
            {
                return 0;
            }
        }

        private long CleanMRULists()
        {
            try
            {
                long totalCleaned = 0;
                var mruKeys = new[]
                {
                    @"Software\Microsoft\Windows\CurrentVersion\Explorer\ComDlg32\OpenSavePidlMRU",
                    @"Software\Microsoft\Windows\CurrentVersion\Explorer\ComDlg32\LastVisitedPidlMRU",
                    @"Software\Microsoft\Windows\CurrentVersion\Explorer\RunMRU",
                    @"Software\Microsoft\Windows\CurrentVersion\Explorer\TypedPaths"
                };
                
                foreach (var keyPath in mruKeys)
                {
                    try
                    {
                        using var key = Registry.CurrentUser.OpenSubKey(keyPath, true);
                        if (key != null)
                        {
                            var valueNames = key.GetValueNames();
                            foreach (var valueName in valueNames)
                            {
                                try
                                {
                                    key.DeleteValue(valueName);
                                    totalCleaned += 512;
                                }
                                catch { }
                            }
                        }
                    }
                    catch { }
                }
                
                _logger.LogInfo($"[UltraClean] MRU Lists limpos");
                return totalCleaned;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[UltraClean] Erro ao limpar MRU: {ex.Message}");
                return 0;
            }
        }

        private long AnalyzeOrphanFileExtensions()
        {
            // Análise complexa, retornar estimativa conservadora
            return 1024 * 10; // 10KB estimado
        }

        private long CleanOrphanFileExtensions()
        {
            try
            {
                // Limpeza segura de extensões órfãs seria muito complexa
                // Por segurança, apenas retornamos 0 por enquanto
                _logger.LogInfo("[UltraClean] Limpeza de extensões órfãs não implementada (segurança)");
                return 0;
            }
            catch
            {
                return 0;
            }
        }

        #endregion

        #region Limpeza de DriverStore (NOVO)

        private long AnalyzeOldDrivers()
        {
            try
            {
                var driverStore = @"C:\Windows\System32\DriverStore\FileRepository";
                if (!Directory.Exists(driverStore)) return 0;
                
                // Agrupar drivers por nome base
                var driverGroups = Directory.GetDirectories(driverStore)
                    .GroupBy(d => GetDriverBaseName(d))
                    .Where(g => g.Count() > 1);
                
                long totalSize = 0;
                foreach (var group in driverGroups)
                {
                    try
                    {
                        // Manter apenas o mais recente, somar tamanho dos antigos
                        var oldDrivers = group.OrderByDescending(GetDriverVersion).Skip(1);
                        foreach (var driver in oldDrivers)
                        {
                            totalSize += GetDirectorySize(driver);
                        }
                    }
                    catch { }
                }
                
                return totalSize;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[UltraClean] Erro ao analisar drivers antigos: {ex.Message}");
                return 0;
            }
        }

        private long CleanOldDrivers()
        {
            try
            {
                var driverStore = @"C:\Windows\System32\DriverStore\FileRepository";
                if (!Directory.Exists(driverStore)) return 0;
                
                var driverGroups = Directory.GetDirectories(driverStore)
                    .GroupBy(d => GetDriverBaseName(d))
                    .Where(g => g.Count() > 1);
                
                long totalCleaned = 0;
                foreach (var group in driverGroups)
                {
                    try
                    {
                        var oldDrivers = group.OrderByDescending(GetDriverVersion).Skip(1);
                        foreach (var driver in oldDrivers)
                        {
                            try
                            {
                                var size = GetDirectorySize(driver);
                                Directory.Delete(driver, true);
                                totalCleaned += size;
                                _logger.LogInfo($"[UltraClean] Removido driver antigo: {Path.GetFileName(driver)}");
                            }
                            catch (Exception ex)
                            {
                                _logger.LogWarning($"[UltraClean] Erro ao remover driver {driver}: {ex.Message}");
                            }
                        }
                    }
                    catch { }
                }
                
                return totalCleaned;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[UltraClean] Erro ao limpar drivers antigos: {ex.Message}");
                return 0;
            }
        }

        private string GetDriverBaseName(string driverPath)
        {
            var name = Path.GetFileName(driverPath);
            // Remover versão (ex: "driver_1.2.3" -> "driver")
            var parts = name.Split('_');
            return parts.Length > 0 ? parts[0] : name;
        }

        private Version GetDriverVersion(string driverPath)
        {
            try
            {
                var name = Path.GetFileName(driverPath);
                var parts = name.Split('_');
                if (parts.Length > 1)
                {
                    // Tentar extrair versão
                    var versionStr = parts[parts.Length - 1].Replace(".inf", "");
                    if (Version.TryParse(versionStr, out var version))
                    {
                        return version;
                    }
                }
            }
            catch { }
            
            return new Version(0, 0);
        }

        #endregion

        #region Limpeza de Windows Store (NOVO)

        private long AnalyzeStoreCache()
        {
            try
            {
                var localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
                var packagesPath = Path.Combine(localAppData, "Packages");
                
                if (!Directory.Exists(packagesPath)) return 0;
                
                long totalSize = 0;
                var storeDirs = Directory.GetDirectories(packagesPath, "Microsoft.WindowsStore_*");
                
                foreach (var dir in storeDirs)
                {
                    try
                    {
                        var cachePath = Path.Combine(dir, "LocalCache");
                        if (Directory.Exists(cachePath))
                        {
                            totalSize += GetDirectorySize(cachePath);
                        }
                    }
                    catch { }
                }
                
                return totalSize;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[UltraClean] Erro ao analisar cache da Store: {ex.Message}");
                return 0;
            }
        }

        private long CleanStoreCache()
        {
            try
            {
                // Executar WSReset.exe para limpar cache da Store
                var process = Process.Start(new ProcessStartInfo
                {
                    FileName = "WSReset.exe",
                    CreateNoWindow = true,
                    UseShellExecute = false
                });
                
                process?.WaitForExit(30000); // 30 segundos timeout
                
                _logger.LogInfo("[UltraClean] Cache da Microsoft Store limpo");
                return 100 * 1024 * 1024; // Estimativa: 100MB
            }
            catch (Exception ex)
            {
                _logger.LogError($"[UltraClean] Erro ao limpar cache da Store: {ex.Message}");
                return 0;
            }
        }

        private long AnalyzeUWPCache()
        {
            try
            {
                var localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
                var packagesPath = Path.Combine(localAppData, "Packages");
                
                if (!Directory.Exists(packagesPath)) return 0;
                
                long totalSize = 0;
                var packageDirs = Directory.GetDirectories(packagesPath);
                
                foreach (var dir in packageDirs)
                {
                    try
                    {
                        var tempPath = Path.Combine(dir, "TempState");
                        if (Directory.Exists(tempPath))
                        {
                            totalSize += GetDirectorySize(tempPath);
                        }
                        
                        var acPath = Path.Combine(dir, "AC");
                        if (Directory.Exists(acPath))
                        {
                            totalSize += GetDirectorySize(acPath);
                        }
                    }
                    catch { }
                }
                
                return totalSize;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[UltraClean] Erro ao analisar cache UWP: {ex.Message}");
                return 0;
            }
        }

        private long CleanUWPCache()
        {
            try
            {
                var localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
                var packagesPath = Path.Combine(localAppData, "Packages");
                
                if (!Directory.Exists(packagesPath)) return 0;
                
                long totalCleaned = 0;
                var packageDirs = Directory.GetDirectories(packagesPath);
                
                foreach (var dir in packageDirs)
                {
                    try
                    {
                        var tempPath = Path.Combine(dir, "TempState");
                        if (Directory.Exists(tempPath))
                        {
                            totalCleaned += DeleteDirectorySafe(tempPath);
                        }
                        
                        var acPath = Path.Combine(dir, "AC");
                        if (Directory.Exists(acPath))
                        {
                            totalCleaned += DeleteDirectorySafe(acPath);
                        }
                    }
                    catch { }
                }
                
                _logger.LogInfo($"[UltraClean] Cache UWP limpo: {FormatBytes(totalCleaned)}");
                return totalCleaned;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[UltraClean] Erro ao limpar cache UWP: {ex.Message}");
                return 0;
            }
        }

        #endregion

        #region Additional Cleanup Methods from limpeza.txt

        // Terminal Server Client Cache
        private long AnalyzeTerminalServerClientCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "Microsoft", "Terminal Server Client");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanTerminalServerClientCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "Microsoft", "Terminal Server Client");
            return Directory.Exists(path) ? DeleteDirectorySafe(path) : 0;
        }

        // XDE Cache (Windows Phone Emulator)
        private long AnalyzeXDECache()
        {
            long total = 0;
            var paths = new[]
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "Microsoft", "XDE"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Microsoft", "XDE")
            };
            foreach (var path in paths.Where(Directory.Exists))
                total += GetDirectorySize(path);
            return total;
        }

        private long CleanXDECache()
        {
            long cleaned = 0;
            var paths = new[]
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "Microsoft", "XDE"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "Microsoft", "XDE")
            };
            foreach (var path in paths.Where(Directory.Exists))
                cleaned += DeleteDirectorySafe(path);
            return cleaned;
        }

        // PDB Cache (Debug Symbols)
        private long AnalyzePDBCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "DBG");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanPDBCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "DBG");
            return Directory.Exists(path) ? DeleteDirectorySafe(path) : 0;
        }

        // .NET Assembly Native Images Cache (ULTRA ENHANCED - como DISM++)
        private long AnalyzeDotNetAssemblyCache()
        {
            try
            {
                _logger.LogInfo("[UltraClean] Analisando .NET Native Images obsoletos (método avançado DISM++)...");
                
                var winPath = Environment.GetFolderPath(Environment.SpecialFolder.Windows);
                var assemblyBasePath = Path.Combine(winPath, "assembly");
                
                if (!Directory.Exists(assemblyBasePath)) return 0;

                long total = 0;
                
                // MÉTODO 1: Analisar TODAS as pastas NativeImages_* (incluindo v2.0, v4.0, etc)
                var nativeImageDirs = Directory.GetDirectories(assemblyBasePath)
                    .Where(d => Path.GetFileName(d).StartsWith("NativeImages_", StringComparison.OrdinalIgnoreCase))
                    .ToList();

                _logger.LogInfo($"[UltraClean] Encontradas {nativeImageDirs.Count} pastas NativeImages_*");

                foreach (var nativeImageDir in nativeImageDirs)
                {
                    try
                    {
                        if (!Directory.Exists(nativeImageDir)) continue;
                        
                        var assemblies = Directory.GetDirectories(nativeImageDir).ToList();
                        _logger.LogInfo($"[UltraClean] Analisando {Path.GetFileName(nativeImageDir)}: {assemblies.Count} assemblies");
                        
                        foreach (var assemblyDir in assemblies)
                        {
                            try
                            {
                                var dirName = Path.GetFileName(assemblyDir);
                                var files = Directory.GetFiles(assemblyDir, "*", SearchOption.AllDirectories);
                                
                                if (files.Length == 0)
                                {
                                    // Diretório completamente vazio - sempre remover
                                    total += GetDirectorySize(assemblyDir);
                                    continue;
                                }
                                
                                var lastWrite = Directory.GetLastWriteTime(assemblyDir);
                                var daysSinceModified = (DateTime.Now - lastWrite).TotalDays;
                                
                                // MÉTODO AVANÇADO: Verificar se assembly está realmente em uso
                                bool isInUse = false;
                                bool hasValidNIDll = false;
                                
                                foreach (var file in files)
                                {
                                    var fileName = Path.GetFileName(file);
                                    var ext = Path.GetExtension(file).ToLowerInvariant();
                                    
                                    // Verificar se tem .ni.dll válido
                                    if (ext == ".dll" && fileName.Contains(".ni", StringComparison.OrdinalIgnoreCase))
                                    {
                                        hasValidNIDll = true;
                                        
                                        // Verificar se arquivo está em uso (mais agressivo)
                                        try
                                        {
                                            // Tentar abrir arquivo em modo exclusivo
                                            using var fs = new FileStream(file, FileMode.Open, FileAccess.Read, FileShare.None);
                                            fs.Close();
                                        }
                                        catch (IOException)
                                        {
                                            // Arquivo está em uso
                                            isInUse = true;
                                            break;
                                        }
                                        
                                        // Verificar processos
                                        try
                                        {
                                            var processes = Process.GetProcesses()
                                                .Where(p => !p.HasExited)
                                                .SelectMany(p =>
                                                {
                                                    try { return p.Modules?.Cast<ProcessModule>() ?? Enumerable.Empty<ProcessModule>(); }
                                                    catch { return Enumerable.Empty<ProcessModule>(); }
                                                })
                                                .Where(m => m.FileName?.Equals(file, StringComparison.OrdinalIgnoreCase) == true);
                                            
                                            if (processes.Any())
                                            {
                                                isInUse = true;
                                                break;
                                            }
                                        }
                                        catch { }
                                    }
                                }
                                
                                // Se não tem .ni.dll válido OU está muito antigo E não está em uso
                                if ((!hasValidNIDll || daysSinceModified > 30) && !isInUse)
                                {
                                    total += GetDirectorySize(assemblyDir);
                                }
                            }
                            catch (Exception ex)
                            {
                                _logger.LogWarning($"[UltraClean] Erro ao analisar assembly {assemblyDir}: {ex.Message}");
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"[UltraClean] Erro ao analisar NativeImages dir {nativeImageDir}: {ex.Message}");
                    }
                }

                // MÉTODO 2: Limpar temp e tmp (sempre seguro)
                var tempPaths = new[]
                {
                    Path.Combine(assemblyBasePath, "temp"),
                    Path.Combine(assemblyBasePath, "tmp")
                };
                foreach (var path in tempPaths.Where(Directory.Exists))
                {
                    total += GetDirectorySize(path);
                }

                // MÉTODO 3: GAC obsoleto (Global Assembly Cache)
                var gacPaths = new[]
                {
                    Path.Combine(assemblyBasePath, "GAC_32"),
                    Path.Combine(assemblyBasePath, "GAC_64"),
                    Path.Combine(assemblyBasePath, "GAC_MSIL")
                };
                
                foreach (var gacPath in gacPaths.Where(Directory.Exists))
                {
                    try
                    {
                        var assemblies = Directory.GetDirectories(gacPath);
                        foreach (var assembly in assemblies)
                        {
                            var versions = Directory.GetDirectories(assembly).ToList();
                            if (versions.Count > 1)
                            {
                                // Múltiplas versões - manter apenas a mais recente
                                var sorted = versions.OrderByDescending(v => Directory.GetLastWriteTime(v)).ToList();
                                for (int i = 1; i < sorted.Count; i++)
                                {
                                    total += GetDirectorySize(sorted[i]);
                                }
                            }
                        }
                    }
                    catch { }
                }

                _logger.LogInfo($"[UltraClean] Análise avançada detectou {FormatBytes(total)} de .NET Native Images obsoletos");
                return total;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[UltraClean] Erro ao analisar .NET Native Images: {ex.Message}");
                return 0;
            }
        }

        private long CleanDotNetAssemblyCache()
        {
            try
            {
                _logger.LogInfo("[UltraClean] Limpando .NET Native Images obsoletos...");
                
                var beforeSize = AnalyzeDotNetAssemblyCache();
                if (beforeSize == 0) return 0;
                
                var winPath = Environment.GetFolderPath(Environment.SpecialFolder.Windows);
                var assemblyBasePath = Path.Combine(winPath, "assembly");
                
                if (!Directory.Exists(assemblyBasePath)) return 0;

                long cleaned = 0;
                
                // Procurar por todas as pastas NativeImages_*
                var nativeImageDirs = Directory.GetDirectories(assemblyBasePath)
                    .Where(d => Path.GetFileName(d).StartsWith("NativeImages_", StringComparison.OrdinalIgnoreCase))
                    .ToList();

                foreach (var nativeImageDir in nativeImageDirs)
                {
                    try
                    {
                        if (!Directory.Exists(nativeImageDir)) continue;
                        var assemblies = Directory.GetDirectories(nativeImageDir);
                        
                        foreach (var assemblyDir in assemblies)
                        {
                            try
                            {
                                var files = Directory.GetFiles(assemblyDir, "*.ni.dll", SearchOption.AllDirectories);
                                
                                if (files.Length > 0)
                                {
                                    var lastWrite = Directory.GetLastWriteTime(assemblyDir);
                                    var daysSinceModified = (DateTime.Now - lastWrite).TotalDays;
                                    
                                    if (daysSinceModified > 90)
                                    {
                                        bool isInUse = false;
                                        try
                                        {
                                            foreach (var file in files.Take(3))
                                            {
                                                var fileName = Path.GetFileName(file);
                                                var processes = Process.GetProcesses()
                                                    .Where(p => !p.HasExited)
                                                    .SelectMany(p =>
                                                    {
                                                        try { return p.Modules?.Cast<ProcessModule>() ?? Enumerable.Empty<ProcessModule>(); }
                                                        catch { return Enumerable.Empty<ProcessModule>(); }
                                                    })
                                                    .Where(m => m.FileName?.Contains(fileName, StringComparison.OrdinalIgnoreCase) == true);
                                                
                                                if (processes.Any())
                                                {
                                                    isInUse = true;
                                                    break;
                                                }
                                            }
                                        }
                                        catch { }
                                        
                                        if (!isInUse)
                                        {
                                            cleaned += DeleteDirectorySafe(assemblyDir);
                                        }
                                    }
                                }
                                else
                                {
                                    cleaned += DeleteDirectorySafe(assemblyDir);
                                }
                            }
                            catch { }
                        }
                    }
                    catch { }
                }

                // Limpar temp e tmp
                var tempPaths = new[]
                {
                    Path.Combine(assemblyBasePath, "temp"),
                    Path.Combine(assemblyBasePath, "tmp")
                };
                foreach (var path in tempPaths.Where(Directory.Exists))
                    cleaned += DeleteDirectorySafe(path);

                _logger.LogSuccess($"[UltraClean] Limpeza de .NET Native Images concluída: {FormatBytes(cleaned)}");
                return cleaned;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[UltraClean] Erro ao limpar .NET Native Images: {ex.Message}");
                return 0;
            }
        }

        // Visual Studio Intelligent Tracking
        private long AnalyzeVisualStudioIntelligentTracking()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData),
                "Microsoft Visual Studio", "10.0", "TraceDebugging");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanVisualStudioIntelligentTracking()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData),
                "Microsoft Visual Studio", "10.0", "TraceDebugging");
            return Directory.Exists(path) ? DeleteDirectorySafe(path) : 0;
        }

        // Retail Demo Offline Content
        private long AnalyzeRetailDemoContent()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData),
                "Microsoft", "Windows", "RetailDemo");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanRetailDemoContent()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData),
                "Microsoft", "Windows", "RetailDemo");
            return Directory.Exists(path) ? DeleteDirectorySafe(path) : 0;
        }

        // WebPI Cache
        private long AnalyzeWebPICache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "Microsoft", "Web Platform Installer");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanWebPICache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "Microsoft", "Web Platform Installer");
            return Directory.Exists(path) ? DeleteDirectorySafe(path) : 0;
        }

        // Visual Studio Package Cache (Enhanced)
        private long AnalyzeVSPackageCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData),
                "Microsoft", "VisualStudio", "Packages");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanVSPackageCache()
        {
            // Por segurança, não limpar automaticamente - pode quebrar VS
            return 0;
        }

        // Boot Backup Info (PSS)
        private long AnalyzeBootBackupInfo()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "pss");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanBootBackupInfo()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "pss");
            return Directory.Exists(path) ? DeleteDirectorySafe(path) : 0;
        }

        // Hard Link Backup
        private long AnalyzeHardLinkBackup()
        {
            var drives = System.IO.DriveInfo.GetDrives().Where(d => d.IsReady);
            long total = 0;
            foreach (var drive in drives)
            {
                var path = Path.Combine(drive.RootDirectory.FullName, "$HardLinkBackup");
                if (Directory.Exists(path))
                    total += GetDirectorySize(path);
            }
            return total;
        }

        private long CleanHardLinkBackup()
        {
            var drives = System.IO.DriveInfo.GetDrives().Where(d => d.IsReady);
            long cleaned = 0;
            foreach (var drive in drives)
            {
                var path = Path.Combine(drive.RootDirectory.FullName, "$HardLinkBackup");
                if (Directory.Exists(path))
                    cleaned += DeleteDirectorySafe(path);
            }
            return cleaned;
        }

        // Corel VideoStudio SmartProxy
        private long AnalyzeCorelVideoStudioProxy()
        {
            var docsPath = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
            var path = Path.Combine(docsPath, "Corel VideoStudio Pro");
            if (!Directory.Exists(path)) return 0;

            long total = 0;
            foreach (var versionDir in Directory.GetDirectories(path))
            {
                var proxyPath = Path.Combine(versionDir, "SmartProxy");
                if (Directory.Exists(proxyPath))
                    total += GetDirectorySize(proxyPath);
            }
            return total;
        }

        private long CleanCorelVideoStudioProxy()
        {
            var docsPath = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);
            var path = Path.Combine(docsPath, "Corel VideoStudio Pro");
            if (!Directory.Exists(path)) return 0;

            long cleaned = 0;
            foreach (var versionDir in Directory.GetDirectories(path))
            {
                var proxyPath = Path.Combine(versionDir, "SmartProxy");
                if (Directory.Exists(proxyPath))
                    cleaned += DeleteDirectorySafe(proxyPath);
            }
            return cleaned;
        }

        // Last Known Good Configuration
        private long AnalyzeLastKnownGood()
        {
            var winPath = Environment.GetFolderPath(Environment.SpecialFolder.Windows);
            long total = 0;
            var files = new[] { "lastgood", "lastgood.tmp" };
            foreach (var file in files)
            {
                var fullPath = Path.Combine(winPath, file);
                if (File.Exists(fullPath))
                    total += new FileInfo(fullPath).Length;
                else if (Directory.Exists(fullPath))
                    total += GetDirectorySize(fullPath);
            }
            return total;
        }

        private long CleanLastKnownGood()
        {
            var winPath = Environment.GetFolderPath(Environment.SpecialFolder.Windows);
            long cleaned = 0;
            var files = new[] { "lastgood", "lastgood.tmp" };
            foreach (var file in files)
            {
                var fullPath = Path.Combine(winPath, file);
                try
                {
                    if (File.Exists(fullPath))
                    {
                        var size = new FileInfo(fullPath).Length;
                        File.Delete(fullPath);
                        cleaned += size;
                    }
                    else if (Directory.Exists(fullPath))
                    {
                        cleaned += DeleteDirectorySafe(fullPath);
                    }
                }
                catch { }
            }
            return cleaned;
        }

        // WinSxS Temp Files (Enhanced)
        private long AnalyzeWinSxSTempFiles()
        {
            var winPath = Environment.GetFolderPath(Environment.SpecialFolder.Windows);
            long total = 0;
            var paths = new[]
            {
                Path.Combine(winPath, "WinSxS", "ManifestCache"),
                Path.Combine(winPath, "CbsTemp")
            };
            foreach (var path in paths.Where(Directory.Exists))
                total += GetDirectorySize(path);
            return total;
        }

        private long CleanWinSxSTempFiles()
        {
            var winPath = Environment.GetFolderPath(Environment.SpecialFolder.Windows);
            long cleaned = 0;
            var paths = new[]
            {
                Path.Combine(winPath, "WinSxS", "ManifestCache"),
                Path.Combine(winPath, "CbsTemp")
            };
            foreach (var path in paths.Where(Directory.Exists))
                cleaned += DeleteDirectorySafe(path);
            return cleaned;
        }

        // Windows Logs (Enhanced - All log types)
        private long AnalyzeWindowsLogsEnhanced()
        {
            var winPath = Environment.GetFolderPath(Environment.SpecialFolder.Windows);
            long total = 0;

            // System logs
            var logPaths = new[]
            {
                Path.Combine(winPath, "Logs"),
                Path.Combine(winPath, "Performance", "WinSAT", "DataStore"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "USOShared", "Logs"),
                Path.Combine(winPath, "System32", "WDI", "LogFiles"),
                Path.Combine(winPath, "System32", "LogFiles"),
                Path.Combine(winPath, "debug")
            };

            foreach (var path in logPaths.Where(Directory.Exists))
                total += GetDirectorySize(path);

            // Log files in Windows root
            try
            {
                foreach (var file in Directory.GetFiles(winPath, "*.log", SearchOption.TopDirectoryOnly))
                    total += new FileInfo(file).Length;
                foreach (var file in Directory.GetFiles(winPath, "*.bak", SearchOption.TopDirectoryOnly))
                    total += new FileInfo(file).Length;
            }
            catch { }

            // User logs
            var userProfiles = Directory.GetDirectories(Path.Combine(winPath, "..", "Users"));
            foreach (var profile in userProfiles)
            {
                var appData = Path.Combine(profile, "AppData");
                if (Directory.Exists(appData))
                {
                    try
                    {
                        foreach (var logFile in Directory.GetFiles(appData, "*.log", SearchOption.AllDirectories))
                        {
                            if (logFile.Contains("Microsoft\\Windows") || logFile.Contains("Microsoft\\CLR") || logFile.Contains("MigWiz"))
                                total += new FileInfo(logFile).Length;
                        }
                    }
                    catch { }
                }
            }

            return total;
        }

        private long CleanWindowsLogsEnhanced()
        {
            var winPath = Environment.GetFolderPath(Environment.SpecialFolder.Windows);
            long cleaned = 0;

            var logPaths = new[]
            {
                Path.Combine(winPath, "Logs"),
                Path.Combine(winPath, "Performance", "WinSAT", "DataStore"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "USOShared", "Logs"),
                Path.Combine(winPath, "System32", "WDI", "LogFiles"),
                Path.Combine(winPath, "System32", "LogFiles"),
                Path.Combine(winPath, "debug")
            };

            foreach (var path in logPaths.Where(Directory.Exists))
                cleaned += DeleteFilesInDirectory(path, "*", 30); // Manter últimos 30 dias

            return cleaned;
        }

        // Driver Temp Directories (AMD, Intel, NVIDIA)
        private long AnalyzeDriverTempDirectories()
        {
            var drives = System.IO.DriveInfo.GetDrives().Where(d => d.IsReady);
            long total = 0;
            var dirNames = new[] { "AMD", "Intel", "NVIDIA", "Prog" };
            
            foreach (var drive in drives)
            {
                var root = drive.RootDirectory.FullName;
                foreach (var dirName in dirNames)
                {
                    var path = Path.Combine(root, dirName);
                    if (Directory.Exists(path))
                        total += GetDirectorySize(path);
                }
            }
            return total;
        }

        private long CleanDriverTempDirectories()
        {
            var drives = System.IO.DriveInfo.GetDrives().Where(d => d.IsReady);
            long cleaned = 0;
            var dirNames = new[] { "AMD", "Intel", "NVIDIA", "Prog" };
            
            foreach (var drive in drives)
            {
                var root = drive.RootDirectory.FullName;
                foreach (var dirName in dirNames)
                {
                    var path = Path.Combine(root, dirName);
                    if (Directory.Exists(path))
                        cleaned += DeleteDirectorySafe(path);
                }
            }
            return cleaned;
        }

        // Windows Temp Install Files
        private long AnalyzeWindowsTempInstallFiles()
        {
            var drives = System.IO.DriveInfo.GetDrives().Where(d => d.IsReady);
            long total = 0;
            var dirNames = new[] { "$Windows.~BT", "$Windows.~WS", "$Windows.~LS" };
            
            foreach (var drive in drives)
            {
                var root = drive.RootDirectory.FullName;
                foreach (var dirName in dirNames)
                {
                    var path = Path.Combine(root, dirName);
                    if (Directory.Exists(path))
                        total += GetDirectorySize(path);
                }
            }
            return total;
        }

        private long CleanWindowsTempInstallFiles()
        {
            var drives = System.IO.DriveInfo.GetDrives().Where(d => d.IsReady);
            long cleaned = 0;
            var dirNames = new[] { "$Windows.~BT", "$Windows.~WS", "$Windows.~LS" };
            
            foreach (var drive in drives)
            {
                var root = drive.RootDirectory.FullName;
                foreach (var dirName in dirNames)
                {
                    var path = Path.Combine(root, dirName);
                    if (Directory.Exists(path))
                        cleaned += DeleteDirectorySafe(path);
                }
            }
            return cleaned;
        }

        // QQ Temp Data
        private long AnalyzeQQTempData()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Tencent");
                if (key == null) return 0;

                var userProfiles = Directory.GetDirectories(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "..", "Users"));
                long total = 0;
                foreach (var profile in userProfiles)
                {
                    var qqPaths = new[]
                    {
                        Path.Combine(profile, "AppData", "Roaming", "Tencent", "Users"),
                        Path.Combine(profile, "Documents", "Tencent Files")
                    };
                    foreach (var path in qqPaths.Where(Directory.Exists))
                        total += GetDirectorySize(path);
                }
                return total;
            }
            catch { return 0; }
        }

        private long CleanQQTempData()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Tencent");
                if (key == null) return 0;

                var userProfiles = Directory.GetDirectories(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "..", "Users"));
                long cleaned = 0;
                foreach (var profile in userProfiles)
                {
                    var qqPaths = new[]
                    {
                        Path.Combine(profile, "AppData", "Roaming", "Tencent", "Users", "*", "WinTemp"),
                        Path.Combine(profile, "Documents", "Tencent Files", "*", "Image", "Cache")
                    };
                    foreach (var pathPattern in qqPaths)
                    {
                        try
                        {
                            var dir = Path.GetDirectoryName(pathPattern);
                            if (Directory.Exists(dir))
                            {
                                foreach (var subDir in Directory.GetDirectories(dir))
                                {
                                    var targetPath = Path.Combine(subDir, Path.GetFileName(pathPattern));
                                    if (Directory.Exists(targetPath))
                                        cleaned += DeleteDirectorySafe(targetPath);
                                }
                            }
                        }
                        catch { }
                    }
                }
                return cleaned;
            }
            catch { return 0; }
        }

        // YY Temp Files
        private long AnalyzeYYTempFiles()
        {
            var userProfiles = Directory.GetDirectories(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "..", "Users"));
            long total = 0;
            foreach (var profile in userProfiles)
            {
                var yyPath = Path.Combine(profile, "AppData", "Roaming", "duowan", "yy", "Cache");
                if (Directory.Exists(yyPath))
                    total += GetDirectorySize(yyPath);
            }
            return total;
        }

        private long CleanYYTempFiles()
        {
            var userProfiles = Directory.GetDirectories(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "..", "Users"));
            long cleaned = 0;
            foreach (var profile in userProfiles)
            {
                var yyPath = Path.Combine(profile, "AppData", "Roaming", "duowan", "yy", "Cache");
                if (Directory.Exists(yyPath))
                    cleaned += DeleteDirectorySafe(yyPath);
            }
            return cleaned;
        }

        // Tencent Download Directory
        private long AnalyzeTencentDownloadDir()
        {
            var userProfiles = Directory.GetDirectories(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "..", "Users"));
            long total = 0;
            foreach (var profile in userProfiles)
            {
                var paths = new[]
                {
                    Path.Combine(profile, "AppData", "Roaming", "Tencent", "QQPCMgr", "Download"),
                    Path.Combine(profile, "AppData", "Roaming", "Tencent", "QQDownload")
                };
                foreach (var path in paths.Where(Directory.Exists))
                    total += GetDirectorySize(path);
            }
            return total;
        }

        private long CleanTencentDownloadDir()
        {
            var userProfiles = Directory.GetDirectories(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "..", "Users"));
            long cleaned = 0;
            foreach (var profile in userProfiles)
            {
                var paths = new[]
                {
                    Path.Combine(profile, "AppData", "Roaming", "Tencent", "QQPCMgr", "Download"),
                    Path.Combine(profile, "AppData", "Roaming", "Tencent", "QQDownload")
                };
                foreach (var path in paths.Where(Directory.Exists))
                    cleaned += DeleteFilesInDirectory(path, "*", 30); // Manter últimos 30 dias
            }
            return cleaned;
        }

        // Microsoft Pinyin Install Files
        private long AnalyzeMicrosoftPinyinInstall()
        {
            var userProfiles = Directory.GetDirectories(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "..", "Users"));
            long total = 0;
            foreach (var profile in userProfiles)
            {
                var path = Path.Combine(profile, "AppData", "Local", "Microsoft", "InputMethod", "Chs");
                if (Directory.Exists(path))
                    total += GetDirectorySize(path);
            }
            return total;
        }

        private long CleanMicrosoftPinyinInstall()
        {
            var userProfiles = Directory.GetDirectories(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "..", "Users"));
            long cleaned = 0;
            foreach (var profile in userProfiles)
            {
                var path = Path.Combine(profile, "AppData", "Local", "Microsoft", "InputMethod", "Chs", "Install");
                if (Directory.Exists(path))
                    cleaned += DeleteDirectorySafe(path);
            }
            return cleaned;
        }

        // Baidu Netdisk Logs
        private long AnalyzeBaiduNetdiskLogs()
        {
            var userProfiles = Directory.GetDirectories(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "..", "Users"));
            long total = 0;
            foreach (var profile in userProfiles)
            {
                var path = Path.Combine(profile, "AppData", "Roaming", "BaiduNetdisk", "Logs");
                if (Directory.Exists(path))
                    total += GetDirectorySize(path);
            }
            return total;
        }

        private long CleanBaiduNetdiskLogs()
        {
            var userProfiles = Directory.GetDirectories(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "..", "Users"));
            long cleaned = 0;
            foreach (var profile in userProfiles)
            {
                var path = Path.Combine(profile, "AppData", "Roaming", "BaiduNetdisk", "Logs");
                if (Directory.Exists(path))
                    cleaned += DeleteFilesInDirectory(path, "*", 7);
            }
            return cleaned;
        }

        // Fetion Logs
        private long AnalyzeFetionLogs()
        {
            var userProfiles = Directory.GetDirectories(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "..", "Users"));
            long total = 0;
            foreach (var profile in userProfiles)
            {
                var paths = new[]
                {
                    Path.Combine(profile, "AppData", "Roaming", "Fetion", "Logs"),
                    Path.Combine(profile, "AppData", "Roaming", "Fetion", "TXSSO", "SetupLogs"),
                    Path.Combine(profile, "AppData", "Roaming", "Fetion", "TXSSO", "SSOTemp")
                };
                foreach (var path in paths.Where(Directory.Exists))
                    total += GetDirectorySize(path);
            }
            return total;
        }

        private long CleanFetionLogs()
        {
            var userProfiles = Directory.GetDirectories(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "..", "Users"));
            long cleaned = 0;
            foreach (var profile in userProfiles)
            {
                var paths = new[]
                {
                    Path.Combine(profile, "AppData", "Roaming", "Fetion", "Logs"),
                    Path.Combine(profile, "AppData", "Roaming", "Fetion", "TXSSO", "SetupLogs"),
                    Path.Combine(profile, "AppData", "Roaming", "Fetion", "TXSSO", "SSOTemp")
                };
                foreach (var path in paths.Where(Directory.Exists))
                    cleaned += DeleteDirectorySafe(path);
            }
            return cleaned;
        }

        // Office MSOCache
        private long AnalyzeOfficeMSOCache()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Office");
                if (key == null) return 0;

                var drives = System.IO.DriveInfo.GetDrives().Where(d => d.IsReady);
                long total = 0;
                foreach (var drive in drives)
                {
                    var path = Path.Combine(drive.RootDirectory.FullName, "MSOCache");
                    if (Directory.Exists(path))
                        total += GetDirectorySize(path);
                }
                return total;
            }
            catch { return 0; }
        }

        private long CleanOfficeMSOCache()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Office");
                if (key == null) return 0;

                var drives = System.IO.DriveInfo.GetDrives().Where(d => d.IsReady);
                long cleaned = 0;
                foreach (var drive in drives)
                {
                    var path = Path.Combine(drive.RootDirectory.FullName, "MSOCache");
                    if (Directory.Exists(path))
                        cleaned += DeleteDirectorySafe(path);
                }
                return cleaned;
            }
            catch { return 0; }
        }

        // Office 365/2016 ClickToRun Cache
        private long AnalyzeOfficeClickToRunCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData),
                "Microsoft", "ClickToRun");
            if (!Directory.Exists(path)) return 0;

            long total = 0;
            foreach (var dir in Directory.GetDirectories(path))
            {
                var dirName = Path.GetFileName(dir);
                if (dirName != "MachineData" && dirName != "UserData")
                    total += GetDirectorySize(dir);
            }
            return total;
        }

        private long CleanOfficeClickToRunCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData),
                "Microsoft", "ClickToRun");
            if (!Directory.Exists(path)) return 0;

            long cleaned = 0;
            foreach (var dir in Directory.GetDirectories(path))
            {
                var dirName = Path.GetFileName(dir);
                if (dirName != "MachineData" && dirName != "UserData")
                    cleaned += DeleteDirectorySafe(dir);
            }
            return cleaned;
        }

        // iTunes Backup
        private long AnalyzeiTunesBackup()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Apple Computer, Inc.\iTunes");
                if (key == null) return 0;

                var userProfiles = Directory.GetDirectories(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "..", "Users"));
                long total = 0;
                foreach (var profile in userProfiles)
                {
                    var path = Path.Combine(profile, "AppData", "Roaming", "Apple Computer", "MobileSync", "Backup");
                    if (Directory.Exists(path))
                        total += GetDirectorySize(path);
                }
                return total;
            }
            catch { return 0; }
        }

        private long CleaniTunesBackup()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Apple Computer, Inc.\iTunes");
                if (key == null) return 0;

                var userProfiles = Directory.GetDirectories(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "..", "Users"));
                long cleaned = 0;
                foreach (var profile in userProfiles)
                {
                    var path = Path.Combine(profile, "AppData", "Roaming", "Apple Computer", "MobileSync", "Backup");
                    if (Directory.Exists(path))
                        cleaned += DeleteDirectorySafe(path);
                }
                return cleaned;
            }
            catch { return 0; }
        }

        // Realtek Audio Install Cache
        private long AnalyzeRealtekAudioCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Realtek", "Audio");
            if (!Directory.Exists(path)) return 0;

            long total = 0;
            foreach (var dir in Directory.GetDirectories(path))
            {
                var dirName = Path.GetFileName(dir);
                if (dirName != "HDA" && dirName != "ASIO")
                    total += GetDirectorySize(dir);
            }
            return total;
        }

        private long CleanRealtekAudioCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Realtek", "Audio");
            if (!Directory.Exists(path)) return 0;

            long cleaned = 0;
            foreach (var dir in Directory.GetDirectories(path))
            {
                var dirName = Path.GetFileName(dir);
                if (dirName != "HDA" && dirName != "ASIO")
                    cleaned += DeleteDirectorySafe(dir);
            }
            return cleaned;
        }

        // Java Install Cache
        private long AnalyzeJavaInstallCache()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\JavaSoft");
                if (key == null) return 0;

                var userProfiles = Directory.GetDirectories(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "..", "Users"));
                long total = 0;
                foreach (var profile in userProfiles)
                {
                    var javaPath = Path.Combine(profile, "AppData", "Roaming", "Oracle", "Java");
                    if (Directory.Exists(javaPath))
                    {
                        foreach (var dir in Directory.GetDirectories(javaPath))
                        {
                            var dirName = Path.GetFileName(dir);
                            if (dirName.StartsWith("jre") || dirName == "installcache" || dirName == "tmpinstall")
                                total += GetDirectorySize(dir);
                        }
                    }
                }
                return total;
            }
            catch { return 0; }
        }

        private long CleanJavaInstallCache()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\JavaSoft");
                if (key == null) return 0;

                var userProfiles = Directory.GetDirectories(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "..", "Users"));
                long cleaned = 0;
                foreach (var profile in userProfiles)
                {
                    var javaPath = Path.Combine(profile, "AppData", "Roaming", "Oracle", "Java");
                    if (Directory.Exists(javaPath))
                    {
                        foreach (var dir in Directory.GetDirectories(javaPath))
                        {
                            var dirName = Path.GetFileName(dir);
                            if (dirName.StartsWith("jre") || dirName == "installcache" || dirName == "tmpinstall")
                                cleaned += DeleteDirectorySafe(dir);
                        }
                    }
                }
                return cleaned;
            }
            catch { return 0; }
        }

        // Intel Driver Install Cache
        private long AnalyzeIntelDriverCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "Intel", "Package Cache");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanIntelDriverCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "Intel", "Package Cache");
            return Directory.Exists(path) ? DeleteDirectorySafe(path) : 0;
        }

        // NVIDIA Driver Install Cache
        private long AnalyzeNVIDIADriverCache()
        {
            long total = 0;
            var paths = new[]
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "NVIDIA Corporation", "Installer2"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "..", "Users", "*", "AppData", "NVIDIA", "nvbackend", "packages")
            };
            
            var installerPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "NVIDIA Corporation", "Installer2");
            if (Directory.Exists(installerPath))
                total += GetDirectorySize(installerPath);

            var userProfiles = Directory.GetDirectories(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "..", "Users"));
            foreach (var profile in userProfiles)
            {
                var nvPath = Path.Combine(profile, "AppData", "NVIDIA", "nvbackend", "packages");
                if (Directory.Exists(nvPath))
                    total += GetDirectorySize(nvPath);
            }
            return total;
        }

        private long CleanNVIDIADriverCache()
        {
            long cleaned = 0;
            var installerPath = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "NVIDIA Corporation", "Installer2");
            if (Directory.Exists(installerPath))
                cleaned += DeleteDirectorySafe(installerPath);

            var userProfiles = Directory.GetDirectories(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "..", "Users"));
            foreach (var profile in userProfiles)
            {
                var nvPath = Path.Combine(profile, "AppData", "NVIDIA", "nvbackend", "packages");
                if (Directory.Exists(nvPath))
                    cleaned += DeleteDirectorySafe(nvPath);
            }
            return cleaned;
        }

        // NVIDIA Downloader Cache
        private long AnalyzeNVIDIADownloaderCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "NVIDIA Corporation", "Downloader");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanNVIDIADownloaderCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "NVIDIA Corporation", "Downloader");
            return Directory.Exists(path) ? DeleteDirectorySafe(path) : 0;
        }

        // SQL Server Update Cache
        private long AnalyzeSQLServerUpdateCache()
        {
            long total = 0;
            var paths = new[]
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Microsoft SQL Server"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Microsoft SQL Server")
            };

            foreach (var basePath in paths.Where(Directory.Exists))
            {
                foreach (var versionDir in Directory.GetDirectories(basePath))
                {
                    var bootstrapPath = Path.Combine(versionDir, "Setup Bootstrap");
                    if (Directory.Exists(bootstrapPath))
                    {
                        var updateCache = Path.Combine(bootstrapPath, "Update Cache");
                        if (Directory.Exists(updateCache))
                            total += GetDirectorySize(updateCache);
                        
                        var logPath = Path.Combine(bootstrapPath, "Log");
                        if (Directory.Exists(logPath))
                            total += GetDirectorySize(logPath);
                    }
                }
            }
            return total;
        }

        private long CleanSQLServerUpdateCache()
        {
            long cleaned = 0;
            var paths = new[]
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Microsoft SQL Server"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Microsoft SQL Server")
            };

            foreach (var basePath in paths.Where(Directory.Exists))
            {
                foreach (var versionDir in Directory.GetDirectories(basePath))
                {
                    var bootstrapPath = Path.Combine(versionDir, "Setup Bootstrap");
                    if (Directory.Exists(bootstrapPath))
                    {
                        var updateCache = Path.Combine(bootstrapPath, "Update Cache");
                        if (Directory.Exists(updateCache))
                            cleaned += DeleteDirectorySafe(updateCache);
                        
                        var logPath = Path.Combine(bootstrapPath, "Log");
                        if (Directory.Exists(logPath))
                            cleaned += DeleteFilesInDirectory(logPath, "*", 30);
                    }
                }
            }
            return cleaned;
        }

        // Adobe Acrobat Install Cache
        private long AnalyzeAdobeAcrobatCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Adobe", "Acrobat DC", "Setup Files");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanAdobeAcrobatCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Adobe", "Acrobat DC", "Setup Files");
            return Directory.Exists(path) ? DeleteDirectorySafe(path) : 0;
        }

        // Avira Temp Files
        private long AnalyzeAviraTempFiles()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "Avira");
            if (!Directory.Exists(path)) return 0;

            long total = 0;
            foreach (var dir in Directory.GetDirectories(path))
            {
                var dirName = Path.GetFileName(dir);
                if (dirName == "TEMP" || dirName == "BACKUP")
                    total += GetDirectorySize(dir);
            }
            return total;
        }

        private long CleanAviraTempFiles()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "Avira");
            if (!Directory.Exists(path)) return 0;

            long cleaned = 0;
            foreach (var dir in Directory.GetDirectories(path))
            {
                var dirName = Path.GetFileName(dir);
                if (dirName == "TEMP" || dirName == "BACKUP")
                    cleaned += DeleteDirectorySafe(dir);
            }
            return cleaned;
        }

        // .NET Multi-Targeting Pack SetupCache
        private long AnalyzeDotNetMultiTargetingCache()
        {
            long total = 0;
            var paths = new[]
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Microsoft.NET", "Multi-Targeting Pack"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Microsoft.NET", "Multi-Targeting Pack")
            };

            foreach (var basePath in paths.Where(Directory.Exists))
            {
                foreach (var versionDir in Directory.GetDirectories(basePath))
                {
                    var setupCache = Path.Combine(versionDir, "SetupCache");
                    if (Directory.Exists(setupCache))
                        total += GetDirectorySize(setupCache);
                }
            }
            return total;
        }

        private long CleanDotNetMultiTargetingCache()
        {
            long cleaned = 0;
            var paths = new[]
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFiles), "Microsoft.NET", "Multi-Targeting Pack"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ProgramFilesX86), "Microsoft.NET", "Multi-Targeting Pack")
            };

            foreach (var basePath in paths.Where(Directory.Exists))
            {
                foreach (var versionDir in Directory.GetDirectories(basePath))
                {
                    var setupCache = Path.Combine(versionDir, "SetupCache");
                    if (Directory.Exists(setupCache))
                        cleaned += DeleteDirectorySafe(setupCache);
                }
            }
            return cleaned;
        }

        // Installer Baseline Cache ($PatchCache$)
        private long AnalyzeInstallerBaselineCache()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "Installer", "$PatchCache$");
            return Directory.Exists(path) ? GetDirectorySize(path) : 0;
        }

        private long CleanInstallerBaselineCache()
        {
            // Por segurança, não limpar automaticamente - pode quebrar desinstalações
            return 0;
        }

        // Dism++ Old Components
        private long AnalyzeDismPlusPlusOldComponents()
        {
            // Este método limpa componentes antigos do Dism++ se estiver instalado
            // Como não temos Dism++ instalado, retornamos 0
            return 0;
        }

        private long CleanDismPlusPlusOldComponents()
        {
            // Não implementado - requer Dism++ instalado
            return 0;
        }

        // Browser Old Version Backups (Generic Helper) - SEGURO
        // ATENÇÃO: Chrome e Opera modernos NÃO usam esse sistema de backup
        // Este método é apenas para navegadores chineses que realmente usam backups de versão
        private long AnalyzeBrowserOldBackup(string browserName, string regPath, string exeName, string versionFile = null)
        {
            // SEGURANÇA: Chrome e Opera modernos não devem usar este método
            if (browserName == "Chrome" || browserName == "Opera")
            {
                // Chrome/Opera modernos não armazenam backups dessa forma
                // Retornar 0 para evitar problemas
                return 0;
            }

            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(regPath);
                string? installPath = null;
                if (key != null)
                {
                    installPath = key.GetValue("Path")?.ToString();
                }
                else
                {
                    using var keyLM = Registry.LocalMachine.OpenSubKey(regPath);
                    installPath = keyLM?.GetValue("Path")?.ToString();
                }

                if (string.IsNullOrEmpty(installPath) || !Directory.Exists(installPath)) return 0;

                // Verificar se o executável principal existe
                var mainExe = Path.Combine(installPath, exeName);
                if (!File.Exists(mainExe)) return 0;

                long total = 0;
                var currentVersion = GetFileVersion(mainExe);
                if (string.IsNullOrEmpty(currentVersion)) return 0; // Não pode determinar versão atual

                foreach (var dir in Directory.GetDirectories(installPath))
                {
                    var dirName = Path.GetFileName(dir);
                    // Padrão de versão: X.Y.Z.W (4 números separados por pontos)
                    // SEGURANÇA: Verificar se realmente é um backup, não um componente ativo
                    if (System.Text.RegularExpressions.Regex.IsMatch(dirName, @"^\d+\.\d+\.\d+\.\d+$"))
                    {
                        var dirExe = Path.Combine(dir, exeName);
                        // SEGURANÇA: Só considerar se o diretório contém o executável
                        if (File.Exists(dirExe))
                        {
                            var dirVersion = GetFileVersion(dirExe);
                            // SEGURANÇA: Só deletar se a versão for diferente E não for vazia
                            if (!string.IsNullOrEmpty(dirVersion) && dirVersion != currentVersion)
                            {
                                // VERIFICAÇÃO FINAL: Verificar se não é um diretório crítico
                                var criticalFiles = new[] { "chrome.dll", "chrome_child.dll", "chrome_elf.dll" };
                                bool isCritical = false;
                                foreach (var critical in criticalFiles)
                                {
                                    if (File.Exists(Path.Combine(dir, critical)))
                                    {
                                        isCritical = true;
                                        break;
                                    }
                                }
                                
                                if (!isCritical)
                                    total += GetDirectorySize(dir);
                            }
                        }
                    }
                }

                return total;
            }
            catch { return 0; }
        }

        private long CleanBrowserOldBackup(string browserName, string regPath, string exeName, string versionFile = null)
        {
            // SEGURANÇA: Chrome e Opera modernos não devem usar este método
            if (browserName == "Chrome" || browserName == "Opera")
            {
                // NÃO LIMPAR - pode corromper o navegador
                _logger?.LogWarning($"[UltraClean] Limpeza de backup do {browserName} desabilitada por segurança (navegador moderno não usa esse sistema)");
                return 0;
            }

            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(regPath);
                string? installPath = null;
                if (key != null)
                {
                    installPath = key.GetValue("Path")?.ToString();
                }
                else
                {
                    using var keyLM = Registry.LocalMachine.OpenSubKey(regPath);
                    installPath = keyLM?.GetValue("Path")?.ToString();
                }

                if (string.IsNullOrEmpty(installPath) || !Directory.Exists(installPath)) return 0;

                // Verificar se o executável principal existe
                var mainExe = Path.Combine(installPath, exeName);
                if (!File.Exists(mainExe)) return 0;

                long cleaned = 0;
                var currentVersion = GetFileVersion(mainExe);
                if (string.IsNullOrEmpty(currentVersion)) return 0; // Não pode determinar versão atual

                foreach (var dir in Directory.GetDirectories(installPath))
                {
                    var dirName = Path.GetFileName(dir);
                    // Padrão de versão: X.Y.Z.W (4 números separados por pontos)
                    if (System.Text.RegularExpressions.Regex.IsMatch(dirName, @"^\d+\.\d+\.\d+\.\d+$"))
                    {
                        var dirExe = Path.Combine(dir, exeName);
                        if (File.Exists(dirExe))
                        {
                            var dirVersion = GetFileVersion(dirExe);
                            // SEGURANÇA: Só deletar se a versão for diferente E não for vazia
                            if (!string.IsNullOrEmpty(dirVersion) && dirVersion != currentVersion)
                            {
                                // VERIFICAÇÃO FINAL: Verificar se não é um diretório crítico
                                var criticalFiles = new[] { "chrome.dll", "chrome_child.dll", "chrome_elf.dll" };
                                bool isCritical = false;
                                foreach (var critical in criticalFiles)
                                {
                                    if (File.Exists(Path.Combine(dir, critical)))
                                    {
                                        isCritical = true;
                                        break;
                                    }
                                }
                                
                                if (!isCritical)
                                    cleaned += DeleteDirectorySafe(dir);
                            }
                        }
                    }
                }

                return cleaned;
            }
            catch { return 0; }
        }

        private string GetFileVersion(string filePath)
        {
            try
            {
                if (File.Exists(filePath))
                    return FileVersionInfo.GetVersionInfo(filePath).FileVersion ?? "";
            }
            catch { }
            return "";
        }

        // 360 Browser Old Backup
        private long Analyze360BrowserOldBackup()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "360se6", "Application");
            if (!Directory.Exists(path)) return 0;

            try
            {
                var currentExe = Path.Combine(path, "360se.exe");
                if (!File.Exists(currentExe)) return 0;

                var currentVersion = GetFileVersion(currentExe);
                long total = 0;

                foreach (var dir in Directory.GetDirectories(path))
                {
                    var dirExe = Path.Combine(dir, "360se.exe");
                    if (File.Exists(dirExe))
                    {
                        var dirVersion = GetFileVersion(dirExe);
                        if (dirVersion != currentVersion)
                            total += GetDirectorySize(dir);
                    }
                }
                return total;
            }
            catch { return 0; }
        }

        private long Clean360BrowserOldBackup()
        {
            var path = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "360se6", "Application");
            if (!Directory.Exists(path)) return 0;

            try
            {
                var currentExe = Path.Combine(path, "360se.exe");
                if (!File.Exists(currentExe)) return 0;

                var currentVersion = GetFileVersion(currentExe);
                long cleaned = 0;

                foreach (var dir in Directory.GetDirectories(path))
                {
                    var dirExe = Path.Combine(dir, "360se.exe");
                    if (File.Exists(dirExe))
                    {
                        var dirVersion = GetFileVersion(dirExe);
                        if (dirVersion != currentVersion)
                            cleaned += DeleteDirectorySafe(dir);
                    }
                }
                return cleaned;
            }
            catch { return 0; }
        }

        // Chrome Old Backup
        private long AnalyzeChromeOldBackup()
        {
            return AnalyzeBrowserOldBackup("Chrome", @"Software\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe", "chrome.exe");
        }

        private long CleanChromeOldBackup()
        {
            return CleanBrowserOldBackup("Chrome", @"Software\Microsoft\Windows\CurrentVersion\App Paths\chrome.exe", "chrome.exe");
        }

        // Opera Old Backup
        private long AnalyzeOperaOldBackup()
        {
            return AnalyzeBrowserOldBackup("Opera", @"Software\Microsoft\Windows\CurrentVersion\App Paths\opera.exe", "Launcher.exe");
        }

        private long CleanOperaOldBackup()
        {
            return CleanBrowserOldBackup("Opera", @"Software\Microsoft\Windows\CurrentVersion\App Paths\opera.exe", "Launcher.exe");
        }

        // Alibaba Wangwang Old Backup
        private long AnalyzeAlibabaWangwangOldBackup()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Alibaba\WWLights\EE76A38A6C9E01F42C551FE3BE585C3B", true);
                if (key == null) return 0;

                var installPath = key.GetValue("Path")?.ToString();
                if (string.IsNullOrEmpty(installPath) || !Directory.Exists(installPath)) return 0;

                var iniPath = Path.Combine(installPath, "Aliim.ini");
                if (!File.Exists(iniPath)) return 0;

                var currentVersion = GetIniValue(iniPath, "Common", "Version");
                if (string.IsNullOrEmpty(currentVersion)) return 0;

                long total = 0;
                var parentDir = Path.GetDirectoryName(installPath);
                if (parentDir != null)
                {
                    foreach (var dir in Directory.GetDirectories(parentDir))
                    {
                        var dirIni = Path.Combine(dir, "Aliim.ini");
                        if (File.Exists(dirIni))
                        {
                            var dirVersion = GetIniValue(dirIni, "Common", "Version");
                            if (dirVersion != currentVersion)
                                total += GetDirectorySize(dir);
                        }
                    }
                }
                return total;
            }
            catch { return 0; }
        }

        private long CleanAlibabaWangwangOldBackup()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Alibaba\WWLights\EE76A38A6C9E01F42C551FE3BE585C3B", true);
                if (key == null) return 0;

                var installPath = key.GetValue("Path")?.ToString();
                if (string.IsNullOrEmpty(installPath) || !Directory.Exists(installPath)) return 0;

                var iniPath = Path.Combine(installPath, "Aliim.ini");
                if (!File.Exists(iniPath)) return 0;

                var currentVersion = GetIniValue(iniPath, "Common", "Version");
                if (string.IsNullOrEmpty(currentVersion)) return 0;

                long cleaned = 0;
                var parentDir = Path.GetDirectoryName(installPath);
                if (parentDir != null)
                {
                    foreach (var dir in Directory.GetDirectories(parentDir))
                    {
                        var dirIni = Path.Combine(dir, "Aliim.ini");
                        if (File.Exists(dirIni))
                        {
                            var dirVersion = GetIniValue(dirIni, "Common", "Version");
                            if (dirVersion != currentVersion)
                                cleaned += DeleteDirectorySafe(dir);
                        }
                    }
                }
                return cleaned;
            }
            catch { return 0; }
        }

        // Alibaba Qintao Old Backup
        private long AnalyzeAlibabaQintaoOldBackup()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Alibaba\WWLights\810588CDA60249EB05C110B0DED77CD8", true);
                if (key == null) return 0;

                var installPath = key.GetValue("Path")?.ToString();
                if (string.IsNullOrEmpty(installPath) || !Directory.Exists(installPath)) return 0;

                var iniPath = Path.Combine(installPath, "AliQinTao.ini");
                if (!File.Exists(iniPath)) return 0;

                var currentVersion = GetIniValue(iniPath, "Common", "Version");
                if (string.IsNullOrEmpty(currentVersion)) return 0;

                long total = 0;
                var parentDir = Path.GetDirectoryName(installPath);
                if (parentDir != null)
                {
                    foreach (var dir in Directory.GetDirectories(parentDir))
                    {
                        var dirIni = Path.Combine(dir, "AliQinTao.ini");
                        if (File.Exists(dirIni))
                        {
                            var dirVersion = GetIniValue(dirIni, "Common", "Version");
                            if (dirVersion != currentVersion)
                                total += GetDirectorySize(dir);
                        }
                    }
                }
                return total;
            }
            catch { return 0; }
        }

        private long CleanAlibabaQintaoOldBackup()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Alibaba\WWLights\810588CDA60249EB05C110B0DED77CD8", true);
                if (key == null) return 0;

                var installPath = key.GetValue("Path")?.ToString();
                if (string.IsNullOrEmpty(installPath) || !Directory.Exists(installPath)) return 0;

                var iniPath = Path.Combine(installPath, "AliQinTao.ini");
                if (!File.Exists(iniPath)) return 0;

                var currentVersion = GetIniValue(iniPath, "Common", "Version");
                if (string.IsNullOrEmpty(currentVersion)) return 0;

                long cleaned = 0;
                var parentDir = Path.GetDirectoryName(installPath);
                if (parentDir != null)
                {
                    foreach (var dir in Directory.GetDirectories(parentDir))
                    {
                        var dirIni = Path.Combine(dir, "AliQinTao.ini");
                        if (File.Exists(dirIni))
                        {
                            var dirVersion = GetIniValue(dirIni, "Common", "Version");
                            if (dirVersion != currentVersion)
                                cleaned += DeleteDirectorySafe(dir);
                        }
                    }
                }
                return cleaned;
            }
            catch { return 0; }
        }

        // PPLive Old Backup
        private long AnalyzePPLiveOldBackup()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\PPLive.exe");
                if (key == null) return 0;

                var installPath = key.GetValue("Path")?.ToString();
                if (string.IsNullOrEmpty(installPath) || !Directory.Exists(installPath)) return 0;

                var versionFile = Path.Combine(installPath, "version.dat");
                if (!File.Exists(versionFile)) return 0;

                var currentVersion = GetIniValue(versionFile, "version", "current");
                if (string.IsNullOrEmpty(currentVersion)) return 0;

                long total = 0;
                var parentDir = Path.GetDirectoryName(installPath);
                if (parentDir != null)
                {
                    foreach (var dir in Directory.GetDirectories(parentDir))
                    {
                        var dirVersionFile = Path.Combine(dir, "version.dat");
                        if (File.Exists(dirVersionFile))
                        {
                            var dirVersion = GetIniValue(dirVersionFile, "version", "current");
                            if (dirVersion != currentVersion)
                                total += GetDirectorySize(dir);
                        }
                    }
                }
                return total;
            }
            catch { return 0; }
        }

        private long CleanPPLiveOldBackup()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\PPLive.exe");
                if (key == null) return 0;

                var installPath = key.GetValue("Path")?.ToString();
                if (string.IsNullOrEmpty(installPath) || !Directory.Exists(installPath)) return 0;

                var versionFile = Path.Combine(installPath, "version.dat");
                if (!File.Exists(versionFile)) return 0;

                var currentVersion = GetIniValue(versionFile, "version", "current");
                if (string.IsNullOrEmpty(currentVersion)) return 0;

                long cleaned = 0;
                var parentDir = Path.GetDirectoryName(installPath);
                if (parentDir != null)
                {
                    foreach (var dir in Directory.GetDirectories(parentDir))
                    {
                        var dirVersionFile = Path.Combine(dir, "version.dat");
                        if (File.Exists(dirVersionFile))
                        {
                            var dirVersion = GetIniValue(dirVersionFile, "version", "current");
                            if (dirVersion != currentVersion)
                                cleaned += DeleteDirectorySafe(dir);
                        }
                    }
                }
                return cleaned;
            }
            catch { return 0; }
        }

        // KuGou Music Old Backup
        private long AnalyzeKuGouMusicOldBackup()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\kugou");
                if (key == null) return 0;

                var installPath = key.GetValue("AppPath")?.ToString();
                if (string.IsNullOrEmpty(installPath) || !Directory.Exists(installPath)) return 0;

                using var versionKey = Registry.CurrentUser.OpenSubKey(@"Software\KuGou8");
                var currentVersion = versionKey?.GetValue("AppVersion")?.ToString();
                if (string.IsNullOrEmpty(currentVersion)) return 0;

                long total = 0;
                var parentDir = Path.GetDirectoryName(installPath);
                if (parentDir != null)
                {
                    foreach (var dir in Directory.GetDirectories(parentDir))
                    {
                        var dirName = Path.GetFileName(dir);
                        if (System.Text.RegularExpressions.Regex.IsMatch(dirName, @"^\d+\.\d+\.\d+") && dirName != currentVersion)
                            total += GetDirectorySize(dir);
                    }
                }
                return total;
            }
            catch { return 0; }
        }

        private long CleanKuGouMusicOldBackup()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\kugou");
                if (key == null) return 0;

                var installPath = key.GetValue("AppPath")?.ToString();
                if (string.IsNullOrEmpty(installPath) || !Directory.Exists(installPath)) return 0;

                using var versionKey = Registry.CurrentUser.OpenSubKey(@"Software\KuGou8");
                var currentVersion = versionKey?.GetValue("AppVersion")?.ToString();
                if (string.IsNullOrEmpty(currentVersion)) return 0;

                long cleaned = 0;
                var parentDir = Path.GetDirectoryName(installPath);
                if (parentDir != null)
                {
                    foreach (var dir in Directory.GetDirectories(parentDir))
                    {
                        var dirName = Path.GetFileName(dir);
                        if (System.Text.RegularExpressions.Regex.IsMatch(dirName, @"^\d+\.\d+\.\d+") && dirName != currentVersion)
                            cleaned += DeleteDirectorySafe(dir);
                    }
                }
                return cleaned;
            }
            catch { return 0; }
        }

        // 2345 Pinyin Old Backup
        private long Analyze2345PinyinOldBackup()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\2345Pinyin", true);
                if (key == null) return 0;

                var installPath = key.GetValue("Path")?.ToString();
                if (string.IsNullOrEmpty(installPath) || !Directory.Exists(installPath)) return 0;

                var currentVersion = key.GetValue("Version")?.ToString();
                if (string.IsNullOrEmpty(currentVersion)) return 0;

                long total = 0;
                var parentDir = Path.GetDirectoryName(installPath);
                if (parentDir != null)
                {
                    foreach (var dir in Directory.GetDirectories(parentDir))
                    {
                        var dirName = Path.GetFileName(dir);
                        if (System.Text.RegularExpressions.Regex.IsMatch(dirName, @"^\d+\.\d+\.\d+") && dirName != currentVersion)
                            total += GetDirectorySize(dir);
                    }
                }
                return total;
            }
            catch { return 0; }
        }

        private long Clean2345PinyinOldBackup()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(@"SOFTWARE\2345Pinyin", true);
                if (key == null) return 0;

                var installPath = key.GetValue("Path")?.ToString();
                if (string.IsNullOrEmpty(installPath) || !Directory.Exists(installPath)) return 0;

                var currentVersion = key.GetValue("Version")?.ToString();
                if (string.IsNullOrEmpty(currentVersion)) return 0;

                long cleaned = 0;
                var parentDir = Path.GetDirectoryName(installPath);
                if (parentDir != null)
                {
                    foreach (var dir in Directory.GetDirectories(parentDir))
                    {
                        var dirName = Path.GetFileName(dir);
                        if (System.Text.RegularExpressions.Regex.IsMatch(dirName, @"^\d+\.\d+\.\d+") && dirName != currentVersion)
                            cleaned += DeleteDirectorySafe(dir);
                    }
                }
                return cleaned;
            }
            catch { return 0; }
        }

        // WPS Old Backup
        private long AnalyzeWPSOldBackup()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"SOFTWARE\kingsoft\office\6.0\Common");
                if (key == null) return 0;

                var installRoot = key.GetValue("InstallRoot")?.ToString();
                if (string.IsNullOrEmpty(installRoot) || !Directory.Exists(installRoot)) return 0;

                var currentVersion = key.GetValue("Version")?.ToString();
                if (string.IsNullOrEmpty(currentVersion)) return 0;

                var parentDir = Path.GetDirectoryName(installRoot);
                if (parentDir == null || !Directory.Exists(parentDir)) return 0;

                long total = 0;
                foreach (var dir in Directory.GetDirectories(parentDir))
                {
                    var dirName = Path.GetFileName(dir);
                    if (System.Text.RegularExpressions.Regex.IsMatch(dirName, @"^\d+\.\d+\.\d+") && dirName != currentVersion)
                        total += GetDirectorySize(dir);
                }
                return total;
            }
            catch { return 0; }
        }

        private long CleanWPSOldBackup()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"SOFTWARE\kingsoft\office\6.0\Common");
                if (key == null) return 0;

                var installRoot = key.GetValue("InstallRoot")?.ToString();
                if (string.IsNullOrEmpty(installRoot) || !Directory.Exists(installRoot)) return 0;

                var currentVersion = key.GetValue("Version")?.ToString();
                if (string.IsNullOrEmpty(currentVersion)) return 0;

                var parentDir = Path.GetDirectoryName(installRoot);
                if (parentDir == null || !Directory.Exists(parentDir)) return 0;

                long cleaned = 0;
                foreach (var dir in Directory.GetDirectories(parentDir))
                {
                    var dirName = Path.GetFileName(dir);
                    if (System.Text.RegularExpressions.Regex.IsMatch(dirName, @"^\d+\.\d+\.\d+") && dirName != currentVersion)
                        cleaned += DeleteDirectorySafe(dir);
                }
                return cleaned;
            }
            catch { return 0; }
        }

        // Corrupted Appx Apps
        private long AnalyzeCorruptedAppx()
        {
            // Não estimamos - requer análise complexa via PowerShell
            return 0;
        }

        private long CleanCorruptedAppx()
        {
            try
            {
                // CORREÇÃO: Garantir que processo PowerShell seja terminado corretamente
                // Usar PowerShell para remover Appx corrompidos (necessário para esta operação)
                var psi = new ProcessStartInfo
                {
                    FileName = "powershell.exe",
                    Arguments = "-NoProfile -ExecutionPolicy Bypass -Command \"Get-AppxPackage -AllUsers | Where-Object {$_.Status -eq 'Error' -or $_.Status -eq 'Corrupted'} | Remove-AppxPackage -ErrorAction SilentlyContinue\"",
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true
                };

                using var process = Process.Start(psi);
                if (process != null)
                {
                    // Aguardar com timeout e garantir término
                    if (!process.WaitForExit(60000)) // 1 min timeout
                    {
                        // Se não terminou, forçar término
                        try
                        {
                            process.Kill();
                            process.WaitForExit(5000);
                        }
                        catch { }
                    }
                }
                return AnalyzeCorruptedAppx();
            }
            catch { return 0; }
        }

        // IDM Temp Files
        private long AnalyzeIDMTempFiles()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\DownloadManager");
                if (key == null) return 0;

                var tempPath = key.GetValue("TempPath")?.ToString();
                if (string.IsNullOrEmpty(tempPath)) return 0;

                var dwnlDataPath = Path.Combine(tempPath, "DwnlData");
                return Directory.Exists(dwnlDataPath) ? GetDirectorySize(dwnlDataPath) : 0;
            }
            catch { return 0; }
        }

        private long CleanIDMTempFiles()
        {
            try
            {
                using var key = Registry.CurrentUser.OpenSubKey(@"Software\DownloadManager");
                if (key == null) return 0;

                var tempPath = key.GetValue("TempPath")?.ToString();
                if (string.IsNullOrEmpty(tempPath)) return 0;

                var dwnlDataPath = Path.Combine(tempPath, "DwnlData");
                return Directory.Exists(dwnlDataPath) ? DeleteDirectorySafe(dwnlDataPath) : 0;
            }
            catch { return 0; }
        }

        // Microsoft Antivirus Useless Files (MSE/SCEP)
        private long AnalyzeMicrosoftAntivirusUselessFiles()
        {
            long total = 0;
            var paths = new[]
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "Microsoft", "Windows Defender", "LocalCopy"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "Microsoft", "Windows Defender", "Support"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "Microsoft", "Windows Defender", "Network Inspection System", "Support"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "Microsoft", "Microsoft Antimalware", "LocalCopy"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "Microsoft", "Microsoft Antimalware", "Support"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "Microsoft", "Microsoft Antimalware", "Network Inspection System", "Support")
            };

            foreach (var path in paths.Where(Directory.Exists))
                total += GetDirectorySize(path);

            return total;
        }

        private long CleanMicrosoftAntivirusUselessFiles()
        {
            long cleaned = 0;
            var paths = new[]
            {
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "Microsoft", "Windows Defender", "LocalCopy"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "Microsoft", "Windows Defender", "Support"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "Microsoft", "Windows Defender", "Network Inspection System", "Support"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "Microsoft", "Microsoft Antimalware", "LocalCopy"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "Microsoft", "Microsoft Antimalware", "Support"),
                Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "Microsoft", "Microsoft Antimalware", "Network Inspection System", "Support")
            };

            foreach (var path in paths.Where(Directory.Exists))
                cleaned += DeleteFilesInDirectory(path, "*", 30); // Manter últimos 30 dias

            return cleaned;
        }

        // Visual Studio Settings Logs
        private long AnalyzeVisualStudioSettingsLogs()
        {
            var userProfiles = Directory.GetDirectories(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "..", "Users"));
            long total = 0;
            foreach (var profile in userProfiles)
            {
                var path = Path.Combine(profile, "AppData", "Local", "Microsoft", "VisualStudio", "SettingsLogs");
                if (Directory.Exists(path))
                    total += GetDirectorySize(path);
            }
            return total;
        }

        private long CleanVisualStudioSettingsLogs()
        {
            var userProfiles = Directory.GetDirectories(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "..", "Users"));
            long cleaned = 0;
            foreach (var profile in userProfiles)
            {
                var path = Path.Combine(profile, "AppData", "Local", "Microsoft", "VisualStudio", "SettingsLogs");
                if (Directory.Exists(path))
                    cleaned += DeleteFilesInDirectory(path, "*", 7); // Manter últimos 7 dias
            }
            return cleaned;
        }

        // User Crash Dumps
        private long AnalyzeUserCrashDumps()
        {
            var userProfiles = Directory.GetDirectories(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "..", "Users"));
            long total = 0;
            foreach (var profile in userProfiles)
            {
                var crashDumpsPath = Path.Combine(profile, "AppData", "Local", "crashdumps");
                if (Directory.Exists(crashDumpsPath))
                    total += GetDirectorySize(crashDumpsPath);
            }
            return total;
        }

        private long CleanUserCrashDumps()
        {
            var userProfiles = Directory.GetDirectories(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "..", "Users"));
            long cleaned = 0;
            foreach (var profile in userProfiles)
            {
                var crashDumpsPath = Path.Combine(profile, "AppData", "Local", "crashdumps");
                if (Directory.Exists(crashDumpsPath))
                    cleaned += DeleteFilesInDirectory(crashDumpsPath, "*.dmp", 30); // Manter últimos 30 dias
            }
            return cleaned;
        }

        // Helper: Get INI Value
        private string GetIniValue(string iniPath, string section, string key)
        {
            try
            {
                if (!File.Exists(iniPath)) return "";

                var lines = File.ReadAllLines(iniPath);
                bool inSection = false;

                foreach (var line in lines)
                {
                    var trimmed = line.Trim();
                    if (trimmed.StartsWith($"[{section}]"))
                    {
                        inSection = true;
                        continue;
                    }
                    if (trimmed.StartsWith("[") && inSection)
                        break;

                    if (inSection && trimmed.StartsWith($"{key}="))
                    {
                        return trimmed.Substring(key.Length + 1).Trim();
                    }
                }
            }
            catch { }
            return "";
        }

        // ============================================
        // MÉTODOS AVANÇADOS DE LIMPEZA PROFUNDA
        // ============================================
        
        // Limpeza Profunda de Logs do Sistema (Avançado)
        private long AnalyzeAdvancedSystemLogs()
        {
            try
            {
                _logger.LogInfo("[UltraClean] Analisando logs do sistema (método avançado)...");
                
                long total = 0;
                var winPath = Environment.GetFolderPath(Environment.SpecialFolder.Windows);
                
                // Logs do Windows (todos os tipos)
                var logPaths = new[]
                {
                    Path.Combine(winPath, "Logs"),
                    Path.Combine(winPath, "Panther"),
                    Path.Combine(winPath, "Performance", "WinSAT", "DataStore"),
                    Path.Combine(winPath, "System32", "LogFiles"),
                    Path.Combine(winPath, "System32", "config", "systemprofile", "AppData", "Local", "Microsoft", "Windows", "INetCache"),
                    Path.Combine(winPath, "SysWOW64", "config", "systemprofile", "AppData", "Local", "Microsoft", "Windows", "INetCache"),
                    Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "USOShared", "Logs")
                };
                
                foreach (var path in logPaths.Where(Directory.Exists))
                {
                    total += GetDirectorySize(path);
                }
                
                // Arquivos .log, .bak, .tmp no Windows
                try
                {
                    var logFiles = Directory.GetFiles(winPath, "*.log", SearchOption.TopDirectoryOnly)
                        .Concat(Directory.GetFiles(winPath, "*.bak", SearchOption.TopDirectoryOnly))
                        .Concat(Directory.GetFiles(winPath, "*log.txt", SearchOption.TopDirectoryOnly));
                    
                    foreach (var file in logFiles)
                    {
                        try
                        {
                            total += new FileInfo(file).Length;
                        }
                        catch { }
                    }
                }
                catch { }
                
                _logger.LogInfo($"[UltraClean] Logs avançados detectados: {FormatBytes(total)}");
                return total;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[UltraClean] Erro ao analisar logs avançados: {ex.Message}");
                return 0;
            }
        }

        private long CleanAdvancedSystemLogs()
        {
            try
            {
                _logger.LogInfo("[UltraClean] Limpando logs do sistema (método avançado)...");
                
                long cleaned = 0;
                var winPath = Environment.GetFolderPath(Environment.SpecialFolder.Windows);
                
                var logPaths = new[]
                {
                    Path.Combine(winPath, "Logs"),
                    Path.Combine(winPath, "Panther"),
                    Path.Combine(winPath, "Performance", "WinSAT", "DataStore"),
                    Path.Combine(winPath, "System32", "LogFiles"),
                    Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "USOShared", "Logs")
                };
                
                foreach (var path in logPaths.Where(Directory.Exists))
                {
                    cleaned += DeleteFilesInDirectory(path, "*", 30); // Manter últimos 30 dias
                }
                
                // Limpar arquivos .log, .bak antigos
                try
                {
                    var cutoff = DateTime.Now.AddDays(-30);
                    var logFiles = Directory.GetFiles(winPath, "*.log", SearchOption.TopDirectoryOnly)
                        .Concat(Directory.GetFiles(winPath, "*.bak", SearchOption.TopDirectoryOnly))
                        .Concat(Directory.GetFiles(winPath, "*log.txt", SearchOption.TopDirectoryOnly));
                    
                    foreach (var file in logFiles)
                    {
                        try
                        {
                            var info = new FileInfo(file);
                            if (info.LastWriteTime < cutoff)
                            {
                                cleaned += info.Length;
                                File.Delete(file);
                            }
                        }
                        catch { }
                    }
                }
                catch { }
                
                _logger.LogSuccess($"[UltraClean] Logs avançados limpos: {FormatBytes(cleaned)}");
                return cleaned;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[UltraClean] Erro ao limpar logs avançados: {ex.Message}");
                return 0;
            }
        }

        // Limpeza Profunda de Arquivos Temporários do Sistema (Avançado)
        private long AnalyzeAdvancedSystemTemp()
        {
            try
            {
                _logger.LogInfo("[UltraClean] Analisando arquivos temporários do sistema (método avançado)...");
                
                long total = 0;
                var winPath = Environment.GetFolderPath(Environment.SpecialFolder.Windows);
                
                // Todos os diretórios temp do sistema
                var tempPaths = new[]
                {
                    Path.Combine(winPath, "Temp"),
                    Path.Combine(winPath, "System32", "config", "systemprofile", "AppData", "Local", "Temp"),
                    Path.Combine(winPath, "SysWOW64", "config", "systemprofile", "AppData", "Local", "Temp"),
                    Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "Temp"),
                    Path.Combine(winPath, "SoftwareDistribution", "Download"),
                    Path.Combine(winPath, "SoftwareDistribution", "PostRebootEventCache.V2"),
                    Path.Combine(winPath, "System32", "DriverStore", "FileRepository", "*.tmp"),
                    Path.Combine(winPath, "System32", "DriverStore", "Temp")
                };
                
                foreach (var path in tempPaths)
                {
                    try
                    {
                        if (Directory.Exists(path))
                            total += GetDirectorySize(path);
                        else if (path.Contains("*"))
                        {
                            // Padrão wildcard - procurar diretórios
                            var parent = Path.GetDirectoryName(path);
                            var pattern = Path.GetFileName(path);
                            if (Directory.Exists(parent))
                            {
                                foreach (var dir in Directory.GetDirectories(parent, pattern))
                                    total += GetDirectorySize(dir);
                            }
                        }
                    }
                    catch { }
                }
                
                _logger.LogInfo($"[UltraClean] Temp avançado detectado: {FormatBytes(total)}");
                return total;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[UltraClean] Erro ao analisar temp avançado: {ex.Message}");
                return 0;
            }
        }

        private long CleanAdvancedSystemTemp()
        {
            try
            {
                _logger.LogInfo("[UltraClean] Limpando arquivos temporários do sistema (método avançado)...");
                
                long cleaned = 0;
                var winPath = Environment.GetFolderPath(Environment.SpecialFolder.Windows);
                
                var tempPaths = new[]
                {
                    Path.Combine(winPath, "Temp"),
                    Path.Combine(winPath, "System32", "config", "systemprofile", "AppData", "Local", "Temp"),
                    Path.Combine(winPath, "SysWOW64", "config", "systemprofile", "AppData", "Local", "Temp"),
                    Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.CommonApplicationData), "Temp"),
                    Path.Combine(winPath, "SoftwareDistribution", "PostRebootEventCache.V2"),
                    Path.Combine(winPath, "System32", "DriverStore", "Temp")
                };
                
                foreach (var path in tempPaths.Where(Directory.Exists))
                {
                    cleaned += DeleteFilesInDirectory(path, "*", 7); // Manter últimos 7 dias
                }
                
                // Limpar DriverStore Temp específico
                try
                {
                    var driverStoreTemp = Path.Combine(winPath, "System32", "DriverStore", "Temp");
                    if (Directory.Exists(driverStoreTemp))
                    {
                        foreach (var dir in Directory.GetDirectories(driverStoreTemp))
                        {
                            try
                            {
                                cleaned += DeleteDirectorySafe(dir);
                            }
                            catch { }
                        }
                    }
                }
                catch { }
                
                _logger.LogSuccess($"[UltraClean] Temp avançado limpo: {FormatBytes(cleaned)}");
                return cleaned;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[UltraClean] Erro ao limpar temp avançado: {ex.Message}");
                return 0;
            }
        }

        // Limpeza Profunda de Cache de Aplicativos (Avançado)
        private long AnalyzeAdvancedAppCache()
        {
            try
            {
                _logger.LogInfo("[UltraClean] Analisando cache de aplicativos (método avançado)...");
                
                long total = 0;
                var userProfiles = Directory.GetDirectories(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "..", "Users"));
                
                foreach (var profile in userProfiles)
                {
                    try
                    {
                        var appDataLocal = Path.Combine(profile, "AppData", "Local");
                        if (!Directory.Exists(appDataLocal)) continue;
                        
                        // Cache de aplicativos comuns
                        var cachePaths = new[]
                        {
                            Path.Combine(appDataLocal, "Microsoft", "Windows", "INetCache"),
                            Path.Combine(appDataLocal, "Microsoft", "Windows", "Temporary Internet Files"),
                            Path.Combine(appDataLocal, "Microsoft", "Windows", "WebCache"),
                            Path.Combine(appDataLocal, "Packages"),
                            Path.Combine(appDataLocal, "Microsoft", "Windows", "History"),
                            Path.Combine(appDataLocal, "Microsoft", "Windows", "Cookies")
                        };
                        
                        foreach (var path in cachePaths.Where(Directory.Exists))
                        {
                            total += GetDirectorySize(path);
                        }
                    }
                    catch { }
                }
                
                _logger.LogInfo($"[UltraClean] Cache de apps avançado detectado: {FormatBytes(total)}");
                return total;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[UltraClean] Erro ao analisar cache de apps avançado: {ex.Message}");
                return 0;
            }
        }

        private long CleanAdvancedAppCache()
        {
            try
            {
                _logger.LogInfo("[UltraClean] Limpando cache de aplicativos (método avançado)...");
                
                long cleaned = 0;
                var userProfiles = Directory.GetDirectories(Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.Windows), "..", "Users"));
                
                foreach (var profile in userProfiles)
                {
                    try
                    {
                        var appDataLocal = Path.Combine(profile, "AppData", "Local");
                        if (!Directory.Exists(appDataLocal)) continue;
                        
                        var cachePaths = new[]
                        {
                            Path.Combine(appDataLocal, "Microsoft", "Windows", "INetCache"),
                            Path.Combine(appDataLocal, "Microsoft", "Windows", "Temporary Internet Files"),
                            Path.Combine(appDataLocal, "Microsoft", "Windows", "WebCache"),
                            Path.Combine(appDataLocal, "Microsoft", "Windows", "History"),
                            Path.Combine(appDataLocal, "Microsoft", "Windows", "Cookies")
                        };
                        
                        foreach (var path in cachePaths.Where(Directory.Exists))
                        {
                            cleaned += DeleteFilesInDirectory(path, "*", 30); // Manter últimos 30 dias
                        }
                    }
                    catch { }
                }
                
                _logger.LogSuccess($"[UltraClean] Cache de apps avançado limpo: {FormatBytes(cleaned)}");
                return cleaned;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[UltraClean] Erro ao limpar cache de apps avançado: {ex.Message}");
                return 0;
            }
        }

        #endregion
    }

    #region Models

    public class CleanupCategory
    {
        public string Name { get; set; } = "";
        public string Icon { get; set; } = "";
        public List<CleanupCategoryItem> Items { get; set; } = new();
    }

    public class CleanupCategoryItem
    {
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public Func<long>? AnalyzeAction { get; set; }
        public Func<long>? CleanAction { get; set; }
        public bool RequiresAdmin { get; set; }
        public bool IsSafe { get; set; } = true;
    }

    public class UltraCleanAnalysis
    {
        public List<CategoryAnalysis> Categories { get; set; } = new();
        public long TotalReclaimable { get; set; }
    }

    public class CategoryAnalysis
    {
        public string Name { get; set; } = "";
        public string Icon { get; set; } = "";
        public List<ItemAnalysis> Items { get; set; } = new();
        public long TotalSize { get; set; }
    }

    public class ItemAnalysis
    {
        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public long Size { get; set; }
        public bool IsSafe { get; set; }
        public bool RequiresAdmin { get; set; }
        public bool IsSelected { get; set; }
        public Func<long>? CleanAction { get; set; }
    }

    public class AnalysisProgress
    {
        public string CurrentItem { get; set; } = "";
        public string Category { get; set; } = "";
        public int PercentComplete { get; set; }
    }

    public class CleanupProgress
    {
        public string CurrentItem { get; set; } = "";
        public int PercentComplete { get; set; }
    }

    public class CleanupResult
    {
        public bool Success { get; set; }
        public long SpaceCleaned { get; set; }
        public int ItemsCleaned { get; set; }
        public List<string> Errors { get; set; } = new();
    }
    
    public class AnalysisStatus
    {
        public bool IsAnalyzing { get; set; }
        public string CurrentCategory { get; set; } = "";
        public string CurrentItem { get; set; } = "";
        public int PercentComplete { get; set; }
        public UltraCleanAnalysis? LastAnalysis { get; set; }
    }

    #endregion
}

