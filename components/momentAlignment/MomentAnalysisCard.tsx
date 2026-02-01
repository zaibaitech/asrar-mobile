import { DarkTheme, Spacing } from '@/constants/DarkTheme';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export type PlanetDisplayModel = {
  symbol?: string;
  name: string;
  arabicName?: string;
  elementLabel?: string;
  elementIcon?: string;
  sourceLabel?: string;
};

export type TransitConditionsModel = {
  dignityLabel?: string;
  dignityBadge?: string;
  dignityDetail?: string;
  dignityDescription?: string;
  houseLabel?: string;
  houseBadge?: string;
  houseDescription?: string;
  // Positional power (house + dignity based)
  positionalLabel?: string;
  positionalDetail?: string;
  positionalPercent?: number;
  positionalTone?: 'good' | 'warn' | 'neutral';
  positionalSubtext?: string;
  // Transit quality (overall planetary strength)
  transitQualityLabel?: string;
  transitQualityDetail?: string;
  transitQualityPercent?: number;
  transitQualityTone?: 'good' | 'warn' | 'neutral';
  transitQualitySubtext?: string;
  // Legacy (for backward compatibility)
  strengthLabel?: string;
  strengthDetail?: string;
  strengthPercent?: number;
  strengthTone?: 'good' | 'warn' | 'neutral';
};

export type FactorRowModel = {
  icon: string;
  text: string;
  scoreText: string;
  scoreColor: string;
};

export type MomentAnalysisCardProps = {
  currentHour: PlanetDisplayModel;
  userPlanet: PlanetDisplayModel;
  transit?: TransitConditionsModel;
  transitFooter?: React.ReactNode;
  factors?: FactorRowModel[];
  sectionLabels: {
    currentHour: string;
    userPlanet: string;
    transitConditions: string;
    alignmentAnalysis: string;
  };
};

