using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Input;
using System.Windows.Media;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Services.Performance;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using VoltrisOptimizer.UI.ViewModels.Performance.Models;
using VoltrisOptimizer.Services.Performance.Models;

namespace VoltrisOptimizer.UI.ViewModels
{
    /// <summary>
    /// ViewModel para a página de Desempenho
    /// Gerencia otimizações de performance do sistema
    /// </summary>
    public partial class PerformanceViewModel : ViewModelBase
    {
        private readonly ILoggingService? _logger;
        private readonly IPerformanceOptimizationService? _performanceService;
        private readonly IGamerModeOrchestrator? _gamerOrchestrator;
        private readonly IntelligentPerformanceCoordinator? _intelligentCoordinator;
        private readonly CancellationTokenSource _intelligenceCts = new();
        private bool _isOptimizing;
        private string _optimizationStatus = "Pronto";
        private VoltrisOptimizer.Services.Performance.Models.HardwareTier _hardwareTier = VoltrisOptimizer.Services.Performance.Models.HardwareTier.MidRange;
        
        // System Profile Properties
        private string _profileCpu = "Carregando...";
        private string _profileRam = "Carregando...";
        private string _profileStorage = "Carregando...";
        private string _profileGpu = "Carregando...";
        private string _profileType = "Desktop";
        private string _profileTypeIcon = "🖥️";
        
        // Categories
        private ObservableCollection<PerfCategoryViewModel>? _categories;
        
        // Intelligent Recommendations (NEW)
        private string _intelligentRecommendation = "Analisando...";
        private bool _hasIntelligentRecommendation;
        private string _recommendationIcon = "🧠";
        private string _intelligentStatusMessage = "Pronto para análise";
        
        public ICommand AutoOptimizeCommand { get; }
        public ICommand RevertAllCommand { get; }
        public ICommand ApplyIntelligentRecommendationCommand { get; }
        public ICommand IntelligentOptimizeCommand { get; }
        
        public bool IsOptimizing
        {
            get => _isOptimizing;
            set { SetProperty(ref _isOptimizing, value); }
        }
        
        public string OptimizationStatus
        {
            get => _optimizationStatus;
            set { SetProperty(ref _optimizationStatus, value); }
        }
        
        // System Profile Properties
        public string ProfileCpu
        {
            get => _profileCpu;
            set { SetProperty(ref _profileCpu, value); }
        }
        
        public string ProfileRam
        {
            get => _profileRam;
            set { SetProperty(ref _profileRam, value); }
        }
        
        public string ProfileStorage
        {
            get => _profileStorage;
            set { SetProperty(ref _profileStorage, value); }
        }
        
        public string ProfileGpu
        {
            get => _profileGpu;
            set { SetProperty(ref _profileGpu, value); }
        }
        
        public string ProfileType
        {
            get => _profileType;
            set { SetProperty(ref _profileType, value); }
        }
        
        public string ProfileTypeIcon
        {
            get => _profileTypeIcon;
            set { SetProperty(ref _profileTypeIcon, value); }
        }
        
        public ObservableCollection<PerfCategoryViewModel> Categories
        {
            get
            {
                if (_categories == null)
                {
                    var dispatcher = System.Windows.Application.Current?.Dispatcher;
                    if (dispatcher != null && !dispatcher.CheckAccess())
                    {
                        dispatcher.Invoke(() => _categories = new ObservableCollection<PerfCategoryViewModel>());
                    }
                    else
                    {
                        _categories = new ObservableCollection<PerfCategoryViewModel>();
                    }
                }
                return _categories;
            }
            set
            {
                SetProperty(ref _categories, value);
            }
        }
        
        // Intelligent Recommendation Properties (NEW)
        public string IntelligentRecommendation
        {
            get => _intelligentRecommendation;
            set { SetProperty(ref _intelligentRecommendation, value); }
        }
        
        public bool HasIntelligentRecommendation
        {
            get => _hasIntelligentRecommendation;
            set { SetProperty(ref _hasIntelligentRecommendation, value); }
        }
        
        public string RecommendationIcon
        {
            get => _recommendationIcon;
            set { SetProperty(ref _recommendationIcon, value); }
        }

        public string IntelligentStatusMessage
        {
            get => _intelligentStatusMessage;
            set { SetProperty(ref _intelligentStatusMessage, value); }
        }

        // Full properties for tooltips (to avoid truncation)
        private string _fullProfileCpu = "Carregando...";
        private string _fullProfileRam = "Carregando...";
        private string _fullProfileStorage = "Carregando...";
        private string _fullProfileGpu = "Carregando...";

        public string FullProfileCpu
        {
            get => _fullProfileCpu;
            set { SetProperty(ref _fullProfileCpu, value); }
        }

        public string FullProfileRam
        {
            get => _fullProfileRam;
            set { SetProperty(ref _fullProfileRam, value); }
        }

        public string FullProfileStorage
        {
            get => _fullProfileStorage;
            set { SetProperty(ref _fullProfileStorage, value); }
        }

        public string FullProfileGpu
        {
            get => _fullProfileGpu;
            set { SetProperty(ref _fullProfileGpu, value); }
        }

