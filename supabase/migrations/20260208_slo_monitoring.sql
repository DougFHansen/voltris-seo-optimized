-- ============================================================================
-- SLO MONITORING - AUTOMATED QUERIES
-- Run every 5 minutes via cron job
-- ============================================================================

-- Create SLO metrics table
CREATE TABLE IF NOT EXISTS slo_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_name VARCHAR(255) NOT NULL,
  measured_at TIMESTAMPTZ DEFAULT NOW(),
  actual_value DECIMAL(10,4),
  target_value DECIMAL(10,4),
  within_slo BOOLEAN,
  error_budget_consumed_pct DECIMAL(10,2), -- Increased from (5,2) to support values > 999.99
  measurement_window VARCHAR(50),
  total_requests BIGINT,
  failed_requests BIGINT
);

CREATE INDEX IF NOT EXISTS idx_slo_metrics_name ON slo_metrics(metric_name);
CREATE INDEX IF NOT EXISTS idx_slo_metrics_time ON slo_metrics(measured_at DESC);

-- ============================================================================
-- 1. INGESTION AVAILABILITY SLO: 99.9%
-- ============================================================================
INSERT INTO slo_metrics (
  metric_name,
  actual_value,
  target_value,
  within_slo,
  error_budget_consumed_pct,
  measurement_window,
  total_requests,
  failed_requests
)
WITH health_checks AS (
  SELECT 
    COUNT(*) AS total_checks,
    SUM(CASE WHEN gateway_status = 'healthy' THEN 1 ELSE 0 END) AS healthy_checks
  FROM telemetry_health_metrics
  WHERE metric_timestamp > NOW() - INTERVAL '30 days'
)
SELECT 
  'ingestion_availability',
  (healthy_checks::DECIMAL / NULLIF(total_checks, 0)) * 100,
  99.9,
  (healthy_checks::DECIMAL / NULLIF(total_checks, 0)) >= 0.999,
  LEAST(
    CASE 
      WHEN total_checks > 0 THEN
        ((1 - (healthy_checks::DECIMAL / total_checks)) / (1 - 0.999)) * 100
      ELSE 0
    END,
    9999.99
  ), -- Cap at 9999.99 to prevent overflow
  '30_days',
  total_checks,
  total_checks - healthy_checks
FROM health_checks;

-- ============================================================================
-- 2. EVENT LOSS RATE SLO: < 0.01%
-- ============================================================================
INSERT INTO slo_metrics (
  metric_name,
  actual_value,
  target_value,
  within_slo,
  error_budget_consumed_pct,
  measurement_window,
  total_requests,
  failed_requests
)
WITH event_stats AS (
  SELECT 
    SUM(events_received) AS total_received,
    SUM(events_stored) AS total_stored
  FROM telemetry_health_metrics
  WHERE metric_timestamp > NOW() - INTERVAL '7 days'
)
SELECT 
  'event_loss_rate',
  ((total_received - total_stored)::DECIMAL / NULLIF(total_received, 0)) * 100,
  0.01,
  ((total_received - total_stored)::DECIMAL / NULLIF(total_received, 0)) <= 0.0001,
  LEAST(
    CASE 
      WHEN total_received > 0 THEN
        (((total_received - total_stored)::DECIMAL / total_received) / 0.0001) * 100
      ELSE 0
    END,
    9999.99
  ), -- Cap at 9999.99 to prevent overflow
  '7_days',
  total_received,
  total_received - total_stored
FROM event_stats;

-- ============================================================================
-- 3. VALIDATION LATENCY P95 SLO: < 150ms
-- ============================================================================
INSERT INTO slo_metrics (
  metric_name,
  actual_value,
  target_value,
  within_slo,
  measurement_window
)
WITH latency_p95 AS (
  SELECT 
    PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY avg_ingestion_latency_ms) AS p95_latency
  FROM telemetry_health_metrics
  WHERE metric_timestamp > NOW() - INTERVAL '24 hours'
)
SELECT 
  'validation_latency_p95',
  p95_latency,
  150,
  p95_latency <= 150,
  '24_hours'
FROM latency_p95;

-- ============================================================================
-- 4. API SUCCESS RATE SLO: 99.5%
-- ============================================================================
INSERT INTO slo_metrics (
  metric_name,
  actual_value,
  target_value,
  within_slo,
  error_budget_consumed_pct,
  measurement_window,
  total_requests,
  failed_requests
)
WITH api_stats AS (
  SELECT 
    SUM(events_received) AS total_requests,
    SUM(events_rejected) AS failed_requests
  FROM telemetry_health_metrics
  WHERE metric_timestamp > NOW() - INTERVAL '24 hours'
)
SELECT 
  'api_success_rate',
  ((total_requests - failed_requests)::DECIMAL / NULLIF(total_requests, 0)) * 100,
  99.5,
  ((total_requests - failed_requests)::DECIMAL / NULLIF(total_requests, 0)) >= 0.995,
  LEAST(
    CASE 
      WHEN total_requests > 0 THEN
        ((failed_requests::DECIMAL / total_requests) / (1 - 0.995)) * 100
      ELSE 0
    END,
    9999.99
  ), -- Cap at 9999.99 to prevent overflow
  '24_hours',
  total_requests,
  failed_requests
FROM api_stats;

-- ============================================================================
-- CREATE ALERTS FUNCTION
-- ============================================================================
CREATE OR REPLACE FUNCTION check_slo_breaches()
RETURNS TABLE (
  metric VARCHAR,
  actual DECIMAL,
  target DECIMAL,
  breach_severity VARCHAR
) AS $$
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
$$ LANGUAGE plpgsql;

-- ============================================================================
-- AUTOMATED SLO DASHBOARD VIEW
-- ============================================================================
CREATE OR REPLACE VIEW slo_dashboard AS
SELECT 
  metric_name,
  actual_value || '/' || target_value AS value,
  CASE 
    WHEN within_slo THEN '✅ PASS'
    ELSE '🚨 BREACH'
  END AS status,
  error_budget_consumed_pct || '%' AS error_budget_used,
  measurement_window,
  measured_at
FROM slo_metrics
WHERE measured_at = (
  SELECT MAX(measured_at) 
  FROM slo_metrics sub 
  WHERE sub.metric_name = slo_metrics.metric_name
)
ORDER BY metric_name;

-- ============================================================================
-- USAGE:
-- ============================================================================
-- Run every 5 minutes:
-- SELECT * FROM slo_dashboard;
--
-- Check for breaches:
-- SELECT * FROM check_slo_breaches();
-- ============================================================================
