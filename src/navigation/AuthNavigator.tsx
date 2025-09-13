import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import PasswordResetScreen from '../screens/auth/PasswordResetScreen';
import { View, Text } from 'react-native'; // Import Text and View
import { globalStyles } from '../theme/globalStyles';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  PasswordReset: undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

const AuthNavigator: React.FC = () => {
  try {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="PasswordReset" component={PasswordResetScreen} />
      </Stack.Navigator>
    );
  } catch (error: any) {
    console.error("Error en AuthNavigator:", error);
    return (
      <View style={globalStyles.centeredContainer}>
        <Text style={globalStyles.errorText}>
          Ocurrió un error en la navegación de autenticación.
        </Text>
      </View>
    );
  }
};

export default AuthNavigator;
