using System;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using System.Windows;

namespace VoltrisOptimizer.Core.SystemIntelligenceProfiler.UI.ViewModels
{
    public class ProfilerQuestionnaireViewModel : INotifyPropertyChanged
    {
        private string _useCase = string.Empty;
        private string _strategy = string.Empty;
        private bool _isLaptop;
        private bool _optimizeGPU = true;
        private bool _resetNetwork;
        private bool _optimizeDisk = true;
        private bool _cleanSystem = true;
        private bool _autoRestartServices;
        private bool _allowRegistryChanges;
        private string[] _problems = Array.Empty<string>();
        private string _applyMode = "Manual";
        private readonly RelayCommand _confirmCommand;
        public event EventHandler? Completed;

        public string UseCase 
        { 
            get => _useCase; 
            set 
            { 
                if (_useCase != value)
                {
                    _useCase = value; 
                    OnPropertyChanged();
                    _confirmCommand.RaiseCanExecuteChanged();
                    try { App.LoggingService?.LogInfo($"[QUESTIONARIO] UseCase alterado para: '{value}'"); } catch { }
                }
            } 
        }
        
        public string Strategy 
        { 
            get => _strategy; 
            set 
            { 
                if (_strategy != value)
                {
                    _strategy = value; 
                    OnPropertyChanged();
                    _confirmCommand.RaiseCanExecuteChanged();
                    try { App.LoggingService?.LogInfo($"[QUESTIONARIO] Strategy alterado para: '{value}'"); } catch { }
                }
            } 
        }
        
        public bool IsLaptop { get => _isLaptop; set { _isLaptop = value; OnPropertyChanged(); } }
        public bool OptimizeGPU { get => _optimizeGPU; set { _optimizeGPU = value; OnPropertyChanged(); } }
        public bool ResetNetwork { get => _resetNetwork; set { _resetNetwork = value; OnPropertyChanged(); } }
        public bool OptimizeDisk { get => _optimizeDisk; set { _optimizeDisk = value; OnPropertyChanged(); } }
        public bool CleanSystem { get => _cleanSystem; set { _cleanSystem = value; OnPropertyChanged(); } }
        public bool AutoRestartServices { get => _autoRestartServices; set { _autoRestartServices = value; OnPropertyChanged(); } }
        public bool AllowRegistryChanges { get => _allowRegistryChanges; set { _allowRegistryChanges = value; OnPropertyChanged(); } }
        public string[] Problems { get => _problems; set { _problems = value; OnPropertyChanged(); } }
        public string ApplyMode { get => _applyMode; set { _applyMode = value; OnPropertyChanged(); } }

        public ProfilerQuestionnaireViewModel()
        {
            // SIMPLIFICADO: Usar Action direta sem async
            _confirmCommand = new RelayCommand(_ => ExecuteConfirm(), _ => CanConfirm());
            try { App.LoggingService?.LogInfo("[QUESTIONARIO] ViewModel inicializado"); } catch { }
        }

        public System.Windows.Input.ICommand ConfirmCommand => _confirmCommand;

        private async void ExecuteConfirm()
        {
            try
            {
                App.LoggingService?.LogInfo($"[QUESTIONARIO] Iniciando CONFIRM... (UseCase={UseCase}, Strategy={Strategy})");
                
                await SubmitAsync();
                
                App.LoggingService?.LogSuccess("[QUESTIONARIO] CONFIRM executado com sucesso.");
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[QUESTIONARIO] Erro fatal ao processar confirmação: {ex.Message}", ex);
            }
        }

