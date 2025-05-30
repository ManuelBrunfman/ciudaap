import 'dotenv/config';

export default {
  expo: {
    // ────────────────────────────────────────────────
    // Básicos
    // ────────────────────────────────────────────────
    name: 'Ciudaapp',
    slug: 'ciudaapp',
    owner: "manubrunfman",
    description: 'Una aplicación para gestionar beneficios bancarios y servicios de la banca ciudadana.',
    version: '1.0.0',
    orientation: 'portrait',
    userInterfaceStyle: 'light',

    // ────────────────────────────────────────────────
    // Expo SDK
    // ────────────────────────────────────────────────
    sdkVersion: '53.0.0',
    newArchEnabled: true,

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
      bundleIdentifier: 'com.labancaria.Ciudapp',
      // Cuando vayas a configurar iOS, también necesitarás la línea para GoogleService-Info.plist aquí
      // googleServicesFile: "./GoogleService-Info.plist"
    },
    android: {
      package: 'com.labancaria.Ciudapp',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff'
      },
      // ¡ESTO ES LO QUE FALTA PARA ANDROID!
      googleServicesFile: "./google-services.json" // Ruta al archivo google-services.json en la raíz
    },

    // ────────────────────────────────────────────────
    // Plugins / unimódulos
    // ────────────────────────────────────────────────
    plugins: [
      'expo-font',
      'expo-asset',
      // ¡ESTO ES LO QUE FALTA PARA FIREBASE!
      "@react-native-firebase/app"
    ],

    // ────────────────────────────────────────────────
    // Variables de entorno y EAS
    // ────────────────────────────────────────────────
    extra: {
eas: {
    projectId: "991ae612-bdd8-4e91-b7e2-0f1777c6bd36"
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