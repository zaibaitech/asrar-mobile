/**
 * Arabic Keyboard Demo
 * 
 * This file demonstrates the Arabic keyboard component in isolation.
 * Useful for testing and showcasing the keyboard functionality.
 * 
 * To use: Import this component in your app or navigation.
 */

import { Keyboard } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import ArabicKeyboard from './ArabicKeyboard';

export default function ArabicKeyboardDemo() {
  const [text, setText] = useState('');
  const [showKeyboard, setShowKeyboard] = useState(false);
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

  const handleClear = () => {
    setText('');
    setCursorPosition(0);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Arabic Keyboard Demo</Text>
          <Text style={styles.subtitle}>
            Test the on-screen Arabic keyboard with full alphabet support
          </Text>
        </View>

        {/* Demo Card */}
        <View style={styles.demoCard}>
          <Text style={styles.cardTitle}>Type Arabic Text</Text>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>Arabic Input</Text>
              <TouchableOpacity
                style={styles.keyboardButton}
                onPress={() => setShowKeyboard(true)}
              >
                <Keyboard size={16} color="#E5E7EB" strokeWidth={2} />
                <Text style={styles.keyboardButtonText}>Show Keyboard</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={text}
                onChangeText={setText}
                placeholder="أدخل النص العربي هنا"
                placeholderTextColor="#6B7280"
                textAlign="right"
                multiline
                numberOfLines={4}
                onSelectionChange={(event) =>
                  setCursorPosition(event.nativeEvent.selection.start)
                }
                selection={{ start: cursorPosition, end: cursorPosition }}
              />
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={handleClear}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
              <Text style={styles.charCount}>{text.length} characters</Text>
            </View>
          </View>

          {/* Display Section */}
          <View style={styles.displaySection}>
            <Text style={styles.displayLabel}>Output Preview:</Text>
            <View style={styles.displayBox}>
              <Text style={styles.displayText}>
                {text || 'No text entered yet...'}
              </Text>
            </View>
          </View>
        </View>

        {/* Features List */}
        <View style={styles.featuresCard}>
          <Text style={styles.cardTitle}>Features</Text>
          
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>
              28 Arabic letters (ا to ي)
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>
              8 common diacritics (fatha, kasra, damma, etc.)
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>
              Backspace, space bar, and close button
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>
              Text insertion at cursor position
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>
              Responsive design for all screen sizes
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>✓</Text>
            <Text style={styles.featureText}>
              Smooth animations and transitions
            </Text>
          </View>
        </View>

        {/* Usage Instructions */}
        <View style={styles.instructionsCard}>
          <Text style={styles.cardTitle}>How to Use</Text>
          
          <View style={styles.instruction}>
            <Text style={styles.instructionNumber}>1</Text>
            <Text style={styles.instructionText}>
              Tap "Show Keyboard" button to open the Arabic keyboard
            </Text>
          </View>

          <View style={styles.instruction}>
            <Text style={styles.instructionNumber}>2</Text>
            <Text style={styles.instructionText}>
              Tap letters to type. Switch to "التشكيل" for diacritics
            </Text>
          </View>

          <View style={styles.instruction}>
            <Text style={styles.instructionNumber}>3</Text>
            <Text style={styles.instructionText}>
              Use backspace (⌫) to delete, space bar for spaces
            </Text>
          </View>

          <View style={styles.instruction}>
            <Text style={styles.instructionNumber}>4</Text>
            <Text style={styles.instructionText}>
              Close keyboard by tapping "إغلاق" or tapping outside
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Arabic Keyboard */}
      <ArabicKeyboard
        visible={showKeyboard}
        onClose={() => setShowKeyboard(false)}
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
        onSpace={handleSpace}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },

  scrollView: {
    flex: 1,
  },

  header: {
    padding: 24,
    backgroundColor: '#1F2937',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    lineHeight: 24,
  },

  demoCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 16,
  },

  inputSection: {
    marginBottom: 20,
  },

  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  label: {
    fontSize: 15,
    fontWeight: '500',
    color: '#E5E7EB',
  },

  keyboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#4B5563',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },

  keyboardButtonText: {
    fontSize: 13,
    color: '#E5E7EB',
    fontWeight: '500',
  },

  inputContainer: {
    backgroundColor: '#374151',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#4B5563',
    padding: 16,
    minHeight: 120,
  },

  input: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'right',
    lineHeight: 28,
  },

  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },

  clearButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },

  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  charCount: {
    fontSize: 13,
    color: '#9CA3AF',
  },

  displaySection: {
    marginTop: 12,
  },

  displayLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
    marginBottom: 8,
  },

  displayBox: {
    backgroundColor: '#111827',
    borderRadius: 8,
    padding: 16,
    minHeight: 80,
  },

  displayText: {
    fontSize: 20,
    color: '#10B981',
    textAlign: 'right',
    lineHeight: 32,
  },

  featuresCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },

  featureIcon: {
    fontSize: 18,
    color: '#10B981',
    marginRight: 12,
    width: 24,
  },

  featureText: {
    fontSize: 15,
    color: '#E5E7EB',
    flex: 1,
    lineHeight: 22,
  },

  instructionsCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: '#374151',
  },

  instruction: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },

  instructionNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4F46E5',
    backgroundColor: '#312E81',
    width: 28,
    height: 28,
    borderRadius: 14,
    textAlign: 'center',
    lineHeight: 28,
    marginRight: 12,
  },

  instructionText: {
    fontSize: 15,
    color: '#E5E7EB',
    flex: 1,
    lineHeight: 22,
  },
});
