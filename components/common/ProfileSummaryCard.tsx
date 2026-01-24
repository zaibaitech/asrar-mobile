/**
 * Profile Summary Card
 * Shows user's spiritual profile summary in Name Destiny results
 */

import { getElementColors } from '@/constants/ElementColors';
import { useLanguage } from '@/contexts/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, User } from 'lucide-react-native';
import React from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface ProfileSummaryCardProps {
  personName: string;
  motherName?: string;
  element: string;
  divineName?: string;
  bestDay?: string;
  onViewFullProfile?: () => void;
}

export function ProfileSummaryCard({
  personName,
  motherName,
  element,
  divineName,
  bestDay,
  onViewFullProfile
}: ProfileSummaryCardProps) {
  const { language } = useLanguage();
  
  const elementKey = element.toLowerCase() as 'fire' | 'earth' | 'air' | 'water';
  const colors = getElementColors(elementKey);
  
  const getElementEmoji = (el: string) => {
    const emojis: Record<string, string> = {
      fire: '🔥',
      earth: '🌍',
      air: '🌪️',
      water: '💧'
    };
    return emojis[el.toLowerCase()] || '⭐';
  };
  
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[`${colors.primary[0]}22`, `${colors.primary[1]}11`]}
        style={styles.card}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.iconCircle, { backgroundColor: colors.background }]}>
            <User size={20} color={colors.accent} />
          </View>
          <Text style={styles.title}>
            {language === 'en' ? 'Your Spiritual Profile' :
             language === 'fr' ? 'Votre Profil Spirituel' :
             'ملفك الروحي'}
          </Text>
        </View>
        
        {/* Profile details */}
        <View style={styles.details}>
          <View style={styles.detailRow}>
            <Text style={styles.label}>
              {language === 'en' ? 'Name:' :
               language === 'fr' ? 'Nom:' :
               'الاسم:'}
            </Text>
            <Text style={styles.value}>{personName}</Text>
          </View>
          
          {motherName && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>
                {language === 'en' ? 'Mother:' :
                 language === 'fr' ? 'Mère:' :
                 'الأم:'}
              </Text>
              <Text style={styles.value}>{motherName}</Text>
            </View>
          )}
          
          <View style={styles.detailRow}>
            <Text style={styles.label}>
              {language === 'en' ? 'Element:' :
               language === 'fr' ? 'Élément:' :
               'العنصر:'}
            </Text>
            <View style={styles.elementValue}>
              <Text style={styles.elementEmoji}>{getElementEmoji(element)}</Text>
              <Text style={styles.value}>{element}</Text>
            </View>
          </View>
          
          {divineName && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>
                {language === 'en' ? 'Divine Name:' :
                 language === 'fr' ? 'Nom Divin:' :
                 'الاسم الإلهي:'}
              </Text>
              <Text style={[styles.value, styles.arabicText]}>{divineName}</Text>
            </View>
          )}
          
          {bestDay && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>
                {language === 'en' ? 'Best Day:' :
                 language === 'fr' ? 'Meilleur Jour:' :
                 'أفضل يوم:'}
              </Text>
              <Text style={styles.value}>{bestDay}</Text>
            </View>
          )}
        </View>
        
        {/* View full profile button */}
        {onViewFullProfile && (
          <TouchableOpacity
            style={[styles.viewButton, { borderColor: colors.accent }]}
            onPress={onViewFullProfile}
            activeOpacity={0.7}
          >
            <Text style={[styles.viewButtonText, { color: colors.accent }]}>
              {language === 'en' ? '📊 View Full Profile' :
               language === 'fr' ? '📊 Voir le Profil Complet' :
               '📊 عرض الملف الكامل'}
            </Text>
            <ChevronRight size={20} color={colors.accent} />
          </TouchableOpacity>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  details: {
    gap: 14,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#9ca3af',
    fontWeight: '500',
  },
  value: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '600',
  },
  elementValue: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  elementEmoji: {
    fontSize: 16,
  },
  arabicText: {
    fontFamily: 'System', // Will use system Arabic font
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginTop: 8,
    gap: 8,
  },
  viewButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
});
