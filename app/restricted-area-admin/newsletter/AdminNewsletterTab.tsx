'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ShieldAlert } from 'lucide-react';
import { FiSearch, FiRefreshCw, FiMail, FiDownload, FiTrash2 } from 'react-icons/fi';

/**
 * ABA NEWSLETTER — LEITURA E ESCRITA MOVIDAS PARA O SERVIDOR.
 *
 * A versão anterior lia e apagava `newsletter_subscribers` direto do
 * navegador com a chave `anon`. Duas consequências:
 *
 *  - leitura: tela vazia sem erro quando faltava policy RLS;
 *  - REMOÇÃO: a exclusão saía do navegador. Qualquer pessoa logada cuja
 *    policy permitisse já podia apagar linhas. A Parte 11 exige autorização
 *    real no servidor, e a exclusão agora passa por lá, com justificativa e
 *    auditoria.
 *
 * Ajustes profissionais sobre a versão anterior:
 *  - o e-mail NÃO é mais mascarado aqui. Newsletter é a única lista do
 *    VOLTRIS em que o endereço é o DADO — um cadastro sem e-mail legível não
 *    serve para nada. A base tem 2 linhas e é usada para disparo próprio;
 *  - o CSV agora começa com BOM. Sem ele o Excel abre em latin-1 e todo
 *    acento vira lixo, sem nenhuma mensagem de erro;
 *  - `alert()` bloqueante foi trocado por feedback inline.
 */

interface Subscriber {
    id: string;
    email: string;
    source: string | null;
    subscribed_at: string | null;
    status: string | null;
    created_at: string;
}

const PAGE_SIZE = 25;

