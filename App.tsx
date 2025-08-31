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
import messaging from '@react-native-firebase/messaging';
import { requestPushPermission } from './src/services/notifications';

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

  /**
   * 1. Solicita permisos y obtiene el token Expo (para admins) ✅
   * 2. Obtiene el token FCM y se suscribe al topic "news" (para push masivas) ✅
   */
  useEffect(() => {
    const setupPush = async () => {
      // === Expo token para admins ===
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

      // === FCM token + topic "news" para TODOS ===
      try {
        await messaging().requestPermission(); // iOS / Android 13+
        await messaging().registerDeviceForRemoteMessages();
        const fcmToken = await messaging().getToken();
        console.log('FCM token:', fcmToken);
        await messaging().subscribeToTopic('news');
      } catch (err) {
        console.warn('Error configurando FCM:', err);
      }
    };

    setupPush();
  }, [user, isAdmin]);

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
      <NavigationContainer>
        <StatusBar style="auto" />
        <RootNavigator />
      </NavigationContainer>
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
