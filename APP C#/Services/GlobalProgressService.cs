using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using System.Windows;

namespace VoltrisOptimizer.Services
{
    // ══════════════════════════════════════════════════════════════════════════
    // GlobalProgressService — Enterprise Queue-Based Progress Manager
    // ══════════════════════════════════════════════════════════════════════════
    //
    // ARQUITETURA:
    //   Cada operação recebe um OperationToken único ao chamar StartOperation().
    //   Todas as operações ficam em uma fila concorrente ordenada por StartTime.
    //   A barra SEMPRE exibe a operação mais antiga ainda ativa (FIFO display).
    //   Quando uma operação termina (CompleteOperation no token), a barra
    //   restaura automaticamente a próxima operação mais antiga ainda em curso.
    //   Não há mais bloqueio — todas as operações coexistem na fila.
    //
    // CONTRATO DO CALLER:
    //   var token = GlobalProgressService.Instance.StartOperation("Nome");
    //   token.UpdateProgress(50, "Fazendo algo...");
    //   token.Complete("✅ Concluído!");
    //   // OU via métodos estáticos de compatibilidade (legado):
    //   GlobalProgressService.Instance.StartOperation("Nome", isPriority: true);
    //   GlobalProgressService.Instance.UpdateProgress(50, "msg");
    //   GlobalProgressService.Instance.CompleteOperation("✅ Concluído!");
    //
    // THREAD SAFETY: Todas as operações são thread-safe via ConcurrentDictionary + lock.
    // ══════════════════════════════════════════════════════════════════════════

    public class GlobalProgressService
    {
        // ── Singleton ────────────────────────────────────────────────────────
        private static GlobalProgressService? _instance;
        private static readonly object _singletonLock = new object();

        public static GlobalProgressService Instance
        {
            get
            {
                if (_instance == null)
                {
                    lock (_singletonLock)
                    {
                        _instance ??= new GlobalProgressService();
                    }
                }
                return _instance;
            }
        }

        // ── Eventos públicos (UI se inscreve aqui) ───────────────────────────
        public event EventHandler<ProgressEventArgs>? ProgressChanged;
        public event EventHandler<string>?            StatusChanged;
        public event EventHandler?                    OperationCompleted;

        // ── Estado interno ───────────────────────────────────────────────────
        // Dicionário de operações ativas: id → contexto
        private readonly ConcurrentDictionary<Guid, OperationContext> _active
            = new ConcurrentDictionary<Guid, OperationContext>();

        // Lock para serializar decisões de "qual operação exibir"
        private readonly object _displayLock = new object();

        // ID da operação atualmente exibida na barra
        private Guid _displayedId = Guid.Empty;

        // Logger (resolvido lazy para não quebrar se App ainda não inicializou)
        private ILoggingService? Logger => _logger ??= TryGetLogger();
        private ILoggingService? _logger;
        private static ILoggingService? TryGetLogger()
        {
            try { return App.LoggingService; } catch { return null; }
        }

        // ── Compatibilidade legado: token implícito por contexto assíncrono ──────
        // AsyncLocal propaga o valor para tasks filhas, garantindo que UpdateProgress
        // e CompleteOperation (sem token) encontrem o token correto mesmo após awaits.
        private readonly AsyncLocal<OperationToken?> _legacyToken = new AsyncLocal<OperationToken?>();

        // Stack legada por contexto: suporta StartOperation aninhado no mesmo fluxo async
        private readonly AsyncLocal<Stack<OperationToken>?> _legacyStack = new AsyncLocal<Stack<OperationToken>?>();

        private GlobalProgressService() { }

        // ════════════════════════════════════════════════════════════════════
        // API PRINCIPAL — Token-based (recomendada)
        // ════════════════════════════════════════════════════════════════════

