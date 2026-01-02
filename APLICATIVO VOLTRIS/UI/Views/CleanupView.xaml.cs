using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.IO;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using VoltrisOptimizer;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.UI.Controls;

namespace VoltrisOptimizer.UI.Views
{
    /// <summary>
    /// VOLTRIS ULTRA CLEANER - Interface de limpeza enterprise
    /// </summary>
    public partial class CleanupView : UserControl
    {
        private bool _isCleaning = false;
        private ObservableCollection<CategoryViewModel> _categories = new();
        private System.Windows.Threading.DispatcherTimer? _statusUpdateTimer;

        public CleanupView()
        {
            InitializeComponent();
            CategoriesPanel.ItemsSource = _categories;
            
            Loaded += async (s, e) => 
            {
                await UpdateQuickActionsAsync();
                CheckAnalysisStatus();
                StartStatusUpdateTimer();
            };
            
            Unloaded += (s, e) =>
            {
                StopStatusUpdateTimer();
            };
        }
        
        private void StartStatusUpdateTimer()
        {
            _statusUpdateTimer = new System.Windows.Threading.DispatcherTimer
            {
                Interval = TimeSpan.FromMilliseconds(500)
            };
            _statusUpdateTimer.Tick += (s, e) => CheckAnalysisStatus();
            _statusUpdateTimer.Start();
        }
        
        private void StopStatusUpdateTimer()
        {
            _statusUpdateTimer?.Stop();
            _statusUpdateTimer = null;
        }
        
        private void CheckAnalysisStatus()
        {
            if (App.UltraCleaner == null) return;
            
            var status = App.UltraCleaner.GetAnalysisStatus();
            
            if (status.IsAnalyzing)
            {
                UltraAnalyzeButton.Content = "⏹️ Cancelar";
                UltraProgressPanel.Visibility = Visibility.Visible;
                UltraProgressText.Text = $"{status.CurrentCategory}: {status.CurrentItem}";
                UltraProgress.Value = status.PercentComplete;
                UltraCleanButton.IsEnabled = false;
                
                // Atualizar progressbar global do footer
                GlobalProgressService.Instance.UpdateProgress(
                    (int)status.PercentComplete,
                    $"Análise: {status.CurrentCategory} - {status.CurrentItem}"
                );
            }
            else
            {
                UltraAnalyzeButton.Content = "🔍 Analisar";
                UltraProgressPanel.Visibility = Visibility.Collapsed;
                
                if (status.LastAnalysis != null && _categories.Count == 0)
                {
                    DisplayAnalysisResults(status.LastAnalysis);
                    GlobalProgressService.Instance.ResetProgress();
                }
            }
        }

        #region Ultra Cleaner

        private async void UltraAnalyzeButton_Click(object sender, RoutedEventArgs e)
        {
            if (App.UltraCleaner == null)
            {
                ModernMessageBox.Show("Serviço Ultra Cleaner não disponível.", "Erro", MessageBoxButton.OK, MessageBoxImage.Error);
                return;
            }

            var status = App.UltraCleaner.GetAnalysisStatus();
            
            if (status.IsAnalyzing)
            {
                // Cancelar análise em andamento
                App.UltraCleaner.CancelAnalysis();
                GlobalProgressService.Instance.ResetProgress();
                return;
            }

            try
            {
                _categories.Clear();
                UltraSummary.Visibility = Visibility.Collapsed;
                CategoriesPanel.Visibility = Visibility.Collapsed;
                UltraCleanButton.IsEnabled = false;

                // Atualizar progressbar global
                GlobalProgressService.Instance.UpdateProgress(0, "Iniciando análise do sistema...");

                // Iniciar análise em background (continua mesmo se mudar de página)
                await App.UltraCleaner.StartAnalysisAsync();
                
                // Resetar após conclusão
                GlobalProgressService.Instance.ResetProgress();
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[UltraClean] Erro ao iniciar análise: {ex.Message}");
                ModernMessageBox.Show($"Erro ao iniciar análise: {ex.Message}", "Erro", MessageBoxButton.OK, MessageBoxImage.Error);
                GlobalProgressService.Instance.ResetProgress();
            }
        }

