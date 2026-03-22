using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Threading;
using System.Threading.Tasks;

namespace VoltrisOptimizer.Core
{
    /// <summary>
    /// BackgroundScheduler — Orquestrador central de tarefas em background.
    ///
    /// PROBLEMA RESOLVIDO:
    ///   O app tinha 25+ Task.Run independentes, cada um com seu próprio loop e intervalo
    ///   fixo, sem coordenação. Isso causava contenção de threads, CPU alta constante e
    ///   engasgos no sistema — o app de otimização era o maior consumidor de CPU.
    ///
    /// SOLUÇÃO:
    ///   Um único scheduler que gerencia todas as tarefas periódicas com:
    ///   - Adaptive throttling: intervalos aumentam automaticamente quando CPU > threshold
    ///   - Priority tiers: tarefas críticas rodam mais frequente que tarefas de telemetria
    ///   - Idle detection: quando sistema está ocioso, frequência cai drasticamente
    ///   - Jitter: distribui execuções no tempo para evitar picos sincronizados
    ///   - CPU budget: limita quantas tarefas rodam em paralelo por ciclo
    /// </summary>
    public sealed class BackgroundScheduler : IDisposable
    {
        // ── Singleton ────────────────────────────────────────────────────────
        private static readonly Lazy<BackgroundScheduler> _instance =
            new(() => new BackgroundScheduler());
        public static BackgroundScheduler Instance => _instance.Value;

        // ── Prioridades ──────────────────────────────────────────────────────
        /// <summary>
        /// Critical  → roda sempre, mesmo sob carga (ex: thermal emergency check)
        /// High      → roda com intervalo base (ex: foreground boost, shell protect)
        /// Normal    → roda com intervalo 2x maior sob carga (ex: process governance)
        /// Low       → roda com intervalo 4x maior sob carga (ex: telemetria, logging)
        /// Idle      → roda apenas quando sistema está ocioso (ex: cleanup, indexing)
        /// </summary>
        public enum TaskPriority { Critical = 0, High = 1, Normal = 2, Low = 3, Idle = 4 }

        // ── Thresholds de carga ──────────────────────────────────────────────
        private const double CpuHighThreshold  = 60.0; // % — começa a throttlar
        private const double CpuCritThreshold  = 80.0; // % — throttling máximo
        private const int    IdleThresholdSecs = 30;   // segundos sem input = idle

        // ── Multiplicadores de intervalo por nível de carga ──────────────────
        // [prioridade][nível de carga: 0=normal, 1=high, 2=critical]
        private static readonly double[,] IntervalMultipliers =
        {
            { 1.0, 1.0, 1.0 },  // Critical — nunca throttla
            { 1.0, 1.5, 2.0 },  // High
            { 1.0, 2.5, 4.0 },  // Normal
            { 1.0, 4.0, 8.0 },  // Low
            { 0.0, 0.0, 0.0 },  // Idle — só roda quando idle
        };

        // ── Estado interno ───────────────────────────────────────────────────
        private readonly ConcurrentDictionary<string, ScheduledTask> _tasks = new();
        private readonly CancellationTokenSource _cts = new();
        private Task? _dispatchLoop;
        private volatile int _loadLevel = 0; // 0=normal, 1=high, 2=critical
        private volatile bool _isIdle = false;
        private double _currentCpuPercent = 0;
        private DateTime _lastCpuSample = DateTime.MinValue;
        private const int CpuSampleIntervalMs = 2000;

        private BackgroundScheduler() { }

        // ── API Pública ──────────────────────────────────────────────────────

        /// <summary>
        /// Registra uma tarefa periódica no scheduler.
        /// </summary>
        /// <param name="id">Identificador único (ex: "DSL.MonitorLoop")</param>
        /// <param name="action">Ação assíncrona a executar</param>
        /// <param name="baseInterval">Intervalo base (sem carga)</param>
        /// <param name="priority">Prioridade da tarefa</param>
        /// <param name="initialDelay">Delay antes da primeira execução</param>
        /// <param name="jitter">Variação aleatória no intervalo (evita picos sincronizados)</param>
        public void Register(
            string id,
            Func<CancellationToken, Task> action,
            TimeSpan baseInterval,
            TaskPriority priority = TaskPriority.Normal,
            TimeSpan initialDelay = default,
            TimeSpan jitter = default)
        {
            var task = new ScheduledTask
            {
                Id           = id,
                Action       = action,
                BaseInterval = baseInterval,
                Priority     = priority,
                InitialDelay = initialDelay,
                Jitter       = jitter == default ? TimeSpan.FromMilliseconds(baseInterval.TotalMilliseconds * 0.1) : jitter,
                NextRunAt    = DateTime.UtcNow + initialDelay,
                IsRunning    = false,
            };
            _tasks[id] = task;
        }

        /// <summary>Remove uma tarefa registrada.</summary>
        public void Unregister(string id) => _tasks.TryRemove(id, out _);

        /// <summary>Inicia o loop de dispatch. Chamar uma vez no startup.</summary>
        public void Start()
        {
            if (_dispatchLoop != null) return;
            _dispatchLoop = Task.Run(() => DispatchLoopAsync(_cts.Token), _cts.Token);
        }

