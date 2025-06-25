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

  useEffect(() => {
    if (!user || !isAdmin) return;

    const setupPushNotifications = async () => {
      let token: string;
      try {
        token = await requestPushPermission();
      } catch (err) {
        Alert.alert('Permiso denegado', 'No se concedieron permisos para notificaciones push');
        return;
      }
      try {
        const db = getFirestore(getApp());
        await setDoc(
          doc(db, 'adminPushTokens', user.uid),
          { expoPushToken: token, updatedAt: serverTimestamp() },
          { merge: true }
        );
        console.log('Expo Push Token guardado en Firestore:', token);
      } catch (err) {
        console.error('Error guardando token en Firestore:', err);
      }
    };

    setupPushNotifications();
  }, [user, isAdmin]);

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      Vibration.vibrate();
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // Lógica adicional al responder a la notificación
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
