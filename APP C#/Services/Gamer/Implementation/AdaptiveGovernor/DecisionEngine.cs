using System;
using System.Collections.Generic;
using VoltrisOptimizer.Services.Gamer.Models;

namespace VoltrisOptimizer.Services.Gamer.Implementation.AdaptiveGovernor
{
    /// <summary>
    /// Engine de decisão adaptativa baseada em métricas reais
    /// Decide se e o que fazer baseado em thresholds claros
    /// </summary>
    internal class DecisionEngine
    {
        private readonly ILoggingService _logger;
        
        // Thresholds configuráveis (valores seguros e testados)
        private const double FpsLowThreshold = 30.0; // FPS abaixo disso é considerado baixo
        private const double FpsTargetThreshold = 60.0; // FPS alvo
        private const double FrameTimeStutterThreshold = 33.33; // Frame time > 33.33ms = stutter (30 FPS)
        private const double CpuUsageHighThreshold = 85.0; // CPU > 85% = alta utilização
        private const double CpuUsageLowThreshold = 40.0; // CPU < 40% = baixa utilização
        private const double GpuUsageHighThreshold = 90.0; // GPU > 90% = alta utilização
        private const double GpuUsageLowThreshold = 50.0; // GPU < 50% = baixa utilização
        private const double RamUsageHighThreshold = 85.0; // RAM > 85% = alta utilização
        private const double ProcessorQueueLengthThreshold = 4.0; // Queue > 4 = CPU saturado
        private const double DpcPercentThreshold = 5.0; // DPC > 5% = drivers problemáticos
        private const double InterruptPercentThreshold = 3.0; // Interrupt > 3% = hardware problemático
        private const double PageFaultsHighThreshold = 1000.0; // Page faults > 1000/s = memória insuficiente
        
        // Histórico para detecção de padrões
        private readonly Queue<SystemMetrics> _metricsHistory = new Queue<SystemMetrics>();
        private const int MaxHistorySize = 10; // Últimas 10 amostras
        
        public DecisionEngine(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }
        
        /// <summary>
        /// Analisa métricas e decide se alguma ação deve ser tomada
        /// </summary>
        public DecisionResult AnalyzeAndDecide(SystemMetrics metrics)
        {
            // Adicionar ao histórico
            _metricsHistory.Enqueue(metrics);
            if (_metricsHistory.Count > MaxHistorySize)
            {
                _metricsHistory.Dequeue();
            }
            
            var decision = new DecisionResult
            {
                Timestamp = DateTime.UtcNow,
                ShouldAct = false,
                Action = null,
                Reason = "Métricas normais"
            };
            
            // Verificar se há stutter detectado
            var stutterDetected = DetectStutter(metrics);
            if (stutterDetected != null)
            {
                decision.StutterIncident = stutterDetected;
            }
            
            // Se FPS está baixo e CPU/GPU não estão saturados, podemos otimizar
            if (metrics.Fps > 0 && metrics.Fps < FpsLowThreshold)
            {
                // Verificar causa do FPS baixo
                if (metrics.CpuUsagePercent < CpuUsageLowThreshold && 
                    metrics.GpuUsagePercent < GpuUsageLowThreshold)
                {
                    // CPU e GPU subutilizados mas FPS baixo = problema de prioridade/scheduling
                    decision.ShouldAct = true;
                    decision.Action = new AdaptiveAction
                    {
                        Type = ActionType.IncreaseGamePriority,
                        Reason = $"FPS baixo ({metrics.Fps:F1}) com CPU ({metrics.CpuUsagePercent:F1}%) e GPU ({metrics.GpuUsagePercent:F1}%) subutilizados"
                    };
                    return decision;
                }
                
                if (metrics.CpuUsagePercent > CpuUsageHighThreshold)
                {
                    // CPU saturado
                    decision.ShouldAct = true;
                    decision.Action = new AdaptiveAction
                    {
                        Type = ActionType.ReduceBackgroundPriorities,
                        Reason = $"FPS baixo ({metrics.Fps:F1}) com CPU saturado ({metrics.CpuUsagePercent:F1}%)"
                    };
                    return decision;
                }
                
                if (metrics.GpuUsagePercent > GpuUsageHighThreshold)
                {
                    // GPU saturado - não podemos fazer muito, mas podemos limpar memória
                    if (metrics.RamUsagePercent > RamUsageHighThreshold)
                    {
                        decision.ShouldAct = true;
                        decision.Action = new AdaptiveAction
                        {
                            Type = ActionType.CleanStandbyList,
                            Reason = $"FPS baixo ({metrics.Fps:F1}) com GPU saturado ({metrics.GpuUsagePercent:F1}%) e RAM alta ({metrics.RamUsagePercent:F1}%)"
                        };
                        return decision;
                    }
                }
            }
            
            // Verificar stutter (frame time alto)
            if (metrics.FrameTimeMs > FrameTimeStutterThreshold && metrics.Fps > 0)
            {
                // Stutter detectado - analisar causa
                if (metrics.ProcessorQueueLength > ProcessorQueueLengthThreshold)
                {
                    // CPU queue alta = CPU saturado
                    decision.ShouldAct = true;
                    decision.Action = new AdaptiveAction
                    {
                        Type = ActionType.ReduceBackgroundPriorities,
                        Reason = $"Stutter detectado (FrameTime: {metrics.FrameTimeMs:F2}ms) com CPU queue alta ({metrics.ProcessorQueueLength:F1})"
                    };
                    return decision;
                }
                
                if (metrics.DpcPercent > DpcPercentThreshold)
                {
                    // DPC alto = drivers problemáticos
                    decision.ShouldAct = true;
                    decision.Action = new AdaptiveAction
                    {
                        Type = ActionType.ReduceBackgroundPriorities,
                        Reason = $"Stutter detectado (FrameTime: {metrics.FrameTimeMs:F2}ms) com DPC alto ({metrics.DpcPercent:F2}%)"
                    };
                    return decision;
                }
                
                if (metrics.PageFaultsPerSec > PageFaultsHighThreshold)
                {
                    // Page faults alto = memória insuficiente
                    decision.ShouldAct = true;
                    decision.Action = new AdaptiveAction
                    {
                        Type = ActionType.CleanStandbyList,
                        Reason = $"Stutter detectado (FrameTime: {metrics.FrameTimeMs:F2}ms) com page faults alto ({metrics.PageFaultsPerSec:F0}/s)"
                    };
                    return decision;
                }
            }
            
            // Verificar RAM alta
            if (metrics.RamUsagePercent > RamUsageHighThreshold && metrics.PageFaultsPerSec > 500)
            {
                decision.ShouldAct = true;
                decision.Action = new AdaptiveAction
                {
                    Type = ActionType.CleanStandbyList,
                    Reason = $"RAM alta ({metrics.RamUsagePercent:F1}%) com page faults ({metrics.PageFaultsPerSec:F0}/s)"
                };
                return decision;
            }
            
            // Se chegou aqui, não há ação necessária
            return decision;
        }
        
