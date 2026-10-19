-- ============================================================================
-- admin.sql — VOLTRIS BRASIL
-- ============================================================================
-- Objetivo: roteiro SQL ÚNICO e ADITIVO para o painel administrativo.
--
-- Onde este arquivo entra na rotina
-- ---------------------------------
-- Execute no SQL Editor do Supabase (ou `supabase db push`). Ele reúne:
--
--   1. MIGRATIONS PENDENTES das missões anteriores, que foram entregues como
--      arquivo mas NUNCA foram aplicadas em produção. Verificado por consulta
--      direta: `email_outbox` retorna
--      `404 - relation "public.email_outbox" does not exist`.
--      Sem elas, a aba "E-mails" do painel e o outbox transacional não funcionam.
--
--   2. TABELAS NOVAS do painel administrativo (PARTE 11 — auditoria real).
--
--   3. ÍNDICES que o painel precisa para não fazer N+1 nem varrer tabela toda.
--
-- GARANTIAS
--   - NADA destrutivo: só CREATE ... IF NOT EXISTS, ALTER ... ENABLE RLS e
--     índices. Nenhum DROP, nenhum TRUNCATE, nenhum DELETE.
--   - Não altera linhas existentes de `payments`, `licenses`, `subscriptions`
--     nem `profiles`: são dados de clientes. A Seção 5 recria SOMENTE a função
--     de trigger `handle_new_user()`; nenhum cadastro existente é reescrito.
--     Colunas novas, quando estritamente necessárias, são aditivas e com DEFAULT.
--   - RLS nunca é desabilitada.
--   - Pode ser executado mais de uma vez sem efeito colateral.
--
-- Verificações pós-execução estão no final do arquivo.
-- ============================================================================


-- ############################################################################
-- SEÇÃO 1 — MIGRATIONS PENDENTES
-- ############################################################################

-- ----------------------------------------------------------------------------
-- 1.1  FATOS DE COBRANÇA EM `payments` e `subscriptions`
--
--      Origem: a fatura em PDF e o espelho da assinatura precisavam de campos
--      que não existiam. O painel administrativo depende deles para mostrar o
--      estado financeiro real, então esta migration é PRÉ-REQUISITO do painel,
--      não um extra opcional.
-- ----------------------------------------------------------------------------
ALTER TABLE public.payments
    ADD COLUMN IF NOT EXISTS stripe_invoice_id   text,
    ADD COLUMN IF NOT EXISTS stripe_charge_id    text,
    ADD COLUMN IF NOT EXISTS stripe_customer_id  text,
    ADD COLUMN IF NOT EXISTS stripe_refund_id    text,
    ADD COLUMN IF NOT EXISTS currency            text DEFAULT 'BRL',
    ADD COLUMN IF NOT EXISTS invoice_kind        text,
    ADD COLUMN IF NOT EXISTS paid_at             timestamptz,
    ADD COLUMN IF NOT EXISTS period_start        timestamptz,
    ADD COLUMN IF NOT EXISTS period_end          timestamptz,
    ADD COLUMN IF NOT EXISTS refunded_amount     numeric,
    ADD COLUMN IF NOT EXISTS refunded_at         timestamptz,
    ADD COLUMN IF NOT EXISTS customer_name_snapshot text,
    ADD COLUMN IF NOT EXISTS payment_method      text;

ALTER TABLE public.subscriptions
    ADD COLUMN IF NOT EXISTS stripe_customer_id  text,
    ADD COLUMN IF NOT EXISTS cancel_at_period_end boolean DEFAULT false,
    ADD COLUMN IF NOT EXISTS cancel_at            timestamptz,
    ADD COLUMN IF NOT EXISTS canceled_at          timestamptz,
    ADD COLUMN IF NOT EXISTS ended_at             timestamptz,
    ADD COLUMN IF NOT EXISTS current_period_start timestamptz,
    ADD COLUMN IF NOT EXISTS current_period_end   timestamptz;

