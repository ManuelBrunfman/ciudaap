/**
 * app.config.ts – configuración de Expo
 * -------------------------------------------------
 *  • Forzamos compileSdk/targetSdk/buildTools mediante
 *    el plugin oficial `expo-build-properties`.
 *  • Mantiene todas las variables .env y plugins Firebase.
 * -------------------------------------------------
 */

import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';

export default (_: ConfigContext): ExpoConfig => ({
  /* ──────────── Datos básicos ──────────── */
  name: 'BancApp',
  slug: 'ciudaapp',
  owner: 'manubrunfman',
  description: 'Una aplicación de lxs trabajadorxs del Banco Ciudad.',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',

  /* ───────── Expo / React Native ───────── */
  newArchEnabled: false,

  /* ──────── Icono y pantalla splash ─────── */
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
    // googleServicesFile: './GoogleService-Info.plist',
  },

  /* ───────────────── Android ─────────────── */
  android: {
    package: 'com.labancaria.bancapp',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    googleServicesFile: './google-services.json',
  },

  /* ───────────── Plugins ─────────────────── */
  plugins: [
    '@react-native-firebase/app',
    ['@react-native-firebase/messaging', { android: { enableHeadless: true } }],
    [
      'expo-build-properties',
      {
        /**  <-- Ajustes de compilación que antes daban error  */
        android: {
          compileSdkVersion: 34,
          targetSdkVersion: 34,
          buildToolsVersion: '34.0.0',
        },
      },
    ],
  ],

  /* ───────────── Extra / ENV ─────────────── */
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