        /// <summary>
        /// Detecta stutter baseado em métricas
        /// </summary>
        private StutterIncident? DetectStutter(SystemMetrics metrics)
        {
            // Stutter = frame time > threshold OU variação grande de frame time
            if (metrics.FrameTimeMs > FrameTimeStutterThreshold && metrics.Fps > 0)
            {
                var cause = DetermineStutterCause(metrics);
                
                return new StutterIncident
                {
                    Timestamp = DateTime.UtcNow,
                    Cause = cause,
                    Summary = GenerateStutterSummary(metrics, cause),
                    TotalCpuPercent = metrics.CpuUsagePercent,
                    GameCpuPercent = metrics.GameCpuPercent,
                    ProcessorQueueLength = metrics.ProcessorQueueLength,
                    DpcPercent = metrics.DpcPercent,
                    InterruptPercent = metrics.InterruptPercent,
                    PageFaultsPerSec = metrics.PageFaultsPerSec,
                    GpuUtilPercent = metrics.GpuUsagePercent,
                    CpuFreqCurrentMhz = metrics.CpuFreqCurrentMhz,
                    CpuFreqMaxMhz = metrics.CpuFreqMaxMhz,
                    FrameAvgMs = metrics.FrameTimeMs,
                    FrameJitterMs = 0, // Seria calculado com histórico
                    NetworkJitterMs = 0
                };
            }
            
            return null;
        }
        
        private StutterCause DetermineStutterCause(SystemMetrics metrics)
        {
            // Priorizar causas mais prováveis
            if (metrics.ProcessorQueueLength > ProcessorQueueLengthThreshold)
                return StutterCause.CpuScheduling;
            
            if (metrics.DpcPercent > DpcPercentThreshold || metrics.InterruptPercent > InterruptPercentThreshold)
                return StutterCause.DriversInterrupt;
            
            if (metrics.PageFaultsPerSec > PageFaultsHighThreshold)
                return StutterCause.MemoryPaging;
            
            if (metrics.CpuUsagePercent > CpuUsageHighThreshold)
                return StutterCause.CpuScheduling;
            
            if (metrics.GpuUsagePercent > GpuUsageHighThreshold)
                return StutterCause.GpuRender;
            
            if (metrics.FrameTimeMs > FrameTimeStutterThreshold * 2)
                return StutterCause.FramePacing;
            
            return StutterCause.Unknown;
        }
        
        private string GenerateStutterSummary(SystemMetrics metrics, StutterCause cause)
        {
            return $"Stutter detectado: {cause} | FPS: {metrics.Fps:F1} | FrameTime: {metrics.FrameTimeMs:F2}ms | " +
                   $"CPU: {metrics.CpuUsagePercent:F1}% | GPU: {metrics.GpuUsagePercent:F1}% | " +
                   $"RAM: {metrics.RamUsagePercent:F1}%";
        }
        
        /// <summary>
        /// Limpa histórico de métricas
        /// </summary>
        public void ClearHistory()
        {
            _metricsHistory.Clear();
        }
    }
    
    /// <summary>
    /// Resultado da análise e decisão
    /// </summary>
    internal class DecisionResult
    {
        public DateTime Timestamp { get; set; }
        public bool ShouldAct { get; set; }
        public AdaptiveAction? Action { get; set; }
        public string Reason { get; set; } = string.Empty;
        public StutterIncident? StutterIncident { get; set; }
    }
    
    /// <summary>
    /// Ação adaptativa a ser executada
    /// </summary>
    internal class AdaptiveAction
    {
        public ActionType Type { get; set; }
        public string Reason { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    }
    
    /// <summary>
    /// Tipos de ações adaptativas (apenas ações seguras e reversíveis)
    /// </summary>
    internal enum ActionType
    {
        None,
        IncreaseGamePriority,      // Aumentar prioridade do processo do jogo
        ReduceBackgroundPriorities, // Reduzir prioridade de processos em background
        CleanStandbyList,           // Limpar standby list (se necessário)
        AdjustAffinity              // Ajustar afinidade de CPU (com limites)
    }
}

