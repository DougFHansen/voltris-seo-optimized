/**
 * POST /api/extension/diagnostics/test
 *
 * O TESTE CONTROLADO DO SISTEMA DE DIAGNÓSTICOS.
 *
 * NÃO É UM BOTÃO PÚBLICO.
 *
 * A rota só existe com o token de administração do AMBIENTE, e sem ele
 * devolve 404 — o mesmo que qualquer rota inexistente devolve. Não há
 * botão na interface pública que dispare isto, e não há como o token ser
 * adivinhado: ele não está em nenhum arquivo versionado.
 *
 * O que ele faz: monta um evento MARCADO como teste, com o texto
 * "VOLTRIS SHIELD — TEST EVENT", sem nenhum dado de usuário, e o manda
 * para o MESMO caminho que os eventos reais percorrem. No grupo, ele
 * aparece com a marca 🧪, para nunca ser confundido com um incidente.
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendSyntheticTestToTelegram } from '@/services/extensionDiagnostics';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 10;

export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'content-type, x-diagnostics-token',
            'Access-Control-Max-Age': '86400',
        },
    });
}

export async function POST(request: NextRequest) {
    // O INTERRUPTOR GLOBAL vale aqui também: com ele ligado, nem o teste
    // manual chega ao grupo.
    if (process.env.DIAGNOSTICS_FORWARDING_DISABLED === '1') {
        return NextResponse.json(
            { ok: false, error: 'forwarding_disabled' },
            { status: 503, headers: { 'Access-Control-Allow-Origin': '*' } }
        );
    }

    const adminToken = (process.env.DIAGNOSTICS_ADMIN_TOKEN || '').trim();
    const provided = (request.headers.get('x-diagnostics-token') || '').trim();

    // Sem o token configurado, a rota NÃO EXISTE. Sem o token certo, a
    // rota NÃO EXISTE. A mesma resposta nos dois casos, e a mesma de uma
    // URL inventada: 404.
    if (!adminToken || provided !== adminToken) {
        return NextResponse.json(
            { ok: false, error: 'not_found' },
            { status: 404, headers: { 'Access-Control-Allow-Origin': '*' } }
        );
    }

    const result = await sendSyntheticTestToTelegram();

    if (!result.ok) {
        return NextResponse.json(
            { ok: false, error: result.error },
            { status: result.error === 'telegram_not_configured' ? 503 : 502, headers: { 'Access-Control-Allow-Origin': '*' } }
        );
    }

    return NextResponse.json(
        { ok: true, messageId: result.messageId ?? null },
        { status: 200, headers: { 'Access-Control-Allow-Origin': '*' } }
    );
}
