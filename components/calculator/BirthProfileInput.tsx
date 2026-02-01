/**
 * Birth Profile Input Component
 * Collects birth data: date, time, place for spiritual birth profile calculation
 */

import DateTimePicker from '@react-native-community/datetimepicker';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Platform, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { getCurrentLocation, getTimezoneFromLocation, requestLocationPermission, searchLocations } from '../../services/LocationService';

export interface BirthProfileData {
  dateOfBirth: Date | null;
  timeOfBirth: Date | null;
  timeKnown: boolean;
  placeCity: string;
  placeLatitude: string;
  placeLongitude: string;
  placeTimezone: string;
  linkWithName: boolean;
  arabicName?: string;
  motherName?: string;
}

interface BirthProfileInputProps {
  data: BirthProfileData;
  onChange: (data: BirthProfileData) => void;
  onCalculate: () => void;
  isLoading: boolean;
}

export const BirthProfileInput: React.FC<BirthProfileInputProps> = ({
  data,
  onChange,
  onCalculate,
  isLoading,
}) => {
  const { t, tSafe } = useLanguage();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [citySearchResults, setCitySearchResults] = useState<any[]>([]);
  const [searchingCity, setSearchingCity] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);

  const canCalculate = () => {
    return (
      data.dateOfBirth !== null &&
      data.placeLatitude.trim() !== '' &&
      data.placeLongitude.trim() !== '' &&
      data.placeTimezone.trim() !== '' &&
      (!data.timeKnown || data.timeOfBirth !== null)
    );
  };

  // Debounced city search
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      const cityQuery = data.placeCity.trim();
      if (cityQuery.length >= 3) {
        setSearchingCity(true);
        try {
          const results = await searchLocations(cityQuery, { limit: 5 });
          setCitySearchResults(results);
          setShowCitySuggestions(results.length > 0);
        } catch (error) {
          console.error('City search error:', error);
          setCitySearchResults([]);
        } finally {
          setSearchingCity(false);
        }
      } else {
        setCitySearchResults([]);
        setShowCitySuggestions(false);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [data.placeCity]);

  const updateData = (updates: Partial<BirthProfileData>) => {
    onChange({ ...data, ...updates });
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      updateData({ dateOfBirth: selectedDate });
    }
  };

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(Platform.OS === 'ios');
    if (selectedTime) {
      updateData({ timeOfBirth: selectedTime });
    }
  };

  const handleDetectLocation = async () => {
    try {
      setLoadingLocation(true);
      
      // Request permission
      const permission = await requestLocationPermission();
      
      if (!permission.granted) {
        Alert.alert(
          tSafe('calculator.birth.locationPermission', 'Location Permission'),
          tSafe(
            'calculator.birth.locationPermissionMessage',
            'Location permission is required to auto-detect your birth location.'
          ),
          [{ text: tSafe('common.buttons.ok', 'OK') }]
        );
        return;
      }
      
      // Get location
      const { location, error } = await getCurrentLocation();
      
      if (error || !location) {
        Alert.alert(
          tSafe('calculator.birth.locationError', 'Location Error'),
          error || 'Failed to get location',
          [{ text: tSafe('common.buttons.ok', 'OK') }]
        );
        return;
      }
      
      // Get timezone
      const timezone = await getTimezoneFromLocation(location.latitude, location.longitude);
      
      // Update form with location data
      updateData({
        placeCity: location.label || '',
        placeLatitude: location.latitude.toFixed(6),
        placeLongitude: location.longitude.toFixed(6),
        placeTimezone: timezone,
      });
      
      Alert.alert(
        tSafe('calculator.birth.locationDetected', 'Location Detected'),
        `${location.label}\n${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
        [{ text: tSafe('common.buttons.ok', 'OK') }]
      );
      
    } catch (error) {
      Alert.alert(
        tSafe('calculator.birth.error', 'Error'),
        tSafe('calculator.birth.locationFailed', 'Failed to detect location'),
        [{ text: tSafe('common.buttons.ok', 'OK') }]
      );
    } finally {
      setLoadingLocation(false);
    }
  };

  const handleCitySelect = async (result: any) => {
    const timezone = await getTimezoneFromLocation(result.latitude, result.longitude);
    
    updateData({
      placeCity: result.label,
      placeLatitude: result.latitude.toFixed(6),
      placeLongitude: result.longitude.toFixed(6),
      placeTimezone: timezone,
    });
    
    setShowCitySuggestions(false);
    setCitySearchResults([]);
  };

  return (
    <View style={styles.container}>
      {/* Date of Birth */}
      <View style={styles.inputCard}>
        <View style={styles.inputHeader}>
          <Text style={styles.inputLabel}>📅 {t('calculator.birth.dateOfBirth')}</Text>
          <Text style={styles.requiredBadge}>{t('common.required')}</Text>
        </View>
        
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>
            {data.dateOfBirth 
              ? data.dateOfBirth.toLocaleDateString() 
              : t('calculator.birth.selectDate')}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={data.dateOfBirth || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        )}
      </View>

      {/* Time of Birth */}
      <View style={styles.inputCard}>
        <View style={styles.inputHeader}>
          <Text style={styles.inputLabel}>🕐 {t('calculator.birth.timeOfBirth')}</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{t('calculator.birth.timeKnown')}</Text>
            <Switch
              value={data.timeKnown}
              onValueChange={(value) => updateData({ timeKnown: value })}
              trackColor={{ false: '#334155', true: '#6366f1' }}
              thumbColor={data.timeKnown ? '#fff' : '#94a3b8'}
            />
          </View>
        </View>

        {data.timeKnown && (
          <>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowTimePicker(true)}
            >
              <Text style={styles.dateButtonText}>
                {data.timeOfBirth 
                  ? data.timeOfBirth.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : t('calculator.birth.selectTime')}
              </Text>
            </TouchableOpacity>

            {showTimePicker && (
              <DateTimePicker
                value={data.timeOfBirth || new Date()}
                mode="time"
                display="default"
                onChange={handleTimeChange}
              />
            )}
          </>
        )}

        {!data.timeKnown && (
          <Text style={styles.hintText}>
            {t('calculator.birth.timeUnknownNote')}
          </Text>
        )}
      </View>

      {/* Place of Birth */}
      <View style={styles.inputCard}>
        <View style={styles.inputHeader}>
          <Text style={styles.inputLabel}>📍 {t('calculator.birth.placeOfBirth')}</Text>
          <Text style={styles.requiredBadge}>{t('common.required')}</Text>
        </View>

        {/* Auto-Detect Location Button */}
        <TouchableOpacity
          style={styles.detectButton}
          onPress={handleDetectLocation}
          disabled={loadingLocation}
        >
          {loadingLocation ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.detectButtonText}>📍 {t('calculator.birth.detectLocation')}</Text>
          )}
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <Text style={styles.label}>{t('calculator.birth.city')}</Text>
          <View>
            <TextInput
              style={styles.textInput}
              value={data.placeCity}
              onChangeText={(text) => updateData({ placeCity: text })}
              placeholder={t('calculator.birth.cityPlaceholder')}
              placeholderTextColor="#64748b"
            />
            {searchingCity && (
              <View style={styles.searchingIndicator}>
                <ActivityIndicator size="small" color="#6366f1" />
              </View>
            )}
          </View>
          
          {/* City Suggestions Dropdown */}
          {showCitySuggestions && citySearchResults.length > 0 && (
            <View style={styles.suggestionsContainer}>
              {citySearchResults.map((item, index) => (
                <TouchableOpacity
                  key={`${item.latitude}-${item.longitude}-${index}`}
                  style={styles.suggestionItem}
                  onPress={() => handleCitySelect(item)}
                >
                  <Text style={styles.suggestionText}>📍 {item.label}</Text>
                  <Text style={styles.suggestionCoords}>
                    {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Show detected coordinates and timezone if available */}
        {data.placeLatitude && data.placeLongitude && data.placeTimezone && (
          <View style={styles.detectedInfo}>
            <Text style={styles.detectedLabel}>📍 {t('calculator.birth.locationDetected')}:</Text>
            <Text style={styles.detectedCoords}>
              {data.placeLatitude}, {data.placeLongitude}
            </Text>
            <Text style={styles.detectedTimezone}>
              ⏰ {data.placeTimezone}
            </Text>
          </View>
        )}
      </View>

      {/* Optional: Link with Name */}
      <View style={styles.inputCard}>
        <View style={styles.inputHeader}>
          <Text style={styles.inputLabel}>🔗 {t('calculator.birth.linkWithName')}</Text>
          <Switch
            value={data.linkWithName}
            onValueChange={(value) => updateData({ linkWithName: value })}
            trackColor={{ false: '#334155', true: '#6366f1' }}
            thumbColor={data.linkWithName ? '#fff' : '#94a3b8'}
          />
        </View>

        {data.linkWithName && (
          <>
            <View style={styles.inputWrapper}>
              <Text style={styles.label}>{t('calculator.birth.yourName')}</Text>
              <TextInput
                style={styles.arabicInput}
                value={data.arabicName || ''}
                onChangeText={(text) => updateData({ arabicName: text })}
                placeholder={tSafe('calculator.birth.namePlaceholder', 'محمد')}
                placeholderTextColor="#64748b"
                textAlign="right"
              />
            </View>

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>{t('calculator.birth.motherName')}</Text>
              <TextInput
                style={styles.arabicInput}
                value={data.motherName || ''}
                onChangeText={(text) => updateData({ motherName: text })}
                placeholder={tSafe('calculator.birth.motherNamePlaceholder', 'فاطمة')}
                placeholderTextColor="#64748b"
                textAlign="right"
              />
            </View>

            <Text style={styles.hintText}>
              {t('calculator.birth.nameResonanceNote')}
            </Text>
          </>
        )}
      </View>

      {/* Calculate Button */}
      <TouchableOpacity
        style={[styles.calculateWrapper, (!canCalculate() || isLoading) && styles.disabled]}
        onPress={onCalculate}
        disabled={!canCalculate() || isLoading}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={isLoading ? ['#64748b', '#475569'] : ['#6366f1', '#8b5cf6', '#a855f7']}
          style={styles.calculateButton}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        >
          <Text style={styles.calculateText}>
            {isLoading ? `⌛ ${t('calculator.actions.calculating')}` : `✨ ${t('calculator.actions.calculate')}`}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

const canCalculate = (data: BirthProfileData) => {
  return (
    data.dateOfBirth !== null &&
    data.placeLatitude.trim() !== '' &&
    data.placeLongitude.trim() !== '' &&
    data.placeTimezone.trim() !== '' &&
    (!data.timeKnown || data.timeOfBirth !== null)
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },

  inputCard: {
    backgroundColor: '#1e293b',
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: '#334155',
    gap: 12,
  },

  inputHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  inputLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#f1f5f9',
  },

  requiredBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: '#ef4444',
    backgroundColor: '#7f1d1d',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  switchLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#cbd5e1',
  },

  inputWrapper: {
    gap: 8,
    position: 'relative',
  },

  label: {
    color: '#cbd5e1',
    fontSize: 14,
    fontWeight: '500',
  },

  textInput: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    color: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#475569',
  },

  arabicInput: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 14,
    fontSize: 18,
    color: '#f1f5f9',
    borderWidth: 2,
    borderColor: '#475569',
  },

  dateButton: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#6366f1',
    alignItems: 'center',
  },

  dateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a5b4fc',
  },

  detectButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },

  detectButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },

  coordRow: {
    flexDirection: 'row',
    gap: 12,
  },

  coordInput: {
    flex: 1,
    gap: 8,
  },

  hintText: {
    fontSize: 12,
    color: '#64748b',
    fontStyle: 'italic',
    marginTop: 4,
  },

  // Calculate Button
  calculateWrapper: {
    marginTop: 8,
  },
  calculateButton: {
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 12,
    shadowColor: '#8b5cf6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
  },
  calculateText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  disabled: {
    opacity: 0.5,
  },

  // City Search Suggestions
  searchingIndicator: {
    position: 'absolute',
    right: 14,
    top: 14,
  },
  suggestionsContainer: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#6366f1',
    marginTop: 8,
    maxHeight: 200,
    overflow: 'hidden',
  },
  suggestionItem: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  suggestionText: {
    color: '#f1f5f9',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  suggestionCoords: {
    color: '#94a3b8',
    fontSize: 12,
  },

  // Detected Location Info
  detectedInfo: {
    backgroundColor: '#0f172a',
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#334155',
    gap: 6,
  },
  detectedLabel: {
    color: '#6366f1',
    fontSize: 13,
    fontWeight: '600',
  },
  detectedCoords: {
    color: '#cbd5e1',
    fontSize: 12,
  },
  detectedTimezone: {
    color: '#a5b4fc',
    fontSize: 13,
    fontWeight: '600',
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#334155',
    borderRadius: 6,
    overflow: 'hidden',
  },
});
