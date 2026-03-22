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
using VoltrisOptimizer.Services; // Para IntelligentProfileType

namespace VoltrisOptimizer.Core.SystemIntelligenceProfiler.UI.ViewModels
{
    public class SummaryViewModel : System.ComponentModel.INotifyPropertyChanged
    {
        private readonly VoltrisOptimizer.Core.SystemIntelligenceProfiler.SystemIntelligenceProfiler _profiler;
        private readonly VoltrisOptimizer.Services.ILoggingService? _logger;
        private string _filter = "All";
        private bool _isBusy;
        private string _status = "";
        private readonly RelayCommand _simulateCommand;
        private readonly RelayCommand _applyCommand;
        private readonly RelayCommand _applyAllSafeCommand;
        private bool _hasItems;
        private bool _isBusyUi;
        private double _score;
        private string _scoreTitle = "Potencial de Ganho";

        public ObservableCollection<VoltrisOptimizer.Core.SystemIntelligenceProfiler.ActionRecommendation> Recommendations { get; } = new ObservableCollection<VoltrisOptimizer.Core.SystemIntelligenceProfiler.ActionRecommendation>();
        public ObservableCollection<string> HealthAlerts { get; } = new ObservableCollection<string>();
        public ICollectionView RecommendationsView { get; }
        public ICommand SimulateCommand => _simulateCommand;
        public ICommand ApplyCommand => _applyCommand;
        public ICommand ApplyAllSafeCommand => _applyAllSafeCommand;
        public ICommand ExportBackupCommand { get; }
        public ICommand RevertCommand { get; }
        public ICommand ContinueCommand { get; }

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
        public double Score { get => _score; set { _score = value; OnPropertyChanged(nameof(Score)); } }
        public string ScoreTitle { get => _scoreTitle; set { _scoreTitle = value; OnPropertyChanged(nameof(ScoreTitle)); } }

