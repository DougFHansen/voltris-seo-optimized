using System;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Windows;
using System.Windows.Media;

namespace VoltrisOptimizer.UI.ViewModels.Performance.Models
{
    /// <summary>
    /// ViewModel para uma categoria de otimização de desempenho
    /// </summary>
    public class PerfCategoryViewModel : INotifyPropertyChanged
    {
        private bool _isExpanded;
        private string _recommendedCountText = "";

        public string Name { get; set; } = "";
        public string Icon { get; set; } = "";
        public string Description { get; set; } = "";
        public Color CategoryColor { get; set; }
        public ObservableCollection<PerfOptimizationViewModel> Optimizations { get; set; } = new();

        public bool IsExpanded
        {
            get => _isExpanded;
            set
            {
                if (_isExpanded != value)
                {
                    _isExpanded = value;
                    OnPropertyChanged(nameof(IsExpanded));
                    OnPropertyChanged(nameof(ExpandedVisibility));
                }
            }
        }

        public Visibility ExpandedVisibility => IsExpanded ? Visibility.Visible : Visibility.Collapsed;

        public string RecommendedCountText
        {
            get => _recommendedCountText;
            set
            {
                if (_recommendedCountText != value)
                {
                    _recommendedCountText = value;
                    OnPropertyChanged(nameof(RecommendedCountText));
                }
            }
        }

        public event PropertyChangedEventHandler? PropertyChanged;

        protected virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }
}

