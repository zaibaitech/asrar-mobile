/**
 * Who Am I Results Screen
 * =======================
 * Results display for the "Who Am I" spiritual identity calculator.
 * 
 * FREE: Overview tab (basic numbers, element, zodiac sign)
 * PREMIUM: Personality, Career, Blessed Day, Spiritual Practice tabs (interpretive content)
 */

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import * as Haptics from 'expo-haptics';
import * as Print from 'expo-print';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Dimensions,
    SafeAreaView,
    Share,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import ResponsiveAppHeader from '../../components/AppHeader';
import HistoryModal from '../../components/istikhara/HistoryModal';
import { PremiumSection } from '../../components/subscription/PremiumSection';
import { useLanguage } from '../../contexts/LanguageContext';
import { useSubscription } from '../../contexts/SubscriptionContext';
import { type SavedCalculation } from '../../services/HistoryService';
import { IstikharaData } from '../../types/istikhara';

// Import tab components
import BlessedDayTab from '../../components/istikhara/tabs/BlessedDayTab';
import CareerTabAdvanced from '../../components/istikhara/tabs/CareerTabAdvanced';
import OverviewTab from '../../components/istikhara/tabs/OverviewTab';
import PersonalityTab from '../../components/istikhara/tabs/PersonalityTab';
import SpiritualPracticeTab from '../../components/istikhara/tabs/SpiritualPracticeTab';

const Tab = createMaterialTopTabNavigator();
const { width } = Dimensions.get('window');

// Premium Tab Wrapper - Shows upgrade prompt for free users
function PremiumTabWrapper({ 
  children, 
  featureId, 
  title,
  description,
  icon 
}: { 
  children: React.ReactNode;
  featureId: 'personalGuidance' | 'spiritualGuidance' | 'timingAdvice';
  title: string;
  description: string;
  icon: string;
}) {
  const { isPremium, isAdmin } = useSubscription();
  
  if (isPremium || isAdmin) {
    return <>{children}</>;
  }
  
  return (
    <View style={{ flex: 1, backgroundColor: '#0f1419' }}>
      <PremiumSection
        featureId={featureId}
        title={title}
        description={description}
        icon={icon}
      >
        {children}
      </PremiumSection>
    </View>
  );
}