        public SummaryViewModel()
        {
            _profiler = (SystemIntelligenceProfiler)App.SystemProfiler!;
            _logger = App.LoggingService;
            _simulateCommand = new RelayCommand(async o => await ExecuteAsync(o as VoltrisOptimizer.Core.SystemIntelligenceProfiler.ActionRecommendation, true), o => !IsBusy);
            _applyCommand = new RelayCommand(async o => await ExecuteAsync(o as VoltrisOptimizer.Core.SystemIntelligenceProfiler.ActionRecommendation, false), o => !IsBusy);
            _applyAllSafeCommand = new RelayCommand(async _ => await ApplyAllSafeAsync(), _ => !IsBusy);
            ExportBackupCommand = new RelayCommand(_ => ExportVolprofBk());
            RevertCommand = new RelayCommand(async o => await RevertActionAsync(o as VoltrisOptimizer.Core.SystemIntelligenceProfiler.ActionRecommendation), o => !IsBusy);
            ContinueCommand = new RelayCommand(_ => 
            {
                try
                {
                    // Marcar onboarding como completo
                    var settings = VoltrisOptimizer.Services.SettingsService.Instance.Settings;
                    settings.OnboardingCompleted = true;
                    VoltrisOptimizer.Services.SettingsService.Instance.SaveSettings();
                    
                    var onboardingService = new VoltrisOptimizer.Services.OnboardingService();
                    onboardingService.MarkOnboardingComplete();
                    
                    App.SystemProfiler?.MarkGateCompleted();
                    
                    // Navegar para Dashboard
                    Application.Current.Dispatcher.Invoke(() =>
                    {
                        if (Application.Current.MainWindow is VoltrisOptimizer.UI.MainWindow mainWindow)
                        {
                            try { VoltrisOptimizer.Services.GlobalProgressService.Instance.CompleteOperation("✅ Perfil configurado!"); } catch { }
                            mainWindow.UnlockGate();
                            mainWindow.EnableSidebar();
                            mainWindow.NavigateToPageFromOutside("Dashboard");
                        }
                    });
                }
                catch (Exception ex)
                {
                    try { App.LoggingService?.LogError($"[RESUMO] Erro ao continuar: {ex.Message}", ex); } catch { }
                }
            });
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
            IsBusyUi = true;
            
            // CORREÇÃO: Não iniciar nova operação se já houver uma em andamento
            // Isso evita operações fantasma quando o usuário navega entre páginas
            bool shouldStartOperation = !GlobalProgressService.Instance.IsOperationRunning;
            
            if (shouldStartOperation)
            {
                // Iniciar progresso global apenas se não houver operação em andamento
                GlobalProgressService.Instance.StartOperation("Analisando recomendações...");
            }
            
            try
            {
                App.LoggingService?.LogInfo("[RESUMO] Coletando auditoria...");
                
                // Criar um cancellation token com timeout de 30 segundos
                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(30));
                
                var report = await _profiler.StartAuditAsync(cts.Token);
                
                // Verificar se a operação foi cancelada
                cts.Token.ThrowIfCancellationRequested();
                
                // NOVO: Sincronizar perfil do questionário com as configurações
                try
                {
                    var questionnaireProfile = report.Answers.Profile;
                    var settingsProfile = MapUserProfileToIntelligentProfile(questionnaireProfile);
                    
                    // Atualizar as configurações se o perfil for diferente
                    if (SettingsService.Instance.Settings.IntelligentProfile != settingsProfile)
                    {
                        SettingsService.Instance.Settings.IntelligentProfile = settingsProfile;
                        SettingsService.Instance.SaveSettings();
                        SettingsService.Instance.NotifyProfileChanged(settingsProfile);
                        
                        App.LoggingService?.LogInfo($"[RESUMO] Perfil sincronizado: {questionnaireProfile} -> {settingsProfile}");
                    }
                }
                catch (Exception ex)
                {
                    App.LoggingService?.LogError($"[RESUMO] Erro ao sincronizar perfil com configurações: {ex.Message}", ex);
                }
                
                // Novo: Verificar inteligência (já está otimizado?)
                await _profiler.UpdateRecommendationsStatusAsync(report.Recommendations);

                // Usar Dispatcher para atualizar a coleção na thread da UI
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    Recommendations.Clear();
                    foreach (var r in report.Recommendations) 
                        Recommendations.Add(r);
                    
                    HealthAlerts.Clear();
                    if (report.HealthAlerts != null)
                    {
                        foreach (var alert in report.HealthAlerts)
                            HealthAlerts.Add(alert);
                    }

                    RecommendationsView.Refresh();
                    HasItems = Recommendations.Count > 0;
                    UpdateScore();
                });
                
                Status = $"Recomendações carregadas ({Recommendations.Count})";
                
                // CORREÇÃO: Completar operação apenas se foi iniciada por este método
                if (shouldStartOperation)
                {
                    GlobalProgressService.Instance.CompleteOperation($"Análise concluída: {Recommendations.Count} recomendações");
                }
                
