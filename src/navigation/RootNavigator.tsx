import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native'; // Import Text and View
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

const RootNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  try {
    return user ? <AppNavigator /> : <AuthNavigator />;
  } catch (error: any) {
    console.error("Error en RootNavigator:", error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', fontSize: 20, textAlign: 'center' }}>
          Ocurrió un error en la navegación.
        </Text>
      </View>
    );
  }
};

export default RootNavigator;