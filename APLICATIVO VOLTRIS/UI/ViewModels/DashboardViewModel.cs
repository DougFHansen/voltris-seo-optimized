using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Linq;
using System.Management;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Input;
using VoltrisOptimizer.Helpers;
using VoltrisOptimizer.Services;
using Microsoft.Extensions.DependencyInjection;

namespace VoltrisOptimizer.UI.ViewModels
{
    /// <summary>
    /// ViewModel para o Dashboard principal
    /// </summary>
    public class DashboardViewModel : ViewModelBase
    {
        private readonly ILoggingService? _logger;
        private readonly Interfaces.INavigationService? _navigationService;
        private readonly WmiCacheService? _wmiCache;
        
        // CORREÇÃO CRÍTICA: Throttling para evitar updates excessivos
        private DateTime _lastUpdate = DateTime.MinValue;
        private const int MinUpdateIntervalMs = 5000; // 5 segundos mínimo entre updates
        
        #region Properties
        
        private int _overallScore;
        public int OverallScore
        {
            get => _overallScore;
            set => SetProperty(ref _overallScore, value);
        }
        
        private string _scoreStatus = "Analisando...";
        public string ScoreStatus
        {
            get => _scoreStatus;
            set => SetProperty(ref _scoreStatus, value);
        }
        
        private int _cpuUsage;
        public int CpuUsage
        {
            get => _cpuUsage;
            set => SetProperty(ref _cpuUsage, value);
        }
        
        private int _ramUsage;
        public int RamUsage
        {
            get => _ramUsage;
            set => SetProperty(ref _ramUsage, value);
        }
        
        private int _diskUsage;
        public int DiskUsage
        {
            get => _diskUsage;
            set => SetProperty(ref _diskUsage, value);
        }
        
        private string _cpuInfo = "Carregando...";
        public string CpuInfo
        {
            get => _cpuInfo;
            set => SetProperty(ref _cpuInfo, value);
        }
        
        private string _ramInfo = "Carregando...";
        public string RamInfo
        {
            get => _ramInfo;
            set => SetProperty(ref _ramInfo, value);
        }
        
        private string _diskInfo = "Carregando...";
        public string DiskInfo
        {
            get => _diskInfo;
            set => SetProperty(ref _diskInfo, value);
        }
        
        private long _totalRam;
        public long TotalRam
        {
            get => _totalRam;
            set => SetProperty(ref _totalRam, value);
        }
        
        private long _usedRam;
        public long UsedRam
        {
            get => _usedRam;
            set => SetProperty(ref _usedRam, value);
        }
        
        private long _totalDisk;
        public long TotalDisk
        {
            get => _totalDisk;
            set => SetProperty(ref _totalDisk, value);
        }
        
        private long _usedDisk;
        public long UsedDisk
        {
            get => _usedDisk;
            set => SetProperty(ref _usedDisk, value);
        }
        
        private bool _isMonitoringActive;
        public bool IsMonitoringActive
        {
            get => _isMonitoringActive;
            set => SetProperty(ref _isMonitoringActive, value);
        }
        
        private bool _isCleaning;
        public bool IsCleaning
        {
            get => _isCleaning;
            set => SetProperty(ref _isCleaning, value);
        }
        
        private string _cleanupStatus = "Pronto";
        public string CleanupStatus
        {
            get => _cleanupStatus;
            set => SetProperty(ref _cleanupStatus, value);
        }
        
        public ObservableCollection<QuickActionItem> QuickActions { get; } = new();
        
        #endregion
        
        #region Commands
        
        public ICommand RefreshCommand { get; }
        public ICommand QuickOptimizeCommand { get; }
        public ICommand QuickCleanupCommand { get; }
        public ICommand NavigateToPerformanceCommand { get; }
        public ICommand NavigateToCleanupCommand { get; }
        public ICommand NavigateToNetworkCommand { get; }
        public ICommand NavigateToGamerCommand { get; }
        
        #endregion
        
        public DashboardViewModel(Interfaces.INavigationService? navigationService = null)
        {
            _logger = App.LoggingService;
            _navigationService = navigationService ?? VoltrisOptimizer.App.Services?.GetService<Interfaces.INavigationService>();
            _wmiCache = VoltrisOptimizer.App.Services?.GetService<WmiCacheService>();
            
            // Inicializar comandos
            RefreshCommand = new AsyncRelayCommand(RefreshAsync);
            QuickOptimizeCommand = new AsyncRelayCommand(QuickOptimizeAsync);
            QuickCleanupCommand = new AsyncRelayCommand(QuickCleanupAsync);
            NavigateToPerformanceCommand = new RelayCommand(() => NavigateTo(AppPage.Performance));
            NavigateToCleanupCommand = new RelayCommand(() => NavigateTo(AppPage.Cleanup));
            NavigateToNetworkCommand = new RelayCommand(() => NavigateTo(AppPage.Network));
            NavigateToGamerCommand = new RelayCommand(() => NavigateTo(AppPage.Gamer));
            
            // Configurar ações rápidas
            SetupQuickActions();
        }
        
