/**
 * AsrarLogo Component Usage Examples
 * 
 * The sacred geometry logo with various configuration options
 */

import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import AsrarLogo from './AsrarLogo';

export function AsrarLogoExamples() {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Icon Variants</Text>
      
      {/* Default Icon */}
      <View style={styles.logoContainer}>
        <Text style={styles.label}>Default (Aether)</Text>
        <AsrarLogo size={120} variant="icon" />
      </View>

      {/* Element Variations */}
      <Text style={styles.sectionTitle}>Element Themes</Text>
      
      <View style={styles.row}>
        <View style={styles.logoContainer}>
          <Text style={styles.label}>Fire</Text>
          <AsrarLogo size={100} variant="icon" element="fire" />
        </View>
        
        <View style={styles.logoContainer}>
          <Text style={styles.label}>Water</Text>
          <AsrarLogo size={100} variant="icon" element="water" />
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.logoContainer}>
          <Text style={styles.label}>Earth</Text>
          <AsrarLogo size={100} variant="icon" element="earth" />
        </View>
        
        <View style={styles.logoContainer}>
          <Text style={styles.label}>Air</Text>
          <AsrarLogo size={100} variant="icon" element="air" />
        </View>
      </View>

      {/* Mono Version */}
      <Text style={styles.sectionTitle}>Monochrome</Text>
      <View style={styles.logoContainer}>
        <Text style={styles.label}>Mono (Purple)</Text>
        <AsrarLogo size={100} variant="icon" mono={true} />
      </View>

      {/* With Grid */}
      <Text style={styles.sectionTitle}>Sacred Geometry Grid</Text>
      <View style={styles.logoContainer}>
        <Text style={styles.label}>With Grid Lines</Text>
        <AsrarLogo size={120} variant="icon" showGrid={true} />
      </View>

      {/* Size Variations */}
      <Text style={styles.sectionTitle}>Size Options</Text>
      <View style={styles.row}>
        <View style={styles.logoContainer}>
          <Text style={styles.label}>Small (56px)</Text>
          <AsrarLogo size={56} variant="icon" />
        </View>
        
        <View style={styles.logoContainer}>
          <Text style={styles.label}>Medium (100px)</Text>
          <AsrarLogo size={100} variant="icon" />
        </View>
        
        <View style={styles.logoContainer}>
          <Text style={styles.label}>Large (150px)</Text>
          <AsrarLogo size={150} variant="icon" />
        </View>
      </View>

      {/* Wordmark Variants */}
      <Text style={styles.sectionTitle}>Wordmark</Text>
      <View style={styles.logoContainer}>
        <Text style={styles.label}>Vertical Wordmark</Text>
        <AsrarLogo size={120} variant="wordmark" element="aether" />
      </View>

      <View style={styles.logoContainer}>
        <Text style={styles.label}>Horizontal Wordmark</Text>
        <AsrarLogo size={120} variant="horizontal" element="aether" />
      </View>

      {/* App Icon Sizes */}
      <Text style={styles.sectionTitle}>App Icon Sizes</Text>
      <View style={styles.row}>
        <View style={styles.logoContainer}>
          <Text style={styles.label}>48x48</Text>
          <View style={[styles.iconBox, { width: 48, height: 48 }]}>
            <AsrarLogo size={48} variant="icon" />
          </View>
        </View>
        
        <View style={styles.logoContainer}>
          <Text style={styles.label}>72x72</Text>
          <View style={[styles.iconBox, { width: 72, height: 72 }]}>
            <AsrarLogo size={72} variant="icon" />
          </View>
        </View>
        
        <View style={styles.logoContainer}>
          <Text style={styles.label}>96x96</Text>
          <View style={[styles.iconBox, { width: 96, height: 96 }]}>
            <AsrarLogo size={96} variant="icon" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginTop: 24,
    marginBottom: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginVertical: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 12,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  iconBox: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});

export default AsrarLogoExamples;
