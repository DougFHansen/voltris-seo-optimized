using System;
using System.Diagnostics;
using System.Management;
using System.Text.Json;
using System.Threading.Tasks;
using VoltrisOptimizer.Interfaces;

namespace VoltrisOptimizer.Services.Shield
{
    public class DefenderIntegrationService
    {
        private readonly ILoggingService _logger;
        private readonly IProcessRunner _processRunner;
        
        public DefenderIntegrationService(ILoggingService logger, IProcessRunner processRunner)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _processRunner = processRunner ?? throw new ArgumentNullException(nameof(processRunner));
        }
        
        public async Task<DefenderStatus> GetStatusAsync()
        {
            _logger.LogInfo("[DefenderIntegration] Obtendo status do Windows Defender...");
            
            // Estratégia 1: WMI/CIM (mais confiável, sem dependência de encoding)
            var status = TryGetStatusViaWmi();
            if (status != null)
            {
                _logger.LogSuccess($"[DefenderIntegration] Status obtido via WMI: Enabled={status.IsEnabled}, UpToDate={status.IsUpToDate}, Version={status.Version}");
                return status;
            }
            
            // Estratégia 2: PowerShell Get-MpComputerStatus
            status = await TryGetStatusViaPowerShellAsync();
            if (status != null)
            {
                _logger.LogSuccess($"[DefenderIntegration] Status obtido via PowerShell: Enabled={status.IsEnabled}, UpToDate={status.IsUpToDate}, Version={status.Version}");
                return status;
            }
            
            // Estratégia 3: Fallback por detecção de processo + SecurityCenter2
            status = TryGetStatusViaSecurityCenter();
            if (status != null)
            {
                _logger.LogSuccess($"[DefenderIntegration] Status obtido via SecurityCenter2: Enabled={status.IsEnabled}, UpToDate={status.IsUpToDate}");
                return status;
            }
            
            // Estratégia 4: Último recurso - verificar se o processo MsMpEng está rodando
            var fallback = new DefenderStatus();
            fallback.IsEnabled = _processRunner.IsProcessRunning("MsMpEng");
            fallback.RealTimeProtectionEnabled = fallback.IsEnabled;
            fallback.IsUpToDate = false; // Sem confirmação, não assumir
            _logger.LogWarning($"[DefenderIntegration] Fallback por processo: MsMpEng rodando={fallback.IsEnabled}");
            return fallback;
        }
        
        private DefenderStatus? TryGetStatusViaWmi()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher(
                    @"root\Microsoft\Windows\Defender",
                    "SELECT * FROM MSFT_MpComputerStatus");
                
