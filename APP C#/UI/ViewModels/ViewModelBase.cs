using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Windows.Input;

namespace VoltrisOptimizer.UI.ViewModels
{
    /// <summary>
    /// Classe base para todos os ViewModels
    /// Implementa INotifyPropertyChanged para data binding
    /// </summary>
    public abstract class ViewModelBase : INotifyPropertyChanged, IDisposable
    {
        private bool _isDisposed;
        private bool _isBusy;
        private bool _isActive = true;
        private string _busyMessage = string.Empty;

        /// <summary>
        /// Indica se o ViewModel está ativo (view visível).
        /// Usado para pausar timers e processamento de background.
        /// </summary>
        public bool IsActive
        {
            get => _isActive;
            set => SetProperty(ref _isActive, value, OnActiveChanged);
        }

        /// <summary>
        /// Chamado quando IsActive muda.
        /// Override para pausar/resumir timers.
        /// </summary>
        protected virtual void OnActiveChanged() { }

        /// <summary>
        /// Indica se o ViewModel está ocupado executando uma operação
        /// </summary>
        public bool IsBusy
        {
            get => _isBusy;
            set => SetProperty(ref _isBusy, value);
        }

        /// <summary>
        /// Mensagem a exibir enquanto ocupado
        /// </summary>
        public string BusyMessage
        {
            get => _busyMessage;
            set => SetProperty(ref _busyMessage, value);
        }

        #region INotifyPropertyChanged

        public event PropertyChangedEventHandler? PropertyChanged;

        /// <summary>
        /// Notifica que uma propriedade foi alterada
        /// </summary>
        /// <param name="propertyName">Nome da propriedade (auto-preenchido pelo compilador)</param>
        protected virtual void OnPropertyChanged([CallerMemberName] string? propertyName = null)
        {
            // Opcional: Log trace de mudança de propriedade (desativado por default para não inundar logs de UI)
            // App.LoggingService?.LogTrace($"[ViewModel] PropertyChanged: {this.GetType().Name}.{propertyName}");

            // CORREÇÃO PERFORMANCE: Verificar se há subscribers antes de fazer dispatch.
            // Evita overhead de InvokeAsync quando não há bindings ativos.
            var handler = PropertyChanged;
            if (handler == null) return;
            
            var dispatcher = System.Windows.Application.Current?.Dispatcher;
            if (dispatcher != null && !dispatcher.CheckAccess())
            {
                dispatcher.BeginInvoke(() => handler.Invoke(this, new PropertyChangedEventArgs(propertyName)));
            }
            else
            {
                handler.Invoke(this, new PropertyChangedEventArgs(propertyName));
            }
        }

        /// <summary>
        /// Define o valor de uma propriedade e notifica se alterado
        /// </summary>
        /// <typeparam name="T">Tipo da propriedade</typeparam>
        /// <param name="field">Campo de backing</param>
        /// <param name="value">Novo valor</param>
        /// <param name="propertyName">Nome da propriedade</param>
        /// <returns>True se o valor foi alterado</returns>
        protected bool SetProperty<T>(ref T field, T value, [CallerMemberName] string? propertyName = null)
        {
            if (EqualityComparer<T>.Default.Equals(field, value))
                return false;

            field = value;
            OnPropertyChanged(propertyName);
            return true;
        }

        /// <summary>
        /// Define o valor de uma propriedade com callback adicional
        /// </summary>
        protected bool SetProperty<T>(ref T field, T value, Action onChanged, [CallerMemberName] string? propertyName = null)
        {
            if (SetProperty(ref field, value, propertyName))
            {
                onChanged?.Invoke();
                return true;
            }
            return false;
        }

        #endregion

        #region IDisposable

        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }

        protected virtual void Dispose(bool disposing)
        {
            if (_isDisposed) return;

            if (disposing)
            {
                // Liberar recursos gerenciados
                OnDisposing();
            }

            _isDisposed = true;
        }

        /// <summary>
        /// Chamado quando o ViewModel está sendo descartado
        /// Override para limpar recursos
        /// </summary>
        protected virtual void OnDisposing()
        {
        }

        #endregion

        /// <summary>
        /// Executa uma ação de forma segura, tratando exceções
        /// </summary>
        protected async System.Threading.Tasks.Task ExecuteSafeAsync(
            Func<System.Threading.Tasks.Task> action,
            string? busyMessage = null,
            Action<Exception>? onError = null)
        {
            if (IsBusy) return;

            try
            {
                IsBusy = true;
                BusyMessage = busyMessage ?? "Processando...";
                await action();
            }
            catch (Exception ex)
            {
                onError?.Invoke(ex);
                App.LoggingService?.LogError($"[ViewModel] Erro: {ex.Message}", ex);
            }
            finally
            {
                IsBusy = false;
                BusyMessage = string.Empty;
            }
        }
    }

    /// <summary>
    /// Implementação de ICommand para uso em ViewModels
    /// </summary>
    public class RelayCommand : ICommand
    {
        private readonly Action<object?> _execute;
        private readonly Func<object?, bool>? _canExecute;

        public RelayCommand(Action<object?> execute, Func<object?, bool>? canExecute = null)
        {
            _execute = execute ?? throw new ArgumentNullException(nameof(execute));
            _canExecute = canExecute;
        }

        public RelayCommand(Action execute, Func<bool>? canExecute = null)
            : this(_ => execute(), canExecute == null ? null : _ => canExecute())
        {
        }

        public event EventHandler? CanExecuteChanged
        {
            add => CommandManager.RequerySuggested += value;
            remove => CommandManager.RequerySuggested -= value;
        }

        public bool CanExecute(object? parameter) => _canExecute?.Invoke(parameter) ?? true;

        public void Execute(object? parameter) => _execute(parameter);

        /// <summary>
        /// Força a reavaliação do CanExecute
        /// </summary>
        public void RaiseCanExecuteChanged()
        {
            CommandManager.InvalidateRequerySuggested();
        }
    }

    /// <summary>
    /// Comando assíncrono para operações longas
    /// </summary>
    public class AsyncRelayCommand : ICommand
    {
        private readonly Func<object?, System.Threading.Tasks.Task> _execute;
        private readonly Func<object?, bool>? _canExecute;
        private bool _isExecuting;

        public AsyncRelayCommand(Func<object?, System.Threading.Tasks.Task> execute, Func<object?, bool>? canExecute = null)
        {
            _execute = execute ?? throw new ArgumentNullException(nameof(execute));
            _canExecute = canExecute;
        }

        public AsyncRelayCommand(Func<System.Threading.Tasks.Task> execute, Func<bool>? canExecute = null)
            : this(_ => execute(), canExecute == null ? null : _ => canExecute())
        {
        }

        public event EventHandler? CanExecuteChanged
        {
            add => CommandManager.RequerySuggested += value;
            remove => CommandManager.RequerySuggested -= value;
        }

        public bool CanExecute(object? parameter) => !_isExecuting && (_canExecute?.Invoke(parameter) ?? true);

        public async void Execute(object? parameter)
        {
            if (_isExecuting) return;

            try
            {
                _isExecuting = true;
                RaiseCanExecuteChanged();
                
                var commandName = _execute.Method.Name;
                App.LoggingService?.LogDebug($"[AsyncCommand] Executando: {commandName}");
                var sw = System.Diagnostics.Stopwatch.StartNew();
                
                await _execute(parameter);
                
                sw.Stop();
                App.LoggingService?.LogTrace($"[AsyncCommand] {commandName} finalizado em {sw.ElapsedMilliseconds}ms");
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[AsyncCommand] Falha crítica no comando: {ex.Message}", ex);
            }
            finally
            {
                _isExecuting = false;
                RaiseCanExecuteChanged();
            }
        }

        public void RaiseCanExecuteChanged()
        {
            CommandManager.InvalidateRequerySuggested();
        }
    }
}

