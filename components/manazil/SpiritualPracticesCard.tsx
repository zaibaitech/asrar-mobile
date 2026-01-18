import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import type { AngelInvocation, DhikrPractice, ManazilLanguage, ManzilPracticePack, QuranVerse, WafqGuidance } from '@/data/manazilPractices';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import React from 'react';
import { Pressable, Share, StyleSheet, Text, View } from 'react-native';
import { DhikrCounterModal } from './DhikrCounterModal';
import { ExpandableCard } from './ExpandableCard';

type TabKey = 'adhkar' | 'angels' | 'quran' | 'wafq';

async function shareMessage(message: string) {
  try {
    await Share.share({ message });
  } catch {
    // ignore
  }
}

function TabButton(props: { label: string; active: boolean; onPress: () => void; accent: string }) {
  return (
    <Pressable
      onPress={props.onPress}
      style={[styles.tabButton, props.active && { borderColor: props.accent, backgroundColor: `${props.accent}18` }]}
    >
      <Text style={[styles.tabText, props.active && { color: DarkTheme.textPrimary }]}>{props.label}</Text>
    </Pressable>
  );
}

function RowAction(props: { icon: React.ComponentProps<typeof Ionicons>['name']; onPress?: () => void; disabled?: boolean }) {
  return (
    <Pressable
      onPress={props.disabled ? undefined : props.onPress}
      style={[styles.actionBtn, props.disabled && { opacity: 0.35 }]}
    >
      <Ionicons name={props.icon} size={18} color={DarkTheme.textSecondary} />
    </Pressable>
  );
}

