using System;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32;
using VoltrisOptimizer.Core.Constants;
using VoltrisOptimizer.Interfaces;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using VoltrisOptimizer.Services.Performance;
using VoltrisOptimizer.Utils;
using GamerModels = VoltrisOptimizer.Services.Gamer.Models;

namespace VoltrisOptimizer.Services.Gamer.Implementation
{
    /// <summary>
    /// Implementação do otimizador de CPU para jogos
    /// </summary>
    public class CpuGamingOptimizerService : ICpuGamingOptimizer
    {
        private readonly ILoggingService _logger;
        private readonly IRegistryService? _registry;
        private readonly IProcessRunner? _processRunner;
        private readonly VoltrisOptimizer.Services.Gamer.GamerModeManager.IPowerPlanService? _powerPlanService;
        private readonly IHardwareDetector? _hardwareDetector;
        private readonly HardwareCapabilityDetector _hardwareCapabilityDetector;
        private readonly RegistryValidator _registryValidator; // ✅ CORREÇÃO ENTERPRISE
        
        private int? _originalPrioritySeparation;
        private bool _originalCoreParkingDisabled;
        private int? _originalDisablePagingExecutive;
        private string? _originalPowerPlanGuid; // Backup do plano de energia

        public CpuGamingOptimizerService(
            ILoggingService logger, 
            IRegistryService? registry = null, 
            IProcessRunner? processRunner = null,
            VoltrisOptimizer.Services.Gamer.GamerModeManager.IPowerPlanService? powerPlanService = null,
            IHardwareDetector? hardwareDetector = null)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _registry = registry;
            _processRunner = processRunner;
            _powerPlanService = powerPlanService;
            _hardwareDetector = hardwareDetector;
            
            // Inicializar HardwareCapabilityDetector para validação de features
            _hardwareCapabilityDetector = new HardwareCapabilityDetector(logger);
            
            // ✅ CORREÇÃO ENTERPRISE: Inicializar RegistryValidator
            _registryValidator = new RegistryValidator(logger);
            
            // Fallback Service Locator
            if (_hardwareDetector == null && App.Services != null)
            {
                 _hardwareDetector = App.Services.GetService(typeof(IHardwareDetector)) as IHardwareDetector;
            }
            
            // Fallback: Tentar obter PowerPlanService do App.Services se não injetado
            if (_powerPlanService == null && App.Services != null)
            {
                _powerPlanService = App.Services.GetService(typeof(VoltrisOptimizer.Services.Gamer.GamerModeManager.IPowerPlanService)) 
                    as VoltrisOptimizer.Services.Gamer.GamerModeManager.IPowerPlanService;
            }
            
            // Logar informações de hardware detectado
            var caps = _hardwareCapabilityDetector.Capabilities;
            _logger.LogInfo($"[CpuOptimizer] Hardware: {caps.ProcessorName}");
            _logger.LogInfo($"[CpuOptimizer] Cores: {caps.PhysicalCores}, Threads: {caps.LogicalProcessors}");
            _logger.LogInfo($"[CpuOptimizer] Suporte - CoreParking: {caps.SupportsCoreParking}, TurboBoost: {caps.SupportsTurboBoost}, Hetero: {caps.SupportsHeteroPolicy}");
        }

        public async Task<bool> OptimizeAsync(CancellationToken cancellationToken = default)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("[CpuOptimizer] Aplicando otimizações de CPU...");
                    
