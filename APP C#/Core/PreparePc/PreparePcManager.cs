using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using VoltrisOptimizer.Core.PreparePc.Interfaces;
using VoltrisOptimizer.Core.PreparePc.Steps;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Utils;

namespace VoltrisOptimizer.Core.PreparePc
{
    /// <summary>
    /// Resultado completo da preparação do PC
    /// </summary>
    public class PreparePcResult
    {
        public bool Success { get; set; }
        public PreparePcMode Mode { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public TimeSpan TotalDuration => EndTime - StartTime;
        public List<StepResult> StepResults { get; set; } = new();
        public string BackupFolderPath { get; set; } = string.Empty;
        public string ReportPath { get; set; } = string.Empty;
        public int SuccessfulSteps => StepResults.Count(r => r.Success);
        public int FailedSteps => StepResults.Count(r => !r.Success && r.Status != StepStatus.Skipped);
        public int SkippedSteps => StepResults.Count(r => r.Status == StepStatus.Skipped);
        public bool RequiresReboot => StepResults.Any(r => r.RequiresReboot);
        public string[] AllLogs => StepResults.SelectMany(r => r.Logs).ToArray();
    }
    
    /// <summary>
    /// Progresso geral da preparação
    /// </summary>
    public class PreparePcProgress
    {
        public int CurrentStepIndex { get; set; }
        public int TotalSteps { get; set; }
        public string CurrentStepName { get; set; } = string.Empty;
        public int OverallPercent { get; set; }
        public int StepPercent { get; set; }
        public string CurrentAction { get; set; } = string.Empty;
        public StepStatus CurrentStatus { get; set; }
        public List<string> Logs { get; set; } = new();
        public TimeSpan ElapsedTime { get; set; }
        public TimeSpan EstimatedRemaining { get; set; }
    }
    
    /// <summary>
    /// Opções de configuração do Prepare PC
    /// </summary>
    public class PreparePcOptions
    {
        public PreparePcMode Mode { get; set; } = PreparePcMode.Recommended;
        public string? CustomBackupPath { get; set; }
        public bool CreateSystemRestore { get; set; } = false;
        public int TimeoutMinutes { get; set; } = 120;
        public bool AllowNetworkReset { get; set; } = false;
        public bool CleanBrowserCaches { get; set; } = true;
        public bool CleanShaderCaches { get; set; } = true;
        public bool OptimizeServices { get; set; } = true;
        public bool ApplyPowerPlan { get; set; } = true;
        public List<string> SkipSteps { get; set; } = new();
    }
    
    /// <summary>
    /// Gerenciador principal do Prepare PC
    /// Orquestra todos os steps de forma assíncrona e segura
    /// </summary>
    public class PreparePcManager
    {
        private readonly ILoggingService _logger;
        private readonly IRollbackManager _rollbackManager;
        private readonly List<IRepairStep> _steps;
        private readonly string _backupBasePath;
        private CancellationTokenSource? _cts;
        private bool _isRunning;
        
        /// <summary>
        /// Evento disparado quando o progresso muda
        /// </summary>
        public event EventHandler<PreparePcProgress>? ProgressChanged;
        
        /// <summary>
        /// Evento disparado quando um log é adicionado
        /// </summary>
        public event EventHandler<string>? LogAdded;
        
        /// <summary>
        /// Indica se está em execução
        /// </summary>
        public bool IsRunning => _isRunning;
        
        public PreparePcManager(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _backupBasePath = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                "Voltris", "Backups");
            
            _rollbackManager = new RollbackManager(logger, _backupBasePath);
            _steps = InitializeSteps();
        }
        
        private List<IRepairStep> InitializeSteps()
        {
            return new List<IRepairStep>
            {
                new PreCheckStep(_logger),
                new BackupStep(_logger, _backupBasePath),
                new SfcStep(_logger),
                new DismStep(_logger),
                new CacheCleanerStep(_logger),
                new NetworkResetStep(_logger),
                new ShaderCacheStep(_logger),
                new ServiceOptimizerStep(_logger),
                new PowerPlanStep(_logger, _backupBasePath)
            }.OrderBy(s => s.Order).ToList();
        }
        
