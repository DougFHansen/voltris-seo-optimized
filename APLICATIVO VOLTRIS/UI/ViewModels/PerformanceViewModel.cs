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
    public class PerformanceViewModel : ViewModelBase
    {
        private readonly ILoggingService? _logger;
        private readonly IPerformanceOptimizationService? _performanceService;
        private readonly IGamerModeOrchestrator? _gamerOrchestrator;
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
        private ObservableCollection<PerfCategoryViewModel> _categories = new();

        public ICommand AutoOptimizeCommand { get; }
        public ICommand RevertAllCommand { get; }
        
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
            get => _categories;
            set { SetProperty(ref _categories, value); }
        }

        public PerformanceViewModel()
        {
            _logger = VoltrisOptimizer.App.LoggingService;
            
            // Tentar obter via DI, fallback para App estático
            try
            {
                var serviceProvider = VoltrisOptimizer.App.Services;
                if (serviceProvider != null)
                {
                    _performanceService = serviceProvider.GetService(typeof(IPerformanceOptimizationService)) as IPerformanceOptimizationService;
                    _gamerOrchestrator = serviceProvider.GetService(typeof(IGamerModeOrchestrator)) as IGamerModeOrchestrator;
                    _logger?.LogInfo($"[PerformanceVM] Serviço obtido via DI: {_performanceService != null}, Gamer: {_gamerOrchestrator != null}");
                }
            }
            catch (Exception ex)
            {
                _logger?.LogWarning($"[PerformanceVM] Erro ao obter serviço via DI: {ex.Message}");
            }
            
            // Fallback: criar wrapper se UltraPerformance estiver disponível
            if (_performanceService == null && VoltrisOptimizer.App.UltraPerformance != null && _logger != null)
            {
                try
                {
                    _performanceService = new PerformanceOptimizationService(
                        VoltrisOptimizer.App.UltraPerformance, 
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
                    
                    // Atualizar UI com mensagem de erro
                    System.Windows.Application.Current?.Dispatcher.Invoke(() =>
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

                // Atualizar UI na thread principal
                if (profile != null)
                {
                    System.Windows.Application.Current?.Dispatcher.Invoke(() =>
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

                // Atualizar UI na thread principal
                if (categories != null)
                {
                    System.Windows.Application.Current?.Dispatcher.Invoke(() =>
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
                
                // Atualizar UI com mensagem de erro
                System.Windows.Application.Current?.Dispatcher.Invoke(() =>
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
                // CPU
                var cpuShort = profile.CPUName ?? "Desconhecido";
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

                // RAM
                ProfileRam = $"{profile.TotalRAMGB:F0} GB";

                // Storage
                if (profile.HasNVMe)
                    ProfileStorage = "NVMe SSD";
                else if (profile.HasSSD)
                    ProfileStorage = "SSD";
                else
                    ProfileStorage = "HDD";

                // GPU
                var gpuShort = profile.GPUName ?? "Desconhecido";
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
                                    // Verificar compatibilidade com hardware
                                    var isCompatible = IsOptimizationCompatible(opt, profile, isGamerModeActive);
                                    
                                    // Verificar se é seguro para hardware atual
                                    var isSafe = IsOptimizationSafe(opt);
                                    
                                    // Determinar se deve ser selecionada por padrão
                                    var shouldSelect = opt.IsRecommended && isCompatible && isSafe;

                                    var optVm = new PerfOptimizationViewModel
                                    {
                                        Name = opt.Name ?? "Sem nome",
                                        Description = opt.Description ?? "",
                                        IsSelected = shouldSelect,
                                        IsRecommended = opt.IsRecommended && isCompatible,
                                        Impact = opt.Impact,
                                        ApplyAction = opt.ApplyAction,
                                        RevertAction = opt.RevertAction,
                                        IsEnabled = isCompatible,
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
                        newCategories.Add(catVm);
                    }
                    catch (Exception ex)
                    {
                        _logger?.LogWarning($"[PerformanceVM] Erro ao processar categoria {cat.Name}: {ex.Message}");
                    }
                }

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
        /// Aplica as otimizações selecionadas (ou as recomendadas, se nada for selecionado)
        /// </summary>
        private async Task AutoOptimizeAsync()
        {
            if (_performanceService == null || IsOptimizing)
                return;

            IsOptimizing = true;
            OptimizationStatus = "Aplicando otimizações...";

            try
            {
                _logger?.LogInfo("[PerformanceVM] Iniciando otimização automática...");

                // Criar cancellation token com timeout de 5 minutos
                using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(5));

                // Coletar otimizações selecionadas na UI
                var selectedOptimizations = Categories?
                    .SelectMany(c => c.Optimizations)
                    .Where(o => o.IsSelected)
                    .Select(o => o.Name)
                    .Distinct()
                    .ToList() ?? new List<string>();

                VoltrisOptimizer.Services.Performance.Models.PerformanceOptimizationResult result;

                if (selectedOptimizations.Count > 0)
                {
                    _logger?.LogInfo($"[PerformanceVM] Aplicando {selectedOptimizations.Count} otimizações selecionadas pelo usuário...");
                    result = await _performanceService.ApplyOptimizationsAsync(selectedOptimizations, cts.Token);
                }
                else
                {
                    _logger?.LogInfo("[PerformanceVM] Nenhuma otimização selecionada manualmente. Aplicando pacote recomendado...");
                    result = await _performanceService.ApplyRecommendedOptimizationsAsync(cts.Token);
                }

                if (result.Success)
                {
                    if (result.TotalApplied > 0)
                    {
                        OptimizationStatus = $"✅ {result.TotalApplied} otimizações aplicadas com sucesso";
                    }
                    else
                    {
                        OptimizationStatus = "ℹ️ Nenhuma otimização adicional necessária para o seu sistema";
                    }

                    _logger?.LogSuccess($"[PerformanceVM] Otimizações aplicadas. Total: {result.TotalApplied}");
                }
                else
                {
                    var errorCount = result.Errors?.Count ?? 0;
                    OptimizationStatus = errorCount > 0
                        ? $"❌ Erros ao aplicar otimizações ({errorCount})"
                        : "❌ Não foi possível aplicar as otimizações";

                    _logger?.LogError($"[PerformanceVM] Falha ao aplicar otimizações. Total aplicadas: {result.TotalApplied}, Erros: {errorCount}");
                }
            }
            catch (OperationCanceledException)
            {
                OptimizationStatus = "❌ Operação cancelada (timeout)";
                _logger?.LogWarning("[PerformanceVM] Otimização cancelada por timeout");
            }
            catch (Exception ex)
            {
                OptimizationStatus = $"❌ Erro: {ex.Message}";
                _logger?.LogError("[PerformanceVM] Erro na otimização", ex);
            }
            finally
            {
                IsOptimizing = false;
            }
        }

        /// <summary>
        /// Reverte todas as otimizações aplicadas
        /// </summary>
        private async Task RevertAllAsync()
        {
            if (_performanceService == null || IsOptimizing)
                return;

            IsOptimizing = true;
            OptimizationStatus = "Revertendo otimizações...";

            try
            {
                _logger?.LogInfo("[PerformanceVM] Iniciando reversão de otimizações...");

                // Criar cancellation token com timeout de 5 minutos
                using var cts = new CancellationTokenSource(TimeSpan.FromMinutes(5));

                var result = await _performanceService.RevertAllOptimizationsAsync(cts.Token);

                if (result.Success)
                {
                    if (result.TotalApplied > 0)
                    {
                        OptimizationStatus = $"✅ {result.TotalApplied} otimizações revertidas com sucesso";
                    }
                    else
                    {
                        OptimizationStatus = "ℹ️ Nenhuma otimização ativa encontrada para reverter";
                    }

                    _logger?.LogSuccess($"[PerformanceVM] Otimizações revertidas. Total: {result.TotalApplied}");
                }
                else
                {
                    var errorCount = result.Errors?.Count ?? 0;
                    OptimizationStatus = errorCount > 0
                        ? $"❌ Erros ao reverter otimizações ({errorCount})"
                        : "❌ Não foi possível reverter as otimizações";

                    _logger?.LogError($"[PerformanceVM] Falha ao reverter otimizações. Total revertidas: {result.TotalApplied}, Erros: {errorCount}");
                }
            }
            catch (OperationCanceledException)
            {
                OptimizationStatus = "❌ Operação cancelada (timeout)";
                _logger?.LogWarning("[PerformanceVM] Reversão cancelada por timeout");
            }
            catch (Exception ex)
            {
                OptimizationStatus = $"❌ Erro: {ex.Message}";
                _logger?.LogError("[PerformanceVM] Erro na reversão", ex);
            }
            finally
            {
                IsOptimizing = false;
            }
        }
    }
}