using System;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services.Performance.Models;
using VoltrisOptimizer.Services.Thermal;
using VoltrisOptimizer.Services.Thermal.Models;

namespace VoltrisOptimizer.Services.Performance
{
    /// <summary>
    /// Guarda de segurança térmica
    /// Monitora temperatura e desativa otimizações se necessário
    /// Integrado com GlobalThermalMonitorService
    /// </summary>
    public class ThermalSafetyGuard
    {
        private readonly ILoggingService _logger;
        private readonly GlobalThermalMonitorService? _thermalMonitor;
        private PerformanceProfile? _currentProfile;
        private ThermalMetrics? _lastMetrics;

        public event EventHandler<ThermalSafetyAlert>? ThermalAlertRaised;

        public ThermalSafetyGuard(ILoggingService logger, GlobalThermalMonitorService? thermalMonitor)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _thermalMonitor = thermalMonitor;

            if (_thermalMonitor != null)
            {
                _thermalMonitor.MetricsUpdated += OnThermalMetricsUpdated;
                _thermalMonitor.AlertGenerated += OnThermalAlertGenerated;
                _logger.LogInfo("[ThermalSafety] Integrado com GlobalThermalMonitorService");
            }
            else
            {
                _logger.LogWarning("[ThermalSafety] GlobalThermalMonitorService não disponível - proteção térmica limitada");
            }
        }

        /// <summary>
        /// Define o perfil de performance atual para verificação de thresholds
        /// </summary>
        public void SetCurrentProfile(PerformanceProfile profile)
        {
            _currentProfile = profile;
            _logger.LogDebug($"[ThermalSafety] Perfil definido: {profile.Name} (Threshold: {profile.ThermalThrottleThreshold}°C)");
        }

        /// <summary>
        /// Verifica se é seguro aplicar otimizações de performance
        /// </summary>
        public bool IsSafeToOptimize(out string reason)
        {
            reason = string.Empty;

            if (_thermalMonitor == null)
            {
                reason = "Monitor térmico não disponível";
                _logger.LogWarning("[ThermalSafety] Monitor térmico não disponível - permitindo otimização com aviso");
                return true; // Permitir se não houver monitor (fallback)
            }

            if (_lastMetrics == null)
            {
                reason = "Aguardando primeira leitura de temperatura";
                _logger.LogDebug("[ThermalSafety] Aguardando primeira leitura de temperatura");
                return true; // Permitir na primeira execução
            }

            if (_currentProfile == null)
            {
                reason = "Perfil de performance não definido";
                // Race condition na inicialização — perfil será definido em breve, não logar warning
                return true;
            }

            // Verificar temperatura da CPU
            if (!double.IsNaN(_lastMetrics.CpuTemperature) && 
                _lastMetrics.CpuTemperature >= _currentProfile.ThermalThrottleThreshold)
            {
                reason = $"CPU acima do threshold: {_lastMetrics.CpuTemperature:F1}°C >= {_currentProfile.ThermalThrottleThreshold}°C";
                _logger.LogWarning($"[ThermalSafety] {reason}");
                return false;
            }

            // Verificar temperatura da GPU (se disponível)
            if (!double.IsNaN(_lastMetrics.GpuTemperature) && 
                _lastMetrics.GpuTemperature >= _currentProfile.ThermalThrottleThreshold)
            {
                reason = $"GPU acima do threshold: {_lastMetrics.GpuTemperature:F1}°C >= {_currentProfile.ThermalThrottleThreshold}°C";
                _logger.LogWarning($"[ThermalSafety] {reason}");
                return false;
            }

            // Verificar temperatura crítica absoluta (90°C+)
            double maxTemp = Math.Max(
                double.IsNaN(_lastMetrics.CpuTemperature) ? 0 : _lastMetrics.CpuTemperature,
                double.IsNaN(_lastMetrics.GpuTemperature) ? 0 : _lastMetrics.GpuTemperature
            );

            if (maxTemp >= 90.0)
            {
                reason = $"Temperatura crítica detectada: {maxTemp:F1}°C";
                _logger.LogError($"[ThermalSafety] {reason}");
                return false;
            }

            _logger.LogDebug($"[ThermalSafety] Seguro para otimizar - CPU: {_lastMetrics.CpuTemperature:F1}°C, GPU: {_lastMetrics.GpuTemperature:F1}°C");
            return true;
        }

