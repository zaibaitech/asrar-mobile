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
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { Keyboard as KeyboardIcon } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ArabicKeyboard from '@/components/istikhara/ArabicKeyboard';
import NameAutocomplete from '@/components/NameAutocomplete';
import { DarkTheme } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import { useProfile } from '@/contexts/ProfileContext';
import { deleteAccount, signOut } from '@/services/AuthService';
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
  const params = useLocalSearchParams<{ postSave?: string }>();
  const postSave = Array.isArray(params.postSave) ? params.postSave[0] : params.postSave;
  const { t, language } = useLanguage();
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

  // Arabic keyboard state
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [activeField, setActiveField] = useState<'name' | 'mother' | null>(null);
  const [cursorPosition, setCursorPosition] = useState(0);
  const nameArInputRef = useRef<TextInput>(null);
  const motherNameInputRef = useRef<TextInput>(null);

  // Account deletion UI state
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deletingAccount, setDeletingAccount] = useState(false);
  
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

      // If this screen was opened for initial profile completion,
      // redirect after saving instead of keeping the user here.
      if (postSave === 'home') {
        router.replace('/(tabs)');
        return;
      }

      if (postSave === 'auth') {
        router.replace('/auth');
        return;
      }

      if (postSave === 'choose') {
        Alert.alert(
          'Profile Saved',
          'Would you like to sign in/create an account, or continue to the app?',
          [
            { text: 'Sign In', onPress: () => router.replace('/auth') },
            { text: 'Go Home', onPress: () => router.replace('/(tabs)') },
          ]
        );
        return;
      }
      
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
      t('profile.clearDataTitle'),
      t('profile.clearDataMessage'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
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
        Alert.alert(t('common.error'), t('profile.exportError'));
        return;
      }
      
      // Create a filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `asrar-profile-${timestamp}.json`;
      
      // For web/development - copy to clipboard
      if (Platform.OS === 'web') {
        // @ts-ignore - clipboard API exists in web
        navigator.clipboard.writeText(jsonData);
        Alert.alert(t('common.success'), t('profile.exportSuccess'));
        return;
      }
      
      // For mobile - share the JSON file
      const fileUri = `${documentDirectory}${filename}`;
      await writeAsStringAsync(fileUri, jsonData);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, {
          mimeType: 'application/json',
          dialogTitle: t('profile.exportMyData'),
        });
      } else {
        Alert.alert(t('common.success'), t('profile.exportSuccess'));
      }
      
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert(t('common.error'), t('profile.exportError'));
    }
  };
  
  const handleSignOut = () => {
    Alert.alert(
      t('profile.signOutTitle'),
      t('profile.signOutMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('profile.signOut'),
          style: 'destructive',
          onPress: async () => {
            try {
              // Sign out clears the session tokens
              await signOut();
              
              // Reload profile - this will re-check session (now null) and switch to guest mode
              await reloadProfile();
              
              Alert.alert(t('common.success'), t('profile.signOutMessage'));
              router.replace('/(tabs)');
            } catch (error) {
              console.error('Sign out error:', error);
              Alert.alert(t('common.error'), t('profile.deleteError'));
            }
          },
        },
      ]
    );
  };
  
  const handleDeleteAccount = () => {
    Alert.alert(
      t('profile.deleteAccountTitle'),
      t('profile.deleteAccountMessage'),
      [
        {
          text: t('common.cancel'),
          style: 'cancel',
        },
        {
          text: t('profile.deleteAccount'),
          style: 'destructive',
          onPress: () => {
            setDeletePassword('');
            setDeleteModalVisible(true);
          },
        },
      ]
    );
  };

  const confirmDeleteAccount = async () => {
    if (!deletePassword || deletePassword.trim() === '') {
      Alert.alert(t('common.error'), t('auth.passwordRequired'));
      return;
    }

    try {
      setDeletingAccount(true);

      const result = await deleteAccount(deletePassword);

      if (result.error) {
        Alert.alert(t('common.error'), result.error.message);
        return;
      }

      // Clear local profile and return user to guest mode
      await resetProfile();
      await reloadProfile();

      setDeleteModalVisible(false);
      setDeletePassword('');

      Alert.alert(
        t('profile.deleteSuccess'),
        'Your account has been deleted. You can continue using Asrariya as a guest.',
        [{ text: t('common.close'), onPress: () => router.replace('/(tabs)') }]
      );
    } catch (error) {
      console.error('Delete account error:', error);
      Alert.alert(t('common.error'), t('profile.deleteError'));
    } finally {
      setDeletingAccount(false);
    }
  };

  // ============================================================================
  // ARABIC KEYBOARD HANDLERS
  // ============================================================================

  const openKeyboard = (field: 'name' | 'mother') => {
    setActiveField(field);
    setKeyboardVisible(true);
    const currentValue = field === 'name' ? nameAr : motherName;
    setCursorPosition(currentValue.length);
  };

  const handleKeyPress = (key: string) => {
    if (!activeField) return;

    const currentValue = activeField === 'name' ? nameAr : motherName;
    const newValue = 
      currentValue.slice(0, cursorPosition) + 
      key + 
      currentValue.slice(cursorPosition);
    
    if (activeField === 'name') {
      setNameAr(newValue);
    } else {
      setMotherName(newValue);
    }
    
    setCursorPosition(cursorPosition + 1);
  };

  const handleBackspace = () => {
    if (!activeField || cursorPosition === 0) return;

    const currentValue = activeField === 'name' ? nameAr : motherName;
    const newValue = 
      currentValue.slice(0, cursorPosition - 1) + 
      currentValue.slice(cursorPosition);
    
    if (activeField === 'name') {
      setNameAr(newValue);
    } else {
      setMotherName(newValue);
    }
    
    setCursorPosition(cursorPosition - 1);
  };

  const handleSpace = () => {
    handleKeyPress(' ');
  };
  
  // ============================================================================
  // RENDER
  // ============================================================================
  
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: t('profile.title'),
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
              {t('profile.complete')}
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
            <Text style={styles.levelLabel}>{t('profile.personalizationLevel')}:</Text>
            <View style={styles.levelBadge}>
              <Text style={styles.levelText}>
                {personalizationLevel === 0 && t('profile.levels.none')}
                {personalizationLevel === 1 && t('profile.levels.basic')}
                {personalizationLevel === 2 && t('profile.levels.enhanced')}
                {personalizationLevel === 3 && t('profile.levels.full')}
              </Text>
            </View>
          </View>
        </LinearGradient>
        
        {/* Date of Birth Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.dob.title')}</Text>
          <Text style={styles.sectionDescription}>
            {t('profile.dob.subtitle')}
          </Text>
          
          <TouchableOpacity
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar" size={20} color={DarkTheme.textSecondary} />
            <Text style={styles.dateButtonText}>
              {dobISO || t('profile.dob.selectPlaceholder')}
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
            <Text style={styles.derivedTitle}>{t('profile.astro.title')}</Text>
            
            <View style={styles.derivedRow}>
              <View style={styles.derivedItem}>
                <Text style={styles.derivedLabel}>{t('profile.astro.sign')}</Text>
                <Text style={styles.derivedValue}>{burjPreview}</Text>
              </View>
              
              <View style={styles.derivedItem}>
                <Text style={styles.derivedLabel}>{t('profile.astro.element')}</Text>
                <Text style={styles.derivedValue}>{elementPreview}</Text>
              </View>
            </View>
          </LinearGradient>
        )}
        
        {/* Name Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.name.title')}</Text>
          <Text style={styles.sectionDescription}>
            {t('profile.name.subtitle')}
          </Text>
          
          {/* Latin Name Autocomplete */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('profile.name.latin')}</Text>
            <NameAutocomplete
              value={nameLatin}
              onChange={setNameLatin}
              onArabicSelect={(arabic, latin) => {
                setNameAr(arabic);
                setNameLatin(latin);
              }}
              placeholder={t('profile.name.latinPlaceholder')}
              showHelper={false}
              language={language}
            />
          </View>

          {/* Arabic Name Input with Keyboard Button */}
          <View style={styles.inputGroup}>
            <View style={styles.labelWithButton}>
              <Text style={styles.inputLabel}>{t('profile.name.arabic')}</Text>
              <TouchableOpacity
                style={styles.keyboardButton}
                onPress={() => openKeyboard('name')}
              >
                <KeyboardIcon size={14} color="#e0e7ff" strokeWidth={2} />
                <Text style={styles.keyboardButtonText}>{t('nameDestiny.form.keyboardButton')}</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              ref={nameArInputRef}
              style={styles.input}
              value={nameAr}
              onChangeText={(text) => {
                setNameAr(text);
                setCursorPosition(text.length);
              }}
              onSelectionChange={(e) => setCursorPosition(e.nativeEvent.selection.start)}
              placeholder={t('profile.name.arabicPlaceholder')}
              placeholderTextColor={DarkTheme.textSecondary}
            />
          </View>
        </View>
        
        {/* Mother's Name Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.mother.title')}</Text>
          <Text style={styles.sectionDescription}>
            {t('profile.mother.subtitle')}
          </Text>
          
          <View style={styles.inputGroup}>
            <View style={styles.labelWithButton}>
              <Text style={styles.inputLabel}>{t('profile.mother.arabic')}</Text>
              <TouchableOpacity
                style={styles.keyboardButton}
                onPress={() => openKeyboard('mother')}
              >
                <KeyboardIcon size={14} color="#e0e7ff" strokeWidth={2} />
                <Text style={styles.keyboardButtonText}>{t('nameDestiny.form.keyboardButton')}</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              ref={motherNameInputRef}
              style={styles.input}
              value={motherName}
              onChangeText={(text) => {
                setMotherName(text);
                setCursorPosition(text.length);
              }}
              onSelectionChange={(e) => setCursorPosition(e.nativeEvent.selection.start)}
              placeholder={t('profile.mother.arabicPlaceholder')}
              placeholderTextColor={DarkTheme.textSecondary}
            />
          </View>
        </View>
        
        {/* Location Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t('profile.location.title')}</Text>
          <Text style={styles.sectionDescription}>
            {t('profile.location.subtitle')}
          </Text>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('profile.location.label')}</Text>
            <View style={styles.locationRow}>
              <TextInput
                style={[styles.input, styles.locationInput]}
                value={locationLabel}
                onChangeText={setLocationLabel}
                placeholder={t('profile.location.placeholder')}
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
              {t('profile.location.autoDetect')}
            </Text>
          </View>
        </View>
        
        {/* Privacy Notice */}
        <View style={styles.privacyNotice}>
          <Ionicons name="lock-closed" size={16} color={DarkTheme.textSecondary} />
          <Text style={styles.privacyText}>
            {t('profile.localOnly')}
          </Text>
        </View>
        
        {/* Action Buttons */}
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <LinearGradient
            colors={['#8B7355', '#6B5645']}
            style={styles.saveGradient}
          >
            <Ionicons name="save" size={20} color="#fff" />
            <Text style={styles.saveButtonText}>{t('profile.save')}</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        {/* AI Settings Button */}
        <TouchableOpacity 
          style={styles.aiSettingsButton} 
          onPress={() => router.push('/ai-settings')}
        >
          <Ionicons name="sparkles" size={20} color="#6366f1" />
          <Text style={styles.aiSettingsButtonText}>{t('profile.aiSettings')}</Text>
          <Ionicons name="chevron-forward" size={20} color={DarkTheme.textSecondary} />
        </TouchableOpacity>
        
        {/* Privacy & Data Section */}
        <View style={styles.privacySection}>
          <Text style={styles.privacySectionTitle}>{t('profile.privacyDataTitle')}</Text>
          
          {/* Export Data Button */}
          <TouchableOpacity 
            style={styles.exportButton} 
            onPress={handleExportData}
          >
            <Ionicons name="download-outline" size={20} color="#10b981" />
            <Text style={styles.exportButtonText}>{t('profile.exportMyData')}</Text>
            <Ionicons name="chevron-forward" size={20} color={DarkTheme.textSecondary} />
          </TouchableOpacity>
          
          {/* Sign Out Button (only show if in account mode) */}
          {profile.mode === 'account' && (
            <>
              <TouchableOpacity 
                style={styles.signOutButton} 
                onPress={handleSignOut}
              >
                <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                <Text style={styles.signOutButtonText}>{t('profile.signOut')}</Text>
                <Ionicons name="chevron-forward" size={20} color={DarkTheme.textSecondary} />
              </TouchableOpacity>
              
              {/* Delete Account Button */}
              <TouchableOpacity 
                style={styles.deleteAccountButton} 
                onPress={handleDeleteAccount}
              >
                <Ionicons name="trash-outline" size={20} color="#dc2626" />
                <Text style={styles.deleteAccountButtonText}>{t('profile.deleteAccount')}</Text>
                <Ionicons name="chevron-forward" size={20} color={DarkTheme.textSecondary} />
              </TouchableOpacity>
            </>
          )}
          
          {/* Privacy Notice */}
          <View style={styles.privacyNoticeCard}>
            <Ionicons name="shield-checkmark" size={16} color="#10b981" />
            <Text style={styles.privacyNoticeText}>
              {t('profile.privacyNotice')}
            </Text>
          </View>
          
          {/* Legal Links */}
          <View style={styles.legalLinks}>
            <TouchableOpacity 
              style={styles.legalLink}
              onPress={() => router.push('https://zaibaitech.github.io/asrar-mobile/privacy.html' as any)}
            >
              <Ionicons name="document-text-outline" size={18} color={DarkTheme.textSecondary} />
              <Text style={styles.legalLinkText}>{t('profile.privacyPolicy')}</Text>
              <Ionicons name="open-outline" size={16} color={DarkTheme.textSecondary} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.legalLink}
              onPress={() => router.push('https://zaibaitech.github.io/asrar-mobile/terms.html' as any)}
            >
              <Ionicons name="document-text-outline" size={18} color={DarkTheme.textSecondary} />
              <Text style={styles.legalLinkText}>{t('profile.termsOfService')}</Text>
              <Ionicons name="open-outline" size={16} color={DarkTheme.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity style={styles.clearButton} onPress={handleClearProfile}>
          <Text style={styles.clearButtonText}>{t('profile.deleteAllMyData')}</Text>
        </TouchableOpacity>
      </ScrollView>

      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!deletingAccount) setDeleteModalVisible(false);
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t('profile.deleteAccountTitle')}</Text>
            <Text style={styles.modalText}>{t('profile.enterPassword')}</Text>

            <TextInput
              style={styles.modalInput}
              value={deletePassword}
              onChangeText={setDeletePassword}
              placeholder="••••••••"
              placeholderTextColor={DarkTheme.textSecondary}
              secureTextEntry
              autoCapitalize="none"
              editable={!deletingAccount}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalCancelButton]}
                onPress={() => setDeleteModalVisible(false)}
                disabled={deletingAccount}
              >
                <Text style={styles.modalCancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.modalButton, styles.modalDeleteButton]}
                onPress={confirmDeleteAccount}
                disabled={deletingAccount}
              >
                {deletingAccount ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.modalDeleteText}>{t('common.delete')}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Arabic Keyboard Modal */}
      <ArabicKeyboard
        visible={keyboardVisible}
        onClose={() => setKeyboardVisible(false)}
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
        onSpace={handleSpace}
      />
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
  labelWithButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  keyboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'rgba(99, 102, 241, 0.2)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  keyboardButtonText: {
    fontSize: 11,
    color: '#e0e7ff',
    marginLeft: 4,
    fontWeight: '500',
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
  deleteAccountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(220, 38, 38, 0.3)',
  },
  deleteAccountButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
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
  
  // Legal Links
  legalLinks: {
    marginTop: 16,
    gap: 8,
  },
  legalLink: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 8,
    gap: 8,
  },
  legalLinkText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    flex: 1,
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

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 14,
    color: DarkTheme.textSecondary,
    marginBottom: 12,
  },
  modalInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: DarkTheme.textPrimary,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
  },
  modalDeleteButton: {
    backgroundColor: '#dc2626',
  },
  modalCancelText: {
    color: DarkTheme.textPrimary,
    fontSize: 15,
    fontWeight: '600',
  },
  modalDeleteText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },

});
