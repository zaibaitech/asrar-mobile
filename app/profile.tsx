/**
 * User Profile Screen
 * ===================
 * Allows users to enter personal data for personalization
 * 
 * Features:
 * - Date of Birth picker (required for Divine Timing)
 * - Arabic name input (required for Name Destiny)
 * - Mother's name input (optional)
 * - Location picker (optional, for prayer times)
 * - Live preview of derived data (Burj, Element)
 * - Profile completion percentage
 * 
 * Privacy:
 * - All data stored locally
 * - No external transmission (guest mode)
 * - User can clear data anytime
 */

import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { documentDirectory, writeAsStringAsync } from 'expo-file-system/legacy';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { DarkTheme } from '@/constants/DarkTheme';
import { useProfile } from '@/contexts/ProfileContext';
import { signOut } from '@/services/AuthService';
import {
    getCurrentLocation,
    requestLocationPermission,
} from '@/services/LocationService';
import {
    deriveBurjFromDOB,
    deriveElementFromBurj,
    getElementNameAr,
    getPlanetaryAttributes,
} from '@/services/ProfileDerivationService';
import { exportProfile } from '@/services/UserProfileStorage';

export default function ProfileScreen() {
  const router = useRouter();
  const {
    profile,
    setProfile,
    completionStatus,
    personalizationLevel,
    resetProfile,
    reloadProfile,
  } = useProfile();
  
  // Local form state
  const [nameAr, setNameAr] = useState(profile.nameAr || '');
  const [nameLatin, setNameLatin] = useState(profile.nameLatin || '');
  const [motherName, setMotherName] = useState(profile.motherName || '');
  const [dobISO, setDobISO] = useState(profile.dobISO || '');
  
  // Date picker state
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    profile.dobISO ? new Date(profile.dobISO) : new Date()
  );
  
  // Location state
  const [locationLabel, setLocationLabel] = useState(profile.location?.label || '');
  const [loadingLocation, setLoadingLocation] = useState(false);
  
  // Derived data preview
  const [burjPreview, setBurjPreview] = useState<string | null>(null);
  const [elementPreview, setElementPreview] = useState<string | null>(null);
  const [planetPreview, setPlanetPreview] = useState<string | null>(null);
  
  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  /**
   * Update derived data preview when DOB changes
   */
  useEffect(() => {
    if (dobISO) {
      const burjData = deriveBurjFromDOB(dobISO);
      
      if (burjData) {
        setBurjPreview(burjData.burjAr);
        
        const element = deriveElementFromBurj(burjData.burjIndex);
        setElementPreview(getElementNameAr(element));
        
        const planetData = getPlanetaryAttributes(
          profile.derived?.planetaryRuler || 'Sun'
        );
        setPlanetPreview(planetData.arabicName);
      } else {
        setBurjPreview(null);
        setElementPreview(null);
        setPlanetPreview(null);
      }
    } else {
      setBurjPreview(null);
      setElementPreview(null);
      setPlanetPreview(null);
    }
  }, [dobISO, profile.derived]);
  
  // ============================================================================
  // HANDLERS
  // ============================================================================
  
  const handleDateChange = (event: any, date?: Date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    
    if (date) {
      setSelectedDate(date);
      const isoString = date.toISOString().split('T')[0];
      setDobISO(isoString);
    }
  };
  
  const handleGetLocation = async () => {
    try {
      setLoadingLocation(true);
      
      // Request permission
      const permission = await requestLocationPermission();
      
      if (!permission.granted) {
        Alert.alert(
          'Location Permission',
          'Location permission is required to auto-detect your location.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      // Get location
      const { location, error } = await getCurrentLocation();
      
      if (error || !location) {
        Alert.alert(
          'Location Error',
          error || 'Failed to get location',
          [{ text: 'OK' }]
        );
        return;
      }
      
      // Update profile with location
      await setProfile({ location });
      setLocationLabel(location.label || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`);
      
      Alert.alert(
        'Location Updated',
        `Set to: ${location.label}`,
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to get location',
        [{ text: 'OK' }]
      );
    } finally {
      setLoadingLocation(false);
    }
  };
  
  const handleSave = async () => {
    try {
      await setProfile({
        nameAr: nameAr || undefined,
        nameLatin: nameLatin || undefined,
        motherName: motherName || undefined,
        dobISO: dobISO || undefined,
      });
      
      Alert.alert(
        'Profile Saved',
        'Your personalization data has been updated.',
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      Alert.alert(
        'Error',
        'Failed to save profile. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };
  
  const handleClearProfile = () => {
    Alert.alert(
      'Clear Profile?',
      'This will delete all your personalization data. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await resetProfile();
            setNameAr('');
            setNameLatin('');
            setMotherName('');
            setDobISO('');
            setBurjPreview(null);
            setElementPreview(null);
            setPlanetPreview(null);
          },
        },
      ]
    );
  };
  
  const handleExportData = async () => {
    try {
      const jsonData = await exportProfile();
      
      if (!jsonData) {
        Alert.alert('Error', 'No profile data to export');
        return;
      }
      
      // Create a filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `asrar-profile-${timestamp}.json`;
      
      // For web/development - copy to clipboard
      if (Platform.OS === 'web') {
        // @ts-ignore - clipboard API exists in web
        navigator.clipboard.writeText(jsonData);
        Alert.alert('Success', 'Profile data copied to clipboard');
        return;
      }
      
      // For mobile - share the JSON file
      const fileUri = `${documentDirectory}${filename}`;
      await writeAsStringAsync(fileUri, jsonData);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: 'Export Profile Data',
        });
      } else {
        Alert.alert('Success', 'Profile exported to: ' + fileUri);
      }
      
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export profile data');
    }
  };
  
  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out? Your local data will remain on this device.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              // Sign out clears the session tokens
              await signOut();
              
              // Reload profile - this will re-check session (now null) and switch to guest mode
              await reloadProfile();
              
              Alert.alert('Success', 'You have been signed out');
              router.replace('/(tabs)');
            } catch (error) {
              console.error('Sign out error:', error);
              Alert.alert('Error', 'Failed to sign out. Please try again.');
            }
          },
        },
      ]
    );
  };
  
  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Your Profile',
          headerStyle: {
            backgroundColor: DarkTheme.screenBackground,
          },
          headerTintColor: DarkTheme.textPrimary,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Completion Banner */}
        <LinearGradient
          colors={['rgba(139, 115, 85, 0.2)', 'rgba(139, 115, 85, 0.05)']}
          style={styles.completionBanner}
        >
          <View style={styles.completionHeader}>
            <Ionicons
              name={completionStatus.completionPercent === 100 ? 'checkmark-circle' : 'information-circle'}
              size={24}
              color="#8B7355"
            />
            <Text style={styles.completionTitle}>
              Profile {completionStatus.completionPercent}% Complete
            </Text>
          </View>
          
          {completionStatus.completionPercent < 100 && (
            <Text style={styles.completionText}>
              Add {completionStatus.missingFields.join(', ')} to unlock full personalization
            </Text>
          )}
          
          <View style={styles.completionBar}>
            <View
              style={[
                styles.completionProgress,
                { width: `${completionStatus.completionPercent}%` },
              ]}
            />
          </View>
          
          {/* Personalization Level */}
          <View style={styles.levelRow}>
            <Text style={styles.levelLabel}>Personalization Level:</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>
                {personalizationLevel === 0 && 'None'}
                {personalizationLevel === 1 && 'Basic'}
                {personalizationLevel === 2 && 'Enhanced'}
                {personalizationLevel === 3 && 'Full'}
              </Text>
            </View>
          </View>
        </LinearGradient>
        
        {/* Date of Birth Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Date of Birth</Text>
          <Text style={styles.sectionDescription}>
            Required for Divine Timing personalization
          </Text>
          
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar" size={20} color={DarkTheme.textSecondary} />
            <Text style={styles.dateButtonText}>
              {dobISO || 'Select your date of birth'}
            </Text>
          </TouchableOpacity>
          
          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
              minimumDate={new Date(1900, 0, 1)}
            />
          )}
          
          {Platform.OS === 'ios' && showDatePicker && (
            <TouchableOpacity
              style={styles.dateConfirmButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.dateConfirmText}>Done</Text>
            </TouchableOpacity>
          )}
        </View>
        
        {/* Derived Data Preview */}
        {burjPreview && (
          <LinearGradient
            colors={['rgba(139, 115, 85, 0.15)', 'rgba(139, 115, 85, 0.05)']}
            style={styles.derivedCard}
          >
            <Text style={styles.derivedTitle}>Your Astrological Profile</Text>
            
            <View style={styles.derivedRow}>
              <View style={styles.derivedItem}>
                <Text style={styles.derivedLabel}>Burj (Sign)</Text>
                <Text style={styles.derivedValue}>{burjPreview}</Text>
              </View>
              
              <View style={styles.derivedItem}>
                <Text style={styles.derivedLabel}>Element</Text>
                <Text style={styles.derivedValue}>{elementPreview}</Text>
              </View>
            </View>
          </LinearGradient>
        )}
        
        {/* Name Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Name</Text>
          <Text style={styles.sectionDescription}>
            Required for Name Destiny and Compatibility
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Arabic Name</Text>
            <TextInput
              style={styles.input}
              value={nameAr}
              onChangeText={setNameAr}
              placeholder="أدخل اسمك بالعربية"
              placeholderTextColor={DarkTheme.textSecondary}
            />
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Latin Name (Optional)</Text>
            <TextInput
              style={styles.input}
              value={nameLatin}
              onChangeText={setNameLatin}
              placeholder="Enter your name in Latin"
              placeholderTextColor={DarkTheme.textSecondary}
            />
          </View>
        </View>
        
        {/* Mother's Name Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mother's Name (Optional)</Text>
          <Text style={styles.sectionDescription}>
            Used for enhanced calculations in some features
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Mother's Arabic Name</Text>
            <TextInput
              style={styles.input}
              value={motherName}
              onChangeText={setMotherName}
              placeholder="أدخل اسم والدتك بالعربية"
              placeholderTextColor={DarkTheme.textSecondary}
            />
          </View>
        </View>
        
        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location (Optional)</Text>
          <Text style={styles.sectionDescription}>
            For accurate prayer times and advanced astrological calculations
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Location</Text>
            <View style={styles.locationRow}>
              <TextInput
                style={[styles.input, styles.locationInput]}
                value={locationLabel}
                onChangeText={setLocationLabel}
                placeholder="Enter location or use auto-detect"
                placeholderTextColor={DarkTheme.textSecondary}
                editable={false}
              />
              <TouchableOpacity
                style={styles.locationButton}
                onPress={handleGetLocation}
                disabled={loadingLocation}
              >
                {loadingLocation ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Ionicons name="locate" size={20} color="#fff" />
                )}
              </TouchableOpacity>
            </View>
            <Text style={styles.inputHint}>
              Tap the location icon to auto-detect
            </Text>
          </View>
        </View>
        
        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Ionicons name="lock-closed" size={16} color={DarkTheme.textSecondary} />
          <Text style={styles.privacyText}>
            All data is stored locally on your device. Nothing is sent to external servers in guest mode.
          </Text>
        </View>
        
        {/* Action Buttons */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <LinearGradient
            colors={['#8B7355', '#6B5645']}
            style={styles.saveGradient}
          >
            <Ionicons name="save" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>Save Profile</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        {/* AI Settings Button */}
        <TouchableOpacity 
          style={styles.aiSettingsButton} 
          onPress={() => router.push('/ai-settings')}
        >
          <Ionicons name="sparkles" size={20} color="#6366f1" />
          <Text style={styles.aiSettingsButtonText}>AI Settings</Text>
          <Ionicons name="chevron-forward" size={20} color={DarkTheme.textSecondary} />
        </TouchableOpacity>
        
        {/* Privacy & Data Section */}
        <View style={styles.privacySection}>
          <Text style={styles.privacySectionTitle}>Privacy & Data</Text>
          
          {/* Export Data Button */}
          <TouchableOpacity 
            style={styles.exportButton} 
            onPress={handleExportData}
          >
            <Ionicons name="download-outline" size={20} color="#10b981" />
            <Text style={styles.exportButtonText}>Export My Data</Text>
            <Ionicons name="chevron-forward" size={20} color={DarkTheme.textSecondary} />
          </TouchableOpacity>
          
          {/* Sign Out Button (only show if in account mode) */}
          {profile.mode === 'account' && (
            <TouchableOpacity 
              style={styles.signOutButton} 
              onPress={handleSignOut}
            >
              <Ionicons name="log-out-outline" size={20} color="#ef4444" />
              <Text style={styles.signOutButtonText}>Sign Out</Text>
              <Ionicons name="chevron-forward" size={20} color={DarkTheme.textSecondary} />
            </TouchableOpacity>
          )}
          
          {/* Privacy Notice */}
          <View style={styles.privacyNoticeCard}>
            <Ionicons name="shield-checkmark" size={16} color="#10b981" />
            <Text style={styles.privacyNoticeText}>
              All your data is stored locally on this device. We never send your personal information to external servers in guest mode.
            </Text>
          </View>
        </View>
        
        <TouchableOpacity style={styles.clearButton} onPress={handleClearProfile}>
          <Text style={styles.clearButtonText}>Delete All My Data</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DarkTheme.screenBackground,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  
  // Completion Banner
  completionBanner: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  completionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  completionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
    marginLeft: 8,
  },
  completionText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    marginBottom: 12,
  },
  completionBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  completionProgress: {
    height: '100%',
    backgroundColor: '#8B7355',
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
  },
  levelLabel: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    marginRight: 8,
  },
  levelBadge: {
    backgroundColor: 'rgba(139, 115, 85, 0.3)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B7355',
  },
  
  // Section
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    marginBottom: 12,
  },
  
  // Derived Data
  derivedCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  derivedTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
    marginBottom: 12,
  },
  derivedRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  derivedItem: {
    alignItems: 'center',
  },
  derivedLabel: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    marginBottom: 4,
  },
  derivedValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#8B7355',
  },
  
  // Input
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    marginBottom: 8,
  },
  input: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: DarkTheme.textPrimary,
    borderWidth: 1,
    borderColor: 'rgba(139, 115, 85, 0.3)',
  },
  inputHint: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    marginTop: 4,
    opacity: 0.7,
  },
  
  // Date Picker
  dateButton: {
    backgroundColor: 'rgba(139, 115, 85, 0.15)',
    padding: 14,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(139, 115, 85, 0.3)',
  },
  dateButtonText: {
    fontSize: 15,
    color: DarkTheme.textPrimary,
  },
  dateConfirmButton: {
    backgroundColor: '#8B7355',
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  dateConfirmText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  
  // Location
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationInput: {
    flex: 1,
  },
  locationButton: {
    backgroundColor: '#8B7355',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
  },
  
  // Privacy
  privacyNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 115, 85, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  privacyText: {
    fontSize: 12,
    color: DarkTheme.textSecondary,
    marginLeft: 8,
    flex: 1,
  },
  
  // Buttons
  saveButton: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  saveGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginLeft: 8,
  },
  aiSettingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  aiSettingsButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366f1',
    marginLeft: 8,
    flex: 1,
  },
  
  // Privacy & Data Section
  privacySection: {
    marginTop: 8,
    marginBottom: 16,
  },
  privacySectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: DarkTheme.textSecondary,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  exportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10b981',
    marginLeft: 8,
    flex: 1,
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  signOutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
    marginLeft: 8,
    flex: 1,
  },
  privacyNoticeCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(16, 185, 129, 0.05)',
    padding: 12,
    borderRadius: 8,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.1)',
  },
  privacyNoticeText: {
    flex: 1,
    fontSize: 12,
    color: DarkTheme.textSecondary,
    lineHeight: 18,
  },
  
  clearButton: {
    padding: 16,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 14,
    color: '#ff4444',
    fontWeight: '500',
  },
});
