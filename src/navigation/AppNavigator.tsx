// src/navigation/AppNavigator.tsx

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import BenefitDetailScreen from '../screens/benefits/BenefitDetailScreen';
import NewsDetailScreen from '../screens/news/NewsDetailScreen';
import YouTubeChannelScreen from '../screens/news/YouTubeChannelScreen';
import YouTubeVideoScreen from '../screens/news/YouTubeVideoScreen';
import { View, Text } from 'react-native';

// ✅ Import centralizado del tipo RootStackParamList
// Si moviste el archivo a types:
// import { RootStackParamList } from '../types/RootStackParamList';
// Si lo dejaste en navigation:
// import { RootStackParamList } from './RootStackParamList';
import { RootStackParamList } from '../types/RootStackParamList'; // AJUSTÁ SEGÚN TU ESTRUCTURA

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  try {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={TabNavigator} />
        <Stack.Screen name="BenefitDetail" component={BenefitDetailScreen} />
        <Stack.Screen name="NewsDetail" component={NewsDetailScreen} />
        <Stack.Screen name="YouTubeChannel" component={YouTubeChannelScreen} />
        <Stack.Screen name="YouTubeVideo" component={YouTubeVideoScreen} />
      </Stack.Navigator>
    );
  } catch (error: any) {
    console.error("Error en AppNavigator:", error);
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red', fontSize: 20, textAlign: 'center' }}>
          Ocurrió un error en la navegación principal.
        </Text>
      </View>
    );
  }
};

export default AppNavigator;

/**
 * Si usás RootStackParamList en otros navegadores, siempre importalo de la misma fuente.
 */
