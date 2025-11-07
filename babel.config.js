// Babel configuration for the project
module.exports = function (api) {
  api.cache(true);

  const prodPlugins = [];
  if (process.env.NODE_ENV === 'production') {
    prodPlugins.push(['transform-remove-console', { exclude: ['error', 'warn'] }]);
  }

  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ...prodPlugins,
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
          },
        },
      ],
      // Keep Reanimated plugin last
      'react-native-reanimated/plugin',
    ],
  };
};
