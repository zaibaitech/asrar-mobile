import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import {
  BookOpen,
  Calendar,
  Check,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  Copy,
  Gift,
  Moon,
  Shield,
  Sparkles,
  Star,
  Target,
  Zap
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { getElementColors } from "../../../constants/ElementColors";
import { useLanguage } from "../../../contexts/LanguageContext";
import type { IstikharaCalculationResult } from "../../../services/istikhara/types";
import { DhikrCounter } from "../DhikrCounter";

const { width } = Dimensions.get('window');

interface SpiritualPracticeTabProps {
  result: IstikharaCalculationResult;
}

type PracticeType = "monthly" | "lifetime" | "divine";

export default function SpiritualPracticeTab({ result }: SpiritualPracticeTabProps) {
  const { language } = useLanguage();
  const profile = result.burujProfile;
  const elementKey = profile.element.toLowerCase() as "fire" | "earth" | "air" | "water";
  const colors = getElementColors(elementKey);
  const spiritual_practice = profile.spiritual_practice;
  
  const [activeType, setActiveType] = useState<PracticeType>("divine");
  const [showInstructions, setShowInstructions] = useState(false);
  const [showAngelsJinn, setShowAngelsJinn] = useState(true);
  const [showQuranicVerse, setShowQuranicVerse] = useState(true);
  const [copied, setCopied] = useState<string | null>(null);
  const [showDhikrCounter, setShowDhikrCounter] = useState(false);

  const handleCopy = async (text: string, type: string) => {
    try {
      await Clipboard.setStringAsync(text);
      setCopied(type);
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const switchType = async (type: PracticeType) => {
    setActiveType(type);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  return (
    <ScrollView 
      style={styles.container} 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
          <Moon size={32} color={colors.accent} />
        </View>
        <Text style={styles.title}>
          {language === 'en' ? 'Spiritual Practices' : 'Pratiques Spirituelles'}
        </Text>
        <Text style={styles.subtitle}>
          {language === 'en' 
            ? 'Sacred practices aligned with your spiritual nature' 
            : 'Pratiques sacrées alignées avec votre nature spirituelle'}
        </Text>
      </View>

      {/* Practice Type Selector */}
      <View style={styles.typeSelector}>
        <TouchableOpacity
          style={[styles.typeButton, activeType === 'divine' && [styles.typeButtonActive, { borderColor: colors.border, backgroundColor: colors.background }]]}
          onPress={() => switchType('divine')}
        >
          <Sparkles size={20} color={activeType === 'divine' ? colors.accent : '#9ca3af'} />
          <Text style={[styles.typeButtonText, activeType === 'divine' && { color: colors.accent }]}>
            {language === 'en' ? 'Divine Names' : 'Noms Divins'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.typeButton, activeType === 'monthly' && [styles.typeButtonActive, { borderColor: colors.border, backgroundColor: colors.background }]]}
          onPress={() => switchType('monthly')}
        >
          <Calendar size={20} color={activeType === 'monthly' ? colors.accent : '#9ca3af'} />
          <Text style={[styles.typeButtonText, activeType === 'monthly' && { color: colors.accent }]}>
            {language === 'en' ? 'Monthly' : 'Mensuel'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.typeButton, activeType === 'lifetime' && [styles.typeButtonActive, { borderColor: colors.border, backgroundColor: colors.background }]]}
          onPress={() => switchType('lifetime')}
        >
          <Star size={20} color={activeType === 'lifetime' ? colors.accent : '#9ca3af'} />
          <Text style={[styles.typeButtonText, activeType === 'lifetime' && { color: colors.accent }]}>
            {language === 'en' ? 'Lifetime' : 'Vie'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Divine Names Practice */}
      {activeType === 'divine' && (
        <View>
          {/* Practice Night Info */}
          {spiritual_practice.practice_night && (
            <LinearGradient
              colors={colors.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.card, { borderColor: colors.border }]}
            >
              <View style={styles.cardHeader}>
                <Moon size={24} color={colors.accent} />
                <Text style={styles.cardTitle}>
                  {language === 'en' ? 'Practice Night' : 'Nuit de Pratique'}
                </Text>
              </View>
              <Text style={styles.practiceNight}>
                {spiritual_practice.practice_night.primary[language as 'en' | 'fr']}
              </Text>
              {spiritual_practice.practice_night.note && (
                <Text style={styles.practiceNote}>
                  {spiritual_practice.practice_night.note[language as 'en' | 'fr']}
                </Text>
              )}
            </LinearGradient>
          )}

          {/* Zodiac Sign */}
          {spiritual_practice.zodiac_sign && 'arabic' in spiritual_practice.zodiac_sign && (
            <LinearGradient
              colors={colors.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.card, { borderColor: colors.border }]}
            >
              <View style={styles.cardHeader}>
                <Star size={24} color={colors.accent} />
                <Text style={styles.cardTitle}>
                  {language === 'en' ? 'Zodiac Sign' : 'Signe Zodiacal'}
                </Text>
              </View>
              <View style={styles.zodiacContent}>
                <Text style={styles.zodiacText}>
                  {spiritual_practice.zodiac_sign[language as 'en' | 'fr']}
                </Text>
                <Text style={styles.zodiacArabic}>
                  {spiritual_practice.zodiac_sign.arabic}
                </Text>
              </View>
            </LinearGradient>
          )}

          {/* Divine Names */}
          {'arabic' in spiritual_practice.divine_names && (
            <LinearGradient
              colors={colors.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.card, { borderColor: colors.border }]}
            >
              <View style={styles.cardHeader}>
                <Sparkles size={24} color={colors.accent} />
                <Text style={styles.cardTitle}>
                  {language === 'en' ? 'Divine Names to Recite' : 'Noms Divins à Réciter'}
                </Text>
              </View>
              
              <View style={styles.divineNamesContent}>
                <View style={styles.arabicRow}>
                  <Text style={styles.arabicText}>{spiritual_practice.divine_names.arabic}</Text>
                  <TouchableOpacity onPress={() => 'arabic' in spiritual_practice.divine_names && handleCopy(spiritual_practice.divine_names.arabic, 'divineNames')}>
                    {copied === 'divineNames' ? (
                      <Check size={20} color="#4ade80" />
                    ) : (
                      <Copy size={20} color="#FFF" />
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={styles.transliteration}>{spiritual_practice.divine_names.transliteration}</Text>
                <Text style={styles.translation}>
                  {spiritual_practice.divine_names.translation[language as 'en' | 'fr']}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.dhikrButton, { backgroundColor: colors.background }]}
                onPress={() => setShowDhikrCounter(!showDhikrCounter)}
              >
                <Target size={20} color={colors.accent} />
                <Text style={[styles.dhikrButtonText, { color: colors.accent }]}>
                  {showDhikrCounter 
                    ? (language === 'en' ? 'Hide Counter' : 'Masquer Compteur')
                    : (language === 'en' ? 'Start Dhikr Counter' : 'Démarrer Compteur')}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          )}

          {/* Dhikr Counter */}
          {showDhikrCounter && 'arabic' in spiritual_practice.divine_names && (
            <DhikrCounter
              targetCount={result.repetitionCount}
              divineNames={spiritual_practice.divine_names}
              quranicVerse={spiritual_practice.quranic_verse}
              angel={spiritual_practice.angel}
              jinn={spiritual_practice.jinn}
              practiceNight={spiritual_practice.practice_night}
              zodiacSign={'arabic' in spiritual_practice.zodiac_sign ? spiritual_practice.zodiac_sign : undefined}
              instructions={spiritual_practice.instructions}
              elementColors={colors}
            />
          )}

          {/* Quranic Verse */}
          {showQuranicVerse && spiritual_practice.quranic_verse && (
            <LinearGradient
              colors={colors.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.card, { borderColor: colors.border }]}
            >
              <TouchableOpacity
                style={styles.collapsibleHeader}
                onPress={() => setShowQuranicVerse(!showQuranicVerse)}
              >
                <View style={styles.cardHeader}>
                  <BookOpen size={24} color={colors.accent} />
                  <Text style={styles.cardTitle}>
                    {language === 'en' ? 'Quranic Verse' : 'Verset Coranique'}
                  </Text>
                </View>
                {showQuranicVerse ? <ChevronUp size={20} color="#FFF" /> : <ChevronDown size={20} color="#FFF" />}
              </TouchableOpacity>

              <View style={styles.verseContent}>
                <View style={styles.arabicRow}>
                  <Text style={styles.verseArabic}>{spiritual_practice.quranic_verse?.arabic}</Text>
                  <TouchableOpacity onPress={() => spiritual_practice.quranic_verse && handleCopy(spiritual_practice.quranic_verse.arabic, 'verse')}>
                    {copied === 'verse' ? (
                      <Check size={20} color="#4ade80" />
                    ) : (
                      <Copy size={20} color="#FFF" />
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={styles.verseTransliteration}>{spiritual_practice.quranic_verse?.transliteration}</Text>
                <Text style={styles.verseTranslation}>
                  {spiritual_practice.quranic_verse?.translation[language as 'en' | 'fr']}
                </Text>
                <Text style={styles.verseReference}>({spiritual_practice.quranic_verse?.reference})</Text>
              </View>
            </LinearGradient>
          )}

          {/* Angels & Jinn */}
          {showAngelsJinn && (
            <View style={styles.row}>
              {spiritual_practice.angel && (
                <LinearGradient
                  colors={colors.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.smallCard, { borderColor: colors.border }]}
                >
                  <View style={styles.smallCardHeader}>
                    <Shield size={20} color={colors.accent} />
                    <Text style={styles.smallCardTitle}>
                      {language === 'en' ? 'Angel' : 'Ange'}
                    </Text>
                  </View>
                  <Text style={styles.angelArabic}>{spiritual_practice.angel.arabic}</Text>
                  <Text style={styles.angelTransliteration}>{spiritual_practice.angel.transliteration}</Text>
                  {spiritual_practice.angel.name && (
                    <Text style={styles.angelName}>
                      {spiritual_practice.angel.name[language as 'en' | 'fr']}
                    </Text>
                  )}
                </LinearGradient>
              )}

              {spiritual_practice.jinn && (
                <LinearGradient
                  colors={colors.primary}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.smallCard, { borderColor: colors.border }]}
                >
                  <View style={styles.smallCardHeader}>
                    <Zap size={20} color={colors.accent} />
                    <Text style={styles.smallCardTitle}>
                      {language === 'en' ? 'Jinn' : 'Djinn'}
                    </Text>
                  </View>
                  <Text style={styles.angelArabic}>{spiritual_practice.jinn.arabic}</Text>
                  <Text style={styles.angelTransliteration}>{spiritual_practice.jinn.transliteration}</Text>
                  {spiritual_practice.jinn.meaning && (
                    <Text style={styles.angelName}>
                      {spiritual_practice.jinn.meaning[language as 'en' | 'fr']}
                    </Text>
                  )}
                </LinearGradient>
              )}
            </View>
          )}

          {/* Instructions */}
          {spiritual_practice.instructions && (
            <LinearGradient
              colors={colors.primary}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.card, { borderColor: colors.border }]}
            >
              <TouchableOpacity
                style={styles.collapsibleHeader}
                onPress={() => setShowInstructions(!showInstructions)}
              >
                <View style={styles.cardHeader}>
                  <CheckSquare size={24} color={colors.accent} />
                  <Text style={styles.cardTitle}>
                    {language === 'en' ? 'Practice Instructions' : 'Instructions de Pratique'}
                  </Text>
                </View>
                {showInstructions ? <ChevronUp size={20} color="#FFF" /> : <ChevronDown size={20} color="#FFF" />}
              </TouchableOpacity>

              {showInstructions && (
                <View style={styles.instructionsContent}>
                  {spiritual_practice.instructions[language as 'en' | 'fr'].map((instruction, idx) => (
                    <View key={idx} style={styles.instructionItem}>
                      <View style={[styles.instructionNumber, { backgroundColor: colors.background }]}>
                        <Text style={[styles.instructionNumberText, { color: colors.accent }]}>
                          {idx + 1}
                        </Text>
                      </View>
                      <Text style={styles.instructionText}>{instruction}</Text>
                    </View>
                  ))}
                </View>
              )}
            </LinearGradient>
          )}
        </View>
      )}

      {/* Monthly Sadaqah */}
      {activeType === 'monthly' && profile.sadaqah.monthly && (
        <View>
          <LinearGradient
            colors={colors.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, { borderColor: colors.border }]}
          >
            <View style={styles.cardHeader}>
              <Gift size={24} color={colors.accent} />
              <Text style={styles.cardTitle}>
                {language === 'en' ? 'Monthly Sadaqah' : 'Sadaqah Mensuelle'}
              </Text>
            </View>

            <View style={styles.sadaqahSection}>
              <Text style={styles.sectionLabel}>
                {language === 'en' ? 'Traditional:' : 'Traditionnel:'}
              </Text>
              <Text style={styles.sadaqahText}>
                {profile.sadaqah.monthly.traditional[language as 'en' | 'fr']}
              </Text>
            </View>

            <View style={styles.sadaqahSection}>
              <Text style={styles.sectionLabel}>
                {language === 'en' ? 'Frequency:' : 'Fréquence:'}
              </Text>
              <Text style={styles.sadaqahText}>
                {profile.sadaqah.monthly.frequency[language as 'en' | 'fr']}
              </Text>
            </View>

            <View style={styles.sadaqahSection}>
              <Text style={styles.sectionLabel}>
                {language === 'en' ? 'Purpose:' : 'Objectif:'}
              </Text>
              <Text style={styles.sadaqahText}>
                {profile.sadaqah.monthly.purpose?.[language as 'en' | 'fr'] || ''}
              </Text>
            </View>

            {profile.sadaqah.monthly.modern_alternatives && (
              <View style={styles.alternativesSection}>
                <Text style={styles.alternativesTitle}>
                  {language === 'en' ? 'Modern Alternatives:' : 'Alternatives Modernes:'}
                </Text>
                {profile.sadaqah.monthly.modern_alternatives[language as 'en' | 'fr'].map((alt, idx) => (
                  <View key={idx} style={styles.alternativeItem}>
                    <Text style={styles.bullet}>•</Text>
                    <Text style={styles.alternativeText}>{alt}</Text>
                  </View>
                ))}
              </View>
            )}
          </LinearGradient>
        </View>
      )}

      {/* Lifetime Offering */}
      {activeType === 'lifetime' && profile.sadaqah.lifetime && (
        <View>
          <LinearGradient
            colors={colors.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.card, { borderColor: colors.border }]}
          >
            <View style={styles.cardHeader}>
              <Star size={24} color={colors.accent} />
              <Text style={styles.cardTitle}>
                {language === 'en' ? 'Lifetime Sacred Offering' : 'Offrande Sacrée de Vie'}
              </Text>
            </View>

            <View style={styles.lifetimeContent}>
              <Text style={styles.lifetimeTraditional}>
                {profile.sadaqah.lifetime.traditional[language as 'en' | 'fr']}
              </Text>

              {profile.sadaqah.lifetime.components && (
                <View style={styles.componentsSection}>
                  <Text style={styles.componentsTitle}>
                    {language === 'en' ? 'Components:' : 'Composants:'}
                  </Text>
                  {profile.sadaqah.lifetime.components[language as 'en' | 'fr'].map((comp, idx) => (
                    <View key={idx} style={styles.componentItem}>
                      <CheckSquare size={16} color={colors.accent} />
                      <Text style={styles.componentText}>{comp}</Text>
                    </View>
                  ))}
                </View>
              )}

              {profile.sadaqah.lifetime.best_timing && (
                <View style={styles.timingSection}>
                  <Text style={styles.timingTitle}>
                    ⏰ {language === 'en' ? 'Best Timing:' : 'Meilleur Moment:'}
                  </Text>
                  {profile.sadaqah.lifetime.best_timing[language as 'en' | 'fr'].map((timing, idx) => (
                    <Text key={idx} style={styles.timingText}>• {timing}</Text>
                  ))}
                </View>
              )}

              {profile.sadaqah.lifetime.significance && (
                <View style={styles.significanceSection}>
                  <Text style={styles.significanceTitle}>
                    {language === 'en' ? 'Spiritual Significance:' : 'Signification Spirituelle:'}
                  </Text>
                  <Text style={styles.significanceText}>
                    {profile.sadaqah.lifetime.significance[language as 'en' | 'fr']}
                  </Text>
                </View>
              )}
            </View>
          </LinearGradient>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1e',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#d1d5db',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 2,
    borderColor: 'transparent',
    minHeight: 48,
  },
  typeButtonActive: {
    borderWidth: 2,
  },
  typeButtonText: {
    fontSize: 12,
    color: '#9ca3af',
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    marginBottom: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    flex: 1,
  },
  practiceNight: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  practiceNote: {
    fontSize: 14,
    color: '#d1d5db',
  },
  zodiacContent: {
    alignItems: 'center',
  },
  zodiacText: {
    fontSize: 18,
    color: '#FFF',
    marginBottom: 4,
  },
  zodiacArabic: {
    fontSize: 16,
    color: '#d1d5db',
  },
  divineNamesContent: {
    marginBottom: 16,
  },
  arabicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    minHeight: 44,
  },
  arabicText: {
    fontSize: 32,
    color: '#FFF',
    fontWeight: '600',
    flex: 1,
    lineHeight: 44,
  },
  transliteration: {
    fontSize: 18,
    color: '#e9d5ff',
    marginBottom: 8,
    fontWeight: '500',
  },
  translation: {
    fontSize: 16,
    color: '#FFF',
    lineHeight: 24,
  },
  dhikrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 12,
    minHeight: 56,
  },
  dhikrButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  collapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  verseContent: {
    gap: 8,
  },
  verseArabic: {
    fontSize: 28,
    color: '#FFF',
    lineHeight: 42,
    flex: 1,
    textAlign: 'right',
  },
  verseTransliteration: {
    fontSize: 16,
    color: '#e9d5ff',
    fontStyle: 'italic',
  },
  verseTranslation: {
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
  },
  verseReference: {
    fontSize: 12,
    color: '#9ca3af',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  smallCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
  },
  smallCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  smallCardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFF',
  },
  angelArabic: {
    fontSize: 20,
    color: '#FFF',
    marginBottom: 4,
  },
  angelTransliteration: {
    fontSize: 14,
    color: '#e9d5ff',
    marginBottom: 4,
  },
  angelName: {
    fontSize: 12,
    color: '#d1d5db',
  },
  instructionsContent: {
    gap: 12,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  instructionNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#FFF',
    lineHeight: 20,
    paddingTop: 6,
  },
  sadaqahSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fbbf24',
    marginBottom: 4,
  },
  sadaqahText: {
    fontSize: 14,
    color: '#FFF',
    lineHeight: 20,
  },
  alternativesSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },
  alternativesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fbbf24',
    marginBottom: 8,
  },
  alternativeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    color: '#FFF',
  },
  alternativeText: {
    flex: 1,
    fontSize: 14,
    color: '#FFF',
    lineHeight: 20,
  },
  lifetimeContent: {
    gap: 16,
  },
  lifetimeTraditional: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFF',
    lineHeight: 24,
  },
  componentsSection: {
    gap: 8,
  },
  componentsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fbbf24',
    marginBottom: 4,
  },
  componentItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  componentText: {
    flex: 1,
    fontSize: 14,
    color: '#FFF',
    lineHeight: 20,
  },
  timingSection: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 12,
  },
  timingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fbbf24',
    marginBottom: 8,
  },
  timingText: {
    fontSize: 13,
    color: '#FFF',
    lineHeight: 20,
    marginBottom: 4,
  },
  significanceSection: {
    backgroundColor: 'rgba(168,85,247,0.1)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.3)',
  },
  significanceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#c084fc',
    marginBottom: 8,
  },
  significanceText: {
    fontSize: 14,
    color: '#FFF',
    lineHeight: 22,
  },
});
