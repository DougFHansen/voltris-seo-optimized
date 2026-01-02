using System.Windows.Controls;
using VoltrisOptimizer.UI.ViewModels;

namespace VoltrisOptimizer.UI.Views
{
    /// <summary>
    /// Interaction logic for GamerDiagnosticsView.xaml
    /// </summary>
    public partial class GamerDiagnosticsView : UserControl
    {
        public GamerDiagnosticsView()
        {
            InitializeComponent();
        }

        public GamerDiagnosticsView(GamerDiagnosticsViewModel viewModel) : this()
        {
            DataContext = viewModel;
        }
    }
}


