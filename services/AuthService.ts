/**
 * Authentication Service
 * ======================
 * Cloud sync and account management for User Profiles
 * 
 * Architecture:
 * - Supabase for backend (recommended)
 * - expo-secure-store for token storage
 * - Automatic sync on profile changes
 * 
 * Configuration:
 * - Email confirmation DISABLED for immediate access
 * - To disable in Supabase: Authentication → Settings → Email Auth → Uncheck "Enable email confirmations"
 * - Users can sign in immediately after signup (no email verification)
 * 
 * IMPORTANT: This requires backend setup
 * See implementation guide at end of file
 */

import { UserProfile } from '@/types/user-profile';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// ============================================================================
// CONFIGURATION
// ============================================================================

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export type AuthBackendPrereq = {
  configured: boolean;
  missing: string[];
};

export function getAuthBackendPrereq(): AuthBackendPrereq {
  const missing: string[] = [];

  if (!SUPABASE_URL) missing.push('EXPO_PUBLIC_SUPABASE_URL');
  if (!SUPABASE_ANON_KEY) missing.push('EXPO_PUBLIC_SUPABASE_ANON_KEY');

  const configured = missing.length === 0;

  if (__DEV__) {
    console.log('[AuthService] Backend prereq:', {
      configured,
      missing,
      hasUrl: !!SUPABASE_URL,
      hasAnonKey: !!SUPABASE_ANON_KEY,
    });
  }

  return { configured, missing };
}

async function fetchWithTimeout(
  url: string,
  init: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }
}

async function deleteUserViaEdgeFunction(session: AuthSession): Promise<{ ok: boolean; error: AuthError | null }> {
  // This requires a deployed Supabase Edge Function at: /functions/v1/delete-user
  // The function must run with the SERVICE_ROLE key (server-side) and verify the caller.
  try {
    const response = await fetch(`${SUPABASE_URL}/functions/v1/delete-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ confirm: true }),
    });

    const text = await response.text();

    if (__DEV__) {
      console.log('[AuthService] delete-user function response:', {
        ok: response.ok,
        status: response.status,
        body: text?.slice(0, 300),
      });
    }

    if (!response.ok) {
      let message = text || 'Account deletion failed';
      try {
        const parsed = JSON.parse(text);
        message = parsed?.message || parsed?.error || message;
      } catch {
        // keep raw text
      }

      return {
        ok: false,
        error: {
          code: 'DELETE_FAILED',
          message,
        },
      };
    }

    return { ok: true, error: null };
  } catch (error) {
    return {
      ok: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network error',
      },
    };
  }
}

export async function checkAuthBackendHealth(options?: {
  timeoutMs?: number;
}): Promise<{ ok: boolean; status?: number; error: AuthError | null }> {
  const timeoutMs = options?.timeoutMs ?? 6000;
  const prereq = getAuthBackendPrereq();

  if (!prereq.configured) {
    return {
      ok: false,
      error: {
        code: 'NOT_CONFIGURED',
        message: `Missing environment variables: ${prereq.missing.join(', ')}`,
      },
    };
  }

  // Prefer the GoTrue /health endpoint if present.
  const healthUrl = `${SUPABASE_URL}/auth/v1/health`;

  try {
    const response = await fetchWithTimeout(
      healthUrl,
      {
        method: 'GET',
        headers: {
          apikey: SUPABASE_ANON_KEY,
        },
      },
      timeoutMs
    );

    if (__DEV__) {
      console.log('[AuthService] Backend health response:', {
        url: '/auth/v1/health',
        ok: response.ok,
        status: response.status,
      });
    }

    // If we got an HTTP response at all, the backend is reachable.
    // Consider 2xx-4xx as reachable; 5xx likely indicates server-side trouble.
    if (response.status >= 200 && response.status < 500) {
      return { ok: true, status: response.status, error: null };
    }

    const body = await response.text();
    return {
      ok: false,
      status: response.status,
      error: {
        code: 'HEALTH_CHECK_FAILED',
        message: body || `Health check failed (${response.status})`,
      },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Network error';
    const isTimeout = typeof message === 'string' && message.toLowerCase().includes('aborted');

    if (__DEV__) {
      console.error('[AuthService] Backend health check error:', {
        code: isTimeout ? 'TIMEOUT' : 'NETWORK_ERROR',
        message,
      });
    }

    return {
      ok: false,
      error: {
        code: isTimeout ? 'TIMEOUT' : 'NETWORK_ERROR',
        message: isTimeout ? 'Health check timed out' : message,
      },
    };
  }
}

const SECURE_TOKEN_KEY = 'asrar.auth.token';
const SECURE_REFRESH_KEY = 'asrar.auth.refresh';

// Sends a new confirmation email when Supabase reports an existing user
async function resendEmailConfirmation(email: string): Promise<void> {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    return;
  }

  try {
    await fetch(`${SUPABASE_URL}/auth/v1/resend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        type: 'signup',
        email,
        options: {
          emailRedirectTo: 'asrariya://auth/callback',
        },
      }),
    });
  } catch (error) {
    if (__DEV__) {
      console.error('[AuthService] Resend confirmation error:', error);
    }
  }
}

