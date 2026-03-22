using System.Windows.Controls;
using VoltrisOptimizer.UI.ViewModels;

namespace VoltrisOptimizer.UI.Views
{
    public partial class EnergyView : UserControl
    {
        private EnergyViewModel? _vm;

        public EnergyView()
        {
            InitializeComponent();
            App.LoggingService?.LogTrace("[UI] Navegou para EnergyView");
            _vm = new EnergyViewModel();
            DataContext = _vm;
            Loaded += async (_, _) => 
            {
                App.LoggingService?.LogTrace("[UI] EnergyView carregado. Inicializando...");
                await _vm.InitializeAsync();
            };
            Unloaded += (_, _) => 
            {
                App.LoggingService?.LogTrace("[UI] Saindo de EnergyView. Limpando recursos...");
                _vm?.Cleanup();
            };
        }
    }
}
