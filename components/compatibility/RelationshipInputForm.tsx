import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { DarkTheme } from '../../constants/DarkTheme';
import { useProfile } from '../../contexts/ProfileContext';

interface RelationshipInputFormProps {
  onCalculate: (
    person1Name: string,
    person1Arabic: string,
    person2Name: string,
    person2Arabic: string
  ) => void;
  language?: 'en' | 'fr' | 'ar';
}

export function RelationshipInputForm({ onCalculate, language = 'en' }: RelationshipInputFormProps) {
  const isFrench = language === 'fr';
  const { profile } = useProfile();
  
  const [person1Name, setPerson1Name] = useState('');
  const [person1Arabic, setPerson1Arabic] = useState('');
  const [person2Name, setPerson2Name] = useState('');
  const [person2Arabic, setPerson2Arabic] = useState('');
  
  // Auto-fill Person 1 from profile if available
  useEffect(() => {
    if (profile.nameAr && !person1Arabic) {
      setPerson1Arabic(profile.nameAr);
      if (profile.nameLatin) {
        setPerson1Name(profile.nameLatin);
      }
    }
  }, [profile.nameAr, profile.nameLatin]);
  
  const handleSubmit = () => {
    if (!person1Arabic.trim() || !person2Arabic.trim()) {
      Alert.alert(
        isFrench ? 'Erreur' : 'Error',
        isFrench 
          ? 'Veuillez entrer les noms arabes pour les deux personnes' 
          : 'Please enter Arabic names for both people'
      );
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
        contentContainerStyle={styles.contentContainer}
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
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {isFrench ? 'Nom Arabe (Requis)' : 'Arabic Name (Required)'} 
              <Text style={styles.required}> *</Text>
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={person1Arabic}
                onChangeText={setPerson1Arabic}
                placeholder="أحمد"
                style={[styles.input, styles.rtlInput]}
                placeholderTextColor={DarkTheme.textMuted}
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
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>
              {isFrench ? 'Nom Arabe (Requis)' : 'Arabic Name (Required)'} 
              <Text style={styles.required}> *</Text>
            </Text>
            <View style={styles.inputContainer}>
              <TextInput
                value={person2Arabic}
                onChangeText={setPerson2Arabic}
                placeholder="فاطمة"
                style={[styles.input, styles.rtlInput]}
                placeholderTextColor={DarkTheme.textMuted}
              />
            </View>
          </View>
        </LinearGradient>
        
        {/* Calculate Button */}
        <TouchableOpacity
          onPress={handleSubmit}
          activeOpacity={0.8}
          style={styles.calculateButtonContainer}
        >
          <LinearGradient
            colors={['#ec4899', '#f43f5e']}
            style={styles.calculateButton}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="calculator" size={20} color="#fff" />
            <Text style={styles.calculateButtonText}>
              {isFrench ? 'Calculer la Compatibilité' : 'Calculate Compatibility'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        
      </ScrollView>
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
  label: {
    fontSize: 13,
    fontWeight: '500',
    color: DarkTheme.textSecondary,
  },
  required: {
    color: '#f43f5e',
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
