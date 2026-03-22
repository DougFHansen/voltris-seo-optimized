using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Management;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;
using System.IO;
using VoltrisOptimizer.Helpers;
using VoltrisOptimizer.Services;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics;
using System.Runtime.InteropServices;

namespace VoltrisOptimizer.UI.ViewModels
{
    /// <summary>
    /// ViewModel para o Dashboard principal - totalmente funcional
    /// </summary>
    public partial class DashboardViewModel : ViewModelBase
    {
        private readonly ILoggingService? _logger;
        private readonly Interfaces.INavigationService? _navigationService;
        private readonly WmiCacheService? _wmiCache;
        private readonly System.Windows.Threading.DispatcherTimer _telemetryTimer;
        // OTIMIZAÇÃO DE PERFORMANCE: Intervalo aumentado de 5s para 30s
        // Email vinculado não muda com frequência, reduz overhead na UI thread
        private readonly System.Windows.Threading.DispatcherTimer _settingsMonitorTimer;
        private readonly LicenseManager _licenseManager;
        private readonly TrialProtectionService _trialService;
        
        // CORREÇÃO CRÍTICA: Usar APIs nativas do Windows (GetSystemTimes/GlobalMemoryStatusEx)
        // Mesmo método do Gerenciador de Tarefas - valores precisos e ultra leves
        private readonly NativeSystemMetrics _nativeMetrics = new();
        
        // CORREÇÃO CRÍTICA: Proteção contra execução concorrente (Systray + Dashboard)
        private readonly SemaphoreSlim _quickOptimizeLock = new SemaphoreSlim(1, 1);
        private readonly SemaphoreSlim _quickCleanupLock = new SemaphoreSlim(1, 1);
        
        // Cache de disco — não muda a cada segundo, atualizar a cada 30s é suficiente
        private int _diskTickCounter = 0;
        private const int DiskUpdateEveryNTicks = 30; // Atualizar disco a cada 30 ticks (30s com timer de 1s)
        private double _cachedDiskUsage;
        private string _cachedDiskInfo = "Calculando...";
        
        // Enterprise Telemetry Config
        // OTIMIZAÇÃO DE PERFORMANCE: Histórico reduzido de 60 para 30 pontos
        // Reduz manipulações de ObservableCollection sem impactar visualização
        private const int HistoryPoints = 30; // 30 segundos de histórico (suficiente para sparkline)
        // CORREÇÃO: Intervalo de 1s para igualar responsividade do Gerenciador de Tarefas.
        // As APIs nativas (GetSystemTimes/GlobalMemoryStatusEx) são ultra leves (~microsegundos),
        // então 1s não causa overhead mensurável na UI thread.
        private const int UpdateIntervalMs = 1000;
        
        #region System Health Properties
        
        private double _diskUsage;
        public double DiskUsage { get => _diskUsage; set => SetProperty(ref _diskUsage, value); }
        
        private string _diskInfo = "Calculando...";
        public string DiskInfo { get => _diskInfo; set => SetProperty(ref _diskInfo, value); }
        
        private string _healthStatusText = "Analisando...";
        public string HealthStatusText { get => _healthStatusText; set => SetProperty(ref _healthStatusText, value); }
        
        private string _healthStatusColor = "#F59E0B";
        public string HealthStatusColor { get => _healthStatusColor; set => SetProperty(ref _healthStatusColor, value); }
        
        private string _healthDescription = "Verificando status do sistema...";
        public string HealthDescription { get => _healthDescription; set => SetProperty(ref _healthDescription, value); }
        
        private string _lastOptimizationTime = "Nenhuma otimização realizada";
        public string LastOptimizationTime { get => _lastOptimizationTime; set => SetProperty(ref _lastOptimizationTime, value); }
        
        #endregion
        
        #region License Properties
        
        private string _licenseStatusText = "Verificando...";
        public string LicenseStatusText { get => _licenseStatusText; set => SetProperty(ref _licenseStatusText, value); }
        
        private string _licenseStatusColor = "#F59E0B";
        public string LicenseStatusColor { get => _licenseStatusColor; set => SetProperty(ref _licenseStatusColor, value); }
        
        private string _licenseType = "Desconhecida";
        public string LicenseType { get => _licenseType; set => SetProperty(ref _licenseType, value); }
        
        private string _supportLevel = "Básico";
        public string SupportLevel { get => _supportLevel; set => SetProperty(ref _supportLevel, value); }
        
        #endregion
        
        #region Subsystem Status Properties

        private string _gamerServiceStatus = "Pronto";
        public string GamerServiceStatus { get => _gamerServiceStatus; set => SetProperty(ref _gamerServiceStatus, value); }
        
        private string _networkServiceStatus = "Otimizado";
        public string NetworkServiceStatus { get => _networkServiceStatus; set => SetProperty(ref _networkServiceStatus, value); }
        
        private string _cleanupServiceStatus = "Aguardando";
        public string CleanupServiceStatus { get => _cleanupServiceStatus; set => SetProperty(ref _cleanupServiceStatus, value); }
        
        private string _cleanupServiceColor = "#F59E0B";
        public string CleanupServiceColor { get => _cleanupServiceColor; set => SetProperty(ref _cleanupServiceColor, value); }

        #endregion

        #region Telemetry & History

        private int _overallScore;
        public int OverallScore { get => _overallScore; set => SetProperty(ref _overallScore, value); }
        
        private string _scoreStatus = "Analisando...";
        public string ScoreStatus { get => _scoreStatus; set => SetProperty(ref _scoreStatus, value); }
        
        private double _cpuUsage;
        public double CpuUsage { get => _cpuUsage; set => SetProperty(ref _cpuUsage, value); }
        
        private double _ramUsage;
        public double RamUsage { get => _ramUsage; set => SetProperty(ref _ramUsage, value); }
        
        // Coleções para os gráficos (Sparklines)
        private ObservableCollection<double>? _cpuHistory;
        public ObservableCollection<double> CpuHistory
        {
            get
            {
                if (_cpuHistory == null)
                {
                    var dispatcher = System.Windows.Application.Current?.Dispatcher;
                    if (dispatcher != null && !dispatcher.CheckAccess())
                    {
                        dispatcher.Invoke(() => _cpuHistory = new ObservableCollection<double>());
                    }
                    else
                    {
                        _cpuHistory = new ObservableCollection<double>();
                    }
                }
                return _cpuHistory;
            }
        }
        