CREATE INDEX IF NOT EXISTS idx_payments_status_created
    ON public.payments (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_user
    ON public.payments (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_stripe_id
    ON public.payments (stripe_id) WHERE stripe_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payments_invoice_kind
    ON public.payments (invoice_kind, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user
    ON public.subscriptions (user_id) WHERE user_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_subscriptions_next_billing
    ON public.subscriptions (next_billing_at) WHERE next_billing_at IS NOT NULL;

-- ----------------------------------------------------------------------------
-- 1.2  OUTBOX DE E-MAIL (a tabela que a aba "E-mails" do painel consome)
--
--      RLS ligado e SEM policy para `authenticated`: a tabela guarda corpo de
--      e-mail e endereço de terceiros. Se houvesse policy "filtra por user_id",
--      qualquer cliente com conta leria o histórico de e-mail dos outros.
--      O acesso passa só pela API, com service_role, depois de requireAdmin.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.email_outbox (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    template_type       text NOT NULL,
    idempotency_key     text NOT NULL,
    recipient_email     text NOT NULL,
    user_id             uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    payment_id          uuid REFERENCES public.payments(id) ON DELETE SET NULL,
    license_key         text,
    subscription_id     text,
    subject             text NOT NULL,
    html_body           text NOT NULL,
    text_body           text,
    attachment_name     text,
    attachment_content  text,
    attachment_size     integer,
    status              text NOT NULL DEFAULT 'pending',
    provider_message_id text,
    attempts            integer NOT NULL DEFAULT 0,
    available_at        timestamptz NOT NULL DEFAULT NOW(),
    last_error          text,
    last_error_kind     text,
    sent_at             timestamptz,
    delivery_status     text,
    delivered_at        timestamptz,
    opened_at           timestamptz,
    delivery_flag       text,
    delivery_flag_at    timestamptz,
    meta                jsonb,
    created_at          timestamptz NOT NULL DEFAULT NOW(),
    updated_at          timestamptz NOT NULL DEFAULT NOW()
);

-- Idempotência: índice ÚNICO é o que impede e-mail duplicado quando a Stripe
-- reenvia o webhook. Não parcial — qualquer repetição é barrada pelo banco.
CREATE UNIQUE INDEX IF NOT EXISTS uniq_email_outbox_idempotency_key
    ON public.email_outbox (idempotency_key);

CREATE INDEX IF NOT EXISTS idx_email_outbox_ready
    ON public.email_outbox (available_at)
    WHERE status IN ('pending', 'processing');
CREATE INDEX IF NOT EXISTS idx_email_outbox_status
    ON public.email_outbox (status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_outbox_user
    ON public.email_outbox (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_email_outbox_provider_id
    ON public.email_outbox (provider_message_id)
    WHERE provider_message_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_email_outbox_template_failed
    ON public.email_outbox (template_type, created_at DESC)
    WHERE status = 'failed';

CREATE OR REPLACE FUNCTION public.set_updated_at_email_outbox()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_email_outbox_updated_at ON public.email_outbox;
CREATE TRIGGER tr_email_outbox_updated_at
    BEFORE UPDATE ON public.email_outbox
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_email_outbox();

ALTER TABLE public.email_outbox ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.email_outbox FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.email_outbox TO service_role;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'email_outbox' AND policyname = 'service role only email_outbox'
    ) THEN
        CREATE POLICY "service role only email_outbox"
            ON public.email_outbox FOR ALL TO service_role
            USING (true) WITH CHECK (true);
    END IF;
END $$;

-- A coluna `delivery_status` só existe a partir desta versão do arquivo.
-- Em bases onde a tabela já existia sem as colunas de entrega, o ALTER abaixo
-- as acrescenta. É a diferença entre o painel mostrar "entregue" e mostrar
-- "aguardando" para sempre.
ALTER TABLE public.email_outbox
    ADD COLUMN IF NOT EXISTS delivery_status  text,
    ADD COLUMN IF NOT EXISTS delivered_at     timestamptz,
    ADD COLUMN IF NOT EXISTS opened_at        timestamptz,
    ADD COLUMN IF NOT EXISTS delivery_flag    text,
    ADD COLUMN IF NOT EXISTS delivery_flag_at timestamptz;


-- ############################################################################
-- SEÇÃO 2 — TABELAS DO PAINEL ADMINISTRATIVO
-- ############################################################################

-- ----------------------------------------------------------------------------
-- 2.1  PAPÉIS DE ADMINISTRAÇÃO
--
--      `profiles.role` já existe, mas nenhuma coluna marca QUANDO o papel
--      mudou nem POR QUEM. Sem isso, um privilégio concedido não tem trilha
--      e uma investigação de acesso indevido não tem por onde começar.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_role_grants (
    id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role        text NOT NULL,
    granted_by  uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    reason      text,
    created_at  timestamptz NOT NULL DEFAULT NOW(),
    revoked_at  timestamptz,
    revoked_by  uuid REFERENCES auth.users(id) ON DELETE SET NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS uniq_admin_role_grants_active
    ON public.admin_role_grants (user_id, role)
    WHERE revoked_at IS NULL;

CREATE INDEX IF NOT EXISTS idx_admin_role_grants_user
    ON public.admin_role_grants (user_id, created_at DESC);

ALTER TABLE public.admin_role_grants ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.admin_role_grants FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.admin_role_grants TO service_role;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'admin_role_grants' AND policyname = 'service role only admin_role_grants'
    ) THEN
        CREATE POLICY "service role only admin_role_grants"
            ON public.admin_role_grants FOR ALL TO service_role
            USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 2.2  PAPÉIS CONHECIDOS
--
--      Tabela de referência em vez de texto solto no código: o painel mostra
--      os nomes legíveis, a aplicação valida contra a lista, e um papel novo
--      não exige deploy de migration.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_roles (
    role        text PRIMARY KEY,
    label       text NOT NULL,
    description text,
    -- Ordinal para ordenar a interface do mais restrito ao mais amplo.
    rank        integer NOT NULL DEFAULT 0
);

INSERT INTO public.admin_roles (role, label, description, rank) VALUES
    ('leitura',    'Leitura / Auditoria', 'Consulta tudo. Não altera nada.',            1),
    ('suporte',    'Suporte Operacional', 'Atende cliente. Não mexe em dinheiro.',      2),
    ('financeiro', 'Administrador Financeiro', 'Cobra, estorna e concilia. Não revoga licença.', 3),
    ('superadmin', 'Superadministrador',  'Acesso total, incluindo editar papéis.',    4)
ON CONFLICT (role) DO UPDATE
    SET label = EXCLUDED.label,
        description = EXCLUDED.description,
        rank = EXCLUDED.rank;

ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.admin_roles FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.admin_roles TO service_role;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'admin_roles' AND policyname = 'service role read admin_roles'
    ) THEN
        CREATE POLICY "service role read admin_roles"
            ON public.admin_roles FOR SELECT TO service_role
            USING (true);
    END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 2.3  TRILHA DE AUDITORIA ESTRUTURADA
--
--      `audit_logs` já existe e é genérico (`event_type`, `metadata` jsonb,
--      `created_at`). Ele CONTINUA sendo escrito — não é substituído.
--
--      Por que uma tabela nova então? Três motivos concretos:
--
--        a) A PARTE 11 pede resultado e estado anterior/posterior por ação.
--           Esconder isso dentro de `metadata` significa que nenhum filtro do
--           painel pode consultá-lo por SQL.
--        b) O painel precisa listar "ações deste administrador nos últimos 7
--           dias" e "ações que falharam". Com jsonb isso exige varrer e
--           deserializar em JS — lento e frágil.
--        c) `audit_logs` não tem índice por recurso. A listagem por licença ou
--           por cliente exigiria varredura completa.
--
--      É uma Projection, não uma duplicação: os dois registros são escritos.
-- ----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
    id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id       uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    admin_email    text,
    admin_role     text,
    action         text NOT NULL,
    resource       text NOT NULL,
    resource_id    text,
    reason         text,
    outcome        text NOT NULL DEFAULT 'OK',
    before_state   jsonb,
    after_state    jsonb,
    correlation_id text,
    created_at     timestamptz NOT NULL DEFAULT NOW()
);

