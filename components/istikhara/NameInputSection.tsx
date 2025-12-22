import { CheckCircle, Keyboard, Search, X } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { NameSuggestion } from '../../hooks/useNameSuggestions';

interface NameInputSectionProps {
  title: string;
  icon: string;
  latinValue: string;
  arabicValue: string;
  onLatinChange: (text: string) => void;
  onArabicChange: (text: string) => void;
  suggestions: NameSuggestion[];
  borderColor: string;
  isValid: boolean;
  touched: boolean;
}

export default function NameInputSection({
  title,
  icon,
  latinValue,
  arabicValue,
  onLatinChange,
  onArabicChange,
  suggestions,
  borderColor,
  isValid,
  touched,
}: NameInputSectionProps) {
  const { t } = useLanguage();
  const [showSuggestions, setShowSuggestions] = useState(false);

  return (
    <View style={[styles.nameCard, { borderColor }]}>
      {/* Header */}
      <View style={styles.nameHeader}>
        <Text style={styles.nameIcon}>{icon}</Text>
        <Text style={styles.nameTitle}>{title}</Text>
        {isValid && touched && (
          <CheckCircle color="#10B981" size={24} strokeWidth={2} />
        )}
      </View>

      {/* Latin Name Search (Optional) */}
      <View style={styles.searchSection}>
        <Text style={styles.sectionLabel}>
          {t('istikhara.latinSearch.label') || 'Search by Latin Name'} <Text style={styles.optional}>({t('common.optional') || 'optional'})</Text>
        </Text>

        <View style={styles.searchInputContainer}>
          <Search size={20} color="#9CA3AF" strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            value={latinValue}
            onChangeText={onLatinChange}
            placeholder={t('istikhara.form.personNamePlaceholder') || 'e.g., Rahim, Ahmed'}
            placeholderTextColor="#9CA3AF"
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {latinValue.length > 0 && (
            <TouchableOpacity onPress={() => onLatinChange('')}>
              <X size={20} color="#9CA3AF" strokeWidth={2} />
            </TouchableOpacity>
          )}
        </View>

        {/* Suggestions Dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsHint}>
              ℹ️ {t('istikhara.latinSearch.suggestionsHint') || 'Database-backed suggestions'}
            </Text>
            <ScrollView
              style={styles.suggestionsList}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
            >
              {suggestions.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.suggestionItem}
                  onPress={() => {
                    onLatinChange(item.latin);
                    onArabicChange(item.arabic);
                    setShowSuggestions(false);
                  }}
                >
                  <Text style={styles.suggestionLatin}>{item.latin}</Text>
                  <Text style={styles.suggestionArabic}>{item.arabic}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>

      {/* Arabic Name Input (Required) */}
      <View style={styles.arabicSection}>
        <View style={styles.arabicLabelRow}>
          <Text style={styles.arabicLabel}>
            {t('istikhara.arabicName') || 'Arabic Name'} <Text style={styles.required}>*</Text>
          </Text>
          <TouchableOpacity style={styles.keyboardButton}>
            <Keyboard size={16} color="#E5E7EB" strokeWidth={2} />
            <Text style={styles.keyboardButtonText}>{t('common.showKeyboard') || 'Show Keyboard'}</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.arabicInputContainer, { borderColor }]}>
          <TextInput
            style={styles.arabicInput}
            value={arabicValue}
            onChangeText={onArabicChange}
            placeholder="أدخل الاسم بالعربية"
            placeholderTextColor="#6B7280"
            textAlign="right"
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  nameCard: {
    backgroundColor: '#374151',
    borderRadius: 16,
    borderWidth: 2,
    padding: 20,
    marginBottom: 16,
  },

  nameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },

  nameIcon: {
    fontSize: 24,
    marginRight: 12,
  },

  nameTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },

  // Search Section
  searchSection: {
    marginBottom: 20,
  },

  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E5E7EB',
    marginBottom: 8,
  },

  optional: {
    color: '#9CA3AF',
    fontWeight: '400',
  },

  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
  },

  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },

  // Suggestions
  suggestionsContainer: {
    marginTop: 8,
  },

  suggestionsHint: {
    fontSize: 13,
    color: '#9CA3AF',
    marginBottom: 8,
    marginLeft: 4,
  },

  suggestionsList: {
    maxHeight: 200,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 4,
  },

  suggestionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },

  suggestionLatin: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1F2937',
    marginBottom: 4,
  },

  suggestionArabic: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'right',
  },

  // Arabic Section
  arabicSection: {
    marginTop: 8,
  },

  arabicLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  arabicLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#E5E7EB',
  },

  required: {
    color: '#EF4444',
  },

  keyboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#4B5563',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  keyboardButtonText: {
    fontSize: 13,
    color: '#E5E7EB',
  },

  arabicInputContainer: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },

  arabicInput: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'right',
  },
});
