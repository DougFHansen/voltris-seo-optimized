using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using VoltrisOptimizer.Interfaces;

namespace VoltrisOptimizer.Services.Gamer.Implementation
{
    /// <summary>
    /// CORREÇÃO CRÍTICA #6: LOGS E AUDITORIA ESTRUTURADA
    /// 
    /// Objetivo: Rastrear TODAS as otimizações aplicadas, falhas e reversões
    /// Formato: Timestamp, Serviço, Ação, Resultado, Motivo técnico
    /// </summary>
    public class GamerModeAuditor
    {
        private readonly ILoggingService _logger;
        private readonly List<AuditEntry> _entries = new();
        private readonly string _auditFilePath;

        public GamerModeAuditor(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _auditFilePath = Path.Combine(
                AppDomain.CurrentDomain.BaseDirectory, 
                "Logs", 
                $"gamer_mode_audit_{DateTime.Now:yyyyMMdd_HHmmss}.json");
        }

        /// <summary>
        /// Registra otimização aplicada
        /// </summary>
        public void LogOptimization(string service, string action, bool success, string? details = null)
        {
            var entry = new AuditEntry
            {
                Timestamp = DateTime.Now,
                Service = service,
                Action = action,
                Result = success ? "SUCCESS" : "FAILED",
                Details = details ?? string.Empty,
                Type = "OPTIMIZATION"
            };

            _entries.Add(entry);
            
            if (success)
            {
                _logger.LogSuccess($"[Audit] ✅ {service}: {action}");
            }
            else
            {
                _logger.LogWarning($"[Audit] ❌ {service}: {action} - {details}");
            }
        }

        /// <summary>
        /// Registra reversão pelo Windows
        /// </summary>
        public void LogReversion(string service, string setting, string expectedValue, string actualValue)
        {
            var entry = new AuditEntry
            {
                Timestamp = DateTime.Now,
                Service = service,
                Action = $"REVERSION: {setting}",
                Result = "REVERTED_BY_WINDOWS",
                Details = $"Expected: {expectedValue}, Actual: {actualValue}",
                Type = "REVERSION"
            };

            _entries.Add(entry);
            _logger.LogWarning($"[Audit] 🔄 REVERTIDO: {service}.{setting}");
        }

        /// <summary>
        /// Registra falha de driver
        /// </summary>
        public void LogDriverFailure(string vendor, string operation, string reason)
        {
            var entry = new AuditEntry
            {
                Timestamp = DateTime.Now,
                Service = "GPU_DRIVER",
                Action = $"{vendor}: {operation}",
                Result = "DRIVER_NOT_SUPPORTED",
                Details = reason,
                Type = "DRIVER_FAILURE"
            };

            _entries.Add(entry);
            _logger.LogWarning($"[Audit] ⚠️ Driver {vendor}: {operation} - {reason}");
        }

        /// <summary>
        /// Registra métrica de performance
        /// </summary>
        public void LogMetric(string metric, double value, string unit)
        {
            var entry = new AuditEntry
            {
                Timestamp = DateTime.Now,
                Service = "METRICS",
                Action = metric,
                Result = $"{value:F2} {unit}",
                Details = string.Empty,
                Type = "METRIC"
            };

            _entries.Add(entry);
        }

        /// <summary>
        /// Gera relatório de auditoria
        /// </summary>
        public AuditReport GenerateReport()
        {
            int totalOptimizations = 0;
            int successfulOptimizations = 0;
            int failedOptimizations = 0;
            int reversions = 0;
            int driverFailures = 0;

            foreach (var entry in _entries)
            {
                switch (entry.Type)
                {
                    case "OPTIMIZATION":
                        totalOptimizations++;
                        if (entry.Result == "SUCCESS") successfulOptimizations++;
                        else failedOptimizations++;
                        break;
                    
                    case "REVERSION":
                        reversions++;
                        break;
                    
                    case "DRIVER_FAILURE":
                        driverFailures++;
                        break;
                }
            }

            var report = new AuditReport
            {
                TotalOptimizations = totalOptimizations,
                SuccessfulOptimizations = successfulOptimizations,
                FailedOptimizations = failedOptimizations,
                Reversions = reversions,
                DriverFailures = driverFailures,
                EffectivenessRate = totalOptimizations > 0 
                    ? (double)successfulOptimizations / totalOptimizations * 100 
                    : 0,
                Entries = _entries
            };

            return report;
        }

        /// <summary>
        /// Salva auditoria em arquivo JSON
        /// </summary>
        public void SaveToFile()
        {
            try
            {
                var report = GenerateReport();
                
                Directory.CreateDirectory(Path.GetDirectoryName(_auditFilePath)!);
                
                var json = JsonSerializer.Serialize(report, new JsonSerializerOptions 
                { 
                    WriteIndented = true 
                });
                
                File.WriteAllText(_auditFilePath, json);
                
                _logger.LogSuccess($"[Audit] Relatório salvo: {_auditFilePath}");
            }
            catch (Exception ex)
            {
                _logger.LogError($"[Audit] Erro ao salvar relatório: {ex.Message}", ex);
            }
        }

        /// <summary>
        /// Exibe resumo no console
        /// </summary>
        public void PrintSummary()
        {
            var report = GenerateReport();

            _logger.LogInfo("═══════════════════════════════════════════");
            _logger.LogInfo("📊 RELATÓRIO DE AUDITORIA - MODO GAMER");
            _logger.LogInfo("═══════════════════════════════════════════");
            _logger.LogInfo($"Total de Otimizações: {report.TotalOptimizations}");
            _logger.LogInfo($"✅ Sucesso: {report.SuccessfulOptimizations}");
            _logger.LogInfo($"❌ Falhas: {report.FailedOptimizations}");
            _logger.LogInfo($"🔄 Reversões pelo Windows: {report.Reversions}");
            _logger.LogInfo($"⚠️ Falhas de Driver: {report.DriverFailures}");
            _logger.LogInfo($"📈 Taxa de Efetividade: {report.EffectivenessRate:F1}%");
            _logger.LogInfo("═══════════════════════════════════════════");

            if (report.Reversions > 0)
            {
                _logger.LogWarning($"⚠️ ATENÇÃO: {report.Reversions} configurações foram revertidas pelo Windows");
                _logger.LogWarning("Isso reduz a efetividade do Modo Gamer");
            }

            if (report.DriverFailures > 0)
            {
                _logger.LogWarning($"⚠️ ATENÇÃO: {report.DriverFailures} otimizações de driver falharam");
                _logger.LogWarning("Configure manualmente via painel do fabricante (GeForce/Adrenalin)");
            }
        }
    }

    /// <summary>
    /// Entrada de auditoria
    /// </summary>
    public class AuditEntry
    {
        public DateTime Timestamp { get; set; }
        public string Service { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public string Result { get; set; } = string.Empty;
        public string Details { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
    }

    /// <summary>
    /// Relatório de auditoria
    /// </summary>
    public class AuditReport
    {
        public int TotalOptimizations { get; set; }
        public int SuccessfulOptimizations { get; set; }
        public int FailedOptimizations { get; set; }
        public int Reversions { get; set; }
        public int DriverFailures { get; set; }
        public double EffectivenessRate { get; set; }
        public List<AuditEntry> Entries { get; set; } = new();
    }
}
