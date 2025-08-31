/*
 * app.config.ts – Expo configuration
 * -------------------------------------------------
 *   • Centralizes build settings (compileSdk, targetSdk, buildTools) via
 *     the official `expo-build-properties` plugin.
 *   • Keeps all Firebase + .env variables in one place.
 *   • Secrets (google‑services.json / GoogleService‑Info.plist / keystore)
 *     live under ./credentials/ and are **ignored** by Git.
 * -------------------------------------------------
 */

import 'dotenv/config';
import { ExpoConfig, ConfigContext } from '@expo/config';

export default (_: ConfigContext): ExpoConfig => ({
  /* ──────────── Basic app info ──────────── */
  name: 'BancApp',
  slug: 'ciudaapp',                // unified slug
  owner: 'manubrunfman',
  description: 'Aplicación de lxs trabajadorxs del Banco Ciudad.',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',

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
    googleServicesFile: './android/app/google-services.json',  },

  /* ───────────────── Android ─────────────── */
  android: {
    package: 'com.labancaria.bancapp',
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    googleServicesFile: './credentials/google-services.json',
  },

  /* ───────────── Plugins ─────────────────── */
 plugins: [
  '@react-native-firebase/app',
  ['@react-native-firebase/messaging', { android: { enableHeadless: true } }],
  [
    'expo-build-properties',
    {
      android: {
        compileSdkVersion: 34,
        targetSdkVersion: 34,
        buildToolsVersion: '34.0.0',
        // Agrega esta línea para RN 0.76.9:
        minSdkVersion: 24,
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
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  },
});
