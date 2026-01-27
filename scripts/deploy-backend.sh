#!/bin/bash

# ============================================================================
# ASRĀRIYA BACKEND DEPLOYMENT SCRIPT
# ============================================================================
# Purpose: Automate backend deployment to Supabase
# Usage: ./scripts/deploy-backend.sh [phase]
#   phase: database|functions|cron|all
# ============================================================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ============================================================================
# HELPER FUNCTIONS
# ============================================================================

print_header() {
  echo ""
  echo -e "${BLUE}============================================================================${NC}"
  echo -e "${BLUE}$1${NC}"
  echo -e "${BLUE}============================================================================${NC}"
  echo ""
}

print_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
  echo -e "${RED}❌ $1${NC}"
}

print_info() {
  echo -e "${BLUE}ℹ️  $1${NC}"
}

confirm() {
  read -p "$(echo -e ${YELLOW}$1 [y/N]: ${NC})" -n 1 -r
  echo
  [[ $REPLY =~ ^[Yy]$ ]]
}

# ============================================================================
# PREREQUISITE CHECKS
# ============================================================================

check_prerequisites() {
  print_header "Checking Prerequisites"

  # Check if Supabase CLI is installed
  if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI not found"
    print_info "Install: npm install -g supabase"
    exit 1
  fi
  print_success "Supabase CLI installed"

  # Check if logged in
  if ! supabase projects list &> /dev/null; then
    print_error "Not logged in to Supabase"
    print_info "Run: supabase login"
    exit 1
  fi
  print_success "Logged in to Supabase"

  # Check if project is linked
  if [ ! -f ".supabase/config.toml" ]; then
    print_error "Project not linked to Supabase"
    print_info "Run: supabase link --project-ref YOUR_PROJECT_REF"
    exit 1
  fi
  print_success "Project linked"

  print_success "All prerequisites met!"
}

# ============================================================================
# PHASE 1: DATABASE MIGRATION
# ============================================================================

deploy_database() {
  print_header "Phase 1: Database Migration"

  print_info "This will create the following tables:"
  echo "  • ephemeris_cache"
  echo "  • transit_cache"
  echo "  • ai_response_cache"
  echo "  • api_call_metrics"
  echo "  • storage_quotas"
  echo ""

  if ! confirm "Deploy database migration?"; then
    print_warning "Skipping database migration"
    return
  fi

  print_info "Pushing migration to production..."
  supabase db push

  print_success "Database migration deployed!"

  # Verify tables created
  print_info "Verifying tables..."
  supabase db execute "SELECT COUNT(*) FROM storage_quotas;" &> /dev/null
  
  if [ $? -eq 0 ]; then
    print_success "Tables verified successfully!"
  else
    print_error "Table verification failed"
    exit 1
  fi
}

# ============================================================================
# PHASE 2: EDGE FUNCTIONS
# ============================================================================

deploy_functions() {
  print_header "Phase 2: Edge Functions Deployment"

  # Check if GROQ_API_KEY is needed
  print_info "Setting up Groq API key..."
  
  if confirm "Do you have a Groq API key to set?"; then
    read -sp "Enter Groq API Key: " GROQ_KEY
    echo ""
    supabase secrets set GROQ_API_KEY="$GROQ_KEY"
    print_success "Groq API key set"
  else
    print_warning "Skipping Groq API key setup"
  fi

  print_info "Deploying Edge Functions..."

  # Deploy ephemeris function
  print_info "Deploying ephemeris function..."
  supabase functions deploy ephemeris --no-verify-jwt
  print_success "Ephemeris function deployed"

  # Deploy AI reflection function
  print_info "Deploying ai-reflection function..."
  supabase functions deploy ai-reflection --no-verify-jwt
  print_success "AI reflection function deployed"

  # Deploy pre-computation function
  print_info "Deploying precompute-ephemeris function..."
  supabase functions deploy precompute-ephemeris --no-verify-jwt
  print_success "Pre-computation function deployed"

  print_success "All Edge Functions deployed!"

  # List deployed functions
  print_info "Deployed functions:"
  supabase functions list
}

# ============================================================================
# PHASE 3: CRON JOBS
# ============================================================================