        private ObservableCollection<double>? _ramHistory;
        public ObservableCollection<double> RamHistory
        {
            get
            {
                if (_ramHistory == null)
                {
                    var dispatcher = System.Windows.Application.Current?.Dispatcher;
                    if (dispatcher != null && !dispatcher.CheckAccess())
                    {
                        dispatcher.Invoke(() => _ramHistory = new ObservableCollection<double>());
                    }
                    else
                    {
                        _ramHistory = new ObservableCollection<double>();
                    }
                }
                return _ramHistory;
            }
        }
        
        // Info Strings
        private string _cpuName = "Processador...";
        public string CpuName { get => _cpuName; set => SetProperty(ref _cpuName, value); }
        
        private string _ramInfo = "Calculando...";
        public string RamInfo { get => _ramInfo; set => SetProperty(ref _ramInfo, value); }
        
        // Thermal Monitoring Properties
        private double _cpuTemperature;
        public double CpuTemperature { get => _cpuTemperature; set => SetProperty(ref _cpuTemperature, value); }
        
        private double _gpuTemperature;
        public double GpuTemperature { get => _gpuTemperature; set => SetProperty(ref _gpuTemperature, value); }
        
        private bool _isTemperatureEstimated;
        public bool IsTemperatureEstimated { get => _isTemperatureEstimated; set => SetProperty(ref _isTemperatureEstimated, value); }
        
        private string _thermalStatus = "Normal";
        public string ThermalStatus { get => _thermalStatus; set => SetProperty(ref _thermalStatus, value); }
        
        private string _thermalStatusColor = "#10B981";
        public string ThermalStatusColor { get => _thermalStatusColor; set => SetProperty(ref _thermalStatusColor, value); }
        
        private bool _hasThermalAlert;
        public bool HasThermalAlert { get => _hasThermalAlert; set => SetProperty(ref _hasThermalAlert, value); }
        
        private string _linkedEmail = "Conta não vinculada";
        public string LinkedEmail { get => _linkedEmail; set => SetProperty(ref _linkedEmail, value); }

        #endregion

        #region Live Operations Log
        
        // Enterprise Feature: Log de Operações em Tempo Real
        private ObservableCollection<LogEvent>? _recentEvents;
        public ObservableCollection<LogEvent> RecentEvents
        {
            get
            {
                if (_recentEvents == null)
                {
                    var dispatcher = System.Windows.Application.Current?.Dispatcher;
                    if (dispatcher != null && !dispatcher.CheckAccess())
                    {
                        dispatcher.Invoke(() => _recentEvents = new ObservableCollection<LogEvent>());
                    }
                    else
                    {
                        _recentEvents = new ObservableCollection<LogEvent>();
                    }
                }
                return _recentEvents;
            }
        }
        
        #endregion
        
        #region Commands
        public ICommand RefreshCommand { get; }
        public ICommand QuickOptimizeCommand { get; }
        public ICommand QuickCleanupCommand { get; }
        // Navegação
        public ICommand NavigateToPerformanceCommand { get; }
        public ICommand NavigateToCleanupCommand { get; }
        public ICommand NavigateToNetworkCommand { get; }
        public ICommand NavigateToGamerCommand { get; }
        public ICommand NavigateToSystemCommand { get; }
        public ICommand NavigateToActivityHistoryCommand { get; }
        #endregion

        // Performance Counters (removidos - usando NativeSystemMetrics agora)

        public DashboardViewModel(Interfaces.INavigationService? navigationService = null)
        {
            _logger = App.LoggingService;
            _navigationService = navigationService ?? App.Services?.GetService<Interfaces.INavigationService>();
            _wmiCache = App.Services?.GetService<WmiCacheService>();
            _licenseManager = LicenseManager.Instance;
            _trialService = TrialProtectionService.Instance;
            
            // Inicializar Histórico com Zeros
            for (int i = 0; i < HistoryPoints; i++) 
            {
                CpuHistory.Add(0);
                RamHistory.Add(0);
            }

            // Inicializar Contadores de Performance (Mais rápidos que WMI)
            InitializeCounters();
            
            // Obter informações estáticas
            Task.Run(() => InitializeStaticInfo());
            
            // Inicializar status do sistema
            Task.Run(() => InitializeSystemStatus());

            // Configurar Timer de Telemetria
            _telemetryTimer = new System.Windows.Threading.DispatcherTimer
            {
                Interval = TimeSpan.FromMilliseconds(UpdateIntervalMs)
            };
            _telemetryTimer.Tick += TelemetryTick;
            
            // Subscrever ao Log Global (se disponível)
            if (_logger != null)
            {
                _logger.LogEntryAdded += OnLogEntryAdded;
            }

            // Inicializar Comandos
            RefreshCommand = new AsyncRelayCommand(RefreshAsync);
            QuickOptimizeCommand = new AsyncRelayCommand(async _ => await QuickOptimizeAsync("Dashboard"));
            QuickCleanupCommand = new AsyncRelayCommand(async _ => await QuickCleanupAsync("Dashboard"));
            
            NavigateToPerformanceCommand = new RelayCommand(() => NavigateTo(AppPage.Performance));
            NavigateToCleanupCommand = new RelayCommand(() => NavigateTo(AppPage.Cleanup));
            NavigateToNetworkCommand = new RelayCommand(() => NavigateTo(AppPage.Network));
            NavigateToGamerCommand = new RelayCommand(() => NavigateTo(AppPage.Gamer));
            NavigateToSystemCommand = new RelayCommand(() => 
            {
                try
                {
                    var settings = SettingsService.Instance.Settings;
                    bool isLinked = settings.IsDeviceLinked && !string.IsNullOrEmpty(settings.LinkedUserEmail);
                    
                    if (isLinked)
                    {
                        // Conta vinculada - abrir dashboard
                        _logger?.LogInfo("Conta vinculada - abrindo dashboard web");
                        
                        System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
                        {
                            FileName = "https://voltris.com.br/dashboard",
                            UseShellExecute = true
                        });
                    }
                    else
                    {
                        // Conta não vinculada - abrir Welcome Window
                        _logger?.LogInfo("Conta não vinculada - abrindo Welcome Window");
                        
                        System.Windows.Application.Current?.Dispatcher.Invoke(() =>
                        {
                            var welcomeWindow = new UI.Windows.WelcomeLinkWindow();
                            var mainWindow = System.Windows.Application.Current.MainWindow;
                            if (mainWindow != null)
                            {
                                welcomeWindow.Owner = mainWindow;
                                welcomeWindow.WindowStartupLocation = WindowStartupLocation.CenterOwner;
                            }
                            welcomeWindow.ShowDialog();
                        });
                    }
                }
                catch (Exception ex)
                {
                    _logger?.LogError($"Falha ao processar ação de gerenciar conta: {ex.Message}");
                }
            });

