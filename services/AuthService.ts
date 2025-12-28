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
 * IMPORTANT: This requires backend setup
 * See implementation guide at end of file
 */

import { UserProfile } from '@/types/user-profile';
import * as SecureStore from 'expo-secure-store';

// ============================================================================
// CONFIGURATION
// ============================================================================

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

const SECURE_TOKEN_KEY = 'asrar.auth.token';
const SECURE_REFRESH_KEY = 'asrar.auth.refresh';

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
      throw new Error('Failed to refresh token');
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
      }),
    });
    
    const result = await response.json();
    
    if (!response.ok || !result.user) {
      return {
        session: null,
        error: {
          code: result.error_code || 'SIGNUP_FAILED',
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
    
    if (!response.ok || !result.user) {
      return {
        session: null,
        error: {
          code: result.error_code || 'SIGNIN_FAILED',
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
