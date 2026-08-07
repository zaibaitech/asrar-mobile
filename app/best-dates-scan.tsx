/**
 * Best Dates (Ikhtiyārāt) — Find Best Dates (range scan)
 * ==========================================================
 * Ported from asrar.app's ScanDatesView.tsx. Scans a date range (capped
 * at 12 months) for the selected election type's quality (marriage,
 * travel, business, medical, home, or education): top-5 list +
 * month-by-month calendar heat map.
 */

import ResponsiveAppHeader from '@/components/AppHeader';
import CalendarHeatmap from '@/components/best-dates/CalendarHeatmap';
import DetailSheet from '@/components/best-dates/DetailSheet';
import ElectionTypeDropdown from '@/components/best-dates/ElectionTypeDropdown';
import TierBadge from '@/components/best-dates/TierBadge';
import LocationAutocomplete from '@/components/LocationAutocomplete';
import Colors from '@/constants/Colors';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  businessElectionConfig,
  educationElectionConfig,
  ElectionResult,
  ElectionType,
  evaluateDateRange,
  homeElectionConfig,
  marriageElectionConfig,
  medicalElectionConfig,
  travelElectionConfig,
} from '@/services/ikhtiyaratEngine';
import { ikhtiyaratCopy, UiLang } from '@/services/ikhtiyaratEngine/copy';
import { getBestLocation } from '@/services/LocationCacheService';
import { getTimezoneFromLocation, LocationSearchResult } from '@/services/LocationService';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';

const CONFIG_BY_ELECTION_TYPE: Record<ElectionType, typeof marriageElectionConfig> = {
  marriage: marriageElectionConfig,
  travel: travelElectionConfig,
  business: businessElectionConfig,
  medical: medicalElectionConfig,
  home: homeElectionConfig,
  education: educationElectionConfig,
};

const ELECTION_TYPES: ElectionType[] = ['marriage', 'travel', 'business', 'medical', 'home', 'education'];

const MAX_SCAN_MONTHS = 12;

