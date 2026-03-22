using System;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using VoltrisOptimizer.Core.PreparePc.Interfaces;
using VoltrisOptimizer.Core.PreparePc.UI.Views;
using VoltrisOptimizer.Services;
using System.IO;
using System.Text.Json;

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
            _logger.LogInfo("[PreparePcFlow] Iniciando fluxo pós-otimizações do Profiler (Skipping Success View)");
            
            // CORREÇÃO CRÍTICA: NÃO iniciar automaticamente - deixar o usuário decidir
            // O PreparePcIntroView tem recursos faltando que causam erro
            // O usuário deve clicar em um botão "Continuar" no ProfilerSummaryView
            
            _logger.LogInfo("[PreparePcFlow] Fluxo automático DESABILITADO - aguardando ação do usuário");
            
            // _ = ShowPreparePcIntroAsync(); // COMENTADO - não iniciar automaticamente
        }
        
        /// <summary>
        /// Inicia o fluxo manualmente (pulando a tela de sucesso do profiler)
        /// </summary>
        public void StartManually()
        {
            _logger.LogInfo("[PreparePcFlow] Iniciando fluxo manualmente");
            _ = ShowPreparePcIntroAsync();
        }
        
        /// <summary>
        /// Mostra a tela de introdução do Prepare PC
        /// </summary>
        private async Task ShowPreparePcIntroAsync()
        {
            try
            {
                _logger.LogInfo("[PreparePcFlow] Mostrando Intro do Prepare PC");
                
                // Simular um pequeno delay para transição suave se necessário ou carregar dados
                await Task.Delay(100);
                
                // Tenta criar a view no thread da UI (embora já devêssemos estar nele)
                PreparePcIntroView? introView = null;
                
                Application.Current.Dispatcher.Invoke(() => 
                {
                    introView = new PreparePcIntroView();
                });
                
                if (introView == null) throw new Exception("Falha ao criar PreparePcIntroView (null)");
                
                introView.OnStartRequested += (s, e) =>
                {
                    _logger.LogInfo("[PreparePcFlow] Usuário iniciou Prepare PC da Intro");
                    _ = ShowPreparePcConfirmationAsync();
                };
                
                introView.OnSkip += (s, e) =>
                {
                    _logger.LogInfo("[PreparePcFlow] Usuário pulou da Intro");
                    CompleteFlow();
                };
                
                introView.OnSchedule += (s, e) =>
                {
                    _logger.LogInfo("[PreparePcFlow] Prepare PC agendado da Intro");
                    CompleteFlow();
                };
                
                _contentHost.Content = introView;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[PreparePcFlow] ERRO CRÍTICO ao mostrar Intro: {ex.Message}", ex);
                MessageBox.Show($"Erro ao carregar a interface de preparação: {ex.Message}\n\nO sistema continuará para o Dashboard.", 
                    "Erro de Interface", MessageBoxButton.OK, MessageBoxImage.Error);
                CompleteFlow();
            }
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
            _logger.LogInfo("[PreparePcFlow] Iniciando execução do Prepare PC em background");
            
            // Redirecionar para o Dashboard imediatamente
            CompleteFlow();
            
            // CORREÇÃO: Não iniciar progresso aqui - o PreparePcManager já faz isso
            // Services.GlobalProgressService.Instance.StartOperation("Otimizando seu PC");
            
            // Executar em background
            Task.Run(async () =>
            {
                try
                {
                    var manager = new PreparePcManager(_logger);
                    
                    var progress = new Progress<PreparePcProgress>(p =>
                    {
                        // O PreparePcManager já atualiza o GlobalProgressService
                        // Não precisamos fazer nada aqui para evitar duplicação
                    });
                    
                    var result = await manager.ExecuteAsync(options, progress);
                    
                    // O PreparePcManager já completa a operação
                    // Não precisamos fazer nada aqui
                    
                    // Mostrar modal de reiniciar se necessário
                    if (result.RequiresReboot)
                    {
                        System.Windows.Application.Current.Dispatcher.Invoke(() =>
                        {
                            var modal = new VoltrisOptimizer.UI.Windows.RestartConfirmationModal
                            {
                                Owner = System.Windows.Application.Current.MainWindow
                            };
                            modal.ShowDialog();
                        });
                    }
                    
                    _logger.LogInfo($"[PreparePcFlow] Prepare PC concluído: Success={result.Success}");
                }
                catch (Exception ex)
                {
                    _logger.LogError("[PreparePcFlow] Erro durante execução do Prepare PC", ex);
                    // Garantir que o progresso seja limpo em caso de erro
                    Services.GlobalProgressService.Instance.CompleteOperation("Erro durante otimização");
                }
            });
            
            // Não bloquear a UI - usuário pode continuar navegando
            _logger.LogInfo("[PreparePcFlow] Otimização iniciada em background, usuário pode continuar navegando");
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
            try
            {
                var path = GetScheduleFilePath();
                if (!File.Exists(path))
                    return false;
                
                var json = File.ReadAllText(path);
                var schedule = JsonSerializer.Deserialize<ScheduleData>(json);
                
                if (schedule == null)
                    return false;
                
                // Se for próxima inicialização, sempre retorna true
                if (schedule.IsNextStartup)
                    return true;
                
                // Se for agendamento por tempo, verificar se já passou
                if (schedule.ScheduledTime > DateTime.Now)
                    return false; // Ainda não é hora
                
                return true;
            }
            catch
            {
                return false;
            }
        }
        
        /// <summary>
        /// Limpa o flag de Prepare PC agendado
        /// </summary>
        public static void ClearScheduledPreparePc()
        {
            try
            {
                var path = GetScheduleFilePath();
                if (File.Exists(path))
                    File.Delete(path);
                
                // Remover tarefa agendada do Windows
                var psi = new System.Diagnostics.ProcessStartInfo
                {
                    FileName = "schtasks",
                    Arguments = "/delete /tn \"VoltrisPreparePc\" /f",
                    UseShellExecute = false,
                    CreateNoWindow = true
                };
                
                using var proc = System.Diagnostics.Process.Start(psi);
                proc?.WaitForExit(3000);
            }
            catch
            {
                // Ignorar erros
            }
        }
        
        /// <summary>
        /// Executa Prepare PC agendado se houver
        /// </summary>
        public void ExecuteScheduledPreparePcIfPending()
        {
            var schedule = GetPendingSchedule();
            
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
            var schedule = GetPendingSchedule();
            if (schedule == null)
                return (false, null, false);
            
            return (true, schedule.ScheduledTime, schedule.IsNextStartup);
        }

        public static ScheduleData? GetPendingSchedule()
        {
            try
            {
                var path = GetScheduleFilePath();
                if (!File.Exists(path))
                    return null;
                
                var json = File.ReadAllText(path);
                return JsonSerializer.Deserialize<ScheduleData>(json);
            }
            catch
            {
                return null;
            }
        }

        private static string GetScheduleFilePath()
        {
            return Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                "Voltris", "preparepc_schedule.json");
        }
    }

    /// <summary>
    /// Dados do agendamento
    /// </summary>
    public class ScheduleData
    {
        public DateTime ScheduledTime { get; set; }
        public int ScheduleType { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsNextStartup { get; set; }
    }
}

