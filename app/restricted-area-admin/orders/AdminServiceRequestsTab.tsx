'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert } from 'lucide-react';
import { FiSearch, FiRefreshCw, FiTool, FiInfo } from 'react-icons/fi';

/**
 * ABA SOLICITAÇÕES DE SERVIÇO — LEITURA MOVIDA PARA O SERVIDOR.
 *
 * Mesma correção das demais abas legadas: a leitura saía do navegador com a
 * chave `anon` e dependia de policy RLS, o que produz tela vazia sem erro.
 *
 * A tabela `service_requests` também está VAZIA no banco (0 linhas,
 * confirmado por consulta direta). A aba diz isso explicitamente em vez de
 * fingir um estado que não existe.
 */

interface Req {
    id: string;
    [k: string]: unknown;
}

const PAGE_SIZE = 25;

export default function AdminServiceRequestsTab() {
    const [rows, setRows] = useState<Req[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [debounced, setDebounced] = useState('');
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
                resource: 'service_requests',
                limit: String(PAGE_SIZE),
                offset: String(page * PAGE_SIZE),
            });
            if (debounced) p.set('q', debounced);

            const res = await fetch(`/api/admin/directory?${p}`, { cache: 'no-store' });
            const json = await res.json();

            if (res.status === 401) { window.location.href = '/login'; return; }
            if (!res.ok) { setError(json?.error ?? 'Não foi possível carregar as solicitações.'); return; }

            setRows(json.items ?? []);
            setTotal(json.total ?? 0);
        } catch {
            setError('Falha de rede ao consultar as solicitações.');
        } finally {
            setLoading(false);
        }
    }, [page, debounced]);

    useEffect(() => { load(); }, [load]);

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

            <div className="flex items-start gap-3 rounded-xl border border-blue-500/30 bg-blue-500/5 p-4">
                <FiInfo className="mt-0.5 shrink-0 text-blue-400" size={18} />
                <p className="text-xs leading-relaxed text-blue-200/80">
                    A tabela <code>service_requests</code> está <strong>zerada</strong> no banco. Os serviços
                    contratados pelo VOLTRIS BR são registrados em <code>payments</code> com
                    <code> invoice_kind = 'service'</code> e aparecem na aba <strong>Compras</strong>.
                </p>
            </div>

            <div className="flex flex-col gap-3 rounded-xl border border-slate-700/60 bg-slate-900/60 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1">
                    <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por nome ou e-mail…"
                        className="w-full rounded-lg border border-slate-700 bg-slate-800/80 py-2 pl-9 pr-3 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500"
                    />
                </div>
                <button onClick={load} disabled={loading}
                    className="self-end rounded-lg bg-slate-800 p-2 text-slate-300 transition hover:bg-slate-700 disabled:opacity-50 lg:self-auto">
                    <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                </button>
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

            <div className="overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/60">
                {loading && rows.length === 0 ? (
                    <div className="flex items-center justify-center gap-3 py-16 text-slate-400">
                        <FiRefreshCw className="animate-spin" size={20} /><span className="text-sm">Carregando…</span>
                    </div>
                ) : rows.length === 0 ? (
                    <div className="py-16 text-center">
                        <FiTool className="mx-auto mb-3 text-slate-600" size={36} />
                        <p className="text-sm text-slate-400">
                            {debounced ? 'Nenhuma solicitação com esta busca.' : 'Nenhuma solicitação registrada.'}
                        </p>
                        {!debounced && (
                            <p className="mt-1 text-xs text-slate-600">
                                Confirmado no banco: 0 registros.
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left text-sm">
                            <thead className="border-b border-slate-700/60 text-xs uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Cliente</th>
                                    <th className="px-4 py-3 font-semibold">Serviço</th>
                                    <th className="px-4 py-3 font-semibold">Status</th>
                                    <th className="px-4 py-3 font-semibold">Aberto em</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {rows.map((r: any) => (
                                    <tr key={r.id} className="hover:bg-slate-800/40">
                                        <td className="px-4 py-3 text-slate-200">
                                            {r.name ?? r.customer_name ?? '—'}
                                            {r.email && <p className="text-xs text-slate-500">{r.email}</p>}
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-300">{r.service_type ?? '—'}</td>
                                        <td className="px-4 py-3 text-xs text-slate-300">{r.status ?? '—'}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                                            {r.created_at ? new Date(r.created_at).toLocaleDateString('pt-BR') : '—'}
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
                            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                                className="rounded-lg bg-slate-800 px-3 py-1.5 font-semibold transition hover:bg-slate-700 disabled:opacity-40">Anterior</button>
                            <button onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))} disabled={page + 1 >= totalPages}
                                className="rounded-lg bg-slate-800 px-3 py-1.5 font-semibold transition hover:bg-slate-700 disabled:opacity-40">Próxima</button>
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
