/**
 * Stone Detail Modal
 * Full-screen modal showing complete information about a selected stone
 */

import { getElementColors } from '@/constants/ElementColors';
import { getStoneVisual, type EnhancedStoneData } from '@/constants/enhancedStoneData';
import { useLanguage } from '@/contexts/LanguageContext';
import { LinearGradient } from 'expo-linear-gradient';
import * as Linking from 'expo-linking';
import {
    Bookmark,
    ExternalLink,
    Heart,
    Info,
    Share2,
    ShoppingCart,
    Sparkles,
    X
} from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface StoneDetailModalProps {
  visible: boolean;
  onClose: () => void;
  stone: EnhancedStoneData;
  zodiacSign: string;
  element: 'fire' | 'earth' | 'air' | 'water';
}

export function StoneDetailModal({ visible, onClose, stone, zodiacSign, element }: StoneDetailModalProps) {
  const { language } = useLanguage();
  const [bookmarked, setBookmarked] = useState(false);
  const colors = getElementColors(element);

  const visual = getStoneVisual(stone.id || stone.name);
  
  const rating = stone.zodiacRating[zodiacSign.toLowerCase()] || 3;
  const benefit = stone.benefitsFor[zodiacSign.toLowerCase()];
  
  const handleShare = async () => {
    // TODO: Implement share functionality
    console.log('Share stone:', stone.name);
  };
  
  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    // TODO: Save to user preferences
  };
  
  const openShoppingLink = (url: string) => {
    Linking.openURL(url);
  };
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Header with close button */}
        <LinearGradient
          colors={colors.primary}
          style={styles.header}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X size={24} color="#ffffff" />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleBookmark} style={styles.iconButton}>
              <Bookmark size={24} color={bookmarked ? "#FFD700" : "#ffffff"} fill={bookmarked ? "#FFD700" : "none"} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.iconButton}>
              <Share2 size={24} color="#ffffff" />
            </TouchableOpacity>
          </View>
        </LinearGradient>
        
        {/* Scrollable content */}
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Stone image/emoji placeholder */}
          <View style={styles.imageContainer}>
            <View style={[styles.iconCircle, { borderColor: `${colors.accent}33` }]}>
              <LinearGradient
                colors={visual.colors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.iconGradient}
              />
              <Text style={styles.stoneEmoji}>{visual.emoji}</Text>
            </View>
          </View>
          
          {/* Stone title and rating */}
          <View style={styles.titleSection}>
            <Text style={styles.stoneName}>
              {language === 'fr' ? stone.nameFr :
               language === 'ar' ? stone.nameAr :
               stone.name}
            </Text>
            <View style={styles.translations}>
              <Text style={styles.translationText}>
                {stone.nameAr} • {stone.nameFr}
              </Text>
            </View>
            
            <View style={styles.ratingRow}>
              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Text key={star} style={styles.star}>
                    {star <= rating ? '⭐' : '☆'}
                  </Text>
                ))}
              </View>
              <Text style={[styles.ratingText, { color: colors.accent }]}>
                {language === 'en' ? 'Perfect for' :
                 language === 'fr' ? 'Parfait pour' :
                 'مثالي لـ'} {zodiacSign}
              </Text>
            </View>
          </View>
          
          {/* About section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Info size={20} color={colors.accent} />
              <Text style={styles.sectionTitle}>
                {language === 'en' ? 'About This Stone' :
                 language === 'fr' ? 'À Propos de Cette Pierre' :
                 'عن هذا الحجر'}
              </Text>
            </View>
            <Text style={styles.description}>
              {language === 'fr' ? stone.description.fr :
               language === 'ar' ? stone.description.ar :
               stone.description.en}
            </Text>
          </View>
          
          {/* Properties */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Sparkles size={20} color={colors.accent} />
              <Text style={styles.sectionTitle}>
                {language === 'en' ? 'Spiritual Properties' :
                 language === 'fr' ? 'Propriétés Spirituelles' :
                 'الخصائص الروحية'}
              </Text>
            </View>
            <View style={styles.propertiesGrid}>
              {(language === 'fr' ? stone.properties.fr :
                language === 'ar' ? stone.properties.ar :
                stone.properties.en).map((prop, index) => (
                <View key={index} style={[styles.propertyPill, { borderColor: colors.accent, backgroundColor: colors.background }]}>
                  <Text style={[styles.propertyText, { color: colors.accent }]}>{prop}</Text>
                </View>
              ))}
            </View>
          </View>
          
          {/* Why good for zodiac */}
          {benefit && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Heart size={20} color={colors.accent} />
                <Text style={styles.sectionTitle}>
                  {language === 'en' ? `Why Good for ${zodiacSign}?` :
                   language === 'fr' ? `Pourquoi Bon pour ${zodiacSign}?` :
                   `لماذا جيد لـ ${zodiacSign}؟`}
                </Text>
              </View>
              <Text style={styles.description}>
                {language === 'fr' ? benefit.fr :
                 language === 'ar' ? benefit.ar :
                 benefit.en}
              </Text>
            </View>
          )}
          
          {/* Islamic spiritual use */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🤲</Text>
              <Text style={styles.sectionTitle}>
                {language === 'en' ? 'How to Use with Islamic Practice' :
                 language === 'fr' ? 'Comment Utiliser avec la Pratique Islamique' :
                 'كيفية الاستخدام مع الممارسة الإسلامية'}
              </Text>
            </View>
            {(language === 'fr' ? stone.islamicUse.fr :
              language === 'ar' ? stone.islamicUse.ar :
              stone.islamicUse.en).map((use, index) => (
              <Text key={index} style={styles.bulletPoint}>• {use}</Text>
            ))}
          </View>
          
          {/* Meditation guide */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🧘</Text>
              <Text style={styles.sectionTitle}>
                {language === 'en' ? 'Meditation Guide' :
                 language === 'fr' ? 'Guide de Méditation' :
                 'دليل التأمل'}
              </Text>
            </View>
            <Text style={styles.duration}>
              {language === 'en' ? `Duration: ${stone.meditation.duration}` :
               language === 'fr' ? `Durée: ${stone.meditation.duration}` :
               `المدة: ${stone.meditation.duration}`}
            </Text>
            <Text style={styles.description}>
              {language === 'fr' ? stone.meditation.guide.fr :
               language === 'ar' ? stone.meditation.guide.ar :
               stone.meditation.guide.en}
            </Text>
          </View>
          
          {/* Where to find */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <ShoppingCart size={20} color={colors.accent} />
              <Text style={styles.sectionTitle}>
                {language === 'en' ? 'Where to Find' :
                 language === 'fr' ? 'Où Trouver' :
                 'أين تجد'}
              </Text>
            </View>
            
            <Text style={styles.priceGuide}>
              {language === 'en' ? 'Price Guide:' :
               language === 'fr' ? 'Guide de Prix:' :
               'دليل الأسعار:'}
            </Text>
            <Text style={styles.priceText}>
              Small: {stone.shopping.priceRange.small} • 
              Medium: {stone.shopping.priceRange.medium} • 
              Large: {stone.shopping.priceRange.large}
            </Text>
            
            <Text style={styles.shopSubtitle}>
              {language === 'en' ? 'Online Stores:' :
               language === 'fr' ? 'Boutiques en Ligne:' :
               'المتاجر عبر الإنترنت:'}
            </Text>
            {stone.shopping.onlineStores.map((store, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.shopButton, { borderColor: colors.accent }]}
                onPress={() => openShoppingLink(store.url)}
              >
                <View style={styles.shopButtonContent}>
                  <Text style={styles.shopButtonText}>{store.name}</Text>
                  {store.verified && (
                    <Text style={styles.verifiedBadge}>✓ Verified</Text>
                  )}
                </View>
                <ExternalLink size={18} color={colors.accent} />
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Care instructions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>💡</Text>
              <Text style={styles.sectionTitle}>
                {language === 'en' ? 'Care Instructions' :
                 language === 'fr' ? 'Instructions d\'Entretien' :
                 'تعليمات العناية'}
              </Text>
            </View>
            {(language === 'fr' ? stone.care.fr :
              language === 'ar' ? stone.care.ar :
              stone.care.en).map((instruction, index) => (
              <Text key={index} style={styles.bulletPoint}>• {instruction}</Text>
            ))}
          </View>
          
          {/* Authenticity tips */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>🔍</Text>
              <Text style={styles.sectionTitle}>
                {language === 'en' ? 'How to Spot Authentic Stones' :
                 language === 'fr' ? 'Comment Repérer les Pierres Authentiques' :
                 'كيفية اكتشاف الأحجار الأصلية'}
              </Text>
            </View>
            {(language === 'fr' ? stone.authenticity.fr :
              language === 'ar' ? stone.authenticity.ar :
              stone.authenticity.en).map((tip, index) => (
              <Text key={index} style={styles.bulletPoint}>• {tip}</Text>
            ))}
          </View>
          
          {/* Related stones */}
          {stone.relatedStones.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionIcon}>🔗</Text>
                <Text style={styles.sectionTitle}>
                  {language === 'en' ? 'Related Stones' :
                   language === 'fr' ? 'Pierres Connexes' :
                   'الأحجار ذات الصلة'}
                </Text>
              </View>
              <View style={styles.relatedStones}>
                {stone.relatedStones.map((relatedId, index) => (
                  <View key={index} style={[styles.relatedPill, { borderColor: colors.border }]}>
                    <Text style={styles.relatedText}>{relatedId.replace(/-/g, ' ')}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
          
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  closeButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  iconButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: width,
    height: 240,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0b1220',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  iconCircle: {
    width: 152,
    height: 152,
    borderRadius: 76,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    overflow: 'hidden',
  },
  iconGradient: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.28,
  },
  stoneEmoji: {
    fontSize: 68,
  },
  titleSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  stoneName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  translations: {
    alignItems: 'center',
    marginBottom: 16,
  },
  translationText: {
    fontSize: 16,
    color: '#9ca3af',
  },
  ratingRow: {
    alignItems: 'center',
    gap: 8,
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
  },
  star: {
    fontSize: 20,
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  sectionIcon: {
    fontSize: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
    flex: 1,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#d1d5db',
  },
  propertiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  propertyPill: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  propertyText: {
    fontSize: 13,
    fontWeight: '600',
  },
  bulletPoint: {
    fontSize: 15,
    lineHeight: 24,
    color: '#d1d5db',
    marginBottom: 8,
  },
  duration: {
    fontSize: 14,
    color: '#9ca3af',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  priceGuide: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 14,
    color: '#d1d5db',
    marginBottom: 16,
  },
  shopSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  shopButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  shopButtonContent: {
    flex: 1,
  },
  shopButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  verifiedBadge: {
    fontSize: 12,
    color: '#10b981',
  },
  relatedStones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  relatedPill: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  relatedText: {
    fontSize: 14,
    color: '#d1d5db',
    textTransform: 'capitalize',
  },
});
