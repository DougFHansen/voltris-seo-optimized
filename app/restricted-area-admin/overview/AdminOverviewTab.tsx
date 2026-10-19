'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
    FiUsers, FiKey, FiCreditCard, FiRefreshCw, FiDollarSign,
    FiAlertTriangle, FiCheckCircle, FiClock, FiTrendingUp, FiMonitor, FiMail,
} from 'react-icons/fi';
import { RefreshCcw, ShieldAlert } from 'lucide-react';

/**
 * VISÃO GERAL DO NEGÓCIO (PARTE 2).
 *
 * Três regras da missão que moldaram esta tela:
 *
 *  1. "NÃO CONFUNDIR" receita recebida com prevista. A receita bruta aqui é
 *     soma de pagamentos CONFIRMADOS no período. Um `pending` não entra, e o
 *     rótulo diz "recebida" justamente para não haver dúvida.
 *
 *  2. "CRIAR GRÁFICOS E RELATÓRIOS SOMENTE QUANDO HOUVER DADOS REAIS." Não há
 *     gráfico de barras ou pizza aqui. Com o volume atual do VOLTRIS eles
 *     seriam decoração — e um gráfico bonito com pouca amostra é a forma mais
 *     rápida de fazer o painel mentir.
 *
 *  3. "QUANDO OS DADOS PERMITIREM." Quando uma tabela ainda não existe, o
 *     bloco mostra 0 e um aviso explicando o que falta, em vez de esconder ou
 *     inventar. Um número ausente declarado é útil; um número estimado não é.
 */

interface Metrics {
    users: { total: number; admin: number; blocked: number; newInPeriod: number; pendingConfirmation: number | null };
    licenses: { active: number; expired: number; revoked: number; promotional: number; total: number; expiringSoon: number };
    subscriptions: { active: number; canceling: number; canceled: number; total: number };
    payments: { confirmed: number; pending: number; failed: number; refunded: number; partiallyRefunded: number; total: number };
    revenue: { gross: number; refunds: number; net: number; currency: string };
    devices: { linked: number };
    alerts: { webhookFailures: number; emailFailures: number; stuckEmails: number };
    unavailable: string[];
}

interface Mrr { mrr: number; arr: number | null; eligible: number; currency: string; reason?: string }

const PERIODS = [
    { value: 'today', label: 'Hoje' },
    { value: '7d', label: '7 dias' },
    { value: '30d', label: '30 dias' },
    { value: 'month', label: 'Mês atual' },
    { value: 'prev_month', label: 'Mês anterior' },
    { value: 'year', label: 'Ano atual' },
];

