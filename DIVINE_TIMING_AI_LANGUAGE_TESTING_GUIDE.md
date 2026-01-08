# Divine Timing AI Language Testing Guide

## Quick Test Instructions

### Setup
1. Ensure AI is enabled in Settings → AI Settings
2. Make sure you have a valid Groq API key in `.env`

### Test 1: French Mode AI Responses

**Steps:**
1. Go to Settings → Language
2. Select **Français (French)**
3. Navigate to Divine Timing
4. Tap "Ask Divine Timing"
5. Fill in the form:
   - Category: Travail (Work)
   - Question: "Should I apply for this new job?"
   - Timeframe: Cette semaine
   - Urgency: Moyenne
6. Tap "Get Guidance"

**Expected Result:**
✅ AI guidance section should be **100% in French**
✅ No English text in AI responses
✅ Proper French vocabulary: "Qualité du timing", "Procéder avec prudence"
✅ Example French output:
```
Le moment actuel présente une qualité de timing modérée pour cette décision professionnelle. 

Votre résonance Abjad porte une valeur totale de 786, alignée avec l'élément Feu.

Recommandations:
• Procéder avec prudence
• Réfléchir profondément à vos intentions
• Consulter des personnes de confiance

Prochaine étape pratique:
Prenez le temps de faire Istikhara ce soir avant de prendre votre décision finale.
```

### Test 2: English Mode AI Responses

**Steps:**
1. Go to Settings → Language
2. Select **English**
3. Navigate to Divine Timing
4. Tap "Ask Divine Timing"
5. Fill in the form:
   - Category: Work
   - Question: "Dois-je postuler pour ce nouveau poste?" (French question)
   - Timeframe: This week
   - Urgency: Medium
6. Tap "Get Guidance"

**Expected Result:**
✅ AI guidance section should be **100% in English**
✅ AI ignores the French input and responds in English
✅ No French text in AI responses
✅ Example English output:
```
The current timing presents a moderate quality for this professional decision.

Your Abjad resonance carries a total value of 786, aligned with the Fire element.

Recommendations:
• Proceed with caution
• Reflect deeply on your intentions
• Consult trusted individuals

Practical next step:
Take time to perform Istikhara tonight before making your final decision.
```

### Test 3: Peak Windows Enhancement

**French Mode:**
1. Switch app to **Français**
2. Go to Divine Timing home screen
3. Find a Peak Window card
4. Tap "Enhance with AI" (if available)

**Expected Result:**
✅ Enhanced explanation is **100% in French**
✅ Activity recommendations in French
✅ Timing wisdom in French

**English Mode:**
1. Switch app to **English**
2. Go to Divine Timing home screen
3. Find a Peak Window card
4. Tap "Enhance with AI"

**Expected Result:**
✅ Enhanced explanation is **100% in English**
✅ Activity recommendations in English
✅ Timing wisdom in English

### Test 4: Language Switching

**Steps:**
1. Switch app to **Français**
2. Submit a Divine Timing question
3. Wait for AI response (should be in French)
4. Switch app to **English**
5. Submit another Divine Timing question
6. Wait for AI response (should be in English)

**Expected Result:**
✅ First response is in French
✅ Second response is in English
✅ No mixed-language responses
✅ Clean language transition

### Test 5: AI Disabled Fallback

**Steps:**
1. Go to Settings → AI Settings
2. Disable AI
3. Switch to **Français**
4. Submit a Divine Timing question

**Expected Result:**
✅ No AI enhancement attempted
✅ Base guidance displayed (from DivineTimingService)
✅ UI labels still in French (translation keys)
⚠️ Base guidance text might be in English (expected, as it's hardcoded)

## Common Issues & Solutions

### Issue: AI still responds in English when app is in French

**Solution:**
- Check `DivineTimingGuidanceCard.tsx` has `const { language } = useLanguage()`
- Verify `language: language` is passed to `rewriteGuidanceWithAI()`
- Ensure `AIReflectionService.ts` extracts `locale` from `request.language`
- Confirm `buildSystemPrompt(locale)` is called with the locale

### Issue: Mixed language in AI response (e.g., "your Abjad resonance carries a total بلغ value")

**Solution:**
- Check `buildSystemPrompt()` includes language enforcement instructions
- Verify the correct locale is being passed
- Test with a fresh API call (clear cache if necessary)
- Check Groq API logs to see what system prompt was sent

### Issue: TypeScript errors after changes

**Solution:**
- Run `npx expo start --clear` to clear Metro cache
- Check `types/ai-settings.ts` has `language?: 'en' | 'ar' | 'fr'` field
- Ensure all AI request types extend the base interface

## Quick Verification Commands

```bash
# Check for language parameter usage
grep -n "language: language" components/divine-timing/*.tsx

# Check buildSystemPrompt signature
grep -n "buildSystemPrompt" services/AIReflectionService.ts

# Check useLanguage imports
grep -n "useLanguage" components/divine-timing/*.tsx

# Check for TypeScript errors
npx tsc --noEmit
```

## Manual Code Inspection

### Verify DivineTimingGuidanceCard.tsx

**Expected imports:**
```tsx
import { useLanguage } from '@/contexts/LanguageContext';
```

**Expected hook usage:**
```tsx
const { language } = useLanguage();
```

**Expected AI call:**
```tsx
const enhanced: AIRewriteResponse = await rewriteGuidanceWithAI({
  // ...
  language: language, // ✅ Should use language from hook, not 'en'
});
```

### Verify AIReflectionService.ts

**Expected buildSystemPrompt:**
```typescript
function buildSystemPrompt(locale: 'en' | 'fr' | 'ar' = 'en'): string {
  const languageInstructions = {
    en: `LANGUAGE REQUIREMENT: ...`,
    fr: `EXIGENCE LINGUISTIQUE: ...`,
    ar: `متطلبات اللغة: ...`,
  };
  // ...
}
```

**Expected AI function pattern:**
```typescript
export async function rewriteGuidanceWithAI(request: AIRewriteRequest): Promise<AIRewriteResponse> {
  const locale = request.language || 'en'; // ✅ Extract locale
  const systemPrompt = buildSystemPrompt(locale); // ✅ Pass to buildSystemPrompt
  // ...
}
```

## Success Criteria

✅ **French Mode:**
- All AI responses are 100% in French
- No English words appear in AI sections
- Proper French grammar and accents
- Culturally appropriate French terminology

✅ **English Mode:**
- All AI responses are 100% in English
- No French words appear in AI sections
- Clear, professional English
- Appropriate Islamic terminology in English

✅ **Language Switching:**
- Clean transitions between languages
- No cached responses in wrong language
- Immediate language change effect

✅ **Code Quality:**
- No TypeScript errors
- No runtime errors
- Proper type safety
- Clean console logs (no warnings)

## Screenshot Evidence

Take screenshots showing:

1. **French AI Response**
   - Full Divine Timing guidance card in French
   - Highlight the AI badge and French text

2. **English AI Response**
   - Full Divine Timing guidance card in English
   - Show clear English AI output

3. **Peak Windows in French**
   - Enhanced timing window with French explanation

4. **Peak Windows in English**
   - Enhanced timing window with English explanation

## Reporting Issues

If you find language mixing or incorrect language output:

1. Note the exact steps to reproduce
2. Screenshot the problematic response
3. Check the console for errors
4. Verify the API request includes correct `language` parameter
5. Test with AI disabled to rule out service issues

---

**Testing Date**: _____________

**Tested By**: _____________

**Result**: ✅ Pass / ❌ Fail

**Notes**:
