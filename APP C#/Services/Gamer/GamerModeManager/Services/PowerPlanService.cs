using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Text.RegularExpressions;
using System.Linq;

namespace VoltrisOptimizer.Services.Gamer.GamerModeManager
{
    /// <summary>
    /// Tipos de plano de energia
    /// </summary>
    public enum PowerPlanType
    {
        Balanced,
        HighPerformance,
        UltimatePerformance,
        PowerSaver
    }
    
    /// <summary>
    /// Interface do serviço de plano de energia
    /// </summary>
    public interface IPowerPlanService : IDisposable
    {
        (string Guid, string Name) GetActivePowerPlan();
        (string Guid, string Name) SetPowerPlan(PowerPlanType type);
        bool SetPowerPlanByGuid(string guid);
        IReadOnlyList<(string Guid, string Name)> GetAvailablePlans();
        string RunPowerCfg(string args);
    }
    
    /// <summary>
    /// Serviço de gerenciamento de planos de energia do Windows
    /// </summary>
    public class PowerPlanService : IPowerPlanService
    {
        private readonly ILoggingService _logger;
        
        // GUIDs padrão dos planos de energia do Windows
        private static readonly Dictionary<PowerPlanType, string> StandardGuids = new()
        {
            { PowerPlanType.Balanced, "381b4222-f694-41f0-9685-ff5bb260df2e" },
            { PowerPlanType.HighPerformance, "8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c" },
            { PowerPlanType.UltimatePerformance, "e9a42b02-d5df-448d-aa00-03f14749eb61" },
            { PowerPlanType.PowerSaver, "a1841308-3541-4fab-bc81-f71556f20b4a" }
        };
        
        public PowerPlanService(ILoggingService logger)
        {
            _logger = logger;
        }
        
