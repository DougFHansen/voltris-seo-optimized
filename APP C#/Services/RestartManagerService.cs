using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading.Tasks;
using System.Windows;
using VoltrisOptimizer.UI.Controls;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Tipos de reinício necessários
    /// </summary>
    public enum RestartType
    {
        None = 0,
        Recommended = 1,
        Required = 2
    }

    /// <summary>
    /// Representa uma mudança que pode requerer reinício
    /// </summary>
    public class PendingChange
    {
        public string Category { get; set; } = "";
        public string Optimization { get; set; } = "";
        public RestartType Type { get; set; }
        public string Description { get; set; } = "";
        public DateTime Timestamp { get; set; } = DateTime.Now;
    }

    /// <summary>
    /// Serviço gerenciador de reinício do sistema - Estilo Enterprise
    /// Gerencia mudanças que requerem reinício e apresenta modais profissionais ao usuário
    /// </summary>
    public class RestartManagerService
    {
        private static readonly Lazy<RestartManagerService> _instance = 
            new Lazy<RestartManagerService>(() => new RestartManagerService());
        
        public static RestartManagerService Instance => _instance.Value;
        
        private readonly List<PendingChange> _pendingChanges = new();
        private bool _restartScheduled = false;

        /// <summary>
        /// Indica se há mudanças pendentes que requerem reinício
        /// </summary>
        public bool HasPendingChanges => _pendingChanges.Count > 0;
        
        /// <summary>
        /// Indica se o reinício foi agendado
        /// </summary>
        public bool IsRestartScheduled => _restartScheduled;
        
        /// <summary>
        /// Lista de mudanças pendentes
        /// </summary>
        public IReadOnlyList<PendingChange> PendingChanges => _pendingChanges.AsReadOnly();

        private RestartManagerService() { }

        /// <summary>
        /// Registra uma mudança que pode requerer reinício
        /// </summary>
        public void RegisterChange(string category, string optimization, RestartType type, string description)
        {
            if (type == RestartType.None) return;
            
            _pendingChanges.Add(new PendingChange
            {
                Category = category,
                Optimization = optimization,
                Type = type,
                Description = description,
                Timestamp = DateTime.Now
            });
            
            App.LoggingService?.LogInfo($"[RestartManager] Mudança registrada: {optimization} ({type})");
        }

        /// <summary>
        /// Limpa todas as mudanças pendentes
        /// </summary>
        public void ClearPendingChanges()
        {
            _pendingChanges.Clear();
            _restartScheduled = false;
        }

        /// <summary>
        /// Verifica e mostra modal de reinício se necessário
        /// </summary>
        public async Task CheckAndPromptRestartAsync(string operationType)
        {
            if (!HasPendingChanges) return;

            await Application.Current.Dispatcher.InvokeAsync(() =>
            {
                ShowRestartModal(operationType);
            });
        }

        /// <summary>
        /// Mostra o modal de reinício profissional
        /// </summary>
        private void ShowRestartModal(string operationType)
        {
            var requiredCount = 0;
            var recommendedCount = 0;
            
            foreach (var change in _pendingChanges)
            {
                if (change.Type == RestartType.Required) requiredCount++;
                else if (change.Type == RestartType.Recommended) recommendedCount++;
            }

            var hasRequired = requiredCount > 0;
            var title = hasRequired ? "⚠️ Reinício Necessário" : "💡 Reinício Recomendado";
            
            var message = BuildRestartMessage(operationType, requiredCount, recommendedCount);

            // Criar modal com opções
            var result = ModernMessageBox.Show(
                message,
                title,
                MessageBoxButton.YesNoCancel,
                hasRequired ? MessageBoxImage.Warning : MessageBoxImage.Information);

            switch (result)
            {
                case MessageBoxResult.Yes:
                    // Reiniciar agora
                    ScheduleRestart(0);
                    break;
                    
                case MessageBoxResult.No:
                    // Reiniciar depois (agendar para 1 hora)
                    if (hasRequired)
                    {
                        _restartScheduled = true;
                        new ToastService().Show(
                            "Reinício Pendente",
                            "Lembre-se de reiniciar o computador para aplicar todas as otimizações."
                        );
                    }
                    break;
                    
                case MessageBoxResult.Cancel:
                    // Não reiniciar
                    if (!hasRequired)
                    {
                        ClearPendingChanges();
                        new ToastService().Show(
                            "Otimizações Parciais",
                            "Algumas otimizações só terão efeito após reiniciar."
                        );
                    }
                    break;
            }
        }

        /// <summary>
        /// Constrói a mensagem do modal de reinício
        /// </summary>
        private string BuildRestartMessage(string operationType, int requiredCount, int recommendedCount)
        {
            var sb = new System.Text.StringBuilder();
            
            // Header com sucesso
            sb.AppendLine($"✅ As {operationType} foram aplicadas com sucesso!");
            sb.AppendLine();
            
            // Informação sobre reinício necessário
            if (requiredCount > 0)
            {
                sb.AppendLine($"⚠️  REINÍCIO NECESSÁRIO ({requiredCount} otimização(ões))");
                sb.AppendLine();
                sb.AppendLine("As seguintes otimizações EXIGEM reinício do sistema:");
            }
            else
            {
                sb.AppendLine($"💡  REINÍCIO RECOMENDADO ({recommendedCount} otimização(ões))");
                sb.AppendLine();
                sb.AppendLine("As seguintes otimizações terão melhor desempenho após reiniciar:");
            }
            sb.AppendLine();

            // Listar mudanças de forma organizada (máximo 8 para melhor visualização)
            var count = 0;
            var maxDisplay = 8;
            
            // Agrupar por categoria
            var groupedChanges = new System.Collections.Generic.Dictionary<string, System.Collections.Generic.List<PendingChange>>();
            foreach (var change in _pendingChanges)
            {
                if (!groupedChanges.ContainsKey(change.Category))
                    groupedChanges[change.Category] = new System.Collections.Generic.List<PendingChange>();
                groupedChanges[change.Category].Add(change);
            }

            foreach (var categoryGroup in groupedChanges)
            {
                if (count >= maxDisplay)
                {
                    var remaining = _pendingChanges.Count - count;
                    sb.AppendLine($"      ... e mais {remaining} otimização(ões)");
                    break;
                }
                
                // Categoria
                sb.AppendLine($"  📁 {categoryGroup.Key}");
                
                // Otimizações desta categoria
                foreach (var change in categoryGroup.Value)
                {
                    if (count >= maxDisplay) break;
                    
                    var icon = change.Type == RestartType.Required ? "🔴" : "🟡";
                    var optName = change.Optimization;
                    sb.AppendLine($"      {icon} {optName}");
                    count++;
                }
                sb.AppendLine();
            }

            sb.AppendLine("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
            sb.AppendLine();
            
            // Instruções claras
            if (requiredCount > 0)
            {
                sb.AppendLine("Escolha uma opção:");
                sb.AppendLine();
                sb.AppendLine("  🟢  SIM      → Reiniciar agora (salve seus trabalhos!)");
                sb.AppendLine("  🟡  NÃO      → Lembrar mais tarde");
                sb.AppendLine("  ⚪  CANCELAR → Ignorar este aviso");
            }
            else
            {
                sb.AppendLine("Escolha uma opção:");
                sb.AppendLine();
                sb.AppendLine("  🟢  SIM      → Reiniciar agora");
                sb.AppendLine("  🟡  NÃO      → Reiniciar depois");
                sb.AppendLine("  ⚪  CANCELAR → Continuar sem reiniciar");
            }

            return sb.ToString();
        }

        /// <summary>
        /// Agenda o reinício do sistema
        /// </summary>
        public void ScheduleRestart(int delaySeconds = 60)
        {
            try
            {
                if (delaySeconds == 0)
                {
                    // Confirmar antes de reiniciar imediatamente
                    var confirm = ModernMessageBox.Show(
                        "⚠️ O computador será reiniciado AGORA.\n\n" +
                        "Certifique-se de que salvou todos os seus trabalhos!\n\n" +
                        "Deseja continuar?",
                        "Confirmar Reinício",
                        MessageBoxButton.YesNo,
                        MessageBoxImage.Warning);
                    
                    if (confirm != MessageBoxResult.Yes) return;
                    
                    delaySeconds = 10; // 10 segundos de delay mínimo
                }

                // Usar shutdown command para reiniciar
                var psi = new ProcessStartInfo
                {
                    FileName = "shutdown.exe",
                    Arguments = $"/r /t {delaySeconds} /c \"Voltris Optimizer - Reiniciando para aplicar otimizações...\"",
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                Process.Start(psi);
                _restartScheduled = true;
                
                App.LoggingService?.LogInfo($"[RestartManager] Reinício agendado para {delaySeconds} segundos");
                
                new ToastService().Show(
                    "Reinício Agendado",
                    $"O computador reiniciará em {delaySeconds} segundos."
                );
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[RestartManager] Erro ao agendar reinício: {ex.Message}");
                ModernMessageBox.Show(
                    $"Não foi possível agendar o reinício:\n\n{ex.Message}\n\n" +
                    "Por favor, reinicie manualmente o computador.",
                    "Erro",
                    MessageBoxButton.OK,
                    MessageBoxImage.Error);
            }
        }

        /// <summary>
        /// Cancela um reinício agendado
        /// </summary>
        public void CancelScheduledRestart()
        {
            try
            {
                var psi = new ProcessStartInfo
                {
                    FileName = "shutdown.exe",
                    Arguments = "/a",
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                Process.Start(psi);
                _restartScheduled = false;
                
                App.LoggingService?.LogInfo("[RestartManager] Reinício cancelado");
                
                new ToastService().Show(
                    "Reinício Cancelado",
                    "O reinício agendado foi cancelado."
                );
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogWarning($"[RestartManager] Erro ao cancelar reinício: {ex.Message}");
            }
        }
    }
}
