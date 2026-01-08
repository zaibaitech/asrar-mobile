# Divine Timing Internationalization - Testing Guide

## Quick Verification Steps

### 1. Check English Mode

**Steps**:
1. Open app and set language to English
2. Navigate to Divine Timing
3. Select any intention (e.g., "New Beginning")
4. Submit to view results

**Expected Results**:
- ✅ All UI labels in English: "Timing Quality", "Cycle State", "Elemental Tone"
- ✅ Guidance message in English: "Conditions appear supportive for reflection and considered action. Ongoing efforts may be nurtured."
- ✅ Practical steps in English: "✨ Conditions are exceptionally aligned - this is an optimal time to act"
- ✅ Reflection prompt in English: "Read this verse slowly. What word resonates with you today?"

### 2. Check French Mode

**Steps**:
1. Switch language to Français
2. Navigate to Divine Timing (same screen should refresh)
3. Verify all content

**Expected Results**:
- ✅ All UI labels in French: "Qualité du timing", "État du cycle", "Ton élémental"
- ✅ Guidance message in French: "Les conditions semblent favorables à la réflexion et à l'action considérée. Les efforts en cours peuvent être nourris."
- ✅ Practical steps in French: "✨ Les conditions sont exceptionnellement alignées - c'est un moment optimal pour agir"
- ✅ Reflection prompt in French: "Lisez ce verset lentement. Quel mot résonne avec vous aujourd'hui ?"
- ❌ **NO ENGLISH TEXT VISIBLE**

### 3. Test Live Language Switching

**Steps**:
1. While viewing results in French, switch language to English
2. Observe immediate change

**Expected Results**:
- ✅ All content updates immediately to English
- ✅ No page reload required
- ✅ Results preserved (same timing analysis, different language)

### 4. Test Different Timing Qualities

Generate results with different qualities to test all message variations:

#### Favorable Timing
**Expected EN Messages** (examples):
- "Conditions appear supportive for reflection and considered action."
- "The energy flows align well for mindful engagement."
- "A good moment for mindful participation with what's before you."

**Expected FR Messages**:
- "Les conditions semblent favorables à la réflexion et à l'action considérée."
- "Les flux d'énergie s'alignent bien pour un engagement attentif."
- "Un bon moment pour une participation consciente avec ce qui se présente à vous."

#### Neutral Timing
**Expected EN Messages**:
- "Conditions are neutral—good for routine activities."
- "Steady-as-you-go energy—neither pushing nor resisting."

**Expected FR Messages**:
- "Les conditions sont neutres — bonnes pour les activités routinières."
- "Énergie régulière — ni en poussant ni en résistant."

#### Delicate Timing
**Expected EN Messages**:
- "Timing feels delicate—proceed gently if you must."
- "This may be a time to pause and observe."

**Expected FR Messages**:
- "Le timing semble délicat — procédez doucement si nécessaire."
- "Cela peut être un moment pour faire une pause et observer."

### 5. Test All Practical Steps

Test with different recommendations to see all step variations:

#### Highly Favorable Steps (EN)
1. "✨ Conditions are exceptionally aligned - this is an optimal time to act"
2. "Make your decision/move within the next 2 hours while alignment is strong"
3. "Combine with prayer (duʿāʾ) and trust in divine wisdom"

#### Highly Favorable Steps (FR)
1. "✨ Les conditions sont exceptionnellement alignées - c'est un moment optimal pour agir"
2. "Prenez votre décision/mouvement dans les 2 prochaines heures pendant que l'alignement est fort"
3. "Combinez avec la prière (duʿāʾ) et la confiance en la sagesse divine"

### 6. Test Reflection Prompts

Verify different prompt types appear correctly:

#### Question Type (EN)
- "Read this verse slowly. What word resonates with you today?"
- "What does this verse invite you to consider today?"

#### Question Type (FR)
- "Lisez ce verset lentement. Quel mot résonne avec vous aujourd'hui ?"
- "Qu'est-ce que ce verset vous invite à considérer aujourd'hui ?"

## Common Issues to Check

### ❌ Red Flags (Issues to Report)

1. **Mixed Language**: English words appearing in French mode
   - Example: "Qualité du timing: favorable" with "Conditions appear supportive..." message
   - **Root cause**: Service not returning keys, or UI not using them

2. **Translation Keys Visible**: Raw keys showing instead of translated text
   - Example: "divineTiming.results.guidance.supportive_reflection"
   - **Root cause**: Missing translation entry or typo in key name

3. **Untranslated Sections**: Some sections in French, others in English
   - Example: Labels translated but content not
   - **Root cause**: Component not using `useLanguage` hook or missing t() calls

4. **Emoji/Symbols Lost**: Icons like ✨, ⚠, ⏸ not showing
   - **Root cause**: Translation file encoding issue

### ✅ Good Signs

1. Clean language separation: All FR or all EN, never mixed
2. Instant language switching without reload
3. All emojis and symbols preserved
4. Proper French typography (spaces before ?, !, :, etc.)

## Edge Cases to Test

### 1. Backwards Compatibility
**Test**: Use old cached data that doesn't have messageKeys
**Expected**: Should fallback to English text gracefully

### 2. Missing Translation Keys
**Test**: Temporarily comment out one French translation
**Expected**: Should either fallback to English or show placeholder (not crash)

### 3. Very Long Text
**Test**: Check if French translations (typically longer) break UI layout
**Expected**: Text should wrap properly, no overflow

### 4. RTL Support (Future)
**Test**: If Arabic is added later
**Expected**: Right-to-left layout with proper alignment

## Automated Testing (Future)

```typescript
// Example test
describe('Divine Timing I18N', () => {
  it('should display all content in French when FR selected', () => {
    const { getByText } = render(<DivineTimingResults />, { locale: 'fr' });
    
    // Should find French text
    expect(getByText(/Qualité du timing/)).toBeTruthy();
    
    // Should NOT find English text
    expect(() => getByText(/Timing Quality/)).toThrow();
  });
});
```

## Translation Coverage Report

| Category | EN Keys | FR Keys | Coverage |
|----------|---------|---------|----------|
| Guidance Messages | 9 | 9 | 100% ✅ |
| Cycle Descriptions | 12 | 12 | 100% ✅ |
| Practical Steps | 19 | 19 | 100% ✅ |
| Reflection Prompts | 9 | 9 | 100% ✅ |
| **TOTAL** | **49** | **49** | **100% ✅** |

## Manual Test Checklist

- [ ] English mode: No French text visible
- [ ] French mode: No English text visible
- [ ] Language switching works instantly
- [ ] Guidance messages translated correctly
- [ ] Practical steps translated correctly
- [ ] Reflection prompts translated correctly
- [ ] All emojis and symbols display correctly
- [ ] French typography is correct (spaces, accents)
- [ ] No translation keys visible (e.g., "supportive_reflection")
- [ ] Backwards compatibility: Old data still works
- [ ] UI layout doesn't break with longer French text
- [ ] All timing qualities tested (favorable, neutral, delicate)
- [ ] All recommendations tested (highly favorable, act now, caution, wait)
- [ ] All intentions tested (start, travel, communication, etc.)

---

**Status**: Ready for testing
**Priority**: HIGH - Blocking user experience in French mode
**Estimated Test Time**: 15-20 minutes for full manual test
