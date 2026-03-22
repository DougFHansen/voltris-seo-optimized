using System;
using System.Windows.Input;

namespace VoltrisOptimizer.Core.SystemIntelligenceProfiler.UI.ViewModels
{
    public class RelayCommand : ICommand
    {
        private readonly Action<object?> _execute;
        private readonly Func<object?, bool>? _canExecute;

        public RelayCommand(Action<object?> execute, Func<object?, bool>? canExecute = null)
        {
            _execute = execute ?? throw new ArgumentNullException(nameof(execute));
            _canExecute = canExecute;
        }

        public bool CanExecute(object? parameter)
        {
            try
            {
                var result = _canExecute?.Invoke(parameter) ?? true;
                return result;
            }
            catch (Exception ex)
            {
                try { App.LoggingService?.LogError($"[RelayCommand] Erro em CanExecute: {ex.Message}"); } catch { }
                return false;
            }
        }
        
        public void Execute(object? parameter)
        {
            try
            {
                try { App.LoggingService?.LogInfo("[RelayCommand] ========== Execute CHAMADO! =========="); } catch { }
                
                if (!CanExecute(parameter))
                {
                    try { App.LoggingService?.LogWarning("[RelayCommand] Execute bloqueado: CanExecute retornou false"); } catch { }
                    return;
                }
                
                try { App.LoggingService?.LogInfo("[RelayCommand] Executando ação..."); } catch { }
                _execute(parameter);
                try { App.LoggingService?.LogSuccess("[RelayCommand] ✅ Ação executada com sucesso!"); } catch { }
            }
            catch (Exception ex)
            {
                try { App.LoggingService?.LogError($"[RelayCommand] ❌ Erro em Execute: {ex.Message}", ex); } catch { }
                throw; // Re-throw para não esconder o erro
            }
        }

        public event EventHandler? CanExecuteChanged
        {
            add { CommandManager.RequerySuggested += value; }
            remove { CommandManager.RequerySuggested -= value; }
        }
        
        public void RaiseCanExecuteChanged()
        {
            CommandManager.InvalidateRequerySuggested();
        }
    }
}


