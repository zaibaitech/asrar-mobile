/**
 * AdabDisclaimer — ported from asrar.app's AdabDisclaimer.tsx.
 * Cross-device profile sync (readProfileAck/buildProfileAckUpdate) is
 * intentionally NOT ported — local-only ack via AsyncStorage, per plan
 * decision. Amber-themed (distinct from the rest of the screen's accent),
 * bottom-sheet-style modal. Shown automatically on first unacked open;
 * reopenable anytime via the header ⓘ icon (forceOpen=true), which
 * becomes a plain "Close" instead of "I understand" once already acked.
 *
 * Layout: capped at 80% of viewport height, scrollable body, footer with
 * the action button pinned outside the ScrollView so it's always reachable
 * above the safe area — the sheet must never push the button off-screen
 * regardless of content length or device notch/gesture bar.
 */

import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { ikhtiyaratCopy, disclaimerArabic, howScoringWorksArabic, UiLang } from '@/services/ikhtiyaratEngine/copy';
import { readDisclaimerAck, writeDisclaimerAck } from '@/services/ikhtiyaratStorage';

export interface AdabDisclaimerProps {
  language: UiLang;
  /** Force the modal open regardless of ack state — used by the header's ⓘ "About/Adab" link. */
  forceOpen: boolean;
  onRequestClose: () => void;
}

export default function AdabDisclaimer({ language, forceOpen, onRequestClose }: Readonly<AdabDisclaimerProps>) {
  const c = ikhtiyaratCopy[language];
  const insets = useSafeAreaInsets();
  const { height: windowHeight } = useWindowDimensions();

  // null while we haven't yet checked ack state (avoids a first-paint flash).
  const [acked, setAcked] = useState<boolean | null>(null);
  const [scoringExpanded, setScoringExpanded] = useState(false);

  useEffect(() => {
    readDisclaimerAck().then(setAcked);
  }, []);

  const handleAccept = async () => {
    await writeDisclaimerAck();
    setAcked(true);
    onRequestClose();
  };

  const showModal = forceOpen || acked === false;
  const isCloseOnly = forceOpen && acked === true;

  return (
    <Modal
      visible={showModal}
      transparent
      animationType="fade"
      onRequestClose={() => {
        if (forceOpen) onRequestClose();
      }}
    >
      <Pressable
        style={styles.overlay}
        onPress={forceOpen ? onRequestClose : undefined}
      >
        <Pressable
          style={[styles.card, { maxHeight: windowHeight * 0.8 }]}
          onPress={() => {}}
        >
          <ScrollView style={styles.scrollArea} contentContainerStyle={styles.cardContent}>
            <Text style={styles.title}>{c.disclaimerTitle}</Text>
            <Text style={styles.body}>{c.disclaimer}</Text>
            <Text style={[styles.body, styles.arabicText]}>{disclaimerArabic}</Text>

            <View style={styles.divider} />

            <Pressable
              style={styles.expandToggle}
              onPress={() => setScoringExpanded((v) => !v)}
              accessibilityRole="button"
            >
              <Text style={styles.expandToggleText}>
                {scoringExpanded ? c.howScoringWorksCollapse : c.howScoringWorksExpand}
              </Text>
              <Ionicons
                name={scoringExpanded ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#FCD34DB3"
              />
            </Pressable>

            {scoringExpanded && (
              <View style={styles.expandBody}>
                <Text style={styles.smallBody}>{c.howScoringWorks}</Text>
                <Text style={[styles.smallBody, styles.arabicText]}>{howScoringWorksArabic}</Text>
              </View>
            )}
          </ScrollView>

          <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 12) }]}>
            <Pressable
              style={styles.button}
              onPress={isCloseOnly ? onRequestClose : handleAccept}
            >
              <Text style={styles.buttonText}>{isCloseOnly ? c.close : c.disclaimerAccept}</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const AMBER_BORDER = '#92400E80';
const AMBER_TITLE = '#FCD34D';
const AMBER_BODY = '#FDE68ACC';
const AMBER_SMALL = '#FCD34DB3';
const AMBER_CARD_BG = '#1C1917';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  card: {
    backgroundColor: AMBER_CARD_BG,
    borderColor: AMBER_BORDER,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  scrollArea: {
    flexShrink: 1,
  },
  cardContent: {
    padding: 20,
    gap: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: AMBER_TITLE,
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
    color: AMBER_BODY,
  },
  arabicText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  divider: {
    height: 1,
    marginVertical: 4,
    backgroundColor: AMBER_BORDER,
  },
  expandToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  expandToggleText: {
    fontSize: 12,
    fontWeight: '700',
    color: AMBER_SMALL,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  expandBody: {
    gap: 10,
  },
  smallBody: {
    fontSize: 12,
    lineHeight: 18,
    color: AMBER_SMALL,
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: AMBER_BORDER,
    backgroundColor: AMBER_CARD_BG,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 14,
    backgroundColor: '#D97706',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
