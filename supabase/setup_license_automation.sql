-- =====================================================
-- ESTRUTURA PARA AUTOMAÇÃO DE LICENÇAS - VOLTRIS
-- Execute este script no SQL Editor do Supabase
-- =====================================================

-- 1. TABELA DE LOGS DE AUDITORIA (Para rastrear falhas críticas)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event TEXT NOT NULL,
    details JSONB,
    severity TEXT DEFAULT 'info',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. FUNÇÃO RPC PARA GERAÇÃO ATÔMICA DE LICENÇA (REQUISITO 3)
-- Esta função é chamada pelo Webhook via .rpc()
CREATE OR REPLACE FUNCTION generate_complete_license_v2(
    p_payment_id UUID,
    p_email TEXT,
    p_license_type license_type
) RETURNS JSONB AS $$
DECLARE
    v_license_key TEXT;
    v_max_devices INTEGER;
    v_expiry_date TIMESTAMPTZ;
    v_client_id TEXT;
    v_result JSONB;
BEGIN
    -- 1. Verificar se já existe licença para este pagamento (Idempotência)
    IF EXISTS (SELECT 1 FROM licenses WHERE payment_id = p_payment_id) THEN
        SELECT json_build_object('success', true, 'msg', 'License already exists') INTO v_result;
        RETURN v_result;
    END IF;

    -- 2. Obter configurações do plano
    SELECT max_devices INTO v_max_devices FROM license_plans WHERE code = p_license_type;
    IF v_max_devices IS NULL THEN v_max_devices := 1; END IF;

    -- 3. Calcular expiração
    v_expiry_date := calculate_expiry_date(p_license_type);

    -- 4. Gerar chave única baseada em hashing
    -- ID curto para a chave
    v_client_id := UPPER(SUBSTRING(REPLACE(p_payment_id::TEXT, '-', ''), 1, 8));
    
    -- Chama a função de hashing já existente no banco (generate_license_key)
    v_license_key := generate_license_key(v_client_id, v_expiry_date::DATE, p_license_type::TEXT);

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
