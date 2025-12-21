# Logo Placeholder

Place your Asrār logo file here.

## Supported Formats
- `asrar-logo.png` (recommended)
- `asrar-logo.svg`
- `asrar-logo.jpg`

## Recommended Specifications
- Size: 512x512px or larger (square)
- Format: PNG with transparent background
- Content: Circular compass/star icon on purple background (#F0E6FF)

## Usage
Once you add the logo file, import it in your component:

```tsx
import logo from '@/assets/images/asrar-logo.png';

<ResponsiveAppHeader
  logoSource={logo}
  // ...other props
/>
```

The logo will automatically:
- Display in a 56x56px circle on mobile
- Scale to 67x67px on tablets
- Center within the purple circular background
- Maintain aspect ratio