export default function IstikharaResults() {
  const params = useLocalSearchParams();
  const router = useRouter();
  const [data, setData] = useState<IstikharaData | null>(null);
  const { language, setLanguage, t } = useLanguage();
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    // Parse the data from route params
    console.log('Results screen params:', params);
    
    if (params.data && typeof params.data === 'string') {
      try {
        const parsedData = JSON.parse(params.data);
        console.log('Parsed result data:', parsedData);
        
        // Validate that we have the required data structure
        if (!parsedData.burujProfile) {
          throw new Error('Invalid data structure: missing burujProfile');
        }
        
        console.log('Setting data state with valid parsed data');
        setData(parsedData);
      } catch (error) {
        console.error('Failed to parse result data:', error);
        const errorMsg = error instanceof Error ? error.message : 'Failed to load results';
        Alert.alert('Error', errorMsg, [
          { text: 'OK', onPress: () => router.back() },
        ]);
      }
    } else if (params.data && typeof params.data === 'object' && !Array.isArray(params.data)) {
      // Handle case where data is already an object (shouldn't happen but worth checking)
      console.log('Data is already an object, using directly');
      setData(params.data as unknown as IstikharaData);
    } else if (!data) {
      // Only show error if we don't already have data loaded
      // (params can be called multiple times during navigation)
      console.log('No data in params yet, waiting...');
    }
  }, [params.data]);

  if (!data) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  const elementColor = getElementColor(data.burujProfile.element);

  const handleExport = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const html = generatePDFContent(data, params.personName as string, params.motherName as string);
      const { uri } = await Print.printToFileAsync({ html });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Share Istikhara Results',
        });
      } else {
        Alert.alert('Success', 'PDF saved successfully!');
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert(t('common.error'), t('istikhara.results.exportError') || 'Failed to export results as PDF');
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  };

  const handleShare = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const message = `
🌙 Istikharah al-Asmā' Results

Person: ${params.personName}
Mother: ${params.motherName}

Element: ${data.burujProfile.element}
Buruj Remainder: #${data.burujRemainder}

Abjad Total: ${data.combinedTotal}
Dhikr Count: ${data.repetitionCount}

Generated by Asrariya Everyday
      `.trim();

      await Share.share({
        message,
        title: 'Istikhara Results',
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };
  
  const handleLoadFromHistory = (saved: SavedCalculation) => {
    setData(saved.result);
    setShowHistory(false);
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />

      <SafeAreaView style={styles.container}>
        {/* Custom App Header */}
        <ResponsiveAppHeader
          currentLanguage={language === 'en' ? 'EN' : 'FR'}
          onLanguageChange={(lang) => setLanguage(lang.toLowerCase() as 'en' | 'fr' | 'ar')}
          onProfilePress={() => router.push('/modal')}
          onHistoryPress={() => setShowHistory(true)}
          onMenuPress={() => {
            console.log('Menu pressed - Navigation drawer coming soon');
          }}
        />

        {/* Action Buttons Bar */}
        <View style={styles.actionBar}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <View style={styles.actionButtons}>
            <TouchableOpacity 
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                router.push('/(tabs)/who-am-i');
              }} 
              style={[styles.actionButton, styles.newCalcButton]}
            >
              <Text style={styles.newCalcButtonText}>✨ {language === 'en' ? 'New Calculation' : 'Nouveau Calcul'}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleShare} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>📤 {t('common.share')}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleExport} style={styles.actionButton}>
              <Text style={styles.actionButtonText}>📄 {t('common.export') || 'Export'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tab Navigator */}
        <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: elementColor,
          tabBarInactiveTintColor: '#8892b0',
          tabBarIndicatorStyle: {
            backgroundColor: elementColor,
            height: 3,
          },
          tabBarStyle: {
            backgroundColor: '#1a1a2e',
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
            textTransform: 'none',
          },
          tabBarScrollEnabled: true,
          tabBarItemStyle: {
            width: 'auto',
            minWidth: 90,
          },
        }}
      >
        {/* FREE: Overview - Basic numbers and element */}
        <Tab.Screen name={t('istikhara.results.tabs.overview') || 'Overview'}>
          {() => <OverviewTab data={data} elementColor={elementColor} />}
        </Tab.Screen>
        
        {/* PREMIUM: Personality - Deep interpretation */}
        <Tab.Screen name={t('istikhara.results.tabs.personality') || 'Personality'}>
          {() => (
            <PremiumTabWrapper
              featureId="personalGuidance"
              title={t('premiumSections.personality.title')}
              description={t('premiumSections.personality.description')}
              icon="🧠"
            >
              <PersonalityTab data={data} elementColor={elementColor} />
            </PremiumTabWrapper>
          )}
        </Tab.Screen>
        
        {/* PREMIUM: Career - Life direction guidance */}
        <Tab.Screen name={t('istikhara.results.tabs.career') || 'Career'}>
          {() => (
            <PremiumTabWrapper
              featureId="spiritualGuidance"
              title={t('premiumSections.career.title')}
              description={t('premiumSections.career.description')}
              icon="💼"
            >
              <CareerTabAdvanced result={{
                personName: params.personName as string,
                motherName: params.motherName as string,
                ...data
              }} />
            </PremiumTabWrapper>
          )}
        </Tab.Screen>
        
        {/* PREMIUM: Blessed Day - Timing guidance */}
        <Tab.Screen name={t('istikhara.results.tabs.blessedDay') || 'Blessed Day'}>
          {() => (
            <PremiumTabWrapper
              featureId="timingAdvice"
              title={t('premiumSections.blessedDay.title')}
              description={t('premiumSections.blessedDay.description')}
              icon="📅"
            >
              <BlessedDayTab data={data} elementColor={elementColor} />
            </PremiumTabWrapper>
          )}
        </Tab.Screen>
        
        {/* PREMIUM: Spiritual Practice - Actionable guidance */}
        <Tab.Screen name={t('istikhara.results.tabs.spiritual') || 'Spiritual'}>
          {() => (
            <PremiumTabWrapper
              featureId="spiritualGuidance"
              title={t('premiumSections.spiritualPractice.title')}
              description={t('premiumSections.spiritualPractice.description')}
              icon="🕊️"
            >
              <SpiritualPracticeTab result={{
                personName: params.personName as string,
                motherName: params.motherName as string,
                ...data
              }} />
            </PremiumTabWrapper>
          )}
        </Tab.Screen>
      </Tab.Navigator>
      
      {/* History Modal */}
      <HistoryModal
        visible={showHistory}
        onClose={() => setShowHistory(false)}
        onSelectCalculation={handleLoadFromHistory}
      />
      </SafeAreaView>
    </>
  );
}