export function SpiritualPracticesCard(props: {
  accent: string;
  pack: ManzilPracticePack;
  advancedMode: boolean;
  language?: ManazilLanguage;
  tracking: {
    isCompleted: (id: string) => boolean;
    toggleCompleted: (id: string) => Promise<void>;
    isFavorite: (id: string) => boolean;
    toggleFavorite: (id: string) => Promise<void>;
    progressFor: (ids: string[]) => { done: number; total: number };
    getDhikrProgress: (id: string) => { count: number; elapsedSeconds: number };
    setDhikrProgress: (id: string, next: { count: number; elapsedSeconds: number }) => Promise<void>;
  };
}) {
  const { accent, pack, tracking, advancedMode } = props;
  const language: ManazilLanguage = props.language ?? 'en';
  const [tab, setTab] = React.useState<TabKey>('adhkar');
  const [playingId, setPlayingId] = React.useState<string | null>(null);
  const [activeDhikr, setActiveDhikr] = React.useState<DhikrPractice | null>(null);

  const ids = React.useMemo(() => {
    const base: string[] = [];
    for (const p of pack.adhkar) base.push(p.id);
    for (const a of pack.angels) base.push(a.id);
    for (const q of pack.quranVerses) base.push(q.id);
    if (advancedMode && pack.wafq) for (const w of pack.wafq) base.push(w.id);
    return base;
  }, [pack, advancedMode]);

  const progress = tracking.progressFor(ids);

  const play = async (practice: DhikrPractice) => {
    // Audio assets are optional; until mapped, button stays disabled.
    // This keeps the UI premium without breaking offline.
    if (!practice.audioAssetKey) {
      // Fallback: TTS for transliteration/translation (placeholder “pronunciation”).
      const say = practice.transliteration || practice.translation?.[language] || practice.translation?.en;
      if (!say) return;
      try {
        setPlayingId(practice.id);
        Speech.stop();
        Speech.speak(say, {
          language: language === 'ar' ? 'ar' : language === 'fr' ? 'fr' : 'en',
          rate: 0.92,
          onDone: () => setPlayingId(null),
          onStopped: () => setPlayingId(null),
          onError: () => setPlayingId(null),
        });
      } catch {
        setPlayingId(null);
      }
      return;
    }

    try {
      setPlayingId(practice.id);
      const { sound } = await Audio.Sound.createAsync(
        // NOTE: no audio bundled yet
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (null as any),
        { shouldPlay: true }
      );
      await sound.playAsync();
      sound.setOnPlaybackStatusUpdate((status) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        if ((status as any)?.didJustFinish) {
          void sound.unloadAsync();
          setPlayingId(null);
        }
      });
    } catch {
      setPlayingId(null);
    }
  };

  const sharePractice = async (practice: DhikrPractice) => {
    const bestTime = practice.bestTimes ? (practice.bestTimes[language] ?? practice.bestTimes.en) : undefined;
    const lines = [
      'Manāzil Practice',
      '',
      practice.arabic,
      practice.transliteration ? practice.transliteration : '',
      '',
      typeof practice.count === 'number' ? `Count: ${practice.count}` : '',
      bestTime ? `Best time: ${bestTime}` : '',
      '',
      'Note: For educational/spiritual use. Verify with qualified guidance if needed.',
    ].filter(Boolean);

    try {
      await Share.share({ message: lines.join('\n') });
    } catch {
      // ignore
    }
  };

  const activeProgress = activeDhikr ? tracking.getDhikrProgress(activeDhikr.id) : { count: 0, elapsedSeconds: 0 };

  return (
    <ExpandableCard
      title="Spiritual Practices"
      icon="sparkles-outline"
      accentColor={accent}
      rightMetaText={progress.total > 0 ? `${progress.done}/${progress.total}` : undefined}
      initiallyExpanded
    >
      {pack.disclaimer ? <Text style={styles.disclaimer}>{pack.disclaimer[language] ?? pack.disclaimer.en}</Text> : null}

      <View style={styles.tabs}>
        <TabButton label="Adhkār" active={tab === 'adhkar'} onPress={() => setTab('adhkar')} accent={accent} />
        <TabButton label="Angels" active={tab === 'angels'} onPress={() => setTab('angels')} accent={accent} />
        <TabButton label="Qur’an" active={tab === 'quran'} onPress={() => setTab('quran')} accent={accent} />
        {advancedMode ? (
          <TabButton label="Wafq" active={tab === 'wafq'} onPress={() => setTab('wafq')} accent={accent} />
        ) : null}
      </View>

      {tab === 'adhkar' ? (
        <View style={styles.list}>
          {pack.adhkar.map((p) => (
            <PracticeRow
              key={p.id}
              accent={accent}
              titleArabic={p.arabic}
              subtitle={p.transliteration}
              detail={p.bestTimes ? (p.bestTimes[language] ?? p.bestTimes.en) : undefined}
              count={p.count ?? undefined}
              counterProgress={tracking.getDhikrProgress(p.id)}
              completed={tracking.isCompleted(p.id)}
              favorited={tracking.isFavorite(p.id)}
              onToggleCompleted={() => tracking.toggleCompleted(p.id)}
              onToggleFavorite={() => tracking.toggleFavorite(p.id)}
              onPlay={() => play(p)}
              isPlaying={playingId === p.id}
              onOpenCounter={() => setActiveDhikr(p)}
              onShare={() => sharePractice(p)}
            />
          ))}
        </View>
      ) : null}

      {tab === 'angels' ? (
        <View style={styles.list}>
          {pack.angels.length === 0 ? (
            <Text style={styles.empty}>No angelic invocations in this pack yet.</Text>
          ) : (
            pack.angels.map((a) => <AngelRow key={a.id} item={a} language={language} />)
          )}
        </View>
      ) : null}

      {tab === 'quran' ? (
        <View style={styles.list}>
          {pack.quranVerses.length === 0 ? (
            <Text style={styles.empty}>No verses added yet.</Text>
          ) : (
            pack.quranVerses.map((q) => <VerseRow key={q.id} item={q} language={language} />)
          )}
        </View>
      ) : null}

      {tab === 'wafq' && advancedMode ? (
        <View style={styles.list}>
          {pack.wafq?.length ? pack.wafq.map((w) => <WafqRow key={w.id} item={w} language={language} />) : <Text style={styles.empty}>No wafq templates yet.</Text>}
        </View>
      ) : null}

      {!advancedMode ? (
        <Text style={styles.advancedHint}>Advanced practices (wafq) are hidden. Enable “Advanced mode” to view.</Text>
      ) : null}

      {activeDhikr ? (
        <DhikrCounterModal
          visible={Boolean(activeDhikr)}
          onClose={() => setActiveDhikr(null)}
          accent={accent}
          practice={activeDhikr}
          language={language}
          count={activeProgress.count}
          elapsedSeconds={activeProgress.elapsedSeconds}
          onChange={(next) => tracking.setDhikrProgress(activeDhikr.id, next)}
          onMarkCompleted={async () => {
            if (!tracking.isCompleted(activeDhikr.id)) {
              await tracking.toggleCompleted(activeDhikr.id);
            }
          }}
        />
      ) : null}
    </ExpandableCard>
  );
}