function brl(n: number): string {
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function AdminOverviewTab() {
    const [metrics, setMetrics] = useState<Metrics | null>(null);
    const [mrr, setMrr] = useState<Mrr | null>(null);
    const [range, setRange] = useState<{ from: string; to: string } | null>(null);
    const [period, setPeriod] = useState('30d');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/admin/overview?period=${period}`, { cache: 'no-store' });
            const json = await res.json();

            if (res.status === 401) { window.location.href = '/login'; return; }
            if (!res.ok) {
                setError(json?.error ?? 'Não foi possível carregar os indicadores.');
                return;
            }
            setMetrics(json.metrics);
            setMrr(json.mrr);
            setRange(json.range);
        } catch {
            setError('Falha de rede ao consultar os indicadores.');
        } finally {
            setLoading(false);
        }
    }, [period]);

    useEffect(() => { load(); }, [load]);

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

            {/* Saudação: veio do bloco antigo de visão geral, removido por
                duplicar `activeTab === 'overview'`. */}
            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
                <h3 className="mb-1 text-base font-bold text-slate-100">Visão geral do negócio</h3>
                <p className="text-sm leading-relaxed text-slate-500">
                    Números reais do banco, calculados no servidor. A tabela <strong>Compras</strong> lista quem pagou,
                    quando e por quanto.
                </p>
            </div>

            {/* ---------------- Filtro de período ---------------- */}
            <div className="flex flex-col gap-3 rounded-xl border border-slate-700/60 bg-slate-900/60 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex flex-wrap gap-2">
                    {PERIODS.map((p) => (
                        <button
                            key={p.value}
                            onClick={() => setPeriod(p.value)}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                                period === p.value ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-3">
                    {range && (
                        <span className="text-[11px] text-slate-500">
                            {new Date(range.from).toLocaleDateString('pt-BR')} a {new Date(range.to).toLocaleDateString('pt-BR')}
                        </span>
                    )}
                    <button
                        onClick={load}
                        disabled={loading}
                        className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 disabled:opacity-50"
                    >
                        <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {error && (
                <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4">
                    <ShieldAlert className="mt-0.5 shrink-0 text-rose-400" size={20} />
                    <div className="text-sm">
                        <p className="font-semibold text-rose-300">Não foi possível carregar</p>
                        <p className="text-rose-200/80">{error}</p>
                        <button onClick={load} className="mt-2 text-xs font-semibold text-rose-300 underline">
                            Tentar de novo
                        </button>
                    </div>
                </div>
            )}

            {loading && !metrics && (
                <div className="flex items-center justify-center gap-3 py-20 text-slate-400">
                    <FiRefreshCw className="animate-spin" size={20} />
                    <span className="text-sm">Calculando indicadores…</span>
                </div>
            )}

            {metrics && (
                <>
                    {/* ---------------- Receita ---------------- */}
                    <section>
                        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                            <FiDollarSign size={15} /> Receita recebida no período
                        </h3>
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                            <Card label="Bruta" value={brl(metrics.revenue.gross)} tone="text-emerald-400" icon={FiDollarSign}
                                  hint="Somente pagamentos confirmados" />
                            <Card label="Reembolsos" value={brl(metrics.revenue.refunds)} tone="text-rose-400" icon={RefreshCcw}
                                  hint="Valor devolvido no período" />
                            <Card label="Líquida" value={brl(metrics.revenue.net)} tone="text-indigo-400" icon={FiTrendingUp}
                                  hint="Bruta menos reembolsos" />
                        </div>
                    </section>

                    {/* ---------------- MRR ---------------- */}
                    {mrr && (
                        <section>
                            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                                <FiTrendingUp size={15} /> Recorrência
                            </h3>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                                <Card label="MRR" value={brl(mrr.mrr)} tone="text-emerald-400" icon={FiTrendingUp}
                                      hint={`${mrr.eligible} assinatura(s) ativa(s) com renovação`} />
                                <Card
                                    label="ARR"
                                    value={mrr.arr !== null ? brl(mrr.arr) : '—'}
                                    tone="text-blue-400"
                                    icon={FiTrendingUp}
                                    hint={mrr.reason ?? 'MRR × 12'}
                                />
                            </div>
                            {mrr.reason && (
                                <p className="mt-2 text-xs text-slate-500">{mrr.reason}</p>
                            )}
                        </section>
                    )}

                    {/* ---------------- Operacional ---------------- */}
                    <section>
                        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                            <FiUsers size={15} /> Base e operação
                        </h3>
                        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                            <Card label="Usuários" value={metrics.users.total} tone="text-blue-400" icon={FiUsers}
                                  hint={`+${metrics.users.newInPeriod} no período`} />
                            <Card label="Licenças ativas" value={metrics.licenses.active} tone="text-emerald-400" icon={FiKey}
                                  hint={`${metrics.licenses.expiringSoon} vencendo em 7 dias`} />
                            <Card label="Assinaturas ativas" value={metrics.subscriptions.active} tone="text-violet-400" icon={RefreshCcw}
                                  hint={`${metrics.subscriptions.canceling} em cancelamento`} />
                            <Card label="Dispositivos" value={metrics.devices.linked} tone="text-slate-300" icon={FiMonitor}
                                  hint="Máquinas vinculadas" />
                        </div>
                    </section>

                    {/* ---------------- Estados ---------------- */}
                    <section>
                        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-400">
                            <FiCreditCard size={15} /> Estados
                        </h3>
                        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                            <Card label="Pagamentos confirmados" value={metrics.payments.confirmed} tone="text-emerald-400" icon={FiCheckCircle}
                                  hint={`${metrics.payments.total} no total`} />
                            <Card label="Pendentes" value={metrics.payments.pending} tone="text-amber-400" icon={FiClock}
                                  hint="Aguardando confirmação" />
                            <Card label="Falhos / cancelados" value={metrics.payments.failed} tone="text-rose-400" icon={FiAlertTriangle}
                                  hint={`${metrics.payments.refunded} reembolsados`} />
                            <Card label="Licenças revogadas" value={metrics.licenses.revoked} tone="text-rose-400" icon={FiKey}
                                  hint={`${metrics.licenses.expired} expiradas`} />
                        </div>
                    </section>

                    {/* ---------------- Alertas ---------------- */}
                    {(metrics.alerts.webhookFailures > 0 || metrics.alerts.emailFailures > 0 || metrics.alerts.stuckEmails > 0) && (
                        <section>
                            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-400">
                                <FiAlertTriangle size={15} /> Requer atenção
                            </h3>
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                                {metrics.alerts.webhookFailures > 0 && (
                                    <Alert title="Falhas de webhook" value={metrics.alerts.webhookFailures}
                                           hint="Eventos Stripe não processados no período" />
                                )}
                                {metrics.alerts.emailFailures > 0 && (
                                    <Alert title="E-mails com falha" value={metrics.alerts.emailFailures}
                                           hint="Verifique a aba E-mails" />
                                )}
                                {metrics.alerts.stuckEmails > 0 && (
                                    <Alert title="E-mails na fila" value={metrics.alerts.stuckEmails}
                                           hint="Aguardando processamento" />
                                )}
                            </div>
                        </section>
                    )}

                    {/* ---------------- Transparência ---------------- */}
                    {metrics.unavailable.length > 0 && (
                        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
                            <p className="text-xs font-semibold text-amber-300">
                                Indicadores sem fonte no banco
                            </p>
                            <p className="mt-1 text-xs text-amber-200/70">
                                Estes números foram zerados porque a tabela ou coluna ainda não existe.
                                Aplique <code className="text-amber-200">admin.sql</code> no Supabase para completá-los.
                            </p>
                            <ul className="mt-2 list-inside list-disc text-[11px] text-amber-200/60">
                                {metrics.unavailable.map((u) => <li key={u}>{u}</li>)}
                            </ul>
                        </div>
                    )}

                    {metrics.users.pendingConfirmation === null && (
                        <p className="text-[11px] text-slate-600">
                            Confirmação de e-mail não é exibida: a tabela <code>auth.users</code> não é legível pela
                            API do projeto. Optamos por omitir em vez de estimar.
                        </p>
                    )}
                </>
            )}
        </motion.div>
    );
}

function Card({ label, value, tone, icon: Icon, hint }: {
    label: string; value: string | number; tone: string;
    icon: React.ComponentType<{ size?: number; className?: string }>; hint?: string;
}) {
    return (
        <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
                <Icon size={15} className={tone} />
            </div>
            <p className={`mt-2 text-2xl font-bold ${tone}`}>{value}</p>
            {hint && <p className="mt-1 text-[11px] text-slate-500">{hint}</p>}
        </div>
    );
}

function Alert({ title, value, hint }: { title: string; value: number; hint: string }) {
    return (
        <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">{title}</span>
                <span className="text-xl font-bold text-amber-300">{value}</span>
            </div>
            <p className="mt-1 text-[11px] text-amber-200/70">{hint}</p>
        </div>
    );
}
