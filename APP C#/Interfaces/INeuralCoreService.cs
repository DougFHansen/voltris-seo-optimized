using System;
using System.Threading.Tasks;

namespace VoltrisOptimizer.Interfaces
{
    /// <summary>
    /// Interface para o Núcleo Neural do Voltris - O motor de otimização de próxima geração.
    /// </summary>
    public interface INeuralCoreService
    {
        /// <summary>
        /// Inicia o monitoramento neural e as funções autônomas.
        /// </summary>
        void Start();

        /// <summary>
        /// Para o monitoramento neural.
        /// </summary>
        void Stop();

        /// <summary>
        /// Executa a "Cirurgia de Hardware" - Tweaks de baixo nível para SSDs e GPUs.
        /// </summary>
        Task PerformHardwareSurgeryAsync();

        /// <summary>
        /// Ativa ou desativa o Modo de Exclusividade de Kernel (Context-Aware Morphing).
        /// </summary>
        Task SetKernelExclusivityAsync(bool enable);

        /// <summary>
        /// Executa uma "Cura Preditiva" silenciosa baseada em anomalias detectadas.
        /// </summary>
        Task PerformPredictiveHealingAsync();
        
        /// <summary>
        /// Indica se o Núcleo Neural está ativo.
        /// </summary>
        bool IsActive { get; }
    }
}
