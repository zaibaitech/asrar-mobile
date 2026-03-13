// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Redirect react-native-track-player's internal native module import
// to our safe shim that returns a Proxy fallback in Expo Go.
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Intercept the internal TrackPlayerModule import
  if (moduleName === '../TrackPlayerModule' || moduleName === './TrackPlayerModule') {
    const caller = context.originModulePath || '';
    if (caller.includes('react-native-track-player')) {
      return {
        filePath: path.resolve(__dirname, 'shims/TrackPlayerModule.js'),
        type: 'sourceFile',
      };
    }
  }
  // Fall through to default resolution
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
