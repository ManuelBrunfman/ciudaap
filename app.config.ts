// app.config.ts
import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';

export default (_: ConfigContext): ExpoConfig => ({
  /* ─── Básicos ─────────────────────────────── */
  name: 'BancApp',
  slug: 'ciudaapp',
  owner: 'manubrunfman',
  description:
    'Una aplicación de lxs trabajadorxs del Banco Ciudad.',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',

  /* ─── Expo / React Native ─────────────────── */
  newArchEnabled: false,

  /* ─── Icono & Splash ─────────────────────── */
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  web: { favicon: './assets/favicon.png' },

  /* ─── iOS & Android ───────────────────────── */
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.labancaria.bancapp',
    // googleServicesFile: './GoogleService-Info.plist',
  },
  android: {
    package: 'com.labancaria.bancapp',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
googleServicesFile: './android/app/google-services.json',
  },

  /* ─── Plugins ─────────────────────────────── */
  plugins: [
    '@react-native-firebase/app',
    ['@react-native-firebase/messaging', { android: { enableHeadless: true } }],
  ],

  /* ─── Extra / EAS env vars ───────────────── */
  extra: {
    eas: { projectId: '991ae612-bdd8-4e91-b7e2-0f1777c6bd36' },
    EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    EXPO_PUBLIC_FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET:
      process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
      process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  },
});
