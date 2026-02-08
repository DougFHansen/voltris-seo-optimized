-- ============================================================================
-- VOLTRIS ENTERPRISE TELEMETRY PLATFORM - DATABASE SCHEMA
-- Phase 2-7: Product Intelligence, Cost Intelligence, Privacy, Monitoring, Deploy
-- ============================================================================

-- ============================================================================
-- PHASE 2: PRODUCT INTELLIGENCE
-- ============================================================================

-- Feature Usage Intelligence
CREATE TABLE IF NOT EXISTS feature_usage_intelligence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_name VARCHAR(255) NOT NULL,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  
  -- User Metrics
  total_users INTEGER DEFAULT 0,
  active_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  retained_users INTEGER DEFAULT 0,
  
  -- Event Metrics
  total_events INTEGER DEFAULT 0,
  success_rate DECIMAL(5,2),
  avg_duration_ms INTEGER,
  
  -- Segmentation
  user_segments JSONB,           -- { "free": 100, "pro": 50, "enterprise": 10 }
  hardware_segments JSONB,       -- { "high_end": 80, "mid_range": 60, "low_end": 20 }
  
  -- UX Metrics
  abandonment_rate DECIMAL(5,2),
  friction_score DECIMAL(5,2),   -- 0-100 score
  
  -- AI Insights
  insights JSONB,                 -- AI-generated insights
  recommendations JSONB,          -- AI recommendations
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(feature_name, period_start, period_end)
);

CREATE INDEX idx_feature_usage_feature ON feature_usage_intelligence(feature_name);
CREATE INDEX idx_feature_usage_period ON feature_usage_intelligence(period_start, period_end);

-- UX Friction Detection
CREATE TABLE IF NOT EXISTS ux_friction_points (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_name VARCHAR(255) NOT NULL,
  action_sequence TEXT[],
  
  friction_type VARCHAR(100),    -- 'high_error_rate', 'slow_performance', 'abandonment', 'retry_loop'
  severity VARCHAR(50),          -- 'low', 'medium', 'high', 'critical'
  
  affected_users INTEGER,
  occurrence_count INTEGER,
  avg_impact_score DECIMAL(5,2),
  
  -- Context
  common_metadata JSONB,         -- Common metadata in failed attempts
  user_segments JSONB,           -- Which user segments affected
  
  detected_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  resolution_notes TEXT,
  
  CONSTRAINT valid_friction_type CHECK (
    friction_type IN ('high_error_rate', 'slow_performance', 'abandonment', 'retry_loop', 'confusion_pattern')
  ),
  CONSTRAINT valid_severity CHECK (severity IN ('low', 'medium', 'high', 'critical'))
);

CREATE INDEX idx_friction_feature ON ux_friction_points(feature_name);
CREATE INDEX idx_friction_severity ON ux_friction_points(severity);
CREATE INDEX idx_friction_detected ON ux_friction_points(detected_at DESC);

-- Bug Pattern Detection
CREATE TABLE IF NOT EXISTS detected_bug_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pattern_signature VARCHAR(500) UNIQUE,
  
  feature_name VARCHAR(255),
  error_type VARCHAR(255),
  error_frequency INTEGER,
  
  affected_versions TEXT[],
  affected_devices INTEGER,
  first_seen TIMESTAMPTZ,
  last_seen TIMESTAMPTZ,
  
  -- Deploy Correlation
  correlation_with_deploy BOOLEAN,
  deploy_version VARCHAR(100),
  
  status VARCHAR(50) DEFAULT 'open',
  assigned_to VARCHAR(255),
  priority VARCHAR(50) DEFAULT 'medium',
  
  -- AI Analysis
  ai_analysis JSONB,
  suggested_fix TEXT,
  
  CONSTRAINT valid_status CHECK (status IN ('open', 'investigating', 'fixed', 'wont_fix', 'duplicate')),
  CONSTRAINT valid_priority CHECK (priority IN ('low', 'medium', 'high', 'critical'))
);

CREATE INDEX idx_bug_pattern_sig ON detected_bug_patterns(pattern_signature);
CREATE INDEX idx_bug_pattern_status ON detected_bug_patterns(status);
CREATE INDEX idx_bug_pattern_priority ON detected_bug_patterns(priority);

