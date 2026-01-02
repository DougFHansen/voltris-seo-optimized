using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Net.Http;
using System.Runtime.CompilerServices;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Input;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Services.License;

namespace VoltrisOptimizer.UI.ViewModels
{
    /// <summary>
    /// ViewModel para a página de ativação de licença
    /// </summary>
    public class LicenseActivationViewModel : INotifyPropertyChanged
    {
        private readonly ILoggingService _logger;
        private string _licenseKey = "";
        private string _statusMessage = "";
        private string _errorMessage = "";
        private bool _isLoading;
        private bool _isActivating;
        private bool _showError;
        private bool _showSuccess;
        private LicenseType _selectedLicenseType = LicenseType.Trial;
        private LicenseState _currentState;
        private int _trialDaysRemaining;
        private string _deviceId = "";
        private bool _isOnline = true;
        private CancellationTokenSource _cancellationTokenSource;
        
        public event PropertyChangedEventHandler? PropertyChanged;
        public event EventHandler? ActivationSucceeded;
        public event EventHandler? CloseRequested;
        
        #region Properties
        
        public string LicenseKey
        {
            get => _licenseKey;
            set
            {
                if (_licenseKey != value)
                {
                    _licenseKey = value?.Trim().ToUpperInvariant() ?? "";
                    OnPropertyChanged();
                    OnPropertyChanged(nameof(CanActivate));
                    ShowError = false;
                }
            }
        }
        
        public string StatusMessage
        {
            get => _statusMessage;
            set { _statusMessage = value; OnPropertyChanged(); }
        }
        
        public string ErrorMessage
        {
            get => _errorMessage;
            set 
            { 
                _errorMessage = value; 
                OnPropertyChanged();
                ShowError = !string.IsNullOrEmpty(value);
            }
        }
        
        public bool IsLoading
        {
            get => _isLoading;
            set { _isLoading = value; OnPropertyChanged(); OnPropertyChanged(nameof(CanActivate)); }
        }
        
        public bool IsActivating
        {
            get => _isActivating;
            set { _isActivating = value; OnPropertyChanged(); OnPropertyChanged(nameof(CanActivate)); }
        }
        
        public bool ShowError
        {
            get => _showError;
            set { _showError = value; OnPropertyChanged(); }
        }
        
        public bool ShowSuccess
        {
            get => _showSuccess;
            set { _showSuccess = value; OnPropertyChanged(); }
        }
        
        public LicenseType SelectedLicenseType
        {
            get => _selectedLicenseType;
            set { _selectedLicenseType = value; OnPropertyChanged(); }
        }
        
        public LicenseState CurrentState
        {
            get => _currentState;
            set { _currentState = value; OnPropertyChanged(); }
        }
        
        public int TrialDaysRemaining
        {
            get => _trialDaysRemaining;
            set { _trialDaysRemaining = value; OnPropertyChanged(); OnPropertyChanged(nameof(TrialStatusText)); }
        }
        
        public string DeviceId
        {
            get => _deviceId;
            set { _deviceId = value; OnPropertyChanged(); }
        }
        
        public bool IsOnline
        {
            get => _isOnline;
            set { _isOnline = value; OnPropertyChanged(); OnPropertyChanged(nameof(OfflineWarningVisible)); }
        }
        
        public bool OfflineWarningVisible => !IsOnline;
        
        public string TrialStatusText
        {
            get
            {
                if (CurrentState?.IsActivated == true && CurrentState.Type != LicenseType.Trial)
                    return $"Licença {CurrentState.TypeDisplayName} ativa";
                
                if (TrialDaysRemaining <= 0)
                    return "⚠️ Período de teste expirado";
                
                if (TrialDaysRemaining == 1)
                    return "⏰ Último dia de teste!";
                
                return $"🕐 {TrialDaysRemaining} dias restantes no período de teste";
            }
        }
        
        public bool CanActivate => 
            !IsLoading && 
            !IsActivating && 
            !string.IsNullOrWhiteSpace(LicenseKey) &&
            LicenseKey.Length >= 10;
        
