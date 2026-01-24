import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import {
    AlertTriangle,
    Briefcase,
    CheckCircle,
    ChevronDown,
    ChevronUp,
    Download,
    Info,
    MessageCircle,
    Share2,
    Sparkles,
    TrendingUp
} from "lucide-react-native";
import React, { useState } from "react";
import {
    Alert,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { getElementColors } from "../../../constants/ElementColors";
import { useLanguage } from "../../../contexts/LanguageContext";
import type { IstikharaCalculationResult } from "../../../services/istikhara/types";

const { width } = Dimensions.get('window');

interface CareerTabAdvancedProps {
  result: IstikharaCalculationResult;
}

export default function CareerTabAdvanced({ result }: CareerTabAdvancedProps) {
  const { language } = useLanguage();
  const profile = result?.burujProfile;
  const career = profile?.career;
  const elementKey = ((profile?.element ?? 'fire').toLowerCase() as "fire" | "earth" | "air" | "water");
  const colors = getElementColors(elementKey);

  // DOB-based calculations (or other sources) may not include full career guidance.
  // Avoid crashing the entire Results screen if this section is unavailable.
  if (!profile || !career) {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
            <Briefcase size={32} color={colors.accent} />
          </View>
          <Text style={styles.title}>
            {language === 'en' ? 'Career & Vocation Guidance' : 'Orientation Professionnelle'}
          </Text>
          <Text style={styles.subtitle}>
            {language === 'en'
              ? 'Career guidance is not available for this calculation method.'
              : 'Le guide de carrière n\'est pas disponible pour cette méthode de calcul.'}
          </Text>
        </View>
      </ScrollView>
    );
  }
  
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [isExporting, setIsExporting] = useState(false);

  const categories = career?.modern_recommended?.[language as 'en' | 'fr'] || [];

  const toggleCategory = (index: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCategories(newExpanded);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const expandAll = async () => {
    if (categories) {
      setExpandedCategories(new Set(categories.map((_, i) => i)));
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  };

  const collapseAll = async () => {
    setExpandedCategories(new Set());
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    try {
      const html = generatePDFContent();
      const { uri } = await Print.printToFileAsync({ html });
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: language === 'en' ? 'Career Guidance PDF' : 'Guide de Carrière PDF'
        });
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert(
        language === 'en' ? 'Export Error' : 'Erreur d\'Export',
        language === 'en' ? 'Failed to export PDF' : 'Échec de l\'export PDF'
      );
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleShare = async () => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    const shareText = language === 'en' 
      ? `Discovered my career path through Istikhara al-Asmāʾ! My ${profile.element} element aligns with ${categories?.[0]?.category || 'various'} industries.`
      : `J'ai découvert ma voie professionnelle avec Istikhara al-Asmāʾ! Mon élément ${profile.element} s'aligne avec ${categories?.[0]?.category || 'diverses'} industries.`;

    try {
      await Sharing.shareAsync('data:text/plain;base64,' + btoa(shareText));
    } catch (error) {
      console.log('Share cancelled');
    }
  };

  const generatePDFContent = () => {
    const categoriesHTML = categories?.map(cat => `
      <div style="margin-bottom: 20px;">
        <h3 style="color: ${colors.accent};">${cat.icon} ${cat.category}</h3>
        <ul>
          ${cat.items.map(item => `<li>${item}</li>`).join('')}
        </ul>
      </div>
    `).join('') || '';

    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #1a1a2e; }
            h2 { color: ${colors.accent}; }
            .quote { font-style: italic; background: #f0f0f0; padding: 15px; border-left: 4px solid ${colors.accent}; }
          </style>
        </head>
        <body>
          <h1>${language === 'en' ? 'Career & Vocation Guidance' : 'Orientation Professionnelle'}</h1>
          <p><strong>${language === 'en' ? 'Element' : 'Élément'}:</strong> ${profile.element ?? ''} ${profile.element_emoji ?? ''}</p>
          
          <h2>${language === 'en' ? 'Traditional Wisdom' : 'Sagesse Traditionnelle'}</h2>
          <div class="quote">${career?.traditional?.[language as 'en' | 'fr'] ?? career?.traditional?.en ?? ''}</div>
          
          <h2>${language === 'en' ? 'Recommended Career Fields' : 'Domaines Professionnels Recommandés'}</h2>
          ${categoriesHTML}
          
          <h2>${language === 'en' ? 'Guiding Principle' : 'Principe Directeur'}</h2>
          <div class="quote">${career?.principle?.[language as 'en' | 'fr'] ?? career?.principle?.en ?? ''}</div>
        </body>
      </html>
    `;
  };

  const hasSpecialBlessing = elementKey === 'water' && 
    categories?.some(cat => cat.category.toLowerCase().includes(
      language === 'en' ? 'earth-based' : 'terrestres'
    ));

  const totalOpportunities = categories?.reduce((sum, cat) => sum + cat.items.length, 0) || 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.iconContainer, { backgroundColor: colors.background }]}>
          <Briefcase size={32} color={colors.accent} />
        </View>
        <Text style={styles.title}>
          {language === 'en' ? 'Career & Vocation Guidance' : 'Orientation Professionnelle'}
        </Text>
        <Text style={styles.subtitle}>
          {language === 'en' 
            ? 'Career paths that resonate with your spiritual energy' 
            : 'Parcours en harmonie avec votre énergie spirituelle'}
        </Text>
        
        {/* Element Badge */}
        <View style={[styles.elementBadge, { 
          backgroundColor: `${colors.accent}33`,
          borderColor: `${colors.accent}33`,
          shadowColor: colors.accent
        }]}>
          <Text style={styles.elementEmoji}>{profile.element_emoji}</Text>
          <Text style={[styles.elementText, { color: colors.accent }]}>
            {profile.element} {language === 'en' ? 'Element' : 'Élément'}
          </Text>
        </View>
      </View>

      {/* Traditional Guidance */}
      <View style={[styles.card, { 
        backgroundColor: `${colors.accent}33`,
        borderColor: `${colors.accent}33`,
        shadowColor: colors.accent
      }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardIcon, { backgroundColor: `${colors.accent}26` }]}>
            <Text style={styles.emoji}>📜</Text>
          </View>
          <View style={styles.cardHeaderText}>
            <Text style={[styles.cardTitle, { color: colors.accent }]}>
              {language === 'en' ? 'Traditional Wisdom' : 'Sagesse Traditionnelle'}
            </Text>
          </View>
        </View>
        
        <View style={styles.quoteContainer}>
          <Text style={styles.quote}>
            "{career?.traditional?.[language as 'en' | 'fr'] ?? career?.traditional?.en ?? ''}"
          </Text>
        </View>
        
        <View style={[styles.divider, { backgroundColor: `${colors.accent}26` }]} />
        <Text style={styles.quoteLabel}>
          {language === 'en' ? 'Traditional Islamic Guidance' : 'Guidance Islamique Traditionnelle'}
        </Text>
      </View>

      {/* Special Blessing Notice */}
      {hasSpecialBlessing && (
        <View style={[styles.card, styles.blessingCard, {
          backgroundColor: `${colors.accent}33`,
          borderColor: `${colors.accent}33`,
          shadowColor: colors.accent
        }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.blessingIcon, { backgroundColor: `${colors.accent}26` }]}>
              <Sparkles size={24} color={colors.accent} />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={[styles.blessingTitle, { color: colors.accent }]}>
                ✨ {language === 'en' ? 'Special Spiritual Blessing' : 'Bénédiction Spirituelle Spéciale'}
              </Text>
            </View>
          </View>
          <Text style={styles.blessingText}>
            {language === 'en' 
              ? 'Despite being a Water element, you receive special blessings from Earth industries. This unique gift allows you to thrive in both water-related AND earth-based careers.'
              : 'Bien que vous soyez un élément Eau, vous recevez des bénédictions spéciales des industries terrestres. Ce don unique vous permet de prospérer dans les carrières liées à l\'eau ET terrestres.'}
          </Text>
        </View>
      )}

      {/* Control Buttons */}
      <View style={styles.controls}>
        <View style={styles.controlsHeader}>
          <TrendingUp size={20} color={colors.accent} />
          <Text style={styles.controlsTitle}>
            {language === 'en' ? 'Recommended Career Fields' : 'Domaines Professionnels'}
          </Text>
        </View>
        <View style={styles.controlButtons}>
          <TouchableOpacity
            style={[styles.controlButton, { backgroundColor: colors.background }]}
            onPress={expandAll}
          >
            <Text style={[styles.controlButtonText, { color: colors.accent }]}>
              {language === 'en' ? 'Expand All' : 'Tout Développer'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.controlButton}
            onPress={collapseAll}
          >
            <Text style={styles.controlButtonText}>
              {language === 'en' ? 'Collapse All' : 'Tout Réduire'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Career Categories */}
      <View style={styles.categoriesContainer}>
        {categories && categories.length > 0 ? (
          categories.map((category, index) => {
            const isExpanded = expandedCategories.has(index);
            
            return (
              <View
                key={index}
                style={[styles.categoryCard, { 
                  backgroundColor: `${colors.accent}33`,
                  borderColor: `${colors.accent}33`,
                  shadowColor: colors.accent
                }]}
              >
                <TouchableOpacity
                  style={styles.categoryHeader}
                  onPress={() => toggleCategory(index)}
                  activeOpacity={0.7}
                >
                  <View style={styles.categoryHeaderLeft}>
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <View>
                      <Text style={styles.categoryTitle}>{category.category}</Text>
                      <Text style={styles.categoryCount}>
                        {category.items.length} {language === 'en' ? 'opportunities' : 'opportunités'}
                      </Text>
                    </View>
                  </View>
                  <View style={[styles.chevronContainer, { backgroundColor: `${colors.accent}26` }]}>
                    {isExpanded ? (
                      <ChevronUp size={20} color={colors.accent} />
                    ) : (
                      <ChevronDown size={20} color={colors.accent} />
                    )}
                  </View>
                </TouchableOpacity>

                {isExpanded && (
                  <View style={styles.categoryItems}>
                    <View style={styles.itemsDivider} />
                    {category.items.map((item, itemIndex) => (
                      <View key={itemIndex} style={styles.careerItem}>
                        <CheckCircle size={16} color={colors.accent} />
                        <Text style={styles.careerItemText}>{item}</Text>
                      </View>
                    ))}
                    <View style={styles.itemsFooter}>
                      <Text style={styles.itemsFooterText}>
                        {category.items.length} {language === 'en' ? 'career paths in this category' : 'parcours dans cette catégorie'}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <View style={styles.emptyState}>
            <MessageCircle size={48} color="rgba(255,255,255,0.3)" />
            <Text style={styles.emptyStateText}>
              {language === 'en' 
                ? 'Career guidance data is being compiled for your profile' 
                : 'Les données sont en cours de compilation pour votre profil'}
            </Text>
          </View>
        )}
      </View>

      {/* Guiding Principle */}
      <View style={[styles.card, { 
        backgroundColor: `${colors.accent}33`,
        borderColor: `${colors.accent}33`,
        shadowColor: colors.accent
      }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardIcon, { backgroundColor: `${colors.accent}26` }]}>
            <Text style={styles.emoji}>💡</Text>
          </View>
          <Text style={[styles.cardTitle, { color: colors.accent }]}>
            {language === 'en' ? 'Guiding Principle' : 'Principe Directeur'}
          </Text>
        </View>
        <Text style={styles.principleText}>
          "{career?.principle?.[language as 'en' | 'fr'] ?? career?.principle?.en ?? ''}"
        </Text>
        <Text style={styles.principleNote}>
          {language === 'en' 
            ? 'Let this principle guide your career decisions and professional journey.'
            : 'Laissez ce principe guider vos décisions de carrière et votre parcours professionnel.'}
        </Text>
      </View>

      {/* Fields to Avoid */}
      {((career?.avoid?.traditional?.[language as 'en' | 'fr'] ?? career?.avoid?.traditional?.en ?? "None specified") !== "None specified" && 
        (career?.avoid?.traditional?.[language as 'en' | 'fr'] ?? career?.avoid?.traditional?.en ?? "Aucun spécifié") !== "Aucun spécifié") && (
        <View style={[styles.card, styles.avoidCard, {
          backgroundColor: `${colors.accent}33`,
          borderColor: `${colors.accent}33`,
          shadowColor: colors.accent
        }]}>
          <View style={styles.cardHeader}>
            <View style={[styles.warningIcon, { backgroundColor: `${colors.accent}26` }]}>
              <AlertTriangle size={24} color={colors.accent} />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={[styles.avoidTitle, { color: colors.accent }]}>
                {language === 'en' ? 'Fields to Consider Carefully' : 'Domaines à Considérer Attentivement'}
              </Text>
              <Text style={styles.avoidSubtitle}>
                {language === 'en'
                  ? 'May not align optimally with your spiritual energy'
                  : 'Peuvent ne pas s\'aligner de manière optimale'}
              </Text>
            </View>
          </View>

          <View style={styles.avoidSection}>
            <Text style={styles.avoidSectionTitle}>
              📜 {language === 'en' ? 'Traditional Guidance:' : 'Guidance Traditionnelle:'}
            </Text>
            <Text style={styles.avoidQuote}>
              "{career?.avoid?.traditional?.[language as 'en' | 'fr'] ?? career?.avoid?.traditional?.en ?? ''}"
            </Text>
          </View>

          <View style={styles.avoidSection}>
            <Text style={styles.avoidSectionTitle}>
              🌍 {language === 'en' ? 'Modern Application:' : 'Application Moderne:'}
            </Text>
            <Text style={styles.avoidText}>
              {career?.avoid?.modern?.[language as 'en' | 'fr'] ?? career?.avoid?.modern?.en ?? ''}
            </Text>
          </View>

          <View style={styles.avoidNote}>
            <Info size={16} color="#fbbf24" />
            <Text style={styles.avoidNoteText}>
              {language === 'en' 
                ? 'Focus your primary efforts on the recommended fields above for optimal results.'
                : 'Concentrez vos efforts sur les domaines recommandés ci-dessus pour des résultats optimaux.'}
            </Text>
          </View>
        </View>
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={[styles.actionButton, { borderColor: colors.border }]}
          onPress={handleExportPDF}
          disabled={isExporting}
        >
          <LinearGradient
            colors={colors.primary}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.actionButtonGradient}
          >
            {isExporting ? (
              <Text style={styles.actionButtonText}>
                {language === 'en' ? 'Generating...' : 'Génération...'}
              </Text>
            ) : (
              <>
                <Download size={20} color="#FFF" />
                <Text style={styles.actionButtonText}>
                  {language === 'en' ? 'Download PDF' : 'Télécharger PDF'}
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButtonSecondary} onPress={handleShare}>
          <Share2 size={20} color="#FFF" />
          <Text style={styles.actionButtonText}>
            {language === 'en' ? 'Share' : 'Partager'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Statistics */}
      <View style={styles.stats}>
        <LinearGradient
          colors={colors.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.statCard, { borderColor: colors.border }]}
        >
          <Text style={styles.statValue}>{categories?.length || 0}</Text>
          <Text style={styles.statLabel}>
            {language === 'en' ? 'Career Fields' : 'Domaines'}
          </Text>
        </LinearGradient>

        <LinearGradient
          colors={colors.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.statCard, { borderColor: colors.border }]}
        >
          <Text style={styles.statValue}>{totalOpportunities}</Text>
          <Text style={styles.statLabel}>
            {language === 'en' ? 'Opportunities' : 'Opportunités'}
          </Text>
        </LinearGradient>

        <LinearGradient
          colors={colors.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.statCard, { borderColor: colors.border }]}
        >
          <Text style={styles.statEmoji}>{profile.element_emoji}</Text>
          <Text style={styles.statLabel}>
            {language === 'en' ? 'Your Element' : 'Votre Élément'}
          </Text>
        </LinearGradient>

        <LinearGradient
          colors={colors.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.statCard, { borderColor: colors.border }]}
        >
          <Text style={styles.statEmoji}>✨</Text>
          <Text style={styles.statLabel}>
            {language === 'en' ? 'Aligned Path' : 'Voie Alignée'}
          </Text>
        </LinearGradient>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B1020',
    padding: 16,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  elementBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 2,
  },
  elementEmoji: {
    fontSize: 24,
  },
  elementText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    marginBottom: 16,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 24,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  quoteContainer: {
    paddingLeft: 16,
    borderLeftWidth: 4,
    marginBottom: 16,
  },
  quote: {
    fontSize: 16,
    color: '#cbd5e1',
    fontStyle: 'italic',
    lineHeight: 24,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  quoteLabel: {
    fontSize: 12,
    color: '#94a3b8',
    textAlign: 'center',
  },
  blessingCard: {
  },
  blessingIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  blessingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  blessingText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 22,
  },
  controls: {
    marginBottom: 16,
  },
  controlsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  controlsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    flex: 1,
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(30, 58, 138, 0.4)',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.2)',
  },
  controlButtonText: {
    fontSize: 12,
    color: '#60a5fa',
    fontWeight: '600',
  },
  categoriesContainer: {
    gap: 12,
    marginBottom: 16,
  },
  categoryCard: {
    borderRadius: 12,
    borderWidth: 2,
    overflow: 'hidden',
    backgroundColor: 'rgba(30, 58, 138, 0.2)',
    borderColor: 'rgba(96, 165, 250, 0.2)',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  categoryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  categoryIcon: {
    fontSize: 28,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFF',
  },
  categoryCount: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  chevronContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryItems: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  itemsDivider: {
    height: 1,
    backgroundColor: 'rgba(96, 165, 250, 0.2)',
    marginBottom: 12,
  },
  careerItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    padding: 12,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 8,
    marginBottom: 8,
  },
  careerItemText: {
    flex: 1,
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  itemsFooter: {
    paddingTop: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(96, 165, 250, 0.1)',
  },
  itemsFooterText: {
    fontSize: 11,
    color: '#64748b',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    padding: 48,
    backgroundColor: 'rgba(30, 58, 138, 0.15)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.1)',
  },
  emptyStateText: {
    fontSize: 14,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 12,
  },
  principleText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
    lineHeight: 24,
    marginBottom: 12,
  },
  principleNote: {
    fontSize: 12,
    color: '#94a3b8',
    lineHeight: 18,
  },
  avoidCard: {
    borderColor: '#60a5fa',
  },
  warningIcon: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(96, 165, 250, 0.2)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avoidTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
  avoidSubtitle: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 2,
  },
  avoidSection: {
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  avoidSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#60a5fa',
    marginBottom: 8,
  },
  avoidQuote: {
    fontSize: 14,
    color: '#cbd5e1',
    fontStyle: 'italic',
    lineHeight: 20,
  },
  avoidText: {
    fontSize: 14,
    color: '#cbd5e1',
    lineHeight: 20,
  },
  avoidNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(30, 58, 138, 0.3)',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.2)',
  },
  avoidNoteText: {
    flex: 1,
    fontSize: 12,
    color: '#cbd5e1',
    lineHeight: 18,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 24,
  },
  actionButton: {
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
  },
  actionButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 16,
  },
  actionButtonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: 'rgba(30, 58, 138, 0.4)',
    paddingVertical: 16,
    borderRadius: 12,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  stats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: (width - 44) / 2,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    backgroundColor: 'rgba(30, 58, 138, 0.2)',
    borderColor: 'rgba(96, 165, 250, 0.2)',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFF',
  },
  statEmoji: {
    fontSize: 32,
  },
  statLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginTop: 4,
  },
});
