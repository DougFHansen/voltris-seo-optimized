using System;
using System.IO;
using System.Threading;
using System.Threading.Tasks;
using System.Linq;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using VoltrisOptimizer.Services.Gamer.Models;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Services.Gamer.GamerModeManager;

namespace VoltrisOptimizer.Services.Gamer.Implementation
{
    /// <summary>
    /// Componente de nível de produção responsável por garantir que o sistema sempre retorne
    /// ao seu estado original após o uso do Modo Gamer.
    /// Implementa proteção contra encerramento inesperado e snapshots persistentes.
    /// </summary>
    public class GamerModeStateManager : IGamerModeStateManager
    {
        private readonly ILoggingService _logger;
        private readonly IGamerModeOrchestrator _orchestrator;
        private readonly IPowerPlanService _powerPlanService;
        private readonly TaskbarOptimizationManager _taskbarOptimizer;
        private readonly ShellStateManager _shellStateManager;
        private readonly string _snapshotPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "system_snapshot.json");
        private readonly SemaphoreSlim _lock = new(1, 1);
        private bool _isRestoring = false;

        public bool IsGamerModeActive => _orchestrator.IsActive;

        public GamerModeStateManager(
            ILoggingService logger, 
            IGamerModeOrchestrator orchestrator, 
            IPowerPlanService powerPlanService,
            WindowsShellControlService shellControl)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _orchestrator = orchestrator ?? throw new ArgumentNullException(nameof(orchestrator));
            _powerPlanService = powerPlanService ?? throw new ArgumentNullException(nameof(powerPlanService));
            
