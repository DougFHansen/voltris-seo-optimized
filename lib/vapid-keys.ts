/**
 * CHAVES VAPID (Web Push).
 *
 * A chave PÚBLICA é pública por design (o navegador precisa dela para
 * assinar o push) e por isso fica versionada aqui: sem ela no ambiente, o
 * cliente nem consegue montar a inscrição.
 *
 * A chave PRIVADA NUNCA entra no repositório. Ela vive em
 * `VAPID_PRIVATE_KEY` (variável de ambiente) e é usada só no servidor, em
 * `services/notificationService.ts`.
 *
 * Se o ambiente definir `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, ela tem precedência
 * (trocar o par de chaves é operação de ambiente).
 */

export const VAPID_PUBLIC_KEY_PADRAO =
    'BAzgWrqm4lTzStPGyI1mcU8m3zsPY9DVhlq-IP8-oMlpeH6Lijd5RWyAfhmAScpOfUrN77c1vpka2eFxWMCnlek';

/** Chave pública em uso (ambiente tem precedência sobre a padrão). */
export function chavePublicaVapid(): string {
    return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || VAPID_PUBLIC_KEY_PADRAO;
}

/** Chave privada: só existe no servidor. */
export function chavePrivadaVapid(): string | null {
    const k = process.env.VAPID_PRIVATE_KEY;
    return k && k.trim() ? k.trim() : null;
}

/** O push está configurado? */
export function pushConfigurado(): boolean {
    return !!chavePrivadaVapid();
}