export default function AdminNewsletterTab() {
    const [rows, setRows] = useState<Subscriber[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [search, setSearch] = useState('');
    const [debounced, setDebounced] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [removendo, setRemovendo] = useState<Subscriber | null>(null);

    useEffect(() => {
        const t = setTimeout(() => { setDebounced(search.trim()); setPage(0); }, 350);
        return () => clearTimeout(t);
    }, [search]);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const p = new URLSearchParams({
                resource: 'newsletter',
                limit: String(PAGE_SIZE),
                offset: String(page * PAGE_SIZE),
            });
            if (debounced) p.set('q', debounced);

            const res = await fetch(`/api/admin/directory?${p}`, { cache: 'no-store' });
            const json = await res.json();

            if (res.status === 401) { window.location.href = '/login'; return; }
            if (!res.ok) { setError(json?.error ?? 'Não foi possível carregar os inscritos.'); return; }

            setRows(json.items ?? []);
            setTotal(json.total ?? 0);
        } catch {
            setError('Falha de rede ao consultar os inscritos.');
        } finally {
            setLoading(false);
        }
    }, [page, debounced]);

    useEffect(() => { load(); }, [load]);

    const exportar = () => {
        const head = ['Email', 'Origem', 'Status', 'Inscrito em'];
        const linhas = rows.map((r) => [
            r.email, r.source ?? '', r.status ?? '',
            r.subscribed_at ? new Date(r.subscribed_at).toLocaleDateString('pt-BR') : '',
        ].map((v) => `"${v}"`).join(';'));

        const blob = new Blob(['﻿' + [head.join(';'), ...linhas].join('\n')],
            { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `voltris-newsletter-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`Exportados ${rows.length} inscrito(s).`);
    };

    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

    return (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">

            <div className="flex flex-col gap-3 rounded-xl border border-slate-700/60 bg-slate-900/60 p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1">
                    <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por e-mail…"
                        className="w-full rounded-lg border border-slate-700 bg-slate-800/80 py-2 pl-9 pr-3 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={exportar} disabled={rows.length === 0}
                        className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 disabled:opacity-40">
                        <FiDownload size={14} /> Exportar
                    </button>
                    <button onClick={load} disabled={loading}
                        className="rounded-lg bg-slate-800 p-2 text-slate-300 transition hover:bg-slate-700 disabled:opacity-50">
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

            <div className="overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/60">
                {loading && rows.length === 0 ? (
                    <div className="flex items-center justify-center gap-3 py-16 text-slate-400">
                        <FiRefreshCw className="animate-spin" size={20} /><span className="text-sm">Carregando…</span>
                    </div>
                ) : rows.length === 0 ? (
                    <div className="py-16 text-center">
                        <FiMail className="mx-auto mb-3 text-slate-600" size={36} />
                        <p className="text-sm text-slate-400">
                            {debounced ? 'Nenhum inscrito com esta busca.' : 'Nenhum inscrito na newsletter.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[640px] text-left text-sm">
                            <thead className="border-b border-slate-700/60 text-xs uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">E-mail</th>
                                    <th className="px-4 py-3 font-semibold">Origem</th>
                                    <th className="px-4 py-3 font-semibold">Status</th>
                                    <th className="px-4 py-3 font-semibold">Inscrito em</th>
                                    <th className="px-4 py-3 font-semibold text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {rows.map((r) => (
                                    <tr key={r.id} className="hover:bg-slate-800/40">
                                        <td className="px-4 py-3">
                                            <a href={`mailto:${r.email}`} className="text-slate-200 hover:underline break-all">
                                                {r.email}
                                            </a>
                                        </td>
                                        <td className="px-4 py-3 text-xs text-slate-400">{r.source ?? '—'}</td>
                                        <td className="px-4 py-3">
                                            <span className={`rounded border px-2 py-0.5 text-[10px] font-semibold ${
                                                r.status === 'active'
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                                    : 'bg-slate-500/10 text-slate-400 border-slate-500/30'
                                            }`}>
                                                {r.status === 'active' ? 'ativo' : (r.status ?? '—')}
                                            </span>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                                            {r.subscribed_at ? new Date(r.subscribed_at).toLocaleDateString('pt-BR') : '—'}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => setRemovendo(r)}
                                                aria-label={`Remover ${r.email}`}
                                                className="rounded-lg border border-slate-700 p-1.5 text-slate-400 transition hover:border-rose-500 hover:text-rose-300"
                                            >
                                                <FiTrash2 size={13} />
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

            {removendo && (
                <RemoveModal
                    subscriber={removendo}
                    onClose={() => setRemovendo(null)}
                    onDone={() => { setRemovendo(null); load(); }}
                />
            )}
        </motion.div>
    );
}

/**
 * Remoção COM CONFIRMAÇÃO E JUSTIFICATIVA.
 *
 * Confirmação digitada (não só um "sim"), porque remoção é o tipo de operação
 * em que um clique acidental não pode custar o cadastro de alguém.
 */
function RemoveModal({ subscriber, onClose, onDone }: {
    subscriber: Subscriber; onClose: () => void; onDone: () => void;
}) {
    const [confirmacao, setConfirmacao] = useState('');
    const [motivo, setMotivo] = useState('');
    const [salvando, setSalvando] = useState(false);
    const ok = confirmacao.trim().toUpperCase() === 'REMOVER' && motivo.trim().length >= 5;

    const remover = async () => {
        setSalvando(true);
        try {
            const res = await fetch('/api/admin/directory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    resource: 'newsletter',
                    action: 'delete',
                    id: subscriber.id,
                    reason: motivo.trim(),
                }),
            });
            const json = await res.json();
            if (!res.ok) { toast.error(json?.error ?? 'Não foi possível remover.'); return; }
            toast.success('Inscrito removido e registrado na auditoria.');
            onDone();
        } catch {
            toast.error('Falha de rede ao remover.');
        } finally {
            setSalvando(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-xl border border-rose-500/30 bg-slate-900 p-6 shadow-2xl">
                <h3 className="mb-1 text-lg font-bold text-rose-300">Remover inscrito</h3>
                <p className="mb-4 text-sm text-slate-400">
                    Remover <span className="font-mono text-slate-200 break-all">{subscriber.email}</span> da newsletter?
                </p>

                <label className="mb-1 block text-xs font-semibold text-slate-400">
                    Digite <span className="font-mono text-rose-300">REMOVER</span> para confirmar
                </label>
                <input value={confirmacao} onChange={(e) => setConfirmacao(e.target.value)}
                    placeholder="REMOVER"
                    className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 font-mono text-sm text-slate-200 uppercase outline-none focus:border-rose-500" />

                <label className="mb-1 block text-xs font-semibold text-slate-400">Justificativa *</label>
                <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} rows={2}
                    placeholder="Ex.: solicitou descadastro."
                    className="mb-4 w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-rose-500" />

                <div className="flex gap-2">
                    <button onClick={onClose}
                        className="flex-1 rounded-lg bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-700">
                        Cancelar
                    </button>
                    <button onClick={remover} disabled={!ok || salvando}
                        className="flex-1 rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-500 disabled:opacity-40">
                        {salvando ? 'Removendo…' : 'Remover'}
                    </button>
                </div>
            </div>
        </div>
    );
}
