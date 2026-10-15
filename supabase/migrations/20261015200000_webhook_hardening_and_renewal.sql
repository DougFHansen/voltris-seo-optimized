-- ============================================================================
-- 20261015200000_webhook_hardening_and_renewal.sql
-- Missao secoes 4 e 7: idempotencia PERSISTENTE de webhooks + renovacao
-- canonica baseada no periodo REAL da Stripe.
--
-- JUSTIFICATIVA DAS NOVAS ESTRUTURAS (missao sec.13 exige justificativa):
--   public.stripe_event_log: unicos requisitos "idempotencia persistente por
--   event.id" e "protecao contra replay" (sec.4/9) exigem registro duravel.
--   Nenhuma tabela existente (audit_logs) tem constraint de unicidade por
--   evento; adicionar UNIQUE em audit_logs afetaria usos antigos. Tabela nova,
--   minima, RLS on sem policies = invisivel fora de service_role.
--
--   renew_subscription_license (reescrita): a versao atual usa colunas que nao
--   existem (license_type/is_active/id) e calcula validade como now()+31 dias,
--   exatamente o que a missao (sec.7) proibe. Passa a usar o period end
--   AUTORITATIVO da Stripe, GREATEST contra eventos fora de ordem, lock
--   advisory por assinatura e restauracao de acesso em renovacao legitima.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Log/idempotencia de eventos Stripe
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.stripe_event_log (
    event_id   text PRIMARY KEY,
    event_type text NOT NULL,
    status     text NOT NULL DEFAULT 'processing',  -- processing | done | error
    detail     jsonb,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW()
);

ALTER TABLE public.stripe_event_log ENABLE ROW LEVEL SECURITY;
-- Sem policies: anon/authenticated nao leem nem escrevem; service_role bypassa.
DROP POLICY IF EXISTS "service role only stripe_event_log" ON public.stripe_event_log;
CREATE POLICY "service role only stripe_event_log"
    ON public.stripe_event_log FOR ALL TO service_role USING (true) WITH CHECK (true);

REVOKE ALL ON public.stripe_event_log FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.stripe_event_log TO service_role;

-- ---------------------------------------------------------------------------
-- 2. Renovacao canonica
-- ---------------------------------------------------------------------------
DROP FUNCTION IF EXISTS public.renew_subscription_license(text, uuid);

