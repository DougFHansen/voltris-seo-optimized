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

/**
 * Limite de tempo para cada etapa.
 *
 * Sem isto, uma promessa que nunca resolve (o caso real: `serviceWorker.ready`
 * quando o service worker não ativa) deixa o botão em "Ativando..." para
 * sempre, sem mensagem. Nenhuma etapa do fluxo pode ficar pendurada.
 */
const TIMEOUT_PERMISSAO = 60_000;
const TIMEOUT_ETAPA = 20_000;

function comTimeout<T>(p: Promise<T>, ms: number, mensagem: string): Promise<T> {
    return Promise.race([
        p,
        new Promise<T>((_, reject) => setTimeout(() => reject(new Error(mensagem)), ms)),
    ]);
}

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

/**
 * Chave pública VAPID em uso no servidor.
 *
 * O servidor pode estar com a chave no ambiente OU com o par derivado
 * deterministicamente (ver `lib/vapid-server.ts`). O cliente pergunta ao
 * servidor em vez de confiar numa constante do bundle: assim o navegador
 * assina sempre com a chave que o servidor usa.
 */
export async function obterChavePublicaVapid(): Promise<string> {
    try {
        const r = await fetch('/api/notifications/push-status', { cache: 'no-store' });
        if (r.ok) {
            const j = await r.json();
            if (j?.chavePublica) return j.chavePublica as string;
        }
    } catch { /* sem rede: cai no valor local */ }
    return chaveVapidPublica();
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
        const reg = await comTimeout(
            navigator.serviceWorker.register('/sw.js', { scope: '/' }),
            TIMEOUT_ETAPA,
            'O registro do service worker demorou demais para responder.'
        );
        // `ready` só resolve com um service worker ATIVO. Se ele não ativar
        // (erro no sw.js, extensão, política do navegador), a promessa fica
        // pendurada para sempre — era o que travava o botão em "Ativando...".
        await comTimeout(
            navigator.serviceWorker.ready,
            TIMEOUT_ETAPA,
            'O service worker não ativou. Recarregue a página e tente de novo.'
        );
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
            const sub = await comTimeout(
                reg.pushManager.getSubscription(),
                TIMEOUT_ETAPA,
                'Não foi possível ler a inscrição de push.'
            ).catch(() => null);
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
        const permissao = await comTimeout(
            Notification.requestPermission(),
            TIMEOUT_PERMISSAO,
            'A confirmação do navegador demorou demais. Tente novamente.'
        );
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

        const chavePublica = await obterChavePublicaVapid();
        if (!chavePublica) {
            return { ok: false, estado, erro: 'O servidor não disponibilizou a chave VAPID. O aviso com o site fechado está indisponível.' };
        }

        const sub = await comTimeout(
            reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: base64ParaUint8Array(chavePublica) as unknown as BufferSource,
            }),
            TIMEOUT_ETAPA,
            'O navegador não conseguiu assinar as notificações push.'
        );

        const info = collectBrowserInfo();
        const resposta = await comTimeout(
            fetch('/api/push-subscription', {
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
        }), TIMEOUT_ETAPA, 'O servidor demorou demais para gravar a inscrição.');

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

/**
 * Teste REAL do sistema de notificações.
 *
 * Antes isso só mostrava um aviso local do navegador — o painel não mudava
 * e não dava para saber se o Web Push (aviso com o site fechado) funcionava.
 * Agora o botão:
 *
 *   1. pede ao servidor uma notificação de teste (que entra na lista in-app);
 *   2. dispara o Web Push para os dispositivos inscritos do usuário;
 *   3. mostra o aviso local do navegador (resposta imediata);
 *   4. devolve o que aconteceu ("2 dispositivos avisados") para a interface
 *      mostrar a verdade — nunca um "deu certo" sem prova.
 */
export async function testarPush(): Promise<{
    ok: boolean;
    erro?: string;
    mensagem?: string;
    dispositivos?: number;
}> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
        return { ok: false, erro: 'Este navegador não suporta notificações.' };
    }
    if (Notification.permission !== 'granted') {
        return {
            ok: false,
            erro:
                'A permissão de notificações ainda não foi concedida. Libere as notificações nas configurações do navegador e recarregue a página.',
        };
    }

    // 1) Notificação de verdade no sistema (in-app + Web Push).
    let resposta: {
        ok: boolean;
        erro?: string;
        mensagem?: string;
        dispositivos?: number;
    } = {
        ok: false,
    };
    try {
        const r = await comTimeout(
            fetch('/api/notifications/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
            }),
            TIMEOUT_ETAPA,
            'O servidor demorou demais para responder ao teste.'
        );
        const j = await r.json().catch(() => ({}));
        resposta = {
            ok: !!j?.ok,
            erro: j?.erro,
            mensagem: j?.mensagem,
            dispositivos: j?.push?.enviados,
        };
    } catch (e: any) {
        resposta = { ok: false, erro: e?.message ?? 'Falha ao testar as notificações.' };
    }

    // 2) Aviso local do navegador (resposta imediata, sem esperar o servidor).
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
    } catch {
        // O aviso local é um extra: se o navegador recusar, o teste no
        // servidor (que é o que importa) continua valendo.
    }

    if (!resposta.ok) {
        return {
            ok: false,
            erro: resposta.erro ?? 'Não foi possível enviar a notificação de teste.',
            dispositivos: resposta.dispositivos,
        };
    }
    return {
        ok: true,
        mensagem: resposta.mensagem ?? 'Notificação de teste enviada.',
        dispositivos: resposta.dispositivos ?? 0,
    };
}