        public PerformanceViewModel()
        {
            _logger = App.LoggingService;
            
            // Tentar obter via DI, fallback para App estático
            try
            {
                var serviceProvider = App.Services;
                if (serviceProvider != null)
                {
                    _performanceService = serviceProvider.GetService(typeof(IPerformanceOptimizationService)) as IPerformanceOptimizationService;
                    _gamerOrchestrator = serviceProvider.GetService(typeof(IGamerModeOrchestrator)) as IGamerModeOrchestrator;
                    _intelligentCoordinator = serviceProvider.GetService(typeof(IntelligentPerformanceCoordinator)) as IntelligentPerformanceCoordinator;
                    _logger?.LogInfo($"[PerformanceVM] Serviço obtido via DI: Perf={_performanceService != null}, Gamer={_gamerOrchestrator != null}, AI={_intelligentCoordinator != null}");
                }
            }
            catch (Exception ex)
            {
                _logger?.LogWarning($"[PerformanceVM] Erro ao obter serviço via DI: {ex.Message}");
            }
            
            // Fallback: criar wrapper se UltraPerformance estiver disponível
            if (_performanceService == null && App.UltraPerformance != null && _logger != null)
            {
                try
                {
                    _performanceService = new PerformanceOptimizationService(
                        App.UltraPerformance, 
                        _logger);
                    _logger?.LogInfo("[PerformanceVM] Serviço criado via fallback (App.UltraPerformance)");
                }
                catch (Exception ex)
                {
                    _logger?.LogError($"[PerformanceVM] Erro ao criar serviço fallback: {ex.Message}", ex);
                }
            }
            
            if (_performanceService == null)
            {
                _logger?.LogWarning("[PerformanceVM] ⚠️ Serviço de performance não disponível!");
            }
            
            AutoOptimizeCommand = new AsyncRelayCommand(AutoOptimizeAsync, () => _performanceService != null && !IsOptimizing);
            RevertAllCommand = new AsyncRelayCommand(RevertAllAsync, () => _performanceService != null && !IsOptimizing);
            ApplyIntelligentRecommendationCommand = new AsyncRelayCommand(ApplyIntelligentRecommendationAsync, () => _intelligentCoordinator != null && HasIntelligentRecommendation && !IsOptimizing);
            IntelligentOptimizeCommand = new AsyncRelayCommand(AutoOptimizeAsync, () => _performanceService != null && !IsOptimizing);
            
            // Start intelligent analysis in background (non-blocking)
            if (_intelligentCoordinator != null)
            {
                var coordinator = _intelligentCoordinator;
                var logger = _logger;
                _ = Task.Run(async () =>
                {
                    await Task.Delay(10000); // CORREÇÃO: Wait 10s (era 5s) para UI carregar completamente
                    await this.StartIntelligentAnalysisLoopAsync(coordinator, logger, _intelligenceCts.Token);
                });
            }

            InitializeBenchmarkIntegration();
        }
        