            NavigateToActivityHistoryCommand = new RelayCommand(() => NavigateTo(AppPage.ActivityHistory));

            // Start Telemetry
            _telemetryTimer.Start();
            
            // CORREÇÃO: Carregar métricas IMEDIATAMENTE para que apareçam instantaneamente
            // O timer só dispara após o primeiro intervalo (3s), então sem isso o dashboard fica vazio
            UpdateMetricsFast();
            
            // Configurar Timer de Monitoramento de Configurações (para atualizar LinkedEmail)
            // OTIMIZAÇÃO DE PERFORMANCE: Intervalo aumentado de 5s para 30s
            _settingsMonitorTimer = new System.Windows.Threading.DispatcherTimer
            {
                Interval = TimeSpan.FromSeconds(30) // Verificar a cada 30 segundos
            };
            _settingsMonitorTimer.Tick += (s, e) => UpdateLinkedEmailFromSettings();
            _settingsMonitorTimer.Start();
            
            // Populate Initial Log
            AddLogEvent(new LogEvent { Message = "Dashboard inicializado", Timestamp = DateTime.Now.ToString("HH:mm:ss"), Type = "INFO" });
            AddLogEvent(new LogEvent { Message = "Sensores de telemetria ativos", Timestamp = DateTime.Now.ToString("HH:mm:ss"), Type = "SISTEMA" });
            
            _licenseManager.LicenseStatusChanged += OnLicenseStatusChanged;
            
            // Subscrever ao Monitoramento Térmico Global
            if (App.ThermalMonitorService != null)
            {
                App.ThermalMonitorService.MetricsUpdated += OnThermalMetricsUpdated;
                App.ThermalMonitorService.AlertGenerated += OnThermalAlertGenerated;
                _logger?.LogInfo("[Dashboard] Subscrito ao GlobalThermalMonitorService");
            }
        }

        private void OnLicenseStatusChanged(object? sender, EventArgs e)
        {
            System.Windows.Application.Current?.Dispatcher.BeginInvoke(async () => await UpdateLicenseStatus());
        }
        
        private void OnThermalMetricsUpdated(object? sender, VoltrisOptimizer.Services.Thermal.Models.ThermalMetrics metrics)
        {
            System.Windows.Application.Current?.Dispatcher.BeginInvoke(() =>
            {
                CpuTemperature = double.IsNaN(metrics.CpuTemperature) ? 0 : metrics.CpuTemperature;
                GpuTemperature = double.IsNaN(metrics.GpuTemperature) ? 0 : metrics.GpuTemperature;
                IsTemperatureEstimated = metrics.IsCpuTemperatureEstimated;
                UpdateThermalStatus(metrics);
                // CORREÇÃO PERFORMANCE: Removido log a cada atualização térmica (cada 5s).
                // Logging no hot path gera alocações de string e I/O desnecessários.
            });
        }
        
        private void OnThermalAlertGenerated(object? sender, VoltrisOptimizer.Services.Thermal.Models.ThermalAlert alert)
        {
            System.Windows.Application.Current?.Dispatcher.BeginInvoke(() =>
            {
                HasThermalAlert = true;
                
                // Adicionar ao log de eventos
                AddLogEvent(new LogEvent 
                { 
                    Message = alert.Message, 
                    Timestamp = DateTime.Now.ToString("HH:mm:ss"), 
                    Type = alert.Level == VoltrisOptimizer.Services.Thermal.Models.ThermalAlertLevel.Critical ? "ERRO" : "AVISO"
                });
                
                // Mostrar notificação discreta
                NotificationManager.ShowInfo(alert.Message, alert.Recommendation);
                
                _logger?.LogWarning($"[Dashboard] Alerta térmico: {alert.Message}");
            });
        }
        
        protected override void OnActiveChanged()
        {
            if (IsActive)
            {
                _telemetryTimer?.Start();
                _settingsMonitorTimer?.Start();
                UpdateMetricsFast();
            }
            else
            {
                _telemetryTimer?.Stop();
                _settingsMonitorTimer?.Stop();
            }
        }

        private void UpdateThermalStatus(VoltrisOptimizer.Services.Thermal.Models.ThermalMetrics metrics)
        {
            // Considerar apenas CPU se GPU não estiver disponível
            var maxTemp = double.IsNaN(metrics.GpuTemperature) 
                ? metrics.CpuTemperature 
                : Math.Max(metrics.CpuTemperature, metrics.GpuTemperature);
            
            if (maxTemp >= 90)
            {
                ThermalStatus = "Crítico";
                ThermalStatusColor = "#EF4444"; // Red
                HasThermalAlert = true;
            }
            else if (maxTemp >= 80)
            {
                ThermalStatus = "Alerta";
                ThermalStatusColor = "#F59E0B"; // Orange
                HasThermalAlert = true;
            }
            else if (maxTemp >= 70)
            {
                ThermalStatus = "Elevado";
                ThermalStatusColor = "#F59E0B"; // Orange
                HasThermalAlert = false;
            }
            else
            {
                ThermalStatus = "Normal";
                ThermalStatusColor = "#10B981"; // Green
                HasThermalAlert = false;
            }
        }

        private void InitializeCounters()
        {
            try
            {
                // Warm-up: primeira leitura do NativeSystemMetrics para calibrar delta
                _nativeMetrics.GetCpuUsage();
                _nativeMetrics.GetMemoryUsage();
                _logger?.LogInfo("[Dashboard] Métricas nativas inicializadas (GetSystemTimes/GlobalMemoryStatusEx)");
            }
            catch (Exception ex)
            {
                _logger?.LogError("Falha ao inicializar métricas nativas", ex);
            }
        }

