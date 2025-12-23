# Arabic Keyboard - Developer Quick Start

## 🚀 Quick Integration Guide

### 1. Import the Component

```tsx
import ArabicKeyboard from '@/components/istikhara/ArabicKeyboard';
```

### 2. Add Required State

```tsx
const [showKeyboard, setShowKeyboard] = useState(false);
const [text, setText] = useState('');
const [cursorPosition, setCursorPosition] = useState(0);
```

### 3. Implement Handlers

```tsx
const handleKeyPress = (key: string) => {
  const newValue = text.slice(0, cursorPosition) + key + text.slice(cursorPosition);
  setText(newValue);
  setCursorPosition(cursorPosition + 1);
};

const handleBackspace = () => {
  if (cursorPosition > 0) {
    const newValue = text.slice(0, cursorPosition - 1) + text.slice(cursorPosition);
    setText(newValue);
    setCursorPosition(cursorPosition - 1);
  }
};

const handleSpace = () => {
  handleKeyPress(' ');
};
```

### 4. Add TextInput with Cursor Tracking

```tsx
<TextInput
  value={text}
  onChangeText={setText}
  onSelectionChange={(e) => setCursorPosition(e.nativeEvent.selection.start)}
  selection={{ start: cursorPosition, end: cursorPosition }}
  textAlign="right"
/>
```

### 5. Add Trigger Button

```tsx
<TouchableOpacity onPress={() => setShowKeyboard(true)}>
  <Text>Show Keyboard</Text>
</TouchableOpacity>
```

### 6. Render Keyboard

```tsx
<ArabicKeyboard
  visible={showKeyboard}
  onClose={() => setShowKeyboard(false)}
  onKeyPress={handleKeyPress}
  onBackspace={handleBackspace}
  onSpace={handleSpace}
/>
```

## 📝 Complete Example

```tsx
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import ArabicKeyboard from '@/components/istikhara/ArabicKeyboard';

export default function MyComponent() {
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [text, setText] = useState('');
  const [cursorPosition, setCursorPosition] = useState(0);

  const handleKeyPress = (key: string) => {
    const newValue = text.slice(0, cursorPosition) + key + text.slice(cursorPosition);
    setText(newValue);
    setCursorPosition(cursorPosition + 1);
  };

  const handleBackspace = () => {
    if (cursorPosition > 0) {
      const newValue = text.slice(0, cursorPosition - 1) + text.slice(cursorPosition);
      setText(newValue);
      setCursorPosition(cursorPosition - 1);
    }
  };

  const handleSpace = () => {
    handleKeyPress(' ');
  };

  return (
    <View>
      <TextInput
        value={text}
        onChangeText={setText}
        onSelectionChange={(e) => setCursorPosition(e.nativeEvent.selection.start)}
        selection={{ start: cursorPosition, end: cursorPosition }}
        textAlign="right"
        placeholder="أدخل النص هنا"
      />
      
      <TouchableOpacity onPress={() => setShowKeyboard(true)}>
        <Text>Show Arabic Keyboard</Text>
      </TouchableOpacity>

      <ArabicKeyboard
        visible={showKeyboard}
        onClose={() => setShowKeyboard(false)}
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
        onSpace={handleSpace}
      />
    </View>
  );
}
```

## 🎯 Key Points

1. **State Management**
   - `showKeyboard`: Controls modal visibility
   - `text`: Stores the input value
   - `cursorPosition`: Tracks where to insert text

2. **Cursor Position**
   - MUST track cursor position for proper text insertion
   - Use `onSelectionChange` event
   - Set `selection` prop on TextInput

3. **Text Direction**
   - Use `textAlign="right"` for RTL support
   - Keyboard handles RTL layout automatically

4. **Event Handlers**
   - `onKeyPress`: Insert character at cursor
   - `onBackspace`: Delete before cursor
   - `onSpace`: Insert space character
   - `onClose`: Dismiss keyboard

## 🔧 Props Reference

```typescript
interface ArabicKeyboardProps {
  visible: boolean;              // Required: Show/hide keyboard
  onClose: () => void;           // Required: Close handler
  onKeyPress: (key: string) => void;  // Required: Character insertion
  onBackspace: () => void;       // Required: Delete handler
  onSpace: () => void;           // Required: Space handler
}
```

## 📱 Testing

### Test Checklist

```tsx
// 1. Test keyboard opens
setShowKeyboard(true); // ✓ Keyboard appears

// 2. Test letter input
handleKeyPress('م'); // ✓ Letter appears in input

// 3. Test diacritics
// Toggle to diacritics view, tap فتحة
handleKeyPress('َ'); // ✓ Diacritic appears

// 4. Test backspace
handleBackspace(); // ✓ Last character removed

// 5. Test space
handleSpace(); // ✓ Space inserted

// 6. Test close
setShowKeyboard(false); // ✓ Keyboard closes
```

## 🎨 Styling

The keyboard uses dark theme by default. To customize:

```tsx
// Fork ArabicKeyboard.tsx and modify styles
const styles = StyleSheet.create({
  keyboardContainer: {
    backgroundColor: '#YOUR_COLOR', // Change background
  },
  key: {
    backgroundColor: '#YOUR_COLOR', // Change key color
  },
  // ... modify other styles
});
```

## 🚨 Common Mistakes

❌ **Wrong**: Not tracking cursor position
```tsx
// Text always appends to end
setText(text + key);
```

✅ **Correct**: Insert at cursor position
```tsx
const newValue = text.slice(0, cursorPosition) + key + text.slice(cursorPosition);
setText(newValue);
setCursorPosition(cursorPosition + 1);
```

❌ **Wrong**: No selection control
```tsx
<TextInput value={text} />
```

✅ **Correct**: Track and control selection
```tsx
<TextInput
  value={text}
  onSelectionChange={(e) => setCursorPosition(e.nativeEvent.selection.start)}
  selection={{ start: cursorPosition, end: cursorPosition }}
/>
```

## 📚 Additional Resources

- [Full Documentation](./ARABIC_KEYBOARD_README.md)
- [Usage Guide](./ARABIC_KEYBOARD_USAGE.md)
- [Visual Reference](./ARABIC_KEYBOARD_VISUAL_REFERENCE.md)
- [Demo Component](./ArabicKeyboardDemo.tsx)

## 🐛 Troubleshooting

**Problem**: Keyboard doesn't appear  
**Solution**: Check `visible` prop is `true`

**Problem**: Text appears in wrong position  
**Solution**: Ensure cursor position tracking is implemented

**Problem**: Backspace doesn't work  
**Solution**: Check `cursorPosition > 0` before deleting

**Problem**: Keyboard won't close  
**Solution**: Implement `onClose` handler properly

## 💡 Pro Tips

1. **Debounce Updates**: For performance with large text
2. **Validation**: Validate Arabic characters on input
3. **Persistence**: Save state to AsyncStorage if needed
4. **Analytics**: Track keyboard usage metrics
5. **A/B Testing**: Test different layouts with users

## 🎓 Learn More

See the existing integration in:
- [NameInputSection.tsx](./NameInputSection.tsx)

This shows the keyboard in production use within the Istikhara form.

---

**Need Help?** Check the documentation or create an issue.
