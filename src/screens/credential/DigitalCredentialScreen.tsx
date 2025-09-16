// src/screens/credential/DigitalCredentialScreen.tsx
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import AppText from '../../ui/AppText';

const { width } = Dimensions.get('window');

const DigitalCredentialScreen: React.FC = () => {
  const { user } = useAuth();
  const t = useTheme();

  if (!user) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: t.colors.background }]}>
        <AppText style={{ color: t.colors.muted }}>No hay usuario autenticado</AppText>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: t.colors.background }]}>
      <ImageBackground source={require('../../../assets/credencial-bg.png')} style={styles.cardBackground} resizeMode="contain">
        <View style={styles.overlay}>
          <View style={styles.textContainer}>
            <AppText style={[styles.infoText, { color: t.colors.onPrimary }]}>Email: {user.email}</AppText>
            <AppText style={[styles.infoText, { color: t.colors.onPrimary }]}>Nombre: {user.displayName ?? 'Sin nombre'}</AppText>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default DigitalCredentialScreen;

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.md },
  cardBackground: { width: width - spacing.lg * 2, height: 300, borderRadius: 12, overflow: 'hidden' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' },
  textContainer: {},
  infoText: { fontSize: 20, fontWeight: 'bold', marginVertical: spacing.xs, textAlign: 'center' },
});