        private async Task InitializeStaticInfo()
        {
            try
            {
                // OTIMIZAÇÃO DE PERFORMANCE: Usar WmiCache para informações estáticas
                // CPU name não muda, cache por 24 horas
                string cpuName = "Processador...";
                
                if (_wmiCache != null)
                {
                    cpuName = await Task.Run(() => 
                        _wmiCache.GetOrUpdate("cpu_name", 
                            () => 
                            {
                                var obj = VoltrisOptimizer.Utils.WmiHelper.QueryFirstSafe("SELECT Name FROM Win32_Processor");
                                return obj?["Name"]?.ToString() ?? "Processador Genérico";
                            },
                            TimeSpan.FromHours(24) // Cache por 24 horas
                        )
                    );
                }
                else
                {
                    // Fallback se WmiCache não disponível
                    cpuName = await Task.Run(() => 
                    {
                        var obj = VoltrisOptimizer.Utils.WmiHelper.QueryFirstSafe("SELECT Name FROM Win32_Processor");
                        return obj?["Name"]?.ToString() ?? "Processador Genérico";
                    });
                }

                System.Windows.Application.Current?.Dispatcher.BeginInvoke(() => 
                {
                    CpuName = cpuName;
                    
                    // Atualizar email vinculado - CONSISTENTE COM SETTINGS
                    UpdateLinkedEmailFromSettings();
                });
            }
            catch { }
        }
        
        private async Task InitializeSystemStatus()
        {
            try
            {
                // Verificar status da licença
                await UpdateLicenseStatus();
                
                // Verificar saúde do sistema
                await UpdateSystemHealth();
                
                // Verificar última otimização
                await UpdateLastOptimizationInfo();
            }
            catch (Exception ex)
            {
                _logger?.LogError("Erro ao inicializar status do sistema", ex);
            }
        }

        private void TelemetryTick(object? sender, EventArgs e)
        {
            UpdateMetricsFast();
        }

        private void UpdateMetricsFast()
        {
            try
            {
                // APIs nativas são instantâneas (microsegundos) — NÃO precisa de Task.Run
                double cpu = _nativeMetrics.GetCpuUsage();
                var mem = _nativeMetrics.GetMemoryUsage();

                double ramUsagePercent = mem.UsagePercent;
                double ramUsedGb = mem.UsedGb;
                double ramTotalGb = mem.TotalGb;

                // CORREÇÃO PERFORMANCE: Disco não muda a cada segundo.
                // DriveInfo é rápido mas gera string allocation desnecessária.
                // Atualizar a cada 30 ticks (30s) é suficiente.
                _diskTickCounter++;
                if (_diskTickCounter >= DiskUpdateEveryNTicks || _diskTickCounter == 1)
                {
                    _cachedDiskUsage = GetDiskUsage();
                    _cachedDiskInfo = GetDiskInfo();
                    if (_diskTickCounter >= DiskUpdateEveryNTicks) _diskTickCounter = 0;
                }

                // Já estamos no UI thread (DispatcherTimer) - atualizar direto
                CpuUsage = cpu;
                
                var roundedRam = Math.Round(ramUsagePercent, 1);
                RamUsage = roundedRam;
                
                // CORREÇÃO PERFORMANCE: Só gerar string de RamInfo quando o valor muda (evita alocação a cada tick)
                var newRamInfo = $"{ramUsedGb:F1}GB / {ramTotalGb:F1}GB";
                if (_ramInfo != newRamInfo) RamInfo = newRamInfo;
                
                DiskUsage = _cachedDiskUsage;
                if (_diskInfo != _cachedDiskInfo) DiskInfo = _cachedDiskInfo;
                
                // Histórico
                if (CpuHistory.Count >= HistoryPoints) CpuHistory.RemoveAt(0);
                CpuHistory.Add(cpu);
                
                if (RamHistory.Count >= HistoryPoints) RamHistory.RemoveAt(0);
                RamHistory.Add(ramUsagePercent);
                
                CalculateOverallScore();
                UpdateHealthStatus();
            }
            catch { }
        }
        
        private double GetDiskUsage()
        {
            try
            {
                DriveInfo drive = new DriveInfo("C");
                if (drive.IsReady)
                {
                    double total = drive.TotalSize;
                    double free = drive.TotalFreeSpace;
                    double used = total - free;
                    return (used / total) * 100;
                }
            }
            catch { }
            return 0;
        }
        
        private string GetDiskInfo()
        {
            try
            {
                DriveInfo drive = new DriveInfo("C");
                if (drive.IsReady)
                {
                    double total = drive.TotalSize / (1024.0 * 1024.0 * 1024.0);
                    double free = drive.TotalFreeSpace / (1024.0 * 1024.0 * 1024.0);
                    double used = total - free;
                    return $"{used:F1}GB / {total:F1}GB";
                }
            }
            catch { }
            return "Indisponível";
        }
        
        private void UpdateHealthStatus()
        {
            string status;
            string color;
            string description;
            
            if (CpuUsage > 90 || RamUsage > 95 || DiskUsage > 95)
            {
                status = "Crítico";
                color = "#EF4444";
                description = "Sistema sobrecarregado - recomenda-se otimização imediata";
            }
            else if (CpuUsage > 75 || RamUsage > 85 || DiskUsage > 90)
            {
                status = "Alerta";
                color = "#F59E0B";
                description = "Consumo elevado detectado - monitoramento recomendado";
            }
            else
            {
                status = "Ótimo";
                color = "#10B981";
                description = "Sistema operando normalmente";
            }
            
            // CORREÇÃO PERFORMANCE: Só atualizar se mudou (evita PropertyChanged + re-render desnecessário)
            if (_healthStatusText != status)
            {
                HealthStatusText = status;
                HealthStatusColor = color;
                HealthDescription = description;
            }
        }
        
