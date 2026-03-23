import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/utils/supabase/admin';
import { createClient } from '@/utils/supabase/server';

export async function POST(req: NextRequest) {
  const supabaseUser = await createClient();
  const { data: { user }, error } = await supabaseUser.auth.getUser();
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const supabase = createAdminClient();
  const userEmail = user.email!.toLowerCase().trim();

  const { data: payments } = await supabase
    .from('payments')
    .select('*')
    .or(`email.eq.${userEmail},user_id.eq.${user.id}`)
    .order('created_at', { ascending: false });

  if (!payments?.length) return NextResponse.json({ found: false, generated: 0, already_existed: 0, licenses: [] });

  let generated = 0, already_existed = 0;
  const licenses: any[] = [];

  for (const payment of payments) {
    const { data: existing } = await supabase.from('licenses').select('*').eq('payment_id', payment.id).maybeSingle();
    if (existing) { already_existed++; licenses.push(existing); continue; }

    if (payment.status !== 'approved' && payment.status !== 'paid') {
      await supabase.from('payments').update({ status: 'approved', updated_at: new Date().toISOString() }).eq('id', payment.id);
    }

    const crypto = await import('crypto');
    const SECRET = process.env.LICENSE_SECRET_KEY || 'VOLTRIS_SECRET_LICENSE_KEY_2025';
    const planType = (payment.plan_type || 'standard').toLowerCase();
    const plans: Record<string, { code: string; maxDevices: number; daysValid: number }> = {
      trial: { code: 'TRI', maxDevices: 1, daysValid: 15 },
      standard: { code: 'STA', maxDevices: 1, daysValid: 365 },
      pro: { code: 'PRO', maxDevices: 3, daysValid: 365 },
      enterprise: { code: 'ENT', maxDevices: 9999, daysValid: 36500 },
    };
    const cfg = plans[planType] ?? plans['standard'];
    const clientId = String(Math.floor(Math.random() * 900000) + 100000);
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + cfg.daysValid);
    const validStr = validUntil.toISOString().split('T')[0];
    const keyDate = validStr.replace(/-/g, '');
    const json = `{"id":"${clientId}","validUntil":"${validStr}","plan":"${planType}","maxDevices":${cfg.maxDevices}}`;
    const hash = crypto.createHash('sha256').update(json + SECRET, 'utf8').digest('hex').toUpperCase().substring(0, 16);
    const licenseKey = `VOLTRIS-${cfg.code}-${clientId}-${keyDate}-${hash}`;

    const { data: inserted } = await supabase.from('licenses').insert({
      payment_id: payment.id, user_id: payment.user_id || user.id,
      email: payment.email, client_id: clientId, license_key: licenseKey,
      license_type: planType, max_devices: cfg.maxDevices, devices_in_use: 0,
      is_active: true, expires_at: validUntil.toISOString(),
    }).select().single();

    if (inserted) { generated++; licenses.push(inserted); }
  }

  return NextResponse.json({ found: true, generated, already_existed, licenses });
}
