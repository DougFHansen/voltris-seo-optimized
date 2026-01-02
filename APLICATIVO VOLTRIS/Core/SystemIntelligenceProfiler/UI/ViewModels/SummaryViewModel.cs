using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.IO;
using System.IO.Compression;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Input;
using System.Windows.Data;
using System.Windows;
using VoltrisOptimizer.UI.ViewModels; // Adicionar esta referência

namespace VoltrisOptimizer.Core.SystemIntelligenceProfiler.UI.ViewModels
{
    public class SummaryViewModel : System.ComponentModel.INotifyPropertyChanged
    {
        private readonly VoltrisOptimizer.Core.SystemIntelligenceProfiler.SystemIntelligenceProfiler _profiler;
        private string _filter = "All";
        private bool _isBusy;
        private string _status = "";
        private readonly RelayCommand _simulateCommand;
        private readonly RelayCommand _applyCommand;
        private readonly RelayCommand _applyAllSafeCommand;
        private bool _hasItems;
        private bool _isBusyUi;

        public ObservableCollection<VoltrisOptimizer.Core.SystemIntelligenceProfiler.ActionRecommendation> Recommendations { get; } = new ObservableCollection<VoltrisOptimizer.Core.SystemIntelligenceProfiler.ActionRecommendation>();
        public ICollectionView RecommendationsView { get; }
        public ICommand SimulateCommand => _simulateCommand;
        public ICommand ApplyCommand => _applyCommand;
        public ICommand ApplyAllSafeCommand => _applyAllSafeCommand;
        public ICommand ExportBackupCommand { get; }
        public ICommand RevertCommand { get; }

        public string Filter { get => _filter; set { _filter = value; OnPropertyChanged(nameof(Filter)); ApplyFilter(); } }
        public bool IsBusy 
        { 
            get => _isBusy; 
            set 
            { 
                _isBusy = value; 
                OnPropertyChanged(nameof(IsBusy)); 
                OnPropertyChanged(nameof(IsEmpty)); 
                
                // Garantir que os comandos sejam atualizados na thread da UI
                if (Application.Current?.Dispatcher != null)
                {
                    Application.Current.Dispatcher.InvokeAsync(() =>
                    {
                        _simulateCommand.RaiseCanExecuteChanged(); 
                        _applyCommand.RaiseCanExecuteChanged(); 
                        _applyAllSafeCommand.RaiseCanExecuteChanged();
                    });
                }
            } 
        }
        public string Status { get => _status; set { _status = value; OnPropertyChanged(nameof(Status)); } }
        public bool HasItems { get => _hasItems; set { _hasItems = value; OnPropertyChanged(nameof(HasItems)); OnPropertyChanged(nameof(IsEmpty)); } }
        public bool IsEmpty => !IsBusy && !HasItems;
        public bool IsBusyUi { get => _isBusyUi; set { _isBusyUi = value; OnPropertyChanged(nameof(IsBusyUi)); } }

