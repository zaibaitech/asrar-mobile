# Birth Profile Quick Reference

## 🚀 Quick Start

### Using the Birth Profile Calculator

1. **Select Birth Profile Type**
   ```tsx
   <CalculationTypeSelector 
     selectedType="birth" 
     onTypeChange={setType} 
   />
   ```

2. **Collect Birth Data**
   ```tsx
   <BirthProfileInput
     data={birthData}
     onChange={setBirthData}
   />
   ```

3. **Calculate Profile**
   ```tsx
   const insights = await calculateBirthProfile({
     dateOfBirth: new Date('1990-03-21'),
     timeOfBirth: new Date('1990-03-21T14:30:00'),
     timeKnown: true,
     placeOfBirth: {
       city: 'Casablanca',
       latitude: 33.5731,
       longitude: -7.5898,
       timezone: 'Africa/Casablanca'
     }
   });
   ```

4. **Display Results**
   ```tsx
   <BirthProfileResults insights={insights} />
   ```

## 📊 Data Flow

```
User Input → BirthProfileInput Component
    ↓
Validate → validateBirthInput()
    ↓
Calculate → calculateBirthProfile()
    ├─→ Fetch Ephemeris (EphemerisService)
    ├─→ Parse Positions → zodiac signs
    ├─→ Calculate Ascendant (if time known)
    ├─→ Determine Lunar Mansion
    ├─→ Assess Planet Conditions
    ├─→ Synthesize Spiritual Imprint
    ↓
BirthInsights Object
    ↓
Display → BirthProfileResults Component
```

## 🔑 Key Functions

### Validation
```typescript
validateBirthInput(data: Partial<BirthInput>): { valid: boolean; errors: string[] }
```

### Main Calculation
```typescript
calculateBirthProfile(input: BirthInput): Promise<BirthInsights>
```

### Helper Functions
```typescript
longitudeToSign(longitude: number): { sign: string; degree: number; element: ElementType }
getLunarMansion(moonLongitude: number): { index: number; arabicName: string; meaningKey: string }
getDayRuler(date: Date): { planet: string; element: ElementType }
getPlanetCondition(planet: string, sign: string): { label, score, reasonKey }
```

## 🎨 UI Components

### BirthProfileInput
**Props:**
- `data: BirthProfileData` - Current form state
- `onChange: (data: BirthProfileData) => void` - Update handler

**Features:**
- Date/time pickers (React Native DateTimePicker)
- Optional time toggle
- Place coordinates input
- Optional name linking

### BirthProfileResults
**Props:**
- `insights: BirthInsights` - Calculated results

**Cards Rendered:**
1. Birth Summary
2. Angles (conditional)
3. Planets (7)
4. Moon Timing
5. Spiritual Imprint
6. Name Resonance (conditional)

## 🌍 Internationalization

### Adding New Translations

**English** (`en.calculator.birth`):
```typescript
{
  dateOfBirth: "Date of Birth",
  timeOfBirth: "Time of Birth",
  // ... see translations.ts
}
```

**French** (`fr.calculator.birth`):
```typescript
{
  dateOfBirth: "Date de Naissance",
  timeOfBirth: "Heure de Naissance",
  // ... see translations.ts
}
```

### Using in Components
```tsx
const { t } = useLanguage();
<Text>{t('calculator.birth.dateOfBirth')}</Text>
```

## 🧪 Testing

### Unit Tests
```bash
npm test BirthProfileService.test.ts
```

### Manual Testing Checklist
- [ ] Valid date/time/place → successful calculation
- [ ] Missing date → validation error
- [ ] Missing coordinates → validation error
- [ ] Time unknown → skips Ascendant
- [ ] Time known → calculates Ascendant
- [ ] Retrograde planets flagged correctly
- [ ] Moon phase matches ephemeris
- [ ] Translations display correctly (EN/FR)

## 📦 Dependencies

