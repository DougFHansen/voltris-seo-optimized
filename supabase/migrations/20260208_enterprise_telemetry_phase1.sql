-- ============================================================================
-- VOLTRIS ENTERPRISE TELEMETRY PLATFORM - DATABASE SCHEMA
-- Phase 1: Event Governance System
-- ============================================================================

-- ============================================================================
-- 1. EVENT REGISTRY - Central Source of Truth
-- ============================================================================

CREATE TABLE IF NOT EXISTS event_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identity
  event_name VARCHAR(255) UNIQUE NOT NULL,
  event_version VARCHAR(50) NOT NULL,
  schema_version VARCHAR(50) NOT NULL,
  
  -- Ownership
  owner_system VARCHAR(50) NOT NULL,
  module_name VARCHAR(255) NOT NULL,
  feature_name VARCHAR(255) NOT NULL,
  owner_team VARCHAR(255),
  
  -- Metadata
  description TEXT NOT NULL,
  criticality_level VARCHAR(50) NOT NULL,
  retention_days INTEGER DEFAULT 90,
  contains_pii BOOLEAN DEFAULT false,
  
  -- Lifecycle
  status VARCHAR(50) DEFAULT 'active',
  deprecation_date TIMESTAMPTZ,
  sunset_date TIMESTAMPTZ,
  replacement_event VARCHAR(255),
  
  -- Schema 
  payload_schema JSONB NOT NULL,
  example_payload JSONB,
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by VARCHAR(255),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by VARCHAR(255),
  
  CONSTRAINT valid_status CHECK (status IN ('active', 'deprecated', 'sunset')),
  CONSTRAINT valid_criticality CHECK (criticality_level IN ('low', 'medium', 'high', 'critical')),
  CONSTRAINT valid_owner CHECK (owner_system IN ('desktop_app', 'web_api', 'ai_service'))
);

CREATE INDEX idx_event_registry_name ON event_registry(event_name);
CREATE INDEX idx_event_registry_status ON event_registry(status);
CREATE INDEX idx_event_registry_feature ON event_registry(feature_name);
CREATE INDEX idx_event_registry_module ON event_registry(module_name);

-- ============================================================================
-- 2. REJECTED EVENTS - Schema Validation Audit Log
-- ============================================================================

CREATE TABLE IF NOT EXISTS rejected_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Event Data
  event_type VARCHAR(255) NOT NULL,
  raw_payload JSONB NOT NULL,
  
  -- Rejection Info
  rejection_reason VARCHAR(100) NOT NULL,
  validation_errors JSONB,
  suggested_fix TEXT,
  
  -- Context
  device_id UUID,
  session_id UUID,
  app_version VARCHAR(100),
  
  -- Audit
  rejected_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_rejection_reason CHECK (
    rejection_reason IN (
      'EVENT_NOT_REGISTERED',
      'SCHEMA_VALIDATION_FAILED',
      'EVENT_DEPRECATED',
      'EVENT_SUNSET',
      'RATE_LIMIT_EXCEEDED',
      'PAYLOAD_CORRUPTED'
    )
  )
);

CREATE INDEX idx_rejected_events_type ON rejected_events(event_type);
CREATE INDEX idx_rejected_events_reason ON rejected_events(rejection_reason);
CREATE INDEX idx_rejected_events_time ON rejected_events(rejected_at DESC);

-- ============================================================================
-- 3. TELEMETRY HEALTH METRICS - Self-Monitoring
-- ============================================================================

CREATE TABLE IF NOT EXISTS telemetry_health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_timestamp TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ingestion Metrics
  events_received INTEGER DEFAULT 0,
  events_validated INTEGER DEFAULT 0,
  events_rejected INTEGER DEFAULT 0,
  events_stored INTEGER DEFAULT 0,
  
  rejection_reasons JSONB,
  
  -- Performance Metrics
  avg_ingestion_latency_ms INTEGER,
  p95_ingestion_latency_ms INTEGER,
  p99_ingestion_latency_ms INTEGER,
  
  -- Queue Metrics
  queue_depth INTEGER DEFAULT 0,
  queue_overflow_count INTEGER DEFAULT 0,
  
  -- Data Quality
  schema_drift_detected BOOLEAN DEFAULT false,
  payload_corruption_count INTEGER DEFAULT 0,
  
  -- System Health
  gateway_status VARCHAR(50) DEFAULT 'healthy',
  database_status VARCHAR(50) DEFAULT 'healthy',
  
  CONSTRAINT valid_gateway_status CHECK (gateway_status IN ('healthy', 'degraded', 'down')),
  CONSTRAINT valid_db_status CHECK (database_status IN ('healthy', 'degraded', 'down'))
);

CREATE INDEX idx_telemetry_health_time ON telemetry_health_metrics(metric_timestamp DESC);

-- ============================================================================
-- 4. SEED DATA - Registrar eventos existentes
-- ============================================================================

-- APP_START
INSERT INTO event_registry (
  event_name,
  event_version,
  schema_version,
  owner_system,
  module_name,
  feature_name,
  description,
  criticality_level,
  retention_days,
  contains_pii,
  payload_schema,
  example_payload,
  status
) VALUES (
  'APP_START',
  '1.0.0',
  '1.0.0',
  'desktop_app',
  'System',
  'Application Lifecycle',
  'Fired when the application starts',
  'high',
  365,
  false,
  '{
    "type": "object",
    "properties": {
      "event_type": { "type": "string", "const": "APP_START" },
      "feature_name": { "type": "string" },
      "action_name": { "type": "string" },
      "success": { "type": "boolean" },
      "timestamp": { "type": "string", "format": "date-time" }
    },
    "required": ["event_type", "feature_name", "action_name", "timestamp"]
  }'::jsonb,
  '{
    "event_type": "APP_START",
    "feature_name": "System",
    "action_name": "Initialize",
    "success": true,
    "timestamp": "2024-02-08T12:00:00Z"
  }'::jsonb,
  'active'
) ON CONFLICT (event_name) DO NOTHING;

