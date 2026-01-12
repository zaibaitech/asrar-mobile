# Account Deletion (Supabase Edge Function)

## Why this is needed

On some Supabase/GoTrue configurations, the client-side endpoint `DELETE /auth/v1/user` may return `401/403/404` and **won’t allow self-deleting** the auth user from a mobile app.

To ensure account deletion happens both:
- **in-app** (clears local profile/session)
- **in-backend** (removes `auth.users` and optionally `public.profiles`)

…we provide an Edge Function fallback: `delete-user`.

The app will automatically try:
1) `DELETE /auth/v1/user` (self-delete)
2) if denied, `POST /functions/v1/delete-user` (Edge Function)

## Deploy

1. Install Supabase CLI

2. Link your project

3. Set secrets (server-side only):

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

Example:

- `supabase secrets set SUPABASE_URL="https://YOUR_PROJECT.supabase.co" SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"`

4. Deploy the function:

- `supabase functions deploy delete-user`

## Function code

- [supabase/functions/delete-user/index.ts](supabase/functions/delete-user/index.ts)

## Client behavior

- If deletion is denied, the UI will show `DELETE_NOT_ALLOWED` and instruct to deploy the function.

## Security notes

- Never put `SUPABASE_SERVICE_ROLE_KEY` in `.env` for Expo.
- Edge Functions run server-side; keep service role secrets only in Supabase secrets.
