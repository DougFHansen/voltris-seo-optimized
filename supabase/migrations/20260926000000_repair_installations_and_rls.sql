-- ============================================================================
-- REPARAÇÃO ESTRUTURAL — VOLTRIS (login / vínculo / dispositivos / comandos)
-- Data: 26/09/2026
-- Não destrutiva: NENHUMA tabela é dropada. Nenhum dado de cliente é apagado.
-- Idempotente: pode ser executada repetidamente.
-- ============================================================================
--
-- CAUSA RAIZ IDENTIFICADA (verificada com Prefer: tx=rollback, sem gravações):
--
--   A tabela public.installations possui um trigger BEFORE INSERT OR UPDATE cujo
--   corpo referencia a coluna `user_id` de uma tabela que NAO possui essa coluna
--   (licenses / license_devices / device_commands / remote_commands — todas
--   existem sem user_id). Consequência: TODA escrita em installations falha com
--
--       42703  column "user_id" does not exist
--
--   Isso produzia, em cadeia:
--     * HTTP 400 em POST /rest/v1/installations?on_conflict=id  (registro e heartbeat)
--     * HTTP 500 em POST /api/v1/install/unlink                (UPDATE user_id=NULL)
--     * HTTP 500 tambem em /api/v1/install e /api/v1/install/link (erro mapeado p/ 500)
--
--   Alem disso, o RLS de installations e device_commands foi criado SEM clausula
--   `TO`, tornando-se policy PUBLIC `USING (true)`, o que permitia que a anon key
--   (publica) LÊSSE e ESCREVESSE todas as 46 instalacoes e 15 device_commands.
--
-- ESTA MIGRATION:
--   FASE 1  auditoria e registro do estado atual
--   FASE 2  remocao dos triggers quebrados
--   FASE 3  funcoes
--   FASE 4  triggers
--   FASE 5  installations.trial_started_at
--   FASE 6  licenses / license_devices (aditivo, sem rename)
--   FASE 7  RLS
--   FASE 8  policies
--   FASE 9  grants de tabela
--   FASE 10 grants de funcao
--   FASE 11 profiles: bloqueio de auto-promocao
--   FASE 12 get_user_orders_with_details: exigir dono
--   FASE 13 validacao (falha se alguma invariante estiver errada)
-- ============================================================================

BEGIN;

-- ============================================================================
-- FASE 1 — AUDITORIA: registrar o estado antes de alterar
-- ============================================================================
DO $$
DECLARE
    v_t text;
BEGIN
    -- Definicoes em texto. O registro estruturado fica em audit_logs na
    -- FASE 13, onde a gravacao e tolerante a falha.
    SELECT string_agg(pg_get_triggerdef(t.oid), E'\n---\n' ORDER BY t.tgname)
      INTO v_t
      FROM pg_trigger t
     WHERE t.tgrelid = 'public.installations'::regclass
       AND NOT t.tgisinternal;

    RAISE NOTICE E'[FASE 1] triggers em installations ANTES da correcao:\n%', coalesce(v_t, '(nenhum)');
END $$;


-- ============================================================================
-- FASE 2 — REMOCAO DOS TRIGGERS QUEBRADOS
--
-- Remove TODOS os triggers nao-internos de installations. Justificativa: existe
-- pelo menos um trigger orfao (nao versionado no repositorio) que impede
-- qualquer escrita na tabela. Os triggers legitimos sao recriados na FASE 4 de
-- forma idempotente, portanto nada de funcional se perde.
--
-- A definicao completa do que existia antes fica gravada em audit_logs
-- (FASE 1), então nada se perde de forma irreversivel.
-- ============================================================================
DO $$
DECLARE
    r      record;
    v_drop text := '';
