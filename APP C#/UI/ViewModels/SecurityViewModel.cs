using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Input;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Utils;

namespace VoltrisOptimizer.UI.ViewModels
{
    public class SecurityViewModel : INotifyPropertyChanged
    {
        private readonly ISecurityTuningService _securityService;
        private readonly ILoggingService _logger;
        private readonly WindowsUpdateService _updateService = new();

        private SecurityStatus _status = new();
        public SecurityStatus Status
        {
            get => _status;
            set { _status = value; OnPropertyChanged(); }
        }

        private bool _isSmartScreenEnabled;
        public bool IsSmartScreenEnabled
        {
            get => _isSmartScreenEnabled;
            set { if (_isSmartScreenEnabled != value) { _isSmartScreenEnabled = value; OnPropertyChanged(); _ = ApplyTweak("SmartScreen", value); } }
        }

        private bool _isVbsEnabled;
        public bool IsVbsEnabled
        {
            get => _isVbsEnabled;
            set { if (_isVbsEnabled != value) { _isVbsEnabled = value; OnPropertyChanged(); _ = ApplyTweak("VBS", value); } }
        }

        // ── Windows Update ────────────────────────────────────────────────────
        private ObservableCollection<WindowsUpdateInfo> _pendingUpdates = new();
        public ObservableCollection<WindowsUpdateInfo> PendingUpdates
        {
            get => _pendingUpdates;
            set { _pendingUpdates = value; OnPropertyChanged(); OnPropertyChanged(nameof(HasPendingUpdates)); OnPropertyChanged(nameof(UpdateCountText)); }
        }

        private bool _isCheckingUpdates;
        public bool IsCheckingUpdates
        {
            get => _isCheckingUpdates;
            set { _isCheckingUpdates = value; OnPropertyChanged(); OnPropertyChanged(nameof(CanCheckUpdates)); }
        }

        private bool _isInstallingUpdates;
        public bool IsInstallingUpdates
        {
            get => _isInstallingUpdates;
            set { _isInstallingUpdates = value; OnPropertyChanged(); OnPropertyChanged(nameof(CanCheckUpdates)); }
        }

        private string _updateStatusMessage = string.Empty;
        public string UpdateStatusMessage
        {
            get => _updateStatusMessage;
            set { _updateStatusMessage = value; OnPropertyChanged(); }
        }

        private bool _updateCheckDone;
        public bool UpdateCheckDone
        {
            get => _updateCheckDone;
            set { _updateCheckDone = value; OnPropertyChanged(); }
        }

        private bool _rebootRequired;
        public bool RebootRequired
        {
            get => _rebootRequired;
            set { _rebootRequired = value; OnPropertyChanged(); }
        }

        public bool HasPendingUpdates => PendingUpdates.Count > 0;
        public bool CanCheckUpdates => !IsCheckingUpdates && !IsInstallingUpdates;

        public string UpdateCountText => PendingUpdates.Count switch
        {
            0 => "Sistema atualizado",
            1 => "1 atualização pendente",
            _ => $"{PendingUpdates.Count} atualizações pendentes"
        };

        public ICommand RefreshCommand { get; }
        public ICommand ScanCommand { get; }
        public ICommand UpdateCommand { get; }
        public ICommand CheckWindowsUpdatesCommand { get; }
        public ICommand InstallWindowsUpdatesCommand { get; }
        public ICommand FixTamperProtectionCommand { get; }
        public ICommand FixUacCommand { get; }
        public ICommand OpenAntivirusCommand { get; }
        public ICommand OpenRealtimeProtectionCommand { get; }
        public ICommand OpenFirewallCommand { get; }
        public ICommand OpenWindowsUpdateCommand { get; }
        public ICommand OpenSmartScreenCommand { get; }
        public ICommand OpenTamperProtectionCommand { get; }
        public ICommand OpenUacCommand { get; }

