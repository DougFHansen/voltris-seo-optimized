-- ==========================================
-- VOLTRIS - STRIPE LICENSE GENERATION FIX
-- Resolve o erro do webhook passando a variável p_billing_period
-- ==========================================

-- 1. Excluir todas as variantes antigas da função para evitar conflito de overloading
DROP FUNCTION IF EXISTS public.generate_complete_license_v3(UUID, UUID, TEXT, TEXT);
DROP FUNCTION IF EXISTS public.generate_complete_license_v3(UUID, UUID, TEXT, TEXT, TEXT);

-- 2. Recriar a função principal aceitando todos os 5 parâmetros exigidos pelo Webhook
CREATE OR REPLACE FUNCTION public.generate_complete_license_v3(
    p_payment_id UUID,
    p_user_id UUID,
    p_email TEXT,
    p_plan_type TEXT,
    p_billing_period TEXT DEFAULT 'month' -- Exigido pelo Webhook do Stripe
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
    -- 1. Determinar intervalo pelo período do Stripe
    IF p_billing_period = 'year' THEN
        v_interval := INTERVAL '1 year';
    ELSE
        v_interval := INTERVAL '1 month';
    END IF;

    -- 2. Determinar Configurações do Plano
    CASE lower(p_plan_type)
        WHEN 'trial' THEN 
            v_plan_code := 'TRI'; v_max_devices := 1;
            v_valid_until := CURRENT_DATE + INTERVAL '15 days';
        WHEN 'standard' THEN 
            v_plan_code := 'STA'; v_max_devices := 1;
            v_valid_until := CURRENT_DATE + v_interval;
        WHEN 'pro' THEN 
            v_plan_code := 'PRO'; v_max_devices := 3;
            v_valid_until := CURRENT_DATE + v_interval;
        WHEN 'enterprise' THEN 
            v_plan_code := 'ENT'; v_max_devices := 9999;
            v_valid_until := CURRENT_DATE + v_interval;
        ELSE
            v_plan_code := 'STA'; v_max_devices := 1;
            v_valid_until := CURRENT_DATE + v_interval;
    END CASE;

    -- 3. Gerar Client ID Aleatório (6 dígitos - igual ao formatado no gerador)
    v_client_id := floor(random() * (999999-100000+1) + 100000)::TEXT;

    -- 4. Preparar Formatos de Data
    v_valid_until_str := to_char(v_valid_until, 'YYYY-MM-DD'); 
    v_key_date_str := to_char(v_valid_until, 'YYYYMMDD');

    -- 5. Criar JSON de Conteúdo
    v_json_content := format('{"id":"%s","validUntil":"%s","plan":"%s","maxDevices":%s}', 
                             v_client_id, v_valid_until_str, lower(p_plan_type), v_max_devices);

    -- 6. Gerar Assinatura via VOLTRIS
    v_signature := public.generate_voltris_signature(v_json_content);

    -- 7. Montar Chave Final
    v_final_key := format('VOLTRIS-%s-%s-%s-%s', v_plan_code, v_client_id, v_key_date_str, v_signature);

    -- 8. Salvar no Banco
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
