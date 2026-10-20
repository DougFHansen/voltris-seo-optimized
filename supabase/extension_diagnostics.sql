-- ===========================================================================
-- VOLTRIS — DIAGNÓSTICOS DA EXTENSÃO VOLTRIS SHIELD
-- ===========================================================================
--
-- O QUE ESTE SQL FAZ
-- ------------------
-- 1. Cria a tabela que guarda o histórico de erros técnicos reportados
--    pela extensão VOLTRIS SHIELD.
-- 2. Cria a função `record_extension_diagnostics`, que faz DUAS coisas numa
--    ida só ao banco: confere o volume global e grava o lote. Uma ida só
--    porque cada ida ao banco custa tempo de invocação serverless, e tempo
--    de invocação é conta.
-- 3. Fecha o acesso direto: só a service role escreve, e só pela função.
--
-- O QUE ESTE SQL NÃO FAZ
-- ----------------------
-- Não altera nenhuma tabela existente. Não toca em `installations`, em
-- `installation_events`, em `payments`, em `licenses` nem em nada de
-- autenticação. É ADITIVO.
--
-- A EXTENSÃO NÃO TEM USUÁRIO
-- --------------------------
-- A extensão do navegador não tem conta, e é por isso que esta tabela
-- não tem `user_id`, nem `installation_id`, nem nenhum identificador
-- persistente: o que chega aqui é um código de erro técnico, e nada que
-- permita ligar um evento a uma pessoa.
--
-- APLICAÇÃO
-- ---------
--   psql "$DATABASE_URL" -f supabase/extension_diagnostics.sql
--
-- O SQL é idempotente: pode ser aplicado mais de uma vez.
-- ===========================================================================

-- ---------------------------------------------------------------------------
-- 1. A TABELA
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.extension_diagnostics (
    id                  BIGSERIAL PRIMARY KEY,

    -- O esquema do payload, a versão e a origem. A origem é constante
    -- ('voltris-shield-extension') e existe para este feed ser distinguível
    -- dos outros.
    schema_version      SMALLINT    NOT NULL,
    source              TEXT        NOT NULL,

    -- O código estável do erro. É a assinatura do agrupamento: é por ele
    -- que duas ocorrências viram UM alerta.
    error_code          TEXT        NOT NULL,
    event_name          TEXT        NOT NULL,
    component           TEXT        NOT NULL,
    severity            TEXT        NOT NULL
                                    CHECK (severity IN ('WARNING', 'ERROR', 'CRITICAL')),

    -- A versão da EXTENSÃO, e não a do backend: é o que o grupo precisa
    -- saber para casar o alerta com um build.
    extension_version   TEXT        NOT NULL,
    browser             TEXT        NOT NULL,
    browser_major       TEXT        NOT NULL,

    -- A mensagem JÁ SANITIZADA pela extensão. Não há HTML, não há URL
    -- completa e não há dado de usuário — e o CHECK abaixo impede que
    -- alguém passe algo diferente por aqui.
    message             TEXT        NOT NULL CHECK (length(message) <= 500),
    occurrences         INTEGER     NOT NULL DEFAULT 1 CHECK (occurrences >= 1),

    -- O bloco de diagnóstico, com as chaves da lista branca. Guardado como
    -- JSON, porque é a única forma de evoluir a lista sem migração.
    diagnostics         JSONB,

    -- O instante do evento (UTC, vindo da extensão) e o instante em que o
    -- servidor o gravou.
    occurred_at         TIMESTAMPTZ NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

    -- Um evento de teste controlado NÃO é um incidente: a coluna o separa
    -- dos incidentes reais, e a política de retenção apaga os de teste
    -- antes dos outros.
    is_test_event       BOOLEAN     NOT NULL DEFAULT FALSE
);

-- A busca mais comum: o que foi gravado, do mais recente para o mais
-- antigo, e só os incidentes.
CREATE INDEX IF NOT EXISTS extension_diagnostics_recent
    ON public.extension_diagnostics (created_at DESC)
    WHERE is_test_event = FALSE;

-- O agrupamento: as ocorrências de um mesmo código na janela.
CREATE INDEX IF NOT EXISTS extension_diagnostics_signature
    ON public.extension_diagnostics (error_code, extension_version, occurred_at DESC);

-- O limite global: a função conta os eventos do último minuto, e essa
-- contagem é a que ela faz. O índice existe para que a contagem não vire
-- uma varredura da tabela.
CREATE INDEX IF NOT EXISTS extension_diagnostics_rate_window
    ON public.extension_diagnostics (created_at DESC);

-- Os eventos de teste, que são removidos primeiro.
CREATE INDEX IF NOT EXISTS extension_diagnostics_tests
    ON public.extension_diagnostics (created_at)
    WHERE is_test_event;

-- ---------------------------------------------------------------------------
-- 2. A FUNÇÃO: LIMITE GLOBAL + GRAVAÇÃO, NUMA IDA SÓ
-- ---------------------------------------------------------------------------
--
-- POR QUE UMA FUNÇÃO, E NÃO DUAS CONSULTAS
-- ----------------------------------------
-- Duas consultas são duas idas ao banco, e cada ida custa tempo de
-- invocação serverless. Uma função faz o limite e a gravação no mesmo
-- Transaction, e o limite e a gravação não podem discordar um do outro:
-- o que for aceito é gravado, e o que for recusado não é.
--
-- A FUNÇÃO É "SECURITY DEFINER" PORQUE
-- ------------------------------------
-- A tabela é escrita pela service role, e a função é o caminho. O
-- `search_path` é fixado em `public` porque uma função sem search_path
-- fixo é uma função que pode ser sequestrada por um objeto do schema de
-- quem a chamou.
--
-- O LIMITE
-- ---------
-- 120 eventos por minuto, no TOTAL, de todas as origens. É o teto que
-- impede que mil endereços diferentes enchem o grupo. O limite por origem
-- (10 por minuto) é o que existe na memória da instância; este é o que
-- existe entre instâncias.