        /// < <summary>
        /// Inicializa o ViewModel carregando dados
        /// </summary>
        public async Task InitializeAsync()
        {
            await RefreshAsync();
        }
        
        private void SetupQuickActions()
        {
            QuickActions.Clear();
            QuickActions.Add(new QuickActionItem 
            { 
                Icon = "🧹", 
                Title = "Limpeza Rápida", 
                Command = QuickCleanupCommand 
            });
            QuickActions.Add(new QuickActionItem 
            { 
                Icon = "⚡", 
                Title = "Otimizar Agora", 
                Command = QuickOptimizeCommand 
            });
            QuickActions.Add(new QuickActionItem 
            { 
                Icon = "🎮", 
                Title = "Modo Gamer", 
                Command = NavigateToGamerCommand 
            });
        }
        
        private async Task RefreshAsync()
        {
            // CORREÇÃO: Throttling - evitar updates muito frequentes
            if ((DateTime.Now - _lastUpdate).TotalMilliseconds < MinUpdateIntervalMs)
            {
                _logger?.LogInfo("[Dashboard] Update muito frequente - ignorando");
                return;
            }
            
            _lastUpdate = DateTime.Now;
            
            await ExecuteSafeAsync(async () =>
            {
                // CORREÇÃO: Executar em paralelo para reduzir tempo total
                await Task.WhenAll(
                    UpdateCpuUsageAsync(),
                    UpdateRamUsageAsync(),
                    UpdateDiskUsageAsync()
                );
                
                CalculateOverallScore();
                
                _logger?.LogInfo("[Dashboard] Métricas atualizadas");
            }, "Atualizando métricas...");
        }
        
        private async Task UpdateCpuUsageAsync()
        {
            await Task.Run(() =>
            {
                try
                {
                    // CORREÇÃO CRÍTICA: Usar WmiCache para reduzir overhead
                    // WMI queries são LENTAS (50-200ms) - cache por 10 segundos
                    var cpuData = _wmiCache?.GetOrUpdate(
                        "Dashboard_CPU",
                        () =>
                        {
                            using var searcher = new ManagementObjectSearcher("SELECT Name, LoadPercentage FROM Win32_Processor");
                            var obj = searcher.Get().Cast<ManagementObject>().FirstOrDefault();
                            return new
                            {
                                Name = obj?["Name"]?.ToString() ?? "CPU",
                                Load = obj?["LoadPercentage"] != null ? Convert.ToInt32(obj["LoadPercentage"]) : 0
                            };
                        },
                        TimeSpan.FromSeconds(10)
                    );
                    
                    if (cpuData != null)
                    {
                        CpuInfo = cpuData.Name;
                        CpuUsage = cpuData.Load;
                    }
                }
                catch (Exception ex)
                {
                    _logger?.LogWarning($"[Dashboard] Erro ao obter CPU: {ex.Message}");
                    CpuInfo = "Não disponível";
                }
            }).ConfigureAwait(false);
        }
        
        private async Task UpdateRamUsageAsync()
        {
            await Task.Run(() =>
            {
                try
                {
                    // CORREÇÃO: Usar WmiCache
                    var ramData = _wmiCache?.GetOrUpdate(
                        "Dashboard_RAM",
                        () =>
                        {
                            using var searcher = new ManagementObjectSearcher("SELECT TotalVisibleMemorySize, FreePhysicalMemory FROM Win32_OperatingSystem");
                            var obj = searcher.Get().Cast<ManagementObject>().FirstOrDefault();
                            var totalMem = Convert.ToInt64(obj?["TotalVisibleMemorySize"] ?? 0) * 1024;
                            var freeMem = Convert.ToInt64(obj?["FreePhysicalMemory"] ?? 0) * 1024;
                            var usedMem = totalMem - freeMem;
                            
                            return new
                            {
                                Total = totalMem,
                                Used = usedMem,
                                Usage = totalMem > 0 ? (int)((usedMem * 100) / totalMem) : 0,
                                Info = $"{FileSystemHelper.FormatBytes(usedMem)} / {FileSystemHelper.FormatBytes(totalMem)}"
                            };
                        },
                        TimeSpan.FromSeconds(5) // Cache RAM por 5s (muda mais rápido que CPU)
                    );
                    
                    if (ramData != null)
                    {
                        TotalRam = ramData.Total;
                        UsedRam = ramData.Used;
                        RamUsage = ramData.Usage;
                        RamInfo = ramData.Info;
                    }
                }
                catch (Exception ex)
                {
                    _logger?.LogWarning($"[Dashboard] Erro ao obter RAM: {ex.Message}");
                    RamInfo = "Não disponível";
                }
            }).ConfigureAwait(false);
        }
        
