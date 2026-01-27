# Supabase Edge Functions

This directory contains Deno-based Edge Functions that run on Supabase infrastructure.

## Configuration

- **Runtime**: Deno (not Node.js)
- **TypeScript**: Uses Deno's built-in TypeScript support
- **Config**: See `deno.json` for Deno-specific settings

## Why TypeScript Errors Are Expected

If you see TypeScript errors in your IDE:
- ✅ This is normal - these files use Deno APIs (not Node.js)
- ✅ The main `tsconfig.json` excludes this directory
- ✅ Deno will validate these files during deployment

## Functions

- **ephemeris/** - Planetary position caching with NASA Horizons API
- **ai-reflection/** - Secure Groq API wrapper
- **precompute-ephemeris/** - Pre-computation cron job

## Deployment

```bash
# Deploy all functions
supabase functions deploy ephemeris
supabase functions deploy ai-reflection
supabase functions deploy precompute-ephemeris
```

## Testing Locally

```bash
# Requires Supabase CLI with Deno support
supabase functions serve ephemeris
```
