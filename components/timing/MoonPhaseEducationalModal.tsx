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

  const suitableCategory = moonPhase.suitable?.categoryKey
    ? t(moonPhase.suitable.categoryKey)
    : moonPhase.suitable?.category;

  const suitableActivities = moonPhase.suitable?.activitiesKeys?.length
    ? moonPhase.suitable.activitiesKeys.map((key) => t(key))
    : moonPhase.suitable?.activities;

  const spiritualPractices = moonPhase.suitable?.spiritualPracticesKeys?.length
    ? moonPhase.suitable.spiritualPracticesKeys.map((key) => t(key))
    : moonPhase.suitable?.spiritualPractices;

  const notSuitableCategory = moonPhase.notSuitable?.categoryKey
    ? t(moonPhase.notSuitable.categoryKey)
    : moonPhase.notSuitable?.category;

  const notSuitableActivities = moonPhase.notSuitable?.activitiesKeys?.length
    ? moonPhase.notSuitable.activitiesKeys.map((key) => t(key))
    : moonPhase.notSuitable?.activities;

  const notSuitableReason = moonPhase.notSuitable?.reasonKey
    ? t(moonPhase.notSuitable.reasonKey)
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
              {t(`moon.${moonPhase.phaseName}.title`)}
            </Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.scrollContent}>
            {/* What It Is */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>
                {moonPhase.moonEmoji} {t('moon.ui.whyThisMatters')}
              </Text>
              <Text style={styles.sectionText}>
                {t(`moon.${moonPhase.phaseName}.description`)}
              </Text>
            </View>
            
            {/* Best For */}
            {moonPhase.suitable && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>
                  ✅ {t('moon.ui.suitableFor')}
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
                  🕌 {t('moon.ui.spiritualGuidance')}
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
                  ❌ {t('moon.ui.notSuitableFor')}
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