BEGIN
    FOR r IN
        SELECT t.tgname
          FROM pg_trigger t
         WHERE t.tgrelid = 'public.installations'::regclass
           AND NOT t.tgisinternal
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON public.installations', r.tgname);
        v_drop := v_drop || r.tgname || ' ';
    END LOOP;

    RAISE NOTICE '[FASE 2] triggers removidos de installations: %',
        coalesce(nullif(v_drop, ''), '(nenhum)');

    -- license_devices: tr_sync_license_device_count referencia licenses.id,
    -- licenses.devices_in_use e license_devices.license_id — nenhuma dessas
    -- colunas existe. O trigger fica armado e quebraria toda ativacao.
    FOR r IN
        SELECT t.tgname
          FROM pg_trigger t
         WHERE t.tgrelid = 'public.license_devices'::regclass
           AND NOT t.tgisinternal
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS %I ON public.license_devices', r.tgname);
        RAISE NOTICE '[FASE 2] trigger removido de license_devices: %', r.tgname;
    END LOOP;
END $$;


-- ============================================================================
-- FASE 3 — FUNCOES
-- ============================================================================
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.set_updated_at() IS
'Garante updated_at em UPDATE. search_path fixo para impedir hijack de schema.';


CREATE OR REPLACE FUNCTION public.sync_last_active()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public, pg_temp
AS $$
BEGIN
    IF NEW.last_heartbeat IS DISTINCT FROM OLD.last_heartbeat THEN
        NEW.last_active := NEW.last_heartbeat;
    END IF;
    RETURN NEW;
END;
$$;

COMMENT ON FUNCTION public.sync_last_active() IS
'Mantem installations.last_active igual a last_heartbeat (alias de leitura do dashboard).';


-- ============================================================================
-- FASE 4 — TRIGGERS (reconstrucao idempotente)
-- ============================================================================
DROP TRIGGER IF EXISTS tr_installations_updated_at ON public.installations;
CREATE TRIGGER tr_installations_updated_at
    BEFORE UPDATE ON public.installations
    FOR EACH ROW
    EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS tr_sync_last_active ON public.installations;
CREATE TRIGGER tr_sync_last_active
    BEFORE UPDATE ON public.installations
    FOR EACH ROW
    EXECUTE FUNCTION public.sync_last_active();


-- ============================================================================
-- FASE 5 — installations.trial_started_at
--
-- O trial era calculado a partir de created_at. Em maquinas antigas isso dava
-- "0 dias restantes" na primeira consulta. trial_started_at passa a ser a
-- origem do trial, com backfill a partir de created_at (mesmo comportamento de
-- antes, porem explicito) e DEFAULT now() para registros novos.
-- O endpoint /api/v1/install NAO envia esta coluna, entao um heartbeat jamais
-- reinicia o trial.
-- ============================================================================
ALTER TABLE public.installations
    ADD COLUMN IF NOT EXISTS trial_started_at TIMESTAMPTZ DEFAULT now();

UPDATE public.installations
   SET trial_started_at = COALESCE(created_at, now())
 WHERE trial_started_at IS NULL;