            // Usar serviços centralizados ao invés de duplicar código
            _taskbarOptimizer = new TaskbarOptimizationManager(logger, shellControl);
            _shellStateManager = new ShellStateManager(logger);
        }

        /// <summary>
        /// Captura os valores originais do sistema antes de qualquer otimização ser aplicada.
        /// </summary>
        public async Task<SystemOptimizationSnapshot> CaptureSnapshotAsync()
        {
            var sw = System.Diagnostics.Stopwatch.StartNew();
            _logger.LogInfo("[StateManager] 🔍 Iniciando captura completa do estado do sistema...");
            _logger.LogInfo("[StateManager] 📊 Validando privilégios de administrador...");
            
            // Validação de privilégios ANTES de prosseguir
            if (!HasRegistryWriteAccess())
            {
                _logger.LogCritical("[StateManager] ❌ Acesso negado ao HKLM. O sistema não poderá restaurar o estado original se prosseguir.");
                throw new UnauthorizedAccessException("Privilégios de administrador insuficientes para gerenciar estado do sistema.");
            }
            
            _logger.LogSuccess("[StateManager] ✅ Privilégios validados com sucesso");

            var snapshot = new SystemOptimizationSnapshot();
            int configsCaptured = 0;
            
            try
            {
                _logger.LogInfo("[StateManager] 📸 Capturando configurações de CPU e Performance...");
                
                // Backup de chaves críticas de Registro (Runtime & Performance)
                
                // 1. Win32PrioritySeparation
                using (var key = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\PriorityControl"))
                {
                    snapshot.Win32PrioritySeparation = key?.GetValue("Win32PrioritySeparation");
                    _logger.LogInfo($"[Snapshot] 📌 Win32PrioritySeparation: {snapshot.Win32PrioritySeparation ?? "N/A"}");
                    if (snapshot.Win32PrioritySeparation != null) configsCaptured++;
                }

                // 2. Power Throttling
                using (var key = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\Power\PowerThrottling"))
                {
                    snapshot.PowerThrottlingOff = (int?)key?.GetValue("PowerThrottlingOff");
                    _logger.LogInfo($"[Snapshot] 📌 PowerThrottlingOff: {snapshot.PowerThrottlingOff?.ToString() ?? "N/A"}");
                    if (snapshot.PowerThrottlingOff.HasValue) configsCaptured++;
                }

                // ✅ NOVO: Capturar estados da barra de tarefas usando serviço centralizado
                _logger.LogInfo("[Snapshot] 📊 Capturando estados da barra de tarefas...");
                _taskbarOptimizer.CaptureCurrentState();
                
                // Salvar estados no snapshot
                var taskbarState = _taskbarOptimizer.GetCapturedState();
                if (taskbarState != null)
                {
                    snapshot.TaskbarState = taskbarState;
                    await _shellStateManager.SaveStateAsync(taskbarState);
                    _logger.LogSuccess("[Snapshot] ✅ Estados da barra de tarefas capturados e salvos");
                    configsCaptured++;
                }

                _logger.LogInfo("[Snapshot] 📸 Capturando configurações visuais...");
                
                // 3. Visuals (Aero, Animações, Transparência)
                using (var key = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(@"Control Panel\Desktop\WindowMetrics"))
                {
                    snapshot.MinAnimate = key?.GetValue("MinAnimate")?.ToString();
                    if (snapshot.MinAnimate != null)
                    {
                        _logger.LogInfo($"[Snapshot] 📌 MinAnimate: {snapshot.MinAnimate}");
                        configsCaptured++;
                    }
                }
                
                using (var key = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(@"Control Panel\Desktop"))
                {
                    snapshot.UserPreferencesMask = (byte[]?)key?.GetValue("UserPreferencesMask");
                    snapshot.FontSmoothing = key?.GetValue("FontSmoothing")?.ToString();
                    snapshot.FontSmoothingType = (int?)key?.GetValue("FontSmoothingType");
                    if (snapshot.UserPreferencesMask != null) configsCaptured++;
                }
                
                using (var key = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Themes\Personalize"))
                {
                    var value = key?.GetValue("EnableTransparency");
                    if (value is int intValue)
                    {
                         snapshot.EnableTransparency = intValue;
                         _logger.LogInfo($"[Snapshot] 📌 EnableTransparency: {intValue}");
                         configsCaptured++;
                    }
                }

                // 4. Aplicativos em Segundo Plano
                using (var key = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\BackgroundAccessApplications"))
                {
                    snapshot.BackgroundAppsGlobalDisabled = (int?)key?.GetValue("GlobalUserDisabled");
                    if (snapshot.BackgroundAppsGlobalDisabled.HasValue)
                    {
                        _logger.LogInfo($"[Snapshot] 📌 BackgroundApps: {snapshot.BackgroundAppsGlobalDisabled.Value}");
                        configsCaptured++;
                    }
                }

                _logger.LogInfo("[Snapshot] 📸 Capturando plano de energia...");
                
                // 5. Plano de Energia Ativo (CRÍTICO)
                try
                {
                    var powerPlan = _powerPlanService.GetActivePowerPlan();
                    if (!string.IsNullOrEmpty(powerPlan.Guid))
                    {
                        if (!powerPlan.Name.Contains("Voltris", StringComparison.OrdinalIgnoreCase))
                        {
                            snapshot.OriginalPowerPlanGuid = Guid.Parse(powerPlan.Guid);
                            _logger.LogInfo($"[Snapshot] 📌 Plano de Energia Original: {powerPlan.Name} ({powerPlan.Guid})");
                            configsCaptured++;
                        }
                        else
                        {
                             _logger.LogWarning("[Snapshot] ⚠️ Plano ativo já é Voltris! Buscando plano 'Balanced' como fallback.");
                             var plans = _powerPlanService.GetAvailablePlans();
                             var balanced = plans.FirstOrDefault(p => p.Name.Contains("Equilibrado", StringComparison.OrdinalIgnoreCase) || p.Name.Contains("Balanced", StringComparison.OrdinalIgnoreCase));
                             if (!string.IsNullOrEmpty(balanced.Guid))
                             {
                                 snapshot.OriginalPowerPlanGuid = Guid.Parse(balanced.Guid);
                                 _logger.LogInfo($"[Snapshot] 📌 Plano Fallback: {balanced.Name}");
                                 configsCaptured++;
                             }
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogWarning($"[Snapshot] ⚠️ Falha ao capturar plano de energia: {ex.Message}");
                }

                _logger.LogInfo("[Snapshot] 📸 Capturando configurações de GPU...");
                
                // 6. GPU Tweaks (HAGS & TDR)
                using (var key = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(@"System\CurrentControlSet\Control\GraphicsDrivers"))
                {
                    if (key != null)
                    {
                        snapshot.HwSchMode = (int?)key.GetValue("HwSchMode");
                        snapshot.TdrDelay = (int?)key.GetValue("TdrDelay");
                        snapshot.TdrLevel = (int?)key.GetValue("TdrLevel");
                        snapshot.TdrDdiDelay = (int?)key.GetValue("TdrDdiDelay");
                        
                        int gpuConfigs = 0;
                        if (snapshot.HwSchMode.HasValue) gpuConfigs++;
                        if (snapshot.TdrDelay.HasValue) gpuConfigs++;
                        if (snapshot.TdrLevel.HasValue) gpuConfigs++;
                        if (snapshot.TdrDdiDelay.HasValue) gpuConfigs++;
                        
                        _logger.LogInfo($"[Snapshot] 📌 GPU Tweaks capturados: {gpuConfigs} configurações");
                        configsCaptured += gpuConfigs;
                    }
                }

                snapshot.CapturedAt = DateTime.Now;
                
                // ESTRATÉGIA A/B REDUNDANTE: TMP -> BAK -> JSON
                string tempPath = _snapshotPath + ".tmp";
                string backupPath = _snapshotPath + ".bak";
                var options = new System.Text.Json.JsonSerializerOptions { WriteIndented = true };
                var json = System.Text.Json.JsonSerializer.Serialize(snapshot, options);
                
                _logger.LogInfo($"[StateManager] 💾 Salvando snapshot: {json.Length} bytes, {configsCaptured} configurações");
                
                // 1. Escrever novo estado em arquivo temporário
                await File.WriteAllTextAsync(tempPath, json);
                
                // 2. Se já existe um snapshot, transformá-lo em backup antes de sobrescrever
                if (File.Exists(_snapshotPath))
                {
                    if (File.Exists(backupPath)) File.Delete(backupPath);
                    File.Move(_snapshotPath, backupPath);
                }
                
                // 3. Promover o novo snapshot
                File.Move(tempPath, _snapshotPath);
                
                sw.Stop();
                _logger.LogSuccess($"[StateManager] ✅ Snapshot persistido com REDUNDÂNCIA A/B");
                _logger.LogInfo($"[StateManager] ⏱️ Captura concluída em {sw.ElapsedMilliseconds}ms");
                _logger.LogInfo($"[StateManager] 📊 Total de configurações capturadas: {configsCaptured}");
                
                return snapshot;
            }
            catch (Exception ex)
            {
                sw.Stop();
                _logger.LogCritical($"[StateManager] ❌ FALHA CRÍTICA NA PERSISTÊNCIA DO SNAPSHOT: {ex.Message}");
                _logger.LogError($"[StateManager] Tempo até falha: {sw.ElapsedMilliseconds}ms", ex);
                throw;
            }
        }

        public async Task RestoreOriginalSystemState()
        {
            string backupPath = _snapshotPath + ".bak";

            // Validação de segurança: se não está ativo e não há snapshot nem backup, nada a fazer
            if (!IsGamerModeActive && !File.Exists(_snapshotPath) && !File.Exists(backupPath))
            {
                return;
            }

            if (!await _lock.WaitAsync(2000))
            {
                _logger.LogWarning("[StateManager] Restauração já está em andamento.");
                return;
            }

            try
            {
                _isRestoring = true;
                _logger.LogWarning("🛡️ [StateManager] INICIANDO REPARO AUTOMÁTICO/ROLLBACK DO SISTEMA...");

                // 1. Rollback via Orchestrator (Runtime)
                using var cts = new CancellationTokenSource(TimeSpan.FromSeconds(15));
                try { await _orchestrator.DeactivateAsync(cancellationToken: cts.Token); } catch { }

                // 2. Rollback via Snapshot (Primary or Backup)
                string pathToLoad = File.Exists(_snapshotPath) ? _snapshotPath : (File.Exists(backupPath) ? backupPath : null);

                if (pathToLoad != null)
                {
                    _logger.LogInfo($"[StateManager] Restaurando via: {Path.GetFileName(pathToLoad)}");
                    try
                    {
                        var json = await File.ReadAllTextAsync(pathToLoad);
                        var snapshot = System.Text.Json.JsonSerializer.Deserialize<SystemOptimizationSnapshot>(json);
                        if (snapshot != null) ApplySnapshotRollback(snapshot);
                        
                        // Limpeza de segurança
                        if (File.Exists(_snapshotPath)) File.Delete(_snapshotPath);
                        if (File.Exists(backupPath)) File.Delete(backupPath);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"[StateManager] Erro ao carregar snapshot: {ex.Message}");
                    }
                }

                _logger.LogSuccess("✅ [StateManager] Sistema restaurado e limpo. Status: PROTECTED_STATE_RESTORED");
            }
            finally
            {
                _isRestoring = false;
                _lock.Release();
            }
        }

        private void ApplySnapshotRollback(SystemOptimizationSnapshot snapshot)
        {
            try
            {
                // Restauração de chaves de registro Low-Level
                
                // 1. Quantum do Processador
                if (snapshot.Win32PrioritySeparation != null)
                {
                    using var key = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\PriorityControl", true);
                    key?.SetValue("Win32PrioritySeparation", snapshot.Win32PrioritySeparation);
                }

                // 2. Power Throttling
                if (snapshot.PowerThrottlingOff.HasValue)
                {
                    using var key = Microsoft.Win32.Registry.LocalMachine.CreateSubKey(@"SYSTEM\CurrentControlSet\Control\Power\PowerThrottling", true);
                    key?.SetValue("PowerThrottlingOff", snapshot.PowerThrottlingOff.Value, Microsoft.Win32.RegistryValueKind.DWord);
                }

                // 3. Janelas e Animações
                if (snapshot.MinAnimate != null)
                {
                    using var key = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(@"Control Panel\Desktop\WindowMetrics", true);
                    key?.SetValue("MinAnimate", snapshot.MinAnimate);
                }
                
                if (snapshot.UserPreferencesMask != null)
                {
                    using var key = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(@"Control Panel\Desktop", true);
                    key?.SetValue("UserPreferencesMask", snapshot.UserPreferencesMask, Microsoft.Win32.RegistryValueKind.Binary);
                }

                // 4. Background Apps
                if (snapshot.BackgroundAppsGlobalDisabled.HasValue)
                {
                    using var key = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\BackgroundAccessApplications", true);
                    key?.SetValue("GlobalUserDisabled", snapshot.BackgroundAppsGlobalDisabled.Value, Microsoft.Win32.RegistryValueKind.DWord);
                }

                // 5. Transparência (Safety Re-Apply)
                if (snapshot.EnableTransparency.HasValue)
                {
                    using var key = Microsoft.Win32.Registry.CurrentUser.OpenSubKey(@"Software\Microsoft\Windows\CurrentVersion\Themes\Personalize", true);
                    key?.SetValue("EnableTransparency", snapshot.EnableTransparency.Value, Microsoft.Win32.RegistryValueKind.DWord);
                    _logger.LogInfo("[StateManager] Rollback de Transparência forçado via Snapshot.");
                }

                // 6. Plano de Energia (CRÍTICO)
                if (snapshot.OriginalPowerPlanGuid.HasValue)
                {
                    string guidStr = snapshot.OriginalPowerPlanGuid.Value.ToString();
                    _logger.LogWarning($"[StateManager] Restaurando Plano de Energia via Snapshot: {guidStr}");
                    _powerPlanService.SetPowerPlanByGuid(guidStr);
                }

                // 7. GPU Tweaks (HAGS & TDR)
                if (snapshot.HwSchMode.HasValue || snapshot.TdrDelay.HasValue)
                {
                    using var key = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(@"System\CurrentControlSet\Control\GraphicsDrivers", true);
                    if (key != null)
                    {
                        if (snapshot.HwSchMode.HasValue) key.SetValue("HwSchMode", snapshot.HwSchMode.Value);
                        if (snapshot.TdrDelay.HasValue) key.SetValue("TdrDelay", snapshot.TdrDelay.Value);
                        else key.DeleteValue("TdrDelay", false);
                        
                        if (snapshot.TdrLevel.HasValue) key.SetValue("TdrLevel", snapshot.TdrLevel.Value);
                        else key.DeleteValue("TdrLevel", false);
                        
                        if (snapshot.TdrDdiDelay.HasValue) key.SetValue("TdrDdiDelay", snapshot.TdrDdiDelay.Value);
                        else key.DeleteValue("TdrDdiDelay", false);
                        
                        _logger.LogInfo("[StateManager] Rollback de GPU (TDR/HAGS) aplicado via Snapshot.");
                    }
                }

                // ✅ NOVO: Restaurar estados da barra de tarefas usando serviço centralizado
                if (snapshot.TaskbarState != null)
                {
                    _logger.LogInfo("[StateManager] 🔄 Restaurando estados da barra de tarefas...");
                    _taskbarOptimizer.RestoreFromState(snapshot.TaskbarState);
                    _logger.LogSuccess("[StateManager] ✅ Estados da barra de tarefas restaurados");
                }

                _logger.LogInfo("[StateManager] Rollback de registro do Snapshot aplicado.");
            }
            catch (Exception ex)
            {
                _logger.LogWarning($"[StateManager] Falha parcial na restauração do snapshot: {ex.Message}");
            }
        }
        
        private bool HasRegistryWriteAccess()
        {
            try
            {
                using var key = Microsoft.Win32.Registry.LocalMachine.OpenSubKey(@"SYSTEM\CurrentControlSet\Control\PriorityControl", true);
                return key != null;
            }
            catch { return false; }
        }
    }
}
