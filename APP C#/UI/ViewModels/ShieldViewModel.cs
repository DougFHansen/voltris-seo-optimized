using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Input;
using System.Windows.Media;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Services.Shield;
using VoltrisOptimizer.Services.Shield.Network;

namespace VoltrisOptimizer.UI.ViewModels
{
    public class ShieldViewModel : ViewModelBase, IDisposable
    {
        private bool _disposed = false;
        private readonly VoltrisShieldService _shieldService;
        private readonly NetworkMonitorService _networkMonitor;
        private readonly DeviceTrackerService _deviceTracker;
        private readonly StartupMonitorService _startupMonitor;
        private readonly AdwareScannerService _adwareScanner;
        private readonly RansomwareMonitorService _ransomwareMonitor;
        private readonly ILoggingService _logger;
        
        private bool _isProtectionActive;
        private bool _isScanning;
        private bool _isGamerModeEnabled;
        private string _lastScanTime = "Nunca";
        private string _statusMessage = "Proteção desativada";
        private int _threatsDetected;
        private DefenderStatus? _defenderStatus;
        
        // Scan Results
        private bool _isScanResultVisible;
        private string _scanResultSummary = string.Empty;
        private string _scanResultType = string.Empty;
        private int _scanProgress;
        private string _scanProgressText = string.Empty;
        private ObservableCollection<ScanThreatItemViewModel> _scanThreatItems;
        
        // Network Guardian
        private bool _isNetworkMonitoringActive;
        private bool _isNetworkScanning;
        private int _onlineDevicesCount;
        private int _totalDevicesCount;
        private ObservableCollection<NetworkDeviceViewModel> _networkDevices;
        
        // Startup Monitor
        private bool _isStartupScanning;
        private ObservableCollection<StartupItemViewModel> _startupItems;
        private int _startupItemsCount;
        
        // Adware Scanner
        private bool _isAdwareScanning;
        private ObservableCollection<AdwareItemViewModel> _adwareItems;
        private int _adwareItemsCount;
        
        // Ransomware Monitor
        private bool _isRansomwareMonitoringActive;
        private string _ransomwareStatus = "Inativo";
        private int _ransomwareAlertsCount;
        
        #region Properties
        
        public bool IsProtectionActive
        {
            get => _isProtectionActive;
            set => SetProperty(ref _isProtectionActive, value);
        }
        
        public bool IsScanning
        {
            get => _isScanning;
            set => SetProperty(ref _isScanning, value);
        }
        
        public bool IsGamerModeEnabled
        {
            get => _isGamerModeEnabled;
            set
            {
                if (SetProperty(ref _isGamerModeEnabled, value))
                {
                    _shieldService.SetGamerMode(value);
                }
            }
        }
        
        public string LastScanTime
        {
            get => _lastScanTime;
            set => SetProperty(ref _lastScanTime, value);
        }
        
        public string StatusMessage
        {
            get => _statusMessage;
            set => SetProperty(ref _statusMessage, value);
        }
        
        public int ThreatsDetected
        {
            get => _threatsDetected;
            set => SetProperty(ref _threatsDetected, value);
        }
        
        // Scan Results Properties
        public bool IsScanResultVisible
        {
            get => _isScanResultVisible;
            set => SetProperty(ref _isScanResultVisible, value);
        }
        
        public string ScanResultSummary
        {
            get => _scanResultSummary;
            set => SetProperty(ref _scanResultSummary, value);
        }
        
        public string ScanResultType
        {
            get => _scanResultType;
            set => SetProperty(ref _scanResultType, value);
        }
        
        public int ScanProgress
        {
            get => _scanProgress;
            set => SetProperty(ref _scanProgress, value);
        }
        
        public string ScanProgressText
        {
            get => _scanProgressText;
            set => SetProperty(ref _scanProgressText, value);
        }
        
        public ObservableCollection<ScanThreatItemViewModel> ScanThreatItems
        {
            get => _scanThreatItems;
            set => SetProperty(ref _scanThreatItems, value);
        }
        
        public Brush StatusColor => IsProtectionActive 
            ? new SolidColorBrush(Color.FromRgb(0, 255, 136)) 
            : new SolidColorBrush(Color.FromRgb(255, 68, 102));
        
        public string StatusIcon => IsProtectionActive ? "✓" : "⚠";
        
        public bool IsDefenderEnabled => _defenderStatus?.IsEnabled ?? false;
        public bool IsDefenderUpToDate => _defenderStatus?.IsUpToDate ?? false;
        
        // Network Guardian Properties
        public bool IsNetworkMonitoringActive
        {
            get => _isNetworkMonitoringActive;
            set => SetProperty(ref _isNetworkMonitoringActive, value);
        }
        
        public bool IsNetworkScanning
        {
            get => _isNetworkScanning;
            set => SetProperty(ref _isNetworkScanning, value);
        }
        
        public int OnlineDevicesCount
        {
            get => _onlineDevicesCount;
            set => SetProperty(ref _onlineDevicesCount, value);
        }
        
        public int TotalDevicesCount
        {
            get => _totalDevicesCount;
            set => SetProperty(ref _totalDevicesCount, value);
        }
        
        public ObservableCollection<NetworkDeviceViewModel> NetworkDevices
        {
            get => _networkDevices;
            set => SetProperty(ref _networkDevices, value);
        }
        
        // Startup Monitor Properties
        public bool IsStartupScanning
        {
            get => _isStartupScanning;
            set => SetProperty(ref _isStartupScanning, value);
        }
        
        public ObservableCollection<StartupItemViewModel> StartupItems
        {
            get => _startupItems;
            set => SetProperty(ref _startupItems, value);
        }
        
        public int StartupItemsCount
        {
            get => _startupItemsCount;
            set => SetProperty(ref _startupItemsCount, value);
        }
        