function getElementColor(element: string): string {
  const colors: Record<string, string> = {
    'fire': '#ef4444',      // Red
    'earth': '#84cc16',     // Green
    'air': '#06b6d4',       // Cyan
    'water': '#3b82f6',     // Blue
  };
  return colors[element.toLowerCase()] || '#e94560';
}

function generatePDFContent(data: IstikharaData, personName: string, motherName: string): string {
  const { burujProfile, personTotal, motherTotal, combinedTotal, repetitionCount, burujRemainder } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Istikhara Results</title>
  <style>
    body {
      font-family: 'Helvetica', 'Arial', sans-serif;
      padding: 40px;
      color: #333;
    }
    h1 {
      color: #1a1a2e;
      border-bottom: 3px solid #e94560;
      padding-bottom: 10px;
    }
    h2 {
      color: #e94560;
      margin-top: 30px;
    }
    .info-section {
      margin: 20px 0;
      padding: 15px;
      background-color: #f5f5f5;
      border-radius: 8px;
    }
    .info-row {
      display: flex;
      justify-content: space-between;
      margin: 8px 0;
    }
    .label {
      font-weight: bold;
    }
    ul {
      line-height: 1.8;
    }
  </style>
</head>
<body>
  <h1>🌙 Istikharah al-Asmā' Results</h1>
  
  <div class="info-section">
    <div class="info-row">
      <span class="label">Person's Name:</span>
      <span>${personName}</span>
    </div>
    <div class="info-row">
      <span class="label">Mother's Name:</span>
      <span>${motherName}</span>
    </div>
    <div class="info-row">
      <span class="label">Date:</span>
      <span>${new Date().toLocaleDateString()}</span>
    </div>
  </div>

  <h2>Buruj Profile</h2>
  <div class="info-section">
    <div class="info-row">
      <span class="label">Element:</span>
      <span>${burujProfile.element}</span>
    </div>
    <div class="info-row">
      <span class="label">Buruj Remainder:</span>
      <span>#${burujRemainder}</span>
    </div>
  </div>

  <h2>Abjad Numerology</h2>
  <div class="info-section">
    <div class="info-row">
      <span class="label">Person Total:</span>
      <span>${personTotal}</span>
    </div>
    <div class="info-row">
      <span class="label">Mother Total:</span>
      <span>${motherTotal}</span>
    </div>
    <div class="info-row">
      <span class="label">Combined Total:</span>
      <span>${combinedTotal}</span>
    </div>
    <div class="info-row">
      <span class="label">Dhikr Repetitions:</span>
      <span>${repetitionCount}</span>
    </div>
  </div>

  <h2>Spiritual Guidance</h2>
  <p><strong>Practice Night:</strong> ${burujProfile.spiritual_practice.practice_night.primary.en}</p>
  <p><strong>Zodiac Sign:</strong> ${'arabic' in burujProfile.spiritual_practice.zodiac_sign ? burujProfile.spiritual_practice.zodiac_sign.en : ''}</p>

  <h2>Blessed Day</h2>
  <p><strong>Day:</strong> ${burujProfile.blessed_day.day.en}</p>

  <hr style="margin-top: 40px;">
  <p style="text-align: center; color: #8892b0; font-size: 12px;">
    Generated by Asrariya Everyday • ${new Date().toLocaleString()}
  </p>
</body>
</html>
  `.trim();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1419',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f1419',
  },
  loadingText: {
    fontSize: 16,
    color: '#ffffff',
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1a1a2e',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  backButtonText: {
    color: '#60a5fa',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(124, 58, 237, 0.2)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.3)',
  },
  actionButtonText: {
    color: '#a78bfa',
    fontSize: 14,
    fontWeight: '600',
  },
  newCalcButton: {
    backgroundColor: 'rgba(30, 58, 138, 0.3)',
    borderColor: 'rgba(96, 165, 250, 0.4)',
  },
  newCalcButtonText: {
    color: '#60a5fa',
    fontSize: 14,
    fontWeight: '700',
  },
  headerButtons: {
    flexDirection: 'row',
    marginRight: 8,
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
  },
  headerButtonText: {
    fontSize: 22,
  },
});
