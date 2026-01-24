export interface PagBankCustomer {
    name: string;
    email: string;
    tax_id: string; // CPF ou CNPJ (apenas números)
    phones: Array<{
        country: string; // "55"
        area: string; // "11"
        number: string; // "999999999"
        type: "MOBILE" | "HOME" | "WORK";
    }>;
}

export interface PagBankItem {
    reference_id: string;
    name: string;
    quantity: number;
    unit_amount: number; // Em centavos (ex: 1000 = R$ 10,00)
}

export interface PagBankCheckoutRequest {
    reference_id: string;
    expiration_date?: string; // ISO 8601
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
            value: string; // "12"
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

export interface PagBankWebhookEvent {
    id: string;
    description: string; // ex: "checkout.status_change"
    notification_type: string;
    event_at: string;
    data: {
        id: string;
        reference_id: string;
        status: "PAID" | "CANCELED" | "WAITING" | "AUTHORIZED";
        // ... outros campos dependendo do evento
    };
}
