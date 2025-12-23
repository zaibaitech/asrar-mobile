/**
 * TEST COMPONENT - LoadingOverlay Test
 * 
 * Add this to your app to test the loading overlay independently.
 * Just import this component in your app and render it.
 */

import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import LoadingOverlay from './LoadingOverlay';

export default function LoadingOverlayTest() {
  const [showOverlay, setShowOverlay] = useState(false);

  const testOverlay = () => {
    console.log('🧪 TEST: Showing overlay');
    setShowOverlay(true);
  };

  const handleComplete = () => {
    console.log('🧪 TEST: Overlay completed');
    setShowOverlay(false);
    Alert.alert('Test Complete', 'The 5-second overlay animation completed!');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Loading Overlay Test</Text>
        <Text style={styles.subtitle}>
          Click the button below to test the 5-second loading animation
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={testOverlay}
          disabled={showOverlay}
        >
          <Text style={styles.buttonText}>
            {showOverlay ? 'Overlay Showing...' : 'Test Loading Overlay'}
          </Text>
        </TouchableOpacity>

        <View style={styles.info}>
          <Text style={styles.infoTitle}>What to expect:</Text>
          <Text style={styles.infoText}>• Full-screen dark overlay</Text>
          <Text style={styles.infoText}>• Spinning Asrār logo</Text>
          <Text style={styles.infoText}>• Pulsing animation</Text>
          <Text style={styles.infoText}>• Purple glow effect</Text>
          <Text style={styles.infoText}>• Progress bar (0-100%)</Text>
          <Text style={styles.infoText}>• Three dots indicator</Text>
          <Text style={styles.infoText}>• Auto-dismiss after 5 seconds</Text>
        </View>

        <View style={styles.debug}>
          <Text style={styles.debugTitle}>Debug Info:</Text>
          <Text style={styles.debugText}>Overlay Visible: {showOverlay ? 'YES' : 'NO'}</Text>
          <Text style={styles.debugText}>Check console for logs</Text>
        </View>
      </View>

      {/* Loading Overlay */}
      <LoadingOverlay visible={showOverlay} onComplete={handleComplete} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },

  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 16,
    color: '#9CA3AF',
    marginBottom: 32,
    textAlign: 'center',
    lineHeight: 24,
  },

  button: {
    backgroundColor: '#7C3AED',
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginBottom: 32,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },

  buttonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  info: {
    backgroundColor: '#1F2937',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },

  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },

  infoText: {
    fontSize: 14,
    color: '#E5E7EB',
    marginBottom: 8,
    lineHeight: 20,
  },

  debug: {
    backgroundColor: '#374151',
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: '#4B5563',
  },

  debugTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 8,
  },

  debugText: {
    fontSize: 13,
    color: '#9CA3AF',
    fontFamily: 'monospace',
    marginBottom: 4,
  },
});
