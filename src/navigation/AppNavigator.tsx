// src/navigation/AppNavigator.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import BenefitDetailScreen from '../screens/benefits/BenefitDetailScreen';
import NewsDetailScreen from '../screens/news/NewsDetailScreen';
import YouTubeVideoScreen from '../screens/videos/YouTubeVideoScreen';
import { View, StyleSheet } from 'react-native';
import ForceLogoutScreen from "../screens/ForceLogoutScreen";
import AppText from '../ui/AppText';
import { useTheme } from '../theme';


// ✅ Import centralizado del tipo RootStackParamList
// Si moviste el archivo a types:
// import { RootStackParamList } from '../types/RootStackParamList';
// Si lo dejaste en navigation:
// import { RootStackParamList } from './RootStackParamList';
import { RootStackParamList } from '../types/RootStackParamList'; // AJUSTÁ SEGÚN TU ESTRUCTURA

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const t = useTheme();
  try {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="BenefitDetail" component={BenefitDetailScreen} />
        <Stack.Screen name="NewsDetail" component={NewsDetailScreen} />
        <Stack.Screen name="YouTubeVideo" component={YouTubeVideoScreen} />
        <Stack.Screen name="ForceLogout" component={ForceLogoutScreen} />

      </Stack.Navigator>
    );
  } catch (error: any) {
    console.error("Error en AppNavigator:", error);
    return (
      <View style={[styles.center]}>
        <AppText style={{ color: t.colors.danger, fontSize: 20, textAlign: 'center' }}>
          Ocurrió un error en la navegación principal.
        </AppText>
      </View>
    );
  }
};

export default AppNavigator;

/**
 * Si usás RootStackParamList en otros navegadores, siempre importalo de la misma fuente.
 */
const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
