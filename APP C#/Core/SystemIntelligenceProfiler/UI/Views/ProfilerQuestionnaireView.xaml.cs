using System;
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
            
            try { App.LoggingService?.LogInfo("[QUESTIONARIO] View inicializando..."); } catch { }
            
            // CORREÇÃO CRÍTICA: Usar Loaded event para garantir que tudo está pronto
            this.Loaded += OnLoaded;
            this.DataContextChanged += OnDataContextChanged;
        }
        
        // Handler de Click — executa diretamente sem depender de CanExecute
        private async void ConfirmButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                if (DataContext is ProfilerQuestionnaireViewModel vm)
                {
                    await vm.SubmitAsync();
                }
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[QUESTIONARIO] Erro no Click: {ex.Message}", ex);
            }
        }
        
        private void OnLoaded(object sender, RoutedEventArgs e)
        {
            try 
            { 
                App.LoggingService?.LogInfo("[QUESTIONARIO] View carregada, registrando evento..."); 
                
                if (DataContext is ProfilerQuestionnaireViewModel vm)
                {
                    vm.Completed += Vm_Completed;
                    App.LoggingService?.LogSuccess("[QUESTIONARIO] Evento Completed registrado com sucesso!");
                }
                else
                {
                    App.LoggingService?.LogError("[QUESTIONARIO] DataContext não é ProfilerQuestionnaireViewModel!");
                }
            } 
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[QUESTIONARIO] Erro ao registrar evento: {ex.Message}");
            }
        }
        
        private void OnDataContextChanged(object sender, DependencyPropertyChangedEventArgs e)
        {
            try
            {
                // Desregistrar evento antigo se existir
                if (e.OldValue is ProfilerQuestionnaireViewModel oldVm)
                {
                    oldVm.Completed -= Vm_Completed;
                    App.LoggingService?.LogInfo("[QUESTIONARIO] Evento antigo desregistrado");
                }
                
                // Registrar evento novo
                if (e.NewValue is ProfilerQuestionnaireViewModel newVm)
                {
                    newVm.Completed += Vm_Completed;
                    App.LoggingService?.LogSuccess("[QUESTIONARIO] Evento Completed registrado após DataContext mudar");
                }
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[QUESTIONARIO] Erro em OnDataContextChanged: {ex.Message}");
            }
        }

        private void Vm_Completed(object? sender, System.EventArgs e)
        {
            try
            {
                App.LoggingService?.LogInfo("[QUESTIONARIO] ========================================");
                App.LoggingService?.LogInfo("[QUESTIONARIO] Vm_Completed CHAMADO!");
                App.LoggingService?.LogInfo("[QUESTIONARIO] Navegando para ProfilerSummaryView...");
                
                // CORREÇÃO CRÍTICA: Executar na thread da UI
                Application.Current?.Dispatcher.Invoke(() =>
                {
                    try
                    {
                        var mainWindow = Application.Current.MainWindow as VoltrisOptimizer.UI.MainWindow;
                        if (mainWindow == null)
                        {
                            App.LoggingService?.LogError("[QUESTIONARIO] MainWindow é NULL!");
                            return;
                        }
                        
                        App.LoggingService?.LogInfo("[QUESTIONARIO] MainWindow encontrada");
                        
                        // Salvar progresso
                        var store = new Core.SystemIntelligenceProfiler.ProfileStore();
                        var st = store.Load();
                        st.TutorialCompleted = true;
                        store.Save(st);
                        App.LoggingService?.LogInfo("[QUESTIONARIO] Tutorial marcado como completo");
                        
                        // Criar e navegar para a página de resumo
                        var summary = new VoltrisOptimizer.Core.SystemIntelligenceProfiler.UI.Views.ProfilerSummaryView();
                        App.LoggingService?.LogInfo("[QUESTIONARIO] ProfilerSummaryView criada");
                        
                        var contentFrame = mainWindow.FindName("ContentFrame") as ContentControl;
                        if (contentFrame == null)
                        {
                            App.LoggingService?.LogError("[QUESTIONARIO] ContentFrame é NULL!");
                            return;
                        }
                        
                        App.LoggingService?.LogInfo("[QUESTIONARIO] ContentFrame encontrado, definindo conteúdo...");
                        contentFrame.Content = summary;
                        
                        App.LoggingService?.LogSuccess("[QUESTIONARIO] ✅ NAVEGAÇÃO CONCLUÍDA COM SUCESSO!");
                        App.LoggingService?.LogInfo("[QUESTIONARIO] ========================================");
                    }
                    catch (Exception ex)
                    {
                        App.LoggingService?.LogError($"[QUESTIONARIO] Erro ao navegar: {ex.Message}", ex);
                    }
                });
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[QUESTIONARIO] Erro em Vm_Completed: {ex.Message}", ex);
            }
        }

    }
}
