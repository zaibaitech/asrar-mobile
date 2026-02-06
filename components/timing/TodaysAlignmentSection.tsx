import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import type { DailySynthesis } from '@/services/DailySynthesisService';
import { getStatusColor } from '@/services/DailySynthesisService';

interface TodaysAlignmentSectionProps {
  synthesis: DailySynthesis;
}

interface AlignmentFactorProps {
  icon: string;
  label: string;
  status: string;
  statusColor: string;
  detail: string;
}

/**
 * Individual alignment factor display
 */
function AlignmentFactor({ icon, label, status, statusColor, detail }: AlignmentFactorProps) {
  return (
    <View style={styles.factor}>
      <View style={styles.factorHeader}>
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.label}>{label}</Text>
        <View style={[styles.statusBadge, { borderColor: statusColor }]}>
          <Text style={[styles.statusText, { color: statusColor }]}>
            {status}
          </Text>
        </View>
      </View>
      <Text style={styles.detail}>{detail}</Text>
    </View>
  );
}

/**
 * Displays the three alignment factors:
 * 1. Planetary Friendship
 * 2. Elemental Harmony
 * 3. Daily Strength
 */
export default function TodaysAlignmentSection({
  synthesis,
}: TodaysAlignmentSectionProps) {
  const { t } = useLanguage();
  
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>
        {t('dailyEnergy.todaysAlignment')}
      </Text>
      
      {/* Planetary Friendship */}
      <AlignmentFactor
        icon="🤝"
        label={t('dailyEnergy.factors.planetaryFriendship')}
        status={synthesis.factors.planetaryFriendship.label}
        statusColor={getStatusColor(synthesis.factors.planetaryFriendship.score)}
        detail={synthesis.factors.planetaryFriendship.description}
      />
      
      {/* Elemental Harmony */}
      <AlignmentFactor
        icon="🌊"
        label={t('dailyEnergy.factors.elementalHarmony')}
        status={synthesis.factors.elementalHarmony.label}
        statusColor={getStatusColor(synthesis.factors.elementalHarmony.score)}
        detail={synthesis.factors.elementalHarmony.description}
      />
      
      {/* Daily Strength */}
      <AlignmentFactor
        icon="⭐"
        label={t('dailyEnergy.factors.dailyStrength')}
        status={synthesis.factors.dailyStrength.label}
        statusColor={getStatusColor(synthesis.factors.dailyStrength.score)}
        detail={synthesis.factors.dailyStrength.description}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  
  sectionTitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 16,
  },
  
  factor: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  factorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  
  icon: {
    fontSize: 20,
  },
  
  label: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  
  statusBadge: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  
  detail: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 28,
  },
});
