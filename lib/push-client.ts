'use client';

/**
 * WEB PUSH (notificação com o site fechado) — lado do cliente.
 *
 * Este é o caminho que faz a notificação chegar quando a aba está fechada:
 * o navegador assina o Web Push com a chave VAPID do servidor e o service
 * worker exibe a notificação. Sem isso, só existe a notificação in-app.
 *
 * Regras que o código respeita:
 *  - a inscrição é SEMPRE do usuário da sessão (o `user_id` vem do token, no
 *    servidor — nunca do navegador);
 *  - o estado real é lido do navegador (permissão, inscrição, service worker);
 *  - quando falta configuração (chave VAPID), o sistema DIZ que falta, em vez
 *    de fingir que está ativado.
 */

import { VAPID_PUBLIC_KEY_PADRAO } from '@/lib/vapid-keys';
import {
    collectBrowserInfo,
    detectDeviceType,
    detectPlatform,
    generateBrowserFingerprint,
    supportsPushNotifications,
} from '@/app/utils/browserFingerprint';

export interface EstadoPush {
    /** O navegador tem Web Push + Service Worker. */
    suportado: boolean;
    /** Permissão do navegador: granted / denied / default / unsupported. */
    permissao: NotificationPermission | 'unsupported';
    /** A chave pública VAPID está configurada no ambiente. */
    vapidConfigurado: boolean;
    /** Já existe uma inscrição de push neste navegador. */
    inscrito: boolean;
    /** Service worker registrado e ativo. */
    serviceWorker: boolean;
    /** Navegador em celular/tablet. */
    mobile: boolean;
    /** iOS: só entrega push quando o app está na tela de início. */
    ios: boolean;
}

export function chaveVapidPublica(): string {
    // A chave publica esta versionada (e publica por design); o ambiente
    // sobrescreve quando existe.
    return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || VAPID_PUBLIC_KEY_PADRAO;
}

function base64ParaUint8Array(base64: string): Uint8Array {
    const pad = '='.repeat((4 - (base64.length % 4)) % 4);
    const raw = atob((base64 + pad).replace(/-/g, '+').replace(/_/g, '/'));
    const out = new Uint8Array(raw.length);
    for (let i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
}

export function ehIOS(): boolean {
    if (typeof navigator === 'undefined') return false;
    const ua = navigator.userAgent;
    return /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && 'ontouchend' in document);
}

/** Registra o service worker (raiz do escopo, obrigatório para push no iOS). */
export async function registrarServiceWorker(): Promise<ServiceWorkerRegistration | null> {
    if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) return null;
    try {
        const reg = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
        await navigator.serviceWorker.ready;
        return reg;
    } catch (e) {
        console.warn('[push] não foi possível registrar o service worker:', e);
        return null;
    }
}

/** Lê o estado REAL do push neste navegador. */
export async function lerEstadoPush(): Promise<EstadoPush> {
    const base: EstadoPush = {
        suportado: typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator,
        permissao: typeof window !== 'undefined' && 'Notification' in window
            ? Notification.permission
            : 'unsupported',
        vapidConfigurado: !!chaveVapidPublica(),
        inscrito: false,
        serviceWorker: false,
        mobile: typeof navigator !== 'undefined'
            ? detectDeviceType() !== 'desktop'
            : false,
        ios: ehIOS(),
    };
    if (!base.suportado) return base;

    try {
        const reg = await navigator.serviceWorker.getRegistration('/');
        base.serviceWorker = !!reg;
        if (reg && 'pushManager' in reg) {
            const sub = await reg.pushManager.getSubscription();
            base.inscrito = !!sub;
        }
    } catch { /* segue com o estado parcial */ }
    return base;
}

/**
 * Ativa o push: permissão -> service worker -> inscrição -> gravação.
 * Devolve o estado final e o erro (se houver) — nada de "sucesso" falso.
 */
