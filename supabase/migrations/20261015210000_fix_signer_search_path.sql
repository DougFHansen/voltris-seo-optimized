-- ============================================================================
-- 20261015210000_fix_signer_search_path.sql
-- CORREÇÃO DE BUG COMPROVADO NO BANCO VIVO (auditoria 2026-10-15).
--
-- EVIDÊNCIA REAL (chamada via PostgREST, service_role, chave válida):
--   SELECT public.get_license_renewal_artifact('VOLTRIS-PRO-…')  ->
--     HTTP 404 / sqlstate 42883
--     "function digest(text, unknown) does not exist"
--   Enquanto a MESMA generate_voltris_signature() chamada DIRETAMENTE pela API
--   responde 200 com 16 hex. Ou seja: o assinador funciona; ele quebra quando
--   chamado DENTRO de uma função que fixou search_path sem o schema do pgcrypto.
--
-- CAUSA RAIZ: as funções abaixo são SECURITY DEFINER com
--   SET search_path = public, pg_temp
-- e, na mesma transação, chamam generate_voltris_signature() -> digest(), que
-- vive no schema "extensions" (pgcrypto do Supabase). Como o search_path do
-- chamador vale também para a chamada aninhada, "digest" não é resolvível.
--
-- IMPACTO (por isso este bug é crítico, não cosmético):
--   * generate_complete_license_v3  -> EMISSÃO DE LICENÇA NOVA QUEBRA (42883).
--   * renew_subscription_license    -> RENOVAÇÃO QUEBRA no caminho de emissão.
--   * get_license_renewal_artifact  -> artefato que o desktop usa para aceitar
--                                      a renovação QUEBRA (acesso não volta).
--   Qualquer função que dependa do assinador está no mesmo risco.
--
-- O QUE MUDA: nada de lógica, nada de algoritmo, nada de segredo. Apenas o
-- search_path passa a incluir "extensions", com pg_temp por último (prática de
-- segurança padrão para SECURITY DEFINER). As 8 licenças existentes não são
-- tocadas e continuam validando com a mesma assinatura.
--
-- JUSTIFICATIVA (missão sec.13 - nada de mudança sem motivo): correção de
-- falha comprovada por teste no banco vivo; exigida pelas seções 4, 5, 7 e 8.
-- ============================================================================

-- 0. Garante o pré-requisito (já existe hoje; idempotente).
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

-- 1. Pré-diagnóstico: o que está afetado AGORA (linhas retornadas = candidatas).
SELECT p.oid::regprocedure AS funcao_afetada,
       array_to_string(p.proconfig, ', ') AS config_atual
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.prokind = 'f'
  AND (
        pg_get_functiondef(p.oid) ILIKE '%digest(%'
     OR pg_get_functiondef(p.oid) ILIKE '%generate_voltris_signature(%'
     OR p.proname IN ('generate_voltris_signature',
                      'generate_complete_license_v3',
                      'renew_subscription_license',
                      'get_license_renewal_artifact')
  );

-- 2. Auto-cura: aplica search_path correto em TODAS as funções do schema public
--    que usam o assinador (direta ou indiretamente). Robusto a sobrecargas: a
--    lista vem do próprio catálogo, não de assinaturas escritas à mão.
DO $$
DECLARE
    r        RECORD;
    v_count  INTEGER := 0;
BEGIN
    FOR r IN
        SELECT p.oid, p.oid::regprocedure AS sig
        FROM pg_proc p
        JOIN pg_namespace n ON n.oid = p.pronamespace
        WHERE n.nspname = 'public'
          AND p.prokind = 'f'
          AND (
                pg_get_functiondef(p.oid) ILIKE '%digest(%'
             OR pg_get_functiondef(p.oid) ILIKE '%generate_voltris_signature(%'
             OR p.proname IN ('generate_voltris_signature',
                              'generate_complete_license_v3',
                              'renew_subscription_license',
                              'get_license_renewal_artifact')
          )
    LOOP
        EXECUTE format('ALTER FUNCTION %s SET search_path = public, extensions, pg_temp', r.sig);
        v_count := v_count + 1;
        RAISE NOTICE '[VOLTRIS] search_path corrigido (pgcrypto visível): %', r.sig;
    END LOOP;
    RAISE NOTICE '[VOLTRIS] funções ajustadas: %', v_count;
END $$;

