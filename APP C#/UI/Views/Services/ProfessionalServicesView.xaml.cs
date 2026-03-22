using System.Windows.Controls;

namespace VoltrisOptimizer.UI.Views
{
    /// <summary>
    /// Code-behind for ProfessionalServicesView.
    /// Namespace updated to avoid conflicts.
    /// </summary>
    public partial class ProfessionalServicesView : UserControl
    {
        public ProfessionalServicesView()
        {
            InitializeComponent();
            App.LoggingService?.LogTrace("[UI] Navegou para ProfessionalServicesView");
        }
    }
}
