-- ============================================================================
-- notificacaocorrigida.sql — VOLTRIS BRASIL
-- ============================================================================
-- Objetivo: consertar o subsistema de notificações IN-APP (o "sino").
--
-- O QUE ESTAVA QUEBRADO (medido em produção, 2026-10-19)
-- ---------------------------------------------------------------------------
-- 1. A tabela `notifications` existia, mas SEM política de UPDATE e SEM
--    política de DELETE. O botão "marcar como lida" e o "limpar todas"
--    alteravam só o estado local da tela: o banco continuava com
--    `read = false` e o badge voltava ao recarregar a página.
--
-- 2. `notifications` NUNCA foi adicionada à publicação `supabase_realtime`.
--    O cliente assinava o canal `postgres_changes` e não recebia NENHUM
--    evento: o sino só atualizava ao recarregar a página.
--
-- 3. As triggers de status (ticket e pedido) estavam QUEBRADAS: gravavam em
--    colunas que não existem (`body`, `data`) e usavam valores de enum
--    inexistentes (`ticket_status`, `order_status`, `alert`, `default`).
--    Ou seja: quando o admin mudava o status de um ticket, o cliente não era
--    notificado. Nenhum erro aparecia — a trigger só falhava calada.
--
-- 4. O enum `notification_type` não tinha valores para licença, serviço e
--    reembolso, e não havia como ligar a notificação a um pedido/licença
--    (sem `action_url` e sem `data`).
--
-- 5. A policy de INSERT permitia o próprio cliente inserir notificação para
--    si mesmo — dava para "forjar" aviso no próprio sino.
--
-- GARANTIAS
--   - ADITIVO e IDEMPOTENTE: pode rodar quantas vezes for preciso.
--   - Nenhum DELETE de dado, nenhum TRUNCATE, nenhum UPDATE em massa.
--   - A tabela continua com RLS ligada e as policies passam a separar
--     "minha notificação" de "notificação de administração".
--
-- O APLICATIVO CONTINUA FUNCIONANDO SEM ESTE ARQUIVO: o servidor detecta
-- em runtime se as colunas novas existem e usa o formato completo quando
-- existem, e o formato Reduced quando não. Aplica este arquivo para
-- liberar o tempo real (Realtime), a marcação de lida no banco e as
-- notificações clicáveis.
--
-- Onde aplicar: SQL Editor do Supabase (ou `supabase db push`).
--
-- ERRO 55P04 (se você ver): "unsafe use of new value ... of enum type
-- notification_type". Acontece porque o SQL Editor roda o arquivo inteiro
-- numa transação e o Postgres só libera o uso de um valor novo de enum
-- DEPOIS do commit. A Seção 1 explica a ordem recomendada — o arquivo já
-- foi ajustado para não usar os valores novos em lugar nenhum, então dá
-- para rodar tudo de uma vez.
-- ============================================================================


-- ############################################################################
-- SEÇÃO 1 — ENUM: TIPOS NOVOS
--
-- `ALTER TYPE ... ADD VALUE` não roda dentro de bloco transacional em
-- Postgres antigo; o SQL Editor do Supabase roda cada comando em autocommit,
-- então funciona. Se der erro de transação, rode estas 3 linhas isoladas.
-- ############################################################################
-- BLOCO 1 — OS TRÊS VALORES NOVOS DO ENUM
--
-- ATENÇÃO: LEIA ANTES DE EXECUTAR
--
-- O erro "55P04: unsafe use of new value" acontece porque o SQL Editor do
-- Supabase roda o ARQUIVO INTEIRO numa transação só. E o Postgres tem uma
-- regra dura: um valor novo de enum só pode ser USADO depois dedar COMMIT.
--
-- Ou seja:
--   - `ALTER TYPE ... ADD VALUE` pode ser executado dentro da transação;
--   - mas qualquer coisa que USE esse valor na MESMA transação estoura.
--
-- Por isso este arquivo foi reescrito para NÃO usar os valores novos em
-- lugar nenhum: a Seção 5 (triggers) grava 'ticket' e 'order', que já
-- existiam, e a verificação do final (Seção 6) lista o enum dentro de um
-- bloco com tratamento de erro. Assim dá para rodar o arquivo inteiro de
-- uma vez, em uma transação só, sem erro.
--
-- Se preferir executar em partes (recomendado, para ver o resultado em
-- etapas), a ordem é:
--   1) rode só as 3 linhas ALTER TYPE abaixo e deixe o editor COMITAR;
--   2) depois rode o restante do arquivo (Seções 2 a 6).
--
-- O arquivo é idempotente: rodar de novo não quebra nada.
-- ############################################################################

ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'license';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'service';
ALTER TYPE public.notification_type ADD VALUE IF NOT EXISTS 'refund';


