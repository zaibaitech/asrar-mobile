# 🚀 Production Backend Deployment Guide

## Overview

This guide walks through deploying the production backend infrastructure for Asrāriya Mobile App, including:

- ✅ Database migration (caching tables)
- ✅ Edge Functions (ephemeris, AI, pre-computation)
- ✅ Cron jobs (automated cache pre-filling)
- ✅ Client migration (secure API calls)
- ✅ Monitoring & alerts

**Estimated Time:** 2-3 hours  
**Complexity:** Medium  
**Rollback Time:** <5 minutes

---

## Prerequisites

### Required Tools

```bash
# Install Supabase CLI
npm install -g supabase

# Verify installation
supabase --version

# Login to Supabase
supabase login
```

### Required Access

- ✅ Supabase project admin access
- ✅ Groq API key (for AI features)
- ✅ GitHub repository write access (for deployment)

### Environment Setup

```bash
# Link to your Supabase project
supabase link --project-ref YOUR_PROJECT_REF

# Verify connection
supabase projects list
```

---

## Phase 1: Database Migration (15 minutes)

### Step 1: Test Migration Locally

```bash
# Start local Supabase (optional, for testing)
supabase start

# Test migration on local database
supabase db reset

# Verify tables created
supabase db diff
```

### Step 2: Deploy to Production

```bash
# Deploy migration to production database
supabase db push

# Verify migration applied
supabase db remote commit
```

### Step 3: Verify Tables

Run in Supabase SQL Editor:

```sql
-- Check tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN (
    'ephemeris_cache',
    'transit_cache',
    'ai_response_cache',
    'api_call_metrics',
    'storage_quotas'
  );

-- Check storage quotas initialized
SELECT * FROM storage_quotas;

-- Test cleanup function
SELECT * FROM cleanup_expired_cache();

-- Test stats function
SELECT * FROM get_cache_stats(24);
```

**Expected Results:**
- ✅ 5 tables created
- ✅ 5 storage quota rows initialized
- ✅ Functions return results without errors

---

## Phase 2: Edge Functions Deployment (30 minutes)

### Step 1: Set Environment Secrets

```bash
# Set Groq API key (server-side only)
supabase secrets set GROQ_API_KEY="gsk_YOUR_KEY_HERE"

# Verify secrets
supabase secrets list
```

### Step 2: Deploy Edge Functions

```bash
# Deploy ephemeris function
cd supabase/functions
supabase functions deploy ephemeris --no-verify-jwt

# Deploy AI reflection function  
supabase functions deploy ai-reflection --no-verify-jwt

# Deploy pre-computation cron
supabase functions deploy precompute-ephemeris --no-verify-jwt

# Verify deployments
supabase functions list
```

**Expected Output:**
```
Function                  Version    Status    URL
ephemeris                 1          ACTIVE    https://PROJECT.supabase.co/functions/v1/ephemeris
ai-reflection             1          ACTIVE    https://PROJECT.supabase.co/functions/v1/ai-reflection
precompute-ephemeris      1          ACTIVE    https://PROJECT.supabase.co/functions/v1/precompute-ephemeris
```

### Step 3: Test Edge Functions

```bash
# Get your project URL and anon key
SUPABASE_URL=$(supabase status | grep "API URL" | awk '{print $3}')
ANON_KEY=$(supabase status | grep "anon key" | awk '{print $3}')

# Test ephemeris function
curl -X POST "$SUPABASE_URL/functions/v1/ephemeris" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2026-01-27T12:00:00Z",
    "planet": "mars",
    "timezone": "UTC"
  }'

# Test AI reflection function
curl -X POST "$SUPABASE_URL/functions/v1/ai-reflection" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "originalText": "May this moment bring clarity",
    "tone": "spiritual",
    "locale": "en"
  }'
```

**Expected Results:**
- ✅ Ephemeris returns planet position data
- ✅ AI reflection returns rewritten text
- ✅ Response headers include `X-Cache-Status: MISS` (first call)
- ✅ Second identical call returns `X-Cache-Status: HIT`

---

## Phase 3: Cron Jobs Setup (15 minutes)

### Option A: Supabase Cron (Recommended)

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule pre-computation (hourly at :05)
SELECT cron.schedule(
  'precompute-ephemeris-hourly',
  '5 * * * *', -- Every hour at :05
  $$
  SELECT
    net.http_post(
      url := 'https://YOUR_PROJECT.supabase.co/functions/v1/precompute-ephemeris',
      headers := '{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
    ) AS request_id;
  $$
);

-- Schedule cache cleanup (daily at 3 AM UTC)
SELECT cron.schedule(
  'cleanup-expired-cache-daily',
  '0 3 * * *',
  $$
  SELECT cleanup_expired_cache();
  $$
);

