import { DarkTheme, Spacing, Typography } from '@/constants/DarkTheme';
import { useLanguage } from '@/contexts/LanguageContext';
import {
    ShareAyahParams,
    ShareAyahPlatform,
    shareAyahToPlatform,
} from '@/utils/shareAyah';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

interface ShareAyahModalProps {
  visible: boolean;
  onClose: () => void;
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  arabicText: string;
  translation: string;
  locale: 'en' | 'fr' | 'ar';
}

type ShareAction = Exclude<ShareAyahPlatform, 'copyLink' | 'copyText'> | 'copyLink' | 'copyText';

type ToastType = 'success' | 'error';

interface ToastState {
  message: string;
  type: ToastType;
}

interface ShareButtonConfig {
  key: ShareAction;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}

export function ShareAyahModal({
  visible,
  onClose,
  surahNumber,
  surahName,
  ayahNumber,
  arabicText,
  translation,
  locale,
}: Readonly<ShareAyahModalProps>) {
  const { t } = useLanguage();
  const [busyAction, setBusyAction] = useState<ShareAction | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const shareParams: ShareAyahParams = useMemo(() => ({
    surahNumber,
    surahName,
    ayahNumber,
    arabicText,
    translation,
    locale,
  }), [surahNumber, surahName, ayahNumber, arabicText, translation, locale]);

  const buttonConfigs: ShareButtonConfig[] = useMemo(() => [
    { key: 'whatsapp', label: t('quran.share.whatsapp'), icon: 'logo-whatsapp' },
    { key: 'facebook', label: t('quran.share.facebook'), icon: 'logo-facebook' },
    { key: 'x', label: t('quran.share.x'), icon: 'logo-twitter' },
    { key: 'system', label: t('quran.share.system'), icon: 'share-social-outline' },
    { key: 'copyLink', label: t('quran.share.copyLink'), icon: 'link-outline' },
    { key: 'copyText', label: t('quran.share.copyText'), icon: 'copy-outline' },
  ], [t]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 1700);
  };

  const onActionPress = async (action: ShareAction) => {
    if (busyAction) {
      return;
    }

    setToast(null);
    setBusyAction(action);

    const result = await shareAyahToPlatform(action, shareParams);

    if (!result.ok) {
      showToast(result.error || t('quran.share.error'), 'error');
      setBusyAction(null);
      return;
    }

    if (action === 'copyLink') {
      showToast(t('quran.share.copiedLink'), 'success');
      setBusyAction(null);
      return;
    }

    if (action === 'copyText') {
      showToast(t('quran.share.copiedText'), 'success');
      setBusyAction(null);
      return;
    }

    setBusyAction(null);
    setToast(null);
    onClose();
  };

  const closeAndReset = () => {
    if (busyAction) {
      return;
    }

    setToast(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={closeAndReset}
    >
      <View style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={closeAndReset} />

        <View style={styles.sheet}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{t('quran.share.title')}</Text>
            <TouchableOpacity onPress={closeAndReset} style={styles.closeButton}>
              <Ionicons name="close" size={20} color={DarkTheme.textPrimary} />
            </TouchableOpacity>
          </View>

          <Text style={styles.subtitle}>{t('quran.share.subtitle')}</Text>

          <View style={styles.buttonGrid}>
            {buttonConfigs.map((button) => {
              const isBusy = busyAction === button.key;
              const disabled = busyAction !== null;

              return (
                <TouchableOpacity
                  key={button.key}
                  style={[styles.shareButton, disabled && styles.shareButtonDisabled]}
                  activeOpacity={0.85}
                  disabled={disabled}
                  onPress={() => onActionPress(button.key)}
                >
                  {isBusy ? (
                    <ActivityIndicator size="small" color="#3b82f6" />
                  ) : (
                    <Ionicons name={button.icon} size={18} color={DarkTheme.textPrimary} />
                  )}
                  <Text style={styles.shareButtonText}>{button.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {Boolean(toast) && (
            <View
              style={[
                styles.toast,
                toast?.type === 'success' ? styles.toastSuccess : styles.toastError,
              ]}
            >
              <Text style={styles.toastText}>{toast?.message}</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  sheet: {
    backgroundColor: '#111827',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: Typography.weightBold,
    color: DarkTheme.textPrimary,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: DarkTheme.textTertiary,
    marginBottom: Spacing.sm,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  shareButton: {
    width: '48%',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: DarkTheme.borderSubtle,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
  },
  shareButtonDisabled: {
    opacity: 0.6,
  },
  shareButtonText: {
    color: DarkTheme.textPrimary,
    fontSize: 13,
    fontWeight: Typography.weightMedium,
  },
  toast: {
    marginTop: Spacing.sm,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastSuccess: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    borderColor: 'rgba(34, 197, 94, 0.45)',
  },
  toastError: {
    backgroundColor: 'rgba(248, 113, 113, 0.15)',
    borderColor: 'rgba(248, 113, 113, 0.45)',
  },
  toastText: {
    fontSize: 12,
    color: DarkTheme.textPrimary,
    fontWeight: Typography.weightMedium,
  },
});
