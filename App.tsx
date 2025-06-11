// App.tsx
import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { View, Text, Alert, Vibration } from 'react-native';
import * as Notifications from 'expo-notifications';
import firestore from '@react-native-firebase/firestore';

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
        await firestore()
          .collection('users')
          .doc(user.uid)
          .set(
            { expoPushToken: token },
            { merge: true }
          );
        console.log('Expo Push Token guardado en Firestore:', token);
      } catch (err) {
        console.error('Error guardando token en Firestore:', err);
      }
    };

    setupPushNotifications();
  }, [user]);

  useEffect(() => {
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // Vibrar cada vez que se recibe una notificación en primer plano
      Vibration.vibrate();
      // Podés descomentar para mostrar alerta:
      // Alert.alert('¡Notificación!', notification.request.content.body);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // Ejemplo: navegar a una pantalla específica o lógica extra
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
