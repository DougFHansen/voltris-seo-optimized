using System.Windows.Controls;

namespace VoltrisOptimizer.UI.Views
{
    /// <summary>
    /// Interação lógica para ActivityHistoryView.xam
    /// </summary>
    public partial class ActivityHistoryView : UserControl
    {
        public ActivityHistoryView()
        {
            InitializeComponent();
            App.LoggingService?.LogTrace("[UI] Navegou para ActivityHistoryView");
        }
    }
}
