using System;
using System.Collections.ObjectModel;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows.Input;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Services.StreamHub.Interfaces;
using VoltrisOptimizer.Services.StreamHub.Models;

namespace VoltrisOptimizer.UI.ViewModels
{
    /// <summary>
    /// ViewModel principal do Stream Hub.
    /// Expõe todos os dados e comandos para a UI via MVVM.
    /// </summary>
    public class StreamHubViewModel : ViewModelBase
    {
        private readonly IStreamHubService _hub;
        private readonly ILoggingService _logger;
        private CancellationTokenSource? _cts;

        // ─── ESTADO GERAL ────────────────────────────────────────────────────────
        private bool _isRunning;
        public bool IsRunning
        {
            get => _isRunning;
            set => SetProperty(ref _isRunning, value);
        }

        private bool _isConnecting;
        public bool IsConnecting
        {
            get => _isConnecting;
            set => SetProperty(ref _isConnecting, value);
        }

        private string _statusMessage = "Stream Hub desconectado";
        public string StatusMessage
        {
            get => _statusMessage;
            set => SetProperty(ref _statusMessage, value);
        }

        // ─── MÉTRICAS OBS ────────────────────────────────────────────────────────
        private bool _isLive;
        public bool IsLive
        {
            get => _isLive;
            set { SetProperty(ref _isLive, value); OnPropertyChanged(nameof(LiveStatusText)); OnPropertyChanged(nameof(LiveStatusColor)); }
        }

        public string LiveStatusText => IsLive ? "🔴 AO VIVO" : "⚫ OFFLINE";
        public string LiveStatusColor => IsLive ? "#FF4444" : "#6B6B80";

        private int _bitrateKbps;
        public int BitrateKbps
        {
            get => _bitrateKbps;
            set { SetProperty(ref _bitrateKbps, value); OnPropertyChanged(nameof(BitrateText)); OnPropertyChanged(nameof(BitrateColor)); }
        }

        public string BitrateText => $"{BitrateKbps:N0} kbps";
        public string BitrateColor => BitrateKbps < 1000 && IsLive ? "#FF4466" : BitrateKbps < 2000 ? "#FFAA00" : "#00FF88";

        private double _droppedFramePercent;
        public double DroppedFramePercent
        {
            get => _droppedFramePercent;
            set { SetProperty(ref _droppedFramePercent, value); OnPropertyChanged(nameof(DroppedFramesText)); OnPropertyChanged(nameof(DroppedFramesColor)); }
        }

        public string DroppedFramesText => $"{DroppedFramePercent:F1}%";
        public string DroppedFramesColor => DroppedFramePercent > 5 ? "#FF4466" : DroppedFramePercent > 1 ? "#FFAA00" : "#00FF88";

        private int _fps;
        public int Fps
        {
            get => _fps;
            set => SetProperty(ref _fps, value);
        }

        private double _cpuUsage;
        public double CpuUsage
        {
            get => _cpuUsage;
            set { SetProperty(ref _cpuUsage, value); OnPropertyChanged(nameof(CpuUsageText)); OnPropertyChanged(nameof(CpuUsageColor)); }
        }

        public string CpuUsageText => $"{CpuUsage:F0}%";
        public string CpuUsageColor => CpuUsage > 90 ? "#FF4466" : CpuUsage > 75 ? "#FFAA00" : "#00FF88";

        private double _ramUsageMb;
        public double RamUsageMb
        {
            get => _ramUsageMb;
            set => SetProperty(ref _ramUsageMb, value);
        }

        private string _activeScene = "—";
        public string ActiveScene
        {
            get => _activeScene;
            set => SetProperty(ref _activeScene, value);
        }

        private string _streamDuration = "00:00:00";
        public string StreamDuration
        {
            get => _streamDuration;
            set => SetProperty(ref _streamDuration, value);
        }

        private int _healthScore = 100;
        public int HealthScore
        {
            get => _healthScore;
            set { SetProperty(ref _healthScore, value); OnPropertyChanged(nameof(HealthScoreColor)); OnPropertyChanged(nameof(HealthScoreText)); }
        }

        public string HealthScoreText => $"{HealthScore}/100";
        public string HealthScoreColor => HealthScore >= 80 ? "#00FF88" : HealthScore >= 50 ? "#FFAA00" : "#FF4466";

        private bool _isMicActive = true;
        public bool IsMicActive
        {
            get => _isMicActive;
            set { SetProperty(ref _isMicActive, value); OnPropertyChanged(nameof(MicStatusText)); OnPropertyChanged(nameof(MicStatusColor)); }
        }

        public string MicStatusText => IsMicActive ? "🎙️ Ativo" : "🔇 Mudo";
        public string MicStatusColor => IsMicActive ? "#00FF88" : "#FF4466";

