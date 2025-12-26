import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CalculationTypeSelector } from '../components/calculator/CalculationTypeSelector';
import { CalculatorInput } from '../components/calculator/CalculatorInput';
import { EnhancedResultsDisplay } from '../components/calculator/EnhancedResultsDisplay';
import { CalculatorColors } from '../constants/CalculatorColors';
import { EnhancedCalculatorEngine } from '../services/EnhancedCalculatorEngine';
import { CalculationType, EnhancedCalculationResult } from '../types/calculator-enhanced';

export default function CalculatorScreen() {
  const colors = CalculatorColors;

  // Enhanced Calculator State
  const [calculationType, setCalculationType] = useState<CalculationType>('name');
  const [system, setSystem] = useState<'maghribi' | 'mashriqi'>('maghribi');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<EnhancedCalculationResult | null>(null);
  const [activeTab, setActiveTab] = useState<'input' | 'results'>('input');
  const [calculationWarning, setCalculationWarning] = useState<string | null>(null);
  const handleCalculateRef = useRef<() => Promise<void>>(async () => {});
  const lastQuranSelectionRef = useRef<string>('');
  
  // Input fields
  const [arabicInput, setArabicInput] = useState('');
  const [yourName, setYourName] = useState('');
  const [motherName, setMotherName] = useState('');
  const [selectedDivineName, setSelectedDivineName] = useState<number | null>(null);
  const [selectedSurah, setSelectedSurah] = useState<number | null>(null);
  const [selectedAyah, setSelectedAyah] = useState<number | null>(null);
  
  // Phrase options
  const [removeVowels, setRemoveVowels] = useState(false);
  const [ignorePunctuation, setIgnorePunctuation] = useState(true);
  const [ignoreSpaces, setIgnoreSpaces] = useState(false);

  const handleCalculate = async () => {
    if (isLoading) {
      return;
    }

    setCalculationWarning(null);
    setIsLoading(true);
    try {
      let result: EnhancedCalculationResult;

      switch (calculationType) {
        case 'name':
          if (!arabicInput.trim()) return;
          result = await EnhancedCalculatorEngine.calculate({
            type: 'name',
            arabicInput: arabicInput.trim(),
            system
          });
          break;

        case 'lineage':
          if (!yourName.trim() || !motherName.trim()) return;
          result = await EnhancedCalculatorEngine.calculate({
            type: 'lineage',
            yourName: yourName.trim(),
            motherName: motherName.trim(),
            system
          });
          break;

        case 'phrase':
          if (!arabicInput.trim()) return;
          result = await EnhancedCalculatorEngine.calculate({
            type: 'phrase',
            arabicInput: arabicInput.trim(),
            system,
            removeVowels,
            ignorePunctuation,
            ignoreSpaces,
          });
          break;

        case 'quran':
          if (selectedSurah && selectedAyah) {
            result = await EnhancedCalculatorEngine.calculate({
              type: 'quran',
              surahNumber: selectedSurah,
              ayahNumber: selectedAyah,
              system
            });
          } else if (arabicInput.trim()) {
            result = await EnhancedCalculatorEngine.calculate({
              type: 'quran',
              pastedAyahText: arabicInput.trim(),
              system
            });
          } else {
            return;
          }
          break;

        case 'dhikr':
          if (!selectedDivineName) return;
          result = await EnhancedCalculatorEngine.calculate({
            type: 'dhikr',
            divineNameId: selectedDivineName.toString(),
            system
          });
          break;

        case 'general':
          if (!arabicInput.trim()) return;
          result = await EnhancedCalculatorEngine.calculate({
            type: 'general',
            arabicInput: arabicInput.trim(),
            system,
            ignoreSpaces,
          });
          break;

        default:
          return;
      }

      setCurrentResult(result);
      setActiveTab('results');
      if (calculationType === 'quran' && selectedSurah && selectedAyah) {
        lastQuranSelectionRef.current = `${selectedSurah}:${selectedAyah}:${system}`;
      }
    } catch (error) {
      console.error('Calculation error:', error);
      setCurrentResult(null);
      setActiveTab('results');

      if (error instanceof Error && error.message === 'EMPTY_SOURCE_TEXT') {
        setCalculationWarning('No text to calculate. Please select a verse or provide Arabic text.');
        return;
      }

      setCalculationWarning('Something went wrong while calculating. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  handleCalculateRef.current = handleCalculate;

  useEffect(() => {
    if (calculationType !== 'quran') {
      return;
    }
    if (!selectedSurah || !selectedAyah) {
      return;
    }
    if (isLoading) {
      return;
    }

    const selectionKey = `${selectedSurah}:${selectedAyah}:${system}`;
    if (lastQuranSelectionRef.current === selectionKey) {
      return;
    }

    lastQuranSelectionRef.current = selectionKey;

    handleCalculateRef.current();
  }, [calculationType, selectedSurah, selectedAyah, system, isLoading]);

  useEffect(() => {
    setCalculationWarning(null);
  }, [calculationType]);

  return (
    <>
      <Stack.Screen options={{ title: 'ʿIlm al-Asrār Calculator', headerShown: true }} />
      <KeyboardAvoidingView 
        style={[styles.container, { backgroundColor: colors.background }]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        {/* Tab Bar */}
        <LinearGradient
          colors={['#1e293b', '#334155']}
          style={styles.tabBar}
        >
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'input' && styles.tabActive]} 
            onPress={() => setActiveTab('input')}
          >
            {activeTab === 'input' && (
              <LinearGradient
                colors={['#6366f1', '#8b5cf6']}
                style={styles.tabGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            )}
            <Text style={[styles.tabText, { color: activeTab === 'input' ? '#fff' : '#94a3b8' }]}>✍️ Input</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'results' && styles.tabActive]} 
            onPress={() => setActiveTab('results')} 
            disabled={!currentResult}
          >
            {activeTab === 'results' && (
              <LinearGradient
                colors={['#6366f1', '#8b5cf6']}
                style={styles.tabGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            )}
            <Text style={[styles.tabText, { color: activeTab === 'results' ? '#fff' : '#94a3b8', opacity: currentResult ? 1 : 0.4 }]}>✨ Results</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Content */}
        {activeTab === 'input' && (
          <ScrollView 
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Calculation Type Selector */}
            <CalculationTypeSelector
              selectedType={calculationType}
              onTypeChange={setCalculationType}
            />

            {/* Enhanced Calculator Input */}
            <CalculatorInput
                calculationType={calculationType}
                system={system}
                onSystemChange={setSystem}
                arabicInput={arabicInput}
                onArabicInputChange={setArabicInput}
                yourName={yourName}
                onYourNameChange={setYourName}
                motherName={motherName}
                onMotherNameChange={setMotherName}
                selectedDivineName={selectedDivineName}
                onDivineNameChange={setSelectedDivineName}
                selectedSurah={selectedSurah}
                onSurahChange={setSelectedSurah}
                selectedAyah={selectedAyah}
                onAyahChange={setSelectedAyah}
                removeVowels={removeVowels}
                onRemoveVowelsChange={setRemoveVowels}
                ignorePunctuation={ignorePunctuation}
                onIgnorePunctuationChange={setIgnorePunctuation}
                ignoreSpaces={ignoreSpaces}
                onIgnoreSpacesChange={setIgnoreSpaces}
                onCalculate={handleCalculate}
                isLoading={isLoading}
              />
          </ScrollView>
        )}

        {activeTab === 'results' && (
          currentResult ? (
            <EnhancedResultsDisplay result={currentResult} />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>
                {calculationWarning ? 'No Text to Calculate' : 'Awaiting Calculation'}
              </Text>
              <Text style={styles.emptyStateMessage}>
                {calculationWarning ?? 'Calculate from the Input tab to view your results.'}
              </Text>
            </View>
          )
        )}
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  tabBar: { 
    flexDirection: 'row',
    paddingTop: 8,
    paddingBottom: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#475569'
  },
  tab: { 
    flex: 1, 
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: 'center',
    marginHorizontal: 4,
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden'
  },
  tabActive: {
    elevation: 4,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tabGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    borderRadius: 12,
  },
  tabText: { 
    fontSize: 13, 
    fontWeight: '700',
    zIndex: 1
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  emptyState: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f8fafc',
  },
  emptyStateMessage: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    lineHeight: 20,
  },
});