        public bool IsTrialMode => CurrentState?.IsTrial ?? true;
        
        public ObservableCollection<LicensePlanViewModel> LicensePlans { get; } = new();
        
        private int _planColumns = 4;
        public int PlanColumns
        {
            get => _planColumns;
            set { _planColumns = value; OnPropertyChanged(); }
        }
        
        #endregion
        
        #region Commands
        
        public ICommand ActivateCommand { get; }
        public ICommand ContinueTrialCommand { get; }
        public ICommand BuyLicenseCommand { get; }
        public ICommand CopyDeviceIdCommand { get; }
        public ICommand RefreshStatusCommand { get; }
        
        #endregion
        
        public LicenseActivationViewModel()
        {
            _logger = App.LoggingService ?? new LoggingService(System.IO.Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Logs"));
            _currentState = new LicenseState();
            _cancellationTokenSource = new CancellationTokenSource();
            
            // Inicializar comandos
            ActivateCommand = new RelayCommand(async _ => await ActivateLicenseAsync(), _ => CanActivate);
            ContinueTrialCommand = new RelayCommand(_ => ContinueTrial(), _ => TrialDaysRemaining > 0);
            BuyLicenseCommand = new RelayCommand(BuyLicense);
            CopyDeviceIdCommand = new RelayCommand(_ => CopyDeviceId());
            RefreshStatusCommand = new RelayCommand(async _ => await RefreshStatusAsync());
            
            // Inicializar planos
            InitializePlans();
        }
        
        private async void InitializePlans()
        {
            LicensePlans.Clear();
            await Task.Run(() => {
                foreach (var plan in LicensePlan.AvailablePlans)
                {
                    Application.Current.Dispatcher.Invoke(() => {
                        LicensePlans.Add(new LicensePlanViewModel(plan));
                    });
                }
            });
        }
        
        /// <summary>
        /// Inicializa o ViewModel e carrega o estado atual
        /// </summary>
        public async Task InitializeAsync()
        {
            try
            {
                // Obter Device ID de forma síncrona (é rápido)
                DeviceId = DeviceFingerprintService.Instance.GetShortDeviceId();
                _logger.LogInfo($"[License] Device ID: {DeviceId}");
                
                // Carregar dados do cache primeiro (instantâneo)
                var cachedLicense = LicenseCacheService.Instance.LoadLicenseCache();
                bool hasValidCache = cachedLicense != null && LicenseCacheService.Instance.IsCacheDataValid(cachedLicense);
                
                // Carregar trial local (rápido)
                var trialService = TrialProtectionService.Instance;
                TrialDaysRemaining = trialService.GetDaysRemaining();
                
                CurrentState = new LicenseState
                {
                    DeviceId = DeviceId,
                    TrialDaysRemaining = TrialDaysRemaining,
                    IsTrialExpired = trialService.IsTrialExpired(),
                    Type = LicenseType.Trial
                };
                
                // Se temos cache válido, carregar imediatamente
                if (hasValidCache && cachedLicense != null)
                {
                    CurrentState.IsActivated = true;
                    CurrentState.Type = LicensePlan.ParseType(cachedLicense.LicenseType);
                    CurrentState.MaxDevices = cachedLicense.MaxDevices;
                    CurrentState.DevicesInUse = cachedLicense.DevicesInUse;
                    CurrentState.ExpiresAt = cachedLicense.ExpiresAt;
                    CurrentState.IsOfflineMode = true;
                    
                    var existingKey = VoltrisOptimizer.Services.LicenseManager.Instance.GetCurrentLicenseKey();
                    if (!string.IsNullOrEmpty(existingKey))
                    {
                        LicenseKey = existingKey;
                        CurrentState.LicenseKey = existingKey;
                    }
                    
                    VoltrisOptimizer.Services.LicenseManager.IsPro = CurrentState.Type >= LicenseType.Pro;
                }
                
                OnPropertyChanged(nameof(CurrentState));
                OnPropertyChanged(nameof(IsTrialMode));
                OnPropertyChanged(nameof(TrialStatusText));
                
                // Verificar conectividade e atualizar em background (não bloqueia a UI)
                _ = Task.Run(async () =>
                {
                    try
                    {
                        IsOnline = await LicenseApiService.Instance.IsServerReachableAsync();
                        
                        if (IsOnline)
                        {
                            // Atualizar do servidor em background
                            await RefreshStatusAsync();
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogWarning($"[License] Erro ao verificar conectividade: {ex.Message}");
                        IsOnline = false;
                    }
                });
            }
            catch (Exception ex)
            {
                _logger.LogError("[License] Erro na inicialização", ex);
                ErrorMessage = "Erro ao inicializar. Por favor, tente novamente.";
            }
        }
        
        /// <summary>
        /// Atualiza o status da licença
        /// </summary>
        public async Task RefreshStatusAsync()
        {
            try
            {
                // Verificar trial local
                var trialService = TrialProtectionService.Instance;
                TrialDaysRemaining = await Task.Run(() => trialService.GetDaysRemaining());
                
                CurrentState = new LicenseState
                {
                    DeviceId = DeviceId,
                    TrialDaysRemaining = TrialDaysRemaining,
                    IsTrialExpired = await Task.Run(() => trialService.IsTrialExpired()),
                    Type = LicenseType.Trial
                };
                
                // Verificar licença existente
                var existingKey = await Task.Run(() => VoltrisOptimizer.Services.LicenseManager.Instance.GetCurrentLicenseKey());
                if (!string.IsNullOrEmpty(existingKey))
                {
                    LicenseKey = existingKey;
                    
                    if (IsOnline)
                    {
                        // Validar no servidor
                        var response = await LicenseApiService.Instance.ValidateLicenseAsync(existingKey, DeviceId);
                        if (response.Valid)
                        {
                            CurrentState.IsActivated = true;
                            CurrentState.Type = LicensePlan.ParseType(response.Type);
                            CurrentState.MaxDevices = response.MaxDevices;
                            CurrentState.DevicesInUse = response.DevicesInUse;
                            CurrentState.ExpiresAt = response.ExpiresAt;
                            CurrentState.LicenseKey = existingKey;
                            
                            // Salvar no cache em background
                            _ = Task.Run(() => {
                                LicenseCacheService.Instance.SaveLicenseCache(new LicenseCacheData
                                {
                                    LicenseKey = existingKey,
                                    LicenseType = response.Type,
                                    IsValid = true,
                                    MaxDevices = response.MaxDevices,
                                    DevicesInUse = response.DevicesInUse,
                                    ExpiresAt = response.ExpiresAt
                                });
                            });
                            
                            VoltrisOptimizer.Services.LicenseManager.IsPro = CurrentState.Type >= LicenseType.Pro;
                        }
                    }
                    else
                    {
                        // Tentar cache offline
                        var cache = await Task.Run(() => LicenseCacheService.Instance.LoadLicenseCache());
                        if (cache != null && await Task.Run(() => LicenseCacheService.Instance.IsCacheDataValid(cache)))
                        {
                            CurrentState.IsActivated = true;
                            CurrentState.Type = LicensePlan.ParseType(cache.LicenseType);
                            CurrentState.MaxDevices = cache.MaxDevices;
                            CurrentState.DevicesInUse = cache.DevicesInUse;
                            CurrentState.ExpiresAt = cache.ExpiresAt;
                            CurrentState.IsOfflineMode = true;
                            
                            StatusMessage = $"Modo offline - cache válido por mais {LicenseCacheService.Instance.GetCacheRemainingHours():F0}h";
                        }
                    }
                }
                
                OnPropertyChanged(nameof(CurrentState));
                OnPropertyChanged(nameof(IsTrialMode));
                OnPropertyChanged(nameof(TrialStatusText));
            }
            catch (Exception ex)
            {
                _logger.LogError("[License] Erro ao atualizar status", ex);
            }
        }
        
        /// <summary>
        /// Ativa a licença
        /// </summary>
        public async Task ActivateLicenseAsync()
        {
            if (!CanActivate) return;
            
            IsActivating = true;
            ShowError = false;
            ShowSuccess = false;
            StatusMessage = "Validando licença...";
            
            try
            {
                var licenseKey = LicenseKey.Trim().ToUpperInvariant();
                
                _logger.LogInfo($"[License] Tentando ativar: {licenseKey.Substring(0, Math.Min(10, licenseKey.Length))}...");
                
                // Verificar conectividade
                if (!await LicenseApiService.Instance.IsServerReachableAsync())
                {
                    // Tentar validação local
                    var localResult = await VoltrisOptimizer.Services.LicenseManager.Instance.ActivateLicenseAsync(licenseKey);
                    if (localResult.Success)
                    {
                        ShowSuccess = true;
                        StatusMessage = "Licença ativada (modo offline)";
                        CurrentState.IsActivated = true;
                        CurrentState.IsOfflineMode = true;
                        
                        await Task.Delay(1500);
                        ActivationSucceeded?.Invoke(this, EventArgs.Empty);
                        return;
                    }
                    
                    ErrorMessage = "Sem conexão com o servidor. Verifique sua internet e tente novamente.";
                    return;
                }
                
                // Ativar no servidor
                StatusMessage = "Registrando dispositivo...";
                var response = await LicenseApiService.Instance.ActivateLicenseAsync(licenseKey, DeviceId);
                
                if (response.Success)
                {
                    // Ativação bem-sucedida
                    var licenseType = LicensePlan.ParseType(response.Type);
                    
                    // Persistir localmente
                    await VoltrisOptimizer.Services.LicenseManager.Instance.ActivateLicenseAsync(licenseKey);
                    
                    // Salvar cache em background
                    _ = Task.Run(() => {
                        LicenseCacheService.Instance.SaveLicenseCache(new LicenseCacheData
                        {
                            LicenseKey = licenseKey,
                            LicenseType = response.Type,
                            IsValid = true,
                            MaxDevices = response.MaxDevices,
                            DevicesInUse = response.DevicesInUse,
                            ExpiresAt = response.ExpiresAt
                        });
                    });
                    
                    // Atualizar estado
                    CurrentState.IsActivated = true;
                    CurrentState.Type = licenseType;
                    CurrentState.MaxDevices = response.MaxDevices;
                    CurrentState.DevicesInUse = response.DevicesInUse;
                    CurrentState.ExpiresAt = response.ExpiresAt;
                    CurrentState.LicenseKey = licenseKey;
                    
                    VoltrisOptimizer.Services.LicenseManager.IsPro = licenseType >= LicenseType.Pro;
                    
                    ShowSuccess = true;
                    StatusMessage = $"✅ Licença {response.Type} ativada com sucesso!";
                    
                    _logger.LogSuccess($"[License] Licença {response.Type} ativada");
                    
                    await Task.Delay(1500);
                    ActivationSucceeded?.Invoke(this, EventArgs.Empty);
                }
                else
                {
                    // Tratar erros específicos
                    var errorCode = response.ErrorCode ?? "";
                    
                    switch (errorCode)
                    {
                        case "DEVICE_LIMIT_EXCEEDED":
                            ErrorMessage = $"⚠️ Limite de instalações atingido ({response.DevicesInUse}/{response.MaxDevices}).\n\nDesative um dispositivo para continuar usando esta licença.";
                            break;
                        
                        case "LICENSE_EXPIRED":
                            ErrorMessage = "❌ Esta licença expirou. Renove sua licença para continuar.";
                            break;
                        
                        case "LICENSE_INVALID":
                            ErrorMessage = "❌ Licença inválida. Verifique a chave e tente novamente.";
                            break;
                        
                        case "LICENSE_REVOKED":
                            ErrorMessage = "❌ Esta licença foi revogada. Entre em contato com o suporte.";
                            break;
                        
                        default:
                            ErrorMessage = response.ErrorMessage ?? "Erro ao ativar licença. Tente novamente.";
                            break;
                    }
                    
                    _logger.LogWarning($"[License] Falha na ativação: {errorCode} - {response.ErrorMessage}");
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("[License] Erro na ativação", ex);
                ErrorMessage = "Erro inesperado. Por favor, tente novamente.";
            }
            finally
            {
                IsActivating = false;
                StatusMessage = "";
            }
        }
        
        /// <summary>
        /// Continua usando o Trial
        /// </summary>
        private async void ContinueTrial()
        {
            if (TrialDaysRemaining > 0)
            {
                _logger.LogInfo("[License] Usuário optou por continuar no Trial");
                // Corrigir erro de threading usando Dispatcher para acessar elementos da UI
                await Application.Current.Dispatcher.InvokeAsync(() => {
                    CloseRequested?.Invoke(this, EventArgs.Empty);
                });
            }
            else
            {
                ErrorMessage = "O período de teste expirou. Por favor, ative uma licença.";
            }
        }
        
        /// <summary>
        /// Abre página de compra
        /// </summary>
        private async void BuyLicense(object? parameter)
        {
            try
            {
                // Show loading state
                IsLoading = true;
                StatusMessage = "Processando pagamento...";
                
                // Determinar plano baseado no parâmetro ou tipo de licença selecionado
                var plan = parameter as string ?? "pro";
                
                // Mapear tipo de licença para plano
                if (SelectedLicenseType == LicenseType.Standard)
                    plan = "standard";
                else if (SelectedLicenseType == LicenseType.Pro)
                    plan = "pro";
                else
                    plan = "pro";
                
                // Obter email do usuário (se disponível)
                var email = string.Empty; // Pode ser obtido de configurações ou entrada do usuário
                
                // Create HTTP client
                using (var client = new HttpClient())
                {
                    // URL da API com parâmetros de plano e email
                    var apiUrlBuilder = new System.Text.StringBuilder("https://voltris.com.br/api/pagamento");
                    apiUrlBuilder.Append($"?plan={System.Uri.EscapeDataString(plan)}");
                    if (!string.IsNullOrEmpty(email))
                    {
                        apiUrlBuilder.Append($"&email={System.Uri.EscapeDataString(email)}");
                    }
                    string apiUrl = apiUrlBuilder.ToString();
                    
                    _logger.LogInfo($"[License] Chamando API de pagamento: {apiUrl}");
                    
                    // Make API call to get payment URL with timeout
                    using (var cts = new CancellationTokenSource(TimeSpan.FromSeconds(15)))
                    {
                        var response = await client.GetAsync(apiUrl, cts.Token);
                        
                        if (response.IsSuccessStatusCode)
                        {
                            var jsonResponse = await response.Content.ReadAsStringAsync();
                            _logger.LogInfo($"[License] Resposta da API: {jsonResponse}");
                            
                            // Parse JSON response
                            using (var document = JsonDocument.Parse(jsonResponse))
                            {
                                // A API retorna "init_point" com a URL de pagamento
                                if (document.RootElement.TryGetProperty("init_point", out var initPointElement))
                                {
                                    string paymentUrl = initPointElement.GetString() ?? string.Empty;
                                    
                                    if (!string.IsNullOrEmpty(paymentUrl))
                                    {
                                        // Salvar preference_id e payment_id para referência futura (opcional)
                                        if (document.RootElement.TryGetProperty("preference_id", out var prefIdElement))
                                        {
                                            var preferenceId = prefIdElement.GetString();
                                            _logger.LogInfo($"[License] Preference ID: {preferenceId}");
                                        }
                                        
                                        if (document.RootElement.TryGetProperty("payment_id", out var payIdElement))
                                        {
                                            var paymentId = payIdElement.GetString();
                                            _logger.LogInfo($"[License] Payment ID: {paymentId}");
                                        }
                                        
                                        // Open URL in default browser
                                        System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
                                        {
                                            FileName = paymentUrl,
                                            UseShellExecute = true
                                        });
                                        
                                        StatusMessage = $"Redirecionando para pagamento... (Plano: {plan})";
                                        _logger.LogInfo($"[License] Abrindo página de pagamento: {plan}");
                                        
                                        // Aguardar um pouco antes de limpar a mensagem
                                        await Task.Delay(2000);
                                    }
                                    else
                                    {
                                        ErrorMessage = "URL de pagamento inválida recebida da API.";
                                    }
                                }
                                else if (document.RootElement.TryGetProperty("error", out var errorElement))
                                {
                                    var errorMsg = errorElement.GetString() ?? "Erro desconhecido";
                                    ErrorMessage = $"Erro na API: {errorMsg}";
                                    _logger.LogWarning($"[License] Erro da API: {errorMsg}");
                                }
                                else
                                {
                                    ErrorMessage = "Resposta da API em formato inesperado.";
                                    _logger.LogWarning($"[License] Resposta inesperada: {jsonResponse}");
                                }
                            }
                        }
                        else
                        {
                            var errorContent = await response.Content.ReadAsStringAsync();
                            ErrorMessage = $"Falha na requisição: {response.StatusCode}. {errorContent}";
                            _logger.LogError($"[License] Erro HTTP {response.StatusCode}: {errorContent}");
                        }
                    }
                }
            }
            catch (OperationCanceledException)
            {
                _logger.LogError("[License] Tempo limite excedido ao processar pagamento");
                ErrorMessage = "Tempo limite excedido. Verifique sua conexão e tente novamente.";
            }
            catch (Exception ex)
            {
                _logger.LogError("[License] Erro ao processar pagamento", ex);
                ErrorMessage = $"Erro ao processar pagamento: {ex.Message}";
            }
            finally
            {
                IsLoading = false;
                if (string.IsNullOrEmpty(ErrorMessage))
                {
                    StatusMessage = "";
                }
            }
        }
        
        /// <summary>
        /// Copia o Device ID para a área de transferência
        /// </summary>
        private async void CopyDeviceId()
        {
            try
            {
                await Application.Current.Dispatcher.InvokeAsync(() => {
                    Clipboard.SetText(DeviceId);
                    StatusMessage = "Device ID copiado!";
                });
                
                // Limpar mensagem após 2 segundos
                await Task.Delay(2000);
                StatusMessage = "";
            }
            catch (Exception ex)
            {
                _logger.LogError("[License] Erro ao copiar Device ID", ex);
            }
        }
        
        protected void OnPropertyChanged([CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
    
    /// <summary>
    /// ViewModel para um plano de licença
    /// </summary>
    public class LicensePlanViewModel : INotifyPropertyChanged
    {
        private readonly LicensePlan _plan;
        private bool _isSelected;
        
        public event PropertyChangedEventHandler? PropertyChanged;
        
        public LicensePlanViewModel(LicensePlan plan)
        {
            _plan = plan;
        }
        
        public LicenseType Type => _plan.Type;
        public string Name => _plan.Name;
        public string Description => _plan.Description;
        public int MaxDevices => _plan.MaxDevices;
        public string PriceFormatted => _plan.PriceFormatted ?? "Grátis";
        public string[] Features => _plan.Features;
        public bool IsPopular => _plan.IsPopular;
        public string Color => _plan.Color;
        public string Icon => _plan.Icon;
        
        public string DevicesText => MaxDevices >= 9999 
            ? "Dispositivos ilimitados" 
            : $"{MaxDevices} dispositivo{(MaxDevices > 1 ? "s" : "")}";
        
        public bool IsSelected
        {
            get => _isSelected;
            set 
            { 
                _isSelected = value;
                PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(IsSelected)));
            }
        }
    }
}