function PracticeRow(props: {
  accent: string;
  titleArabic: string;
  subtitle?: string;
  detail?: string;
  count?: number;
  counterProgress?: { count: number; elapsedSeconds: number };
  completed: boolean;
  favorited: boolean;
  onToggleCompleted: () => void;
  onToggleFavorite: () => void;
  onPlay?: () => void;
  isPlaying?: boolean;
  onOpenCounter?: () => void;
  onShare?: () => void;
}) {
  const counterLabel =
    typeof props.count === 'number'
      ? `${props.counterProgress?.count ?? 0}/${props.count}`
      : props.counterProgress?.count
        ? `${props.counterProgress.count}`
        : undefined;

  return (
    <View style={[styles.row, { borderColor: `${props.accent}22` }]}>
      <View style={styles.rowBody}>
        <Text style={styles.arabic}>{props.titleArabic}</Text>
        {props.subtitle ? <Text style={styles.sub}>{props.subtitle}</Text> : null}
        <View style={styles.metaLine}>
          {typeof props.count === 'number' ? <Text style={styles.meta}>×{props.count}</Text> : null}
          {counterLabel ? (
            <Pressable onPress={props.onOpenCounter} style={styles.counterPill}>
              <Ionicons name="timer-outline" size={14} color={DarkTheme.textSecondary} />
              <Text style={styles.meta}>{counterLabel}</Text>
            </Pressable>
          ) : null}
          {props.detail ? <Text style={styles.meta}>{props.detail}</Text> : null}
        </View>
      </View>

      <View style={styles.rowActions}>
        <RowAction icon={props.favorited ? 'bookmark' : 'bookmark-outline'} onPress={props.onToggleFavorite} />
        <RowAction
          icon={props.completed ? 'checkbox' : 'square-outline'}
          onPress={props.onToggleCompleted}
        />
        <RowAction icon={'share-outline'} onPress={props.onShare} disabled={!props.onShare} />
        <RowAction
          icon={props.isPlaying ? 'pause' : 'volume-high'}
          onPress={props.onPlay}
          disabled={!props.onPlay}
        />
      </View>
    </View>
  );
}

function AngelRow({ item, language }: { item: AngelInvocation; language: ManazilLanguage }) {
  const msg = [
    'Angelic Invocation',
    '',
    `${item.angelArabicName}${item.angelTransliteration ? ` (${item.angelTransliteration})` : ''}`,
    '',
    item.purposeNote ? (item.purposeNote[language] ?? item.purposeNote.en) : '',
    item.invocationArabic ?? '',
    item.invocationTransliteration ?? '',
    item.invocationTranslation ? (item.invocationTranslation[language] ?? item.invocationTranslation.en) : '',
    item.timingNote ? (item.timingNote[language] ?? item.timingNote.en) : '',
  ].filter(Boolean).join('\n');

  return (
    <View style={styles.simpleRow}>
      <Pressable onPress={() => shareMessage(msg)} style={styles.shareIcon}>
        <Ionicons name="share-outline" size={16} color={DarkTheme.textSecondary} />
      </Pressable>
      <Text style={styles.rowTitle}>{item.angelArabicName} {item.angelTransliteration ? `(${item.angelTransliteration})` : ''}</Text>
      {item.purposeNote ? <Text style={styles.rowText}>{item.purposeNote[language] ?? item.purposeNote.en}</Text> : null}
      {item.invocationArabic ? <Text style={styles.arabicSmall}>{item.invocationArabic}</Text> : null}
      {item.invocationTransliteration ? <Text style={styles.sub}>{item.invocationTransliteration}</Text> : null}
      {item.invocationTranslation ? <Text style={styles.rowText}>{item.invocationTranslation[language] ?? item.invocationTranslation.en}</Text> : null}
      {item.timingNote ? <Text style={styles.note}>{item.timingNote[language] ?? item.timingNote.en}</Text> : null}
      {item.sourceNote ? <Text style={styles.note}>{item.sourceNote[language] ?? item.sourceNote.en}</Text> : null}
    </View>
  );
}

function VerseRow({ item, language }: { item: QuranVerse; language: ManazilLanguage }) {
  const msg = [
    `Q ${item.surah}:${item.ayah}`,
    '',
    item.arabic,
    item.transliteration ?? '',
    '',
    item.translation[language] ?? item.translation.en,
    item.relevanceNote ? (item.relevanceNote[language] ?? item.relevanceNote.en) : '',
  ].filter(Boolean).join('\n');

  return (
    <View style={styles.simpleRow}>
      <Pressable onPress={() => shareMessage(msg)} style={styles.shareIcon}>
        <Ionicons name="share-outline" size={16} color={DarkTheme.textSecondary} />
      </Pressable>
      <Text style={styles.rowTitle}>Q {item.surah}:{item.ayah}</Text>
      <Text style={styles.arabicSmall}>{item.arabic}</Text>
      {item.transliteration ? <Text style={styles.sub}>{item.transliteration}</Text> : null}
      <Text style={styles.rowText}>{item.translation[language] ?? item.translation.en}</Text>
      {item.relevanceNote ? <Text style={styles.note}>{item.relevanceNote[language] ?? item.relevanceNote.en}</Text> : null}
    </View>
  );
}

