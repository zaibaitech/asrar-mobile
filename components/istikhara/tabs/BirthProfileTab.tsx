/**
 * Birth Profile Tab
 * =================
 * Displays birth chart data including Sun Sign, Moon Sign, Ascendant, and Descendant.
 * Ascendant/Descendant are only shown if birth time was provided.
 */
import { LinearGradient } from 'expo-linear-gradient';
import { Lock, Moon, Sparkles, Sun, Sunrise, Sunset } from 'lucide-react-native';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, Easing, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useLanguage } from '../../../contexts/LanguageContext';
import { getPlanetPositions } from '../../../services/EphemerisService';
import { calculateAscendantSync } from '../../../services/NatalChartService';
import { IstikharaData } from '../../../types/istikhara';

// Zodiac sign names
const ZODIAC_EN = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
const ZODIAC_FR = ['Bélier', 'Taureau', 'Gémeaux', 'Cancer', 'Lion', 'Vierge', 'Balance', 'Scorpion', 'Sagittaire', 'Capricorne', 'Verseau', 'Poissons'];
const ZODIAC_AR = ['الحمل', 'الثور', 'الجوزاء', 'السرطان', 'الأسد', 'العذراء', 'الميزان', 'العقرب', 'القوس', 'الجدي', 'الدلو', 'الحوت'];
const ZODIAC_SYMBOLS = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];
const ZODIAC_ELEMENTS = ['fire', 'earth', 'air', 'water', 'fire', 'earth', 'air', 'water', 'fire', 'earth', 'air', 'water'];

// Element translations
const ELEMENT_NAMES: Record<string, Record<string, string>> = {
  fire: { en: 'Fire', fr: 'Feu', ar: 'نار' },
  earth: { en: 'Earth', fr: 'Terre', ar: 'تراب' },
  air: { en: 'Air', fr: 'Air', ar: 'هواء' },
  water: { en: 'Water', fr: 'Eau', ar: 'ماء' },
};

interface BirthProfile {
  dobISO: string;
  birthTime: string | null;
  hasBirthTime: boolean;
  timezone: string;
  birthLocation: {
    latitude: number;
    longitude: number;
    label?: string;
  } | null;
  sunSign: {
    burjAr: string;
    burjEn: string;
    burjIndex: number;
  };
}

interface BirthProfileTabProps {
  data: IstikharaData & { birthProfile?: BirthProfile };
  elementColor: string;
}

interface CalculatedData {
  moonSign: { burjIndex: number; degree: number } | null;
  ascendant: { burjIndex: number; degree: number } | null;
  descendant: { burjIndex: number; degree: number } | null;
}

function getElementColor(element: string): string {
  const colors: Record<string, string> = {
    fire: '#ef4444',
    earth: '#84cc16',
    air: '#06b6d4',
    water: '#3b82f6',
  };
  return colors[element.toLowerCase()] || '#8b5cf6';
}

// Skeleton Loading Component
function SkeletonCard({ delay = 0 }: { delay?: number }) {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          delay,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [delay, shimmerAnim]);
  
  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });
  
  return (
    <View style={styles.skeletonCard}>
      <Animated.View style={[styles.skeletonGradient, { opacity }]}>
        <View style={styles.skeletonHeader}>
          <View style={styles.skeletonIcon} />
          <View style={styles.skeletonTitle} />
        </View>
        <View style={styles.skeletonContent}>
          <View style={styles.skeletonSymbol} />
          <View style={styles.skeletonName} />
        </View>
        <View style={styles.skeletonBadge} />
      </Animated.View>
    </View>
  );
}