        // ─── PLATAFORMAS ─────────────────────────────────────────────────────────
        private bool _obsConnected;
        public bool ObsConnected
        {
            get => _obsConnected;
            set { SetProperty(ref _obsConnected, value); OnPropertyChanged(nameof(ObsStatusText)); OnPropertyChanged(nameof(ObsStatusColor)); }
        }

        public string ObsStatusText => _obsConnected ? "Conectado" : "Desconectado";
        public string ObsStatusColor => _obsConnected ? "#00FF88" : "#FF4466";

        private bool _twitchConnected;
        public bool TwitchConnected
        {
            get => _twitchConnected;
            set { SetProperty(ref _twitchConnected, value); OnPropertyChanged(nameof(TwitchStatusText)); }
        }

        public string TwitchStatusText => _twitchConnected ? "Conectado" : "Desconectado";

        private bool _youtubeConnected;
        public bool YouTubeConnected
        {
            get => _youtubeConnected;
            set { SetProperty(ref _youtubeConnected, value); OnPropertyChanged(nameof(YouTubeStatusText)); }
        }

        public string YouTubeStatusText => _youtubeConnected ? "Conectado" : "Desconectado";

        // ─── CHAT ────────────────────────────────────────────────────────────────
        public ObservableCollection<ChatMessage> ChatMessages { get; } = new();

        private int _messagesPerMinute;
        public int MessagesPerMinute
        {
            get => _messagesPerMinute;
            set => SetProperty(ref _messagesPerMinute, value);
        }

        private int _totalMessages;
        public int TotalMessages
        {
            get => _totalMessages;
            set => SetProperty(ref _totalMessages, value);
        }

        // ─── ALERTAS ─────────────────────────────────────────────────────────────
        public ObservableCollection<StreamAlert> ActiveAlerts { get; } = new();

        private bool _hasAlerts;
        public bool HasAlerts
        {
            get => _hasAlerts;
            set => SetProperty(ref _hasAlerts, value);
        }

        private bool _hasCriticalAlert;
        public bool HasCriticalAlert
        {
            get => _hasCriticalAlert;
            set => SetProperty(ref _hasCriticalAlert, value);
        }

        // ─── HIGHLIGHTS ──────────────────────────────────────────────────────────
        public ObservableCollection<HighlightMoment> Highlights { get; } = new();

        private int _highlightCount;
        public int HighlightCount
        {
            get => _highlightCount;
            set => SetProperty(ref _highlightCount, value);
        }

        // ─── SUGESTÕES DE ENGAJAMENTO ────────────────────────────────────────────
        public ObservableCollection<EngagementSuggestion> Suggestions { get; } = new();

        private bool _hasSuggestions;
        public bool HasSuggestions
        {
            get => _hasSuggestions;
            set => SetProperty(ref _hasSuggestions, value);
        }

        private EngagementSuggestion? _topSuggestion;
        public EngagementSuggestion? TopSuggestion
        {
            get => _topSuggestion;
            set => SetProperty(ref _topSuggestion, value);
        }

        // ─── CONFIGURAÇÕES ───────────────────────────────────────────────────────
        private StreamHubSettings _settings = new();
        public StreamHubSettings Settings
        {
            get => _settings;
            set => SetProperty(ref _settings, value);
        }

        // ─── COMANDOS ────────────────────────────────────────────────────────────
        private ICommand? _startCommand;
        public ICommand StartCommand => _startCommand ??= new AsyncRelayCommand(async _ =>
        {
            await StartHubAsync();
        }, _ => !IsRunning && !IsConnecting);

        private ICommand? _stopCommand;
        public ICommand StopCommand => _stopCommand ??= new AsyncRelayCommand(async _ =>
        {
            await StopHubAsync();
        }, _ => IsRunning);

        private ICommand? _markHighlightCommand;
        public ICommand MarkHighlightCommand => _markHighlightCommand ??= new RelayCommand(_ =>
        {
            _hub.MarkHighlight("Marcação manual do streamer");
            _logger.Log(LogLevel.Info, LogCategory.General, "[StreamHub] Highlight marcado manualmente pelo usuário", source: "StreamHub");
        }, _ => IsRunning && IsLive);

        private ICommand? _connectObsCommand;
        public ICommand ConnectObsCommand => _connectObsCommand ??= new AsyncRelayCommand(async _ =>
        {
            _logger.Log(LogLevel.Info, LogCategory.General, "[StreamHub] Usuário solicitou conexão OBS", source: "StreamHub");
            var success = await _hub.ConnectObsAsync();
            StatusMessage = success ? "OBS conectado!" : "Falha ao conectar OBS. Verifique se está aberto.";
        });

