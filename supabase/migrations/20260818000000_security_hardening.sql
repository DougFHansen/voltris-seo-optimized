-- ============================================================================
-- HARDENING DE SEGURANÇA (resultado da auditoria)
-- Data: 18/08/2026
-- Objetivo: corrigir vazamentos RLS, IDOR e funções expostas SEM quebrar
--   (a) o fluxo de compra de licença (webhook Stripe usa service_role),
--   (b) o sistema de licença (desktop usa os endpoints da API, que usam service_role),
--   (c) o sistema de comandos remotos (desktop usa os endpoints da API).
-- ============================================================================

-- ============================================================================
-- 1. INSTALLATIONS — remover políticas anon permissivas
--    O desktop registra/atualiza instalações pelos ENDPOINTS da API
--    (/api/v1/install/*), que usam service_role e ignoram RLS.
--    As políticas anon "insert/update" permitiam criar/alterar qualquer
--    instalação direto pela Supabase client (anon key) sem passar pela API.
-- ============================================================================
DROP POLICY IF EXISTS "Allow anon to insert installations" ON installations;
DROP POLICY IF EXISTS "Allow anon to update installations" ON installations;
DROP POLICY IF EXISTS "Allow anon read for installations" ON installations;

-- Reafirmar políticas seguras (idempotente)
DROP POLICY IF EXISTS "Allow authenticated users to read their installations" ON installations;
CREATE POLICY "Allow authenticated users to read their installations"
ON installations
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all installations" ON installations;
CREATE POLICY "Admins can view all installations"
ON installations
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

DROP POLICY IF EXISTS "Service role can manage everything" ON installations;
CREATE POLICY "Service role can manage everything"
ON installations
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================================
-- 2. PAYMENTS — remover políticas anon/authenticated permissivas
--    Inserção/atualização de pagamentos acontece via service_role:
--      - /api/stripe/checkout   -> createAdminClient (service_role)
--      - /api/webhook/stripe    -> createAdminClient (service_role)
--      - /api/stripe/refund     -> supabaseAdmin (service_role)
--    A política "Allow payment lookup ... USING (true)" permitia a QUALQUER
--    pessoa ler todos os pagamentos (email, valores, status).
-- ============================================================================
DROP POLICY IF EXISTS "Allow payment creation without auth" ON payments;
DROP POLICY IF EXISTS "Allow payment updates without auth" ON payments;
DROP POLICY IF EXISTS "Allow payment lookup by preference or payment id" ON payments;
DROP POLICY IF EXISTS "Users can view their own payments" ON payments;

-- Usuários autenticados veem apenas os próprios pagamentos
CREATE POLICY "Users can view their own payments"
ON payments
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Service role gerencia tudo
DROP POLICY IF EXISTS "Service role can manage all payments" ON payments;
CREATE POLICY "Service role can manage all payments"
ON payments
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================================
-- 3. LICENSES — remover políticas permissivas
--    Licenças são criadas/atualizadas pelo webhook via service_role
--    (RPC generate_complete_license_v3) e pelos endpoints da API.
--    "Allow license creation/updates without auth" permitia criar/altera
--    qualquer licença pela client anon/authenticated.
-- ============================================================================
DROP POLICY IF EXISTS "Allow license creation without auth" ON licenses;
DROP POLICY IF EXISTS "Allow license updates without auth" ON licenses;
DROP POLICY IF EXISTS "Users can view their own licenses" ON licenses;

-- Usuários autenticados veem apenas as próprias licenças
CREATE POLICY "Users can view their own licenses"
ON licenses
FOR SELECT
TO authenticated
USING (
  auth.uid() = user_id
  OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
);

-- Service role gerencia tudo
DROP POLICY IF EXISTS "Service role can manage all licenses" ON licenses;
CREATE POLICY "Service role can manage all licenses"
ON licenses
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================================
-- 4. LICENSE_DEVICES — remover políticas permissivas
--    Ativação/desativação de dispositivos acontece pelos endpoints da API
--    (/api/v1/license/activate, /deactivate), que usam service_role.
-- ============================================================================
DROP POLICY IF EXISTS "Allow device activation without auth" ON license_devices;
DROP POLICY IF EXISTS "Allow device updates without auth" ON license_devices;
DROP POLICY IF EXISTS "Users can view devices of their licenses" ON license_devices;

-- Usuários autenticados veem dispositivos das próprias licenças
CREATE POLICY "Users can view devices of their licenses"
ON license_devices
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM licenses
    WHERE licenses.id = license_devices.license_id
    AND (
      licenses.user_id = auth.uid()
      OR licenses.email = (SELECT email FROM auth.users WHERE id = auth.uid())
    )
  )
);

-- Service role gerencia tudo
DROP POLICY IF EXISTS "Service role can manage all devices" ON license_devices;
CREATE POLICY "Service role can manage all devices"
ON license_devices
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================================
-- 5. ORDERS — substituir "Debug realtime select" (USING true) por políticas
--    corretas. A política antiga permitia a qualquer anon/authenticated ler
--    TODOS os pedidos (nome, email, telefone, endereço dos clientes).
--    O painel admin lê pedidos pelo browser usando o client autenticado,
--    então precisamos de uma política de SELECT para admins.
-- ============================================================================
DROP POLICY IF EXISTS "Debug realtime select" ON orders;

DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
CREATE POLICY "Users can view their own orders"
ON orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own orders" ON orders;
CREATE POLICY "Users can insert their own orders"
ON orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own orders" ON orders;
CREATE POLICY "Users can update their own orders"
ON orders
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

-- Admins veem todos os pedidos (usado pelo painel restricted-area-admin)
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders"
ON orders
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Admins atualizam pedidos (status) pelo painel restricted-area-admin
DROP POLICY IF EXISTS "Admins can update all orders" ON orders;
CREATE POLICY "Admins can update all orders"
ON orders
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  )
);

-- Service role gerencia tudo (endpoints da API)
DROP POLICY IF EXISTS "Service role can manage all orders" ON orders;
CREATE POLICY "Service role can manage all orders"
ON orders
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================================
-- 6. SERVICES — "Services can be managed by authenticated users" permitia
--    que QUALQUER usuário autenticado criasse/alterasse/excluísse serviços
--    (preços, descrições do catálogo). Nenhuma página web faz isso:
--    o site apenas LÊ os serviços (NewOrderClient).
-- ============================================================================
DROP POLICY IF EXISTS "Services can be managed by authenticated users" ON services;

DROP POLICY IF EXISTS "Services are viewable by everyone" ON services;
CREATE POLICY "Services are viewable by everyone"
ON services
FOR SELECT
TO anon, authenticated
USING (true);

-- Service role gerencia o catálogo
DROP POLICY IF EXISTS "Service role can manage all services" ON services;
CREATE POLICY "Service role can manage all services"
ON services
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================================================
-- 7. get_user_orders_with_details — SECURITY DEFINER sem verificação de dono.
--    Qualquer usuário autenticado podia chamar a função passando o UUID de
--    outro usuário e ler TODOS os pedidos dele. Recriar exigindo auth.uid().
-- ============================================================================
DROP FUNCTION IF EXISTS get_user_orders_with_details(UUID) CASCADE;

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
    -- SEGURANÇA: só permite consultar os pedidos do próprio usuário autenticado
    IF user_uuid IS DISTINCT FROM auth.uid() THEN
        RAISE EXCEPTION 'Acesso negado';
    END IF;

    RETURN QUERY
    SELECT
        o.id,
        o.status,
        o.total_amount,
        o.created_at,
        s.name,
        s.description
    FROM orders o
    LEFT JOIN services s ON o.service_id = s.id::TEXT
    WHERE o.user_id = auth.uid()
    ORDER BY o.created_at DESC;
END;
$$;

REVOKE EXECUTE ON FUNCTION get_user_orders_with_details(UUID) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION get_user_orders_with_details(UUID) TO authenticated;

-- ============================================================================
-- 8. export_tenant_data / delete_tenant_data — SECURITY DEFINER sem check
--    de admin. Recriar exigindo sessão de administrador e revogar acesso
--    público/anon/authenticated (apenas service_role poderá invocar).
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
  v_is_admin BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  ) INTO v_is_admin;

  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Somente administradores podem exportar dados de tenant';
  END IF;

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
  v_is_admin BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  ) INTO v_is_admin;

  IF NOT v_is_admin THEN
    RAISE EXCEPTION 'Somente administradores podem excluir dados de tenant';
  END IF;

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

REVOKE EXECUTE ON FUNCTION export_tenant_data(UUID, TIMESTAMPTZ, TIMESTAMPTZ) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION delete_tenant_data(UUID, VARCHAR) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION export_tenant_data(UUID, TIMESTAMPTZ, TIMESTAMPTZ) TO service_role;
GRANT EXECUTE ON FUNCTION delete_tenant_data(UUID, VARCHAR) TO service_role;

-- ============================================================================
-- 9. Funções de GERAÇÃO DE LICENÇA — segredo hardcoded + EXECUTE público.
--    generate_voltris_signature usa o segredo 'VOLTRIS_SECRET_LICENSE_KEY_2025'
--    hardcoded e era executável por qualquer pessoa, permitindo forjar chaves.
--    CORREÇÃO SEM QUEBRAR: o valor do segredo NÃO é trocado (licenças existentes
--    e o app C# dependem dele). Passamos a ler de current_setting com o mesmo
--    valor como fallback, e REVOGAMOS o EXECUTE para public/anon/authenticated.
-- ============================================================================
CREATE OR REPLACE FUNCTION public.generate_voltris_signature(p_content TEXT)
RETURNS TEXT AS $$
DECLARE
    v_secret TEXT := COALESCE(
        current_setting('app.license_secret', true),
        'VOLTRIS_SECRET_LICENSE_KEY_2025'
    );
    v_hash TEXT;
BEGIN
    v_hash := upper(encode(digest(p_content || v_secret, 'sha256'), 'hex'));
    RETURN substring(v_hash from 1 for 16);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

REVOKE EXECUTE ON FUNCTION public.generate_voltris_signature(TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.generate_voltris_signature(TEXT) TO service_role;

-- generate_complete_license_v3 (chamada pelo webhook via service_role)
REVOKE EXECUTE ON FUNCTION public.generate_complete_license_v3(UUID, UUID, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_complete_license_v3(UUID, UUID, TEXT, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.generate_complete_license_v3(UUID, UUID, TEXT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION public.generate_complete_license_v3(UUID, UUID, TEXT, TEXT, TEXT) TO service_role;

-- generate_license_key (usado internamente) — manter apenas service_role
REVOKE EXECUTE ON FUNCTION generate_license_key(TEXT, DATE, TEXT) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION generate_license_key(TEXT, DATE, TEXT) TO service_role;

-- ============================================================================
-- 10. PROFILES — trigger para impedir que usuários promovam a si mesmos.
--     A política "Usuários podem atualizar seus próprios perfis" permite ao
--     próprio usuário alterar is_admin/is_blocked/is_deleted. Este trigger
--     bloqueia essas mudanças quando o JWT não é service_role.
-- ============================================================================
CREATE OR REPLACE FUNCTION prevent_sensitive_profile_update()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- service_role (endpoints admin/API) pode alterar qualquer coluna
    IF current_setting('request.jwt.claims', true)::jsonb ->> 'role' = 'service_role' THEN
        RETURN NEW;
    END IF;

    -- Usuário comum não pode alterar colunas sensíveis nem o is_admin
    IF NEW.is_admin IS DISTINCT FROM OLD.is_admin
       OR NEW.is_blocked IS DISTINCT FROM OLD.is_blocked
       OR NEW.is_deleted IS DISTINCT FROM OLD.is_deleted THEN
        RAISE EXCEPTION 'Não é permitido alterar colunas sensíveis do perfil';
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_sensitive_profile_update_trigger ON public.profiles;
CREATE TRIGGER prevent_sensitive_profile_update_trigger
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION prevent_sensitive_profile_update();