### External
- `@react-native-community/datetimepicker` - Date/time pickers
- `expo-linear-gradient` - Card gradients

### Internal Services
- `EphemerisService` - Planetary positions
- `MoonPhaseService` - Phase naming (optional)

### Data Files
- `LUNAR_MANSIONS` - 28 manazil data
- `MANAZIL_DATA` - Exported constants

## 🔧 Configuration

### Ephemeris Settings
Located in `EphemerisService.ts`:
- Cache TTL: 24 hours
- API: NASA JPL Horizons
- Fallback: Synthetic positions

### Timezone Handling
- Uses IANA timezone strings
- Converts local → UTC for ephemeris
- Supports all major timezones

## 🐛 Troubleshooting

### "Unable to fetch ephemeris data"
- Check internet connection
- Verify date is within ephemeris range (1900-2100)
- Check fallback data is available

### "Ascendant not calculated"
- Ensure `timeKnown: true`
- Verify `timeOfBirth` is provided
- Check latitude is valid (-90 to 90)

### "Wrong lunar mansion"
- Verify Moon longitude from ephemeris
- Check mansion calculation: `floor(lon / 12.857)`
- Ensure 0-indexed → 1-indexed conversion

### Translations not showing
- Check key exists in `translations.ts`
- Verify language context is available
- Use `tSafe()` for fallback behavior

## 📝 Code Examples

### Complete Flow
```tsx
import { calculateBirthProfile, validateBirthInput } from '@/services/BirthProfileService';
import { BirthProfileInput, BirthProfileData } from '@/components/calculator/BirthProfileInput';
import { BirthProfileResults } from '@/components/calculator/results/BirthResultSection';

function BirthProfileCalculator() {
  const [birthData, setBirthData] = useState<BirthProfileData>({
    dateOfBirth: null,
    timeOfBirth: null,
    timeKnown: false,
    placeCity: '',
    placeLatitude: '',
    placeLongitude: '',
    placeTimezone: '',
    linkWithName: false,
  });
  
  const [insights, setInsights] = useState<BirthInsights | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCalculate = async () => {
    const validation = validateBirthInput({
      dateOfBirth: birthData.dateOfBirth!,
      timeOfBirth: birthData.timeOfBirth ?? undefined,
      timeKnown: birthData.timeKnown,
      placeOfBirth: {
        city: birthData.placeCity,
        latitude: parseFloat(birthData.placeLatitude),
        longitude: parseFloat(birthData.placeLongitude),
        timezone: birthData.placeTimezone,
      },
    });

    if (!validation.valid) {
      alert(validation.errors.join('\n'));
      return;
    }

    setLoading(true);
    try {
      const result = await calculateBirthProfile({
        dateOfBirth: birthData.dateOfBirth!,
        timeOfBirth: birthData.timeOfBirth ?? undefined,
        timeKnown: birthData.timeKnown,
        placeOfBirth: {
          city: birthData.placeCity,
          latitude: parseFloat(birthData.placeLatitude),
          longitude: parseFloat(birthData.placeLongitude),
          timezone: birthData.placeTimezone,
        },
      });
      setInsights(result);
    } catch (error) {
      alert('Calculation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <BirthProfileInput data={birthData} onChange={setBirthData} />
      <Button title="Calculate" onPress={handleCalculate} disabled={loading} />
      {insights && <BirthProfileResults insights={insights} />}
    </View>
  );
}
```

## 🔗 Related Documentation

- [Calculator Module Overview](./CALCULATOR_COMPLETE_OVERVIEW.md)
- [Ephemeris Service](./services/EphemerisService.ts)
- [Lunar Mansions Data](./data/lunarMansions.ts)
- [Translation Keys](./constants/translations.ts)

## 📞 Support

For questions or issues:
1. Check this quick reference
2. Review full implementation doc: `BIRTH_PROFILE_IMPLEMENTATION.md`
3. Examine existing calculation types for patterns
4. Test with example data from service file