        /// <summary>
        /// Carrega os dados do sistema e categorias de otimização
        /// </summary>
        public async Task LoadDataAsync()
        {
            try
            {
                _logger?.LogInfo("[PerformanceVM] Iniciando carregamento de dados...");
                
                // Verificar se o serviço está disponível
                if (_performanceService == null)
                {
                    _logger?.LogWarning("[PerformanceVM] Serviço de performance não disponível");
                    
                    // Atualizar UI com mensagem de erro (não-bloqueante)
                    await System.Windows.Application.Current?.Dispatcher.InvokeAsync(() =>
                    {
                        ProfileCpu = "Serviço não disponível";
                        ProfileRam = "N/A";
                        ProfileStorage = "N/A";
                        ProfileGpu = "N/A";
                        ProfileType = "Erro";
                        ProfileTypeIcon = "⚠️";
                        OptimizationStatus = "Serviço não disponível";
                    });
                    return;
                }

                // Carregar perfil do sistema em background thread
                PerformanceSystemProfile? profile = null;
                await Task.Run(() =>
                {
                    try
                    {
                        profile = _performanceService.DetectSystemProfile();
                        // Classificar hardware
                        if (profile != null)
                        {
                            _hardwareTier = VoltrisOptimizer.Services.UltraPerformanceService.ClassifyHardware(profile);
                            _logger?.LogInfo($"[PerformanceVM] Perfil detectado: {profile.CPUName}, Tier: {_hardwareTier}");
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger?.LogError($"[PerformanceVM] Erro ao detectar perfil: {ex.Message}", ex);
                    }
                });

                // Atualizar UI na thread principal (não-bloqueante)
                if (profile != null)
                {
                    await System.Windows.Application.Current?.Dispatcher.InvokeAsync(() =>
                    {
                        try
                        {
                            LoadSystemProfile(profile);
                        }
                        catch (Exception ex)
                        {
                            _logger?.LogError($"[PerformanceVM] Erro ao atualizar UI do perfil: {ex.Message}", ex);
                        }
                    });
                }

                // Carregar categorias em background thread
                IReadOnlyList<PerformanceCategory>? categories = null;
                await Task.Run(() =>
                {
                    try
                    {
                        categories = _performanceService.GetOptimizationCategories();
                        _logger?.LogInfo($"[PerformanceVM] {categories.Count} categorias obtidas");
                    }
                    catch (Exception ex)
                    {
                        _logger?.LogError($"[PerformanceVM] Erro ao obter categorias: {ex.Message}", ex);
                    }
                });

                // Atualizar UI na thread principal (não-bloqueante)
                if (categories != null)
                {
                    await System.Windows.Application.Current?.Dispatcher.InvokeAsync(() =>
                    {
                        try
                        {
                            LoadCategories(categories);
                        }
                        catch (Exception ex)
                        {
                            _logger?.LogError($"[PerformanceVM] Erro ao atualizar UI das categorias: {ex.Message}", ex);
                        }
                    });
                }

                _logger?.LogSuccess("[PerformanceVM] Dados carregados com sucesso");
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[PerformanceVM] Erro crítico ao carregar dados: {ex.Message}", ex);
                
                // Atualizar UI com mensagem de erro (não-bloqueante)
                await System.Windows.Application.Current?.Dispatcher.InvokeAsync(() =>
                {
                    ProfileCpu = "Erro ao carregar";
                    ProfileRam = "Erro";
                    ProfileStorage = "Erro";
                    ProfileGpu = "Erro";
                    ProfileType = "Erro";
                    ProfileTypeIcon = "⚠️";
                    OptimizationStatus = $"Erro: {ex.Message}";
                });
            }
        }
        
        private void LoadSystemProfile(PerformanceSystemProfile profile)
        {
            try
            {
                // Store full names for tooltips
                FullProfileCpu = profile.CPUName ?? "Desconhecido";
                FullProfileRam = $"{profile.TotalRAMGB:F0} GB";
                FullProfileGpu = profile.GPUName ?? "Desconhecido";
                
                // Storage Full Info
                if (profile.HasNVMe)
                    FullProfileStorage = $"NVMe SSD - {profile.DiskModel}";
                else if (profile.HasSSD)
                    FullProfileStorage = $"SATA SSD - {profile.DiskModel}";
                else
                    FullProfileStorage = $"HDD - {profile.DiskModel}";

                // CPU Display (Truncated)
                var cpuShort = FullProfileCpu;
                if (cpuShort.Length > 20)
                {
                    if (cpuShort.Contains("Intel"))
                        cpuShort = cpuShort.Split('@')[0].Replace("Intel(R) Core(TM)", "").Replace("CPU", "").Trim();
                    else if (cpuShort.Contains("AMD"))
                        cpuShort = cpuShort.Split('@')[0].Replace("AMD", "").Trim();
                    
                    if (cpuShort.Length > 15)
                        cpuShort = cpuShort.Substring(0, 15) + "...";
                }
                ProfileCpu = cpuShort;

                // RAM Display
                ProfileRam = FullProfileRam;

                // Storage Display
                if (profile.HasNVMe)
                    ProfileStorage = "NVMe SSD";
                else if (profile.HasSSD)
                    ProfileStorage = "SSD";
                else
                    ProfileStorage = "HDD";

                // GPU Display (Truncated)
                var gpuShort = FullProfileGpu;
                if (gpuShort.Length > 15)
                {
                    if (gpuShort.Contains("NVIDIA"))
                        gpuShort = gpuShort.Replace("NVIDIA", "").Replace("GeForce", "").Trim();
                    else if (gpuShort.Contains("AMD"))
                        gpuShort = gpuShort.Replace("AMD", "").Replace("Radeon", "").Trim();
                    
                    if (gpuShort.Length > 12)
                        gpuShort = gpuShort.Substring(0, 12) + "...";
                }
                ProfileGpu = gpuShort;

                // Tipo de PC
                if (profile.IsGamingPC)
                {
                    ProfileType = "Gaming PC";
                    ProfileTypeIcon = "🎮";
                }
                else if (profile.IsWorkstation)
                {
                    ProfileType = "Workstation";
                    ProfileTypeIcon = "💼";
                }
                else if (profile.IsLaptop)
                {
                    ProfileType = "Notebook";
                    ProfileTypeIcon = "💻";
                }
                else
                {
                    ProfileType = "Desktop";
                    ProfileTypeIcon = "🖥️";
                }

                _logger?.LogInfo($"[PerformanceVM] Perfil carregado: {ProfileType}");
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[PerformanceVM] Erro ao processar perfil: {ex.Message}", ex);
                ProfileCpu = "Erro";
                ProfileRam = "Erro";
                ProfileStorage = "Erro";
                ProfileGpu = "Erro";
            }
        }
        
        private void LoadCategories(IReadOnlyList<PerformanceCategory> categories)
        {
            try
            {
                // ✅ OTIMIZAÇÃO: Batch update - construir coleção offline para evitar múltiplas notificações
                var newCategories = new ObservableCollection<PerfCategoryViewModel>();
                var isGamerModeActive = CheckGamerModeActive();
                var profile = _performanceService?.DetectSystemProfile();

                var colors = new Dictionary<string, Color>
                {
                    { "🧠", Color.FromRgb(139, 92, 246) },   // Purple - Memory
                    { "⚡", Color.FromRgb(245, 158, 11) },   // Orange - CPU
                    { "💾", Color.FromRgb(59, 130, 246) },   // Blue - Disk
                    { "🌐", Color.FromRgb(16, 185, 129) },   // Green - Network
                    { "🎨", Color.FromRgb(236, 72, 153) },   // Pink - Visual
                    { "🚀", Color.FromRgb(99, 102, 241) },   // Indigo - Startup
                    { "⚙️", Color.FromRgb(107, 114, 128) },  // Gray - Services
                    { "🔋", Color.FromRgb(234, 179, 8) },    // Yellow - Power
                    { "📁", Color.FromRgb(34, 197, 94) },    // Green - Explorer
                    { "🔧", Color.FromRgb(168, 85, 247) },   // Purple - Essential
                    { "🖱️", Color.FromRgb(14, 165, 233) },   // Sky Blue - Responsiveness
                };

                foreach (var cat in categories)
                {
                    try
                    {
                        var catVm = new PerfCategoryViewModel
                        {
                            Name = cat.Name ?? "Sem nome",
                            Icon = cat.Icon ?? "⚙️",
                            Description = cat.Description ?? "",
                            CategoryColor = colors.TryGetValue(cat.Icon ?? "", out var c) ? c : Color.FromRgb(107, 114, 128),
                            IsExpanded = false
                        };

                        if (cat.Optimizations != null)
                        {
                            foreach (var opt in cat.Optimizations)
                            {
                                try
                                {
                                    // Verificar compatibilidade com hardware (apenas para informação)
                                    var isCompatible = IsOptimizationCompatible(opt, profile, isGamerModeActive);
                                    
                                    // Verificar se é seguro para hardware atual (apenas para informação)
                                    var isSafe = IsOptimizationSafe(opt);
                                    
                                    // TODAS as otimizações devem vir selecionadas e habilitadas por padrão
                                    // Usuário solicitou que NADA venha desmarcado, sem exceção

                                    var optVm = new PerfOptimizationViewModel
                                    {
                                        Name = opt.Name ?? "Sem nome",
                                        Description = opt.Description ?? "",
                                        IsSelected = true,  // SEMPRE marcada por padrão
                                        IsRecommended = opt.IsRecommended && isCompatible,
                                        Impact = opt.Impact,
                                        ApplyAction = opt.ApplyAction,
                                        RevertAction = opt.RevertAction,
                                        IsEnabled = true,  // SEMPRE habilitada
                                        IncompatibilityReason = !isCompatible ? opt.IncompatibilityReason : null
                                    };

                                    optVm.PropertyChanged += (s, e) => UpdateCategoryStats(catVm);
                                    catVm.Optimizations.Add(optVm);
                                }
                                catch (Exception ex)
                                {
                                    _logger?.LogWarning($"[PerformanceVM] Erro ao processar otimização {opt.Name}: {ex.Message}");
                                }
                            }
                        }

                        UpdateCategoryStats(catVm);
                        
                        // Wiring category-level Apply and Revert commands
                        catVm.ApplyCommand = new AsyncRelayCommand(async () => await ApplyCategoryAsync(catVm), () => !IsOptimizing);
                        catVm.RevertCommand = new AsyncRelayCommand(async () => await RevertCategoryAsync(catVm), () => !IsOptimizing);
                        
                        newCategories.Add(catVm);
                    }
                    catch (Exception ex)
                    {
                        _logger?.LogWarning($"[PerformanceVM] Erro ao processar categoria {cat.Name}: {ex.Message}");
                    }
                }

                // ✅ OTIMIZAÇÃO: Atribuição única = 1 notificação PropertyChanged em vez de N
                Categories = newCategories;
                _logger?.LogInfo($"[PerformanceVM] {newCategories.Count} categorias carregadas (Tier: {_hardwareTier}, Gamer: {isGamerModeActive})");
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[PerformanceVM] Erro ao carregar categorias: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Verifica se o Modo Gamer está ativo
        /// </summary>
        private bool CheckGamerModeActive()
        {
            try
            {
                return _gamerOrchestrator?.IsActive ?? false;
            }
            catch
            {
                return false;
            }
        }

        /// <summary>
        /// Verifica se uma otimização é compatível com o hardware atual
        /// </summary>
        private bool IsOptimizationCompatible(PerformanceOptimization opt, PerformanceSystemProfile? profile, bool gamerModeActive)
        {
            if (profile == null)
                return true; // Se não temos perfil, permitir (será verificado depois)

            // Verificar tier mínimo
            if (opt.MinimumTier.HasValue && _hardwareTier < opt.MinimumTier.Value)
            {
                opt.IncompatibilityReason = $"Requer hardware mais potente (mínimo: {opt.MinimumTier.Value})";
                return false;
            }

            // Verificar GPU dedicada
            if (opt.RequiresDedicatedGPU && !profile.HasDedicatedGPU)
            {
                opt.IncompatibilityReason = "Requer GPU dedicada";
                return false;
            }

            // Verificar SSD
            if (opt.RequiresSSD && !profile.HasSSD && !profile.HasNVMe)
            {
                opt.IncompatibilityReason = "Requer SSD/NVMe";
                return false;
            }

            // Verificar RAM mínima
            if (opt.MinimumRAMGB.HasValue && profile.TotalRAMGB < opt.MinimumRAMGB.Value)
            {
                opt.IncompatibilityReason = $"Requer pelo menos {opt.MinimumRAMGB.Value}GB de RAM";
                return false;
            }

            // Verificar núcleos mínimos
            if (opt.MinimumCores.HasValue && profile.CPUCores < opt.MinimumCores.Value)
            {
                opt.IncompatibilityReason = $"Requer pelo menos {opt.MinimumCores.Value} núcleos de CPU";
                return false;
            }

            // Verificar laptops
            if (opt.NotForLaptops && profile.IsLaptop)
            {
                opt.IncompatibilityReason = "Não recomendado para laptops";
                return false;
            }

            // Verificar conflito com Modo Gamer
            if (opt.ConflictsWithGamerMode && gamerModeActive)
            {
                opt.IncompatibilityReason = "Conflita com Modo Gamer";
                return false;
            }

            // Se chegou aqui, é compatível
            opt.IncompatibilityReason = null;
            return true;
        }

        /// <summary>
        /// Verifica se uma otimização é segura para o hardware atual
        /// </summary>
        private bool IsOptimizationSafe(PerformanceOptimization opt)
        {
            // Otimizações avançadas requerem confirmação adicional
            if (opt.Safety == OptimizationSafety.Advanced)
            {
                // TODO: Implementar lógica para otimizações avançadas
                return true; // Por enquanto, permitir todas
            }

            return true;
        }

        private void UpdateCategoryStats(PerfCategoryViewModel category)
        {
            // TODO: Fix missing properties
            // category.SelectedCount = category.Optimizations.Count(o => o.IsSelected);
            // category.TotalCount = category.Optimizations.Count;
            // category.IsEnabled = category.Optimizations.Any(o => o.IsEnabled);
        }

        /// <summary>
        /// Aplica otimizações de uma categoria específica
        /// </summary>
        private async Task ApplyCategoryAsync(PerfCategoryViewModel category)
        {
            if (_performanceService == null || IsOptimizing) return;

            var selected = category.Optimizations
                .Where(o => o.IsSelected)
                .Select(o => o.Name)
                .ToList();

            if (selected.Count == 0)
            {
                OptimizationStatus = "Nenhuma otimização selecionada nesta categoria";
                return;
            }

            try
            {
                _logger?.LogInfo($"[PerformanceVM] Aplicando {selected.Count} otimizações da categoria '{category.Name}'");

                category.IsWorking = true;
                category.StatusText = "Aplicando...";
                IsOptimizing = true;

                using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(3));
                var result = await _performanceService.ApplyOptimizationsAsync(selected, cts.Token);

                if (result.Success && result.TotalApplied > 0)
                {
                    category.StatusText = $"✅ {result.TotalApplied} aplicadas";
                    OptimizationStatus = $"✅ {result.TotalApplied} otimizações de '{category.Name}' aplicadas";
                    _logger?.LogSuccess($"[PerformanceVM] Categoria '{category.Name}': {result.TotalApplied} aplicadas");
                }
                else
                {
                    category.StatusText = "Nenhuma alteração";
                    OptimizationStatus = "ℹ️ Nenhuma otimização adicional necessária";
                }
            }
            catch (Exception ex)
            {
                category.StatusText = "❌ Erro";
                OptimizationStatus = $"❌ Erro: {ex.Message}";
                _logger?.LogError($"[PerformanceVM] Erro ao aplicar categoria '{category.Name}': {ex.Message}", ex);
            }
            finally
            {
                IsOptimizing = false;
                category.IsWorking = false;
            }
        }

        /// <summary>
        /// Reverte otimizações de uma categoria específica.
        /// Exibe o modal de reinicialização (mesmo modal do botão principal).
        /// </summary>
        private async Task RevertCategoryAsync(PerfCategoryViewModel category)
        {
            if (_performanceService == null || IsOptimizing) return;

            try
            {
                _logger?.LogInfo($"[PerformanceVM] Revertendo categoria '{category.Name}'");

                // Exibir modal de reinicialização
                VoltrisOptimizer.UI.Windows.RestartConfirmationModal.RestartChoice userChoice =
                    VoltrisOptimizer.UI.Windows.RestartConfirmationModal.RestartChoice.Cancel;

                await System.Windows.Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    try
                    {
                        var modal = new VoltrisOptimizer.UI.Windows.RestartConfirmationModal
                        {
                            Owner = System.Windows.Application.Current.MainWindow
                        };
                        modal.ShowDialog();
                        userChoice = modal.UserChoice;
                    }
                    catch (Exception ex)
                    {
                        _logger?.LogError($"[PerformanceVM] Erro ao exibir modal: {ex.Message}", ex);
                    }
                });

                if (userChoice == VoltrisOptimizer.UI.Windows.RestartConfirmationModal.RestartChoice.Cancel)
                {
                    _logger?.LogInfo($"[PerformanceVM] Reversão da categoria '{category.Name}' cancelada pelo usuário");
                    return;
                }

                bool shouldRestartNow = (userChoice == VoltrisOptimizer.UI.Windows.RestartConfirmationModal.RestartChoice.RestartNow);

                category.IsWorking = true;
                category.StatusText = "Revertendo...";
                IsOptimizing = true;

                // Reverter cada otimização da categoria que tem RevertAction
                int revertedCount = 0;
                foreach (var opt in category.Optimizations)
                {
                    if (opt.RevertAction != null)
                    {
                        try
                        {
                            opt.RevertAction.Invoke();
                            revertedCount++;
                        }
                        catch (Exception ex)
                        {
                            _logger?.LogWarning($"[PerformanceVM] Erro ao reverter '{opt.Name}': {ex.Message}");
                        }
                    }
                }

                if (revertedCount > 0)
                {
                    category.StatusText = $"✅ {revertedCount} revertidas";
                    OptimizationStatus = $"✅ {revertedCount} otimizações de '{category.Name}' revertidas";
                    _logger?.LogSuccess($"[PerformanceVM] Categoria '{category.Name}': {revertedCount} revertidas");

                    if (shouldRestartNow)
                    {
                        _logger?.LogInfo("[PerformanceVM] Reiniciando após reversão de categoria...");
                        try
                        {
                            System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
                            {
                                FileName = "shutdown",
                                Arguments = "/r /t 5 /c \"Voltris Optimizer: Reversão concluída, reiniciando em 5 segundos...\"",
                                CreateNoWindow = true,
                                UseShellExecute = false
                            });
                        }
                        catch (Exception ex)
                        {
                            _logger?.LogError($"[PerformanceVM] Erro ao disparar shutdown: {ex.Message}", ex);
                        }
                    }
                }
                else
                {
                    category.StatusText = "Nada a reverter";
                    OptimizationStatus = "ℹ️ Nenhuma otimização ativa para reverter nesta categoria";
                }
            }
            catch (Exception ex)
            {
                category.StatusText = "❌ Erro";
                OptimizationStatus = $"❌ Erro: {ex.Message}";
                _logger?.LogError($"[PerformanceVM] Erro ao reverter categoria '{category.Name}': {ex.Message}", ex);
            }
            finally
            {
                IsOptimizing = false;
                category.IsWorking = false;
            }
        }

