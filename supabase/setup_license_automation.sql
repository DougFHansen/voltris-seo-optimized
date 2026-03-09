-- =====================================================
-- ESTRUTURA PARA PAGAMENTOS E LICENÇAS - VOLTRIS
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- 1. TABELA DE PAGAMENTOS (ESSENCIAL PARA O CHECKOUT)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    preference_id TEXT UNIQUE NOT NULL, -- ID que enviamos ao PagBank
    payment_id TEXT, -- ID que o PagBank nos devolve
    email TEXT NOT NULL,
    full_name TEXT,
    license_type TEXT NOT NULL DEFAULT 'pro',
    amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, cancelled, rejected
    processed_at TIMESTAMPTZ,
    mercado_pago_data JSONB, -- Usamos para guardar o log completo do PagBank
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA DE LOGS DE AUDITORIA
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event TEXT NOT NULL,
    details JSONB,
    severity TEXT DEFAULT 'info',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AJUSTE NA TABELA DE LICENÇAS (Garantir que comporte o payment_id)
-- Se a tabela de licenças já existir, apenas adicionamos a coluna se necessário
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='licenses' AND column_name='payment_id') THEN
        ALTER TABLE public.licenses ADD COLUMN payment_id UUID REFERENCES public.payments(id);
    END IF;
END $$;

-- 4. FUNÇÃO RPC PARA GERAÇÃO ATÔMICA DE LICENÇA
CREATE OR REPLACE FUNCTION generate_complete_license_v2(
    p_payment_id UUID,
    p_email TEXT,
    p_license_type TEXT
) RETURNS JSONB AS $$
DECLARE
    v_license_key TEXT;
    v_max_devices INTEGER;
    v_expiry_date TIMESTAMPTZ;
    v_client_id TEXT;
    v_result JSONB;
BEGIN
    -- 1. Verificar se já existe licença para este pagamento
    IF EXISTS (SELECT 1 FROM licenses WHERE payment_id = p_payment_id) THEN
        SELECT json_build_object('success', true, 'msg', 'License already exists') INTO v_result;
        RETURN v_result;
    END IF;

    -- 2. Obter configurações do plano (Ajuste conforme sua lógica de max_devices)
    v_max_devices := 1; 

    -- 3. Calcular data de expiração (Assume que existe a função calculate_expiry_date)
    BEGIN
        v_expiry_date := calculate_expiry_date(p_license_type);
    EXCEPTION WHEN OTHERS THEN
        v_expiry_date := NOW() + interval '1 year';
    END;

    -- 4. Gerar chave única
    v_client_id := UPPER(SUBSTRING(REPLACE(p_payment_id::TEXT, '-', ''), 1, 8));
    
    -- Usar função de hashing se existir, senão gerar randômico
    BEGIN
        v_license_key := generate_license_key(v_client_id, v_expiry_date::DATE, p_license_type);
    EXCEPTION WHEN OTHERS THEN
        v_license_key := UPPER(SUBSTRING(REPLACE(gen_random_uuid()::TEXT, '-', ''), 1, 16));
    END;

    -- 5. Inserir Licença
    INSERT INTO licenses (
        license_key,
        payment_id,
        email,
        license_type,
        max_devices,
        expires_at,
        is_active,
        created_at
    ) VALUES (
        v_license_key,
        p_payment_id,
        p_email,
        p_license_type,
        v_max_devices,
        v_expiry_date,
        true,
        NOW()
    );

    v_result := json_build_object(
        'success', true, 
        'license_key', v_license_key, 
        'expires_at', v_expiry_date
    );
    
    RETURN v_result;

EXCEPTION WHEN OTHERS THEN
    RETURN json_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
