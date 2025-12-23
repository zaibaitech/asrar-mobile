import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ASMA_LIST } from '../../utils/hadad-core';

interface DhikrRecommendationProps {
  kabir: number;
  saghir: number;
}

export const DhikrRecommendation: React.FC<DhikrRecommendationProps> = ({ kabir, saghir }) => {
  // Find the divine name closest to kabir value
  const closestName = ASMA_LIST.reduce((prev, curr) => 
    Math.abs(curr.abjad - kabir) < Math.abs(prev.abjad - kabir) ? curr : prev
  );
  
  // Calculate recommended count based on value
  // Use the predefined counts from the name, or calculate based on kabir
  const recommendedCounts = closestName.counts;
  const primaryCount = recommendedCounts[0];
  
  // Determine timing based on saghir (1-9)
  const getTimingRecommendation = (): string => {
    if (saghir <= 3) {
      return 'During lunar hours, especially at night';
    } else if (saghir <= 6) {
      return 'After Fajr prayer for spiritual illumination';
    } else {
      return 'During sunset or between Maghrib and Isha';
    }
  };
  
  // Get additional spiritual guidance
  const getSpiritualGuidance = (): string => {
    const elementGuidance: Record<string, string> = {
      Fire: 'Recite with focused intention and spiritual fire. Let each repetition kindle divine light within.',
      Water: 'Recite with flowing ease and emotional depth. Allow divine mercy to wash over your heart.',
      Air: 'Recite with breath awareness. Let each word carry divine wisdom into your consciousness.',
      Earth: 'Recite with patient perseverance. Ground yourself in divine stability with each repetition.',
    };
    return elementGuidance[closestName.element] || elementGuidance.Earth;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerEmoji}>📿</Text>
        <Text style={styles.title}>Dhikr Recommendation</Text>
      </View>
      
      {/* Divine Name Card */}
      <View style={styles.nameCard}>
        <Text style={styles.label}>Divine Name</Text>
        <Text style={styles.nameArabic}>{closestName.ar}</Text>
        <Text style={styles.nameEnglish}>{closestName.en}</Text>
        <Text style={styles.transliteration}>{closestName.transliteration}</Text>
        
        <View style={styles.valueRow}>
          <Text style={styles.valueLabel}>Numerical Value:</Text>
          <Text style={styles.valueText}>{closestName.abjad}</Text>
        </View>
      </View>
      
      {/* Count Recommendation */}
      <View style={styles.countCard}>
        <Text style={styles.countLabel}>📊 Recommended Count</Text>
        <View style={styles.countRow}>
          <Text style={styles.countValue}>{primaryCount}×</Text>
          <Text style={styles.countSubtext}>
            ({primaryCount} repetitions)
          </Text>
        </View>
        
        {/* Alternative Counts */}
        <View style={styles.alternativeCounts}>
          <Text style={styles.alternativeLabel}>Alternative counts:</Text>
          <View style={styles.countsRow}>
            {recommendedCounts.slice(1).map((count, index) => (
              <View key={index} style={styles.alternativeChip}>
                <Text style={styles.alternativeText}>{count}×</Text>
              </View>
            ))}
          </View>
        </View>
      </View>
      
      {/* Timing */}
      <View style={styles.timingCard}>
        <Text style={styles.timingLabel}>⏰ Optimal Timing</Text>
        <Text style={styles.timingText}>{getTimingRecommendation()}</Text>
      </View>
      
      {/* Spiritual Guidance */}
      <View style={styles.guidanceCard}>
        <Text style={styles.guidanceLabel}>✨ How to Practice</Text>
        <Text style={styles.guidanceText}>{getSpiritualGuidance()}</Text>
      </View>
      
      {/* Additional Notes */}
      <View style={styles.notesCard}>
        <Text style={styles.notesTitle}>💡 Additional Guidance</Text>
        <View style={styles.notesList}>
          <Text style={styles.noteItem}>
            • Begin with wuḍū (ablution) for spiritual purity
          </Text>
          <Text style={styles.noteItem}>
            • Face the Qiblah if possible
          </Text>
          <Text style={styles.noteItem}>
            • Use a tasbīḥ (prayer beads) to maintain count
          </Text>
          <Text style={styles.noteItem}>
            • Conclude with ṣalawāt upon the Prophet ﷺ
          </Text>
          <Text style={styles.noteItem}>
            • Maintain presence and focus throughout
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#8b5cf6',
    gap: 14,
  },
  
  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerEmoji: {
    fontSize: 28,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f1f5f9',
  },
  
  // Name Card
  nameCard: {
    backgroundColor: '#0f172a',
    padding: 18,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#a855f7',
    alignItems: 'center',
    gap: 6,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  nameArabic: {
    fontSize: 32,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  nameEnglish: {
    fontSize: 18,
    fontWeight: '700',
    color: '#cbd5e1',
    marginTop: 4,
  },
  transliteration: {
    fontSize: 15,
    color: '#a5b4fc',
    fontStyle: 'italic',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
    backgroundColor: '#334155',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  valueLabel: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '600',
  },
  valueText: {
    fontSize: 16,
    fontWeight: '900',
    color: '#a5b4fc',
  },
  
  // Count Card
  countCard: {
    backgroundColor: '#6366f1',
    padding: 18,
    borderRadius: 14,
    gap: 12,
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  countLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#f3e8ff',
  },
  countRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 10,
  },
  countValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#ffffff',
  },
  countSubtext: {
    fontSize: 13,
    color: '#e9d5ff',
  },
  alternativeCounts: {
    gap: 8,
    marginTop: 4,
  },
  alternativeLabel: {
    fontSize: 12,
    color: '#e9d5ff',
    fontWeight: '600',
  },
  countsRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  alternativeChip: {
    backgroundColor: '#312e81',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#8b5cf6',
  },
  alternativeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f3e8ff',
  },
  
  // Timing Card
  timingCard: {
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#a855f7',
  },
  timingLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 6,
  },
  timingText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 19,
  },
  
  // Guidance Card
  guidanceCard: {
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#a855f7',
  },
  guidanceLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 6,
  },
  guidanceText: {
    fontSize: 13,
    color: '#cbd5e1',
    lineHeight: 18,
    fontStyle: 'italic',
  },
  
  // Notes Card
  notesCard: {
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  notesTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#f1f5f9',
    marginBottom: 10,
  },
  notesList: {
    gap: 6,
  },
  noteItem: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 17,
  },
});
