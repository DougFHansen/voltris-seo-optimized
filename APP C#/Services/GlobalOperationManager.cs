using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Gerenciador global de operações que utilizam a Global Progress Bar.
    /// Implementa máquina de estados e controle de concorrência para prevenir
    /// múltiplas operações simultâneas.
    /// 
    /// RESPONSABILIDADES:
    /// - Controlar estado global de operações
    /// - Impedir concorrência de operações
    /// - Gerenciar progresso e status
    /// - Notificar mudanças via INotifyPropertyChanged
    /// </summary>
    public class GlobalOperationManager : INotifyPropertyChanged
    {
        private static GlobalOperationManager? _instance;
        private static readonly object _lock = new object();

        public static GlobalOperationManager Instance
        {
            get
            {
                if (_instance == null)
                {
                    lock (_lock)
                    {
                        _instance ??= new GlobalOperationManager();
                    }
                }
                return _instance;
            }
        }

        private readonly ILoggingService? _logger;
        private readonly SemaphoreSlim _operationLock;
        private readonly Queue<QueuedOperation> _operationQueue;

        private GlobalOperationState _currentState;
        private string _currentOperationName;
        private double _globalProgress;
        private string _globalStatusMessage;
        private CancellationTokenSource? _currentCancellationTokenSource;
        private bool _isProcessingQueue;

        public event PropertyChangedEventHandler? PropertyChanged;

        private GlobalOperationManager()
        {
            _logger = App.LoggingService;
            _operationLock = new SemaphoreSlim(1, 1);
            _operationQueue = new Queue<QueuedOperation>();
            _currentState = GlobalOperationState.Idle;
            _currentOperationName = string.Empty;
            _globalProgress = 0;
            _globalStatusMessage = string.Empty;
            _isProcessingQueue = false;
        }

        #region Public Properties

        /// <summary>
        /// Estado atual da operação global
        /// </summary>
        public GlobalOperationState CurrentState
        {
            get => _currentState;
            private set
            {
                if (_currentState != value)
                {
                    _currentState = value;
                    OnPropertyChanged();
                    OnPropertyChanged(nameof(IsOperationRunning));
                }
            }
        }

        /// <summary>
        /// Indica se existe uma operação global em execução
        /// </summary>
        public bool IsOperationRunning => CurrentState != GlobalOperationState.Idle;

        /// <summary>
        /// Nome da operação atual
        /// </summary>
        public string CurrentOperationName
        {
            get => _currentOperationName;
            private set
            {
                if (_currentOperationName != value)
                {
                    _currentOperationName = value;
                    OnPropertyChanged();
                }
            }
        }

        /// <summary>
        /// Progresso global (0-100)
        /// </summary>
        public double GlobalProgress
        {
            get => _globalProgress;
            private set
            {
                if (Math.Abs(_globalProgress - value) > 0.01)
                {
                    _globalProgress = value;
                    OnPropertyChanged();
                }
            }
        }

        /// <summary>
        /// Mensagem de status atual
        /// </summary>
        public string GlobalStatusMessage
        {
            get => _globalStatusMessage;
            private set
            {
                if (_globalStatusMessage != value)
                {
                    _globalStatusMessage = value;
                    OnPropertyChanged();
                }
            }
        }

        #endregion

        #region Public Methods

        /// <summary>
        /// Adiciona uma operação à fila para execução automática após a operação atual
        /// </summary>
        public void EnqueueOperation(
            GlobalOperationState operationState,
            string operationName,
            Func<IProgress<OperationProgress>, CancellationToken, Task> operation)
        {
            var queuedOp = new QueuedOperation
            {
                State = operationState,
                Name = operationName,
                Operation = operation
            };

            _operationQueue.Enqueue(queuedOp);
            _logger?.LogInfo($"[GlobalOperation] Operação '{operationName}' adicionada à fila. Total na fila: {_operationQueue.Count}");
        }

        /// <summary>
        /// Obtém o número de operações na fila
        /// </summary>
        public int GetQueueCount() => _operationQueue.Count;

        /// <summary>
        /// Verifica se há operações na fila
        /// </summary>
        public bool HasQueuedOperations() => _operationQueue.Count > 0;

        /// <summary>
        /// Processa a próxima operação da fila (se houver)
        /// </summary>
        private async Task ProcessQueueAsync()
        {
            if (_isProcessingQueue || _operationQueue.Count == 0)
                return;

            _isProcessingQueue = true;

            try
            {
                while (_operationQueue.Count > 0)
                {
                    var queuedOp = _operationQueue.Dequeue();
                    _logger?.LogInfo($"[GlobalOperation] Processando operação da fila: {queuedOp.Name}");

                    // Pequeno delay para transição suave
                    await Task.Delay(500);

                    // Executar operação da fila
                    await TryStartOperationAsync(queuedOp.State, queuedOp.Name, queuedOp.Operation, isBackground: true);
                }
            }
            finally
            {
                _isProcessingQueue = false;
            }
        }

        /// <summary>
        /// Tenta iniciar uma nova operação global.
        /// Retorna false se já existe uma operação em execução (ou se foi enfileirada).
        /// </summary>
        public async Task<bool> TryStartOperationAsync(
            GlobalOperationState operationState,
            string operationName,
            Func<IProgress<OperationProgress>, CancellationToken, Task> operation,
            bool isBackground = false)
        {
            // Tentar adquirir o lock (não-bloqueante)
            if (!await _operationLock.WaitAsync(0))
            {
                if (isBackground)
                {
                    _logger?.LogInfo($"[GlobalOperation] Background operation '{operationName}' blocked by '{CurrentOperationName}' - Auto-enqueuing.");
                    
                    // Enfileirar silenciosamente
                    EnqueueOperation(operationState, operationName, operation);
                    
                    // Notificar usuário discretamente (opcional)
                    await Application.Current.Dispatcher.InvokeAsync(() =>
                    {
                        NotificationManager.ShowInfo(
                            "Agendado Automaticamente",
                            $"{operationName} foi adicionado à fila e será executado em breve."
                        );
                    });
                    
                    return false; // Retorna false, mas está na fila para rodar depois
                }

                _logger?.LogWarning($"[GlobalOperation] Tentativa de iniciar '{operationName}' bloqueada - operação '{CurrentOperationName}' já em execução");
                
                // Mostrar modal de escolha ao usuário apenas se NÃO for background task
                var choice = await ShowOperationQueueDialogAsync(operationName);

                switch (choice)
                {
                    case UI.Windows.OperationQueueDialog.UserChoice.AddToQueue:
                        // Adicionar à fila
                        EnqueueOperation(operationState, operationName, operation);
                        
                        await Application.Current.Dispatcher.InvokeAsync(() =>
                        {
                            NotificationManager.ShowSuccess(
                                "Adicionado à Fila",
                                $"{operationName} será executado automaticamente após a operação atual."
                            );
                        });
                        
                        return false; // Não executou agora, mas foi enfileirado

                    case UI.Windows.OperationQueueDialog.UserChoice.ExecuteNow:
                        // Cancelar operação atual e executar nova
                        _logger?.LogWarning($"[GlobalOperation] Usuário optou por cancelar '{CurrentOperationName}' e executar '{operationName}' imediatamente");
                        
                        CancelCurrentOperation();
                        await Task.Delay(1000); // Aguardar cancelamento
                        
                        // Tentar novamente (agora deve conseguir o lock)
                        return await TryStartOperationAsync(operationState, operationName, operation, isBackground);

                    case UI.Windows.OperationQueueDialog.UserChoice.ScheduleLater:
                        // Usuário optou por agendar
                        _logger?.LogInfo($"[GlobalOperation] Usuário optou por agendar '{operationName}' para depois");
                        
                        await Application.Current.Dispatcher.InvokeAsync(() =>
                        {
                            NotificationManager.ShowInfo(
                                "Operação Agendada",
                                $"Você pode executar {operationName} quando quiser através do menu."
                            );
                        });
                        
                        return false;

                    case UI.Windows.OperationQueueDialog.UserChoice.Cancel:
                    default:
                        // Usuário cancelou
                        return false;
                }
            }

            try
            {
                // Iniciar operação
                CurrentState = operationState;
                CurrentOperationName = operationName;
                GlobalProgress = 0;
                GlobalStatusMessage = "Iniciando...";

                _currentCancellationTokenSource = new CancellationTokenSource();

                _logger?.LogInfo($"=== [GlobalOperation] Iniciando: {operationName} ===");

                // Criar progress reporter
                var progress = new Progress<OperationProgress>(p =>
                {
                    GlobalProgress = p.Percentage;
                    GlobalStatusMessage = p.Message;
                    
                    // FIX: Propagar para o serviço de UI (converter double para int)
                    GlobalProgressService.Instance.UpdateProgress((int)Math.Round(p.Percentage), p.Message);
                });

                // Executar operação
                await operation(progress, _currentCancellationTokenSource.Token);

                _logger?.LogInfo($"=== [GlobalOperation] Concluída: {operationName} ===");

                // Finalizar
                GlobalProgress = 100;
                GlobalStatusMessage = "Concluído!";
                GlobalProgressService.Instance.UpdateProgress(100, "Concluído!");
                await Task.Delay(2000); // Mostrar mensagem final

                return true;
            }
            catch (OperationCanceledException)
            {
                _logger?.LogWarning($"[GlobalOperation] Cancelada: {operationName}");
                GlobalStatusMessage = "Operação cancelada";
                GlobalProgressService.Instance.UpdateProgress((int)Math.Round(GlobalProgress), "Operação cancelada");
                await Task.Delay(1000);
                return false;
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[GlobalOperation] Erro em '{operationName}': {ex.Message}", ex);
                GlobalStatusMessage = $"Erro: {ex.Message}";
                GlobalProgressService.Instance.UpdateProgress((int)Math.Round(GlobalProgress), $"Erro: {ex.Message}");
                await Task.Delay(3000);
                return false;
            }
            finally
            {
                // Resetar estado
                CurrentState = GlobalOperationState.Idle;
                CurrentOperationName = string.Empty;
                GlobalProgress = 0;
                GlobalStatusMessage = string.Empty;
                GlobalProgressService.Instance.UpdateProgress(0, string.Empty);

                _currentCancellationTokenSource?.Dispose();
                _currentCancellationTokenSource = null;

                // Liberar lock
                _operationLock.Release();

                // Processar fila se houver operações pendentes
                if (_operationQueue.Count > 0)
                {
                    _logger?.LogInfo($"[GlobalOperation] Processando fila ({_operationQueue.Count} operações pendentes)");
                    _ = Task.Run(ProcessQueueAsync);
                }
            }
        }

        /// <summary>
        /// Verifica se pode iniciar uma operação.
        /// Se não puder, exibe mensagem ao usuário.
        /// </summary>
        public bool CanStartOperation(string requestedOperationName)
        {
            if (IsOperationRunning)
            {
                _logger?.LogWarning($"[GlobalOperation] Tentativa de iniciar '{requestedOperationName}' bloqueada - operação '{CurrentOperationName}' já em execução");

                Application.Current.Dispatcher.Invoke(() =>
                {
                    NotificationManager.ShowWarning(
                        "Operação em Andamento",
                        $"Estamos finalizando a preparação inicial do sistema. Aguarde a conclusão para utilizar este recurso.\n\nOperação atual: {CurrentOperationName}"
                    );
                });

                return false;
            }

            return true;
        }

        /// <summary>
        /// Cancela a operação atual (se suportado)
        /// </summary>
        public void CancelCurrentOperation()
        {
            if (_currentCancellationTokenSource != null && !_currentCancellationTokenSource.IsCancellationRequested)
            {
                _logger?.LogInfo($"[GlobalOperation] Cancelando operação: {CurrentOperationName}");
                _currentCancellationTokenSource.Cancel();
            }
        }

        /// <summary>
        /// Mostra o modal de escolha ao usuário
        /// </summary>
        private async Task<UI.Windows.OperationQueueDialog.UserChoice> ShowOperationQueueDialogAsync(string requestedOperationName)
        {
            var choice = UI.Windows.OperationQueueDialog.UserChoice.Cancel;

            await Application.Current.Dispatcher.InvokeAsync(() =>
            {
                var dialog = new UI.Windows.OperationQueueDialog(
                    CurrentOperationName,
                    GlobalProgress,
                    requestedOperationName
                );

                dialog.ShowDialog();
                choice = dialog.Result;
            });

            return choice;
        }

        /// <summary>
        /// Atualiza o progresso da operação atual
        /// </summary>
        public void UpdateProgress(double percentage, string message)
        {
            if (!IsOperationRunning)
            {
                _logger?.LogWarning("[GlobalOperation] Tentativa de atualizar progresso sem operação ativa");
                return;
            }

            Application.Current.Dispatcher.Invoke(() =>
            {
                GlobalProgress = percentage;
                GlobalStatusMessage = message;
                
                // FIX: Propagar para o serviço de UI (converter double para int)
                GlobalProgressService.Instance.UpdateProgress((int)Math.Round(percentage), message);
            });
        }

        #endregion

        #region INotifyPropertyChanged

        protected virtual void OnPropertyChanged([CallerMemberName] string? propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        #endregion
    }

    #region Enums and Models

    /// <summary>
    /// Estados possíveis de operações globais
    /// </summary>
    public enum GlobalOperationState
    {
        /// <summary>
        /// Nenhuma operação em execução
        /// </summary>
        Idle,

        /// <summary>
        /// Executando "Preparar PC"
        /// </summary>
        PreparingPc,

        /// <summary>
        /// Executando limpeza do sistema
        /// </summary>
        CleaningSystem,

        /// <summary>
        /// Executando otimização de performance
        /// </summary>
        OptimizingPerformance,

        /// <summary>
        /// Executando otimização de rede
        /// </summary>
        OptimizingNetwork,

        /// <summary>
        /// Outra operação genérica
        /// </summary>
        Other
    }

    /// <summary>
    /// Informações de progresso de uma operação
    /// </summary>
    public class OperationProgress
    {
        public double Percentage { get; set; }
        public string Message { get; set; } = string.Empty;
    }

    /// <summary>
    /// Operação enfileirada para execução posterior
    /// </summary>
    public class QueuedOperation
    {
        public GlobalOperationState State { get; set; }
        public string Name { get; set; } = string.Empty;
        public Func<IProgress<OperationProgress>, CancellationToken, Task> Operation { get; set; } = null!;
    }

    #endregion
}
