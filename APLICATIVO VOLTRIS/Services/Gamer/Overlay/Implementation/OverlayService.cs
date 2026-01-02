using System;
using System.Diagnostics;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Services.Gamer.GamerModeManager;
using VoltrisOptimizer.Services.Gamer.Overlay.Interfaces;
using VoltrisOptimizer.Services.Gamer.Overlay.Models;
using VoltrisOptimizer.UI.Overlay;

namespace VoltrisOptimizer.Services.Gamer.Overlay.Implementation
{
    /// <summary>
    /// Serviço principal de overlay OSD
    /// CORREÇÃO: Integrado com ThermalMonitorService para métricas precisas
    /// </summary>
    public class OverlayService : IOverlayService, IDisposable
    {
        private readonly ILoggingService? _logger;
        private readonly IMetricsCollector _metricsCollector;
        private readonly IThermalMonitorService? _thermalMonitor;
        private OverlayWindow? _overlayWindow;
        private OverlaySettings _settings;
        private bool _isActive = false;
        private int _currentGameProcessId = 0;
        private readonly string _settingsPath;
        private readonly object _lock = new object();

        public bool IsActive
        {
            get
            {
                lock (_lock)
                {
                    return _isActive && _overlayWindow != null;
                }
            }
        }

        public OverlaySettings Settings
        {
            get
            {
                lock (_lock)
                {
                    return _settings;
                }
            }
        }

        public event EventHandler? OverlayActivated;
        public event EventHandler? OverlayDeactivated;

        public OverlayService(ILoggingService? logger = null, IMetricsCollector? metricsCollector = null, IThermalMonitorService? thermalMonitor = null)
        {
            _logger = logger;
            _thermalMonitor = thermalMonitor;
            // CORREÇÃO: Passar ThermalMonitorService para MetricsCollector
            _metricsCollector = metricsCollector ?? new MetricsCollector(logger, thermalMonitor);
            _settings = new OverlaySettings();
            
            var appDataPath = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),
                "VoltrisOptimizer"
            );
            _settingsPath = Path.Combine(appDataPath, "GamerOverlaySettings.json");

            // Subscrever eventos do coletor de métricas
            _metricsCollector.MetricsUpdated += OnMetricsUpdated;
        }

        public async Task<bool> StartAsync(int gameProcessId, CancellationToken cancellationToken = default)
        {
            try
            {
                lock (_lock)
                {
                    if (_isActive && _currentGameProcessId == gameProcessId)
                    {
                        return true; // Já está ativo para este processo
                    }

                    if (_isActive)
                    {
                        // Parar overlay anterior se houver
                        StopAsync().Wait(1000);
                    }

                    if (!_settings.IsEnabled)
                    {
                        _logger?.LogInfo("[Overlay] Overlay desabilitado nas configurações");
                        return false;
                    }

                    _currentGameProcessId = gameProcessId;
                }

                // Verificar se o processo existe
                try
                {
                    var process = Process.GetProcessById(gameProcessId);
                    if (process.HasExited)
                    {
                        _logger?.LogWarning($"[Overlay] Processo {gameProcessId} já encerrou");
                        return false;
                    }
                }
                catch
                {
                    _logger?.LogWarning($"[Overlay] Processo {gameProcessId} não encontrado");
                    return false;
                }

                // Iniciar coletor de métricas
                await _metricsCollector.StartAsync(gameProcessId, cancellationToken);

                // Criar e mostrar janela de overlay
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    _overlayWindow = new OverlayWindow(_settings);
                    _overlayWindow.Show();
                });

                lock (_lock)
                {
                    _isActive = true;
                }

                _logger?.LogSuccess($"[Overlay] Overlay iniciado para processo {gameProcessId}");
                OverlayActivated?.Invoke(this, EventArgs.Empty);

                return true;
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[Overlay] Erro ao iniciar overlay: {ex.Message}", ex);
                return false;
            }
        }

        public async Task StopAsync()
        {
            try
            {
                lock (_lock)
                {
                    if (!_isActive)
                        return;

                    _isActive = false;
                    _currentGameProcessId = 0;
                }

                // Parar coletor de métricas
                await _metricsCollector.StopAsync();

                // Fechar janela de overlay
                await Application.Current.Dispatcher.InvokeAsync(() =>
                {
                    _overlayWindow?.Close();
                    _overlayWindow = null;
                });

                _logger?.LogInfo("[Overlay] Overlay parado");
                OverlayDeactivated?.Invoke(this, EventArgs.Empty);
            }
            catch (Exception ex)
            {
                _logger?.LogError($"[Overlay] Erro ao parar overlay: {ex.Message}", ex);
            }
        }

        public void UpdateSettings(OverlaySettings settings)
        {
            lock (_lock)
            {
                _settings = settings;
            }

            // Atualizar janela de overlay se estiver ativa
            Application.Current?.Dispatcher.Invoke(() =>
            {
                _overlayWindow?.UpdateSettings(settings);
            });
        }

        public async Task LoadSettingsAsync()
        {
            try
            {
                var settings = OverlaySettings.LoadFromFile(_settingsPath);
                lock (_lock)
                {
                    _settings = settings;
                }
                _logger?.LogInfo("[Overlay] Configurações carregadas");
            }
            catch (Exception ex)
            {
                _logger?.LogWarning($"[Overlay] Erro ao carregar configurações: {ex.Message}");
            }
            await Task.CompletedTask;
        }

        public async Task SaveSettingsAsync()
        {
            try
            {
                OverlaySettings settings;
                lock (_lock)
                {
                    settings = _settings;
                }
                settings.SaveToFile(_settingsPath);
                _logger?.LogInfo("[Overlay] Configurações salvas");
            }
            catch (Exception ex)
            {
                _logger?.LogWarning($"[Overlay] Erro ao salvar configurações: {ex.Message}");
            }
            await Task.CompletedTask;
        }

        private void OnMetricsUpdated(object? sender, MetricsData metrics)
        {
            // Atualizar overlay na thread da UI
            Application.Current?.Dispatcher.Invoke(() =>
            {
                _overlayWindow?.UpdateMetrics(metrics);
            });
        }

        public void Dispose()
        {
            StopAsync().Wait(1000);
            _metricsCollector?.Dispose();
        }
    }
}

