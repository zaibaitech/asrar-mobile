/**
 * Istikhārah Sessions List
 * ========================
 * View all active and completed istikhārah sessions
 */

import Colors from '@/constants/Colors';
import {
    closeIstikharaSession,
    deleteIstikharaSession,
    getActiveSessions,
    loadIstikharaSessions,
} from '@/services/GuidedIstikharaStorage';
import { GuidedIstikharaSession } from '@/types/guided-istikhara';
import { Ionicons } from '@expo/vector-icons';
import { router, useFocusEffect } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    useColorScheme,
} from 'react-native';

export default function IstikharaSessionsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState<GuidedIstikharaSession[]>([]);
  
  useFocusEffect(
    useCallback(() => {
      loadSessions();
    }, [])
  );
  
  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await loadIstikharaSessions();
      setSessions(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load sessions.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseSession = async (sessionId: string) => {
    Alert.alert(
      'Close Session',
      'Are you sure you want to mark this session as complete? You can still view it later.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Close',
          style: 'default',
          onPress: async () => {
            try {
              await closeIstikharaSession(sessionId);
              await loadSessions();
              Alert.alert('Success', 'Session marked as complete.');
            } catch (error) {
              Alert.alert('Error', 'Failed to close session.');
            }
          },
        },
      ]
    );
  };
  
  const handleDeleteSession = async (sessionId: string) => {
    Alert.alert(
      'Delete Session',
      'Are you sure? This will permanently delete this session and all reflections.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteIstikharaSession(sessionId);
              await loadSessions();
              Alert.alert('Success', 'Session deleted.');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete session.');
            }
          },
        },
      ]
    );
  };
  
  const handleNewSession = () => {
    const canStartNew = async () => {
      const active = await getActiveSessions();
      if (active.length >= 5) {
        Alert.alert(
          'Session Limit',
          'You can have up to 5 active sessions. Please complete or delete an existing session first.',
          [{ text: 'OK' }]
        );
        return false;
      }
      return true;
    };
    
    canStartNew().then((allowed) => {
      if (allowed) {
        router.push('/istikhara-preparation');
      }
    });
  };
  
  const activeSessions = sessions.filter((s) => !s.closedAt);
  const completedSessions = sessions.filter((s) => s.closedAt);
  
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </View>
    );
  }
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            🕊️ Istikhārah Sessions
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {activeSessions.length} active · {completedSessions.length} completed
          </Text>
        </View>
      </View>
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* New Session Button */}
        <TouchableOpacity
          style={[styles.newSessionButton, { backgroundColor: colors.primary }]}
          onPress={handleNewSession}
        >
          <Ionicons name="add-circle" size={22} color="#fff" />
          <Text style={styles.newSessionButtonText}>Start New Istikhārah Session</Text>
        </TouchableOpacity>
        
        {/* Disclaimer */}
        <View style={[styles.disclaimerCard, { backgroundColor: '#fee2e2' }]}>
          <Ionicons name="alert-circle" size={18} color="#dc2626" />
          <Text style={[styles.disclaimerText, { color: '#7f1d1d' }]}>
            These sessions support your reflection journey. They do not provide verdicts or authoritative interpretations.
          </Text>
        </View>
        
        {/* Active Sessions */}
        {activeSessions.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Active Sessions
            </Text>
            
            {activeSessions.map((session) => (
              <TouchableOpacity
                key={session.id}
                style={[styles.sessionCard, { backgroundColor: colors.card }]}
                onPress={() => router.push(`/istikhara-reflection/${session.id}`)}
              >
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionIcon}>
                    <Ionicons name="timer-outline" size={20} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.sessionTitle, { color: colors.text }]} numberOfLines={2}>
                      {session.decisionText}
                    </Text>
                    <Text style={[styles.sessionDate, { color: colors.textSecondary }]}>
                      Started {new Date(session.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.sessionStats}>
                  <View style={[styles.statBadge, { backgroundColor: '#dbeafe' }]}>
                    <Ionicons name="book-outline" size={14} color="#1e40af" />
                    <Text style={[styles.statText, { color: '#1e40af' }]}>
                      {session.reflections.length} reflections
                    </Text>
                  </View>
                  
                  {session.timingSnapshot && (
                    <View style={[styles.statBadge, { backgroundColor: '#fef3c7' }]}>
                      <Text style={[styles.statText, { color: '#92400e' }]}>
                        {session.timingSnapshot.timingQuality}
                      </Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.sessionActions}>
                  <TouchableOpacity
                    style={[styles.actionButton, { borderColor: colors.border }]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleCloseSession(session.id);
                    }}
                  >
                    <Ionicons name="checkmark-done" size={16} color={colors.text} />
                    <Text style={[styles.actionButtonText, { color: colors.text }]}>
                      Complete
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[styles.actionButton, { borderColor: '#dc2626' }]}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleDeleteSession(session.id);
                    }}
                  >
                    <Ionicons name="trash-outline" size={16} color="#dc2626" />
                    <Text style={[styles.actionButtonText, { color: '#dc2626' }]}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}
        
        {/* Completed Sessions */}
        {completedSessions.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              Completed Sessions
            </Text>
            
            {completedSessions.map((session) => (
              <TouchableOpacity
                key={session.id}
                style={[
                  styles.sessionCard,
                  { backgroundColor: colors.card, opacity: 0.8 },
                ]}
                onPress={() => router.push(`/istikhara-reflection/${session.id}`)}
              >
                <View style={styles.sessionHeader}>
                  <View style={styles.sessionIcon}>
                    <Ionicons name="checkmark-circle" size={20} color="#10b981" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.sessionTitle, { color: colors.text }]} numberOfLines={2}>
                      {session.decisionText}
                    </Text>
                    <Text style={[styles.sessionDate, { color: colors.textSecondary }]}>
                      Completed {session.closedAt
                        ? new Date(session.closedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                          })
                        : 'Unknown'}
                    </Text>
                  </View>
                </View>
                
                <View style={styles.sessionStats}>
                  <View style={[styles.statBadge, { backgroundColor: '#d1fae5' }]}>
                    <Ionicons name="book-outline" size={14} color="#047857" />
                    <Text style={[styles.statText, { color: '#047857' }]}>
                      {session.reflections.length} reflections
                    </Text>
                  </View>
                </View>
                
                <TouchableOpacity
                  style={[styles.deleteOnlyButton, { borderColor: '#dc2626' }]}
                  onPress={(e) => {
                    e.stopPropagation();
                    handleDeleteSession(session.id);
                  }}
                >
                  <Ionicons name="trash-outline" size={16} color="#dc2626" />
                  <Text style={[styles.actionButtonText, { color: '#dc2626' }]}>
                    Delete
                  </Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </>
        )}
        
        {/* Empty State */}
        {sessions.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="leaf-outline" size={64} color={colors.textSecondary} />
            <Text style={[styles.emptyTitle, { color: colors.text }]}>
              No Sessions Yet
            </Text>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Start a new istikhārah preparation session to begin your reflection journey.
            </Text>
          </View>
        )}
        
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
  newSessionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
  },
  newSessionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  sessionCard: {
    padding: 16,
    borderRadius: 16,
    gap: 12,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  sessionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  sessionTitle: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
  },
  sessionDate: {
    fontSize: 12,
    marginTop: 2,
  },
  sessionStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statText: {
    fontSize: 12,
    fontWeight: '500',
  },
  sessionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '500',
  },
  deleteOnlyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1.5,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },
});
