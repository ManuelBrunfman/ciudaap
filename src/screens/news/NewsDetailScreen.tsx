// src/screens/news/NewsDetailScreen.tsx

import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Image, Linking } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ✅ IMPORT CORRECTO DEL TIPO DE NAVIGATOR
// Si moviste el tipo a 'src/types/RootStackParamList.ts':
import type { RootStackParamList } from '../../types/RootStackParamList';
// Si preferís dejarlo en navigation:
// import type { RootStackParamList } from '../../navigation/RootStackParamList';

import type { StackScreenProps } from '@react-navigation/stack';
import AppText from '../../ui/AppText';
import { useTheme } from '../../theme';
import { spacing } from '../../theme/spacing';
import AppButton from '../../ui/AppButton';

type Props = StackScreenProps<RootStackParamList, 'NewsDetail'>;

const NewsDetailScreen: React.FC<Props> = ({ route }) => {
  const insets = useSafeAreaInsets();
  const t = useTheme();

  // Validación para asegurarnos de que se haya recibido el parámetro newsItem
  if (!route.params || !route.params.newsItem) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: t.colors.background }]}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <AppText style={[styles.errorText, { color: t.colors.danger }]}>No se encontró la noticia. Por favor, regresa e intenta nuevamente.</AppText>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const { newsItem } = route.params;

  const handleOpenUrl = () => {
    if (newsItem.link) {
      Linking.openURL(newsItem.link).catch((err) =>
        console.error('Error al abrir la URL', err)
      );
    } else {
      console.warn('No se proporcionó URL para esta noticia');
    }
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom, backgroundColor: t.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <AppText variant="heading2" style={[styles.title, { color: t.colors.onBackground }]}>{newsItem.title}</AppText>
        {newsItem.img && (
          <Image source={{ uri: newsItem.img }} style={styles.image} />
        )}
        <AppText style={[styles.content, { color: t.colors.onBackground }]}>{newsItem.content}</AppText>
        <AppButton title="Leer la noticia completa" onPress={handleOpenUrl} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewsDetailScreen;

// Estilos base
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: spacing.sm,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: spacing.sm,
  },
  content: {
    fontSize: 16,
    marginBottom: spacing.md,
  },
  errorText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: spacing.lg,
  },
});