        // Adware Scanner Properties
        public bool IsAdwareScanning
        {
            get => _isAdwareScanning;
            set => SetProperty(ref _isAdwareScanning, value);
        }
        
        public ObservableCollection<AdwareItemViewModel> AdwareItems
        {
            get => _adwareItems;
            set => SetProperty(ref _adwareItems, value);
        }
        
        public int AdwareItemsCount
        {
            get => _adwareItemsCount;
            set => SetProperty(ref _adwareItemsCount, value);
        }
        
        // Ransomware Monitor Properties
        public bool IsRansomwareMonitoringActive
        {
            get => _isRansomwareMonitoringActive;
            set => SetProperty(ref _isRansomwareMonitoringActive, value);
        }
        
        public string RansomwareStatus
        {
            get => _ransomwareStatus;
            set => SetProperty(ref _ransomwareStatus, value);
        }
        
        public int RansomwareAlertsCount
        {
            get => _ransomwareAlertsCount;
            set => SetProperty(ref _ransomwareAlertsCount, value);
        }
        
        #endregion
        
        #region Commands
        
        public ICommand ToggleProtectionCommand { get; }
        public ICommand RunQuickScanCommand { get; }
        public ICommand RunFullScanCommand { get; }
        public ICommand RunAdwareScanCommand { get; }
        public ICommand StartDefenderScanCommand { get; }
        public ICommand RefreshDefenderStatusCommand { get; }
        
        // Network Guardian Commands
        public ICommand ToggleNetworkMonitoringCommand { get; }
        public ICommand RunNetworkScanCommand { get; }
        
        // Startup Monitor Commands
        public ICommand ScanStartupItemsCommand { get; }
        public ICommand DisableStartupItemCommand { get; }
        public ICommand RemoveStartupItemCommand { get; }
        
        // Adware Scanner Commands
        public ICommand ScanAdwareCommand { get; }
        public ICommand RemoveAdwareItemCommand { get; }
        
        // Ransomware Monitor Commands
        public ICommand ToggleRansomwareMonitoringCommand { get; }
        
        // Scan Results Commands
        public ICommand RemoveScanThreatCommand { get; }
        public ICommand IgnoreScanThreatCommand { get; }
        public ICommand QuarantineScanThreatCommand { get; }
        public ICommand ClearScanResultsCommand { get; }
        
        #endregion
        
        #region Constructor
        
        public ShieldViewModel(
            VoltrisShieldService shieldService, 
            NetworkMonitorService networkMonitor,
            DeviceTrackerService deviceTracker,
            StartupMonitorService startupMonitor,
            AdwareScannerService adwareScanner,
            RansomwareMonitorService ransomwareMonitor,
            ILoggingService logger)
        {
            _shieldService = shieldService ?? throw new ArgumentNullException(nameof(shieldService));
            _networkMonitor = networkMonitor ?? throw new ArgumentNullException(nameof(networkMonitor));
            _deviceTracker = deviceTracker ?? throw new ArgumentNullException(nameof(deviceTracker));
            _startupMonitor = startupMonitor ?? throw new ArgumentNullException(nameof(startupMonitor));
            _adwareScanner = adwareScanner ?? throw new ArgumentNullException(nameof(adwareScanner));
            _ransomwareMonitor = ransomwareMonitor ?? throw new ArgumentNullException(nameof(ransomwareMonitor));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            
            // Inicializar coleções
            _networkDevices = new ObservableCollection<NetworkDeviceViewModel>();
            _startupItems = new ObservableCollection<StartupItemViewModel>();
            _adwareItems = new ObservableCollection<AdwareItemViewModel>();
            _scanThreatItems = new ObservableCollection<ScanThreatItemViewModel>();
            
            // Conectar eventos
            _shieldService.StatusChanged += OnShieldStatusChanged;
            _shieldService.ThreatDetected += OnThreatDetected;
            _networkMonitor.StatusChanged += OnNetworkMonitoringStatusChanged;
            _deviceTracker.NewDeviceDetected += OnNewDeviceDetected;
            _deviceTracker.DeviceDisconnected += OnDeviceDisconnected;
            _ransomwareMonitor.StatusChanged += OnRansomwareMonitoringStatusChanged;
            _ransomwareMonitor.SuspiciousActivityDetected += OnRansomwareAlertDetected;
            
            // Comandos principais
            ToggleProtectionCommand = new RelayCommand(async () => await ToggleProtectionAsync());
            RunQuickScanCommand = new RelayCommand(async () => await RunQuickScanAsync(), () => !IsScanning);
            RunFullScanCommand = new RelayCommand(async () => await RunFullScanAsync(), () => !IsScanning);
            RunAdwareScanCommand = new RelayCommand(async () => await RunAdwareScanAsync(), () => !IsScanning);
            StartDefenderScanCommand = new RelayCommand(async () => await StartDefenderScanAsync());
            RefreshDefenderStatusCommand = new RelayCommand(async () => await RefreshDefenderStatusAsync());
            
            // Network Guardian Commands
            ToggleNetworkMonitoringCommand = new RelayCommand(async () => await ToggleNetworkMonitoringAsync());
            RunNetworkScanCommand = new RelayCommand(async () => await RunNetworkScanAsync(), () => !IsNetworkScanning);
            
            // Startup Monitor Commands
            ScanStartupItemsCommand = new RelayCommand(async () => await ScanStartupItemsAsync(), () => !IsStartupScanning);
            DisableStartupItemCommand = new RelayCommand(async (item) => await DisableStartupItemAsync(item as StartupItemViewModel));
            RemoveStartupItemCommand = new RelayCommand(async (item) => await RemoveStartupItemAsync(item as StartupItemViewModel));
            
            // Adware Scanner Commands
            ScanAdwareCommand = new RelayCommand(async () => await ScanAdwareAsync(), () => !IsAdwareScanning);
            RemoveAdwareItemCommand = new RelayCommand(async (item) => await RemoveAdwareItemAsync(item as AdwareItemViewModel));
            
            // Ransomware Monitor Commands
            ToggleRansomwareMonitoringCommand = new RelayCommand(async () => await ToggleRansomwareMonitoringAsync());
            
            // Scan Results Commands
            RemoveScanThreatCommand = new RelayCommand(async (item) => await RemoveScanThreatAsync(item as ScanThreatItemViewModel));
            IgnoreScanThreatCommand = new RelayCommand((item) => IgnoreScanThreat(item as ScanThreatItemViewModel));
            QuarantineScanThreatCommand = new RelayCommand(async (item) => await QuarantineScanThreatAsync(item as ScanThreatItemViewModel));
            ClearScanResultsCommand = new RelayCommand(() => { IsScanResultVisible = false; ScanThreatItems.Clear(); });
            
            // Inicializar
            _ = InitializeAsync();
        }
        