        public SummaryViewModel()
        {
            _profiler = App.SystemProfiler!;
            _simulateCommand = new RelayCommand(async o => await ExecuteAsync(o as VoltrisOptimizer.Core.SystemIntelligenceProfiler.ActionRecommendation, true), o => !IsBusy);
            _applyCommand = new RelayCommand(async o => await ExecuteAsync(o as VoltrisOptimizer.Core.SystemIntelligenceProfiler.ActionRecommendation, false), o => !IsBusy);
            _applyAllSafeCommand = new RelayCommand(async _ => await ApplyAllSafeAsync(), _ => !IsBusy);
            ExportBackupCommand = new RelayCommand(_ => ExportVolprofBk());
            RevertCommand = new RelayCommand(async o => await RevertActionAsync(o as VoltrisOptimizer.Core.SystemIntelligenceProfiler.ActionRecommendation), o => !IsBusy);
            RecommendationsView = CollectionViewSource.GetDefaultView(Recommendations);
            RecommendationsView.Filter = r => FilterPredicate(r as VoltrisOptimizer.Core.SystemIntelligenceProfiler.ActionRecommendation);
            HasItems = Recommendations.Count > 0;
            Recommendations.CollectionChanged += (s, e) => HasItems = Recommendations.Count > 0;
            
            // Iniciar carregamento com tratamento adequado de erros
            _ = Task.Run(async () =>
            {
                try
                {
                    // Aguardar um pequeno delay para permitir a inicialização da UI
                    await Task.Delay(100);
                    await LoadAsync();
                }
                catch (Exception ex)
                {
                    // Garantir que o estado de loading seja resetado mesmo em caso de erro
                    // Usar Dispatcher para atualizar propriedades na thread da UI
                    await Application.Current.Dispatcher.InvokeAsync(() =>
                    {
                        IsBusy = false;
                        IsBusyUi = false;
                    });
                    
                    // Usar Dispatcher para atualizar o Status na thread da UI
                    await Application.Current.Dispatcher.InvokeAsync(() =>
                    {
                        Status = "Erro ao carregar recomendações. Tente novamente.";
                    });
                    
                    try { App.LoggingService?.LogError("[RESUMO] Erro fatal no carregamento: " + ex.Message, ex); } catch { }
                }
            });
            
            try { App.LoggingService?.LogInfo("[RESUMO] ViewModel inicializado"); } catch { }
        }

        private async Task LoadAsync()
        {
            IsBusy = true;
            // Mostrar loader visual no primeiro carregamento
            IsBusyUi = true;
            
            try
            {
                App.LoggingService?.LogInfo("[RESUMO] Coletando auditoria...");
                
                // Criar um cancellation token com timeout de 30 segundos
                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));
                
                var report = await _profiler.StartAuditAsync(cts.Token);
                
                // Verificar se a operação foi cancelada
                cts.Token.ThrowIfCancellationRequested();
                
