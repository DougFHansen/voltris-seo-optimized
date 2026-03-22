using System;
using Microsoft.Extensions.DependencyInjection;

namespace VoltrisOptimizer.UI.ViewModels
{
    public class ViewModelLocator
    {
        private IServiceProvider? Services => App.Services;
        private DashboardViewModel? _dashboardVM;
        private PerformanceViewModel? _performanceVM;

        public DashboardViewModel DashboardVM
        {
            get
            {
                if (_dashboardVM == null)
                {
                    App.LoggingService?.LogTrace("[VM_LOCATOR] Resolvendo DashboardViewModel...");
                    _dashboardVM = Services?.GetService<DashboardViewModel>();
                    
                    // Fallback se DI não estiver pronto (não deve acontecer com Singleton)
                    if (_dashboardVM == null)
                    {
                        App.LoggingService?.LogWarning("[VM_LOCATOR] DashboardViewModel não encontrado via DI. Usando fallback...");
                        var nav = Services?.GetService<VoltrisOptimizer.Interfaces.INavigationService>();
                        _dashboardVM = nav != null ? new DashboardViewModel(nav) : null;
                    }
                }
                return _dashboardVM;
            }
        }

        public PerformanceViewModel PerformanceVM
        {
            get
            {
                if (_performanceVM == null)
                {
                    App.LoggingService?.LogTrace("[VM_LOCATOR] Inicializando PerformanceViewModel...");
                    // Ensure creation on UI thread
                    var dispatcher = System.Windows.Application.Current?.Dispatcher;
                    if (dispatcher != null && !dispatcher.CheckAccess())
                    {
                        return dispatcher.Invoke(() =>
                        {
                            _performanceVM = new PerformanceViewModel();
                            return _performanceVM;
                        });
                    }
                    else
                    {
                        _performanceVM = new PerformanceViewModel();
                    }
                }
                return _performanceVM;
            }
        }

        public VoltrisOptimizer.Services.DPC.IDpcAnalyzerService DpcSvc => Services?.GetService<VoltrisOptimizer.Services.DPC.IDpcAnalyzerService>()!;

        public GamerViewModel GamerVM 
        {
            get
            {
                var svc = Services?.GetService<VoltrisOptimizer.UI.ViewModels.GamerViewModel>();
                if (svc == null) return null!;

                // Verificação de thread para segurança extra
                var dispatcher = System.Windows.Application.Current?.Dispatcher;
                if (dispatcher != null && !dispatcher.CheckAccess())
                {
                    return dispatcher.Invoke(() => svc);
                }
                return svc;
            }
        }

        public VoltrisOptimizer.UI.ViewModels.ProfessionalServicesViewModel ProfessionalServicesVM => 
            App.Services?.GetService<VoltrisOptimizer.UI.ViewModels.ProfessionalServicesViewModel>();

        public StreamHubViewModel StreamHubVM =>
            App.Services?.GetService<StreamHubViewModel>()!;
    }
}