                    // 0. Aplicar Plano de Energia — RESPEITAR Perfil Inteligente
                    // CORREÇÃO: Em vez de sempre usar Ultimate Performance, verificar se o perfil
                    // inteligente já define um plano otimizado. Para laptops e perfis não-gamer,
                    // o plano do perfil inteligente é mais adequado (evita superaquecimento).
                    if (_powerPlanService != null)
                    {
                        bool isOnBattery = _hardwareDetector?.IsOnBattery() ?? false;
                        bool isLaptop = _hardwareDetector?.IsLaptop() ?? false;
                        var intelligentProfile = SettingsService.Instance.Settings.IntelligentProfile;
                        
                        if (isOnBattery)
                        {
                            _logger.LogInfo("[CpuOptimizer] 🔋 Modo Bateria detectado: Ignorando plano 'Ultimate Performance' para preservar energia.");
                        }
                        else
                        {
                            try 
                            {
                                var currentPlan = _powerPlanService.GetActivePowerPlan();
                                _originalPowerPlanGuid = currentPlan.Guid;
                                _logger.LogInfo($"[CpuOptimizer] Plano atual: {currentPlan.Name} ({currentPlan.Guid}) - Backup realizado.");
                                
                                // CORREÇÃO: Decidir entre Ultimate Performance e plano do perfil inteligente
                                // - Laptops: NUNCA usar Ultimate Performance (causa thermal throttling)
                                // - Perfis não-gamer: usar plano do perfil inteligente
                                // - Desktop + perfil gamer: usar Ultimate Performance
                                bool useUltimate = !isLaptop && 
                                    (intelligentProfile == IntelligentProfileType.GamerCompetitive || 
                                     intelligentProfile == IntelligentProfileType.GamerSinglePlayer);
                                
                                if (useUltimate)
                                {
                                    _logger.LogInfo("[CpuOptimizer] 🖥️ Desktop + Perfil Gamer: Usando Ultimate Performance");
                                    var newPlan = _powerPlanService.SetPowerPlan(VoltrisOptimizer.Services.Gamer.GamerModeManager.PowerPlanType.UltimatePerformance);
                                    _logger.LogSuccess($"[CpuOptimizer] ⚡ Plano de Energia Alterado: {newPlan.Name}");
                                }
                                else
                                {
                                    // Usar o plano do perfil inteligente (já configurado pelo IntelligentPowerPlanService)
                                    var profilePlanName = VoltrisOptimizer.Services.Power.IntelligentPowerPlanService.GetVoltrisPlanName(intelligentProfile);
                                    _logger.LogInfo($"[CpuOptimizer] 💡 Usando plano do Perfil Inteligente: {profilePlanName}");
                                    _logger.LogInfo($"[CpuOptimizer] Motivo: isLaptop={isLaptop}, profile={intelligentProfile}");
                                    
                                    // Garantir que o plano do perfil está ativo (High Performance base)
                                    var newPlan = _powerPlanService.SetPowerPlan(VoltrisOptimizer.Services.Gamer.GamerModeManager.PowerPlanType.HighPerformance);
                                    _logger.LogSuccess($"[CpuOptimizer] ⚡ Plano de Energia: {newPlan.Name} (respeitando Perfil Inteligente)");
                                }
                            }
                            catch (Exception ex)
                            {
                                _logger.LogWarning($"[CpuOptimizer] Falha ao alterar plano de energia: {ex.Message}");
                            }
                        }
                    }

                    // 1. Priorizar aplicativos em primeiro plano
                    SetForegroundPriority();

                    // 2. Desabilitar core parking
                    DisableCoreParking();

                    // 3. Otimizar agendador de CPU
                    OptimizeScheduler();

