# Phase 6 Quick Reference

## ⚠️ CRITICAL SECURITY NOTICE

**API Key Exposed in Client**: EXPO_PUBLIC_* variables are bundled into the app and can be extracted.

**FOR PRODUCTION**: You MUST move Groq API calls to a server endpoint (Supabase Edge Function, Cloudflare Worker, etc.) and keep the API key server-side only.

See [PHASE_6_SECURITY_FIXES.md](PHASE_6_SECURITY_FIXES.md) for full details.

---

## Setup

1. **Add Groq API Key to .env** (DEVELOPMENT ONLY):
```env
EXPO_PUBLIC_GROQ_API_KEY=your_key_here
```

⚠️ **This exposes your key in the app bundle. For production, use a server endpoint.**

2. **Feature Flag** (User Control):
AI is controlled by user settings in the app. The build-time capability flag is enabled by default:
```typescript
const ENABLE_AI_CAPABILITY = true; // In AIReflectionService.ts
```

If you need to disable AI for a specific build, set this to `false`.

## Usage in Components

### Import
```typescript
import { rewriteGuidanceWithAI, loadAISettings } from '@/services/AIReflectionService';
import { AIBadge } from '@/components/divine-timing/AIBadge';
```

### Enhance Guidance
```typescript
const enhanceWithAI = async () => {
  const settings = await loadAISettings();
  
  if (!settings.enabled) {
    setDisplayResponse(originalResponse);
    return;
  }
  
  const enhanced = await rewriteGuidanceWithAI({
    originalGuidance: {
      summaryTitle: response.summaryTitle,
      timingSignal: response.timingSignal,
      recommendedApproach: response.recommendedApproach,
      watchOuts: response.watchOuts,
      nextStep: response.nextStep,
      disclaimer: GUIDANCE_DISCLAIMER,
    },
    quranContext: {
      verseReference: 'Al-Baqarah 2:286',
      translationEn: 'Translation text...',
    },
    tone: settings.tone,
    language: 'en',
  });
  
  setDisplayResponse(enhanced);
  setAiAssisted(enhanced.aiAssisted);
};
```

### Show AI Badge
```typescript
<AIBadge show={aiAssisted} />
```

## Key Files

- **Types**: [types/ai-settings.ts](types/ai-settings.ts)
- **Service**: [services/AIReflectionService.ts](services/AIReflectionService.ts)
- **Settings Screen**: [app/ai-settings.tsx](app/ai-settings.tsx)
- **Badge Component**: [components/divine-timing/AIBadge.tsx](components/divine-timing/AIBadge.tsx)
- **Integration Example**: [components/divine-timing/DivineTimingGuidanceCard.tsx](components/divine-timing/DivineTimingGuidanceCard.tsx)

## Safety Rules

✅ **AI is OFF by default** - User must enable in settings  
✅ **AI only rewrites text**, never computes timing/decisions  
✅ **Silent fallback** to original text on errors (no console logs in production)  
✅ **No logging** of user data  
✅ **Local storage only** (AsyncStorage)  
✅ **Schema validation** with Zod prevents malformed responses  
✅ **Strict validation** enforces array lengths and verbatim disclaimer  
⚠️ **API key security** - MUST use server endpoint for production

## Security & Robustness (v6.1)

All critical issues fixed:
- ✅ Zod schema validation prevents malformed AI responses
- ✅ Strict array length checking enforces structure
- ✅ `__DEV__` checks for silent fallback in production
- ✅ Disclaimer must be verbatim
- ⚠️ **API key still exposed** - migrate to server endpoint before production

See [PHASE_6_SECURITY_FIXES.md](PHASE_6_SECURITY_FIXES.md) for details.

## Testing

1. **Test with AI disabled**: Original text should show, no badge
2. **Test with AI enabled**: Enhanced text + badge appears
3. **Test network failure**: Should fallback silently to original
4. **Test tone switching**: Different tones produce different styles

## Groq API Details

- **Model**: llama-3.3-70b-versatile
- **Temperature**: 0.7
- **Max Tokens**: 1500 (guidance) / 500 (istikhārah)
- **Endpoint**: https://api.groq.com/openai/v1/chat/completions
- **Cost**: Free tier available
