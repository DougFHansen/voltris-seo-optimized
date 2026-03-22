using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;
using VoltrisOptimizer.Interfaces;

namespace VoltrisOptimizer.UI.ViewModels
{
    public class PrivacyViewModel : INotifyPropertyChanged
    {
        private readonly IPrivacyTuningService _privacyService;

        private bool _isTelemetryDisabled;
        public bool IsTelemetryDisabled
        {
            get => _isTelemetryDisabled;
            set { if (_isTelemetryDisabled != value) { _isTelemetryDisabled = value; OnPropertyChanged(); _ = _privacyService.ApplyTweakAsync("Telemetry", value); } }
        }

        private bool _isLocationDisabled;
        public bool IsLocationDisabled
        {
            get => _isLocationDisabled;
            set { if (_isLocationDisabled != value) { _isLocationDisabled = value; OnPropertyChanged(); _ = _privacyService.ApplyTweakAsync("Location", value); } }
        }

        private bool _isAdvertisingIdDisabled;
        public bool IsAdvertisingIdDisabled
        {
            get => _isAdvertisingIdDisabled;
            set { if (_isAdvertisingIdDisabled != value) { _isAdvertisingIdDisabled = value; OnPropertyChanged(); _ = _privacyService.ApplyTweakAsync("AdvertisingID", value); } }
        }

        private bool _isCortanaDisabled;
        public bool IsCortanaDisabled
        {
            get => _isCortanaDisabled;
            set { if (_isCortanaDisabled != value) { _isCortanaDisabled = value; OnPropertyChanged(); _ = _privacyService.ApplyTweakAsync("Cortana", value); } }
        }

        private bool _isCoPilotDisabled;
        public bool IsCoPilotDisabled
        {
            get => _isCoPilotDisabled;
            set { if (_isCoPilotDisabled != value) { _isCoPilotDisabled = value; OnPropertyChanged(); _ = _privacyService.ApplyTweakAsync("CoPilot", value); } }
        }
    
        private bool _isRecallDisabled;
        public bool IsRecallDisabled
        {
            get => _isRecallDisabled;
            set { if (_isRecallDisabled != value) { _isRecallDisabled = value; OnPropertyChanged(); _ = _privacyService.ApplyTweakAsync("Recall", value); } }
        }

        private bool _isBluetoothDisabled;
        public bool IsBluetoothDisabled
        {
            get => _isBluetoothDisabled;
            set { if (_isBluetoothDisabled != value) { _isBluetoothDisabled = value; OnPropertyChanged(); _ = _privacyService.ApplyTweakAsync("BluetoothAdvertising", value); } }
        }

        private bool _isHandwritingDisabled;
        public bool IsHandwritingDisabled
        {
            get => _isHandwritingDisabled;
            set { if (_isHandwritingDisabled != value) { _isHandwritingDisabled = value; OnPropertyChanged(); _ = _privacyService.ApplyTweakAsync("HandwritingDataSharing", value); } }
        }

        private bool _isTextInputDisabled;
        public bool IsTextInputDisabled
        {
            get => _isTextInputDisabled;
            set { if (_isTextInputDisabled != value) { _isTextInputDisabled = value; OnPropertyChanged(); _ = _privacyService.ApplyTweakAsync("TextInputDataCollection", value); } }
        }

        private bool _isPersonalizationDisabled;
        public bool IsPersonalizationDisabled
        {
            get => _isPersonalizationDisabled;
            set { if (_isPersonalizationDisabled != value) { _isPersonalizationDisabled = value; OnPropertyChanged(); _ = _privacyService.ApplyTweakAsync("InputPersonalization", value); } }
        }

        private bool _isActivityUploadDisabled;
        public bool IsActivityUploadDisabled
        {
            get => _isActivityUploadDisabled;
            set { if (_isActivityUploadDisabled != value) { _isActivityUploadDisabled = value; OnPropertyChanged(); _ = _privacyService.ApplyTweakAsync("ActivityUploads", value); } }
        }

        private bool _isClipboardSyncDisabled;
        public bool IsClipboardSyncDisabled
        {
            get => _isClipboardSyncDisabled;
            set { if (_isClipboardSyncDisabled != value) { _isClipboardSyncDisabled = value; OnPropertyChanged(); _ = _privacyService.ApplyTweakAsync("ClipboardSync", value); } }
        }

        private bool _isDiagToastDisabled;
        public bool IsDiagToastDisabled
        {
            get => _isDiagToastDisabled;
            set { if (_isDiagToastDisabled != value) { _isDiagToastDisabled = value; OnPropertyChanged(); _ = _privacyService.ApplyTweakAsync("DiagnosticsToast", value); } }
        }

