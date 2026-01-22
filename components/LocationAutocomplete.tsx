/**
 * LocationAutocomplete
 * --------------------
 * Simple place search input that suggests city/country matches as you type.
 * Uses Expo's geocoding provider via LocationService.searchLocations().
 */

import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

import { DarkTheme } from '@/constants/DarkTheme';
import { LocationSearchResult, searchLocations } from '@/services/LocationService';

export interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (location: LocationSearchResult) => void;
  placeholder?: string;
  disabled?: boolean;
  minChars?: number;
  limit?: number;
}

export default function LocationAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder,
  disabled = false,
  minChars = 2,
  limit = 6,
}: LocationAutocompleteProps) {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<LocationSearchResult[]>([]);
  const [open, setOpen] = useState(false);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  const normalized = useMemo(() => value.trim(), [value]);

  useEffect(() => {
    if (disabled) return;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    if (normalized.length < minChars) {
      setResults([]);
      setOpen(false);
      setLoading(false);
      return;
    }

    const requestId = ++requestIdRef.current;
    debounceRef.current = setTimeout(async () => {
      try {
        setLoading(true);
        const found = await searchLocations(normalized, { limit });
        if (requestId !== requestIdRef.current) return;
        setResults(found);
        setOpen(true);
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    }, 250);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [disabled, limit, minChars, normalized]);

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <Ionicons name="search" size={18} color={DarkTheme.textSecondary} style={styles.searchIcon} />
        <TextInput
          style={[styles.input, disabled ? styles.inputDisabled : null]}
          value={value}
          onChangeText={(t) => {
            onChange(t);
            setOpen(true);
          }}
          onFocus={() => {
            if (results.length > 0) setOpen(true);
          }}
          placeholder={placeholder}
          placeholderTextColor={DarkTheme.textSecondary}
          editable={!disabled}
          autoCorrect={false}
          autoCapitalize="words"
          keyboardType="default"
        />

        {loading ? (
          <ActivityIndicator size="small" color={DarkTheme.textSecondary} style={styles.rightIcon} />
        ) : value ? (
          <Pressable
            accessibilityRole="button"
            onPress={() => {
              onChange('');
              setResults([]);
              setOpen(false);
            }}
            style={styles.rightIcon}
          >
            <Ionicons name="close-circle" size={18} color={DarkTheme.textSecondary} />
          </Pressable>
        ) : null}
      </View>

      {open && results.length > 0 ? (
        <View style={styles.dropdown}>
          {results.map((item) => (
            <Pressable
              key={`${item.label}-${item.latitude}-${item.longitude}`}
              onPress={() => {
                onChange(item.label);
                setOpen(false);
                onSelect(item);
              }}
              style={styles.dropdownItem}
            >
              <Text style={styles.dropdownLabel}>{item.label}</Text>
              <Text style={styles.dropdownMeta}>
                {item.latitude.toFixed(4)}, {item.longitude.toFixed(4)}
              </Text>
            </Pressable>
          ))}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  inputContainer: {
    position: 'relative',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    zIndex: 2,
  },
  rightIcon: {
    position: 'absolute',
    right: 12,
    padding: 4,
    zIndex: 2,
  },
  input: {
    flex: 1,
    backgroundColor: DarkTheme.cardBackground,
    borderRadius: 8,
    paddingVertical: 16,
    paddingLeft: 44,
    paddingRight: 44,
    fontSize: 16,
    color: DarkTheme.textPrimary,
    borderWidth: 1,
    borderColor: 'rgba(139, 115, 85, 0.3)',
  },
  inputDisabled: {
    opacity: 0.7,
  },
  dropdown: {
    marginTop: 8,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(139, 115, 85, 0.25)',
    backgroundColor: DarkTheme.cardBackground,
  },
  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  dropdownLabel: {
    color: DarkTheme.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  dropdownMeta: {
    marginTop: 2,
    color: DarkTheme.textSecondary,
    fontSize: 12,
    opacity: 0.8,
  },
});
