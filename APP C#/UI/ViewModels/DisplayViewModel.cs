using System;
using System.Collections.ObjectModel;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Input;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Services.Display;

namespace VoltrisOptimizer.UI.ViewModels
{
    public class DisplayViewModel : ViewModelBase
    {
        private const string TAG = "[DisplayVM]";
        private readonly DisplayService _display;
        private readonly ILoggingService _logger;
        private CancellationTokenSource? _monitorCts;

        private ObservableCollection<MonitorInfo> _monitors = new();
        public ObservableCollection<MonitorInfo> Monitors
        {
            get => _monitors;
            set => SetProperty(ref _monitors, value);
        }

        private MonitorInfo? _selectedMonitor;
        public MonitorInfo? SelectedMonitor
        {
            get => _selectedMonitor;
            set
            {
                if (SetProperty(ref _selectedMonitor, value) && value != null)
                {
                    _logger.LogInfo($"{TAG} Monitor selecionado: {value.Name} ({value.DeviceName})");
                    PopulateMonitorOptions(value);
                }
            }
        }

        private ObservableCollection<int> _availableHz = new();
        public ObservableCollection<int> AvailableHz
        {
            get => _availableHz;
            set => SetProperty(ref _availableHz, value);
        }

        private int _selectedHz;
        public int SelectedHz
        {
            get => _selectedHz;
            set => SetProperty(ref _selectedHz, value);
        }

        private ObservableCollection<string> _availableResolutions = new();
        public ObservableCollection<string> AvailableResolutions
        {
            get => _availableResolutions;
            set => SetProperty(ref _availableResolutions, value);
        }

        private string _selectedResolution = string.Empty;
        public string SelectedResolution
        {
            get => _selectedResolution;
            set => SetProperty(ref _selectedResolution, value);
        }

        private double _currentHz;
        public double CurrentHz
        {
            get => _currentHz;
            set => SetProperty(ref _currentHz, value);
        }

        private double _estimatedInputLagMs;
        public double EstimatedInputLagMs
        {
            get => _estimatedInputLagMs;
            set => SetProperty(ref _estimatedInputLagMs, value);
        }

        private double _framePacingMs;
        public double FramePacingMs
        {
            get => _framePacingMs;
            set => SetProperty(ref _framePacingMs, value);
        }

        private bool _tearingDetected;
        public bool TearingDetected
        {
            get => _tearingDetected;
            set
            {
                if (SetProperty(ref _tearingDetected, value))
                    OnPropertyChanged(nameof(TearingColor));
            }
        }

        public string TearingColor => TearingDetected ? "#FF4466" : "#00FF88";

        private string _inputLagColor = "#00FF88";
        public string InputLagColor
        {
            get => _inputLagColor;
            set => SetProperty(ref _inputLagColor, value);
        }

        private string _stutterColor = "#00FF88";
        public string StutterColor
        {
            get => _stutterColor;
            set => SetProperty(ref _stutterColor, value);
        }

        private bool _vSyncEnabled;
        public bool VSyncEnabled
        {
            get => _vSyncEnabled;
            set
            {
                if (SetProperty(ref _vSyncEnabled, value))
                    _ = ApplyVSyncAsync(value);
            }
        }

        private double _gammaValue = 1.0;
        public double GammaValue
        {
            get => _gammaValue;
            set => SetProperty(ref _gammaValue, value);
        }

        private bool _isTestRunning;
        public bool IsTestRunning
        {
            get => _isTestRunning;
            set => SetProperty(ref _isTestRunning, value);
        }

        private string _testResult = string.Empty;
        public string TestResult
        {
            get => _testResult;
            set => SetProperty(ref _testResult, value);
        }

        private string _testResultColor = "#00FF88";
        public string TestResultColor
        {
            get => _testResultColor;
            set => SetProperty(ref _testResultColor, value);
        }

        private string _statusMessage = "Pronto";
        public string StatusMessage
        {
            get => _statusMessage;
            set => SetProperty(ref _statusMessage, value);
        }

        private string _statusColor = "#00FF88";
        public string StatusColor
        {
            get => _statusColor;
            set => SetProperty(ref _statusColor, value);
        }

        public ICommand LoadCommand { get; }
        public ICommand StartMonitoringCommand { get; }
        public ICommand StopMonitoringCommand { get; }
        public ICommand ApplyRefreshRateCommand { get; }
        public ICommand ApplyResolutionCommand { get; }
        public ICommand ApplyGammaCommand { get; }
        public ICommand RestoreDefaultsCommand { get; }
        public ICommand RunGhostingTestCommand { get; }
        public ICommand RunTearingTestCommand { get; }
        public ICommand RunInputLagTestCommand { get; }

