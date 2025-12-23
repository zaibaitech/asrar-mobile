import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CalculatorInput } from '../components/calculator/CalculatorInput';
import { HistoryPanel } from '../components/calculator/HistoryPanel';
import { ResultsDisplay } from '../components/calculator/ResultsDisplay';
import { CalculatorColors } from '../constants/CalculatorColors';
import { CalculatorService } from '../services/CalculatorService';
import { CalculationResult, HistoryItem } from '../types/calculator';

export default function CalculatorScreen() {
  const colors = CalculatorColors;

  const [latinInput, setLatinInput] = useState('');
  const [arabicInput, setArabicInput] = useState('');
  const [system, setSystem] = useState<'maghribi' | 'mashriqi'>('maghribi');
  const [isLoading, setIsLoading] = useState(false);
  const [currentResult, setCurrentResult] = useState<CalculationResult | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'input' | 'results' | 'history'>('input');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    const hist = await CalculatorService.getHistory();
    setHistory(hist);
  };

  const handleCalculate = async () => {
    const input = arabicInput || latinInput;
    if (!input.trim()) return;

    setIsLoading(true);
    try {
      const result = await CalculatorService.calculate(input, system);
      setCurrentResult(result);
      await CalculatorService.saveToHistory(result);
      await loadHistory();
      setActiveTab('results');
    } catch (error) {
      console.error('Calculation error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setCurrentResult(item.result);
    setArabicInput(item.result.isArabic ? item.result.input : '');
    setLatinInput(!item.result.isArabic ? item.result.input : '');
    setSystem(item.result.system);
    setActiveTab('results');
  };

  const handleDeleteHistory = async (id: string) => {
    await CalculatorService.deleteHistoryItem(id);
    await loadHistory();
  };

  const handleClearHistory = async () => {
    await CalculatorService.clearHistory();
    await loadHistory();
  };

  return (
    <>
      <Stack.Screen options={{ title: 'Abjad Calculator', headerShown: true }} />
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
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'history' && styles.tabActive]} 
            onPress={() => setActiveTab('history')}
          >
            {activeTab === 'history' && (
              <LinearGradient
                colors={['#6366f1', '#8b5cf6']}
                style={styles.tabGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            )}
            <Text style={[styles.tabText, { color: activeTab === 'history' ? '#fff' : '#94a3b8' }]}>📜 History</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Content */}
        <View style={styles.content}>
          {activeTab === 'input' && (
            <ScrollView>
              <CalculatorInput
                latinInput={latinInput}
                arabicInput={arabicInput}
                onLatinChange={setLatinInput}
                onArabicChange={setArabicInput}
                onCalculate={handleCalculate}
                isLoading={isLoading}
                system={system}
                onSystemChange={setSystem}
              />
            </ScrollView>
          )}

          {activeTab === 'results' && currentResult && (
            <ResultsDisplay result={currentResult} />
          )}

          {activeTab === 'history' && (
            <HistoryPanel
              history={history}
              onSelectItem={handleSelectHistory}
              onDeleteItem={handleDeleteHistory}
              onClearAll={handleClearHistory}
            />
          )}
        </View>
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
  content: { flex: 1 }
});
