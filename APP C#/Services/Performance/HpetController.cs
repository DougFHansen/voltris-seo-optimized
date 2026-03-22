using System;
using System.Diagnostics;
using System.Management;
using System.Runtime.InteropServices;
using Microsoft.Win32;

namespace VoltrisOptimizer.Services.Performance
{
    /// <summary>
    /// Controlador do HPET (High Precision Event Timer)
    /// 
    /// POLÍTICA INTELIGENTE DE HARDWARE:
    /// - Hardware LEGADO (Intel pré-8ª gen / AMD pré-Ryzen 1000): desativar HPET tem impacto real
    ///   pois o TSC nesses chips não é invariante e o Windows usa HPET como fallback.
    /// - Hardware MODERNO (Intel 8ª gen+ / Ryzen+): TSC invariante é o clock source padrão.
    ///   bcdedit /set useplatformclock false não tem efeito mensurável — Windows já ignora HPET.
    ///   Desativar o dispositivo via pnputil pode causar instabilidade sem benefício.
    ///
    /// Referências: Intel SDM Vol.3 §17.17, Microsoft KB2619234, Windows Internals 7th ed.
    /// </summary>
    public class HpetController : IDisposable
    {
        private readonly ILoggingService _logger;
        private bool _wasHpetEnabled = false;
        private bool _hpetStateChanged = false;
        private const string HPET_DEVICE_ID = "ACPI\\PNP0103";

        // Cache da decisão de hardware — calculado uma vez no construtor
        private readonly bool _hpetRelevantForThisHardware;

        public HpetController(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _hpetRelevantForThisHardware = IsHpetRelevantForCurrentHardware();
        }

        /// <summary>
        /// Detecta se desativar HPET tem impacto real neste hardware.
        /// Retorna true apenas para hardware legado onde o TSC não é invariante.
        /// </summary>
        private bool IsHpetRelevantForCurrentHardware()
        {
            try
            {
                string cpuName = "";
                int cpuFamily = 0;
                int cpuModel = 0;

                using var searcher = new ManagementObjectSearcher("SELECT Name, Family, Stepping FROM Win32_Processor");
                foreach (ManagementObject obj in searcher.Get())
                {
                    cpuName = obj["Name"]?.ToString()?.ToUpperInvariant() ?? "";
                    // Family não está disponível diretamente via WMI de forma confiável — usar nome
                    break;
                }

                // Intel: TSC invariante garantido a partir de Nehalem (2008) / Sandy Bridge (2011).
                // Na prática, qualquer CPU Intel com geração >= 4 (Haswell 2013+) tem TSC invariante
                // e o Windows usa TSC como clock source. HPET é irrelevante.
                // Gerações identificadas pelo nome: "i3/i5/i7/i9-XYYY" onde X = geração.
                if (cpuName.Contains("INTEL"))
                {
                    // Detectar geração pelo padrão "i[3579]-[geração]XXX" ou "CORE [geração]"
                    int gen = DetectIntelGeneration(cpuName);
                    if (gen >= 4)
                    {
                        _logger.LogInfo($"[HPET] Intel geração {gen} detectada — TSC invariante, HPET irrelevante. Tweak ignorado.");
                        return false;
                    }
                    if (gen > 0)
                    {
                        _logger.LogInfo($"[HPET] Intel geração {gen} (legado) — HPET pode ter impacto.");
                        return true;
                    }
                    // Não conseguiu detectar geração — assumir moderno (seguro)
                    _logger.LogInfo("[HPET] Intel sem geração identificada — assumindo moderno, HPET ignorado.");
                    return false;
                }

                // AMD: TSC invariante garantido a partir de Ryzen (Zen 1, 2017).
                // Bulldozer/Piledriver/Steamroller (2011-2014) NÃO têm TSC invariante.
                if (cpuName.Contains("AMD"))
                {
                    bool isZenOrNewer = cpuName.Contains("RYZEN") || cpuName.Contains("EPYC") ||
                                       cpuName.Contains("THREADRIPPER") || cpuName.Contains("ZEN");
                    if (isZenOrNewer)
                    {
                        _logger.LogInfo("[HPET] AMD Ryzen/Zen detectado — TSC invariante, HPET irrelevante. Tweak ignorado.");
                        return false;
                    }
                    // AMD legado (FX, A-series, Phenom) — HPET pode ter impacto
                    _logger.LogInfo("[HPET] AMD legado detectado — HPET pode ter impacto.");
                    return true;
                }

                // Hardware desconhecido — não arriscar, ignorar HPET
                _logger.LogInfo($"[HPET] CPU não identificada ({cpuName}) — HPET ignorado por segurança.");
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[HPET] Erro na detecção de hardware: {ex.Message} — HPET ignorado.");
                return false;
            }
        }