        /// <summary>
        /// Verifica se deve desativar otimizações devido a temperatura
        /// </summary>
        public bool ShouldDeactivate(out string reason)
        {
            reason = string.Empty;

            if (_currentProfile == null || !_currentProfile.DisableOnThermalAlert)
            {
                return false; // Perfil não exige desativação por temperatura
            }

            if (_lastMetrics == null)
            {
                return false;
            }

            // Verificar se temperatura subiu muito rápido (indicador de thermal throttling)
            double maxTemp = Math.Max(
                double.IsNaN(_lastMetrics.CpuTemperature) ? 0 : _lastMetrics.CpuTemperature,
                double.IsNaN(_lastMetrics.GpuTemperature) ? 0 : _lastMetrics.GpuTemperature
            );

            // Desativar se temperatura crítica
            if (maxTemp >= 90.0)
            {
                reason = $"Temperatura crítica: {maxTemp:F1}°C - desativando otimizações para proteção";
                _logger.LogError($"[ThermalSafety] {reason}");
                return true;
            }

            // Desativar se acima do threshold do perfil
            if (maxTemp >= _currentProfile.ThermalThrottleThreshold)
            {
                reason = $"Temperatura acima do threshold do perfil: {maxTemp:F1}°C >= {_currentProfile.ThermalThrottleThreshold}°C";
                _logger.LogWarning($"[ThermalSafety] {reason}");
                return true;
            }

            return false;
        }

        /// <summary>
        /// Obtém as métricas térmicas atuais
        /// </summary>
        public ThermalMetrics? GetCurrentMetrics()
        {
            return _lastMetrics;
        }

        private void OnThermalMetricsUpdated(object? sender, ThermalMetrics metrics)
        {
            _lastMetrics = metrics;

            // Verificar se deve gerar alerta
            if (_currentProfile != null && ShouldDeactivate(out string reason))
            {
                var alert = new ThermalSafetyAlert
                {
                    Level = metrics.CpuTemperature >= 90 || metrics.GpuTemperature >= 90 
                        ? ThermalSafetyLevel.Critical 
                        : ThermalSafetyLevel.Warning,
                    CpuTemperature = metrics.CpuTemperature,
                    GpuTemperature = metrics.GpuTemperature,
                    Message = reason,
                    Recommendation = "Otimizações de performance serão desativadas automaticamente",
                    Timestamp = DateTime.Now
                };

                ThermalAlertRaised?.Invoke(this, alert);
            }
        }

        private void OnThermalAlertGenerated(object? sender, ThermalAlert alert)
        {
            // Converter alerta do GlobalThermalMonitorService para ThermalSafetyAlert
            var safetyAlert = new ThermalSafetyAlert
            {
                Level = alert.Level == ThermalAlertLevel.Critical 
                    ? ThermalSafetyLevel.Critical 
                    : ThermalSafetyLevel.Warning,
                CpuTemperature = _lastMetrics?.CpuTemperature ?? 0,
                GpuTemperature = _lastMetrics?.GpuTemperature ?? 0,
                Message = alert.Message,
                Recommendation = alert.Recommendation,
                Timestamp = DateTime.Now
            };

            _logger.LogWarning($"[ThermalSafety] Alerta térmico recebido: {alert.Message}");
            ThermalAlertRaised?.Invoke(this, safetyAlert);
        }

        public void Dispose()
        {
            if (_thermalMonitor != null)
            {
                _thermalMonitor.MetricsUpdated -= OnThermalMetricsUpdated;
                _thermalMonitor.AlertGenerated -= OnThermalAlertGenerated;
            }
        }
    }
}
