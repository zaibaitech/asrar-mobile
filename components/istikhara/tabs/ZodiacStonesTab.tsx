import { EnhancedZodiacHeader } from '@/components/common/EnhancedZodiacHeader';
import { RichStoneCard } from '@/components/common/RichStoneCard';
import { ShoppingResources } from '@/components/common/ShoppingResources';
import { StoneDetailModal } from '@/components/common/StoneDetailModal';
import * as Haptics from 'expo-haptics';
import { Gem, Info } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { getElementColors } from '../../../constants/ElementColors';
import {
    createPlaceholderStoneData,
    getEnhancedStoneData,
    type EnhancedStoneData
} from '../../../constants/enhancedStoneData';
import {
    getElementEmoji,
    getElementGradient,
    getPlanetEmoji,
    ZODIAC_COMPLETE_DATA,
    type ZodiacData
} from '../../../constants/zodiacStones';
import { useLanguage } from '../../../contexts/LanguageContext';
import type { IstikharaCalculationResult } from '../../../services/istikhara/types';

interface ZodiacStonesTabProps {
  result: IstikharaCalculationResult;
}

export default function ZodiacStonesTab({ result }: ZodiacStonesTabProps) {
  const { language } = useLanguage();
  const [showUsageGuide, setShowUsageGuide] = useState(false);
  const [selectedStone, setSelectedStone] = useState<EnhancedStoneData | null>(null);
  const [showModal, setShowModal] = useState(false);
  
  // Get zodiac data from remainder
  // Handle remainder 0 as 12 (Pisces)
  const remainder = result.burujRemainder === 0 ? 12 : result.burujRemainder;
  const zodiacData: ZodiacData = ZODIAC_COMPLETE_DATA[remainder];
  
  if (!zodiacData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {language === 'en' ? 'Zodiac data not available' : 
           language === 'fr' ? 'Données zodiacales non disponibles' : 
           'بيانات البرج غير متوفرة'}
        </Text>
      </View>
    );
  }

  const elementKey = zodiacData.element.toLowerCase() as 'fire' | 'earth' | 'air' | 'water';
  const colors = getElementColors(elementKey);
  const gradient = getElementGradient(elementKey);

  // Ensure every stone has enhanced data (real data or safe placeholder)
  const stones: EnhancedStoneData[] = zodiacData.stones.map((stone) => {
    return (
      getEnhancedStoneData(stone.name) ||
      createPlaceholderStoneData({ name: stone.name, nameAr: stone.nameAr, nameFr: stone.nameFr })
    );
  });

  const toggleUsageGuide = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowUsageGuide(!showUsageGuide);
  };

  const handleStonePress = async (stone: EnhancedStoneData) => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore haptics failures
    }

    setSelectedStone(stone);
    setShowModal(true);
  };

  return (
    <ScrollView 
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Enhanced Zodiac Header with Personality */}
      <View style={styles.headerWrapper}>
        <EnhancedZodiacHeader
          zodiacData={zodiacData}
          gradient={gradient}
          elementEmoji={getElementEmoji(elementKey)}
          planetEmoji={getPlanetEmoji(zodiacData.planet)}
        />
      </View>

      {/* Stones Section */}
      <View style={styles.stonesSection}>
        <View style={[styles.sectionHeader, { backgroundColor: `${colors.accent}22` }]}>
          <Gem size={20} color={colors.accent} />
          <Text style={[styles.sectionTitle, { color: colors.accent }]}>
            {language === 'en' ? '💎 Beneficial Stones & Crystals' :
             language === 'fr' ? '💎 Pierres et Cristaux Bénéfiques' :
             '💎 الأحجار والبلورات المفيدة'}
          </Text>
        </View>

        <Text style={styles.stonesDescription}>
          {language === 'en' ? 'These stones resonate with your zodiac energy. Tap any stone to learn more about its properties and how to use it.' :
           language === 'fr' ? 'Ces pierres résonnent avec votre énergie zodiacale. Appuyez sur une pierre pour en savoir plus.' :
           'هذه الأحجار تتناغم مع طاقة برجك. اضغط على أي حجر لمعرفة المزيد.'}
        </Text>

        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.stonesScrollContent}
          style={styles.stonesScroll}
        >
          {stones.map((stone) => (
            <RichStoneCard
              key={stone.id}
              stone={stone}
              zodiacSign={zodiacData.zodiacSign}
              accentColor={colors.accent}
              onPress={() => handleStonePress(stone)}
            />
          ))}
        </ScrollView>

        <View style={styles.stoneCount}>
          <Text style={styles.stoneCountText}>
            {stones.length} {language === 'en' ? 'stones' : 
                                        language === 'fr' ? 'pierres' : 
                                        'حجر'}
          </Text>
        </View>
      </View>

      {/* Shopping & Educational Resources */}
      <ShoppingResources element={elementKey} />

      {/* Usage Guide Section */}
      <TouchableOpacity 
        style={[styles.usageHeader, { backgroundColor: `${colors.accent}22` }]}
        onPress={toggleUsageGuide}
      >
        <View style={styles.usageHeaderLeft}>
          <Info size={20} color={colors.accent} />
          <Text style={[styles.usageTitle, { color: colors.accent }]}>
            {language === 'en' ? 'How to Use These Stones' : 
             language === 'fr' ? 'Comment Utiliser Ces Pierres' : 
             'كيفية استخدام هذه الأحجار'}
          </Text>
        </View>
        <Text style={[styles.usageToggle, { color: colors.accent }]}>
          {showUsageGuide ? '−' : '+'}
        </Text>
      </TouchableOpacity>

      {showUsageGuide && (
        <View style={styles.usageContent}>
          <View style={styles.usageItem}>
            <Text style={styles.usageBullet}>•</Text>
            <Text style={styles.usageText}>
              {language === 'en' ? 'Wear as jewelry (rings, bracelets, necklaces)' : 
               language === 'fr' ? 'Porter comme bijou (bagues, bracelets, colliers)' : 
               'ارتداؤها كمجوهرات (خواتم، أساور، قلادات)'}
            </Text>
          </View>
          
          <View style={styles.usageItem}>
            <Text style={styles.usageBullet}>•</Text>
            <Text style={styles.usageText}>
              {language === 'en' ? 'Hold during meditation or dhikr practice' : 
               language === 'fr' ? 'Tenir pendant la méditation ou la pratique du dhikr' : 
               'إمساكها أثناء التأمل أو ممارسة الذكر'}
            </Text>
          </View>
          
          <View style={styles.usageItem}>
            <Text style={styles.usageBullet}>•</Text>
            <Text style={styles.usageText}>
              {language === 'en' ? 'Carry in your pocket or bag for daily energy' : 
               language === 'fr' ? 'Porter dans la poche ou le sac pour l\'énergie quotidienne' : 
               'حملها في الجيب أو الحقيبة للطاقة اليومية'}
            </Text>
          </View>
          
          <View style={styles.usageItem}>
            <Text style={styles.usageBullet}>•</Text>
            <Text style={styles.usageText}>
              {language === 'en' ? 'Place in your living space or prayer area' : 
               language === 'fr' ? 'Placer dans votre espace de vie ou zone de prière' : 
               'وضعها في مساحة المعيشة أو منطقة الصلاة'}
            </Text>
          </View>
        </View>
      )}

      {/* Bottom Spacing */}
      <View style={styles.bottomSpacer} />

      {/* Stone Detail Modal */}
      {selectedStone && (
        <StoneDetailModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          stone={selectedStone}
          zodiacSign={zodiacData.zodiacSign}
          element={elementKey}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1419',
  },
  scrollContent: {
    paddingBottom: 32,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  errorText: {
    color: '#9ca3af',
    fontSize: 16,
    textAlign: 'center',
  },
  
  headerWrapper: {
    margin: 16,
  },

  // Stones Section
  stonesSection: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
    flex: 1,
  },
  stonesDescription: {
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 16,
    lineHeight: 19,
    paddingHorizontal: 4,
  },
  stonesScroll: {
    marginBottom: 12,
  },
  stonesScrollContent: {
    paddingRight: 16,
    paddingBottom: 8,
  },
  stoneCount: {
    alignItems: 'center',
    marginTop: 8,
  },
  stoneCountText: {
    fontSize: 12,
    color: '#9ca3af',
  },

  // Usage Guide
  usageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
  },
  usageHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  usageTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  usageToggle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  usageContent: {
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: '#1a1f26',
    borderRadius: 12,
    marginBottom: 16,
  },
  usageItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  usageBullet: {
    fontSize: 16,
    color: '#9ca3af',
    marginRight: 12,
    marginTop: 2,
  },
  usageText: {
    flex: 1,
    fontSize: 14,
    color: '#d1d5db',
    lineHeight: 20,
  },

  bottomSpacer: {
    height: 24,
  },
});
