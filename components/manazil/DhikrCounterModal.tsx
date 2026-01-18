import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import type { DhikrPractice, ManazilLanguage } from '@/data/manazilPractices';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

function formatElapsed(seconds: number) {
  const s = Math.max(0, Math.floor(seconds));
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export function DhikrCounterModal(props: {
  visible: boolean;
  onClose: () => void;
  accent: string;
  practice: DhikrPractice;
  language: ManazilLanguage;
  count: number;
  elapsedSeconds: number;
  onChange: (next: { count: number; elapsedSeconds: number }) => void;
  onMarkCompleted?: () => void;
}) {
  const { visible, onClose, accent, practice, language } = props;
  const target = typeof practice.count === 'number' ? practice.count : null;

  const [running, setRunning] = React.useState(false);

  React.useEffect(() => {
    if (!visible) {
      setRunning(false);
    }
  }, [visible]);

  React.useEffect(() => {
    if (!visible || !running) return;
    const id = setInterval(() => {
      props.onChange({ count: props.count, elapsedSeconds: props.elapsedSeconds + 1 });
    }, 1000);
    return () => clearInterval(id);
  }, [visible, running, props]);

  const bump = async (delta: number) => {
    const next = Math.max(0, props.count + delta);
    props.onChange({ count: next, elapsedSeconds: props.elapsedSeconds });
    try {
      await Haptics.selectionAsync();
    } catch {}

    if (target !== null && next >= target && props.onMarkCompleted) {
      props.onMarkCompleted();
    }
  };

  const reset = async () => {
    props.onChange({ count: 0, elapsedSeconds: 0 });
    setRunning(false);
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
  };

  const title = practice.translation?.[language] ?? practice.translation?.en ?? 'Dhikr';

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { borderColor: `${accent}33` }]}>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text style={styles.title}>{title}</Text>
              {practice.bestTimes ? (
                <Text style={styles.subtitle}>{practice.bestTimes[language] ?? practice.bestTimes.en}</Text>
              ) : null}
            </View>

            <Pressable onPress={onClose} style={styles.iconBtn}>
              <Ionicons name="close" size={18} color={DarkTheme.textSecondary} />
            </Pressable>
          </View>

          <View style={[styles.arabicBox, { backgroundColor: `${accent}14`, borderColor: `${accent}22` }]}>
            <Text style={styles.arabic}>{practice.arabic}</Text>
            {practice.transliteration ? <Text style={styles.translit}>{practice.transliteration}</Text> : null}
          </View>

          <View style={styles.metrics}>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Count</Text>
              <Text style={styles.metricValue}>
                {props.count}
                {target !== null ? ` / ${target}` : ''}
              </Text>
            </View>
            <View style={styles.metric}>
              <Text style={styles.metricLabel}>Time</Text>
              <Text style={styles.metricValue}>{formatElapsed(props.elapsedSeconds)}</Text>
            </View>
          </View>

          <View style={styles.controls}>
            <Pressable onPress={() => bump(-1)} style={[styles.ctrlBtn, { borderColor: `${accent}33` }]}>
              <Ionicons name="remove" size={18} color={DarkTheme.textPrimary} />
            </Pressable>
            <Pressable
              onPress={() => bump(1)}
              onLongPress={() => bump(10)}
              style={[styles.ctrlBtnPrimary, { backgroundColor: `${accent}22`, borderColor: `${accent}55` }]}
            >
              <Ionicons name="add" size={20} color={DarkTheme.textPrimary} />
            </Pressable>
            <Pressable onPress={reset} style={[styles.ctrlBtn, { borderColor: `${accent}33` }]}>
              <Ionicons name="refresh" size={18} color={DarkTheme.textPrimary} />
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Pressable
              onPress={() => setRunning((r) => !r)}
              style={[styles.footerBtn, { borderColor: `${accent}33` }]}
            >
              <Ionicons name={running ? 'pause' : 'play'} size={16} color={DarkTheme.textSecondary} />
              <Text style={styles.footerBtnText}>{running ? 'Pause timer' : 'Start timer'}</Text>
            </Pressable>

            {target !== null ? (
              <Pressable
                onPress={() => props.onMarkCompleted?.()}
                style={[styles.footerBtn, { borderColor: `${accent}33` }]}
              >
                <Ionicons name="checkbox" size={16} color={DarkTheme.textSecondary} />
                <Text style={styles.footerBtnText}>Mark complete</Text>
              </Pressable>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    padding: Spacing.lg,
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    backgroundColor: DarkTheme.cardBackground,
    padding: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: Typography.h3,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  subtitle: {
    marginTop: 2,
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: DarkTheme.cardBackgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  arabicBox: {
    marginTop: Spacing.md,
    borderRadius: 14,
    borderWidth: 1,
    padding: Spacing.md,
  },
  arabic: {
    fontSize: 22,
    color: DarkTheme.textPrimary,
    textAlign: 'right',
    lineHeight: 34,
  },
  translit: {
    marginTop: 6,
    fontSize: Typography.body,
    color: DarkTheme.textSecondary,
  },
  metrics: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  metric: {
    flex: 1,
    padding: Spacing.sm,
    borderRadius: 12,
    backgroundColor: DarkTheme.cardBackgroundAlt,
  },
  metricLabel: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
  },
  metricValue: {
    marginTop: 4,
    fontSize: Typography.h2,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
  ctrlBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 1,
    backgroundColor: DarkTheme.cardBackgroundAlt,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctrlBtnPrimary: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    marginTop: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  footerBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: DarkTheme.cardBackgroundAlt,
  },
  footerBtnText: {
    fontSize: Typography.label,
    color: DarkTheme.textSecondary,
  },
});
