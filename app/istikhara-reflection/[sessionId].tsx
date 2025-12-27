/**
 * Istikhārah Daily Reflection Tracker
 * ====================================
 * Post-prayer reflection logging (observational only)
 * 
 * CRITICAL: This does NOT interpret dreams or provide verdicts.
 * This is for personal pattern awareness only.
 */

import Colors from '@/constants/Colors';
import {
    addReflectionEntry,
    calculatePatternSummary,
    getIstikharaSession,
} from '@/services/GuidedIstikharaStorage';
import {
    DirectionFeeling,
    EaseLevel,
    EmotionalState,
    GuidedIstikharaSession,
    IstikharaPatternSummary,
} from '@/types/guided-istikhara';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';

type ReflectionField = {
  id: string;
  label: string;
  options: { value: string; label: string; icon: string; color: string }[];
};

const EMOTIONAL_STATE_FIELD: ReflectionField = {
  id: 'emotional',
  label: 'Emotional State',
  options: [
    { value: 'calm', label: 'Calm', icon: 'happy-outline', color: '#10b981' },
    { value: 'neutral', label: 'Neutral', icon: 'remove-circle-outline', color: '#6b7280' },
    { value: 'uneasy', label: 'Uneasy', icon: 'sad-outline', color: '#f59e0b' },
  ],
};

const DIRECTION_FEELING_FIELD: ReflectionField = {
  id: 'direction',
  label: 'Directional Feeling',
  options: [
    { value: 'inclined', label: 'Inclined', icon: 'arrow-forward-circle', color: '#3b82f6' },
    { value: 'unclear', label: 'Unclear', icon: 'help-circle-outline', color: '#6b7280' },
    { value: 'resistant', label: 'Resistant', icon: 'close-circle', color: '#ef4444' },
  ],
};

const EASE_LEVEL_FIELD: ReflectionField = {
  id: 'ease',
  label: 'Ease Level',
  options: [
    { value: 'ease', label: 'Ease', icon: 'checkmark-circle', color: '#10b981' },
    { value: 'mixed', label: 'Mixed', icon: 'swap-horizontal', color: '#f59e0b' },
    { value: 'obstacles', label: 'Obstacles', icon: 'alert-circle', color: '#ef4444' },
  ],
};

