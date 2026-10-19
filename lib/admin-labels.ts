/**
 * RÓTULOS DO PAINEL — tudo em pt-BR, em UM lugar só.
 *
 * O painel administrativo mostrava o status CRU do banco: "approved",
 * "partially_refunded", "pending", "active", "low"… em inglês no meio de uma
 * interface que é toda em português. Além de parecer descuidado, obriga o
 * operador a traduzir mentalmente antes de decidir.
 *
 * Aqui cada status do banco tem UM rótulo em português e UMA cor. Quando o
 * banco trouxer um valor que não está no mapa, o texto é "humanizado"
 * ("sistema_pago" vira "Sistema pago") em vez de vazar o valor cru — nunca
 * aparece texto técnico em inglês.
 */

export type TomAdmin = 'ok' | 'aviso' | 'perigo' | 'info' | 'neutro';

const PAGAMENTO: Record<string, string> = {
    approved: 'Aprovado',
    paid: 'Pago',
    succeeded: 'Aprovado',
    completed: 'Concluído',
    pending: 'Pendente',
    processing: 'Em processamento',
    in_progress: 'Em andamento',
    refunded: 'Reembolsado',
    partially_refunded: 'Reembolsado parcialmente',
    failed: 'Falhou',
    canceled: 'Cancelado',
    cancelled: 'Cancelado',
    rejected: 'Recusado',
    expired: 'Expirado',
    unpaid: 'Não pago',
    partially_paid: 'Parcialmente pago',
    draft: 'Rascunho',
    requires_action: 'Ação necessária',
    trialing: 'Em avaliação',
};

const ASSINATURA: Record<string, string> = {
    active: 'Ativa',
    canceled: 'Cancelada',
    cancelled: 'Cancelada',
    past_due: 'Em atraso',
    unpaid: 'Não paga',
    incomplete: 'Incompleta',
    incomplete_expired: 'Expirada',
    expired: 'Expirada',
    trialing: 'Em avaliação',
    paused: 'Pausada',
    ended: 'Encerrada',
};

const PEDIDO: Record<string, string> = {
    pending: 'Pendente',
    paid: 'Pago',
    completed: 'Concluído',
    delivered: 'Entregue',
    in_progress: 'Em andamento',
    processing: 'Em processamento',
    canceled: 'Cancelado',
    cancelled: 'Cancelado',
    refunded: 'Reembolsado',
    failed: 'Falhou',
};

const EMAIL: Record<string, string> = {
    pending: 'Na fila',
    queued: 'Na fila',
    processing: 'Enviando',
    sending: 'Enviando',
    sent: 'Enviado',
    delivered: 'Entregue',
    opened: 'Aberto',
    failed: 'Falhou',
    bounced: 'Devolvido',
    complained: 'Marcado como spam',
    canceled: 'Cancelado',
    cancelled: 'Cancelado',
};

const PRIORIDADE: Record<string, string> = {
    urgent: 'Urgente',
    high: 'Alta',
    medium: 'Média',
    low: 'Baixa',
    critical: 'Crítica',
};

const NEWSLETTER: Record<string, string> = {
    active: 'Ativo',
    inactive: 'Inativo',
    unsubscribed: 'Cancelado',
    pending: 'Pendente',
};

const LICENCA: Record<string, string> = {
    active: 'Ativa',
    expired: 'Expirada',
    revoked: 'Revogada',
    suspended: 'Suspensa',
    pending: 'Pendente',
    cancelled: 'Cancelada',
};

const CICLO: Record<string, string> = {
    month: 'Mensal',
    monthly: 'Mensal',
    year: 'Anual',
    annually: 'Anual',
    week: 'Semanal',
    weekly: 'Semanal',
    day: 'Diário',
    daily: 'Diário',
    lifetime: 'Vitalício',
    one_time: 'Pagamento único',
};

const PLANO: Record<string, string> = {
    basic: 'Básico',
    standard: 'Standard',
    pro: 'Pro',
    premium: 'Premium',
    enterprise: 'Enterprise',
    ultimate: 'Ultimate',
};

