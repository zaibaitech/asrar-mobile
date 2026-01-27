-- ============================================================================
-- ASRĀRIYA BACKEND MONITORING QUERIES
-- ============================================================================
-- Purpose: SQL queries for monitoring cache performance and system health
-- Usage: Run these in Supabase SQL Editor or monitoring dashboard
-- ============================================================================

-- ============================================================================
-- 1. CACHE PERFORMANCE DASHBOARD (Last 24 Hours)
-- ============================================================================
-- Shows cache hit rate, response times, and error rates per endpoint
-- Target: >95% hit rate, <100ms cached response time

SELECT
  endpoint,
  COUNT(*) AS total_calls,
  COUNT(*) FILTER (WHERE cache_hit = TRUE) AS cache_hits,
  COUNT(*) FILTER (WHERE cache_hit = FALSE) AS cache_misses,
  ROUND(100.0 * COUNT(*) FILTER (WHERE cache_hit = TRUE) / NULLIF(COUNT(*), 0), 2) AS hit_rate_percent,
  ROUND(AVG(response_time_ms)::NUMERIC, 2) AS avg_response_ms,
  ROUND(AVG(response_time_ms) FILTER (WHERE cache_hit = TRUE)::NUMERIC, 2) AS avg_cached_ms,
  ROUND(AVG(response_time_ms) FILTER (WHERE cache_hit = FALSE)::NUMERIC, 2) AS avg_miss_ms,
  COUNT(*) FILTER (WHERE status_code >= 400) AS error_count,
  ROUND(100.0 * COUNT(*) FILTER (WHERE status_code >= 400) / NULLIF(COUNT(*), 0), 2) AS error_rate_percent
FROM api_call_metrics
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY endpoint
ORDER BY total_calls DESC;

-- ============================================================================
-- 2. STORAGE USAGE SUMMARY
-- ============================================================================
-- Shows current cache storage usage and quotas
-- Alert: Warn when any category exceeds 80% quota

SELECT * FROM get_storage_summary();

-- ============================================================================
-- 3. HEALTH ALERTS
-- ============================================================================
-- Returns active alerts (low cache hit rate, high error rate, storage warnings)
-- Run every 15 minutes for automated monitoring

SELECT * FROM check_api_health();

-- ============================================================================
-- 4. RECENT ERRORS (Last 50)
-- ============================================================================
-- Shows recent API errors for debugging

SELECT
  created_at,
  endpoint,
  status_code,
  error_message,
  request_params
FROM api_call_metrics
WHERE status_code >= 400
ORDER BY created_at DESC
LIMIT 50;

-- ============================================================================
-- 5. CACHE HIT RATE TREND (Hourly, Last 7 Days)
-- ============================================================================
-- Shows cache performance trends over time

SELECT
  DATE_TRUNC('hour', created_at) AS hour,
  endpoint,
  COUNT(*) AS calls,
  ROUND(100.0 * COUNT(*) FILTER (WHERE cache_hit = TRUE) / NULLIF(COUNT(*), 0), 2) AS hit_rate
FROM api_call_metrics
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY hour, endpoint
ORDER BY hour DESC, endpoint;

-- ============================================================================
-- 6. RESPONSE TIME PERCENTILES
-- ============================================================================
-- Shows P50, P95, P99 response times for performance analysis

SELECT
  endpoint,
  cache_hit,
  PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY response_time_ms) AS p50_ms,
  PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY response_time_ms) AS p95_ms,
  PERCENTILE_CONT(0.99) WITHIN GROUP (ORDER BY response_time_ms) AS p99_ms,
  MIN(response_time_ms) AS min_ms,
  MAX(response_time_ms) AS max_ms
FROM api_call_metrics
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY endpoint, cache_hit
ORDER BY endpoint, cache_hit DESC;

-- ============================================================================
-- 7. EPHEMERIS CACHE COVERAGE
-- ============================================================================
-- Shows how many hours of planetary data are cached

SELECT
  planet_id,
  COUNT(*) AS cached_hours,
  MIN(date_hour) AS earliest_cached,
  MAX(date_hour) AS latest_cached,
  COUNT(*) FILTER (WHERE expires_at > NOW()) AS valid_hours
FROM ephemeris_cache
GROUP BY planet_id
ORDER BY planet_id;

-- ============================================================================
-- 8. CACHE EXPIRY FORECAST
-- ============================================================================
-- Shows when cached data will expire (helps plan pre-computation)

SELECT
  DATE_TRUNC('hour', expires_at) AS expires_hour,
  COUNT(*) AS expiring_entries
FROM ephemeris_cache
WHERE expires_at BETWEEN NOW() AND NOW() + INTERVAL '24 hours'
GROUP BY expires_hour
ORDER BY expires_hour;

-- ============================================================================
-- 9. AI CACHE EFFICIENCY
-- ============================================================================
-- Shows AI response cache hit rate and popular queries

