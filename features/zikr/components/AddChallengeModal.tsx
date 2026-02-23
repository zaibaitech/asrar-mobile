/**
 * AddChallengeModal Component
 * ===========================
 * Modal for adding new dhikr challenges with type selection and configuration.
 * Follows mobile app's Modal and UI patterns.
 */

import { Borders, DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import * as Haptics from 'expo-haptics';
import React, { memo, useCallback, useState } from 'react';
import {
    Dimensions,
    KeyboardAvoidingView,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import {
    CHALLENGE_TYPE_STYLES,
    DEFAULT_QUICK_ADD_PRESETS,
    DIVINE_NAME_OPTIONS,
    ISTIGHFAR_CONFIG,
    SALAWAT_PRESETS,
} from '../constants';
import type { ChallengeConfig, ChallengeType, DivineNameOption, SalawatPreset } from '../types';

const { width, height } = Dimensions.get('window');

// ─── Step Types ──────────────────────────────────────────────────────────────────

type ModalStep = 
  | 'SELECT_TYPE'
  | 'CONFIGURE_SALAWAT'
  | 'CONFIGURE_DIVINE_NAME'
  | 'CONFIGURE_CUSTOM';

// ─── Props ───────────────────────────────────────────────────────────────────────

interface AddChallengeModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (type: ChallengeType, config: ChallengeConfig) => void;
}

// ─── Challenge Type Options ──────────────────────────────────────────────────────

const CHALLENGE_TYPE_OPTIONS: { type: ChallengeType; emoji: string; titleEn: string; titleFr: string; descEn: string; descFr: string }[] = [
  {
    type: 'ISTIGHFAR',
    emoji: '🤲',
    titleEn: 'Istighfār',
    titleFr: 'Istighfār',
    descEn: 'Seek forgiveness from Allah',
    descFr: 'Demander pardon à Allah',
  },
  {
    type: 'SALAWAT',
    emoji: '💚',
    titleEn: 'Ṣalawāt',
    titleFr: 'Ṣalawāt',
    descEn: 'Blessings upon the Prophet ﷺ',
    descFr: 'Bénédictions sur le Prophète ﷺ',
  },
  {
    type: 'DIVINE_NAME',
    emoji: '✨',
    titleEn: 'Divine Name',
    titleFr: 'Nom Divin',
    descEn: "Invoke Allah's Beautiful Names",
    descFr: "Invoquer les Beaux Noms d'Allah",
  },
  {
    type: 'CUSTOM',
    emoji: '📿',
    titleEn: 'Custom Wird',
    titleFr: 'Wird Personnalisé',
    descEn: 'Create your own dhikr practice',
    descFr: 'Créez votre propre pratique de dhikr',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────────

function AddChallengeModal({ visible, onClose, onAdd }: AddChallengeModalProps) {
  const { t, language } = useLanguage();
  const [step, setStep] = useState<ModalStep>('SELECT_TYPE');
  const [selectedSalawat, setSelectedSalawat] = useState<SalawatPreset | null>(null);
  const [selectedDivineName, setSelectedDivineName] = useState<DivineNameOption | null>(null);
  
  // Custom wird form state
  const [customTitle, setCustomTitle] = useState('');
  const [customArabic, setCustomArabic] = useState('');
  const [customTranslit, setCustomTranslit] = useState('');
  const [customMeaning, setCustomMeaning] = useState('');
  const [customDailyTarget, setCustomDailyTarget] = useState('100');

  // ─── Reset Handler ───────────────────────────────────────────────────────────

  const handleClose = useCallback(() => {
    setStep('SELECT_TYPE');
    setSelectedSalawat(null);
    setSelectedDivineName(null);
    setCustomTitle('');
    setCustomArabic('');
    setCustomTranslit('');
    setCustomMeaning('');
    setCustomDailyTarget('100');
    onClose();
  }, [onClose]);

  // ─── Type Selection Handler ──────────────────────────────────────────────────

  const handleTypeSelect = useCallback((type: ChallengeType) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (type === 'ISTIGHFAR') {
      // Add Istighfar directly
      onAdd('ISTIGHFAR', ISTIGHFAR_CONFIG);
      handleClose();
    } else if (type === 'SALAWAT') {
      setStep('CONFIGURE_SALAWAT');
    } else if (type === 'DIVINE_NAME') {
      setStep('CONFIGURE_DIVINE_NAME');
    } else if (type === 'CUSTOM') {
      setStep('CONFIGURE_CUSTOM');
    }
  }, [onAdd, handleClose]);

  // ─── Add Salawat ─────────────────────────────────────────────────────────────

  const handleAddSalawat = useCallback((preset: SalawatPreset) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const config: ChallengeConfig = {
      title: language === 'fr' ? preset.titleFr : preset.title,
      arabicText: preset.arabicText,
      transliteration: preset.transliteration,
      meaning: preset.meaning,
      meaningFr: preset.meaningFr,
      dailyTarget: preset.recommendedDaily,
      totalTarget: preset.recommendedDaily * 30,
      quickAddPresets: preset.quickAddPresets,
    };
    onAdd('SALAWAT', config);
    handleClose();
  }, [language, onAdd, handleClose]);

  // ─── Add Divine Name ─────────────────────────────────────────────────────────

  const handleAddDivineName = useCallback((name: DivineNameOption) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const config: ChallengeConfig = {
      title: name.transliteration,
      arabicText: name.arabicName,
      transliteration: name.transliteration,
      meaning: name.meaning,
      meaningFr: name.meaningFr,
      dailyTarget: name.recommendedDaily,
      totalTarget: name.recommendedDaily * 30,
      quickAddPresets: [33, 99, 100, 500],
    };
    onAdd('DIVINE_NAME', config);
    handleClose();
  }, [onAdd, handleClose]);

  // ─── Add Custom ──────────────────────────────────────────────────────────────

  const handleAddCustom = useCallback(() => {
    if (!customTitle.trim() || !customArabic.trim()) return;
    
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const dailyTarget = parseInt(customDailyTarget) || 100;
    const config: ChallengeConfig = {
      title: customTitle.trim(),
      arabicText: customArabic.trim(),
      transliteration: customTranslit.trim() || customTitle.trim(),
      meaning: customMeaning.trim() || undefined,
      dailyTarget,
      totalTarget: dailyTarget * 30,
      quickAddPresets: DEFAULT_QUICK_ADD_PRESETS,
    };
    onAdd('CUSTOM', config);
    handleClose();
  }, [customTitle, customArabic, customTranslit, customMeaning, customDailyTarget, onAdd, handleClose]);

  // ─── Render Type Selection ───────────────────────────────────────────────────

  const renderTypeSelection = () => (
    <ScrollView 
      style={styles.content} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.stepTitle}>
        {language === 'fr' ? 'Choisir un type de Dhikr' : 'Choose Dhikr Type'}
      </Text>
      <Text style={styles.stepSubtitle}>
        {language === 'fr' 
          ? 'Sélectionnez le type de pratique spirituelle'
          : 'Select the type of spiritual practice'}
      </Text>
      
      <View style={styles.typeGrid}>
        {CHALLENGE_TYPE_OPTIONS.map((option) => {
          const typeStyle = CHALLENGE_TYPE_STYLES[option.type];
          return (
            <TouchableOpacity
              key={option.type}
              style={[styles.typeCard, { borderColor: typeStyle.accent }]}
              onPress={() => handleTypeSelect(option.type)}
              activeOpacity={0.7}
            >
              <Text style={styles.typeEmoji}>{option.emoji}</Text>
              <Text style={styles.typeTitle}>
                {language === 'fr' ? option.titleFr : option.titleEn}
              </Text>
              <Text style={styles.typeDesc}>
                {language === 'fr' ? option.descFr : option.descEn}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );

  // ─── Render Salawat Selection ────────────────────────────────────────────────

  const renderSalawatSelection = () => (
    <ScrollView 
      style={styles.content}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => setStep('SELECT_TYPE')}>
        <Text style={styles.backText}>← {language === 'fr' ? 'Retour' : 'Back'}</Text>
      </TouchableOpacity>
      
      <Text style={styles.stepTitle}>
        {language === 'fr' ? 'Choisir une Ṣalawāt' : 'Choose a Ṣalawāt'}
      </Text>
      <Text style={styles.stepSubtitle}>
        {language === 'fr'
          ? 'Prières sur le Prophète ﷺ de différentes traditions'
          : 'Prayers upon the Prophet ﷺ from various traditions'}
      </Text>
      
      <View style={styles.presetList}>
        {SALAWAT_PRESETS.map((preset) => (
          <TouchableOpacity
            key={preset.id}
            style={styles.presetCard}
            onPress={() => handleAddSalawat(preset)}
            activeOpacity={0.7}
          >
            <View style={styles.presetHeader}>
              <Text style={styles.presetTitle}>
                {language === 'fr' ? preset.titleFr : preset.title}
              </Text>
              <Text style={styles.presetTradition}>
                {language === 'fr' ? preset.traditionFr : preset.tradition}
              </Text>
            </View>
            <Text style={styles.presetArabic} numberOfLines={2}>
              {preset.arabicText}
            </Text>
            <Text style={styles.presetNote}>
              {language === 'fr' ? preset.noteFr : preset.note}
            </Text>
            <View style={styles.presetFooter}>
              <Text style={styles.presetDaily}>
                {language === 'fr' ? 'Recommandé:' : 'Recommended:'} {preset.recommendedDaily}/day
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  // ─── Render Divine Name Selection ────────────────────────────────────────────

  const renderDivineNameSelection = () => (
    <ScrollView 
      style={styles.content}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => setStep('SELECT_TYPE')}>
        <Text style={styles.backText}>← {language === 'fr' ? 'Retour' : 'Back'}</Text>
      </TouchableOpacity>
      
      <Text style={styles.stepTitle}>
        {language === 'fr' ? 'Choisir un Nom Divin' : 'Choose a Divine Name'}
      </Text>
      <Text style={styles.stepSubtitle}>
        {language === 'fr'
          ? "Les Beaux Noms d'Allah pour l'invocation"
          : "Allah's Beautiful Names for invocation"}
      </Text>
      
      <View style={styles.nameGrid}>
        {DIVINE_NAME_OPTIONS.map((name) => (
          <TouchableOpacity
            key={name.id}
            style={styles.nameCard}
            onPress={() => handleAddDivineName(name)}
            activeOpacity={0.7}
          >
            <Text style={styles.nameArabic}>{name.arabicName}</Text>
            <Text style={styles.nameTranslit}>{name.transliteration}</Text>
            <Text style={styles.nameMeaning}>
              {language === 'fr' ? name.meaningFr : name.meaning}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );

  // ─── Render Custom Form ──────────────────────────────────────────────────────

  const renderCustomForm = () => (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.content}
    >
      <TouchableOpacity style={styles.backButton} onPress={() => setStep('SELECT_TYPE')}>
        <Text style={styles.backText}>← {language === 'fr' ? 'Retour' : 'Back'}</Text>
      </TouchableOpacity>
      
      <Text style={styles.stepTitle}>
        {language === 'fr' ? 'Wird Personnalisé' : 'Custom Wird'}
      </Text>
      <Text style={styles.stepSubtitle}>
        {language === 'fr'
          ? 'Créez votre propre pratique de dhikr'
          : 'Create your own dhikr practice'}
      </Text>
      
      <ScrollView style={styles.formScroll} showsVerticalScrollIndicator={false}>
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            {language === 'fr' ? 'Titre *' : 'Title *'}
          </Text>
          <TextInput
            style={styles.textInput}
            value={customTitle}
            onChangeText={setCustomTitle}
            placeholder={language === 'fr' ? 'Ex: Mon Dhikr' : 'E.g., My Dhikr'}
            placeholderTextColor={DarkTheme.textMuted}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            {language === 'fr' ? 'Texte Arabe *' : 'Arabic Text *'}
          </Text>
          <TextInput
            style={[styles.textInput, styles.arabicInput]}
            value={customArabic}
            onChangeText={setCustomArabic}
            placeholder="بسم الله"
            placeholderTextColor={DarkTheme.textMuted}
            textAlign="right"
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            {language === 'fr' ? 'Translittération' : 'Transliteration'}
          </Text>
          <TextInput
            style={styles.textInput}
            value={customTranslit}
            onChangeText={setCustomTranslit}
            placeholder="Bismillah"
            placeholderTextColor={DarkTheme.textMuted}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            {language === 'fr' ? 'Signification' : 'Meaning'}
          </Text>
          <TextInput
            style={[styles.textInput, styles.multilineInput]}
            value={customMeaning}
            onChangeText={setCustomMeaning}
            placeholder={language === 'fr' ? 'Au nom de Dieu' : 'In the name of God'}
            placeholderTextColor={DarkTheme.textMuted}
            multiline
            numberOfLines={2}
          />
        </View>
        
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>
            {language === 'fr' ? 'Objectif Quotidien' : 'Daily Target'}
          </Text>
          <TextInput
            style={styles.textInput}
            value={customDailyTarget}
            onChangeText={setCustomDailyTarget}
            placeholder="100"
            placeholderTextColor={DarkTheme.textMuted}
            keyboardType="number-pad"
          />
        </View>
        
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!customTitle.trim() || !customArabic.trim()) && styles.submitButtonDisabled
          ]}
          onPress={handleAddCustom}
          disabled={!customTitle.trim() || !customArabic.trim()}
          activeOpacity={0.8}
        >
          <Text style={styles.submitButtonText}>
            {language === 'fr' ? 'Ajouter le Wird' : 'Add Wird'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );

  // ─── Render Content Based on Step ────────────────────────────────────────────

  const renderStepContent = () => {
    switch (step) {
      case 'SELECT_TYPE':
        return renderTypeSelection();
      case 'CONFIGURE_SALAWAT':
        return renderSalawatSelection();
      case 'CONFIGURE_DIVINE_NAME':
        return renderDivineNameSelection();
      case 'CONFIGURE_CUSTOM':
        return renderCustomForm();
      default:
        return renderTypeSelection();
    }
  };

  // ─── Main Render ─────────────────────────────────────────────────────────────

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>
              {language === 'fr' ? 'Nouveau Dhikr' : 'New Dhikr'}
            </Text>
            <TouchableOpacity 
              style={styles.closeButton} 
              onPress={handleClose}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.closeIcon}>✕</Text>
            </TouchableOpacity>
          </View>
          
          {/* Content */}
          {renderStepContent()}
        </View>
      </View>
    </Modal>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: DarkTheme.screenBackground,
    borderTopLeftRadius: Borders.radiusXl,
    borderTopRightRadius: Borders.radiusXl,
    maxHeight: height * 0.85,
    minHeight: height * 0.5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: DarkTheme.borderSubtle,
  },
  headerTitle: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeIcon: {
    fontSize: 16,
    color: DarkTheme.textSecondary,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  scrollContent: {
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  stepTitle: {
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.xs,
  },
  stepSubtitle: {
    fontSize: Typography.body,
    color: DarkTheme.textTertiary,
    marginBottom: Spacing.xl,
  },
  backButton: {
    marginBottom: Spacing.md,
  },
  backText: {
    fontSize: Typography.body,
    color: '#D4AF37',
  },
  
  // Type Selection Grid
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  typeCard: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: Borders.radiusMd,
    borderWidth: 1,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  typeEmoji: {
    fontSize: 36,
    marginBottom: Spacing.sm,
  },
  typeTitle: {
    fontSize: Typography.label,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  typeDesc: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    textAlign: 'center',
  },
  
  // Preset List
  presetList: {
    flex: 1,
  },
  presetCard: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: Borders.radiusMd,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
  },
  presetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  presetTitle: {
    fontSize: Typography.body,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  presetTradition: {
    fontSize: Typography.caption,
    color: '#D4AF37',
  },
  presetArabic: {
    fontSize: 20,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : 'sans-serif',
    color: DarkTheme.textSecondary,
    textAlign: 'right',
    marginBottom: Spacing.sm,
    lineHeight: 32,
  },
  presetNote: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    fontStyle: 'italic',
    marginBottom: Spacing.sm,
  },
  presetFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  presetDaily: {
    fontSize: Typography.caption,
    color: DarkTheme.textMuted,
  },
  
  // Divine Name Grid
  nameGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  nameCard: {
    width: (width - Spacing.lg * 2 - Spacing.md) / 2,
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: Borders.radiusMd,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(156, 39, 176, 0.3)',
  },
  nameArabic: {
    fontSize: 28,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : 'sans-serif',
    color: '#AB47BC',
    marginBottom: Spacing.xs,
  },
  nameTranslit: {
    fontSize: Typography.label,
    fontWeight: Typography.weightMedium,
    color: DarkTheme.textPrimary,
    marginBottom: Spacing.xs,
  },
  nameMeaning: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    textAlign: 'center',
  },
  
  // Custom Form
  formScroll: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: Spacing.lg,
  },
  inputLabel: {
    fontSize: Typography.label,
    fontWeight: Typography.weightMedium,
    color: DarkTheme.textSecondary,
    marginBottom: Spacing.sm,
  },
  textInput: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: Borders.radiusMd,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    fontSize: Typography.body,
    color: DarkTheme.textPrimary,
  },
  arabicInput: {
    fontSize: 22,
    fontFamily: Platform.OS === 'ios' ? 'Geeza Pro' : 'sans-serif',
    lineHeight: 36,
    paddingVertical: Spacing.lg,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#D4AF37',
    borderRadius: Borders.radiusMd,
    paddingVertical: Spacing.lg,
    alignItems: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  submitButtonDisabled: {
    backgroundColor: 'rgba(212, 175, 55, 0.3)',
  },
  submitButtonText: {
    fontSize: Typography.body,
    fontWeight: Typography.weightSemibold,
    color: '#1A1625',
  },
});

export default memo(AddChallengeModal);