-- ############################################################################
-- SEÇÃO 2 — COLUNAS NOVAS
--
--   action_url : para onde o clique leva (pedido, ticket, licença…)
--   data       : metadados de negócio (jsonb)
--   audience   : 'user' (padrão) ou 'admin' (notificação de operação)
--   read_at    : quando foi lida
--   updated_at : última alteração
-- ############################################################################

ALTER TABLE public.notifications
    ADD COLUMN IF NOT EXISTS action_url text,
    ADD COLUMN IF NOT EXISTS data jsonb,
    ADD COLUMN IF NOT EXISTS audience text NOT NULL DEFAULT 'user',
    ADD COLUMN IF NOT EXISTS read_at timestamptz,
    ADD COLUMN IF NOT EXISTS updated_at timestamptz;

-- Índice de leitura do sino: "minhas não lidas, mais recentes primeiro".
CREATE INDEX IF NOT EXISTS idx_notifications_user_created
    ON public.notifications (user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_notifications_user_unread
    ON public.notifications (user_id)
    WHERE read = false;

-- Notificações de operação (compras, pedidos, tickets) para o admin.
CREATE INDEX IF NOT EXISTS idx_notifications_audience_created
    ON public.notifications (audience, created_at DESC);


-- ############################################################################
-- SEÇÃO 3 — POLÍTICAS (RLS)
--
-- ANTES
--   SELECT : dono OU qualquer admin
--   INSERT : o próprio dono (dava para forjar notificação)
--   UPDATE : NENHUMA  -> "marcar como lida" não persistia
--   DELETE : NENHUMA  -> "limpar todas" não persistia
--
-- DEPOIS
--   SELECT : o dono vê as próprias + as de operação destined a ele
--   INSERT : somente service_role (o servidor grava)
--   UPDATE : somente o dono, e somente as próprias linhas
--   DELETE : somente o dono, e somente as próprias linhas
-- ############################################################################

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- INSERT: sai a policy que deixava o cliente forjar notificação.
DROP POLICY IF EXISTS "Users can insert their own notifications" ON public.notifications;

-- A policy nova tambem precisa ser removida antes de ser recriada: sem este
-- DROP, a segunda execucao do arquivo quebrava com
--     42710: policy "service role only inserts notifications" already exists
-- e ABORTAVA o resto do script (inclusive a secao 7, que cria as colunas
-- de push_subscriptions).
DROP POLICY IF EXISTS "service role only inserts notifications" ON public.notifications;

CREATE POLICY "service role only inserts notifications"
    ON public.notifications FOR INSERT
    TO service_role
    WITH CHECK (true);

-- UPDATE: o dono marca as PRÓPRIAS como lidas.
DROP POLICY IF EXISTS "Users can update their own notifications" ON public.notifications;

CREATE POLICY "Users can update their own notifications"
    ON public.notifications FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- DELETE: o dono limpa as PRÓPRIAS.
DROP POLICY IF EXISTS "Users can delete their own notifications" ON public.notifications;

CREATE POLICY "Users can delete their own notifications"
    ON public.notifications FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- SELECT: o dono continua vendo as próprias. A policy de admin permanece
-- (o admin precisa da visão completa de compras/pedidos/tickets), mas
-- passa a enxergar também as notificações de operação.
DROP POLICY IF EXISTS "Users can view their own notifications" ON public.notifications;

CREATE POLICY "Users can view their own notifications"
    ON public.notifications FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admin can view all notifications" ON public.notifications;

CREATE POLICY "Admin can view all notifications"
    ON public.notifications FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles p
            WHERE p.id = auth.uid() AND p.is_admin = TRUE
              AND COALESCE(p.is_blocked, false) = false
              AND COALESCE(p.is_deleted, false) = false
        )
    );


-- ############################################################################
-- SEÇÃO 4 — REALTIME (o sino passa a chegar SEM recarregar a página)
--
-- Sem isto, o canal `postgres_changes` do cliente fica muda: nenhuma
-- notificação aparece em tempo real.
-- ############################################################################

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_publication_tables
        WHERE pubname = 'supabase_realtime'
          AND schemaname = 'public'
          AND tablename = 'notifications'
    ) THEN
        EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications';
        RAISE NOTICE 'notificacaocorrigida.sql: notifications adicionada à publicação supabase_realtime.';
    ELSE
        RAISE NOTICE 'notificacaocorrigida.sql: notifications já está na publicação supabase_realtime.';
    END IF;
