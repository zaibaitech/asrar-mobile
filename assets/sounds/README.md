# Adhan Audio Files

This directory contains the audio files for the adhan (call to prayer) notifications.

## Required Files

You need to add the following audio files to this directory:

1. **adhan_default.mp3** - Default adhan for all prayers
2. **adhan_mishary.mp3** - Mishary Rashid Al-Afasy adhan
3. **adhan_mecca.mp3** - Mecca adhan
4. **adhan_medina.mp3** - Medina adhan
5. **adhan_fajr.mp3** - Special Fajr adhan (different melody)

## Audio Format Recommendations

- **Format**: MP3
- **Sample Rate**: 44.1 kHz
- **Bit Rate**: 128-192 kbps
- **Duration**: 30-60 seconds (keep it short for notifications)
- **Volume**: Normalized to -3dB to -6dB

## Where to Get Adhan Audio

You can download high-quality adhan audio from:
- https://islamicfinder.org (various adhans)
- https://quran.com (authentic recordings)
- https://mp3quran.net (multiple reciters)

## Important Notes

- Ensure you have the rights to use these audio files
- Test the audio files on both iOS and Android devices
- Keep file sizes reasonable (< 1MB each)
- Use consistent audio levels across all files

## Usage in App

These audio files are used by the `AdhanNotificationService` to play the call to prayer at the scheduled prayer times. Users can select their preferred adhan sound from the settings screen.
