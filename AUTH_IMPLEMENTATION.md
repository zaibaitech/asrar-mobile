# Authentication & Account System
**Implementation Guide**

## Overview
The app now features a dynamic header that adapts based on user authentication state:
- **Guest Mode** (default): Shows "Sign Up" button
- **Account Mode**: Shows "Profile" button

## Files Modified

### 1. `/app/auth.tsx` (NEW)
Complete authentication screen with:
- **Tab Switcher**: Sign Up / Sign In
- **Forms**: Email + Password with validation
- **Guest Option**: "Continue as Guest" button
- **Benefits Display**: Cloud sync, secure backup, premium features
- **Privacy Notice**: Encryption and security assurance

**Key Features**:
```tsx
- Password validation (min 6 chars)
- Password confirmation for sign up
- Loading states during auth operations
- Error handling with user-friendly alerts
- Auto-redirect to home after success
- Guest data migration messaging
```

### 2. `/app/(tabs)/index.tsx`
Updated home screen header with conditional rendering:

**Before**:
```tsx
<TouchableOpacity onPress={() => router.push('/profile')}>
  <Ionicons name="person-circle" size={28} color={DarkTheme.accent} />
</TouchableOpacity>
```

**After**:
```tsx
{profile?.mode === 'account' ? (
  // Account Mode: Show Profile Button
  <TouchableOpacity onPress={() => router.push('/profile')}>
    <Ionicons name="person-circle" size={28} color={DarkTheme.accent} />
  </TouchableOpacity>
) : (
  // Guest Mode: Show Sign Up Button
  <TouchableOpacity 
    onPress={() => router.push('/auth')}
    style={styles.signUpButton}
  >
    <Ionicons name="person-add" size={18} color="#fff" />
    <Text style={styles.signUpText}>Sign Up</Text>
  </TouchableOpacity>
)}
```

**New Styles**:
```tsx
signUpButton: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 6,
  backgroundColor: '#8B7355',  // Brand bronze
  paddingHorizontal: 12,
  paddingVertical: 6,
  borderRadius: 20,
},
signUpText: {
  fontSize: 14,
  fontWeight: '600',
  color: '#fff',
},
```

## User Flow

### New Users (Guest Mode)
1. App opens → Home screen shows "Sign Up" button
2. Tap "Sign Up" → Navigate to `/auth` screen
3. Choose:
   - **Sign Up Tab**: Create account with email/password
   - **Continue as Guest**: Skip to home (stays in guest mode)

### Account Creation
1. Enter email, password, confirm password
2. Tap "Create Account"
3. Loading spinner shows
4. Success → Alert + redirect to home
5. Header now shows Profile button (mode switched to 'account')
6. Guest data automatically migrated to account

### Returning Users
1. Tap "Sign In" tab
2. Enter email + password
3. Tap "Sign In"
4. Success → Profile button appears in header

### Guest to Account Migration
When a guest creates an account:
```
- All local data (profile, history, settings) preserved
- Profile.mode changes: 'guest' → 'account'
- Data syncs to cloud (if backend configured)
- No data loss, seamless transition
```

## Authentication States

### Profile Mode Check
```tsx
import { useProfile } from '@/contexts/ProfileContext';

const { profile } = useProfile();

// Check if user has account
if (profile?.mode === 'account') {
  // User signed in
} else {
  // Guest mode (default)
}
```

### Header Behavior
| Mode | Header Button | Icon | Action |
|------|--------------|------|--------|
| **guest** | "Sign Up" | person-add | Navigate to /auth |
| **account** | Profile icon | person-circle | Navigate to /profile |

## Backend Integration

### Required Environment Variables
```env
# Supabase Configuration (optional - for cloud sync)
EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Without Backend
- App works fully in guest mode
- Sign Up/Sign In buttons visible but show placeholder alerts
- All data stored locally via AsyncStorage
- No cloud sync (local-first approach)

### With Backend (Supabase)
- Full authentication via `/services/AuthService.ts`
- Cloud sync of profile data
- Cross-device access
- Secure token storage via expo-secure-store

## Styling & Design

### Sign Up Button
- **Color**: `#8B7355` (Brand bronze)
- **Shape**: Pill-shaped (borderRadius: 20)
- **Icon**: person-add (18px)
- **Text**: "Sign Up" (14px, semi-bold)
- **Padding**: 12px horizontal, 6px vertical