        /// <summary>
        /// Verifica pré-requisitos antes de executar
        /// </summary>
        public async Task<PreCheckResult> RunPreChecksAsync(CancellationToken ct = default)
        {
            var result = new PreCheckResult();
            
            // Verificar admin
            result.IsAdmin = AdminHelper.IsRunningAsAdministrator();
            if (!result.IsAdmin)
            {
                result.Errors.Add("O Voltris precisa ser executado como Administrador para preparar o PC.");
            }
            
            // Verificar bateria
            var batteryStatus = await CheckBatteryStatusAsync();
            result.IsOnBattery = batteryStatus.isOnBattery;
            result.BatteryPercent = batteryStatus.percent;
            if (result.IsOnBattery && result.BatteryPercent < 40)
            {
                result.Warnings.Add($"Bateria baixa ({result.BatteryPercent}%). Algumas operações podem ser bloqueadas.");
            }
            
            // Verificar espaço em disco
            result.FreeSpaceGB = await CheckFreeSpaceAsync();
            var driveInfo = new DriveInfo(Path.GetPathRoot(Environment.SystemDirectory) ?? "C:");
            var freePercent = (result.FreeSpaceGB * 100.0) / (driveInfo.TotalSize / (1024.0 * 1024 * 1024));
            if (freePercent < 10)
            {
                result.Errors.Add($"Espaço em disco insuficiente ({result.FreeSpaceGB:F1} GB). Mínimo recomendado: 10% do disco.");
            }
            
            // Verificar processos de instalação
            result.InstallerProcesses = await CheckInstallerProcessesAsync();
            if (result.InstallerProcesses.Any())
            {
                result.Warnings.Add($"Processos de instalação detectados: {string.Join(", ", result.InstallerProcesses)}. Recomendado fechar antes de continuar.");
            }
            
            result.CanProceed = !result.Errors.Any();
            
            return result;
        }
        
