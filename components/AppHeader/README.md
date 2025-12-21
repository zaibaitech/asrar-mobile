# AppHeader Component

A fully responsive, accessible header component for the Asrār Everyday mobile app.

## Features

- ✅ Responsive design (mobile & tablet)
- ✅ Language switcher (EN/FR)
- ✅ Profile, Clock, and Menu navigation
- ✅ Accessibility compliant (WCAG)
- ✅ Touch feedback and animations
- ✅ Logo placeholder (easy to swap)
- ✅ TypeScript support
- ✅ React Navigation integration

## Components

### ResponsiveAppHeader (Recommended)
Auto-switches between mobile and tablet layouts based on screen width.

```tsx
import ResponsiveAppHeader from '@/components/AppHeader';

<ResponsiveAppHeader
  currentLanguage="EN"
  onLanguageChange={(lang) => setLanguage(lang)}
  onProfilePress={() => navigation.navigate('Profile')}
  onClockPress={() => navigation.navigate('DivineTiming')}
  onMenuPress={() => navigation.openDrawer()}
/>
```

### AppHeader
Mobile-only header (< 768px optimized).

### AppHeaderTablet
Tablet-only header (>= 768px optimized, 1.2x scale).

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `currentLanguage` | `'EN' \| 'FR'` | Yes | - | Active language |
| `onLanguageChange` | `(lang: 'EN' \| 'FR') => void` | Yes | - | Language change handler |
| `onProfilePress` | `() => void` | Yes | - | Profile icon press handler |
| `onClockPress` | `() => void` | Yes | - | Clock icon press handler |
| `onMenuPress` | `() => void` | Yes | - | Menu icon press handler |
| `logoSource` | `ImageSourcePropType` | No | - | Custom logo image |
| `showLanguageSelector` | `boolean` | No | `true` | Show/hide language buttons |
| `backgroundColor` | `string` | No | `'#FFFFFF'` | Header background color |

## Usage Examples

### With React Navigation

```tsx
// In your tab layout
import { Tabs } from 'expo-router';
import ResponsiveAppHeader from '@/components/AppHeader';
import { useLanguage } from '@/contexts/LanguageContext';

function CustomHeader() {
  const { language, setLanguage } = useLanguage();
  const router = useRouter();

  return (
    <ResponsiveAppHeader
      currentLanguage={language === 'en' ? 'EN' : 'FR'}
      onLanguageChange={(lang) => setLanguage(lang.toLowerCase())}
      onProfilePress={() => router.push('/profile')}
      onClockPress={() => router.push('/divine-timing')}
      onMenuPress={() => router.push('/menu')}
    />
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        header: () => <CustomHeader />,
      }}>
      {/* Your screens */}
    </Tabs>
  );
}
```

### With Custom Logo

```tsx
import logo from '@/assets/images/asrar-logo.png';

<ResponsiveAppHeader
  logoSource={logo}
  {/* ...other props */}
/>
```

### Without Language Selector

```tsx
<ResponsiveAppHeader
  showLanguageSelector={false}
  {/* ...other props */}
/>
```

### Custom Background

```tsx
<ResponsiveAppHeader
  backgroundColor="#F9FAFB"
  {/* ...other props */}
/>
```

## Responsive Behavior

### Mobile (< 350px)
- Logo: 48x48px
- App name: 24px
- Clock icon: Hidden
- Essential elements only

### Mobile (350px - 767px)
- Logo: 56x56px (default)
- App name: 30px
- All elements visible

### Tablet (>= 768px)
- All elements scaled 1.2x
- Increased padding (24px)
- Logo: 67x67px
- App name: 36px

## Accessibility

All interactive elements include:
- `accessibilityLabel`: Clear description
- `accessibilityRole`: Proper role (button)
- `accessibilityHint`: Action description
- `accessibilityState`: Current state (for language buttons)

## Styling

The header uses a clean, modern design:
- Height: 80px (mobile), 96px (tablet)
- Shadow/elevation for depth
- Circular icon buttons
- Purple accent color (#6B21A8)
- White background (customizable)

## Integration with Language Context

```tsx
import { useLanguage } from '@/contexts/LanguageContext';

function MyScreen() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <ResponsiveAppHeader
      currentLanguage={language.toUpperCase() as 'EN' | 'FR'}
      onLanguageChange={(lang) => setLanguage(lang.toLowerCase())}
      {/* ...other handlers */}
    />
  );
}
```

## File Structure

```
components/AppHeader/
├── index.ts                      # Exports
├── AppHeader.tsx                 # Mobile component
├── AppHeaderTablet.tsx           # Tablet component
└── ResponsiveAppHeader.tsx       # Auto-switching wrapper
```

## Adding Your Logo

1. Add logo image to `assets/images/asrar-logo.png`
2. Import in your component:
   ```tsx
   import logo from '@/assets/images/asrar-logo.png';
   ```
3. Pass to header:
   ```tsx
   <ResponsiveAppHeader logoSource={logo} {...props} />
   ```

The logo will automatically:
- Center within circular container
- Scale appropriately for mobile/tablet
- Maintain aspect ratio
- Display with purple background (#F0E6FF)

## Testing

✅ Displays correctly on all screen sizes  
✅ Language switching updates app-wide  
✅ All icons touchable with feedback  
✅ Profile navigation works  
✅ Menu opens drawer  
✅ Clock navigates to timing features  
✅ Logo placeholder renders  
✅ Logo swap works when provided  
✅ Accessibility labels work with screen readers  
✅ Works on iOS and Android  
✅ Safe area insets respected

## Support

For issues or questions, refer to the integration example file:
`components/AppHeaderIntegration.example.tsx`
