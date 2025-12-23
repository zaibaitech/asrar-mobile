import { X } from 'lucide-react-native';
import React, { useRef } from 'react';
import {
    Animated,
    Dimensions,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ArabicKeyboardProps {
  visible: boolean;
  onClose: () => void;
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onSpace: () => void;
}

// Complete Arabic alphabet (28 letters) from right to left
const ARABIC_LETTERS = [
  // Row 1 (7 letters)
  ['ض', 'ص', 'ث', 'ق', 'ف', 'غ', 'ع'],
  // Row 2 (7 letters)
  ['ه', 'خ', 'ح', 'ج', 'د', 'ش', 'س'],
  // Row 3 (7 letters)
  ['ظ', 'ط', 'ذ', 'ز', 'ر', 'و', 'ي'],
  // Row 4 (7 letters)
  ['ة', 'ى', 'ء', 'ؤ', 'ئ', 'ا', 'ب'],
  // Row 5 (remaining letters)
  ['ن', 'م', 'ك', 'ل', 'ت'],
];

// Common Arabic diacritics
const DIACRITICS = [
  { key: 'َ', label: 'فتحة' }, // Fatha
  { key: 'ً', label: 'تنوين فتح' }, // Tanween Fath
  { key: 'ِ', label: 'كسرة' }, // Kasra
  { key: 'ٍ', label: 'تنوين كسر' }, // Tanween Kasr
  { key: 'ُ', label: 'ضمة' }, // Damma
  { key: 'ٌ', label: 'تنوين ضم' }, // Tanween Damm
  { key: 'ْ', label: 'سكون' }, // Sukun
  { key: 'ّ', label: 'شدة' }, // Shadda
];

export default function ArabicKeyboard({
  visible,
  onClose,
  onKeyPress,
  onBackspace,
  onSpace,
}: ArabicKeyboardProps) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  const [showDiacritics, setShowDiacritics] = React.useState(false);

  React.useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 300,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  const screenWidth = Dimensions.get('window').width;
  const keyWidth = (screenWidth - 48) / 7 - 4; // 7 keys per row with spacing

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} onPress={(e) => e.stopPropagation()}>
          <Animated.View
            style={[
              styles.keyboardContainer,
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.headerTitle}>لوحة المفاتيح العربية</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#9CA3AF" strokeWidth={2} />
              </TouchableOpacity>
            </View>

            {/* Toggle Diacritics */}
            <View style={styles.toggleRow}>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  !showDiacritics && styles.toggleButtonActive,
                ]}
                onPress={() => setShowDiacritics(false)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    !showDiacritics && styles.toggleTextActive,
                  ]}
                >
                  الحروف
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.toggleButton,
                  showDiacritics && styles.toggleButtonActive,
                ]}
                onPress={() => setShowDiacritics(true)}
              >
                <Text
                  style={[
                    styles.toggleText,
                    showDiacritics && styles.toggleTextActive,
                  ]}
                >
                  التشكيل
                </Text>
              </TouchableOpacity>
            </View>

            {/* Keyboard Content */}
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              {!showDiacritics ? (
                // Arabic Letters Layout
                <View style={styles.lettersContainer}>
                  {ARABIC_LETTERS.map((row, rowIndex) => (
                    <View key={rowIndex} style={styles.keyRow}>
                      {row.map((letter, index) => (
                        <TouchableOpacity
                          key={index}
                          style={[styles.key, { width: keyWidth }]}
                          onPress={() => onKeyPress(letter)}
                          activeOpacity={0.7}
                        >
                          <Text style={styles.keyText}>{letter}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ))}

                  {/* Bottom Row - Space and Backspace */}
                  <View style={styles.bottomRow}>
                    <TouchableOpacity
                      style={styles.backspaceKey}
                      onPress={onBackspace}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.bottomKeyText}>⌫</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.spaceKey}
                      onPress={onSpace}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.bottomKeyText}>مسافة</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.closeKeyButton}
                      onPress={onClose}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.bottomKeyText}>إغلاق</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                // Diacritics Layout
                <View style={styles.diacriticsContainer}>
                  <View style={styles.diacriticsGrid}>
                    {DIACRITICS.map((diacritic, index) => (
                      <TouchableOpacity
                        key={index}
                        style={styles.diacriticKey}
                        onPress={() => onKeyPress(diacritic.key)}
                        activeOpacity={0.7}
                      >
                        <Text style={styles.diacriticSymbol}>
                          ◌{diacritic.key}
                        </Text>
                        <Text style={styles.diacriticLabel}>
                          {diacritic.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* Bottom Row for Diacritics */}
                  <View style={styles.bottomRow}>
                    <TouchableOpacity
                      style={styles.backspaceKey}
                      onPress={onBackspace}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.bottomKeyText}>⌫</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.spaceKey}
                      onPress={onSpace}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.bottomKeyText}>مسافة</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.closeKeyButton}
                      onPress={onClose}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.bottomKeyText}>إغلاق</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </ScrollView>
          </Animated.View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },

  keyboardContainer: {
    backgroundColor: '#1F2937',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: 20,
    maxHeight: '70%',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  closeButton: {
    padding: 4,
  },

  toggleRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 12,
  },

  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    backgroundColor: '#374151',
    borderRadius: 12,
    alignItems: 'center',
  },

  toggleButtonActive: {
    backgroundColor: '#4F46E5',
  },

  toggleText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#9CA3AF',
  },

  toggleTextActive: {
    color: '#FFFFFF',
  },

  scrollView: {
    maxHeight: 400,
  },

  lettersContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  keyRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 8,
  },

  key: {
    backgroundColor: '#374151',
    borderRadius: 8,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4B5563',
  },

  keyText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  bottomRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },

  backspaceKey: {
    flex: 1,
    backgroundColor: '#EF4444',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  spaceKey: {
    flex: 2,
    backgroundColor: '#4B5563',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  closeKeyButton: {
    flex: 1,
    backgroundColor: '#6B7280',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottomKeyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Diacritics Styles
  diacriticsContainer: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  diacriticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
    marginBottom: 20,
  },

  diacriticKey: {
    backgroundColor: '#374151',
    borderRadius: 12,
    width: (Dimensions.get('window').width - 80) / 4,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4B5563',
  },

  diacriticSymbol: {
    fontSize: 32,
    color: '#FFFFFF',
    marginBottom: 4,
  },

  diacriticLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
