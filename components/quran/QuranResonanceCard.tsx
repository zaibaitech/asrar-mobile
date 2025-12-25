/**
 * Quran Resonance Card Component
 * Premium mobile-first design for displaying Qur'anic verse resonance
 * For reflection only - not divination
 */

import type { QuranResonance } from '@/services/QuranResonanceService';
import * as Clipboard from 'expo-clipboard';
import { LinearGradient } from 'expo-linear-gradient';
import { BookOpen, Copy, ExternalLink, HelpCircle, RefreshCw } from 'lucide-react-native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface QuranResonanceCardProps {
  resonance: QuranResonance | null;
  loading?: boolean;
  error?: string;
  accentColor?: string;
  language: 'en' | 'ar' | 'fr';
  onRetry?: () => void;
}

export function QuranResonanceCard({
  resonance,
  loading = false,
  error,
  accentColor = '#10b981',
  language,
  onRetry,
}: QuranResonanceCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyArabic = async () => {
    if (!resonance) return;
    
    try {
      await Clipboard.setStringAsync(resonance.ayahTextAr);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleOpenLink = async () => {
    if (!resonance) return;
    
    try {
      const supported = await Linking.canOpenURL(resonance.quranComUrl);
      if (supported) {
        await Linking.openURL(resonance.quranComUrl);
      } else {
        Alert.alert('Error', 'Cannot open Quran.com link');
      }
    } catch (err) {
      console.error('Failed to open link:', err);
      Alert.alert('Error', 'Failed to open link');
    }
  };

  const handleInfoPress = () => {
    const message = language === 'ar'
      ? 'هذا مجرد تذكير تأملي يتم إنشاؤه من خلال رسم الخرائط العددية. إنه ليس حكمًا دينيًا أو تنبؤًا أو قراءة الطالع.'
      : language === 'fr'
      ? 'Ceci est une invite réflexive générée à partir d\'une cartographie numérique. Ce n\'est pas une décision religieuse, une prédiction ou de la voyance.'
      : 'This is a reflective prompt generated from numerical mapping. It is not a religious ruling, prediction, or fortune-telling.';

    Alert.alert(
      language === 'ar' ? 'معلومات' : language === 'fr' ? 'Information' : 'Information',
      message,
      [{ text: language === 'ar' ? 'حسنًا' : language === 'fr' ? 'D\'accord' : 'OK' }]
    );
  };

  const getTitleText = () => {
    if (language === 'ar') return 'الرنين القرآني';
    if (language === 'fr') return 'Résonance Coranique';
    return 'Qur\'anic Resonance';
  };

  const getSubtitleText = () => {
    if (language === 'ar') return 'آية للتأمل من خلال رقمك';
    if (language === 'fr') return 'Un verset pour la réflexion à travers votre nombre';
    return 'A verse for reflection through your number';
  };

  const getReflectionTitle = () => {
    if (language === 'ar') return 'تأمل';
    if (language === 'fr') return 'Réflexion';
    return 'Reflection';
  };

  const getReflectionText = () => {
    if (language === 'ar') return 'اقرأ ببطء، ثم لاحظ ما يبرز لموقفك الحالي. استخدمه كتذكير لتحسين الذات والامتنان.';
    if (language === 'fr') return 'Lisez lentement, puis remarquez ce qui ressort pour votre situation actuelle. Utilisez-le comme un rappel pour l\'amélioration personnelle et la gratitude.';
    return 'Read slowly, then notice what stands out for your current situation. Use it as a reminder for self-improvement and gratitude.';
  };

  const getFooterText = () => {
    if (language === 'ar') return 'للتأمل فقط • ليس عرافة أو حكم قانوني';
    if (language === 'fr') return 'Pour la réflexion uniquement • Pas de divination ou de décision juridique';
    return 'For reflection only • Not divination or legal ruling';
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(6, 78, 59, 0.15)', 'rgba(15, 23, 42, 0.3)']}
          style={styles.gradientBg}
        >
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={accentColor} />
            <Text style={styles.loadingText}>
              {language === 'ar' ? 'جاري التحميل...' : language === 'fr' ? 'Chargement...' : 'Loading resonance...'}
            </Text>
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(127, 29, 29, 0.15)', 'rgba(15, 23, 42, 0.3)']}
          style={styles.gradientBg}
        >
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>
              {language === 'ar' ? 'تعذر تحميل الآية' : language === 'fr' ? 'Impossible de charger le verset' : 'Could not load resonance verse'}
            </Text>
            {onRetry && (
              <TouchableOpacity style={[styles.retryButton, { borderColor: accentColor }]} onPress={onRetry}>
                <RefreshCw size={16} color={accentColor} />
                <Text style={[styles.retryText, { color: accentColor }]}>
                  {language === 'ar' ? 'إعادة المحاولة' : language === 'fr' ? 'Réessayer' : 'Retry'}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </View>
    );
  }

  if (!resonance) {
    return (
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(6, 78, 59, 0.15)', 'rgba(15, 23, 42, 0.3)']}
          style={styles.gradientBg}
        >
          <Text style={styles.emptyText}>
            {language === 'ar' ? 'لا توجد آية متاحة لهذا الرقم' : language === 'fr' ? 'Aucun verset disponible pour ce nombre' : 'No verse available for this number'}
          </Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['rgba(6, 78, 59, 0.15)', 'rgba(15, 23, 42, 0.3)']}
        style={styles.gradientBg}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <BookOpen size={22} color="#10b981" strokeWidth={2.5} />
            <View style={styles.headerTexts}>
              <Text style={styles.title}>{getTitleText()}</Text>
              <Text style={styles.subtitle}>{getSubtitleText()}</Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleInfoPress} style={styles.infoButton}>
            <HelpCircle size={18} color="#64748b" />
          </TouchableOpacity>
        </View>

        {/* Surah Identity Card */}
        <View style={[styles.surahCard, { borderTopColor: accentColor }]}>
          <Text style={styles.surahNameAr}>{resonance.surahNameAr}</Text>
          <Text style={styles.surahNameEn}>
            {language === 'fr' ? resonance.surahNameFr : resonance.surahNameEn}
          </Text>
          <View style={[styles.ayahBadge, { backgroundColor: `${accentColor}20`, borderColor: accentColor }]}>
            <Text style={[styles.ayahBadgeText, { color: accentColor }]}>
              {language === 'ar'
                ? `الآية ${resonance.ayahNumber} من ${resonance.surahAyahCount}`
                : language === 'fr'
                ? `Verset ${resonance.ayahNumber} sur ${resonance.surahAyahCount}`
                : `Ayah ${resonance.ayahNumber} of ${resonance.surahAyahCount}`}
            </Text>
          </View>
        </View>

        {/* Arabic Verse Card */}
        <View style={styles.verseCard}>
          <View style={styles.verseHeader}>
            <Text style={styles.verseLabel}>
              {language === 'ar' ? 'النص العربي' : language === 'fr' ? 'TEXTE ARABE' : 'ARABIC TEXT'}
            </Text>
            <TouchableOpacity onPress={handleCopyArabic} style={styles.copyButton}>
              <Copy size={16} color={copied ? accentColor : '#94a3b8'} />
              {copied && <Text style={[styles.copiedText, { color: accentColor }]}>✓</Text>}
            </TouchableOpacity>
          </View>
          <View style={[styles.accentBar, { backgroundColor: accentColor }]} />
          <Text style={styles.ayahTextAr}>{resonance.ayahTextAr}</Text>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={[styles.ctaButton, { borderColor: accentColor }]}
          onPress={handleOpenLink}
          activeOpacity={0.75}
        >
          <BookOpen size={20} color={accentColor} strokeWidth={2.5} />
          <Text style={[styles.ctaButtonText, { color: accentColor }]}>
            {language === 'ar'
              ? 'اقرأ الآية الكاملة على Quran.com'
              : language === 'fr'
              ? 'Lire le verset complet sur Quran.com'
              : 'Read full verse on Quran.com'}
          </Text>
          <ExternalLink size={18} color={accentColor} strokeWidth={2} />
        </TouchableOpacity>

        {/* Reflection Note */}
        <View style={styles.reflectionCard}>
          <Text style={styles.reflectionTitle}>{getReflectionTitle()}</Text>
          <Text style={styles.reflectionText}>{getReflectionText()}</Text>
          <View style={styles.reflectionDivider} />
          <Text style={styles.reflectionFooter}>{getFooterText()}</Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  gradientBg: {
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.15)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    flex: 1,
  },
  headerTexts: {
    flex: 1,
  },
  title: {
    fontSize: 19,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    lineHeight: 18,
  },
  infoButton: {
    padding: 4,
  },
  surahCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 14,
    borderTopWidth: 3,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.1)',
  },
  surahNameAr: {
    fontSize: 32,
    fontWeight: '800',
    color: '#f1f5f9',
    marginBottom: 8,
    textAlign: 'center',
  },
  surahNameEn: {
    fontSize: 17,
    color: '#cbd5e1',
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  ayahBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
  },
  ayahBadgeText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  verseCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 14,
    padding: 18,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.08)',
  },
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  verseLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    padding: 6,
  },
  copiedText: {
    fontSize: 12,
    fontWeight: '700',
  },
  accentBar: {
    width: 4,
    height: 40,
    borderRadius: 2,
    marginBottom: 14,
    opacity: 0.4,
  },
  ayahTextAr: {
    fontSize: 20,
    lineHeight: 38,
    color: '#f1f5f9',
    textAlign: 'right',
    fontWeight: '500',
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    backgroundColor: 'rgba(16, 185, 129, 0.08)',
    marginBottom: 14,
  },
  ctaButtonText: {
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.3,
    flex: 1,
    textAlign: 'center',
  },
  reflectionCard: {
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.08)',
  },
  reflectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#a78bfa',
    marginBottom: 10,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  reflectionText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#cbd5e1',
    marginBottom: 12,
  },
  reflectionDivider: {
    height: 1,
    backgroundColor: 'rgba(148, 163, 184, 0.1)',
    marginBottom: 10,
  },
  reflectionFooter: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: '#94a3b8',
  },
  errorContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    gap: 14,
  },
  errorText: {
    fontSize: 15,
    color: '#f87171',
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  retryText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    paddingVertical: 30,
  },
});