function LoadingState({ language, elementColor }: { language: string; elementColor: string }) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  
  useEffect(() => {
    // Rotating animation for the star
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();
    
    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 1000,
          easing: Easing.ease,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [rotateAnim, scaleAnim]);
  
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });
  
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Animated Header */}
        <View style={styles.loadingHeader}>
          <Animated.View style={{ transform: [{ rotate }, { scale: scaleAnim }] }}>
            <LinearGradient
              colors={[elementColor, `${elementColor}80`]}
              style={styles.loadingIconContainer}
            >
              <Sparkles size={32} color="#ffffff" />
            </LinearGradient>
          </Animated.View>
          <Text style={styles.loadingTitle}>
            {language === 'ar' 
              ? 'جاري حساب ملفك الفلكي'
              : language === 'fr'
                ? 'Calcul de votre thème natal'
                : 'Calculating Your Birth Chart'}
          </Text>
          <Text style={styles.loadingSubtitle}>
            {language === 'ar' 
              ? 'نقوم بحساب مواقع الكواكب...'
              : language === 'fr'
                ? 'Calcul des positions planétaires...'
                : 'Computing planetary positions...'}
          </Text>
        </View>
        
        {/* Skeleton Cards Row 1 */}
        <View style={styles.signsRow}>
          <SkeletonCard delay={0} />
          <SkeletonCard delay={200} />
        </View>
        
        {/* Skeleton Cards Row 2 */}
        <View style={styles.signsRow}>
          <SkeletonCard delay={400} />
          <SkeletonCard delay={600} />
        </View>
        
        {/* Loading Progress */}
        <View style={styles.loadingProgress}>
          <ActivityIndicator size="small" color={elementColor} />
          <Text style={styles.loadingProgressText}>
            {language === 'ar' 
              ? 'الرجاء الانتظار...'
              : language === 'fr'
                ? 'Veuillez patienter...'
                : 'Please wait...'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

function SignCard({ 
  title, 
  icon: Icon,
  iconColor,
  signIndex, 
  degree,
  showDegree = false,
  locked = false,
  lockedMessage,
}: { 
  title: string;
  icon: any;
  iconColor: string;
  signIndex: number | null;
  degree?: number;
  showDegree?: boolean;
  locked?: boolean;
  lockedMessage?: string;
}) {
  const { language } = useLanguage();
  
  if (locked || signIndex === null) {
    const defaultLockedMessage = language === 'ar' 
      ? 'أضف وقت الميلاد للفتح'
      : language === 'fr'
        ? 'Ajoutez l\'heure de naissance pour débloquer'
        : 'Add birth time to unlock';
    
    return (
      <View style={[styles.signCard, styles.signCardLocked]}>
        <View style={styles.signCardHeader}>
          <View style={[styles.signIconContainer, { backgroundColor: 'rgba(100, 100, 100, 0.2)' }]}>
            <Lock size={24} color="rgba(255, 255, 255, 0.4)" />
          </View>
          <Text style={styles.signTitle}>{title}</Text>
        </View>
        <View style={styles.lockedContent}>
          <Text style={styles.lockedText}>
            {lockedMessage || defaultLockedMessage}
          </Text>
        </View>
      </View>
    );
  }

  const signName = language === 'ar' ? ZODIAC_AR[signIndex] : language === 'fr' ? ZODIAC_FR[signIndex] : ZODIAC_EN[signIndex];
  const symbol = ZODIAC_SYMBOLS[signIndex];
  const element = ZODIAC_ELEMENTS[signIndex];
  const elementColor = getElementColor(element);
  const elementName = ELEMENT_NAMES[element]?.[language] || ELEMENT_NAMES[element]?.en || element;

  return (
    <View style={[styles.signCard, { borderColor: `${elementColor}40` }]}>
      <LinearGradient
        colors={[`${elementColor}15`, `${elementColor}08`]}
        style={styles.signCardGradient}
      >
        <View style={styles.signCardHeader}>
          <View style={[styles.signIconContainer, { backgroundColor: `${iconColor}20` }]}>
            <Icon size={24} color={iconColor} />
          </View>
          <Text style={styles.signTitle}>{title}</Text>
        </View>
        
        <View style={styles.signDetails}>
          <Text style={styles.signSymbol}>{symbol}</Text>
          <View style={styles.signNameContainer}>
            <Text style={styles.signName}>{signName}</Text>
            {showDegree && degree !== undefined && (
              <Text style={styles.signDegree}>{degree.toFixed(1)}°</Text>
            )}
          </View>
        </View>

        <View style={[styles.elementBadge, { backgroundColor: `${elementColor}30` }]}>
          <Text style={[styles.elementBadgeText, { color: elementColor }]}>
            {elementName.toUpperCase()}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}

export default function BirthProfileTab({ data, elementColor }: BirthProfileTabProps) {
  const { t, language } = useLanguage();
  const [calculatedData, setCalculatedData] = useState<CalculatedData>({
    moonSign: null,
    ascendant: null,
    descendant: null,
  });
  const [loading, setLoading] = useState(true);

  const birthProfile = data.birthProfile;
  const hasBirthTime = birthProfile?.hasBirthTime ?? false;
  const hasLocation = !!birthProfile?.birthLocation;
  
  // Calculate Moon Sign, Ascendant, and Descendant
  useEffect(() => {
    const calculateBirthChart = async () => {
      if (!birthProfile) {
        console.log('[BirthProfileTab] No birth profile data');
        setLoading(false);
        return;
      }

      console.log('[BirthProfileTab] Calculating with:', {
        dobISO: birthProfile.dobISO,
        birthTime: birthProfile.birthTime,
        hasBirthTime: birthProfile.hasBirthTime,
        hasLocation: !!birthProfile.birthLocation,
        birthLocation: birthProfile.birthLocation,
        timezone: birthProfile.timezone,
      });

      try {
        setLoading(true);
        let moonIndex = null;
        let moonDegree = 0;
        let ascIndex = null;
        let ascDegree = 0;
        let descIndex = null;
        let descDegree = 0;
        
        // Use same approach as profile.tsx for timezone fallback
        const timezone = birthProfile.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

        // Calculate Moon Sign (use exact time if available for accuracy)
        if (birthProfile.dobISO) {
          try {
            // ParsedobISO safely - it should be YYYY-MM-DD format
            const dateParts = birthProfile.dobISO.split('-');
            const year = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10);
            const day = parseInt(dateParts[2], 10);
            
            console.log('[BirthProfileTab] Parsed date parts:', { year, month, day, raw: birthProfile.dobISO });
            
            if (!Number.isFinite(year) || !Number.isFinite(month) || !Number.isFinite(day)) {
              console.error('[BirthProfileTab] Invalid dobISO format:', birthProfile.dobISO);
            } else {
              // Create date using UTC to avoid timezone issues
              let birthDate: Date;
              
              if (birthProfile.hasBirthTime && birthProfile.birthTime) {
                const timeParts = birthProfile.birthTime.split(':');
                const hours = parseInt(timeParts[0], 10);
                const minutes = parseInt(timeParts[1], 10);
                
                if (Number.isFinite(hours) && Number.isFinite(minutes)) {
                  birthDate = new Date(Date.UTC(year, month - 1, day, hours, minutes, 0, 0));
                } else {
                  // Invalid time - use noon UTC
                  birthDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
                }
              } else {
                // No birth time - use noon UTC as approximation
                birthDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
              }
              
              console.log('[BirthProfileTab] Created birthDate:', birthDate.toISOString());
              
              if (!isNaN(birthDate.getTime())) {
                const positions = await getPlanetPositions(birthDate, timezone);
                
                if (positions?.planets?.moon?.longitude) {
                  const moonLon = positions.planets.moon.longitude;
                  moonIndex = Math.floor(moonLon / 30);
                  moonDegree = moonLon % 30;
                  console.log('[BirthProfileTab] Moon calculation:', { moonLon, moonIndex, moonDegree });
                }
              }
            }
          } catch (dateError) {
            console.error('[BirthProfileTab] Error parsing date for moon calculation:', dateError);
          }
        }

        // Calculate Ascendant & Descendant (requires birth time + location)
        const canCalcAsc = birthProfile.hasBirthTime && birthProfile.birthLocation && birthProfile.birthTime;
        console.log('[BirthProfileTab] Can calculate ascendant:', canCalcAsc);
        
        if (canCalcAsc) {
          console.log('[BirthProfileTab] Calling calculateAscendantSync with:', {
            dobISO: birthProfile.dobISO,
            birthTime: birthProfile.birthTime,
            timezone: timezone,
            location: birthProfile.birthLocation,
          });
          
          const ascResult = calculateAscendantSync(
            birthProfile.dobISO,
            birthProfile.birthTime!,
            timezone,
            birthProfile.birthLocation!
          );
          
          console.log('[BirthProfileTab] Ascendant result:', ascResult);
          
          if (ascResult) {
            ascIndex = ascResult.burjIndex;
            ascDegree = ascResult.degree;
            // Descendant is opposite (180°) from Ascendant
            descIndex = (ascResult.burjIndex + 6) % 12;
            descDegree = ascResult.degree;
          }
        }

        setCalculatedData({
          moonSign: moonIndex !== null ? { burjIndex: moonIndex, degree: moonDegree } : null,
          ascendant: ascIndex !== null ? { burjIndex: ascIndex, degree: ascDegree } : null,
          descendant: descIndex !== null ? { burjIndex: descIndex, degree: descDegree } : null,
        });
      } catch (error) {
        console.error('[BirthProfileTab] Error calculating birth chart:', error);
      } finally {
        setLoading(false);
      }
    };

    calculateBirthChart();
  }, [birthProfile]);

  if (!birthProfile) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          {language === 'ar' 
            ? 'بيانات الملف الفلكي غير متوفرة. يرجى استخدام طريقة تاريخ الميلاد لرؤية ملفك الفلكي.'
            : language === 'fr'
              ? 'Données du profil de naissance non disponibles. Veuillez utiliser la méthode de date de naissance pour voir votre thème natal.'
              : 'Birth profile data not available. Please use the Birth Date method to see your birth chart.'}
        </Text>
      </View>
    );
  }

  if (loading) {
    return <LoadingState language={language} elementColor={elementColor} />;
  }

  const sunSignIndex = birthProfile.sunSign.burjIndex;
  const canCalculateAscendant = hasBirthTime && hasLocation;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>
            {language === 'ar' ? 'ملفك الفلكي' : language === 'fr' ? 'Votre Profil de Naissance' : 'Your Birth Profile'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {language === 'ar' 
              ? 'الشمس والقمر والطالع من تاريخ ميلادك' 
              : language === 'fr' 
                ? 'Positions du Soleil, de la Lune et de l\'Ascendant à votre naissance'
                : 'Sun, Moon, and Rising Sign positions at your birth'}
          </Text>
        </View>

        {/* Primary Signs Row */}
        <View style={styles.signsRow}>
          {/* Sun Sign */}
          <SignCard
            title={language === 'ar' ? 'برج الشمس' : language === 'fr' ? 'Signe Solaire' : 'Sun Sign'}
            icon={Sun}
            iconColor="#fbbf24"
            signIndex={sunSignIndex}
          />

          {/* Moon Sign */}
          <SignCard
            title={language === 'ar' ? 'برج القمر' : language === 'fr' ? 'Signe Lunaire' : 'Moon Sign'}
            icon={Moon}
            iconColor="#94a3b8"
            signIndex={calculatedData.moonSign?.burjIndex ?? null}
            degree={calculatedData.moonSign?.degree}
            showDegree={true}
            locked={!calculatedData.moonSign}
            lockedMessage={language === 'ar' ? 'جاري الحساب...' : language === 'fr' ? 'Calcul en cours...' : 'Calculating...'}
          />
        </View>

        {/* Ascendant/Descendant Row */}
        <View style={styles.signsRow}>
          {/* Ascendant */}
          <SignCard
            title={language === 'ar' ? 'الطالع' : language === 'fr' ? 'Ascendant' : 'Ascendant'}
            icon={Sunrise}
            iconColor="#f472b6"
            signIndex={calculatedData.ascendant?.burjIndex ?? null}
            degree={calculatedData.ascendant?.degree}
            showDegree={true}
            locked={!canCalculateAscendant && !calculatedData.ascendant}
            lockedMessage={
              canCalculateAscendant && !calculatedData.ascendant
                ? (language === 'ar' ? 'جاري الحساب...' : language === 'fr' ? 'Calcul en cours...' : 'Calculating...')
                : !hasBirthTime 
                  ? (language === 'ar' ? 'أضف وقت الميلاد للفتح' : language === 'fr' ? 'Ajoutez l\'heure de naissance' : 'Add birth time to unlock')
                  : (language === 'ar' ? 'أضف موقع الميلاد' : language === 'fr' ? 'Ajoutez le lieu de naissance' : 'Add birth location to unlock')
            }
          />

          {/* Descendant */}
          <SignCard
            title={language === 'ar' ? 'الغارب' : language === 'fr' ? 'Descendant' : 'Descendant'}
            icon={Sunset}
            iconColor="#a78bfa"
            signIndex={calculatedData.descendant?.burjIndex ?? null}
            degree={calculatedData.descendant?.degree}
            showDegree={true}
            locked={!canCalculateAscendant && !calculatedData.descendant}
            lockedMessage={
              canCalculateAscendant && !calculatedData.descendant
                ? (language === 'ar' ? 'جاري الحساب...' : language === 'fr' ? 'Calcul en cours...' : 'Calculating...')
                : !hasBirthTime 
                  ? (language === 'ar' ? 'أضف وقت الميلاد للفتح' : language === 'fr' ? 'Ajoutez l\'heure de naissance' : 'Add birth time to unlock')
                  : (language === 'ar' ? 'أضف موقع الميلاد' : language === 'fr' ? 'Ajoutez le lieu de naissance' : 'Add birth location to unlock')
            }
          />
        </View>

        {/* Info Message */}
        {!canCalculateAscendant && (
          <View style={styles.infoBox}>
            <Lock size={16} color="#94a3b8" />
            <Text style={styles.infoText}>
              {language === 'ar' 
                ? 'أضف وقت ميلادك وموقعك لفتح الطالع والغارب'
                : language === 'fr'
                  ? 'Ajoutez votre heure et lieu de naissance pour débloquer votre Ascendant et Descendant'
                  : 'Add your birth time and location to unlock your Ascendant and Descendant signs'}
            </Text>
          </View>
        )}

        {/* Birth Data Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            {language === 'ar' ? 'بيانات الميلاد' : language === 'fr' ? 'Données de Naissance' : 'Birth Data'}
          </Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              {language === 'ar' ? 'التاريخ:' : language === 'fr' ? 'Date:' : 'Date:'}
            </Text>
            <Text style={styles.summaryValue}>
              {new Date(birthProfile.dobISO).toLocaleDateString(
                language === 'ar' ? 'ar-SA' : language === 'fr' ? 'fr-FR' : 'en-US',
                { year: 'numeric', month: 'long', day: 'numeric' }
              )}
            </Text>
          </View>
          {birthProfile.birthTime && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {language === 'ar' ? 'الوقت:' : language === 'fr' ? 'Heure:' : 'Time:'}
              </Text>
              <Text style={styles.summaryValue}>{birthProfile.birthTime}</Text>
            </View>
          )}
          {birthProfile.birthLocation?.label && (
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>
                {language === 'ar' ? 'المكان:' : language === 'fr' ? 'Lieu:' : 'Location:'}
              </Text>
              <Text style={styles.summaryValue}>{birthProfile.birthLocation.label}</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f1419',
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f1419',
    gap: 16,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0f1419',
    padding: 32,
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  headerSection: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
    lineHeight: 20,
  },
  signsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  signCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    overflow: 'hidden',
  },
  signCardLocked: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderColor: 'rgba(100, 100, 100, 0.2)',
  },
  signCardGradient: {
    padding: 16,
  },
  signCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  signIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.8)',
    flex: 1,
  },
  signDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  signSymbol: {
    fontSize: 36,
  },
  signNameContainer: {
    flex: 1,
  },
  signName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ffffff',
  },
  signDegree: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 2,
  },
  elementBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 12,
  },
  elementBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  lockedContent: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  lockedText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
    textAlign: 'center',
    lineHeight: 18,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 18,
  },
  summaryCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  summaryValue: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  // Skeleton Loading Styles
  loadingHeader: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 20,
  },
  loadingIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  loadingTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  loadingSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  loadingProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  loadingProgressText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  skeletonCard: {
    flex: 1,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(100, 100, 100, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    overflow: 'hidden',
  },
  skeletonGradient: {
    padding: 16,
  },
  skeletonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  skeletonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  skeletonTitle: {
    height: 14,
    width: '60%',
    borderRadius: 7,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  skeletonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  skeletonSymbol: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  skeletonName: {
    height: 20,
    width: '50%',
    borderRadius: 10,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  skeletonBadge: {
    height: 24,
    width: 60,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
});
