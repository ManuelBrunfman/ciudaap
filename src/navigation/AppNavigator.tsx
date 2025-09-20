// src/navigation/AppNavigator.tsx

import React, { useMemo } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import TabNavigator from './TabNavigator';
import BenefitDetailScreen from '../screens/benefits/BenefitDetailScreen';
import NewsDetailScreen from '../screens/news/NewsDetailScreen';
import YouTubeVideoScreen from '../screens/videos/YouTubeVideoScreen';
import ForceLogoutScreen from '../screens/ForceLogoutScreen';
import AppText from '../ui/AppText';
import { useTheme, type AppTheme } from '../theme';
import { RootStackParamList } from '../types/RootStackParamList';

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  const t = useTheme();
  const styles = useMemo(() => createStyles(t), [t]);

  try {
    return (
      <Stack.Navigator
        screenOptions={{
          headerTransparent: true,
          headerTintColor: t.colors.onPrimary,
          headerTitleStyle: { color: t.colors.onPrimary, fontWeight: '600' },
          headerShadowVisible: false,
          // React Navigation v7 (@react-navigation/stack) uses `cardStyle` instead of `contentStyle`
          cardStyle: { backgroundColor: 'transparent' },
          headerBackground: () => (
            <LinearGradient
              colors={[t.colors.overlayStrong, 'transparent']}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          ),
        }}
      >
        <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="BenefitDetail" component={BenefitDetailScreen} options={{ title: 'Beneficio' }} />
        <Stack.Screen name="NewsDetail" component={NewsDetailScreen} options={{ title: 'Noticia' }} />
        <Stack.Screen name="YouTubeVideo" component={YouTubeVideoScreen} options={{ title: 'Video' }} />
        <Stack.Screen name="ForceLogout" component={ForceLogoutScreen} options={{ title: 'Cerrar sesión' }} />
      </Stack.Navigator>
    );
  } catch (error: any) {
    console.error('Error en AppNavigator:', error);
    return (
      <View style={styles.center}>
        <AppText variant="subtitle" color={t.colors.danger} style={styles.centerText}>
          Ocurrió un error en la navegación principal.
        </AppText>
      </View>
    );
  }
};

export default AppNavigator;

const createStyles = (t: AppTheme) =>
  StyleSheet.create({
    center: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: t.spacing.md,
      backgroundColor: t.colors.background,
    },
    centerText: {
      textAlign: 'center',
    },
  });