        /// <summary>
        /// Aplica as otimizações selecionadas (ou as recomendadas, se nada for selecionado)
        /// CORREÇÃO CRÍTICA: Modal de reinício é exibido ANTES de aplicar otimizações
        /// </summary>
        private async Task AutoOptimizeAsync()
        {
            if (_performanceService == null || IsOptimizing)
                return;

            try
            {
                _logger?.LogInfo("[PerformanceVM] ========== INÍCIO: Executar Análise ==========");
                _logger?.LogInfo($"[PerformanceVM] Perfil Inteligente Ativo: {SettingsService.Instance.Settings.IntelligentProfile}");

                // ETAPA 1: Coletar otimizações selecionadas
                var selectedOptimizations = Categories?
                    .SelectMany(c => c.Optimizations)
                    .Where(o => o.IsSelected)
                    .Select(o => o.Name)
                    .Distinct()
                    .ToList() ?? new List<string>();

                var optimizationCount = selectedOptimizations.Count > 0 
                    ? selectedOptimizations.Count 
                    : Categories?.SelectMany(c => c.Optimizations).Count(o => o.IsRecommended) ?? 0;

                _logger?.LogInfo($"[PerformanceVM] Otimizações a aplicar: {optimizationCount}");

                // ETAPA 2: Exibir Modal de Reinício ANTES de aplicar
                VoltrisOptimizer.UI.Windows.RestartConfirmationModal.RestartChoice userChoice = 
                    VoltrisOptimizer.UI.Windows.RestartConfirmationModal.RestartChoice.Cancel;
                
                await System.Windows.Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    try
                    {
                        var modal = new VoltrisOptimizer.UI.Windows.RestartConfirmationModal
                        {
                            Owner = System.Windows.Application.Current.MainWindow
                        };
                        modal.ShowDialog();
                        userChoice = modal.UserChoice;
                        _logger?.LogInfo($"[PerformanceVM] Modal resultado: UserChoice={userChoice}");
                    }
                    catch (Exception modalEx)
                    {
                        _logger?.LogError($"[PerformanceVM] Erro ao exibir modal: {modalEx.Message}", modalEx);
                    }
                });
                
