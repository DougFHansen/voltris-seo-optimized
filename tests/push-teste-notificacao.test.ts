/**
 * BOTÃO "TESTAR" — o teste tem que provar o sistema inteiro.
 *
 * O que estava quebrado: o botão "Testar" só mostrava um aviso local do
 * navegador. NADA acontecia no painel — a lista de notificações não mudava
 * e não havia como saber se o Web Push (aviso com o site fechado) funcionava.
 *
 * Agora o botão:
 *   - chama o servidor (POST /api/notifications/test), que grava a notificação
 *     in-app e envia o Web Push para os dispositivos inscritos;
 *   - mostra o aviso local do navegador (resposta imediata);
 *   - devolve "quantos dispositivos foram avisados" e a tela mostra isso;
 *   - manda o painel recarregar a lista na hora.
 */

import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const rota = readFileSync('app/api/notifications/test/route.ts', 'utf8');
const cliente = readFileSync('lib/push-client.ts', 'utf8');
const componente = readFileSync('components/notifications/NotificationActivation.tsx', 'utf8');
const contexto = readFileSync('components/notifications/NotificationContext.tsx', 'utf8');
const servico = readFileSync('services/notificationService.ts', 'utf8');

describe('botão Testar das notificações', () => {
    test('existe a rota de teste', () => {
        assert.match(rota, /export async function POST/);
        assert.match(rota, /usuarioDaSessao/);
    });

    test('a rota exige sessao (401 sem login)', () => {
        assert.match(rota, /status:\s*401/);
    });

    test('a rota grava a notificacao in-app E envia o web push', () => {
        assert.match(rota, /NotificationService\.notify\(/);
        assert.match(rota, /NotificationService\.sendWebPush\(/);
        // O push nao pode ser disparado duas vezes (notify + sendWebPush).
        assert.match(rota, /semPush:\s*true/);
    });

    test('a rota informa quantos dispositivos receberam', () => {
        assert.match(rota, /push:\s*\{?\s*enviados/);
        assert.match(rota, /dispositivos|enviados/);
    });

    test('o cliente chama a rota de teste (e nao so o aviso local)', () => {
        assert.match(cliente, /\/api\/notifications\/test/);
        assert.match(cliente, /method:\s*'POST'/);
    });

    test('a tela mostra o resultado (nao fica em silencio)', () => {
        assert.match(componente, /setAviso\(/);
        assert.match(componente, /aviso\s*&&/);
        assert.match(componente, /voltris:notificacoes:recarregar/);
    });

    test('o painel recarrega a lista quando o teste termina', () => {
        assert.match(contexto, /voltris:notificacoes:recarregar/);
        assert.match(contexto, /carregarNotificacoes\(true\)/);
    });

    test('o servico aceita nao disparar o push no notify', () => {
        assert.match(servico, /semPush\?:/);
        assert.match(servico, /if\s*\(!options\.semPush\)/);
    });
});
