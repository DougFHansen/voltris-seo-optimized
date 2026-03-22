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
        
        // Thresholds de segurança (ajustados para serem mais proativos mas evitar falsos positivos)
        private const double FpsDegradationThreshold = 0.45; // 45% de degradação vs baseline (antigo 55%)
        private const double TrendDegradationThreshold = 0.35; // 35% para tendência de queda (antigo 45%)
        private const double CpuSpikeThreshold = 30.0; // Aumento de 30% em CPU (antigo 40%)
        private const double GpuSpikeThreshold = 30.0; // Aumento de 30% em GPU (antigo 35%)
        private const double RamSpikeThreshold = 15.0; // Aumento de 15% em RAM (novo)
        
        // Contador de falhas consecutivas
        private int _consecutiveFailures = 0;
        private const int MaxConsecutiveFailures = 12; // Mais tolerante a flutuações normais de FPS em jogos
        
        public SafetySystem(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }
        
        private readonly object _lock = new object();
        
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
            
            if (currentMetrics == null)
            {
                return result;
            }

            lock (_lock)
            {
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
            }
            
            // Comparar com baseline se disponível
            if (baselineMetrics != null)
            {
                // Verificar degradação de FPS vs baseline
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

                // Verificar spike de RAM
                if (currentMetrics.RamUsagePercent > baselineMetrics.RamUsagePercent + RamSpikeThreshold)
                {
                    result.IsStable = false;
                    result.ShouldRollback = true;
                    result.Reason = $"RAM aumentou {currentMetrics.RamUsagePercent - baselineMetrics.RamUsagePercent:F1}% (de {baselineMetrics.RamUsagePercent:F1}% para {currentMetrics.RamUsagePercent:F1}%)";
                    _logger.LogWarning($"[SafetySystem] ⚠️ {result.Reason}");
                    return result;
                }
            }
            
            // Verificar tendência de degradação no histórico (requer queda CONSISTENTE em todas as amostras)
            if (_metricsHistory.Count >= 3)
            {
                try
                {
                    var recent = _metricsHistory.TakeLast(3).ToList();
                    
                    if (recent.All(m => m != null && m.Fps > 0))
                    {
                        // Exigir que TODAS as amostras estejam em queda (tendência real, não flutuação)
                        bool allDecreasing = recent[0].Fps > recent[1].Fps && recent[1].Fps > recent[2].Fps;
                        
                        if (allDecreasing)
                        {
                            var degradation = (recent[0].Fps - recent[2].Fps) / recent[0].Fps;
                            if (degradation > TrendDegradationThreshold)
                            {
                                result.IsStable = false;
                                result.ShouldRollback = true;
                                result.Reason = $"FPS caindo consistentemente (de {recent[0].Fps:F1} para {recent[2].Fps:F1})";
                                _logger.LogWarning($"[SafetySystem] ⚠️ {result.Reason}");
                                return result;
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                     // Catch-all para evitar crash do governor por erro no watchdog
                     _logger.LogWarning($"[SafetySystem] Erro ao verificar histórico: {ex.Message}");
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
            lock (_lock)
            {
                _metricsHistory.Clear();
                _consecutiveFailures = 0;
            }
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

