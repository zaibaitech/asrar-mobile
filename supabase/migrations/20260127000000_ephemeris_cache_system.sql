-- ============================================================================
-- ASRĀRIYA MOBILE APP - EPHEMERIS CACHE SYSTEM
-- ============================================================================
-- Purpose: Production-grade caching infrastructure for astronomical data
-- Created: 2026-01-27
-- Version: 1.0.0
--
-- Tables:
--   1. ephemeris_cache - Planetary positions from NASA JPL Horizons
--   2. transit_cache - Computed transit analysis results
--   3. ai_response_cache - AI-generated content caching
--   4. api_call_metrics - Performance and usage tracking
--   5. storage_quotas - Cache size monitoring
--
-- Performance Targets:
--   - Cache hit rate: >95%
--   - Response time: <100ms (cache hit)
--   - Database storage: <50 MB
-- ============================================================================

-- ============================================================================
-- TABLE: ephemeris_cache
-- Purpose: Store planetary positions to reduce NASA API calls by 99%+
-- Expected Size: ~336 rows per planet (7 planets × 48 hours)
-- TTL: 48 hours
-- ============================================================================
CREATE TABLE IF NOT EXISTS ephemeris_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Time bucket (rounded to nearest hour for cache efficiency)
  date_hour TIMESTAMPTZ NOT NULL,
  
  -- Planet identifier
  planet_id TEXT NOT NULL,
  
  -- Astronomical coordinates (ecliptic)
  longitude DECIMAL(12, 8) NOT NULL,
  latitude DECIMAL(12, 8) NOT NULL,
  speed DECIMAL(12, 8) NOT NULL,
  distance DECIMAL(12, 8) NOT NULL,
  
  -- Zodiac position
  zodiac_sign TEXT NOT NULL,
  zodiac_degree DECIMAL(8, 4) NOT NULL,
  
  -- Retrograde status
  is_retrograde BOOLEAN DEFAULT FALSE,
  
  -- Cache metadata
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Performance index: Fast lookups by planet and time
CREATE INDEX idx_ephemeris_planet_date 
  ON ephemeris_cache(planet_id, date_hour);

-- Cleanup index: Fast expiration queries
CREATE INDEX idx_ephemeris_expires 
  ON ephemeris_cache(expires_at);

-- Prevent duplicate cache entries
CREATE UNIQUE INDEX idx_ephemeris_unique 
  ON ephemeris_cache(planet_id, date_hour);

-- Auto-update timestamp trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ephemeris_cache_updated_at
  BEFORE UPDATE ON ephemeris_cache
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- TABLE: transit_cache
-- Purpose: Cache computed transit analysis (expensive calculations)
-- Expected Size: ~2,000 rows (288 per day × 7 days retention)
-- TTL: 5-30 minutes (configurable per query)
-- ============================================================================
CREATE TABLE IF NOT EXISTS transit_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Time bucket (rounded to nearest minute)
  date_minute TIMESTAMPTZ NOT NULL,
  
  -- Location/timezone context
  timezone TEXT NOT NULL DEFAULT 'UTC',
  latitude DECIMAL(10, 7),
  longitude DECIMAL(10, 7),
  
  -- Cached transit data (JSONB for flexibility)
  transit_data JSONB NOT NULL,
  
  -- Cache metadata
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fast lookups by time and location
CREATE INDEX idx_transit_date_tz 
  ON transit_cache(date_minute, timezone);

-- GIN index for JSONB queries (if needed)
CREATE INDEX idx_transit_data 
  ON transit_cache USING GIN (transit_data);

-- Cleanup index
CREATE INDEX idx_transit_expires 
  ON transit_cache(expires_at);

-- ============================================================================
-- TABLE: ai_response_cache
-- Purpose: Cache AI-generated content (Groq API responses)
-- Expected Size: ~1,000 rows (frequently repeated queries)
-- TTL: 5 minutes (short TTL for personalized content)
-- ============================================================================
CREATE TABLE IF NOT EXISTS ai_response_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Cache key (hash of request parameters)
  cache_key TEXT NOT NULL UNIQUE,
  
  -- Cached response data
  response_data JSONB NOT NULL,
  
  -- Request metadata (for debugging)
  request_type TEXT, -- 'reflection', 'divine_timing', 'quran_resonance'
  locale TEXT DEFAULT 'en',
  model TEXT DEFAULT 'mixtral-8x7b-32768',
  
  -- Cache metadata
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  
  -- Audit fields
  created_at TIMESTAMPTZ DEFAULT NOW(),
  hit_count INTEGER DEFAULT 0
);

-- Fast cache key lookups
CREATE INDEX idx_ai_cache_key 
  ON ai_response_cache(cache_key, cached_at DESC);

