'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { FiSearch, FiRefreshCw, FiUsers, FiX, FiKey, FiCreditCard } from 'react-icons/fi';
import { ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';

/**
 * GESTÃO DE CLIENTES (PARTE 3).
 *
 * Regras da missão aplicadas aqui:
 *
 *  - PAGINAÇÃO NO SERVIDOR sempre. A base cresce; carregar tudo quebra.
 *  - O e-mail aparece MASCARADO na lista e COMPLETO só na ficha do cliente.
 *    O suporte precisa distinguir homônimos, e o domínio já faz isso; o local
 *    do e-mail é dado pessoal sem ganho operacional na listagem.
 *  - "NÃO UNIR CONTAS DIFERENTES SOMENTE PORQUE POSSUEM O MESMO E-MAIL."
 *    Por isso as abas da ficha linked por `user_id`, nunca por e-mail.
 */

interface ClientRow {
    id: string;
    login: string | null;
    emailMasked: string;
    fullName: string;
    phone: string | null;
    city: string | null;
    state: string | null;
    isAdmin: boolean;
    isBlocked: boolean;
    createdAt: string;
    purchases: number;
    licenses: number;
}

interface ClientDetail {
    profile: Record<string, any>;
    purchases: any[];
    licenses: any[];
    subscriptions: any[];
    devices: any[];
    invoices: any[];
    adminHistory: any[];
}

const PAGE_SIZE = 25;

export default function AdminClientsTab() {
    const [rows, setRows] = useState<ClientRow[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [debounced, setDebounced] = useState('');
    const [purchased, setPurchased] = useState<'all' | 'with' | 'without'>('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState<ClientRow | null>(null);

    useEffect(() => {
        const t = setTimeout(() => { setDebounced(search.trim()); setPage(0); }, 350);
        return () => clearTimeout(t);
    }, [search]);

    const load = useCallback(async (silent = false) => {
        if (!silent) setLoading(true);
        setError(null);
        try {
            const p = new URLSearchParams({
                limit: String(PAGE_SIZE),
                offset: String(page * PAGE_SIZE),
                purchased,
            });
            if (debounced) p.set('q', debounced);

            const res = await fetch(`/api/admin/clients?${p}`, { cache: 'no-store' });
            const json = await res.json();

            if (res.status === 401) { window.location.href = '/login'; return; }
            if (!res.ok) { setError(json?.error ?? 'Não foi possível carregar os clientes.'); return; }

            setRows(json.items ?? []);
            setTotal(json.total ?? 0);
        } catch {
            setError('Falha de rede ao consultar clientes.');
        } finally {
            setLoading(false);
        }
    }, [page, debounced, purchased]);

    useEffect(() => { load(); }, [load]);

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

            {/* ---------------- Filtros ---------------- */}
            <div className="flex flex-col gap-3 rounded-xl border border-slate-700/60 bg-slate-900/60 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1">
                    <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Nome, e-mail ou login…"
                        className="w-full rounded-lg border border-slate-700 bg-slate-800/80 py-2 pl-9 pr-3 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {([['all', 'Todos'], ['with', 'Compradores'], ['without', 'Sem compra']] as const).map(([v, l]) => (
                        <button
                            key={v}
                            onClick={() => { setPurchased(v); setPage(0); }}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                                purchased === v ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                        >
                            {l}
                        </button>
                    ))}
                    <button
                        onClick={() => load()}
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

            {/* ---------------- Tabela ---------------- */}
            <div className="overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/60">
                {loading && rows.length === 0 ? (
                    <div className="flex items-center justify-center gap-3 py-16 text-slate-400">
                        <FiRefreshCw className="animate-spin" size={20} />
                        <span className="text-sm">Carregando clientes…</span>
                    </div>
                ) : rows.length === 0 ? (
                    <div className="py-16 text-center">
                        <FiUsers className="mx-auto mb-3 text-slate-600" size={36} />
                        <p className="text-sm text-slate-400">Nenhum cliente encontrado com estes filtros.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[820px] text-left text-sm">
                            <thead className="border-b border-slate-700/60 text-xs uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Cliente</th>
                                    <th className="px-4 py-3 font-semibold">Contato</th>
                                    <th className="px-4 py-3 font-semibold">Local</th>
                                    <th className="px-4 py-3 font-semibold text-center">Compras</th>
                                    <th className="px-4 py-3 font-semibold text-center">Licenças</th>
                                    <th className="px-4 py-3 font-semibold">Cadastro</th>
                                    <th className="px-4 py-3 font-semibold text-right">Ficha</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {rows.map((c) => (
                                    <tr key={c.id} className="hover:bg-slate-800/40">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-slate-200">{c.fullName}</span>
                                                {c.isAdmin && (
                                                    <span className="rounded bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-violet-300">
                                                        admin
                                                    </span>
                                                )}
                                                {c.isBlocked && (
                                                    <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-rose-300">
                                                        bloqueado
                                                    </span>
                                                )}
                                            </div>
                                            <p className="font-mono text-[11px] text-slate-500">{c.emailMasked}</p>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-400">{c.phone ?? '—'}</td>
                                        <td className="px-4 py-3 text-xs text-slate-400">
                                            {c.city ? `${c.city}${c.state ? ` / ${c.state}` : ''}` : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={c.purchases > 0 ? 'font-semibold text-emerald-400' : 'text-slate-600'}>
                                                {c.purchases}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={c.licenses > 0 ? 'font-semibold text-indigo-400' : 'text-slate-600'}>
                                                {c.licenses}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                                            {new Date(c.createdAt).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => setSelected(c)}
                                                className="rounded-lg border border-slate-700 px-2.5 py-1.5 text-[11px] font-semibold text-slate-300 transition hover:border-indigo-500 hover:text-indigo-300"
                                            >
                                                Abrir
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {total > PAGE_SIZE && (
                    <div className="flex items-center justify-between border-t border-slate-700/60 px-4 py-3 text-xs text-slate-400">
                        <span>{page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, total)} de {total}</span>
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
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selected && (
                    <ClientDrawer client={selected} onClose={() => setSelected(null)} />
                )}
            </AnimatePresence>
        </motion.div>
    );
}

// ===========================================================================

function ClientDrawer({ client, onClose }: { client: ClientRow; onClose: () => void }) {
    const [data, setData] = useState<ClientDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'resumo' | 'compras' | 'licencas' | 'assinaturas' | 'dispositivos' | 'faturas'>('resumo');

    useEffect(() => {
        let alive = true;
        (async () => {
            try {
                const res = await fetch(`/api/admin/clients?detail=${client.id}`, { cache: 'no-store' });
                if (!res.ok) { toast.error('Não foi possível carregar a ficha do cliente.'); return; }
                const json = await res.json();
                if (alive) setData(json);
            } catch { toast.error('Falha de rede ao carregar a ficha.'); }
            finally { if (alive) setLoading(false); }
        })();
        return () => { alive = false; };
    }, [client.id]);

    const TABS = [
        { v: 'resumo', l: 'Visão geral' },
        { v: 'compras', l: 'Compras' },
        { v: 'licencas', l: 'Licenças' },
        { v: 'assinaturas', l: 'Assinaturas' },
        { v: 'dispositivos', l: 'Dispositivos' },
        { v: 'faturas', l: 'Faturas' },
    ] as const;

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 p-4 pt-16 overflow-y-auto"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-3xl rounded-xl border border-slate-700 bg-slate-900 shadow-2xl"
            >
                <div className="flex items-start justify-between border-b border-slate-700 p-5">
                    <div>
                        <h3 className="text-lg font-bold text-slate-100">{client.fullName}</h3>
                        <p className="mt-0.5 text-sm text-slate-400">{data?.profile?.email ?? client.emailMasked}</p>
                    </div>
                    <button onClick={onClose} className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800" aria-label="Fechar">
                        <FiX size={18} />
                    </button>
                </div>

                <div className="flex gap-1 overflow-x-auto border-b border-slate-700 px-4 pt-3">
                    {TABS.map((t) => (
                        <button
                            key={t.v}
                            onClick={() => setTab(t.v)}
                            className={`whitespace-nowrap rounded-t-lg px-3 py-2 text-xs font-semibold transition ${
                                tab === t.v ? 'bg-slate-800 text-indigo-300' : 'text-slate-500 hover:text-slate-300'
                            }`}
                        >
                            {t.l}
                        </button>
                    ))}
                </div>

                <div className="max-h-[60vh] overflow-y-auto p-5">
                    {loading ? (
                        <div className="flex items-center justify-center gap-3 py-12 text-slate-400">
                            <FiRefreshCw className="animate-spin" size={18} />
                            <span className="text-sm">Carregando…</span>
                        </div>
                    ) : !data ? null : (
                        <>
                            {tab === 'resumo' && <Resumo d={data} />}
                            {tab === 'compras' && <Compras rows={data.purchases} />}
                            {tab === 'licencas' && <Licencas rows={data.licenses} />}
                            {tab === 'assinaturas' && <Simples rows={data.subscriptions} vazio="Nenhuma assinatura." />}
                            {tab === 'dispositivos' && <Dispositivos rows={data.devices} />}
                            {tab === 'faturas' && <Faturas rows={data.invoices} />}
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}

function Resumo({ d }: { d: ClientDetail }) {
    const p = d.profile;
    return (
        <div className="grid grid-cols-2 gap-3 text-sm">
            <Field label="Login" value={p.login ?? '—'} />
            <Field label="E-mail" value={p.email ?? '—'} />
            <Field label="Telefone" value={p.phone ?? '—'} />
            <Field label="Cadastro" value={new Date(p.created_at).toLocaleDateString('pt-BR')} />
            <Field label="Cidade" value={[p.city, p.state].filter(Boolean).join(' / ') || '—'} />
            <Field label="Perfil" value={p.is_admin ? 'Administrador' : 'Cliente'} />
            <div className="col-span-2 mt-3 grid grid-cols-3 gap-2">
                <Mini label="Compras" value={d.purchases.length} />
                <Mini label="Licenças" value={d.licenses.length} />
                <Mini label="Dispositivos" value={d.devices.length} />
            </div>
        </div>
    );
}

function Compras({ rows }: { rows: any[] }) {
    if (!rows.length) return <Vazio texto="Nenhuma compra registrada." />;
    return (
        <table className="w-full text-left text-xs">
            <thead className="text-slate-500">
                <tr><th className="py-2">Data</th><th>Plano</th><th>Valor</th><th>Status</th></tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
                {rows.map((r, i) => (
                    <tr key={i}>
                        <td className="py-2 text-slate-400">{new Date(r.created_at).toLocaleDateString('pt-BR')}</td>
                        <td className="text-slate-300">{r.plan_type ?? '—'}</td>
                        <td className="text-slate-300">R$ {Number(r.amount ?? 0).toFixed(2)}</td>
                        <td><StatusBadge status={r.status} /></td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

function Licencas({ rows }: { rows: any[] }) {
    if (!rows.length) return <Vazio texto="Nenhuma licença emitida." />;
    return (
        <div className="space-y-2">
            {rows.map((r, i) => (
                <div key={i} className="rounded-lg border border-slate-700 p-3">
                    <div className="flex items-center justify-between">
                        <span className="font-mono text-xs text-emerald-400">{r.license_key}</span>
                        <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${
                            r.revoked ? 'bg-rose-500/20 text-rose-300' : 'bg-emerald-500/20 text-emerald-300'
                        }`}>
                            {r.revoked ? 'Revogada' : 'Ativa'}
                        </span>
                    </div>
                    <p className="mt-1 text-[11px] text-slate-500">
                        {r.plan_type} · vence {r.expires_at ? new Date(r.expires_at).toLocaleDateString('pt-BR') : '—'}
                        {r.client_id ? ` · cliente ${r.client_id}` : ''}
                    </p>
                </div>
            ))}
        </div>
    );
}

function Dispositivos({ rows }: { rows: any[] }) {
    if (!rows.length) return <Vazio texto="Nenhum dispositivo vinculado." />;
    return (
        <div className="space-y-2">
            {rows.map((r, i) => (
                <div key={i} className="rounded-lg border border-slate-700 p-3 text-xs">
                    <p className="font-medium text-slate-200">{r.machine_name ?? r.device_name ?? 'Dispositivo'}</p>
                    <p className="mt-1 font-mono text-[11px] text-slate-500">{r.device_id}</p>
                    <p className="mt-1 text-[11px] text-slate-500">
                        {r.os_version ?? '—'} · visto {r.last_seen_at ? new Date(r.last_seen_at).toLocaleDateString('pt-BR') : 'nunca'}
                    </p>
                </div>
            ))}
        </div>
    );
}

function Faturas({ rows }: { rows: any[] }) {
    if (!rows.length) return <Vazio texto="Nenhuma fatura disponível para compras confirmadas." />;
    return (
        <div className="space-y-2">
            <p className="text-[11px] text-slate-500">
                A fatura é gerada a partir da compra confirmada, pelo mesmo gerador usado pelo cliente.
            </p>
            {rows.map((r, i) => (
                <div key={i} className="flex items-center justify-between rounded-lg border border-slate-700 p-3 text-xs">
                    <div>
                        <FiCreditCard className="inline mr-2 text-slate-500" size={14} />
                        <span className="text-slate-300">{r.reference_id}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-slate-300">R$ {Number(r.amount ?? 0).toFixed(2)}</span>
                        <StatusBadge status={r.status} />
                    </div>
                </div>
            ))}
        </div>
    );
}

function Simples({ rows, vazio }: { rows: any[]; vazio: string }) {
    if (!rows.length) return <Vazio texto={vazio} />;
    return (
        <div className="space-y-2">
            {rows.map((r, i) => (
                <div key={i} className="rounded-lg border border-slate-700 p-3 text-xs">
                    <p className="text-slate-200">{r.plan_type} · {r.billing_period}</p>
                    <p className="mt-1 text-slate-500">
                        {r.status} · próxima cobrança {r.next_billing_at ? new Date(r.next_billing_at).toLocaleDateString('pt-BR') : '—'}
                    </p>
                </div>
            ))}
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const s = String(status ?? '').toLowerCase();
    const cls = ['approved', 'paid', 'succeeded'].includes(s)
        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
        : ['refunded', 'partially_refunded'].includes(s)
            ? 'bg-violet-500/10 text-violet-400 border-violet-500/30'
            : ['failed', 'canceled', 'cancelled'].includes(s)
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    return <span className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${cls}`}>{status ?? '—'}</span>;
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
            <p className="mt-0.5 break-words text-slate-300">{value}</p>
        </div>
    );
}

function Mini({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-lg bg-slate-800/60 p-3 text-center">
            <p className="text-xl font-bold text-slate-100">{value}</p>
            <p className="text-[10px] uppercase tracking-wider text-slate-500">{label}</p>
        </div>
    );
}

function Vazio({ texto }: { texto: string }) {
    return <p className="py-10 text-center text-sm text-slate-500">{texto}</p>;
}