                if (userChoice == VoltrisOptimizer.UI.Windows.RestartConfirmationModal.RestartChoice.Cancel)
                {
                    _logger?.LogInfo("[PerformanceVM] ========== CANCELADO: Usuário cancelou no modal ==========");
                    
                    OptimizationStatus = "Operação cancelada pelo usuário";
                    IntelligentStatusMessage = "Cancelado";
                    
                    App.TelemetryService?.TrackEvent("PERFORMANCE_OPTIMIZE_CANCELLED", "User", "Modal", forceFlush: true);
                    
                    // Mostrar na barra de progresso global que foi cancelado
                    Services.GlobalProgressService.Instance.StartOperation("Otimização de Desempenho", isPriority: true);
                    Services.GlobalProgressService.Instance.UpdateProgress(0, "❌ Otimização cancelada pelo usuário");
                    Services.GlobalProgressService.Instance.CompleteOperation("❌ Otimização Cancelada");
                    return;
                }
                
                bool shouldRestartNow = (userChoice == VoltrisOptimizer.UI.Windows.RestartConfirmationModal.RestartChoice.RestartNow);
                bool shouldRestartLater = (userChoice == VoltrisOptimizer.UI.Windows.RestartConfirmationModal.RestartChoice.RestartLater);
                _logger?.LogInfo($"[PerformanceVM] Usuário prosseguiu. RestartNow={shouldRestartNow}, RestartLater={shouldRestartLater}");

