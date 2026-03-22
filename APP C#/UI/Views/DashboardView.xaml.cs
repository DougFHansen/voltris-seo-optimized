using System;
using System.Windows.Controls;
using VoltrisOptimizer.UI.ViewModels;

namespace VoltrisOptimizer.UI.Views
{
    /// <summary>
    /// Interaction logic for DashboardView.xaml
    /// </summary>
    public partial class DashboardView : UserControl
    {
        public DashboardView()
        {
            InitializeComponent();
            
            // Track page view
            Loaded += (s, e) =>
            {
                App.TelemetryService?.TrackEvent(
                    "PAGE_VIEW",
                    "Dashboard",
                    "Load",
                    success: true
                );
            };
        }
    }
}
