using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading.Tasks;
using System.Windows.Input;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Services.Power;
using DiagnosticIssue = VoltrisOptimizer.Services.Power.DiagnosticIssue;

namespace VoltrisOptimizer.UI.ViewModels
{
    public class EnergyViewModel : ViewModelBase
    {
        private readonly SmartEnergyService _energyService;
        private readonly PowerPlanEditorService _editorService;
        private readonly EnergyDiagnosticsService _diagnosticsService;
        private readonly EnergyMonitorService _monitorService;
        private readonly ILoggingService _logger;

        // ── Plans ─────────────────────────────────────────────────────────────

        private ObservableCollection<PowerPlanInfo> _plans = new();
        public ObservableCollection<PowerPlanInfo> Plans
        {
            get => _plans;
            set => SetProperty(ref _plans, value);
        }

        private PowerPlanInfo? _selectedPlan;
        public PowerPlanInfo? SelectedPlan
        {
            get => _selectedPlan;
            set
            {
                if (SetProperty(ref _selectedPlan, value) && value != null)
                {
                    _logger.LogInfo($"[EnergyViewModel] SelectedPlan changed => guid={value.Guid} name={value.Name}");
                    _ = LoadPlanSettingsAsync(value.Guid);
                }
            }
        }

        // ── Plan Settings (Editor) ────────────────────────────────────────────

        private int _cpuMin = 5;
        public int CpuMin
        {
            get => _cpuMin;
            set => SetProperty(ref _cpuMin, value);
        }

        private int _cpuMax = 100;
        public int CpuMax
        {
            get => _cpuMax;
            set => SetProperty(ref _cpuMax, value);
        }

        private int _cpuBoostMode = 2;
        public int CpuBoostMode
        {
            get => _cpuBoostMode;
            set => SetProperty(ref _cpuBoostMode, value);
        }

        private bool _usbSuspend = true;
        public bool UsbSuspend
        {
            get => _usbSuspend;
            set => SetProperty(ref _usbSuspend, value);
        }

        private int _pcieLinkState = 0;
        public int PcieLinkState
        {
            get => _pcieLinkState;
            set => SetProperty(ref _pcieLinkState, value);
        }

        private int _diskTimeoutAc = 0;
        public int DiskTimeoutAc
        {
            get => _diskTimeoutAc;
            set => SetProperty(ref _diskTimeoutAc, value);
        }

        private int _displayTimeoutAc = 15;
        public int DisplayTimeoutAc
        {
            get => _displayTimeoutAc;
            set => SetProperty(ref _displayTimeoutAc, value);
        }

        private int _wirelessMode = 0;
        public int WirelessMode
        {
            get => _wirelessMode;
            set => SetProperty(ref _wirelessMode, value);
        }

        // ── Recommendations ───────────────────────────────────────────────────

        private ObservableCollection<EnergyRecommendation> _recommendations = new();
        public ObservableCollection<EnergyRecommendation> Recommendations
        {
            get => _recommendations;
            set => SetProperty(ref _recommendations, value);
        }

        private EnergyRecommendation? _selectedRecommendation;
        public EnergyRecommendation? SelectedRecommendation
        {
            get => _selectedRecommendation;
            set => SetProperty(ref _selectedRecommendation, value);
        }

        // ── Diagnostics ───────────────────────────────────────────────────────

        private ObservableCollection<DiagnosticIssue> _diagnosticIssues = new();
        public ObservableCollection<DiagnosticIssue> DiagnosticIssues
        {
            get => _diagnosticIssues;
            set => SetProperty(ref _diagnosticIssues, value);
        }

        private ThrottlingStatus _throttlingStatus = new();
        public ThrottlingStatus ThrottlingStatus
        {
            get => _throttlingStatus;
            set => SetProperty(ref _throttlingStatus, value);
        }

        // ── Real-time Monitor ─────────────────────────────────────────────────

        private double _cpuFreqMhz;
        public double CpuFreqMhz
        {
            get => _cpuFreqMhz;
            set => SetProperty(ref _cpuFreqMhz, value);
        }

        private double _cpuUsage;
        public double CpuUsage
        {
            get => _cpuUsage;
            set => SetProperty(ref _cpuUsage, value);
        }

        private double _cpuTemp;
        public double CpuTemp
        {
            get => _cpuTemp;
            set => SetProperty(ref _cpuTemp, value);
        }

        private double _ramUsage;
        public double RamUsage
        {
            get => _ramUsage;
            set => SetProperty(ref _ramUsage, value);
        }

        private string _activePlanName = "Carregando...";
        public string ActivePlanName
        {
            get => _activePlanName;
            set => SetProperty(ref _activePlanName, value);
        }

