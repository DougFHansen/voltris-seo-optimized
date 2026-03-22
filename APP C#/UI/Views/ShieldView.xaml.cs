using System.Windows.Controls;

namespace VoltrisOptimizer.UI.Views
{
    public partial class ShieldView : UserControl
    {
        public ShieldView()
        {
            InitializeComponent();
            
            // ViewModel será injetado via DataContext pelo ViewModelLocator
            DataContext = App.Services?.GetService(typeof(VoltrisOptimizer.UI.ViewModels.ShieldViewModel));
            
            Loaded += (s, e) => App.LoggingService?.LogTrace("[UI] Navegou para ShieldView");
        }
    }
}