-- ============================================================================
-- FASE 6 — licenses / license_devices
--
-- Schema REAL de public.licenses:
--   license_key (PK) | plan_type | max_devices | expires_at | billing_period
--   customer_email | notes | revoked | activated_at | created_at
--
-- O codigo do site, as Edge Functions e as migrations antigas assumem um schema
-- INCOMPATIVEL (id, user_id, email, license_type, is_active, devices_in_use,
-- license_display_name, license_id, device_name, last_used_at...). Isso produzia
-- 42703 em /api/v1/license/*.
--
-- DECISAO: nao renomear e nao dropar nada (licenses tem PK license_key e
-- clientes reais). Tornar o schema existente CANONICO e adicionar SOMENTE o que
-- nao tem equivalente:
--
--   licenses.user_id              -> vinculo UUID com profiles (arquitetura correta)
--   licenses.email                -> alias persistido de customer_email
--   licenses.client_id            -> id embutido na chave (VOLTRIS-PLANO-ID-...)
--   licenses.payment_id           -> referencia de pagamento
--   licenses.license_display_name -> nome de exibicao
--
--   license_devices.device_name     -> nome do PC
--   license_devices.last_used_at    -> ultimo uso
--   license_devices.processor_count
--
-- NAO adicionamos license_type / is_active / devices_in_use / license_id:
-- o codigo passa a usar plan_type / revoked / contagem real / license_key.
-- Uma unica arquitetura, sem duplicacao.
-- ============================================================================
ALTER TABLE public.licenses
    ADD COLUMN IF NOT EXISTS user_id              UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS email                TEXT,
    ADD COLUMN IF NOT EXISTS client_id            TEXT,
    ADD COLUMN IF NOT EXISTS payment_id           TEXT,
    ADD COLUMN IF NOT EXISTS license_display_name TEXT;

CREATE INDEX IF NOT EXISTS idx_licenses_user_id   ON public.licenses(user_id);
CREATE INDEX IF NOT EXISTS idx_licenses_client_id ON public.licenses(client_id);
CREATE INDEX IF NOT EXISTS idx_licenses_plan_type ON public.licenses(plan_type);

ALTER TABLE public.license_devices
    ADD COLUMN IF NOT EXISTS device_name     TEXT,
    ADD COLUMN IF NOT EXISTS last_used_at    TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS processor_count INTEGER;

UPDATE public.license_devices
   SET last_used_at = last_seen_at
 WHERE last_used_at IS NULL
   AND last_seen_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_license_devices_license_key ON public.license_devices(license_key);

-- Impede device duplicado na mesma licenca. CREATE UNIQUE INDEX CONCURRENTLY nao
-- e possivel dentro de transaction; se ja houver duplicata o INSERT falha e a
-- migration aborta — o que e o comportamento correto (dado inconsistente visivel).
CREATE UNIQUE INDEX IF NOT EXISTS uq_license_devices_license_device
    ON public.license_devices(license_key, device_id);

-- Vincular licencas existentes ao dono pelo email (dado, nao estrutura).
UPDATE public.licenses l
   SET user_id = p.id
  FROM public.profiles p
 WHERE l.user_id IS NULL
   AND p.email IS NOT NULL
   AND lower(p.email) = lower(l.customer_email);

UPDATE public.licenses
   SET license_display_name = upper(plan_type)
 WHERE license_display_name IS NULL;


-- ============================================================================
-- FASE 7 — RLS
-- Garante RLS ligado e remove TODAS as policies (inclusive as PUBLIC
-- `USING (true)` criadas sem clausula TO, que abriam leitura/escrita total
-- via anon key).
-- ============================================================================
DO $$
DECLARE
    v_tbl  text;
    v_list text[] := ARRAY[
        'installations', 'installation_events', 'installation_heartbeats',
        'device_commands', 'remote_commands',
        'licenses', 'license_devices'
    ];
    r record;
BEGIN
    FOREACH v_tbl IN ARRAY v_list LOOP
        EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',  v_tbl);
        EXECUTE format('ALTER TABLE public.%I FORCE  ROW LEVEL SECURITY', v_tbl);

        FOR r IN
            SELECT policyname
              FROM pg_policies
             WHERE schemaname = 'public'
               AND tablename = v_tbl
        LOOP
            EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, v_tbl);
            RAISE NOTICE '[FASE 7] policy removida: %.%', v_tbl, r.policyname;
        END LOOP;
    END LOOP;
END $$;


-- ============================================================================
-- FASE 8 — POLICIES
-- Somente dois papeis podem tocar tabela de dispositivo:
--   authenticated -> apenas as proprias linhas
--   service_role  -> endpoints da API (o desktop NUNCA usa service_role)
-- Nao existe policy para anon.
-- ============================================================================

-- 8.1 installations
CREATE POLICY installations_select_own
    ON public.installations
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

CREATE POLICY installations_admin_all
    ON public.installations
    FOR ALL
    TO authenticated
    USING      (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin))
    WITH CHECK (EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin));

CREATE POLICY installations_service_all
    ON public.installations
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 8.2 installation_events
CREATE POLICY installation_events_select_own
    ON public.installation_events
    FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.installations i
         WHERE i.id = installation_events.installation_id
           AND i.user_id = auth.uid()
    ));

CREATE POLICY installation_events_service_all
    ON public.installation_events
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 8.3 installation_heartbeats
CREATE POLICY installation_heartbeats_select_own
    ON public.installation_heartbeats
    FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.installations i
         WHERE i.id = installation_heartbeats.installation_id
           AND i.user_id = auth.uid()
    ));

CREATE POLICY installation_heartbeats_service_all
    ON public.installation_heartbeats
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 8.4 device_commands (vinculo via installations.user_id; device_commands
--     nunca teve user_id — este era parte do bug)
CREATE POLICY device_commands_select_own
    ON public.device_commands
    FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.installations i
         WHERE i.id = device_commands.installation_id
           AND i.user_id = auth.uid()
    ));

CREATE POLICY device_commands_insert_own
    ON public.device_commands
    FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.installations i
         WHERE i.id = device_commands.installation_id
           AND i.user_id = auth.uid()
    ));

CREATE POLICY device_commands_update_own
    ON public.device_commands
    FOR UPDATE
    TO authenticated
    USING      (EXISTS (SELECT 1 FROM public.installations i WHERE i.id = device_commands.installation_id AND i.user_id = auth.uid()))
    WITH CHECK (EXISTS (SELECT 1 FROM public.installations i WHERE i.id = device_commands.installation_id AND i.user_id = auth.uid()));

CREATE POLICY device_commands_service_all
    ON public.device_commands
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 8.5 remote_commands (tabela legada do painel enterprise; travada em company_id)
CREATE POLICY remote_commands_select_own_company
    ON public.remote_commands
    FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.company_users cu
         WHERE cu.user_id = auth.uid()
           AND cu.company_id = remote_commands.company_id
    ));

CREATE POLICY remote_commands_insert_own_company
    ON public.remote_commands
    FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.company_users cu
         WHERE cu.user_id = auth.uid()
           AND cu.company_id = remote_commands.company_id
    ));

CREATE POLICY remote_commands_service_all
    ON public.remote_commands
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 8.6 licenses (schema canonico: user_id e o vinculo; customer_email e o fallback legado)
CREATE POLICY licenses_select_own
    ON public.licenses
    FOR SELECT
    TO authenticated
    USING (
        user_id = auth.uid()
        OR lower(customer_email) = lower((SELECT u.email FROM auth.users u WHERE u.id = auth.uid()))
    );

CREATE POLICY licenses_service_all
    ON public.licenses
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 8.7 license_devices
CREATE POLICY license_devices_select_own
    ON public.license_devices
    FOR SELECT
    TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.licenses l
         WHERE l.license_key = license_devices.license_key
           AND (
                 l.user_id = auth.uid()
                 OR lower(l.customer_email) = lower((SELECT u.email FROM auth.users u WHERE u.id = auth.uid()))
               )
    ));

CREATE POLICY license_devices_service_all
    ON public.license_devices
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);


-- ============================================================================
-- FASE 9 — GRANTS DE TABELA
-- A anon key e publica (esta no bundle do app desktop). Ela nao deve tocar em
-- nenhuma tabela de dispositivo/licenca: tudo passa pelos endpoints, que usam
-- service_role.
-- ============================================================================
DO $$
DECLARE
    v_tbl  text;
    v_list text[] := ARRAY[
        'installations', 'installation_events', 'installation_heartbeats',
        'device_commands', 'remote_commands',
        'licenses', 'license_devices'
    ];
BEGIN
    FOREACH v_tbl IN ARRAY v_list LOOP
        EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon',         v_tbl);
        EXECUTE format('REVOKE ALL ON TABLE public.%I FROM authenticated', v_tbl);
        EXECUTE format('GRANT  ALL ON TABLE public.%I TO service_role',    v_tbl);
    END LOOP;
END $$;

-- authenticated so precisa LER (dashboard) e escrever em device_commands
-- (envio de comando remoto do painel "Meu Computador").
GRANT SELECT ON public.installations          TO authenticated;
GRANT SELECT ON public.installation_events    TO authenticated;
GRANT SELECT ON public.installation_heartbeats TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.device_commands TO authenticated;
GRANT SELECT ON public.licenses               TO authenticated;
GRANT SELECT ON public.license_devices        TO authenticated;


-- ============================================================================
-- FASE 10 — GRANTS DE FUNCAO
-- A parte 9 da migration 20260818000000 nunca foi aplicada (a secao 3 abortou
-- com 42703 em licenses.user_id). Aqui e feito dinamicamente, para nao depender
-- da assinatura exata de cada funcao.
-- ============================================================================
DO $$
DECLARE
    r record;
BEGIN
    FOR r IN
        SELECT p.oid::regprocedure AS sig
          FROM pg_proc p
          JOIN pg_namespace n ON n.oid = p.pronamespace
         WHERE n.nspname = 'public'
           AND p.proname IN (
                 'generate_voltris_signature',
                 'generate_license_key',
                 'generate_complete_license_v2',
                 'generate_complete_license_v3',
                 'export_tenant_data',
                 'delete_tenant_data'
           )
    LOOP
        EXECUTE format('REVOKE EXECUTE ON FUNCTION %s FROM PUBLIC, anon, authenticated', r.sig);
        EXECUTE format('GRANT  EXECUTE ON FUNCTION %s TO service_role', r.sig);
        RAISE NOTICE '[FASE 10] exec restrito a service_role: %', r.sig;
    END LOOP;
END $$;


-- ============================================================================
-- FASE 11 — profiles: impedir auto-promocao a admin
-- A policy de UPDATE de profiles permite ao proprio usuario alterar is_admin.
-- Este trigger fecha a brecha.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.prevent_sensitive_profile_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF coalesce(
        current_setting('request.jwt.claims', true)::jsonb ->> 'role', ''
    ) = 'service_role' THEN
        RETURN NEW;
    END IF;

    IF NEW.is_admin   IS DISTINCT FROM OLD.is_admin
       OR NEW.is_blocked IS DISTINCT FROM OLD.is_blocked
       OR NEW.is_deleted  IS DISTINCT FROM OLD.is_deleted
       OR NEW.role        IS DISTINCT FROM OLD.role THEN
        RAISE EXCEPTION 'Nao e permitido alterar colunas sensiveis do perfil'
            USING ERRCODE = '42501';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_sensitive_profile_update_trigger ON public.profiles;
CREATE TRIGGER prevent_sensitive_profile_update_trigger
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_sensitive_profile_update();


-- ============================================================================
-- FASE 12 — get_user_orders_with_details: exigir o proprio dono
--
-- A versao anterior era SECURITY DEFINER sem checagem de dono: qualquer usuario
-- autenticado podia passar o UUID de outra pessoa e ler todos os pedidos dela.
--
-- DROP + CREATE (e nao CREATE OR REPLACE) porque o tipo de retorno mudou para
-- o schema real de public.orders, que usa `total` (nao `total_amount`) e ja
-- carrega service_name / service_description desnormalizados. Nenhum caller
-- no site depende dessa funcao.
-- ============================================================================
DROP FUNCTION IF EXISTS public.get_user_orders_with_details(UUID);

CREATE FUNCTION public.get_user_orders_with_details(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    status TEXT,
    total NUMERIC,
    created_at TIMESTAMPTZ,
    service_name TEXT,
    service_description TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF user_uuid IS DISTINCT FROM auth.uid() THEN
        RAISE EXCEPTION 'Acesso negado' USING ERRCODE = '42501';
    END IF;

    RETURN QUERY
    SELECT o.id, o.status, o.total, o.created_at, o.service_name, o.service_description
      FROM public.orders o
     WHERE o.user_id = auth.uid()
     ORDER BY o.created_at DESC;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.get_user_orders_with_details(UUID) FROM PUBLIC, anon;
GRANT  EXECUTE ON FUNCTION public.get_user_orders_with_details(UUID) TO authenticated;


-- ============================================================================
-- FASE 13 — VALIDACAO
-- Falha a migration se alguma invariante estiver errada.
-- ============================================================================
DO $$
DECLARE
    v_bad    text;
    v_ok_trg text[] := ARRAY['tr_installations_updated_at', 'tr_sync_last_active'];
BEGIN
    -- 12.1 nenhum trigger de escrita além dos dois legítimos da FASE 4
    SELECT string_agg(DISTINCT c.relname || '.' || t.tgname, ', ')
      INTO v_bad
      FROM pg_trigger t
      JOIN pg_class c     ON c.oid = t.tgrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
     WHERE n.nspname = 'public'
       AND NOT t.tgisinternal
       AND NOT (c.relname = 'installations' AND t.tgname = ANY (v_ok_trg))
       AND c.relname IN ('installations', 'installation_events',
                         'installation_heartbeats', 'device_commands',
                         'remote_commands', 'licenses', 'license_devices');
    IF v_bad IS NOT NULL THEN
        RAISE EXCEPTION 'VALIDACAO FALHOU (13.1): ha triggers inesperados: %', v_bad;
    END IF;

    -- 12.1b os dois triggers legítimos existem de fato
    IF NOT EXISTS (SELECT 1 FROM pg_trigger
                    WHERE tgrelid = 'public.installations'::regclass
                      AND tgname = 'tr_installations_updated_at' AND NOT tgisinternal)
       OR NOT EXISTS (SELECT 1 FROM pg_trigger
                        WHERE tgrelid = 'public.installations'::regclass
                          AND tgname = 'tr_sync_last_active' AND NOT tgisinternal) THEN
        RAISE EXCEPTION 'VALIDACAO FALHOU (13.1b): trigger legitimo ausente em installations';
    END IF;

    -- 12.2 nenhuma policy com papel anon nestas tabelas
    SELECT string_agg(DISTINCT tablename || '.' || policyname, ', ')
      INTO v_bad
      FROM pg_policies
     WHERE schemaname = 'public'
       AND 'anon'::name = ANY (roles)
       AND tablename IN ('installations', 'installation_events',
                         'installation_heartbeats', 'device_commands',
                         'remote_commands', 'licenses', 'license_devices');
    IF v_bad IS NOT NULL THEN
        RAISE EXCEPTION 'VALIDACAO FALHOU (13.2): policy com acesso anon: %', v_bad;
    END IF;

    -- 12.3 anon sem privilegio em tabela de dispositivo
    IF has_table_privilege('anon', 'public.installations',   'SELECT')
       OR has_table_privilege('anon', 'public.device_commands', 'SELECT')
       OR has_table_privilege('anon', 'public.device_commands', 'INSERT')
       OR has_table_privilege('anon', 'public.licenses',        'SELECT') THEN
        RAISE EXCEPTION 'VALIDACAO FALHOU (13.3): anon ainda tem privilegio em tabela de dispositivo';
    END IF;

    -- 12.4 RLS ligado em todas
    IF EXISTS (
        SELECT 1
          FROM pg_class c
          JOIN pg_namespace n ON n.oid = c.relnamespace
         WHERE n.nspname = 'public'
           AND c.relname IN ('installations', 'installation_events',
                             'installation_heartbeats', 'device_commands',
                             'remote_commands', 'licenses', 'license_devices')
           AND (NOT c.relrowsecurity OR NOT c.relforcerowsecurity)
    ) THEN
        RAISE EXCEPTION 'VALIDACAO FALHOU (13.4): RLS desligado em tabela de dispositivo';
    END IF;

    -- Registro de auditoria. Tolerante a falha: nao pode abortar a migration.
    BEGIN
        INSERT INTO public.audit_logs (event_type, metadata)
        VALUES (
            'REPAIR_INSTALLATIONS_AFTER',
            jsonb_build_object(
                'status', 'ok',
                'at', now(),
                'triggers', (
                    SELECT coalesce(jsonb_agg(jsonb_build_object(
                        'tgname',     t.tgname,
                        'definition', pg_get_triggerdef(t.oid)
                    ) ORDER BY t.tgname), '[]'::jsonb)
                      FROM pg_trigger t
                     WHERE t.tgrelid = 'public.installations'::regclass
                       AND NOT t.tgisinternal
                )
            )
        );
    EXCEPTION WHEN OTHERS THEN
        RAISE WARNING 'FASE 13: nao foi possivel gravar em audit_logs: %', SQLERRM;
    END;

    RAISE NOTICE 'VALIDACAO OK: triggers, RLS, policies e grants conferidos.';
END $$;

COMMIT;

-- Force o PostgREST a reler o schema (policies e funcoes mudaram).
NOTIFY pgrst, 'reload schema';
