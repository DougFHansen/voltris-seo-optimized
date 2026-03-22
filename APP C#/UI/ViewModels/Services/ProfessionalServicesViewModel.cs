using System;
using System.Collections.ObjectModel;
using System.Diagnostics;
using System.Windows.Input;
using VoltrisOptimizer.Services; 

namespace VoltrisOptimizer.UI.ViewModels
{
    public class ProfessionalServiceItem
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string IconKey { get; set; }
        public string Message { get; set; }
        public string ButtonText { get; set; } = "Falar com Especialista";
    }

    public class ProfessionalServicesViewModel : ViewModelBase
    {
        private readonly ILoggingService _logger;

        private ObservableCollection<ProfessionalServiceItem> _services;
        public ObservableCollection<ProfessionalServiceItem> Services 
        { 
            get => _services;
            private set => SetProperty(ref _services, value);
        }

        public ICommand OpenWhatsAppCommand { get; private set; }

        public ProfessionalServicesViewModel(ILoggingService logger)
        {
            _logger = logger;
            // Using local implementation for generic support
            OpenWhatsAppCommand = new ServicesRelayCommand<string>(OpenWhatsApp);
            InitializeServices();
        }

        private void InitializeServices()
        {
            Services = new ObservableCollection<ProfessionalServiceItem>
            {
                new ProfessionalServiceItem
                {
                    Title = "Reinstalação Segura do Windows",
                    Description = "Reinstalação limpa de sistema operacional, com hardening de segurança, drivers certificados enterprise e otimização pós-deployment.",
                    IconKey = "SettingsIcon",
                    Message = "Olá, quero contratar o serviço de Reinstalação Segura do Windows pelo Voltris."
                },
                new ProfessionalServiceItem
                {
                    Title = "Otimização Profunda de Desempenho",
                    Description = "Análise manual técnica e ajustes avançados de kernel personalizados para o seu hardware específico e uso real.",
                    IconKey = "PerformanceIcon",
                    Message = "Olá, gostaria de uma Otimização Profunda de Desempenho com a equipe Voltris."
                },
                new ProfessionalServiceItem
                {
                    Title = "Instalação e Provisionamento",
                    Description = "Setup completo de ambiente de trabalho, gamer ou corporativo sob demanda, com licenciamento e configuração.",
                    IconKey = "BoltIcon",
                    Message = "Olá, preciso do serviço de Instalação e Provisionamento de Softwares."
                },
                new ProfessionalServiceItem
                {
                    Title = "Remoção Avançada de Malware",
                    Description = "Diagnóstico profundo e higienização completa de sistema com preservação de dados críticos e análise de segurança.",
                    IconKey = "DiagnosticsIcon",
                    Message = "Olá, preciso de ajuda com Remoção Avançada de Malware."
                },
                new ProfessionalServiceItem
                {
                    Title = "Setup Gamer / Workstation",
                    Description = "Configuração especializada de BIOS, overclocking seguro e redução de latência para máximo desempenho e estabilidade.",
                    IconKey = "GamerIcon",
                    Message = "Olá, quero contratar o Setup Gamer / Workstation especializado."
                },
                new ProfessionalServiceItem
                {
                    Title = "Diagnóstico Técnico Especializado",
                    Description = "Investigação detalhada de problemas complexos, BSODs intermitentes e instabilidade de sistema via análise de logs.",
                    IconKey = "LogsIcon",
                    Message = "Olá, preciso de um Diagnóstico Técnico Especializado."
                }
            };
        }

        private void OpenWhatsApp(string message)
        {
            try
            {
                if (string.IsNullOrEmpty(message)) return;

                var phoneNumber = "5511996716235";
                var encodedMessage = Uri.EscapeDataString(message);
                var url = $"https://wa.me/{phoneNumber}?text={encodedMessage}";

                Process.Start(new ProcessStartInfo
                {
                    FileName = url,
                    UseShellExecute = true
                });
                
                _logger.LogInfo($"[ProfessionalServices] User opened WhatsApp for: {message.Substring(0, Math.Min(20, message.Length))}...");
            }
            catch (Exception ex)
            {
                _logger.LogError("[ProfessionalServices] Failed to open WhatsApp link.", ex);
            }
        }
    }

    /// <summary>
    /// Local implementation of a generic RelayCommand to support command parameters
    /// without external dependencies that might cause namespace collisions.
    /// </summary>
    public class ServicesRelayCommand<T> : ICommand
    {
        private readonly Action<T> _execute;
        private readonly Predicate<T> _canExecute;

        public ServicesRelayCommand(Action<T> execute, Predicate<T> canExecute = null)
        {
            _execute = execute ?? throw new ArgumentNullException(nameof(execute));
            _canExecute = canExecute;
        }

        public bool CanExecute(object parameter) => _canExecute == null || (parameter is T t && _canExecute(t));

        public void Execute(object parameter) => _execute((T)parameter);

        public event EventHandler CanExecuteChanged
        {
            add { CommandManager.RequerySuggested += value; }
            remove { CommandManager.RequerySuggested -= value; }
        }
    }
}