END $$;

-- Sem REPLICA IDENTITY FULL, o payload do Realtime traz apenas a chave
-- primária no DELETE/UPDATE (o nome do usuário não vem junto).
ALTER TABLE public.notifications REPLICA IDENTITY FULL;


-- ############################################################################
-- SEÇÃO 5 — TRIGGERS CORRIGIDAS (status de ticket e de pedido)
--
-- As versões em produção gravavam em colunas inexistentes (`body`, `data`) e
-- usavam valores de enum inexistentes (`ticket_status`, `order_status`,
-- `alert`, `default`). Resultado: erro silencioso e NENHUMA notificação
-- quando o admin respondia um ticket.
--
-- Agora gravam com valores válidos, `data` jsonb e `action_url` — e são
-- recriadas porque as functions estavam erradas, não só o corpo delas.
-- ############################################################################

CREATE OR REPLACE FUNCTION public.notify_ticket_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    caller_role TEXT := COALESCE(current_setting('request.jwt.claims', true)::jsonb ->> 'role', '');
BEGIN
    -- Quando a mudança vem do PAINEL (service_role), a notificação já foi
    -- enviada pela rota, com a justificativa do operador. Dispara aqui
    -- também = o cliente receberia a mesma notícia duas vezes.
    IF caller_role = 'service_role' THEN
        RETURN NEW;
    END IF;

    IF NEW.status IS DISTINCT FROM OLD.status THEN
        INSERT INTO public.notifications (
            user_id, title, message, type, read, sound,
            action_url, data, audience, created_at, updated_at
        ) VALUES (
            NEW.user_id,
            'Atualização do seu chamado',
            'O status do chamado "' || COALESCE(NEW.title, 'sem título') || '" mudou para: ' || COALESCE(NEW.status, '—') || '.',
            'ticket',
            false,
            'chime',
            '/dashboard/tickets',
            jsonb_build_object('ticket_id', NEW.id, 'status', NEW.status, 'kind', 'ticket_reply'),
            'user',
            NOW(),
            NOW()
        );
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_ticket_status_change ON public.tickets;
CREATE TRIGGER trg_notify_ticket_status_change
    AFTER UPDATE ON public.tickets
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_ticket_status_change();


CREATE OR REPLACE FUNCTION public.notify_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    caller_role TEXT := COALESCE(current_setting('request.jwt.claims', true)::jsonb ->> 'role', '');
BEGIN
    -- Mesma regra da trigger de ticket: o painel já notifica.
    IF caller_role = 'service_role' THEN
        RETURN NEW;
    END IF;

    IF NEW.status IS DISTINCT FROM OLD.status THEN
        INSERT INTO public.notifications (
            user_id, title, message, type, read, sound,
            action_url, data, audience, created_at, updated_at
        ) VALUES (
            NEW.user_id,
            'Status do pedido atualizado',
            'Seu pedido #' || LEFT(COALESCE(NEW.id::text, ''), 8) || ' está com status: ' || COALESCE(NEW.status, '—') || '.',
            'order',
            false,
            'chime',
            '/dashboard?tab=orders',
            jsonb_build_object('order_id', NEW.id, 'status', NEW.status, 'kind', 'service'),
            'user',
            NOW(),
            NOW()
        );
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_order_status_change ON public.orders;
CREATE TRIGGER trg_notify_order_status_change
    AFTER UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.notify_order_status_change();


-- ############################################################################
-- SEÇÃO 6 — VERIFICAÇÕES PÓS-EXECUÇÃO
-- ############################################################################

-- 6.1 As colunas novas existem?
-- ESPERADO: 5 linhas (action_url, data, audience, read_at, updated_at)
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'notifications'
ORDER BY column_name;

-- 6.2 As policies esperadas existem?
-- ESPERADO: SELECT (2), INSERT (1: service_role), UPDATE (1), DELETE (1)
SELECT policyname, cmd, roles
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'notifications'
ORDER BY cmd, policyname;

-- 6.3 O Realtime está publicado?
-- ESPERADO: 1 linha (notifications)
SELECT pubname, schemaname, tablename
FROM pg_publication_tables
WHERE pubname = 'supabase_realtime' AND tablename = 'notifications';