        #endregion
        
        #region Initialization
        
        private async Task InitializeAsync()
        {
            try
            {
                _logger.LogInfo("[ShieldVM] Inicializando Voltris Shield...");
                
                if (!IsProtectionActive)
                {
                    _logger.LogInfo("[ShieldVM] Ativando proteção por padrão...");
                    await _shieldService.ActivateProtectionAsync();
                }
                
                if (!IsGamerModeEnabled)
                {
                    _logger.LogInfo("[ShieldVM] Ativando Modo Gamer por padrão...");
                    IsGamerModeEnabled = true;
                }
                
                if (!IsNetworkMonitoringActive)
                {
                    _logger.LogInfo("[ShieldVM] Ativando Network Guardian por padrão...");
                    await ToggleNetworkMonitoringAsync();
                }
                
                if (!IsRansomwareMonitoringActive)
                {
                    _logger.LogInfo("[ShieldVM] Ativando Ransomware Monitor por padrão...");
                    await ToggleRansomwareMonitoringAsync();
                }
                
                await RefreshDefenderStatusAsync();
                
                if (_shieldService.LastScanTime.HasValue)
                {
                    LastScanTime = _shieldService.LastScanTime.Value.ToString("dd/MM/yyyy HH:mm");
                }
                
                _logger.LogSuccess("[ShieldVM] Voltris Shield inicializado com sucesso");
            }
            catch (Exception ex)
            {
                _logger.LogError("[ShieldVM] Erro na inicialização", ex);
            }
        }
        
        #endregion
        
        #region Protection Toggle
        
        private async Task ToggleProtectionAsync()
        {
            try
            {
                if (IsProtectionActive)
                    await _shieldService.DeactivateProtectionAsync();
                else
                    await _shieldService.ActivateProtectionAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError("[ShieldVM] Erro ao alternar proteção", ex);
                StatusMessage = "Erro ao alternar proteção";
            }
        }
        
        #endregion
        
        #region Scan Methods
        
        public async Task RunQuickScanAsync()
        {
            bool started = false;
            try
            {
                IsScanning = true;
                IsScanResultVisible = false;
                ScanProgress = 0;
                ScanProgressText = "Iniciando scan rápido...";
                StatusMessage = "Executando scan rápido...";

                // REPARO: Verificar retorno — se bloqueado, não chamar CompleteOperation
                started = Services.GlobalProgressService.Instance.StartOperation("Scan Rápido", isPriority: true);

                var result = await _shieldService.RunQuickScanAsync((progress, message) =>
                {
                    ScanProgress = progress;
                    ScanProgressText = message;
                    if (started) Services.GlobalProgressService.Instance.UpdateProgress(progress, message);
                });

                ThreatsDetected = result.ThreatsFound;
                LastScanTime = result.CompletedAt.ToString("dd/MM/yyyy HH:mm");
                StatusMessage = result.ThreatsFound > 0
                    ? $"Scan rápido: {result.ThreatsFound} ameaças encontradas em {result.ItemsScanned} áreas"
                    : $"Scan rápido concluído: sistema limpo ({result.ItemsScanned} áreas verificadas)";

                PopulateScanResults(result);

                try
                {
                    var shieldNotification = App.Services?.GetService(typeof(ShieldNotificationService)) as ShieldNotificationService;
                    shieldNotification?.NotifyScanComplete(result);
                }
                catch { }

                if (started)
                    Services.GlobalProgressService.Instance.CompleteOperation(
                        result.ThreatsFound > 0
                            ? $"⚠️ Scan Rápido: {result.ThreatsFound} ameaças encontradas"
                            : $"✅ Scan Rápido: sistema limpo");
            }
            catch (Exception ex)
            {
                _logger.LogError("[ShieldVM] Erro no scan rápido", ex);
                StatusMessage = "Erro no scan rápido";
                ScanProgressText = "Erro durante o scan";
                if (started) Services.GlobalProgressService.Instance.CompleteOperation("❌ Erro no scan rápido");
            }
            finally
            {
                IsScanning = false;
                ScanProgress = 0;
            }
        }
        
