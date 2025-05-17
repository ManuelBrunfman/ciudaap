import 'dotenv/config';

export default {
  expo: {
    // ────────────────────────────────────────────────
    // Básicos
    // ────────────────────────────────────────────────
    name: 'Bancapp',                // Nombre que verá el usuario
    slug: 'bancapp',                // Usado por Expo (minúsculas, sin espacios)
    version: '1.0.0',               // SemVer de tu app
    orientation: 'portrait',
    userInterfaceStyle: 'light',

    // ────────────────────────────────────────────────
    // Expo SDK
    // ────────────────────────────────────────────────
    sdkVersion: '53.0.0',           // Forzado para asegurar compatibilidad
    newArchEnabled: true,           // Habilita la New Architecture (Hermes + Turbo)

    // ────────────────────────────────────────────────
    // Iconos y Splash
    // ────────────────────────────────────────────────
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff'
    },
    web: {
      favicon: './assets/favicon.png'
    },

    // ────────────────────────────────────────────────
    // iOS + Android nativo
    // ────────────────────────────────────────────────
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.labancaria.bancapp'
    },
    android: {
      package: 'com.labancaria.bancapp',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      }
    },

    // ────────────────────────────────────────────────
    // Plugins / unimódulos
    // ────────────────────────────────────────────────
    plugins: [
      'expo-font',
      'expo-asset'
    ],

    // ────────────────────────────────────────────────
    // Variables de entorno y EAS
    // ────────────────────────────────────────────────
    extra: {
      eas: {
        projectId: 'e770c57a-e186-4230-a679-12e3e8983ea6'
      },
      EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
      EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
      EXPO_PUBLIC_FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
      EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
      EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID
    }
  }
};
