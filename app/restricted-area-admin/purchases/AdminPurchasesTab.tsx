'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiRefreshCw, FiShoppingCart } from 'react-icons/fi';
import { ShieldAlert } from 'lucide-react';

/**
 * COMPRAS REAIS (PARTE 5).
 *
 * Esta é a tela que responde "quem pagou, quando e por quanto" — que é a
 * pergunta que a aba "Clientes" não responde. Lá são listados CLIENTES (com
 * contagem de compras); aqui são listadas COMPRAS, uma linha por transação,
 * que é como a reconciliação financeira funciona.
 *
 * Differences em relação à aba de clientes, ambas deliberadas:
 *
 *  - E-MAIL COMPLETO. Aqui a tela existe para conciliação e para responder
 *    "qual foi a data da minha compra". O operador precisa do dado. Na lista
 *    de clientes, usada só para navegação, o e-mail continua mascarado.
 *
 *  - DATA DA COMPRA é coluna de primeira classe, não um detalhe escondido na
 *    ficha. Era a ausência dela que fazia a aba anterior não servir.
 */

interface PurchaseRow {
    id: string;
    reference: string | null;
    userId: string | null;
    nome: string;
    email: string;
    plano: string | null;
    modalidade: string | null;
    tipo: string;
    valor: number;
    moeda: string;
    status: string | null;
    dataCompra: string | null;
    dataPago: string | null;
    reembolsado: number | null;
    stripePaymentIntent: string | null;
    stripeInvoice: string | null;
    licencaGerada: string | null;
}

const PAGE_SIZE = 25;

const STATUS_FILTERS = [
    { value: 'all', label: 'Todos' },
    { value: 'approved', label: 'Confirmadas' },
    { value: 'pending', label: 'Pendentes' },
    { value: 'refunded', label: 'Reembolsadas' },
    { value: 'failed', label: 'Falhas' },
];

function brl(n: number): string {
    return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function when(iso: string | null): string {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    } catch { return '—'; }
}

