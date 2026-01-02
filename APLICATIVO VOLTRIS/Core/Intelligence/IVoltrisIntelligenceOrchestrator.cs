using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;

namespace VoltrisOptimizer.Core.Intelligence
{
    /// <summary>
    /// Interface principal do Voltris Intelligence Framework (VIF)
    /// Orquestra todos os módulos de inteligência de forma centralizada
    /// </summary>
    public interface IVoltrisIntelligenceOrchestrator : IDisposable
    {
        /// <summary>
        /// Inicia o loop de inteligência (executa a cada 1 segundo)
        /// </summary>
        void Start();

        /// <summary>
        /// Para o loop de inteligência
        /// </summary>
        void Stop();

        /// <summary>
        /// Indica se o orquestrador está ativo
        /// </summary>
        bool IsActive { get; }

        /// <summary>
        /// Obtém o status atual do sistema de inteligência
        /// </summary>
        IntelligenceStatus GetStatus();

        /// <summary>
        /// Força uma execução imediata do loop (útil para testes)
        /// </summary>
        Task ExecuteLoopAsync(CancellationToken cancellationToken = default);
    }
}

