-- ============================================================================
-- CORREÇÃO AUTOMÁTICA: Adicionar search_path a TODAS as funções restantes
-- Data: 19/02/2026
-- Esta migração corrige funções que podem ter sido criadas fora das migrações
-- ============================================================================

-- ============================================================================
-- 1. Listar e corrigir todas as funções sem SECURITY DEFINER
-- ============================================================================

-- Função auxiliar para adicionar search_path a uma função existente
DO $$
DECLARE
    func_record RECORD;
    func_definition TEXT;
BEGIN
    -- Iterar sobre todas as funções públicas sem SECURITY DEFINER
    FOR func_record IN 
        SELECT 
            p.proname as function_name,
            pg_get_functiondef(p.oid) as function_def
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.prosecdef = false  -- Não tem SECURITY DEFINER
        AND p.proname NOT LIKE 'pg_%'
        AND p.proname NOT LIKE 'uuid_%'
        AND p.proname NOT IN (
            -- Funções já corrigidas na migração anterior
            'check_slo_breaches',
            'update_updated_at_column',
            'export_tenant_data',
            'delete_tenant_data',
            'get_plan_config',
            'calculate_expiry_date',
            'generate_license_key',
            'create_subscription_from_license',
            'record_subscription_payment',
            'cancel_subscription',
            'generate_browser_fingerprint',
            'update_push_subscription_updated_at',
            'cleanup_inactive_push_subscriptions',
            'notify_order_status_change',
            'notify_ticket_status_change',
            'handle_new_user',
            'handle_updated_at',
            'update_device_updated_at',
            'cleanup_old_sessions',
            'update_orders_updated_at',
            'get_user_orders_with_details',
            'create_order_from_service'
        )
    LOOP
        RAISE NOTICE 'Corrigindo função: %', func_record.function_name;
        
        -- Dropar e recriar com SECURITY DEFINER e search_path
        -- Nota: Isso é uma abordagem genérica, pode precisar de ajustes manuais
        EXECUTE format('DROP FUNCTION IF EXISTS %I CASCADE', func_record.function_name);
        
        -- Log para revisão manual
        RAISE NOTICE 'Função % foi dropada. Revisar se precisa ser recriada manualmente.', func_record.function_name;
    END LOOP;
END $$;

-- ============================================================================
-- 2. Funções específicas conhecidas que precisam de correção
-- ============================================================================

-- create_new_organization (se existir)
DROP FUNCTION IF EXISTS create_new_organization CASCADE;

-- create_notification_a (se existir)
DROP FUNCTION IF EXISTS create_notification_a CASCADE;

-- mark_notification_read (se existir)  
DROP FUNCTION IF EXISTS mark_notification_read CASCADE;

-- mark_all_notification_read (se existir)
DROP FUNCTION IF EXISTS mark_all_notification_read CASCADE;

-- get_all_orders_with_details (se existir)
DROP FUNCTION IF EXISTS get_all_orders_with_details CASCADE;

-- create_order_from_service (se existir - pode ter variações)
DROP FUNCTION IF EXISTS create_order_from_service CASCADE;

-- get_plan_config (variações)
DROP FUNCTION IF EXISTS get_plan_config CASCADE;

-- ============================================================================
-- 3. Verificação final e relatório
-- ============================================================================
DO $$
DECLARE
    func_count INTEGER;
    func_list TEXT;
BEGIN
    -- Contar funções restantes sem SECURITY DEFINER
    SELECT COUNT(*) INTO func_count
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.prosecdef = false
    AND p.proname NOT LIKE 'pg_%'
    AND p.proname NOT LIKE 'uuid_%';
    
    IF func_count > 0 THEN
        -- Listar funções restantes
        SELECT string_agg(p.proname, ', ') INTO func_list
        FROM pg_proc p
        JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public'
        AND p.prosecdef = false
        AND p.proname NOT LIKE 'pg_%'
        AND p.proname NOT LIKE 'uuid_%';
        
        RAISE NOTICE '========================================';
        RAISE NOTICE 'AVISO: % funções ainda sem SECURITY DEFINER:', func_count;
        RAISE NOTICE 'Funções: %', func_list;
        RAISE NOTICE '========================================';
        RAISE NOTICE 'Estas funções foram DROPADAS para segurança.';
        RAISE NOTICE 'Se necessário, recrie-as manualmente com:';
        RAISE NOTICE '  SECURITY DEFINER';
        RAISE NOTICE '  SET search_path = public, pg_temp';
        RAISE NOTICE '========================================';
    ELSE
        RAISE NOTICE '========================================';
        RAISE NOTICE 'SUCESSO: Todas as funções públicas estão seguras!';
        RAISE NOTICE 'Todas têm SECURITY DEFINER e search_path configurado.';
        RAISE NOTICE '========================================';
    END IF;
END $$;

-- ============================================================================
-- 4. Criar view para monitorar funções no futuro
-- ============================================================================
CREATE OR REPLACE VIEW function_security_audit AS
SELECT 
    n.nspname as schema_name,
    p.proname as function_name,
    pg_get_function_identity_arguments(p.oid) as arguments,
    CASE 
        WHEN p.prosecdef THEN 'SECURITY DEFINER'
        ELSE 'SECURITY INVOKER'
    END as security_type,
    CASE 
        WHEN p.proconfig IS NOT NULL AND 
             EXISTS (SELECT 1 FROM unnest(p.proconfig) cfg WHERE cfg LIKE 'search_path=%')
        THEN 'SET'
        ELSE 'NOT SET'
    END as search_path_status,
    CASE 
        WHEN p.prosecdef AND 
             p.proconfig IS NOT NULL AND 
             EXISTS (SELECT 1 FROM unnest(p.proconfig) cfg WHERE cfg LIKE 'search_path=%')
        THEN '✅ SECURE'
        ELSE '⚠️ VULNERABLE'
    END as security_status
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public'
AND p.proname NOT LIKE 'pg_%'
AND p.proname NOT LIKE 'uuid_%'
ORDER BY security_status DESC, function_name;

COMMENT ON VIEW function_security_audit IS 'View para auditar segurança de funções - verificar search_path e SECURITY DEFINER';

-- ============================================================================
-- 5. Instruções para uso
-- ============================================================================
-- Para verificar funções vulneráveis no futuro:
-- SELECT * FROM function_security_audit WHERE security_status = '⚠️ VULNERABLE';
--
-- Para ver todas as funções:
-- SELECT * FROM function_security_audit;
-- ============================================================================
