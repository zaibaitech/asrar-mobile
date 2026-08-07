/**
 * RuleRow — ported from asrar.app's RuleRow.tsx.
 * Icon chip (status color) + label (+ Arabic label when not simple) with
 * points on the right + detail text (simplified when Simple mode is on
 * and an entry exists, else technical) + status label (Detailed mode only).
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { RuleResult } from '@/services/ikhtiyaratEngine';
import { UiLang, ruleStatusLabel } from '@/services/ikhtiyaratEngine/copy';
import { getSimplifiedRuleText } from '@/services/ikhtiyaratEngine/ruleSimplification';

const STATUS_COLOR: Record<RuleResult['status'], string> = {
  pass: '#94A3B8',
  fail: '#EF4444',
  bonus: '#22C55E',
  penalty: '#F59E0B',
  hardfail: '#DC2626',
};

const STATUS_ICON: Record<RuleResult['status'], string> = {
  pass: '·',
  fail: '✕',
  bonus: '+',
  penalty: '−',
  hardfail: '⛔',
};

export interface RuleRowProps {
  rule: RuleResult;
  language: UiLang;
  simple?: boolean;
  textColor: string;
  detailColor: string;
  borderColor: string;
}

export default function RuleRow({ rule, language, simple = false, textColor, detailColor, borderColor }: RuleRowProps) {
  const color = STATUS_COLOR[rule.status];
  const label = language === 'fr' ? rule.label_fr : language === 'ar' ? rule.label_ar : rule.label_en;
  const technicalDetail = language === 'fr' ? rule.detail_fr : language === 'ar' ? rule.detail_ar : rule.detail_en;
  const simplified = simple ? getSimplifiedRuleText(rule, language) : null;
  const detail = simplified ? simplified.text : technicalDetail;
  const statusLabel = ruleStatusLabel[rule.status][language];

  return (
    <View style={[styles.row, { borderBottomColor: borderColor }]}>
      <View style={[styles.iconChip, { backgroundColor: `${color}18` }]}>
        <Text style={[styles.iconText, { color }]}>{STATUS_ICON[rule.status]}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={[styles.label, { color: textColor }]}>
            {label}
            {!simple && <Text style={styles.arabicInline}> {rule.label_ar}</Text>}
          </Text>
          <Text style={[styles.points, { color }]}>{rule.points > 0 ? `+${rule.points}` : rule.points}</Text>
        </View>
        <Text style={[styles.detail, { color: detailColor }]}>{detail}</Text>
        {!simple && <Text style={[styles.statusLabel, { color }]}>{statusLabel}</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  iconChip: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  iconText: {
    fontSize: 11,
    fontWeight: '700',
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    flex: 1,
  },
  arabicInline: {
    fontSize: 12,
    color: '#94A3B8',
  },
  points: {
    fontSize: 12,
    fontWeight: '700',
  },
  detail: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 17,
  },
  statusLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginTop: 4,
  },
});
