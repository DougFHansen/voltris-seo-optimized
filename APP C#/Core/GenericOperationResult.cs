using System;
using System.Collections.Generic;
using System.Linq;

namespace VoltrisOptimizer.Core
{
    /// <summary>
    /// Resultado genérico com valor de retorno para operações validadas.
    /// </summary>
    public class OperationResult<T>
    {
        public bool Success { get; private set; }
        public string? ErrorMessage { get; private set; }
        public string? Details { get; private set; }
        public Dictionary<string, object> Metadata { get; private set; }
        public DateTime Timestamp { get; private set; }
        public bool WasValidated { get; private set; }
        public T? Value { get; private set; }
        
        private OperationResult()
        {
            Metadata = new Dictionary<string, object>();
            Timestamp = DateTime.Now;
        }
        
        public static OperationResult<T> CreateSuccess(T value, string? details = null, bool validated = true)
        {
            if (!validated)
            {
                throw new InvalidOperationException(
                    "CRITICAL: Cannot create Success result without validation.");
            }
            
            return new OperationResult<T>
            {
                Success = true,
                Value = value,
                Details = details,
                WasValidated = true
            };
        }
        
        public static OperationResult<T> CreateFailure(string errorMessage, string? details = null)
        {
            return new OperationResult<T>
            {
                Success = false,
                ErrorMessage = errorMessage,
                Details = details,
                Value = default,
                WasValidated = true
            };
        }
        
        public OperationResult<T> WithMetadata(string key, object value)
        {
            Metadata[key] = value;
            return this;
        }
        
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
    }
}
