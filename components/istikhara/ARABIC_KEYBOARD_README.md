# Arabic On-Screen Keyboard

## Overview
A native Arabic keyboard component integrated into the Istikhara form, providing full Arabic alphabet support with diacritics for easy Arabic text input.

## Features

### ✨ Complete Arabic Support
- **28 Arabic Letters**: Full alphabet from ا to ي
- **8 Diacritics**: Common Arabic diacritical marks
  - فتحة (Fatha) َ
  - تنوين فتح (Tanween Fath) ً
  - كسرة (Kasra) ِ
  - تنوين كسر (Tanween Kasr) ٍ
  - ضمة (Damma) ُ
  - تنوين ضم (Tanween Damm) ٌ
  - سكون (Sukun) ْ
  - شدة (Shadda) ّ

### 🎨 Layout Design
- **Compact 5-Row Layout**: All 28 letters visible without scrolling
- **Toggle Interface**: Switch between letters and diacritics
- **Responsive**: Adapts to screen width automatically
- **Right-to-Left**: Proper Arabic text direction

### 🔧 Functional Keys
- **Backspace** (⌫): Delete character before cursor
- **Space Bar** (مسافة): Insert space
- **Close Button** (إغلاق): Dismiss keyboard
- **Cursor Position**: Insert text at current cursor position

### 📱 User Experience
- **Smooth Animation**: Slide-up animation on open
- **Modal Overlay**: Tap outside to close
- **Visual Feedback**: Active state on key press
- **Scrollable**: Content scrolls if screen is small

## Component Structure

### Files
```
components/istikhara/
├── ArabicKeyboard.tsx        # Main keyboard component
└── NameInputSection.tsx      # Updated with keyboard integration
```

### ArabicKeyboard Component

```tsx
interface ArabicKeyboardProps {
  visible: boolean;           // Show/hide keyboard
  onClose: () => void;        // Close handler
  onKeyPress: (key: string) => void;  // Character insertion
  onBackspace: () => void;    // Backspace handler
  onSpace: () => void;        // Space bar handler
}
```

## Usage

### Integration in NameInputSection

The keyboard is automatically integrated into the Arabic name input fields:

1. **Trigger Button**: "Show Keyboard" (عرض لوحة المفاتيح) button appears next to Arabic Name label
2. **Text Insertion**: Characters insert at cursor position
3. **Cursor Tracking**: Input field tracks cursor position for proper insertion
4. **Dismissal**: Close via button or tap outside

### User Flow

```
1. User clicks "Show Keyboard" button
   ↓
2. Keyboard slides up from bottom
   ↓
3. User taps letters to input text
   ↓
4. Toggle to diacritics tab if needed
   ↓
5. Use backspace to delete
   ↓
6. Close keyboard when done
```

## Layout Details

### Letters Layout (Default View)
```
Row 1: ض ص ث ق ف غ ع
Row 2: ه خ ح ج د ش س
Row 3: ظ ط ذ ز ر و ي
Row 4: ة ى ء ؤ ئ ا ب
Row 5: ن م ك ل ت
Bottom: [⌫] [مسافة] [إغلاق]
```

### Diacritics Layout (Toggle View)
```
Grid: 4 columns × 2 rows
[◌َ فتحة] [◌ً تنوين فتح] [◌ِ كسرة] [◌ٍ تنوين كسر]
[◌ُ ضمة] [◌ٌ تنوين ضم] [◌ْ سكون] [◌ّ شدة]
Bottom: [⌫] [مسافة] [إغلاق]
```

## Technical Implementation

### State Management
```tsx
const [showKeyboard, setShowKeyboard] = useState(false);
const [cursorPosition, setCursorPosition] = useState(0);
```

### Text Insertion Logic
```tsx
const handleKeyPress = (key: string) => {
  const newValue =
    arabicValue.slice(0, cursorPosition) + 
    key + 
    arabicValue.slice(cursorPosition);
  onArabicChange(newValue);
  setCursorPosition(cursorPosition + 1);
};
```

### Animation
- Spring animation on open (tension: 65, friction: 11)
- Timing animation on close (duration: 200ms)
- Slide up from bottom with translateY

## Responsive Design

### Key Sizing
```tsx
const keyWidth = (screenWidth - 48) / 7 - 4;
```
- Dynamically calculated based on screen width
- 7 keys per row (standard Arabic keyboard layout)
- Maintains proper spacing on all devices

### Maximum Height
- Keyboard container: 70% of screen height
- Scrollable content if needed
- Bottom row always visible

## Styling

### Color Scheme
- Background: `#1F2937` (Dark gray)
- Keys: `#374151` (Medium gray)
- Active Toggle: `#4F46E5` (Indigo)
- Backspace: `#EF4444` (Red)
- Text: `#FFFFFF` (White)

### Typography
- Letters: 24px, bold
- Diacritics: 32px
- Labels: 11px, gray
- Header: 18px, semi-bold

## Accessibility

- Large touch targets (48px height for letters)
- Clear visual feedback
- High contrast colors
- RTL text support
- Logical tab order

## Performance

- Animated with native driver for smooth 60fps
- Minimal re-renders with proper state management
- Event propagation handled correctly
- No memory leaks (cleanup in useEffect)

## Future Enhancements

Possible improvements:
- [ ] Haptic feedback on key press
- [ ] Sound effects (optional)
- [ ] Long-press for alternative characters
- [ ] Swipe gestures for quick input
- [ ] Keyboard shortcuts
- [ ] Custom key layouts
- [ ] Theme customization
- [ ] Landscape orientation support

## Testing Checklist

- [x] All 28 Arabic letters display correctly
- [x] Diacritics tab shows all 8 marks
- [x] Backspace deletes at cursor position
- [x] Space bar inserts space
- [x] Close button dismisses keyboard
- [x] Tap outside closes keyboard
- [x] Animation is smooth
- [x] Responsive on different screen sizes
- [x] RTL text direction works
- [x] No TypeScript errors

## Known Issues

None at this time.

## Support

For issues or questions, contact the development team or create an issue in the repository.
