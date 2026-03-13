/**
 * Track Player Service Registration
 * This file is required by react-native-track-player to handle remote controls
 * (lock screen, notification controls, headphone buttons, etc.)
 */

import TrackPlayer, { Event } from 'react-native-track-player';

module.exports = async function() {
  // Handle remote control events
  TrackPlayer.addEventListener(Event.RemotePlay, async () => {
    await TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePause, async () => {
    await TrackPlayer.pause();
  });

  TrackPlayer.addEventListener(Event.RemoteStop, async () => {
    await TrackPlayer.stop();
  });

  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    await TrackPlayer.skipToNext();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    await TrackPlayer.skipToPrevious();
  });

  TrackPlayer.addEventListener(Event.RemoteJumpForward, async (event) => {
    const position = await TrackPlayer.getPosition();
    await TrackPlayer.seekTo(position + (event.interval || 10));
  });

  TrackPlayer.addEventListener(Event.RemoteJumpBackward, async (event) => {
    const position = await TrackPlayer.getPosition();
    await TrackPlayer.seekTo(Math.max(0, position - (event.interval || 10)));
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, async (event) => {
    await TrackPlayer.seekTo(event.position);
  });

  // Handle playback queue events
  TrackPlayer.addEventListener(Event.PlaybackQueueEnded, async (event) => {
    console.log('[TrackPlayer] Queue ended:', event);
    // You can add auto-play next behavior here if needed
  });

  TrackPlayer.addEventListener(Event.PlaybackError, (event) => {
    console.error('[TrackPlayer] Playback error:', event);
  });
};