        /// <summary>
        /// Extrai a geração de uma CPU Intel pelo nome (ex: "Core i7-8700K" → 8).
        /// </summary>
        private static int DetectIntelGeneration(string cpuName)
        {
            // Padrão: "i[3579]-[1-4 dígitos]" — primeiro dígito(s) = geração
            // Ex: i7-8700 → gen 8 | i9-13900 → gen 13 | i5-2500 → gen 2
            var match = System.Text.RegularExpressions.Regex.Match(
                cpuName, @"I[3579]-(\d{1})(\d{3})");
            if (match.Success && int.TryParse(match.Groups[1].Value, out int gen))
                return gen;

            // Padrão de 5 dígitos: i9-10900 → gen 10
            var match2 = System.Text.RegularExpressions.Regex.Match(
                cpuName, @"I[3579]-(\d{2})(\d{3})");
            if (match2.Success && int.TryParse(match2.Groups[1].Value, out int gen2))
                return gen2;

            // Core Ultra (gen 12+): "CORE ULTRA"
            if (cpuName.Contains("CORE ULTRA")) return 12;

            return 0; // Não identificado
        }

        /// <summary>
        /// Desativa o HPET para reduzir latência em jogos.
        /// Em hardware moderno, retorna true sem fazer nada (tweak sem efeito).
        /// </summary>
        public bool DisableHpet()
        {
            // Hardware moderno: TSC invariante, HPET não é o clock source ativo.
            // bcdedit e pnputil não têm efeito mensurável — skip silencioso.
            if (!_hpetRelevantForThisHardware)
            {
                _logger.LogInfo("[HPET] Hardware moderno detectado — tweak HPET ignorado (sem impacto real neste sistema).");
                return true;
            }

            try
            {
                _logger.LogInfo("[HPET] 🔧 Hardware legado — verificando estado do HPET...");

                _wasHpetEnabled = IsHpetEnabled();
                _logger.LogInfo($"[HPET] Estado atual: {(_wasHpetEnabled ? "Ativado" : "Desativado")}");

                if (!_wasHpetEnabled)
                {
                    _logger.LogInfo("[HPET] HPET já está desativado, nenhuma ação necessária");
                    return true;
                }

                bool bcdResult = DisableHpetViaBcd();
                bool deviceResult = DisableHpetDevice();

                if (bcdResult || deviceResult)
                {
                    _hpetStateChanged = true;
                    _logger.LogSuccess("[HPET] ✅ HPET desativado (hardware legado confirmado)");
                    return true;
                }
                else
                {
                    _logger.LogWarning("[HPET] ⚠️ Não foi possível desativar HPET");
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[HPET] ❌ Erro ao desativar HPET: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Restaura o HPET ao estado original
        /// </summary>
        public bool RestoreHpet()
        {
            try
            {
                if (!_hpetStateChanged)
                {
                    _logger.LogInfo("[HPET] Nenhuma mudança foi feita, nada a restaurar");
                    return true;
                }
                
                if (!_wasHpetEnabled)
                {
                    _logger.LogInfo("[HPET] HPET estava desativado originalmente, mantendo desativado");
                    return true;
                }
                
                _logger.LogInfo("[HPET] 🔄 Restaurando HPET ao estado original...");
                
                // 1. Reativar via BCDEdit
                _logger.LogInfo("[HPET] Reativando HPET via BCDEdit...");
                bool bcdResult = EnableHpetViaBcd();
                
                // 2. Reativar dispositivo no Device Manager
                _logger.LogInfo("[HPET] Reativando dispositivo HPET no Device Manager...");
                bool deviceResult = EnableHpetDevice();
                
                if (bcdResult || deviceResult)
                {
                    _hpetStateChanged = false;
                    _logger.LogSuccess("[HPET] ✅ HPET restaurado ao estado original");
                    return true;
                }
                else
                {
                    _logger.LogWarning("[HPET] ⚠️ Não foi possível restaurar HPET completamente");
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"[HPET] ❌ Erro ao restaurar HPET: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Verifica se o HPET está ativado
        /// </summary>
        private bool IsHpetEnabled()
        {
            try
            {
                // Método 1: Verificar via BCDEdit
                var psi = new ProcessStartInfo
                {
                    FileName = "bcdedit",
                    Arguments = "/enum",
                    RedirectStandardOutput = true,
                    UseShellExecute = false,
                    CreateNoWindow = true
                };

                using (var process = Process.Start(psi))
                {
                    if (process != null)
                    {
                        string output = process.StandardOutput.ReadToEnd();
                        process.WaitForExit();
                        
                        // Se não encontrar "useplatformclock" ou se estiver "Yes", HPET está ativado
                        if (!output.Contains("useplatformclock") || output.Contains("useplatformclock        Yes"))
                        {
                            return true;
                        }
                    }
                }
                
                // Método 2: Verificar dispositivo no Device Manager via WMI
                using (var searcher = new ManagementObjectSearcher("SELECT * FROM Win32_PnPEntity WHERE DeviceID LIKE '%PNP0103%'"))
                {
                    foreach (ManagementObject device in searcher.Get())
                    {
                        var status = device["Status"]?.ToString();
                        var configManagerErrorCode = device["ConfigManagerErrorCode"]?.ToString();
                        
                        // Se Status = "OK" e ConfigManagerErrorCode = "0", dispositivo está ativado
                        if (status == "OK" && configManagerErrorCode == "0")
                        {
                            return true;
                        }
                    }
                }
                
                return false;
            }
            catch
            {
                // Em caso de erro, assumir que está ativado (seguro)
                return true;
            }
        }

        /// <summary>
        /// Desativa HPET via BCDEdit
        /// </summary>
        private bool DisableHpetViaBcd()
        {
            try
            {
                var psi = new ProcessStartInfo
                {
                    FileName = "bcdedit",
                    Arguments = "/set useplatformclock false",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    Verb = "runas" // Requer admin
                };

                using (var process = Process.Start(psi))
                {
                    if (process != null)
                    {
                        string output = process.StandardOutput.ReadToEnd();
                        string error = process.StandardError.ReadToEnd();
                        process.WaitForExit();
                        
                        if (process.ExitCode == 0)
                        {
                            _logger.LogSuccess("[HPET] BCDEdit: HPET desativado via useplatformclock=false");
                            return true;
                        }
                        else
                        {
                            _logger.LogWarning($"[HPET] BCDEdit falhou: {error}");
                            return false;
                        }
                    }
                }
                
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[HPET] Erro ao executar BCDEdit: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Reativa HPET via BCDEdit
        /// </summary>
        private bool EnableHpetViaBcd()
        {
            try
            {
                // Método 1: Tentar definir como true
                var psi = new ProcessStartInfo
                {
                    FileName = "bcdedit",
                    Arguments = "/set useplatformclock true",
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    UseShellExecute = false,
                    CreateNoWindow = true,
                    Verb = "runas"
                };

                using (var process = Process.Start(psi))
                {
                    if (process != null)
                    {
                        process.WaitForExit();
                        
                        if (process.ExitCode == 0)
                        {
                            _logger.LogSuccess("[HPET] BCDEdit: HPET reativado via useplatformclock=true");
                            return true;
                        }
                    }
                }
                
                // Método 2: Tentar deletar a entrada (volta ao padrão = ativado)
                psi.Arguments = "/deletevalue useplatformclock";
                using (var process = Process.Start(psi))
                {
                    if (process != null)
                    {
                        process.WaitForExit();
                        
                        if (process.ExitCode == 0)
                        {
                            _logger.LogSuccess("[HPET] BCDEdit: HPET reativado via deletevalue");
                            return true;
                        }
                    }
                }
                
                return false;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[HPET] Erro ao restaurar via BCDEdit: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Desativa dispositivo HPET no Device Manager via pnputil (método confiável).
        /// Win32_PnPEntity.InvokeMethod("Disable") retorna null em muitos sistemas — NullRef garantido.
        /// </summary>
        private bool DisableHpetDevice()
        {
            try
            {
                // Verificar se o dispositivo existe antes de tentar desativar
                string? deviceName = GetHpetDeviceName();
                if (deviceName == null)
                {
                    _logger.LogInfo("[HPET] Dispositivo HPET não encontrado no Device Manager (pode estar desativado na BIOS).");
                    return false;
                }

                _logger.LogInfo($"[HPET] Tentando desativar dispositivo: {deviceName}");

                // Usar pnputil para desativar — mais confiável que WMI InvokeMethod
                // pnputil /disable-device "ACPI\PNP0103\*" — requer admin
                var psi = new ProcessStartInfo("pnputil",
                    $"/disable-device \"{HPET_DEVICE_ID}\\*\"")
                {
                    CreateNoWindow = true,
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true
                };

                using var proc = Process.Start(psi);
                if (proc == null)
                {
                    _logger.LogWarning("[HPET] Não foi possível iniciar pnputil.");
                    return false;
                }

                var stdout = proc.StandardOutput.ReadToEnd();
                var stderr = proc.StandardError.ReadToEnd();
                proc.WaitForExit(10000);

                _logger.LogInfo($"[HPET] pnputil disable — ExitCode={proc.ExitCode} stdout={stdout.Trim()} stderr={stderr.Trim()}");

                if (proc.ExitCode == 0)
                {
                    _logger.LogSuccess("[HPET] ✅ Dispositivo HPET desativado com sucesso no Device Manager.");
                    return true;
                }
                else
                {
                    _logger.LogWarning($"[HPET] ⚠️ pnputil retornou ExitCode={proc.ExitCode} — HPET pode não estar disponível neste hardware.");
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[HPET] Erro ao desativar dispositivo: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Reativa dispositivo HPET no Device Manager via pnputil.
        /// </summary>
        private bool EnableHpetDevice()
        {
            try
            {
                _logger.LogInfo("[HPET] Reativando dispositivo HPET via pnputil...");

                var psi = new ProcessStartInfo("pnputil",
                    $"/enable-device \"{HPET_DEVICE_ID}\\*\"")
                {
                    CreateNoWindow = true,
                    UseShellExecute = false,
                    RedirectStandardOutput = true,
                    RedirectStandardError = true
                };

                using var proc = Process.Start(psi);
                if (proc == null)
                {
                    _logger.LogWarning("[HPET] Não foi possível iniciar pnputil para reativar.");
                    return false;
                }

                var stdout = proc.StandardOutput.ReadToEnd();
                var stderr = proc.StandardError.ReadToEnd();
                proc.WaitForExit(10000);

                _logger.LogInfo($"[HPET] pnputil enable — ExitCode={proc.ExitCode} stdout={stdout.Trim()} stderr={stderr.Trim()}");

                if (proc.ExitCode == 0)
                {
                    _logger.LogSuccess("[HPET] ✅ Dispositivo HPET reativado com sucesso.");
                    return true;
                }
                else
                {
                    _logger.LogWarning($"[HPET] ⚠️ pnputil enable retornou ExitCode={proc.ExitCode}.");
                    return false;
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[HPET] Erro ao reativar dispositivo: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Retorna o nome do dispositivo HPET se encontrado, ou null.
        /// Usa WMI apenas para leitura (sem InvokeMethod — evita NullRef).
        /// </summary>
        private string? GetHpetDeviceName()
        {
            try
            {
                using var searcher = new ManagementObjectSearcher(
                    "SELECT Name FROM Win32_PnPEntity WHERE DeviceID LIKE '%PNP0103%'");
                using var collection = searcher.Get();
                foreach (ManagementObject device in collection)
                {
                    if (device == null) continue;
                    return device["Name"]?.ToString() ?? "Timer de eventos de alta precisão";
                }
                return null;
            }
            catch
            {
                return null;
            }
        }

        public void Dispose()
        {
            // Garantir restauração ao descartar
            if (_hpetStateChanged)
            {
                _logger.LogWarning("[HPET] Dispose chamado com mudanças pendentes, restaurando...");
                RestoreHpet();
            }
        }
    }
}