        /// <summary>
        /// Inicia uma nova operação e retorna um token para controlá-la.
        /// Sempre aceita — não bloqueia mais nenhuma operação.
        /// O token deve ser usado para UpdateProgress e Complete.
        /// </summary>
        public OperationToken BeginOperation(string operationName, bool isPriority = false)
        {
            // Limpar operações órfãs (ativas há mais de 10 minutos) antes de iniciar nova operação prioritária
            if (isPriority)
            {
                PurgeStaleOperations(TimeSpan.FromMinutes(10));
            }

            var ctx = new OperationContext
            {
                Id          = Guid.NewGuid(),
                Name        = operationName,
                StartTime   = DateTime.UtcNow,
                IsPriority  = isPriority,
                Progress    = 0,
                Message     = $"Iniciando: {operationName}",
                IsCompleted = false
            };

            _active[ctx.Id] = ctx;

            Logger?.LogInfo(
                $"[GlobalProgress] ▶ BeginOperation '{operationName}' " +
                $"id={ctx.Id:N} isPriority={isPriority} " +
                $"(ativas={_active.Count})");

            // Decidir se esta operação deve ser exibida agora
            RefreshDisplay(ctx.Id, forceIfOldest: true);

            var token = new OperationToken(ctx.Id, this, operationName);
            return token;
        }

        // ════════════════════════════════════════════════════════════════════
        // API LEGADA — compatibilidade com todos os callers existentes
        // Internamente cria/usa tokens, mas mantém a assinatura antiga.
        // ════════════════════════════════════════════════════════════════════

        /// <summary>
        /// [LEGADO] Inicia operação. Retorna true sempre (não bloqueia mais).
        /// Armazena o token na stack do contexto assíncrono atual.
        /// </summary>
        public bool StartOperation(string operationName, bool isPriority = false)
        {
            Logger?.LogInfo(
                $"[GlobalProgress] [LEGADO] StartOperation '{operationName}' isPriority={isPriority}");

            var token = BeginOperation(operationName, isPriority);

            // Empurrar na stack legada do contexto assíncrono atual
            if (_legacyStack.Value == null)
                _legacyStack.Value = new Stack<OperationToken>();
            _legacyStack.Value.Push(token);

            // Manter também o token simples para compatibilidade
            _legacyToken.Value = token;
            return true;
        }

        /// <summary>
        /// [LEGADO] Atualiza o progresso da operação no topo da stack deste contexto.
        /// </summary>
        public void UpdateProgress(int percentage, string? message = null)
        {
            var token = _legacyToken.Value
                     ?? (_legacyStack.Value != null && _legacyStack.Value.Count > 0
                         ? _legacyStack.Value.Peek()
                         : null);

            if (token == null)
            {
                Logger?.LogWarning(
                    $"[GlobalProgress] [LEGADO] UpdateProgress {percentage}% '{message}' " +
                    $"— sem token ativo no contexto, ignorado");
                return;
            }

            Logger?.LogDebug(
                $"[GlobalProgress] [LEGADO] UpdateProgress '{token.OperationName}' " +
                $"{percentage}% msg='{message}'");

            token.UpdateProgress(percentage, message);
        }

        /// <summary>
        /// [LEGADO] Finaliza a operação no topo da stack deste contexto assíncrono.
        /// </summary>
        public void CompleteOperation(string? finalMessage = null)
        {
            OperationToken? token = null;

            // Tentar pegar do topo da stack legada
            if (_legacyStack.Value?.Count > 0)
            {
                token = _legacyStack.Value.Pop();
            }
            else
            {
                token = _legacyToken.Value;
            }

            if (token == null)
            {
                Logger?.LogWarning(
                    $"[GlobalProgress] [LEGADO] CompleteOperation '{finalMessage}' " +
                    $"— sem token ativo no contexto, ignorado");
                return;
            }

            Logger?.LogInfo(
                $"[GlobalProgress] [LEGADO] CompleteOperation '{token.OperationName}' " +
                $"msg='{finalMessage}'");

            token.Complete(finalMessage);

            // Limpar referência simples se era o mesmo token
            if (_legacyToken.Value == token)
                _legacyToken.Value = null;
        }

        // ════════════════════════════════════════════════════════════════════
        // MÉTODOS INTERNOS — chamados pelo OperationToken
        // ════════════════════════════════════════════════════════════════════

        internal void InternalUpdate(Guid id, int percentage, string? message)
        {
            if (!_active.TryGetValue(id, out var ctx)) return;

            ctx.Progress = Math.Max(0, Math.Min(100, percentage));
            if (message != null) ctx.Message = message;

            Logger?.LogDebug(
                $"[GlobalProgress] ↑ Update '{ctx.Name}' {ctx.Progress}% '{ctx.Message}' " +
                $"(displayed={_displayedId == id})");

            // Só atualiza a barra se esta for a operação exibida atualmente
            if (_displayedId == id)
            {
                FireProgress(ctx.Progress, ctx.Message);
            }
        }

