-- ============================================================================
-- 20261019120000_billing_facts.sql
-- Missão §3, §5, §7, §8 e §10 — FATOS FINANCEIROS que faltavam no banco.
--
-- DIAGNÓSTICO (verificado no banco de produção em 2026-10-19):
--   1. `public.subscriptions.next_billing_at` é NULL em 7/7 linhas e
--      `canceled_at` NULL em 7/7. O painel decide "Renovação: desligada"
--      lendo exatamente essa coluna — a assinatura estava ATIVA na Stripe e o
--      banco não tinha o dado para provar isso.
--   2. Não existe `cancel_at_period_end` em `subscriptions`: o cancelamento
--      agendado na Stripe não tinha espelho local, então um sincronismo mal
--      feito sobrescrevia cancelamento confirmado.
--   3. `public.payments` guarda no máximo UM identificador Stripe
--      (`stripe_id`), e ele é sobrescrito por `COALESCE(stripe_id, ...)`.
--      Isso torna impossível:
--        - distinguir a compra inicial de uma RENOVAÇÃO (mesmo `stripe_id`
--          guardado para o pagamento);
--        - emitir fatura histórica da cobrança certa;
--        - impedir reembolso duplicado (não há onde gravar o refund id);
--        - dizer qual fatura da Stripe corresponde à cobrança.
--   4. Não existe registro de solicitação manual de reembolso: o caso "fora da
--      janela de 7 dias" simplesmente não tinha onde ser protocolado.
--
-- DECISÕES (itens 1-5, 14 e 15 da missão):
--   - NADA é destrutivo: só ADD COLUMN IF NOT EXISTS e CREATE IF NOT EXISTS.
--     Nenhuma linha existente de payments/subscriptions/licenses é alterada.
--   - Colunas novas são NULLABLE e sem DEFAULT: linha antiga continua válida
--     e significa "informação não registrada naquela época" — nunca "falso".
--   - A verdade continua sendo a Stripe.Estas colunas são o ESPELHO local,
--     escrito exclusivamente pelo webhook e por rotas autenticadas.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. Espelho fiel da assinatura na Stripe
-- ---------------------------------------------------------------------------
ALTER TABLE public.subscriptions
    ADD COLUMN IF NOT EXISTS stripe_customer_id  TEXT,       -- cus_...
    ADD COLUMN IF NOT EXISTS cancel_at_period_end BOOLEAN,   -- espelho do flag da Stripe
    ADD COLUMN IF NOT EXISTS cancel_at           TIMESTAMPTZ,-- epoch pedido pelo cliente
    ADD COLUMN IF NOT EXISTS canceled_reason     TEXT,       -- duplicate|cancellation_requested|fraudulent|null
    ADD COLUMN IF NOT EXISTS ended_at            TIMESTAMPTZ,-- current_period_end quando cancelou
    ADD COLUMN IF NOT EXISTS stripe_price_id     TEXT,       -- price_... (autoridade do plano/período)
    ADD COLUMN IF NOT EXISTS latest_invoice_id   TEXT,       -- in_... da última cobrança
    ADD COLUMN IF NOT EXISTS payment_method_brand TEXT,      -- visa/master/…
    ADD COLUMN IF NOT EXISTS payment_method_last4 TEXT;      -- somente últimos 4 dígitos

-- ---------------------------------------------------------------------------
-- 2. Fatos por COBRANÇA (não por compra) — base da fatura PDF e do reembolso
-- ---------------------------------------------------------------------------
ALTER TABLE public.payments
    ADD COLUMN IF NOT EXISTS stripe_charge_id    TEXT,       -- ch_...
    ADD COLUMN IF NOT EXISTS stripe_invoice_id   TEXT,       -- in_...
    ADD COLUMN IF NOT EXISTS stripe_refund_id    TEXT,       -- re_... (idempotência de reembolso)
    ADD COLUMN IF NOT EXISTS refunded_amount     NUMERIC(12,2),
    ADD COLUMN IF NOT EXISTS refunded_at         TIMESTAMPTZ,
    -- 'purchase' (primeira compra) | 'renewal' (cobrança recorrente) | 'service'
    ADD COLUMN IF NOT EXISTS invoice_kind        TEXT,
    -- Período REALMENTE pago, conforme a Stripe (authoritative)
    ADD COLUMN IF NOT EXISTS period_start        TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS period_end          TIMESTAMPTZ,
    -- Data de liquidação confirmada (≠ created_at, que é a data da intenção)
    ADD COLUMN IF NOT EXISTS paid_at             TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS currency            TEXT DEFAULT 'BRL',
    ADD COLUMN IF NOT EXISTS customer_name_snapshot TEXT;

-- ---------------------------------------------------------------------------
-- 3. Solicitações de reembolso (item 8: "registre a solicitação")
--
--    automatic  -> devolvido na API da Stripe dentro dos 7 dias
--    manual     -> fora da janela / falha técnica; aguardando a equipe
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.refund_requests (
    id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id         uuid REFERENCES public.payments(id) ON DELETE CASCADE,
    user_id            uuid REFERENCES auth.users(id) ON DELETE SET NULL,
    subscription_id    TEXT,                       -- sub_... quando houver
    stripe_charge_id   TEXT,
    stripe_refund_id   TEXT,
    amount             NUMERIC(12,2),
    currency           TEXT DEFAULT 'BRL',
    -- requested | processing | succeeded | failed | canceled | rejected
    status             TEXT NOT NULL DEFAULT 'requested',
    reason             TEXT NOT NULL DEFAULT 'customer_request',  -- requested_by_customer|duplicate|fraudulent
    source             TEXT NOT NULL DEFAULT 'automatic',        -- automatic|manual
    customer_message   TEXT,
    outcome_message    TEXT,
    policy_basis       TEXT,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved_at        TIMESTAMPTZ
);