        public async Task RunFullScanAsync()
        {
            bool started = false;
            try
            {
                IsScanning = true;
                IsScanResultVisible = false;
                ScanProgress = 0;
                ScanProgressText = "Iniciando scan completo...";
                StatusMessage = "Executando scan completo do sistema...";

                started = Services.GlobalProgressService.Instance.StartOperation("Scan Completo", isPriority: true);

                var result = await _shieldService.RunFullScanAsync((progress, message) =>
                {
                    ScanProgress = progress;
                    ScanProgressText = message;
                    if (started) Services.GlobalProgressService.Instance.UpdateProgress(progress, message);
                });

                ThreatsDetected = result.ThreatsFound;
                LastScanTime = result.CompletedAt.ToString("dd/MM/yyyy HH:mm");
                StatusMessage = result.ThreatsFound > 0
                    ? $"Scan completo: {result.ThreatsFound} ameaças encontradas em {result.ItemsScanned} áreas"
                    : $"Scan completo concluído: sistema limpo ({result.ItemsScanned} áreas verificadas)";

                PopulateScanResults(result);

                try
                {
                    var shieldNotification = App.Services?.GetService(typeof(ShieldNotificationService)) as ShieldNotificationService;
                    shieldNotification?.NotifyScanComplete(result);
                }
                catch { }

                if (started)
                    Services.GlobalProgressService.Instance.CompleteOperation(
                        result.ThreatsFound > 0
                            ? $"⚠️ Scan Completo: {result.ThreatsFound} ameaças encontradas"
                            : $"✅ Scan Completo: sistema limpo");
            }
            catch (Exception ex)
            {
                _logger.LogError("[ShieldVM] Erro no scan completo", ex);
                StatusMessage = "Erro no scan completo";
                ScanProgressText = "Erro durante o scan";
                if (started) Services.GlobalProgressService.Instance.CompleteOperation("❌ Erro no scan completo");
            }
            finally
            {
                IsScanning = false;
                ScanProgress = 0;
            }
        }
        
        private async Task RunAdwareScanAsync()
        {
            bool started = false;
            try
            {
                IsScanning = true;
                IsScanResultVisible = false;
                ScanProgress = 0;
                ScanProgressText = "Iniciando scan de adware...";
                StatusMessage = "Executando scan de adware...";

                started = Services.GlobalProgressService.Instance.StartOperation("Scan de Adware", isPriority: true);

                var result = await _shieldService.RunAdwareScanAsync((progress, message) =>
                {
                    ScanProgress = progress;
                    ScanProgressText = message;
                    if (started) Services.GlobalProgressService.Instance.UpdateProgress(progress, message);
                });

                ThreatsDetected = result.ThreatsFound;
                LastScanTime = result.CompletedAt.ToString("dd/MM/yyyy HH:mm");
                StatusMessage = result.ThreatsFound > 0
                    ? $"Scan de adware: {result.ThreatsFound} itens detectados"
                    : "Scan de adware concluído: nenhum adware encontrado";

                PopulateScanResults(result);

                try
                {
                    var shieldNotification = App.Services?.GetService(typeof(ShieldNotificationService)) as ShieldNotificationService;
                    shieldNotification?.NotifyScanComplete(result);
                }
                catch { }

                if (started)
                    Services.GlobalProgressService.Instance.CompleteOperation(
                        result.ThreatsFound > 0
                            ? $"⚠️ Adware: {result.ThreatsFound} itens detectados"
                            : "✅ Adware: sistema limpo");
            }
            catch (Exception ex)
            {
                _logger.LogError("[ShieldVM] Erro no scan de adware", ex);
                StatusMessage = "Erro no scan de adware";
                ScanProgressText = "Erro durante o scan";
                if (started) Services.GlobalProgressService.Instance.CompleteOperation("❌ Erro no scan de adware");
            }
            finally
            {
                IsScanning = false;
                ScanProgress = 0;
            }
        }
        
        #endregion
        
        #region Scan Results & Threat Actions
        
        private void PopulateScanResults(ScanResult result)
        {
            System.Windows.Application.Current.Dispatcher.InvokeAsync(() =>
            {
                ScanThreatItems.Clear();
                
                ScanResultType = result.ScanType switch
                {
                    ScanType.Quick => "Scan Rápido",
                    ScanType.Full => "Scan Completo",
                    ScanType.Adware => "Scan de Adware",
                    _ => "Scan"
                };
                
                // CORREÇÃO: Usar Threats.Count como fonte de verdade (não ThreatsFound)
                if (result.Threats.Count > 0)
                {
                    ScanResultSummary = $"{result.Threats.Count} ameaça(s) encontrada(s) em {result.ItemsScanned} áreas verificadas";
                    
                    foreach (var threat in result.Threats)
                    {
                        ScanThreatItems.Add(new ScanThreatItemViewModel(threat));
                    }
                }
                else
                {
                    ScanResultSummary = $"Nenhuma ameaça encontrada — {result.ItemsScanned} áreas verificadas";
                }
                
                IsScanResultVisible = true;
                _logger.LogInfo($"[ShieldVM] Resultados populados: {result.Threats.Count} ameaças detalhadas");
            });
        }
        
