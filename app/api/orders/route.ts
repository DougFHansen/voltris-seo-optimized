import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Usuário não autenticado' }, { status: 401 });
    }

    const body = await request.json();
    console.log('Recebido na API:', body);
    console.log('Usuário autenticado:', user);
    const {
      service_id, // <-- Adicionado
      service_name,
      service_description,
      final_price,
      plan_type,
      scheduling_type,
      appointment_datetime,
      items,
      total,
      notes
    } = body;

    if (!service_name || !final_price) {
      return NextResponse.json({ error: 'Dados obrigatórios ausentes' }, { status: 400 });
    }

    // Data/hora local Brasil
    const now = new Date();
    const nowBR = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }));
    const nowISOString = nowBR.toISOString();

    // --- CORREÇÃO: Converter appointment_datetime local para UTC ISO string ---
    let appointment_datetime_utc = appointment_datetime;
    if (appointment_datetime && typeof appointment_datetime === 'string' && !appointment_datetime.endsWith('Z')) {
      // Interpreta como local e converte para UTC ISO string
      const [date, time] = appointment_datetime.split('T');
      const [year, month, day] = date.split('-');
      const [hour, minute] = time.split(':');
      const localDate = new Date(Number(year), Number(month) - 1, Number(day), Number(hour), Number(minute));
      appointment_datetime_utc = localDate.toISOString();
    }
    // -------------------------------------------------------------

    // Monta objeto para inserir
    const orderToInsert: {
      user_id: string;
      service_id?: string;
      service_name: any;
      service_description: any;
      final_price: any;
      plan_type: any;
      status: string;
      payment_status: string;
      total: any;
      items: any;
      created_at: string;
      updated_at: string;
      scheduling_type?: string;
      appointment_datetime?: string;
      notes?: string;
    } = {
      user_id: user.id,
      service_name,
      service_description: service_description || '',
      final_price: typeof final_price === 'string' ? Number(final_price.replace(/[^-\d,\.]/g, '').replace(',', '.')) : final_price,
      plan_type,
      status: 'pending',
      payment_status: 'pending',
      total: typeof final_price === 'string' ? Number(final_price.replace(/[^-\d,\.]/g, '').replace(',', '.')) : final_price,
      items: items || {},
      created_at: nowISOString,
      updated_at: nowISOString,
      scheduling_type: scheduling_type || 'now',
      appointment_datetime: appointment_datetime_utc || null,
      notes: notes || ''
    };
    // Adiciona service_id se existir
    if (service_id) {
      orderToInsert.service_id = service_id;
    }
    console.log('Objeto a ser inserido:', orderToInsert);

    const { data, error } = await supabase
      .from('orders')
      .insert([orderToInsert])
      .select()
      .single();

    if (error) {
      console.error('Erro do Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Após criar o pedido, criar também o registro em service_requests
    const serviceRequestToInsert = {
      user_id: user.id,
      order_id: data.id,
      status: 'pending',
      requested_services: items ? (Array.isArray(items) ? items : [items]) : [{ service_name, price: final_price }],
      scheduling_type: scheduling_type || 'now',
      requested_datetime: appointment_datetime || null,
      final_price: typeof final_price === 'string' ? Number(final_price.replace(/[^-\d,\.]/g, '').replace(',', '.')) : final_price,
      admin_notes: notes || '',
      created_at: nowISOString,
      updated_at: nowISOString
    };
    const { error: srError } = await supabase
      .from('service_requests')
      .insert([serviceRequestToInsert]);
    if (srError) {
      console.error('Erro ao criar service_request:', srError);
      // Não retorna erro para o usuário, mas loga
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    console.error('Erro interno:', err);
    return NextResponse.json({ error: 'Erro interno ao criar pedido' }, { status: 500 });
  }
} 