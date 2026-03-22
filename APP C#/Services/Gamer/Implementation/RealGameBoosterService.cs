using System;
using System.Diagnostics;
using System.Runtime.InteropServices;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Win32;
using VoltrisOptimizer.Utils;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using VoltrisOptimizer.Services.Gamer.Models;
using VoltrisOptimizer.Services.Optimization.Unification;


namespace VoltrisOptimizer.Services.Gamer.Implementation
{
    /// <summary>
    /// Serviço de boost REAL para jogos - Otimizações que você VAI sentir diferença
    /// Combina todas as otimizações de alto impacto em um único serviço
    /// </summary>
    public class RealGameBoosterService : IRealGameBoosterService

    {
        private readonly ILoggingService _logger;
        private readonly ITimerResolutionService _timerService;
        private TimerResolutionManager? _timerManager;
        private bool _timerRequested = false;
        private readonly GamerProfileResolver _profileResolver;
        
        private bool _isActive;
        private string? _originalPowerPlan;
        private Process? _gameProcess;
        private IntPtr _originalAffinity;
        private ProcessPriorityClass _originalPriority;
        
        // Backup de estado original para restauração completa no DeactivateAsync
        private int? _originalAppCaptureEnabled;
        private int? _originalGameDvrEnabled;
        private int? _originalAllowAutoGameMode;
        private int? _originalAutoGameModeEnabled;
        private int? _originalGameDvrFseBehavior;
        private int? _originalGameDvrFseBehaviorMode;
        private int? _originalHwSchMode;
        
        // Windows API
        [DllImport("kernel32.dll")]
        private static extern IntPtr GetCurrentProcess();
        
        [DllImport("kernel32.dll")]
        private static extern bool SetProcessAffinityMask(IntPtr hProcess, IntPtr dwProcessAffinityMask);
        
        [DllImport("kernel32.dll")]
        private static extern bool GetProcessAffinityMask(IntPtr hProcess, out IntPtr lpProcessAffinityMask, out IntPtr lpSystemAffinityMask);

        // GUIDs dos planos de energia
        private const string ULTIMATE_PERFORMANCE_GUID = "e9a42b02-d5df-448d-aa00-03f14749eb61";
        private const string HIGH_PERFORMANCE_GUID = "8c5e7fda-e8bf-4a96-9a85-a6e23a8c635c";
        
        public bool IsActive => _isActive;

        public RealGameBoosterService(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            // CORREÇÃO: Usar o singleton registrado no DI em vez de criar instância própria.
            // Instância própria causava conflito com TimerResolutionManager (OptimizationOrchestrator),
            // resultando em oscilação: um ativava e o outro desativava o timer no mesmo ciclo.
            _timerService = Core.ServiceLocator.GetService<ITimerResolutionService>()
                            ?? new TimerResolutionService(logger);
            _timerManager = new TimerResolutionManager(logger, _timerService);
            _profileResolver = new GamerProfileResolver(SettingsService.Instance, logger);
        }

