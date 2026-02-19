import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Definir o schema de validação
const heartbeatSchema = z.object({
    session_id: z.string().uuid(),
    machine_id: z.string(), // Aceitar string genérica para machine_id (compatibilidade)
    status: z.enum(['active', 'idle', 'closed']).optional(),
    health_score: z.number().min(0).max(100).optional(),
    event: z.object({
        event_type: z.string(),
        feature_name: z.string().optional(),
        action_name: z.string().optional(),
        metadata: z.record(z.any()).optional(),
    }).optional().nullable(), // Permitir null/undefined explicitamente
});

export async function POST(req: NextRequest) {
    console.log('[API/HEARTBEAT] Recebendo heartbeat...');

    try {
        const body = await req.json();
        
        // Log para debug (seguro, sem dados sensíveis)
        console.log(`[API/HEARTBEAT] Payload recebido Sessão: ${body.session_id}, Maquina: ${body.machine_id}`);

        // Validação Zod
        const result = heartbeatSchema.safeParse(body);

        if (!result.success) {
            console.error('[API/HEARTBEAT] Erro de validação Zod:', JSON.stringify(result.error.format(), null, 2));
            return NextResponse.json({ 
                error: 'Invalid payload', 
                details: result.error.format() 
            }, { status: 400 });
        }

        const { session_id, machine_id, status, health_score, event } = result.data;

        // Configuração do Supabase
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!supabaseUrl || !serviceRoleKey) {
            console.error('[API/HEARTBEAT] ERRO CRÍTICO: Variáveis de ambiente do Supabase não configuradas (SUPABASE_SERVICE_ROLE_KEY faltando?)');
            return NextResponse.json({ 
                error: 'Server misconfiguration', 
                message: 'Database credentials missing check if SUPABASE_SERVICE_ROLE_KEY is set.' 
            }, { status: 500 });
        }

        const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
            auth: {
                autoRefreshToken: false,
                persistSession: false
            }
        });

        // 1. Verificar se a sessão existe
        const { data: session, error: sessionError } = await supabaseAdmin
            .from('sessions')
            .select('id, device_id')
            .eq('id', session_id)
            .single();

        if (sessionError || !session) {
            console.warn(`[API/HEARTBEAT] Sessão não encontrada: ${session_id}. Erro: ${sessionError?.message}`);
            return NextResponse.json({ error: 'Session not found or expired' }, { status: 404 });
        }

        // 2. Atualizar heartbeat da sessão e métricas
        const updateData: any = {
            last_heartbeat_at: new Date().toISOString(),
        };

        if (status) {
            updateData.status = status;
            if (status === 'closed') {
                updateData.ended_at = new Date().toISOString();
            }
        }

        if (health_score !== undefined) {
            updateData.health_score = health_score;
        }

        const { error: updateError } = await supabaseAdmin
            .from('sessions')
            .update(updateData)
            .eq('id', session_id);

        if (updateError) {
            console.error(`[API/HEARTBEAT] Erro ao atualizar sessão: ${updateError.message}`);
        }

        // 3. Registrar evento de telemetria (se houver e não for nulo)
        if (event && event.event_type) {
            console.log(`[API/HEARTBEAT] Registrando evento: ${event.event_type}`);
            
            const { error: eventError } = await supabaseAdmin
                .from('telemetry_events')
                .insert({
                    session_id: session_id,
                    device_id: session.device_id,  // CORREÇÃO: Adicionar device_id para JOIN funcionar
                    event_type: event.event_type,
                    feature_name: event.feature_name || 'System',
                    action_name: event.action_name || 'Heartbeat',
                    success: event.success !== undefined ? event.success : true,
                    duration_ms: event.duration_ms || 0,
                    error_code: event.error_code || null,
                    metadata: event.metadata || {},
                    created_at: new Date().toISOString()
                });

            if (eventError) {
                console.error(`[API/HEARTBEAT] Erro ao inserir evento: ${eventError.message}`);
            } else {
                console.log(`[API/HEARTBEAT] Evento registrado com sucesso: ${event.event_type} (device_id: ${session.device_id})`);
            }
        }

        // 4. Atualizar health check da instalação (Dispositivo)
        // Isso garante que o dashboard mostre o status "Online" corretamente
        if (machine_id) {
             const { error: deviceError } = await supabaseAdmin
                .from('installations') // Assumindo que a tabela de dispositivos é 'installations' baseado no código anterior
                .update({ 
                    last_heartbeat: new Date().toISOString()
                })
                .eq('id', machine_id); // Atualiza pelo ID da máquina
                
             if (deviceError) {
                 console.error(`[API/HEARTBEAT] Erro ao atualizar instalação: ${deviceError.message}`);
             } else {
                 // console.log(`[API/HEARTBEAT] Instalação ${machine_id} atualizada.`);
             }
        }

        return NextResponse.json({ success: true, timestamp: new Date().toISOString() });

    } catch (err: any) {
        console.error('[API/HEARTBEAT] Exceção não tratada:', err);
        return NextResponse.json({ 
            error: 'Internal Server Error', 
            message: err.message || 'Unknown error'
        }, { status: 500 });
    }
}
