import { createHash, randomBytes, timingSafeEqual } from 'node:crypto';

/**
 * Credencial de dispositivo.
 *
 * O VOLTRIS OPTIMIZER não tem sessão de navegador: ele é identificado pelo
 * installation_id (UUID v4 gerado e persistido pelo próprio app). Para conseguir
 * consultar o próprio vínculo e se desvincular, ele apresenta uma credencial
 * emitida pelo servidor no momento do vínculo.
 *
 * Regras:
 *  - o token tem 256 bits de entropia e é entregue UMA ÚNICA VEZ;
 *  - o servidor guarda apenas o SHA-256, nunca o token;
 *  - a comparação é em tempo constante;
 *  - desvincular descarta a credencial (revincular gera outra).
 *
 * O app guarda o token com DPAPI (usuário do Windows + máquina).
 */

/** Header usado pelo app para apresentar a credencial. */
export const DEVICE_CREDENTIAL_HEADER = 'x-voltris-device-credential';

/** Campo no corpo da resposta (usado apenas na emissão/bootstrapping). */
export const DEVICE_CREDENTIAL_FIELD = 'device_credential';

const TOKEN_BYTES = 32;

/** Gera um token novo em base64url (sem padding). */
export function generateDeviceCredential(): string {
    return randomBytes(TOKEN_BYTES).toString('base64url');
}

/** SHA-256 em hexadecimal minúsculo — é o que fica gravado no banco. */
export function hashDeviceCredential(token: string): string {
    return createHash('sha256').update(token, 'utf8').digest('hex');
}

/** Valida o formato do token antes de gastar CPU com hash. */
export function isWellFormedCredential(token: unknown): token is string {
    return (
        typeof token === 'string' &&
        token.length >= 40 &&
        token.length <= 128 &&
        /^[A-Za-z0-9_-]+$/.test(token)
    );
}

/**
 * Confere o token apresentado contra o hash guardado.
 * Retorna false quando o hash é null (ainda não houve emissão) — o chamador
 * trata esse caso como "emissão pendente", nunca como "senha errada".
 */
export function verifyDeviceCredential(token: unknown, storedHash: string | null): boolean {
    if (!isWellFormedCredential(token)) return false;
    if (!storedHash) return false;

    const candidate = Buffer.from(hashDeviceCredential(token), 'hex');
    const expected = Buffer.from(storedHash, 'hex');

    if (candidate.length !== expected.length) return false;
    return timingSafeEqual(candidate, expected);
}

/** Lê a credencial do header ou do corpo (compatibilidade com builds antigos). */
export function readPresentedCredential(
    headerValue: string | null | undefined,
    bodyValue: unknown
): string | null {
    if (isWellFormedCredential(headerValue)) return headerValue;
    if (isWellFormedCredential(bodyValue)) return bodyValue;
    return null;
}