        private bool _isOnBattery;
        public bool IsOnBattery
        {
            get => _isOnBattery;
            set => SetProperty(ref _isOnBattery, value);
        }

        private int _batteryPercent = -1;
        public int BatteryPercent
        {
            get => _batteryPercent;
            set => SetProperty(ref _batteryPercent, value);
        }

        private string _batteryText = "";
        public string BatteryText
        {
            get => _batteryText;
            set => SetProperty(ref _batteryText, value);
        }

        private ObservableCollection<double> _cpuFreqHistory = new();
        public ObservableCollection<double> CpuFreqHistory
        {
            get => _cpuFreqHistory;
            set => SetProperty(ref _cpuFreqHistory, value);
        }

        private ObservableCollection<double> _cpuUsageHistory = new();
        public ObservableCollection<double> CpuUsageHistory
        {
            get => _cpuUsageHistory;
            set => SetProperty(ref _cpuUsageHistory, value);
        }

        // ── Energy Score ──────────────────────────────────────────────────────

        private EnergyScore _energyScore = new();
        public EnergyScore EnergyScore
        {
            get => _energyScore;
            set => SetProperty(ref _energyScore, value);
        }

        // ── Status ────────────────────────────────────────────────────────────

        private string _statusMessage = string.Empty;
        public string StatusMessage
        {
            get => _statusMessage;
            set => SetProperty(ref _statusMessage, value);
        }

        private string _statusColorHex = "#00FF88";
        public string StatusColorHex
        {
            get => _statusColorHex;
            set => SetProperty(ref _statusColorHex, value);
        }

        private string _deviceTypeText = "Detectando...";
        public string DeviceTypeText
        {
            get => _deviceTypeText;
            set => SetProperty(ref _deviceTypeText, value);
        }

        private string _cpuName = "Detectando...";
        public string CpuName
        {
            get => _cpuName;
            set => SetProperty(ref _cpuName, value);
        }

        private bool _isEditorExpanded;
        public bool IsEditorExpanded
        {
            get => _isEditorExpanded;
            set => SetProperty(ref _isEditorExpanded, value);
        }

        // ── Commands ──────────────────────────────────────────────────────────

        public ICommand LoadPlansCommand { get; }
        public ICommand ActivatePlanCommand { get; }
        public ICommand ClonePlanCommand { get; }
        public ICommand DeletePlanCommand { get; }
        public ICommand ApplyEditorSettingsCommand { get; }
        public ICommand ApplyProfileCommand { get; }
        public ICommand RunDiagnosticsCommand { get; }
        public ICommand FixAllIssuesCommand { get; }
        public ICommand RestoreDefaultsCommand { get; }
        public ICommand ExportPlanCommand { get; }
        public ICommand ImportPlanCommand { get; }
        public ICommand ToggleEditorCommand { get; }
        public ICommand UnlockMaxPerformanceCommand { get; }
        public ICommand DisablePowerThrottlingCommand { get; }

        // ── Selected Profile (for visual highlight) ───────────────────────────

        private EnergyRecommendation? _selectedProfile;
        public EnergyRecommendation? SelectedProfile
        {
            get => _selectedProfile;
            set => SetProperty(ref _selectedProfile, value);
        }

        private bool _isPowerThrottlingEnabled;
        public bool IsPowerThrottlingEnabled
        {
            get => _isPowerThrottlingEnabled;
            set => SetProperty(ref _isPowerThrottlingEnabled, value);
        }

        private bool _isFirstActivation = true;

        protected override void OnActiveChanged()
        {
            if (IsActive)
            {
                if (_isFirstActivation)
                {
                    _isFirstActivation = false;
                    _ = InitializeAsync();
                }
                else
                {
                    _monitorService?.Start();
                }
            }
            else
            {
                _monitorService?.Stop();
            }
        }

        // ─────────────────────────────────────────────────────────────────────

