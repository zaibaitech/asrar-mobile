/**
 * NameAutocomplete Component for React Native
 * West African name autocomplete with Latin-to-Arabic transliteration
 * Provides dropdown suggestions as user types
 */

import { Search, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Modal,
    Pressable,
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

  // Search for matches when input changes
  useEffect(() => {
    if (value.trim().length > 0) {
      const results = searchNameTransliterations(value);
      setMatches(results);
      setShowDropdown(results.length > 0);
    } else {
      setMatches([]);
      setShowDropdown(false);
    }
  }, [value]);

  const handleSelectName = (item: NameMatch) => {
    onChange(item.matchedVariation);
    onArabicSelect(item.arabic, item.matchedVariation);
    setShowDropdown(false);
  };

  const handleClearInput = () => {
    onChange('');
    setMatches([]);
    setShowDropdown(false);
  };

  const renderItem = ({ item }: { item: NameMatch }) => (
    <TouchableOpacity
      style={styles.dropdownItem}
      onPress={() => handleSelectName(item)}
    >
      <View style={styles.dropdownItemContent}>
        <Text style={styles.dropdownItemLatin}>
          {getNameDisplayLabel(item)}
        </Text>
        <Text style={styles.dropdownItemArabic}>
          {item.arabic}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      {/* Input Field */}
      <View style={styles.inputContainer}>
        <View style={styles.searchIcon}>
          <Search size={16} color="#94a3b8" />
        </View>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChange}
          onFocus={() => {
            if (matches.length > 0) setShowDropdown(true);
          }}
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

      {/* Dropdown Modal */}
      <Modal
        visible={showDropdown && matches.length > 0}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowDropdown(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setShowDropdown(false)}
        >
          <View style={styles.dropdownContainer}>
            <FlatList
              data={matches}
              renderItem={renderItem}
              keyExtractor={(item, index) => `${item.arabic}-${index}`}
              style={styles.dropdown}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </Pressable>
      </Modal>

      {/* No Matches Message */}
      {showDropdown && matches.length === 0 && value.trim().length > 0 && (
        <View style={styles.noMatchesContainer}>
          <Text style={styles.noMatchesText}>
            {language === 'en' ? 'No matches found' : 'لم يتم العثور على تطابقات'}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  dropdownContainer: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    maxHeight: 400,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    shadowColor: '#8b5cf6',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 12,
  },
  dropdown: {
    borderRadius: 16,
  },
  dropdownItem: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
  },
  dropdownItemContent: {
    flexDirection: 'column',
    gap: 10,
  },
  dropdownItemLatin: {
    fontSize: 15,
    fontWeight: '600',
    color: '#e0e7ff',
  },
  dropdownItemArabic: {
    fontSize: 22,
    fontWeight: '600',
    color: '#ffffff',
    textAlign: 'right',
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
