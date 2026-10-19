'use client';

import { useCallback, useEffect, useState } from 'react';
import VoltrisIcon, { VoltrisIconName } from '@/components/dashboard/VoltrisIcon';
import {
    AdminCard,
    AdminCardHeader,
    AdminStatCard,
    AdminTable,
    AdminTh,
    AdminTd,
    AdminChip,
    AdminButton,
    AdminFilterBar,
    AdminSearch,
    AdminSegmented,
    AdminEmptyState,
    AdminErrorState,
    AdminLoading,
    DASHBOARD_ACCENT,
} from '../_ui';
import { ICONE_POR_TIPO, ROTULO_POR_TIPO, COR_POR_TIPO } from '@/lib/notification-kinds';

interface Notificacao {
    id: string;
    user_id: string;
    title: string;
    message: string;
    type: string;
    read: boolean;
    sound: string;
    created_at: string;
    action_url?: string | null;
    data?: Record<string, unknown> | null;
    audience?: string | null;
    destinatario?: { nome: string | null; email: string | null; admin: boolean } | null;
}

interface Resposta {
    items: Notificacao[];
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
    resumo?: { porTipo: Record<string, number>; naoLidas: number; total: number };
}

const TIPOS_FILTRO = [
    { value: '', label: 'Todos' },
    { value: 'order', label: 'Compras' },
    { value: 'license', label: 'Licenças' },
    { value: 'service', label: 'Serviços' },
    { value: 'ticket', label: 'Tickets' },
    { value: 'refund', label: 'Reembolsos' },
    { value: 'system', label: 'Sistema' },
] as const;

function formatarData(iso: string): string {
    try {
        return new Date(iso).toLocaleString('pt-BR', {
            day: '2-digit', month: '2-digit', year: '2-digit',
            hour: '2-digit', minute: '2-digit',
        });
    } catch {
        return '—';
    }
}

