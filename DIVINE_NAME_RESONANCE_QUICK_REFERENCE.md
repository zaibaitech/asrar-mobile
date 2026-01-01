# Divine Name Resonance - Quick Code Reference

## How to Use the Divine Resonance Service

### Basic Usage

```typescript
import { computeDivineResonance } from '@/features/name-destiny/services/divineResonance';
import { ABJAD_MAGHRIBI } from '@/features/name-destiny/constants/abjadMaps';

// Calculate for a name
const result = computeDivineResonance('محمد', ABJAD_MAGHRIBI);

console.log(result.divineName);  // حكيم
console.log(result.total);       // 92
console.log(result.index);       // 8
console.log(result.letter);      // ح
```

### With Error Handling

```typescript
try {
  const resonance = computeDivineResonance(arabicName, abjadMap);
  // Use resonance data
} catch (error) {
  console.error('Failed to calculate resonance:', error);
  // Show user-friendly error message
}
```

### Using in a Component

```typescript
import { DivineResonanceCard } from '@/features/name-destiny/components';

function MyComponent({ result }) {
  return (
    <>
      {result.divineResonance && (
        <DivineResonanceCard resonance={result.divineResonance} />
      )}
    </>
  );
}
```

## Key Functions

### computeDivineResonance

```typescript
function computeDivineResonance(
  name: string,
  abjadMap?: Record<string, number>
): DivineResonanceResult
```

**Parameters:**
- `name` - The Arabic name to analyze
- `abjadMap` - Optional Abjad value map (defaults to Maghribi)

**Returns:**
```typescript
{
  normalized: string;          // Cleaned name
  breakdown: LetterBreakdown[];// Letter values
  total: number;               // Sum of values
  index: number;               // 1-28 index
  letter: string;              // Resonant letter
  divineName: string;          // Divine Name
}
```

**Throws:**
- Error if no valid Arabic letters found

### getResonanceExplanation

```typescript
function getResonanceExplanation(
  total: number,
  index: number
): string
```

**Examples:**
- `getResonanceExplanation(92, 8)` → "92 ÷ 28 = 3 remainder 8 → Index 8"
- `getResonanceExplanation(20, 20)` → "20 < 28 → Index 20"

## The 28 Divine Names

| Index | Letter | Divine Name | Meaning (English) |
|-------|--------|-------------|-------------------|
| 1 | ا | الله | Allah (The God) |
| 2 | ب | باقٍ | Al-Baqi (The Everlasting) |
| 3 | ج | جامع | Al-Jami (The Gatherer) |
| 4 | د | دائم | Ad-Daim (The Eternal) |
| 5 | ه | هادي | Al-Hadi (The Guide) |
| 6 | و | ودود | Al-Wadud (The Loving) |
| 7 | ز | زكي | Az-Zaki (The Pure) |
| 8 | ح | حكيم | Al-Hakim (The Wise) |
| 9 | ط | طاهر | At-Tahir (The Purifier) |
| 10 | ي | يقين | Al-Yaqin (The Certain) |
| 11 | ك | كريم | Al-Karim (The Generous) |
| 12 | ل | لطيف | Al-Latif (The Subtle) |
| 13 | م | مؤمن | Al-Mumin (The Believer) |
| 14 | ن | نور | An-Nur (The Light) |
| 15 | س | سلام | As-Salam (The Peace) |
| 16 | ع | عليم | Al-Alim (The Knowing) |
| 17 | ف | فرد | Al-Fard (The Unique) |
| 18 | ص | صبور | As-Sabur (The Patient) |
| 19 | ق | قادر | Al-Qadir (The Able) |
| 20 | ر | رحمن | Ar-Rahman (The Merciful) |
| 21 | ش | شكور | Ash-Shakur (The Grateful) |
| 22 | ت | تواب | At-Tawwab (The Acceptor) |
| 23 | ث | ثابت | Ath-Thabit (The Firm) |
| 24 | خ | خبير | Al-Khabir (The Aware) |
| 25 | ذ | ذو الجلال والإكرام | Dhul-Jalal wal-Ikram |
| 26 | ض | ضار | Ad-Darr (The Distresser) |
| 27 | ظ | ظاهر | Az-Zahir (The Manifest) |
| 28 | غ | غني | Al-Ghani (The Rich) |

## Calculation Examples

### Example 1: محمد (Total 92)
```
م = 40
ح = 8
م = 40
د = 4
------
Total = 92

92 ÷ 28 = 3 remainder 8
Index = 8
Divine Name = حكيم (Al-Hakim)
```

### Example 2: ك (Total 20, less than 28)
```
ك = 20
------
Total = 20

20 < 28 (no division)
Index = 20
Divine Name = رحمن (Ar-Rahman)
```

### Example 3: انه (Total 56, remainder 0)
```
ا = 1
ن = 50
ه = 5
------
Total = 56

56 ÷ 28 = 2 remainder 0
Index = 28 (remainder 0 maps to 28)
Divine Name = غني (Al-Ghani)
```

## Integration with Name Destiny

The Divine Resonance is automatically calculated when you use `buildDestiny()`:

```typescript
import { buildDestiny } from '@/features/name-destiny/services/nameDestinyCalculator';

const result = buildDestiny(personName, motherName, abjadMap);

// Access the resonance
if (result.divineResonance) {
  console.log('Your Divine Name:', result.divineResonance.divineName);
}
```

## Styling the Card

The `DivineResonanceCard` uses these accent colors:
- Primary: `#c084fc` (purple)
- Background: `rgba(168, 85, 247, 0.15)`
- Border: `rgba(168, 85, 247, 0.3)`

To customize, modify the styles in `/features/name-destiny/components/DivineResonanceCard.tsx`.

## Common Patterns

### Displaying in a List
```tsx
{calculations.map((calc) => (
  calc.divineResonance && (
    <DivineResonanceCard 
      key={calc.id}
      resonance={calc.divineResonance}
    />
  )
))}
```

### Showing Only Divine Name
```tsx
{result.divineResonance && (
  <Text style={styles.divineName}>
    {result.divineResonance.divineName}
  </Text>
)}
```

### Custom Explanation
```tsx
import { getResonanceExplanation } from '@/features/name-destiny/services/divineResonance';

const explanation = getResonanceExplanation(
  result.divineResonance.total,
  result.divineResonance.index
);
```

## Troubleshooting

### "No valid Arabic letters found"
- Input contains only Latin characters or numbers
- Input is empty after normalization
- Solution: Ensure user enters Arabic text

### Incorrect Total
- Check that you're using the correct Abjad map
- Verify letter values match Abjad Kabir (not Saghir)
- Use `breakdown` field to debug letter-by-letter

### UI Not Showing
- Check that `result.divineResonance` is not undefined
- Ensure the component is imported correctly
- Verify conditional rendering logic

## Best Practices

1. **Always use try-catch** when calling `computeDivineResonance`
2. **Check for undefined** before rendering the card
3. **Use the built-in** `getResonanceExplanation` for consistency
4. **Log errors** for debugging but show friendly messages to users
5. **Cache results** if recalculating frequently

## Performance Tips

- Calculations are very fast (< 1ms typically)
- No need for memoization unless calculating thousands of names
- Consider debouncing if calculating on every keystroke
- The letter breakdown array is small (typically < 20 items)

---

For full implementation details, see `DIVINE_NAME_RESONANCE_IMPLEMENTATION.md`.
