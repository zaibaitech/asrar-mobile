/**
 * Expo Config Plugin to remove exact alarm permissions
 * 
 * This plugin forcefully removes SCHEDULE_EXACT_ALARM and USE_EXACT_ALARM
 * permissions from AndroidManifest.xml, even if added by dependencies.
 * 
 * Why needed: expo-notifications or other dependencies may add these permissions
 * automatically, and blockedPermissions in app.json doesn't always work reliably.
 */

const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withRemoveExactAlarmPermissions(config) {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const mainApplication = androidManifest.manifest;

    // Remove the exact alarm permissions if they exist
    if (mainApplication['uses-permission']) {
      mainApplication['uses-permission'] = mainApplication['uses-permission'].filter(
        (permission) => {
          const permissionName = permission.$?.['android:name'];
          return (
            permissionName !== 'android.permission.SCHEDULE_EXACT_ALARM' &&
            permissionName !== 'android.permission.USE_EXACT_ALARM'
          );
        }
      );
    }

    console.log('✅ Removed SCHEDULE_EXACT_ALARM and USE_EXACT_ALARM permissions');

    return config;
  });
};
