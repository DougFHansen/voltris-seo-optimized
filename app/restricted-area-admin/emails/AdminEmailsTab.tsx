'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
    FiRefreshCw, FiSearch, FiSend, FiAlertTriangle, FiCheckCircle,
    FiClock, FiXCircle, FiInbox, FiExternalLink,
} from 'react-icons/fi';
import { MailWarning, RotateCw, ShieldAlert } from 'lucide-react';

/**
 * HISTÓRICO DE E-MAIL TRANSACIONAL (missão §13).
 *
 * Três decisões que valem explicar:
 *
 * 1. LÊ TUDO DE `/api/admin/emails`, NUNCA do cliente Supabase. A tabela
 *    `email_outbox` não tem policy para `authenticated` justamente porque
 *    guarda corpo de e-mail e endereço de outras pessoas. Ler do navegador
 *    exigiria afrouxar a RLS e expor o histórico para todo cliente logado.
 *
 * 2. DISTINGUE "aceito" de "entregue". O `sent` na fila significa que a
 *    Resend aceitou o envio. A entrega na caixa postal só é afirmada quando
 *    o webhook `email.delivered` chegou. A coluna mostra os dois estados
 *    porque o operador precisa saber a diferença na hora de atender um
 *    cliente que diz "não recebi".
 *
 * 3. O REENVIO é uma ação explícita e confirmada. Nunca é automático ao abrir
 *    a tela, e nunca repete para outro destinatário — o e-mail já tem um
 *    destinatário registrado e o reenvio usa exatamente esse.
 */

interface EmailRow {
    id: string;
    template_type: string;
    idempotency_key: string;
    recipient_email: string;
    subject: string;
    payment_id: string | null;
    license_key: string | null;
    subscription_id: string | null;
    attachment_name: string | null;
    status: 'pending' | 'processing' | 'sent' | 'failed' | 'canceled';
    provider_message_id: string | null;
    attempts: number;
    last_error: string | null;
    last_error_kind: string | null;
    delivery_status: string | null;
    delivery_flag: string | null;
    created_at: string;
    sent_at: string | null;
}

interface OutboxStats {
    pending: number;
    processing: number;
    sent: number;
    failed: number;
    canceled: number;
    oldestPendingMinutes: number | null;
    backlogWarning: boolean;
}

interface ResendConfig {
    configured: boolean;
    problems: string[];
}

/** Rótulo amigável por tipo de template. */
const TEMPLATE_LABELS: Record<string, string> = {
    purchase_confirmation: 'Compra confirmada',
    subscription_renewed: 'Renovação',
    renewal_canceled: 'Renovação cancelada',
    refund_requested: 'Reembolso solicitado',
    refund_processing: 'Reembolso em processamento',
    refund_confirmed: 'Reembolso confirmado',
    refund_failed: 'Reembolso falhou',
    payment_failed: 'Pagamento recusado',
};

