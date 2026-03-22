using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using System.Collections.Specialized;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.UI.Views
{
    public partial class CleanupView : UserControl
    {
        private readonly ObservableCollection<CleanupCategory> _categories = new();
        private readonly ObservableCollection<LogEntry> _logs = new();
        private bool _isWorking = false;
        private VoltrisOptimizer.Services.UltraCleanAnalysis? _lastAnalysis;

        public CleanupView()
        {
            InitializeComponent();
            
            // Setup Bindings
            CategoriesList.ItemsSource = _categories;
            LogViewerItems.ItemsSource = _logs;

            // Events
            Loaded += OnLoaded;
            
            // Ouvir logs globais para mostrar no console interno
            if (App.LoggingService is LoggingService logSvc)
            {
                logSvc.LogEntryAdded += (s, msg) => Dispatcher.BeginInvoke(() => 
                {
                    // Filtrar apenas logs relevantes para limpeza para não poluir demais
                    if (msg.Contains("[UltraClean]") || msg.Contains("[SystemCleaner]"))
                    {
                        var color = Colors.Gray;
                        if (msg.Contains("SUCCESS")) color = Colors.LightGreen;
                        if (msg.Contains("WARNING")) color = Colors.Orange;
                        if (msg.Contains("ERROR")) color = Colors.Red;
                        
                        _logs.Add(new LogEntry { Message = msg, Color = new SolidColorBrush(color) });
                        if (_logs.Count > 100) _logs.RemoveAt(0);
                        LogScrollViewer.ScrollToEnd();
                    }
                });
            }
        }

        private async void OnLoaded(object sender, RoutedEventArgs e)
        {
            // Initial System Check (Non-blocking)
            await CheckSystemStatusAsync();

            // Mensagem de boas vindas no log
            Log("Sistema de Limpeza Ultra inicializado.", Colors.Cyan);
            Log("Pronto para realizar análise profunda do Windows.", Colors.White);
        }

        #region System Check

        private async Task CheckSystemStatusAsync()
        {
            try
            {
                await Task.Run(() =>
                {
                    // 1. Detect OS
                    string osName = "Windows";
                    var os = Environment.OSVersion;
                    if (os.Version.Major == 10)
                    {
                        osName = os.Version.Build >= 22000 ? "Windows 11" : "Windows 10";
                    }
                    
                    // 2. Drive C Info
                    var drive = new DriveInfo("C");
                    long free = drive.AvailableFreeSpace;
                    long total = drive.TotalSize;
                    long used = total - free;
                    double percent = (double)used / total * 100;

                    Dispatcher.Invoke(() =>
                    {
                        OsVersionText.Text = $"{osName} ({os.Version.Build})";
                        DriveUsageBar.Value = percent;
                        DriveFreeSpaceText.Text = $"{FormatBytes(free)} Livres";
                        DriveUsageBar.ToolTip = $"USADO: {FormatBytes(used)} / TOTAL: {FormatBytes(total)}";
                    });
                });
            }
            catch (Exception ex)
            {
                Dispatcher.Invoke(() => Log($"Erro ao verificar sistema: {ex.Message}", Colors.Red));
            }
        }

        #endregion

        #region Analysis Logic

        private async void BtnAnalyze_Click(object sender, RoutedEventArgs e)
        {
            if (_isWorking) return;
            if (App.UltraCleaner == null)
            {
                Log("Serviço de limpeza não disponível.", Colors.Red);
                return;
            }

            try
            {
                // Telemetry
                App.TelemetryService?.TrackEvent("CLEANUP_ANALYZE", "All", "Start", forceFlush: true);

                _isWorking = true;
                UpdateUiState(true);
                _categories.Clear();
                _logs.Clear();
                _lastAnalysis = null;
                
                // Iniciar operação prioritária
                GlobalProgressService.Instance.StartOperation("Análise de Limpeza", isPriority: true);
                
                Log("Iniciando análise profunda e REAL do sistema...", Colors.Cyan);
                EmptyStatePanel.Visibility = Visibility.Collapsed;

                var progress = new Progress<VoltrisOptimizer.Services.AnalysisProgress>(p => 
                {
                    ReportProgress(p.PercentComplete, $"Analisando: {p.CurrentItem}...");
                });

                // CORREÇÃO: Executar análise em background thread via Task.Run para não bloquear a UI
                // O AnalyzeAllAsync contém código síncrono entre seus awaits que pode travar a UI thread se chamado diretamente
                _lastAnalysis = await Task.Run(() => App.UltraCleaner.AnalyzeAllAsync(progress));

                // Popular UI baseada nos resultados reais
                if (_lastAnalysis != null)
                {
                    foreach(var catAnalysis in _lastAnalysis.Categories)
                    {
                        var uiCat = new CleanupCategory(
                            catAnalysis.Name, 
                            $"{catAnalysis.Items.Count} itens encontrados nesta categoria", 
                            catAnalysis.Icon, 
                            catAnalysis.TotalSize, 
                            true) // Sempre marcado por padrão
                        {
                            UnderlyingAnalysis = catAnalysis,
                            AnalysisComplete = true // Análise concluída, exibir tamanho real (mesmo que 0)
                        };
                        
                        uiCat.PropertyChanged += (s, ev) => 
                        {
                            if (ev.PropertyName == nameof(CleanupCategory.IsSelected))
                            {
                                // Sincronizar seleção com os itens internos do serviço
                                foreach(var item in catAnalysis.Items)
                                {
                                    item.IsSelected = uiCat.IsSelected;
                                }
                                UpdateSummary();
                            }
                        };
                        
                        // Selecionar automaticamente todos os itens com tamanho > 0
                        foreach(var item in catAnalysis.Items)
                        {
                            item.IsSelected = item.Size > 0; // Selecionar apenas itens que tenham tamanho > 0
                        }
                        
                        _categories.Add(uiCat);
                    }
                    
                    // Atualizar o estado do checkbox SelectAll e garantir que o botão de limpeza seja habilitado
                    SelectAllCheck.IsChecked = _categories.All(c => c.IsSelected);
                                    
                    // Forçar atualização do resumo para garantir que o botão de limpeza seja habilitado
                    UpdateSummary();
                }

                UpdateSummary();
                Log($"Análise concluída com sucesso.", Colors.LightGreen);
                if (_lastAnalysis != null)
                    Log($"Total de dados redundantes detectados: {FormatBytes(_lastAnalysis.TotalReclaimable)}", Colors.Cyan);
                
                // Telemetry End
                App.TelemetryService?.TrackEvent("CLEANUP_ANALYZE_END", "All", "End", success: true, metadata: new { TotalBytes = _lastAnalysis?.TotalReclaimable ?? 0 }, forceFlush: true);
            }
            catch (Exception ex)
            {
                Log($"Falha crítica na análise: {ex.Message}", Colors.Red);
            }
            finally
            {
                _isWorking = false;
                UpdateUiState(false);
                
                // Mostrar 100% e mensagem de conclusão na barra global
                GlobalProgressService.Instance.CompleteOperation("✅ Análise Concluída!");
                            
                if (_categories.Count == 0)
                {
                    EmptyStatePanel.Visibility = Visibility.Visible;
                    Log("Nenhum arquivo desnecessário encontrado. Seu sistema está limpo!", Colors.LightGreen);
                }
                else
                {
                    UpdateSummary();
                }
            }
        }

        #endregion

        #region Cleaning Logic

        private async void BtnClean_Click(object sender, RoutedEventArgs e)
        {
            if (App.UltraCleaner == null || _lastAnalysis == null) return;

            // Obter todos os itens selecionados de todas as categorias
            var selectedItems = _categories
                .Where(c => c.IsSelected && c.UnderlyingAnalysis != null)
                .SelectMany(c => c.UnderlyingAnalysis!.Items)
                .Where(i => i.IsSelected)
                .ToList();

            if (selectedItems.Count == 0)
            {
                Log("Nenhum item selecionado para limpeza.", Colors.Yellow);
                return;
            }

            long totalSize = selectedItems.Sum(i => i.Size);

            var result = UI.Controls.ModernMessageBox.Show(
                $"Você selecionou {selectedItems.Count} itens para limpeza profunda.\n\n" +
                $"Tamanho total estimado: {FormatBytes(totalSize)}\n\n" +
                $"Deseja prosseguir com a remoção permanente?",
                "Confirmação de Limpeza Ultra",
                MessageBoxButton.YesNo,
                MessageBoxImage.Warning);

            if (result != MessageBoxResult.Yes) return;

            // Telemetry
            App.TelemetryService?.TrackEvent("CLEANUP_EXECUTE", "Selected", "Start", metadata: new { Items = selectedItems.Count, Bytes = totalSize }, forceFlush: true);

            _isWorking = true;
            UpdateUiState(true);
            
            // Iniciar operação prioritária
            GlobalProgressService.Instance.StartOperation("Limpeza Profunda", isPriority: true);
            
            try
            {
                Log("Iniciando processo de limpeza profunda...", Colors.Yellow);
                
                var progress = new Progress<VoltrisOptimizer.Services.CleanupProgress>(p => 
                {
                    ReportProgress(p.PercentComplete, p.CurrentItem);
                });

                // Antes de limpar, vamos registrar quais itens estão sendo enviados para limpeza
                Log($"Enviando {selectedItems.Count} itens para limpeza com total de {FormatBytes(totalSize)}", Colors.Cyan);
                foreach(var item in selectedItems.Take(5)) // Mostrar os primeiros 5 itens para debug
                {
                    Log($"Item para limpeza: {item.Name} - {FormatBytes(item.Size)}", Colors.Gray);
                }
                
                // CORREÇÃO: Executar limpeza em background thread via Task.Run para não bloquear a UI
                var cleanResult = await Task.Run(() => App.UltraCleaner.CleanSelectedAsync(selectedItems, progress));
                
                if (cleanResult.Success)
                {
                    Log("==========================================", Colors.Gray);
                    Log("LIMPEZA ULTRA CONCLUÍDA COM SUCESSO!", Colors.LightGreen);
                    Log($"Espaço total recuperado: {FormatBytes(cleanResult.SpaceCleaned)}", Colors.Cyan);
                    
                    // Telemetry End
                    App.TelemetryService?.TrackEvent("CLEANUP_EXECUTE_END", "Selected", "End", success: true, metadata: new { CleanedBytes = cleanResult.SpaceCleaned }, forceFlush: true);
                }
                else
                {
                    Log("Limpeza concluída com algumas falhas (arquivos em uso).", Colors.Orange);
                    foreach(var err in cleanResult.Errors) Log($"• {err}", Colors.Red);
                }

                // Mostrar 100% e mensagem de conclusão ANTES de limpar a UI
                
                // Limpar resultados da UI após limpeza
                _categories.Clear();
                _lastAnalysis = null;
                EmptyStatePanel.Visibility = Visibility.Visible;

                await CheckSystemStatusAsync(); // Refresh drive info
            }
            catch (Exception ex)
            {
                Log($"Erro crítico durante limpeza: {ex.Message}", Colors.Red);
            }
            finally
            {
                _isWorking = false;
                UpdateUiState(false);
                UpdateSummary();
                
                // Completar operação (mostra mensagem por 2s e depois limpa a barra)
                GlobalProgressService.Instance.CompleteOperation("✅ Limpeza Concluída!");
            }
        }

        #endregion

        #region Helpers

        private void UpdateUiState(bool working)
        {
            // Durante a análise ou limpeza, desabilitar botões de ação
            BtnAnalyze.IsEnabled = !working;
            BtnClean.IsEnabled = !working && _categories.Any(c => c.IsSelected);
            CategoriesList.IsEnabled = !working;
            SelectAllCheck.IsEnabled = !working;
                    
            if (working)
            {
                BtnAnalyze.Opacity = 0.5;
                BtnClean.Opacity = 0.5;
            }
            else
            {
                BtnAnalyze.Opacity = 1.0;
                // BtnClean opacity is handled in UpdateSummary
            }
        }

        private void UpdateSummary()
        {
            var selectedCategories = _categories.Where(c => c.IsSelected).ToList();
            
            // Somar apenas os itens selecionados dentro das categorias selecionadas
            long totalSize = 0;
            int totalItems = 0;

            foreach(var cat in selectedCategories)
            {
                if (cat.UnderlyingAnalysis != null)
                {
                    var items = cat.UnderlyingAnalysis.Items.Where(i => i.IsSelected).ToList();
                    totalSize += items.Sum(i => i.Size);
                    totalItems += items.Count;
                }
                else
                {
                    // Fallback
                    totalSize += cat.RawSize;
                    totalItems += 1;
                }
            }
            
            // SelectedCountText.Text = totalItems.ToString();
            // SelectedSizeText.Text = FormatBytes(totalSize);
            
            BtnClean.IsEnabled = !_isWorking && totalItems > 0;
            BtnClean.Opacity = BtnClean.IsEnabled ? 1.0 : 0.5;
        }

        private void ReportProgress(double percent, string msg)
        {
            // Usar o serviço global de progresso (barra inferior do programa)
            GlobalProgressService.Instance.UpdateProgress((int)percent, msg);
        }

        private void Log(string msg, Color color)
        {
            _logs.Add(new LogEntry { Message = $"[{DateTime.Now:HH:mm:ss}] {msg}", Color = new SolidColorBrush(color) });
            if (_logs.Count > 100) _logs.RemoveAt(0);
            LogScrollViewer.ScrollToEnd();
        }

        private static string FormatBytes(long bytes)
        {
            string[] sizes = { "B", "KB", "MB", "GB", "TB" };
            double len = bytes;
            int order = 0;
            while (len >= 1024 && order < sizes.Length - 1)
            {
                order++;
                len /= 1024;
            }
            return $"{len:0.#} {sizes[order]}";
        }

        private void SelectAllCheck_Checked(object sender, RoutedEventArgs e)
        {
            foreach(var c in _categories) c.IsSelected = true;
            UpdateSummary();
        }

        private void SelectAllCheck_Unchecked(object sender, RoutedEventArgs e)
        {
            foreach(var c in _categories) c.IsSelected = false;
            UpdateSummary();
        }

        #endregion
    }

    // View Models Simples
    public class CleanupCategory : INotifyPropertyChanged
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Icon { get; set; }
        public long RawSize { get; set; }

        // Quando true, a análise terminou e RawSize é o valor real (mesmo que seja 0)
        private bool _analysisComplete = false;
        public bool AnalysisComplete 
        { 
            get => _analysisComplete; 
            set { _analysisComplete = value; OnPropertyChanged(nameof(SizeText)); OnPropertyChanged(nameof(SizeColor)); } 
        }

        public string SizeText => (!_analysisComplete && RawSize == 0) ? "Calculando..." : FormatBytes(RawSize);
        public Brush SizeColor => RawSize > 1024 * 1024 * 500 
            ? new SolidColorBrush(Color.FromRgb(255, 75, 107))   // Neon Red se > 500MB
            : new SolidColorBrush(Color.FromRgb(0, 255, 136));   // Neon Green
        
        // Referência aos dados reais do serviço
        public VoltrisOptimizer.Services.CategoryAnalysis? UnderlyingAnalysis { get; set; }

        private bool _isSelected;
        public bool IsSelected 
        { 
            get => _isSelected; 
            set { _isSelected = value; OnPropertyChanged(nameof(IsSelected)); } 
        }

        // Status UX
        private string _badgeText = "AÇÃO NECESSÁRIA";
        public string BadgeText 
        { 
            get => _badgeText; 
            set { _badgeText = value; OnPropertyChanged(nameof(BadgeText)); } 
        }
        
        // Vermelho para indicar ação necessária
        private Brush _badgeBg = new SolidColorBrush(Color.FromRgb(220, 38, 38));
        public Brush BadgeBackground
        {
            get => _badgeBg;
            set { _badgeBg = value; OnPropertyChanged(nameof(BadgeBackground)); }
        }

        public Brush BadgeForeground { get; set; } = Brushes.White;

        public CleanupCategory(string name, string desc, string icon, long size, bool selected)
        {
            Name = name;
            Description = desc;
            Icon = icon;
            RawSize = size;
            IsSelected = selected;
        }

        public event PropertyChangedEventHandler? PropertyChanged;
        protected void OnPropertyChanged(string name) => PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        
        private static string FormatBytes(long bytes)
        {
            string[] sizes = { "B", "KB", "MB", "GB", "TB" };
            double len = bytes;
            int order = 0;
            while (len >= 1024 && order < sizes.Length - 1)
            {
                order++;
                len /= 1024;
            }
            return $"{len:0.#} {sizes[order]}";
        }
    }

    public class LogEntry
    {
        public string Message { get; set; } = "";
        public Brush Color { get; set; } = Brushes.Gray;
    }
}
