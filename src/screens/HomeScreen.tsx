import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AppText from '../ui/AppText';
import { useTheme } from '../theme';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

export default function HomeScreen() {
  const t = useTheme();
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: 'transparent' }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText style={[styles.title, { color: t.colors.onBackground }]}>Bienvenido a Ciudapp Gremial</AppText>
        <AppText style={[styles.subtitle, { color: t.colors.muted }]}>Información Relevante</AppText>
        <AppText style={[styles.info, { color: t.colors.onBackground }]}>Aquí puedes mostrar la información más relevante de la aplicación, noticias, estadísticas o cualquier dato importante que desees destacar para el usuario.</AppText>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: spacing.lg, alignItems: 'center', justifyContent: 'center' },
  title: { ...typography.heading1, marginBottom: spacing.sm },
  subtitle: { ...typography.subtitle, marginBottom: spacing.md },
  info: { ...typography.body, textAlign: 'center' },
});

