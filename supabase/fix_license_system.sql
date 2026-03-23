-- ============================================================
-- VOLTRIS — FIX COMPLETO DO SISTEMA DE LICENÇAS
-- Execute este script inteiro no SQL Editor do Supabase
-- ============================================================

-- Extensão necessária para SHA256
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------
-- 1. GARANTIR QUE AS TABELAS EXISTEM COM TODAS AS COLUNAS
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    reference_id TEXT UNIQUE NOT NULL,
    pagbank_id TEXT,
    amount DECIMAL(10,2) NOT NULL DEFAULT 0,
    status TEXT NOT NULL DEFAULT 'pending',
    plan_type TEXT NOT NULL DEFAULT 'standard',
    customer_name TEXT,
    customer_tax_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES public.payments(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    client_id TEXT NOT NULL,
    license_key TEXT UNIQUE NOT NULL,
    license_type TEXT NOT NULL DEFAULT 'standard',
    max_devices INTEGER NOT NULL DEFAULT 1,
    devices_in_use INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    expires_at TIMESTAMPTZ NOT NULL,
    activated_at TIMESTAMPTZ,
    last_device_id TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Adicionar devices_in_use se não existir (para bancos já criados)
ALTER TABLE public.licenses ADD COLUMN IF NOT EXISTS devices_in_use INTEGER NOT NULL DEFAULT 0;

CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_payments_reference_id ON public.payments(reference_id);
CREATE INDEX IF NOT EXISTS idx_payments_email ON public.payments(email);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON public.payments(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_email ON public.licenses(email);
CREATE INDEX IF NOT EXISTS idx_licenses_user_id ON public.licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_payment_id ON public.licenses(payment_id);
CREATE INDEX IF NOT EXISTS idx_licenses_license_key ON public.licenses(license_key);

-- ------------------------------------------------------------
-- 2. FUNÇÃO DE ASSINATURA ($$-quoted corretamente)
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.generate_voltris_signature(p_content TEXT)
RETURNS TEXT AS $$
DECLARE
    v_secret TEXT := 'VOLTRIS_SECRET_LICENSE_KEY_2025';
    v_hash TEXT;
BEGIN
    v_hash := upper(encode(digest(p_content || v_secret, 'sha256'), 'hex'));
    RETURN substring(v_hash FROM 1 FOR 16);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ------------------------------------------------------------
-- 3. FUNÇÃO PRINCIPAL DE GERAÇÃO DE LICENÇA ($$-quoted)
-- ------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.generate_complete_license_v3(
    p_payment_id UUID,
    p_user_id UUID,
    p_email TEXT,
    p_plan_type TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_client_id TEXT;
    v_plan_code TEXT;
    v_max_devices INTEGER;
    v_valid_until DATE;
    v_json_content TEXT;
    v_signature TEXT;
    v_final_key TEXT;
    v_license_id UUID;
    v_valid_until_str TEXT;
    v_key_date_str TEXT;
BEGIN
    -- Configurações por plano
    CASE lower(p_plan_type)
        WHEN 'trial' THEN
            v_plan_code := 'TRI'; v_max_devices := 1;
            v_valid_until := CURRENT_DATE + INTERVAL '15 days';
        WHEN 'standard' THEN
            v_plan_code := 'STA'; v_max_devices := 1;
            v_valid_until := CURRENT_DATE + INTERVAL '1 year';
        WHEN 'pro' THEN
            v_plan_code := 'PRO'; v_max_devices := 3;
            v_valid_until := CURRENT_DATE + INTERVAL '1 year';
        WHEN 'enterprise' THEN
            v_plan_code := 'ENT'; v_max_devices := 9999;
            v_valid_until := CURRENT_DATE + INTERVAL '100 years';
        ELSE
            v_plan_code := 'STA'; v_max_devices := 1;
            v_valid_until := CURRENT_DATE + INTERVAL '1 year';
    END CASE;

    -- Client ID aleatório de 6 dígitos
    v_client_id := floor(random() * 900000 + 100000)::TEXT;

    -- Formatos de data
    v_valid_until_str := to_char(v_valid_until, 'YYYY-MM-DD');
    v_key_date_str    := to_char(v_valid_until, 'YYYYMMDD');

    -- JSON exatamente como o C# LicenseGenerator
    v_json_content := format(
        '{"id":"%s","validUntil":"%s","plan":"%s","maxDevices":%s}',
        v_client_id, v_valid_until_str, lower(p_plan_type), v_max_devices
    );

    -- Assinatura
    v_signature := public.generate_voltris_signature(v_json_content);

    -- Chave final: VOLTRIS-STA-123456-20260322-HASH16
    v_final_key := format('VOLTRIS-%s-%s-%s-%s',
        v_plan_code, v_client_id, v_key_date_str, v_signature);

    -- Inserir licença
    INSERT INTO public.licenses (
        payment_id, user_id, email, client_id,
        license_key, license_type, max_devices, expires_at
    ) VALUES (
        p_payment_id, p_user_id, p_email, v_client_id,
        v_final_key, lower(p_plan_type), v_max_devices, v_valid_until
    ) RETURNING id INTO v_license_id;

    RETURN jsonb_build_object(
        'license_id',  v_license_id,
        'license_key', v_final_key,
        'expires_at',  v_valid_until
    );

EXCEPTION WHEN OTHERS THEN
    INSERT INTO public.audit_logs (event_type, metadata)
    VALUES ('LICENSE_GEN_ERROR', jsonb_build_object(
        'error', SQLERRM,
        'email', p_email,
        'plan',  p_plan_type
    ));
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------
-- 4. RLS — POLÍTICAS DE SEGURANÇA
-- ------------------------------------------------------------

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Remover políticas antigas para recriar limpas
DROP POLICY IF EXISTS "Users can view own payments"            ON public.payments;
DROP POLICY IF EXISTS "Service role full access on payments"   ON public.payments;
DROP POLICY IF EXISTS "Users can view own licenses"            ON public.licenses;
DROP POLICY IF EXISTS "Service role full access on licenses"   ON public.licenses;
DROP POLICY IF EXISTS "users_select_own_payments"              ON public.payments;
DROP POLICY IF EXISTS "users_select_own_licenses"              ON public.licenses;
DROP POLICY IF EXISTS "service_all_payments"                   ON public.payments;
DROP POLICY IF EXISTS "service_all_licenses"                   ON public.licenses;
DROP POLICY IF EXISTS "service_all_audit_logs"                 ON public.audit_logs;

-- Usuários veem apenas seus próprios dados
CREATE POLICY "users_select_own_payments" ON public.payments
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "users_select_own_licenses" ON public.licenses
    FOR SELECT USING (
        auth.uid() = user_id
        OR email = (auth.jwt() ->> 'email')
    );

-- Service role acesso total
CREATE POLICY "service_all_payments" ON public.payments
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "service_all_licenses" ON public.licenses
    FOR ALL USING (true) WITH CHECK (true);

CREATE POLICY "service_all_audit_logs" ON public.audit_logs
    FOR ALL USING (true) WITH CHECK (true);

-- ------------------------------------------------------------
-- 5. TESTE RÁPIDO — Verificar se as funções foram criadas
-- ------------------------------------------------------------
-- Descomente para testar:
-- SELECT public.generate_voltris_signature('teste');
-- SELECT public.generate_complete_license_v3(
--     gen_random_uuid(), NULL, 'teste@voltris.com', 'standard'
-- );
