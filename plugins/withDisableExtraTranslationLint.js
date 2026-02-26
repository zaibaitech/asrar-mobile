/**
 * Expo Config Plugin: Disable ExtraTranslation Lint Check
 * 
 * This plugin disables the Android lint ExtraTranslation check which fails when
 * iOS-specific localization keys (CFBundleDisplayName, CFBundleName, NSUserTrackingUsageDescription)
 * are present in translated string files but not in the default locale.
 * 
 * These keys are iOS Info.plist keys and shouldn't be validated for Android.
 */

const { withAppBuildGradle } = require('expo/config-plugins');

function withDisableExtraTranslationLint(config) {
  return withAppBuildGradle(config, (config) => {
    const buildGradle = config.modResults.contents;
    
    // Check if lint configuration already exists
    if (buildGradle.includes('lintOptions') || buildGradle.includes('lint {')) {
      // Add disable to existing lint block
      if (buildGradle.includes('lint {')) {
        config.modResults.contents = buildGradle.replace(
          /lint\s*\{/,
          `lint {
        disable += "ExtraTranslation"`
        );
      } else if (buildGradle.includes('lintOptions {')) {
        config.modResults.contents = buildGradle.replace(
          /lintOptions\s*\{/,
          `lintOptions {
        disable "ExtraTranslation"`
        );
      }
    } else {
      // Add new lint block inside android {}
      config.modResults.contents = buildGradle.replace(
        /android\s*\{/,
        `android {
    lint {
        disable += "ExtraTranslation"
    }`
      );
    }
    
    return config;
  });
}

module.exports = withDisableExtraTranslationLint;