                foreach (ManagementObject obj in searcher.Get())
                {
                    var status = new DefenderStatus();
                    
                    status.IsEnabled = GetWmiBool(obj, "AntivirusEnabled");
                    status.RealTimeProtectionEnabled = GetWmiBool(obj, "RealTimeProtectionEnabled");
                    
                    var sigVersion = obj["AntivirusSignatureVersion"];
                    status.Version = sigVersion?.ToString() ?? string.Empty;
                    
                    // Verificar frescor das definições (últimas 48 horas)
                    var lastUpdated = obj["AntivirusSignatureLastUpdated"];
                    if (lastUpdated is string dateStr && DateTime.TryParse(dateStr, out var parsedDate))
                    {
                        status.IsUpToDate = (DateTime.Now - parsedDate).TotalHours <= 48;
                    }
                    else if (lastUpdated is DateTime dt)
                    {
                        status.IsUpToDate = (DateTime.Now - dt).TotalHours <= 48;
                    }
                    else
                    {
                        // Se não conseguiu parsear a data, verificar via ManagementDateTime
                        try
                        {
                            var dmtfDate = obj["AntivirusSignatureLastUpdated"]?.ToString();
                            if (!string.IsNullOrEmpty(dmtfDate))
                            {
                                var converted = ManagementDateTimeConverter.ToDateTime(dmtfDate);
                                status.IsUpToDate = (DateTime.Now - converted).TotalHours <= 48;
                            }
                        }
                        catch { /* Não conseguiu parsear, manter false */ }
                    }
                    
                    return status;
                }
            }
            catch (ManagementException mex)
            {
                _logger.LogWarning($"[DefenderIntegration] WMI Defender namespace não disponível: {mex.Message}");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[DefenderIntegration] Falha ao obter status via WMI: {ex.Message}");
            }
            
            return null;
        }
        
        private static bool GetWmiBool(ManagementObject obj, string propertyName)
        {
            try
            {
                var val = obj[propertyName];
                if (val is bool b) return b;
                if (val != null && bool.TryParse(val.ToString(), out var parsed)) return parsed;
            }
            catch { }
            return false;
        }
        
        private async Task<DefenderStatus?> TryGetStatusViaPowerShellAsync()
        {
            try
            {
                var psCommand = "Get-MpComputerStatus | Select-Object AntivirusEnabled, RealTimeProtectionEnabled, AntivirusSignatureLastUpdated, AntivirusSignatureVersion | ConvertTo-Json";
                var result = await _processRunner.RunAsync("powershell.exe", $"-NoProfile -Command \"{psCommand}\"", 30000);
                
                if (!result.Success || string.IsNullOrWhiteSpace(result.StandardOutput))
                {
                    _logger.LogWarning($"[DefenderIntegration] PowerShell falhou: ExitCode={result.ExitCode}, Erro={result.StandardError}");
                    return null;
                }
                
                // Limpar output (remover BOM, whitespace extra)
                var jsonOutput = result.StandardOutput.Trim().TrimStart('\uFEFF');
                
                try
                {
                    using var doc = JsonDocument.Parse(jsonOutput);
                    var root = doc.RootElement;
                    
                    var status = new DefenderStatus();
                    
                    if (root.TryGetProperty("AntivirusEnabled", out var avEnabled))
                        status.IsEnabled = avEnabled.GetBoolean();
                    
                    if (root.TryGetProperty("RealTimeProtectionEnabled", out var rtEnabled))
                        status.RealTimeProtectionEnabled = rtEnabled.GetBoolean();
                    
                    if (root.TryGetProperty("AntivirusSignatureVersion", out var sigVersion))
                        status.Version = sigVersion.GetString() ?? string.Empty;
                    
                    if (root.TryGetProperty("AntivirusSignatureLastUpdated", out var lastUpdated))
                    {
                        status.IsUpToDate = ParseDefenderDateAndCheckFreshness(lastUpdated, 48);
                    }
                    
                    return status;
                }
                catch (JsonException jsonEx)
                {
                    _logger.LogWarning($"[DefenderIntegration] Falha ao parsear JSON: {jsonEx.Message}. Output: {jsonOutput.Substring(0, Math.Min(200, jsonOutput.Length))}");
                    
                    // Fallback: parsing por texto
                    var status = new DefenderStatus();
                    status.IsEnabled = jsonOutput.Contains("\"AntivirusEnabled\"", StringComparison.OrdinalIgnoreCase) 
                                    && (jsonOutput.Contains(": true", StringComparison.OrdinalIgnoreCase) 
                                        || jsonOutput.Contains(":true", StringComparison.OrdinalIgnoreCase));
                    return status;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[DefenderIntegration] Exceção no PowerShell: {ex.Message}");
                return null;
            }
        }
        
        private DefenderStatus? TryGetStatusViaSecurityCenter()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher(
                    @"root\SecurityCenter2",
                    "SELECT * FROM AntiVirusProduct");
                
                foreach (ManagementObject obj in searcher.Get())
                {
                    var displayName = obj["displayName"]?.ToString() ?? "";
                    
                    // Procurar especificamente pelo Windows Defender / Microsoft Defender
                    if (!displayName.Contains("Windows Defender", StringComparison.OrdinalIgnoreCase) &&
                        !displayName.Contains("Microsoft Defender", StringComparison.OrdinalIgnoreCase))
                        continue;
                    
                    var status = new DefenderStatus();
                    
                    // productState é um bitmask: bits 12-15 = estado do produto, bits 4-7 = estado das definições
                    var productState = Convert.ToUInt32(obj["productState"]);
                    
                    // Bit 12 (0x1000) = ativado
                    status.IsEnabled = (productState & 0x1000) != 0;
                    status.RealTimeProtectionEnabled = status.IsEnabled;
                    
                    // Bit 4 (0x10) = definições desatualizadas (quando setado = desatualizado)
                    status.IsUpToDate = (productState & 0x10) == 0;
                    
                    return status;
                }
            }
            catch (ManagementException mex)
            {
                _logger.LogWarning($"[DefenderIntegration] SecurityCenter2 não disponível: {mex.Message}");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[DefenderIntegration] Falha ao obter status via SecurityCenter2: {ex.Message}");
            }
            
            return null;
        }
        
        private bool ParseDefenderDateAndCheckFreshness(JsonElement dateElement, int maxHours)
        {
            try
            {
                // PowerShell serializa DateTime como string ISO ou como objeto com ticks
                if (dateElement.ValueKind == JsonValueKind.String)
                {
                    var dateStr = dateElement.GetString();
                    if (DateTime.TryParse(dateStr, out var parsedDate))
                    {
                        return (DateTime.Now - parsedDate).TotalHours <= maxHours;
                    }
                }
                else if (dateElement.ValueKind == JsonValueKind.Object)
                {
                    // PowerShell pode serializar como {"value":"/Date(ticks)/","DisplayHint":...}
                    if (dateElement.TryGetProperty("value", out var valueStr))
                    {
                        var val = valueStr.GetString();
                        if (val != null && val.StartsWith("/Date(") && val.EndsWith(")/"))
                        {
                            var ticksStr = val.Substring(6, val.Length - 8);
                            if (long.TryParse(ticksStr, out var ticks))
                            {
                                var epoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
                                var date = epoch.AddMilliseconds(ticks).ToLocalTime();
                                return (DateTime.Now - date).TotalHours <= maxHours;
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[DefenderIntegration] Erro ao parsear data do Defender: {ex.Message}");
            }
            
            return false; // Na dúvida, reportar como desatualizado
        }
        
        public async Task<bool> StartQuickScanAsync()
        {
            try
            {
                _logger.LogInfo("[DefenderIntegration] Iniciando scan rápido do Defender...");
                
                // IMPORTANTE: Não esperar o scan terminar - apenas iniciar o processo
                // O Defender roda em background e pode levar vários minutos
                var psCommand = "Start-Process powershell -ArgumentList '-NoProfile -Command Start-MpScan -ScanType QuickScan' -WindowStyle Hidden";
                
                // Timeout curto apenas para iniciar o processo, não para esperar o scan
                var result = await _processRunner.RunAsync("powershell.exe", $"-NoProfile -Command \"{psCommand}\"", 5000);
                
                if (result.Success || result.ExitCode == 0)
                {
                    _logger.LogSuccess("[DefenderIntegration] Scan do Defender iniciado em background");
                    return true;
                }
                else
                {
                    _logger.LogWarning($"[DefenderIntegration] Falha ao iniciar scan: {result.StandardError}");
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("[DefenderIntegration] Erro ao iniciar scan", ex);
                return false;
            }
        }
        
        public async Task<bool> UpdateDefinitionsAsync()
        {
            try
            {
                _logger.LogInfo("[DefenderIntegration] Atualizando definições do Defender...");
                
                var psCommand = "Update-MpSignature";
                var result = await _processRunner.RunAsync("powershell.exe", $"-NoProfile -Command \"{psCommand}\"", 120000);
                
                if (result.Success)
                {
                    _logger.LogSuccess("[DefenderIntegration] Definições atualizadas");
                    return true;
                }
                else
                {
                    _logger.LogWarning($"[DefenderIntegration] Falha ao atualizar: {result.StandardError}");
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("[DefenderIntegration] Erro ao atualizar definições", ex);
                return false;
            }
        }
        
        private bool CheckDefenderAvailable()
        {
            try
            {
                return _processRunner.IsProcessRunning("MsMpEng");
            }
            catch
            {
                return false;
            }
        }
    }
}