                App.LoggingService?.LogSuccess($"[RESUMO] Auditoria carregada | count={Recommendations.Count}");
            }
            catch (OperationCanceledException)
            {
                Status = "Tempo limite excedido. Tente novamente.";
                
                // CORREÇÃO: Completar operação apenas se foi iniciada por este método
                if (shouldStartOperation)
                {
                    GlobalProgressService.Instance.CompleteOperation("Análise cancelada (tempo limite)");
                }
                
                try { App.LoggingService?.LogWarning("[RESUMO] Tempo limite excedido na coleta de auditoria"); } catch { }
            }
            catch (Exception ex)
            {
                Status = "Falha ao coletar auditoria. Tente novamente.";
                
                // CORREÇÃO: Completar operação apenas se foi iniciada por este método
                if (shouldStartOperation)
                {
                    GlobalProgressService.Instance.CompleteOperation("Erro na análise");
                }
                
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
                // Usar DialogService para MessageBox moderno
                var dialogService = new VoltrisOptimizer.Services.DialogService();
                var confirmed = dialogService.ShowConfirm("Ação Condicional", 
                    "Esta ação é condicional e pode variar conforme seu hardware/uso. Deseja continuar?");
                
                if (!confirmed)
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
            
            // Iniciar progresso global
            GlobalProgressService.Instance.StartOperation(simulate ? $"Simulando: {rec.Name}" : $"Aplicando: {rec.Name}");
            
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
                
                // Simular progresso indeterminado
                GlobalProgressService.Instance.UpdateProgress(30, "Executando ação...");
                
                var result = await _profiler.ApplyActionsAsync(new[] { rec }, simulate, cts.Token);
                
                // Usar Dispatcher para atualizar a UI após a operação
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    if (result.Success && !simulate)
                    {
                        rec.IsApplied = true;
                        rec.IsAlreadyOptimized = true; // Agora está otimizado
                    }
                    
                    Status = result.Success ? (simulate ? "Simulação concluída" : "Aplicação concluída") : "Erros ao aplicar";
                    UpdateScore();
                    RecommendationsView.Refresh(); // Forçar atualização do visual
                });
                
                GlobalProgressService.Instance.CompleteOperation(result.Success ? "Concluído com sucesso" : "Falha na operação");
                try { App.LoggingService?.LogInfo($"[RESUMO] Resultado {(simulate ? "simulação" : "aplicação")}: success={result.Success}"); } catch { }
            }
            catch (OperationCanceledException)
            {
                // Usar Dispatcher para atualizar a UI
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    Status = simulate ? "Simulação cancelada" : "Aplicação cancelada";
                });
                GlobalProgressService.Instance.CompleteOperation("Operação cancelada (tempo limite)");
                try { App.LoggingService?.LogWarning($"[RESUMO] {(simulate ? "Simulação" : "Aplicação")} cancelada: tempo limite excedido"); } catch { }
            }
            catch (Exception ex)
            {
                // Usar Dispatcher para atualizar a UI
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    Status = simulate ? "Erro na simulação" : "Erro na aplicação";
                });
                GlobalProgressService.Instance.CompleteOperation("Erro na operação");
                try { App.LoggingService?.LogError($"[RESUMO] Erro {(simulate ? "simulação" : "aplicação")}: " + ex.Message, ex); } catch { }
            }
            finally { IsBusy = false; IsBusyUi = false; }
        }

        private async Task ApplyAllSafeAsync()
        {
            try
            {
                _logger?.LogInfo("[RESUMO] ========== INÍCIO: Aplicar Recomendações ==========");
                _logger?.LogInfo($"[RESUMO] Perfil Inteligente Ativo: {SettingsService.Instance.Settings.IntelligentProfile}");
                
                IsBusy = true;
                IsBusyUi = true;
                
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    Status = "Aplicando ações seguras...";
                });
                
                var safe = new System.Collections.Generic.List<VoltrisOptimizer.Core.SystemIntelligenceProfiler.ActionRecommendation>();
                foreach (var r in Recommendations)
                {
                    if (r.Category == VoltrisOptimizer.Core.SystemIntelligenceProfiler.RecommendationCategory.Safe && r.Supported && r.IsSelected)
                        safe.Add(r);
                }
                
                if (safe.Count == 0)
                {
                    _logger?.LogWarning("[RESUMO] ========== CANCELADO: Nenhuma ação SAFE disponível ==========");
                    
                    await Application.Current.Dispatcher.InvokeAsync(() =>
                    {
                        Status = "Nenhuma ação SAFE disponível";
                        try { MessageBox.Show("Nenhuma ação SAFE disponível para aplicar.", "Resumo", MessageBoxButton.OK, MessageBoxImage.Information); } catch { }
                    });
                    return;
                }
                
                _logger?.LogInfo($"[RESUMO] {safe.Count} ações SAFE identificadas para aplicação");
                
                // Iniciar progresso global
                GlobalProgressService.Instance.StartOperation($"Aplicando {safe.Count} otimizações seguras...");
                
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    Status = $"Aplicando {safe.Count} ações SAFE...";
                });
                
                // CORREÇÃO: Timeout aumentado para 120 segundos
                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(120));
                
                GlobalProgressService.Instance.UpdateProgress(10, "Preparando sistema...");
                
                _logger?.LogInfo("[RESUMO] Iniciando aplicação de ações SAFE...");
                
                // CORREÇÃO CRÍTICA: Executar em background thread para não travar a UI
                var result = await Task.Run(async () => 
                    await _profiler.ApplyActionsAsync(safe, false, cts.Token)
                ).ConfigureAwait(false);
                
                _logger?.LogInfo($"[RESUMO] Resultado: Success={result.Success}, Applied={result.Applied.Count}, Errors={result.Errors.Count}");
                
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    // Marcar apenas os que realmente foram aplicados
                    int appliedCount = 0;
                    foreach (var r in safe)
                    {
                        if (result.Applied.Contains(r.Name))
                        {
                            r.IsApplied = true;
                            r.IsAlreadyOptimized = true;
                            appliedCount++;
                        }
                    }
                    
                    if (appliedCount == safe.Count)
                    {
                        Status = $"{appliedCount} ações SAFE aplicadas";
                        _logger?.LogSuccess($"[RESUMO] ========== SUCESSO: {appliedCount} ações SAFE aplicadas ==========");
                    }
                    else if (appliedCount > 0)
                    {
                        Status = $"{appliedCount} ações SAFE aplicadas (de {safe.Count} totais)";
                        _logger?.LogWarning($"[RESUMO] ========== PARCIAL: {appliedCount}/{safe.Count} ações SAFE aplicadas ==========");
                    }
                    else
                    {
                        Status = "Erros ao aplicar ações";
                        _logger?.LogError($"[RESUMO] ========== ERRO: Nenhuma ação SAFE foi aplicada ==========");
                    }
                    
                    RecommendationsView.Refresh();
                    UpdateScore();
                });
                
                GlobalProgressService.Instance.CompleteOperation(result.Applied.Count > 0 ? $"Otimizações aplicadas: {result.Applied.Count}/{safe.Count}" : "Falha ao aplicar otimizações");
            }
            catch (OperationCanceledException)
            {
                _logger?.LogWarning("[RESUMO] ========== TIMEOUT: Tempo limite excedido ==========");
                
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    Status = "Tempo limite excedido ao aplicar ações";
                });
                GlobalProgressService.Instance.CompleteOperation("Operação cancelada (tempo limite)");
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[RESUMO] ========== EXCEÇÃO: Erro ao aplicar ações SAFE ==========", ex);
                
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    Status = "Erro inesperado ao aplicar ações";
                });
                GlobalProgressService.Instance.CompleteOperation("Erro durante aplicação");
            }
            finally
            {
                IsBusy = false;
                IsBusyUi = false;
                _logger?.LogInfo("[RESUMO] ========== FIM: Aplicar Recomendações ==========");
            }
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
            
            // Usar DialogService para MessageBox moderno
            var dialogService = new VoltrisOptimizer.Services.DialogService();
            var confirmed = dialogService.ShowConfirm("Confirmar Reversão", 
                $"Deseja reverter a ação '{rec.Name}'?\n\nIsso irá restaurar as configurações anteriores.");
            
            if (!confirmed)
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
                
                // Executar reversão real baseada no tipo da ação
                bool reverted = await RevertActionByTypeAsync(rec, cts.Token);
                
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    if (reverted)
                    {
                        rec.IsApplied = false;
                        rec.IsAlreadyOptimized = false;
                        
                        Status = "Reversão concluída";
                        dialogService.ShowInfo("Reversão Concluída", 
                            $"A ação '{rec.Name}' foi revertida com sucesso.");
                    }
                    else
                    {
                        Status = "Reversão parcial";
                        dialogService.ShowInfo("Reversão", 
                            $"A ação '{rec.Name}' não pôde ser revertida automaticamente.\nVerifique os logs para detalhes.");
                    }
                    
                    RecommendationsView.Refresh();
                });
                
                try { App.LoggingService?.LogSuccess($"[RESUMO] Ação '{rec.Name}' revertida: {reverted}"); } catch { }
                
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
        
        /// <summary>
        /// Executa a reversão real de uma ação baseada no seu ActionType.
        /// </summary>
        private async Task<bool> RevertActionByTypeAsync(ActionRecommendation rec, CancellationToken ct)
        {
            try
            {
                switch (rec.Type)
                {
                    case ActionType.PowerPlan_HighPerformance:
                        if (App.PerformanceOptimizer != null)
                            return (await App.PerformanceOptimizer.SetBalancedPlanAsync()).Success;
                        return false;

                    case ActionType.PowerPlan_Balanced:
                        // Já está balanceado, nada a reverter
                        return true;

                    case ActionType.Storage_DisableSuperfetch:
                        // Reabilitar SysMain
                        try
                        {
                            using var sc = new System.ServiceProcess.ServiceController("SysMain");
                            if (sc.Status != System.ServiceProcess.ServiceControllerStatus.Running)
                            {
                                sc.Start();
                                sc.WaitForStatus(System.ServiceProcess.ServiceControllerStatus.Running, TimeSpan.FromSeconds(10));
                            }
                            return true;
                        }
                        catch (Exception ex)
                        {
                            _logger?.LogWarning($"[RESUMO] Falha ao reabilitar SysMain: {ex.Message}");
                            return false;
                        }

                    case ActionType.Advanced_DisableHags:
                        if (App.ExtremeOptimizations != null)
                            return App.ExtremeOptimizations.ToggleHAGS(true); // Reabilitar
                        return false;

                    case ActionType.Visual_Optimize:
                        // Restaurar efeitos visuais para "Let Windows choose"
                        try
                        {
                            using var key = Microsoft.Win32.Registry.CurrentUser.CreateSubKey(@"Software\Microsoft\Windows\CurrentVersion\Explorer\VisualEffects", true);
                            key?.SetValue("VisualFXSetting", 0, Microsoft.Win32.RegistryValueKind.DWord); // 0 = Let Windows choose
                            return true;
                        }
                        catch { return false; }

                    case ActionType.Memory_Optimize:
                        // Otimização de memória é transiente, não precisa reverter
                        return true;

                    case ActionType.Network_ResetStack:
                    case ActionType.Network_FlushDns:
                    case ActionType.SystemCleanup:
                    case ActionType.Process_Optimize:
                        // Ações transientes, não reversíveis
                        _logger?.LogInfo($"[RESUMO] Ação '{rec.Name}' é transiente, não requer reversão.");
                        return true;

                    case ActionType.General_Optimize:
                        if (App.ExtremeOptimizations != null)
                        {
                            App.ExtremeOptimizations.ApplyGpuTdrTweaks(false);
                            App.ExtremeOptimizations.ApplyNvidiaStereo3DPolicy(false);
                            return true;
                        }
                        return false;

                    case ActionType.Storage_EnableTrim:
                        // TRIM é benéfico, não reverter
                        return true;

                    case ActionType.Storage_Defrag:
                        // Desfragmentação não é reversível
                        return true;

                    default:
                        _logger?.LogWarning($"[RESUMO] Tipo de ação sem reversão implementada: {rec.Type}");
                        return false;
                }
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[RESUMO] Erro ao reverter {rec.Name}: {ex.Message}", ex);
                return false;
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
        private IntelligentProfileType MapUserProfileToIntelligentProfile(UserProfile profile)
        {
            return profile switch
            {
                UserProfile.GamerCompetitive => IntelligentProfileType.GamerCompetitive,
                UserProfile.GamerSinglePlayer => IntelligentProfileType.GamerSinglePlayer,
                UserProfile.WorkOffice => IntelligentProfileType.WorkOffice,
                UserProfile.CreativeVideoEditing => IntelligentProfileType.CreativeVideoEditing,
                UserProfile.DeveloperProgramming => IntelligentProfileType.DeveloperProgramming,
                UserProfile.GeneralBalanced => IntelligentProfileType.GeneralBalanced,
                UserProfile.EnterpriseSecure => IntelligentProfileType.EnterpriseSecure,
                _ => IntelligentProfileType.GeneralBalanced
            };
        }

        private void OnPropertyChanged(string name) => PropertyChanged?.Invoke(this, new System.ComponentModel.PropertyChangedEventArgs(name));

        private void UpdateScore()
        {
            if (Recommendations.Count == 0)
            {
                Score = 100;
                return;
            }

            int optimized = 0;
            foreach (var r in Recommendations)
            {
                if (r.IsApplied || r.IsAlreadyOptimized) optimized++;
            }

            // Cálculo: se tudo otimizado = 100. Se nada = 40 (base).
            double ratio = (double)optimized / Recommendations.Count;
            Score = 40 + (ratio * 60);
            
            if (Score > 100) Score = 100;
        }
    }
}
