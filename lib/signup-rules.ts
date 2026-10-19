/**
 * REGRAS DO CADASTRO — obrigatoriedade de TODOS os campos.
 *
 * Por que este módulo existe: as validações estavam espalhadas dentro do
 * componente e havia buracos reais:
 *
 *  - `neighborhood` (bairro) era enviado no metadata mas NUNCA validado;
 *  - era possível chegar ao passo 3 e concluir sem bairro;
 *  - o CEP manual (botão "Corrigir CEP") nunca passava, porque o código exigia
 *    `isCepValid` mesmo quando o usuário digitava o endereço à mão;
 *  - não havia uma função única que pudesse ser testada.
 *
 * As funções abaixo são puras: recebem os dados e devolvem a primeira mensagem
 * de erro, ou `null` quando o passo está completo. O componente não decide
 * mais sozinho o que é obrigatório.
 */

export interface SignupStep1 {
    login: string;
    email: string;
    password: string;
    /** 0..5, calculado pelo medidor de força da tela. */
    passwordStrength: number;
}

export interface SignupStep2 {
    fullName: string;
    phone: string;
}

export interface SignupStep3 {
    cep: string;
    street: string;
    number: string;
    neighborhood: string;
    city: string;
    state: string;
    /** O ViaCEP respondeu por este CEP? */
    cepValid: boolean;
    /** O usuário optou por digitar o endereço manualmente. */
    manualAddress: boolean;
}

export const onlyDigits = (v: string) => String(v ?? '').replace(/\D/g, '');

export function isValidEmail(v: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v ?? '').trim());
}

/** DDDs válidos no Brasil (mesma lista usada no cadastro). */
const VALID_DDDS = new Set([
    '11','12','13','14','15','16','17','18','19',
    '21','22','24','27','28','31','32','33','34','35','37','38',
    '41','42','43','44','45','46','47','48','49',
    '51','53','54','55','61','62','63','64','65','66','67','68','69',
    '71','73','74','75','77','79','81','82','83','84','85','86','87','88','89',
    '91','92','93','94','95','96','97','98','99',
]);

/**
 * Celular brasileiro: 11 dígitos, DDD existente e nono dígito 9.
 * Mantido idêntico à regra que já existia, para não rejeitar quem já passava.
 */
export function validateBrazilianPhone(v: string): boolean {
    const n = onlyDigits(v);
    if (n.length !== 11) return false;
    if (n[2] !== '9') return false;
    return VALID_DDDS.has(n.slice(0, 2));
}

export function validateSignupStep1(d: SignupStep1): string | null {
    const login = String(d.login ?? '').trim();
    if (!login) return 'Preencha o Usuário.';
    if (login.length < 3 || login.length > 30) {
        return 'O usuário deve ter entre 3 e 30 caracteres.';
    }
    if (!/^[A-Za-z0-9._-]+$/.test(login)) {
        return 'O usuário só pode ter letras, números, ponto, hífen ou sublinhado (sem espaços).';
    }
    if (!String(d.email ?? '').trim()) return 'Preencha o E-mail.';
    if (!isValidEmail(d.email)) return 'Formato de e-mail inválido.';
    if (String(d.password ?? '').length < 8) {
        return 'A senha deve ter pelo menos 8 caracteres.';
    }
    if (d.passwordStrength < 3) {
        return 'Sua senha é fraca. Use letras maiúsculas, números e símbolos.';
    }
    return null;
}

export function validateSignupStep2(d: SignupStep2): string | null {
    const nome = String(d.fullName ?? '').trim();
    if (!nome) return 'Preencha o Nome Completo.';
    if (nome.length < 3) return 'O Nome Completo deve ter pelo menos 3 caracteres.';
    if (!String(d.phone ?? '').trim()) return 'Preencha o WhatsApp.';
    if (!validateBrazilianPhone(d.phone)) {
        return 'Número de WhatsApp inválido ou DDD inexistente.';
    }
    return null;
}

export function validateSignupStep3(d: SignupStep3): string | null {
    const cep = onlyDigits(d.cep);
    if (cep.length !== 8) {
        return 'Informe um CEP válido (8 dígitos).';
    }
    // O CEP precisa ter sido confirmado pelo ViaCEP, salvo quando o usuário
    // escolheu digitar o endereço manualmente. Exigir `cepValid` sempre
    // quebrava o botão "Corrigir CEP / Digitar Manualmente".
    if (!d.cepValid && !d.manualAddress) {
        return 'O CEP informado é inválido. Por favor, utilize um CEP real ou digite o endereço manualmente.';
    }
    if (String(d.street ?? '').trim().length < 3) return 'Preencha a Rua / Logradouro.';
    if (!String(d.number ?? '').trim()) return 'Preencha o Número do endereço.';
    if (String(d.neighborhood ?? '').trim().length < 2) return 'Preencha o Bairro.';
    if (String(d.city ?? '').trim().length < 2) return 'Preencha a Cidade.';
    if (!/^[A-Za-z]{2}$/.test(String(d.state ?? '').trim())) {
        return 'Preencha a UF com 2 letras (ex.: SP).';
    }
    return null;
}