        internal void InternalComplete(Guid id, string? finalMessage)
        {
            if (!_active.TryGetValue(id, out var ctx)) return;

            ctx.IsCompleted = true;
            ctx.Progress    = 100;
            if (finalMessage != null) ctx.Message = finalMessage;

            Logger?.LogInfo(
                $"[GlobalProgress] ✔ Complete '{ctx.Name}' msg='{finalMessage}' " +
                $"(ativas antes={_active.Count})");

            // Mostrar 100% + mensagem final se esta era a exibida OU se era prioritária
            bool wasDisplayed = _displayedId == id;
            if (wasDisplayed || ctx.IsPriority)
            {
                FireProgress(100, finalMessage ?? $"✅ {ctx.Name} concluído");
            }

            // Remover da fila ativa
            _active.TryRemove(id, out _);

            Logger?.LogInfo(
                $"[GlobalProgress] ✔ '{ctx.Name}' removida (ativas restantes={_active.Count})");

            // Após 2s, restaurar a próxima operação mais antiga (ou limpar barra)
            // wasDisplayed é true se esta era a exibida OU se era prioritária (pois assumiu o display)
            bool shouldRestore = wasDisplayed || ctx.IsPriority;
            Application.Current?.Dispatcher.InvokeAsync(async () =>
            {
                try
                {
                    await Task.Delay(2000);
                    RestoreOldestOrClear(shouldRestore, ctx.Name);
                }
                catch
                {
                    try { FireProgress(0, string.Empty); } catch { }
                    try { OperationCompleted?.Invoke(this, EventArgs.Empty); } catch { }
                }
            }, System.Windows.Threading.DispatcherPriority.Normal);
        }

        // ════════════════════════════════════════════════════════════════════
        // LÓGICA DE DISPLAY — sempre exibe a operação mais antiga ativa
        // ════════════════════════════════════════════════════════════════════

        /// <summary>
        /// Decide qual operação exibir na barra.
        /// Regra: operações prioritárias assumem o display imediatamente.
        /// Para não-prioritárias: exibe a operação mais antiga ativa (FIFO).
        /// forceIfOldest=true: só exibe a nova operação se ela for a mais antiga.
        /// </summary>
        private void RefreshDisplay(Guid newId, bool forceIfOldest = false)
        {
            lock (_displayLock)
            {
                if (_active.IsEmpty)
                {
                    _displayedId = Guid.Empty;
                    return;
                }

                if (!_active.TryGetValue(newId, out var newCtx)) return;

                // PRIORIDADE: operações prioritárias assumem o display imediatamente,
                // independente de qualquer outra operação na fila.
                if (newCtx.IsPriority && !newCtx.IsCompleted)
                {
                    _displayedId = newId;
                    Logger?.LogInfo(
                        $"[GlobalProgress] 🚀 Display PRIORITÁRIO → '{newCtx.Name}' " +
                        $"(assumiu display imediatamente, {_active.Count} ativas)");
                    FireProgress(newCtx.Progress, newCtx.Message);
                    return;
                }

                // Encontrar a operação mais antiga ainda ativa
                var oldest = _active.Values
                    .Where(c => !c.IsCompleted)
                    .OrderBy(c => c.StartTime)
                    .FirstOrDefault();

                if (oldest == null) return;

                if (_displayedId == Guid.Empty)
                {
                    // Nenhuma operação exibida ainda — exibir a mais antiga
                    _displayedId = oldest.Id;
                    Logger?.LogInfo(
                        $"[GlobalProgress] 🖥 Display inicial → '{oldest.Name}' " +
                        $"(mais antiga, {_active.Count} ativas)");
                    FireProgress(oldest.Progress, oldest.Message);
                }
                else if (oldest.Id == newId && forceIfOldest)
                {
                    // A nova operação é a mais antiga (única na fila) — exibir
                    _displayedId = oldest.Id;
                    Logger?.LogInfo(
                        $"[GlobalProgress] 🖥 Display → '{oldest.Name}' " +
                        $"(única/mais antiga, {_active.Count} ativas)");
                    FireProgress(oldest.Progress, oldest.Message);
                }
                else
                {
                    // Há uma operação mais antiga sendo exibida — enfileirar silenciosamente
                    Logger?.LogInfo(
                        $"[GlobalProgress] 📋 '{newCtx.Name}' enfileirada " +
                        $"(exibindo '{GetDisplayedName()}', {_active.Count} ativas na fila)");
                }
            }
        }

