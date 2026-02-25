/**
 * NameAutocomplete Component for React Native
 * West African name autocomplete with Latin-to-Arabic transliteration
 * Provides compact inline dropdown suggestions as user types
 */

import { Search, X } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    Keyboard,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { getNameDisplayLabel, NameMatch, searchNameTransliterations } from '../data/nameTransliterations';

interface NameAutocompleteProps {
  /** Current Latin input value */
  value: string;
  /** Callback when Latin input changes */
  onChange: (value: string) => void;
  /** Callback when Arabic name is selected */
  onArabicSelect: (arabic: string, latin: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Additional style for container */
  style?: any;
  /** Show helper text */
  showHelper?: boolean;
  /** Language for helper text */
  language?: 'en' | 'fr' | 'ar';
}

export default function NameAutocomplete({
  value,
  onChange,
  onArabicSelect,
  placeholder = 'e.g., Fatima, Ibrahima, Amadou',
  style,
  showHelper = true,
  language = 'en'
}: NameAutocompleteProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [matches, setMatches] = useState<NameMatch[]>([]);
  const [isFocused, setIsFocused] = useState(false);
  const containerRef = useRef<View>(null);

  // Search for matches when input changes
  useEffect(() => {
    if (value.trim().length > 0) {
      const results = searchNameTransliterations(value);
      setMatches(results);
      // Only show dropdown if focused and has results
      if (isFocused && results.length > 0) {
        setShowDropdown(true);
      }
    } else {
      setMatches([]);
      setShowDropdown(false);
    }
  }, [value, isFocused]);

  const handleSelectName = (item: NameMatch) => {
    onChange(item.matchedVariation);
    onArabicSelect(item.arabic, item.matchedVariation);
    setShowDropdown(false);
    Keyboard.dismiss();
  };

  const handleClearInput = () => {
    onChange('');
    setMatches([]);
    setShowDropdown(false);
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (matches.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleBlur = () => {
    // Delay to allow tap on dropdown item to register
    setTimeout(() => {
      setIsFocused(false);
      setShowDropdown(false);
    }, 300);
  };

  const dismissDropdown = () => {
    setShowDropdown(false);
    Keyboard.dismiss();
  };

  return (
    <View style={[styles.container, style]} ref={containerRef}>
      {/* Input Field */}
      <View style={styles.inputWrapper}>
        <View style={styles.inputContainer}>
          <View style={styles.searchIcon}>
            <Search size={16} color="#94a3b8" />
          </View>
          <TextInput
            style={styles.input}
            value={value}
            onChangeText={onChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            placeholder={placeholder}
            placeholderTextColor="#64748b"
          />
          {value ? (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClearInput}
            >
              <X size={16} color="#94a3b8" />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Inline Dropdown - positioned absolutely below input */}
        {showDropdown && matches.length > 0 && (
          <View style={styles.dropdownContainer}>
            <ScrollView 
              style={styles.dropdown}
              keyboardShouldPersistTaps="handled"
              nestedScrollEnabled={true}
              showsVerticalScrollIndicator={true}
            >
              {matches.slice(0, 8).map((item, index) => (
                <Pressable
                  key={`${item.arabic}-${index}`}
                  style={[
                    styles.dropdownItem,
                    index === matches.slice(0, 8).length - 1 && styles.dropdownItemLast
                  ]}
                  onPressIn={() => handleSelectName(item)}
                >
                  <Text style={styles.dropdownItemLatin}>
                    {getNameDisplayLabel(item)}
                  </Text>
                  <Text style={styles.dropdownItemArabic}>
                    {item.arabic}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Helper Text */}
      {showHelper && (
        <Text style={styles.helperText}>
          {matches.length > 0 
            ? (language === 'en' 
              ? 'Start typing to see Arabic suggestions' 
              : 'ابدأ الكتابة لرؤية الاقتراحات العربية')
            : (language === 'en'
              ? 'Type your name in Latin letters - we\'ll show the Arabic equivalent'
              : 'اكتب اسمك بالأحرف اللاتينية - سنعرض المعادل العربي')}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  inputWrapper: {
    position: 'relative',
    zIndex: 1000,
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    zIndex: 1,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderWidth: 2,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    borderRadius: 12,
    paddingLeft: 44,
    paddingRight: 44,
    paddingVertical: 14,
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  clearButton: {
    position: 'absolute',
    right: 14,
    padding: 4,
  },
  helperText: {
    marginTop: 6,
    fontSize: 12,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  dropdownContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: 4,
    backgroundColor: 'rgba(30, 41, 59, 0.98)',
    borderRadius: 12,
    maxHeight: 200,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.4)',
    shadowColor: '#8b5cf6',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 10,
    overflow: 'hidden',
  },
  dropdown: {
    maxHeight: 200,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.15)',
  },
  dropdownItemLast: {
    borderBottomWidth: 0,
  },
  dropdownItemLatin: {
    fontSize: 15,
    fontWeight: '500',
    color: '#e0e7ff',
    flex: 1,
  },
  dropdownItemArabic: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    marginLeft: 16,
  },
  noMatchesContainer: {
    marginTop: 8,
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
  },
  noMatchesText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
  },
});
