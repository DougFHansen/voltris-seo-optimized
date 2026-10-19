-- ============================================================================
-- 20261019130000_email_outbox.sql
-- Missão FASE 11 — OUTBOX TRANSACIONAL DE E-MAIL (Resend)
--
-- CONTEXTO (auditado em 2026-10-19 contra o banco de produção):
--   Não existe NENHUMA tabela de fila/outbox de e-mail. Foram verificadas
--   `email_queue`, `email_outbox`, `emails` e `email_log` — todas inexistentes.
--   O serviço `services/emailService.ts` inseria em `email_queue`, que nunca
--   existiu: o insert falhava em silêncio e a função retornava `true` mesmo
--   sem ter enviado nada. Esse arquivo também não é chamado por lugar nenhum.
--
--   `public.notifications` existe, mas é notificação IN-APP (sino do painel) e
--   `public.newsletter_subscribers` é marketing. Nenhuma das duas serve para
--   e-mail transacional com retry, então a tabela nova é necessária — e é
--   aditiva, sem tocar em nenhuma delas.
--
-- DECISÕES:
--   - NADA destrutivo: só CREATE TABLE IF NOT EXISTS, índices e RLS.
--   - A tabela é a FONTE DA VERDADE do envio. Memória de processo serverless
--     morre a cada cold start, então todo estado (tentativas, próximo retry,
--     id da mensagem na Resend) mora aqui.
--   - `idempotency_key` com índice ÚNICO: é o que impede e-mail duplicado
--     quando a Stripe reenvia um webhook.
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.email_outbox (
    id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Qual notificação é esta.
    template_type       text NOT NULL,

    -- -----------------------------------------------------------
    -- IDEMPOTÊNCIA
    --
    -- Determinística a partir do FATO DE NEGÓCIO, nunca de relógio/aleatório.
    --   purchase:<payment_id>              -> 1 e-mail por compra
    --   renewal:<stripe_invoice_id>        -> 1 e-mail por cobrança recorrente
    --   cancel:<subscription_id>:<iso>     -> 1 e-mail por cancelamento
    --   refund:<refund_id|request_id>      -> 1 e-mail por reembolso
    --
    -- Esta é a MESMA chave enviada como header `Idempotency-Key` para a Resend.
    -- Cobre os dois cenários: reenvio de webhook e resposta perdida.
    -- -----------------------------------------------------------
    idempotency_key     text NOT NULL,

    -- Destinatário e vínculos (NUNCA enviados ao cliente).
    recipient_email     text NOT NULL,
    user_id             uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    payment_id          uuid REFERENCES public.payments(id) ON DELETE SET NULL,
    license_key         text,
    subscription_id     text,

    -- Conteúdo JÁ RENDERIZADO. Guardar o HTML final (e não só os dados) é
    -- deliberado: o que foi enviado é recuperável para auditoria, e o retry
    -- não pode divergir do original por re-renderização com dados novos.
    subject             text NOT NULL,
    html_body           text NOT NULL,
    text_body           text,

    -- Anexo (a fatura em PDF) em base64. Guardar permite reenvio sem
    -- regenerar o documento — importante porque a fatura é histórica.
    attachment_name     text,
    attachment_content  text,
    attachment_size     integer,

    -- -----------------------------------------------------------
    -- ESTADO
    --
    -- pending    -> aguardando envio (1ª tentativa ou retry programado)
    -- processing -> reservado por um worker (evita envio concorrente)
    -- sent       -> a Resend ACEITOU. NÃO significa entregue na caixa:
    --               quem confirma entrega é o webhook da Resend (FASE 12).
    -- failed     -> rejeitado definitivamente ou tentativas esgotadas
    -- canceled   -> cancelado de propósito (ex.: reenvio manual)
    -- -----------------------------------------------------------
    status              text NOT NULL DEFAULT 'pending',

    -- Id da mensagem na Resend (base para correlacionar com o webhook).
    provider_message_id text,

    attempts            integer NOT NULL DEFAULT 0,
    available_at        timestamptz NOT NULL DEFAULT NOW(),   -- agenda do retry
    last_error          text,
    last_error_kind     text,                                 -- CONFIG|AUTH|RATE_LIMIT|...

    sent_at             timestamptz,

    -- -----------------------------------------------------------------------
    -- ENTREGA (FASE 12) — separada de propósito de `status`.
    --
    -- A distinção que a missão exige e que estas colunas preservam:
    --   status='sent'            -> a Resend ACEITOU o envio
    --   delivery_status='delivered' -> o servidor de destino RECEBEU
    --   delivery_status='opened'    -> o destinatário ABRIU
    --
    -- Uma coluna só não daria conta: um e-mail aceito que nunca chega é
    -- exatamente o caso que o suporte precisa enxergar, e ele é
    -- INVISÍVEL se 'sent' for tratado como sucesso.
    --
    -- `delivery_flag` isola bounce/complained porque isso é sinal de
    -- REPUTAÇÃO (endereço ruim), não falha de envio — mexer em `status`
    -- com bounce esconderia a falha real de configuração do remetente.
    -- -----------------------------------------------------------------------
    delivery_status     text,      -- sent|delivered|delayed|opened|clicked|bounced|complained|failed
    delivered_at        timestamptz,
    opened_at           timestamptz,
    delivery_flag       text,      -- bounced|complained
    delivery_flag_at    timestamptz,

    meta                jsonb,

    created_at          timestamptz NOT NULL DEFAULT NOW(),
    updated_at          timestamptz NOT NULL DEFAULT NOW()
);

