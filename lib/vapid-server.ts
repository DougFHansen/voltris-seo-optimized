/**
 * CHAVES VAPID — PARTE DO SERVIDOR.
 *
 * O aviso com o site fechado (Web Push) precisa de um par de chaves VAPID:
 * a pública vai para o navegador (ela assina a inscrição) e a privada fica
 * só no servidor (ela assina a mensagem).
 *
 * A chave privada NUNCA pode ficar no repositório nem ser enviada ao
 * navegador. Este módulo resolve o caso de um ambiente sem
 * `VAPID_PRIVATE_KEY` configurado: o par é DERIVADO de um segredo que o
 * servidor já tem (a service role do Supabase), de forma determinística:
 *
 *   - HKDF-SHA256(senha do ambiente) -> semente de 32 bytes
 *   - semente -> chave privada P-256 (PKCS#8 determinístico)
 *   - chave -> par (privada no servidor, pública para o cliente)
 *
 * Consequências práticas:
 *   - o push funciona SEM nenhuma variável de ambiente nova;
 *   - a chave pública é sempre a mesma (determinístico): as inscrições já
 *     feitas continuam válidas depois de um redeploy;
 *   - a chave privada nunca sai do servidor nem entra no git.
 *
 * Se o ambiente definir `VAPID_PRIVATE_KEY` / `NEXT_PUBLIC_VAPID_PUBLIC_KEY`,
 * eles têm precedência (trocar o par continua possível).
 *
 * ATENÇÃO: se a service role do Supabase for rotacionada, o par VAPID muda e
 * as inscrições antigas deixam de valer. Nesse caso, o painel mostra o estado
 * real e o usuário precisa apenas clicar em "Ativar agora" de novo.
 */

import { createECDH, createHmac, createPrivateKey, createPublicKey, hkdfSync } from 'node:crypto';

const INFO = 'voltris-vapid-p256-v1';
const SALT = 'voltris-vapid-v1';

/** Base64url sem padding. */
function b64url(buf: Buffer): string {
    return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlToBuffer(v: string): Buffer {
    const pad = '='.repeat((4 - (v.length % 4)) % 4);
    return Buffer.from(v.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64');
}

/** Segredo de entrada da derivação (a service role já está no ambiente). */
function segredoBase(): string {
    return (
        process.env.VAPID_PRIVATE_KEY ||
        process.env.SUPABASE_SERVICE_ROLE_KEY ||
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
        'voltris-fallback-local'
    );
}

/** Par derivado (determinístico). */
function parDerivado(): { publicKey: string; privateKey: string } {
    const semente = Buffer.from(hkdfSync('sha256', segredoBase(), SALT, INFO, 32));

    // Ponto público determinístico: ECDH com a semente como chave privada.
    const ecdh = createECDH('prime256v1');
    ecdh.setPrivateKey(semente);
    const ponto = ecdh.getPublicKey(); // 0x04 || X || Y (65 bytes, não comprimido)

    // A chave privada em JWK (o Node importa JWK direto — sem montar DER à mão).
    const jwk = {
        kty: 'EC',
        crv: 'P-256',
        d: b64url(semente),
        x: b64url(ponto.subarray(1, 33)),
        y: b64url(ponto.subarray(33, 65)),
    };
    const key = createPrivateKey({ key: jwk, format: 'jwk' });
    const spki = createPublicKey(key).export({ format: 'der', type: 'spki' });
    const pontoFinal = spki.subarray(spki.length - 65);

    return { publicKey: b64url(pontoFinal), privateKey: b64url(semente) };
}

let cache: { publicKey: string; privateKey: string } | null = null;

/** Par em uso: ambiente > derivação. */
export function parVapid(): { publicKey: string; privateKey: string } {
    if (cache) return cache;

    const envPublica = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim();
    const envPrivada = process.env.VAPID_PRIVATE_KEY?.trim();

    if (envPublica && envPrivada) {
        cache = { publicKey: envPublica, privateKey: envPrivada };
        return cache;
    }

    // Só um dos dois no ambiente: usa o que existe e deriva o outro? Não dá
    // (são par). Então deriva o par e ignora o incompleto — o painel informa.
    cache = parDerivado();
    return cache;
}

/** Chave pública (para o navegador assinar a inscrição). */
export function chavePublicaDoServidor(): string {
    return parVapid().publicKey;
}

/** Chave privada (só no servidor). */
export function chavePrivadaDoServidor(): string {
    return parVapid().privateKey;
}

/** O Web Push está operacional? */
export function pushOperacional(): boolean {
    return !!chavePublicaDoServidor() && !!chavePrivadaDoServidor();
}

/** Assinatura estável do par (para diagnóstico). */
export function assinaturaDoPar(): string {
    return createHmac('sha256', parVapid().publicKey).digest('hex').slice(0, 12);
}

/** Reexporta o conversor usado pelo cliente. */
export { b64urlToBuffer };
