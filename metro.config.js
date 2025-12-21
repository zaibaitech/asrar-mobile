// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Exclude .web.tsx files from bundling for native platforms
config.resolver.sourceExts = config.resolver.sourceExts.filter(ext => ext !== 'web.tsx');

// Prioritize .tsx files over .web.tsx files
config.resolver.sourceExts = ['tsx', 'ts', 'jsx', 'js', 'json'];

module.exports = config;