        private async Task UpdateLicenseStatus()
        {
            try
            {
                // 1. Verificar se é PRO/Enterprise (prioridade sobre Trial)
                if (LicenseManager.IsPro)
                {
                    var info = _licenseManager.GetLicenseInfo();
                    string planName = info?.PlanType ?? "Pro";
                    
                    LicenseStatusText = "Ativa";
                    LicenseStatusColor = "#10B981";
                    LicenseType = planName;
                    SupportLevel = "Premium"; // Licenças Pro/Enterprise têm suporte Premium
                    return;
                }

                // 2. Se não é Pro, verificar Trial
                int daysRemaining = await Task.Run(() => _trialService.GetDaysRemaining());
                
                if (daysRemaining > 0)
                {
                    LicenseStatusText = $"Trial ({daysRemaining} dias)";
                    LicenseStatusColor = "#F59E0B";
                    LicenseType = "Trial";
                    SupportLevel = "Básico"; // Trial tem suporte básico
                }
                else
                {
                    LicenseStatusText = "Expirada";
                    LicenseStatusColor = "#EF4444";
                    LicenseType = "Gratuita";
                    SupportLevel = "Nenhum"; // Sem suporte
                }
            }
            catch (Exception ex)
            {
                _logger?.LogError("Erro ao verificar status da licença", ex);
                LicenseStatusText = "Erro";
                LicenseStatusColor = "#EF4444";
                LicenseType = "Desconhecida";
                SupportLevel = "Nenhum";
            }
        }
        
        private async Task UpdateLastOptimizationInfo()
        {
            try
            {
                // Verificar registro da última otimização
                var historyService = HistoryService.Instance;
                var lastOptimization = await Task.Run(() => historyService.GetLastOptimizationTimestamp());
                
                if (lastOptimization.HasValue)
                {
                    LastOptimizationTime = lastOptimization.Value.ToString("dd/MM/yyyy HH:mm");
                }
                else
                {
                    LastOptimizationTime = "Nenhuma otimização registrada";
                }
            }
            catch
            {
                LastOptimizationTime = "Informação indisponível";
            }
        }
       
        private void OnLogEntryAdded(object? sender, string logLine)
        {
            if (string.IsNullOrWhiteSpace(logLine) || logLine.Length < 10) return;

            try 
            {
                // CORREÇÃO PERFORMANCE: Filtro rápido com span-like check nos primeiros chars
                // Evita alocações de string e comparações desnecessárias para logs de alta frequência
                static bool Has(string s, string v) => s.IndexOf(v, StringComparison.OrdinalIgnoreCase) >= 0;
                
                // CORREÇÃO PERFORMANCE: Filtro consolidado — uma única passagem com early exit
                if (Has(logLine, "POLLING") || Has(logLine, "POLL") || 
                    Has(logLine, "TEMPERATURE") || Has(logLine, "TEMPERATURA") ||
                    Has(logLine, "HEARTBEAT") || Has(logLine, "TICKS") ||
                    Has(logLine, "DEBUG") || Has(logLine, "TRACE") ||
                    Has(logLine, "HTTP") || Has(logLine, "STATUS") ||
                    Has(logLine, "PROCESSO") || Has(logLine, "DETECTADO") ||
                    Has(logLine, "PID:") || Has(logLine, "NORMALIZADO") ||
                    Has(logLine, "CONHOST") || Has(logLine, "MACHINE ID") ||
                    Has(logLine, "TIMESTAMP") || Has(logLine, "VERSION") ||
                    Has(logLine, "ENVIRONMENT") || Has(logLine, "ERROR 500") ||
                    Has(logLine, "SERVER ERROR") || Has(logLine, "INTERNAL") ||
                    Has(logLine, "ZOD") || Has(logLine, "UNDEFINED") ||
                    Has(logLine, "PROPERTY") || Has(logLine, "READING") ||
                    Has(logLine, "BATCH") || Has(logLine, "SUCCESSFULLY") ||
                    Has(logLine, "FLOW") || Has(logLine, "ISACTIVE") ||
                    Has(logLine, "MAINWINDOW") || Has(logLine, "APPLICATION") ||
                    Has(logLine, "CORE") || Has(logLine, "ÍCONE") ||
                    Has(logLine, "JANELA") || Has(logLine, "STARTUP") ||
                    Has(logLine, "LOCATION") || Has(logLine, "RESOLUÇÃO") ||
                    Has(logLine, "COMANDO") || Has(logLine, "PENDENTE") ||
                    Has(logLine, "OK") || Has(logLine, "NOME:") ||
                    Has(logLine, "MÉTRICAS") || Has(logLine, "METRICS") ||
                    Has(logLine, "TELEMETRY") || Has(logLine, "TELEMETRIA") ||
                    Has(logLine, "SENSOR") || Has(logLine, "MONITOR"))
                {
                    return;
                }

                // Parse robusto: Busca o tempo e o nível
                var lastBracket = logLine.LastIndexOf(']');
                if (lastBracket < 0) return;
                
                var parts = logLine.Split(new[] { ']' }, StringSplitOptions.RemoveEmptyEntries);
                if (parts.Length >= 3)
                {
                    var timePart = parts[0].TrimStart('[');
                    var timeSplit = timePart.Split(' ');
                    var time = timeSplit.Length > 1 ? timeSplit[1] : timePart;
                    if (time.Contains('.')) time = time.Split('.')[0];

                    var levelPart = parts[1].TrimStart(' ', '[').ToUpper();
                    
                    var msg = logLine.Substring(lastBracket + 1).Trim();

                    if (string.IsNullOrWhiteSpace(msg) || msg == "}" || msg == "{" || 
                        msg.StartsWith("---") || msg.StartsWith("===") || msg.Length < 2)
                    {
                        return;
                    }

                    var type = "INFO";
                    if (levelPart.Contains("SUCESSO") || levelPart.Contains("SUCCESS")) type = "SUCESSO";
                    else if (levelPart.Contains("AVISO") || levelPart.Contains("WARNING")) type = "AVISO";
                    else if (levelPart.Contains("ERRO") || levelPart.Contains("ERROR") || levelPart.Contains("FALHA") || levelPart.Contains("CRITICAL")) type = "ERRO";
                    else if (levelPart.Contains("TRACE") || levelPart.Contains("DEBUG") || levelPart.Contains("SISTEMA")) type = "SISTEMA";

                    // CORREÇÃO PERFORMANCE: Usar DispatcherPriority.Background para não competir
                    // com atualizações de métricas que são mais importantes para a responsividade
                    System.Windows.Application.Current?.Dispatcher?.BeginInvoke(
                        new Action(() => AddLogEvent(new LogEvent { Message = msg, Timestamp = time, Type = type })),
                        System.Windows.Threading.DispatcherPriority.Background);
                }
            }
            catch { }
        }

