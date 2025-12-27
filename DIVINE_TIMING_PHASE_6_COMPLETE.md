# Divine Timing Phase 6: Optional AI Polish - COMPLETE ✅

**Status**: IMPLEMENTED (v6.1 with security fixes)  
**Date**: December 2025  
**AI Model**: Groq llama-3.3-70b-versatile (70B parameter Llama model)

## ⚠️ SECURITY NOTICE

**Critical**: API key is exposed in client code (EXPO_PUBLIC_*). This is acceptable for development but **MUST be moved to a server endpoint before production deployment**.

See [PHASE_6_SECURITY_FIXES.md](PHASE_6_SECURITY_FIXES.md) for:
- Full security analysis
- Server endpoint migration guide
- Zod validation implementation
- Strict validation rules
- Production deployment checklist

---

## 📋 Phase 6 Overview

Phase 6 adds **optional AI assistance** to polish the wording of Divine Timing guidance. The AI:
- ✅ **Only rewrites existing deterministic outputs** for clarity and warmth
- ✅ **NEVER computes** timing, elements, cycles, or decisions
- ✅ **Preserves structure** and meaning exactly
- ✅ **Falls back silently** to original text if AI fails
- ✅ **OFF by default** with feature flag

---

## 🎯 Critical Design Principles

### 1. **AI is OFF by Default**
```typescript
const ENABLE_AI_REFLECTION = false; // Feature flag in AIReflectionService.ts
```

### 2. **AI Never Computes**
The AI only receives **already-computed** guidance from Phase 3's deterministic system:
- ❌ AI does NOT calculate timing quality
- ❌ AI does NOT select Qur'an verses
- ❌ AI does NOT make decisions
- ✅ AI ONLY rewrites the wording for better clarity

### 3. **Structure Preservation**
AI output must match the exact schema:
```typescript
{
  summaryTitle: string;           // Same category, clearer wording
  timingSignal: string;           // Same quality, warmer tone
  recommendedApproach: string[];  // Same count, expanded clarity
  watchOuts: string[];            // Same count, expanded awareness
  nextStep: string;               // Same action, clearer wording
  reflection?: { ... };           // Optional Qur'an context
}
```

### 4. **Safe Fallback**
If AI fails (network, API error, parsing):
```typescript
try {
  const enhanced = await rewriteGuidanceWithAI(...)
  setDisplayResponse(enhanced);
} catch (error) {
  // Silent fallback to original
  setDisplayResponse(originalResponse);
}
```

---

## 🛠️ Implementation Details

### Files Created

#### 1. **types/ai-settings.ts** (162 lines)
```typescript
export type AITone = 'concise' | 'calm' | 'reflective' | 'poetic';

export interface AISettings {
  enabled: boolean;
  tone: AITone;
  disclaimerAcknowledged: boolean;
  updatedAt: number;
}

export interface AIRewriteRequest {
  originalGuidance: {
    summaryTitle: string;
    timingSignal: string;
    recommendedApproach: string[];
    watchOuts: string[];
    nextStep: string;
    disclaimer: string;
  };
  quranContext?: {
    verseReference: string;
    translationEn: string;
  };
  tone: AITone;
  language?: 'en' | 'ar' | 'fr';
}

export interface AIRewriteResponse {
  summaryTitle: string;
  timingSignal: string;
  recommendedApproach: string[];
  watchOuts: string[];
  nextStep: string;
  reflection?: {
    verseReference?: string;
    reflectionPrompt: string;
  };
  disclaimer: string;
  aiAssisted: boolean;
}
```

#### 2. **services/AIReflectionService.ts** (309 lines)
Core AI service with Groq API integration:

```typescript
const GROQ_API_KEY = process.env.EXPO_PUBLIC_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const ENABLE_AI_REFLECTION = false; // OFF by default

export async function rewriteGuidanceWithAI(
  request: AIRewriteRequest
): Promise<AIRewriteResponse> {
  // Build system prompt with strict safety rules
  const systemPrompt = buildSystemPrompt();
  
  // Send to Groq API
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(request) }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    }),
  });
  
  // Parse and return
  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}
```