        public DisplayViewModel(DisplayService display, ILoggingService logger)
        {
            _display = display ?? throw new ArgumentNullException(nameof(display));
            _logger  = logger  ?? throw new ArgumentNullException(nameof(logger));

            LoadCommand             = new AsyncRelayCommand(_ => LoadAsync());
            StartMonitoringCommand  = new AsyncRelayCommand(_ => StartMonitoringAsync());
            StopMonitoringCommand   = new RelayCommand(_ => StopMonitoring());
            ApplyRefreshRateCommand = new AsyncRelayCommand(_ => ApplyRefreshRateAsync());
            ApplyResolutionCommand  = new AsyncRelayCommand(_ => ApplyResolutionAsync());
            ApplyGammaCommand       = new AsyncRelayCommand(_ => ApplyGammaAsync());
            RestoreDefaultsCommand  = new AsyncRelayCommand(_ => RestoreDefaultsAsync());
            RunGhostingTestCommand  = new AsyncRelayCommand(_ => RunGhostingTestAsync());
            RunTearingTestCommand   = new AsyncRelayCommand(_ => RunTearingTestAsync());
            RunInputLagTestCommand  = new AsyncRelayCommand(_ => RunInputLagTestAsync());

            _logger.LogInfo($"{TAG} ViewModel criado.");
        }

        public async Task LoadAsync()
        {
            _logger.LogInfo($"{TAG} [LoadAsync] Iniciando carregamento de monitores...");
            await RunBusyAsync(async () =>
            {
                var monitors = await _display.GetMonitorsAsync();
                Monitors.Clear();
                foreach (var m in monitors)
                    Monitors.Add(m);

                if (Monitors.Count > 0)
                {
                    SelectedMonitor = Monitors[0];
                    _logger.LogSuccess($"{TAG} [LoadAsync] {Monitors.Count} monitor(es) carregado(s).");
                }
                else
                {
                    _logger.LogWarning($"{TAG} [LoadAsync] Nenhum monitor detectado.");
                }

                SetStatus("Monitores carregados.", "#00FF88");
            }, "Carregando monitores...");
        }

        private void PopulateMonitorOptions(MonitorInfo monitor)
        {
            _logger.LogInfo($"{TAG} [PopulateMonitorOptions] Populando opcoes para: {monitor.Name}");

            AvailableHz.Clear();
            foreach (var hz in monitor.SupportedHz)
                AvailableHz.Add(hz);
            SelectedHz = monitor.CurrentHz;

            AvailableResolutions.Clear();
            foreach (var (w, h) in monitor.SupportedResolutions)
                AvailableResolutions.Add($"{w}x{h}");
            SelectedResolution = $"{monitor.CurrentWidth}x{monitor.CurrentHeight}";

            CurrentHz = monitor.CurrentHz;
            EstimatedInputLagMs = monitor.CurrentHz > 0 ? Math.Round(1000.0 / monitor.CurrentHz, 2) : 16.67;
            UpdateInputLagColor();

            _logger.LogInfo($"{TAG} [PopulateMonitorOptions] Hz: {AvailableHz.Count} | Resolucoes: {AvailableResolutions.Count}");
        }