function WafqRow({ item, language }: { item: WafqGuidance; language: ManazilLanguage }) {
  const msg = [
    item.displayName[language] ?? item.displayName.en,
    '',
    item.letterFormula ? (item.letterFormula[language] ?? item.letterFormula.en) : '',
    item.instructions ? (item.instructions[language] ?? item.instructions.en) : '',
    '',
    item.timingNote[language] ?? item.timingNote.en,
    item.materialsNote[language] ?? item.materialsNote.en,
    item.activationNote ? (item.activationNote[language] ?? item.activationNote.en) : '',
    item.disposalNote ? (item.disposalNote[language] ?? item.disposalNote.en) : '',
    item.safetyNote[language] ?? item.safetyNote.en,
  ].filter(Boolean).join('\n');

  return (
    <View style={styles.simpleRow}>
      <Pressable onPress={() => shareMessage(msg)} style={styles.shareIcon}>
        <Ionicons name="share-outline" size={16} color={DarkTheme.textSecondary} />
      </Pressable>
      <Text style={styles.rowTitle}>{item.displayName[language] ?? item.displayName.en}</Text>
      {item.letterFormula ? <Text style={styles.rowText}>{item.letterFormula[language] ?? item.letterFormula.en}</Text> : null}

      {item.wafqSquare?.length ? (
        <View style={styles.square}>
          {item.wafqSquare.map((row, r) => (
            <View key={r} style={styles.squareRow}>
              {row.map((cell, c) => (
                <View key={c} style={styles.squareCell}>
                  <Text style={styles.squareText}>{cell}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      ) : null}

      {item.instructions ? <Text style={styles.rowText}>{item.instructions[language] ?? item.instructions.en}</Text> : null}
      {item.timingNote ? <Text style={styles.note}>{item.timingNote[language] ?? item.timingNote.en}</Text> : null}
      {item.materialsNote ? <Text style={styles.note}>{item.materialsNote[language] ?? item.materialsNote.en}</Text> : null}
      {item.activationNote ? <Text style={styles.note}>{item.activationNote[language] ?? item.activationNote.en}</Text> : null}
      {item.disposalNote ? <Text style={styles.note}>{item.disposalNote[language] ?? item.disposalNote.en}</Text> : null}
      <Text style={styles.note}>{item.safetyNote[language] ?? item.safetyNote.en}</Text>
      {item.sourceNote ? <Text style={styles.note}>{item.sourceNote[language] ?? item.sourceNote.en}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  disclaimer: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    lineHeight: 16,
    marginBottom: Spacing.md,
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  tabButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    backgroundColor: 'rgba(255,255,255,0.04)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tabText: {
    fontSize: Typography.caption,
    color: DarkTheme.textSecondary,
  },
  list: {
    gap: Spacing.sm,
  },
  empty: {
    fontSize: Typography.label,
    color: DarkTheme.textTertiary,
  },
  advancedHint: {
    marginTop: Spacing.md,
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    lineHeight: 16,
  },
  row: {
    borderWidth: 1,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'flex-start',
  },
  square: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.sm,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 12,
    overflow: 'hidden',
  },
  squareRow: {
    flexDirection: 'row',
  },
  squareCell: {
    width: 34,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  squareText: {
    fontSize: Typography.caption,
    color: DarkTheme.textSecondary,
    fontVariant: ['tabular-nums'],
  },
  rowBody: {
    flex: 1,
  },
  arabic: {
    fontSize: 18,
    color: DarkTheme.textPrimary,
    textAlign: 'right',
  },
  arabicSmall: {
    fontSize: 16,
    color: DarkTheme.textPrimary,
    textAlign: 'right',
    marginTop: 6,
  },
  sub: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    marginTop: 4,
  },
  metaLine: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: 6,
    flexWrap: 'wrap',
  },
  counterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
    backgroundColor: DarkTheme.cardBackgroundAlt,
  },
  meta: {
    fontSize: Typography.caption,
    color: DarkTheme.textSecondary,
  },
  rowActions: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 2,
  },
  actionBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  simpleRow: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    padding: Spacing.md,
    position: 'relative',
  },
  shareIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.10)',
  },
  rowTitle: {
    fontSize: Typography.label,
    fontWeight: Typography.weightSemibold,
    color: DarkTheme.textPrimary,
  },
  rowText: {
    fontSize: Typography.label,
    color: DarkTheme.textSecondary,
    marginTop: 6,
    lineHeight: 20,
  },
  note: {
    fontSize: Typography.caption,
    color: DarkTheme.textTertiary,
    marginTop: 6,
    lineHeight: 16,
  },
});