        private async Task RemoveScanThreatAsync(ScanThreatItemViewModel? item)
        {
            if (item == null) return;
            
            try
            {
                _logger.LogInfo($"[ShieldVM] Removendo ameaça: {item.Name}");
                
                var adwareItem = new AdwareItem
                {
                    Name = item.Name,
                    Path = item.Path,
                    Type = item.ThreatType == "RegistryKey" ? AdwareType.RegistryKey : AdwareType.Directory,
                    Severity = item.Severity == ThreatSeverity.High ? AdwareSeverity.High
                             : item.Severity == ThreatSeverity.Medium ? AdwareSeverity.Medium
                             : AdwareSeverity.Low
                };
                
                var success = await _adwareScanner.RemoveAdwareItemAsync(adwareItem);
                
                if (success)
                {
                    await System.Windows.Application.Current.Dispatcher.InvokeAsync(() =>
                    {
                        ScanThreatItems.Remove(item);
                        if (ThreatsDetected > 0) ThreatsDetected--;
                        StatusMessage = $"Ameaça removida: {item.Name}";
                        
                        if (ScanThreatItems.Count == 0)
                            ScanResultSummary = "Todas as ameaças foram tratadas";
                    });
                    _logger.LogSuccess($"[ShieldVM] Ameaça removida: {item.Name}");
                }
                else
                {
                    StatusMessage = $"Falha ao remover: {item.Name}";
                    _logger.LogWarning($"[ShieldVM] Falha ao remover ameaça: {item.Name}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[ShieldVM] Erro ao remover ameaça: {item.Name}", ex);
                StatusMessage = $"Erro ao remover: {item.Name}";
            }
        }
        
        private void IgnoreScanThreat(ScanThreatItemViewModel? item)
        {
            if (item == null) return;
            
            _logger.LogInfo($"[ShieldVM] Ameaça ignorada: {item.Name}");
            ScanThreatItems.Remove(item);
            if (ThreatsDetected > 0) ThreatsDetected--;
            StatusMessage = $"Ameaça ignorada: {item.Name}";
            
            if (ScanThreatItems.Count == 0)
                ScanResultSummary = "Todas as ameaças foram tratadas";
        }
        
        private async Task QuarantineScanThreatAsync(ScanThreatItemViewModel? item)
        {
            if (item == null) return;
            
            try
            {
                _logger.LogInfo($"[ShieldVM] Colocando em quarentena: {item.Name}");
                
                // Mover para pasta de quarentena
                var quarantinePath = System.IO.Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                    "Voltris", "Quarantine");
                
                if (!System.IO.Directory.Exists(quarantinePath))
                    System.IO.Directory.CreateDirectory(quarantinePath);
                
                bool success = false;
                
                await Task.Run(() =>
                {
                    try
                    {
                        if (System.IO.File.Exists(item.Path))
                        {
                            var destName = $"{DateTime.Now:yyyyMMdd_HHmmss}_{System.IO.Path.GetFileName(item.Path)}.quarantine";
                            var destPath = System.IO.Path.Combine(quarantinePath, destName);
                            System.IO.File.Move(item.Path, destPath);
                            success = true;
                        }
                        else if (System.IO.Directory.Exists(item.Path))
                        {
                            var destName = $"{DateTime.Now:yyyyMMdd_HHmmss}_{System.IO.Path.GetFileName(item.Path)}.quarantine";
                            var destPath = System.IO.Path.Combine(quarantinePath, destName);
                            System.IO.Directory.Move(item.Path, destPath);
                            success = true;
                        }
                        else
                        {
                            // Item já não existe no disco, considerar como sucesso
                            success = true;
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"[ShieldVM] Erro ao mover para quarentena: {item.Path}", ex);
                    }
                });
                
                if (success)
                {
                    await System.Windows.Application.Current.Dispatcher.InvokeAsync(() =>
                    {
                        ScanThreatItems.Remove(item);
                        if (ThreatsDetected > 0) ThreatsDetected--;
                        StatusMessage = $"Em quarentena: {item.Name}";
                        
                        if (ScanThreatItems.Count == 0)
                            ScanResultSummary = "Todas as ameaças foram tratadas";
                    });
                    _logger.LogSuccess($"[ShieldVM] Ameaça em quarentena: {item.Name}");
                }
                else
                {
                    StatusMessage = $"Falha ao colocar em quarentena: {item.Name}";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[ShieldVM] Erro na quarentena: {item.Name}", ex);
                StatusMessage = $"Erro na quarentena: {item.Name}";
            }
        }
        
        #endregion
        
        #region Defender Integration
        
        private async Task StartDefenderScanAsync()
        {
            bool started = false;
            try
            {
                StatusMessage = "Iniciando scan do Windows Defender...";

                started = Services.GlobalProgressService.Instance.StartOperation("Windows Defender Scan", isPriority: true);
                if (started) Services.GlobalProgressService.Instance.UpdateProgress(30, "Iniciando Windows Defender...");

                var success = await _shieldService.StartDefenderScanAsync();

                if (success)
                {
                    StatusMessage = "Scan do Defender iniciado com sucesso";
                    if (started) Services.GlobalProgressService.Instance.CompleteOperation("✅ Defender Scan iniciado");
                }
                else
                {
                    StatusMessage = "Falha ao iniciar scan do Defender";
                    if (started) Services.GlobalProgressService.Instance.CompleteOperation("❌ Falha ao iniciar Defender");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("[ShieldVM] Erro ao iniciar scan do Defender", ex);
                StatusMessage = "Erro ao iniciar scan do Defender";
                if (started) Services.GlobalProgressService.Instance.CompleteOperation("❌ Erro no Defender Scan");
            }
        }
        
        private async Task RefreshDefenderStatusAsync()
        {
            try
            {
                _defenderStatus = await _shieldService.GetDefenderStatusAsync();
                OnPropertyChanged(nameof(IsDefenderEnabled));
                OnPropertyChanged(nameof(IsDefenderUpToDate));
            }
            catch (Exception ex)
            {
                _logger.LogError("[ShieldVM] Erro ao atualizar status do Defender", ex);
            }
        }
        
        #endregion
        
        #region Event Handlers
        
        private void OnShieldStatusChanged(object? sender, ShieldStatusChangedEventArgs e)
        {
            if (e == null) return;
            
            IsProtectionActive = e.IsActive;
            StatusMessage = e.Message;
            OnPropertyChanged(nameof(StatusColor));
            OnPropertyChanged(nameof(StatusIcon));
        }
        
        private void OnThreatDetected(object? sender, ThreatDetectedEventArgs e)
        {
            if (e == null) return;
            
            ThreatsDetected++;
            StatusMessage = $"Ameaça detectada: {e.ThreatType}";
            
            // Adicionar à lista visível de ameaças em tempo real
            System.Windows.Application.Current.Dispatcher.InvokeAsync(() =>
            {
                ScanThreatItems.Add(new ScanThreatItemViewModel(new ScanThreatItem
                {
                    Name = System.IO.Path.GetFileName(e.FilePath),
                    Path = e.FilePath,
                    ThreatType = e.ThreatType,
                    Severity = e.Severity
                }));
                IsScanResultVisible = true;
                ScanResultType = "Proteção em Tempo Real";
                ScanResultSummary = $"{ScanThreatItems.Count} ameaça(s) detectada(s)";
            });
        }
        
        #endregion
        
        #region Network Guardian Methods
        
        private async Task ToggleNetworkMonitoringAsync()
        {
            try
            {
                if (IsNetworkMonitoringActive)
                {
                    await _networkMonitor.StopMonitoringAsync();
                }
                else
                {
                    var success = await _networkMonitor.StartMonitoringAsync();
                    if (success)
                    {
                        UpdateNetworkDevicesList();
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("[ShieldVM] Erro ao alternar monitoramento de rede", ex);
            }
        }
        
        public async Task RunNetworkScanAsync()
        {
            bool started = false;
            try
            {
                IsNetworkScanning = true;

                started = Services.GlobalProgressService.Instance.StartOperation("Scan de Rede", isPriority: true);
                if (started) Services.GlobalProgressService.Instance.UpdateProgress(20, "Escaneando dispositivos na rede...");

                var success = await _networkMonitor.RunManualScanAsync();

                if (success)
                {
                    UpdateNetworkDevicesList();
                    if (started)
                    {
                        Services.GlobalProgressService.Instance.UpdateProgress(100, $"Scan concluído: {OnlineDevicesCount} dispositivos");
                        Services.GlobalProgressService.Instance.CompleteOperation($"✅ Rede: {OnlineDevicesCount} dispositivos online");
                    }
                }
                else
                {
                    if (started) Services.GlobalProgressService.Instance.CompleteOperation("❌ Erro no scan de rede");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("[ShieldVM] Erro no scan de rede", ex);
                if (started) Services.GlobalProgressService.Instance.CompleteOperation("❌ Erro no scan de rede");
            }
            finally
            {
                IsNetworkScanning = false;
            }
        }
        
        private void UpdateNetworkDevicesList()
        {
            try
            {
                _logger.LogInfo("[ShieldVM] Atualizando lista de dispositivos de rede...");
                
                _ = System.Windows.Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    NetworkDevices.Clear();
                    
                    foreach (var device in _deviceTracker.KnownDevices.OrderByDescending(d => d.IsOnline).ThenBy(d => d.FriendlyName))
                    {
                        NetworkDevices.Add(new NetworkDeviceViewModel(device));
                    }
                    
                    OnlineDevicesCount = _deviceTracker.GetOnlineDeviceCount();
                    TotalDevicesCount = _deviceTracker.GetTotalDeviceCount();
                    
                    _logger.LogSuccess($"[ShieldVM] Lista atualizada: {OnlineDevicesCount}/{TotalDevicesCount} dispositivos online");
                });
            }
            catch (Exception ex)
            {
                _logger.LogError("[ShieldVM] Erro ao atualizar lista de dispositivos", ex);
            }
        }
        
        private void OnNetworkMonitoringStatusChanged(object? sender, MonitoringStatusChangedEventArgs e)
        {
            if (e == null) return;
            IsNetworkMonitoringActive = e.IsActive;
        }
        
        private void OnNewDeviceDetected(object? sender, DeviceEventArgs e)
        {
            if (e?.Device == null) return;
            _logger.LogInfo($"[ShieldVM] Novo dispositivo detectado: {e.Device.Hostname}");
            UpdateNetworkDevicesList();
        }
        
        private void OnDeviceDisconnected(object? sender, DeviceEventArgs e)
        {
            if (e?.Device == null) return;
            _logger.LogInfo($"[ShieldVM] Dispositivo desconectado: {e.Device.Hostname}");
            UpdateNetworkDevicesList();
        }
        
        #endregion
        
        #region Startup Monitor Methods
        
        private async Task ScanStartupItemsAsync()
        {
            bool started = false;
            try
            {
                IsStartupScanning = true;
                StatusMessage = "Escaneando itens de inicialização...";

                started = Services.GlobalProgressService.Instance.StartOperation("Scan de Inicialização", isPriority: true);
                if (started) Services.GlobalProgressService.Instance.UpdateProgress(30, "Analisando programas de inicialização...");

                var items = await _startupMonitor.GetAllStartupItemsAsync();

                if (started) Services.GlobalProgressService.Instance.UpdateProgress(80, "Processando resultados...");

                await System.Windows.Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    StartupItems.Clear();
                    foreach (var item in items)
                    {
                        StartupItems.Add(new StartupItemViewModel(item));
                    }
                    StartupItemsCount = items.Count;
                });

                StatusMessage = $"Scan de inicialização concluído: {items.Count} itens encontrados";
                if (started) Services.GlobalProgressService.Instance.CompleteOperation($"✅ Startup: {items.Count} itens encontrados");
            }
            catch (Exception ex)
            {
                _logger.LogError("[ShieldVM] Erro no scan de inicialização", ex);
                StatusMessage = "Erro no scan de inicialização";
                if (started) Services.GlobalProgressService.Instance.CompleteOperation("❌ Erro no scan de inicialização");
            }
            finally
            {
                IsStartupScanning = false;
            }
        }
        
        private async Task DisableStartupItemAsync(StartupItemViewModel? item)
        {
            if (item == null) return;
            
            try
            {
                var success = await _startupMonitor.DisableStartupItemAsync(item.GetStartupItem());
                if (success)
                {
                    item.IsEnabled = false;
                    StatusMessage = $"Item desativado: {item.Name}";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("[ShieldVM] Erro ao desativar item", ex);
            }
        }
        
        private async Task RemoveStartupItemAsync(StartupItemViewModel? item)
        {
            if (item == null) return;
            
            try
            {
                var success = await _startupMonitor.RemoveStartupItemAsync(item.GetStartupItem());
                if (success)
                {
                    await System.Windows.Application.Current.Dispatcher.InvokeAsync(() =>
                    {
                        StartupItems.Remove(item);
                        StartupItemsCount = StartupItems.Count;
                    });
                    StatusMessage = $"Item removido: {item.Name}";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("[ShieldVM] Erro ao remover item", ex);
            }
        }
        
        #endregion
        
        #region Adware Scanner Methods
        
        private async Task ScanAdwareAsync()
        {
            bool started = false;
            try
            {
                IsAdwareScanning = true;
                StatusMessage = "Escaneando adware...";

                started = Services.GlobalProgressService.Instance.StartOperation("Scan de Adware", isPriority: true);
                if (started) Services.GlobalProgressService.Instance.UpdateProgress(10, "Iniciando scan de adware...");

                var items = await _adwareScanner.ScanForAdwareAsync();

                if (started) Services.GlobalProgressService.Instance.UpdateProgress(100, $"Scan concluído: {items.Count} itens detectados");

                await System.Windows.Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    AdwareItems.Clear();
                    foreach (var item in items)
                    {
                        AdwareItems.Add(new AdwareItemViewModel(item));
                    }
                    AdwareItemsCount = items.Count;
                });

                StatusMessage = $"Scan de adware concluído: {items.Count} itens detectados";
                if (started) Services.GlobalProgressService.Instance.CompleteOperation($"✅ Scan de Adware: {items.Count} itens detectados");
            }
            catch (Exception ex)
            {
                _logger.LogError("[ShieldVM] Erro no scan de adware", ex);
                StatusMessage = "Erro no scan de adware";
                if (started) Services.GlobalProgressService.Instance.CompleteOperation("❌ Erro no scan de adware");
            }
            finally
            {
                IsAdwareScanning = false;
            }
        }
        
        private async Task RemoveAdwareItemAsync(AdwareItemViewModel? item)
        {
            if (item == null) return;
            
            try
            {
                var success = await _adwareScanner.RemoveAdwareItemAsync(item.GetAdwareItem());
                if (success)
                {
                    await System.Windows.Application.Current.Dispatcher.InvokeAsync(() =>
                    {
                        AdwareItems.Remove(item);
                        AdwareItemsCount = AdwareItems.Count;
                    });
                    StatusMessage = $"Adware removido: {item.Name}";
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("[ShieldVM] Erro ao remover adware", ex);
            }
        }
        
        #endregion
        
        #region Ransomware Monitor Methods
        
        private async Task ToggleRansomwareMonitoringAsync()
        {
            // REPARO: Verificar retorno de StartOperation — se bloqueado (false), NÃO chamar
            // CompleteOperation. Um CompleteOperation órfão faria Pop da operação errada na pilha
            // (ex: 'Reparo Completo Ultra Avançado'). Causa raiz do bug confirmado no log 16:41:41.
            bool started = false;
            try
            {
                if (IsRansomwareMonitoringActive)
                {
                    started = Services.GlobalProgressService.Instance.StartOperation("Ransomware Monitor", isPriority: true);
                    if (started) Services.GlobalProgressService.Instance.UpdateProgress(50, "Desativando monitoramento...");

                    await _ransomwareMonitor.StopMonitoringAsync();
                    IsRansomwareMonitoringActive = false;
                    RansomwareStatus = "Inativo";

                    if (started) Services.GlobalProgressService.Instance.CompleteOperation("⚠️ Ransomware Monitor desativado");
                }
                else
                {
                    started = Services.GlobalProgressService.Instance.StartOperation("Ransomware Monitor", isPriority: true);
                    if (started) Services.GlobalProgressService.Instance.UpdateProgress(50, "Ativando monitoramento...");

                    await _ransomwareMonitor.StartMonitoringAsync();
                    IsRansomwareMonitoringActive = true;
                    RansomwareStatus = "Monitorando pastas críticas";

                    if (started) Services.GlobalProgressService.Instance.CompleteOperation("✅ Ransomware Monitor ativado - Proteção em tempo real");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("[ShieldVM] Erro ao alternar monitoramento de ransomware", ex);
                if (started) Services.GlobalProgressService.Instance.CompleteOperation("❌ Erro ao alternar Ransomware Monitor");
            }
        }
        
        private void OnRansomwareAlertDetected(object? sender, RansomwareAlertEventArgs e)
        {
            if (e == null) return;
            RansomwareAlertsCount++;
            StatusMessage = $"ALERTA: {e.AlertType}";
            _logger.LogWarning($"[ShieldVM] Ransomware alert: {e.AlertType} - {e.Details}");
        }
        
        private void OnRansomwareMonitoringStatusChanged(object? sender, MonitoringStatusChangedEventArgs e)
        {
            if (e == null) return;
            _ = System.Windows.Application.Current.Dispatcher.InvokeAsync(() =>
            {
                IsRansomwareMonitoringActive = e.IsActive;
                RansomwareStatus = e.IsActive ? "Monitorando pastas críticas" : "Inativo";
            });
        }
        
        #endregion
        
        #region IDisposable
        
        public void Dispose()
        {
            if (_disposed) return;
            
            try
            {
                _logger.LogInfo("[ShieldVM] Disposing ShieldViewModel...");
                
                _shieldService.StatusChanged -= OnShieldStatusChanged;
                _shieldService.ThreatDetected -= OnThreatDetected;
                _networkMonitor.StatusChanged -= OnNetworkMonitoringStatusChanged;
                _deviceTracker.NewDeviceDetected -= OnNewDeviceDetected;
                _deviceTracker.DeviceDisconnected -= OnDeviceDisconnected;
                _ransomwareMonitor.StatusChanged -= OnRansomwareMonitoringStatusChanged;
                _ransomwareMonitor.SuspiciousActivityDetected -= OnRansomwareAlertDetected;
                
                _logger.LogSuccess("[ShieldVM] ShieldViewModel disposed successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError("[ShieldVM] Erro ao fazer dispose do ViewModel", ex);
            }
            finally
            {
                _disposed = true;
            }
        }
        
        #endregion
    }
    
    #region ViewModels Auxiliares
    
    public class ScanThreatItemViewModel : ViewModelBase
    {
        private readonly ScanThreatItem _item;
        
        public string Name => _item.Name;
        public string Path => _item.Path;
        public string ThreatType => _item.ThreatType;
        public ThreatSeverity Severity => _item.Severity;
        
        public string SeverityText => _item.Severity switch
        {
            ThreatSeverity.Critical => "Crítico",
            ThreatSeverity.High => "Alto",
            ThreatSeverity.Medium => "Médio",
            _ => "Baixo"
        };
        
        public Brush SeverityColor => _item.Severity switch
        {
            ThreatSeverity.Critical => new SolidColorBrush(Color.FromRgb(220, 38, 38)),
            ThreatSeverity.High => new SolidColorBrush(Color.FromRgb(255, 68, 102)),
            ThreatSeverity.Medium => new SolidColorBrush(Color.FromRgb(255, 170, 0)),
            _ => new SolidColorBrush(Color.FromRgb(250, 204, 21))
        };
        
        public string ThreatTypeDisplay => _item.ThreatType switch
        {
            "Directory" => "Diretório Suspeito",
            "RegistryKey" => "Chave de Registro",
            "File" => "Arquivo Suspeito",
            _ => _item.ThreatType
        };
        
        public ScanThreatItemViewModel(ScanThreatItem item)
        {
            _item = item ?? throw new ArgumentNullException(nameof(item));
        }
    }
    
    public class StartupItemViewModel : ViewModelBase
    {
        private readonly StartupItem _item;
        private bool _isEnabled;
        
        public string Name => _item.Name;
        public string Path => _item.Path;
        public string Location => _item.Location.ToString();
        public bool IsSuspicious => _item.IsSuspicious;
        
        public bool IsEnabled
        {
            get => _isEnabled;
            set => SetProperty(ref _isEnabled, value);
        }
        
        public Brush StatusColor => IsSuspicious 
            ? new SolidColorBrush(Color.FromRgb(255, 68, 102)) 
            : new SolidColorBrush(Color.FromRgb(0, 255, 136));
        
        public StartupItemViewModel(StartupItem item)
        {
            _item = item ?? throw new ArgumentNullException(nameof(item));
            _isEnabled = item.IsEnabled;
        }
        
        public StartupItem GetStartupItem() => _item;
    }
    
    public class AdwareItemViewModel : ViewModelBase
    {
        private readonly AdwareItem _item;
        
        public string Name => _item.Name;
        public string Path => _item.Path;
        public string Type => _item.Type.ToString();
        public string Severity => _item.Severity.ToString();
        
        public Brush SeverityColor => _item.Severity switch
        {
            AdwareSeverity.High => new SolidColorBrush(Color.FromRgb(255, 68, 102)),
            AdwareSeverity.Medium => new SolidColorBrush(Color.FromRgb(255, 170, 0)),
            _ => new SolidColorBrush(Color.FromRgb(255, 255, 136))
        };
        
        public AdwareItemViewModel(AdwareItem item)
        {
            _item = item ?? throw new ArgumentNullException(nameof(item));
        }
        
        public AdwareItem GetAdwareItem() => _item;
    }
    
    #endregion
    
    public class NetworkDeviceViewModel : ViewModelBase
    {
        private readonly NetworkDevice _device;
        
        public string Hostname => _device.Hostname;
        public string IPAddress => _device.IPAddress;
        public string MacAddress => _device.MacAddress;
        public string Vendor => _device.Vendor;
        public string DeviceType => _device.DeviceType;
        public string OperatingSystem => _device.OperatingSystem;
        public string FriendlyName => _device.FriendlyName;
        public string DeviceIcon => _device.DeviceIcon;
        public bool IsGateway => _device.IsGateway;
        public int ConfidenceLevel => _device.ConfidenceLevel;
        public bool IsOnline => _device.IsOnline;
        public bool IsNew => _device.IsNew;
        public string FirstSeenText => _device.FirstSeen.ToString("dd/MM/yyyy HH:mm");
        public string LastSeenText => _device.LastSeen.ToString("HH:mm:ss");
        
        public Brush StatusColor => IsOnline 
            ? new SolidColorBrush(Color.FromRgb(0, 255, 136)) 
            : new SolidColorBrush(Color.FromRgb(255, 68, 102));
        
        public string StatusText => IsOnline ? "Online" : "Offline";
        
        public string DeviceInfo
        {
            get
            {
                if (IsGateway)
                    return $"Gateway • {DeviceType}";
                
                if (!string.IsNullOrEmpty(OperatingSystem) && OperatingSystem != "Unknown")
                    return $"{DeviceType} • {OperatingSystem}";
                
                return DeviceType;
            }
        }
        
        public string ConfidenceText => ConfidenceLevel > 0 ? $"{ConfidenceLevel}% confiança" : "";
        
        public NetworkDeviceViewModel(NetworkDevice device)
        {
            _device = device ?? throw new ArgumentNullException(nameof(device));
        }
    }
}