export default function IstikharaReflectionScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { sessionId } = useLocalSearchParams<{ sessionId: string }>();
  
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<GuidedIstikharaSession | null>(null);
  const [patternSummary, setPatternSummary] = useState<IstikharaPatternSummary | null>(null);
  
  const [emotionalState, setEmotionalState] = useState<EmotionalState | null>(null);
  const [directionFeeling, setDirectionFeeling] = useState<DirectionFeeling | null>(null);
  const [easeLevel, setEaseLevel] = useState<EaseLevel | null>(null);
  const [note, setNote] = useState('');
  
  useEffect(() => {
    loadSessionData();
  }, [sessionId]);
  
  const loadSessionData = async () => {
    try {
      setLoading(true);
      const data = await getIstikharaSession(sessionId);
      
      if (!data) {
        Alert.alert('Error', 'Session not found.', [
          { text: 'OK', onPress: () => router.back() },
        ]);
        return;
      }
      
      setSession(data);
      
      const summary = calculatePatternSummary(data);
      setPatternSummary(summary);
    } catch (error) {
      Alert.alert('Error', 'Failed to load session.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveReflection = async () => {
    if (!emotionalState || !directionFeeling || !easeLevel) {
      Alert.alert('Required Fields', 'Please select emotional state, direction, and ease level.');
      return;
    }
    
    try {
      await addReflectionEntry(sessionId, {
        date: new Date().toISOString().split('T')[0],
        emotionalState,
        directionFeeling,
        easeLevel,
        note: note.trim() || undefined,
      });
      
      Alert.alert(
        'Reflection Saved',
        'Your reflection has been recorded.',
        [{ text: 'OK', onPress: loadSessionData }]
      );
      
      // Reset form
      setEmotionalState(null);
      setDirectionFeeling(null);
      setEaseLevel(null);
      setNote('');
    } catch (error) {
      Alert.alert('Error', 'Failed to save reflection.');
    }
  };
  
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }
  
  if (!session) {
    return null;
  }
  
  const todayDate = new Date().toISOString().split('T')[0];
  const todayReflection = session.reflections.find((r) => r.date === todayDate);
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            🕊️ Daily Reflection
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]} numberOfLines={1}>
            {session.decisionText}
          </Text>
        </View>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Disclaimer */}
        <View style={[styles.disclaimerCard, { backgroundColor: '#fee2e2' }]}>
          <Ionicons name="alert-circle" size={18} color="#dc2626" />
          <Text style={[styles.disclaimerText, { color: '#7f1d1d' }]}>
            This is observational tracking only. Do NOT expect dream interpretation or verdicts.
          </Text>
        </View>
        
        {/* Pattern Summary */}
        {patternSummary && patternSummary.totalDays > 0 && (
          <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>
              Pattern Observations ({patternSummary.totalDays} days)
            </Text>
            
            <View style={styles.summaryRow}>
              <Ionicons name="happy-outline" size={18} color={colors.textSecondary} />
              <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
                {patternSummary.calmDays} calm · {patternSummary.uneasyDays} uneasy
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Ionicons name="arrow-forward-circle" size={18} color={colors.textSecondary} />
              <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
                {patternSummary.inclinedDays} inclined · {patternSummary.resistantDays} resistant
              </Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Ionicons name="checkmark-circle" size={18} color={colors.textSecondary} />
              <Text style={[styles.summaryText, { color: colors.textSecondary }]}>
                {patternSummary.easeDays} ease · {patternSummary.obstacleDays} obstacles
              </Text>
            </View>
            
            <Text style={[styles.summaryObservation, { color: colors.textSecondary }]}>
              {patternSummary.observationalSummary}
            </Text>
          </View>
        )}
        
        {/* Today's Reflection */}
        {todayReflection ? (
          <View style={[styles.alreadyLoggedCard, { backgroundColor: '#d1fae5' }]}>
            <Ionicons name="checkmark-done" size={24} color="#059669" />
            <View style={{ flex: 1 }}>
              <Text style={[styles.alreadyLoggedTitle, { color: '#065f46' }]}>
                Today's reflection already logged
              </Text>
              <Text style={[styles.alreadyLoggedText, { color: '#047857' }]}>
                {todayReflection.emotionalState} · {todayReflection.directionFeeling} · {todayReflection.easeLevel}
              </Text>
            </View>
          </View>
        ) : (
          <View style={[styles.formCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.formTitle, { color: colors.text }]}>
              Log Today's Reflection
            </Text>
            
            {/* Emotional State */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                {EMOTIONAL_STATE_FIELD.label}
              </Text>
              <View style={styles.optionGrid}>
                {EMOTIONAL_STATE_FIELD.options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor:
                          emotionalState === option.value
                            ? `${option.color}20`
                            : colorScheme === 'dark'
                            ? '#0f1419'
                            : '#fafafa',
                        borderColor:
                          emotionalState === option.value ? option.color : colors.border,
                      },
                    ]}
                    onPress={() => setEmotionalState(option.value as EmotionalState)}
                  >
                    <Ionicons name={option.icon as any} size={24} color={option.color} />
                    <Text style={[styles.optionLabel, { color: colors.text }]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Direction Feeling */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                {DIRECTION_FEELING_FIELD.label}
              </Text>
              <View style={styles.optionGrid}>
                {DIRECTION_FEELING_FIELD.options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor:
                          directionFeeling === option.value
                            ? `${option.color}20`
                            : colorScheme === 'dark'
                            ? '#0f1419'
                            : '#fafafa',
                        borderColor:
                          directionFeeling === option.value ? option.color : colors.border,
                      },
                    ]}
                    onPress={() => setDirectionFeeling(option.value as DirectionFeeling)}
                  >
                    <Ionicons name={option.icon as any} size={24} color={option.color} />
                    <Text style={[styles.optionLabel, { color: colors.text }]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Ease Level */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                {EASE_LEVEL_FIELD.label}
              </Text>
              <View style={styles.optionGrid}>
                {EASE_LEVEL_FIELD.options.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.optionButton,
                      {
                        backgroundColor:
                          easeLevel === option.value
                            ? `${option.color}20`
                            : colorScheme === 'dark'
                            ? '#0f1419'
                            : '#fafafa',
                        borderColor:
                          easeLevel === option.value ? option.color : colors.border,
                      },
                    ]}
                    onPress={() => setEaseLevel(option.value as EaseLevel)}
                  >
                    <Ionicons name={option.icon as any} size={24} color={option.color} />
                    <Text style={[styles.optionLabel, { color: colors.text }]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            {/* Optional Note */}
            <View style={styles.fieldContainer}>
              <Text style={[styles.fieldLabel, { color: colors.text }]}>
                Optional Note
              </Text>
              <TextInput
                style={[
                  styles.noteInput,
                  {
                    backgroundColor: colorScheme === 'dark' ? '#0f1419' : '#fafafa',
                    color: colors.text,
                    borderColor: colors.border,
                  },
                ]}
                placeholder="Any additional observations..."
                placeholderTextColor={colors.textSecondary}
                value={note}
                onChangeText={setNote}
                multiline
                maxLength={300}
                numberOfLines={4}
              />
              <Text style={[styles.charCount, { color: colors.textSecondary }]}>
                {note.length}/300
              </Text>
            </View>
            
            {/* Save Button */}
            <TouchableOpacity
              style={[
                styles.saveButton,
                {
                  backgroundColor:
                    emotionalState && directionFeeling && easeLevel
                      ? colors.primary
                      : colors.textSecondary,
                  opacity:
                    emotionalState && directionFeeling && easeLevel ? 1 : 0.5,
                },
              ]}
              onPress={handleSaveReflection}
              disabled={!emotionalState || !directionFeeling || !easeLevel}
            >
              <Ionicons name="save" size={18} color="#fff" />
              <Text style={styles.saveButtonText}>Save Reflection</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Reflection History */}
        {session.reflections.length > 0 && (
          <View style={[styles.historyCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.historyTitle, { color: colors.text }]}>
              Reflection History
            </Text>
            
            {session.reflections
              .slice()
              .reverse()
              .map((reflection, index) => (
                <View
                  key={index}
                  style={[
                    styles.historyItem,
                    { borderBottomColor: colors.border },
                  ]}
                >
                  <Text style={[styles.historyDate, { color: colors.text }]}>
                    {new Date(reflection.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </Text>
                  
                  <View style={styles.historyBadges}>
                    <View style={[styles.badge, { backgroundColor: '#dbeafe' }]}>
                      <Text style={[styles.badgeText, { color: '#1e40af' }]}>
                        {reflection.emotionalState}
                      </Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: '#f3e8ff' }]}>
                      <Text style={[styles.badgeText, { color: '#6b21a8' }]}>
                        {reflection.directionFeeling}
                      </Text>
                    </View>
                    <View style={[styles.badge, { backgroundColor: '#fef3c7' }]}>
                      <Text style={[styles.badgeText, { color: '#92400e' }]}>
                        {reflection.easeLevel}
                      </Text>
                    </View>
                  </View>
                  
                  {reflection.note && (
                    <Text style={[styles.historyNote, { color: colors.textSecondary }]}>
                      "{reflection.note}"
                    </Text>
                  )}
                </View>
              ))}
          </View>
        )}
        
        {/* Guidance Card */}
        <View style={[styles.guidanceCard, { backgroundColor: '#f0f9ff' }]}>
          <Ionicons name="information-circle" size={20} color="#1e40af" />
          <Text style={[styles.guidanceText, { color: '#1e40af' }]}>
            Continue reflecting for 7-10 days. If patterns remain unclear, consider consulting trusted counsel.
          </Text>
        </View>
        
        {/* Bottom Padding */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerContent: {
    flex: 1,
    gap: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    gap: 16,
  },
  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 12,
  },
  disclaimerText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '500',
  },
  summaryCard: {
    padding: 20,
    borderRadius: 16,
    gap: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  summaryText: {
    fontSize: 14,
  },
  summaryObservation: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
    fontStyle: 'italic',
  },
  alreadyLoggedCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
  },
  alreadyLoggedTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  alreadyLoggedText: {
    fontSize: 13,
    marginTop: 2,
  },
  formCard: {
    padding: 20,
    borderRadius: 16,
    gap: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  fieldContainer: {
    gap: 10,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  optionGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  optionButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    gap: 6,
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  noteInput: {
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
  },
  charCount: {
    fontSize: 11,
    textAlign: 'right',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  historyCard: {
    padding: 20,
    borderRadius: 16,
    gap: 16,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  historyItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    gap: 8,
  },
  historyDate: {
    fontSize: 13,
    fontWeight: '500',
  },
  historyBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  historyNote: {
    fontSize: 13,
    lineHeight: 19,
    fontStyle: 'italic',
  },
  guidanceCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    padding: 14,
    borderRadius: 12,
  },
  guidanceText: {
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
});
