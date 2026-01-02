-- =====================================================
-- MIGRATION: Sistema de Assinaturas Recorrentes
-- Objetivo: Adicionar suporte completo a assinaturas com Mercado Pago
-- =====================================================

-- 1. Criar tabela de assinaturas
CREATE TABLE IF NOT EXISTS subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Identificação
    license_id UUID NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    full_name TEXT,
    phone TEXT,
    
    -- Mercado Pago
    mp_subscription_id TEXT UNIQUE, -- ID da assinatura no Mercado Pago
    mp_preapproval_plan_id TEXT, -- ID do plano no Mercado Pago
    mp_payer_id TEXT, -- ID do pagador
    mp_payment_method_id TEXT, -- Método de pagamento
    
    -- Plano e pagamento
    plan_code license_type NOT NULL,
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'BRL',
    billing_frequency TEXT DEFAULT 'monthly', -- monthly, quarterly, biannual
    next_billing_date TIMESTAMPTZ,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'pending', -- pending, active, paused, cancelled, expired
    is_trial BOOLEAN DEFAULT false,
    trial_ends_at TIMESTAMPTZ,
    
    -- Controle
    started_at TIMESTAMPTZ DEFAULT NOW(),
    activated_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_subscriptions_license ON subscriptions(license_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_email ON subscriptions(email);
CREATE INDEX IF NOT EXISTS idx_subscriptions_mp_subscription ON subscriptions(mp_subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing ON subscriptions(next_billing_date) WHERE status = 'active';

-- 2. Criar tabela de histórico de pagamentos
CREATE TABLE IF NOT EXISTS subscription_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Relacionamentos
    subscription_id UUID NOT NULL REFERENCES subscriptions(id) ON DELETE CASCADE,
    license_id UUID NOT NULL REFERENCES licenses(id) ON DELETE CASCADE,
    
    -- Mercado Pago
    mp_payment_id TEXT UNIQUE NOT NULL,
    mp_collection_id TEXT,
    mp_collection_status TEXT, -- approved, pending, rejected, etc
    
    -- Detalhes do pagamento
    amount NUMERIC(10,2) NOT NULL,
    currency TEXT DEFAULT 'BRL',
    payment_type TEXT, -- credit_card, debit_card, pix, etc
    installments INTEGER DEFAULT 1,
    
    -- Status
    status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected, refunded, cancelled
    status_detail TEXT,
    
    -- Datas
    payment_date TIMESTAMPTZ,
    approved_at TIMESTAMPTZ,
    
    -- Período coberto
    period_start TIMESTAMPTZ,
    period_end TIMESTAMPTZ,
    
    -- Auditoria
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_subscription_payments_subscription ON subscription_payments(subscription_id);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_license ON subscription_payments(license_id);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_mp_payment ON subscription_payments(mp_payment_id);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_status ON subscription_payments(status);
CREATE INDEX IF NOT EXISTS idx_subscription_payments_date ON subscription_payments(payment_date DESC);

-- 3. Adicionar campos de assinatura na tabela licenses
ALTER TABLE licenses 
ADD COLUMN IF NOT EXISTS subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS auto_renew BOOLEAN DEFAULT true;

CREATE INDEX IF NOT EXISTS idx_licenses_subscription ON licenses(subscription_id);

-- 4. Função: Criar assinatura a partir de licença
CREATE OR REPLACE FUNCTION create_subscription_from_license(
    p_license_id UUID,
    p_email TEXT,
    p_full_name TEXT DEFAULT NULL,
    p_phone TEXT DEFAULT NULL,
    p_mp_subscription_id TEXT DEFAULT NULL,
    p_is_trial BOOLEAN DEFAULT false
) RETURNS UUID AS $$
DECLARE
    v_subscription_id UUID;
    v_license RECORD;
    v_next_billing_date TIMESTAMPTZ;
    v_billing_frequency TEXT;
BEGIN
    -- Buscar licença
    SELECT * INTO v_license FROM licenses WHERE id = p_license_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Licença não encontrada';
    END IF;
    
    -- Determinar frequência de cobrança
    CASE v_license.license_type
        WHEN 'trial' THEN
            v_billing_frequency := 'monthly';
            v_next_billing_date := NOW() + INTERVAL '7 days';
        WHEN 'pro' THEN
            v_billing_frequency := 'monthly';
            v_next_billing_date := NOW() + INTERVAL '1 month';
        WHEN 'premium' THEN
            v_billing_frequency := 'quarterly';
            v_next_billing_date := NOW() + INTERVAL '3 months';
        WHEN 'enterprise' THEN
            v_billing_frequency := 'biannual';
            v_next_billing_date := NOW() + INTERVAL '6 months';
        ELSE
            v_billing_frequency := 'monthly';
            v_next_billing_date := NOW() + INTERVAL '1 month';
    END CASE;
    
    -- Criar assinatura
    INSERT INTO subscriptions (
        license_id,
        user_id,
        email,
        full_name,
        phone,
        mp_subscription_id,
        plan_code,
        amount,
        billing_frequency,
        next_billing_date,
        status,
        is_trial,
        trial_ends_at
    ) VALUES (
        p_license_id,
        v_license.user_id,
        p_email,
        p_full_name,
        p_phone,
        p_mp_subscription_id,
        v_license.license_type,
        CASE v_license.license_type
            WHEN 'trial' THEN 0.01
            WHEN 'pro' THEN 49.90
            WHEN 'premium' THEN 99.90
            WHEN 'enterprise' THEN 149.90
            ELSE 49.90
        END,
        v_billing_frequency,
        v_next_billing_date,
        CASE WHEN p_is_trial THEN 'active' ELSE 'pending' END,
        p_is_trial,
        CASE WHEN p_is_trial THEN NOW() + INTERVAL '7 days' ELSE NULL END
    ) RETURNING id INTO v_subscription_id;
    
    -- Atualizar licença
    UPDATE licenses 
    SET 
        subscription_id = v_subscription_id,
        is_recurring = true,
        auto_renew = true
    WHERE id = p_license_id;
    
    RETURN v_subscription_id;
END;
$$ LANGUAGE plpgsql;

-- 5. Função: Registrar pagamento de assinatura
CREATE OR REPLACE FUNCTION record_subscription_payment(
    p_subscription_id UUID,
    p_mp_payment_id TEXT,
    p_amount NUMERIC,
    p_status TEXT,
    p_payment_date TIMESTAMPTZ DEFAULT NOW()
) RETURNS UUID AS $$
DECLARE
    v_payment_id UUID;
    v_subscription RECORD;
    v_period_start TIMESTAMPTZ;
    v_period_end TIMESTAMPTZ;
BEGIN
    -- Buscar assinatura
    SELECT * INTO v_subscription FROM subscriptions WHERE id = p_subscription_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Assinatura não encontrada';
    END IF;
    
    -- Calcular período coberto
    v_period_start := p_payment_date;
    
    CASE v_subscription.billing_frequency
        WHEN 'monthly' THEN
            v_period_end := v_period_start + INTERVAL '1 month';
        WHEN 'quarterly' THEN
            v_period_end := v_period_start + INTERVAL '3 months';
        WHEN 'biannual' THEN
            v_period_end := v_period_start + INTERVAL '6 months';
        ELSE
            v_period_end := v_period_start + INTERVAL '1 month';
    END CASE;
    
    -- Registrar pagamento
    INSERT INTO subscription_payments (
        subscription_id,
        license_id,
        mp_payment_id,
        amount,
        status,
        payment_date,
        approved_at,
        period_start,
        period_end
    ) VALUES (
        p_subscription_id,
        v_subscription.license_id,
        p_mp_payment_id,
        p_amount,
        p_status,
        p_payment_date,
        CASE WHEN p_status = 'approved' THEN p_payment_date ELSE NULL END,
        v_period_start,
        v_period_end
    ) RETURNING id INTO v_payment_id;
    
    -- Atualizar assinatura se pagamento aprovado
    IF p_status = 'approved' THEN
        UPDATE subscriptions
        SET 
            status = 'active',
            activated_at = COALESCE(activated_at, p_payment_date),
            next_billing_date = v_period_end,
            updated_at = NOW()
        WHERE id = p_subscription_id;
        
        -- Atualizar licença
        UPDATE licenses
        SET 
            is_active = true,
            expires_at = v_period_end,
            updated_at = NOW()
        WHERE id = v_subscription.license_id;
    END IF;
    
    RETURN v_payment_id;
END;
$$ LANGUAGE plpgsql;

-- 6. Função: Cancelar assinatura
CREATE OR REPLACE FUNCTION cancel_subscription(
    p_subscription_id UUID,
    p_reason TEXT DEFAULT NULL,
    p_immediate BOOLEAN DEFAULT false
) RETURNS BOOLEAN AS $$
DECLARE
    v_subscription RECORD;
BEGIN
    -- Buscar assinatura
    SELECT * INTO v_subscription FROM subscriptions WHERE id = p_subscription_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Assinatura não encontrada';
    END IF;
    
    -- Atualizar assinatura
    UPDATE subscriptions
    SET 
        status = 'cancelled',
        cancelled_at = NOW(),
        cancellation_reason = p_reason,
        updated_at = NOW()
    WHERE id = p_subscription_id;
    
    -- Se cancelamento imediato, desativar licença
    IF p_immediate THEN
        UPDATE licenses
        SET 
            is_active = false,
            auto_renew = false,
            updated_at = NOW()
        WHERE id = v_subscription.license_id;
    ELSE
        -- Apenas desabilitar renovação automática
        UPDATE licenses
        SET 
            auto_renew = false,
            updated_at = NOW()
        WHERE id = v_subscription.license_id;
    END IF;
    
    RETURN true;
END;
$$ LANGUAGE plpgsql;

-- 7. Trigger: Atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_payments_updated_at BEFORE UPDATE ON subscription_payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. RLS Policies
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscription_payments ENABLE ROW LEVEL SECURITY;

-- Política: Usuários podem ver suas próprias assinaturas
CREATE POLICY "Users can view own subscriptions"
    ON subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- Política: Usuários podem ver seus próprios pagamentos
CREATE POLICY "Users can view own payments"
    ON subscription_payments FOR SELECT
    USING (
        subscription_id IN (
            SELECT id FROM subscriptions WHERE user_id = auth.uid()
        )
    );

-- Política: Service role tem acesso total
CREATE POLICY "Service role full access to subscriptions"
    ON subscriptions FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

CREATE POLICY "Service role full access to payments"
    ON subscription_payments FOR ALL
    USING (auth.jwt()->>'role' = 'service_role');

-- =====================================================
-- FIM DA MIGRATION
-- =====================================================
