using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.ComponentModel;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Input;
using System.Windows.Media;
using VoltrisOptimizer.Core.SystemIntelligenceProfiler;
using VoltrisOptimizer.Core.SystemIntelligenceProfiler.Models;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.UI.ViewModels
{
    /// <summary>
    /// ViewModel for the Professional Apply All dialog
    /// Manages state detection, optimization analysis, and execution results
    /// </summary>
    public class ApplyAllViewModel : INotifyPropertyChanged
    {
        private readonly StateDetectionEngine _stateDetector;
        private readonly IntelligentOptimizationExecutor _executor;
        private readonly ILoggingService _logger;
        private readonly ISystemProfiler _systemProfiler;
        private readonly IDecisionEngine _decisionEngine;
        private readonly VoltrisOptimizer.Core.Optimizers.OptimizationProvider _optimizationProvider;
        
        private CancellationTokenSource _cancellationTokenSource;
        private bool _isExecuting;
        private string _applyButtonText = "Apply All (Smart)";
        private double _overallProgress;
        private string _progressText = "Ready to optimize";
        private string _analysisSummary = "Analyzing system state...";
        private string _hardwareProfileText = "Detecting hardware...";
        private Brush _hardwareProfileColor = Brushes.Gray;
        private OptimizationMode _selectedExecutionMode = OptimizationMode.Smart;
        private HardwareProfile _detectedHardware;

        public ApplyAllViewModel(
            StateDetectionEngine stateDetector,
            IntelligentOptimizationExecutor executor,
            ILoggingService logger,
            ISystemProfiler systemProfiler,
            IDecisionEngine decisionEngine)
        {
            _stateDetector = stateDetector ?? throw new ArgumentNullException(nameof(stateDetector));
            _executor = executor ?? throw new ArgumentNullException(nameof(executor));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _systemProfiler = systemProfiler ?? throw new ArgumentNullException(nameof(systemProfiler));
            _decisionEngine = decisionEngine ?? throw new ArgumentNullException(nameof(decisionEngine));
            _optimizationProvider = new VoltrisOptimizer.Core.Optimizers.OptimizationProvider();

            Optimizations = new ObservableCollection<OptimizationItemViewModel>();
            ApplyAllCommand = new RelayCommand(async () => await ExecuteApplyAllAsync(), () => !_isExecuting);
            CancelCommand = new RelayCommand(CancelExecution, () => _isExecuting);
        }

        // Properties
        public ObservableCollection<OptimizationItemViewModel> Optimizations { get; }
        
        public ICommand ApplyAllCommand { get; }
        public ICommand CancelCommand { get; }

        public bool IsExecuting
        {
            get => _isExecuting;
            set
            {
                _isExecuting = value;
                OnPropertyChanged();
                OnPropertyChanged(nameof(ApplyButtonText));
                ((RelayCommand)ApplyAllCommand).RaiseCanExecuteChanged();
                ((RelayCommand)CancelCommand).RaiseCanExecuteChanged();
            }
        }

        public string ApplyButtonText => IsExecuting ? "Applying..." : "Apply All (Smart)";

        public double OverallProgress
        {
            get => _overallProgress;
            set
            {
                _overallProgress = value;
                OnPropertyChanged();
            }
        }

        public string ProgressText
        {
            get => _progressText;
            set
            {
                _progressText = value;
                OnPropertyChanged();
            }
        }

        public string AnalysisSummary
        {
            get => _analysisSummary;
            set
            {
                _analysisSummary = value;
                OnPropertyChanged();
            }
        }

        public string HardwareProfileText
        {
            get => _hardwareProfileText;
            set
            {
                _hardwareProfileText = value;
                OnPropertyChanged();
            }
        }

        public Brush HardwareProfileColor
        {
            get => _hardwareProfileColor;
            set
            {
                _hardwareProfileColor = value;
                OnPropertyChanged();
            }
        }

        public OptimizationMode SelectedExecutionMode
        {
            get => _selectedExecutionMode;
            set
            {
                _selectedExecutionMode = value;
                OnPropertyChanged();
                UpdateEstimatedTime();
            }
        }

        // Statistics
        public int TotalCount => Optimizations.Count;
        public int ToApplyCount => Optimizations.Count(x => x.IsEnabled && x.IsChecked);
        public int AlreadyAppliedCount => Optimizations.Count(x => x.Status == OptimizationItemStatus.AlreadyApplied);
        public int IncompatibleCount => Optimizations.Count(x => x.Status == OptimizationItemStatus.Incompatible);

        public string EstimatedTime => CalculateEstimatedTime();

        // Initialization
        public async Task InitializeAsync(CancellationToken ct = default)
        {
            try
            {
                _logger.Log(LogLevel.Info, LogCategory.Optimization,
                    "Initializing Professional Apply All dialog", source: "ApplyAllViewModel");

                // Step 1: System audit
                ProgressText = "Auditing system configuration...";
                var audit = await _systemProfiler.AnalyzeAsync(ct);
                
                // Step 2: Get recommendations
                ProgressText = "Generating optimization recommendations...";
                
                // Mapear perfil das configurações para o UserProfile do engine
                var currentProfile = SettingsService.Instance.Settings.IntelligentProfile;
                var userProfile = MapIntelligentProfileToUserProfile(currentProfile);
                
                var userAnswers = new UserAnswers 
                { 
                    Profile = userProfile,
                    Priority = (currentProfile == IntelligentProfileType.GamerCompetitive || currentProfile == IntelligentProfileType.GamerSinglePlayer) ? "Performance" : "Balanced"
                };

                var recommendations = _decisionEngine.Evaluate(audit.Audit, userAnswers);
                
                // Step 3: Categorize and analyze optimizations
                ProgressText = "Analyzing optimization requirements...";
                var categorized = CategorizeOptimizations(recommendations);
                
                // Step 4: Perform state detection for each category
                foreach (var group in categorized)
                {
                    ct.ThrowIfCancellationRequested();
                    
                    var state = await _stateDetector.CaptureCurrentStateAsync(group.Category, ct);
                    _detectedHardware = state.HardwareProfile;
                    
                    foreach (var opt in group.Optimizations)
                    {
                        var status = _stateDetector.AnalyzeOptimizationStatus(opt, state);
                        var itemVm = new OptimizationItemViewModel
                        {
                            Optimization = opt,
                            Status = MapStatus(status),
                            StatusIcon = GetStatusIcon(status),
                            StatusColor = GetStatusColor(status),
                            StatusDisplay = GetStatusDisplay(status),
                            StatusBadgeBackground = GetStatusBadgeBackground(status),
                            StatusBadgeForeground = GetStatusBadgeForeground(status),
                            IsEnabled = status == OptimizationStatus.NeedsApplication,
                            IsChecked = status == OptimizationStatus.NeedsApplication,
                            Description = opt.Description ?? "System optimization"
                        };
                        
                        Optimizations.Add(itemVm);
                    }
                }

                // Update hardware profile info
                UpdateHardwareProfileInfo();
                
                // Update summary
                AnalysisSummary = $"Analysis complete: {ToApplyCount} optimizations ready, " +
                                $"{AlreadyAppliedCount} already applied, {IncompatibleCount} incompatible";
                
                ProgressText = "Analysis complete";
                
                _logger.Log(LogLevel.Success, LogCategory.Optimization,
                    $"Analysis completed: {TotalCount} total, {ToApplyCount} to apply", 
                    source: "ApplyAllViewModel");
                    
                // Notify property changes for statistics
                OnPropertyChanged(nameof(TotalCount));
                OnPropertyChanged(nameof(ToApplyCount));
                OnPropertyChanged(nameof(AlreadyAppliedCount));
                OnPropertyChanged(nameof(IncompatibleCount));
                OnPropertyChanged(nameof(EstimatedTime));
            }
            catch (Exception ex)
            {
                _logger.LogError($"Failed to initialize ApplyAllViewModel: {ex.Message}", ex);
                AnalysisSummary = $"Error during analysis: {ex.Message}";
            }
        }

        // Execution
        public async Task ExecuteApplyAllAsync()
        {
            if (IsExecuting) return;

            try
            {
                IsExecuting = true;
                _cancellationTokenSource = new CancellationTokenSource();
                var ct = _cancellationTokenSource.Token;

                _logger.Log(LogLevel.Info, LogCategory.Optimization,
                    $"Starting optimization execution in {SelectedExecutionMode} mode", 
                    source: "ApplyAllViewModel");

                // Get selected optimizations
                var selected = Optimizations
                    .Where(x => x.IsEnabled && x.IsChecked)
                    .Select(x => x.Optimization)
                    .ToList();

                if (!selected.Any())
                {
                    ProgressText = "No optimizations selected for application";
                    return;
                }

                // Execute optimizations
                var result = await _executor.ApplyOptimizationsAsync(
                    selected,
                    SelectedExecutionMode,
                    ct);

                // Telemetry
                App.TelemetryService?.TrackEvent("OPTIMIZATION_EXECUTE", "SmartSummary", SelectedExecutionMode.ToString(), 
                    metadata: new { Count = selected.Count, Success = result.TotalApplied, Failed = result.TotalFailed });

                // Update UI with results
                UpdateResults(result);

                _logger.Log(LogLevel.Success, LogCategory.Optimization,
                    $"Execution completed: {result.TotalApplied} applied, {result.TotalFailed} failed",
                    source: "ApplyAllViewModel");
            }
            catch (OperationCanceledException)
            {
                // Telemetry Cancel
                App.TelemetryService?.TrackEvent("OPTIMIZATION_CANCEL", "SmartSummary", SelectedExecutionMode.ToString());

                ProgressText = "Execution cancelled by user";
                _logger.Log(LogLevel.Warning, LogCategory.Optimization, 
                    "Optimization execution cancelled", source: "ApplyAllViewModel");
            }
            catch (Exception ex)
            {
                ProgressText = $"Error: {ex.Message}";
                _logger.LogError($"Optimization execution failed: {ex.Message}", ex);
            }
            finally
            {
                IsExecuting = false;
                _cancellationTokenSource?.Dispose();
                _cancellationTokenSource = null;
            }
        }

        public void CancelExecution()
        {
            _cancellationTokenSource?.Cancel();
            ProgressText = "Cancelling execution...";
        }

        // Private methods
        private void UpdateResults(IntelligentOptimizationResult result)
        {
            OverallProgress = 100;
            ProgressText = $"Complete: {result.TotalApplied} applied, {result.TotalFailed} failed";

            // Update individual optimization statuses
            foreach (var executionResult in result.ExecutionResults)
            {
                var item = Optimizations.FirstOrDefault(x => x.Name == executionResult.OptimizationName);
                if (item != null)
                {
                    item.IsProcessing = false;
                    item.Progress = 100;
                    
                    switch (executionResult.Status)
                    {
                        case OptimizationExecutionStatus.Success:
                            item.Status = OptimizationItemStatus.Applied;
                            item.StatusIcon = "✓";
                            item.StatusColor = Brushes.Green;
                            item.StatusDisplay = "Applied";
                            item.StatusBadgeBackground = Brushes.LightGreen;
                            item.StatusBadgeForeground = Brushes.DarkGreen;
                            break;
                            
                        case OptimizationExecutionStatus.Failed:
                        case OptimizationExecutionStatus.ValidationFailedNoRollback:
                            item.Status = OptimizationItemStatus.Failed;
                            item.StatusIcon = "✗";
                            item.StatusColor = Brushes.Red;
                            item.StatusDisplay = "Failed";
                            item.StatusBadgeBackground = Brushes.LightPink;
                            item.StatusBadgeForeground = Brushes.DarkRed;
                            item.ErrorMessage = executionResult.ErrorMessage;
                            break;
                            
                        case OptimizationExecutionStatus.ValidationFailedWithRollback:
                            item.Status = OptimizationItemStatus.Rollback;
                            item.StatusIcon = "↺";
                            item.StatusColor = Brushes.Orange;
                            item.StatusDisplay = "Rolled Back";
                            item.StatusBadgeBackground = Brushes.LightYellow;
                            item.StatusBadgeForeground = Brushes.DarkOrange;
                            item.ErrorMessage = executionResult.ErrorMessage;
                            break;
                    }
                }
            }

            // Update statistics
            OnPropertyChanged(nameof(TotalCount));
            OnPropertyChanged(nameof(ToApplyCount));
            OnPropertyChanged(nameof(AlreadyAppliedCount));
            OnPropertyChanged(nameof(IncompatibleCount));
        }

        private void UpdateHardwareProfileInfo()
        {
            if (Optimizations.Any() && _detectedHardware != null)
            {
                var hardware = _detectedHardware;
                
                HardwareProfileText = hardware?.Classification.ToString() ?? "Unknown";
                HardwareProfileColor = hardware?.Classification switch
                {
                    HardwareClass.LowEnd => Brushes.Red,
                    HardwareClass.MidRange => Brushes.Orange,
                    HardwareClass.HighEnd => Brushes.Yellow,
                    HardwareClass.Workstation => Brushes.Green,
                    HardwareClass.Server => Brushes.Blue,
                    _ => Brushes.Gray
                };
            }
        }

        private void UpdateEstimatedTime()
        {
            OnPropertyChanged(nameof(EstimatedTime));
        }

        private string CalculateEstimatedTime()
        {
            var selectedCount = Optimizations.Count(x => x.IsEnabled && x.IsChecked);
            var avgTimePerOptimization = 2.5; // seconds
            
            var totalTimeSeconds = selectedCount * avgTimePerOptimization;
            
            return totalTimeSeconds switch
            {
                < 60 => $"{totalTimeSeconds:F0} seconds",
                < 3600 => $"{totalTimeSeconds / 60:F1} minutes",
                _ => $"{totalTimeSeconds / 3600:F1} hours"
            };
        }

        private OptimizationCategoryGroup[] CategorizeOptimizations(ProfilerReport report)
        {
            var groups = new Dictionary<string, OptimizationCategoryGroup>();

            foreach (var recommendation in report.Recommendations)
            {
                var optimization = _optimizationProvider.GetOptimization(recommendation);
                if (optimization == null) continue;

                var categoryName = optimization.Category?.Name ?? "General";
                if (!groups.TryGetValue(categoryName, out var group))
                {
                    group = new OptimizationCategoryGroup
                    {
                        Category = optimization.Category ?? new VoltrisOptimizer.Core.SystemIntelligenceProfiler.Models.OptimizationCategory { Name = categoryName }
                    };
                    
                    if (group.Category.RegistryKeys == null) group.Category.RegistryKeys = new List<string>();
                    if (group.Category.Services == null) group.Category.Services = new List<string>();
                    
                    groups[categoryName] = group;
                }

                // Collect technical requirements for detection
                if (optimization.TargetRegistryValues != null)
                {
                    foreach (var key in optimization.TargetRegistryValues.Keys)
                    {
                        if (!group.Category.RegistryKeys.Contains(key))
                            group.Category.RegistryKeys.Add(key);
                    }
                }

                if (optimization.TargetServiceStates != null)
                {
                    foreach (var service in optimization.TargetServiceStates.Keys)
                    {
                        if (!group.Category.Services.Contains(service))
                            group.Category.Services.Add(service);
                    }
                }

                group.Optimizations.Add(optimization);
            }

            return groups.Values.ToArray();
        }

        private OptimizationItemStatus MapStatus(OptimizationStatus status)
        {
            return status switch
            {
                OptimizationStatus.AlreadyApplied => OptimizationItemStatus.AlreadyApplied,
                OptimizationStatus.NeedsApplication => OptimizationItemStatus.Pending,
                OptimizationStatus.Incompatible => OptimizationItemStatus.Incompatible,
                OptimizationStatus.ConflictsDetected => OptimizationItemStatus.Conflict,
                OptimizationStatus.RequiresElevation => OptimizationItemStatus.RequiresAdmin,
                _ => OptimizationItemStatus.Unknown
            };
        }

        private string GetStatusIcon(OptimizationStatus status)
        {
            return status switch
            {
                OptimizationStatus.AlreadyApplied => "✓",
                OptimizationStatus.NeedsApplication => "○",
                OptimizationStatus.Incompatible => "⊘",
                OptimizationStatus.ConflictsDetected => "⚠",
                OptimizationStatus.RequiresElevation => "⚡",
                _ => "?"
            };
        }

        private Brush GetStatusColor(OptimizationStatus status)
        {
            return status switch
            {
                OptimizationStatus.AlreadyApplied => Brushes.Green,
                OptimizationStatus.NeedsApplication => Brushes.Blue,
                OptimizationStatus.Incompatible => Brushes.Red,
                OptimizationStatus.ConflictsDetected => Brushes.Orange,
                OptimizationStatus.RequiresElevation => Brushes.Purple,
                _ => Brushes.Gray
            };
        }

        private string GetStatusDisplay(OptimizationStatus status)
        {
            return status switch
            {
                OptimizationStatus.AlreadyApplied => "Applied",
                OptimizationStatus.NeedsApplication => "Pending",
                OptimizationStatus.Incompatible => "Incompatible",
                OptimizationStatus.ConflictsDetected => "Conflict",
                OptimizationStatus.RequiresElevation => "Needs Admin",
                _ => "Unknown"
            };
        }

        private Brush GetStatusBadgeBackground(OptimizationStatus status)
        {
            return status switch
            {
                OptimizationStatus.AlreadyApplied => Brushes.LightGreen,
                OptimizationStatus.NeedsApplication => Brushes.LightBlue,
                OptimizationStatus.Incompatible => Brushes.LightPink,
                OptimizationStatus.ConflictsDetected => Brushes.LightYellow,
                OptimizationStatus.RequiresElevation => Brushes.MediumPurple,
                _ => Brushes.LightGray
            };
        }

        private Brush GetStatusBadgeForeground(OptimizationStatus status)
        {
            return status switch
            {
                OptimizationStatus.AlreadyApplied => Brushes.DarkGreen,
                OptimizationStatus.NeedsApplication => Brushes.DarkBlue,
                OptimizationStatus.Incompatible => Brushes.DarkRed,
                OptimizationStatus.ConflictsDetected => Brushes.DarkOrange,
                OptimizationStatus.RequiresElevation => Brushes.Purple,
                _ => Brushes.DarkGray
            };
        }

        // INotifyPropertyChanged implementation
        public event PropertyChangedEventHandler PropertyChanged;

        private UserProfile MapIntelligentProfileToUserProfile(IntelligentProfileType profile)
        {
            return profile switch
            {
                IntelligentProfileType.GamerCompetitive => UserProfile.GamerCompetitive,
                IntelligentProfileType.GamerSinglePlayer => UserProfile.GamerSinglePlayer,
                IntelligentProfileType.WorkOffice => UserProfile.WorkOffice,
                IntelligentProfileType.CreativeVideoEditing => UserProfile.CreativeVideoEditing,
                IntelligentProfileType.DeveloperProgramming => UserProfile.DeveloperProgramming,
                IntelligentProfileType.GeneralBalanced => UserProfile.GeneralBalanced,
                IntelligentProfileType.EnterpriseSecure => UserProfile.EnterpriseSecure,
                _ => UserProfile.GeneralBalanced
            };
        }

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

        protected virtual void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }

    /// <summary>
    /// ViewModel for individual optimization items
    /// </summary>
    public class OptimizationItemViewModel : INotifyPropertyChanged
    {
        private bool _isChecked = true;
        private bool _isProcessing;
        private double _progress;
        private string _errorMessage;
        private OptimizationItemStatus _status;

        public Optimization Optimization { get; set; }
        public string Name => Optimization?.Name ?? "Unknown";
        public string Description { get; set; }
        public string StatusIcon { get; set; }
        public Brush StatusColor { get; set; }
        public string StatusDisplay { get; set; }
        public Brush StatusBadgeBackground { get; set; }
        public Brush StatusBadgeForeground { get; set; }

        public bool IsChecked
        {
            get => _isChecked;
            set
            {
                _isChecked = value;
                OnPropertyChanged();
            }
        }

        public bool IsEnabled { get; set; }
        public bool IsProcessing
        {
            get => _isProcessing;
            set
            {
                _isProcessing = value;
                OnPropertyChanged();
                OnPropertyChanged(nameof(ProgressText));
            }
        }

        public double Progress
        {
            get => _progress;
            set
            {
                _progress = value;
                OnPropertyChanged();
                OnPropertyChanged(nameof(ProgressText));
            }
        }

        public string ProgressText => IsProcessing ? $"{Progress:F0}%" : "";

        public string ErrorMessage
        {
            get => _errorMessage;
            set
            {
                _errorMessage = value;
                OnPropertyChanged();
            }
        }

        public OptimizationItemStatus Status
        {
            get => _status;
            set
            {
                _status = value;
                OnPropertyChanged();
            }
        }

        public event PropertyChangedEventHandler PropertyChanged;

        protected virtual void OnPropertyChanged([CallerMemberName] string propertyName = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }
    }

    /// <summary>
    /// Status of optimization items in the UI
    /// </summary>
    public enum OptimizationItemStatus
    {
        Unknown,
        Pending,
        Applied,
        AlreadyApplied,
        Incompatible,
        Conflict,
        RequiresAdmin,
        Failed,
        Rollback
    }

    public class OptimizationCategoryGroup
    {
        public VoltrisOptimizer.Core.SystemIntelligenceProfiler.Models.OptimizationCategory Category { get; set; }
        public System.Collections.Generic.List<VoltrisOptimizer.Core.SystemIntelligenceProfiler.Optimization> Optimizations { get; set; } = new();
    }
}