        public async Task SubmitAsync()
        {
            // Se campos não foram selecionados, usar padrão "Uso Geral" + "Equilibrado"
            if (string.IsNullOrWhiteSpace(UseCase))
                UseCase = "Uso Familiar Casual";
            if (string.IsNullOrWhiteSpace(Strategy))
                Strategy = "Equilibrado";

            var answers = new Core.SystemIntelligenceProfiler.UserAnswers
            {
                UseCase = UseCase,
                Priority = Strategy,
                IsLaptop = IsLaptop,
                OptimizeGPU = OptimizeGPU,
                ResetNetwork = ResetNetwork,
                OptimizeDisk = OptimizeDisk,
                CleanSystem = CleanSystem,
                AutoRestartServices = AutoRestartServices,
                AllowRegistryChanges = AllowRegistryChanges,
                Problems = Problems,
                ApplyMode = ApplyMode
            };

            // Mapeamento Inteligente de Perfil
            var u = (UseCase ?? "").ToLowerInvariant();
            if (u.Contains("gamer") || u.Contains("jogos")) 
                answers.Profile = u.Contains("single") || u.Contains("story") || u.Contains("casual") ? Core.SystemIntelligenceProfiler.UserProfile.GamerSinglePlayer : Core.SystemIntelligenceProfiler.UserProfile.GamerCompetitive;
            else if (u.Contains("office") || u.Contains("trabalho")) answers.Profile = Core.SystemIntelligenceProfiler.UserProfile.WorkOffice;
            else if (u.Contains("vídeo") || u.Contains("design") || u.Contains("criativo") || u.Contains("criador") || u.Contains("conteúdo")) answers.Profile = Core.SystemIntelligenceProfiler.UserProfile.CreativeVideoEditing;
            else if (u.Contains("programação") || u.Contains("dev") || u.Contains("desenvolvimento") || u.Contains("code")) answers.Profile = Core.SystemIntelligenceProfiler.UserProfile.DeveloperProgramming;
            else if (u.Contains("enterprise") || u.Contains("seguro") || u.Contains("corporativo") || u.Contains("segurança")) answers.Profile = Core.SystemIntelligenceProfiler.UserProfile.EnterpriseSecure;
            else if (u.Contains("familiar") || u.Contains("casual")) answers.Profile = Core.SystemIntelligenceProfiler.UserProfile.GeneralBalanced;
            else answers.Profile = Core.SystemIntelligenceProfiler.UserProfile.GeneralBalanced;

            try { App.LoggingService?.LogInfo($"[QUESTIONARIO] Perfil detectado: {answers.Profile} (input='{UseCase}')"); } catch { }

            // Salvar no ProfileStore
            var store = new Core.SystemIntelligenceProfiler.ProfileStore();
            var s = store.Load();
            s.Answers = answers;
            s.QuestionnaireCompleted = true;
            store.Save(s);
            try { App.LoggingService?.LogSuccess("[QUESTIONARIO] Respostas salvas e questionário marcado como concluído"); } catch { }
            
            // SINCRONIZAR COM SETTINGS: Mapear UserProfile para IntelligentProfileType
            try
            {
                var settingsProfile = answers.Profile switch
                {
                    Core.SystemIntelligenceProfiler.UserProfile.GamerCompetitive => VoltrisOptimizer.Services.IntelligentProfileType.GamerCompetitive,
                    Core.SystemIntelligenceProfiler.UserProfile.GamerSinglePlayer => VoltrisOptimizer.Services.IntelligentProfileType.GamerSinglePlayer,
                    Core.SystemIntelligenceProfiler.UserProfile.WorkOffice => VoltrisOptimizer.Services.IntelligentProfileType.WorkOffice,
                    Core.SystemIntelligenceProfiler.UserProfile.CreativeVideoEditing => VoltrisOptimizer.Services.IntelligentProfileType.CreativeVideoEditing,
                    Core.SystemIntelligenceProfiler.UserProfile.DeveloperProgramming => VoltrisOptimizer.Services.IntelligentProfileType.DeveloperProgramming,
                    Core.SystemIntelligenceProfiler.UserProfile.EnterpriseSecure => VoltrisOptimizer.Services.IntelligentProfileType.EnterpriseSecure,
                    _ => VoltrisOptimizer.Services.IntelligentProfileType.GeneralBalanced
                };
                
                VoltrisOptimizer.Services.SettingsService.Instance.Settings.IntelligentProfile = settingsProfile;
                VoltrisOptimizer.Services.SettingsService.Instance.SaveSettings();
                VoltrisOptimizer.Services.SettingsService.Instance.NotifyProfileChanged(settingsProfile);
                
                App.LoggingService?.LogSuccess($"[QUESTIONARIO] Perfil sincronizado com Settings: {settingsProfile}");
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[QUESTIONARIO] Erro ao sincronizar perfil com Settings: {ex.Message}");
            }
            
            try { App.LoggingService?.LogInfo("[QUESTIONARIO] Disparando evento Completed..."); } catch { }
            Completed?.Invoke(this, EventArgs.Empty);
            try { App.LoggingService?.LogSuccess($"[QUESTIONARIO] Evento Completed disparado! Listeners: {Completed?.GetInvocationList().Length ?? 0}"); } catch { }
            
            await Task.CompletedTask;
        }

        private bool CanConfirm()
        {
            var u = (UseCase ?? string.Empty).Trim();
            var s = (Strategy ?? string.Empty).Trim();
            var ok = u.Length > 0 && s.Length > 0;
            
            if (!ok)
            {
                // Log discreto para não poluir, mas útil para debug
                // App.LoggingService?.LogInfo($"[QUESTIONARIO] CanConfirm=false: UseCase='{u}', Strategy='{s}'");
            }
            
            return ok;
        }

        public event PropertyChangedEventHandler? PropertyChanged;
        private void OnPropertyChanged([CallerMemberName] string? name = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        }
    }

    public class StringToBoolConverter : System.Windows.Data.IValueConverter
    {
        public object Convert(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
        {
            if (value == null || parameter == null) return false;
            return value.ToString() == parameter.ToString();
        }

        public object ConvertBack(object value, Type targetType, object parameter, System.Globalization.CultureInfo culture)
        {
            if (value != null && (bool)value) return parameter.ToString() ?? string.Empty;
            return System.Windows.Data.Binding.DoNothing;
        }
    }
}
