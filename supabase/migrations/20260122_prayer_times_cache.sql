-- ─────────────────────────────────────────────────────────────────────────────
-- Prayer Times Cache Table
-- ─────────────────────────────────────────────────────────────────────────────
-- 
-- Purpose: Cache monthly prayer times to reduce API calls and enable offline
-- 
-- Benefits:
-- - Reduces Aladhan API calls by ~99%
-- - Enables cross-device sync for logged-in users
-- - Provides reliable offline experience
-- - Prayer times only change 1-2 minutes per day (very predictable)
--
-- Usage: Call via PrayerTimesCacheService.ts
-- ─────────────────────────────────────────────────────────────────────────────

-- Create table for caching monthly prayer times
CREATE TABLE IF NOT EXISTS prayer_times_cache (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Location identifier (rounded to 2 decimal places for ~1km precision)
  location_key TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  
  -- Time period
  year INTEGER NOT NULL,
  month INTEGER NOT NULL, -- 0-11 to match JavaScript Date.getMonth()
  
  -- Calculation method (matches Aladhan API methods)
  -- 3 = Muslim World League (default)
  method INTEGER DEFAULT 3,
  
  -- The actual prayer times data (array of 28-31 days)
  data JSONB NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure one cache entry per location/year/month combination
  UNIQUE(location_key, year, month)
);

-- Index for fast lookups by location and date
CREATE INDEX IF NOT EXISTS idx_prayer_times_location_date 
ON prayer_times_cache(location_key, year, month);

-- Index for cleanup queries (finding old entries)
CREATE INDEX IF NOT EXISTS idx_prayer_times_updated_at
ON prayer_times_cache(updated_at);

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security (RLS)
-- ─────────────────────────────────────────────────────────────────────────────

-- Enable RLS
ALTER TABLE prayer_times_cache ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read (prayer times are public data)
CREATE POLICY "Allow public read access to prayer times cache"
ON prayer_times_cache
FOR SELECT
USING (true);

-- Allow service role to insert/update (called from backend or edge functions)
CREATE POLICY "Allow service role to manage prayer times cache"
ON prayer_times_cache
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Allow authenticated users to insert/update (for client-side caching)
CREATE POLICY "Allow authenticated users to manage prayer times cache"
ON prayer_times_cache
FOR ALL
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');

-- Allow anonymous users to insert (for guest mode)
-- This is safe because prayer times are public astronomical data
CREATE POLICY "Allow anonymous users to insert prayer times cache"
ON prayer_times_cache
FOR INSERT
WITH CHECK (true);

-- ─────────────────────────────────────────────────────────────────────────────
-- Automatic Updated Timestamp
-- ─────────────────────────────────────────────────────────────────────────────

-- Function to update timestamp on row update
CREATE OR REPLACE FUNCTION update_prayer_times_cache_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update timestamp
DROP TRIGGER IF EXISTS trigger_update_prayer_times_cache_updated_at ON prayer_times_cache;
CREATE TRIGGER trigger_update_prayer_times_cache_updated_at
  BEFORE UPDATE ON prayer_times_cache
  FOR EACH ROW
  EXECUTE FUNCTION update_prayer_times_cache_updated_at();

-- ─────────────────────────────────────────────────────────────────────────────
-- Cleanup Function (call periodically via cron or edge function)
-- ─────────────────────────────────────────────────────────────────────────────

-- Delete cache entries older than 60 days
CREATE OR REPLACE FUNCTION cleanup_old_prayer_times_cache()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM prayer_times_cache
  WHERE updated_at < NOW() - INTERVAL '60 days';
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- ─────────────────────────────────────────────────────────────────────────────
-- Comments for documentation
-- ─────────────────────────────────────────────────────────────────────────────

COMMENT ON TABLE prayer_times_cache IS 
'Caches monthly prayer times from Aladhan API to reduce API calls and enable offline support';

COMMENT ON COLUMN prayer_times_cache.location_key IS 
'Composite key of latitude_longitude rounded to 2 decimals (e.g., "21.42_39.83")';

COMMENT ON COLUMN prayer_times_cache.data IS 
'JSONB array of 28-31 PrayerTimeResponse objects, one per day of the month';

COMMENT ON COLUMN prayer_times_cache.method IS 
'Aladhan calculation method: 3=Muslim World League, 4=Umm Al-Qura, etc.';