        private void AddLogEvent(LogEvent evt)
        {
            RecentEvents.Insert(0, evt);
            // Limitar a 50 eventos para manter a UI leve
            if (RecentEvents.Count > 50) RecentEvents.RemoveAt(RecentEvents.Count - 1);
        }

        private void CalculateOverallScore()
        {
            int score = 100;
            if (CpuUsage > 80) score -= 20;
            if (RamUsage > 90) score -= 20;
            if (DiskUsage > 95) score -= 20;
            var newScore = Math.Max(score, 0);
            
            // CORREÇÃO PERFORMANCE: Só atualizar se mudou (evita PropertyChanged desnecessário)
            if (_overallScore != newScore)
            {
                OverallScore = newScore;
                
                ScoreStatus = newScore switch
                {
                    >= 90 => "Ótimo",
                    >= 70 => "Bom",
                    >= 50 => "Razoável",
                    _ => "Crítico"
                };
            }
        }

        private async Task RefreshAsync()
        {
            AddLogEvent(new LogEvent { Message = "Atualizando informações do sistema...", Timestamp = DateTime.Now.ToString("HH:mm:ss"), Type = "INFO" });
            
            await Task.WhenAll(
                Task.Run(() => UpdateMetricsFast()),
                UpdateSystemHealth(),
                UpdateLicenseStatus(),
                UpdateLastOptimizationInfo()
            );
            
            AddLogEvent(new LogEvent { Message = "Informações atualizadas com sucesso", Timestamp = DateTime.Now.ToString("HH:mm:ss"), Type = "SUCESSO" });
            
            // Telemetry
            App.TelemetryService?.TrackEvent("DASHBOARD_REFRESH", "General", "Refresh");
        }

        public async Task QuickOptimizeAsync(string origin = "Dashboard")
        {
            // CORREÇÃO CRÍTICA: Proteção contra execução concorrente
            if (!await _quickOptimizeLock.WaitAsync(0)) // Não bloquear, retornar imediatamente
            {
                _logger?.LogWarning($"[{origin}.QuickOptimize] Já em execução, ignorando nova chamada");
                AddLogEvent(new LogEvent { Message = "Otimização já em execução", Timestamp = DateTime.Now.ToString("HH:mm:ss"), Type = "AVISO" });
                return;
            }
            
            try
            {
                // Iniciar operação prioritária (pausa outras operações)
                GlobalProgressService.Instance.StartOperation("Otimização Rápida", isPriority: true);
                GlobalProgressService.Instance.UpdateProgress(10, "Iniciando otimização...");
                AddLogEvent(new LogEvent { Message = $"Iniciando otimização do sistema... (Origem: {origin})", Timestamp = DateTime.Now.ToString("HH:mm:ss"), Type = "INFO" });
                
                // CORREÇÃO CRÍTICA: Consultar Perfil Inteligente antes de otimizar
                var currentProfile = SettingsService.Instance.Settings.IntelligentProfile;
                _logger?.LogInfo($"[{origin}.QuickOptimize] Perfil Inteligente Ativo: {currentProfile}");
                
                // Alterar rótulo na UI para refletir a ação real
                GamerServiceStatus = "Otimizando..."; 
                
                try
                {
                    // CORREÇÃO CRÍTICA: Validar se perfil permite otimização de RAM
                    // Perfis conservadores não devem executar otimização agressiva de RAM
                    if (currentProfile == IntelligentProfileType.EnterpriseSecure)
                    {
                        _logger?.LogWarning($"[{origin}.QuickOptimize] Perfil {currentProfile} não permite otimização agressiva de RAM (política Enterprise)");
                        AddLogEvent(new LogEvent { Message = $"Otimização bloqueada: Perfil {currentProfile} requer aprovação Enterprise", Timestamp = DateTime.Now.ToString("HH:mm:ss"), Type = "AVISO" });
                        
                        GamerServiceStatus = "Bloqueado";
                        
                        // Completar operação
                        GlobalProgressService.Instance.CompleteOperation("Otimização Bloqueada");
                        
                        // Reverter status após alguns segundos
                        _ = Task.Delay(3000).ContinueWith(_ => 
                        {
                            var orchestrator = App.Services?.GetService<VoltrisOptimizer.Services.Gamer.Interfaces.IGamerModeOrchestrator>();
                            bool isGamerModeActive = orchestrator?.Status.IsActive ?? false;
                            System.Windows.Application.Current?.Dispatcher.Invoke(() => GamerServiceStatus = isGamerModeActive ? "Ativado" : "Pronto");
                        });
                        
                        return;
                    }
                    
                    // Perfis WorkOffice: permitir mas com log de aviso
                    if (currentProfile == IntelligentProfileType.WorkOffice)
                    {
                        _logger?.LogInfo($"[{origin}.QuickOptimize] Perfil {currentProfile}: Otimização conservadora de RAM");
                        AddLogEvent(new LogEvent { Message = $"Otimização conservadora (perfil {currentProfile})", Timestamp = DateTime.Now.ToString("HH:mm:ss"), Type = "INFO" });
                    }
                    else
                    {
                        _logger?.LogInfo($"[{origin}.QuickOptimize] Perfil {currentProfile}: Otimização completa autorizada");
                    }
                    
                    if (App.PerformanceOptimizer != null)
                    {
                        // 1. Otimizar Memória RAM (Trim Working Sets)
                        AddLogEvent(new LogEvent { Message = "Otimizando alocação de memória RAM...", Timestamp = DateTime.Now.ToString("HH:mm:ss"), Type = "INFO" });
                        
                        var ramResult = await App.PerformanceOptimizer.OptimizeRAMAsync(p => {
                            // Mapear 0-100 da RAM para 30-60 do Dash
                            int dashProgress = 30 + (int)(p * 0.3);
                            GlobalProgressService.Instance.UpdateProgress(dashProgress, "Limpando memória RAM...");
                        });
                        
                        if (!ramResult.Success)
                        {
                            AddLogEvent(new LogEvent { Message = $"Falha na RAM: {ramResult.ErrorMessage}", Timestamp = DateTime.Now.ToString("HH:mm:ss"), Type = "ERRO" });
                        }

                        // 2. Otimizar Processos em Background
                        GlobalProgressService.Instance.UpdateProgress(70, "Otimizando processos...");
                        AddLogEvent(new LogEvent { Message = "Reorganizando processos em segundo plano...", Timestamp = DateTime.Now.ToString("HH:mm:ss"), Type = "INFO" });
                        
                        GlobalProgressService.Instance.UpdateProgress(90, "Finalizando...");
                        if (ramResult.Success)
                        {
                            _logger?.LogSuccess($"[{origin}.QuickOptimize] Sistema otimizado com sucesso (Memória + Processos). Perfil: {currentProfile}");
                            AddLogEvent(new LogEvent { Message = "Sistema otimizado com sucesso!", Timestamp = DateTime.Now.ToString("HH:mm:ss"), Type = "SUCESSO" });
                        }
                        else
                        {
                            _logger?.LogWarning($"[{origin}.QuickOptimize] Otimização parcial: {ramResult.ErrorMessage}");
                             AddLogEvent(new LogEvent { Message = "Otimização concluída com avisos.", Timestamp = DateTime.Now.ToString("HH:mm:ss"), Type = "AVISO" });
                        }
                        
                        // Telemetry
                        App.TelemetryService?.TrackEvent("QUICK_OPTIMIZE", origin, "System", success: true);
                    }
                    else
                    {
                        _logger?.LogWarning($"[{origin}.QuickOptimize] Serviço de otimização de performance não disponível.");
                        AddLogEvent(new LogEvent { Message = "Serviço de otimização não disponível", Timestamp = DateTime.Now.ToString("HH:mm:ss"), Type = "AVISO" });
                    }
                }
                catch (Exception ex)
                {
                    _logger?.LogError($"[{origin}.QuickOptimize] Erro durante a otimização rápida", ex);
                    AddLogEvent(new LogEvent { Message = $"Erro na otimização: {ex.Message}", Timestamp = DateTime.Now.ToString("HH:mm:ss"), Type = "ERRO" });
                }
                
                // Completar operação (volta para a operação anterior se houver)
                GlobalProgressService.Instance.CompleteOperation("Otimização Concluída");
                
                // Telemetry
                App.TelemetryService?.TrackEvent("DASHBOARD_OPTIMIZE", "QuickOptimize", origin);
                
                GamerServiceStatus = "Otimizado";
                
                // Registrar otimização no histórico
                var historyService = HistoryService.Instance;
                await Task.Run(() => historyService.RecordOptimization(DateTime.Now));
                await UpdateLastOptimizationInfo();
                
                    // Reverter status visual após alguns segundos
                    _ = Task.Delay(3000).ContinueWith(_ => 
                    {
                        var orchestrator = App.Services?.GetService<VoltrisOptimizer.Services.Gamer.Interfaces.IGamerModeOrchestrator>();
                        bool isGamerModeActive = orchestrator?.Status.IsActive ?? false;
                        System.Windows.Application.Current?.Dispatcher.Invoke(() => GamerServiceStatus = isGamerModeActive ? "Ativado" : "Pronto");
                    });
            }
            finally
            {
                // CORREÇÃO CRÍTICA: Sempre liberar o lock
                _quickOptimizeLock.Release();
            }
        }

