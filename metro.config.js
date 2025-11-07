const path = require('path');
// Habilita inlineRequires para mejorar arranque y potencialmente reducir trabajo inicial
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.transformer = config.transformer || {};
config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

config.resolver = config.resolver || {};
config.resolver.alias = {
  ...(config.resolver.alias || {}),
  '@': path.resolve(__dirname, 'src'),
};
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  '@': path.resolve(__dirname, 'src'),
};

module.exports = config;