export default function AdminPurchasesTab() {
    const [rows, setRows] = useState<PurchaseRow[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [debounced, setDebounced] = useState('');
    const [status, setStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const t = setTimeout(() => { setDebounced(search.trim()); setPage(0); }, 350);
        return () => clearTimeout(t);
    }, [search]);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const p = new URLSearchParams({
                limit: String(PAGE_SIZE),
                offset: String(page * PAGE_SIZE),
                status,
            });
            if (debounced) p.set('q', debounced);

            const res = await fetch(`/api/admin/purchases?${p}`, { cache: 'no-store' });
            const json = await res.json();

            if (res.status === 401) { window.location.href = '/login'; return; }
            if (!res.ok) { setError(json?.error ?? 'Não foi possível carregar as compras.'); return; }

            setRows(json.items ?? []);
            setTotal(json.total ?? 0);
        } catch {
            setError('Falha de rede ao consultar as compras.');
        } finally {
            setLoading(false);
        }
    }, [page, debounced, status]);

    useEffect(() => { load(); }, [load]);

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const soma = rows.reduce((a, r) => a + (r.valor || 0), 0);

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

            {/* Aviso honesto quando não há nenhuma compra */}
            {!loading && rows.length === 0 && !debounced && status === 'all' && (
                <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-5">
                    <div className="flex items-start gap-3">
                        <FiShoppingCart className="mt-0.5 shrink-0 text-amber-400" size={20} />
                        <div className="text-sm">
                            <p className="font-semibold text-amber-300">Nenhuma compra registrada no banco</p>
                            <p className="mt-1 text-amber-200/80">
                                A tabela <code>payments</code> está sendo consultada e veio vazia para estes filtros.
                                Isso é o estado real — nenhuma compra foi inventada para preencher a tela.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Filtros */}
            <div className="flex flex-col gap-3 rounded-xl border border-slate-700/60 bg-slate-900/60 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1">
                    <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Nome, e-mail, referência ou ID Stripe…"
                        className="w-full rounded-lg border border-slate-700 bg-slate-800/80 py-2 pl-9 pr-3 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {STATUS_FILTERS.map((f) => (
                        <button
                            key={f.value}
                            onClick={() => { setStatus(f.value); setPage(0); }}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                                status === f.value ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                    <button
                        onClick={load}
                        disabled={loading}
                        className="rounded-lg bg-slate-800 p-2 text-slate-300 transition hover:bg-slate-700 disabled:opacity-50"
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
                    </div>
                </div>
            )}

            {/* Tabela */}
            <div className="overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/60">
                {loading && rows.length === 0 ? (
                    <div className="flex items-center justify-center gap-3 py-16 text-slate-400">
                        <FiRefreshCw className="animate-spin" size={20} />
                        <span className="text-sm">Carregando compras…</span>
                    </div>
                ) : rows.length === 0 ? (
                    <div className="py-16 text-center">
                        <FiShoppingCart className="mx-auto mb-3 text-slate-600" size={36} />
                        <p className="text-sm text-slate-400">Nenhuma compra com estes filtros.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[980px] text-left text-sm">
                            <thead className="border-b border-slate-700/60 text-xs uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Cliente</th>
                                    <th className="px-4 py-3 font-semibold">Contato</th>
                                    <th className="px-4 py-3 font-semibold">Plano</th>
                                    <th className="px-4 py-3 font-semibold text-right">Valor</th>
                                    <th className="px-4 py-3 font-semibold">Data da compra</th>
                                    <th className="px-4 py-3 font-semibold">Status</th>
                                    <th className="px-4 py-3 font-semibold">Licença</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {rows.map((r) => (
                                    <tr key={r.id} className="hover:bg-slate-800/40">
                                        <td className="px-4 py-3">
                                            <span className="font-medium text-slate-200">{r.nome}</span>
                                            <p className="text-[11px] text-slate-500">{r.tipo} · {r.reference ?? '—'}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            {/* E-mail COMPLETO nesta tela: é uma tela de conciliação. */}
                                            <a href={`mailto:${r.email}`} className="text-xs text-blue-400 hover:underline break-all">
                                                {r.email}
                                            </a>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-300">
                                            {r.plano ?? '—'}
                                            <p className="text-[11px] text-slate-500">{r.modalidade ?? ''}</p>
                                        </td>
                                        <td className="px-4 py-3 text-right font-semibold text-slate-100">
                                            {brl(r.valor)}
                                            {r.reembolsado != null && (
                                                <p className="text-[11px] font-normal text-rose-400">
                                                    − {brl(r.reembolsado)}
                                                </p>
                                            )}
                                        </td>
                                        {/* A DATA DA COMPRA, em coluna própria. */}
                                        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-300">
                                            {when(r.dataCompra)}
                                            {r.dataPago && r.dataPago !== r.dataCompra && (
                                                <p className="text-[11px] text-emerald-400">pago {when(r.dataPago)}</p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3"><Status status={r.status} /></td>
                                        <td className="px-4 py-3">
                                            {r.licencaGerada
                                                ? <span className="font-mono text-[11px] text-emerald-400">{r.licencaGerada}</span>
                                                : <span className="text-xs text-slate-600">—</span>}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex flex-col gap-2 border-t border-slate-700/60 px-4 py-3 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
                    <span>
                        {total > 0 ? `${total} compra(s)` : 'sem compras'}
                        {rows.length > 0 && ` · ${brl(soma)} nesta página`}
                    </span>
                    {total > PAGE_SIZE && (
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="rounded-lg bg-slate-800 px-3 py-1.5 font-semibold transition hover:bg-slate-700 disabled:opacity-40"
                            >Anterior</button>
                            <button
                                onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))}
                                disabled={page + 1 >= totalPages}
                                className="rounded-lg bg-slate-800 px-3 py-1.5 font-semibold transition hover:bg-slate-700 disabled:opacity-40"
                            >Próxima</button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

function Status({ status }: { status: string | null }) {
    const s = String(status ?? '').toLowerCase();
    const [cls, label] = ['approved', 'paid', 'succeeded'].includes(s)
        ? ['bg-emerald-500/10 text-emerald-400 border-emerald-500/30', status ?? '—']
        : ['refunded', 'partially_refunded'].includes(s)
            ? ['bg-violet-500/10 text-violet-400 border-violet-500/30', status]
            : ['failed', 'canceled', 'cancelled'].includes(s)
                ? ['bg-rose-500/10 text-rose-400 border-rose-500/30', status]
                : ['bg-amber-500/10 text-amber-400 border-amber-500/30', status ?? '—'];
    return <span className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${cls}`}>{label}</span>;
}