        /// <summary>
        /// Executa a preparação do PC
        /// </summary>
        public async Task<PreparePcResult> ExecuteAsync(
            PreparePcOptions options,
            IProgress<PreparePcProgress>? progress = null,
            CancellationToken ct = default)
        {
            if (_isRunning)
                throw new InvalidOperationException("Prepare PC já está em execução.");
            
            _isRunning = true;
            _cts = CancellationTokenSource.CreateLinkedTokenSource(ct);
            
            var result = new PreparePcResult
            {
                Mode = options.Mode,
                StartTime = DateTime.Now
            };
            
            // Criar pasta de backup com timestamp
            var backupFolder = options.CustomBackupPath ?? 
                Path.Combine(_backupBasePath, DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss"));
            Directory.CreateDirectory(backupFolder);
            result.BackupFolderPath = backupFolder;
            
            Log($"[PreparePc] Iniciando em modo {options.Mode}");
            Log($"[PreparePc] Pasta de backup: {backupFolder}");
            
            // NOVO: Iniciar progresso global
            GlobalProgressService.Instance.StartOperation($"Preparando PC ({options.Mode})...");
            
            try
            {
                // Filtrar steps a executar
                var stepsToRun = _steps
                    .Where(s => !options.SkipSteps.Contains(s.Name))
                    .Where(s => ShouldRunStep(s, options))
                    .ToList();
                
                var totalSteps = stepsToRun.Count;
                var startTime = DateTime.Now;
                
                for (int i = 0; i < stepsToRun.Count; i++)
                {
                    if (_cts.Token.IsCancellationRequested)
                    {
                        Log("[PreparePc] Execução cancelada pelo usuário");
                        break;
                    }
                    
                    var step = stepsToRun[i];
                    var elapsed = DateTime.Now - startTime;
                    var avgTimePerStep = i > 0 ? elapsed.TotalSeconds / i : step.EstimatedTimeSeconds;
                    var remaining = TimeSpan.FromSeconds(avgTimePerStep * (totalSteps - i));
                    
                    // Calcular progresso base deste step (suave, sem pulos grandes)
                    var basePercent = Math.Clamp((i * 100) / totalSteps, 0, 99);
                    
                    // Atualizar progresso
                    var currentProgress = new PreparePcProgress
                    {
                        CurrentStepIndex = i + 1,
                        TotalSteps = totalSteps,
                        CurrentStepName = step.Name,
                        OverallPercent = basePercent,
                        StepPercent = 0,
                        CurrentAction = $"Iniciando {step.Name}...",
                        CurrentStatus = StepStatus.Running,
                        ElapsedTime = elapsed,
                        EstimatedRemaining = remaining
                    };
                    progress?.Report(currentProgress);
                    ProgressChanged?.Invoke(this, currentProgress);
                    
                    // NOVO: Atualizar progresso global
                    GlobalProgressService.Instance.UpdateProgress(
                        basePercent, 
                        $"Preparando PC: {step.Name} ({i + 1}/{totalSteps})...");
                    
                    Log($"[PreparePc] Executando step {i + 1}/{totalSteps}: {step.Name}");
                    
                    // Verificar se pode executar
                    var (canRun, reason) = await step.CanExecuteAsync(_cts.Token);
                    if (!canRun)
                    {
                        Log($"[PreparePc] Step {step.Name} ignorado: {reason}");
                        result.StepResults.Add(StepResult.Skipped(reason));
                        continue;
                    }
                    
                    // Verificar modo e risco
                    if (!ShouldExecuteBasedOnRisk(step, options.Mode))
                    {
                        Log($"[PreparePc] Step {step.Name} ignorado por política de risco (modo: {options.Mode})");
                        result.StepResults.Add(StepResult.Skipped($"Ignorado no modo {options.Mode}"));
                        continue;
                    }
                    
                    // Executar step com progress individual
                    var stepIndex = i; // Capturar para closure
                    var stepProgress = new Progress<StepProgress>(sp =>
                    {
                        var safeStepPercent = Math.Clamp(sp.PercentComplete, 0, 100);
                        currentProgress.StepPercent = safeStepPercent;
                        // Progresso suave: base do step + contribuição proporcional dentro do step
                        var stepWeight = 100.0 / totalSteps;
                        currentProgress.OverallPercent = Math.Clamp(
                            (int)((stepIndex * stepWeight) + (safeStepPercent * stepWeight / 100.0)), 0, 99);
                        currentProgress.CurrentAction = sp.CurrentAction;
                        progress?.Report(currentProgress);
                        ProgressChanged?.Invoke(this, currentProgress);
                        
                        // NOVO: Atualizar progresso global com detalhes do step
                        GlobalProgressService.Instance.UpdateProgress(
                            currentProgress.OverallPercent, 
                            $"{step.Name}: {sp.CurrentAction}");
                        
                        foreach (var log in sp.RecentLogs)
                        {
                            Log(log);
                            currentProgress.Logs.Add(log);
                        }
                    });
                    
                    var stepStartTime = DateTime.Now;
                    var stepResult = await step.ExecuteAsync(options.Mode, stepProgress, _cts.Token);
                    stepResult.Duration = DateTime.Now - stepStartTime;
                    
                    result.StepResults.Add(stepResult);
                    
                    // Registrar para rollback se tem backup
                    if (stepResult.Success && !string.IsNullOrEmpty(stepResult.BackupPath))
                    {
                        _rollbackManager.RegisterAction(step.Name, stepResult.BackupPath, DateTime.Now);
                    }
                    
                    Log($"[PreparePc] Step {step.Name} concluído: {stepResult.Status} - {stepResult.Message}");
                    
                    // Se falhou e não é DryRun, perguntar se quer continuar ou rollback
                    if (!stepResult.Success && options.Mode != PreparePcMode.DryRun)
                    {
                        var failedPercent = (result.FailedSteps * 100.0) / (i + 1);
                        if (failedPercent > 30) // Se mais de 30% dos steps falharam
                        {
                            Log("[PreparePc] Taxa de falha alta detectada. Recomendado rollback.");
                            // Em um cenário real, aqui perguntaria ao usuário
                        }
                    }
                }
                
                result.Success = result.FailedSteps == 0;
                result.EndTime = DateTime.Now;
                
                // Gerar relatório
                result.ReportPath = await GenerateReportAsync(result, backupFolder);
                
                // NOVO: Completar progresso global
                GlobalProgressService.Instance.CompleteOperation(
                    result.Success 
                        ? $"Preparação concluída! {result.SuccessfulSteps} ações aplicadas" 
                        : $"Preparação concluída com {result.FailedSteps} erros");
                
                Log($"[PreparePc] Preparação concluída em {result.TotalDuration:mm\\:ss}");
                Log($"[PreparePc] Sucesso: {result.SuccessfulSteps}, Falhas: {result.FailedSteps}, Ignorados: {result.SkippedSteps}");
                
                if (result.RequiresReboot)
                {
                    Log("[PreparePc] ⚠️ Reinicialização necessária para aplicar algumas alterações.");
                }
            }
            catch (OperationCanceledException)
            {
                result.Success = false;
                result.EndTime = DateTime.Now;
                Log("[PreparePc] Operação cancelada");
                
                // NOVO: Completar progresso global em caso de cancelamento
                GlobalProgressService.Instance.CompleteOperation("Preparação cancelada");
            }
            catch (Exception ex)
            {
                result.Success = false;
                result.EndTime = DateTime.Now;
                Log($"[PreparePc] Erro crítico: {ex.Message}");
                _logger.LogError("[PreparePc] Erro crítico", ex);
                
                // NOVO: Completar progresso global em caso de erro
                GlobalProgressService.Instance.CompleteOperation("Erro na preparação");
            }
            finally
            {
                _isRunning = false;
                _cts?.Dispose();
                _cts = null;
            }
            
            return result;
        }
        
        /// <summary>
        /// Cancela a execução atual
        /// </summary>
        public void Cancel()
        {
            if (_isRunning && _cts != null)
            {
                Log("[PreparePc] Cancelamento solicitado...");
                _cts.Cancel();
            }
        }
        
        /// <summary>
        /// Executa rollback de todas as ações
        /// </summary>
        public async Task<bool> RollbackAsync(IProgress<PreparePcProgress>? progress = null, CancellationToken ct = default)
        {
            Log("[PreparePc] Iniciando rollback...");
            
            var stepProgress = new Progress<StepProgress>(sp =>
            {
                Log(sp.CurrentAction);
            });
            
            var success = await _rollbackManager.RollbackAllAsync(stepProgress, ct);
            
            Log(success ? "[PreparePc] Rollback concluído com sucesso" : "[PreparePc] Rollback concluído com erros");
            
            return success;
        }
        
        /// <summary>
        /// Obtém estimativa de tempo total
        /// </summary>
        public int GetEstimatedTimeMinutes(PreparePcOptions options)
        {
            var stepsToRun = _steps
                .Where(s => !options.SkipSteps.Contains(s.Name))
                .Where(s => ShouldRunStep(s, options));
            
            var totalSeconds = stepsToRun.Sum(s => s.EstimatedTimeSeconds);
            return (int)Math.Ceiling(totalSeconds / 60.0);
        }
        
        /// <summary>
        /// Obtém lista de steps que serão executados
        /// </summary>
        public IEnumerable<(string Name, string Description, RiskCategory Risk, int EstimatedSeconds)> GetStepsToRun(PreparePcOptions options)
        {
            return _steps
                .Where(s => !options.SkipSteps.Contains(s.Name))
                .Where(s => ShouldRunStep(s, options))
                .Select(s => (s.Name, s.Description, s.Risk, s.EstimatedTimeSeconds));
        }
        
        /// <summary>
        /// Obtém gerenciador de rollback
        /// </summary>
        public IRollbackManager RollbackManager => _rollbackManager;
        
        #region Private Methods
        
        private bool ShouldRunStep(IRepairStep step, PreparePcOptions options)
        {
            // Steps condicionais baseados em opções
            if (step is NetworkResetStep && !options.AllowNetworkReset)
                return false;
            if (step is ShaderCacheStep && !options.CleanShaderCaches)
                return false;
            if (step is ServiceOptimizerStep && !options.OptimizeServices)
                return false;
            if (step is PowerPlanStep && !options.ApplyPowerPlan)
                return false;
            
            return true;
        }
        
        private bool ShouldExecuteBasedOnRisk(IRepairStep step, PreparePcMode mode)
        {
            return mode switch
            {
                PreparePcMode.DryRun => true, // Simula todos
                PreparePcMode.Recommended => step.Risk == RiskCategory.Safe,
                PreparePcMode.Full => true, // Executa todos (com confirmações)
                _ => false
            };
        }
        
        private async Task<(bool isOnBattery, int percent)> CheckBatteryStatusAsync()
        {
            return await Task.Run(() =>
            {
                try
                {
                    var status = System.Windows.Forms.SystemInformation.PowerStatus;
                    var isOnBattery = status.PowerLineStatus == System.Windows.Forms.PowerLineStatus.Offline;
                    var percent = (int)(status.BatteryLifePercent * 100);
                    return (isOnBattery, percent);
                }
                catch
                {
                    return (false, 100); // Assume desktop
                }
            });
        }
        
        private async Task<double> CheckFreeSpaceAsync()
        {
            return await Task.Run(() =>
            {
                try
                {
                    var systemDrive = Path.GetPathRoot(Environment.SystemDirectory) ?? "C:\\";
                    var driveInfo = new DriveInfo(systemDrive);
                    return driveInfo.AvailableFreeSpace / (1024.0 * 1024 * 1024);
                }
                catch
                {
                    return 0;
                }
            });
        }
        
        private async Task<List<string>> CheckInstallerProcessesAsync()
        {
            return await Task.Run(() =>
            {
                var installerNames = new[] { "msiexec", "setup", "install", "update" };
                var found = new List<string>();
                
                try
                {
                    foreach (var proc in System.Diagnostics.Process.GetProcesses())
                    {
                        try
                        {
                            var name = proc.ProcessName.ToLowerInvariant();
                            if (installerNames.Any(i => name.Contains(i)))
                            {
                                found.Add(proc.ProcessName);
                            }
                        }
                        catch { }
                        finally
                        {
                            proc.Dispose();
                        }
                    }
                }
                catch { }
                
                return found.Distinct().ToList();
            });
        }
        
        private async Task<string> GenerateReportAsync(PreparePcResult result, string backupFolder)
        {
            var report = new
            {
                GeneratedAt = DateTime.Now,
                result.Mode,
                result.StartTime,
                result.EndTime,
                Duration = result.TotalDuration.ToString(),
                result.Success,
                result.SuccessfulSteps,
                result.FailedSteps,
                result.SkippedSteps,
                result.RequiresReboot,
                BackupPath = result.BackupFolderPath,
                Steps = result.StepResults.Select(s => new
                {
                    s.Status,
                    s.Message,
                    s.BackupPath,
                    Duration = s.Duration.ToString(),
                    s.RequiresReboot,
                    s.CanRollback,
                    LogCount = s.Logs.Length
                }),
                AllLogs = result.AllLogs
            };
            
            var reportPath = Path.Combine(backupFolder, "prepare_pc_report.json");
            var json = JsonSerializer.Serialize(report, new JsonSerializerOptions { WriteIndented = true });
            await File.WriteAllTextAsync(reportPath, json);
            
            return reportPath;
        }
        
        private void Log(string message)
        {
            _logger.LogInfo(message);
            LogAdded?.Invoke(this, message);
        }
        
        #endregion
    }
    
    /// <summary>
    /// Resultado dos pré-checks
    /// </summary>
    public class PreCheckResult
    {
        public bool CanProceed { get; set; }
        public bool IsAdmin { get; set; }
        public bool IsOnBattery { get; set; }
        public int BatteryPercent { get; set; }
        public double FreeSpaceGB { get; set; }
        public List<string> InstallerProcesses { get; set; } = new();
        public List<string> Errors { get; set; } = new();
        public List<string> Warnings { get; set; } = new();
    }
}

