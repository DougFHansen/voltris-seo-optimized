// ============================================================
// PAGBANK TYPES — Checkout avulso + Assinaturas Recorrentes
// ============================================================

export interface PagBankCustomer {
    name: string;
    email: string;
    tax_id: string;
    phones?: Array<{
        country: string;
        area: string;
        number: string;
        type: "MOBILE" | "HOME" | "WORK";
    }>;
}

export interface PagBankItem {
    reference_id: string;
    name: string;
    quantity: number;
    unit_amount: number; // centavos
}

export interface PagBankCheckoutRequest {
    reference_id: string;
    expiration_date?: string;
    customer: PagBankCustomer;
    items: PagBankItem[];
    notification_urls: string[];
    redirect_url?: string;
    payment_methods?: Array<{
        type: "CREDIT_CARD" | "DEBIT_CARD" | "BOLETO" | "PIX";
    }>;
    payment_methods_configs?: Array<{
        type: "CREDIT_CARD";
        config_options: Array<{
            option: "INSTALLMENTS_LIMIT";
            value: string;
        }>;
    }>;
}

export interface PagBankCheckoutResponse {
    id: string;
    reference_id: string;
    created_at: string;
    status: string;
    links: Array<{
        rel: "PAY" | "SELF" | "INACTIVATE";
        href: string;
        method: "GET" | "POST" | "DELETE";
    }>;
}

// ============================================================
// ASSINATURAS RECORRENTES
// ============================================================

/** Cria um plano de assinatura no PagBank */
export interface PagBankPlanRequest {
    reference_id: string;
    name: string;
    description?: string;
    amount: {
        value: number;   // centavos
        currency: "BRL";
    };
    interval: {
        unit: "MONTH" | "YEAR";
        length: number;  // 1 = mensal, 12 = anual
    };
    trial?: {
        enabled: boolean;
        hold_setup_fee: boolean;
    };
    payment_method: {
        type: "CREDIT_CARD";
    };
}

export interface PagBankPlanResponse {
    id: string;
    reference_id: string;
    name: string;
    status: "ACTIVE" | "INACTIVE";
    links: Array<{ rel: string; href: string; method: string }>;
}

/** Cria uma assinatura (subscriber) vinculada a um plano */
export interface PagBankSubscriptionRequest {
    reference_id: string;
    plan: { id: string };
    customer: PagBankCustomer;
    payment_method: {
        type: "CREDIT_CARD";
        card: {
            encrypted: string;       // token do cartão (PagBank.js)
            security_code?: string;
            holder: {
                name: string;
            };
            store: boolean;          // salvar cartão para cobranças futuras
        };
    };
    billing_info?: {
        items: Array<{
            reference_id: string;
            name: string;
            quantity: number;
            unit_amount: number;
        }>;
    };
}

export interface PagBankSubscriptionResponse {
    id: string;
    reference_id: string;
    status: "ACTIVE" | "SUSPENDED" | "CANCELED" | "PENDING";
    plan: { id: string };
    customer: { id: string; email: string };
    links: Array<{ rel: string; href: string; method: string }>;
}

// ============================================================
// WEBHOOK
// ============================================================

export interface PagBankWebhookEvent {
    id: string;
    description: string;
    notification_type: string;
    event_at: string;
    data: {
        id: string;
        reference_id: string;
        status: "PAID" | "CANCELED" | "WAITING" | "AUTHORIZED" | "DECLINED";
        // Para assinaturas
        subscription?: {
            id: string;
            reference_id: string;
            status: "ACTIVE" | "SUSPENDED" | "CANCELED";
        };
    };
}
