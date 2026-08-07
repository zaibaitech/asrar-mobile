/**
 * DetailSheet — ported from asrar.app's DetailSheet.tsx, as a RN Modal
 * (bottom-sheet style). Used by the scan screen when a calendar day is
 * tapped. Content mirrors the check screen's result card minus the input
 * form and share button.
 */

import React, { useState, useEffect } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '@/constants/Colors';
import { ElectionResult, getDayDegradationNote, getMedicalBadges, getSunnahBadges, getTravelBadges, gregorianToHijri } from '@/services/ikhtiyaratEngine';
import { getPlanetPosition } from '@/services/ikhtiyaratEngine/ephemeris';
import { getUrfBadgeForMonth } from '@/services/ikhtiyaratEngine/urf';
import { ikhtiyaratCopy, UiLang } from '@/services/ikhtiyaratEngine/copy';
import { readSimpleMode, writeSimpleMode } from '@/services/ikhtiyaratStorage';
import TierBadge from './TierBadge';
import RuleRow from './RuleRow';
import BadgePills from './BadgePills';
import UrfBadgeView from './UrfBadge';
import SimpleModeToggle from './SimpleModeToggle';

export interface DetailSheetProps {
  result: ElectionResult;
  language: UiLang;
  onClose: () => void;
}

export default function DetailSheet({ result, language, onClose }: DetailSheetProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const c = ikhtiyaratCopy[language];
  const hijri = gregorianToHijri(result.date);

  const sunnahBadges = result.electionType === 'marriage' ? getSunnahBadges(result.date) : [];
  const urfBadge = result.electionType === 'marriage' ? getUrfBadgeForMonth(hijri.month) : null;
  const travelBadges = result.electionType === 'travel' ? getTravelBadges(result) : [];
  const medicalBadges =
    result.electionType === 'medical'
      ? getMedicalBadges(result, getPlanetPosition('Moon', result.bestWindow.time).sign)
      : [];
  const degradationNote = getDayDegradationNote(result, language);

  const [simpleMode, setSimpleModeState] = useState(true);
  useEffect(() => {
    readSimpleMode().then(setSimpleModeState);
  }, []);
  const setSimpleMode = (value: boolean) => {
    setSimpleModeState(value);
    writeSimpleMode(value);
  };

  const locale = language === 'fr' ? 'fr-FR' : language === 'ar' ? 'ar-SA' : 'en-US';

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={[styles.sheet, { backgroundColor: colors.background }]} onPress={() => {}}>
          <View style={[styles.header, { borderBottomColor: colors.border }]}>
            <View style={styles.headerText}>
              <Text style={[styles.dateTitle, { color: colors.text }]}>
                {result.date.toLocaleDateString(locale, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </Text>
              <Text style={[styles.hijriSubtitle, { color: colors.textSecondary }]}>
                {c.hijriDate}: {hijri.day} {hijri.monthName[language === 'ar' ? 'ar' : language]} ({hijri.monthName.wolof}) {hijri.year} {c.hijriEra}
              </Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeButton} accessibilityLabel={c.close}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.body}>
            <View>
              <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>{c.starsLabel}</Text>
              <TierBadge tierInfo={result.tierInfo} language={language} score={result.score} />
            </View>

            {sunnahBadges.length > 0 && (
              <View>
                <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>{c.sunnahBadge}</Text>
                <BadgePills badges={sunnahBadges} language={language} />
              </View>
            )}

            {urfBadge && (
              <View>
                <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>{c.urfLabel}</Text>
                <UrfBadgeView badge={urfBadge} language={language} />
              </View>
            )}

            {travelBadges.length > 0 && (
              <View>
                <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>{c.sunnahBadge}</Text>
                <BadgePills badges={travelBadges} language={language} />
              </View>
            )}
            {medicalBadges.length > 0 && (
              <View>
                <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>{c.sunnahBadge}</Text>
                <BadgePills badges={medicalBadges} language={language} />
              </View>
            )}

            <View style={[styles.windowCard, { borderColor: colors.border }]}>
              <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>
                {result.isLeastAfflicted ? c.leastAfflictedWindow : c.bestWindow}
              </Text>
              <Text style={[styles.windowTime, { color: colors.text }]}>
                {result.bestWindow.time.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}
              </Text>
              {degradationNote && <Text style={styles.degradationNote}>{degradationNote}</Text>}
            </View>

            <View>
              <View style={styles.ruleHeaderRow}>
                <Text style={[styles.sectionLabel, { color: colors.textTertiary }]}>{c.ruleBreakdown}</Text>
                <SimpleModeToggle simple={simpleMode} onChange={setSimpleMode} language={language} />
              </View>
              <View style={[styles.rulesCard, { borderColor: colors.border }]}>
                {result.rules.map((rule) => (
                  <RuleRow
                    key={rule.id}
                    rule={rule}
                    language={language}
                    simple={simpleMode}
                    textColor={colors.text}
                    detailColor={colors.textSecondary}
                    borderColor={colors.border}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '85%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerText: { flex: 1 },
  dateTitle: { fontSize: 15, fontWeight: '700' },
  hijriSubtitle: { fontSize: 12, marginTop: 2 },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    padding: 20,
    gap: 16,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  windowCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  windowTime: { fontSize: 15, fontWeight: '600' },
  degradationNote: { fontSize: 12, color: '#D97706', marginTop: 8 },
  ruleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  rulesCard: {
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 12,
  },
});