-- Uma única solicitação ABERTA por cobrança: bloqueia reembolso duplicado no
-- nível do banco, não só na aplicação.
CREATE UNIQUE INDEX IF NOT EXISTS uniq_refund_request_open_per_payment
    ON public.refund_requests (payment_id)
    WHERE status IN ('requested', 'processing');

CREATE UNIQUE INDEX IF NOT EXISTS uniq_refund_request_open_per_charge
    ON public.refund_requests (stripe_charge_id)
    WHERE status IN ('requested', 'processing') AND stripe_charge_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_refund_requests_user  ON public.refund_requests (user_id);
CREATE INDEX IF NOT EXISTS idx_refund_requests_stat  ON public.refund_requests (status);
CREATE INDEX IF NOT EXISTS idx_refund_requests_pay   ON public.refund_requests (payment_id);

ALTER TABLE public.refund_requests ENABLE ROW LEVEL SECURITY;

-- Sem policy para anon/authenticated: o painel passa pela API autenticada, que
-- usa service_role depois de validar a sessão e a propriedade.
DROP POLICY IF EXISTS "service role only refund_requests" ON public.refund_requests;
CREATE POLICY "service role only refund_requests"
    ON public.refund_requests FOR ALL TO service_role
    USING (true) WITH CHECK (true);

REVOKE ALL ON public.refund_requests FROM PUBLIC, anon, authenticated;
GRANT ALL ON public.refund_requests TO service_role;

-- ---------------------------------------------------------------------------
-- 4. Trigger de updated_at (mesma convenção já usada no projeto)
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.set_updated_at_refund_requests()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_refund_requests_updated_at ON public.refund_requests;
CREATE TRIGGER tr_refund_requests_updated_at
    BEFORE UPDATE ON public.refund_requests
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_refund_requests();

-- ---------------------------------------------------------------------------
-- 5. Índices de consulta frequente (painel + webhook)
-- ---------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_payments_stripe_invoice   ON public.payments (stripe_invoice_id)   WHERE stripe_invoice_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payments_stripe_charge    ON public.payments (stripe_charge_id)    WHERE stripe_charge_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payments_stripe_sub_id    ON public.payments (stripe_subscription_id) WHERE stripe_subscription_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_payments_user_created     ON public.payments (user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user        ON public.subscriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_sub_id      ON public.subscriptions (pagbank_subscription_id);

-- ---------------------------------------------------------------------------
-- 6. Espelho automático de subscriptions -> payments.stripe_customer_id
--
--    O checkout grava o cus_ no pagamento; a assinatura é criada depois (no
--    webhook). Propagar aqui mantém os dois lados coerentes sem depender da
--    ordem em que os eventos chegam.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.sync_stripe_customer_to_payments()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.stripe_customer_id IS NOT NULL THEN
        UPDATE public.payments
           SET stripe_customer_id = NEW.stripe_customer_id,
               updated_at = NOW()
         WHERE stripe_subscription_id = NEW.pagbank_subscription_id
           AND (stripe_customer_id IS DISTINCT FROM NEW.stripe_customer_id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_subscriptions_stripe_customer ON public.subscriptions;
CREATE TRIGGER tr_subscriptions_stripe_customer
    AFTER INSERT OR UPDATE OF stripe_customer_id ON public.subscriptions
    FOR EACH ROW EXECUTE FUNCTION public.sync_stripe_customer_to_payments();

-- ---------------------------------------------------------------------------
-- 7. Backfill SEGURO (somente o que é dedutível sem adivinhar)
--
--    Regra da missão §10: "Não atualize indiscriminadamente registros pending
--    para paid". Aqui NENHUM status é inventado: só se copia um identificador
--    que já existe na própria linha para a coluna nova correspondente.
-- ---------------------------------------------------------------------------
UPDATE public.payments p
   SET stripe_customer_id = s.stripe_customer_id
  FROM public.subscriptions s
 WHERE s.pagbank_subscription_id = p.stripe_subscription_id
   AND p.stripe_customer_id IS NULL
   AND s.stripe_customer_id IS NOT NULL;

-- `invoice_kind` precisa de prova, não de suposição. Só é preenchido quando a
-- própria linha carrega a prova:
--   - 'renewal'  -> referência no formato gerado pelo webhook de recorrência;
--   - 'purchase' -> é o DEFAULT sem recorrência; serviço é decidido pelo plano
--                   (catálogo), não por adivinhação de texto.
UPDATE public.payments
   SET invoice_kind = 'renewal'
 WHERE invoice_kind IS NULL
   AND reference_id LIKE 'renew\_%';

UPDATE public.payments
   SET invoice_kind = COALESCE(invoice_kind, 'purchase')
 WHERE invoice_kind IS NULL;

-- ---------------------------------------------------------------------------
-- 8. Verificação pós-aplicação (rodar no SQL Editor e conferir)
-- ---------------------------------------------------------------------------
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'subscriptions'
  AND column_name IN ('stripe_customer_id','cancel_at_period_end','cancel_at','canceled_reason',
                      'ended_at','stripe_price_id','latest_invoice_id',
                      'payment_method_brand','payment_method_last4')
ORDER BY column_name;

SELECT column_name, data_type
FROM information_schema.columns
WHERE table_schema = 'public' AND table_name = 'payments'
  AND column_name IN ('stripe_charge_id','stripe_invoice_id','stripe_refund_id','refunded_amount',
                      'refunded_at','invoice_kind','period_start','period_end','paid_at','currency',
                      'customer_name_snapshot')
ORDER BY column_name;

SELECT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'refund_requests'
) AS refund_requests_ok;

NOTIFY pgrst, 'reload schema';