        private void DisplayAnalysisResults(UltraCleanAnalysis analysis)
        {
            Dispatcher.Invoke(() =>
            {
                _categories.Clear();

                int totalItems = 0;
                int selectedItems = 0;

                foreach (var category in analysis.Categories)
                {
                    var categoryVm = new CategoryViewModel
                    {
                        Name = category.Name,
                        Icon = category.Icon,
                        TotalSize = category.TotalSize,
                        TotalSizeText = FormatBytes(category.TotalSize),
                        IsSelected = category.Items.All(i => i.IsSelected)
                    };

                    foreach (var item in category.Items)
                    {
                        if (item.Size > 0)
                        {
                            var itemVm = new ItemViewModel
                            {
                                Name = item.Name,
                                Description = item.Description,
                                Size = item.Size,
                                SizeText = FormatBytes(item.Size),
                                IsSelected = item.IsSelected,
                                IsSafe = item.IsSafe,
                                SafetyText = item.IsSafe ? "SEGURO" : "VERIFICAR",
                                SafetyColor = item.IsSafe 
                                    ? new SolidColorBrush(Color.FromRgb(16, 185, 129)) 
                                    : new SolidColorBrush(Color.FromRgb(245, 158, 11)),
                                CleanAction = item.CleanAction
                            };

                            itemVm.PropertyChanged += (s, e) => UpdateSummary();
                            categoryVm.Items.Add(itemVm);
                            totalItems++;
                            if (item.IsSelected) selectedItems++;
                        }
                    }

                    categoryVm.ItemsCountText = $"{categoryVm.Items.Count} itens";
                    categoryVm.PropertyChanged += (s, e) => 
                    {
                        if (e.PropertyName == nameof(CategoryViewModel.IsSelected))
                        {
                            foreach (var item in categoryVm.Items)
                                item.IsSelected = categoryVm.IsSelected;
                        }
                    };

                    if (categoryVm.Items.Count > 0)
                        _categories.Add(categoryVm);
                }

                // Update summary - CALCULAR TAMANHO REAL DOS ITENS SELECIONADOS
                long selectedSize = _categories.Sum(c => c.Items.Where(i => i.IsSelected).Sum(i => i.Size));
                
                TotalCategoriesText.Text = _categories.Count.ToString();
                TotalItemsText.Text = totalItems.ToString();
                SelectedItemsText.Text = selectedItems.ToString();
                TotalSizeText.Text = FormatBytes(selectedSize); // Usar tamanho real dos selecionados

                UltraSummary.Visibility = Visibility.Visible;
                CategoriesPanel.Visibility = Visibility.Visible;
                UltraCleanButton.IsEnabled = true;
            });
        }

        private void UpdateSummary()
        {
            Dispatcher.Invoke(() =>
            {
                int totalItems = _categories.Sum(c => c.Items.Count);
                int selectedItems = _categories.Sum(c => c.Items.Count(i => i.IsSelected));
                long selectedSize = _categories.Sum(c => c.Items.Where(i => i.IsSelected).Sum(i => i.Size));
                int selectedCategories = _categories.Count(c => c.IsSelected);
                
                // Animações suaves para atualização em tempo real
                AnimateTextChange(TotalItemsText, totalItems.ToString());
                AnimateTextChange(SelectedItemsText, selectedItems.ToString());
                AnimateTextChange(TotalSizeText, FormatBytes(selectedSize));
                AnimateTextChange(TotalCategoriesText, _categories.Count.ToString());
            });
        }

        private void AnimateTextChange(TextBlock textBlock, string newValue)
        {
            if (textBlock.Text == newValue) return;
            
            // Animação de fade out/in suave
            var fadeOut = new System.Windows.Media.Animation.DoubleAnimation
            {
                From = 1.0,
                To = 0.3,
                Duration = TimeSpan.FromMilliseconds(150)
            };
            
            var fadeIn = new System.Windows.Media.Animation.DoubleAnimation
            {
                From = 0.3,
                To = 1.0,
                Duration = TimeSpan.FromMilliseconds(150)
            };
            
            fadeOut.Completed += (s, e) =>
            {
                textBlock.Text = newValue;
                textBlock.BeginAnimation(UIElement.OpacityProperty, fadeIn);
            };
            
            textBlock.BeginAnimation(UIElement.OpacityProperty, fadeOut);
        }

