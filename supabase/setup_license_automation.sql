-- ==========================================
-- VOLTRIS OPTIMIZER - SISTEMA DE LICENCIAMENTO PRO
-- SCRIPT DE RESET E CONFIGURAÇÃO COMPLETA (V3)
-- ALINHADO COM: LicenseGenerator, LicenseManager.cs e Checkout
-- ==========================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. LIMPEZA TOTAL (OPCIONAL - CUIDADO)
DROP TABLE IF EXISTS public.licenses CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.audit_logs CASCADE;

-- 2. TABELA DE PAGAMENTOS (PAGBANK)
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    email TEXT NOT NULL,
    reference_id TEXT UNIQUE NOT NULL, -- ID do PagBank (VOLTRIS-...)
    pagbank_id TEXT, -- ID da transação no PagBank
    amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, authorized, paid, declined
    plan_type TEXT NOT NULL, -- trial, standard, pro, enterprise
    customer_name TEXT,
    customer_tax_id TEXT, -- CPF/CNPJ
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. TABELA DE LICENÇAS (COMPATÍVEL COM GERADOR C#)
CREATE TABLE public.licenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID REFERENCES public.payments(id),
    user_id UUID REFERENCES auth.users(id),
    email TEXT NOT NULL,
    client_id TEXT NOT NULL, -- Parte ID da licença (ex: 230697)
    license_key TEXT UNIQUE NOT NULL, -- Chave Completa (VOLTRIS-PRO-...)
    license_type TEXT NOT NULL, -- trial, standard, pro, enterprise
    max_devices INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ NOT NULL,
    activated_at TIMESTAMPTZ,
    last_device_id TEXT, 
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. LOGS DE AUDITORIA
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. FUNÇÃO PARA GERAR ASSINATURA (ALGORITMO C#)
CREATE OR REPLACE FUNCTION public.generate_voltris_signature(p_content TEXT)
RETURNS TEXT AS $$
DECLARE
    v_secret TEXT := 'VOLTRIS_SECRET_LICENSE_KEY_2025';
    v_hash TEXT;
BEGIN
    -- SHA256(Content + Secret) -> Hex Uppercase -> First 16 chars
    v_hash := upper(encode(digest(p_content || v_secret, 'sha256'), 'hex'));
    RETURN substring(v_hash from 1 for 16);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 6. FUNÇÃO PARA GERAR LICENÇA COMPLETA
CREATE OR REPLACE FUNCTION public.generate_complete_license_v3(
    p_payment_id UUID,
    p_user_id UUID,
    p_email TEXT,
    p_plan_type TEXT,
    p_billing_period TEXT DEFAULT 'month' -- 'month' ou 'year'
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
    v_interval INTERVAL;
BEGIN
    -- Determinar intervalo
    IF p_billing_period = 'year' THEN
        v_interval := INTERVAL '1 year';
    ELSE
        v_interval := INTERVAL '1 month';
    END IF;

    -- 1. Determinar Configurações do Plano
    CASE lower(p_plan_type)
        WHEN 'trial' THEN 
            v_plan_code := 'TRI';
            v_max_devices := 1;
            v_valid_until := CURRENT_DATE + INTERVAL '15 days';
        WHEN 'standard' THEN 
            v_plan_code := 'STA';
            v_max_devices := 1;
            v_valid_until := CURRENT_DATE + v_interval;
        WHEN 'pro' THEN 
            v_plan_code := 'PRO';
            v_max_devices := 3;
            v_valid_until := CURRENT_DATE + v_interval;
        WHEN 'enterprise' THEN 
            v_plan_code := 'ENT';
            v_max_devices := 9999;
            v_valid_until := CURRENT_DATE + v_interval;
        ELSE
            v_plan_code := 'STA';
            v_max_devices := 1;
            v_valid_until := CURRENT_DATE + v_interval;
    END CASE;

    -- 2. Gerar Client ID Aleatório (6 dígitos - igual ao formatado no gerador)
    v_client_id := floor(random() * (999999-100000+1) + 100000)::TEXT;

    -- 3. Preparar Formatos de Data
    v_valid_until_str := to_char(v_valid_until, 'YYYY-MM-DD'); -- Formato JSON
    v_key_date_str := to_char(v_valid_until, 'YYYYMMDD');    -- Formato Chave

    -- 4. Criar JSON de Conteúdo (EXATAMENTE como no C#)
    -- Format: {"id":"123456","validUntil":"2025-12-31","plan":"pro","maxDevices":3}
    v_json_content := format('{"id":"%s","validUntil":"%s","plan":"%s","maxDevices":%s}', 
                             v_client_id, v_valid_until_str, lower(p_plan_type), v_max_devices);

    -- 5. Gerar Assinatura
    v_signature := public.generate_voltris_signature(v_json_content);

    -- 6. Montar Chave Final
    -- Format: VOLTRIS-PRO-123456-20251231-HASH16
    v_final_key := format('VOLTRIS-%s-%s-%s-%s', v_plan_code, v_client_id, v_key_date_str, v_signature);

    -- 7. Salvar no Banco
    INSERT INTO public.licenses (
        payment_id, user_id, email, client_id, license_key, 
        license_type, max_devices, expires_at
    ) VALUES (
        p_payment_id, p_user_id, p_email, v_client_id, v_final_key, 
        p_plan_type, v_max_devices, v_valid_until
    ) RETURNING id INTO v_license_id;

    RETURN jsonb_build_object(
        'license_id', v_license_id,
        'license_key', v_final_key,
        'expires_at', v_valid_until
    );

EXCEPTION WHEN OTHERS THEN
    INSERT INTO public.audit_logs (event_type, metadata) 
    VALUES ('LICENSE_GEN_ERROR', jsonb_build_object('error', SQLERRM, 'email', p_email));
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 7. POLÍTICAS DE SEGURANÇA (RLS)
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.licenses ENABLE ROW LEVEL SECURITY;

-- Usuários só veem seus próprios registros
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own licenses" ON public.licenses FOR SELECT USING (auth.uid() = user_id OR email = (SELECT (auth.jwt() ->> 'email')));

-- Service role pode fazer tudo
DROP POLICY IF EXISTS "Service role full access on payments" ON public.payments;
CREATE POLICY "Service role full access on payments" ON public.payments FOR ALL USING (true);
DROP POLICY IF EXISTS "Service role full access on licenses" ON public.licenses;
CREATE POLICY "Service role full access on licenses" ON public.licenses FOR ALL USING (true);
