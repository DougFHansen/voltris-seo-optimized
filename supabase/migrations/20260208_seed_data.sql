-- ============================================================================
-- VOLTRIS ENTERPRISE TELEMETRY PLATFORM - SEED DATA
-- Initial data for testing and demonstration
-- ============================================================================

-- Insert data retention policies
INSERT INTO data_retention_policies (event_type, retention_days, auto_delete) VALUES
  ('PAGE_VIEW', 90, true),
  ('APP_START', 365, true),
  ('EXCEPTION', 180, true),
  ('CLEANUP_EXECUTED', 180, true),
  ('LICENSE_ACTIVATE', 730, true),
  ('UI_INTERACTION', 30, true),
  ('PERFORMANCE_METRIC', 90, true)
ON CONFLICT (event_type) DO NOTHING;

-- Insert initial deploy (current version)
INSERT INTO deploy_registry (
  deploy_version,
  git_commit_hash,
  git_branch,
  deployed_by,
  release_notes,
  environment,
  build_number,
  deployed_at
) VALUES (
  'v1.0.0',
  'initial',
  'main',
  'system',
  'Initial Enterprise Telemetry Platform deployment',
  'production',
  '1',
  NOW()
) ON CONFLICT (deploy_version) DO NOTHING;

-- Sample feature flags snapshot for testing
UPDATE deploy_registry 
SET feature_flags_snapshot = '{
  "ai_lyra_enabled": true,
  "telemetry_enterprise": true,
  "gamer_mode_advanced": true,
  "ultra_cleaner": true,
  "network_optimizer": true,
  "system_profiler": true
}'::jsonb
WHERE deploy_version = 'v1.0.0';

-- ============================================================================
-- SAMPLE ANALYTICS DATA (for testing dashboards)
-- ============================================================================

-- Sample feature usage intelligence (placeholder data)
INSERT INTO feature_usage_intelligence (
  feature_name,
  period_start,
  period_end,
  total_users,
  active_users,
  new_users,
  total_events,
  success_rate,
  avg_duration_ms,
  abandonment_rate,
  friction_score,
  user_segments,
  insights,
  recommendations
) VALUES (
  'Cleanup',
  NOW() - INTERVAL '24 hours',
  NOW(),
  150,
  120,
  15,
  450,
  95.5,
  2500,
  4.5,
  12.5,
  '{"free": 80, "pro": 50, "enterprise": 20}'::jsonb,
  '[{"type": "info", "message": "High user engagement"}]'::jsonb,
  '["Maintain current UX", "Consider adding automation"]'::jsonb
),
(
  'Gamer Mode',
  NOW() - INTERVAL '24 hours',
  NOW(),
  80,
  65,
  8,
  200,
  92.0,
  1800,
  8.0,
  18.0,
  '{"free": 20, "pro": 40, "enterprise": 20}'::jsonb,
  '[{"type": "warning", "message": "Some friction detected"}]'::jsonb,
  '["Improve onboarding", "Add tooltips"]'::jsonb
),
(
  'System Monitor',
  NOW() - INTERVAL '24 hours',
  NOW(),
  200,
  180,
  20,
  600,
  98.0,
  500,
  2.0,
  8.0,
  '{"free": 100, "pro": 70, "enterprise": 30}'::jsonb,
  '[{"type": "info", "message": "Excellent performance"}]'::jsonb,
  '["Expand monitoring features"]'::jsonb
);

-- Sample cost tracking (placeholder data)
INSERT INTO feature_cost_tracking (
  feature_name,
  period_start,
  period_end,
  compute_cost_usd,
  storage_cost_usd,
  bandwidth_cost_usd,
  ai_api_cost_usd,
  total_users,
  total_events,
  revenue_generated_usd,
  roi_percentage,
  cost_per_user,
  cost_per_event
) VALUES (
  'Cleanup',
  NOW() - INTERVAL '30 days',
  NOW(),
  0.0450,
  0.0080,
  0.0180,
  0.0000,
  150,
  450,
  120.00,
  350.50,
  0.000473,
  0.00000157
),
(
  'AI Lyra',
  NOW() - INTERVAL '30 days',
  NOW(),
  0.0200,
  0.0050,
  0.0100,
  0.4500,
  50,
  150,
  250.00,
  420.75,
  0.009700,
  0.00323333
),
(
  'Gamer Mode',
  NOW() - INTERVAL '30 days',
  NOW(),
  0.0360,
  0.0072,
  0.0160,
  0.0000,
  80,
  200,
  180.00,
  280.25,
  0.000740,
  0.00029600
);

-- Sample telemetry health metric
INSERT INTO telemetry_health_metrics (
  metric_timestamp,
  events_received,
  events_validated,
  events_rejected,
  events_stored,
  rejection_reasons,
  avg_ingestion_latency_ms,
  p95_ingestion_latency_ms,
  p99_ingestion_latency_ms,
  gateway_status,
  database_status
) VALUES (
  NOW(),
  1000,
  980,
  20,
  980,
  '{"SCHEMA_VALIDATION_FAILED": 15, "EVENT_NOT_REGISTERED": 5}'::jsonb,
  45,
  120,
  180,
  'healthy',
  'healthy'
);

-- ============================================================================
-- COMMENTS
-- ============================================================================

COMMENT ON TABLE data_retention_policies IS 'Seeded with common event retention policies';
COMMENT ON TABLE deploy_registry IS 'Seeded with initial deploy v1.0.0';
COMMENT ON TABLE feature_usage_intelligence IS 'Seeded with sample analytics for testing';
COMMENT ON TABLE feature_cost_tracking IS 'Seeded with sample cost data for testing';
COMMENT ON TABLE telemetry_health_metrics IS 'Seeded with sample health metric';

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '✅ Seed data inserted successfully!';
  RAISE NOTICE '📊 Sample analytics data ready for testing';
  RAISE NOTICE '💰 Sample cost data ready for dashboards';
  RAISE NOTICE '🛰 Initial deploy registered: v1.0.0';
  RAISE NOTICE '🎉 Enterprise Telemetry Platform is ready!';
END $$;
