import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface SacredResonanceProps {
  kabir: number;
  saghir: number;
}

export const SacredResonance: React.FC<SacredResonanceProps> = ({ kabir, saghir }) => {
  // Sacred numbers in Islamic tradition
  const sacredNumbers = {
    7: { name: 'Seven', significance: 'Seven heavens, seven days of creation' },
    12: { name: 'Twelve', significance: 'Twelve Imams, twelve months' },
    19: { name: 'Nineteen', significance: 'Numerical miracle of the Quran (Bismillāh)' },
    99: { name: 'Ninety-Nine', significance: "Asmā' al-Ḥusnā (The Beautiful Names)" },
    114: { name: 'One Hundred Fourteen', significance: 'Surahs in the Quran' },
  };
  
  // Divisibility checks
  const divisibleBy7 = kabir % 7 === 0;
  const divisibleBy19 = kabir % 19 === 0;
  const divisibleBy99 = kabir % 99 === 0;
  
  // Find nearest sacred number
  const sacredValues = Object.keys(sacredNumbers).map(Number);
  const nearest = sacredValues.reduce((prev, curr) => 
    Math.abs(curr - kabir) < Math.abs(prev - kabir) ? curr : prev
  );
  const isExact = kabir === nearest;
  
  // Essence pattern detection
  const getEssencePattern = (): { name: string; description: string } | null => {
    // Same digits pattern (e.g., 111, 222, 333)
    const kabString = kabir.toString();
    if (/^(\d)\1+$/.test(kabString) && kabString.length >= 2) {
      return {
        name: 'Unified Resonance',
        description: `All digits are ${kabString[0]} - represents singular focus and unity`,
      };
    }
    
    // Palindrome (e.g., 121, 313, 12321)
    if (kabString === kabString.split('').reverse().join('')) {
      return {
        name: 'Mirror Symmetry',
        description: 'Palindrome number - represents balance and reflection',
      };
    }
    
    // Ascending sequence (e.g., 123, 1234)
    if (/^123|234|345|456|567|678|789/.test(kabString)) {
      return {
        name: 'Ascending Path',
        description: 'Sequential growth - represents spiritual progression',
      };
    }
    
    // Perfect square
    const sqrt = Math.sqrt(kabir);
    if (Number.isInteger(sqrt)) {
      return {
        name: 'Perfect Square',
        description: `${sqrt} × ${sqrt} - represents completeness and stability`,
      };
    }
    
    return null;
  };
  
  const essencePattern = getEssencePattern();
  const hasDivisibility = divisibleBy7 || divisibleBy19 || divisibleBy99;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✨ Sacred Number Resonance</Text>
      
      {/* Divisibility Patterns */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Divisibility Patterns</Text>
        <View style={styles.patternsGrid}>
          <View style={[styles.patternCard, divisibleBy7 && styles.patternActive]}>
            <Text style={styles.patternEmoji}>7️⃣</Text>
            <Text style={styles.patternLabel}>Divisible by 7</Text>
            <Text style={[styles.patternValue, divisibleBy7 && styles.patternValueActive]}>
              {divisibleBy7 ? `Yes (${kabir / 7})` : 'No'}
            </Text>
            {divisibleBy7 && (
              <Text style={styles.patternSignificance}>Seven heavens</Text>
            )}
          </View>
          
          <View style={[styles.patternCard, divisibleBy19 && styles.patternActive]}>
            <Text style={styles.patternEmoji}>🔢</Text>
            <Text style={styles.patternLabel}>Divisible by 19</Text>
            <Text style={[styles.patternValue, divisibleBy19 && styles.patternValueActive]}>
              {divisibleBy19 ? `Yes (${kabir / 19})` : 'No'}
            </Text>
            {divisibleBy19 && (
              <Text style={styles.patternSignificance}>Quranic miracle</Text>
            )}
          </View>
          
          <View style={[styles.patternCard, divisibleBy99 && styles.patternActive]}>
            <Text style={styles.patternEmoji}>📿</Text>
            <Text style={styles.patternLabel}>Divisible by 99</Text>
            <Text style={[styles.patternValue, divisibleBy99 && styles.patternValueActive]}>
              {divisibleBy99 ? `Yes (${kabir / 99})` : 'No'}
            </Text>
            {divisibleBy99 && (
              <Text style={styles.patternSignificance}>Beautiful Names</Text>
            )}
          </View>
        </View>
      </View>
      
      {/* Nearest Sacred Number */}
      <View style={styles.nearestCard}>
        <Text style={styles.nearestLabel}>
          {isExact ? '🎯 Exact Sacred Number' : '📍 Nearest Sacred Number'}
        </Text>
        <Text style={styles.nearestValue}>{nearest}</Text>
        <Text style={styles.nearestName}>{sacredNumbers[nearest as keyof typeof sacredNumbers]?.name}</Text>
        <Text style={styles.nearestSignificance}>
          {sacredNumbers[nearest as keyof typeof sacredNumbers]?.significance}
        </Text>
        {!isExact && (
          <Text style={styles.nearestDelta}>
            Distance: {Math.abs(kabir - nearest)} {kabir > nearest ? 'above' : 'below'}
          </Text>
        )}
      </View>
      
      {/* Essence Pattern */}
      {essencePattern && (
        <View style={styles.essenceCard}>
          <Text style={styles.essenceTitle}>🌟 {essencePattern.name}</Text>
          <Text style={styles.essenceDescription}>{essencePattern.description}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e293b',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 16,
  },
  
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  
  // Sections
  section: {
    gap: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  
  // Patterns Grid
  patternsGrid: {
    gap: 10,
  },
  patternCard: {
    backgroundColor: '#0f172a',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    alignItems: 'center',
  },
  patternActive: {
    borderColor: '#10b981',
    borderWidth: 2,
    backgroundColor: '#064e3b',
  },
  patternEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  patternLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
    marginBottom: 4,
  },
  patternValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#64748b',
  },
  patternValueActive: {
    fontSize: 16,
    color: '#10b981',
  },
  patternSignificance: {
    fontSize: 11,
    color: '#6ee7b7',
    fontStyle: 'italic',
    marginTop: 4,
  },
  
  // Nearest Card
  nearestCard: {
    backgroundColor: '#312e81',
    padding: 18,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#6366f1',
    alignItems: 'center',
  },
  nearestLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#c7d2fe',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nearestValue: {
    fontSize: 42,
    fontWeight: '900',
    color: '#a5b4fc',
    marginBottom: 4,
  },
  nearestName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#e0e7ff',
    marginBottom: 8,
  },
  nearestSignificance: {
    fontSize: 13,
    color: '#c7d2fe',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  nearestDelta: {
    fontSize: 11,
    color: '#a5b4fc',
    marginTop: 8,
  },
  
  // Essence Card
  essenceCard: {
    backgroundColor: '#c084fc',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#a855f7',
  },
  essenceTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#3b0764',
    marginBottom: 6,
  },
  essenceDescription: {
    fontSize: 13,
    color: '#581c87',
    lineHeight: 18,
  },
});