const STATUS_STYLES: Record<string, { label: string; cls: string }> = {
    pending: { label: 'Na fila', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
    processing: { label: 'Enviando', cls: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
    sent: { label: 'Aceito', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
    failed: { label: 'Falhou', cls: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
    canceled: { label: 'Cancelado', cls: 'bg-slate-500/10 text-slate-400 border-slate-500/30' },
};

const DELIVERY_STYLES: Record<string, { label: string; cls: string }> = {
    sent: { label: 'Enviado', cls: 'text-slate-400' },
    delivered: { label: 'Entregue', cls: 'text-emerald-400' },
    delayed: { label: 'Atrasado', cls: 'text-amber-400' },
    opened: { label: 'Aberto', cls: 'text-indigo-400' },
    clicked: { label: 'Clicado', cls: 'text-violet-400' },
    bounced: { label: 'Devolvido', cls: 'text-rose-400' },
    complained: { label: 'Marcado como spam', cls: 'text-rose-400' },
};

const STATUS_FILTERS = [
    { value: 'all', label: 'Todos' },
    { value: 'pending', label: 'Na fila' },
    { value: 'sent', label: 'Aceitos' },
    { value: 'failed', label: 'Falhos' },
    { value: 'canceled', label: 'Cancelados' },
];

function formatDateTime(iso: string | null): string {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    } catch {
        return '—';
    }
}

export default function AdminEmailsTab() {
    const [rows, setRows] = useState<EmailRow[]>([]);
    const [stats, setStats] = useState<OutboxStats | null>(null);
    const [config, setConfig] = useState<ResendConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [status, setStatus] = useState('all');
    const [search, setSearch] = useState('');
    const [searchDebounced, setSearchDebounced] = useState('');
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [busyId, setBusyId] = useState<string | null>(null);
    const [draining, setDraining] = useState(false);

    const PAGE_SIZE = 25;

    useEffect(() => {
        const t = setTimeout(() => { setSearchDebounced(search.trim()); setPage(0); }, 350);
        return () => clearTimeout(t);
    }, [search]);

    const load = useCallback(async (opts?: { silent?: boolean }) => {
        if (!opts?.silent) setLoading(true);
        setError(null);
        try {
            const params = new URLSearchParams({ status, limit: String(PAGE_SIZE), offset: String(page * PAGE_SIZE) });
            if (searchDebounced) params.set('q', searchDebounced);

            const res = await fetch(`/api/admin/emails?${params}`, { cache: 'no-store' });
            const json = await res.json();

            if (res.status === 401) { window.location.href = '/login'; return; }
            if (!res.ok) {
                // ANTES isto era só um toast, que desaparece em segundos e
                // deixa a tabela vazia sem explicação. O administrador via
                // "nenhum e-mail" e não "a consulta falhou" — exatamente o
                // erro invisível que a Parte 13 descreve.
                setError(json?.error ?? 'Não foi possível carregar o histórico de e-mails.');
                toast.error(json?.error ?? 'Não foi possível carregar.');
                return;
            }

            setRows(json.items ?? []);
            setStats(json.stats ?? null);
            setConfig(json.config ?? null);
            setTotal(json.pagination?.total ?? 0);
        } catch {
            setError('Falha de rede ao consultar o histórico de e-mails. Verifique sua conexão.');
        } finally {
            setLoading(false);
        }
    }, [status, page, searchDebounced]);

    useEffect(() => { load(); }, [load]);

    const handleResend = useCallback(async (row: EmailRow) => {
        setBusyId(row.id);
        try {
            const res = await fetch('/api/admin/emails', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ outboxId: row.id }),
            });
            const json = await res.json();
            if (!res.ok) { toast.error(json?.error ?? 'Reenvio não aceito.'); return; }
            toast.success(json?.message ?? 'Reenvio enfileirado.');
            await load({ silent: true });
        } catch {
            toast.error('Falha de rede ao enfileirar o reenvio.');
        } finally {
            setBusyId(null);
        }
    }, [load]);

    const handleDrain = useCallback(async () => {
        setDraining(true);
        try {
            const res = await fetch('/api/email/outbox?limit=50', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            const json = await res.json();
            if (!res.ok) { toast.error(json?.error ?? 'Não foi possível processar a fila.'); return; }
            toast.success(
                `Fila processada: ${json.sent ?? 0} enviados, ${json.retried ?? 0} reagendados, ${json.failed ?? 0} falhas.`
            );
            await load({ silent: true });
        } catch {
            toast.error('Falha de rede ao processar a fila.');
        } finally {
            setDraining(false);
        }
    }, [load]);

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
        >
            {error && (
                <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4">
                    <ShieldAlert className="mt-0.5 shrink-0 text-rose-400" size={20} />
                    <div className="text-sm">
                        <p className="font-semibold text-rose-300">Não foi possível carregar o histórico</p>
                        <p className="mt-1 text-rose-200/80">{error}</p>
                        <button onClick={() => load()} className="mt-2 text-xs font-semibold text-rose-300 underline">
                            Tentar de novo
                        </button>
                    </div>
                </div>
            )}
            {/* ---------------- Alerta de configuração ---------------- */}
            {config && !config.configured && (
                <div className="flex items-start gap-3 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4">
                    <MailWarning className="mt-0.5 shrink-0 text-rose-400" size={20} />
                    <div className="text-sm">
                        <p className="font-semibold text-rose-300">E-mail transacional desativado</p>
                        <p className="mt-1 text-rose-200/80">
                            A Resend não está pronta para enviar. Nenhum e-mail sai até isso ser corrigido —
                            e nenhuma compra é perdida, porque elas ficam na fila.
                        </p>
                        <ul className="mt-2 list-inside list-disc text-xs text-rose-200/70">
                            {config.problems.map((p) => <li key={p}>{p}</li>)}
                        </ul>
                    </div>
                </div>
            )}

            {/* ---------------- Alerta de fila parada ---------------- */}
            {stats?.backlogWarning && (
                <div className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
                    <FiAlertTriangle className="mt-0.5 shrink-0 text-amber-400" size={20} />
                    <div className="text-sm text-amber-200">
                        <p className="font-semibold">Fila de e-mail parada há {stats.oldestPendingMinutes} minutos</p>
                        <p className="mt-1 text-amber-200/80">
                            Isso é acima do normal. Se o cron da Vercel estiver ativo, use
                            &ldquo;Processar fila agora&rdquo; para tentar de imediato.
                        </p>
                    </div>
                </div>
            )}

            {/* ---------------- Indicadores ---------------- */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                <StatCard label="Na fila" value={stats?.pending ?? 0} icon={FiClock} tone="text-amber-400" />
                <StatCard label="Enviando" value={stats?.processing ?? 0} icon={FiRefreshCw} tone="text-blue-400" />
                <StatCard label="Aceitos" value={stats?.sent ?? 0} icon={FiCheckCircle} tone="text-emerald-400" />
                <StatCard label="Falhos" value={stats?.failed ?? 0} icon={FiXCircle} tone="text-rose-400" />
                <StatCard label="Cancelados" value={stats?.canceled ?? 0} icon={FiInbox} tone="text-slate-400" />
            </div>

            {/* ---------------- Filtros ---------------- */}
            <div className="flex flex-col gap-3 rounded-xl border border-slate-700/60 bg-slate-900/60 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                    {STATUS_FILTERS.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => { setStatus(f.value); setPage(0); }}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                                status === f.value
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <div className="relative">
                        <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Destinatário, assunto ou chave…"
                            className="w-full rounded-lg border border-slate-700 bg-slate-800/80 py-2 pl-9 pr-3 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500 sm:w-72"
                        />
                    </div>
                    <button
                        onClick={handleDrain}
                        disabled={draining}
                        className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
                    >
                        <RotateCw size={14} className={draining ? 'animate-spin' : ''} />
                        {draining ? 'Processando…' : 'Processar fila agora'}
                    </button>
                    <button
                        onClick={() => load()}
                        disabled={loading}
                        className="flex items-center justify-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 disabled:opacity-50"
                    >
                        <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {/* ---------------- Tabela ---------------- */}
            <div className="overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/60">
                {loading ? (
                    <div className="flex items-center justify-center gap-3 py-16 text-slate-400">
                        <FiRefreshCw className="animate-spin" size={20} />
                        <span className="text-sm">Carregando histórico…</span>
                    </div>
                ) : rows.length === 0 ? (
                    <div className="py-16 text-center">
                        <FiInbox className="mx-auto mb-3 text-slate-600" size={36} />
                        <p className="text-sm text-slate-400">Nenhum e-mail encontrado com estes filtros.</p>
                        <p className="mt-1 text-xs text-slate-600">
                            Os e-mails aparecem aqui no momento em que são enfileirados após uma compra,
                            renovação, cancelamento ou reembolso.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left text-sm">
                            <thead className="border-b border-slate-700/60 text-xs uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Evento</th>
                                    <th className="px-4 py-3 font-semibold">Destinatário</th>
                                    <th className="px-4 py-3 font-semibold">Assunto</th>
                                    <th className="px-4 py-3 font-semibold">Envio</th>
                                    <th className="px-4 py-3 font-semibold">Entrega</th>
                                    <th className="px-4 py-3 font-semibold">Quando</th>
                                    <th className="px-4 py-3 font-semibold text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {rows.map((row) => {
                                    const st = STATUS_STYLES[row.status] ?? STATUS_STYLES.pending;
                                    const dv = row.delivery_status ? DELIVERY_STYLES[row.delivery_status] : null;
                                    const canResend = row.status === 'failed' || row.status === 'pending' || row.status === 'canceled';

                                    return (
                                        <tr key={row.id} className="align-top hover:bg-slate-800/40">
                                            <td className="px-4 py-3">
                                                <span className="font-medium text-slate-200">
                                                    {TEMPLATE_LABELS[row.template_type] ?? row.template_type}
                                                </span>
                                                {row.attachment_name && (
                                                    <span className="mt-1 flex items-center gap-1 text-[11px] text-slate-500">
                                                        <FiExternalLink size={10} /> PDF anexado
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 font-mono text-xs text-slate-400">
                                                {row.recipient_email}
                                            </td>
                                            <td className="max-w-[280px] px-4 py-3 text-slate-300">
                                                <span className="line-clamp-2">{row.subject}</span>
                                                {row.last_error && row.status === 'failed' && (
                                                    <p
                                                        className="mt-1 line-clamp-2 text-[11px] text-rose-400/90"
                                                        title={row.last_error}
                                                    >
                                                        {row.last_error_kind}: {row.last_error}
                                                    </p>
                                                )}
                                                {row.attempts > 1 && (
                                                    <p className="mt-1 text-[11px] text-slate-500">
                                                        {row.attempts}ª tentativa
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-block rounded-md border px-2 py-1 text-[11px] font-semibold ${st.cls}`}>
                                                    {st.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {dv ? (
                                                    <span className={`text-xs font-medium ${dv.cls}`}>{dv.label}</span>
                                                ) : row.status === 'sent' ? (
                                                    <span className="text-xs text-slate-500" title="Aguardando o webhook de entrega">
                                                        aguardando…
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-600">—</span>
                                                )}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                                                {formatDateTime(row.created_at)}
                                            </td>
                                            <td className="px-4 py-3 text-right">
                                                {canResend ? (
                                                    <button
                                                        onClick={() => handleResend(row)}
                                                        disabled={busyId === row.id}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 px-2.5 py-1.5 text-[11px] font-semibold text-slate-300 transition hover:border-indigo-500 hover:text-indigo-300 disabled:opacity-50"
                                                    >
                                                        <FiSend size={11} />
                                                        {busyId === row.id ? 'Enfileirando…' : 'Reenviar'}
                                                    </button>
                                                ) : (
                                                    <span className="text-[11px] text-slate-600" title="Reenviar criaria duplicidade">
                                                        já enviado
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {total > PAGE_SIZE && (
                    <div className="flex items-center justify-between border-t border-slate-700/60 px-4 py-3 text-xs text-slate-400">
                        <span>
                            {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} de {total}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="rounded-lg bg-slate-800 px-3 py-1.5 font-semibold transition hover:bg-slate-700 disabled:opacity-40"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
                                disabled={page + 1 >= totalPages}
                                className="rounded-lg bg-slate-800 px-3 py-1.5 font-semibold transition hover:bg-slate-700 disabled:opacity-40"
                            >
                                Próxima
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function StatCard({ label, value, icon: Icon, tone }: {
    label: string;
    value: number;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    tone: string;
}) {
    return (
        <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
                <Icon size={16} className={tone} />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-100">{value}</p>
        </div>
    );
}
