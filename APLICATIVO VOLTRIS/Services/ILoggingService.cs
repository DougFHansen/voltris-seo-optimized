using System;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Interface para o serviço de logging
    /// </summary>
    public interface ILoggingService : IDisposable
    {
        /// <summary>
        /// Registra uma mensagem de informação
        /// </summary>
        void LogInfo(string message);

        /// <summary>
        /// Registra uma mensagem de sucesso
        /// </summary>
        void LogSuccess(string message);

        /// <summary>
        /// Registra uma mensagem de aviso
        /// </summary>
        void LogWarning(string message);

        /// <summary>
        /// Registra uma mensagem de erro
        /// </summary>
        void LogError(string message, Exception? exception = null);

        /// <summary>
        /// Evento disparado quando uma nova entrada de log é criada
        /// </summary>
        event EventHandler<string>? LogEntryAdded;

        /// <summary>
        /// Limpa todos os logs
        /// </summary>
        void ClearLogs();

        /// <summary>
        /// Exporta os logs para um arquivo
        /// </summary>
        void ExportLogs(string filePath);

        /// <summary>
        /// Obtém todos os logs do arquivo atual
        /// </summary>
        string[] GetLogs();

        /// <summary>
        /// Obtém o caminho do diretório de logs
        /// </summary>
        string GetLogDirectory();
    }
}