// ============================================================================
// TYPES
// ============================================================================

export interface AuthSession {
  userId: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

export interface AuthError {
  code: string;
  message: string;
}

export interface SignUpData {
  email: string;
  password: string;
  profile?: Partial<UserProfile>;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthCallbackParams {
  access_token?: string;
  refresh_token?: string;
  expires_in?: string | number;
  token_type?: string;
  type?: string;
  error?: string;
  error_description?: string;
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

export async function getSession(): Promise<AuthSession | null> {
  try {
    const tokenJson = await SecureStore.getItemAsync(SECURE_TOKEN_KEY);
    
    if (!tokenJson) {
      return null;
    }
    
    const session: AuthSession = JSON.parse(tokenJson);
    
    if (session.expiresAt < Date.now()) {
      return await refreshSession(session.refreshToken);
    }
    
    return session;
    
  } catch (error) {
    if (__DEV__) {
      console.error('[AuthService] Error getting session:', error);
    }
    return null;
  }
}

async function saveSession(session: AuthSession): Promise<void> {
  try {
    await SecureStore.setItemAsync(SECURE_TOKEN_KEY, JSON.stringify(session));
  } catch (error) {
    if (__DEV__) {
      console.error('[AuthService] Error saving session:', error);
    }
    throw error;
  }
}

async function clearSession(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(SECURE_TOKEN_KEY);
    await SecureStore.deleteItemAsync(SECURE_REFRESH_KEY);
  } catch (error) {
    if (__DEV__) {
      console.error('[AuthService] Error clearing session:', error);
    }
  }
}

async function refreshSession(refreshToken: string): Promise<AuthSession | null> {
  try {
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      if (__DEV__) {
        console.error('[AuthService] Refresh token failed:', response.status, errorData);
      }
      throw new Error(`Failed to refresh token: ${response.status}`);
    }
    
    const data = await response.json();
    
    const newSession: AuthSession = {
      userId: data.user.id,
      email: data.user.email,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      expiresAt: Date.now() + (data.expires_in * 1000),
    };
    
    await saveSession(newSession);
    
    return newSession;
    
  } catch (error) {
    if (__DEV__) {
      console.error('[AuthService] Error refreshing session:', error);
    }
    
    await clearSession();
    return null;
  }
}

// ============================================================================
// PASSWORD RESET / RECOVERY
// ============================================================================

export async function requestPasswordReset(email: string): Promise<{
  success: boolean;
  error: AuthError | null;
}> {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return {
        success: false,
        error: {
          code: 'NOT_CONFIGURED',
          message: 'Password reset is not available. Backend not configured.',
        },
      };
    }