        public SecurityViewModel(ISecurityTuningService securityService, ILoggingService logger)
        {
            _securityService = securityService;
            _logger = logger;

            RefreshCommand = new RelayCommand(async _ => await LoadStatusAsync());
            ScanCommand = new RelayCommand(async _ => await RunScanAsync());
            UpdateCommand = new RelayCommand(async _ => await RunUpdateAsync());
            CheckWindowsUpdatesCommand = new RelayCommand(async _ => await CheckWindowsUpdatesAsync(), _ => CanCheckUpdates);
            InstallWindowsUpdatesCommand = new RelayCommand(async _ => await InstallWindowsUpdatesAsync(), _ => CanCheckUpdates && HasPendingUpdates);
            FixTamperProtectionCommand = new RelayCommand(_ => OpenWindowsSecurityPage("windowsdefender://threatsettings/"));
            FixUacCommand = new RelayCommand(_ => OpenWindowsSecurityPage("ms-settings:useraccounts"));
            OpenAntivirusCommand = new RelayCommand(_ => OpenWindowsSecurityPage("windowsdefender://threat/"));
            OpenRealtimeProtectionCommand = new RelayCommand(_ => OpenWindowsSecurityPage("windowsdefender://threatsettings/"));
            OpenFirewallCommand = new RelayCommand(_ => OpenWindowsSecurityPage("windowsdefender://firewall"));
            OpenWindowsUpdateCommand = new RelayCommand(_ => OpenWindowsSecurityPage("ms-settings:windowsupdate"));
            OpenSmartScreenCommand = new RelayCommand(_ => OpenWindowsSecurityPage("windowsdefender://appbrowser/"));
            OpenTamperProtectionCommand = new RelayCommand(_ => OpenWindowsSecurityPage("windowsdefender://threatsettings/"));
            OpenUacCommand = new RelayCommand(_ => LaunchUacSettings());

            // Carregamento imediato em background — sem bloquear construtor
            _ = LoadStatusAsync();
        }

        private async Task RunScanAsync()
        {
            bool started = Services.GlobalProgressService.Instance.StartOperation("Verificação de Segurança", true);
            if (started) Services.GlobalProgressService.Instance.UpdateProgress(30, "Iniciando verificação rápida...");
            await _securityService.RunQuickScanAsync();
            if (started) Services.GlobalProgressService.Instance.CompleteOperation("Verificação concluída!");
            await LoadStatusAsync(forceRefresh: true);
        }

        private async Task RunUpdateAsync()
        {
            bool started = Services.GlobalProgressService.Instance.StartOperation("Atualização de Segurança", true);
            if (started) Services.GlobalProgressService.Instance.UpdateProgress(20, "Conectando aos servidores da Microsoft...");
            if (started) Services.GlobalProgressService.Instance.UpdateProgress(50, "Baixando novas definições de vírus...");
            await _securityService.UpdateSignaturesAsync();
            if (started) Services.GlobalProgressService.Instance.CompleteOperation("Definições atualizadas com sucesso!");
            await LoadStatusAsync(forceRefresh: true);
        }

        public async Task CheckWindowsUpdatesAsync()
        {
            if (!CanCheckUpdates) return;
            IsCheckingUpdates = true;
            UpdateCheckDone = false;
            UpdateStatusMessage = "Verificando atualizações...";
            PendingUpdates.Clear();
            OnPropertyChanged(nameof(HasPendingUpdates));
            OnPropertyChanged(nameof(UpdateCountText));

            bool started = Services.GlobalProgressService.Instance.StartOperation("Verificar Windows Update", true);
            if (started) Services.GlobalProgressService.Instance.UpdateProgress(20, "Conectando ao Windows Update...");

            try
            {
                if (started) Services.GlobalProgressService.Instance.UpdateProgress(50, "Pesquisando atualizações pendentes...");
                var result = await _updateService.CheckForUpdatesAsync();
                if (started) Services.GlobalProgressService.Instance.UpdateProgress(90, "Processando resultados...");

                await System.Windows.Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    PendingUpdates.Clear();
                    if (result.Success)
                    {
                        foreach (var u in result.PendingUpdates)
                            PendingUpdates.Add(u);

                        UpdateStatusMessage = result.IsUpToDate
                            ? "✓ Seu sistema está completamente atualizado."
                            : $"Encontradas {PendingUpdates.Count} atualização(ões) pendente(s).";
                    }
                    else
                    {
                        UpdateStatusMessage = $"Erro ao verificar: {result.ErrorMessage}";
                    }

                    UpdateCheckDone = true;
                    OnPropertyChanged(nameof(HasPendingUpdates));
                    OnPropertyChanged(nameof(UpdateCountText));
                    OnPropertyChanged(nameof(CanCheckUpdates));
                });

