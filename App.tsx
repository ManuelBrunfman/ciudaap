import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { View, Text, Alert, Vibration } from 'react-native';
import * as Notifications from 'expo-notifications';
import { getFirestore, collection, doc, setDoc } from '@react-native-firebase/firestore';
import { getApp } from '@react-native-firebase/app';

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
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const setupPushNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'No se concedieron permisos para notificaciones push');
        return;
      }
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      try {
        const db = getFirestore(getApp());
        const usersCollection = collection(db, 'users');
        const userDocRef = doc(usersCollection, user.uid);
        await setDoc(userDocRef, { expoPushToken: token }, { merge: true });
        console.log('Expo Push Token guardado en Firestore:', token);
      } catch (err) {
        console.error('Error guardando token en Firestore:', err);
      }
    };

    setupPushNotifications();
  }, [user]);

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
