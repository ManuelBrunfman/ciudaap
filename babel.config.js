// babel.config.js   (crealo o edítalo en la raíz del proyecto)
module.exports = function (api) {
  api.cache(true);
  const prodPlugins = [];
  if (process.env.NODE_ENV === 'production') {
    // Elimina console.* en builds de producción (mantén warn/error si quieres)
    prodPlugins.push(['transform-remove-console', { exclude: ['error', 'warn'] }]);
  }
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ...prodPlugins,
      'react-native-reanimated/plugin', // 👈 SIEMPRE el ÚLTIMO
    ],
  };
};
