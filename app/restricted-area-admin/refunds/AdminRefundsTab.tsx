'use client';

import { useCallback, useEffect, useState } from 'react';
import VoltrisIcon from '@/components/dashboard/VoltrisIcon';
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
    AdminSegmented,
    AdminEmptyState,
    AdminErrorState,
    AdminLoading,
    DASHBOARD_ACCENT,
} from '../_ui';
import { rotulo } from '@/lib/admin-labels';

interface Reembolso {
    id: string;
    status: string | null;
    statusRotulo: string;
    tom: 'ok' | 'aviso' | 'perigo' | 'info' | 'neutro';
    amount: number;
    currency: string;
    reason: string | null;
    source: string | null;
    customerMessage: string | null;
    outcomeMessage: string | null;
    policyBasis: string | null;
    createdAt: string | null;
    resolvedAt: string | null;
    processedAt: string | null;
    stripeChargeId: string | null;
    stripeRefundId: string | null;
    cliente: {
        nome: string | null;
        email: string | null;
        emailCompleto: string | null;
        telefone: string | null;
        login: string | null;
        cidade: string | null;
        uf: string | null;
    };
    compra: {
        id: string;
        referencia: string | null;
        plano: string | null;
        ciclo: string | null;
        valor: number;
        status: string;
        pagoEm: string | null;
        reembolsoEm: string | null;
    } | null;
    licencas: {
        chave: string;
        plano: string | null;
        dispositivos: number | null;
        expiraEm: string | null;
        revogada: boolean | null;
        clienteInterno: string | null;
    }[];
}

const PAGE_SIZE = 25;

function brl(v: number, moeda = 'BRL'): string {
    if (!Number.isFinite(v)) return '—';
    return v.toLocaleString('pt-BR', { style: 'currency', currency: moeda });
}

function data(iso: string | null): string {
    if (!iso) return '—';
    try {
        return new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    } catch {
        return '—';
    }
}