SELECT
  request_type,
  locale,
  COUNT(*) AS total_entries,
  SUM(hit_count) AS total_hits,
  ROUND(AVG(hit_count)::NUMERIC, 2) AS avg_hits_per_entry,
  MAX(hit_count) AS max_hits
FROM ai_response_cache
WHERE cached_at > NOW() - INTERVAL '24 hours'
GROUP BY request_type, locale
ORDER BY total_hits DESC;

-- ============================================================================
-- 10. DATABASE SIZE BREAKDOWN
-- ============================================================================
-- Shows size of each table in MB

SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size,
  pg_total_relation_size(schemaname||'.'||tablename) AS size_bytes
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'ephemeris_cache',
    'transit_cache',
    'ai_response_cache',
    'api_call_metrics',
    'storage_quotas'
  )
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- ============================================================================
-- 11. CLEANUP JOB HISTORY
-- ============================================================================
-- Shows when cleanup job last ran and how much data was cleared

SELECT
  category,
  current_bytes,
  total_keys,
  last_cleanup_at,
  NOW() - last_cleanup_at AS time_since_cleanup
FROM storage_quotas
ORDER BY last_cleanup_at DESC NULLS LAST;

-- ============================================================================
-- 12. ACTIVE CRON JOBS
-- ============================================================================
-- Lists all scheduled jobs and their status

SELECT
  jobname,
  schedule,
  active,
  jobid
FROM cron.job
ORDER BY jobname;

-- ============================================================================
-- 13. SLOWEST API CALLS (Last 24h)
-- ============================================================================
-- Identifies slow requests for optimization

SELECT
  endpoint,
  cache_hit,
  response_time_ms,
  request_params,
  created_at
FROM api_call_metrics
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY response_time_ms DESC
LIMIT 20;

-- ============================================================================
-- 14. CACHE INVALIDATION CANDIDATES
-- ============================================================================
-- Finds old cache entries that should be removed

SELECT
  COUNT(*) AS expired_entries,
  SUM(pg_column_size(date_hour)) + SUM(pg_column_size(planet_id)) AS approx_bytes
FROM ephemeris_cache
WHERE expires_at < NOW();

-- ============================================================================
-- 15. USER ACTIVITY PATTERNS
-- ============================================================================
-- Shows API usage patterns by hour (helps optimize cron schedule)

SELECT
  EXTRACT(HOUR FROM created_at) AS hour_of_day,
  COUNT(*) AS request_count,
  ROUND(AVG(response_time_ms)::NUMERIC, 2) AS avg_response_ms
FROM api_call_metrics
WHERE created_at > NOW() - INTERVAL '7 days'
GROUP BY hour_of_day
ORDER BY hour_of_day;

-- ============================================================================
-- AUTOMATED MONITORING ALERTS
-- ============================================================================
-- Run this query every 15 minutes via cron or external monitoring

DO $$
DECLARE
  alert_message TEXT;
  hit_rate NUMERIC;
  error_rate NUMERIC;
BEGIN
  -- Check cache hit rate
  SELECT ROUND(100.0 * COUNT(*) FILTER (WHERE cache_hit = TRUE) / NULLIF(COUNT(*), 0), 2)
  INTO hit_rate
  FROM api_call_metrics
  WHERE endpoint = 'ephemeris' 
    AND created_at > NOW() - INTERVAL '1 hour';

  IF hit_rate < 80 THEN
    RAISE NOTICE '⚠️ ALERT: Ephemeris cache hit rate below 80%%: %%', hit_rate;
  END IF;

  -- Check error rate
  SELECT ROUND(100.0 * COUNT(*) FILTER (WHERE status_code >= 400) / NULLIF(COUNT(*), 0), 2)
  INTO error_rate
  FROM api_call_metrics
  WHERE created_at > NOW() - INTERVAL '1 hour';

  IF error_rate > 5 THEN
    RAISE NOTICE '🚨 ALERT: Error rate above 5%%: %%', error_rate;
  END IF;
END $$;

-- ============================================================================
-- PERFORMANCE BENCHMARKS (For Baseline Comparison)
-- ============================================================================
-- Run this weekly to track performance improvements over time

SELECT
  DATE_TRUNC('week', created_at) AS week,
  endpoint,
  COUNT(*) AS total_calls,
  ROUND(100.0 * COUNT(*) FILTER (WHERE cache_hit = TRUE) / NULLIF(COUNT(*), 0), 2) AS hit_rate,
  ROUND(AVG(response_time_ms)::NUMERIC, 2) AS avg_ms,
  ROUND(AVG(response_time_ms) FILTER (WHERE cache_hit = TRUE)::NUMERIC, 2) AS cached_ms,
  ROUND(AVG(response_time_ms) FILTER (WHERE cache_hit = FALSE)::NUMERIC, 2) AS miss_ms
FROM api_call_metrics
GROUP BY week, endpoint
ORDER BY week DESC, endpoint;
