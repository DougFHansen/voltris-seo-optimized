using System.Windows.Controls;
using VoltrisOptimizer.UI.ViewModels;
using Microsoft.Extensions.DependencyInjection;

namespace VoltrisOptimizer.UI.Views
{
    public partial class PersonalizeView : UserControl
    {
        public PersonalizeView()
        {
            InitializeComponent();

            var vm = App.Services?.GetService<PersonalizeViewModel>();
            if (vm != null)
            {
                DataContext = vm;
                Loaded += async (_, _) => 
                {
                    App.LoggingService?.LogTrace("[UI] PersonalizeView carregado. Iniciando sincronização de estado...");
                    await vm.LoadAsync();
                    App.LoggingService?.LogTrace("[UI] Sincronização de PersonalizeView concluída.");
                };
            }
        }
    }
}
