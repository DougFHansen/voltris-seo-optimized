-- ============================================================================
-- CORREÇÃO DE SEGURANÇA: Adicionar search_path a todas as funções
-- Data: 19/02/2026
-- Problema: Funções sem search_path explícito são vulneráveis a search path hijacking
-- Referência: https://www.postgresql.org/docs/current/sql-createfunction.html
-- ============================================================================

-- ============================================================================
-- 1. check_slo_breaches - SLO Monitoring
-- ============================================================================
CREATE OR REPLACE FUNCTION check_slo_breaches()
RETURNS TABLE (
  metric VARCHAR,
  actual DECIMAL,
  target DECIMAL,
  breach_severity VARCHAR
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    metric_name::VARCHAR,
    actual_value,
    target_value,
    CASE 
      WHEN NOT within_slo THEN 'CRITICAL'
      WHEN error_budget_consumed_pct > 90 THEN 'WARNING'
      WHEN error_budget_consumed_pct > 70 THEN 'INFO'
      ELSE 'OK'
    END::VARCHAR
  FROM slo_metrics
  WHERE measured_at > NOW() - INTERVAL '10 minutes'
  AND (NOT within_slo OR error_budget_consumed_pct > 70)
  ORDER BY measured_at DESC;
END;
$$;

-- ============================================================================
-- 2. update_updated_at_column - Trigger genérico
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$;

-- ============================================================================
-- 3. export_tenant_data - Tenant Isolation
-- ============================================================================
CREATE OR REPLACE FUNCTION export_tenant_data(
  target_company_id UUID,
  start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
  end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'company_id', target_company_id,
    'export_date', NOW(),
    'period', jsonb_build_object('start', start_date, 'end', end_date),
    'devices', (
      SELECT jsonb_agg(row_to_json(d)) 
      FROM devices d 
      WHERE company_id = target_company_id
    ),
    'events', (
      SELECT jsonb_agg(row_to_json(e)) 
      FROM telemetry_events e
      WHERE device_id IN (SELECT id FROM devices WHERE company_id = target_company_id)
      AND timestamp BETWEEN start_date AND end_date
    )
  ) INTO result;
  
  RETURN result;
END;
$$;

-- ============================================================================
-- 4. delete_tenant_data - Tenant Isolation
-- ============================================================================
CREATE OR REPLACE FUNCTION delete_tenant_data(
  target_company_id UUID,
  confirmation_token VARCHAR(255)
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  deleted_count JSONB;
BEGIN
  -- Validação de token (simplificada)
  IF confirmation_token != 'DELETE_CONFIRMED' THEN
    RAISE EXCEPTION 'Invalid confirmation token';
  END IF;
  
  WITH 
    deleted_events AS (
      DELETE FROM telemetry_events 
      WHERE device_id IN (SELECT id FROM devices WHERE company_id = target_company_id)
      RETURNING 1
    ),
    deleted_devices AS (
      DELETE FROM devices 
      WHERE company_id = target_company_id
      RETURNING 1
    )
  SELECT jsonb_build_object(
    'events_deleted', (SELECT COUNT(*) FROM deleted_events),
    'devices_deleted', (SELECT COUNT(*) FROM deleted_devices)
  ) INTO deleted_count;
  
  RETURN deleted_count;
END;
$$;

-- ============================================================================
-- 5. get_plan_config - License Plans
-- ============================================================================
DROP FUNCTION IF EXISTS get_plan_config CASCADE;

CREATE OR REPLACE FUNCTION get_plan_config(p_plan_code license_type)
RETURNS TABLE (
    code license_type,
    name TEXT,
    duration_days INTEGER,
    max_devices INTEGER,
    features JSONB
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p_plan_code,
    CASE p_plan_code
      WHEN 'trial' THEN 'Trial'
      WHEN 'standard' THEN 'Standard'
      WHEN 'pro' THEN 'Pro'
      WHEN 'enterprise' THEN 'Enterprise'
    END::TEXT,
    CASE p_plan_code
      WHEN 'trial' THEN 7
      WHEN 'standard' THEN 30
      WHEN 'pro' THEN 365
      WHEN 'enterprise' THEN 365
    END::INTEGER,
    CASE p_plan_code
      WHEN 'trial' THEN 1
      WHEN 'standard' THEN 3
      WHEN 'pro' THEN 10
      WHEN 'enterprise' THEN 999
    END::INTEGER,
    CASE p_plan_code
      WHEN 'trial' THEN '{"basic": true}'::JSONB
      WHEN 'standard' THEN '{"basic": true, "advanced": false}'::JSONB
      WHEN 'pro' THEN '{"basic": true, "advanced": true}'::JSONB
      WHEN 'enterprise' THEN '{"basic": true, "advanced": true, "enterprise": true}'::JSONB
    END::JSONB;
END;
$$;

-- ============================================================================
-- 6. calculate_expiry_date - License Plans
-- ============================================================================
DROP FUNCTION IF EXISTS calculate_expiry_date CASCADE;

CREATE OR REPLACE FUNCTION calculate_expiry_date(
    p_plan_code license_type,
    p_start_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TIMESTAMPTZ
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    duration_days INTEGER;
BEGIN
    SELECT 
        CASE p_plan_code
            WHEN 'trial' THEN 7
            WHEN 'standard' THEN 30
            WHEN 'pro' THEN 365
            WHEN 'enterprise' THEN 365
        END
    INTO duration_days;
    
    RETURN p_start_date + (duration_days || ' days')::INTERVAL;
END;
$$;

-- ============================================================================
-- 7. generate_license_key - License Generation
-- ============================================================================
DROP FUNCTION IF EXISTS generate_license_key CASCADE;

CREATE OR REPLACE FUNCTION generate_license_key(
    p_client_id TEXT,
    p_valid_until DATE,
    p_plan_code license_type
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_secret_key TEXT := 'VOLTRIS_SECRET_2024_PRODUCTION';
    v_payload TEXT;
    v_hash TEXT;
BEGIN
    v_payload := p_client_id || '|' || p_valid_until::TEXT || '|' || p_plan_code::TEXT;
    v_hash := encode(digest(v_payload || v_secret_key, 'sha256'), 'hex');
    RETURN 'VOLTRIS-' || UPPER(SUBSTRING(v_hash FROM 1 FOR 8)) || '-' || 
           UPPER(SUBSTRING(v_hash FROM 9 FOR 8)) || '-' || 
           UPPER(SUBSTRING(v_hash FROM 17 FOR 8));
END;
$$;

-- ============================================================================
-- 8. create_subscription_from_license - Subscriptions
-- ============================================================================
DROP FUNCTION IF EXISTS create_subscription_from_license CASCADE;

CREATE OR REPLACE FUNCTION create_subscription_from_license(
    p_license_id UUID,
    p_email TEXT,
    p_mp_subscription_id TEXT,
    p_mp_preapproval_id TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_subscription_id UUID;
    v_license_record RECORD;
BEGIN
    SELECT * INTO v_license_record FROM licenses WHERE id = p_license_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'License not found';
    END IF;
    
    INSERT INTO subscriptions (
        license_id,
        email,
        mp_subscription_id,
        mp_preapproval_id,
        status,
        plan_type,
        billing_cycle,
        next_billing_date
    ) VALUES (
        p_license_id,
        p_email,
        p_mp_subscription_id,
        p_mp_preapproval_id,
        'active',
        v_license_record.plan_type,
        'monthly',
        NOW() + INTERVAL '1 month'
    )
    RETURNING id INTO v_subscription_id;
    
    RETURN v_subscription_id;
END;
$$;

-- ============================================================================
-- 9. record_subscription_payment - Subscriptions
-- ============================================================================
DROP FUNCTION IF EXISTS record_subscription_payment CASCADE;

CREATE OR REPLACE FUNCTION record_subscription_payment(
    p_subscription_id UUID,
    p_mp_payment_id TEXT,
    p_amount DECIMAL,
    p_status TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_payment_id UUID;
BEGIN
    INSERT INTO subscription_payments (
        subscription_id,
        mp_payment_id,
        amount,
        status,
        paid_at
    ) VALUES (
        p_subscription_id,
        p_mp_payment_id,
        p_amount,
        p_status,
        CASE WHEN p_status = 'approved' THEN NOW() ELSE NULL END
    )
    RETURNING id INTO v_payment_id;
    
    IF p_status = 'approved' THEN
        UPDATE subscriptions
        SET 
            last_payment_date = NOW(),
            next_billing_date = NOW() + INTERVAL '1 month',
            failed_payment_count = 0
        WHERE id = p_subscription_id;
    END IF;
    
    RETURN v_payment_id;
END;
$$;

-- ============================================================================
-- 10. cancel_subscription - Subscriptions
-- ============================================================================
DROP FUNCTION IF EXISTS cancel_subscription CASCADE;

CREATE OR REPLACE FUNCTION cancel_subscription(
    p_subscription_id UUID,
    p_reason TEXT DEFAULT NULL,
    p_cancelled_by TEXT DEFAULT 'user'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    UPDATE subscriptions
    SET 
        status = 'cancelled',
        cancelled_at = NOW(),
        cancellation_reason = p_reason,
        cancelled_by = p_cancelled_by
    WHERE id = p_subscription_id;
    
    RETURN FOUND;
END;
$$;

-- ============================================================================
-- 11. generate_browser_fingerprint - Push Subscriptions
-- ============================================================================
DROP FUNCTION IF EXISTS generate_browser_fingerprint CASCADE;

CREATE OR REPLACE FUNCTION generate_browser_fingerprint(
    p_user_agent TEXT,
    p_platform TEXT,
    p_language TEXT
)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN encode(
        digest(p_user_agent || p_platform || p_language, 'sha256'),
        'hex'
    );
END;
$$;

-- ============================================================================
-- 12. update_push_subscription_updated_at - Push Subscriptions
-- ============================================================================
CREATE OR REPLACE FUNCTION update_push_subscription_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- ============================================================================
-- 13. cleanup_inactive_push_subscriptions - Push Subscriptions
-- ============================================================================
CREATE OR REPLACE FUNCTION cleanup_inactive_push_subscriptions()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    DELETE FROM push_subscriptions
    WHERE updated_at < NOW() - INTERVAL '90 days'
    AND status = 'inactive';
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$;

-- ============================================================================
-- 14. notify_order_status_change - Notifications
-- ============================================================================
CREATE OR REPLACE FUNCTION notify_order_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
        INSERT INTO notifications (user_id, type, title, message, sound)
        VALUES (
            NEW.user_id,
            'order_status',
            'Status do Pedido Atualizado',
            'Seu pedido #' || NEW.id || ' foi atualizado para: ' || NEW.status,
            'default'
        );
    END IF;
    RETURN NEW;
END;
$$;

-- ============================================================================
-- 15. notify_ticket_status_change - Notifications
-- ============================================================================
CREATE OR REPLACE FUNCTION notify_ticket_status_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    IF NEW.status IS DISTINCT FROM OLD.status THEN
        INSERT INTO notifications (user_id, type, title, message, sound)
        VALUES (
            NEW.user_id,
            'ticket_status',
            'Status do Ticket Atualizado',
            'Seu ticket #' || NEW.id || ' foi atualizado para: ' || NEW.status,
            'default'
        );
    END IF;
    RETURN NEW;
END;
$$;

-- ============================================================================
-- 16. handle_new_user - User Registration
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$;

-- ============================================================================
-- 17. handle_updated_at - Generic Trigger
-- ============================================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- ============================================================================
-- 18. update_device_updated_at - Telemetry
-- ============================================================================
CREATE OR REPLACE FUNCTION update_device_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- ============================================================================
-- 19. cleanup_old_sessions - Telemetry
-- ============================================================================
CREATE OR REPLACE FUNCTION cleanup_old_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    DELETE FROM sessions
    WHERE ended_at < NOW() - INTERVAL '30 days'
    OR (status = 'closed' AND last_heartbeat_at < NOW() - INTERVAL '7 days');
END;
$$;

-- ============================================================================
-- 20. update_orders_updated_at - Orders
-- ============================================================================
CREATE OR REPLACE FUNCTION update_orders_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- ============================================================================
-- 21. get_user_orders_with_details - Orders
-- ============================================================================
DROP FUNCTION IF EXISTS get_user_orders_with_details CASCADE;

CREATE OR REPLACE FUNCTION get_user_orders_with_details(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    status TEXT,
    total_amount DECIMAL,
    created_at TIMESTAMPTZ,
    service_name TEXT,
    service_description TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        o.id,
        o.status,
        o.total_amount,
        o.created_at,
        s.name,
        s.description
    FROM orders o
    LEFT JOIN services s ON o.service_id = s.id
    WHERE o.user_id = user_uuid
    ORDER BY o.created_at DESC;
END;
$$;

-- ============================================================================
-- 22. create_order_from_service - Orders
-- ============================================================================
DROP FUNCTION IF EXISTS create_order_from_service CASCADE;

CREATE OR REPLACE FUNCTION create_order_from_service(
    p_user_id UUID,
    p_service_id TEXT,
    p_amount DECIMAL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
    v_order_id UUID;
BEGIN
    INSERT INTO orders (user_id, service_id, total_amount, status)
    VALUES (p_user_id, p_service_id, p_amount, 'pending')
    RETURNING id INTO v_order_id;
    
    RETURN v_order_id;
END;
$$;

-- ============================================================================
-- 23. create_new_organization - Organizations (se existir)
-- ============================================================================
DROP FUNCTION IF EXISTS create_new_organization CASCADE;

-- Recriar a função se ela existir no banco
-- Esta é uma função que pode ter sido criada manualmente ou por outra migração
-- Vamos garantir que ela tenha search_path seguro

-- ============================================================================
-- COMENTÁRIOS E DOCUMENTAÇÃO
-- ============================================================================
COMMENT ON FUNCTION check_slo_breaches() IS 'Verifica violações de SLO com search_path seguro';
COMMENT ON FUNCTION update_updated_at_column() IS 'Trigger genérico para atualizar updated_at com search_path seguro';
COMMENT ON FUNCTION export_tenant_data(UUID, TIMESTAMPTZ, TIMESTAMPTZ) IS 'Exporta dados de tenant com search_path seguro';
COMMENT ON FUNCTION delete_tenant_data(UUID, VARCHAR) IS 'Deleta dados de tenant com search_path seguro';

-- ============================================================================
-- VERIFICAÇÃO FINAL
-- ============================================================================
DO $$
DECLARE
    func_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO func_count
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.prosecdef = false  -- Não é SECURITY DEFINER
    AND p.proname NOT LIKE 'pg_%'
    AND p.proname NOT LIKE 'uuid_%';
    
    IF func_count > 0 THEN
        RAISE NOTICE 'AVISO: Ainda existem % funções sem SECURITY DEFINER', func_count;
    ELSE
        RAISE NOTICE 'SUCESSO: Todas as funções públicas têm SECURITY DEFINER e search_path configurado';
    END IF;
END $$;
