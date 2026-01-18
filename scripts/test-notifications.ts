#!/usr/bin/env ts-node
/**
 * Notification Testing Script
 * Run from terminal to test notifications in both English and French
 * 
 * Usage:
 *   npm run test:notifications
 *   or
 *   npx ts-node scripts/test-notifications.ts
 */

import * as Notifications from 'expo-notifications';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function testNotifications() {
  console.log('🧪 Starting notification tests...\n');

  // Check permissions
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    console.log('❌ Notifications not enabled. Please enable in device settings.');
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== 'granted') {
      console.log('❌ Permission denied. Exiting.');
      return;
    }
  }

  console.log('✅ Notification permissions granted\n');

  // Test 1: English Prayer Notification
  console.log('📱 Test 1: English Prayer Notification');
  await scheduleTestNotification(
    'Prayer Time',
    'Fajr prayer time is approaching. It\'s time for Fajr prayer.',
    5
  );

  // Test 2: French Prayer Notification
  console.log('📱 Test 2: French Prayer Notification');
  await scheduleTestNotification(
    'Heure de Prière',
    'L\'heure de la prière Fajr approche. C\'est l\'heure de la prière Fajr.',
    10
  );

  // Test 3: English Harmony Hour
  console.log('📱 Test 3: English Harmony Hour');
  await scheduleTestNotification(
    '🌟 Favorable Hour Beginning',
    'Perfect time for leadership and important decisions. Sun hour (Fire). Your fire element is aligned.',
    15
  );

  // Test 4: French Harmony Hour
  console.log('📱 Test 4: French Harmony Hour');
  await scheduleTestNotification(
    '🌟 Heure Favorable Commence',
    'Moment parfait pour le leadership et les décisions importantes. Heure du Soleil (Feu). Votre élément feu est aligné.',
    20
  );

  // Test 5: English Morning Briefing
  console.log('📱 Test 5: English Morning Briefing');
  await scheduleTestNotification(
    '🔥 Good Morning - Friday',
    'Today carries Fire energy with highly favorable energies. Current hour ruled by sun. Open Divine Timing for detailed guidance.',
    25
  );

  // Test 6: French Morning Briefing
  console.log('📱 Test 6: French Morning Briefing');
  await scheduleTestNotification(
    '🔥 Bonjour - Vendredi',
    'Aujourd\'hui porte l\'énergie du Feu avec des énergies très favorables. L\'heure actuelle est régie par le soleil. Ouvrez Divine Timing pour des conseils détaillés.',
    30
  );

  // Test 7: English Element Alignment
  console.log('📱 Test 7: English Element Alignment');
  await scheduleTestNotification(
    '✨ FIRE Alignment Peak',
    'Your fire element is powerfully aligned right now. Perfect time for important action, leadership, and bold decisions.',
    35
  );

  // Test 8: French Element Alignment
  console.log('📱 Test 8: French Element Alignment');
  await scheduleTestNotification(
    '✨ Pic d\'Alignement FEU',
    'Votre élément feu est puissamment aligné en ce moment. Moment parfait pour l\'action importante, le leadership et les décisions audacieuses.',
    40
  );

  console.log('\n✅ All 8 test notifications scheduled!');
  console.log('\nSchedule:');
  console.log('  5s  - English Prayer');
  console.log('  10s - French Prayer');
  console.log('  15s - English Harmony');
  console.log('  20s - French Harmony');
  console.log('  25s - English Briefing');
  console.log('  30s - French Briefing');
  console.log('  35s - English Alignment');
  console.log('  40s - French Alignment');
  console.log('\n⏱️  Total duration: 40 seconds');
  console.log('📋 Check that each notification shows:');
  console.log('   - Correct app icon (white silhouette)');
  console.log('   - Proper title in correct language');
  console.log('   - Proper body text in correct language');
  console.log('   - No character encoding issues with French accents (é, è, à, ç)');
  console.log('   - Proper emoji display');
}

async function scheduleTestNotification(title: string, body: string, delaySeconds: number) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: 'default',
      badge: 1,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: delaySeconds,
    },
  });

  console.log(`   ✓ Scheduled for ${delaySeconds}s from now`);
}

// Run tests
testNotifications().catch(error => {
  console.error('❌ Error running tests:', error);
  process.exit(1);
});