export default function AdminRefundsTab() {
    const [rows, setRows] = useState<Reembolso[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(0);
    const [status, setStatus] = useState('all');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [decidindo, setDecidindo] = useState<string | null>(null);
    const [decisao, setDecisao] = useState<{ id: string; acao: 'approve' | 'reject' } | null>(null);
    const [motivo, setMotivo] = useState('');

    const carregar = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const p = new URLSearchParams();
            p.set('limit', String(PAGE_SIZE));
            p.set('offset', String(page * PAGE_SIZE));
            if (status !== 'all') p.set('status', status);

            const res = await fetch(`/api/admin/refunds?${p.toString()}`, { cache: 'no-store' });
            if (res.status === 401) {
                window.location.href = '/login';
                return;
            }
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || 'Falha ao carregar os reembolsos.');

            setRows(json.items ?? []);
            setTotal(json.total ?? 0);
        } catch (e: any) {
            setError(e?.message || 'Erro ao carregar os reembolsos.');
        } finally {
            setLoading(false);
        }
    }, [page, status]);

    useEffect(() => { void carregar(); }, [carregar]);

    const decidir = async () => {
        if (!decisao) return;
        if (motivo.trim().length < 5) {
            setError('Justifique a decisão (mínimo 5 caracteres).');
            return;
        }
        setDecidindo(decisao.id);
        setError(null);
        try {
            const res = await fetch('/api/admin/refunds', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: decisao.id, action: decisao.acao, reason: motivo.trim() }),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) throw new Error(json?.error || 'Não foi possível decidir a solicitação.');
            setDecisao(null);
            setMotivo('');
            await carregar();
        } catch (e: any) {
            setError(e?.message || 'Erro ao decidir a solicitação.');
        } finally {
            setDecidindo(null);
        }
    };

    const pendentes = rows.filter((r) => r.status === 'requested').length;
    const totalValor = rows.reduce((acc, r) => acc + (Number(r.amount) || 0), 0);

    return (
        <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <AdminStatCard label="Solicitações" value={total} icon="receipt" accent={DASHBOARD_ACCENT.brand}
                    hint="Pedidos de reembolso feitos pelos clientes" />
                <AdminStatCard label="Aguardando" value={pendentes} icon="clock" accent={DASHBOARD_ACCENT.warning}
                    tone={pendentes > 0 ? 'text-amber-400' : 'text-white'} hint="Precisam de decisão do operador" />
                <AdminStatCard label="Em análise (página)" value={brl(totalValor)} icon="creditCard" accent={DASHBOARD_ACCENT.danger}
                    hint="Valor total das solicitações listadas" />
                <AdminStatCard label="Concluídas" value={rows.filter((r) => r.status === 'succeeded').length} icon="success"
                    accent={DASHBOARD_ACCENT.success} hint="Reembolsos já creditados" />
            </div>

            <AdminFilterBar>
                <div className="text-xs text-slate-400">
                    A fila vem do botão <span className="text-slate-200 font-semibold">Reembolso</span> do
                    painel do cliente. Cada linha traz o pedido, a cobrança, a licença e o contato.
                </div>
                <div className="flex items-center gap-2">
                    <AdminSegmented
                        value={status}
                        onChange={(v) => { setStatus(v as string); setPage(0); }}
                        options={[
                            { value: 'all', label: 'Todas' },
                            { value: 'requested', label: 'Aguardando' },
                            { value: 'processing', label: 'Processando' },
                            { value: 'succeeded', label: 'Concluídas' },
                            { value: 'rejected', label: 'Recusadas' },
                        ]}
                    />
                    <AdminButton icon="processing" onClick={carregar} title="Recarregar" aria-label="Recarregar" />
                </div>
            </AdminFilterBar>

            {error && <AdminErrorState message={error} onRetry={carregar} />}

            <AdminCard>
                <AdminCardHeader
                    icon="receipt"
                    accent={DASHBOARD_ACCENT.warning}
                    title="Fila de reembolsos"
                    subtitle="Cada solicitação traz os dados completos do cliente e da compra."
                    actions={<span className="text-[11px] text-slate-500">{rows.length} de {total}</span>}
                />

                {loading && rows.length === 0 ? (
                    <AdminLoading label="Carregando reembolsos…" />
                ) : rows.length === 0 ? (
                    <AdminEmptyState
                        icon="receipt"
                        title="Nenhum reembolso nesta lista"
                        description="Quando um cliente pedir reembolso pelo painel, a solicitação aparece aqui na hora."
                    />
                ) : (
                    <AdminTable minWidth={1100}>
                        <thead>
                            <tr className="border-b border-slate-800/80">
                                <AdminTh>Cliente</AdminTh>
                                <AdminTh>Contato</AdminTh>
                                <AdminTh>Compra</AdminTh>
                                <AdminTh>Licença</AdminTh>
                                <AdminTh>Valor</AdminTh>
                                <AdminTh>Status</AdminTh>
                                <AdminTh className="text-right">Decisão</AdminTh>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60">
                            {rows.map((r) => (
                                <tr key={r.id} className="hover:bg-slate-800/30 transition-colors align-top">
                                    <AdminTd>
                                        <p className="text-xs font-semibold text-white">{r.cliente.nome ?? '—'}</p>
                                        <p className="text-[10px] text-slate-500">pedido em {data(r.createdAt)}</p>
                                        {r.customerMessage && (
                                            <p className="mt-1 max-w-[220px] text-[11px] italic text-slate-400">
                                                “{r.customerMessage}”
                                            </p>
                                        )}
                                    </AdminTd>
                                    <AdminTd>
                                        <p className="text-xs text-slate-300">{r.cliente.email ?? '—'}</p>
                                        <p className="text-[11px] text-slate-400">{r.cliente.telefone ?? 'sem telefone'}</p>
                                        {r.cliente.cidade && (
                                            <p className="text-[10px] text-slate-500">
                                                {r.cliente.cidade}{r.cliente.uf ? ` / ${r.cliente.uf}` : ''}
                                            </p>
                                        )}
                                    </AdminTd>
                                    <AdminTd>
                                        <p className="text-xs font-semibold text-slate-200">
                                            {rotulo(r.compra?.plano, 'plano')}
                                        </p>
                                        <p className="text-[10px] font-mono text-slate-500">{r.compra?.referencia ?? '—'}</p>
                                        <p className="text-[10px] text-slate-500">
                            pago em {data(r.compra?.pagoEm ?? null)}
                                        </p>
                                    </AdminTd>
                                    <AdminTd>
                                        {r.licencas.length === 0 ? (
                                            <span className="text-[11px] text-slate-500">sem licença</span>
                                        ) : (
                                            r.licencas.slice(0, 2).map((l) => (
                                                <p key={l.chave} className="font-mono text-[10px] text-emerald-300">{l.chave}</p>
                                            ))
                                        )}
                                        {r.licencas.length > 0 && (
                                            <p className="text-[10px] text-slate-500">
                                                {r.licencas[0].dispositivos ?? '—'} dispositivos ·
                                                {' '}até {data(r.licencas[0].expiraEm ?? null)}
                                            </p>
                                        )}
                                    </AdminTd>
                                    <AdminTd>
                                        <p className="text-xs font-bold text-white">{brl(r.amount, r.currency)}</p>
                                        {r.compra && (
                                            <p className="text-[10px] text-slate-500">pago: {brl(r.compra.valor)}</p>
                                        )}
                                    </AdminTd>
                                    <AdminTd>
                                        <AdminChip tone={r.tom}>{r.statusRotulo}</AdminChip>
                                        {r.outcomeMessage && (
                                            <p className="mt-1 max-w-[180px] text-[10px] text-slate-500">{r.outcomeMessage}</p>
                                        )}
                                    </AdminTd>
                                    <AdminTd className="text-right">
                                        {r.status === 'requested' ? (
                                            <div className="inline-flex gap-1.5">
                                                <AdminButton
                                                    variante="primario"
                                                    icon="check"
                                                    onClick={() => { setDecisao({ id: r.id, acao: 'approve' }); setMotivo(''); }}
                                                >
                                                    Aprovar
                                                </AdminButton>
                                                <AdminButton
                                                    variante="perigo"
                                                    icon="close"
                                                    onClick={() => { setDecisao({ id: r.id, acao: 'reject' }); setMotivo(''); }}
                                                >
                                                    Recusar
                                                </AdminButton>
                                            </div>
                                        ) : (
                                            <span className="text-[11px] text-slate-500">
                                                {r.processedAt ? `decidido em ${data(r.processedAt)}` : '—'}
                                            </span>
                                        )}
                                    </AdminTd>
                                </tr>
                            ))}
                        </tbody>
                    </AdminTable>
                )}

                {total > PAGE_SIZE && (
                    <div className="flex items-center justify-between gap-3 pt-4 mt-2 border-t border-slate-800/60">
                        <button
                            onClick={() => setPage((p) => Math.max(0, p - 1))}
                            disabled={page === 0}
                            className="px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-40"
                        >
                            Anterior
                        </button>
                        <span className="text-[11px] text-slate-500">
                            Página {page + 1} de {Math.max(1, Math.ceil(total / PAGE_SIZE))}
                        </span>
                        <button
                            onClick={() => setPage((p) => (p + 1) * PAGE_SIZE <= total ? p + 1 : p)}
                            disabled={(page + 1) * PAGE_SIZE >= total}
                            className="px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-40"
                        >
                            Próxima
                        </button>
                    </div>
                )}
            </AdminCard>

            {/* Decisão: aprovação executa o reembolso; recusa registra o motivo. */}
            {decisao && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                    <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <VoltrisIcon
                                name={decisao.acao === 'approve' ? 'success' : 'alertCircle'}
                                size={20}
                                style={{ color: decisao.acao === 'approve' ? DASHBOARD_ACCENT.success : DASHBOARD_ACCENT.danger }}
                            />
                            <h3 className="text-lg font-bold text-white">
                                {decisao.acao === 'approve' ? 'Aprovar reembolso' : 'Recusar reembolso'}
                            </h3>
                        </div>
                        <p className="mt-2 text-xs text-slate-400">
                            {decisao.acao === 'approve'
                                ? 'Aprovando, o valor é devolvido no processador de pagamentos agora. A operação é irreversível.'
                                : 'O cliente recebe a justificativa por notificação.'}
                        </p>
                        <label className="mt-4 mb-1 block text-xs font-semibold text-slate-400">Justificativa *</label>
                        <textarea
                            value={motivo}
                            onChange={(e) => setMotivo(e.target.value)}
                            rows={3}
                            placeholder={decisao.acao === 'approve'
                                ? 'Ex.: solicitação dentro do prazo de 7 dias, comprovada nas mensagens.'
                                : 'Ex.: fora do prazo de 7 dias (art. 49 do CDC).'}
                            className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-200 outline-none placeholder:text-slate-500 focus:border-indigo-500"
                        />
                        <div className="mt-4 flex gap-2">
                            <button
                                onClick={() => { setDecisao(null); setMotivo(''); }}
                                className="flex-1 rounded-xl bg-slate-900/60 border border-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-slate-800"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={decidir}
                                disabled={decidindo === decisao.id}
                                className={`flex-1 flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-50 ${
                                    decisao.acao === 'approve'
                                        ? 'bg-emerald-600 hover:bg-emerald-500'
                                        : 'bg-rose-600 hover:bg-rose-500'
                                }`}
                            >
                                {decidindo === decisao.id ? 'Processando…' : 'Confirmar decisão'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
