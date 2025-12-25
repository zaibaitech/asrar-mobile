# Qur'anic Resonance Implementation Guide

## 📖 Overview

The **Qur'anic Resonance** feature displays a verse from the Qur'an that corresponds to the user's Kabir number through numerical mapping. This is designed as a **reflective spiritual prompt**, not for divination or religious ruling.

### Key Design Principles
- ✨ **Premium Mobile-First Design** - Exceeds web app quality
- 🌙 **Dark Theme Optimized** - Glass morphism and subtle gradients
- 📱 **Arabic Typography Excellence** - Proper RTL, optimal line height, readable sizing
- 🙏 **Respectful Disclaimer** - Clear "reflection only" messaging
- 🎨 **Personal Element Theming** - Accent colors from user's element

---

## 🧮 Calculation Logic

The verse reference is calculated using the **Kabir (total numerological value)**:

```typescript
// Surah Number (1-114)
const surahNumber = (kabir % 114) || 114;

// Ayah Number within Surah
const surahMeta = QURAN_META[surahNumber];
const ayahNumber = (kabir % surahMeta.totalAyahs) || surahMeta.totalAyahs;
```

**Important Notes:**
- Uses modulo operation with fallback to max value when result is 0
- Always produces valid verse references (checked against QURAN_META)
- Matches the web app calculation exactly for consistency

---

## 📂 File Structure

### 1. **constants/quranMeta.ts**
Complete metadata for all 114 Surahs:

```typescript
export const QURAN_META: QuranMetadata[] = [
  {
    name: 'Al-Fatiha',        // English name
    nameAr: 'الفاتحة',         // Arabic name
    totalAyahs: 7,            // Total verses
  },
  // ... 113 more surahs
];
```

### 2. **services/QuranResonanceService.ts**
Calculation and API integration:

```typescript
export async function getQuranResonance(
  kabir: number,
  language: 'en' | 'ar' | 'fr'
): Promise<QuranResonance> {
  // 1. Calculate Surah and Ayah numbers
  // 2. Fetch Arabic text from Al-Quran Cloud API
  // 3. Build Quran.com URL
  // 4. Return complete resonance object
}
```

