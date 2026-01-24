/**
 * Shopping & Educational Resources Component
 * Provides shopping links, guides, and educational content
 */

import { getElementColors } from '@/constants/ElementColors';
import { useLanguage } from '@/contexts/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import {
    Book,
    ExternalLink,
    MapPin,
    ShoppingBag,
    Sparkles
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

interface ShoppingResourcesProps {
  element: 'fire' | 'earth' | 'air' | 'water';
}

export function ShoppingResources({ element }: ShoppingResourcesProps) {
  const { language } = useLanguage();
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});
  const colors = getElementColors(element);
  
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  const openLink = (url: string) => {
    Linking.openURL(url);
  };
  
  const openLocalStores = () => {
    // Open maps/search for local crystal shops
    const query = encodeURIComponent('crystal shops near me');
    Linking.openURL(`https://www.google.com/maps/search/${query}`);
  };
  
  return (
    <View style={styles.container}>
      {/* Shopping section */}
      <TouchableOpacity
        style={[styles.section, { borderColor: colors.border }]}
        onPress={() => toggleSection('shopping')}
        activeOpacity={0.8}
      >
        <View style={styles.sectionHeader}>
          <View style={[styles.iconCircle, { backgroundColor: colors.background }]}>
            <ShoppingBag size={20} color={colors.accent} />
          </View>
          <Text style={styles.sectionTitle}>
            {language === 'en' ? '🛍️ Shopping Guide' :
             language === 'fr' ? '🛍️ Guide d\'Achat' :
             '🛍️ دليل التسوق'}
          </Text>
          <Text style={styles.chevron}>
            {expandedSections.shopping ? '−' : '+'}
          </Text>
        </View>
        
        {expandedSections.shopping && (
          <View style={styles.sectionContent}>
            <Text style={styles.contentTitle}>
              {language === 'en' ? 'Trusted Online Stores:' :
               language === 'fr' ? 'Boutiques en Ligne de Confiance:' :
               'المتاجر الموثوقة عبر الإنترنت:'}
            </Text>
            
            <TouchableOpacity
              style={[styles.linkButton, { borderColor: colors.accent }]}
              onPress={() => openLink('https://www.amazon.com/s?k=healing+crystals')}
            >
              <Text style={styles.linkText}>Amazon - Healing Crystals</Text>
              <ExternalLink size={16} color={colors.accent} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.linkButton, { borderColor: colors.accent }]}
              onPress={() => openLink('https://www.etsy.com/search?q=genuine+healing+stones')}
            >
              <Text style={styles.linkText}>Etsy - Authentic Stones</Text>
              <ExternalLink size={16} color={colors.accent} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.localButton, { backgroundColor: colors.background }]}
              onPress={openLocalStores}
            >
              <MapPin size={18} color={colors.accent} />
              <Text style={[styles.localButtonText, { color: colors.accent }]}>
                {language === 'en' ? 'Find Local Crystal Shops' :
                 language === 'fr' ? 'Trouver des Boutiques Locales' :
                 'ابحث عن متاجر محلية'}
              </Text>
            </TouchableOpacity>
            
            <Text style={styles.priceNote}>
              {language === 'en' ? '💡 Price Guide: Small ($5-$15), Medium ($15-$40), Large ($40-$100)' :
               language === 'fr' ? '💡 Guide de Prix: Petit ($5-$15), Moyen ($15-$40), Grand ($40-$100)' :
               '💡 دليل الأسعار: صغير ($5-$15)، متوسط ($15-$40)، كبير ($40-$100)'}
            </Text>
          </View>
        )}
      </TouchableOpacity>
      
      {/* Education section */}
      <TouchableOpacity
        style={[styles.section, { borderColor: colors.border }]}
        onPress={() => toggleSection('education')}
        activeOpacity={0.8}
      >
        <View style={styles.sectionHeader}>
          <View style={[styles.iconCircle, { backgroundColor: colors.background }]}>
            <Book size={20} color={colors.accent} />
          </View>
          <Text style={styles.sectionTitle}>
            {language === 'en' ? '📚 Stone Education' :
             language === 'fr' ? '📚 Éducation sur les Pierres' :
             '📚 تعليم الأحجار'}
          </Text>
          <Text style={styles.chevron}>
            {expandedSections.education ? '−' : '+'}
          </Text>
        </View>
        
        {expandedSections.education && (
          <View style={styles.sectionContent}>
            <View style={styles.eduItem}>
              <Text style={styles.eduTitle}>
                {language === 'en' ? '🌙 How to Cleanse Your Stones' :
                 language === 'fr' ? '🌙 Comment Nettoyer vos Pierres' :
                 '🌙 كيفية تنظيف أحجارك'}
              </Text>
              <Text style={styles.eduText}>
                {language === 'en' ? 'Cleanse monthly under moonlight for 3-4 hours or with sage smoke. This removes accumulated negative energy.' :
                 language === 'fr' ? 'Nettoyez mensuellement sous la lumière de la lune pendant 3-4 heures ou avec de la fumée de sauge.' :
                 'نظف شهريًا تحت ضوء القمر لمدة 3-4 ساعات أو بدخان المريمية.'}
              </Text>
            </View>
            
            <View style={styles.eduItem}>
              <Text style={styles.eduTitle}>
                {language === 'en' ? '💫 Setting Intentions' :
                 language === 'fr' ? '💫 Définir des Intentions' :
                 '💫 تحديد النوايا'}
              </Text>
              <Text style={styles.eduText}>
                {language === 'en' ? 'Hold your stone, close your eyes, and clearly state your intention. Visualize your goal while making dua.' :
                 language === 'fr' ? 'Tenez votre pierre, fermez les yeux et énoncez clairement votre intention.' :
                 'أمسك حجرك، أغمض عينيك، وحدد نيتك بوضوح.'}
              </Text>
            </View>
            
            <View style={styles.eduItem}>
              <Text style={styles.eduTitle}>
                {language === 'en' ? '🔍 Spot Authentic Stones' :
                 language === 'fr' ? '🔍 Repérer les Pierres Authentiques' :
                 '🔍 اكتشاف الأحجار الأصلية'}
              </Text>
              <Text style={styles.eduText}>
                {language === 'en' ? 'Real stones feel cool, have natural variations, may have inclusions. Too perfect = likely fake.' :
                 language === 'fr' ? 'Les vraies pierres sont fraîches, ont des variations naturelles. Trop parfait = probablement faux.' :
                 'الأحجار الحقيقية باردة، لها اختلافات طبيعية. مثالي جدًا = على الأرجح مزيف.'}
              </Text>
            </View>
            
            <View style={styles.eduItem}>
              <Text style={styles.eduTitle}>
                {language === 'en' ? '🧘 Combining Stones' :
                 language === 'fr' ? '🧘 Combiner les Pierres' :
                 '🧘 دمج الأحجار'}
              </Text>
              <Text style={styles.eduText}>
                {language === 'en' ? 'You can use multiple stones together. Start with 2-3 complementary stones for your zodiac.' :
                 language === 'fr' ? 'Vous pouvez utiliser plusieurs pierres ensemble. Commencez par 2-3 pierres complémentaires.' :
                 'يمكنك استخدام أحجار متعددة معًا. ابدأ بـ 2-3 أحجار تكميلية.'}
              </Text>
            </View>
          </View>
        )}
      </TouchableOpacity>
      
      {/* Stone of the Month */}
      <LinearGradient
        colors={[`${colors.primary[0]}22`, `${colors.primary[1]}11`]}
        style={styles.featuredSection}
      >
        <View style={styles.featuredHeader}>
          <Sparkles size={24} color={colors.accent} />
          <Text style={styles.featuredTitle}>
            {language === 'en' ? '⭐ Featured Stone' :
             language === 'fr' ? '⭐ Pierre en Vedette' :
             '⭐ الحجر المميز'}
          </Text>
        </View>
        
        <View style={styles.featuredCard}>
          <Text style={styles.featuredStone}>
            {language === 'en' ? '💎 Clear Quartz' :
             language === 'fr' ? '💎 Quartz Clair' :
             '💎 كوارتز شفاف'}
          </Text>
          <Text style={styles.featuredDesc}>
            {language === 'en' ? 'Master healer stone. Amplifies energy of other stones and intentions. Perfect for beginners.' :
             language === 'fr' ? 'Pierre de guérison principale. Amplifie l\'énergie des autres pierres. Parfait pour débutants.' :
             'حجر الشفاء الرئيسي. يضخم طاقة الأحجار الأخرى. مثالي للمبتدئين.'}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    marginVertical: 16,
  },
  section: {
    borderRadius: 14,
    borderWidth: 1,
    backgroundColor: '#1e293b',
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  chevron: {
    fontSize: 24,
    color: '#9ca3af',
    fontWeight: '300',
  },
  sectionContent: {
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  contentTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  linkButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  linkText: {
    fontSize: 14,
    color: '#d1d5db',
    flex: 1,
  },
  localButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 14,
    borderRadius: 10,
    marginTop: 8,
  },
  localButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  priceNote: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
    fontStyle: 'italic',
  },
  eduItem: {
    marginBottom: 16,
  },
  eduTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 6,
  },
  eduText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#d1d5db',
  },
  featuredSection: {
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  featuredTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  featuredCard: {
    padding: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
  },
  featuredStone: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  featuredDesc: {
    fontSize: 14,
    lineHeight: 20,
    color: '#d1d5db',
  },
});