-- User Journey Reconstruction
CREATE TABLE IF NOT EXISTS user_journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES sessions(id),
  device_id UUID NOT NULL REFERENCES devices(id),
  
  journey_start TIMESTAMPTZ NOT NULL,
  journey_end TIMESTAMPTZ,
  duration_seconds INTEGER,
  
  -- Path
  event_sequence JSONB,          -- Array of events in order
  page_sequence TEXT[],          -- Pages visited
  feature_sequence TEXT[],       -- Features used
  
  -- Outcome
  completed BOOLEAN,
  completion_type VARCHAR(100),  -- 'task_completed', 'abandoned', 'error', 'timeout'
  
  -- Metrics
  total_events INTEGER,
  error_count INTEGER,
  success_rate DECIMAL(5,2),
  
  -- AI Classification
  journey_type VARCHAR(100),     -- 'onboarding', 'cleanup', 'optimization', 'troubleshooting'
  friction_detected BOOLEAN,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_journey_session ON user_journeys(session_id);
CREATE INDEX idx_journey_device ON user_journeys(device_id);
CREATE INDEX idx_journey_type ON user_journeys(journey_type);
CREATE INDEX idx_journey_start ON user_journeys(journey_start DESC);

-- ============================================================================
-- PHASE 3: COST INTELLIGENCE
-- ============================================================================

-- Feature Cost Tracking
CREATE TABLE IF NOT EXISTS feature_cost_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feature_name VARCHAR(255) NOT NULL,
  period_start TIMESTAMPTZ NOT NULL,
  period_end TIMESTAMPTZ NOT NULL,
  
  -- Infrastructure Costs
  compute_cost_usd DECIMAL(10,2) DEFAULT 0,
  storage_cost_usd DECIMAL(10,2) DEFAULT 0,
  bandwidth_cost_usd DECIMAL(10,2) DEFAULT 0,
  
  -- AI Costs
  ai_api_cost_usd DECIMAL(10,2) DEFAULT 0,
  ai_requests_count INTEGER DEFAULT 0,
  ai_tokens_used BIGINT DEFAULT 0,
  
  -- Total Cost
  total_cost_usd DECIMAL(10,2) GENERATED ALWAYS AS (
    compute_cost_usd + storage_cost_usd + bandwidth_cost_usd + ai_api_cost_usd
  ) STORED,
  
  -- Usage Metrics
  total_users INTEGER DEFAULT 0,
  total_events INTEGER DEFAULT 0,
  
  -- Business Metrics
  revenue_generated_usd DECIMAL(10,2) DEFAULT 0,
  margin_usd DECIMAL(10,2) GENERATED ALWAYS AS (
    revenue_generated_usd - (compute_cost_usd + storage_cost_usd + bandwidth_cost_usd + ai_api_cost_usd)
  ) STORED,
  roi_percentage DECIMAL(5,2),
  
  -- Cost per Unit
  cost_per_user DECIMAL(10,4),
  cost_per_event DECIMAL(10,6),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(feature_name, period_start, period_end)
);

CREATE INDEX idx_feature_cost_feature ON feature_cost_tracking(feature_name);
CREATE INDEX idx_feature_cost_period ON feature_cost_tracking(period_start, period_end);

-- Client Cost Analysis
CREATE TABLE IF NOT EXISTS client_cost_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES companies(id),
  device_id UUID REFERENCES devices(id),
  period_month DATE NOT NULL,
  
  total_cost_usd DECIMAL(10,2) DEFAULT 0,
  revenue_usd DECIMAL(10,2) DEFAULT 0,
  margin_usd DECIMAL(10,2),
  
  -- Breakdown
  feature_breakdown JSONB,       -- { "cleanup": 5.00, "optimizer": 3.00 }
  usage_breakdown JSONB,         -- { "cleanup": 100, "optimizer": 50 }
  
  -- Metrics
  profitability_score DECIMAL(5,2),
  churn_risk_score DECIMAL(5,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(device_id, period_month)
);

CREATE INDEX idx_client_cost_device ON client_cost_analysis(device_id);
CREATE INDEX idx_client_cost_company ON client_cost_analysis(company_id);
CREATE INDEX idx_client_cost_period ON client_cost_analysis(period_month DESC);

-- ============================================================================
-- PHASE 4: PRIVACY + COMPLIANCE
-- ============================================================================

-- Data Retention Policies
CREATE TABLE IF NOT EXISTS data_retention_policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type VARCHAR(255) NOT NULL UNIQUE,
  retention_days INTEGER NOT NULL,
  auto_delete BOOLEAN DEFAULT true,
  
  last_cleanup_at TIMESTAMPTZ,
  next_cleanup_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User Deletion Requests (LGPD/GDPR)
