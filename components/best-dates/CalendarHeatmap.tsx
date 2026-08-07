/**
 * CalendarHeatmap — ported from asrar.app's CalendarHeatmap.tsx.
 * Plain RN Views in a 7-column grid, colored by tier — no calendar
 * library dependency, matches the low-end-Android/no-new-deps constraint.
 */

import React from 'react';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import Colors from '@/constants/Colors';
import { ElectionResult } from '@/services/ikhtiyaratEngine';
import { UiLang } from '@/services/ikhtiyaratEngine/copy';

export interface CalendarHeatmapProps {
  results: ElectionResult[];
  language: UiLang;
  onSelectDay: (result: ElectionResult) => void;
}

function groupByMonth(results: ElectionResult[]): Map<string, ElectionResult[]> {
  const map = new Map<string, ElectionResult[]>();
  for (const r of results) {
    const key = `${r.date.getFullYear()}-${r.date.getMonth()}`;
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(r);
  }
  return map;
}

const CELL_SIZE = 42;

export default function CalendarHeatmap({ results, language, onSelectDay }: CalendarHeatmapProps) {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const months = groupByMonth(results);
  const locale = language === 'fr' ? 'fr-FR' : language === 'ar' ? 'ar-SA' : 'en-US';

  return (
    <View style={styles.container}>
      {Array.from(months.entries()).map(([key, days]) => {
        const first = days[0].date;
        const monthLabel = first.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
        const leadingBlanks = first.getDay();

        const cells: (ElectionResult | null)[] = [...Array(leadingBlanks).fill(null), ...days];
        const rows: (ElectionResult | null)[][] = [];
        for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

        return (
          <View key={key} style={styles.monthBlock}>
            <Text style={[styles.monthLabel, { color: colors.text }]}>{monthLabel}</Text>
            {rows.map((row, rowIdx) => (
              <View key={rowIdx} style={styles.row}>
                {row.map((day, dayIdx) => {
                  if (!day) return <View key={dayIdx} style={styles.cell} />;
                  return (
                    <Pressable
                      key={dayIdx}
                      onPress={() => onSelectDay(day)}
                      style={[
                        styles.cell,
                        styles.cellFilled,
                        { backgroundColor: `${day.tierInfo.color}25`, borderColor: `${day.tierInfo.color}50` },
                      ]}
                    >
                      <Text style={[styles.cellText, { color: day.tierInfo.color }]}>{day.date.getDate()}</Text>
                    </Pressable>
                  );
                })}
              </View>
            ))}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  monthBlock: { marginBottom: 20 },
  monthLabel: { fontSize: 14, fontWeight: '700', marginBottom: 8, textTransform: 'capitalize' },
  row: { flexDirection: 'row' },
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 1.5,
  },
  cellFilled: {
    borderRadius: 8,
    borderWidth: 1,
  },
  cellText: { fontSize: 13, fontWeight: '600' },
});
