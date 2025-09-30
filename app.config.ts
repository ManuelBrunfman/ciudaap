// app.config.ts
import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';

export default (_: ConfigContext): ExpoConfig => ({
  /* ──────────── Basic app info ──────────── */
  name: 'BancApp',
  slug: 'ciudaapp',
  owner: 'manubrunfman',
  description: 'Aplicación de lxs trabajadorxs del Banco Ciudad.',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',

  /* 👇 Agregá este scheme (lo usaremos en el deep link exp+ciudaapp://...) */
  scheme: 'ciudaapp',

  /* ───────── Expo / React Native ───────── */
  newArchEnabled: false,

  /* ──────── Icons & splash ─────── */
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  web: { favicon: './assets/favicon.png' },

  /* ─────────────────── iOS ───────────────── */
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.labancaria.bancapp',
    // ⚠️ Si algún día hacés iOS, este archivo es el de iOS, no el de Android:
    // googleServicesFile: './credentials/GoogleService-Info.plist',
  },

  /* ──────────────── Android ─────────────── */
  android: {
    package: 'com.labancaria.bancapp',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    googleServicesFile: './credentials/google-services.json',
  },

  /* ───────────── Plugins ───────────── */
  plugins: [
    // Incluí el dev client solo en builds de desarrollo (EAS)
    process.env.EAS_BUILD_PROFILE === 'development' && 'expo-dev-client',
    [
      '@react-native-firebase/app',
      {
        // Solo configurar Android por ahora
        ...(process.platform !== 'darwin' && { ios: false })
      }
    ],
    ['@react-native-firebase/messaging', { android: { enableHeadless: true } }],
    [
      'expo-build-properties',
      {
        android: {
          compileSdkVersion: 34,
          targetSdkVersion: 34,
          buildToolsVersion: '33.0.1',
          minSdkVersion: 24, // RN 0.76.9
        },
      },
    ],
  ].filter(Boolean) as any,

  /* ───────────── Extra / ENV ───────────── */
  extra: {
    eas: { projectId: '991ae612-bdd8-4e91-b7e2-0f1777c6bd36' },
    EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    EXPO_PUBLIC_FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  },
});