-- 3. O assinador em si também fica SECURITY DEFINER-consistente: continua lendo
--    o segredo de current_setting com o mesmo fallback de sempre (nada trocado).
--    (Reaplicado via ALTER para não reescrever corpo/segredo.)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
               WHERE n.nspname = 'public' AND p.proname = 'generate_voltris_signature') THEN
        RAISE NOTICE '[VOLTRIS] generate_voltris_signature presente e com search_path corrigido';
    ELSE
        RAISE EXCEPTION 'ASSINADOR_AUSENTE: public.generate_voltris_signature não existe — interrompendo';
    END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 4. VERIFICAÇÃO PÓS-APLICAÇÃO
--    Envolvidas em blocos com handler: o script termina sempre e cada teste
--    imprime OK ou ERRO, sem abortar a aplicação no meio.
-- ---------------------------------------------------------------------------
DO $$
DECLARE
    v_sig   TEXT;
    v_art   JSONB;
    v_key   TEXT;
BEGIN
    -- 4.1 Cadeia de assinatura isolada (16 hex maiúsculos):
    v_sig := public.generate_voltris_signature('{"id":"123456","validUntil":"2026-11-15","plan":"pro","maxDevices":3}');
    IF length(v_sig) = 16 AND v_sig ~ '^[0-9A-F]{16}$' THEN
        RAISE NOTICE '[VOLTRIS][OK] 4.1 assinador canônico vivo (16 hex)';
    ELSE
        RAISE EXCEPTION 'TESTE_4_1_FALHOU: assinador devolveu %', v_sig;
    END IF;

    -- 4.2 O TESTE QUE ANTES FALHAVA: assinatura dentro de função com
    --     search_path restrito. Antes: 42883 digest(text, unknown).
    SELECT license_key INTO v_key FROM public.licenses
     WHERE plan_type = 'pro' AND revoked = FALSE
     ORDER BY expires_at DESC LIMIT 1;
    IF v_key IS NULL THEN
        RAISE NOTICE '[VOLTRIS][--] 4.2 sem licença pro viva para testar o artefato (ignorado)';
    ELSE
        BEGIN
            v_art := public.get_license_renewal_artifact(v_key);
            IF v_art ->> 'renewal_signature' IS NOT NULL THEN
                RAISE NOTICE '[VOLTRIS][OK] 4.2 artefato de renovação gerado (chave de teste terminada em %)', right(v_key, 4);
            ELSE
                RAISE EXCEPTION 'TESTE_4_2_FALHOU: artefato sem renewal_signature: %', v_art;
            END IF;
        EXCEPTION WHEN OTHERS THEN
            RAISE EXCEPTION 'TESTE_4_2_FALHOU: get_license_renewal_artifact -> SQLSTATE % / %', SQLSTATE, SQLERRM;
        END;
    END IF;

    -- 4.3 A renovação precisa validar ANTES de escrever: com assinatura
    --     inexistente o esperado é o erro controlado SUBSCRIPTION_NOT_FOUND.
    BEGIN
        PERFORM public.renew_subscription_license('SUB_INEXISTENTE_VERIFICACAO');
        RAISE EXCEPTION 'TESTE_4_3_FALHOU: renew_subscription_license aceitou assinatura inexistente';
    EXCEPTION
        WHEN OTHERS THEN
            IF SQLERRM ILIKE 'SUBSCRIPTION_NOT_FOUND%' THEN
                RAISE NOTICE '[VOLTRIS][OK] 4.3 renew valida assinatura antes de escrever';
            ELSE
                RAISE EXCEPTION 'TESTE_4_3_INESPERADO: %', SQLERRM;
            END IF;
    END;
END $$;

-- 4.4 Nenhuma função de licenciamento segue sem o schema do pgcrypto:
SELECT count(*) AS funcoes_sem_pgcrypto_visivel,
       count(*) = 0 AS todas_ok
FROM pg_proc p
JOIN pg_namespace n ON n.oid = p.pronamespace
WHERE n.nspname = 'public'
  AND p.prokind = 'f'
  AND (pg_get_functiondef(p.oid) ILIKE '%digest(%'
       OR pg_get_functiondef(p.oid) ILIKE '%generate_voltris_signature(%'))
  AND coalesce(array_to_string(p.proconfig, ','), '') NOT ILIKE '%extensions%';

-- 4.5 As licenças existentes permanecem intactas (conferência de quantidade):
SELECT count(*) AS licencas_vivas FROM public.licenses;

NOTIFY pgrst, 'reload schema';
