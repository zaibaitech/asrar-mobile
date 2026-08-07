/**
 * AdabDisclaimer — ported from asrar.app's AdabDisclaimer.tsx.
 * Cross-device profile sync (readProfileAck/buildProfileAckUpdate) is
 * intentionally NOT ported — local-only ack via AsyncStorage, per plan
 * decision. Amber-themed (distinct from the rest of the screen's accent),
 * bottom-sheet-style modal. Shown automatically on first unacked open;
 * reopenable anytime via the header ⓘ icon (forceOpen=true), which
 * becomes a plain "Close" instead of "I understand" once already acked.
 */

import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from 'react-native';
import { ikhtiyaratCopy, disclaimerArabic, howScoringWorksArabic, UiLang } from '@/services/ikhtiyaratEngine/copy';
import { readDisclaimerAck, writeDisclaimerAck } from '@/services/ikhtiyaratStorage';

export interface AdabDisclaimerProps {
  language: UiLang;
  /** Force the modal open regardless of ack state — used by the header's ⓘ "About/Adab" link. */
  forceOpen: boolean;
  onRequestClose: () => void;
}

export default function AdabDisclaimer({ language, forceOpen, onRequestClose }: AdabDisclaimerProps) {
  const c = ikhtiyaratCopy[language];
  const isDark = useColorScheme() === 'dark';

  // null while we haven't yet checked ack state (avoids a first-paint flash).
  const [acked, setAcked] = useState<boolean | null>(null);

  useEffect(() => {
    readDisclaimerAck().then(setAcked);
  }, []);

  const handleAccept = async () => {
    await writeDisclaimerAck();
    setAcked(true);
    onRequestClose();
  };

  const showModal = forceOpen || acked === false;

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
          style={[
            styles.card,
            {
              backgroundColor: isDark ? '#1C1917' : '#FFFBEB',
              borderColor: isDark ? '#92400E80' : AMBER_BORDER,
            },
          ]}
          onPress={() => {}}
        >
          <ScrollView contentContainerStyle={styles.cardContent}>
            <Text style={[styles.title, { color: isDark ? '#FCD34D' : AMBER_TITLE }]}>{c.disclaimerTitle}</Text>
            <Text style={[styles.body, { color: isDark ? '#FDE68ACC' : AMBER_BODY }]}>{c.disclaimer}</Text>
            <Text style={[styles.body, styles.arabicText, { color: isDark ? '#FDE68ACC' : AMBER_BODY }]}>
              {disclaimerArabic}
            </Text>
            <View style={[styles.divider, { backgroundColor: isDark ? '#92400E80' : AMBER_BORDER }]} />
            <Text style={[styles.smallBody, { color: isDark ? '#FCD34DB3' : AMBER_SMALL }]}>{c.howScoringWorks}</Text>
            <Text style={[styles.smallBody, styles.arabicText, { color: isDark ? '#FCD34DB3' : AMBER_SMALL }]}>
              {howScoringWorksArabic}
            </Text>

            <Pressable
              style={styles.button}
              onPress={forceOpen && acked ? onRequestClose : handleAccept}
            >
              <Text style={styles.buttonText}>{forceOpen && acked ? c.close : c.disclaimerAccept}</Text>
            </Pressable>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const AMBER_BORDER = '#FCD34D80';
const AMBER_TITLE = '#78350F';
const AMBER_BODY = '#92400E';
const AMBER_SMALL = '#B45309CC';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  card: {
    maxHeight: '85%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  cardContent: {
    padding: 20,
    gap: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
  },
  body: {
    fontSize: 14,
    lineHeight: 21,
  },
  arabicText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  divider: {
    height: 1,
    marginVertical: 4,
  },
  smallBody: {
    fontSize: 12,
    lineHeight: 18,
  },
  button: {
    marginTop: 10,
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
