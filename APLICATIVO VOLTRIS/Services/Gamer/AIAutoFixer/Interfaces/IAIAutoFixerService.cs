using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Gamer.AIAutoFixer.Models;

namespace VoltrisOptimizer.Services.Gamer.AIAutoFixer.Interfaces
{
    /// <summary>
    /// Interface principal do AI Auto-Fixer
    /// Sistema inteligente de diagnóstico e correção automática do Modo Gamer
    /// </summary>
    public interface IAIAutoFixerService : IDisposable
    {
        /// <summary>
        /// Indica se o Auto-Fixer está ativo
        /// </summary>
        bool IsActive { get; }

        /// <summary>
        /// Evento disparado quando um problema é detectado
        /// </summary>
        event EventHandler<DiagnosticResult>? ProblemDetected;

        /// <summary>
        /// Evento disparado quando uma correção é aplicada
        /// </summary>
        event EventHandler<AutoCorrection>? CorrectionApplied;

        /// <summary>
        /// Evento disparado quando telemetria é atualizada
        /// </summary>
        event EventHandler<TelemetrySnapshot>? TelemetryUpdated;

        /// <summary>
        /// Inicia o monitoramento e auto-correção
        /// </summary>
        Task StartAsync(CancellationToken cancellationToken = default);

        /// <summary>
        /// Para o monitoramento
        /// </summary>
        Task StopAsync();

        /// <summary>
        /// Força uma análise imediata
        /// </summary>
        Task<DiagnosticResult> AnalyzeNowAsync();

        /// <summary>
        /// Aplica correções automáticas baseadas nos diagnósticos
        /// </summary>
        Task<List<AutoCorrection>> AutoCorrectAsync();

        /// <summary>
        /// Reverte melhorias que pioraram o desempenho
        /// </summary>
        Task<List<AutoCorrection>> RevertBadOptimizationsAsync();

        /// <summary>
        /// Obtém o snapshot atual de telemetria
        /// </summary>
        TelemetrySnapshot GetCurrentTelemetry();

        /// <summary>
        /// Obtém histórico de correções aplicadas
        /// </summary>
        IReadOnlyList<AutoCorrection> GetCorrectionHistory(int maxItems = 100);

        /// <summary>
        /// Obtém histórico de problemas detectados
        /// </summary>
        IReadOnlyList<DiagnosticResult> GetProblemHistory(int maxItems = 100);

        /// <summary>
        /// Obtém o perfil de estado ideal atual
        /// </summary>
        IdealStateProfile GetIdealStateProfile();

        /// <summary>
        /// Atualiza o perfil de estado ideal com dados atuais
        /// </summary>
        Task UpdateIdealStateProfileAsync();
    }
}


