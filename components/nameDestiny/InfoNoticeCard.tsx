/**
 * Info Notice Card Component
 * Displays important distinction notice to prevent confusion
 */

import { Info } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface InfoNoticeCardProps {
  language: 'en' | 'ar' | 'fr';
}

export function InfoNoticeCard({ language }: InfoNoticeCardProps) {
  const titleText = language === 'ar' 
    ? 'ملاحظة مهمة'
    : language === 'fr'
    ? 'Note Importante'
    : 'Important Note';

  const bodyText = language === 'ar'
    ? 'مخطط عناصر الاسم هذا يعتمد فقط على حروف اسمك ويعكس كيفية التعبير عن طاقتك الخارجية. عنصرك الشخصي (الطبع) يمثل جوهرك الروحي الحقيقي ويستخدم لجميع التحليلات الروحية الأساسية.'
    : language === 'fr'
    ? 'Ce Tableau des Éléments du Nom est basé UNIQUEMENT sur les lettres de votre nom et reflète la façon dont votre énergie s\'exprime extérieurement. Votre Élément Personnel (Tab) représente votre véritable essence spirituelle et est utilisé pour toutes les analyses spirituelles de base.'
    : 'This Name Element Chart is based ONLY on the letters of your name and reflects how your energy is expressed outwardly. Your Personal Element (Tab) represents your true spiritual essence and is used for all core spiritual analyses.';

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Info size={18} color="#60a5fa" strokeWidth={2.5} />
        <Text style={styles.title}>{titleText}</Text>
      </View>
      <Text style={[styles.bodyText, language === 'ar' && styles.arabicText]}>
        {bodyText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.2)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#93c5fd',
  },
  bodyText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#cbd5e1',
  },
  arabicText: {
    fontSize: 14,
    lineHeight: 23,
    textAlign: 'right',
  },
});
