import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { View, Text, Alert, Vibration } from 'react-native';
import * as Notifications from 'expo-notifications';
import { getFirestore, doc, setDoc, serverTimestamp } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';
import {
  getMessaging,
  requestPermission as requestFcmPermission,
  registerDeviceForRemoteMessages,
  getToken as getFcmToken,
  subscribeToTopic,
} from '@react-native-firebase/messaging';
import { requestPushPermission } from './src/services/notifications';
import { ThemeProvider, useTheme, getNavigationTheme } from './src/theme';
import AppBackground from './src/ui/AppBackground';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

function MainApp() {
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const { user, isAdmin } = useAuth();

  // 1) Expo token para admins (depende de user/isAdmin)
  useEffect(() => {
    const saveAdminExpoToken = async () => {
      if (user && isAdmin) {
        try {
          const expoToken = await requestPushPermission();
          const db = getFirestore(getApp());
          await setDoc(
            doc(db, 'adminPushTokens', user.uid),
            { expoPushToken: expoToken, updatedAt: serverTimestamp() },
            { merge: true },
          );
          console.log('Expo Push Token guardado:', expoToken);
        } catch (err) {
          Alert.alert('Permiso denegado', 'No se concedieron permisos para notificaciones push (Expo)');
        }
      }
    };
    saveAdminExpoToken();
  }, [user, isAdmin]);

  // 2) FCM token + topic "news" (solo una vez)
  const didInitFcm = useRef(false);
  useEffect(() => {
    if (didInitFcm.current) return;
    didInitFcm.current = true;
    (async () => {
      try {
        const app = getApp();
        const msg = getMessaging(app);
        await requestFcmPermission(msg); // iOS / Android 13+
        await registerDeviceForRemoteMessages(msg);
        const fcmToken = await getFcmToken(msg);
        console.log('FCM token:', fcmToken);
        await subscribeToTopic(msg, 'news');
      } catch (err) {
        console.warn('Error configurando FCM:', err);
      }
    })();
  }, []);

  // Vibrar dispositivo al recibir una notificación en foreground
  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(() => {
      Vibration.vibrate();
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(() => {
      // lógica al tocar la notificación (si hace falta)
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <ThemedNavigation />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

export default function App() {
  try {
    return (
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    );
  } catch (error: any) {
    console.error('Error en App:', error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', fontSize: 20, textAlign: 'center' }}>
          Ocurrió un error inesperado en la aplicación.
        </Text>
      </View>
    );
  }
}

function ThemedNavigation() {
  const t = useTheme();
  return (
    <View style={{ flex: 1 }}>
      <AppBackground />
      <NavigationContainer theme={getNavigationTheme(t) as any}>
        <StatusBar style={t.scheme === 'dark' ? 'light' : 'dark'} />
        <RootNavigator />
      </NavigationContainer>
    </View>
  );
}
