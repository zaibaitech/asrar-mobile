// Supabase Edge Function: delete-user
// ------------------------------------------------------------
// Purpose:
// - Allow an authenticated user to delete their own account.
// - Runs server-side with SERVICE_ROLE key (never exposed to the app).
//
// Deploy:
//   supabase functions deploy delete-user
//
// Required secrets:
//   supabase secrets set SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=...
//
// Call from app:
//   POST {SUPABASE_URL}/functions/v1/delete-user
//   Authorization: Bearer <user_access_token>
//   apikey: <anon_key>
//
// Notes:
// - This function deletes BOTH:
//   1) public.profiles row for the caller (best-effort)
//   2) auth user for the caller (admin delete)
//
// Deno runtime
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.6'

Deno.serve(async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ message: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !serviceRoleKey) {
      return new Response(JSON.stringify({ message: 'Missing server configuration' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const authHeader = req.headers.get('Authorization') || ''
    const jwt = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

    if (!jwt) {
      return new Response(JSON.stringify({ message: 'Missing Authorization header' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Admin client
    const admin = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })

    // Identify caller via their JWT
    const {
      data: { user },
      error: userError,
    } = await admin.auth.getUser(jwt)

    if (userError || !user) {
      return new Response(JSON.stringify({ message: 'Invalid session' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // Best-effort: delete profile row
    try {
      await admin.from('profiles').delete().eq('user_id', user.id)
    } catch {
      // non-fatal
    }

    const { error: deleteError } = await admin.auth.admin.deleteUser(user.id)
    if (deleteError) {
      return new Response(JSON.stringify({ message: deleteError.message }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ message: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
})