export default function AdminNotificationsTab() {
    const [dados, setDados] = useState<Resposta | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState<string | null>(null);
    const [tipo, setTipo] = useState<string>('');
    const [leitura, setLeitura] = useState<'todos' | 'nao-lidas' | 'lidas'>('todos');
    const [busca, setBusca] = useState('');
    const [pagina, setPagina] = useState(0);
    const [atualizando, setAtualizando] = useState(false);

    const limite = 25;

    const carregar = useCallback(async () => {
        setCarregando(true);
        setErro(null);
        try {
            const params = new URLSearchParams();
            params.set('limit', String(limite));
            params.set('offset', String(pagina * limite));
            if (tipo) params.set('type', tipo);
            if (leitura === 'nao-lidas') params.set('read', '0');
            if (leitura === 'lidas') params.set('read', '1');
            if (busca.trim()) params.set('q', busca.trim());

            const res = await fetch(`/api/admin/notifications?${params.toString()}`, { cache: 'no-store' });
            if (res.status === 401) {
                window.location.href = '/login';
                return;
            }
            const json = await res.json();
            if (!res.ok) {
                throw new Error(json?.error || 'Falha ao carregar as notificações.');
            }
            setDados(json);

            // O que o operador viu, ele leu: as notificações exibidas na
            // aba são marcadas como lidas, para não reaparecerem a cada
            // entrada no painel.
            const visiveis = (json.items ?? []).filter((n: { read?: boolean }) => !n.read).slice(0, 20);
            for (const n of visiveis) {
                void fetch('/api/admin/notifications', {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: n.id, read: true }),
                }).catch(() => undefined);
            }
        } catch (e: any) {
            setErro(e?.message || 'Erro desconhecido.');
            setDados(null);
        } finally {
            setCarregando(false);
        }
    }, [tipo, leitura, busca, pagina]);

    useEffect(() => {
        const t = setTimeout(() => { carregar(); }, busca ? 350 : 0);
        return () => clearTimeout(t);
    }, [carregar, busca]);

    const marcarLida = async (id: string, read: boolean) => {
        setAtualizando(true);
        try {
            const res = await fetch('/api/admin/notifications', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, read }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || 'Não foi possível atualizar.');
            setDados((prev) => prev
                ? { ...prev, items: prev.items.map((n) => (n.id === id ? { ...n, read } : n)) }
                : prev
            );
        } catch (e: any) {
            setErro(e?.message || 'Não foi possível atualizar a notificação.');
        } finally {
            setAtualizando(false);
        }
    };

    const abrir = (n: Notificacao) => {
        if (n.action_url) {
            window.location.href = n.action_url;
            return;
        }
        // Sem `action_url` (schema antigo), leva para a aba mais provável.
        const destinoPorTipo: Record<string, string> = {
            order: '/restricted-area-admin?tab=purchases',
            license: '/restricted-area-admin?tab=purchases',
            service: '/restricted-area-admin?tab=orders',
            ticket: '/restricted-area-admin?tab=tickets',
            refund: '/restricted-area-admin?tab=purchases',
        };
        window.location.href = destinoPorTipo[n.type] ?? '/restricted-area-admin?tab=overview';
    };

    const total = dados?.resumo?.total ?? dados?.total ?? 0;
    const naoLidas = dados?.resumo?.naoLidas ?? 0;

    return (
        <div className="space-y-6">
            {/* Indicadores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <AdminStatCard
                    label="Notificações"
                    value={total}
                    icon="inbox"
                    accent={DASHBOARD_ACCENT.brand}
                    hint="Registros no sino do sistema"
                />
                <AdminStatCard
                    label="Não lidas"
                    value={naoLidas}
                    icon="bell"
                    accent={DASHBOARD_ACCENT.warning}
                    tone={naoLidas > 0 ? 'text-amber-400' : 'text-white'}
                    hint="Precisam de atenção do operador"
                />
                <AdminStatCard
                    label="Compras e Licenças"
                    value={(dados?.resumo?.porTipo?.order ?? 0) + (dados?.resumo?.porTipo?.license ?? 0)}
                    icon="creditCard"
                    accent={DASHBOARD_ACCENT.success}
                    hint="Transações que entraram"
                />
                <AdminStatCard
                    label="Suporte"
                    value={(dados?.resumo?.porTipo?.ticket ?? 0)}
                    icon="support"
                    accent={DASHBOARD_ACCENT.brandPink}
                    hint="Tickets abertos e respondidos"
                />
            </div>

            {/* Filtros */}
            <AdminFilterBar>
                <AdminSearch
                    value={busca}
                    onChange={(v) => { setBusca(v); setPagina(0); }}
                    placeholder="Buscar por título, mensagem ou tipo…"
                />
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <AdminSegmented
                        value={tipo}
                        onChange={(v) => { setTipo(v as string); setPagina(0); }}
                        options={TIPOS_FILTRO.map((t) => ({ value: t.value as string, label: t.label }))}
                    />
                    <AdminSegmented
                        value={leitura}
                        onChange={(v) => { setLeitura(v as any); setPagina(0); }}
                        options={[
                            { value: 'todos', label: 'Todas' },
                            { value: 'nao-lidas', label: 'Não lidas' },
                            { value: 'lidas', label: 'Lidas' },
                        ]}
                    />
                    <AdminButton icon="processing" onClick={carregar} title="Recarregar" aria-label="Recarregar" />
                </div>
            </AdminFilterBar>

            {erro && <AdminErrorState message={erro} onRetry={carregar} />}

            {/* Lista */}
            <AdminCard>
                <AdminCardHeader
                    icon="bell"
                    accent={DASHBOARD_ACCENT.brand}
                    title="Central de notificações"
                    subtitle="Tudo o que aconteceu na operação: compras, pedidos, tickets e reembolsos."
                    actions={
                        <span className="text-[11px] text-slate-500">
                            {dados ? `${dados.items.length} de ${dados.total}` : '—'}
                        </span>
                    }
                />

                {carregando && !dados ? (
                    <AdminLoading label="Carregando notificações…" />
                ) : !dados?.items?.length ? (
                    <AdminEmptyState
                        icon="bell"
                        title="Nenhuma notificação por aqui"
                        description="Quando houver compra, pedido, ticket ou reembolso, tudo aparece nesta lista em tempo real."
                    />
                ) : (
                    <AdminTable minWidth={920}>
                        <thead>
                            <tr className="border-b border-slate-800/80">
                                <AdminTh>Evento</AdminTh>
                                <AdminTh>Destinatário</AdminTh>
                                <AdminTh>Tipo</AdminTh>
                                <AdminTh>Quando</AdminTh>
                                <AdminTh className="text-right">Ação</AdminTh>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60/60">
                            {dados.items.map((n) => {
                                const icone = (ICONE_POR_TIPO[n.type] ?? 'info') as VoltrisIconName;
                                const cor = COR_POR_TIPO[n.type] ?? DASHBOARD_ACCENT.brand;
                                const dest = n.destinatario;
                                return (
                                    <tr
                                        key={n.id}
                                        className="group hover:bg-slate-800/30 transition-colors cursor-pointer"
                                        onClick={() => abrir(n)}
                                    >
                                        <AdminTd>
                                            <div className="flex items-start gap-3">
                                                <span
                                                    className="mt-0.5 shrink-0 flex items-center justify-center w-8 h-8 rounded-xl"
                                                    style={{
                                                        backgroundColor: `color-mix(in srgb, ${cor} 10%, transparent)`,
                                                        border: `1px solid color-mix(in srgb, ${cor} 20%, transparent)`,
                                                    }}
                                                >
                                                    <VoltrisIcon name={icone} size={15} style={{ color: cor }} />
                                                </span>
                                                <div className="min-w-0">
                                                    <p className="text-xs font-semibold text-white tracking-tight">
                                                        {n.title}
                                                    </p>
                                                    <p className="text-[10px] font-medium text-slate-400 mt-0.5 line-clamp-2">
                                                        {n.message}
                                                    </p>
                                                </div>
                                            </div>
                                        </AdminTd>
                                        <AdminTd>
                                            <p className="text-xs font-semibold text-slate-200 truncate">
                                                {dest?.nome || '—'}
                                            </p>
                                            <p className="text-[10px] text-slate-500 font-mono">
                                                {dest?.email || 'sem e-mail'}
                                            </p>
                                        </AdminTd>
                                        <AdminTd>
                                            <AdminChip tone={n.audience === 'admin' ? 'info' : 'neutro'}>
                                                {ROTULO_POR_TIPO[n.type] ?? n.type}
                                            </AdminChip>
                                        </AdminTd>
                                        <AdminTd className="whitespace-nowrap text-[11px] text-slate-400">
                                            {formatarData(n.created_at)}
                                        </AdminTd>
                                        <AdminTd className="text-right">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    marcarLida(n.id, !n.read);
                                                }}
                                                disabled={atualizando}
                                                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium transition disabled:opacity-40 ${
                                                    n.read
                                                        ? 'bg-slate-500/10 border-slate-500/20 text-slate-400 hover:text-slate-200'
                                                        : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 hover:text-indigo-300'
                                                }`}
                                            >
                                                <VoltrisIcon name={n.read ? 'check' : 'eye'} size={12} />
                                                {n.read ? 'Lida' : 'Marcar lida'}
                                            </button>
                                        </AdminTd>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </AdminTable>
                )}

                {/* Paginação */}
                {dados && (dados.total > limite || pagina > 0) && (
                    <div className="flex items-center justify-between gap-3 pt-4 mt-2 border-t border-slate-800/60">
                        <button
                            onClick={() => setPagina((p) => Math.max(0, p - 1))}
                            disabled={pagina === 0}
                            className="px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-40"
                        >
                            Anterior
                        </button>
                        <span className="text-[11px] text-slate-500">
                            Página {pagina + 1} de {Math.max(1, Math.ceil(dados.total / limite))}
                        </span>
                        <button
                            onClick={() => setPagina((p) => p + 1)}
                            disabled={!dados.hasMore}
                            className="px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-40"
                        >
                            Próxima
                        </button>
                    </div>
                )}
            </AdminCard>
        </div>
    );
}
