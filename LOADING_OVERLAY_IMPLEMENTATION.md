# Loading Overlay with Spinning Logo

## Overview
A polished 5-second loading animation displayed during Istikhara calculations, featuring the Asrār logo with smooth spinning and pulsing effects.

## Features

### ✨ Visual Effects
- **Spinning Animation**: Slow rotation (3 seconds per full rotation)
- **Pulsing Effect**: Gentle breathing animation (scales from 1.0 to 1.15)
- **Glow Effect**: Purple aura around the logo
- **Fade In/Out**: Smooth entrance and exit transitions
- **Progress Bar**: Animated progress from 0% to 100%
- **Progress Indicator**: Three mystical dots that activate sequentially
- **Percentage Display**: Real-time progress percentage

### 🎯 User Experience
- **Full-Screen Overlay**: Prevents interaction during calculation
- **5-Second Duration**: Automatic dismissal after completion
- **Smooth Animations**: 60fps using native driver
- **Multilingual**: Supports English and French text
- **Professional Polish**: Creates anticipation for results

## Component Structure

### LoadingOverlay.tsx

```typescript
interface LoadingOverlayProps {
  visible: boolean;     // Show/hide overlay
  onComplete: () => void;  // Callback when 5 seconds complete
}
```

### Animation Details

#### 1. Spinning Animation
- **Duration**: 3000ms per rotation
- **Easing**: Linear
- **Loop**: Continuous
- **Range**: 0° to 360°

#### 2. Pulsing Animation
- **Duration**: 3000ms total (1500ms expand + 1500ms contract)
- **Easing**: Ease in/out
- **Loop**: Continuous
- **Scale Range**: 1.0 to 1.15

#### 3. Fade Animation
- **Fade In**: 300ms
- **Fade Out**: 300ms
- **Easing**: Default

#### 4. Progress Animation
- **Duration**: 5000ms
- **Update Frequency**: Every 100ms
- **Increment**: 2% per update
- **Final Value**: 100%

## Integration in Istikhara Form

### State Management
```typescript
const [showLoadingOverlay, setShowLoadingOverlay] = useState(false);
const [calculationComplete, setCalculationComplete] = useState(false);
```

### Flow Sequence

```
User clicks "Calculate" button
         ↓
handleCalculate() called
         ↓
setShowLoadingOverlay(true)
         ↓
Perform calculation (API/local)
         ↓
setCalculationComplete(true)
         ↓
Wait for 5-second animation
         ↓
handleLoadingComplete() called
         ↓
setShowLoadingOverlay(false)
         ↓
Navigate to results page
```

### Code Example

```typescript
const handleCalculate = async () => {
  // Show loading overlay
  setShowLoadingOverlay(true);
  setCalculationComplete(false);
  
  // Perform the calculation
  await calculate(personName.trim(), motherName.trim(), 'en');
  
  // Mark calculation as complete
  setCalculationComplete(true);
};

const handleLoadingComplete = async () => {
  setShowLoadingOverlay(false);
  
  // Navigate to results if successful
  if (calculationComplete && !error && result) {
    router.push({
      pathname: '/istikhara/results',
      params: { data: JSON.stringify(result.data) },
    });
  }
};
```

## Visual Design

### Layout Structure
```
┌─────────────────────────────────┐
│                                  │
│                                  │
│          ╭───────╮              │
│         │  Logo  │  ← Spinning  │
│         │  (Glow)│  & Pulsing   │
│          ╰───────╯              │
│                                  │
│     Calcul en cours...          │
│  Preparing your spiritual...    │
│                                  │
│  ████████████░░░░░░  75%        │
│         ● ● ○                   │
│                                  │
└─────────────────────────────────┘
```

### Color Scheme
```typescript
Background: rgba(17, 24, 39, 0.98)  // Near-black with slight transparency
Logo Glow:  #7C3AED                 // Purple
Text:       #FFFFFF                 // White
Subtext:    #9CA3AF                 // Light gray
Progress:   #7C3AED                 // Purple
Progress BG: #374151                // Dark gray
Dots:       #374151 → #7C3AED      // Gray to purple when active
```

### Typography
- **Main Text**: 22px, bold, white
- **Sub Text**: 15px, regular, gray
- **Progress**: 14px, bold, purple

## Timing Breakdown