CREATE TABLE IF NOT EXISTS user_deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  device_id UUID REFERENCES devices(id),
  company_id UUID REFERENCES companies(id),
  
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  requested_by VARCHAR(255),
  
  deletion_scope JSONB,          -- { "events": true, "profile": true, "sessions": true }
  
  status VARCHAR(50) DEFAULT 'pending',
  processed_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  
  deleted_records JSONB,         -- Count of deleted records by type
  
  CONSTRAINT valid_deletion_status CHECK (
    status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')
  )
);

CREATE INDEX idx_deletion_device ON user_deletion_requests(device_id);
CREATE INDEX idx_deletion_status ON user_deletion_requests(status);
CREATE INDEX idx_deletion_requested ON user_deletion_requests(requested_at DESC);

-- Telemetry Access Audit Log
CREATE TABLE IF NOT EXISTS telemetry_access_audit (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  access_type VARCHAR(100) NOT NULL,
  resource_type VARCHAR(100),
  resource_id UUID,
  
  query_filters JSONB,
  rows_accessed INTEGER,
  
  ip_address INET,
  user_agent TEXT,
  
  accessed_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_access_type CHECK (
    access_type IN ('view', 'export', 'delete', 'modify', 'query')
  )
);

CREATE INDEX idx_audit_user ON telemetry_access_audit(user_id);
CREATE INDEX idx_audit_type ON telemetry_access_audit(access_type);
CREATE INDEX idx_audit_time ON telemetry_access_audit(accessed_at DESC);

-- ============================================================================
-- PHASE 5: SELF-MONITORING (Enhanced)
-- ============================================================================

-- Telemetry Alerts
CREATE TABLE IF NOT EXISTS telemetry_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_type VARCHAR(100) NOT NULL,
  severity VARCHAR(50) NOT NULL,
  
  title TEXT NOT NULL,
  description TEXT,
  
  metrics JSONB,                 -- Related metrics
  threshold_breached JSONB,      -- What threshold was breached
  
  triggered_at TIMESTAMPTZ DEFAULT NOW(),
  acknowledged_at TIMESTAMPTZ,
  resolved_at TIMESTAMPTZ,
  
  acknowledged_by VARCHAR(255),
  resolution_notes TEXT,
  
  CONSTRAINT valid_alert_severity CHECK (severity IN ('low', 'medium', 'high', 'critical'))
);

CREATE INDEX idx_alerts_type ON telemetry_alerts(alert_type);
CREATE INDEX idx_alerts_severity ON telemetry_alerts(severity);
CREATE INDEX idx_alerts_triggered ON telemetry_alerts(triggered_at DESC);

-- ============================================================================
-- PHASE 6: DEPLOY CORRELATION
-- ============================================================================

-- Deploy Registry
CREATE TABLE IF NOT EXISTS deploy_registry (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deploy_version VARCHAR(100) NOT NULL UNIQUE,
  git_commit_hash VARCHAR(100),
  git_branch VARCHAR(255),
  
  deployed_at TIMESTAMPTZ NOT NULL,
  deployed_by VARCHAR(255),
  
  release_notes TEXT,
  feature_flags_snapshot JSONB,
  
  -- Metadata
  environment VARCHAR(50) DEFAULT 'production',
  build_number VARCHAR(100),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  CONSTRAINT valid_environment CHECK (environment IN ('development', 'staging', 'production'))
);

CREATE INDEX idx_deploy_version ON deploy_registry(deploy_version);
CREATE INDEX idx_deploy_time ON deploy_registry(deployed_at DESC);

