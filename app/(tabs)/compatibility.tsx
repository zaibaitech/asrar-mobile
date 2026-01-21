/**
 * Compatibility Tab Screen
 * Calculator-style interface for all compatibility types
 * Integrated with tab navigation
 */

import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { CompatibilityResultView } from '../../components/compatibility/CompatibilityResultViewEnhanced';
import { CompatibilityTypeSelector } from '../../components/compatibility/CompatibilityTypeSelector';
import { DivineIntentionForm } from '../../components/compatibility/DivineIntentionForm';
import { PersonDivineNameForm } from '../../components/compatibility/PersonDivineNameForm';
import { PersonPersonForm } from '../../components/compatibility/PersonPersonForm';
import { DarkTheme } from '../../constants/DarkTheme';
import { useLanguage } from '../../contexts/LanguageContext';
import type { UniversalCompatibilityResult } from '../../services/compatibility/types';
import { CompatibilityType } from '../../services/compatibility/types';

export default function CompatibilityTabScreen() {
  const { language, t } = useLanguage();
  const [selectedType, setSelectedType] = useState<CompatibilityType>('person-person');
  const [result, setResult] = useState<UniversalCompatibilityResult | null>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'results'>('input');
  const router = useRouter();

  const handleCalculate = (calculationResult: UniversalCompatibilityResult) => {
    setResult(calculationResult);
    setActiveTab('results');
  };

  const handleReset = () => {
    setResult(null);
    setActiveTab('input');
  };

  return (
    <View style={styles.container}>
      {/* Tab Navigation */}
      <LinearGradient
        colors={['#1e293b', '#334155']}
        style={styles.tabBar}
      >
        <TouchableOpacity
          style={[styles.tab, activeTab === 'input' && styles.tabActive]}
          onPress={() => setActiveTab('input')}
        >
          <Text style={[styles.tabText, activeTab === 'input' && styles.tabTextActive]}>
            {t('compatibility.tabs.calculate')}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, activeTab === 'results' && styles.tabActive]}
          onPress={() => result && setActiveTab('results')}
          disabled={!result}
        >
          <Text style={[
            styles.tabText,
            activeTab === 'results' && styles.tabTextActive,
            !result && styles.tabTextDisabled
          ]}>
            {t('compatibility.tabs.results')}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeTab === 'input' ? (
          <>
            {/* Compatibility Type Selector */}
            <CompatibilityTypeSelector
              selectedType={selectedType}
              onSelectType={setSelectedType}
              language={language}
            />

            {/* Dynamic Form based on selected type */}
            {selectedType === 'person-person' && (
              <PersonPersonForm
                language={language}
                onCalculate={handleCalculate}
              />
            )}

            {selectedType === 'person-divine-name' && (
              <PersonDivineNameForm
                onCalculate={handleCalculate}
              />
            )}

            {selectedType === 'divine-intention' && (
              <DivineIntentionForm
                onCalculate={handleCalculate}
              />
            )}

            {/* Authentic Disclaimer */}
            <View style={styles.disclaimerCard}>
              <Text style={styles.disclaimerTitle}>
                {t('compatibility.form.reflectionOnly')}
              </Text>
              <Text style={styles.disclaimerText}>
                {t('compatibility.form.disclaimer')}
              </Text>
            </View>
          </>
        ) : (
          result && (
            <>
              <CompatibilityResultView
                result={result}
                language={language}
              />
              
              <TouchableOpacity
                style={styles.resetButton}
                onPress={handleReset}
              >
                <Text style={styles.resetButtonText}>
                  {t('compatibility.form.newCalculation')}
                </Text>
              </TouchableOpacity>
            </>
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
  tabBar: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  tabActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.2)',
  },
  tabText: {
    color: '#94a3b8',
    fontSize: 16,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#a78bfa',
  },
  tabTextDisabled: {
    opacity: 0.4,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  disclaimerCard: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(251, 191, 36, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginTop: 24,
    marginBottom: 20,
  },
  disclaimerTitle: {
    color: '#fbbf24',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  disclaimerText: {
    color: '#cbd5e1',
    fontSize: 14,
    lineHeight: 20,
  },
  resetButton: {
    backgroundColor: '#8b5cf6',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});