        private bool _isOnlineSpeechDisabled;
        public bool IsOnlineSpeechDisabled
        {
            get => _isOnlineSpeechDisabled;
            set { if (_isOnlineSpeechDisabled != value) { _isOnlineSpeechDisabled = value; OnPropertyChanged(); _ = _privacyService.ApplyTweakAsync("OnlineSpeechPrivacy", value); } }
        }

        private bool _isOneDriveDisabled;
        public bool IsOneDriveDisabled
        {
            get => _isOneDriveDisabled;
            set { if (_isOneDriveDisabled != value) { _isOneDriveDisabled = value; OnPropertyChanged(); _ = _privacyService.ApplyTweakAsync("OneDrive", value); } }
        }

        private bool _isActivityFeedDisabled;
        public bool IsActivityFeedDisabled
        {
            get => _isActivityFeedDisabled;
            set { if (_isActivityFeedDisabled != value) { _isActivityFeedDisabled = value; OnPropertyChanged(); _ = _privacyService.ApplyTweakAsync("ActivityFeed", value); } }
        }

        public PrivacyViewModel(IPrivacyTuningService privacyService)
        {
            _privacyService = privacyService;
            // ETAPA 8: Inicialização lazy em background
            _ = Task.Run(async () => await InitializeAsync());
        }

        private async Task InitializeAsync()
        {
            try
            {
                // ETAPA 8: Ler todos os tweaks em paralelo (sem bloquear a UI thread)
                var tasks = new Dictionary<string, Task<bool>>
                {
                    ["Telemetry"] = _privacyService.GetTweakStateAsync("Telemetry"),
                    ["Location"] = _privacyService.GetTweakStateAsync("Location"),
                    ["AdvertisingID"] = _privacyService.GetTweakStateAsync("AdvertisingID"),
                    ["Cortana"] = _privacyService.GetTweakStateAsync("Cortana"),
                    ["CoPilot"] = _privacyService.GetTweakStateAsync("CoPilot"),
                    ["Recall"] = _privacyService.GetTweakStateAsync("Recall"),
                    ["BluetoothAdvertising"] = _privacyService.GetTweakStateAsync("BluetoothAdvertising"),
                    ["HandwritingDataSharing"] = _privacyService.GetTweakStateAsync("HandwritingDataSharing"),
                    ["TextInputDataCollection"] = _privacyService.GetTweakStateAsync("TextInputDataCollection"),
                    ["InputPersonalization"] = _privacyService.GetTweakStateAsync("InputPersonalization"),
                    ["ActivityUploads"] = _privacyService.GetTweakStateAsync("ActivityUploads"),
                    ["ClipboardSync"] = _privacyService.GetTweakStateAsync("ClipboardSync"),
                    ["DiagnosticsToast"] = _privacyService.GetTweakStateAsync("DiagnosticsToast"),
                    ["OnlineSpeechPrivacy"] = _privacyService.GetTweakStateAsync("OnlineSpeechPrivacy"),
                    ["OneDrive"] = _privacyService.GetTweakStateAsync("OneDrive"),
                    ["ActivityFeed"] = _privacyService.GetTweakStateAsync("ActivityFeed")
                };

                await Task.WhenAll(tasks.Values).ConfigureAwait(false);

                // Propagar resultados para a UI em um único dispatch
                await System.Windows.Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    _isTelemetryDisabled = tasks["Telemetry"].Result;
                    _isLocationDisabled = tasks["Location"].Result;
                    _isAdvertisingIdDisabled = tasks["AdvertisingID"].Result;
                    _isCortanaDisabled = tasks["Cortana"].Result;
                    _isCoPilotDisabled = tasks["CoPilot"].Result;
                    _isRecallDisabled = tasks["Recall"].Result;
                    _isBluetoothDisabled = tasks["BluetoothAdvertising"].Result;
                    _isHandwritingDisabled = tasks["HandwritingDataSharing"].Result;
                    _isTextInputDisabled = tasks["TextInputDataCollection"].Result;
                    _isPersonalizationDisabled = tasks["InputPersonalization"].Result;
                    _isActivityUploadDisabled = tasks["ActivityUploads"].Result;
                    _isClipboardSyncDisabled = tasks["ClipboardSync"].Result;
                    _isDiagToastDisabled = tasks["DiagnosticsToast"].Result;
                    _isOnlineSpeechDisabled = tasks["OnlineSpeechPrivacy"].Result;
                    _isOneDriveDisabled = tasks["OneDrive"].Result;
                    _isActivityFeedDisabled = tasks["ActivityFeed"].Result;

                    OnPropertyChanged(string.Empty); // Refresh all bindings
                });
            }
            catch (Exception)
            {
                // Silencioso — UI já apresenta os valores default (false)
            }
        }

        public event PropertyChangedEventHandler? PropertyChanged;
        protected void OnPropertyChanged([CallerMemberName] string? name = null)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(name));
        }
    }
}
