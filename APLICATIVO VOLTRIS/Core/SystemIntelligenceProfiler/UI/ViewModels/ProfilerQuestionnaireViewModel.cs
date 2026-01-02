using System;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace VoltrisOptimizer.Core.SystemIntelligenceProfiler.UI.ViewModels
{
    public class ProfilerQuestionnaireViewModel : INotifyPropertyChanged
    {
        private string _useCase = string.Empty;
        private string _priority = string.Empty;
        private bool _isLaptop;
        private bool _autoRestartServices;
        private bool _allowRegistryChanges;
        private string[] _problems = Array.Empty<string>();
        private string _applyMode = "Manual";
        private readonly RelayCommand _confirmCommand;
        public event EventHandler? Completed;

        public string UseCase { get => _useCase; set { _useCase = value; OnPropertyChanged(); _confirmCommand.RaiseCanExecuteChanged(); } }
        public string Priority { get => _priority; set { _priority = value; OnPropertyChanged(); _confirmCommand.RaiseCanExecuteChanged(); } }
        public bool IsLaptop { get => _isLaptop; set { _isLaptop = value; OnPropertyChanged(); } }
        public bool AutoRestartServices { get => _autoRestartServices; set { _autoRestartServices = value; OnPropertyChanged(); } }
        public bool AllowRegistryChanges { get => _allowRegistryChanges; set { _allowRegistryChanges = value; OnPropertyChanged(); } }
        public string[] Problems { get => _problems; set { _problems = value; OnPropertyChanged(); } }
        public string ApplyMode { get => _applyMode; set { _applyMode = value; OnPropertyChanged(); } }

        public ProfilerQuestionnaireViewModel()
        {
            _confirmCommand = new RelayCommand(async _ => await SubmitAsync(), _ => CanConfirm());
            try { App.LoggingService?.LogInfo("[QUESTIONARIO] ViewModel inicializado"); } catch { }
        }

        public System.Windows.Input.ICommand ConfirmCommand => _confirmCommand;

        public async Task SubmitAsync()
        {
            try { App.LoggingService?.LogInfo($"[QUESTIONARIO] Submit iniciado | UseCase='{UseCase}' Priority='{Priority}' Laptop={IsLaptop} AutoRestart={AutoRestartServices} RegistryBackup={AllowRegistryChanges}"); } catch { }
            if (!CanConfirm())
            {
                try
                {
                    System.Windows.MessageBox.Show("Selecione o Uso do PC e a Prioridade para continuar.", "Questionário", System.Windows.MessageBoxButton.OK, System.Windows.MessageBoxImage.Warning);
                    App.LoggingService?.LogWarning("[QUESTIONARIO] Validação falhou: campos obrigatórios não selecionados");
                }
                catch { }
                return;
            }
            var answers = new Core.SystemIntelligenceProfiler.UserAnswers
            {
                UseCase = UseCase,
                Priority = Priority,
                IsLaptop = IsLaptop,
                AutoRestartServices = AutoRestartServices,
                AllowRegistryChanges = AllowRegistryChanges,
                Problems = Problems,
                ApplyMode = ApplyMode
            };
            var store = new Core.SystemIntelligenceProfiler.ProfileStore();
            var s = store.Load();
            s.Answers = answers;
            s.QuestionnaireCompleted = true;
            store.Save(s);
            try { App.LoggingService?.LogSuccess("[QUESTIONARIO] Respostas salvas e questionário marcado como concluído"); } catch { }
            Completed?.Invoke(this, EventArgs.Empty);
            await Task.CompletedTask;
        }

        private bool CanConfirm()
        {
            var u = (UseCase ?? string.Empty).Trim();
            var p = (Priority ?? string.Empty).Trim();
            var ok = u.Length > 0 && p.Length > 0;
            try { App.LoggingService?.LogInfo($"[QUESTIONARIO] CanConfirm={ok}"); } catch { }
            return ok;
        }

        public event PropertyChangedEventHandler? PropertyChanged;
        private void OnPropertyChanged([CallerMemberName] string? name = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
            try { App.LoggingService?.LogInfo($"[QUESTIONARIO] PropertyChanged: {name}"); } catch { }
        }
    }
}