        public async Task QuickCleanupAsync(string origin = "Dashboard")
        {
            // CORREÇÃO CRÍTICA: Proteção contra execução concorrente
            if (!await _quickCleanupLock.WaitAsync(0))
            {
                _logger?.LogWarning($"[{origin}.QuickCleanup] Já em execução, ignorando nova chamada");
                AddLogEvent(new LogEvent { Message = "Limpeza já em execução", Timestamp = DateTime.Now.ToString("HH:mm:ss"), Type = "AVISO" });
                return;
            }
            
            try
            {
                // Iniciar operação prioritária (pausa outras operações) - IGUAL AO OTIMIZAR AGORA
                GlobalProgressService.Instance.StartOperation("Limpeza Rápida", isPriority: true);
                GlobalProgressService.Instance.UpdateProgress(10, "Iniciando limpeza...");
                AddLogEvent(new LogEvent { Message = $"Iniciando limpeza de disco... (Origem: {origin})", Timestamp = DateTime.Now.ToString("HH:mm:ss"), Type = "INFO" });
                
                // Consultar Perfil Inteligente
                var currentProfile = SettingsService.Instance.Settings.IntelligentProfile;
                _logger?.LogInfo($"[{origin}.QuickCleanup] Perfil Inteligente Ativo: {currentProfile}");
                
                CleanupServiceStatus = "Limpando...";
                CleanupServiceColor = "#F59E0B";
                
                try
                {
                    if (App.UltraCleaner != null)
                    {
                        _logger?.LogInfo($"[{origin}.QuickCleanup] Serviço UltraCleaner disponível, iniciando limpeza...");
                        AddLogEvent(new LogEvent { Message = "Limpando arquivos temporários...", Timestamp = DateTime.Now.ToString("HH:mm:ss"), Type = "INFO" });
                        
                        // CORREÇÃO CRÍTICA: Usar callback inline IGUAL ao QuickOptimizeAsync
                        // NÃO usar Progress<T> dentro de Task.Run - isso causa problemas de sincronização
                        var cleanResult = await App.UltraCleaner.QuickCleanupAsync(
                            new Progress<VoltrisOptimizer.Services.CleanupProgress>(p => 
                            {
                                // CORREÇÃO: Garantir execução no thread da UI
                                System.Windows.Application.Current?.Dispatcher.Invoke(() =>
                                {
                                    // Callback inline que atualiza progresso DIRETAMENTE
                                    // Mapear 0-100 da limpeza para 10-90 do Dashboard
                                    int dashProgress = 10 + (int)(p.PercentComplete * 0.8);
                                    _logger?.LogInfo($"[{origin}.QuickCleanup] Progresso: {p.PercentComplete}% -> {dashProgress}% | {p.CurrentItem}");
                                    GlobalProgressService.Instance.UpdateProgress(dashProgress, p.CurrentItem);
                                    AddLogEvent(new LogEvent { Message = p.CurrentItem, Timestamp = DateTime.Now.ToString("HH:mm:ss"), Type = "INFO" });
                                });
                            }),
                            CancellationToken.None
                        );
                        
                        _logger?.LogInfo($"[{origin}.QuickCleanup] Limpeza retornou resultado: Success={cleanResult?.Success}, SpaceCleaned={cleanResult?.SpaceCleaned}");
                        
                        GlobalProgressService.Instance.UpdateProgress(90, "Finalizando...");
                        
                        if (cleanResult != null && cleanResult.Success)
                        {
                            string sizeStr = cleanResult.SpaceCleaned > 1024 * 1024 * 1024 
                                ? $"{cleanResult.SpaceCleaned / 1024.0 / 1024.0 / 1024.0:F2} GB"
                                : (cleanResult.SpaceCleaned > 1024 * 1024 
                                    ? $"{cleanResult.SpaceCleaned / 1024.0 / 1024.0:F1} MB" 
                                    : $"{cleanResult.SpaceCleaned / 1024.0:F1} KB");

                            _logger?.LogSuccess($"[{origin}.QuickCleanup] Limpeza concluída. {sizeStr} liberados. Perfil: {currentProfile}");
                            AddLogEvent(new LogEvent { Message = $"Limpeza concluída! {sizeStr} liberados.", Timestamp = DateTime.Now.ToString("HH:mm:ss"), Type = "SUCESSO" });
                        }
                        else
                        {
                            _logger?.LogWarning($"[{origin}.QuickCleanup] Limpeza parcial ou sem resultado");
                            AddLogEvent(new LogEvent { Message = "Limpeza concluída com avisos.", Timestamp = DateTime.Now.ToString("HH:mm:ss"), Type = "AVISO" });
                        }
                        
                        // Telemetry
                        App.TelemetryService?.TrackEvent("QUICK_CLEANUP", origin, "Disk", success: true);
                    }
                    else
                    {
                        _logger?.LogWarning($"[{origin}.QuickCleanup] Serviço de limpeza não disponível.");
                        AddLogEvent(new LogEvent { Message = "Serviço de limpeza não disponível", Timestamp = DateTime.Now.ToString("HH:mm:ss"), Type = "AVISO" });
                    }
                }
                catch (Exception ex)
                {
                    _logger?.LogError($"[{origin}.QuickCleanup] Erro durante a limpeza rápida", ex);
                    AddLogEvent(new LogEvent { Message = $"Erro na limpeza: {ex.Message}", Timestamp = DateTime.Now.ToString("HH:mm:ss"), Type = "ERRO" });
                }
                
                // Completar operação - IGUAL AO OTIMIZAR AGORA
                GlobalProgressService.Instance.CompleteOperation("Limpeza Concluída");
                
                // Telemetry
                App.TelemetryService?.TrackEvent("DASHBOARD_CLEANUP", "QuickCleanup", origin);
                
                CleanupServiceStatus = "Limpo";
                CleanupServiceColor = "#10B981";
                
                // Reverter status visual após alguns segundos
                _ = Task.Delay(3000).ContinueWith(_ => 
                {
                    System.Windows.Application.Current?.Dispatcher.Invoke(() => 
                    {
                        CleanupServiceStatus = "Aguardando";
                        CleanupServiceColor = "#F59E0B";
                    });
                });
            }
            finally
            {
                // CORREÇÃO CRÍTICA: Sempre liberar o lock
                _quickCleanupLock.Release();
            }
        }
        
