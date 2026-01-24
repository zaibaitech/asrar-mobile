import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
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
import { getZodiacSign } from '../../../constants/zodiacData';
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
  const zodiac = getZodiacSign(result.burujRemainder);
  const totalHadadValue = result.combinedTotal;
  
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
            <View style={[styles.card, { 
              backgroundColor: `${colors.accent}33`,
              borderColor: `${colors.accent}33`,
              shadowColor: colors.accent
            }]}>
              <View style={styles.cardHeader}>
                <Moon size={24} color={colors.accent} />
                <Text style={[styles.cardTitle, { color: colors.accent }]}>
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
            </View>
          )}

          {/* Zodiac Sign (personal; always a single sign from remainder) */}
          {zodiac && (
            <View style={[styles.card, { 
              backgroundColor: `${colors.accent}33`,
              borderColor: `${colors.accent}33`,
              shadowColor: colors.accent
            }]}>
              <View style={styles.cardHeader}>
                <Star size={24} color={colors.accent} />
                <Text style={[styles.cardTitle, { color: colors.accent }]}>
                  {language === 'en' ? 'Your Zodiac Sign' : 'Votre Signe Zodiacal'}
                </Text>
              </View>
              <View style={styles.zodiacContent}>
                <Text style={styles.zodiacText}>
                  {language === 'fr' ? zodiac.nameFr : zodiac.nameEn}
                </Text>
                <Text style={styles.zodiacArabic}>
                  {zodiac.nameAr}
                </Text>
              </View>
            </View>
          )}

          {/* Divine Names */}
          {'arabic' in spiritual_practice.divine_names && (
            <View style={[styles.card, { 
              backgroundColor: `${colors.accent}33`,
              borderColor: `${colors.accent}33`,
              shadowColor: colors.accent
            }]}>
              <View style={styles.cardHeader}>
                <Sparkles size={24} color={colors.accent} />
                <Text style={[styles.cardTitle, { color: colors.accent }]}>
                  {language === 'en' ? 'Divine Names to Recite' : 'Noms Divins à Réciter'}
                </Text>
                <View style={[styles.countPill, { borderColor: colors.border }]}
                >
                  <Text style={[styles.countPillText, { color: colors.accent }]}>
                    {totalHadadValue}×
                  </Text>
                </View>
              </View>
              
              <View style={styles.divineNamesContent}>
                {(() => {
                  const arabic = spiritual_practice.divine_names.arabic;
                  const names = arabic
                    .split(/[\n،,]+/g)
                    .map((s) => s.trim())
                    .filter(Boolean);

                  return (
                    <>
                      <View style={styles.arabicRow}>
                        <Text style={styles.arabicText}>{arabic}</Text>
                        <TouchableOpacity onPress={() => handleCopy(arabic, 'divineNames')}>
                          {copied === 'divineNames' ? (
                            <Check size={20} color="#4ade80" />
                          ) : (
                            <Copy size={20} color="#FFF" />
                          )}
                        </TouchableOpacity>
                      </View>

                      {names.length > 1 && (
                        <View style={styles.zikrList}>
                          {names.map((name, idx) => (
                            <View key={`${name}-${idx}`} style={[styles.zikrRow, { borderColor: colors.border }]}>
                              <Text style={styles.zikrNameArabic}>{name}</Text>
                              <View style={[styles.zikrCountBadge, { backgroundColor: colors.background, borderColor: colors.border }]}>
                                <Text style={[styles.zikrCountText, { color: colors.accent }]}>
                                  {totalHadadValue}
                                </Text>
                              </View>
                            </View>
                          ))}
                        </View>
                      )}

                      {names.length <= 1 && (
                        <View style={styles.singleCountRow}>
                          <Text style={styles.singleCountLabel}>
                            {language === 'en' ? 'Recite this name:' : 'Récitez ce nom :'}
                          </Text>
                          <Text style={[styles.singleCountValue, { color: colors.accent }]}>
                            {totalHadadValue}
                          </Text>
                        </View>
                      )}
                    </>
                  );
                })()}
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
            </View>
          )}

          {/* Dhikr Counter */}
          {showDhikrCounter && 'arabic' in spiritual_practice.divine_names && (
            <DhikrCounter
              targetCount={totalHadadValue}
              divineNames={spiritual_practice.divine_names}
              quranicVerse={spiritual_practice.quranic_verse}
              angel={spiritual_practice.angel}
              jinn={spiritual_practice.jinn}
              practiceNight={spiritual_practice.practice_night}
              zodiacSign={zodiac ? { en: zodiac.nameEn, fr: zodiac.nameFr, arabic: zodiac.nameAr } : undefined}
              instructions={spiritual_practice.instructions}
              elementColors={colors}
            />
          )}

          {/* Quranic Verse */}
          {showQuranicVerse && spiritual_practice.quranic_verse && (
            <View style={[styles.card, { 
              backgroundColor: `${colors.accent}33`,
              borderColor: `${colors.accent}33`,
              shadowColor: colors.accent
            }]}>
              <TouchableOpacity
                style={styles.collapsibleHeader}
                onPress={() => setShowQuranicVerse(!showQuranicVerse)}
              >
                <View style={styles.cardHeader}>
                  <BookOpen size={24} color={colors.accent} />
                  <Text style={[styles.cardTitle, { color: colors.accent }]}>
                    {language === 'en' ? 'Quranic Verse' : 'Verset Coranique'}
                  </Text>
                  <View style={[styles.countPill, { borderColor: colors.border }]}>
                    <Text style={[styles.countPillText, { color: colors.accent }]}>
                      {totalHadadValue}×
                    </Text>
                  </View>
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
            </View>
          )}

          {/* Angels & Jinn */}
          {showAngelsJinn && (
            <View style={styles.row}>
              {spiritual_practice.angel && (
                <View style={[styles.smallCard, { 
                  backgroundColor: `${colors.accent}33`,
                  borderColor: `${colors.accent}33`,
                  shadowColor: colors.accent
                }]}>
                  <View style={styles.smallCardHeader}>
                    <Shield size={20} color={colors.accent} />
                    <Text style={[styles.smallCardTitle, { color: colors.accent }]}>
                      {language === 'en' ? 'Angel' : 'Ange'}
                    </Text>
                    <View style={[styles.countPill, { borderColor: colors.border }]}>
                      <Text style={[styles.countPillText, { color: colors.accent }]}>
                        {totalHadadValue}×
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.angelArabic}>{spiritual_practice.angel.arabic}</Text>
                  <Text style={styles.angelTransliteration}>{spiritual_practice.angel.transliteration}</Text>
                  {spiritual_practice.angel.name && (
                    <Text style={styles.angelName}>
                      {spiritual_practice.angel.name[language as 'en' | 'fr']}
                    </Text>
                  )}
                </View>
              )}

              {spiritual_practice.jinn && (
                <View style={[styles.smallCard, { 
                  backgroundColor: `${colors.accent}33`,
                  borderColor: `${colors.accent}33`,
                  shadowColor: colors.accent
                }]}>
                  <View style={styles.smallCardHeader}>
                    <Zap size={20} color={colors.accent} />
                    <Text style={[styles.smallCardTitle, { color: colors.accent }]}>
                      {language === 'en' ? 'Jinn' : 'Djinn'}
                    </Text>
                    <View style={[styles.countPill, { borderColor: colors.border }]}>
                      <Text style={[styles.countPillText, { color: colors.accent }]}>
                        {totalHadadValue}×
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.angelArabic}>{spiritual_practice.jinn.arabic}</Text>
                  <Text style={styles.angelTransliteration}>{spiritual_practice.jinn.transliteration}</Text>
                  {spiritual_practice.jinn.meaning && (
                    <Text style={styles.angelName}>
                      {spiritual_practice.jinn.meaning[language as 'en' | 'fr']}
                    </Text>
                  )}
                </View>
              )}
            </View>
          )}

          {/* Instructions */}
          {spiritual_practice.instructions && (
            <View style={[styles.card, { 
              backgroundColor: `${colors.accent}33`,
              borderColor: `${colors.accent}33`,
              shadowColor: colors.accent
            }]}>
              <TouchableOpacity
                style={styles.collapsibleHeader}
                onPress={() => setShowInstructions(!showInstructions)}
              >
                <View style={styles.cardHeader}>
                  <CheckSquare size={24} color={colors.accent} />
                  <Text style={[styles.cardTitle, { color: colors.accent }]}>
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
            </View>
          )}
        </View>
      )}

      {/* Monthly Sadaqah */}
      {activeType === 'monthly' && profile.sadaqah.monthly && (
        <View>
          <View style={[styles.card, { 
            backgroundColor: `${colors.accent}33`,
            borderColor: `${colors.accent}33`,
            shadowColor: colors.accent
          }]}>
            <View style={styles.cardHeader}>
              <Gift size={24} color={colors.accent} />
              <Text style={[styles.cardTitle, { color: colors.accent }]}>
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
          </View>
        </View>
      )}

      {/* Lifetime Offering */}
      {activeType === 'lifetime' && profile.sadaqah.lifetime && (
        <View>
          <View style={[styles.card, { 
            backgroundColor: `${colors.accent}33`,
            borderColor: `${colors.accent}33`,
            shadowColor: colors.accent
          }]}>
            <View style={styles.cardHeader}>
              <Star size={24} color={colors.accent} />
              <Text style={[styles.cardTitle, { color: colors.accent }]}>
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
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1020',
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
    color: '#94a3b8',
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
    backgroundColor: 'rgba(30, 58, 138, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(96, 165, 250, 0.1)',
    minHeight: 48,
  },
  typeButtonActive: {
    borderWidth: 2,
    borderColor: 'rgba(96, 165, 250, 0.4)',
    backgroundColor: 'rgba(30, 58, 138, 0.4)',
  },
  typeButtonText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    marginBottom: 20,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
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
    flex: 1,
  },
  countPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    borderWidth: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
  },
  countPillText: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  practiceNight: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFF',
    marginBottom: 4,
  },
  practiceNote: {
    fontSize: 14,
    color: '#cbd5e1',
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
    color: '#cbd5e1',
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
  zikrList: {
    marginTop: 12,
    gap: 8,
  },
  zikrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  zikrNameArabic: {
    flex: 1,
    fontSize: 22,
    color: '#FFF',
    fontWeight: '600',
    textAlign: 'right',
  },
  zikrCountBadge: {
    minWidth: 56,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  zikrCountText: {
    fontSize: 14,
    fontWeight: '800',
  },
  singleCountRow: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  singleCountLabel: {
    fontSize: 14,
    color: '#cbd5e1',
  },
  singleCountValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  transliteration: {
    fontSize: 18,
    color: '#93c5fd',
    marginBottom: 8,
    fontWeight: '500',
  },
  translation: {
    fontSize: 16,
    color: '#cbd5e1',
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
    color: '#93c5fd',
    fontStyle: 'italic',
  },
  verseTranslation: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  verseReference: {
    fontSize: 12,
    color: '#94a3b8',
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
  },
  angelArabic: {
    fontSize: 20,
    color: '#FFF',
    marginBottom: 4,
  },
  angelTransliteration: {
    fontSize: 14,
    color: '#93c5fd',
    marginBottom: 4,
  },
  angelName: {
    fontSize: 12,
    color: '#cbd5e1',
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
    color: '#cbd5e1',
    lineHeight: 20,
    paddingTop: 6,
  },
  sadaqahSection: {
    marginBottom: 16,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#60a5fa',
    marginBottom: 4,
  },
  sadaqahText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  alternativesSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(96, 165, 250, 0.2)',
  },
  alternativesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#60a5fa',
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
    color: '#60a5fa',
  },
  alternativeText: {
    flex: 1,
    fontSize: 14,
    color: '#cbd5e1',
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
    color: '#60a5fa',
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
    color: '#cbd5e1',
    lineHeight: 20,
  },
  timingSection: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 12,
    padding: 12,
  },
  timingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#60a5fa',
    marginBottom: 8,
  },
  timingText: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 20,
    marginBottom: 4,
  },
  significanceSection: {
    backgroundColor: 'rgba(30, 58, 138, 0.3)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.3)',
  },
  significanceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#60a5fa',
    marginBottom: 8,
  },
  significanceText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 22,
  },
});