CREATE OR REPLACE FUNCTION public.renew_subscription_license(
    p_subscription_pagbank_id text,
    p_payment_id       uuid          DEFAULT NULL,
    p_period_start     timestamptz   DEFAULT NULL,
    p_period_end       timestamptz   DEFAULT NULL,
    p_stripe_invoice_id text         DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
    v_sub         RECORD;
    v_lic         RECORD;
    v_new_expires TIMESTAMPTZ;
    v_interval    INTERVAL;
    v_issued      JSONB;
BEGIN
    IF p_subscription_pagbank_id IS NULL OR p_subscription_pagbank_id = '' THEN
        RAISE EXCEPTION 'SUBSCRIPTION_ID_REQUIRED: informe o id da assinatura Stripe';
    END IF;

    SELECT * INTO v_sub
    FROM public.subscriptions
    WHERE pagbank_subscription_id = p_subscription_pagbank_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'SUBSCRIPTION_NOT_FOUND: %', p_subscription_pagbank_id;
    END IF;

    -- Concorrencia: duas tentativas de renovacao da mesma assinatura se serializam.
    PERFORM pg_advisory_xact_lock(hashtextextended(p_subscription_pagbank_id, 0));

    v_interval := CASE
        WHEN lower(coalesce(v_sub.billing_period, 'month')) IN ('year', 'anual')
            THEN INTERVAL '1 year'
        ELSE INTERVAL '1 month'
    END;

    -- Licenca da assinatura: mesmo plano, dono certo (user_id; fallback e-mail).
    SELECT * INTO v_lic
    FROM public.licenses
    WHERE plan_type = lower(v_sub.plan_type)
      AND (
            (v_sub.user_id IS NOT NULL AND user_id = v_sub.user_id)
         OR (v_sub.user_id IS NULL AND lower(customer_email) = lower(coalesce(v_sub.email, '')))
      )
    ORDER BY revoked ASC, created_at DESC
    LIMIT 1;

    IF FOUND THEN
        -- Periodo da Stripe e autoridade; GREATEST impede evento atrasado/fora de
        -- ordem de encurtar validade ja paga. Sem period_end, soma o intervalo.
        v_new_expires := COALESCE(
            p_period_end,
            GREATEST(COALESCE(v_lic.expires_at, NOW()), NOW()) + v_interval
        );
        v_new_expires := GREATEST(COALESCE(v_lic.expires_at, v_new_expires), v_new_expires);

        UPDATE public.licenses
        SET expires_at = v_new_expires,
            revoked    = FALSE,   -- renovacao legitima restaura o acesso (sec.7)
            notes      = 'Renovada em ' || to_char(NOW(), 'YYYY-MM-DD"T"HH24:MI:SS"Z"')
                        || ' (invoice=' || COALESCE(p_stripe_invoice_id, 'n/d') || ')'
        WHERE license_key = v_lic.license_key;

        UPDATE public.subscriptions
        SET status = 'ACTIVE', updated_at = NOW()
        WHERE pagbank_subscription_id = p_subscription_pagbank_id;

        INSERT INTO public.audit_logs (event_type, metadata)
        VALUES ('LICENSE_RENEWED', jsonb_build_object(
            'license_key',  v_lic.license_key,
            'subscription', p_subscription_pagbank_id,
            'invoice',      p_stripe_invoice_id,
            'payment_id',   p_payment_id::text,
            'new_expires_at', v_new_expires
        ));

        RETURN jsonb_build_object(
            'action', 'renewed',
            'license_key', v_lic.license_key,
            'expires_at', v_new_expires
        );
    END IF;

    -- Sem licença do plano: emitir (idempotente por payment_id) com validade =
    -- periodo pago real. Exige payment_id real — nada de NULL silencioso.
    IF p_payment_id IS NULL THEN
        RAISE EXCEPTION 'RENEW_NO_LICENSE_NO_PAYMENT: assinatura % sem licença do plano "%" e sem payment_id para emitir',
            p_subscription_pagbank_id, v_sub.plan_type;
    END IF;

    v_issued := public.generate_complete_license_v3(
        p_payment_id,
        v_sub.user_id,
        v_sub.email,
        v_sub.plan_type,
        v_sub.billing_period,
        NULL,
        date(p_period_end)
    );

    UPDATE public.subscriptions
    SET status = 'ACTIVE', updated_at = NOW()
    WHERE pagbank_subscription_id = p_subscription_pagbank_id;

    IF v_issued IS NULL OR v_issued = 'null'::jsonb THEN
        RAISE EXCEPTION 'ISSUE_RETURNED_NULL para assinatura %', p_subscription_pagbank_id;
    END IF;

    RETURN v_issued || jsonb_build_object('action', 'issued');
END;
$function$;

-- ---------------------------------------------------------------------------
-- 3b. Artefato de renovacao (ponte desktop <-> servidor autoritativo)
--
-- JUSTIFICATIVA (missao sec.5 e sec.8): o app desktop trata a data embutida na
-- chave como TETO anti-fraude, mas a renovacao legitima muda apenas
-- licenses.expires_at. Sem um comprovante, o desktop nao pode aceitar validade
-- maior (qualquer um editaria o proprio cache). Esta devolve o mesmo
-- SIG16 = generate_voltris_signature(JSON canonico) que a emissao ja usa, ou
-- seja: NENHUM algoritmo novo, e o desktop re-verifica com o verificador que
-- ele ja tinha. So service_role executa (exposto por rota propria com
-- rate limit); nenhuma PII sai daqui.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.get_license_renewal_artifact(
    p_license_key text,
    p_device_id   text DEFAULT NULL
) RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $function$
DECLARE
    v_lic         RECORD;
    v_id6         TEXT;
    v_plan_code   TEXT;
    v_max         INTEGER;
    v_valid_date  DATE;
    v_json        TEXT;
    v_sig         TEXT;
    v_device_ok   BOOLEAN := NULL;
BEGIN
    IF p_license_key IS NULL OR length(btrim(p_license_key)) < 10 THEN
        RAISE EXCEPTION 'LICENSE_KEY_REQUIRED: informe a chave de licenca';
    END IF;

    SELECT * INTO v_lic
    FROM public.licenses
    WHERE upper(license_key) = upper(btrim(p_license_key))
    LIMIT 1;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'LICENSE_NOT_FOUND: %', btrim(p_license_key);
    END IF;

    -- Identidade tirada da PROPRIA chave, para o desktop poder recomputar o
    -- mesmo JSON a partir do que ele ja guarda.
    v_plan_code := upper(split_part(v_lic.license_key, '-', 2));
    v_id6       := split_part(v_lic.license_key, '-', 3);
    v_max := CASE v_plan_code
        WHEN 'STA' THEN 1
        WHEN 'PRO' THEN 3
        WHEN 'ENT' THEN 9999
        WHEN 'TRI' THEN 1
        WHEN 'TRL' THEN 1
        ELSE COALESCE(v_lic.max_devices, 1)
    END;

    -- Validade autoritativa = expires_at do banco (movido apenas pela Stripe).
    v_valid_date := ((COALESCE(v_lic.expires_at, NOW()) AT TIME ZONE 'UTC')::date);

    v_json := format('{"id":"%s","validUntil":"%s","plan":"%s","maxDevices":%s}',
                     v_id6, to_char(v_valid_date, 'YYYY-MM-DD'),
                     lower(v_lic.plan_type), v_max);
    v_sig := public.generate_voltris_signature(v_json);

    IF p_device_id IS NOT NULL AND btrim(p_device_id) <> '' THEN
        SELECT EXISTS (
            SELECT 1 FROM public.license_devices
            WHERE license_key = v_lic.license_key
              AND lower(device_id) = lower(btrim(p_device_id))
        ) INTO v_device_ok;
    END IF;

    INSERT INTO public.audit_logs (event_type, metadata)
    VALUES ('RENEWAL_ARTIFACT_READ', jsonb_build_object(
        'license_key_tail', right(v_lic.license_key, 4),
        'plan_type',        v_lic.plan_type,
        'expires_at',       v_lic.expires_at,
        'revoked',          v_lic.revoked,
        'device_provided',  (p_device_id IS NOT NULL AND btrim(p_device_id) <> '')
    ));

    RETURN jsonb_build_object(
        'valid',               COALESCE(v_lic.revoked, FALSE) = FALSE
                                AND v_lic.expires_at > NOW(),
        'revoked',             COALESCE(v_lic.revoked, FALSE),
        'license_key',         v_lic.license_key,
        'plan_type',           v_lic.plan_type,
        'billing_period',      v_lic.billing_period,
        'max_devices',         v_max,
        'expires_at',          v_lic.expires_at,
        'renewal_valid_until', to_char(v_valid_date, 'YYYYMMDD'),
        'renewal_signature',   v_sig,
        'device_registered',   v_device_ok,
        'server_time',         NOW()
    );
END;
$function$;

DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN
        SELECT p.oid::regprocedure AS sig
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'public'
          AND p.proname = 'get_license_renewal_artifact'
    LOOP
        EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', r.sig);
        EXECUTE format('GRANT  EXECUTE ON FUNCTION %s TO service_role', r.sig);
        RAISE NOTICE '[VOLTRIS] artefato de renovacao restrito a service_role: %', r.sig;
    END LOOP;
END $$;

-- ---------------------------------------------------------------------------
-- 3. Grants: execucao apenas service_role (padrao FASE 10 da reparacao)
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
          AND p.proname = 'renew_subscription_license'
    LOOP
        EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', r.sig);
        EXECUTE format('GRANT  EXECUTE ON FUNCTION %s TO service_role', r.sig);
        RAISE NOTICE '[VOLTRIS] renew restrito a service_role: %', r.sig;
    END LOOP;
END $$;

-- ---------------------------------------------------------------------------
-- 4. Verificacao pos-aplicacao (rodar e conferir):
--    deve listar a renew com 5 params e a tabela de eventos existente.
-- ---------------------------------------------------------------------------
SELECT p.oid::regprocedure AS sig
FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' AND p.proname = 'renew_subscription_license';

SELECT EXISTS (
    SELECT 1 FROM information_schema.tables WHERE table_schema='public' AND table_name='stripe_event_log'
) AS stripe_event_log_ok;

SELECT p.oid::regprocedure AS sig
FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public' AND p.proname = 'get_license_renewal_artifact';

-- Teste da cadeia de assinatura (a RPC nova depende dela; deve retornar 16 hex):
SELECT length(public.generate_voltris_signature('{"id":"123456","validUntil":"2026-11-15","plan":"pro","maxDevices":3}')) = 16 AS signature_fn_ok;

NOTIFY pgrst, 'reload schema';