CREATE OR REPLACE FUNCTION public.record_extension_diagnostics(p_events JSONB)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_limit      INTEGER     := 120;
    v_count      INTEGER;
    v_inserted   INTEGER;
    v_accepted   JSONB;
BEGIN
    IF p_events IS NULL OR jsonb_typeof(p_events) <> 'array' THEN
        RETURN jsonb_build_object('accepted', false, 'reason', 'invalid_events');
    END IF;

    IF jsonb_array_length(p_events) = 0 THEN
        RETURN jsonb_build_object('accepted', false, 'reason', 'empty_batch');
    END IF;

    IF jsonb_array_length(p_events) > 20 THEN
        RETURN jsonb_build_object('accepted', false, 'reason', 'batch_too_large');
    END IF;

    -- O LIMITE GLOBAL. Conta o que chegou no último minuto.
    SELECT count(*) INTO v_count
    FROM public.extension_diagnostics
    WHERE created_at > now() - interval '1 minute';

    IF v_count + jsonb_array_length(p_events) > v_limit THEN
        RETURN jsonb_build_object('accepted', false, 'reason', 'global_rate_limit', 'current', v_count);
    END IF;

    -- A GRAVAÇÃO DO LOTE.
    INSERT INTO public.extension_diagnostics (
        schema_version,
        source,
        error_code,
        event_name,
        component,
        severity,
        extension_version,
        browser,
        browser_major,
        message,
        occurrences,
        diagnostics,
        occurred_at,
        is_test_event
    )
    SELECT
        (e ->> 'schema_version')::smallint,
        COALESCE(e ->> 'source', 'voltris-shield-extension'),
        (e ->> 'error_code')::text,
        (e ->> 'event_name')::text,
        (e ->> 'component')::text,
        (e ->> 'severity')::text,
        (e ->> 'extension_version')::text,
        (e ->> 'browser')::text,
        (e ->> 'browser_major')::text,
        left(COALESCE(e ->> 'message', ''), 500)::text,
        GREATEST(1, COALESCE((e ->> 'occurrences')::int, 1)),
        CASE WHEN e ? 'diagnostics' AND e -> 'diagnostics' <> 'null'::jsonb
             THEN e -> 'diagnostics' ELSE NULL END,
        COALESCE((e ->> 'occurred_at')::timestamptz, now()),
        COALESCE((e ->> 'is_test_event')::boolean, FALSE)
    FROM jsonb_array_elements(p_events) AS e
    WHERE e ? 'error_code' AND e ? 'event_name' AND e ? 'component';

    GET DIAGNOSTICS v_inserted = ROW_COUNT;

    RETURN jsonb_build_object('accepted', true, 'count', v_inserted);
END;
$$;

COMMENT ON FUNCTION public.record_extension_diagnostics(JSONB) IS
    'Registra um lote de diagnosticos da extensao VOLTRIS Shield: confere o limite global por minuto e grava, na mesma transacao. Chamada apenas pela service role.';

-- ---------------------------------------------------------------------------
-- 3. O ACESSO
-- ---------------------------------------------------------------------------
--
-- A tabela é de SERVIDOR. Nenhum papel do Supabase a enxerga, e a função
-- só pode ser chamada pela service role — que é o papel do backend.

ALTER TABLE public.extension_diagnostics ENABLE ROW LEVEL SECURITY;

-- Nenhum papel do Supabase (anon, authenticated) tem politica de leitura:
-- sem politica, o RLS nega. As duas linhas abaixo são explícitas para que
-- a negacao seja uma DECISAO e nao uma ausencia.

REVOKE ALL ON public.extension_diagnostics FROM anon;
REVOKE ALL ON public.extension_diagnostics FROM authenticated;

REVOKE ALL ON FUNCTION public.record_extension_diagnostics(JSONB) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.record_extension_diagnostics(JSONB) FROM anon;
REVOKE ALL ON FUNCTION public.record_extension_diagnostics(JSONB) FROM authenticated;
GRANT EXECUTE ON FUNCTION public.record_extension_diagnostics(JSONB) TO service_role;

-- ---------------------------------------------------------------------------
-- 4. A RETENÇÃO
-- ---------------------------------------------------------------------------
--
-- 90 dias para os incidentes, 7 dias para os eventos de teste. A remoção
-- é feita por um job (ou por uma tarefa pg_cron); os scripts são
-- idempotentes e só removem o que já passou do prazo.
--
--   DELETE FROM public.extension_diagnostics
--    WHERE created_at < now() - interval '90 days';
--
--   DELETE FROM public.extension_diagnostics
--    WHERE is_test_event AND created_at < now() - interval '7 days';
--
-- A mesma janela vale para o que a função usa no limite global: a limpeza
-- apaga o que passou do prazo, e o limite só olha para o último minuto.
