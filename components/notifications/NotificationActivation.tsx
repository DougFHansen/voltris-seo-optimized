'use client';

import { useCallback, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import VoltrisIcon from '@/components/dashboard/VoltrisIcon';
import { DASHBOARD_ACCENT } from '@/components/dashboard/VoltrisIconTile';
import {
    ativarPush,
    cancelarPush,
    lerEstadoPush,
    testarPush,
    type EstadoPush,
} from '@/lib/push-client';

/**
 * ATIVAÇÃO DE NOTIFICAÇÕES — um só componente para o cliente e para o admin.
 *
 * Antes existiam DOIS modais diferentes (um no dashboard, outro no contexto
 * global) e nenhum dos dois assinava o Web Push: a permissão era pedida, o
 * service worker era registrado e nada acontecia. O usuário achava que estava
 * ativado; a notificação com o site fechado nunca chegava.
 *
 * Aqui o fluxo é real e o estado é lido do navegador:
 *   1. permissão do navegador;
 *   2. service worker registrado na raiz;
 *   3. inscrição de Web Push (chave VAPID) gravada no servidor;
 *   4. botão de teste que mostra uma notificação de verdade.
 *
 * Quando falta configuração no servidor, a tela DIZ que falta — não finge.
 */

type Fase = 'carregando' | 'inativo' | 'ativo' | 'erro';

export default function NotificationActivation({ compacto = false }: { compacto?: boolean }) {
    const [estado, setEstado] = useState<EstadoPush | null>(null);
    const [servidorPronto, setServidorPronto] = useState<boolean | null>(null);
    const [motivoServidor, setMotivoServidor] = useState<string | null>(null);
    const [fase, setFase] = useState<Fase>('carregando');
    const [erro, setErro] = useState<string | null>(null);
    const [aviso, setAviso] = useState<string | null>(null);
    const [ocupado, setOcupado] = useState(false);

    const recarregar = useCallback(async () => {
        const e = await lerEstadoPush();
        setEstado(e);
        setFase(e.inscrito && e.permissao === 'granted' ? 'ativo' : 'inativo');
        // O navegador pode estar pronto e o servidor nao: so o servidor sabe.
        try {
            const r = await fetch('/api/notifications/push-status', { cache: 'no-store' });
            if (r.ok) {
                const j = await r.json();
                setServidorPronto(j?.disponivel === true);
                setMotivoServidor(j?.motivo ?? null);
            }
        } catch { setServidorPronto(null); }
        return e;
    }, []);

    useEffect(() => {
        void recarregar();
    }, [recarregar]);

    const ativar = async () => {
        setOcupado(true);
        setErro(null);
        const r = await ativarPush();
        setEstado(r.estado);
        setOcupado(false);
        if (r.ok) {
            setFase('ativo');
            return;
        }
        setFase('erro');
        setErro(r.erro || 'Não foi possível ativar as notificações.');
    };

    const desativar = async () => {
        setOcupado(true);
        await cancelarPush();
        await recarregar();
        setOcupado(false);
    };

    const testar = async () => {
        setOcupado(true);
        setErro(null);
        setAviso(null);
        const r = await testarPush();
        setOcupado(false);
        if (!r.ok) {
            setErro(r.erro || 'Não foi possível enviar a notificação de teste.');
            return;
        }
        // O que o usuário precisa ver: que o teste rodou e quantos
        // dispositivos foram avisados de verdade.
        const dispositivos = r.dispositivos ?? 0;
        setAviso(
            dispositivos > 0
                ? `${r.mensagem ?? 'Notificação de teste enviada.'} Confira também o sino de notificações do painel.`
                : `${r.mensagem ?? 'Notificação de teste registrada no painel.'} Se o aviso não aparecer com o site fechado, clique em “Desativar” e depois em “Ativar agora” para refazer a inscrição.`
        );
        // A lista de notificações do painel atualiza na hora (não espera o
        // polling de 45s nem depender do Realtime).
        try {
            window.dispatchEvent(new CustomEvent('voltris:notificacoes:recarregar'));
        } catch { /* ambiente sem window */ }
        await recarregar();
    };

    if (fase === 'carregando' || !estado) {
        return (
            <div className={`rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 ${compacto ? '' : 'flex items-center gap-3'}`}>
                <VoltrisIcon name="processing" size={18} className="animate-spin text-slate-500" />
                <span className="text-xs text-slate-500">Verificando o estado das notificações…</span>
            </div>
        );
    }

    const ativo = fase === 'ativo';
    const bloqueado = estado.permissao === 'denied';
    const semVapid = !estado.vapidConfigurado || servidorPronto === false;

    return (
        <div
            className={`rounded-2xl border p-5 transition-colors ${
                ativo
                    ? 'border-emerald-500/25 bg-emerald-500/5'
                    : bloqueado || semVapid
                        ? 'border-amber-500/25 bg-amber-500/5'
                        : 'border-slate-800/80 bg-slate-900/50'
            }`}
        >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                    <span
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                        style={{
                            backgroundColor: `color-mix(in srgb, ${ativo ? DASHBOARD_ACCENT.success : DASHBOARD_ACCENT.warning} 12%, transparent)`,
                            border: `1px solid color-mix(in srgb, ${ativo ? DASHBOARD_ACCENT.success : DASHBOARD_ACCENT.warning} 25%, transparent)`,
                        }}
                    >
                        <VoltrisIcon
                            name="bell"
                            size={20}
                            style={{ color: ativo ? DASHBOARD_ACCENT.success : DASHBOARD_ACCENT.warning }}
                        />
                    </span>
                    <div>
                        <h3 className="text-sm font-bold text-white">
                            {ativo ? 'Notificações ativas' : 'Ativar notificações'}
                        </h3>
                        <p className="mt-0.5 text-xs text-slate-400">
                            {ativo
                                ? 'Você recebe avisos de compra, licença, suporte e reembolso — mesmo com o site fechado.'
                                : 'Receba avisos de compra, licença, suporte e reembolso — mesmo com o site fechado.'}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                    {ativo ? (
                        <>
                            <button
                                onClick={testar}
                                disabled={ocupado}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900/60 border border-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
                            >
                                <VoltrisIcon name="bell" size={14} />
                                Testar
                            </button>
                            <button
                                onClick={desativar}
                                disabled={ocupado}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-400 transition hover:border-rose-500/40 hover:text-rose-300 disabled:opacity-50"
                            >
                                <VoltrisIcon name="close" size={14} />
                                Desativar
                            </button>
                        </>
                    ) : (
                        <motion.button
                            onClick={ativar}
                            disabled={ocupado || bloqueado}
                            whileTap={{ scale: 0.97 }}
                            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
                        >
                            <VoltrisIcon name={ocupado ? 'processing' : 'bell'} size={14} className={ocupado ? 'animate-spin' : ''} />
                            {ocupado ? 'Ativando…' : 'Ativar agora'}
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Situações reais que exigem explicação — nada de erro genérico. */}
            {aviso && !erro && (
                <p role="status" className="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-[11px] leading-relaxed text-emerald-200">
                    {aviso}
                </p>
            )}
            {erro && (
                <p role="alert" className="mt-3 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[11px] leading-relaxed text-rose-200">
                    {erro}
                </p>
            )}
            {semVapid && !erro && (
                <p className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] leading-relaxed text-amber-200">
                    {motivoServidor ?? 'O servidor ainda não tem a chave VAPID configurada.'}{' '}
                    Sem isso o navegador não consegue receber aviso com o site fechado — as notificações
                    dentro do site continuam funcionando normalmente.
                </p>
            )}
            {bloqueado && !erro && (
                <p className="mt-3 rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[11px] leading-relaxed text-amber-200">
                    A permissão foi negada neste navegador. Libere as notificações nas configurações do
                    site (ícone do cadeado, ao lado da barra de endereço) e recarregue a página.
                </p>
            )}
            {estado.ios && !estado.inscrito && (
                <p className="mt-3 rounded-xl border border-slate-700/60 bg-slate-800/40 px-3 py-2 text-[11px] leading-relaxed text-slate-300">
                    No iPhone e no iPad, o aviso com o app fechado só funciona depois de adicionar o
                    site à <strong className="text-slate-200">Tela de Início</strong> (Safari → Compartilhar →
                    Adicionar à Tela de Início). Depois, volte aqui e toque em “Ativar agora”.
                </p>
            )}
        </div>
    );
}
