import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { CalculatorColors } from '../../constants/CalculatorColors';
import { HistoryItem } from '../../types/calculator';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelectItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearAll: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelectItem, onDeleteItem, onClearAll }) => {
  const colors = CalculatorColors;

  const renderItem = ({ item }: { item: HistoryItem }) => (
    <TouchableOpacity
      style={styles.historyItemWrapper}
      onPress={() => onSelectItem(item)}
      activeOpacity={0.7}
    >
      <LinearGradient
        colors={['#1e293b', '#334155']}
        style={styles.historyItem}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.itemContent}>
          <Text style={styles.itemText} numberOfLines={1}>{item.result.input}</Text>
          <View style={styles.itemStats}>
            <View style={styles.statBadge}>
              <Text style={styles.statLabel}>Kabīr</Text>
              <Text style={styles.statValue}>{item.result.kabir}</Text>
            </View>
            <View style={styles.statBadge}>
              <Text style={styles.statLabel}>Ṣaghīr</Text>
              <Text style={styles.statValue}>{item.result.saghir}</Text>
            </View>
          </View>
          <Text style={styles.itemDate}>
            {new Date(item.result.timestamp).toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.deleteButton} 
          onPress={() => onDeleteItem(item.id)}
        >
          <LinearGradient
            colors={['#ef4444', '#dc2626']}
            style={styles.deleteGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.deleteText}>×</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </TouchableOpacity>
  );

  if (history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>📂</Text>
        <Text style={styles.emptyText}>No calculation history yet</Text>
        <Text style={styles.emptyHint}>Start calculating to build your history</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1e293b', '#334155']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.headerTitle}>📜 History ({history.length})</Text>
        <TouchableOpacity onPress={onClearAll}>
          <LinearGradient
            colors={['#ef4444', '#dc2626']}
            style={styles.clearButtonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.clearButtonText}>Clear All</Text>
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
      <FlatList 
        data={history} 
        renderItem={renderItem} 
        keyExtractor={(item) => item.id} 
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#0f172a',
  },
  header: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 16,
    elevation: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  headerTitle: { 
    fontSize: 20,
    fontWeight: '800',
    color: '#fff',
  },
  clearButtonGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  clearButtonText: { 
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
  },
  list: { 
    padding: 16,
    gap: 12,
  },
  historyItemWrapper: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  historyItem: { 
    flexDirection: 'row',
    padding: 16,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  itemContent: { 
    flex: 1,
    gap: 8,
  },
  itemText: { 
    fontSize: 18,
    fontWeight: '700',
    color: '#f1f5f9',
  },
  itemStats: {
    flexDirection: 'row',
    gap: 8,
  },
  statBadge: {
    backgroundColor: '#0f172a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#94a3b8',
  },
  statValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#60a5fa',
  },
  itemDate: { 
    fontSize: 12,
    color: '#94a3b8',
  },
  deleteButton: { 
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    overflow: 'hidden',
  },
  deleteGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: { 
    fontSize: 28,
    fontWeight: '300',
    color: '#fff',
  },
  emptyContainer: { 
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#0f172a',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
    opacity: 0.5,
  },
  emptyText: { 
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    color: '#94a3b8',
    marginBottom: 8,
  },
  emptyHint: {
    fontSize: 14,
    textAlign: 'center',
    color: '#64748b',
    fontStyle: 'italic',
  },
});