        private ICommand? _connectTwitchCommand;
        public ICommand ConnectTwitchCommand => _connectTwitchCommand ??= new AsyncRelayCommand(async _ =>
        {
            _logger.Log(LogLevel.Info, LogCategory.General, "[StreamHub] Usuário solicitou conexão Twitch", source: "StreamHub");
            var success = await _hub.ConnectTwitchAsync();
            StatusMessage = success ? "Twitch conectado!" : "Falha ao conectar Twitch. Verifique as credenciais.";
        });

        private ICommand? _connectYouTubeCommand;
        public ICommand ConnectYouTubeCommand => _connectYouTubeCommand ??= new AsyncRelayCommand(async _ =>
        {
            _logger.Log(LogLevel.Info, LogCategory.General, "[StreamHub] Usuário solicitou conexão YouTube", source: "StreamHub");
            var success = await _hub.ConnectYouTubeAsync();
            StatusMessage = success ? "YouTube conectado!" : "Falha ao conectar YouTube. Verifique a API Key.";
        });

        private ICommand? _dismissSuggestionCommand;
        public ICommand DismissSuggestionCommand => _dismissSuggestionCommand ??= new RelayCommand(param =>
        {
            if (param is string id)
            {
                var suggestion = Suggestions.FirstOrDefault(s => s.Id == id);
                if (suggestion != null)
                {
                    Suggestions.Remove(suggestion);
                    HasSuggestions = Suggestions.Count > 0;
                    TopSuggestion = Suggestions.Count > 0 ? Suggestions[0] : null;
                }
            }
        });

        private ICommand? _saveSettingsCommand;
        public ICommand SaveSettingsCommand => _saveSettingsCommand ??= new RelayCommand(_ =>
        {
            _hub.SaveSettings(_settings);
            StatusMessage = "Configurações salvas!";
            _logger.Log(LogLevel.Info, LogCategory.General, "[StreamHub] Configurações salvas pelo usuário", source: "StreamHub");
        });

        // ─── CONSTRUTOR ──────────────────────────────────────────────────────────
        public StreamHubViewModel(IStreamHubService hub, ILoggingService logger)
        {
            _hub = hub;
            _logger = logger;

            // Carregar configurações salvas
            _settings = _hub.LoadSettings();

            // Subscrever eventos
            _hub.MetricsUpdated += OnMetricsUpdated;
            _hub.ChatMessageReceived += OnChatMessageReceived;
            _hub.AlertRaised += OnAlertRaised;
            _hub.HighlightDetected += OnHighlightDetected;
            _hub.SuggestionGenerated += OnSuggestionGenerated;
            _hub.PlatformStatusChanged += OnPlatformStatusChanged;

            _logger.Log(LogLevel.Info, LogCategory.General, "[StreamHub] ViewModel inicializado", source: "StreamHub");
        }

        private async Task StartHubAsync()
        {
            _logger.Log(LogLevel.Info, LogCategory.General, "[StreamHub] Usuário iniciou o Stream Hub", source: "StreamHub");
            IsConnecting = true;
            StatusMessage = "Conectando plataformas...";

            try
            {
                _cts = new CancellationTokenSource();
                await _hub.StartAsync(_settings, _cts.Token);
                IsRunning = true;
                StatusMessage = "Stream Hub ativo";
                _logger.Log(LogLevel.Info, LogCategory.General, "[StreamHub] Hub iniciado com sucesso", source: "StreamHub");
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, LogCategory.General, $"[StreamHub] Erro ao iniciar: {ex.Message}", ex, source: "StreamHub");
                StatusMessage = $"Erro ao iniciar: {ex.Message}";
                IsRunning = false;
            }
            finally
            {
                IsConnecting = false;
                RaiseCommandsCanExecuteChanged();
            }
        }

