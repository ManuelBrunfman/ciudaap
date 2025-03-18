// src/screens/news/NewsListScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { firestore } from '../../../config/firebaseConfig';
import { RootStackParamList, NewsItem } from '../../navigation/AppNavigator';

type NewsListScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Main'
>;

const NewsListScreen: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const navigation = useNavigation<NewsListScreenNavigationProp>();

  useEffect(() => {
    const q = query(collection(firestore, 'news'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<NewsItem, 'id'>),
        }));
        setNews(data);
        setLoading(false);
      },
      (error) => {
        console.error('Error al obtener noticias:', error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const handlePress = (item: NewsItem) => {
    navigation.navigate('NewsDetail', { newsItem: item });
  };

  const formatDate = (date: any): string => {
    if (!date) return '';
    if (date.toDate) {
      return date.toDate().toLocaleString();
    }
    return new Date(date).toLocaleString();
  };

  const renderItem = ({ item }: { item: NewsItem }) => (
    <Pressable style={styles.card} onPress={() => handlePress(item)}>
      {item.img && (
        <Image
          source={{ uri: item.img }}
          style={styles.image}
          resizeMode="cover"
        />
      )}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
      </View>
    </Pressable>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E86C1" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <FlatList
        data={news}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9F9',
    // Se agrega padding para separar el contenido de la barra de estado
    paddingTop: 16,
  },
  listContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // También se le agrega un poco de padding para evitar que la barra de estado lo solape
    paddingTop: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  image: {
    width: '100%',
    height: 180,
  },
  textContainer: {
    padding: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#2D3436',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
});

export default NewsListScreen;
