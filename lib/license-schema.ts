/**
 * Modelo de dados canonico de public.licenses / public.license_devices.
 *
 * Schema real (verificado no banco):
 *   licenses:       license_key (PK) | plan_type | max_devices | expires_at
 *                   billing_period | customer_email | notes | revoked
 *                   activated_at | created_at
 *                   + user_id | email | client_id | payment_id | license_display_name
 *   license_devices: id | license_key (FK) | device_id | machine_name | os_version
 *                   app_version | activated_at | last_seen_at
 *                   + device_name | last_used_at | processor_count
 *
 * O codigo antigo usava `licenses.id`, `license_type`, `is_active`,
 * `devices_in_use` e `license_devices.license_id` — colunas que NUNCA existiram
 * nessa tabela, gerando 42703 em todos os endpoints /api/v1/license/*.
 *
 * Regras de mapeamento:
 *   plan_type        -> tipo do plano          (antes: license_type)
 *   NOT revoked      -> licencia ativa         (antes: is_active)
 *   COUNT(license_devices) -> dispositivos em uso (antes: devices_in_use)
 *   license_key      -> identidade do vinculo  (antes: license_id)
 */

import { createClient } from '@supabase/supabase-js';

export interface LicenseRow {
    license_key: string;
    plan_type: string | null;
    license_display_name: string | null;
    max_devices: number | null;
    expires_at: string | null;
    billing_period: string | null;
    customer_email: string | null;
    email: string | null;
    user_id: string | null;
    revoked: boolean | null;
    activated_at: string | null;
    notes: string | null;
    client_id: string | null;
}

export interface LicenseDeviceRow {
    id: number;
    license_key: string;
    device_id: string;
    device_name: string | null;
    machine_name: string | null;
    os_version: string | null;
    app_version: string | null;
    processor_count: number | null;
    activated_at: string | null;
    last_used_at: string | null;
    last_seen_at: string | null;
}

export function getServiceClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url || !key) throw new Error('SERVER_CONFIG');
    return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}

export function isLicenseActive(license: Pick<LicenseRow, 'revoked' | 'expires_at'>): boolean {
    if (license.revoked === true) return false;
    if (!license.expires_at) return true;
    return new Date(license.expires_at).getTime() > Date.now();
}

export function isLicenseExpired(license: Pick<LicenseRow, 'expires_at'>): boolean {
    if (!license.expires_at) return false;
    return new Date(license.expires_at).getTime() <= Date.now();
}

export function licenseDisplayName(license: Pick<LicenseRow, 'plan_type' | 'license_display_name'>): string {
    if (license.license_display_name) return license.license_display_name;
    switch ((license.plan_type ?? '').toLowerCase()) {
        case 'trial':
            return 'Trial';
        case 'standard':
            return 'VOLTRIS STANDARD';
        case 'pro':
            return 'VOLTRIS PRO';
        case 'enterprise':
            return 'VOLTRIS ENTERPRISE';
        default:
            return (license.plan_type ?? 'STANDARD').toUpperCase();
    }
}

export async function countLicenseDevices(licenseKey: string): Promise<number> {
    const supabase = getServiceClient();
    const { count, error } = await supabase
        .from('license_devices')
        .select('id', { count: 'exact', head: true })
        .eq('license_key', licenseKey);
    if (error) throw new Error('DB_COUNT_FAILED');
    return count ?? 0;
}

/**
 * O dono de uma licenca. Prioriza o UUID (user_id) e so usa o email como
 * fallback para linhas legadas ainda nao migradas.
 */
export function licenseIsOwnedBy(
    license: Pick<LicenseRow, 'user_id' | 'customer_email' | 'email'>,
    sessionUser: { id: string; email?: string | null } | null
): boolean {
    if (!sessionUser) return false;
    if (license.user_id) return license.user_id === sessionUser.id;
    const owner = (license.email ?? license.customer_email ?? '').toLowerCase();
    return !!owner && !!sessionUser.email && owner === sessionUser.email.toLowerCase();
}

/** Busca a licenca pela chave. Retorna null se nao existir. */
export async function findLicenseByKey(licenseKey: string): Promise<LicenseRow | null> {
    const supabase = getServiceClient();
    const { data, error } = await supabase
        .from('licenses')
        .select('*')
        .eq('license_key', licenseKey)
        .maybeSingle();
    if (error) throw new Error('DB_READ_FAILED');
    return (data as LicenseRow) ?? null;
}
