using System;
using System.Collections.ObjectModel;
using System.Windows;
using System.Windows.Input;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace VoltrisOptimizer.UI.ViewModels
{
    public class ActivityHistoryViewModel : ViewModelBase
    {
        private readonly ILoggingService? _logger;
        private readonly INavigationService? _navigationService;
        
        private ObservableCollection<LogEvent> _allEvents = new();
        public ObservableCollection<LogEvent> AllEvents
        {
            get => _allEvents;
            set => SetProperty(ref _allEvents, value);
        }

        public ICommand GoBackCommand { get; }
        public ICommand ClearHistoryCommand { get; }

        public ActivityHistoryViewModel()
        {
            _logger = App.LoggingService;
            _navigationService = App.Services?.GetService<INavigationService>();

            GoBackCommand = new RelayCommand(() => _navigationService?.GoBack());
            ClearHistoryCommand = new RelayCommand(ClearHistory);

            if (_logger != null)
            {
                _logger.LogEntryAdded += OnLogEntryAdded;
            }

            // Simular alguns logs iniciais para preencher se estiver vazio ou carregar do arquivo
            LoadInitialLogs();
        }

        private void LoadInitialLogs()
        {
            try
            {
                if (_logger != null)
                {
                    var existingLogs = _logger.GetLogs();
                    if (existingLogs != null && existingLogs.Length > 0)
                    {
                        // OTIMIZAÇÃO: Carregar os últimos 500 logs para garantir histórico relevante
                        int start = Math.Max(0, existingLogs.Length - 500);
                        for (int i = start; i < existingLogs.Length; i++)
                        {
                            ParseAndAddLog(existingLogs[i]);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Debug.WriteLine($"Error loading initial logs: {ex.Message}");
            }

            if (AllEvents.Count == 0)
            {
                AddLogEvent(new LogEvent 
                { 
                    Message = "Monitoramento de atividades em tempo real ativo.", 
                    Timestamp = DateTime.Now.ToString("HH:mm:ss"), 
                    Type = "SISTEMA" 
                });
            }
        }

        private void OnLogEntryAdded(object? sender, string logLine)
        {
            // Garantir que a UI seja atualizada na thread principal
            Application.Current?.Dispatcher?.BeginInvoke(new Action(() => 
            {
                ParseAndAddLog(logLine);
            }));
        }

        private void ParseAndAddLog(string logLine)
        {
            if (string.IsNullOrWhiteSpace(logLine)) return;

            try 
            {
                // FILTRO DE ATIVIDADES: Ignorar ruído de fundo técnico ANTES do parse detalhado
                // Isso garante que logs no formato fallback também sejam filtrados
                string msgUpper = logLine.ToUpper();
                if (msgUpper.Contains("POLLING") || 
                    msgUpper.Contains("POLL") || 
                    msgUpper.Contains("TEMPERATURE") || 
                    msgUpper.Contains("TEMPERATURA") ||
                    msgUpper.Contains("HEARTBEAT") ||
                    msgUpper.Contains("HM POLLING") ||
                    msgUpper.Contains("TICKS") ||
                    msgUpper.Contains("DEBUG") ||
                    msgUpper.Contains("TRACE") ||
                    msgUpper.Contains("COMANDO") ||
                    msgUpper.Contains("PENDENTE") ||
                    msgUpper.Contains("HTTP") ||
                    msgUpper.Contains("STATUS") ||
                    msgUpper.Contains("OK") ||
                    msgUpper.Contains("PROCESSO") ||
                    msgUpper.Contains("DETECTADO") ||
                    msgUpper.Contains("PID:") ||
                    msgUpper.Contains("NOME:") ||
                    msgUpper.Contains("NORMALIZADO") ||
                    msgUpper.Contains("CONHOST") ||
                    msgUpper.Contains("MACHINE ID") ||
                    msgUpper.Contains("TIMESTAMP") ||
                    msgUpper.Contains("VERSION") ||
                    msgUpper.Contains("ENVIRONMENT") ||
                    msgUpper.Contains("ERROR 500") ||
                    msgUpper.Contains("SERVER ERROR") ||
                    msgUpper.Contains("INTERNAL") ||
                    msgUpper.Contains("ZOD") ||
                    msgUpper.Contains("UNDEFINED") ||
                    msgUpper.Contains("PROPERTY") ||
                    msgUpper.Contains("READING") ||
                    msgUpper.Contains("BATCH") ||
                    msgUpper.Contains("SUCCESSFULLY") ||
                    msgUpper.Contains("FLOW") ||
                    msgUpper.Contains("ISACTIVE") ||
                    msgUpper.Contains("MAINWINDOW") ||
                    msgUpper.Contains("APPLICATION") ||
                    msgUpper.Contains("CORE") ||
                    msgUpper.Contains("ÍCONE") ||
                    msgUpper.Contains("JANELA") ||
                    msgUpper.Contains("STARTUP") ||
                    msgUpper.Contains("LOCATION") ||
                    msgUpper.Contains("RESOLUÇÃO") ||
                    msgUpper == "}" || msgUpper == "{" ||
                    msgUpper.StartsWith("---"))
                {
                    return;
                }

                // Parse robusto: Busca o tempo e o nível
                var parts = logLine.Split(new[] { ']' }, StringSplitOptions.RemoveEmptyEntries);
                if (parts.Length >= 3)
                {
                    // Extrair Tempo
                    var timePart = parts[0].TrimStart('[');
                    var timeSplit = timePart.Split(' ');
                    var time = timeSplit.Length > 1 ? timeSplit[1] : timePart;
                    if (time.Contains('.')) time = time.Split('.')[0];

                    // Extrair Nível
                    var levelPart = parts[1].TrimStart(' ', '[').ToUpper();
                    
                    // Extrair Mensagem (Tudo após o último ']')
                    var msg = logLine.Substring(logLine.LastIndexOf(']') + 1).Trim();

                    // Identificar Tipo profissionalmente (Suporta PT e EN)
                    var type = "INFO";
                    if (levelPart.Contains("SUCESSO") || levelPart.Contains("SUCCESS")) type = "SUCESSO";
                    else if (levelPart.Contains("AVISO") || levelPart.Contains("WARNING")) type = "AVISO";
                    else if (levelPart.Contains("ERRO") || levelPart.Contains("ERROR") || levelPart.Contains("FALHA") || levelPart.Contains("CRITICAL")) type = "ERRO";
                    else if (levelPart.Contains("TRACE") || levelPart.Contains("DEBUG") || levelPart.Contains("SISTEMA")) type = "SISTEMA";

                    AddLogEvent(new LogEvent { Message = msg, Timestamp = time, Type = type });
                }
                else
                {
                    // Fallback para o parser antigo caso o formato mude drasticamente
                    var oldParts = logLine.Split(new[] { ' ' }, 4);
                    if (oldParts.Length >= 4)
                    {
                        var time = oldParts[1].TrimEnd(']');
                        if (time.Contains('.')) time = time.Split('.')[0];
                        var msg = oldParts[3];
                        AddLogEvent(new LogEvent { Message = msg, Timestamp = time, Type = "INFO" });
                    }
                }
            }
            catch { }
        }

        private void AddLogEvent(LogEvent evt)
        {
            // Adicionar ao topo (estilo Timeline)
            AllEvents.Insert(0, evt);
            
            // Limite de segurança para não sobrecarregar a memória
            if (AllEvents.Count > 500) AllEvents.RemoveAt(AllEvents.Count - 1);
        }

        private void ClearHistory()
        {
            AllEvents.Clear();
            AddLogEvent(new LogEvent { Message = "Histórico de atividades limpo pelo usuário", Timestamp = DateTime.Now.ToString("HH:mm:ss"), Type = "AVISO" });
        }

        protected override void OnDisposing()
        {
            if (_logger != null)
            {
                _logger.LogEntryAdded -= OnLogEntryAdded;
            }
            base.OnDisposing();
        }
    }
}
