/**
 * TIPOS DE NOTIFICAÇÃO — vocabulário único do sistema.
 *
 * Existe uma camada de compatibilidade: o BANCO tem um enum
 * (`notification_type`) com valores fixos, e o schema atual é antigo. Então
 * cada tipo de negócio ("compra", "licença", "serviço", "ticket",
 * "reembolso") tem:
 *
 *   - `rich`: o tipo gravado quando o banco já tem o valor (após aplicar
 *     `notificacaocorrigida.sql`);
 *   - `base`: o tipo gravado enquanto o banco não tem o valor — o app
 *     NUNCA deixa de notificar por causa de um enum desatualizado.
 *
 * A decisão é tomada em runtime, no servidor, e o cliente recebe o tipo
 * "real" (o que o banco aceitou) + `data.kind` (o tipo de negócio).
 */

export type NotificationType =
    | 'ticket' | 'order' | 'system' | 'profile' | 'newsletter' | 'comment'
    | 'ticket_status' | 'license' | 'refund' | 'service';

export type NotificationKind =
    | 'purchase'
    | 'license'
    | 'service'
    | 'ticket'
    | 'ticket_reply'
    | 'refund'
    | 'subscription'
    | 'payment_failed'
    | 'newsletter'
    | 'profile'
    | 'system';

export interface NotificationPayload {
    kind: NotificationKind;
    title: string;
    message: string;
    /** Para onde o clique leva (admin: /restricted-area-admin?tab=...). */
    actionUrl?: string;
    /** Metadados de negócio (id do pedido, chave da licença, id do ticket). */
    data?: Record<string, unknown>;
    sound?: 'ping' | 'chime' | 'tone';
}

export interface TypeMapping {
    rich: NotificationType;
    base: NotificationType;
}

/**
 * Mapa tipo de negócio -> tipo do banco.
 * `rich` só é usado quando o banco realmente tem o valor.
 */
export const KIND_TO_TYPE: Record<NotificationKind, TypeMapping> = {
    purchase:       { rich: 'order',    base: 'order' },
    license:        { rich: 'license',  base: 'order' },
    service:        { rich: 'service',  base: 'order' },
    ticket:         { rich: 'ticket',   base: 'ticket' },
    ticket_reply:   { rich: 'ticket',   base: 'ticket' },
    refund:         { rich: 'refund',   base: 'system' },
    subscription:   { rich: 'order',    base: 'order' },
    payment_failed: { rich: 'system',   base: 'system' },
    newsletter:     { rich: 'newsletter', base: 'newsletter' },
    profile:        { rich: 'profile',  base: 'profile' },
    system:         { rich: 'system',   base: 'system' },
};

/**
 * Tipos que o USUÁRIO enxerga no sino dele.
 * `newsletter` e `comment` são exclusivos do admin (regra já existente no
 * projeto: notification social não é do cliente).
 */
export const TIPOS_DE_CLIENTE: NotificationType[] = [
    'order', 'ticket', 'system', 'profile', 'license', 'refund', 'service',
];

/** Ícone (sistema VOLTRIS) que representa o tipo no painel e no sino. */
export const ICONE_POR_TIPO: Record<string, string> = {
    order: 'creditCard',
    license: 'license',
    service: 'services',
    ticket: 'support',
    ticket_status: 'support',
    refund: 'receipt',
    system: 'info',
    profile: 'person',
    newsletter: 'mail',
    comment: 'message',
};

/** Cor de acento (hex da paleta do dashboard) por tipo. */
export const COR_POR_TIPO: Record<string, string> = {
    order: '#31A8FF',
    license: '#8B31FF',
    service: '#9146FF',
    ticket: '#F59E0B',
    ticket_status: '#F59E0B',
    refund: '#00D4FF',
    system: '#31A8FF',
    profile: '#EC4899',
    newsletter: '#10B981',
    comment: '#00FF94',
};

/**
 * O tipo que vai ser gravado, dada a capacidade real do banco.
 * `supportsRichTypes` = o banco já tem os valores novos do enum.
 */
export function tipoParaGravacao(
    kind: NotificationKind,
    supportsRichTypes: boolean
): NotificationType {
    const map = KIND_TO_TYPE[kind] ?? KIND_TO_TYPE.system;
    return supportsRichTypes ? map.rich : map.base;
}

/** Rótulo curto para telas. */
export const ROTULO_POR_TIPO: Record<string, string> = {
    order: 'Compra',
    license: 'Licença',
    service: 'Serviço',
    ticket: 'Suporte',
    ticket_status: 'Suporte',
    refund: 'Reembolso',
    system: 'Sistema',
    profile: 'Perfil',
    newsletter: 'Newsletter',
    comment: 'Comentário',
};

/**
 * O cliente NÃO deve ver notificação de newsletter/comentário social.
 * (Mantém a regra que já existia no NotificationContext.)
 */
export function ehVisivelParaCliente(type: string): boolean {
    return TIPOS_DE_CLIENTE.includes(type as NotificationType);
}
