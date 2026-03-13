/**
 * Adhan Audio Service
 * Plays Adhan (call to prayer) audio using expo-av.
 * (react-native-track-player removed due to New Architecture incompatibility)
 */

import { Asset } from 'expo-asset';
import { Audio } from 'expo-av';
import { AdhanSettings } from './AdhanNotificationService';

// Adhan audio assets
const ADHAN_ASSETS = {
  default: require('../assets/sounds/adhan_default.mp3'),
  mishary: require('../assets/sounds/adhan_mishary.mp3'),
  mecca: require('../assets/sounds/adhan_mecca.mp3'),
  medina: require('../assets/sounds/adhan_medina.mp3'),
  fajr: require('../assets/sounds/adhan_fajr.mp3'),
};

let _currentSound: Audio.Sound | null = null;

async function getAdhanAssetUri(adhanType: 'default' | 'mishary' | 'mecca' | 'medina' | 'fajr'): Promise<string> {
  try {
    const assetModule = ADHAN_ASSETS[adhanType] || ADHAN_ASSETS.default;
    const asset = Asset.fromModule(assetModule);
    if (!asset.downloaded) {
      await asset.downloadAsync();
    }
    return asset.localUri || asset.uri;
  } catch {
    const fallback = Asset.fromModule(ADHAN_ASSETS.default);
    if (!fallback.downloaded) await fallback.downloadAsync();
    return fallback.localUri || fallback.uri;
  }
}

export async function playAdhanAudio(
  _prayerName: string,
  _prayerNameArabic: string,
  isFajr: boolean,
  settings: AdhanSettings
): Promise<boolean> {
  if (!settings.playSound) return false;

  try {
    await stopAdhanAudio();

    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      shouldDuckAndroid: false,
    });

    const adhanType = isFajr ? settings.fajrAdhan : settings.otherAdhan;
    const uri = await getAdhanAssetUri(adhanType);

    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true, volume: settings.volume }
    );

    _currentSound = sound;

    sound.setOnPlaybackStatusUpdate((status) => {
      if (status.isLoaded && status.didJustFinish) {
        sound.unloadAsync().catch(() => {});
        _currentSound = null;
      }
    });

    return true;
  } catch (error) {
    console.error('[AdhanAudio] Failed to play adhan:', error);
    return false;
  }
}

export async function stopAdhanAudio(): Promise<void> {
  if (_currentSound) {
    try {
      await _currentSound.stopAsync();
      await _currentSound.unloadAsync();
    } catch {}
    _currentSound = null;
  }
}

export async function isAdhanPlaying(): Promise<boolean> {
  if (!_currentSound) return false;
  try {
    const status = await _currentSound.getStatusAsync();
    return status.isLoaded && status.isPlaying;
  } catch {
    return false;
  }
}

export async function playAdhanPreview(
  adhanType: 'default' | 'mishary' | 'mecca' | 'medina' | 'fajr',
  volume: number = 0.8
): Promise<boolean> {
  try {
    await stopAdhanAudio();

    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    const uri = await getAdhanAssetUri(adhanType);
    const { sound } = await Audio.Sound.createAsync(
      { uri },
      { shouldPlay: true, volume }
    );

    _currentSound = sound;

    // Auto-stop after 30 seconds for preview
    setTimeout(() => stopAdhanAudio(), 30000);

    return true;
  } catch (error) {
    console.error('[AdhanAudio] Preview failed:', error);
    return false;
  }
}