-- PAGE_VIEW
INSERT INTO event_registry (
  event_name,
  event_version,
  schema_version,
  owner_system,
  module_name,
  feature_name,
  description,
  criticality_level,
  retention_days,
  contains_pii,
  payload_schema,
  example_payload,
  status
) VALUES (
  'PAGE_VIEW',
  '1.0.0',
  '1.0.0',
  'desktop_app',
  'NavigationService',
  'Navigation',
  'User navigates to a different page/view',
  'medium',
  90,
  false,
  '{
    "type": "object",
    "properties": {
      "event_type": { "type": "string", "const": "PAGE_VIEW" },
      "feature_name": { "type": "string" },
      "action_name": { "type": "string" },
      "metadata": {
        "type": "object",
        "properties": {
          "page_name": { "type": "string" }
        }
      }
    },
    "required": ["event_type", "feature_name", "action_name"]
  }'::jsonb,
  '{
    "event_type": "PAGE_VIEW",
    "feature_name": "Navigation",
    "action_name": "Dashboard",
    "metadata": { "page_name": "Dashboard" }
  }'::jsonb,
  'active'
) ON CONFLICT (event_name) DO NOTHING;

-- CLEANUP_EXECUTED
INSERT INTO event_registry (
  event_name,
  event_version,
  schema_version,
  owner_system,
  module_name,
  feature_name,
  description,
  criticality_level,
  retention_days,
  contains_pii,
  payload_schema,
  example_payload,
  status
) VALUES (
  'CLEANUP_EXECUTED',
  '1.0.0',
  '1.0.0',
  'desktop_app',
  'CleanupService',
  'System Cleanup',
  'System cleanup operation was executed',
  'high',
  180,
  false,
  '{
    "type": "object",
    "properties": {
      "event_type": { "type": "string", "const": "CLEANUP_EXECUTED" },
      "feature_name": { "type": "string" },
      "action_name": { "type": "string" },
      "duration_ms": { "type": "integer", "minimum": 0 },
      "success": { "type": "boolean" },
      "metadata": {
        "type": "object",
        "properties": {
          "files_deleted": { "type": "integer" },
          "space_freed_mb": { "type": "number" }
        }
      }
    },
    "required": ["event_type", "feature_name", "action_name", "duration_ms", "success"]
  }'::jsonb,
  '{
    "event_type": "CLEANUP_EXECUTED",
    "feature_name": "Cleanup",
    "action_name": "QuickClean",
    "duration_ms": 5432,
    "success": true,
    "metadata": {
      "files_deleted": 250,
      "space_freed_mb": 512.5
    }
  }'::jsonb,
  'active'
) ON CONFLICT (event_name) DO NOTHING;

-- LICENSE_ACTIVATE
INSERT INTO event_registry (
  event_name,
  event_version,
  schema_version,
  owner_system,
  module_name,
  feature_name,
  description,
  criticality_level,
  retention_days,
  contains_pii,
  payload_schema,
  example_payload,
  status
) VALUES (
  'LICENSE_ACTIVATE',
  '1.0.0',
  '1.0.0',
  'desktop_app',
  'LicenseManager',
  'License Management',
  'User activates a license',
  'critical',
  730,
  false,
  '{
    "type": "object",
    "properties": {
      "event_type": { "type": "string", "const": "LICENSE_ACTIVATE" },
      "feature_name": { "type": "string" },
      "action_name": { "type": "string" },
      "success": { "type": "boolean" },
      "metadata": {
        "type": "object",
        "properties": {
          "license_type": { "type": "string", "enum": ["trial", "standard", "pro", "enterprise"] }
        }
      }
    },
    "required": ["event_type", "feature_name", "action_name", "success"]
  }'::jsonb,
  '{
    "event_type": "LICENSE_ACTIVATE",
    "feature_name": "License",
    "action_name": "pro",
    "success": true,
    "metadata": { "license_type": "pro" }
  }'::jsonb,
  'active'
) ON CONFLICT (event_name) DO NOTHING;

-- ============================================================================
-- 5. ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE event_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE rejected_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_health_metrics ENABLE ROW LEVEL SECURITY;

-- Admin can do everything
CREATE POLICY "Admins have full access to event_registry"
  ON event_registry
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to rejected_events"
  ON rejected_events
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins have full access to telemetry_health_metrics"
  ON telemetry_health_metrics
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin')
  WITH CHECK (auth.jwt() ->> 'role' = 'admin');

-- Service can read event registry (for validation)
CREATE POLICY "Service can read event_registry"
  ON event_registry
  FOR SELECT
  TO service_role
  USING (true);

-- Service can insert rejected events
CREATE POLICY "Service can insert rejected_events"
  ON rejected_events
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Service can insert health metrics
CREATE POLICY "Service can insert telemetry_health_metrics"
  ON telemetry_health_metrics
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ============================================================================
-- 6. FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for event_registry
DROP TRIGGER IF EXISTS update_event_registry_updated_at ON event_registry;
CREATE TRIGGER update_event_registry_updated_at
  BEFORE UPDATE ON event_registry
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

COMMENT ON TABLE event_registry IS 'Central registry of all telemetry events with schema definitions';
COMMENT ON TABLE rejected_events IS 'Audit log of events that failed validation';
COMMENT ON TABLE telemetry_health_metrics IS 'Self-monitoring metrics for telemetry system health';
