// src/navigation/AppNavigator.tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import BenefitDetailScreen from '../screens/benefits/BenefitDetailScreen';
import NewsDetailScreen from '../screens/news/NewsDetailScreen';

// Ejemplo de interfaz para la noticia
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  img?: string;
  link?: string; // Propiedad agregada para la URL de la noticia
  createdAt: any;
}

// Definimos el stack con los parámetros
export type RootStackParamList = {
  // En Main vive tu TabNavigator (pantallas principales)
  Main: undefined;

  // BenefitDetail recibe un 'url' para la WebView
  BenefitDetail: { url: string };

  // NewsDetail recibe un objeto newsItem
  NewsDetail: { newsItem: NewsItem };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="BenefitDetail" component={BenefitDetailScreen} />
      <Stack.Screen name="NewsDetail" component={NewsDetailScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
