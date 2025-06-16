// babel.config.js   (crealo o edítalo en la raíz del proyecto)
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // 👈 SIEMPRE el ÚLTIMO
    ],
  };
};
