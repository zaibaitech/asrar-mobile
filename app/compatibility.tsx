import { Stack, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import ResponsiveAppHeader from '../components/AppHeader';
import BottomTabBar from '../components/BottomTabBar';
import { RelationshipCompatibilityView, RelationshipInputForm } from '../components/compatibility';
import { DarkTheme } from '../constants/DarkTheme';
import { ABJAD_MAGHRIBI } from '../constants/abjad-maps';
import { RelationshipCompatibility } from '../types/compatibility';
import { calculateAbjadTotal } from '../utils/abjad-calculations';
import { analyzeRelationshipCompatibility, getElementFromAbjadTotal } from '../utils/relationshipCompatibility';

export default function CompatibilityScreen() {
  const [result, setResult] = useState<RelationshipCompatibility | null>(null);
  const [language, setLanguage] = useState<'en' | 'fr'>('en');
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);
  
  const handleCalculate = (
    person1Name: string,
    person1Arabic: string,
    person2Name: string,
    person2Arabic: string
  ) => {
    try {
      // Calculate Abjad totals
      const person1Total = calculateAbjadTotal(person1Arabic, ABJAD_MAGHRIBI);
      const person2Total = calculateAbjadTotal(person2Arabic, ABJAD_MAGHRIBI);
      
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
      
      // Auto-scroll to top to show results
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      }, 100);
    } catch (error) {
      console.error('Error calculating compatibility:', error);
    }
  };
  
  const handleReset = () => {
    setResult(null);
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
          onProfilePress={() => router.push('/modal')}
          onMenuPress={() => console.log('Menu pressed')}
        />
        <ScrollView 
          ref={scrollViewRef}
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {!result ? (
            <RelationshipInputForm
              onCalculate={handleCalculate}
              language={language}
            />
          ) : (
            <RelationshipCompatibilityView
              analysis={result}
              language={language}
              onReset={handleReset}
            />
          )}
        </ScrollView>
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
});