                // ETAPA 3: Preparar aplicação
                IsOptimizing = true;
                OptimizationStatus = "Aplicando otimizações...";
                IntelligentStatusMessage = "Analisando sistema...";
                
                string choiceLabel = shouldRestartNow ? "Reiniciar Agora" : "Reiniciar Depois";
                
                Services.GlobalProgressService.Instance.StartOperation("Otimização de Desempenho", isPriority: true);
                Services.GlobalProgressService.Instance.UpdateProgress(5, $"Iniciando otimização... (Escolha: {choiceLabel})");

                _logger?.LogInfo("[PerformanceVM] Iniciando aplicação de otimizações...");

                using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(5));

                VoltrisOptimizer.Services.Performance.Models.PerformanceOptimizationResult result;

                if (selectedOptimizations.Count > 0)
                {
                    _logger?.LogInfo($"[PerformanceVM] Aplicando {selectedOptimizations.Count} otimizações selecionadas pelo usuário...");
                    
                    IntelligentStatusMessage = $"Aplicando {selectedOptimizations.Count} otimizações...";
                    Services.GlobalProgressService.Instance.UpdateProgress(20, $"Aplicando {selectedOptimizations.Count} otimizações...");
                    
                    App.TelemetryService?.TrackEvent("PERFORMANCE_OPTIMIZE", "Manual", "Start", metadata: new { Count = selectedOptimizations.Count }, forceFlush: true);

                    result = await _performanceService.ApplyOptimizationsAsync(selectedOptimizations, cts.Token);
                }
                else
                {
                    _logger?.LogInfo("[PerformanceVM] Nenhuma otimização selecionada manualmente. Aplicando pacote recomendado...");
                    
                    IntelligentStatusMessage = "Aplicando otimizações recomendadas...";
                    Services.GlobalProgressService.Instance.UpdateProgress(20, "Aplicando otimizações recomendadas...");
                    
                    App.TelemetryService?.TrackEvent("PERFORMANCE_OPTIMIZE", "Recommended", "Start", forceFlush: true);

                    result = await _performanceService.ApplyRecommendedOptimizationsAsync(cts.Token);
                }

                // ETAPA 4: Processar resultado
                _logger?.LogInfo($"[PerformanceVM] Resultado: Success={result.Success}, TotalApplied={result.TotalApplied}");
                
                App.TelemetryService?.TrackEvent("PERFORMANCE_OPTIMIZE_END", selectedOptimizations.Count > 0 ? "Manual" : "Recommended", "End", success: result.Success, metadata: new { Count = result.TotalApplied }, forceFlush: true);

                if (result.Success || result.TotalApplied > 0)
                {
                    if (result.TotalApplied > 0)
                    {
                        var errorCount = result.Errors?.Count ?? 0;
                        string globalMsg;
                        
                        if (errorCount > 0)
                        {
                            OptimizationStatus = $"⚠️ {result.TotalApplied} aplicadas ({errorCount} omitidas/falhas)";
                            IntelligentStatusMessage = $"⚠️ {result.TotalApplied} otimizações reais";
                            globalMsg = $"⚠️ {result.TotalApplied} otimizações aplicadas ({errorCount} falhas) — {choiceLabel}";
                            _logger?.LogWarning($"[PerformanceVM] SUCESSO PARCIAL: {result.TotalApplied} aplicadas, {errorCount} não suportadas pelo sistema.");
                        }
                        else
                        {
                            OptimizationStatus = $"✅ {result.TotalApplied} otimizações aplicadas com sucesso";
                            IntelligentStatusMessage = $"✅ {result.TotalApplied} otimizações aplicadas";
                            globalMsg = $"✅ {result.TotalApplied} otimizações aplicadas — {choiceLabel}";
                            _logger?.LogSuccess($"[PerformanceVM] ========== SUCESSO: {result.TotalApplied} otimizações aplicadas ==========");
                        }

                        Services.GlobalProgressService.Instance.UpdateProgress(90, globalMsg);

                        // ETAPA 5: Reiniciar sistema caso usuário tenha escolhido RestartNow
                        if (shouldRestartNow)
                        {
                            Services.GlobalProgressService.Instance.UpdateProgress(95, "🔄 Reiniciando o sistema em 5 segundos...");
                            _logger?.LogInfo("[PerformanceVM] Otimizações concluídas. Reiniciando o sistema...");
                            try
                            {
                                System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
                                {
                                    FileName = "shutdown",
                                    Arguments = "/r /t 5 /c \"Voltris Optimizer: Otimização concluída, reiniciando o sistema em 5 segundos...\"",
                                    CreateNoWindow = true,
                                    UseShellExecute = false
                                });
                            }
                            catch (Exception ex)
                            {
                                _logger?.LogError($"[PerformanceVM] Erro crítico ao tentar disparar o shutdown: {ex.Message}", ex);
                            }
                        }
                        
                        Services.GlobalProgressService.Instance.CompleteOperation(globalMsg);
                    }
                    else
                    {
                        OptimizationStatus = "ℹ️ Nenhuma otimização adicional necessária para o seu sistema";
                        IntelligentStatusMessage = "Sistema já otimizado";
                        
                        Services.GlobalProgressService.Instance.CompleteOperation("ℹ️ Sistema já otimizado — nenhuma alteração necessária");
                        _logger?.LogInfo("[PerformanceVM] ========== CONCLUÍDO: Sistema já otimizado ==========");
                    }
                }
                else
                {
                    var errorCount = result.Errors?.Count ?? 0;
                    
                    if (result.Success && result.TotalApplied == 0)
                    {
                        OptimizationStatus = "ℹ️ Configurações restringidas pelo Perfil Inteligente";
                        IntelligentStatusMessage = "Restringido por Perfil";
                        Services.GlobalProgressService.Instance.CompleteOperation($"ℹ️ Restringido pelo Perfil Inteligente ({SettingsService.Instance.Settings.IntelligentProfile})");
                        _logger?.LogWarning("[PerformanceVM] Otimização concluída sem alterações devido às restrições do perfil ativo.");
                    }
                    else
                    {
                        OptimizationStatus = errorCount > 0
                            ? $"❌ Falha na otimização ({errorCount} erros)"
                            : "❌ Não foi possível completar a otimização";
                        IntelligentStatusMessage = "❌ Erro na otimização";

                        Services.GlobalProgressService.Instance.CompleteOperation($"❌ Falha na otimização ({errorCount} erros)");
                        _logger?.LogError($"[PerformanceVM] ========== ERRO: Falha ao aplicar otimizações ==========");
                        if (result.Errors != null)
                        {
                            foreach (var err in result.Errors) _logger?.LogError($"[PerformanceVM] Detalhe do Erro: {err}");
                        }
                    }
                }
            }
            catch (OperationCanceledException)
            {
                OptimizationStatus = "❌ Operação cancelada (timeout)";
                IntelligentStatusMessage = "Operação cancelada";
                _logger?.LogWarning("[PerformanceVM] ========== TIMEOUT: Otimização cancelada ==========");
                
                Services.GlobalProgressService.Instance.CompleteOperation("❌ Operação Cancelada (Timeout)");
                App.TelemetryService?.TrackEvent("PERFORMANCE_OPTIMIZE_TIMEOUT", "System", "Timeout", forceFlush: true);
            }
            catch (Exception ex)
            {
                OptimizationStatus = $"❌ Erro: {ex.Message}";
                IntelligentStatusMessage = "Erro na análise";
                _logger?.LogError($"[PerformanceVM] ========== EXCEÇÃO: Erro na otimização ==========", ex);
                
                Services.GlobalProgressService.Instance.CompleteOperation($"❌ Erro: {ex.Message}");
                App.TelemetryService?.TrackExceptionAsync(ex, "PerformanceVM.AutoOptimize");
            }
            finally
            {
                IsOptimizing = false;
                _logger?.LogInfo("[PerformanceVM] ========== FIM: Executar Análise ==========");
            }
        }

        /// <summary>
        /// Reverte todas as otimizações aplicadas.
        /// Exibe o modal de reinicialização (mesmo modal do botão APLICAR).
        /// </summary>
        private async Task RevertAllAsync()
        {
            if (_performanceService == null || IsOptimizing)
                return;

            try
            {
                _logger?.LogInfo("[PerformanceVM] ========== INÍCIO: Reverter Tudo ==========");

                // ETAPA 1: Exibir modal de reinicialização ANTES de reverter
                VoltrisOptimizer.UI.Windows.RestartConfirmationModal.RestartChoice userChoice =
                    VoltrisOptimizer.UI.Windows.RestartConfirmationModal.RestartChoice.Cancel;

                await System.Windows.Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    try
                    {
                        var modal = new VoltrisOptimizer.UI.Windows.RestartConfirmationModal
                        {
                            Owner = System.Windows.Application.Current.MainWindow
                        };
                        modal.ShowDialog();
                        userChoice = modal.UserChoice;
                        _logger?.LogInfo($"[PerformanceVM] Modal reversão resultado: UserChoice={userChoice}");
                    }
                    catch (Exception modalEx)
                    {
                        _logger?.LogError($"[PerformanceVM] Erro ao exibir modal de reversão: {modalEx.Message}", modalEx);
                    }
                });

                if (userChoice == VoltrisOptimizer.UI.Windows.RestartConfirmationModal.RestartChoice.Cancel)
                {
                    _logger?.LogInfo("[PerformanceVM] ========== CANCELADO: Usuário cancelou reversão no modal ==========");
                    OptimizationStatus = "Reversão cancelada pelo usuário";
                    IntelligentStatusMessage = "Cancelado";
                    App.TelemetryService?.TrackEvent("PERFORMANCE_REVERT_CANCELLED", "User", "Modal", forceFlush: true);
                    
                    // Mostrar na barra de progresso global que foi cancelado
                    Services.GlobalProgressService.Instance.StartOperation("Reversão de Otimizações", isPriority: true);
                    Services.GlobalProgressService.Instance.UpdateProgress(0, "❌ Reversão cancelada pelo usuário");
                    Services.GlobalProgressService.Instance.CompleteOperation("❌ Reversão Cancelada");
                    return;
                }

                bool shouldRestartNow = (userChoice == VoltrisOptimizer.UI.Windows.RestartConfirmationModal.RestartChoice.RestartNow);
                bool shouldRestartLater = (userChoice == VoltrisOptimizer.UI.Windows.RestartConfirmationModal.RestartChoice.RestartLater);
                string choiceLabel = shouldRestartNow ? "Reiniciar Agora" : "Reiniciar Depois";
                _logger?.LogInfo($"[PerformanceVM] Usuário confirmou reversão. RestartNow={shouldRestartNow}");

                // ETAPA 2: Executar reversão
                IsOptimizing = true;
                OptimizationStatus = "Revertendo otimizações...";
                IntelligentStatusMessage = "Revertendo...";

                Services.GlobalProgressService.Instance.StartOperation("Revertendo Otimizações", isPriority: true);
                Services.GlobalProgressService.Instance.UpdateProgress(10, $"Revertendo otimizações... (Escolha: {choiceLabel})");

                using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(5));

                App.TelemetryService?.TrackEvent("PERFORMANCE_REVERT", "All", "Start", forceFlush: true);

                var result = await _performanceService.RevertAllOptimizationsAsync(cts.Token);

                App.TelemetryService?.TrackEvent("PERFORMANCE_REVERT_END", "All", "End", success: result.Success, metadata: new { Count = result.TotalApplied }, forceFlush: true);

                if (result.Success)
                {
                    if (result.TotalApplied > 0)
                    {
                        OptimizationStatus = $"✅ {result.TotalApplied} otimizações revertidas com sucesso";
                        IntelligentStatusMessage = $"✅ {result.TotalApplied} revertidas";
                        _logger?.LogSuccess($"[PerformanceVM] ========== SUCESSO: {result.TotalApplied} otimizações revertidas ==========");
                        
                        string globalMsg = $"✅ {result.TotalApplied} otimizações revertidas — {choiceLabel}";
                        Services.GlobalProgressService.Instance.UpdateProgress(90, globalMsg);

                        // ETAPA 3: Reiniciar se o usuário escolheu
                        if (shouldRestartNow)
                        {
                            Services.GlobalProgressService.Instance.UpdateProgress(95, "🔄 Reiniciando o sistema em 5 segundos...");
                            _logger?.LogInfo("[PerformanceVM] Reversão concluída. Reiniciando o sistema...");
                            try
                            {
                                System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo
                                {
                                    FileName = "shutdown",
                                    Arguments = "/r /t 5 /c \"Voltris Optimizer: Reversão concluída, reiniciando o sistema em 5 segundos...\"",
                                    CreateNoWindow = true,
                                    UseShellExecute = false
                                });
                            }
                            catch (Exception ex)
                            {
                                _logger?.LogError($"[PerformanceVM] Erro ao disparar shutdown após reversão: {ex.Message}", ex);
                            }
                        }
                        
                        Services.GlobalProgressService.Instance.CompleteOperation(globalMsg);
                    }
                    else
                    {
                        OptimizationStatus = "ℹ️ Nenhuma otimização ativa encontrada para reverter";
                        IntelligentStatusMessage = "Nada a reverter";
                        Services.GlobalProgressService.Instance.CompleteOperation("ℹ️ Nenhuma otimização para reverter");
                        _logger?.LogInfo("[PerformanceVM] ========== CONCLUÍDO: Nenhuma otimização para reverter ==========");
                    }
                }
                else
                {
                    var errorCount = result.Errors?.Count ?? 0;
                    OptimizationStatus = errorCount > 0
                        ? $"❌ Erros ao reverter otimizações ({errorCount})"
                        : "❌ Não foi possível reverter as otimizações";
                    IntelligentStatusMessage = "❌ Erro na reversão";

                    Services.GlobalProgressService.Instance.CompleteOperation($"❌ Falha na reversão ({errorCount} erros)");
                    _logger?.LogError($"[PerformanceVM] ========== ERRO: Falha ao reverter. Revertidas: {result.TotalApplied}, Erros: {errorCount} ==========");
                }
            }
            catch (OperationCanceledException)
            {
                OptimizationStatus = "❌ Operação cancelada (timeout)";
                IntelligentStatusMessage = "Cancelado (timeout)";
                _logger?.LogWarning("[PerformanceVM] ========== TIMEOUT: Reversão cancelada ==========");
                Services.GlobalProgressService.Instance.CompleteOperation("❌ Reversão Cancelada (Timeout)");
            }
            catch (Exception ex)
            {
                OptimizationStatus = $"❌ Erro: {ex.Message}";
                IntelligentStatusMessage = "Erro na reversão";
                _logger?.LogError("[PerformanceVM] ========== EXCEÇÃO: Erro na reversão ==========", ex);
                Services.GlobalProgressService.Instance.CompleteOperation($"❌ Erro na reversão: {ex.Message}");
            }
            finally
            {
                IsOptimizing = false;
                _logger?.LogInfo("[PerformanceVM] ========== FIM: Reverter Tudo ==========");
            }
        }
    }
}