        public EnergyViewModel()
        {
            _logger = App.LoggingService ?? new LoggingService(
                System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs"));
            _logger.LogInfo("[EnergyViewModel] Construtor iniciado. Logger: " + _logger.GetType().Name);

            _energyService      = new SmartEnergyService(_logger);
            _editorService      = new PowerPlanEditorService(_logger);
            _diagnosticsService = new EnergyDiagnosticsService(_logger);
            _monitorService     = new EnergyMonitorService(_logger);

            _logger.LogInfo("[EnergyViewModel] Serviços criados: SmartEnergy, PlanEditor, Diagnostics, Monitor.");

            LoadPlansCommand           = new AsyncRelayCommand(LoadPlansAsync);
            ActivatePlanCommand        = new AsyncRelayCommand(async p => await ActivatePlanAsync(p as PowerPlanInfo));
            ClonePlanCommand           = new AsyncRelayCommand(async p => await ClonePlanAsync(p as PowerPlanInfo));
            DeletePlanCommand          = new AsyncRelayCommand(async p => await DeletePlanAsync(p as PowerPlanInfo));
            ApplyEditorSettingsCommand = new AsyncRelayCommand(ApplyEditorSettingsAsync);
            ApplyProfileCommand        = new AsyncRelayCommand(async p => await ApplyProfileAsync(p as EnergyRecommendation));
            RunDiagnosticsCommand      = new AsyncRelayCommand(RunDiagnosticsAsync);
            FixAllIssuesCommand        = new AsyncRelayCommand(FixAllIssuesAsync);
            RestoreDefaultsCommand     = new AsyncRelayCommand(RestoreDefaultsAsync);
            ExportPlanCommand          = new AsyncRelayCommand(async p => await ExportPlanAsync(p as PowerPlanInfo));
            ImportPlanCommand          = new AsyncRelayCommand(ImportPlanAsync);
            ToggleEditorCommand        = new RelayCommand(() =>
            {
                IsEditorExpanded = !IsEditorExpanded;
                _logger.LogInfo($"[EnergyViewModel] ToggleEditor => IsEditorExpanded={IsEditorExpanded}");
            });
            UnlockMaxPerformanceCommand = new AsyncRelayCommand(async _ =>
            {
                _logger.LogInfo("[EnergyViewModel] UnlockMaxPerformance disparado.");
                await ApplyProfileAsync(new EnergyRecommendation { Profile = EnergyProfile.UltraPerformance, Title = "Ultra Performance" });
            });
            DisablePowerThrottlingCommand = new AsyncRelayCommand(DisablePowerThrottlingAsync);

            _monitorService.MetricsUpdated += OnMetricsUpdated;
            _logger.LogInfo("[EnergyViewModel] Construtor finalizado.");
        }

        public async Task InitializeAsync()
        {
            _logger.LogInfo("[EnergyViewModel] ══════════════════════════════════════════");
            _logger.LogInfo("[EnergyViewModel] INICIALIZANDO SMART ENERGY ENGINE");
            _logger.LogInfo("[EnergyViewModel] ══════════════════════════════════════════");
            IsBusy = true;
            BusyMessage = "Inicializando Smart Energy Engine...";
            try
            {
                _logger.LogInfo("[EnergyViewModel] Detectando tipo de dispositivo...");
                var deviceType = await _energyService.DetectDeviceTypeAsync();
                DeviceTypeText = deviceType switch
                {
                    DeviceType.Laptop  => "💻 Notebook",
                    DeviceType.Desktop => "🖥️ Desktop",
                    _                  => "❓ Desconhecido"
                };
                _logger.LogInfo($"[EnergyViewModel] DeviceType={deviceType} | DeviceTypeText={DeviceTypeText}");

                _logger.LogInfo("[EnergyViewModel] Obtendo nome da CPU...");
                CpuName = await _energyService.GetCpuNameAsync();
                _logger.LogInfo($"[EnergyViewModel] CpuName={CpuName}");

                _logger.LogInfo("[EnergyViewModel] Iniciando carregamento paralelo: Planos + Recomendações + Diagnósticos + Score...");
                await Task.WhenAll(
                    LoadPlansAsync(),
                    LoadRecommendationsAsync(),
                    RunDiagnosticsAsync(),
                    LoadEnergyScoreAsync()
                );
                _logger.LogInfo("[EnergyViewModel] Carregamento paralelo concluído.");

                _logger.LogInfo("[EnergyViewModel] Iniciando monitor em tempo real...");
                _monitorService.Start();
                _logger.LogSuccess("[EnergyViewModel] ✓ Smart Energy Engine inicializado com sucesso.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[EnergyViewModel] Erro na inicialização: {ex.Message}", ex);
            }
            finally
            {
                IsBusy = false;
            }
        }

        private async Task LoadPlansAsync()
        {
            _logger.LogInfo("[EnergyViewModel] [LoadPlans] Carregando planos de energia...");
            try
            {
                var plans = await _energyService.GetAllPlansAsync();
                _logger.LogInfo($"[EnergyViewModel] [LoadPlans] {plans.Count} plano(s) encontrado(s).");
                Plans = new ObservableCollection<PowerPlanInfo>(plans);
                var active = plans.FirstOrDefault(p => p.IsActive);
                _logger.LogInfo($"[EnergyViewModel] [LoadPlans] Plano ativo: {active?.Name ?? "nenhum"} ({active?.Guid ?? "-"})");
                if (active != null) { SelectedPlan = active; ActivePlanName = active.Name; }
            }
            catch (Exception ex) { _logger.LogError($"[EnergyViewModel] [LoadPlans] Erro: {ex.Message}", ex); }
        }

        private async Task LoadRecommendationsAsync()
        {
            _logger.LogInfo("[EnergyViewModel] [LoadRecommendations] Carregando recomendações...");
            try
            {
                var recs = await _energyService.GetRecommendationsAsync();
                _logger.LogInfo($"[EnergyViewModel] [LoadRecommendations] {recs.Count} recomendação(ões) recebida(s).");
                if (_selectedProfile != null)
                {
                    foreach (var r in recs) r.IsSelected = r.Profile == _selectedProfile.Profile;
                    _logger.LogInfo($"[EnergyViewModel] [LoadRecommendations] IsSelected restaurado para Profile={_selectedProfile.Profile}");
                }
                Recommendations = new ObservableCollection<EnergyRecommendation>(recs);
            }
            catch (Exception ex) { _logger.LogError($"[EnergyViewModel] [LoadRecommendations] Erro: {ex.Message}", ex); }
        }

        private async Task LoadEnergyScoreAsync()
        {
            _logger.LogInfo("[EnergyViewModel] [LoadEnergyScore] Calculando Energy Score...");
            try
            {
                EnergyScore = await _energyService.CalculateEnergyScoreAsync();
                _logger.LogInfo($"[EnergyViewModel] [LoadEnergyScore] Score={EnergyScore.Overall} | Grade={EnergyScore.Grade}");
            }
            catch (Exception ex) { _logger.LogError($"[EnergyViewModel] [LoadEnergyScore] Erro: {ex.Message}", ex); }
        }

        private async Task LoadPlanSettingsAsync(string guid)
        {
            _logger.LogInfo($"[EnergyViewModel] [LoadPlanSettings] Lendo configurações do plano guid={guid}...");
            try
            {
                var settings = await _editorService.ReadSettingsAsync(guid);
                _logger.LogInfo($"[EnergyViewModel] [LoadPlanSettings] CpuMin={settings.CpuMinPercent}% | CpuMax={settings.CpuMaxPercent}% | Boost={settings.CpuBoostMode} | USB={settings.UsbSelectiveSuspend} | PCIe={settings.PcieLinkState} | Disk={settings.DiskTimeoutAc} | Display={settings.DisplayTimeoutAc} | Wireless={settings.WirelessMode}");
                CpuMin = settings.CpuMinPercent; CpuMax = settings.CpuMaxPercent; CpuBoostMode = settings.CpuBoostMode;
                UsbSuspend = settings.UsbSelectiveSuspend; PcieLinkState = settings.PcieLinkState;
                DiskTimeoutAc = settings.DiskTimeoutAc; DisplayTimeoutAc = settings.DisplayTimeoutAc; WirelessMode = settings.WirelessMode;
            }
            catch (Exception ex) { _logger.LogError($"[EnergyViewModel] [LoadPlanSettings] Erro: {ex.Message}", ex); }
        }

        private async Task ActivatePlanAsync(PowerPlanInfo? plan)
        {
            _logger.LogInfo("[EnergyViewModel] [ActivatePlan] INÍCIO => plan=" + (plan?.Name ?? "null"));
            if (plan == null)
            {
                _logger.LogWarning("[EnergyViewModel] [ActivatePlan] plan é null, abortando");
                return;
            }
            IsBusy = true;
            BusyMessage = $"Ativando {plan.Name}...";
            _logger.LogInfo($"[EnergyViewModel] [ActivatePlan] Ativando guid={plan.Guid} name={plan.Name}");
            try
            {
                var ok = await _energyService.SetActivePlanAsync(plan.Guid);
                _logger.LogInfo($"[EnergyViewModel] [ActivatePlan] SetActivePlanAsync retornou: {ok}");
                SetStatus(ok ? $"✅ Plano '{plan.Name}' ativado" : "❌ Falha ao ativar plano",
                          ok ? "#00FF88" : "#FF4466");
                if (ok)
                {
                    _logger.LogSuccess($"[EnergyViewModel] [ActivatePlan] Sucesso — ActivePlanName={plan.Name}");
                    ActivePlanName = plan.Name;
                    await LoadPlansAsync();
                    await LoadEnergyScoreAsync();
                }
                else
                {
                    _logger.LogWarning("[EnergyViewModel] [ActivatePlan] Falha ao ativar plano");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[EnergyViewModel] [ActivatePlan] Erro: {ex.Message}", ex);
            }
            finally
            {
                IsBusy = false;
                _logger.LogInfo("[EnergyViewModel] [ActivatePlan] FIM — IsBusy=false");
            }
        }

        private async Task ClonePlanAsync(PowerPlanInfo? plan)
        {
            _logger.LogInfo("[EnergyViewModel] [ClonePlan] INÍCIO => plan=" + (plan?.Name ?? "null"));
            if (plan == null)
            {
                _logger.LogWarning("[EnergyViewModel] [ClonePlan] plan é null, abortando");
                return;
            }
            var newName = $"{plan.Name} (Cópia)";
            _logger.LogInfo($"[EnergyViewModel] [ClonePlan] Novo nome: {newName}");
            IsBusy = true;
            BusyMessage = "Clonando plano...";
            try
            {
                var guid = await _energyService.ClonePlanAsync(plan.Guid, newName);
                _logger.LogInfo($"[EnergyViewModel] [ClonePlan] ClonePlanAsync retornou guid={guid ?? "null"}");
                SetStatus(guid != null ? $"✅ Plano '{newName}' criado" : "❌ Falha ao clonar",
                          guid != null ? "#00FF88" : "#FF4466");
                if (guid != null)
                {
                    _logger.LogSuccess($"[EnergyViewModel] [ClonePlan] Clone bem-sucedido guid={guid}");
                    await LoadPlansAsync();
                }
                else
                {
                    _logger.LogWarning("[EnergyViewModel] [ClonePlan] Falha ao clonar plano");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[EnergyViewModel] [ClonePlan] Erro: {ex.Message}", ex);
            }
            finally
            {
                IsBusy = false;
                _logger.LogInfo("[EnergyViewModel] [ClonePlan] FIM — IsBusy=false");
            }
        }

        private async Task DeletePlanAsync(PowerPlanInfo? plan)
        {
            _logger.LogInfo($"[EnergyViewModel] [DeletePlan] INÍCIO => plan={plan?.Name ?? "null"} IsBuiltIn={plan?.IsBuiltIn}");
            if (plan == null || plan.IsBuiltIn)
            {
                _logger.LogWarning($"[EnergyViewModel] [DeletePlan] Abortando — plan null ou IsBuiltIn=true (plan={plan?.Name ?? "null"})");
                return;
            }
            IsBusy = true;
            BusyMessage = "Removendo plano...";
            _logger.LogInfo($"[EnergyViewModel] [DeletePlan] Removendo guid={plan.Guid}");
            try
            {
                var ok = await _energyService.DeletePlanAsync(plan.Guid);
                _logger.LogInfo($"[EnergyViewModel] [DeletePlan] DeletePlanAsync retornou: {ok}");
                SetStatus(ok ? "✅ Plano removido" : "❌ Não é possível remover planos integrados",
                          ok ? "#00FF88" : "#FF4466");
                if (ok)
                {
                    _logger.LogSuccess($"[EnergyViewModel] [DeletePlan] Remoção bem-sucedida guid={plan.Guid}");
                    await LoadPlansAsync();
                }
                else
                {
                    _logger.LogWarning($"[EnergyViewModel] [DeletePlan] Falha ao remover plano guid={plan.Guid}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[EnergyViewModel] [DeletePlan] Erro: {ex.Message}", ex);
            }
            finally
            {
                IsBusy = false;
                _logger.LogInfo("[EnergyViewModel] [DeletePlan] FIM — IsBusy=false");
            }
        }

        private async Task ApplyEditorSettingsAsync()
        {
            _logger.LogInfo($"[EnergyViewModel] [ApplyEditorSettings] INÍCIO => SelectedPlan={SelectedPlan?.Name ?? "null"}");
            if (SelectedPlan == null)
            {
                _logger.LogWarning("[EnergyViewModel] [ApplyEditorSettings] SelectedPlan é null, abortando");
                return;
            }
            IsBusy = true;
            BusyMessage = "Aplicando configurações avançadas...";
            try
            {
                var settings = new PowerPlanSettings
                {
                    CpuMinPercent       = CpuMin,
                    CpuMaxPercent       = CpuMax,
                    CpuBoostMode        = CpuBoostMode,
                    UsbSelectiveSuspend = UsbSuspend,
                    PcieLinkState       = PcieLinkState,
                    DiskTimeoutAc       = DiskTimeoutAc,
                    DisplayTimeoutAc    = DisplayTimeoutAc,
                    WirelessMode        = WirelessMode
                };
                _logger.LogInfo($"[EnergyViewModel] [ApplyEditorSettings] CpuMin={settings.CpuMinPercent}% CpuMax={settings.CpuMaxPercent}% Boost={settings.CpuBoostMode} USB={settings.UsbSelectiveSuspend} PCIe={settings.PcieLinkState} Disk={settings.DiskTimeoutAc} Display={settings.DisplayTimeoutAc} Wireless={settings.WirelessMode}");
                await _editorService.ApplySettingsAsync(SelectedPlan.Guid, settings);
                _logger.LogSuccess("[EnergyViewModel] [ApplyEditorSettings] ApplySettingsAsync concluído com sucesso");
                SetStatus("✅ Configurações aplicadas com sucesso", "#00FF88");
                await LoadEnergyScoreAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError($"[EnergyViewModel] [ApplyEditorSettings] Erro: {ex.Message}", ex);
            }
            finally
            {
                IsBusy = false;
                _logger.LogInfo("[EnergyViewModel] [ApplyEditorSettings] FIM — IsBusy=false");
            }
        }

        private async Task ApplyProfileAsync(EnergyRecommendation? rec)
        {
            _logger.LogInfo($"[EnergyViewModel] [ApplyProfile] INÍCIO => rec={rec?.Title ?? "null"} Profile={rec?.Profile}");
            if (rec == null)
            {
                _logger.LogWarning("[EnergyViewModel] [ApplyProfile] rec é null, abortando");
                return;
            }
            IsBusy = true;
            BusyMessage = $"Aplicando {rec.Title}...";
            _logger.LogInfo($"[EnergyViewModel] [ApplyProfile] Aplicando perfil: {rec.Profile}");
            try
            {
                var ok = await _energyService.ApplyProfileAsync(rec.Profile);
                _logger.LogInfo($"[EnergyViewModel] [ApplyProfile] ApplyProfileAsync retornou: {ok}");
                SetStatus(ok ? $"✅ {rec.Title} ativado" : "❌ Falha ao aplicar perfil",
                          ok ? "#00FF88" : "#FF4466");
                if (ok)
                {
                    _logger.LogSuccess($"[EnergyViewModel] [ApplyProfile] Sucesso — SelectedProfile={rec.Title}");
                    SelectedProfile = rec;
                    foreach (var r in Recommendations)
                    {
                        r.IsSelected = r.Profile == rec.Profile;
                        _logger.LogInfo($"[EnergyViewModel] [ApplyProfile] Card '{r.Title}' IsSelected={r.IsSelected}");
                    }
                    await LoadPlansAsync();
                    await LoadEnergyScoreAsync();
                }
                else
                {
                    _logger.LogWarning($"[EnergyViewModel] [ApplyProfile] Falha ao aplicar perfil={rec.Profile}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[EnergyViewModel] [ApplyProfile] Erro: {ex.Message}", ex);
            }
            finally
            {
                IsBusy = false;
                _logger.LogInfo("[EnergyViewModel] [ApplyProfile] FIM — IsBusy=false");
            }
        }

        private async Task RunDiagnosticsAsync()
        {
            _logger.LogInfo("[EnergyViewModel] [RunDiagnostics] INÍCIO");
            try
            {
                _logger.LogInfo("[EnergyViewModel] [RunDiagnostics] Chamando RunDiagnosticsAsync no serviço...");
                var issues = await _diagnosticsService.RunDiagnosticsAsync();
                _logger.LogInfo($"[EnergyViewModel] [RunDiagnostics] Issues recebidos: {issues.Count} | Críticos: {issues.Count(i => i.Severity == DiagnosticSeverity.Critical)} | Avisos: {issues.Count(i => i.Severity == DiagnosticSeverity.Warning)}");
                DiagnosticIssues = new ObservableCollection<DiagnosticIssue>(issues);

                _logger.LogInfo("[EnergyViewModel] [RunDiagnostics] Chamando GetThrottlingStatusAsync...");
                ThrottlingStatus = await _diagnosticsService.GetThrottlingStatusAsync();
                _logger.LogInfo($"[EnergyViewModel] [RunDiagnostics] ThrottlingStatus={ThrottlingStatus.StatusText} FreqRatio={ThrottlingStatus.FrequencyRatio:P0}");

                _logger.LogInfo("[EnergyViewModel] [RunDiagnostics] Verificando estado do Power Throttling...");
                IsPowerThrottlingEnabled = _diagnosticsService.CheckPowerThrottlingEnabled();
                _logger.LogInfo($"[EnergyViewModel] [RunDiagnostics] IsPowerThrottlingEnabled={IsPowerThrottlingEnabled}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[EnergyViewModel] [RunDiagnostics] Erro: {ex.Message}", ex);
            }
            _logger.LogInfo("[EnergyViewModel] [RunDiagnostics] FIM");
        }

        private async Task FixAllIssuesAsync()
        {
            _logger.LogInfo("[EnergyViewModel] [FixAllIssues] INÍCIO");
            IsBusy = true;
            BusyMessage = "Corrigindo problemas de energia...";
            try
            {
                _logger.LogInfo("[EnergyViewModel] [FixAllIssues] Chamando FixAllIssuesAsync no serviço...");
                await _diagnosticsService.FixAllIssuesAsync();
                _logger.LogSuccess("[EnergyViewModel] [FixAllIssues] FixAllIssuesAsync concluído");
                SetStatus("✅ Problemas corrigidos automaticamente", "#00FF88");
                _logger.LogInfo("[EnergyViewModel] [FixAllIssues] Recarregando planos, diagnósticos e score...");
                await Task.WhenAll(LoadPlansAsync(), RunDiagnosticsAsync(), LoadEnergyScoreAsync());
                _logger.LogInfo("[EnergyViewModel] [FixAllIssues] Recarga concluída");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[EnergyViewModel] [FixAllIssues] Erro: {ex.Message}", ex);
            }
            finally
            {
                IsBusy = false;
                _logger.LogInfo("[EnergyViewModel] [FixAllIssues] FIM — IsBusy=false");
            }
        }

        private async Task RestoreDefaultsAsync()
        {
            _logger.LogInfo("[EnergyViewModel] [RestoreDefaults] INÍCIO");
            IsBusy = true;
            BusyMessage = "Restaurando configurações padrão...";
            try
            {
                _logger.LogInfo("[EnergyViewModel] [RestoreDefaults] Chamando RestoreDefaultsAsync no serviço...");
                await _diagnosticsService.RestoreDefaultsAsync();
                _logger.LogSuccess("[EnergyViewModel] [RestoreDefaults] RestoreDefaultsAsync concluído");
                SetStatus("✅ Configurações padrão restauradas", "#31A8FF");
                _logger.LogInfo("[EnergyViewModel] [RestoreDefaults] Recarregando planos, diagnósticos e score...");
                await Task.WhenAll(LoadPlansAsync(), RunDiagnosticsAsync(), LoadEnergyScoreAsync());
                _logger.LogInfo("[EnergyViewModel] [RestoreDefaults] Recarga concluída");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[EnergyViewModel] [RestoreDefaults] Erro: {ex.Message}", ex);
            }
            finally
            {
                IsBusy = false;
                _logger.LogInfo("[EnergyViewModel] [RestoreDefaults] FIM — IsBusy=false");
            }
        }

        private async Task ExportPlanAsync(PowerPlanInfo? plan)
        {
            _logger.LogInfo($"[EnergyViewModel] [ExportPlan] INÍCIO => plan={plan?.Name ?? "null"}");
            if (plan == null)
            {
                _logger.LogWarning("[EnergyViewModel] [ExportPlan] plan é null, abortando");
                return;
            }
            var dlg = new Microsoft.Win32.SaveFileDialog
            {
                Title = "Exportar Plano de Energia",
                Filter = "Power Plan (*.pow)|*.pow",
                FileName = $"{plan.Name}.pow"
            };
            _logger.LogInfo("[EnergyViewModel] [ExportPlan] Abrindo SaveFileDialog...");
            if (dlg.ShowDialog() != true)
            {
                _logger.LogInfo("[EnergyViewModel] [ExportPlan] Usuário cancelou o diálogo de exportação");
                return;
            }
            _logger.LogInfo($"[EnergyViewModel] [ExportPlan] Arquivo selecionado: {dlg.FileName}");
            IsBusy = true;
            BusyMessage = "Exportando plano...";
            try
            {
                var ok = await _energyService.ExportPlanAsync(plan.Guid, dlg.FileName);
                _logger.LogInfo($"[EnergyViewModel] [ExportPlan] ExportPlanAsync retornou: {ok}");
                SetStatus(ok ? "✅ Plano exportado" : "❌ Falha ao exportar",
                          ok ? "#00FF88" : "#FF4466");
                if (ok) _logger.LogSuccess($"[EnergyViewModel] [ExportPlan] Exportado para: {dlg.FileName}");
                else    _logger.LogWarning($"[EnergyViewModel] [ExportPlan] Falha ao exportar guid={plan.Guid}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[EnergyViewModel] [ExportPlan] Erro: {ex.Message}", ex);
            }
            finally
            {
                IsBusy = false;
                _logger.LogInfo("[EnergyViewModel] [ExportPlan] FIM — IsBusy=false");
            }
        }

        private async Task ImportPlanAsync()
        {
            _logger.LogInfo("[EnergyViewModel] [ImportPlan] INÍCIO");
            var dlg = new Microsoft.Win32.OpenFileDialog
            {
                Title = "Importar Plano de Energia",
                Filter = "Power Plan (*.pow)|*.pow"
            };
            _logger.LogInfo("[EnergyViewModel] [ImportPlan] Abrindo OpenFileDialog...");
            if (dlg.ShowDialog() != true)
            {
                _logger.LogInfo("[EnergyViewModel] [ImportPlan] Usuário cancelou o diálogo de importação");
                return;
            }
            _logger.LogInfo($"[EnergyViewModel] [ImportPlan] Arquivo selecionado: {dlg.FileName}");
            IsBusy = true;
            BusyMessage = "Importando plano...";
            try
            {
                var guid = await _energyService.ImportPlanAsync(dlg.FileName);
                _logger.LogInfo($"[EnergyViewModel] [ImportPlan] ImportPlanAsync retornou guid={guid ?? "null"}");
                SetStatus(guid != null ? "✅ Plano importado com sucesso" : "❌ Falha ao importar",
                          guid != null ? "#00FF88" : "#FF4466");
                if (guid != null)
                {
                    _logger.LogSuccess($"[EnergyViewModel] [ImportPlan] Importação bem-sucedida guid={guid}");
                    await LoadPlansAsync();
                }
                else
                {
                    _logger.LogWarning($"[EnergyViewModel] [ImportPlan] Falha ao importar arquivo={dlg.FileName}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[EnergyViewModel] [ImportPlan] Erro: {ex.Message}", ex);
            }
            finally
            {
                IsBusy = false;
                _logger.LogInfo("[EnergyViewModel] [ImportPlan] FIM — IsBusy=false");
            }
        }

        private void OnMetricsUpdated(object? sender, EnergyMetrics m)
        {
            _logger.LogInfo($"[EnergyViewModel] [OnMetricsUpdated] CpuFreq={m.CpuFrequencyMhz}MHz CpuUsage={m.CpuUsagePercent:F1}% Temp={m.CpuTemperatureCelsius}°C RAM={m.RamUsagePercent:F1}% Battery={m.BatteryPercent}% OnBattery={m.IsOnBattery}");
            CpuFreqMhz     = m.CpuFrequencyMhz;
            CpuUsage       = m.CpuUsagePercent;
            CpuTemp        = m.CpuTemperatureCelsius;
            RamUsage       = m.RamUsagePercent;
            IsOnBattery    = m.IsOnBattery;
            BatteryPercent = m.BatteryPercent;
            BatteryText    = m.BatteryPercent >= 0 ? $"{m.BatteryPercent}%" : "";

            if (!string.IsNullOrEmpty(m.ActivePlanName))
            {
                ActivePlanName = m.ActivePlanName;
            }

            AddToHistory(CpuFreqHistory, m.CpuFrequencyMhz);
            AddToHistory(CpuUsageHistory, m.CpuUsagePercent);
        }

        private static void AddToHistory(ObservableCollection<double> col, double value)
        {
            if (col.Count >= 30) col.RemoveAt(0);
            col.Add(value);
        }

        private async Task DisablePowerThrottlingAsync()
        {
            _logger.LogInfo("[EnergyViewModel] [DisablePowerThrottling] INÍCIO");
            IsBusy = true;
            BusyMessage = "Desativando Power Throttling...";
            try
            {
                _logger.LogInfo("[EnergyViewModel] [DisablePowerThrottling] Chamando DisablePowerThrottlingAsync no serviço...");
                await _diagnosticsService.DisablePowerThrottlingAsync();
                _logger.LogSuccess("[EnergyViewModel] [DisablePowerThrottling] Power Throttling desativado com sucesso");
                IsPowerThrottlingEnabled = false;
                SetStatus("✅ Power Throttling desativado com sucesso", "#00FF88");
                _logger.LogInfo("[EnergyViewModel] [DisablePowerThrottling] Reexecutando diagnósticos...");
                await RunDiagnosticsAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError($"[EnergyViewModel] [DisablePowerThrottling] Erro: {ex.Message}", ex);
                SetStatus("❌ Falha ao desativar Power Throttling: " + ex.Message, "#FF4466");
            }
            finally
            {
                IsBusy = false;
                _logger.LogInfo("[EnergyViewModel] [DisablePowerThrottling] FIM — IsBusy=false");
            }
        }

        private void SetStatus(string msg, string color)
        {
            _logger.LogInfo($"[EnergyViewModel] [SetStatus] {msg}");
            StatusMessage  = msg;
            StatusColorHex = color;
        }

        public void Cleanup()
        {
            _logger.LogInfo("[EnergyViewModel] [Cleanup] Desinscrevendo MetricsUpdated e parando monitor...");
            _monitorService.MetricsUpdated -= OnMetricsUpdated;
            _monitorService.Stop();
            _monitorService.Dispose();
            _energyService.Dispose();
            _logger.LogInfo("[EnergyViewModel] [Cleanup] FIM — todos os serviços disposed");
        }

        protected override void Dispose(bool disposing)
        {
            _logger.LogInfo($"[EnergyViewModel] [Dispose] disposing={disposing}");
            if (disposing) Cleanup();
            base.Dispose(disposing);
        }
    }
}
