/**
 * Divine Names Picker Component
 * Searchable list of 99 Divine Names
 */

import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { DivineName, getAllDivineNames } from '../../data/divine-names';

interface DivineNamesPickerProps {
  onSelect: (name: DivineName) => void;
  selectedNameNumber?: number | null;
}

export const DivineNamesPicker: React.FC<DivineNamesPickerProps> = ({
  onSelect,
  selectedNameNumber,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const allNames = getAllDivineNames();
  
  const filteredNames = allNames.filter(name => 
    name.arabic.includes(searchQuery) ||
    name.transliteration.toLowerCase().includes(searchQuery.toLowerCase()) ||
    name.meaning.en.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const renderNameCard = (item: DivineName) => {
    const isSelected = selectedNameNumber === item.number;
    
    return (
      <TouchableOpacity
        key={item.number}
        style={[styles.nameCard, isSelected && styles.nameCardSelected]}
        onPress={() => onSelect(item)}
        activeOpacity={0.7}
      >
        <View style={styles.nameHeader}>
          <Text style={styles.nameNumber}>{item.number}</Text>
          <Text style={styles.nameArabic}>{item.arabic}</Text>
        </View>
        
        <Text style={styles.nameTranslit}>{item.transliteration}</Text>
        <Text style={styles.nameMeaning}>{item.meaning.en}</Text>
        
        <View style={styles.valueChip}>
          <Text style={styles.valueText}>Abjad: {item.abjadValue}</Text>
        </View>
        
        {isSelected && (
          <View style={styles.selectedBadge}>
            <Text style={styles.selectedText}>✓</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>🕋 99 Divine Names</Text>
      
      <TextInput
        style={styles.searchInput}
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Search by Arabic, transliteration, or meaning..."
        placeholderTextColor="#64748b"
      />
      
      <ScrollView
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredNames.map(renderNameCard)}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#f1f5f9',
    padding: 20,
    paddingBottom: 12,
  },
  
  searchInput: {
    backgroundColor: '#1e293b',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 16,
    fontSize: 16,
    color: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#334155',
  },
  
  listContent: {
    padding: 20,
    gap: 12,
  },
  
  nameCard: {
    backgroundColor: '#1e293b',
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: '#334155',
    position: 'relative',
  },
  
  nameCardSelected: {
    borderColor: '#6366f1',
    backgroundColor: '#1e1b4b',
  },
  
  nameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  
  nameNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6366f1',
    backgroundColor: '#312e81',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  
  nameArabic: {
    fontSize: 24,
    fontWeight: '700',
    color: '#f1f5f9',
    flex: 1,
    textAlign: 'right',
  },
  
  nameTranslit: {
    fontSize: 16,
    fontWeight: '600',
    color: '#cbd5e1',
    marginBottom: 4,
  },
  
  nameMeaning: {
    fontSize: 14,
    color: '#94a3b8',
    marginBottom: 8,
  },
  
  valueChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#334155',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  
  valueText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#a5b4fc',
  },
  
  selectedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: '#6366f1',
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  selectedText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
});
