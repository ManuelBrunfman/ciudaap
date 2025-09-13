import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native'; // Import Text and View
import { globalStyles } from '../theme/globalStyles';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';

const RootNavigator: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={globalStyles.centeredContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  try {
    return user ? <AppNavigator /> : <AuthNavigator />;
  } catch (error: any) {
    console.error("Error en RootNavigator:", error);
    return (
      <View style={globalStyles.centeredContainer}>
        <Text style={globalStyles.errorText}>
          Ocurrió un error en la navegación.
        </Text>
      </View>
    );
  }
};

export default RootNavigator;
