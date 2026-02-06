import { useLanguage } from '@/contexts/LanguageContext';
import type { MoonPhaseAnalysis } from '@/services/MoonPhaseService';
import React from 'react';
import {
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface MoonPhaseEducationalModalProps {
  visible: boolean;
  moonPhase: MoonPhaseAnalysis;
  onClose: () => void;
}

export default function MoonPhaseEducationalModal({
  visible,
  moonPhase,
  onClose,
}: MoonPhaseEducationalModalProps) {
  const { t } = useLanguage();

  const tSafe = (key: string, fallback: string, params?: Record<string, string | number>) => {
    const value = params ? t(key, params) : t(key);
    const last = key.split('.').pop();
    const valueLower = typeof value === 'string' ? value.toLowerCase() : '';
    const lastLower = last ? last.toLowerCase() : '';
    if (!value || value === key || (last && (value === last || valueLower === lastLower))) {
      return fallback;
    }
    return value;
  };

  const suitableCategory = moonPhase.suitable?.categoryKey
    ? tSafe(moonPhase.suitable.categoryKey, moonPhase.suitable?.category ?? '')
    : moonPhase.suitable?.category;

  const suitableActivities = moonPhase.suitable?.activitiesKeys?.length
    ? moonPhase.suitable.activitiesKeys.map((key, index) =>
        tSafe(key, moonPhase.suitable?.activities?.[index] ?? '')
      )
    : moonPhase.suitable?.activities;

  const spiritualPractices = moonPhase.suitable?.spiritualPracticesKeys?.length
    ? moonPhase.suitable.spiritualPracticesKeys.map((key, index) =>
        tSafe(key, moonPhase.suitable?.spiritualPractices?.[index] ?? '')
      )
    : moonPhase.suitable?.spiritualPractices;

  const notSuitableCategory = moonPhase.notSuitable?.categoryKey
    ? tSafe(moonPhase.notSuitable.categoryKey, moonPhase.notSuitable?.category ?? '')
    : moonPhase.notSuitable?.category;

  const notSuitableActivities = moonPhase.notSuitable?.activitiesKeys?.length
    ? moonPhase.notSuitable.activitiesKeys.map((key, index) =>
        tSafe(key, moonPhase.notSuitable?.activities?.[index] ?? '')
      )
    : moonPhase.notSuitable?.activities;

  const notSuitableReason = moonPhase.notSuitable?.reasonKey
    ? tSafe(moonPhase.notSuitable.reasonKey, moonPhase.notSuitable?.reason ?? '')
    : moonPhase.notSuitable?.reason;
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {tSafe(
                `moon.${moonPhase.phaseName}.title`,
                moonPhase.primaryGuidance?.title ?? moonPhase.phaseName
              )}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.scrollContent}>
            {/* What It Is */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {moonPhase.moonEmoji} {tSafe('moon.ui.whyThisMatters', 'Why This Matters')}
              </Text>
              <Text style={styles.sectionText}>
                {tSafe(
                  `moon.${moonPhase.phaseName}.description`,
                  moonPhase.primaryGuidance?.description ?? ''
                )}
              </Text>
            </View>
            
            {/* Best For */}
            {moonPhase.suitable && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  ✅ {tSafe('moon.ui.suitableFor', 'Best For')}
                </Text>
                {!!suitableCategory && (
                  <Text style={styles.categoryText}>{suitableCategory}</Text>
                )}
                {suitableActivities?.map((activity, index) => (
                  <Text key={`activity-${index}`} style={styles.bulletItem}>
                    • {activity}
                  </Text>
                ))}
              </View>
            )}
            
            {/* Spiritual Practices */}
            {moonPhase.suitable && moonPhase.suitable.spiritualPractices && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  🕌 {tSafe('moon.ui.spiritualGuidance', 'Spiritual Guidance')}
                </Text>
                {spiritualPractices?.map((practice, index) => (
                  <Text key={`practice-${index}`} style={styles.bulletItem}>
                    • {practice}
                  </Text>
                ))}
              </View>
            )}
            
            {/* Not Suitable For */}
            {moonPhase.notSuitable && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  ❌ {tSafe('moon.ui.notSuitableFor', 'Avoid')}
                </Text>
                {!!notSuitableCategory && (
                  <Text style={styles.categoryText}>{notSuitableCategory}</Text>
                )}
                {notSuitableActivities?.map((activity, index) => (
                  <Text key={`not-${index}`} style={styles.bulletItem}>
                    • {activity}
                  </Text>
                ))}
                <View style={styles.reasonBox}>
                  <Text style={styles.reasonText}>
                    {notSuitableReason}
                  </Text>
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  
  modalContent: {
    backgroundColor: '#1E1E3C',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingTop: 20,
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
  },
  
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
  
  scrollContent: {
    padding: 20,
  },
  
  section: {
    marginBottom: 24,
  },
  
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  
  sectionText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 20,
  },
  
  categoryText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  
  bulletItem: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    lineHeight: 22,
    paddingLeft: 8,
  },
  
  reasonBox: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
  },
  
  reasonText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontStyle: 'italic',
  },
});
