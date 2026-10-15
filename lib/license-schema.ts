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
    /** uuid do pagamento que sustenta a licenca (text no schema real). */
    payment_id?: string | null;
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

// ============================================================================
// ESTADO CANONICO DA LICENCA (missao secao 6)
//
// Fonte unica de verdade: NEM o dashboard nem o app derivam estado olhando um
// campo isolado. O estado nasce SEMPRE de licenses.revoked + licenses.expires_at
// + status do pagamento + status da assinatura, calculado no SERVIDOR.
//
// Estados exigidos: ATIVA, PAGAMENTO PENDENTE, FALHA NO PAGAMENTO,
// CANCELAMENTO AGENDADO, EXPIRADA, REVOGADA.
//
// Regras explicitas da missao embutidas aqui:
//   - cancelamento agendado NAO e expiracao imediata (continua com acesso);
//   - pagamento pendente NAO libera licenca;
//   - falha de cobranca respeita o periodo ja pago (acesso ate expires_at);
//   - estorno/chargeback derruba o acesso (nao ha periodo "ja pago").
// ============================================================================

export type LicenseState =
    | 'ATIVA'
    | 'PAGAMENTO_PENDENTE'
    | 'FALHA_NO_PAGAMENTO'
    | 'CANCELAMENTO_AGENDADO'
    | 'EXPIRADA'
    | 'REVOGADA';

export interface LicenseStateInput {
    revoked?: boolean | null;
    expires_at?: string | null;
    /** payments.status (approved/pending/failed/refunded/charged_back...). */
    payment_status?: string | null;
    /** subscriptions.status escrito pelo webhook: ACTIVE | CANCEL_SCHEDULED | CANCELED | PAST_DUE. */
    subscription_status?: string | null;
    /** Injetavel para teste; default = agora. */
    now?: number;
}

export interface LicenseStateResult {
    state: LicenseState;
    label: string;
    /** true quando o usuario pode usar as funcionalidades pagas. */
    hasAccess: boolean;
    /** true quando o periodo pago esta acabando (aviso de renovacao). */
    expiringSoon: boolean;
    daysLeft: number | null;
}

const PENDING_PAYMENT = ['pending', 'processing', 'open', 'requires_payment_method', 'unpaid', 'criado', 'novo'];
const FAILED_PAYMENT = ['failed', 'past_due', 'payment_failed', 'canceled', 'cancelled', 'declined', 'expired'];
const DEAD_PAYMENT = ['refunded', 'charged_back', 'chargeback', 'estornado', 'devolvido'];

const STATE_LABEL: Record<LicenseState, string> = {
    ATIVA: 'Ativa',
    PAGAMENTO_PENDENTE: 'Pagamento pendente',
    FALHA_NO_PAGAMENTO: 'Falha no pagamento',
    CANCELAMENTO_AGENDADO: 'Cancelamento agendado',
    EXPIRADA: 'Expirada',
    REVOGADA: 'Revogada',
};

export function resolveLicenseState(input: LicenseStateInput): LicenseStateResult {
    const now = input.now ?? Date.now();
    const pay = (input.payment_status ?? '').trim().toLowerCase();
    const sub = (input.subscription_status ?? '').trim().toUpperCase();
    const expiry = input.expires_at ? new Date(input.expires_at).getTime() : null;
    const neverExpires = expiry === null || Number.isNaN(expiry);
    const expired = !neverExpires && (expiry as number) <= now;
    const daysLeft = neverExpires ? null : Math.ceil(((expiry as number) - now) / 86_400_000);

    const build = (state: LicenseState, hasAccess: boolean): LicenseStateResult => ({
        state,
        label: STATE_LABEL[state],
        hasAccess,
        expiringSoon: hasAccess && daysLeft !== null && daysLeft <= 7,
        daysLeft,
    });

    // 1. Revogacao explicita vence tudo (inclui estorno/chargeback do pagamento).
    if (input.revoked === true || DEAD_PAYMENT.includes(pay)) return build('REVOGADA', false);

    // 2. Pagamento ainda nao confirmado nao libera acesso, mesmo com linha criada.
    if (PENDING_PAYMENT.includes(pay) && !sub) return build('PAGAMENTO_PENDENTE', false);

    // 3. Periodo pago encerrado: expirada (com ou sem cancelamento agendado).
    if (expired) return build('EXPIRADA', false);

    // 4. Assinatura encerrada sem periodo pago restante => sem acesso.
    if (sub === 'CANCELED' && !neverExpires) return build('EXPIRADA', false);

    // 5. Cobranca recorrente falhou, mas o periodo ja pago continua valido.
    if (sub === 'PAST_DUE' || FAILED_PAYMENT.includes(pay)) return build('FALHA_NO_PAGAMENTO', true);

    // 6. Cancelamento agendado: nao sera renovada, porem segue valida ate o fim.
    if (sub === 'CANCEL_SCHEDULED') return build('CANCELAMENTO_AGENDADO', true);

    // 7. Pagamento pendente com assinatura ja registrada: acesso do periodo atual
    //    permanece, mas o estado honesto e "pagamento pendente" sem acesso futuro.
    if (PENDING_PAYMENT.includes(pay)) return build('PAGAMENTO_PENDENTE', false);

    return build('ATIVA', true);
}

/** Periodo de cobranca legivel (coluna billing_period do schema real). */
export function billingPeriodLabel(billingPeriod?: string | null): string {
    const p = (billingPeriod ?? '').trim().toLowerCase();
    if (['year', 'anual', 'annual', 'y'].includes(p)) return 'Anual';
    if (['month', 'mensal', 'monthly', 'm'].includes(p)) return 'Mensal';
    return p ? p.toUpperCase() : 'Mensal';
}

