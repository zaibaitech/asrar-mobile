/**
 * Divine Timing Question Card
 * ============================
 * Phase 3: User input for guidance questions
 */

import Colors from '@/constants/Colors';
import {
    getGuidanceCategoryName,
    getTimeHorizonName,
    getUrgencyName,
} from '@/services/DivineTimingGuidanceService';
import {
    GuidanceCategory,
    TimeHorizon,
    UrgencyLevel,
} from '@/types/divine-timing-guidance';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

const CATEGORIES: GuidanceCategory[] = [
  'study_exam',
  'work_career',
  'money_business',
  'travel',
  'relationships_family',
  'health_wellbeing',
  'spiritual_practice',
  'decisions_general',
];

const CATEGORY_ICONS: Record<GuidanceCategory, keyof typeof Ionicons.glyphMap> = {
  study_exam: 'school-outline',
  work_career: 'briefcase-outline',
  money_business: 'cash-outline',
  travel: 'airplane-outline',
  relationships_family: 'people-outline',
  health_wellbeing: 'heart-outline',
  spiritual_practice: 'moon-outline',
  decisions_general: 'help-circle-outline',
};

const TIME_HORIZONS: TimeHorizon[] = ['today', 'this_week', 'this_month'];
const URGENCY_LEVELS: UrgencyLevel[] = ['low', 'medium', 'high'];

interface DivineTimingQuestionCardProps {
  onSubmit: (
    question: string,
    category: GuidanceCategory,
    timeHorizon: TimeHorizon,
    urgency: UrgencyLevel
  ) => void;
  colorScheme?: 'light' | 'dark';
  initialCategory?: GuidanceCategory;
  initialTimeHorizon?: TimeHorizon;
  initialUrgency?: UrgencyLevel;
}

export function DivineTimingQuestionCard({
  onSubmit,
  colorScheme = 'light',
  initialCategory,
  initialTimeHorizon = 'today',
  initialUrgency = 'medium',
}: DivineTimingQuestionCardProps) {
  const colors = Colors[colorScheme];
  
  const [question, setQuestion] = useState('');
  const [category, setCategory] = useState<GuidanceCategory | null>(
    initialCategory || null
  );
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>(initialTimeHorizon);
  const [urgency, setUrgency] = useState<UrgencyLevel>(initialUrgency);
  const [error, setError] = useState('');
  
  const handleSubmit = () => {
    // Validation
    if (!question.trim()) {
      setError('Please enter your question');
      return;
    }
    
    if (!category) {
      setError('Please select a category');
      return;
    }
    
    if (question.length > 200) {
      setError('Question must be 200 characters or less');
      return;
    }
    
    setError('');
    onSubmit(question.trim(), category, timeHorizon, urgency);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="chatbubble-ellipses-outline" size={24} color={colors.primary} />
        <Text style={[styles.title, { color: colors.text }]}>
          Ask Divine Timing
        </Text>
      </View>
      
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Receive spiritual reflection for your question
      </Text>
      
      {/* Question Input */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text }]}>Your Question</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colorScheme === 'dark' ? '#0f1419' : '#fafafa',
              color: colors.text,
              borderColor: error ? '#ef4444' : 'transparent',
            },
          ]}
          placeholder="e.g., Is it a good time to start my exam preparation?"
          placeholderTextColor={colors.textSecondary}
          value={question}
          onChangeText={(text) => {
            setQuestion(text);
            setError('');
          }}
          multiline
          maxLength={200}
          numberOfLines={3}
        />
        <Text style={[styles.charCount, { color: colors.textSecondary }]}>
          {question.length}/200
        </Text>
      </View>
      
      {/* Category Selection */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text }]}>Category *</Text>
        <View style={styles.categoryGrid}>
          {CATEGORIES.map((cat) => {
            const isSelected = category === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  {
                    backgroundColor: isSelected ? colors.primary : (colorScheme === 'dark' ? '#1a1a1a' : '#f5f5f5'),
                    borderColor: isSelected ? colors.primary : 'transparent',
                  },
                ]}
                onPress={() => {
                  setCategory(cat);
                  setError('');
                }}
              >
                <Ionicons
                  name={CATEGORY_ICONS[cat]}
                  size={18}
                  color={isSelected ? '#fff' : colors.text}
                />
                <Text
                  style={[
                    styles.categoryText,
                    { color: isSelected ? '#fff' : colors.text },
                  ]}
                  numberOfLines={1}
                >
                  {getGuidanceCategoryName(cat)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      
      {/* Time Horizon */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text }]}>Time Frame</Text>
        <View style={styles.toggleRow}>
          {TIME_HORIZONS.map((horizon) => {
            const isSelected = timeHorizon === horizon;
            return (
              <TouchableOpacity
                key={horizon}
                style={[
                  styles.toggleButton,
                  {
                    backgroundColor: isSelected ? colors.primary : 'transparent',
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => setTimeHorizon(horizon)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    { color: isSelected ? '#fff' : colors.primary },
                  ]}
                >
                  {getTimeHorizonName(horizon)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      
      {/* Urgency */}
      <View style={styles.section}>
        <Text style={[styles.label, { color: colors.text }]}>Urgency</Text>
        <View style={styles.toggleRow}>
          {URGENCY_LEVELS.map((level) => {
            const isSelected = urgency === level;
            return (
              <TouchableOpacity
                key={level}
                style={[
                  styles.toggleButton,
                  {
                    backgroundColor: isSelected ? colors.primary : 'transparent',
                    borderColor: colors.primary,
                  },
                ]}
                onPress={() => setUrgency(level)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    { color: isSelected ? '#fff' : colors.primary },
                  ]}
                >
                  {getUrgencyName(level)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      
      {/* Error Message */}
      {error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={16} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
      
      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitButton,
          {
            backgroundColor: question.trim() && category ? colors.primary : colors.textSecondary,
            opacity: question.trim() && category ? 1 : 0.5,
          },
        ]}
        onPress={handleSubmit}
        disabled={!question.trim() || !category}
      >
        <Ionicons name="sparkles" size={20} color="#fff" />
        <Text style={styles.submitButtonText}>Get Guidance</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
    fontStyle: 'italic',
  },
  section: {
    gap: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
  },
  charCount: {
    fontSize: 11,
    textAlign: 'right',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1.5,
    minWidth: '30%',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 13,
    fontWeight: '600',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
  },
  errorText: {
    fontSize: 13,
    color: '#dc2626',
    flex: 1,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