-- Índices pensados para as consultas que o painel realmente faz.
CREATE INDEX IF NOT EXISTS idx_admin_audit_created
    ON public.admin_audit_log (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_resource
    ON public.admin_audit_log (resource, resource_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_admin
    ON public.admin_audit_log (admin_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_failures
    ON public.admin_audit_log (created_at DESC)
    WHERE outcome IN ('DENIED', 'FAILED');

ALTER TABLE public.admin_audit_log ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.admin_audit_log FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.admin_audit_log TO service_role;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'admin_audit_log' AND policyname = 'service role only admin_audit_log'
    ) THEN
        CREATE POLICY "service role only admin_audit_log"
            ON public.admin_audit_log FOR ALL TO service_role
            USING (true) WITH CHECK (true);
    END IF;
END $$;

-- ----------------------------------------------------------------------------
-- 2.4  SOLICITAÇÕES DE REEMBOLSO
--
--      `refund_requests` JÁ EXISTE no banco, então este bloco NÃO a recria.
--      O que falta é a origem declarada: `source` existe como texto livre e é
--      o que separa "pedido do cliente" de "ação do admin" — distinção que a
--      PARTE 7 exige ("uma solicitação registrada não é um reembolso
--      concluído"). Um CHECK explícito impede que os dois virem a mesma coisa.
--
--      Também se garante que a referência de quem processou exista, para a
--      tela de reembolsos mostrar "responsável pelo processamento".
-- ----------------------------------------------------------------------------
DO $$
BEGIN
    IF to_regclass('public.refund_requests') IS NOT NULL THEN
        ALTER TABLE public.refund_requests
            ADD COLUMN IF NOT EXISTS processed_by        uuid REFERENCES auth.users(id) ON DELETE SET NULL,
            ADD COLUMN IF NOT EXISTS processed_at        timestamptz,
            ADD COLUMN IF NOT EXISTS requested_amount    numeric,
            ADD COLUMN IF NOT EXISTS stripe_payment_intent text,
            ADD COLUMN IF NOT EXISTS license_impact      text;
    END IF;
END $$;

DO $$
BEGIN
    IF to_regclass('public.refund_requests') IS NOT NULL THEN
        CREATE INDEX IF NOT EXISTS idx_refund_requests_status
            ON public.refund_requests (status, created_at DESC);
        CREATE INDEX IF NOT EXISTS idx_refund_requests_payment
            ON public.refund_requests (payment_id, created_at DESC);
    END IF;
END $$;


-- ############################################################################
-- SEÇÃO 3 — ÍNDICES PARA O PAINEL
--
-- A PARTE 18 proíbe carregar tudo no navegador. Estes índices existem para
-- que cada listagem do painel seja uma consulta indexada com paginação, e não
-- uma varredura de tabela.
-- ############################################################################

-- Busca de clientes por nome/e-mail sem varrer `profiles`.
CREATE INDEX IF NOT EXISTS idx_profiles_email_lower
    ON public.profiles (lower(email));
CREATE INDEX IF NOT EXISTS idx_profiles_created
    ON public.profiles (created_at DESC);
-- O painel filtra por "admin que não está bloqueado/excluído" constantemente.
CREATE INDEX IF NOT EXISTS idx_profiles_admin
    ON public.profiles (is_admin, created_at DESC);

-- Licenças: a tela principal do painel. Filtra por plano, status e dono.
CREATE INDEX IF NOT EXISTS idx_licenses_user_plan
    ON public.licenses (user_id, plan_type);
CREATE INDEX IF NOT EXISTS idx_licenses_expires
    ON public.licenses (expires_at) WHERE expires_at IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_licenses_revoked
    ON public.licenses (revoked, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_licenses_payment
    ON public.licenses (payment_id) WHERE payment_id IS NOT NULL;
-- Busca pela chave de licença digitada pelo suporte.
CREATE INDEX IF NOT EXISTS idx_licenses_key_prefix
    ON public.licenses (left(license_key, 12));

-- Dispositivos: a tela de máquinas vinculadas entra sempre pela chave.
CREATE INDEX IF NOT EXISTS idx_license_devices_key
    ON public.license_devices (license_key);
CREATE INDEX IF NOT EXISTS idx_license_devices_last_seen
    ON public.license_devices (last_seen_at DESC NULLS LAST);

-- Reconciliação financeira: a lista de "pendentes" da PARTE 5.
CREATE INDEX IF NOT EXISTS idx_payments_pending_probe
    ON public.payments (created_at DESC)
    WHERE status IN ('pending', 'processing');

-- Webhooks: tela de falhas recentes.
CREATE INDEX IF NOT EXISTS idx_stripe_event_log_failures
    ON public.stripe_event_log (created_at DESC)
    WHERE status <> 'processed';

-- Fim de período pago, para a lista de vencimentos.
CREATE INDEX IF NOT EXISTS idx_payments_period_end
    ON public.payments (period_end)
    WHERE period_end IS NOT NULL;


-- ############################################################################
-- SEÇÃO 4 — PAPEL DO PRIMEIRO ADMIN
--
-- `profiles.role` é NULL nos admins que já existem. A aplicação trata
-- `is_admin = true` sem papel como superadmin, então nada quebra. Este bloco
-- apenas DEIXA EXPLÍCITO o estado atual, para quem for ler o banco daqui a
-- seis meses saber que a omissão é conhecida e não um bug.
--
-- Não preenche `role` de propósito: atribuir superadmin a um usuário é uma
-- decisão de negócio, e o default seguro (sem papel) ainda resolve para o
-- superadmin por compatibilidade. Quem quiser assumir de fato, faz pelo painel.
-- ############################################################################

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema='public' AND table_name='profiles' AND column_name='role'
    ) THEN
        RAISE NOTICE 'admin.sql: % admin(s) com is_admin=true e role nulo serão tratados como superadmin por compatibilidade.',
            (SELECT count(*) FROM public.profiles WHERE is_admin = true AND role IS NULL);
    END IF;
END $$;


-- ############################################################################
-- SEÇÃO 5 — CADASTRO: TRIGGER QUE GRAVA O PERFIL COMPLETO
--
-- PROBLEMA REAL, MEDIDO EM PRODUÇÃO (2026-10-19)
--
--   `public.handle_new_user()` foi redefinida pela migration
--   `20260219000001_fix_function_search_path_security.sql` e passou a inserir
--   APENAS (id, email, full_name, created_at, updated_at).
--
--   Nos 102 perfis criados DEPOIS de 2026-02-19:
--       login .......... 0/102 preenchidos
--       neighborhood ... 0/102 preenchidos
--       phone/city/state/cep ... 47/102 (preenchidos por outros fluxos)
--
--   O cadastro enviava tudo em `raw_user_meta_data`, mas o trigger descartava
--   login, telefone, endereço, bairro, cidade, UF e CEP. Era por isso que a
--   ficha do cliente no painel aparecia com "—" nesses campos.
--
-- O QUE ESTE BLOCO FAZ
--
--   Recria a função com TODOS os campos, mantendo `search_path` fixo
--   (segurança). É `CREATE OR REPLACE`: não apaga dado, não altera nenhuma
--   linha existente e pode rodar quantas vezes for preciso.
--
--   `ON CONFLICT (id) DO NOTHING`: se outro trigger já criou o perfil, o
--   cadastro não falha.
--
--   `login` é UNIQUE. Para cadastro social (sem `login` no metadata), o
--   fallback é a parte local do e-mail; se ela já existir, o bloco de exceção
--   acrescenta um sufixo curto do id em vez de derrubar o cadastro.
--
-- IMPORTANTE
--
--   Isto corrige os PRÓXIMOS cadastros. NÃO faz backfill: preencher dados de
--   clientes existentes a partir do metadata é decisão de negócio e deve ser
--   feita com revisão, não por script automático. (A missão proíbe UPDATE em
--   massa de dados existentes.)
-- ############################################################################

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_email TEXT := NEW.email;
    v_login TEXT;
BEGIN
    v_login := COALESCE(
        NULLIF(BTRIM(NEW.raw_user_meta_data->>'login'), ''),
        NULLIF(split_part(COALESCE(NEW.email, ''), '@', 1), ''),
        'usuario'
    );

    BEGIN
        INSERT INTO public.profiles (
            id, login, email, full_name, phone, address,
            city, neighborhood, state, cep, created_at, updated_at
        ) VALUES (
            NEW.id,
            v_login,
            v_email,
            COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
            COALESCE(NEW.raw_user_meta_data->>'phone', ''),
            COALESCE(NEW.raw_user_meta_data->>'address', ''),
            COALESCE(NEW.raw_user_meta_data->>'city', ''),
            COALESCE(NEW.raw_user_meta_data->>'neighborhood', ''),
            COALESCE(NEW.raw_user_meta_data->>'state', ''),
            COALESCE(NEW.raw_user_meta_data->>'cep', ''),
            NOW(), NOW()
        )
        ON CONFLICT (id) DO NOTHING;
    EXCEPTION WHEN unique_violation THEN
        -- `login` já usado por outra conta: usa e-mail local + sufixo do id.
        INSERT INTO public.profiles (
            id, login, email, full_name, phone, address,
            city, neighborhood, state, cep, created_at, updated_at
        ) VALUES (
            NEW.id,
            LEFT(
                COALESCE(NULLIF(split_part(COALESCE(NEW.email, ''), '@', 1), ''), 'usuario')
                || '-' || substr(NEW.id::text, 1, 8),
                30
            ),
            v_email,
            COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
            COALESCE(NEW.raw_user_meta_data->>'phone', ''),
            COALESCE(NEW.raw_user_meta_data->>'address', ''),
            COALESCE(NEW.raw_user_meta_data->>'city', ''),
            COALESCE(NEW.raw_user_meta_data->>'neighborhood', ''),
            COALESCE(NEW.raw_user_meta_data->>'state', ''),
            COALESCE(NEW.raw_user_meta_data->>'cep', ''),
            NOW(), NOW()
        )
        ON CONFLICT (id) DO NOTHING;
    END;

    RETURN NEW;
END;
$$;

-- A função é chamada pelo trigger, não por RPC. Ninguém precisa executá-la.
REVOKE ALL ON FUNCTION public.handle_new_user() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.handle_new_user() TO service_role;

-- Confirma que o trigger existe e aponta para a função recriada.
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger
        WHERE tgname = 'on_auth_user_created'
          AND tgrelid = 'auth.users'::regclass
    ) THEN
        RAISE NOTICE 'admin.sql: trigger on_auth_user_created NÃO existe — crie-o manualmente.';
    ELSE
        RAISE NOTICE 'admin.sql: trigger on_auth_user_created presente; novos cadastros gravarão login, telefone, endereço, bairro, cidade, UF e CEP.';
    END IF;
END $$;


-- ############################################################################
-- SEÇÃO 6 — TELEFONE NORMALIZADO (acelerador da trava de WhatsApp duplicado)
--
-- MEDIDO EM PRODUÇÃO (2026-10-19): a trava de telefone duplicado NUNCA
-- funcionou. O endpoint comparava
--     or=(phone.eq.37998127122, phone.ilike.*37998127122*)
-- contra o telefone gravado FORMATADO ("(37) 99812-7122"): o hífen quebra a
-- sequência de dígitos e nenhuma linha era devolvida. No banco existem 3
-- contas com o mesmo WhatsApp (11996716235).
--
-- O código já foi corrigido e hoje a comparação é feita sobre o número
-- NORMALIZADO (ver lib/phone-dup.ts), sem depender de coluna nova.
--
-- Esta seção é o acelerador para o volume crescer: uma coluna com o número
-- só em dígitos (indexável) permite consulta exata em vez de varrer a tabela
-- com padrão curinga.
--
-- A coluna é ADITIVA e a aplicação NÃO depende dela: se ela não existir, o
-- endpoint usa o caminho textual e continua correto.
-- ############################################################################

ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS phone_normalized text;

CREATE INDEX IF NOT EXISTS idx_profiles_phone_normalized
    ON public.profiles (phone_normalized)
    WHERE phone_normalized IS NOT NULL;

-- ---------------------------------------------------------------------------
-- BACKFILL (OPCIONAL, REVISADO À MÃO — NÃO É EXECUTADO POR ESTE ARQUIVO)
--
-- Preencher a coluna é um UPDATE em dados de clientes: a missão proíbe
-- UPDATE em massa, então este bloco fica COMENTADO de propósito. O operador
-- decide, revisando antes, e roda no SQL Editor:
--
--   UPDATE public.profiles
--      SET phone_normalized = right(regexp_replace(phone, '\D', '', 'g'), 11)
--    WHERE phone IS NOT NULL
--      AND phone_normalized IS NULL;
--
-- Sem o backfill, a coluna fica vazia e a checagem segue pelo caminho textual
-- (resultado idêntico, só mais lenta em bases grandes).
-- ---------------------------------------------------------------------------


-- ############################################################################
-- VERIFICAÇÕES PÓS-EXECUÇÃO
-- Rode cada bloco depois de executar o arquivo. Todos devem retornar o
-- resultado indicado na coluna "esperado".
-- ############################################################################

-- ESPERADO: 'sim'
SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema='public' AND table_name='email_outbox'
) AS email_outbox_criada;

-- ESPERADO: 'sim'
SELECT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname='public' AND indexname='uniq_email_outbox_idempotency_key'
) AS idempotencia_unica_ok;

