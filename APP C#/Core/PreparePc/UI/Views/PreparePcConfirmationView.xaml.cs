using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Media;
using VoltrisOptimizer.Core.PreparePc.Interfaces;
using VoltrisOptimizer.Utils;

namespace VoltrisOptimizer.Core.PreparePc.UI.Views
{
    /// <summary>
    /// Modal de confirmação para Prepare PC
    /// </summary>
    public partial class PreparePcConfirmationView : UserControl
    {
        private readonly PreparePcManager _manager;
        private readonly PreCheckResult? _preCheckResult;
        private PreparePcOptions _options = new();
        
        /// <summary>
        /// Evento disparado quando o usuário escolhe prosseguir
        /// </summary>
        public event EventHandler<PreparePcOptions>? OnProceed;
        
        /// <summary>
        /// Evento disparado quando o usuário escolhe pular
        /// </summary>
        public event EventHandler? OnSkip;
        
        /// <summary>
        /// Evento disparado quando o usuário escolhe agendar
        /// </summary>
        public event EventHandler? OnSchedule;
        
        public PreparePcConfirmationView()
        {
            InitializeComponent();
            _manager = new PreparePcManager(App.LoggingService!);
            
            Loaded += async (s, e) =>
            {
                // Desativar scroll do parent para garantir que o Viewbox funcione (fit-to-screen)
                var scrollViewer = FindParent<ScrollViewer>(this);
                if (scrollViewer != null)
                {
                    scrollViewer.VerticalScrollBarVisibility = ScrollBarVisibility.Disabled;
                    scrollViewer.HorizontalScrollBarVisibility = ScrollBarVisibility.Disabled;
                }

                await LoadPreChecksAsync();
            };
        }

        private T? FindParent<T>(DependencyObject child) where T : DependencyObject
        {
            DependencyObject parentObject = VisualTreeHelper.GetParent(child);
            if (parentObject == null) return null;
            if (parentObject is T parent) return parent;
            return FindParent<T>(parentObject);
        }
        
        public PreparePcConfirmationView(PreCheckResult preCheckResult) : this()
        {
            _preCheckResult = preCheckResult;
        }
        
        private async System.Threading.Tasks.Task LoadPreChecksAsync()
        {
            try
            {
                // O método original carregava warnings. Na nova UI simplificada, 
                // mantemos apenas a lógica de verificação se pode prosseguir.
                var result = _preCheckResult ?? await _manager.RunPreChecksAsync();
                
                if (!result.CanProceed)
                {
                    MessageBox.Show("Aviso: Alguns pré-requisitos não foram atendidos.\n\n" + string.Join("\n", result.Errors), 
                        "Aviso de Sistema", MessageBoxButton.OK, MessageBoxImage.Warning);
                }
            }
            catch (Exception ex)
            {
                App.LoggingService?.LogError("[PreparePc] Erro ao carregar pré-checks", ex);
            }
        }
        
        private void StandardMode_Click(object sender, RoutedEventArgs e)
        {
            _options.Mode = PreparePcMode.Recommended;
            OnProceed?.Invoke(this, _options);
        }
        
        private void AdvancedMode_Click(object sender, RoutedEventArgs e)
        {
            _options.Mode = PreparePcMode.Full;
            OnProceed?.Invoke(this, _options);
        }
        
        private void BackButton_Click(object sender, RoutedEventArgs e)
        {
            OnSkip?.Invoke(this, EventArgs.Empty);
        }
        
        // Mantendo métodos auxiliares caso sejam necessários futuramente
        private string FormatTime(int seconds)
        {
            if (seconds < 60) return $"{seconds}s";
            if (seconds < 3600) return $"{seconds / 60}min";
            return $"{seconds / 3600}h {(seconds % 3600) / 60}min";
        }
    }
}