    const redirectTo = 'asrariya://auth/callback';
    const url = `${SUPABASE_URL}/auth/v1/recover?redirect_to=${encodeURIComponent(redirectTo)}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const text = await response.text();
      return {
        success: false,
        error: {
          code: 'RESET_FAILED',
          message: text || 'Failed to send reset email',
        },
      };
    }

    return { success: true, error: null };
  } catch (error) {
    if (__DEV__) {
      console.error('[AuthService] Password reset request error:', error);
    }

    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network error',
      },
    };
  }
}

export async function updatePassword(newPassword: string): Promise<{
  success: boolean;
  error: AuthError | null;
}> {
  try {
    const session = await getSession();

    if (!session) {
      return {
        success: false,
        error: {
          code: 'NOT_AUTHENTICATED',
          message: 'No active session. Please open the reset link again.',
        },
      };
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return {
        success: false,
        error: {
          code: 'NOT_CONFIGURED',
          message: 'Backend not configured',
        },
      };
    }

    const response = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({ password: newPassword }),
    });

    if (!response.ok) {
      const err = await response.text();
      return {
        success: false,
        error: {
          code: 'UPDATE_PASSWORD_FAILED',
          message: err || 'Failed to update password',
        },
      };
    }

    return { success: true, error: null };
  } catch (error) {
    if (__DEV__) {
      console.error('[AuthService] Update password error:', error);
    }

    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network error',
      },
    };
  }
}

/**
 * Used for Supabase recovery links (type=recovery) to hydrate a session
 * and persist it in SecureStore so the app can call updatePassword().
 */
export async function handleAuthCallback(params: AuthCallbackParams): Promise<{
  session: AuthSession | null;
  error: AuthError | null;
}> {
  try {
    if (params.error) {
      return {
        session: null,
        error: {
          code: params.error,
          message: params.error_description || params.error,
        },
      };
    }

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return {
        session: null,
        error: {
          code: 'NOT_CONFIGURED',
          message: 'Backend not configured',
        },
      };
    }

    const accessToken = params.access_token;
    const refreshToken = params.refresh_token;
    const expiresInRaw = params.expires_in;
    const expiresIn = typeof expiresInRaw === 'string' ? parseInt(expiresInRaw, 10) : (expiresInRaw ?? 3600);

    if (!accessToken || !refreshToken) {
      return {
        session: null,
        error: {
          code: 'INVALID_CALLBACK',
          message: 'Missing auth tokens in callback',
        },
      };
    }

    const userResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'apikey': SUPABASE_ANON_KEY,
      },
    });

    if (!userResponse.ok) {
      const text = await userResponse.text();
      return {
        session: null,
        error: {
          code: 'INVALID_SESSION',
          message: text || 'Failed to load user from callback token',
        },
      };
    }

    const userData = await userResponse.json();

    const session: AuthSession = {
      userId: userData.id,
      email: userData.email,
      accessToken,
      refreshToken,
      expiresAt: Date.now() + (expiresIn * 1000),
    };

    await saveSession(session);
    return { session, error: null };
  } catch (error) {
    if (__DEV__) {
      console.error('[AuthService] Auth callback handling error:', error);
    }

    return {
      session: null,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network error',
      },
    };
  }
}

// ============================================================================
// AUTHENTICATION
// ============================================================================

export async function signUp(data: SignUpData): Promise<{
  session: AuthSession | null;
  error: AuthError | null;
}> {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return {
        session: null,
        error: {
          code: 'NOT_CONFIGURED',
          message: 'Account creation is not available. Backend not configured. Please continue as Guest.',
        },
      };
    }
    
    const response = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
        data: data.profile || {},
        options: {
          emailRedirectTo: 'asrariya://auth/callback',
        },
      }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      const errorCode = result.error_code || '';
      const errorMessage = result.error_description || result.message || '';

      if (errorCode === 'email_exists' || errorMessage === 'User already registered') {
        return {
          session: null,
          error: {
            code: 'EMAIL_EXISTS',
            message: 'This email is already registered. Please sign in instead.',
          },
        };
      }

      return {
        session: null,
        error: {
          code: errorCode || 'SIGNUP_FAILED',
          message: errorMessage || 'Sign up failed',
        },
      };
    }
    
    // Skip email confirmation if backend is configured to auto-confirm
    // Note: To disable email confirmation, go to Supabase Dashboard:
    // Authentication → Settings → Email Auth → Uncheck "Enable email confirmations"
    
    // Check if email confirmation is required (old behavior - disabled)
    // if (result.user && !result.access_token) {
    //   return {
    //     session: null,
    //     error: {
    //       code: 'EMAIL_CONFIRMATION_REQUIRED',
    //       message: 'Please check your email to confirm your account before signing in.',
    //     },
    //   };
    // }
    
    // If backend returns no session tokens (e.g., email confirmation is enabled),
    // try an immediate password sign-in. With email confirmation disabled, this
    // will succeed and keep the flow entirely in-app.
    if (result.user && (!result.access_token || !result.refresh_token)) {
      return await signIn({ email: data.email, password: data.password });
    }

    // Ensure we have all required session data
    if (!result.user || !result.access_token || !result.refresh_token) {
      return {
        session: null,
        error: {
          code: 'SIGNUP_FAILED',
          message: result.error_description || result.message || 'Sign up failed',
        },
      };
    }
    
    const session: AuthSession = {
      userId: result.user.id,
      email: result.user.email,
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      expiresAt: Date.now() + (result.expires_in * 1000),
    };
    
    await saveSession(session);
    
    return { session, error: null };
    
  } catch (error) {
    if (__DEV__) {
      console.error('[AuthService] Sign up error:', error);
    }
    
    return {
      session: null,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network error',
      },
    };
  }
}

export async function signIn(data: SignInData): Promise<{
  session: AuthSession | null;
  error: AuthError | null;
}> {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return {
        session: null,
        error: {
          code: 'NOT_CONFIGURED',
          message: 'Sign in is not available. Backend not configured. Please continue as Guest.',
        },
      };
    }
    
    const response = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      const errorCode = result.error_code || '';
      const errorMessage = result.error_description || result.message || '';

      if (errorCode === 'email_not_confirmed' || errorMessage === 'Email not confirmed') {
        await resendEmailConfirmation(data.email);
        return {
          session: null,
          error: {
            code: 'EMAIL_CONFIRMATION_REQUIRED',
            message: 'Please confirm your email address before signing in. We have sent another link to your inbox.',
          },
        };
      }

      return {
        session: null,
        error: {
          code: errorCode || 'SIGNIN_FAILED',
          message: errorMessage || 'Sign in failed',
        },
      };
    }
    
    // Check if email confirmation is required
    if (result.user && !result.access_token) {
      return {
        session: null,
        error: {
          code: 'EMAIL_CONFIRMATION_REQUIRED',
          message: 'Please check your email and confirm your account before signing in.',
        },
      };
    }
    
    // Ensure we have all required session data
    if (!result.user || !result.access_token || !result.refresh_token) {
      return {
        session: null,
        error: {
          code: 'SIGNIN_FAILED',
          message: result.error_description || result.message || 'Sign in failed',
        },
      };
    }
    
    const session: AuthSession = {
      userId: result.user.id,
      email: result.user.email,
      accessToken: result.access_token,
      refreshToken: result.refresh_token,
      expiresAt: Date.now() + (result.expires_in * 1000),
    };
    
    await saveSession(session);
    
    return { session, error: null };
    
  } catch (error) {
    if (__DEV__) {
      console.error('[AuthService] Sign in error:', error);
    }
    
    return {
      session: null,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network error',
      },
    };
  }
}

export async function signOut(): Promise<void> {
  try {
    const session = await getSession();
    
    if (session && SUPABASE_URL && SUPABASE_ANON_KEY) {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'apikey': SUPABASE_ANON_KEY,
        },
      });
    }
    
  } catch (error) {
    if (__DEV__) {
      console.error('[AuthService] Sign out error:', error);
    }
  } finally {
    await clearSession();
  }
}

/**
 * Clear all user-specific data from local storage
 * Call this on sign out to ensure the next user doesn't see previous user's data
 * 
 * Clears:
 * - User profile
 * - Divine timing check-ins and streaks
 * - Istikhara sessions and history
 * - Dhikr counter
 * - AI guidance history
 * - Quran bookmarks and progress
 * 
 * Does NOT clear:
 * - Language preference (app setting, not user data)
 * - Notification preferences (device setting)
 * - Theme preference
 */
export async function clearAllUserData(): Promise<void> {
  const USER_DATA_KEYS = [
    // Profile
    'asrar.profile.v1',
    
    // Divine Timing
    'dt_checkins_v1',
    'dt_streak_v1',
    'divine_timing_verse_mode',
    'divine_timing_manual_verse',
    'divine_timing_guidance_history',
    'divine_timing_guidance_prefs',
    
    // Istikhara
    'guided_istikhara_sessions_v1',
    'istikhara_history',
    
    // Dhikr
    '@asrar_dhikr_count',
    
    // Quran
    'quran_bookmarks',
    'quran_progress',
    
    // Check-in storage
    'asrar_check_in_storage_v1',
    'asrar_user_timing_profile_v1',
  ];

  try {
    await AsyncStorage.multiRemove(USER_DATA_KEYS);
    
    if (__DEV__) {
      console.log('[AuthService] All user data cleared');
    }
  } catch (error) {
    if (__DEV__) {
      console.error('[AuthService] Error clearing user data:', error);
    }
  }
}

/**
 * Delete user account permanently
 * Requires password confirmation for security
 * 
 * IMPORTANT: Requires Supabase RLS policy:
 * CREATE POLICY "Users can delete own account"
 *   ON auth.users FOR DELETE USING (auth.uid() = id);
 */
export async function deleteAccount(password: string): Promise<{
  success: boolean;
  error: AuthError | null;
}> {
  try {
    const session = await getSession();
    
    if (!session) {
      return {
        success: false,
        error: {
          code: 'NOT_AUTHENTICATED',
          message: 'You must be signed in to delete your account',
        },
      };
    }
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      return {
        success: false,
        error: {
          code: 'NOT_CONFIGURED',
          message: 'Backend not configured',
        },
      };
    }
    
    // Step 1: Verify password before deletion (security measure)
    const verifyResponse = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        email: session.email,
        password: password,
      }),
    });
    
    if (!verifyResponse.ok) {
      return {
        success: false,
        error: {
          code: 'INVALID_PASSWORD',
          message: 'Incorrect password. Please try again.',
        },
      };
    }

    // Step 2: Best-effort delete of user's profile row (if present)
    // This requires an RLS policy allowing users to delete their own row.
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/profiles?user_id=eq.${session.userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'apikey': SUPABASE_ANON_KEY,
        },
      });
    } catch (error) {
      if (__DEV__) {
        console.error('[AuthService] Failed to delete profiles row (non-fatal):', error);
      }
    }
    
    // Step 3: Delete auth user
    // Note: Depending on Supabase/GoTrue configuration, this may be denied.
    const deleteResponse = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${session.accessToken}`,
        'apikey': SUPABASE_ANON_KEY,
      },
    });
    
    if (!deleteResponse.ok) {
      const text = await deleteResponse.text();
      let message = 'Failed to delete account. Please contact support.';

      try {
        const parsed = JSON.parse(text);
        message = parsed?.msg || parsed?.message || message;
      } catch {
        if (text) message = text;
      }

      // If self-delete is not allowed by your Supabase/GoTrue configuration,
      // fall back to a server-side Edge Function.
      if (deleteResponse.status === 401 || deleteResponse.status === 403 || deleteResponse.status === 404 || deleteResponse.status === 405) {
        if (__DEV__) {
          console.log('[AuthService] Direct deletion not allowed (status: ' + deleteResponse.status + '), trying Edge Function fallback...');
        }
        
        const fallback = await deleteUserViaEdgeFunction(session);
        if (fallback.ok) {
          await clearSession();
          if (__DEV__) {
            console.log('[AuthService] Account deleted successfully via Edge Function');
          }
          return { success: true, error: null };
        }

        if (__DEV__) {
          console.error('[AuthService] Edge Function fallback also failed:', fallback.error);
        }

        return {
          success: false,
          error: {
            code: 'DELETE_NOT_ALLOWED',
            message:
              fallback.error?.message ||
              'Account deletion is not enabled on the backend yet. Please deploy the delete-user Edge Function.',
          },
        };
      }

      // For other errors, log them
      if (__DEV__) {
        console.error('[AuthService] Auth user deletion failed:', {
          status: deleteResponse.status,
          body: text?.slice(0, 300),
        });
      }

      return {
        success: false,
        error: {
          code: deleteResponse.status === 401 || deleteResponse.status === 403 ? 'DELETE_NOT_ALLOWED' : 'DELETE_FAILED',
          message,
        },
      };
    }
    
    // Step 3: Clear local session
    await clearSession();
    
    if (__DEV__) {
      console.log('[AuthService] Account deleted successfully');
    }
    
    return { success: true, error: null };
    
  } catch (error) {
    if (__DEV__) {
      console.error('[AuthService] Delete account error:', error);
    }
    
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network error. Please try again.',
      },
    };
  }
}

