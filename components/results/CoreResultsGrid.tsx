import React from 'react';
import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface CoreResultsPayload {
  kabirTotal?: number;
  saghirRoot?: number;
  hadadMod4?: number;
  burjName?: string;
  burj?: {
    en?: string;
    ar?: string;
  };
}

interface CoreResultsGridProps {
  results?: CoreResultsPayload;
  t?: (key: string) => string;
  style?: StyleProp<ViewStyle>;
}

const defaultLabels = {
  kabir: 'Kabir',
  saghir: 'Saghir',
  hadad: 'Hadad',
  burj: 'Burj',
  grandTotal: 'Grand Total',
  digitalRoot: 'Digital Root',
  mod4: 'Mod 4',
  zodiac: 'Zodiac',
};

export const CoreResultsGrid: React.FC<CoreResultsGridProps> = ({ results, t, style }) => {
  const translate = (key: keyof typeof defaultLabels) => (t ? t(`calculator.results.core.${key}`) : defaultLabels[key]);

  const safeNumber = (value?: number) => {
    if (value === null || value === undefined) {
      return '—';
    }
    const parsed = Number(value);
    return Number.isFinite(parsed) ? `${parsed}` : '—';
  };

  const safeText = (value?: string) => {
    if (!value || value.trim().length === 0) {
      return '—';
    }
    return value;
  };

  const burjValue = () => {
    if (results?.burjName) {
      return safeText(results.burjName);
    }
    if (results?.burj?.en) {
      return safeText(results.burj.en);
    }
    if (results?.burj?.ar) {
      return safeText(results.burj.ar);
    }
    return '—';
  };

  return (
    <View style={[styles.card, style]}>
      <View style={styles.gridRow}>
        <View style={styles.tile}>
          <Text style={styles.label}>{translate('kabir').toUpperCase()}</Text>
          <Text style={styles.value}>{safeNumber(results?.kabirTotal)}</Text>
          <Text style={styles.subtitle}>{translate('grandTotal')}</Text>
        </View>
        <View style={styles.tile}>
          <Text style={styles.label}>{translate('saghir').toUpperCase()}</Text>
          <Text style={styles.value}>{safeNumber(results?.saghirRoot)}</Text>
          <Text style={styles.subtitle}>{translate('digitalRoot')}</Text>
        </View>
      </View>
      <View style={styles.gridRow}>
        <View style={styles.tile}>
          <Text style={styles.label}>{translate('hadad').toUpperCase()}</Text>
          <Text style={styles.value}>{safeNumber(results?.hadadMod4)}</Text>
          <Text style={styles.subtitle}>{translate('mod4')}</Text>
        </View>
        <View style={styles.tile}>
          <Text style={styles.label}>{translate('burj').toUpperCase()}</Text>
          <Text style={styles.value}>{burjValue()}</Text>
          <Text style={styles.subtitle}>{translate('zodiac')}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1e293b',
    borderWidth: 1,
    borderColor: '#334155',
    borderRadius: 16,
    padding: 16,
    gap: 12,
  },
  gridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  tile: {
    flex: 1,
    backgroundColor: '#111829',
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#1f2a3d',
    minWidth: 0,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 1,
  },
  value: {
    fontSize: 28,
    fontWeight: '700',
    color: '#f1f5f9',
    marginTop: 6,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748b',
    marginTop: 8,
  },
});
