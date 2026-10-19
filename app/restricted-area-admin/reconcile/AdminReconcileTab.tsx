'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiRefreshCw, FiSearch, FiAlertTriangle, FiCheckCircle, FiClock, FiInfo } from 'react-icons/fi';
import { ShieldAlert } from 'lucide-react';

/**
 * CONCILIAÇÃO FINANCEIRA (PARTE 5).
 *
 * Por que esta tela existe: a rota `/api/admin/reconcile` já existia e fazia
 * a conciliação corretamente — dry-run por padrão, autoridade da Stripe,
 * `NEEDS_MANUAL` quando não há prova. MAS NINGUÉM ALCANÇAVA ELA: não havia
 * botão no painel. Uma ferramenta de diagnóstico que ninguém consegue abrir
 * não é ferramenta.
 *
 * -------------------------------------------------------------------------
 * A REGRA QUE ESTA TELA NÃO PODE QUEBRAR
 * -------------------------------------------------------------------------
 * "É proibido alterar um pagamento para `paid` apenas porque o administrador
 * clicou em um botão, sem comprovação financeira." (Parte 5)
 *
 * Por isso o botão de aplicar exige DIGITAR `RECONCILE-APPLY`. Um `confirm()`
 * de navegador seria atropelado por um clique apressado; a frase literal não.
 * E o que o aplicador escreve não vem desta tela — vem da resposta da Stripe.
 */

type Outcome =
    | 'EMIT_LICENSE'
    | 'APPROVE_PAYMENT'
    | 'LINK_SUBSCRIPTION'
    | 'ALREADY_ISSUED'
    | 'WAIT_STRIPE'
    | 'MARK_UNPAID'
    | 'NEEDS_MANUAL';

interface ReportRow {
    payment_id: string;
    reference_id: string | null;
    created_at: string | null;
    age_days: number | null;
    plan_type: string | null;
    amount: number | null;
    db_status: string;
    is_license: boolean;
    action: Outcome;
    reason: string;
    effect: string;
    applied?: boolean;
    error?: string;
}

interface Relatorio {
    total_pending: number;
    summary: Record<string, number>;
    report: ReportRow[];
}

/**
 * Os nomes abaixo são os que a ROTA realmente devolve (`ReconcileAction`).
 *
 * Antes a tela usava nomes que não existiam mais — ISSUE_LICENSE, MARK_PAID,
 * LINK_ONLY. Resultado: todas as ações caíam no fallback "Conferência manual",
 * e o contador de ações aplicáveis dava zero, então o botão "Aplicar" nunca
 * aparecia. Uma tela que nunca deixa aplicar não concilia nada.
 */