-- Type-based queries
CREATE INDEX idx_ai_request_type 
  ON ai_response_cache(request_type, cached_at DESC);

-- ============================================================================
-- TABLE: api_call_metrics
-- Purpose: Track API performance, cache efficiency, and error rates
-- Retention: 30 days
-- ============================================================================
CREATE TABLE IF NOT EXISTS api_call_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Request context
  endpoint TEXT NOT NULL, -- 'ephemeris', 'ai-reflection', 'transit'
  method TEXT DEFAULT 'POST',
  
  -- User context (optional)
  user_id UUID,
  session_id TEXT,
  
  -- Performance metrics
  response_time_ms INTEGER NOT NULL,
  status_code INTEGER NOT NULL,
  
  -- Cache performance
  cache_hit BOOLEAN DEFAULT FALSE,
  cache_source TEXT, -- 'database', 'memory', 'nasa_horizons', 'groq_api'
  
  -- Error tracking
  error_message TEXT,
  error_stack TEXT,
  
  -- Request metadata
  request_params JSONB,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Query performance by endpoint and time
CREATE INDEX idx_metrics_endpoint_time 
  ON api_call_metrics(endpoint, created_at DESC);

-- Cache analysis queries
CREATE INDEX idx_metrics_cache 
  ON api_call_metrics(cache_hit, cache_source, created_at DESC);

-- Error tracking
CREATE INDEX idx_metrics_errors 
  ON api_call_metrics(status_code, created_at DESC) 
  WHERE status_code >= 400;

-- User-specific queries
CREATE INDEX idx_metrics_user 
  ON api_call_metrics(user_id, created_at DESC) 
  WHERE user_id IS NOT NULL;

-- ============================================================================
-- TABLE: storage_quotas
-- Purpose: Monitor cache size and prevent unbounded growth
-- ============================================================================
CREATE TABLE IF NOT EXISTS storage_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Cache category
  category TEXT NOT NULL UNIQUE,
  
  -- Storage metrics
  current_bytes BIGINT DEFAULT 0,
  max_bytes BIGINT NOT NULL,
  total_keys INTEGER DEFAULT 0,
  
  -- Performance metrics
  hit_rate DECIMAL(5, 2) DEFAULT 0.00,
  
  -- Maintenance
  last_cleanup_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TRIGGER storage_quotas_updated_at
  BEFORE UPDATE ON storage_quotas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Pre-populate storage quotas
INSERT INTO storage_quotas (category, max_bytes) VALUES
  ('ephemeris', 10485760),      -- 10 MB
  ('transits', 5242880),         -- 5 MB
  ('prayer_times', 2097152),     -- 2 MB
  ('moon_data', 1048576),        -- 1 MB
  ('ai_cache', 5242880)          -- 5 MB
ON CONFLICT (category) DO NOTHING;

-- ============================================================================
-- FUNCTION: cleanup_expired_cache
-- Purpose: Remove expired cache entries (run daily via cron)
-- Returns: Row counts of deleted records
-- ============================================================================
CREATE OR REPLACE FUNCTION cleanup_expired_cache()
RETURNS TABLE(
  ephemeris_deleted INTEGER,
  transit_deleted INTEGER,
  ai_deleted INTEGER,
  total_freed_bytes BIGINT
) 
LANGUAGE plpgsql
AS $$
DECLARE
  eph_count INTEGER;
  trans_count INTEGER;
  ai_count INTEGER;
  freed_bytes BIGINT;
BEGIN
  -- Delete expired ephemeris cache
  DELETE FROM ephemeris_cache WHERE expires_at < NOW();
  GET DIAGNOSTICS eph_count = ROW_COUNT;
  
  -- Delete expired transit cache
  DELETE FROM transit_cache WHERE expires_at < NOW();
  GET DIAGNOSTICS trans_count = ROW_COUNT;
  
  -- Delete old AI cache (>24 hours)
  DELETE FROM ai_response_cache WHERE cached_at < NOW() - INTERVAL '24 hours';
  GET DIAGNOSTICS ai_count = ROW_COUNT;
  
  -- Delete old metrics (>30 days)
  DELETE FROM api_call_metrics WHERE created_at < NOW() - INTERVAL '30 days';
  
  -- Calculate freed space (approximate)
  freed_bytes := (eph_count * 1024) + (trans_count * 2048) + (ai_count * 1024);
  
  -- Update storage quotas
  UPDATE storage_quotas SET 
    current_bytes = (SELECT pg_total_relation_size('ephemeris_cache')),
    total_keys = (SELECT COUNT(*) FROM ephemeris_cache),
    last_cleanup_at = NOW()
  WHERE category = 'ephemeris';
  
  UPDATE storage_quotas SET 
    current_bytes = (SELECT pg_total_relation_size('transit_cache')),
    total_keys = (SELECT COUNT(*) FROM transit_cache),
    last_cleanup_at = NOW()
  WHERE category = 'transits';
  
  UPDATE storage_quotas SET 
    current_bytes = (SELECT pg_total_relation_size('ai_response_cache')),
    total_keys = (SELECT COUNT(*) FROM ai_response_cache),
    last_cleanup_at = NOW()
  WHERE category = 'ai_cache';
  
  -- Return results
  RETURN QUERY 
    SELECT eph_count, trans_count, ai_count, freed_bytes;