// ============================================================================
// PROFILE SYNC
// ============================================================================

export async function syncProfileToCloud(profile: UserProfile): Promise<{
  success: boolean;
  error: AuthError | null;
}> {
  try {
    const session = await getSession();
    
    if (!session) {
      return {
        success: false,
        error: { code: 'NOT_AUTHENTICATED', message: 'User not signed in' },
      };
    }
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Supabase not configured');
    }
    
    const response = await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.accessToken}`,
        'apikey': SUPABASE_ANON_KEY,
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify({
        user_id: session.userId,
        profile_data: profile,
        updated_at: new Date().toISOString(),
      }),
    });
    
    if (!response.ok) {
      const error = await response.json();
      return {
        success: false,
        error: {
          code: 'SYNC_FAILED',
          message: error.message || 'Failed to sync profile',
        },
      };
    }
    
    return { success: true, error: null };
    
  } catch (error) {
    if (__DEV__) {
      console.error('[AuthService] Sync error:', error);
    }
    
    return {
      success: false,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network error',
      },
    };
  }
}

export async function loadProfileFromCloud(): Promise<{
  profile: UserProfile | null;
  error: AuthError | null;
}> {
  try {
    const session = await getSession();
    
    if (!session) {
      return {
        profile: null,
        error: { code: 'NOT_AUTHENTICATED', message: 'User not signed in' },
      };
    }
    
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Supabase not configured');
    }
    
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?user_id=eq.${session.userId}&select=*`,
      {
        headers: {
          'Authorization': `Bearer ${session.accessToken}`,
          'apikey': SUPABASE_ANON_KEY,
        },
      }
    );
    
    if (!response.ok) {
      const error = await response.json();
      return {
        profile: null,
        error: {
          code: 'LOAD_FAILED',
          message: error.message || 'Failed to load profile',
        },
      };
    }
    
    const data = await response.json();
    
    if (data.length === 0) {
      return { profile: null, error: null };
    }
    
    const profileData = data[0].profile_data as UserProfile;
    
    return { profile: profileData, error: null };
    
  } catch (error) {
    if (__DEV__) {
      console.error('[AuthService] Load error:', error);
    }
    
    return {
      profile: null,
      error: {
        code: 'NETWORK_ERROR',
        message: error instanceof Error ? error.message : 'Network error',
      },
    };
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return session !== null;
}

export async function getCurrentUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.userId || null;
}

/**
 * BACKEND SETUP INSTRUCTIONS
 * ===========================
 * 
 * 1. Install expo-secure-store:
 *    npx expo install expo-secure-store
 * 
 * 2. Create Supabase Project at https://supabase.com
 * 
 * 3. Create Profiles Table:
 *    CREATE TABLE profiles (
 *      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
 *      profile_data JSONB NOT NULL,
 *      created_at TIMESTAMPTZ DEFAULT NOW(),
 *      updated_at TIMESTAMPTZ DEFAULT NOW(),
 *      UNIQUE(user_id)
 *    );
 *    
 *    ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
 *    
 *    CREATE POLICY "Users can view own profile"
 *      ON profiles FOR SELECT USING (auth.uid() = user_id);
 *    CREATE POLICY "Users can insert own profile"
 *      ON profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
 *    CREATE POLICY "Users can update own profile"
 *      ON profiles FOR UPDATE USING (auth.uid() = user_id);
 * 
 * 4. Add to .env:
 *    EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
 *    EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
 */
