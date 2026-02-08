-- ============================================================================
-- TENANT ISOLATION - Row Level Security Policies
-- Multi-tenant data isolation for enterprise customers
-- ============================================================================

-- Add company_id to all tenant-scoped tables
ALTER TABLE telemetry_events ADD COLUMN IF NOT EXISTS company_id UUID;
ALTER TABLE devices ADD COLUMN IF NOT EXISTS company_id UUID;
ALTER TABLE feature_usage_intelligence ADD COLUMN IF NOT EXISTS company_id UUID;
ALTER TABLE feature_cost_tracking ADD COLUMN IF NOT EXISTS company_id UUID;

-- Create companies table
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  tier VARCHAR(50) DEFAULT 'FREE', -- FREE, PRO, ENTERPRISE
  encryption_key_hash VARCHAR(255), -- Per-tenant encryption
  created_at TIMESTAMPTZ DEFAULT NOW(),
  settings JSONB DEFAULT '{}'::jsonb
);

-- Create user-company mapping
CREATE TABLE IF NOT EXISTS user_companies (
  user_id UUID REFERENCES auth.users(id),
  company_id UUID REFERENCES companies(id),
  role VARCHAR(50) DEFAULT 'member', --  member, admin, owner
  PRIMARY KEY (user_id, company_id)
);

-- ============================================================================
-- RLS POLICIES - DEVICES
-- Users can only see devices from their company
-- ============================================================================

ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own company devices" ON devices;
CREATE POLICY "Users see own company devices"
  ON devices
  FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id 
      FROM user_companies 
      WHERE user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Users insert own company devices" ON devices;
CREATE POLICY "Users insert own company devices"
  ON devices
  FOR INSERT
  TO authenticated
  WITH CHECK (
    company_id IN (
      SELECT company_id 
      FROM user_companies 
      WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- RLS POLICIES - TELEMETRY EVENTS
-- Users can only see events from their company's devices
-- ============================================================================

ALTER TABLE telemetry_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own company events" ON telemetry_events;
CREATE POLICY "Users see own company events"
  ON telemetry_events
  FOR SELECT
  TO authenticated
  USING (
    device_id IN (
      SELECT id FROM devices WHERE company_id IN (
        SELECT company_id FROM user_companies WHERE user_id = auth.uid()
      )
    )
  );

-- ============================================================================
-- RLS POLICIES - PRODUCT INTELLIGENCE
-- Company-scoped analytics
-- ============================================================================

ALTER TABLE feature_usage_intelligence ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own company intelligence" ON feature_usage_intelligence;
CREATE POLICY "Users see own company intelligence"
  ON feature_usage_intelligence
  FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id 
      FROM user_companies 
      WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- RLS POLICIES - COST TRACKING
-- Company-scoped cost data
-- ============================================================================

ALTER TABLE feature_cost_tracking ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users see own company costs" ON feature_cost_tracking;
CREATE POLICY "Users see own company costs"
  ON feature_cost_tracking
  FOR SELECT
  TO authenticated
  USING (
    company_id IN (
      SELECT company_id 
      FROM user_companies 
      WHERE user_id = auth.uid()
    )
  );

-- ============================================================================
-- ADMIN OVERRIDE POLICIES
-- Super admins can see all data
-- ============================================================================

DROP POLICY IF EXISTS "Superadmins see all events" ON telemetry_events;
CREATE POLICY "Superadmins see all events"
  ON telemetry_events
  FOR SELECT
  TO authenticated
  USING (
    (auth.jwt()->>'role') = 'super_admin'
  );

-- ============================================================================
-- PER-TENANT DATA EXPORT
-- ============================================================================

CREATE OR REPLACE FUNCTION export_tenant_data(
  target_company_id UUID,
  start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
  end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  -- Check user has access to this company
  IF NOT EXISTS (
    SELECT 1 FROM user_companies 
    WHERE user_id = auth.uid() 
    AND company_id = target_company_id
  ) THEN
    RAISE EXCEPTION 'Access denied to company data';
  END IF;
  
  -- Export all tenant data
  SELECT jsonb_build_object(
    'company', (SELECT row_to_json(c) FROM companies c WHERE id = target_company_id),
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
    ),
    'intelligence', (
      SELECT jsonb_agg(row_to_json(i))
      FROM feature_usage_intelligence i
      WHERE company_id = target_company_id
    )
  ) INTO result;
  
  -- Log export for audit
  INSERT INTO telemetry_access_audit (
    access_type,
    resource_type,
    resource_id,
    user_id,
    company_id,
    ip_address
  ) VALUES (
    'DATA_EXPORT',
    'COMPANY',
    target_company_id,
    auth.uid(),
    target_company_id,
    inet_client_addr()
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- PER-TENANT DATA DELETION (LGPD/GDPR)
-- ============================================================================

CREATE OR REPLACE FUNCTION delete_tenant_data(
  target_company_id UUID,
  confirmation_token VARCHAR(255)
)
RETURNS JSONB AS $$
DECLARE
  deleted_counts JSONB;
BEGIN
  -- Check user is company owner
  IF NOT EXISTS (
    SELECT 1 FROM user_companies 
    WHERE user_id = auth.uid() 
    AND company_id = target_company_id
    AND role = 'owner'
  ) THEN
    RAISE EXCEPTION 'Only company owners can delete company data';
  END IF;
  
  -- Verify confirmation token
  IF confirmation_token != MD5(target_company_id::TEXT || 'DELETE') THEN
    RAISE EXCEPTION 'Invalid confirmation token';
  END IF;
  
  -- Delete all company data (cascade)
  WITH 
    deleted_events AS (
      DELETE FROM telemetry_events 
      WHERE device_id IN (SELECT id FROM devices WHERE company_id = target_company_id)
      RETURNING 1
    ),
    deleted_devices AS (
      DELETE FROM devices WHERE company_id = target_company_id
      RETURNING 1
    ),
    deleted_intelligence AS (
      DELETE FROM feature_usage_intelligence WHERE company_id = target_company_id
      RETURNING 1
    ),
    deleted_costs AS (
      DELETE FROM feature_cost_tracking WHERE company_id = target_company_id
      RETURNING 1
    )
  SELECT jsonb_build_object(
    'events_deleted', (SELECT COUNT(*) FROM deleted_events),
    'devices_deleted', (SELECT COUNT(*) FROM deleted_devices),
    'intelligence_deleted', (SELECT COUNT(*) FROM deleted_intelligence),
    'costs_deleted', (SELECT COUNT(*) FROM deleted_costs)
  ) INTO deleted_counts;
  
  -- Log deletion for compliance
  INSERT INTO telemetry_access_audit (
    access_type,
    resource_type,
    resource_id,
    user_id,
    company_id,
    metadata
  ) VALUES (
    'DATA_DELETION',
    'COMPANY',
    target_company_id,
    auth.uid(),
    target_company_id,
    deleted_counts
  );
  
  RETURN deleted_counts;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- USAGE EXAMPLES:
-- ============================================================================

-- Export tenant data:
-- SELECT export_tenant_data('company-uuid', '2026-01-01', '2026-02-08');

-- Delete tenant data (requires confirmation):
-- SELECT delete_tenant_data('company-uuid', MD5('company-uuid' || 'DELETE'));

-- Check user's company access:
-- SELECT * FROM user_companies WHERE user_id = auth.uid();
-- ============================================================================