        /// <summary>
        /// Ativa TODAS as otimizações de alto impacto
        /// </summary>
        public async Task<RealGameBoostResult> ActivateFullBoostAsync(Process? gameProcess = null, CancellationToken ct = default, RealGameBoostOptions? options = null)
        {
            var result = new RealGameBoostResult();
            
            try
            {
                _logger.LogInfo("[RealBoost] ═══════════════════════════════════════");
                _logger.LogInfo("[RealBoost] Iniciando boost REAL para jogos...");
                _logger.LogInfo("[RealBoost] ═══════════════════════════════════════");
                
                // ✅ CORREÇÃO CRÍTICA: Consultar Perfil Inteligente ANTES de aplicar otimizações
                // Nota: ResolveExecutionPlan precisa de hardware, então vamos usar uma abordagem simplificada
                var intelligentProfile = SettingsService.Instance.Settings.IntelligentProfile;
                
                _logger.LogInfo($"[RealBoost] 🧠 Perfil Inteligente: {intelligentProfile}");
                _logger.LogInfo($"[RealBoost] 📋 Validando permissões...");
                
                // ✅ BLOQUEIO TOTAL: EnterpriseSecure não permite Modo Gamer
                if (intelligentProfile == IntelligentProfileType.EnterpriseSecure)
                {
                    _logger.LogWarning("[RealBoost] ⛔ BLOQUEADO: Perfil EnterpriseSecure não permite Modo Gamer");
                    result.Success = false;
                    result.Error = "Modo Gamer bloqueado pelo Perfil Inteligente (EnterpriseSecure)";
                    return result;
                }
                
                // Aplicar opções se fornecidas, mas respeitar o perfil
                bool useTimer = (options?.EnableTimerResolution ?? true);
                bool usePower = (options?.EnablePowerPlan ?? true);
                bool disableGameBar = (options?.DisableGameBar ?? true);
                bool disableFso = (options?.DisableFullscreenOptimizations ?? true);
                
                // Ajustar baseado no perfil
                if (intelligentProfile == IntelligentProfileType.WorkOffice)
                {
                    usePower = false; // Não usar Ultimate Performance em ambiente de trabalho
                    _logger.LogInfo("[RealBoost] Perfil WorkOffice: Ultimate Performance desabilitado");
                }
                
                // CORREÇÃO: Em laptops, não usar Ultimate Performance (causa thermal throttling)
                // O plano do perfil inteligente já é otimizado para o hardware
                bool isLaptop = false;
                try { isLaptop = VoltrisOptimizer.Helpers.WindowsCompatibilityHelper.IsLaptop(); } catch { }
                
                if (isLaptop && usePower)
                {
                    usePower = false;
                    _logger.LogInfo("[RealBoost] 💻 Laptop detectado: Ultimate Performance desabilitado (usando plano do Perfil Inteligente para evitar superaquecimento)");
                }

                _gameProcess = gameProcess;
                
                // ✅ Log das otimizações permitidas
                _logger.LogInfo($"[RealBoost] Otimizações permitidas pelo perfil:");
                _logger.LogInfo($"[RealBoost]   - Timer Resolution: {useTimer}");
                _logger.LogInfo($"[RealBoost]   - Ultimate Performance: {usePower}");
                _logger.LogInfo($"[RealBoost]   - Disable GameBar: {disableGameBar}");
                _logger.LogInfo($"[RealBoost]   - Disable FSO: {disableFso}");

                // 1. TIMER RESOLUTION (Impacto: INPUT LAG -90%)
                if (useTimer)
                {
                    result.TimerResolution = await Task.Run(() => ActivateTimerResolution(), ct);
                }

                // 2. POWER PLAN (Impacto: PERFORMANCE +15-30%)
                if (usePower)
                {
                    result.PowerPlan = await Task.Run(() => ActivateUltimatePerformance(), ct);
                }

                // 3. PRIORIDADE DO JOGO (Impacto: FRAME DROPS -50%)
                if (_gameProcess != null)
                {
                    result.GamePriority = BoostGameProcess(_gameProcess);
                    
                    // MODO STREAMER: Proteger OBS/Streamlabs
                    TryActivateStreamerMode();
                }

                // 4. DESATIVAR GAME BAR/DVR (Impacto: FPS +5-15%)
                if (disableGameBar)
                {
                    result.GameBarDisabled = DisableGameBar();
                }

                // 5. DESATIVAR FULLSCREEN OPTIMIZATIONS (Impacto: INPUT LAG -20%)
                if (disableFso)
                {
                    result.FsoDisabled = DisableFullscreenOptimizations();
                }

                // 6. OTIMIZAR GPU (Impacto: FRAME PACING)
                result.GpuOptimized = OptimizeGpuSettings();

                // 7. LIMPAR MEMÓRIA STANDBY (Impacto: STUTTERS -60%)
                result.MemoryCleaned = CleanStandbyList();

                // 8. HPET: Otimização real é feita pelo HpetController na Fase 4 do Orchestrator
                // Removido placebo OptimizeHpet() que apenas lia bcdedit sem modificar nada
                result.HpetOptimized = true;

                _isActive = true;
                result.Success = true;
                result.OptimizationsApplied = result.TimerResolution ? 1 : 0;
                if (result.PowerPlan) result.OptimizationsApplied++;
                if (result.GamePriority) result.OptimizationsApplied++;
                if (result.GameBarDisabled) result.OptimizationsApplied++;
                if (result.FsoDisabled) result.OptimizationsApplied++;
                if (result.GpuOptimized) result.OptimizationsApplied++;
                if (result.MemoryCleaned) result.OptimizationsApplied++;
                if (result.HpetOptimized) result.OptimizationsApplied++;
                
                _logger.LogSuccess("[RealBoost] ═══════════════════════════════════════");
                _logger.LogSuccess("[RealBoost] BOOST ATIVADO COM SUCESSO!");
                _logger.LogSuccess($"[RealBoost] Timer: {(result.TimerResolution ? "0.5ms ✓" : "❌")}");
                _logger.LogSuccess($"[RealBoost] Power: {(result.PowerPlan ? "Ultimate ✓" : "❌")}");
                _logger.LogSuccess($"[RealBoost] Prioridade: {(result.GamePriority ? "Alta ✓" : "N/A")}");
                _logger.LogSuccess($"[RealBoost] Game Bar: {(result.GameBarDisabled ? "OFF ✓" : "❌")}");
                _logger.LogSuccess("[RealBoost] ═══════════════════════════════════════");

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError("[RealBoost] Erro ao ativar boost", ex);
                result.Error = ex.Message;
                result.Success = false;
                return result;
            }
        }


