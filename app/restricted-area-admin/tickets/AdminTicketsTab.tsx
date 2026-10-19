'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ShieldAlert } from 'lucide-react';
import { FiSearch, FiRefreshCw, FiInbox, FiCheckCircle } from 'react-icons/fi';

/**
 * ABA TICKETS — LEITURA E ESCRITA MOVIDAS PARA O SERVIDOR.
 *
 * A versão anterior lia e escrevia `tickets` direto do navegador com a chave
 * `anon`. Duas consequências práticas:
 *
 *  - leitura: tela vazia sem erro quando faltava policy RLS;
 *  - ESCRITA: qualquer pessoa logada podia tentar alterar um ticket, porque
 *    a única "proteção" era a policy — não o servidor. A Parte 11 exige
 *    autorização real no servidor.
 *
 * Agora toda alteração passa por `/api/admin/directory`, que exige
 * capacidade no servidor, exige JUSTIFICATIVA e grava antes/depois na trilha
 * de auditoria.
 */

interface Ticket {
    id: string;
    title: string;
    status: string;
    priority: string | null;
    user_id: string | null;
    created_at: string;
    updated_at: string | null;
}

const PAGE_SIZE = 25;

const STATUS = ['Aberto', 'Em andamento', 'Resolvido', 'Fechado'];

const PRIORIDADE: Record<string, string> = {
    urgent: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    high: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
    medium: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    low: 'bg-slate-500/10 text-slate-400 border-slate-500/30',
};

