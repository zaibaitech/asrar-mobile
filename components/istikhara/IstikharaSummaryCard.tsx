import { LinearGradient } from 'expo-linear-gradient';
import { Award, Briefcase, Calendar, Moon, Target, Zap } from 'lucide-react-native';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';
import { ElementColors } from '../../constants/IstikharaColors';

interface IstikharaSummaryCardProps {
  result: any;
  language?: 'en' | 'fr';
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Helper function to translate element names
function getElementName(element: string, language: 'en' | 'fr'): string {
  if (language === 'fr') {
    const elementMap: Record<string, string> = {
      fire: 'Feu',
      earth: 'Terre',
      air: 'Air',
      water: 'Eau',
    };
    return elementMap[element.toLowerCase()] || element;
  }
  return element.charAt(0).toUpperCase() + element.slice(1);
}

export function IstikharaSummaryCard({ result, language = 'en' }: IstikharaSummaryCardProps) {
  const profile = result.burujProfile;
  const element = profile.element as 'fire' | 'earth' | 'air' | 'water';
  const config = ElementColors[element];

  // Progress animation values
  const mainProgress = useRef(new Animated.Value(0)).current;
  const careerProgress = useRef(new Animated.Value(0)).current;
  const spiritualProgress = useRef(new Animated.Value(0)).current;

  // Simulated scores (in real app, these would come from API)
  const scores = {
    main: 95,
    career: 92,
    spiritual: 88,
  };

  // Radial progress calculations
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  
  const mainStrokeDashoffset = mainProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, circumference - (scores.main / 100) * circumference],
  });
  
  const careerStrokeDashoffset = careerProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, circumference - (scores.career / 100) * circumference],
  });
  
  const spiritualStrokeDashoffset = spiritualProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, circumference - (scores.spiritual / 100) * circumference],
  });

  useEffect(() => {
    // Animate progress rings on mount
    Animated.stagger(200, [
      Animated.timing(mainProgress, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(careerProgress, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(spiritualProgress, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const blessedDay = profile.blessed_day;
  const personality = profile.personality?.[language];

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={config.bgGradient as any}
        style={styles.gradient}
      >
        <View style={styles.grid}>
          {/* LEFT COLUMN: Radial Progress */}
          <View style={styles.leftColumn}>
            <View style={styles.radialContainer}>
              <Svg width={180} height={180} viewBox="0 0 180 180">
                <G rotation="-90" origin="90, 90">
                  {/* Background circles */}
                  <Circle
                    cx="90"
                    cy="90"
                    r={radius}
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="6"
                    fill="none"
                  />
                  <Circle
                    cx="90"
                    cy="90"
                    r={radius + 8}
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="5"
                    fill="none"
                  />
                  <Circle
                    cx="90"
                    cy="90"
                    r={radius - 4}
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="4"
                    fill="none"
                  />

                  {/* Animated progress circles */}
                  <AnimatedCircle
                    cx="90"
                    cy="90"
                    r={radius}
                    stroke={config.progressColor}
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={mainStrokeDashoffset}
                    strokeLinecap="round"
                  />
                  <AnimatedCircle
                    cx="90"
                    cy="90"
                    r={radius + 8}
                    stroke={config.progressColor}
                    strokeWidth="5"
                    fill="none"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={careerStrokeDashoffset}
                    strokeLinecap="round"
                    opacity="0.7"
                  />
                  <AnimatedCircle
                    cx="90"
                    cy="90"
                    r={radius - 4}
                    stroke={config.progressColor}
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${circumference} ${circumference}`}
                    strokeDashoffset={spiritualStrokeDashoffset}
                    strokeLinecap="round"
                    opacity="0.5"
                  />
                </G>
              </Svg>

              {/* Center Content */}
              <View style={styles.centerContent}>
                <Text style={styles.centerEmoji}>{profile.element_emoji}</Text>
                <Text style={[styles.centerScore, { color: config.primarySolid }]}>
                  {scores.main}%
                </Text>
                <Text style={styles.centerElement}>{getElementName(profile.element, language)}</Text>
                <Text style={styles.centerLabel}>
                  {language === 'en' ? 'Element' : 'Élément'}
                </Text>
              </View>
            </View>

            {/* Score Legend */}
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: config.primarySolid }]} />
                <Text style={styles.legendText}>
                  {language === 'en' ? 'Overall Alignment' : 'Alignement Global'}
                </Text>
                <Text style={[styles.legendValue, { color: config.primarySolid }]}>
                  {scores.main}%
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: config.primarySolid, opacity: 0.7 }]} />
                <Text style={styles.legendText}>
                  {language === 'en' ? 'Career Match' : 'Correspondance Carrière'}
                </Text>
                <Text style={[styles.legendValue, { color: config.primarySolid }]}>
                  {scores.career}%
                </Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: config.primarySolid, opacity: 0.5 }]} />
                <Text style={styles.legendText}>
                  {language === 'en' ? 'Spiritual Practice' : 'Pratique Spirituelle'}
                </Text>
                <Text style={[styles.legendValue, { color: config.primarySolid }]}>
                  {scores.spiritual}%
                </Text>
              </View>
            </View>
          </View>

          {/* MIDDLE COLUMN: Statistics */}
          <View style={styles.middleColumn}>
            <View style={styles.statsHeader}>
              <Award size={18} color={config.primarySolid} />
              <Text style={styles.statsTitle}>
                {language === 'en' ? 'Your Numbers' : 'Vos Numéros'}
              </Text>
            </View>

            <View style={styles.statsGrid}>
              {/* Buruj Number */}
              <View style={[styles.statCard, { borderColor: config.border }]}>
                <LinearGradient
                  colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.2)']}
                  style={styles.statGradient}
                >
                  <View style={[styles.statIndicator, { backgroundColor: config.primarySolid }]} />
                  <Text style={styles.statIcon}>🌙</Text>
                  <Text style={[styles.statValue, { color: config.primarySolid }]}>
                    {result.burujRemainder}
                  </Text>
                  <Text style={styles.statLabel}>
                    {language === 'en' ? 'Burūj' : 'Burūj'}
                  </Text>
                  <Text style={styles.statSublabel}>
                    {language === 'en' ? 'Mansion' : 'Maison'}
                  </Text>
                </LinearGradient>
              </View>

              {/* Element Number */}
              <View style={[styles.statCard, { borderColor: config.border }]}>
                <LinearGradient
                  colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.2)']}
                  style={styles.statGradient}
                >
                  <Text style={styles.statIcon}>{profile.element_emoji}</Text>
                  <Text style={[styles.statValue, { color: config.primarySolid }]}>
                    {profile.element_number}
                  </Text>
                  <Text style={styles.statLabel}>
                    {language === 'en' ? 'Element' : 'Élément'}
                  </Text>
                  <Text style={styles.statSublabel}>
                    {language === 'en' ? 'ID Number' : 'Numéro ID'}
                  </Text>
                </LinearGradient>
              </View>

              {/* Total Hadad */}
              <View style={[styles.statCard, { borderColor: config.border }]}>
                <LinearGradient
                  colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.2)']}
                  style={styles.statGradient}
                >
                  <Text style={styles.statIcon}>📊</Text>
                  <Text style={[styles.statValue, { color: config.primarySolid }]}>
                    {result.combinedTotal}
                  </Text>
                  <Text style={styles.statLabel}>
                    {language === 'en' ? 'Total' : 'Total'}
                  </Text>
                  <Text style={styles.statSublabel}>
                    {language === 'en' ? 'Ḥadad Value' : 'Valeur Ḥadad'}
                  </Text>
                </LinearGradient>
              </View>

              {/* Repetition Count */}
              <View style={[styles.statCard, { borderColor: config.border }]}>
                <LinearGradient
                  colors={['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.2)']}
                  style={styles.statGradient}
                >
                  <Text style={styles.statIcon}>🔢</Text>
                  <Text style={[styles.statValue, { color: config.primarySolid }]}>
                    {result.repetitionCount}
                  </Text>
                  <Text style={styles.statLabel}>
                    {language === 'en' ? 'Count' : 'Compteur'}
                  </Text>
                  <Text style={styles.statSublabel}>
                    {language === 'en' ? 'Repetitions' : 'Répétitions'}
                  </Text>
                </LinearGradient>
              </View>
            </View>

            {/* Blessed Day Card */}
            {blessedDay && (
              <View style={[styles.blessedDayCard, { borderColor: config.border }]}>
                <LinearGradient
                  colors={config.bgGradient as any}
                  style={styles.blessedDayGradient}
                >
                  <View style={styles.blessedDayHeader}>
                    <View style={[styles.blessedDayIconContainer, { backgroundColor: config.secondary }]}>
                      <Calendar size={18} color={config.primarySolid} />
                    </View>
                    <Text style={styles.blessedDayTitle}>
                      {language === 'en' ? 'Your Power Day' : 'Votre Jour de Puissance'}
                    </Text>
                  </View>
                  <View style={styles.blessedDayContent}>
                    <Text style={styles.blessedDayName}>
                      {blessedDay.day?.[language]}
                    </Text>
                    <Text style={styles.blessedDayDesc}>
                      {language === 'en' 
                        ? 'Most auspicious for important decisions' 
                        : 'Le plus propice pour les décisions importantes'}
                    </Text>
                  </View>
                </LinearGradient>
              </View>
            )}
          </View>

          {/* RIGHT COLUMN: Key Insights */}
          <View style={styles.rightColumn}>
            <View style={styles.insightsHeader}>
              <Target size={18} color={config.primarySolid} />
              <Text style={styles.insightsTitle}>
                {language === 'en' ? 'Key Insights' : 'Perspectives Clés'}
              </Text>
            </View>

            {/* Career Preview */}
            {profile.career && (
              <View style={[styles.insightCard, { borderColor: config.border }]}>
                <LinearGradient
                  colors={config.bgGradient as any}
                  style={styles.insightGradient}
                >
                  <View style={styles.insightHeader}>
                    <View style={[styles.insightIconContainer, { backgroundColor: config.secondary }]}>
                      <Briefcase size={18} color={config.primarySolid} />
                    </View>
                    <View style={styles.insightTitleContainer}>
                      <Text style={styles.insightTitle}>
                        {language === 'en' ? 'Career Path' : 'Parcours Professionnel'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.insightText} numberOfLines={3}>
                    {profile.career.principle?.[language] || 
                     (language === 'en' ? 'Explore career guidance in the Career tab' : 'Explorez l\'orientation professionnelle dans l\'onglet Carrière')}
                  </Text>
                </LinearGradient>
              </View>
            )}

            {/* Spiritual Practice Preview */}
            {profile.spiritual_practice && (
              <View style={[styles.insightCard, { borderColor: config.border }]}>
                <LinearGradient
                  colors={config.bgGradient as any}
                  style={styles.insightGradient}
                >
                  <View style={styles.insightHeader}>
                    <View style={[styles.insightIconContainer, { backgroundColor: config.secondary }]}>
                      <Moon size={18} color={config.primarySolid} />
                    </View>
                    <View style={styles.insightTitleContainer}>
                      <Text style={styles.insightTitle}>
                        {language === 'en' ? 'Daily Practice' : 'Pratique Quotidienne'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.insightText} numberOfLines={2}>
                    {profile.spiritual_practice.divine_names?.note?.[language] || 
                     profile.spiritual_practice?.[language] ||
                     (language === 'en' ? 'Explore spiritual practices in the Spiritual tab' : 'Explorez les pratiques spirituelles dans l\'onglet Spirituel')}
                  </Text>
                  <Text style={styles.insightSubtext}>
                    {language === 'en' ? 'Recite daily for spiritual balance' : 'Récitez quotidiennement pour l\'équilibre spirituel'}
                  </Text>
                </LinearGradient>
              </View>
            )}

            {/* Core Trait */}
            {personality && (
              <View style={[styles.insightCard, { borderColor: config.border }]}>
                <LinearGradient
                  colors={['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.1)']}
                  style={styles.insightGradient}
                >
                  <View style={styles.insightHeader}>
                    <Zap size={16} color={config.primarySolid} />
                    <Text style={styles.insightSmallTitle}>
                      {language === 'en' ? 'Core Trait' : 'Trait Principal'}
                    </Text>
                  </View>
                  <Text style={styles.insightText} numberOfLines={3}>
                    {personality.temperament}
                  </Text>
                </LinearGradient>
              </View>
            )}
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  gradient: {
    padding: 16,
  },
  grid: {
    gap: 16,
  },

  // Left Column - Radial Progress
  leftColumn: {
    gap: 12,
  },
  radialContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerEmoji: {
    fontSize: 36,
    marginBottom: 4,
  },
  centerScore: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  centerElement: {
    fontSize: 12,
    color: '#ffffff',
    textTransform: 'capitalize',
  },
  centerLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },

  // Legend
  legendContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendText: {
    flex: 1,
    fontSize: 11,
    color: '#ffffff',
  },
  legendValue: {
    fontSize: 12,
    fontWeight: 'bold',
  },

  // Middle Column - Stats
  middleColumn: {
    gap: 12,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
  },
  statGradient: {
    padding: 12,
    alignItems: 'center',
    position: 'relative',
  },
  statIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ffffff',
  },
  statSublabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.7)',
  },

  // Blessed Day
  blessedDayCard: {
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
    marginTop: 4,
  },
  blessedDayGradient: {
    padding: 16,
  },
  blessedDayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  blessedDayIconContainer: {
    padding: 8,
    borderRadius: 8,
  },
  blessedDayTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  blessedDayContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  blessedDayName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  blessedDayDesc: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },

  // Right Column - Insights
  rightColumn: {
    gap: 12,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  insightsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  insightCard: {
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
  },
  insightGradient: {
    padding: 14,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  insightIconContainer: {
    padding: 8,
    borderRadius: 8,
  },
  insightTitleContainer: {
    flex: 1,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  insightSmallTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  insightText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 19,
  },
  insightSubtext: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 6,
  },
});