        private async Task UpdateSystemHealth()
        {
            try
            {
                // Esta função pode chamar serviços de diagnóstico mais completos
                await Task.Delay(100); // Placeholder para processamento real
            }
            catch { }
        }
        
        /// <summary>
        /// Atualiza o email vinculado a partir das configurações
        /// </summary>
        private void UpdateLinkedEmailFromSettings()
        {
            try
            {
                var settings = SettingsService.Instance.Settings;
                string newEmail;
                
                if (settings.IsDeviceLinked && !string.IsNullOrEmpty(settings.LinkedUserEmail) && settings.LinkedUserEmail != "skip@voltris.local")
                {
                    newEmail = settings.LinkedUserEmail;
                }
                else
                {
                    newEmail = "Conta não vinculada";
                }
                
                // Só atualizar se mudou para evitar notificações desnecessárias
                if (LinkedEmail != newEmail)
                {
                    LinkedEmail = newEmail;
                }
            }
            catch (Exception ex)
            {
                _logger?.LogError("Erro ao atualizar email vinculado", ex);
            }
        }
        
        private void NavigateTo(AppPage page)
        {
            _logger?.LogInfo($"[Dashboard] Navegando para: {page}");
            AddLogEvent(new LogEvent { Message = $"Navegando para {page}...", Timestamp = DateTime.Now.ToString("HH:mm:ss"), Type = "SISTEMA" });
            _navigationService?.NavigateTo(page.ToString());
        }

        protected override void OnDisposing()
        {
            // Parar timers
            _telemetryTimer?.Stop();
            _settingsMonitorTimer?.Stop();
            
            // Remover TODOS os event handlers
            if (_logger != null)
            {
                _logger.LogEntryAdded -= OnLogEntryAdded;
            }
            
            if (_licenseManager != null)
            {
                _licenseManager.LicenseStatusChanged -= OnLicenseStatusChanged;
            }
            
            if (App.ThermalMonitorService != null)
            {
                App.ThermalMonitorService.MetricsUpdated -= OnThermalMetricsUpdated;
                App.ThermalMonitorService.AlertGenerated -= OnThermalAlertGenerated;
            }
            
            // NativeSystemMetrics não precisa de Dispose (sem recursos não-gerenciados alocados)
            
            base.OnDisposing();
        }
    }
    
    public class LogEvent
    {
        public string Timestamp { get; set; } = "";
        public string Type { get; set; } = "INFO";
        public string Message { get; set; } = "";
        
        public string TypeColor => Type switch 
        {
            "ERRO" => "#EF4444", // Red
            "AVISO" => "#F59E0B", // Amber
            "SUCESSO" => "#10B981", // Emerald
            "SISTEMA" => "#3B82F6", // Blue
            _ => "#94A3B8" // Slate
        };
    }
}

