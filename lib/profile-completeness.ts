/**
 * COMPLETUDE DO PERFIL — quem precisa preencher o que falta.
 *
 * Contexto real: o cadastro por formulário passou a gravar todos os campos
 * (ver `lib/signup-rules.ts`), mas o login social (Google) nunca passou pelo
 * formulário. Quem entra pelo Google chega ao painel com o perfil quase vazio:
 * sem usuário, sem telefone, sem endereço.
 *
 * Este módulo define, de forma explícita:
 *   - quais campos formam um perfil completo;
 *   - quem está obrigado a completar (apenas conta social incompleta);
 *   - quem NÃO é bloqueado (administradores não ficam presos no formulário).
 *
 * Regras de negócio que NÃO podem ser inventadas aqui: a lista de campos é a
 * mesma do cadastro, e a conta de e-mail não é exigida retroativamente — só
 * quem entrou por outra via e chegou sem dados.
 */

export const CAMPOS_DO_PERFIL = [
    { chave: 'login', rotulo: 'Usuário' },
    { chave: 'full_name', rotulo: 'Nome completo' },
    { chave: 'phone', rotulo: 'WhatsApp' },
    { chave: 'address', rotulo: 'Endereço' },
    { chave: 'neighborhood', rotulo: 'Bairro' },
    { chave: 'city', rotulo: 'Cidade' },
    { chave: 'state', rotulo: 'UF' },
    { chave: 'cep', rotulo: 'CEP' },
] as const;

export type CampoDoPerfil = (typeof CAMPOS_DO_PERFIL)[number]['chave'];

// Tipos são `type` (e não `interface`) de propósito: assim aceitam o
// `User`/`UserMetadata` do Supabase direto, sem `as any` espalhado.
export type PerfilQualquer = {
    login?: string | null;
    full_name?: string | null;
    phone?: string | null;
    address?: string | null;
    neighborhood?: string | null;
    city?: string | null;
    state?: string | null;
    cep?: string | null;
    is_admin?: boolean | null;
};

export type UsuarioQualquer = {
    app_metadata?: { provider?: string; providers?: string[] } | null;
};

const vazio = (v: unknown) =>
    v === null || v === undefined || String(v).trim() === '';

/** Campos obrigatórios que ainda não foram preenchidos. */
export function camposFaltantes(profile: PerfilQualquer | null | undefined): CampoDoPerfil[] {
    if (!profile) return CAMPOS_DO_PERFIL.map((c) => c.chave);
    return CAMPOS_DO_PERFIL
        .filter((c) => vazio(profile[c.chave]))
        .map((c) => c.chave);
}

/** Rótulos legíveis dos campos que faltam (para a tela). */
export function rotulosFaltantes(profile: PerfilQualquer | null | undefined): string[] {
    const faltando = new Set(camposFaltantes(profile));
    return CAMPOS_DO_PERFIL.filter((c) => faltando.has(c.chave)).map((c) => c.rotulo);
}

export function perfilCompleto(profile: PerfilQualquer | null | undefined): boolean {
    return camposFaltantes(profile).length === 0;
}

/**
 * A conta veio de login social (Google, Apple, GitHub...)?
 *
 * No Supabase, `app_metadata.providers` traz TODOS os provedores da conta.
 * O provedor 'email' entra automaticamente em toda conta, então social é
 * "tem algum provedor além de e-mail".
 */
export function ehContaSocial(user: UsuarioQualquer | null | undefined): boolean {
    const am = user?.app_metadata ?? {};
    const lista = Array.isArray(am.providers)
        ? am.providers
        : am.provider
            ? [am.provider]
            : [];
    return lista.some((p) => !!p && p !== 'email');
}

/**
 * Esta conta PRECISA completar o perfil antes de usar o site?
 *
 * - Sem usuário: não (ninguém logado).
 * - Administrador: não. Equipe não pode ficar trancada no formulário —
 *   o painel continua acessível e o dado incompleto fica visível na ficha.
 * - Conta de e-mail (cadastro pelo formulário): não. Ela já passou pelas
 *   obrigatoriedade; contas legadas incompletas não são retroativas.
 * - Conta social sem os campos obrigatórios: SIM.
 */
export function precisaComplementar(
    user: UsuarioQualquer | null | undefined,
    profile: PerfilQualquer | null | undefined
): boolean {
    if (!user) return false;
    if (profile?.is_admin) return false;
    if (!ehContaSocial(user)) return false;
    return !perfilCompleto(profile);
}

/** Divide "Rua, Número" (ou "Rua, Número, Bairro") em rua e número. */
export function separarEndereco(address: string | null | undefined): { street: string; number: string } {
    const bruto = String(address ?? '').trim();
    if (!bruto) return { street: '', number: '' };
    const partes = bruto.split(',').map((p) => p.trim()).filter(Boolean);
    if (partes.length === 0) return { street: bruto, number: '' };
    const ultimo = partes[partes.length - 1];
    const pareceNumero = /^\d+([\s-]?[A-Za-z])?$/.test(ultimo);
    if (partes.length >= 2 && pareceNumero) {
        return { street: partes.slice(0, -1).join(', '), number: ultimo };
    }
    return { street: bruto, number: '' };
}
