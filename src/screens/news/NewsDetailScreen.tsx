// src/screens/news/NewsDetailScreen.tsx

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  StyleSheet,
  Image,
  Button,
  Linking,
} from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ✅ IMPORT CORRECTO DEL TIPO DE NAVIGATOR
// Si moviste el tipo a 'src/types/RootStackParamList.ts':
import type { RootStackParamList } from '../../types/RootStackParamList';
// Si preferís dejarlo en navigation:
// import type { RootStackParamList } from '../../navigation/RootStackParamList';

import type { NativeStackScreenProps } from '@react-navigation/native-stack';

type Props = NativeStackScreenProps<RootStackParamList, 'NewsDetail'>;

const NewsDetailScreen: React.FC<Props> = ({ route }) => {
  const insets = useSafeAreaInsets();

  // Validación para asegurarnos de que se haya recibido el parámetro newsItem
  if (!route.params || !route.params.newsItem) {
    return (
      <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.errorText}>
            No se encontró la noticia. Por favor, regresa e intenta nuevamente.
          </Text>
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
    <SafeAreaView style={[styles.container, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>{newsItem.title}</Text>
        {newsItem.img && (
          <Image source={{ uri: newsItem.img }} style={styles.image} />
        )}
        <Text style={styles.content}>{newsItem.content}</Text>
        <Button title="Leer la noticia completa" onPress={handleOpenUrl} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default NewsDetailScreen;

// Estilos base
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginVertical: 20,
  },
});