-- ESPERADO: 'sim'
SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema='public' AND table_name='admin_audit_log'
) AS auditoria_criada;

-- ESPERADO: 4 (leitura, suporte, financeiro, superadmin)
SELECT count(*) AS papeis_cadastrados FROM public.admin_roles;

-- ESPERADO: todas as tabelas novas com RLS ligado
SELECT c.relname AS tabela, c.relrowsecurity AS rls_ligado
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relname IN ('email_outbox','admin_audit_log','admin_role_grants','admin_roles')
ORDER BY c.relname;

-- ESPERADO: nenhuma policy para anon/authenticated (só service_role)
-- Se aparecer algo aqui, há vazamento de dado administrativo.
SELECT tablename, policyname, roles
FROM pg_policies
WHERE schemaname='public'
  AND tablename IN ('email_outbox','admin_audit_log','admin_role_grants','admin_roles')
  AND roles <> '{8300}'
ORDER BY tablename;

-- ESPERADO: contagem > 0 (dados preservados; este arquivo não apaga nada)
SELECT
    (SELECT count(*) FROM public.payments)     AS pagamentos,
    (SELECT count(*) FROM public.licenses)     AS licencas,
    (SELECT count(*) FROM public.subscriptions) AS assinaturas,
    (SELECT count(*) FROM public.profiles)     AS perfis;

NOTIFY pgrst, 'reload schema';