-- Deploy Correlation Metrics
CREATE TABLE IF NOT EXISTS deploy_correlation_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deploy_version VARCHAR(100) NOT NULL REFERENCES deploy_registry(deploy_version),
  
  -- Time Windows
  analysis_start TIMESTAMPTZ NOT NULL,
  analysis_end TIMESTAMPTZ NOT NULL,
  
  -- Performance Impact
  avg_performance_change_pct DECIMAL(5,2),
  p95_latency_change_ms INTEGER,
  
  -- Stability Impact
  crash_rate_before DECIMAL(5,2),
  crash_rate_after DECIMAL(5,2),
  crash_rate_change_pct DECIMAL(5,2),
  
  error_rate_before DECIMAL(5,2),
  error_rate_after DECIMAL(5,2),
  error_rate_change_pct DECIMAL(5,2),
  
  -- Bug Correlation
  new_bugs_count INTEGER DEFAULT 0,
  resolved_bugs_count INTEGER DEFAULT 0,
  new_bug_patterns TEXT[],
  
  -- Feature Usage Impact
  feature_adoption_change JSONB,
  feature_performance_change JSONB,
  
  -- User Impact
  affected_users INTEGER DEFAULT 0,
  user_satisfaction_score DECIMAL(3,2),
  
  -- Overall Health
  deploy_health_score DECIMAL(5,2),  -- 0-100
  rollback_recommended BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(deploy_version, analysis_start, analysis_end)
);

CREATE INDEX idx_deploy_corr_version ON deploy_correlation_metrics(deploy_version);
CREATE INDEX idx_deploy_corr_health ON deploy_correlation_metrics(deploy_health_score);

-- ============================================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for data_retention_policies
DROP TRIGGER IF EXISTS update_retention_policies_updated_at ON data_retention_policies;
CREATE TRIGGER update_retention_policies_updated_at
  BEFORE UPDATE ON data_retention_policies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on all new tables
ALTER TABLE feature_usage_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE ux_friction_points ENABLE ROW LEVEL SECURITY;
ALTER TABLE detected_bug_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_cost_tracking ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_cost_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_retention_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_access_audit ENABLE ROW LEVEL SECURITY;
ALTER TABLE telemetry_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE deploy_registry ENABLE ROW LEVEL SECURITY;
ALTER TABLE deploy_correlation_metrics ENABLE ROW LEVEL SECURITY;

-- Admin full access policy for all tables
DO $$
DECLARE
  table_name text;
BEGIN
  FOR table_name IN 
    SELECT unnest(ARRAY[
      'feature_usage_intelligence',
      'ux_friction_points',
      'detected_bug_patterns',
      'user_journeys',
      'feature_cost_tracking',
      'client_cost_analysis',
      'data_retention_policies',
      'user_deletion_requests',
      'telemetry_access_audit',
      'telemetry_alerts',
      'deploy_registry',
      'deploy_correlation_metrics'
    ])
  LOOP
    EXECUTE format('
      CREATE POLICY "Admins have full access to %I"
        ON %I
        FOR ALL
        TO authenticated
        USING (auth.jwt() ->> ''role'' = ''admin'')
        WITH CHECK (auth.jwt() ->> ''role'' = ''admin'')
    ', table_name, table_name);
  END LOOP;
END $$;

-- Service role can insert into most tables
DO $$
DECLARE
  table_name text;
BEGIN
  FOR table_name IN 
    SELECT unnest(ARRAY[
      'feature_usage_intelligence',
      'ux_friction_points',
      'detected_bug_patterns',
      'user_journeys',
      'feature_cost_tracking',
      'client_cost_analysis',
      'telemetry_alerts',
      'deploy_correlation_metrics'
    ])
  LOOP
    EXECUTE format('
      CREATE POLICY "Service can insert into %I"
        ON %I
        FOR INSERT
        TO service_role
        WITH CHECK (true)
    ', table_name, table_name);
  END LOOP;
END $$;

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE feature_usage_intelligence IS 'AI-powered feature usage analytics with segmentation';
COMMENT ON TABLE ux_friction_points IS 'Detected UX friction points and usability issues';
COMMENT ON TABLE detected_bug_patterns IS 'AI-detected bug patterns with deploy correlation';
COMMENT ON TABLE user_journeys IS 'Reconstructed user journeys with completion tracking';
COMMENT ON TABLE feature_cost_tracking IS 'Feature-level cost tracking including AI costs';
COMMENT ON TABLE client_cost_analysis IS 'Per-client cost and profitability analysis';
COMMENT ON TABLE data_retention_policies IS 'LGPD/GDPR compliant data retention policies';
COMMENT ON TABLE user_deletion_requests IS 'User data deletion requests (LGPD/GDPR)';
COMMENT ON TABLE telemetry_access_audit IS 'Audit log of all telemetry data access';
COMMENT ON TABLE telemetry_alerts IS 'System health and quality alerts';
COMMENT ON TABLE deploy_registry IS 'Registry of all application deploys';
COMMENT ON TABLE deploy_correlation_metrics IS 'Deploy impact analysis and correlation';