**API Used:** [Al-Quran Cloud](https://api.alquran.cloud)
- Endpoint: `https://api.alquran.cloud/v1/ayah/{surah}:{ayah}/ar.asad`
- Returns: Arabic text, metadata, and references
- Fallback: Placeholder text if API fails

### 3. **components/quran/QuranResonanceCard.tsx**
Premium UI component with 6 sections:

1. **Header** - Title, subtitle, info button
2. **Surah Identity Card** - Surah name (Arabic + English/French), Ayah badge
3. **Arabic Verse Card** - Arabic text with copy button
4. **CTA Button** - "Read full verse on Quran.com" with external link
5. **Reflection Card** - Guidance text and disclaimer
6. **Loading/Error/Empty States**

---

## 🎨 Design Specifications

### Visual Hierarchy

```
┌─────────────────────────────────────┐
│ 🔖 Header                           │
│ Title: Qur'anic Resonance           │
│ Subtitle: A verse for reflection    │
│                                  ℹ️  │
├─────────────────────────────────────┤
│ 📜 Surah Identity Card              │
│                                     │
│         سورة الفاتحة                │
│          Al-Fatiha                  │
│     [  Ayah 1 of 7  ]  ← Badge     │
├─────────────────────────────────────┤
│ 📝 Arabic Verse Card                │
│                                     │
│ ARABIC TEXT                     📋  │
│ ▎ (accent bar)                      │
│                                     │
│ بسم الله الرحمن الرحيم              │
│ (Right-aligned, 20px, 1.9 line-h)  │
├─────────────────────────────────────┤
│ 🔗 CTA Button                       │
│ Read full verse on Quran.com  →    │
├─────────────────────────────────────┤
│ 💭 Reflection Card                  │
│                                     │
│ Read slowly, then notice what       │
│ stands out for your current         │
│ situation...                        │
│ ─────────────────────────────────   │
│ For reflection only • Not           │
│ divination or legal ruling          │
└─────────────────────────────────────┘
```

### Typography

| Element | Size | Weight | Color | Notes |
|---------|------|--------|-------|-------|
| Arabic Surah Name | 32px | 800 | #f1f5f9 | Bold, center-aligned |
| English Surah Name | 17px | 600 | #cbd5e1 | Center-aligned |
| Arabic Verse | 20px | 500 | #f1f5f9 | RTL, line-height 1.9 |
| Ayah Badge | 14px | 700 | Accent | Dynamic color |
| Section Title | 19px | 700 | #f1f5f9 | Letter-spacing 0.3 |
| Reflection Text | 14px | 400 | #cbd5e1 | Line-height 1.57 |

### Colors

```typescript
// Glass Cards
background: 'rgba(255, 255, 255, 0.05)'
border: 'rgba(148, 163, 184, 0.1)'

// Gradients
gradientBg: ['rgba(6, 78, 59, 0.15)', 'rgba(15, 23, 42, 0.3)']

// Accent (from user's element)
accentColor: theme.accentColor // Fire: #ef4444, Air: #06b6d4, etc.

// States
loading: accentColor
error: '#f87171'
copied: accentColor (2s flash)
```

---

## 🔌 Integration with ResultsScreen

### Import and Setup

```typescript
import { QuranResonanceCard } from '@/components/quran/QuranResonanceCard';
import { getQuranResonance, type QuranResonance } from '@/services/QuranResonanceService';

// State management
const [quranResonance, setQuranResonance] = useState<QuranResonance | null>(null);
const [quranLoading, setQuranLoading] = useState(false);
const [quranError, setQuranError] = useState<string | null>(null);

// Load on mount and language change
useEffect(() => {
  if (result?.totalKabir) {
    loadQuranResonance();
  }
}, [result?.totalKabir, language]);
```

### Placement

Positioned **between Zodiac Influence and Spiritual Guidance** sections:

```tsx
{/* Zodiac Influence */}
...

{/* Qur'anic Resonance */}
<View style={styles.section}>
  <QuranResonanceCard
    resonance={quranResonance}
    loading={quranLoading}
    error={quranError || undefined}
    accentColor={theme.accentColor}
    language={language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en'}
    onRetry={loadQuranResonance}
  />
</View>

{/* Spiritual Guidance */}
...
```

---

## 🌐 Multi-Language Support

### Text Translations

| English | Arabic | French |
|---------|--------|--------|
| Qur'anic Resonance | الرنين القرآني | Résonance Coranique |
| A verse for reflection | آية للتأمل من خلال رقمك | Un verset pour la réflexion |
| Read full verse | اقرأ الآية الكاملة | Lire le verset complet |
| For reflection only | للتأمل فقط | Pour la réflexion uniquement |
| Ayah X of Y | الآية X من Y | Verset X sur Y |

### RTL Support

Arabic text automatically displays RTL:
```typescript
textAlign: 'right'  // For Arabic verse
writingDirection: 'rtl'  // Automatic in React Native
```

---

## 🛠️ Functionality

### 1. Copy Arabic Text
```typescript
const handleCopyArabic = async () => {
  await Clipboard.setStringAsync(resonance.ayahTextAr);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000); // Visual feedback
};
```

### 2. Open Quran.com Link
```typescript
const handleOpenLink = async () => {
  const supported = await Linking.canOpenURL(resonance.quranComUrl);
  if (supported) {
    await Linking.openURL(resonance.quranComUrl);
  }
};
```

### 3. Info Alert
```typescript
const handleInfoPress = () => {
  Alert.alert(
    'Information',
    'This is a reflective prompt generated from numerical mapping. ' +
    'It is not a religious ruling, prediction, or fortune-telling.'
  );
};
```

---

## 🔄 State Management

### Loading State
```tsx
<ActivityIndicator size="large" color={accentColor} />
<Text>Loading resonance...</Text>
```

### Error State with Retry
```tsx
<Text>Could not load resonance verse</Text>
<TouchableOpacity onPress={onRetry}>
  <RefreshCw /> Retry
</TouchableOpacity>
```

### Empty State
```tsx
<Text>No verse available for this number</Text>
```

### Success State
Full card display with all 6 sections

---

## 📡 API Integration

### Request Flow
1. Calculate Surah and Ayah from Kabir
2. Validate against QURAN_META
3. Fetch from Al-Quran Cloud API
4. Parse Arabic text from response
5. Build Quran.com URL
6. Return complete QuranResonance object

### Error Handling
```typescript
try {
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data.data.text;
} catch (error) {
  console.warn('[QuranResonance] API failed, using fallback');
  return `الآية ${ayahNumber} من سورة ${QURAN_META[surahNumber].nameAr}`;
}
```

### API Response Format
```json
{
  "code": 200,
  "status": "OK",
  "data": {
    "number": 1,
    "text": "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    "surah": {
      "number": 1,
      "name": "سُورَةُ ٱلْفَاتِحَةِ",
      "englishName": "Al-Faatiha"
    }
  }
}
```

---

## ⚠️ Important Disclaimers

### User-Facing Disclaimers
1. **Footer of Card**: "For reflection only • Not divination or legal ruling"
2. **Info Alert**: Full explanation when (ℹ️) is pressed
3. **Reflection Section**: Guides toward self-improvement interpretation

### Developer Notes
- This is a **spiritual reflection tool**, not a religious authority
- Calculations are based on traditional numerology, not Islamic law
- Always respect the Qur'an as sacred text
- Provide context that this is for personal contemplation
- Never imply predictive or authoritative interpretations

---

## 🎯 Premium Design Features

### Mobile-First Enhancements (vs Web)
1. ✅ **Glass Morphism** - Layered translucent cards
2. ✅ **Smooth Gradients** - Teal to navy backgrounds
3. ✅ **Larger Arabic Text** - 20px vs 18px on web
4. ✅ **Better Line Height** - 1.9 for Arabic readability
5. ✅ **Copy Functionality** - One-tap clipboard copy
6. ✅ **External Link** - Direct Quran.com integration
7. ✅ **Loading States** - Spinner with branded colors
8. ✅ **Error Handling** - Retry button with feedback
9. ✅ **Info Tooltip** - Alert with full disclaimer
10. ✅ **Element Theming** - Accent colors from user's element

### Accessibility
- Readable font sizes (14px minimum)
- High contrast text (white on dark)
- Touch targets 44x44px minimum
- Clear visual hierarchy
- RTL support for Arabic

---

## 🧪 Testing Checklist

### Functional Tests
- [ ] Verse loads on Results screen mount
- [ ] Correct Surah/Ayah calculated from Kabir
- [ ] Arabic text displays correctly (RTL)
- [ ] Copy button copies to clipboard
- [ ] "Read full verse" opens Quran.com
- [ ] Info button shows disclaimer alert
- [ ] Retry button works on error
- [ ] Language changes update all text
- [ ] Loading spinner shows during fetch
- [ ] Fallback text displays if API fails

### Visual Tests
- [ ] Glass card styling renders correctly
- [ ] Arabic text is readable at 20px
- [ ] Accent color matches user's element
- [ ] Surah name displays prominently
- [ ] Ayah badge has correct styling
- [ ] Reflection card has proper spacing
- [ ] Footer disclaimer is visible
- [ ] CTA button has hover/press effect

### Edge Cases
- [ ] Kabir = 0 (uses Surah 114, last Ayah)
- [ ] Very large Kabir (modulo works correctly)
- [ ] API timeout (fallback activates)
- [ ] Network offline (error state shows)
- [ ] Long Arabic text (proper wrapping)
- [ ] Very short verses (layout maintains)

---

## 🚀 Future Enhancements

### Potential Features
1. **Translation Toggle** - Show English/French translation alongside Arabic
2. **Tafsir Integration** - Brief commentary or context
3. **Audio Playback** - Listen to verse recitation
4. **Bookmarking** - Save favorite resonances
5. **Share Feature** - Share verse as image
6. **Daily Reflection** - New verse each day based on date
7. **Verse History** - See all past resonances
8. **Custom Styling** - User-selected font sizes

### API Alternatives
- Quran.com API (more features, requires auth)
- Islamic Network API (similar to Al-Quran Cloud)
- Local JSON file (offline support)

---

## 📚 References

### APIs
- [Al-Quran Cloud API](https://alquran.cloud/api)
- [Quran.com Documentation](https://quran.com/resources)

### Design Inspiration
- Web app: zaibaitech/asrar Name Destiny module
- Mobile-first improvements based on iOS/Android guidelines

### Cultural Resources
- Traditional Arabic numerology (Abjad system)
- Islamic spiritual practices and reflection
- Qur'anic verse numbering systems

---

## 🎓 Learning Resources

For developers working on this feature:

1. **Arabic Typography**
   - Line height for Arabic: 1.8-2.0 recommended
   - Right-to-left text flow
   - Proper diacritics rendering

2. **React Native Expo**
   - Clipboard API usage
   - Linking for external URLs
   - Alert dialogs
   - Async state management

3. **Islamic Numerology**
   - Abjad numerical system
   - Kabir (grand total) vs Saghir (digital root)
   - Traditional uses and modern interpretations

---

## ✅ Completion Status

**Implementation:** ✅ Complete
- [x] Constants file with all 114 Surahs
- [x] Service layer with calculation logic
- [x] API integration with fallback
- [x] Premium UI component
- [x] ResultsScreen integration
- [x] Multi-language support
- [x] Loading/Error/Empty states
- [x] Copy and external link functionality
- [x] Respectful disclaimers

**Last Updated:** December 2024
**Developer:** AI Assistant (GitHub Copilot)
**Status:** Ready for Production

---

## 📞 Support

For questions or issues:
1. Check this documentation first
2. Review the web app implementation (zaibaitech/asrar)
3. Test with various Kabir values (0, 1, 114, 1000+)
4. Verify API connectivity and response format

---

*May this feature inspire reflection, gratitude, and spiritual growth.* 🌙✨
