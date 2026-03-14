module.exports = function (api) {
  api.cache(true);

  const plugins = [];

  // Strip all console.* calls in production builds
  if (process.env.NODE_ENV === 'production' || process.env.BABEL_ENV === 'production') {
    plugins.push('transform-remove-console');
  }

  // Reanimated plugin must be listed last
  plugins.push('react-native-reanimated/plugin');

  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
};