### Auth Screen
- **Background**: Dark gradient (`#0f172a` → `#1e1b4b` → `#1A1625`)
- **Layout**: Scrollable with keyboard avoidance
- **Forms**: Floating labels, icon-prefixed inputs
- **Buttons**: Bronze gradient for primary actions
- **Tabs**: Segmented control style

### Responsive Design
```tsx
- Tab switcher adapts to screen width
- Forms use KeyboardAvoidingView
- ScrollView with keyboardShouldPersistTaps="handled"
- Safe area insets respected (notch support)
```

## Privacy & Security

### Data Protection
- Passwords validated (min 6 chars)
- Tokens stored in expo-secure-store (encrypted)
- Privacy notice on auth screen
- Guest mode default (no forced sign-up)

### User Messaging
```
✓ "Your data is encrypted and secure"
✓ "We never share your personal information"
✓ "Continue as Guest" always available
✓ "Your guest data will be synced" (migration assurance)
```

## Testing Checklist

### Visual Tests
- [ ] Home screen shows "Sign Up" button for guests
- [ ] Home screen shows Profile icon for account users
- [ ] Auth screen tabs switch smoothly
- [ ] Forms display properly on all screen sizes
- [ ] Keyboard doesn't cover input fields

### Functional Tests
- [ ] "Sign Up" button navigates to /auth
- [ ] Tab switching works (Sign Up ↔ Sign In)
- [ ] Email validation works
- [ ] Password confirmation works
- [ ] "Continue as Guest" returns to home
- [ ] Loading spinner shows during auth
- [ ] Success alerts display correctly
- [ ] Header updates after sign in/up

### Edge Cases
- [ ] Empty form submission blocked
- [ ] Short password rejected
- [ ] Mismatched passwords rejected
- [ ] Network error handling
- [ ] Already registered email handling
- [ ] Invalid credentials handling

## Future Enhancements

### Planned Features
- [ ] Social sign-in (Google, Apple)
- [ ] Email verification flow
- [ ] Password reset/forgot functionality
- [ ] Profile picture upload
- [ ] Two-factor authentication (2FA)
- [ ] Biometric sign-in (Face ID, Touch ID)

### UX Improvements
- [ ] Remember me checkbox
- [ ] Auto-fill support
- [ ] Password strength indicator
- [ ] Email validation in real-time
- [ ] Animated transitions

## Code Snippets

### Check Auth State
```tsx
import { useProfile } from '@/contexts/ProfileContext';

function MyComponent() {
  const { profile } = useProfile();
  
  const isSignedIn = profile?.mode === 'account';
  
  return (
    <View>
      {isSignedIn ? (
        <Text>Welcome back, {profile.email}!</Text>
      ) : (
        <Text>You're in guest mode</Text>
      )}
    </View>
  );
}
```

### Navigate to Auth
```tsx
import { useRouter } from 'expo-router';

const router = useRouter();

// From any screen
<TouchableOpacity onPress={() => router.push('/auth')}>
  <Text>Sign Up</Text>
</TouchableOpacity>
```

### Sign Up Programmatically
```tsx
import { signUp } from '@/services/AuthService';

const handleSignUp = async () => {
  const result = await signUp({
    email: 'user@example.com',
    password: 'secure123',
  });
  
  if (result.session) {
    console.log('Signed up!', result.session.userId);
  } else {
    console.error('Error:', result.error?.message);
  }
};
```

## Summary

✅ **Implemented**:
- Dynamic header with auth-aware buttons
- Complete authentication screen (sign up/in)
- Guest mode support with "Continue as Guest"
- Profile mode detection (guest vs account)
- Form validation and error handling
- Privacy-first messaging

🎯 **User Experience**:
- No forced sign-up (guest mode default)
- One tap to create account from header
- Clear benefits messaging
- Seamless guest → account migration
- Beautiful dark-themed auth UI

🔒 **Security**:
- Password validation
- Secure token storage
- Error handling
- Privacy notice displayed
- Local-first architecture