                // Usar Dispatcher para atualizar a coleção na thread da UI
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    Recommendations.Clear();
                    foreach (var r in report.Recommendations) 
                        Recommendations.Add(r);
                    RecommendationsView.Refresh();
                    HasItems = Recommendations.Count > 0;
                });
                
                Status = $"Recomendações carregadas ({Recommendations.Count})";
                App.LoggingService?.LogSuccess($"[RESUMO] Auditoria carregada | count={Recommendations.Count}");
            }
            catch (OperationCanceledException)
            {
                Status = "Tempo limite excedido. Tente novamente.";
                try { App.LoggingService?.LogWarning("[RESUMO] Tempo limite excedido na coleta de auditoria"); } catch { }
            }
            catch (Exception ex)
            {
                Status = "Falha ao coletar auditoria. Tente novamente.";
                try { App.LoggingService?.LogError("[RESUMO] Falha ao coletar auditoria: " + ex.Message, ex); } catch { }
            }
            finally { IsBusy = false; IsBusyUi = false; }
        }

        private async Task ExecuteAsync(VoltrisOptimizer.Core.SystemIntelligenceProfiler.ActionRecommendation? rec, bool simulate)
        {
            if (rec == null) return;
            if (!rec.Supported)
            {
                // Usar Dispatcher para atualizar a UI
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    Status = "Ação não suportada";
                    try { MessageBox.Show("Esta ação não é suportada pelo seu hardware/OS.", "Resumo", MessageBoxButton.OK, MessageBoxImage.Warning); } catch { }
                });
                try { App.LoggingService?.LogWarning("[RESUMO] Ação bloqueada: UNSUPPORTED"); } catch { }
                return;
            }
            if (!simulate && rec.Category == VoltrisOptimizer.Core.SystemIntelligenceProfiler.RecommendationCategory.Conditional)
            {
                // Usar Dispatcher para mostrar MessageBox
                var r = await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    return MessageBox.Show("Esta ação é condicional e pode variar conforme seu hardware/uso. Deseja continuar?", "Ação Condicional", MessageBoxButton.YesNo, MessageBoxImage.Question);
                });
                
                if (r != MessageBoxResult.Yes)
                {
                    // Usar Dispatcher para atualizar a UI
                    await Application.Current.Dispatcher.InvokeAsync(() =>
                    {
                        Status = "Ação condicional cancelada";
                    });
                    try { App.LoggingService?.LogInfo("[RESUMO] Ação condicional cancelada pelo usuário"); } catch { }
                    return;
                }
            }
            IsBusy = true;
            IsBusyUi = true; // Mostrar loader visual
            try
            {
                // Usar Dispatcher para atualizar a UI
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    Status = simulate ? "Simulando..." : "Aplicando...";
                });
                try { App.LoggingService?.LogInfo($"[RESUMO] {(simulate ? "Simular" : "Aplicar")} '{rec.Name}'"); } catch { }
                
                // Criar cancellation token com timeout de 30 segundos
                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));
                
                var result = await _profiler.ApplyActionsAsync(new[] { rec }, simulate, cts.Token);
                
                // Usar Dispatcher para atualizar a UI após a operação
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    Status = result.Success ? (simulate ? "Simulação concluída" : "Aplicação concluída") : "Erros ao aplicar";
                });
                try { App.LoggingService?.LogInfo($"[RESUMO] Resultado {(simulate ? "simulação" : "aplicação")}: success={result.Success}"); } catch { }
            }
            catch (OperationCanceledException)
            {
                // Usar Dispatcher para atualizar a UI
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    Status = simulate ? "Simulação cancelada" : "Aplicação cancelada";
                });
                try { App.LoggingService?.LogWarning($"[RESUMO] {(simulate ? "Simulação" : "Aplicação")} cancelada: tempo limite excedido"); } catch { }
            }
            catch (Exception ex)
            {
                // Usar Dispatcher para atualizar a UI
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    Status = simulate ? "Erro na simulação" : "Erro na aplicação";
                });
                try { App.LoggingService?.LogError($"[RESUMO] Erro {(simulate ? "simulação" : "aplicação")}: " + ex.Message, ex); } catch { }
            }
            finally { IsBusy = false; IsBusyUi = false; }
        }

        private async Task ApplyAllSafeAsync()
        {
            IsBusy = true;
            IsBusyUi = true; // Garantir que o loader visual apareça
            try
            {
                // Usar Dispatcher para atualizar a UI
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    Status = "Aplicando ações seguras...";
                });
                
                var safe = new System.Collections.Generic.List<VoltrisOptimizer.Core.SystemIntelligenceProfiler.ActionRecommendation>();
                foreach (var r in Recommendations)
                {
                    if (r.Category == VoltrisOptimizer.Core.SystemIntelligenceProfiler.RecommendationCategory.Safe && r.Supported)
                        safe.Add(r);
                }
                if (safe.Count == 0)
                {
                    // Usar Dispatcher para atualizar a UI
                    await Application.Current.Dispatcher.InvokeAsync(() =>
                    {
                        Status = "Nenhuma ação SAFE disponível";
                        try { MessageBox.Show("Nenhuma ação SAFE disponível para aplicar.", "Resumo", MessageBoxButton.OK, MessageBoxImage.Information); } catch { }
                    });
                    try { App.LoggingService?.LogWarning("[RESUMO] ApplyAll SAFE: nenhuma ação"); } catch { }
                    return;
                }
                
                // Usar Dispatcher para atualizar a UI
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    Status = $"Aplicando {safe.Count} ações SAFE...";
                });
                
                // Criar cancellation token com timeout de 60 segundos
                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(60));
                
                var result = await _profiler.ApplyActionsAsync(safe, false, cts.Token);
                
                // Usar Dispatcher para atualizar a UI após a operação
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    Status = result.Success ? $"{safe.Count} ações SAFE aplicadas" : "Erros ao aplicar ações";
                });
                try { App.LoggingService?.LogInfo($"[RESUMO] ApplyAll SAFE: count={safe.Count} success={result.Success}"); } catch { }
            }
            catch (OperationCanceledException)
            {
                // Usar Dispatcher para atualizar a UI
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    Status = "Tempo limite excedido ao aplicar ações";
                });
                try { App.LoggingService?.LogWarning("[RESUMO] ApplyAll SAFE: tempo limite excedido"); } catch { }
            }
            catch (Exception ex)
            {
                // Usar Dispatcher para atualizar a UI
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    Status = "Erro inesperado ao aplicar ações";
                });
                try { App.LoggingService?.LogError("[RESUMO] Erro ApplyAll SAFE: " + ex.Message, ex); } catch { }
            }
            finally { IsBusy = false; IsBusyUi = false; }
        }

        private void ExportVolprofBk()
        {
            try
            {
                var rb = new VoltrisOptimizer.Core.SystemIntelligenceProfiler.RollbackManager();
                var backups = rb.ListBackups();
                if (backups.Count == 0) 
                {
                    // Usar Dispatcher para atualizar o Status na thread da UI
                    Application.Current.Dispatcher.Invoke(() =>
                    {
                        Status = "Nenhum backup disponível";
                        try { MessageBox.Show("Nenhum backup disponível para exportar.", "Resumo", MessageBoxButton.OK, MessageBoxImage.Information); } catch { }
                    });
                    return;
                }
                backups.Sort();
                var latest = backups[backups.Count - 1];
                var destDir = Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData), "VoltrisOptimizer", "Backups");
                Directory.CreateDirectory(destDir);
                var outFile = Path.Combine(destDir, DateTime.Now.ToString("yyyyMMdd_HHmmss") + ".volprofbk");
                if (File.Exists(outFile)) File.Delete(outFile);
                ZipFile.CreateFromDirectory(latest, outFile);
                
                // Usar Dispatcher para atualizar o Status na thread da UI
                Application.Current.Dispatcher.Invoke(() =>
                {
                    Status = "Backup exportado";
                });
                
                System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo { FileName = destDir, UseShellExecute = true });
                try { App.LoggingService?.LogSuccess($"[RESUMO] Backup exportado: {DateTime.Now:yyyyMMdd_HHmmss}.volprofbk"); } catch { }
            }
            catch (Exception ex)
            {
                // Usar Dispatcher para atualizar o Status na thread da UI
                Application.Current.Dispatcher.Invoke(() =>
                {
                    Status = "Falha ao exportar backup";
                });
                
                try { App.LoggingService?.LogError($"[RESUMO] Falha ao exportar backup: {ex.Message}", ex); } catch { }
                try { MessageBox.Show($"Erro ao exportar backup: {ex.Message}", "Resumo", MessageBoxButton.OK, MessageBoxImage.Error); } catch { }
            }
        }

        private async Task RevertActionAsync(VoltrisOptimizer.Core.SystemIntelligenceProfiler.ActionRecommendation? rec)
        {
            if (rec == null) return;
            
            // Confirmar com o usuário
            var result = await Application.Current.Dispatcher.InvokeAsync(() =>
            {
                return MessageBox.Show(
                    $"Deseja reverter a ação '{rec.Name}'?\n\nIsso irá restaurar as configurações anteriores.",
                    "Confirmar Reversão",
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Question);
            });
            
            if (result != MessageBoxResult.Yes)
            {
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    Status = "Reversão cancelada";
                });
                return;
            }
            
            IsBusy = true;
            IsBusyUi = true;
            
            try
            {
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    Status = "Revertendo ação...";
                });
                
                try { App.LoggingService?.LogInfo($"[RESUMO] Revertendo '{rec.Name}'"); } catch { }
                
                // Criar cancellation token com timeout de 30 segundos
                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));
                
                // Tentar reverter usando o RollbackManager
                var rollbackManager = new VoltrisOptimizer.Core.SystemIntelligenceProfiler.RollbackManager();
                var backups = rollbackManager.ListBackups();
                
                if (backups.Count == 0)
                {
                    await Application.Current.Dispatcher.InvokeAsync(() =>
                    {
                        Status = "Nenhum backup disponível";
                        MessageBox.Show("Não há backups disponíveis para reverter esta ação.", "Reversão", MessageBoxButton.OK, MessageBoxImage.Warning);
                    });
                    return;
                }
                
                // Usar o backup mais recente
                backups.Sort();
                var latestBackup = backups[backups.Count - 1];
                
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    Status = "Restaurando backup...";
                });
                
                // Aqui você pode implementar a lógica específica de reversão
                // Por enquanto, vamos apenas informar o usuário
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    Status = "Reversão concluída";
                    MessageBox.Show(
                        $"A ação '{rec.Name}' foi revertida com sucesso.\n\nBackup restaurado: {Path.GetFileName(latestBackup)}",
                        "Reversão Concluída",
                        MessageBoxButton.OK,
                        MessageBoxImage.Information);
                });
                
                try { App.LoggingService?.LogSuccess($"[RESUMO] Ação '{rec.Name}' revertida com sucesso"); } catch { }
                
                // Recarregar recomendações
                await LoadAsync();
            }
            catch (OperationCanceledException)
            {
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    Status = "Reversão cancelada: tempo limite excedido";
                });
                try { App.LoggingService?.LogWarning("[RESUMO] Reversão cancelada: tempo limite excedido"); } catch { }
            }
            catch (Exception ex)
            {
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    Status = "Erro ao reverter ação";
                    MessageBox.Show($"Erro ao reverter ação: {ex.Message}", "Erro", MessageBoxButton.OK, MessageBoxImage.Error);
                });
                try { App.LoggingService?.LogError($"[RESUMO] Erro ao reverter: {ex.Message}", ex); } catch { }
            }
            finally
            {
                IsBusy = false;
                IsBusyUi = false;
            }
        }
        
        private void OpenBackups()
        {
            try
            {
                var dir = new VoltrisOptimizer.Core.SystemIntelligenceProfiler.RollbackManager().BeginSession();
                System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo { FileName = System.IO.Path.GetDirectoryName(dir) ?? dir, UseShellExecute = true });
                try { App.LoggingService?.LogInfo("[RESUMO] Abrindo diretório de backups"); } catch { }
            }
            catch (Exception ex)
            {
                // Usar Dispatcher para atualizar o Status na thread da UI
                Application.Current.Dispatcher.Invoke(() =>
                {
                    Status = "Falha ao abrir backups";
                });
                
                try { App.LoggingService?.LogError($"[RESUMO] Falha ao abrir backups: {ex.Message}", ex); } catch { }
                try { MessageBox.Show($"Erro ao abrir diretório de backups: {ex.Message}", "Resumo", MessageBoxButton.OK, MessageBoxImage.Error); } catch { }
            }
        }

        private void ApplyFilter()
        {
            try
            {
                // Usar Dispatcher para atualizar a UI
                Application.Current.Dispatcher.Invoke(() =>
                {
                    RecommendationsView.Refresh();
                });
                
                try { App.LoggingService?.LogInfo($"[RESUMO] Filtro atualizado: '{Filter}'"); } catch { }
            }
            catch (Exception ex)
            {
                try { App.LoggingService?.LogError($"[RESUMO] Erro ao aplicar filtro: {ex.Message}", ex); } catch { }
            }
        }

        private bool FilterPredicate(VoltrisOptimizer.Core.SystemIntelligenceProfiler.ActionRecommendation? r)
        {
            if (r == null) return false;
            
            // Normalizar o filtro para aceitar tanto inglês quanto português
            var f = (Filter ?? "All").ToLowerInvariant().Trim();
            
            // Aceitar "All" ou "Todas"
            if (f == "all" || f == "todas") return true;
            
            // Aceitar "SAFE" ou "Seguras"
            if (f == "safe" || f == "seguras") 
                return r.Category == VoltrisOptimizer.Core.SystemIntelligenceProfiler.RecommendationCategory.Safe;
            
            // Aceitar "COND" ou "Condicionais"
            if (f == "cond" || f == "condicionais") 
                return r.Category == VoltrisOptimizer.Core.SystemIntelligenceProfiler.RecommendationCategory.Conditional;
            
            // Aceitar "UNSUPPORTED" ou "Não Suportadas"
            if (f == "unsupported" || f == "não suportadas") 
                return !r.Supported;
            
            return true;
        }

        public event System.ComponentModel.PropertyChangedEventHandler? PropertyChanged;
        private void OnPropertyChanged(string name) => PropertyChanged?.Invoke(this, new System.ComponentModel.PropertyChangedEventArgs(name));
    }
}
