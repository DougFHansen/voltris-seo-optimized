-- ============================================================================
-- 20261015180000_fix_generate_complete_license_v3.sql
-- Corrige a EMISSAO de licencas via RPC sem tocar em nenhuma licenca existente.
--
-- DIAGNOSTICO REAL (verificado em 2026-10-15 contra o banco de producao):
--   Existem 2 sobrecargas de public.generate_complete_license_v3:
--
--   A) generate_complete_license_v3(uuid, uuid, text, text, text)
--      - Insere em `license_type` e faz `RETURNING id`: colunas que NAO existem
--        no schema canonico de public.licenses (42703).
--      - `EXCEPTION WHEN OTHERS ... RETURN NULL` engole o erro -> o webhook
--        recebe NULL e acha que "gerou". Falha silenciosa.
--      - ASSINATURA: usa generate_voltris_signature (SHA-256 puro de
--        payload+segredo) = o mecanismo CANONICO aceito pelo app C#, pelas Edge
--        Functions e pela licenca Pro ja existente (verificado por teste).
--
--   B) generate_complete_license_v3(text,...,text, int, int) — 7 args, todos
--      com DEFAULT:
--      - Escreve o schema canonico, mas grava payment_id/user_id APENAS no
--        campo de texto `notes` (vinculo incorreto).
--      - ASSINATURA: HMAC-SHA256 com segredo embutido no corpo = NAO-canonica.
--        Teste real: 6 das 7 licencas Standard existentes foram geradas por ela.
--      - Como todos os parametros tem DEFAULT, ela TAMBEM casa com a chamada
--        nomeada de 5 argumentos do webhook -> o PostgREST pode resolver como
--        chamada ambigua e recusar o call ANTES de executar qualquer corpo
--        (por isso nao ha LICENSE_GEN_ERROR em audit_logs).
--
-- DECISOES DESTA MIGRATION (itens 1-5, 14, 15 da missao):
--   1. NADA toca nas 8 linhas existentes de public.licenses. As chaves continuam
--      validas no banco; a validacao de ativacao nao depende de quem as gerou.
--   2. A sobrecarga B e RENOMEADA para generate_complete_license_v3_legacy_hmac
--      (nao apagada) — preserves comportamento para qualquer caller explicito —
--      e removida da resolucao de ambiguidade do nome `generate_complete_license_v3`.
--   3. A sobrecarga A e RECONSTRUIDA no schema canonico, com assinatura canonica
--      (generate_voltris_signature), erros EXPLICITOS (sem NULL silencioso),
--      idempotencia por payment_id e advisory lock para corrida.
--   4. O status do pagamento e atualizado DENTRO da mesma transacao da emissao:
--      ou licencia+pagamento aprovam juntos, ou nada acontece (rollback).
--   5. EXEC apenas para service_role (mesma politica da FASE 10 da reparacao).
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Remove a ambiguidade: renomeia a sobrecarga legada de 7 args (HMAC).
--    Idempotente: so age se ela ainda estiver no lugar.
-- ---------------------------------------------------------------------------
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'public'
          AND p.proname = 'generate_complete_license_v3'
          AND p.pronargs = 7
    ) THEN
        ALTER FUNCTION public.generate_complete_license_v3(text, text, text, text, text, integer, integer)
            RENAME TO generate_complete_license_v3_legacy_hmac;
        RAISE NOTICE '[VOLTRIS] Sobrecarga legada (HMAC, 7 args) renomeada para generate_complete_license_v3_legacy_hmac';
    END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 2. Dropa a versao UUID quebrada e cria a versao canonica.
-- ---------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.generate_complete_license_v3(uuid, uuid, text, text, text);

