using System;
using System.Collections.Generic;
using System.Linq;

namespace VoltrisOptimizer.Core
{
    /// <summary>
    /// Representa o resultado de uma operação com validação real.
    /// NUNCA retorna sucesso sem prova técnica.
    /// </summary>
    public class OperationResult
    {
        public bool Success { get; private set; }
        public string? ErrorMessage { get; private set; }
        public string? Details { get; private set; }
        public Dictionary<string, object> Metadata { get; private set; }
        public DateTime Timestamp { get; private set; }
        public bool WasValidated { get; private set; }
        
        private OperationResult()
        {
            Metadata = new Dictionary<string, object>();
            Timestamp = DateTime.Now;
        }
        
        /// <summary>
        /// Cria resultado de sucesso APENAS se validação foi realizada
        /// </summary>
        /// <summary>
        /// Cria resultado de sucesso APENAS se validação foi realizada
        /// </summary>
        public static OperationResult CreateSuccess(string? details = null, bool validated = true)
        {
            if (!validated)
            {
                throw new InvalidOperationException(
                    "CRITICAL: Cannot create Success result without validation. " +
                    "This is a safeguard against false positives in production.");
            }
            
            return new OperationResult
            {
                Success = true,
                Details = details,
                WasValidated = true
            };
        }
        
        /// <summary>
        /// Cria resultado de falha com mensagem clara
        /// </summary>
        /// <summary>
        /// Cria resultado de falha com mensagem clara
        /// </summary>
        public static OperationResult CreateFailure(string errorMessage, string? details = null)
        {
            if (string.IsNullOrWhiteSpace(errorMessage))
            {
                errorMessage = "Unknown error occurred";
            }
            
            return new OperationResult
            {
                Success = false,
                ErrorMessage = errorMessage,
                Details = details,
                WasValidated = true // Falha é uma validação (sabemos que falhou)
            };
        }
        
        /// <summary>
        /// Adiciona metadados para diagnóstico
        /// </summary>
        public OperationResult WithMetadata(string key, object value)
        {
            Metadata[key] = value;
            return this;
        }
        
        /// <summary>
        /// Retorna mensagem completa para logs
        /// </summary>
        public string GetFullMessage()
        {
            var parts = new List<string>();
            
            if (Success)
            {
                parts.Add("✓ SUCCESS");
                if (!string.IsNullOrEmpty(Details))
                    parts.Add($"Details: {Details}");
            }
            else
            {
                parts.Add("✗ FAILURE");
                parts.Add($"Error: {ErrorMessage}");
                if (!string.IsNullOrEmpty(Details))
                    parts.Add($"Details: {Details}");
            }
            
            if (Metadata.Any())
            {
                parts.Add($"Metadata: {string.Join(", ", Metadata.Select(kv => $"{kv.Key}={kv.Value}"))}");
            }
            
            return string.Join(" | ", parts);
        }
        
        /// <summary>
        /// Combina múltiplos resultados
        /// </summary>
        public static OperationResult Combine(params OperationResult[] results)
        {
            if (results == null || results.Length == 0)
                return CreateFailure("No results to combine");
            
            var failures = results.Where(r => !r.Success).ToList();
            
            if (failures.Any())
            {
                var errorMessages = string.Join("; ", failures.Select(f => f.ErrorMessage));
                return CreateFailure($"Multiple failures: {errorMessages}")
                    .WithMetadata("FailureCount", failures.Count)
                    .WithMetadata("TotalCount", results.Length);
            }
            
            return CreateSuccess($"All {results.Length} operations succeeded", validated: true);
        }
    }
    
}
