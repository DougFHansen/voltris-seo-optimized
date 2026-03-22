using System;
using System.IO;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services.Shield.Network;

namespace VoltrisOptimizer.Services.Shield
{
    /// <summary>
    /// Serviço que conecta eventos do Voltris Shield ao sistema de notificações.
    /// Envia apenas notificações relevantes e de alta prioridade, evitando poluição.
    /// </summary>
    public class ShieldNotificationService : IDisposable
    {
        private readonly VoltrisShieldService _shieldService;
        private readonly RansomwareMonitorService _ransomwareMonitor;
        private readonly DeviceTrackerService _deviceTracker;
        private readonly ILoggingService _logger;
        private bool _disposed;

        public ShieldNotificationService(
            VoltrisShieldService shieldService,
            RansomwareMonitorService ransomwareMonitor,
            DeviceTrackerService deviceTracker,
            ILoggingService logger)
        {
            _shieldService = shieldService ?? throw new ArgumentNullException(nameof(shieldService));
            _ransomwareMonitor = ransomwareMonitor ?? throw new ArgumentNullException(nameof(ransomwareMonitor));
            _deviceTracker = deviceTracker ?? throw new ArgumentNullException(nameof(deviceTracker));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));

            // Conectar eventos do Shield
            _shieldService.ThreatDetected += OnThreatDetected;
            _deviceTracker.NewDeviceDetected += OnNewDeviceDetected;
            _ransomwareMonitor.SuspiciousActivityDetected += OnRansomwareAlert;

            _logger.LogInfo("[ShieldNotification] Serviço de notificações do Shield inicializado");
        }

        private void OnThreatDetected(object? sender, ThreatDetectedEventArgs e)
        {
            try
            {
                var settings = SettingsService.Instance?.Settings;
                if (settings?.NotifyOnThreatDetected != true) return;

                var (title, type) = e.Severity switch
                {
                    ThreatSeverity.Critical => ("Ameaça Crítica Detectada", NotificationType.Error),
                    ThreatSeverity.High => ("Ameaça Detectada", NotificationType.Error),
                    ThreatSeverity.Medium => ("Atividade Suspeita", NotificationType.Warning),
                    _ => ("Alerta de Segurança", NotificationType.Info)
                };

                // Apenas notificar para ameaças Medium+ (evitar poluição)
                if (e.Severity < ThreatSeverity.Medium) return;

                var message = $"{e.ThreatType}: {Path.GetFileName(e.FilePath)}";
                NotificationManager.Show(title, message, type);
                _logger.LogInfo($"[ShieldNotification] Notificação de ameaça enviada: {e.ThreatType} ({e.Severity})");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[ShieldNotification] Erro ao notificar ameaça: {ex.Message}");
            }
        }

        private void OnNewDeviceDetected(object? sender, DeviceEventArgs e)
        {
            try
            {
                var settings = SettingsService.Instance?.Settings;
                if (settings?.NotifyOnNewDevice != true) return;
                if (e?.Device == null) return;

                var deviceName = !string.IsNullOrEmpty(e.Device.FriendlyName)
                    ? e.Device.FriendlyName
                    : e.Device.IPAddress;

                NotificationManager.Show(
                    "Novo Dispositivo na Rede",
                    $"{deviceName} ({e.Device.DeviceType}) conectou-se à sua rede",
                    NotificationType.Info);

                _logger.LogInfo($"[ShieldNotification] Notificação de novo dispositivo: {deviceName}");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[ShieldNotification] Erro ao notificar novo dispositivo: {ex.Message}");
            }
        }

        private void OnRansomwareAlert(object? sender, RansomwareAlertEventArgs e)
        {
            try
            {
                var settings = SettingsService.Instance?.Settings;
                if (settings?.NotifyOnThreatDetected != true) return;

                NotificationManager.Show(
                    "Alerta de Ransomware",
                    $"{e.AlertType}: {e.Details}",
                    NotificationType.Error);

                _logger.LogInfo($"[ShieldNotification] Notificação de ransomware: {e.AlertType}");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[ShieldNotification] Erro ao notificar ransomware: {ex.Message}");
            }
        }

        /// <summary>
        /// Envia notificação de conclusão de scan (chamado externamente pelo ShieldViewModel).
        /// </summary>
        public void NotifyScanComplete(ScanResult result)
        {
            try
            {
                var settings = SettingsService.Instance?.Settings;
                if (settings?.NotifyOnScanComplete != true) return;

                var scanName = result.ScanType switch
                {
                    ScanType.Quick => "Scan Rápido",
                    ScanType.Full => "Scan Completo",
                    ScanType.Adware => "Scan de Adware",
                    _ => "Verificação"
                };

                var type = result.ThreatsFound > 0 ? NotificationType.Warning : NotificationType.Success;
                var message = result.ThreatsFound > 0
                    ? $"{result.ThreatsFound} ameaça(s) encontrada(s)"
                    : "Nenhuma ameaça encontrada";

                NotificationManager.Show($"{scanName} Concluído", message, type);
                _logger.LogInfo($"[ShieldNotification] Notificação de scan: {scanName} - {result.ThreatsFound} ameaças");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[ShieldNotification] Erro ao notificar scan: {ex.Message}");
            }
        }

        public void Dispose()
        {
            if (_disposed) return;
            _disposed = true;

            _shieldService.ThreatDetected -= OnThreatDetected;
            _deviceTracker.NewDeviceDetected -= OnNewDeviceDetected;
            _ransomwareMonitor.SuspiciousActivityDetected -= OnRansomwareAlert;

            _logger.LogInfo("[ShieldNotification] Serviço de notificações do Shield disposed");
        }
    }
}