```
0ms   - Overlay appears (fade in 300ms)
0ms   - Spinning starts
0ms   - Pulsing starts
0ms   - Progress starts (0%)
100ms - Progress: 2%
200ms - Progress: 4%
...
1666ms - First dot activates (33%)
3333ms - Second dot activates (66%)
5000ms - Third dot activates (100%)
5000ms - Overlay fades out (300ms)
5300ms - Navigation to results
```

## Multilingual Support

### English
```
Main: "Calculating..."
Sub:  "Preparing your spiritual profile"
```

### French
```
Main: "Calcul en cours..."
Sub:  "Préparation de votre profil spirituel"
```

Language is automatically detected from `LanguageContext`.

## Performance Optimizations

### Native Driver Usage
```typescript
useNativeDriver: true  // For all animations
```
Benefits:
- 60fps smooth animations
- Off the main thread
- Better battery efficiency
- No blocking UI

### Animation Cleanup
```typescript
return () => {
  clearTimeout(timer);
  clearInterval(progressInterval);
  spinAnimation.stop();
  pulseAnimation.stop();
};
```

### State Reset
```typescript
if (!visible) {
  fadeValue.setValue(0);
  spinValue.setValue(0);
  pulseValue.setValue(1);
  setProgress(0);
}
```

## Error Handling

### Error During Calculation
```typescript
try {
  await calculate(...);
  setCalculationComplete(true);
} catch (err) {
  setShowLoadingOverlay(false);  // Hide overlay immediately
  // Show error alert
}
```

### Error Detection
```typescript
React.useEffect(() => {
  if (error) {
    setShowLoadingOverlay(false);  // Auto-hide on error
    Alert.alert('Calculation Error', String(error));
  }
}, [error]);
```

## Accessibility

### Screen Reader Support
- Main text announces calculation status
- Progress percentage provides numeric feedback

### Visual Feedback
- High contrast text (white on dark)
- Clear progress indication
- Multiple feedback methods (spinner, pulse, progress bar, dots)

### User Control
- Cannot dismiss manually (intentional - ensures 5-second duration)
- Prevents double-submission via disabled button
- Clear visual state throughout

## Customization Options

### Adjust Animation Speed

```typescript
// Faster spinning (2 seconds per rotation)
duration: 2000

// Slower spinning (4 seconds per rotation)
duration: 4000

// Faster pulsing
duration: 1000  // 500ms expand + 500ms contract
```

### Adjust Duration

```typescript
// Change total overlay duration
const timer = setTimeout(() => {
  onComplete();
}, 3000);  // 3 seconds instead of 5

// Update progress increment accordingly
return prev + (100 / 30);  // For 3 seconds (30 * 100ms)
```

### Add Glow Intensity

```typescript
glowEffect: {
  shadowRadius: 60,      // Larger glow (default: 40)
  shadowOpacity: 1.0,    // More intense (default: 0.8)
}
```

## Testing Checklist

- [x] Overlay appears on Calculate button press
- [x] Logo spins smoothly (3s rotation)
- [x] Logo pulses gently (breathing effect)
- [x] Glow effect visible around logo
- [x] Progress bar animates from 0% to 100%
- [x] Percentage updates every 100ms
- [x] Dots activate at 33%, 66%, 100%
- [x] Text changes based on language
- [x] Overlay auto-dismisses after 5 seconds
- [x] Navigation occurs after overlay completes
- [x] Button disabled during overlay
- [x] Error hides overlay immediately
- [x] No TypeScript errors
- [x] Smooth 60fps animations

## Known Issues

None at this time.

## Future Enhancements

Possible improvements:
- [ ] Haptic feedback at progress milestones
- [ ] Sound effects (optional toggle)
- [ ] Custom messages based on calculation stage
- [ ] Skip button for returning users
- [ ] Progress animation variations
- [ ] Theme-based color schemes
- [ ] Additional element-based glow colors

## Files

### Created
- [components/istikhara/LoadingOverlay.tsx](../components/istikhara/LoadingOverlay.tsx)

### Modified
- [app/istikhara/form.tsx](../app/istikhara/form.tsx)
  - Added `showLoadingOverlay` state
  - Added `calculationComplete` state
  - Updated `handleCalculate` function
  - Added `handleLoadingComplete` function
  - Updated error handling useEffect
  - Added LoadingOverlay component to JSX
  - Updated button disabled states

## Usage

The loading overlay is automatically triggered when users click the "Calculate Istikhara" button. No additional configuration needed - it's fully integrated into the form workflow.

---

**Implementation Date**: December 22, 2025  
**Status**: ✅ Production Ready  
**Performance**: 60fps animations  
**Tested**: All features working as expected