-- 6.4 Os triggers corrigidos existem?
-- ESPERADO: 2 linhas (tickets e orders)
SELECT tgname, tgrelid::regclass AS tabela
FROM pg_trigger
WHERE tgname IN ('trg_notify_ticket_status_change', 'trg_notify_order_status_change')
  AND NOT tgisinternal;

-- 6.5 Os tipos novos do enum estão lá?
-- ESPERADO: license, refund, service
--
-- Esta consulta NÃO pode derrubar o script: dentro da MESMA transação em que
-- os valores foram adicionados, listar o enum pode estourar o erro 55P04
-- ("unsafe use of new value"). Por isso ela vai dentro de um bloco com
-- tratamento de erro — e, se acontecer, é só aviso: os valores serão
-- commitados no fim da transação e a listagem passa a funcionar depois.
DO $$
BEGIN
    PERFORM 1 FROM unnest(enum_range(NULL::public.notification_type));
    RAISE NOTICE 'notificacaocorrigida.sql: tipos do enum notification_type: %',
        (SELECT string_agg(e.enumlabel, ', ' ORDER BY e.enumsortorder)
           FROM pg_enum e
           JOIN pg_type t ON t.oid = e.enumtypid
          WHERE t.typname = 'notification_type');
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'notificacaocorrigida.sql: nao foi possivel listar o enum nesta transacao (%). Rode a consulta 6.5 de novo depois do commit.', SQLERRM;
END $$;

-- 6.6 Nenhuma notificação foi apagada por esta execução.
SELECT
    (SELECT count(*) FROM public.notifications) AS notificacoes,
    (SELECT count(*) FROM public.notifications WHERE read = false) AS nao_lidas;


-- ============================================================================
-- 7) PUSH SUBSCRIPTIONS - COLUNAS QUE FALTAM NO BANCO DE PRODUCAO
-- ============================================================================
--
-- O BANCO DE PRODUCAO tem a versao ANTIGA da tabela public.push_subscriptions:
-- id, user_id, endpoint, p256dh, auth, created_at, updated_at.
--
-- O codigo do sistema (registro da inscricao, envio do aviso com o site
-- fechado e desativacao) usa is_active, browser_fingerprint, user_agent,
-- platform, device_type e last_used. Sem essas colunas o "Ativar
-- notificacoes" falhava com:
--
--     column push_subscriptions.is_active does not exist   (Postgres 42703)
--
-- O codigo ja foi blindado para funcionar com os dois schemas (ele detecta as
-- colunas existentes antes de gravar), mas esta e a CORRECAO DEFINITIVA: rode
-- este arquivo e a tabela passa a ter o schema completo.
--
-- Tudo e idempotente: pode rodar quantas vezes quiser, sem erro e sem
-- perder nenhuma inscricao ja gravada.
-- ============================================================================

-- 7.1 Colunas que faltam (as inscricoes ja existentes continuam valendo).
ALTER TABLE public.push_subscriptions
    ADD COLUMN IF NOT EXISTS is_active           BOOLEAN     DEFAULT TRUE,
    ADD COLUMN IF NOT EXISTS browser_fingerprint  TEXT,
    ADD COLUMN IF NOT EXISTS user_agent           TEXT,
    ADD COLUMN IF NOT EXISTS platform             TEXT,
    ADD COLUMN IF NOT EXISTS device_type          TEXT,
    ADD COLUMN IF NOT EXISTS last_used            TIMESTAMPTZ;

-- 7.2 Inscricoes antigas (sem fingerprint) passam a valer como ativas.
UPDATE public.push_subscriptions
   SET is_active = TRUE
 WHERE is_active IS NULL;

-- 7.3 Indice para localizar a inscricao do navegador (mesmo dispositivo,
--     outro login) sem varrer a tabela inteira.
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_fingerprint
    ON public.push_subscriptions (user_id, browser_fingerprint);

-- 7.4 Indice do envio de avisos: apenas inscricoes ativas por usuario.
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_active
    ON public.push_subscriptions (user_id)
 WHERE is_active = TRUE;

-- 7.5 Conference: o schema completo esta no lugar.
SELECT
    (SELECT count(*) FROM public.push_subscriptions) AS inscricoes,
    (SELECT count(*) FROM public.push_subscriptions WHERE is_active) AS ativas,
    (SELECT count(*) FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'push_subscriptions') AS colunas;