**System Prompt Safety Rules**:
```
You are a spiritual guidance editor.

STRICT RULES:
1. NEVER predict outcomes or future events
2. NEVER give religious rulings (fatwas)
3. NEVER add new advice or recommendations
4. ONLY rewrite existing text for clarity and warmth
5. PRESERVE the exact structure and meaning
6. DO NOT change the count of bullet points
7. DO NOT add or remove sections
8. KEEP the disclaimer verbatim

Your role: Polish wording only, nothing else.
```

#### 3. **app/ai-settings.tsx** (422 lines)
Full settings screen with:
- ✅ AI enable/disable toggle with first-time disclaimer
- ✅ Tone selector (concise, calm, reflective, poetic)
- ✅ "What AI Does" benefits list
- ✅ "What AI Does NOT Do" limits list
- ✅ Privacy notice (no logging, no cloud storage)
- ✅ Reset to defaults button

#### 4. **components/divine-timing/AIBadge.tsx** (94 lines)
Visual indicator showing "AI-assisted wording":
- ✅ Compact and full size modes
- ✅ Tappable with info dialog
- ✅ Routes to /ai-settings on user request
- ✅ Purple styling (#ede9fe background, #7c3aed text)

### Files Modified

#### 5. **components/divine-timing/DivineTimingGuidanceCard.tsx**
Added AI enhancement logic:

```typescript
export function DivineTimingGuidanceCard({
  response,
  colorScheme,
  onReset,
  quranContext,  // NEW: Optional Qur'an context for AI
}: DivineTimingGuidanceCardProps) {
  const [displayResponse, setDisplayResponse] = useState(response);
  const [aiEnhancing, setAiEnhancing] = useState(false);
  const [aiAssisted, setAiAssisted] = useState(false);
  
  useEffect(() => {
    enhanceWithAI();
  }, [response]);
  
  const enhanceWithAI = async () => {
    try {
      const settings = await loadAISettings();
      
      if (!settings.enabled) {
        setDisplayResponse(response);
        setAiAssisted(false);
        return;
      }
      
      setAiEnhancing(true);
      
      const enhanced = await rewriteGuidanceWithAI({
        originalGuidance: {
          summaryTitle: response.summaryTitle,
          timingSignal: response.timingSignal,
          recommendedApproach: response.recommendedApproach,
          watchOuts: response.watchOuts,
          nextStep: response.nextStep,
          disclaimer: GUIDANCE_DISCLAIMER,
        },
        quranContext,
        tone: settings.tone,
        language: 'en',
      });
      
      const enhancedResponse = {
        ...response,
        summaryTitle: enhanced.summaryTitle,
        timingSignal: enhanced.timingSignal,
        recommendedApproach: enhanced.recommendedApproach,
        watchOuts: enhanced.watchOuts,
        nextStep: enhanced.nextStep,
        reflection: enhanced.reflection && response.reflection
          ? {
              surahNameEn: response.reflection.surahNameEn,
              surahNumber: response.reflection.surahNumber,
              ayahNumber: response.reflection.ayahNumber,
              prompt: enhanced.reflection.reflectionPrompt,
            }
          : undefined,
      };
      
      setDisplayResponse(enhancedResponse);
      setAiAssisted(enhanced.aiAssisted);
    } catch (error) {
      console.error('Failed to enhance with AI:', error);
      setDisplayResponse(response);
      setAiAssisted(false);
    } finally {
      setAiEnhancing(false);
    }
  };
  
  // Show loading state during enhancement
  if (aiEnhancing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="small" color={colors.primary} />
        <Text style={styles.loadingText}>Enhancing guidance...</Text>
      </View>
    );
  }
  
  return (
    <View style={styles.container}>
      {/* Show AI badge when enhanced */}
      <AIBadge show={aiAssisted} />
      
      {/* Render guidance using displayResponse */}
      <Text>{displayResponse.summaryTitle}</Text>
      {/* ... rest of component ... */}
    </View>
  );
}
```

#### 6. **app/divine-timing.tsx**
Pass Qur'an context to guidance card:

```typescript
{guidanceResponse && (
  <DivineTimingGuidanceCard
    response={guidanceResponse}
    colorScheme={colorScheme}
    onReset={handleGuidanceReset}
    quranContext={
      reflection
        ? {
            verseReference: `${reflection.verse.surahNameEn} ${reflection.verse.surahNumber}:${reflection.verse.ayahNumber}`,
            translationEn: reflection.verse.translationEn,
          }
        : undefined
    }
  />
)}
```

---

## 🔐 Privacy & Safety

### No Data Logging
```typescript
// AIReflectionService.ts
// Silent fallback in production (no console logs)
if (__DEV__) {
  console.warn('[AI] Fallback to original guidance:', error);
}
```

### Strict Schema Validation (v6.1)
```typescript
// Zod validation prevents malformed AI responses
const AIRewriteResponseSchema = z.object({
  summaryTitle: z.string().min(1),
  timingSignal: z.string().min(1),
  recommendedApproach: z.array(z.string()),
  watchOuts: z.array(z.string()),
  nextStep: z.string().min(1),
  disclaimer: z.string(),
  aiAssisted: z.boolean(),
});

// Strict validation enforces constraints
function validateAIResponse(original, aiResponse) {
  // Array lengths must match exactly
  // Disclaimer must be verbatim
  // nextStep can't double in length
}
```

### No Cloud Storage
All settings stored locally via AsyncStorage:
```typescript
const AI_SETTINGS_KEY = '@divine_timing_ai_settings';

export async function saveAISettings(settings: AISettings): Promise<void> {
  await AsyncStorage.setItem(AI_SETTINGS_KEY, JSON.stringify(settings));
}
```

### API Key Security ⚠️
```env
# .env (DEVELOPMENT ONLY)
EXPO_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
```

**Production Migration Required**: See [PHASE_6_SECURITY_FIXES.md](PHASE_6_SECURITY_FIXES.md#1-api-key-exposure-in-client) for server endpoint setup.

---

## 🧪 Testing Scenarios

### ✅ Tested Scenarios

1. **AI Disabled (Default)**
   - User opens Divine Timing → Guidance shows original text
   - No AI badge displayed
   - No API calls made

2. **AI Enabled (First Time)**
   - User opens AI Settings → Toggle switch
   - Disclaimer dialog appears → User must acknowledge
   - Settings saved → AI enhancement enabled

3. **AI Enhancement Success**
   - User gets guidance → Loading spinner appears
   - AI enhances text → Badge shows "AI-assisted wording"
   - Badge is tappable → Info dialog explains AI role

4. **AI Fallback (Network Error)**
   - API request fails → Silent fallback to original text
   - No error shown to user → Seamless experience

5. **Tone Switching**
   - User changes tone → Next guidance uses new tone
   - Previous guidance unaffected

---

## 📊 API Usage

### Groq API Configuration
```typescript
Model: llama-3.3-70b-versatile
Temperature: 0.7
Max Tokens: 1500 (guidance) / 500 (istikhārah)
Endpoint: https://api.groq.com/openai/v1/chat/completions
```

### Token Estimates
- Average guidance request: ~800 input + ~600 output = **1,400 tokens**
- Average istikhārah request: ~300 input + ~200 output = **500 tokens**
- Cost: **Free tier** (Groq offers generous limits)

---

## 🎨 UI Components

### AIBadge Component
```typescript
<AIBadge 
  show={aiAssisted}           // Show when AI was used
  size="compact"              // or "full"
  onPress={() => {}}          // Optional custom handler
/>
```

**Visual Design**:
- Background: `#ede9fe` (purple-50)
- Text: `#7c3aed` (purple-600)
- Icon: Sparkles (Ionicons)
- Size: Compact (height 24) / Full (height 32)

### AI Settings Screen
Route: `/ai-settings`

**Sections**:
1. **Enable AI Toggle** - Master switch with disclaimer
2. **Tone Selector** - 4 options in grid layout
3. **What AI Does** - Green card with benefits
4. **What AI Does NOT Do** - Red card with limits
5. **Privacy Notice** - Purple card with guarantees
6. **Reset Button** - Restore defaults

---

## 🚀 Next Steps (Optional Enhancements)

### Not Yet Implemented:
1. **Istikhārah AI Enhancement** - Apply to pattern summaries
2. **AI Settings Link in Navigation** - Add to Life Guidance tab
3. **Arabic Language Support** - Extend AI to Arabic text
4. **Offline Caching** - Cache enhanced responses
5. **Analytics** - Track AI usage (without logging content)

---

## ✅ Phase 6 Completion Checklist

### v6.0 (Initial Implementation)
- [x] Research web app AI implementation (Groq API)
- [x] Create AI settings types
- [x] Implement AI rewrite service
- [x] Create AI settings screen
- [x] Create AI badge component
- [x] Update DivineTimingGuidanceCard with AI support
- [x] Pass Qur'an context from divine-timing.tsx
- [x] Add loading states
- [x] Implement silent fallback
- [x] Test TypeScript compilation
- [x] Document implementation

### v6.1 (Security & Robustness Fixes)
- [x] Add Zod schema validation
- [x] Add robust JSON extraction (handles code fences, extra text)
- [x] Implement strict array length checking
- [x] Enforce verbatim disclaimer validation
- [x] Add `__DEV__` checks for production builds
- [x] Clarify two-level feature flag system
- [x] Add warnings about Qur'an context usage
- [x] Document API key exposure issue
- [x] Create server endpoint migration guide
- [ ] **Migrate to server endpoint** (required before production)

---

## 📝 Usage Example

### For Users:
1. Open **Life Guidance** tab
2. Navigate to **AI Settings** (from menu or badge)
3. Toggle **"Enable AI Assistance"**
4. Acknowledge disclaimer
5. Select preferred tone (calm, reflective, etc.)
6. Return to Divine Timing
7. Get guidance → See enhanced wording with badge

### For Developers:
```typescript
// Use AI enhancement in any guidance component
import { rewriteGuidanceWithAI } from '@/services/AIReflectionService';

const enhanced = await rewriteGuidanceWithAI({
  originalGuidance: {
    summaryTitle: 'Supportive Window',
    timingSignal: 'Energy flows well today',
    recommendedApproach: ['Act with confidence'],
    watchOuts: [],
    nextStep: 'Begin your task',
    disclaimer: GUIDANCE_DISCLAIMER,
  },
  quranContext: {
    verseReference: 'Al-Baqarah 2:286',
    translationEn: 'Allah does not burden a soul...',
  },
  tone: 'calm',
  language: 'en',
});
```

---

## 🎉 Conclusion

Phase 6 is **COMPLETE** with all core features and security fixes:

### v6.0 (Initial)
✅ AI service with Groq API integration  
✅ Settings screen with full UI  
✅ Badge component for transparency  
✅ Divine Timing integration  
✅ Safe fallback on errors  
✅ Privacy-first design  
✅ OFF by default  

### v6.1 (Security & Robustness)
✅ Zod schema validation  
✅ Robust JSON extraction (handles code fences, extra text)  
✅ Strict array length enforcement  
✅ Verbatim disclaimer checking  
✅ Silent fallback in production (`__DEV__` checks)  
✅ Clear two-level feature flag system  
✅ Qur'an context warnings  
⚠️ **API key exposure documented** - requires server endpoint for production  

The AI **ONLY polishes wording** and **NEVER computes** spiritual decisions.  
All mathematical calculations remain **100% deterministic**.

**Next Step**: Migrate to server endpoint before production deployment.  
See [PHASE_6_SECURITY_FIXES.md](PHASE_6_SECURITY_FIXES.md) for migration guide.

---

**Implementation Date**: December 2025  
**Model**: Groq llama-3.3-70b-versatile (70B)  
**Version**: 6.1 (with security fixes)  
**Status**: ✅ READY FOR DEVELOPMENT, ⚠️ NEEDS SERVER MIGRATION FOR PRODUCTION
