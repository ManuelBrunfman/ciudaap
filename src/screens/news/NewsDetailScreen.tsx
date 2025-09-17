// src/screens/news/NewsDetailScreen.tsx

import React, { useMemo } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Image, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { RootStackParamList } from '../../types/RootStackParamList';
import type { StackScreenProps } from '@react-navigation/stack';
import AppText from '../../ui/AppText';
import AppButton from '../../ui/AppButton';
import { useTheme, type AppTheme } from '../../theme';

type Props = StackScreenProps<RootStackParamList, 'NewsDetail'>;

const NewsDetailScreen: React.FC<Props> = ({ route }) => {
  const insets = useSafeAreaInsets();
  const t = useTheme();
  const styles = useMemo(() => createStyles(t, insets.top, insets.bottom), [t, insets.bottom, insets.top]);

  if (!route.params || !route.params.newsItem) {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <AppText variant="subtitle" color={t.colors.danger} style={styles.errorText}>
            No se encontró la noticia. Por favor, regresa e intenta nuevamente.
          </AppText>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const { newsItem } = route.params;

  const handleOpenUrl = () => {
    if (newsItem.link) {
      Linking.openURL(newsItem.link).catch(err => console.error('Error al abrir la URL', err));
    } else {
      console.warn('No se proporcionó URL para esta noticia');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <AppText variant="heading2" color={t.colors.onBackground} style={styles.title}>
          {newsItem.title}
        </AppText>
        {newsItem.img ? (
          <Image source={{ uri: newsItem.img }} style={styles.image} resizeMode="cover" />
        ) : null}
        <AppText variant="body" color={t.colors.onBackground} style={styles.content}>
          {newsItem.content}
        </AppText>
        <AppButton title="Leer la noticia completa" onPress={handleOpenUrl} style={styles.cta} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewsDetailScreen;

const createStyles = (t: AppTheme, paddingTop: number, paddingBottom: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'transparent',
      paddingTop,
      paddingBottom,
    },
    scrollContainer: {
      paddingHorizontal: t.spacing.md,
      paddingBottom: t.spacing.lg,
    },
    title: {
      marginVertical: t.spacing.sm,
    },
    image: {
      width: '100%',
      height: 200,
      borderRadius: t.radius.l,
      marginBottom: t.spacing.sm,
    },
    content: {
      marginBottom: t.spacing.md,
    },
    cta: {
      marginTop: t.spacing.md,
    },
    errorText: {
      textAlign: 'center',
      marginVertical: t.spacing.lg,
    },
  });
