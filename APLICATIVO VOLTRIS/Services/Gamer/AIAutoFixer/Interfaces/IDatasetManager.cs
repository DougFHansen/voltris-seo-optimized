using System.Collections.Generic;
using System.Threading.Tasks;
using VoltrisOptimizer.Services.Gamer.AIAutoFixer.Models;

namespace VoltrisOptimizer.Services.Gamer.AIAutoFixer.Interfaces
{
    /// <summary>
    /// Interface para gerenciamento de datasets de treinamento
    /// </summary>
    public interface IDatasetManager
    {
        /// <summary>
        /// Obtém o perfil de estado ideal
        /// </summary>
        IdealStateProfile GetIdealStateProfile();

        /// <summary>
        /// Atualiza o perfil de estado ideal
        /// </summary>
        Task UpdateIdealStateProfileAsync(TelemetrySnapshot snapshot);

        /// <summary>
        /// Registra um problema detectado
        /// </summary>
        Task RegisterProblemAsync(ProblemRecord problem);

        /// <summary>
        /// Obtém histórico de problemas
        /// </summary>
        IReadOnlyList<ProblemRecord> GetProblemHistory(int maxItems = 1000);

        /// <summary>
        /// Registra uma correção bem-sucedida
        /// </summary>
        Task RegisterSuccessfulCorrectionAsync(AutoCorrection correction, TelemetrySnapshot before, TelemetrySnapshot after);

        /// <summary>
        /// Registra uma correção que falhou ou piorou
        /// </summary>
        Task RegisterFailedCorrectionAsync(AutoCorrection correction, TelemetrySnapshot before, TelemetrySnapshot after);

        /// <summary>
        /// Obtém correções bem-sucedidas similares
        /// </summary>
        List<AutoCorrection> GetSimilarSuccessfulCorrections(DiagnosticResult diagnostic);

        /// <summary>
        /// Obtém correções que falharam para evitar repetir
        /// </summary>
        List<AutoCorrection> GetFailedCorrections(DiagnosticResult diagnostic);

        /// <summary>
        /// Salva datasets em disco
        /// </summary>
        Task SaveDatasetsAsync();

        /// <summary>
        /// Carrega datasets do disco
        /// </summary>
        Task LoadDatasetsAsync();
    }
}