        /// <summary>
        /// Após uma operação terminar, restaura a mais antiga restante ou limpa a barra.
        /// </summary>
        private void RestoreOldestOrClear(bool wasDisplayed, string completedName)
        {
            lock (_displayLock)
            {
                var remaining = _active.Values
                    .Where(c => !c.IsCompleted)
                    .OrderBy(c => c.StartTime)
                    .ToList();

                if (remaining.Count == 0)
                {
                    Logger?.LogInfo(
                        $"[GlobalProgress] 🧹 Fila vazia após '{completedName}' — limpando barra");
                    _displayedId = Guid.Empty;
                    FireProgress(0, string.Empty);
                    OperationCompleted?.Invoke(this, EventArgs.Empty);
                    return;
                }

                var oldest = remaining.First();

                // Preferir operação prioritária se houver alguma na fila
                var nextPriority = remaining.FirstOrDefault(c => c.IsPriority);
                var next = nextPriority ?? oldest;

                _displayedId = next.Id;

                Logger?.LogInfo(
                    $"[GlobalProgress] 🔄 Restaurando '{next.Name}' " +
                    $"{next.Progress}% após '{completedName}' " +
                    $"({remaining.Count} operações restantes na fila)");

                FireProgress(next.Progress, next.Message);
            }
        }

        // ════════════════════════════════════════════════════════════════════
        // UTILITÁRIOS PÚBLICOS
        // ════════════════════════════════════════════════════════════════════

        public bool IsOperationRunning => !_active.IsEmpty;

        public string CurrentOperation
        {
            get
            {
                if (_displayedId == Guid.Empty) return string.Empty;
                return _active.TryGetValue(_displayedId, out var ctx) ? ctx.Name : string.Empty;
            }
        }

        /// <summary>
        /// Retorna snapshot de todas as operações ativas (para debug/UI).
        /// </summary>
        public IReadOnlyList<ActiveOperationInfo> GetActiveOperations()
        {
            return _active.Values
                .Where(c => !c.IsCompleted)
                .OrderBy(c => c.StartTime)
                .Select(c => new ActiveOperationInfo(c.Name, c.Progress, c.Message, c.StartTime, c.IsPriority))
                .ToList();
        }

        /// <summary>
        /// Retorna quantas operações estão ativas.
        /// </summary>
        public int GetQueueCount() => _active.Count(kvp => !kvp.Value.IsCompleted);

        /// <summary>
        /// Cancela TODAS as operações e limpa a barra imediatamente.
        /// </summary>
        public void CancelOperation()
        {
            Logger?.LogWarning(
                $"[GlobalProgress] ⛔ CancelOperation — cancelando {_active.Count} operações");

            _active.Clear();
            _displayedId = Guid.Empty;

            Application.Current?.Dispatcher.Invoke(() =>
            {
                FireProgress(0, string.Empty);
                try { OperationCompleted?.Invoke(this, EventArgs.Empty); } catch { }
            });
        }

        /// <summary>Alias para CancelOperation (compatibilidade).</summary>
        public void ResetProgress() => CancelOperation();

        /// <summary>
        /// Remove operações órfãs que estão ativas há mais de X minutos sem atualização.
        /// Útil para limpar operações que nunca foram completadas (ex: onboarding abandonado).
        /// </summary>
        public void PurgeStaleOperations(TimeSpan maxAge)
        {
            var cutoff = DateTime.UtcNow - maxAge;
            var stale = _active.Values
                .Where(c => !c.IsCompleted && c.StartTime < cutoff)
                .ToList();

            foreach (var ctx in stale)
            {
                Logger?.LogWarning(
                    $"[GlobalProgress] 🗑 Removendo operação órfã '{ctx.Name}' " +
                    $"(ativa há {(DateTime.UtcNow - ctx.StartTime).TotalMinutes:F1}min)");
                _active.TryRemove(ctx.Id, out _);
                if (_displayedId == ctx.Id)
                    _displayedId = Guid.Empty;
            }

            if (stale.Count > 0)
            {
                // Restaurar próxima operação ou limpar barra
                var remaining = _active.Values.Where(c => !c.IsCompleted).OrderBy(c => c.StartTime).FirstOrDefault();
                if (remaining != null)
                {
                    _displayedId = remaining.Id;
                    FireProgress(remaining.Progress, remaining.Message);
                }
                else
                {
                    FireProgress(0, string.Empty);
                    try { OperationCompleted?.Invoke(this, EventArgs.Empty); } catch { }
                }
            }
        }