export default function AdminTicketsTab() {
    const [rows, setRows] = useState<Ticket[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [debounced, setDebounced] = useState('');
    const [status, setStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [editando, setEditando] = useState<Ticket | null>(null);

    useEffect(() => {
        const t = setTimeout(() => { setDebounced(search.trim()); setPage(0); }, 350);
        return () => clearTimeout(t);
    }, [search]);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const p = new URLSearchParams({
                resource: 'tickets',
                limit: String(PAGE_SIZE),
                offset: String(page * PAGE_SIZE),
                status,
            });
            if (debounced) p.set('q', debounced);

            const res = await fetch(`/api/admin/directory?${p}`, { cache: 'no-store' });
            const json = await res.json();

            if (res.status === 401) { window.location.href = '/login'; return; }
            if (!res.ok) { setError(json?.error ?? 'Não foi possível carregar os tickets.'); return; }

            setRows(json.items ?? []);
            setTotal(json.total ?? 0);
        } catch {
            setError('Falha de rede ao consultar os tickets.');
        } finally {
            setLoading(false);
        }
    }, [page, debounced, status]);

    useEffect(() => { load(); }, [load]);

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

            <div className="flex flex-col gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/50 shadow-sm p-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1">
                    <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Título ou status…"
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 pl-9 pr-3 text-xs text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500"
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    {[{ v: 'all', l: 'Todos' }, ...STATUS.map((s) => ({ v: s, l: s }))].map((f) => (
                        <button key={f.v} onClick={() => { setStatus(f.v); setPage(0); }}
                            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                                status === f.v ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}>
                            {f.l}
                        </button>
                    ))}
                    <button onClick={load} disabled={loading}
                        className="rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 transition hover:bg-slate-700 disabled:opacity-50">
                        <FiRefreshCw size={14} className={loading ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            {error && (
                <div role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4">
                    <ShieldAlert className="mt-0.5 shrink-0 text-rose-400" size={20} />
                    <div className="text-sm">
                        <p className="font-semibold text-rose-300">Não foi possível carregar</p>
                        <p className="text-rose-200/80">{error}</p>
                    </div>
                </div>
            )}

            <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 shadow-sm">
                {loading && rows.length === 0 ? (
                    <div className="flex items-center justify-center gap-3 py-16 text-slate-400">
                        <FiRefreshCw className="animate-spin" size={20} /><span className="text-sm">Carregando…</span>
                    </div>
                ) : rows.length === 0 ? (
                    <div className="py-16 text-center">
                        <FiInbox className="mx-auto mb-3 text-slate-600" size={36} />
                        <p className="text-sm text-slate-400">
                            {debounced || status !== 'all' ? 'Nenhum ticket com estes filtros.' : 'Nenhum ticket registrado.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] text-left text-sm">
                            <thead className="border-b border-slate-800/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Ticket</th>
                                    <th className="px-4 py-3 font-semibold">Prioridade</th>
                                    <th className="px-4 py-3 font-semibold">Status</th>
                                    <th className="px-4 py-3 font-semibold">Aberto em</th>
                                    <th className="px-4 py-3 font-semibold text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/60">
                                {rows.map((r) => (
                                    <tr key={r.id} className="hover:bg-slate-800/30 transition-colors">
                                        <td className="px-4 py-3">
                                            <span className="font-medium text-slate-200">{r.title}</span>
                                            <p className="font-mono text-[10px] text-slate-600">{r.id.slice(0, 8)}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${PRIORIDADE[r.priority ?? 'low'] ?? PRIORIDADE.low}`}>
                                                {r.priority ?? 'low'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-300">{r.status}</td>
                                        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                                            {new Date(r.created_at).toLocaleDateString('pt-BR')}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => setEditando(r)}
                                                className="rounded-full border border-slate-700 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition hover:border-indigo-500 hover:text-indigo-300"
                                            >
                                                Alterar
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
                            <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                                className="rounded-lg bg-slate-800 px-3 py-1.5 font-semibold transition hover:bg-slate-700 disabled:opacity-40">Anterior</button>
                            <button onClick={() => setPage((p) => (p + 1 < totalPages ? p + 1 : p))} disabled={page + 1 >= totalPages}
                                className="rounded-lg bg-slate-800 px-3 py-1.5 font-semibold transition hover:bg-slate-700 disabled:opacity-40">Próxima</button>
                        </div>
                    </div>
                )}
            </div>

            {editando && (
                <StatusModal
                    ticket={editando}
                    onClose={() => setEditando(null)}
                    onSaved={() => { setEditando(null); load(); }}
                />
            )}
        </motion.div>
    );
}

/**
 * Alteração de status COM JUSTIFICATIVA.
 *
 * A justificativa não é burocracia: é o que responde, meses depois, "por que
 * este ticket foi fechado". E a confirmação é exigida no servidor, não só
 * desabilitada no botão.
 */
function StatusModal({ ticket, onClose, onSaved }: { ticket: Ticket; onClose: () => void; onSaved: () => void }) {
    const [novo, setNovo] = useState(ticket.status);
    const [motivo, setMotivo] = useState('');
    const [salvando, setSalvando] = useState(false);

    const salvar = async () => {
        if (motivo.trim().length < 5) {
            toast.error('Justifique a alteração (mínimo 5 caracteres).');
            return;
        }
        setSalvando(true);
        try {
            const res = await fetch('/api/admin/directory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resource: 'tickets',
                    action: 'update_status',
                    id: ticket.id,
                    status: novo,
                    reason: motivo.trim(),
                }),
            });
            const json = await res.json();
            if (!res.ok) { toast.error(json?.error ?? 'Não foi possível alterar.'); return; }
            toast.success('Status atualizado e registrado na auditoria.');
            onSaved();
        } catch {
            toast.error('Falha de rede ao alterar o ticket.');
        } finally {
            setSalvando(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()}
                className="w-full max-w-md rounded-xl border border-slate-700 bg-slate-900 p-6 shadow-2xl">
                <h3 className="mb-1 text-lg font-bold text-slate-100">Alterar status</h3>
                <p className="mb-4 truncate text-xs text-slate-500">{ticket.title}</p>

                <label className="mb-1 block text-xs font-semibold text-slate-400">Novo status</label>
                <select value={novo} onChange={(e) => setNovo(e.target.value)}
                    className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 outline-none focus:border-indigo-500">
                    {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>

                <label className="mb-1 block text-xs font-semibold text-slate-400">Justificativa *</label>
                <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} rows={3}
                    placeholder="Ex.: cliente confirmou que o problema foi resolvido na versão 1.2."
                    className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500" />

                <div className="flex gap-2">
                    <button onClick={onClose}
                        className="flex-1 rounded-xl bg-slate-900/60 border border-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-700">
                        Cancelar
                    </button>
                    <button onClick={salvar} disabled={salvando || novo === ticket.status}
                        className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50">
                        <FiCheckCircle size={15} />
                        {salvando ? 'Salvando…' : 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
    );
}