function toLocalDateString(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addMonths(date: Date, months: number): Date {
  const copy = new Date(date);
  copy.setMonth(copy.getMonth() + months);
  return copy;
}

function toUiLang(language: 'en' | 'fr' | 'ar'): UiLang {
  return language;
}

export default function BestDatesScanScreen() {
  const { language: appLanguage, setLanguage } = useLanguage();
  const language = toUiLang(appLanguage);
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const c = ikhtiyaratCopy[language];
  const params = useLocalSearchParams<{ electionType?: string }>();

  const [electionType, setElectionType] = useState<ElectionType>(
    ELECTION_TYPES.includes(params.electionType as ElectionType) ? (params.electionType as ElectionType) : 'marriage'
  );
  const config = CONFIG_BY_ELECTION_TYPE[electionType];
  const ELECTION_TYPE_OPTIONS = [
    { value: 'marriage' as ElectionType, label: c.electionTypeMarriage },
    { value: 'travel' as ElectionType, label: c.electionTypeTravel },
    { value: 'business' as ElectionType, label: c.electionTypeBusiness },
    { value: 'medical' as ElectionType, label: c.electionTypeMedical },
    { value: 'home' as ElectionType, label: c.electionTypeHome },
    { value: 'education' as ElectionType, label: c.electionTypeEducation },
  ];

  const today = new Date();
  const [startStr, setStartStr] = useState(toLocalDateString(today));
  const [endStr, setEndStr] = useState(toLocalDateString(addMonths(today, 3)));
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [rangeError, setRangeError] = useState<string | null>(null);

  const [locationLabel, setLocationLabel] = useState('');
  const [location, setLocation] = useState<{ latitude: number; longitude: number; tz: string } | null>(null);
  const [locatingCurrent, setLocatingCurrent] = useState(false);

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<ElectionResult[]>([]);
  const [selectedDay, setSelectedDay] = useState<ElectionResult | null>(null);

  const handleUseCurrentLocation = async () => {
    setLocatingCurrent(true);
    try {
      const best = await getBestLocation({ allowPrompt: false });
      if (!best) return;
      const tz = await getTimezoneFromLocation(best.latitude, best.longitude);
      setLocation({ latitude: best.latitude, longitude: best.longitude, tz });
      setLocationLabel(c.useMyLocation);
    } finally {
      setLocatingCurrent(false);
    }
  };

  const handleSelectLocation = async (selected: LocationSearchResult) => {
    setLocationLabel(selected.label);
    const tz = await getTimezoneFromLocation(selected.latitude, selected.longitude);
    setLocation({ latitude: selected.latitude, longitude: selected.longitude, tz });
  };

  const handleScan = () => {
    if (!location) {
      setRangeError(language === 'fr' ? 'Veuillez choisir un lieu.' : language === 'ar' ? 'يرجى اختيار موقع.' : 'Please choose a location.');
      return;
    }

    const start = new Date(`${startStr}T00:00:00`);
    const end = new Date(`${endStr}T00:00:00`);

    if (end < start) {
      setRangeError(
        language === 'fr'
          ? 'La date de fin doit suivre la date de début.'
          : language === 'ar'
          ? 'يجب أن يكون تاريخ الانتهاء بعد تاريخ البدء.'
          : 'End date must be after start date.'
      );
      return;
    }
    if (end > addMonths(start, MAX_SCAN_MONTHS)) {
      setRangeError(
        language === 'fr'
          ? 'La période maximale est de 12 mois.'
          : language === 'ar'
          ? 'الحد الأقصى للنطاق 12 شهراً.'
          : 'Maximum range is 12 months.'
      );
      return;
    }
    setRangeError(null);
    setLoading(true);

    setTimeout(() => {
      const scanResults = evaluateDateRange(start, end, location.latitude, location.longitude, location.tz, electionType, config);
      setResults(scanResults);
      setLoading(false);
    }, 0);
  };

  const topFive = [...results]
    .filter((r) => !r.hasHardFail)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const locale = language === 'fr' ? 'fr-FR' : language === 'ar' ? 'ar-SA' : 'en-US';

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <ResponsiveAppHeader
          currentLanguage={appLanguage === 'en' ? 'EN' : appLanguage === 'fr' ? 'FR' : 'AR'}
          onLanguageChange={(lang) => setLanguage(lang.toLowerCase() as 'en' | 'fr' | 'ar')}
          onProfilePress={() => router.push('/profile')}
          onMenuPress={() => router.back()}
        />

        <View style={styles.infoBar}>
          <Text style={[styles.screenTitle, { color: colors.text }]}>{c.tabScan}</Text>
        </View>

        <View style={styles.modeTabRow}>
          <TouchableOpacity
            style={[styles.modeTab, { borderColor: colors.border }]}
            onPress={() =>
              router.replace({
                pathname: '/best-dates-check',
                params: { electionType },
              })
            }
          >
            <Text style={[styles.modeTabText, { color: colors.textSecondary }]}>{c.tabCheck}</Text>
          </TouchableOpacity>
          <View style={[styles.modeTab, styles.modeTabActive, { borderColor: '#059669' }]}>
            <Text style={[styles.modeTabText, { color: '#059669' }]}>{c.tabScan}</Text>
          </View>
        </View>

        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <ElectionTypeDropdown
            value={electionType}
            options={ELECTION_TYPE_OPTIONS}
            onChange={setElectionType}
            label={c.electionTypeLabel}
          />

          <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.rangeRow}>
              <View style={styles.rangeCol}>
                <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>{c.scanRangeStart}</Text>
                <TouchableOpacity style={[styles.dateButton, { borderColor: colors.border }]} onPress={() => setShowStartPicker(true)}>
                  <Text style={[styles.dateButtonText, { color: colors.text }]}>{startStr}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.rangeCol}>
                <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>{c.scanRangeEnd}</Text>
                <TouchableOpacity style={[styles.dateButton, { borderColor: colors.border }]} onPress={() => setShowEndPicker(true)}>
                  <Text style={[styles.dateButtonText, { color: colors.text }]}>{endStr}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {showStartPicker && (
              <DateTimePicker
                value={new Date(startStr + 'T12:00:00')}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, date) => {
                  if (Platform.OS === 'android') setShowStartPicker(false);
                  if (date) setStartStr(toLocalDateString(date));
                }}
              />
            )}
            {showEndPicker && (
              <DateTimePicker
                value={new Date(endStr + 'T12:00:00')}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_, date) => {
                  if (Platform.OS === 'android') setShowEndPicker(false);
                  if (date) setEndStr(toLocalDateString(date));
                }}
              />
            )}
            {Platform.OS === 'ios' && (showStartPicker || showEndPicker) && (
              <TouchableOpacity onPress={() => { setShowStartPicker(false); setShowEndPicker(false); }}>
                <Text style={[styles.doneText, { color: colors.primary }]}>Done</Text>
              </TouchableOpacity>
            )}

            {rangeError && <Text style={styles.rangeError}>{rangeError}</Text>}

            <Text style={[styles.cardLabel, { color: colors.textSecondary, marginTop: 12 }]}>{c.locationLabel}</Text>
            <LocationAutocomplete value={locationLabel} onChange={setLocationLabel} onSelect={handleSelectLocation} />
            <TouchableOpacity style={styles.currentLocationRow} onPress={handleUseCurrentLocation} disabled={locatingCurrent}>
              {locatingCurrent ? (
                <ActivityIndicator size="small" color={colors.primary} />
              ) : (
                <Ionicons name="locate" size={18} color={colors.primary} />
              )}
              <Text style={[styles.currentLocationText, { color: colors.primary }]}>{c.useMyLocation}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.scanButton, { backgroundColor: '#059669' }]} onPress={handleScan} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.scanButtonText}>{c.scanButton}</Text>}
            </TouchableOpacity>
          </View>

          {topFive.length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>{c.topFive}</Text>
              {topFive.map((r) => (
                <TouchableOpacity
                  key={r.date.toISOString()}
                  style={[styles.top5Row, { borderColor: colors.border }]}
                  onPress={() => setSelectedDay(r)}
                >
                  <Text style={[styles.top5Date, { color: colors.text }]}>
                    {r.date.toLocaleDateString(locale, { weekday: 'short', month: 'short', day: 'numeric' })}
                  </Text>
                  <TierBadge tierInfo={r.tierInfo} language={language} score={r.score} />
                </TouchableOpacity>
              ))}
            </View>
          )}

          {results.length > 0 && (
            <View style={[styles.card, { backgroundColor: colors.card }]}>
              <CalendarHeatmap results={results} language={language} onSelectDay={setSelectedDay} />
            </View>
          )}
        </ScrollView>

        {selectedDay && (
          <DetailSheet result={selectedDay} language={language} onClose={() => setSelectedDay(null)} />
        )}
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  infoBar: { paddingHorizontal: 20, paddingTop: 12 },
  screenTitle: { fontSize: 22, fontWeight: '800' },
  modeTabRow: { flexDirection: 'row', gap: 10, paddingHorizontal: 20, paddingTop: 14 },
  modeTab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  modeTabActive: { backgroundColor: '#05966915' },
  modeTabText: { fontSize: 14, fontWeight: '700' },
  scrollView: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 60, gap: 16 },
  card: { borderRadius: 16, padding: 16 },
  cardLabel: { fontSize: 12, fontWeight: '600', marginBottom: 6, textTransform: 'uppercase' },
  rangeRow: { flexDirection: 'row', gap: 12 },
  rangeCol: { flex: 1 },
  dateButton: { borderWidth: 1, borderRadius: 10, paddingVertical: 12, paddingHorizontal: 14, alignItems: 'center' },
  dateButtonText: { fontSize: 14, fontWeight: '600' },
  doneText: { textAlign: 'right', marginTop: 8, fontWeight: '700' },
  rangeError: { color: '#EF4444', fontSize: 12, marginTop: 8 },
  currentLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 },
  currentLocationText: { fontSize: 13, fontWeight: '600' },
  scanButton: { borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 14 },
  scanButtonText: { color: '#fff', fontSize: 15, fontWeight: '800' },
  sectionLabel: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  top5Row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 8 },
  top5Date: { fontSize: 14, fontWeight: '600' },
});