-- ---------------------------------------------------------------------------
-- 1. IDEMPOTÊNCIA — a proteção central contra e-mail duplicado.
--
--    Índice ÚNICO (não parcial): qualquer repetição da chave é rejeitada pelo
--    banco, independentemente de qual worker/processo tentou.
-- ---------------------------------------------------------------------------
CREATE UNIQUE INDEX IF NOT EXISTS uniq_email_outbox_idempotency_key
    ON public.email_outbox (idempotency_key);

-- ---------------------------------------------------------------------------
-- 2. ÍNDICES DE OPERAÇÃO
-- ---------------------------------------------------------------------------
-- Worker: busca as linhas prontas, em ordem de chegada.
CREATE INDEX IF NOT EXISTS idx_email_outbox_ready
    ON public.email_outbox (available_at)
    WHERE status IN ('pending', 'processing');

CREATE INDEX IF NOT EXISTS idx_email_outbox_status
    ON public.email_outbox (status, created_at DESC);

-- Admin: histórico por cliente.
CREATE INDEX IF NOT EXISTS idx_email_outbox_user
    ON public.email_outbox (user_id, created_at DESC);

-- Webhook da Resend: correlação pelo id da mensagem.
CREATE INDEX IF NOT EXISTS idx_email_outbox_provider_id
    ON public.email_outbox (provider_message_id)
    WHERE provider_message_id IS NOT NULL;

-- Diagnóstico de reputação: quantos endereços devolveram/spamaram.
CREATE INDEX IF NOT EXISTS idx_email_outbox_delivery_flag
    ON public.email_outbox (delivery_flag_at DESC)
    WHERE delivery_flag IS NOT NULL;

-- Diagnóstico: falhas recentes de um template específico.
CREATE INDEX IF NOT EXISTS idx_email_outbox_template_failed
    ON public.email_outbox (template_type, created_at DESC)
    WHERE status = 'failed';

-- ---------------------------------------------------------------------------
-- 3. updated_at automático
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- 4. SEGURANÇA (FASE 11/§13 — "Nenhum usuário comum poderá visualizar e-mails
--    transacionais de outros clientes")
--
--    A tabela contém corpo de e-mail e o endereço do destinatário. Por isso:
--    RLS ligado, SEM policy para anon/authenticated (nem o próprio dono lê),
--    e o acesso acontece só pela API autenticada com service_role depois de
--    validar `profiles.is_admin`.
--
--    Nada de "policy que filtra por user_id": isso exporia o histórico de
--    e-mail (incluindo HTML e anexos) para qualquer usuário autenticado.
-- ---------------------------------------------------------------------------
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

-- ---------------------------------------------------------------------------
-- 5. Views de diagnóstico (somente leitura, sem dados sensíveis além do
--    necessário para o admin decidir o que fazer)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.email_outbox_health
WITH (security_invoker = true) AS
SELECT
    status,
    count(*)::int AS total,
    min(created_at)  AS oldest_created_at,
    min(available_at) AS next_available_at,
    count(*) FILTER (WHERE last_error_kind = 'RATE_LIMIT')::int AS rate_limited,
    count(*) FILTER (WHERE last_error_kind IN ('CONFIG', 'AUTH', 'SENDER'))::int AS config_errors
FROM public.email_outbox
GROUP BY status;

-- ---------------------------------------------------------------------------
-- 6. Verificação pós-aplicação
-- ---------------------------------------------------------------------------
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'email_outbox'
ORDER BY ordinal_position;

-- Deve retornar exatamente 1 linha com 'sim':
SELECT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename = 'email_outbox'
      AND indexname = 'uniq_email_outbox_idempotency_key'
) AS idempotency_unico_ok;

-- Deve retornar 'sim':
SELECT (SELECT relrowsecurity FROM pg_class WHERE relname = 'email_outbox') AS rls_ligado;

-- Deve retornar 0 linhas:
SELECT policyname FROM pg_policies WHERE tablename = 'email_outbox' AND polroles <> '{8300}';

NOTIFY pgrst, 'reload schema';