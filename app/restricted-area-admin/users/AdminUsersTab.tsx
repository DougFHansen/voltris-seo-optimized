'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ShieldAlert } from 'lucide-react';
import { FiSearch, FiRefreshCw, FiUsers, FiDownload } from 'react-icons/fi';

/**
 * ABA LEGADA — LEITURA MOVIDA PARA O SERVIDOR.
 *
 * O QUE MUDOU E POR QUÊ
 * ---------------------
 * Esta aba lia `profiles` com o cliente do navegador e a chave `anon`. Isso
 * significa que a lista dependia de uma policy RLS existir para o papel do
 * usuário: se faltasse, a tela vinha VAZIA e sem nenhuma mensagem de erro —
 * era impossível distinguir "não há clientes" de "a consulta foi bloqueada".
 *
 * Agora a leitura passa por `/api/admin/directory`, que usa `service_role` no
 * servidor (ignora RLS) e exige a capacidade `clients.read`. Duas
 * consequências: a aba não depende de policy nenhuma, e o e-mail chega
 * MASCARADO, o que evita vazar a base inteira por um bundle do navegador.
 *
 * O que NÃO mudou: a lista continua sendo de CLIENTES. Para ver quem PAGOU,
 * com data e valor, a aba é "Compras".
 */

interface UserRow {
    id: string;
    login: string | null;
    email: string;
    full_name: string | null;
    phone: string | null;
    city: string | null;
    state: string | null;
    is_admin: boolean;
    role: string | null;
    is_blocked: boolean;
    created_at: string;
}

const PAGE_SIZE = 25;

export default function AdminUsersTab() {
    const [rows, setRows] = useState<UserRow[]>([]);
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
                resource: 'users',
                limit: String(PAGE_SIZE),
                offset: String(page * PAGE_SIZE),
            });
            if (debounced) p.set('q', debounced);

            const res = await fetch(`/api/admin/directory?${p}`, { cache: 'no-store' });
            const json = await res.json();

            if (res.status === 401) { window.location.href = '/login'; return; }
            if (!res.ok) { setError(json?.error ?? 'Não foi possível carregar os usuários.'); return; }

            setRows(json.items ?? []);
            setTotal(json.total ?? 0);
        } catch {
            setError('Falha de rede ao consultar os usuários.');
        } finally {
            setLoading(false);
        }
    }, [page, debounced]);

    useEffect(() => { load(); }, [load]);

    const exportar = () => {
        const head = ['Nome', 'Email (mascarado)', 'Telefone', 'Cidade', 'UF', 'Admin', 'Bloqueado', 'Cadastro'];
        const linhas = rows.map((r) => [
            (r.full_name ?? r.login ?? '').replace(/"/g, '""'),
            r.email,
            (r.phone ?? '').replace(/"/g, '""'),
            r.city ?? '', r.state ?? '',
            r.is_admin ? 'sim' : 'não',
            r.is_blocked ? 'sim' : 'não',
            new Date(r.created_at).toLocaleDateString('pt-BR'),
        ].map((v) => `"${v}"`).join(';'));

        // BOM no inicio: sem isso o Excel abre o CSV em latin-1 e os acentos
        // viram lixo -- exatamente o tipo de bug "sem mensagem de erro".
        const blob = new Blob(['﻿' + [head.join(';'), ...linhas].join('\n')],
            { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `voltris-usuarios-${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        toast.success(`Exportados ${rows.length} usuário(s) desta página.`);
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
                        placeholder="Nome, e-mail, login ou telefone…"
                        className="w-full rounded-lg border border-slate-700 bg-slate-800/80 py-2 pl-9 pr-3 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={exportar}
                        disabled={rows.length === 0}
                        className="flex items-center gap-2 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-700 disabled:opacity-40"
                    >
                        <FiDownload size={14} /> Exportar
                    </button>
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
                        <button onClick={load} className="mt-2 text-xs font-semibold text-rose-300 underline">Tentar de novo</button>
                    </div>
                </div>
            )}

            <div className="overflow-hidden rounded-xl border border-slate-700/60 bg-slate-900/60">
                {loading && rows.length === 0 ? (
                    <div className="flex items-center justify-center gap-3 py-16 text-slate-400">
                        <FiRefreshCw className="animate-spin" size={20} />
                        <span className="text-sm">Carregando usuários…</span>
                    </div>
                ) : rows.length === 0 ? (
                    <div className="py-16 text-center">
                        <FiUsers className="mx-auto mb-3 text-slate-600" size={36} />
                        <p className="text-sm text-slate-400">
                            {debounced ? 'Nenhum usuário encontrado com esta busca.' : 'Nenhum usuário cadastrado.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[860px] text-left text-sm">
                            <thead className="border-b border-slate-700/60 text-xs uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-4 py-3 font-semibold">Nome</th>
                                    <th className="px-4 py-3 font-semibold">E-mail</th>
                                    <th className="px-4 py-3 font-semibold">Telefone</th>
                                    <th className="px-4 py-3 font-semibold">Local</th>
                                    <th className="px-4 py-3 font-semibold">Perfil</th>
                                    <th className="px-4 py-3 font-semibold">Cadastro</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {rows.map((r) => (
                                    <tr key={r.id} className="hover:bg-slate-800/40">
                                        <td className="px-4 py-3 font-medium text-slate-200">{r.full_name ?? r.login ?? '—'}</td>
                                        <td className="px-4 py-3 font-mono text-xs text-slate-400">{r.email}</td>
                                        <td className="px-4 py-3 text-xs text-slate-400">{r.phone ?? '—'}</td>
                                        <td className="px-4 py-3 text-xs text-slate-400">
                                            {r.city ? `${r.city}${r.state ? ` / ${r.state}` : ''}` : '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex flex-wrap gap-1">
                                                {r.is_admin && (
                                                    <span className="rounded bg-violet-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-violet-300">
                                                        {r.role ?? 'admin'}
                                                    </span>
                                                )}
                                                {r.is_blocked && (
                                                    <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-rose-300">
                                                        bloqueado
                                                    </span>
                                                )}
                                                {!r.is_admin && !r.is_blocked && <span className="text-xs text-slate-600">cliente</span>}
                                            </div>
                                        </td>
                                        <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                                            {new Date(r.created_at).toLocaleDateString('pt-BR')}
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
