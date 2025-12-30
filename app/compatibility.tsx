import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ResponsiveAppHeader from '../components/AppHeader';
import BottomTabBar from '../components/BottomTabBar';
import { RelationshipCompatibilityView, RelationshipInputForm } from '../components/compatibility';
import { DarkTheme } from '../constants/DarkTheme';
import { ABJAD_MAGHRIBI, ABJAD_MASHRIQI } from '../constants/abjad-maps';
import { RelationshipCompatibility } from '../types/compatibility';
import { calculateAbjadTotal } from '../utils/abjad-calculations';
import { analyzeRelationshipCompatibility, getElementFromAbjadTotal } from '../utils/relationshipCompatibility';

export default function CompatibilityScreen() {
  const [result, setResult] = useState<RelationshipCompatibility | null>(null);
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  const [system, setSystem] = useState<'maghribi' | 'mashriqi'>('maghribi');
  const [activeTab, setActiveTab] = useState<'input' | 'results'>('input');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const handleCalculate = async (
    person1Name: string,
    person1Arabic: string,
    person2Name: string,
    person2Arabic: string
  ) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      // Select the appropriate Abjad system
      const abjadMap = system === 'mashriqi' ? ABJAD_MASHRIQI : ABJAD_MAGHRIBI;
      
      // Calculate Abjad totals
      const person1Total = calculateAbjadTotal(person1Arabic, abjadMap);
      const person2Total = calculateAbjadTotal(person2Arabic, abjadMap);
      
      // Get elements from totals
      const person1Element = getElementFromAbjadTotal(person1Total);
      const person2Element = getElementFromAbjadTotal(person2Total);
      
      // Perform analysis
      const analysis = analyzeRelationshipCompatibility(
        person1Name,
        person1Arabic,
        person1Total,
        person1Element,
        person2Name,
        person2Arabic,
        person2Total,
        person2Element
      );
      
      setResult(analysis);
      setActiveTab('results');
    } catch (error) {
      console.error('Error calculating compatibility:', error);
      setErrorMessage('Failed to calculate compatibility. Please check your inputs and try again.');
      setResult(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    setResult(null);
    setErrorMessage(null);
    setActiveTab('input');
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      <SafeAreaView style={styles.outerContainer}>
        <ResponsiveAppHeader
          currentLanguage={language === 'en' ? 'EN' : 'FR'}
          onLanguageChange={(lang) => setLanguage(lang.toLowerCase() as 'en' | 'fr')}
          onProfilePress={() => router.push('/profile')}
          onMenuPress={() => console.log('Menu pressed')}
        />
        
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
                colors={['#ec4899', '#f43f5e']}
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
            disabled={!result}
          >
            {activeTab === 'results' && (
              <LinearGradient
                colors={['#ec4899', '#f43f5e']}
                style={styles.tabGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            )}
            <Text style={[styles.tabText, { color: activeTab === 'results' ? '#fff' : '#94a3b8', opacity: result ? 1 : 0.4 }]}>💞 Results</Text>
          </TouchableOpacity>
        </LinearGradient>

        {/* Content */}
        {activeTab === 'input' ? (
          <ScrollView 
            ref={scrollViewRef}
            style={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <RelationshipInputForm
              onCalculate={handleCalculate}
              language={language}
              system={system}
              onSystemChange={setSystem}
              isLoading={isLoading}
              errorMessage={errorMessage}
            />
          </ScrollView>
        ) : result ? (
          <ScrollView 
            style={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <RelationshipCompatibilityView
              analysis={result}
              language={language}
              onReset={handleReset}
            />
          </ScrollView>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>
              {errorMessage ? 'Calculation Error' : 'Awaiting Analysis'}
            </Text>
            <Text style={styles.emptyStateMessage}>
              {errorMessage || 'Calculate from the Input tab to view compatibility results.'}
            </Text>
          </View>
        )}
        
        <BottomTabBar />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
  container: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
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
    shadowColor: '#ec4899',
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
