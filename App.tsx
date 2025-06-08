// App.tsx
import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { View, Text, Alert } from 'react-native';
import * as Notifications from 'expo-notifications';

// Configuración para mostrar SIEMPRE el banner de notificación, incluso si la app está abierta
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  useEffect(() => {
    pedirPermisos();
    obtenerToken();

    // Listener para cuando llega una notificación en primer plano
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      // Ejemplo: mostrar alerta o refrescar info
      // Alert.alert('¡Notificación!', notification.request.content.body);
    });

    // Listener para cuando el usuario toca la notificación
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      // Ejemplo: navegar a una pantalla específica o lógica extra
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  const pedirPermisos = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'No se concedieron permisos para notificaciones push');
    }
  };

  const obtenerToken = async () => {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log('Expo Push Token:', token);
    // Guardalo en tu backend, Firestore, etc. si querés enviar push a este usuario
  };

  try {
    return (
      <AuthProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar style="auto" />
            <RootNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
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
