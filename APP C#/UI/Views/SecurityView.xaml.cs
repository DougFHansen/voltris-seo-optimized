using System.Windows.Controls;
using Microsoft.Extensions.DependencyInjection;
using VoltrisOptimizer.Core;
using VoltrisOptimizer.UI.ViewModels;

namespace VoltrisOptimizer.UI.Views
{
    public partial class SecurityView : UserControl
    {
        public SecurityView()
        {
            InitializeComponent();
            App.LoggingService?.LogTrace("[UI] Navegou para SecurityView");
            DataContext = ServiceLocator.GetRequiredService<SecurityViewModel>();
        }
    }
}
