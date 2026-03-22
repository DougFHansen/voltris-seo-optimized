using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using System.Timers;
using Timer = System.Timers.Timer;
using System.Runtime.InteropServices;
using VoltrisOptimizer.Services.Gamer.Interfaces;
using VoltrisOptimizer.Services;
using VoltrisOptimizer.Core;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Serviço de agendamento automático de otimizações
    /// </summary>
    public class SchedulerService
    {
        private readonly ILoggingService _logger;
        private readonly HistoryService _historyService;
        private readonly IGamerModeOrchestrator? _gamerOrchestrator;
        private readonly string _schedulesPath;
        private Timer? _checkTimer;
        private List<ScheduledTask> _tasks = new List<ScheduledTask>();

        [StructLayout(LayoutKind.Sequential)]
        struct LASTINPUTINFO
        {
            public uint cbSize;
            public uint dwTime;
        }

        [DllImport("user32.dll")]
        static extern bool GetLastInputInfo(ref LASTINPUTINFO plii);

        public event EventHandler<ScheduledTask>? TaskExecuted;

        public SchedulerService(ILoggingService logger, HistoryService historyService, IGamerModeOrchestrator? gamerOrchestrator = null)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
            _historyService = historyService ?? throw new ArgumentNullException(nameof(historyService));
            _gamerOrchestrator = gamerOrchestrator;
            _schedulesPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "schedules.json");
            LoadSchedules();
            StartScheduler();
        }

        public void AddTask(ScheduledTask task)
        {
            _tasks.Add(task);
            SaveSchedules();
            _logger.LogInfo($"Tarefa agendada: {task.Name} - {task.ScheduleType}");
        }

        public void RemoveTask(string taskId)
        {
            var task = _tasks.FirstOrDefault(t => t.Id == taskId);
            if (task != null)
            {
                _tasks.Remove(task);
                SaveSchedules();
                _logger.LogInfo($"Tarefa removida: {task.Name}");
            }
        }

        public List<ScheduledTask> GetTasks()
        {
            return _tasks.ToList();
        }

        private void StartScheduler()
        {
            _checkTimer = new Timer(60000); // Verificar a cada minuto
            _checkTimer.Elapsed += CheckScheduledTasks;
            _checkTimer.AutoReset = true;
            _checkTimer.Start();
        }

        private void CheckScheduledTasks(object? sender, ElapsedEventArgs e)
        {
            var now = DateTime.Now;
            var tasksToExecute = _tasks.Where(t => t.IsEnabled && ShouldExecute(t, now)).ToList();

            foreach (var task in tasksToExecute)
            {
                Task.Run(async () =>
                {
                    try
                    {
                        // VERIFICAÇÃO DE CONTEXTO (INTELIGÊNCIA)
                        if (!await IsSafeToExecuteAsync(task))
                        {
                            return; // Log já feito dentro do IsSafeToExecuteAsync
                        }

                        _logger.Log(LogLevel.Info, LogCategory.Scheduler, $"Executando tarefa agendada: {task.Name}");
                        
                        // Executar ações da tarefa
                        await ExecuteTaskActions(task);
                        
                        task.LastExecuted = now;
                        task.NextExecution = CalculateNextExecution(task);
                        SaveSchedules();
                        
                        try {
                            new ToastService().Show("Tarefa Concluída", $"A tarefa '{task.Name}' foi executada com sucesso.");
                        } catch {}
                        
                        TaskExecuted?.Invoke(this, task);
                    }
                    catch (Exception ex)
                    {
                        _logger.Log(LogLevel.Error, LogCategory.Scheduler, $"Erro ao executar tarefa agendada: {task.Name}", ex);
                    }
                });
            }
        }

        private async Task<bool> IsSafeToExecuteAsync(ScheduledTask task)
        {
            // ✅ CORREÇÃO CRÍTICA #3: Verificar Perfil Inteligente PRIMEIRO
            var intelligentProfile = SettingsService.Instance.Settings.IntelligentProfile;
            _logger.Log(LogLevel.AI_DECISION, LogCategory.Scheduler, 
                $"🧠 Verificando segurança para tarefa '{task.Name}' com Perfil Inteligente: {intelligentProfile}");
            
            // ✅ BLOQUEIO TOTAL: EnterpriseSecure não permite tarefas automáticas
            if (intelligentProfile == IntelligentProfileType.EnterpriseSecure)
            {
                _logger.Log(LogLevel.AI_DECISION, LogCategory.Scheduler, 
                    $"⛔ Abortando tarefa '{task.Name}': Perfil EnterpriseSecure não permite automação (prioriza estabilidade e previsibilidade).");
                return false;
            }
            
            // 1. Se o Modo Gamer estiver ativo, abortar qualquer tarefa agendada (Prioridade total ao jogo)
            if (_gamerOrchestrator?.IsActive == true)
            {
                _logger.Log(LogLevel.AI_DECISION, LogCategory.Scheduler, $"Abortando execução da tarefa '{task.Name}': Sessão de Jogo Ativa detectada.");
                return false;
            }

            // 2. Verificar carga de CPU - threshold baseado no perfil
            double cpuUsage = await SystemInfoService.GetCPUUsagePercentAsync();
            double cpuThreshold = intelligentProfile switch
            {
                IntelligentProfileType.WorkOffice => 20.0,              // Muito conservador
                IntelligentProfileType.GamerCompetitive => 30.0,        // Moderado
                IntelligentProfileType.GamerSinglePlayer => 30.0,
                IntelligentProfileType.CreativeVideoEditing => 25.0,    // Conservador (renderização)
                IntelligentProfileType.DeveloperProgramming => 25.0,    // Conservador (compilação)
                IntelligentProfileType.GeneralBalanced => 35.0,
                _ => 40.0
            };
            
            if (cpuUsage > cpuThreshold)
            {
                _logger.Log(LogLevel.AI_DECISION, LogCategory.Scheduler, 
                    $"Postergando tarefa '{task.Name}': CPU {cpuUsage:F0}% > {cpuThreshold}% (limite para perfil {intelligentProfile}).");
                return false;
            }

            // 3. Verificar atividade do usuário (Idle check) - baseado no perfil
            var idleTime = GetIdleTime();
            double idleMinutesRequired = intelligentProfile switch
            {
                IntelligentProfileType.EnterpriseSecure => 30.0,        // 30 minutos (nunca chega aqui, mas por segurança)
                IntelligentProfileType.WorkOffice => 15.0,              // 15 minutos
                IntelligentProfileType.GamerCompetitive => 10.0,        // 10 minutos
                IntelligentProfileType.GamerSinglePlayer => 10.0,
                IntelligentProfileType.CreativeVideoEditing => 12.0,    // 12 minutos
                IntelligentProfileType.DeveloperProgramming => 12.0,
                IntelligentProfileType.GeneralBalanced => 8.0,          // 8 minutos
                _ => 5.0
            };
            
            if (idleTime.TotalMinutes < idleMinutesRequired)
            {
                 _logger.Log(LogLevel.AI_DECISION, LogCategory.Scheduler, 
                     $"Postergando tarefa '{task.Name}': Idle {idleTime.TotalMinutes:F1}min < {idleMinutesRequired}min (requisito para perfil {intelligentProfile}).");
                 return false;
            }

            // 4. Verificar estado de energia (Notebook)
            if (IsOnBattery())
            {
                _logger.Log(LogLevel.AI_DECISION, LogCategory.Scheduler, $"Postergando tarefa '{task.Name}': Notebook operando em bateria.");
                return false;
            }

            _logger.Log(LogLevel.Success, LogCategory.Scheduler, 
                $"✅ Tarefa '{task.Name}' aprovada para execução (Perfil: {intelligentProfile}, CPU: {cpuUsage:F1}%, Idle: {idleTime.TotalMinutes:F1}min)");
            return true;
        }

        private TimeSpan GetIdleTime()
        {
            var lii = new LASTINPUTINFO();
            lii.cbSize = (uint)Marshal.SizeOf(lii);
            if (GetLastInputInfo(ref lii))
            {
                uint lastInputTick = lii.dwTime;
                uint currentTick = (uint)Environment.TickCount;
                return TimeSpan.FromMilliseconds(currentTick - lastInputTick);
            }
            return TimeSpan.Zero;
        }

        private bool IsOnBattery()
        {
            try
            {
                using var searcher = new System.Management.ManagementObjectSearcher("SELECT BatteryStatus FROM Win32_Battery");
                foreach (System.Management.ManagementObject obj in searcher.Get())
                {
                    var status = Convert.ToInt32(obj["BatteryStatus"]);
                    return status == 1 || status == 2; // 1 = Discharging, 2 = Unknown (sometimes battery)
                }
            }
            catch {}
            return false;
        }

        private bool ShouldExecute(ScheduledTask task, DateTime now)
        {
            if (task.NextExecution == null)
            {
                task.NextExecution = CalculateNextExecution(task);
                return false;
            }

            return now >= task.NextExecution.Value;
        }

        private async Task ExecuteTaskActions(ScheduledTask task)
        {
            var startTime = DateTime.Now;
            long totalSpaceFreed = 0;
            var actionsExecuted = new List<string>();

            foreach (var action in task.Actions)
            {
                try
                {
                    _logger.Log(LogLevel.Info, LogCategory.Scheduler, $"Iniciando ação agendada: {action}");
                    
                    switch (action.ToLower())
                    {
                        case "limpeza":
                            if (App.SystemCleaner != null)
                            {
                                totalSpaceFreed += await App.SystemCleaner.CleanTempFilesAsync();
                                await App.SystemCleaner.EmptyRecycleBinAsync();
                                await App.SystemCleaner.CleanBrowserCacheAsync();
                            }
                            break;
                        case "limpeza_inteligente":
                            var cleanupEngine = ServiceLocator.GetService<IntelligentCleanupEngine>();
                            if (cleanupEngine != null)
                            {
                                totalSpaceFreed += await cleanupEngine.RunIntelligentCleanupAsync();
                            }
                            break;
                        case "desempenho":
                            if (App.PerformanceOptimizer != null)
                            {
                                await App.PerformanceOptimizer.SetHighPerformancePlanAsync();
                                await App.PerformanceOptimizer.OptimizeStartupAsync();
                            }
                            if (App.AdvancedOptimizer != null)
                            {
                                await App.AdvancedOptimizer.OptimizeMemoryAsync();
                            }
                            break;
                        case "rede":
                            if (App.NetworkOptimizer != null)
                            {
                                // NetworkOptimizer não tem método async, usar Task.Run se necessário
                                await Task.Run(() => { /* Network optimization logic should be here */ });
                            }
                            break;
                        case "avançado":
                            if (App.AdvancedOptimizer != null)
                            {
                                await App.AdvancedOptimizer.OptimizeProcessesAsync();
                                await App.AdvancedOptimizer.CleanRegistryAsync();
                            }
                            break;
                    }
                    actionsExecuted.Add(action);
                }
                catch (Exception ex)
                {
                    _logger.Log(LogLevel.Error, LogCategory.Scheduler, $"Falha na ação {action}: {ex.Message}", ex);
                }
            }

            // Registrar no histórico profissional
            var duration = DateTime.Now - startTime;
            var intelligentProfile = SettingsService.Instance.Settings.IntelligentProfile;
            
            _historyService.AddHistoryEntry(new OptimizationHistory
            {
                ActionType = "Scheduled Automation",
                Description = $"Tarefa '{task.Name}' executada automaticamente.",
                SpaceFreed = totalSpaceFreed,
                Success = actionsExecuted.Count > 0,
                Duration = duration,
                Timestamp = DateTime.Now,
                Details = new Dictionary<string, object> {
                    { "TaskID", task.Id },
                    { "Actions", string.Join(", ", actionsExecuted) },
                    { "Trigger", task.ScheduleType.ToString() },
                    { "IntelligentProfile", intelligentProfile.ToString() }
                }
            });
            
            _logger.Log(LogLevel.Success, LogCategory.Scheduler, $"Tarefa '{task.Name}' concluída em {duration.TotalSeconds:F1}s. Recursos liberados: {totalSpaceFreed / 1024.0 / 1024.0:F2} MB.");
        }

        private DateTime? CalculateNextExecution(ScheduledTask task)
        {
            var now = DateTime.Now;
            
            return task.ScheduleType switch
            {
                ScheduleType.Daily => task.ScheduledTime.HasValue 
                    ? now.Date.Add(task.ScheduledTime.Value.TimeOfDay).AddDays(now.TimeOfDay >= task.ScheduledTime.Value.TimeOfDay ? 1 : 0)
                    : now.AddDays(1),
                ScheduleType.Weekly => now.AddDays(7),
                ScheduleType.Monthly => now.AddMonths(1),
                ScheduleType.OnStartup => null,
                _ => null
            };
        }

        private void LoadSchedules()
        {
            try
            {
                if (File.Exists(_schedulesPath))
                {
                    var json = File.ReadAllText(_schedulesPath);
                    _tasks = JsonSerializer.Deserialize<List<ScheduledTask>>(json) ?? new List<ScheduledTask>();
                    
                    // Recalcular próximas execuções
                    foreach (var task in _tasks.Where(t => t.IsEnabled))
                    {
                        task.NextExecution = CalculateNextExecution(task);
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Erro ao carregar agendamentos", ex);
                _tasks = new List<ScheduledTask>();
            }
        }

        private void SaveSchedules()
        {
            try
            {
                var json = JsonSerializer.Serialize(_tasks, new JsonSerializerOptions { WriteIndented = true });
                File.WriteAllText(_schedulesPath, json);
            }
            catch (Exception ex)
            {
                _logger.LogError("Erro ao salvar agendamentos", ex);
            }
        }

        public void Dispose()
        {
            _checkTimer?.Stop();
            _checkTimer?.Dispose();
        }
    }

    public class ScheduledTask
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public string Name { get; set; } = "";
        public ScheduleType ScheduleType { get; set; }
        public DateTime? ScheduledTime { get; set; }
        public List<string> Actions { get; set; } = new List<string>();
        public bool IsEnabled { get; set; } = true;
        public DateTime? LastExecuted { get; set; }
        public DateTime? NextExecution { get; set; }
    }

    public enum ScheduleType
    {
        Daily,
        Weekly,
        Monthly,
        OnStartup
    }
}

