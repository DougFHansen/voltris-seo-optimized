-- ============================================================
-- VOLTRIS — SISTEMA DE ASSINATURAS RECORRENTES (PAGBANK)
-- Execute este script no SQL Editor do Supabase
-- ============================================================

-- Tabela para armazenar os IDs dos planos criados no PagBank
CREATE TABLE IF NOT EXISTS public.pagbank_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_type TEXT UNIQUE NOT NULL,          -- standard, pro, enterprise
    pagbank_plan_id TEXT UNIQUE NOT NULL,    -- ID retornado pelo PagBank
    name TEXT NOT NULL,
    amount_cents INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Tabela de assinaturas ativas
CREATE TABLE IF NOT EXISTS public.subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reference_id TEXT UNIQUE NOT NULL,
    pagbank_subscription_id TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    plan_type TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING',  -- ACTIVE, SUSPENDED, CANCELED, PENDING
    payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
    next_billing_at TIMESTAMPTZ,
    canceled_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON public.subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_pagbank_id ON public.subscriptions(pagbank_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON public.subscriptions(status);

-- RLS
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagbank_plans ENABLE ROW LEVEL SECURITY;

-- Usuários veem apenas suas próprias assinaturas
CREATE POLICY "Users view own subscriptions" ON public.subscriptions
    FOR SELECT USING (auth.uid() = user_id OR email = (SELECT auth.jwt() ->> 'email'));

-- Service role acesso total
CREATE POLICY "Service role full access subscriptions" ON public.subscriptions
    FOR ALL USING (true);

CREATE POLICY "Service role full access plans" ON public.pagbank_plans
    FOR ALL USING (true);

-- ============================================================
-- FUNÇÃO: Renovar licença ao receber cobrança recorrente
-- Chamada pelo webhook quando status = PAID em assinatura
-- ============================================================
CREATE OR REPLACE FUNCTION public.renew_subscription_license(
    p_subscription_pagbank_id TEXT,
    p_payment_id UUID
)
RETURNS JSONB AS $$
DECLARE
    v_sub RECORD;
    v_license RECORD;
    v_new_expires_at TIMESTAMPTZ;
BEGIN
    -- Buscar assinatura
    SELECT * INTO v_sub
    FROM public.subscriptions
    WHERE pagbank_subscription_id = p_subscription_pagbank_id;

    IF NOT FOUND THEN
        RETURN jsonb_build_object('error', 'Assinatura não encontrada');
    END IF;

    -- Calcular nova data de expiração (+ 31 dias para mensal)
    v_new_expires_at := now() + INTERVAL '31 days';

    -- Verificar se já existe licença ativa para esse usuário/email
    SELECT * INTO v_license
    FROM public.licenses
    WHERE (user_id = v_sub.user_id OR email = v_sub.email)
      AND license_type = v_sub.plan_type
      AND is_active = true
    ORDER BY created_at DESC
    LIMIT 1;

    IF FOUND THEN
        -- Renovar licença existente (estender validade)
        UPDATE public.licenses
        SET expires_at = v_new_expires_at,
            is_active = true
        WHERE id = v_license.id;

        RETURN jsonb_build_object(
            'action', 'renewed',
            'license_id', v_license.id,
            'license_key', v_license.license_key,
            'expires_at', v_new_expires_at
        );
    ELSE
        -- Gerar nova licença via função existente
        RETURN public.generate_complete_license_v3(
            p_payment_id,
            v_sub.user_id,
            v_sub.email,
            v_sub.plan_type
        );
    END IF;
END;
$$ LANGUAGE plpgsql;