        private async Task StopHubAsync()
        {
            _logger.Log(LogLevel.Info, LogCategory.General, "[StreamHub] Usuário parou o Stream Hub", source: "StreamHub");
            try
            {
                _cts?.Cancel();
                await _hub.StopAsync();
                IsRunning = false;
                IsLive = false;
                ObsConnected = false;
                TwitchConnected = false;
                YouTubeConnected = false;
                ActiveAlerts.Clear();
                Suggestions.Clear();
                HasAlerts = false;
                HasSuggestions = false;
                HasCriticalAlert = false;
                StatusMessage = "Stream Hub desconectado";
                _logger.Log(LogLevel.Info, LogCategory.General, "[StreamHub] Hub parado com sucesso", source: "StreamHub");
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, LogCategory.General, $"[StreamHub] Erro ao parar: {ex.Message}", ex, source: "StreamHub");
            }
            finally
            {
                RaiseCommandsCanExecuteChanged();
            }
        }

        // ─── HANDLERS DE EVENTOS ─────────────────────────────────────────────────
        private void OnMetricsUpdated(object? sender, StreamMetrics metrics)
        {
            var dispatcher = System.Windows.Application.Current?.Dispatcher;
            if (dispatcher == null) return;

            dispatcher.BeginInvoke(() =>
            {
                IsLive = metrics.IsLive;
                BitrateKbps = metrics.BitrateKbps;
                DroppedFramePercent = metrics.DroppedFramePercent;
                Fps = metrics.Fps;
                CpuUsage = metrics.CpuUsagePercent;
                RamUsageMb = metrics.RamUsageMb;
                ActiveScene = string.IsNullOrEmpty(metrics.ActiveScene) ? "—" : metrics.ActiveScene;
                IsMicActive = metrics.IsMicrophoneActive;
                HealthScore = metrics.HealthScore;
                StreamDuration = metrics.StreamDuration.ToString(@"hh\:mm\:ss");
            });
        }

        private void OnChatMessageReceived(object? sender, ChatMessage message)
        {
            var dispatcher = System.Windows.Application.Current?.Dispatcher;
            if (dispatcher == null) return;

            dispatcher.BeginInvoke(() =>
            {
                // Manter máximo de 200 mensagens no chat
                if (ChatMessages.Count >= 200)
                    ChatMessages.RemoveAt(0);

                ChatMessages.Add(message);
                TotalMessages++;
            });
        }

        private void OnAlertRaised(object? sender, StreamAlert alert)
        {
            var dispatcher = System.Windows.Application.Current?.Dispatcher;
            if (dispatcher == null) return;

            dispatcher.BeginInvoke(() =>
            {
                if (!ActiveAlerts.Any(a => a.Type == alert.Type))
                    ActiveAlerts.Add(alert);

                HasAlerts = ActiveAlerts.Count > 0;
                HasCriticalAlert = ActiveAlerts.Any(a => a.Severity == AlertSeverity.Critical);
            });
        }

        private void OnHighlightDetected(object? sender, HighlightMoment highlight)
        {
            var dispatcher = System.Windows.Application.Current?.Dispatcher;
            if (dispatcher == null) return;

            dispatcher.BeginInvoke(() =>
            {
                Highlights.Insert(0, highlight); // Mais recente primeiro
                HighlightCount = Highlights.Count;
            });
        }

        private void OnSuggestionGenerated(object? sender, EngagementSuggestion suggestion)
        {
            var dispatcher = System.Windows.Application.Current?.Dispatcher;
            if (dispatcher == null) return;

            dispatcher.BeginInvoke(() =>
            {
                if (Suggestions.Count >= 5)
                    Suggestions.RemoveAt(Suggestions.Count - 1);

                Suggestions.Insert(0, suggestion);
                HasSuggestions = Suggestions.Count > 0;
                TopSuggestion = Suggestions.Count > 0 ? Suggestions[0] : null;
            });
        }

        private void OnPlatformStatusChanged(object? sender, PlatformStatus status)
        {
            var dispatcher = System.Windows.Application.Current?.Dispatcher;
            if (dispatcher == null) return;

            dispatcher.BeginInvoke(() =>
            {
                switch (status.Platform)
                {
                    case StreamPlatform.OBS:
                        ObsConnected = status.Status == StreamStatus.Online;
                        break;
                    case StreamPlatform.Twitch:
                        TwitchConnected = status.Status == StreamStatus.Online;
                        break;
                    case StreamPlatform.YouTube:
                        YouTubeConnected = status.Status == StreamStatus.Online;
                        break;
                }
            });
        }

        private void RaiseCommandsCanExecuteChanged()
        {
            (StartCommand as AsyncRelayCommand)?.RaiseCanExecuteChanged();
            (StopCommand as AsyncRelayCommand)?.RaiseCanExecuteChanged();
            (MarkHighlightCommand as RelayCommand)?.RaiseCanExecuteChanged();
        }

        protected override void OnActiveChanged()
        {
            _logger.Log(LogLevel.Debug, LogCategory.General,
                $"[StreamHub] ViewModel ativo: {IsActive}", source: "StreamHub");
        }

        protected override void OnDisposing()
        {
            _hub.MetricsUpdated -= OnMetricsUpdated;
            _hub.ChatMessageReceived -= OnChatMessageReceived;
            _hub.AlertRaised -= OnAlertRaised;
            _hub.HighlightDetected -= OnHighlightDetected;
            _hub.SuggestionGenerated -= OnSuggestionGenerated;
            _hub.PlatformStatusChanged -= OnPlatformStatusChanged;
            _cts?.Dispose();
            base.OnDisposing();
        }
    }
}