const PAPEL: Record<string, string> = {
    superadmin: 'Super administrador',
    financeiro: 'Financeiro',
    suporte: 'Suporte',
    leitura: 'Leitura',
};

const TICKET: Record<string, string> = {
    aberto: 'Aberto',
    open: 'Aberto',
    em_andamento: 'Em andamento',
    in_progress: 'Em andamento',
    resolvido: 'Resolvido',
    resolved: 'Resolvido',
    fechado: 'Fechado',
    closed: 'Fechado',
    cancelado: 'Cancelado',
    waiting: 'Aguardando o cliente',
    waiting_customer: 'Aguardando o cliente',
};

const ERRO_EMAIL: Record<string, string> = {
    timeout: 'Tempo esgotado',
    config: 'Configuração',
    auth: 'Credencial recusada',
    rate_limit: 'Limite de envios',
    sender: 'Remetente inválido',
    validation: 'Dados inválidos',
    provider: 'Provedor',
    network: 'Rede',
    unknown: 'Desconhecido',
};

const ORIGEM: Record<string, string> = {
    form: 'Formulário do site',
    site: 'Site',
    footer: 'Rodapé do site',
    newsletter: 'Newsletter',
    import: 'Importação',
    api: 'API',
    manual: 'Cadastro manual',
    admin: 'Painel administrativo',
    checkout: 'Checkout',
    google: 'Login com Google',
};

const MAPAS: Record<string, Record<string, string>> = {
    pagamento: PAGAMENTO,
    assinatura: ASSINATURA,
    pedido: PEDIDO,
    email: EMAIL,
    prioridade: PRIORIDADE,
    newsletter: NEWSLETTER,
    licenca: LICENCA,
    ciclo: CICLO,
    plano: PLANO,
    papel: PAPEL,
    ticket: TICKET,
    erro_email: ERRO_EMAIL,
    origem: ORIGEM,
};

export type DomAdmin = keyof typeof MAPAS;

/** Rótulo em pt-BR de um valor do banco. */
export function rotulo(valor: string | null | undefined, dominio: DomAdmin = 'pagamento'): string {
    const chave = String(valor ?? '').trim();
    if (!chave) return '—';
    const mapa = MAPAS[dominio];
    const direto = mapa[chave.toLowerCase()];
    if (direto) return direto;
    // Fallback: humaniza o valor cru ("partially_refunded" -> "Partially refunded")
    // para nunca vazar um identificador técnico na tela.
    const humanizado = chave.replace(/[_-]+/g, ' ').trim();
    if (!humanizado) return '—';
    return humanizado.charAt(0).toUpperCase() + humanizado.slice(1);
}

/** Cor do chip conforme o status. */
export function tomDoStatus(valor: string | null | undefined): TomAdmin {
    const s = String(valor ?? '').toLowerCase();
    if (['approved', 'paid', 'succeeded', 'completed', 'active', 'delivered', 'sent', 'opened', 'closed', 'resolved'].includes(s)) return 'ok';
    if (['refunded', 'partially_refunded', 'processing', 'in_progress', 'trialing', 'past_due'].includes(s)) return 'info';
    if (['pending', 'queued', 'processing', 'unpaid', 'incomplete', 'partially_paid', 'requires_action', 'suspended'].includes(s)) return 'aviso';
    if (['failed', 'canceled', 'cancelled', 'rejected', 'revoked', 'expired', 'bounced', 'complained', 'unsubscribed', 'deleted', 'blocked'].includes(s)) return 'perigo';
    return 'neutro';
}

/** Classes do chip, no mesmo padrão de pílula do dashboard. */
export function classeDoTom(tom: TomAdmin): string {
    const mapa: Record<TomAdmin, string> = {
        ok: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
        info: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
        aviso: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
        perigo: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
        neutro: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    };
    return mapa[tom];
}

/** Rótulo do papel de administração (com compatibilidade do legado). */
export function rotuloPapel(role: string | null | undefined, isAdmin?: boolean): string {
    if (!role) return isAdmin ? 'Super administrador (legado)' : 'Cliente';
    return rotulo(role, 'papel');
}
