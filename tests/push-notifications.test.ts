/**
 * WEB PUSH — notificação com o site fechado.
 *
 * O que estava quebrado: o botão "ativar notificações" pedia a permissão do
 * navegador e registrava o service worker — e NÃO assinava o Web Push. O
 * usuário achava que tinha ativado; o aviso com o app fechado nunca chegava.
 *
 * Estes testes travam o fluxo real (permissão -> service worker -> inscrição ->
 * gravação no servidor), a segurança da chave privada e o clique da
 * notificação levando para a tela certa.
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const cliente = readFileSync('lib/push-client.ts', 'utf8');
const contexto = readFileSync('components/notifications/NotificationContext.tsx', 'utf8');
const componente = readFileSync('components/notifications/NotificationActivation.tsx', 'utf8');
const servico = readFileSync('services/notificationService.ts', 'utf8');
const chaves = readFileSync('lib/vapid-keys.ts', 'utf8');
const sw = readFileSync('public/sw.js', 'utf8');
const rota = readFileSync('app/api/push-subscription/route.ts', 'utf8');
const dashboard = readFileSync('app/dashboard/notifications/NotificationsClient.tsx', 'utf8');
const admin = readFileSync('app/restricted-area-admin/page.tsx', 'utf8');
const sino = readFileSync('components/notifications/NotificationDropdown.tsx', 'utf8');
const adminTab = readFileSync('app/restricted-area-admin/notifications/AdminNotificationsTab.tsx', 'utf8');

describe('o fluxo de ativação é real', () => {
    test('o cliente pede a permissão, registra o service worker e assina o push', () => {
        assert.match(cliente, /Notification\.requestPermission\(\)/);
        assert.match(cliente, /navigator\.serviceWorker\.register\('\/sw\.js'/);
        assert.match(cliente, /pushManager\.subscribe\(\{/);
        assert.match(cliente, /applicationServerKey/);
    });

    test('a inscrição é gravada no servidor (que descobre o usuário pelo token)', () => {
        assert.match(cliente, /\/api\/push-subscription/);
        assert.match(cliente, /credentials: 'same-origin'/);
        // O servidor NUNCA aceita user_id do navegador.
        assert.match(rota, /getUser\(\)/);
        assert.ok(
            !/body\.user_id|user_id:\s*body/.test(rota),
            'o user_id da inscrição não pode vir do corpo da requisição'
        );
    });

    test('o service worker é registrado na raiz (exigência do iOS)', () => {
        assert.match(cliente, /scope: '\/'/);
    });

    test('o contexto usa o fluxo completo, não só a permissão', () => {
        assert.match(contexto, /ativarPush/);
        assert.match(contexto, /lerEstadoPush/);
    });

    test('existe UM componente de ativação, usado no dashboard e no admin', () => {
        assert.match(dashboard, /NotificationActivation/);
        assert.match(admin, /NotificationActivation/);
        assert.match(componente, /Ativar agora/);
        assert.match(componente, /Testar/);
    });

    test('o componente explica as situações reais (iOS, permissão negada, VAPID ausente)', () => {
        assert.match(componente, /Tela de Início/);
        assert.match(componente, /permissão foi negada/i);
        // O estado do push no SERVIDOR é consultado: o navegador pode estar
        // pronto e o servidor não (falta VAPID_PRIVATE_KEY no ambiente).
        assert.match(componente, /\/api\/notifications\/push-status/);
        assert.match(componente, /motivoServidor/);
    });

    test('a rota de status do push diz se a chave privada existe (sem vazar segredo)', () => {
        const status = readFileSync('app/api/notifications/push-status/route.ts', 'utf8');
        assert.match(status, /chavePrivadaVapid\(\)/);
        assert.match(status, /privadoConfigurado/);
        assert.ok(
            !/chavePrivada:\s*privado/.test(status),
            'a chave privada não pode ser devolvida na resposta'
        );
    });
});

describe('a notificação vista não volta a aparecer', () => {
    test('o que já estava no banco quando a tela abriu não toca som nem abre toast', () => {
        // Defeito real: ao entrar no dashboard, a notificação antiga tocava o
        // som e abria o toast de novo — era o "ficar aparecendo" relatado.
        assert.match(contexto, /idsJaCarregados/);
        assert.match(contexto, /idsJaCarregados\.current\.has\(latest\.id\)/);
    });

    test('o que o usuário vê é marcado como visto (sino e admin)', () => {
        assert.match(contexto, /marcarVistas/);
        assert.match(contexto, /marcarComoLidaNoServidor/);
        // sino do site
        assert.match(sino, /marcarVistas/);
        // central do dashboard
        assert.match(dashboard, /marcarVistas/);
        // aba de notificações do admin
        assert.match(adminTab, /read: true/);
    });
});

describe('segurança das chaves VAPID', () => {
    test('a chave privada vem SEMPRE do ambiente', () => {
        assert.match(servico, /process\.env\.VAPID_PRIVATE_KEY/);
        assert.match(chaves, /process\.env\.VAPID_PRIVATE_KEY/);
    });

    test('a chave privada não está em nenhum arquivo versionado', () => {
        const privado = (process.env.VAPID_PRIVATE_KEY || '').trim();
        if (!privado) return; // sem chave local, nada a varrer
        const varrer = (dir: string): string[] => {
            const achados: string[] = [];
            for (const e of readdirSync(dir)) {
                if (e === 'node_modules' || e === '.next' || e === '.git') continue;
                const p = join(dir, e);
                if (statSync(p).isDirectory()) achados.push(...varrer(p));
                else if (/\.(ts|tsx|js|mjs|json|md|txt|sql)$/.test(p)) {
                    if (readFileSync(p, 'utf8').includes(privado)) achados.push(p);
                }
            }
            return achados;
        };
        const achados = varrer('.').filter((p) => !p.includes('.env'));
        assert.deepEqual(achados, [], `chave privada VAPID versionada em: ${achados.join(', ')}`);
    });
});

describe('o aviso chega e o clique leva para a tela certa', () => {
    test('o service worker trata o evento push e mostra a notificação', () => {
        assert.match(sw, /addEventListener\('push'/);
        assert.match(sw, /showNotification\(data\.title/);
    });

    test('o clique abre o destino da notificação (não sempre a home)', () => {
        assert.match(sw, /notificationclick/);
        assert.match(sw, /url: data\.url \|\| '\/'/);
        assert.match(sw, /client\.navigate\(destino\)/);
    });

    test('o servidor manda o destino no push', () => {
        assert.match(servico, /url: options\.actionUrl \|\| '\/'/);
    });
});