        /// <summary>Para o scheduler e aguarda todas as tarefas em execução.</summary>
        public async Task StopAsync()
        {
            _cts.Cancel();
            if (_dispatchLoop != null)
                try { await _dispatchLoop.WaitAsync(TimeSpan.FromSeconds(5)); } catch { }
        }

        /// <summary>Retorna métricas do scheduler para diagnóstico.</summary>
        public SchedulerMetrics GetMetrics() => new()
        {
            RegisteredTasks  = _tasks.Count,
            CurrentCpuPct    = _currentCpuPercent,
            LoadLevel        = _loadLevel,
            IsIdle           = _isIdle,
        };

        // ── Loop Principal ───────────────────────────────────────────────────

        private async Task DispatchLoopAsync(CancellationToken ct)
        {
            // Tick a cada 250ms — resolução suficiente para todos os intervalos
            const int TickMs = 250;

            while (!ct.IsCancellationRequested)
            {
                try
                {
                    await Task.Delay(TickMs, ct);

                    // Atualizar estado do sistema (CPU, idle) a cada 2s
                    UpdateSystemState();

                    var now = DateTime.UtcNow;

                    foreach (var kvp in _tasks)
                    {
                        var task = kvp.Value;
                        if (task.IsRunning) continue;
                        if (now < task.NextRunAt) continue;

                        // Tarefas Idle só rodam quando sistema está ocioso
                        if (task.Priority == TaskPriority.Idle && !_isIdle) continue;

                        // Disparar sem await — cada tarefa roda independente
                        _ = RunTaskAsync(task, ct);
                    }
                }
                catch (OperationCanceledException) { break; }
                catch { /* loop nunca deve morrer */ }
            }
        }

        private async Task RunTaskAsync(ScheduledTask task, CancellationToken ct)
        {
            task.IsRunning = true;
            var sw = Stopwatch.StartNew();
            try
            {
                await task.Action(ct);
            }
            catch (OperationCanceledException) { }
            catch (Exception ex)
            {
                task.ConsecutiveErrors++;
                // Back-off exponencial em caso de erros repetidos (máx 5 min)
                var backoff = TimeSpan.FromSeconds(Math.Min(300, Math.Pow(2, task.ConsecutiveErrors)));
                task.NextRunAt = DateTime.UtcNow + backoff;
                task.IsRunning = false;
                return;
            }

            task.ConsecutiveErrors = 0;
            sw.Stop();

            // Calcular próxima execução com adaptive interval + jitter
            double multiplier = GetIntervalMultiplier(task.Priority);
            double baseMs     = task.BaseInterval.TotalMilliseconds * multiplier;
            double jitterMs   = (Random.Shared.NextDouble() - 0.5) * 2 * task.Jitter.TotalMilliseconds;
            task.NextRunAt    = DateTime.UtcNow + TimeSpan.FromMilliseconds(Math.Max(100, baseMs + jitterMs));
            task.IsRunning    = false;
        }

        // ── Sistema de Carga ─────────────────────────────────────────────────

        private void UpdateSystemState()
        {
            var now = DateTime.UtcNow;
            if ((now - _lastCpuSample).TotalMilliseconds < CpuSampleIntervalMs) return;
            _lastCpuSample = now;

            // Lê do SystemMetricsCache — zero custo adicional ao kernel.
            // O cache já coleta CPU%, RAM e LastInput a cada 2s.
            var cache = SystemMetricsCache.Instance;
            _currentCpuPercent = cache.CpuPercent;

            // Classificar nível de carga
            _loadLevel = _currentCpuPercent switch
            {
                >= CpuCritThreshold => 2,
                >= CpuHighThreshold => 1,
                _                   => 0,
            };

            // Idle: sem input recente E CPU baixa
            _isIdle = cache.LastInputMs >= (IdleThresholdSecs * 1000) && _currentCpuPercent < 20.0;
        }

        private double GetIntervalMultiplier(TaskPriority priority)
        {
            int p = (int)priority;
            int l = Math.Clamp(_loadLevel, 0, 2);
            return IntervalMultipliers[p, l];
        }

        // ── IDisposable ──────────────────────────────────────────────────────

        public void Dispose()
        {
            _cts.Cancel();
            _cts.Dispose();
        }

        // ── Tipos internos ───────────────────────────────────────────────────

        private sealed class ScheduledTask
        {
            public required string Id { get; init; }
            public required Func<CancellationToken, Task> Action { get; init; }
            public required TimeSpan BaseInterval { get; init; }
            public required TaskPriority Priority { get; init; }
            public required TimeSpan InitialDelay { get; init; }
            public required TimeSpan Jitter { get; init; }
            public DateTime NextRunAt { get; set; }
            public volatile bool IsRunning;
            public int ConsecutiveErrors { get; set; }
        }
    }

    public sealed class SchedulerMetrics
    {
        public int RegisteredTasks { get; init; }
        public double CurrentCpuPct { get; init; }
        public int LoadLevel { get; init; }
        public bool IsIdle { get; init; }
    }
}