-- Verify cron jobs
SELECT * FROM cron.job;
```

### Option B: GitHub Actions (Alternative)

Create `.github/workflows/precompute-ephemeris.yml`:

```yaml
name: Pre-compute Ephemeris Cache

on:
  schedule:
    - cron: '5 * * * *' # Every hour at :05
  workflow_dispatch: # Manual trigger

jobs:
  precompute:
    runs-on: ubuntu-latest
    steps:
      - name: Call Edge Function
        run: |
          curl -X POST "${{ secrets.SUPABASE_URL }}/functions/v1/precompute-ephemeris" \
            -H "Authorization: Bearer ${{ secrets.SUPABASE_SERVICE_KEY }}"
```

### Step 3: Monitor First Run

```bash
# Trigger manual run
curl -X POST "https://YOUR_PROJECT.supabase.co/functions/v1/precompute-ephemeris" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY"

# Check logs
supabase functions logs precompute-ephemeris --tail

# Verify cache populated
SELECT COUNT(*), planet_id 
FROM ephemeris_cache 
GROUP BY planet_id;
```

**Expected Results:**
- ✅ 336 rows inserted (7 planets × 48 hours)
- ✅ Logs show "Computed: 336, Skipped: 0"
- ✅ Subsequent runs skip already-cached data

---

## Phase 4: Client Code Deployment (30 minutes)

### Step 1: Update Feature Flags

Edit `config/featureFlags.ts`:

```typescript
export const BACKEND_FEATURE_FLAGS = {
  USE_EPHEMERIS_EDGE_FUNCTION: true,  // ✅ Enable
  USE_AI_EDGE_FUNCTION: true,          // ✅ Enable
  EDGE_FUNCTION_ROLLOUT_PERCENT: 10,   // 🚦 Start at 10%
  ENABLE_FALLBACK: true,               // ✅ Keep enabled
};
```

### Step 2: Build and Test

```bash
# Install dependencies
npm install

# Build for development
npm run start

# Test in simulator/emulator
# Verify:
# - Home screen loads transit data
# - AI reflection works
# - No errors in console
```

### Step 3: Staged Rollout

**Day 1: 10% Rollout**

```typescript
EDGE_FUNCTION_ROLLOUT_PERCENT: 10
```

```bash
# Deploy to production
eas update --branch production --message "Backend migration: 10% rollout"

# Monitor metrics for 24 hours
```

**Day 2: 50% Rollout** (if no issues)

```typescript
EDGE_FUNCTION_ROLLOUT_PERCENT: 50
```

```bash
eas update --branch production --message "Backend migration: 50% rollout"
```

**Day 3: 100% Rollout** (if no issues)

```typescript
EDGE_FUNCTION_ROLLOUT_PERCENT: 100
```

```bash
eas update --branch production --message "Backend migration: 100% rollout"
```

### Step 4: Remove Exposed API Key

After 100% rollout is stable:

Edit `.env`:

```diff
- EXPO_PUBLIC_GROQ_API_KEY=gsk_xxx
+ # Groq API Key (REMOVED - Now stored server-side in Supabase Edge Function)
```

```bash
# Rebuild app
eas build --platform all

# Submit to app stores
eas submit
```

---

## Phase 5: Monitoring Setup (20 minutes)

### Dashboard Queries

Save these queries in Supabase SQL Editor:

**Query 1: Cache Performance (Last 24h)**

```sql
SELECT
  endpoint,
  COUNT(*) AS total_calls,
  COUNT(*) FILTER (WHERE cache_hit = TRUE) AS cache_hits,
  ROUND(100.0 * COUNT(*) FILTER (WHERE cache_hit = TRUE) / COUNT(*), 2) AS hit_rate_percent,
  ROUND(AVG(response_time_ms)::NUMERIC, 2) AS avg_response_ms,
  ROUND(AVG(response_time_ms) FILTER (WHERE cache_hit = TRUE)::NUMERIC, 2) AS avg_cached_ms,
  ROUND(AVG(response_time_ms) FILTER (WHERE cache_hit = FALSE)::NUMERIC, 2) AS avg_miss_ms,
  COUNT(*) FILTER (WHERE status_code >= 400) AS errors
FROM api_call_metrics
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY endpoint
ORDER BY total_calls DESC;
```

**Query 2: Storage Usage**

```sql
SELECT * FROM get_storage_summary();
```

**Query 3: Health Alerts**

```sql
SELECT * FROM check_api_health();
```

**Query 4: Recent Errors**

```sql
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
```

### Set Up Alerts

Create monitoring script `scripts/monitor-backend.sh`:

```bash
#!/bin/bash

# Supabase credentials
PROJECT_URL="https://YOUR_PROJECT.supabase.co"
SERVICE_KEY="YOUR_SERVICE_ROLE_KEY"

# Check cache hit rate
HIT_RATE=$(curl -s "$PROJECT_URL/rest/v1/rpc/get_cache_stats" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  -d '{"hours_back": 1}' \
  | jq -r '.[0].hit_rate')