END;
$$;

-- ============================================================================
-- FUNCTION: get_cache_stats
-- Purpose: Calculate cache performance metrics for monitoring
-- Parameters: hours_back (default 24)
-- ============================================================================
CREATE OR REPLACE FUNCTION get_cache_stats(hours_back INTEGER DEFAULT 24)
RETURNS TABLE(
  endpoint TEXT,
  total_calls BIGINT,
  cache_hits BIGINT,
  cache_misses BIGINT,
  hit_rate DECIMAL,
  avg_response_ms DECIMAL,
  avg_cached_ms DECIMAL,
  avg_miss_ms DECIMAL,
  error_count BIGINT,
  error_rate DECIMAL
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    m.endpoint,
    COUNT(*)::BIGINT AS total_calls,
    COUNT(*) FILTER (WHERE m.cache_hit = TRUE)::BIGINT AS cache_hits,
    COUNT(*) FILTER (WHERE m.cache_hit = FALSE)::BIGINT AS cache_misses,
    ROUND(100.0 * COUNT(*) FILTER (WHERE m.cache_hit = TRUE) / NULLIF(COUNT(*), 0), 2) AS hit_rate,
    ROUND(AVG(m.response_time_ms)::NUMERIC, 2) AS avg_response_ms,
    ROUND(AVG(m.response_time_ms) FILTER (WHERE m.cache_hit = TRUE)::NUMERIC, 2) AS avg_cached_ms,
    ROUND(AVG(m.response_time_ms) FILTER (WHERE m.cache_hit = FALSE)::NUMERIC, 2) AS avg_miss_ms,
    COUNT(*) FILTER (WHERE m.status_code >= 400)::BIGINT AS error_count,
    ROUND(100.0 * COUNT(*) FILTER (WHERE m.status_code >= 400) / NULLIF(COUNT(*), 0), 2) AS error_rate
  FROM api_call_metrics m
  WHERE m.created_at > NOW() - (hours_back || ' hours')::INTERVAL
  GROUP BY m.endpoint
  ORDER BY total_calls DESC;
END;
$$;

-- ============================================================================
-- FUNCTION: check_api_health
-- Purpose: Alert on cache degradation or high error rates
-- ============================================================================
CREATE OR REPLACE FUNCTION check_api_health()
RETURNS TABLE(
  alert_type TEXT,
  severity TEXT,
  message TEXT
) 
LANGUAGE plpgsql
AS $$
BEGIN
  -- Check ephemeris cache hit rate
  RETURN QUERY
  SELECT
    'low_cache_hit_rate'::TEXT,
    'warning'::TEXT,
    'Ephemeris cache hit rate below 80%: ' || hit_rate || '%'
  FROM (
    SELECT ROUND(100.0 * COUNT(*) FILTER (WHERE cache_hit = TRUE) / NULLIF(COUNT(*), 0), 2) AS hit_rate
    FROM api_call_metrics
    WHERE endpoint = 'ephemeris' AND created_at > NOW() - INTERVAL '1 hour'
  ) stats
  WHERE hit_rate < 80 AND hit_rate IS NOT NULL;
  
  -- Check error rate
  RETURN QUERY
  SELECT
    'high_error_rate'::TEXT,
    'critical'::TEXT,
    'Error rate above 5%: ' || error_rate || '%'
  FROM (
    SELECT ROUND(100.0 * COUNT(*) FILTER (WHERE status_code >= 400) / NULLIF(COUNT(*), 0), 2) AS error_rate
    FROM api_call_metrics
    WHERE created_at > NOW() - INTERVAL '1 hour'
  ) stats
  WHERE error_rate > 5 AND error_rate IS NOT NULL;
  
  -- Check storage quota
  RETURN QUERY
  SELECT
    'storage_quota_warning'::TEXT,
    'warning'::TEXT,
    category || ' using ' || ROUND(100.0 * current_bytes / NULLIF(max_bytes, 0), 2) || '% of quota'
  FROM storage_quotas
  WHERE current_bytes::FLOAT / NULLIF(max_bytes, 0) > 0.8;
  
  -- Check slow response times
  RETURN QUERY
  SELECT
    'slow_response_time'::TEXT,
    'warning'::TEXT,
    'Average cached response time above 200ms: ' || avg_ms || 'ms'
  FROM (
    SELECT ROUND(AVG(response_time_ms)::NUMERIC, 2) AS avg_ms
    FROM api_call_metrics
    WHERE cache_hit = TRUE AND created_at > NOW() - INTERVAL '1 hour'
  ) stats
  WHERE avg_ms > 200 AND avg_ms IS NOT NULL;
END;
$$;

-- ============================================================================
-- FUNCTION: get_storage_summary
-- Purpose: Quick overview of cache storage usage
-- ============================================================================
CREATE OR REPLACE FUNCTION get_storage_summary()
RETURNS TABLE(
  category TEXT,
  size_mb DECIMAL,
  total_keys INTEGER,
  quota_mb DECIMAL,
  usage_percent DECIMAL,
  last_cleanup TEXT
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    sq.category,
    ROUND((sq.current_bytes / 1048576.0)::NUMERIC, 2) AS size_mb,
    sq.total_keys,
    ROUND((sq.max_bytes / 1048576.0)::NUMERIC, 2) AS quota_mb,
    ROUND((100.0 * sq.current_bytes / NULLIF(sq.max_bytes, 0))::NUMERIC, 2) AS usage_percent,
    CASE 
      WHEN sq.last_cleanup_at IS NULL THEN 'Never'
      ELSE to_char(sq.last_cleanup_at, 'YYYY-MM-DD HH24:MI')
    END AS last_cleanup
  FROM storage_quotas sq
  ORDER BY size_mb DESC;
END;
$$;

-- ============================================================================
-- Enable Row Level Security (RLS)
-- ============================================================================

ALTER TABLE ephemeris_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE transit_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_response_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_call_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage_quotas ENABLE ROW LEVEL SECURITY;

-- Policy: Service role has full access (for Edge Functions)
CREATE POLICY "Service role full access" ON ephemeris_cache
  FOR ALL USING (true);

CREATE POLICY "Service role full access" ON transit_cache
  FOR ALL USING (true);

CREATE POLICY "Service role full access" ON ai_response_cache
  FOR ALL USING (true);

CREATE POLICY "Service role full access" ON api_call_metrics
  FOR ALL USING (true);

CREATE POLICY "Service role full access" ON storage_quotas
  FOR ALL USING (true);

-- ============================================================================
-- Grant permissions for authenticated users (read-only cache access)
-- ============================================================================

-- Authenticated users can read from cache tables (for client-side fallback)
CREATE POLICY "Authenticated read access" ON ephemeris_cache
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated read access" ON transit_cache
  FOR SELECT USING (auth.role() = 'authenticated');

-- ============================================================================
-- COMMENTS (Documentation)
-- ============================================================================

COMMENT ON TABLE ephemeris_cache IS 
  'Caches planetary positions from NASA JPL Horizons API. Target: 99% cache hit rate, <100ms response time.';

COMMENT ON TABLE transit_cache IS 
  'Caches computed transit analysis. TTL: 5-30 minutes based on data volatility.';

COMMENT ON TABLE ai_response_cache IS 
  'Caches AI-generated responses from Groq API. Reduces API costs and improves response time.';

COMMENT ON TABLE api_call_metrics IS 
  'Tracks API performance metrics for monitoring and optimization. Retention: 30 days.';

COMMENT ON TABLE storage_quotas IS 
  'Monitors cache size limits to prevent unbounded growth. Alert at 80% usage.';

COMMENT ON FUNCTION cleanup_expired_cache() IS 
  'Removes expired cache entries and updates storage quotas. Run daily via cron.';

COMMENT ON FUNCTION get_cache_stats(INTEGER) IS 
  'Returns cache performance metrics for specified time window. Default: last 24 hours.';

COMMENT ON FUNCTION check_api_health() IS 
  'Returns alerts for cache degradation or high error rates. Use for monitoring dashboards.';

-- ============================================================================
-- VACUUM AND ANALYZE
-- ============================================================================

-- Optimize tables for performance
VACUUM ANALYZE ephemeris_cache;
VACUUM ANALYZE transit_cache;
VACUUM ANALYZE ai_response_cache;
VACUUM ANALYZE api_call_metrics;
VACUUM ANALYZE storage_quotas;

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Next steps:
-- 1. Deploy Edge Functions (ephemeris, ai-reflection, precompute-ephemeris)
-- 2. Set up cron jobs for pre-computation and cleanup
-- 3. Update client code to call Edge Functions
-- 4. Monitor cache hit rate and response times
--
-- Success metrics:
-- ✅ Cache hit rate: >95%
-- ✅ Response time (cached): <100ms
-- ✅ Database size: <50 MB
-- ✅ NASA API calls: <100/day (down from 1000s/day)
-- ============================================================================