CREATE OR REPLACE FUNCTION public.generate_complete_license_v3(
    p_payment_id       uuid,
    p_user_id          uuid          DEFAULT NULL,
    p_email            text          DEFAULT NULL,
    p_plan_type        text          DEFAULT 'standard',
    p_billing_period   text          DEFAULT 'month',
    p_stripe_session_id text         DEFAULT NULL,
    p_valid_until      date          DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
    v_client_id            TEXT;
    v_plan_code            TEXT;
    v_max_devices          INTEGER;
    v_valid_until          DATE;
    v_valid_until_str      TEXT;
    v_key_date_str         TEXT;
    v_json_content         TEXT;
    v_signature            TEXT;
    v_final_key            TEXT;
    v_display_name         TEXT;
    v_existing_key         TEXT;
    v_pay                  RECORD;
    v_attempt              INTEGER;
BEGIN
    -- ========================================================================
    -- VALIDACAS EXPLICITAS (item 4: nenhum caminho retorna NULL silencioso)
    -- ========================================================================
    IF p_payment_id IS NULL THEN
        RAISE EXCEPTION 'PAYMENT_ID_REQUIRED: a emissao exige o payment_id real (idempotencia por pagamento)';
    END IF;

    IF lower(p_plan_type) NOT IN ('trial', 'standard', 'pro', 'enterprise') THEN
        RAISE EXCEPTION 'INVALID_PLAN_TYPE: % (esperado: trial|standard|pro|enterprise)', p_plan_type;
    END IF;

    IF p_billing_period IS NOT NULL
       AND lower(p_billing_period) NOT IN ('month', 'year', 'mensal', 'anual') THEN
        RAISE EXCEPTION 'INVALID_BILLING_PERIOD: % (esperado: month|year)', p_billing_period;
    END IF;

    -- Pagamento precisa existir e nao pode estar liquidado-negativo
    -- (refund/cancel/fail). checkout.session.completed = liquido; a prova
    -- Stripe fica no stripe_id gravado aqui, dentro da mesma transacao.
    SELECT id, status, plan_type, user_id, email INTO v_pay
    FROM public.payments
    WHERE id = p_payment_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'PAYMENT_NOT_FOUND: pagamento % inexistente em public.payments', p_payment_id;
    END IF;

    IF lower(coalesce(v_pay.status, '')) IN
       ('refunded', 'charged_back', 'chargeback', 'canceled', 'cancelled',
        'failed', 'estornado', 'devolvido', 'cancelado') THEN
        RAISE EXCEPTION 'PAYMENT_NOT_SETTLED: pagamento % esta com status "%"', p_payment_id, v_pay.status;
    END IF;

    IF v_pay.plan_type IS NOT NULL
       AND lower(v_pay.plan_type) <> lower(p_plan_type) THEN
        RAISE EXCEPTION 'PAYMENT_PLAN_MISMATCH: pagamento % e do plano "%", licensa pedida "%"',
            p_payment_id, v_pay.plan_type, p_plan_type;
    END IF;

    -- user_id, quando informado, precisa ser um usuario real (item 9)
    IF p_user_id IS NOT NULL AND NOT EXISTS (SELECT 1 FROM auth.users WHERE id = p_user_id) THEN
        RAISE EXCEPTION 'USER_NOT_FOUND: auth.users não contém %', p_user_id;
    END IF;

    -- ========================================================================
    -- IDEMPOTENCIA + CONCORRENCIA (item 5)
    -- Lock transacional por pagamento: duas chamadas simultaneas para o mesmo
    -- payment_id se serializam; a segunda retorna a chave ja emitida.
    -- ========================================================================
    PERFORM pg_advisory_xact_lock(hashtextextended(p_payment_id::text, 0));

    SELECT license_key INTO v_existing_key
    FROM public.licenses
    WHERE payment_id = p_payment_id::text
    LIMIT 1;

    IF FOUND THEN
        -- Garantia extra: mesmo no caminho idempotente, o pagamento fica aprovado.
        UPDATE public.payments
        SET status     = 'approved',
            stripe_id  = COALESCE(stripe_id, p_stripe_session_id),
            updated_at = NOW()
        WHERE id = p_payment_id
          AND lower(coalesce(status, '')) <> 'approved';

        RETURN jsonb_build_object(
            'success', TRUE,
            'already_issued', TRUE,
            'license_key', v_existing_key,
            'payment_id', p_payment_id::text,
            'user_id', COALESCE(p_user_id::text, v_pay.user_id::text),
            'expires_at', (SELECT expires_at FROM public.licenses WHERE license_key = v_existing_key)
        );
    END IF;

    -- ========================================================================
    -- CONFIGURACAO DO PLANO (mapeamento canonico; pro = 3 dispositivos)
    -- p_valid_until permite o fim de periodo REAL confirmado na Stripe (item 8);
    -- sem ele, usa a duracao do periodo a partir de hoje (comportamento antigo).
    -- ========================================================================
    CASE lower(p_plan_type)
        WHEN 'trial' THEN
            v_plan_code := 'TRI'; v_max_devices := 1;
            v_valid_until := CURRENT_DATE + INTERVAL '15 days';
        WHEN 'standard' THEN
            v_plan_code := 'STA'; v_max_devices := 1;
            v_valid_until := CURRENT_DATE + (CASE WHEN lower(coalesce(p_billing_period, 'month')) IN ('year', 'anual') THEN INTERVAL '1 year' ELSE INTERVAL '1 month' END);
        WHEN 'pro' THEN
            v_plan_code := 'PRO'; v_max_devices := 3;
            v_valid_until := CURRENT_DATE + (CASE WHEN lower(coalesce(p_billing_period, 'month')) IN ('year', 'anual') THEN INTERVAL '1 year' ELSE INTERVAL '1 month' END);
        WHEN 'enterprise' THEN
            v_plan_code := 'ENT'; v_max_devices := 9999;
            v_valid_until := CURRENT_DATE + (CASE WHEN lower(coalesce(p_billing_period, 'month')) IN ('year', 'anual') THEN INTERVAL '1 year' ELSE INTERVAL '1 month' END);
    END CASE;

    IF p_valid_until IS NOT NULL AND lower(p_plan_type) <> 'trial' THEN
        IF p_billing_period IS NOT NULL
           AND lower(p_billing_period) NOT IN ('month', 'year', 'mensal', 'anual') THEN
            RAISE EXCEPTION 'INVALID_BILLING_PERIOD: % (esperado: month|year)', p_billing_period;
        END IF;
        v_valid_until := p_valid_until;
    END IF;

    v_valid_until_str := to_char(v_valid_until, 'YYYY-MM-DD');
    v_key_date_str    := to_char(v_valid_until, 'YYYYMMDD');

    v_display_name := CASE lower(p_plan_type)
        WHEN 'trial'      THEN 'Trial'
        WHEN 'standard'   THEN 'VOLTRIS STANDARD'
        WHEN 'pro'        THEN 'VOLTRIS PRO'
        WHEN 'enterprise' THEN 'VOLTRIS ENTERPRISE'
    END;

    -- ========================================================================
    -- CHAVE CANONICA (identica ao LicenseGenerator C# e a licenca Pro atual):
    --   JSON  = {"id":"<6>","validUntil":"YYYY-MM-DD","plan":"<lower>","maxDevices":<n>}
    --   SIG   = upper(hex(sha256(JSON + segredo)))[0..16]  via generate_voltris_signature
    --   KEY   = VOLTRIS-<COD>-<ID6>-<YYYYMMDD>-<SIG16>
    -- ========================================================================
    v_attempt := 0;
    LOOP
        v_attempt := v_attempt + 1;
        v_client_id := floor(random() * (999999 - 100000 + 1) + 100000)::TEXT;

        v_json_content := format('{"id":"%s","validUntil":"%s","plan":"%s","maxDevices":%s}',
                                 v_client_id, v_valid_until_str, lower(p_plan_type), v_max_devices);
        v_signature    := public.generate_voltris_signature(v_json_content);
        v_final_key    := format('VOLTRIS-%s-%s-%s-%s', v_plan_code, v_client_id, v_key_date_str, v_signature);

        EXIT WHEN NOT EXISTS (SELECT 1 FROM public.licenses WHERE license_key = v_final_key);
        IF v_attempt >= 12 THEN
            RAISE EXCEPTION 'KEY_COLLISION: nao foi possivel gerar chave unica apos % tentativas', v_attempt;
        END IF;
    END LOOP;

    -- ========================================================================
    -- INSERT NO SCHEMA CANONICO (plan_type / license_key PK; sem id, sem
    -- license_type, sem is_active) + vinculo real de user/payment/email.
    -- ========================================================================
    INSERT INTO public.licenses (
        payment_id, user_id, email, customer_email, client_id, license_key,
        plan_type, billing_period, max_devices, expires_at,
        license_display_name, revoked, notes, activated_at
    ) VALUES (
        p_payment_id::text,
        COALESCE(p_user_id, v_pay.user_id),
        COALESCE(p_email, v_pay.email),
        COALESCE(p_email, v_pay.email),
        v_client_id,
        v_final_key,
        lower(p_plan_type),
        CASE WHEN lower(coalesce(p_billing_period, 'month')) IN ('year', 'anual') THEN 'year' ELSE 'month' END,
        v_max_devices,
        v_valid_until,
        v_display_name,
        FALSE,
        'Emitida via RPC canonica generate_complete_license_v3',
        NULL
    );

    -- ========================================================================
    -- PAGAMENTO APROVADO NA MESMA TRANSAcao (item 10): liquidez ja provada
    -- pelo evento Stripe (payment_status=paid) checado pelo webhook ANTES de
    -- chamar este RPC; aqui grava-se a prova (stripe_id) junto do status.
    -- ========================================================================
    UPDATE public.payments
    SET status     = 'approved',
        stripe_id  = COALESCE(stripe_id, p_stripe_session_id),
        user_id    = COALESCE(user_id, p_user_id),
        updated_at = NOW()
    WHERE id = p_payment_id;

    RETURN jsonb_build_object(
        'success', TRUE,
        'already_issued', FALSE,
        'license_key', v_final_key,
        'plan_type', lower(p_plan_type),
        'billing_period', CASE WHEN lower(coalesce(p_billing_period, 'month')) IN ('year', 'anual') THEN 'year' ELSE 'month' END,
        'max_devices', v_max_devices,
        'license_display_name', v_display_name,
        'user_id', COALESCE(p_user_id::text, v_pay.user_id::text),
        'payment_id', p_payment_id::text,
        'expires_at', v_valid_until::timestamp with time zone
    );
END;
$function$;

-- ---------------------------------------------------------------------------
-- 3. GRANTS: emissor apenas service_role (novo RPC e o legado renomeado).
-- ---------------------------------------------------------------------------
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT p.oid::regprocedure AS sig
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'public'
          AND p.proname IN ('generate_complete_license_v3', 'generate_complete_license_v3_legacy_hmac')
    LOOP
        EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', r.sig);
        EXECUTE format('GRANT  EXECUTE ON FUNCTION %s TO service_role', r.sig);
        RAISE NOTICE '[VOLTRIS] grants de emissao restritos a service_role: %', r.sig;
    END LOOP;
END $$;

-- ---------------------------------------------------------------------------
-- 4. Verificacao pos-aplicacao (imprima o resultado no SQL editor):
--    deve existir AGORA apenas 1 sobrecarga com o nome do webhook.
-- ---------------------------------------------------------------------------
SELECT p.oid::regprocedure AS sig, p.prorettype::regtype AS returns
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.proname IN ('generate_complete_license_v3', 'generate_complete_license_v3_legacy_hmac')
ORDER BY p.proname;

NOTIFY pgrst, 'reload schema';
