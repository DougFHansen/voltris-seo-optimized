'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiRefreshCw, FiUsers, FiX, FiCreditCard } from 'react-icons/fi';
import { ShieldAlert, ChevronDown, ChevronUp } from 'lucide-react';
import VoltrisIcon, { VoltrisIconName } from '@/components/dashboard/VoltrisIcon';
import { rotulo, tomDoStatus, classeDoTom } from '@/lib/admin-labels';

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
    /** Seções que falharam no servidor; o resto continua visível. */
    secoesComFalha?: string[];
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
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/50 shadow-sm p-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative flex-1">
                    <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Nome, e-mail ou login…"
                        className="w-full rounded-xl border border-slate-800 bg-slate-950/60 py-2.5 pl-9 pr-3 text-xs text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500"
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
                        className="rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 transition hover:bg-slate-700 disabled:opacity-50"
                    >
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

            {/* ---------------- Tabela ---------------- */}
            <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 shadow-sm">
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
                            <thead className="border-b border-slate-800/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
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
                            <tbody className="divide-y divide-slate-800/60">
                                {rows.map((c) => (
                                    <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
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
                                                className="rounded-full border border-slate-700 px-2.5 py-1 text-[11px] font-medium text-slate-300 transition hover:border-indigo-500 hover:text-indigo-300"
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
    const [erro, setErro] = useState<string | null>(null);
    const [tab, setTab] = useState<'resumo' | 'compras' | 'licencas' | 'assinaturas' | 'dispositivos' | 'faturas'>('resumo');

    useEffect(() => {
        let alive = true;
        setData(null);
        setErro(null);
        setLoading(true);
        (async () => {
            try {
                const res = await fetch(`/api/admin/clients?detail=${client.id}`, { cache: 'no-store' });
                if (res.status === 401) { window.location.href = '/login'; return; }
                if (!res.ok) {
                    const json = await res.json().catch(() => null);
                    if (alive) setErro(json?.error ?? 'Não foi possível carregar a ficha do cliente.');
                    return;
                }
                const json = await res.json();

                // CONTRATO DA FICHA: { profile, purchases, licenses, ... }.
                // Se o servidor devolver outra coisa (por exemplo, a listagem),
                // NADA é entregue ao render. Era exatamente essa validação que
                // faltava quando `d.profile.login` derrubava a página inteira.
                if (!json || typeof json !== 'object' || !json.profile || typeof json.profile !== 'object') {
                    if (alive) setErro('O servidor respondeu em um formato inesperado. Atualize a página e tente de novo.');
                    return;
                }

                if (alive) {
                    setData({
                        profile: json.profile,
                        purchases: Array.isArray(json.purchases) ? json.purchases : [],
                        licenses: Array.isArray(json.licenses) ? json.licenses : [],
                        subscriptions: Array.isArray(json.subscriptions) ? json.subscriptions : [],
                        devices: Array.isArray(json.devices) ? json.devices : [],
                        invoices: Array.isArray(json.invoices) ? json.invoices : [],
                        adminHistory: Array.isArray(json.adminHistory) ? json.adminHistory : [],
                        secoesComFalha: Array.isArray(json.secoesComFalha) ? json.secoesComFalha : undefined,
                    });
                }
            } catch {
                if (alive) setErro('Falha de rede ao carregar a ficha.');
            } finally {
                if (alive) setLoading(false);
            }
        })();
        return () => { alive = false; };
    }, [client.id]);

    const TABS = [
        { v: 'resumo', l: 'Visão geral', icone: 'person' },
        { v: 'compras', l: 'Compras', icone: 'creditCard' },
        { v: 'licencas', l: 'Licenças', icone: 'license' },
        { v: 'assinaturas', l: 'Assinaturas', icone: 'orders' },
        { v: 'dispositivos', l: 'Dispositivos', icone: 'deviceInfo' },
        { v: 'faturas', l: 'Faturas', icone: 'receipt' },
    ] as const;

    const p = data?.profile;
    const iniciais = String(p?.full_name || client.fullName || '?')
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((parte) => parte.charAt(0).toUpperCase())
        .join('');

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm p-4 pt-10 overflow-y-auto"
            onClick={onClose}
        >
            <motion.div
                initial={{ y: -16, opacity: 0, scale: 0.98 }}
                animate={{ y: 0, opacity: 1, scale: 1 }}
                exit={{ y: -16, opacity: 0, scale: 0.98 }}
                transition={{ type: 'spring', damping: 26, stiffness: 220 }}
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/95 shadow-2xl"
            >
                {/* Cabeçalho — no padrão do dashboard: ladrilho com gradiente, nome e chips */}
                <div className="flex items-start justify-between gap-4 border-b border-slate-800/80 p-5 sm:p-6">
                    <div className="flex items-center gap-4 min-w-0">
                        <div
                            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-base font-bold text-white"
                            style={{
                                background: 'linear-gradient(135deg, #FF4B6B 0%, #8B31FF 55%, #31A8FF 100%)',
                                boxShadow: '0 0 18px rgba(255, 75, 107, 0.35)',
                            }}
                        >
                            {iniciais}
                        </div>
                        <div className="min-w-0">
                            <h3 className="truncate text-lg font-bold tracking-tight text-white">
                                {client.fullName}
                            </h3>
                            <p className="mt-0.5 truncate text-xs text-slate-400">
                                {data?.profile?.email ?? client.emailMasked}
                            </p>
                            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-[11px] font-medium text-indigo-300">
                                    {p?.is_admin ? 'Administrador' : 'Cliente'}
                                </span>
                                <span
                                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                                        p?.is_blocked
                                            ? 'border-rose-500/20 bg-rose-500/10 text-rose-300'
                                            : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                                    }`}
                                >
                                    <span className={`w-1.5 h-1.5 rounded-full ${p?.is_blocked ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                                    {p?.is_blocked ? 'Bloqueado' : 'Ativo'}
                                </span>
                                {p?.created_at && (
                                    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700/60 bg-slate-800/40 px-2.5 py-0.5 text-[11px] font-medium text-slate-400">
                                        Desde {new Date(p.created_at).toLocaleDateString('pt-BR')}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Fechar ficha do cliente"
                        className="shrink-0 rounded-xl border border-slate-800 bg-slate-900/60 p-2 text-slate-400 transition hover:border-slate-700 hover:text-white"
                    >
                        <VoltrisIcon name="close" size={16} />
                    </button>
                </div>

                {/* Abas em pílula — mesmo padrão dos filtros do dashboard */}
                <div className="flex gap-2 overflow-x-auto border-b border-slate-800/80 px-5 py-3 no-scrollbar sm:px-6">
                    {TABS.map((t) => (
                        <button
                            key={t.v}
                            onClick={() => setTab(t.v)}
                            className={`inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-3.5 py-2 text-xs font-semibold transition ${
                                tab === t.v
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                                    : 'bg-slate-900/60 text-slate-400 border border-slate-800/80 hover:bg-slate-800/60 hover:text-slate-200'
                            }`}
                        >
                            <VoltrisIcon name={t.icone} size={14} />
                            {t.l}
                        </button>
                    ))}
                </div>

                {/* Conteúdo */}
                <div className="max-h-[62vh] overflow-y-auto p-5 sm:p-6 custom-scrollbar">
                    {loading ? (
                        <div className="flex items-center justify-center gap-3 py-16 text-slate-400">
                            <VoltrisIcon name="processing" size={18} className="animate-spin" />
                            <span className="text-xs font-medium uppercase tracking-widest">Carregando ficha…</span>
                        </div>
                    ) : erro ? (
                        <div role="alert" className="flex items-start gap-3 rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4">
                            <VoltrisIcon name="alertCircle" size={20} className="mt-0.5 shrink-0 text-rose-400" />
                            <div className="text-sm">
                                <p className="font-semibold text-rose-300">Não foi possível abrir a ficha</p>
                                <p className="mt-0.5 text-xs text-rose-200/80">{erro}</p>
                            </div>
                        </div>
                    ) : !data ? null : (
                        <>
                            {data.secoesComFalha && data.secoesComFalha.length > 0 && (
                                <p role="alert" className="mb-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-[11px] leading-relaxed text-amber-200/90">
                                    Não foi possível carregar: {data.secoesComFalha.join(', ')}. O restante está completo.
                                </p>
                            )}
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
    const txt = (v: unknown) =>
        v === null || v === undefined || String(v).trim() === '' ? 'Não informado' : String(v);

    // Contas antigas foram criadas quando o trigger do banco gravava só
    // nome/e-mail. Em vez de esconder o buraco com "—", dizemos o que falta.
    const faltando = ['login', 'full_name', 'phone', 'address', 'neighborhood', 'city', 'state', 'cep']
        .filter((k) => !p[k] || String(p[k]).trim() === '');

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Mini label="Compras" value={d.purchases.length} icone="creditCard" cor="#00FF94" />
                <Mini label="Licenças" value={d.licenses.length} icone="license" cor="#8B31FF" />
                <Mini label="Dispositivos" value={d.devices.length} icone="deviceInfo" cor="#06B6D4" />
            </div>

            <div className="grid grid-cols-1 gap-x-4 gap-y-3.5 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 sm:grid-cols-2">
                <Field label="Login" value={txt(p.login)} />
                <Field label="E-mail" value={txt(p.email)} />
                <Field label="Nome completo" value={txt(p.full_name)} />
                <Field label="Telefone" value={txt(p.phone)} />
                <Field label="Cadastro" value={p.created_at ? new Date(p.created_at).toLocaleDateString('pt-BR') : 'Não informado'} />
                <Field label="CEP" value={txt(p.cep)} />
                <div className="col-span-1 sm:col-span-2">
                    <Field label="Endereço" value={txt(p.address)} />
                </div>
                <Field label="Bairro" value={txt(p.neighborhood)} />
                <Field label="Cidade / UF" value={[p.city, p.state].filter(Boolean).join(' / ') || 'Não informado'} />
                <Field label="Perfil" value={p.is_admin ? 'Administrador' : 'Cliente'} />
                <Field label="Situação" value={p.is_blocked ? 'Bloqueado' : 'Ativo'} />
            </div>

            {faltando.length > 0 && (
                <p className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-[11px] leading-relaxed text-amber-200/90">
                    Este cadastro está incompleto: {faltando.join(', ')}. Contas criadas antes da
                    correção do formulário podem não ter esses dados — o cliente pode completá-los
                    em “Meu Perfil”.
                </p>
            )}
        </div>
    );
}

function Compras({ rows }: { rows: any[] }) {
    if (!rows.length) return <Vazio texto="Nenhuma compra registrada." icone="creditCard" />;
    return (
        <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50">
            <table className="w-full text-left">
                <thead className="border-b border-slate-800/80 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    <tr>
                        <th className="px-4 py-3">Data</th>
                        <th className="px-4 py-3">Plano</th>
                        <th className="px-4 py-3">Valor</th>
                        <th className="px-4 py-3">Status</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                    {rows.map((r, i) => (
                        <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                            <td className="px-4 py-3 text-xs text-slate-400">
                                {new Date(r.created_at).toLocaleDateString('pt-BR')}
                            </td>
                            <td className="px-4 py-3 text-xs font-semibold text-white">
                                {rotulo(r.plan_type, 'plano')}
                            </td>
                            <td className="px-4 py-3 text-xs text-slate-300">
                                R$ {Number(r.amount ?? 0).toFixed(2)}
                            </td>
                            <td className="px-4 py-3">
                                <StatusBadge status={r.status} dominio="pagamento" />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function Licencas({ rows }: { rows: any[] }) {
    if (!rows.length) return <Vazio texto="Nenhuma licença emitida." icone="license" />;
    return (
        <div className="space-y-2">
            {rows.map((r, i) => (
                <div key={i} className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4">
                    <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-xs font-semibold text-emerald-300">{r.license_key}</span>
                        <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${
                                r.revoked
                                    ? 'border-rose-500/20 bg-rose-500/10 text-rose-300'
                                    : 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300'
                            }`}
                        >
                            <span className={`w-1.5 h-1.5 rounded-full ${r.revoked ? 'bg-rose-400' : 'bg-emerald-400'}`} />
                            {r.revoked ? 'Revogada' : 'Ativa'}
                        </span>
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500">
                        {rotulo(r.plan_type, 'plano')} · vence {r.expires_at ? new Date(r.expires_at).toLocaleDateString('pt-BR') : '—'}
                        {r.client_id ? ` · cliente ${String(r.client_id).slice(0, 8)}` : ''}
                    </p>
                </div>
            ))}
        </div>
    );
}

function Dispositivos({ rows }: { rows: any[] }) {
    if (!rows.length) return <Vazio texto="Nenhum dispositivo vinculado." icone="deviceInfo" />;
    return (
        <div className="space-y-2">
            {rows.map((r, i) => (
                <div key={i} className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 text-xs">
                    <p className="font-semibold text-white">{r.machine_name ?? r.device_name ?? 'Dispositivo'}</p>
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
    if (!rows.length) return <Vazio texto="Nenhuma fatura disponível para compras confirmadas." icone="receipt" />;
    return (
        <div className="space-y-2">
            <p className="text-[11px] text-slate-500">
                A fatura é gerada a partir da compra confirmada, pelo mesmo gerador usado pelo cliente.
            </p>
            {rows.map((r, i) => (
                <div key={i} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                        <VoltrisIcon name="receipt" size={14} className="text-slate-500 shrink-0" />
                        <span className="text-slate-300 truncate">{r.reference_id}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                        <span className="text-slate-300">R$ {Number(r.amount ?? 0).toFixed(2)}</span>
                        <StatusBadge status={r.status} dominio="pagamento" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function Simples({ rows, vazio }: { rows: any[]; vazio: string }) {
    if (!rows.length) return <Vazio texto={vazio} icone="orders" />;
    return (
        <div className="space-y-2">
            {rows.map((r, i) => (
                <div key={i} className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 text-xs">
                    <div className="flex items-center justify-between gap-3">
                        <p className="font-semibold text-white">
                            {rotulo(r.plan_type, 'plano')}
                            <span className="ml-2 font-normal text-slate-500">{rotulo(r.billing_period, 'ciclo')}</span>
                        </p>
                        <StatusBadge status={r.status} dominio="assinatura" />
                    </div>
                    <p className="mt-2 text-[11px] text-slate-500">
                        Próxima cobrança {r.next_billing_at ? new Date(r.next_billing_at).toLocaleDateString('pt-BR') : '—'}
                    </p>
                </div>
            ))}
        </div>
    );
}

function StatusBadge({ status, dominio }: { status: string | null | undefined; dominio?: 'pagamento' | 'assinatura' }) {
    const tom = tomDoStatus(status);
    return (
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${classeDoTom(tom)}`}>
            {rotulo(status, dominio ?? 'pagamento')}
        </span>
    );
}

function Field({ label, value }: { label: string; value: string }) {
    return (
        <div className="min-w-0">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</p>
            <p className="mt-0.5 break-words text-xs font-semibold text-slate-200">{value}</p>
        </div>
    );
}

function Mini({ label, value, icone, cor }: { label: string; value: number; icone: VoltrisIconName; cor: string }) {
    return (
        <div className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4">
            <div className="flex items-center justify-between gap-3">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">{label}</span>
                <span
                    className="flex h-8 w-8 items-center justify-center rounded-xl"
                    style={{
                        backgroundColor: `color-mix(in srgb, ${cor} 10%, transparent)`,
                        border: `1px solid color-mix(in srgb, ${cor} 20%, transparent)`,
                    }}
                >
                    <VoltrisIcon name={icone} size={15} style={{ color: cor }} />
                </span>
            </div>
            <p className="mt-2 text-2xl font-bold tracking-tight text-white">{value}</p>
        </div>
    );
}

function Vazio({ texto, icone }: { texto: string; icone: VoltrisIconName }) {
    return (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-slate-800/80 bg-slate-900/50 py-12 text-center">
            <VoltrisIcon name={icone} size={26} className="text-slate-600" />
            <p className="text-xs text-slate-500">{texto}</p>
        </div>
    );
}
