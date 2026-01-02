using System.Windows;
using System.Windows.Controls;
using VoltrisOptimizer.Core.SystemIntelligenceProfiler.UI.ViewModels;

namespace VoltrisOptimizer.Core.SystemIntelligenceProfiler.UI.Views
{
    public partial class ProfilerQuestionnaireView : UserControl
    {
        public ProfilerQuestionnaireView()
        {
            InitializeComponent();
            if (DataContext is ProfilerQuestionnaireViewModel vm)
            {
                vm.Completed += Vm_Completed;
                try { App.LoggingService?.LogInfo("[QUESTIONARIO] View carregada"); } catch { }
            }
        }

        private void UseCaseContainer_MouseLeftButtonDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            try
            {
                UseCaseCombo.IsDropDownOpen = true;
                UseCaseCombo.Focus();
                App.LoggingService?.LogInfo("[QUESTIONARIO] Abrindo dropdown: Uso do PC");
            }
            catch { }
        }

        private void PriorityContainer_MouseLeftButtonDown(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            try
            {
                PriorityCombo.IsDropDownOpen = true;
                PriorityCombo.Focus();
                App.LoggingService?.LogInfo("[QUESTIONARIO] Abrindo dropdown: Prioridade");
            }
            catch { }
        }

        private async void Confirm_Click(object sender, RoutedEventArgs e)
        {
            if (DataContext is ProfilerQuestionnaireViewModel vm)
            {
                try { App.LoggingService?.LogInfo("[QUESTIONARIO] Confirmar clicado"); } catch { }
                await vm.SubmitAsync();
            }
        }

        private void Vm_Completed(object? sender, System.EventArgs e)
        {
            try
            {
                var mainWindow = Application.Current.MainWindow as VoltrisOptimizer.UI.MainWindow;
                if (mainWindow != null)
                {
                    // Após concluir o questionário, NÃO desbloquear ainda - ir para o Resumo Inteligente
                    // O sidebar só será desbloqueado após o usuário aplicar as otimizações no Resumo Inteligente
                    var store = new Core.SystemIntelligenceProfiler.ProfileStore();
                    var st = store.Load();
                    st.TutorialCompleted = true;
                    store.Save(st);
                    
                    // NÃO chamar UnlockGate() aqui - será chamado no ProfilerSummaryView após Aplicar Todas
                    try { App.LoggingService?.LogSuccess("[QUESTIONARIO] Concluído. Navegando para Resumo Inteligente. Sidebar ainda bloqueado."); } catch { }
                    var summary = new VoltrisOptimizer.Core.SystemIntelligenceProfiler.UI.Views.ProfilerSummaryView();
                    var contentFrame = mainWindow.FindName("ContentFrame") as ContentControl;
                    if (contentFrame != null) contentFrame.Content = summary;
                }
            }
            catch { }
        }

    }
}