export async function ativarPush(): Promise<{ ok: boolean; estado: EstadoPush; erro?: string }> {
    const estado = await lerEstadoPush();
    if (!estado.suportado) {
        return { ok: false, estado, erro: 'Este navegador não suporta notificações push.' };
    }
    if (!estado.vapidConfigurado) {
        return {
            ok: false,
            estado,
            erro: 'O servidor ainda não tem a chave VAPID configurada (NEXT_PUBLIC_VAPID_PUBLIC_KEY).',
        };
    }
    if (estado.ios && !estado.inscrito) {
        // iOS entrega push apenas em app instalado na tela de início; o
        // service worker só existe nesse contexto.
        const standalone = window.matchMedia?.('(display-mode: standalone)')?.matches
            || (navigator as unknown as { standalone?: boolean }).standalone === true;
        if (!standalone) {
            return {
                ok: false,
                estado,
                erro: 'No iPhone/iPad o push só funciona com o app adicionado à Tela de Início. Adicione e volte aqui.',
            };
        }
    }

    try {
        const permissao = await Notification.requestPermission();
        if (permissao !== 'granted') {
            return {
                ok: false,
                estado: { ...estado, permissao },
                erro: permissao === 'denied'
                    ? 'A permissão foi negada. Libere as notificações nas configurações do navegador.'
                    : 'A permissão não foi concedida.',
            };
        }

        const reg = await registrarServiceWorker();
        if (!reg || !('pushManager' in reg)) {
            return { ok: false, estado, erro: 'Não foi possível registrar o service worker.' };
        }

        const sub = await reg.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: base64ParaUint8Array(chaveVapidPublica()) as unknown as BufferSource,
        });

        const info = collectBrowserInfo();
        const resposta = await fetch('/api/push-subscription', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            body: JSON.stringify({
                subscription: sub.toJSON(),
                browserInfo: {
                    browserFingerprint: generateBrowserFingerprint(),
                    userAgent: navigator.userAgent,
                    platform: detectPlatform(),
                    deviceType: detectDeviceType(),
                    language: info.language,
                },
            }),
        });

        if (!resposta.ok) {
            const erro = await resposta.json().catch(() => ({}));
            return {
                ok: false,
                estado,
                erro: erro?.message || 'Não foi possível gravar a inscrição de push.',
            };
        }

        const final = await lerEstadoPush();
        return { ok: true, estado: final };
    } catch (e: any) {
        return { ok: false, estado, erro: e?.message || 'Falha ao ativar as notificações push.' };
    }
}

/** Cancela a inscrição (o servidor marca como inativa no DELETE). */
export async function cancelarPush(): Promise<{ ok: boolean; erro?: string }> {
    try {
        const reg = await navigator.serviceWorker.getRegistration('/');
        const sub = await reg?.pushManager?.getSubscription();
        if (sub) {
            await fetch('/api/push-subscription', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ endpoint: sub.endpoint }),
            });
            await sub.unsubscribe();
        }
        return { ok: true };
    } catch (e: any) {
        return { ok: false, erro: e?.message || 'Não foi possível cancelar as notificações.' };
    }
}

/** Teste real: mostra uma notificação pelo próprio navegador. */
export async function testarPush(): Promise<{ ok: boolean; erro?: string }> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
        return { ok: false, erro: 'Este navegador não suporta notificações.' };
    }
    if (Notification.permission !== 'granted') {
        return { ok: false, erro: 'A permissão de notificações ainda não foi concedida.' };
    }
    try {
        const reg = await registrarServiceWorker();
        const opcoes: NotificationOptions & { renotify?: boolean } = {
            body: 'Se você viu isso, as notificações estão funcionando no seu navegador.',
            icon: '/logo-v2.webp',
            badge: '/logo.png',
            tag: 'voltris-teste',
            requireInteraction: true,
        };
        if (reg) {
            await reg.showNotification('VOLTRIS — teste', opcoes as never);
        } else {
            new Notification('VOLTRIS — teste', opcoes);
        }
        return { ok: true };
    } catch (e: any) {
        return { ok: false, erro: e?.message || 'O navegador recusou a notificação de teste.' };
    }
}
