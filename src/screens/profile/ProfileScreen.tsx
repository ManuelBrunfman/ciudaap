// src/screens/profile/ProfileScreen.tsx

import React, { useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/RootStackParamList';
import AppButton from '../../ui/AppButton';
import { useTheme, type AppTheme } from '../../theme';

type ProfileScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Profile'>;

export default function ProfileScreen() {
  const navigation = useNavigation<ProfileScreenNavigationProp>();
  const t = useTheme();
  const styles = useMemo(() => createStyles(t), [t]);

  return (
    <View style={styles.container}>
      <AppButton title="Cerrar sesión" onPress={() => navigation.navigate('ForceLogout')} variant="outline" />
    </View>
  );
}

const createStyles = (t: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: t.spacing.md,
      backgroundColor: 'transparent',
    },
  });