deploy_cron() {
  print_header "Phase 3: Cron Jobs Setup"

  print_info "This will schedule:"
  echo "  • Pre-computation job (hourly at :05)"
  echo "  • Cache cleanup job (daily at 3 AM UTC)"
  echo ""

  if ! confirm "Set up cron jobs?"; then
    print_warning "Skipping cron jobs"
    return
  fi

  # Get Supabase URL and Service Key
  SUPABASE_URL=$(supabase status | grep "API URL" | awk '{print $3}' || echo "")
  
  if [ -z "$SUPABASE_URL" ]; then
    print_error "Could not get Supabase URL"
    print_info "Please set up cron jobs manually using the deployment guide"
    return
  fi

  read -sp "Enter your Supabase SERVICE_ROLE_KEY: " SERVICE_KEY
  echo ""

  # Create cron jobs SQL
  CRON_SQL=$(cat <<EOF
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule pre-computation (hourly at :05)
SELECT cron.schedule(
  'precompute-ephemeris-hourly',
  '5 * * * *',
  \$\$
  SELECT
    net.http_post(
      url := '${SUPABASE_URL}/functions/v1/precompute-ephemeris',
      headers := '{"Authorization": "Bearer ${SERVICE_KEY}"}'::jsonb
    ) AS request_id;
  \$\$
);

-- Schedule cache cleanup (daily at 3 AM UTC)
SELECT cron.schedule(
  'cleanup-expired-cache-daily',
  '0 3 * * *',
  \$\$
  SELECT cleanup_expired_cache();
  \$\$
);
EOF
)

  # Execute cron setup
  echo "$CRON_SQL" | supabase db execute
  
  print_success "Cron jobs scheduled!"

  # Verify cron jobs
  print_info "Scheduled jobs:"
  supabase db execute "SELECT jobname, schedule, active FROM cron.job;" || echo ""
}

# ============================================================================
# TEST FUNCTIONS
# ============================================================================

test_deployment() {
  print_header "Testing Deployment"

  SUPABASE_URL=$(supabase status | grep "API URL" | awk '{print $3}' || echo "")
  ANON_KEY=$(supabase status | grep "anon key" | awk '{print $3}' || echo "")

  if [ -z "$SUPABASE_URL" ] || [ -z "$ANON_KEY" ]; then
    print_error "Could not get Supabase credentials"
    print_info "Please test manually using curl commands from deployment guide"
    return
  fi

  print_info "Testing ephemeris function..."
  RESPONSE=$(curl -s -X POST "$SUPABASE_URL/functions/v1/ephemeris" \
    -H "Authorization: Bearer $ANON_KEY" \
    -H "Content-Type: application/json" \
    -d '{"date":"2026-01-27T12:00:00Z","planet":"mars"}')

  if echo "$RESPONSE" | grep -q "planet_id"; then
    print_success "Ephemeris function working!"
  else
    print_error "Ephemeris function test failed"
    echo "Response: $RESPONSE"
  fi

  print_info "Testing AI reflection function..."
  RESPONSE=$(curl -s -X POST "$SUPABASE_URL/functions/v1/ai-reflection" \
    -H "Authorization: Bearer $ANON_KEY" \
    -H "Content-Type: application/json" \
    -d '{"originalText":"Test","tone":"spiritual","locale":"en"}')

  if echo "$RESPONSE" | grep -q "rewrittenText"; then
    print_success "AI reflection function working!"
  else
    print_error "AI reflection function test failed"
    echo "Response: $RESPONSE"
  fi

  print_success "Tests complete!"
}

# ============================================================================
# MAIN DEPLOYMENT FLOW
# ============================================================================

main() {
  PHASE=${1:-all}

  print_header "Asrāriya Backend Deployment"
  print_info "Phase: $PHASE"

  check_prerequisites

  case $PHASE in
    database)
      deploy_database
      ;;
    functions)
      deploy_functions
      test_deployment
      ;;
    cron)
      deploy_cron
      ;;
    all)
      deploy_database
      deploy_functions
      deploy_cron
      test_deployment
      print_success "🎉 Deployment Complete!"
      print_info "Next steps:"
      echo "  1. Update feature flags in config/featureFlags.ts"
      echo "  2. Deploy client: eas update --branch production"
      echo "  3. Monitor metrics (see BACKEND_MONITORING_QUERIES.sql)"
      ;;
    *)
      print_error "Invalid phase: $PHASE"
      print_info "Usage: ./scripts/deploy-backend.sh [database|functions|cron|all]"
      exit 1
      ;;
  esac
}

# Run main function
main "$@"
