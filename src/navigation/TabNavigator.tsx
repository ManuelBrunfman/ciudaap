// src/navigation/TabNavigator.tsx
import React, { useMemo } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import type { ViewStyle } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import BenefitsListScreen from '../screens/benefits/BenefitsListScreen';
import NewsListScreen from '../screens/news/NewsListScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ContactScreen from '../screens/contact/ContactScreen';
import AfiliateScreen from '../screens/AfiliateScreen';
import AdminScreen from '../screens/AdminScreen';
import YouTubeChannelScreen from '../screens/videos/YouTubeChannelScreen';
import SergioPalazzoInterviewsScreen from '../screens/videos/SergioPalazzoInterviewsScreen';
import { useAuth } from '../context/AuthContext';
import { useTheme, type AppTheme } from '../theme';
import { LinearGradient } from 'expo-linear-gradient';

const Tab = createBottomTabNavigator();
const youtubeTabItemStyle: ViewStyle = {
  justifyContent: 'center',
  height: 72,
};

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
      <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen name="NewsList" component={NewsListScreen} options={{ title: 'Noticias', tabBarLabel: () => null }} />
        <Tab.Screen name="Benefits" component={BenefitsListScreen} options={{ title: 'Beneficios', tabBarLabel: () => null }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil', tabBarLabel: 'Perfil' }} />
        <Tab.Screen name="YouTubeChannel" component={YouTubeChannelScreen} options={{ title: '' }} />
        <Tab.Screen name="SergioPalazzoInterviews" component={SergioPalazzoInterviewsScreen} options={{ title: 'Palazzo', tabBarLabel: () => null }} />
        <Tab.Screen name="Afiliate" component={AfiliateScreen} options={{ title: 'Afiliate', tabBarLabel: () => null }} />
        <Tab.Screen name="Contact" component={ContactScreen} options={{ title: 'Contacto', tabBarLabel: () => null }} />
        {isAdmin && <Tab.Screen name="Admin" component={AdminScreen} options={{ title: 'Admin', tabBarLabel: 'Admin' }} />}
      </Tab.Navigator>
    </View>
  );
};

export default TabNavigator;

// ---------------- ICONOS ----------------

// tamaño uniforme para todos los PNG
const ICON_SIZE = 32;

const renderIcon = (src: any, focused: boolean) => (
  <View style={{ width: ICON_SIZE, height: ICON_SIZE, alignItems: 'center', justifyContent: 'center' }}>
    <Image
      source={src}
      style={{
        width: ICON_SIZE,
        height: ICON_SIZE,
        resizeMode: 'contain',
        opacity: focused ? 1 : 0.85,
        transform: focused ? [{ scale: 1.08 }] : [{ scale: 1 }],
      }}
    />
  </View>
);

const iconForRoute = (routeName: string) => {
  switch (routeName) {
    case 'Profile':
      return 'person-outline';
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
    height: 72,
    paddingBottom: 10,
    paddingTop: 6,
  },
  tabBarShowLabel: false, // 👈 fuerza sin labels para todos

  tabBarIcon: ({ focused, color, size }: { focused: boolean; color: string; size: number }) => {
    if (routeName === 'NewsList') {
      return renderIcon(require('../../assets/iconos/noticias.png'), focused);
    }
    if (routeName === 'YouTubeChannel') {
      return renderIcon(require('../../assets/iconos/videos-logo.png'), focused);
    }
    if (routeName === 'SergioPalazzoInterviews') {
      return (
        <Ionicons
          name={(focused ? 'mic' : 'mic-outline') as keyof typeof Ionicons.glyphMap}
          size={size}
          color={color}
        />
      );
    }
    if (routeName === 'Afiliate') {
      return renderIcon(require('../../assets/iconos/afiliate-bancaria.png'), focused);
    }
    if (routeName === 'Benefits') {
      return renderIcon(require('../../assets/iconos/beneficios.png'), focused);
    }
    if (routeName === 'Contact') {
      return renderIcon(require('../../assets/iconos/contacto.png'), focused);
    }

    // resto usa Ionicons
    return (
      <Ionicons
        name={iconForRoute(routeName) as keyof typeof Ionicons.glyphMap}
        size={size}
        color={color}
      />
    );
  },

  ...((routeName === 'YouTubeChannel' || routeName === 'SergioPalazzoInterviews') && {
    tabBarItemStyle: youtubeTabItemStyle,
  }),

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
