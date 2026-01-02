using System;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using VoltrisOptimizer.Core.PreparePc.Interfaces;
using VoltrisOptimizer.Core.PreparePc.UI.Views;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.Core.PreparePc
{
    /// <summary>
    /// Controlador de fluxo para integração do Prepare PC com o SystemIntelligenceProfiler
    /// 
    /// Fluxo:
    /// 1. Usuário completa o Profiler
    /// 2. Usuário clica em "Aplicar Todas (Safe)"
    /// 3. Ações são aplicadas
    /// 4. Mostra tela de sucesso (ProfilerSuccessView)
    /// 5. Oferece Prepare PC
    /// 6. Se aceitar: mostra confirmação -> executa -> mostra resultado
    /// 7. Redireciona para Dashboard
    /// </summary>
    public class PreparePcFlowController
    {
        private readonly ILoggingService _logger;
        private readonly ContentControl _contentHost;
        private readonly Action? _onComplete;
        
        /// <summary>
        /// Evento disparado quando o fluxo é completado
        /// </summary>
        public event EventHandler? FlowCompleted;
        
        public PreparePcFlowController(ContentControl contentHost, ILoggingService? logger = null, Action? onComplete = null)
        {
            _contentHost = contentHost ?? throw new ArgumentNullException(nameof(contentHost));
            _logger = logger ?? App.LoggingService!;
            _onComplete = onComplete;
        }
        
        /// <summary>
        /// Inicia o fluxo após as otimizações do Profiler serem aplicadas
        /// </summary>
        /// <param name="appliedOptimizations">Lista de otimizações que foram aplicadas</param>
        public void StartAfterProfilerOptimizations(string[] appliedOptimizations)
        {
            _logger.LogInfo("[PreparePcFlow] Iniciando fluxo pós-otimizações do Profiler");
            
            // Mostrar tela de sucesso
            var successView = new ProfilerSuccessView();
            successView.SetAppliedOptimizations(appliedOptimizations);
            
            successView.OnPreparePcRequested += (s, e) =>
            {
                _logger.LogInfo("[PreparePcFlow] Usuário solicitou Prepare PC");
                _ = ShowPreparePcConfirmationAsync();
            };
            
            successView.OnSkipToDashboard += (s, e) =>
            {
                _logger.LogInfo("[PreparePcFlow] Usuário pulou para Dashboard");
                CompleteFlow();
            };
            
            successView.OnScheduleRequested += (s, e) =>
            {
                _logger.LogInfo("[PreparePcFlow] Prepare PC agendado");
                CompleteFlow();
            };
            
            _contentHost.Content = successView;
        }
        
        /// <summary>
        /// Mostra a tela de confirmação do Prepare PC
        /// </summary>
        private async Task ShowPreparePcConfirmationAsync()
        {
            _logger.LogInfo("[PreparePcFlow] Mostrando confirmação do Prepare PC");
            
            // Executar pré-checks
            var manager = new PreparePcManager(_logger);
            var preCheckResult = await manager.RunPreChecksAsync();
            
            var confirmationView = new PreparePcConfirmationView(preCheckResult);
            
            confirmationView.OnProceed += (s, options) =>
            {
                _logger.LogInfo($"[PreparePcFlow] Usuário escolheu modo: {options.Mode}");
                StartPreparePcExecution(options);
            };
            
            confirmationView.OnSkip += (s, e) =>
            {
                _logger.LogInfo("[PreparePcFlow] Usuário pulou Prepare PC");
                CompleteFlow();
            };
            
            confirmationView.OnSchedule += (s, e) =>
            {
                _logger.LogInfo("[PreparePcFlow] Prepare PC agendado pelo modal");
                CompleteFlow();
            };
            
            _contentHost.Content = confirmationView;
        }
        
        /// <summary>
        /// Inicia a execução do Prepare PC
        /// </summary>
        private void StartPreparePcExecution(PreparePcOptions options)
        {
            _logger.LogInfo("[PreparePcFlow] Iniciando execução do Prepare PC");
            
            var progressView = new PreparePcProgressView(options);
            
            progressView.OnCompleted += (s, result) =>
            {
                _logger.LogInfo($"[PreparePcFlow] Prepare PC concluído: Success={result.Success}");
            };
            
            progressView.OnContinue += (s, e) =>
            {
                _logger.LogInfo("[PreparePcFlow] Usuário continuou após Prepare PC");
                CompleteFlow();
            };
            
            progressView.OnCancelled += (s, e) =>
            {
                _logger.LogInfo("[PreparePcFlow] Prepare PC cancelado pelo usuário");
                // Não completar automaticamente, deixar usuário decidir
            };
            
            _contentHost.Content = progressView;
        }
        
        /// <summary>
        /// Completa o fluxo e redireciona para o Dashboard
        /// </summary>
        private void CompleteFlow()
        {
            _logger.LogInfo("[PreparePcFlow] Fluxo completado, redirecionando para Dashboard");
            
            // Marcar como primeira execução completada
            MarkFirstRunComplete();
            
            // Invocar callback de conclusão
            _onComplete?.Invoke();
            FlowCompleted?.Invoke(this, EventArgs.Empty);
        }
        
        /// <summary>
        /// Marca que a primeira execução foi completada
        /// </summary>
        private void MarkFirstRunComplete()
        {
            try
            {
                var flagPath = System.IO.Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                    "Voltris", "first_run_complete.flag");
                System.IO.Directory.CreateDirectory(System.IO.Path.GetDirectoryName(flagPath)!);
                System.IO.File.WriteAllText(flagPath, DateTime.Now.ToString("o"));
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[PreparePcFlow] Erro ao marcar primeira execução: {ex.Message}");
            }
        }
        
        /// <summary>
        /// Verifica se há Prepare PC agendado pendente
        /// </summary>
        public static bool HasPendingScheduledPreparePc()
        {
            return UI.Views.ProfilerSuccessView.HasPendingSchedule();
        }
        
        /// <summary>
        /// Limpa o flag de Prepare PC agendado
        /// </summary>
        public static void ClearScheduledPreparePc()
        {
            UI.Views.ProfilerSuccessView.ClearSchedule();
        }
        
        /// <summary>
        /// Executa Prepare PC agendado se houver
        /// </summary>
        public void ExecuteScheduledPreparePcIfPending()
        {
            var schedule = UI.Views.ProfilerSuccessView.GetPendingSchedule();
            
            if (schedule != null)
            {
                // Verificar se é hora de executar
                bool shouldExecute = false;
                
                if (schedule.IsNextStartup)
                {
                    // Próxima inicialização - sempre executa
                    shouldExecute = true;
                }
                else if (schedule.ScheduledTime <= DateTime.Now)
                {
                    // Agendamento por tempo que já passou
                    shouldExecute = true;
                }
                
                if (shouldExecute)
                {
                    _logger.LogInfo("[PreparePcFlow] Executando Prepare PC agendado");
                    ClearScheduledPreparePc();
                    _ = ShowPreparePcConfirmationAsync();
                }
            }
        }
        
        /// <summary>
        /// Obtém informações do agendamento atual
        /// </summary>
        public static (bool HasSchedule, DateTime? ScheduledTime, bool IsNextStartup) GetScheduleInfo()
        {
            var schedule = UI.Views.ProfilerSuccessView.GetPendingSchedule();
            if (schedule == null)
                return (false, null, false);
            
            return (true, schedule.ScheduledTime, schedule.IsNextStartup);
        }
    }
}

