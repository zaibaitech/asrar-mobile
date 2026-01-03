import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { DarkTheme } from '../../constants/DarkTheme';
import { useProfile } from '../../contexts/ProfileContext';
import ArabicKeyboard from '../istikhara/ArabicKeyboard';
import NameAutocomplete from '../NameAutocomplete';

interface RelationshipInputFormProps {
  onCalculate: (
    person1Name: string,
    person1Arabic: string,
    person2Name: string,
    person2Arabic: string
  ) => void;
  language?: 'en' | 'fr' | 'ar';
  system?: 'maghribi' | 'mashriqi';
  onSystemChange?: (system: 'maghribi' | 'mashriqi') => void;
  isLoading?: boolean;
  errorMessage?: string | null;
}

export function RelationshipInputForm({ 
  onCalculate, 
  language = 'en',
  system = 'maghribi',
  onSystemChange,
  isLoading = false,
  errorMessage = null
}: RelationshipInputFormProps) {
  const isFrench = language === 'fr';
  const { profile } = useProfile();
  
  const [person1Name, setPerson1Name] = useState('');
  const [person1Arabic, setPerson1Arabic] = useState('');
  const [person1Latin, setPerson1Latin] = useState('');
  const [person2Name, setPerson2Name] = useState('');
  const [person2Arabic, setPerson2Arabic] = useState('');
  const [person2Latin, setPerson2Latin] = useState('');
  
  // Keyboard state
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [activeInput, setActiveInput] = useState<'person1' | 'person2' | null>(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  
  // Refs for text inputs
  const person1InputRef = useRef<TextInput>(null);
  const person2InputRef = useRef<TextInput>(null);
  
  // Auto-fill Person 1 from profile if available
  useEffect(() => {
    if (profile.nameAr && !person1Arabic) {
      setPerson1Arabic(profile.nameAr);
      if (profile.nameLatin) {
        setPerson1Name(profile.nameLatin);
      }
    }
  }, [profile.nameAr, profile.nameLatin]);
  
  // Keyboard handlers
  const handleKeyPress = (key: string) => {
    if (activeInput === 'person1') {
      const newText = person1Arabic.slice(0, cursorPosition) + key + person1Arabic.slice(cursorPosition);
      setPerson1Arabic(newText);
      setCursorPosition(cursorPosition + 1);
    } else if (activeInput === 'person2') {
      const newText = person2Arabic.slice(0, cursorPosition) + key + person2Arabic.slice(cursorPosition);
      setPerson2Arabic(newText);
      setCursorPosition(cursorPosition + 1);
    }
  };
  
  const handleBackspace = () => {
    if (cursorPosition === 0) return;
    
    if (activeInput === 'person1') {
      const newText = person1Arabic.slice(0, cursorPosition - 1) + person1Arabic.slice(cursorPosition);
      setPerson1Arabic(newText);
      setCursorPosition(cursorPosition - 1);
    } else if (activeInput === 'person2') {
      const newText = person2Arabic.slice(0, cursorPosition - 1) + person2Arabic.slice(cursorPosition);
      setPerson2Arabic(newText);
      setCursorPosition(cursorPosition - 1);
    }
  };
  
  const handleSpace = () => {
    handleKeyPress(' ');
  };
  
  const openKeyboard = (inputType: 'person1' | 'person2') => {
    setActiveInput(inputType);
    if (inputType === 'person1') {
      setCursorPosition(person1Arabic.length);
    } else {
      setCursorPosition(person2Arabic.length);
    }
    setShowKeyboard(true);
  };
  
  const handleSubmit = () => {
    if (isLoading) return;
    
    if (!person1Arabic.trim() || !person2Arabic.trim()) {
      return;
    }
    
    Keyboard.dismiss();
    onCalculate(
      person1Name || person1Arabic,
      person1Arabic,
      person2Name || person2Arabic,
      person2Arabic
    );
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView 
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          showKeyboard && styles.contentContainerWithKeyboard
        ]}
        keyboardShouldPersistTaps="handled"
      >
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <LinearGradient
              colors={['#ec4899', '#f43f5e']}
              style={styles.iconGradient}
            >
              <Ionicons name="heart" size={24} color="#fff" />
            </LinearGradient>
          </View>
          <Text style={styles.title}>
            {isFrench ? 'Entrez Deux Noms' : 'Enter Two Names'}
          </Text>
          <Text style={styles.subtitle}>
            {isFrench 
              ? 'Calculez la compatibilité en utilisant la numérologie islamique traditionnelle'
              : 'Calculate compatibility using traditional Islamic numerology'}
          </Text>
        </View>
        
        {/* System Selector */}
        {onSystemChange && (
          <View style={styles.systemSelector}>
            <Text style={styles.systemLabel}>
              {isFrench ? 'Système Abjad' : 'Abjad System'}
            </Text>
            <View style={styles.systemButtons}>
              <TouchableOpacity
                style={[styles.systemButton, system === 'maghribi' && styles.systemButtonActive]}
                onPress={() => onSystemChange('maghribi')}
                disabled={isLoading}
              >
                <Text style={[styles.systemButtonText, system === 'maghribi' && styles.systemButtonTextActive]}>
                  {isFrench ? 'Maghribi' : 'Maghribi'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.systemButton, system === 'mashriqi' && styles.systemButtonActive]}
                onPress={() => onSystemChange('mashriqi')}
                disabled={isLoading}
              >
                <Text style={[styles.systemButtonText, system === 'mashriqi' && styles.systemButtonTextActive]}>
                  {isFrench ? 'Mashriqi' : 'Mashriqi'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        
        {/* Error Message */}
        {errorMessage && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={20} color="#ef4444" />
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}
        
        {/* Validation Warning */}
        {!person1Arabic.trim() || !person2Arabic.trim() ? (
          <View style={styles.warningContainer}>
            <Ionicons name="information-circle" size={18} color="#f59e0b" />
            <Text style={styles.warningText}>
              {isFrench 
                ? 'Les noms arabes sont requis pour les deux personnes'
                : 'Arabic names are required for both people'}
            </Text>
          </View>
        ) : null}
        
        {/* Person 1 */}
        <LinearGradient
          colors={['rgba(139, 92, 246, 0.1)', 'rgba(99, 102, 241, 0.1)']}
          style={styles.personContainer}
        >
          <View style={styles.personHeader}>
            <View style={[styles.personBadge, { backgroundColor: 'rgba(139, 92, 246, 0.2)' }]}>
              <Ionicons name="person" size={16} color="#a78bfa" />
            </View>
            <Text style={styles.personTitle}>
              {isFrench ? 'Personne 1' : 'Person 1'}
            </Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {isFrench ? "Nom d'Affichage (Optionnel)" : 'Display Name (Optional)'}
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={person1Name}
                onChangeText={setPerson1Name}
                placeholder={isFrench ? 'ex: Ahmed' : 'e.g., Ahmed'}
                style={styles.input}
                placeholderTextColor={DarkTheme.textMuted}
              />
            </View>
          </View>
          
          {/* Latin Name Autocomplete */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {isFrench ? 'Nom Latin (Anglais/Français)' : 'Latin Name (English/French)'}
            </Text>
            <NameAutocomplete
              value={person1Latin}
              onChange={setPerson1Latin}
              onArabicSelect={(arabic, latin) => {
                setPerson1Arabic(arabic);
                setPerson1Latin(latin);
              }}
              placeholder="e.g., Ibrahima, Amadou, Ousmane"
              showHelper={false}
              language={language}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>
                {isFrench ? 'Nom Arabe (Requis)' : 'Arabic Name (Required)'} 
                <Text style={styles.required}> *</Text>
              </Text>
              <TouchableOpacity 
                style={styles.keyboardButton}
                onPress={() => openKeyboard('person1')}
              >
                <Text style={styles.keyboardButtonText}>⌨️ {isFrench ? 'Clavier' : 'Keyboard'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                ref={person1InputRef}
                value={person1Arabic}
                onChangeText={(text) => {
                  setPerson1Arabic(text);
                  setCursorPosition(text.length);
                }}
                onSelectionChange={(e) => setCursorPosition(e.nativeEvent.selection.start)}
                placeholder="أحمد"
                style={[styles.input, styles.rtlInput]}
                placeholderTextColor={DarkTheme.textMuted}
                editable={!showKeyboard || activeInput !== 'person1'}
              />
            </View>
          </View>
        </LinearGradient>
        
        {/* Divider */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Ionicons name="heart" size={20} color="#ec4899" />
          <View style={styles.dividerLine} />
        </View>
        
        {/* Person 2 */}
        <LinearGradient
          colors={['rgba(236, 72, 153, 0.1)', 'rgba(244, 63, 94, 0.1)']}
          style={styles.personContainer}
        >
          <View style={styles.personHeader}>
            <View style={[styles.personBadge, { backgroundColor: 'rgba(236, 72, 153, 0.2)' }]}>
              <Ionicons name="person" size={16} color="#f9a8d4" />
            </View>
            <Text style={styles.personTitle}>
              {isFrench ? 'Personne 2' : 'Person 2'}
            </Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {isFrench ? "Nom d'Affichage (Optionnel)" : 'Display Name (Optional)'}
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={person2Name}
                onChangeText={setPerson2Name}
                placeholder={isFrench ? 'ex: Fatima' : 'e.g., Fatima'}
                style={styles.input}
                placeholderTextColor={DarkTheme.textMuted}
              />
            </View>
          </View>
          
          {/* Latin Name Autocomplete */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {isFrench ? 'Nom Latin (Anglais/Français)' : 'Latin Name (English/French)'}
            </Text>
            <NameAutocomplete
              value={person2Latin}
              onChange={setPerson2Latin}
              onArabicSelect={(arabic, latin) => {
                setPerson2Arabic(arabic);
                setPerson2Latin(latin);
              }}
              placeholder="e.g., Fatima, Khadija, Aisha"
              showHelper={false}
              language={language}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <View style={styles.labelRow}>
              <Text style={styles.label}>
                {isFrench ? 'Nom Arabe (Requis)' : 'Arabic Name (Required)'} 
                <Text style={styles.required}> *</Text>
              </Text>
              <TouchableOpacity 
                style={styles.keyboardButton}
                onPress={() => openKeyboard('person2')}
              >
                <Text style={styles.keyboardButtonText}>⌨️ {isFrench ? 'Clavier' : 'Keyboard'}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.inputContainer}>
              <TextInput
                ref={person2InputRef}
                value={person2Arabic}
                onChangeText={(text) => {
                  setPerson2Arabic(text);
                  setCursorPosition(text.length);
                }}
                onSelectionChange={(e) => setCursorPosition(e.nativeEvent.selection.start)}
                placeholder="فاطمة"
                style={[styles.input, styles.rtlInput]}
                placeholderTextColor={DarkTheme.textMuted}
                editable={!showKeyboard || activeInput !== 'person2'}
              />
            </View>
          </View>
        </LinearGradient>
        
        {/* Calculate Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.8}
          style={styles.calculateButtonContainer}
          disabled={isLoading || !person1Arabic.trim() || !person2Arabic.trim()}
        >
          <LinearGradient
            colors={isLoading || !person1Arabic.trim() || !person2Arabic.trim() 
              ? ['#64748b', '#475569'] 
              : ['#ec4899', '#f43f5e']}
            style={styles.calculateButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name="calculator" size={20} color="#fff" />
            )}
            <Text style={styles.calculateButtonText}>
              {isLoading 
                ? (isFrench ? 'Calcul...' : 'Calculating...') 
                : (isFrench ? 'Calculer la Compatibilité' : 'Calculate Compatibility')}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        
      </ScrollView>
      
      {/* Arabic Keyboard */}
      <ArabicKeyboard
        visible={showKeyboard}
        onClose={() => setShowKeyboard(false)}
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
        onSpace={handleSpace}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
  contentContainer: {
    padding: 16,
    gap: 20,
    paddingBottom: 100, // Extra padding to avoid bottom navigation
  },
  contentContainerWithKeyboard: {
    paddingBottom: 420, // Extra padding when keyboard is visible (keyboard height ~400px + padding)
  },
  header: {
    alignItems: 'center',
    marginBottom: 8,
  },
  headerIcon: {
    marginBottom: 12,
  },
  iconGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: DarkTheme.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: DarkTheme.textTertiary,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  systemSelector: {
    gap: 8,
  },
  systemLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: DarkTheme.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  systemButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  systemButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  systemButtonActive: {
    backgroundColor: 'rgba(236, 72, 153, 0.2)',
    borderColor: '#ec4899',
  },
  systemButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: DarkTheme.textSecondary,
  },
  systemButtonTextActive: {
    color: '#ec4899',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
    borderRadius: 12,
    padding: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: '#ef4444',
    lineHeight: 18,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 12,
    padding: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    color: '#f59e0b',
    lineHeight: 18,
  },
  personContainer: {
    padding: 16,
    borderRadius: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  personHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  personBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  personTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  inputGroup: {
    gap: 8,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: DarkTheme.textSecondary,
  },
  required: {
    color: '#f43f5e',
  },
  keyboardButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: 'rgba(236, 72, 153, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.5)',
  },
  keyboardButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#f9a8d4',
  },
  inputContainer: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: DarkTheme.textPrimary,
  },
  rtlInput: {
    textAlign: 'right',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: DarkTheme.borderSubtle,
  },
  calculateButtonContainer: {
    marginTop: 8,
  },
  calculateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 16,
    borderRadius: 12,
    shadowColor: '#ec4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  calculateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
