import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Download, Trash2, User, X } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useLanguage } from '../../contexts/LanguageContext';
import { HistoryService, type SavedCalculation } from '../../services/HistoryService';

interface HistoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectCalculation: (calculation: SavedCalculation) => void;
}

export default function HistoryModal({ visible, onClose, onSelectCalculation }: HistoryModalProps) {
  const { language, t } = useLanguage();
  const [history, setHistory] = useState<SavedCalculation[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    if (visible) {
      loadHistory();
    }
  }, [visible]);

  const loadHistory = async () => {
    setLoading(true);
    const data = await HistoryService.getHistory();
    const count = await HistoryService.getTotalCount();
    setHistory(data);
    setTotalCount(count);
    setLoading(false);
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert(
      t('common.delete'),
      `${t('history.deleteConfirm') || (language === 'en' ? 'Delete calculation for' : 'Supprimer le calcul pour')} ${name}?`,
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.delete'),
          style: 'destructive',
          onPress: async () => {
            await HistoryService.deleteCalculation(id);
            loadHistory();
          },
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      t('history.clearAll'),
      t('history.confirmClear') || (language === 'en' ? 'Are you sure you want to delete all saved calculations?' : 'Êtes-vous sûr de vouloir supprimer tous les calculs sauvegardés?'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('history.clearAll'),
          style: 'destructive',
          onPress: async () => {
            await HistoryService.clearHistory();
            loadHistory();
          },
        },
      ]
    );
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(language === 'en' ? 'en-US' : 'fr-FR', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <LinearGradient colors={['#0f172a', '#1e1b4b', '#312e81']} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>
              {t('common.history')}
            </Text>
            <Text style={styles.headerSubtitle}>
              {`${history.length} ${t('history.saved') || (language === 'en' ? 'saved' : 'sauvegardés')} • ${totalCount} ${t('history.total') || (language === 'en' ? 'total' : 'total')}`}
            </Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <X color="#ffffff" size={24} strokeWidth={2} />
          </TouchableOpacity>
        </View>

        {/* Clear All Button */}
        {history.length > 0 && (
          <View style={styles.actionsBar}>
            <TouchableOpacity onPress={handleClearAll} style={styles.clearAllButton}>
              <Trash2 color="#ef4444" size={16} strokeWidth={2} />
              <Text style={styles.clearAllText}>
                {t('history.clearAll')}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Content */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#a78bfa" />
            <Text style={styles.loadingText}>
              {t('common.loading')}
            </Text>
          </View>
        ) : history.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Download color="#a78bfa" size={64} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>
              {t('history.noCalculationsYet') || (language === 'en' ? 'No History Yet' : 'Aucun Historique')}
            </Text>
            <Text style={styles.emptySubtitle}>
              {t('history.emptyMessage') || (language === 'en' ? 'Your saved calculations will appear here' : 'Vos calculs sauvegardés apparaîtront ici')}
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
            {history.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.historyItem}
                onPress={() => {
                  onSelectCalculation(item);
                  onClose();
                }}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={['rgba(167, 139, 250, 0.1)', 'rgba(139, 92, 246, 0.05)']}
                  style={styles.historyItemGradient}
                >
                  <View style={styles.historyItemContent}>
                    <View style={styles.historyItemHeader}>
                      <View style={styles.nameContainer}>
                        <User color="#a78bfa" size={16} strokeWidth={2} />
                        <Text style={styles.personName}>{item.personName}</Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => handleDelete(item.id, item.personName)}
                        style={styles.deleteButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                      >
                        <Trash2 color="#ef4444" size={18} strokeWidth={2} />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.historyItemDetails}>
                      <Text style={styles.motherName}>
                        {language === 'en' ? 'Mother:' : 'Mère:'} {item.motherName}
                      </Text>
                      <Text style={styles.element}>
                        {language === 'en' ? 'Element:' : 'Élément:'}{' '}
                        {item.result.burujProfile.element}
                      </Text>
                    </View>

                    <View style={styles.timestampContainer}>
                      <Calendar color="#64748b" size={12} strokeWidth={2} />
                      <Text style={styles.timestamp}>{formatDate(item.timestamp)}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}

            <View style={{ height: 20 }} />
          </ScrollView>
        )}
      </LinearGradient>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionsBar: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  clearAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  clearAllText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginTop: 20,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  historyItem: {
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  historyItemGradient: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.2)',
  },
  historyItemContent: {
    gap: 12,
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  personName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    flex: 1,
  },
  deleteButton: {
    padding: 4,
  },
  historyItemDetails: {
    gap: 4,
  },
  motherName: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  element: {
    fontSize: 14,
    color: '#a78bfa',
    fontWeight: '600',
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#64748b',
  },
});