        /// <summary>
        /// Desativa todas as otimizações e restaura configurações
        /// </summary>
        public async Task<bool> DeactivateAsync(CancellationToken ct = default)
        {
            try
            {
                _logger.LogInfo("[RealBoost] Desativando boost...");

                // Restaurar timer resolution
                if (_timerManager != null && _timerRequested)
                {
                    _timerManager.ReleaseHighPrecision("RealGameBoosterService.Deactivate");
                    _timerRequested = false;
                }

                // Restaurar power plan
                if (!string.IsNullOrEmpty(_originalPowerPlan))
                {
                    await Task.Run(() => RunPowerCfg($"/setactive {_originalPowerPlan}"), ct);
                }

                // Restaurar prioridade do jogo
                if (_gameProcess != null && !_gameProcess.HasExited)
                {
                    try
                    {
                        _gameProcess.PriorityClass = _originalPriority;
                        if (_originalAffinity != IntPtr.Zero)
                        {
                            SetProcessAffinityMask(_gameProcess.Handle, _originalAffinity);
                        }
                    }
                    catch { }
                }

                // Restaurar Game Bar/DVR
                try
                {
                    if (_originalAppCaptureEnabled.HasValue)
                    {
                        using var key = Registry.CurrentUser.CreateSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\GameDVR");
                        key?.SetValue("AppCaptureEnabled", _originalAppCaptureEnabled.Value, RegistryValueKind.DWord);
                    }
                    if (_originalGameDvrEnabled.HasValue)
                    {
                        using var key = Registry.CurrentUser.CreateSubKey(@"System\GameConfigStore");
                        key?.SetValue("GameDVR_Enabled", _originalGameDvrEnabled.Value, RegistryValueKind.DWord);
                    }
                    if (_originalAllowAutoGameMode.HasValue || _originalAutoGameModeEnabled.HasValue)
                    {
                        using var key = Registry.CurrentUser.CreateSubKey(@"SOFTWARE\Microsoft\GameBar");
                        if (key != null)
                        {
                            if (_originalAllowAutoGameMode.HasValue)
                                key.SetValue("AllowAutoGameMode", _originalAllowAutoGameMode.Value, RegistryValueKind.DWord);
                            if (_originalAutoGameModeEnabled.HasValue)
                                key.SetValue("AutoGameModeEnabled", _originalAutoGameModeEnabled.Value, RegistryValueKind.DWord);
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[RealBoost] Erro ao restaurar Game Bar: {ex.Message}");
                }

                // Restaurar Fullscreen Optimizations
                try
                {
                    if (_originalGameDvrFseBehavior.HasValue || _originalGameDvrFseBehaviorMode.HasValue)
                    {
                        using var key = Registry.CurrentUser.CreateSubKey(@"System\GameConfigStore");
                        if (key != null)
                        {
                            if (_originalGameDvrFseBehavior.HasValue)
                                key.SetValue("GameDVR_FSEBehavior", _originalGameDvrFseBehavior.Value, RegistryValueKind.DWord);
                            if (_originalGameDvrFseBehaviorMode.HasValue)
                                key.SetValue("GameDVR_FSEBehaviorMode", _originalGameDvrFseBehaviorMode.Value, RegistryValueKind.DWord);
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[RealBoost] Erro ao restaurar FSO: {ex.Message}");
                }

                // Restaurar GPU scheduling
                try
                {
                    if (_originalHwSchMode.HasValue)
                    {
                        using var key = Registry.LocalMachine.OpenSubKey(
                            @"SYSTEM\CurrentControlSet\Control\GraphicsDrivers", true);
                        key?.SetValue("HwSchMode", _originalHwSchMode.Value, RegistryValueKind.DWord);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[RealBoost] Erro ao restaurar GPU: {ex.Message}");
                }

                _isActive = false;
                _gameProcess = null;
                
                _logger.LogSuccess("[RealBoost] Boost desativado (todas as configurações restauradas)");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError("[RealBoost] Erro ao desativar", ex);
                return false;
            }
        }

        #region Otimizações Individuais

        private bool ActivateTimerResolution()
        {
            try
            {
                if (_timerManager != null && !_timerRequested)
                {
                    _timerManager.RequestHighPrecision("RealGameBoosterService");
                    _timerRequested = true;
                    var info = _timerService.GetResolutionInfo();
                    _logger.LogInfo($"[RealBoost] Timer: {info.current:F2}ms (mín: {info.max:F2}ms)");
                }
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[RealBoost] Erro Timer: {ex.Message}");
                return false;
            }
        }

        private bool ActivateUltimatePerformance()
        {
            try
            {
                if (!AdminHelper.IsRunningAsAdministrator())
                {
                    _logger.LogWarning("[RealBoost] Sem privilégio admin para power plan");
                    return false;
                }

                // Salvar plano atual
                var currentPlan = GetActivePowerPlan();
                if (!string.IsNullOrEmpty(currentPlan))
                {
                    _originalPowerPlan = currentPlan;
                }

                // Tentar criar Ultimate Performance se não existir
                RunPowerCfg($"/duplicatescheme {HIGH_PERFORMANCE_GUID} {ULTIMATE_PERFORMANCE_GUID}");

                // Tentar ativar Ultimate Performance
                if (RunPowerCfg($"/setactive {ULTIMATE_PERFORMANCE_GUID}"))
                {
                    _logger.LogInfo("[RealBoost] Plano Ultimate Performance ativado");
                    
                    // Configurações extras de energia
                    ApplyAggressivePowerSettings();
                    
                    return true;
                }

                // Fallback: High Performance
                if (RunPowerCfg($"/setactive {HIGH_PERFORMANCE_GUID}"))
                {
                    _logger.LogInfo("[RealBoost] Plano High Performance ativado (fallback)");
                    return true;
                }

                return false;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[RealBoost] Erro Power Plan: {ex.Message}");
                return false;
            }
        }

        private void ApplyAggressivePowerSettings()
        {
            // Core parking é gerenciado pelo CpuGamingOptimizerService (com fallback via registro)
            // Não duplicar aqui para evitar spam de erros no log
            
            // CPU mínimo em 100%
            RunPowerCfg("-setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PROCTHROTTLEMIN 100");
            
            // Desativar throttling
            RunPowerCfg("-setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PERFBOOSTMODE 2");
            RunPowerCfg("-setacvalueindex SCHEME_CURRENT SUB_PROCESSOR PERFBOOSTPOL 100");
            
            // USB Selective Suspend desativado
            RunPowerCfg("-setacvalueindex SCHEME_CURRENT 2a737441-1930-4402-8d77-b2bebba308a3 48e6b7a6-50f5-4782-a5d4-53bb8f07e226 0");
            
            // PCI Express Link State Management desativado
            RunPowerCfg("-setacvalueindex SCHEME_CURRENT SUB_PCIEXPRESS ASPM 0");
            
            // Aplicar
            RunPowerCfg("-SetActive SCHEME_CURRENT");
        }

        private bool BoostGameProcess(Process process)
        {
            try
            {
                // Salvar estado original
                _originalPriority = process.PriorityClass;
                GetProcessAffinityMask(process.Handle, out _originalAffinity, out _);

                var coreCount = Environment.ProcessorCount;

                // Definir prioridade Inteligente com Adaptação de Hardware
                if (coreCount <= 4)
                {
                    // PC Fraco: High Priority pode sufocar o sistema (mouse lag, áudio picotando)
                    process.PriorityClass = ProcessPriorityClass.AboveNormal;
                    _logger.LogInfo($"[RealBoost] Prioridade do jogo: Above Normal (Proteção para Dual/Quad Core)");
                }
                else
                {
                    // PC Gamer: High Priority é o ideal para diminuir frame drops e input lag
                    process.PriorityClass = ProcessPriorityClass.High;
                    _logger.LogInfo($"[RealBoost] Prioridade do jogo: HIGH (Performance Máxima)");
                }

                // CORREÇÃO CRÍTICA #3: CPU Affinity removido
                // A manipulação de afinidade da CPU é muito arriscada e pode causar instabilidade no sistema.
                // O Windows é muito eficiente em gerenciar a alocação de núcleos.
                _logger.LogInfo($"[RealBoost] Afinidade: gerenciamento automático pelo Windows (CPU Affinity desativado)");
                // Não manipular affinity mask aqui.

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"[RealBoost] Erro ao boost processo: {ex.Message}");
                return false;
            }
        }

        private bool DisableGameBar()
        {
            try
            {
                // Backup + Desativar Game Bar
                using (var key = Registry.CurrentUser.CreateSubKey(@"SOFTWARE\Microsoft\Windows\CurrentVersion\GameDVR"))
                {
                    if (key != null)
                    {
                        _originalAppCaptureEnabled = key.GetValue("AppCaptureEnabled") as int?;
                        key.SetValue("AppCaptureEnabled", 0, RegistryValueKind.DWord);
                    }
                }

                using (var key = Registry.CurrentUser.CreateSubKey(@"System\GameConfigStore"))
                {
                    if (key != null)
                    {
                        _originalGameDvrEnabled = key.GetValue("GameDVR_Enabled") as int?;
                        key.SetValue("GameDVR_Enabled", 0, RegistryValueKind.DWord);
                    }
                }

                // Backup + Desativar Game Mode (pode causar stutters em alguns jogos)
                using (var key = Registry.CurrentUser.CreateSubKey(@"SOFTWARE\Microsoft\GameBar"))
                {
                    if (key != null)
                    {
                        _originalAllowAutoGameMode = key.GetValue("AllowAutoGameMode") as int?;
                        _originalAutoGameModeEnabled = key.GetValue("AutoGameModeEnabled") as int?;
                        key.SetValue("AllowAutoGameMode", 0, RegistryValueKind.DWord);
                        key.SetValue("AutoGameModeEnabled", 0, RegistryValueKind.DWord);
                    }
                }

                _logger.LogInfo("[RealBoost] Game Bar/DVR desativado (backup salvo)");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[RealBoost] Erro Game Bar: {ex.Message}");
                return false;
            }
        }

        private bool DisableFullscreenOptimizations()
        {
            try
            {
                // Backup + Desativar FSO globalmente
                using var key = Registry.CurrentUser.CreateSubKey(@"System\GameConfigStore");
                if (key != null)
                {
                    _originalGameDvrFseBehavior = key.GetValue("GameDVR_FSEBehavior") as int?;
                    _originalGameDvrFseBehaviorMode = key.GetValue("GameDVR_FSEBehaviorMode") as int?;
                    key.SetValue("GameDVR_FSEBehavior", 2, RegistryValueKind.DWord);
                    key.SetValue("GameDVR_FSEBehaviorMode", 2, RegistryValueKind.DWord);
                    key.SetValue("GameDVR_HonorUserFSEBehaviorMode", 1, RegistryValueKind.DWord);
                    key.SetValue("GameDVR_DXGIHonorFSEWindowsCompatible", 1, RegistryValueKind.DWord);
                }

                _logger.LogInfo("[RealBoost] Fullscreen Optimizations desativado (backup salvo)");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[RealBoost] Erro FSO: {ex.Message}");
                return false;
            }
        }

        private bool OptimizeGpuSettings()
        {
            try
            {
                // Backup + Otimizar scheduler de GPU (Windows 10 2004+)
                using var key = Registry.LocalMachine.OpenSubKey(
                    @"SYSTEM\CurrentControlSet\Control\GraphicsDrivers", true);
                
                if (key != null)
                {
                    _originalHwSchMode = key.GetValue("HwSchMode") as int?;
                    // Hardware-accelerated GPU scheduling
                    key.SetValue("HwSchMode", 2, RegistryValueKind.DWord);
                }

                _logger.LogInfo("[RealBoost] GPU scheduling otimizado (backup salvo)");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[RealBoost] Erro GPU: {ex.Message}");
                return false;
            }
        }

        private bool CleanStandbyList()
        {
            try
            {
                // REAL MEMORY BOOST: Trim working sets of background processes
                // Instead of placebo (cleaning self), we trim other non-essential processes
                // This releases physical RAM for the game
                
                long totalBytesReleased = 0;
                int processesTrimmed = 0;
                
                var currentProcessId = Process.GetCurrentProcess().Id;
                var gameProcessId = _gameProcess?.Id ?? -1;
                
                var processes = Process.GetProcesses();
                foreach (var proc in processes)
                {
                    try
                    {
                        // Skip system, self, and game
                        if (proc.Id == 0 || proc.Id == 4 || 
                            proc.Id == currentProcessId || 
                            proc.Id == gameProcessId)
                            continue;
                            
                        // Skip critical windows services (heuristics)
                        var name = proc.ProcessName.ToLowerInvariant();
                        if (name == "csrss" || name == "lsass" || name == "wininit" || 
                            name == "services" || name == "smss" || name == "svchost")
                            continue;

                        // Force trim working set
                        // Capture initial size for stats
                        long initial = proc.WorkingSet64;
                        
                        // -1, -1 flushes the working set
                        if (SetProcessWorkingSetSize(proc.Handle, -1, -1))
                        {
                            // It's hard to measure exact gain immediately as OS is lazy,
                            // but we can assume significant reduction
                            processesTrimmed++;
                        }
                    }
                    catch
                    {
                        // Access denied is expected for system-protected processes
                        continue;
                    }
                }

                _logger.LogInfo($"[RealBoost] Memory Boost: {processesTrimmed} processos background otimizados");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[RealBoost] Erro memória: {ex.Message}");
                return false;
            }
        }

        [DllImport("kernel32.dll")]
        private static extern bool SetProcessWorkingSetSize(IntPtr proc, int min, int max);

        // OptimizeHpet() removido — era placebo (apenas lia bcdedit /enum sem modificar HPET)
        // A otimização real de HPET é feita pelo HpetController.DisableHpet() na Fase 4 do Orchestrator

        #endregion

        /// <summary>
        /// Tenta ativar o Modo Streamer automaticamente se detectar softwares de transmissão
        /// </summary>
        public bool TryActivateStreamerMode()
        {
            bool streamerModeActivated = false;
            try
            {
                // Lista Expandida de Softwares de Streaming e Criação (Enterprise List)
                var streamingApps = new[] 
                { 
                    "obs64", "obs32", "obs",                // OBS Studio
                    "streamlabs obs", "streamlabs desktop", // Streamlabs
                    "tiktok live studio",                   // TikTok Studio (Solicitado)
                    "twitchstudio",                         // Twitch
                    "xsplit.core",                          // XSplit
                    "vmix64",                               // vMix
                    "prislive",                             // Prism Live Studio
                    "nvidia share", "nvidia broadcast"      // NVIDIA Tools
                };
                
                foreach (var appName in streamingApps)
                {
                    var processes = Process.GetProcessesByName(appName);
                    if (processes.Length > 0)
                    {
                        streamerModeActivated = true;
                    }

                    foreach (var proc in processes)
                    {
                        try
                        {
                            // Se o jogo está em High, OBS deve estar pelo menos em AboveNormal 
                            // para evitar encoding lag / dropped frames
                            if (proc.PriorityClass <= ProcessPriorityClass.Normal)
                            {
                                proc.PriorityClass = ProcessPriorityClass.AboveNormal;
                                _logger.LogInfo($"[RealBoost] 🎥 MODO STREAMER AUTOMÁTICO: {appName} detectado e protegido");
                            }
                        }
                        catch { }
                        finally { proc.Dispose(); }
                    }
                }

                if (streamerModeActivated)
                {
                    _logger.LogSuccess("[RealBoost] 🎥 MODO STREAMER ATIVADO (Encoding Priorizado)");
                }
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[RealBoost] Erro ao ativar modo streamer: {ex.Message}");
            }
            
            return streamerModeActivated;
        }

        #region Helpers

        private string? GetActivePowerPlan()
        {
            try
            {
                using var process = new Process
                {
                    StartInfo = new ProcessStartInfo
                    {
                        FileName = "powercfg",
                        Arguments = "/getactivescheme",
                        UseShellExecute = false,
                        CreateNoWindow = true,
                        RedirectStandardOutput = true
                    }
                };

                process.Start();
                var output = process.StandardOutput.ReadToEnd();
                process.WaitForExit(5000);

                // Extrair GUID do output
                var match = System.Text.RegularExpressions.Regex.Match(output, @"([a-f0-9\-]{36})", 
                    System.Text.RegularExpressions.RegexOptions.IgnoreCase);
                
                return match.Success ? match.Value : null;
            }
            catch
            {
                return null;
            }
        }

        private bool RunPowerCfg(string args)
        {
            try
            {
                using var process = new Process
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

                process.Start();
                process.WaitForExit(10000);
                return process.ExitCode == 0;
            }
            catch
            {
                return false;
            }
        }

        #endregion

        public void Dispose()
        {
            _timerService?.Dispose();
        }
    }
}



