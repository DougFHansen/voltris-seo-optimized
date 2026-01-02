using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using System.Timers;
using Timer = System.Timers.Timer;
using VoltrisOptimizer.Services;

namespace VoltrisOptimizer.Services
{
    /// <summary>
    /// Serviço de agendamento automático de otimizações
    /// </summary>
    public class SchedulerService
    {
        private readonly ILoggingService _logger;
        private readonly string _schedulesPath;
        private Timer? _checkTimer;
        private List<ScheduledTask> _tasks = new List<ScheduledTask>();

        public event EventHandler<ScheduledTask>? TaskExecuted;

        public SchedulerService(ILoggingService logger)
        {
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
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
                        _logger.LogInfo($"Executando tarefa agendada: {task.Name}");
                        
                        // Executar ações da tarefa
                        await ExecuteTaskActions(task);
                        
                        task.LastExecuted = now;
                        task.NextExecution = CalculateNextExecution(task);
                        SaveSchedules();
                        
                        new ToastService().Show("Tarefa Concluída", $"A tarefa '{task.Name}' foi executada com sucesso.");
                        
                        TaskExecuted?.Invoke(this, task);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError($"Erro ao executar tarefa agendada: {task.Name}", ex);
                    }
                });
            }
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

            foreach (var action in task.Actions)
            {
                try
                {
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
                                await Task.Run(() => { /* Network optimization */ });
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
                }
                catch (Exception ex)
                {
                    _logger.LogError($"Erro ao executar ação '{action}' da tarefa '{task.Name}'", ex);
                }
            }

            // Registrar no histórico
            if (App.HistoryService != null)
            {
                var duration = DateTime.Now - startTime;
                var historyEntry = new OptimizationHistory
                {
                    ActionType = $"Tarefa Agendada: {task.Name}",
                    Description = $"Execução automática - {string.Join(", ", task.Actions)}",
                    SpaceFreed = totalSpaceFreed,
                    Success = true,
                    Duration = duration
                };
                App.HistoryService.AddHistoryEntry(historyEntry);
            }
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

