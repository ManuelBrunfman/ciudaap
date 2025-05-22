// App.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { AuthProvider } from './src/context/AuthContext';
import RootNavigator from './src/navigation/RootNavigator';
import { View, Text } from 'react-native';

export default function App() {
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
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <Text
          style={{ color: 'red', fontSize: 20, textAlign: 'center' }}
        >
          Ocurrió un error inesperado en la aplicación.
        </Text>
      </View>
    );
  }
}