        private async void UltraCleanButton_Click(object sender, RoutedEventArgs e)
        {
            if (_isCleaning) return;

            var selectedItems = _categories
                .SelectMany(c => c.Items)
                .Where(i => i.IsSelected)
                .ToList();

            if (selectedItems.Count == 0)
            {
                ModernMessageBox.Show("Selecione pelo menos um item para limpar.", "Aviso", MessageBoxButton.OK, MessageBoxImage.Warning);
                return;
            }

            // Calcular tamanho esperado dos itens selecionados
            long expectedSize = selectedItems.Sum(i => i.Size);
            
            var confirm = ModernMessageBox.Show(
                $"Deseja limpar {selectedItems.Count} itens selecionados?\n\nTamanho estimado: {FormatBytes(expectedSize)}",
                "Confirmar Limpeza",
                MessageBoxButton.YesNo,
                MessageBoxImage.Question);

            if (confirm != MessageBoxResult.Yes) return;

            try
            {
                _isCleaning = true;
                UltraCleanButton.IsEnabled = false;
                UltraCleanButton.Content = "⏳ Limpando...";
                UltraProgressPanel.Visibility = Visibility.Visible;

                var itemsToClean = selectedItems.Select(i => new ItemAnalysis
                {
                    Name = i.Name,
                    IsSelected = true,
                    CleanAction = i.CleanAction
                }).ToList();

                var progress = new Progress<CleanupProgress>(p =>
                {
                    UltraProgressText.Text = $"Limpando: {p.CurrentItem}";
                    UltraProgress.Value = p.PercentComplete;
                    
                    // Atualizar progressbar global do footer
                    GlobalProgressService.Instance.UpdateProgress(
                        (int)p.PercentComplete, 
                        $"Limpeza Ultra: {p.CurrentItem}"
                    );
                });

                // Iniciar progresso
                GlobalProgressService.Instance.UpdateProgress(0, "Iniciando Limpeza Ultra...");

                var result = await App.UltraCleaner!.CleanSelectedAsync(itemsToClean, progress);

                UltraProgressPanel.Visibility = Visibility.Collapsed;

                if (result.Success)
                {
                    // Calcular diferença entre esperado e real
                    long difference = expectedSize - result.SpaceCleaned;
                    double percentageCleaned = expectedSize > 0 ? (result.SpaceCleaned * 100.0 / expectedSize) : 0;
                    
                    // Mostrar notificação profissional com dados reais e comparação
                    var message = $"✅ Limpeza Ultra Concluída!\n\n" +
                                  $"📊 Estimado: {FormatBytes(expectedSize)}\n" +
                                  $"📦 Liberado: {FormatBytes(result.SpaceCleaned)} ({percentageCleaned:F1}%)\n" +
                                  $"🧹 Itens Limpos: {result.ItemsCleaned}\n" +
                                  $"⚠️ Erros: {result.Errors.Count}";
                    
                    if (difference > 1024 * 1024) // Diferença > 1MB
                    {
                        message += $"\n\n💡 Nota: Alguns arquivos podem ter sido modificados\n" +
                                   $"ou já estavam parcialmente limpos.";
                    }
                    
                    if (result.SpaceCleaned > 0)
                    {
                        ModernMessageBox.Show(message, "Limpeza Concluída", MessageBoxButton.OK, MessageBoxImage.Information);
                    }
                    else
                    {
                        ModernMessageBox.Show(
                            "Limpeza concluída, mas nenhum espaço foi liberado.\n\n" +
                            "Os itens selecionados já estavam limpos ou foram modificados\n" +
                            "por outro processo durante a análise.",
                            "Limpeza Concluída",
                            MessageBoxButton.OK,
                            MessageBoxImage.Information);
                    }
                    
                    new ToastService().Show("Limpeza Ultra Concluída", $"Liberados: {FormatBytes(result.SpaceCleaned)}");
                    
                    // Add to history
                    App.HistoryService?.AddHistoryEntry(new OptimizationHistory
                    {
                        ActionType = "Ultra Clean",
                        Description = $"Limpeza profunda - {result.ItemsCleaned} itens",
                        SpaceFreed = result.SpaceCleaned,
                        Success = true
                    });

                    // Refresh analysis
                    _categories.Clear();
                    CategoriesPanel.Visibility = Visibility.Collapsed;
                    UltraSummary.Visibility = Visibility.Collapsed;
                    UltraCleanButton.IsEnabled = false;
                    
                    await UpdateQuickActionsAsync();
                    
                    // Resetar progresso global
                    GlobalProgressService.Instance.ResetProgress();
                }
                else
                {
                    var errorMessage = $"Limpeza concluída com alguns erros:\n\n" +
                                       $"✅ Itens Limpos: {result.ItemsCleaned}\n" +
                                       $"📦 Espaço Liberado: {FormatBytes(result.SpaceCleaned)}\n" +
                                       $"❌ Erros: {result.Errors.Count}\n\n" +
                                       $"Primeiros erros:\n{string.Join("\n", result.Errors.Take(3))}";
                    
                    ModernMessageBox.Show(errorMessage, "Aviso", MessageBoxButton.OK, MessageBoxImage.Warning);
                    
                    // Resetar progresso global
                    GlobalProgressService.Instance.ResetProgress();
                }
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[UltraClean] Erro durante limpeza: {ex.Message}");
                ModernMessageBox.Show($"Erro durante a limpeza: {ex.Message}", "Erro", MessageBoxButton.OK, MessageBoxImage.Error);
                GlobalProgressService.Instance.ResetProgress();
            }
            finally
            {
                _isCleaning = false;
                UltraCleanButton.Content = "🧹 Limpar";
                UltraCleanButton.IsEnabled = _categories.Any();
            }
        }

