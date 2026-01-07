/**
 * Authentic Istikhara Prayer Guide
 * =================================
 * Step-by-step guide following the authentic Sunnah method
 * Based on the hadith narrated by Jabir ibn Abdullah (RA)
 * Sahih al-Bukhari 1162
 */

import { ElementAccents, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
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
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();
  const [activeSection, setActiveSection] = useState<StepSection>('introduction');
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({
    intro: true,
  });

  const toggleStep = (stepId: string) => {
    setExpandedSteps(prev => ({ ...prev, [stepId]: !prev[stepId] }));
  };

  const renderIntroduction = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{t('modules.guidedIstikhara.intro.title')}</Text>
      <Text style={styles.bodyText}>
        {t('modules.guidedIstikhara.intro.description')}
      </Text>
      
      <View style={styles.hadithBox}>
        <Text style={styles.hadithLabel}>📖 {t('modules.guidedIstikhara.intro.hadith.title')}</Text>
        <Text style={styles.hadithText}>
          {t('modules.guidedIstikhara.intro.hadith.text')}
        </Text>
        <Text style={styles.hadithReference}>{t('modules.guidedIstikhara.intro.hadith.source')}</Text>
      </View>

      <View style={styles.importantBox}>
        <Ionicons name="information-circle" size={24} color="#FFD700" />
        <View style={{ flex: 1 }}>
          <Text style={styles.importantTitle}>{t('modules.guidedIstikhara.intro.understanding.title')}</Text>
          <Text style={styles.importantText}>
            {t('modules.guidedIstikhara.intro.understanding.text')}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => setActiveSection('prerequisites')}
      >
        <Text style={styles.nextButtonText}>{t('modules.guidedIstikhara.intro.cta')}</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderPrerequisites = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{t('modules.guidedIstikhara.prepare.title')}</Text>
      
      <StepCard
        number={1}
        title={t('modules.guidedIstikhara.prepare.step1.title')}
        titleAr="الوضوء"
        icon="💧"
        expanded={expandedSteps.wudu}
        onToggle={() => toggleStep('wudu')}
      >
        <Text style={styles.stepText}>
          {t('modules.guidedIstikhara.prepare.step1.body')}
        </Text>
        <Text style={styles.stepSubText}>
          {t('modules.guidedIstikhara.prepare.step1.bullets.0')}{('\n')}
          {t('modules.guidedIstikhara.prepare.step1.bullets.1')}{('\n')}
          {t('modules.guidedIstikhara.prepare.step1.bullets.2')}
        </Text>
      </StepCard>

      <StepCard
        number={2}
        title={t('modules.guidedIstikhara.prepare.step2.title')}
        titleAr="مكان نظيف"
        icon="🕌"
        expanded={expandedSteps.place}
        onToggle={() => toggleStep('place')}
      >
        <Text style={styles.stepText}>
          {t('modules.guidedIstikhara.prepare.step2.body')}
        </Text>
      </StepCard>

      <StepCard
        number={3}
        title={t('modules.guidedIstikhara.prepare.step3.title')}
        titleAr="قرار واضح"
        icon="💭"
        expanded={expandedSteps.decision}
        onToggle={() => toggleStep('decision')}
      >
        <Text style={styles.stepText}>
          {t('modules.guidedIstikhara.prepare.step3.body')}
        </Text>
        <View style={styles.noteBox}>
          <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
          <Text style={styles.noteText}>
            {t('modules.guidedIstikhara.prepare.step3.note')}
          </Text>
        </View>
      </StepCard>

      <StepCard
        number={4}
        title={t('modules.guidedIstikhara.prepare.step4.title')}
        titleAr="الوقت المناسب"
        icon="🕐"
        expanded={expandedSteps.timing}
        onToggle={() => toggleStep('timing')}
      >
        <Text style={styles.stepText}>
          {t('modules.guidedIstikhara.prepare.step4.body')}
        </Text>
        <Text style={styles.stepSubText}>
          ❌ {t('modules.guidedIstikhara.prepare.step4.avoid.0')}{('\n')}
          ❌ {t('modules.guidedIstikhara.prepare.step4.avoid.1')}{('\n')}
          ❌ {t('modules.guidedIstikhara.prepare.step4.avoid.2')}
        </Text>
        <Text style={styles.stepText}>
          ✅ {t('modules.guidedIstikhara.prepare.step4.best')}
        </Text>
      </StepCard>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => setActiveSection('prayer')}
      >
        <Text style={styles.nextButtonText}>{t('modules.guidedIstikhara.prepare.cta')}</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderPrayer = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{t('modules.guidedIstikhara.prayer.title')}</Text>
      
      <View style={styles.importantBox}>
        <Ionicons name="star" size={24} color="#FFD700" />
        <View style={{ flex: 1 }}>
          <Text style={styles.importantTitle}>{t('modules.guidedIstikhara.prayer.prayerType.title')}</Text>
          <Text style={styles.importantText}>
            {t('modules.guidedIstikhara.prayer.prayerType.body')}
          </Text>
        </View>
      </View>

      <StepCard
        number={1}
        title={t('modules.guidedIstikhara.prayer.step1.title')}
        titleAr="النية"
        icon="🤲"
        expanded={expandedSteps.niyyah}
        onToggle={() => toggleStep('niyyah')}
      >
        <Text style={styles.stepText}>
          {t('modules.guidedIstikhara.prayer.step1.body')}
        </Text>
        <Text style={styles.stepNote}>
          {t('modules.guidedIstikhara.prayer.step1.note')}
        </Text>
      </StepCard>

      <StepCard
        number={2}
        title={t('modules.guidedIstikhara.prayer.step2.title')}
        titleAr="الركعة الأولى"
        icon="1️⃣"
        expanded={expandedSteps.rakat1}
        onToggle={() => toggleStep('rakat1')}
      >
        <Text style={styles.stepText}>
          {t('modules.guidedIstikhara.prayer.step2.items.0') + '\n'}
          {t('modules.guidedIstikhara.prayer.step2.items.1') + '\n'}
          {t('modules.guidedIstikhara.prayer.step2.items.2') + '\n'}
          {t('modules.guidedIstikhara.prayer.step2.items.3') + '\n'}
          {t('modules.guidedIstikhara.prayer.step2.items.4') + '\n'}
          {t('modules.guidedIstikhara.prayer.step2.items.5') + '\n'}
          {t('modules.guidedIstikhara.prayer.step2.items.6') + '\n'}
          {t('modules.guidedIstikhara.prayer.step2.items.7')}
        </Text>
      </StepCard>

      <StepCard
        number={3}
        title={t('modules.guidedIstikhara.prayer.step3.title')}
        titleAr="الركعة الثانية"
        icon="2️⃣"
        expanded={expandedSteps.rakat2}
        onToggle={() => toggleStep('rakat2')}
      >
        <Text style={styles.stepText}>
          {t('modules.guidedIstikhara.prayer.step3.items.0') + '\n'}
          {t('modules.guidedIstikhara.prayer.step3.items.1') + '\n'}
          {t('modules.guidedIstikhara.prayer.step3.items.2') + '\n'}
          {t('modules.guidedIstikhara.prayer.step3.items.3') + '\n'}
          {t('modules.guidedIstikhara.prayer.step3.items.4') + '\n'}
          {t('modules.guidedIstikhara.prayer.step3.items.5') + '\n'}
          {t('modules.guidedIstikhara.prayer.step3.items.6')}
        </Text>
      </StepCard>

      <View style={styles.tipBox}>
        <Text style={styles.tipTitle}>💡 {t('modules.guidedIstikhara.prayer.tip.title')}</Text>
        <Text style={styles.tipText}>
          {t('modules.guidedIstikhara.prayer.tip.firstRakat') + '\n'}
          {t('modules.guidedIstikhara.prayer.tip.secondRakat')}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => setActiveSection('dua')}
      >
        <Text style={styles.nextButtonText}>{t('modules.guidedIstikhara.prayer.cta')}</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderDua = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{t('modules.guidedIstikhara.dua.title')}</Text>
      
      <View style={styles.importantBox}>
        <Ionicons name="book" size={24} color="#FFD700" />
        <View style={{ flex: 1 }}>
          <Text style={styles.importantTitle}>{t('modules.guidedIstikhara.dua.when.title')}</Text>
          <Text style={styles.importantText}>
            {t('modules.guidedIstikhara.dua.when.body')}
          </Text>
        </View>
      </View>

      <View style={styles.duaCard}>
        <Text style={styles.duaLabel}>{t('modules.guidedIstikhara.dua.arabicTitle')}</Text>
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
        <Text style={styles.duaLabel}>{t('modules.guidedIstikhara.dua.transliterationTitle')}</Text>
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
        <Text style={styles.duaLabel}>{t('modules.guidedIstikhara.dua.translationTitle')}</Text>
        <Text style={styles.translationText}>
          {t('modules.guidedIstikhara.dua.translation.p1')}
        </Text>
        <Text style={styles.translationText}>
          {t('modules.guidedIstikhara.dua.translation.p2')}
        </Text>
        <Text style={styles.translationText}>
          {t('modules.guidedIstikhara.dua.translation.p3')}
        </Text>
      </View>

      <View style={styles.noteBox}>
        <Ionicons name="alert-circle" size={20} color="#FF9800" />
        <Text style={styles.noteText}>
          {t('modules.guidedIstikhara.dua.note')}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => setActiveSection('after')}
      >
        <Text style={styles.nextButtonText}>{t('modules.guidedIstikhara.dua.cta')}</Text>
        <Ionicons name="arrow-forward" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  const renderAfter = () => (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionTitle}>{t('modules.guidedIstikhara.after.title')}</Text>

      <View style={styles.importantBox}>
        <Ionicons name="heart" size={24} color="#E91E63" />
        <View style={{ flex: 1 }}>
          <Text style={styles.importantTitle}>{t('modules.guidedIstikhara.after.trust.title')}</Text>
          <Text style={styles.importantText}>
            {t('modules.guidedIstikhara.after.trust.body')}
          </Text>
        </View>
      </View>

      <StepCard
        number={1}
        title={t('modules.guidedIstikhara.after.expect.title')}
        titleAr="ما يتوقع"
        icon="✨"
        expanded={expandedSteps.expect}
        onToggle={() => toggleStep('expect')}
      >
        <Text style={styles.stepText}>
          {t('modules.guidedIstikhara.after.expect.body')}
        </Text>
        <Text style={styles.stepSubText}>
          ✅ {t('modules.guidedIstikhara.after.expect.do1')}{' \n'}
          ✅ {t('modules.guidedIstikhara.after.expect.do2')}{' \n'}
          ✅ {t('modules.guidedIstikhara.after.expect.do3')}{' \n'}
          ❌ {t('modules.guidedIstikhara.after.expect.avoid1')}{' \n'}
          ❌ {t('modules.guidedIstikhara.after.expect.avoid2')}
        </Text>
      </StepCard>

      <StepCard
        number={2}
        title={t('modules.guidedIstikhara.after.action.title')}
        titleAr="اتخذ إجراء"
        icon="🚶"
        expanded={expandedSteps.action}
        onToggle={() => toggleStep('action')}
      >
        <Text style={styles.stepText}>
          {t('modules.guidedIstikhara.after.action.body')}
        </Text>
        <View style={styles.tipBox}>
          <Text style={styles.tipText}>
            {t('modules.guidedIstikhara.after.action.note1')}{' \n'}
            {t('modules.guidedIstikhara.after.action.note2')}
          </Text>
        </View>
      </StepCard>

      <StepCard
        number={3}
        title={t('modules.guidedIstikhara.after.repeat.title')}
        titleAr="كم مرة"
        icon="🔄"
        expanded={expandedSteps.repeat}
        onToggle={() => toggleStep('repeat')}
      >
        <Text style={styles.stepText}>
          {t('modules.guidedIstikhara.after.repeat.body')}
        </Text>
        <Text style={styles.stepNote}>
          {t('modules.guidedIstikhara.after.repeat.note')}
        </Text>
      </StepCard>

      <StepCard
        number={4}
        title={t('modules.guidedIstikhara.after.mistakes.title')}
        titleAr="أخطاء شائعة"
        icon="⚠️"
        expanded={expandedSteps.mistakes}
        onToggle={() => toggleStep('mistakes')}
      >
        <Text style={styles.stepSubText}>
          ❌ {t('modules.guidedIstikhara.after.mistakes.1')}{' \n'}
          ❌ {t('modules.guidedIstikhara.after.mistakes.2')}{' \n'}
          ❌ {t('modules.guidedIstikhara.after.mistakes.3')}{' \n'}
          ❌ {t('modules.guidedIstikhara.after.mistakes.4')}{' \n'}
          ❌ {t('modules.guidedIstikhara.after.mistakes.5')}
        </Text>
      </StepCard>

      <View style={styles.finalBox}>
        <Text style={styles.finalTitle}>🤲 {t('modules.guidedIstikhara.after.remember.title')}</Text>
        <Text style={styles.finalText}>
          {t('modules.guidedIstikhara.after.remember.text')}
        </Text>
        <Text style={styles.finalReference}>— Quran 65:3</Text>
      </View>

      <TouchableOpacity
        style={[styles.nextButton, { backgroundColor: '#4CAF50' }]}
        onPress={() => router.back()}
      >
        <Ionicons name="checkmark-circle" size={24} color="#fff" />
        <Text style={styles.nextButtonText}>{t('modules.guidedIstikhara.after.cta')}</Text>
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
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#1e1b4b', '#312e81']}
        style={styles.gradientContainer}
      >
        {/* Back Button - Minimal */}
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
            <Text style={styles.backButtonText}>{t('modules.guidedIstikhara.common.back')}</Text>
          </TouchableOpacity>
        </View>

        {/* Progress Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
        contentContainerStyle={styles.tabsContent}
      >
        <TabButton
          label={t('modules.guidedIstikhara.steps.intro')}
          icon="information-circle"
          active={activeSection === 'introduction'}
          onPress={() => setActiveSection('introduction')}
        />
        <TabButton
          label={t('modules.guidedIstikhara.steps.prepare')}
          icon="checkmark-circle"
          active={activeSection === 'prerequisites'}
          onPress={() => setActiveSection('prerequisites')}
        />
        <TabButton
          label={t('modules.guidedIstikhara.steps.prayer')}
          icon="moon"
          active={activeSection === 'prayer'}
          onPress={() => setActiveSection('prayer')}
        />
        <TabButton
          label={t('modules.guidedIstikhara.steps.dua')}
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
        contentContainerStyle={[styles.contentContainer, { paddingBottom: insets.bottom + 80 }]}
        showsVerticalScrollIndicator={false}
      >
        {renderContent()}
      </ScrollView>
      </LinearGradient>
    </View>
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
    backgroundColor: '#0f172a',
  },
  gradientContainer: {
    flex: 1,
  },
  backButtonContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: Typography.weightMedium as any,
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