        // ════════════════════════════════════════════════════════════════════
        // HELPERS INTERNOS
        // ════════════════════════════════════════════════════════════════════

        private string GetDisplayedName()
        {
            if (_displayedId == Guid.Empty) return "(nenhuma)";
            return _active.TryGetValue(_displayedId, out var c) ? c.Name : "(removida)";
        }

        private void FireProgress(int percentage, string? message)
        {
            Application.Current?.Dispatcher.InvokeAsync(() =>
            {
                try
                {
                    ProgressChanged?.Invoke(this, new ProgressEventArgs(percentage));
                    if (message != null)
                        StatusChanged?.Invoke(this, message);
                }
                catch (Exception ex)
                {
                    Logger?.LogError("[GlobalProgress] Erro ao disparar evento de progresso", ex);
                }
            }, System.Windows.Threading.DispatcherPriority.Normal);
        }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // OperationToken — handle para controlar uma operação específica
    // ══════════════════════════════════════════════════════════════════════════

    /// <summary>
    /// Token retornado por BeginOperation. Permite atualizar e finalizar
    /// uma operação específica de forma thread-safe, independente de outras.
    /// Implementa IDisposable: usar em using() garante Complete automático.
    /// </summary>
    public sealed class OperationToken : IDisposable
    {
        private readonly Guid _id;
        private readonly GlobalProgressService _service;
        private int _completed = 0; // 0 = ativo, 1 = completo (Interlocked)

        public string OperationName { get; }
        public bool IsCompleted => _completed == 1;

        internal OperationToken(Guid id, GlobalProgressService service, string name)
        {
            _id           = id;
            _service      = service;
            OperationName = name;
        }

        /// <summary>Atualiza o progresso desta operação específica.</summary>
        public void UpdateProgress(int percentage, string? message = null)
        {
            if (_completed == 1) return;
            _service.InternalUpdate(_id, percentage, message);
        }

        /// <summary>Finaliza esta operação. Idempotente — pode ser chamado múltiplas vezes.</summary>
        public void Complete(string? finalMessage = null)
        {
            if (Interlocked.CompareExchange(ref _completed, 1, 0) == 0)
            {
                _service.InternalComplete(_id, finalMessage);
            }
        }

        /// <summary>Dispose chama Complete automaticamente se ainda não foi chamado.</summary>
        public void Dispose()
        {
            Complete();
        }
    }

    // ══════════════════════════════════════════════════════════════════════════
    // Modelos internos e públicos
    // ══════════════════════════════════════════════════════════════════════════

    internal class OperationContext
    {
        public Guid     Id          { get; set; }
        public string   Name        { get; set; } = string.Empty;
        public DateTime StartTime   { get; set; }
        public int      Progress    { get; set; }
        public string   Message     { get; set; } = string.Empty;
        public bool     IsPriority  { get; set; }
        public bool     IsCompleted { get; set; }
    }

    public class ProgressEventArgs : EventArgs
    {
        public int Percentage { get; }
        public ProgressEventArgs(int percentage)
        {
            Percentage = Math.Max(0, Math.Min(100, percentage));
        }
    }

    /// <summary>Snapshot de uma operação ativa para exibição/debug.</summary>
    public sealed class ActiveOperationInfo
    {
        public string   Name       { get; }
        public int      Progress   { get; }
        public string   Message    { get; }
        public DateTime StartTime  { get; }
        public bool     IsPriority { get; }
        public TimeSpan Elapsed    => DateTime.UtcNow - StartTime;

        public ActiveOperationInfo(string name, int progress, string message,
                                   DateTime startTime, bool isPriority)
        {
            Name       = name;
            Progress   = progress;
            Message    = message;
            StartTime  = startTime;
            IsPriority = isPriority;
        }

        public override string ToString() =>
            $"[{Name}] {Progress}% | {Message} | {Elapsed.TotalSeconds:F1}s";
    }
}
