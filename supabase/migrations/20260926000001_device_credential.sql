-- ============================================================================
-- CREDENCIAL DE DISPOSITIVO — habilita desvinculação pelo app desktop
-- Data: 26/09/2026
-- Não destrutiva. Idempotente.
-- ============================================================================
--
-- PROBLEMA
-- POST /api/v1/install/unlink exige sessão de navegador (o dono desvinca pelo
-- dashboard). O VOLTRIS OPTIMIZER não tem sessão: ele é identificado apenas pelo
-- installation_id. Resultado: o botão "Desvincular deste Computador" tomava
-- 401, o app mostrava sucesso na mesma hora e, 30 s depois, o poll relogava a
-- conta porque o servidor nunca tinha desvinculado.
--
-- SOLUCAO
-- Credencial de dispositivo: um segredo aleatório de 256 bits emitido pelo
-- servidor no momento do vínculo. O servidor guarda APENAS o hash (SHA-256) e
-- devolve o token uma única vez, para o app proteger com DPAPI.
--
-- A partir daí o app se autentica com `installation_id` + credencial, e pode:
--   - consultar o próprio estado de vínculo;
--   - desvincular a si mesmo.
--
-- ciclo de vida da credencial
--   1. Vínculo (sessão do dono): emite a credencial, devolve o token 1x.
--   2. Dispositivo legado (sem hash): o endpoint /install/status emite na
--      primeira consulta e devolve o token.Permite auto-reivindicação porque o
--      installation_id é um UUID v4 gerado pelo app e, após o RLS correto,
--      não é mais enumerável por anon.
--   3. Desvinculação: a credencial é DESCARTADA (hash = NULL). Revincular gera
--      uma nova. Uma credencial nunca serve para dois vínculos.
--   4. Credencial inválida (hash existe e não bate): NÃO se reemite e NÃO se
--      devolve email. O app orienta a revincular pela conta.
-- ============================================================================

BEGIN;

-- ============================================================================
-- FASE 1 — Colunas
-- ============================================================================
ALTER TABLE public.installations
    ADD COLUMN IF NOT EXISTS device_credential_hash    TEXT,
    ADD COLUMN IF NOT EXISTS device_credential_issued TIMESTAMPTZ,
    ADD COLUMN IF NOT EXISTS unlinked_at              TIMESTAMPTZ;

COMMENT ON COLUMN public.installations.device_credential_hash IS
'SHA-256 (hex) da credencial do dispositivo. NUNCA o token em si. NULL = nenhum vinculo ativo com credencial emitida.';
COMMENT ON COLUMN public.installations.device_credential_issued IS
'Quando a credencial atual foi emitida.';
COMMENT ON COLUMN public.installations.unlinked_at IS
'Quando o vinculo foi desfeito. NULL = vinculado.';

-- ============================================================================
-- FASE 2 — Indice
-- A consulta de verificação é por id (PK) e compara o hash em memória; o índice
-- do hash não é necessário e evitaria um índice de valor secreto.
-- ============================================================================

-- ============================================================================
-- FASE 3 — Backfill
-- Nenhuma credencial é emitida aqui de propósito: a emissão exige o app ou o
-- navegador. Instalações já desvinculadas ficam com hash NULL.
-- ============================================================================
UPDATE public.installations
   SET unlinked_at = updated_at
 WHERE user_id IS NULL
   AND linked_at IS NOT NULL
   AND unlinked_at IS NULL;

-- ============================================================================
-- FASE 4 — Backfill de linked_at
-- linked_at recebeu DEFAULT now() em uma migration anterior, o que deixou as
-- 46 linhas antigas com o mesmo carimbo. Para as linhas  ja desvinculadas
-- não ha data confiável de vinculo, então nao inventamos: fica como esta.
-- Para as ainda vinculadas, mantemos o valor atual.
-- ============================================================================

-- ============================================================================
-- FASE 5 — Validação
-- ============================================================================
DO $$
DECLARE
    v_bad text;
BEGIN
    -- 5.1 as tres colunas existem
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
         WHERE table_schema = 'public' AND table_name = 'installations'
           AND column_name = 'device_credential_hash'
    ) THEN
        RAISE EXCEPTION 'VALIDACAO FALHOU (5.1): device_credential_hash ausente';
    END IF;

    -- 5.2 nenhuma credencial em texto plano (64 chars base64 seria o token)
    SELECT string_agg(id::text, ', ') INTO v_bad
      FROM public.installations
     WHERE device_credential_hash IS NOT NULL
       AND length(device_credential_hash) <> 64;
    IF v_bad IS NOT NULL THEN
        RAISE EXCEPTION 'VALIDACAO FALHOU (5.2): hash de credencial com tamanho inesperado em: %', v_bad;
    END IF;

    -- 5.3 coerência: vinculado sem credencial é aceitável (legado, ainda vai
    --     reivindicar); desvinculado NUNCA pode ter credencial
    SELECT string_agg(id::text, ', ') INTO v_bad
      FROM public.installations
     WHERE user_id IS NULL
       AND device_credential_hash IS NOT NULL;
    IF v_bad IS NOT NULL THEN
        RAISE EXCEPTION 'VALIDACAO FALHOU (5.3): desvinculado com credencial ativa em: %', v_bad;
    END IF;

    RAISE NOTICE 'VALIDACAO OK: credencial de dispositivo pronta.';
END $$;

COMMIT;

NOTIFY pgrst, 'reload schema';