        /// <summary>
        /// Obtém o plano de energia ativo atual
        /// </summary>
        public (string Guid, string Name) GetActivePowerPlan()
        {
            try
            {
                var output = RunPowerCfg("/getactivescheme");
                
                // Parse output: "Power Scheme GUID: GUID  (Name)"
                var match = Regex.Match(output, @"([a-f0-9\-]{36})\s*\(([^)]+)\)", RegexOptions.IgnoreCase);
                
                if (match.Success)
                {
                    return (match.Groups[1].Value, match.Groups[2].Value.Trim());
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[PowerPlan] Erro ao obter plano ativo: {ex.Message}");
            }
            
            return ("", "Desconhecido");
        }
        
        /// <summary>
        /// Define o plano de energia por tipo
        /// </summary>
        public (string Guid, string Name) SetPowerPlan(PowerPlanType type)
        {
            try
            {
                // Tentar Ultimate Performance primeiro se solicitado
                if (type == PowerPlanType.UltimatePerformance)
                {
                    // Verificar se existe
                    var plans = GetAvailablePlans();
                    var ultimate = plans.FirstOrDefault(p => 
                        p.Name.Contains("Ultimate", StringComparison.OrdinalIgnoreCase) ||
                        p.Guid.Equals(StandardGuids[PowerPlanType.UltimatePerformance], StringComparison.OrdinalIgnoreCase));
                    
                    if (!string.IsNullOrEmpty(ultimate.Guid))
                    {
                        if (SetPowerPlanByGuid(ultimate.Guid))
                        {
                            return (ultimate.Guid, ultimate.Name);
                        }
                    }
                    
                    // Se não existe, tentar criar
                    if (TryCreateUltimatePerformancePlan(out var newGuid))
                    {
                        if (SetPowerPlanByGuid(newGuid))
                        {
                            return (newGuid, "Ultimate Performance");
                        }
                    }
                    
                    // Fallback para High Performance
                    type = PowerPlanType.HighPerformance;
                    _logger.LogInfo("[PowerPlan] Ultimate Performance não disponível, usando High Performance");
                }
                
                // Usar GUID padrão
                if (StandardGuids.TryGetValue(type, out var guid))
                {
                    if (SetPowerPlanByGuid(guid))
                    {
                        var name = type.ToString();
                        return (guid, name);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[PowerPlan] Erro ao definir plano: {ex.Message}");
            }
            
            return GetActivePowerPlan();
        }
        
        /// <summary>
        /// Define plano de energia por GUID
        /// </summary>
        public bool SetPowerPlanByGuid(string guid)
        {
            try
            {
                var output = RunPowerCfg($"/setactive {guid}");
                
                // Verificar se foi aplicado
                var current = GetActivePowerPlan();
                return current.Guid.Equals(guid, StringComparison.OrdinalIgnoreCase);
            }
            catch (Exception ex)
            {
                _logger.LogError($"[PowerPlan] Erro ao definir plano {guid}: {ex.Message}");
                return false;
            }
        }
        
        /// <summary>
        /// Obtém lista de planos disponíveis
        /// </summary>
        public IReadOnlyList<(string Guid, string Name)> GetAvailablePlans()
        {
            var plans = new List<(string, string)>();
            
            try
            {
                var output = RunPowerCfg("/list");
                
                // Parse cada linha
                var matches = Regex.Matches(output, @"([a-f0-9\-]{36})\s*\(([^)]+)\)", RegexOptions.IgnoreCase);
                
                foreach (Match match in matches)
                {
                    plans.Add((match.Groups[1].Value, match.Groups[2].Value.Trim()));
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[PowerPlan] Erro ao listar planos: {ex.Message}");
            }
            
            return plans.AsReadOnly();
        }
        
        /// <summary>
        /// Tenta criar o plano Ultimate Performance se não existir
        /// </summary>
        private bool TryCreateUltimatePerformancePlan(out string newGuid)
        {
            newGuid = "";
            
            try
            {
                // Método 1: Tentar importar o esquema oficial de Ultimate Performance (e9a4...)
                var output = RunPowerCfg($"/duplicatescheme e9a42b02-d5df-448d-aa00-03f14749eb61");
                
                var match = Regex.Match(output, @"([a-f0-9\-]{36})", RegexOptions.IgnoreCase);
                if (match.Success)
                {
                    newGuid = match.Groups[1].Value;
                    _logger.LogInfo($"[PowerPlan] Plano Ultimate Performance oficial importado: {newGuid}");
                    return true;
                }

                // Método 2: Duplicar o plano High Performance como fallback
                _logger.LogInfo("[PowerPlan] Falha ao importar oficial, tentando duplicar High Performance...");
                output = RunPowerCfg($"/duplicatescheme {StandardGuids[PowerPlanType.HighPerformance]}");
                
                match = Regex.Match(output, @"([a-f0-9\-]{36})", RegexOptions.IgnoreCase);
                if (match.Success)
                {
                    newGuid = match.Groups[1].Value;
                    
                    // Renomear
                    RunPowerCfg($"/changename {newGuid} \"Ultimate Performance\" \"Voltris Ultimate Performance Plan\"");
                    
                    // Aplicar configurações agressivas
                    ApplyUltimateSettings(newGuid);
                    
                    _logger.LogInfo($"[PowerPlan] Plano Ultimate Performance criado por duplicação: {newGuid}");
                    return true;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[PowerPlan] Não foi possível criar Ultimate Performance: {ex.Message}");
            }
            
            return false;
        }
        
        /// <summary>
        /// Aplica configurações de performance máxima
        /// </summary>
        private void ApplyUltimateSettings(string guid)
        {
            try
            {
                // Processor performance boost mode = Aggressive
                RunPowerCfg($"/setacvalueindex {guid} 54533251-82be-4824-96c1-47b60b740d00 be337238-0d82-4146-a960-4f3749d470c7 2");
                
                // Minimum processor state = 100%
                RunPowerCfg($"/setacvalueindex {guid} 54533251-82be-4824-96c1-47b60b740d00 893dee8e-2bef-41e0-89c6-b55d0929964c 100");
                
                // Maximum processor state = 100%
                RunPowerCfg($"/setacvalueindex {guid} 54533251-82be-4824-96c1-47b60b740d00 bc5038f7-23e0-4960-96da-33abaf5935ec 100");
                
                // System cooling policy = Active
                RunPowerCfg($"/setacvalueindex {guid} 54533251-82be-4824-96c1-47b60b740d00 94d3a615-a899-4ac5-ae2b-e4d8f634367f 1");
                
                // USB selective suspend = Disabled
                RunPowerCfg($"/setacvalueindex {guid} 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0");
                
                // PCI Express Link State Power Management = Off
                RunPowerCfg($"/setacvalueindex {guid} 501a4d13-42af-4429-9fd1-a8218c268e20 ee12f906-d277-404b-b6da-e5fa1a576df5 0");
            }
            catch { }
        }
        
        public string RunPowerCfg(string args)
        {
            try
            {
                using var proc = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = "powercfg",
                        Arguments = args,
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true
                    }
                };
                
                proc.Start();
                var output = proc.StandardOutput.ReadToEnd();
                var error = proc.StandardError.ReadToEnd();
                proc.WaitForExit(5000);
                
                if (proc.ExitCode != 0 && !string.IsNullOrWhiteSpace(error))
                {
                    _logger.LogWarning($"[PowerPlan] powercfg {args} falhou (ExitCode: {proc.ExitCode}): {error.Trim()}");
                }
                
                return output;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[PowerPlan] Exceção ao executar powercfg {args}: {ex.Message}");
                return string.Empty;
            }
        }
        
        public void Dispose()
        {
            // Nada a liberar
        }
    }
}