        public async Task StartMonitoringAsync()
        {
            _logger.LogInfo($"{TAG} [StartMonitoringAsync] Iniciando monitoramento continuo...");
            StopMonitoring();
            _monitorCts = new CancellationTokenSource();
            var token = _monitorCts.Token;
            SetStatus("Monitorando...", "#31A8FF");
            try
            {
                while (!token.IsCancellationRequested)
                {
                    var metrics = await _display.GetDisplayMetricsAsync();
                    CurrentHz           = metrics.RefreshRateReal;
                    EstimatedInputLagMs = metrics.EstimatedInputLagMs;
                    FramePacingMs       = metrics.FramePacingMs;
                    TearingDetected     = metrics.TearingDetected;
                    UpdateInputLagColor();
                    StutterColor = metrics.StutterDetected ? "#FFAA00" : "#00FF88";
                    _logger.LogDebug($"{TAG} [Monitor] Hz={CurrentHz} | Lag={EstimatedInputLagMs}ms | Pacing={FramePacingMs}ms | Tearing={TearingDetected}");
                    await Task.Delay(2000, token);
                }
            }
            catch (OperationCanceledException)
            {
                _logger.LogInfo($"{TAG} [StartMonitoringAsync] Monitoramento cancelado.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"{TAG} [StartMonitoringAsync] Erro: {ex.Message}", ex);
            }
            SetStatus("Monitoramento parado.", "#FFAA00");
        }

        public void StopMonitoring()
        {
            if (_monitorCts != null)
            {
                _logger.LogInfo($"{TAG} [StopMonitoring] Parando monitoramento.");
                _monitorCts.Cancel();
                _monitorCts.Dispose();
                _monitorCts = null;
            }
        }

        private async Task ApplyRefreshRateAsync()
        {
            if (SelectedMonitor == null) return;
            _logger.LogInfo($"{TAG} [ApplyRefreshRateAsync] Aplicando {SelectedHz}Hz em {SelectedMonitor.DeviceName}");
            await RunBusyAsync(async () =>
            {
                bool ok = await _display.SetRefreshRateAsync(SelectedMonitor.DeviceName, SelectedHz);
                if (ok)
                {
                    SetStatus($"Taxa alterada para {SelectedHz}Hz.", "#00FF88");
                    _logger.LogSuccess($"{TAG} [ApplyRefreshRateAsync] {SelectedHz}Hz aplicado.");
                    await LoadAsync();
                }
                else
                {
                    SetStatus($"Falha ao aplicar {SelectedHz}Hz.", "#FF4466");
                    _logger.LogWarning($"{TAG} [ApplyRefreshRateAsync] Falha ao aplicar {SelectedHz}Hz.");
                }
            }, $"Aplicando {SelectedHz}Hz...");
        }

        private async Task ApplyResolutionAsync()
        {
            if (SelectedMonitor == null || string.IsNullOrEmpty(SelectedResolution)) return;
            _logger.LogInfo($"{TAG} [ApplyResolutionAsync] Aplicando {SelectedResolution}");
            var parts = SelectedResolution.Split('x');
            if (parts.Length != 2 || !int.TryParse(parts[0], out int w) || !int.TryParse(parts[1], out int h))
            {
                _logger.LogWarning($"{TAG} [ApplyResolutionAsync] Formato invalido: {SelectedResolution}");
                return;
            }
            await RunBusyAsync(async () =>
            {
                bool ok = await _display.SetResolutionAsync(SelectedMonitor.DeviceName, w, h);
                if (ok)
                {
                    SetStatus($"Resolucao alterada para {SelectedResolution}.", "#00FF88");
                    _logger.LogSuccess($"{TAG} [ApplyResolutionAsync] {SelectedResolution} aplicado.");
                    await LoadAsync();
                }
                else
                {
                    SetStatus($"Falha ao aplicar {SelectedResolution}.", "#FF4466");
                    _logger.LogWarning($"{TAG} [ApplyResolutionAsync] Falha.");
                }
            }, $"Aplicando {SelectedResolution}...");
        }

        private async Task ApplyVSyncAsync(bool enable)
        {
            _logger.LogInfo($"{TAG} [ApplyVSyncAsync] VSync={enable}");
            try
            {
                await _display.SetDwmVSyncAsync(enable);
                SetStatus($"VSync {(enable ? "ativado" : "desativado")}.", "#00FF88");
                _logger.LogSuccess($"{TAG} [ApplyVSyncAsync] VSync={enable} aplicado.");
            }
            catch (Exception ex)
            {
                _logger.LogError($"{TAG} [ApplyVSyncAsync] Erro: {ex.Message}", ex);
                SetStatus("Erro ao configurar VSync.", "#FF4466");
            }
        }

        private async Task ApplyGammaAsync()
        {
            _logger.LogInfo($"{TAG} [ApplyGammaAsync] Aplicando gamma={GammaValue}");
            await RunBusyAsync(async () =>
            {
                bool ok = await _display.SetGammaAsync(GammaValue);
                SetStatus(ok ? $"Gamma ajustado para {GammaValue:F1}." : "Falha ao ajustar gamma.", ok ? "#00FF88" : "#FF4466");
                if (ok) _logger.LogSuccess($"{TAG} [ApplyGammaAsync] Gamma={GammaValue:F1} aplicado.");
            }, "Aplicando gamma...");
        }

        private async Task RestoreDefaultsAsync()
        {
            if (SelectedMonitor == null) return;
            _logger.LogInfo($"{TAG} [RestoreDefaultsAsync] Restaurando padroes para {SelectedMonitor.DeviceName}");
            await RunBusyAsync(async () =>
            {
                bool ok = await _display.RestoreDefaultsAsync(SelectedMonitor.DeviceName);
                GammaValue = 1.0;
                await LoadAsync();
                SetStatus(ok ? "Padroes restaurados." : "Restauracao parcial.", ok ? "#00FF88" : "#FFAA00");
                _logger.LogSuccess($"{TAG} [RestoreDefaultsAsync] Concluido: {ok}");
            }, "Restaurando padroes...");
        }

        private async Task RunGhostingTestAsync()
        {
            _logger.LogInfo($"{TAG} [RunGhostingTestAsync] Iniciando teste de ghosting...");
            IsTestRunning = true;
            TestResult = "Analisando frame pacing para detectar ghosting...";
            TestResultColor = "#31A8FF";
            try
            {
                var metrics = await _display.GetDisplayMetricsAsync();
                await Task.Delay(500);
                bool risk = metrics.FramePacingMs > 3.0;
                TestResult = risk
                    ? $"Risco de ghosting! Frame pacing: {metrics.FramePacingMs:F2}ms (ideal < 3ms)."
                    : $"Sem risco de ghosting. Frame pacing: {metrics.FramePacingMs:F2}ms dentro do limite.";
                TestResultColor = risk ? "#FFAA00" : "#00FF88";
                _logger.LogInfo($"{TAG} [RunGhostingTestAsync] risk={risk}, pacing={metrics.FramePacingMs}ms");
            }
            catch (Exception ex)
            {
                TestResult = $"Erro no teste: {ex.Message}";
                TestResultColor = "#FF4466";
                _logger.LogError($"{TAG} [RunGhostingTestAsync] Erro: {ex.Message}", ex);
            }
            finally { IsTestRunning = false; }
        }

        private async Task RunTearingTestAsync()
        {
            _logger.LogInfo($"{TAG} [RunTearingTestAsync] Iniciando teste de tearing...");
            IsTestRunning = true;
            TestResult = "Verificando estado do DWM Composition...";
            TestResultColor = "#31A8FF";
            try
            {
                var metrics = await _display.GetDisplayMetricsAsync();
                await Task.Delay(300);
                TestResult = metrics.TearingDetected
                    ? "Tearing detectado! DWM Composition desativado. Ative o VSync ou reative o DWM."
                    : "Sem tearing. DWM Composition ativo e sincronizacao de frames funcionando.";
                TestResultColor = metrics.TearingDetected ? "#FF4466" : "#00FF88";
                _logger.LogInfo($"{TAG} [RunTearingTestAsync] TearingDetected={metrics.TearingDetected}");
            }
            catch (Exception ex)
            {
                TestResult = $"Erro no teste: {ex.Message}";
                TestResultColor = "#FF4466";
                _logger.LogError($"{TAG} [RunTearingTestAsync] Erro: {ex.Message}", ex);
            }
            finally { IsTestRunning = false; }
        }

        private async Task RunInputLagTestAsync()
        {
            _logger.LogInfo($"{TAG} [RunInputLagTestAsync] Iniciando teste de input lag...");
            IsTestRunning = true;
            TestResult = "Calculando input lag estimado baseado no Hz atual...";
            TestResultColor = "#31A8FF";
            try
            {
                var metrics = await _display.GetDisplayMetricsAsync();
                await Task.Delay(300);
                double lag = metrics.EstimatedInputLagMs;
                string rating = lag <= 4.2 ? "Excelente (240Hz+)"
                    : lag <= 6.9 ? "Otimo (144Hz)"
                    : lag <= 8.3 ? "Bom (120Hz)"
                    : lag <= 16.7 ? "Aceitavel (60Hz)"
                    : "Alto - considere aumentar o Hz";
                TestResult = $"Input lag estimado: {lag:F2}ms - {rating}. (1000/{metrics.RefreshRateReal:F0}Hz)";
                TestResultColor = lag <= 8.3 ? "#00FF88" : lag <= 16.7 ? "#FFAA00" : "#FF4466";
                _logger.LogInfo($"{TAG} [RunInputLagTestAsync] InputLag={lag}ms | Hz={metrics.RefreshRateReal}");
            }
            catch (Exception ex)
            {
                TestResult = $"Erro no teste: {ex.Message}";
                TestResultColor = "#FF4466";
                _logger.LogError($"{TAG} [RunInputLagTestAsync] Erro: {ex.Message}", ex);
            }
            finally { IsTestRunning = false; }
        }

        private void UpdateInputLagColor()
        {
            InputLagColor = EstimatedInputLagMs <= 8.3 ? "#00FF88"
                : EstimatedInputLagMs <= 16.7 ? "#FFAA00"
                : "#FF4466";
        }

        private void SetStatus(string msg, string color)
        {
            StatusMessage = msg;
            StatusColor   = color;
        }

        private async Task RunBusyAsync(Func<Task> action, string busyMessage = "Processando...")
        {
            await ExecuteSafeAsync(action, busyMessage, ex =>
            {
                SetStatus($"Erro: {ex.Message}", "#FF4466");
                _logger.LogError($"{TAG} Erro: {ex.Message}", ex);
            });
        }

        protected override void OnDisposing()
        {
            StopMonitoring();
            _logger.LogInfo($"{TAG} ViewModel descartado.");
            base.OnDisposing();
        }
    }
}