                    _logger.LogSuccess("[CpuOptimizer] CPU otimizada para jogos");
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError("[CpuOptimizer] Erro ao otimizar CPU", ex);
                    return false;
                }
            }, cancellationToken);
        }

        public async Task<bool> RestoreAsync(CancellationToken cancellationToken = default)
        {
            return await Task.Run(() =>
            {
                try
                {
                    _logger.LogInfo("[CpuOptimizer] Restaurando configurações de CPU...");
                    
                    // Restaurar Plano de Energia
                    if (_powerPlanService != null && !string.IsNullOrEmpty(_originalPowerPlanGuid))
                    {
                        try
                        {
                            _powerPlanService.SetPowerPlanByGuid(_originalPowerPlanGuid);
                            _logger.LogInfo($"[CpuOptimizer] Plano de energia restaurado para GUID original: {_originalPowerPlanGuid}");
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"[CpuOptimizer] Falha ao restaurar plano de energia: {ex.Message}");
                        }
                    }

                    // Restaurar Win32PrioritySeparation se tínhamos backup
                    if (_originalPrioritySeparation.HasValue)
                    {
                        try
                        {
                            using var key = Registry.LocalMachine.OpenSubKey(
                                SystemConstants.RegistryPaths.PriorityControl, true);
                            key?.SetValue("Win32PrioritySeparation", 
                                _originalPrioritySeparation.Value, 
                                RegistryValueKind.DWord);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"[CpuOptimizer] Erro ao restaurar PrioritySeparation: {ex.Message}");
                        }
                    }

                    // CORREÇÃO: Restaurar DisablePagingExecutive
                    if (_originalDisablePagingExecutive.HasValue)
                    {
                        try
                        {
                            using var key = Registry.LocalMachine.OpenSubKey(
                                SystemConstants.RegistryPaths.SessionManagerKernel, true);
                            key?.SetValue("DisablePagingExecutive", 
                                _originalDisablePagingExecutive.Value, 
                                RegistryValueKind.DWord);
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"[CpuOptimizer] Erro ao restaurar DisablePagingExecutive: {ex.Message}");
                        }
                    }

                    // CORREÇÃO: Restaurar Core Parking (se foi modificado)
                    if (_originalCoreParkingDisabled)
                    {
                        try
                        {
                            // Restaurar para valor padrão (50%)
                            RunPowerCfg("-setacvalueindex SCHEME_CURRENT SUB_PROCESSOR 0cc5b647-c1df-4637-891a-dec35c318583 50");
                            RunPowerCfg("-setdcvalueindex SCHEME_CURRENT SUB_PROCESSOR 0cc5b647-c1df-4637-891a-dec35c318583 50");
                            RunPowerCfg("-SetActive SCHEME_CURRENT");
                        }
                        catch (Exception ex)
                        {
                            _logger.LogWarning($"[CpuOptimizer] Erro ao restaurar Core Parking: {ex.Message}");
                        }
                    }

                    _logger.LogSuccess("[CpuOptimizer] Configurações de CPU restauradas");
                    return true;
                }
                catch (Exception ex)
                {
                    _logger.LogError("[CpuOptimizer] Erro ao restaurar CPU", ex);
                    return false;
                }
            }, cancellationToken);
        }

        private void SetForegroundPriority()
        {
            try
            {
                if (!AdminHelper.IsRunningAsAdministrator())
                {
                    _logger.LogWarning("[CpuOptimizer] Sem permissão para modificar prioridade");
                    return;
                }

                // Backup do valor original
                using var key = Registry.LocalMachine.OpenSubKey(
                    SystemConstants.RegistryPaths.PriorityControl, false);
                
                if (key != null)
                {
                    var currentValue = key.GetValue("Win32PrioritySeparation");
                    if (currentValue is int intVal)
                    {
                        _originalPrioritySeparation = intVal;
                    }
                }

                // ✅ CORREÇÃO ENTERPRISE: Usar RegistryValidator com read-after-write
                bool success = _registryValidator.SetAndVerify(
                    SystemConstants.RegistryPaths.PriorityControl,
                    "Win32PrioritySeparation",
                    SystemConstants.ProcessPriority.ForegroundBoostMax,
                    RegistryValueKind.DWord);

                if (!success)
                {
                    _logger.LogWarning("[CpuOptimizer] ⚠️ PrioritySeparation foi revertido pelo Windows");
                }
                else
                {
                    _logger.LogInfo("[CpuOptimizer] ✅ Prioridade de foreground configurada e validada");
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[CpuOptimizer] Erro em SetForegroundPriority: {ex.Message}");
            }
        }

        public bool DisableCoreParking()
        {
            try
            {
                if (!AdminHelper.IsRunningAsAdministrator())
                {
                    _logger.LogWarning("[CpuOptimizer] Sem permissão para core parking");
                    return false;
                }

                // CORREÇÃO RISCO #4: Validar suporte a Core Parking ANTES de tentar aplicar
                var caps = _hardwareCapabilityDetector.Capabilities;
                if (!caps.SupportsCoreParking)
                {
                    _logger.LogInfo($"[CpuOptimizer] Core Parking não suportado neste hardware ({caps.ProcessorName}) - ignorando otimização");
                    return true; // Retornar true pois não é um erro, apenas não suportado
                }

                _logger.LogInfo("[CpuOptimizer] Iniciando desabilitação de core parking...");

                // Estratégia 1: Tentar via nome amigável CPMINCORES (mais compatível)
                var result1 = RunPowerCfgWithValidation("-setacvalueindex SCHEME_CURRENT SUB_PROCESSOR CPMINCORES 100");
                var result2 = RunPowerCfgWithValidation("-setdcvalueindex SCHEME_CURRENT SUB_PROCESSOR CPMINCORES 100");
                
                if (result1 && result2)
                {
                    RunPowerCfgWithValidation("-SetActive SCHEME_CURRENT");
                    _originalCoreParkingDisabled = true;
                    _logger.LogSuccess("[CpuOptimizer] ✅ Core parking desabilitado via CPMINCORES");
                    return true;
                }

                // Estratégia 2: Tentar via GUID — apenas valor 100 (evita spam de tentativas)
                _logger.LogDebug("[CpuOptimizer] Tentando core parking via GUID direto...");
                result1 = RunPowerCfgWithValidation("-setacvalueindex SCHEME_CURRENT SUB_PROCESSOR 0cc5b647-c1df-4637-891a-dec35c318583 100");
                result2 = RunPowerCfgWithValidation("-setdcvalueindex SCHEME_CURRENT SUB_PROCESSOR 0cc5b647-c1df-4637-891a-dec35c318583 100");
                var result3 = RunPowerCfgWithValidation("-SetActive SCHEME_CURRENT");

                if (result1 && result2 && result3)
                {
                    _originalCoreParkingDisabled = true;
                    _logger.LogSuccess("[CpuOptimizer] ✅ Core parking desabilitado via GUID");
                    return true;
                }

                // Estratégia 3: Fallback via registro (sem repetir powercfg que já falhou)
                _logger.LogInfo("[CpuOptimizer] powercfg falhou — tentando via registro");
                return TryDisableCoreParkingViaRegistry();
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[CpuOptimizer] Erro em DisableCoreParking: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Método alternativo para desabilitar core parking via registro
        /// </summary>
        private bool TryDisableCoreParkingViaRegistry()
        {
            try
            {
                _logger.LogInfo("[CpuOptimizer] Tentando método alternativo via registro...");
                
                // Obter GUID do plano ativo
                var activePlan = _powerPlanService?.GetActivePowerPlan();
                if (activePlan == null || string.IsNullOrEmpty(activePlan.Value.Guid))
                {
                    _logger.LogWarning("[CpuOptimizer] Não foi possível obter plano ativo");
                    return false;
                }

                var guid = activePlan.Value.Guid;
                bool success = false;
                
                // Caminho 1: PowerSchemes (planos ativos — funciona para planos criados dinamicamente)
                var path1 = $@"SYSTEM\CurrentControlSet\Control\Power\PowerSchemes\{guid}\54533251-82be-4824-96c1-47b60b740d00\0cc5b647-c1df-4637-891a-dec35c318583";
                try
                {
                    using var key1 = Registry.LocalMachine.OpenSubKey(path1, true);
                    if (key1 != null)
                    {
                        key1.SetValue("ACSettingIndex", 100, RegistryValueKind.DWord);
                        key1.SetValue("DCSettingIndex", 100, RegistryValueKind.DWord);
                        _logger.LogSuccess("[CpuOptimizer] ✅ Core parking desabilitado via PowerSchemes");
                        success = true;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogDebug($"[CpuOptimizer] PowerSchemes falhou: {ex.Message}");
                }

                // Caminho 2: DefaultPowerSchemeValues (planos built-in)
                if (!success)
                {
                    var path2 = $@"SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\0cc5b647-c1df-4637-891a-dec35c318583\DefaultPowerSchemeValues\{guid}";
                    try
                    {
                        using var key2 = Registry.LocalMachine.OpenSubKey(path2, true);
                        if (key2 != null)
                        {
                            key2.SetValue("AcSettingIndex", 0, RegistryValueKind.DWord);
                            key2.SetValue("DcSettingIndex", 0, RegistryValueKind.DWord);
                            _logger.LogSuccess("[CpuOptimizer] ✅ Core parking desabilitado via DefaultPowerSchemeValues");
                            success = true;
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogDebug($"[CpuOptimizer] DefaultPowerSchemeValues falhou: {ex.Message}");
                    }
                }

                // Caminho 3: Tornar o setting visível e tentar powercfg novamente (última tentativa)
                if (!success)
                {
                    try
                    {
                        var attrPath = @"SYSTEM\CurrentControlSet\Control\Power\PowerSettings\54533251-82be-4824-96c1-47b60b740d00\0cc5b647-c1df-4637-891a-dec35c318583";
                        using var attrKey = Registry.LocalMachine.OpenSubKey(attrPath, true);
                        if (attrKey != null)
                        {
                            var currentAttr = attrKey.GetValue("Attributes");
                            if (currentAttr is int attrVal && attrVal != 0)
                            {
                                attrKey.SetValue("Attributes", 0, RegistryValueKind.DWord); // 0 = visível
                                _logger.LogInfo("[CpuOptimizer] Core parking setting tornado visível — retentando powercfg");
                                
                                var r1 = RunPowerCfgWithValidation("-setacvalueindex SCHEME_CURRENT SUB_PROCESSOR 0cc5b647-c1df-4637-891a-dec35c318583 100");
                                var r2 = RunPowerCfgWithValidation("-setdcvalueindex SCHEME_CURRENT SUB_PROCESSOR 0cc5b647-c1df-4637-891a-dec35c318583 100");
                                RunPowerCfgWithValidation("-SetActive SCHEME_CURRENT");
                                
                                if (r1 && r2)
                                {
                                    _logger.LogSuccess("[CpuOptimizer] ✅ Core parking desabilitado após unhide");
                                    success = true;
                                }
                            }
                            else
                            {
                                _logger.LogDebug("[CpuOptimizer] Setting já visível, powercfg não suporta este plano de energia");
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        _logger.LogDebug($"[CpuOptimizer] Unhide falhou: {ex.Message}");
                    }
                }

                if (!success)
                {
                    _logger.LogInfo("[CpuOptimizer] Core parking não pôde ser configurado — hardware/BIOS pode ter restrições OEM");
                }
                
                return success;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[CpuOptimizer] Falha no método alternativo: {ex.Message}");
                return false;
            }
        }

        /// <summary>
        /// Executa powercfg com validação de resultado
        /// </summary>
        private bool RunPowerCfgWithValidation(string arguments)
        {
            try
            {
                if (_processRunner != null)
                {
                    var result = _processRunner.Run("powercfg", arguments);
                    
                    if (!result.Success)
                    {
                        _logger.LogInfo($"[CpuOptimizer] PowerCfg falhou: {result.StandardError}");
                    }
                    
                    return result.Success;
                }

                using var process = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = "powercfg",
                        Arguments = arguments,
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        RedirectStandardOutput = true,
                        RedirectStandardError = true,
                        StandardOutputEncoding = System.Text.Encoding.GetEncoding(850),
                        StandardErrorEncoding = System.Text.Encoding.GetEncoding(850)
                    }
                };

                process.Start();
                var stderr = process.StandardError.ReadToEnd();
                var stdout = process.StandardOutput.ReadToEnd();
                process.WaitForExit(10000);
                
                if (process.ExitCode != 0)
                {
                    _logger.LogInfo($"[CpuOptimizer] PowerCfg exit code: {process.ExitCode}");
                    if (!string.IsNullOrWhiteSpace(stderr))
                    {
                        _logger.LogInfo($"[CpuOptimizer] PowerCfg stderr: {stderr.Trim()}");
                    }
                }
                
                return process.ExitCode == 0;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[CpuOptimizer] Erro em powercfg: {ex.Message}");
                return false;
            }
        }

        private void OptimizeScheduler()
        {
            try
            {
                using var key = Registry.LocalMachine.OpenSubKey(
                    SystemConstants.RegistryPaths.SessionManagerKernel, true);
                
                if (key == null) return;

                // CORREÇÃO: Fazer backup antes de modificar
                var currentValue = key.GetValue("DisablePagingExecutive");
                if (currentValue is int intVal)
                {
                    _originalDisablePagingExecutive = intVal;
                }

                // Desabilitar paginação de executáveis
                key.SetValue("DisablePagingExecutive", 1, RegistryValueKind.DWord);

                _logger.LogInfo("[CpuOptimizer] Agendador de CPU otimizado");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[CpuOptimizer] Erro em OptimizeScheduler: {ex.Message}");
            }
        }

        public bool SetGameProcessPriority(int processId, GamerModels.ProcessPriorityLevel priority)
        {
            try
            {
                using var process = Process.GetProcessById(processId);
                
                process.PriorityClass = priority switch
                {
                    GamerModels.ProcessPriorityLevel.Normal => ProcessPriorityClass.Normal,
                    GamerModels.ProcessPriorityLevel.AboveNormal => ProcessPriorityClass.AboveNormal,
                    GamerModels.ProcessPriorityLevel.High => ProcessPriorityClass.High,
                    GamerModels.ProcessPriorityLevel.RealTime => ProcessPriorityClass.RealTime,
                    _ => ProcessPriorityClass.High
                };

                _logger.LogInfo($"[CpuOptimizer] Prioridade {priority} definida para processo {processId}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[CpuOptimizer] Erro ao definir prioridade: {ex.Message}");
                return false;
            }
        }

        public bool ApplyCpuSets(int processId)
        {
            try
            {
                if (_hardwareDetector != null && _hardwareDetector.IsHybridCpu())
                {
                    // Usar versão síncrona para evitar async void pattern ou espera bloqueante
                    // e permitir compatibilidade com interface
                    var counts = _hardwareDetector.GetCpuCounts();
                    var pCores = counts.Threads - counts.Cores; // P-Cores = Threads - Cores em 12th+ Gen (com HT)
                    
                    if (pCores > 0)
                    {
                        int pCoreThreads = pCores * 2;
                        
                        // Criar máscara de afinidade para os threads dos P-Cores (bits 0 a pCoreThreads-1)
                        long affinityMask = (1L << pCoreThreads) - 1;
                        
                        using var process = Process.GetProcessById(processId);
                        process.ProcessorAffinity = (IntPtr)affinityMask;
                        
                        _logger.LogSuccess($"[CpuOptimizer] 🧠 Afinidade Híbrida: Jogo isolado nos {pCores} P-Cores ({pCoreThreads} threads).");
                        return true;
                    }
                }

                _logger.LogInfo($"[CpuOptimizer] CPU não híbrida ou lógica não aplicável. Afinidade padrão mantida.");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[CpuOptimizer] Erro em ApplyCpuSets: {ex.Message}");
                return false;
            }
        }

        private bool RunPowerCfg(string arguments)
        {
            return RunPowerCfgWithValidation(arguments);
        }
    }
}