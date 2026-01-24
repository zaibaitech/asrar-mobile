/**
 * Enhanced Zodiac Stones Card Component
 * Displays beneficial stones and crystals based on zodiac sign (burj)
 * with rich information, personality traits, and interactive features
 * Used in Name Destiny Results Screen
 */

import { EnhancedZodiacHeader } from '@/components/common/EnhancedZodiacHeader';
import { RichStoneCard } from '@/components/common/RichStoneCard';
import { ShoppingResources } from '@/components/common/ShoppingResources';
import { StoneDetailModal } from '@/components/common/StoneDetailModal';
import { getElementColors } from '@/constants/ElementColors';
import {
    createPlaceholderStoneData,
    getEnhancedStoneData,
    type EnhancedStoneData
} from '@/constants/enhancedStoneData';
import {
    getElementEmoji,
    getElementGradient,
    getPlanetEmoji,
    ZODIAC_COMPLETE_DATA,
    type ZodiacData
} from '@/constants/zodiacStones';
import { useLanguage } from '@/contexts/LanguageContext';
import { Gem } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

const { width } = Dimensions.get('window');

interface ZodiacStonesCardProps {
  burjIndex: number; // 1-12 (0 is treated as 12)
  // Name Destiny uses ElementType values like 'Fire' | 'Air' | 'Water' | 'Earth'
  // while zodiac theming expects lowercase keys.
  elementType?: 'Fire' | 'Air' | 'Water' | 'Earth' | 'fire' | 'earth' | 'air' | 'water';
}

type ZodiacElementKey = 'fire' | 'earth' | 'air' | 'water';

function normalizeElementKey(value?: string): ZodiacElementKey | undefined {
  const normalized = value?.toLowerCase();
  if (normalized === 'fire') return 'fire';
  if (normalized === 'earth') return 'earth';
  if (normalized === 'air') return 'air';
  if (normalized === 'water') return 'water';
  return undefined;
}

export function ZodiacStonesCard({ burjIndex, elementType }: ZodiacStonesCardProps) {
  const { language } = useLanguage();
  const [selectedStone, setSelectedStone] = useState<EnhancedStoneData | null>(null);
  const [showModal, setShowModal] = useState(false);

  const safeIndex = Number.isFinite(burjIndex)
    ? (burjIndex === 0 ? 12 : burjIndex)
    : NaN;

  // Get zodiac data from burj index
  const zodiacData: ZodiacData | undefined = Number.isFinite(safeIndex)
    ? ZODIAC_COMPLETE_DATA[safeIndex]
    : undefined;

  if (!zodiacData) {
    return null;
  }

  const element = normalizeElementKey(String(elementType)) ?? zodiacData.element;
  const colors = getElementColors(element);
  const gradient = getElementGradient(element);

  // Ensure every stone has an EnhancedStoneData object (real data or safe placeholder)
  const stones: EnhancedStoneData[] = zodiacData.stones.map(stone => {
    return (
      getEnhancedStoneData(stone.name) ||
      createPlaceholderStoneData({ name: stone.name, nameAr: stone.nameAr, nameFr: stone.nameFr })
    );
  });

  const handleStonePress = (stone: EnhancedStoneData) => {
    setSelectedStone(stone);
    setShowModal(true);
  };

  return (
    <View style={styles.container}>
      {/* Enhanced Zodiac Header with Personality */}
      <EnhancedZodiacHeader
        zodiacData={zodiacData}
        gradient={gradient}
        elementEmoji={getElementEmoji(element)}
        planetEmoji={getPlanetEmoji(zodiacData.planet)}
      />

      {/* Rich Stones Section */}
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
      </View>

      {/* Shopping & Educational Resources */}
      <ShoppingResources element={element} />
      
      {/* Stone Detail Modal */}
      {selectedStone && (
        <StoneDetailModal
          visible={showModal}
          onClose={() => setShowModal(false)}
          stone={selectedStone}
          zodiacSign={zodiacData.zodiacSign}
          element={element}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 0,
  },

  // Stones Section
  stonesSection: {
    marginBottom: 12,
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
    marginHorizontal: -4,
  },
  stonesScrollContent: {
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
});