                if (started) Services.GlobalProgressService.Instance.CompleteOperation(result.IsUpToDate
                    ? "Sistema atualizado"
                    : $"{PendingUpdates.Count} atualização(ões) encontrada(s)");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[SecurityVM] Erro ao verificar Windows Update: {ex.Message}");
                await System.Windows.Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    UpdateStatusMessage = $"Erro: {ex.Message}";
                    UpdateCheckDone = true;
                });
                if (started) Services.GlobalProgressService.Instance.CompleteOperation("Erro ao verificar atualizações");
            }
            finally
            {
                IsCheckingUpdates = false;
                OnPropertyChanged(nameof(CanCheckUpdates));
            }
        }

        public async Task InstallWindowsUpdatesAsync()
        {
            if (!CanCheckUpdates || !HasPendingUpdates) return;
            IsInstallingUpdates = true;
            UpdateStatusMessage = "Instalando atualizações...";
            OnPropertyChanged(nameof(CanCheckUpdates));

            bool startedInstall = Services.GlobalProgressService.Instance.StartOperation("Instalar Windows Update", true);

            try
            {
                var progress = new Progress<(int percent, string message)>(p =>
                {
                    if (startedInstall) Services.GlobalProgressService.Instance.UpdateProgress(p.percent, p.message);
                    System.Windows.Application.Current?.Dispatcher.InvokeAsync(() =>
                        UpdateStatusMessage = p.message);
                });

                var (success, reboot, message) = await _updateService.InstallUpdatesAsync(progress);

                await System.Windows.Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    UpdateStatusMessage = message;
                    RebootRequired = reboot;
                    if (success) PendingUpdates.Clear();
                    OnPropertyChanged(nameof(HasPendingUpdates));
                    OnPropertyChanged(nameof(UpdateCountText));
                });

                if (startedInstall) Services.GlobalProgressService.Instance.CompleteOperation(message);
            }
            catch (Exception ex)
            {
                _logger.LogError($"[SecurityVM] Erro ao instalar Windows Update: {ex.Message}");
                await System.Windows.Application.Current.Dispatcher.InvokeAsync(() =>
                    UpdateStatusMessage = $"Erro: {ex.Message}");
                if (startedInstall) Services.GlobalProgressService.Instance.CompleteOperation("Erro ao instalar atualizações");
            }
            finally
            {
                IsInstallingUpdates = false;
                OnPropertyChanged(nameof(CanCheckUpdates));
            }
        }

        private bool _isLoading;
        public bool IsLoading
        {
            get => _isLoading;
            set { _isLoading = value; OnPropertyChanged(); }
        }

        private async Task LoadStatusAsync(bool forceRefresh = false)
        {
            try
            {
                _logger.LogInfo("[SecurityVM] ▶ Carregando status de segurança...");
                
                if (forceRefresh)
                    _securityService.InvalidateCache();

                await System.Windows.Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    IsLoading = true;
                });
                
                var s = await _securityService.GetSecurityStatusAsync().ConfigureAwait(false);
                
                _logger.LogInfo($"[SecurityVM] Status recebido: TamperProtection={s.TamperProtectionEnabled}, RTP={s.RealTimeProtectionEnabled}, UAC={s.UacEnabled}");
                _logger.LogInfo($"[SecurityVM] AV={s.AntivirusProduct} (enabled={s.AntivirusEnabled}), Firewall={s.FirewallEnabled}, SmartScreen={s.SmartScreenEnabled}");
                _logger.LogInfo($"[SecurityVM] WinUpdate={s.WindowsUpdateEnabled}, CFA={s.ControlledFolderAccessEnabled}, BitLocker={s.BitLockerEnabled}, DefenderSvc={s.DefenderServiceEnabled}");
                
                await System.Windows.Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    Status = s;
                    _isSmartScreenEnabled = s.SmartScreenEnabled;
                    OnPropertyChanged(nameof(IsSmartScreenEnabled));
                    OnPropertyChanged(nameof(IsVbsEnabled));
                    // Notificar TODAS as propriedades do Status para garantir atualização da UI
                    OnPropertyChanged(nameof(Status));
                    IsLoading = false;
                });
                
                _logger.LogSuccess("[SecurityVM] ✅ Status de segurança carregado na UI");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[SecurityVM] Erro ao carregar status de segurança: {ex.Message}", ex);
                await System.Windows.Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    IsLoading = false;
                });
            }
        }

        private async Task ApplyTweak(string tag, bool enable)
        {
            await _securityService.ApplyTweakAsync(tag, enable).ConfigureAwait(false);
            // Pequeno delay para o sistema registrar a mudança antes de re-ler
            await Task.Delay(300).ConfigureAwait(false);
            await LoadStatusAsync(forceRefresh: true).ConfigureAwait(false);
        }

        private void OpenWindowsSecurityPage(string uri)
        {
            try
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = uri,
                    UseShellExecute = true
                });

                // Polling automático: re-lê o status a cada 3s por até 60s
                // para refletir em tempo real quando o usuário ativar algo lá fora
                _ = PollStatusAfterExternalChangeAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error opening Windows Security page '{uri}': {ex.Message}");
                try
                {
                    Process.Start(new ProcessStartInfo
                    {
                        FileName = "windowsdefender://",
                        UseShellExecute = true
                    });
                    _ = PollStatusAfterExternalChangeAsync();
                }
                catch (Exception fallbackEx)
                {
                    _logger.LogError($"Error opening fallback Windows Security: {fallbackEx.Message}");
                }
            }
        }

        /// <summary>
        /// Após abrir uma página externa de configuração (Windows Security, Settings),
        /// faz polling do status a cada 3s por até 60s para detectar mudanças em tempo real.
        /// Para de fazer polling quando detecta uma mudança de status.
        /// </summary>
        private async Task PollStatusAfterExternalChangeAsync()
        {
            _logger.LogInfo("[SecurityVM] Iniciando polling de status após abertura de página externa...");

            // Captura snapshot do status atual para comparar
            var previousStatus = _status;
            var maxAttempts = 20; // 20 × 3s = 60s máximo
            var changed = false;

            // Aguarda 1s antes do primeiro poll (tempo para o usuário interagir)
            await Task.Delay(1000).ConfigureAwait(false);

            for (int i = 0; i < maxAttempts && !changed; i++)
            {
                try
                {
                    // Invalida o cache antes de cada poll para garantir leitura fresca do sistema
                    _securityService.InvalidateCache();

                    var newStatus = await _securityService.GetSecurityStatusAsync().ConfigureAwait(false);

                    // Detecta qualquer mudança relevante
                    changed = newStatus.AntivirusEnabled     != previousStatus.AntivirusEnabled
                           || newStatus.RealTimeProtectionEnabled != previousStatus.RealTimeProtectionEnabled
                           || newStatus.FirewallEnabled      != previousStatus.FirewallEnabled
                           || newStatus.WindowsUpdateEnabled != previousStatus.WindowsUpdateEnabled
                           || newStatus.SmartScreenEnabled   != previousStatus.SmartScreenEnabled
                           || newStatus.TamperProtectionEnabled != previousStatus.TamperProtectionEnabled
                           || newStatus.UacEnabled           != previousStatus.UacEnabled
                           || newStatus.DefenderServiceEnabled != previousStatus.DefenderServiceEnabled;

                    if (changed)
                    {
                        _logger.LogInfo("[SecurityVM] ✅ Mudança de status detectada — atualizando UI...");
                        await System.Windows.Application.Current.Dispatcher.InvokeAsync(() =>
                        {
                            Status = newStatus;
                            _isSmartScreenEnabled = newStatus.SmartScreenEnabled;
                            OnPropertyChanged(nameof(IsSmartScreenEnabled));
                            OnPropertyChanged(nameof(Status));
                        });
                        break;
                    }

                    previousStatus = newStatus;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[SecurityVM] Erro no poll #{i + 1}: {ex.Message}");
                }

                await Task.Delay(3000).ConfigureAwait(false);
            }

            if (!changed)
                _logger.LogInfo("[SecurityVM] Polling encerrado sem mudanças detectadas (60s).");
        }

        private void LaunchUacSettings()
        {
            try
            {
                Process.Start(new ProcessStartInfo
                {
                    FileName = "UserAccountControlSettings.exe",
                    UseShellExecute = true
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error launching UAC settings: {ex.Message}");
                OpenWindowsSecurityPage("ms-settings:useraccounts");
            }
        }

        public event PropertyChangedEventHandler? PropertyChanged;
        protected void OnPropertyChanged([CallerMemberName] string? name = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        }
    }
}
