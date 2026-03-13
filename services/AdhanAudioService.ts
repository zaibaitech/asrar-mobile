/**
 * Adhan Audio Service
 * Plays Adhan (call to prayer) audio using react-native-track-player for background playback
 * 
 * Features:
 * - Plays adhan audio in background (continues when app is minimized/locked)
 * - Integrates with notification system
 * - Persists across app kill on Android (foreground service)
 * - Shows playback controls on lock screen and notification
 */

import { Asset } from 'expo-asset';
import TrackPlayer, { Event, RepeatMode, State } from 'react-native-track-player';
import { AdhanSettings } from './AdhanNotificationService';
import { isTrackPlayerAvailable, setupTrackPlayer } from './TrackPlayerService';

// Adhan audio assets - lazy loaded to avoid bundler issues
const ADHAN_ASSETS = {
  default: require('../assets/sounds/adhan_default.mp3'),
  mishary: require('../assets/sounds/adhan_mishary.mp3'),
  mecca: require('../assets/sounds/adhan_mecca.mp3'),
  medina: require('../assets/sounds/adhan_medina.mp3'),
  fajr: require('../assets/sounds/adhan_fajr.mp3'),
};

// Get adhan asset URI by type
async function getAdhanAssetUri(adhanType: 'default' | 'mishary' | 'mecca' | 'medina' | 'fajr'): Promise<string> {
  try {
    const assetModule = ADHAN_ASSETS[adhanType] || ADHAN_ASSETS.default;
    const asset = Asset.fromModule(assetModule);
    
    if (!asset.downloaded) {
      await asset.downloadAsync();
    }
    
    return asset.localUri || asset.uri;
  } catch (error) {
    console.error('[AdhanAudio] Failed to load asset:', error);
    // Fallback to default asset
    const defaultAsset = Asset.fromModule(ADHAN_ASSETS.default);
    if (!defaultAsset.downloaded) {
      await defaultAsset.downloadAsync();
    }
    return defaultAsset.localUri || defaultAsset.uri;
  }
}

interface AdhanTrack {
  prayerName: string;
  prayerNameArabic: string;
  adhanType: 'default' | 'mishary' | 'mecca' | 'medina' | 'fajr';
}

/**
 * Play adhan audio for a specific prayer
 * This is called when a prayer notification is triggered
 */
export async function playAdhanAudio(
  prayerName: string,
  prayerNameArabic: string,
  isFajr: boolean,
  settings: AdhanSettings
): Promise<boolean> {
  // Check if Track Player is available (not in Expo Go)
  if (!isTrackPlayerAvailable) {
    console.warn('[AdhanAudio] Track Player not available, cannot play adhan');
    return false;
  }

  // Don't play if sound is disabled
  if (!settings.playSound) {
    return false;
  }

  try {
    // Ensure Track Player is initialized
    const ready = await setupTrackPlayer();
    if (!ready) {
      console.warn('[AdhanAudio] Track Player setup failed');
      return false;
    }

    // Determine which adhan to play
    const adhanType = isFajr ? settings.fajrAdhan : settings.otherAdhan;
    const adhanAssetUri = await getAdhanAssetUri(adhanType);

    // Reset queue and add adhan track
    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: `adhan-${prayerName.toLowerCase()}-${Date.now()}`,
      url: adhanAssetUri,
      title: `${prayerName} - ${prayerNameArabic}`,
      artist: 'Adhan',
      album: 'Prayer Call',
      artwork: undefined, // You can add app icon or custom artwork here
    });

    // Set volume from settings
    await TrackPlayer.setVolume(settings.volume);

    // Play once (no repeat for adhan)
    await TrackPlayer.setRepeatMode(RepeatMode.Off);

    // Start playback
    await TrackPlayer.play();

    console.log(`✅ Playing ${prayerName} adhan (${adhanType})`);

    // Set up listener to stop after adhan finishes
    const subscription = TrackPlayer.addEventListener(Event.PlaybackQueueEnded, async () => {
      try {
        await TrackPlayer.reset();
        subscription.remove();
      } catch (error) {
        console.error('[AdhanAudio] Error cleaning up after playback:', error);
      }
    });

    return true;
  } catch (error) {
    console.error('[AdhanAudio] Failed to play adhan:', error);
    return false;
  }
}

/**
 * Stop currently playing adhan
 */
export async function stopAdhanAudio(): Promise<void> {
  if (!isTrackPlayerAvailable) {
    return;
  }

  try {
    const state = await TrackPlayer.getPlaybackState();
    if (state.state === State.Playing || state.state === State.Buffering) {
      await TrackPlayer.stop();
      await TrackPlayer.reset();
    }
  } catch (error) {
    console.error('[AdhanAudio] Failed to stop adhan:', error);
  }
}

/**
 * Check if adhan is currently playing
 */
export async function isAdhanPlaying(): Promise<boolean> {
  if (!isTrackPlayerAvailable) {
    return false;
  }

  try {
    const state = await TrackPlayer.getPlaybackState();
    const track = await TrackPlayer.getActiveTrack();
    
    // Check if playing and if the track is an adhan track
    return (
      (state.state === State.Playing || state.state === State.Buffering) &&
      track?.id?.startsWith('adhan-')
    );
  } catch (error) {
    return false;
  }
}

/**
 * Test adhan playback (for settings/preview)
 */
export async function playAdhanPreview(
  adhanType: 'default' | 'mishary' | 'mecca' | 'medina' | 'fajr',
  volume: number = 0.8
): Promise<boolean> {
  if (!isTrackPlayerAvailable) {
    console.warn('[AdhanAudio] Track Player not available');
    return false;
  }

  try {
    const ready = await setupTrackPlayer();
    if (!ready) {
      return false;
    }

    const adhanAssetUri = await getAdhanAssetUri(adhanType);

    await TrackPlayer.reset();
    await TrackPlayer.add({
      id: `adhan-preview-${Date.now()}`,
      url: adhanAssetUri,
      title: `Adhan Preview - ${adhanType}`,
      artist: 'Adhan',
      album: 'Preview',
    });

    await TrackPlayer.setVolume(volume);
    await TrackPlayer.setRepeatMode(RepeatMode.Off);
    await TrackPlayer.play();

    // Auto-stop after 30 seconds for preview
    setTimeout(async () => {
      try {
        const currentTrack = await TrackPlayer.getActiveTrack();
        if (currentTrack?.id?.startsWith('adhan-preview')) {
          await stopAdhanAudio();
        }
      } catch (error) {
        console.error('[AdhanAudio] Preview auto-stop failed:', error);
      }
    }, 30000);

    return true;
  } catch (error) {
    console.error('[AdhanAudio] Failed to play adhan preview:', error);
    return false;
  }
}
