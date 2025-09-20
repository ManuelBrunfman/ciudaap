// src/navigation/TabNavigator.tsx

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import BenefitsListScreen from '../screens/benefits/BenefitsListScreen';
import NewsListScreen from '../screens/news/NewsListScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ContactScreen from '../screens/contact/ContactScreen';
import AfiliateScreen from '../screens/AfiliateScreen';
import AdminScreen from '../screens/AdminScreen';
import YouTubeChannelScreen from '../screens/videos/YouTubeChannelScreen';
import { useAuth } from '../context/AuthContext';
import { useTheme, type AppTheme } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

const Tab = createBottomTabNavigator();

type RouteConfig = { name: string };

type ScreenOptionsFactory = ({ route }: { route: RouteConfig }) => ReturnType<typeof createScreenOptions>;

const TabNavigator = () => {
  const t = useTheme();
  const { isAdmin } = useAuth();
  const screenOptions = useMemo<ScreenOptionsFactory>(
    () => ({ route }) => createScreenOptions(t, route.name),
    [t],
  );

  return (
    <View style={styles.container}>
      {/* React Navigation v7 bottom-tabs no longer supports `sceneContainerStyle` as a prop */}
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen name="NewsList" component={NewsListScreen} options={{ title: 'Noticias' }} />
        <Tab.Screen name="Benefits" component={BenefitsListScreen} options={{ title: 'Beneficios' }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
        <Tab.Screen name="YouTubeChannel" component={YouTubeChannelScreen} options={{ title: 'Videos' }} />
        <Tab.Screen name="Afiliate" component={AfiliateScreen} options={{ title: 'Afíliate' }} />
        <Tab.Screen name="Contact" component={ContactScreen} options={{ title: 'Contacto' }} />
        {isAdmin && <Tab.Screen name="Admin" component={AdminScreen} options={{ title: 'Admin' }} />}
      </Tab.Navigator>
    </View>
  );
};

export default TabNavigator;

const iconForRoute = (routeName: string) => {
  switch (routeName) {
    case 'NewsList':
      return 'newspaper-outline';
    case 'Benefits':
      return 'gift-outline';
    case 'Credential':
      return 'card-outline';
    case 'Profile':
      return 'person-outline';
    case 'Contact':
      return 'logo-whatsapp';
    case 'Afiliate':
      return 'person-add-outline';
    case 'YouTubeChannel':
      return 'logo-youtube';
    case 'Admin':
      return 'settings-outline';
    default:
      return 'ellipse';
  }
};

const createScreenOptions = (t: AppTheme, routeName: string) => ({
  headerShown: false,
  tabBarActiveTintColor: t.colors.onPrimary,
  tabBarInactiveTintColor: t.colors.onSurfaceMuted,
  tabBarStyle: {
    backgroundColor: 'transparent',
    borderTopColor: 'transparent',
  },
  tabBarIcon: ({ color, size }: { color: string; size: number }) => (
    <Ionicons
      name={iconForRoute(routeName) as keyof typeof Ionicons.glyphMap}
      size={size}
      color={color}
    />
  ),
  tabBarBackground: () => (
    <LinearGradient
      colors={[t.colors.overlayStrong, 'transparent']}
      start={{ x: 0.5, y: 1 }}
      end={{ x: 0.5, y: 0 }}
      style={StyleSheet.absoluteFill}
    />
  ),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
