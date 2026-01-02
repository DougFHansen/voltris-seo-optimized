using System;
using System.Collections.Generic;
using System.Windows;
using System.Windows.Controls;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.UI.Views;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Páginas disponíveis para navegação
    /// </summary>
    public enum AppPage
    {
        Dashboard,
        Cleanup,
        Performance,
        Network,
        System,
        Gamer,
        Diagnostics,
        History,
        Scheduler,
        Logs,
        Settings,
        Onboarding,
        ProfilerQuestionnaire,
        ProfilerSummary,
        LyraResponse
    }
    
    /// <summary>
    /// Serviço de navegação tipado e centralizado
    /// </summary>
    public class NavigationService : INavigationService
    {
        private ContentControl? _contentHost;
        private readonly Stack<AppPage> _navigationHistory = new();
        private AppPage _currentPage = AppPage.Dashboard;
        private readonly ILoggingService? _logger;
        
        /// <summary>
        /// Evento disparado quando a navegação ocorre
        /// </summary>
        public event EventHandler<NavigationEventArgs>? Navigated;
        
        /// <summary>
        /// Página atual
        /// </summary>
        public AppPage CurrentPage => _currentPage;
        
        /// <summary>
        /// Indica se pode voltar no histórico
        /// </summary>
        public bool CanGoBack => _navigationHistory.Count > 0;
        
        public NavigationService()
        {
            _logger = App.LoggingService;
            InitializeContentHost();
        }
        
        public NavigationService(ILoggingService? logger)
        {
            _logger = logger;
            InitializeContentHost();
        }
        
        private void InitializeContentHost()
        {
            try
            {
                var mainWindow = Application.Current?.MainWindow;
                if (mainWindow != null)
                {
                    _contentHost = mainWindow.FindName("ContentFrame") as ContentControl;
                }
            }
            catch (Exception ex)
            {
                _logger?.LogWarning($"[NAV] Erro ao inicializar ContentHost: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Navega para uma página tipada
        /// </summary>
        public bool NavigateTo(AppPage page, object? parameter = null)
        {
            try
            {
                if (_contentHost == null)
                {
                    InitializeContentHost();
                    if (_contentHost == null)
                    {
                        _logger?.LogWarning("[NAV] ContentHost não encontrado");
                        return false;
                    }
                }
                
                var view = CreateView(page, parameter);
                if (view == null)
                {
                    _logger?.LogWarning($"[NAV] Não foi possível criar view para: {page}");
                    return false;
                }
                
                // Salvar página atual no histórico
                _navigationHistory.Push(_currentPage);
                _currentPage = page;
                
                // Navegar
                _contentHost.Content = view;
                
                _logger?.LogInfo($"[NAV] Navegou para: {page}");
                Navigated?.Invoke(this, new NavigationEventArgs(page, parameter));
                
                return true;
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[NAV] Erro ao navegar para {page}: {ex.Message}", ex);
                return false;
            }
        }
        
        /// <summary>
        /// Navega para uma página por string (compatibilidade com código legado)
        /// </summary>
        public void NavigateTo(string viewKey)
        {
            if (Enum.TryParse<AppPage>(viewKey, true, out var page))
            {
                NavigateTo(page);
            }
            else
            {
                // Fallback para views antigas
                var view = ResolveViewLegacy(viewKey);
                if (view != null && _contentHost != null)
                {
                    _contentHost.Content = view;
                }
            }
        }
        
        /// <summary>
        /// Volta para a página anterior
        /// </summary>
        public bool GoBack()
        {
            if (!CanGoBack) return false;
            
            var previousPage = _navigationHistory.Pop();
            _currentPage = previousPage;
            
            var view = CreateView(previousPage);
            if (view != null && _contentHost != null)
            {
                _contentHost.Content = view;
                _logger?.LogInfo($"[NAV] Voltou para: {previousPage}");
                return true;
            }
            
            return false;
        }
        
        /// <summary>
        /// Exibe um modal
        /// </summary>
        public void ShowModal(string viewKey)
        {
            var view = ResolveViewLegacy(viewKey);
            if (view == null) return;
            
            var window = new Window 
            { 
                Content = view, 
                WindowStartupLocation = WindowStartupLocation.CenterOwner, 
                Owner = Application.Current?.MainWindow,
                WindowStyle = WindowStyle.None,
                AllowsTransparency = true,
                Background = System.Windows.Media.Brushes.Transparent
            };
            window.ShowDialog();
        }
        
        /// <summary>
        /// Fecha o modal ativo
        /// </summary>
        public void CloseModal()
        {
            var windows = Application.Current?.Windows;
            if (windows == null || windows.Count == 0) return;
            
            var topWindow = windows[windows.Count - 1] as Window;
            if (topWindow != null && topWindow != Application.Current?.MainWindow)
            {
                topWindow.Close();
            }
        }
        
        /// <summary>
        /// Limpa o histórico de navegação
        /// </summary>
        public void ClearHistory()
        {
            _navigationHistory.Clear();
        }
        
        /// <summary>
        /// Cria uma view baseada na página
        /// </summary>
        private UserControl? CreateView(AppPage page, object? parameter = null)
        {
            try
            {
                return page switch
                {
                    AppPage.Dashboard => new DashboardView(),
                    AppPage.Cleanup => new CleanupView(),
                    AppPage.Performance => new PerformanceView(),
                    AppPage.Network => new NetworkView(),
                    AppPage.System => new SystemView(),
                    AppPage.Gamer => new GamerView(),
                    AppPage.Diagnostics => new GameDiagnosticsView(),
                    AppPage.History => new HistoryView(),
                    AppPage.Scheduler => new SchedulerView(),
                    AppPage.Logs => new LogsView(),
                    AppPage.Settings => new SettingsView(),
                    AppPage.Onboarding => new OnboardingView(),
                    AppPage.ProfilerQuestionnaire => new Core.SystemIntelligenceProfiler.UI.Views.ProfilerQuestionnaireView(),
                    AppPage.ProfilerSummary => new Core.SystemIntelligenceProfiler.UI.Views.ProfilerSummaryView(),
                    AppPage.LyraResponse => new LyraResponseView(),
                    _ => null
                };
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[NAV] Erro ao criar view {page}: {ex.Message}", ex);
                return null;
            }
        }
        
        /// <summary>
        /// Resolve view por string (legado)
        /// </summary>
        private object? ResolveViewLegacy(string key)
        {
            return key switch
            {
                "ProfilerFlow" => new Core.SystemIntelligenceProfiler.UI.Views.ProfilerSummaryView(),
                "Dashboard" => new DashboardView(),
                "Cleanup" => new CleanupView(),
                "Performance" => new PerformanceView(),
                "Network" => new NetworkView(),
                "System" => new SystemView(),
                "Gamer" => new GamerView(),
                "Diagnostics" => new GameDiagnosticsView(),
                "History" => new HistoryView(),
                "Scheduler" => new SchedulerView(),
                "Logs" => new LogsView(),
                "Settings" => new SettingsView(),
                _ => null
            };
        }
    }
    
    /// <summary>
    /// Argumentos do evento de navegação
    /// </summary>
    public class NavigationEventArgs : EventArgs
    {
        public AppPage Page { get; }
        public object? Parameter { get; }
        
        public NavigationEventArgs(AppPage page, object? parameter = null)
        {
            Page = page;
            Parameter = parameter;
        }
    }
}