if (( $(echo "$HIT_RATE < 80" | bc -l) )); then
  echo "⚠️ ALERT: Cache hit rate below 80% ($HIT_RATE%)"
  # Send to Slack/Discord/Email
fi

# Check for errors
ERROR_COUNT=$(curl -s "$PROJECT_URL/rest/v1/api_call_metrics?status_code=gte.400&created_at=gt.$(date -u -d '1 hour ago' +%Y-%m-%dT%H:%M:%S)&select=count" \
  -H "apikey: $SERVICE_KEY" \
  -H "Authorization: Bearer $SERVICE_KEY" \
  | jq -r '.[0].count')

if (( ERROR_COUNT > 10 )); then
  echo "🚨 ALERT: High error rate ($ERROR_COUNT errors in last hour)"
fi
```

Run via cron:

```bash
# Add to crontab
*/15 * * * * /path/to/scripts/monitor-backend.sh
```

---

## Rollback Procedure

If issues detected during rollout:

### 1. Disable Edge Functions (Immediate)

```typescript
// config/featureFlags.ts
export const BACKEND_FEATURE_FLAGS = {
  USE_EPHEMERIS_EDGE_FUNCTION: false,  // ❌ Disable
  USE_AI_EDGE_FUNCTION: false,          // ❌ Disable
  ENABLE_FALLBACK: true,
};
```

```bash
eas update --branch production --message "Rollback: Disable Edge Functions"
```

**Effect:** App reverts to direct NASA/Groq API calls within minutes.

### 2. Disable Cron Jobs

```sql
-- Disable pre-computation
SELECT cron.unschedule('precompute-ephemeris-hourly');

-- Verify disabled
SELECT * FROM cron.job WHERE active = true;
```

### 3. Investigate & Fix

```bash
# Check Edge Function logs
supabase functions logs ephemeris --limit 100
supabase functions logs ai-reflection --limit 100

# Check error metrics
# Run Query 4 (Recent Errors) from monitoring section
```

### 4. Re-enable (After Fix)

```typescript
// Gradual re-enable
EDGE_FUNCTION_ROLLOUT_PERCENT: 10
```

```bash
eas update --branch production --message "Re-enable: 10% rollout after fix"
```

---

## Success Criteria Checklist

### Database

- [ ] Migration deployed without errors
- [ ] All 5 tables created
- [ ] Storage quotas initialized
- [ ] Cleanup function works
- [ ] Stats function returns data

### Edge Functions

- [ ] All 3 functions deployed
- [ ] Ephemeris function returns valid planet data
- [ ] AI reflection function returns rewritten text
- [ ] Cache hit rate >95% after 24h
- [ ] Response time <100ms (cached)

### Cron Jobs

- [ ] Pre-computation runs hourly
- [ ] Cache populated with 48h data
- [ ] Cleanup runs daily
- [ ] No errors in logs

### Client

- [ ] App loads without errors
- [ ] Transit data displays correctly
- [ ] AI features work
- [ ] No API keys in client code

### Monitoring

- [ ] Dashboard queries saved
- [ ] Alerts configured
- [ ] Error tracking active
- [ ] Performance metrics tracked

---

## Performance Targets

| Metric | Before | After | Target |
|--------|--------|-------|--------|
| Cache Hit Rate | ~80% | >95% | >95% |
| Response Time (cached) | 2-3s | <100ms | <100ms |
| Response Time (miss) | 2-3s | <3s | <3s |
| NASA API Calls/Day | 7,000 | <100 | <100 |
| Error Rate | <1% | <1% | <1% |
| Uptime | 99% | >99.9% | >99.9% |

---

## Troubleshooting

### Issue: Edge Function Timeout

```bash
# Increase timeout in function
# Edit supabase/functions/ephemeris/index.ts
const REQUEST_TIMEOUT_MS = 60000; // Increase to 60s
```

### Issue: Cache Not Populating

```bash
# Manually trigger pre-computation
curl -X POST "$SUPABASE_URL/functions/v1/precompute-ephemeris" \
  -H "Authorization: Bearer $SERVICE_KEY"

# Check logs
supabase functions logs precompute-ephemeris --tail
```

### Issue: High Error Rate

```sql
-- Investigate errors
SELECT error_message, COUNT(*) 
FROM api_call_metrics 
WHERE status_code >= 400 
  AND created_at > NOW() - INTERVAL '1 hour'
GROUP BY error_message
ORDER BY COUNT(*) DESC;
```

---

## Next Steps

After successful deployment:

1. **Week 1:** Monitor daily, review metrics
2. **Week 2:** Optimize cache TTLs based on hit rate
3. **Week 3:** Add more edge function features
4. **Week 4:** Performance tuning, cost optimization

**Support:** Create GitHub issue with deployment logs if issues arise.