        private async Task UpdateDiskUsageAsync()
        {
            await Task.Run(() =>
            {
                try
                {
                    var systemDrive = System.IO.DriveInfo.GetDrives()[0]; // Disco do sistema
                    
                    TotalDisk = systemDrive.TotalSize;
                    UsedDisk = systemDrive.TotalSize - systemDrive.AvailableFreeSpace;
                    DiskUsage = (int)((UsedDisk * 100) / TotalDisk);
                    
                    DiskInfo = $"{FileSystemHelper.FormatBytes(UsedDisk)} / {FileSystemHelper.FormatBytes(TotalDisk)}";
                }
                catch (Exception ex)
                {
                    _logger?.LogWarning($"[Dashboard] Erro ao obter disco: {ex.Message}");
                    DiskInfo = "Não disponível";
                }
            });
        }
        
        private void CalculateOverallScore()
        {
            // Calcular score baseado nas métricas
            int score = 100;
            
            // Penalizar por uso alto de CPU
            if (CpuUsage > 80) score -= 20;
            else if (CpuUsage > 60) score -= 10;
            else if (CpuUsage > 40) score -= 5;
            
            // Penalizar por uso alto de RAM
            if (RamUsage > 90) score -= 25;
            else if (RamUsage > 75) score -= 15;
            else if (RamUsage > 60) score -= 8;
            
            // Penalizar por uso alto de disco
            if (DiskUsage > 90) score -= 20;
            else if (DiskUsage > 80) score -= 10;
            else if (DiskUsage > 70) score -= 5;
            
            OverallScore = Math.Max(0, Math.Min(100, score));
            
            ScoreStatus = OverallScore switch
            {
                >= 90 => "Excelente",
                >= 75 => "Bom",
                >= 50 => "Regular",
                >= 25 => "Ruim",
                _ => "Crítico"
            };
        }
        
        private async Task QuickOptimizeAsync()
        {
            await ExecuteSafeAsync(async () =>
            {
                _logger?.LogInfo("[Dashboard] Iniciando otimização rápida...");
                
                // Executar otimizações básicas
                await Task.Run(() =>
                {
                    // Limpar memória RAM não utilizada
                    GC.Collect();
                    GC.WaitForPendingFinalizers();
                    GC.Collect();
                });
                
                await RefreshAsync();
                
                _logger?.LogSuccess("[Dashboard] Otimização rápida concluída");
            }, "Otimizando sistema...");
        }
        
