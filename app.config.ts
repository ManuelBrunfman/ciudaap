// Expo app configuration for Ciudapp Gremial
import 'dotenv/config';
import type { ConfigContext, ExpoConfig } from '@expo/config';

export default (_: ConfigContext): ExpoConfig => ({
  // Basic app info
  name: 'Ciudapp Gremial',
  slug: 'ciudappgremial',
  owner: 'manubrunfman',
  description: 'Aplicacion para las y los trabajadores del Banco Ciudad.',
  version: '1.0.0',
  orientation: 'portrait',
  userInterfaceStyle: 'light',
  scheme: 'ciudappgremial',

  // React Native settings
  newArchEnabled: false,

  // Icons & splash screens
  icon: './assets/icon.png',
  splash: {
    image: './assets/splash-icon.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  web: {
    favicon: './assets/favicon.png',
  },

  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.bancaria.ciudad',
    // If you add an iOS build, remember to configure Google services:
    // googleServicesFile: './credentials/GoogleService-Info.plist',
  },

  android: {
    package: 'com.bancaria.ciudad',
    versionCode: 1,
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
    googleServicesFile: './credentials/google-services.json',
  },

  notification: {
    icon: './assets/notification-icon.png',
    color: '#0A4C96',
    androidMode: 'default',
  },

  plugins: [
    // Include the dev client only in development builds
    process.env.EAS_BUILD_PROFILE === 'development' && 'expo-dev-client',
    [
      '@react-native-firebase/app',
      {
        // Configure Android only for now
        ...(process.platform !== 'darwin' && { ios: false }),
      },
    ],
    ['@react-native-firebase/messaging', { android: { enableHeadless: true } }],
    [
      'expo-build-properties',
      {
        android: {
          compileSdkVersion: 34,
          targetSdkVersion: 34,
          buildToolsVersion: '33.0.1',
          minSdkVersion: 24,
        },
      },
    ],
  ].filter(Boolean) as ExpoConfig['plugins'],

  extra: {
    eas: {
      projectId: '991ae612-bdd8-4e91-b7e2-0f1777c6bd36',
    },
    EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
    EXPO_PUBLIC_FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
    EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
    EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
  },
});