export function MomentAnalysisCard({ currentHour, userPlanet, transit, transitFooter, factors, sectionLabels }: MomentAnalysisCardProps) {
  return (
    <View style={styles.container}>
      <Section label={sectionLabels.currentHour}>
        <PlanetDisplay model={currentHour} />
      </Section>

      <Divider />

      <Section label={sectionLabels.userPlanet}>
        <PlanetDisplay model={userPlanet} />
      </Section>

      {!!transit && (
        <>
          <Divider />
          <Section label={sectionLabels.transitConditions}>
            <TransitConditions model={transit} />
            {!!transitFooter && (
              <View style={styles.transitFooter}>
                {transitFooter}
              </View>
            )}
          </Section>
        </>
      )}

      {!!factors?.length && (
        <>
          <Divider />
          <Section label={sectionLabels.alignmentAnalysis}>
            <View style={styles.factorList}>
              {factors.map((f, idx) => (
                <View key={`${f.text}-${idx}`} style={styles.factorRow}>
                  <Text style={styles.factorIcon}>{f.icon}</Text>
                  <Text style={styles.factorText} numberOfLines={2}>{f.text}</Text>
                  <Text style={[styles.factorScore, { color: f.scoreColor }]}>{f.scoreText}</Text>
                </View>
              ))}
            </View>
          </Section>
        </>
      )}
    </View>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      {children}
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

function PlanetDisplay({ model }: { model: PlanetDisplayModel }) {
  return (
    <View style={styles.planetRow}>
      <View style={styles.planetIcon}>
        <Text style={styles.planetIconText}>{model.symbol || '✦'}</Text>
      </View>

      <View style={styles.planetInfo}>
        <Text style={styles.planetName} numberOfLines={1}>
          {model.name}
          {model.arabicName ? ` • ${model.arabicName}` : ''}
        </Text>

        {!!model.elementLabel && (
          <Text style={styles.planetMeta} numberOfLines={1}>
            {model.elementIcon ? `${model.elementIcon} ` : ''}{model.elementLabel}
          </Text>
        )}

        {!!model.sourceLabel && (
          <Text style={styles.planetSource} numberOfLines={1}>{model.sourceLabel}</Text>
        )}
      </View>
    </View>
  );
}

function TransitConditions({ model }: { model: TransitConditionsModel }) {
  const positionalPct = clamp(model.positionalPercent ?? model.strengthPercent ?? 0, 0, 100);
  const positionalColor = (model.positionalTone ?? model.strengthTone) === 'good'
    ? '#34D399'
    : (model.positionalTone ?? model.strengthTone) === 'warn'
      ? '#F97316'
      : '#94A3B8';

  const transitPct = clamp(model.transitQualityPercent ?? 0, 0, 100);
  const transitColor = model.transitQualityTone === 'good'
    ? '#34D399'
    : model.transitQualityTone === 'warn'
      ? '#F97316'
      : '#94A3B8';

  return (
    <View style={styles.transitWrap}>
      {(model.dignityLabel || model.dignityBadge || model.dignityDetail) && (
        <TransitRow
          label={model.dignityLabel ?? ''}
          badge={model.dignityBadge}
          detail={model.dignityDetail}
          description={model.dignityDescription}
        />
      )}
      {(model.houseLabel || model.houseBadge) && (
        <TransitRow
          label={model.houseLabel ?? ''}
          badge={model.houseBadge}
          description={model.houseDescription}
        />
      )}

      {/* Positional Power */}
      {!!(model.positionalLabel || model.strengthLabel) && (
        <View style={styles.strengthWrap}>
          <View style={styles.strengthHeader}>
            <Text style={styles.transitLabel}>{model.positionalLabel || model.strengthLabel}</Text>
            {!!(model.positionalDetail || model.strengthDetail) && (
              <Text style={styles.strengthDetail} numberOfLines={1}>
                {model.positionalDetail || model.strengthDetail}
              </Text>
            )}
          </View>
          {!!model.positionalSubtext && (
            <Text style={styles.strengthSubtext}>{model.positionalSubtext}</Text>
          )}
          <View style={styles.strengthBar}>
            <View style={[styles.strengthFill, { width: `${positionalPct}%`, backgroundColor: positionalColor }]} />
          </View>
        </View>
      )}

      {/* Transit Quality */}
      {!!model.transitQualityLabel && model.transitQualityPercent !== undefined && model.transitQualityPercent > 0 && (
        <View style={styles.strengthWrap}>
          <View style={styles.strengthHeader}>
            <Text style={styles.transitLabel}>{model.transitQualityLabel}</Text>
            {!!model.transitQualityDetail && (
              <Text style={styles.strengthDetail} numberOfLines={1}>{model.transitQualityDetail}</Text>
            )}
          </View>
          {!!model.transitQualitySubtext && (
            <Text style={styles.strengthSubtext}>{model.transitQualitySubtext}</Text>
          )}
          <View style={styles.strengthBar}>
            <View style={[styles.strengthFill, { width: `${transitPct}%`, backgroundColor: transitColor }]} />
          </View>
        </View>
      )}
    </View>
  );
}

function TransitRow({
  label,
  badge,
  detail,
  description,
}: {
  label: string;
  badge?: string;
  detail?: string;
  description?: string;
}) {
  return (
    <View style={styles.transitRow}>
      <Text style={styles.transitLabel}>{label}</Text>
      {!!badge && (
        <View style={styles.transitBadge}>
          <Text style={styles.transitBadgeText} numberOfLines={1}>{badge}</Text>
        </View>
      )}
      {!!detail && (
        <Text style={styles.transitDetail} numberOfLines={2}>{detail}</Text>
      )}
      {!!description && (
        <Text style={styles.transitDescription} numberOfLines={3}>{description}</Text>
      )}
    </View>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.10)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    gap: Spacing.md,
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.9,
    color: DarkTheme.textTertiary,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  planetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  planetIcon: {
    width: 40,
    height: 40,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  planetIconText: {
    fontSize: 18,
    color: DarkTheme.textPrimary,
    fontWeight: '800',
  },
  planetInfo: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  planetName: {
    fontSize: 15,
    fontWeight: '700',
    color: DarkTheme.textPrimary,
  },
  planetMeta: {
    fontSize: 13,
    color: DarkTheme.textSecondary,
  },
  planetSource: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
  },
  transitWrap: {
    gap: 12,
  },
  transitRow: {
    gap: 6,
  },
  transitLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: DarkTheme.textSecondary,
  },
  transitBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  transitBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: DarkTheme.textPrimary,
  },
  transitDetail: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    lineHeight: 17,
  },
  strengthWrap: {
    gap: 8,
  },
  strengthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  strengthDetail: {
    fontSize: 12,
    fontWeight: '700',
    color: DarkTheme.textTertiary,
    marginLeft: Spacing.md,
    flexShrink: 1,
    textAlign: 'right',
  },
  strengthSubtext: {
    fontSize: 10,
    color: DarkTheme.textTertiary,
    fontStyle: 'italic',
    lineHeight: 14,
  },
  strengthBar: {
    height: 10,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    overflow: 'hidden',
  },
  strengthFill: {
    height: '100%',
    borderRadius: 999,
  },
  factorList: {
    gap: 10,
  },
  factorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  factorIcon: {
    width: 18,
    textAlign: 'center',
    fontSize: 14,
    color: DarkTheme.textSecondary,
  },
  factorText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: DarkTheme.textPrimary,
  },
  transitDescription: {
    fontSize: 12,
    color: DarkTheme.textTertiary,
    lineHeight: 17,
  },
  factorScore: {
    fontSize: 13,
    fontWeight: '800',
  },
  transitFooter: {
    marginTop: 10,
  },
});
