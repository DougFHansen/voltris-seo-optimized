using System;
using Microsoft.Extensions.DependencyInjection;

namespace VoltrisOptimizer.UI.ViewModels
{
    public class ViewModelLocator
    {
        private ServiceProvider? Services => VoltrisOptimizer.App.Services;

        public DashboardViewModel DashboardVM
        {
            get
            {
                var nav = Services?.GetService<VoltrisOptimizer.Interfaces.INavigationService>();
                return new DashboardViewModel(nav);
            }
        }

        public PerformanceViewModel PerformanceVM => new PerformanceViewModel();
        public VoltrisOptimizer.Services.DPC.IDpcAnalyzerService DpcSvc => Services?.GetService<VoltrisOptimizer.Services.DPC.IDpcAnalyzerService>()!;

        public GamerViewModel GamerVM => Services?.GetService<VoltrisOptimizer.UI.ViewModels.GamerViewModel>()!;
    }
}
