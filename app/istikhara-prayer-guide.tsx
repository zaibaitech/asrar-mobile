/**
 * Authentic Istikhara Prayer Guide
 * =================================
 * Step-by-step guide following the authentic Sunnah method
 * Based on the hadith narrated by Jabir ibn Abdullah (RA)
 * Sahih al-Bukhari 1162
 */

import { ElementAccents, Spacing, Typography } from '@/constants/DarkTheme';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

type StepSection = 'introduction' | 'prerequisites' | 'prayer' | 'dua' | 'after';

interface Step {
  id: string;
  title: string;
  titleAr: string;
  icon: string;
  color: string;
  content: React.ReactNode;
}

export default function IstkharaPrayerGuideScreen() {
  const [activeSection, setActiveSection] = useState<StepSection>('introduction');
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({
    intro: true,
  });

  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const renderIntroduction = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>What is Salat al-Istikhara?</Text>
      <Text style={styles.bodyText}>
        Ṣalāt al-Istikhārah (Prayer of Seeking Guidance) is a blessed Sunnah prayer taught by Prophet Muhammad ﷺ to seek Allah's guidance when making important decisions.
      </Text>
      
      <View style={styles.hadithBox}>
        <Text style={styles.hadithLabel}>📖 Authentic Hadith</Text>
        <Text style={styles.hadithText}>
          Jabir ibn Abdullah (RA) narrated: "The Prophet ﷺ used to teach us to seek Allah's counsel in all matters, just as he used to teach us a chapter from the Quran."
        </Text>
        <Text style={styles.hadithReference}>— Sahih al-Bukhari 1162</Text>
      </View>

      <View style={styles.importantBox}>
        <Ionicons name="information-circle" size={24} color="#FFD700" />
        <View style={{ flex: 1 }}>
          <Text style={styles.importantTitle}>Important Understanding</Text>
          <Text style={styles.importantText}>
            Istikhara is NOT fortune-telling. It is seeking Allah's guidance to make the decision easier and to place your trust in His wisdom, not to see dreams or receive mystical signs.
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => setActiveSection('prerequisites')}
      >
        <Text style={styles.nextButtonText}>Begin Preparation</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderPrerequisites = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>Before You Begin</Text>
      
      <StepCard
        number={1}
        title="Make Wudu"
        titleAr="الوضوء"
        icon="💧"
        expanded={expandedSteps.wudu}
        onToggle={() => toggleStep('wudu')}
      >
        <Text style={styles.stepText}>
          Perform complete wudu (ablution) as you would for any obligatory prayer. You must be in a state of ritual purity.
        </Text>
        <Text style={styles.stepSubText}>
          • Wash hands, rinse mouth, rinse nose{'\n'}
          • Wash face, arms to elbows{'\n'}
          • Wipe head, wash feet to ankles
        </Text>
      </StepCard>

      <StepCard
        number={2}
        title="Find a Clean, Quiet Place"
        titleAr="مكان نظيف"
        icon="🕌"
        expanded={expandedSteps.place}
        onToggle={() => toggleStep('place')}
      >
        <Text style={styles.stepText}>
          Choose a clean area where you can pray without interruption. Face the Qibla (direction of the Kaaba in Makkah).
        </Text>
      </StepCard>

      <StepCard
        number={3}
        title="Have a Clear Decision in Mind"
        titleAr="قرار واضح"
        icon="💭"
        expanded={expandedSteps.decision}
        onToggle={() => toggleStep('decision')}
      >
        <Text style={styles.stepText}>
          Before praying, clearly define the matter you're seeking guidance about. Istikhara is for when you have two permissible options and need help choosing.
        </Text>
        <View style={styles.noteBox}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.noteText}>
            Istikhara is for halal matters only. Don't pray istikhara about something clearly forbidden.
          </Text>
        </View>
      </StepCard>

      <StepCard
        number={4}
        title="Choose the Right Time"
        titleAr="الوقت المناسب"
        icon="🕐"
        expanded={expandedSteps.timing}
        onToggle={() => toggleStep('timing')}
      >
        <Text style={styles.stepText}>
          Istikhara can be prayed at any time EXCEPT:
        </Text>
        <Text style={styles.stepSubText}>
          ❌ After Fajr until 15 minutes after sunrise{'\n'}
          ❌ When sun is at its zenith (around Dhuhr time){'\n'}
          ❌ After Asr until sunset
        </Text>
        <Text style={styles.stepText}>
          ✅ Best times: Last third of night, after any obligatory prayer, or between Maghrib and Isha.
        </Text>
      </StepCard>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => setActiveSection('prayer')}
      >
        <Text style={styles.nextButtonText}>Continue to Prayer</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderPrayer = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>The Two Rakats Prayer</Text>
      
      <View style={styles.importantBox}>
        <Ionicons name="star" size={24} color="#FFD700" />
        <View style={{ flex: 1 }}>
          <Text style={styles.importantTitle}>Prayer Type</Text>
          <Text style={styles.importantText}>
            This is a voluntary (Nafl) prayer of 2 rakats, performed like any other voluntary prayer.
          </Text>
        </View>
      </View>

      <StepCard
        number={1}
        title="Make Intention (Niyyah)"
        titleAr="النية"
        icon="🤲"
        expanded={expandedSteps.niyyah}
        onToggle={() => toggleStep('niyyah')}
      >
        <Text style={styles.stepText}>
          In your heart, intend: "I am praying two rakats of Salat al-Istikhara seeking Allah's guidance."
        </Text>
        <Text style={styles.stepNote}>
          Note: The intention is in the heart, not spoken aloud.
        </Text>
      </StepCard>

      <StepCard
        number={2}
        title="First Rakat"
        titleAr="الركعة الأولى"
        icon="1️⃣"
        expanded={expandedSteps.rakat1}
        onToggle={() => toggleStep('rakat1')}
      >
        <Text style={styles.stepText}>
          1. Say Takbir (Allahu Akbar) and raise hands{'\n'}
          2. Recite Surah Al-Fatihah{'\n'}
          3. Recite a Surah (recommended: Surah Al-Kafirun){'\n'}
          4. Perform Ruku (bowing){'\n'}
          5. Stand up, then go to Sujud (prostration){'\n'}
          6. Sit briefly between the two prostrations{'\n'}
          7. Perform second Sujud{'\n'}
          8. Stand up for the second rakat
        </Text>
      </StepCard>

      <StepCard
        number={3}
        title="Second Rakat"
        titleAr="الركعة الثانية"
        icon="2️⃣"
        expanded={expandedSteps.rakat2}
        onToggle={() => toggleStep('rakat2')}
      >
        <Text style={styles.stepText}>
          1. Recite Surah Al-Fatihah{'\n'}
          2. Recite a Surah (recommended: Surah Al-Ikhlas){'\n'}
          3. Perform Ruku{'\n'}
          4. Perform the two Sujud{'\n'}
          5. Sit for Tashahhud{'\n'}
          6. Send blessings on the Prophet (Salawat){'\n'}
          7. Make Salam to conclude
        </Text>
      </StepCard>

      <View style={styles.tipBox}>
        <Text style={styles.tipTitle}>💡 Tip: Recommended Surahs</Text>
        <Text style={styles.tipText}>
          First Rakat: After Al-Fatihah, recite "Qul ya ayyuhal-kafirun" (Surah 109){'\n'}
          Second Rakat: After Al-Fatihah, recite "Qul Huwa Allahu Ahad" (Surah 112)
        </Text>
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => setActiveSection('dua')}
      >
        <Text style={styles.nextButtonText}>Continue to Dua</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderDua = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>The Istikhara Dua</Text>
      
      <View style={styles.importantBox}>
        <Ionicons name="book" size={24} color="#FFD700" />
        <View style={{ flex: 1 }}>
          <Text style={styles.importantTitle}>When to Recite</Text>
          <Text style={styles.importantText}>
            After completing the 2 rakats and making Salam, praise Allah, send blessings upon the Prophet ﷺ, then recite this dua.
          </Text>
        </View>
      </View>

      <View style={styles.duaCard}>
        <Text style={styles.duaLabel}>The Complete Dua in Arabic</Text>
        <View style={styles.arabicBox}>
          <Text style={styles.arabicText}>
            اللَّهُمَّ إِنِّي أَسْتَخِيرُكَ بِعِلْمِكَ، وَأَسْتَقْدِرُكَ بِقُدْرَتِكَ، وَأَسْأَلُكَ مِنْ فَضْلِكَ الْعَظِيمِ، فَإِنَّكَ تَقْدِرُ وَلَا أَقْدِرُ، وَتَعْلَمُ وَلَا أَعْلَمُ، وَأَنْتَ عَلَّامُ الْغُيُوبِ
          </Text>
          <Text style={styles.arabicText}>
            اللَّهُمَّ إِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ خَيْرٌ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي - أَوْ قَالَ: عَاجِلِ أَمْرِي وَآجِلِهِ - فَاقْدُرْهُ لِي وَيَسِّرْهُ لِي ثُمَّ بَارِكْ لِي فِيهِ
          </Text>
          <Text style={styles.arabicText}>
            وَإِنْ كُنْتَ تَعْلَمُ أَنَّ هَذَا الْأَمْرَ شَرٌّ لِي فِي دِينِي وَمَعَاشِي وَعَاقِبَةِ أَمْرِي - أَوْ قَالَ: عَاجِلِ أَمْرِي وَآجِلِهِ - فَاصْرِفْهُ عَنِّي وَاصْرِفْنِي عَنْهُ، وَاقْدُرْ لِيَ الْخَيْرَ حَيْثُ كَانَ ثُمَّ أَرْضِنِي بِهِ
          </Text>
        </View>
      </View>

      <View style={styles.duaCard}>
        <Text style={styles.duaLabel}>Transliteration</Text>
        <Text style={styles.translitText}>
          Allahumma inni astakhiruka bi'ilmika, wa astaqdiruka bi qudratika, wa as'aluka min fadlikal-'azim, fa innaka taqdiru wa la aqdir, wa ta'lamu wa la a'lam, wa anta 'allamul-ghuyub.
        </Text>
        <Text style={styles.translitText}>
          Allahumma in kunta ta'lamu anna hadhal-amra khayrun li fi dini wa ma'ashi wa 'aqibati amri, faqdurhu li wa yassirhu li thumma barik li fih.
        </Text>
        <Text style={styles.translitText}>
          Wa in kunta ta'lamu anna hadhal-amra sharrun li fi dini wa ma'ashi wa 'aqibati amri, fasrifhu 'anni wasrifni 'anhu, waqdur liyal-khayra haythu kan, thumma ardini bih.
        </Text>
      </View>

      <View style={styles.duaCard}>
        <Text style={styles.duaLabel}>Translation</Text>
        <Text style={styles.translationText}>
          "O Allah, I seek Your guidance by virtue of Your knowledge, and I seek ability by virtue of Your power, and I ask You of Your great bounty. For You have power and I have none. And You know and I know not. You are the Knower of hidden things.
        </Text>
        <Text style={styles.translationText}>
          O Allah, if You know that this matter [mention your specific matter here] is good for me in my religion, my livelihood, and the outcome of my affairs—both immediate and in the future—then ordain it for me, make it easy for me, and bless it for me.
        </Text>
        <Text style={styles.translationText}>
          And if You know that this matter is bad for me in my religion, my livelihood, and the outcome of my affairs—both immediate and in the future—then turn it away from me and turn me away from it, and ordain for me what is good wherever it may be, and make me pleased with it."
        </Text>
      </View>

      <View style={styles.noteBox}>
        <Ionicons name="alert-circle" size={20} color="#FF9800" />
        <Text style={styles.noteText}>
          When you reach "hadhal-amr" (this matter), specify your decision clearly. For example: "If marriage to [name] is good for me..." or "If accepting this job is good for me..."
        </Text>
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => setActiveSection('after')}
      >
        <Text style={styles.nextButtonText}>What Happens Next?</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderAfter = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>After the Prayer</Text>

      <View style={styles.importantBox}>
        <Ionicons name="heart" size={24} color="#E91E63" />
        <View style={{ flex: 1 }}>
          <Text style={styles.importantTitle}>Trust in Allah's Wisdom</Text>
          <Text style={styles.importantText}>
            The most important part of Istikhara is accepting Allah's decree with contentment, knowing He has chosen what is best for you.
          </Text>
        </View>
      </View>

      <StepCard
        number={1}
        title="What to Expect"
        titleAr="ما يتوقع"
        icon="✨"
        expanded={expandedSteps.expect}
        onToggle={() => toggleStep('expect')}
      >
        <Text style={styles.stepText}>
          Many people mistakenly think Istikhara means you'll see a dream or receive a sign. This is NOT required.
        </Text>
        <Text style={styles.stepSubText}>
          ✅ Look for ease and facilitation in one direction{'\n'}
          ✅ Notice which option feels more peaceful{'\n'}
          ✅ See which path opens up naturally{'\n'}
          ❌ Don't wait for mystical signs or dreams{'\n'}
          ❌ Don't keep repeating if you've already decided
        </Text>
      </StepCard>

      <StepCard
        number={2}
        title="Take Action"
        titleAr="اتخذ إجراء"
        icon="🚶"
        expanded={expandedSteps.action}
        onToggle={() => toggleStep('action')}
      >
        <Text style={styles.stepText}>
          After praying Istikhara, proceed with what seems best. Trust that Allah will make the good easy and block the harmful.
        </Text>
        <View style={styles.tipBox}>
          <Text style={styles.tipText}>
            If things become easy and flow smoothly, that's a positive sign.{'\n'}
            If unexpected obstacles arise, consider it Allah protecting you from harm.
          </Text>
        </View>
      </StepCard>

      <StepCard
        number={3}
        title="How Many Times?"
        titleAr="كم مرة"
        icon="🔄"
        expanded={expandedSteps.repeat}
        onToggle={() => toggleStep('repeat')}
      >
        <Text style={styles.stepText}>
          You can pray Istikhara once or repeat it up to 7 times if you're still uncertain. Some scholars say 3 times, others 7 times.
        </Text>
        <Text style={styles.stepNote}>
          But once you feel inclined toward a decision, trust that feeling and proceed. Don't become paralyzed by indecision.
        </Text>
      </StepCard>

      <StepCard
        number={4}
        title="Common Mistakes to Avoid"
        titleAr="أخطاء شائعة"
        icon="⚠️"
        expanded={expandedSteps.mistakes}
        onToggle={() => toggleStep('mistakes')}
      >
        <Text style={styles.stepSubText}>
          ❌ Praying Istikhara about something haram{'\n'}
          ❌ Expecting dreams or supernatural signs{'\n'}
          ❌ Repeating endlessly without taking action{'\n'}
          ❌ Praying after already making a decision{'\n'}
          ❌ Using it to avoid responsibility for your choice
        </Text>
      </StepCard>

      <View style={styles.finalBox}>
        <Text style={styles.finalTitle}>🤲 Remember</Text>
        <Text style={styles.finalText}>
          "And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose."
        </Text>
        <Text style={styles.finalReference}>— Quran 65:3</Text>
      </View>

      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: '#4CAF50' }]}
        onPress={() => router.back()}
      >
        <Ionicons name="checkmark-circle" size={24} color="#fff" />
        <Text style={styles.nextButtonText}>I Understand</Text>
      </TouchableOpacity>
    </View>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'introduction':
        return renderIntroduction();
      case 'prerequisites':
        return renderPrerequisites();
      case 'prayer':
        return renderPrayer();
      case 'dua':
        return renderDua();
      case 'after':
        return renderAfter();
    }
  };

  return (
    <LinearGradient
      colors={['#0f172a', '#1e1b4b', '#312e81']}
      style={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Authentic Istikhara Guide</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Progress Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        <TabButton
          label="Intro"
          icon="information-circle"
          active={activeSection === 'introduction'}
          onPress={() => setActiveSection('introduction')}
        />
        <TabButton
          label="Prepare"
          icon="checkmark-circle"
          active={activeSection === 'prerequisites'}
          onPress={() => setActiveSection('prerequisites')}
        />
        <TabButton
          label="Prayer"
          icon="moon"
          active={activeSection === 'prayer'}
          onPress={() => setActiveSection('prayer')}
        />
        <TabButton
          label="Dua"
          icon="book"
          active={activeSection === 'dua'}
          onPress={() => setActiveSection('dua')}
        />
        <TabButton
          label="After"
          icon="star"
          active={activeSection === 'after'}
          onPress={() => setActiveSection('after')}
        />
      </ScrollView>

      {/* Content */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
    </LinearGradient>
  );
}

interface TabButtonProps {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  onPress: () => void;
}

function TabButton({ label, icon, active, onPress }: TabButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.tab, active && styles.tabActive]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Ionicons name={icon} size={18} color={active ? '#fff' : 'rgba(255,255,255,0.5)'} />
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

interface StepCardProps {
  number: number;
  title: string;
  titleAr: string;
  icon: string;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

function StepCard({ number, title, titleAr, icon, expanded, onToggle, children }: StepCardProps) {
  return (
    <View style={styles.stepCard}>
      <TouchableOpacity
        style={styles.stepHeader}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <View style={styles.stepNumberBadge}>
          <Text style={styles.stepNumberText}>{number}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.stepTitle}>{icon} {title}</Text>
          <Text style={styles.stepTitleAr}>{titleAr}</Text>
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={24}
          color="rgba(255,255,255,0.5)"
        />
      </TouchableOpacity>
      {expanded && (
        <View style={styles.stepContent}>
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingTop: 60,
    paddingBottom: Spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: Typography.weightBold as any,
    color: '#fff',
  },
  tabsContainer: {
    flexGrow: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  tabsContent: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.xs,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  tabActive: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: Typography.weightSemibold as any,
    color: 'rgba(255,255,255,0.5)',
  },
  tabLabelActive: {
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: Spacing.lg,
  },
  sectionContainer: {
    gap: Spacing.lg,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: Typography.weightBold as any,
    color: '#fff',
    marginBottom: Spacing.sm,
  },
  bodyText: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.9)',
  },
  hadithBox: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderLeftWidth: 4,
    borderLeftColor: ElementAccents.air.primary,
    borderRadius: 12,
    padding: Spacing.lg,
    marginVertical: Spacing.md,
  },
  hadithLabel: {
    fontSize: 14,
    fontWeight: Typography.weightBold as any,
    color: ElementAccents.air.primary,
    marginBottom: Spacing.sm,
  },
  hadithText: {
    fontSize: 15,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.95)',
    fontStyle: 'italic',
    marginBottom: Spacing.sm,
  },
  hadithReference: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
  },
  importantBox: {
    flexDirection: 'row',
    gap: Spacing.md,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    borderRadius: 12,
    padding: Spacing.lg,
  },
  importantTitle: {
    fontSize: 16,
    fontWeight: Typography.weightBold as any,
    color: '#FFD700',
    marginBottom: 6,
  },
  importantText: {
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.9)',
  },
  stepCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  stepNumberBadge: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: ElementAccents.fire.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: Typography.weightBold as any,
    color: '#fff',
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: Typography.weightSemibold as any,
    color: '#fff',
    marginBottom: 2,
  },
  stepTitleAr: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  stepContent: {
    padding: Spacing.lg,
    paddingTop: 0,
    gap: Spacing.md,
  },
  stepText: {
    fontSize: 15,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.9)',
  },
  stepSubText: {
    fontSize: 14,
    lineHeight: 22,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: Spacing.md,
  },
  stepNote: {
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.6)',
    fontStyle: 'italic',
  },
  noteBox: {
    flexDirection: 'row',
    gap: Spacing.sm,
    backgroundColor: 'rgba(255, 152, 0, 0.1)',
    borderRadius: 8,
    padding: Spacing.md,
    alignItems: 'flex-start',
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.85)',
  },
  tipBox: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 8,
    padding: Spacing.md,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: Typography.weightBold as any,
    color: '#4CAF50',
    marginBottom: 6,
  },
  tipText: {
    fontSize: 13,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.85)',
  },
  duaCard: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderRadius: 12,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  duaLabel: {
    fontSize: 16,
    fontWeight: Typography.weightBold as any,
    color: ElementAccents.air.primary,
  },
  arabicBox: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 8,
    padding: Spacing.lg,
    gap: Spacing.md,
  },
  arabicText: {
    fontSize: 18,
    lineHeight: 32,
    color: '#fff',
    textAlign: 'right',
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'sans-serif',
  },
  translitText: {
    fontSize: 14,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.8)',
    fontStyle: 'italic',
  },
  translationText: {
    fontSize: 15,
    lineHeight: 24,
    color: 'rgba(255,255,255,0.95)',
  },
  finalBox: {
    backgroundColor: 'rgba(76, 175, 80, 0.15)',
    borderRadius: 12,
    padding: Spacing.xl,
    alignItems: 'center',
  },
  finalTitle: {
    fontSize: 20,
    fontWeight: Typography.weightBold as any,
    color: '#4CAF50',
    marginBottom: Spacing.sm,
  },
  finalText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#fff',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: Spacing.xs,
  },
  finalReference: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: ElementAccents.fire.primary,
    borderRadius: 12,
    padding: Spacing.lg,
    marginTop: Spacing.md,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: Typography.weightBold as any,
    color: '#fff',
  },
});
