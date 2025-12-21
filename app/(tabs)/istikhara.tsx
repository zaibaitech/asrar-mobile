import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { hasHistory } from '../../services/api/istikhara';

const { width, height } = Dimensions.get('window');

export default function IstikharaTab() {
  const router = useRouter();
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    checkHistory();
  }, []);

  const checkHistory = async () => {
    const historyExists = await hasHistory();
    setShowHistory(historyExists);
  };

  return (
    <LinearGradient
      colors={['#1a1a2e', '#16213e', '#0f3460']}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.mainIcon}>🌙</Text>
          <Text style={styles.mainTitle}>Istikharah al-Asmā'</Text>
          <Text style={styles.subtitle}>Spiritual Guidance Through Names</Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionText}>
            Discover your spiritual profile through the ancient practice of Abjad numerology. 
            Learn about your personality, career guidance, blessed practices, and divine connections.
          </Text>
        </View>

        {/* Educational Button */}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => {
            // TODO: Navigate to educational modal/screen
            console.log('Show educational content');
          }}
        >
          <Text style={styles.secondaryButtonIcon}>📖</Text>
          <Text style={styles.secondaryButtonText}>What is Istikhara?</Text>
        </TouchableOpacity>

        {/* Main CTA Button */}
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.push('/istikhara/form')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#e94560', '#c72c41']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.primaryButtonGradient}
          >
            <Text style={styles.primaryButtonIcon}>✨</Text>
            <Text style={styles.primaryButtonText}>Begin Calculation</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* History Button (Conditional) */}
        {showHistory && (
          <TouchableOpacity
            style={styles.historyButton}
            onPress={() => {
              // TODO: Navigate to history screen
              console.log('Show history');
            }}
          >
            <Text style={styles.historyButtonIcon}>📚</Text>
            <Text style={styles.historyButtonText}>View History</Text>
          </TouchableOpacity>
        )}

        {/* Footer Info */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Based on traditional Abjad numerology and the 12 Buruj (zodiac signs) 
            with Islamic spiritual practices.
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 24,
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 32,
  },
  mainIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#a8b2d1',
    textAlign: 'center',
  },
  descriptionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    width: '100%',
    maxWidth: 400,
  },
  descriptionText: {
    fontSize: 16,
    color: '#e0e6f0',
    textAlign: 'center',
    lineHeight: 24,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
    maxWidth: 400,
  },
  secondaryButtonIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  secondaryButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
  },
  primaryButton: {
    width: '100%',
    maxWidth: 400,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#e94560',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 32,
  },
  primaryButtonIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  primaryButtonText: {
    fontSize: 20,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  historyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 24,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  historyButtonIcon: {
    fontSize: 20,
    marginRight: 10,
  },
  historyButtonText: {
    fontSize: 15,
    color: '#ffffff',
    fontWeight: '500',
  },
  footer: {
    marginTop: 32,
    paddingHorizontal: 16,
    maxWidth: 400,
  },
  footerText: {
    fontSize: 13,
    color: '#8892b0',
    textAlign: 'center',
    lineHeight: 20,
  },
});