        #endregion

        #region Quick Actions

        private async Task UpdateQuickActionsAsync()
        {
            try
            {
                // Temp files size
                var tempPath = Path.GetTempPath();
                var winTemp = @"C:\Windows\Temp";
                long tempSize = GetDirectorySize(tempPath) + (Directory.Exists(winTemp) ? GetDirectorySize(winTemp) : 0);
                TempSizeText.Text = tempSize > 0 ? FormatBytes(tempSize) : "Limpo";

                // Browser cache size
                var localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
                var browserPaths = new[]
                {
                    Path.Combine(localAppData, "Google", "Chrome", "User Data", "Default", "Cache"),
                    Path.Combine(localAppData, "Microsoft", "Edge", "User Data", "Default", "Cache"),
                };
                long browserSize = browserPaths.Where(Directory.Exists).Sum(GetDirectorySize);
                BrowserSizeText.Text = browserSize > 0 ? FormatBytes(browserSize) : "Limpo";

                // Game cache size
                var gamePaths = new[]
                {
                    Path.Combine(localAppData, "NVIDIA", "DXCache"),
                    Path.Combine(localAppData, "AMD", "DxCache"),
                    Path.Combine(localAppData, "D3DSCache"),
                };
                long gameSize = gamePaths.Where(Directory.Exists).Sum(GetDirectorySize);
                GameSizeText.Text = gameSize > 0 ? FormatBytes(gameSize) : "Limpo";

                await Task.CompletedTask;
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogWarning($"[UltraClean] Erro ao atualizar quick actions: {ex.Message}");
            }
        }

        private async void QuickCleanTemp_Click(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            await QuickCleanAsync("Arquivos Temporários", async () =>
            {
                long cleaned = 0;
                
                // User temp
                cleaned += DeleteFilesInDirectory(Path.GetTempPath(), "*", 1);
                
                // Windows temp
                if (Directory.Exists(@"C:\Windows\Temp"))
                    cleaned += DeleteFilesInDirectory(@"C:\Windows\Temp", "*", 1);

                return cleaned;
            });
        }

        private async void QuickCleanBrowser_Click(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            await QuickCleanAsync("Cache de Navegadores", async () =>
            {
                long cleaned = 0;
                var localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
                
                var browserPaths = new[]
                {
                    Path.Combine(localAppData, "Google", "Chrome", "User Data", "Default", "Cache"),
                    Path.Combine(localAppData, "Microsoft", "Edge", "User Data", "Default", "Cache"),
                    Path.Combine(localAppData, "BraveSoftware", "Brave-Browser", "User Data", "Default", "Cache"),
                };

                foreach (var path in browserPaths.Where(Directory.Exists))
                    cleaned += DeleteDirectorySafe(path);

                return cleaned;
            });
        }

        private async void QuickCleanGames_Click(object sender, System.Windows.Input.MouseButtonEventArgs e)
        {
            await QuickCleanAsync("Shader Cache de Jogos", async () =>
            {
                long cleaned = 0;
                var localAppData = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);
                
                var gamePaths = new[]
                {
                    Path.Combine(localAppData, "NVIDIA", "DXCache"),
                    Path.Combine(localAppData, "NVIDIA", "GLCache"),
                    Path.Combine(localAppData, "AMD", "DxCache"),
                    Path.Combine(localAppData, "D3DSCache"),
                };

                foreach (var path in gamePaths.Where(Directory.Exists))
                    cleaned += DeleteDirectorySafe(path);

                return cleaned;
            });
        }