        private async Task QuickCleanupAsync()
        {
            try
            {
                IsCleaning = true;
                CleanupStatus = "Iniciando limpeza...";
                
                _logger?.LogInfo("[Dashboard] Iniciando limpeza rápida...");
                
                long totalBytesFreed = 0;
                int totalFilesDeleted = 0;
                
                // Executar limpeza completa com timeout de 60 segundos
                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(60));
                
                // Limpar arquivos temporários do usuário
                CleanupStatus = "Limpando temp do usuário...";
                await Task.Delay(100); // Permitir UI atualizar
                try
                {
                    var result1 = await Task.Run(() => FileSystemHelper.CleanDirectory(System.IO.Path.GetTempPath()), cts.Token);
                    totalFilesDeleted += result1.filesDeleted;
                    totalBytesFreed += result1.bytesFreed;
                    _logger?.LogInfo($"[Dashboard] Temp usuário: {result1.filesDeleted} arquivos, {FileSystemHelper.FormatBytes(result1.bytesFreed)}");
                }
                catch (Exception ex)
                {
                    _logger?.LogWarning($"[Dashboard] Erro ao limpar temp usuário: {ex.Message}");
                }
                
                // Limpar arquivos temporários do Windows
                CleanupStatus = "Limpando temp do Windows...";
                await Task.Delay(100);
                try
                {
                    var winTemp = @"C:\Windows\Temp";
                    if (System.IO.Directory.Exists(winTemp))
                    {
                        var result2 = await Task.Run(() => FileSystemHelper.CleanDirectory(winTemp), cts.Token);
                        totalFilesDeleted += result2.filesDeleted;
                        totalBytesFreed += result2.bytesFreed;
                        _logger?.LogInfo($"[Dashboard] Temp Windows: {result2.filesDeleted} arquivos, {FileSystemHelper.FormatBytes(result2.bytesFreed)}");
                    }
                }
                catch (Exception ex)
                {
                    _logger?.LogWarning($"[Dashboard] Erro ao limpar temp Windows: {ex.Message}");
                }
                
                // Limpar thumbnails cache
                CleanupStatus = "Limpando cache de thumbnails...";
                await Task.Delay(100);
                try
                {
                    var thumbCache = System.IO.Path.Combine(
                        System.Environment.GetFolderPath(System.Environment.SpecialFolder.LocalApplicationData),
                        "Microsoft\\Windows\\Explorer");
                    if (System.IO.Directory.Exists(thumbCache))
                    {
                        var result3 = await Task.Run(() => FileSystemHelper.CleanDirectory(thumbCache, "*.db"), cts.Token);
                        totalFilesDeleted += result3.filesDeleted;
                        totalBytesFreed += result3.bytesFreed;
                        _logger?.LogInfo($"[Dashboard] Thumbnails: {result3.filesDeleted} arquivos, {FileSystemHelper.FormatBytes(result3.bytesFreed)}");
                    }
                }
                catch (Exception ex)
                {
                    _logger?.LogWarning($"[Dashboard] Erro ao limpar thumbnails: {ex.Message}");
                }
                
                // Limpar prefetch
                CleanupStatus = "Limpando arquivos de prefetch...";
                await Task.Delay(100);
                try
                {
                    var prefetch = @"C:\Windows\Prefetch";
                    if (System.IO.Directory.Exists(prefetch))
                    {
                        var result4 = await Task.Run(() => FileSystemHelper.CleanDirectory(prefetch), cts.Token);
                        totalFilesDeleted += result4.filesDeleted;
                        totalBytesFreed += result4.bytesFreed;
                        _logger?.LogInfo($"[Dashboard] Prefetch: {result4.filesDeleted} arquivos, {FileSystemHelper.FormatBytes(result4.bytesFreed)}");
                    }
                }
                catch (Exception ex)
                {
                    _logger?.LogWarning($"[Dashboard] Erro ao limpar prefetch: {ex.Message}");
                }
                
                // Limpar cache de navegadores
                CleanupStatus = "Limpando cache de navegadores...";
                await Task.Delay(100);
                try
                {
                    var localAppData = System.Environment.GetFolderPath(System.Environment.SpecialFolder.LocalApplicationData);
                    var browserPaths = new[]
                    {
                        System.IO.Path.Combine(localAppData, "Google", "Chrome", "User Data", "Default", "Cache"),
                        System.IO.Path.Combine(localAppData, "Microsoft", "Edge", "User Data", "Default", "Cache"),
                    };
                    
                    foreach (var path in browserPaths)
                    {
                        if (System.IO.Directory.Exists(path))
                        {
                            var result = await Task.Run(() => FileSystemHelper.CleanDirectory(path), cts.Token);
                            totalFilesDeleted += result.filesDeleted;
                            totalBytesFreed += result.bytesFreed;
                        }
                    }
                    _logger?.LogInfo($"[Dashboard] Cache navegadores limpo");
                }
                catch (Exception ex)
                {
                    _logger?.LogWarning($"[Dashboard] Erro ao limpar cache navegadores: {ex.Message}");
                }
                
                CleanupStatus = "Finalizando limpeza...";
                await Task.Delay(100);
                
                _logger?.LogSuccess($"[Dashboard] Limpeza concluída: {totalFilesDeleted} arquivos, {FileSystemHelper.FormatBytes(totalBytesFreed)} liberados");
                
                // Atualizar métricas
                await RefreshAsync();
                
                // Mostrar mensagem de sucesso
                CleanupStatus = $"Limpeza concluída! {FileSystemHelper.FormatBytes(totalBytesFreed)} liberados";
                await Task.Delay(2000); // Mostrar mensagem por 2 segundos
                
                // Mostrar toast
                System.Windows.Application.Current.Dispatcher.Invoke(() =>
                {
                    new ToastService().Show("Limpeza Concluída", 
                        $"{totalFilesDeleted} arquivos removidos\n{FileSystemHelper.FormatBytes(totalBytesFreed)} liberados");
                });
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[Dashboard] Erro na limpeza: {ex.Message}", ex);
                CleanupStatus = "Erro na limpeza";
                await Task.Delay(2000);
            }
            finally
            {
                IsCleaning = false;
                CleanupStatus = "Pronto";
            }
        }
        
        private void NavigateTo(AppPage page)
        {
            try
            {
                _navigationService?.NavigateTo(page.ToString());
            }
            catch (Exception ex)
            {
                _logger?.LogWarning($"[Dashboard] Erro ao navegar: {ex.Message}");
            }
        }
        
        protected override void OnDisposing()
        {
            IsMonitoringActive = false;
            base.OnDisposing();
        }
    }
    
    /// <summary>
    /// Item de ação rápida para o dashboard
    /// </summary>
    public class QuickActionItem
    {
        public string Icon { get; set; } = "";
        public string Title { get; set; } = "";
        public ICommand? Command { get; set; }
    }
}

