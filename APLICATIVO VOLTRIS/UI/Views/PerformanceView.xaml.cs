using System;
using System.Windows;
using System.Windows.Controls;
using VoltrisOptimizer.UI.ViewModels.Performance.Models;

namespace VoltrisOptimizer.UI.Views
{
    /// <summary>
    /// VOLTRIS ULTRA PERFORMANCE - Interface Inteligente
    /// Code-behind limpo - toda lógica está no ViewModel
    /// </summary>
    public partial class PerformanceView : UserControl
    {
        public PerformanceView()
        {
            InitializeComponent();
            Loaded += PerformanceView_Loaded;
        }
        
        private void PerformanceView_Loaded(object sender, RoutedEventArgs e)
        {
            // ViewModel carrega os dados automaticamente
            if (DataContext is ViewModels.PerformanceViewModel vm)
            {
                vm.LoadDataAsync();
            }
        }
    }
}