        private async Task QuickCleanAsync(string name, Func<Task<long>> cleanAction)
        {
            try
            {
                var confirm = ModernMessageBox.Show(
                    $"Limpar {name}?",
                    "Confirmar",
                    MessageBoxButton.YesNo,
                    MessageBoxImage.Question);

                if (confirm != MessageBoxResult.Yes) return;

                var cleaned = await cleanAction();

                if (cleaned > 0)
                {
                    new ToastService().Show("Limpeza Rápida", $"{name}: {FormatBytes(cleaned)} liberados");
                    
                    App.HistoryService?.AddHistoryEntry(new OptimizationHistory
                    {
                        ActionType = "Limpeza Rápida",
                        Description = name,
                        SpaceFreed = cleaned,
                        Success = true
                    });
                }
                else
                {
                    new ToastService().Show("Limpeza Rápida", $"{name}: Já estava limpo!");
                }

                await UpdateQuickActionsAsync();
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError($"[QuickClean] Erro: {ex.Message}");
                ModernMessageBox.Show($"Erro: {ex.Message}", "Erro", MessageBoxButton.OK, MessageBoxImage.Error);
            }
        }

        #endregion

        #region Helpers

        private long GetDirectorySize(string path)
        {
            if (!Directory.Exists(path)) return 0;

            long size = 0;
            try
            {
                foreach (var file in EnumerateFilesSafe(path))
                {
                    try { size += new FileInfo(file).Length; }
                    catch { }
                }
            }
            catch { }

            return size;
        }

        private IEnumerable<string> EnumerateFilesSafe(string path)
        {
            var stack = new Stack<string>();
            stack.Push(path);

            while (stack.Count > 0)
            {
                var dir = stack.Pop();

                string[] files = Array.Empty<string>();
                try { files = Directory.GetFiles(dir); }
                catch { }

                foreach (var file in files)
                    yield return file;

                try
                {
                    foreach (var subDir in Directory.GetDirectories(dir))
                        stack.Push(subDir);
                }
                catch { }
            }
        }

        private long DeleteDirectorySafe(string path)
        {
            if (!Directory.Exists(path)) return 0;

            long deleted = 0;
            try
            {
                foreach (var file in EnumerateFilesSafe(path))
                {
                    try
                    {
                        var size = new FileInfo(file).Length;
                        File.SetAttributes(file, FileAttributes.Normal);
                        File.Delete(file);
                        deleted += size;
                    }
                    catch { }
                }
            }
            catch { }

            return deleted;
        }

        private long DeleteFilesInDirectory(string path, string pattern, int keepDays)
        {
            if (!Directory.Exists(path)) return 0;

            long deleted = 0;
            var cutoff = DateTime.Now.AddDays(-keepDays);

            try
            {
                foreach (var file in Directory.GetFiles(path, pattern, SearchOption.AllDirectories))
                {
                    try
                    {
                        var info = new FileInfo(file);
                        if (keepDays == 0 || info.LastWriteTime < cutoff)
                        {
                            var size = info.Length;
                            File.SetAttributes(file, FileAttributes.Normal);
                            File.Delete(file);
                            deleted += size;
                        }
                    }
                    catch { }
                }
            }
            catch { }

            return deleted;
        }

        private string FormatBytes(long bytes)
        {
            string[] sizes = { "B", "KB", "MB", "GB", "TB" };
            double len = bytes;
            int order = 0;
            while (len >= 1024 && order < sizes.Length - 1)
            {
                order++;
                len /= 1024;
            }
            return $"{len:0.##} {sizes[order]}";
        }

        #endregion
    }

    #region View Models

    public class CategoryViewModel : INotifyPropertyChanged
    {
        private bool _isSelected;

        public string Name { get; set; } = "";
        public string Icon { get; set; } = "";
        public long TotalSize { get; set; }
        public string TotalSizeText { get; set; } = "";
        public string ItemsCountText { get; set; } = "";
        public ObservableCollection<ItemViewModel> Items { get; set; } = new();

        public bool IsSelected
        {
            get => _isSelected;
            set
            {
                _isSelected = value;
                PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(IsSelected)));
            }
        }

        public event PropertyChangedEventHandler? PropertyChanged;
    }

    public class ItemViewModel : INotifyPropertyChanged
    {
        private bool _isSelected;

        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public long Size { get; set; }
        public string SizeText { get; set; } = "";
        public bool IsSafe { get; set; }
        public string SafetyText { get; set; } = "";
        public SolidColorBrush SafetyColor { get; set; } = new SolidColorBrush(Colors.Green);
        public Func<long>? CleanAction { get; set; }

        public bool IsSelected
        {
            get => _isSelected;
            set
            {
                _isSelected = value;
                PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(nameof(IsSelected)));
            }
        }

        public event PropertyChangedEventHandler? PropertyChanged;
    }

    #endregion
}