const ACAO: Record<string, { rotulo: string; cls: string; tom: 'ok' | 'aviso' | 'perigo' | 'neutro' }> = {
    ALREADY_ISSUED: { rotulo: 'Licença já emitida', cls: 'bg-slate-500/10 text-slate-400 border-slate-500/30', tom: 'neutro' },
    EMIT_LICENSE: { rotulo: 'Emitir licença', cls: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', tom: 'aviso' },
    APPROVE_PAYMENT: { rotulo: 'Confirmar pagamento', cls: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', tom: 'ok' },
    LINK_SUBSCRIPTION: { rotulo: 'Vincular assinatura', cls: 'bg-violet-500/10 text-violet-400 border-violet-500/30', tom: 'aviso' },
    WAIT_STRIPE: { rotulo: 'Aguardando Stripe', cls: 'bg-amber-500/10 text-amber-400 border-amber-500/30', tom: 'aviso' },
    MARK_UNPAID: { rotulo: 'Marcar não pago', cls: 'bg-rose-500/10 text-rose-400 border-rose-500/30', tom: 'perigo' },
    NEEDS_MANUAL: { rotulo: 'Conferência manual', cls: 'bg-rose-500/10 text-rose-400 border-rose-500/30', tom: 'perigo' },
};

/** Ações que o apply realmente executa. WAIT_STRIPE e NEEDS_MANUAL não escrevem. */
const APLICAVEIS = new Set(['EMIT_LICENSE', 'APPROVE_PAYMENT', 'LINK_SUBSCRIPTION', 'ALREADY_ISSUED', 'MARK_UNPAID']);

export default function AdminReconcileTab() {
    const [dados, setDados] = useState<Relatorio | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const [filtro, setFiltro] = useState('');
    const [confirmando, setConfirmando] = useState(false);
    const [frase, setFrase] = useState('');
    const [aplicando, setAplicando] = useState(false);

    const carregar = useCallback(async () => {
        setCarregando(true);
        setErro(null);
        try {
            // GET é SEMPRE dry-run: mostra o que seria feito sem escrever nada.
            const res = await fetch('/api/admin/reconcile', { cache: 'no-store' });
            const json = await res.json();

            if (res.status === 401) { window.location.href = '/login'; return; }
            if (!res.ok) {
                setErro(json?.error ?? 'Não foi possível rodar a conciliação.');
                return;
            }
            setDados(json);
        } catch {
            setErro('Falha de rede ao rodar a conciliação.');
        } finally {
            setCarregando(false);
        }
    }, []);

    useEffect(() => { carregar(); }, [carregar]);

    const aplicar = async () => {
        if (frase !== 'RECONCILE-APPLY') {
            toast.error('Digite RECONCILE-APPLY exatamente para confirmar.');
            return;
        }
        setAplicando(true);
        try {
            const res = await fetch('/api/admin/reconcile', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ apply: true, confirm: frase }),
            });
            const json = await res.json();

            if (!res.ok) {
                toast.error(json?.error ?? 'A aplicação falhou. Veja o relatório.');
                setDados(json?.report ? { total_pending: json.report.length, summary: {}, report: json.report } : dados);
                return;
            }
            toast.success('Conciliação aplicada. Veja o relatório abaixo.');
            setConfirmando(false);
            setFrase('');
            setDados(json);
        } catch {
            toast.error('Falha de rede ao aplicar.');
        } finally {
            setAplicando(false);
        }
    };

    const linhas = (dados?.report ?? []).filter((r) => {
        if (!filtro) return true;
        const alvo = filtro.toLowerCase();
        return (
            String(r.reference_id ?? '').toLowerCase().includes(alvo) ||
            String(r.plan_type ?? '').toLowerCase().includes(alvo) ||
            r.action.toLowerCase().includes(alvo)
        );
    });

    const aplicaveis = (dados?.report ?? []).filter((r) => APLICAVEIS.has(r.action)).length;
    const manuais = (dados?.summary ?? {}).NEEDS_MANUAL ?? 0;

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

            <div className="flex items-start gap-3 rounded-xl border border-blue-500/30 bg-blue-500/5 p-4">
                <FiInfo className="mt-0.5 shrink-0 text-blue-400" size={18} />
                <p className="text-xs leading-relaxed text-blue-200/80">
                    Esta tela pergunta <strong>à Stripe</strong> o que aconteceu com cada pagamento pendente.
                    Ela <strong>nunca</strong> deduz que alguém pagou a partir do nosso próprio banco — é a
                    Stripe que é a autoridade. O que não tiver prova fica como <strong>Conferência manual</strong>,
                    nunca vira &ldquo;não pago&rdquo;: perder o acesso de quem pagou é pior que um pendente a mais.
                </p>
            </div>

            {erro && (
                <div role="alert" className="flex items-start gap-3 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4">
                    <ShieldAlert className="mt-0.5 shrink-0 text-rose-400" size={20} />
                    <div className="text-sm">
                        <p className="font-semibold text-rose-300">Conciliação indisponível</p>
                        <p className="text-rose-200/80">{erro}</p>
                        <p className="mt-1 text-xs text-rose-200/60">
                            Verifique se <code>STRIPE_SECRET_KEY</code> live está definida no ambiente da Vercel.
                            Com chave de teste a consulta às assinaturas de produção falha.
                        </p>
                        <button onClick={carregar} className="mt-2 text-xs font-semibold text-rose-300 underline">Tentar de novo</button>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-3 rounded-xl border border-slate-700/60 bg-slate-900/60 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1">
                    <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                        value={filtro}
                        onChange={(e) => setFiltro(e.target.value)}
                        placeholder="Filtrar por referência, plano ou ação…"
                        className="w-full rounded-lg border border-slate-700 bg-slate-800/80 py-2 pl-9 pr-3 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {aplicaveis > 0 && !confirmando && (
                        <button
                            onClick={() => setConfirmando(true)}
                            className="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500"
                        >
                            Aplicar {aplicaveis} conciliação(ões)
                        </button>
                    )}
                    <button
                        onClick={carregar}
                        disabled={carregando}
                        className="rounded-lg bg-slate-800 p-2 text-slate-300 transition hover:bg-slate-700 disabled:opacity-50"
                    >
                        <FiRefreshCw size={14} className={carregando ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {confirmando && (
                <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-5">
                    <div className="flex items-start gap-3">
                        <FiAlertTriangle className="mt-0.5 shrink-0 text-amber-400" size={20} />
                        <div className="text-sm">
                            <p className="font-semibold text-amber-300">Isto escreve no banco de clientes</p>
                            <p className="mt-1 text-amber-200/80">
                                Vai aplicar {aplicaveis} ajuste(s): confirmar os pagamentos que a Stripe
                                comprova como pagos, emitir licenças faltantes e marcar como não pagos
                                apenas os que a Stripe reporta como não pagos. Confira o relatório antes.
                            </p>
                            <label className="mt-3 mb-1 block text-xs font-semibold text-amber-300">
                                Digite <span className="font-mono">RECONCILE-APPLY</span> para confirmar
                            </label>
                            <input
                                value={frase}
                                onChange={(e) => setFrase(e.target.value)}
                                placeholder="RECONCILE-APPLY"
                                className="mb-3 w-full rounded-lg border border-amber-500/40 bg-slate-900 px-3 py-2 font-mono text-sm text-slate-100 outline-none focus:border-amber-400 sm:max-w-sm"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={() => { setConfirmando(false); setFrase(''); }}
                                    className="rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:bg-slate-700"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={aplicar}
                                    disabled={frase !== 'RECONCILE-APPLY' || aplicando}
                                    className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:opacity-40"
                                >
                                    {aplicando ? 'Aplicando…' : 'Aplicar agora'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {dados && (
                <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
                    <Card label="Pendentes" value={dados.total_pending} tone="text-amber-400" icon={FiClock} />
                    <Card label="Ações sugeridas" value={aplicaveis} tone="text-emerald-400" icon={FiCheckCircle} />
                    <Card label="Conferência manual" value={manuais} tone="text-rose-400" icon={FiAlertTriangle} />
                    <Card label="Licença já emitida" value={(dados.summary ?? {}).ALREADY_ISSUED ?? 0} tone="text-slate-300" icon={FiInfo} />
                </div>
            )}

            <div className="overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/60">
                {carregando && !dados ? (
                    <div className="flex items-center justify-center gap-3 py-16 text-slate-400">
                        <FiRefreshCw className="animate-spin" size={20} />
                        <span className="text-sm">Consultando a Stripe…</span>
                    </div>
                ) : linhas.length === 0 ? (
                    <div className="py-16 text-center">
                        <FiCheckCircle className="mx-auto mb-3 text-emerald-500" size={36} />
                        <p className="text-sm text-slate-300">
                            {dados ? 'Nenhum pagamento pendente.' : 'A conciliação ainda não rodou.'}
                        </p>
                        {dados && <p className="mt-1 text-xs text-slate-500">Nada a reconciliar no banco.</p>}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left text-sm">
                            <thead className="border-b border-slate-700/60 text-xs uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Compra</th>
                                    <th className="px-4 py-3 font-semibold">Plano</th>
                                    <th className="px-4 py-3 font-semibold text-right">Valor</th>
                                    <th className="px-4 py-3 font-semibold">Idade</th>
                                    <th className="px-4 py-3 font-semibold">Ação sugerida</th>
                                    <th className="px-4 py-3 font-semibold">Por quê</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {linhas.map((r) => {
                                    const a = ACAO[r.action] ?? ACAO.NEEDS_MANUAL;
                                    return (
                                        <tr key={r.payment_id} className="hover:bg-slate-800/40">
                                            <td className="px-4 py-3">
                                                <span className="font-mono text-xs text-slate-300">{r.reference_id ?? r.payment_id.slice(0, 8)}</span>
                                                {r.applied && (
                                                    <p className="text-[10px] font-semibold text-emerald-400">aplicado</p>
                                                )}
                                                {r.error && (
                                                    <p className="text-[10px] text-rose-400">{r.error}</p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-xs text-slate-300">{r.plan_type ?? '—'}</td>
                                            <td className="px-4 py-3 text-right text-xs text-slate-100">
                                                R$ {Number(r.amount ?? 0).toFixed(2)}
                                            </td>
                                            <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                                                {r.age_days !== null ? `${r.age_days}d` : '—'}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${a.cls}`}>
                                                    {a.rotulo}
                                                </span>
                                            </td>
                                            <td className="max-w-[280px] px-4 py-3 text-[11px] text-slate-400">
                                                <span className="line-clamp-2">{r.reason || '—'}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

function Card({ label, value, tone, icon: Icon }: {
    label: string; value: number; tone: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
}) {
    return (
        <div className="rounded-xl border border-slate-700/60 bg-slate-900/60 p-4">
            <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</span>
                <Icon size={15} className={tone} />
            </div>
            <p className={`mt-2 text-2xl font-bold ${tone}`}>{value}</p>
        </div>
    );
}
