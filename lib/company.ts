/**
 * DADOS DA EMPRESA VOLTRIS PARA DOCUMENTOS COMERCIAIS (missão §6).
 *
 * Por que variáveis de ambiente e não constante no código: razão social, endereço e
 * contato são dado FISCAL/contratual. Se mudarem (troca de razão social, mudança
 * de endereço, novo e-mail), o documento tem que mudar junto — e a fonte
 * correta disso é o ambiente, não o repositório.
 *
 * O CNPJ tem validação real de dígito verificador (módulo `isValidCnpj`): um
 * documento comercial com CNPJ quebrado é pior do que documento sem CNPJ, e a
 * validação aqui é o que impede isso em silêncio.
 */

export interface CompanyInfo {
    /** Razão social (ou nome fantasia quando a razão social não é informada). */
    razaoSocial: string;
    /** Nome exibido ao cliente. */
    nomeFantasia: string;
    /** CNPJ já formatado (00.000.000/0000-00) ou string vazia se inválido. */
    cnpj: string;
    /** CNPJ sem pontuação, para o bloco de metadados do PDF. */
    cnpjNumerico: string;
    endereco: string;
    cidade: string;
    uf: string;
    cep: string;
    email: string;
    telefone: string;
    site: string;
    /** Frase de rodapé usada no documento (uso legal, não técnico). */
    observacaoFiscal: string;
    /** Frase legal impressa discretamente no rodapé de todo documento. */
    avisoDocumento: string;
}

/** CNPJ oficial publicado no rodapé do site (components/Footer.tsx). */
const CNPJ_PADRAO = '47.241.737/0001-60';

const SITE_PADRAO = 'https://www.voltris.com.br';

/**
 * Razão social usada quando o ambiente não informa outra.
 *
 * O documento comercial impresso (fatura em PDF) é o mesmo que o aplicativo
 * desktop gera; o padrão aqui é o mesmo da razão social publicada no CNPJ,
 * para que o papel e a fatura não se contradigam. Uma troca de razão social
 * continua sendo uma decisão de ambiente (`VOLTRIS_RAZAO_SOCIAL`).
 */
const RAZAO_SOCIAL_PADRAO = 'VOLTRIS OTIMIZACAO LTDA';

/** Remove tudo que não é dígito. */
export function onlyDigits(value: string): string {
    return value.replace(/\D+/g, '');
}

/**
 * Dígito verificador de CNPJ (módulo 11 com pesos 5..2 e 6..2).
 * Retorna null para entrada inválida — nunca "corrige" um CNPJ digitado errado.
 */
export function isValidCnpj(value: string | null | undefined): boolean {
    if (!value) return false;
    const digits = onlyDigits(value);
    if (digits.length !== 14) return false;

    // Rejeita sequências trivialmente válidas (0000..., 1111..., 1234...).
    if (/^(\d)\1{13}$/.test(digits)) return false;

    const calcCheck = (base: string, weights: number[]): number => {
        const sum = base
            .split('')
            .reduce((acc, digit, i) => acc + Number(digit) * weights[i], 0);
        const rest = sum % 11;
        return rest < 2 ? 0 : 11 - rest;
    };

    const dv1 = calcCheck(digits.slice(0, 12), [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
    const dv2 = calcCheck(digits.slice(0, 13), [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);

    return Number(digits[12]) === dv1 && Number(digits[13]) === dv2;
}

/** 47000000001960 -> 47.000.000/0001-96 */
export function formatCnpj(value: string): string {
    const d = onlyDigits(value);
    if (d.length !== 14) return value;
    return `${d.slice(0, 2)}.${d.slice(2, 5)}.${d.slice(5, 8)}/${d.slice(8, 12)}-${d.slice(12)}`;
}

function env(name: string): string | undefined {
    const raw = process.env[name];
    const trimmed = typeof raw === 'string' ? raw.trim() : '';
    return trimmed ? trimmed : undefined;
}

/**
 * Monta o bloco do emitente.
 *
 * Precedência: variável de ambiente > padrão oficial do site.
 * `VOLTRIS_CNPJ_INVALID` fica explícito no log porque um CNPJ ausente/inválido
 * muda o documento — o painel precisa saber, não adivinhar.
 */
export function getCompanyInfo(): { info: CompanyInfo; cnpjValid: boolean } {
    const rawCnpj = env('VOLTRIS_CNPJ') ?? CNPJ_PADRAO;
    const cnpjValid = isValidCnpj(rawCnpj);
    // Documento fiscal não se inventa: se o CNPJ configurado for inválido, o
    // documento sai SEM ele (e o relatório de entrega aponta a pendência).
    const cnpj = cnpjValid ? formatCnpj(rawCnpj) : '';

    const razaoSocial =
        env('VOLTRIS_RAZAO_SOCIAL') ??
        env('VOLTRIS_NOME_FANTASIA') ??
        RAZAO_SOCIAL_PADRAO;

    const info: CompanyInfo = {
        razaoSocial,
        nomeFantasia: env('VOLTRIS_NOME_FANTASIA') ?? razaoSocial,
        cnpj,
        cnpjNumerico: cnpj ? onlyDigits(cnpj) : '',
        endereco: env('VOLTRIS_ENDERECO') ?? 'São Paulo, SP — Brasil',
        cidade: env('VOLTRIS_CIDADE') ?? 'São Paulo',
        uf: env('VOLTRIS_UF') ?? 'SP',
        cep: env('VOLTRIS_CEP') ?? '',
        email: env('VOLTRIS_EMAIL') ?? 'contato@voltris.com.br',
        telefone: env('VOLTRIS_TELEFONE') ?? '(11) 99671-6235',
        site: env('VOLTRIS_SITE') ?? SITE_PADRAO,
        observacaoFiscal:
            env('VOLTRIS_OBSERVACAO_FISCAL') ??
            'Documento emitido eletronicamente pelo VOLTRIS. Não substitui nota fiscal eletrônica (NFS-e).',
        avisoDocumento:
            'Fatura comercial — Este documento não substitui nota fiscal eletrônica (NFS-e).',
    };

    return { info, cnpjValid };
}