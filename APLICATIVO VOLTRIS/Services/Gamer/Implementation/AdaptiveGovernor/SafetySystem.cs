using System;
using System.Collections.Generic;
using System.Linq;
using VoltrisOptimizer.Services.Gamer.Models;

namespace VoltrisOptimizer.Services.Gamer.Implementation.AdaptiveGovernor
{
    /// <summary>
    /// Sistema de segurança (watchdog) - monitora estabilidade e reverte ações se necessário
    /// </summary>
    internal class SafetySystem
    {
        private readonly ILoggingService _logger;
        
        // Histórico de métricas para detectar degradação
        private readonly Queue<SystemMetrics> _metricsHistory = new Queue<SystemMetrics>();
        private const int MaxHistorySize = 5; // Últimas 5 amostras
        
        // Thresholds de segurança
        private const double FpsDegradationThreshold = 0.15; // 15% de degradação
        private const double CpuSpikeThreshold = 20.0; // Aumento de 20% em CPU
        private const double GpuSpikeThreshold = 20.0; // Aumento de 20% em GPU
        
        // Contador de falhas consecutivas
        private int _consecutiveFailures = 0;
        private const int MaxConsecutiveFailures = 3;
        
        public SafetySystem(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }
        
        /// <summary>
        /// Verifica se a última ação causou degradação de performance
        /// </summary>
        public SafetyCheckResult CheckStability(SystemMetrics currentMetrics, SystemMetrics? baselineMetrics = null)
        {
            var result = new SafetyCheckResult
            {
                IsStable = true,
                ShouldRollback = false,
                Reason = "Sistema estável"
            };
            
            // Adicionar ao histórico
            _metricsHistory.Enqueue(currentMetrics);
            if (_metricsHistory.Count > MaxHistorySize)
            {
                _metricsHistory.Dequeue();
            }
            
            // Se não temos histórico suficiente, não podemos verificar
            if (_metricsHistory.Count < 2)
            {
                return result;
            }
            
            // Comparar com baseline se disponível
            if (baselineMetrics != null)
            {
                // Verificar degradação de FPS
                if (baselineMetrics.Fps > 0 && currentMetrics.Fps > 0)
                {
                    var fpsDegradation = (baselineMetrics.Fps - currentMetrics.Fps) / baselineMetrics.Fps;
                    if (fpsDegradation > FpsDegradationThreshold)
                    {
                        result.IsStable = false;
                        result.ShouldRollback = true;
                        result.Reason = $"FPS degradou {fpsDegradation * 100:F1}% (de {baselineMetrics.Fps:F1} para {currentMetrics.Fps:F1})";
                        _logger.LogWarning($"[SafetySystem] ⚠️ {result.Reason}");
                        return result;
                    }
                }
                
                // Verificar spike de CPU
                if (currentMetrics.CpuUsagePercent > baselineMetrics.CpuUsagePercent + CpuSpikeThreshold)
                {
                    result.IsStable = false;
                    result.ShouldRollback = true;
                    result.Reason = $"CPU aumentou {currentMetrics.CpuUsagePercent - baselineMetrics.CpuUsagePercent:F1}% (de {baselineMetrics.CpuUsagePercent:F1}% para {currentMetrics.CpuUsagePercent:F1}%)";
                    _logger.LogWarning($"[SafetySystem] ⚠️ {result.Reason}");
                    return result;
                }
                
                // Verificar spike de GPU
                if (currentMetrics.GpuUsagePercent > baselineMetrics.GpuUsagePercent + GpuSpikeThreshold)
                {
                    result.IsStable = false;
                    result.ShouldRollback = true;
                    result.Reason = $"GPU aumentou {currentMetrics.GpuUsagePercent - baselineMetrics.GpuUsagePercent:F1}% (de {baselineMetrics.GpuUsagePercent:F1}% para {currentMetrics.GpuUsagePercent:F1}%)";
                    _logger.LogWarning($"[SafetySystem] ⚠️ {result.Reason}");
                    return result;
                }
            }
            
            // Verificar tendência de degradação no histórico
            if (_metricsHistory.Count >= 3)
            {
                var recent = _metricsHistory.TakeLast(3).ToList();
                var oldest = recent[0];
                var newest = recent[2];
                
                // Se FPS está caindo consistentemente
                if (oldest.Fps > 0 && newest.Fps > 0 && oldest.Fps > newest.Fps)
                {
                    var degradation = (oldest.Fps - newest.Fps) / oldest.Fps;
                    if (degradation > FpsDegradationThreshold)
                    {
                        result.IsStable = false;
                        result.ShouldRollback = true;
                        result.Reason = $"FPS caindo consistentemente (de {oldest.Fps:F1} para {newest.Fps:F1})";
                        _logger.LogWarning($"[SafetySystem] ⚠️ {result.Reason}");
                        return result;
                    }
                }
            }
            
            return result;
        }
        
        /// <summary>
        /// Registra uma falha (para desativar governor se muitas falhas)
        /// </summary>
        public void RegisterFailure()
        {
            _consecutiveFailures++;
            
            if (_consecutiveFailures >= MaxConsecutiveFailures)
            {
                _logger.LogError($"[SafetySystem] ⚠️ {_consecutiveFailures} falhas consecutivas - Governor deve ser desativado");
            }
        }
        
        /// <summary>
        /// Reseta contador de falhas (quando ação é bem-sucedida)
        /// </summary>
        public void ResetFailureCount()
        {
            _consecutiveFailures = 0;
        }
        
        /// <summary>
        /// Verifica se governor deve ser desativado devido a muitas falhas
        /// </summary>
        public bool ShouldDisableGovernor()
        {
            return _consecutiveFailures >= MaxConsecutiveFailures;
        }
        
        /// <summary>
        /// Limpa histórico
        /// </summary>
        public void ClearHistory()
        {
            _metricsHistory.Clear();
            _consecutiveFailures = 0;
        }
    }
    
    /// <summary>
    /// Resultado da verificação de segurança
    /// </summary>
    internal class SafetyCheckResult
    {
        public bool IsStable { get; set; }
        public bool ShouldRollback { get; set; }
        public string Reason { get; set; } = string.Empty;
    }
}

